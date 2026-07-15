export type Complex = {
  re: number;
  im: number;
};

export type GateName = "I" | "X" | "Y" | "Z" | "H" | "S" | "T";

export type Operation =
  | { kind: "single"; gate: GateName; target: number }
  | { kind: "cx"; control: number; target: number }
  | { kind: "cz"; control: number; target: number }
  | { kind: "swap"; a: number; b: number };

export type Circuit = {
  qubits: number;
  operations: Operation[];
};

export type BasisProbability = {
  basis: string;
  amplitude: Complex;
  probability: number;
};

export const ZERO: Complex = { re: 0, im: 0 };
export const ONE: Complex = { re: 1, im: 0 };

const SQRT1_2 = 1 / Math.sqrt(2);

export function c(re: number, im = 0): Complex {
  return { re, im };
}

export function add(a: Complex, b: Complex): Complex {
  return { re: a.re + b.re, im: a.im + b.im };
}

export function mul(a: Complex, b: Complex): Complex {
  return { re: a.re * b.re - a.im * b.im, im: a.re * b.im + a.im * b.re };
}

export function scale(a: Complex, factor: number): Complex {
  return { re: a.re * factor, im: a.im * factor };
}

export function magnitudeSquared(a: Complex) {
  return a.re * a.re + a.im * a.im;
}

export const gateMatrices: Record<GateName, Complex[][]> = {
  I: [
    [ONE, ZERO],
    [ZERO, ONE]
  ],
  X: [
    [ZERO, ONE],
    [ONE, ZERO]
  ],
  Y: [
    [ZERO, c(0, -1)],
    [c(0, 1), ZERO]
  ],
  Z: [
    [ONE, ZERO],
    [ZERO, c(-1)]
  ],
  H: [
    [c(SQRT1_2), c(SQRT1_2)],
    [c(SQRT1_2), c(-SQRT1_2)]
  ],
  S: [
    [ONE, ZERO],
    [ZERO, c(0, 1)]
  ],
  T: [
    [ONE, ZERO],
    [ZERO, c(Math.SQRT1_2, Math.SQRT1_2)]
  ]
};

export function initialState(qubits: number): Complex[] {
  return Array.from({ length: 2 ** qubits }, (_, index) =>
    index === 0 ? ONE : ZERO
  );
}

export function applySingleGate(
  state: Complex[],
  qubits: number,
  gate: GateName,
  target: number
): Complex[] {
  assertQubit(target, qubits);
  const matrix = gateMatrices[gate];
  const next = state.map(() => ZERO);
  const mask = 1 << (qubits - target - 1);

  for (let i = 0; i < state.length; i += 1) {
    if ((i & mask) !== 0) continue;
    const zeroIndex = i;
    const oneIndex = i | mask;
    const a0 = state[zeroIndex];
    const a1 = state[oneIndex];

    next[zeroIndex] = add(mul(matrix[0][0], a0), mul(matrix[0][1], a1));
    next[oneIndex] = add(mul(matrix[1][0], a0), mul(matrix[1][1], a1));
  }

  return next;
}

export function applyControlledX(
  state: Complex[],
  qubits: number,
  control: number,
  target: number
): Complex[] {
  assertQubit(control, qubits);
  assertQubit(target, qubits);
  if (control === target) {
    throw new Error("Control and target must be different qubits.");
  }

  const next = state.slice();
  const controlMask = 1 << (qubits - control - 1);
  const targetMask = 1 << (qubits - target - 1);

  for (let i = 0; i < state.length; i += 1) {
    const shouldFlip = (i & controlMask) !== 0 && (i & targetMask) === 0;
    if (!shouldFlip) continue;
    const pair = i | targetMask;
    next[i] = state[pair];
    next[pair] = state[i];
  }

  return next;
}

export function applyControlledZ(
  state: Complex[],
  qubits: number,
  control: number,
  target: number
): Complex[] {
  assertQubit(control, qubits);
  assertQubit(target, qubits);
  if (control === target) {
    throw new Error("Control and target must be different qubits.");
  }

  const controlMask = 1 << (qubits - control - 1);
  const targetMask = 1 << (qubits - target - 1);

  return state.map((amp, index) =>
    (index & controlMask) !== 0 && (index & targetMask) !== 0
      ? scale(amp, -1)
      : amp
  );
}

export function applySwap(
  state: Complex[],
  qubits: number,
  a: number,
  b: number
): Complex[] {
  assertQubit(a, qubits);
  assertQubit(b, qubits);
  if (a === b) throw new Error("Swap requires two different qubits.");

  const next = state.slice();
  const aMask = 1 << (qubits - a - 1);
  const bMask = 1 << (qubits - b - 1);

  for (let i = 0; i < state.length; i += 1) {
    const aBit = (i & aMask) !== 0;
    const bBit = (i & bMask) !== 0;
    if (aBit || !bBit) continue;
    const pair = (i | aMask) & ~bMask;
    next[i] = state[pair];
    next[pair] = state[i];
  }

  return next;
}

export function applyOperation(
  state: Complex[],
  qubits: number,
  operation: Operation
): Complex[] {
  if (operation.kind === "single") {
    return applySingleGate(state, qubits, operation.gate, operation.target);
  }
  if (operation.kind === "cx") {
    return applyControlledX(state, qubits, operation.control, operation.target);
  }
  if (operation.kind === "cz") {
    return applyControlledZ(state, qubits, operation.control, operation.target);
  }
  return applySwap(state, qubits, operation.a, operation.b);
}

export function executeCircuit(circuit: Circuit): Complex[][] {
  const states = [initialState(circuit.qubits)];
  for (const operation of circuit.operations) {
    states.push(applyOperation(states[states.length - 1], circuit.qubits, operation));
  }
  return states;
}

export function probabilities(state: Complex[], qubits: number): BasisProbability[] {
  return state.map((amplitude, index) => ({
    basis: index.toString(2).padStart(qubits, "0"),
    amplitude,
    probability: magnitudeSquared(amplitude)
  }));
}

export function basisLabel(index: number, qubits: number) {
  return `|${index.toString(2).padStart(qubits, "0")}>`;
}

export function formatComplex(value: Complex) {
  const re = clean(value.re);
  const im = clean(value.im);
  if (re === "0" && im === "0") return "0";
  if (im === "0") return re;
  if (re === "0") return `${im}i`;
  return `${re}${im.startsWith("-") ? " - " : " + "}${im.replace("-", "")}i`;
}

export function operationLabel(operation: Operation) {
  if (operation.kind === "single") return `${operation.gate} q${operation.target}`;
  if (operation.kind === "cx") return `CNOT q${operation.control}->q${operation.target}`;
  if (operation.kind === "cz") return `CZ q${operation.control}->q${operation.target}`;
  return `SWAP q${operation.a}<->q${operation.b}`;
}

export function parseDsl(source: string): Circuit {
  const start = source.match(/circuit\((\d+)\)/);
  if (!start) throw new Error("Start with circuit(n), for example circuit(2).");
  const qubits = Number(start[1]);
  if (!Number.isInteger(qubits) || qubits < 1 || qubits > 4) {
    throw new Error("This learning lab supports 1 to 4 qubits.");
  }

  const operations: Operation[] = [];
  const callPattern = /\.(h|x|y|z|s|t|cx|cz|swap)\(([^)]*)\)/gi;
  let match: RegExpExecArray | null;

  while ((match = callPattern.exec(source))) {
    const name = match[1].toLowerCase();
    const args = match[2]
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((arg) => !Number.isNaN(arg));

    if (["h", "x", "y", "z", "s", "t"].includes(name)) {
      if (args.length !== 1) throw new Error(`${name.toUpperCase()} needs one target.`);
      operations.push({ kind: "single", gate: name.toUpperCase() as GateName, target: args[0] });
    } else if (name === "cx") {
      if (args.length !== 2) throw new Error("cx needs control and target.");
      operations.push({ kind: "cx", control: args[0], target: args[1] });
    } else if (name === "cz") {
      if (args.length !== 2) throw new Error("cz needs control and target.");
      operations.push({ kind: "cz", control: args[0], target: args[1] });
    } else {
      if (args.length !== 2) throw new Error("swap needs two qubits.");
      operations.push({ kind: "swap", a: args[0], b: args[1] });
    }
  }

  operations.forEach((operation) => applyOperation(initialState(qubits), qubits, operation));
  return { qubits, operations };
}

export function circuitToDsl(circuit: Circuit) {
  const chain = circuit.operations
    .map((operation) => {
      if (operation.kind === "single") return `.${operation.gate.toLowerCase()}(${operation.target})`;
      if (operation.kind === "cx") return `.cx(${operation.control}, ${operation.target})`;
      if (operation.kind === "cz") return `.cz(${operation.control}, ${operation.target})`;
      return `.swap(${operation.a}, ${operation.b})`;
    })
    .join("\n  ");

  return `circuit(${circuit.qubits})${chain ? `\n  ${chain}` : ""};`;
}

export function explainCircuit(circuit: Circuit) {
  const states = executeCircuit(circuit);
  const final = probabilities(states[states.length - 1], circuit.qubits)
    .filter((item) => item.probability > 0.001)
    .map((item) => `${Math.round(item.probability * 100)}% |${item.basis}>`)
    .join(", ");

  const concepts = new Set<string>();
  for (const op of circuit.operations) {
    if (op.kind === "single" && op.gate === "H") concepts.add("superposition");
    if (op.kind === "single" && ["Z", "S", "T"].includes(op.gate)) concepts.add("phase");
    if (op.kind === "cx" || op.kind === "cz") concepts.add("controlled logic");
    if (op.kind === "swap") concepts.add("reversible routing");
  }
  if (
    circuit.operations.some((op) => op.kind === "single" && op.gate === "H") &&
    circuit.operations.some((op) => op.kind === "cx")
  ) {
    concepts.add("entanglement");
  }

  return {
    summary: `This ${circuit.qubits}-qubit circuit starts in |${"0".repeat(
      circuit.qubits
    )}> and applies ${circuit.operations.length} operation${
      circuit.operations.length === 1 ? "" : "s"
    }.`,
    steps: circuit.operations.map((operation, index) => ({
      label: operationLabel(operation),
      text: `${operationLabel(operation)} transforms the state into ${probabilities(
        states[index + 1],
        circuit.qubits
      )
        .filter((item) => item.probability > 0.001)
        .map((item) => `${Math.round(item.probability * 100)}% |${item.basis}>`)
        .join(", ")}.`
    })),
    final: final || "0% on every displayed basis state",
    concepts: Array.from(concepts)
  };
}

export function bellCorrelation(shots: number) {
  const counts: Record<string, number> = { "00": 0, "01": 0, "10": 0, "11": 0 };
  for (let i = 0; i < shots; i += 1) {
    counts[i % 2 === 0 ? "00" : "11"] += 1;
  }
  return counts;
}

function assertQubit(qubit: number, total: number) {
  if (!Number.isInteger(qubit) || qubit < 0 || qubit >= total) {
    throw new Error(`q${qubit} is outside this ${total}-qubit circuit.`);
  }
}

function clean(value: number) {
  if (Math.abs(value) < 0.0001) return "0";
  const rounded = Math.round(value * 1000) / 1000;
  if (Math.abs(rounded - SQRT1_2) < 0.001) return "1/sqrt(2)";
  if (Math.abs(rounded + SQRT1_2) < 0.001) return "-1/sqrt(2)";
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(3);
}
