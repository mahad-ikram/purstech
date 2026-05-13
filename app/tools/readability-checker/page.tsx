import type { Metadata } from "next";
import React from "react";
import ReadabilityCheckerClient from "./client";

export const metadata: Metadata = {
  title:       "Free Readability Checker — 7 Formulas, Sentence Map, Audience Targeting & Benchmarks | PursTech",
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

const FEATURES = [
  { icon:"📐", title:"7 Readability Formulas",        desc:"Flesch, Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau, ARI and Dale-Chall — all calculated simultaneously with progress bars." },
  { icon:"🎯", title:"Target Audience Mode",           desc:"Set your target reader (5th grade → academic) and see a match score showing exactly how close your text is to that level." },
  { icon:"📚", title:"Famous Text Benchmarks",         desc:"See where your text sits relative to Harry Potter, NYT articles, Harvard Law Review and insurance policies on a single visual scale." },
  { icon:"📊", title:"Sentence Difficulty Map",        desc:"A colour-coded bar chart with one bar per sentence — instantly reveals where in your text the density is highest." },
  { icon:"🔍", title:"Annotated Text View",            desc:"Toggleable highlights: long sentences in yellow/red, complex words underlined. Shows the problem areas directly in your text." },
  { icon:"📈", title:"Vocabulary Richness (TTR)",      desc:"Type-Token Ratio measures how varied your vocabulary is — a key indicator of writing quality that no other free tool shows." },
];

const USE_CASES = [
  { who:"Content Writers & SEOs",      why:"Verify blog posts and landing pages target the right reading level for your audience before publishing." },
  { who:"Educators & Academics",       why:"Check whether reading materials are appropriate for student grade levels, and measure academic paper complexity." },
  { who:"UX & Product Writers",        why:"Ensure product copy, onboarding text and help articles are simple enough for all users — including non-native speakers." },
  { who:"Health & Legal Communicators",why:"SMOG formula is the standard for health literacy. Ensure patient-facing documents meet plain-language requirements." },
];

const COMPETITOR_TABLE = [
  { feature:"Number of formulas",              purstech:"7",   hemingway:"1",   webfx:"7",    readable:"6"  },
  { feature:"Target audience mode",            purstech:true,  hemingway:false, webfx:false,  readable:true  },
  { feature:"Famous text benchmarks",          purstech:true,  hemingway:false, webfx:false,  readable:false },
  { feature:"Sentence difficulty map",         purstech:true,  hemingway:false, webfx:false,  readable:false },
  { feature:"Annotated text highlights",       purstech:true,  hemingway:true,  webfx:false,  readable:false },
  { feature:"Complex word list",               purstech:true,  hemingway:false, webfx:false,  readable:true  },
  { feature:"Vocabulary richness (TTR)",       purstech:true,  hemingway:false, webfx:false,  readable:false },
  { feature:"Sentence length distribution",   purstech:true,  hemingway:false, webfx:false,  readable:false },
  { feature:"Download analysis report",        purstech:true,  hemingway:false, webfx:false,  readable:"paid"},
  { feature:"Live update as you type",         purstech:true,  hemingway:true,  webfx:false,  readable:false },
  { feature:"100% free, no account",           purstech:true,  hemingway:false, webfx:true,   readable:false },
];

type CellVal = boolean | string;
const CellIcon = ({ v }: { v: CellVal }) =>
  v === true    ? <span className="text-green-400 font-bold">✓</span> :
  v === false   ? <span className="text-gray-700">—</span> :
  typeof v === "string" && v !== "purstech"
    ? <span className={`font-semibold text-xs ${v === "paid" ? "text-yellow-400" : "text-gray-300"}`}>{v}</span>
    : <span className="text-green-400 font-bold text-xs">{v}</span>;

export default function ReadabilityCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />

      <ReadabilityCheckerClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            Writing Tools
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            Free Readability Checker — 7 Formulas, Sentence Map &amp; Famous Benchmarks
          </h1>

          <p className="text-gray-400 max-w-2xl mb-3 leading-relaxed">
            The most complete free readability tool available. Calculate seven industry-standard
            readability scores simultaneously, set a target audience and see exactly how close
            your text is, compare your writing to famous documents on a visual benchmark scale,
            and identify problem sentences and complex words directly in your text. Every metric
            updates live as you type — no button, no wait.
          </p>
          <p className="text-gray-500 max-w-2xl mb-6 leading-relaxed text-sm">
            Used by content writers, educators, UX writers, health communicators and SEO
            professionals to verify writing is accessible, appropriately complex and
            optimised for their target audience.
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

          {/* Competitor table */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-x-auto">
            <div className="px-5 pt-4 pb-2">
              <h2 className="text-sm font-bold text-white">PursTech vs Hemingway vs WebFX vs Readable.io</h2>
              <p className="text-xs text-gray-500 mt-0.5">Readability tool feature comparison</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-2 text-gray-500 font-semibold">Feature</th>
                  <th className="px-4 py-2 text-[#6C3AFF] font-bold">PursTech</th>
                  <th className="px-4 py-2 text-gray-500">Hemingway</th>
                  <th className="px-4 py-2 text-gray-500">WebFX</th>
                  <th className="px-4 py-2 text-gray-500">Readable</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITOR_TABLE.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-2.5 text-gray-400">{row.feature}</td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.purstech} /></td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.hemingway} /></td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.webfx} /></td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.readable} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </ReadabilityCheckerClient>
    </>
  ) as any;
}
