import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const NAV = [['Home', 'top'], ['Featured', 'featured'], ['Work', 'work'], ['About', 'about'], ['Gallery', 'gallery'], ['Contact', 'contact']];

const Header = ({ home = true }) => {
  const { darkMode, toggleDark } = useTheme();
  const [active, setActive] = useState('top');
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!home) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    NAV.forEach(([, id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [home]);

  const logo = 'text-lg font-bold tracking-[-0.04em]';
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-bg/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-5 sm:px-10">
        {home ? <a href="#top" className={logo}>Mark Quitaleg</a> : <Link to="/" className={logo}>Mark Quitaleg</Link>}

        <nav className="hidden items-center gap-8 lg:flex">
          {home ? NAV.map(([l, id]) => {
            const on = active === id;
            return (
              <a key={id} href={`#${id}`} className={`relative py-2 text-sm transition-colors ${on ? 'text-fg' : 'text-muted hover:text-fg'}`}>
                {l}<span className={`absolute inset-x-0 -bottom-px h-px origin-left bg-fg transition-transform duration-500 ${on ? 'scale-x-100' : 'scale-x-0'}`} />
              </a>
            );
          }) : <Link to="/" className="py-2 text-sm text-muted transition-colors hover:text-fg">Home</Link>}
        </nav>

        <div className="flex items-center gap-3">
          <button onClick={toggleDark} aria-label="Toggle theme" className="grid size-9 place-items-center border border-line transition-colors hover:bg-fg hover:text-bg">
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>
          <a href="mailto:quitalegmj24@gmail.com?subject=Inquiry from Portfolio&body=Hello Mark," className="btn !h-9 !px-4 max-sm:hidden">Hire me</a>
          {home && (
            <button onClick={() => setOpen((o) => !o)} aria-label="Menu" className="grid size-9 place-items-center border border-line lg:hidden">
              {open ? <X size={16} /> : <Menu size={16} />}
            </button>
          )}
        </div>
      </div>

      {home && open && (
        <nav className="border-t border-line bg-bg lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col px-5 py-2 sm:px-10">
            {NAV.map(([l, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className={`border-b border-line py-4 text-sm last:border-0 ${active === id ? 'text-fg' : 'text-muted'}`}>{l}</a>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
