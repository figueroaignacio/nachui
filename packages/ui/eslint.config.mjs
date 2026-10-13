import { config } from '@repo/eslint-config';

export default [
  ...config,
  {
    files: ['scripts/**/*.{js,mjs}'],
    languageOptions: {
      globals: { console: 'readonly', process: 'readonly' },
    },
  },
  {
    files: ['src/**/*.tsx'],
    rules: {
      // Let the rule see through the catalog's own form controls, which render
      // a native input inside.
      'jsx-a11y/label-has-associated-control': [
        'error',
        { controlComponents: ['Checkbox', 'Radio', 'Switch', 'Input', 'Textarea'], depth: 3 },
      ],
    },
  },
  {
    // Catalog source is shown verbatim in the docs and must stay comment-free,
    // so the few jsx-a11y false positives are switched off here, per file,
    // instead of with inline eslint-disable comments.
    files: ['src/components/tooltip.tsx', 'src/components/hover-card.tsx'],
    rules: {
      // Without asChild the trigger renders its own wrapper, and that wrapper
      // has to be focusable so keyboard users can open the popup.
      'jsx-a11y/no-noninteractive-tabindex': 'off',
    },
  },
  {
    files: ['src/components/resizable.tsx'],
    rules: {
      // A focusable separator with aria-valuenow is a widget in WAI-ARIA 1.2,
      // but jsx-a11y still classifies `separator` as non-interactive.
      'jsx-a11y/no-noninteractive-element-interactions': 'off',
    },
  },
  {
    files: ['src/components/context-menu.tsx'],
    rules: {
      // The trigger is a focusable region that opens the menu with Shift+F10
      // or the ContextMenu key. It wraps arbitrary content, so it cannot take
      // an interactive role like button without nesting interactive content.
      'jsx-a11y/no-static-element-interactions': 'off',
    },
  },
];
