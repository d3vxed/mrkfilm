import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';

/* Minimal cursor: a precise dot + a soft trailing ring.
   Ring grows over links/buttons and shows a play icon over videos. Desktop mouse only. */
const Cursor = () => {
  const dot = useRef(null), ring = useRef(null);
  const [mode, setMode] = useState('idle');
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    document.documentElement.classList.add('has-cursor');
    let x = -100, y = -100, rx = -100, ry = -100, raf;
    const move = (e) => { x = e.clientX; y = e.clientY; if (dot.current) dot.current.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%)`; };
    const over = (e) => {
      const t = e.target;
      if (t.closest?.('[data-nocursor]')) return setMode('off');
      const c = t.closest?.('[data-cursor]');
      setMode(c ? c.dataset.cursor : t.closest?.('a,button,input,textarea') ? 'link' : 'idle');
    };
    const tick = () => { rx += (x - rx) * 0.16; ry += (y - ry) * 0.16; if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; raf = requestAnimationFrame(tick); };
    window.addEventListener('mousemove', move, { passive: true }); window.addEventListener('mouseover', over);
    raf = requestAnimationFrame(tick);
    return () => { window.removeEventListener('mousemove', move); window.removeEventListener('mouseover', over); cancelAnimationFrame(raf); document.documentElement.classList.remove('has-cursor'); };
  }, []);

  const size = { idle: 34, link: 56, play: 76, off: 34 }[mode] ?? 34;
  return (
    <div aria-hidden className="pointer-events-none hidden [@media(pointer:fine)]:block">
      <div ref={dot} className="fixed left-0 top-0 z-[70] size-1.5 rounded-full bg-white mix-blend-difference transition-opacity duration-200" style={{ opacity: mode === 'play' || mode === 'off' ? 0 : 1 }} />
      <div ref={ring} className="fixed left-0 top-0 z-[69]">
        <div className="grid place-items-center rounded-full border transition-all duration-500 ease-[cubic-bezier(.16,1,.3,1)]"
          style={{ width: size, height: size, opacity: mode === 'off' ? 0 : 1,
            borderColor: mode === 'play' ? '#fff' : 'color-mix(in oklab, var(--fg) 45%, transparent)',
            background: mode === 'play' ? '#fff' : mode === 'link' ? 'color-mix(in oklab, var(--fg) 8%, transparent)' : 'transparent' }}>
          {mode === 'play' && <Play size={22} fill="#000" color="#000" className="ml-0.5" />}
        </div>
      </div>
    </div>
  );
};

export default Cursor;
