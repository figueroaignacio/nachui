import * as p from '@clack/prompts';
import kleur from 'kleur';
import fs from 'node:fs';
import path from 'node:path';

import { api } from '../lib/api.js';
import { CONFIG_FILE, readConfig } from '../lib/config.js';
import { reportError } from '../lib/errors.js';
import { fileState, writeFileSafely } from '../lib/files.js';
import { installPath, resolveInside } from '../lib/layout.js';
import { CancelledError, confirmOrCancel, ensurePackages } from '../lib/prompts.js';

export interface InitOptions {
  yes?: boolean;
}

const TOKEN_MARKER = '/* NachUI Tokens */';
const TAILWIND_IMPORT = '@import "tailwindcss";';
const CN_DEPENDENCIES = ['clsx', 'tailwind-merge'];

function detectStylesheet(cwd: string): string {
  const exists = (file: string) => fs.existsSync(path.join(cwd, file));
  const hasSrc = exists('src');
  const isNext = ['next.config.mjs', 'next.config.js', 'next.config.ts'].some(exists);

  const candidates = isNext
    ? ['src/app/globals.css', 'app/globals.css', 'src/styles/globals.css', 'styles/globals.css']
    : ['src/index.css', 'src/styles.css', 'src/main.css', 'app/app.css', 'index.css'];

  const fallback = isNext
    ? hasSrc
      ? 'src/app/globals.css'
      : 'app/globals.css'
    : hasSrc
      ? 'src/index.css'
      : 'index.css';

  return candidates.find(exists) ?? fallback;
}

async function chooseTheme(themes: string[], yes: boolean | undefined): Promise<string> {
  const fallback = themes.includes('default') ? 'default' : themes[0];
  if (!fallback) throw new Error('The registry has no themes.');
  if (yes) return fallback;

  const selected = await p.select({
    message: 'Select a theme for your project:',
    options: themes.map((t) => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) })),
    initialValue: fallback,
  });
  if (p.isCancel(selected)) throw new CancelledError();
  return selected;
}

/**
 * Puts the theme tokens into the stylesheet. A second run replaces the
 * previous tokens after the marker. Existing styles are only discarded when
 * the user says so; the default keeps them and appends the tokens.
 */
async function writeTokens(cwd: string, cssPath: string, css: string, yes: boolean | undefined) {
  const absolute = resolveInside(cwd, cssPath);
  const tokens = css
    .replace(/@import\s+['"]tailwindcss['"];?\s*\n/g, '')
    .replace(/@source\s+['"][^'"]+['"];?\s*\n/g, '');
  const block = `${TOKEN_MARKER}\n${tokens.trim()}\n`;

  if (!fs.existsSync(absolute)) {
    writeFileSafely(absolute, `${TAILWIND_IMPORT}\n\n${block}`);
    return 'created';
  }

  const content = fs.readFileSync(absolute, 'utf8');
  const hasImport = /@import\s+['"]tailwindcss['"]/.test(content);

  if (content.includes(TOKEN_MARKER)) {
    const before = content.slice(0, content.indexOf(TOKEN_MARKER)).trim();
    const header = hasImport ? before : `${TAILWIND_IMPORT}\n\n${before}`.trim();
    fs.writeFileSync(absolute, `${header}\n\n${block}`);
    return 'replaced the previous tokens in';
  }

  const wipe =
    !yes &&
    (await confirmOrCancel(
      `${cssPath} already has styles. Replace them with the NachUI tokens? Choosing no keeps them and appends the tokens.`,
      false,
    ));

  if (wipe) {
    fs.writeFileSync(absolute, `${TAILWIND_IMPORT}\n\n${block}`);
    return 'replaced the contents of';
  }

  const prefix = hasImport ? '' : `${TAILWIND_IMPORT}\n\n`;
  fs.writeFileSync(absolute, `${prefix}${content.trim()}\n\n${block}`);
  return 'appended the tokens to';
}

export async function initCommand(options: InitOptions = {}) {
  const cwd = process.cwd();
  const s = p.spinner();

  try {
    const existing = readConfig(cwd);

    s.start('Fetching available themes...');
    let themes: string[];
    try {
      themes = await api.getThemes();
    } finally {
      s.stop('Themes loaded.');
    }

    const theme = await chooseTheme(themes, options.yes);

    s.start(`Downloading the ${kleur.cyan(theme)} theme...`);
    let assets;
    try {
      assets = await api.getTheme(theme);
    } finally {
      s.stop(`Theme ${theme} ready.`);
    }

    const cssPath = existing?.tailwind?.css || detectStylesheet(cwd);
    const baseDir = existing?.baseDir ?? (fs.existsSync(path.join(cwd, 'src')) ? 'src' : '.');
    const apiTailwind = (assets.config.tailwind ?? {}) as Record<string, unknown>;

    const config = {
      ...existing,
      ...assets.config,
      baseDir,
      tailwind: { ...existing?.tailwind, ...apiTailwind, css: cssPath },
    };
    fs.writeFileSync(path.join(cwd, CONFIG_FILE), `${JSON.stringify(config, null, 2)}\n`);

    const cssAction = await writeTokens(cwd, cssPath, assets.css, options.yes);

    const cnPath = installPath({ slug: 'lib/cn' }, baseDir);
    const cnAbsolute = resolveInside(cwd, cnPath);
    const cnState = fileState(cnAbsolute, assets.utils);
    let cnNote = `${cnPath} is up to date`;

    if (cnState === 'create') {
      writeFileSafely(cnAbsolute, assets.utils);
      cnNote = `wrote ${cnPath}`;
    } else if (cnState === 'conflict') {
      const replace =
        !options.yes &&
        (await confirmOrCancel(`${cnPath} already exists and differs. Overwrite it?`, false));
      if (replace) writeFileSafely(cnAbsolute, assets.utils);
      cnNote = replace ? `overwrote ${cnPath}` : `kept your ${cnPath}`;
    }

    await ensurePackages(CN_DEPENDENCIES, { yes: options.yes, cwd });

    p.note(
      [
        `Theme: ${theme}`,
        `Styles: ${cssAction} ${cssPath}`,
        `Helpers: ${cnNote}`,
        `Components go under ${baseDir === '.' ? 'the project root' : `${baseDir}/`} (set baseDir in ${CONFIG_FILE} to change it)`,
      ].join('\n'),
      'Setup complete',
    );
    p.outro(`${kleur.bgGreen().black(' NachUI ')} Ready!`);
  } catch (error) {
    s.stop();
    reportError(error);
  }
}
