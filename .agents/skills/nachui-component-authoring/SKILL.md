---
name: nachui-component-authoring
description: "Trigger: new component, add to the catalog, rework a primitive, demo, docs page for a component. How a NachUI component is born end to end: API, tokens, tests, en/es docs, registry, CLI and checks."
license: Apache-2.0
metadata:
  author: figueroaignacio
  version: "1.0"
---

## Activation Contract

Load when a component, layout primitive, AI element or hybrid is created or reworked in `packages/ui/src/{components,layout,ai,hybrids}`, including its demos and docs. Pair with `nachui-frontend-engineering` for the design side. Not for icons alone (see `DESIGN.md` §6) or tokens (`nachui-design-tokens`).

## Hard Rules

- Copy-paste ready: runtime deps are `react`, `react-dom`, `clsx`, `tailwind-merge`, `motion`, `class-variance-authority` and `zod`. No icon packages, no `next/*`, relative imports only.
- Reuse `packages/ui/src/lib` (`references/api.md`) before writing any behaviour. Never duplicate a helper.
- Compound API, `useControllableState` for every controlled pair, `data-slot` on every part, `data-state` wherever there is state, logical classes, tokens only.
- No comments in component, demo or brick source.
- Docs in en and es in the same change; demos in realistic English.
- Never edit the generated registry files by hand.
- Run the full repo checks once, at the end (`references/distribution.md`).

## Decision Gates

| Situation | Action |
| --- | --- |
| A similar component exists | Match its prop names and behaviour; extend it if the new one is a variant |
| The behaviour belongs in several components | Put it in `packages/ui/src/lib`, then use it |
| It renders in a portal or floats | `useFloating` + `FloatingPortal` + `useLayer`, like `select.tsx` |
| It holds a form value | `FormValue` and `useFormReset` from `lib/form-control.ts` |
| Composition is unclear | Load `composition-patterns` |

## Execution Steps

1. Read the closest existing component and its tests.
2. Write `<name>.tsx` per `references/api.md`.
3. Write `<name>.test.tsx` and `<name>.browser.test.tsx` per `references/testing.md`.
4. Add demos in `packages/ui/src/demos/<name>/` and run `pnpm --filter @repo/ui generate:registry`.
5. Write `elements/<family>/<name>.mdx` in en and es and the nav entries per `references/docs.md`.
6. Look at the page on the dev server (see `nachui-frontend-engineering` workflow).
7. Run the closing checks and, when the user has DB access, the registry sync (`references/distribution.md`).

## Output Contract

Report the files added, the test counts per project (unit, browser), the nav entries, the checks that ran and their result, and anything left for the user (`registry:sync`, visual baselines). Never claim a check that was not run.

## References

- `references/api.md`: file shape, props, shared libs, tokens and variants.
- `references/testing.md`: unit, browser and visual tests.
- `references/docs.md`: demos, MDX pages, nav, and how the page reaches `llms.txt`, `.md` and `/api/docs`.
- `references/distribution.md`: registry, CLI and closing checks.
- `.agents/skills/accessibility`, `.agents/skills/composition-patterns`, `.agents/skills/vitest`.
