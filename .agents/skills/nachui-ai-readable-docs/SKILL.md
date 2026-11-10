---
name: nachui-ai-readable-docs
description: "Trigger: write or edit a docs page, llms.txt, raw markdown, /api/docs, MCP, docs for agents. How NachUI docs are written so a person and an agent read the same thing, and where each page is served."
license: Apache-2.0
metadata:
  author: figueroaignacio
  version: "1.0"
---

## Activation Contract

Load when writing or editing anything under `apps/web/src/content/docs/`, adding a docs section, or touching the machine-readable surfaces: `/llms.txt`, the `.md` URLs, `/api/docs`, the docs assistant index. Component pages also follow `nachui-component-authoring`.

## Hard Rules

- Every page exists in `en` and `es`, published, with the same sections. Spanish uses voseo like the rest of `docs/es`.
- The raw markdown is the MDX source as written (`src/app/api/docs-md/[locale]/[[...slug]]/route.ts` returns `doc.raw`). Anything shown only through a JSX component is invisible to an agent: back every visual (swatches, scales, demos) with prose or a markdown table on the same page.
- Code blocks are complete and runnable: imports included, paths that match the CLI layout (`@/components/<name>`, `@/layout/<name>`, `@/ai/<name>`, `@/hybrids/<name>`, `@/icons/<name>`, `@/lib/<name>`).
- Frontmatter: `title`, `description`, `published: true`, `date`, `locale`, `toc`. Quote any value that contains `: `; an unquoted one drops the page without a warning.
- No em or en dashes, no AI boilerplate, sentence case headings.
- A new top-level docs section is listed in `src/app/llms.txt/route.ts` in the same change.
- `apps/web/src/content/skills/nachui-*.md` are synced from github.com/figueroaignacio/ui-skills; edit them there, not here.

## Decision Gates

| Situation | Action |
| --- | --- |
| A page explains a visual | Add a table or list with the same values |
| A new section folder under `docs/{en,es}/` | Add nav in both `docs.json` files and a `section(...)` line in `llms.txt/route.ts` |
| Content changes the assistant should know | Note that `pnpm --filter @repo/ai ingest` must run (needs env files); don't run it without them |

## Execution Steps

1. Write the page per `references/surfaces.md` and the closest existing page.
2. Run `node apps/web/scripts/check-navigation.mjs` and `node apps/web/scripts/check-locales.mjs`.
3. On the dev server, open the page, its `.md` URL, `/llms.txt` and `/api/docs`, and confirm the page appears in each.
4. Report.

## Output Contract

Report the pages added or changed in both locales, the nav and `llms.txt` changes, the URLs checked and what each returned, and whether an ingest run is pending.

## References

- `references/surfaces.md`: every surface, its source file and what it reads.
- `apps/web/src/content/docs/en/concepts/llms-txt.mdx`, `mcp.mdx`, `skills.mdx`.
