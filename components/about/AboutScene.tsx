'use client';

import { Suspense, useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Vignette, BrightnessContrast } from '@react-three/postprocessing';
import { Preload, Environment, Lightformer } from '@react-three/drei';
import clsx from 'clsx';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import type { AboutChapter } from './types';

type AboutSceneProps = {
  chapters: AboutChapter[];
  activeIndex: number;
  reducedMotion: boolean;
  isMobile: boolean;
};

const GRID_COLS = 18;
const GRID_ROWS = 10;
const INSTANCE_COUNT = GRID_COLS * GRID_ROWS;
const INSTANCE_SPACING = 0.34;

const tempObject = new THREE.Object3D();
const tempColor = new THREE.Color();

function seededRandom(index: number, seed: number) {
  const x = Math.sin(index * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

type ShapeState = {
  positions: Float32Array;
  scales: Float32Array;
  colors: Float32Array;
};

function buildShape(chapter: AboutChapter, seed: number): ShapeState {
  const positions = new Float32Array(INSTANCE_COUNT * 3);
  const scales = new Float32Array(INSTANCE_COUNT);
  const colors = new Float32Array(INSTANCE_COUNT * 3);
  const { pattern, warp, density, elevation, drift, palette } = chapter.visual;

  for (let row = 0; row < GRID_ROWS; row += 1) {
    for (let col = 0; col < GRID_COLS; col += 1) {
      const index = row * GRID_COLS + col;
      const offset = index * 3;
      const normX = col / (GRID_COLS - 1);
      const normY = row / (GRID_ROWS - 1);
      const centeredX = col - (GRID_COLS - 1) / 2;
      const centeredY = row - (GRID_ROWS - 1) / 2;
      const baseX = centeredX * INSTANCE_SPACING;
      const baseY = centeredY * INSTANCE_SPACING * 0.82;
      let x = baseX;
      let y = baseY;
      let z = 0;
      let scale = 0.26;

      switch (pattern) {
        case 'ripple': {
          const radius = Math.hypot(centeredX, centeredY) / Math.hypot(GRID_COLS / 2, GRID_ROWS / 2);
          const wave = Math.sin(radius * Math.PI * density + seed * 0.6) * warp;
          z = wave * 1.6;
          scale = 0.24 + (1 - radius) * 0.18 + warp * 0.12;
          y += Math.cos((normX + seed) * Math.PI * 1.2) * 0.12 * drift;
          break;
        }
        case 'helix': {
          const theta = (normX * Math.PI * 2 + normY * Math.PI * 1.5 + seed * 0.4) * (1 + warp * 0.4);
          const radius = 1.6 + Math.sin(normY * Math.PI) * warp * 1.2;
          x = Math.cos(theta) * radius;
          z = Math.sin(theta) * radius;
          y = (normY - 0.5) * 3.2;
          scale = 0.22 + Math.sin(theta + seed) * 0.08 + normY * 0.18;
          break;
        }
        case 'pillar': {
          const column = col % 6;
          const tier = Math.floor(row / 2);
          const stackHeight = 0.35 + tier * 0.28;
          x = (column - 2.5) * INSTANCE_SPACING * 1.6;
          z = (Math.floor(col / 6) - 1.2) * INSTANCE_SPACING * 1.4;
          y = tier * stackHeight - 1.1 + Math.sin(normX * Math.PI * 2) * warp * 0.6;
          scale = 0.3 + tier * 0.08;
          break;
        }
        case 'nebula':
        default: {
          const angle = (normX + seed) * Math.PI * 2;
          const layer = normY * 2 - 1;
          const radius = 0.6 + Math.pow(normY, 1.4) * 2.2 + warp * Math.sin(normX * Math.PI * 4);
          x = Math.cos(angle) * radius * (1 + warp * 0.3);
          y = layer * 2.4 + Math.cos(angle * 2) * 0.4 * drift;
          z = Math.sin(angle) * radius * 0.8;
          scale = 0.2 + Math.pow(1 - normY, 1.5) * 0.3;
          break;
        }
      }

      const elevationBias = elevation * (normY - 0.5) * 1.2;
      y += elevationBias;

      const jitter = (seededRandom(index, seed) - 0.5) * 0.22 * drift;
      const jitterY = (seededRandom(index, seed + 11) - 0.5) * 0.18 * drift;
      const jitterZ = (seededRandom(index, seed + 23) - 0.5) * 0.18 * drift;

      positions[offset] = x + jitter;
      positions[offset + 1] = y + jitterY;
      positions[offset + 2] = z + jitterZ;

      scales[index] = scale;

      tempColor.set(palette.fill);
      const accentMix = 0.25 + seededRandom(index, seed + 5) * 0.45;
      tempColor.lerp(new THREE.Color(palette.accent), accentMix);
      colors[offset] = tempColor.r;
      colors[offset + 1] = tempColor.g;
      colors[offset + 2] = tempColor.b;
    }
  }

  return { positions, scales, colors };
}

function SceneContent({
  chapters,
  activeIndex,
  reducedMotion
}: {
  chapters: AboutChapter[];
  activeIndex: number;
  reducedMotion: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const backgroundRef = useRef(new THREE.Color(chapters[activeIndex].visual.palette.background));
  const targetBackground = useRef(new THREE.Color(chapters[activeIndex].visual.palette.background));
  const targetFog = useRef(new THREE.Color(chapters[activeIndex].visual.palette.fog));
  const fogInstance = useRef<THREE.Fog | null>(null);

  const shapes = useMemo(() => chapters.map((chapter, idx) => buildShape(chapter, idx * 0.78 + 1)), [chapters]);

  const currentPositions = useRef(new Float32Array(shapes[0]?.positions ?? INSTANCE_COUNT * 3));
  const currentScales = useRef(new Float32Array(shapes[0]?.scales ?? INSTANCE_COUNT));
  const currentColors = useRef(new Float32Array(shapes[0]?.colors ?? INSTANCE_COUNT * 3));

  const targetPositions = useRef(shapes[activeIndex]?.positions ?? new Float32Array(INSTANCE_COUNT * 3));
  const targetScales = useRef(shapes[activeIndex]?.scales ?? new Float32Array(INSTANCE_COUNT));
  const targetColors = useRef(shapes[activeIndex]?.colors ?? new Float32Array(INSTANCE_COUNT * 3));

  useEffect(() => {
    targetPositions.current = shapes[activeIndex]?.positions ?? targetPositions.current;
    targetScales.current = shapes[activeIndex]?.scales ?? targetScales.current;
    targetColors.current = shapes[activeIndex]?.colors ?? targetColors.current;
    targetBackground.current.set(chapters[activeIndex].visual.palette.background);
    targetFog.current.set(chapters[activeIndex].visual.palette.fog);
  }, [activeIndex, chapters, shapes]);

  const { scene, gl } = useThree();

  useEffect(() => {
    backgroundRef.current.set(chapters[activeIndex].visual.palette.background);
    if (scene.background instanceof THREE.Color) {
      scene.background.copy(backgroundRef.current);
    } else {
      scene.background = backgroundRef.current.clone();
    }
    gl.setClearColor(backgroundRef.current);
  }, [activeIndex, chapters, gl, scene]);

  useEffect(() => {
    if (!fogInstance.current) {
      fogInstance.current = new THREE.Fog(chapters[activeIndex].visual.palette.fog, 6, 20);
      scene.fog = fogInstance.current;
    }
    return () => {
      if (scene.fog === fogInstance.current) {
        scene.fog = null;
      }
      fogInstance.current = null;
    };
  }, [chapters, scene, activeIndex]);

  useEffect(() => {
    if (!fogInstance.current) {
      return;
    }
    fogInstance.current.color.set(chapters[activeIndex].visual.palette.fog);
  }, [activeIndex, chapters]);

  useFrame((state) => {
    const delta = state.clock.getDelta();
    const easing = reducedMotion ? 12 : 6;

    backgroundRef.current.lerp(targetBackground.current, 0.08);
    gl.setClearColor(backgroundRef.current);
    if (scene.background instanceof THREE.Color) {
      scene.background.lerp(targetBackground.current, 0.08);
    }
    if (fogInstance.current) {
      fogInstance.current.color.lerp(targetFog.current, 0.06);
    }

    if (groupRef.current && !reducedMotion) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.x = Math.sin(t * 0.18) * 0.1;
      groupRef.current.rotation.y = Math.sin(t * 0.14) * 0.12;
      groupRef.current.position.y = Math.sin(t * 0.22) * 0.08;
    }

    if (!meshRef.current) return;

    const positions = currentPositions.current;
    const scales = currentScales.current;
    const colors = currentColors.current;
    const targetPos = targetPositions.current;
    const targetScale = targetScales.current;
    const targetColor = targetColors.current;

    for (let index = 0; index < INSTANCE_COUNT; index += 1) {
      const offset = index * 3;
      const damp = THREE.MathUtils.damp;
      positions[offset] = damp(positions[offset], targetPos[offset], easing, delta);
      positions[offset + 1] = damp(positions[offset + 1], targetPos[offset + 1], easing, delta);
      positions[offset + 2] = damp(positions[offset + 2], targetPos[offset + 2], easing, delta);
      scales[index] = damp(scales[index], targetScale[index], easing, delta);
      colors[offset] = damp(colors[offset], targetColor[offset], easing, delta);
      colors[offset + 1] = damp(colors[offset + 1], targetColor[offset + 1], easing, delta);
      colors[offset + 2] = damp(colors[offset + 2], targetColor[offset + 2], easing, delta);

      tempObject.position.set(positions[offset], positions[offset + 1], positions[offset + 2]);
      tempObject.scale.setScalar(scales[index]);
      tempObject.rotation.set(
        positions[offset + 2] * 0.08,
        positions[offset] * 0.12,
        positions[offset + 1] * 0.08
      );
      tempObject.updateMatrix();
      meshRef.current.setMatrixAt(index, tempObject.matrix);

      tempColor.setRGB(colors[offset], colors[offset + 1], colors[offset + 2]);
      meshRef.current.setColorAt(index, tempColor);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, INSTANCE_COUNT]} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          roughness={0.32}
          metalness={0.62}
          color={chapters[activeIndex].visual.palette.fill}
          envMapIntensity={0.9}
        />
      </instancedMesh>
    </group>
  );
}

function SceneLighting({ palette }: { palette: AboutChapter['visual']['palette'] }) {
  return (
    <>
      <ambientLight intensity={0.35} color={palette.ambient} />
      <directionalLight
        position={[6, 7, 6]}
        intensity={1.8}
        castShadow
        color={palette.accent}
        shadow-mapSize={[2048, 2048]}
        shadow-radius={6}
      />
      <directionalLight position={[-6, 4, -3]} intensity={0.6} color={palette.fill} />
      <Environment resolution={256} frames={1} background={false}>
        <Lightformer
          form="ring"
          intensity={2.4}
          scale={[6, 6, 1]}
          position={[0, 4, 6]}
          color={palette.accent}
        />
        <Lightformer
          form="circle"
          intensity={1.2}
          scale={[8, 8, 1]}
          position={[0, -4, -6]}
          color={palette.fill}
        />
      </Environment>
    </>
  );
}

function ThreeScene({ chapters, activeIndex, reducedMotion }: Omit<AboutSceneProps, 'isMobile'>) {
  return (
    <Canvas
      className="about-scene__canvas"
      shadows
      dpr={[1, 1.8]}
      gl={{ antialias: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.setClearColor(chapters[activeIndex].visual.palette.background);
      }}
      camera={{ position: [0, 2.4, 8.2], fov: 45, near: 0.1, far: 60 }}
    >
      <Suspense fallback={null}>
        <SceneLighting palette={chapters[activeIndex].visual.palette} />
        <SceneContent chapters={chapters} activeIndex={activeIndex} reducedMotion={reducedMotion} />
        <EffectComposer multisampling={4}>
          <BrightnessContrast brightness={0.05} contrast={0.12} />
          <Vignette eskil={false} offset={0.28} darkness={0.65} />
        </EffectComposer>
        <Preload all />
      </Suspense>
    </Canvas>
  );
}

const FALLBACK_CELLS = Array.from({ length: 12 }, (_, index) => `cell-${index}`);

export function AboutScene({ chapters, activeIndex, reducedMotion, isMobile }: AboutSceneProps) {
  const palette = chapters[activeIndex].visual.palette;
  const fallbackConfig = useMemo(() => {
    const chapter = chapters[activeIndex];
    const baseColumns = chapter.visual.pattern === 'pillar' ? 3 : chapter.visual.pattern === 'helix' ? 2 : 4;
    const baseRows = chapter.visual.pattern === 'nebula' ? 5 : 4;
    return {
      columns: baseColumns,
      rows: baseRows,
      rotation: chapter.visual.pattern === 'helix' ? '-6deg' : chapter.visual.pattern === 'pillar' ? '8deg' : '0deg'
    };
  }, [activeIndex, chapters]);

  if (isMobile || reducedMotion) {
    return (
      <motion.div
        className="about-scene__fallback"
        data-pattern={chapters[activeIndex].visual.pattern}
        style={{
          '--about-fallback-columns': String(fallbackConfig.columns),
          '--about-fallback-rows': String(fallbackConfig.rows),
          '--about-fallback-rotation': fallbackConfig.rotation,
          background: `radial-gradient(circle at 20% 20%, ${palette.accent}22, transparent 62%), linear-gradient(135deg, ${palette.background}, #04050a)`
        } as CSSProperties}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      >
        <motion.div
          className="about-scene__fallback-grid"
          animate={{
            gap: chapters[activeIndex].visual.pattern === 'pillar' ? '0.9rem' : '0.6rem',
            rotate: fallbackConfig.rotation,
            opacity: 1
          }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          {FALLBACK_CELLS.map((cellId, index) => (
            <motion.span
              key={cellId}
              className="about-scene__fallback-cell"
              animate={{
                scale: 0.9 + (index % 3) * 0.04 + activeIndex * 0.02,
                opacity: 0.6 + ((index + activeIndex) % 4) * 0.1
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            />
          ))}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className={clsx('about-scene', { 'about-scene--mobile': isMobile })}>
      <ThreeScene chapters={chapters} activeIndex={activeIndex} reducedMotion={reducedMotion} />
      <div className="about-scene__vignette" aria-hidden />
    </div>
  );
}
