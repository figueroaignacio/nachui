# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

NachUI is a copy-paste, dependency-free React component library plus its documentation site. The docs are deliberately AI-readable: every page is also served as markdown (`/llms.txt`, `.md` suffix on docs URLs, `/api/docs` JSON catalog).

Note: `AGENTS.md` predates a rename and still refers to `apps/docs`; that app is now `apps/web`. Its conventions sections are still mostly valid, but trust this file and the code where they disagree.

## Workspace layout

pnpm 9 + Turborepo monorepo, Node >= 18. Scope commands with `pnpm --filter <name>` instead of `cd`.

- `apps/web` (filter: `web`): Next.js 16 App Router docs site. next-intl (`en`/`es` locales), MDX via @content-collections, Tailwind CSS v4.
- `apps/api` (filter: `api`): NestJS server (default port 3001). Modules: `chat`, `docs`, `rag`, `registry`, `themes`.
- `packages/ui` (filter: `@repo/ui`): the component catalog itself. Only workspace with frontend tests (Vitest + React Testing Library).
- `packages/ai` (filter: `@repo/ai`): Vercel AI SDK + Google Gemini agent, tools, prompts, and the RAG ingest pipeline.
- `packages/db` (filter: `@repo/db`): Drizzle ORM + Postgres.
- `packages/cli` (filter: `nachui`): the published `nachui` CLI (commander + clack).
- `packages/eslint-config`, `packages/typescript-config`: shared strict presets (`noUncheckedIndexedAccess` is on; array access returns `T | undefined`).

## Commands

```bash
pnpm install                       # once; lockfile is pnpm-lock.yaml
pnpm dev / build / lint / test     # turbo fan-out across workspaces
pnpm format                        # prettier + tailwind class sorting
pnpm --filter web dev              # docs site dev server
pnpm --filter api dev              # nest start --watch
```

Tests:

```bash
pnpm --filter @repo/ui test:run                       # ui: vitest, CI style
pnpm --filter @repo/ui vitest run src/lib/cn.test.ts  # single file
pnpm --filter @repo/ui vitest run src/components/button.test.tsx -t "name"  # single case
pnpm --filter api test                                # api: jest
pnpm --filter api test:e2e                            # api: e2e config
```

Type-check: `pnpm --filter @repo/ui type-check`, `pnpm --filter web check-types`, `pnpm --filter @repo/ai check-types` (script names differ per package).

Lint is enforced at `--max-warnings 0` (also via husky + lint-staged on commit). Commits follow Conventional Commits, enforced by commitlint.

## The registry pipeline (core architecture)

The component catalog is described by generated files, and the web build fails if they are stale:

1. `packages/ui/scripts/generate-registry.mjs` scans `packages/ui/src/{components,layout,demos,bricks}` and writes two GENERATED files: `packages/ui/src/lib/registry.ts` (paths) and `apps/web/src/shared/components/mdx/demo-registry.tsx` (React imports for live MDX demos). Never edit these by hand.
2. After adding or renaming a component, demo, or brick, run `pnpm --filter @repo/ui generate:registry`.
3. `web`'s build runs `checks` first: registry freshness (`--check`), `scripts/check-navigation.mjs` (every nav href must resolve to a published doc or brick), and `scripts/check-demos.mjs`. A new docs page must have `published` frontmatter or the nav check fails.
4. `pnpm registry:sync` (root) pushes component source + inferred npm dependencies into Postgres via `@repo/db`, which the API `registry` module and CLI serve. Requires `packages/db/.env`.

So a new component typically touches: the component in `packages/ui/src/components/` (or `layout/`), a demo in `packages/ui/src/demos/`, regenerated registry files, and MDX docs in `apps/web/src/content/docs/{en,es}/`. Both locales exist for every page.

## AI/RAG pipeline

`pnpm --filter @repo/ai ingest` fetches the docs catalog from the running web app's `/api/docs`, chunks and embeds pages with Gemini (rate-limited in batches), and upserts into the `docChunks` table keyed by content hash. The API `chat`/`rag` modules answer over those embeddings. Env: `GOOGLE_GENERATIVE_AI_API_KEY` (apps/web/.env), `POSTGRES_URL` (packages/db/.env).

DB workflow lives in `packages/db`: `db:generate`, `db:migrate`, `db:push`, `db:studio` (drizzle-kit).

## Conventions that matter here

- Components in `packages/ui` must stay copy-paste ready and self-contained: runtime deps are limited to `clsx`, `tailwind-merge`, `motion`, `zod`, and icons. Never import docs/app data into a primitive; pass text and icons via props.
- Derive class strings with `cn(...)` (`packages/ui/src/lib`), never manual Tailwind string concatenation. Tailwind v4 has no config file; design tokens are CSS variables in `packages/ui/src/css/globals.css` (visual rules in `DESIGN.md`).
- `'use client'` only when hooks or DOM APIs require it. MDX-rendered components must be deterministic (no random IDs, no `Date.now()` defaults).
- Files: kebab-case components (`mobile-menu.tsx`), hooks in `packages/ui/src/hooks` prefixed `use`, tests colocated with `.test.ts(x)` suffix.
- Import order: platform (react, next/_) → third-party → workspace aliases (@repo/_, @/\*) → relative, blank line between groups, `import type` for type-only imports.
- `apps/web/src/proxy.ts` is the next-intl middleware; app routes live under `src/app/[locale]/`, feature code under `src/features/`, shared UI under `src/shared/`.
- User-facing copy (docs, landing, READMEs) should read human-written: no em dashes, no AI-sounding boilerplate.
- Secrets go in the per-package `.env` files listed above; never commit populated ones.
