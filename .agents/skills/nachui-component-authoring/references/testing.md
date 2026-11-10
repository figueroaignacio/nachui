# Testing a component

`packages/ui/vitest.config.ts` has three projects. Write the first two with every component; the third when the look should be locked.

## Unit (`unit`, jsdom)

- File: `src/<family>/<name>.test.tsx`, Testing Library + `@testing-library/user-event`.
- Cover: default render, controlled and uncontrolled, every keyboard path, ARIA roles and names, disabled, form submit (`new FormData(form)`), reset.
- Accessibility: `expectNoAxeViolations(container)` from `../../test-utils/axe`, in the closed and the open state.
- jsdom has no layout: every rect is 0, so position and visibility belong in the browser project.
- Run: `pnpm --filter @repo/ui exec vitest run --project unit src/components/<name>.test.tsx`.

## Browser (`browser`, real Chromium through Playwright)

- File: `src/<family>/<name>.browser.test.tsx`. `render` from `vitest-browser-react` is async; `userEvent` and `page` come from `vitest/browser`.
- Cover what jsdom cannot: real focus and Tab order, position and flip near an edge (`page.viewport(...)`), scroll lock, pointer drag, RTL with `dir="rtl"` on a wrapper.
- Models: `select.browser.test.tsx`, `dialog.browser.test.tsx`, `tabs.browser.test.tsx`.
- Run: `pnpm --filter @repo/ui exec vitest run --project browser <file>`. CI runs Chromium, Firefox and WebKit (`VITEST_BROWSERS=chromium,firefox,webkit`); write assertions that hold in all three (computed colors serialize differently per engine).

## Visual (`visual`)

- One suite, `src/visual/demos.visual.test.tsx`, renders each listed demo in light, dark and RTL with the date frozen.
- Add the new component's default demo there when its look should be locked, then `pnpm --filter @repo/ui test:visual:update` and look at every new image before committing it.
- Baselines are machine specific; CI does not run this project.

## Scripts and lib

Logic in `packages/ui/src/lib` gets a `.test.ts` next to it. Scripts in `packages/ui/scripts` get one too; the unit project includes `scripts/**/*.test.ts`.
