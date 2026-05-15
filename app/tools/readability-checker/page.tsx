import type { Metadata } from "next";
import React from "react";
import ReadabilityCheckerClient from "./client";

export const metadata: Metadata = {
  title:       "Free Readability Checker — 7 Formulas",
  description: "The most advanced free readability analyser. 7 formulas including Flesch, Gunning Fog, SMOG, ARI. Target audience matching, famous text benchmarks, sentence difficulty map, annotated text view and vocabulary richness score.",
  keywords: [
    "readability checker", "readability test online free", "flesch kincaid calculator",
    "flesch reading ease", "gunning fog index", "smog index", "readability score",
    "reading level checker", "text readability analyzer", "readability formula",
    "readability test", "online readability checker", "coleman liau index",
    "ari readability", "reading grade level checker",
  ],
  openGraph: {
    type:        "website",
    title:       "Free Readability Checker — 7 Formulas, Sentence Map & Audience Targeting | PursTech",
    description: "7 readability formulas, audience targeting, famous text benchmarks, sentence difficulty map and annotated text. Most complete free readability tool.",
    url:         "https://www.purstech.com/tools/readability-checker",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Readability Checker" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Readability Checker | PursTech",
    description: "7 formulas, target audience mode, sentence difficulty map, famous benchmarks. Best free readability tool.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },
  alternates: { canonical: "/tools/readability-checker" },
  robots:      "index, follow, max-image-preview:large, max-snippet:-1",
};

/* ── JSON-LD schemas ─────────────────────────────────────────────────────── */
const APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Readability Checker",
  description: "The most advanced free readability analyser with 7 formulas, target audience mode, famous text benchmarks, sentence difficulty map, annotated text view, vocabulary richness and download report.",
  url: "https://www.purstech.com/tools/readability-checker",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  featureList: [
    "7 readability formulas: Flesch, Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau, ARI, Dale-Chall",
    "Target audience mode with match score",
    "Famous text benchmarks scale",
    "Sentence difficulty map (visual bar per sentence)",
    "Annotated text view — long sentences and complex words highlighted",
    "Vocabulary richness (Type-Token Ratio)",
    "Sentence length distribution",
    "Complex word list with syllable counts",
    "Improvement tips tailored to your score",
    "Download full analysis report",
    "100% browser-based — text never leaves your device",
  ],
  offers:   { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author:   { "@type": "Organization", name: "PursTech", url: "https://www.purstech.com" },
  provider: { "@type": "Organization", name: "PursTech", url: "https://www.purstech.com" },
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",               item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Readability Checker", item: "https://www.purstech.com/tools/readability-checker" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is a good readability score for a website?",
      acceptedAnswer: { "@type": "Answer", text: "For most websites, a Flesch Reading Ease score of 60-70 is ideal — roughly equivalent to a US 8th-9th grade reading level, readable by the majority of adult internet users. Marketing and e-commerce content should target 65-75 for maximum accessibility. News articles typically score 60-65. Technical documentation can be lower (40-55) if the audience is specialists. Academic and legal documents often score 20-40. Google itself uses readability as one of many signals in ranking content quality." },
    },
    {
      "@type": "Question",
      name: "What is the Flesch Reading Ease formula and how is it calculated?",
      acceptedAnswer: { "@type": "Answer", text: "The Flesch Reading Ease score is calculated as: 206.835 − (1.015 × average sentence length) − (84.6 × average syllables per word). The result is a score from 0 to 100. Higher scores mean easier text. Scores above 90 are very easy (5th grade). 70-80 is easy (6th grade). 60-70 is standard. 50-60 is fairly difficult. 30-50 is difficult (college level). Below 30 is very difficult (academic/professional). The formula was developed by Rudolf Flesch in 1948 and remains the most widely used readability metric." },
    },
    {
      "@type": "Question",
      name: "What is the difference between Flesch-Kincaid, Gunning Fog, SMOG and ARI?",
      acceptedAnswer: { "@type": "Answer", text: "Each formula measures readability slightly differently. Flesch-Kincaid Grade Level converts Flesch into a US school grade equivalent. Gunning Fog counts 'complex words' (3+ syllables) and is commonly used in journalism. SMOG (Simple Measure of Gobbledygook) is the most accurate formula for health communications — it requires at least 30 sentences for accuracy. Coleman-Liau uses character counts rather than syllables, making it less ambiguous. ARI (Automated Readability Index) also uses characters and is the most objective since it doesn't require syllable estimation. Running all formulas simultaneously gives you a more reliable overall picture than any single score alone." },
    },
    {
      "@type": "Question",
      name: "What is vocabulary richness and what does the Type-Token Ratio measure?",
      acceptedAnswer: { "@type": "Answer", text: "Vocabulary richness, measured by Type-Token Ratio (TTR), is the percentage of unique words in your text: TTR = (unique words / total words) × 100. A TTR of 100% means every word is used exactly once — extremely varied vocabulary. As text gets longer, TTR naturally drops because common words inevitably repeat. For blog posts and articles (500-1000 words), a TTR of 50-70% suggests good vocabulary diversity. Below 40% may indicate repetitive or formulaic writing. Very high TTR in short texts is normal and expected." },
    },
    {
      "@type": "Question",
      name: "How do I improve my readability score quickly?",
      acceptedAnswer: { "@type": "Answer", text: "The two most impactful changes are: 1) Shorten your sentences. Every formula penalises long sentences. Split any sentence over 25 words into two. This alone can move a score by 5-15 points. 2) Replace complex words with simpler alternatives. 'Utilise' → 'use'. 'Demonstrate' → 'show'. 'Approximately' → 'about'. 'Subsequently' → 'then'. Use the complex words list our tool provides to find specific candidates. Beyond these two, adding subheadings (which break up long paragraphs), using active voice, and preferring concrete nouns over abstract ones all contribute to better readability scores and, more importantly, better reader comprehension." },
    },
  ],
};

export default function ReadabilityCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />

      <ReadabilityCheckerClient>
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            Writing Tools
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
  ) as any;
}
