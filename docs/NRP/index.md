---
layout: gui-doc
title: "NRP — Namespace Resolution Protocol"
description: "How a me:// URI is resolved from a symbolic address into a concrete value across a mesh of surfaces: the normative spec (v0.3.0), the v0.4.0 draft, history, and the implementation in monad."
root_url: https://neurons-me.github.io/
root_title: neurons.me
mepath: []
crumb: NRP
docs_url: https://neurons-me.github.io/docs/
github_url: https://github.com/neurons-me/neurons-me.github.io/tree/main/docs/NRP
canonical: https://neurons-me.github.io/NRP/
---

# NRP — Namespace Resolution Protocol
**neurons.me / suiGn** · **License:** CC0 1.0 Universal — Public Domain

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

**[NRP v0.3.0](./v.0.3.0.html)** —
current. Covers the core resolution grammar, disclosure model, Total Monad
Synthesis, and the HTTP + WebSocket transport bindings.

**[NRP v0.4.0 — draft](./v.0.4.0-draft.html)** — in progress, not normative
yet. Binds the address to the Island `I = (path, ciphertext, T, A, C)`:
one path grammar shared with `.me`, audiences, capabilities; open decisions
are marked.

## Historical specs

- [v0.2.1](./v.0.2.1.html) —
  archived, implemented mesh draft through `monad.ai` Phase 6. Superseded by v0.3.0.
- [v0.1.2](./v.0.1.2.html) — first stable working document.

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

NRP's reference implementation is [`monad.ai`](https://neurons-me.github.io/monad/docs/): the
[monad docs](https://neurons-me.github.io/monad/docs/) cover the mesh resolver, scoring, the `/nrp`
WebSocket binding, and the implementation status (what is actually built versus what the spec
describes), separately from the normative document itself.

Apps reaching a monad through [netget](https://neurons-me.github.io/netget/docs/)'s
mesh (rather than talking to `monad.ai` directly) should read *Apps Over Netget* in the
[netget docs](https://neurons-me.github.io/netget/docs/) for the addressing contract (`/apps/:name`)
and the live HTTP+WebSocket pattern built on top of this protocol.

---

Supplementary docs that live only here (not duplicated in monad's own docs), and where NRP is implemented:

## See also

- [Surface Access Points and Routing](./Surface-Access-Points-and-Routing.html)
- [Beatle](./Beatle.html)
- [Disclosure Levels](./Disclosure-Levels.html)
- [NRP Expression Parser](./NRPExpression-Parser.html)
- [Namespace Channel](./NamespaceChannel.html)
- [Surface and Overlay](./Surface-and-Overlay.html)
- [Virtual Hosts As Semantic Containers](./Virtual-Hosts-As-Semantic-Containers.html)
- [monad docs](https://neurons-me.github.io/monad/docs/)
- [cleaker docs](https://neurons-me.github.io/Cleaker/docs/)
- [netget docs](https://neurons-me.github.io/netget/docs/)
- [me:// URI grammar](https://neurons-me.github.io/.me/docs/me-uri.html)
