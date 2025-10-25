import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [...nextCoreWebVitals];
const ignoreEntry = config.find((entry) => Array.isArray(entry?.ignores));

if (ignoreEntry) {
  const existingIgnores = Array.isArray(ignoreEntry.ignores) ? ignoreEntry.ignores : [];
  ignoreEntry.ignores = Array.from(new Set([...existingIgnores, 'dist', 'node_modules']));
} else {
  config.push({ ignores: ['dist', 'node_modules'] });
}

export default config;
