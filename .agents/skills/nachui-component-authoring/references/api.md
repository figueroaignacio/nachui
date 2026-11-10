# Component API

Model files: `select.tsx` (popup with a list), `dialog.tsx` (modal, `asChild`), `toggle-group.tsx` (roving focus), `slider.tsx` (pointer and form value), `combobox.tsx` (input with a listbox).

## File shape

- `packages/ui/src/<family>/<kebab-name>.tsx`, `'use client'` only when it uses hooks or DOM APIs.
- Imports: `react`, then third party (`class-variance-authority`, `motion/react`), then relative (`../lib/...`, `./button`). `import type` for types.
- Icons the component needs are local SVG components in the same file (copy the `ChevronDownIcon` pattern from `select.tsx`: 24 grid, stroke 1.5, `aria-hidden`).
- Export the compound and its prop types: `export { Select, selectTriggerVariants }` and `export type { SelectProps, ... }`.

## Props

- Root owns state; parts read it from a context created with `React.createContext` and read with `React.use`.
- Controlled pairs: `value` / `defaultValue` / `onValueChange`, `open` / `defaultOpen` / `onOpenChange`, through `useControllableState`.
- Parts accept the native attributes of their element and `ref` as a prop (React 19, no `forwardRef`).
- `asChild` follows `dialog.tsx` (`mergeSlotProps` + `cloneElement`).
- Labels a reader hears (`closeLabel`, `previousMonthLabel`, `loadingLabel`) are props with English defaults, so apps can translate them.
- Form controls take `name`, `required`, `disabled` and `form`, and submit through `FormValue`.

## Shared libs (`packages/ui/src/lib`)

`use-controllable-state`, `floating`, `overlay`, `collection` (`getNavigationIndex`, `useTypeahead`), `roving-focus`, `direction`, `form-control`, `date`, `motion`, `cn`. Read the one you need before using it; each has a test next to it.

## Styling

- Variants with `cva`, merged with `cn(variants({ size }), className)`. Export the variants when another component reuses them (`toggleVariants`).
- Tokens only, values from `DESIGN.md` §4: controls `rounded-md` and `h-8/h-9/h-10`, floating surfaces `bg-popover border-border rounded-md shadow-md p-1`, items `rounded-sm px-2 py-1.5 text-sm` with `bg-muted` on highlight, focus `focus-visible:ring-2 ring-ring ring-offset-2 ring-offset-background`, disabled `opacity-40 pointer-events-none`.
- Logical classes (`ps`, `me`, `start`, `end`, `border-s`, `rounded-e`); `pnpm --filter @repo/ui check:logical` fails on physical ones.
- Motion from `lib/motion` only, with `useReducedMotion()`.

## Data attributes

`data-slot="<name>-<part>"` on every part, `data-state` (`open|closed`, `on|off`, `checked|unchecked`, `active|inactive`), `data-disabled`, `data-orientation` where they apply. Users style through them.
