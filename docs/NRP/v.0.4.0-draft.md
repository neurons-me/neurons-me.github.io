---
layout: readme
title: NRP v0.4.0 — DRAFT
---

# Namespace Resolution Protocol v0.4.0 — DRAFT

Status: draft for decision. Nothing here is implemented beyond v0.3.0 unless a
line says so. Decisions marked **OPEN** are not taken yet.

## 0. What v0.4 adds

[v0.3.0](./v.0.3.0.md) defines how `me://namespace/path` resolves and what disclosure the
caller receives. v0.4 binds that address to the **Island**, so one resolvable
expression reaches every part of the state it names:

```txt
I = (path, ciphertext, T, A, C)
```

(definition: [Digital Space Algebra](https://suign.github.io/DigitalSpaceAlgebra.html),
[Encrypted Semantic Island](https://suign.github.io/EncryptedIsland.html)).

| Island part | What it is | Who owns it |
|---|---|---|
| `path` | The address: `me://<namespace>/<path>`. The one grammar shared by `.me` and NRP (§3). | NRP |
| `ciphertext` | The sealed value at that path. | `.me` kernel |
| `T` | Topology: which monads hold or replicate it. Invisible in the address (v0.3.0 Rule 2). | monads / mesh |
| `A` | Audience: the formula over identities that decides who can open it ([Audience Algebra](https://suign.github.io/AudienceAlgebra.html)). | `.me` kernel (sealing), Cleaker (names → keys) |
| `C` | Capability: what an identity that can open the state may do with it through a signed operation (§1a). | monad (verifies signatures) |

The identities themselves are `U`, the universe of kernel identities
`k = (identityHash, P256 public key)`; `A` is a formula over `U`. `U`, `A` and
the ciphertext sealed to `A` together are
[The Algebra of Encrypted Audiences](https://suign.github.io/EncryptedAudiences.html).

v0.3.0 Rules 1 and 2 stay as they are.

## 1. Invariants

**R1 — One address for everyone.** An Island has one address. Every reader
resolves the same `me://` expression; nothing in it depends on who reads.

**R2 — Access is derived, never granted by the address.** What a reader
receives is derived from the reader's identity against `A`. The reader's
identity travels on the reader's own channel (its connection and proof), never
in the address. Holding or forwarding the address grants nothing.

**R3 — Writes are signed operations, not addresses.** Changing state (writing a
value, setting or changing `A`) is an operation signed by an identity with
authority over the path, delivered through a door. NRP has no write or share
form (`:write`, `:share`); the v0.3.0 bridge form `me://ns:operation/path`
remains a compatibility serialization only.

**R4 — The kernel does not resolve names.** `.me` is tree and grammar, with no
network. `A` may be declared in the tree with names as data
(`jorge.cleaker.me`), but at sealing time Cleaker resolves each name to a
kernel identity `k = (identityHash, P256 public key)` and hands the kernel
identities only. If a member's key changes, the value must be re-sealed (D4).

**R5 — Closed is indistinguishable from absent (requirement).** For a reader
outside `A`, an existing sealed path and a missing path must produce the same
`closed` response, and listing the parent must not reveal the node. This is a
requirement with a test to be written, not a property the implementation is
known to have today.

## 1a. Capability (`C`)

`A` decides who can open; `C` decides what an identity that opened may do:
read, derive, write, re-seal (share within the tree).

- **Read is enforced by cryptography** (`A`). Every other capability is
  enforced only where it passes through a signed operation that monad verifies.
- **Sharing within the tree only.** The `share` capability means re-sealing the
  node to another audience through a signed operation, which leaves a record
  of who did it. `C` cannot stop anyone who can open a value from copying the
  plaintext and sealing or publishing it outside the tree: exposure always
  passes through whoever can open, and in an OR audience any member can
  publish. `C` never promises control over a value once opened.
- **Delegation only narrows.** An identity can delegate only capabilities it
  holds: read cannot grant share, and a sharer cannot grant more than it has.
  Monad checks that a delegated capability is contained in the signer's. Like
  `A`, no operation enlarges permissions.

## 2. Disclosure

Unchanged from v0.3.0 §4. For an Island:

| Reader | Disclosure |
|---|---|
| in `A` | `opened` + value |
| not in `A` | `closed`, value `null` |
| path absent | `closed` when inside or near a sealed scope (R5); otherwise `not_found` |

## 3. One path grammar (requirement)

`.me` paths (`me.photos.iphone`) and NRP paths (`me://ns/photos/iphone`) must be
one grammar with a lossless round trip. **Status: OPEN (D5)** — everything in
this section is a proposal until approved; the segment encoding is not chosen.

**Proposed**

- **Logical segments are the identity.** A path is an ordered list of logical
  segments. `me.a.b` and `me://ns/a/b` are two spellings of `["a", "b"]`. There
  is one path-identity contract: every representation — URI, storage keys,
  memory log, scopes, pointers, derivation refs, snapshots, replay, parent/child
  checks, key derivation — may have its own serializer, versioned, but each
  must preserve exactly the same segments. Nothing joins segments by hand.
- **Inputs decode differently by source.** The JavaScript proxy receives
  literal names (`me.domains["cleaker.me"]` is the segment `cleaker.me`); a
  serialized path or `me://` URI is decoded by the grammar. They never share
  decoding rules.
- **`[2]` is `.2`.** An index selector names the same node as the numeric
  segment, as the kernel does today. After a `.`, a digit starts a segment,
  never a decimal literal (fixes kernel bug #5).
- **Selectors are explicit productions.** Index, range, multi-select,
  iterator, filter and transform are told apart by syntax. Position decides
  execution vs data: a `[...]` on the namespace (before the path) constrains
  execution (v0.3.0 Rule 2); a `[...]` on a segment selects data.
- **Its own parser.** No generic parser (e.g. a URL parser) may silently
  reinterpret `.me` grammar; inside `me://`, `? # @ +` and spaces are grammar,
  not URL syntax. Generic URL parsing stays valid for HTTP transport addresses.
- **Transport is not grammar.** `/@handle`, `/.mesh/...`, `:read`,
  `/resolve?target=` and `/apps/:name` are binding conventions (v0.3.0 §8,
  §11), removed before a path reaches the tree.

**Open: the serialization of a segment that contains `.`**

Today segments are joined with `.` everywhere, so a segment containing `.`
collides with nesting (kernel bug #6: `["a.b","c"]` and `["a","b.c"]` are one
key). Candidate: a minimal escape applied only by the central serializer —
`%` → `%25` and `.` → `%2E`, nothing else — which leaves every existing path
without `.` or `%` byte-identical, including its key-derivation context.
Alternative: length-prefixed segments for key derivation, versioned. Before
either is chosen:

- full encode/decode rules: empty segments, invalid escapes, canonical form;
- a compatibility boundary: stored `a.b.c` records have lost their segment
  boundaries and keep their historical reading; they are not migrated
  automatically. `__DOT__` (netget domains) is migrated only where its own
  contract says it stands for `.`;
- a test matrix: dots, percents, Unicode, selectors, scopes, pointers,
  existing sealed blobs, and `parse → serialize → parse` for both spellings.

## 4. Worked example: sharing a photo

Actors: `jabellae.cleaker.me` (owner), `jorge.cleaker.me`, `ana.cleaker.me`, and
a stranger.

1. **Address.** The photo is the Island at
   `me://jabellae.cleaker.me/photos/iphone/IMG_0412`. Its `T` is whichever of
   jabellae's monads hold it.
2. **Declare the audience.** jabellae declares, as data in the tree, that this
   path's audience is `{ jorge.cleaker.me, ana.cleaker.me }` — a plain set, so
   OR: either can open it alone. How a path points to its audience is **OPEN
   (D2)**.
3. **Seal (signed write, R3).** Cleaker resolves both names to their published
   keys (D3) and passes the identities to the kernel, which seals the photo to
   `A = OR(k_jorge, k_ana)`. The ciphertext is written at the path.
4. **Resolve.** Anyone may hold the address (R1).
   - jorge resolves it on his channel with his identity → `opened` + photo.
   - ana, same.
   - the stranger → `closed`, the same as for a path that does not exist (R5).
5. **Capability.** jabellae gives jorge `read` and ana `read + share`. ana can
   re-seal the photo to another audience with a signed operation, and the tree
   records that she did; jorge's attempt is refused by monad. Neither `C` nor
   `A` can stop jorge from copying what he already opened (§1a).
6. **AND instead of OR.** Declaring `AND(jorge, ana)` means neither can open it
   alone; they must combine their shares, and wherever they combine them sees
   the full key (Audience Algebra, limits of the model).
7. **Through a group.** jabellae's name `amigos` points to the group
   `G₁ = {jorge, ana}`; sealing "to amigos" seals to `G₁`. When luis joins, the
   name moves to `G₂ = {jorge, ana, luis}`: new seals go to `G₂`, and luis does
   not see the photo sealed to `G₁` unless someone who can open it re-seals it —
   an explicit act (Audience Algebra, Groups; law L7). The name is the context
   that stays; each group is an immutable value identified by the hash of its
   members.
8. **Key rotation.** If jorge's key changes, the photo must be re-sealed to his
   new key (R4). Who triggers it is **OPEN (D4)**.

## 5. Open decisions

- **D1 — `C`. CLOSED:** `C` is capability, as published; `U`, `A`, `C` keep their
  published meaning (§0, §1a).
- **D2 — Declaring the audience of a path.** Not by the type of `_`'s argument
  (string = secret, array = audience): that is a type switch and
  `_("jorge.cleaker.me")` would be ambiguous. Options: (a) its own operator;
  (b) the audience lives at a path in the tree and `_` points to it, following
  the tree's own structure.
- **D3 — Published keys.** The path at which each namespace publishes its
  identity keys, and how Cleaker verifies that a published key belongs to that
  namespace (claim / proof).
- **D4 — Re-seal trigger.** Who re-seals when a member's key rotates or a group
  name moves, and whether old ciphertext is kept, replaced, or both.
- **D5 — One path grammar.** Model agreed (§3); open: the serialization of a
  segment containing `.`, its compatibility boundary and test matrix.
- **D6 — Existence privacy.** The R5 test: responses and parent listings for an
  existing sealed path vs a missing one, byte-for-byte.
- **D7 — Cross-host.** When jorge's monad is on another machine, resolving his
  identity and the photo needs cross-host mesh resolution, which is largely
  unbuilt and gated by the mesh trust gap (all.this CLAUDE.md, known gap #2).
  Single-host resolution is the v0.4 scope unless decided otherwise.

## 6. Preconditions before any of this is public API

- Security review of `audience.ts`: tree size/depth limits, formula shape as
  metadata, AND share-combination point, and envelope binding.
- `wrapSecretV1` authenticates `kid`, `class` and `policy` and accepts
  associated data, so a wrap is bound to its envelope. This changes a stored
  format and must land before sealed Islands are persisted.
- Kernel bug #2: formulas and sealed state must survive snapshot and restart.
