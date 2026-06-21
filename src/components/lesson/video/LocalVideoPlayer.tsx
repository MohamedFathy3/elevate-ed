// components/video/LocalVideoPlayer.tsx
import { RefObject } from 'react';

interface LocalVideoPlayerProps {
  videoUrl: string;
  poster?: string;
  onError: () => void;
  videoRef: RefObject<HTMLVideoElement>;
}

export const LocalVideoPlayer = ({ videoUrl, poster, onError, videoRef }: LocalVideoPlayerProps) => {
  return (
    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-card">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full"
        controls
        controlsList="nodownload noplaybackrate"
        onContextMenu={(e) => e.preventDefault()}
        poster={poster}
        playsInline
        onError={onError}
      >
        <source src={videoUrl} type="video/mp4" />
        متصفحك لا يدعم تشغيل الفيديو
      </video>
    </div>
  );
};