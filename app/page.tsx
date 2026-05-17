import type { Metadata } from "next";
import HomeClient from "./client";

// ─── Homepage Metadata ────────────────────────────────────────────────────────
// SERVER COMPONENT — metadata exports correctly here.
// All interactive logic lives in ./client.tsx (the "use client" component).

export const metadata: Metadata = {
  // Rendered as: "50 Free Online Tools — No Login, No Limits | PursTech" (54 chars ✅)
  title: "50 Free Online Tools — No Login, No Limits",

  description:
    "PursTech gives you 50 completely free online tools — PDF compressor, image compressor, grammar checker, JSON formatter, meta tag generator, SSL checker, word counter and more. No login, no limits, 100% browser-based.",

  // ── Canonical — was missing after root layout canonical was removed ────────
  alternates: { canonical: "/" },

  keywords: [
    "free online tools", "free tools no login", "purstech",
    "pdf compressor free", "image compressor online", "grammar checker free",
    "json formatter online", "meta tag generator", "word counter online",
    "free developer tools", "free seo tools", "free pdf tools",
    "no login tools", "browser based tools", "online utilities free",
  ],

  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com",
    siteName:    "PursTech",
    title:       "PursTech — 50 Free Online Tools. No Login. No Limits.",
    description: "50 free tools across 8 categories — PDF, image, dev, SEO, AI, finance, security and text. No account needed. Works in your browser.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PursTech — 50 Free Online Tools" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "PursTech — 50 Free Online Tools. No Login. No Limits.",
    description: "PDF compressor, grammar checker, image tools, SEO tools, dev tools and more — all free, all browser-based.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// ─── FAQPage Schema ───────────────────────────────────────────────────────────
// Matches the FAQ section in HomeClient below.
// Server-rendered → visible to Google/Bing crawlers without JS.

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type":    "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name:    "Is PursTech really free?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, all 50 tools on PursTech are 100% free with no hidden costs. You can use every tool as many times as you want — no subscription, no trial period, no credit card required. PursTech is supported by non-intrusive advertising, which lets us keep all tools permanently free." },
    },
    {
      "@type": "Question",
      name:    "Do I need to create an account or log in?",
      acceptedAnswer: { "@type": "Answer", text: "No. PursTech requires zero registration. Every tool works immediately without creating an account, providing an email address, or logging in. Just open the tool and start using it — no sign-up, no verification, no waiting." },
    },
    {
      "@type": "Question",
      name:    "Are my files and data kept private?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. All PursTech tools run entirely in your browser. Files are processed locally on your device and never uploaded to any server. We have no access to your files, documents, or the content you use in the tools. Everything stays on your device." },
    },
    {
      "@type": "Question",
      name:    "What tools does PursTech offer?",
      acceptedAnswer: { "@type": "Answer", text: "PursTech offers 50 free tools across 8 categories: Text Tools (word counter, case converter, lorem ipsum, diff checker), Developer Tools (JSON formatter, regex tester, base64 encoder, SVG editor, markdown editor, QR code generator), Image Tools (image compressor, background remover, image resizer, favicon generator, OCR), SEO Tools (meta tag generator, robots.txt generator, sitemap generator), PDF Tools (compress, merge, split, convert), Finance Tools (loan, mortgage, currency, compound interest), Security Tools (password generator, SSL checker, IP lookup), and AI Tools (grammar checker, readability checker)." },
    },
    {
      "@type": "Question",
      name:    "Do the tools work on mobile phones?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. All PursTech tools are fully mobile-responsive and work on smartphones and tablets. The interface adapts to any screen size. You can compress images, format JSON, check grammar, and use all 50 tools directly from your phone's browser." },
    },
    {
      "@type": "Question",
      name:    "Is there a usage limit?",
      acceptedAnswer: { "@type": "Answer", text: "No usage limits for free users. All 50 tools are unlimited. A Pro plan is coming soon for power users needing batch processing and API access, but all core tools will always remain completely free for everyone." },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <HomeClient />
    </>
  );
}
