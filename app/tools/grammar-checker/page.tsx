import type { Metadata } from "next";
import GrammarCheckerClient from "./client";

export const metadata: Metadata = {
  // Renders: "Free Grammar Checker — Style & Passive Voice | PursTech" (55 chars ✅)
  title: "Free Grammar Checker — Style & Passive Voice",

  description:
    "Free grammar checker powered by LanguageTool's 6,000+ rules. Checks grammar, spelling, punctuation and style with colour-coded highlights, passive voice detection, adverb scanner, overused word finder and tone analysis. 6 writing goals, error breakdown chart. No login.",

  keywords: [
    "grammar checker","free grammar checker online","grammar and spell checker",
    "sentence checker","is it grammatically correct","check my grammar",
    "grammar checker online free","english grammar checker","spell checker",
    "punctuation checker","writing checker","languagetool","grammarly alternative",
    "passive voice checker","grammar fixer online","grammar corrector",
    "writing style checker","proofreading tool online free",
  ],

  alternates: { canonical: "/tools/grammar-checker" },

  openGraph: {
    type:     "website",
    url:      "https://www.purstech.com/tools/grammar-checker",
    siteName: "PursTech",
    // ✅ Cleaned — removed "| PursTech" (was double-branding)
    title:       "Free Grammar Checker — Fix Grammar, Spelling & Style",
    description: "6,000+ grammar rules, error breakdown chart, passive voice & adverb scanner, tone detector. Best free grammar checker online.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Grammar Checker Online" }],
  },

  twitter: {
    card: "summary_large_image",
    // ✅ Cleaned — removed "| PursTech"
    title:       "Free Grammar Checker Online",
    description: "Grammar, spelling, style, passive voice, adverbs, tone analysis. Powered by LanguageTool. Free.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  // ✅ Fixed: was string "index, follow, max-image-preview:large, max-snippet:-1"
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// ── WebApplication schema ──────────────────────────────────────────────────
// ✅ Changed SoftwareApplication → WebApplication

const APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name:       "Grammar Checker",
  description:"Free online grammar checker powered by LanguageTool with 6,000+ rules. Colour-coded highlights, error breakdown chart, passive voice detection, adverb scanner, tone analysis and overused word finder.",
  url:        "https://www.purstech.com/tools/grammar-checker",
  inLanguage:          "en-US",
  isAccessibleForFree: true,
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
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
};

// ── HowTo schema ───────────────────────────────────────────────────────────
// ✅ Added — matches the 4-step workflow in the tool

const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type":    "HowTo",
  name:       "How to Check Your Grammar Online",
  description:"Use PursTech's free Grammar Checker to find and fix grammar, spelling, style and passive voice issues.",
  totalTime:  "PT2M",
  step: [
    { "@type": "HowToStep", position: 1,
      name:    "Select your writing goal and language",
      text:    "Choose from six writing goals (General, Email, Essay, Blog, Business or Creative) and select your language (EN-US, EN-GB, DE, FR, ES or PT) to tailor the feedback to your context.",
      url:     "https://www.purstech.com/tools/grammar-checker" },
    { "@type": "HowToStep", position: 2,
      name:    "Paste or type your text",
      text:    "Paste your document, email, essay or blog post into the text editor. You can also click Load Sample to see the tool in action.",
      url:     "https://www.purstech.com/tools/grammar-checker" },
    { "@type": "HowToStep", position: 3,
      name:    "Click Check Grammar",
      text:    "Click the Check Grammar button or press Ctrl+Enter. LanguageTool analyses your text against 6,000+ rules and highlights every issue with colour-coded markers.",
      url:     "https://www.purstech.com/tools/grammar-checker" },
    { "@type": "HowToStep", position: 4,
      name:    "Review highlights and apply fixes",
      text:    "Click any highlighted error to see the explanation and one-click fix. Use Fix All to apply all suggestions at once. Review the error breakdown chart, passive voice detector and overused word finder in the sidebar.",
      url:     "https://www.purstech.com/tools/grammar-checker" },
  ],
};

// ── FAQPage schema ─────────────────────────────────────────────────────────

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type":    "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I find and correct the mistakes in a sentence?",
      acceptedAnswer: { "@type": "Answer", text: "Paste the sentence — or a whole paragraph — and every grammar, spelling and punctuation mistake is highlighted in colour with a one-click correction. It works just as well for a single exercise sentence as for a full essay." } },
    { "@type": "Question", name: "How can I check if a sentence is grammatically correct?",
      acceptedAnswer: { "@type": "Answer", text: "Paste it in. If nothing gets highlighted, the sentence passes 6,000+ grammar, spelling and punctuation rules. You also get a tone read and a readability score, so you know it makes sense — not just that it is technically correct." } },
    { "@type": "Question",
      name:    "What grammar rules does this checker use?",
      acceptedAnswer: { "@type": "Answer", text: "The checker uses LanguageTool, an open-source grammar engine with over 6,000 linguistic rules for English alone. It catches grammar errors (subject-verb disagreement, wrong tense, incorrect pronoun case such as 'between you and I', dangling modifiers), spelling mistakes including confusable homophones ('their/there/they're', 'affect/effect', 'its/it's') that a basic spell-checker misses, punctuation errors (missing commas, incorrect apostrophes, run-on sentences, missing Oxford commas) and style suggestions (passive voice, wordy phrases, clichés, redundant intensifiers like 'very unique'). LanguageTool operates in over 30 languages and powers the browser extension used by over 10 million people worldwide." } },
    { "@type": "Question",
      name:    "What is the difference between grammar errors and style errors?",
      acceptedAnswer: { "@type": "Answer", text: "Grammar errors are objective rule violations — subject-verb disagreement, wrong pronoun case, incorrect tense, dangling modifiers. They make your writing technically incorrect and should almost always be fixed. Style errors are subjective suggestions: overly long sentences, excessive passive voice, vague words, redundant phrases or clichés. Style errors are recommendations — you may choose to ignore them depending on your audience and purpose. For example, passive voice is flagged as a style issue but is perfectly acceptable in scientific writing or when the actor is unknown." } },
    { "@type": "Question",
      name:    "What is passive voice and why does it matter?",
      acceptedAnswer: { "@type": "Answer", text: "Passive voice constructs a sentence so the subject receives the action rather than performing it. Active: 'The manager approved the budget.' Passive: 'The budget was approved by the manager.' Passive voice adds words without adding meaning, making writing feel indirect, wordy and harder to follow. However, passive voice is acceptable when the actor is unknown ('The package was stolen'), unimportant ('The data was collected over six months'), or in scientific writing where method matters more than who performed it. Our passive voice detector highlights these constructions so you can decide which to rewrite." } },
    { "@type": "Question",
      name:    "What are writing goals and how do they help?",
      acceptedAnswer: { "@type": "Answer", text: "Writing goals let you tell the checker what kind of text you are writing. Email prioritises clarity and conciseness, flagging overly long sentences and cold formal language. Essay applies academic writing standards, flagging informal contractions and imprecise language. Blog balances readability with engagement, flagging passive voice and complex sentences. Business enforces professional formal tone, flagging ambiguous language and hedging words. Creative relaxes many style rules intentionally broken in fiction and poetry. General applies all rules with equal weight. Selecting the right goal makes feedback more relevant and actionable." } },
    { "@type": "Question",
      name:    "What does the readability score mean?",
      acceptedAnswer: { "@type": "Answer", text: "The readability score approximates the Flesch Reading Ease formula, rated 0 to 100. A score of 80-90 is conversational and very easy to read. 70-80 is ideal for most audiences, readable by a 13-year-old. 60-70 is standard for informational web content. Below 50 is college-level or technical writing. The score is affected by average sentence length (shorter sentences score higher) and average word length (simpler words score higher). Most web content should target 60-70. The score updates in real time as you edit." } },
  ],
};

// ── BreadcrumbList schema ──────────────────────────────────────────────────
// ✅ Added missing /categories/ai step

const BREADCRUMB_SCHEMA = {
  "@context":      "https://schema.org",
  "@type":         "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",            item: "https://www.purstech.com"                              },
    { "@type": "ListItem", position: 2, name: "Tools",           item: "https://www.purstech.com/tools"                        },
    { "@type": "ListItem", position: 3, name: "AI Tools",        item: "https://www.purstech.com/categories/ai"                },
    { "@type": "ListItem", position: 4, name: "Grammar Checker", item: "https://www.purstech.com/tools/grammar-checker"        },
  ],
};

// ✅ Removed `as any` cast — component is typed correctly with React.ReactNode children

export default function GrammarCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />

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
            issues and style problems in seconds — the same engine used by over 10 million people
            worldwide via the LanguageTool browser extension.
          </p>
          <p className="text-gray-500 max-w-2xl leading-relaxed text-sm mb-2">
            Includes unique features: writing goals, error breakdown chart, passive voice
            detector, adverb scanner, overused word finder and tone analysis.
          </p>
          <p className="text-gray-600 max-w-2xl leading-relaxed text-sm">
            Unlike Grammarly (paid for advanced features) or Hemingway (style-only), PursTech's
            grammar checker combines LanguageTool's rule engine with unique client-side analytics
            — all free, no account required. See how it compares in the feature table below.
          </p>
        </div>
      </GrammarCheckerClient>
    </>
  );
}
