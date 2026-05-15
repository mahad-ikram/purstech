import type { Metadata } from "next";
import TipCalculatorClient from "./client";

export const metadata: Metadata = {
  title:       "Free Tip Calculator & Bill Splitter",
  description: "Calculate tip and split a restaurant bill in seconds. Set custom tip %, split among any number of people, add tax, and get per-person totals with rounding options. Free, instant.",
  keywords:    ["tip calculator","split bill calculator","restaurant tip calculator","how much to tip","tip split calculator"],
  openGraph: {
    title:       "Free Tip Calculator — Split Bill & Per Person | PursTech",
    description: "Calculate tip and split bills instantly. Custom tip %, split among any number of people, tax, rounding. Free.",
    url:         "https://purstech.com/tools/tip-calculator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free Tip Calculator | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/tip-calculator" },
};

export default function TipCalculatorPage() {
  return <TipCalculatorClient />;
}
