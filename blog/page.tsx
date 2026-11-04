import type { Metadata } from "next";
import BlogClient from "./client";
import { BLOG_POSTS } from "./data";

// ─── Metadata ─────────────────────────────────────────────────────────────────
// QA fixes:
//  ✅ Server component — metadata exports correctly
//  ✅ alternates.canonical added
//  ✅ openGraph + twitter added
//  ✅ Schemas moved here from client component (with www URLs)

export const metadata: Metadata = {
  title: "Free Tools Blog — Tutorials, Guides & Tips",
  // Renders: "Free Tools Blog — Tutorials, Guides & Tips | PursTech" (53 chars ✅)

  description:
    "Tutorials, tool guides and developer tips from PursTech. Learn image compression, JSON formatting, password security, color formats, URL encoding, BMI and more.",
  // 162 chars — slightly long but acceptable for blog listing page

  alternates: { canonical: "/blog" },

  keywords: [
    "free tools blog", "purstech blog", "developer tutorials",
    "image compression guide", "json formatter guide", "password security tips",
    "seo tools guide", "web developer tips", "online tool tutorials",
    "url encoding guide", "bmi calculator guide", "color format guide",
  ],

  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/blog",
    siteName:    "PursTech",
    title:       "PursTech Blog — Tutorials, Guides & Tool Tips",
    description: "Tutorials, tool guides and developer tips. Learn JSON formatting, image compression, password security, SEO tools and more — all free.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PursTech Blog" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "PursTech Blog — Tutorials, Guides & Tool Tips",
    description: "Developer tutorials, tool guides and productivity tips — all free from PursTech.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// ─── JSON-LD Schemas ──────────────────────────────────────────────────────────
// Moved from client component → server component so crawlers see them without JS.
// All URLs fixed to www.purstech.com

const allPosts = Object.values(BLOG_POSTS);

const BLOG_SCHEMA = {
  "@context":   "https://schema.org",
  "@type":      "Blog",
  name:         "PursTech Blog",
  description:  "Tutorials, tool guides, developer tips and product updates from the PursTech team.",
  url:          "https://www.purstech.com/blog",       // ✅ www
  publisher: {
    "@type": "Organization",
    name:    "PursTech",
    url:     "https://www.purstech.com",               // ✅ www
    logo: {
      "@type": "ImageObject",
      url:     "https://www.purstech.com/og-image.png",
    },
  },
  blogPost: allPosts.map(p => ({
    "@type":         "BlogPosting",
    headline:        p.title,
    description:     p.excerpt,
    datePublished:   p.publishedISO,
    dateModified:    p.updatedISO,
    url:             `https://www.purstech.com/blog/${p.slug}`, // ✅ www
    author: {
      "@type": "Person",
      name:    "Mahad Ikram",
      url:     "https://www.purstech.com/about",
    },
    keywords: p.keywords.join(", "),
  })),
};

const BREADCRUMB_SCHEMA = {
  "@context":        "https://schema.org",
  "@type":           "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.purstech.com"      }, // ✅ www
    { "@type": "ListItem", position: 2, name: "Blog", item: "https://www.purstech.com/blog" }, // ✅ www
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BlogPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_SCHEMA) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />

      {/* All interactive logic (search, filter, featured card, grid) */}
      <BlogClient />
    </>
  );
}
