import { branchSlug, isUuid, nextUtcMidnight, normalizeBaseDir, utcDay } from './usage';

describe('studio usage helpers', () => {
  it('counts days in UTC', () => {
    const late = new Date('2026-11-10T23:30:00-03:00');
    expect(utcDay(late)).toBe('2026-11-11');
    expect(nextUtcMidnight(late).toISOString()).toBe('2026-11-12T00:00:00.000Z');
  });

  it.each([
    [undefined, 'src'],
    ['src', 'src'],
    ['/app/src/', 'app/src'],
    ['', ''],
    ['../etc', null],
    ['src/../..', null],
    ['src dir', null],
    [42, null],
  ])('normalizes the base folder %p', (input, expected) => {
    expect(normalizeBaseDir(input)).toBe(expected);
  });

  it('makes branch names from project names', () => {
    expect(branchSlug('Página de facturación')).toBe('pagina-de-facturacion');
    expect(branchSlug('!!!')).toBe('screen');
  });

  it('checks ids before they reach the database', () => {
    expect(isUuid('7f2c1c0e-1b2a-4c3d-9e8f-001122334455')).toBe(true);
    expect(isUuid("1' or '1'='1")).toBe(false);
  });
});
