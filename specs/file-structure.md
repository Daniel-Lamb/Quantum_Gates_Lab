# Target File Structure

The implementation loops should evolve the repository toward this structure.

```text
quantum-gates-lab/
  app/
    layout.tsx
    page.tsx
    learn/
      page.tsx
      [moduleSlug]/
        page.tsx
        [lessonSlug]/
          page.tsx
    lab/
      circuit-builder/
        page.tsx
      algorithms/
        page.tsx
        [algorithmSlug]/
          page.tsx
    reference/
      gates/
        page.tsx
      concepts/
        page.tsx
  content/
    lessons/
      01-qubits/
      02-superposition/
      03-bloch-sphere/
      04-single-qubit-gates/
      05-multi-qubit-systems/
      06-entanglement/
      07-circuits/
      08-programming/
      09-algorithms/
      10-classical-vs-quantum/
    exercises/
    quizzes/
    algorithms/
  src/
    components/
      app-shell/
      circuit/
      exercises/
      lesson/
      ui/
      visualizations/
    lib/
      content/
      quantum/
        complex.ts
        state-vector.ts
        gates.ts
        apply-gate.ts
        measure.ts
        circuit.ts
        algorithms.ts
        dsl.ts
      progress/
      storage/
    stores/
      circuit-store.ts
      course-progress-store.ts
    styles/
      tokens.css
  tests/
    quantum/
    components/
    e2e/
  docs/
  specs/
  .codex/
    loops/
  package.json
  tsconfig.json
  next.config.ts
  playwright.config.ts
  vitest.config.ts
```

## Content Conventions

Lesson MDX files should use frontmatter:

```yaml
---
title: "Qubits And Basis States"
module: "01-qubits"
order: 1
level: "intro"
objectives:
  - "Represent a qubit as a two-element state vector."
  - "Explain how measurement probabilities are derived."
interactives:
  - "one-qubit-state-explorer"
checkpoints:
  - "qubits-01"
---
```

## Component Naming

- React components use PascalCase.
- Simulator utilities use lower-case filenames.
- Content slugs use lower-case kebab case.
- Tests mirror source paths where practical.

## Simulator Constraints

- MVP supports up to 4 qubits in UI.
- Advanced release may support 6 qubits.
- All operations should fail with helpful errors if qubit indices are invalid.
- Floating-point comparisons should use explicit tolerances.
