import * as p from '@clack/prompts';
import kleur from 'kleur';

import { ApiError } from './api.js';
import { ConfigError } from './config.js';
import { InvalidSlugError } from './layout.js';
import { CancelledError } from './prompts.js';

/** Prints a failure the user can act on and sets a non-zero exit code. */
export function reportError(error: unknown): void {
  if (error instanceof CancelledError) {
    p.cancel('Operation cancelled.');
    process.exitCode = 1;
    return;
  }

  const known =
    error instanceof ApiError || error instanceof ConfigError || error instanceof InvalidSlugError;
  const message = error instanceof Error ? error.message : String(error);

  p.log.error(kleur.red(known ? message : `Unexpected error: ${message}`));
  process.exitCode = 1;
}
