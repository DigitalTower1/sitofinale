'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Float, OrbitControls, PerformanceMonitor, ScrollControls, Sparkles, useScroll } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useMotionPreferences } from './LenisProvider';
import Tower from './Tower';
import PostFX from './PostFX';
import { dispatchTowerPhase, useTowerStore } from './towerStore';
import { usePerformanceStore } from './performanceStore';

const CANVAS_CLASS =
  'pointer-events-none fixed inset-0 z-0 h-screen w-screen select-none bg-[radial-gradient(circle_at_20%_20%,rgba(28,181,189,0.15),transparent_55%)]';

export default function HeroScene() {
  const { reduced } = useMotionPreferences();

  return (
    <div className={CANVAS_CLASS} aria-hidden>
      <Canvas
        gl={{ antialias: true, preserveDrawingBuffer: true }}
        dpr={[1, 1.8]}
        camera={{ position: [3, 3.5, 8], fov: 42, near: 0.1, far: 60 }}
        shadows
      >
        <color attach="background" args={['#06070a']} />
        <fog attach="fog" args={[new THREE.Color('#030508'), 12, 38]} />
        <ScrollControls pages={4} damping={0.15} distance={1}>
          <Suspense fallback={null}>
            <TowerExperience reduced={reduced} />
          </Suspense>
        </ScrollControls>
        <PerformanceBridge />
      </Canvas>
    </div>
  );
}

function TowerExperience({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const cameraRef = useRef(camera);
  const scroll = useScroll();
  const setPhase = useTowerStore((state) => state.setPhase);
  const previousPhase = useRef<number>(0);

  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  const lightColors = useMemo(
    () => [new THREE.Color('#1cb5bd'), new THREE.Color('#ff6b35')],
    []
  );
  const lightIntensity = useMemo(() => (reduced ? [1.2, 0.9] : [2.1, 1.7]), [reduced]);

  useFrame((_state, delta) => {
    const activeCamera = cameraRef.current;
    if (!activeCamera) return;
    const offset = scroll.offset;
    const eased = THREE.MathUtils.damp(previousPhase.current / 3, offset, 4, delta);
    const phase = Math.round(THREE.MathUtils.clamp(offset * 3, 0, 3));

    if (phase !== previousPhase.current) {
      previousPhase.current = phase;
      setPhase(phase);
      dispatchTowerPhase(phase);
    }

    const yTarget = THREE.MathUtils.mapLinear(offset, 0, 1, 2, 12);
    const zTarget = 8 - offset * 4 - Math.sin(offset * Math.PI) * 1.2;
    const xTarget = Math.sin(offset * Math.PI * 0.8) * 2.2;

    activeCamera.position.x = THREE.MathUtils.damp(activeCamera.position.x, xTarget, 3, delta);
    activeCamera.position.y = THREE.MathUtils.damp(activeCamera.position.y, yTarget, 4, delta);
    activeCamera.position.z = THREE.MathUtils.damp(activeCamera.position.z, zTarget, 4, delta);
    activeCamera.lookAt(0, 4 + offset * 4, 0);

    if (group.current) {
      group.current.rotation.y = eased * Math.PI * 0.35;
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, offset * 4, 4, delta);
    }
  });

  useEffect(() => {
    const activeCamera = cameraRef.current;
    if (!activeCamera) return;

    const ambient = new THREE.Color('#052029');
    const previousBackground = activeCamera.background ?? null;
    const previousNear = activeCamera.near;
    const previousFar = activeCamera.far;

    activeCamera.layers.enable(0);
    activeCamera.background = ambient;
    activeCamera.near = 0.1;
    activeCamera.far = 80;
    activeCamera.updateProjectionMatrix();
    return () => {
      activeCamera.background = previousBackground;
      activeCamera.near = previousNear;
      activeCamera.far = previousFar;
      activeCamera.layers.disableAll();
      activeCamera.updateProjectionMatrix();
    };
  }, [camera]);

  return (
    <group ref={group} dispose={null}>
      <ambientLight intensity={reduced ? 0.35 : 0.65} color={new THREE.Color('#0f1b23')} />
      <directionalLight
        position={[6, 8, 8]}
        intensity={lightIntensity[0]}
        color={lightColors[0]}
        castShadow
        shadow-mapSize={1024}
      />
      <directionalLight position={[-5, 4, -3]} intensity={lightIntensity[1]} color={lightColors[1]} />
      <Float
        speed={1.2}
        rotationIntensity={0.3}
        floatIntensity={0.4}
        floatingRange={[0.2, 1.2]}
        enabled={!reduced}
      >
        <Tower reduced={reduced} />
      </Float>
      <Sparkles count={reduced ? 30 : 120} size={reduced ? 2 : 4} scale={[16, 12, 16]} color="#ffffff" opacity={0.5} />
      <Environment preset="city" ground={{ height: 15, radius: 60, scale: 140 }} />
      <ReflectiveFloor />
      <AtmosphericParticles reduced={reduced} />
      <PostFX reduced={reduced} />
      {!reduced && <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} makeDefault={false} />}
    </group>
  );
}

function ReflectiveFloor() {
  return (
    <group position={[0, -0.01, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[24, 24]} />
        <meshStandardMaterial color="#050608" metalness={0.9} roughness={0.1} envMapIntensity={2.5} />
      </mesh>
      <ContactShadows
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        opacity={0.6}
        width={14}
        height={14}
        blur={2.8}
        far={22}
      />
    </group>
  );
}

function AtmosphericParticles({ reduced }: { reduced: boolean }) {
  const ref = useRef<THREE.Points>(null);
  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: new THREE.Color('#f0f4ff'),
        size: reduced ? 0.05 : 0.12,
        transparent: true,
        opacity: 0.18,
        depthWrite: false
      }),
    [reduced]
  );

  useEffect(() => () => material.dispose(), [material]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const count = reduced ? 300 : 900;
    const positions = new Float32Array(count * 3);
    const random = createDeterministicRandom(reduced ? 42 : 1337);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (random() - 0.5) * 20;
      positions[i * 3 + 1] = random() * 15 + 1;
      positions[i * 3 + 2] = (random() - 0.5) * 20;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [reduced]);

  useFrame((_state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.02;
  });

  return <points ref={ref} args={[geometry, material]} />;
}

function createDeterministicRandom(seed: number) {
  let value = seed % 2147483647;
  if (value <= 0) {
    value += 2147483646;
  }
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function PerformanceBridge() {
  const setMetrics = usePerformanceStore((state) => state.setMetrics);
  return (
    <PerformanceMonitor
      onChange={({ fps, factor }) => {
        const tier = factor > 1.4 ? 'high' : factor > 0.9 ? 'medium' : 'low';
        setMetrics(fps, tier);
      }}
    />
  );
}
