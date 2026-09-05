import type { SsrPayload } from "@/ssr";
import type { TeacherWebsiteData } from "@/context/TeacherContext";

const apiBase = (process.env.VITE_SSR_API_BASE || process.env.VITE_API_TARGET || "https://api.web-lec.com").replace(/\/$/, "");

const fallbackPayload = (host: string): SsrPayload => ({
  host,
  teacher: null,
  theme: "default",
  bgColor: "#FFFFFF",
  textColor: "#111827",
});

export async function fetchTeacherPayload(host: string, cookie?: string): Promise<SsrPayload> {
  const payload = fallbackPayload(host);
  if (!host || host === "localhost" || host.startsWith("127.")) return payload;

  try {
    const response = await fetch(`${apiBase}/api/${encodeURIComponent(host)}`, {
      headers: { Accept: "application/json", ...(cookie ? { Cookie: cookie } : {}) },
      cache: "no-store",
    });
    const body = await response.json() as { status?: number; result?: string; data?: TeacherWebsiteData };
    if (body.status === 200 || body.result === "Success") payload.teacher = body.data || null;

    if (payload.teacher?.id) {
      const themeResponse = await fetch(`${apiBase}/api/teachers/theme`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ teacher_id: payload.teacher.id }),
        cache: "no-store",
      });
      const theme = await themeResponse.json() as { status?: boolean; active_theme?: string; active_backgroud_color?: string; active_font_color?: string };
      if (theme.status === true) {
        payload.theme = theme.active_theme === "theme2" ? "nature" : "default";
        payload.bgColor = theme.active_backgroud_color && theme.active_backgroud_color !== "null" ? theme.active_backgroud_color : payload.bgColor;
        payload.textColor = theme.active_font_color && theme.active_font_color !== "null" ? theme.active_font_color : payload.textColor;
      }
    }
  } catch (error) {
    console.error("Next SSR data fetch failed:", error instanceof Error ? error.message : error);
  }
  return payload;
}
