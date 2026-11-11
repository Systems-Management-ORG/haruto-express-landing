import type { MetadataRoute } from "next";
import { SITE_URL } from "@/shared/seo/business";

// Crawling stays open while the site is noindex: a crawler blocked here could not read that tag.
// /api/ holds only the lead-form endpoint, which has nothing to index.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
