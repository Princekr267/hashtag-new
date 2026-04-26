import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * PERFORMANCE-OPTIMIZED ParticleField
 * 
 * Key changes for 60fps:
 * - Removed EffectComposer/Bloom/ChromaticAberration entirely (huge GPU cost)
 * - Use Points (1 draw call) instead of InstancedMesh (N matrix updates/frame)
 * - AdditiveBlending creates glow effect without GPU postprocessing
 * - No per-particle matrix math in useFrame — only whole-mesh rotation
 * - pixelRatio capped at 1.5 in parent Canvas
 */

interface ParticleFieldProps {
  count?: number;
}

const ParticleField: React.FC<ParticleFieldProps> = ({ count = 2000 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate all geometry once — never recalculated
  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const c1 = new THREE.Color('#C8FF47'); // Electric lime
    const c2 = new THREE.Color('#7B61FF'); // Violet
    const c3 = new THREE.Color('#00f5d4'); // Teal accent

    for (let i = 0; i < count; i++) {
      // Spiral galaxy distribution
      const radius = Math.random() * 20 + 1;
      const branch = (i % 3) * ((Math.PI * 2) / 3);
      const spin = radius * 0.4;

      positions[i * 3]     = Math.cos(branch + spin) * radius + (Math.random() - 0.5) * 4;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = Math.sin(branch + spin) * radius + (Math.random() - 0.5) * 4;

      // Mix colors: lime near center, violet toward edges
      const t = Math.random();
      const mixedColor = t < 0.4 ? c1.clone().lerp(c2, Math.random())
                       : t < 0.7 ? c2.clone().lerp(c3, Math.random())
                       : c1.clone().lerp(c3, Math.random());

      colors[i * 3]     = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    return { positions, colors };
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    // Single rotation — no per-particle work = very cheap
    pointsRef.current.rotation.y += delta * 0.04;

    // Gentle mouse parallax on the whole mesh (not per-particle)
    pointsRef.current.rotation.x += (state.pointer.y * 0.3 - pointsRef.current.rotation.x) * 0.02;
    pointsRef.current.rotation.z += (state.pointer.x * 0.1 - pointsRef.current.rotation.z) * 0.02;
  });

  return (
    <>
      <color attach="background" args={['#080808']} />
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.07}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending} // Creates glow without postprocessing
          depthWrite={false}               // Prevents z-fighting artifacts
        />
      </points>
    </>
  );
};

export default ParticleField;
