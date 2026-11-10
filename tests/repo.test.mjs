// Repository contract checks. These run as the required `test` check, so a green `test` means
// something was asserted, not just that an empty step exited 0.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = (p) => readFileSync(p, 'utf8');

test('README.md exists and describes the repo', () => {
  assert.ok(existsSync('README.md'), 'README.md is missing');
  const readme = read('README.md');
  assert.match(readme, /^# \S/m, 'README.md has no top-level heading');
  assert.ok(readme.trim().length >= 200, 'README.md is too short to describe the repo');
});

test('pr-gate is pinned to one full commit SHA in both places', () => {
  const gate = read('.github/workflows/pr-gate.yml');
  const uses = gate.match(/^\s*uses:\s*Starlight-Intelligence\/\.github\/\.github\/workflows\/pr-gate\.yml@(\S+)\s*$/m);
  const ref = gate.match(/^\s*gate-ref:\s*(\S+)\s*$/m);
  assert.ok(uses, 'pr-gate.yml has no uses line for the reusable gate');
  assert.ok(ref, 'pr-gate.yml has no gate-ref input');
  assert.match(uses[1], /^[0-9a-f]{40}$/, 'uses line is not pinned to a full commit SHA');
  assert.equal(ref[1], uses[1], 'gate-ref must match the SHA on the uses line');
});

test('pr-gate stays report-only and requires the test check', () => {
  const gate = read('.github/workflows/pr-gate.yml');
  assert.match(gate, /^\s*merge:\s*false\s*$/m, 'pr-gate must stay report-only (merge: false)');
  const required = gate.match(/^\s*required-checks:\s*(.+?)\s*$/m);
  assert.ok(required, 'pr-gate.yml has no required-checks input');
  const names = required[1].split(',').map((s) => s.trim()).filter(Boolean);
  assert.ok(names.includes('test'), 'required-checks must include test');
});

test('CI defines the test job the gate requires', () => {
  const ci = read('.github/workflows/ci.yml');
  assert.match(ci, /^name:\s*CI\s*$/m, 'ci.yml must be named CI (pr-gate listens for it by name)');
  assert.match(ci, /^ {2}test:\s*$/m, 'ci.yml has no top-level test job');
});

test('pr-gate-poke holds no permissions', () => {
  const poke = read('.github/workflows/pr-gate-poke.yml');
  assert.match(poke, /^permissions:\s*\{\}\s*$/m, 'pr-gate-poke.yml must declare permissions: {}');
});

test('the required test job runs the search intelligence unit tests from main', () => {
  const ci = read('.github/workflows/ci.yml');
  assert.match(ci, /python -m unittest discover -s plugins\/starlight-search-intelligence\/scripts/,
    'ci.yml test job must run the plugin unit tests');
  assert.ok(existsSync('plugins/starlight-search-intelligence/scripts/test_growth_core.py'),
    'plugin unit tests are missing');
});
