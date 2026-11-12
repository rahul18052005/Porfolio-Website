import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { SKILL_CATEGORIES } from '../../data/portfolioData';
import SplitTextReveal from '../ui/SplitTextReveal';

export default function ExpertiseSection() {
  const [activeCatId, setActiveCatId] = useState('all');
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [mouseTilt, setMouseTilt] = useState({ x: 0, y: 0 });

  const specificCategories = useMemo(
    () => SKILL_CATEGORIES.filter((c) => c.id !== 'all'),
    []
  );

  const activeCategory = useMemo(
    () => SKILL_CATEGORIES.find((c) => c.id === activeCatId) || SKILL_CATEGORIES[0],
    [activeCatId]
  );

  const visibleSkills = useMemo(() => {
    if (activeCatId === 'all') {
      return specificCategories.flatMap((cat) =>
        cat.skills.map((name, sIdx) => ({
          name,
          categoryId: cat.id,
          categoryLabel: cat.label,
          shortLabel: cat.shortLabel,
          accent: cat.accent,
          depthOffset: ((sIdx % 3) - 1) * 14,
        }))
      );
    }
    return activeCategory.skills.map((name, sIdx) => ({
      name,
      categoryId: activeCategory.id,
      categoryLabel: activeCategory.label,
      shortLabel: activeCategory.shortLabel,
      accent: activeCategory.accent,
      depthOffset: ((sIdx % 3) - 1) * 18,
    }));
  }, [activeCatId, activeCategory, specificCategories]);

  const handleUniverseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMouseTilt({ x: ny * -5.5, y: nx * 6.5 });
  };

  return (
    <section
      id="expertise"
      className="relative py-28 md:py-36 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Space framing the 3D Sphere */}
        <div className="hidden lg:block lg:col-span-4" aria-hidden="true" />

        {/* Right Interactive Skill Universe */}
        <div className="lg:col-span-8 z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <p className="font-mono text-[11px] tracking-[0.26em] text-cyanGlow uppercase mb-4">
                03 // TECHNICAL EXPERTISE
              </p>
              <SplitTextReveal
                as="h2"
                text="SKILL UNIVERSE."
                liquid
                className="font-display font-extrabold uppercase text-pearl text-4xl sm:text-6xl leading-[0.92] tracking-tight"
              />
            </div>

            <div className="font-mono text-[11px] tracking-[0.14em] text-mist max-w-xs">
              {activeCategory.description}
            </div>
          </div>

          {/* Category Selector Orbit Bar */}
          <div
            className="flex flex-wrap gap-2 mb-8"
            role="tablist"
            aria-label="Technical skill categories"
          >
            {SKILL_CATEGORIES.map((cat) => {
              const active = cat.id === activeCatId;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveCatId(cat.id)}
                  data-cursor="VIEW"
                  className={`px-3.5 py-1.5 rounded-full font-mono text-[10px] sm:text-[11px] tracking-[0.14em] uppercase border transition-all duration-300 ${
                    active
                      ? 'bg-white/10 text-pearl border-cyanGlow/70 shadow-[0_0_18px_rgba(0,240,255,0.2)]'
                      : 'bg-black/50 text-mist border-white/10 hover:text-pearl hover:border-white/30'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* 3D Depth Floating Skill Cloud */}
          <div
            onMouseMove={handleUniverseMove}
            onMouseLeave={() => {
              setMouseTilt({ x: 0, y: 0 });
              setHoveredSkill(null);
            }}
            style={{ perspective: '1100px' }}
            className="obsidian-glass rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden"
          >
            {/* Ambient subtle grid lines */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.7) 1px, transparent 0)',
                backgroundSize: '28px 28px',
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 flex items-center justify-between mb-6 pb-4 border-b border-white/[0.08] font-mono text-[10px] tracking-[0.2em] uppercase text-mist">
              <span>
                DOMAIN //{' '}
                <span className="text-pearl">{activeCategory.label}</span>
              </span>
              <span>
                {hoveredSkill ? (
                  <span className="text-cyanGlow">
                    {hoveredSkill.name} · {hoveredSkill.categoryLabel}
                  </span>
                ) : (
                  <span>{visibleSkills.length} VERIFIED TECHNOLOGIES</span>
                )}
              </span>
            </div>

            <motion.div
              animate={{
                rotateX: mouseTilt.x,
                rotateY: mouseTilt.y,
              }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative z-10 flex flex-wrap gap-2.5 sm:gap-3"
            >
              {visibleSkills.map((skill, idx) => {
                const isSameCategoryHovered =
                  hoveredSkill && hoveredSkill.categoryId === skill.categoryId;
                const isDimmed = hoveredSkill && !isSameCategoryHovered;

                return (
                  <motion.div
                    key={`${skill.categoryId}-${skill.name}`}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{
                      opacity: isDimmed ? 0.34 : 1,
                      scale:
                        hoveredSkill?.name === skill.name ? 1.07 : 1,
                    }}
                    transition={{
                      duration: 0.28,
                      delay: Math.min(idx * 0.012, 0.25),
                    }}
                    onMouseEnter={() => setHoveredSkill(skill)}
                    onMouseLeave={() => setHoveredSkill(null)}
                    data-cursor="EXPLORE"
                    style={{
                      transform: `translateZ(${skill.depthOffset}px)`,
                    }}
                    className="group relative inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-cyanGlow/50 transition-colors select-none"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-150"
                      style={{ backgroundColor: skill.accent }}
                    />
                    <span className="text-xs sm:text-sm text-pearl/90 font-normal tracking-wide">
                      {skill.name}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.15em] text-mist/60 uppercase">
                      {skill.shortLabel}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

