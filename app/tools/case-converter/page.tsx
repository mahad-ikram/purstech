import type { Metadata } from "next";
import CaseConverterClient from "./client";

export const metadata: Metadata = {
  title: "Free Case Converter — Uppercase to Lowercase & Title Case",

  description:
    "Free case converter — change uppercase to lowercase, ALL CAPS, Title Case, Sentence case, camelCase, snake_case, kebab-case and more. 12 text cases, instant, no login.",

  alternates: { canonical: "/tools/case-converter" },

  keywords: [
    "case converter online", "text case converter", "uppercase to lowercase",
    "upper case to lower case", "lowercase to uppercase", "all caps converter",
    "change case", "capitalize my title", "title case converter",
    "sentence case", "camelcase converter", "snake case converter",
    "kebab case generator", "pascal case converter free",
  ],

  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/tools/case-converter",
    siteName:    "PursTech",
    title:       "Free Case Converter — All Caps to Lowercase, Title Case & More",
    description: "Convert text to any case instantly — UPPER, lower, Title, camelCase, snake_case, kebab-case and 6 more. Free, browser-based.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Case Converter — PursTech" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Free Case Converter — 12 Text Cases Online",
    description: "Convert text to camelCase, snake_case, UPPER, Title Case and 8 more. Instant, free, no login.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Case Converter", url: "https://www.purstech.com/tools/case-converter",
  description: "Free online text case converter supporting 12 case types including camelCase, snake_case, kebab-case, Title Case, UPPER and more. Instant, no login.",
  applicationCategory: "UtilityApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "UPPER CASE, lower case, Title Case, Sentence case",
    "camelCase, PascalCase for programming",
    "snake_case, CONSTANT_CASE for Python/databases",
    "kebab-case, dot.case for URLs/CSS",
    "aLtErNaTiNg and iNVERSE cASE",
    "Instant live conversion — no button press needed",
    "One-click copy and download as .txt",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Convert Text Case Online",
  description: "Use PursTech's free Case Converter to instantly convert any text to 12 different case formats.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Paste Your Text",
      text: "Type or paste any text into the input box. Works with any length — a single word, a sentence or an entire document.",
      url: "https://www.purstech.com/tools/case-converter" },
    { "@type": "HowToStep", position: 2, name: "Choose a Case Type",
      text: "Click any of the 12 case buttons. Your text is converted instantly as you click. A live preview shows how your text looks in each case.",
      url: "https://www.purstech.com/tools/case-converter" },
    { "@type": "HowToStep", position: 3, name: "Copy or Download",
      text: "Click Copy to grab the converted text for the clipboard, or Download to save it as a .txt file.",
      url: "https://www.purstech.com/tools/case-converter" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Which words are not capitalized in a title?",
      acceptedAnswer: { "@type": "Answer", text: "In title case, short words stay lowercase: articles (a, an, the), coordinating conjunctions (and, but, or, nor) and short prepositions (at, by, in, of, on, to, up) — unless they are the first or last word, which are always capitalized. The Title Case mode applies these rules for you automatically." } },
    { "@type": "Question", name: "How do I change ALL CAPS to lowercase?",
      acceptedAnswer: { "@type": "Answer", text: "Paste the text and click lower case to convert every letter, or Sentence case to keep the first letter of each sentence capitalized — the instant fix for accidental caps-lock typing." } },
    { "@type": "Question", name: "What is Title Case?",
      acceptedAnswer: { "@type": "Answer", text: "Title Case capitalises the first letter of every major word. It is used for headings, titles and proper nouns — for example: 'The Quick Brown Fox'." } },
    { "@type": "Question", name: "What is Sentence case?",
      acceptedAnswer: { "@type": "Answer", text: "Sentence case capitalises only the first letter of the first word in a sentence, just like normal writing. Example: 'The quick brown fox jumps.'" } },
    { "@type": "Question", name: "What is camelCase?",
      acceptedAnswer: { "@type": "Answer", text: "camelCase starts with a lowercase letter and capitalises the first letter of each subsequent word with no spaces. Used widely in programming: 'myVariableName'." } },
    { "@type": "Question", name: "What is snake_case?",
      acceptedAnswer: { "@type": "Answer", text: "snake_case replaces spaces with underscores and uses all lowercase letters. Common in Python and database column names: 'my_variable_name'." } },
    { "@type": "Question", name: "What is kebab-case?",
      acceptedAnswer: { "@type": "Answer", text: "kebab-case replaces spaces with hyphens and uses all lowercase. Used in URLs and CSS class names: 'my-variable-name'." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",           item: "https://www.purstech.com"                        },
    { "@type": "ListItem", position: 2, name: "Tools",          item: "https://www.purstech.com/tools"                  },
    { "@type": "ListItem", position: 3, name: "Text Tools",     item: "https://www.purstech.com/categories/text"        },
    { "@type": "ListItem", position: 4, name: "Case Converter", item: "https://www.purstech.com/tools/case-converter"   },
  ],
};

export default function CaseConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <CaseConverterClient />
    </>
  );
}
