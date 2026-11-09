/**
 * Fails when catalog source uses a physical Tailwind class (ml-2, left-0,
 * text-left) instead of its logical twin (ms-2, start-0, text-start), so every
 * component lays out correctly under dir="rtl" without extra work.
 *
 *   node scripts/check-logical-classes.mjs         report and exit 1 on hits
 *   node scripts/check-logical-classes.mjs --fix   rewrite them in place
 */

import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FAMILIES } from './families.mjs';
import { ALLOWED, convertLine, findPhysical } from './logical-classes.mjs';

const UI_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(UI_ROOT, 'src');
const ROOTS = [...FAMILIES.map((family) => join(UI_ROOT, family.codeDir)), join(SRC, 'lib')];
const GENERATED = new Set(['lib/registry.ts']);
const fix = process.argv.includes('--fix');

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return walk(path);
    return /\.tsx?$/.test(entry) && !/\.test\.tsx?$/.test(entry) ? [path] : [];
  });
}

const problems = [];
let fixed = 0;

for (const file of ROOTS.flatMap(walk)) {
  const name = relative(SRC, file);
  if (ALLOWED[name] || GENERATED.has(name)) continue;
  const source = readFileSync(file, 'utf8');
  const lines = source.split('\n');

  if (fix) {
    const next = lines.map(convertLine);
    const changed = next.filter((line, index) => line !== lines[index]).length;
    if (changed > 0) {
      writeFileSync(file, next.join('\n'));
      fixed += changed;
    }
    continue;
  }

  lines.forEach((line, index) => {
    for (const hit of findPhysical(line)) problems.push(`${name}:${index + 1}  ${hit}`);
  });
}

if (fix) {
  console.log(`check-logical-classes: rewrote ${fixed} line(s).`);
} else if (problems.length > 0) {
  console.error('Physical Tailwind classes found. Use the logical version (ms, pe, start, end):');
  for (const problem of problems) console.error(`  ${problem}`);
  console.error('\nRun `pnpm --filter @repo/ui check:logical --fix` to rewrite them.');
  process.exit(1);
} else {
  console.log('check-logical-classes: no physical classes in catalog source.');
}
