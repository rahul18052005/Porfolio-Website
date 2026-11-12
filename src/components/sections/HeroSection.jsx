import { motion } from 'framer-motion';
import { ArrowDownRight, Download, Move3d } from 'lucide-react';
import { HERO_CONTENT, PROFILE } from '../../data/portfolioData';
import SplitTextReveal from '../ui/SplitTextReveal';
import MagneticButton from '../ui/MagneticButton';
import SphereControls from '../ui/SphereControls';

export default function HeroSection({
  introRevealed,
  onNavigate,
  shaderMode,
  onChangeShaderMode,
  onReplayIntro,
  reducedMotion,
  onToggleMotion,
  webglSupported,
}) {
  return (
    <section
      id="hero"
      className="relative min-h-[100svh] flex flex-col justify-between pt-28 pb-8 md:pt-32 md:pb-10 px-5 sm:px-8 lg:px-12 max-w-[1440px] mx-auto"
    >
      {/* Top negative space spacer matching reference framing around central sphere */}
      <div className="hidden lg:block h-6" aria-hidden="true" />

      {/* Main Asymmetrical Split Framing the Central Iridescent Sphere */}
      <div className="grid grid-cols-1 lg:grid-cols-12 items-center gap-10 lg:gap-6 my-auto">
        {/* Left Main Typography */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={introRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
          transition={{ duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 z-10 text-left"
        >
          <p className="font-mono text-[10px] sm:text-[11px] tracking-[0.28em] text-cyanGlow/85 uppercase mb-4">
            AI / ML & SOFTWARE ARCHITECTURE
          </p>

          <h1 className="select-none">
            <SplitTextReveal
              as="span"
              text={HERO_CONTENT.headlineSerif}
              immediate={introRevealed}
              delay={0.15}
              liquid
              className="block font-serif italic font-normal text-pearl text-[3.4rem] sm:text-[4.6rem] xl:text-[5.8rem] leading-[0.94] tracking-[-0.01em]"
            />
            <SplitTextReveal
              as="span"
              text={HERO_CONTENT.headlineCondensed}
              immediate={introRevealed}
              delay={0.28}
              liquid
              className="block font-display font-extrabold uppercase text-pearl text-[3.8rem] sm:text-[5.2rem] xl:text-[6.6rem] leading-[0.88] tracking-[-0.02em] mt-1"
            />
          </h1>

          <p className="mt-6 text-sm sm:text-base text-pearl/75 max-w-sm leading-relaxed font-light">
            {HERO_CONTENT.supportingLine}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <MagneticButton
              type="button"
              onClick={() => onNavigate('projects')}
              cursorLabel="EXPLORE"
              className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full border border-cyanGlow/45 bg-cyanGlow/10 text-pearl hover:bg-cyanGlow/20 hover:border-cyanGlow transition-all font-mono text-[11px] tracking-[0.16em] uppercase"
            >
              <span>Explore Works</span>
              <ArrowDownRight className="w-3.5 h-3.5 text-cyanGlow group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
            </MagneticButton>

            <MagneticButton
              as="a"
              href={PROFILE.resumePdfPath}
              download="Rahul_Hor_Resume.pdf"
              cursorLabel="OPEN"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/15 bg-black/50 backdrop-blur-md text-mist hover:text-pearl hover:border-white/35 transition-all font-mono text-[11px] tracking-[0.16em] uppercase"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Resume</span>
            </MagneticButton>
          </div>
        </motion.div>

        {/* Center Open Window for the Massive Floating 3D Sphere */}
        <div
          className="lg:col-span-3 h-[210px] sm:h-[260px] lg:h-[340px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Right Editorial Introduction */}
        <motion.div
          data-gsap-parallax
          initial={{ opacity: 0, x: 24 }}
          animate={introRevealed ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
          transition={{ duration: 0.9, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-4 z-10 lg:pl-6"
        >
          <div className="obsidian-glass-subtle rounded-2xl p-6 sm:p-7 border border-white/[0.09] relative overflow-hidden">
            <div
              className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-cyanGlow/50 to-transparent"
              aria-hidden="true"
            />
            <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-mist/80 uppercase mb-4">
              <span>01 // INTRODUCTION</span>
              <span className="text-turquoise">B.TECH CSE (DS)</span>
            </div>
            <p className="text-base sm:text-[17px] text-pearl font-normal leading-relaxed">
              {HERO_CONTENT.introPrimary}
            </p>
            <p className="mt-3.5 text-sm text-mist leading-relaxed">
              {HERO_CONTENT.introSecondary}
            </p>

            <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2 font-mono text-[10px] tracking-[0.16em] text-mist/80 uppercase">
              <span>Purba Bardhaman, India</span>
              <button
                type="button"
                onClick={() => onNavigate('contact')}
                data-cursor="OPEN"
                className="text-cyanGlow hover:underline"
              >
                Get in touch →
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Interactive Bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={introRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.8, delay: 0.36 }}
        className="z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6"
      >
        <div className="flex items-center gap-3 font-mono text-[10px] tracking-[0.2em] text-mist uppercase">
          <Move3d className="w-3.5 h-3.5 text-cyanGlow" />
          <span>Drag void to rotate sphere · Scroll to morph universe</span>
        </div>

        <SphereControls
          shaderMode={shaderMode}
          onChangeMode={onChangeShaderMode}
          onReplayIntro={onReplayIntro}
          reducedMotion={reducedMotion}
          onToggleMotion={onToggleMotion}
          webglSupported={webglSupported}
        />
      </motion.div>
    </section>
  );
}
