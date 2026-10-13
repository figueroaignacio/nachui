import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  dts: false,
  clean: true,
  minify: true,
  sourcemap: false,
  shims: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
