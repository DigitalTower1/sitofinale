'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Html, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useMotionPreferences } from '../hooks/useMotionPreferences';
import { isFeatureEnabled } from '../lib/featureFlags';

const CHAMPAGNE = new THREE.Color('#dcc28a');
const GLASS = new THREE.Color('#1b1e24');

function Tower() {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  const helixCurve = useMemo(() => {
    const points = [] as THREE.Vector3[];
    const height = 3.2;
    for (let i = 0; i <= 160; i += 1) {
      const t = i / 160;
      const angle = t * Math.PI * 5;
      const radius = 0.42 + Math.sin(t * Math.PI) * 0.12 + t * 0.24;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = t * height - height / 2;
      points.push(new THREE.Vector3(x, y, z));
    }
    return new THREE.CatmullRomCurve3(points);
  }, []);

  const ringBands = useMemo(() => {
    return new Array(7).fill(0).map((_, index) => ({
      radius: 0.9 + index * 0.18,
      y: -1.3 + index * 0.52,
      thickness: 0.015 + index * 0.006
    }));
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = t * 0.18;
    group.current.rotation.x = Math.sin(t * 0.12) * 0.08;

    if (core.current) {
      const scale = 1 + Math.sin(t * 1.8) * 0.03;
      core.current.scale.set(scale, scale, scale);
    }

    if (halo.current) {
      halo.current.position.y = Math.sin(t * 1.4) * 0.18 + 0.6;
      halo.current.rotation.z = t * 0.5;
    }
  });

  return (
    <group ref={group} position={[0, -1.1, 0]}>
      <mesh ref={core} position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.46, 0.38, 3.4, 64, 1, true]} />
        <meshPhysicalMaterial
          color={GLASS}
          metalness={0.25}
          roughness={0.18}
          transmission={0.92}
          thickness={0.85}
          clearcoat={0.65}
          clearcoatRoughness={0.08}
          envMapIntensity={1.25}
          opacity={0.96}
          transparent
        />
      </mesh>
      <mesh position={[0, 0.45, 0]}>
        <tubeGeometry args={[helixCurve, 420, 0.065, 32, false]} />
        <meshStandardMaterial
          color={CHAMPAGNE}
          metalness={1}
          roughness={0.22}
          envMapIntensity={1.35}
          emissive={CHAMPAGNE.clone().multiplyScalar(0.18)}
          emissiveIntensity={0.9}
        />
      </mesh>
      {ringBands.map((band, index) => (
        <Float key={index} speed={0.75 + index * 0.12} rotationIntensity={0.18} floatIntensity={0.3}>
          <mesh
            position={[0, band.y + 0.6, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <torusGeometry args={[band.radius, band.thickness, 32, 256]} />
            <meshStandardMaterial
              color={CHAMPAGNE}
              metalness={0.9}
              roughness={0.18}
              envMapIntensity={1.1}
              emissive={CHAMPAGNE.clone().multiplyScalar(0.12)}
            />
          </mesh>
        </Float>
      ))}
      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.6}>
        <mesh ref={halo} position={[0, 0.6, 0]}>
          <ringGeometry args={[0.6, 1.4, 64, 1]} />
          <meshBasicMaterial color={CHAMPAGNE} transparent opacity={0.28} />
        </mesh>
      </Float>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.4, 0]}>
        <ringGeometry args={[1.2, 3.4, 64]} />
        <meshStandardMaterial
          color={GLASS}
          metalness={0.35}
          roughness={0.6}
          transparent
          opacity={0.55}
        />
      </mesh>
      <mesh position={[0, 2.35, 0]}>
        <octahedronGeometry args={[0.35, 0]} />
        <meshStandardMaterial
          color={CHAMPAGNE}
          metalness={1}
          roughness={0.2}
          envMapIntensity={1.4}
          emissive={CHAMPAGNE.clone().multiplyScalar(0.25)}
        />
      </mesh>
    </group>
  );
}

function Particles() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(6000);
    for (let i = 0; i < arr.length; i += 3) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.4 + Math.random() * 1.2;
      const y = Math.random() * 3 - 1;
      arr[i] = Math.cos(angle) * radius;
      arr[i + 1] = y;
      arr[i + 2] = Math.sin(angle) * radius;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.getElapsedTime();
    points.current.rotation.y = t * 0.05;
  });

  return (
    <points ref={points} position={[0, -0.5, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={CHAMPAGNE} size={0.02} sizeAttenuation transparent opacity={0.5} depthWrite={false} />
    </points>
  );
}

type SceneContentProps = {
  onContextLost: () => void;
  onContextRestored: () => void;
};

function SceneContent({ onContextLost, onContextRestored }: SceneContentProps) {
  const { gl } = useThree();
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  useEffect(() => {
    const canvas = gl.domElement;
    const originalCopyFramebufferToTexture = gl.copyFramebufferToTexture.bind(gl);

    gl.copyFramebufferToTexture = ((...rawArgs: unknown[]) => {
      const [first, second, third] = rawArgs;
      if (first instanceof THREE.Vector2 && second instanceof THREE.Texture) {
        return originalCopyFramebufferToTexture(second, first, third as number | undefined);
      }
      return originalCopyFramebufferToTexture(
        ...(rawArgs as Parameters<typeof originalCopyFramebufferToTexture>)
      );
    }) as typeof gl.copyFramebufferToTexture;

    const webglContext = canvas.getContext('webgl2') ?? canvas.getContext('webgl');

    if (webglContext && 'pixelStorei' in webglContext) {
      const ctx = webglContext as WebGLRenderingContext;
      ctx.pixelStorei(ctx.UNPACK_PREMULTIPLY_ALPHA_WEBGL, 0);
      ctx.pixelStorei(ctx.UNPACK_FLIP_Y_WEBGL, 0);
    }

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      onContextLost();
    };

    const handleContextRestored = () => {
      onContextRestored();
    };

    canvas.addEventListener('webglcontextlost', handleContextLost, { passive: false });
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      gl.copyFramebufferToTexture = originalCopyFramebufferToTexture;
    };
  }, [gl, onContextLost, onContextRestored]);

  return (
    <>
      <color attach="background" args={[0x050505]} />
      <fog attach="fog" args={[0x050505, 8, 24]} />
      <PerspectiveCamera makeDefault fov={42} position={[0, 1.6, 6]} />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      <ambientLight intensity={0.28} />
      <directionalLight position={[4, 6, 2]} intensity={1.3} color={0xffe2b2} castShadow />
      <spotLight position={[-3, 3, 4]} angle={Math.PI / 5} intensity={1.1} color={0xf5f1e8} penumbra={0.65} />
      <Environment preset="sunset" background={false} />
      <group>
        <Tower />
        {!reducedMotion && <Particles />}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
          <circleGeometry args={[6, 64]} />
          <meshStandardMaterial
            color={0x070709}
            metalness={0.6}
            roughness={0.32}
            envMapIntensity={0.8}
          />
        </mesh>
      </group>
      <EffectComposer multisampling={1}>
        {isFeatureEnabled('ENABLE_BLOOM') && <Bloom intensity={0.55} luminanceThreshold={0.4} luminanceSmoothing={0.12} />}
        <ToneMapping adaptive={false} mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette eskil={false} offset={0.3} darkness={0.6} />
      </EffectComposer>
      <Html position={[0, 2.6, 0]} center className="hero__badge">
        <span>Luxury Marketing</span>
      </Html>
    </>
  );
}

export function HeroScene() {
  const { reducedMotion } = useMotionPreferences();
  const [contextLost, setContextLost] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleContextLost = useCallback(() => {
    setContextLost(true);
  }, []);

  const handleContextRestored = useCallback(() => {
    setContextLost(false);
  }, []);

  const handleRetry = useCallback(() => {
    setContextLost(false);
    setResetKey((value) => value + 1);
  }, []);

  if (!isFeatureEnabled('ENABLE_3D')) {
    return null;
  }

  return (
    <div className="hero__canvas-wrapper">
      {contextLost && (
        <div role="status" className="hero__canvas-fallback">
          <p>La scena interattiva è stata messa in pausa per risparmiare risorse.</p>
          <button type="button" onClick={handleRetry} className="hero__canvas-retry">
            Ricarica esperienza
          </button>
        </div>
      )}
      <Canvas
        key={resetKey}
        gl={{ antialias: true, stencil: false, depth: true, powerPreference: 'high-performance' }}
        dpr={[1, 1.4]}
        performance={{ min: 0.5 }}
        className={reducedMotion ? 'hero__canvas hero__canvas--static' : 'hero__canvas'}
        onCreated={() => {
          setContextLost(false);
        }}
      >
        <Suspense fallback={null}>
          <SceneContent onContextLost={handleContextLost} onContextRestored={handleContextRestored} />
        </Suspense>
      </Canvas>
    </div>
  );
}
