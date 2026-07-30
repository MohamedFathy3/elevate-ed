// src/components/OptimizedImage.tsx

import { BookOpen } from "lucide-react";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onClick?: () => void;
}

export const OptimizedImage = ({
  src,
  alt,
  className = '',
  width = 400,
  height = 300,
  priority = false,
  onClick,
}: OptimizedImageProps) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (!src || error) {
    return (
      <div 
        className={`${className} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
        style={{ aspectRatio: `${width}/${height}` }}
      >
        <BookOpen className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  // ✅ تحسين الـ URL
  const optimizedSrc = src.includes('?') 
    ? `${src}&w=${width}&q=75` 
    : `${src}?w=${width}&q=75`;

  return (
    <div className="relative w-full h-full overflow-hidden" onClick={onClick}>
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse" />
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        width={width}
        height={height}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        style={{ aspectRatio: `${width}/${height}` }}
      />
    </div>
  );
};