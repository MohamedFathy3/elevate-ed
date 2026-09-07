const MEDIA_ORIGIN = "https://api.web-lec.com";

export type MediaCandidate =
  | string
  | null
  | undefined
  | { fullUrl?: string | null; previewUrl?: string | null; url?: string | null; path?: string | null };

/** Resolve backend media values into a browser-loadable URL. */
export function resolveMediaUrl(...candidates: MediaCandidate[]): string | null {
  for (const candidate of candidates) {
    const value = typeof candidate === "string"
      ? candidate.trim()
      : candidate?.fullUrl || candidate?.url || candidate?.previewUrl || candidate?.path || "";

    if (!value) continue;

    const normalized = value.trim();
    if (/^https?:\/\//i.test(normalized)) return normalized;
    if (normalized.startsWith("//")) return `https:${normalized}`;
    if (normalized.startsWith("/")) return `${MEDIA_ORIGIN}${normalized.replace(/^\/storage\/\/storage\//, "/storage/")}`;
    if (normalized.startsWith("storage/") || normalized.startsWith("uploads/")) {
      return `${MEDIA_ORIGIN}/${normalized}`;
    }
  }

  return null;
}

export const PLACEHOLDER_MEDIA = "/placeholder.svg";

export function imageSrc(...candidates: MediaCandidate[]): string {
  return resolveMediaUrl(...candidates) || PLACEHOLDER_MEDIA;
}
