import { DRACOLoader } from 'three-stdlib';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { TextureLoader, WebGLRenderer } from 'three';

let dracoLoader: DRACOLoader | null = null;
let ktx2Loader: KTX2Loader | null = null;

export function getDracoLoader() {
  if (dracoLoader) return dracoLoader;
  dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
  return dracoLoader;
}

export function getKtx2Loader(renderer?: WebGLRenderer) {
  if (ktx2Loader) return ktx2Loader;
  ktx2Loader = new KTX2Loader();
  if (renderer) {
    ktx2Loader.setTranscoderPath('https://www.gstatic.com/basis-universal/20231001_02/');
    ktx2Loader.detectSupport(renderer);
  }
  return ktx2Loader;
}

export const textureLoader = new TextureLoader();
