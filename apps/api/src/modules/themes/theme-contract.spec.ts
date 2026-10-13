import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { THEME_CONTRACT, THEME_CONTRACT_ROOT_ONLY } from './theme-contract';

const cssDir = path.join(__dirname, 'css');
const themes = readdirSync(cssDir).filter((f) => f.endsWith('.css'));
const uiGlobals = readFileSync(
  path.resolve(__dirname, '../../../../../packages/ui/src/css/globals.css'),
  'utf8',
);

function themeBlock(css: string): string {
  const start = css.indexOf('@theme');
  if (start === -1) return '';
  return css.slice(start, css.indexOf('\n}', start));
}

/** The Tailwind utilities a stylesheet maps to tokens: `bg-success-surface`, `shadow-md`. */
function utilityMappings(css: string): string[] {
  return [...themeBlock(css).matchAll(/(--(?:color|shadow)-[\w-]+)\s*:/g)].map((m) => m[1]);
}

function declaredIn(css: string, selector: ':root' | '.dark'): Set<string> {
  const start = css.indexOf(`${selector} {`);
  if (start === -1) return new Set();
  const end = css.indexOf('\n}', start);
  const block = css.slice(start, end);
  return new Set([...block.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]));
}

describe('theme contract', () => {
  it('finds theme files to check', () => {
    expect(themes.length).toBeGreaterThan(0);
  });

  it('matches the tokens the component package declares', () => {
    const declared = declaredIn(uiGlobals, ':root');
    const missing = [...THEME_CONTRACT, ...THEME_CONTRACT_ROOT_ONLY].filter(
      (token) => !declared.has(token),
    );
    expect(missing).toEqual([]);
  });

  describe.each(themes)('%s', (file) => {
    const css = readFileSync(path.join(cssDir, file), 'utf8');

    it.each([':root', '.dark'] as const)('declares every contract token in %s', (selector) => {
      const declared = declaredIn(css, selector);
      const missing = THEME_CONTRACT.filter((token) => !declared.has(token));
      expect(missing).toEqual([]);
    });

    it('is a Tailwind v4 stylesheet with no config file', () => {
      expect(css).toMatch(/@import ['"]tailwindcss['"];/);
      expect(css).toMatch(/@custom-variant dark/);
      expect(css).not.toMatch(/@config\b|@tailwind\b/);
    });

    // Installed components use utilities like `bg-success-surface`; a theme
    // without the mapping renders them unstyled.
    it('maps every color and shadow utility the components use', () => {
      const mapped = new Set(utilityMappings(css));
      const missing = utilityMappings(uiGlobals).filter((name) => !mapped.has(name));
      expect(missing).toEqual([]);
    });

    it('declares the mode-independent tokens in :root', () => {
      const declared = declaredIn(css, ':root');
      const missing = THEME_CONTRACT_ROOT_ONLY.filter((token) => !declared.has(token));
      expect(missing).toEqual([]);
    });

    // A theme that inherits the base palette for even one token is the bug
    // this suite exists to catch, so an empty block counts as a failure.
    it.each([':root', '.dark'] as const)('has a non-empty %s block', (selector) => {
      expect(declaredIn(css, selector).size).toBeGreaterThan(0);
    });
  });
});
