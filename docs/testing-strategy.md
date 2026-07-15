# Testing Strategy

## Testing Priorities

Quantum Gates Lab depends on mathematical correctness. Simulator tests come before UI polish because every visualization and lesson depends on the same state transitions.

## Unit Tests

### Simulator

Test:

- Complex addition, multiplication, conjugation, magnitude, and equality tolerance.
- State-vector normalization.
- Tensor products.
- Gate matrices for X, Y, Z, H, S, T.
- CNOT, CZ, SWAP, and Toffoli behavior.
- Gate composition identities such as `X * X = I` and `H * H = I`.
- Measurement probability sums equal 1 within tolerance.
- Bell state probabilities are 50 percent `00` and 50 percent `11`.

### Algorithms

Test:

- Deutsch-Jozsa constant oracle output.
- Deutsch-Jozsa balanced oracle output.
- Grover one-solution amplification for two qubits.
- Teleportation recovers the input state after correction.

## Component Tests

Test:

- Gate palette renders available gates.
- Circuit grid adds and removes gates.
- Step controls advance execution.
- Probability histogram labels match simulator output.
- Lesson checkpoint feedback appears.
- Coding exercise runner reports passing and failing tests.

## Browser Tests

Use Playwright for:

- App loads and dashboard appears.
- Student opens first lesson.
- Student completes a checkpoint.
- Student builds H plus CNOT circuit.
- Student steps through Bell state creation.
- Student runs a coding exercise.
- Reduced-motion preference does not break visualizations.

## Accessibility Tests

Check:

- Keyboard circuit editing.
- Focus states.
- Button and icon labels.
- Chart text alternatives.
- Color contrast.
- Reduced motion.
- Screen-reader summaries for diagrams.

## Visual Regression

Use targeted screenshots for:

- Circuit diagram.
- Probability histogram.
- State-vector table.
- Bloch sphere fallback.
- Algorithm timeline.

Avoid brittle full-page screenshots until layout stabilizes.

## Pedagogical Validation

Each lesson should be reviewed against:

- One clear concept per section.
- Prediction before reveal.
- Immediate feedback.
- Explicit misconception handling.
- No unexplained notation.
- A concrete coding or circuit task.

## Acceptance Gates

Before merging a loop:

- `npm run typecheck` passes.
- `npm run lint` passes.
- `npm run test` passes.
- Relevant Playwright smoke test passes for UI loops.
- New lesson content includes at least one interactive or checkpoint.
