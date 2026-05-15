import type { Metadata } from "next";
import RegexTesterClient from "./client";

export const metadata: Metadata = {
  title:       "Free Regex Tester — Live Match Highlighting",
  description: "Test and debug regular expressions instantly with real-time match highlighting, named group extraction, replace mode, 30+ pattern library and a plain-English regex explainer. Free, no login.",
  keywords:    ["regex tester","regular expression tester online","regex checker","javascript regex tester","regex debugger online free"],
  openGraph: {
    title:       "Free Regex Tester Online — Real-Time Highlighting & Explainer | PursTech",
    description: "Test regular expressions with real-time highlighting, named groups, replace mode and 30+ pattern library. Free.",
    url:         "https://purstech.com/tools/regex-tester",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free Regex Tester Online | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/regex-tester" },
};

export default function RegexTesterPage() {
  return <RegexTesterClient />;
}
