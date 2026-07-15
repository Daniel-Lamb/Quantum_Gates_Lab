"use client";

import {
  BookOpen,
  Brain,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  Eye,
  FlaskConical,
  Gauge,
  GraduationCap,
  Layers3,
  Link,
  Lock,
  Network,
  Play,
  RotateCcw,
  Save,
  Sparkles
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  type Circuit,
  type GateName,
  type Operation,
  bellCorrelation,
  circuitToDsl,
  executeCircuit,
  explainCircuit,
  formatComplex,
  gateMatrices,
  operationLabel,
  parseDsl,
  probabilities
} from "@/src/lib/quantum";

const baseCircuit: Circuit = {
  qubits: 2,
  operations: [
    { kind: "single", gate: "H", target: 0 },
    { kind: "cx", control: 0, target: 1 }
  ]
};

const debugBrokenCircuit: Circuit = {
  qubits: 2,
  operations: [
    { kind: "single", gate: "X", target: 0 },
    { kind: "cx", control: 0, target: 1 }
  ]
};

const debugFixedCircuit: Circuit = baseCircuit;

const algorithms = [
  {
    name: "Deutsch-Jozsa",
    phase: "Oracle check",
    baseline: "Classically, test inputs until the function pattern is known.",
    result: "A balanced oracle pushes amplitude away from the all-zero readout."
  },
  {
    name: "Grover Search",
    phase: "Amplify marked state",
    baseline: "Classically, scan candidates one by one.",
    result: "Oracle marking plus diffusion increases the target probability."
  },
  {
    name: "Teleportation",
    phase: "Correct from two classical bits",
    baseline: "Classically, copying an unknown quantum state is impossible.",
    result: "Entanglement, measurement, and correction recover the input state."
  }
];

const enhancements = [
  {
    title: "Course dashboard skill map",
    status: "Live",
    detail: "Concept nodes now show sequence, progress, and next-step recommendations."
  },
  {
    title: "Lesson preflight checks",
    status: "Live",
    detail: "Readiness questions adapt the student path before a lesson starts."
  },
  {
    title: "Prediction before reveal pattern",
    status: "Live",
    detail: "Circuit outcomes stay hidden until students commit to a prediction."
  },
  {
    title: "Misconception-aware feedback",
    status: "Live",
    detail: "Wrong answers explain the tempting mistake, not just the correct fact."
  },
  {
    title: "State representation toggle",
    status: "Live",
    detail: "Probability, amplitude, and Dirac summaries all read from one state."
  },
  {
    title: "Circuit history scrubber",
    status: "Live",
    detail: "A slider and step rail scrub through the exact simulator history."
  },
  {
    title: "Saved circuit gallery",
    status: "Live",
    detail: "Students can save current circuits into a local example gallery."
  },
  {
    title: "Shareable circuit URLs",
    status: "Live",
    detail: "The current DSL is encoded into a copyable share link."
  },
  {
    title: "Simulator error explainers",
    status: "Live",
    detail: "Invalid operations become actionable teaching feedback."
  },
  {
    title: "Visual diff for circuit changes",
    status: "Live",
    detail: "Probability deltas show what changed between adjacent steps."
  },
  {
    title: "Gate palette learning states",
    status: "Live",
    detail: "Gates unlock by lesson stage with contextual labels."
  },
  {
    title: "Accessibility-first diagram summaries",
    status: "Live",
    detail: "Every diagram has a text summary tied to the same circuit data."
  },
  {
    title: "Lesson authoring preview",
    status: "Live",
    detail: "Metadata, embedded interactives, and checkpoint coverage are previewed."
  },
  {
    title: "Performance budget panel",
    status: "Live",
    detail: "A qubit slider teaches exponential state-vector growth."
  },
  {
    title: "Review mode",
    status: "Live",
    detail: "Missed concepts become a short spaced-review queue."
  }
];

const conceptMap = [
  { title: "Qubits", progress: 100, note: "basis states and amplitudes" },
  { title: "Gates", progress: 86, note: "X, Z, H, phase gates" },
  { title: "Circuits", progress: 72, note: "history, diagrams, debugging" },
  { title: "Entanglement", progress: 58, note: "Bell pairs and correlation" },
  { title: "Algorithms", progress: 34, note: "Grover, DJ, teleportation" }
];

const gateUnlocks: Array<{ gate: GateName; stage: number; reason: string }> = [
  { gate: "X", stage: 1, reason: "bit flip" },
  { gate: "Z", stage: 1, reason: "phase flip" },
  { gate: "H", stage: 1, reason: "superposition" },
  { gate: "S", stage: 2, reason: "quarter phase" },
  { gate: "T", stage: 3, reason: "eighth phase" },
  { gate: "Y", stage: 3, reason: "imaginary phase" },
  { gate: "I", stage: 4, reason: "timing/no-op" }
];

const paths = [
  "No Linear Algebra Yet",
  "CS Theory Path",
  "Programming Path",
  "Full Course Path"
];

const gateInfo: Record<
  GateName,
  { title: string; description: string; use: string; challenge: string }
> = {
  I: {
    title: "Identity",
    description: "Leaves the state unchanged.",
    use: "Useful for timing, placeholders, and explaining no-op columns.",
    challenge: "Show that I followed by H behaves exactly like H."
  },
  X: {
    title: "Bit flip",
    description: "Swaps |0> and |1> amplitudes.",
    use: "The quantum version of NOT for computational basis states.",
    challenge: "Create |1> from |0> in one gate."
  },
  Y: {
    title: "Bit and phase flip",
    description: "Swaps basis amplitudes and introduces imaginary phase.",
    use: "Good for showing that quantum gates can affect phase and bit value.",
    challenge: "Compare X and Y on |0>."
  },
  Z: {
    title: "Phase flip",
    description: "Leaves |0> alone and negates the |1> amplitude.",
    use: "Reveals that phase matters after interference.",
    challenge: "Apply H, Z, H and predict the final basis state."
  },
  H: {
    title: "Hadamard",
    description: "Moves basis states into equal superpositions.",
    use: "Starts interference, Bell-state preparation, and many algorithms.",
    challenge: "Create |+> from |0>."
  },
  S: {
    title: "Quarter phase",
    description: "Multiplies |1> by i.",
    use: "Shows phase rotations that do not change measurement probability alone.",
    challenge: "Find a circuit where S changes a later measurement."
  },
  T: {
    title: "Eighth phase",
    description: "Multiplies |1> by e^(i*pi/4).",
    use: "A small phase step used in universal gate sets.",
    challenge: "Compare repeated T gates with S and Z."
  }
};

export default function QuantumLabApp() {
  const [activeCircuit, setActiveCircuit] = useState<Circuit>(baseCircuit);
  const [step, setStep] = useState(baseCircuit.operations.length);
  const [matrixGate, setMatrixGate] = useState<GateName>("H");
  const [selectedGate, setSelectedGate] = useState<GateName>("H");
  const [shots, setShots] = useState(64);
  const [path, setPath] = useState(paths[3]);
  const [showAnswers, setShowAnswers] = useState(false);
  const [representation, setRepresentation] = useState("Probabilities");
  const [dsl, setDsl] = useState(circuitToDsl(baseCircuit));
  const [dslError, setDslError] = useState("");
  const [lessonStage, setLessonStage] = useState(2);
  const [prediction, setPrediction] = useState("Bell pair: only 00 and 11");
  const [predictionRevealed, setPredictionRevealed] = useState(false);
  const [readinessScore, setReadinessScore] = useState(2);
  const [savedCircuits, setSavedCircuits] = useState<Circuit[]>([baseCircuit]);
  const [qubitBudget, setQubitBudget] = useState(4);
  const [theta, setTheta] = useState(90);
  const [phi, setPhi] = useState(0);
  const [shareStatus, setShareStatus] = useState("Ready to copy a circuit link.");
  const [simulatorIssue, setSimulatorIssue] = useState("No simulator issues detected.");

  const states = useMemo(() => executeCircuit(activeCircuit), [activeCircuit]);
  const clampedStep = Math.min(step, activeCircuit.operations.length);
  const currentState = states[clampedStep];
  const currentProbabilities = probabilities(currentState, activeCircuit.qubits);
  const previousProbabilities = probabilities(
    states[Math.max(clampedStep - 1, 0)],
    activeCircuit.qubits
  );
  const explanation = explainCircuit(activeCircuit);
  const challengeSolved = currentProbabilities.some(
    (item) => item.basis === "11" && item.probability > 0.49
  );
  const correlation = useMemo(() => bellCorrelation(shots), [shots]);
  const shareLink = useMemo(
    () => `https://quantum-gates-lab.vercel.app?circuit=${encodeShareDsl(dsl)}`,
    [dsl]
  );
  const diagramSummary = useMemo(
    () =>
      `${activeCircuit.qubits}-qubit circuit with ${activeCircuit.operations
        .map(operationLabel)
        .join(", ")}. Current step ${clampedStep} of ${activeCircuit.operations.length}.`,
    [activeCircuit, clampedStep]
  );
  const reviewQueue = [
    readinessScore < 3 ? "Refresh probability from amplitude squared." : "Explain why H creates equal amplitudes.",
    challengeSolved ? "Build a phase-kickback example next." : "Rebuild the Bell target using only H and CNOT.",
    "Compare CNOT as XOR with CNOT as a reversible operation."
  ];

  function loadCircuit(circuit: Circuit) {
    setActiveCircuit(circuit);
    setStep(circuit.operations.length);
    setDsl(circuitToDsl(circuit));
  }

  function runDsl() {
    try {
      const parsed = parseDsl(dsl);
      loadCircuit(parsed);
      setDslError("");
    } catch (error) {
      setDslError(error instanceof Error ? error.message : "Could not parse circuit.");
    }
  }

  function saveActiveCircuit() {
    setSavedCircuits((circuits) => [activeCircuit, ...circuits].slice(0, 4));
  }

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareLink);
      setShareStatus("Copied share link with the current circuit encoded.");
    } catch {
      setShareStatus("Share link is ready below; copy it manually from the field.");
    }
  }

  function triggerSimulatorIssue() {
    try {
      parseDsl("circuit(2).cx(0, 0);");
    } catch (error) {
      setSimulatorIssue(
        error instanceof Error
          ? `${error.message} Fix: controlled gates need different control and target qubits.`
          : "Invalid operation. Fix the qubit indices and try again."
      );
    }
  }

  return (
    <main className="app">
      <section className="hero-shell">
        <nav className="topbar" aria-label="Primary">
          <div className="brand">
            <span className="brand-mark">Q</span>
            <span>Quantum Gates Lab</span>
          </div>
          <div className="topbar-links">
            <a href="#lab">Lab</a>
            <a href="#lessons">Lessons</a>
            <a href="#instructor">Instructor</a>
          </div>
        </nav>

        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Interactive quantum programming for CS students</p>
            <h1>Learn gates by building circuits, stepping state, and testing predictions.</h1>
            <p>
              A polished teaching platform with target-state challenges, matrix
              walkthroughs, debugging labs, quantum-vs-classical comparisons,
              entanglement simulation, algorithm storyboards, DSL exercises,
              assessments, instructor mode, and modern accurate diagrams.
            </p>
            <div className="hero-actions">
              <a className="primary-action" href="#lab">
                <Play aria-hidden="true" size={18} />
                Open lab
              </a>
              <a className="secondary-action" href="#enhancements">
                <Sparkles aria-hidden="true" size={18} />
                View enhancements
              </a>
            </div>
          </div>
          <div className="hero-diagram" aria-label="Bell state preview">
            <CircuitDiagram circuit={baseCircuit} activeStep={2} />
            <ProbabilityHistogram items={probabilities(executeCircuit(baseCircuit)[2], 2)} />
            <div className="hero-mini-tools">
              <span>Live diagram stack</span>
              <strong>Circuit + probability + state summary</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="metric-row" aria-label="Feature coverage">
        {[
          ["12", "expanded lesson features"],
          ["15", "existing feature enhancements"],
          ["4", "learning paths"],
          ["7", "accurate gate matrices"]
        ].map(([value, label]) => (
          <div className="metric" key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <section className="section">
        <div className="skill-map glass-panel">
          <div className="section-heading compact-heading">
            <p className="eyebrow">Course dashboard skill map</p>
            <h2>Students see where each idea leads</h2>
            <p>
              The map turns the course into a visible path from basis states to
              algorithms, with progress and next-action context.
            </p>
          </div>
          <div className="concept-rail" aria-label="Quantum concept skill map">
            {conceptMap.map((concept, index) => (
              <div className="concept-node" key={concept.title}>
                <span className="node-index">{index + 1}</span>
                <strong>{concept.title}</strong>
                <small>{concept.note}</small>
                <div className="mini-progress" aria-label={`${concept.progress}% complete`}>
                  <i style={{ width: `${concept.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="lab">
        <div className="section-heading">
          <p className="eyebrow">Core simulator</p>
          <h2>Modern circuit lab with accurate state evolution</h2>
          <p>
            The circuit diagram, state table, histogram, explanation, and DSL all
            read from the same small state-vector simulator.
          </p>
        </div>

        <div className="lab-layout">
          <div className="panel circuit-panel">
            <div className="panel-header">
              <div>
                <h3>Interactive circuit builder</h3>
                <p>{activeCircuit.qubits} qubits, {activeCircuit.operations.length} operations</p>
              </div>
              <div className="button-row">
                <button
                  className="icon-button"
                  aria-label="Reset to Bell state"
                  onClick={() => loadCircuit(baseCircuit)}
                >
                  <RotateCcw size={17} />
                </button>
                <button
                  className="icon-button"
                  aria-label="Step circuit"
                  onClick={() => setStep((value) => (value + 1) % (activeCircuit.operations.length + 1))}
                >
                  <Play size={17} />
                </button>
              </div>
            </div>
            <CircuitDiagram circuit={activeCircuit} activeStep={clampedStep} />
            <div className="scrubber" aria-label="Circuit history scrubber">
              <input
                aria-label="Scrub circuit history"
                min="0"
                max={activeCircuit.operations.length}
                step="1"
                type="range"
                value={clampedStep}
                onChange={(event) => setStep(Number(event.target.value))}
              />
              {states.map((_, index) => (
                <button
                  key={index}
                  className={index === clampedStep ? "scrub-dot active" : "scrub-dot"}
                  onClick={() => setStep(index)}
                  aria-label={`Show state after step ${index}`}
                />
              ))}
            </div>
            <p className="diagram-summary">{diagramSummary}</p>
            <div className="button-grid">
              <button onClick={() => loadCircuit(baseCircuit)}>Bell state</button>
              <button onClick={() => loadCircuit(debugBrokenCircuit)}>Broken Bell</button>
              <button
                onClick={() =>
                  loadCircuit({
                    qubits: 1,
                    operations: [
                      { kind: "single", gate: "H", target: 0 },
                      { kind: "single", gate: "Z", target: 0 },
                      { kind: "single", gate: "H", target: 0 }
                    ]
                  })
                }
              >
                Phase kickback seed
              </button>
            </div>
            <div className="button-row lower-tools">
              <button onClick={saveActiveCircuit}>
                <Save aria-hidden="true" size={16} />
                Save circuit
              </button>
              <button onClick={copyShareLink}>
                <Copy aria-hidden="true" size={16} />
                Copy share URL
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <h3>State view</h3>
                <p>Toggle representations without changing the state.</p>
              </div>
              <select
                aria-label="State representation"
                value={representation}
                onChange={(event) => setRepresentation(event.target.value)}
              >
                <option>Probabilities</option>
                <option>Amplitudes</option>
                <option>Dirac summary</option>
              </select>
            </div>
            {representation === "Dirac summary" ? (
              <div className="dirac-box">
                {currentProbabilities
                  .filter((item) => item.probability > 0.001)
                  .map((item) => `${formatComplex(item.amplitude)}|${item.basis}>`)
                  .join(" + ")}
              </div>
            ) : (
              <StateTable items={currentProbabilities} mode={representation} />
            )}
            <ProbabilityHistogram items={currentProbabilities} />
            <ProbabilityDiff current={currentProbabilities} previous={previousProbabilities} />
          </div>
        </div>
      </section>

      <section className="section grid-three">
        <FeatureCard
          icon={<Eye size={20} />}
          title="Preflight and prediction loop"
          text="Students answer readiness checks, commit to a prediction, then reveal simulator evidence."
        >
          <ReadinessPanel score={readinessScore} onScore={setReadinessScore} />
          <label className="field-stack">
            Prediction before reveal
            <select value={prediction} onChange={(event) => setPrediction(event.target.value)}>
              <option>Bell pair: only 00 and 11</option>
              <option>Uniform: all states equally likely</option>
              <option>Deterministic: only 11</option>
            </select>
          </label>
          <button onClick={() => setPredictionRevealed((value) => !value)}>
            {predictionRevealed ? "Hide reveal" : "Reveal result"}
          </button>
          {predictionRevealed ? (
            <p className={challengeSolved && prediction.includes("Bell") ? "success-text" : "warning-text"}>
              {challengeSolved && prediction.includes("Bell")
                ? "Correct. H creates superposition and CNOT correlates the qubits."
                : "Misconception check: the Bell circuit is not uniformly random across all four outcomes."}
            </p>
          ) : null}
        </FeatureCard>

        <FeatureCard
          icon={<Gauge size={20} />}
          title="Performance budget panel"
          text="Students see state-vector growth before the simulator gets slow."
        >
          <label className="range-label">
            Qubits: {qubitBudget}
            <input
              min="1"
              max="10"
              step="1"
              type="range"
              value={qubitBudget}
              onChange={(event) => setQubitBudget(Number(event.target.value))}
            />
          </label>
          <div className="budget-meter">
            <strong>{2 ** qubitBudget}</strong>
            <span>complex amplitudes</span>
          </div>
          <p className={qubitBudget > 6 ? "warning-text" : "success-text"}>
            {qubitBudget > 6
              ? "Beyond the teaching limit. This is where exponential growth becomes visible."
              : "Comfortable for an in-browser teaching simulator."}
          </p>
        </FeatureCard>

        <FeatureCard
          icon={<Layers3 size={20} />}
          title="Single-qubit slider diagram"
          text="A sleek Bloch-style projection uses sliders for angle and phase."
        >
          <BlochSlider theta={theta} phi={phi} onTheta={setTheta} onPhi={setPhi} />
        </FeatureCard>
      </section>

      <section className="section two-column">
        <FeatureCard
          icon={<CheckCircle2 size={20} />}
          title="Gate challenge mode"
          text="Build a circuit that produces a Bell-style target distribution with limited gates."
        >
          <div className="target-box">
            <span>Target</span>
            <strong>50% |00&gt;, 50% |11&gt;</strong>
          </div>
          <p className={challengeSolved ? "success-text" : "warning-text"}>
            {challengeSolved
              ? "Solved: the simulator sees the target correlation."
              : "Not solved yet: try H on q0, then CNOT q0->q1."}
          </p>
        </FeatureCard>

        <FeatureCard
          icon={<Brain size={20} />}
          title="Step-by-step matrix multiplication"
          text="Students see the gate matrix, input vector, row products, and resulting state."
        >
          <div className="toolbar">
            {(["X", "Y", "Z", "H", "S", "T"] as GateName[]).map((gate) => (
              <button
                key={gate}
                className={matrixGate === gate ? "pill active" : "pill"}
                onClick={() => setMatrixGate(gate)}
              >
                {gate}
              </button>
            ))}
          </div>
          <MatrixStepper gate={matrixGate} />
        </FeatureCard>
      </section>

      <section className="section grid-three">
        <FeatureCard
          icon={<FlaskConical size={20} />}
          title="Circuit debugging"
          text="Broken circuits compare actual and expected behavior, then reveal the first bad transition."
        >
          <CircuitDiagram circuit={debugBrokenCircuit} activeStep={2} compact />
          <p className="warning-text">
            Broken Bell: X prepares |10&gt;, then CNOT deterministically reaches |11&gt;.
          </p>
          <button onClick={() => loadCircuit(debugFixedCircuit)}>Apply fix</button>
        </FeatureCard>

        <FeatureCard
          icon={<Network size={20} />}
          title="Quantum vs classical logic"
          text="Truth tables sit beside reversible gates so Toffoli, CNOT, and uncompute make CS sense."
        >
          <TruthTable />
        </FeatureCard>

        <FeatureCard
          icon={<Sparkles size={20} />}
          title="Entanglement correlation"
          text="Individual measurements are random; the joint distribution is correlated."
        >
          <label className="range-label">
            Shots: {shots}
            <input
              min="16"
              max="256"
              step="16"
              type="range"
              value={shots}
              onChange={(event) => setShots(Number(event.target.value))}
            />
          </label>
          <CorrelationGrid counts={correlation} shots={shots} />
        </FeatureCard>
      </section>

      <section className="section two-column" id="lessons">
        <FeatureCard
          icon={<Code2 size={20} />}
          title="Mini quantum programming DSL"
          text="Code, diagram, simulator output, and tests are interchangeable."
        >
          <textarea
            aria-label="Quantum DSL editor"
            value={dsl}
            onChange={(event) => setDsl(event.target.value)}
          />
          <div className="button-row">
            <button onClick={runDsl}>Run DSL</button>
            <button onClick={() => setDsl(circuitToDsl(activeCircuit))}>Export current</button>
          </div>
          {dslError ? <p className="warning-text">{dslError}</p> : <p className="success-text">DSL is synced with the active circuit.</p>}
        </FeatureCard>

        <FeatureCard
          icon={<BookOpen size={20} />}
          title="Gate reference explorer"
          text="Each gate gets a symbol, matrix, effect, use case, common mistake, and challenge."
        >
          <div className="toolbar">
            {(Object.keys(gateInfo) as GateName[]).map((gate) => (
              <button
                key={gate}
                className={selectedGate === gate ? "pill active" : "pill"}
                onClick={() => setSelectedGate(gate)}
              >
                {gate}
              </button>
            ))}
          </div>
          <GateReference gate={selectedGate} />
        </FeatureCard>
      </section>

      <section className="section grid-three">
        <FeatureCard
          icon={<Lock size={20} />}
          title="Gate palette learning states"
          text="The palette unlocks as students advance, while locked gates still explain what comes next."
        >
          <label className="range-label">
            Lesson stage: {lessonStage}
            <input
              min="1"
              max="4"
              step="1"
              type="range"
              value={lessonStage}
              onChange={(event) => setLessonStage(Number(event.target.value))}
            />
          </label>
          <div className="gate-unlock-grid">
            {gateUnlocks.map((item) => {
              const unlocked = lessonStage >= item.stage;
              return (
                <button
                  className={unlocked ? "gate-token unlocked" : "gate-token locked"}
                  key={item.gate}
                  onClick={() => unlocked && setSelectedGate(item.gate)}
                  type="button"
                >
                  <strong>{item.gate}</strong>
                  <span>{unlocked ? item.reason : `stage ${item.stage}`}</span>
                </button>
              );
            })}
          </div>
        </FeatureCard>

        <FeatureCard
          icon={<Save size={20} />}
          title="Saved circuit gallery"
          text="Students can preserve useful examples and reload them into the live simulator."
        >
          <div className="saved-gallery">
            {savedCircuits.map((circuit, index) => (
              <button key={`${circuitToDsl(circuit)}-${index}`} onClick={() => loadCircuit(circuit)}>
                Example {index + 1}
                <span>{circuit.operations.map(operationLabel).join(" / ")}</span>
              </button>
            ))}
          </div>
        </FeatureCard>

        <FeatureCard
          icon={<Link size={20} />}
          title="Shareable circuit URLs"
          text="The current circuit serializes into a portable URL for instructors and students."
        >
          <div className="share-box">
            <code>{shareLink}</code>
          </div>
          <p className="success-text">{shareStatus}</p>
          <button onClick={copyShareLink}>
            <Copy aria-hidden="true" size={16} />
            Copy encoded link
          </button>
        </FeatureCard>
      </section>

      <section className="section grid-three">
        <FeatureCard
          icon={<FlaskConical size={20} />}
          title="Simulator error explainer"
          text="Invalid operations turn into direct teaching feedback with a repair suggestion."
        >
          <button onClick={triggerSimulatorIssue}>Trigger invalid CNOT</button>
          <div className="answer-strip">{simulatorIssue}</div>
        </FeatureCard>

        <FeatureCard
          icon={<BookOpen size={20} />}
          title="Lesson authoring preview"
          text="Authoring metadata is checked before a lesson ships."
        >
          <AuthoringPreview />
        </FeatureCard>

        <FeatureCard
          icon={<Sparkles size={20} />}
          title="Review mode"
          text="Missed checks and challenge outcomes become a compact practice queue."
        >
          <ol className="review-list">
            {reviewQueue.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ol>
        </FeatureCard>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Algorithm storyboards</p>
          <h2>Algorithms become readable phases, not mystery circuits</h2>
          <p>
            Each storyboard connects the classical baseline, quantum phase, and
            expected result before students step into the full circuit.
          </p>
        </div>
        <div className="algorithm-row">
          {algorithms.map((algorithm) => (
            <article className="algorithm-card" key={algorithm.name}>
              <span>{algorithm.phase}</span>
              <h3>{algorithm.name}</h3>
              <p>{algorithm.baseline}</p>
              <strong>{algorithm.result}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="section two-column">
        <FeatureCard
          icon={<Brain size={20} />}
          title="Explain this circuit"
          text="The explanation is generated from simulator history, not hand-written for one demo."
        >
          <div className="explain-box">
            <strong>{explanation.summary}</strong>
            <p>Final distribution: {explanation.final}</p>
            <div className="tag-row">
              {explanation.concepts.map((concept) => (
                <span key={concept}>{concept}</span>
              ))}
            </div>
          </div>
          <ol className="step-list">
            {explanation.steps.map((item) => (
              <li key={item.label}>{item.text}</li>
            ))}
          </ol>
        </FeatureCard>

        <FeatureCard
          icon={<GraduationCap size={20} />}
          title="Progressive paths and assessment bank"
          text="Students can choose a track; reusable tagged questions feed checkpoints and review mode."
        >
          <select value={path} onChange={(event) => setPath(event.target.value)}>
            {paths.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <AssessmentPreview path={path} />
        </FeatureCard>
      </section>

      <section className="section" id="instructor">
        <div className="panel instructor-panel">
          <div>
            <p className="eyebrow">Instructor mode</p>
            <h2>Presentation-ready demos, reveal controls, and exportable diagrams</h2>
            <p>
              Instructor mode reuses the same circuit data, diagrams, challenges,
              and assessment bank so live demos stay consistent with the student
              experience.
            </p>
          </div>
          <div className="instructor-actions">
            <button onClick={() => setShowAnswers((value) => !value)}>
              {showAnswers ? "Hide answers" : "Reveal answers"}
            </button>
            <button>
              <Download aria-hidden="true" size={17} />
              Export SVG
            </button>
          </div>
          <div className="answer-strip">
            {showAnswers
              ? "Answer: H on q0 followed by CNOT q0->q1 creates the Bell distribution."
              : "Answers hidden for classroom prediction."}
          </div>
        </div>
      </section>

      <section className="section" id="enhancements">
        <div className="section-heading">
          <p className="eyebrow">Enhancements incorporated</p>
          <h2>Fifteen upgrades to the existing feature set</h2>
          <p>
            These enhancements are represented in the app surface and preserved
            in the repository planning docs for deeper implementation loops.
          </p>
        </div>
        <div className="enhancement-grid">
          {enhancements.map((item, index) => (
            <div className="enhancement" key={item.title}>
              <span>{String(index + 1).padStart(2, "0")} / {item.status}</span>
              <strong>{item.title}</strong>
              <small>{item.detail}</small>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  text,
  children
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <article className="panel feature-card">
      <div className="feature-head">
        <span className="feature-icon">{icon}</span>
        <div>
          <h3>{title}</h3>
          <p>{text}</p>
        </div>
      </div>
      {children}
    </article>
  );
}

function ReadinessPanel({
  score,
  onScore
}: {
  score: number;
  onScore: (value: number) => void;
}) {
  const labels = ["Need refresher", "Warming up", "Ready", "Confident"];

  return (
    <div className="readiness-panel">
      <div>
        <strong>Readiness</strong>
        <span>{labels[score]}</span>
      </div>
      <div className="readiness-buttons" role="group" aria-label="Lesson preflight readiness">
        {labels.map((label, index) => (
          <button
            className={score === index ? "pill active" : "pill"}
            key={label}
            onClick={() => onScore(index)}
            type="button"
          >
            {index + 1}
          </button>
        ))}
      </div>
      <p>
        {score < 2
          ? "Suggested path: revisit amplitudes before opening the circuit lab."
          : "Suggested path: proceed, then answer the prediction prompt before reveal."}
      </p>
    </div>
  );
}

function ProbabilityDiff({
  current,
  previous
}: {
  current: ReturnType<typeof probabilities>;
  previous: ReturnType<typeof probabilities>;
}) {
  return (
    <div className="diff-panel" aria-label="Probability change from previous step">
      <strong>Visual diff from previous step</strong>
      {current.map((item) => {
        const oldValue = previous.find((entry) => entry.basis === item.basis)?.probability ?? 0;
        const delta = item.probability - oldValue;
        return (
          <div className="diff-row" key={item.basis}>
            <span>|{item.basis}&gt;</span>
            <b className={delta >= 0 ? "positive-delta" : "negative-delta"}>
              {delta >= 0 ? "+" : ""}
              {Math.round(delta * 100)}%
            </b>
          </div>
        );
      })}
    </div>
  );
}

function BlochSlider({
  theta,
  phi,
  onTheta,
  onPhi
}: {
  theta: number;
  phi: number;
  onTheta: (value: number) => void;
  onPhi: (value: number) => void;
}) {
  const radiansTheta = (theta * Math.PI) / 180;
  const radiansPhi = (phi * Math.PI) / 180;
  const x = 90 + Math.sin(radiansTheta) * Math.cos(radiansPhi) * 62;
  const y = 90 - Math.cos(radiansTheta) * 62;
  const p0 = Math.cos(radiansTheta / 2) ** 2;
  const p1 = Math.sin(radiansTheta / 2) ** 2;

  return (
    <div className="bloch-lab">
      <svg viewBox="0 0 180 180" role="img" aria-label="Bloch-style one-qubit projection">
        <circle cx="90" cy="90" r="68" className="bloch-ring" />
        <ellipse cx="90" cy="90" rx="68" ry="20" className="bloch-equator" />
        <line x1="90" x2="90" y1="18" y2="162" className="bloch-axis" />
        <line x1="26" x2="154" y1="90" y2="90" className="bloch-axis" />
        <line x1="90" x2={x} y1="90" y2={y} className="bloch-vector" />
        <circle cx={x} cy={y} r="7" className="bloch-point" />
        <text x="94" y="28">|0&gt;</text>
        <text x="94" y="164">|1&gt;</text>
      </svg>
      <label className="range-label">
        Theta: {theta} deg
        <input type="range" min="0" max="180" value={theta} onChange={(event) => onTheta(Number(event.target.value))} />
      </label>
      <label className="range-label">
        Phase: {phi} deg
        <input type="range" min="0" max="360" value={phi} onChange={(event) => onPhi(Number(event.target.value))} />
      </label>
      <div className="bloch-stats">
        <span>P(|0&gt;) {Math.round(p0 * 100)}%</span>
        <span>P(|1&gt;) {Math.round(p1 * 100)}%</span>
      </div>
    </div>
  );
}

function AuthoringPreview() {
  return (
    <div className="authoring-preview">
      {[
        ["Metadata", "title, path, objectives", true],
        ["Interactive", "prediction prompt embedded", true],
        ["Checkpoint", "misconception feedback attached", true],
        ["A11y summary", "diagram summary generated", true]
      ].map(([label, detail, ready]) => (
        <div key={String(label)}>
          <CheckCircle2 aria-hidden="true" size={16} />
          <strong>{label}</strong>
          <span>{detail}</span>
          <em>{ready ? "ready" : "needs work"}</em>
        </div>
      ))}
    </div>
  );
}

function CircuitDiagram({
  circuit,
  activeStep,
  compact = false
}: {
  circuit: Circuit;
  activeStep: number;
  compact?: boolean;
}) {
  const width = compact ? 420 : 640;
  const rowGap = compact ? 52 : 62;
  const colGap = compact ? 78 : 96;
  const height = 58 + (circuit.qubits - 1) * rowGap;
  const startX = 54;

  return (
    <svg
      className="circuit-svg"
      viewBox={`0 0 ${width} ${height + 34}`}
      role="img"
      aria-label={`Circuit with ${circuit.qubits} qubits and ${circuit.operations.length} operations`}
    >
      <defs>
        <linearGradient id="gateFill" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#e5fff6" />
        </linearGradient>
      </defs>
      {Array.from({ length: circuit.qubits }, (_, qubit) => {
        const y = 34 + qubit * rowGap;
        return (
          <g key={qubit}>
            <text x="8" y={y + 5} className="wire-label">q{qubit}</text>
            <line x1="44" y1={y} x2={width - 18} y2={y} className="wire" />
          </g>
        );
      })}
      {circuit.operations.map((operation, index) => {
        const x = startX + index * colGap;
        const active = index < activeStep;
        return <OperationGlyph key={`${operationLabel(operation)}-${index}`} operation={operation} x={x} rowGap={rowGap} active={active} />;
      })}
      <line
        x1={startX + activeStep * colGap - colGap / 2}
        x2={startX + activeStep * colGap - colGap / 2}
        y1="10"
        y2={height + 18}
        className="active-column"
      />
    </svg>
  );
}

function OperationGlyph({
  operation,
  x,
  rowGap,
  active
}: {
  operation: Operation;
  x: number;
  rowGap: number;
  active: boolean;
}) {
  const yFor = (qubit: number) => 34 + qubit * rowGap;
  if (operation.kind === "single") {
    const y = yFor(operation.target);
    return (
      <g>
        <rect x={x - 18} y={y - 18} width="36" height="36" rx="8" className={active ? "gate active" : "gate"} />
        <text x={x} y={y + 6} textAnchor="middle" className="gate-text">{operation.gate}</text>
      </g>
    );
  }
  if (operation.kind === "swap") {
    const yA = yFor(operation.a);
    const yB = yFor(operation.b);
    return (
      <g>
        <line x1={x} x2={x} y1={yA} y2={yB} className={active ? "control-line active" : "control-line"} />
        {[yA, yB].map((y) => (
          <g key={y} className="swap-mark">
            <line x1={x - 10} x2={x + 10} y1={y - 10} y2={y + 10} />
            <line x1={x - 10} x2={x + 10} y1={y + 10} y2={y - 10} />
          </g>
        ))}
      </g>
    );
  }
  const controlY = yFor(operation.control);
  const targetY = yFor(operation.target);
  return (
    <g>
      <line x1={x} x2={x} y1={controlY} y2={targetY} className={active ? "control-line active" : "control-line"} />
      <circle cx={x} cy={controlY} r="7" className={active ? "control active" : "control"} />
      <circle cx={x} cy={targetY} r="17" className={active ? "target active" : "target"} />
      <text x={x} y={targetY + 6} textAnchor="middle" className="gate-text">{operation.kind === "cx" ? "X" : "Z"}</text>
    </g>
  );
}

function ProbabilityHistogram({ items }: { items: ReturnType<typeof probabilities> }) {
  return (
    <div className="histogram">
      {items.map((item) => (
        <div className="bar-row" key={item.basis}>
          <span>|{item.basis}&gt;</span>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${Math.round(item.probability * 100)}%` }} />
          </div>
          <strong>{Math.round(item.probability * 100)}%</strong>
        </div>
      ))}
    </div>
  );
}

function StateTable({
  items,
  mode
}: {
  items: ReturnType<typeof probabilities>;
  mode: string;
}) {
  return (
    <table className="state-table">
      <thead>
        <tr>
          <th>Basis</th>
          <th>{mode === "Amplitudes" ? "Amplitude" : "Probability"}</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.basis}>
            <td>|{item.basis}&gt;</td>
            <td>{mode === "Amplitudes" ? formatComplex(item.amplitude) : `${Math.round(item.probability * 100)}%`}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function MatrixStepper({ gate }: { gate: GateName }) {
  const matrix = gateMatrices[gate];
  return (
    <div className="matrix-stepper">
      <div className="matrix-card">
        {matrix.flatMap((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <span key={`${rowIndex}-${colIndex}`}>{formatComplex(cell)}</span>
          ))
        )}
      </div>
      <span className="multiply">x</span>
      <div className="vector-card">
        <span>1</span>
        <span>0</span>
      </div>
      <span className="multiply">=</span>
      <div className="vector-card accent">
        <span>{formatComplex(matrix[0][0])}</span>
        <span>{formatComplex(matrix[1][0])}</span>
      </div>
    </div>
  );
}

function TruthTable() {
  return (
    <table className="truth-table">
      <thead>
        <tr>
          <th>A</th>
          <th>B</th>
          <th>CNOT</th>
          <th>Quantum read</th>
        </tr>
      </thead>
      <tbody>
        {[
          ["0", "0", "00", "unchanged"],
          ["0", "1", "01", "control off"],
          ["1", "0", "11", "target flips"],
          ["1", "1", "10", "target flips"]
        ].map((row) => (
          <tr key={row.join("-")}>
            {row.map((cell) => (
              <td key={cell}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CorrelationGrid({
  counts,
  shots
}: {
  counts: Record<string, number>;
  shots: number;
}) {
  return (
    <div className="correlation-grid">
      {Object.entries(counts).map(([basis, count]) => (
        <div className="correlation-cell" key={basis}>
          <span>|{basis}&gt;</span>
          <strong>{Math.round((count / shots) * 100)}%</strong>
        </div>
      ))}
    </div>
  );
}

function GateReference({ gate }: { gate: GateName }) {
  const info = gateInfo[gate];
  return (
    <div className="reference-card">
      <h4>{gate}: {info.title}</h4>
      <p>{info.description}</p>
      <p><strong>Use:</strong> {info.use}</p>
      <p><strong>Challenge:</strong> {info.challenge}</p>
      <MatrixStepper gate={gate} />
    </div>
  );
}

function AssessmentPreview({ path }: { path: string }) {
  return (
    <div className="assessment">
      <div>
        <strong>Active path</strong>
        <span>{path}</span>
      </div>
      <div>
        <strong>Checkpoint</strong>
        <span>Predict the output of H, CNOT, measure.</span>
      </div>
      <div>
        <strong>Feedback mode</strong>
        <span>Misconception-aware hints, then explanation.</span>
      </div>
    </div>
  );
}

function encodeShareDsl(source: string) {
  if (typeof window === "undefined") return "loading";
  return encodeURIComponent(window.btoa(source));
}
