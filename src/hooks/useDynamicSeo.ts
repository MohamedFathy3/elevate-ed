// src/hooks/useDynamicSeo.ts
import { useEffect } from "react";
import type { SeoSettings } from "@/types/seo";

function setMeta(attr: "name" | "property", key: string, value?: string | null) {
    if (!value) return;
    let tag = document.querySelector(`meta[${attr}="${key}"]`);
    if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
    }
    tag.setAttribute("content", value);
}

function setLink(rel: string, href?: string | null, extra?: Record<string, string>) {
    if (!href) return;
    const sizeSelector = extra?.sizes ? `[sizes="${extra.sizes}"]` : "";
    const selector = `link[rel="${rel}"]${sizeSelector}`;
    let tag = document.querySelector(selector);
    if (!tag) {
        tag = document.createElement("link");
        tag.setAttribute("rel", rel);
        if (extra) Object.entries(extra).forEach(([k, v]) => tag!.setAttribute(k, v));
        document.head.appendChild(tag);
    }
    tag.setAttribute("href", href);
}

export function useDynamicSeo(seo?: SeoSettings | null) {
    useEffect(() => {
        if (!seo) return;

        document.title = seo.seo_title || seo.site_title || seo.site_name || document.title;
        document.documentElement.lang = seo.language || seo.default_language || "en";

        setMeta("name", "description", seo.seo_description || seo.site_description);
        setMeta("name", "keywords", seo.seo_keywords || seo.site_keywords);
        setMeta("name", "author", seo.site_name);

        if (seo.canonical_url) {
            let link = document.querySelector('link[rel="canonical"]');
            if (!link) {
                link = document.createElement("link");
                link.setAttribute("rel", "canonical");
                document.head.appendChild(link);
            }
            link.setAttribute("href", seo.canonical_url);
        }

        setMeta("property", "og:type", seo.og_type || "website");
        setMeta("property", "og:title", seo.og_title || seo.seo_title);
        setMeta("property", "og:description", seo.og_description || seo.seo_description);
        setMeta("property", "og:image", seo.og_image);
        setMeta("property", "og:image:width", seo.og_image_width);
        setMeta("property", "og:image:height", seo.og_image_height);
        setMeta("property", "og:url", seo.og_url || seo.site_url);
        setMeta("property", "og:site_name", seo.og_site_name || seo.site_name);

        setMeta("name", "twitter:card", seo.twitter_card || "summary_large_image");
        setMeta("name", "twitter:title", seo.og_title || seo.seo_title);
        setMeta("name", "twitter:description", seo.og_description || seo.seo_description);
        setMeta("name", "twitter:image", seo.og_image);
        if (seo.twitter_username) setMeta("name", "twitter:site", `@${seo.twitter_username}`);
        if (seo.facebook_app_id) setMeta("property", "fb:app_id", seo.facebook_app_id);

        setMeta("name", "geo.region", seo.geo_region);
        setMeta("name", "geo.placename", seo.geo_placename);
        setMeta("name", "geo.position", seo.geo_position);
        setMeta("name", "ICBM", seo.geo_icbm);

        setLink("icon", seo.favicon_32, { sizes: "32x32", type: "image/png" });
        setLink("icon", seo.favicon_16, { sizes: "16x16", type: "image/png" });
        setLink("apple-touch-icon", seo.favicon_apple);
        setLink("manifest", seo.manifest_json);
        if (seo.favicon_svg) setLink("icon", seo.favicon_svg, { type: "image/svg+xml" });
        else if (seo.favicon) setLink("icon", seo.favicon);

        setLink("msapplication-config", seo.browserconfig_xml);
    }, [seo]);
} 