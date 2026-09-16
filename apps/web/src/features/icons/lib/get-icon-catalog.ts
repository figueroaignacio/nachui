import { ICON_REGISTRY } from '@repo/ui/registry';
import fs from 'fs';
import path from 'path';
import { ICON_CATALOG, iconComponentName, type IconEntry } from './icons';

export type CatalogIcon = IconEntry & {
  componentName: string;
  jsx: string;
  svg: string;
};

/**
 * Turns the JSX of an icon file into a plain SVG. The icon template is fixed
 * (see docs/plans/icons-catalog.md), so a handful of literal replacements is
 * enough and there is no need to render on the server.
 */
export function toSvg(code: string): string {
  const start = code.indexOf('<svg');
  const end = code.indexOf('</svg>');
  if (start === -1 || end === -1) return '';

  const raw = code
    .slice(start, end + '</svg>'.length)
    .replace('width={size}', 'width="24"')
    .replace('height={size}', 'height="24"')
    .replace('strokeWidth={strokeWidth}', 'stroke-width="1.5"')
    .replace('strokeLinecap', 'stroke-linecap')
    .replace('strokeLinejoin', 'stroke-linejoin')
    .replace(/\n\s*aria-hidden="true"/, '')
    .replace(/\n\s*\{\.\.\.props\}/, '');

  const openEnd = raw.indexOf('>');
  const openTag = raw
    .slice(0, openEnd + 1)
    .replace(/\s+/g, ' ')
    .replace(' >', '>');
  const inner = raw.slice(openEnd + 1, raw.lastIndexOf('</svg>'));
  const children = inner
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `  ${line}`)
    .join('\n');

  return `${openTag}\n${children}\n</svg>`;
}

/**
 * Reads every icon source and joins it with its catalog metadata. Throws when
 * the catalog and packages/ui/src/icons disagree, so a missing or stale entry
 * fails the build instead of silently hiding an icon.
 */
export async function getIconCatalog(): Promise<CatalogIcon[]> {
  const registryNames: string[] = Object.keys(ICON_REGISTRY).sort((a, b) => a.localeCompare(b));
  const catalogNames: string[] = ICON_CATALOG.map((entry) => entry.name).sort((a, b) =>
    a.localeCompare(b),
  );

  const missing = registryNames.filter((name) => !catalogNames.includes(name));
  const stale = catalogNames.filter((name) => !registryNames.includes(name));

  if (missing.length > 0 || stale.length > 0) {
    throw new Error(
      'Icon catalog is out of sync with packages/ui/src/icons.' +
        (missing.length > 0 ? ` Missing from ICON_CATALOG: ${missing.join(', ')}.` : '') +
        (stale.length > 0 ? ` Not in the registry: ${stale.join(', ')}.` : ''),
    );
  }

  return Promise.all(
    ICON_CATALOG.map(async (entry) => {
      const relativePath = ICON_REGISTRY[entry.name];
      const filePath = path.join(process.cwd(), '../../', relativePath);
      const jsx = await fs.promises.readFile(filePath, 'utf-8');

      return {
        ...entry,
        componentName: iconComponentName(entry.name),
        jsx,
        svg: toSvg(jsx),
      };
    }),
  );
}
