import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { computeRockyHeight } from '../../shaders/rockyTerrainShader';

export default function RockyTerrain({ sceneRef, isMobile = false }) {
  const terrainGroupRef = useRef();
  const terrainMatRef = useRef();

  // Procedural jagged obsidian terrain geometry surrounding the wet reflective mirror floor
  const terrainGeometry = useMemo(() => {
    const size = 44;
    const segs = isMobile ? 84 : 148;
    const geo = new THREE.PlaneGeometry(size, size, segs, segs);
    geo.rotateX(-Math.PI / 2);

    const posAttr = geo.attributes.position;
    for (let i = 0; i < posAttr.count; i += 1) {
      const x = posAttr.getX(i);
      const z = posAttr.getZ(i);
      const h = computeRockyHeight(x, z);
      posAttr.setY(i, h);
    }

    geo.computeVertexNormals();
    return geo;
  }, [isMobile]);

  // Scattered obsidian monolith shards framing the foreground/midground terrain
  const rockShards = useMemo(() => {
    const items = [];
    const count = isMobile ? 16 : 28;
    for (let i = 0; i < count; i += 1) {
      const angle = (i / count) * Math.PI * 2 + (i % 3) * 0.17;
      const radius = 3.2 + (i % 5) * 1.45 + Math.sin(i * 4.2) * 0.6;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      // Keep direct camera sightline clear in front of the sphere
      if (z > 2.2 && Math.abs(x) < 2.2) continue;

      const scaleX = 0.32 + ((i * 37) % 10) * 0.065;
      const scaleY = 0.22 + ((i * 53) % 10) * 0.075;
      const scaleZ = 0.34 + ((i * 71) % 10) * 0.06;
      const y = computeRockyHeight(x, z) - 0.15;

      items.push({
        id: i,
        position: [x, y, z],
        rotation: [((i * 19) % 10) * 0.08, angle, ((i * 23) % 10) * 0.08],
        scale: [scaleX, scaleY, scaleZ],
      });
    }
    return items;
  }, [isMobile]);

  useFrame((_, delta) => {
    const s = sceneRef.current;
    if (!terrainGroupRef.current) return;
    const dt = Math.min(delta, 0.05);
    const reveal = THREE.MathUtils.smoothstep(s.assemblyProgress, 0.52, 1.0);
    // Gently rise terrain into final view during intro reveal
    terrainGroupRef.current.position.y = THREE.MathUtils.lerp(
      terrainGroupRef.current.position.y,
      -2.16 - (1 - reveal) * 0.75,
      dt * 4.0
    );
  });

  return (
    <group ref={terrainGroupRef} position={[0, -2.16, 0]}>
      {/* Real-time wet obsidian mirror floor reflecting the iridescent sphere */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]} receiveShadow>
        <circleGeometry args={[18, 64]} />
        <MeshReflectorMaterial
          blur={isMobile ? [180, 60] : [360, 110]}
          resolution={isMobile ? 256 : 512}
          mixBlur={0.92}
          mixStrength={26}
          roughness={0.34}
          depthScale={1.05}
          minDepthThreshold={0.35}
          maxDepthThreshold={1.4}
          color="#04060a"
          metalness={0.82}
          mirror={0.76}
        />
      </mesh>

      {/* Procedural dark obsidian rocky terrain ridges */}
      <mesh geometry={terrainGeometry} receiveShadow castShadow position={[0, -0.02, 0]}>
        <meshStandardMaterial
          ref={terrainMatRef}
          color="#080a0f"
          roughness={0.58}
          metalness={0.52}
          flatShading
        />
      </mesh>

      {/* Angular volcanic rock shards catching cyan & magenta rim lights */}
      {rockShards.map((shard) => (
        <mesh
          key={shard.id}
          position={shard.position}
          rotation={shard.rotation}
          scale={shard.scale}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color="#07090e"
            roughness={0.44}
            metalness={0.62}
            flatShading
          />
        </mesh>
      ))}
    </group>
  );
}

