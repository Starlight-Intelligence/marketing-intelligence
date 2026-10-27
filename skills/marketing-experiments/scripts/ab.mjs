#!/usr/bin/env node
// Experiment arithmetic with no dependencies.
//   plan   --baseline 0.04 --mde 0.2 [--alpha 0.05] [--power 0.8]   fixed sample size per arm (relative MDE)
//   bayes  --a 40/1000 --b 55/1000 [--draws 200000] [--seed 1]       P(B beats A), expected loss, lift interval
//                                     --draws must be a whole number from 1,000 to 1,000,000
//   cpa    --spend 1140 --conversions 9                               CPA range from a Poisson approximation
//   budget --max-loss 2000 --target-cpa 118 --min-per-variant 10      how many variants a budget can read
// Output is JSON on stdout. Exit 2 on bad input.

const MIN_DRAWS = 1000;
const MAX_DRAWS = 1000000;

const args = parseArgs(process.argv.slice(2));
const mode = args._[0];

try {
  const out = { plan, bayes, cpa, budget }[mode]?.(args);
  if (!out) fail(`unknown mode "${mode}". Use plan, bayes, cpa or budget.`);
  process.stdout.write(JSON.stringify(out, null, 2) + "\n");
} catch (e) {
  fail(e.message);
}

export function plan({ baseline, mde, alpha = 0.05, power = 0.8 }) {
  const p1 = num(baseline, "baseline");
  const rel = num(mde, "mde");
  const al = num(alpha, "alpha");
  const pw = num(power, "power");
  if (p1 <= 0 || p1 >= 1) throw new Error("baseline must be a rate between 0 and 1");
  if (rel <= 0) throw new Error("mde must be greater than 0");
  if (al <= 0 || al >= 1) throw new Error("alpha must be between 0 and 1");
  if (pw <= 0 || pw >= 1) throw new Error("power must be between 0 and 1");
  const p2 = p1 * (1 + rel);
  if (p2 >= 1) throw new Error("baseline x (1 + mde) must stay below 1");
  const za = normInv(1 - al / 2);
  const zb = normInv(pw);
  const pbar = (p1 + p2) / 2;
  const n = ((za * Math.sqrt(2 * pbar * (1 - pbar)) + zb * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2))) ** 2) / (p2 - p1) ** 2;
  if (!Number.isFinite(n)) throw new Error("mde is too small to give a finite sample size");
  return {
    per_arm: Math.ceil(n),
    total: Math.ceil(n) * 2,
    baseline: p1,
    target_rate: round(p2, 6),
    rule: "Decide only when every arm reaches per_arm. Looking early and stopping on a good result inflates false positives.",
  };
}

export function bayes({ a, b, draws = 200000, seed = 1 }) {
  const [ca, na] = ratio(a, "a");
  const [cb, nb] = ratio(b, "b");
  const rng = mulberry32(Number(seed));
  const n = drawCount(draws);
  let wins = 0, lossB = 0, lossA = 0;
  const lifts = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const ra = betaSample(1 + ca, 1 + na - ca, rng);
    const rb = betaSample(1 + cb, 1 + nb - cb, rng);
    if (rb > ra) wins++;
    lossB += Math.max(ra - rb, 0);
    lossA += Math.max(rb - ra, 0);
    lifts[i] = (rb - ra) / ra;
  }
  lifts.sort();
  return {
    prob_b_beats_a: round(wins / n, 4),
    expected_loss_choosing_b: round(lossB / n, 6),
    expected_loss_choosing_a: round(lossA / n, 6),
    relative_lift_95: [round(lifts[Math.floor(0.025 * n)], 4), round(lifts[Math.floor(0.975 * n)], 4)],
    counts: { a: `${ca}/${na}`, b: `${cb}/${nb}` },
    prior: "Beta(1,1) on each rate",
  };
}

export function cpa({ spend, conversions }) {
  const s = num(spend, "spend");
  const n = num(conversions, "conversions");
  if (n < 10) {
    return { conversions: n, cpa_point: n ? round(s / n, 2) : null, range: null, note: "Fewer than 10 conversions: no range. The test can stop or stay inconclusive, never scale." };
  }
  const half = 2 * Math.sqrt(n);
  return { conversions: n, cpa_point: round(s / n, 2), range: [round(s / (n + half), 2), round(s / (n - half), 2)], method: "spend / (n +- 2*sqrt(n)), Poisson approximation" };
}

export function budget({ "max-loss": maxLoss, "target-cpa": target, "min-per-variant": minPer = 10 }) {
  const t = num(target, "target-cpa");
  const m = num(minPer, "min-per-variant");
  if (t <= 0) throw new Error("target-cpa must be greater than 0");
  if (!Number.isInteger(m) || m < 1) throw new Error("min-per-variant must be a whole number of at least 1");
  const conv = Math.floor(num(maxLoss, "max-loss") / t);
  const variants = Math.floor(conv / m);
  if (!Number.isFinite(conv) || !Number.isFinite(variants)) throw new Error("max-loss / target-cpa is not a finite number");
  return {
    conversions_affordable: conv,
    variants_readable: variants,
    advice: variants >= 2 ? `Test at most ${variants} variants; a 2x2 factorial needs 4.` : "Budget cannot read two variants. Learn small with one variant against a baseline, or do not test.",
  };
}

function betaSample(a, b, rng) {
  const x = gammaSample(a, rng);
  return x / (x + gammaSample(b, rng));
}

// Marsaglia and Tsang; boosts shape below 1.
function gammaSample(k, rng) {
  if (k < 1) return gammaSample(k + 1, rng) * Math.pow(rng(), 1 / k);
  const d = k - 1 / 3, c = 1 / Math.sqrt(9 * d);
  for (;;) {
    let x, v;
    do { x = normal(rng); v = 1 + c * x; } while (v <= 0);
    v = v * v * v;
    const u = rng();
    if (u < 1 - 0.0331 * x ** 4 || Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) return d * v;
  }
}

function normal(rng) {
  return Math.sqrt(-2 * Math.log(rng() || 1e-12)) * Math.cos(2 * Math.PI * rng());
}

// Acklam's rational approximation of the inverse normal CDF.
function normInv(p) {
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const pl = 0.02425;
  if (p < pl) { const q = Math.sqrt(-2 * Math.log(p)); return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  if (p > 1 - pl) { const q = Math.sqrt(-2 * Math.log(1 - p)); return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
  const q = p - 0.5, r = q * q;
  return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
}

function mulberry32(seed) {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function ratio(v, name) {
  const m = /^(\d+)\/(\d+)$/.exec(String(v ?? ""));
  if (!m || Number(m[1]) > Number(m[2]) || Number(m[2]) === 0) throw new Error(`--${name} must look like conversions/visitors, e.g. 40/1000`);
  return [Number(m[1]), Number(m[2])];
}

function num(v, name) {
  const n = Number(v);
  if (v === undefined || !Number.isFinite(n)) throw new Error(`--${name} must be a number`);
  return n;
}

function drawCount(v) {
  const n = Number(v);
  if (v === undefined || v === true || !Number.isInteger(n) || n < MIN_DRAWS || n > MAX_DRAWS) {
    throw new Error(`--draws must be a whole number from ${MIN_DRAWS} to ${MAX_DRAWS} (got ${v === true ? "no value" : v})`);
  }
  return n;
}

function round(x, d) { return Math.round(x * 10 ** d) / 10 ** d; }

function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith("--")) out[argv[i].slice(2)] = argv[i + 1]?.startsWith("--") || argv[i + 1] === undefined ? true : argv[++i];
    else out._.push(argv[i]);
  }
  return out;
}

function fail(msg) {
  process.stderr.write(`ab: ${msg}\n`);
  process.exit(2);
}
