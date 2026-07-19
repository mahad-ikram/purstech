import type { Metadata } from "next";
import IPLookupClient from "./client";

// ✅ Removed: import React — Next.js 13+ App Router doesn't need explicit React imports

export const metadata: Metadata = {
  // Renders: "Free IP Address Lookup — Location, ISP & Risk | PursTech" (56 chars ✅)
  title: "Free IP Address Lookup — What Is My IP, Location & ISP",

  description:
    "Free advanced IP lookup. Get country, ISP classification, VPN/proxy risk score, reverse DNS hostname, live timezone clock and side-by-side comparison.",

  alternates: { canonical: "/tools/ip-lookup" },

  keywords: ["ip address lookup","ip lookup","what is my ip","what is an ip address","ip address search","ip location","how to find my ip address","reverse dns lookup","ip checker"],

  openGraph: {
    type:     "website",
    url:      "https://www.purstech.com/tools/ip-lookup",
    siteName: "PursTech",
    // ✅ Removed "| PursTech"
    title:       "Advanced IP Address Lookup — Risk Score, Reverse DNS & ISP Class",
    description: "Look up any IP with advanced metrics: risk score, ISP classification, reverse DNS, and live timezone clock. Free.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "IP Address Lookup — PursTech" }],
  },

  twitter: {
    card: "summary_large_image",
    // ✅ Removed "| PursTech"
    title:       "Advanced IP Address Lookup — Risk Score & Reverse DNS",
    description: "Look up any IP with risk score, ISP classification, reverse DNS and live timezone clock. Free.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  // ✅ Added — was missing entirely
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// ── WebApplication schema ──────────────────────────────────────────────────
// ✅ Moved from client.tsx + SoftwareApplication → WebApplication

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "IP Address Lookup", url: "https://www.purstech.com/tools/ip-lookup",
  description: "Advanced free IP lookup with risk score, ISP classification (Residential/Business/Cloud/VPN), reverse DNS via Google DNS, live timezone clock, side-by-side comparison mode and batch lookup for up to 10 IPs.",
  applicationCategory: "SecurityApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Risk score and VPN/Proxy/Tor detection",
    "ISP type classification: Residential, Business, Mobile, Cloud, VPN",
    "Reverse DNS hostname resolution via Google DNS-over-HTTPS",
    "Live ticking clock for the IP's local timezone",
    "Side-by-side comparison mode for 2 IPs",
    "Batch lookup for up to 10 IP addresses with CSV export",
    "Dual API sources (ipapi.co + ipwho.is fallback)",
    "Share URL, copy JSON, BGP ASN lookup link",
    "Auto-detect visitor IP on page load",
    "URL parameter support (?ip=)",
  ],
};

// ── HowTo schema ───────────────────────────────────────────────────────────
// ✅ Added — 4 steps matching the How to Use section in client

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Use the Advanced IP Lookup",
  description: "Use PursTech's free IP Address Lookup to analyse any IP address with risk scoring, ISP classification and reverse DNS.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Auto-Detect your IP",
      text: "On page load, your own public IP address is detected and analysed instantly — no input required.",
      url: "https://www.purstech.com/tools/ip-lookup" },
    { "@type": "HowToStep", position: 2, name: "Look up any IP",
      text: "Enter any IPv4 or IPv6 address in the search box. Use the example quick-picks (8.8.8.8, 1.1.1.1) to see sample results. Switch to Batch mode to analyse up to 10 IPs at once.",
      url: "https://www.purstech.com/tools/ip-lookup" },
    { "@type": "HowToStep", position: 3, name: "Compare two IPs",
      text: "Switch to the Compare tab and enter two IP addresses to view their attributes side-by-side — useful for before/after VPN checks or suspicious login analysis.",
      url: "https://www.purstech.com/tools/ip-lookup" },
    { "@type": "HowToStep", position: 4, name: "Share or export results",
      text: "Click Copy Share URL to get a direct link to your specific IP lookup. Copy as JSON for developer use. Download batch results as CSV.",
      url: "https://www.purstech.com/tools/ip-lookup" },
  ],
};

// ── FAQPage schema ─────────────────────────────────────────────────────────
// ✅ Added — 5 rich FAQ items from client, now server-rendered for crawlers

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question",
      name: "What is an IP address?",
      acceptedAnswer: { "@type": "Answer", text: "An IP (Internet Protocol) address is the unique numeric label that identifies a device on a network — like a mailing address for internet traffic. IPv4 addresses look like 203.0.113.42; IPv6 addresses are longer, like 2001:db8::8a2e:370:7334. Every website you visit can see your public IP." } },
    { "@type": "Question",
      name: "How do I find my IP address?",
      acceptedAnswer: { "@type": "Answer", text: "It is automatic here — this tool detects and displays your public IP address the moment the page loads, along with location, ISP, timezone and risk details. To check a different address, type any IPv4 or IPv6 into the lookup box, or use compare mode for two at once." } },
    { "@type": "Question",
      name: "What can an IP address reveal — and what can't it reveal?",
      acceptedAnswer: { "@type": "Answer", text: "An IP lookup reveals geographic location (country near 100% accurate, city ~60-70%), the ISP and organisation name, ASN and CIDR range, connection context (residential/business/mobile/datacenter/VPN), and reverse DNS hostname. It cannot reveal your real name, home address, email, or phone number. Precise street-level location is impossible. Only your ISP can link an IP to a specific subscriber, and they only do so under a court order." } },
    { "@type": "Question",
      name: "Why is my IP showing the wrong location, and can I fix it?",
      acceptedAnswer: { "@type": "Answer", text: "Location mismatches are common and legitimate. The most common reason: your ISP assigns your IP from a regional pool registered to their nearest data centre, not your physical location. Mobile carriers route all traffic through centralised gateways, so your IP appears to originate from the gateway city. Corporate VPNs show the company egress IP. Recently reassigned IP blocks may show stale location data for days. Businesses can submit correction requests to MaxMind, IP2Location and ipinfo.io." } },
    { "@type": "Question",
      name: "What is reverse DNS and why does it matter?",
      acceptedAnswer: { "@type": "Answer", text: "Reverse DNS (rDNS) maps an IP address back to a hostname using PTR records in DNS. It's critical for email deliverability — many mail servers reject messages from IPs without a valid PTR record. In access logs, rDNS reveals whether traffic comes from a search engine bot (crawl.googlebot.com), a CDN node, or an ISP's infrastructure. Our tool uses Google's DNS-over-HTTPS API to perform PTR lookups reliably without any API key." } },
    { "@type": "Question",
      name: "What does the ISP type classification mean?",
      acceptedAnswer: { "@type": "Answer", text: "IP addresses are classified into five types: Residential ISP (home internet, low risk), Business ISP (corporate connection, slightly elevated), Mobile Network (cellular carrier, low risk but low location accuracy), Cloud Hosting (AWS, Google Cloud, Azure, DigitalOcean — medium-high risk, common for bots and scrapers), and VPN Provider (NordVPN, ExpressVPN etc. — high risk, real user location concealed). This classification is more actionable than a raw ISP name for fraud prevention and security teams." } },
    { "@type": "Question",
      name: "How do I use the comparison mode and what can it tell me?",
      acceptedAnswer: { "@type": "Answer", text: "Comparison mode displays two IP addresses side-by-side. Use cases include: before/after VPN verification, impossible travel fraud detection (same user logging in from two countries within minutes), CDN PoP verification, and bot traffic analysis. Switch to the Compare tab, enter two IPs (or click 'Use My IP' for either field), and click Compare. Differences between the two results are clearly visible in the output columns." } },
  ],
};

// ── BreadcrumbList schema ──────────────────────────────────────────────────
// ✅ Added — missing entirely, includes /categories/security step

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",           item: "https://www.purstech.com"                    },
    { "@type": "ListItem", position: 2, name: "Tools",          item: "https://www.purstech.com/tools"              },
    { "@type": "ListItem", position: 3, name: "Security Tools", item: "https://www.purstech.com/categories/security"},
    { "@type": "ListItem", position: 4, name: "IP Lookup",      item: "https://www.purstech.com/tools/ip-lookup"   },
  ],
};

const FEATURES = [
  "Risk score and VPN/Proxy/Tor detection",
  "ISP classification (Residential, Business, Cloud)",
  "Reverse DNS hostname resolution via Google DNS",
  "Live ticking clock for the IP's timezone",
  "Side-by-side comparison mode for 2 IPs",
  "Batch lookup for up to 10 IP addresses",
];

// ✅ Removed: ) as any cast — component is correctly typed

export default function IPLookupPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />

      <IPLookupClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-full px-3 py-1 text-xs text-[#00D4FF] font-semibold mb-3">
            Security Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            IP Address Lookup — What Is My IP? Location, ISP &amp; Risk
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
    </>
  );
}
