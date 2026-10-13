import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { candidatePaths, installPath, InvalidSlugError, resolveInside, splitSlug } from './layout';

describe('installPath', () => {
  it.each([
    ['ui/button', 'src/components/button.tsx'],
    ['layout/stack', 'src/layout/stack.tsx'],
    ['ai/prompt-input', 'src/ai/prompt-input.tsx'],
    ['hybrids/chat', 'src/hybrids/chat.tsx'],
    ['icons/arrow-right', 'src/icons/arrow-right.tsx'],
    ['lib/cn', 'src/lib/cn.ts'],
    ['lib/use-controllable-state', 'src/lib/use-controllable-state.ts'],
    ['hooks/use-local-storage', 'src/hooks/use-local-storage.ts'],
  ])('mirrors the catalog for %s', (slug, expected) => {
    expect(installPath({ slug }, 'src')).toBe(expected);
  });

  it('makes relative imports between installed files resolve', () => {
    const button = installPath({ slug: 'ui/button' }, 'src');
    const cn = installPath({ slug: 'lib/cn' }, 'src');
    const chat = installPath({ slug: 'hybrids/chat' }, 'src');

    expect(path.posix.join(path.posix.dirname(button), '../lib/cn.ts')).toBe(cn);
    expect(path.posix.join(path.posix.dirname(chat), '../components/button.tsx')).toBe(button);
  });

  it('honours baseDir', () => {
    expect(installPath({ slug: 'ui/button' }, 'app/ui')).toBe('app/ui/components/button.tsx');
    expect(installPath({ slug: 'lib/cn' }, '.')).toBe('lib/cn.ts');
  });

  it('uses the type of rows that predate qualified slugs', () => {
    expect(installPath({ slug: 'stack', type: 'layout' }, 'src')).toBe('src/layout/stack.tsx');
    expect(installPath({ slug: 'button', type: null }, 'src')).toBe('src/components/button.tsx');
  });

  it('refuses slugs that could escape the family folder', () => {
    expect(() => installPath({ slug: '../button' }, 'src')).toThrow(InvalidSlugError);
    expect(() => installPath({ slug: 'ui/../../x' }, 'src')).toThrow(InvalidSlugError);
    expect(() => installPath({ slug: 'button', type: '../etc' }, 'src')).toThrow(InvalidSlugError);
  });
});

describe('splitSlug', () => {
  it('splits qualified and bare slugs', () => {
    expect(splitSlug('ui/button')).toEqual({ family: 'ui', name: 'button' });
    expect(splitSlug('Button')).toEqual({ family: null, name: 'button' });
  });
});

describe('candidatePaths', () => {
  it('has one path for a qualified slug', () => {
    expect(candidatePaths('ui/button', 'src')).toEqual(['src/components/button.tsx']);
  });

  it('checks every family for a bare name', () => {
    const paths = candidatePaths('tool', 'src');
    expect(paths).toContain('src/components/tool.tsx');
    expect(paths).toContain('src/ai/tool.tsx');
    expect(paths).toContain('src/lib/tool.ts');
  });
});

describe('resolveInside', () => {
  it('resolves inside the project and refuses to leave it', () => {
    const cwd = path.resolve('/project');
    expect(resolveInside(cwd, 'src/lib/cn.ts')).toBe(path.join(cwd, 'src/lib/cn.ts'));
    expect(() => resolveInside(cwd, '../outside.ts')).toThrow(InvalidSlugError);
    expect(() => resolveInside(cwd, '/etc/passwd')).toThrow(InvalidSlugError);
  });
});
