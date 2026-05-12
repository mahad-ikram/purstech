import type { Metadata } from "next";
import IPLookupClient from "./client";

export const metadata: Metadata = {
  title:       "Free IP Address Lookup — Location, ISP, ASN & Timezone | PursTech",
  description: "Look up any IP address instantly. Get country, city, region, ISP, ASN, timezone, coordinates and currency. Auto-detects your own IP on load. Free, no login.",
  keywords:    ["ip lookup","ip address lookup","find ip location","ip geolocation","whats my ip","ip address finder","asn lookup","ip location checker"],
  openGraph: {
    title:       "Free IP Address Lookup — Location, ISP & ASN | PursTech",
    description: "Look up any IP — country, city, ISP, ASN, timezone, coordinates. Auto-shows your own IP. Free.",
    url:         "https://www.purstech.com/tools/ip-lookup",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free IP Address Lookup | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/ip-lookup" },
};

const FEATURES = [
  "Auto-detects your own public IP on load",
  "Country, region, city and postal code",
  "ISP, organisation and ASN number",
  "Latitude, longitude and timezone",
  "Currency and country calling code",
  "Batch lookup — up to 10 IPs at once",
];

export default function IPLookupPage() {
  return (
    <IPLookupClient>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-full px-3 py-1 text-xs text-[#00D4FF] font-semibold mb-3">
          Security Tools
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
          Free IP Address Lookup — Location, ISP, ASN &amp; Timezone
        </h1>
        <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
          Look up the geographic location, internet provider and network details of any IP
          address instantly. Your own public IP is shown automatically on load. Supports
          batch lookup of up to 10 addresses at once. No login, completely free.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
          {FEATURES.map(f => (
            <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
              <span className="text-[#00D4FF] flex-shrink-0 mt-0.5 font-bold">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </IPLookupClient>
  );
}
