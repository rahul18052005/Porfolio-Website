import { useState, useEffect } from 'react';
import { Menu, X, Download } from 'lucide-react';
import { NAV_LINKS, PROFILE } from '../../data/portfolioData';
import MagneticButton from './MagneticButton';

export default function Navbar({ activeSection, onNavigate, introRevealed }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLinkClick = (id) => {
    setMobileOpen(false);
    onNavigate(id);
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-700 ${
        introRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}
    >
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? 'bg-black/75 backdrop-blur-xl border-b border-white/10 py-3.5'
            : 'bg-transparent py-5 md:py-7'
        }`}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
          {/* Left Identity */}
          <button
            type="button"
            onClick={() => handleLinkClick('hero')}
            data-cursor="EXPLORE"
            className="text-left group focus:outline-none"
          >
            <span className="block font-mono text-xs sm:text-[13px] tracking-[0.24em] text-pearl font-medium group-hover:text-cyanGlow transition-colors">
              {PROFILE.name}
            </span>
          </button>

          {/* Center-Left Availability & Direct Email (Matches Reference Hero Composition) */}
          <div className="hidden lg:flex items-center gap-4 font-mono text-[11px] tracking-[0.14em] text-mist">
            <span className="inline-flex items-center gap-2 text-pearl/80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-turquoise opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-turquoise" />
              </span>
              {PROFILE.availability}
            </span>
            <span className="text-white/20">/</span>
            <a
              href={`mailto:${PROFILE.email}`}
              data-cursor="OPEN"
              className="hover:text-cyanGlow transition-colors"
            >
              {PROFILE.email}
            </a>
          </div>

          {/* Right Minimal Monospace Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-2 lg:gap-4 font-mono text-[11px] tracking-[0.16em] uppercase"
          >
            {NAV_LINKS.map((item, idx) => {
              const isActive = activeSection === item.id;
              return (
                <div key={item.id} className="flex items-center gap-2 lg:gap-4">
                  <button
                    type="button"
                    onClick={() => handleLinkClick(item.id)}
                    data-cursor="VIEW"
                    className={`relative py-1 transition-colors ${
                      isActive ? 'text-cyanGlow' : 'text-mist hover:text-pearl'
                    }`}
                  >
                    {item.label}
                    <span
                      className={`absolute left-0 -bottom-0.5 h-[1px] bg-gradient-to-r from-cyanGlow to-magentaGlow transition-all duration-300 ${
                        isActive ? 'w-full opacity-100' : 'w-0 opacity-0'
                      }`}
                    />
                  </button>
                  {idx < NAV_LINKS.length - 1 && (
                    <span className="text-white/15 select-none" aria-hidden="true">
                      |
                    </span>
                  )}
                </div>
              );
            })}

            <MagneticButton
              as="a"
              href={PROFILE.resumePdfPath}
              download="Rahul_Hor_Resume.pdf"
              cursorLabel="OPEN"
              className="ml-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/15 bg-white/[0.03] text-pearl hover:border-cyanGlow/60 hover:text-cyanGlow transition-colors"
            >
              <Download className="w-3 h-3" />
              <span>CV</span>
            </MagneticButton>
          </nav>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden p-2 rounded-lg border border-white/15 text-pearl hover:border-cyanGlow/50"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-2xl border-b border-white/10 px-6 py-8 space-y-6">
          <div className="font-mono text-[11px] tracking-[0.14em] text-mist space-y-2 pb-4 border-b border-white/10">
            <div className="flex items-center gap-2 text-pearl">
              <span className="h-2 w-2 rounded-full bg-turquoise" />
              <span>{PROFILE.availability}</span>
            </div>
            <a href={`mailto:${PROFILE.email}`} className="block text-cyanGlow">
              {PROFILE.email}
            </a>
          </div>
          <nav className="flex flex-col gap-4 font-mono text-sm tracking-[0.18em] uppercase">
            {NAV_LINKS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleLinkClick(item.id)}
                className={`text-left py-1 ${
                  activeSection === item.id ? 'text-cyanGlow' : 'text-pearl/85'
                }`}
              >
                <span className="text-mist/50 mr-3">{item.index}</span>
                {item.label}
              </button>
            ))}
          </nav>
          <a
            href={PROFILE.resumePdfPath}
            download="Rahul_Hor_Resume.pdf"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-cyanGlow/40 text-cyanGlow font-mono text-xs tracking-[0.16em] uppercase"
          >
            <Download className="w-3.5 h-3.5" />
            Download Resume
          </a>
        </div>
      )}
    </header>
  );
}

