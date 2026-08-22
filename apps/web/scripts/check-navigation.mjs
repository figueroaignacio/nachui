/**
 * Fails the build when the navigation links to something that does not exist.
 *
 * Two bugs motivated this. /en/docs/installation was a 404 for 48 commits
 * because its frontmatter was missing `published`, and /bricks/Dashboard was a
 * 404 because the nav hardcoded a capitalised slug the registry never emits.
 * Neither breaks the build, neither breaks the types, and both sat in the
 * sidebar of every page on the site.
 *
 * Runs on plain node with no dependencies so it can go in front of `next build`
 * without adding a test runner to this app.
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const LOCALES = ['en', 'es'];
const DOCS_ROOT = join(APP_ROOT, 'src/content/docs');
const BRICKS_REGISTRY = join(APP_ROOT, 'src/features/bricks/lib/bricks-registry.ts');

/** Every href in a locale's navigation data, with where it came from. */
function collectHrefs(locale) {
  const found = [];

  const push = (href, source) => {
    if (typeof href === 'string' && href.startsWith('/')) found.push({ href, source });
  };

  const docs = JSON.parse(readFileSync(join(APP_ROOT, `src/locales/${locale}/docs.json`), 'utf8'));
  for (const section of docs.navigation ?? []) {
    for (const item of section.items ?? []) {
      push(item.href, `docs.json > ${section.title} > ${item.title}`);
    }
  }

  const ui = JSON.parse(readFileSync(join(APP_ROOT, `src/locales/${locale}/ui.json`), 'utf8'));
  for (const item of ui.navigation ?? []) {
    push(item.href, `ui.json > navigation > ${item.title}`);
  }
  for (const item of ui.elementsMenu?.items ?? []) {
    push(item.href, `ui.json > elementsMenu > ${item.title}`);
  }

  return found;
}

const VALID_BADGES = new Set(['new', 'updated']);

/** href -> badge for one locale's docs navigation, reporting invalid values. */
function collectBadges(locale, problems) {
  const badges = new Map();

  const docs = JSON.parse(readFileSync(join(APP_ROOT, `src/locales/${locale}/docs.json`), 'utf8'));
  for (const section of docs.navigation ?? []) {
    for (const item of section.items ?? []) {
      if (item.badge === undefined) continue;
      if (!VALID_BADGES.has(item.badge)) {
        problems.push(
          `[${locale}] ${item.href} has badge "${item.badge}"; ` +
            `valid values: ${[...VALID_BADGES].join(', ')}  (docs.json > ${section.title} > ${item.title})`,
        );
        continue;
      }
      badges.set(item.href, item.badge);
    }
  }

  for (const badge of VALID_BADGES) {
    if (!docs.badges?.[badge]) {
      problems.push(`[${locale}] docs.json is missing the "badges.${badge}" label`);
    }
  }

  return badges;
}

/** The same item must carry the same badge in every locale, or the chip
 * silently differs per language. */
function checkBadgeParity(byLocale, problems) {
  const hrefs = new Set(byLocale.flatMap(([, badges]) => [...badges.keys()]));

  for (const href of hrefs) {
    const values = byLocale.map(([locale, badges]) => `${locale}=${badges.get(href) ?? 'none'}`);
    const unique = new Set(byLocale.map(([, badges]) => badges.get(href)));
    if (unique.size > 1) {
      problems.push(`${href} has mismatched badges across locales: ${values.join(', ')}`);
    }
  }
}

function readFrontmatter(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  return match ? match[1] : '';
}

/** Resolves a docs slug to its mdx file, honouring the index.mdx convention. */
function findDocFile(locale, slug) {
  const base = join(DOCS_ROOT, locale);
  const candidates = slug
    ? [join(base, `${slug}.mdx`), join(base, slug, 'index.mdx')]
    : [join(base, 'index.mdx')];

  for (const candidate of candidates) {
    try {
      if (statSync(candidate).isFile()) return candidate;
    } catch {
      // next candidate
    }
  }
  return null;
}

function readBrickSlugs() {
  const source = readFileSync(BRICKS_REGISTRY, 'utf8');
  const slugs = [...source.matchAll(/^\s*slug:\s*'([^']+)'/gm)].map((m) => m[1]);

  // A regex over source is only safe if it keeps finding entries. Zero matches
  // means the registry was refactored and this check silently stopped working.
  if (slugs.length === 0) {
    throw new Error(
      `check-navigation: found no brick slugs in ${BRICKS_REGISTRY}. ` +
        'The registry shape changed and this guard needs updating.',
    );
  }
  return new Set(slugs);
}

function collectDocsWithoutPublishedFlag() {
  const missing = [];

  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.endsWith('.mdx') && !/^published:/m.test(readFrontmatter(full))) {
        missing.push(full.slice(APP_ROOT.length + 1));
      }
    }
  };

  walk(DOCS_ROOT);
  return missing;
}

function main() {
  const brickSlugs = readBrickSlugs();
  const problems = [];
  const unchecked = [];
  let checked = 0;

  for (const locale of LOCALES) {
    for (const { href, source } of collectHrefs(locale)) {
      checked++;

      if (href === '/') continue;

      if (href === '/docs' || href.startsWith('/docs/')) {
        const slug = href.replace(/^\/docs\/?/, '');
        const file = findDocFile(locale, slug);

        if (!file) {
          problems.push(`[${locale}] ${href} has no mdx file  (${source})`);
        } else if (!/^published:\s*true\s*$/m.test(readFrontmatter(file))) {
          problems.push(
            `[${locale}] ${href} is not published  (${source})\n` +
              `          add "published: true" to ${file.slice(APP_ROOT.length + 1)}`,
          );
        }
        continue;
      }

      if (href.startsWith('/bricks/')) {
        const slug = href.replace('/bricks/', '');
        if (!brickSlugs.has(slug)) {
          const hint = brickSlugs.has(slug.toLowerCase())
            ? ` (did you mean "${slug.toLowerCase()}"?)`
            : '';
          problems.push(`[${locale}] ${href} is not a brick category${hint}  (${source})`);
        }
        continue;
      }

      unchecked.push(`[${locale}] ${href}  (${source})`);
    }
  }

  checkBadgeParity(
    LOCALES.map((locale) => [locale, collectBadges(locale, problems)]),
    problems,
  );

  // Docs that never got linked can still be invisible by accident, so the same
  // run reports a missing flag anywhere in the collection.
  const missingFlag = collectDocsWithoutPublishedFlag();

  if (problems.length === 0 && missingFlag.length === 0) {
    console.log(`check-navigation: ${checked} links ok across ${LOCALES.join(', ')}`);
    if (unchecked.length > 0) {
      console.log(
        `check-navigation: ${unchecked.length} link(s) not covered by any rule:\n  ` +
          unchecked.join('\n  '),
      );
    }
    return;
  }

  console.error('check-navigation FAILED\n');
  if (problems.length > 0) {
    console.error('Broken navigation links:');
    for (const problem of problems) console.error(`  ${problem}`);
    console.error('');
  }
  if (missingFlag.length > 0) {
    console.error('Docs with no `published` in frontmatter (they default to false and 404):');
    for (const file of missingFlag) console.error(`  ${file}`);
    console.error('');
  }
  process.exit(1);
}

main();
