import type { Metadata } from "next";
import AgeCalculatorClient from "./client";

// ─── STANDARD TOOL PAGE TEMPLATE ─────────────────────────────────────────────
// For each of the 50 tools, update: title, description, keywords, canonical,
// OG title/description, and all 4 schema objects.
// ─────────────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Age Calculator on a Specific Date — Chronological Age",

  description:
    "Free age calculator — find your exact chronological age in years, months and days, today or on any specific date. Works for adults and children. Total days, weeks, hours and next birthday countdown.",

  alternates: { canonical: "/tools/age-calculator" },

  keywords: [
    "age calculator", "chronological age calculator", "age calculator on specific date",
    "age calculator of child", "how old am i", "age difference calculator",
    "birthday calculator", "exact age calculator", "date of birth calculator",
  ],

  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/tools/age-calculator",
    siteName:    "PursTech",
    title:       "Free Age Calculator — Exact Age in Years, Months & Days",
    description: "Calculate your exact age instantly. Total days, weeks, hours, minutes and next birthday countdown. Free, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Age Calculator — PursTech" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Free Age Calculator — Exact Age in Years, Months & Days",
    description: "Instant age calculation. Total days, weeks, hours and birthday countdown. Free, no login.",
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
  name: "Age Calculator", url: "https://www.purstech.com/tools/age-calculator",
  description: "Calculate exact age in years, months and days. Shows total days, weeks, hours, minutes and next birthday countdown. Free, no login.",
  applicationCategory: "UtilityApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "Calculate exact age in years, months and days",
    "Next birthday countdown in days",
    "Day of the week you were born",
    "Total days, weeks, months, hours and minutes",
    "Custom date range calculation",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Calculate Age From a Date of Birth",
  description: "Use the free PursTech Age Calculator to find your exact age in years, months and days.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter Date of Birth",
      text: "Select your date of birth using the date picker. You can type it manually or use the calendar icon." },
    { "@type": "HowToStep", position: 2, name: "Choose Target Date",
      text: "By default the target is today. Change it to calculate age at any specific point in time." },
    { "@type": "HowToStep", position: 3, name: "View Your Results",
      text: "Click Calculate Age to see your exact age in years, months and days, plus total days, weeks, hours, minutes and next birthday countdown." },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is my chronological age?",
      acceptedAnswer: { "@type": "Answer", text: "Chronological age is simply the time that has passed since your birth — exactly what this calculator measures, in years, months and days. It is the figure used for school entry cut-offs, assessments and standardized testing paperwork." } },
    { "@type": "Question", name: "How do I calculate a child's age in years, months and days?",
      acceptedAnswer: { "@type": "Answer", text: "Enter the child's date of birth and you instantly get their exact age in the years-months-days format that school forms, pediatric visits and milestone trackers ask for — plus a countdown to the next birthday." } },
    { "@type": "Question", name: "How is my age calculated?",
      acceptedAnswer: { "@type": "Answer", text: "Your age is calculated by finding the difference between your date of birth and today's date (or a custom target date). The result accounts for leap years and exact month/day differences." } },
    { "@type": "Question", name: "What is the next birthday countdown for?",
      acceptedAnswer: { "@type": "Answer", text: "It shows exactly how many days are left until your next birthday — useful for planning parties, sending reminders or just satisfying curiosity." } },
    { "@type": "Question", name: "Can I calculate age between two custom dates?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — change the 'Calculate Age On' date to any date you choose. The tool calculates the exact difference in years, months and days between any two dates." } },
    { "@type": "Question", name: "How are months and days calculated exactly?",
      acceptedAnswer: { "@type": "Answer", text: "The tool calculates complete years first, then remaining complete months, then remaining days. This gives the most precise result rather than just dividing total days." } },
    { "@type": "Question", name: "What is the day of the week I was born?",
      acceptedAnswer: { "@type": "Answer", text: "Using the date you enter, the tool calculates which day of the week that date fell on using JavaScript's built-in Date object." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",           item: "https://www.purstech.com"                      },
    { "@type": "ListItem", position: 2, name: "Tools",          item: "https://www.purstech.com/tools"                },
    { "@type": "ListItem", position: 3, name: "Finance Tools",  item: "https://www.purstech.com/categories/finance"   },
    { "@type": "ListItem", position: 4, name: "Age Calculator", item: "https://www.purstech.com/tools/age-calculator" },
  ],
};

export default function AgeCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <AgeCalculatorClient />
    </>
  );
}
