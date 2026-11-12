import { motion, AnimatePresence } from 'framer-motion';

export default function IntroLoader({ progress, visible, onSkip }) {
  const pct = Math.min(100, Math.round(progress * 100));

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-50 pointer-events-auto flex flex-col justify-between p-6 md:p-10 bg-black/75 backdrop-blur-[2px]"
          aria-label="Loading portfolio scene"
        >
          <div className="flex items-center justify-between font-mono text-[11px] tracking-[0.22em] text-mist uppercase">
            <span>RAHUL HOR // AI SYSTEMS</span>
            <button
              type="button"
              onClick={onSkip}
              data-cursor="OPEN"
              className="px-3 py-1 rounded-full border border-white/15 text-pearl/80 hover:text-cyanGlow hover:border-cyanGlow/50 transition-colors"
            >
              Skip Intro
            </button>
          </div>

          <div className="mx-auto text-center max-w-md pointer-events-none select-none">
            <p className="font-mono text-[10px] tracking-[0.32em] text-cyanGlow/80 uppercase mb-3">
              ASSEMBLING NEURAL CORE
            </p>
            <div className="font-display text-5xl md:text-6xl tracking-tight text-pearl tabular-nums">
              {String(pct).padStart(3, '0')}%
            </div>
            <div className="mt-4 w-52 h-[1px] bg-white/15 mx-auto overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyanGlow via-turquoise to-magentaGlow transition-all duration-150"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.22em] text-mist/70 uppercase">
            <span>GLSL PARTICLE SYNTHESIS</span>
            <span>PURBA BARDHAMAN, IN</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

