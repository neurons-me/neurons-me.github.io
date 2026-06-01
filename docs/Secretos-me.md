## El modelo de visibilidad de .me

**Regla base: todo es público por defecto.**

```ts
me.wallet(500)          // público — cualquiera puede leer
me.name("Abella")       // público
me.profile.city("CDMX") // público
```

El operador `_` es el único que cambia eso. Es un **declarador de scope secreto** — no un flag global, sino una instrucción estructural atada a un path específico.

---

## Cómo funciona `_` exactamente

```ts
// Sin secret: TODO público
me.wallet(500)
me("wallet")  // → 500  ✅ visible

// Con secret: el root se vuelve stealth, las hojas siguen accesibles
me.wallet["_"]("vault-key")
me.wallet.balance(500)
me.wallet.hidden.seed("abc")

me("wallet")          // → undefined  ← stealth root (A0)
me("wallet.balance")  // → 500        ← readable con la clave correcta
me("wallet.hidden.seed") // → "abc"   ← readable
```

**El punto clave:** `me.wallet["_"]("vault-key")` no cifra el path `wallet` como string — cifra el **blob del branch** `wallet` usando `"vault-key"` como semilla de derivación criptográfica. El root devuelve `undefined` no porque no exista, sino por diseño intencionado (honest absence).

---

## Tu intuición sobre `wallet["_"].walletB` — así se hace

```ts
// wallet es público
me.wallet.balance(1000)       // visible a todos

// walletB es secreto, dentro de wallet
me.wallet.walletB["_"]("my-secret-key")
me.wallet.walletB.seed("abc")
me.wallet.walletB.amount(500)

me("wallet.balance")     // → 1000    ← público ✅
me("wallet.walletB")     // → undefined  ← stealth root ✅
me("wallet.walletB.amount") // → 500  ← readable con key ✅
```

El **subespacio** `walletB` está dentro del espacio público `wallet`, pero tiene su propio scope secreto. Eso es la ley de refinamiento: `wallet.walletB ⊆ wallet`, y `A(wallet.walletB) ⊆ A(wallet)`.

---

## Nested secrets (A3b del test)

```ts
me.root["_"]("alpha")        // root secreto
me.root.child["_"]("beta")   // child también secreto, dentro de root

me("root")             // → undefined  (stealth)
me("root.child")       // → undefined  (stealth)
me("root.child.leaf")  // → "x"        (el owner puede leer)
me.as(null)("root.child.leaf") // → undefined  (guest bloqueado)
```

---

## El mapa completo de operadores

| Operador | Qué hace | Default sin él |
|----------|----------|----------------|
| `["_"]("key")` | Declara secret scope en ese path | Público |
| `["~"]("seed")` | Reset de noise — rompe herencia de key | Derivación continua desde padre |
| `["__"]("target")` o `["->"]` | Pointer estructural a otro path | Sin pointer |
| `["@"]("user")` | Identity claim normalizado | Sin identity |
| `["?"](...fields)` | Query como evento en memoria | Sin audit |
| `["-"]("field")` | Tombstone/borrado auditable | Sin borrado |
| `["="]("expr")` | Derivación/cálculo | Sin cálculo |

---

## Lo que esto significa para NRP

Cuando NRP sirve un path HTTP:

```
GET /@jabellae/wallet          → stealth root → devolver null / origin:"stealth"
GET /@jabellae/wallet/balance  → depende de si hay key material
GET /@jabellae/name            → público → devolver valor
```

El servidor NRP nunca debe revelar si `undefined` es "no existe" o "existe pero es stealth" — ambos casos son indistinguibles para un observador sin la clave. Eso es lo que el **Disclosure Model** (Section 6 del NRP doc) formaliza, y lo que todavía falta implementar correctamente en el binding HTTP actual.