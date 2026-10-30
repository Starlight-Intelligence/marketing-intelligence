// Covers scripts/check-skill-frontmatter.mjs, which the required `test` check runs on every SKILL.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { hasNameAndDescription, checkSkills, findSkillFiles } from '../scripts/check-skill-frontmatter.mjs';

const VALID = '---\nname: demo\ndescription: Use when testing the checker.\n---\n\n# Demo\n';

test('valid frontmatter passes', () => {
  assert.equal(hasNameAndDescription(VALID), true);
});

test('CRLF frontmatter passes', () => {
  assert.equal(hasNameAndDescription(VALID.replace(/\n/g, '\r\n')), true);
});

test('folded description passes', () => {
  assert.equal(hasNameAndDescription('---\nname: demo\ndescription: >\n  Use when folded.\n---\n'), true);
});

test('missing description fails', () => {
  assert.equal(hasNameAndDescription('---\nname: demo\n---\n'), false);
});

test('empty description fails', () => {
  assert.equal(hasNameAndDescription('---\nname: demo\ndescription:\n---\n'), false);
});

test('fields outside frontmatter do not count', () => {
  assert.equal(hasNameAndDescription('# Demo\nname: demo\ndescription: not frontmatter\n'), false);
  assert.equal(hasNameAndDescription('\n---\nname: demo\ndescription: late\n---\n'), false);
});

test('CLI exits 0 on a valid tree and 1 naming the bad file on an invalid one', () => {
  const root = mkdtempSync(join(tmpdir(), 'skills-'));
  try {
    mkdirSync(join(root, 'skills', 'good'), { recursive: true });
    writeFileSync(join(root, 'skills', 'good', 'SKILL.md'), VALID);
    const script = new URL('../scripts/check-skill-frontmatter.mjs', import.meta.url).pathname;
    let r = spawnSync(process.execPath, [script, root], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /skills ok \(1 checked\)/);

    mkdirSync(join(root, 'skills', 'bad'), { recursive: true });
    writeFileSync(join(root, 'skills', 'bad', 'SKILL.md'), '---\nname: bad\n---\n');
    r = spawnSync(process.execPath, [script, root], { encoding: 'utf8' });
    assert.equal(r.status, 1);
    assert.match(r.stderr, /skills[\\/]bad[\\/]SKILL\.md/);
    assert.deepEqual(checkSkills(root).length, 1);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('CLI exits 1 on a tree with no SKILL.md files', () => {
  const root = mkdtempSync(join(tmpdir(), 'skills-empty-'));
  try {
    const script = new URL('../scripts/check-skill-frontmatter.mjs', import.meta.url).pathname;
    let r = spawnSync(process.execPath, [script, root], { encoding: 'utf8' });
    assert.equal(r.status, 1, 'an empty tree must fail');
    assert.match(r.stderr, /no SKILL\.md files found/);

    // Skill directories without a SKILL.md still count as empty.
    mkdirSync(join(root, 'skills', 'orphan'), { recursive: true });
    writeFileSync(join(root, 'skills', 'orphan', 'README.md'), '# not a skill\n');
    r = spawnSync(process.execPath, [script, root], { encoding: 'utf8' });
    assert.equal(r.status, 1, 'skills directories with no SKILL.md must fail');
    assert.match(r.stderr, /no SKILL\.md files found/);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('every SKILL.md in this repo passes, and there is at least one', () => {
  assert.ok(findSkillFiles('.').length > 0, 'no SKILL.md files found in this repo');
  assert.deepEqual(checkSkills('.'), []);
});

test('CI runs the checked-in script, not an inline copy', async () => {
  const { readFileSync } = await import('node:fs');
  const ci = readFileSync('.github/workflows/ci.yml', 'utf8');
  assert.match(ci, /run:\s*node scripts\/check-skill-frontmatter\.mjs\s*$/m);
  assert.doesNotMatch(ci, /node -e/);
});
