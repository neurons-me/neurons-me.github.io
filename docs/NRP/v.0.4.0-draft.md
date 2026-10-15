---
layout: readme
title: NRP v0.4.0 — DRAFT
---

# Namespace Resolution Protocol v0.4.0 — DRAFT

Status: draft for decision. Nothing here is implemented beyond v0.3.0 unless a
line says so. Decisions marked **OPEN** are not taken yet.

## Status vocabulary

Each rule below says where it stands, with three different words that are not interchangeable:

- **Agreed** — decided by the authors of the protocol as the contract. It may or may not be built.
- **Candidate** — implemented in a candidate build that has been tested and is **not** released.
- **Published** — in a released package. Where no published version is indicated, this document does not establish
  availability in a release; the absence of a label is not evidence that a release lacks the behavior.

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

**R6 — A signed proof is presented only to a destination authorized for that operation or link (MUST).** A signed proof
(a claim, an open, a signed write) shows an identity to whoever receives it. A client **MUST** present it only to a transport
address that was explicitly authorized for that operation or for that link: the transport declared for the link, or an
explicitly listed alternative.

- *Discovery proposes; it does not authorize.* The location of the page, an environment default, the machine's hostname, a
  well-known public host, or the origin a name would resolve to may be offered as candidates. Having found a candidate does not
  make it a destination for a signature.
- *Declaring is not proving.* Declaring a destination authorizes presenting a proof there. It does not show that the destination
  has authority over the namespace; that is evidence of another kind (a claim record and signatures against it; §3b).
- *An explicit door is the only door.* If `name.space:9901` was written and does not answer, the attempt fails there. Using
  another destination requires a policy that somebody states; it is never a default.
- *A written port that contradicts the declared transport is a conflict.* Neither value is dropped silently; the caller is told
  and nothing is sent.
- *Nothing declared and nothing authorized:* the proof is not presented.

Status — **Agreed.** **Candidate:** cleaker branch `fix/port-not-in-namespace` @ `d044746` (`authorizeDiscovered`, explicit
`fallbackOrigins`, `TRANSPORT_NOT_DECLARED`, `TRANSPORT_PORT_CONFLICT`; contract tests K13–K17, L1–L6; run against a real
disposable monad behind a real OpenResty door). **Published: no** — the cleaker line the candidate was cut from (`ee519ef`, 4.0.0) did not have it: there, a sign-in that
failed at its primary destination presented signed open proofs to `https://cleaker.me` and `http://localhost` (measured). What
netget's `^3.2.1` does was not measured.

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
  segment, as the kernel does today. Inside a path, a digit after a
  separator `.` starts a segment: `dep.2.out` is `["dep", "2", "out"]` (fixes
  kernel bug #5). A `.` that is not a path separator, as in the literal `1.5`
  in a formula, keeps its decimal meaning.
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

## 3a. What an address can name: a target, a transport address, a content surface

Three different things travel in strings that look alike. They are not interchangeable and a port does not move one into another.

| It names | Parts | Example | Owned by |
|---|---|---|---|
| **NRP target** | namespace, selector, operation, semantic path | `me://jabellae.cleaker.me/photos/iphone` | the `.me` tree |
| **Transport address** | scheme, host, port | `http://fulltrailer.suis-macbook-air.local:9901` | the network: where a request goes |
| **Content surface** | a URL with ITS OWN path | `https://example.com/articles/transport` | that site |

Rules:

1. **A port belongs to the transport address.** It never changes the namespace and it does not, by itself, decide what the text
   after a `/` means. `name.space` and `name.space:8080` name the same namespace; they are two transports. This includes
   `localhost`: `localhost:8191` and `localhost:8192` express the same namespace NAME, `localhost`, within the same resolution
   context, through two transports. Removing the port keeps the semantic name; it does not show that the two servers serve the
   same tree or hold the same authority: that is established by what answers (§3b), not by the spelling. (The reference parser's
   earlier test NS1 asserted that the port was part of the name; it was changed as a documented compatibility change.
   Namespaces that must differ need different names.)
2. **What follows `/` depends on which of the three is being written.** Inside an NRP target it is a semantic path. Inside a
   content URL it is that site's path. The string `name.space:9901/expression` does not say which; a producer SHOULD write an
   explicit form:

   ```txt
   me://name.space/expression                 an NRP target (the transport is a separate fact)
   http://name.space:9901                     a transport address
   name.space/expression @ "http://name.space:9901/page"
                                              a target, over a content surface that has its own path
   ```
3. **`@` states a surface context; it is not a transport redirect.** `namespace @ surface` does not make requests for the
   namespace go to the surface's host (R6 decides where a proof may go).
4. **Namespaces are compared without the port; transports with it.** Verification, a session or a credential obtained through
   one transport is not inherited by another transport of the same namespace.
5. **`:port:operation` has no written grammar.** `jabellae.cleaker.me:8161:read/profile` is read by the current parsers as an
   operation named `8161:read`. That is a limitation of today's parsers, not a decision against writing a port and an operation
   together; the grammar for it is **OPEN (D8)**.

Status — rules 1, 3, 4 **Agreed**; rule 2's explicit forms **Agreed**, and what a parser does with the bare
`host:port/path` is **implementation behavior**, not the rule. **Candidate:** cleaker `d044746` and the GUI topic
`topic/port-namespace` (`fqdn` and `constant` carry no port; the port is in `transport`; `localhost:8191` and `localhost:8192`
parse to the same namespace name `localhost`). **Published: no.**

Where the parsers differ today (so nobody reads one as the other):

| Behavior | Cleaker before the change (`ee519ef`, the 4.0.0 line; the one measured) | Candidate cleaker `d044746` | `monad.ai` |
|---|---|---|---|
| port in `fqdn` / `constant` | yes (`localhost:8191` has constant `localhost:8191`) | no (bare; `transport.port`) | strips the port when it canonicalizes |
| all-digit suffix after `:` | a port | a port | reads the cleaker result |
| `:port:operation` | operation `8161:read` | same limitation | same |
| `[host:h\|port:8161]` | read as transport hints | same | the selector-admission branch (`fix/selector-admission` @ `49ad144c`, **not integrated**) refuses it: supported keys `device`, `tag`, `host`, `web`; `\|` is OR; a port inside `host:` is refused |
| where a signed proof may go | primary, then page/env/host/defaults as fallbacks | declared transport + only the sources the caller lists in `authorizeDiscovered` | — |

## 3b. Names, addresses and identity are three things

- A **canonical name** is a spelling that implementations agree on (a loopback name is canonicalized to the machine's root).
- A **network address** is where a request goes (scheme, host, port).
- A **verifiable identity** is evidence that the actor behind a name is the one that was there before: a claim record and
  signatures against it, checked against a trust reference the verifier already has.

Canonicalizing a name proves neither of the others. `suis-macbook-air.local` is not unique across networks; `localhost` and
`127.0.0.1` mean "this machine" wherever they are read; the control of a DNS name such as `cleaker.me` can change. "The same
namespace" means the same name. It does not mean the same server, the same actor or the same tree.

Continuity needs a **trust reference**. A claim record and signatures that the NEW server itself supplies do not show continuity
with the previous one: they must be verified against an identity that was recognized before (a key already known, or an
authority the verifier already trusts). Continuity of the TREE needs additional evidence about its history; a matching name or
a valid signature over today's state does not provide it. Nothing in §3a replaces this.

Status — **Agreed.**

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
- **D5 — One path grammar.** Model proposed (§3); open: the serialization of a
  segment containing `.`, its compatibility boundary and test matrix.
- **D6 — Existence privacy.** The R5 test: responses and parent listings for an
  existing sealed path vs a missing one, byte-for-byte.
- **D7 — Cross-host.** When jorge's monad is on another machine, resolving his
  identity and the photo needs cross-host mesh resolution, which is largely
  unbuilt and gated by the mesh trust gap (all.this CLAUDE.md, known gap #2).
  Single-host resolution is the v0.4 scope unless decided otherwise.
- **D8 — Port and operation together.** A grammar for writing a transport port and an operation in one target. Today's parsers
  read `host:8161:read` as the operation `8161:read` (§3a rule 5).

## 6. Preconditions before any of this is public API

- Security review of `audience.ts`: tree size/depth limits, formula shape as
  metadata, AND share-combination point, and envelope binding.
- `wrapSecretV1` authenticates `kid`, `class` and `policy` and accepts
  associated data, so a wrap is bound to its envelope. This changes a stored
  format and must land before sealed Islands are persisted.
- Kernel bug #2: formulas and sealed state must survive snapshot and restart.
