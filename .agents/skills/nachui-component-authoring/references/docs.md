# Demos and docs

## Demos

- `packages/ui/src/demos/<name>/<demo>.tsx`, one export per file named after it in PascalCase (`default.tsx` exports `Default`).
- Import with `../../components/<name>` and icons from `../../icons/<icon>`; the docs rewrite those to `@/components/...` and `@/icons/...`.
- `'use client'` when the demo reads a subcomponent (`Select.Item`) or uses hooks; `apps/web/scripts/check-demos.mjs` fails otherwise.
- Realistic English copy, deterministic render (no `Date.now()` in render; compute dates in an effect or take a fixed `defaultMonth`).
- After adding or renaming a demo: `pnpm --filter @repo/ui generate:registry`.

## Pages

- `apps/web/src/content/docs/{en,es}/elements/<family>/<name>.mdx`, where family is `ui`, `layout`, `ai` or `hybrids`.
- Frontmatter: `title`, `description`, `published: true`, `date`, `locale`, `toc.visible`. Quote any value that contains `: `.
- Sections, in this order: preview, Installation (`<ComponentInstallTabs component="<name>" />`), Anatomy (`import { X } from '@/components/<name>';`), Composition (a `tree` block), Variants (one `<ComponentPreview component="<name>" demo="<demo>" />` each), Keyboard, Accessibility, API Reference (one table per part). `combobox.mdx` is the model.
- In JSX on the page, use the flat names of client compound components (`TabsList`); code blocks can show `X.Part`.
- Spanish pages use voseo like the rest of `docs/es`. No em or en dashes in either locale.

## Nav

- Add an entry to `apps/web/src/locales/en/docs.json` and `.../es/docs.json` in the section of the family, alphabetical, with `"badge": "new"` in both (`"updated"` for a rework). Remove the badge once it is no longer recent.
- `node apps/web/scripts/check-navigation.mjs` checks hrefs, badges and locale parity.

## Where the page shows up by itself

A published page is served, without extra work, at:

- `/<locale>/docs/elements/<family>/<name>` (the page),
- the same URL plus `.md` (raw markdown, rewritten in `apps/web/next.config.ts` to `src/app/api/docs-md`),
- `/api/docs` (JSON catalog),
- `/llms.txt`, under its family section (`apps/web/src/app/llms.txt/route.ts`).

Check the `.md` URL and `/llms.txt` on the dev server before reporting. The docs assistant's index only updates when `pnpm --filter @repo/ai ingest` runs, which needs env files; say so in the report instead of running it.
