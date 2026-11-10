# Audit checklist

Compare each capture with `DESIGN.md` and with the closest component that already sets the standard.

| Area | Look for | Standard |
| --- | --- | --- |
| Tokens | Hex or Tailwind palette colors (`bg-white`, `text-gray-500`), `bg-background` on a floating surface, feedback text using the solid hue instead of `-text` | `DESIGN.md` §2 |
| Radius | Values off the scale, a nested element rounder than its parent, pill buttons that are not icon buttons | `DESIGN.md` §4 Radius Scale |
| Elevation | `shadow-xl`, arbitrary shadows, shadows on in-flow cards | `DESIGN.md` §4 Elevation Scale |
| Spacing | Controls off `h-8/h-9/h-10`, menu padding not `p-1`, popover padding not `p-4`, touch targets under 44px | `DESIGN.md` §4, §5 |
| Focus | Missing ring, ring without `ring-offset-background` (white halo in dark), focus on the wrong element after open or close | `DESIGN.md` §4 Buttons |
| Variants | Same variant name meaning different things across components, a variant missing where its siblings have it | Closest sibling (Button, Badge, Toggle) |
| States | Hover, pressed, disabled, loading, empty, error or invalid missing or styled differently from siblings | `DESIGN.md` §4 Inputs, guidelines pages |
| Motion | Local springs, durations on state changes, animated `width`/`top`/`left`, no reduced-motion path | `DESIGN.md` §7, `lib/motion.ts` |
| Dark mode | Unreadable text or borders, light-only images, a `dark:` variant that leaks into a light preview | `DESIGN.md` §5 Dark Mode |
| RTL | Physical classes, chevrons that don't flip, arrow keys that don't invert | `check:logical`, `lib/direction.ts` |
| API | Same concept with different prop names (`onChange` vs `onValueChange`), missing `data-slot`/`data-state`, controlled pair not through `useControllableState` | `select.tsx`, `nachui-component-authoring` |
| Copy | Em or en dashes, title case, AI boilerplate, en/es pages that say different things, missing Spanish page | `CLAUDE.md` copy rule, guidelines/writing |
| Docs | Page sections out of order, demo missing for a documented variant, keyboard table that doesn't match behaviour, page missing from `llms.txt` | `nachui-component-authoring` docs reference |
| Accessibility | Contrast under AA, icon buttons without a name, meaning only in color, keyboard dead ends | `.agents/skills/accessibility`, `scripts/theme-contrast.test.ts` |

Quick signals before capturing:

```bash
pnpm --filter @repo/ui check:logical
grep -rnE "#[0-9a-fA-F]{3,6}\b|bg-white|text-black|shadow-(xl|2xl)" packages/ui/src/{components,layout,ai,hybrids}
grep -rn "—\|–" apps/web/src/content
```

A grep hit is a lead, not a finding: confirm it in a capture.
