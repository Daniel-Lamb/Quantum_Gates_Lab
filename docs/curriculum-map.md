# Curriculum Map

## Module 1: Classical Bits To Qubits

### Topics

- Classical bits and boolean logic.
- Basis states `|0>` and `|1>`.
- Amplitudes and probability.
- Why a qubit is not just a hidden classical bit.

### Learning Objectives

- Represent a one-qubit state as a vector.
- Explain how probabilities come from squared amplitudes.
- Distinguish state from measurement outcome.

### Interactive

- One-qubit state slider with immediate probability display.
- Prediction prompt: "What happens if we measure now?"

## Module 2: Superposition And Measurement

### Topics

- Superposition.
- Normalization.
- Measurement collapse.
- Repeated sampling.

### Learning Objectives

- Predict distributions from simple states.
- Explain why one measurement is not enough to know the full state.
- Interpret probability histograms.

### Interactive

- Repeated measurement sampler with histogram convergence.

## Module 3: Bloch Sphere Intuition

### Topics

- Phase.
- Global phase versus relative phase.
- Rotations as single-qubit gates.
- Bloch sphere axes.

### Learning Objectives

- Map common states to sphere positions.
- Explain why phase matters before interference.
- Use Bloch sphere movement to reason about gates.

### Interactive

- Bloch sphere with gate buttons for X, Y, Z, H, S, and T.

## Module 4: Single-Qubit Gates

### Topics

- Matrix multiplication.
- X, Y, Z, H, S, T gates.
- Gate composition.
- Inverses and repeated gates.

### Learning Objectives

- Apply gate matrices to one-qubit states.
- Predict effects of common gate sequences.
- Recognize phase-only changes.

### Interactive

- Gate matrix visualizer with before and after state vectors.

## Module 5: Multi-Qubit Systems

### Topics

- Tensor products.
- State-vector size growth.
- Two-qubit basis states.
- Independent versus correlated states.

### Learning Objectives

- Read a two-qubit state vector.
- Explain why simulation cost grows exponentially.
- Identify separable states in simple examples.

### Interactive

- Two-qubit basis explorer and amplitude table.

## Module 6: Controlled Gates And Entanglement

### Topics

- CNOT.
- CZ.
- SWAP.
- Toffoli.
- Bell states.
- Entanglement correlations.

### Learning Objectives

- Build a Bell state using H and CNOT.
- Explain control and target semantics.
- Identify measurement correlations in entangled states.

### Interactive

- Circuit builder challenge: create a Bell pair.

## Module 7: Quantum Circuits

### Topics

- Circuit columns and time steps.
- Registers.
- Measurement operations.
- Equivalent circuits.
- Reversible logic.

### Learning Objectives

- Translate a diagram into circuit data.
- Step through a circuit and inspect state changes.
- Compare classical and quantum control flow.

### Interactive

- Drag-and-drop circuit builder with step execution.

## Module 8: Programming Quantum Circuits

### Topics

- Teaching DSL.
- Circuit construction in code.
- Tests over probabilities.
- Debugging quantum programs.

### Learning Objectives

- Write small quantum circuits in TypeScript-style syntax.
- Use tests to validate expected distributions.
- Debug incorrect gate order.

### Interactive

- Coding exercises with run button, tests, and hints.

## Module 9: Algorithm Lab

### Topics

- Deutsch-Jozsa.
- Grover search.
- Quantum teleportation.
- Interference as computation.

### Learning Objectives

- Explain each algorithm at circuit level.
- Identify where superposition, entanglement, and measurement appear.
- Compare algorithmic steps to a classical baseline.

### Interactive

- Step-by-step algorithm timeline.

## Module 10: Classical Versus Quantum Logic

### Topics

- Irreversible classical gates.
- Reversible gates.
- Toffoli as universal reversible logic.
- Quantum gates as unitary operations.

### Learning Objectives

- Explain why quantum gates must be reversible before measurement.
- Compare truth tables to unitary matrices.
- Build classical logic using reversible gates.

### Interactive

- Side-by-side boolean circuit and reversible quantum circuit explorer.
