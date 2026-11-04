import type { Metadata } from "next";
import RegexTesterClient from "./client";

export const metadata: Metadata = {
  title: "Free Regex Tester — Regex Builder & Match Highlighter",
  description: "Free regex tester — build and debug regular expressions (regex) with real-time match highlighting, capture groups and a handy cheat sheet.",
  alternates: { canonical: "/tools/regex-tester" },
  keywords: ["regex tester","regex builder","regular expression builder","regex generator","regex match","regex not","javascript regex tester","regex checker","lookahead lookbehind regex"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/regex-tester",
    siteName: "PursTech",
    title: "Free Regex Tester Online — Real-Time Highlighting & Explainer",
    description: "Test regex with real-time highlighting, named groups, replace mode and 21-pattern library. Free.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Regex Tester — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Regex Tester Online — Real-Time Highlighting",
    description: "Real-time highlighting, named groups, replace mode, explainer, 21-pattern library. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  name: "Regex Tester", url: "https://www.purstech.com/tools/regex-tester",
  description: "Free online regex tester with real-time match highlighting, named group extraction, replace mode, plain-English explainer and 21-pattern library covering validation, dates, text, code and numbers.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Real-time match highlighting as you type",
    "Named capture group extraction in a result table",
    "Replace mode with $1 and $<name> group references",
    "Plain-English regex token explainer",
    "21 ready-to-use patterns: validation, dates, text, code, numbers",
    "Flags: global (g), case-insensitive (i), multiline (m), dotAll (s)",
    "Stats bar: match count, pattern length, group count",
    "Copy pattern as /pattern/flags format",
    "100% browser-based — your patterns and text never leave your device",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Test a Regular Expression Online",
  description: "Use PursTech's free Regex Tester to test, debug and understand regular expressions instantly.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter your pattern",
      text: "Type a regex pattern in the input field. A red border and error message appear immediately if the syntax is invalid. Toggle flags (g, i, m, s) as needed.",
      url: "https://www.purstech.com/tools/regex-tester" },
    { "@type": "HowToStep", position: 2, name: "Paste your test string",
      text: "Enter the text you want to match against. Match highlights appear in real time as you type — each match gets a different colour.",
      url: "https://www.purstech.com/tools/regex-tester" },
    { "@type": "HowToStep", position: 3, name: "Use Match, Replace or Explain mode",
      text: "Match mode shows highlighted results and a groups table. Replace mode shows the substituted text using $1 or named group references. Explain breaks down every token into plain English.",
      url: "https://www.purstech.com/tools/regex-tester" },
    { "@type": "HowToStep", position: 4, name: "Copy or load from the library",
      text: "Click Copy Pattern to copy the /pattern/flags string for pasting into code. Or open the Pattern Library to load a ready-made regex for emails, URLs, dates, phone numbers and more.",
      url: "https://www.purstech.com/tools/regex-tester" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I match NOT something in regex?",
      acceptedAnswer: { "@type": "Answer", text: "Use a negated character class like [^abc] to match any character except a, b or c — or a negative lookahead (?!pattern) to assert that something does NOT follow. Try either in the tester: matches highlight live, and the token explainer describes each part of your pattern in plain English." } },
    { "@type": "Question", name: "What regex flavor does this tester use?",
      acceptedAnswer: { "@type": "Answer", text: "JavaScript (ECMAScript) — the same engine used by browsers and Node.js, with named groups, lookbehind and the g, i, m, s flags. Most everyday patterns behave identically in Python, Java and PCRE; differences only appear in advanced constructs like recursion or possessive quantifiers." } },
    { "@type": "Question", name: "What is a regular expression (regex)?",
      acceptedAnswer: { "@type": "Answer", text: "A regular expression is a sequence of characters that defines a search pattern. Used for string searching, validation and manipulation, regex is supported natively in JavaScript, Python, Java, PHP and most modern languages. Mastering regex allows you to solve complex text-processing tasks in a single line of code." } },
    { "@type": "Question", name: "What do the regex flags g, i, m, s mean?",
      acceptedAnswer: { "@type": "Answer", text: "The g (global) flag finds all matches instead of stopping at the first. The i (case-insensitive) flag ignores letter case. The m (multiline) flag makes ^ and $ match the start and end of each line. The s (dotAll) flag makes . match newline characters as well. You can combine flags: /pattern/gim applies all three simultaneously." } },
    { "@type": "Question", name: "What is the difference between greedy and lazy matching?",
      acceptedAnswer: { "@type": "Answer", text: "Greedy quantifiers (*, +, ?) match as much text as possible. Lazy quantifiers (*?, +?, ??) match as little as possible. On '<a>text</a>', the greedy <.*> matches the entire string, while the lazy <.*?> matches only '<a>'. Use lazy matching when you want the shortest possible string between delimiters." } },
    { "@type": "Question", name: "How do named capture groups work?",
      acceptedAnswer: { "@type": "Answer", text: "Named capture groups use the syntax (?<name>pattern). For example, /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/ on '2025-01-15' creates groups year='2025', month='01', day='15'. In JavaScript you access them via match.groups.year. Named groups make complex patterns far more readable than numbered groups." } },
    { "@type": "Question", name: "What are lookahead and lookbehind assertions?",
      acceptedAnswer: { "@type": "Answer", text: "Lookahead (?=...) asserts that what follows matches a pattern without consuming characters. Negative lookahead (?!...) asserts it does not match. Lookbehind (?<=...) asserts what precedes matches. For example, /\\d+(?= dollars)/ matches a number only if followed by ' dollars'. Lookarounds enable context-dependent matching without including the context in the result." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",         item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",        item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Dev Tools",    item: "https://www.purstech.com/categories/dev" },
    { "@type": "ListItem", position: 4, name: "Regex Tester", item: "https://www.purstech.com/tools/regex-tester" },
  ],
};

export default function RegexTesterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <RegexTesterClient />
    </>
  );
}
