import { describe, expect, it } from 'vitest';

import { findLocaleKeyMismatches, flattenKeys } from './locale-parity.mjs';

describe('flattenKeys', () => {
  it('lists leaf paths, addressing array items by index', () => {
    expect(
      flattenKeys({ ui: { title: 'x', items: [{ href: '/' }, { href: '/a' }] }, empty: {} }),
    ).toEqual(['ui.title', 'ui.items.0.href', 'ui.items.1.href', 'empty']);
  });
});

describe('findLocaleKeyMismatches', () => {
  it('passes when every locale has the reference keys', () => {
    const messages = {
      en: { docs: { title: 'Docs', nav: [{ id: 'ui' }] } },
      es: { docs: { title: 'Documentación', nav: [{ id: 'ui' }] } },
    };

    expect(findLocaleKeyMismatches(messages, 'en')).toEqual([]);
  });

  it('reports keys missing from or extra in another locale', () => {
    const messages = {
      en: { home: { title: 'Hi', cta: 'Go' } },
      es: { home: { title: 'Hola', github: 'GitHub' } },
    };

    expect(findLocaleKeyMismatches(messages, 'en')).toEqual([
      '[es] missing "home.cta" (present in en)',
      '[es] has extra "home.github" (not in en)',
    ]);
  });

  it('reports arrays of different lengths', () => {
    const messages = { en: { faq: [{ q: 'a' }, { q: 'b' }] }, es: { faq: [{ q: 'a' }] } };

    expect(findLocaleKeyMismatches(messages, 'en')).toEqual([
      '[es] missing "faq.1.q" (present in en)',
    ]);
  });

  it('fails loudly when the reference locale is absent', () => {
    expect(findLocaleKeyMismatches({ es: {} }, 'en')).toEqual(['missing reference locale "en"']);
  });
});
