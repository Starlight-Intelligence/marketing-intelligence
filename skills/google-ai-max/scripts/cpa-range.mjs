#!/usr/bin/env node
// Fallback CPA interval for the verdict rule, used when the marketing-experiments
// script is not installed. Method: the matured conversion count n is treated as
// n +/- 2*sqrt(n) (about a 95% band on a Poisson-like count), so
// CPA lies between spend / (n + 2*sqrt(n)) and spend / (n - 2*sqrt(n)).
// Valid from n = 10. Below that the verdict is inconclusive, at 0 it is stop.
// Usage: node cpa-range.mjs --spend 3000 --conversions 12 --target 237

export function cpaRange({ spend, conversions, target }) {
  const ok = (v) => typeof v === 'number' && Number.isFinite(v);
  if (!ok(spend) || spend < 0 || !ok(conversions) || conversions < 0 || !Number.isInteger(conversions)) {
    return { verdict: 'unresolved', reason: 'spend and conversions must be a non-negative number and integer' };
  }
  if (conversions === 0) return { spend, conversions, low: null, high: null, verdict: 'stop' };
  if (conversions < 10) {
    return { spend, conversions, low: null, high: null, directionalCpa: spend / conversions, verdict: 'inconclusive' };
  }
  const half = 2 * Math.sqrt(conversions);
  const low = spend / (conversions + half);
  const high = spend / (conversions - half);
  if (!ok(target) || target <= 0) {
    return { spend, conversions, low, high, verdict: 'unresolved', reason: 'no target CPA supplied' };
  }
  return { spend, conversions, low, high, target, verdict: high <= target ? 'scale-eligible' : 'not-scale-eligible' };
}

function arg(argv, name) {
  const i = argv.indexOf('--' + name);
  return i === -1 ? undefined : Number(argv[i + 1]);
}

import { fileURLToPath } from 'node:url';
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const r = cpaRange({ spend: arg(process.argv, 'spend'), conversions: arg(process.argv, 'conversions'), target: arg(process.argv, 'target') });
  console.log(JSON.stringify(r, null, 2));
  process.exit(r.verdict === 'unresolved' ? 2 : 0);
}
