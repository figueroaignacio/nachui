## What changed

<!-- A couple of lines. Link the issue if there is one: Closes #123 -->

## Why

## Checklist

- [ ] The PR title follows Conventional Commits (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`)
- [ ] `pnpm --filter @repo/ui test:run` passes
- [ ] `check-types` passes in every workspace I touched
- [ ] `pnpm lint` passes
- [ ] `pnpm --filter web checks` passes

If this adds or changes a component:

- [ ] Ran `pnpm --filter @repo/ui generate:registry` and committed the result
- [ ] Docs in both `en` and `es`, with `published: true`
- [ ] Nav entry in both locales, with a `badge` if it's new or reworked
- [ ] No comments in component or demo source, no `next/*` imports, classes built with `cn`
- [ ] No em dashes in user-facing copy

## Screenshots

<!-- For visual changes, before and after. Delete this section otherwise. -->
