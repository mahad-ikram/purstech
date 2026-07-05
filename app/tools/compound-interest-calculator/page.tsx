import type { Metadata } from "next";
import CompoundInterestClient from "./client";

export const metadata: Metadata = {
  title: "Free Compound Interest Calculator — Daily, Monthly & Yearly",

  description:
    "Free compound interest calculator with daily, monthly and yearly compounding, regular contributions and a year-by-year growth chart. See the future value of your savings or investment. Free, instant.",

  alternates: { canonical: "/tools/compound-interest-calculator" },

  keywords: [
    "compound interest calculator", "investment calculator",
    "compounding interest calculator", "interest calculator",
    "future value calculator", "savings calculator",
    "compound interest calculated daily", "compound interest formula",
    "high yield savings account calculator", "cagr calculator",
    "inflation adjusted returns", "investment growth chart",
  ],

  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/tools/compound-interest-calculator", // ✅ www
    siteName:    "PursTech",
    title:       "Free Compound Interest Calculator — Contributions & Growth Chart",
    description: "Calculate compound interest with contributions, multiple compounding frequencies and year-by-year growth. Inflation-adjusted real returns. Free and instant.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Compound Interest Calculator — PursTech" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Free Compound Interest Calculator — Growth Chart & Contributions",
    description: "See how your money grows with compound interest and regular contributions. CAGR, inflation-adjusted returns. Free.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  robots: { // ✅ Added
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// ─── WebApplication schema ─────────────────────────────────────────────────────
// ✅ Moved from client.tsx + SoftwareApplication → WebApplication + www URL

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Compound Interest Calculator",
  url:  "https://www.purstech.com/tools/compound-interest-calculator",
  description: "Free compound interest calculator with regular contributions, multiple compounding frequencies and year-by-year growth breakdown. Includes inflation-adjusted real returns and CAGR.",
  applicationCategory: "FinanceApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "Compound interest with 6 compounding frequencies (annually to daily)",
    "Regular contributions (monthly, quarterly, annually or none)",
    "Year-by-year growth breakdown table",
    "SVG stacked bar chart (contributions vs interest)",
    "Wealth breakdown progress bar",
    "CAGR (Compound Annual Growth Rate) calculation",
    "Inflation-adjusted real value calculation",
  ],
};

// ─── HowTo schema ─────────────────────────────────────────────────────────────
// 4 steps — matches the How to Use section in client.tsx

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Calculate Compound Interest Online",
  description: "Use PursTech's free Compound Interest Calculator to see how your money grows with compound interest and regular contributions.",
  totalTime: "PT2M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Set your principal and rate",
      text: "Enter your starting investment amount, the expected annual interest rate and your investment timeframe in years.",
      url: "https://www.purstech.com/tools/compound-interest-calculator" },
    { "@type": "HowToStep", position: 2, name: "Choose compounding frequency",
      text: "Select how often interest compounds — from annually to daily. More frequent compounding slightly increases returns.",
      url: "https://www.purstech.com/tools/compound-interest-calculator" },
    { "@type": "HowToStep", position: 3, name: "Add regular contributions",
      text: "Enter a monthly, quarterly or annual contribution to see how regular investing dramatically accelerates growth.",
      url: "https://www.purstech.com/tools/compound-interest-calculator" },
    { "@type": "HowToStep", position: 4, name: "Enable inflation adjustment",
      text: "Toggle inflation to see the real purchasing power of your future balance in today's dollars — important for retirement planning.",
      url: "https://www.purstech.com/tools/compound-interest-calculator" },
  ],
};

// ─── FAQPage schema ───────────────────────────────────────────────────────────
// ✅ Moved from client.tsx — must be server-rendered for crawlers

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is the compound interest formula?",
      acceptedAnswer: { "@type": "Answer", text: "A = P(1 + r/n)^(nt), where P is your starting principal, r is the annual rate as a decimal, n is how many times interest compounds per year, and t is the number of years. When you add regular contributions, each deposit grows by the same formula for its remaining time — the calculator handles all of that instantly." } },
    { "@type": "Question", name: "Is interest compounded daily better than monthly?",
      acceptedAnswer: { "@type": "Answer", text: "Slightly, yes — at the same rate, compound interest calculated daily grows a little faster than monthly or yearly because interest starts earning interest sooner. Switch the compounding frequency here (daily, monthly, quarterly, semi-annually or annually) to see the exact difference on your numbers." } },
    { "@type": "Question", name: "Can I use this as a savings account (HYSA) calculator?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — enter your balance as the principal, your APY as the rate, set compounding to daily or monthly (most high-yield savings accounts compound daily), and add your monthly deposit as a contribution. The growth chart shows exactly what your savings account will be worth." } },
    { "@type": "Question", name: "What is the difference between simple and compound interest?",
      acceptedAnswer: { "@type": "Answer", text: "Simple interest is calculated only on the original principal. Compound interest is calculated on the principal plus all previously earned interest — meaning your earnings generate their own earnings. Over long periods the difference is enormous: $10,000 at 8% simple interest for 30 years grows to $34,000; with compound interest it grows to over $100,000." } },
    { "@type": "Question", name: "How does compounding frequency affect my returns?",
      acceptedAnswer: { "@type": "Answer", text: "More frequent compounding means slightly higher returns, because each compounding period your interest is added to the principal and begins earning sooner. Daily vs annual compounding on $10,000 at 10% for 10 years: annual gives $25,937; daily gives $27,179 — about 5% more. What matters far more is the interest rate and how long you stay invested." } },
    { "@type": "Question", name: "What are regular contributions and why do they matter?",
      acceptedAnswer: { "@type": "Answer", text: "Regular contributions are periodic additions to your investment — for example, investing $500 every month into an index fund. $10,000 invested once at 8% for 30 years grows to $100,626. The same $10,000 plus $200/month at 8% for 30 years grows to $370,422 — nearly 4× more, from just $200 extra per month." } },
    { "@type": "Question", name: "What is CAGR and how is it calculated?",
      acceptedAnswer: { "@type": "Answer", text: "CAGR (Compound Annual Growth Rate) is the rate at which an investment grows from its initial to final value as if it grew at a steady rate every year. Formula: CAGR = (End Value / Start Value)^(1/Years) - 1. An investment that grew from $1,000 to $3,000 in 10 years has a CAGR of 11.6%." } },
    { "@type": "Question", name: "How does inflation affect the real value of compound interest returns?",
      acceptedAnswer: { "@type": "Answer", text: "Inflation erodes purchasing power. If your investment earns 8% annually but inflation runs at 3%, your real return is approximately 5%. Our inflation-adjusted calculation shows the true purchasing power of your future wealth in today's dollars — for long-term planning, real returns matter more than nominal returns." } },
  ],
};

// ─── BreadcrumbList schema ────────────────────────────────────────────────────

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                        item: "https://www.purstech.com"                                              },
    { "@type": "ListItem", position: 2, name: "Tools",                       item: "https://www.purstech.com/tools"                                        },
    { "@type": "ListItem", position: 3, name: "Finance Tools",               item: "https://www.purstech.com/categories/finance"                           },
    { "@type": "ListItem", position: 4, name: "Compound Interest Calculator",item: "https://www.purstech.com/tools/compound-interest-calculator"            },
  ],
};

export default function CompoundInterestPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <CompoundInterestClient />
    </>
  );
}
