import type { Metadata } from "next";
import TimeZoneClient from "./client";

export const metadata: Metadata = {
  title: "Free Time Zone Converter — 65+ World Cities",
  description: "Convert time between any two time zones instantly. Live world clock for 65+ cities, DST-aware, best meeting time finder for remote teams. Free, no login.",
  alternates: { canonical: "/tools/time-zone-converter" },
  keywords: ["time zone converter","world clock","time zone calculator","meeting time zones","convert time zones online","dst time zone","utc time converter"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/time-zone-converter",
    siteName: "PursTech",
    title: "Free Time Zone Converter — World Clock & Meeting Planner",
    description: "Convert times between any time zones. Live world clock, DST-aware, best meeting time finder. Free.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Time Zone Converter — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Time Zone Converter — World Clock & Meeting Planner",
    description: "Live world clock, DST-aware time converter, meeting overlap finder. 65+ cities. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Time Zone Converter", url: "https://www.purstech.com/tools/time-zone-converter",
  description: "Free time zone converter with live world clock, DST awareness, meeting planner and 65+ cities. Convert any time between any two time zones instantly.",
  applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "Live world clock — 65+ cities with 1-second updates",
    "DST-aware — automatically detects Daylight Saving Time",
    "Time converter — any date/time between any two timezones",
    "Swap timezones with one click",
    "Reset to current time with Now button",
    "Meeting planner — highlights business-hour overlaps across multiple cities",
    "City search autocomplete — add any city to the world clock",
    "Business hours indicator (green/yellow/grey dots)",
    "UTC offset display with DST badge",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Convert Time Zones Online",
  description: "Use PursTech's free Time Zone Converter to convert times and plan global meetings.",
  totalTime: "PT30S",
  step: [
    { "@type": "HowToStep", position: 1, name: "View the live world clock",
      text: "The world clock shows live time for 5 cities by default, updating every second. Green dots indicate business hours, yellow indicates daytime, grey indicates night.",
      url: "https://www.purstech.com/tools/time-zone-converter" },
    { "@type": "HowToStep", position: 2, name: "Search and add cities",
      text: "Type any city name in the search box to add it to your world clock. Click × on any card to remove it.",
      url: "https://www.purstech.com/tools/time-zone-converter" },
    { "@type": "HowToStep", position: 3, name: "Convert a specific time",
      text: "Enter a date and time, select your From and To timezones, and see the converted time instantly. Use Swap to reverse the direction, and Now to reset to the current time.",
      url: "https://www.purstech.com/tools/time-zone-converter" },
    { "@type": "HowToStep", position: 4, name: "Find the best meeting time",
      text: "Open the Meeting Planner and add your team cities. The tool highlights hours where the most team members are within business hours simultaneously.",
      url: "https://www.purstech.com/tools/time-zone-converter" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is UTC and why is it used as a reference for time zones?",
      acceptedAnswer: { "@type": "Answer", text: "UTC (Coordinated Universal Time) is the primary time standard by which the world regulates clocks. All time zones are expressed as positive or negative offsets from UTC — for example, New York is UTC-5 (or UTC-4 during DST). UTC never changes for Daylight Saving Time, making it a stable reference point for global coordination." } },
    { "@type": "Question", name: "What is Daylight Saving Time and which countries observe it?",
      acceptedAnswer: { "@type": "Answer", text: "Daylight Saving Time advances clocks by one hour during warmer months to extend evening daylight. The US observes DST from the second Sunday in March to the first Sunday in November. Many countries do not observe DST, including China, Japan, India, most of Africa and parts of South America. Our converter is DST-aware and automatically applies the correct offset for any selected date." } },
    { "@type": "Question", name: "How do I find the best meeting time for a global team?",
      acceptedAnswer: { "@type": "Answer", text: "Use the Meeting Planner feature. Add your team's cities and the tool highlights hours that fall within business hours (9am–6pm) for the most cities simultaneously. The most common overlap for US + Europe is 9am–12pm ET. For US + Asia there is rarely any daytime overlap." } },
    { "@type": "Question", name: "What is the difference between a time zone and a UTC offset?",
      acceptedAnswer: { "@type": "Answer", text: "A UTC offset is a simple number (like +5:30 or -8) indicating hours ahead or behind UTC. A time zone is a named region (like America/New_York) that defines not just the standard offset but also DST rules. Two locations can share the same UTC offset but be in different time zones with different DST rules." } },
    { "@type": "Question", name: "Why are some time zones not whole hours (e.g. India UTC+5:30)?",
      acceptedAnswer: { "@type": "Answer", text: "India (UTC+5:30) standardised on a half-hour offset to be a single time zone for the entire country. Nepal (UTC+5:45) is the only country with a 15-minute offset — set at 15 minutes ahead of India to differentiate from its neighbour. There are about 40 such non-integer offsets worldwide." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                   item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",                  item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Finance Tools",          item: "https://www.purstech.com/categories/finance" },
    { "@type": "ListItem", position: 4, name: "Time Zone Converter",    item: "https://www.purstech.com/tools/time-zone-converter" },
  ],
};

export default function TimeZoneConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <TimeZoneClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            Finance Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Time Zone Converter — World Clock &amp; Meeting Planner
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Convert time between any two time zones instantly. Live world clock with DST awareness, 65+ cities, and a meeting overlap finder for remote teams.
          </p>
        </div>
      </TimeZoneClient>
    </>
  );
}