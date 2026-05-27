∴ Your mind, running locally.
Robots that Understand Context
Same object means something completely different depending on who is looking at it.
Image: ./media/robots_that_understand_context_gif.gif
Learn more: https://neurons-me.github.io/.me/docs/Robots-That-Understand-Context.html

Smart Cities
Living infrastructure coordinated through semantic systems.
Image: ./media/smart_cities.gif
Learn more: https://neurons-me.github.io/.me/docs/Smart-Cities.html

Social Graph
Explainable relationship networks built on human connection.
Image: ./media/SocialGraph.jpg

---

# neurons-me
neurons-me is a federated semantic compute ecosystem built around .me — a local-first, O(K) reactive knowledge graph engine.

The stack runs 100% locally with end-to-end encryption. Identity is sovereign, computation is contextual, and trust is materialized at the registry level, never re-derived at runtime.

## Current Versions
| Package | npm name | Version |
|---------|----------|---------|
| .me kernel | `this.me` | 3.9.0-0 |
| Cleaker | `cleaker` | 3.2.0-0 |
| Monad | `monad.ai` | 2.2.0-0 |
| NetGet | `netget` | 2.6.51 |

## Core Principle
Resolve local first, towards the outside which is the surface. The surface reflects relationships already resolved internally — it never decides them.

## Architecture Layers (Layer Separation)
| Layer | Module | Role |
|-------|--------|------|
| **WHAT** | `.me` | Semantic meaning — O(k) runtime, 11 axioms, operator algebra |
| **WHERE** | `cleaker` | Namespace binding — replay, identity mounting, context lens |
| **HOW** | transport | HTTP, WS, local IPC, libp2p |
| **STATE** | `monad.ai` | Durable ledger — surfaces, snapshots, federation |
| **COLD** | `DiskStore` | Chunked storage, LRU hot cache, encryption |
| **ROUTE** | `netget` | Registry + proxy mesh, trust materialization |

Full stack relationship: `.me → cleaker → monad.ai → NetGet → cleaker.me`

---

## Key Invariants for LLMs
When working with neurons-me code or concepts:

1. **Identity**: Declared once at boot via `@`. Never re-declared. `identity_hash = keccak256(seed + expression)` is deterministic.
2. **Trust**: Resolved at registry ingest by comparing `identity_hash` vs `claims.owner`. Materialized as `trust` field in `apps.json`. Never re-computed in routing.
3. **Surface**: nginx/`surface_proxy.lua` only reads trust. Gate 1 = trust depth (what routes), Gate 2 = exposure reach (from where).
4. **Navigation**: `@` is identity only. Use `.` for namespace routing. Never mix them.
5. **Reactivity**: `.me` updates are O(K), not O(N). Only actual dependents recompute.
6. **me:// is a published URI scheme (Draft v0.1, CC0)** — not a future proposal. It exists in two distinct forms (see below). It is distinct from the kernel DSL syntax.
7. **Reconstruction, not sync**: `cleaker(me, {secret}) → me.learn()` replays a ledger to reconstruct identical state anywhere. No CRDT, no vector clocks, no sync daemon.
8. **Secrets are holes in the map**: Stealth-roots (A0/A2) make secret branches structurally absent from the public index — not hidden by a flag, but by non-existence in the index.

---

## The Kernel Axioms (A-struct-0 through A9)

There are **11 axioms** total. The core kernel (A-struct-0 through A9) is production-ready. Bulk ingestion (Phase 2.5) is in progress.

| Axiom | Name | Operator | Core Invariant |
|-------|------|----------|----------------|
| A-struct-0 | Unified Callable Surface | — | `me` is simultaneously callable (`me("path")`) and infinitely proxy-chainable (`me.wallet.balance`) |
| A0 | Secret Root Stealth | `_` + read | `me("wallet") → undefined` while `me("wallet.income") → 100` |
| A1 | Identity Normalization | `@` | Identity claims normalized and validated before commit |
| A2 | Path-Bound Secret Scopes | `_` | Secrecy is structural — bound to a path, not a global toggle; deleting parent purges children |
| A3 | Noise Reset | `~` | Secret derivation resets at any chosen boundary; previous secrets become discontinuous |
| A4 | Structural Pointers | `__ / ->` | Pointers auto-deref through topology, not joins |
| A5 | Query as Memory Event | `?` | Queries and observations are first-class memory events, auditable |
| A6 | Tombstone Remove | `-` | Deletes are auditable causal events, not mutations |
| A7 | Public + Secret Coexistence | — | Private operations never leak into or corrupt the public deterministic view |
| A8 | Hash Chain Integrity | — | Every mutation is in a tamper-evident chain; wrong key/tamper/noise/path all fail-closed |
| A9 | Deterministic LWW | — | `(timestamp asc, hash asc)` resolves write collisions; no wall-clock lottery |

---

## me:// URI — Two Forms

`me://` is a **published Draft v0.1 URI scheme (CC0 1.0)**, operationally used by `cleaker` for pointer resolution and by `monad.ai` for the daemon command surface. It is distinct from — and complementary to — the kernel DSL syntax.

| Form | Syntax | Purpose |
|------|--------|---------|
| NRP canonical resource | `me://namespace[selector]/path` | Mesh-wide semantic addressing, cleaker pointer resolution |
| Daemon command surface | `me://namespace:operation/path` | monad.ai internal kernel operations |

**NRP resource examples:**
```
me://jabellae.cleaker.me/profile
me://jabellae.cleaker.me[surface:iphone]/runtime.battery
me://jabellae.cleaker.me[]/chat          ← broadcast to all surfaces
```

**Daemon command examples:**
```
me://self:read/profile
me://self:write/profile.name
me://kernel:export/snapshot
me://kernel:replay/memory
me://kernel:rehydrate/snapshot
me://kernel[device:localhost|protocol:http|port:8161]:export/snapshot
```

---

## Syntax Forms — Disambiguation

The ecosystem uses three distinct syntactic layers. Do not conflate them:

| Form | Example | Context |
|------|---------|---------|
| Proxy API (runtime JS/TS) | `me.wallet["_"].balance = 1000` | JavaScript/TypeScript source code |
| DSL expression string | `@user/devices[device='laptop']/profile` | Strings passed to `me()` callable |
| me:// NRP URI | `me://suign.neurons.me[macbook]/profile.name` | Mesh addressing / cleaker pointer |
| Daemon command | `me://kernel:export/snapshot` | monad.ai internal operations |

---

## Repository Map
- github.com/neurons-me/.me → Core kernel, O(K) graph engine (`this.me`)
- github.com/neurons-me/monad → Federated runtime, sovereign identity (`monad.ai`)
- github.com/neurons-me/netget → Registry, proxy, trust materialization (`netget`)
- github.com/neurons-me/cleaker → Namespace binding, identity context (`cleaker`)
- github.com/neurons-me/all.this → DSL / projections (monorepo)
- github.com/neurons-me/GUI → Interface generation layer

## Start Here
To run the ecosystem: `SEED="your-seed" npm run dev` in monad.
To understand identity: Read `.me` operators, then `monad bootstrap.ts`, then `netget apps.lua derive_trust()`.
To route requests: Check `apps.json` trust field. `owner/admin/peer` = full surface. `guest` = `/health` only.

Privacy is structural.

---

Contact: neurons.me
License: See each repo. URI spec: CC0 1.0.
