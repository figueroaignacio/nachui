import { describe, expect, it, vi } from 'vitest';

import type { RegistryItem } from './api';
import { collectNpmDependencies, resolveTree } from './tree';

function item(slug: string, registryDependencies: string[] = [], dependencies: string[] = []) {
  return {
    name: slug.split('/').pop() ?? slug,
    slug,
    code: `// ${slug}`,
    dependencies,
    registryDependencies,
  };
}

function registry(items: RegistryItem[]) {
  const bySlug = new Map(items.map((i) => [i.slug, i]));
  return vi.fn(async (slug: string) => {
    const found = bySlug.get(slug) ?? items.find((i) => i.slug.endsWith(`/${slug}`)) ?? undefined;
    if (!found) throw new Error(`not found: ${slug}`);
    return found;
  });
}

describe('resolveTree', () => {
  it('installs an item with its registryDependencies, recursively', async () => {
    const fetchItem = registry([
      item('hybrids/confirm', ['ui/button', 'ui/dialog', 'lib/cn']),
      item('ui/button', ['lib/cn', 'lib/motion']),
      item('ui/dialog', ['lib/cn', 'lib/motion']),
      item('lib/cn'),
      item('lib/motion'),
    ]);

    const tree = await resolveTree(['hybrids/confirm'], fetchItem);

    expect(tree.map((i) => i.slug)).toEqual([
      'hybrids/confirm',
      'ui/button',
      'ui/dialog',
      'lib/cn',
      'lib/motion',
    ]);
  });

  it('fetches each shared dependency once', async () => {
    const fetchItem = registry([
      item('ui/button', ['lib/cn']),
      item('ui/input', ['lib/cn', 'ui/label']),
      item('ui/label', ['lib/cn']),
      item('lib/cn'),
    ]);

    const tree = await resolveTree(['ui/button', 'ui/input'], fetchItem);

    expect(tree.map((i) => i.slug).sort()).toEqual(['lib/cn', 'ui/button', 'ui/input', 'ui/label']);
    expect(fetchItem.mock.calls.filter(([slug]) => slug === 'lib/cn')).toHaveLength(1);
  });

  it('dedupes a bare name against the qualified slug the registry answers with', async () => {
    const fetchItem = registry([item('ui/button', ['lib/cn']), item('lib/cn')]);

    const tree = await resolveTree(['button', 'ui/button'], fetchItem);

    expect(tree.map((i) => i.slug)).toEqual(['ui/button', 'lib/cn']);
  });

  it('terminates on cycles', async () => {
    const fetchItem = registry([
      item('ui/a', ['ui/b']),
      item('ui/b', ['ui/c']),
      item('ui/c', ['ui/a']),
    ]);

    const tree = await resolveTree(['ui/a'], fetchItem);

    expect(tree.map((i) => i.slug)).toEqual(['ui/a', 'ui/b', 'ui/c']);
    expect(fetchItem).toHaveBeenCalledTimes(3);
  });

  it('handles an item that lists itself', async () => {
    const fetchItem = registry([item('ui/self', ['ui/self'])]);
    await expect(resolveTree(['ui/self'], fetchItem)).resolves.toHaveLength(1);
  });

  it('propagates registry failures', async () => {
    const fetchItem = registry([item('ui/button', ['lib/missing'])]);
    await expect(resolveTree(['ui/button'], fetchItem)).rejects.toThrow('not found: lib/missing');
  });
});

describe('collectNpmDependencies', () => {
  it('unions npm packages across the tree', () => {
    const deps = collectNpmDependencies([
      item('ui/button', [], ['motion', 'class-variance-authority']),
      item('lib/cn', [], ['clsx', 'tailwind-merge']),
      item('lib/motion', [], ['motion']),
    ]);

    expect(deps).toEqual(['class-variance-authority', 'clsx', 'motion', 'tailwind-merge']);
  });
});
