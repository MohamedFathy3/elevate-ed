/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/lesson/video/VideoPlayer.types.ts

export interface Quality {
  label: string;
  value: string;
  height: number;
}

export interface Part {
  title: string;
  title_ar?: string;
  videoUrl?: string;
  imageUrl?: string;
}

export interface VideoPlayerProps {
  videoUrl?: string;
  title?: string;
  poster?: string;
  isLocked?: boolean;
  requiredExam?: any;
  onStartExam?: () => void;
  parts?: Part[];
  onPartChange?: (index: number) => void;
  selectedPartIndex?: number;
}

export interface VideoPlayerRef {
  pause: () => void;
  play: () => void;
  seekTo: (time: number) => void;
  toggleFullscreen: () => void;
}

export interface QualityControlProps {
  currentQuality: string;
  onQualityChange: (q: string) => void;
  availableQualities: Quality[];
  lang: string;
}

export interface SpeedControlProps {
  speed: number;
  onSpeedChange: (s: number) => void;
  onClose: () => void;
  lang: string;
}

export interface ControlsProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  isFullscreen: boolean;
  lang: string;
  onTogglePlay: () => void;
  onSeekForward: () => void;
  onSeekBackward: () => void;
  onToggleFullscreen: () => void;
  onChangeSpeed: (speed: number) => void;
  onChangeQuality: (quality: string) => void;
  currentQuality: string;
  availableQualities: Quality[];
  isMobile: boolean;
  showSpeedMenu: boolean;
  setShowSpeedMenu: (show: boolean) => void;
  onProgressDrag: (value: number) => void;
  onProgressSeek: (value: number) => void;
}

export interface ProgressBarProps {
  currentTime: number;
  duration: number;
  isDragging: boolean;
  onDragStart: () => void;
  onDragMove: (value: number) => void;
  onDragEnd: (value: number) => void;
  onSeek: (value: number) => void;
}

export interface VideoErrorProps {
  lang: string;
  onRetry: () => void;
}