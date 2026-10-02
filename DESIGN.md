# Design System: NachUI

## 1. Visual Theme & Atmosphere

NachUI is a **quiet, editorial minimalist** system. Color is mostly absent; hierarchy comes from contrast, type and spacing.

- **Warm paper neutrals** in light mode: every gray carries a faint warm tint (hue 75 to 85, very low chroma), so white never reads clinical
- **Pure neutral grays** in dark mode (zero chroma), stepped so surfaces stack clearly on a near-black canvas
- **Near-black primary** in light mode and near-white primary in dark mode. Accent color only shows up in feedback states and syntax highlighting
- **Moderate corner radius** (base 0.75rem) with a small, fixed scale, described in section 4
- **Soft, tokenized elevation** in both modes. Shadows are gentle in light mode and deeper in dark mode, where they do more of the work of separating surfaces
- **OKLCH everywhere**, so steps between tokens are perceptually even

It should feel professional and calm, closer to a well set printed page than to a dashboard.

## 2. Color Palette & Roles

All tokens live in `packages/ui/src/css/globals.css` as CSS variables on `:root` and `.dark`, and are mapped to Tailwind utilities through `@theme inline` (`--background` becomes `bg-background`, `text-background` and so on).

### Surfaces

| Token             | Light Mode                    | Dark Mode              | Role                                                                 |
| ----------------- | ----------------------------- | ---------------------- | -------------------------------------------------------------------- |
| **Background**    | `oklch(99.1% 0.003 85)`       | `oklch(14.5% 0 0)`     | Page canvas                                                          |
| **Foreground**    | `oklch(14.5% 0.004 75)`       | `oklch(98.5% 0 0)`     | Primary text, headings                                               |
| **Card**          | `oklch(100% 0 0)`             | `oklch(21.8% 0 0)`     | Primary containers that sit on the canvas                            |
| **Popover**       | `oklch(100% 0 0)`             | `oklch(23.9% 0 0)`     | Every floating surface: menus, popovers, toasts                      |
| **Surface Muted** | `oklch(96.5% 0.0045 85)`      | `oklch(18.2% 0 0)`     | Recessed areas, preview canvases, the `bg-hatch` fill                |
| **Inverse**       | `oklch(14.5% 0.004 75)`       | `oklch(98.5% 0 0)`     | High contrast fills that flip with the mode, like the default banner |
| **Overlay**       | `oklch(14.5% 0.004 75 / 0.5)` | `oklch(0% 0 0 / 0.72)` | Backdrop behind dialogs, sheets and drawers                          |

Each surface has a matching `*-foreground` token for text on it. In dark mode the surfaces step up in lightness: background 14.5%, surface muted 18.2%, card 21.8%, popover 23.9%. That ordering is why floating surfaces must use `bg-popover` and never `bg-background`: on a dark page a `bg-background` menu has no edge.

### Interactive Colors

| Token                  | Light Mode               | Dark Mode          | Role                                       |
| ---------------------- | ------------------------ | ------------------ | ------------------------------------------ |
| **Primary**            | `oklch(20.5% 0.005 75)`  | `oklch(98.5% 0 0)` | Main buttons, checked controls             |
| **Primary Foreground** | `oklch(98.5% 0.002 85)`  | `oklch(14.5% 0 0)` | Text on primary                            |
| **Secondary**          | `oklch(96% 0.0045 85)`   | `oklch(26.9% 0 0)` | Secondary buttons, chips                   |
| **Accent**             | `oklch(96.8% 0.0045 85)` | `oklch(26.9% 0 0)` | Subtle hover and selected backgrounds      |
| **Muted**              | `oklch(94.2% 0.005 85)`  | `oklch(26.9% 0 0)` | Item highlight in menus, tracks, skeletons |
| **Muted Foreground**   | `oklch(52% 0.0065 75)`   | `oklch(71.5% 0 0)` | Captions, placeholders, secondary text     |
| **Muted Strong**       | `oklch(37% 0.006 75)`    | `oklch(87% 0 0)`   | Long-form reading text                     |

### Lines and Focus

| Token                  | Light Mode               | Dark Mode          | Role                                                        |
| ---------------------- | ------------------------ | ------------------ | ----------------------------------------------------------- |
| **Border**             | `oklch(91.5% 0.0055 85)` | `oklch(26.9% 0 0)` | Default stroke on surfaces and dividers                     |
| **Border Interactive** | `oklch(65% 0.0065 75)`   | `oklch(51% 0 0)`   | Hover and focus-within stroke on fields, scrollbar thumb    |
| **Input**              | `oklch(87% 0.0065 85)`   | `oklch(34.8% 0 0)` | Field strokes; `dark:bg-input/30` tints fields in dark mode |
| **Ring**               | `oklch(65% 0.0065 75)`   | `oklch(98.5% 0 0)` | Focus rings                                                 |
| **Rule**               | `oklch(91.5% 0.0055 85)` | `oklch(26.9% 0 0)` | Editorial hairlines (`section-rule`, `rule-bleed`)          |

### Feedback Colors

Each feedback hue (destructive, warning, success, info) comes as a set of five tokens:

- `--<name>` and `--<name>-foreground`: solid fill and the text on it, for buttons and badges
- `--<name>-text`: the hue tuned for text on a normal surface
- `--<name>-surface` and `--<name>-border`: tinted background and stroke for callouts, banners and toasts

| Hue             | Light solid              | Dark solid                 |
| --------------- | ------------------------ | -------------------------- |
| **Destructive** | `oklch(53% 0.16 27.3)`   | `oklch(71.1% 0.166 22.2)`  |
| **Warning**     | `oklch(53% 0.108 90.4)`  | `oklch(80% 0.111 78.2)`    |
| **Success**     | `oklch(53% 0.156 135.6)` | `oklch(76.9% 0.118 148.9)` |
| **Info**        | `oklch(53% 0.16 260.8)`  | `oklch(87% 0 0)`           |

Info is deliberately neutral in dark mode. Light solids sit at the same lightness so no state shouts louder than another.

### Code

`--code` is the code block background (`bg-code`). `--code-plain`, `--code-comment`, `--code-punctuation`, `--code-keyword`, `--code-string`, `--code-function`, `--code-number` and `--code-tag` color syntax tokens and reuse the feedback hues so highlighting stays in the same family.

### Theming

There are no built-in accent presets. To rebrand, redefine the tokens on `:root` and `.dark`. Components only read tokens, so nothing else needs to change. The theme block in the installation guide is a trimmed copy of `globals.css` and has to be kept in sync when a token is added or renamed.

## 3. Typography Rules

Four font roles, all set by the host app through CSS variables:

- **Sans** `var(--font-sans)`: body text, UI labels, form elements. Body letter spacing is 0.
- **Heading** `var(--font-heading)`: every `h1` to `h6`.
- **Serif** `var(--font-serif)`: long-form reading text through `.prose-reading` (falls back to sans).
- **Mono** `var(--font-mono)`: code and the small uppercase `.section-label`.

All text uses `antialiased` rendering.

## 4. Component Stylings

### Radius Scale

The base is `--radius: 0.75rem`. Tailwind's radius utilities are derived from it:

| Utility       | Value                    | Use                                                                         |
| ------------- | ------------------------ | --------------------------------------------------------------------------- |
| `rounded-sm`  | `--radius * 0.5` (6px)   | Items inside a surface: menu items, tab pill, checkbox, tooltip             |
| `rounded-md`  | `--radius` (12px)        | Controls (button, input, select trigger), floating surfaces, toast, callout |
| `rounded-lg`  | `--radius * 1.33` (16px) | Primary containers: card, dialog                                            |
| `rounded-xl`  | `--radius * 1.66` (20px) | Composer-like shells such as the prompt input                               |
| `rounded-2xl` | `--radius * 2` (24px)    | Drawer and similar large sheets                                             |

`rounded-full` is for avatars, dots, icon buttons and pills that are pills on purpose (the context chip, attachment chips). Nested elements always use a smaller radius than the element that holds them.

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
- **Focus**: a 1px ring in `foreground/10` with the border darkened to `foreground/40`
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

The test in `packages/ui/src/icons/icons.test.tsx` enforces the contract, and `apps/web/src/features/icons/lib/icons.ts` holds the category and tags of every icon for the `/icons` catalog.

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
