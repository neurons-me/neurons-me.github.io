---
layout: readme
title: NRP v0.3.0 — Namespace Resolution Protocol
---

# Namespace Resolution Protocol v0.3.0
**neurons.me / suiGn**  
**Status:** Current normative spec of the `me://` URI scheme: how a name — a
namespace, which is a `.me` — and a path inside it resolve to a value.
`monad.ai` is the reference implementation (mesh binding through Phase 10).  
**License:** CC0 1.0 Universal - Public Domain

---

## Version Note

NRP v0.2.1 remains the archived formal spec for the mesh draft through
`monad.ai` Phase 6. This v0.3.0 document carries that same foundation forward
and adds the Phase 10 wire-level semantics that are now visible to clients:
Total Monad Synthesis, `contested` disclosure, quorum rules, and `_synthesis`
audit metadata.

Phases 7-9 are documented here as implementation policy, not wire protocol:
adaptive weights, patch bay composition, and namespace-local maturity blending
shape route selection but do not change the meaning of a `me://` target or the
base disclosure envelope.

The implementation status report lives at [Mesh/status.md](https://neurons-me.github.io/monad/Typescript/typedocs/Mesh/status.html).
It reports the current `monad.ai` implementation; this versioned document is
the normative protocol authority.

---

## 0. Sacred Rules

### Rule 1 - Meaning Lives In The Namespace

The namespace and semantic path are the user-facing meaning:

```txt
me://jabellae.cleaker.me/photos/iphone
```

Hosts, ports, URLs, gateway routes, and monad process names are execution
details. They can change without changing what the URI means.

```txt
jabellae.cleaker.me              -> namespace
photos/iphone                    -> semantic path
monadlisa@127.0.0.1:8161         -> execution route
http://127.0.0.1:8161            -> transport only
```

### Rule 2 - Monads Are Invisible Execution Routes

The default public form has no execution selector:

```txt
me://jabellae.cleaker.me/profile
```

Selectors constrain execution, not meaning:

```txt
me://jabellae.cleaker.me[monadlisa]/profile
me://jabellae.cleaker.me[monadluis]/profile
```

Both identify the same semantic target:

```txt
jabellae.cleaker.me/profile
```

If both selected monads are authorized and synchronized, their answers must
converge. If they do not converge under synthesis, the result is `contested`.

---

## 1. Definitions

**Namespace** - A name for a `.me`: the root of a `.me` tree
(`jabellae.cleaker.me`), owned by whoever holds its root key material. There is
no central registry that grants or revokes a namespace.

**monad** - A physical or logical runtime that can hold or reach a `.me` kernel
instance and participate in the mesh. A monad is not a namespace; it is an
execution context inside, or on behalf of, a namespace.

**monad identity** - A stable cryptographic identifier derived from a monad
public key:

```txt
monad_id = "monad:" + SHA-256(monad_public_key)
```

The monad identity is not the port, host, cleartext name, or endpoint.

**cleaker(monad)** - A signed continuity proof published by a monad, usually via
`/__surface`, so resolvers can confirm that an endpoint still represents the
same monad identity.

**Endpoint descriptor** - A transport locator for reaching a monad. It is not
identity; it is current placement.

**monad index** - A namespace-local mesh contact book containing monad
identities, endpoints, claimed namespaces, freshness, capabilities, and routing
metadata. It answers "who could answer?"

**selection policy** - The local implementation policy that ranks eligible
monads. In `monad.ai` this includes scoring, adaptive weights, patch bay
features, and namespace-local maturity blending. It answers "who should answer?"

**Total Monad Synthesis** - The Phase 10 reduction of multiple eligible monad
responses into one coherent disclosure envelope. It is not a list response.
Parallel querying is an internal strategy; the caller receives one result.

**Disclosure envelope** - The wire-visible classification and value returned
for a resolved path.

---

## 2. Two-Layer Resolution

Resolution proceeds in this order:

1. **Topological resolution**: parse the target, discover eligible monads,
   apply selector constraints, choose one route or a synthesis candidate set.
2. **Semantic resolution**: ask the selected route or routes to resolve the
   semantic path locally against their `.me` kernel state.

The semantic layer remains local to each selected monad. The requester receives
only the disclosure envelope for the requested path, plus optional audit
metadata when synthesis is used.

---

## 3. Grammar

Canonical user-facing form:

```abnf
me-uri     = "me://" namespace [ "/" path ]
namespace  = 1*( ALPHA / DIGIT / "." / "_" / "-" )
path       = *( VCHAR / "/" )
```

Compatibility HTTP bridge form:

```abnf
bridge-uri = "me://" namespace ":" operation "/" path
operation  = "read" / "write" / "claim" / "open" / token
```

Advanced selectors constrain execution:

```abnf
advanced-me-uri = "me://" namespace selector [ "/" path ]
selector        = "[" ( "current" / monad-list / selector-clauses / empty-selector / "claim:" token / legacy-surface ) "]"
monad-list      = monad-name *( "," monad-name )
selector-clauses = selector-clause *( "|" selector-clause )
selector-clause = selector-atom *( ";" selector-atom )
selector-atom   = selector-key ":" selector-values
selector-values = selector-value *( "," selector-value )
legacy-surface  = "surface:" monad-name
empty-selector  = ""
```

Control-plane data is a path, not selector semantics:

```txt
me://jabellae.cleaker.me/.mesh/monads
me://jabellae.cleaker.me/.mesh/weights
```

---

## 4. Disclosure Model

The disclosure content visible to callers is:

| Disclosure | Meaning |
|---|---|
| `public` | The path resolved to a value that may be returned to the caller. |
| `opened` | The path is inside a secret scope and valid key material opened it. |
| `closed` | Stealth root, wrong key, absent key, absent near secret, or ambiguous closed result. |
| `contested` | Multiple monads answered but no quorum could produce one coherent value. |

`stealth` is an internal semantic classification, not the external wire label.
Transports must collapse stealth, wrong-key, absent-key, and absent-near-secret
cases into `closed` so observers cannot distinguish secrecy from absence.

Genuine absence outside any secret scope may return `not_found` or the
transport equivalent, such as HTTP 404.

---

## 5. Single-Route Resolution

Without synthesis, a resolver:

1. Parses the target into namespace, selector, operation, and semantic path.
2. Discovers monads that claim the namespace.
3. Removes stale entries and the current self route when forwarding outward.
4. Applies selector constraints such as `device:macbook`, `host:edge`, or an
   explicit monad name.
5. Scores eligible candidates by implementation policy.
6. Forwards to the selected endpoint.
7. Returns the selected monad's disclosure envelope.

The scoring policy may learn from outcomes, but learning must not change the
meaning of the target.

---

## 6. Total Monad Synthesis

Total Monad Synthesis is the default coherent model for resolving a namespace
through more than one live monad when the implementation elects to synthesize.

### 6.1 Candidate Set

A synthesis candidate must:

- claim the requested namespace or a valid namespace scope in the implementation binding;
- satisfy selector constraints;
- be fresh enough under the local staleness policy;
- not be the current self route when forwarding outward;
- meet the synthesis policy's score floor.

The current `monad.ai` binding uses:

```txt
maxCandidates = 3
minRelativeScore = 0.8
quorumThreshold = 0.5
```

Implementations may tune these values, but the emitted result must preserve the
disclosure semantics below.

### 6.2 Source Normalization

Each candidate response is normalized into a source record:

```ts
type SynthesisSource = {
  monad_id: string;
  endpoint: string;
  score: number;
  ok: boolean;
  disclosure: "public" | "opened" | "closed" | "contested";
  value: unknown | null;
  latencyMs: number;
};
```

A source is value-eligible only when `ok === true` and its disclosure is
`public` or `opened`. A `closed` source is a valid response but is not a public
value for quorum. This prevents a quorum of masked secret responses from being
misclassified as a public `null`.

### 6.3 Value Agreement

Value-eligible sources are grouped by `valuesAgree(a, b)`. The default agreement
policy is canonical deep equality with recursively sorted object keys.

The largest agreement group is the quorum group. Ties are broken by the
highest-scored representative only for reporting; they do not by themselves
create quorum.

### 6.4 Quorum Rule

Let:

```txt
agreeCount = size of largest agreement group
totalCount = number of value-eligible sources
threshold  = synthesis quorum threshold
```

The default strict-majority rule is:

```txt
agreeCount > totalCount * threshold
```

With the default threshold `0.5`, `1/2` is contested, not public. A threshold of
`1.0` requires unanimity. A threshold of `0` is a diagnostic mode where any
single value-eligible response may qualify.

### 6.5 Synthesis Outcomes

| Condition | Result |
|---|---|
| No source responds successfully, or every response is closed | `disclosure:"closed", value:null` |
| Quorum met and the highest-scored source is in the quorum group | `disclosure:"public"` or `opened`, value from the highest-scored source |
| Quorum met but the highest-scored source is outside the quorum group | `disclosure:"public"` or `opened`, value from the highest-scored source inside the quorum group |
| No quorum among value-eligible sources | `disclosure:"contested", value:null` |

`contested` is distinct from `closed`: the mesh received answers, but they did
not converge. A contested answer may expose audit metadata; it must not invent a
semantic value.

### 6.6 Audit Envelope

When synthesis is used, the response may include `_synthesis`:

```json
{
  "disclosure": "contested",
  "value": null,
  "_synthesis": {
    "sources": [
      {
        "monad_id": "monad:a",
        "score": 0.91,
        "ok": true,
        "disclosure": "public",
        "latencyMs": 42
      }
    ],
    "quorum": {
      "threshold": 0.5,
      "met": false,
      "agreeCount": 1,
      "totalCount": 3
    },
    "divergence": {
      "strategy": "contested",
      "sourceCount": 3,
      "agreeCount": 1
    },
    "policy": "strict-quorum"
  }
}
```

Audit metadata must not reveal secret structure. If a source disclosure is
`closed`, its audit value must be `null` or omitted.

---

## 7. Implementation Policy Binding

The following mechanisms are implementation policy in `monad.ai`, not mandatory
NRP wire semantics:

- global adaptive weights;
- namespace-local adaptive weights and maturity blending;
- patch bay feature composition;
- biased scoring logs and offline decision analysis;
- epsilon-greedy exploration for fragile single-route decisions.

These policies may influence route choice and synthesis candidate choice. They
must remain invisible to semantic identity: `namespace/path` keeps the same
meaning regardless of which policy chose the route.

---

## 8. Current HTTP Binding

The current `monad.ai` HTTP binding exposes:

| Endpoint | Purpose |
|---|---|
| `GET /<path>` with `Host:<namespace>` | Read a semantic path in the namespace selected by host. |
| `POST /` with operation body | Write, claim, or open in the namespace selected by host. |
| `GET /resolve?target=me://ns:read/path` | Bridge an NRP target through single-route or synthesis resolution. |
| `GET /.mesh/resolve?namespace=...` | Discover eligible namespace claimants. |
| `GET /.mesh/resolve/multi?namespace=...` | Inspect the scored candidate set used by synthesis. |
| `GET /.mesh/weights` | Inspect adaptive selection weights. |

The bridge form `me://namespace:read/path` is a compatibility serialization of
the same semantic target.

---

## 9. Gateway Binding Notes

NetGet is a transport gateway. It makes namespace hostnames reachable and routes
to registered monads, but it does not own NRP disclosure semantics.

Current local binding:

- the monad-root hostname and `{handle}.hostname` handle hostnames both pass
  through `surface_proxy.lua`;
- `surface_proxy.lua` reduces live registered monads by recency before proxying;
- the monad runtime handles semantic resolution, disclosure, mesh selection,
  and synthesis.

A previously described `nrp_handle.lua` handler is not part of the current
local implementation. Documentation or gateway code that mentions it describes
an older unimplemented design, not the current binding.

A second, path-based binding exists alongside hostname binding:
`/apps/:name` (public/canonical) and `/monads/:name` (internal/infra, same
handler) reverse-proxy by registered app/monad name rather than by hostname,
stripping the prefix before forwarding so the target monad sees clean
root-relative paths. This is how a namespace-per-app can be reached without
that app owning a hostname of its own. See
[Apps Over Netget](https://neurons-me.github.io/netget/Typescript/typedocs/AppsOverNetget.html) (in the
`netget` package) for the full rationale and a worked example.

---

## 10. Parser Binding Notes

Cleaker owns namespace grammar, but current `monad.ai` bridge code still uses
Cleaker's compatibility `parseTarget` wrapper for `me://namespace:operation/path`
targets. New NRP grammar work should converge on `parseNamespaceExpression()` as
the modern namespace expression parser, with compatibility tests proving that
bridge targets preserve existing behavior.

Until that migration lands, the compatibility bridge grammar is part of the
current HTTP binding, not the abstract NRP grammar.

---

## 11. WebSocket Binding (`/nrp`)

Every `monad.ai` process exposes a WebSocket endpoint at `/nrp`, attached to
the same HTTP server (and therefore the same port, and the same
name-registered mesh address) it already serves HTTP from — no separate
registration. Messages are JSON, one object per frame:

| `type` | Direction | Purpose |
|---|---|---|
| `nrp.open` | client → server | Open a channel: `{expression, canonical, ast, client, timestamp}`. Namespace comes from the message itself, not a Host header — a WS upgrade has no per-message Host to re-resolve from. |
| `resolved` | server → client | Reply to `nrp.open`: `{channelId, payload: {endpoints, disclosure, capabilities}}`. |
| `read` | client → server | `{channelId, namespace, path, timestamp}` — one-shot read on an already-open channel. |
| `subscribe` | client → server | Same shape as `read`, plus registers the connection for live updates on that path. |
| `unsubscribe` | client → server | Stops live updates for a previously-subscribed path. |
| `data` | server → client | Reply to `read`/`subscribe`: `{channelId, payload: {path, value, disclosure}}`. |
| `stream` | server → client | Pushed for a `subscribe`d path whenever it changes: same payload shape as `data`. |
| `ping` / `pong` | either | Keepalive. |

Disclosure on this binding is intentionally narrower than the full NRP
model (§4): only `public`/`closed` are ever emitted (`opened` requires key
material not yet wired to this path; `contested` doesn't apply to a
single-monad read) — matching the current HTTP binding's own disclosure
behavior (§8), not a separate policy.

**Live-update mechanism**: a write on the HTTP binding (`POST /`) notifies
an in-process registry (`kernel/pathNotify.ts`) keyed by exact path or
dotted-prefix match, which is what triggers `stream` pushes to subscribed
connections. This registry is **single-process, in-memory only** — it does
not fan out across multiple monad instances or machines. A `subscribe` on
one monad only ever hears about writes that land on that same process.

Client reference implementation: `this.gui/runtime`'s `createWsMeRuntime()`
(see [Apps Over Netget](https://neurons-me.github.io/netget/Typescript/typedocs/AppsOverNetget.html)
for the full client-to-gateway-to-monad picture, including how this binding
is reached through netget's `/apps/:name` proxy without the monad owning a
dedicated hostname).

---

## 12. Open Questions

1. Relay protocol for monads behind NAT or firewalls.
2. Revocation of lost or compromised monads without a central authority.
3. Cross-machine distributed monad index synchronization beyond local/CLI state.
4. Namespace-declared synthesis policy.
5. UI treatment for `contested` responses.
6. Cross-monad/cross-machine fan-out for the WebSocket binding's live-update
   registry (§11) — today's `pathNotify` is single-process only.
6. Migration from compatibility bridge parsing to the modern Cleaker namespace parser.

---

**Witness our seal**  
**suiGn / neurons.me**  
**v0.3.0**
