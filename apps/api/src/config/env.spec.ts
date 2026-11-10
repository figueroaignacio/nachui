import { studioConfig, validateEnv } from './env';

const valid = {
  POSTGRES_URL: 'postgres://user:pass@localhost:5432/nachui',
  GOOGLE_GENERATIVE_AI_API_KEY: 'test-key',
  FRONTEND_URLS: 'https://nachui.dev, https://www.nachui.dev',
};

describe('validateEnv', () => {
  it('parses a complete env and applies defaults', () => {
    const env = validateEnv(valid);

    expect(env.PORT).toBe(3001);
    expect(env.NODE_ENV).toBe('development');
    expect(env.FRONTEND_URLS).toEqual(['https://nachui.dev', 'https://www.nachui.dev']);
  });

  it('coerces PORT from a string', () => {
    expect(validateEnv({ ...valid, PORT: '4000' }).PORT).toBe(4000);
  });

  it.each(['POSTGRES_URL', 'GOOGLE_GENERATIVE_AI_API_KEY', 'FRONTEND_URLS'] as const)(
    'fails when %s is missing',
    (key) => {
      const env: Record<string, unknown> = { ...valid };
      delete env[key];

      expect(() => validateEnv(env)).toThrow(key);
    },
  );

  it('rejects malformed frontend URLs', () => {
    expect(() => validateEnv({ ...valid, FRONTEND_URLS: 'nachui.dev' })).toThrow('FRONTEND_URLS');
    expect(() => validateEnv({ ...valid, FRONTEND_URLS: ' , ' })).toThrow('FRONTEND_URLS');
  });

  it('leaves the Studio off when none of its variables are set', () => {
    const env = validateEnv(valid);
    expect(studioConfig(env)).toBeNull();
    expect(env.STUDIO_DAILY_LIMIT).toBe(20);
  });

  it('builds the Studio config when all of its variables are set', () => {
    const env = validateEnv({
      ...valid,
      STUDIO_URL: 'http://localhost:3002',
      GITHUB_CLIENT_ID: 'id',
      GITHUB_CLIENT_SECRET: 'secret',
      STUDIO_SECRET: 'x'.repeat(32),
      STUDIO_DAILY_LIMIT: '5',
    });
    expect(studioConfig(env)).toEqual({
      apiUrl: 'http://localhost:3001',
      studioUrl: 'http://localhost:3002',
      githubClientId: 'id',
      githubClientSecret: 'secret',
      secret: 'x'.repeat(32),
      dailyLimit: 5,
    });
  });

  it('names the missing Studio variables when only some are set', () => {
    expect(() => validateEnv({ ...valid, STUDIO_URL: 'http://localhost:3002' })).toThrow(
      'GITHUB_CLIENT_ID',
    );
    expect(() =>
      validateEnv({
        ...valid,
        STUDIO_URL: 'http://localhost:3002',
        GITHUB_CLIENT_ID: 'id',
        GITHUB_CLIENT_SECRET: 'secret',
        STUDIO_SECRET: 'short',
      }),
    ).toThrow('STUDIO_SECRET');
  });
});
