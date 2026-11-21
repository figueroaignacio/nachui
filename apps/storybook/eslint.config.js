import { config } from '@repo/eslint-config';

export default [...config, { ignores: ['src/generated/**', 'storybook-static/**'] }];
