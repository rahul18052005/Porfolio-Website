import { useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function CameraRig({ sceneRef, isMobile = false, reducedMotion = false }) {
  const { camera } = useThree();
  const targetPos = useMemo(() => new THREE.Vector3(0, 0.35, 6.9), []);
  const targetLook = useMemo(() => new THREE.Vector3(0, -0.15, 0), []);
  const currentLook = useMemo(() => new THREE.Vector3(0, -0.15, 0), []);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    const s = sceneRef.current;

    // Cinematic camera keyframes driven smoothly by active section & scroll progress
    let camX = 0;
    let camY = 0.35;
    let camZ = isMobile ? 8.3 : 6.75;
    let lookY = -0.18;

    switch (s.activeSection) {
      case 'about':
        camX = isMobile ? 0 : -0.75;
        camY = 0.65;
        camZ = isMobile ? 8.6 : 7.15;
        lookY = -0.1;
        break;
      case 'expertise':
        camX = isMobile ? 0 : 0.85;
        camY = 0.95;
        camZ = isMobile ? 8.8 : 7.35;
        lookY = 0.05;
        break;
      case 'projects': {
        const p = s.currentProjectBlend;
        camX = isMobile ? 0 : -0.35 + Math.sin(p * 1.1) * 0.45;
        camY = 0.48 + (p - 1) * 0.1;
        camZ = isMobile ? 9.0 : 7.5;
        lookY = 0.08;
        break;
      }
      case 'education':
        camX = isMobile ? 0 : 0.65;
        camY = 0.35;
        camZ = isMobile ? 8.8 : 7.45;
        lookY = -0.25;
        break;
      case 'achievements':
        camX = isMobile ? 0 : -0.65;
        camY = 0.72;
        camZ = isMobile ? 8.7 : 7.25;
        lookY = -0.12;
        break;
      case 'contact':
        camX = 0;
        camY = 0.25;
        camZ = isMobile ? 8.4 : 6.45;
        lookY = -0.22;
        break;
      default: // hero
        camX = 0;
        camY = 0.3;
        camZ = isMobile ? 8.2 : 6.75;
        lookY = -0.22;
    }

    // Subtle pointer parallax
    const parallaxX = reducedMotion ? 0 : s.mouse.x * 0.38;
    const parallaxY = reducedMotion ? 0 : s.mouse.y * 0.24;

    targetPos.set(camX + parallaxX, camY + parallaxY, camZ);
    targetLook.set(0, lookY, 0);

    camera.position.lerp(targetPos, dt * 2.4);
    currentLook.lerp(targetLook, dt * 2.8);
    camera.lookAt(currentLook);
  });

  return null;
}

