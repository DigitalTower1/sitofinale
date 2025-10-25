'use client';

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Canvas, useFrame, useThree, type RootState } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, GodRays, ToneMapping } from '@react-three/postprocessing';
import { Float, Html, PerspectiveCamera, Preload, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { ToneMappingMode } from 'postprocessing';
import { useMotionPreferences } from '../../hooks/useMotionPreferences';

const BASE_COLOR = new THREE.Color('#040507');
const ACCENT_COLOR = new THREE.Color('#d8bb7d');
const MARBLE_COLOR = new THREE.Color('#f0f3ff');

function useCarbonTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    const size = 256;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }

    context.fillStyle = '#0d1016';
    context.fillRect(0, 0, size, size);

    for (let y = 0; y < size; y += 8) {
      for (let x = 0; x < size; x += 8) {
        const offset = (x / 8 + y / 8) % 2;
        const shade = offset ? 22 : 12;
        context.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + 8})`;
        context.fillRect(x, y, 8, 8);
      }
    }

    context.globalCompositeOperation = 'overlay';
    const gradient = context.createLinearGradient(0, 0, size, size);
    gradient.addColorStop(0, 'rgba(255,255,255,0.15)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.55)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    context.globalCompositeOperation = 'source-over';

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(6, 6);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

function useMarbleTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    const size = 512;
    canvas.width = size;
    canvas.height = size;
    const context = canvas.getContext('2d');
    if (!context) {
      return null;
    }

    const baseGradient = context.createLinearGradient(0, 0, size, size);
    baseGradient.addColorStop(0, '#fdf9f5');
    baseGradient.addColorStop(0.5, '#e7e2dc');
    baseGradient.addColorStop(1, '#f5f2ef');
    context.fillStyle = baseGradient;
    context.fillRect(0, 0, size, size);

    context.globalAlpha = 0.25;
    for (let i = 0; i < 90; i += 1) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const radius = 60 + Math.random() * 140;
      const grad = context.createRadialGradient(x, y, radius * 0.2, x, y, radius);
      grad.addColorStop(0, 'rgba(180, 175, 170, 0.35)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      context.fillStyle = grad;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }
    context.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
    texture.anisotropy = 8;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

function CameraRig() {
  const { camera } = useThree();
  const target = useMemo(() => new THREE.Vector3(0, 0.9, 0), []);
  const smoothed = useRef(new THREE.Vector3(0, 1.2, 6));

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    smoothed.current.set(
      Math.sin(time * 0.2) * 1.4,
      1.4 + Math.sin(time * 0.12) * 0.3,
      6 + Math.cos(time * 0.16) * 0.5
    );
    camera.position.lerp(smoothed.current, 0.04);
    camera.lookAt(target);
  });

  return null;
}

function CarbonStage({ carbonTexture, marbleTexture }: { carbonTexture: THREE.Texture | null; marbleTexture: THREE.Texture | null }) {
  const stageRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (stageRef.current) {
      stageRef.current.rotation.y = Math.sin(t * 0.12) * 0.1;
    }
    if (haloRef.current) {
      haloRef.current.rotation.z = t * 0.18;
    }
  });

  return (
    <group>
      <mesh ref={stageRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -1.4, 0]}>
        <circleGeometry args={[9, 128]} />
        <meshStandardMaterial
          color={BASE_COLOR.clone().lerp(new THREE.Color('#0d1018'), 0.6)}
          map={carbonTexture ?? undefined}
          metalness={0.4}
          roughness={0.55}
          envMapIntensity={0.6}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.35, 0]} receiveShadow>
        <ringGeometry args={[3.8, 4.4, 128]} />
        <meshStandardMaterial color={'#121620'} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.38, 0]} receiveShadow>
        <circleGeometry args={[3.2, 96]} />
        <meshPhysicalMaterial
          map={marbleTexture ?? undefined}
          color={MARBLE_COLOR}
          roughness={0.18}
          metalness={0.1}
          clearcoat={0.6}
          clearcoatRoughness={0.24}
        />
      </mesh>
      <mesh ref={haloRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <ringGeometry args={[4.5, 5.4, 96]} />
        <meshBasicMaterial color={ACCENT_COLOR} transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function CarbonFragments() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = useMemo(() => [ACCENT_COLOR.clone(), new THREE.Color('#6ab8ff'), new THREE.Color('#f9efe1')], []);

  const fragments = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, index) => ({
        radius: 1.8 + Math.sin(index) * 0.5,
        offset: Math.random() * Math.PI * 2,
        speed: 0.18 + Math.random() * 0.12,
        y: -0.6 + Math.random() * 2.4,
        scale: 0.14 + Math.random() * 0.18,
      })),
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!meshRef.current) return;
    fragments.forEach((fragment, index) => {
      const angle = t * fragment.speed + fragment.offset;
      dummy.position.set(
        Math.cos(angle) * fragment.radius,
        fragment.y + Math.sin(angle * 2) * 0.4,
        Math.sin(angle) * fragment.radius
      );
      dummy.rotation.set(angle * 0.5, angle, angle * 0.3);
      dummy.scale.setScalar(fragment.scale + Math.sin(t * 0.8 + index) * 0.04);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(index, dummy.matrix);
      const color = colors[index % colors.length];
      meshRef.current!.setColorAt(index, color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, fragments.length]} castShadow>
      <octahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial
        roughness={0.4}
        metalness={0.9}
        emissive={ACCENT_COLOR.clone().multiplyScalar(0.15)}
        emissiveIntensity={0.8}
        toneMapped
      />
    </instancedMesh>
  );
}

function Ribbon() {
  const points = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(
      Array.from({ length: 8 }).map((_, index) => {
        const angle = (index / 7) * Math.PI * 2;
        const radius = 1.6 + Math.sin(angle * 2) * 0.4;
        return new THREE.Vector3(Math.cos(angle) * radius, -0.6 + index * 0.35, Math.sin(angle) * radius * 0.6);
      })
    );
    return curve.getPoints(200);
  }, []);

  const geometry = useMemo(() => {
    const geom = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), 260, 0.08, 12, true);
    return geom;
  }, [points]);

  const material = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#5fa5ff',
    roughness: 0.2,
    metalness: 0.6,
    emissive: '#3d6dff',
    emissiveIntensity: 0.4,
  }), []);

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.12;
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={material} castShadow />;
}

function HeroExperience({ onReady, enableEffects }: { onReady: () => void; enableEffects: boolean }) {
  const carbonTexture = useCarbonTexture();
  const marbleTexture = useMarbleTexture();
  const [sunTarget, setSunTarget] = useState<THREE.Mesh | null>(null);
  const sunRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      setSunTarget(sunRef.current);
      onReady();
    });
    return () => window.cancelAnimationFrame(id);
  }, [onReady]);

  useFrame(({ gl: renderer }) => {
    renderer.toneMappingExposure = 1.05;
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={40} position={[0, 1.4, 6.4]} />
      <CameraRig />
      <ambientLight intensity={0.5} color={'#1d2733'} />
      <directionalLight
        position={[6, 6, 4]}
        intensity={2}
        color={ACCENT_COLOR}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <spotLight position={[-4, 4, -2]} intensity={1.4} color={'#6dbbff'} angle={0.6} penumbra={0.7} />
      <pointLight position={[0, 2, 5]} intensity={0.8} color={'#ffffff'} />
      <group>
        <Float speed={0.9} rotationIntensity={0.4} floatIntensity={0.6}>
          <mesh ref={sunRef} position={[0, 2.1, 0]}>
            <sphereGeometry args={[0.4, 48, 48]} />
            <meshBasicMaterial color={ACCENT_COLOR} transparent opacity={0.85} />
          </mesh>
        </Float>
        <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.6}>
          <CarbonFragments />
        </Float>
        <Ribbon />
        <CarbonStage carbonTexture={carbonTexture} marbleTexture={marbleTexture} />
      </group>
      <Environment background={false} resolution={256}>
        <group>
          <Lightformer intensity={1.4} form="ring" scale={8} position={[0, 6, -14]} color={'#f7f1e8'} />
          <Lightformer intensity={0.7} form="rect" scale={[6, 6, 1]} position={[-6, 3, -6]} color={'#6aa7ff'} />
          <Lightformer intensity={0.5} form="rect" scale={[4, 4, 1]} position={[5, -2, 4]} color={'#262f3a'} />
        </group>
      </Environment>
      <Html position={[0, 2.8, 0]} center className="hero-scene__label" aria-hidden>
        <span>Studio Visione Immersiva</span>
      </Html>
      <Preload all />
      <EffectComposer multisampling={enableEffects ? 2 : 0} enableNormalPass={enableEffects}>
        {enableEffects ? (
          <Bloom intensity={0.65} luminanceThreshold={0.4} luminanceSmoothing={0.2} mipmapBlur />
        ) : (
          <></>
        )}
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette eskil={false} darkness={0.55} offset={0.32} />
        {enableEffects && sunTarget ? (
          <GodRays
            sun={sunTarget}
            samples={80}
            density={0.9}
            decay={0.94}
            weight={0.5}
            exposure={0.9}
            clampMax={1}
            blur
          />
        ) : (
          <></>
        )}
      </EffectComposer>
    </>
  );
}

function FallbackPoster({ loading }: { loading: boolean }) {
  return (
    <div className={clsx('hero-scene__poster', { 'hero-scene__poster--loading': loading })} aria-hidden>
      <div className="hero-scene__poster-carbon" aria-hidden />
      <div className="hero-scene__poster-marble" aria-hidden />
      <div className="hero-scene__poster-glow" aria-hidden />
    </div>
  );
}

export function HeroScene() {
  const { reducedMotion } = useMotionPreferences();
  const [mounted, setMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.matchMedia('(max-width: 768px)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const rafId = window.requestAnimationFrame(() => setMounted(true));
    const media = window.matchMedia('(max-width: 768px)');
    const update = (target: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(target.matches);
    };
    update(media);
    media.addEventListener('change', update);

    return () => {
      window.cancelAnimationFrame(rafId);
      media.removeEventListener('change', update);
    };
  }, []);

  const handleReady = useCallback(() => {
    setIsReady(true);
  }, []);

  const handleCanvasCreated = useCallback(({ gl, scene }: RootState) => {
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.shadowMap.enabled = true;
    gl.shadowMap.type = THREE.PCFSoftShadowMap;
    scene.background = BASE_COLOR;
    scene.fog = new THREE.Fog(BASE_COLOR.clone().offsetHSL(0, 0, 0.1), 10, 26);
  }, []);

  const shouldFallback = !mounted || reducedMotion || isMobile;
  const sceneReady = shouldFallback || isReady;

  return (
    <div
      className={clsx('hero-scene', {
        'hero-scene--fallback': shouldFallback,
        'hero-scene--ready': sceneReady,
      })}
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
    >
      {shouldFallback && <FallbackPoster loading={!sceneReady} />}
      {mounted && !shouldFallback && (
        <Suspense fallback={<FallbackPoster loading />}>
          <Canvas
            className="hero-scene__canvas"
            shadows
            gl={{ antialias: true, stencil: false, depth: true, powerPreference: 'high-performance' }}
            dpr={[1, 1.6]}
            onCreated={handleCanvasCreated}
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
