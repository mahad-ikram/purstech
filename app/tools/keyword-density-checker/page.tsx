import type { Metadata } from "next";
import KeywordDensityClient from "./client";

export const metadata: Metadata = {
  title: "Free Keyword Density Checker — Word & Phrase Frequency",
  description: "Analyse keyword density, bigrams, trigrams and readability score in any text. Live keyword highlighter, top words table, CSV export — free, no login.",
  alternates: { canonical: "/tools/keyword-density-checker" },
  keywords: ["keyword density checker", "keyword density", "word frequency counter", "phrase frequency", "keyword analyzer", "seo keyword checker", "n-gram analysis"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/keyword-density-checker",
    siteName: "PursTech",
    title: "Free Keyword Density Checker — N-gram Analysis & Readability",
    description: "Analyse keyword density, n-grams and readability in any text. Target keyword analysis, CSV export. Free SEO tool.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Keyword Density Checker — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Keyword Density Checker",
    description: "N-gram analysis, readability score, live keyword highlighter and CSV export. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebPage",
  name: "Keyword Density Checker", url: "https://www.purstech.com/tools/keyword-density-checker",
  description: "Free online keyword density checker with n-gram analysis (1/2/3-word phrases), Flesch readability score, target keyword tracking, live highlight and CSV export. 100% browser-based.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Keyword density analysis with optimal range feedback (0.5–2.5%)",
    "N-gram analysis: 1-word, 2-word and 3-word phrase frequency",
    "Target keyword tracking with missing/low/good/high status",
    "Flesch Reading Ease score with label and progress bar",
    "Live keyword highlight in text context",
    "Top keywords table with frequency bar charts",
    "Export results as CSV for spreadsheet analysis",
    "Stop word filter toggle",
    "Content stats: words, characters, sentences, paragraphs",
    "100% browser-based — text never sent to server",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Check Keyword Density Online",
  description: "Use PursTech's free Keyword Density Checker to analyse keyword frequency and readability in any text.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Paste your content",
      text: "Paste your full article or page content into the text area. Stats update instantly as you type. Use Load Sample to demo with example text.",
      url: "https://www.purstech.com/tools/keyword-density-checker" },
    { "@type": "HowToStep", position: 2, name: "Enter your target keyword",
      text: "Type your target keyword or phrase in the Target Keyword field to see exactly how many times it appears and its density percentage with a status indicator.",
      url: "https://www.purstech.com/tools/keyword-density-checker" },
    { "@type": "HowToStep", position: 3, name: "Switch n-gram tabs",
      text: "Toggle between 1-word, 2-word and 3-word analysis to find over-repeated phrases you might have missed with single-word analysis.",
      url: "https://www.purstech.com/tools/keyword-density-checker" },
    { "@type": "HowToStep", position: 4, name: "Highlight and export",
      text: "Toggle keyword highlighting to see the keyword in context throughout your content. Export your keyword frequency table as CSV for content audit spreadsheets.",
      url: "https://www.purstech.com/tools/keyword-density-checker" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is a good keyword density percentage?",
      acceptedAnswer: { "@type": "Answer", text: "Around 0.5–2.5% for a primary keyword is a healthy range — present enough to be clear, low enough to avoid stuffing penalties. This checker grades every keyword against that range and flags missing, low and high automatically." } },
    { "@type": "Question", name: "What is keyword density and why does it matter for SEO?",
      acceptedAnswer: { "@type": "Answer", text: "Keyword density is the percentage of times a target keyword appears in content relative to total word count. It signals to search engines what topic a page covers. Modern SEO focuses on natural usage rather than hitting specific percentages — Google understands topical relevance without exact keyword repetitions." } },
    { "@type": "Question", name: "What is the ideal keyword density percentage?",
      acceptedAnswer: { "@type": "Answer", text: "Most SEO professionals suggest keeping primary keyword density between 1% and 2% for natural-sounding content. Below 0.5% the keyword may not appear prominently enough. Above 3% risks appearing as keyword stuffing, which Google penalises with ranking demotions." } },
    { "@type": "Question", name: "What is an n-gram in keyword analysis?",
      acceptedAnswer: { "@type": "Answer", text: "An n-gram is a contiguous sequence of n words. A 1-gram (unigram) is a single word. A 2-gram (bigram) is a two-word phrase like 'keyword density'. A 3-gram (trigram) is three words like 'free seo tools'. Analysing bigrams and trigrams reveals repeated phrases that individual word analysis would miss." } },
    { "@type": "Question", name: "What is the Flesch Reading Ease score?",
      acceptedAnswer: { "@type": "Answer", text: "The Flesch Reading Ease score (0-100) measures how easy a piece of text is to read. Scores above 60 are considered standard or easy. Scores below 30 are very difficult. For general web content, aim for 60-70. Blog posts and marketing copy perform best between 65-80." } },
    { "@type": "Question", name: "What is keyword stuffing and how do I avoid it?",
      acceptedAnswer: { "@type": "Answer", text: "Keyword stuffing is unnaturally repeating a target keyword to manipulate rankings. Signs include density above 3%, forced keyword insertion that disrupts reading flow, and keywords in every sentence. Google penalises this. Write naturally and use semantic variations and related terms instead." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                     item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",                    item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "SEO Tools",                item: "https://www.purstech.com/categories/seo" },
    { "@type": "ListItem", position: 4, name: "Keyword Density Checker",  item: "https://www.purstech.com/tools/keyword-density-checker" },
  ],
};

export default function KeywordDensityPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <KeywordDensityClient />
    </>
  );
}
