'use client';

import { EffectComposer, Bloom, ChromaticAberration, DepthOfField, GodRays, HueSaturation, Noise, N8AO, BrightnessContrast, Vignette } from '@react-three/postprocessing';
import { useThree } from '@react-three/fiber';
import { useMotionPreferences } from './LenisProvider';
import { BlendFunction } from 'postprocessing';
import { useCallback, useMemo, useState } from 'react';
import * as THREE from 'three';

export default function PostFX({ reduced }: { reduced: boolean }) {
  const { gl } = useThree();
  const { reduced: prefersReduced } = useMotionPreferences();
  const [sun, setSun] = useState<THREE.Mesh | null>(null);
  const isWebGL2 = useMemo(() => gl.getContext() instanceof WebGL2RenderingContext, [gl]);
  const handleSunRef = useCallback((node: THREE.Mesh | null) => {
    setSun(node);
  }, []);

  if (prefersReduced) {
    return null;
  }

  return (
    <>
      <mesh ref={handleSunRef} position={[6, 12, -10]} scale={4} visible={false}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#ff9f1a" />
      </mesh>
      <EffectComposer disableNormalPass>
        <N8AO aoRadius={1.25} intensity={reduced ? 0.8 : 1.6} distanceFalloff={1.2} />
        {isWebGL2 && sun && <GodRays sun={sun} samples={60} density={0.9} decay={0.92} weight={0.65} />}
        <Bloom
          intensity={reduced ? 0.35 : 0.65}
          mipmapBlur
          luminanceThreshold={0.32}
          luminanceSmoothing={0.9}
        />
        <HueSaturation saturation={0.05} hue={0.02} />
        <BrightnessContrast brightness={0.0} contrast={0.1} />
        <DepthOfField focusDistance={0.012} focalLength={0.038} bokehScale={reduced ? 1.2 : 2.4} />
        <ChromaticAberration offset={[0.0009, 0.0006]} radialModulation={true} modulationOffset={0.3} />
        <Noise premultiply blendFunction={BlendFunction.SCREEN} opacity={reduced ? 0.08 : 0.18} />
        <Vignette eskil={false} offset={0.3} darkness={0.8} />
      </EffectComposer>
    </>
  );
}
