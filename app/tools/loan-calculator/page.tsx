import type { Metadata } from "next";
import LoanCalculatorClient from "./client";

export const metadata: Metadata = {
  title:       "Free Loan Calculator — Monthly Payment, Amortization & Interest | PursTech",
  description: "Calculate your exact monthly loan payment, total interest and full amortization schedule. See how extra payments save you thousands. Free, instant, no login.",
  keywords:    ["loan calculator","monthly payment calculator","amortization calculator","loan interest calculator","personal loan calculator free"],
  openGraph: {
    title:       "Free Loan Calculator — Payment, Amortization & Interest | PursTech",
    description: "Calculate loan payments, total interest and amortization schedule instantly. See the impact of extra payments. Free, no login.",
    url:         "https://purstech.com/tools/loan-calculator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:    "summary_large_image",
    title:   "Free Loan Calculator | PursTech",
    images:  ["/og-image.png"],
  },
  alternates: { canonical: "/tools/loan-calculator" },
};

export default function LoanCalculatorPage() {
  return <LoanCalculatorClient />;
}
