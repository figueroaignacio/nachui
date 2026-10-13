import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  AmbiguousComponentError,
  api,
  ApiError,
  apiUrl,
  DEFAULT_API_URL,
  NotFoundError,
} from './api';

describe('apiUrl', () => {
  it('defaults to the hosted registry', () => {
    expect(apiUrl({})).toBe(DEFAULT_API_URL);
  });

  it('honours NACHUI_API_URL and trims trailing slashes', () => {
    expect(apiUrl({ NACHUI_API_URL: 'http://localhost:3001/api/v1/' })).toBe(
      'http://localhost:3001/api/v1',
    );
  });

  it('rejects invalid overrides', () => {
    expect(() => apiUrl({ NACHUI_API_URL: 'not a url' })).toThrow(ApiError);
    expect(() => apiUrl({ NACHUI_API_URL: 'file:///etc/passwd' })).toThrow(/http or https/);
  });
});

describe('api requests', () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
    vi.stubEnv('NACHUI_API_URL', 'http://registry.test/api/v1');
  });

  afterEach(() => {
    fetchMock.mockReset();
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } });

  it('sends no API key and always sets a timeout', async () => {
    fetchMock.mockResolvedValueOnce(json(['default']));

    await api.getThemes();

    const [url, init] = fetchMock.mock.calls[0] ?? [];
    expect(url).toBe('http://registry.test/api/v1/themes');
    expect(init?.headers).not.toHaveProperty('x-api-key');
    expect(init?.signal).toBeInstanceOf(AbortSignal);
  });

  it('defaults missing registryDependencies for older APIs', async () => {
    fetchMock.mockResolvedValueOnce(
      json({ name: 'button', slug: 'ui/button', code: 'x', dependencies: ['motion'] }),
    );

    await expect(api.getComponent('ui/button')).resolves.toMatchObject({
      dependencies: ['motion'],
      registryDependencies: [],
    });
    expect(fetchMock.mock.calls[0]?.[0]).toBe('http://registry.test/api/v1/registry/ui/button');
  });

  it('maps 409 and 404 to typed errors with the server message', async () => {
    fetchMock.mockResolvedValueOnce(json({ message: 'tool is in ai and ui' }, 409));
    await expect(api.getComponent('tool')).rejects.toThrow(AmbiguousComponentError);

    fetchMock.mockResolvedValueOnce(json({ message: 'nope' }, 404));
    await expect(api.getComponent('nope')).rejects.toThrow(NotFoundError);
  });

  it('turns a timeout into a clear error', async () => {
    fetchMock.mockRejectedValueOnce(new DOMException('timed out', 'TimeoutError'));
    await expect(api.getThemes()).rejects.toThrow(/did not answer within 15s/);
  });

  it('turns network failures into a clear error', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));
    await expect(api.getThemes()).rejects.toThrow(
      'Could not reach the NachUI registry at http://registry.test/api/v1: fetch failed',
    );
  });

  it('rejects malformed responses', async () => {
    fetchMock.mockResolvedValueOnce(json({ slug: 'ui/button' }));
    await expect(api.getComponent('ui/button')).rejects.toThrow(/unexpected response/);
  });
});
