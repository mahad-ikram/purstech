import type { Metadata } from "next";
import TimeZoneClient from "./client";

export const metadata: Metadata = {
  title:       "Free Time Zone Converter — World Clock & Meeting Planner | PursTech",
  description: "Convert time between any two time zones instantly. Live world clock for 500+ cities, DST-aware, best meeting time finder for remote teams. Free, no login.",
  keywords:    ["time zone converter","world clock","time zone calculator","meeting time zones","convert time zones online","dst time zone"],
  openGraph: {
    title:       "Free Time Zone Converter — World Clock & Meeting Planner | PursTech",
    description: "Convert times between any time zones. Live world clock, DST-aware, best meeting time finder. Free.",
    url:         "https://purstech.com/tools/time-zone-converter",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free Time Zone Converter | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/time-zone-converter" },
};

export default function TimeZoneConverterPage() {
  return <TimeZoneClient />;
}
