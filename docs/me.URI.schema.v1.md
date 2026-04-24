# .me URI Scheme (v1)

###### Semantic Reconstruction Architecture
A semantic, sovereign, and distributed addressing protocol for personal identity and mesh networks.

### Main Scheme
```url
me://[namespace][selector]/[path]
```

**Scheme**  
`me://` — Required. Identifies this as a **.me** URI.

### **Namespace**  
`[a-z0-9._-]+` — Optional.  
Example: `jabellae.cleaker.me`  
Represents the canonical identity. If omitted, it defaults to local context.

**Selector**  
Optional. Defines how to resolve the expression in the mesh.  
Supported formats:

- `[surface:iphone]` — Target a specific surface
- `[]` — Broadcast to all surfaces
- `[current]` — Current surface only
- `[claim:7f3k9p]` — Special claim operation

**Path**  
Any semantic path — Optional.  
Examples: `profile`, `wallet.balance`, `chat/general`

### Official Examples

**Public Profile**  
`me://jabellae.cleaker.me/profile`

**Broadcast to all surfaces**  
`me://jabellae.cleaker.me[]/chat`

**Specific Surface**  
`me://jabellae.cleaker.me[surface:iphone]/runtime.battery`

**Claim New Surface**  
`me://jabellae.cleaker.me[claim:7f3k9p]/new-surface`

**Secret-protected Access**  
`me://secret:my-key@jabellae.cleaker.me/vault/keys`

**Local (legacy)**  
`me://profile.name`

**Namespace only**  
`me://jabellae.cleaker.me`

### Formal Grammar (ABNF)

```abnf
me-uri     = "me://" [ namespace ] [ selector ] [ "/" path ]

namespace  = 1*( ALPHA / DIGIT / "." / "_" / "-" )
selector   = "[" ( "current" / "" / "surface:" surface-name / "claim:" token ) "]"
surface-name = 1*( ALPHA / DIGIT / "-" / "_" )
token      = 1*( ALPHA / DIGIT )
path       = *( VCHAR / "/" )
```

# Purpose of the Standard
The **.me:// URI scheme** is a **semantic addressing system** designed for sovereign identities and **distributed surface networks (Mesh).**
Unlike traditional URLs, a **.me** URI does not merely point to a static resource. Instead, it describes where and how to resolve information within a distributed personal identity.

##### It enables:
1. Reading and writing across multiple devices
2. Secure pairing of new surfaces
3. Conditional access using structural secrets
4. Contextual resolution (local, broadcast, or specific surface)

This standard aims to be open, public domain, and freely usable by anyone or any project that needs a sovereign personal identity layer.

License: This document is released into the public domain (CC0 1.0 Universal).
Anyone may use, implement, modify, and build upon it without restriction.

**∴ Witness our seal**

**Sui Gn**