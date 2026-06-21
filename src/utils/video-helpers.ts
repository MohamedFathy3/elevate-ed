// features/lesson/utils/video-helpers.ts

export const getYouTubeEmbedUrl = (url: string): string | null => {
  if (!url) return null;
  
  // YouTube Watch URL
  if (url.includes('youtube.com/watch?v=')) {
    const videoId = url.split('v=')[1]?.split('&')[0];
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
  }
  
  // YouTube Shorts
  if (url.includes('youtube.com/shorts/')) {
    const videoId = url.split('shorts/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
  }
  
  // youtu.be
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1]?.split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0`;
  }
  
  // Already embed
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Vimeo
  if (url.includes('vimeo.com/')) {
    const videoId = url.split('vimeo.com/')[1]?.split('/')[0];
    return `https://player.vimeo.com/video/${videoId}`;
  }
  
  return null;
};

export const isYouTubeVideo = (url: string): boolean => {
  if (!url) return false;
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
};

export const isPDF = (url: string): boolean => {
  if (!url) return false;
  return url.endsWith('.pdf') || url.includes('.pdf?');
};

export const isExternalLink = (url: string): boolean => {
  if (!url) return false;
  return !isYouTubeVideo(url) && !isPDF(url);
};