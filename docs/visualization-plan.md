# Diagram And Visualization Plan

## Design Principles

- Show the same concept in multiple representations: words, equations, circuit, and visual state.
- Keep diagrams directly tied to user actions.
- Prefer inspectable diagrams over decorative visuals.
- Make all visuals accessible through labels, tables, and summaries.

## Bloch Sphere

### Purpose

Teach one-qubit state intuition, phase, and common gate rotations.

### Design

- 3D sphere with X, Y, and Z axes.
- State vector arrow from origin to surface.
- Labels for `|0>`, `|1>`, `|+>`, `|->`, `|i+>`, and `|i->`.
- Gate buttons animate the vector to the new position.
- Reduced-motion mode jumps to the final state.

### Implementation Notes

- Use Three.js or React Three Fiber.
- Provide a 2D fallback card listing theta, phi, amplitudes, and probabilities.
- Unit-test coordinate conversion from state vector to Bloch coordinates.

## Gate Matrix Visualizations

### Purpose

Connect gates to linear algebra.

### Design

- Matrix card for each gate.
- Before vector, gate matrix, after vector.
- Highlight rows and columns during multiplication.
- Include plain-language effect: "X swaps amplitudes" or "Z flips the phase of `|1>`."

### Implementation Notes

- Use HTML tables for accessibility.
- Avoid hiding complex values inside graphics only.

## Circuit Diagrams

### Purpose

Provide a readable representation of gate order and qubit wires.

### Design

- Horizontal wires for qubits.
- Vertical columns for timesteps.
- Standard gate symbols for H, X, Y, Z, S, T.
- Filled control dots and target symbols for controlled gates.
- SWAP crosses connected by vertical line.
- Current execution column highlighted.

### Implementation Notes

- Use SVG for precision and exportability.
- Keep a semantic data model independent from rendering.
- Add keyboard navigation with row and column coordinates.

## State-Vector Evolution

### Purpose

Make invisible state changes inspectable.

### Design

- Table of basis states and complex amplitudes.
- Probability column for each basis state.
- Changed amplitudes highlighted after each step.
- Optional amplitude bar chart.

### Implementation Notes

- Provide exact symbolic labels for common values where possible.
- Show decimal fallback with configurable precision.

## Probability Histograms

### Purpose

Teach measurement distributions and repeated sampling.

### Design

- Bars for basis states.
- Toggle between theoretical probabilities and sampled frequencies.
- Sampling controls: 1, 10, 100, 1000 shots.
- Error or convergence indicator.

### Implementation Notes

- Use SVG with ARIA labels and a backing table.
- Tests should verify probability sums and labels.

## Entanglement Illustrations

### Purpose

Show correlation without implying faster-than-light messaging.

### Design

- Bell state circuit next to joint measurement outcomes.
- Correlation matrix showing `00` and `11` outcomes.
- Text explanation distinguishes correlation from communication.

### Implementation Notes

- Avoid decorative "spooky" visuals.
- Use actual measurement data and state-vector facts.

## Algorithm Animations

### Purpose

Explain why algorithms work step by step.

### Design

- Timeline with named phases.
- Circuit diagram with current column.
- State/probability panel.
- Concept tags for each step.
- Classical comparison panel.

### Algorithms

- Deutsch-Jozsa: oracle and final measurement.
- Grover search: oracle marking, diffusion, amplitude amplification.
- Teleportation: entangled resource, Bell measurement, classical correction.
