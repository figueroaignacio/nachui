# Capturing the real thing

## Pages and demos

- Run `pnpm --filter web dev` and capture from http://localhost:3000. Every component has a page at `/<locale>/docs/elements/<family>/<name>` with each demo rendered by `ComponentPreview`.
- Use Playwright from `packages/ui`, where it is installed: `createRequire(process.cwd() + '/package.json')('playwright')`. Keep scripts and images in the session scratchpad, never in the repo.
- Widths: 1440 and 390 for everything; spot-check 768. Locales: `en`, then `es` for copy findings. Theme: light, then dark with `localStorage['theme-preference'] = 'dark'` set through `page.addInitScript` before navigating.
- RTL: set `dir="rtl"` on the demo's wrapper with `page.evaluate` before capturing a horizontal widget.
- Open states: click the trigger (menus, popovers, selects, dialogs) and capture again. Tab through once to capture focus rings.
- Crop to the element (`locator.screenshot()`), so the before image shows the problem and not the whole page.

## Components in isolation

- When a state is hard to reach on the docs page, render it in a browser test (`*.browser.test.tsx` style, `vitest-browser-react`) and screenshot the locator. Delete the throwaway test when done.
- `src/visual/demos.visual.test.tsx` already renders several demos in light, dark and RTL; its baselines in `src/visual/__screenshots__/` are valid captures.

## Neighbours

For each surface, capture the closest component that already sets the standard (Select for popups, Dialog for modals, Toggle Group for composite widgets, Field for forms) in the same state, so the before image can be compared side by side.
