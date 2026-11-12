const SECTION_ORDER = [
  { id: 'hero', label: '01 / HERO' },
  { id: 'about', label: '02 / ABOUT' },
  { id: 'expertise', label: '03 / EXPERTISE' },
  { id: 'projects', label: '04 / PROJECTS' },
  { id: 'education', label: '05 / EDUCATION' },
  { id: 'achievements', label: '06 / ACHIEVEMENTS' },
  { id: 'contact', label: '07 / CONTACT' },
];

export default function ScrollProgress({ progress, activeSection, onNavigate }) {
  const currentMeta =
    SECTION_ORDER.find((s) => s.id === activeSection) || SECTION_ORDER[0];

  return (
    <>
      {/* Top hairline progress track */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2px] bg-white/[0.04] pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-cyanGlow via-turquoise to-magentaGlow transition-[width] duration-75"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {/* Side vertical waypoint rail (desktop) */}
      <aside
        aria-label="Section progress indicator"
        className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col items-end gap-3"
      >
        <span className="font-mono text-[10px] tracking-[0.22em] text-mist/80 uppercase mb-1">
          {currentMeta.label}
        </span>
        <div className="flex flex-col items-end gap-2.5">
          {SECTION_ORDER.map((item) => {
            const active = item.id === activeSection;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                data-cursor="VIEW"
                aria-label={`Jump to ${item.label}`}
                className="group flex items-center gap-2 py-0.5"
              >
                <span className="font-mono text-[9px] tracking-[0.2em] text-mist opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.label.split(' / ')[1]}
                </span>
                <span
                  className={`block h-[2px] rounded-full transition-all duration-300 ${
                    active
                      ? 'w-7 bg-cyanGlow shadow-[0_0_10px_rgba(0,240,255,0.85)]'
                      : 'w-3 bg-white/20 group-hover:w-5 group-hover:bg-white/60'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
}

