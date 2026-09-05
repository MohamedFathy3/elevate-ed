// src/main.tsx
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";

const FALLBACK_IMAGE = "/placeholder.svg";

if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    const target = event.target;
    if (target instanceof HTMLImageElement && target.src && !target.dataset.fallbackApplied) {
      target.dataset.fallbackApplied = "true";
      target.src = FALLBACK_IMAGE;
    }
  }, true);
}

const root = document.getElementById("root")!;
const app = <HelmetProvider><App /></HelmetProvider>;
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}