// Graceful static iridescent visual fallback for unsupported WebGL devices or low-power environments
export default function StaticFallback() {
  return (
    <div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-black"
      aria-hidden="true"
    >
      {/* Ambient atmospheric aurora glow */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full opacity-40 blur-[110px]"
        style={{
          background:
            'radial-gradient(circle at 35% 35%, #00f0ff 0%, #2dd4bf 28%, #ec4899 58%, #000000 80%)',
        }}
      />

      {/* Central Iridescent Pearl-Obsidian Orb SVG */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] md:w-[390px] md:h-[390px]">
        <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_60px_rgba(0,240,255,0.28)]">
          <defs>
            <radialGradient id="staticOrbGrad" cx="36%" cy="30%" r="68%">
              <stop offset="0%" stopColor="#f8fafc" stopOpacity="0.95" />
              <stop offset="22%" stopColor="#00f0ff" stopOpacity="0.72" />
              <stop offset="48%" stopColor="#2dd4bf" stopOpacity="0.48" />
              <stop offset="72%" stopColor="#ec4899" stopOpacity="0.45" />
              <stop offset="90%" stopColor="#090b12" stopOpacity="0.98" />
              <stop offset="100%" stopColor="#020205" stopOpacity="1" />
            </radialGradient>
            <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#f4f6fa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.7" />
            </linearGradient>
          </defs>
          <circle cx="200" cy="200" r="165" fill="url(#staticOrbGrad)" />
          <circle
            cx="200"
            cy="200"
            r="165"
            fill="none"
            stroke="url(#rimGrad)"
            strokeWidth="1.5"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* Reflective rocky terrain horizon silhouette */}
      <div
        className="absolute inset-x-0 bottom-0 h-[32vh]"
        style={{
          background:
            'linear-gradient(to top, #020305 18%, rgba(6, 12, 18, 0.72) 55%, transparent 100%)',
        }}
      />
      <div
        className="absolute left-1/2 bottom-[8vh] -translate-x-1/2 w-[320px] h-[36px] rounded-full blur-2xl opacity-45"
        style={{
          background:
            'linear-gradient(90deg, rgba(0,240,255,0.4), rgba(236,72,153,0.4))',
        }}
      />
    </div>
  );
}

