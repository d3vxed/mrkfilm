import { useEffect } from 'react';
import { X } from 'lucide-react';
import YouTube from 'react-youtube';

const getVideoId = (url) => {
  const m = url?.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([^&\n?#]+)/);
  return m ? m[1] : null;
};

const VideoModal = ({ project, onClose }) => {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  const id = getVideoId(project.video);
  const portrait = project.category === 'portrait';
  const opts = { height: '100%', width: '100%', playerVars: { autoplay: 1, rel: 0, modestbranding: 1 } };

  return (
    <div data-nocursor onClick={onClose} className="fixed inset-0 z-50 grid place-items-center bg-black/90 p-4 backdrop-blur-sm">
      <div onClick={(e) => e.stopPropagation()} className="flex max-h-full w-full flex-col items-center gap-3">
        <div className="flex w-full max-w-4xl items-center justify-between gap-4 text-white">
          <p className="truncate text-sm font-medium">{project.title}</p>
          <button onClick={onClose} aria-label="Close video" className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/25 px-3 py-1.5 text-xs hover:bg-white/10">
            <X size={14} /> Close
          </button>
        </div>
        <div
          className={`overflow-hidden rounded-md bg-black ${portrait ? '' : 'w-full max-w-4xl aspect-video'}`}
          style={portrait ? { height: 'min(78vh, 680px)', aspectRatio: '9 / 16', maxWidth: '100%' } : undefined}
        >
          {id ? <YouTube videoId={id} opts={opts} className="h-full w-full" iframeClassName="h-full w-full" />
              : <p className="grid h-full place-items-center text-sm text-white/60">No valid source</p>}
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
