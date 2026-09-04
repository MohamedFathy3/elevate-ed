// src/main.tsx
import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App.tsx";

const root = document.getElementById("root")!;
const app = <HelmetProvider><App /></HelmetProvider>;
if (root.hasChildNodes()) {
  hydrateRoot(root, app);
} else {
  createRoot(root).render(app);
}