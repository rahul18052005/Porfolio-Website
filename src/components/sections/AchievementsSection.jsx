import { motion } from 'framer-motion';
import { ArrowUpRight, Award, BookOpen, Languages } from 'lucide-react';
import { ACHIEVEMENTS, COURSES_AND_LANGUAGES } from '../../data/portfolioData';
import SplitTextReveal from '../ui/SplitTextReveal';
import MagneticButton from '../ui/MagneticButton';

export default function AchievementsSection() {
  return (
    <section
      id="achievements"
      className="relative py-28 md:py-36 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 z-10">
          <p className="font-mono text-[11px] tracking-[0.26em] text-cyanGlow uppercase mb-4">
            06 // KEY ACHIEVEMENTS
          </p>

          <SplitTextReveal
            as="h2"
            text="MILESTONES & CREDENTIALS."
            liquid
            className="font-display font-extrabold uppercase text-pearl text-4xl sm:text-6xl leading-[0.92] tracking-tight mb-12"
          />

          <div className="space-y-5">
            {ACHIEVEMENTS.map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.65, delay: idx * 0.1 }}
                className="group obsidian-glass rounded-3xl p-6 sm:p-8 hover:border-cyanGlow/45 transition-all relative overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-cyanGlow uppercase mb-2">
                      <Award className="w-3.5 h-3.5" />
                      <span>{item.tag}</span>
                    </div>
                    <h3 className="font-serif italic text-2xl sm:text-3xl text-pearl">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm sm:text-base text-mist leading-relaxed max-w-2xl">
                      {item.headline}
                    </p>
                  </div>

                  {item.link && (
                    <MagneticButton
                      as="a"
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      cursorLabel="OPEN"
                      className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-white/15 bg-white/[0.03] font-mono text-[10px] tracking-[0.16em] uppercase text-pearl hover:border-cyanGlow/60 hover:text-cyanGlow transition-colors self-start"
                    >
                      <span>{item.linkLabel}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </MagneticButton>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Courses & Languages Strip (Authentic Resume Details) */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="obsidian-glass-subtle rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-turquoise uppercase mb-4">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Courses & Certificates</span>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-pearl/85">
                {COURSES_AND_LANGUAGES.courses.map((course) => (
                  <li key={course} className="flex items-start gap-2">
                    <span className="text-cyanGlow mt-0.5">—</span>
                    <span>{course}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="obsidian-glass-subtle rounded-2xl p-6"
            >
              <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-magentaGlow uppercase mb-4">
                <Languages className="w-3.5 h-3.5" />
                <span>Languages</span>
              </div>
              <div className="space-y-3">
                {COURSES_AND_LANGUAGES.languages.map((lang) => (
                  <div
                    key={lang.name}
                    className="flex items-center justify-between border-b border-white/[0.06] pb-2 last:border-none last:pb-0"
                  >
                    <span className="text-sm text-pearl">{lang.name}</span>
                    <span className="font-mono text-[11px] text-mist">
                      {lang.level}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-4" aria-hidden="true" />
      </div>
    </section>
  );
}

