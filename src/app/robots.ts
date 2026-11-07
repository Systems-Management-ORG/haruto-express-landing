import type { MetadataRoute } from "next";

// Crawling stays open while the site is noindex: a crawler blocked here could not read that tag.
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" } };
}
