import type { Metadata } from "next";
import React from "react";
import IPLookupClient from "./client";

export const metadata: Metadata = {
  title:       "Advanced IP Address Lookup — Risk Score, ISP & Reverse DNS | PursTech",
  description: "Free advanced IP lookup. Get country, ISP classification, VPN/proxy risk score, reverse DNS hostname, live timezone clock and side-by-side comparison.",
  keywords:    ["ip lookup", "advanced ip lookup", "ip address risk score", "reverse dns lookup", "isp classification", "vpn detection", "ip address location", "batch ip lookup"],
  openGraph: {
    title:       "Advanced IP Address Lookup — Risk Score & Reverse DNS | PursTech",
    description: "Look up any IP with advanced metrics: risk score, ISP classification, reverse DNS, and live timezone clock. Free.",
    url:         "https://www.purstech.com/tools/ip-lookup",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Advanced IP Address Lookup | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/ip-lookup" },
};

const FEATURES = [
  "Risk score and VPN/Proxy/Tor detection",
  "ISP classification (Residential, Business, Cloud)",
  "Reverse DNS hostname resolution via Google DNS",
  "Live ticking clock for the IP's timezone",
  "Side-by-side comparison mode for 2 IPs",
  "Batch lookup for up to 10 IP addresses",
];

export default function IPLookupPage() {
  return (
    <IPLookupClient>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-full px-3 py-1 text-xs text-[#00D4FF] font-semibold mb-3">
          Security Tools
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
          Advanced IP Address Lookup — Risk Score, Reverse DNS &amp; ISP Class
        </h1>
        <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
          Go beyond basic location data. Look up the geographic location, internet provider, 
          risk score, and network details of any IP address instantly. Detect proxy servers, 
          VPNs, and cloud hosting providers. Features side-by-side comparison, reverse DNS, 
          and shareable URLs.
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
  ) as any;
}
