# Design System: NachUI

## 1. Visual Theme & Atmosphere

NachUI embodies a **Clean, Clinical Minimalist** aesthetic. The design language prioritizes clarity and precision through:

- **High-fidelity whites** with subtle blue undertones creating an airy, trustworthy foundation
- **Generous corner radius** (1rem / 16px) softening all interactive elements without losing structure
- **Subtle elevation** through OKLCH color space for rich, perceptual uniformity
- **Purposeful contrast** between foreground text and backgrounds using strict luminance separation

The atmosphere is professional yet approachable—suitable for both enterprise dashboards and consumer applications. Dark mode maintains the same structural integrity with inverted luminance values.

## 2. Color Palette & Roles

### Core Semantic Colors

| Token               | Light Mode                       | Dark Mode                     | Role                         |
| ------------------- | -------------------------------- | ----------------------------- | ---------------------------- |
| **Background**      | `oklch(99.5% 0.005 250)` #F8FAFC | `oklch(14% 0.01 250)` #1E293B | Page canvas, primary surface |
| **Foreground**      | `oklch(15% 0.01 250)` #1E293B    | `oklch(98% 0 0)` #FAFAFA      | Primary text, headings       |
| **Card**            | `oklch(98% 0.005 250)` #F1F5F9   | `oklch(18% 0.01 250)` #334155 | Elevated containers          |
| **Card Foreground** | `oklch(15% 0.01 250)` #1E293B    | `oklch(98% 0 0)` #FAFAFA      | Card text content            |
| **Border**          | `oklch(90% 0.01 250)` #E2E8F0    | `oklch(25% 0.01 250)` #475569 | Dividers, input strokes      |
| **Input**           | `oklch(90% 0.01 250)` #E2E8F0    | `oklch(25% 0.01 250)` #475569 | Form field backgrounds       |

### Interactive Colors

| Token                    | Light Mode                    | Dark Mode                     | Role                        |
| ------------------------ | ----------------------------- | ----------------------------- | --------------------------- |
| **Primary**              | `oklch(60% 0.2 45)` #0EA5E9   | `oklch(65% 0.2 45)` #38BDF8   | CTAs, links, focus states   |
| **Primary Foreground**   | `oklch(99% 0 0)` #FCFCFD      | `oklch(14% 0.01 250)` #1E293B | Text on primary buttons     |
| **Secondary**            | `oklch(95% 0.01 250)` #F1F5F9 | `oklch(22% 0.02 250)` #3B4A5C | Secondary actions           |
| **Secondary Foreground** | `oklch(15% 0.01 250)` #1E293B | `oklch(98% 0 0)` #FAFAFA      | Text on secondary surfaces  |
| **Accent**               | `oklch(95% 0.01 250)` #F1F5F9 | `oklch(20% 0.02 250)` #3B4A5C | Highlights, selected states |
| **Accent Foreground**    | `oklch(60% 0.2 45)` #0EA5E9   | `oklch(65% 0.2 45)` #38BDF8   | Text on accent surfaces     |
| **Ring**                 | `oklch(60% 0.2 45)` #0EA5E9   | `oklch(65% 0.2 45)` #38BDF8   | Focus ring color            |

### Feedback Colors

| Token                      | Light Mode                        | Dark Mode                         | Role                          |
| -------------------------- | --------------------------------- | --------------------------------- | ----------------------------- |
| **Destructive**            | `oklch(57.7% 0.245 27.3)` #F43F5E | `oklch(39.6% 0.141 25.7)` #FB7185 | Error states, delete actions  |
| **Destructive Foreground** | `oklch(98.5% 0 0)` #FFFFFF        | `oklch(98.5% 0 0)` #FFFFFF        | Text on destructive           |
| **Warning**                | `oklch(76.9% 0.135 71.3)` #F59E0B | `oklch(83.7% 0.164 84.4)` #FBBF24 | Caution states                |
| **Warning Foreground**     | `oklch(20.5% 0 0)` #1F2937        | `oklch(14.5% 0 0)` #1F2937        | Text on warning               |
| **Success**                | `oklch(62.7% 0.17 149.2)` #14B8A6 | `oklch(80% 0.182 151.7)` #2DD4BF  | Confirmation, positive states |
| **Success Foreground**     | `oklch(98.5% 0 0)` #FFFFFF        | `oklch(14.5% 0 0)` #1F2937        | Text on success               |
| **Info**                   | `oklch(60% 0.15 250)` #0EA5E9     | `oklch(50% 0.15 250)` #60A5FA     | Informational alerts          |
| **Info Foreground**        | `oklch(98.5% 0 0)` #FFFFFF        | `oklch(98.5% 0 0)` #FFFFFF        | Text on info                  |

### Muted / Supporting

| Token                | Light Mode                    | Dark Mode                     | Role                  |
| -------------------- | ----------------------------- | ----------------------------- | --------------------- |
| **Muted**            | `oklch(95% 0.01 250)` #F1F5F9 | `oklch(22% 0.02 250)` #3B4A5C | Disabled backgrounds  |
| **Muted Foreground** | `oklch(50% 0.01 250)` #94A3B8 | `oklch(70% 0.01 250)` #94A3B8 | Placeholder, captions |

### Theme Color Overrides

The system supports per-component theme overrides via `data-theme-color`:

- **Zinc**: Monochrome neutral (`--primary: oklch(20.5% 0 0)` / dark: `--primary: oklch(98.5% 0 0)`)
- **Green**: Nature accent (`--primary: oklch(65% 0.15 150)`)
- **Blue**: Default sky accent (`--primary: oklch(60% 0.15 250)`)
- **Rose**: Warm accent (`--primary: oklch(60% 0.2 15)`)

## 3. Typography Rules

The system defines two typographic roles:

- **Body Font**: `var(--font-sans)` — Used for body text, UI labels, and form elements. Features `tracking-wide` for improved readability at small sizes.
- **Heading Font**: `var(--font-heading)` — Used for all `h1-h6` elements. Provides visual hierarchy through weight and size variations.

All text uses `antialiased` rendering for crisp edges on high-DPI displays.

## 4. Component Stylings

### Buttons & Interactive Elements

- **Shape**: Pill-shaped (fully rounded via `--radius: 1rem`)
- **Corner Radius Variants**:
  - `--radius-sm`: `calc(1rem - 0.75rem)` = 0.25rem (Subtle)
  - `--radius-md`: `calc(1rem - 0.5rem)` = 0.5rem (Default)
  - `--radius-lg`: `1rem` (Prominent)
  - `--radius-xl`: `calc(1rem + 0.5rem)` = 1.5rem (Floating)
  - `--radius-2xl`: `calc(1rem + 1rem)` = 2rem (Hero)
- **Focus States**: 2px ring using `--ring` color for accessibility
- **Hover**: Subtle background shifts to `--secondary` / `--accent`

### Cards & Containers

- **Corner Radius**: Full `--radius` (1rem) for primary cards; `--radius-md` for nested elements
- **Background**: `--card` provides elevation distinction from `--background`
- **Shadow**: Light mode is flat; dark mode includes `--shadow-lg: 0 10px 30px -10px oklch(0% 0 0 / 0.9)` for depth
- **Grid**: Subtle `--grid-color: oklch(0% 0 0 / 0.05)` for decorative grid overlays

### Inputs & Forms

- **Background**: `--input` (matches `--border` lightness)
- **Border**: 1px solid `--input`
- **Focus**: Ring via `--ring` color
- **States**: Uses `--muted` for disabled backgrounds, `--muted-foreground` for placeholder text

### Scrollbars

- **Width**: 6px thin scrollbars
- **Track**: Transparent (light) / `#000000` (dark)
- **Thumb**: Rounded 10px, uses `--border` color
- **Custom Utility**: `.hide-scrollbar` for overflow scrolling areas

## 5. Layout Principles

### Spacing & Rhythm

- **Base Radius**: 1rem creates consistent curvature across all component types
- **Component Spacing**: Inherits from Tailwind's spacing scale via semantic tokens
- **Scroll Behavior**: Smooth scroll enabled globally

### Accessibility

- **Reduced Motion**: Respects `prefers-reduced-motion: reduce` by disabling animations/transitions
- **Color Contrast**: All foreground/background combinations meet WCAG AA minimums
- **Focus Indicators**: Visible ring states on all interactive elements
- **Scrollbar Safety**: `scrollbar-width: thin` with fallback for webkit browsers

### Dark Mode Strategy

- Complete luminance inversion with preserved hue relationships
- Dark mode shadows provide depth without harsh black overlays
- Theme overrides allow component-level color customization while maintaining dark mode structure

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

## 7. Technical Notes

- **Color Space**: OKLCH for perceptually uniform, gamut-safe color definitions
- **CSS Variables**: All tokens exposed as `--color-*` for runtime theming
- **Tailwind v4**: Uses `@theme inline` to map CSS variables to utility classes
- **Source Path**: Components scanned from `../../../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}`
