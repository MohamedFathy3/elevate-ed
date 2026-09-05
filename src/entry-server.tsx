import React from "react";
import { renderToPipeableStream } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import { PassThrough } from "node:stream";
import App from "./App";
import { getThemeCss } from "./context/ThemeContext";
import type { SsrPayload } from "./ssr";

function escapeStyle(value: string): string {
  return value.replace(/<\/style/gi, "<\\/style");
}

function apiColorCss(payload: SsrPayload): string {
  const background = payload.bgColor || "#ffffff";
  const text = payload.textColor || "#111827";
  return `:root{--api-bg:${background};--api-text:${text}}body{background-color:${background};color:${text}}[data-api-colors=\"true\"]{background-color:${background};color:${text}}.bg-background,[class*=\"bg-background\"]{background-color:${background}!important}.text-foreground,[class*=\"text-foreground\"]{color:${text}!important}`;
}

function renderReact(element: React.ReactElement): Promise<{ html: string; helmet?: Record<string, { toString(): string }> }> {
  return new Promise((resolve, reject) => {
    const stream = new PassThrough();
    let html = "";
    stream.on("data", (chunk) => { html += chunk.toString(); });
    stream.on("end", () => resolve({ html }));
    stream.on("error", reject);
    const helmetContext: { helmet?: Record<string, { toString(): string }> } = {};
    const result = renderToPipeableStream(element, {
      onAllReady() {
        result.pipe(stream);
      },
      onShellError: reject,
      onError(error) {
        console.error("SSR stream error:", error);
      },
    });
  });
}

export async function render(url: string, payload: SsrPayload) {
  globalThis.__SSR_DATA__ = payload;
  const helmetContext: { helmet?: Record<string, { toString(): string }> } = {};
  const result = await renderReact(
    <HelmetProvider context={helmetContext}>
      <App ssrLocation={url} />
    </HelmetProvider>,
  );
  return {
    html: result.html,
    helmet: helmetContext.helmet,
    styles: `<style id="ssr-theme-styles">${escapeStyle(getThemeCss(payload.theme))}</style><style id="ssr-api-colors">${escapeStyle(apiColorCss(payload))}</style>`,
  };
}
