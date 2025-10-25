'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, SSR, Bloom, Vignette, GodRays, ToneMapping } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import {
  Environment,
  Float,
  Html,
  Lightformer,
  PerspectiveCamera,
  Preload,
  useProgress
} from '@react-three/drei';
import * as THREE from 'three';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

const BASE_COLOR = new THREE.Color('#07090f');
const ACCENT_COLOR = new THREE.Color('#d6ba7f');
const GLASS_COLOR = new THREE.Color('#151a24');

function CameraRig() {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0.9, 0), []);
  const desired = useRef(new THREE.Vector3());

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    desired.current.set(Math.sin(t * 0.18) * 0.8, 1.35 + Math.sin(t * 0.14) * 0.15, 6.2 + Math.sin(t * 0.1) * 0.4);
    camera.position.lerp(desired.current, 0.035);
    camera.lookAt(target);
  });

  return null;
}

function OrbitingFragments() {
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const fragments = useMemo(
    () =>
      Array.from({ length: 24 }).map(() => ({
        radius: 1.4 + Math.random() * 0.8,
        speed: 0.2 + Math.random() * 0.4,
        vertical: Math.random() * 1.2,
        tilt: Math.random() * Math.PI * 2,
        scale: 0.12 + Math.random() * 0.22
      })),
    []
  );
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    fragments.forEach((fragment, index) => {
      const angle = t * fragment.speed + fragment.tilt;
      dummy.position.set(
        Math.cos(angle) * fragment.radius,
        fragment.vertical * Math.sin(t * 0.6 + index),
        Math.sin(angle) * fragment.radius
      );
      dummy.scale.setScalar(fragment.scale);
      dummy.rotation.set(Math.sin(angle) * 0.6, angle, Math.cos(angle * 0.6));
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(index, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, fragments.length]} castShadow receiveShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={ACCENT_COLOR}
        metalness={0.85}
        roughness={0.28}
        envMapIntensity={1.2}
        emissive={ACCENT_COLOR.clone().multiplyScalar(0.25)}
        emissiveIntensity={0.7}
      />
    </instancedMesh>
  );
}

function DustField() {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(4800);
    for (let i = 0; i < arr.length; i += 3) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 2.2 + Math.random() * 3.4;
      const y = -0.6 + Math.random() * 3.2;
      arr[i] = Math.cos(theta) * radius;
      arr[i + 1] = y;
      arr[i + 2] = Math.sin(theta) * radius;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.getElapsedTime();
    points.current.rotation.y = t * 0.06;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} itemSize={3} array={positions} />
      </bufferGeometry>
      <pointsMaterial color={ACCENT_COLOR} size={0.04} sizeAttenuation transparent opacity={0.32} depthWrite={false} />
    </points>
  );
}

function Prism({ sunRef }: { sunRef: React.MutableRefObject<THREE.Mesh | null> }) {
  const core = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (core.current) {
      core.current.rotation.x = Math.sin(t * 0.32) * 0.4;
      core.current.rotation.y = t * 0.28;
    }
    if (halo.current) {
      halo.current.position.y = 0.6 + Math.sin(t * 1.4) * 0.24;
      halo.current.rotation.z = t * 0.6;
    }
  });

  return (
    <group position={[0, 0.4, 0]}>
      <mesh ref={core} castShadow>
        <octahedronGeometry args={[0.9, 1]} />
        <meshPhysicalMaterial
          color={GLASS_COLOR}
          transmission={0.88}
          roughness={0.12}
          thickness={0.8}
          reflectivity={1}
          metalness={0.4}
          clearcoat={0.8}
          clearcoatRoughness={0.08}
        />
      </mesh>
      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh ref={halo} position={[0, 1.6, 0]}>
          <ringGeometry args={[1.15, 1.35, 96]} />
          <meshBasicMaterial color={ACCENT_COLOR} transparent opacity={0.45} />
        </mesh>
      </Float>
      <mesh ref={sunRef} position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshBasicMaterial color={ACCENT_COLOR} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
        <ringGeometry args={[0.8, 1.6, 64]} />
        <meshStandardMaterial
          color={GLASS_COLOR.clone().lerp(BASE_COLOR, 0.5)}
          metalness={0.7}
          roughness={0.24}
          envMapIntensity={1.1}
        />
      </mesh>
    </group>
  );
}

function HeroExperience({ enableEffects, onReady }: { enableEffects: boolean; onReady: () => void }) {
  const sunRef = useRef<THREE.Mesh>(null);
  const { gl, scene } = useThree();
  const { active } = useProgress();

  useEffect(() => {
    gl.physicallyCorrectLights = true;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    scene.background = BASE_COLOR;
    scene.fog = new THREE.Fog(BASE_COLOR.clone().offsetHSL(0, 0, 0.08), 10, 28);
  }, [gl, scene]);

  useEffect(() => {
    if (!active) {
      onReady();
    }
  }, [active, onReady]);

  return (
    <>
      <PerspectiveCamera makeDefault fov={42} position={[0, 1.4, 6.6]} />
      <CameraRig />
      <ambientLight intensity={0.3} color={0x404444} />
      <directionalLight position={[5, 6, 2]} intensity={1.6} color={0xffdfb2} castShadow shadow-mapSize={[2048, 2048]} />
      <spotLight position={[-3.2, 3.4, 4.4]} intensity={1.2} angle={Math.PI / 5} penumbra={0.6} color={0xbcd2ff} />
      <pointLight position={[0, 2.6, -3]} intensity={0.8} color={0x6a7dff} />
      <group>
        <Prism sunRef={sunRef} />
        <Float speed={0.8} rotationIntensity={0.25} floatIntensity={0.4}>
          <OrbitingFragments />
        </Float>
        <DustField />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
          <circleGeometry args={[6, 128]} />
          <meshStandardMaterial color={BASE_COLOR.clone().offsetHSL(0, 0, -0.05)} roughness={0.6} metalness={0.4} />
        </mesh>
      </group>
      <Environment background={false} resolution={256}>
        <group rotation={[0, Math.PI / 4, 0]}>
          <Lightformer intensity={2} form="rect" scale={[10, 10, 1]} position={[0, 5, -12]} color={0xfff4d6} />
          <Lightformer intensity={1.2} form="ring" scale={5} position={[3, 1, 8]} rotation={[0, Math.PI / 2, 0]} color={0xffcfa5} />
          <Lightformer intensity={1} form="ring" scale={6} position={[-6, 2, -6]} color={0x9bd6ff} />
        </group>
      </Environment>
      <Html position={[0, 2.4, 0]} center className="hero-scene__label" aria-hidden>
        <span>Immersive Growth Suite 2024</span>
      </Html>
      <Preload all />
      <EffectComposer disableNormalPass={!enableEffects} multisampling={enableEffects ? 2 : 0}>
        {enableEffects && (
          <SSR
            temporalResolve
            STRETCH_MISSED_RAYS
            USE_MRT
            intensity={1.05}
            exponent={1.2}
            distance={10}
            fade={0.8}
            roughnessFade={1}
            maxRoughness={0.85}
            thickness={10}
            ior={1.15}
            maxDepthDifference={0.4}
            blend={0.95}
          />
        )}
        {enableEffects && <Bloom intensity={0.7} luminanceThreshold={0.32} luminanceSmoothing={0.18} mipmapBlur />}
        <ToneMapping adaptive={false} mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette eskil={false} offset={0.32} darkness={0.45} />
        {enableEffects && sunRef.current && (
          <GodRays
            sun={sunRef.current}
            samples={80}
            density={0.9}
            decay={0.94}
            weight={0.6}
            exposure={0.8}
            clampMax={1}
            blur
          />
        )}
      </EffectComposer>
    </>
  );
}

function FallbackPoster({ loading }: { loading: boolean }) {
  return (
    <div className={clsx('hero-scene__poster', { 'hero-scene__poster--loading': loading })} aria-hidden>
      <div className="hero-scene__poster-visual" aria-hidden>
        <span className="hero-scene__poster-glow" aria-hidden />
      </div>
      <div className="hero-scene__poster-overlay" aria-hidden />
    </div>
  );
}

export function HeroScene() {
  const { reducedMotion } = useMotionPreferences();
  const [mounted, setMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const update = (event: MediaQueryList | MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };
    update(mq);
    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', update);
      return () => mq.removeEventListener('change', update);
    }
    mq.addListener(update);
    return () => mq.removeListener(update);
  }, []);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  const shouldFallback = !mounted || reducedMotion || isMobile;

  useEffect(() => {
    if (shouldFallback) {
      setIsReady(true);
    }
  }, [shouldFallback]);

  return (
    <div
      className={clsx('hero-scene', { 'hero-scene--fallback': shouldFallback, 'hero-scene--ready': isReady })}
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
    >
      {shouldFallback && <FallbackPoster loading={!isReady} />}
      {mounted && !shouldFallback && (
        <Suspense fallback={<FallbackPoster loading />}>
          <Canvas
            className="hero-scene__canvas"
            shadows
            gl={{ antialias: true, stencil: false, depth: true, powerPreference: 'high-performance' }}
            dpr={[1, 1.6]}
            onCreated={() => setIsReady(true)}
          >
            <Suspense fallback={null}>
              <HeroExperience enableEffects={!reducedMotion} onReady={handleReady} />
            </Suspense>
          </Canvas>
        </Suspense>
      )}
    </div>
  );
}
