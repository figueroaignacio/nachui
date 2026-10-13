import { describe, expect, it } from 'vitest';
import { SITE_URL } from './constants';
import { buildAlternates, getAbsoluteUrl, getAssetUrl } from './domains';

describe('buildAlternates', () => {
  it('links every locale plus x-default to the same path', () => {
    expect(buildAlternates('/docs/installation')).toEqual({
      en: `${SITE_URL}/en/docs/installation`,
      es: `${SITE_URL}/es/docs/installation`,
      'x-default': `${SITE_URL}/en/docs/installation`,
    });
  });

  it('normalises missing and trailing slashes', () => {
    expect(buildAlternates('docs/')).toEqual(buildAlternates('/docs'));
    expect(buildAlternates().en).toBe(`${SITE_URL}/en/`);
  });
});

describe('getAbsoluteUrl and getAssetUrl', () => {
  it('puts pages under the locale and assets at the root', () => {
    expect(getAbsoluteUrl('es', '/bricks')).toBe(`${SITE_URL}/es/bricks`);
    expect(getAssetUrl('api/og/docs')).toBe(`${SITE_URL}/api/og/docs`);
  });
});
