#!/usr/bin/env node
// Every SKILL.md needs a name and a description saying when to use it, or no harness routes to it.
// Run by the required `test` check in .github/workflows/ci.yml; kept as a file (not inline `node -e`)
// so no YAML or shell quoting sits between the regexes and Node, and so tests/ can exercise it.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Returns the frontmatter block of a SKILL.md, or "" when there is none. Accepts LF and CRLF.
export function frontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  return m ? m[1] : '';
}

export function hasNameAndDescription(text) {
  const fm = frontmatter(text);
  return /^name:[ \t]*\S/m.test(fm) && /^description:[ \t]*\S/m.test(fm);
}

export function findSkillFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name.startsWith('.git')) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...findSkillFiles(p));
    else if (e.name === 'SKILL.md') out.push(p);
  }
  return out;
}

// Returns the SKILL.md paths under root that lack a name or description.
export function checkSkills(root = '.') {
  return findSkillFiles(root).filter((p) => !hasNameAndDescription(readFileSync(p, 'utf8')));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const root = process.argv[2] || '.';
  const found = findSkillFiles(root).length;
  // Zero SKILL.md files means the tree is empty or the skills moved: fail instead of passing vacuously.
  if (found === 0) {
    console.error(`no SKILL.md files found under ${root}`);
    process.exit(1);
  }
  const bad = checkSkills(root);
  if (bad.length) {
    console.error('SKILL.md missing name or description:\n' + bad.join('\n'));
    process.exit(1);
  }
  console.log(`skills ok (${found} checked)`);
}
