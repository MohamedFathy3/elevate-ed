// src/components/lesson/video/components/ProgressBar.tsx

import { useRef } from 'react';
import { ProgressBarProps } from '../VideoPlayer.types';
import { formatTime } from '../VideoPlayer.utils';

export const ProgressBar = ({ 
  currentTime, 
  duration, 
  isDragging,
  onDragStart,
  onDragMove,
  onDragEnd,
  onSeek 
}: ProgressBarProps) => {
  const progressRef = useRef<HTMLDivElement>(null);
  const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleMouseDown = (e: React.MouseEvent) => {
    onDragStart();
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onDragMove(x * duration);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    onDragStart();
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    onDragMove(x * duration);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onDragEnd(x * duration);
  };

  const handleTouchEnd = () => {
    onDragEnd(currentTime);
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(x * duration);
  };

  return (
    <div 
      ref={progressRef}
      className="relative w-full h-3 sm:h-2.5 bg-white/20 rounded-full cursor-pointer mb-2 sm:mb-3 group/progress progress-bar touch-manipulation"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      onMouseLeave={() => onDragEnd(currentTime)}
    >
      <div 
        className="h-full bg-blue-500 rounded-full transition-all"
        style={{ width: `${percentage}%` }}
      />
      <div 
        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full opacity-0 group-hover/progress:opacity-100 transition-all shadow-lg shadow-blue-500/50"
        style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)' }}
      />
    </div>
  );
};