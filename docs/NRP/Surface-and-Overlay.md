# Surface and Overlay

The `@` operator in an NRP expression overlays a namespace onto a surface.

---

## Concept

Normal internet: you visit `https://wikipedia.com`. One channel. The page serves you.

With Beatle + NRP: you visit `https://wikipedia.com` as normal, and you also open a channel to `me://jabellae @ wikipedia.com`. Two channels coexist.

```txt
Browser HTTP:   https://wikipedia.com/Scarab  (stateless, public)
Beatle NRP:     me://jabellae @ wikipedia.com  (bidirectional, namespaced)
```

You read the Wikipedia article as anyone would. You also have an open `.me` session projected over that surface — annotations, shared context, audience, capabilities — whatever `jabellae`'s namespace exposes there.

---

## Syntax

```txt
namespace @ surface

jabellae @ wikipedia.com
jabellae + alex @ wikipedia.com
(jabellae ∩ team.acme) @ "https://wikipedia.com/Scarab"
```

Quoted surfaces support full URIs:

```txt
jabellae @ "https://wikipedia.com/Scarab"
jabellae @ "https://docs.internal.acme.com/api/v2"
```

Bare surfaces are hostname tokens:

```txt
jabellae @ wikipedia.com
jabellae @ localhost
jabellae @ suis-macbook-air.local
```

---

## Precedence

`@` binds tighter than `∩` and `+`:

```txt
jabellae + alex @ wikipedia.com
  = jabellae + (alex @ wikipedia.com)
```

To overlay a union, use parentheses:

```txt
(jabellae + alex) @ wikipedia.com
```

---

## What Surface Means to the Resolver

The surface is a hint to the NRP server about the context of the channel. The server may:

- Use the surface to scope the resolved capabilities (e.g. "what does `jabellae` expose specifically on `wikipedia.com`?")
- Include surface in the audience computation
- Constrain disclosure based on surface policy

The surface value is passed through the `NamespaceChannel.surface` field after resolution.

---

## Surfaces in the Stack

```txt
Surface type       Example
──────────────     ─────────────────────────────
local monad        suis-macbook-air.local
hostname           cleaker.me
full URI           "https://wikipedia.com/Scarab"
service endpoint   "ws://local.netget/nrp"
```

---

## See Also

- [NRP Expression Parser](./NRPExpression-Parser.md)
- [NamespaceChannel](./NamespaceChannel.md)
- [Surface Access Points and Routing](./Surface-Access-Points-and-Routing.md)
- [Namespace Protocol Resolution](./Namespace-Protocol-Resolution.md)
