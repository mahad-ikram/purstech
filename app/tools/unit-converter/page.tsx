import type { Metadata } from "next";
import UnitConverterClient from "./client";

export const metadata: Metadata = {
  title: "Free Unit Converter — Length, Weight, Temperature & More",
  description: "Convert between length, weight, temperature, volume, area, speed, time and digital storage instantly. 8 categories, 50+ units, metric and imperial. Free, no login.",
  alternates: { canonical: "/tools/unit-converter" },
  keywords: ["unit converter","length converter","weight converter","temperature converter","metric to imperial","unit conversion calculator","cm to inches","kg to lbs","celsius to fahrenheit"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/unit-converter",
    siteName: "PursTech",
    title: "Free Unit Converter — Length, Weight, Temperature & More",
    description: "Instant unit conversion across 8 categories and 50+ units. Metric, imperial, all results at once. Free.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Unit Converter — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Unit Converter — 8 Categories, 50+ Units",
    description: "Length, weight, temperature, volume, area, speed, time, digital storage. Instant, free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Unit Converter", url: "https://www.purstech.com/tools/unit-converter",
  description: "Free unit converter with 8 categories and 50+ units. Converts length, weight/mass, temperature, volume, area, speed, time and digital storage instantly.",
  applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "8 unit categories: length, weight, temperature, volume, area, speed, time, digital storage",
    "50+ units including metric and imperial",
    "All-conversions table — see every unit at once",
    "Swap button to reverse conversion instantly",
    "Copy result to clipboard",
    "Formula display",
    "Temperature offset conversions (Celsius, Fahrenheit, Kelvin)",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Convert Units Online",
  description: "Use PursTech's free Unit Converter to convert between any units instantly.",
  totalTime: "PT15S",
  step: [
    { "@type": "HowToStep", position: 1, name: "Select a category",
      text: "Click a category tab — Length, Weight, Temperature, Volume, Area, Speed, Time or Digital Storage.",
      url: "https://www.purstech.com/tools/unit-converter" },
    { "@type": "HowToStep", position: 2, name: "Enter your value and choose units",
      text: "Type your number, choose the unit you are converting from, and select the target unit.",
      url: "https://www.purstech.com/tools/unit-converter" },
    { "@type": "HowToStep", position: 3, name: "Read the result",
      text: "Your result appears instantly. The full table below shows your value converted into every unit in that category simultaneously.",
      url: "https://www.purstech.com/tools/unit-converter" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How does the unit converter work?",
      acceptedAnswer: { "@type": "Answer", text: "Every unit is stored with its conversion factor to a base unit. When you convert, the tool first converts your input to the base unit, then from the base unit to your target unit. This allows any unit to be converted to any other with a single calculation." } },
    { "@type": "Question", name: "How accurate are the conversions?",
      acceptedAnswer: { "@type": "Answer", text: "All conversions use precise scientific conversion factors. Results are displayed to up to 8 significant figures to minimise rounding errors." } },
    { "@type": "Question", name: "What categories of units are supported?",
      acceptedAnswer: { "@type": "Answer", text: "Length, weight/mass, temperature, volume, area, speed, time and digital storage — covering the most common unit conversions needed in daily and professional use." } },
    { "@type": "Question", name: "Why is temperature conversion different from other units?",
      acceptedAnswer: { "@type": "Answer", text: "Unlike other units, temperature conversions require an offset calculation (adding or subtracting a constant), not just multiplication. Celsius, Fahrenheit and Kelvin all use different formulas." } },
    { "@type": "Question", name: "Can I convert between metric and imperial units?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — all conversions work between metric and imperial systems. For example: kilometres to miles, kilograms to pounds, litres to gallons, centimetres to inches and more." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",           item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",          item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Math Tools",     item: "https://www.purstech.com/categories/math" },
    { "@type": "ListItem", position: 4, name: "Unit Converter", item: "https://www.purstech.com/tools/unit-converter" },
  ],
};

export default function UnitConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <UnitConverterClient>
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl flex-shrink-0">📏</span>
            <div>
              <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-2">
                Math Tools
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">Unit Converter</h1>
              <p className="text-gray-500 mt-2 max-w-2xl leading-relaxed text-base">Convert between length, weight, temperature, volume, area, speed, time and more — instant results.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {["Free","No Login","8 Categories","50+ Units","Instant"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {b}</span>
            ))}
          </div>
        </div>
      </UnitConverterClient>
    </>
  );
}
