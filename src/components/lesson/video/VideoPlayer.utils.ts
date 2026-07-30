// src/components/lesson/video/VideoPlayer.utils.ts

import { Quality } from './VideoPlayer.types';

// ✅ استخراج Video ID
export const extractVideoId = (url: string): string | null => {
  if (!url) return null;
  
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /[?&]v=([a-zA-Z0-9_-]{11})/,
    /embed\/([a-zA-Z0-9_-]{11})/,
    /shorts\/([a-zA-Z0-9_-]{11})/,
    /v=([a-zA-Z0-9_-]{11})/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
};

// ✅ تنسيق الوقت
export const formatTime = (seconds: number): string => {
  if (!seconds || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

// ✅ بناء رابط YouTube
export const buildYouTubeEmbedUrl = (videoId: string): string => {
  return `https://www.youtube-nocookie.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1&showinfo=0&controls=0&autohide=2&fs=0&iv_load_policy=3&playsinline=1&cc_load_policy=0&disablekb=1&origin=${window.location.origin}`;
};

// ✅ إعدادات الجودة الافتراضية
export const DEFAULT_QUALITIES: Quality[] = [
  { label: '1080p', value: '1080', height: 1080 },
  { label: '720p', value: '720', height: 720 },
  { label: '480p', value: '480', height: 480 },
  { label: '360p', value: '360', height: 360 },
  { label: '240p', value: '240', height: 240 },
  { label: '144p', value: '144', height: 144 },
];

// ✅ سرعات التشغيل
export const PLAYBACK_SPEEDS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

// ✅ منع الأحداث غير المرغوب فيها
export const UNWANTED_SELECTORS = [
  '[id*="idm" i]', '[class*="idm" i]', '[id*="IDM"]', '[class*="IDM"]',
  '[data-idm]', '[data-IDM]',
  '[id*="internet-download-manager" i]', '[class*="internet-download-manager" i]',
  '[id*="download" i]', '[class*="download" i]',
  '[data-video-downloader]', '[data-video-saver]', '[data-download-helper]',
  '.video-downloader', '.video-saver', '.download-helper',
  '[id*="video-download" i]', '[class*="video-download" i]',
  '[data-video-grabber]', '.video-grabber',
  '[id*="vid-download" i]', '[class*="vid-download" i]',
  '[id*="screen-recorder" i]', '[class*="screen-recorder" i]',
  '[id*="recorder" i]', '[class*="recorder" i]',
  '[id*="chrome-extension"]', '[class*="chrome-extension"]',
  '[src*="chrome-extension"]', '[href*="chrome-extension"]',
];