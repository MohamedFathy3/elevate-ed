// components/video/VideoError.tsx
import { AlertCircle } from 'lucide-react';

interface VideoErrorProps {
  lang: string;
  videoUrl?: string;
}

export const VideoError = ({ lang, videoUrl }: VideoErrorProps) => {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80">
      <div className="text-center text-white p-4">
        <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-500" />
        <p>{lang === "ar" ? "عذراً، لا يمكن تحميل الفيديو" : "Sorry, cannot load video"}</p>
        {videoUrl && (
          <a 
            href={videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-3 inline-block px-4 py-2 rounded-lg bg-primary text-white text-sm"
          >
            {lang === "ar" ? "فتح على يوتيوب" : "Open on YouTube"}
          </a>
        )}
      </div>
    </div>
  );
};