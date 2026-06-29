# Namespace Resolution Protocol v0.2.1
**neurons.me / suiGn**
**Status:** Implemented mesh draft through monad.ai Phase 6
**License:** CC0 1.0 Universal — Public Domain

---

## Current Implementation Snapshot

This document is the protocol-level spec. The `monad.ai` package currently
implements the local HTTP/mesh binding through Phase 6:

- `GET /.mesh/monads` lists local-kernel plus CLI-known monads.
- `GET /.mesh/resolve?namespace=...` returns namespace claimants.
- `GET /.mesh/resolve?monad=...` returns a named monad.
- `GET /resolve?target=me://namespace:read/path` bridges an NRP target.
- `[device:...]`, `[tag:...]`, and `[host:...]` selectors constrain mesh
  candidates.
- `computeScoreDetailed` selects among eligible monads and explains the score.
- `DecisionEntry` JSONL logs correlate decisions with outcome, latency, and
  continuous reward when `MONAD_DECISION_LOG` is set.

See also:

- [`NRP/status.md`](./NRP/status.md) for implementation status.
- [`NRP/scoring.md`](./NRP/scoring.md) for the production scoring contract.
- [`NRP/testing.md`](./NRP/testing.md) for the regression suite taxonomy.

## Preamble
This document specifies the **Namespace Resolution Protocol (NRP)** for the `me://` URI scheme.

The NRP defines how a `me://` URI is resolved from a symbolic address into a concrete semantic value, across a distributed mesh of **monads** — without a central registry, without a central server, and without requiring persistent connectivity.

The canonical user-facing address is semantic:

```txt
me://jabellae.cleaker.me/photos/iphone
```

The user names meaning. The system chooses execution.
It is the protocol that closes the gap between:

- **Semantic resolution** — already implemented in `this.me`: local, mathematical, derivation-based. The kernel resolves `me.get("wallet.balance")` entirely offline.

- **Topological resolution** — the new work: how a requesting monad invisibly finds the best execution route for the target namespace, path, and key material.

  These two layers are separate concerns, implemented separately, but always composed in that order:

```
me://jabellae.cleaker.me/photos/iphone
         │                         │
    topological                 semantic
    (find namespace,            (resolve the
     choose monad route)         path locally)
```

monads are invisible execution routes. A user does not need to know which monad serves `photos/iphone`; the namespace resolver decides that from index state, freshness, permissions, capabilities, budgets, and endpoint reachability.

Technical selectors may still force or constrain execution for diagnostics, debugging, or advanced routing:

```txt
me://jabellae.cleaker.me[monadlisa]/photos/iphone
```

This still targets the same semantic path, `jabellae.cleaker.me/photos/iphone`. The selector changes execution, not meaning.

The **NRP** specifies the topological layer. The semantic layer is already specified by `this.me`.
*Meaning lives in the namespace. Execution lives in the mesh.*

---

## 0. Sacred Rules

### Rule 1 — Ports and hosts do not change the namespace
The port never changes the namespace.
The *physical host* is not the identity.
The **monad** is the active execution agent.

```txt
jabellae.cleaker.me              -> namespace
monadlisa@127.0.0.1:8161         -> monad instance + endpoint
http://127.0.0.1:8161            -> transport only
```

### Rule 2 — monads are invisible execution routes
The **namespace** path is the meaning. The user thinks in semantics. The system resolves execution.

The default form is:

```txt
me://jabellae.cleaker.me/profile
```

An explicit **monad** selector is only a technical route override:

```txt
me://jabellae.cleaker.me[monadlisa]/profile
me://jabellae.cleaker.me[monadluis]/profile
```

Both point at the same semantic node:

```txt
jabellae.cleaker.me/profile
```

**The selector only changes the execution route:** which **monad** is asked, with which freshness, budget, authority, capabilities, and operational state. If both monads are authorized and synchronized, their answers must converge.

No selector is the canonical public form. The resolver may internally use one **monad**, many **monads**, or the Total **monad** synthesis.

---

## 1. Definitions
**Namespace** — A named semantic domain. Represented as a human-readable label (e.g., `jabellae.cleaker.me`). A namespace is owned by whoever holds its root key material. There is no central authority that grants or revokes a namespace.

**monad** — A physical or logical runtime agent that can hold or reach a `.me` kernel instance and participate in the mesh. A monad can run on a laptop, phone, VM, server process, browser tab, or any other host, but the host is only placement metadata. The monad is the execution agent.

monads are **not** namespaces. A monad is a runtime execution context **within** a namespace — a place where the namespace can run code, access resources, consume budget, and serve semantic paths. A laptop monad, an iPhone monad, and a VM monad may all serve the **same** namespace. The namespace holds the meaning; the monad lends execution.

**Surface** — Historical/compatibility term for a monad runtime. Older documents and APIs may say `surface`; this version treats `surface` as a legacy alias for `monad`.

**monad identity** — The cryptographic identifier of a monad within a namespace:

```
monad_id = "monad:" + sha256(monad_public_key)
```

This is never the cleartext `monad_name`, and it is never the port. The
`monad_name` is human. The endpoint is transport. The `monad_id` is continuity:
whoever can sign as the matching private key is the same monad, even if it moves
ports, hosts, or networks.

**cleaker(monad)** — The signed continuity proof for a monad. The private key
never leaves the monad host. The public key and signature may be published on
`/__surface` so a resolver can confirm that an endpoint is still the same monad.

**Namespace key** — The root secret from which all key material in a namespace is derived. Equivalent to the seed in the derivation-based identity model. Never transmitted; always local.

**Endpoint descriptor** — A transport-layer locator for a monad (IP:port, NetGet placement, relay address, onion address, etc.). Stored encrypted inside the monad index. Not the monad's identity — just how to reach it right now.

**monad index** — A `.me` secret space, scoped under the namespace key, that maps monad identities to their current endpoint descriptors, placement targets, budgets, capabilities, and status. It is the mesh's contact book and process table. Every authorized monad that holds the namespace key can read and write it.

**Total monad** — The reduced synthesis of all active monads authorized for a namespace. It is the default coherent execution body behind ordinary `namespace/path` resolution when the mesh is available. It is not a list response and not merely parallel querying; parallel querying is only one possible internal strategy. The caller receives one coherent disclosure envelope.

**Claim token** — A one-time, time-limited token that authorizes a new monad to join a namespace. Generated by an existing monad. Expires. Consumed on first use.

**Stealth root** — A secret scope root that returns `undefined` on resolution. This is an honest absence, not an error. The NRP must preserve this distinction at the network level.

**Semantic island** — A self-contained `.me` kernel instance holding a fragment of a namespace. Islands do not need to be constantly connected. They interact by exchanging mathematical hashes, not cleartext data.

---

## 2. The Two-Layer Model
Resolution of a `me://` URI proceeds in two phases, always in this order.

### Phase 1 — Topological resolution
**Input:** `namespace` + `path` + optional technical selector
**Output:** a reachable monad endpoint, a chosen set of monad endpoints, or an internal Total monad execution body.

The requesting monad must find an execution route that can serve the requested semantic path. This involves:

1. Treating `namespace/path` as the canonical meaning.
2. Choosing a monad route internally from the monad index.
3. If a technical selector is present, constraining the route to the requested monads or monads set.
4. Looking up endpoint descriptors for the chosen `monad_id` values.
5. Establishing a connection to the endpoint or endpoints.

   If the monad index does not contain the target `monad_id`, or if the target monad is unreachable, topological resolution fails. The request does not proceed to Phase 2.

### Phase 2 — Semantic resolution
**Input:** `path` + key material (if the path is within a secret scope)
**Output:** the resolved value, or `undefined`, or a closed failure

Once the requesting monad has a connection to the chosen monad route, it sends a read request for the path. The target monad resolves the path locally using its `.me` kernel, or participates in internal Total monad synthesis, and returns a **disclosure envelope** (see Section 6).

Semantic resolution is local to the selected execution route. The requesting monad never sees another monad's kernel state directly — only the disclosure envelope for the specific path requested.

---

## 3. monad Identity and the monad Index
### 3.1 monad identity derivation
A monad's identity is derived from its public key:

```
monad_id = "monad:" + SHA-256(monad_public_key)
```

This produces a stable public identifier. It is independent of `monad_name`,
port, host, IP, and endpoint. A monad may move from `8161` to `8162`, or from a
laptop to a relay, without changing identity if it keeps the same private key.

The `monad_name` is a human-readable label chosen by the namespace holder or runtime operator (e.g., `"monadlisa"`, `"worker-a"`, `"vision-daemon"`). Physical placement such as `"iphone"`, `"macbook"`, `"raspberry-cancun"`, or `"vm-prod"` is metadata resolved by NetGet. It is not the semantic selector.

The monad proves continuity by publishing `cleaker(monad)`:

```json
{
  "monadId": "monad:<sha256-public-key>",
  "monadName": "haiku",
  "cleaker": {
    "protocol": "cleaker(monad)",
    "version": 1,
    "subject": "monad",
    "id": "monad:<sha256-public-key>",
    "publicKey": {
      "type": "spki",
      "format": "pem",
      "key": "-----BEGIN PUBLIC KEY-----..."
    },
    "signature": {
      "algorithm": "ed25519",
      "message": "{...canonical surface proof...}",
      "value": "<base64url-signature>",
      "issuedAt": 1770000000000
    }
  }
}
```

The resolver verifies:

```txt
sha256(publicKey) == monad.id
verify(publicKey, signature.message, signature.value) == true
```

The current implementation publishes this self-signed surface proof. A future
challenge form may add resolver-provided nonces for stronger replay resistance.

### 3.2 monad index structure
The monad index is a `.me` secret space:

```ts
me.monad["_"]("namespace_key");

// For each known monad:
me.monad[monad_id].name("monadlisa");
me.monad[monad_id].endpoint("encrypted_endpoint_descriptor");
me.monad[monad_id].namespace("jabellae.cleaker.me");
me.monad[monad_id].status("online");
me.monad[monad_id].activated_by("jabellae.cleaker.me");
me.monad[monad_id].budget.cpu(0.25);
me.monad[monad_id].capabilities(["filesystem", "camera"]);
me.monad[monad_id].placement.provider("netget");
me.monad[monad_id].placement.target("iphone");
me.monad[monad_id].last_seen(timestamp);
me.monad[monad_id].public_key("monad_public_key");
me.monad[monad_id].cleaker("latest_signed_surface_proof");
```

The index is stored locally on every authorized monad that holds the namespace key. There is no canonical remote copy. monads sync the index through the mesh on reconnection (see Section 7).

The `endpoint_descriptor` field is doubly encrypted: first under the namespace key (so only namespace members can read it), and second it may use an ephemeral monad key for transport security. The endpoint is volatile and may change. The `monad_id` is stable.

### 3.3 Reading from the monad index
A monad resolves `me://jabellae.cleaker.me[monadlisa]/some.path` as follows:

```
1. Compute: target_id = HMAC-SHA256(namespace_key, "monad:monadlisa")
2. Read: endpoint = me("monad." + target_id + ".endpoint")
3. If endpoint is undefined → monad not found → fail with NRP_ERROR_monad_NOT_FOUND
4. Decrypt endpoint descriptor → get transport address
5. Proceed to Phase 2 (semantic resolution)
```

Compatibility bindings may still accept `[surface:name]` and derive `HMAC-SHA256(namespace_key, "surface:" + name)`. New implementations should prefer monad selectors.

---

## 4. The Claim Ceremony
The claim ceremony is how a new monad joins a namespace. It replaces the need for a central authority to "add" a runtime.

The current implementation has a claim token as a temporary in-memory value. This section formalizes and hardens it.

### 4.1 Token generation
An existing monad in the namespace (the **inviting monad**) generates a claim token:

```
nonce         = random_bytes(16)
expiry        = now() + TTL            // recommended TTL: 300 seconds
claim_token   = HMAC-SHA256(namespace_key, nonce + expiry)
claim_payload = base64url(nonce + expiry + claim_token)
```

The claim payload is encoded into the URI:

```
me://jabellae.cleaker.me[claim:CLAIM_PAYLOAD]/new-monad
```

And optionally rendered as a QR code for physical proximity pairing (already implemented in Cleaker).

### 4.2 Token verification
The **new monad** presents the claim payload. The inviting monad (or any namespace monad that receives the pairing request) verifies:

```
1. Decode claim_payload → extract nonce, expiry, presented_token
2. Check: now() < expiry → if expired, reject with NRP_ERROR_CLAIM_EXPIRED
3. Recompute: expected_token = HMAC-SHA256(namespace_key, nonce + expiry)
4. Check: presented_token == expected_token → if not, reject with NRP_ERROR_CLAIM_INVALID
5. Check: token has not been used before (nonce registry, local) → if used, reject with NRP_ERROR_CLAIM_CONSUMED
```

### 4.3 Key handshake
After verification, the inviting monad and new monad perform a key handshake:

```
1. New monad generates an ephemeral keypair: (eph_pub, eph_priv)
2. New monad sends eph_pub to inviting monad
3. Inviting monad encrypts namespace_key with eph_pub:
     encrypted_namespace_key = ECIES(eph_pub, namespace_key)
4. Inviting monad sends encrypted_namespace_key + its own monad_id + current monad index snapshot
5. New monad decrypts with eph_priv → receives namespace_key and monad index
6. New monad registers itself in the monad index:
     monad_id_new = HMAC-SHA256(namespace_key, "monad:" + new_monad_name)
     me.monad[monad_id_new].endpoint(...)
     me.monad[monad_id_new].public_key(eph_pub)
7. New monad announces its registration to all online monads in the namespace
```

### 4.4 Token consumption
The nonce is added to a local consumed-nonce registry after a successful claim. The registry is pruned of entries older than the maximum TTL. This prevents replay attacks.

```ts
me.system.consumed_nonces[nonce].at(timestamp);
```

---

## 5. Resolution Rules
The canonical `me://` URI names a semantic path. monads are selected internally unless the caller explicitly asks for a technical override.

### 5.0 No selector — canonical semantic resolution

```
me://jabellae.cleaker.me/wallet.balance
```

When no selector is present, resolution is **semantic-first**. This is the public form applications and users should prefer.

The resolver starts from the current/local monad and may then resolve intelligently through the namespace. It may use:

- the current monad
- a specific better-positioned monad
- several monads internally
- the Total monad synthesis
- NetGet endpoint placement

All of those are execution details. They must not change the meaning of `jabellae.cleaker.me/wallet.balance`.

The default resolver is free to use synthesis, routing intelligence, endpoint placement, or any internal strategy without exposing it to the user.

### 5.1 `[current]` — technical local override

```
me://jabellae.cleaker.me[current]/profile.name
// or equivalently:
me://profile.name
```

Forces resolution on the monad receiving the request. No topological resolution is needed. Phase 1 is a no-op.

### 5.2 `[monad-name]` — technical monad route override

```
me://jabellae.cleaker.me[monadlisa]/profile
```

1. Derive `target_id = HMAC-SHA256(namespace_key, "monad:monadlisa")`
2. Look up endpoint in monad index
3. If not found: `NRP_ERROR_monad_NOT_FOUND`
4. If found but unreachable: `NRP_ERROR_monad_UNREACHABLE`
5. If found and reachable: proceed to semantic resolution

This is for diagnostics, debugging, replay, or advanced routing. It changes execution, not meaning.

These two URIs identify the same semantic target:

```
me://jabellae.cleaker.me[monadlisa]/profile
me://jabellae.cleaker.me[monadluis]/profile
```

Both target:

```
jabellae.cleaker.me/profile
```

The selector only decides which monad is asked.

### 5.3 `[monad-a,monad-b]` — technical monad set override

```
me://jabellae.cleaker.me[monadlisa,worker-a]/tasks/next
```

An explicit set selector constrains execution to a bounded group of monads. The mesh may compare hashes, require quorum, or use another policy, but it must still resolve the same namespace/path target. Reads should prefer one coherent disclosure envelope unless the caller explicitly requests a multi-response diagnostic.

### 5.4 Mesh control plane is a path, not a selector

```
me://jabellae.cleaker.me/.mesh/monads
me://jabellae.cleaker.me/.mesh/monads/monadlisa/status
me://jabellae.cleaker.me/.mesh/monads/monadlisa/endpoint
```

monad registry, budget, placement, capability, and endpoint data live in the namespace tree as control paths. They are not selector semantics.

This keeps the selector model pure:

```
namespace/path              -> meaning
namespace[monadlisa]/path   -> same meaning, forced execution route
namespace/.mesh/monads      -> control/introspection path
```

The `.mesh` branch is sensitive and should be treated as a secret/control space by default.

### 5.5 `[]` — compatibility alias for default synthesis

```
me://jabellae.cleaker.me[]/profile
```

`[]` may be accepted as a compatibility or diagnostic spelling of default synthesis, but it is not the canonical user-facing form.

These should resolve to the same semantic target:

```
me://jabellae.cleaker.me/profile
me://jabellae.cleaker.me[]/profile
```

The preferred public form is `namespace/path`.

### 5.6 `[claim:token]` — pairing handshake

```
me://jabellae.cleaker.me[claim:CLAIM_PAYLOAD]/new-monad
```

Triggers the claim ceremony (Section 4). Does not proceed to semantic resolution — the claim selector is a control-plane operation, not a data-plane operation.

### 5.7 `[surface:name]` — compatibility selector

```
me://jabellae.cleaker.me[surface:iphone]/runtime/battery
```

`[surface:name]` is a compatibility selector from earlier drafts. New implementations should model runtime agents as monads and prefer `[monad-name]`. A compatibility layer may map `[surface:name]` to a monad selector or derive the old `surface_id`.

---

## 6. The Disclosure Model
This is what a target monad returns for each category of path request. This model must be implemented consistently across all monads. A monad that leaks structural information in error responses breaks the security model.

### 6.1 Public path
The path exists and is not within any secret scope.
**Returns:** the resolved value.

```json
{
  "status": "ok",
  "path": "profile.name",
  "value": "José Abella",
  "origin": "public"
}
```

### 6.2 Stealth root
The path points to the root of a secret scope (e.g., `wallet` when `wallet` is declared with `["_"]`).
**Returns:** `undefined`. Explicitly. Not a 404, not an error, not a "path not found." The absence is honest and intentional.

```json
{
  "status": "ok",
  "path": "wallet",
  "value": null,
  "origin": "stealth"
}
```

The distinction between `null` (stealth root) and `NRP_ERROR_PATH_NOT_FOUND` (path does not exist at all) is architectural. Callers must not be able to distinguish "this path is secret" from "this path does not exist" — both return a form of `undefined`. The implementation choice of `null` vs. omitting the field is left to the transport binding, but the semantics must be indistinguishable to an observer without the secret key.

### 6.3 Secret leaf — correct key
The path is within a secret scope, and the requesting monad presents the correct key (via the `secret:key@` prefix in the URI, or through a pre-established shared secret).

**Returns:** the resolved value.

```json
{
  "status": "ok",
  "path": "wallet.balance",
  "value": 12480,
  "origin": "stealth"
}
```

### 6.4 Secret leaf — wrong or absent key
The path is within a secret scope, and the requesting monad does not present the correct key, or presents no key.
**Returns:** same envelope as stealth root. The response must be indistinguishable from case 6.2. A wrong key must not produce a different error than no key.

```json
{
  "status": "ok",
  "path": "wallet.balance",
  "value": null,
  "origin": "stealth"
}
```

This is the "fail closed, leak nothing" invariant. It directly mirrors the `["_"]` axiom in the `.me` kernel (A0 + A2).

### 6.5 Path does not exist
The path is not declared in the kernel and is not within any secret scope.

**Returns:**

```json
{
  "status": "not_found",
  "path": "does.not.exist"
}
```

This is the only case where a `not_found` status is returned. It must only be returned for genuinely absent paths that are not near any secret scope. If there is any ambiguity about whether a path might be secret, return the stealth envelope (6.2) instead.

---

## 7. monad Index Synchronization
The monad index is local on each authorized monad. When monads reconnect after being offline, they may have divergent views of the index. The protocol uses a simple Last-Write-Wins (LWW) strategy, consistent with the `.me` kernel's A9 axiom (deterministic conflict resolution).

### 7.1 Sync on reconnect
When monad A reconnects to monad B:
1. A sends its monad index version vector (a map of `monad_id → last_seen_timestamp`)
2. B compares against its own version vector
3. Each sends the other the entries that are newer on its side
4. Both apply the updates using LWW on `last_seen` timestamp

### 7.2 monad expiry
A monad entry that has not updated its `last_seen` timestamp within a configurable window (e.g., 30 days) may be marked stale. Stale monads are kept in the index but deprioritized in routing. They are not deleted automatically — deletion requires an explicit `["-"]` operation by a namespace holder.

### 7.3 Endpoint volatility
Endpoint descriptors are volatile. A monad's IP address, NetGet placement, or relay address may change frequently. Each monad is responsible for updating its own endpoint descriptor in the index whenever its transport address changes, and publishing the update to all online monads.

---

## 8. Error Reference
| Code                            | Meaning                                                   |
| ------------------------------- | --------------------------------------------------------- |
| `NRP_ERROR_monad_NOT_FOUND`     | `monad_id` not in local index                             |
| `NRP_ERROR_monad_UNREACHABLE`   | monad_id found but endpoint not reachable                 |
| `NRP_ERROR_SURFACE_NOT_FOUND`   | Compatibility alias for `NRP_ERROR_monad_NOT_FOUND`       |
| `NRP_ERROR_SURFACE_UNREACHABLE` | Compatibility alias for `NRP_ERROR_monad_UNREACHABLE`     |
| `NRP_ERROR_CLAIM_EXPIRED`       | claim token TTL exceeded                                  |
| `NRP_ERROR_CLAIM_INVALID`       | HMAC verification failed                                  |
| `NRP_ERROR_CLAIM_CONSUMED`      | nonce already used                                        |
| `NRP_ERROR_NAMESPACE_UNKNOWN`   | no namespace key available for this namespace             |
| `NRP_ERROR_PATH_NOT_FOUND`      | path does not exist and is not near any secret scope      |
| `NRP_ERROR_TRANSPORT`           | network-level failure (connection refused, timeout, etc.) |

---

## 9. What Is Not Specified Here (draft scope)
The following are intentionally deferred to later versions:
**Transport binding** — This document specifies the protocol semantics, not the wire format. A future transport binding document will specify the exact message encoding (JSON-over-WebSocket, protobuf, etc.) and the TLS/noise handshake for monad-to-monad connections.
**Relay infrastructure** — When two monads cannot reach each other directly (NAT, firewall, different networks), a relay is needed. The relay protocol is not specified here. The relay must not be able to read message content — it is a blind forwarder. Relay discovery and selection are deferred.
**NetGet placement binding** — NetGet can resolve physical placement such as iPhone, Raspberry Pi, VM, or localhost into endpoint descriptors. This document specifies the semantic role of those descriptors, not the NetGet deployment API.
**Namespace key distribution across monads** — This document assumes the namespace key is already present on the requesting monad. The initial key bootstrap (how the first monad gets the namespace key from the derivation seed) is specified by the `.me` kernel, not the NRP. Subsequent key sharing is handled by the claim ceremony (Section 4).
**Multi-namespace resolution** — A monad may hold keys for multiple namespaces. How a monad selects the correct namespace key when a URI omits the namespace qualifier is implementation-defined in this draft.
**Revocation** — How to revoke a monad from a namespace (e.g., a lost device or compromised runtime) without a central authority is an open problem. A candidate mechanism is a signed revocation entry in the monad index, propagated to all monads. Deferred to a future version.

---

## 10. Design Principles
These are the invariants that any implementation must preserve. They are not implementation details — they are the protocol's soul.
**1. No central registry.** The monad index is local to each namespace holder. Discovery requires holding the namespace key. There is nothing to hack that reveals a complete list of monads or identities.
**2. Identity is computation, not storage.** A monad's identity is derived from a key and a name. It is not assigned by an authority and not stored in a global directory.
**3. Honest absence.** A stealth root returns `undefined`, not an error. The protocol does not reveal the existence of secret scopes to parties without the key. Absence and secrecy are indistinguishable from the outside.
**4. Fail closed.** Wrong keys produce the same response as absent keys. The protocol leaks no information about why a resolution returned `undefined`.
**5. Minimum exposure.** monads exchange only what is necessary. Default resolution sends path read requests and reconciliation material — not the full kernel state, not the full monad index, not any metadata beyond what the request requires.
**6. Mathematical fragmentation.** No single monad must hold a complete picture of any namespace. The identity is distributed across monads by design. Stealing one monad does not compromise the namespace.
**7. Offline-capable.** Local resolution (`[current]` or no selector) works with no network access. The protocol degrades gracefully: offline monads are skipped or deprioritized, missing monads return `NRP_ERROR_monad_UNREACHABLE`. The local kernel is never blocked by network state.
**8. The namespace is a semantic filesystem.** The namespace is not a server, not an endpoint, not an account. It is the living, distributed, encrypted graph of who you are, what you have, and what the mesh can execute or deliver on your behalf. Paths in the namespace behave like paths in a filesystem — with mounts, secret scopes, executable handlers, and remote resources. The mesh is the transport layer that makes this filesystem accessible from anywhere, like NFS or IPFS — but semantic, encrypted, and under sovereign control.
**9. monads are invisible execution routes.** The canonical address is `namespace/path`. `namespace[monadA]/path` and `namespace[monadB]/path` are technical overrides that point to the same semantic node through different execution routes.
**10. Default resolution is synthesis, not a list.** `namespace/path` returns one coherent disclosure envelope. Parallel querying, quorum, latest-hash selection, and authority policy are internal strategies.

*Meaning lives in the namespace. Execution lives in the mesh.*

---

## Appendix A — Formal Grammar (ABNF, semantic path draft)

The canonical user-facing grammar is semantic:

```abnf
me-uri       = "me://" [ namespace ] [ "/" path ]

namespace    = 1*( ALPHA / DIGIT / "." / "_" / "-" )
path         = *( VCHAR / "/" )
```

A selector exists only in the advanced grammar and should be omitted in normal user-facing addresses.

Advanced technical selectors may constrain execution without changing meaning:

```abnf
advanced-me-uri = "me://" [ namespace ] selector [ "/" path ]
selector       = "[" ( "current" / monad-list / empty-selector / "claim:" token / legacy-surface ) "]"
monad-list     = monad-name *( "," monad-name )
monad-name     = 1*( ALPHA / DIGIT / "-" / "_" )
empty-selector = ""
legacy-surface = "surface:" monad-name
token          = 1*( ALPHA / DIGIT / "-" / "_" )
```

Control-plane and introspection data are ordinary paths, not selectors:

```abnf
mesh-path      = ".mesh" [ "/" mesh-subpath ]
mesh-subpath   = *( VCHAR / "/" )
```

The `secret:key@namespace` prefix for authenticated access is parsed as:

```abnf
me-uri-auth  = "me://" "secret:" secret-key "@" namespace [ selector ] [ "/" path ]
secret-key   = 1*( ALPHA / DIGIT / "-" / "_" )
```

---

## Appendix B — Current HTTP Binding (Compatibility Layer)
The canonical resource grammar remains the one defined in this document:

```text
me://namespace/path
```

The current `monad.ai` server already supports a primary HTTP binding in which the namespace is resolved from the `Host` header and the daemon remains local/offline-first as a monad runtime.

### Primary HTTP binding
- `GET /<path>` with `Host: <namespace>` — read from the namespace resolved from `Host`
- `POST /` with `Host: <namespace>` and `{"operation":"write", "expression":"...", "value":..., "identityHash":"..."}` — write into the namespace resolved from `Host`
- `POST /` with `Host: <namespace>` and `{"operation":"claim", "secret":"...", "proof":{...}}` — perform a claim against the namespace resolved from `Host`
- `POST /` with `Host: <namespace>` and `{"operation":"open", "secret":"...", "identityHash":"..."}` — reopen the namespace resolved from `Host`

In this binding, the transport endpoint may still be local, such as `http://localhost:8161`, while the semantic namespace is selected through `Host`. This is consistent with a local/offline-first monad acting as the material runtime for a semantic namespace.

### Current implementation notes
- Read uses the path in the URL, while write currently uses the `expression` field in the request body. These refer to the same semantic selector, but they are serialized differently in each direction in the current implementation.
- Write authorization on a claimed namespace is enforced. In the current implementation, a write is accepted when the request body `identityHash` matches the stored claim identity hash, or when the request carries a valid signature verifiable against the claim's stored public key.
- Claim currently accepts a hybrid proof model: `proof` (Ed25519 signature) proves identity, while `secret` still seeds the unlock state. Open currently remains anchored to `identityHash`, while `secret` acts as an unlock key for reopening the namespace state.

### Deprecated / compatibility routes
The current server implementation may also expose overlapping compatibility routes in addition to the primary binding. In particular, the current `monad.ai` server exposes:

- `POST /claims` — a profile-oriented claim bootstrap endpoint. In the current implementation it expects `namespace`, `secret`, `identityHash`, and profile fields such as `username`, `name`, `email`, and `phone`.
- `POST /claims/open` — an HTTP endpoint for reopening a claimed namespace and recovering its state. In the current implementation it expects `namespace`, `secret`, and `identityHash`.
- `POST /me/kernel:claim/<namespace>` and `POST /me/kernel:open/<namespace>` — bridge routes that expose kernel command targets over HTTP.

These routes are part of the current implementation and compatibility layer. They do not redefine the canonical `me://` resource grammar described by the NRP, and they should not be treated as the primary expression of the protocol.

These bindings also only partially overlap. They may validate different request bodies, return different status codes, or expose different behavior during bootstrap and testing. They should not be treated as equivalent transport expressions of the protocol.

A future transport binding document may replace or consolidate these routes, but any such wire-level evolution must preserve the canonical resource identity described here.

---

## Appendix C — Open Questions for v0.2
These are the questions this document intentionally leaves open, in priority order:
1. **Relay protocol** — How do two monads on different networks find a common relay, and how does the relay stay blind?
2. **monad revocation** — How does a namespace holder revoke a lost or compromised monad without a central authority?
3. **Namespace discovery** — Can a monad discover other namespaces it does not already hold keys for? (Current answer: no. Is this the right answer forever?)
4. **Index consistency under partition** — If the mesh is partitioned for a long time and monads update their own entries, what is the merge strategy beyond LWW?
5. **Derivation-based namespace bootstrap** — Should the namespace key be derivable from a BIP-39 mnemonic or similar standard seed phrase, so it can be reconstructed without any network access?
6. **Cross-namespace pointers** — The `["->"]` operator in `.me` can create semantic links between namespaces. How does the NRP resolve a path that crosses namespace boundaries?

---

**∴ Witness our seal**
**suiGn / neurons.me**
**v0.2.0-draft**
