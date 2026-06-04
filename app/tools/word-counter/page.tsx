import type { Metadata } from "next";
import WordCounterClient from "./client";

export const metadata: Metadata = {
  title: "Free Word Counter — Characters, Sentences & Reading Time",
  description: "Count words, characters, sentences, paragraphs and reading time instantly as you type. Includes keyword density, platform character limits and vocabulary richness. Free, private, no login.",
  alternates: { canonical: "/tools/word-counter" },
  keywords: ["word counter","character counter","word count online","count words online","reading time calculator","word counter free","character count tool","words and characters"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/word-counter",
    siteName: "PursTech",
    title: "Free Word Counter — Characters, Sentences & Reading Time",
    description: "Real-time word count, character count, reading time, keyword density and platform limits. Free, private.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Word Counter — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Word Counter — Characters, Sentences & Reading Time",
    description: "Real-time word count, reading time, keyword density and platform character limits. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Word Counter", url: "https://www.purstech.com/tools/word-counter",
  description: "Free real-time word counter. Counts words, characters (with and without spaces), sentences, paragraphs, reading time, speaking time, unique words and keyword density as you type.",
  applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "Real-time word count as you type",
    "Characters with spaces and without spaces",
    "Sentence and paragraph count",
    "Reading time (238 wpm) and speaking time (130 wpm)",
    "Unique word count and vocabulary richness percentage",
    "Average word length",
    "Top 5 keyword density with visual bar chart",
    "Platform character limits for Twitter, Instagram, Google Ads, Meta",
    "Copy full stats report to clipboard",
    "100% private — text never leaves your browser",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Count Words Online",
  description: "Use PursTech's free Word Counter for instant word and character counts.",
  totalTime: "PT10S",
  step: [
    { "@type": "HowToStep", position: 1, name: "Paste or type your text",
      text: "Click the text box and paste your content or start typing. Works with any language and any length of text.",
      url: "https://www.purstech.com/tools/word-counter" },
    { "@type": "HowToStep", position: 2, name: "Read the instant results",
      text: "Word count, character count, reading time, speaking time, unique words and keyword density update in real time as you type — no button needed.",
      url: "https://www.purstech.com/tools/word-counter" },
    { "@type": "HowToStep", position: 3, name: "Copy or export your stats",
      text: "Use Copy Stats to save a full analysis report to your clipboard. Check the Platform Limits panel to see if your text fits Twitter, Instagram, Google Ads or Meta title requirements.",
      url: "https://www.purstech.com/tools/word-counter" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How does the word counter work?",
      acceptedAnswer: { "@type": "Answer", text: "Simply type or paste your text into the box. PursTech instantly counts your words, characters, sentences and paragraphs in real time — no button needed." } },
    { "@type": "Question", name: "Is there a limit on how much text I can enter?",
      acceptedAnswer: { "@type": "Answer", text: "No limit at all. You can paste an entire book, essay or article and get accurate counts instantly." } },
    { "@type": "Question", name: "Does it count characters with or without spaces?",
      acceptedAnswer: { "@type": "Answer", text: "Both. We show you characters with spaces and characters without spaces so you can use whichever count your platform requires." } },
    { "@type": "Question", name: "How are reading time and speaking time calculated?",
      acceptedAnswer: { "@type": "Answer", text: "Reading time is based on the average adult reading speed of 238 words per minute. Speaking time is based on the average speaking pace of 130 words per minute." } },
    { "@type": "Question", name: "Is my text saved or stored anywhere?",
      acceptedAnswer: { "@type": "Answer", text: "No. All processing happens instantly in your browser. Your text is never sent to any server or stored anywhere." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",         item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",        item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Text Tools",   item: "https://www.purstech.com/categories/text" },
    { "@type": "ListItem", position: 4, name: "Word Counter", item: "https://www.purstech.com/tools/word-counter" },
  ],
};

export default function WordCounterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <WordCounterClient>
        <div className="mb-8 min-w-0 w-full">
          <div className="flex items-center gap-3 mb-3 min-w-0 w-full">
            <span className="text-4xl flex-shrink-0">📝</span>
            <div className="min-w-0 w-full">
              <h1 className="text-3xl md:text-4xl font-extrabold text-white truncate pr-2">Word Counter</h1>
              <p className="text-gray-500 mt-1 max-w-2xl leading-relaxed text-base">Count words, characters, sentences &amp; paragraphs — instantly, free, no login.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3 min-w-0 w-full">
            {["Free","No Login","Real-time","Private","Keyword Density","Platform Limits"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium flex-shrink-0">✓ {b}</span>
            ))}
          </div>
        </div>
      </WordCounterClient>
    </>
  );
}
