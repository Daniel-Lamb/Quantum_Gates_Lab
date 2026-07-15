# Existing Feature Enhancements

These 15 enhancements deepen the already planned product features without changing the core direction of Quantum Gates Lab.

## 1. Course Dashboard Skill Map

Add a concept graph that shows how lessons connect: qubits lead to gates, gates lead to circuits, circuits lead to algorithms. Nodes should show completion state and recommended next lesson.

## 2. Lesson Preflight Checks

Before each module, ask two or three short readiness questions. If a student misses them, route them to a refresher card instead of blocking progress.

## 3. Prediction Before Reveal Pattern

Standardize every interactive lesson around a prediction prompt. Students should commit to an expected state, probability, or circuit behavior before the simulator reveals the result.

## 4. Misconception-Aware Feedback

Attach common misconceptions to quiz answers and failed exercises. Feedback should say why the answer was tempting and what idea fixes it.

## 5. State Representation Toggle

Let students switch between Dirac notation, vector notation, decimal amplitudes, symbolic amplitudes, and probabilities. This helps students connect math dialects.

## 6. Circuit History Scrubber

Enhance step execution with a timeline scrubber that stores each intermediate state, changed amplitudes, active operation, and explanatory note.

## 7. Saved Circuit Gallery

Allow students to save circuits locally and browse examples such as Bell state, phase flip, bit flip, swap, simple oracle, and teleportation setup.

## 8. Shareable Circuit URLs

Encode small circuits in URL-safe JSON so students and instructors can share exact examples without an account system.

## 9. Simulator Error Explainers

Turn invalid operations into teaching moments. Example: "CNOT needs a different control and target qubit" or "This gate cannot be placed over an existing operation in the same column."

## 10. Visual Diff For Circuit Changes

When students edit a circuit, show what changed in the output distribution and state vector. This is especially useful for debugging phase and gate-order mistakes.

## 11. Gate Palette Learning States

The gate palette should start small and unlock gates by module. Locked gates can still be visible with short explanations and lesson links.

## 12. Accessibility-First Diagram Summaries

Every diagram should produce a concise text summary. For circuits, summarize qubit count, gate sequence, controlled operations, and final probability distribution.

## 13. Lesson Authoring Preview

Add a local authoring page that renders lesson MDX, validates metadata, lists embedded interactives, and flags missing checkpoints.

## 14. Performance Budget Panel

Teach state-vector growth by showing how vector length doubles with each qubit. The circuit builder can display "4 qubits = 16 amplitudes" and warn before unsupported sizes.

## 15. Review Mode

Add a spaced review surface that pulls completed lesson concepts, missed quiz items, and saved challenge mistakes into short practice sessions.

## Incorporation Plan

### MVP

- Prediction before reveal pattern.
- Misconception-aware feedback.
- State representation toggle.
- Circuit history scrubber.
- Accessibility-first diagram summaries.

### Version 1

- Course dashboard skill map.
- Lesson preflight checks.
- Simulator error explainers.
- Visual diff for circuit changes.
- Gate palette learning states.

### Advanced

- Saved circuit gallery.
- Shareable circuit URLs.
- Lesson authoring preview.
- Performance budget panel.
- Review mode.

## Architecture Additions

Add these supporting modules as the app grows:

```text
src/lib/learning/
  concept-map.ts
  misconceptions.ts
  readiness.ts
  review-scheduler.ts

src/lib/circuits/
  circuit-codec.ts
  circuit-diff.ts
  examples.ts

src/components/learning/
  SkillMap.tsx
  PredictionPrompt.tsx
  MisconceptionFeedback.tsx
  ReviewMode.tsx

src/components/circuit/
  CircuitHistoryScrubber.tsx
  CircuitDiffPanel.tsx
  SavedCircuitGallery.tsx
```

## Verification Additions

- Test that representation toggles preserve the same underlying state.
- Test that shareable URLs round-trip circuits.
- Test that circuit diffs identify changed gates and changed probabilities.
- Test that diagram summaries match the rendered circuit data.
- Browser-test a review session from missed quiz data.
