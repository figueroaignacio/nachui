# NachUI design rules

`DESIGN.md` holds every value: tokens, radius scale, elevation, focus, motion, icons. Read the section you need before you draw or code. These rules cover what `DESIGN.md` leaves to the code.

## Where each rule lives

| Topic | Source |
| --- | --- |
| Colors, surfaces, feedback hues | `DESIGN.md` §2, tokens in `packages/ui/tokens/themes/nachui/*.tokens.json` |
| Type roles and scale | `DESIGN.md` §3, `/docs/foundations/typography` |
| Radius, elevation, floating surfaces, inputs | `DESIGN.md` §4 |
| Spacing, page frame, dark mode | `DESIGN.md` §5 |
| Icons | `DESIGN.md` §6 and `packages/ui/src/icons/icons.test.tsx` |
| Motion | `DESIGN.md` §7 and `packages/ui/src/lib/motion.ts` |
| When to use which component, writing | `/docs/guidelines/*` (`apps/web/src/content/docs/en/guidelines/`) |

## Catalog rules (`packages/ui`)

- Reuse before you write: search `packages/ui/src/{components,layout,ai,hybrids}` and `src/lib` first. A fix to a shared piece lands in that piece and is checked in every caller.
- Compound API with `Object.assign(Root, { Part })`, `ref` as a prop, `useControllableState` for every controlled pair.
- Classes through `cn(...)` and `cva`. Logical classes only (`ms`, `pe`, `start`, `end`, `text-start`); `check:logical` fails on physical ones.
- Colors only from tokens (`bg-popover`, `text-muted-foreground`), never hex or `bg-white`. Floating surfaces use `bg-popover`, never `bg-background`.
- Every part gets `data-slot`, and `data-state` wherever it has one.
- No comments in component, demo or brick source (`check:comments`).
- Runtime deps: `clsx`, `tailwind-merge`, `motion`, `class-variance-authority`, `zod`. Icons are inline SVG components.

## Visual language

- Quiet and editorial: hierarchy from contrast, type and space. Color goes on state and meaning, not chrome.
- Buttons are `rounded-md`; `rounded-full` only for icon buttons that are round on purpose, avatars, dots and pills.
- Cards stay flat (`border` + `bg-card`); shadows only on floating and modal surfaces.
- Sentence case for headings, labels and buttons. Mono uppercase is reserved for the small section labels the site already uses.

## Copy

- Every page and message exists in en and es with the same keys (`check-locales`). Spanish docs use voseo, like the existing pages.
- No em dashes or en dashes anywhere. No AI boilerplate. Buttons are verb plus object.
- Demo copy is realistic English, never lorem ipsum.
- Frontmatter values with `: ` must be quoted, or the page silently disappears (`check-navigation` catches it).
