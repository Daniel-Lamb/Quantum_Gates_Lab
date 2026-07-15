# Feature Expansion Plan

This document incorporates the selected expansion ideas into the product plan. These are not isolated extras; each feature should connect to lessons, simulator capabilities, assessment, and reusable teaching flows.

## 1. Gate Challenge Mode

### Product Goal

Give students target states or target distributions and ask them to build a valid circuit under constraints.

### Where It Lives

- Route: `/lab/challenges`
- Lesson embeds: single-qubit gates, entanglement, circuits, algorithms.
- Content source: `content/challenges/*.json`

### Experience

Students receive a challenge card with:

- Starting state.
- Target state, target probabilities, or required concept.
- Allowed gates.
- Maximum gate count.
- Optional forbidden gates.
- Scoring rubric.

Example:

```ts
type GateChallenge = {
  id: string;
  title: string;
  prompt: string;
  qubitCount: number;
  startState: string;
  target:
    | { kind: "state"; amplitudes: Record<string, string>; tolerance: number }
    | { kind: "probabilities"; probabilities: Record<string, number>; tolerance: number }
    | { kind: "concept"; concept: "bell-state" | "phase-kickback" | "interference" };
  allowedGates: string[];
  maxOperations?: number;
  hints: string[];
};
```

### Build Notes

- Reuse the circuit builder and simulator.
- Add a challenge validation layer that compares final state or probabilities.
- Show "almost there" feedback when distribution is close but phase is wrong.

### Lessons It Strengthens

- Single-qubit gates.
- Entanglement.
- Algorithm preparation.

## 2. Step-By-Step Matrix Multiplication Lessons

### Product Goal

Make gate application legible by showing how matrices transform state vectors.

### Where It Lives

- Lesson embeds in modules 3 and 4.
- Reference pages for each gate.
- Route: `/reference/matrix-lab`

### Experience

Students choose a gate and input vector. The visual walks through:

1. Gate matrix selection.
2. Input vector.
3. Row and column multiplication.
4. Complex addition.
5. Resulting vector.
6. Probability interpretation.

### Build Notes

- Create `MatrixMultiplicationStepper`.
- Reuse complex number formatter from simulator.
- Support symbolic common values such as `1/sqrt(2)`, `i`, and `-i`.

### Lessons It Strengthens

- Bloch sphere intuition.
- Single-qubit gates.
- Multi-qubit systems.

## 3. Circuit Debugging Exercises

### Product Goal

Teach students to reason from observed output back to circuit mistakes.

### Where It Lives

- Route: `/lab/debugging`
- Lesson checkpoints after key concepts.
- Exercise bank.

### Experience

Each debugging exercise includes:

- Broken circuit.
- Expected behavior.
- Actual probabilities or state.
- Constraints on edits.
- Feedback after each attempted fix.

Example exercise:

```ts
type DebuggingExercise = {
  id: string;
  title: string;
  brokenCircuit: Circuit;
  expectedTarget: GateChallenge["target"];
  allowedEdits: ("replace-gate" | "move-gate" | "add-gate" | "remove-gate")[];
  misconception: string;
  explanationAfterSolve: string;
};
```

### Build Notes

- Extend circuit builder with "exercise locked regions."
- Add diffing between broken and solved circuits.
- Use simulator history to explain the first step where behavior diverges.

### Lessons It Strengthens

- Gate order.
- Control and target semantics.
- Measurement placement.

## 4. Quantum Versus Classical Logic Lab

### Product Goal

Help CS students connect familiar boolean logic to reversible and quantum computation.

### Where It Lives

- Route: `/lab/classical-vs-quantum`
- Curriculum module 10.
- Gate reference pages for CNOT, SWAP, and Toffoli.

### Experience

The lab shows three synchronized panels:

- Classical truth table.
- Reversible circuit.
- Quantum circuit and matrix/unitary explanation.

Students can compare:

- NOT and X.
- XOR and CNOT.
- AND via Toffoli with ancilla.
- Irreversible erase versus reversible uncompute.

### Build Notes

- Add truth-table utilities independent from quantum simulator.
- Add reversible circuit examples.
- Include "why measurement breaks reversibility" callouts.

### Lessons It Strengthens

- Classical-to-quantum transition.
- Toffoli.
- Algorithm cleanup and uncomputation.

## 5. Entanglement Correlation Simulator

### Product Goal

Let students see that entangled measurements are individually random but jointly correlated.

### Where It Lives

- Route: `/lab/entanglement`
- Lesson embed in module 6.
- Algorithm lab support for teleportation.

### Experience

Students prepare Bell states, choose measurement bases, run repeated shots, and inspect:

- Individual measurement histograms.
- Joint distribution matrix.
- Correlation coefficient.
- State-vector explanation.

### Build Notes

- Extend measurement utilities to return joint counts.
- Add correlation matrix visualization.
- Warn against the misconception that entanglement enables communication.

### Lessons It Strengthens

- Bell states.
- Measurement.
- Teleportation.

## 6. Algorithm Storyboards

### Product Goal

Turn algorithms into narrative, inspectable sequences rather than intimidating final circuits.

### Where It Lives

- Route: `/lab/algorithms/[algorithmSlug]`
- Content source: `content/algorithms/*.json`

### Experience

Each algorithm page has:

- Problem statement.
- Classical baseline.
- Register setup.
- Step-by-step storyboard.
- Current circuit.
- State/probability panel.
- Concept tags.
- Checkpoint after major phases.

### Build Notes

- Create `AlgorithmStoryboard` and `AlgorithmTimeline`.
- Model each algorithm as ordered phases with circuit snapshots.
- Use the simulator to compute every displayed state rather than hard-coding results.

### Lessons It Strengthens

- Deutsch-Jozsa.
- Grover search.
- Teleportation.
- Interference as computation.

## 7. Mini Quantum Programming DSL

### Product Goal

Bridge visual circuits and code so students learn quantum programming patterns.

### Where It Lives

- Route: `/lab/code`
- Embedded exercises in modules 7 through 9.
- Circuit builder export panel.

### Experience

Students write small programs such as:

```ts
circuit(2)
  .h(0)
  .cx(0, 1)
  .measureAll();
```

The app shows:

- Parsed circuit diagram.
- Simulator output.
- Tests.
- Helpful compiler-style errors.

### Build Notes

- Implement a constrained parser or fluent builder rather than running arbitrary user JavaScript.
- Convert DSL AST to the shared `Circuit` model.
- Add exercise tests based on expected state, probabilities, or circuit shape.

### Lessons It Strengthens

- Programming quantum circuits.
- Debugging.
- Algorithm implementation.

## 8. Gate Reference Explorer

### Product Goal

Create a complete, consistent reference for every supported gate.

### Where It Lives

- Route: `/reference/gates`
- Route: `/reference/gates/[gateSlug]`

### Experience

Each gate page includes:

- Symbol.
- Matrix.
- Input/output examples.
- Bloch sphere effect when applicable.
- Circuit examples.
- Inverse and powers.
- Common uses.
- Common mistakes.
- Challenge links.

### Build Notes

- Build gate reference data from simulator gate definitions where possible.
- Avoid duplicate hand-entered matrices.
- Add references from lesson pages.

### Lessons It Strengthens

- All gate-focused lessons.
- Coding and challenge modes.

## 9. Explain This Circuit

### Product Goal

Give students a structured explanation of any circuit they build.

### Where It Lives

- Circuit builder side panel.
- Challenge feedback.
- Debugging exercise feedback.
- Algorithm labs.

### Experience

The explanation includes:

- Initial state.
- Gate-by-gate summary.
- Important state transitions.
- Final probabilities.
- Concept tags.
- Misconception warnings when relevant.

### Build Notes

- MVP should be deterministic and template-based.
- Generate explanations from simulator execution history.
- Keep optional AI explanations as a future enhancement, not a dependency.

### Lessons It Strengthens

- Self-study and debugging.
- Instructor demonstrations.

## 10. Progressive Lesson Paths

### Product Goal

Let students choose a path suited to their background.

### Where It Lives

- Course dashboard.
- Lesson metadata.
- Progress store.

### Paths

- **No Linear Algebra Yet:** focuses on visuals, intuition, and simple vectors.
- **CS Theory Path:** emphasizes reversible logic, complexity intuition, and algorithms.
- **Programming Path:** emphasizes DSL exercises and circuit implementation.
- **Full Course Path:** includes all modules in recommended order.

### Build Notes

- Add `paths` and `difficulty` to lesson metadata.
- Dashboard filters lessons by path.
- Each lesson can expose optional advanced sections.

### Lessons It Strengthens

- All curriculum modules.

## 11. Assessment Bank

### Product Goal

Create reusable questions that can appear in quizzes, challenges, and instructor mode.

### Where It Lives

- `content/assessments/*.json`
- Lesson checkpoints.
- Instructor exports.

### Question Types

- Probability prediction.
- Gate identification.
- Circuit outcome matching.
- Matrix result calculation.
- Debugging diagnosis.
- Code completion.
- Concept misconception.

### Build Notes

- Add question schema validation.
- Store rubric and feedback with each question.
- Make questions taggable by concept and difficulty.

### Lessons It Strengthens

- Checkpoints.
- Review sessions.
- Instructor usage.

## 12. Instructor Mode

### Product Goal

Make the app useful in classrooms, labs, and recitations.

### Where It Lives

- Route: `/instructor`
- Export tools in diagrams and lessons.

### Experience

Instructor mode includes:

- Demo playlist.
- Reveal/hide answers.
- Export circuit SVG.
- Export probability charts.
- Copy lesson deep links.
- Build a short review set from the assessment bank.
- Presentation-friendly layout.

### Build Notes

- Reuse existing lesson, challenge, and diagram components.
- Avoid account requirements in MVP.
- Add URL parameters for preloaded circuits and demos.

### Lessons It Strengthens

- Classroom use across the full product.

## Integration Roadmap

### MVP Additions

- Gate challenge mode for single-qubit states and Bell states.
- Matrix multiplication stepper for X, H, and Z.
- Gate reference explorer for MVP gates.
- Template-based Explain This Circuit panel.
- Assessment bank powering lesson checkpoints.

### Version 1 Additions

- Circuit debugging exercises.
- Mini quantum DSL exercises.
- Progressive lesson paths.
- Quantum versus classical logic lab.
- Entanglement correlation simulator.

### Advanced Additions

- Algorithm storyboards for Deutsch-Jozsa, Grover, and teleportation.
- Instructor mode.
- Custom challenge authoring.
- Exportable review sets.

## Verification Plan

- Unit-test all schema validators.
- Unit-test challenge scoring against known circuits.
- Unit-test DSL parsing and circuit conversion.
- Browser-test one complete challenge, one debugging exercise, one DSL exercise, and one instructor export.
- Validate every expanded lesson feature has fallback text for accessibility.
