import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';

export const config = tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/.velite/**',
      '**/node_modules/**',
      '**/.content-collections/**',
      'packages/ui/src/lib/registry.ts',
      'apps/web/src/shared/components/mdx/demo-registry.tsx',
      'apps/web/src/features/gallery/lib/example-registry.tsx',
      'apps/web/src/features/icons/lib/icon-registry.tsx',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  jsxA11y.flatConfigs.recommended,
  {
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
    },
    rules: {
      ...reactHooksPlugin.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
);
