import type { Metadata } from "next";
import LoremIpsumClient from "./client";

export const metadata: Metadata = {
  title: "Lorem Ipsum Generator — Dolor Sit Amet Placeholder Text",
  description: "Generate placeholder lorem ipsum text by paragraphs, sentences or word count. Choose how many, toggle the classic opening phrase. Free, instant, no login.",
  alternates: { canonical: "/tools/lorem-ipsum" },
  keywords: ["lorem ipsum generator","lorem ipsum dolor sit amet","placeholder text","dummy text","lorem ipsum meaning","random text","lorem ipsum paragraphs","free lorem ipsum"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/lorem-ipsum",
    siteName: "PursTech",
    title: "Free Lorem Ipsum Generator Online — Paragraphs, Sentences & Words",
    description: "Generate placeholder lorem ipsum text instantly. Choose paragraphs, sentences or words, set the amount, copy or download. Free, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Lorem Ipsum Generator — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lorem Ipsum Generator — Placeholder Text",
    description: "Generate placeholder text by paragraphs, sentences or words. Free, instant.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Lorem Ipsum Generator", url: "https://www.purstech.com/tools/lorem-ipsum",
  description: "Free online lorem ipsum generator. Generate placeholder text by paragraphs, sentences or word count. Toggle the classic opening phrase, copy to clipboard or download as .txt.",
  applicationCategory: "WebApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "Generate by paragraphs (1–10), sentences (1–20) or words (1–500)",
    "Toggle classic Lorem ipsum opening phrase",
    "Word count and character count display",
    "Copy to clipboard in one click",
    "Download generated text as .txt file",
    "100% browser-based — no server required",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Generate Lorem Ipsum Text Online",
  description: "Use PursTech\'s free Lorem Ipsum Generator to create placeholder text instantly.",
  totalTime: "PT30S",
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose your format",
      text: "Select whether you want paragraphs (for body text), sentences (for captions) or words (for headings and labels).",
      url: "https://www.purstech.com/tools/lorem-ipsum" },
    { "@type": "HowToStep", position: 2, name: "Set the amount",
      text: "Drag the slider to choose how many paragraphs, sentences or words you need.",
      url: "https://www.purstech.com/tools/lorem-ipsum" },
    { "@type": "HowToStep", position: 3, name: "Generate, copy or download",
      text: "Click Generate and your lorem ipsum text appears instantly. Click Copy to use it in your design tool, or Download to save as a .txt file.",
      url: "https://www.purstech.com/tools/lorem-ipsum" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What does lorem ipsum dolor sit amet mean?",
      acceptedAnswer: { "@type": "Answer", text: "It is the famous opening of the scrambled Latin passage used as placeholder text, taken from Cicero's De Finibus (45 BC) — the original words 'dolorem ipsum' mean 'pain itself'. The scrambled version is deliberately meaningless, so viewers focus on your design instead of reading." } },
    { "@type": "Question", name: "What is Lorem Ipsum?",
      acceptedAnswer: { "@type": "Answer", text: "Lorem Ipsum is dummy placeholder text used in graphic design, publishing and web development. It has been the standard filler text since the 1500s, derived from a Latin work by Cicero." } },
    { "@type": "Question", name: "Why do designers use Lorem Ipsum?",
      acceptedAnswer: { "@type": "Answer", text: "It lets designers focus on layout and visual design without being distracted by the actual content. Readable but meaningless text prevents the eye from focusing on words rather than design." } },
    { "@type": "Question", name: "Is Lorem Ipsum real Latin?",
      acceptedAnswer: { "@type": "Answer", text: "It is derived from Latin but scrambled and altered so it reads as pseudo-Latin. It is not actually meaningful Latin prose." } },
    { "@type": "Question", name: "Can I use this text commercially?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Lorem Ipsum is placeholder text in the public domain. It can be used freely in any project — commercial or personal." } },
    { "@type": "Question", name: "What is the difference between paragraphs, sentences and words?",
      acceptedAnswer: { "@type": "Answer", text: "Paragraphs generate multiple sentences grouped together — ideal for body text. Sentences generate individual complete sentences for captions or subtitles. Words generate raw word sequences without punctuation, useful for heading and label placeholders." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                     item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",                    item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Text Tools",               item: "https://www.purstech.com/categories/text" },
    { "@type": "ListItem", position: 4, name: "Lorem Ipsum Generator",    item: "https://www.purstech.com/tools/lorem-ipsum" },
  ],
};

export default function LoremIpsumPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <LoremIpsumClient />
    </>
  );
}
