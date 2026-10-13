import { validateEnv } from './env';

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
});
