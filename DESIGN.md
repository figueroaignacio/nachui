# Design System: NachUI

## 1. Visual Theme & Atmosphere

NachUI is a **quiet, soft minimalist** system. Sky blue carries the actions and the brand; the neutrals are pure gray, and hierarchy comes from contrast, type and spacing.

- **Pure light grays** in light mode: a white page (zero chroma) with light gray islands on it and white cards on the islands
- **Pure neutral grays** in dark mode (zero chroma), stepped so islands, cards and popovers stack clearly on a near-black page
- **Sky blue primary**: a deep sky blue with white text in light mode and a pastel sky blue with dark text in dark mode. Everything around it stays pure gray, so the sky blue is the only brand color
- **Soft, device-like corners** (base 1.125rem): controls read as pills and surfaces curve generously, with a small fixed scale described in section 4
- **Soft, tokenized elevation** in both modes. Shadows are gentle in light mode and deeper in dark mode, where they do more of the work of separating surfaces
- **OKLCH everywhere**, so steps between tokens are perceptually even

It should feel professional and calm, closer to a well set printed page than to a dashboard.

## 2. Color Palette & Roles

All tokens live in `packages/ui/src/css/globals.css` as CSS variables on `:root` and `.dark`, and are mapped to Tailwind utilities through `@theme inline` (`--background` becomes `bg-background`, `text-background` and so on).

### Surfaces

| Token             | Light Mode             | Dark Mode              | Role                                                                 |
| ----------------- | ---------------------- | ---------------------- | -------------------------------------------------------------------- |
| **Background**    | `oklch(100% 0 0)`      | `oklch(13% 0 0)`       | Page canvas                                                          |
| **Foreground**    | `oklch(19% 0 0)`       | `oklch(97% 0 0)`       | Primary text, headings                                               |
| **Card**          | `oklch(100% 0 0)`      | `oklch(22.5% 0 0)`     | Primary containers, one step above an island                         |
| **Popover**       | `oklch(100% 0 0)`      | `oklch(25% 0 0)`       | Every floating surface: menus, popovers, toasts                      |
| **Surface Muted** | `oklch(96.2% 0 0)`     | `oklch(18.5% 0 0)`     | Islands: preview stages, doc panels, tiles, the `bg-hatch` fill      |
| **Inverse**       | `oklch(19% 0 0)`       | `oklch(97% 0 0)`       | High contrast fills that flip with the mode, like the default banner |
| **Overlay**       | `oklch(19% 0 0 / 0.5)` | `oklch(0% 0 0 / 0.72)` | Backdrop behind dialogs, sheets and drawers                          |

Each surface has a matching `*-foreground` token for text on it. In dark mode the surfaces step up in lightness: background 13%, surface muted 18.5%, card 22.5%, popover 25%. The site reads as islands floating on the page: an island is `surface-muted` with no border, a card sits one step above it and code (`--code`, 94.5% light and 16% dark) one step below, so both read on an island in either mode. That ordering is why floating surfaces must use `bg-popover` and never `bg-background`: on a dark page a `bg-background` menu has no edge.

### Interactive Colors

| Token                  | Light Mode             | Dark Mode              | Role                                       |
| ---------------------- | ---------------------- | ---------------------- | ------------------------------------------ |
| **Primary**            | `oklch(52% 0.115 234)` | `oklch(82% 0.095 230)` | Main buttons, checked controls             |
| **Primary Foreground** | `oklch(99% 0.003 230)` | `oklch(22% 0.04 232)`  | Text on primary                            |
| **Secondary**          | `oklch(92.5% 0 0)`     | `oklch(28% 0 0)`       | Secondary buttons, chips                   |
| **Accent**             | `oklch(94% 0 0)`       | `oklch(28% 0 0)`       | Subtle hover and selected backgrounds      |
| **Muted**              | `oklch(91.5% 0 0)`     | `oklch(28% 0 0)`       | Item highlight in menus, tracks, skeletons |
| **Muted Foreground**   | `oklch(46% 0 0)`       | `oklch(76% 0 0)`       | Captions, placeholders, secondary text     |
| **Muted Strong**       | `oklch(36% 0 0)`       | `oklch(87% 0 0)`       | Long-form reading text                     |

### Lines and Focus

| Token                  | Light Mode             | Dark Mode              | Role                                                        |
| ---------------------- | ---------------------- | ---------------------- | ----------------------------------------------------------- |
| **Border**             | `oklch(88.5% 0 0)`     | `oklch(31% 0 0)`       | Default stroke on surfaces and dividers                     |
| **Border Interactive** | `oklch(60% 0 0)`       | `oklch(55% 0 0)`       | Hover and focus-within stroke on fields, scrollbar thumb    |
| **Input**              | `oklch(82% 0 0)`       | `oklch(37% 0 0)`       | Field strokes; `dark:bg-input/30` tints fields in dark mode |
| **Ring**               | `oklch(60% 0.115 232)` | `oklch(82% 0.095 230)` | Focus rings                                                 |
| **Rule**               | `oklch(88.5% 0 0)`     | `oklch(31% 0 0)`       | Editorial hairlines (`section-rule`, `rule-bleed`)          |

### Feedback Colors

Each feedback hue (destructive, warning, success, info) comes as a set of five tokens:

- `--<name>` and `--<name>-foreground`: solid fill and the text on it, for buttons and badges
- `--<name>-text`: the hue tuned for text on a normal surface
- `--<name>-surface` and `--<name>-border`: tinted background and stroke for callouts, banners and toasts

| Hue             | Light solid              | Dark solid               |
| --------------- | ------------------------ | ------------------------ |
| **Destructive** | `oklch(53% 0.16 27.3)`   | `oklch(76% 0.15 22.2)`   |
| **Warning**     | `oklch(53% 0.108 90.4)`  | `oklch(83% 0.111 78.2)`  |
| **Success**     | `oklch(53% 0.156 135.6)` | `oklch(80% 0.118 148.9)` |
| **Info**        | `oklch(52% 0.115 234)`   | `oklch(82% 0.095 230)`   |

Info is deliberately neutral in dark mode. Light solids sit at the same lightness so no state shouts louder than another.

### Code

`--code` is the code block background (`bg-code`). `--code-plain`, `--code-comment`, `--code-punctuation`, `--code-keyword`, `--code-string`, `--code-function`, `--code-number` and `--code-tag` color syntax tokens and reuse the feedback hues so highlighting stays in the same family.

### Theming

Tokens live in `packages/ui/tokens/themes/<theme>/{light,dark}.tokens.json` (DTCG format). `pnpm --filter @repo/ui tokens` writes the blocks in `globals.css`, the stylesheet of every theme served by the API and the theme block of the installation guide, and `pnpm checks` fails when any of them is stale. There are five presets (`nachui`, the one this site uses, plus `default`, `google`, `microsoft` and `mr-robot`); `/themes` previews them and builds a custom one. Components only read tokens, so a theme never touches component code. Every theme must keep text pairs at WCAG AA in both modes; `scripts/theme-contrast.test.ts` checks it.

## 3. Typography Rules

Four font roles, all set by the host app through CSS variables:

- **Sans** `var(--font-sans)`: body text, UI labels, form elements. Body letter spacing is 0.
- **Heading** `var(--font-heading)`: every `h1` to `h6`.
- **Serif** `var(--font-serif)`: long-form reading text through `.prose-reading` (falls back to sans).
- **Mono** `var(--font-mono)`: code and the small `.section-label`.

This site sets Sans, Heading and Serif to Hanken Grotesk and Mono to DM Mono. Headings carry weight so they never read thin:

- Page titles (`h1`, the landing hero, Studio screens): `font-semibold` at every size. Tight tracking, around `-0.03em`.
- Section headings (`h2`): `font-normal`.
- Small headings (`h3` to `h5`) and card or dialog titles: `font-medium`.
- Body text stays at `font-normal`; nothing under 16px goes below it.

Every role has one size per width on the site, shared by every page (phone 390 / tablet 768 / desktop 1440):

| Role                             | 390              | 768 | 1440 | Classes                                     |
| -------------------------------- | ---------------- | --- | ---- | ------------------------------------------- |
| Landing hero                     | 36               | 48  | 52   | `text-4xl md:text-5xl lg:text-[3.25rem]`    |
| Page title                       | 30               | 30  | 36   | `text-3xl leading-[1.1] lg:text-4xl`        |
| Page intro                       | 18               | 20  | 20   | `text-lg md:text-xl text-muted-strong`      |
| Docs `h2`                        | 20               | 24  | 24   | `text-xl md:text-2xl`                       |
| Docs `h3`, catalog section title | 18               | 18  | 18   | `text-lg font-medium`                       |
| Reading text                     | 16               | 17  | 17   | `text-base md:text-[17px]`                  |
| Controls and tables              | 16 (inputs) / 14 | 14  | 14   | `text-sm`, inputs `text-base md:text-sm`    |
| Code block                       | 13               | 13  | 13   | `text-[13px]`; inline code `text-[0.875em]` |
| Metadata and badges              | 12               | 12  | 12   | `text-xs`                                   |
| Section label                    | 11               | 11  | 11   | `.section-label`                            |

Nothing goes below 11px, no text size depends on `vh`, and a role never gets a one-off size on a single page.

All text uses `antialiased` rendering.

## 4. Component Stylings

### Radius Scale

The base is `--radius: 1.125rem`. Tailwind's radius utilities are derived from it:

| Utility       | Value                    | Use                                                                         |
| ------------- | ------------------------ | --------------------------------------------------------------------------- |
| `rounded-sm`  | `--radius * 0.66` (12px) | Items inside a surface: menu items, tooltip                                 |
| `rounded-md`  | `--radius` (18px)        | Controls (button, input, select trigger), floating surfaces, toast, callout |
| `rounded-lg`  | `--radius * 1.33` (24px) | Primary containers: card, dialog                                            |
| `rounded-xl`  | `--radius * 1.66` (30px) | Outermost shells only: a standalone prompt input, the frame                 |
| `rounded-2xl` | `--radius * 2` (36px)    | Drawer and similar large sheets                                             |

At this base `rounded-md` is half the height of a 36px control, so buttons, inputs and select triggers read as pills. Themes with a smaller base keep them squarer; components never hardcode the pill.

The checkbox sits below the scale at `--radius * 0.33` (6px): at 16px wide, `rounded-sm` would read as a radio.

`rounded-full` is for avatars, dots, icon buttons and pills that are pills on purpose (the context chip, attachment chips). Nested elements are never rounder than the element that holds them. How much smaller depends on the gap between the two edges:

- Gap of 8px or less: outer radius minus the gap, so the curves run parallel. The frame is `rounded-xl` with `p-1.5` and its panels are `rounded-lg` (30 − 6 = 24).
- Gap smaller than the outer radius: one step down the scale. A prompt input docked in a card or a chat panel is `rounded-md`; a confirmation inside a tool card is `rounded-md`.
- Gap equal to or larger than the outer radius: the corners no longer read together, so the inner element may repeat the step, never go above it. A card in the docs preview stage stays `rounded-lg`.

Segmented controls apply the first case: the tabs list and the toggle group are `rounded-md` with a 1px border and `p-0.5`, so the active tab and each toggle item use `rounded-[calc(var(--radius-md)-3px)]`. It follows the theme's base, so it stays concentric in every theme.

`rounded-xl` never sits inside a card. `rounded-full` is exempt from the rule.

### Elevation Scale

`--elevation-sm`, `--elevation-md` and `--elevation-lg` are defined in both modes and mapped to `shadow-sm`, `shadow-md` and `shadow-lg`. Use only these three, never `shadow-xl`, `shadow-2xl` or arbitrary shadows.

| Utility     | Use                                                                                                                |
| ----------- | ------------------------------------------------------------------------------------------------------------------ |
| `shadow-sm` | Inline controls that sit slightly above their track, like the active tab pill                                      |
| `shadow-md` | Anchored floating surfaces: popover, hover card, dropdown and context menu, select content, navigation menu, toast |
| `shadow-lg` | Modal surfaces: dialog, sheet, drawer                                                                              |

Cards and other in-flow containers stay flat and rely on `border` plus `bg-card`.

### Buttons & Interactive Elements

- **Shape**: `rounded-md`, not pill shaped. Icon-only round buttons opt into `rounded-full`.
- **Focus**: `focus-visible:ring-2 ring-ring` with `ring-offset-2`. Any offset ring must also set `ring-offset-background`, because Tailwind's default offset color is white and shows up as a halo in dark mode.
- **Hover**: background shifts to `muted`, `accent` or `primary/90` depending on the variant.
- **Disabled**: `opacity-40` and no pointer events.

### Floating Surfaces

Every surface anchored to a trigger shares one recipe: `bg-popover text-popover-foreground border border-border rounded-md shadow-md`.

- Menu-like containers (dropdown, context menu, select content, navigation menu) use `p-1`.
- Content-like containers (popover, hover card) use `p-4`.
- Menu items share `rounded-sm px-2 py-1.5 gap-2 text-sm` with a `bg-muted` highlight on hover and focus. Select keeps extra right padding for its check mark. Group labels use the same `px-2` so text lines up.
- Tooltips are the exception: an inverted `bg-foreground text-background` chip with `rounded-sm` and no shadow.

### Cards & Containers

- **Corner Radius**: `rounded-lg` for primary containers, smaller for anything nested
- **Background**: `bg-card` with a `border-border` stroke
- **Shadow**: none; see the elevation scale
- **Grid**: `--grid-color` for decorative grid overlays, and the `bg-hatch` utility for striped placeholder areas

### Inputs & Forms

- **Background**: transparent in light mode, `dark:bg-input/30` in dark mode
- **Border**: 1px `border-input`, moving to `border-border-interactive` on hover or focus-within
- **Focus**: on keyboard focus the border and a 1px ring both take `ring`, a 2px band at about 3:1 against the page; invalid fields use the destructive hue instead
- **Invalid**: `aria-invalid` switches the border and ring to destructive
- **Placeholder**: `muted-foreground`

### Scrollbars

- **Width**: 10px, with a 3px transparent border so the visible thumb is thinner and grows on hover
- **Track**: transparent in both modes
- **Thumb**: fully rounded, `--border-interactive` at 60%, solid on hover and `--muted-foreground` while dragging
- **Firefox**: `scrollbar-width: thin` with the same colors
- **Utility**: `.hide-scrollbar` for overflow areas that should scroll without a bar

## 5. Layout Principles

### Spacing & Rhythm

- **Radius**: one base value with a fixed scale, see section 4
- **Component Spacing**: Tailwind's default spacing scale; no custom spacing tokens
- **Page Frame**: `--frame-gutter` and `--frame-pad` grow with the viewport and drive `.page-frame`, `.rule-bleed` and `.bleed-x`
- **Scroll Behavior**: smooth scroll enabled globally

### Accessibility

- **Reduced Motion**: `prefers-reduced-motion: reduce` shortens CSS animations and transitions globally, and every animated component swaps to a fade (section 7)
- **Color Contrast**: foreground and background pairs are chosen to meet WCAG AA
- **Focus Indicators**: visible ring on every interactive element, with an offset that matches the page background
- **Scrollbar Safety**: `scrollbar-width: thin` fallback where `::-webkit-scrollbar` is not supported

### Dark Mode Strategy

- Light mode is warm and tinted, dark mode is strictly neutral; the two are tuned separately rather than inverted
- Surfaces get lighter as they rise (background, surface muted, card, popover), so depth reads even without shadows
- Shadows are stronger in dark mode and are still used, since a dark surface needs both a lighter fill and a shadow to lift
- Feedback colors get lighter and slightly less saturated in dark mode to stay readable

## 6. Icons

NachUI ships its own icon set in `packages/ui/src/icons`, one self-contained React component per file. It is optional: every component takes icons through props, so any library works. The set exists so the catalog, the docs and the demos read as one hand.

### Grid and stroke

- **Canvas**: 24 by 24 with a 2px safe area. Nothing draws outside 2..22.
- **Stroke**: 1.5, `stroke-linecap="round"`, `stroke-linejoin="round"`, `fill="none"`.
- **Corners**: radius 2 on rectangles, 45 or 90 degree angles, perfect circles. No freehand curves.
- **Color**: always `stroke="currentColor"`. No fills, no gradients, no ids, no `<defs>`, no transforms.
- **Primitives**: only `path`, `circle`, `rect`, `line`, `polyline`. Compound shapes stay separate elements so they can be animated later.
- **Optical alignment**: arrows, play and similar asymmetric shapes are centered by visual weight, not by bounding box.

### Component contract

- Exported as `<Name>Icon` from `packages/ui/src/icons/<name>.tsx`, kebab-case file, no shared base component and no imports besides React.
- Props: `size` (default 24, sets width and height), `strokeWidth` (default 1.5), plus every `SVGProps`. `aria-hidden` is on by default; pass `aria-label` and `aria-hidden={false}` when the icon carries meaning alone.
- No comments in the file: the source is shown verbatim on the catalog page and installed by the CLI as `icons/<name>`.
- Variants come as sibling files (`search-filled.tsx`), never as a `variant` prop, so each file stays a single drawing.

The test in `packages/ui/src/icons/icons.test.tsx` enforces the contract, and `apps/web/src/features/icons/lib/icons.ts` holds the category and tags of every icon for the Icons docs page (`/docs/elements/icons`).

## 7. Motion

Every animation in NachUI is made of the same material: springy, a little playful, never sloppy. The vocabulary lives in `packages/ui/src/lib/motion.ts` and the installation guide has the reader create it next to `cn.ts`; components import it as `../lib/motion` and never define their own springs.

### One physics

- **Three springs, no more**: `snappy` (550 / 22 / 0.6) for hover, press and toggles; `smooth` (380 / 24 / 0.8) for panels, menus and collapsibles; `gentle` (200 / 20 / 1) for large surfaces like dialogs and drawers. All three are underdamped on purpose: things overshoot their target a touch and settle back, which is what reads as friendly. The overshoot is small and quick, one visible bounce and done.
- **State changes use springs, never durations.** Springs are interruptible: opening and closing mid flight continues from the current position with its velocity. Fixed durations are reserved for opacity and for loops.
- **Nothing longer than 0.3s** on anything the user is waiting for.

### Depth of field

Things arrive by popping into focus and leave by shrinking out of it: `blur(6px)` and `scale(0.85)` on entry, springing past full size and settling; `scale(0.92)` with a lighter `blur(4px)` on exit. Blur only ever appears during a transition, never at rest, and never on text that is being read. This is the library's signature and it is applied everywhere something appears or disappears.

### Asymmetry

Exits are faster than entries, roughly 60% of the time. What arrives deserves attention; what leaves should not get in the way. `floatingVariants` and `collapse` encode this: spring in, short tween out.

### Origin

Anything that opens from a trigger opens from the trigger: `floatingOrigin[side]` sets `transform-origin` toward it, and `floatingVariants[side]` starts the element a few pixels closer to it. Tooltip, popover, hover card, dropdown and context menu share exactly this behaviour.

### Press

`whileTap={tap}` with `springs.snappy`: `scale(0.94)`, a real squish, and a spring back that overshoots. This is where the library feels most like a toy, and that is the point: a control should feel good to press.

### Reduced motion

Every animated component checks `useReducedMotion()` and swaps to `reveal` (a short opacity fade) or `still`. Motion is never removed entirely, so state changes stay legible.

### Not allowed

- Bounce that keeps going. One overshoot is character; two is a wobble. If a spring visibly oscillates more than once, raise its damping.
- Animating `width`, `top` or `left`. Only `transform`, `opacity` and `filter`; `height` on collapsibles is the one justified exception.
- Stagger without a cap. `cascade` is for lists of up to ten items at 35ms apart.

## 8. Technical Notes

- **Color Space**: OKLCH for perceptually even color steps
- **CSS Variables**: raw tokens on `:root` and `.dark`, exposed to Tailwind as `--color-*`, `--radius-*` and `--shadow-*`
- **Tailwind v4**: no config file; `@theme inline` maps the CSS variables to utility classes, and `dark:` is a custom variant on `.dark`
- **Source Path**: components scanned from `../../../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}`
