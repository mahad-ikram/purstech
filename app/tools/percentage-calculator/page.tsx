import type { Metadata } from "next";
import PercentageCalculatorClient from "./client";

export const metadata: Metadata = {
  title: "Free Percentage Calculator — 6 Calculation Modes",
  description: "Calculate percentages instantly with 6 modes: find a percentage of a number, what percent X is of Y, percentage change, percentage difference, and add or subtract a percentage. Free, no login.",
  alternates: { canonical: "/tools/percentage-calculator" },
  keywords: ["percentage calculator","percent calculator online","percentage change calculator","percentage difference calculator","what percent is x of y"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/percentage-calculator",
    siteName: "PursTech",
    title: "Free Percentage Calculator — 6 Modes, Instant Results",
    description: "6 percentage modes: find %, what % is X of Y, change, difference, add/subtract. History of last 10 calculations. Free.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Percentage Calculator — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Percentage Calculator — 6 Calculation Modes",
    description: "Percentage of a number, change, difference, add/subtract. 6 modes. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Percentage Calculator", url: "https://www.purstech.com/tools/percentage-calculator",
  description: "Free percentage calculator with 6 modes: percentage of a number, what percent X is of Y, percentage change (increase/decrease), percentage difference, add a percentage, subtract a percentage. Color-coded results and calculation history.",
  applicationCategory: "FinanceApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "% of a Number: what is X% of Y",
    "What % Is X of Y: find the percentage",
    "% Change: percentage increase or decrease with color coding",
    "% Difference: between two equal measurements",
    "Add %: increase a number by a percentage",
    "Subtract %: decrease a number by a percentage",
    "Last 10 calculations history",
    "Copy result to clipboard",
    "Enter key support for fast calculations",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Use the Percentage Calculator",
  description: "Use PursTech's free Percentage Calculator to calculate percentages in 6 different ways instantly.",
  totalTime: "PT30S",
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose a calculation mode",
      text: "Pick from 6 modes: find a percentage of a number, what percentage X is of Y, percentage change, percentage difference, or add/subtract a percentage.",
      url: "https://www.purstech.com/tools/percentage-calculator" },
    { "@type": "HowToStep", position: 2, name: "Enter your numbers",
      text: "Type in the two values for your chosen mode. Press Enter or click Calculate for the result.",
      url: "https://www.purstech.com/tools/percentage-calculator" },
    { "@type": "HowToStep", position: 3, name: "See and copy the result",
      text: "Your answer appears instantly, colour-coded for increases (green) and decreases (red). Click Copy to copy the result. Your last 10 calculations are saved in history.",
      url: "https://www.purstech.com/tools/percentage-calculator" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I calculate what percentage one number is of another?",
      acceptedAnswer: { "@type": "Answer", text: "Divide the part by the whole and multiply by 100. For example, 30 out of 150 = (30 ÷ 150) × 100 = 20%." } },
    { "@type": "Question", name: "How do I find a percentage of a number?",
      acceptedAnswer: { "@type": "Answer", text: "Multiply the number by the percentage divided by 100. For example, 15% of 200 = 200 × (15 ÷ 100) = 30." } },
    { "@type": "Question", name: "What is percentage change?",
      acceptedAnswer: { "@type": "Answer", text: "Percentage change measures how much a value has increased or decreased relative to its original value. Formula: ((New − Old) ÷ Old) × 100. A positive result is an increase, negative is a decrease." } },
    { "@type": "Question", name: "What is percentage difference?",
      acceptedAnswer: { "@type": "Answer", text: "Percentage difference compares two values without a defined 'before' and 'after'. Formula: |A − B| ÷ ((A + B) ÷ 2) × 100. Useful for comparing two equal measurements." } },
    { "@type": "Question", name: "How do I reverse a percentage?",
      acceptedAnswer: { "@type": "Answer", text: "To find the original value before a percentage was applied, divide the current value by (1 + percentage/100) for an increase, or (1 − percentage/100) for a decrease." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                     item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",                    item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Finance Tools",            item: "https://www.purstech.com/categories/finance" },
    { "@type": "ListItem", position: 4, name: "Percentage Calculator",    item: "https://www.purstech.com/tools/percentage-calculator" },
  ],
};

export default function PercentageCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <PercentageCalculatorClient />
    </>
  );
}
