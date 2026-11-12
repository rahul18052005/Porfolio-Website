import { RotateCcw, Sparkles, Pause, Play } from 'lucide-react';

const MODES = [
  { id: 0, label: 'Iridescent' },
  { id: 1, label: 'Lattice' },
  { id: 2, label: 'Obsidian' },
];

export default function SphereControls({
  shaderMode,
  onChangeMode,
  onReplayIntro,
  reducedMotion,
  onToggleMotion,
  webglSupported,
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1.5 px-2.5 py-1.5 rounded-full obsidian-glass-subtle">
      {webglSupported && (
        <>
          <span className="inline-flex items-center gap-1.5 px-2 font-mono text-[10px] tracking-[0.16em] text-mist uppercase">
            <Sparkles className="w-3 h-3 text-cyanGlow" />
            <span className="hidden sm:inline">Sphere</span>
          </span>

          <div className="flex items-center gap-1" role="group" aria-label="Sphere shader mode">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => onChangeMode(m.id)}
                data-cursor="VIEW"
                className={`px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.12em] uppercase transition-all ${
                  shaderMode === m.id
                    ? 'bg-cyanGlow/20 text-cyanGlow border border-cyanGlow/45'
                    : 'text-mist hover:text-pearl border border-transparent'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>

          <span className="h-3.5 w-[1px] bg-white/10 mx-0.5" aria-hidden="true" />

          <button
            type="button"
            onClick={onReplayIntro}
            data-cursor="EXPLORE"
            title="Replay particle assembly intro"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.12em] uppercase text-mist hover:text-pearl transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Assemble</span>
          </button>
        </>
      )}

      <button
        type="button"
        onClick={onToggleMotion}
        data-cursor="VIEW"
        title={reducedMotion ? 'Enable animations' : 'Reduce motion'}
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-mono text-[10px] tracking-[0.12em] uppercase text-mist hover:text-pearl transition-colors"
      >
        {reducedMotion ? <Play className="w-3 h-3 text-turquoise" /> : <Pause className="w-3 h-3" />}
        <span className="hidden md:inline">{reducedMotion ? 'Motion Off' : 'Motion On'}</span>
      </button>
    </div>
  );
}

