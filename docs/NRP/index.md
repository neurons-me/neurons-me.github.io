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
mesh of surfaces.

It closes the gap between two layers, always composed in this order:

- **Semantic resolution** — already implemented in `this.me`: local,
  mathematical, derivation-based. The kernel resolves a path entirely offline.
- **Topological resolution** — the NRP's job: how a requesting surface finds
  and reaches the surface that holds the target namespace, path, and key
  material.

<pre>
me://jabellae.cleaker.me[surface:iphone]/wallet.balance
         │                    │                 │
    <span style="color:#f0883e">topological</span>           <span style="color:#f0883e">topological</span>        <span style="color:#48a090">semantic</span>
    (find the             (find which        (resolve the
     namespace)            surface)           path locally)
</pre>

*Meaning lives in the namespace. Execution lives in the mesh.*

**The normative spec lives here.** NRP is the contract every module follows —
`.me`, cleaker, `monad.ai`, netget, the GUI — so its source of truth sits on
this site, not inside any one implementation. Implementation docs stay with
their code and link back here.

---

## Latest normative spec

**[NRP v0.3.0](./v.0.3.0.md)** —
current. Covers the core resolution grammar, disclosure model, Total Monad
Synthesis, and the HTTP + WebSocket transport bindings.

**[NRP v0.4.0 — draft](./v.0.4.0-draft.md)** — in progress, not normative
yet. Binds the address to the Island `I = (path, ciphertext, T, A, C)`:
one path grammar shared with `.me`, audiences, capabilities; open decisions
are marked.

## Historical specs

- [v0.2.1](./v.0.2.1.md) —
  archived, implemented mesh draft through `monad.ai` Phase 6. Superseded by v0.3.0.
- [v0.1.2](./v.0.1.2.md) — first stable working document.

## Relationship to cleaker

NRP is **not** cleaker. Cleaker owns the namespace **grammar** — parsing and
composing `me://` expressions (`parseNamespaceExpression`, `composeNamespace`)
— the layer between a raw string and something NRP can act on. NRP itself —
discovery, scoring, forwarding, Total Monad Synthesis, the `/nrp` WebSocket
binding — is implemented in `monad.ai`'s kernel, using cleaker purely as a
parsing dependency. If you're looking for where namespace *strings* get
parsed, that's cleaker. If you're looking for where a namespace gets
*resolved to a live surface*, that's NRP, in monad.

## Implementation

NRP's reference implementation is [`monad.ai`](https://neurons-me.github.io/monad/) —
[implementation status](https://neurons-me.github.io/monad/Typescript/typedocs/Mesh/status.html)
tracks what's actually built versus what the spec describes, separately from
the normative document itself.

Apps reaching a monad through [netget](https://neurons-me.github.io/netget/)'s
mesh (rather than talking to `monad.ai` directly) should read
[Apps Over Netget](https://neurons-me.github.io/netget/Typescript/typedocs/AppsOverNetget.html)
for the addressing contract (`/apps/:name`) and the live HTTP+WebSocket
pattern built on top of this protocol.

---

## See also

Supplementary docs that live only here (not duplicated in monad's own docs):

- [Surface Access Points and Routing](./Surface-Access-Points-and-Routing.md) — how HTTP requests physically reach a surface
- [Beatle](./Beatle.md) — the NRP WebSocket client component
- [Disclosure Levels](./Disclosure-Levels.md)
- [NRP Expression Parser](./NRPExpression-Parser.md)
- [Namespace Channel](./NamespaceChannel.md)
- [Surface and Overlay](./Surface-and-Overlay.md)
- [Virtual Hosts As Semantic Containers](./Virtual-Hosts-As-Semantic-Containers.md) — proposed direction: `host virtual = surface address + monad identity + .me namespace + netget policy`
