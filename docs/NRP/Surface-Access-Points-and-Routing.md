---
layout: readme
title: Surface Access Points and Routing
---

# Surface Access Points and Routing

Every surface in the neurons.me mesh is reachable through multiple access points simultaneously. The same monad — the same namespace, the same kernel — can be reached from a local machine, a LAN device, or the public internet. The routing layer (NetGet + OpenResty) decides which surface handles each incoming request based on the hostname.

This document describes the concrete access points and how each one resolves to a surface.

---

## The Stack

Two components cooperate to route requests:

- **NetGet** — operates the OpenResty gateway, owns the nginx config, manages the routing table, serves the admin UI.
- **Monad** — registers itself with NetGet via heartbeat, provides the surface that handles routed requests.

NetGet routes. Monad serves. Neither can do the other's job.

---

## Access Points

### `local.netget` — Gateway Admin

| Property | Value |
|---|---|
| Also reachable as | `localhost`, `127.0.0.1` |
| Handled by | NetGet Express (:3432) |
| Surface | NetGet Dashboard |

The management interface for the local gateway. This is where you register domains, inspect the monad mesh, view logs, and configure the gateway. Not a user-facing surface — it is the operator surface.

The frontend served here is the **NetGet Dashboard app**, built with `this.gui`.

---

### `hostname.local` — Namespace Root Surface

| Property | Value |
|---|---|
| Example | `suis-macbook-air.local` |
| Handled by | `surface_proxy.lua` → active monad |
| Resolved via | Monad registration table (`apps.json`) |
| Surface | Monad with highest `lastSeenMs` for this namespace root |

The machine's mDNS hostname becomes the root access point for its namespace. A request to `suis-macbook-air.local` is proxied to whichever monad registered most recently — the "winning" surface of that namespace.

This is the local-network entry point for the namespace. No DNS, no internet required.

---

### `{handle}.hostname.local` — Handle Identity Surface

| Property | Value |
|---|---|
| Example | `jabellae.suis-macbook-air.local` |
| Handled by | `nrp_handle.lua` → NRP handle lookup → monad |
| Resolved via | Handle registry on the gateway |
| Surface | Monad owning that handle |

A subdomain of the machine hostname where the subdomain is a `.me` handle. The Lua handler resolves the handle to a monad and proxies accordingly.

This is the NRP topological resolution layer in action at the local level: a symbolic handle maps to a concrete surface.

---

### `localhost:PORT` — Direct Monad Access

| Property | Value |
|---|---|
| Example | `localhost:3000` |
| Handled by | Monad Express directly |
| Bypasses | nginx / OpenResty entirely |
| Use | Development, debugging |

Connects directly to a specific monad instance by port, bypassing the gateway. Useful during development to test a monad in isolation. Not intended for production use — no mesh routing, no surface synthesis, no NRP resolution.

---

### `IP:80` / `IP:443` — Public Gateway

| Property | Value |
|---|---|
| Example | `187.146.246.96` |
| Handled by | NetGet OpenResty (same config as local) |
| Surface | Same as `local.netget` if no domain is mapped |

The same OpenResty instance that handles `local.netget` also listens on the machine's public IP. If no domain routing rule matches, falls back to the NetGet Dashboard.

When a domain is registered in the routing table and DNS points to this IP, the request is routed to the appropriate monad surface.

---

### `domain.com` — Public Named Surface

| Property | Value |
|---|---|
| Example | `netget.site`, `jabellae.me` |
| Requires | DNS A record → public IP |
| Handled by | `surface_proxy.lua` → routing table |
| Surface | Monad registered for that domain |

Public domains are registered through the NetGet Dashboard (`/domains`). The routing table maps `domain → target monad`. When a request arrives with a matching `Host` header, OpenResty proxies it to the registered target.

Changes to the routing table hot-reload nginx — no restart required.

---

## Resolution Order

```
Incoming HTTP request
  │
  ├─ Host: local.netget / localhost / 127.0.0.1
  │     └─→ NetGet Dashboard (admin UI)
  │
  ├─ Host: hostname.local
  │     └─→ surface_proxy.lua → monad with highest lastSeenMs
  │
  ├─ Host: handle.hostname.local
  │     └─→ nrp_handle.lua → handle lookup → monad
  │
  ├─ Host: registered-domain.com
  │     └─→ routing table → target monad
  │
  └─ Host: (no match)
        └─→ NetGet Dashboard (fallback)
```

---

## Relation to NRP

The NRP specifies *how* a `me://` URI resolves across the mesh — the protocol. Surface Access Points are *where* that resolution is triggered: the physical entry points through which a request enters the mesh and begins traversal.

Every access point above is a potential starting node for NRP topological resolution. The hostname determines which surface receives the request; NRP then determines what that surface returns.

---

## See Also

- [Namespace Resolution Protocol](./index.md)
- [NRP v0.2.1 — Mesh Draft](./v.0.2.1.md)
- [Initiating Monads](https://neurons-me.github.io/monad/docs/Initiating-Monads.html)
- [Monad: Subtractive Synthesis](https://neurons-me.github.io/monad/docs/Subtractive-Synthesis.html)
