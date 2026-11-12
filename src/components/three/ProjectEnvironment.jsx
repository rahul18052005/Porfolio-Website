import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

export default function ProjectEnvironment({ sceneRef, isMobile = false }) {
  const rootRef = useRef();
  const weightsRef = useRef({ p1: 0, p2: 0, p3: 0, t: 0 });

  useFrame((state) => {
    const s = sceneRef.current;
    if (!rootRef.current) return;

    const p = s.currentProjectBlend;
    // Triangular activation weights around project indices 1, 2, 3
    weightsRef.current.p1 = Math.max(0, 1 - Math.abs(p - 1));
    weightsRef.current.p2 = Math.max(0, 1 - Math.abs(p - 2));
    weightsRef.current.p3 = Math.max(0, 1 - Math.abs(p - 3));
    weightsRef.current.t = state.clock.elapsedTime;

    // Follow sphere X offset smoothly during Projects section
    const targetX = s.activeSection === 'projects' && !isMobile ? 1.15 : 0;
    rootRef.current.position.x = THREE.MathUtils.lerp(
      rootRef.current.position.x,
      targetX,
      0.06
    );
  });

  // Render wrapper components reading smooth weights each frame
  return (
    <group ref={rootRef} position={[0, 0.22, 0]}>
      <ProjectEnvironmentInstances weightsRef={weightsRef} isMobile={isMobile} />
    </group>
  );
}

function ProjectEnvironmentInstances({ weightsRef, isMobile }) {
  const w1 = useRef(0);
  const w2 = useRef(0);
  const w3 = useRef(0);
  const tRef = useRef(0);

  useFrame(() => {
    w1.current = weightsRef.current.p1;
    w2.current = weightsRef.current.p2;
    w3.current = weightsRef.current.p3;
    tRef.current = weightsRef.current.t;
  });

  return (
    <>
      <ReactiveAts wRef={w1} tRef={tRef} isMobile={isMobile} />
      <ReactiveAgent wRef={w2} tRef={tRef} />
      <ReactiveGym wRef={w3} tRef={tRef} />
    </>
  );
}

function ReactiveAts({ wRef, tRef, isMobile }) {
  const gRef = useRef();
  const scanRef = useRef();
  const docConfigs = useMemo(
    () => [
      { pos: [-2.15, 0.3, 0.65], rot: [0.08, 0.42, -0.04], scale: [1.05, 1.42, 1] },
      { pos: [2.15, -0.1, 0.45], rot: [-0.06, -0.45, 0.04], scale: [0.95, 1.3, 1] },
      { pos: [0.05, 1.55, -0.85], rot: [0.22, 0.04, 0.02], scale: [1.15, 0.82, 1] },
    ],
    []
  );
  const semanticLinks = useMemo(
    () => [
      [
        [-1.6, 0.3, 0.55],
        [-0.75, 0.4, 0.72],
        [0, 0.2, 0],
      ],
      [
        [1.65, -0.08, 0.38],
        [0.85, 0.14, 0.6],
        [0, 0.2, 0],
      ],
    ],
    []
  );

  useFrame(() => {
    const w = wRef.current;
    const t = tRef.current;
    if (!gRef.current) return;
    gRef.current.visible = w > 0.015;
    if (!gRef.current.visible) return;
    gRef.current.scale.setScalar(THREE.MathUtils.lerp(0.65, 1, w));
    gRef.current.rotation.y = Math.sin(t * 0.38) * 0.1;
    if (scanRef.current) scanRef.current.position.y = Math.sin(t * 2.0) * 0.6;
  });

  if (isMobile) return null;

  return (
    <group ref={gRef} visible={false}>
      {docConfigs.map((doc, idx) => (
        <group key={idx} position={doc.pos} rotation={doc.rot}>
          <mesh scale={doc.scale}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial
              color="#00f0ff"
              transparent
              opacity={0.08}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <lineSegments scale={doc.scale}>
            <edgesGeometry args={[new THREE.PlaneGeometry(1, 1)]} />
            <lineBasicMaterial color="#00f0ff" transparent opacity={0.62} />
          </lineSegments>
          {[-0.36, -0.18, 0, 0.18, 0.34].map((ly, li) => (
            <mesh
              key={li}
              position={[-0.08, ly * doc.scale[1], 0.02]}
              scale={[doc.scale[0] * (li === 0 ? 0.52 : 0.74), 0.026, 1]}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                color={li === 0 ? '#f4f6fa' : '#2dd4bf'}
                transparent
                opacity={li === 0 ? 0.72 : 0.34}
                depthWrite={false}
              />
            </mesh>
          ))}
          {idx === 0 && (
            <mesh
              ref={scanRef}
              position={[0, 0, 0.03]}
              scale={[doc.scale[0] * 1.08, 0.025, 1]}
            >
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial
                color="#00f0ff"
                transparent
                opacity={0.95}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>
          )}
        </group>
      ))}
      {semanticLinks.map((pts, idx) => (
        <Line
          key={idx}
          points={pts}
          color="#00f0ff"
          lineWidth={1.2}
          transparent
          opacity={0.48}
        />
      ))}
    </group>
  );
}

function ReactiveAgent({ wRef, tRef }) {
  const gRef = useRef();
  const pulseRefs = useRef([]);

  const { nodes, edges } = useMemo(() => {
    const n = [
      [0, 2.25, 0.2],
      [-2.2, 1.0, 0.55],
      [2.2, 1.1, 0.45],
      [-2.35, -0.7, -0.35],
      [2.35, -0.6, -0.4],
      [-1.3, 1.6, -1.1],
      [1.35, 1.5, -1.0],
      [0, -1.35, 1.45],
    ];
    const e = [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 4],
      [0, 5],
      [0, 6],
      [5, 1],
      [6, 2],
      [3, 7],
      [4, 7],
      [1, 7],
      [2, 7],
    ];
    return { nodes: n, edges: e };
  }, []);

  useFrame(() => {
    const w = wRef.current;
    const t = tRef.current;
    if (!gRef.current) return;
    gRef.current.visible = w > 0.015;
    if (!gRef.current.visible) return;
    gRef.current.scale.setScalar(THREE.MathUtils.lerp(0.65, 1, w));
    gRef.current.rotation.y = t * 0.18;

    pulseRefs.current.forEach((mesh, idx) => {
      if (!mesh) return;
      const [aIdx, bIdx] = edges[idx];
      const a = nodes[aIdx];
      const b = nodes[bIdx];
      const p = (t * 0.78 + idx * 0.19) % 1;
      mesh.position.set(
        THREE.MathUtils.lerp(a[0], b[0], p),
        THREE.MathUtils.lerp(a[1], b[1], p),
        THREE.MathUtils.lerp(a[2], b[2], p)
      );
    });
  });

  return (
    <group ref={gRef} visible={false}>
      {nodes.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh>
            <sphereGeometry args={[idx % 2 === 0 ? 0.105 : 0.08, 16, 16]} />
            <meshBasicMaterial color={idx % 2 === 0 ? '#ec4899' : '#00f0ff'} />
          </mesh>
          <mesh>
            <sphereGeometry args={[0.2, 14, 14]} />
            <meshBasicMaterial
              color={idx % 2 === 0 ? '#ec4899' : '#00f0ff'}
              transparent
              opacity={0.22}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
      {edges.map(([aIdx, bIdx], idx) => (
        <Line
          key={idx}
          points={[nodes[aIdx], nodes[bIdx]]}
          color={idx % 2 === 0 ? '#00f0ff' : '#ec4899'}
          lineWidth={1.15}
          transparent
          opacity={0.42}
        />
      ))}
      {edges.map((_, idx) => (
        <mesh
          key={idx}
          ref={(el) => {
            pulseRefs.current[idx] = el;
          }}
        >
          <sphereGeometry args={[0.046, 8, 8]} />
          <meshBasicMaterial color="#f4f6fa" blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
    </group>
  );
}

function ReactiveGym({ wRef, tRef }) {
  const gRef = useRef();
  const jointRefs = useRef([]);

  const baseJoints = useMemo(
    () => [
      [0, 1.32, 0],
      [0, 0.96, 0],
      [-0.46, 0.9, 0],
      [0.46, 0.9, 0],
      [-0.72, 0.44, 0.14],
      [0.72, 0.44, 0.14],
      [-0.62, 0.85, 0.42],
      [0.62, 0.85, 0.42],
      [0, 0.18, 0],
      [-0.27, -0.5, 0.12],
      [0.27, -0.5, 0.12],
      [-0.31, -1.22, 0],
      [0.31, -1.22, 0],
    ],
    []
  );

  const bones = useMemo(
    () => [
      [0, 1],
      [1, 2],
      [1, 3],
      [2, 4],
      [4, 6],
      [3, 5],
      [5, 7],
      [1, 8],
      [8, 9],
      [9, 11],
      [8, 10],
      [10, 12],
      [2, 8],
      [3, 8],
    ],
    []
  );

  const boneGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(bones.length * 6), 3)
    );
    return geo;
  }, [bones.length]);

  useFrame(() => {
    const w = wRef.current;
    const t = tRef.current;
    if (!gRef.current) return;
    gRef.current.visible = w > 0.015;
    if (!gRef.current.visible) return;
    gRef.current.scale.setScalar(THREE.MathUtils.lerp(0.68, 1, w));

    const curlFlex = Math.sin(t * 2.2) * 0.5 + 0.5;
    const animated = baseJoints.map((j, idx) => {
      let [x, y, z] = j;
      if (idx === 6 || idx === 7) {
        y = THREE.MathUtils.lerp(0.14, 0.94, curlFlex);
        z = THREE.MathUtils.lerp(0.18, 0.52, curlFlex);
      } else if (idx === 9 || idx === 10) {
        z = 0.12 + curlFlex * 0.18;
        y = -0.5 + curlFlex * 0.08;
      } else if (idx === 8) {
        y = 0.18 - curlFlex * 0.06;
      }
      return [x, y, z];
    });

    animated.forEach((p, idx) => {
      const m = jointRefs.current[idx];
      if (m) m.position.set(p[0], p[1], p[2]);
    });

    const attr = boneGeo.attributes.position;
    bones.forEach(([a, b], idx) => {
      attr.setXYZ(idx * 2, animated[a][0], animated[a][1], animated[a][2]);
      attr.setXYZ(idx * 2 + 1, animated[b][0], animated[b][1], animated[b][2]);
    });
    attr.needsUpdate = true;
    gRef.current.rotation.y = Math.sin(t * 0.45) * 0.28;
  });

  return (
    <group ref={gRef} position={[-2.05, 0.08, 0.85]} visible={false}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.32, 0]}>
        <ringGeometry args={[0.9, 0.95, 48]} />
        <meshBasicMaterial color="#2dd4bf" transparent opacity={0.55} side={THREE.DoubleSide} />
      </mesh>
      <lineSegments geometry={boneGeo}>
        <lineBasicMaterial color="#2dd4bf" transparent opacity={0.85} />
      </lineSegments>
      {baseJoints.map((pos, idx) => (
        <mesh
          key={idx}
          position={pos}
          ref={(el) => {
            jointRefs.current[idx] = el;
          }}
        >
          <sphereGeometry args={[idx === 0 ? 0.09 : 0.055, 12, 12]} />
          <meshBasicMaterial color={idx === 6 || idx === 7 ? '#f4f6fa' : '#00f0ff'} />
        </mesh>
      ))}
    </group>
  );
}
