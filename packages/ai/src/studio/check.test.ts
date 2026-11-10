import { describe, expect, it, vi } from 'vitest';
import {
  checkProject,
  collectExports,
  projectCatalogImports,
  type CatalogSourceLookup,
} from './check.js';

const CATALOG: Record<string, string> = {
  'components/card': `const CardRoot = () => null;
const Card = Object.assign(CardRoot, {});
export { Card };
export type CardProps = {};`,
  'components/button': `export const Button = () => null;
export const buttonVariants = () => '';`,
  'lib/cn': `export function cn(...inputs: string[]) { return inputs.join(' '); }`,
};

const lookup: CatalogSourceLookup = vi.fn(async (dir, name) => CATALOG[`${dir}/${name}`] ?? null);

const SCREEN = `'use client';
import { useState } from 'react';
import { Card } from '../components/card';
import { Button } from '../components/button';
import { cn } from '../lib/cn';
import { PlanCard } from './billing/plan-card';

export default function Billing() {
  const [open, setOpen] = useState(false);
  return <Card className={cn('p-4', open && 'ring-2')}><PlanCard /><Button onClick={() => setOpen(!open)}>Toggle</Button></Card>;
}`;

const PART = `import { Card } from '../../components/card';
export function PlanCard() { return <Card>Pro</Card>; }`;

describe('collectExports', () => {
  it('reads named, declared and default exports', () => {
    expect([...collectExports('a.tsx', CATALOG['components/card']!)].sort()).toEqual([
      'Card',
      'CardProps',
    ]);
    expect(collectExports('a.tsx', 'export default function A() {}').has('default')).toBe(true);
    expect(collectExports('a.tsx', 'const A = 1; export default A;').has('default')).toBe(true);
  });
});

describe('checkProject', () => {
  it('passes a screen that only uses real NachUI exports', async () => {
    const result = await checkProject(
      { 'screens/billing.tsx': SCREEN, 'screens/billing/plan-card.tsx': PART },
      lookup,
    );
    expect(result).toEqual({ ok: true, checked: 2, diagnostics: [] });
  });

  it('asks for a screen with a default export', async () => {
    const empty = await checkProject({}, lookup);
    expect(empty.diagnostics[0]).toMatchObject({ rule: 'entry' });

    const noDefault = await checkProject(
      { 'screens/a.tsx': 'export function A() { return null; }' },
      lookup,
    );
    expect(noDefault.diagnostics).toEqual([
      expect.objectContaining({ file: 'screens/a.tsx', rule: 'entry' }),
    ]);
  });

  it('reports syntax errors with their line', async () => {
    const result = await checkProject(
      { 'screens/a.tsx': 'export default function A() {\n  return <div>;\n}' },
      lookup,
    );
    expect(result.ok).toBe(false);
    expect(result.diagnostics.some((d) => d.rule === 'syntax' && d.line === 2)).toBe(true);
  });

  it('catches components and exports that do not exist', async () => {
    const result = await checkProject(
      {
        'screens/a.tsx': `import { Card, CardHeader } from '../components/card';
import { Chart } from '../components/chart';
export default function A() { return <Card />; }`,
      },
      lookup,
    );
    expect(result.diagnostics).toEqual([
      expect.objectContaining({
        line: 1,
        rule: 'export',
        message: expect.stringContaining('CardHeader'),
      }),
      expect.objectContaining({
        line: 2,
        rule: 'import',
        message: expect.stringContaining('ui/chart'),
      }),
    ]);
  });

  it('rejects packages outside NachUI, aliases and missing project files', async () => {
    const result = await checkProject(
      {
        'screens/a.tsx': `import { Check } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/card';
import { Part } from './a/part';
export default function A() { return null; }`,
      },
      lookup,
    );
    expect(result.diagnostics.map((d) => d.line)).toEqual([1, 2, 3, 4]);
    expect(result.diagnostics.every((d) => d.rule === 'import')).toBe(true);
  });
});

describe('projectCatalogImports', () => {
  it('lists each NachUI file once, from every project file', () => {
    expect(
      projectCatalogImports({
        'screens/billing.tsx': SCREEN,
        'screens/billing/plan-card.tsx': PART,
      }),
    ).toEqual([
      { dir: 'components', name: 'button' },
      { dir: 'components', name: 'card' },
      { dir: 'lib', name: 'cn' },
    ]);
  });
});
