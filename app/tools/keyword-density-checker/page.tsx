import type { Metadata } from "next";
import KeywordDensityClient from "./client";

export const metadata: Metadata = {
  title:       "Free Keyword Density Checker Online — Analyze Text Instantly | PursTech",
  description: "Check keyword density in any text instantly. Find keyword frequency, percentage and positions. Avoid keyword stuffing and optimize content for SEO — free, no login.",
  keywords:    ["keyword density checker", "keyword density tool", "check keyword density", "keyword frequency analyzer", "seo keyword density"],
  openGraph: {
    title:       "Free Keyword Density Checker Online | PursTech",
    description: "Analyze keyword frequency and density in any text instantly. Free SEO tool, no login required.",
    url:         "https://purstech.com/tools/keyword-density-checker",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Keyword Density Checker | PursTech",
    description: "Analyze keyword frequency and density in any text instantly.",
    images:      ["/og-image.png"],
  },
  alternates: { canonical: "/tools/keyword-density-checker" },
};

const FAQ = [
  {
    q: "What is keyword density and why does it matter for SEO?",
    a: "Keyword density is the percentage of times a target keyword appears in a piece of content relative to the total word count. It matters for SEO because it signals to search engines what topic a page is about. However, modern SEO focuses on natural usage rather than hitting specific density targets. Google's algorithms are sophisticated enough to understand topical relevance without counting exact keyword repetitions.",
  },
  {
    q: "What is the ideal keyword density percentage?",
    a: "There is no universal ideal, but most SEO professionals suggest keeping primary keyword density between 1% and 2% for natural-sounding content. Below 0.5% the keyword may not appear prominently enough for search engines to associate the page with that topic. Above 3% risks appearing as keyword stuffing, which Google penalizes. Focus on covering the topic thoroughly rather than hitting a specific percentage.",
  },
  {
    q: "What is keyword stuffing and how can I avoid it?",
    a: "Keyword stuffing is the practice of unnaturally repeating a target keyword throughout content to manipulate search rankings. Signs include: forced keyword insertion that disrupts natural reading flow, keywords in every sentence, and lists of keywords with no meaningful context. Google penalizes keyword stuffing with ranking demotions. The best practice is to write naturally and use semantic variations and related terms instead of repeating the exact keyword.",
  },
  {
    q: "Should I check keyword density for exact match or phrase match?",
    a: "Both. Check your exact target keyword to ensure it appears naturally. Also check individual words within your keyword phrase to see their individual frequencies. A good keyword density checker highlights both so you can see if any single word is being overused even when the full phrase appears at a reasonable density.",
  },
  {
    q: "Does keyword density in headings count more than in body text?",
    a: "Yes — search engines give more weight to keywords that appear in H1, H2 and H3 headings than in regular body text. This is why including your target keyword naturally in the page title and at least one subheading is an important on-page SEO practice, separate from overall density in the body content.",
  },
];

const toolSchema = {
  "@context": "https://schema.org",
  "@type":    "SoftwareApplication",
  name:       "Keyword Density Checker",
  description:"Free online tool to check keyword density and frequency in any text.",
  url:        "https://purstech.com/tools/keyword-density-checker",
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

export default function KeywordDensityPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <KeywordDensityClient />

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
