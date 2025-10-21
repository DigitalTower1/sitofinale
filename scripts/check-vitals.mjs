import fs from 'node:fs';
import path from 'node:path';

const budgets = {
  js: 180,
  css: 60,
  images: 300
};

function formatSize(bytes) {
  return (bytes / 1024).toFixed(2) + ' kB';
}

function checkBundleSizes() {
  const statsPath = path.join('.next', 'build-manifest.json');
  if (!fs.existsSync(statsPath)) {
    console.warn('Build manifest non trovato. Esegui `next build` prima di `check:vitals`.');
    process.exit(0);
  }

  const manifest = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
  const initial = Object.values(manifest.pages['/'] || {});
  const sizes = initial
    .map((asset) => path.join('.next', asset))
    .filter((asset) => fs.existsSync(asset))
    .map((asset) => ({
      name: asset,
      size: fs.statSync(asset).size
    }));

  const jsSize = sizes.filter(({ name }) => name.endsWith('.js')).reduce((acc, item) => acc + item.size, 0) / 1024;
  const cssSize = sizes.filter(({ name }) => name.endsWith('.css')).reduce((acc, item) => acc + item.size, 0) / 1024;

  if (jsSize > budgets.js) {
    console.error(`JS bundle (${formatSize(jsSize * 1024)}) supera il budget di ${budgets.js} kB.`);
    process.exit(1);
  }

  if (cssSize > budgets.css) {
    console.error(`CSS bundle (${formatSize(cssSize * 1024)}) supera il budget di ${budgets.css} kB.`);
    process.exit(1);
  }

  console.log(`Budgets rispettati: JS ${formatSize(jsSize * 1024)}, CSS ${formatSize(cssSize * 1024)}`);
}

checkBundleSizes();
