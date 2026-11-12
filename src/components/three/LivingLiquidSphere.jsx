import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  liquidSphereVertexShader,
  liquidSphereFragmentShader,
} from '../../shaders/liquidSphereShader';
import {
  volumetricAuraVertexShader,
  volumetricAuraFragmentShader,
} from '../../shaders/rockyTerrainShader';

export default function LivingLiquidSphere({
  sceneRef,
  shaderMode = 0,
  isMobile = false,
  reducedMotion = false,
}) {
  const groupRef = useRef();
  const meshRef = useRef();
  const matRef = useRef();
  const auraMatRef = useRef();
  const cursorLightRef = useRef();

  const tempMouse3D = useMemo(() => new THREE.Vector3(), []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouseInfluence: { value: 0 },
      uMouseLocal: { value: new THREE.Vector3(0, 0, 1) },
      uDisplacementStrength: { value: 0.165 },
      uSpeed: { value: 0.78 },
      uProjectIndex: { value: 0 },
      uShaderMode: { value: 0 },
      uSpinImpulse: { value: 0 },
      uOpacity: { value: 0 },
      uCursorLightPos: { value: new THREE.Vector3(0, 0, 4) },
    }),
    []
  );

  const auraUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProjectIndex: { value: 0 },
      uIntensity: { value: 0.65 },
    }),
    []
  );

  // Use higher subdivision on desktop for glassy smooth normal derivatives
  const segments = isMobile ? 64 : 112;

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = sceneRef.current;

    if (!matRef.current || !groupRef.current || !meshRef.current) return;

    const elapsed = reducedMotion ? 0.5 : state.clock.elapsedTime;
    const assembly = s.assemblyProgress;

    // Smoothly interpolate project index & shader mode
    s.currentProjectBlend = THREE.MathUtils.lerp(
      s.currentProjectBlend,
      s.targetProjectIndex,
      dt * 3.8
    );
    s.currentShaderMode = THREE.MathUtils.lerp(
      s.currentShaderMode,
      shaderMode,
      dt * 4.5
    );

    // Decay pointer spin impulse
    s.spinVelocityX = THREE.MathUtils.lerp(s.spinVelocityX, 0, dt * 3.5);
    s.spinVelocityY = THREE.MathUtils.lerp(s.spinVelocityY, 0, dt * 3.5);
    s.mouseInfluence = THREE.MathUtils.lerp(
      s.mouseInfluence,
      s.pointerActive ? 1.0 : 0.18,
      dt * 4.0
    );

    // Convert normalized pointer to a local directional point on the sphere front face
    tempMouse3D.set(s.mouse.x * 1.4, s.mouse.y * 1.4, 1.35).normalize();
    uniforms.uMouseLocal.value.lerp(tempMouse3D, dt * 8.0);
    uniforms.uCursorLightPos.value.set(s.mouse.x * 4.5, s.mouse.y * 3.2 + 0.5, 4.2);

    if (cursorLightRef.current) {
      cursorLightRef.current.position.lerp(uniforms.uCursorLightPos.value, dt * 8.0);
    }

    uniforms.uTime.value = elapsed;
    uniforms.uMouseInfluence.value = reducedMotion ? 0.1 : s.mouseInfluence;
    uniforms.uProjectIndex.value = s.currentProjectBlend;
    uniforms.uShaderMode.value = s.currentShaderMode;
    uniforms.uSpinImpulse.value = Math.min(1.0, Math.abs(s.spinVelocityY) * 2.5);

    // Seamless fade-in + scale-in as particles condense onto the sphere shell
    const sphereReveal = THREE.MathUtils.smoothstep(assembly, 0.42, 0.88);
    uniforms.uOpacity.value = sphereReveal;

    const scaleBase = THREE.MathUtils.lerp(0.76, 1.0, sphereReveal);
    // Subtle scroll-aware scale breathing across sections
    const scrollScale =
      1.0 - Math.sin(Math.min(1, s.scrollProgress) * Math.PI) * 0.08;
    groupRef.current.scale.setScalar(scaleBase * scrollScale);

    // Gentle levitation above the reflective rocky floor
    const floatY = reducedMotion ? 0 : Math.sin(elapsed * 0.85) * 0.12;
    const projectLift = s.currentProjectBlend > 0.2 ? 0.15 : 0;
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      0.22 + floatY + projectLift,
      dt * 4.0
    );

    // Smooth horizontal framing offset as user scrolls through content-heavy sections
    // Hero = centered (0), About/Expertise = subtly right/back so typography breathes,
    // Projects = centered-right showcase, Contact = centered monument
    let targetX = 0;
    if (s.activeSection === 'about') targetX = isMobile ? 0 : 1.45;
    else if (s.activeSection === 'expertise') targetX = isMobile ? 0 : -1.5;
    else if (s.activeSection === 'projects') targetX = isMobile ? 0 : 1.15;
    else if (s.activeSection === 'education') targetX = isMobile ? 0 : -1.25;
    else if (s.activeSection === 'achievements') targetX = isMobile ? 0 : 1.25;
    else targetX = 0;

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetX,
      dt * 2.6
    );

    // Smooth auto-rotation + interactive drag momentum
    if (!reducedMotion) {
      meshRef.current.rotation.y += dt * 0.16 + s.spinVelocityY * dt * 2.8;
      meshRef.current.rotation.x += s.spinVelocityX * dt * 2.2;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        s.mouse.y * 0.2,
        dt * 1.5
      );
    }

    // Update volumetric aura behind sphere
    if (auraMatRef.current) {
      auraUniforms.uTime.value = elapsed;
      auraUniforms.uProjectIndex.value = s.currentProjectBlend;
      auraUniforms.uIntensity.value = 0.68 * sphereReveal;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0.22, 0]}>
      {/* Dynamic pointer-following specular rim light */}
      <pointLight
        ref={cursorLightRef}
        color="#00f0ff"
        intensity={2.6}
        distance={14}
        decay={2}
      />

      {/* Volumetric iridescent glow billboard behind the sphere */}
      <mesh position={[0, 0, -1.65]} scale={[9.5, 9.5, 1]}>
        <planeGeometry args={[1, 1]} />
        <shaderMaterial
          ref={auraMatRef}
          vertexShader={volumetricAuraVertexShader}
          fragmentShader={volumetricAuraFragmentShader}
          uniforms={auraUniforms}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Main Living Liquid Iridescent Sphere */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[1.68, segments, segments]} />
        <shaderMaterial
          ref={matRef}
          vertexShader={liquidSphereVertexShader}
          fragmentShader={liquidSphereFragmentShader}
          uniforms={uniforms}
          transparent
        />
      </mesh>
    </group>
  );
}

