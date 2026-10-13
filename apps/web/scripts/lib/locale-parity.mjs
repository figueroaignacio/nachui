/**
 * Pure helpers for check-locales.mjs, kept apart so they can be unit tested
 * without touching the file system.
 */

/** Every leaf path in a messages object. Array items are addressed by index. */
export function flattenKeys(value, prefix = '') {
  if (Array.isArray(value)) {
    if (value.length === 0) return [prefix];
    return value.flatMap((item, index) => flattenKeys(item, prefix ? `${prefix}.${index}` : `${index}`));
  }
  if (value !== null && typeof value === 'object') {
    const entries = Object.entries(value);
    if (entries.length === 0) return [prefix];
    return entries.flatMap(([key, child]) => flattenKeys(child, prefix ? `${prefix}.${key}` : key));
  }
  return [prefix];
}

/**
 * Compares the key sets of each locale against the reference locale and
 * returns one readable line per key that only one side has.
 *
 * @param {Record<string, Record<string, unknown>>} messagesByLocale locale -> namespace -> messages
 * @param {string} reference the locale every other locale is compared against
 */
export function findLocaleKeyMismatches(messagesByLocale, reference) {
  const problems = [];
  const referenceMessages = messagesByLocale[reference];
  if (!referenceMessages) return [`missing reference locale "${reference}"`];

  const referenceKeys = new Set(flattenKeys(referenceMessages));

  for (const [locale, messages] of Object.entries(messagesByLocale)) {
    if (locale === reference) continue;
    const keys = new Set(flattenKeys(messages));
    for (const key of referenceKeys) {
      if (!keys.has(key)) problems.push(`[${locale}] missing "${key}" (present in ${reference})`);
    }
    for (const key of keys) {
      if (!referenceKeys.has(key)) problems.push(`[${locale}] has extra "${key}" (not in ${reference})`);
    }
  }

  return problems;
}
