import cvFile from '@/assets/CV-video-editor.pdf';
import LightProfile from '@/assets/bg-light.png';
import DarkProfile from '@/assets/bg-black.png';
import BtsEditing from '@/assets/editing-session1.jfif';
import BtsDark from '@/assets/reasearch.jfif';
import BtsPhotographer from '@/assets/photographer.jfif';
import BtsCertificate from '@/assets/certficate.jfif';
import BtsSelf from '@/assets/self.jfif';
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Download, Megaphone, PenTool, Play, Share2, Sparkles, Video, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';

import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { projects } from '@/data/projects';
import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';
import VideoModal from '@/components/VideoModal';
import ChatBot from '@/components/ChatBot';
import Cursor from '@/components/Cursor';
import Reveal, { Line } from '@/components/Reveal';
import VideosPage from '@/pages/VideosPage';

const EMAIL = 'quitalegmj24@gmail.com';
const rank = (a, b) => Number(b.featured) - Number(a.featured) || a.id - b.id;
const films = projects.filter((p) => p.category === 'landscape').sort(rank);
const shorts = projects.filter((p) => p.category === 'portrait').sort(rank);
const FEATURED = films.slice(0, 3);
const pad = (n) => String(n).padStart(2, '0');

const techStack = [
  { label: 'Video', items: ['Premiere Pro', 'After Effects', 'Capcut', 'KineMaster'] },
  { label: 'Design', items: ['Photoshop', 'Canva', 'Illustrator', 'Figma', 'Lightroom'] },
  { label: 'Other', items: ['Freepik', 'Pixabay', 'Pexels', 'ChatGPT'] },
];
const skills = [
  { icon: Video, label: 'Film Editing', sub: 'Premiere Pro · Capcut · Color Grading' },
  { icon: Megaphone, label: 'Commercial & Ads', sub: 'Premiere Pro · Capcut' },
  { icon: Share2, label: 'Short-Form Content', sub: 'Capcut · Premiere Pro · After Effects' },
  { icon: Sparkles, label: 'Trailers & Promos', sub: 'Premiere Pro · After Effects' },
  { icon: PenTool, label: 'Graphics Design', sub: 'Photoshop · Canva · Illustrator' },
];
const experience = [
  { title: 'Freelance Video Editor', sub: 'WFH', period: '2023 – Present' },
  { title: 'Head Of Video Editing Team', sub: 'Organization', period: '2023 – 2024' },
  { title: 'Vice President', sub: 'Multimedia Org', period: '2024 – 2025' },
];
const education = [
  { title: 'Kolehiyo ng Lungsod ng Dasmariñas', sub: "BS Information Systems · Dean's Lister", period: '2022 – Present' },
  { title: 'Dasmarinas Integrated High School', sub: 'Humanities and Social Sciences · Graduated with honors', period: '2016 – 2022' },
];
const stats = [['50+', 'Projects'], ['20+', 'Clients'], ['3', 'Years']];
const gallery = [[BtsEditing, 'Editing session'], [BtsDark, 'Awards'], [BtsPhotographer, 'Photographer'], [BtsCertificate, 'Certificate'], [BtsSelf, 'Self portrait']];

const wrap = 'mx-auto max-w-7xl px-5 sm:px-10';

const Section = ({ id, label, title, action, children }) => (
  <section id={id} className="scroll-mt-16 border-t border-line py-20 sm:py-32">
    <div className={wrap}>
      <Reveal className="mb-12 flex items-end justify-between gap-4 sm:mb-16">
        <div><p className="label">{label}</p><h2 className="title mt-4 text-4xl sm:text-6xl">{title}</h2></div>
        {action}
      </Reveal>
      {children}
    </div>
  </section>
);

const Rows = ({ items }) => (
  <ul className="border-t border-line">
    {items.map((e, i) => (
      <Reveal as="li" key={e.title} delay={i * 80} className="flex items-start justify-between gap-4 border-b border-line py-5">
        <div className="min-w-0"><p className="font-medium">{e.title}</p><p className="mt-1 text-sm text-muted">{e.sub}</p></div>
        <span className="shrink-0 pt-0.5 font-mono text-xs text-muted">{e.period}</span>
      </Reveal>
    ))}
  </ul>
);

/* Hero: plain and minimal. Text only, no media. */
const Hero = ({ onPlay }) => (
  <section id="top" className="flex min-h-[100svh] flex-col pt-16">
    <div className={`${wrap} flex flex-1 flex-col justify-center py-20`}>
      <Reveal><p className="label">Video editor · Freelance · Dasmariñas, PH</p></Reveal>
      <Reveal mask className="title mt-6 max-w-5xl text-[13vw] sm:text-7xl lg:text-8xl"><Line>Video editing for films, ads &amp; short-form.</Line></Reveal>
      <Reveal delay={300} as="p" className="mt-8 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
        <span className="font-medium text-fg">Mark Quitaleg.</span> Films, commercials, trailers and social content, from planning to final export.
      </Reveal>
      <Reveal delay={450} className="mt-10 flex flex-wrap gap-4">
        <button onClick={() => onPlay(FEATURED[0])} className="btn btn-solid"><Play size={13} fill="currentColor" /> Play featured</button>
        <a href="#featured" className="btn">Featured videos <ArrowRight size={14} /></a>
      </Reveal>
    </div>
    <div className="border-t border-line">
      <div className={`${wrap} flex flex-wrap items-center justify-between gap-x-8 gap-y-4 py-5`}>
        <p className="flex items-center gap-2 text-sm text-muted"><span className="size-1.5 rounded-full bg-fg" /> Open for freelance projects</p>
        <div className="flex items-center gap-8">
          {stats.map(([v, l]) => <p key={l} className="flex items-baseline gap-2"><span className="text-xl font-semibold tracking-tight">{v}</span><span className="label">{l}</span></p>)}
        </div>
      </div>
    </div>
  </section>
);

/* Gallery: asymmetric grid, greyscale to colour on hover, click for a full-screen viewer. */
const Lightbox = ({ i, set }) => {
  useEffect(() => {
    const n = gallery.length;
    const k = (e) => { if (e.key === 'Escape') set(null); if (e.key === 'ArrowRight') set((v) => (v + 1) % n); if (e.key === 'ArrowLeft') set((v) => (v - 1 + n) % n); };
    window.addEventListener('keydown', k);
    const o = document.body.style.overflow; document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = o; };
  }, [set]);
  const [src, cap] = gallery[i];
  const n = gallery.length;
  return (
    <div data-nocursor onClick={() => set(null)} className="fixed inset-0 z-50 grid place-items-center bg-black/95 p-4 pb-20">
      <img src={src} alt={cap} className="max-h-[78vh] max-w-full rounded-md object-contain" />
      <button onClick={() => set(null)} aria-label="Close" className="absolute right-5 top-5 grid size-10 place-items-center border border-white/25 text-white hover:bg-white/10"><X size={18} /></button>
      <div onClick={(e) => e.stopPropagation()} className="absolute inset-x-0 bottom-0 flex items-center justify-between p-5 font-mono text-xs uppercase tracking-widest text-white/70">
        <span>{pad(i + 1)} / {pad(n)} — {cap}</span>
        <span className="flex gap-2">
          <button onClick={() => set((i - 1 + n) % n)} aria-label="Previous" className="grid size-10 place-items-center border border-white/25 text-white hover:bg-white/10"><ChevronLeft size={18} /></button>
          <button onClick={() => set((i + 1) % n)} aria-label="Next" className="grid size-10 place-items-center border border-white/25 text-white hover:bg-white/10"><ChevronRight size={18} /></button>
        </span>
      </div>
    </div>
  );
};

const ProfileContent = () => {
  const { darkMode } = useTheme();
  const [playing, setPlaying] = useState(null);
  const [box, setBox] = useState(null);

  return (
    <div className="page-in min-h-screen">
      {playing && <VideoModal project={playing} onClose={() => setPlaying(null)} />}
      {box !== null && <Lightbox i={box} set={setBox} />}
      <Header />
      <Hero onPlay={setPlaying} />

      <Section id="featured" label="Featured" title="Featured videos">
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-3">
          {FEATURED.map((p, i) => <Reveal key={p.id} delay={i * 120}><VideoCard project={p} onPlay={setPlaying} index={i} /></Reveal>)}
        </div>
      </Section>

      <Section id="work" label={`Selected work · ${projects.length} videos`} title="Films & promos"
        action={<Link to="/videos" className="ul hidden shrink-0 items-center gap-2 text-sm font-medium sm:flex">View all <ArrowUpRight size={16} /></Link>}>
        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {films.slice(3, 9).map((p, i) => <Reveal key={p.id} delay={(i % 3) * 120}><VideoCard project={p} onPlay={setPlaying} index={i} /></Reveal>)}
        </div>
        <Reveal className="mb-10 mt-24"><p className="label">Vertical</p><h3 className="title mt-4 text-3xl sm:text-5xl">Shorts</h3></Reveal>
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {shorts.slice(0, 4).map((p, i) => <Reveal key={p.id} delay={i * 120} className={i % 2 ? 'lg:mt-14' : ''}><VideoCard project={p} onPlay={setPlaying} tall index={i} /></Reveal>)}
        </div>
        <Reveal className="mt-16"><Link to="/videos" className="btn">Open full video library <ArrowRight size={14} /></Link></Reveal>
      </Section>

      <Section id="about" label="About" title="Behind the edit">
        <div className="grid gap-16 lg:grid-cols-[1.5fr_1fr] lg:gap-24">

<div>
  <Reveal>
    <img
      src={darkMode ? DarkProfile : LightProfile}
      alt="Mark Quitaleg"
      className="mb-10 size-24 rounded-md object-cover grayscale sm:size-32"
    />
  </Reveal>

  <Reveal as="p" className="title text-3xl !leading-[1.1] sm:text-5xl">
    Started in video editing through necessity, stayed for the craft.{' '}
    <span className="text-muted">
      Now bringing creative ideas to life through media production, films,
      commercials, and live event coverage.
    </span>
  </Reveal>

  <div className="mt-10 max-w-2xl space-y-5 leading-relaxed text-muted sm:text-lg">
    <Reveal as="p">
      As a freelance creative, I collaborate with clients on social media
      content, promotional videos, and digital projects, combining creative
      storytelling with clean execution and clear communication.
    </Reveal>

    <Reveal as="p" delay={100}>
      Beyond video editing, I work in graphic design using{' '}
      <span className="text-fg">
        Photoshop, Illustrator, and Canva
      </span>{' '}
      to create cohesive visual experiences. A graduate of Kolehiyo ng Lungsod
      ng Dasmariñas with a degree in{' '}
      <span className="text-fg">
        Bachelor of Science in Information Systems
      </span>
      , I bring a balance of creative thinking, technical skills, and a
      systems-oriented approach to every project.
    </Reveal>
  </div>
</div>
          <ul className="border-t border-line self-start">
            {skills.map(({ icon: Icon, label, sub }, i) => (
              <Reveal as="li" key={label} delay={i * 70} className="flex items-start gap-4 border-b border-line py-5 transition-[padding] duration-500 hover:pl-3">
                <Icon size={18} className="mt-0.5 shrink-0" />
                <div><p className="font-medium">{label}</p><p className="mt-1 text-sm text-muted">{sub}</p></div>
              </Reveal>
            ))}
          </ul>
        </div>

        <div className="mt-24 space-y-6">
          <Reveal><p className="label">Tools</p></Reveal>
          {techStack.map((g, gi) => (
            <Reveal key={g.label} delay={gi * 100} className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-8">
              <span className="label w-16 shrink-0">{g.label}</span>
              <div className="flex flex-wrap gap-2">
                {g.items.map((t) => <span key={t} className="border border-line px-4 py-2 text-sm transition-colors duration-300 hover:bg-fg hover:text-bg">{t}</span>)}
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-24 grid gap-16 md:grid-cols-2 md:gap-20">
          <div><p className="label mb-5">Experience</p><Rows items={experience} /></div>
          <div><p className="label mb-5">Education</p><Rows items={education} /></div>
        </div>
      </Section>

      <Section id="gallery" label="Gallery" title="Behind the scenes">
        <div className="grid grid-cols-2 gap-3 lg:h-[640px] lg:grid-cols-4 lg:grid-rows-2">
          {gallery.map(([src, cap], i) => (
            <Reveal key={cap} delay={i * 90} className={`h-full ${i === 0 ? 'col-span-2 lg:row-span-2' : ''}`}>
              <button onClick={() => setBox(i)} aria-label={`Open ${cap}`} className={`group relative block h-full w-full overflow-hidden rounded-md bg-surface ${i === 0 ? 'aspect-video lg:aspect-auto' : 'aspect-square lg:aspect-auto'}`}>
                <img src={src} alt={cap} loading="lazy" className="h-full w-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0" />
                <span className="absolute left-3 top-3 bg-black/70 px-2 py-1 font-mono text-[10px] tracking-widest text-white backdrop-blur">{pad(i + 1)}</span>
                <span className="absolute inset-x-0 bottom-0 translate-y-3 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10 text-left font-mono text-[11px] uppercase tracking-widest text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">{cap}</span>
              </button>
            </Reveal>
          ))}
        </div>
      </Section>

      <section id="contact" className="scroll-mt-16 border-t border-line py-24 sm:py-40">
        <div className={wrap}>
          <Reveal><p className="label">Contact · Available for freelance projects and collaborations</p></Reveal>
          <Reveal delay={100} as="a" href={`mailto:${EMAIL}?subject=Inquiry from Portfolio&body=Hello Mark,`} className="ul title mt-8 block break-all text-[9vw] sm:text-[6.5vw]">{EMAIL}</Reveal>
          <Reveal delay={200} className="mt-12 flex flex-wrap gap-4">
            <a href={cvFile} download="Mark_Quitaleg_CV.pdf" className="btn btn-solid"><Download size={14} /> Download CV</a>
            <Link to="/videos" className="btn">Watch all videos</Link>
          </Reveal>
        </div>
      </section>

      <footer className="border-t border-line py-8">
        <div className={`${wrap} flex flex-col gap-1 text-sm text-muted sm:flex-row sm:justify-between`}>
          <p>© {new Date().getFullYear()} Mark Quitaleg</p><p>Video Editor · Dasmariñas, PH</p>
        </div>
      </footer>
      <ChatBot darkMode={darkMode} />
    </div>
  );
};

/* Every route change starts at the top. */
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }, [pathname]);
  return null;
};

const Profile = () => (
  <ThemeProvider>
    <Router>
      <ScrollToTop />
      <Cursor />
      <Routes>
        <Route path="/" element={<ProfileContent />} />
        <Route path="/videos" element={<VideosPage />} />
        <Route path="*" element={<ProfileContent />} />
      </Routes>
    </Router>
  </ThemeProvider>
);

export default Profile;
