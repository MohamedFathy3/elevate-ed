import type { TeacherWebsiteData } from "@/context/TeacherContext";
import type { ThemeName } from "@/context/ThemeContext";

export interface SsrPayload {
  host: string;
  teacher: TeacherWebsiteData | null;
  theme: ThemeName;
  bgColor: string;
  textColor: string;
}

declare global {
  interface Window {
    __SSR_DATA__?: SsrPayload;
  }
  // eslint-disable-next-line no-var
  var __SSR_DATA__: SsrPayload | undefined;
}

export function getSsrPayload(): SsrPayload | undefined {
  if (typeof window !== "undefined") return window.__SSR_DATA__;
  return globalThis.__SSR_DATA__;
}

export {};
