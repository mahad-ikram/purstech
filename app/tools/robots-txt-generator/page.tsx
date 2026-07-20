import type { Metadata } from "next";
import RobotsTxtClient from "./client";

export const metadata: Metadata = {
  title: "Free Robots.txt Generator — Create robots.txt Instantly",
  description: "Generate a valid robots.txt file in seconds. Block AI bots, set CMS presets, test URLs against your rules and download — free, no login required.",
  alternates: { canonical: "/tools/robots-txt-generator" },
  keywords: ["robots.txt generator", "robots txt", "block gptbot", "block ai crawlers", "robots txt disallow", "robots.txt example", "user agent disallow"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/robots-txt-generator",
    siteName: "PursTech",
    title: "Free Robots.txt Generator Online — Create robots.txt Instantly",
    description: "Generate a valid robots.txt with CMS presets, AI bot blocking and live URL tester. Free.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Robots.txt Generator — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Robots.txt Generator Online",
    description: "Create robots.txt with CMS templates, AI bot blocking and URL tester. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebPage",
  name: "Robots.txt Generator",
  description: "Free online tool to generate a valid robots.txt file with CMS presets, AI bot blocking, and URL testing.",
  url: "https://www.purstech.com/tools/robots-txt-generator",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Generate valid robots.txt files instantly",
    "1-click block for common AI scrapers (GPTBot, ClaudeBot, etc.)",
    "Pre-built CMS templates for WordPress, Shopify, and Next.js",
    "Custom rule builder for User-agents, Allow, and Disallow directives",
    "Live URL tester to verify access against your generated rules",
    "XML Sitemap inclusion",
    "Download robots.txt directly to your device",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Create a Robots.txt File",
  description: "Use PursTech's free generator to create and test a robots.txt file for your website.",
  totalTime: "PT2M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose a preset (Optional)",
      text: "Select a CMS preset like WordPress or Shopify to automatically load the recommended allow/disallow rules.",
      url: "https://www.purstech.com/tools/robots-txt-generator" },
    { "@type": "HowToStep", position: 2, name: "Add custom rules",
      text: "Add custom Allow or Disallow paths for specific user-agents. Ensure paths begin with a forward slash (/).",
      url: "https://www.purstech.com/tools/robots-txt-generator" },
    { "@type": "HowToStep", position: 3, name: "Block AI Bots",
      text: "Toggle 'Block AI Scrapers' to automatically append disallow rules for GPTBot, ClaudeBot, CCBot, and others.",
      url: "https://www.purstech.com/tools/robots-txt-generator" },
    { "@type": "HowToStep", position: 4, name: "Test and Download",
      text: "Use the Live URL Tester to ensure your rules are working as intended, then click Download to save the file.",
      url: "https://www.purstech.com/tools/robots-txt-generator" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I block AI bots like GPTBot in robots.txt?",
      acceptedAnswer: { "@type": "Answer", text: "Add a User-agent block per bot with Disallow: / — for example GPTBot (OpenAI), ClaudeBot (Anthropic) and Google-Extended (Gemini training). The 1-click AI-bots preset writes all of them correctly. Note that robots.txt is a polite request, not enforcement." } },
    { "@type": "Question", name: "What is a robots.txt file?",
      acceptedAnswer: { "@type": "Answer", text: "A robots.txt file tells search engine crawlers which URLs the crawler can access on your site. This is used mainly to avoid overloading your site with requests, or to keep certain pages out of Google. It is not a mechanism for keeping a web page out of Google. To keep a web page out of Google, block indexing with noindex or password-protect the page." } },
    { "@type": "Question", name: "Where should I put my robots.txt file?",
      acceptedAnswer: { "@type": "Answer", text: "The robots.txt file must be located at the root of the website host to which it applies. For example, to control crawling on all URLs below https://www.example.com/, the robots.txt file must be located at https://www.example.com/robots.txt." } },
    { "@type": "Question", name: "How do I block AI bots like GPTBot or Claude?",
      acceptedAnswer: { "@type": "Answer", text: "You can block specific AI bots by targeting their User-Agent. Our generator includes a 1-click toggle to block the most common AI scrapers (GPTBot, ClaudeBot, CCBot, Google-Extended, etc.) from training their language models on your content." } },
    { "@type": "Question", name: "What does 'User-agent: *' mean?",
      acceptedAnswer: { "@type": "Answer", text: "The asterisk (*) is a wildcard. 'User-agent: *' means the rule applies to all web crawlers, except those that have their own specific User-agent block." } },
    { "@type": "Question", name: "How does the Sitemap directive work in robots.txt?",
      acceptedAnswer: { "@type": "Answer", text: "You can point crawlers to your XML sitemap by adding a line at the bottom of your robots.txt file: Sitemap: https://yoursite.com/sitemap.xml. This helps all search engines discover your sitemap automatically. You can include multiple Sitemap lines for multiple sitemap files. This complements but does not replace submitting your sitemap directly in Google Search Console." } }
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                  item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",                 item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "SEO Tools",             item: "https://www.purstech.com/categories/seo" },
    { "@type": "ListItem", position: 4, name: "Robots.txt Generator",  item: "https://www.purstech.com/tools/robots-txt-generator" },
  ],
};

export default function RobotsTxtPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <RobotsTxtClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">SEO Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free Robots.txt Generator — Block AI Bots &amp; Set Directives
          </h1>
          <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
            Create a valid robots.txt file in seconds. Select a CMS preset, add custom
            allow/disallow rules, instantly block AI scrapers with one click, and verify your
            paths with the live URL tester. Free, no login required.
          </p>
        </div>
      </RobotsTxtClient>
    </>
  );
}
