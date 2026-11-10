# Token pipeline

## Shape

```
packages/ui/tokens/themes/<theme>/light.tokens.json
packages/ui/tokens/themes/<theme>/dark.tokens.json
```

Themes today: `nachui` (the site), `default`, `google`, `microsoft`, `mr-robot`.

- `color.<group>.<name>`: `$type: "color"`, `$value: { colorSpace: "oklch" | "srgb", components: [...], alpha?, hex }`. Groups: `surface`, `interactive`, `structure`, `feedback`, `code`. The CSS variable is the leaf name (`--muted-foreground`).
- `elevation.sm|md|lg`: `$type: "shadow"`, `$value: { color, offsetX, offsetY, blur, spread }` → `--elevation-sm`.
- `radius` (light only): `$type: "dimension"`, `$value: { value, unit }` → `--radius`. The scale is derived: sm 0.5x, md 1x, lg 1.33x, xl 1.66x, 2xl 2x.
- `oklch` lightness is 0 to 1 in JSON and printed as a percentage. `hex` is filled in by the build; don't hand-write it.

## What `pnpm --filter @repo/ui tokens` writes

`packages/ui/scripts/build-tokens.mjs`:

1. `globals.css` between `/* tokens:start */` and `/* tokens:end */` (theme `nachui`), and the color, radius and shadow mapping between `/* tokens:theme:start */` and `/* tokens:theme:end */`.
2. `apps/api/src/modules/themes/css/<theme>.css` for every theme, from one template. `nachui init` serves these.
3. The stylesheet in `apps/web/src/content/docs/{en,es}/installation.mdx`.
4. The `hex` fallback inside each JSON.

`--check` exits 1 when anything is stale; `pnpm checks` runs it.

## Tests

- `packages/ui/scripts/theme-contrast.test.ts`: every text pair at AA, every theme, both modes.
- `packages/ui/scripts/contrast.test.ts`: the pairs in `globals.css`, including the 3:1 non-text ones.
- `apps/api/src/modules/themes/theme-contract.spec.ts`: every theme stylesheet declares the contract.
- `apps/web/src/features/themes/lib/tokens.test.ts`: the `/themes` builder prints the same CSS as the API files.
- `apps/web/src/features/docs/mdx/foundations/components.test.ts` asserts the light foreground on background ratio of `nachui`; update that number when it changes.

## Figma

Import `light.tokens.json` and `dark.tokens.json` of a theme as two modes of one variable collection (Tokens Studio or any DTCG importer). Groups become variable groups and names match the CSS variables. The `/themes` page also downloads both files, including custom builds.
