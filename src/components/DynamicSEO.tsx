import { Helmet } from "react-helmet-async";
import type { SeoSettings } from "@/types/seo";

type Props = { seo?: SeoSettings | null; url?: string };

export function DynamicSEO({ seo, url }: Props) {
  if (!seo) return null;
  const title = seo.seo_title || seo.site_title || seo.site_name || "منصة تعليمية";
  const description = seo.seo_description || seo.site_description || "منصة تعليمية أونلاين";
  const image = seo.og_image || "";
  const canonical = seo.canonical_url || seo.og_url || seo.site_url || url || "";
  const language = seo.language || seo.default_language || "ar";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: seo.site_name || title,
    description,
    url: canonical,
    ...(image ? { image, logo: image } : {}),
  };
  return (
    <Helmet>
      <html lang={language} />
      <title>{title}</title>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      <meta name="description" content={description} />
      {seo.seo_keywords || seo.site_keywords ? <meta name="keywords" content={seo.seo_keywords || seo.site_keywords || ""} /> : null}
      {seo.google_site_verification ? <meta name="google-site-verification" content={seo.google_site_verification} /> : null}
      <link rel="canonical" href={canonical} />
      <meta property="og:type" content={seo.og_type || "website"} />
      <meta property="og:title" content={seo.og_title || title} />
      <meta property="og:description" content={seo.og_description || description} />
      {image ? <meta property="og:image" content={image} /> : null}
      {seo.og_image_width ? <meta property="og:image:width" content={seo.og_image_width} /> : null}
      {seo.og_image_height ? <meta property="og:image:height" content={seo.og_image_height} /> : null}
      <meta property="og:url" content={seo.og_url || canonical} />
      <meta property="og:site_name" content={seo.og_site_name || seo.site_name || ""} />
      <meta name="twitter:card" content={seo.twitter_card || "summary_large_image"} />
      <meta name="twitter:title" content={seo.og_title || title} />
      <meta name="twitter:description" content={seo.og_description || description} />
      {image ? <meta name="twitter:image" content={image} /> : null}
      {seo.twitter_username ? <meta name="twitter:site" content={`@${seo.twitter_username}`} /> : null}
      {seo.facebook_app_id ? <meta property="fb:app_id" content={seo.facebook_app_id} /> : null}
      {seo.favicon_svg ? <link rel="icon" type="image/svg+xml" href={seo.favicon_svg} /> : null}
      {seo.favicon_32 ? <link rel="icon" sizes="32x32" type="image/png" href={seo.favicon_32} /> : null}
      {seo.favicon_16 ? <link rel="icon" sizes="16x16" type="image/png" href={seo.favicon_16} /> : null}
      {seo.favicon_apple ? <link rel="apple-touch-icon" href={seo.favicon_apple} /> : null}
      {seo.geo_region ? <meta name="geo.region" content={seo.geo_region} /> : null}
      {seo.geo_placename ? <meta name="geo.placename" content={seo.geo_placename} /> : null}
      {seo.geo_position ? <meta name="geo.position" content={seo.geo_position} /> : null}
      {seo.geo_icbm ? <meta name="ICBM" content={seo.geo_icbm} /> : null}
    </Helmet>
  );
}
