---
layout: readme
title: Identity-Bound Secrets — Design and Tests
permalink: /architecture/identity-bound-secrets/
description: Design contract, package responsibilities, and acceptance criteria for identity-bound secrets.
---

# Identity-Bound Secrets

**Status: implemented, and adversarially tested.** The design below was originally published as a proposal; the [`.me` technical document](https://github.com/neurons-me/.me/blob/HEAD/Typescript/typedocs/Identity-Bound-Secrets.md) now records it as implemented (v4 derivation, root lifecycle, migration, redacted snapshots, real Monad process integration), with file/line citations against the code. A subsequent adversarial security battery — isolation, scopes/noise, information leakage, cryptographic/format tampering, root lifecycle, replay/restart, migration, and generative/scale testing, plus real-process persistence testing on the Monad side — ran against that implementation and is summarized in "Adversarial security battery" below. This page still does not certify a cryptographic audit; see that section's own caveats. Updated September 8, 2026.

**License:** CC0 1.0 Universal.

## What we are building

A tree with public branches and protected scopes. Each protected scope requires private material from its identity and the secrets applicable to that branch. Copying paths, secrets, and noise values to another identity must not allow it to open the data.

The private encryption root is randomly generated and stored encrypted under a password-derived key. The password unlocks the root; it does not regenerate it. Changing the password rewraps the same root and preserves branch ciphertext.

```text
Identity's private encryption root
  + secrets applicable to the scope
  + noise and path context
  → branch encryption key
```

The public identity identifier is no substitute for the private root. Password key derivation and derivation from a random root serve different purposes; their algorithms and parameters must be documented in the implementation.

## Navigating the tree

- A path with no inherited protection can be navigated without secrets.
- A child without its own `_()` remains protected if an ancestor is protected.
- Unlocking a scope enables its context for the session; secrets do not need to be entered at every node.
- A nested `_()` adds a secret to the applicable lineage.
- `~()` cuts inherited secrets but never removes the identity dependency. A user-supplied value does not imply automatically generated randomness.
- The design adopts **Option B**: unlocking the identity does not automatically recover every branch's secrets. Values for `_()` and `~()` are supplied during the session.

## Persistence and session locking

Session secrets must not be persisted. Readable copies of protected content must not remain in snapshots, journals, or persistent indexes either.

The kernel must retain enough topology to recognize a protected branch internally after a restart. Without secrets, it cannot open the branch or accidentally make it public. The public surface preserves stealth: it does not reveal a “protected, locked” state. This does not promise to hide sizes, access patterns, or all on-disk metadata.

A redacted public view and a recoverable backup are formats with different purposes. Replacing content with `***` is insufficient when that content is needed to reconstruct state.

## Three distinct operations

| Operation | What it does | What it requires |
| --- | --- | --- |
| Re-derive | Recomputes a branch's keys without modifying its data. | The root, applicable secrets, and context. |
| Rotate | Creates another root and migrates affected data. | Access to the previous data; migration may remain pending per scope. |
| Recover | Restores the same root from a configured backup. | An available recovery mechanism. |

A random root lost without a backup cannot later be reconstructed from the public identifier. The initial scope includes basic backup/restore and password changes; advanced rotation between roots and an optional vault for remembering secrets are deferred to a later phase.

## Why multiple packages are involved

| Package | Expected responsibility |
| --- | --- |
| `.me` | v4 derivation and encryption, scopes, noise, caches, snapshots, and migration. Most tests belong here. |
| Monad | Startup integration, actual disk persistence, and recovery without overwriting data after a failure. |
| Cleaker | Identity and credential integration, **only if the chosen solution changes this layer**. Reviewing it does not require changing it. |

The final location of root management must be justified against the code. Do not introduce a reverse dependency from the kernel to Cleaker or include unprotected private material in a public claim.

## The 11 acceptance criteria

These are **11 behavioral requirements**, not 11 tests per repository or a final allocation of test files. A requirement may need several unit and integration tests. The coverage column indicates where verification is expected; it does not report execution.

| # | Criterion | Expected coverage |
| --- | --- | --- |
| 1 | Another identity cannot open v4 blobs with identical paths, secrets, and noise, even after copying the storage. | `.me` |
| 2 | The correct identity without the applicable secret cannot open the branch either. | `.me` |
| 3 | Noise cuts previous inheritance while preserving identity isolation. | `.me` |
| 4 | Public navigation, nested scopes, and inheritance work. | `.me` |
| 5 | Saving and restarting leaves scopes locked; supplying the correct context recovers their data without reclassifying them as public. | `.me` + Monad integration |
| 6 | Changing the password preserves the root and ciphertext; the previous password fails against the updated envelope. | The root-management layer; Cleaker if involved |
| 7 | Locking or changing identity invalidates previous access and caches. | `.me` + identity integration |
| 8 | Snapshots and generated files contain no plaintext test secrets, noise, or protected content. | `.me` + Monad integration |
| 9 | Tampering with ciphertext or context fails without falling back to older formats or losing data. | `.me`; Monad persistence where applicable |
| 10 | An interrupted migration resumes, preserves pending items, and covers both branch and value blobs. | `.me` + Monad persistence |
| 11 | A backup restores the same root without automatically unlocking branch secrets. | The backup/restore layer + integration |

**Execution results.** The `.me` package's `tests/identity-bound-secrets.test.ts` runs all 11 criteria above (`npm run test:identity-bound-secrets`), all 11 passing as of the implementation closing. A separate adversarial battery (`tests/Security/*.test.ts` in `.me`, plus `tests/Security/*.process.test.ts` in Monad) then tested each criterion's edge cases and failure modes beyond the original acceptance shape — see "Adversarial security battery" below for what that found, fixed, and left open. Do not mark a criterion as passed solely because a test exists; the battery's own README documents its requirement-to-test matrix explicitly for this reason.

## Compatibility and migration

v3 derivation is preserved to open existing data. The v4 format introduces the private root as a mandatory input; a v4 authentication failure must not trigger an attempt to read the blob as v3.

Migration from v3 to v4 is explicit and resumable for both branch and value blobs. Without the required secrets/noise, a scope remains pending. Do not remove the original before verifying and durably committing the new content.

Importing old snapshots that contain secrets is an explicit migration path, not a silent unlock during ordinary startup. Old backups retain their previous exposure: migrating current data does not retroactively protect them.

## Adversarial security battery

A structured adversarial pass ran against the implementation described above, organized around five distinct attacker/state classes: a storage thief with no credentials, a sibling identity that knows the same path/secret/noise strings but has a different private root, the owner unlocked but missing a branch secret, manipulated or stale storage, and a process interrupted mid-write. It is explicit about what it does not claim: no protection against an attacker who already controls an unlocked process, no metadata/traffic-analysis hiding (scope-path keys and chunk sizes stay visible by design), and no independent cryptographic audit of the underlying primitives — see the battery's own README for the full boundary.

Three real bugs were found and fixed, each with a minimal reproduction and a regression test:

- **A closed scope could become public.** Writing to a path whose governing `_()` secret was not active this session (for example, right after locking the identity) silently fell through to an ordinary public, plaintext write — the exact "closed scope becomes public for lack of a secret" failure the design explicitly forbids. Fixed in `.me`'s `core-write.ts`/`core-index.ts`: such a write is now refused the same way a wrong-secret write already was, with no plaintext ever reaching the log or the public index.
- **Rotating the private root had no authentication gate.** `rotateIdentityRoot()` could replace an existing root and lock out the real owner without ever supplying a password, as long as a caller held a reference to the (possibly locked) kernel. Fixed by requiring the identity to already be unlocked before an existing root can be rotated — the same trust level a password change already required.
- **A crash during Monad's snapshot save could destroy the last good state, not just the unconfirmed write.** `saveSnapshot()` wrote the state file in place; a process killed mid-write could leave it truncated, and the next successful save would then silently overwrite that truncated file with a near-empty kernel's state. Fixed with an atomic write (temp file plus rename) and by quarantining a corrupted file on read instead of leaving it to be overwritten.

The battery also documents, without changing, two real characteristics that could otherwise look like bugs: noise (`~()`) reflects the *current* session's state rather than a per-write snapshot of it, so declaring noise after a write to the same scope makes that earlier write unreadable until the original context is restored (fails closed, fully recoverable, inherited unchanged from the pre-existing v3 derivation this feature does not modify); and `hydrate()`'s redacted noise placeholder behaves as an active (permanently mismatching) value rather than "no noise," so a caller must explicitly re-declare the real value after restoring a snapshot.

Known gaps, left open rather than silently assumed away: there is no rollback/freshness detection for branch ciphertext (an attacker with write access to the encrypted branch store could replace a scope's current chunk with an older, still validly-authenticated one from the same scope); concurrent writers to the same Monad state directory are not supported and are documented as a limit, not a feature; and this remains adversarial testing by one engineer, not an independent cryptographic audit.

Full detail — attack model, exact commands, the requirement-to-test matrix, and each fix's reproduction — is in the battery's own README: [`me/Typescript/tests/Security/README.md`](https://github.com/neurons-me/.me/blob/HEAD/Typescript/tests/Security/README.md) (the `.me` package), with the process-level persistence tests in [`modules/monad/Typescript/tests/Security/`](https://github.com/neurons-me/monad/blob/HEAD/Typescript/tests/Security/) (Monad).

## Sources and maintenance

- [Technical design document in `.me`](https://github.com/neurons-me/.me/blob/HEAD/Typescript/typedocs/Identity-Bound-Secrets.md): the detailed reference alongside the code. The link will become available when the local document is published to that repository.
- [Visibility and secrets model (Spanish)]({{ '/Secretos-me.html' | relative_url }}): the existing operator explanation; it should not be interpreted as certification of the new isolation guarantees.

This page is the architecture and cross-package coverage guide. The `.me` document maintains details close to the code. Contract changes must update both references; implementation status should only be updated with code and test evidence. The root's location, its APIs, and concrete cryptographic decisions still await implementation verification.
