import type { Metadata } from "next";
import CurrencyConverterClient from "./client";

export const metadata: Metadata = {
  title: "Free Currency Converter — USD, EUR & 30+ Currencies",

  description:
    "Convert between 30+ world currencies with reference exchange rates. Free currency converter — instant results, popular pairs and all-currency table. No login.",

  alternates: { canonical: "/tools/currency-converter" },

  keywords: [
    "currency converter", "euro to dollar", "euros to dollars",
    "cad to usd", "eur to usd", "money converter",
    "exchange rate calculator", "free currency converter",
  ],

  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/tools/currency-converter",
    siteName:    "PursTech",
    title:       "Free Currency Converter — Popular Pairs & 30+ Currencies",
    description: "Convert between 30+ currencies instantly. Popular pairs, all-currency table and reference rates. Free, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Currency Converter — PursTech" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Free Currency Converter — 30+ World Currencies",
    description: "Instant currency conversion. 30+ currencies, popular pairs, all-currency table. Free.",
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
  "@context": "https://schema.org", "@type": "WebPage",
  name: "Currency Converter", url: "https://www.purstech.com/tools/currency-converter",
  description: "Free online currency converter supporting 30+ world currencies. Instant conversion with reference rates, popular currency pairs and a full all-currencies table.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Convert between 30+ world currencies",
    "Instant conversion as you type",
    "Popular currency pairs (USD/EUR, USD/GBP, USD/JPY etc.)",
    "All-currencies comparison table",
    "Swap currencies with one click",
    "Reference exchange rates with mid-market note",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Convert Currency Online",
  description: "Use PursTech's free Currency Converter to convert between 30+ world currencies instantly.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter an Amount",
      text: "Type the amount you want to convert in the top input field. The result updates automatically as you type.",
      url: "https://www.purstech.com/tools/currency-converter" },
    { "@type": "HowToStep", position: 2, name: "Select Currencies",
      text: "Choose your source currency from the top dropdown and your target currency from the bottom dropdown. Hit the swap button to reverse them instantly.",
      url: "https://www.purstech.com/tools/currency-converter" },
    { "@type": "HowToStep", position: 3, name: "See All Rates",
      text: "The table below shows your amount converted into every supported currency at once. Click any row to set it as your target currency.",
      url: "https://www.purstech.com/tools/currency-converter" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I convert euros to dollars (or yen to USD)?",
      acceptedAnswer: { "@type": "Answer", text: "Pick the pair — EUR to USD, JPY to USD, CAD to USD or any of the 30+ currencies — and type any amount: 10, 50, 100 or 1000. The converted value appears instantly at the reference mid-market rate, and the swap button reverses the direction in one click." } },
    { "@type": "Question", name: "Are the exchange rates live?",
      acceptedAnswer: { "@type": "Answer", text: "The rates shown are indicative reference rates updated periodically. For financial transactions always verify with your bank or a regulated exchange service as rates fluctuate constantly." } },
    { "@type": "Question", name: "How many currencies are supported?",
      acceptedAnswer: { "@type": "Answer", text: "We support over 30 of the world's most commonly traded currencies covering every major economy and region." } },
    { "@type": "Question", name: "What is a base currency?",
      acceptedAnswer: { "@type": "Answer", text: "The base currency is the currency you are converting from. All other currencies are expressed as how much one unit of the base currency buys." } },
    { "@type": "Question", name: "What is the mid-market rate?",
      acceptedAnswer: { "@type": "Answer", text: "The mid-market rate (also called the interbank rate) is the midpoint between buy and sell prices. Banks and exchange services add a margin on top of this rate — the gap is their profit." } },
    { "@type": "Question", name: "Can I use this for business transactions?",
      acceptedAnswer: { "@type": "Answer", text: "This tool is for informational purposes only. For business transactions, payroll or large transfers, always use a regulated financial institution or FX service." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",               item: "https://www.purstech.com"                             },
    { "@type": "ListItem", position: 2, name: "Tools",              item: "https://www.purstech.com/tools"                       },
    { "@type": "ListItem", position: 3, name: "Finance Tools",      item: "https://www.purstech.com/categories/finance"          },
    { "@type": "ListItem", position: 4, name: "Currency Converter", item: "https://www.purstech.com/tools/currency-converter"    },
  ],
};

export default function CurrencyConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <CurrencyConverterClient />
    </>
  );
}
