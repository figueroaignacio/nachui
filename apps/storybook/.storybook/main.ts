import type { StorybookConfig } from '@storybook/react-vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { PluginOption } from 'vite';
import { mergeConfig } from 'vite';

const pluginNames = (plugins: PluginOption[] = []): string[] =>
  plugins.flatMap((plugin) => {
    if (Array.isArray(plugin)) return pluginNames(plugin);
    if (plugin && typeof plugin === 'object' && 'name' in plugin) return [plugin.name];
    return [];
  });

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.tsx'],
  staticDirs: ['../public'],
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y'],
  framework: { name: '@storybook/react-vite', options: {} },
  typescript: { reactDocgen: 'react-docgen' },
  core: { disableTelemetry: true },
  async viteFinal(viteConfig) {
    const names = pluginNames(viteConfig.plugins);
    const hasReact = names.some((name) => name.startsWith('vite:react'));
    return mergeConfig(viteConfig, {
      build: { chunkSizeWarningLimit: 2000 },
      plugins: [tailwindcss(), ...(hasReact ? [] : [react()])],
    });
  },
};

export default config;
