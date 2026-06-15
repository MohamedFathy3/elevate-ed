// hooks/useWatermark.tsx
import { useEffect } from 'react';

export const useWatermark = (text: string, enabled: boolean = true) => {
  useEffect(() => {
    if (!enabled || !text) return;

    // علامة مائية في الأسفل
    const watermarkDiv = document.createElement('div');
    watermarkDiv.id = 'custom-watermark-bottom';
    watermarkDiv.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 9999;
      font-size: 12px;
      color: rgba(0,0,0,0.4);
      background: rgba(255,255,255,0.6);
      padding: 6px 12px;
      border-radius: 8px;
      pointer-events: none;
      font-family: monospace;
      backdrop-filter: blur(4px);
      font-weight: 500;
    `;
    watermarkDiv.textContent = text;
    document.body.appendChild(watermarkDiv);

    // علامة مائية في المنتصف (شفافة)
    const centerWatermark = document.createElement('div');
    centerWatermark.id = 'custom-watermark-center';
    centerWatermark.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-25deg);
      z-index: 9998;
      font-size: 48px;
      color: rgba(0,0,0,0.06);
      white-space: nowrap;
      pointer-events: none;
      font-family: monospace;
      letter-spacing: 4px;
      font-weight: bold;
    `;
    centerWatermark.textContent = text;
    document.body.appendChild(centerWatermark);

    return () => {
      const bottomEl = document.getElementById('custom-watermark-bottom');
      const centerEl = document.getElementById('custom-watermark-center');
      if (bottomEl) bottomEl.remove();
      if (centerEl) centerEl.remove();
    };
  }, [text, enabled]);
};