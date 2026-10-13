import type { namespaces } from './namespaces';
import type { routing } from './routing';

/**
 * Arrays in the messages (navigation, FAQ entries, hero actions) are only ever
 * read whole through `t.raw`. next-intl types `raw` keys as leaf messages and
 * would otherwise walk every array method as a key path, so arrays are typed
 * as leaves here.
 */
type ArraysAsLeaves<T> = T extends readonly unknown[]
  ? string
  : T extends object
    ? { [K in keyof T]: ArraysAsLeaves<T[K]> }
    : T;

/**
 * Types every `useTranslations` / `getTranslations` call against the English
 * messages, so a wrong key fails `check-types`. The es files are held to the
 * same keys by `scripts/check-locales.mjs`.
 */
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: ArraysAsLeaves<Awaited<ReturnType<(typeof namespaces)['en']>>>;
  }
}
