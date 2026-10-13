/**
 * Where each part of the catalog lives in packages/ui. The registry
 * generator and apps/web/scripts/check-demos.mjs both read this, so a new
 * family directory is added here once.
 *
 * apps/web/src/features/docs/lib/get-component-code.ts (rewriteDemoImports)
 * still keeps its own copy of the import directories, because it is app
 * source compiled by Next. check-demos fails when a demo imports from a
 * directory listed here that the rewrite would not match, which keeps the
 * two in step.
 */

export const FAMILIES = [
  { id: 'ui', codeDir: 'src/components', docsSegment: 'elements/ui' },
  { id: 'layout', codeDir: 'src/layout', docsSegment: 'elements/layout' },
  { id: 'ai', codeDir: 'src/ai', docsSegment: 'elements/ai' },
  { id: 'hybrids', codeDir: 'src/hybrids', docsSegment: 'elements/hybrids' },
];

export const DEMOS_DIR = 'src/demos';
export const EXAMPLES_DIR = 'src/examples';
export const BRICKS_DIR = 'src/bricks';
export const ICONS_DIR = 'src/icons';

/**
 * Directories under src/ a demo may import from with `../../<dir>/`. The
 * docs rewrite all of them to the components alias, because the CLI installs
 * every family and every icon there.
 */
export const COMPONENT_IMPORT_DIRS = [
  ...FAMILIES.map((family) => family.codeDir.replace(/^src\//, '')),
  ICONS_DIR.replace(/^src\//, ''),
];

/** `../../lib/` is rewritten to the lib alias instead, where cn lives. */
export const LIB_IMPORT_DIR = 'lib';
