import type { Metadata } from "next";
import OpenGraphClient from "./client";

export const metadata: Metadata = {
  title:       "Free Open Graph Tag Generator — Preview & Generate OG Tags | PursTech",
  description: "Generate Open Graph meta tags for Facebook, LinkedIn and Twitter instantly. Preview your social share card and copy the HTML — free, no login required.",
  keywords:    ["open graph generator", "og tag generator", "facebook meta tags", "social media tags generator", "og image preview"],
  openGraph: {
    title:       "Free Open Graph Tag Generator | PursTech",
    description: "Generate and preview Open Graph meta tags for perfect social media sharing. Free, no login.",
    url:         "https://purstech.com/tools/open-graph-generator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Open Graph Tag Generator | PursTech",
    description: "Generate and preview OG meta tags for perfect social sharing.",
    images:      ["/og-image.png"],
  },
  alternates: { canonical: "/tools/open-graph-generator" },
};

const FAQ = [
  {
    q: "What are Open Graph tags and what do they do?",
    a: "Open Graph tags are HTML meta tags in the <head> section of a webpage that control how the page appears when shared on social media platforms including Facebook, LinkedIn, WhatsApp, Slack and Discord. They define the title, description, image and other properties of the share preview card. Without OG tags, platforms generate their own preview which often looks unprofessional.",
  },
  {
    q: "What is the ideal Open Graph image size?",
    a: "The recommended OG image size is 1200×630 pixels at a 1.91:1 aspect ratio. This displays correctly on all major platforms. The minimum is 600×315 pixels, but smaller images may appear blurry or cropped. Keep the file size under 8MB, though under 1MB is ideal for fast loading when the image is fetched during link preview generation.",
  },
  {
    q: "How long does it take for new OG tags to appear on social platforms?",
    a: "Facebook, LinkedIn and Twitter/X cache link preview data. After adding or updating OG tags, you need to clear the cached preview using the platform's URL debugger. Facebook has the Sharing Debugger, LinkedIn has the Post Inspector, and Twitter has the Card Validator. Each allows you to force a fresh crawl of your page to pick up new OG tags.",
  },
  {
    q: "Do Open Graph tags help with SEO?",
    a: "Open Graph tags do not directly influence Google search rankings. However, they indirectly improve SEO by increasing social sharing, which can generate backlinks and drive traffic. Better-looking share cards increase click-through rates from social media, sending more organic traffic to your site. Google also uses OG tags to better understand page content in some contexts.",
  },
  {
    q: "What is the difference between og:title and the page <title>?",
    a: "The <title> tag is used by browsers (shown in the tab) and by Google in search results. The og:title is used by social platforms when someone shares your link. They serve different audiences and can contain different text. For example, your page title might be 'Best JSON Formatter 2025 | PursTech' while your og:title might be 'Format Any JSON Instantly — Free Tool' to be more compelling for social sharing.",
  },
];

const toolSchema = {
  "@context": "https://schema.org",
  "@type":    "SoftwareApplication",
  name:       "Open Graph Tag Generator",
  description:"Free online tool to generate and preview Open Graph meta tags for social media.",
  url:        "https://purstech.com/tools/open-graph-generator",
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

export default function OpenGraphGeneratorPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <OpenGraphClient />

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
