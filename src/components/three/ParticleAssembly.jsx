import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  particleAssemblyVertexShader,
  particleAssemblyFragmentShader,
} from '../../shaders/particleIntroShader';

export default function ParticleAssembly({
  sceneRef,
  isMobile = false,
  reducedMotion = false,
}) {
  const pointsRef = useRef();
  const matRef = useRef();
  const { gl } = useThree();

  const count = isMobile ? 2200 : 5400;

  const { geometry, uniforms } = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const scatterPos = new Float32Array(count * 3);
    const spherePos = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    const colorMix = new Float32Array(count);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      const rand = Math.random();
      randoms[i] = rand;
      colorMix[i] = Math.random();

      // Exploded nebula distribution across deep 3D space
      const scatterRadius = 4.5 + Math.pow(Math.random(), 0.7) * 14.0;
      const thetaS = Math.random() * Math.PI * 2;
      const phiS = Math.acos(2 * Math.random() - 1);

      scatterPos[i3] = scatterRadius * Math.sin(phiS) * Math.cos(thetaS);
      scatterPos[i3 + 1] = scatterRadius * Math.sin(phiS) * Math.sin(thetaS) * 0.72 + 0.4;
      scatterPos[i3 + 2] = scatterRadius * Math.cos(phiS);

      // Fibonacci-like spherical shell target matching LivingLiquidSphere radius (~1.72)
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = 1.72 + (Math.random() - 0.5) * 0.08;

      const sx = r * Math.sin(phi) * Math.cos(theta);
      const sy = r * Math.cos(phi) + 0.22;
      const sz = r * Math.sin(phi) * Math.sin(theta);

      spherePos[i3] = sx;
      spherePos[i3 + 1] = sy;
      spherePos[i3 + 2] = sz;

      // Initial positions attribute
      positions[i3] = sx;
      positions[i3 + 1] = sy;
      positions[i3 + 2] = sz;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('aScatterPos', new THREE.BufferAttribute(scatterPos, 3));
    geo.setAttribute('aSpherePos', new THREE.BufferAttribute(spherePos, 3));
    geo.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));
    geo.setAttribute('aColorMix', new THREE.BufferAttribute(colorMix, 1));

    const u = {
      uTime: { value: 0 },
      uProgress: { value: reducedMotion ? 1.0 : 0.0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uProjectIndex: { value: 0 },
    };

    return { geometry: geo, uniforms: u };
  }, [count, gl, reducedMotion]);

  useFrame((state, delta) => {
    const s = sceneRef.current;
    if (!matRef.current || !pointsRef.current) return;

    const dt = Math.min(delta, 0.05);
    uniforms.uTime.value = reducedMotion ? 0 : state.clock.elapsedTime;
    uniforms.uProgress.value = reducedMotion ? 1.0 : s.assemblyProgress;
    uniforms.uMouse.value.lerp(s.mouseVec2, dt * 4.5);
    uniforms.uProjectIndex.value = s.currentProjectBlend;

    // Follow the LivingLiquidSphere gentle horizontal framing offset
    let targetX = 0;
    if (s.activeSection === 'about') targetX = isMobile ? 0 : 1.45;
    else if (s.activeSection === 'expertise') targetX = isMobile ? 0 : -1.5;
    else if (s.activeSection === 'projects') targetX = isMobile ? 0 : 1.15;
    else if (s.activeSection === 'education') targetX = isMobile ? 0 : -1.25;
    else if (s.activeSection === 'achievements') targetX = isMobile ? 0 : 1.25;

    pointsRef.current.position.x = THREE.MathUtils.lerp(
      pointsRef.current.position.x,
      targetX,
      dt * 2.6
    );
  });

  return (
    <points ref={pointsRef} geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={matRef}
        vertexShader={particleAssemblyVertexShader}
        fragmentShader={particleAssemblyFragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

