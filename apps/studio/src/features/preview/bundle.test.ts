import { describe, expect, it, vi } from 'vitest';
import { BundleError, bundleProject, joinRelative, MODULE_PREFIX, pickEntry } from './bundle';

const CATALOG: Record<string, { path: string; code: string }> = {
  'components/card': {
    path: 'components/card.tsx',
    code: `import { cn } from '../lib/cn';\nexport const Card = ({ children }: { children?: React.ReactNode }) => <div className={cn('rounded-lg')}>{children}</div>;`,
  },
  'lib/cn': {
    path: 'lib/cn.ts',
    code: `export function cn(...values: string[]): string { return values.join(' '); }`,
  },
};

const load = vi.fn(async (dir: string, name: string) => CATALOG[`${dir}/${name}`] ?? null);

describe('joinRelative', () => {
  it('resolves against the importing file', () => {
    expect(joinRelative('screens/billing.tsx', '../components/card')).toBe('components/card');
    expect(joinRelative('screens/billing/plan.tsx', './price.tsx')).toBe('screens/billing/price');
    expect(joinRelative('screens/a.tsx', '../../x')).toBeNull();
  });
});

describe('bundleProject', () => {
  it('orders modules dependencies first and rewrites relative imports', async () => {
    const bundle = await bundleProject(
      {
        'screens/billing.tsx': `import { Card } from '../components/card';\nimport { Price } from './billing/price';\nexport default function Billing() { return <Card><Price /></Card>; }`,
        'screens/billing/price.tsx': `import type { ReactNode } from 'react';\nexport function Price(): ReactNode { return <span>$24</span>; }`,
      },
      'screens/billing.tsx',
      load,
    );

    expect(bundle.modules.map((module) => module.path)).toEqual([
      'lib/cn.ts',
      'components/card.tsx',
      'screens/billing/price.tsx',
      'screens/billing.tsx',
    ]);
    const entry = bundle.modules.at(-1);
    expect(entry?.id).toBe(bundle.entry);
    expect(entry?.code).toContain(`${MODULE_PREFIX}1`);
    expect(entry?.code).toContain(`${MODULE_PREFIX}2`);
    expect(entry?.code).toContain('react/jsx-runtime');
    expect(entry?.code).not.toContain('../components/card');
    expect(bundle.modules[2]?.code).not.toContain('ReactNode }');
    expect(load).toHaveBeenCalledTimes(2);
  });

  it('reports syntax errors with the file and line', async () => {
    const error = await bundleProject(
      { 'screens/a.tsx': 'export default function A() {\n  return <div>;\n}' },
      'screens/a.tsx',
      load,
    ).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(BundleError);
    expect(error).toMatchObject({ path: 'screens/a.tsx' });
  });

  it('reports imports it cannot find and circular imports', async () => {
    await expect(
      bundleProject(
        {
          'screens/a.tsx': `import { X } from '../components/chart';\nexport default function A() { return <X />; }`,
        },
        'screens/a.tsx',
        load,
      ),
    ).rejects.toThrow('Cannot find ../components/chart');

    await expect(
      bundleProject(
        {
          'screens/a.tsx': `import { b } from './a/b';\nexport const a = 1;\nexport default function A() { return b; }`,
          'screens/a/b.tsx': `import { a } from '../a';\nexport const b = a;`,
        },
        'screens/a.tsx',
        load,
      ),
    ).rejects.toThrow('Circular import');
  });

  it('picks the first screen as the entry', () => {
    expect(pickEntry({ 'screens/b.tsx': '', 'screens/a.tsx': '', 'screens/a/part.tsx': '' })).toBe(
      'screens/a.tsx',
    );
    expect(pickEntry({})).toBeNull();
  });
});
