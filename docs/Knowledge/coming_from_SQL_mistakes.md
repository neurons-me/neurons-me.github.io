# Repository findings

**Components inspected (this pass, building on the prior article's kernel research):** `src/utils.ts` (filter/selector/range grammar), `src/operators.ts` (`createDefaultOperators` in `utils.ts` confirms the canonical operator set including `=`), `src/core-read.ts` (`collectChildrenForPrefix`, `evaluateFilterPath`, `evaluateLogicalFilterForScope` — the mechanism behind bracket-filter reads), `tests/Demos/ShopsExample.ts`, `tests/Demos/Social_Graph.ts`, `tests/me-uri.test.ts` + `src/me-uri.ts` (namespace/handle grammar), and — as supporting evidence for the API section only — `modules/monad/Typescript/src/http/pathResolver.ts`, which sits in the same monorepo directly above the `.me` kernel.

**SQL assumptions that clearly do not apply, with the evidence:**
- *Tables define structure ahead of write.* `me.shops[1].name(...)` in `ShopsExample.ts` creates the path on first write; there is no DDL step anywhere in the kernel (`src/core-write.ts: postulate` just walks recognizers and falls through to a plain value commit).
- *Joins are how you relate two collections.* `friends.ana["->"]("users.ana")` (pointer, axiom A4) plus bracket-filter reads like `me("friends[isAdult == true].name")` are resolved by `evaluateFilterPath`/`collectChildrenForPrefix` in `core-read.ts` — an ancestor/child path walk plus per-child predicate evaluation, not a join between two relations.
- *An ID is something you assign (autoincrement/UUID).* `identityHash = keccak256("this.me/identity:v1::" + seed)` is derived; `me["@"](...)` records a *claim*, verified in `tests/axioms.test.ts` (A1) and `tests/reconstruction.test.ts`.
- *Visibility is a GRANT/ACL check against a schema object.* Verified structural: secret-scope roots are excluded from the write-time index (`core-index.ts: applyMemoryToIndex`) and re-blocked at read time by ancestor walk (`core-read.ts: hasStealthBarrier`), independent of any permission table.
- *NULL unambiguously means "no data."* This is the one place I found a genuine, code-verified **caution in the opposite direction of the obvious claim**: at the raw kernel layer, a stealth-blocked read and a never-written read both return the same JS `undefined` (confirmed by reading `me.ts: readPath` / `core-read.ts`, and by axiom A0's own assertion `me("wallet") === undefined`). The kernel itself does not hand back a distinguishing sentinel. The three-way distinction (public / closed / genuinely-not-found) is made explicit one layer up, in `modules/monad/Typescript/src/http/pathResolver.ts`, not inside `.me` itself. I present this precisely, not as "`.me` solves NULL," but as "`.me`'s `undefined` is more overloaded than SQL's `NULL`, and disambiguating it requires different tools."

**Examples selected:** `ShopsExample.ts` (collections, computed "columns" across a set, filtering) and `Social_Graph.ts` (identity, pointers-as-relations, private "columns") because both are small, runnable, and directly analogous to a relational schema a SQL developer would actually design (shops+menu, users+friends) — making the contrast legible rather than abstract. Axioms A0/A1/A4/A8/A9 for the visibility/identity/mutation claims, since they are executable proofs, not prose. `pathResolver.ts` for the API section, clearly scoped as "the layer built on `.me`," not `.me` itself.

**Claims intentionally omitted:** I did not claim `.me`'s bracket-filter reads (`shops[menu.isPremium == true].name`) constitute a query optimizer or planner — `core-read.ts` shows this is a linear scan over `collectChildrenForPrefix` results with per-child predicate evaluation; there is no cost-based planning, and I say so. I did not claim ACID transaction semantics — there is no multi-path transaction/rollback construct in the kernel I could find, only per-write hash-chained commits and deterministic LWW conflict resolution (A9); I do not use the word "transaction." I did not claim `.me` replaces SQL for reporting/aggregation workloads — nothing in the repository suggests aggregate functions (`SUM`, `GROUP BY`) exist as primitives, and I say this explicitly rather than implying feature parity.

---

# Common Mistakes When Coming from SQL

*Second article in the "Thinking in .me" series.*

SQL is one of the most successful engineering ideas in computing history — a declarative model over sets, backed by decades of query optimization, that made relational data manageable at a scale nothing before it could touch. Nothing in this article argues otherwise. What it argues is narrower: that a working mental model of SQL, applied unmodified to [`neurons-me/.me`](https://github.com/neurons-me/.me), produces confusion — not because `.me` is more advanced, but because it is answering a different question. SQL asks "how do I query a set of tuples efficiently." `.me` asks "how do I resolve meaning at a path, for a given observer, right now." Those are different problems, and the intuitions that make you excellent at the first one will actively mislead you on the second, until you notice which ones to set down.

## Why SQL developers struggle at first

A SQL developer's instincts are trained on a specific set of guarantees: structure is declared before data exists (`CREATE TABLE`), identity is a column you control (`PRIMARY KEY`), relationships are expressed through shared keys resolved at query time (`JOIN`), and access control is a layer you check against a schema object (`GRANT`). Every one of these is a *reasonable* generalization from years of production experience. But `.me` has no `CREATE TABLE` step, no primary-key column, no `JOIN` clause, and its access model runs inside the write and read paths of the kernel rather than beside them. If you go looking for the SQL-shaped version of these things, you will either not find them, or you will find something that looks superficially similar and behaves differently enough to bite you later.

## SQL intuitions that still help

Not everything needs to be unlearned. Three habits transfer cleanly:

- **Thinking in sets and predicates.** `.me`'s bracket-filter reads — `me("shops[menu.isPremium == true].name")` in [`tests/Demos/ShopsExample.ts`](https://github.com/neurons-me/.me/blob/main/Typescript/tests/Demos/ShopsExample.ts) — are a predicate over a collection, evaluated by `evaluateLogicalFilterForScope` in [`src/core-read.ts`](https://github.com/neurons-me/.me/blob/main/Typescript/src/core-read.ts). The instinct "filter a set by a condition" is exactly right; only the mechanism differs.
- **Caring about determinism under concurrent writes.** SQL developers already think carefully about isolation levels and write ordering. `.me` has an analogous, if much simpler, concern: axiom **A9** in [`tests/axioms.test.ts`](https://github.com/neurons-me/.me/blob/main/Typescript/tests/axioms.test.ts) proves that colliding writes to the same path resolve by a fixed rule — `(timestamp asc, hash asc)` — so the instinct to ask "what happens when two writers hit the same thing" is the right instinct to bring.
- **Wanting an explain plan.** The instinct to run `EXPLAIN` before trusting a query is exactly the instinct that makes `me.explain(path)` (`src/derivation.ts`) useful on day one — it's a different mechanism (tracing a dependency graph, not a query plan) but the same discipline: don't trust a result you can't inspect.

## The mental models that must change

Everything below follows from one structural fact: **`.me` has no separate schema layer, no separate query planner, and no separate ACL layer** — those concerns are folded into the same runtime that stores the value, at the path where the value lives (`src/core-write.ts`, `src/core-read.ts`, `src/secret-context.ts`). SQL keeps these concerns in different subsystems (DDL, the optimizer, `GRANT`/`REVOKE`) precisely because they need to serve many different, ad-hoc queries over the same stored shape. `.me` doesn't have that requirement — the mental model to adopt is not "less structure," it's "structure and access rules travel with the path itself, decided at write time and enforced at read time, rather than declared once centrally and interpreted many times."

## The 10 most common mistakes

### 1. Looking for tables

**Why the instinct exists:** in SQL, a table is the unit of everything — storage, typing, indexing, permissions.

**Where it breaks:** there is no table object anywhere in the kernel. `ShopsExample.ts` opens with:

```ts
me.shops[1].name("Downtown");
me.shops[1].menu.latte(4.5);
me.shops[2].name("Riverside");
```

`shops` was never declared as a collection type. `1` and `2` are just path segments a write happened to use.

**Native model:** a "table-shaped" collection in `.me` is just a family of sibling paths under a common prefix. The kernel finds its members by scanning for children of that prefix (`collectChildrenForPrefix` in `core-read.ts`), not by looking up a registered relation.

### 2. Looking for rows and columns

**Why the instinct exists:** rows are the unit of identity within a table; columns are the fixed set of fields every row has.

**Where it breaks:** nothing enforces that `shops[1]` and `shops[2]` have the same shape. In the same demo, `shops[1]` later gets an entire private subtree (`shops[1].ops`) that `shops[2]` never has:

```ts
me.shops[1].ops["_"]("downtown-ops-key");
me.shops[1].ops.beansKg(3);
```

There is no ALTER TABLE moment where this became legal for row 1 — it was just a write.

**Native model:** what SQL calls a "row" is better thought of as a subspace (`shops.1`), and what SQL calls a "column" is a leaf path under it. Shape is a per-instance fact, not a table-wide contract.

### 3. Expecting schemas to define structure

**Why the instinct exists:** DDL is where a SQL developer resolves ambiguity about what fields can exist, before any data is written.

**Where it breaks:** `postulate()` in [`src/core-write.ts`](https://github.com/neurons-me/.me/blob/main/Typescript/src/core-write.ts) accepts a write at any path with no prior declaration step; the only "definitions" the kernel recognizes are operator definitions (`me["+"]("op", "kind")`, handled by `isDefineOpCall`), which extend the *grammar*, not a data shape.

**Native model:** structure is discovered by reading what was written (`me.inspect()`), not declared before writing happens. This is a real trade-off, not a pure improvement: SQL's schema-first approach buys you validation and tooling that `.me` does not provide at the kernel layer.

### 4. Thinking joins are the primary way to relate information

**Why the instinct exists:** in a normalized relational schema, relationships are foreign keys, and retrieving related data means a `JOIN` at query time.

**Where it breaks:** `Social_Graph.ts` relates users through structural pointers, resolved automatically on read:

```ts
me.friends.ana["->"]("users.ana");
me.friends.pablo["->"]("users.pablo");
...
show("friends.ana.name", me("friends.ana.name"));
show("friends.ana.ageGapVsOwner", me("friends.ana.ageGapVsOwner"));
```

`friends.ana` is `{ __ptr: "users.ana" }` — inspectable as data on a direct read (axiom **A4**) — and transparently dereferenced the moment you read past it. There is no join clause; `resolveIndexPointerPath` in [`src/core-index.ts`](https://github.com/neurons-me/.me/blob/main/Typescript/src/core-index.ts) walks the pointer chain for you.

Filtering across that relationship uses the same bracket-selector grammar as any other collection:

```ts
show("friends[isAdult == true].name", me("friends[isAdult == true].name"));
// { ana: "Ana", luisa: "Luisa" }
```

**Native model:** relating two things is an act of *reference* (a pointer written once, at declaration time), not an act of *computation* (a join written every time you query). The cost of "joining" is paid once, at write time, by however many pointers you actually created — not at read time by a planner scanning two tables. This is also a real trade-off: SQL's join can relate data no one anticipated at write time; `.me`'s pointer can only follow a relationship someone already declared.

### 5. Treating identity as an assigned ID

**Why the instinct exists:** `PRIMARY KEY` and `AUTO_INCREMENT`/`UUID()` are how SQL developers manufacture identity — a value the system hands out and you store.

**Where it breaks:** `.me`'s root identity is not assigned by the kernel; it is *derived* from a seed you supply:

```ts
identityHash = keccak256("this.me/identity:v1::" + seed)
```

`tests/reconstruction.test.ts` proves this is a pure function — same seed, any device, any time, same `identityHash`, independent of what was ever written into the kernel:

```ts
const me1 = new (ME as any)(seed);
me1.profile.name("José Abella");
const hash1 = getIdentity(me1).hash;
me1 = null;

const me2 = new (ME as any)(seed);
const hash2 = getIdentity(me2).hash;
assertEqual(hash1, hash2, "reconstructed identity must match original");
```

Separately, `me["@"]("jabellae")` is not an identity assignment either — it's a normalized *claim*, recorded as an ordinary memory with operator `"@"` (axiom **A1**), validated against a DNS-like label grammar before it's accepted.

**Native model:** identity can be math you can redo, not a row a database handed you once. There is nothing in this repository resembling an autoincrement counter.

### 6. Assuming visibility is handled by ACLs

**Why the instinct exists:** `GRANT SELECT ON table TO role` is a permission check layered on top of a schema object, evaluated at query time against the caller's role.

**Where it breaks:** in `.me`, a secret scope changes how the subtree is *stored* (chunked and encrypted, `src/secret.ts`) and how the public `index` is *built* (the prefix is excluded at write time, `applyMemoryToIndex` in `core-index.ts`) — there is no separate permission table consulted afterward. `ShopsExample.ts` shows the asymmetry directly:

```ts
me.shops[1].ops["_"]("downtown-ops-key");
me.shops[1].ops.beansKg(3);
me.shops[1].ops["="]("needsRestock", "beansKg < 4");

assert.equal(me("shops[1].ops"), undefined);              // owner: root hidden
assert.equal(me("shops[1].ops.needsRestock"), true);       // owner: leaf readable
assert.equal(me.as(null)("shops[1].ops.needsRestock"), undefined); // guest: blocked
```

`me.as(null)` sets a caller scope (`src/me.ts: as()`/`withScope()`), and `hasStealthBarrier` in `core-read.ts` walks every ancestor of the path against that scope before returning anything — for a guest, the leaf is blocked too, not just the root.

**Native model:** visibility is a property of the *path*, checked as part of resolving it, not a separate authorization query run before or after the data query.

### 7. Expecting context to live in application code

**Why the instinct exists:** in a typical SQL-backed application, "context" (who's asking, what environment, what tenant) is a variable in your application layer, injected into a `WHERE` clause by hand.

**Where it breaks:** in `Social_Graph.ts`, a derived value reads context directly from another part of the graph, not from a parameter passed in by application code:

```ts
me.users["[i]"]["="]("ageGapVsOwner", "age - profile.age");
```

`profile.age` here is the graph's own root-profile fact, read as an ordinary reference inside the formula — not injected by a caller. When `me.profile.age` changes, every `ageGapVsOwner` derivation depending on it becomes eligible to recompute, the same way any other dependency does (`src/derivation.ts: refSubscribers`).

**Native model:** context is a space like any other (`contexts.hospital` in the Robots demo; `profile` here), read the same way anything else is read, and wired into derivations the same way any dependency is. It is not smuggled in through function parameters.

### 8. Treating paths as storage locations instead of semantic spaces

**Why the instinct exists:** a SQL `column` address (`table.row.column`, effectively) is just where a value sits — reading it has no side effects and no ambiguity.

**Where it breaks:** reading a `.me` path can trigger pointer resolution, stealth-scope gating, and — if the recompute mode is lazy — derivation freshness checks, all before a value comes back (`readPath` in `src/me.ts`, `Core.readPath` in `src/core.ts`). The same string, `shops[1].menu.breakfastDeal`, resolves differently depending on whether `breakfastDeal` is still fresh relative to its inputs.

**Native model:** a path names a *region of meaning* (`typedocs/Algebra-of-Contexts.md`: "a space is a region of meaning that can contain other spaces"), and resolving it is an act of computation and permission-checking, not a memory address lookup.

### 9. Expecting APIs to expose resources instead of resolving spaces

**Why the instinct exists:** REST conventions map each table (or aggregate) to a resource endpoint — `GET /shops/1` returns "the shop," typically as a 200 with the row or a 404 if the primary key doesn't exist.

**Where it breaks:** this isn't inside `.me` itself, but the layer built directly on it in this monorepo shows the difference plainly. [`modules/monad/Typescript/src/http/pathResolver.ts`](https://github.com/neurons-me/.me) turns an HTTP path straight into a dot-path and resolves it against the kernel:

```ts
const resolved = await resolveNamespacePathValue(namespace, dotPath);

if (resolved._classification === "not_found") {
  return res.status(404).json(createErrorEnvelope(target, { error: "PATH_NOT_FOUND" }));
}

const disclosureContent = toDisclosureContent(resolved._classification); // "public" | "closed"
return res.json(createEnvelope(target, {
  namespace: resolved.namespace,
  path: resolved.path,
  value: resolved.found ? resolved.value : null,
  disclosure: disclosureContent,
}));
```

There is no `/shops/1` resource route. There is one handler that resolves *any* dot-path, and the response always carries a `disclosure` field (`public` or `closed`) instead of relying purely on HTTP status semantics the way a REST resource would.

**Native model:** an API surface over `.me` resolves an arbitrary semantic path, the same primitive the kernel already exposes internally — it does not enumerate a fixed set of resource endpoints.

### 10. Assuming absence simply means NULL or missing data

**Why the instinct exists:** SQL's `NULL` is one well-understood signal — the cell is empty. `IS NULL` is unambiguous.

**Where it breaks — and this is worth being precise about, because the obvious take is wrong in the *opposite* direction:** `.me`'s `undefined` is actually *more* overloaded than SQL's `NULL`, not less. At the raw kernel layer, a genuinely-never-written path and a structurally-blocked secret root return the exact same JavaScript `undefined`. Axiom **A0** in `axioms.test.ts` asserts this directly:

```ts
me.wallet["_"]("secret");
me.wallet.income(100);

console.log(me("wallet"));        // undefined  — this path exists and has children
console.log(me("wallet.income")); // 100
```

`me("wallet")` is `undefined` not because nothing is there, but because you're standing at a stealth-scope root. If you instead read a path that was truly never written, you get the same `undefined`, from the same call shape, with no distinguishing marker in the return value. The disambiguation only becomes explicit one layer up — in `pathResolver.ts`'s three-way `_classification: "public" | "closed" | "not_found"`, built by checking `isPathNearSecretScope` in addition to the resolved value.

**Native model:** don't treat `.me`'s `undefined` as a single unambiguous signal the way SQL's `NULL` is. If you need to know *why* a path resolved to `undefined` — never written vs. structurally hidden from you — reach for `inspect()`, `explain()`, or an explicit disclosure layer, not the bare read.

## Real examples from the repository

Two demos carry almost the entire argument above in runnable form: [`tests/Demos/ShopsExample.ts`](https://github.com/neurons-me/.me/blob/main/Typescript/tests/Demos/ShopsExample.ts) (a "table" that would obviously be `shops` + `menu_items` in SQL, here built as sibling paths with a formula declared once across all of them via `me.shops["[i]"].menu["="]("breakfastDeal", "latte + espresso - 1.5")`, and a private `ops` subtree bolted onto exactly one instance) and [`tests/Demos/Social_Graph.ts`](https://github.com/neurons-me/.me/blob/main/Typescript/tests/Demos/Social_Graph.ts) (a "many-to-many" friends relationship that would need a join table in SQL, here built with plain structural pointers). Both are worth running directly — `node tests/Demos/ShopsExample.ts` and `node tests/Demos/Social_Graph.ts` — because the printed `explain()` traces make the dependency graph visible, the same way `EXPLAIN` makes a query plan visible, just for a different kind of engine.

## A practical checklist for SQL developers

Before reaching for a SQL-shaped solution in `.me`, ask:

- Am I about to design a table? Stop — write the fact at the path it naturally belongs to instead.
- Am I about to define a foreign key? Consider a pointer (`->`) instead, and accept that it must be declared, not inferred at query time.
- Am I about to write a permission check? Check whether a secret scope (`_`) at the right path already makes the check unnecessary.
- Am I passing "current user" or "current context" as a parameter? Consider whether it should be a space in the graph instead, referenced the same way anything else is.
- Did I get `undefined` back? Don't assume you know why — check `inspect()` or `explain()` before concluding the data doesn't exist.
- Am I about to `UPDATE`? Remember the underlying operation is an append to a hash-chained log (`axioms.test.ts` A8/A9); the value you see is a deterministic projection, not a cell being overwritten in place.
- Do I need `GROUP BY`/`SUM`/multi-row aggregation? Nothing in this repository's operator set (`_ ~ __ -> @ = ? -`, `src/utils.ts: createDefaultOperators`) implements aggregate functions — this is a real gap relative to SQL, not something to work around by force-fitting a derivation.

## Conclusion

None of the ten mistakes above are failures of intelligence — they're the predictable result of applying a correct, battle-tested model to a system built on different foundations. SQL centralizes schema, query planning, and access control because it needs to serve arbitrary, unanticipated queries over normalized data at scale — and it does that extraordinarily well. `.me`, as implemented in this repository, folds structure, relation, and visibility into the path itself, resolved at read time by the same small set of primitives every time (`_ ~ __/-> @ = ? -`, described in `docs/Primitives.md` and enforced in `src/operators.ts`). Neither approach is strictly more powerful; they optimize for different things. The practical skill this article is trying to build is narrower than "know `.me`": it's *knowing which of your SQL reflexes to keep, and which ones to consciously set down* before you write the first path.

---

## Checklist for SQL Developers

1. Don't look for `CREATE TABLE` — write the fact at its path; structure is discovered, not declared.
2. Don't expect uniform rows — sibling paths under a prefix can have different shapes, and that's allowed.
3. Don't reach for `JOIN` — reach for a pointer (`->`), declared once, resolved automatically on read.
4. Don't expect an assigned primary key — identity can be `keccak256(seed)`, a pure function you can rederive.
5. Don't look for `GRANT`/`REVOKE` — check whether a secret scope (`_`) at the right path already enforces the boundary structurally.
6. Don't smuggle "current context" through function parameters — model it as a space and reference it like anything else.
7. Don't treat a path as an address — treat it as a region of meaning that resolves through pointers, stealth checks, and possibly a live formula.
8. Don't expect one REST resource per collection — expect a path resolver, and check for an explicit disclosure/classification field instead of relying on status codes alone.
9. Don't treat `undefined` as a single unambiguous signal the way you'd treat SQL's `NULL` — it can mean "never written" or "structurally hidden," and the kernel doesn't tell them apart for you at the read call site.
10. Don't think of `UPDATE` as overwriting a cell — think of it as appending to a hash-chained log that a deterministic rule then projects into "the current value."
11. Don't expect `GROUP BY`/aggregate functions — they are not part of this operator set, and SQL remains the better tool for that class of problem.

---

Source code:
https://github.com/neurons-me/.me

Documentation:
https://neurons-me.github.io