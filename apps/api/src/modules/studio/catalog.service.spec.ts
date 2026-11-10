jest.mock('@repo/db', () => ({}), { virtual: true });

import type { RegistryRepository } from '../registry/registry.repository';
import { CatalogService, importPathOf, installPath } from './catalog.service';

const rows = [
  { slug: 'ui/card', registryDependencies: ['lib/cn'] },
  { slug: 'ui/button', registryDependencies: ['lib/cn', 'lib/motion'] },
  { slug: 'ai/tool', registryDependencies: ['lib/cn', 'lib/use-controllable-state'] },
  { slug: 'lib/cn', registryDependencies: [] },
  { slug: 'lib/motion', registryDependencies: [] },
  { slug: 'lib/use-controllable-state', registryDependencies: [] },
];

function setup() {
  const registry = {
    findAll: jest.fn(() => Promise.resolve(rows)),
    findBySlug: jest.fn((slug: string) =>
      Promise.resolve(slug === 'ui/card' ? { code: 'export const Card = 1;' } : undefined),
    ),
  };
  return { catalog: new CatalogService(registry as unknown as RegistryRepository), registry };
}

describe('catalog paths', () => {
  it('installs where the CLI would', () => {
    expect(installPath('ui/card', 'src')).toBe('src/components/card.tsx');
    expect(installPath('lib/cn', 'src')).toBe('src/lib/cn.ts');
    expect(installPath('ai/tool', '')).toBe('ai/tool.tsx');
  });

  it('maps slugs to import paths', () => {
    expect(importPathOf('ui/card')).toBe('components/card');
    expect(importPathOf('hooks/use-x')).toBe('hooks/use-x');
    expect(importPathOf('nope')).toBeNull();
  });
});

describe('CatalogService', () => {
  it('lists import paths and caches the registry', async () => {
    const { catalog, registry } = setup();
    await expect(catalog.listImportPaths()).resolves.toEqual([
      'ai/tool',
      'components/button',
      'components/card',
      'lib/cn',
      'lib/motion',
      'lib/use-controllable-state',
    ]);
    await catalog.listImportPaths();
    expect(registry.findAll).toHaveBeenCalledTimes(1);
  });

  it('follows registry dependencies like the CLI', async () => {
    const { catalog } = setup();
    await expect(catalog.closure(['ui/card', 'ui/button', 'ui/missing'])).resolves.toEqual([
      'lib/cn',
      'lib/motion',
      'ui/button',
      'ui/card',
    ]);
  });

  it('reads sources by import path', async () => {
    const { catalog, registry } = setup();
    await expect(catalog.source('components', 'card')).resolves.toBe('export const Card = 1;');
    await expect(catalog.source('components', 'chart')).resolves.toBeNull();
    expect(registry.findBySlug).toHaveBeenCalledWith('ui/chart');
  });
});
