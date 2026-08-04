# Disclosure Levels

When an NRP channel resolves, the server returns a `disclosure` level alongside the endpoints. Disclosure tells the client what the `.me` kernel revealed — and therefore what the client can trust about the resolved channel.

---

## Levels

### `public`

The namespace is readable by anyone. Endpoints are available. No authentication required.

```txt
me://jabellae/profile/bio   → disclosure: 'public'
```

### `closed`

The namespace exists, but this caller does not have access. The server confirms the namespace is present but withholds the value. `resolved` may be empty or contain limited endpoints.

```txt
me://jabellae/wallet/hidden  → disclosure: 'closed'
(caller is not in the audience)
```

### `stealth`

The namespace does not reveal its own existence. The caller receives neither a value nor a confirmation that anything is there. This maps to the `.me` kernel's A0/A2 axioms — a secret scope root returns `undefined`, indistinguishable from an absent path.

```txt
me://jabellae/_/vault        → disclosure: 'stealth'
(scope root: existence is not confirmed)
```

`stealth` is the correct external label. The monad NRP contract never returns `"stealth"` literally in an HTTP response — it returns `"closed"` for HTTP paths. Over a Beatle WebSocket channel, `stealth` is the precise term when the kernel's A0 behavior applies.

### `contested`

Total Monad Synthesis found multiple monad instances claiming authority over the same namespace, with conflicting state or incompatible scoring. The channel is open, but the resolved endpoints may represent different namespace authorities.

```txt
me://jabellae               → disclosure: 'contested'
(two monads with same namespace, different seeds)
```

The client should surface this state visibly. A `contested` channel should not be used for writes without explicit user confirmation.

---

## Implications for the Client

| Disclosure | `resolved` | What to do |
|---|---|---|
| `public` | Populated | Normal use |
| `closed` | Empty or limited | Show "access denied" |
| `stealth` | Empty | Show nothing — do not confirm existence |
| `contested` | Populated (multiple) | Warn user, require confirmation before writes |

---

## In the Code

```ts
// Beatle.types.ts
type NRPDisclosure = 'public' | 'closed' | 'stealth' | 'contested';

// NamespaceChannel carries it after resolution:
channel.disclosure  // NRPDisclosure | undefined
```

The Beatle UI should show disclosure state when it is not `public` — a visual indicator that the channel is constrained, contested, or opaque.

---

## See Also

- [NamespaceChannel](./NamespaceChannel.md)
- [.me Kernel Role in NRP](../../../all.this/me/Typescript/typedocs/NRP-Kernel-Role.md)
- [Namespace Protocol Resolution](./Namespace-Protocol-Resolution.md)
- [Surface Access Points and Routing](./Surface-Access-Points-and-Routing.md)
