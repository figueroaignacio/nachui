import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { ConfigError, normalizeBaseDir, parseConfig, readConfig } from './config';

describe('readConfig', () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nachui-config-'));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  const write = (contents: string) => fs.writeFileSync(path.join(dir, 'nachui.json'), contents);

  it('returns null when there is no nachui.json', () => {
    expect(readConfig(dir)).toBeNull();
  });

  it('reads a current config', () => {
    write(JSON.stringify({ style: 'oklch', baseDir: 'app', tailwind: { css: 'app/globals.css' } }));
    expect(readConfig(dir)).toMatchObject({ baseDir: 'app', tailwind: { css: 'app/globals.css' } });
  });

  it('reads a nachui 2.0.0 config, defaulting baseDir to src', () => {
    write(
      JSON.stringify({
        $schema: 'https://nachui.vercel.app/schema.json',
        style: 'oklch',
        tailwind: { config: 'tailwind.config.ts', baseColor: 'zinc', css: 'src/app/globals.css' },
        aliases: { components: '@/components/ui', utils: '@/lib/utils' },
      }),
    );

    const config = readConfig(dir);
    expect(config?.baseDir).toBe('src');
    expect(config?.tailwind?.css).toBe('src/app/globals.css');
  });

  it('reports broken JSON clearly', () => {
    write('{ "baseDir": ');
    expect(() => readConfig(dir)).toThrow(ConfigError);
    expect(() => readConfig(dir)).toThrow(/not valid JSON/);
  });
});

describe('parseConfig', () => {
  it('defaults an empty object', () => {
    expect(parseConfig({})).toEqual({ baseDir: 'src' });
  });

  it('rejects wrong types', () => {
    expect(() => parseConfig({ baseDir: 42 })).toThrow(/baseDir/);
    expect(() => parseConfig([])).toThrow(ConfigError);
  });

  it('keeps unknown keys', () => {
    expect(parseConfig({ extra: true })).toMatchObject({ extra: true });
  });
});

describe('normalizeBaseDir', () => {
  it.each([
    ['src', 'src'],
    ['./src/', 'src'],
    ['', '.'],
    ['.', '.'],
    ['app\\ui', 'app/ui'],
  ])('normalizes %p to %p', (input, expected) => {
    expect(normalizeBaseDir(input)).toBe(expected);
  });

  it.each(['../outside', '/abs/path', 'C:/Users', 'src/../../x'])('rejects %p', (input) => {
    expect(() => normalizeBaseDir(input)).toThrow(ConfigError);
  });
});
