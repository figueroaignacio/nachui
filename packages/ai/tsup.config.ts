import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    providers: 'src/providers.ts',
    prompts: 'src/prompts/system-prompt.ts',
    agent: 'src/agent.ts',
    tools: 'src/tools/index.ts',
    studio: 'src/studio/index.ts',
    'studio-core': 'src/studio/core.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  sourcemap: true,
  minify: true,
});
