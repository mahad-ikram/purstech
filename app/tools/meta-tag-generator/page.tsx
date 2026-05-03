import type { Metadata } from "next";
import MetaTagGeneratorClient from "./client";

export const metadata: Metadata = {
  title:       "Free Online Meta Tag Generator — SEO Meta Tags in Seconds | PursTech",
  description: "Generate perfectly formatted HTML meta tags for SEO instantly. Create title tags, meta descriptions, Open Graph and Twitter Card tags — free, no login required.",
  keywords:    ["meta tag generator", "seo meta tags generator", "meta description generator", "open graph tag generator", "free meta tags tool"],
  openGraph: {
    title:       "Free Online Meta Tag Generator | PursTech",
    description: "Generate perfectly formatted HTML meta tags for SEO instantly. Free, no login required.",
    url:         "https://purstech.com/tools/meta-tag-generator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Online Meta Tag Generator | PursTech",
    description: "Generate SEO meta tags, Open Graph and Twitter Card tags instantly.",
    images:      ["/og-image.png"],
  },
  alternates: { canonical: "/tools/meta-tag-generator" },
};

const FAQ = [
  {
    q: "What are meta tags and why are they important for SEO?",
    a: "Meta tags are HTML elements placed in the <head> section of a webpage that provide information about the page to search engines and social platforms. The title tag and meta description are the most important — they appear directly in Google search results and heavily influence click-through rates. A well-optimized title and description can increase organic traffic by 20–30% even without a ranking change.",
  },
  {
    q: "What is the ideal length for a meta title and meta description?",
    a: "Meta titles should be 50–60 characters (Google truncates anything longer). Meta descriptions should be 150–160 characters. These limits ensure your full text appears in search results without being cut off. Our generator shows a live character count and warns you when you exceed these limits.",
  },
  {
    q: "What are Open Graph tags and do I need them?",
    a: "Open Graph tags control how your page appears when shared on Facebook, LinkedIn and other social platforms — defining the title, description and image shown in the preview card. Without OG tags, platforms make their own guess, often with poor results. Adding them takes 2 minutes and dramatically improves social sharing appearance.",
  },
  {
    q: "What is the difference between Open Graph and Twitter Card tags?",
    a: "Both control link preview appearance, but for different platforms. Open Graph tags are used by Facebook, LinkedIn and most platforms. Twitter Card tags are specifically for Twitter/X and override OG tags when present. You should include both sets for complete social coverage.",
  },
  {
    q: "Should I use the 'keywords' meta tag?",
    a: "No — Google officially ignores the keywords meta tag and has done so since 2009. Including it provides no SEO benefit and may signal to some spam filters that a page is low quality. Focus on title, description and Open Graph tags instead.",
  },
];

const toolSchema = {
  "@context": "https://schema.org",
  "@type":    "SoftwareApplication",
  name:       "Meta Tag Generator",
  description:"Free online tool to generate SEO meta tags, Open Graph and Twitter Card tags.",
  url:        "https://purstech.com/tools/meta-tag-generator",
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

export default function MetaTagGeneratorPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <MetaTagGeneratorClient />

      {/* FAQ Section — server-rendered for SEO */}
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
