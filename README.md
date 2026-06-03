<p align="center">
  <a href="https://neurons.me/">
    <img src="https://res.cloudinary.com/dkwnxf6gm/image/upload/v1760629064/neurons.me_b50f6a.png" alt="neurons.me" width="89" />
  </a>
</p>

# neurons.me
> **Sovereign semantic compute. Identity, namespace, runtime — owned by you.**

---

## What is neurons.me?

**neurons.me** is an open-source stack for sovereign identity and semantic computation. It enables any person or machine to:

- Own a cryptographic identity derived from a seed (no account, no server required)
- Bind that identity to a namespace surface on the network
- Run it as a self-hosted HTTP daemon that speaks the `me://` URI scheme
- Render it as a composable user interface

The stack is designed so that **you own the root**. Your identity is a deterministic function of two strings you choose. No central authority can revoke it.

---

## The Stack

| Layer | Package | npm | Docs |
|---|---|---|---|
| **Kernel** | [`.me`](https://neurons-me.github.io/.me/) | [`this.me`](https://www.npmjs.com/package/this.me) | Schema-free reactive memory. Works offline. No server. |
| **Identity** | [cleaker](https://neurons-me.github.io/Cleaker/) | [`cleaker`](https://www.npmjs.com/package/cleaker) | Namespace resolver. *Who am I, here.* |
| **Runtime** | [monad](https://neurons-me.github.io/monad/) | [`monad.ai`](https://www.npmjs.com/package/monad.ai) | HTTP daemon. Exposes namespace over HTTP. Runs the mesh. |
| **Gateway** | [netget](https://neurons-me.github.io/netget/) | [`netget`](https://www.npmjs.com/package/netget) | Routes hostnames to monads via OpenResty/Nginx. |
| **Interface** | [.GUI](https://neurons-me.github.io/GUI/) | [`this.gui`](https://www.npmjs.com/package/this.gui) | React component library. Renders the semantic surface. |

---

## How the layers connect

```
User or Agent
     │
     ▼
  netget          ← gateway — routes hostname → monad
     │
     ▼
  monad.ai        ← HTTP daemon — holds .me kernel, speaks me://
     │
     ├── cleaker  ← resolves namespace, validates identity claims
     │
     └── this.me  ← root kernel — cryptographic reactive memory tree
                               ▲
                          this.gui ← React UI reads/writes kernel paths
```

A **monad** is a running instance of the stack: it holds one `.me` kernel, registers itself on the mesh, and handles `me://` path requests as HTTP. Multiple monads form a mesh — they discover each other, score each other's reliability, and route through each other.

---

## Quick Start

```bash
# 1. Install the kernel
npm install this.me

# 2. Install the namespace resolver
npm install cleaker

# 3. Run a monad daemon
npm install -g monad.ai
export SEED="your-64-hex-seed"
monad start

# 4. Run the gateway (routes external traffic to your monad)
npm install -g netget
netget
```

---

## Documentation

- [neurons-me.github.io/.me/](https://neurons-me.github.io/.me/) — `.me` kernel docs
- [neurons-me.github.io/Cleaker/](https://neurons-me.github.io/Cleaker/) — cleaker docs
- [neurons-me.github.io/monad/](https://neurons-me.github.io/monad/) — monad docs
- [neurons-me.github.io/netget/](https://neurons-me.github.io/netget/) — netget docs
- [neurons-me.github.io/GUI/](https://neurons-me.github.io/GUI/) — this.gui docs

---

MIT License · [neurons.me](https://neurons.me)
