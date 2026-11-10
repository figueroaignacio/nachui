# Registry, CLI and closing checks

## Registry files

`pnpm --filter @repo/ui generate:registry` runs `packages/ui/scripts/generate-registry.mjs`, which scans the families listed in `packages/ui/scripts/families.mjs` and writes:

- `packages/ui/src/lib/registry.ts`
- `apps/web/src/shared/components/mdx/demo-registry.tsx`
- `apps/web/src/features/gallery/lib/example-registry.tsx`
- `apps/web/src/features/icons/lib/icon-registry.tsx`

Never edit them by hand. `pnpm --filter @repo/ui check:registry` fails when they are stale.

## How the CLI installs it

- `pnpm registry:sync` (root, `scripts/sync-registry.ts`) pushes each item's source, npm dependencies and `registryDependencies` to Postgres. Every relative import becomes a registry dependency, so a component that imports `../lib/floating` installs that file too.
- Run `pnpm registry:sync --dry-run` first; `--prune` deletes rows whose source is gone. It needs `packages/db/.env`: if it is missing, tell the user to run it rather than looking for credentials.
- The CLI (`packages/cli`, commands `init`, `add`, `list`, `remove`, `update`) installs into `<baseDir>/<family dir>/` (`src/components`, `src/layout`, `src/ai`, `src/hybrids`, `src/icons`, `src/lib`), mirroring `packages/ui/src`, so relative imports keep working.
- A bare name that exists in two families (`toggle` is a component and an icon) needs the qualified slug: `nachui add ui/toggle`.

## Closing checks (once, at the end)

```bash
pnpm checks                                   # tokens, registry, comments, logical classes, nav, locales, demos
pnpm check-types
pnpm lint
pnpm test
pnpm --filter @repo/ui test:browser           # when behaviour changed
pnpm turbo run build --filter=web             # when docs or routes changed
```

A red result goes in the report with its output. Fix it; never weaken a check to make it pass.
