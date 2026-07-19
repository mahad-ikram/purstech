import type { Metadata } from "next";
import OpenGraphClient from "./client";

export const metadata: Metadata = {
  title: "Free Open Graph Generator — Live Social Previews",
  description: "Generate Open Graph and Twitter Card tags with live previews for Facebook, Twitter, LinkedIn, Discord and Slack. See exactly how your links look before sharing.",
  alternates: { canonical: "/tools/open-graph-generator" },
  keywords: ["open graph generator", "og tags", "og image size", "social preview generator", "twitter card generator", "open graph meta tags"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/open-graph-generator",
    siteName: "PursTech",
    title: "Free Open Graph Tag Generator — 5-Platform Live Preview",
    description: "Generate OG tags with live previews for 5 social platforms. Free, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Open Graph Generator — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Open Graph Generator — 5-Platform Preview",
    description: "5-platform social preview: Facebook, Twitter, LinkedIn, Discord, Slack.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Open Graph Tag Generator", url: "https://www.purstech.com/tools/open-graph-generator",
  description: "Free online tool to generate Open Graph and Twitter Card tags with live 5-platform preview (Facebook, LinkedIn, Twitter/X, Discord, Slack), one-click copy and .html download.",
  applicationCategory: "WebApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Live preview for Facebook, Twitter/X, LinkedIn, Discord and Slack",
    "Twitter summary and large-image card types",
    "Image URL validator with load error detection",
    "One-click copy of all generated tags",
    "Download generated tags as .html snippet",
    "Cache-clearing debug links for Facebook, LinkedIn and Twitter",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Generate Open Graph Tags",
  description: "Use PursTech's free Open Graph Generator to create perfect OG and Twitter Card tags instantly.",
  totalTime: "PT2M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Fill in your details",
      text: "Enter your page title, description, image URL, page URL and site name. Use the recommended 1200x630px dimensions for best results across all platforms.",
      url: "https://www.purstech.com/tools/open-graph-generator" },
    { "@type": "HowToStep", position: 2, name: "Preview every platform",
      text: "Click through Facebook, Twitter, LinkedIn, Discord and Slack tabs to see exactly how your link will look when shared on each platform.",
      url: "https://www.purstech.com/tools/open-graph-generator" },
    { "@type": "HowToStep", position: 3, name: "Copy and deploy",
      text: "Click Copy Code and paste all tags inside your HTML head. Or click Download .html to save the snippet file for later.",
      url: "https://www.purstech.com/tools/open-graph-generator" },
    { "@type": "HowToStep", position: 4, name: "Clear the cache",
      text: "After deploying, use the debug links to force Facebook, LinkedIn and Twitter to re-crawl your page and update their cached previews.",
      url: "https://www.purstech.com/tools/open-graph-generator" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What size should an og:image be?",
      acceptedAnswer: { "@type": "Answer", text: "1200 x 630 pixels (a 1.91:1 ratio) — sharp on Facebook, LinkedIn and X large cards. Keep it under 1 MB as JPG or PNG. The built-in image validator confirms your URL actually loads before you ship the tags." } },
    { "@type": "Question", name: "What are Open Graph tags and why do I need them?",
      acceptedAnswer: { "@type": "Answer", text: "Open Graph tags are HTML meta tags in your page head that control how your page appears when shared on social media. Without them, Facebook, LinkedIn, Discord and WhatsApp make their own guess — often showing the wrong title or no image. Adding OG tags takes under 5 minutes and dramatically improves click-through rates from social sharing." } },
    { "@type": "Question", name: "What image size should I use for Open Graph?",
      acceptedAnswer: { "@type": "Answer", text: "The recommended size is 1200x630px (1.91:1 aspect ratio) for Facebook and LinkedIn. Twitter large image cards use 1200x628. The minimum is 600x315 — images below this may not show at all. Always use HTTPS URLs for your OG image, as HTTP images are often blocked by platforms." } },
    { "@type": "Question", name: "How long should my OG title and description be?",
      acceptedAnswer: { "@type": "Answer", text: "OG titles should be under 60 characters for best display. Facebook truncates titles at around 60 characters. OG descriptions should be 150-160 characters. Write for the shortest display (Facebook) and you will look good everywhere." } },
    { "@type": "Question", name: "Why doesn't my OG image update after I change it?",
      acceptedAnswer: { "@type": "Answer", text: "Social platforms aggressively cache OG data. After updating your tags, force a re-crawl using the Facebook Sharing Debugger, LinkedIn Post Inspector and Twitter Card Validator. Links are provided in our tool. The cache typically updates within a few minutes." } },
    { "@type": "Question", name: "Do I need both OG tags and Twitter Card tags?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — Twitter has its own tag format (twitter:card, twitter:title etc.) and will use these over OG tags when present. Most other platforms use OG tags. Our generator creates both sets simultaneously so you get complete coverage with one copy-paste." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                   item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",                  item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "SEO Tools",              item: "https://www.purstech.com/categories/seo" },
    { "@type": "ListItem", position: 4, name: "Open Graph Generator",   item: "https://www.purstech.com/tools/open-graph-generator" },
  ],
};

const FEATURES = [
  "Live preview for Facebook & LinkedIn share cards",
  "Twitter/X summary and large-image card preview",
  "Discord and Slack link preview simulation",
  "Image URL validator with load error detection",
  "One-click copy + download as .html snippet",
  "Cache-clearing debug links for all 5 platforms",
];

export default function OpenGraphPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <OpenGraphClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">SEO Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free Open Graph Tag Generator — Preview on 5 Social Platforms
          </h1>
          <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
            Open Graph tags control how your page looks when shared on social media. Without them,
            Facebook, LinkedIn, Discord and Slack make their own guess — often wrong. Generate
            perfect OG and Twitter Card tags and see a live preview on all five major platforms
            before writing a single line of code. Free, no login.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-[#6C3AFF] flex-shrink-0 mt-0.5 font-bold">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </OpenGraphClient>
    </>
  );
}