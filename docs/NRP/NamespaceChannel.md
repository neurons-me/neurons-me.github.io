---
layout: readme
title: NamespaceChannel
---

# NamespaceChannel

`NamespaceChannel` is the live state of a Beatle channel — everything the client knows about the current NRP session after a channel is opened and resolved.

---

## Type

```ts
type NamespaceChannel = {
  expression:   NRPExpression | null;  // parsed input expression
  resolved:     string[];              // endpoint URLs from NRP server
  state:        ResolutionState;       // current channel lifecycle state
  channelId?:   string;                // server-assigned channel ID
  audience?:    string[];              // who is in this channel
  capabilities?: string[];            // what operations the namespace supports
  surface?:     string;               // overlay surface (from @ operator)
  disclosure?:  NRPDisclosure;        // what the kernel revealed
  error?:       string;               // last error message
};
```

---

## Field Notes

### `expression`

The client-side parsed NRP expression. Contains `raw`, `canonical`, `ast`, `syntaxValid`, and `namespaceValid`. Null when `state === 'idle'`.

The canonical form must match what the server verified — this is how the client and server confirm they are talking about the same expression.

### `resolved`

Array of endpoint URLs returned by the NRP server after resolving the expression against the `.me` kernel. May be empty if `disclosure === 'closed'` or `'stealth'`.

### `channelId`

Opaque server-assigned identifier. Must be echoed in `data` messages when the server requires channel scoping.

### `audience`

The participants who share this channel, as resolved by the NRP server from the expression's algebra. For `jabellae + alex`, the audience is both namespaces. The server determines this from kernel state — not from the client's AST.

### `capabilities`

Operations the resolved namespace advertises — e.g. `['read', 'stream', 'write']`. Populated from the server's `resolved` payload.

### `surface`

The overlay surface from the `@` operator. For `jabellae @ wikipedia.com`, surface is `wikipedia.com`. The Beatle channel runs over this surface context.

### `disclosure`

See [Disclosure Levels](./Disclosure-Levels.md). Determines what the kernel revealed. The client should not assume endpoint reachability if `disclosure !== 'public'`.

---

## Lifecycle

```txt
idle
  ↓ open()
parsing     → expression set, resolved []
connecting  → WebSocket transport handshake
resolving   → NRP semantic handshake
connected   → resolved[], channelId, audience, capabilities, disclosure set
streaming   → live updates from server
  ↓ disconnect() or server close
disconnected
```

Errors at any stage transition to `error` state. The expression is preserved so the UI can show what was being resolved when the error occurred.

---

## See Also

- [Beatle — NRP Channel Client](./Beatle.md)
- [Disclosure Levels](./Disclosure-Levels.md)
- [Surface and Overlay](./Surface-and-Overlay.md)
