import { useEffect, useRef, useState } from 'react';

export default function CustomCursor({ reducedMotion = false, isDragging = false }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const glowRef = useRef(null);
  const labelRef = useRef(null);

  const [enabled, setEnabled] = useState(false);
  const [cursorLabel, setCursorLabel] = useState('');
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || reducedMotion) {
      document.body.classList.remove('has-custom-cursor');
      setEnabled(false);
      return undefined;
    }

    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) {
      document.body.classList.remove('has-custom-cursor');
      setEnabled(false);
      return undefined;
    }

    setEnabled(true);
    document.body.classList.add('has-custom-cursor');

    const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const ringPos = { x: pos.x, y: pos.y };
    const glowPos = { x: pos.x, y: pos.y };
    let rafId = null;
    let visible = false;

    const onMove = (e) => {
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
        if (glowRef.current) glowRef.current.style.opacity = '1';
      }

      const target = e.target?.closest?.('[data-cursor], a, button');
      if (target) {
        const customLabel = target.getAttribute('data-cursor');
        setIsHovering(true);
        if (customLabel) {
          setCursorLabel(customLabel);
        } else if (target.tagName === 'A' && target.getAttribute('target') === '_blank') {
          setCursorLabel('OPEN');
        } else if (target.tagName === 'BUTTON' || target.tagName === 'A') {
          setCursorLabel('EXPLORE');
        } else {
          setCursorLabel('');
        }
      } else {
        setIsHovering(false);
        setCursorLabel('');
      }
    };

    const onLeave = () => {
      visible = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
      if (glowRef.current) glowRef.current.style.opacity = '0';
    };

    const tick = () => {
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      glowPos.x += (pos.x - glowPos.x) * 0.08;
      glowPos.y += (pos.y - glowPos.y) * 0.08;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0) translate(-50%, -50%)`;
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${glowPos.x}px, ${glowPos.y}px, 0) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [reducedMotion]);

  if (!enabled) return null;

  const activeLabel = isDragging ? 'ROTATE' : cursorLabel;
  const expanded = isHovering || isDragging || Boolean(activeLabel);

  return (
    <>
      {/* Cursor-following subtle ambient light */}
      <div
        ref={glowRef}
        className="fixed left-0 top-0 z-10 pointer-events-none opacity-0 transition-opacity duration-500"
        style={{
          width: '440px',
          height: '440px',
          borderRadius: '9999px',
          background:
            'radial-gradient(circle, rgba(0,240,255,0.085) 0%, rgba(236,72,153,0.04) 38%, transparent 72%)',
        }}
        aria-hidden="true"
      />

      {/* Smooth trailing cursor ring with context-aware label */}
      <div
        ref={ringRef}
        className={`fixed left-0 top-0 z-[9998] pointer-events-none opacity-0 flex items-center justify-center rounded-full border transition-[width,height,border-color,background-color] duration-300 ease-out ${
          expanded
            ? 'w-16 h-16 border-cyanGlow/70 bg-cyanGlow/10 backdrop-blur-[2px]'
            : 'w-8 h-8 border-pearl/35 bg-transparent'
        }`}
        aria-hidden="true"
      >
        {activeLabel && (
          <span
            ref={labelRef}
            className="font-mono text-[9px] tracking-[0.18em] text-pearl font-medium uppercase"
          >
            {activeLabel}
          </span>
        )}
      </div>

      {/* Glowing core dot */}
      <div
        ref={dotRef}
        className={`fixed left-0 top-0 z-[9999] pointer-events-none opacity-0 rounded-full transition-[width,height,opacity] duration-200 ${
          expanded ? 'w-1.5 h-1.5 bg-cyanGlow' : 'w-2 h-2 bg-pearl'
        }`}
        style={{
          boxShadow: '0 0 14px rgba(0, 240, 255, 0.9), 0 0 28px rgba(236, 72, 153, 0.45)',
        }}
        aria-hidden="true"
      />
    </>
  );
}

