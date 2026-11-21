import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

addons.setConfig({
  theme: create({
    base: 'light',
    brandTitle: 'NachUI',
    brandUrl: 'https://nachui.tech',
    brandImage: './nachui-logo.svg',
    brandTarget: '_blank',
    colorPrimary: '#f26829',
    colorSecondary: '#bf4213',
    appBg: '#f2f2f2',
    appContentBg: '#ffffff',
    appBorderColor: '#d9d9d9',
    appBorderRadius: 12,
    textColor: '#141414',
    textMutedColor: '#585858',
    barBg: '#ffffff',
    fontBase: '"Hanken Grotesk", ui-sans-serif, system-ui, sans-serif',
    fontCode: '"DM Mono", ui-monospace, monospace',
  }),
});
