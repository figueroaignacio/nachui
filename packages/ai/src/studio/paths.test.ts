import { describe, expect, it } from 'vitest';
import { catalogSlug, isScreenPath, normalizeProjectPath, resolveImport } from './paths.js';

describe('normalizeProjectPath', () => {
  it('accepts screens and their parts', () => {
    expect(normalizeProjectPath('screens/billing-page.tsx')).toEqual({
      ok: true,
      path: 'screens/billing-page.tsx',
    });
    expect(normalizeProjectPath('./screens/billing/plan-card.tsx')).toEqual({
      ok: true,
      path: 'screens/billing/plan-card.tsx',
    });
  });

  it.each([
    ['components/card.tsx', 'screens/'],
    ['screens/../lib/cn.ts', 'go up'],
    ['screens/Billing.tsx', 'kebab-case'],
    ['screens/billing.js', 'kebab-case'],
    ['screens/a/b/c.tsx', 'screens/<name>'],
    ['screens\\billing.tsx', 'forward slashes'],
  ])('rejects %s', (input, reason) => {
    const result = normalizeProjectPath(input);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toContain(reason);
  });

  it('knows which files are screens', () => {
    expect(isScreenPath('screens/billing.tsx')).toBe(true);
    expect(isScreenPath('screens/billing/plan-card.tsx')).toBe(false);
  });
});

describe('resolveImport', () => {
  it('maps catalog imports from any depth', () => {
    expect(resolveImport('screens/billing.tsx', '../components/card')).toEqual({
      kind: 'catalog',
      dir: 'components',
      name: 'card',
    });
    expect(resolveImport('screens/billing/plan.tsx', '../../lib/cn')).toEqual({
      kind: 'catalog',
      dir: 'lib',
      name: 'cn',
    });
  });

  it('maps imports between project files', () => {
    expect(resolveImport('screens/billing.tsx', './billing/plan-card')).toEqual({
      kind: 'project',
      base: 'screens/billing/plan-card',
    });
  });

  it('flags packages, aliases and next', () => {
    expect(resolveImport('screens/a.tsx', 'react')).toEqual({
      kind: 'package',
      name: 'react',
      allowed: true,
    });
    expect(resolveImport('screens/a.tsx', 'lucide-react')).toMatchObject({ allowed: false });
    expect(resolveImport('screens/a.tsx', 'next/link').kind).toBe('unknown');
    expect(resolveImport('screens/a.tsx', '@/components/card').kind).toBe('unknown');
    expect(resolveImport('screens/a.tsx', '../../../x').kind).toBe('unknown');
  });

  it('names the registry slug of a catalog file', () => {
    expect(catalogSlug('components', 'card')).toBe('ui/card');
    expect(catalogSlug('ai', 'tool')).toBe('ai/tool');
  });
});
