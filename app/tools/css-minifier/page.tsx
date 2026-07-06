import type { Metadata } from "next";
import CSSMinifierClient from "./client";

export const metadata: Metadata = {
  // Renders: "Free CSS Minifier Online | PursTech" (36 chars ✅)
  title: "Free CSS Minifier — Compress CSS Online",

  description:
    "Minify CSS online to reduce file size and speed up page loads. Free CSS minifier — removes comments, whitespace and redundant characters. Instant results, no login.",

  alternates: { canonical: "/tools/css-minifier" },

  keywords: ["css minifier", "minify css", "compress css", "css compressor", "css optimizer", "reduce css file size"],

  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/tools/css-minifier",
    siteName:    "PursTech",
    title:       "Free CSS Minifier Online — Reduce CSS File Size Instantly",
    description: "Minify CSS instantly. Removes comments, whitespace and redundant characters. Shows size savings. Free, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "CSS Minifier — PursTech" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Free CSS Minifier Online",
    description: "Minify CSS instantly — remove comments, whitespace, show size savings. Free, no login.",
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
  name: "CSS Minifier", url: "https://www.purstech.com/tools/css-minifier",
  description: "Free online CSS minifier. Removes comments, whitespace, newlines and redundant characters from CSS. Shows original size, minified size and savings percentage.",
  applicationCategory: "DeveloperApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "Removes CSS comments (/* ... */)",
    "Removes whitespace, newlines and tabs",
    "Removes spaces around { } : ; and ,",
    "Removes last semicolons in blocks",
    "Shows original size, minified size and savings percentage",
    "Download minified CSS as .css file",
    "Load sample CSS for demonstration",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Minify CSS Online",
  description: "Use PursTech's free CSS Minifier to reduce CSS file size instantly.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Paste Your CSS",
      text: "Copy your CSS from your editor or stylesheet and paste it into the input box. Click Load Sample to see an example.",
      url: "https://www.purstech.com/tools/css-minifier" },
    { "@type": "HowToStep", position: 2, name: "Click Minify",
      text: "Click the Minify CSS button. Comments, whitespace and unnecessary characters are removed instantly.",
      url: "https://www.purstech.com/tools/css-minifier" },
    { "@type": "HowToStep", position: 3, name: "Copy or Download",
      text: "Copy the minified output to clipboard or download it as a .css file. The size saving percentage is shown — typically 20–40%.",
      url: "https://www.purstech.com/tools/css-minifier" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the difference between minifying and gzip compression?",
      acceptedAnswer: { "@type": "Answer", text: "Minification permanently deletes unneeded characters from the file itself; gzip or brotli compress it during transfer and the browser unpacks it. They stack — minify first, then let your server gzip the result. The savings percentage shown here is before gzip." } },
    { "@type": "Question", name: "What is CSS minification?",
      acceptedAnswer: { "@type": "Answer", text: "CSS minification removes all unnecessary characters from CSS code without changing its functionality — whitespace, comments, newlines and redundant semicolons are stripped. The result is a smaller file that loads faster." } },
    { "@type": "Question", name: "How much smaller will my CSS get?",
      acceptedAnswer: { "@type": "Answer", text: "Typical CSS files see a 20–40% size reduction after minification. Files with many comments and consistent formatting see the largest improvements." } },
    { "@type": "Question", name: "Does minification change how my CSS works?",
      acceptedAnswer: { "@type": "Answer", text: "No. Minification is purely cosmetic — it removes whitespace and comments that browsers ignore anyway. The rendered output of your website is identical." } },
    { "@type": "Question", name: "Should I minify CSS in production?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — always minify CSS for production. Smaller files mean faster downloads, better Core Web Vitals scores, and improved SEO rankings. Most build tools like Webpack, Vite and Parcel do this automatically." } },
    { "@type": "Question", name: "Can I reverse minified CSS?",
      acceptedAnswer: { "@type": "Answer", text: "Not perfectly — comments and original formatting are lost forever. You should always keep your original unminified source files and minify as a build step." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",         item: "https://www.purstech.com"                    },
    { "@type": "ListItem", position: 2, name: "Tools",        item: "https://www.purstech.com/tools"              },
    { "@type": "ListItem", position: 3, name: "Dev Tools",    item: "https://www.purstech.com/categories/dev"     },
    { "@type": "ListItem", position: 4, name: "CSS Minifier", item: "https://www.purstech.com/tools/css-minifier" },
  ],
};

export default function CSSMinifierPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <CSSMinifierClient />
    </>
  );
}
