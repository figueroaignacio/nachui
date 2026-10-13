# Contributing to NachUI

Thanks for wanting to help. NachUI is a side project I keep up on my own, so small, focused pull requests are the easiest to review. For anything bigger than a fix, open an issue first so we can agree on the shape before you write the code.

## Setup

You need Node >= 22.22.1 and pnpm 9.

```bash
pnpm install
pnpm --filter web dev
```

That runs the docs site at `localhost:3000`, which is all you need for component work. The API, database and chat assistant need env files; the [README](./README.md#environment-variables) lists them.

## Adding a component

A new component usually touches these places:

1. **The component** in `packages/ui/src/components/` (or `layout/`, `ai/`, `hybrids/`). Kebab-case file name, colocated `.test.tsx`.
2. **A demo** in `packages/ui/src/demos/<component>/default.tsx`, plus any extra variants as separate files.
3. **The registry**: run `pnpm --filter @repo/ui generate:registry`. It rewrites the generated registry files. Never edit those by hand.
4. **Docs in both locales**: `apps/web/src/content/docs/en/elements/ui/<component>.mdx` and the same path under `es/`. The frontmatter needs `published: true`, or the navigation check fails.
5. **A nav entry** in `apps/web/src/locales/en/docs.json` and `apps/web/src/locales/es/docs.json`, with `"badge": "new"` in both.

Icons work a bit differently: one file per icon in `packages/ui/src/icons/` and an entry in `apps/web/src/features/icons/lib/icons.ts`. The rules are in [DESIGN.md](./DESIGN.md), section 6.

## Conventions

- **Copy-paste ready.** Components only depend on `clsx`, `tailwind-merge`, `motion`, `class-variance-authority` and `zod`. No icon libraries (inline the SVG), no `next/*` imports, no docs data inside a primitive.
- **No comments in component, demo or brick source.** The code is shown as-is in the docs.
- **Imports.** Cross-file imports stay relative (`../lib/cn`). Use `import type` for type-only imports. No unused imports.
- **Classes.** Build class strings with `cn(...)`, never by concatenating strings. Design tokens live in `packages/ui/src/css/globals.css`.
- **`'use client'`** only when you need hooks or DOM APIs.
- **Copy.** Docs and UI text should read like a person wrote it. No em dashes or en dashes.

[CLAUDE.md](./CLAUDE.md) has the longer version, and [DESIGN.md](./DESIGN.md) has the visual rules.

## Commits

Commits follow [Conventional Commits](https://www.conventionalcommits.org/) and commitlint checks them on commit. Allowed types:

`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

A scope is welcome: `feat(ui): add rating component`, `fix(web): broken nav link`.

## Before opening a PR

These should pass:

```bash
pnpm --filter @repo/ui test:run
pnpm --filter <name> check-types   # for each workspace you touched
pnpm lint
pnpm --filter web checks           # registry, navigation and demos
```

Lint runs with `--max-warnings 0`, and the pre-commit hook runs ESLint and Prettier on staged files. Please don't run `pnpm format` on the whole repo for a small change; it rewrites files you didn't touch.
