---
layout: readme
title: Surface Access Points and Routing
---

# Surface Access Points and Routing

Every surface in the neurons.me mesh is reachable through multiple access points simultaneously. The same monad — the same namespace, the same kernel — can be reached from a local machine, a LAN device, or the public internet. The routing layer (NetGet + OpenResty) decides which surface handles each incoming request based on the hostname.

<style>
.sap-wrap { width:100% !important; max-width:100% !important; border-radius:10px; overflow:hidden; border:1px solid #1a2a38 !important; background:#0f1720 !important; font-family:'Helvetica Neue',Helvetica,Arial,sans-serif; margin:24px 0; }
.sap-wrap table { display:table !important; width:100% !important; max-width:100% !important; border-collapse:collapse !important; background:transparent !important; margin:0 !important; }
.sap-wrap thead tr { background:#162030 !important; }
.sap-wrap thead th { padding:8px 16px !important; font-size:10px !important; font-weight:700 !important; letter-spacing:0.1em; color:#4a5a68 !important; text-transform:uppercase; text-align:left !important; border:none !important; border-bottom:1px solid #1a2a38 !important; }
.sap-wrap tbody tr { border-bottom:1px solid #1a2a38 !important; transition:background 120ms; background:transparent !important; }
.sap-wrap tbody tr:nth-child(even) { background:#162030 !important; }
.sap-wrap tbody tr:hover { background:#1e3048 !important; }
.sap-wrap tbody tr:last-child { border-bottom:none !important; }
.sap-wrap td { padding:12px 16px !important; font-size:12px !important; color:#cdd8e0 !important; border:none !important; }
.sap-wrap td.addr { font-family:monospace !important; font-size:13px !important; font-weight:700 !important; white-space:nowrap; }
.sap-wrap td.surface { font-weight:600 !important; white-space:nowrap; }
.sap-wrap td.arrow { font-size:14px !important; width:28px; color:#2a3d52 !important; }
.sap-wrap tbody tr:hover td.arrow { color:#4fc3f7 !important; }
.sap-wrap td.c-netget { color:#4fc3f7 !important; }
.sap-wrap td.c-monad  { color:#81c784 !important; }
.sap-wrap td.c-direct { color:#ffb74d !important; }
.sap-wrap td.c-public { color:#ce93d8 !important; }
.sap-legend { display:flex; gap:20px; padding:10px 16px; border-top:1px solid #1a2a38; background:#0f1720; }
.sap-legend span { font-size:10px; color:#4a5a68 !important; display:inline-flex; align-items:center; gap:6px; }
.sap-legend span::before { content:''; display:inline-block; width:8px; height:8px; border-radius:2px; }
.leg-netget::before { background:#4fc3f7; }
.leg-monad::before  { background:#81c784; }
.leg-direct::before { background:#ffb74d; }
.leg-public::before { background:#ce93d8; }
</style>

<div class="sap-wrap">
<table>
<thead><tr>
  <th>Address</th><th>Handled by</th><th>Surface</th><th></th>
</tr></thead>
<tbody>
<tr onclick="window.open('https://neurons-me.github.io/netget/docs/local-netget','_blank')" style="cursor:pointer">
  <td class="addr c-netget">local.netget</td>
  <td>NetGet Express</td>
  <td class="surface c-netget">NetGet Dashboard</td>
  <td class="arrow">↗</td>
</tr>
<tr onclick="window.open('https://neurons-me.github.io/monad/docs/Initiating-Monads','_blank')" style="cursor:pointer">
  <td class="addr c-monad">hostname.local</td>
  <td>surface_proxy.lua → Monad</td>
  <td class="surface c-monad">Namespace Root</td>
  <td class="arrow">↗</td>
</tr>
<tr onclick="window.open('https://neurons-me.github.io/NRP/','_blank')" style="cursor:pointer">
  <td class="addr c-monad">{handle}.hostname.local</td>
  <td>nrp_handle.lua → Monad</td>
  <td class="surface c-monad">Handle Surface</td>
  <td class="arrow">↗</td>
</tr>
<tr onclick="window.open('https://neurons-me.github.io/monad/docs/Initiating-Monads','_blank')" style="cursor:pointer">
  <td class="addr c-direct">localhost:PORT</td>
  <td>Monad Express (direct)</td>
  <td class="surface c-direct">Dev / Debug</td>
  <td class="arrow">↗</td>
</tr>
<tr onclick="window.open('https://neurons-me.github.io/netget/Typescript/typedocs/Placement','_blank')" style="cursor:pointer">
  <td class="addr c-public">IP:80 / IP:443</td>
  <td>NetGet OpenResty</td>
  <td class="surface c-public">Public Gateway</td>
  <td class="arrow">↗</td>
</tr>
<tr onclick="window.open('https://neurons-me.github.io/netget/Typescript/typedocs/custom-domains','_blank')" style="cursor:pointer">
  <td class="addr c-public">domain.com</td>
  <td>surface_proxy.lua → routing table</td>
  <td class="surface c-public">Public Surface</td>
  <td class="arrow">↗</td>
</tr>
</tbody>
</table>
<div class="sap-legend">
  <span class="leg-netget">NetGet</span>
  <span class="leg-monad">Monad</span>
  <span class="leg-direct">Direct</span>
  <span class="leg-public">Public</span>
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
