// src/utils/deviceFingerprint.ts
import FingerprintJS from '@fingerprintjs/fingerprintjs';

let cachedFingerprint: string | null = null;

/**
 * جلب بصمة الجهاز
 */
export const getDeviceFingerprint = async (): Promise<string | null> => {
  if (cachedFingerprint) {
    return cachedFingerprint;
  }

  try {
    const fp = await FingerprintJS.load({ monitoring: false });
    const result = await fp.get();
    cachedFingerprint = result.visitorId;
    return cachedFingerprint;
  } catch (error) {
    console.error('❌ خطأ في جلب البصمة:', error);
    return null;
  }
};

/**
 * جلب IP الجهاز (عن طريق خدمة خارجية)
 */
export const getDeviceIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('❌ خطأ في جلب IP:', error);
    return '0.0.0.0';
  }
};

/**
 * جلب جميع بيانات الجهاز (جاهزة للإرسال)
 */
export const getDeviceData = async (): Promise<{
  device_id: string;
  fingerprint: string;
  last_ip: string;
  user_agent: string;
}> => {
  // جلب البصمة
  const fingerprint = await getDeviceFingerprint() || 'unknown';
  
  // جلب IP
  const ip = await getDeviceIP();
  
  // توليد device_id من البصمة + IP
  const deviceId = await generateDeviceId(fingerprint, ip);
  
  return {
    device_id: deviceId,
    fingerprint: fingerprint,
    last_ip: ip,
    user_agent: navigator.userAgent,
  };
};

/**
 * توليد device_id مشفر
 */
const generateDeviceId = async (fingerprint: string, ip: string): Promise<string> => {
  // استخدم SubtleCrypto للتشفير (أو بسيطة)
  const data = `${fingerprint}-${ip}-${navigator.userAgent}`;
  
  // طريقة بسيطة (SHA-256)
  try {
    const encoder = new TextEncoder();
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(data));
    const hashArray = Array.from(new Uint8Array(hash));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // لو مش مدعوم، استخدم طريقة بسيطة
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(32, '0');
  }
};