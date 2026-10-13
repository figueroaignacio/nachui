/**
 * Fails the build when the en and es message files stop having the same keys.
 * A key that only one locale has either renders as a raw key path in the other
 * language or is dead copy that nobody reads.
 */

import { readdirSync, readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { findLocaleKeyMismatches } from './lib/locale-parity.mjs';

const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES_ROOT = join(APP_ROOT, 'src/locales');
const REFERENCE = 'en';

function readLocale(locale) {
  const dir = join(LOCALES_ROOT, locale);
  const messages = {};
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.json')) continue;
    messages[file.replace(/\.json$/, '')] = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  }
  return messages;
}

const locales = readdirSync(LOCALES_ROOT, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name);

const problems = findLocaleKeyMismatches(
  Object.fromEntries(locales.map((locale) => [locale, readLocale(locale)])),
  REFERENCE,
);

if (problems.length > 0) {
  console.error('check-locales FAILED\n');
  for (const problem of problems) console.error(`  ${problem}`);
  process.exit(1);
}

console.log(`check-locales: ${locales.join(', ')} share the same message keys`);
