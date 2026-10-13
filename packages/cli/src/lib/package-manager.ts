import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export function detectPackageManager(cwd: string = process.cwd()): PackageManager {
  const has = (file: string) => fs.existsSync(path.join(cwd, file));

  if (has('pnpm-lock.yaml')) return 'pnpm';
  if (has('yarn.lock')) return 'yarn';
  if (has('bun.lock') || has('bun.lockb')) return 'bun';
  return 'npm';
}

const PACKAGE_NAME = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/;
const PACKAGE_VERSION = /^[\^~]?[a-zA-Z0-9][a-zA-Z0-9.*+-]*$/;

/** `motion@^12` gives `{ name: 'motion', version: '^12' }`. */
export function splitPackageSpec(spec: string): { name: string; version: string | null } {
  const at = spec.indexOf('@', 1);
  return at === -1
    ? { name: spec, version: null }
    : { name: spec.slice(0, at), version: spec.slice(at + 1) };
}

/**
 * Whether a dependency name from the registry is a plain npm package, with an
 * optional version or tag. Anything else (shell syntax, paths, URLs, git
 * specs) is refused before it reaches a package manager.
 */
export function isValidPackageSpec(spec: string): boolean {
  if (typeof spec !== 'string' || spec.length === 0) return false;

  const { name, version } = splitPackageSpec(spec);
  if (name.length > 214 || !PACKAGE_NAME.test(name)) return false;
  if (version !== null && !PACKAGE_VERSION.test(version)) return false;

  return true;
}

export function partitionPackageSpecs(specs: string[]): { valid: string[]; invalid: string[] } {
  const valid: string[] = [];
  const invalid: string[] = [];
  for (const spec of specs) (isValidPackageSpec(spec) ? valid : invalid).push(spec);
  return { valid, invalid };
}

/** Packages not yet in the project's dependencies or devDependencies. */
export function missingPackages(specs: string[], cwd: string = process.cwd()): string[] {
  const pkgPath = path.join(cwd, 'package.json');
  if (!fs.existsSync(pkgPath)) return specs;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8')) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
    peerDependencies?: Record<string, string>;
  };
  const installed = { ...pkg.peerDependencies, ...pkg.devDependencies, ...pkg.dependencies };

  return specs.filter((spec) => !(splitPackageSpec(spec).name in installed));
}

export function getInstallArgs(
  agent: PackageManager,
  dependencies: string[],
): { command: string; args: string[] } {
  if (agent === 'npm') return { command: 'npm', args: ['install', ...dependencies] };
  return { command: agent, args: ['add', ...dependencies] };
}

/**
 * Runs the package manager without a shell, so a package name can never be
 * read as a command. Windows needs a shell to start `.cmd` shims; the names
 * are validated first, so they hold no shell syntax there either.
 */
export function installPackages(dependencies: string[], cwd: string = process.cwd()): void {
  const invalid = dependencies.filter((dep) => !isValidPackageSpec(dep));
  if (invalid.length > 0) {
    throw new Error(`Refusing to install invalid package names: ${invalid.join(', ')}`);
  }

  const { command, args } = getInstallArgs(detectPackageManager(cwd), dependencies);
  execFileSync(command, args, {
    cwd,
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
}
