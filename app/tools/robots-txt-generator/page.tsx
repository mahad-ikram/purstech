import type { Metadata } from "next";
import RobotsTxtClient from "./client";

export const metadata: Metadata = {
  title:       "Free Robots.txt Generator Online — Create robots.txt Instantly | PursTech",
  description: "Generate a valid robots.txt file for your website in seconds. Control which pages search engines can crawl, block bots, and add your sitemap URL — free, no login.",
  keywords:    ["robots.txt generator", "create robots.txt", "robots.txt file generator", "seo robots.txt", "disallow robots.txt"],
  openGraph: {
    title:       "Free Robots.txt Generator Online | PursTech",
    description: "Generate a valid robots.txt file for your website in seconds. Control crawler access — free, no login.",
    url:         "https://purstech.com/tools/robots-txt-generator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Robots.txt Generator Online | PursTech",
    description: "Generate a valid robots.txt file for your website in seconds.",
    images:      ["/og-image.png"],
  },
  alternates: { canonical: "/tools/robots-txt-generator" },
};

const FAQ = [
  {
    q: "What is a robots.txt file and why do I need one?",
    a: "A robots.txt file is a plain text file placed at the root of your website (e.g., yoursite.com/robots.txt) that tells search engine crawlers which pages they are allowed or not allowed to visit. Without one, crawlers will index everything by default. A robots.txt lets you block admin pages, duplicate content, or low-value URLs from being indexed, improving your site's crawl efficiency.",
  },
  {
    q: "Does blocking a page in robots.txt prevent it from appearing in Google?",
    a: "Not always. robots.txt prevents crawlers from accessing the page content, but Google can still index a URL if it appears in a link from another page — it just won't know what the page contains. To fully prevent a URL from appearing in search results, use a 'noindex' meta tag or HTTP header instead. robots.txt and noindex serve different purposes.",
  },
  {
    q: "What is the difference between Disallow and Allow in robots.txt?",
    a: "Disallow tells a crawler not to access a specific path. Allow explicitly permits access to a path that would otherwise be blocked by a broader Disallow rule. For example, you might Disallow /private/ but Allow /private/public-page.html to grant access to one specific URL within a blocked directory.",
  },
  {
    q: "Should I block Googlebot specifically or use the wildcard User-agent?",
    a: "For most websites, using User-agent: * (wildcard for all bots) is the right approach. Only specify individual bot names if you need different rules for different crawlers — for example, allowing Googlebot but blocking a specific scraper bot. Blocking Googlebot specifically while allowing all others is rarely necessary.",
  },
  {
    q: "Where should I put my sitemap in robots.txt?",
    a: "Add a Sitemap directive at the bottom of your robots.txt file: Sitemap: https://yoursite.com/sitemap.xml. This helps search engines discover your sitemap automatically. You can include multiple Sitemap lines if you have more than one sitemap file. This is in addition to — not a replacement for — submitting your sitemap in Google Search Console.",
  },
];

const toolSchema = {
  "@context": "https://schema.org",
  "@type":    "SoftwareApplication",
  name:       "Robots.txt Generator",
  description:"Free online tool to generate a valid robots.txt file for your website.",
  url:        "https://purstech.com/tools/robots-txt-generator",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type":    "FAQPage",
  mainEntity: FAQ.map(f => ({
    "@type": "Question",
    name:    f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function RobotsTxtGeneratorPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <RobotsTxtClient />

      <section className="max-w-3xl mx-auto px-4 pb-16">
        <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
        <div className="space-y-3">
          {FAQ.map((faq, i) => (
            <details key={i}
              className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
              <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                <span>{faq.q}</span>
                <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
              </summary>
              <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
