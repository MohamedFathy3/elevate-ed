import React from "react";
import { renderToString } from "react-dom/server";
import { HelmetProvider } from "react-helmet-async";
import App from "./App";
import type { SsrPayload } from "./ssr";

export function render(url: string, payload: SsrPayload) {
  globalThis.__SSR_DATA__ = payload;
  const helmetContext: { helmet?: Record<string, { toString(): string }> } = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <App ssrLocation={url} />
    </HelmetProvider>,
  );
  return { html, helmet: helmetContext.helmet };
}
