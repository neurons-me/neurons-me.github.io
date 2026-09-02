---
layout: readme
title: Beatle — NRP Channel Client
---

# Beatle — NRP Channel Client

> **Beatle is the URL bar of the namespace mesh.**

Instead of navigating to `https://wikipedia.com`, you open a channel to `me://jabellae`. The two channels coexist — the browser's HTTP connection and the Beatle WebSocket run in parallel.

Lives at: `packages/GUI/Typescript/src/gui/All.This/NRP/Beatle/`

---

## Two Channels

```txt
Browser HTTP channel        Beatle NRP channel
────────────────────        ──────────────────
https://wikipedia.com  ←→  me://jabellae + alex
stateless, one direction    bidirectional, namespace-resolved
URL driven                  me:// expression driven
```

The browser stays exactly as it is today. Beatle opens a second channel to a namespace. You can overlay a `.me` session on any surface you are visiting.

---

## What Beatle Does

```txt
input: me:// expression
  → NRPExpression parser  (algebra: +, ∩, @, ~)
  → Cleaker leaf parser   (each namespace token)
  → WebSocket open()
  → NRP server resolves   (against .me kernel)
  → channelId + endpoints returned
  → bidirectional stream
```

Opening the channel IS resolving. There is no "first resolve, then connect" — the WebSocket is the channel.

---

## State Machine

```txt
idle → parsing → connecting → resolving → connected → streaming
                                        ↘ error
                                        ↘ disconnected
```

| State | Meaning |
|---|---|
| `idle` | No channel open |
| `parsing` | NRP expression being parsed locally |
| `connecting` | WebSocket handshake (transport) |
| `resolving` | NRP handshake (semantic) |
| `connected` | Channel open, endpoints known |
| `streaming` | Server pushing live updates |
| `error` | Parse error, connection error, or resolution error |
| `disconnected` | Channel was open and then closed |

---

## `useBeatle` Hook

```ts
const { channel, open, send, disconnect } = useBeatle(nrpEndpoint?, onMessage?);
```

### `open(expression: string)`

The single entry point. Triggers the full sequence: parse → connect → resolve.

```ts
open('jabellae + alex @ wikipedia.com');
```

Blocks if `syntaxValid: false`. Sends `{ type: 'nrp.open', raw, canonical, ast, client }` over the WebSocket on connect.

### `send(payload: unknown)`

Send data on the open channel. Only valid in `connected` or `streaming` state. Blocked by state check, not just `WebSocket.OPEN`.

### `disconnect()`

Close the channel cleanly. State transitions to `disconnected`.

---

## Wire Messages

All messages are discriminated unions — no `payload?: unknown` catch-alls.

| Direction | Type | Purpose |
|---|---|---|
| client → server | `nrp.open` | Open a channel with expression + AST hint |
| server → client | `resolved` | Channel confirmed with endpoints + disclosure |
| bidirectional | `data` | Application payload on open channel |
| server → client | `stream` | Server starts pushing live updates |
| server → client | `error` | Resolution or channel error |
| bidirectional | `ping` / `pong` | Heartbeat |

---

## NamespaceChannel State

After `resolved`, the channel carries:

```ts
{
  expression,    // NRPExpression (parsed + canonical)
  resolved,      // endpoint URLs from server
  state,         // ResolutionState
  channelId,     // server-assigned
  audience,      // who is in this channel
  capabilities,  // what the namespace supports
  surface,       // overlay surface (from @ operator)
  disclosure,    // 'public' | 'closed' | 'stealth' | 'contested'
}
```

---

## Variants

`variant='bar'` — full expression input bar:

```txt
𓆣 me:// [jabellae + alex                    ] connected  2 endpoints
```

`variant='bubble'` — status dot only:

```txt
𓆣  (color = state, tooltip = expression + state)
```

---

## The Scarab

The `𓆣` symbol (Egyptian scarab) pushes the `.me` namespace — the circle/monad — across surfaces. The metaphor is structural, not decorative: the beetle is the mechanism that moves the namespace through resolution space.

---

## See Also

- [NRP Expression Parser](./NRPExpression-Parser.md)
- [NamespaceChannel](./NamespaceChannel.md)
- [Surface and Overlay](./Surface-and-Overlay.md)
- [Disclosure Levels](./Disclosure-Levels.md)
- [Namespace Protocol Resolution](./Namespace-Protocol-Resolution.md)
