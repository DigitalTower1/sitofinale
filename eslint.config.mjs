import next from 'eslint-config-next';

const config = [
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**']
  },
  ...next,
  {
    rules: {
      'react/no-unknown-property': 'off',
      'react-hooks/exhaustive-deps': 'error'
    }
  }
];

export default config;
