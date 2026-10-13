import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const fromHere = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@\/components\//, replacement: fromHere('./src/shared/components/') },
      { find: /^@\/hooks\//, replacement: fromHere('./src/shared/hooks/') },
      { find: /^@\/lib\//, replacement: fromHere('./src/shared/lib/') },
      { find: /^@\/types\//, replacement: fromHere('./src/shared/types/') },
      { find: /^@\//, replacement: fromHere('./src/') },
    ],
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'scripts/**/*.test.mjs'],
  },
});
