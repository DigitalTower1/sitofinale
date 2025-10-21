'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, Float, Html, OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ToneMapping, SSR } from '@react-three/postprocessing';
import { BlendFunction, ToneMappingMode } from 'postprocessing';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useMotionPreferences } from '../hooks/useMotionPreferences';
import { isFeatureEnabled } from '../lib/featureFlags';

const CHAMPAGNE = new THREE.Color('#dcc28a');
const GLASS = new THREE.Color('#1b1e24');

function Tower() {
  const group = useRef<THREE.Group>(null);
  const rings = useMemo(() => {
    return new Array(12).fill(0).map((_, index) => ({
      radius: 0.6 + index * 0.08,
      height: 0.15,
      y: index * 0.22,
      tilt: (index % 2 === 0 ? 1 : -1) * 0.08
    }));
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t * 0.2) * 0.25;
    group.current.rotation.x = Math.sin(t * 0.15) * 0.1;
  });

  return (
    <group ref={group} position={[0, -1.2, 0]}>
      {rings.map((ring, index) => (
        <mesh key={index} rotation={[0, 0, ring.tilt]} position={[0, ring.y, 0]}>
          <cylinderGeometry args={[ring.radius, ring.radius * 0.96, ring.height, 64, 1, true]} />
          <meshStandardMaterial
            metalness={0.9}
            roughness={0.28}
            envMapIntensity={1.1}
            color={CHAMPAGNE}
            emissive={CHAMPAGNE.clone().multiplyScalar(0.1)}
          />
        </mesh>
      ))}
      <mesh position={[0, rings[rings.length - 1].y + 0.5, 0]}>
        <sphereGeometry args={[0.4, 64, 64]} />
        <meshPhysicalMaterial
          color={CHAMPAGNE}
          metalness={0.9}
          roughness={0.18}
          clearcoat={0.5}
          clearcoatRoughness={0.1}
        />
      </mesh>
      <Float speed={1} rotationIntensity={0.15} floatIntensity={0.6}>
        <mesh position={[0, rings[rings.length - 1].y + 1.2, 0]}>
          <torusGeometry args={[0.8, 0.025, 16, 128]} />
          <meshStandardMaterial
            color={CHAMPAGNE}
            metalness={1}
            roughness={0.15}
            emissive={CHAMPAGNE.clone().multiplyScalar(0.2)}
          />
        </mesh>
      </Float>
      <group position={[0, -0.2, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.1, 3.2, 64]} />
          <meshStandardMaterial
            color={GLASS}
            metalness={0.4}
            roughness={0.55}
            transparent
            opacity={0.5}
          />
        </mesh>
      </group>
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

function SceneContent() {
  const { gl } = useThree();
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  }, [gl]);

  return (
    <>
      <color attach="background" args={[0x050505]} />
      <fog attach="fog" args={[0x050505, 8, 24]} />
      <PerspectiveCamera makeDefault fov={42} position={[0, 1.6, 6]} />
      <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[4, 6, 2]} intensity={2.2} color={0xffe2b2} castShadow />
      <spotLight position={[-3, 3, 4]} angle={Math.PI / 5} intensity={2.4} color={0xf5f1e8} penumbra={0.6} />
      <Environment preset="sunset" background={false} intensity={0.9} />
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
      <EffectComposer multisampling={2} disableNormalPass={!isFeatureEnabled('ENABLE_SSR_REFL')}>
        {isFeatureEnabled('ENABLE_BLOOM') && <Bloom intensity={0.85} luminanceThreshold={0.4} luminanceSmoothing={0.12} />}
        {isFeatureEnabled('ENABLE_SSR_REFL') && (
          <SSR
            intensity={0.25}
            exponent={1}
            distance={10}
            fade={2}
            roughnessFade={1}
            thickness={8}
            ior={1.45}
            maxRoughness={0.6}
            maxDepthDifference={0.4}
            blend={BlendFunction.NORMAL}
            correctionRadius={1.5}
            useNormalMap={false}
            useRoughnessMap={false}
            resolutionScale={1}
            blur={0.5}
            steps={20}
            refineSteps={4}
          />
        )}
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

  if (!isFeatureEnabled('ENABLE_3D')) {
    return null;
  }

  return (
    <Canvas
      gl={{ antialias: true, stencil: false, depth: true, powerPreference: 'high-performance' }}
      dpr={[1, 1.8]}
      performance={{ min: 0.5 }}
      className={reducedMotion ? 'hero__canvas hero__canvas--static' : 'hero__canvas'}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
}
