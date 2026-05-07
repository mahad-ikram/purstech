import type { Metadata } from "next";
import CompoundInterestClient from "./client";

export const metadata: Metadata = {
  title:       "Free Compound Interest Calculator — With Monthly Contributions & Growth Chart | PursTech",
  description: "Calculate compound interest with regular contributions, multiple compounding frequencies and a year-by-year growth breakdown. See how your money grows over time. Free, instant.",
  keywords:    ["compound interest calculator","investment calculator","savings growth calculator","future value calculator","compound interest with monthly contributions"],
  openGraph: {
    title:       "Free Compound Interest Calculator | PursTech",
    description: "Calculate compound interest with contributions, multiple compounding frequencies and year-by-year growth. Free and instant.",
    url:         "https://purstech.com/tools/compound-interest-calculator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free Compound Interest Calculator | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/compound-interest-calculator" },
};

export default function CompoundInterestPage() {
  return <CompoundInterestClient />;
}
