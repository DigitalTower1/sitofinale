'use client';

import { MeshTransmissionMaterial, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

export default function Tower({ reduced }: { reduced: boolean }) {
  const towerRef = useRef<THREE.Group>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  const gradientTexture = useMemo(() => {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0b1a22');
    gradient.addColorStop(0.45, '#1cb5bd');
    gradient.addColorStop(0.75, '#ff6b35');
    gradient.addColorStop(1, '#120c0c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    return texture;
  }, []);

  useFrame((_state, delta) => {
    if (!towerRef.current || !glowRef.current) return;
    const elapsed = performance.now() * 0.0004;
    towerRef.current.rotation.y = Math.sin(elapsed) * 0.08;
    towerRef.current.position.y = Math.sin(elapsed * 1.2) * 0.25;
    const intensity = reduced ? 0.45 : 0.85;
    const color = new THREE.Color().setHSL(0.08 + Math.sin(elapsed) * 0.02, 0.8, 0.55);
    const glowMaterial = glowRef.current.material as THREE.MeshBasicMaterial;
    glowMaterial.color = color;
    glowMaterial.opacity = THREE.MathUtils.damp(glowMaterial.opacity, intensity, 4, delta);
  });

  return (
    <group ref={towerRef} position={[0, 4, 0]}>
      <RoundedBox args={[2.2, 8, 2.2]} radius={0.6} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial
          color="#0f1b23"
          metalness={0.8}
          roughness={0.25}
          envMapIntensity={2.8}
          map={gradientTexture ?? undefined}
        />
      </RoundedBox>
      <mesh ref={glowRef} position={[0, 2, 0]} scale={[3.4, 6.8, 3.4]}> 
        <cylinderGeometry args={[0.5, 0.9, 6, 24, 1, true]} />
        <meshBasicMaterial color="#ff6b35" transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -4.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.4, 1.8, 64]} />
        <MeshTransmissionMaterial
          backside
          thickness={0.35}
          roughness={0.2}
          anisotropy={0.2}
          distortion={0.1}
          distortionScale={0.12}
          chromaticAberration={0.22}
          temporalDistortion={0.1}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
