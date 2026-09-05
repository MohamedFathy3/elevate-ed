import type { Metadata } from "next";
import { headers } from "next/headers";
import LegacyAppClient from "../LegacyAppClient";
import { fetchTeacherPayload } from "@/server/teacher";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type PageProps = { params: Promise<{ slug?: string[] }> };

async function requestContext() {
  const requestHeaders = await headers();
  const host = (requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost").split(":")[0];
  const protocol = requestHeaders.get("x-forwarded-proto") || "https";
  const cookie = requestHeaders.get("cookie") || undefined;
  const payload = await fetchTeacherPayload(host, cookie);
  return { host, protocol, payload };
}

const VALID_OG_TYPES = new Set(["website", "article", "book", "profile", "music.song", "music.album", "music.playlist", "music.radio_station", "video.movie", "video.episode", "video.tv_show", "video.other"]);
const VALID_TWITTER_CARDS = new Set(["summary", "summary_large_image", "app", "player"]);

function normalizeSeoType(value: unknown, allowed: Set<string>, fallback: string) {
  const normalized = String(value || "").trim().toLowerCase();
  return allowed.has(normalized) ? normalized : fallback;
}

function normalizeGoogleVerification(value: unknown) {
  const raw = String(value || "").trim();
  if (!raw) return undefined;
  const contentMatch = raw.match(/content\s*=\s*["']([^"']+)["']/i);
  if (contentMatch?.[1]) return contentMatch[1].trim();
  return raw.replace(/^['"]|['"]$/g, "").trim() || undefined;
}

export async function generateMetadata(): Promise<Metadata> {
  const { host, protocol, payload } = await requestContext();
  const teacherWebsite = payload.teacher?.website as any;
  const seo = teacherWebsite?.seo || teacherWebsite?.seo_setting || teacherWebsite?.about?.seo_setting;
  if (!seo) return {};

  const title = seo.seo_title || seo.site_title || seo.site_name || undefined;
  const description = seo.seo_description || seo.site_description || undefined;
  const canonical = seo.canonical_url || seo.og_url || seo.site_url || `${protocol}://${host}`;
  const image = seo.og_image || undefined;
  const googleVerification = normalizeGoogleVerification(seo.google_site_verification);

  return {
    title,
    description,
    keywords: seo.seo_keywords || seo.site_keywords || undefined,
    alternates: { canonical },
    verification: googleVerification ? { google: googleVerification } : undefined,
    openGraph: {
      type: normalizeSeoType(seo.og_type, VALID_OG_TYPES, "website") as "website" | "article",
      title: seo.og_title || title,
      description: seo.og_description || description,
      url: seo.og_url || canonical,
      siteName: seo.og_site_name || seo.site_name || undefined,
      images: image ? [{ url: image, width: seo.og_image_width ? Number(seo.og_image_width) : undefined, height: seo.og_image_height ? Number(seo.og_image_height) : undefined }] : undefined,
      locale: seo.language || seo.default_language || "ar",
    },
    twitter: {
      card: normalizeSeoType(seo.twitter_card, VALID_TWITTER_CARDS, "summary_large_image") as "summary" | "summary_large_image",
      title: seo.og_title || title,
      description: seo.og_description || description,
      images: image ? [image] : undefined,
      site: seo.twitter_username ? `@${seo.twitter_username}` : undefined,
    },
    icons: {
      icon: seo.favicon_svg || seo.favicon_32 || seo.favicon_16 || undefined,
      apple: seo.favicon_apple || undefined,
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { payload } = await requestContext();
  const resolved = await params;
  const pathname = `/${(resolved.slug || []).join("/")}` || "/";
  return <LegacyAppClient payload={payload} pathname={pathname === "" ? "/" : pathname} />;
}
