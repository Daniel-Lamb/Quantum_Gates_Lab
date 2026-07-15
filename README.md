# Quantum Gates Lab

Quantum Gates Lab is a planned interactive learning platform for computer science students who want to understand quantum programming, quantum gates, circuits, and the computational model behind quantum algorithms.

The project is intentionally more than a static tutorial. It is designed as a polished web application with guided lessons, visual simulations, a circuit builder, small coding exercises, quizzes, and algorithm walkthroughs that connect the math to executable quantum programs.

## Audience

- Undergraduate CS students taking an introductory quantum computing course.
- Advanced high school or early graduate students who know linear algebra basics.
- Instructors who want visual, inspectable demonstrations for gates and circuits.
- Self-study programmers who want to move from intuition to code.

## Learning Goals

Students should be able to:

- Explain qubits, amplitudes, phase, superposition, and measurement.
- Predict the effect of common single-qubit and multi-qubit gates.
- Build small quantum circuits and interpret their state vectors and probabilities.
- Understand entanglement through circuit behavior, not just vocabulary.
- Compare classical boolean logic with reversible and quantum logic.
- Implement simple algorithms such as Deutsch-Jozsa, Grover search, and teleportation.
- Read and write small quantum programs using a teaching-oriented circuit DSL.

## Planned Product

The application will include:

- A guided curriculum with lessons, checkpoints, and interactive sandboxes.
- A drag-and-drop quantum circuit builder.
- A gate-by-gate simulator for small circuits.
- Bloch sphere, circuit, state-vector, and probability visualizations.
- Mini coding exercises using a lightweight in-browser quantum DSL.
- Algorithm demos with step controls and explanatory overlays.
- An "Explain this circuit" mode that turns a circuit into human-readable reasoning.
- Instructor-friendly lesson data and exportable diagrams.

## Recommended Stack

- Next.js App Router with React and TypeScript.
- MDX-backed lesson content with typed frontmatter.
- Zustand or Jotai for interactive simulator state.
- SVG for circuit diagrams and probability charts.
- Three.js or React Three Fiber for Bloch sphere visualization.
- A lightweight TypeScript simulator for up to 4 to 6 qubits.
- Vitest for simulator unit tests.
- Playwright for interaction and visual regression smoke tests.
- ESLint, TypeScript strict mode, and Prettier.

## Repository Map

- [docs/product-spec.md](docs/product-spec.md): product vision, users, workflows, and feature scope.
- [docs/architecture.md](docs/architecture.md): technical architecture and implementation strategy.
- [docs/curriculum-map.md](docs/curriculum-map.md): full course structure and learning objectives.
- [docs/visualization-plan.md](docs/visualization-plan.md): diagram and animation plan.
- [docs/interactive-tools.md](docs/interactive-tools.md): proposed tools and user flows.
- [docs/feature-expansion-plan.md](docs/feature-expansion-plan.md): incorporation plan for expanded lessons, labs, references, challenges, and instructor tools.
- [docs/existing-feature-enhancements.md](docs/existing-feature-enhancements.md): 15 enhancements to deepen the already planned feature set.
- [docs/roadmap.md](docs/roadmap.md): staged build from MVP to advanced release.
- [docs/testing-strategy.md](docs/testing-strategy.md): verification strategy for math, UI, and pedagogy.
- [specs/file-structure.md](specs/file-structure.md): target application file layout.
- [.codex/loops/README.md](.codex/loops/README.md): sequential Codex build loops.

## Setup

This repository currently contains the full product and implementation blueprint. The first Codex loop will scaffold the actual application.

Recommended first implementation command once the scaffold loop is run:

```bash
npm install
npm run dev
```

## Build Philosophy

Quantum Gates Lab should teach by letting students manipulate the system. Every major concept should have:

- A short conceptual explanation.
- A concrete matrix or circuit representation.
- An interactive visual.
- A prediction prompt before revealing the result.
- A coding exercise or circuit-building task.
- A misconception check.

The best version of this project makes abstract quantum mechanics feel inspectable, testable, and programmable.
