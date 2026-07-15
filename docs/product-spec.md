# Product Specification

## Product Vision

Quantum Gates Lab is an interactive web platform that helps CS students build an operational understanding of quantum computation. The app teaches quantum concepts through circuit manipulation, state inspection, animated diagrams, coding exercises, and guided reasoning.

The product should feel like a serious course lab: precise, visual, fast, and forgiving. It should avoid vague mystical language and instead repeatedly connect concepts to vectors, matrices, circuits, probabilities, and runnable code.

## Target Users

### Primary User: CS Student

- Knows variables, functions, arrays, boolean logic, and basic linear algebra.
- May be intimidated by Dirac notation or complex numbers.
- Wants examples that connect math to code.
- Benefits from immediate feedback and visual confirmation.

### Secondary User: Instructor

- Wants reliable demos for lectures and assignments.
- Needs diagrams that are clear enough to discuss live.
- Wants lessons to map cleanly to course topics.

### Secondary User: Self-Study Programmer

- Has programming experience but little formal quantum background.
- Wants a path from "what is a qubit?" to "I can build small circuits."

## Learning Experience

Students move through the product in five modes:

1. **Guided Lesson**
   A short lesson introduces one concept, shows a visual, and asks the student to predict circuit behavior.

2. **Interactive Sandbox**
   Students modify gates, qubits, inputs, or measurements and see state/probability changes immediately.

3. **Coding Exercise**
   Students write a tiny circuit program using a teaching DSL, then run tests against expected states or measurement distributions.

4. **Checkpoint Quiz**
   Short conceptual and computational questions check whether students understand the lesson.

5. **Algorithm Lab**
   Students step through a full algorithm and inspect each transformation.

## Core Feature Set

### Guided Curriculum

- Lesson pages organized by module and difficulty.
- MDX content with embedded interactive components.
- Progress markers for completed readings, exercises, and quizzes.
- Misconception callouts after wrong predictions.

### Quantum Circuit Builder

- 1 to 6 qubits in the first full release.
- Drag gates onto a time-column grid.
- Supports X, Y, Z, H, S, T, CNOT, CZ, SWAP, and Toffoli.
- Step forward and backward through circuit execution.
- Shows current state vector, probabilities, and measurement outcomes.
- Exports circuit as JSON and teaching DSL code.

### Gate Challenge Mode

- Presents a target state, distribution, or concept.
- Constrains allowed gates and operation count.
- Scores submitted circuits using the simulator.
- Provides hints and targeted feedback.

### Circuit Debugging Exercises

- Presents intentionally broken circuits.
- Shows expected versus actual output.
- Lets students fix circuits under edit constraints.
- Explains the first incorrect state transition after solving.

### Simulator Engine

- Pure TypeScript state-vector simulator.
- Complex number utilities.
- Gate matrix definitions.
- Single-qubit, controlled, swap, and custom matrix operations.
- Deterministic state evolution plus sampled measurement.
- Designed for correctness and readability over large-qubit performance.

### Visualizations

- Bloch sphere for one-qubit states.
- Circuit diagram renderer.
- Probability histogram.
- State-vector amplitude table.
- Gate matrix cards.
- Entanglement correlation panel.
- Algorithm step timeline.

### Mini Coding Exercises

- Browser editor for a small DSL such as:

```ts
circuit(2)
  .h(0)
  .cx(0, 1)
  .measureAll()
```

- Exercise tests compare final probabilities or expected states within tolerance.
- Hint system reveals one conceptual hint, then one implementation hint.

### Gate Reference Explorer

- One page per supported gate.
- Includes symbol, matrix, examples, inverse, powers, Bloch effect, common uses, and common mistakes.
- Links directly into relevant lessons and challenges.

### Explain This Circuit

Given a circuit, the app should generate a structured explanation:

- Initial state.
- Gate sequence.
- State changes after each important step.
- Measurement probabilities.
- Concept tags such as "superposition", "phase", or "entanglement".

The MVP version can be deterministic template-based. A later version can support optional AI-assisted explanations.

### Progressive Lesson Paths

- "No Linear Algebra Yet" path.
- "CS Theory" path.
- "Programming" path.
- Full course path.
- Lessons expose optional advanced sections based on path.

### Assessment Bank

- Reusable tagged questions for checkpoints, reviews, and instructor sets.
- Supports probability prediction, circuit matching, matrix calculation, code completion, and misconception questions.

### Instructor Mode

- Presentation-friendly demos.
- Hide/reveal answer controls.
- Exportable diagrams.
- Shareable lesson and circuit links.
- Review set builder from the assessment bank.

## User Flows

### First-Time Student

1. Opens the app and lands on the course dashboard.
2. Starts "Qubits and Superposition".
3. Reads a short explanation of amplitude and basis states.
4. Uses a one-qubit simulator to apply X and H.
5. Predicts measurement results.
6. Completes a short quiz.
7. Unlocks the next module.

### Circuit Sandbox Flow

1. Student opens the circuit builder.
2. Adds two qubits.
3. Places H on qubit 0 and CNOT from qubit 0 to qubit 1.
4. Steps through execution.
5. Watches the state vector become a Bell state.
6. Samples measurement outcomes.
7. Reads the generated explanation.

### Algorithm Lab Flow

1. Student chooses teleportation.
2. App shows preconditions and registers.
3. Student steps through entanglement creation, Bell measurement, correction, and final state recovery.
4. Each step updates circuit diagram, state summary, and explanatory text.
5. Student answers a checkpoint about why classical bits are still needed.

## Non-Goals For MVP

- Full universal quantum SDK compatibility.
- Large-qubit simulation.
- Hardware provider integration.
- User accounts.
- Real-time collaboration.
- AI-generated lesson authoring.

## Success Criteria

- A student can complete the first four modules without instructor help.
- The circuit builder can accurately simulate all supported gates for up to 4 qubits in MVP.
- Every lesson includes at least one interactive element and one checkpoint.
- Simulator unit tests cover all gate definitions and core algorithms.
- The app is usable on laptop and tablet screen sizes.
