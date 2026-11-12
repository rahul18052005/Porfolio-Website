import { Component, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

import { useReducedMotion } from './hooks/useReducedMotion';
import { useWebGLSupport } from './hooks/useWebGLSupport';

import StaticFallback from './components/three/StaticFallback';
import CustomCursor from './components/ui/CustomCursor';
import IntroLoader from './components/ui/IntroLoader';
import Navbar from './components/ui/Navbar';
import ScrollProgress from './components/ui/ScrollProgress';

import HeroSection from './components/sections/HeroSection';
import AboutSection from './components/sections/AboutSection';
import ExpertiseSection from './components/sections/ExpertiseSection';
import ProjectsSection from './components/sections/ProjectsSection';
import EducationSection from './components/sections/EducationSection';
import AchievementsSection from './components/sections/AchievementsSection';
import ContactSection from './components/sections/ContactSection';

gsap.registerPlugin(ScrollTrigger);

// Lazy-load heavy Three.js 3D canvas for fast initial boot & optimal bundle splitting
const SceneCanvas = lazy(() => import('./components/three/SceneCanvas'));

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default function App() {
  const [motionOverride, setMotionOverride] = useState(null);
  const reducedMotion = useReducedMotion(motionOverride);
  const webglSupported = useWebGLSupport();

  const [shaderMode, setShaderMode] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');
  const [activeProjectIndex, setActiveProjectIndex] = useState(1);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDraggingSphere, setIsDraggingSphere] = useState(false);

  // Intro particle assembly state
  const [introProgress, setIntroProgress] = useState(0);
  const [introVisible, setIntroVisible] = useState(true);
  const [introRevealed, setIntroRevealed] = useState(false);

  const lenisRef = useRef(null);
  const introTweenRef = useRef(null);

  // Shared mutable state read inside Three.js useFrame at 60fps without causing React re-renders
  const sceneRef = useRef({
    assemblyProgress: 0,
    scrollProgress: 0,
    activeSection: 'hero',
    targetProjectIndex: 0,
    currentProjectBlend: 0,
    currentShaderMode: 0,
    mouse: { x: 0, y: 0 },
    mouseVec2: new THREE.Vector2(0, 0),
    pointerActive: false,
    spinVelocityX: 0,
    spinVelocityY: 0,
  });

  // Run or replay the Particle Explosion -> Sphere Assembly Intro
  const startIntroSequence = useCallback(() => {
    if (introTweenRef.current) introTweenRef.current.kill();

    if (reducedMotion || !webglSupported) {
      sceneRef.current.assemblyProgress = 1;
      setIntroProgress(1);
      setIntroVisible(false);
      setIntroRevealed(true);
      return;
    }

    sceneRef.current.assemblyProgress = 0;
    setIntroProgress(0);
    setIntroVisible(true);
    setIntroRevealed(false);

    const tracker = { val: 0 };
    introTweenRef.current = gsap.to(tracker, {
      val: 1,
      duration: 2.35,
      ease: 'power2.inOut',
      onUpdate: () => {
        sceneRef.current.assemblyProgress = tracker.val;
        setIntroProgress(tracker.val);
        if (tracker.val >= 0.72) {
          setIntroRevealed(true);
        }
      },
      onComplete: () => {
        sceneRef.current.assemblyProgress = 1;
        setIntroProgress(1);
        setIntroRevealed(true);
        setTimeout(() => setIntroVisible(false), 260);
      },
    });
  }, [reducedMotion, webglSupported]);

  useEffect(() => {
    startIntroSequence();
    return () => {
      if (introTweenRef.current) introTweenRef.current.kill();
    };
  }, [startIntroSequence]);

  const handleSkipIntro = useCallback(() => {
    if (introTweenRef.current) introTweenRef.current.kill();
    sceneRef.current.assemblyProgress = 1;
    setIntroProgress(1);
    setIntroRevealed(true);
    setIntroVisible(false);
  }, []);

  // Initialize Lenis smooth scroll + GSAP ScrollTrigger synchronization & choreography
  useEffect(() => {
    if (reducedMotion) return undefined;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    lenisRef.current = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const rafTick = (time) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafTick);
    gsap.ticker.lagSmoothing(0);

    // GSAP ScrollTrigger cinematic camera & 3D project transformation scrubbing
    const ctx = gsap.context(() => {
      const projectsEl = document.getElementById('projects');
      if (projectsEl) {
        ScrollTrigger.create({
          trigger: projectsEl,
          start: 'top center',
          end: 'bottom center',
          scrub: 0.6,
          onUpdate: (self) => {
            // Smoothly morph central 3D sphere across Project 01 -> 02 -> 03 as user scrolls
            const continuousIdx = 1 + self.progress * 2;
            sceneRef.current.targetProjectIndex = continuousIdx;
            const rounded = Math.min(3, Math.max(1, Math.round(continuousIdx)));
            setActiveProjectIndex((prev) => (prev !== rounded ? rounded : prev));
          },
          onLeave: () => {
            sceneRef.current.targetProjectIndex = 0;
          },
          onLeaveBack: () => {
            sceneRef.current.targetProjectIndex = 0;
          },
        });
      }

      // Subtle parallax depth across sections
      gsap.utils.toArray('[data-gsap-parallax]').forEach((el) => {
        gsap.fromTo(
          el,
          { y: 26 },
          {
            y: -26,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            },
          }
        );
      });
    });

    return () => {
      ctx.revert();
      gsap.ticker.remove(rafTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // Track section visibility & overall normalized scroll progress
  useEffect(() => {
    const sectionIds = [
      'hero',
      'about',
      'expertise',
      'projects',
      'education',
      'achievements',
      'contact',
    ];

    const onScroll = () => {
      const maxScroll = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
      const norm = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      sceneRef.current.scrollProgress = norm;
      setScrollProgress(norm);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (best) {
          const id = best.target.id;
          setActiveSection(id);
          sceneRef.current.activeSection = id;
          if (id === 'projects') {
            sceneRef.current.targetProjectIndex = activeProjectIndex;
          } else {
            sceneRef.current.targetProjectIndex = 0;
          }
        }
      },
      { threshold: [0.22, 0.45, 0.65], rootMargin: '-12% 0px -12% 0px' }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, [activeProjectIndex]);

  // Keep sphere morph target synchronized when active project changes while in Projects section
  const handleSelectProject = useCallback((projectNum) => {
    setActiveProjectIndex(projectNum);
    sceneRef.current.targetProjectIndex = projectNum;
  }, []);

  const handleNavigate = useCallback(
    (sectionId) => {
      const el = document.getElementById(sectionId);
      if (!el) return;
      if (lenisRef.current && !reducedMotion) {
        lenisRef.current.scrollTo(el, { offset: -20 });
      } else {
        el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    },
    [reducedMotion]
  );

  return (
    <div className="relative min-h-screen bg-black text-pearl overflow-x-hidden">
      {/* Hidden SVG Filter enabling subtle liquid distortion on selected editorial headlines */}
      <svg className="sr-only" aria-hidden="true">
        <defs>
          <filter id="liquid-distort">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.014 0.028"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="6"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Custom Cursor & Ambient Pointer Glow */}
      <CustomCursor reducedMotion={reducedMotion} isDragging={isDraggingSphere} />

      {/* Particle Assembly Intro Overlay */}
      <IntroLoader
        progress={introProgress}
        visible={introVisible}
        onSkip={handleSkipIntro}
      />

      {/* Persistent 3D World Canvas (or graceful static fallback) */}
      {webglSupported ? (
        <WebGLErrorBoundary fallback={<StaticFallback />}>
          <Suspense fallback={<StaticFallback />}>
            <SceneCanvas
              sceneRef={sceneRef}
              shaderMode={shaderMode}
              reducedMotion={reducedMotion}
              onDragSpin={setIsDraggingSphere}
            />
          </Suspense>
        </WebGLErrorBoundary>
      ) : (
        <StaticFallback />
      )}

      {/* Subtle Atmospheric Vignette ensuring effortless typography legibility */}
      <div
        className="fixed inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 45%, transparent 32%, rgba(0,0,0,0.58) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Top Navigation & Progress Waypoints */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        introRevealed={introRevealed}
      />

      <ScrollProgress
        progress={scrollProgress}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      {/* Scrollable Portfolio Foreground */}
      <main className="relative z-10">
        <HeroSection
          introRevealed={introRevealed}
          onNavigate={handleNavigate}
          shaderMode={shaderMode}
          onChangeShaderMode={setShaderMode}
          onReplayIntro={startIntroSequence}
          reducedMotion={reducedMotion}
          onToggleMotion={() => setMotionOverride((prev) => !(prev ?? reducedMotion))}
          webglSupported={webglSupported}
        />

        <AboutSection reducedMotion={reducedMotion} />

        <ExpertiseSection />

        <ProjectsSection
          activeProjectIndex={activeProjectIndex}
          onSelectProject={handleSelectProject}
        />

        <EducationSection />

        <AchievementsSection />

        <ContactSection onNavigate={handleNavigate} />
      </main>
    </div>
  );
}
