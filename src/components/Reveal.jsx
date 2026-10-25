import { useEffect, useRef, useState } from 'react';

/* Fades/slides children in when scrolled into view. `mask` = headline line-mask mode.
   Safety: always becomes visible after 2.5s so content can never stay hidden. */
const Reveal = ({ as: T = 'div', delay = 0, mask = false, className = '', children, ...rest }) => {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.08 });
    io.observe(el);
    const t = setTimeout(() => setOn(true), 2500);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);
  return (
    <T ref={ref} style={{ '--d': `${delay}ms` }} className={`${mask ? '' : 'rv'} ${on ? 'in' : ''} ${className}`} {...rest}>
      {children}
    </T>
  );
};

export const Line = ({ children, delay = 0 }) => <span className="ml"><span style={{ '--d': `${delay}ms` }}>{children}</span></span>;
export default Reveal;
