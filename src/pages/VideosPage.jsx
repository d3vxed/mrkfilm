import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { projects } from '@/data/projects';
import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';
import VideoModal from '@/components/VideoModal';
import ChatBot from '@/components/ChatBot';
import Reveal, { Line } from '@/components/Reveal';

const FILTERS = [['all', 'All'], ['landscape', 'Films'], ['portrait', 'Shorts']];
const films = projects.filter((p) => p.category === 'landscape');
const shorts = projects.filter((p) => p.category === 'portrait');
const counts = { all: projects.length, landscape: films.length, portrait: shorts.length };

const VideosPage = () => {
  const { darkMode } = useTheme();
  const [playing, setPlaying] = useState(null);
  const [filter, setFilter] = useState('all');

  return (
    <div className="min-h-screen page-in">
      {playing && <VideoModal project={playing} onClose={() => setPlaying(null)} />}
      <Header home={false} />
      <main className="mx-auto max-w-7xl px-5 pb-28 pt-32 sm:px-10 sm:pt-44">
        <p className="label">{counts[filter]} videos</p>
        <Reveal mask className="title mt-4 text-[15vw] sm:text-8xl"><Line>Video library</Line></Reveal>

        <div className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map(([k, label]) => (
            <button key={k} onClick={() => setFilter(k)}
              className={`border px-5 py-2.5 text-sm transition-all duration-300 ${filter === k ? 'border-fg bg-fg text-bg' : 'border-line text-muted hover:border-fg hover:text-fg'}`}>
              {label} <span className="ml-1 font-mono text-xs opacity-60">{counts[k]}</span>
            </button>
          ))}
        </div>

        {filter !== 'portrait' && (
          <section key={`f-${filter}`} className="mt-16">
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {films.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 100}><VideoCard project={p} onPlay={setPlaying} index={i} /></Reveal>)}
            </div>
          </section>
        )}
        {filter !== 'landscape' && (
          <section key={`s-${filter}`} className="mt-24">
            <p className="label mb-8">Shorts</p>
            <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-3 lg:grid-cols-4">
              {shorts.map((p, i) => <Reveal key={p.id} delay={(i % 4) * 100}><VideoCard project={p} onPlay={setPlaying} tall index={i} /></Reveal>)}
            </div>
          </section>
        )}
      </main>
      <footer className="border-t border-line py-8 text-center text-sm text-muted">© {new Date().getFullYear()} Mark Quitaleg</footer>
      <ChatBot darkMode={darkMode} />
    </div>
  );
};

export default VideosPage;
