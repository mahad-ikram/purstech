import type { Metadata } from "next";
import BMIClient from "./client";

export const metadata: Metadata = {
  title: "Free BMI Calculator (kg & lbs) — Healthy Weight Range",

  description:
    "Calculate your Body Mass Index instantly. Free BMI calculator with healthy weight range, BMI Prime and category gauge.",

  alternates: { canonical: "/tools/bmi-calculator" },

  keywords: [
    "bmi calculator", "body mass index calculator", "bmi calculator women",
    "bmi calculator men", "calculate bmi in kilograms", "bmi chart",
    "how to calculate bmi", "healthy weight range", "bmi calculator metric",
  ],

  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/tools/bmi-calculator",
    siteName:    "PursTech",
    title:       "Free BMI Calculator — Healthy Weight Range & BMI Prime",
    description: "Instantly calculate your BMI with healthy weight range, BMI Prime and category gauge. Metric and imperial. Free, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "BMI Calculator — PursTech" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Free BMI Calculator — Healthy Weight Range",
    description: "Instant BMI with healthy weight range, BMI Prime, category gauge. Metric and imperial. Free.",
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
  name: "BMI Calculator", url: "https://www.purstech.com/tools/bmi-calculator",
  description: "Free online BMI calculator with healthy weight range, BMI Prime and colour-coded category gauge. Supports metric and imperial units.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "BMI calculation in metric (kg/cm) and imperial (lb/ft/in)",
    "BMI Prime calculation", "Healthy weight range in kg and lb",
    "Colour-coded BMI category gauge", "BMI categories reference table",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Calculate Your BMI", totalTime: "PT1M",
  description: "Use PursTech's free BMI Calculator to find your Body Mass Index and healthy weight range.",
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose Your Units",
      text: "Select Metric (kg and cm) or Imperial (pounds and feet/inches) — whichever you're most comfortable with.",
      url: "https://www.purstech.com/tools/bmi-calculator" },
    { "@type": "HowToStep", position: 2, name: "Enter Height and Weight",
      text: "Type your current weight and height. The inputs accept decimal values for precise results. Imperial mode splits height into feet and inches.",
      url: "https://www.purstech.com/tools/bmi-calculator" },
    { "@type": "HowToStep", position: 3, name: "Get Your Results",
      text: "Click Calculate to see your BMI score, category, BMI Prime, healthy weight range and where you sit on the full BMI scale gauge.",
      url: "https://www.purstech.com/tools/bmi-calculator" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is the BMI calculation different for women and men?",
      acceptedAnswer: { "@type": "Answer", text: "No — the standard adult BMI formula (weight divided by height squared, kg/m²) and the category ranges are identical for women and men. BMI does not account for differences in body composition, such as muscle versus fat, which is why it is a screening measure rather than a diagnosis." } },
    { "@type": "Question", name: "How do I calculate BMI in kilograms?",
      acceptedAnswer: { "@type": "Answer", text: "Switch the calculator to metric and enter your weight in kilograms and height in centimetres. The formula is weight ÷ height² using metres: for example, 70 kg at 175 cm is 70 ÷ 1.75² = 22.9 — inside the healthy range." } },
    { "@type": "Question", name: "What is BMI?",
      acceptedAnswer: { "@type": "Answer", text: "Body Mass Index (BMI) is a simple calculation using height and weight to estimate body fat levels. It is used as a screening tool to identify potential weight-related health issues." } },
    { "@type": "Question", name: "What is a healthy BMI range?",
      acceptedAnswer: { "@type": "Answer", text: "For most adults, a BMI between 18.5 and 24.9 is considered healthy. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above is considered obese." } },
    { "@type": "Question", name: "Is BMI accurate?",
      acceptedAnswer: { "@type": "Answer", text: "BMI is a useful general screening tool but has limitations. It does not account for muscle mass, bone density, age, sex or ethnicity. Athletes with high muscle mass may have a high BMI without excess fat." } },
    { "@type": "Question", name: "How is BMI calculated?",
      acceptedAnswer: { "@type": "Answer", text: "BMI = weight (kg) ÷ height (m)². In imperial units: BMI = (weight in lbs × 703) ÷ height in inches². The PursTech calculator handles both automatically." } },
    { "@type": "Question", name: "What is BMI Prime?",
      acceptedAnswer: { "@type": "Answer", text: "BMI Prime is your BMI divided by 25 (the upper limit of healthy BMI). A value below 1.0 is in the healthy range, above 1.0 is overweight. It makes it easy to see how far from healthy your BMI is." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",           item: "https://www.purstech.com"                       },
    { "@type": "ListItem", position: 2, name: "Tools",          item: "https://www.purstech.com/tools"                 },
    { "@type": "ListItem", position: 3, name: "Finance Tools",  item: "https://www.purstech.com/categories/finance"    },
    { "@type": "ListItem", position: 4, name: "BMI Calculator", item: "https://www.purstech.com/tools/bmi-calculator"  },
  ],
};

export default function BMICalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <BMIClient />
    </>
  );
}
