import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { existsSync } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';

const THEMES_DIR = path.resolve(__dirname, 'css');

/** Theme names are file stems, so anything else could escape the css directory. */
export const THEME_NAME_PATTERN = /^[a-z0-9-]+$/;

/**
 * The `cn` helper, identical to `packages/ui/src/lib/cn.ts`. The CLI writes it
 * to `<baseDir>/lib/cn.ts`, which is where every component's `../lib/cn`
 * import resolves.
 */
export const CN_SOURCE = `import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
`;

/**
 * The starting `nachui.json`. Tailwind is v4, so there is no config file and
 * no base color: tokens are CSS variables in the theme stylesheet, and the CLI
 * fills `tailwind.css` with the stylesheet it injected them into.
 *
 * Components are installed under `baseDir` mirroring the catalog
 * (`components/`, `layout/`, `ai/`, `hybrids/`, `icons/`, `lib/`, `hooks/`),
 * so their relative imports resolve unchanged.
 *
 * `aliases` is only read by nachui 2.0.0 and older, which write components to
 * `aliases.components` and `cn` to `aliases.utils` (with `@/` read as `src/`).
 * Pointing them at the new layout makes those versions land files where
 * `../lib/cn` resolves too.
 */
export const NACHUI_CONFIG = {
  $schema: 'https://nachui.vercel.app/schema.json',
  style: 'oklch',
  baseDir: 'src',
  tailwind: {
    css: '',
  },
  aliases: {
    components: '@/components',
    utils: '@/lib/cn',
  },
};

@Injectable()
export class ThemesService {
  async getThemeConfig(theme: string = 'default') {
    if (!THEME_NAME_PATTERN.test(theme)) {
      throw new BadRequestException(`Theme "${theme}" is not a valid theme name`);
    }

    const themePath = path.join(THEMES_DIR, `${theme}.css`);

    if (!existsSync(themePath)) {
      throw new NotFoundException(`Theme "${theme}" not found`);
    }

    const css = await fs.readFile(themePath, 'utf8');

    return {
      css,
      config: structuredClone(NACHUI_CONFIG),
      utils: CN_SOURCE,
    };
  }

  async getAllThemes() {
    const files = await fs.readdir(THEMES_DIR);
    return files
      .filter((file) => file.endsWith('.css'))
      .map((file) => file.slice(0, -'.css'.length))
      .filter((name) => THEME_NAME_PATTERN.test(name))
      .sort();
  }
}
