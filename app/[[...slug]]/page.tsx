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

export async function generateMetadata(): Promise<Metadata> {
  const { host, protocol, payload } = await requestContext();
  const seo = payload.teacher?.website?.seo;
  if (!seo) return {};

  const title = seo.seo_title || seo.site_title || seo.site_name || undefined;
  const description = seo.seo_description || seo.site_description || undefined;
  const canonical = seo.canonical_url || seo.og_url || seo.site_url || `${protocol}://${host}`;
  const image = seo.og_image || undefined;

  return {
    title,
    description,
    keywords: seo.seo_keywords || seo.site_keywords || undefined,
    alternates: { canonical },
    verification: seo.google_site_verification ? { google: seo.google_site_verification } : undefined,
    openGraph: {
      type: (seo.og_type as "website" | "article") || "website",
      title: seo.og_title || title,
      description: seo.og_description || description,
      url: seo.og_url || canonical,
      siteName: seo.og_site_name || seo.site_name || undefined,
      images: image ? [{ url: image, width: seo.og_image_width ? Number(seo.og_image_width) : undefined, height: seo.og_image_height ? Number(seo.og_image_height) : undefined }] : undefined,
      locale: seo.language || seo.default_language || "ar",
    },
    twitter: {
      card: (seo.twitter_card as "summary" | "summary_large_image") || "summary_large_image",
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
