import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import LivingLiquidSphere from './LivingLiquidSphere';
import ParticleAssembly from './ParticleAssembly';
import RockyTerrain from './RockyTerrain';
import ProjectEnvironment from './ProjectEnvironment';
import CameraRig from './CameraRig';

export default function SceneCanvas({
  sceneRef,
  shaderMode = 0,
  reducedMotion = false,
  onDragSpin,
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Track pointer position smoothly for mouse-reactive shader distortion & parallax
  useEffect(() => {
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onPointerMove = (e) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -((e.clientY / window.innerHeight) * 2 - 1);
      sceneRef.current.mouse.x = nx;
      sceneRef.current.mouse.y = ny;
      sceneRef.current.mouseVec2.set(nx, ny);
      sceneRef.current.pointerActive = true;

      if (dragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        sceneRef.current.spinVelocityY += dx * 0.008;
        sceneRef.current.spinVelocityX += dy * 0.006;
        lastX = e.clientX;
        lastY = e.clientY;
      }
    };

    const onPointerDown = (e) => {
      // Only initiate drag spin on canvas/hero open space, not inside interactive buttons/inputs
      if (e.target.closest('button, a, input, textarea, select')) return;
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      if (onDragSpin) onDragSpin(true);
    };

    const onPointerUp = () => {
      if (dragging && onDragSpin) onDragSpin(false);
      dragging = false;
    };

    const onPointerLeave = () => {
      sceneRef.current.pointerActive = false;
      dragging = false;
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    document.addEventListener('mouseleave', onPointerLeave);

    return () => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('mouseleave', onPointerLeave);
    };
  }, [sceneRef, onDragSpin]);

  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    >
      <Canvas
        shadows
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={{ position: [0, 0.3, 6.75], fov: 42, near: 0.1, far: 80 }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
        }}
      >
        <color attach="background" args={['#000000']} />
        <fogExp2 attach="fog" args={['#000000', 0.056]} />

        {/* Cinematic 3-point + iridescent accent lighting rig */}
        <ambientLight intensity={0.22} color="#8fa8c8" />
        <directionalLight
          position={[-4, 6, 4]}
          intensity={1.35}
          color="#f4f6fa"
          castShadow
        />
        <pointLight position={[-4.5, 1.5, 2.5]} intensity={14} distance={18} color="#00f0ff" />
        <pointLight position={[4.5, 0.8, 2.2]} intensity={12} distance={18} color="#ec4899" />
        <pointLight position={[0, 3.8, -4.5]} intensity={10} distance={20} color="#8b5cf6" />

        <Suspense fallback={null}>
          <CameraRig
            sceneRef={sceneRef}
            isMobile={isMobile}
            reducedMotion={reducedMotion}
          />
          <ParticleAssembly
            sceneRef={sceneRef}
            isMobile={isMobile}
            reducedMotion={reducedMotion}
          />
          <LivingLiquidSphere
            sceneRef={sceneRef}
            shaderMode={shaderMode}
            isMobile={isMobile}
            reducedMotion={reducedMotion}
          />
          <ProjectEnvironment sceneRef={sceneRef} isMobile={isMobile} />
          <RockyTerrain sceneRef={sceneRef} isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  );
}

