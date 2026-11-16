import type { Metadata } from "next";
import AdsenseCheckerClient from "./client";

export const metadata: Metadata = {
  title: "Free Google AdSense Eligibility & Low Value Content Checker",
  description:
    "Audit any website for Google AdSense approval readiness across 26 automated checks (2,600 pts). Detect Low Value Content, verify ads.txt & Mediapartners-Google, score V-O-T-C-R page value, and export Markdown/JSON reports. 100% free, no login.",
  alternates: { canonical: "/tools/adsense-checker" },
  keywords: [
    "adsense eligibility checker",
    "google adsense approval checker",
    "adsense readiness checker",
    "adsense low value content checker",
    "adsense site audit tool",
    "ads.txt validator and generator",
    "adsense approval calculator",
    "check website for adsense approval",
    "adsense policy violation checker",
    "adsense revenue calculator",
  ],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/adsense-checker",
    siteName: "PursTech",
    title: "Free Google AdSense Eligibility & Low Value Content Checker — 26-Point Audit",
    description:
      "Run a live 26-point Google AdSense readiness audit across Site Scale, Required Pages, Site Structure (ads.txt, robots.txt, sitemap.xml), Content Quality, and UX. Includes Low Value Content Draft Analyzer, ads.txt Generator & Revenue Calculator.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Google AdSense Eligibility Checker — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Google AdSense Eligibility & Low Value Content Checker | PursTech",
    description:
      "26-point live AdSense audit, V-O-T-C-R Low Value Content analyzer, ads.txt generator, and RPM calculator. Free, no login.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://www.purstech.com/tools/adsense-checker/#software",
  isPartOf: { "@id": "https://www.purstech.com/#website" },
  datePublished: "2026-11-05",
  dateModified: "2026-11-14",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  name: "Google AdSense Eligibility & Low Value Content Checker",
  url: "https://www.purstech.com/tools/adsense-checker",
  description:
    "Free 26-point Google AdSense readiness audit tool and Low Value Content analyzer. Evaluates site scale, mandatory trust pages (/about, /privacy, /contact, /terms), ads.txt, Mediapartners-Google crawler access, content-to-boilerplate ratio, cross-page originality, and V-O-T-C-R page value.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: {
    "@type": "Organization",
    "@id": "https://www.purstech.com/#organization",
    name: "PursTech",
    logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 },
  },
  featureList: [
    "26-point live website audit across 7 official categories (2,600 total points)",
    "Composite Readiness Score (0-100) and Approval Probability estimation (up to 95%)",
    "Stratified sitemap & subpage sampling with Content-to-Boilerplate Ratio (%) and V-O-T-C-R scoring",
    "Live ads.txt, robots.txt (Mediapartners-Google), sitemap.xml, and Google Consent Mode v2 verification",
    "Single-page Low Value Content draft & HTML analyzer",
    "Built-in IAB ads.txt, AdSense robots.txt & Consent Mode v2 snippet generator",
    "Interactive AdSense Revenue, RPM & CPC calculator by niche and geography",
    "One-click Markdown (.md) and JSON (.json) audit report export",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Audit a Website for Google AdSense Approval",
  description: "Use PursTech's free 26-point Google AdSense Readiness Checker to detect and fix Low Value Content and technical blockers before requesting a review.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Enter your website URL",
      text: "Type your domain name (e.g., purstech.com) into the Live Website Audit tab and click Run 26-Point Audit.",
      url: "https://www.purstech.com/tools/adsense-checker",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Review Hard Requirements & Site Structure",
      text: "Verify that all 4 Hard Categories pass (900/900 pts): Site Scale (25+ indexed pages), Required Pages (/about, /privacy, /contact, /terms), Site Structure (robots.txt, sitemap.xml, ads.txt), and Policy Compliance.",
      url: "https://www.purstech.com/tools/adsense-checker",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Inspect Per-Page Content Ratio & V-O-T-C-R Scores",
      text: "Check the Sampled Pages table to ensure every tool or article page has at least 1,500+ characters of server-rendered editorial text, a 75%+ content-to-boilerplate ratio, and native <details> FAQs.",
      url: "https://www.purstech.com/tools/adsense-checker",
    },
    {
      "@type": "HowToStep",
      position: 4,
      name: "Fix flagged items & export your audit report",
      text: "Follow the inline remediation steps for any warnings, generate your ads.txt file in Tab 3 if missing, and download your full Markdown or JSON audit report.",
      url: "https://www.purstech.com/tools/adsense-checker",
    },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does the 26-point Google AdSense Readiness Score work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Our auditor evaluates 26 technical and editorial signals across 7 weighted categories totaling 2,600 points: Site Scale (100 pts), Required Pages (400 pts), Site Structure (300 pts), Policy Compliance (100 pts), Content Quality (600 pts), Landing Page Quality (600 pts), and User Experience (500 pts). It then computes your Composite Score using the formula: Page Value × (Site-wide Quality / 100) × (Landing Page Quality / 100).",
      },
    },
    {
      "@type": "Question",
      name: "Why did Google AdSense reject my site for 'Low value content'?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "'Low value content' (and 'Ads on screens without publisher content') is Google AdSense's #1 rejection reason. It occurs when pages have thin server-rendered prose (<300–500 words), rely purely on client-side JavaScript state that crawlers do not expand, share high template similarity across subpages, or lack mandatory trust pages (/about, /privacy, /contact, /terms). Expanding tool and article pages with 500–800+ words of original technical guides and native HTML5 <details> FAQs resolves this issue.",
      },
    },
    {
      "@type": "Question",
      name: "Why does AdSense show 'Ads.txt status: Not found' even after I uploaded ads.txt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "First, verify that both https://yourdomain.com/ads.txt and https://www.yourdomain.com/ads.txt resolve with HTTP 200 OK and text/plain headers via a 301/308 permanent redirect, and that robots.txt allows Mediapartners-Google. Second, check the 'Last updated' timestamp in your AdSense Sites table: while a site is in 'Needs attention' status, AdSense pauses background ads.txt crawls until you check 'I confirm I have fixed the issues' and click Request review.",
      },
    },
    {
      "@type": "Question",
      name: "What do the 5 V-O-T-C-R dimensions mean in the page audit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Each sampled page is graded from 0 to 10 across five dimensions: Value (V — substantive depth and utility of server-rendered text), Originality (O — unique domain prose, structured tables, and absence of placeholder filler), Translation/Language (T — clean language declaration in <html lang> without machine-translation artifacts), Compliance (C — absence of restricted AdSense policy keywords), and Relevance (R — topical alignment with the site's primary theme).",
      },
    },
    {
      "@type": "Question",
      name: "How can a web tool, calculator, or SaaS utility site get approved for Google AdSense?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Interactive tool sites are frequently rejected if each tool route only renders input fields and buttons. To pass AdSense review, every tool URL must pair its interactive widget with 1,500–3,000+ characters (500+ words) of server-rendered educational content: how the underlying algorithm works, step-by-step usage instructions, a reference comparison table, and 4–6 native <details>/<summary> FAQs, alongside 15–20+ long-form blog tutorials linking to those tools.",
      },
    },
    {
      "@type": "Question",
      name: "What score should I reach before clicking 'Request review' in Google AdSense?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Aim for a Composite Score of 80/100 or higher and a Hard Status of 'READY' (meaning all 900/900 points in Site Scale, Required Pages, Site Structure, and Policy Compliance pass with zero failures). Sites scoring 85–95+ with 100% hard-requirement compliance have the highest first-pass approval rate.",
      },
    },
    {
      "@type": "Question",
      name: "Does this AdSense checker store my website URL or audit data?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Live audits are fetched on the fly to compute your 26-point report and returned directly to your browser. Recent scan history is stored exclusively in your own browser's localStorage so you can track improvements across deployments, and can be cleared with one click.",
      },
    },
    {
      "@type": "Question",
      name: "Is PursTech's Google AdSense Eligibility Checker affiliated with Google LLC?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. This tool is an independent technical auditing utility engineered from publicly documented Google Publisher Policies, Google Search Central Helpful Content guidelines, and IAB Tech Lab ads.txt specifications. Only Google LLC makes final AdSense approval decisions.",
      },
    },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "SEO Tools", item: "https://www.purstech.com/categories/seo" },
    { "@type": "ListItem", position: 4, name: "AdSense Readiness Checker", item: "https://www.purstech.com/tools/adsense-checker" },
  ],
};

export default function AdsenseCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />

      <AdsenseCheckerClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            SEO &amp; Publisher Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free Google AdSense Eligibility &amp; Low Value Content Checker
          </h1>
          <p className="text-gray-400 max-w-3xl leading-relaxed text-base">
            Run a live <strong>26-point Google AdSense readiness audit (2,600 pts)</strong> across your homepage,{" "}
            <code className="text-[#00D4FF] font-mono">sitemap.xml</code>,{" "}
            <code className="text-[#00D4FF] font-mono">robots.txt</code>,{" "}
            <code className="text-[#00D4FF] font-mono">ads.txt</code>, mandatory legal pages, and sampled subpages.
            Detect <strong>&ldquo;Low value content&rdquo;</strong> triggers, inspect per-page{" "}
            <code className="text-[#6C3AFF] font-mono">V-O-T-C-R</code> scores, generate compliant{" "}
            <code className="text-[#00D4FF] font-mono">ads.txt</code> &amp; Consent Mode v2 snippets, and export full
            Markdown or JSON audit reports—100% free with no login or daily scan limits.
          </p>
        </div>
      </AdsenseCheckerClient>
    </>
  );
}
