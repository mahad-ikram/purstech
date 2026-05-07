import type { Metadata } from "next";
import LoanCalculatorClient from "./client";

export const metadata: Metadata = {
  title:       "Free Advanced Loan Calculator with Amortization Schedule | PursTech",
  description: "Calculate your monthly loan payments, total interest, and payoff date. Includes extra payment simulator and full amortization schedule export. 100% free.",
  keywords: [
    "loan calculator", "amortization schedule calculator", "loan payoff calculator", 
    "extra payment loan calculator", "auto loan calculator", "personal loan calculator", 
    "monthly payment calculator", "interest calculator"
  ],
  openGraph: {
    type:        "website",
    title:       "Advanced Loan Calculator with Amortization | PursTech",
    description: "Calculate monthly payments and see how extra payments save you money and shorten your loan term.",
    url:         "https://purstech.com/tools/loan-calculator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Loan Calculator" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Advanced Loan Calculator | PursTech",
    description: "Calculate payments, visualize interest vs principal, and export your amortization schedule.",
    images:      ["/og-image.png"],
  },
  alternates: { canonical: "/tools/loan-calculator" },
  robots:      "index, follow",
};

const toolSchema = {
  "@context":          "https://schema.org",
  "@type":             "SoftwareApplication",
  name:                "Advanced Loan Calculator",
  description:         "Calculate loan payments, total interest, and generate an amortization schedule with extra payment simulations.",
  url:                 "https://purstech.com/tools/loan-calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem:     "Any",
  featureList: [
    "Calculate monthly loan payments",
    "Extra monthly payment simulator",
    "Full amortization schedule generation",
    "Principal vs Interest visualizer",
    "CSV export for loan schedules"
  ],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumbSchema = {
  "@context":         "https://schema.org",
  "@type":            "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",         item: "https://purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Loan Calculator", item: "https://purstech.com/tools/loan-calculator" },
  ],
};

export default function LoanCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <LoanCalculatorClient />
    </>
  );
}
