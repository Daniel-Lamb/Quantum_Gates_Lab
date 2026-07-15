# Interactive Tools

## Circuit Builder

### Goal

Let students construct small quantum circuits visually and inspect the result at each step.

### User Flow

1. Choose qubit count.
2. Drag a gate from the palette.
3. Drop it on a wire and column.
4. Configure controls for controlled gates.
5. Step through the circuit.
6. Inspect state vector, probabilities, Bloch sphere if applicable, and generated explanation.

### Required Features

- Gate palette.
- Circuit grid.
- Add/remove columns.
- Add/remove qubits within supported range.
- Step, run, reset controls.
- Export to JSON.
- Export to teaching DSL.
- Import from JSON.

## Gate Challenge Mode

### Goal

Turn circuit construction into focused practice with clear targets and constraints.

### Required Features

- Target state or target probability display.
- Allowed gate set.
- Maximum operation count.
- Submit and validate button.
- Hint ladder.
- Explanation after solve.

## Circuit Debugging Lab

### Goal

Teach students to diagnose gate-order, control-target, and measurement mistakes.

### Required Features

- Broken circuit display.
- Expected versus actual output.
- Locked and editable circuit regions.
- State divergence marker.
- Fix validation.

## Gate-By-Gate Simulator

### Goal

Let students observe state evolution after each operation.

### Required Features

- Execution history.
- Current operation highlight.
- Before and after state diff.
- Probability update.
- Measurement sampling.

## Measurement Probability Visualizer

### Goal

Teach the difference between theoretical probability and sampled outcomes.

### Required Features

- Theoretical distribution.
- Shot-based sampling.
- Histogram convergence.
- Reset samples.
- Explain why individual outcomes vary.

## Mini Coding Exercises

### Goal

Bridge visual circuits and programming.

### Exercise Shape

```ts
type Exercise = {
  id: string;
  title: string;
  prompt: string;
  starterCode: string;
  tests: ExerciseTest[];
  hints: string[];
};

type ExerciseTest =
  | { kind: "probability"; basis: string; expected: number; tolerance: number }
  | { kind: "state"; basis: string; amplitude: string; tolerance: number }
  | { kind: "circuit-shape"; requiredGates: string[] };
```

### Required Features

- Starter code.
- Run tests.
- Show failures as learning feedback.
- Reveal hints progressively.
- Convert passing code to circuit diagram.

## Mini Quantum Programming DSL Lab

### Goal

Make code and circuit diagrams interchangeable for learning.

### Required Features

- Constrained DSL parser.
- AST to circuit conversion.
- Circuit to DSL export.
- Compiler-style teaching errors.
- Exercise tests over states, probabilities, and circuit shape.

## Quiz And Checkpoint System

### Goal

Make each lesson accountable without turning the app into a test bank.

### Question Types

- Multiple choice.
- Predict measurement probability.
- Select the next gate.
- Match circuit to outcome.
- Identify misconception.

### Feedback

- Correct answer explanation.
- Wrong answer misconception explanation.
- Link back to relevant interactive.

## Explain This Circuit Mode

### Goal

Turn circuits into structured reasoning.

### MVP Approach

Use deterministic templates based on gate sequence, state changes, and concept tags.

### Explanation Sections

- Initial state.
- Gate sequence summary.
- Key state transitions.
- Probability result.
- Concept tags.
- Suggested next experiment.

## Classical Versus Quantum Logic Explorer

### Goal

Help students compare classical boolean operations with reversible and quantum operations.

### Required Features

- Truth table panel.
- Reversible gate panel.
- Toffoli examples.
- Matrix/unitary requirement explanation.
- Side-by-side circuit diagrams.

## Entanglement Correlation Simulator

### Goal

Show the difference between individual randomness and joint correlation.

### Required Features

- Bell state presets.
- Measurement basis selector.
- Joint outcome matrix.
- Individual histograms.
- Correlation explanation.

## Instructor Mode

### Goal

Support classroom demonstrations and reusable teaching materials.

### Required Features

- Demo playlist.
- Presentation layout.
- Hide/reveal answer controls.
- Export SVG diagrams and charts.
- Copy lesson, challenge, and circuit links.
