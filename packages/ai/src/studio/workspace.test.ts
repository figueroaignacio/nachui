import { describe, expect, it } from 'vitest';
import { PROJECT_LIMITS } from './paths.js';
import { StudioWorkspace } from './workspace.js';

describe('StudioWorkspace', () => {
  it('writes, reads and tracks changes', () => {
    const workspace = new StudioWorkspace({ 'screens/a.tsx': 'old' });
    expect(workspace.changed).toBe(false);

    expect(workspace.write('screens/a.tsx', 'old')).toMatchObject({ ok: true, created: false });
    expect(workspace.changed).toBe(false);

    expect(workspace.write('screens/b.tsx', 'line 1\nline 2')).toEqual({
      ok: true,
      path: 'screens/b.tsx',
      lines: 2,
      created: true,
    });
    expect(workspace.changed).toBe(true);
    expect(workspace.read('./screens/b.tsx')).toBe('line 1\nline 2');
    expect(workspace.list()).toEqual(['screens/a.tsx', 'screens/b.tsx']);
  });

  it('refuses paths outside screens and oversized files', () => {
    const workspace = new StudioWorkspace();
    expect(workspace.write('components/card.tsx', 'x').ok).toBe(false);
    expect(workspace.write('screens/a.tsx', 'x'.repeat(PROJECT_LIMITS.maxFileChars + 1)).ok).toBe(
      false,
    );
  });

  it('caps the number of files', () => {
    const initial = Object.fromEntries(
      Array.from({ length: PROJECT_LIMITS.maxFiles }, (_, index) => [`screens/f${index}.tsx`, 'x']),
    );
    const workspace = new StudioWorkspace(initial);
    expect(workspace.write('screens/one-more.tsx', 'x').ok).toBe(false);
    expect(workspace.write('screens/f0.tsx', 'y').ok).toBe(true);
  });

  it('removes files and snapshots in order', () => {
    const workspace = new StudioWorkspace({ 'screens/b.tsx': 'b', 'screens/a.tsx': 'a' });
    expect(workspace.remove('screens/b.tsx')).toBe(true);
    expect(workspace.remove('screens/missing.tsx')).toBe(false);
    expect(workspace.snapshot()).toEqual({ 'screens/a.tsx': 'a' });
  });
});
