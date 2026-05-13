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

const FEATURES = [
  { icon:"📐", title:"6 Writing Goal Presets",          desc:"Set your writing purpose — Email, Essay, Blog, Business, Creative or General — and get targeted feedback for your audience." },
  { icon:"🥧", title:"Error Breakdown Chart",           desc:"SVG donut chart shows the exact split of grammar, spelling, punctuation and style issues at a glance." },
  { icon:"🔕", title:"Passive Voice Detector",          desc:"Client-side scanner highlights passive voice constructions independently of LanguageTool, so you can spot and rewrite them." },
  { icon:"📊", title:"Overused Word Finder",            desc:"Word frequency analysis identifies words you've repeated too many times — a key sign of weak, repetitive writing." },
  { icon:"🎭", title:"Tone Detector",                   desc:"Detects whether your writing is formal or casual, positive or critical — based on vocabulary patterns." },
  { icon:"📝", title:"Error Density Score",             desc:"Errors per 100 words — a normalised measure that lets you compare quality fairly regardless of document length." },
];

const USE_CASES = [
  { who:"Students",             why:"Check essays and assignments for grammar, spelling and academic style before submission." },
  { who:"Content Writers",      why:"Proof blog posts and articles — catch passive voice, adverbs and overused words that weaken copy." },
  { who:"Non-native Speakers",  why:"LanguageTool's 6,000+ rules catch subtle English errors that basic spell-checkers miss entirely." },
  { who:"Business Professionals",why:"Polish emails and reports — correct tone, eliminate errors and ensure professional quality." },
];

const COMPETITOR_TABLE = [
  { feature:"Grammar & spelling",          purstech:true,  grammarly:true,  hemingway:false, lt:true  },
  { feature:"In-text colour highlights",   purstech:true,  grammarly:true,  hemingway:true,  lt:true  },
  { feature:"Writing goal presets",        purstech:true,  grammarly:true,  hemingway:false, lt:false },
  { feature:"Error breakdown chart",       purstech:true,  grammarly:false, hemingway:false, lt:false },
  { feature:"Passive voice detection",     purstech:true,  grammarly:"paid",hemingway:true,  lt:true  },
  { feature:"Overused word finder",        purstech:true,  grammarly:false, hemingway:false, lt:false },
  { feature:"Tone detector",               purstech:true,  grammarly:"paid",hemingway:false, lt:false },
  { feature:"Error density score",         purstech:true,  grammarly:false, hemingway:false, lt:false },
  { feature:"Adverb scanner",              purstech:true,  grammarly:false, hemingway:true,  lt:false },
  { feature:"Download error report",       purstech:true,  grammarly:false, hemingway:false, lt:false },
  { feature:"Multi-language support",      purstech:true,  grammarly:false, hemingway:false, lt:true  },
  { feature:"100% free, no account",       purstech:true,  grammarly:false, hemingway:false, lt:true  },
];

const CellIcon = ({ v }: { v: boolean | string }) =>
  v === true    ? <span className="text-green-400 font-bold">✓</span>   :
  v === "paid"  ? <span className="text-yellow-400 text-xs font-semibold">Paid</span> :
                  <span className="text-gray-700">—</span>;

export default function GrammarCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />

      <GrammarCheckerClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            AI Tools
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            Free Grammar Checker Online — Grammar, Spelling, Style &amp; Passive Voice
          </h1>

          <p className="text-gray-400 max-w-2xl mb-3 leading-relaxed">
            The most advanced free grammar checker available. Powered by LanguageTool's engine
            of 6,000+ linguistic rules, it catches grammar errors, spelling mistakes, punctuation
            issues and style problems in seconds — then goes further with unique features no other
            free tool offers: a writing goals selector, error breakdown chart, passive voice
            detector, adverb scanner, overused word finder and tone analysis.
          </p>
          <p className="text-gray-500 max-w-2xl mb-6 leading-relaxed text-sm">
            Used by students, content writers, non-native English speakers and business
            professionals to produce polished, error-free writing — without paying for Grammarly.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-[#13131F] border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-sm font-bold text-white">{f.title}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Use cases */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-5">
            <h2 className="text-sm font-bold text-white mb-3">Who uses this tool?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {USE_CASES.map(u => (
                <div key={u.who} className="flex gap-3">
                  <span className="text-[#6C3AFF] font-extrabold text-sm flex-shrink-0 mt-0.5">→</span>
                  <div>
                    <span className="text-sm font-semibold text-white">{u.who}: </span>
                    <span className="text-sm text-gray-400">{u.why}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor comparison table */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-x-auto">
            <div className="px-5 pt-4 pb-2">
              <h2 className="text-sm font-bold text-white">PursTech vs Grammarly vs Hemingway vs LanguageTool</h2>
              <p className="text-xs text-gray-500 mt-0.5">Feature comparison — all at zero cost</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-2 text-gray-500 font-semibold">Feature</th>
                  <th className="px-4 py-2 text-[#6C3AFF] font-bold">PursTech</th>
                  <th className="px-4 py-2 text-gray-500">Grammarly</th>
                  <th className="px-4 py-2 text-gray-500">Hemingway</th>
                  <th className="px-4 py-2 text-gray-500">LanguageTool</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITOR_TABLE.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-2.5 text-gray-400">{row.feature}</td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.purstech} /></td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.grammarly} /></td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.hemingway} /></td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.lt} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GrammarCheckerClient>
    </>
  ) as any;
}
