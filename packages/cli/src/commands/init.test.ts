import { describe, expect, it } from 'vitest';
import { chooseTheme } from './init';

describe('chooseTheme', () => {
  const themes = ['default', 'google', 'nachui'];

  it('uses the requested theme without asking', async () => {
    await expect(chooseTheme(themes, false, 'nachui')).resolves.toBe('nachui');
  });

  it('names the available themes when the requested one is missing', async () => {
    await expect(chooseTheme(themes, true, 'neon')).rejects.toThrow(
      'Theme "neon" does not exist. Available themes: default, google, nachui.',
    );
  });

  it('falls back to default with --yes', async () => {
    await expect(chooseTheme(themes, true)).resolves.toBe('default');
  });
});
