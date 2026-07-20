import type { Metadata } from "next";
import MortgageCalculatorClient from "./client";

export const metadata: Metadata = {
  title: "Free Mortgage Payment Calculator — PITI, PMI & Amortization",
  description: "Calculate your full monthly mortgage payment including principal, interest, property tax, insurance, HOA and PMI. Affordability checker, amortization schedule and rent vs buy comparison.",
  alternates: { canonical: "/tools/mortgage-calculator" },
  keywords: ["mortgage calculator","mortgage payment calculator","mortgage amortization calculator","mortgage calculator with taxes and insurance","pmi calculator","home loan calculator","how much house can i afford calculator","rent vs buy calculator"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/mortgage-calculator",
    siteName: "PursTech",
    title: "Free Mortgage Calculator — Full PITI Payment & PMI",
    description: "Full mortgage payment with tax, insurance, HOA and PMI. Affordability checker and amortization schedule. Free.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Mortgage Calculator — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Mortgage Calculator — PITI, PMI & Amortization",
    description: "Full PITI mortgage payment, affordability checker, amortization, rent vs buy. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebPage",
  name: "Mortgage Calculator", url: "https://www.purstech.com/tools/mortgage-calculator",
  description: "Free mortgage calculator with full PITI breakdown, PMI calculation and removal tracking, affordability checker (28/36 rule), annual amortization schedule and 5-year rent vs buy comparison.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Full PITI payment: Principal, Interest, Property Tax, Insurance, HOA and PMI",
    "PMI removal month calculator",
    "Affordability checker based on 28/36 DTI rule",
    "Annual amortization schedule with CSV download",
    "5-year rent vs buy financial comparison",
    "Down payment slider with PMI warning at under 20%",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Calculate Mortgage Payments",
  description: "Use PursTech's free Mortgage Calculator to calculate your complete monthly payment instantly.",
  totalTime: "PT2M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter home and loan details",
      text: "Input the home price, interest rate, loan term and down payment. The down payment slider shows the PMI warning if below 20%.",
      url: "https://www.purstech.com/tools/mortgage-calculator" },
    { "@type": "HowToStep", position: 2, name: "Review the full PITI breakdown",
      text: "See your complete monthly payment split into Principal & Interest, Property Tax, Insurance, HOA and PMI with a bar chart for each component.",
      url: "https://www.purstech.com/tools/mortgage-calculator" },
    { "@type": "HowToStep", position: 3, name: "Check affordability",
      text: "Switch to the Affordability tab, enter your income and existing debts to see the maximum home price you can afford based on the 28/36 DTI rule.",
      url: "https://www.purstech.com/tools/mortgage-calculator" },
    { "@type": "HowToStep", position: 4, name: "Compare rent vs buy",
      text: "Switch to the Rent vs Buy tab and enter your current rent to see a 5-year financial comparison of buying vs continuing to rent.",
      url: "https://www.purstech.com/tools/mortgage-calculator" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Does this mortgage calculator include taxes and insurance?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — it calculates your full PITI payment: principal, interest, property tax and homeowners insurance, plus HOA fees and PMI if your down payment is under 20%. That is the real monthly number, not just principal and interest." } },
    { "@type": "Question", name: "How much is PMI per month?",
      acceptedAnswer: { "@type": "Answer", text: "PMI typically costs about 0.3% to 1.5% of the loan amount per year, split into monthly payments — roughly $75 to $375 a month on a $300,000 loan. The calculator estimates your PMI and shows the exact month it can be removed once you reach 20% equity." } },
    { "@type": "Question", name: "Can I calculate a mortgage recast?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, approximately: a recast re-amortizes your remaining balance after a lump-sum payment, over the remaining term at the same rate. Enter your post-lump-sum balance as the loan amount, your remaining years as the term, and your current rate — the monthly payment shown is your recast payment." } },
    { "@type": "Question", name: "What does PITI stand for and why does it matter?",
      acceptedAnswer: { "@type": "Answer", text: "PITI stands for Principal, Interest, Taxes, and Insurance — the four components of a full monthly mortgage payment. Knowing your full PITI payment is critical for accurate budgeting, as taxes and insurance can add $300-$1,000+ per month to your payment beyond the principal and interest." } },
    { "@type": "Question", name: "What is PMI and when can I remove it?",
      acceptedAnswer: { "@type": "Answer", text: "PMI (Private Mortgage Insurance) is required when your down payment is less than 20%. It typically costs 0.5%-1.5% of the loan amount per year. Under the Homeowners Protection Act, lenders must automatically cancel PMI when your balance reaches 78% of the original purchase price." } },
    { "@type": "Question", name: "How much house can I afford?",
      acceptedAnswer: { "@type": "Answer", text: "A common rule is that your total housing payment (PITI) should not exceed 28% of your gross monthly income, and total debt payments should not exceed 36% (the 28/36 rule). Use our affordability tab — enter your income and we calculate the maximum home price you can afford." } },
    { "@type": "Question", name: "How does down payment size affect my mortgage?",
      acceptedAnswer: { "@type": "Answer", text: "A larger down payment reduces your loan amount, lowers monthly payments, and eliminates PMI once you reach 20%. It also reduces total interest paid over the life of the loan. Use the calculator to compare different down payment scenarios." } },
    { "@type": "Question", name: "Should I rent or buy?",
      acceptedAnswer: { "@type": "Answer", text: "Buying generally makes more financial sense if you plan to stay 5+ years, as appreciation and equity accumulation offset the higher initial costs. Renting is better for flexibility or in overpriced markets. Our rent vs buy tab provides a 5-year financial comparison." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                 item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",                item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Finance Tools",        item: "https://www.purstech.com/categories/finance" },
    { "@type": "ListItem", position: 4, name: "Mortgage Calculator",  item: "https://www.purstech.com/tools/mortgage-calculator" },
  ],
};

export default function MortgageCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <MortgageCalculatorClient />
    </>
  );
}