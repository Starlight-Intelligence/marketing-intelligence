import test from 'node:test';
import assert from 'node:assert/strict';
import { cpaRange } from './cpa-range.mjs';

test('zero conversions means stop', () => {
  assert.equal(cpaRange({ spend: 500, conversions: 0, target: 237 }).verdict, 'stop');
});
test('fewer than 10 is inconclusive with a directional CPA only', () => {
  const r = cpaRange({ spend: 900, conversions: 5, target: 237 });
  assert.equal(r.verdict, 'inconclusive');
  assert.equal(r.directionalCpa, 180);
  assert.equal(r.low, null);
});
test('interval for 16 conversions at 3200 spend', () => {
  const r = cpaRange({ spend: 3200, conversions: 16, target: 237 });
  assert.equal(r.low, 3200 / 24);
  assert.equal(r.high, 3200 / 8);
  assert.equal(r.verdict, 'not-scale-eligible');
});
test('scale-eligible only when the whole range is at or below target', () => {
  assert.equal(cpaRange({ spend: 1000, conversions: 100, target: 60 }).verdict, 'scale-eligible');
  assert.equal(cpaRange({ spend: 1000, conversions: 100, target: 12 }).verdict, 'not-scale-eligible');
});
test('missing target or bad input stays unresolved', () => {
  assert.equal(cpaRange({ spend: 1000, conversions: 100 }).verdict, 'unresolved');
  assert.equal(cpaRange({ spend: NaN, conversions: 12, target: 5 }).verdict, 'unresolved');
  assert.equal(cpaRange({ spend: 100, conversions: 2.5, target: 5 }).verdict, 'unresolved');
});
