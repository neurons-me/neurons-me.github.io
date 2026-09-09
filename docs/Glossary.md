---
layout: readme
title: Glossary — neurons.me
---

# Glossary of neurons.me
**by suiGn**

## Core Terms

### **Algorithmic Runtime Invariance (O(k))**
The architectural property where query and resolution complexity is decoupled from global data volume (n). In the .me runtime, performance is a function of path depth (k), ensuring consistent latency regardless of the total size of the identity graph or network.

### **Axiomatic Integrity**
The enforcement of the core logic gates (A0-A9) at the kernel level. These axioms ensure that every state transition, secret derivation, and pointer resolution is mathematically deterministic and verifiable.

### **Binary Geometry**
The foundational concept that identity and meaning are emergent properties of a graph's structure and relations. It posits that "The distinction is the minimum ontological condition," where the "shape" of the logic defines the entity.

### **Behavioral Contract**
The explicit, testable specification of kernel behavior across phases and axioms. It defines what must remain invariant under refactors, optimizations, and runtime environments.

### **Chunked Secret Storage**
A secret storage strategy that splits encrypted data into deterministic chunks instead of one monolithic blob. This reduces write/read crypto cost by localizing encryption and decryption to the relevant segment.

### **Collective Alias Collapse**
The functional convergence of distinct linguistic labels into shared operational meaning through structural alignment and pointer links. Labels differ, but resolution behavior becomes equivalent.

### **Criteria Invariance**
The principle that interpretation criteria must not alter observed data. Data remains immutable while criterion acts as a semantic operator over the data, not a modifier of evidence.

### **Decrypted Branch/Chunk Cache**
A runtime cache that stores decrypted secret branch/chunk content for fast repeated reads. It is invalidated by security topology changes (epoch) and by encrypted blob updates.

### **Deterministic Portability**
The property that exported snapshots and replayed memory reconstruct equivalent runtime state and outputs across machines/environments without semantic drift.

### **Differential Indexing**
Incremental index maintenance where only changed paths are updated, replacing global rebuild-on-write patterns. It preserves determinism while lowering write-path cost.

### **Inverted Dependency Indexing**
A reactive architecture where state changes propagate only through active upward dependency chains. Unlike traditional polling, this "Bubbling" effect enables autonomous local convergence without requiring a global state manager.

### **i.mlearning (mlearning.me)**
A dataset-structuring module/domain in the neurons.me ecosystem focused on preparing data for machine learning workflows. It acts as a personal/targeted learning memory layer where raw signals are normalized into trainable structure.

### **Identity-Bound Secrets**
A proposed encryption model in which protected scopes require both a private identity root and the applicable branch secrets. Unlocking an identity does not automatically unlock every scope. Noise may cut inherited secrets, but must preserve the identity dependency. See [Identity-Bound Secrets — Design and Tests]({{ '/architecture/identity-bound-secrets/' | relative_url }}) for the contract, package responsibilities, and 11 acceptance criteria. These criteria are requirements, not a report of passing tests.

### **Identity Noise**
The `~()` operator establishes a boundary that cuts inherited secret lineage. Its caller-supplied value is not automatically random. Under the proposed identity-bound design, this boundary must never remove the private identity dependency. It does not by itself guarantee that on-disk metadata or access patterns are hidden. See [Identity-Bound Secrets]({{ '/architecture/identity-bound-secrets/' | relative_url }}).

### **Inherent Logic**
The pre-symbolic layer of structural necessity that defines what configurations are possible or impossible in a system before naming, syntax, or interpretation. It is not an imposed rule; it is the internal coherence condition of the form itself.

### **Inherent Logics**
The family of intrinsic structural constraints that emerge from forms, relations, and systems. In this view, logic precedes formulation: symbols describe constraints but do not create them. Geometry is treated as a direct manifestation of these constraints (form contains its own rule). In `.me`, this principle appears as behavior-first semantics: labels may vary, but structural necessity remains.

### **Namespaces**
A composite coordinate vector that locates execution context, not just a text label. A namespace can include domain, port, path, and related dimensions; it acts as a destination point in a probability/identity space where semantic resolution produces real consequences.

### **neurons.me**
The umbrella ecosystem and root brand that connects modular runtimes, data structures, identity primitives, and ML-oriented tooling. It is the shared foundation where modules such as `.me`, `cleaker`, and `.GUI` interoperate.

### **Operational Coherence**
Consistency of meaning validated by executable behavior rather than static taxonomy. A system is coherent when equivalent structures produce equivalent outcomes under the same operators.

### **Operational Meaning**
A shift from static metadata (describing data) to Executable Logic. In this paradigm, the meaning of a node is validated by its computational behavior and its role within a functional derivation.

### **Pointer Composition**
The property that chained structural pointers (`a -> b -> c`) resolve as a single suffix-preserving substitution without an explicit `a -> c` edge existing. Composition is verified for acyclic chains of any practical length, self-pointers, and cycles of any length — all fail closed or resolve correctly. Cycle detection tracks, within a single bounded resolution pass, which pointer edges have already been followed; redirecting through the same edge twice fails the read closed instead of recursing.

### **Push vs Pull**
An analytical split between write-path cost (push/mutation) and read-path cost (pull/first read after mutation). Used to isolate where latency is introduced in reactive systems.

### **Shared Meaning (Universal Geometry)**
The alignment of disparate linguistic labels (e.g., Spanish tienda vs. Japanese 店舗) through equivalent structural patterns. It allows for cross-context interoperability without forcing a single global vocabulary.

### **Secret Epoch**
A monotonic version marker for security topology state (secret/noise declarations). Caches and derived secret metadata are invalidated atomically when the epoch changes.

### **cleaker**
The identity-channel layer for network-wide DID and namespace resolution. In practice, `cleaker.me` is the common-ground root and `username.cleaker.me` is the user public tree, with `/?` representing observer-to-namespace binding.

### **Stealth Tax**
The relative latency overhead incurred by secret-path resolution compared to public-path resolution. It quantifies the runtime cost of privacy-preserving mechanics.

### **Stealth-Root**
A path-native encryption scope where the root of a private branch resolves to undefined by design. This ensures that while leaves remain readable to authorized keys, the existence of the subtree remains hidden from the public index.

### **Structural Silence**
El estado en el que una rama de datos existe y es funcional pero no proporciona metadatos, marcadores ni prefijos en el indice publico. Es la realizacion tecnica de la privacidad absoluta en grafos distribuidos.

### **Structured Necessity**
The principle that constraints are not external limitations but internal conditions for coherence. A form persists only by satisfying its own relational necessities.

### **.me**
The identity kernel/runtime of the ecosystem. It provides executable semantic trees, path-native operators, deterministic derivations, and secret scopes so identity and logic can be modeled as a live graph.

### **GUI (.GUI / this.GUI)**
The interface-generation layer of the ecosystem: a collection of components and building blocks for AI-powered GUI generation. It is designed as composable primitives that transform structured data/configuration into usable interfaces.

### **True Lazy Write**
A write strategy where mutation performs only minimal version updates (`O(1)`) and defers recomputation to read-time validation.

## Encrypted Island (Distributed Encrypted Audience)

A formal model for distributed encrypted data, from `monad.ai`.

An encrypted island is defined as `I = (path, ciphertext, T, A, P)` where:
- **T** = topology set — which nodes physically hold the ciphertext
- **A** = audience set — which identities can decrypt it
- **P** = procedure/capability set — what operations are permitted

Privacy predicates reduce to properties of these three sets:
- **private** — `|A| = 1`
- **shared** — `|A| ≥ 2`
- **public** — `A = ∅` (no encryption)
- **replicated** — `|T| > 1`
- **distributed** — `T` spans multiple physical locations

This is the theoretical underpinning of multi-device, multi-audience encrypted data in the mesh.

---

## Conceptual Mappings (Philosophical Layer)

> **Note**: The terms below are higher-level conceptual abstractions, not the kernel axioms.
> For the 11 kernel axioms (A-struct-0 through A9), see: [neurons-me/.me/npm/docs/Axioms.md](https://github.com/neurons-me/.me/blob/main/Typescript/docs/Axioms.md)

### **Runtime Invariance**
The physical manifestation of Inherent Logic. It ensures that the cost of thought (computational complexity) is `O(k)`, decoupled from total system data volume.

### **Structural Silence**
The physical manifestation of Stealth-Roots. It is the state where a branch is functionally active yet mathematically indetectable to observers without the correct path-coordinate and key.

### **Geometric Symmetry**
The physical manifestation of Shared Meaning. Distinct linguistic or domain labels can collapse into a single reference locus when their structural fingerprints match.

### **Data Invariance**
The axiom that data must be invariant under criterion. Recorded observation remains stable even when interpretive framework or execution mode changes.

### **Pre-Symbolic Logic**
Relational constraints exist before formal language. The boundary between possible and impossible configurations is foundational logic, not a product of syntax.

