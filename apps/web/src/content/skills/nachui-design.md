---
name: 'nachui-design'
description: 'Use when styling, designing, or adjusting UI layout, colors, variables, typography, and visual assets in NachUI.'
---

## NachUI Design System Skill

You are styling interfaces, pages, or components for the NachUI ecosystem. Your work must follow the visual system, the design tokens and the rules below.

## Visual Philosophy

NachUI is a **quiet, editorial minimalist** system. Color is mostly absent; hierarchy comes from contrast, type and spacing.

- **Light mode**: warm paper neutrals. Every gray carries a faint warm tint, so white never reads clinical.
- **Dark mode**: pure neutral grays, stepped so surfaces stack clearly on a near-black canvas.
- **Primary**: near-black in light mode, near-white in dark mode. Accent color only shows up in feedback states and syntax highlighting.
- **Radius**: moderate, from a single base of `0.75rem`.
- **Elevation**: soft, tokenized shadows in both modes.
- **OKLCH everywhere**, so steps between tokens are perceptually even.

## Color Tokens

Never hardcode colors. Use the semantic tokens defined in `globals.css` and exposed as Tailwind utilities (`bg-background`, `text-muted-foreground`, `border-border` and so on).

| Token                | Light Mode               | Dark Mode          | Role                                    |
| :------------------- | :----------------------- | :----------------- | :-------------------------------------- |
| `--background`       | `oklch(99.1% 0.003 85)`  | `oklch(14.5% 0 0)` | Page canvas                             |
| `--foreground`       | `oklch(14.5% 0.004 75)`  | `oklch(98.5% 0 0)` | Primary text                            |
| `--card`             | `oklch(100% 0 0)`        | `oklch(21.8% 0 0)` | In-flow containers                      |
| `--popover`          | `oklch(100% 0 0)`        | `oklch(23.9% 0 0)` | Every floating surface                  |
| `--surface-muted`    | `oklch(96.5% 0.0045 85)` | `oklch(18.2% 0 0)` | Recessed areas and preview canvases     |
| `--primary`          | `oklch(20.5% 0.005 75)`  | `oklch(98.5% 0 0)` | Main buttons, checked controls          |
| `--muted`            | `oklch(94.2% 0.005 85)`  | `oklch(26.9% 0 0)` | Menu item highlight, tracks, skeletons  |
| `--muted-foreground` | `oklch(52% 0.0065 75)`   | `oklch(71.5% 0 0)` | Captions, placeholders, secondary text  |
| `--border`           | `oklch(91.5% 0.0055 85)` | `oklch(26.9% 0 0)` | Default stroke                          |
| `--input`            | `oklch(87% 0.0065 85)`   | `oklch(34.8% 0 0)` | Field strokes                           |
| `--ring`             | `oklch(65% 0.0065 75)`   | `oklch(98.5% 0 0)` | Focus rings                             |
| `--inverse`          | `oklch(14.5% 0.004 75)`  | `oklch(98.5% 0 0)` | High contrast fills that flip with mode |

In dark mode surfaces get lighter as they rise: background, surface muted, card, popover. That is why floating surfaces must use `bg-popover`, never `bg-background`.

### Feedback colors

Destructive, warning, success and info each come as five tokens:

- `--<name>` and `--<name>-foreground` for solid fills such as buttons and badges.
- `--<name>-text` for colored text on a normal surface. Use this one for error text, never the solid token.
- `--<name>-surface` and `--<name>-border` for callouts, banners and toasts.

### Theming

There are no accent presets. To rebrand, redefine the tokens on `:root` and `.dark`. Components only read tokens.

## Typography

- **Sans** `var(--font-sans)`: body text and UI labels, letter spacing 0.
- **Heading** `var(--font-heading)`: every `h1` to `h6`.
- **Serif** `var(--font-serif)`: long-form reading text through `.prose-reading`.
- **Mono** `var(--font-mono)`: code and small uppercase section labels.
- Always use `antialiased` rendering.

## Styling Rules

1. **Radius scale** (base `--radius: 0.75rem`):
   - `rounded-sm` (6px): items inside a surface, such as menu items, the tab pill, checkboxes and tooltips.
   - `rounded-md` (12px): controls, floating surfaces, toasts and callouts.
   - `rounded-lg` (16px): primary containers such as cards and dialogs.
   - `rounded-xl` and `rounded-2xl`: only for composer shells and drawers.
   - Nested elements always use a smaller radius than their container.
2. **Elevation**: only `shadow-sm` (inline controls), `shadow-md` (anchored floating surfaces) and `shadow-lg` (dialogs, sheets, drawers). Never `shadow-xl`, `shadow-2xl` or arbitrary shadows. Cards stay flat with a border.
3. **Floating surfaces** share one recipe: `bg-popover text-popover-foreground border border-border rounded-md shadow-md`. Menus use `p-1` with items `rounded-sm px-2 py-1.5 gap-2 text-sm` and a `bg-muted` highlight. Popovers and hover cards use `p-4`.
4. **Focus**: `focus-visible:ring-2 ring-ring` with `ring-offset-2`, and always `ring-offset-background` next to any offset so dark mode doesn't show a white halo.
5. **Disabled**: `opacity-40` and no pointer events.
6. **Inputs**: transparent background in light mode and `dark:bg-input/30` in dark mode, `border-input`, darker border on hover and focus. Font size is `text-base` on mobile and `md:text-sm` on desktop, so iOS doesn't zoom on focus.
7. **Scrollbars**: thin, with the thumb from `--border-interactive`. Use `.hide-scrollbar` for horizontal swipe rows.

## Technical Guidelines

- **Tailwind v4**: there is no config file. Tokens live as CSS variables in `packages/ui/src/css/globals.css` and are mapped in `@theme inline`.
- **Class names**: build them with `cn()`, never with string concatenation.
- **Reduced motion**: respect `prefers-reduced-motion` in every animation.
- **Contrast**: text pairings must pass WCAG AA.
