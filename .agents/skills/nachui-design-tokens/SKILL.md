---
name: nachui-design-tokens
description: "Trigger: change a color, radius or shadow token, add or fix a theme preset, contrast, DTCG, Figma variables. The NachUI token pipeline from the DTCG JSON to every stylesheet, with its checks."
license: Apache-2.0
metadata:
  author: figueroaignacio
  version: "1.0"
---

## Activation Contract

Load when a design token changes, a theme preset is added or fixed, a contrast problem shows up, or tokens have to reach Figma. Not for component styling that only uses existing tokens (`nachui-frontend-engineering`).

## Hard Rules

- The single source is `packages/ui/tokens/themes/<theme>/{light,dark}.tokens.json` (DTCG). Never edit the generated outputs by hand: the token blocks in `packages/ui/src/css/globals.css`, the stylesheets in `apps/api/src/modules/themes/css/`, or the block between `{/* tokens:install:start */}` and `{/* tokens:install:end */}` in both `installation.mdx` files.
- Every theme declares the same tokens in both modes (radius only in light). The build stops otherwise.
- Every text pair stays at WCAG AA (4.5:1) in both modes for every theme. Fix the value; never lower the bar in the test.
- A token rename or a new token is a contract change: update `apps/api/src/modules/themes/theme-contract.ts`, the `@theme inline` mapping rule in the build script, `DESIGN.md` §2, and every component that reads it, in the same change.
- Keep `DESIGN.md` in step with the `nachui` values it documents.

## Decision Gates

| Situation | Action |
| --- | --- |
| A value changes | Edit both modes when the token has a dark value, then build |
| A new preset | Copy a theme folder, rename, change values, build; it appears in `nachui init` and `/themes` |
| A component needs a color no token covers | Propose a new token first; never a one-off value in the component |
| Contrast fails | Move lightness first, keep hue and chroma, re-run the test |

## Execution Steps

1. Edit the JSON (`references/pipeline.md` for the shape).
2. Run `pnpm --filter @repo/ui tokens`.
3. Run `pnpm --filter @repo/ui exec vitest run --project unit scripts` (contrast for every theme and for `globals.css`).
4. Run `pnpm --filter @repo/ui check:tokens`, then `pnpm --filter web exec vitest run src/features/themes` (the `/themes` formatter must still match the API stylesheets).
5. Look at the change on the docs site in light and dark (`/en/docs/foundations/color`, `/en/themes`).

## Output Contract

Report the tokens changed with old and new values, the files the build rewrote, the contrast results per theme and mode, and the checks that ran.

## References

- `references/pipeline.md`: file shape, what the build writes, contrast tests, Figma.
- `packages/ui/tokens/README.md`, `DESIGN.md` §2 and §4.
