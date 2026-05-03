import type { Metadata } from "next";
import SitemapGeneratorClient from "./client";

export const metadata: Metadata = {
  title:       "Free XML Sitemap Generator Online — Create sitemap.xml Instantly | PursTech",
  description: "Generate a valid XML sitemap for your website in seconds. Add URLs, set priority and change frequency, and download a ready-to-submit sitemap.xml file — free, no login.",
  keywords:    ["xml sitemap generator", "sitemap.xml generator", "create sitemap online", "free sitemap generator", "sitemap for google"],
  openGraph: {
    title:       "Free XML Sitemap Generator Online | PursTech",
    description: "Generate a valid XML sitemap for your website in seconds. Download and submit to Google — free, no login.",
    url:         "https://purstech.com/tools/sitemap-generator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free XML Sitemap Generator Online | PursTech",
    description: "Generate a valid XML sitemap and download it instantly.",
    images:      ["/og-image.png"],
  },
  alternates: { canonical: "/tools/sitemap-generator" },
};

const FAQ = [
  {
    q: "What is an XML sitemap and does my website need one?",
    a: "An XML sitemap is a file that lists all the important URLs on your website, helping search engines discover and crawl your content efficiently. While search engines can find pages by following links, a sitemap ensures that new pages, recently updated content, and pages with few inbound links are discovered and indexed faster. Every website benefits from having a sitemap, but it is especially important for large sites, new sites, sites with poor internal linking, and content-heavy blogs.",
  },
  {
    q: "How do I submit a sitemap to Google?",
    a: "Go to Google Search Console, select your property, click 'Sitemaps' in the left menu, enter your sitemap URL (typically yoursite.com/sitemap.xml), and click Submit. Google will then crawl your sitemap and begin indexing the listed URLs. You should also add a Sitemap directive to your robots.txt file pointing to the sitemap URL so all search engines can find it automatically.",
  },
  {
    q: "What is the difference between priority and changefreq in a sitemap?",
    a: "Priority (0.0 to 1.0) tells search engines the relative importance of a page compared to other pages on your site. A value of 1.0 means most important, 0.5 is average, and 0.1 is least important. Change frequency (always, hourly, daily, weekly, monthly, yearly, never) indicates how often the content changes. Both are hints to search engines, not directives — Google may ignore them and crawl based on its own signals.",
  },
  {
    q: "How many URLs can a sitemap contain?",
    a: "A single XML sitemap file can contain a maximum of 50,000 URLs and must not exceed 50MB uncompressed. For larger sites, use a sitemap index file that references multiple individual sitemap files. Google Search Console shows which sitemap index and individual sitemaps have been processed and how many URLs were indexed from each.",
  },
  {
    q: "Should I include images and videos in my sitemap?",
    a: "Yes — Google supports image sitemaps and video sitemaps using additional XML tags within your standard sitemap. Including image URLs in your sitemap helps Google Image Search discover and index your images, which can drive additional traffic. For basic SEO, a standard URL sitemap is sufficient to start. You can always add image and video extensions later.",
  },
];

const toolSchema = {
  "@context": "https://schema.org",
  "@type":    "SoftwareApplication",
  name:       "XML Sitemap Generator",
  description:"Free online tool to generate a valid XML sitemap for any website.",
  url:        "https://purstech.com/tools/sitemap-generator",
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

export default function SitemapGeneratorPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <SitemapGeneratorClient />

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
