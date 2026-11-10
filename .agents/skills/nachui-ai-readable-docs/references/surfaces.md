# Docs surfaces

All of them read the `docs` collection built by content-collections from `apps/web/src/content/docs/**/*.mdx` (`apps/web/content-collections.ts`), through `ContentRepository` (`apps/web/src/shared/lib/content-repository.ts`). Only `published: true` pages appear.

| Surface | URL | Source | Reads |
| --- | --- | --- | --- |
| Page | `/<locale>/docs/<slug>` | `src/app/[locale]/docs/[[...slug]]` | compiled MDX |
| Raw markdown | `/<locale>/docs/<slug>.md` | rewrite in `apps/web/next.config.ts` to `src/app/api/docs-md/[locale]/[[...slug]]/route.ts` | `# title`, `> description`, then `doc.raw` |
| Index for agents | `/llms.txt` | `src/app/llms.txt/route.ts` | one `section(title, prefix)` per docs area, plus the icon catalog |
| JSON catalog | `/api/docs` | `src/app/api/docs/route.ts` | slug, locale, title, description, raw |
| Docs assistant | chat in the site | `packages/ai` ingest into Postgres, answered by `apps/api` (`chat`, `rag`) | `/api/docs` at ingest time |
| MCP server | `npx -y nachui-mcp` | published separately, documented in `concepts/mcp.mdx` | the registry and the docs |
| Skills | `/docs/concepts/skills` | `src/content/skills/nachui-*.md` | synced from the ui-skills repo |

## Writing for both readers

- Lead with what the thing is and when to use it, in one or two sentences, before any demo.
- Keep one idea per section with a plain heading; agents navigate by headings.
- Tables for props, keyboard, tokens and decisions. Every value an agent may need is text, never only a picture.
- Name real files, real props and real commands. If the reader could copy it, it must work.
- Link related pages with relative docs URLs (`/docs/concepts/theming`), which resolve in both locales.

## Checks

- `node apps/web/scripts/check-navigation.mjs`: nav hrefs resolve to published pages, locale parity, badges, unquoted `: ` in frontmatter.
- `node apps/web/scripts/check-locales.mjs`: message keys match across locales.
- `node apps/web/scripts/check-demos.mjs`: demos referenced by pages resolve and keep their imports pasteable.
- `pnpm --filter web exec vitest run src/features/docs`: rewrite of demo imports and docs helpers.
