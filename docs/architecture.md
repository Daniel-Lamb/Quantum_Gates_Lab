# Technical Architecture

## Architecture Summary

Quantum Gates Lab should be implemented as a modern interactive web application with a small, well-tested quantum simulator at its core. The simulator should be independent of React so it can be tested thoroughly and reused by UI components, lesson exercises, and algorithm demos.

## Proposed Stack

- **Framework:** Next.js App Router.
- **Language:** TypeScript.
- **UI:** React components with CSS modules or Tailwind CSS.
- **Content:** MDX lessons with typed metadata.
- **State:** Zustand or Jotai for circuit builder and sandbox state.
- **Math Engine:** Local TypeScript package under `src/lib/quantum`.
- **Visualizations:** SVG for circuit/state/probability diagrams, Three.js or React Three Fiber for Bloch sphere.
- **Testing:** Vitest for unit tests, Playwright for browser flows, Testing Library for component behavior.
- **Deployment:** Vercel or static-compatible Next.js hosting if no server features are required.

## System Boundaries

### Content Layer

Responsible for lesson metadata, ordered modules, MDX rendering, checkpoint questions, exercise definitions, and algorithm lab copy.

Data shape example:

```ts
type LessonMeta = {
  slug: string;
  module: string;
  title: string;
  level: "intro" | "core" | "advanced";
  objectives: string[];
  prerequisites: string[];
  interactives: InteractiveRef[];
  checkpointIds: string[];
};
```

### Simulator Layer

Responsible for all quantum math.

Core modules:

- `complex.ts`: immutable complex number operations.
- `state-vector.ts`: vector creation, normalization, tensor products, probability calculation.
- `gates.ts`: matrix definitions for supported gates.
- `apply-gate.ts`: single-qubit and multi-qubit gate application.
- `measure.ts`: deterministic probabilities and sampled measurement.
- `circuit.ts`: circuit model, validation, execution, step history.
- `algorithms.ts`: reusable demos for Deutsch-Jozsa, Grover, and teleportation.

Circuit data shape:

```ts
type Circuit = {
  qubitCount: number;
  columns: CircuitColumn[];
};

type CircuitColumn = {
  operations: CircuitOperation[];
};

type CircuitOperation =
  | { kind: "gate"; gate: "X" | "Y" | "Z" | "H" | "S" | "T"; target: number }
  | { kind: "controlled"; gate: "X" | "Z"; controls: number[]; target: number }
  | { kind: "swap"; a: number; b: number }
  | { kind: "measure"; targets: number[] };
```

### UI Layer

Primary surfaces:

- Course dashboard.
- Lesson reader.
- Interactive circuit builder.
- Gate reference.
- Algorithm lab.
- Exercise runner.

Component groups:

- `components/app-shell`: navigation, layout, progress.
- `components/circuit`: grid, gate palette, wires, controls, export panel.
- `components/visualizations`: Bloch sphere, histograms, matrix cards, state table.
- `components/lesson`: MDX wrappers, callouts, checkpoints, embedded interactives.
- `components/exercises`: code editor, tests, hints, result summary.

### State Management

Keep the simulator pure and store UI state separately.

Recommended state slices:

- `courseProgressStore`: completed lessons, quiz results, exercise attempts.
- `circuitStore`: active circuit, selected gate, selected column, execution index.
- `sandboxStore`: current lesson interactive settings.

Persist only lightweight progress and saved circuits to local storage in MVP.

## Visualization Strategy

Use SVG for most teaching visuals because it is inspectable, accessible, and deterministic in tests.

- Circuit diagrams: SVG grid and gate symbols.
- Probability histograms: SVG bars with accessible labels.
- State-vector view: semantic table plus optional amplitude bars.
- Gate matrices: HTML table or CSS grid.
- Bloch sphere: Three.js scene with fallback 2D projection.

## Routing Plan

```text
/
/learn
/learn/[moduleSlug]
/learn/[moduleSlug]/[lessonSlug]
/lab/circuit-builder
/lab/algorithms
/lab/algorithms/[algorithmSlug]
/reference/gates
/reference/concepts
```

## Backend Strategy

MVP does not require a backend. Use local content, client-side state, and local storage.

Optional later backend:

- User accounts and saved progress.
- Instructor course sections.
- Shareable circuit links.
- Server-side exercise evaluation for larger assignments.

## Accessibility Requirements

- Every visual must have a textual equivalent.
- Circuit builder must support keyboard placement and deletion.
- Color should not be the only indicator of state.
- Probability charts need readable labels and values.
- Animations must respect reduced motion preferences.
- Focus order must follow visual workflow.

## Performance Constraints

- Simulator should clearly warn when qubit counts exceed supported limits.
- Use memoization for derived probabilities and state summaries.
- Avoid unnecessary React re-renders while stepping circuits.
- Keep lesson payloads small by lazy-loading heavy interactives.

## Deployment

The MVP should deploy as a standard Next.js app. Static export is preferred if compatible with MDX and routing needs. If server rendering is used, Vercel deployment is the default path.
