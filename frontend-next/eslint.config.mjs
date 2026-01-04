import nextConfig from 'eslint-config-next';
import storybookPlugin from 'eslint-plugin-storybook';
import prettierConfig from 'eslint-config-prettier';

const storybookConfigs = storybookPlugin.configs['flat/recommended'] ?? [];

const eslintConfig = [
  {
    ignores: ['.next/**', 'out/**', 'storybook-static/**', 'node_modules/**'],
  },
  ...nextConfig,
  ...storybookConfigs,
  prettierConfig,
];

export default eslintConfig;

