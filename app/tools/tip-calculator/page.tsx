import type { Metadata } from "next";
import TipCalculatorClient from "./client";

export const metadata: Metadata = {
  title: "Free Tip Calculator & Bill Splitter — Per Person",
  description: "Calculate tip and split a restaurant bill in seconds. Set custom tip %, split among any number of people, add tax, and get per-person totals with rounding options. Free, instant.",
  alternates: { canonical: "/tools/tip-calculator" },
  keywords: ["tip calculator","split bill calculator","restaurant tip calculator","how much to tip","tip split calculator","bill splitter"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/tip-calculator",
    siteName: "PursTech",
    title: "Free Tip Calculator & Bill Splitter — Per Person",
    description: "Calculate tip and split bills instantly. Custom tip %, any number of people, tax, rounding. Free.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Tip Calculator — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Tip Calculator & Bill Splitter",
    description: "Custom tip %, itemized split, tax, per-person totals and rounding. Free, instant.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Tip Calculator", url: "https://www.purstech.com/tools/tip-calculator",
  description: "Free tip calculator with bill splitting, custom tip percentage, tax, service presets, itemized per-person splits, round-up and copy summary.",
  applicationCategory: "FinanceApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "8 service type presets (restaurant, delivery, taxi, salon, hotel, bar, coffee, movers)",
    "Quick tip buttons: 10%, 15%, 18%, 20%, 25%, 30%",
    "Custom tip percentage input",
    "Tip quality label (Below average / Standard / Good / Generous)",
    "Split evenly among any number of people",
    "Itemized split — enter individual amounts per person",
    "Tax rate input — tip on pre-tax or post-tax",
    "Round-up per person for easy cash payments",
    "Copy bill summary to clipboard for group messaging",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Calculate Tip and Split a Bill",
  description: "Use PursTech's free Tip Calculator to get per-person totals in seconds.",
  totalTime: "PT30S",
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose service type",
      text: "Select the type of service from the presets — restaurant, delivery, taxi and others. This sets the suggested tip percentage automatically.",
      url: "https://www.purstech.com/tools/tip-calculator" },
    { "@type": "HowToStep", position: 2, name: "Enter bill and adjust tip",
      text: "Enter your bill total. Use the quick tip buttons or type a custom percentage. The tip quality label shows whether your tip is standard, good or generous.",
      url: "https://www.purstech.com/tools/tip-calculator" },
    { "@type": "HowToStep", position: 3, name: "Set the split mode",
      text: "Choose even split and enter the number of people, or switch to itemized split to enter what each person ordered individually.",
      url: "https://www.purstech.com/tools/tip-calculator" },
    { "@type": "HowToStep", position: 4, name: "Copy or round up",
      text: "Toggle round-up for easier cash payments, then use Copy Summary to share exact amounts with your group.",
      url: "https://www.purstech.com/tools/tip-calculator" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How much should I tip at a restaurant?",
      acceptedAnswer: { "@type": "Answer", text: "Standard tipping in the US: 15% for adequate service, 18% for good service, 20% for excellent service, 25%+ for exceptional service. Fine dining: 20% minimum. Quick-service counters: 10–15% or nothing is acceptable. The tip is traditionally calculated on the pre-tax amount, though many tip on the full total for convenience." } },
    { "@type": "Question", name: "Should I tip on the pre-tax or post-tax amount?",
      acceptedAnswer: { "@type": "Answer", text: "Etiquette traditionally says tip on the pre-tax amount. However, the difference is small and most diners tip on the full post-tax total for convenience. Our calculator lets you choose which amount you tip on." } },
    { "@type": "Question", name: "How do I split a bill unevenly when people ordered different amounts?",
      acceptedAnswer: { "@type": "Answer", text: "Use the Itemized Split mode. Enter what each person ordered and the tip and tax percentages are applied proportionally to each person's share, giving everyone their accurate total." } },
    { "@type": "Question", name: "What are tip amounts for services other than restaurants?",
      acceptedAnswer: { "@type": "Answer", text: "Taxi/rideshare: 15–20%. Hotel housekeeping: $2–5/night. Hair salon/barber: 15–20%. Food delivery: $3–5 or 10–15%. Coffee shop counter: not required, $1 is appreciated. Movers: $20–50 per person for a full day." } },
    { "@type": "Question", name: "What does 'round up per person' mean?",
      acceptedAnswer: { "@type": "Answer", text: "Rounding up rounds each person's share up to the nearest dollar, making it easier to collect cash payments. The calculator shows both the exact and rounded amounts so you can choose which to use." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",           item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",          item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Finance Tools",  item: "https://www.purstech.com/categories/finance" },
    { "@type": "ListItem", position: 4, name: "Tip Calculator", item: "https://www.purstech.com/tools/tip-calculator" },
  ],
};

export default function TipCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <TipCalculatorClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            Finance Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Tip Calculator — Split Bill &amp; Per Person Amount
          </h1>
          <p className="text-gray-400 max-w-2xl leading-relaxed">
            Calculate the perfect tip and split a bill between any number of people. Supports custom tip %, tax, uneven itemized splits, and rounding — for any service type.
          </p>
        </div>
      </TipCalculatorClient>
    </>
  );
}
