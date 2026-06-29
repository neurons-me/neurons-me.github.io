---
layout: readme
title: NRP — Namespace Resolution Protocol
---

# NRP — Namespace Resolution Protocol
**neurons.me / suiGn**
**License:** CC0 1.0 Universal — Public Domain

---

## Preamble

The **Namespace Resolution Protocol (NRP)** specifies how a `me://` URI is
resolved from a symbolic address into a concrete value, across a distributed
mesh of surfaces — without a central registry, without a central server, and
without requiring persistent connectivity.

It closes the gap between two layers, always composed in this order:

- **Semantic resolution** — already implemented in `this.me`: local,
  mathematical, derivation-based. The kernel resolves a path entirely offline.
- **Topological resolution** — the NRP's job: how a requesting surface finds
  and reaches the surface that holds the target namespace, path, and key
  material.

```
me://jabellae.cleaker.me[surface:iphone]/wallet.balance
         │                    │                 │
    topological           topological        semantic
    (find the             (find which        (resolve the
     namespace)            surface)           path locally)
```

*Meaning lives in the namespace. Execution lives in the mesh.*

This page is the canonical entry point for the protocol — every version below
is a snapshot of the spec at a point in time. Newer versions supersede older
ones but don't erase them; the mesh, like the kernel, keeps its history.

---

## Versions

| Version | Status | |
|---|---|---|
| [v0.2.1](./v.0.2.1.md) | Implemented mesh draft — through `monad.ai` Phase 6 | latest |
| [v0.1.2](./v.0.1.2.md) | First stable working document | |

---

## See also

- [NRP Implementation Status](https://neurons-me.github.io/monad/Typescript/typedocs/NRP/status.html)
- [NRP Scoring Engine](https://neurons-me.github.io/monad/Typescript/typedocs/NRP/scoring.html)
- [NRP Test Documentation](https://neurons-me.github.io/monad/Typescript/typedocs/NRP/testing.html)
- [NRP Learning Loop](https://neurons-me.github.io/monad/Typescript/typedocs/NRP/learning-loop.html)
- [NRP Learning Observability](https://neurons-me.github.io/monad/Typescript/typedocs/NRP/learning-observability.html)
