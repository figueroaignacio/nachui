/**
 * The set of CSS custom properties every theme must declare, in both its
 * `:root` and `.dark` blocks.
 *
 * This is a plain list rather than a `_contract.css` with defaults on purpose:
 * `ThemesService` reads each theme file and ships its raw text to the user's
 * project, so an `@import './_contract.css'` would dangle once it got there.
 * A shared CSS file would also show up as a selectable theme, because
 * `getAllThemes()` lists every file in the css directory.
 *
 * Anything `@repo/ui` or `apps/web` resolves at runtime belongs here. A theme
 * that omits a token silently inherits the base palette — that is how the
 * warm hue-70 rule and code colours leaked into the google theme.
 */
export const THEME_CONTRACT = [
  // Canvas and surfaces
  '--background',
  '--foreground',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--surface-muted',

  // Interactive
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--accent',
  '--accent-foreground',
  '--muted',
  '--muted-foreground',
  '--muted-strong',
  '--inverse',
  '--inverse-foreground',

  // Structure
  '--border',
  '--border-interactive',
  '--input',
  '--ring',
  '--rule',
  '--grid-color',

  // Feedback: solid / text / surface / border per hue
  '--destructive',
  '--destructive-foreground',
  '--destructive-text',
  '--destructive-surface',
  '--destructive-border',
  '--warning',
  '--warning-foreground',
  '--warning-text',
  '--warning-surface',
  '--warning-border',
  '--success',
  '--success-foreground',
  '--success-text',
  '--success-surface',
  '--success-border',
  '--info',
  '--info-foreground',
  '--info-text',
  '--info-surface',
  '--info-border',

  // Scrim and elevation
  '--overlay',
  '--elevation-sm',
  '--elevation-md',
  '--elevation-lg',

  // Code surface and syntax. Consumed by apps/web, in the Prism theme of
  // codeblock.tsx — not by @repo/ui, so a contract test that only looks at
  // the component package would miss exactly these.
  '--code',
  '--code-plain',
  '--code-comment',
  '--code-punctuation',
  '--code-keyword',
  '--code-string',
  '--code-function',
  '--code-number',
  '--code-tag',
] as const;

/**
 * Tokens that carry the same value in both modes, so they are declared once in
 * `:root` and inherited by `.dark`. Requiring them per-block would be wrong:
 * a corner radius has no light and dark variant.
 */
export const THEME_CONTRACT_ROOT_ONLY = ['--radius'] as const;

export type ThemeToken = (typeof THEME_CONTRACT)[number];
