# Development Roadmap

## Phase 0: Repository Blueprint

Status: complete in this planning repository.

Deliverables:

- Product spec.
- Architecture plan.
- Curriculum map.
- Visualization plan.
- Interactive tool definitions.
- Testing strategy.
- Codex implementation loops.

## Phase 1: Application Scaffold

Goal: create a working Next.js and TypeScript app with tooling.

Deliverables:

- App Router project.
- Strict TypeScript.
- Linting and formatting.
- Test runners.
- Basic route layout.
- CI-ready scripts.

## Phase 2: App Shell And Design System

Goal: create the navigation, layout, tokens, and reusable UI primitives.

Deliverables:

- Course dashboard.
- Lab navigation.
- Reference navigation.
- Responsive shell.
- Accessible button, tab, panel, tooltip, and callout components.

## Phase 3: Lesson Content System

Goal: make lesson content structured and renderable.

Deliverables:

- MDX loader.
- Lesson metadata schema.
- Module index.
- Checkpoint data model.
- Embedded interactive slots.

## Phase 4: Quantum Simulator Core

Goal: implement mathematically correct small-qubit simulation.

Deliverables:

- Complex numbers.
- State vectors.
- Gate matrices.
- Gate application.
- Measurement probabilities and sampling.
- Circuit execution history.
- Unit tests for all supported gates.

## Phase 5: Core Visualizations

Goal: render the main math views.

Deliverables:

- Circuit diagram renderer.
- State-vector table.
- Probability histogram.
- Gate matrix cards.

## Phase 6: Interactive Circuit Builder

Goal: allow students to build and simulate circuits.

Deliverables:

- Gate palette.
- Grid editor.
- Keyboard support.
- Step execution.
- JSON and DSL export.
- Explanation panel.

## Phase 7: Bloch Sphere

Goal: teach one-qubit intuition visually.

Deliverables:

- Bloch coordinate utilities.
- 3D sphere.
- Gate animations.
- Reduced-motion fallback.
- Lesson embeds.

## Phase 8: Lessons And Exercises

Goal: fill the MVP curriculum with usable learning content.

Deliverables:

- First six modules.
- Quizzes.
- Coding exercises.
- Gate challenge mode for foundational target states.
- Step-by-step matrix multiplication embeds.
- Misconception-aware feedback.
- Hints and feedback.
- Progress persistence.

## Phase 9: Algorithm Labs

Goal: implement full walkthroughs for core algorithms.

Deliverables:

- Deutsch-Jozsa demo.
- Grover search demo.
- Teleportation demo.
- Algorithm storyboards with classical baselines.
- Algorithm timelines.
- Classical comparison panels.

## Phase 10: Quality, Accessibility, And Deployment

Goal: make the product reliable enough to share.

Deliverables:

- Unit test coverage for simulator.
- Playwright smoke tests.
- Accessibility pass.
- Responsive layout pass.
- Documentation polish.
- Deployment configuration.

## Phase 11: Expanded Practice Labs

Goal: deepen student practice after the core learning loop works.

Deliverables:

- Circuit debugging exercises.
- Entanglement correlation simulator.
- Quantum versus classical logic lab.
- Mini quantum programming DSL lab.
- Gate reference explorer.
- Explain This Circuit panel integrated into labs.

## Phase 12: Course Personalization And Instructor Tools

Goal: make the platform adaptable to different learners and classroom use.

Deliverables:

- Progressive lesson paths.
- Assessment bank.
- Instructor mode.
- Exportable circuit diagrams and probability charts.
- Demo playlists and reveal controls.

## MVP Definition

The MVP is complete when:

- The app has a course dashboard and at least four guided modules.
- The simulator supports X, Y, Z, H, S, T, CNOT, CZ, SWAP.
- The circuit builder can create and run two-qubit circuits.
- Bell state creation is supported and explained.
- Probability histograms and state-vector views update correctly.
- At least one coding exercise and one quiz exist per module.

## Advanced Release Definition

The advanced release is complete when:

- Toffoli and custom oracles are supported.
- Algorithm labs include Deutsch-Jozsa, Grover, and teleportation.
- Lessons cover all modules in the curriculum map.
- Bloch sphere is polished and accessible.
- Saved circuits and shareable URLs exist.
- Instructor export mode exists for diagrams and lesson links.
- Expanded practice labs include challenges, debugging, DSL exercises, and classical-versus-quantum comparisons.
