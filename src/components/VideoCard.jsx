import { Play } from 'lucide-react';

const VideoCard = ({ project, onPlay, tall = false, index }) => (
  <button onClick={() => onPlay(project)} disabled={!project.video} data-cursor="play" className="group block w-full text-left">
    <div className={`relative overflow-hidden rounded-md bg-surface ${tall ? 'aspect-[9/16]' : 'aspect-video'}`}>
      <img src={project.image} alt={project.title} loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]" />
      <span className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/30" />
      <span className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/70 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-white backdrop-blur transition-transform duration-500 group-hover:-translate-y-1">
        <Play size={11} fill="currentColor" /> {tall ? 'Short' : 'Watch'}
      </span>
    </div>
    <div className="mt-4 flex items-baseline justify-between gap-4">
      <h3 className="line-clamp-1 text-base font-medium">{project.title}</h3>
      {index != null && <span className="shrink-0 font-mono text-xs text-muted">{String(index + 1).padStart(2, '0')}</span>}
    </div>
    <p className="mt-1 line-clamp-1 font-mono text-xs text-muted">{project.technologies.join(' / ')}</p>
  </button>
);

export default VideoCard;
