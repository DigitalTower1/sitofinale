#!/usr/bin/env node
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const args = process.argv.slice(2);

const env = { ...process.env };
if (!env.TAILWIND_DISABLE_LIGHTNINGCSS) {
  env.TAILWIND_DISABLE_LIGHTNINGCSS = '1';
}
if (!env.NEXT_DISABLE_TURBOPACK) {
  env.NEXT_DISABLE_TURBOPACK = '1';
}
if (!env.CSS_TRANSFORMER_WASM) {
  env.CSS_TRANSFORMER_WASM = '1';
}

const require = createRequire(import.meta.url);
const nextBin = require.resolve('next/dist/bin/next');

const child = spawn(process.execPath, [nextBin, ...args], {
  stdio: 'inherit',
  env
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});
