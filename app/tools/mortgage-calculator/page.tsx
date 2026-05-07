import type { Metadata } from "next";
import MortgageCalculatorClient from "./client";

export const metadata: Metadata = {
  title:       "Free Mortgage Calculator — Monthly Payment, PITI & Amortization | PursTech",
  description: "Calculate your full monthly mortgage payment including principal, interest, property tax, insurance, HOA and PMI. Affordability checker, amortization schedule and rent vs buy comparison.",
  keywords:    ["mortgage calculator","monthly mortgage payment","piti calculator","mortgage affordability calculator","home loan calculator","rent vs buy calculator"],
  openGraph: {
    title:       "Free Mortgage Calculator — Full PITI Payment | PursTech",
    description: "Full mortgage payment with tax, insurance, HOA and PMI. Affordability checker and amortization schedule. Free.",
    url:         "https://purstech.com/tools/mortgage-calculator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free Mortgage Calculator | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/mortgage-calculator" },
};

export default function MortgageCalculatorPage() {
  return <MortgageCalculatorClient />;
}
