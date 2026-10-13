/**
 * Fails when catalog source carries comments.
 *
 * Component, demo, example, brick and icon files are shown verbatim on the
 * docs site and installed as-is by the CLI, so they stay comment-free
 * (DESIGN.md). Tests are not shown anywhere and are skipped.
 *
 * Comments are found with the TypeScript parser rather than a regex, so `//`
 * inside strings, URLs, template literals, regexes and JSX text is never
 * reported, while `{/* *\/}` in JSX and eslint-disable directives are.
 *
 * Usage:
 *   node scripts/check-no-comments.mjs
 */

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const UI_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const SCANNED_DIRS = [
  'src/components',
  'src/layout',
  'src/ai',
  'src/hybrids',
  'src/demos',
  'src/examples',
  'src/bricks',
  'src/icons',
];

/**
 * steps.tsx and snippet.tsx are moving into apps/web and stop being catalog
 * source. Entries for files that no longer exist are harmless.
 */
const IGNORED_FILES = new Set(['src/components/steps.tsx', 'src/components/snippet.tsx']);

function walk(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    else if (/\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name)) files.push(path);
  }
  return files;
}

/**
 * Every comment in a TSX source, with its 1-based line. Each comment is
 * trivia in front of some token, so asking every token for the comments
 * before it (both the same-line "trailing" ones and the "leading" ones on the
 * lines above) finds them all. JSX text is skipped because it is content.
 */
export function findComments(text, fileName = 'source.tsx') {
  const source = ts.createSourceFile(
    fileName,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const seen = new Set();
  const comments = [];

  const collect = (pos) => {
    const ranges = [
      ...(ts.getTrailingCommentRanges(text, pos) ?? []),
      ...(ts.getLeadingCommentRanges(text, pos) ?? []),
    ];
    for (const range of ranges) {
      if (seen.has(range.pos)) continue;
      seen.add(range.pos);
      const { line } = source.getLineAndCharacterOfPosition(range.pos);
      comments.push({ line: line + 1, text: text.slice(range.pos, range.end).split('\n')[0] });
    }
  };

  const visit = (node) => {
    if (node.kind === ts.SyntaxKind.JsxText) return;
    const children = node.getChildren(source);
    if (children.length === 0) {
      collect(node.pos);
      return;
    }
    for (const child of children) visit(child);
  };

  visit(source);
  return comments.sort((a, b) => a.line - b.line);
}

function main() {
  const failures = [];

  for (const dir of SCANNED_DIRS) {
    const files = walk(join(UI_ROOT, dir));
    if (files.length === 0) {
      console.error(`check-no-comments: no source files in ${dir}. Did the folder move?`);
      process.exit(1);
    }
    for (const file of files) {
      const rel = relative(UI_ROOT, file);
      if (IGNORED_FILES.has(rel)) continue;
      for (const comment of findComments(readFileSync(file, 'utf8'), file)) {
        failures.push(`${rel}:${comment.line}  ${comment.text}`);
      }
    }
  }

  if (failures.length > 0) {
    console.error('check-no-comments FAILED: catalog source must not contain comments.\n');
    for (const failure of failures) console.error(`  ${failure}`);
    console.error(
      `\n${failures.length} comment(s). The source is shown verbatim in the docs (DESIGN.md); ` +
        'move lint exceptions to packages/ui/eslint.config.mjs.\n',
    );
    process.exit(1);
  }

  console.log('check-no-comments: no comments in catalog source.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
