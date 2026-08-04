# NRP + Beatle — LLM Context

**For Grok, Claude, GPT, or any AI assistant working on this codebase.**

Read this before touching anything in `NRP/`, `Beatle/`, or the wire contract. It will save you from the two most common wrong turns: (1) treating Beatle as a UI widget, and (2) trusting the client AST as semantic authority.

---

## The One-Line Model

```txt
Beatle parses intent.  NRP resolves route.  .me resolves meaning.
```

Everything else follows from this.

---

## Stack Layers

```txt
┌─────────────────────────────────────────────┐
│  Beatle UI                                  │  packages/GUI/Typescript/src/gui/All.This/NRP/Beatle/
│  input bar + bubble + state visualization   │
├─────────────────────────────────────────────┤
│  useBeatle hook                             │  Beatle/useBeatle.ts
│  open() state machine, WebSocket lifecycle  │
├─────────────────────────────────────────────┤
│  NRPExpression parser                       │  Beatle/NRPExpression.ts
│  algebra: + ∩ @ ~ and Cleaker leaf parsing  │
├─────────────────────────────────────────────┤
│  Wire: WebSocket  ws://local.netget/nrp     │  BeatleMessage discriminated union
│  nrp.open → resolved | stream | error       │
├─────────────────────────────────────────────┤
│  NetGet / Monad  (SERVER — pending /nrp)    │  modules/netget, modules/monad
│  receives nrp.open, resolves against kernel │
├─────────────────────────────────────────────┤
│  .me kernel                                 │  me/Typescript/src/me.ts
│  semantic authority: secrets, audience,     │
│  capabilities, hash-chain, LWW              │
└─────────────────────────────────────────────┘
```

---

## Architecture Notes

### Two parallel channels

Normal internet: browser HTTP to `https://wikipedia.com`.
With Beatle: the browser keeps its HTTP channel. Beatle opens a **second, independent WebSocket channel** to a namespace. Both channels coexist.

```txt
Browser:  https://wikipedia.com/Scarab  (public, stateless)
Beatle:   me://jabellae @ wikipedia.com  (namespaced, bidirectional)
```

This means Beatle is not a navigation replacement. It is a **second channel** — a namespace session projected over whatever surface you are on.

### open() is not resolve-then-connect

Opening the channel IS resolving. There is no pre-resolution step. The WebSocket IS the channel. The server resolves the expression over the open socket and returns `resolved` + `channelId`. From that point it is bidirectional.

### Client authority vs server authority

The client sends `{ raw, canonical, ast, client }` as **intent and hint**. The server:
1. Re-parses `canonical` with its own parser.
2. Resolves each leaf against a real `.me` kernel instance.
3. Checks audience and secret rules.
4. Returns `disclosure` — `public | closed | stealth | contested`.

**Never assume the client AST is trusted.** It is for UX, debug, and reducing ambiguity. The kernel decides what is there.

---

## Current Implementation State

### Done (Beatle v0.9)

| Component | File | Status |
|---|---|---|
| NRP algebra parser | `NRPExpression.ts` | ✅ strict, precedence-aware, Cleaker-integrated |
| `useBeatle` hook | `useBeatle.ts` | ✅ `open()`, 8-state machine, send() state-guarded |
| Beatle UI | `Beatle.tsx` | ✅ bar + bubble variants, all 8 states visualized |
| Wire types | `Beatle.types.ts` | ✅ discriminated union, ResolvedPayload, NRPDisclosure |
| Stories | `Beatle.stories.tsx` | ✅ Bar, Bubble, InLayout |
| Export | `widgets.ts` | ✅ exported from GUI widgets barrel |

### Pending

| Gap | Notes |
|---|---|
| `/nrp` WebSocket handler | Does not exist yet in NetGet or Monad. Beatle is a complete client with no server yet. |
| Cleaker full leaf algebra | `parseNamespaceExpression` parses single namespaces. NRP compound expressions with context brackets tested but not end-to-end wired. |
| `contested` disclosure handling | Type is defined. Server detection logic in `surface_proxy.lua` not yet implemented. |
| `streaming` state | Wired in client. Server does not yet push stream frames. |
| `audience` from server | Field exists in types. Server must return it in `ResolvedPayload.audience`. |

---

## Design Decisions (with reasons)

### `open()` instead of `resolve()`

`resolve()` implies: "send a request, get a response, maybe connect." That is the old model. `open()` implies: "the socket IS the channel from the moment it opens." Resolving happens over the socket, not before it. This is the correct model for a bidirectional namespace channel.

### `canonical` is sacred

The client sends both `raw` (as typed by the user) and `canonical` (the normalized, precedence-correct form). The server re-parses `canonical` independently. If they disagree, the server wins. `canonical` must survive `parse → serialize → parse` round-trips unchanged. This is enforced by the precedence-aware `canonicalize()` function.

Why does this matter? `a ∩ (b + c)` without parentheses becomes `a ∩ b + c`, which parses as `(a ∩ b) + c` — a **different expression**. In a namespace protocol, this means a different channel. The bug is silent and dangerous.

### `syntaxValid` vs `namespaceValid`

`syntaxValid`: the algebra is structurally correct.  
`namespaceValid`: all leaves passed Cleaker validation.

`valid = syntaxValid`. An expression with `namespaceValid: false` can still be sent — the server has final say. This is correct: a namespace might be valid on the server even if Cleaker rejects it on the client (version mismatch, new grammar feature, etc.).

### Discriminated union for wire messages

`BeatleMessage` is a discriminated union, not a flat object with `payload?: unknown`. This means TypeScript narrows `msg.payload` to `ResolvedPayload` inside `case 'resolved'`, to `string` inside `case 'error'`, etc. No runtime type guards needed for the common cases.

### `send()` state guard

`send()` checks `channel.state !== 'connected' && !== 'streaming'` before touching the socket. Checking only `WebSocket.OPEN` is insufficient — the socket is technically open during `resolving` too, but the NRP handshake is not complete. Sending data before `resolved` is a protocol violation.

---

## Expressions That Must Work

```ts
// Simple namespace
"jabellae"

// Union — channel shared by both
"jabellae + alex"

// Intersection — only shared region
"jabellae ∩ team.acme"

// Complement — everything except
"~jabellae"

// Overlay — namespace session over a surface
"jabellae @ wikipedia.com"

// Full URI surface (quoted)
'jabellae @ "https://wikipedia.com/Scarab"'

// Compound expression with overlay
"jabellae + alex @ wikipedia.com"
// parses as: jabellae + (alex @ wikipedia.com)
// to overlay the union: "(jabellae + alex) @ wikipedia.com"

// Intersection with overlay
"jabellae ∩ (team + friends) @ wikipedia.com"

// Complement of a union
"~(public + spam)"

// Full Cleaker namespace token as leaf
"cleaker.me[host:localhost|protocol:http|port:8161]:open/profile"

// me:// scheme (Cleaker strips it)
"me://jabellae.cleaker.me/photos/iphone"
```

---

## Rules for AI Assistants

### Authority rules

1. **The .me kernel is the only semantic authority.** The client AST is a hint. Never suggest that the client can "verify" or "trust" its own resolution.
2. **Disclosure levels are meaningful.** `stealth` is not the same as `closed`. `stealth` means existence is not confirmed. Do not conflate them.
3. **`contested` requires user confirmation before writes.** Total Monad Synthesis may return multiple conflicting monads. Flag this, do not silently resolve it.

### Naming conventions

| Term | Meaning |
|---|---|
| `open()` | Single entry point — parse + connect + resolve |
| `channel` | A `NamespaceChannel` — the live state of a session |
| `expression` | A `NRPExpression` — parsed form of the input |
| `canonical` | The normalized, round-trip-stable string form |
| `ast` | The typed algebraic tree — hint, not authority |
| `surface` | The `@` operand — a domain or URI |
| `disclosure` | What the kernel revealed: `public | closed | stealth | contested` |

### Things not to assume

- Beatle is **not** a netget widget. It belongs to `All.This/NRP/`, not `All.This/netget/`.
- `me://` is **not** the kernel DSL. It is the URI scheme for NRP resolution. The kernel has its own proxy API (`me.wallet.balance = 100`).
- `+` in NRP means **union** (algebraic set union). It is not string concatenation.
- `~` is **complement**, not negation. `~jabellae` means "the complement of the jabellae namespace" — not "not jabellae".
- The `@` operator has **higher precedence** than `∩` and `+`. `a + b @ surface` = `a + (b @ surface)`.
- Opening a channel does not require a local monad. Beatle can resolve to any namespace — local, remote, or a friend's monad.

---

## Key Files

```txt
packages/GUI/Typescript/src/gui/All.This/NRP/Beatle/
  Beatle.types.ts       — all types, discriminated union messages, NRPDisclosure
  NRPExpression.ts      — parser, canonicalizer, Cleaker leaf integration
  useBeatle.ts          — hook: open(), send(), disconnect(), state machine
  Beatle.tsx            — UI component (bar + bubble variants)
  Beatle.stories.tsx    — Storybook stories

neurons-me.github.io/docs/NRP/
  Namespace-Protocol-Resolution.md  — protocol spec
  NRPExpression-Parser.md           — this parser
  Beatle.md                         — Beatle component
  NamespaceChannel.md               — channel state
  Surface-and-Overlay.md            — @ operator
  Disclosure-Levels.md              — public / closed / stealth / contested

all.this/me/Typescript/typedocs/
  NRP-Kernel-Role.md    — why .me is the semantic authority
  Algebra-of-Contexts.md

all.this/modules/cleaker/Typescript/typedocs/
  NRP-Namespaces.md     — Cleaker grammar for NRP leaves
```

---

## What You Would Want to Know Next

1. **The .me kernel internals** — how a namespace looks internally, how audiences and secrets are structured, how capabilities are declared. Start at `me/Typescript/src/me.ts` and `typedocs/Axioms.md`.

2. **The `/nrp` WebSocket binding** — this does not exist yet. When building it: the server receives `nrp.open`, re-parses `canonical`, resolves against the kernel, and returns `{ type: 'resolved', channelId, payload: ResolvedPayload }`. Then it keeps the socket open for bidirectional `data` and `stream` frames.

3. **Cleaker in depth** — `modules/cleaker/Typescript/src/namespace/expression.ts` is the canonical parser. `parseNamespaceExpression(input)` returns `ParsedNamespaceExpression` with context, operation, path, and transport hints.

4. **Use cases** — Smart city Veracruz (mesh of sensors/services sharing a `.me` context), FullTrailer (creative collaboration namespace), LoFi Café (ambient shared namespace over a music surface). Each is a different expression over the same protocol.

5. **Short-term roadmap** — The next working piece is the `/nrp` WebSocket handler in NetGet or Monad. Once that exists, Beatle becomes a real client instead of a complete-but-serverless one.

---

## Contact / License

neurons.me / suiGn  
NRP spec: CC0 1.0  
Beatle implementation: see `packages/GUI/Typescript`
