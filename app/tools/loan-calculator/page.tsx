import type { Metadata } from "next";
import LoanCalculatorClient from "./client";

export const metadata: Metadata = {
  title: "Free Loan Calculator — Amortization Calculator & Schedule",
  description: "Calculate your exact monthly loan payment, total interest and full amortization schedule. See how extra payments save you thousands. Free, instant, no login.",
  alternates: { canonical: "/tools/loan-calculator" },
  keywords: ["loan calculator","loan payment calculator","amortization calculator","car loan calculator","auto loan calculator","personal loan calculator","interest calculator","calculate early payoff loan","apr calculator"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/loan-calculator",
    siteName: "PursTech",
    title: "Free Loan Calculator — Payment, Amortization & Interest",
    description: "Calculate loan payments, total interest and amortization schedule instantly. See the impact of extra payments. Compare two loans. Free, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Loan Calculator — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Loan Calculator — Monthly Payment & Amortization",
    description: "Monthly payment, total interest, full amortization schedule, extra payment simulator. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Loan Calculator", url: "https://www.purstech.com/tools/loan-calculator",
  description: "Free loan calculator with amortization schedule, extra payment simulator, loan comparison and CSV export. Uses the standard amortization formula for precise monthly payment calculation.",
  applicationCategory: "FinanceApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Monthly payment calculation using standard amortization formula",
    "Full amortization schedule showing every payment broken into principal and interest",
    "Extra payment simulator — see interest savings and months cut",
    "Loan A vs Loan B side-by-side comparison",
    "Principal vs interest cost breakdown bar chart",
    "Payoff date calculation",
    "Download amortization schedule as CSV",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Calculate a Loan Payment",
  description: "Use PursTech\'s free Loan Calculator to calculate monthly payments, total interest and amortization schedule instantly.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter loan details",
      text: "Input the loan amount, annual interest rate and term in years. Results update instantly as you type.",
      url: "https://www.purstech.com/tools/loan-calculator" },
    { "@type": "HowToStep", position: 2, name: "Simulate extra payments",
      text: "Enter any extra monthly amount to see exactly how much interest you save and how many months you cut from the loan.",
      url: "https://www.purstech.com/tools/loan-calculator" },
    { "@type": "HowToStep", position: 3, name: "Review the amortization schedule",
      text: "Expand the full schedule to see every monthly payment broken into principal and interest portions. Download as CSV for spreadsheet analysis.",
      url: "https://www.purstech.com/tools/loan-calculator" },
    { "@type": "HowToStep", position: 4, name: "Compare two loans",
      text: "Toggle comparison mode to enter a second loan and see a side-by-side breakdown of monthly payment, total interest and payoff date.",
      url: "https://www.purstech.com/tools/loan-calculator" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Can I use this for a car, auto or personal loan?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — this works for any fixed-rate amortizing loan: car and auto loans, personal loans, student loans, boat or RV loans. Enter the amount you are borrowing, the interest rate and the term, and you get the exact monthly payment and full schedule." } },
    { "@type": "Question", name: "How do I calculate paying off my loan early?",
      acceptedAnswer: { "@type": "Answer", text: "Use the extra-payment simulator: add any amount on top of your regular payment and the calculator shows an early payoff date, how many months you cut, and exactly how much interest you save — often thousands on a long loan." } },
    { "@type": "Question", name: "How is my monthly loan payment calculated?",
      acceptedAnswer: { "@type": "Answer", text: "Monthly loan payment uses the standard amortization formula: M = P x [r(1+r)^n] / [(1+r)^n - 1], where P is the principal, r is the monthly interest rate (annual rate divided by 12), and n is the number of payments. This ensures each payment covers the interest due that month plus a portion of the principal." } },
    { "@type": "Question", name: "What is an amortization schedule?",
      acceptedAnswer: { "@type": "Answer", text: "An amortization schedule is a complete table showing every payment over the life of your loan, broken down into principal and interest portions. Early payments are mostly interest — on a 30-year mortgage, over 70% of your first payment goes to interest. Over time the balance shifts, and your final payments are nearly all principal." } },
    { "@type": "Question", name: "How much can extra payments save me?",
      acceptedAnswer: { "@type": "Answer", text: "Extra payments can dramatically reduce total interest and shorten your loan term. On a $30,000 car loan at 7% over 60 months, paying an extra $100/month saves about $1,200 in interest and pays off the loan 11 months early. The earlier you make extra payments, the more you save because you reduce the principal that future interest is calculated on." } },
    { "@type": "Question", name: "What is the difference between APR and interest rate?",
      acceptedAnswer: { "@type": "Answer", text: "The interest rate is the base cost of borrowing. APR (Annual Percentage Rate) includes the interest rate plus additional fees (origination fees, points, mortgage insurance). APR is always equal to or higher than the interest rate. When comparing loans, always compare APRs — two loans with the same interest rate can have very different APRs if one has higher fees." } },
    { "@type": "Question", name: "Should I choose a shorter or longer loan term?",
      acceptedAnswer: { "@type": "Answer", text: "A shorter term means higher monthly payments but dramatically less total interest. A longer term means lower monthly payments but significantly more interest over the life of the loan. For example, a $20,000 loan at 6%: over 36 months you pay about $1,850 total interest; over 72 months you pay about $3,760. Use our comparison feature to see the trade-off side by side." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",            item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",           item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Finance Tools",   item: "https://www.purstech.com/categories/finance" },
    { "@type": "ListItem", position: 4, name: "Loan Calculator", item: "https://www.purstech.com/tools/loan-calculator" },
  ],
};

export default function LoanCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <LoanCalculatorClient />
    </>
  );
}
