# Codex Implementation Loops

Run these loops sequentially. Each loop should start by reading `README.md`, `docs/product-spec.md`, `docs/architecture.md`, and `specs/file-structure.md`. Each loop should end with verification commands and a concise summary of changed files.

## Loop 1: Repository Scaffold And Tooling Setup

### Goal

Create the working Next.js, React, and TypeScript application scaffold with reliable local tooling.

### Files To Create Or Modify

- `package.json`
- `package-lock.json` or chosen lockfile
- `app/layout.tsx`
- `app/page.tsx`
- `src/styles/tokens.css`
- `tsconfig.json`
- `next.config.ts`
- `eslint.config.mjs`
- `vitest.config.ts`
- `playwright.config.ts`
- `.github/workflows/ci.yml`

### Expected Output

- A working app shell that starts locally.
- Scripts for `dev`, `build`, `lint`, `typecheck`, `test`, and `test:e2e`.
- CI workflow that runs typecheck, lint, and unit tests.

### Verification Steps

- Run `npm install`.
- Run `npm run typecheck`.
- Run `npm run lint`.
- Run `npm run test`.
- Run `npm run build`.

### Completion Criteria

- The home page renders.
- All verification commands pass.
- Tooling choices are documented in the README.

## Loop 2: Core Design System And App Shell

### Goal

Build the primary navigation, layout, and reusable UI primitives.

### Files To Create Or Modify

- `src/components/app-shell/*`
- `src/components/ui/*`
- `src/styles/tokens.css`
- `app/layout.tsx`
- `app/page.tsx`
- `app/learn/page.tsx`
- `app/lab/circuit-builder/page.tsx`
- `app/reference/gates/page.tsx`

### Expected Output

- Dashboard with course, lab, and reference entry points.
- Responsive navigation.
- Button, icon button, tab, panel, tooltip, callout, and progress components.

### Verification Steps

- Run typecheck and lint.
- Use Playwright to confirm dashboard navigation works.
- Test keyboard focus order through the main nav.

### Completion Criteria

- App has a coherent shell on desktop and tablet widths.
- UI primitives are accessible and reusable.

## Loop 3: Lesson Content Framework

### Goal

Implement structured lesson loading and rendering.

### Files To Create Or Modify

- `content/lessons/**`
- `content/quizzes/**`
- `src/lib/content/*`
- `src/components/lesson/*`
- `app/learn/[moduleSlug]/[lessonSlug]/page.tsx`

### Expected Output

- MDX or structured lesson content renders by route.
- Lesson metadata is validated.
- Lesson pages support objectives, callouts, checkpoints, and embedded interactive slots.

### Verification Steps

- Run typecheck.
- Add tests for content parsing.
- Navigate to at least two lessons.

### Completion Criteria

- First two modules render as lesson pages.
- Invalid lesson metadata fails in a clear way.

## Loop 4: Quantum State And Gate Simulator Engine

### Goal

Build the pure TypeScript quantum simulator.

### Files To Create Or Modify

- `src/lib/quantum/complex.ts`
- `src/lib/quantum/state-vector.ts`
- `src/lib/quantum/gates.ts`
- `src/lib/quantum/apply-gate.ts`
- `src/lib/quantum/measure.ts`
- `src/lib/quantum/circuit.ts`
- `tests/quantum/*`

### Expected Output

- Simulator supports X, Y, Z, H, S, T, CNOT, CZ, SWAP, and Toffoli.
- Circuits can be executed step by step.
- Measurement probabilities are derived from amplitudes.

### Verification Steps

- Run unit tests for all gates.
- Test Bell state creation.
- Test measurement probability normalization.

### Completion Criteria

- Simulator tests pass with meaningful coverage.
- Simulator has no React dependency.

## Loop 5: Circuit Diagram Renderer

### Goal

Render circuit data as accessible SVG diagrams.

### Files To Create Or Modify

- `src/components/circuit/CircuitDiagram.tsx`
- `src/components/circuit/gate-symbols.tsx`
- `src/components/circuit/circuit-layout.ts`
- `tests/components/circuit-diagram.test.tsx`

### Expected Output

- Circuit diagrams show wires, gates, controls, swaps, measurements, and current step.
- Diagrams include accessible text summaries.

### Verification Steps

- Render examples for single-qubit and Bell circuits.
- Run component tests.
- Run visual smoke test if available.

### Completion Criteria

- Circuit renderer works from the simulator circuit model.
- Renderer is independent from drag-and-drop editing.

## Loop 6: Interactive Circuit Builder

### Goal

Create the drag-and-drop and keyboard-editable circuit builder.

### Files To Create Or Modify

- `src/components/circuit/CircuitBuilder.tsx`
- `src/components/circuit/GatePalette.tsx`
- `src/components/circuit/CircuitGrid.tsx`
- `src/stores/circuit-store.ts`
- `app/lab/circuit-builder/page.tsx`
- `tests/e2e/circuit-builder.spec.ts`

### Expected Output

- Users can add, remove, and reorder gates.
- Users can step through simulation.
- Builder exports JSON and teaching DSL.

### Verification Steps

- Build H plus CNOT circuit in browser test.
- Confirm state/probability panels update.
- Confirm keyboard path can add and delete a gate.

### Completion Criteria

- A student can create and inspect a Bell state without writing code.

## Loop 7: Bloch Sphere Visualization

### Goal

Build the one-qubit Bloch sphere visualization and lesson embed.

### Files To Create Or Modify

- `src/lib/quantum/bloch.ts`
- `src/components/visualizations/BlochSphere.tsx`
- `src/components/visualizations/BlochFallback.tsx`
- `tests/quantum/bloch.test.ts`

### Expected Output

- One-qubit states map to Bloch coordinates.
- Gate buttons update the visual state.
- Reduced-motion and non-WebGL fallback is available.

### Verification Steps

- Unit-test known states.
- Browser-test gate buttons.
- Verify fallback renders.

### Completion Criteria

- The Bloch sphere can be embedded in lessons and responds to gates.

## Loop 8: Measurement And Probability Visualizer

### Goal

Implement theoretical and sampled measurement views.

### Files To Create Or Modify

- `src/components/visualizations/ProbabilityHistogram.tsx`
- `src/components/visualizations/MeasurementSampler.tsx`
- `src/lib/quantum/measure.ts`
- `tests/components/probability-histogram.test.tsx`

### Expected Output

- Probability bars render for each basis state.
- Shot sampling updates observed frequencies.
- The UI explains variance between probability and samples.

### Verification Steps

- Test probability labels and totals.
- Sample Bell state outcomes.
- Confirm reset works.

### Completion Criteria

- Students can compare theoretical and sampled outcomes for any circuit.

## Loop 9: Guided Lessons And Quizzes

### Goal

Fill the MVP curriculum with lesson content and checkpoints.

### Files To Create Or Modify

- `content/lessons/01-qubits/*`
- `content/lessons/02-superposition/*`
- `content/lessons/03-bloch-sphere/*`
- `content/lessons/04-single-qubit-gates/*`
- `content/quizzes/*`
- `src/components/lesson/Checkpoint.tsx`
- `src/stores/course-progress-store.ts`

### Expected Output

- At least four modules have usable lesson content.
- Each lesson has a checkpoint.
- Progress persists locally.

### Verification Steps

- Complete a lesson in browser.
- Confirm progress persists after reload.
- Run content validation.

### Completion Criteria

- MVP lesson flow is coherent from first lesson through single-qubit gates.

## Loop 10: Algorithm Demos

### Goal

Implement algorithm labs for Deutsch-Jozsa, Grover search, and teleportation.

### Files To Create Or Modify

- `content/algorithms/*`
- `src/lib/quantum/algorithms.ts`
- `src/components/visualizations/AlgorithmTimeline.tsx`
- `app/lab/algorithms/page.tsx`
- `app/lab/algorithms/[algorithmSlug]/page.tsx`
- `tests/quantum/algorithms.test.ts`

### Expected Output

- Each algorithm has a route, circuit, timeline, and step explanation.
- Simulator verifies expected outcomes.

### Verification Steps

- Unit-test algorithm circuits.
- Browser-test stepping through each lab.

### Completion Criteria

- Students can step through all three algorithms and inspect state changes.

## Loop 11: Accessibility And Responsive Design Pass

### Goal

Make the learning platform usable with keyboard, screen readers, reduced motion, and tablet layouts.

### Files To Create Or Modify

- UI components across `src/components`
- `src/styles/tokens.css`
- `tests/e2e/accessibility.spec.ts`

### Expected Output

- Keyboard circuit editing.
- Reduced-motion support.
- Accessible labels for diagrams.
- Responsive layouts for dashboard, lessons, and labs.

### Verification Steps

- Run Playwright keyboard tests.
- Run accessibility checks where configured.
- Manually inspect narrow and wide viewports.

### Completion Criteria

- No major workflow requires a mouse only.
- Visualizations have textual equivalents.

## Loop 12: Testing And Validation

### Goal

Harden the app with focused unit, component, and browser tests.

### Files To Create Or Modify

- `tests/quantum/*`
- `tests/components/*`
- `tests/e2e/*`
- CI workflow

### Expected Output

- Core simulator tests.
- Component tests for visualizations and checkpoints.
- E2E tests for lesson and circuit builder flows.

### Verification Steps

- Run all test scripts.
- Run production build.
- Review coverage of supported gates and main workflows.

### Completion Criteria

- CI can validate the app from a clean install.

## Loop 13: Documentation Polish

### Goal

Make the repository clear for students, instructors, and contributors.

### Files To Create Or Modify

- `README.md`
- `docs/*`
- `CONTRIBUTING.md`
- `docs/lesson-authoring.md`
- `docs/simulator-notes.md`

### Expected Output

- Setup instructions are accurate.
- Lesson authoring process is documented.
- Simulator limitations are explicit.
- Contribution guidelines exist.

### Verification Steps

- Follow setup instructions from a clean clone.
- Confirm all referenced commands exist.
- Check links.

### Completion Criteria

- A new contributor can run the app and understand where to add lessons or gates.

## Loop 14: Deployment Preparation

### Goal

Prepare the app for production deployment.

### Files To Create Or Modify

- `next.config.ts`
- Deployment configuration files as needed.
- `README.md`
- `.env.example` if needed.
- CI workflow

### Expected Output

- Production build passes.
- Deployment target is documented.
- Environment variables are listed, even if none are required.

### Verification Steps

- Run `npm run build`.
- Run any deployment preview command available for the chosen host.
- Smoke-test deployed or preview URL.

### Completion Criteria

- The app is deployable and the deployment process is documented.
