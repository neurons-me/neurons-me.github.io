---
layout: readme
title: Virtual Hosts As Semantic Containers
---

# Virtual Hosts As Semantic Containers

**Status: proposed direction, not yet implemented.** Three of the four
pieces below already exist and are proven in production use (see "What's
already true"). The fourth — treating a virtual host as a queryable
observability/governance subject — is a design sketch, not a built feature.
This page states the direction so the shape is on record before the work
starts.

---

## The formula

```
host virtual = surface address + monad identity + .me namespace + netget policy
```

Every app running on the neurons.me mesh is, structurally, a **virtual
host** — the same idea as classic name-based virtual hosting, composed from
four parts that already have names elsewhere in this stack:

| Part | What it is | Where it's defined |
|---|---|---|
| **Surface address** | The hostname/path a request arrives on — `local.netget/apps/:name`, `<name>.local`, a public domain | [Surface Access Points and Routing](./Surface-Access-Points-and-Routing.md) |
| **Monad identity** | The process serving the surface — its own `SEED`, its own keypair, its own `self.json` | [monad.ai](https://neurons-me.github.io/monad/) |
| **`.me` namespace** | The semantic space the monad resolves reads/writes against | [NRP v0.3.0](https://neurons-me.github.io/monad/Typescript/typedocs/NRP-v0.3.0.html) |
| **netget policy** | What the gateway exposes, proxies, and allows through for this surface | [Monad Exposure Policy](https://neurons-me.github.io/netget/Typescript/typedocs/monad-exposure-policy.html) |

A "virtual host," in this sense, isn't a new primitive — it's naming the
composite that already forms every time an app is wired onto the mesh this
way. [Apps Over Netget](https://neurons-me.github.io/netget/Typescript/typedocs/AppsOverNetget.html)
documents one concrete instance of exactly this composite, end to end.

---

## What's already true

- **Cryptographic isolation per host** — each monad instance holds its own
  `SEED`, from which its `.me` identity and keypair derive. Two apps on the
  same machine, two different SEEDs, two disjoint secret scopes. Not a
  proposal — this is how `self.json` already works for every monad running
  today.
- **Namespace scoping** — a monad only resolves paths inside the `.me`
  namespace it was configured with (`ME_NAMESPACE`). One monad cannot read
  or write another's namespace by construction, not by an access-control
  check layered on top.
- **Policy at the edge** — netget's exposure policy already decides, per
  registered monad, what's reachable from outside (`exposure.inbound.*` in
  the registration payload) before a request ever reaches app code.
- **Address plurality** — the same monad is already reachable through
  multiple surface addresses simultaneously (`local.netget/apps/:name`,
  a bare `hostname.local`, eventually a public domain) without those
  addresses needing to agree on anything beyond routing to the same target.

Put together, these four already make each app a distinct, isolated,
independently-addressed unit. What's missing is treating that unit as a
**first-class subject you can query** — not just infrastructure that happens
to be isolated, but something the mesh can report on.

---

## What's not yet built: the observability/governance layer

Today, per-host state is scattered and not unified: `usageLedger.ts` tracks
some usage internally, `self.json` carries static capacity fields,
`apps.json` tracks `lastSeenMs`/heartbeat health — but there's no single
place to ask "how is this virtual host doing" the way you can ask
"what does this namespace resolve to."

The direction: expose virtual-host state itself through the same `.me`
addressing this whole stack already uses for everything else, rather than
inventing a separate metrics system. Illustrative path shapes — **not
committed syntax**, this needs real design work against NRP's actual
expression grammar before anything is built:

```
netget.host[fulltrailer.local].usage.cpu
netget.host[fulltrailer.local].traffic.requests[]
apps.fulltrailer.metrics.uptime
```

The governance half is the same idea applied to policy instead of metrics:
capability boundaries (what a virtual host is allowed to expose, call, or
read from another namespace) becoming something you can inspect and change
through the mesh's own semantics, instead of only through static config
files and restarts.

## Open questions

- Does per-host telemetry live in the monad (self-reported) or in netget
  (observed at the edge, so a compromised monad can't misreport its own
  usage)? Likely needs both, reconciled — not yet designed.
- What's the actual NRP expression grammar for addressing a *host* rather
  than a *namespace path*? The `netget.host[...]` shape above is
  illustrative; it hasn't been checked against
  [NRP Expression Parser](./NRPExpression-Parser.md)'s real grammar.
- Does this become part of netget's existing exposure-policy object, or a
  new sibling concept? Not decided.

---

## See also

- [Apps Over Netget](https://neurons-me.github.io/netget/Typescript/typedocs/AppsOverNetget.html) — the concrete, already-working instance of surface address + monad identity + `.me` namespace + netget policy, without the observability layer
- [Surface Access Points and Routing](./Surface-Access-Points-and-Routing.md)
- [Monad Exposure Policy](https://neurons-me.github.io/netget/Typescript/typedocs/monad-exposure-policy.html)
- [NRP v0.3.0](https://neurons-me.github.io/monad/Typescript/typedocs/NRP-v0.3.0.html)
- [NRP overview](./index.md)
