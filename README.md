<p align="center">
  <a href="https://neurons.me/">
    <img src="https://res.cloudinary.com/dkwnxf6gm/image/upload/v1760629064/neurons.me_b50f6a.png" alt="neurons.me" width="89" />
  </a>
</p>

# neurons.me

###### **Go Algorithmic.**

neurons-me is a federated semantic compute ecosystem built around `.me` — a local-first, O(K) reactive knowledge graph engine. Identity is sovereign, computation is contextual, trust is materialized at the registry — never re-derived at runtime.

## Architecture in One Table

| Layer | Module | npm | Role |
|-------|--------|-----|------|
| **WHAT** | `.me` | `this.me` v3.9.0-0 | Semantic kernel — O(k) reactive graph, 11 axioms |
| **WHERE** | `cleaker` | `cleaker` v3.2.0-0 | Namespace binding — identity mounting, context lens |
| **STATE** | `monad` | `monad.ai` v2.2.0-0 | Durable ledger — surfaces, snapshots, federation |
| **ROUTE** | `netget` | `netget` v2.6.51 | Registry + proxy mesh, trust materialization |
| **HOW** | transport | — | HTTP, WS, local IPC, libp2p |

`.me → cleaker → monad.ai → NetGet → cleaker.me`

## Key Properties
- **O(k) reactivity** — propagation cost bounded by dependency count, not dataset size
- **Structural privacy** — stealth-roots are topologically absent, not flagged
- **Reconstruction not sync** — `cleaker(me, {secret}) → me.learn()` replays deterministically anywhere
- **me:// URI scheme** — published Draft v0.1 (CC0) for mesh addressing and daemon commands
- **11 kernel axioms** (A-struct-0 through A9) — CI-gated, production-ready

## Docs
- [LLM context & architecture](./llm.md)
- [Glossary](./docs/Glossary.md)
- [me:// URI scheme spec](./docs/me.URI.schema.v1.md)
- [Module index](./docs/index.html)

## Repositories
| Module | GitHub | GitHub Pages |
|--------|--------|--------------|
| `.me` kernel | [neurons-me/.me](https://github.com/neurons-me/.me) | [neurons-me.github.io/.me](https://neurons-me.github.io/.me/) |
| cleaker | [neurons-me/cleaker](https://github.com/neurons-me/cleaker) | [neurons-me.github.io/Cleaker](https://neurons-me.github.io/Cleaker/) |
| monad | [neurons-me/monad](https://github.com/neurons-me/monad) | [neurons-me.github.io/monad](https://neurons-me.github.io/monad/) |
| netget | [neurons-me/netget](https://github.com/neurons-me/netget) | [neurons-me.github.io/netget](https://neurons-me.github.io/netget/) |
| all.this | [neurons-me/all.this](https://github.com/neurons-me/all.this) | — |
| GUI | [neurons-me/GUI](https://github.com/neurons-me/GUI) | [neurons-me.github.io/GUI](https://neurons-me.github.io/GUI/) |

**∴ Witness our seal**

**suiGn**
