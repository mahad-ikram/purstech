import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      // Allow all major crawlers and AI bots full access
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",          // Never index admin panel
        "/admin/",
        "/api/",           // Never index API routes
        "/_next/",         // Never index Next.js internals
      ],
    },
    sitemap: "https://purstech.com/sitemap.xml",
    host:    "https://purstech.com",
  };
}
