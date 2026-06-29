# NRP Implementation Status

`monad.ai` v2.2.0 — current local implementation status

---

## What Is Implemented

The current NRP work is no longer only an HTTP resolver. It is a mesh-aware
runtime path with optional Total Monad Synthesis (`MONAD_SYNTHESIS_ENABLED=1`):

**Single-forward (default, Phase 1–9):**

1. **Parse** `me://namespace:read/path`
2. **Discover** monads that claim the namespace
3. **Filter** by optional selector constraints
4. **Score** eligible monads
5. **Forward** to the selected endpoint
6. **Learn** from the request outcome
7. **Explain** and optionally log the decision

**Synthesis path (Phase 10, opt-in):**

1. **Parse** `me://namespace:read/path`
2. **Discover** and **score** all eligible claimants
3. **Select top-N** candidates (`MONAD_SYNTHESIS_MAX_CANDIDATES`, default 3)
4. **Forward in parallel** to all N candidates
5. **Synthesize**: quorum → `public`, no quorum → `contested`, all fail → `closed`
6. **Log** synthesis decision with divergence metadata and reward signal
7. **Expose** `_synthesis` on the wire for audit

```txt
request
  → parseBridgeTarget
  → MONAD_SYNTHESIS_ENABLED?
      no  → selectMeshClaimant → forward → correlateOutcome
      yes → selectMeshClaimants (top-N)
          → forwardAll (parallel)
          → synthesize()
          → correlateSynthesisOutcome
          → _synthesis in response
```

---

## Phase Summary

| Phase | Status | Result |
|-------|--------|--------|
| Phase 1 | done | Namespace reads/writes and claim/open lifecycle |
| Phase 2 | done | Self mapping, monad identity, `__surface`, disclosure envelopes |
| Phase 3 | done | Mesh index, `/.mesh/monads`, `/.mesh/resolve`, bridge forwarding |
| Phase 4 | done | Selector-aware mesh routing (`[device:macbook]`, `[host:edge]`) |
| Phase 5 | done | Production scoring engine with open `.me` claim metadata |
| Phase 5.5 | done | Score introspection, runner-up tracking, margin logging |
| Phase 5.6 | done | Decision log, biased sampling, offline analyzer |
| Phase 6 | done | Continuous reward and epsilon-greedy exploration for fragile choices |
| Phase 7 | done | Global adaptive weights and live `/.mesh/weights` observability |
| Phase 8 | done | Patch bay: controlled feature composition with learned weights |
| Phase 9  | done | Namespace-local weights with maturity blending and global background learning |
| Phase 10 | done | Total Monad Synthesis: multi-candidate parallel forward, quorum/contested/closed, synthesis decision log |

---

## Current Runtime Surfaces

| Endpoint | Purpose |
|----------|---------|
| `GET /<path>` | Read a path in the namespace selected by `Host` |
| `POST /` | Write/claim/open depending on body operation |
| `GET /__surface` | Self description and monad continuity proof |
| `GET /.mesh/monads` | List locally known and CLI-known monads |
| `GET /.mesh/resolve?namespace=...` | Discover monads claiming a namespace |
| `GET /.mesh/resolve?monad=frank` | Discover a monad by name/id |
| `GET /.mesh/resolve/multi?namespace=...` | Scored candidate list for synthesis (Phase 10 observability) |
| `GET /.mesh/weights` | Inspect global adaptive scorer weights |
| `GET /.mesh/weights?namespace=...` | Inspect namespace-local weights and blended request weights |
| `GET /resolve?target=me://ns:read/path` | Bridge a canonical NRP target (single or synthesis depending on flag) |

---

## Current Selection Model

The selector is not part of the semantic path. It constrains execution.

```txt
me://frank.local[device:macbook]:read/profile
```

Resolution:

1. semantic namespace: `frank.local`
2. semantic path: `profile`
3. execution constraint: `device:macbook`
4. winner: highest scored eligible monad, unless low-margin exploration fires

---

## Current Learning Model

The fast index remains simple:

```ts
claimed_namespaces: string[]
tags: string[]
type: "desktop" | "mobile" | "server" | "browser-tab" | "node"
```

The open `.me` subtree holds rich learned metadata:

```ts
_.mesh.monads.<id>.claimed.<namespace> = {
  resonance: 42,
  effectiveResonance: 31.5,
  avgLatencyMs: 85,
  forwardCount: 100,
  failureCount: 4,
  geopoliticalZone: "mx-east",
  energyProfile: "low-power"
}
```

The index answers: **who could answer?**

The scoring engine answers: **who should answer?**

Adaptive weights now use two layers:

```txt
_.mesh.adaptiveWeights          global prior
_.mesh.nsWeights.<namespace>    namespace-local posterior
```

Reads blend them by namespace maturity:

```ts
maturity = min(1, sampleCount / 200)
weights = global * (1 - maturity) + namespace * maturity
```

Writes split the same reward gradient:

```ts
globalShare = max(0.05, 1 - maturity)
nsShare = maturity
```

The global prior remains alive at full namespace maturity, so cross-namespace
trends still propagate.

---

## Operational Flags

| Env var | Default | Effect |
|---------|---------|--------|
| `MONAD_MESH_STALE_MS` | `300000` | Exclude stale monads from mesh claim selection |
| `MONAD_DEBUG_SCORING` | unset | Log every scoring decision when set to `1` |
| `MONAD_SCORE_SAMPLE_RATE` | `0` | Randomly log a fraction of scoring decisions |
| `MONAD_SCORE_MARGIN_THRESHOLD` | `0.05` | Always log fragile low-margin decisions |
| `MONAD_EXPLORATION_RATE` | `0` | Route some fragile decisions to runner-up |
| `MONAD_DECISION_LOG` | unset | JSONL path for correlated decision outcomes (single + synthesis) |
| `MONAD_LEARNING_QUALITY_WEIGHT` | `0.7` | Quality/latency split in reward |
| `MONAD_DEBUG_WEIGHTS` | unset | Log adaptive weight changes after every forward |
| `MONAD_SYNTHESIS_ENABLED` | `0` | Enable Phase 10 Total Monad Synthesis path (`1` to activate) |
| `MONAD_SYNTHESIS_MAX_CANDIDATES` | `3` | Max claimants queried in parallel during synthesis |
| `MONAD_SYNTHESIS_QUORUM_THRESHOLD` | `0.5` | Fraction required for quorum (strict majority — tie = contested) |
| `MONAD_SYNTHESIS_MIN_RELATIVE_SCORE` | `0.8` | Min score relative to winner to qualify as synthesis candidate |

---

## Verification

Current regression suite:

```txt
31 test files
391 tests
```

Primary commands:

```bash
npm run build
npm test
npm run docs:api
```

Decision analysis:

```bash
MONAD_DECISION_LOG=~/.monad/decisions.jsonl npm run dev
tsx scripts/analyze-decisions.ts ~/.monad/decisions.jsonl
```

---

## Not Yet Implemented

These remain design targets, not production guarantees:

- multi-hop mesh traversal
- distributed cross-machine monad index sync
- `.me`-defined scoring pipeline
- auto-tuning of weights from reward history
- durable decision log beyond JSONL
- challenge/nonce validation for stronger monad proof freshness
- synthesis policy selection via `me://` path metadata (namespace-declared quorum rules)
- `contested` response UI surface (currently wire-only, no GUI component)
