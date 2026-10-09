This is the repository. Let me check its remote to confirm it matches `github.com/neurons-me/.me`, then explore in depth.

This is very helpful context. Let me dive into the kernel source, axioms, docs, and demos in depth.

Good, comprehensive layout. Let me read the core source files, axioms doc, and key docs in parallel.

Excellent material. Let me read the Algebra-of-Contexts doc and core source files (core.ts, operators.ts, derivation.ts, secret-context.ts) plus the actual test files and a demo file.

Now let's look at core.ts (read/write/postulate machinery), derivation.ts (recompute engine), secret-context.ts, and the actual test files.

# Repository findings

**Core abstractions discovered** (from source, not marketing copy):

- **A single callable+chainable proxy value (`me`)** — `new ME(seed)` returns a `Proxy` wrapping the kernel instance itself (`me.ts:332-372`). Every unknown property access returns a new proxy over an extended path (`proxy.ts: createProxy`); calling it dispatches to `postulate` (write) or `readPath` (read) via `handleCall.ts`. This is documented as axiom **A‑struct‑0**.
- **Two verbs, not many nouns**: *declare* (call a path with a value) and *resolve* (call a path without one) — `docs/Primitives.md`.
- **Spaces, not schemas** — `typedocs/Algebra-of-Contexts.md` models paths as nested sets (`space ⊇ subspace`), and this set-theoretic framing is consistent with how `resolveBranchScope`, `hasStealthBarrier`, and index-prefix logic actually walk paths ancestor-by-ancestor in `secret-context.ts` / `core-read.ts`.
- **An append-only, hash-chained memory log** (`KernelMemory`: `path, operator, expression, value, effectiveSecret, hash, prevHash, timestamp`) is the source of truth; the `index` is a derived, rebuildable projection (`core-index.ts: rebuildIndex`), ordered deterministically by `(timestamp asc, hash asc)` — axiom **A9**.
- **Structural secrecy**, not ACL-checked secrecy — a secret scope's root resolves to `undefined` and is excluded from the public `index` (axioms **A0/A2**, `core-write.ts: postulate`/`registerStealthScope`, `core-read.ts: hasStealthBarrier`). Reading is gated by *caller scope* (`me.as(scope)` / `withScope`), not by a permission table.
- **A reactive derivation graph, separate from the memory log** — `derivation.ts` maintains `refSubscribers`, `refVersions`, and a per-target `derivations` registry, supporting both eager and lazy recompute, with `explain()` returning `{ value, expr, dependsOn, k, recomputed, sourcePath }`.
- **Pointers as first-class data** (`{ __ptr: "path" }`) that auto-dereference only on *traversal*, not on direct read — axiom **A4**.
- **Identity as a pure function of a seed** — `identityHash = keccak256("this.me/identity:v1::" + seed)`; compound identity `keccak256("me.seed/compound:v1::" + who + "::" + secret)`. Verified deterministic, order-sensitive, and time/process-independent by `tests/reconstruction.test.ts`.
- **A `me://` namespace grammar** (`docs/me-uri.ts` doc, marked Draft v0.1) that is distinct from and layered above the in-process kernel's own tiny `self:`/`kernel:` executable-target dispatch (`core.ts: execute`, tested in `dsl.contract.test.mjs`).

**Most important files inspected**: `src/me.ts`, `src/proxy.ts`, `src/handleCall.ts`, `src/operators.ts`, `src/core.ts`, `src/core-read.ts`, `src/core-write.ts`, `src/core-index.ts`, `src/core-snapshot.ts`, `src/derivation.ts`, `src/secret-context.ts`; docs `Axioms.md`, `Primitives.md`, `Architecture.md`, `Seed.md`, `Algebra-of-Contexts.md`, `Robots-That-Understand-Context.md`, `Hemisphere-Scale.md`, `Extreme-Fan-Out.md`.

**Tests and demos used**: `tests/axioms.test.ts` (A‑struct‑0, A0–A9, A3b/A3c), `tests/reconstruction.test.ts`, `tests/contracts/dsl.contract.test.mjs`; demos `tests/Demos/WalletSplit.ts`, `Robots_Contexts.ts`, `Hemisphere_1M.ts`, `Root_Fanout_100k.ts`; benchmark `tests/Benchmarks/BASELINE-5-FINAL.md`.

**Ambiguities / inconsistencies found, and how I handled them:**

1. `docs/Primitives.md`'s operator table lists `@ _ ~ __/-> ? -` but **omits `=`** (the eval/derivation operator), even though `=` is the single most-used operator across every demo and is exercised by name in `axioms.test.ts` (A9) and `dsl.contract.test.mjs`. I treat `=` as a real primitive (confirmed in `operators.ts: isEvalCall`) and note the doc gap rather than silently "fixing" it.
2. By reading `core-snapshot.ts` (`hydrate` resets `self.derivations = {}` and never repopulates it) and `core-write.ts` (`replayMemories` re-applies `"="` memories via their already-computed **value**, not by re-registering a derivation), it appears that **snapshot/replay restores committed values with full hash-chain integrity, but does not restore the live reactive derivation graph** — formulas would need to be re-declared after rehydration for reactivity to resume. I could not find a test that exercises this directly (positively or negatively), so the article states this as a code-level observation, not a confirmed guarantee or confirmed gap.
3. The README's headline performance figures ("~62 microseconds per node," "0.256ms for 6-of-1,000,000") come from `Architecture.md`/README narrative text, not from the benchmark file I inspected. `tests/Benchmarks/BASELINE-5-FINAL.md` instead shows that **secret-scope reads/writes are measurably slower than public ones** (p95 read latency ~76–95x slower at moderate scale). I present the round headline numbers as documented architectural claims and separately report the measured secret-scope cost, rather than conflating the two.
4. The `me://` namespace/surface grammar doc is explicitly "Draft v0.1" and per the monorepo's `CLAUDE.md`, namespace *claiming* lives in `cleaker`/`monad`, not `.me` itself. I kept the article's `me://` discussion scoped to what `.me` itself implements (`self:`/`kernel:` targets via `execute()`).

**Claims I intentionally avoided**: any specific latency/throughput as a guarantee; any claim of distributed or multi-writer conflict resolution (only single-process deterministic LWW is implemented/tested); any claim that derivations persist across snapshot/replay; any characterization of `.me` as a database, framework, or reactive library.

---

# How to Think in .me

## Familiar intuitions that mislead

If you open `.me` for the first time and start typing, it will let you do something that feels illegal.

```ts
me.city.population = 700_000;
me.city.name = "Veracruz";
```

There was no schema migration. No `CREATE TABLE`. No model class, no serializer, no route. `city` did not exist a moment ago, and now it does, and it has two fields, and you never declared what a "city" is anywhere. If your instinct here is "okay, but where's the schema really," you're about to fight the system instead of using it. `.me` does not have a hidden schema waiting to be discovered. The absence of a schema *is* the design.

The same instinct misfires again a few lines later, in one of the repository's own demo scripts, [`tests/Demos/Robots_Contexts.ts`](https://github.com/neurons-me/.me/blob/main/Typescript/tests/Demos/Robots_Contexts.ts):

```ts
me.robots.nurse.target["->"]("objects.canister7");
me.robots.nurse.context["->"]("contexts.hospital");
me.robots.surgeon.target["->"]("objects.canister7");
me.robots.surgeon.context["->"]("contexts.operatingRoom");
```

A REST or OOP instinct reads this as "two robot records with foreign keys." But there is one canister, referenced structurally from two different context bindings, and the *meaning* of `canProceed` for each robot is computed fresh from whatever `target` and `context` currently resolve to. Nothing was duplicated. Nothing was joined at query time by you. The dependency was declared once and the kernel tracks it.

This article is about the actual mental model underneath both of these examples — not a mapping from SQL or REST concepts, but the native abstractions `.me` is built from, as implemented in [`neurons-me/.me`](https://github.com/neurons-me/.me).

## The conceptual starting point: spaces, not schemas

The project's own internal doc, `Algebra-of-Contexts.md`, states the starting point plainly:

> `.me` thinks in **spaces**. Not schemas. Not tables. Not object classes. A space is a region of meaning (context) that can contain other spaces. Everything else follows from set laws.

```
space ⊇ subspace ⊇ subspace ⊇ subspace
```

`profile` is a space. `profile.contact` is a subspace of it. `wallet.hidden` is a subspace of `wallet`. A path like `friends[age > 18]` is a *selected* subspace. The important move here is that a path is not a storage address — it is a **region of meaning**, and regions can be public, private, shared, encrypted, or replicated. Those are not different data types; they are different predicates over the same underlying notion of "space." This is why `.me` can put a public field and a structurally invisible field one line apart, in the same object, without contradiction — they're just two regions with different membership.

## The wrong way to think about .me

Before the native model, it's worth being explicit about the traps, because each one produces code that *runs* but silently misunderstands what happened.

**Thinking a path is a string key.** `me.wallet.income` is not `obj["wallet"]["income"]`. It participates in scope resolution (is there an ancestor secret scope?), pointer resolution (did some ancestor path get replaced by `{__ptr}`?), and derivation lookup (is this path a registered formula?) before it ever touches the flat `index`. Treating it as a plain object key means you'll be surprised the first time a pointer or a secret scope changes what a "simple" property read does.

**Thinking `_` is `private: true`.** Object-oriented privacy is a compile-time or convention-level annotation on a *field*. `_` in `.me` is an operation performed *at a path*, at runtime, that changes how that whole subtree is stored (chunked, encrypted) and how the public index is built (that prefix is excluded). It is not a flag you check; it is a boundary the storage and read layers actually respect.

**Thinking existence and visibility are the same thing.** `me("wallet")` returning `undefined` does not mean wallet doesn't exist. `me("wallet.income")` returning `100` in the very next line proves it does. This is axiom **A0** verbatim, and it is the single most common source of confusion for a newcomer who assumes `undefined` means "not found."

**Thinking a pointer is a foreign key you must join.** `me("profile.cards.primary")` returns `{ __ptr: "wallet" }` — a real, inspectable value. But `me("profile.cards.primary.income")` transparently resolves through it. Both are true at once; there is no "join step" you write.

**Thinking mutation is destructive.** A write is not "the old value is gone." It's a new memory appended to a hash-chained log, with a deterministic replacement rule when writes collide (more on this below).

## A native .me mental model

Once the traps are named, the native model is short enough to hold in your head:

- **`me` is one thing**: simultaneously a value, a function, and an infinitely extensible path. Nothing about `me.a.b.c` allocates a schema; it allocates a `Proxy`.
- **Calling a path with an argument declares meaning at that path. Calling it without one resolves meaning at that path.** That's the entire grammar — everything else (identity, secrecy, pointers, queries, derivation, deletion) is a *recognized shape* of that same declare/resolve act, dispatched by an operator token.
- **What you write is a fact, appended to history — not a cell you overwrite.** The visible current value is a *projection* of that history, rebuilt by a deterministic rule.
- **Visibility is a structural property of the region a path is in, not a permission check performed after the fact.**
- **A derived path is not a cached computation; it is a live subscription.** Changing an input recomputes exactly the derived paths that depend on it — nothing else.
- **Context is not metadata attached to a request. It is itself a space** (`contexts.hospital`), referenced the same way any other object is referenced, and read the same way any other object is read.

## The primitives: two verbs, a handful of operators

`docs/Primitives.md` is explicit that `.me` is small on purpose: one root value, two verbs, and a fixed set of operator tokens recognized structurally in `src/operators.ts`. The documented set is `@ _ ~ __/-> ? -`; reading the source and every demo, `=` (derivation) belongs in that list too — it is recognized by `isEvalCall` in `operators.ts` and is the operator that makes every "reactive" demo work, even though the current `Primitives.md` table doesn't list it. Treat the table as slightly stale, not as the ceiling of the language.

| Token | Name | What it structurally does |
|---|---|---|
| `@` | Identity | Normalizes and binds an identity claim: `me["@"]("jabellae")` |
| `_` | Secret scope | Marks a path as stealth-rooted; descendants are chunked and encrypted |
| `~` | Noise reset | Cuts secret-key derivation lineage at a boundary |
| `__` / `->` | Pointer | Stores `{__ptr: "path"}`; auto-dereferenced only on deeper traversal |
| `?` | Query | Runs a read/computation and records it as a memory event |
| `-` | Tombstone remove | Writes a `-` memory; the old cleartext no longer resolves |
| `=` | Derivation | Registers a live formula; recomputes when its inputs change |

Each of these is a *recognizer function* over `(path, expression)` — see `isSecretScopeCall`, `isPointerCall`, `isEvalCall` in `operators.ts` — not a special-cased keyword in a parser. The grammar is closed and small enough that `postulate()` in `core-write.ts` can try each recognizer in sequence and fall through to a plain value write if none match.

## A worked example, traced through the actual code

`tests/Demos/WalletSplit.ts` models three friends splitting a Vancouver trip:

```ts
me.wallets.vancouver.total(0);
me.wallets.vancouver["="]("per_person", "total / members.count");
me.wallets.vancouver.paid.jabellae(0);
me.wallets.vancouver["="]("balance_jabellae", "paid.jabellae - per_person");
```

`per_person` and `balance_jabellae` are not application code reacting to a change event you had to wire up. They are entries in the kernel's own `derivations` registry (`derivation.ts: registerDerivation`), each with an extracted list of referenced paths (`extractExpressionRefs`) and a reverse index (`refSubscribers`) mapping each referenced path back to the derived targets that depend on it.

```ts
me.wallets.vancouver.paid.jabellae(300);
me.wallets.vancouver.total(300);
```

Writing `paid.jabellae` calls `invalidateFromPath` (`derivation.ts`), which walks `refSubscribers["wallets.vancouver.paid.jabellae"]`, finds `balance_jabellae` subscribed, and calls `recomputeTarget` — which re-evaluates the expression and commits a *new* memory with operator `"="`. Nothing about `per_person` or `balance_ana` was touched, because nothing referenced `paid.jabellae` except `balance_jabellae`.

```ts
console.log(me.explain("wallets.vancouver.balance_jabellae"));
```

`explain()` (`derivation.ts`) doesn't return "the value." It returns the expression string, the resolved value of every input it referenced, and — if this read happened inside a recompute wave — `k` (how many nodes actually recomputed) and the ordered list of `recomputed` paths. This is not a debugging add-on bolted onto the kernel; `explain()` reads from the same `derivations` and `lastRecomputeWaveByTarget` structures the runtime uses to do the work in the first place. The trace is not a reconstruction after the fact — it's an inspection of the actual mechanism.

The same `k` metadata is what `tests/contracts/dsl.contract.test.mjs` asserts directly:

```ts
me.units[1].seed(1);
me.units[1]["="]("mid", "seed + 1");
me.units[1]["="]("out", "mid * 2");
me.units[1].seed(2);

const trace = me.explain("units.1.out");
assert.equal(trace.meta.k, 2);
assert.deepEqual(trace.meta.recomputed, ["units.1.mid", "units.1.out"]);
```

Two nodes recomputed because exactly two nodes depended, transitively, on `seed`. `docs/Hemisphere-Scale.md` demonstrates the same mechanism at a different scale: a million `geo[i].powerUp` facts, six real dependents wired across four domains, one write, `k: 6`. `docs/Extreme-Fan-Out.md` demonstrates the inverse — wire 100,000 dependents on one root and `k` is honestly 100,000, because that's how many things actually needed to change. The invariant tested and demonstrated is not "fast" in the abstract; it's *"the cost of a write is the number of things that actually depend on it, not the size of the graph."*

## How context changes resolution

`Robots_Contexts.ts` is the clearest evidence that context is not an afterthought layered on top of `.me` — it's an ordinary space, referenced the same way any object is:

```ts
me.robots["[i]"]["="](
  "canProceed",
  "canLift && softGripReady && !needsHumanReview && contextAllowsMotion",
);
```

`[i]` applies this single derivation across every current robot. Each robot's `context` pointer (`->`) resolves to a *different* `contexts.*` object, so the same formula, evaluated per-robot, reads different `context.sterileZone` or `context.movingVehicles` values depending on which context each robot points at. There is exactly one `canister7`. There are four different `canProceed` outcomes, because there are four different contexts in play — not because there are four different canisters.

There is a second, orthogonal notion of context in the kernel: **caller scope**. `me.as(scope)` and `withScope(scope, fn)` (`me.ts`) set `_currentCallerScope` for the duration of a read, and `isStealthBlocked`/`hasStealthBarrier` (`me.ts`, `core-read.ts`) check every ancestor of a path against that scope before returning a value. This is exercised directly in axiom **A3b**:

```ts
me.root["_"]("alpha");
me.root.child["_"]("beta");
me.root.child.leaf("x");

assert.equal(me("root.child.leaf"), "x");                    // default owner
assert.equal(me.as(null)("root.child.leaf"), undefined);     // guest
```

Same path, same underlying memory — a different resolved value depending on who's asking. This is the mechanism, not a metaphor: `readPath` in `me.ts` checks `isStealthBlocked` against `_currentCallerScope` before it ever calls into `Core.readPath`.

## Identity, visibility, references, and observation — how they interact

Identity in `.me` is a pure function, and the test suite treats it as a mathematical claim, not a UX detail. `tests/reconstruction.test.ts` runs the exact same seed through five independent `new ME(seed)` calls, in different orders, with different intervening writes, and asserts the `identityHash` is bit-identical every time — and independent of write history, creation time, and other kernel instances alive in the same process:

```ts
identityHash = keccak256("this.me/identity:v1::" + seed)
```

Critically, the seed does **not** protect secret branches. `docs/Seed.md` is explicit about this and the code confirms it: `computeEffectiveSecret` (`secret-context.ts`) starts its derivation chain from the fixed literal `"root"`, not from the kernel's seed, and folds in only `localSecrets` (values passed to `_`) and `localNoises` (values passed to `~`). Seed secrecy and branch secrecy are two independent axes — a public, guessable seed like a username does not weaken a wallet's `_("vault-key")` scope at all.

Visibility, as covered above, is structural: a scope root is excluded from the public `index` at write time (`applyMemoryToIndex`, `core-index.ts`) and re-blocked at read time by ancestor-walking (`hasStealthBarrier`). References (`__`/`->`) are resolved automatically on traversal but remain inspectable as data on direct read — `me("profile.cards.primary")` gives you the pointer object itself; `me("profile.cards.primary.income")` gives you the dereferenced value. Observation (`?`) is not a side-effect-free read: it is itself recorded as a memory with operator `"?"`, verified by axiom **A5** — asking a question about the graph is itself an event in the graph's own history.

One important, code-verified limit on "structural" secrecy: it is not free. `tests/Benchmarks/BASELINE-5-FINAL.md` measured p95 read latency at 600 nodes as **~76x slower** for secret-scope reads than for public reads, and mutation p95 as up to **~22x slower**, because a secret-scope read has to derive an effective key, load and decrypt a branch chunk, and (unless cached) clone it. Structural privacy in `.me` is real cryptographic work, not a boolean flag — the cost profile is part of what "structural" actually means here.

## Mutation, continuity, replay, and reconstruction

Every write becomes a `KernelMemory` with `hash` and `prevHash`, and axiom **A8** asserts the whole chain is tamper-evident: `prevHash` of memory *n* must equal `hash` of memory *n-1*, and recomputing each memory's hash from its own fields must match what's stored. When two writes collide on the same path, axiom **A9** proves the resolution is deterministic: the index is rebuilt by sorting memories `(timestamp asc, hash asc)` and taking the last one — not "whoever committed last in wall-clock terms," but a rule every replica can recompute identically from the same log.

`exportSnapshot()` / `hydrate()` (`core-snapshot.ts`) restore that memory log, the secret/noise scope maps, and the encrypted branch store — `dsl.contract.test.mjs` confirms a hydrated kernel gives back identical values, including correctly returning `undefined` for a secret root and the right value for its leaves, and confirms that a *tampered* v2 blob fails closed (`me2("wallet")` and `me2("wallet.balance")` both come back `undefined` after a single flipped hex nibble). Reconstruction, in other words, is provably safe against corruption.

One nuance worth being precise about, because I verified it by reading the code rather than finding a test that asserts it either way: `hydrate()` resets `self.derivations = {}` and rebuilds only the flat `index` from memory *values* — it does not re-run `registerDerivation` for `"="` memories. A derivation's live formula and its subscriber wiring appear to be runtime-only state, not part of what's persisted in the snapshot or memory log. What *is* guaranteed and tested is that the last computed *value* of a derived path survives snapshot/replay with full hash-chain integrity. Whether the *formula* needs to be redeclared to resume reactivity after a rehydrate is a real implementation detail worth confirming against intent before you depend on it — I did not find a test exercising that specific case.

## What not to import from SQL, OOP, REST, and graph-database thinking

Not as an attack on those systems — they solve real problems well in their own domains — but because carrying their assumptions into `.me` produces code that compiles and quietly does the wrong thing:

- **From SQL**: don't look for a schema to validate against before you write. There isn't one, and the absence isn't a missing feature.
- **From OOP**: don't treat `_` as a field-level access modifier. It's a runtime operation over a path that changes storage and index behavior for an entire subtree.
- **From REST**: don't think of a path read as "GET a resource, then the server decides what you're allowed to see." The exclusion already happened structurally, before your read reached anything resembling a permission check.
- **From graph databases**: don't reach for an explicit query planner or manual join. `me("profile.cards.primary.income")` *is* the join — pointer resolution happens on traversal, not as a separate query step you write.
- **From all of them**: don't assume "not found" and "not visible to you" are the same failure mode. `.me` distinguishes them on purpose.

## Rules of thought

1. **Start from paths and spaces, not from tables.** A path is a region of meaning, refined by descent — not a storage address.
2. **Identity can be a pure function of a seed, not an assigned ID.** `identityHash = f(seed)`; the same seed reconstructs the same identity anywhere, with no server.
3. **A path is a live thing, not a passive key.** Reading it can trigger pointer resolution, derivation freshness checks, and stealth gating before it returns anything.
4. **Visibility is structural, not a check bolted on afterward.** A secret scope's exclusion from the public index happens at write time and read time, at the storage layer — not in a middleware.
5. **`undefined` does not mean absent.** It can mean "structurally invisible to you." Check the leaf, not just the root, before concluding something doesn't exist.
6. **References are resolved on traversal, not manually joined.** A pointer stays inspectable data on direct read and transparently dereferences on deeper access — both at once, not one or the other.
7. **The same object can mean different things in different contexts — by design, not by accident.** Model context as a space like any other, and let derivations read from it.
8. **A derived value is a subscription, not a cache.** Its cost is proportional to how many things depend on it (`k`), not to the size of the graph.
9. **`explain()` is not a debugging bolt-on — it reads the same structures the runtime uses to do the work.** If you can't explain a value, you don't yet understand your own dependency wiring.
10. **Mutation is append, not overwrite.** History is hash-chained and tamper-evident; conflicts resolve by a deterministic rule every replica can recompute the same way.
11. **Structural privacy has a real, measurable cost.** It's cryptographic work, not a boolean — budget for it accordingly in anything secret-scoped and hot.
12. **Don't assume the formula behind a derived value survives a snapshot the same way its last value does.** Value continuity and formula continuity are not obviously the same guarantee — verify before you depend on it.

## Conclusion

None of this is a reskin of a database, a framework, or a graph store with different keywords. The primitives are small enough to list on one page — a callable path, two verbs, seven operator tokens, a hash-chained memory log, and a reactive subscription graph — and everything else in the demos (robots that read context, a hemisphere that recomputes six nodes out of a million, a wallet split three ways) is those primitives composed, not new machinery layered on top. Once a path stops looking like a string key and starts looking like a region of meaning that can be public, secret, pointed-to, and derived all at once, the earlier confusion — "where's the schema," "why is `undefined` not an error," "how does the join work" — stops being confusion and starts being the actual shape of the tool. That's the shift this article was trying to name: not a new syntax to memorize, but a different question to ask of any path you write — not "where is this stored," but "what space is this, who can see it, and what does it depend on."

---

**Source code:** https://github.com/neurons-me/.me
**Documentation:** https://neurons-me.github.io