import fs from 'node:fs';
import path from 'node:path';

const manifestPath = path.resolve('assets-manifest.json');

const manifest = {
  hdris: [{ name: 'sunset-preset', source: 'drei:preset:sunset', usage: 'Hero IBL' }],
  gltf: [{ name: 'digital-tower-core', tris: 120000, size: '3.4MB (draco)', textures: ['tower-albedo.ktx2'] }],
  textures: [{ name: 'tower-albedo.ktx2', size: '640KB', type: 'KTX2', usage: 'Tower metal' }]
};

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log('Manifest aggiornato', manifestPath);
