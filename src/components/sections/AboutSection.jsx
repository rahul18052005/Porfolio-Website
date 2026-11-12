import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { ABOUT_CONTENT } from '../../data/portfolioData';
import SplitTextReveal from '../ui/SplitTextReveal';

function AnimatedCounter({ valueText, reducedMotion }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const numericMatch = valueText.match(/^(\d+)(.*)$/);
  const [display, setDisplay] = useState(numericMatch ? `0${numericMatch[2]}` : valueText);

  useEffect(() => {
    if (!inView || !numericMatch || reducedMotion) {
      setDisplay(valueText);
      return undefined;
    }

    const target = parseInt(numericMatch[1], 10);
    const suffix = numericMatch[2] || '';
    const duration = 1200;
    const start = performance.now();
    let rafId;

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(`${Math.round(target * eased)}${suffix}`);
      if (t < 1) rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [inView, valueText, reducedMotion]);

  return <span ref={ref}>{display}</span>;
}

export default function AboutSection({ reducedMotion = false }) {
  return (
    <section
      id="about"
      className="relative py-28 md:py-36 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Content Column (leaving open breathing space on right for 3D sphere framing) */}
        <div className="lg:col-span-7 z-10">
          <p className="font-mono text-[11px] tracking-[0.26em] text-cyanGlow uppercase mb-4">
            02 // ABOUT ME
          </p>

          <SplitTextReveal
            as="h2"
            text={ABOUT_CONTENT.headline}
            liquid
            className="font-display font-extrabold uppercase text-pearl text-4xl sm:text-6xl lg:text-[4.5rem] leading-[0.92] tracking-tight"
          />

          <div className="mt-8 space-y-5 text-base sm:text-lg text-pearl/80 leading-relaxed max-w-2xl font-light">
            {ABOUT_CONTENT.paragraphs.map((para, idx) => (
              <motion.p
                key={idx}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.65, delay: idx * 0.1 }}
              >
                {para}
              </motion.p>
            ))}
          </div>

          {/* Animated Milestones Grid */}
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ABOUT_CONTENT.highlights.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: idx * 0.08 }}
                data-cursor="VIEW"
                className="group obsidian-glass rounded-2xl p-6 hover:border-cyanGlow/35 transition-all duration-300 relative overflow-hidden"
              >
                <div
                  className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-cyanGlow/5 blur-2xl group-hover:bg-cyanGlow/15 transition-colors"
                  aria-hidden="true"
                />
                <div className="font-display text-3xl sm:text-4xl font-bold text-iridescent tracking-tight">
                  <AnimatedCounter
                    valueText={item.metric}
                    reducedMotion={reducedMotion}
                  />
                </div>
                <div className="mt-2 font-mono text-xs tracking-[0.14em] uppercase text-pearl">
                  {item.label}
                </div>
                <p className="mt-2 text-xs sm:text-sm text-mist leading-relaxed">
                  {item.detail}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Negative Space allowing the living 3D sphere to stay visible */}
        <div className="hidden lg:block lg:col-span-5" aria-hidden="true" />
      </div>
    </section>
  );
}

