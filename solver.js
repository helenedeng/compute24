/**
 * Compute24 solver: find an expression with +, -, *, / using four numbers exactly once that equals 24.
 */

const TARGET = 24;
const EPS = 1e-9;

const OPS = [
  { sym: '+', fn: (a, b) => a + b },
  { sym: '-', fn: (a, b) => a - b },
  { sym: '*', fn: (a, b) => a * b },
  { sym: '/', fn: (a, b) => (b === 0 ? NaN : a / b) }
];

/** All permutations of a 4-element array. */
function permutations(arr) {
  if (arr.length <= 1) return [arr.slice()];
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = arr.slice(0, i).concat(arr.slice(i + 1));
    for (const p of permutations(rest)) {
      out.push([arr[i]].concat(p));
    }
  }
  return out;
}

/** Format expression with parentheses for display. */
function formatExpr(a, b, c, d, op1, op2, op3, structure) {
  const [s1, s2, s3] = [OPS[op1].sym, OPS[op2].sym, OPS[op3].sym];
  switch (structure) {
    case 0: return `(((${a} ${s1} ${b}) ${s2} ${c}) ${s3} ${d})`;
    case 1: return `((${a} ${s1} ${b}) ${s2} (${c} ${s3} ${d}))`;
    case 2: return `((${a} ${s1} (${b} ${s2} ${c})) ${s3} ${d})`;
    case 3: return `(${a} ${s1} ((${b} ${s2} ${c}) ${s3} ${d}))`;
    case 4: return `(${a} ${s1} (${b} ${s2} (${c} ${s3} ${d})))`;
    default: return '';
  }
}

/** Evaluate one structure. Returns result or NaN if invalid. */
function evalStructure(nums, op1, op2, op3, structure) {
  const [a, b, c, d] = nums.map(Number);
  const add = (x, y) => x + y;
  const sub = (x, y) => x - y;
  const mul = (x, y) => x * y;
  const div = (x, y) => (y === 0 ? NaN : x / y);
  const run = (i, x, y) => [add, sub, mul, div][i](x, y);

  let v;
  switch (structure) {
    case 0: // ((a op b) op c) op d
      v = run(op3, run(op2, run(op1, a, b), c), d);
      break;
    case 1: // (a op b) op (c op d)
      v = run(op2, run(op1, a, b), run(op3, c, d));
      break;
    case 2: // (a op (b op c)) op d
      v = run(op3, run(op1, a, run(op2, b, c)), d);
      break;
    case 3: // a op ((b op c) op d)
      v = run(op1, a, run(op3, run(op2, b, c), d));
      break;
    case 4: // a op (b op (c op d))
      v = run(op1, a, run(op2, b, run(op3, c, d)));
      break;
    default:
      v = NaN;
  }
  return v;
}

/**
 * Find one expression that equals 24 using the four numbers exactly once.
 * @param {number[]} numbers - Array of 4 integers in [1, 10]
 * @returns {string} Expression string that equals 24, or "-1" if none exists
 */
function compute24(numbers) {
  if (!numbers || numbers.length !== 4) return '-1';
  for (const n of numbers) {
    const v = Number(n);
    if (!Number.isInteger(v) || v < 1 || v > 10) return '-1';
  }

  const perms = permutations(numbers);
  for (const p of perms) {
    for (let op1 = 0; op1 < 4; op1++) {
      for (let op2 = 0; op2 < 4; op2++) {
        for (let op3 = 0; op3 < 4; op3++) {
          for (let structure = 0; structure < 5; structure++) {
            const result = evalStructure(p, op1, op2, op3, structure);
            if (Number.isFinite(result) && Math.abs(result - TARGET) < EPS) {
              return formatExpr(p[0], p[1], p[2], p[3], op1, op2, op3, structure);
            }
          }
        }
      }
    }
  }
  return '-1';
}
