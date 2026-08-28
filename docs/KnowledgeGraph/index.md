---
layout: readme
title: Knowledge Graph — Semantic Memory as a Queryable Ledger
---

# Knowledge Graph — Semantic Memory as a Queryable Ledger
**neurons.me / suiGn**
**License:** CC0 1.0 Universal — Public Domain

---

## Preamble

Every fact a monad writes into its kernel through `appendSemanticMemory`
becomes a node in an append-only, hash-chained, path-addressable graph —
resolvable through the exact same `me://` machinery as everything else in
`.me`, with no separate registration step. There is no distinct "knowledge
graph database." **The knowledge graph is the kernel's semantic memory log,
read back.**

```
me://suis-macbook-air.local/surface.host.cpu
me://suis-macbook-air.local/surface.host.memory
me://suis-macbook-air.local/surface.host.storage
```

Write it once, through the right primitive, and it is already a graph node —
queryable by exact path, listable by prefix, ordered and hash-chained like
everything else a namespace ever wrote.

**This page is a map, not the spec.** The canonical, normative document —
what actually makes a kernel write part of the graph versus invisible to
it, and the concrete host-telemetry bridge that exercises this — lives
where it's implemented: `monad.ai`. One canonical location, this page just
points to it.

---

## Canonical document

**[The Knowledge Graph](https://neurons-me.github.io/monad/Typescript/typedocs/KnowledgeGraph.html)** —
current. Covers the two kinds of kernel writes (only one produces a graph
node), how a written value becomes resolvable with no extra registration,
the existing `surface.usage.*` precedent, and the host-telemetry bridge
(`surface.host.cpu` / `memory` / `storage`) as a concrete worked example —
including why memory pressure needed a real platform-specific measurement
(macOS `vm_stat`, Linux `/proc/meminfo`) instead of the naive
`os.freemem()` ratio, which reads misleadingly high on a healthy machine.

## Relationship to NRP

This is not a competing protocol to [NRP](../NRP/) — it's the layer NRP
takes for granted. NRP specifies how a `me://` target gets resolved to a
concrete value *across the mesh* (topological resolution: which surface
holds the namespace, how a request reaches it). This document covers what
happens *before* that ever matters: how a value gets into one kernel's own
memory log in the first place, and what makes it show up when something
resolves against that namespace later. NRP assumes a target is already
knowledge; this is how something becomes knowledge.

## Implementation

The reference implementation is [`monad.ai`](https://neurons-me.github.io/monad/) —
`src/claim/memoryStore.ts` (`appendSemanticMemory`, the write primitive),
`src/resources/usageLedger.ts` (the signed, billing-facing usage bridge),
and `src/resources/hostTelemetryLedger.ts` (the unsigned host-telemetry
bridge this document's worked example is drawn from).

The client-facing view of one concrete instance — a host's own CPU/RAM/
storage gauges — is `this.gui`'s `HostSurface` component, rendered at a
host's own root surface (e.g. `local.host`) rather than any claimed
identity's landing page. See
[Virtual Hosts As Semantic Containers](../NRP/Virtual-Hosts-As-Semantic-Containers.html)
for the broader direction this fits into: a host surface as its own
resolvable thing, distinct from any identity claimed on top of it.

---

## See also

- [NRP — Namespace Resolution Protocol](../NRP/) — topological resolution, the layer above this one
- [Virtual Hosts As Semantic Containers](../NRP/Virtual-Hosts-As-Semantic-Containers.html) — the local-host-as-surface direction this document's worked example lives inside
