import type { Metadata } from "next";
import DiffCheckerClient from "./client";

export const metadata: Metadata = {
  title: "Free Diff Checker — Compare Text & Lists Online",

  description:
    "Free diff checker — compare two texts online and instantly see every difference. Highlights added, removed and changed lines side by side.",

  alternates: { canonical: "/tools/diff-checker" },

  keywords: [
    "diff checker", "text compare", "compare text", "list diff",
    "compare two lists", "compare two texts", "compare urls",
    "string compare", "online diff tool", "code diff checker",
  ],

  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/tools/diff-checker",
    siteName:    "PursTech",
    title:       "Free Diff Checker — Compare Text & Code Online",
    description: "Compare two texts instantly. Added lines in green, removed in red. Works with code, documents and any plain text. Free, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Diff Checker — PursTech" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Free Diff Checker — Compare Text Online",
    description: "Spot every difference between two texts instantly. Line-by-line diff with added/removed stats. Free.",
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
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  name: "Diff Checker", url: "https://www.purstech.com/tools/diff-checker",
  description: "Free online diff checker. Compare two texts and instantly highlight added, removed and unchanged lines. Works with code, documents and any plain text.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Line-by-line text comparison",
    "Added lines highlighted in green, removed in red",
    "Summary stats: added, removed and unchanged line counts",
    "Ignore whitespace toggle",
    "Line number display",
    "Works with code, JSON, HTML, CSS and plain text",
    "No text stored — 100% browser-based",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Use the Diff Checker",
  description: "Use PursTech's free Diff Checker to compare two texts and highlight every difference.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Paste Both Texts",
      text: "Paste your original text in the left panel and your modified or updated text in the right panel. Works with any plain text or code.",
      url: "https://www.purstech.com/tools/diff-checker" },
    { "@type": "HowToStep", position: 2, name: "Click Compare",
      text: "Hit the Compare Texts button. The tool instantly analyses both texts line by line and highlights every difference.",
      url: "https://www.purstech.com/tools/diff-checker" },
    { "@type": "HowToStep", position: 3, name: "Review the Results",
      text: "Green lines were added, red lines were removed. Unchanged lines appear normally. A summary shows the total count of each type. Toggle Ignore Whitespace to skip spacing-only differences.",
      url: "https://www.purstech.com/tools/diff-checker" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Can I compare two lists?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — paste list A on the left and list B on the right. Every added, removed or changed line is highlighted instantly, and the ignore-whitespace toggle cuts through formatting noise. Perfect for email lists, SKUs, keywords or names." } },
    { "@type": "Question", name: "Can I compare two URLs or links?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — paste both URLs and the differences are highlighted down to the exact changed word or parameter. Handy for spotting tracking parameters, staging vs production links, or two near-identical addresses." } },
    { "@type": "Question", name: "What does a diff checker do?",
      acceptedAnswer: { "@type": "Answer", text: "A diff checker compares two pieces of text and highlights the differences between them. Added text is shown in green, removed text in red, and unchanged text in white. This makes it easy to spot changes at a glance." } },
    { "@type": "Question", name: "What can I use a diff checker for?",
      acceptedAnswer: { "@type": "Answer", text: "Diff checkers are useful for comparing code versions, reviewing document edits, checking if two files are identical, proofreading text changes, and verifying that a copy/paste was done correctly." } },
    { "@type": "Question", name: "Does it compare line by line or word by word?",
      acceptedAnswer: { "@type": "Answer", text: "Our diff checker compares line by line by default. Lines that changed are highlighted, and within changed lines the specific added or removed words are marked." } },
    { "@type": "Question", name: "Is the text I compare stored anywhere?",
      acceptedAnswer: { "@type": "Answer", text: "No. All comparison happens instantly in your browser. Your text never leaves your device and is never stored on any server." } },
    { "@type": "Question", name: "Can I compare code with the diff checker?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — paste any code into both panels. It works with any plain text including JavaScript, Python, HTML, CSS, JSON and more." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",         item: "https://www.purstech.com"                    },
    { "@type": "ListItem", position: 2, name: "Tools",        item: "https://www.purstech.com/tools"              },
    { "@type": "ListItem", position: 3, name: "Text Tools",   item: "https://www.purstech.com/categories/text"    },
    { "@type": "ListItem", position: 4, name: "Diff Checker", item: "https://www.purstech.com/tools/diff-checker" },
  ],
};

export default function DiffCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <DiffCheckerClient />
    </>
  );
}
