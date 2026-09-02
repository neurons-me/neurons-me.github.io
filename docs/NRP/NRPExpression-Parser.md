---
layout: readme
title: NRP Expression Parser
---

# NRP Expression Parser

`NRPExpression.ts` — algebraic parser for `me://` namespace expressions.

Lives at: `packages/GUI/Typescript/src/gui/All.This/NRP/Beatle/NRPExpression.ts`

---

## Purpose

NRP expressions are more than namespace addresses. They are algebraic operations over namespaces — unions, intersections, overlays, complements. The parser turns a raw string into a typed AST before anything is sent over the wire.

```txt
"jabellae + alex @ wikipedia.com"
  ↓
overlay(
  union(namespace("jabellae"), namespace("alex")),
  surface: "wikipedia.com"
)
```

---

## Grammar

```txt
expr    = term ('+' term)*           // union
term    = factor ('∩' factor)*       // intersection
factor  = atom ('@' surface)?        // overlay
atom    = '~' atom                   // complement
        | '(' expr ')'              // grouping
        | NAMESPACE                 // leaf (Cleaker-parsed)

surface = '"' URI '"'               // quoted URI
        | NS_TOKEN                  // bare hostname
```

Operators and their precedence (highest → lowest):

| Operator | Symbol | Precedence |
|---|---|---|
| Complement | `~` | prefix (highest) |
| Overlay | `@` | 3 |
| Intersection | `∩` | 2 |
| Union | `+` | 1 (lowest) |

---

## Examples

```txt
jabellae
jabellae + alex
jabellae ∩ team.acme
~jabellae
jabellae + alex @ wikipedia.com
jabellae @ "https://wikipedia.com/Scarab"
(jabellae + alex) ∩ team.acme
~(jabellae + noise)
```

---

## AST Node Types

```ts
type NRPNode =
  | { kind: 'namespace';    value: string; parsed?: ParsedNamespaceExpression }
  | { kind: 'complement';   operand: NRPNode }
  | { kind: 'union';        left: NRPNode; right: NRPNode }
  | { kind: 'intersection'; left: NRPNode; right: NRPNode }
  | { kind: 'overlay';      namespace: NRPNode; surface: string };
```

Namespace leaves are passed through `cleaker.parseNamespaceExpression()`. If Cleaker rejects a leaf, the leaf carries `parseError` but the expression can still be sent — the server re-verifies.

---

## Validity Flags

```ts
type NRPExpression = {
  raw: string;
  canonical: string;
  ast: NRPNode;
  syntaxValid: boolean;    // algebra structure is correct
  namespaceValid: boolean; // all leaves passed Cleaker
  valid: boolean;          // = syntaxValid (safe to send)
  error?: string;
};
```

`valid` requires only `syntaxValid`. An expression with `namespaceValid: false` can still be sent to the server, which has final authority.

---

## Canonical Form

`canonicalize(ast)` produces a stable string representation. It is **precedence-aware**: parentheses are inserted wherever needed to preserve semantics across parse/serialize round-trips.

```txt
a ∩ (b + c)   → canonical: "a ∩ (b + c)"   ✓
~(a + b)      → canonical: "~(a + b)"       ✓
a + b + c     → canonical: "a + b + c"      (left-associative)
```

Without correct parenthesization, `a ∩ (b + c)` would serialize as `a ∩ b + c`, which re-parses as `(a ∩ b) + c` — a different expression.

---

## Strict Mode

The parser is strict:
- Unknown characters throw `ParseError` (no silent skipping).
- All tokens must be consumed. Extra input after the expression is an error.
- Unclosed parentheses or quotes throw `ParseError`.

This ensures that an ambiguous or malformed expression is never silently converted into a different channel.

---

## Wire Contract

```ts
// Client sends:
{
  type: 'nrp.open',
  expression: raw,
  canonical: canonical,
  ast: ast,          // hint — server must re-verify
  client: { surface, userAgent, gui: 'Beatle' },
  timestamp
}
```

The AST is sent as a hint for debugging and UX. The NRP server re-parses `canonical` independently and resolves against the `.me` kernel. **The server has semantic authority; the client has intent.**

---

## See Also

- [Beatle — NRP Channel Client](./Beatle.md)
- [Surface and Overlay](./Surface-and-Overlay.md)
- [Cleaker Namespace Grammar](../../all.this/modules/cleaker/Typescript/typedocs/NRP-Namespaces.md)
- [Namespace Protocol Resolution](./Namespace-Protocol-Resolution.md)
