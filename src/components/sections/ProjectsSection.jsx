import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Layers, Sparkles, X } from 'lucide-react';
import { PROJECTS } from '../../data/portfolioData';
import SplitTextReveal from '../ui/SplitTextReveal';
import MagneticButton from '../ui/MagneticButton';

function ProjectCard3D({ project, isActive, onActivate, onInspect }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });
  const [demoNotice, setDemoNotice] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -9, ry: px * 11 });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  return (
    <motion.article
      ref={cardRef}
      data-project-card={project.index}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      style={{
        perspective: '1000px',
        transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition:
          tilt.rx === 0 && tilt.ry === 0
            ? 'transform 0.55s cubic-bezier(0.22, 1, 0.36, 1)'
            : 'transform 0.12s ease-out',
      }}
      className={`obsidian-glass rounded-3xl p-6 sm:p-8 transition-colors duration-500 relative overflow-hidden ${
        isActive
          ? 'border-cyanGlow/50 shadow-[0_0_50px_rgba(0,240,255,0.09)]'
          : 'border-white/10 opacity-85 hover:opacity-100'
      }`}
    >
      {/* Top accent line */}
      <div
        className="absolute inset-x-0 top-0 h-[1px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${project.visualTheme.primaryColor}, transparent)`,
        }}
        aria-hidden="true"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 font-mono text-[11px] tracking-[0.22em] uppercase">
          <span style={{ color: project.visualTheme.primaryColor }}>
            {project.code}
          </span>
          <span className="text-white/20">/</span>
          <span className="text-mist">{project.visualTheme.modeLabel}</span>
        </div>

        <button
          type="button"
          onClick={onActivate}
          data-cursor="VIEW"
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-mono text-[10px] tracking-[0.14em] uppercase border transition-all ${
            isActive
              ? 'border-cyanGlow/60 bg-cyanGlow/15 text-cyanGlow'
              : 'border-white/15 text-mist hover:text-pearl'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          <span>{isActive ? '3D Scene Active' : 'Morph 3D Sphere'}</span>
        </button>
      </div>

      <h3 className="font-display font-bold uppercase text-2xl sm:text-3xl lg:text-4xl text-pearl tracking-tight">
        {project.title}
      </h3>
      <p className="mt-1 font-serif italic text-lg sm:text-xl text-pearl/75">
        {project.subtitle}
      </p>

      {/* Tech Stack Chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {project.technologies.map((tech) => (
          <span
            key={tech}
            className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.03] font-mono text-[10px] tracking-[0.14em] uppercase text-pearl/85"
          >
            {tech}
          </span>
        ))}
      </div>

      <p className="mt-5 text-sm sm:text-base text-pearl/80 leading-relaxed font-light">
        {project.description}
      </p>

      <ul className="mt-5 space-y-2 border-t border-white/[0.08] pt-4">
        {project.features.map((feat, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2.5 text-xs sm:text-sm text-mist leading-relaxed"
          >
            <span
              className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
              style={{ backgroundColor: project.visualTheme.primaryColor }}
            />
            <span>{feat}</span>
          </li>
        ))}
      </ul>

      {/* Action Buttons: Real GitHub Link + Configurable Live Demo + Architecture Inspect */}
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <MagneticButton
          as="a"
          href={project.links.github}
          target="_blank"
          rel="noopener noreferrer"
          cursorLabel="OPEN"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/[0.04] text-pearl hover:border-cyanGlow/70 hover:text-cyanGlow transition-colors font-mono text-[11px] tracking-[0.14em] uppercase"
        >
          <Github className="w-3.5 h-3.5" />
          <span>GitHub</span>
        </MagneticButton>

        {project.links.liveDemo ? (
          <MagneticButton
            as="a"
            href={project.links.liveDemo}
            target="_blank"
            rel="noopener noreferrer"
            cursorLabel="OPEN"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyanGlow/50 bg-cyanGlow/15 text-pearl hover:bg-cyanGlow/25 transition-colors font-mono text-[11px] tracking-[0.14em] uppercase"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyanGlow" />
            <span>Live Demo</span>
          </MagneticButton>
        ) : (
          <MagneticButton
            type="button"
            onClick={() => setDemoNotice((prev) => !prev)}
            cursorLabel="VIEW"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/15 bg-black/40 text-mist hover:text-pearl hover:border-white/35 transition-colors font-mono text-[11px] tracking-[0.14em] uppercase"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Live Demo</span>
          </MagneticButton>
        )}

        <button
          type="button"
          onClick={() => onInspect(project)}
          data-cursor="VIEW"
          className="ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] uppercase text-cyanGlow hover:underline"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>3D Focus</span>
        </button>
      </div>

      {demoNotice && !project.links.liveDemo && (
        <p className="mt-3 px-3.5 py-2 rounded-xl border border-white/10 bg-black/70 font-mono text-[10px] tracking-[0.08em] text-mist">
          Live demo deployment URL is configurable via{' '}
          <code className="text-cyanGlow">src/data/portfolioData.js</code> or{' '}
          <code className="text-cyanGlow">VITE_PROJECT_*_DEMO</code>. Source code is live on GitHub above.
        </p>
      )}
    </motion.article>
  );
}

export default function ProjectsSection({ activeProjectIndex, onSelectProject }) {
  const sectionRef = useRef(null);
  const [inspectedProject, setInspectedProject] = useState(null);

  // Observe visible project cards while scrolling so the 3D sphere smoothly transforms automatically
  useEffect(() => {
    const root = sectionRef.current;
    if (!root) return undefined;

    const cards = Array.from(root.querySelectorAll('[data-project-card]'));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          const idx = Number(visible[0].target.getAttribute('data-project-card'));
          if (!Number.isNaN(idx)) {
            onSelectProject(idx);
          }
        }
      },
      { threshold: [0.35, 0.65], rootMargin: '-15% 0px -15% 0px' }
    );

    cards.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onSelectProject]);

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative py-28 md:py-36 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto"
    >
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
        <div>
          <p className="font-mono text-[11px] tracking-[0.26em] text-cyanGlow uppercase mb-4">
            04 // FEATURED PROJECTS
          </p>
          <SplitTextReveal
            as="h2"
            text="INTELLIGENT SYSTEMS."
            liquid
            className="font-display font-extrabold uppercase text-pearl text-4xl sm:text-6xl lg:text-[4.5rem] leading-[0.92] tracking-tight"
          />
        </div>

        {/* Sticky-friendly 3D Transformation Selector */}
        <div className="inline-flex flex-wrap items-center gap-2 obsidian-glass-subtle p-1.5 rounded-full self-start">
          {PROJECTS.map((p, idx) => {
            const pNum = idx + 1;
            const active = activeProjectIndex === pNum;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  onSelectProject(pNum);
                  const cardEl = document.querySelector(
                    `[data-project-card="${p.index}"]`
                  );
                  if (cardEl) {
                    cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }
                }}
                data-cursor="VIEW"
                className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] tracking-[0.15em] uppercase transition-all ${
                  active
                    ? 'bg-cyanGlow/20 text-cyanGlow border border-cyanGlow/50'
                    : 'text-mist hover:text-pearl border border-transparent'
                }`}
              >
                {p.index} · {p.shortTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split: Left Cards Stack, Right Live 3D Sphere & Environment Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        <div className="lg:col-span-7 space-y-8 z-10">
          {PROJECTS.map((project, idx) => (
            <ProjectCard3D
              key={project.id}
              project={project}
              isActive={activeProjectIndex === idx + 1}
              onActivate={() => onSelectProject(idx + 1)}
              onInspect={(p) => {
                onSelectProject(idx + 1);
                setInspectedProject(p);
              }}
            />
          ))}
        </div>

        {/* Right Sticky Environment Telemetry Caption framing the 3D Sphere Transformation */}
        <div className="hidden lg:block lg:col-span-5 lg:sticky lg:top-32 z-10 pointer-events-none">
          <div className="h-[390px]" />
          <div className="obsidian-glass-subtle rounded-2xl p-5 border border-white/10 pointer-events-auto">
            {(() => {
              const current =
                PROJECTS[Math.max(0, Math.min(2, (activeProjectIndex || 1) - 1))];
              return (
                <>
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] uppercase text-mist mb-2">
                    <span>ACTIVE 3D ENVIRONMENT</span>
                    <span style={{ color: current.visualTheme.primaryColor }}>
                      {current.code}
                    </span>
                  </div>
                  <div className="font-serif italic text-2xl text-pearl">
                    {current.visualTheme.name}
                  </div>
                  <p className="mt-1.5 font-mono text-[11px] text-mist">
                    {current.visualTheme.modeLabel} — Central liquid sphere shader and surrounding 3D telemetry morphing live.
                  </p>
                </>
              );
            })()}
          </div>
        </div>
      </div>

      {/* Lightweight Architectural Detail Modal */}
      {inspectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-label={inspectedProject.title}
        >
          <div className="obsidian-glass rounded-3xl max-w-xl w-full p-6 sm:p-8 relative border border-cyanGlow/40">
            <button
              type="button"
              onClick={() => setInspectedProject(null)}
              data-cursor="OPEN"
              aria-label="Close project details"
              className="absolute top-5 right-5 p-2 rounded-full border border-white/15 text-mist hover:text-pearl hover:border-cyanGlow/50"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="font-mono text-[10px] tracking-[0.22em] text-cyanGlow uppercase mb-2">
              {inspectedProject.code} // {inspectedProject.visualTheme.modeLabel}
            </p>
            <h3 className="font-display font-bold text-3xl uppercase text-pearl">
              {inspectedProject.title}
            </h3>
            <p className="mt-1 font-serif italic text-lg text-pearl/75">
              {inspectedProject.subtitle}
            </p>
            <p className="mt-4 text-sm text-pearl/85 leading-relaxed">
              {inspectedProject.description}
            </p>
            <div className="mt-5 pt-4 border-t border-white/10">
              <p className="font-mono text-[10px] tracking-[0.2em] text-mist uppercase mb-3">
                Core Capabilities
              </p>
              <ul className="space-y-2">
                {inspectedProject.features.map((f, i) => (
                  <li key={i} className="text-sm text-pearl/80 flex items-start gap-2">
                    <span className="text-cyanGlow">•</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <a
                href={inspectedProject.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyanGlow/50 bg-cyanGlow/15 text-pearl font-mono text-xs tracking-[0.14em] uppercase hover:bg-cyanGlow/25"
              >
                <Github className="w-4 h-4" />
                Open GitHub Repo
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
