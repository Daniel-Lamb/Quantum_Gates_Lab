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

const singleGateOrder: GateName[] = ["I", "X", "Y", "Z", "H", "S", "T"];

const gatePlacardCaptions: Record<GateName, string> = {
  I: "state unchanged",
  X: "bit flip",
  Y: "bit + phase flip",
  Z: "phase flip",
  H: "superposition",
  S: "quarter phase",
  T: "eighth phase"
};

const gateInfo: Record<
  GateName,
  {
    title: string;
    description: string;
    use: string;
    challenge: string;
    how: string;
    effect: string;
    example: string;
  }
> = {
  I: {
    title: "Identity",
    description: "Leaves the state unchanged.",
    use: "Useful for timing, placeholders, and explaining no-op columns.",
    challenge: "Show that I followed by H behaves exactly like H.",
    how: "The identity matrix has 1s on the diagonal and 0s elsewhere, so each amplitude is multiplied by 1 and stays in its original basis slot.",
    effect: "|0> stays |0>, |1> stays |1>, and any superposition keeps the same amplitude and phase.",
    example: "I(0) is useful when comparing two circuits with aligned time columns."
  },
  X: {
    title: "Bit flip",
    description: "Swaps |0> and |1> amplitudes.",
    use: "The quantum version of NOT for computational basis states.",
    challenge: "Create |1> from |0> in one gate.",
    how: "The X matrix has off-diagonal 1s, so the |0> amplitude moves to |1> and the |1> amplitude moves to |0>.",
    effect: "It flips measurement outcomes in the computational basis while preserving amplitude magnitudes.",
    example: "X(0) turns a one-qubit |0> input into |1>."
  },
  Y: {
    title: "Bit and phase flip",
    description: "Swaps basis amplitudes and introduces imaginary phase.",
    use: "Good for showing that quantum gates can affect phase and bit value.",
    challenge: "Compare X and Y on |0>.",
    how: "Y swaps the amplitudes like X, but multiplies them by i or -i as they move between basis states.",
    effect: "Measurement probabilities can look like X, but the relative phase changes later interference.",
    example: "Y(0) sends |0> to i|1>, which measures as 1 with certainty."
  },
  Z: {
    title: "Phase flip",
    description: "Leaves |0> alone and negates the |1> amplitude.",
    use: "Reveals that phase matters after interference.",
    challenge: "Apply H, Z, H and predict the final basis state.",
    how: "The Z matrix keeps the |0> amplitude and multiplies the |1> amplitude by -1.",
    effect: "It does not change direct measurement probabilities by itself, but it changes interference after another gate such as H.",
    example: "H, Z, H behaves like X on |0> because the phase flip is converted into a bit flip."
  },
  H: {
    title: "Hadamard",
    description: "Moves basis states into equal superpositions.",
    use: "Starts interference, Bell-state preparation, and many algorithms.",
    challenge: "Create |+> from |0>.",
    how: "H mixes the two basis amplitudes with 1/sqrt(2) scaling, adding for |0> and subtracting for |1>.",
    effect: "|0> becomes |+>, |1> becomes |->, and applying H twice returns the original state.",
    example: "H(0), CNOT(0, 1) creates a Bell pair from |00>."
  },
  S: {
    title: "Quarter phase",
    description: "Multiplies |1> by i.",
    use: "Shows phase rotations that do not change measurement probability alone.",
    challenge: "Find a circuit where S changes a later measurement.",
    how: "S is diagonal, so it leaves basis membership alone and rotates only the |1> amplitude by 90 degrees in the complex plane.",
    effect: "Two S gates equal Z, and four S gates return to identity.",
    example: "H, S, H produces a different interference pattern than H, H."
  },
  T: {
    title: "Eighth phase",
    description: "Multiplies |1> by e^(i*pi/4).",
    use: "A small phase step used in universal gate sets.",
    challenge: "Compare repeated T gates with S and Z.",
    how: "T is a diagonal phase gate that rotates the |1> amplitude by 45 degrees while leaving |0> unchanged.",
    effect: "Two T gates equal S, four equal Z, and eight return to identity.",
    example: "Repeated T gates make phase accumulation visible before interference."
  }
};

type InstructorQuestion = {
  id: string;
  topic: string;
  format: string;
  level: "Warmup" | "Core" | "Challenge";
  prompt: string;
  teaching: string;
  expected: string;
};

const instructorTeachings = [
  {
    title: "Prediction before simulation",
    note: "Ask students to commit to a probability distribution before stepping the circuit. Reveal the simulator only after they justify the prediction."
  },
  {
    title: "Separate amplitude from probability",
    note: "Have students name the complex amplitude first, then square its magnitude. This prevents treating amplitudes as direct percentages."
  },
  {
    title: "Use gates as transformations",
    note: "Frame each gate as a rule that moves or phases amplitudes, not as a magic symbol in a circuit diagram."
  },
  {
    title: "Trace phase through interference",
    note: "For phase gates, delay measurement and apply a later H so students can see phase become an observable probability change."
  },
  {
    title: "Compare to reversible classical logic",
    note: "Use CNOT, SWAP, and Toffoli to connect quantum circuits to classical logic while emphasizing superposition and entanglement."
  }
];

const instructorQuestions: InstructorQuestion[] = [
  {
    id: "Q01",
    topic: "Qubits",
    format: "Concept check",
    level: "Warmup",
    prompt: "What information is needed to describe a one-qubit pure state besides the labels |0> and |1>?",
    teaching: "Prompt students to write alpha|0> + beta|1>, then ask what constraints alpha and beta must satisfy.",
    expected: "A state needs complex amplitudes for |0> and |1>, with squared magnitudes summing to 1."
  },
  {
    id: "Q02",
    topic: "Superposition",
    format: "Prediction",
    level: "Core",
    prompt: "Starting from |0>, what state does H create, and what measurement probabilities should appear?",
    teaching: "Use the probability histogram after students predict both amplitudes and probabilities.",
    expected: "H creates (|0> + |1>) / sqrt(2), so measurement gives 0 and 1 with 50% probability each."
  },
  {
    id: "Q03",
    topic: "Measurement",
    format: "Short answer",
    level: "Core",
    prompt: "If a qubit is in sqrt(0.75)|0> + sqrt(0.25)|1>, what does measurement do to the state?",
    teaching: "Ask students to distinguish probability of outcome from the post-measurement state.",
    expected: "Measurement returns 0 with 75% probability or 1 with 25%, then collapses the state to the observed basis state."
  },
  {
    id: "Q04",
    topic: "Bloch sphere",
    format: "Diagram prompt",
    level: "Warmup",
    prompt: "Where are |0>, |1>, |+>, and |-> located on the Bloch sphere?",
    teaching: "Use the Bloch controls to connect polar angle to basis balance and azimuth to phase.",
    expected: "|0> is north, |1> is south, |+> is on +X, and |-> is on -X."
  },
  {
    id: "Q05",
    topic: "Bloch sphere",
    format: "Reasoning",
    level: "Challenge",
    prompt: "Why can two states with the same measurement probabilities still be different quantum states?",
    teaching: "Compare |+> and |->: same Z-basis probabilities, different relative phase.",
    expected: "Measurement in one basis can hide relative phase, but later gates can convert that phase into different probabilities."
  },
  {
    id: "Q06",
    topic: "X gate",
    format: "Quick build",
    level: "Warmup",
    prompt: "Build the shortest circuit that turns |0> into |1>. What matrix action caused it?",
    teaching: "Open the matrix view and point out the off-diagonal entries.",
    expected: "Apply X. Its matrix swaps the |0> and |1> amplitudes."
  },
  {
    id: "Q07",
    topic: "Z gate",
    format: "Prediction",
    level: "Core",
    prompt: "What changes when Z is applied to |+>, and why does direct measurement still look 50/50?",
    teaching: "Have students write |+> before and after Z, then measure in the computational basis.",
    expected: "Z changes |+> to |-> by negating the |1> amplitude. The magnitudes remain equal, so Z-basis measurement stays 50/50."
  },
  {
    id: "Q08",
    topic: "H gate",
    format: "Circuit explanation",
    level: "Core",
    prompt: "Why does H followed by H return a qubit to its starting state?",
    teaching: "Use the gate-by-gate simulator and ask students to track how amplitudes add and subtract.",
    expected: "H is its own inverse. The second H reverses the mixing done by the first H."
  },
  {
    id: "Q09",
    topic: "Y gate",
    format: "Compare",
    level: "Core",
    prompt: "How are X and Y similar on |0>, and what important difference appears in the amplitude?",
    teaching: "Ask for the measurement distribution first, then the actual state vector.",
    expected: "Both measure as |1> with certainty from |0>, but Y adds an imaginary phase, producing i|1>."
  },
  {
    id: "Q10",
    topic: "S and T gates",
    format: "Pattern finding",
    level: "Core",
    prompt: "How many T gates equal S, how many equal Z, and how many return to identity?",
    teaching: "Use repeated phase gates to make phase accumulation concrete.",
    expected: "Two T gates equal S, four T gates equal Z, and eight T gates equal identity up to the full phase cycle."
  },
  {
    id: "Q11",
    topic: "Phase gates",
    format: "Challenge",
    level: "Challenge",
    prompt: "Design a circuit where a phase gate changes the final measurement probabilities.",
    teaching: "Steer students toward H, phase, H so phase is converted into interference.",
    expected: "A circuit such as H, Z, H changes |0> into |1>, showing phase can become observable through interference."
  },
  {
    id: "Q12",
    topic: "CNOT",
    format: "Truth table",
    level: "Warmup",
    prompt: "Complete the CNOT truth table for inputs 00, 01, 10, and 11.",
    teaching: "Emphasize that the target flips only when the control is 1.",
    expected: "00 -> 00, 01 -> 01, 10 -> 11, and 11 -> 10."
  },
  {
    id: "Q13",
    topic: "Entanglement",
    format: "Explain",
    level: "Core",
    prompt: "Why does H on q0 followed by CNOT q0->q1 create a Bell pair?",
    teaching: "Step the active circuit and connect the two branches |00> and |10> before CNOT to |00> and |11> after CNOT.",
    expected: "H creates two branches for q0, then CNOT copies the branch value into q1, producing (|00> + |11>) / sqrt(2)."
  },
  {
    id: "Q14",
    topic: "Entanglement",
    format: "Misconception check",
    level: "Challenge",
    prompt: "Why is a Bell pair not the same as two independent fair-coin qubits?",
    teaching: "Compare marginal outcomes with joint outcomes in the probability histogram.",
    expected: "Each qubit alone looks random, but their joint outcomes are perfectly correlated: only 00 and 11 appear."
  },
  {
    id: "Q15",
    topic: "CZ",
    format: "Reasoning",
    level: "Core",
    prompt: "What does CZ change, and why can it be hard to notice without later interference?",
    teaching: "Have students mark which basis state receives the phase flip.",
    expected: "CZ negates the |11> amplitude. Probabilities do not change immediately, but later interference can reveal the phase."
  },
  {
    id: "Q16",
    topic: "SWAP",
    format: "Circuit reading",
    level: "Warmup",
    prompt: "What should a SWAP gate do to the two-qubit basis states 01 and 10?",
    teaching: "Use this to connect wire position to qubit identity in a circuit diagram.",
    expected: "SWAP exchanges the qubit values: 01 becomes 10 and 10 becomes 01."
  },
  {
    id: "Q17",
    topic: "Toffoli",
    format: "Classical bridge",
    level: "Core",
    prompt: "Why is Toffoli important when comparing classical and quantum logic?",
    teaching: "Use Toffoli as a reversible AND-like operation before discussing quantum reversibility.",
    expected: "Toffoli flips a target only when both controls are 1, making it a reversible way to embed classical logic."
  },
  {
    id: "Q18",
    topic: "Circuit diagrams",
    format: "Debugging",
    level: "Core",
    prompt: "Given a circuit with CNOT control and target on the same qubit, what is wrong and how should it be repaired?",
    teaching: "Use the simulator error explainer, then ask students to propose a valid pair of qubit indices.",
    expected: "A controlled gate needs distinct control and target qubits. Repair it by selecting different wires."
  },
  {
    id: "Q19",
    topic: "State vector",
    format: "Interpretation",
    level: "Core",
    prompt: "In a two-qubit state vector, what do the entries for |00>, |01>, |10>, and |11> represent?",
    teaching: "Point to the state vector panel and ask students to map each basis label to an amplitude.",
    expected: "Each entry is the complex amplitude for that basis state; squared magnitude gives that basis state's measurement probability."
  },
  {
    id: "Q20",
    topic: "Probability histograms",
    format: "Prediction",
    level: "Warmup",
    prompt: "If the histogram shows only 00 and 11 at 50% each, what can you infer and what can you not infer?",
    teaching: "Use this to separate probability data from full state-vector phase information.",
    expected: "You can infer correlated measurement outcomes, but not all relative phase information from that histogram alone."
  },
  {
    id: "Q21",
    topic: "Classical vs quantum",
    format: "Compare",
    level: "Core",
    prompt: "How is quantum superposition different from a classical random bit?",
    teaching: "Ask students to name an experiment where interference distinguishes the two.",
    expected: "A random bit has hidden classical uncertainty; a superposition has amplitudes that can interfere before measurement."
  },
  {
    id: "Q22",
    topic: "Deutsch-Jozsa",
    format: "Algorithm sketch",
    level: "Challenge",
    prompt: "What question does Deutsch-Jozsa answer, and where does interference help?",
    teaching: "Start from the classical baseline, then mark the oracle and final H layer in the storyboard.",
    expected: "It distinguishes constant from balanced functions with fewer queries by using phase kickback and interference."
  },
  {
    id: "Q23",
    topic: "Grover search",
    format: "Algorithm sketch",
    level: "Challenge",
    prompt: "What are the two repeating ideas in Grover search?",
    teaching: "Have students identify the oracle marking step and the diffusion amplification step.",
    expected: "Grover alternates marking the target state and amplifying it so the target measurement probability rises."
  },
  {
    id: "Q24",
    topic: "Teleportation",
    format: "Sequence",
    level: "Challenge",
    prompt: "Why does quantum teleportation need both entanglement and classical bits?",
    teaching: "Ask students to order the stages: shared Bell pair, local operations, measurement, classical communication, correction.",
    expected: "Entanglement supplies the quantum correlation, while classical bits tell the receiver which correction to apply."
  },
  {
    id: "Q25",
    topic: "Explain this circuit",
    format: "Synthesis",
    level: "Challenge",
    prompt: "Explain the active circuit using three layers: gate actions, state-vector changes, and final measurement probabilities.",
    teaching: "Use the Explain this circuit panel and require students to cite one gate, one amplitude change, and one histogram outcome.",
    expected: "A strong answer connects each operation to amplitude movement or phase, then justifies the final distribution from the state vector."
  }
];

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
  const [challengeDifficulty, setChallengeDifficulty] = useState("Guided");
  const [matrixInput, setMatrixInput] = useState<"0" | "1">("0");
  const [activeAlgorithm, setActiveAlgorithm] = useState(0);
  const [diagramGlow, setDiagramGlow] = useState(70);
  const [flippedGates, setFlippedGates] = useState<Record<GateName, boolean>>({
    I: false,
    X: false,
    Y: false,
    Z: false,
    H: false,
    S: false,
    T: false
  });

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
  const challengeScore = Math.max(
    0,
    Math.round((challengeSolved ? 100 : 52) - activeCircuit.operations.length * 4)
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

  function addOperation(operation: Operation) {
    const nextCircuit = {
      ...activeCircuit,
      operations: [...activeCircuit.operations, operation]
    };
    loadCircuit(nextCircuit);
  }

  function flipGatePlacard(gate: GateName) {
    setSelectedGate(gate);
    setFlippedGates((current) => ({ ...current, [gate]: !current[gate] }));
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
              <a className="secondary-action" href="#lessons">
                <Sparkles aria-hidden="true" size={18} />
                Explore lessons
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
          ["Live", "interactive simulator"],
          ["SVG", "accurate circuit diagrams"],
          ["Flow", "animated learning space"],
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
            <CircuitDiagram circuit={activeCircuit} activeStep={clampedStep} glow={diagramGlow} />
            <label className="range-label diagram-control">
              Diagram glow: {diagramGlow}%
              <input
                aria-label="Adjust diagram glow"
                min="0"
                max="100"
                step="5"
                type="range"
                value={diagramGlow}
                onChange={(event) => setDiagramGlow(Number(event.target.value))}
              />
            </label>
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
            <div className="quick-add-grid" aria-label="Quick-add circuit operations">
              <button onClick={() => addOperation({ kind: "single", gate: "H", target: 0 })}>+ H q0</button>
              <button onClick={() => addOperation({ kind: "single", gate: "X", target: 0 })}>+ X q0</button>
              {activeCircuit.qubits > 1 ? (
                <button onClick={() => addOperation({ kind: "cx", control: 0, target: 1 })}>+ CNOT</button>
              ) : (
                <button onClick={() => addOperation({ kind: "single", gate: "Z", target: 0 })}>+ Z q0</button>
              )}
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
            <ShotComparison items={currentProbabilities} shots={shots} />
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
          <div className="challenge-controls">
            <label className="field-stack">
              Difficulty
              <select value={challengeDifficulty} onChange={(event) => setChallengeDifficulty(event.target.value)}>
                <option>Guided</option>
                <option>Limited gates</option>
                <option>No hints</option>
              </select>
            </label>
            <div className="score-chip">
              <span>Score</span>
              <strong>{challengeScore}</strong>
            </div>
          </div>
          <div className="allowed-gates">
            <span>Allowed gates</span>
            <b>H</b>
            <b>CNOT</b>
            {challengeDifficulty === "Guided" ? <b>Hint</b> : null}
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
          <div className="segmented-control" role="group" aria-label="Matrix input state">
            <button className={matrixInput === "0" ? "pill active" : "pill"} onClick={() => setMatrixInput("0")}>Input |0&gt;</button>
            <button className={matrixInput === "1" ? "pill active" : "pill"} onClick={() => setMatrixInput("1")}>Input |1&gt;</button>
          </div>
          <MatrixStepper gate={matrixGate} input={matrixInput} />
        </FeatureCard>
      </section>

      <section className="section grid-three">
        <FeatureCard
          icon={<FlaskConical size={20} />}
          title="Circuit debugging"
          text="Broken circuits compare actual and expected behavior, then reveal the first bad transition."
        >
          <CircuitDiagram circuit={debugBrokenCircuit} activeStep={2} compact glow={diagramGlow} />
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
            {singleGateOrder.map((gate) => (
              <button
                key={gate}
                className={selectedGate === gate ? "pill active" : "pill"}
                onClick={() => setSelectedGate(gate)}
              >
                {gate}
              </button>
            ))}
          </div>
          <GatePlacardCarousel
            activeGate={selectedGate}
            flippedGates={flippedGates}
            onFlip={flipGatePlacard}
          />
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
          {algorithms.map((algorithm, index) => (
            <article
              className={index === activeAlgorithm ? "algorithm-card active" : "algorithm-card"}
              key={algorithm.name}
            >
              <span>{algorithm.phase}</span>
              <h3>{algorithm.name}</h3>
              <p>{algorithm.baseline}</p>
              <strong>{algorithm.result}</strong>
              <button onClick={() => setActiveAlgorithm(index)}>
                {index === activeAlgorithm ? "Selected step" : "Inspect storyboard"}
              </button>
            </article>
          ))}
        </div>
        <div className="storyboard-detail">
          <strong>{algorithms[activeAlgorithm].name} teaching sequence</strong>
          <p>{algorithms[activeAlgorithm].baseline}</p>
          <ol>
            <li>Introduce the classical problem and what must be learned.</li>
            <li>Prepare registers and mark where interference enters.</li>
            <li>Step through the circuit while the probability panel updates.</li>
            <li>Ask students to explain why the final measurement is useful.</li>
          </ol>
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
          <PathRecommendations path={path} />
        </FeatureCard>
      </section>

      <section className="section" id="instructor">
        <div className="instructor-panel">
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
          <div className="teaching-moves" aria-label="Instructor teaching moves">
            {instructorTeachings.map((item) => (
              <article className="teaching-card" key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
          <div className="instructor-bank">
            <div className="bank-heading">
              <div>
                <p className="eyebrow">Question plan</p>
                <h3>25 prompts for lessons, checkpoints, and discussion</h3>
              </div>
              <span>{instructorQuestions.length} questions</span>
            </div>
            <div className="question-bank-grid">
              {instructorQuestions.map((question) => (
                <article className="question-card" key={question.id}>
                  <div className="question-meta">
                    <span>{question.id}</span>
                    <span>{question.topic}</span>
                    <span>{question.level}</span>
                  </div>
                  <strong>{question.prompt}</strong>
                  <p>{question.teaching}</p>
                  <div className="question-format">{question.format}</div>
                  {showAnswers ? (
                    <div className="answer-note">
                      <span>Expected answer</span>
                      <p>{question.expected}</p>
                    </div>
                  ) : (
                    <div className="answer-note muted-answer">Reveal answers to show the model response.</div>
                  )}
                </article>
              ))}
            </div>
          </div>
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
  compact = false,
  glow = 70
}: {
  circuit: Circuit;
  activeStep: number;
  compact?: boolean;
  glow?: number;
}) {
  const width = compact ? 420 : 640;
  const rowGap = compact ? 52 : 62;
  const colGap = compact ? 78 : 96;
  const height = 58 + (circuit.qubits - 1) * rowGap;
  const startX = 54;

  return (
    <svg
      className="circuit-svg"
      style={{ ["--gate-glow" as string]: `${glow / 100}` }}
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

function ShotComparison({
  items,
  shots
}: {
  items: ReturnType<typeof probabilities>;
  shots: number;
}) {
  return (
    <div className="shot-panel" aria-label="Theoretical and sampled probability comparison">
      <strong>Sampled vs theoretical</strong>
      {items.map((item, index) => {
        const sampled = Math.round(item.probability * shots + (index % 2 === 0 ? 1 : -1));
        const bounded = Math.max(0, Math.min(shots, sampled));
        return (
          <div className="shot-row" key={item.basis}>
            <span>|{item.basis}&gt;</span>
            <b>{bounded}/{shots}</b>
            <small>{Math.round(item.probability * 100)}% theory</small>
          </div>
        );
      })}
    </div>
  );
}

function MatrixStepper({ gate, input = "0" }: { gate: GateName; input?: "0" | "1" }) {
  const matrix = gateMatrices[gate];
  const inputVector = input === "0" ? [1, 0] : [0, 1];
  const outputColumn = input === "0" ? [matrix[0][0], matrix[1][0]] : [matrix[0][1], matrix[1][1]];
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
        <span>{inputVector[0]}</span>
        <span>{inputVector[1]}</span>
      </div>
      <span className="multiply">=</span>
      <div className="vector-card accent">
        <span>{formatComplex(outputColumn[0])}</span>
        <span>{formatComplex(outputColumn[1])}</span>
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

function GatePlacardCarousel({
  activeGate,
  flippedGates,
  onFlip
}: {
  activeGate: GateName;
  flippedGates: Record<GateName, boolean>;
  onFlip: (gate: GateName) => void;
}) {
  return (
    <div className="gate-placard-row" aria-label="Scrollable quantum gate placards">
      {singleGateOrder.map((gate) => {
        const info = gateInfo[gate];
        const isFlipped = flippedGates[gate];
        const className = [
          "gate-placard",
          isFlipped ? "is-flipped" : "",
          activeGate === gate ? "is-active" : ""
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <button
            aria-label={`${isFlipped ? "Hide" : "Show"} ${gate} gate explanation`}
            aria-pressed={isFlipped}
            className={className}
            key={gate}
            onClick={() => onFlip(gate)}
            type="button"
          >
            <span className="gate-placard-inner">
              <span className="gate-placard-face gate-placard-front">
                <span className="gate-visual-wrap">
                  <GatePlacardImage gate={gate} />
                </span>
                <span className="gate-placard-name">
                  <strong>{gate}</strong>
                  <span>{info.title}</span>
                </span>
              </span>
              <span className="gate-placard-face gate-placard-back">
                <strong>{gate}: what it does</strong>
                <span>{info.description}</span>
                <span className="placard-how">{info.how}</span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

function GatePlacardImage({ gate }: { gate: GateName }) {
  const phaseOffset: Record<GateName, number> = {
    I: 0,
    X: 20,
    Y: 40,
    Z: 60,
    H: 80,
    S: 100,
    T: 120
  };
  const offset = phaseOffset[gate];

  return (
    <svg className="gate-placard-image" viewBox="0 0 180 136" role="img" aria-label={`${gate} gate visual`}>
      <defs>
        <linearGradient id={`gate-gradient-${gate}`} x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="var(--mint)" />
          <stop offset="52%" stopColor="var(--teal)" />
          <stop offset="100%" stopColor="var(--blue)" />
        </linearGradient>
        <radialGradient id={`gate-glow-${gate}`} cx="50%" cy="42%" r="58%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.94)" />
          <stop offset="48%" stopColor="rgba(159, 244, 207, 0.5)" />
          <stop offset="100%" stopColor="rgba(39, 111, 159, 0)" />
        </radialGradient>
      </defs>
      <rect className="gate-image-bg" x="10" y="10" width="160" height="116" rx="22" />
      <circle cx="90" cy="64" r="48" fill={`url(#gate-glow-${gate})`} />
      <path
        className="gate-wave"
        d={`M 18 ${74 - offset / 10} C 48 ${34 + offset / 12}, 70 ${96 - offset / 18}, 96 ${62 + offset / 24} S 138 ${40 + offset / 14}, 162 ${72 - offset / 16}`}
      />
      <path
        className="gate-wave secondary"
        d={`M 20 ${46 + offset / 12} C 52 ${78 - offset / 18}, 74 ${28 + offset / 11}, 98 ${56 + offset / 20} S 136 ${98 - offset / 10}, 160 ${48 + offset / 18}`}
      />
      <g className="gate-chip">
        <rect x="58" y="34" width="64" height="60" rx="14" fill={`url(#gate-gradient-${gate})`} />
        <text x="90" y="74" textAnchor="middle">
          {gate}
        </text>
      </g>
      <g className="gate-qubits">
        <line x1="28" y1="52" x2="58" y2="52" />
        <line x1="122" y1="52" x2="152" y2="52" />
        <line x1="28" y1="76" x2="58" y2="76" />
        <line x1="122" y1="76" x2="152" y2="76" />
      </g>
      <text className="gate-image-caption" x="90" y="114" textAnchor="middle">
        {gatePlacardCaptions[gate]}
      </text>
    </svg>
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
      <details className="gate-details" open>
        <summary>What this gate does and how</summary>
        <p><strong>How:</strong> {info.how}</p>
        <p><strong>Effect:</strong> {info.effect}</p>
        <p><strong>Example:</strong> {info.example}</p>
      </details>
      <div className="mini-example">
        <CircuitDiagram
          circuit={{ qubits: 1, operations: [{ kind: "single", gate, target: 0 }] }}
          activeStep={1}
          compact
          glow={86}
        />
      </div>
      <MatrixStepper gate={gate} />
    </div>
  );
}

function PathRecommendations({ path }: { path: string }) {
  const recommendations: Record<string, string[]> = {
    "No Linear Algebra Yet": ["Qubit Playground", "Measurement sampler", "Bloch slider"],
    "CS Theory Path": ["Classical vs quantum logic", "Toffoli and reversibility", "Deutsch-Jozsa storyboard"],
    "Programming Path": ["DSL lab", "Circuit debugging", "Grover implementation"],
    "Full Course Path": ["Skill map checkpoint", "Bell challenge", "Teleportation storyboard"]
  };

  return (
    <div className="path-recommendations">
      <strong>Recommended next lessons</strong>
      {recommendations[path].map((item) => (
        <span key={item}>{item}</span>
      ))}
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
