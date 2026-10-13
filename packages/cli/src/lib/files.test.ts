import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { planFiles } from './files';
import { writePlannedFiles } from './prompts';

const item = (slug: string, code: string) => ({
  name: slug,
  slug,
  code,
  dependencies: [],
  registryDependencies: [],
});

describe('planFiles and writePlannedFiles', () => {
  let cwd: string;

  beforeEach(() => {
    cwd = fs.mkdtempSync(path.join(os.tmpdir(), 'nachui-files-'));
  });

  afterEach(() => {
    fs.rmSync(cwd, { recursive: true, force: true });
  });

  const put = (file: string, contents: string) => {
    fs.mkdirSync(path.dirname(path.join(cwd, file)), { recursive: true });
    fs.writeFileSync(path.join(cwd, file), contents);
  };
  const read = (file: string) => fs.readFileSync(path.join(cwd, file), 'utf8');

  it('classifies new, identical and conflicting files', () => {
    put('src/lib/cn.ts', 'cn\r\n');
    put('src/components/button.tsx', 'my button');

    const plan = planFiles(
      [item('ui/button', 'button'), item('lib/cn', 'cn\n'), item('ui/dialog', 'dialog')],
      cwd,
      'src',
    );

    expect(plan.map((f) => [f.relativePath, f.state])).toEqual([
      ['src/components/button.tsx', 'conflict'],
      ['src/lib/cn.ts', 'unchanged'],
      ['src/components/dialog.tsx', 'create'],
    ]);
  });

  it('keeps files that differ under --yes', async () => {
    put('src/components/button.tsx', 'my button');
    const plan = planFiles([item('ui/button', 'button'), item('lib/cn', 'cn')], cwd, 'src');

    const summary = await writePlannedFiles(plan, { yes: true });

    expect(summary).toEqual({
      written: ['src/lib/cn.ts'],
      unchanged: [],
      skipped: ['src/components/button.tsx'],
    });
    expect(read('src/components/button.tsx')).toBe('my button');
    expect(read('src/lib/cn.ts')).toBe('cn');
  });

  it('replaces files that differ under --overwrite', async () => {
    put('src/components/button.tsx', 'my button');
    const plan = planFiles([item('ui/button', 'button')], cwd, 'src');

    const summary = await writePlannedFiles(plan, { overwrite: true });

    expect(summary.written).toEqual(['src/components/button.tsx']);
    expect(read('src/components/button.tsx')).toBe('button');
  });
});
