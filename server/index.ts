import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createServer as createViteServer, loadEnv } from "vite";
import type { SsrPayload } from "../src/ssr";

type RenderedPage = { html: string; styles?: string; helmet?: Record<string, { toString(): string }> };
type RenderModule = { render: (url: string, payload: SsrPayload) => Promise<RenderedPage> };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const getApiBase = () => (process.env.VITE_SSR_API_BASE || process.env.VITE_API_TARGET || "https://api.web-lec.com").replace(/\/$/, "");
const defaultPayload = (host: string): SsrPayload => ({ host, teacher: null, theme: "default", bgColor: "#FFFFFF", textColor: "#111827" });

async function fetchPayload(host: string, cookie?: string): Promise<SsrPayload> {
  const payload = defaultPayload(host);
  try {
    const response = await fetch(`${getApiBase()}/api/${encodeURIComponent(host)}`, {
      headers: { Accept: "application/json", "X-Requested-With": "XMLHttpRequest", ...(cookie ? { cookie } : {}) },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return payload;
    const body = await response.json() as { status?: number; result?: string; data?: SsrPayload["teacher"] };
    payload.teacher = (body.status === 200 || body.result === "Success") ? body.data || null : null;
    if (payload.teacher?.id) {
      const themeResponse = await fetch(`${getApiBase()}/api/teachers/theme`, {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json", "X-Requested-With": "XMLHttpRequest", ...(cookie ? { cookie } : {}) },
        body: JSON.stringify({ teacher_id: payload.teacher.id }),
        signal: AbortSignal.timeout(5000),
      });
      const themeBody = await themeResponse.json() as { status?: boolean; active_theme?: string; active_backgroud_color?: string; active_font_color?: string };
      if (themeBody.status === true) {
        payload.theme = themeBody.active_theme === "theme2" ? "nature" : "default";
        payload.bgColor = themeBody.active_backgroud_color && themeBody.active_backgroud_color !== "null" ? themeBody.active_backgroud_color : payload.bgColor;
        payload.textColor = themeBody.active_font_color && themeBody.active_font_color !== "null" ? themeBody.active_font_color : payload.textColor;
      }
    }
  } catch (error) {
    console.error("SSR data fetch failed:", error instanceof Error ? error.message : error);
  }
  return payload;
}

function serializePayload(payload: SsrPayload) {
  return JSON.stringify(payload).replace(/</g, "\\u003c").replace(/>/g, "\\u003e").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

async function createApp() {
  const app = express();
  const isProduction = process.env.NODE_ENV === "production";
  const env = loadEnv(isProduction ? "production" : "development", root, "");
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value;
  }
  let vite: Awaited<ReturnType<typeof createViteServer>> | undefined;
  let template: string;
  let render: RenderModule["render"];

  if (!isProduction) {
    vite = await createViteServer({ root, server: { middlewareMode: true }, appType: "custom" });
    app.use(vite.middlewares);
  } else {
    template = await fs.readFile(path.join(root, "dist/client/index.html"), "utf8");
    const renderModule = await import(pathToFileURL(path.join(root, "dist/server/entry-server.js")).href) as RenderModule;
    render = renderModule.render;
    app.use(express.static(path.join(root, "dist/client"), { index: false, maxAge: "1y" }));
  }

  app.use("*", async (req, res, next) => {
    try {
      const host = (req.headers.host || "localhost").split(":")[0];
      const url = req.originalUrl;
      const payload = await fetchPayload(host, req.headers.cookie);
      let htmlTemplate = template!;
      let renderer = render!;
      if (!isProduction) {
        htmlTemplate = await fs.readFile(path.join(root, "index.html"), "utf8");
        htmlTemplate = await vite!.transformIndexHtml(url, htmlTemplate);
        const renderModule = await vite!.ssrLoadModule("/src/entry-server.tsx") as RenderModule;
        renderer = renderModule.render;
      }
      const rendered = await renderer(url, payload);
      const helmet = rendered.helmet || {};
      const head = Object.values(helmet).map((item) => item.toString()).join("\n");
      const html = htmlTemplate
        .replace("<div id=\"root\"></div>", `<div id="root">${rendered.html}</div>`)
        .replace("</head>", `${rendered.styles || ""}${head}<script>window.__SSR_DATA__=${serializePayload(payload)}</script></head>`);
      res.status(200).set({ "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-cache" }).end(html);
    } catch (error) {
      console.error("SSR render failed:", error instanceof Error ? error.stack : error);
      if (vite) vite.ssrFixStacktrace(error as Error);
      next(error);
    }
  });
  return app;
}

const port = Number(process.env.PORT || process.env.VITE_PREVIEW_SERVER_PORT || 3000);
createApp().then((app) => app.listen(port, "0.0.0.0", () => console.log(`SSR server listening on http://0.0.0.0:${port}`))).catch((error) => { console.error(error); process.exit(1); });
