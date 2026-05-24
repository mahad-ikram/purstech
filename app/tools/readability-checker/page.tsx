import type { Metadata } from "next";
import ReadabilityCheckerClient from "./client";

export const metadata: Metadata = {
  title: "Free Readability Checker — 7 Formulas",
  description: "The most advanced free readability analyser. 7 formulas including Flesch, Gunning Fog, SMOG, ARI. Target audience matching, famous text benchmarks, sentence difficulty map, annotated text view and vocabulary richness score.",
  alternates: { canonical: "/tools/readability-checker" },
  keywords: ["readability checker","readability test online free","flesch kincaid calculator","flesch reading ease","gunning fog index","smog index","readability score","reading level checker","text readability analyzer","coleman liau index","ari readability","reading grade level checker"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/readability-checker",
    siteName: "PursTech",
    title: "Free Readability Checker — 7 Formulas, Sentence Map & Audience Targeting",
    description: "7 readability formulas, audience targeting, famous text benchmarks, sentence difficulty map and annotated text. Most complete free readability tool.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Readability Checker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Readability Checker — 7 Formulas",
    description: "7 formulas, target audience mode, sentence difficulty map, famous benchmarks. Best free readability tool.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  // ✅ robots as object (not string)
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Readability Checker",
  description: "The most advanced free readability analyser with 7 formulas, target audience mode, famous text benchmarks, sentence difficulty map, annotated text view, vocabulary richness and download report.",
  url: "https://www.purstech.com/tools/readability-checker",
  applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@type": "Organization", name: "PursTech", url: "https://www.purstech.com" },
  featureList: [
    "7 readability formulas: Flesch, Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau, ARI, Dale-Chall",
    "Target audience mode with match score",
    "Famous text benchmarks scale",
    "Sentence difficulty map (visual bar per sentence)",
    "Annotated text view — long sentences and complex words highlighted",
    "Vocabulary richness (Type-Token Ratio)",
    "Complex word list with syllable counts",
    "Download full analysis report as .txt",
    "100% browser-based — text never leaves your device",
  ],
};

// ✅ HowTo schema ADDED
const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Check Text Readability Online",
  description: "Use PursTech's free Readability Checker to analyse your text with 7 industry-standard formulas instantly.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Paste or type your text",
      text: "Paste your article, blog post, document or any text into the input area. All 7 readability scores update live as you type.",
      url: "https://www.purstech.com/tools/readability-checker" },
    { "@type": "HowToStep", position: 2, name: "Set your target audience",
      text: "Select the intended audience for your text — from 5th grade to academic. The tool calculates a match score showing how close your writing is to that target.",
      url: "https://www.purstech.com/tools/readability-checker" },
    { "@type": "HowToStep", position: 3, name: "Check the sentence difficulty map",
      text: "The map shows one bar per sentence, colour-coded by length. Red and orange bars are the long sentences that are driving your complexity scores.",
      url: "https://www.purstech.com/tools/readability-checker" },
    { "@type": "HowToStep", position: 4, name: "Annotate and download",
      text: "Toggle Annotate Text to highlight long sentences and complex words directly in your text. Download the full analysis report for sharing or revision tracking.",
      url: "https://www.purstech.com/tools/readability-checker" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is a good readability score for a website?",
      acceptedAnswer: { "@type": "Answer", text: "For most websites, a Flesch Reading Ease score of 60-70 is ideal — roughly equivalent to a US 8th-9th grade reading level, readable by the majority of adult internet users. Marketing and e-commerce content should target 65-75. News articles typically score 60-65. Technical documentation can be lower (40-55) if the audience is specialists." } },
    { "@type": "Question", name: "What is the Flesch Reading Ease formula?",
      acceptedAnswer: { "@type": "Answer", text: "The Flesch Reading Ease score is: 206.835 minus (1.015 times average sentence length) minus (84.6 times average syllables per word). Scores above 90 are very easy (5th grade). 70-80 is easy. 60-70 is standard. Below 30 is very difficult (academic/professional). The formula was developed by Rudolf Flesch in 1948." } },
    { "@type": "Question", name: "What is the difference between Flesch-Kincaid, Gunning Fog, SMOG and ARI?",
      acceptedAnswer: { "@type": "Answer", text: "Each formula measures readability slightly differently. Flesch-Kincaid converts Flesch into a US school grade equivalent. Gunning Fog counts 3-syllable words as complex and is used in journalism. SMOG is the most accurate for health communications. Coleman-Liau uses character counts rather than syllables. ARI also uses characters and is the most objective." } },
    { "@type": "Question", name: "What is vocabulary richness and what does the Type-Token Ratio measure?",
      acceptedAnswer: { "@type": "Answer", text: "Vocabulary richness, measured by Type-Token Ratio (TTR), is the percentage of unique words in your text: TTR = (unique words / total words) times 100. For blog posts (500-1000 words), a TTR of 50-70% suggests good vocabulary diversity. As text gets longer, TTR naturally drops because common words inevitably repeat." } },
    { "@type": "Question", name: "How do I improve my readability score quickly?",
      acceptedAnswer: { "@type": "Answer", text: "The two most impactful changes are: 1) Shorten your sentences — split any sentence over 25 words into two. This alone can move a score by 5-15 points. 2) Replace complex words with simpler alternatives — 'use' instead of 'utilise', 'show' instead of 'demonstrate'. Use the complex words list to find specific candidates." } },
  ],
};

// ✅ BreadcrumbList with /categories/ai intermediate step
const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                  item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",                 item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "AI Tools",              item: "https://www.purstech.com/categories/ai" },
    { "@type": "ListItem", position: 4, name: "Readability Checker",   item: "https://www.purstech.com/tools/readability-checker" },
  ],
};

// ✅ Removed `import React from "react"` (Next.js 13+ doesn't need it)
export default function ReadabilityCheckerPage() {
  // ✅ Removed `as any` cast
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <ReadabilityCheckerClient>
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            AI Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            Free Readability Checker — 7 Formulas, Sentence Map &amp; Famous Benchmarks
          </h1>
          <p className="text-gray-400 max-w-2xl mb-2 leading-relaxed">
            The most complete free readability tool available. Calculate seven industry-standard
            readability scores simultaneously, set a target audience and see exactly how close
            your text is, and compare your writing to famous documents.
          </p>
          <p className="text-gray-500 max-w-2xl leading-relaxed text-sm">
            Every metric updates live as you type — no button, no wait.
          </p>
        </div>
      </ReadabilityCheckerClient>
    </>
  );
}
