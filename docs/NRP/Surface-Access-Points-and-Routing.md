---
layout: readme
title: Surface Access Points and Routing
---

# Surface Access Points and Routing

Every surface in the neurons.me mesh is reachable through multiple access points simultaneously. The same monad — the same namespace, the same kernel — can be reached from a local machine, a LAN device, or the public internet. The routing layer (NetGet + OpenResty) decides which surface handles each incoming request based on the hostname.

<style>
.sap-table { width: 100%; border-radius: 10px; overflow: hidden; border: 1px solid #1a2a38; background: #0f1720; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; margin: 24px 0; }
.sap-header { display: grid; grid-template-columns: 220px 1fr 180px 28px; background: #162030; padding: 8px 20px; border-bottom: 1px solid #1a2a38; }
.sap-header span { font-size: 10px; font-weight: 700; letter-spacing: 0.1em; color: #4a5a68; text-transform: uppercase; }
.sap-row { display: grid; grid-template-columns: 220px 1fr 180px 28px; padding: 0 20px; border-bottom: 1px solid #1a2a38; align-items: center; min-height: 48px; text-decoration: none; transition: background 120ms; }
.sap-row:last-of-type { border-bottom: none; }
.sap-row:nth-child(even) { background: #162030; }
.sap-row:hover { background: #1e3048; }
.sap-addr { font-family: monospace; font-size: 13px; font-weight: 700; }
.sap-dest { font-size: 12px; color: #cdd8e0; }
.sap-surface { font-size: 12px; font-weight: 600; }
.sap-arrow { font-size: 14px; color: #2a3d52; transition: color 120ms; }
.sap-row:hover .sap-arrow { color: #4fc3f7; }
.sap-netget { color: #4fc3f7; }
.sap-monad  { color: #81c784; }
.sap-direct { color: #ffb74d; }
.sap-public { color: #ce93d8; }
.sap-legend { display: flex; gap: 20px; padding: 10px 20px; border-top: 1px solid #1a2a38; background: #0f1720; }
.sap-legend-item { display: flex; align-items: center; gap: 6px; font-size: 10px; color: #4a5a68; }
.sap-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
</style>

<div class="sap-table">
  <div class="sap-header">
    <span>Address</span><span>Handled by</span><span>Surface</span><span></span>
  </div>
  <a class="sap-row" href="https://neurons-me.github.io/netget/Typescript/typedocs/NetGet" target="_blank">
    <span class="sap-addr sap-netget">local.netget</span>
    <span class="sap-dest">NetGet Express</span>
    <span class="sap-surface sap-netget">NetGet Dashboard</span>
    <span class="sap-arrow">↗</span>
  </a>
  <a class="sap-row" href="https://neurons-me.github.io/monad/docs/Initiating-Monads" target="_blank">
    <span class="sap-addr sap-monad">hostname.local</span>
    <span class="sap-dest">surface_proxy.lua → Monad</span>
    <span class="sap-surface sap-monad">Namespace Root</span>
    <span class="sap-arrow">↗</span>
  </a>
  <a class="sap-row" href="https://neurons-me.github.io/NRP/" target="_blank">
    <span class="sap-addr sap-monad">{handle}.hostname.local</span>
    <span class="sap-dest">nrp_handle.lua → Monad</span>
    <span class="sap-surface sap-monad">Handle Surface</span>
    <span class="sap-arrow">↗</span>
  </a>
  <a class="sap-row" href="https://neurons-me.github.io/monad/docs/Initiating-Monads" target="_blank">
    <span class="sap-addr sap-direct">localhost:PORT</span>
    <span class="sap-dest">Monad Express (direct)</span>
    <span class="sap-surface sap-direct">Dev / Debug</span>
    <span class="sap-arrow">↗</span>
  </a>
  <a class="sap-row" href="https://neurons-me.github.io/netget/Typescript/typedocs/Placement" target="_blank">
    <span class="sap-addr sap-public">IP:80 / IP:443</span>
    <span class="sap-dest">NetGet OpenResty</span>
    <span class="sap-surface sap-public">Public Gateway</span>
    <span class="sap-arrow">↗</span>
  </a>
  <a class="sap-row" href="https://neurons-me.github.io/netget/Typescript/typedocs/custom-domains" target="_blank">
    <span class="sap-addr sap-public">domain.com</span>
    <span class="sap-dest">surface_proxy.lua → routing table</span>
    <span class="sap-surface sap-public">Public Surface</span>
    <span class="sap-arrow">↗</span>
  </a>
  <div class="sap-legend">
    <div class="sap-legend-item"><div class="sap-dot" style="background:#4fc3f7"></div>NetGet</div>
    <div class="sap-legend-item"><div class="sap-dot" style="background:#81c784"></div>Monad</div>
    <div class="sap-legend-item"><div class="sap-dot" style="background:#ffb74d"></div>Direct</div>
    <div class="sap-legend-item"><div class="sap-dot" style="background:#ce93d8"></div>Public</div>
  </div>
</div>

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
