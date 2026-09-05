"use client";

import App from "@/App";
import type { SsrPayload } from "@/ssr";

export default function LegacyAppClient({ payload, pathname }: { payload: SsrPayload; pathname: string }) {
  return <App initialPayload={payload} ssrLocation={pathname} />;
}
