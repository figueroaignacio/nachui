import { parseCookies, safeNextPath, serializeCookie } from './cookies';

describe('cookies', () => {
  it('parses a cookie header', () => {
    expect(parseCookies('a=1; nachui_studio_session=abc%3D; empty=')).toEqual({
      a: '1',
      nachui_studio_session: 'abc=',
      empty: '',
    });
    expect(parseCookies(undefined)).toEqual({});
  });

  it('serializes an http only, lax cookie', () => {
    expect(serializeCookie('s', 'v', { maxAgeSeconds: 60, secure: true })).toBe(
      's=v; Path=/; Max-Age=60; HttpOnly; SameSite=Lax; Secure',
    );
    expect(serializeCookie('s', '', { maxAgeSeconds: 0, secure: false })).toBe(
      's=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax',
    );
  });

  it.each([
    ['/p/123', '/p/123'],
    ['//evil.com', '/'],
    ['https://evil.com', '/'],
    ['/\\evil.com', '/'],
    [undefined, '/'],
  ])('keeps redirects inside the Studio: %p', (input, expected) => {
    expect(safeNextPath(input)).toBe(expected);
  });
});
