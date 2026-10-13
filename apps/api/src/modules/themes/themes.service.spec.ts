import { BadRequestException, NotFoundException } from '@nestjs/common';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { CN_SOURCE, ThemesService } from './themes.service';

const uiCn = path.resolve(__dirname, '../../../../../packages/ui/src/lib/cn.ts');

describe('ThemesService', () => {
  const service = new ThemesService();

  it('lists every theme stylesheet by name', async () => {
    const themes = await service.getAllThemes();
    expect(themes).toContain('default');
    expect(themes).toEqual([...themes].sort());
    for (const theme of themes) expect(theme).toMatch(/^[a-z0-9-]+$/);
  });

  it('returns a Tailwind v4 config for the mirrored layout', async () => {
    const { config } = await service.getThemeConfig('default');

    expect(config.baseDir).toBe('src');
    expect(config.tailwind).toEqual({ css: '' });
    expect(config.tailwind).not.toHaveProperty('config');
    expect(config.tailwind).not.toHaveProperty('baseColor');
  });

  it('points the legacy aliases at the folders relative imports expect', async () => {
    const { config } = await service.getThemeConfig('default');

    expect(config.aliases).toEqual({ components: '@/components', utils: '@/lib/cn' });
  });

  it('ships the same cn helper the components import', async () => {
    const { utils } = await service.getThemeConfig('default');

    expect(utils).toBe(CN_SOURCE);
    expect(utils.trim()).toBe(readFileSync(uiCn, 'utf8').trim());
  });

  it('returns a fresh config each time', async () => {
    const first = await service.getThemeConfig('default');
    first.config.tailwind.css = 'mutated.css';

    const second = await service.getThemeConfig('default');
    expect(second.config.tailwind.css).toBe('');
  });

  it.each(['../../../package', '..', 'default.css', 'Default', 'a/b', ''])(
    'rejects the theme name %p',
    async (theme) => {
      await expect(service.getThemeConfig(theme)).rejects.toBeInstanceOf(BadRequestException);
    },
  );

  it('answers 404 for a well-formed name that does not exist', async () => {
    await expect(service.getThemeConfig('does-not-exist')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
