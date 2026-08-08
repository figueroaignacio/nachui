import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { THEME_CONTRACT, THEME_CONTRACT_ROOT_ONLY } from './theme-contract';

const cssDir = path.join(__dirname, 'css');
const themes = readdirSync(cssDir).filter((f) => f.endsWith('.css'));

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

  describe.each(themes)('%s', (file) => {
    const css = readFileSync(path.join(cssDir, file), 'utf8');

    it.each([':root', '.dark'] as const)('declares every contract token in %s', (selector) => {
      const declared = declaredIn(css, selector);
      const missing = THEME_CONTRACT.filter((token) => !declared.has(token));
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
