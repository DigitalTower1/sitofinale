'use client';

import { Suspense, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { Canvas, useFrame, useThree, type RootState } from '@react-three/fiber';
import { EffectComposer, Bloom, Vignette, GodRays, ToneMapping, EffectComposerContext } from '@react-three/postprocessing';
import { Pass, ToneMappingMode } from 'postprocessing';
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
import { SSRPass, SSRShader } from 'three-stdlib';

type SSRUniformRecord = Record<string, { value: unknown }>;
type SSRDefineRecord = Record<string, unknown>;

let hasPatchedSSRShader = false;

function ensureSSRShaderCompatibility() {
  if (hasPatchedSSRShader) {
    return;
  }

  const shader = SSRShader as unknown as {
    uniforms: SSRUniformRecord;
    defines: SSRDefineRecord;
  };

  if (!shader.uniforms.thickness) {
    const fallback = shader.uniforms.thickTolerance ?? { value: 0.03 };
    shader.uniforms.thickness = { value: fallback.value };
  }

  if (!shader.uniforms.thickTolerance) {
    shader.uniforms.thickTolerance = shader.uniforms.thickness;
  }

  const mapDefine = (legacyKey: string, modernKey: string, defaultValue: unknown) => {
    if (shader.defines[legacyKey] === undefined) {
      shader.defines[legacyKey] = shader.defines[modernKey] ?? defaultValue;
    }
  };

  mapDefine('DISTANCE_ATTENUATION', 'isDistanceAttenuation', false);
  mapDefine('FRESNEL', 'isFresnel', true);
  mapDefine('INFINITE_THICK', 'isInfiniteThick', false);

  hasPatchedSSRShader = true;
}

function patchSSRPass(pass: SSRPass) {
  const material = (pass as unknown as { ssrMaterial?: THREE.ShaderMaterial }).ssrMaterial;
  if (!material) {
    return;
  }

  const uniforms = material.uniforms as SSRUniformRecord | undefined;
  if (uniforms) {
    if (!uniforms.thickness && uniforms.thickTolerance) {
      uniforms.thickness = uniforms.thickTolerance;
    } else if (uniforms.thickness && !uniforms.thickTolerance) {
      uniforms.thickTolerance = uniforms.thickness;
    }
  }

  const SSR_DEFINE_BRIDGE_FLAG = Symbol.for('ssr-define-bridge');
  let defines = material.defines as (SSRDefineRecord & { [SSR_DEFINE_BRIDGE_FLAG]?: boolean }) | undefined;
  const togglePairs: Array<[keyof SSRDefineRecord, keyof SSRDefineRecord]> = [
    ['DISTANCE_ATTENUATION', 'isDistanceAttenuation'],
    ['FRESNEL', 'isFresnel'],
    ['INFINITE_THICK', 'isInfiniteThick']
  ];

  const defineBridgeMap = new Map<string, string>();
  togglePairs.forEach(([legacy, modern]) => {
    defineBridgeMap.set(String(legacy), String(modern));
    defineBridgeMap.set(String(modern), String(legacy));
  });

  if (defines && !defines[SSR_DEFINE_BRIDGE_FLAG]) {
    const originalDefines = defines;
    const proxy = new Proxy(originalDefines, {
      get(target, prop, receiver) {
        return Reflect.get(target, prop, receiver);
      },
      set(target, prop, value) {
        const key = String(prop);
        const previous = Reflect.get(target, key);
        if (Object.is(previous, value)) {
          return true;
        }
        const result = Reflect.set(target, key, value);
        if (!result) {
          return false;
        }
        const counterpart = defineBridgeMap.get(key);
        if (counterpart) {
          Reflect.set(target, counterpart, value);
          material.needsUpdate = true;
        }
        return true;
      }
    }) as SSRDefineRecord & { [SSR_DEFINE_BRIDGE_FLAG]?: boolean };

    Object.defineProperty(originalDefines, SSR_DEFINE_BRIDGE_FLAG, {
      value: true,
      enumerable: false,
      configurable: false,
      writable: false
    });

    Object.defineProperty(proxy, SSR_DEFINE_BRIDGE_FLAG, {
      value: true,
      enumerable: false,
      configurable: false,
      writable: false
    });

    material.defines = proxy;
    defines = proxy;
  }

  if (defines) {
    togglePairs.forEach(([legacy, modern]) => {
      const legacyValue = defines![legacy];
      const modernValue = defines![modern];
      if (legacyValue === undefined && modernValue !== undefined) {
        defines![legacy] = modernValue;
      } else if (modernValue === undefined && legacyValue !== undefined) {
        defines![modern] = legacyValue;
      }
    });
  }

  let thicknessValue = pass.thickness;
  Object.defineProperty(pass, 'thickness', {
    configurable: true,
    enumerable: true,
    get() {
      return thicknessValue;
    },
    set(value: number) {
      thicknessValue = value;
      if (!uniforms) {
        return;
      }
      if (uniforms.thickness) {
        uniforms.thickness.value = value;
      }
      if (uniforms.thickTolerance) {
        uniforms.thickTolerance.value = value;
      }
    }
  });

  if (!(pass as unknown as { setRenderer?: (renderer: THREE.WebGLRenderer) => void }).setRenderer) {
    (pass as unknown as { setRenderer: (renderer: THREE.WebGLRenderer) => void }).setRenderer = (renderer) => {
      const target = pass as unknown as { renderer?: THREE.WebGLRenderer };
      if (target.renderer !== renderer) {
        target.renderer = renderer;
      }
    };
  }

  if (
    !(
      pass as unknown as {
        initialize?: (
          renderer: THREE.WebGLRenderer,
          alpha: boolean,
          frameBufferType: number
        ) => void;
      }
    ).initialize
  ) {
    (
      pass as unknown as {
        initialize: (renderer: THREE.WebGLRenderer, alpha: boolean, frameBufferType: number) => void;
      }
    ).initialize = (renderer, _alpha, _frameBufferType) => {
      const target = pass as unknown as { renderer?: THREE.WebGLRenderer };
      if (target.renderer !== renderer) {
        target.renderer = renderer;
      }
    };
  }

  pass.thickness = thicknessValue;
}

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
  const [fragments] = useState(() =>
    Array.from({ length: 24 }).map(() => ({
      radius: 1.4 + Math.random() * 0.8,
      speed: 0.2 + Math.random() * 0.4,
      vertical: Math.random() * 1.2,
      tilt: Math.random() * Math.PI * 2,
      scale: 0.12 + Math.random() * 0.22
    }))
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
  const [positions] = useState(() => {
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
  });

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.getElapsedTime();
    points.current.rotation.y = t * 0.06;
  });

  return (
    <points ref={points} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
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

function ScreenSpaceReflections({ enabled }: { enabled: boolean }) {
  const { gl, scene, camera, size } = useThree();
  const { composer } = useContext(EffectComposerContext);
  const passRef = useRef<SSRPass | null>(null);
  const composerPassRef = useRef<Pass | null>(null);

  useEffect(() => {
    if (!composer) {
      return () => {};
    }

    if (!enabled) {
      if (passRef.current && composerPassRef.current) {
        composer.removePass(composerPassRef.current);
        passRef.current.dispose();
        passRef.current = null;
        composerPassRef.current = null;
      }
      return () => {};
    }

    if (passRef.current && composerPassRef.current) {
      return () => {
        if (passRef.current && composerPassRef.current) {
          composer.removePass(composerPassRef.current);
          passRef.current.dispose();
          passRef.current = null;
          composerPassRef.current = null;
        }
      };
    }

    ensureSSRShaderCompatibility();

    const pass = new SSRPass({
      renderer: gl,
      scene,
      camera,
      selects: null,
      groundReflector: null
    });

    patchSSRPass(pass);

    pass.opacity = 0.82;
    pass.maxDistance = 12;
    pass.thickness = 0.36;
    pass.blur = true;
    (pass as unknown as { distanceAttenuation: boolean }).distanceAttenuation = true;
    (pass as unknown as { fresnel: boolean }).fresnel = true;
    passRef.current = pass;
    composerPassRef.current = pass as unknown as Pass;
    composer.addPass(composerPassRef.current);

    return () => {
      if (passRef.current && composerPassRef.current) {
        composer.removePass(composerPassRef.current);
        passRef.current.dispose();
        passRef.current = null;
        composerPassRef.current = null;
      }
    };
  }, [enabled, composer, gl, scene, camera]);

  useEffect(() => {
    if (!enabled || !passRef.current) {
      return;
    }
    passRef.current.setSize(size.width, size.height);
  }, [enabled, size.width, size.height]);

  return null;
}

function HeroExperience({ enableEffects, onReady }: { enableEffects: boolean; onReady: () => void }) {
  const sunRef = useRef<THREE.Mesh>(null);
  const { gl, scene } = useThree();
  const { active } = useProgress();
  const [sunTarget, setSunTarget] = useState<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!active) {
      onReady();
    }
  }, [active, onReady]);

  useEffect(() => {
    if (!enableEffects) {
      return;
    }
    const id = window.requestAnimationFrame(() => {
      setSunTarget(sunRef.current);
    });
    return () => {
      window.cancelAnimationFrame(id);
    };
  }, [enableEffects]);

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
      <EffectComposer enableNormalPass={enableEffects} multisampling={enableEffects ? 2 : 0}>
        <ScreenSpaceReflections enabled={enableEffects} />
        {enableEffects ? (
          <Bloom intensity={0.7} luminanceThreshold={0.32} luminanceSmoothing={0.18} mipmapBlur />
        ) : (
          <></>
        )}
        <ToneMapping adaptive={false} mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette eskil={false} offset={0.32} darkness={0.45} />
        {enableEffects && sunTarget ? (
          <GodRays
            sun={sunTarget}
            samples={80}
            density={0.9}
            decay={0.94}
            weight={0.6}
            exposure={0.8}
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

    const rafId = window.requestAnimationFrame(() => {
      setMounted(true);
    });

    const mq = window.matchMedia('(max-width: 768px)');
    const handleChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', handleChange);
      return () => {
        window.cancelAnimationFrame(rafId);
        mq.removeEventListener('change', handleChange);
      };
    }

    mq.addListener(handleChange);
    return () => {
      window.cancelAnimationFrame(rafId);
      mq.removeListener(handleChange);
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
    scene.fog = new THREE.Fog(BASE_COLOR.clone().offsetHSL(0, 0, 0.08), 10, 28);
  }, []);

  const shouldFallback = !mounted || reducedMotion || isMobile;
  const sceneReady = shouldFallback || isReady;

  return (
    <div
      className={clsx('hero-scene', { 'hero-scene--fallback': shouldFallback, 'hero-scene--ready': sceneReady })}
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
