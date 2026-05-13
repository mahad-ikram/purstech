import type { Metadata } from "next";
import React from "react";
import GrammarCheckerClient from "./client";

export const metadata: Metadata = {
  title:       "Free Grammar Checker Online — Fix Grammar, Spelling, Style & Passive Voice | PursTech",
  description: "The most advanced free grammar checker. Powered by LanguageTool's 6,000+ rules. In-text highlights, error breakdown chart, passive voice detection, tone analysis, adverb scanner and overused word finder. No login.",
  keywords: [
    "grammar checker", "free grammar checker online", "grammar and spell checker",
    "grammar checker online free", "english grammar checker", "spell checker",
    "punctuation checker", "writing checker", "languagetool", "grammarly alternative",
    "passive voice checker", "grammar fixer online", "grammar corrector",
    "writing style checker", "proofreading tool online free",
  ],
  openGraph: {
    type:        "website",
    title:       "Free Grammar Checker — Fix Grammar, Spelling & Style | PursTech",
    description: "6,000+ grammar rules, error breakdown chart, passive voice & adverb scanner, tone detector. Best free grammar checker online.",
    url:         "https://www.purstech.com/tools/grammar-checker",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Grammar Checker Online" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Grammar Checker Online | PursTech",
    description: "Grammar, spelling, style, passive voice, adverbs, tone analysis. Powered by LanguageTool. Free.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },
  alternates: { canonical: "/tools/grammar-checker" },
  robots:      "index, follow, max-image-preview:large, max-snippet:-1",
};

/* ── JSON-LD schemas ─────────────────────────────────────────────────────── */
const APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Grammar Checker",
  description: "Free online grammar checker powered by LanguageTool with 6,000+ rules. Colour-coded highlights, error breakdown chart, passive voice detection, adverb scanner, tone analysis and overused word finder.",
  url: "https://www.purstech.com/tools/grammar-checker",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  featureList: [
    "Grammar, spelling, punctuation and style checking",
    "LanguageTool 6,000+ rule engine",
    "6 writing goal presets (email, essay, blog, business, creative, general)",
    "Colour-coded in-text highlights by error type",
    "Error breakdown donut chart",
    "Passive voice detection",
    "Adverb (-ly) scanner",
    "Overused word frequency finder",
    "Tone detector (formal/informal/positive/negative)",
    "Readability score",
    "Before/after corrected view",
    "One-click Fix All",
    "Download error report",
    "Multi-language support (EN-US, EN-GB, DE, FR, ES, PT)",
  ],
  offers:   { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author:   { "@type": "Organization", name: "PursTech", url: "https://www.purstech.com" },
  provider: { "@type": "Organization", name: "PursTech", url: "https://www.purstech.com" },
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",            item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",           item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Grammar Checker", item: "https://www.purstech.com/tools/grammar-checker" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What grammar rules does this checker use?",
      acceptedAnswer: { "@type": "Answer", text: "The checker uses LanguageTool, an open-source grammar engine with over 6,000 linguistic rules for English alone, covering grammar errors (subject-verb disagreement, wrong tense, dangling modifiers), spelling mistakes, typographical errors (double spaces, incorrect apostrophes) and style suggestions (passive voice, wordiness, clichés). The same engine powers the LanguageTool browser extension used by over 10 million people worldwide." },
    },
    {
      "@type": "Question",
      name: "What is the difference between grammar errors and style errors?",
      acceptedAnswer: { "@type": "Answer", text: "Grammar errors are objective rule violations — subject-verb disagreement, wrong pronoun case, incorrect tense, dangling modifiers. They make your writing technically incorrect. Style errors are subjective suggestions: overly long sentences, excessive passive voice, vague words, redundant phrases or clichés. Grammar errors should almost always be fixed. Style errors are recommendations — you may choose to ignore them depending on your audience and purpose." },
    },
    {
      "@type": "Question",
      name: "What is passive voice and why does it matter?",
      acceptedAnswer: { "@type": "Answer", text: "Passive voice constructs a sentence so the subject receives the action rather than performing it (e.g. 'The report was written by John' vs 'John wrote the report'). Passive voice is not grammatically wrong, but excessive use makes writing feel indirect, wordy and harder to understand. Most style guides recommend active voice for clarity. Our passive voice detector highlights these constructions so you can decide which ones to rewrite." },
    },
    {
      "@type": "Question",
      name: "What are writing goals and how do they help?",
      acceptedAnswer: { "@type": "Answer", text: "Writing goals let you tell the checker what kind of text you're writing — an email, essay, blog post, business report or creative piece. Each goal adjusts which issues are highlighted as priorities. For a business email, clarity and brevity matter most. For academic writing, passive voice and hedging language are acceptable. For creative writing, many style rules can be intentionally broken. Selecting the right goal makes the feedback more relevant and actionable." },
    },
    {
      "@type": "Question",
      name: "What does the readability score mean?",
      acceptedAnswer: { "@type": "Answer", text: "The readability score is an approximation of the Flesch Reading Ease formula, rated from 0 to 100. A score of 70-80 is ideal for most audiences — readable by a 13-year-old. 80-90 is conversational and easy. 60-70 is standard for informational web content. Below 50 is college-level or technical. The score is affected by average sentence length (shorter sentences score higher) and average word length (simpler words score higher). Most web content should target 60-70." },
    },
  ],
};

export default function GrammarCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />

      <GrammarCheckerClient>
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            AI Tools
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            Free Grammar Checker Online — Grammar, Spelling, Style &amp; Passive Voice
          </h1>

          <p className="text-gray-400 max-w-2xl mb-2 leading-relaxed">
            The most advanced free grammar checker available. Powered by LanguageTool's engine
            of 6,000+ linguistic rules, it catches grammar errors, spelling mistakes, punctuation
            issues and style problems in seconds.
          </p>
          <p className="text-gray-500 max-w-2xl leading-relaxed text-sm">
            Includes unique features: writing goals, error breakdown chart, passive voice
            detector, adverb scanner, overused word finder and tone analysis.
          </p>
        </div>
      </GrammarCheckerClient>
    </>
  ) as any;
}
