# Front-end craft

Engineering rules on top of `AGENTS.md`. Accessibility basics live in `.agents/skills/accessibility`; this file only adds what is specific to NachUI.

## Portability (`packages/ui`)

- Components run in any React 19 setup: no `next/*`, no router, no framework APIs. `react-dom` is fine (`flushSync`, `useFormStatus`, portals).
- Relative imports only (`../lib/cn`), `import type` for types, no unused imports. The CLI installs files into `src/{components,layout,ai,hybrids,icons,lib}` and they must work unchanged.
- `'use client'` only when the file uses hooks or DOM APIs.
- Deterministic render: `React.useId()` for ids, never `Math.random()` or `Date.now()` in render. Dates come from `lib/date.ts` (`YYYY-MM-DD` strings).

## Shared behaviour (`packages/ui/src/lib`)

| Need | Use |
| --- | --- |
| Controlled and uncontrolled pair | `use-controllable-state.ts` |
| Anchored popup position, `--anchor-width` | `floating.ts` (`useFloating`, `FloatingPortal`) |
| Focus trap, scroll lock, layer order | `overlay.ts` |
| Arrow keys and typeahead in lists | `collection.ts` |
| One tab stop for a group | `roving-focus.ts` |
| RTL | `direction.ts` (`useDirection`, `resolveDirection`) |
| Values in native forms, form reset | `form-control.ts` (`FormValue`, `useFormReset`) |
| Springs and variants | `motion.ts` |

## The docs app (`apps/web`)

- Next 16 with breaking changes: read `apps/web/node_modules/next/dist/docs/` before using a Next API.
- MDX renders on the server. Use the flat names of client compound components in MDX (`TabsList`, not `Tabs.List`), and give demos that read a subcomponent `'use client'` (`scripts/check-demos.mjs` enforces it). Don't indent JSX closing tags after a markdown list.
- Messages live in `apps/web/src/locales/{en,es}/*.json` with the same keys. A `MISSING_MESSAGE` or stale copy in `next dev` for a key that exists is the dev cache: stop the server, delete `apps/web/.next`, start again.
- Theme: `nach-themes` with the `.dark` class on `<html>`, stored in `localStorage` as `theme-preference`.

## Dark mode and RTL

- Every color comes from a token that changes with `.dark`; check both themes in screenshots.
- `dark:` variants match `.dark` on any ancestor, so a light preview inside a dark page needs its own handling.
- Check a horizontal widget with `dir="rtl"`: layout mirrors and arrow keys flip.

## Performance

- Animate only `transform`, `opacity` and `filter` (height on collapsibles is the one exception). No `transition-all`.
- Floating surfaces measure in `useLayoutEffect` and reposition on scroll and resize through `useFloating`; don't add listeners of your own.
- Heavy demos on docs pages load as client islands; server components by default.
