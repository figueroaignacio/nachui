# Design tokens

This folder is the single source of truth for every theme. Each theme has two files in the [Design Tokens Community Group](https://www.designtokens.org/) format, one per mode:

```
themes/
  nachui/        the theme the docs site and the components are designed on
    light.tokens.json
    dark.tokens.json
  default/ google/ microsoft/ mr-robot/
```

Colors keep the color space they were designed in (`oklch` for NachUI, `srgb` for themes built from brand hex values) and carry a `hex` fallback for tools that only read sRGB.

## Editing a token

1. Change the value in the JSON file, in both modes when the token has a dark value.
2. Run `pnpm --filter @repo/ui tokens`.
3. Commit the JSON together with the files it rewrote.

The build writes:

- the `:root` and `.dark` blocks and the Tailwind mapping in `src/css/globals.css`
- one complete stylesheet per theme in `apps/api/src/modules/themes/css/`, which `nachui init` installs
- the stylesheet in the installation guide, in English and Spanish
- the `hex` fallback inside these JSON files

`pnpm checks` fails when any of those is out of date, so a token never changes in one place only.

## Adding a theme

Copy a theme folder, rename it and change the values. Every theme declares the same tokens; the build stops if a light token has no dark value. Run the build and the new stylesheet appears in the API, ready for `nachui init`.

## Using the tokens in Figma

Import `light.tokens.json` and `dark.tokens.json` of a theme as two modes of one variable collection, with Tokens Studio or any plugin that reads the DTCG format. Group names (`color/surface`, `color/feedback`, `elevation`) become variable groups, and each variable keeps the CSS name the components use, so a designer and a developer talk about the same `muted-foreground`.
