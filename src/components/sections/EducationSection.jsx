import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { EDUCATION } from '../../data/portfolioData';
import SplitTextReveal from '../ui/SplitTextReveal';

export default function EducationSection() {
  return (
    <section
      id="education"
      className="relative py-28 md:py-36 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="hidden lg:block lg:col-span-4" aria-hidden="true" />

        <div className="lg:col-span-8 z-10">
          <p className="font-mono text-[11px] tracking-[0.26em] text-cyanGlow uppercase mb-4">
            05 // EDUCATION
          </p>

          <SplitTextReveal
            as="h2"
            text="ACADEMIC FOUNDATION."
            liquid
            className="font-display font-extrabold uppercase text-pearl text-4xl sm:text-6xl leading-[0.92] tracking-tight mb-12"
          />

          {/* Minimal Cinematic Timeline */}
          <div className="relative pl-7 sm:pl-10 border-l border-white/15 space-y-10">
            {/* Animated gradient accent overlay on timeline rail */}
            <div
              className="absolute left-[-1px] top-0 w-[1px] h-28 bg-gradient-to-b from-cyanGlow via-turquoise to-transparent"
              aria-hidden="true"
            />

            {EDUCATION.map((edu, idx) => (
              <motion.article
                key={edu.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.7, delay: idx * 0.14 }}
                className="relative obsidian-glass rounded-3xl p-6 sm:p-8 hover:border-cyanGlow/40 transition-colors"
              >
                {/* Glowing node marker on timeline */}
                <span
                  className="absolute -left-[34px] sm:-left-[46px] top-8 w-3 h-3 rounded-full bg-black border-2 border-cyanGlow shadow-[0_0_16px_rgba(0,240,255,0.85)]"
                  aria-hidden="true"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <span className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] uppercase text-cyanGlow">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>{edu.period}</span>
                  </span>
                  <span className="px-3 py-1 rounded-full border border-white/15 font-mono text-[10px] tracking-[0.16em] uppercase text-pearl/80">
                    {edu.scoreLabel}:{' '}
                    <span className="text-turquoise font-medium">{edu.scoreValue}</span>
                  </span>
                </div>

                <h3 className="font-display font-bold uppercase text-2xl sm:text-3xl text-pearl tracking-tight">
                  {edu.institution}
                </h3>
                <p className="mt-1 font-serif italic text-xl text-pearl/85">
                  {edu.degree}
                </p>
                <p className="mt-4 text-sm text-mist leading-relaxed max-w-2xl">
                  {edu.focus}
                </p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

