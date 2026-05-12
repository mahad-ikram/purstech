import type { Metadata } from "next";
import SSLCheckerClient from "./client";

export const metadata: Metadata = {
  title:       "Free SSL Certificate Checker — Grade, Expiry, TLS & Security Details | PursTech",
  description: "Check any website's SSL certificate instantly. See security grade A–F, days until expiry, TLS version, cipher suite, certificate issuer, key strength and all SANs. Free, no login required.",
  keywords: [
    "ssl checker",
    "ssl certificate checker",
    "check ssl certificate online",
    "ssl expiry checker",
    "website ssl check",
    "https certificate checker",
    "tls version checker",
    "ssl certificate validator",
    "free ssl checker",
    "ssl certificate details",
  ],
  openGraph: {
    type:        "website",
    title:       "Free SSL Certificate Checker — Grade, Expiry & TLS Details | PursTech",
    description: "Instantly check any website's SSL certificate — grade, expiry countdown, TLS version, cipher suite, issuer and SANs. Free.",
    url:         "https://www.purstech.com/tools/ssl-checker",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free SSL Certificate Checker" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free SSL Certificate Checker | PursTech",
    description: "Security grade, expiry countdown, TLS version, cipher suite. Check any domain instantly. Free.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },
  alternates: { canonical: "/tools/ssl-checker" },
  robots:      "index, follow, max-image-preview:large, max-snippet:-1",
};

/* ── JSON-LD: SoftwareApplication ─────────────────────────────────────────── */
const APP_SCHEMA = {
  "@context":          "https://schema.org",
  "@type":             "SoftwareApplication",
  name:                "SSL Certificate Checker",
  description:         "Free online SSL certificate checker. Inspect security grade A–F, expiry countdown, TLS version, cipher suite, certificate issuer, key strength and Subject Alternative Names for any domain.",
  url:                 "https://www.purstech.com/tools/ssl-checker",
  applicationCategory: "SecurityApplication",
  operatingSystem:     "Any",
  browserRequirements: "Any modern browser",
  featureList: [
    "Security grade A+ to F",
    "Days remaining until certificate expiry",
    "TLS protocol version detection",
    "Cipher suite and key strength",
    "Certificate issuer chain",
    "Subject Alternative Names list",
    "SHA-256 fingerprint",
    "Self-signed certificate detection",
    "Certificate lifetime progress bar",
  ],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author:    { "@type": "Organization", name: "PursTech", url: "https://www.purstech.com" },
  provider:  { "@type": "Organization", name: "PursTech", url: "https://www.purstech.com" },
};

/* ── JSON-LD: BreadcrumbList ──────────────────────────────────────────────── */
const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type":    "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",         item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "SSL Checker",   item: "https://www.purstech.com/tools/ssl-checker" },
  ],
};

/* ── JSON-LD: FAQPage ─────────────────────────────────────────────────────── */
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type":    "FAQPage",
  mainEntity: [
    {
      "@type":          "Question",
      name:             "What does the SSL security grade mean?",
      acceptedAnswer: { "@type": "Answer", text: "The security grade summarises the overall TLS configuration quality on a scale of A+ to F. A+ means TLS 1.3, a 2048-bit or larger key, and more than 30 days remaining. Grade A uses TLS 1.3 with a strong key. Grade B uses TLS 1.2 with a strong key. Grade C indicates TLS 1.2 with a weaker configuration. Grade D means the certificate expires in under 7 days. Grade F means the certificate is already expired or no certificate was found at all." },
    },
    {
      "@type":          "Question",
      name:             "What is the difference between SSL and TLS?",
      acceptedAnswer: { "@type": "Answer", text: "SSL (Secure Sockets Layer) is the older, now-deprecated predecessor to TLS (Transport Layer Security). SSL 2.0 and 3.0 are both considered insecure and should not be used. TLS 1.0 and 1.1 were deprecated in 2020. Modern websites should use TLS 1.2 at minimum or TLS 1.3 for the best security and performance. Despite the technical distinction, the industry still refers to digital certificates as 'SSL certificates'. The padlock in your browser address bar indicates TLS is active." },
    },
    {
      "@type":          "Question",
      name:             "How do I fix an expired SSL certificate?",
      acceptedAnswer: { "@type": "Answer", text: "To fix an expired SSL certificate: 1) Log in to your hosting control panel or certificate provider. 2) Renew or purchase a new certificate — Let's Encrypt offers free 90-day certificates. 3) Install the new certificate on your server. 4) Restart your web server (Nginx, Apache, etc.). 5) Verify the new certificate is active using our SSL checker. Most modern hosting providers and CPanel installations support automatic Let's Encrypt renewal, which prevents expiry from happening in the first place." },
    },
    {
      "@type":          "Question",
      name:             "What are Subject Alternative Names (SANs)?",
      acceptedAnswer: { "@type": "Answer", text: "Subject Alternative Names (SANs) are the list of domain names that a single SSL certificate covers. A certificate might include example.com, www.example.com, mail.example.com and api.example.com all in one certificate. Wildcard certificates use *.example.com to cover all subdomains. Multi-domain certificates can cover entirely different domains. Our checker shows all SANs so you can verify exactly which hostnames the certificate protects." },
    },
    {
      "@type":          "Question",
      name:             "How often should I check my SSL certificate?",
      acceptedAnswer: { "@type": "Answer", text: "You should check your SSL certificate at least 30 and 90 days before expiry. Since September 2020, certificates are issued for a maximum of 398 days. Set calendar reminders at 90 days and 30 days before the expiry date shown by our checker. For production websites, use automated monitoring tools that alert you when less than 30 days remain. An expired certificate causes all browsers to block your visitors with a scary security warning — potentially costing significant traffic and revenue." },
    },
  ],
};

const FEATURES = [
  { icon: "🏅", title: "Security Grade A+ to F",       desc: "Instant letter grade based on TLS version, key strength and certificate validity." },
  { icon: "📅", title: "Expiry Countdown",             desc: "See exactly how many days remain before the certificate expires, colour-coded by urgency." },
  { icon: "🔒", title: "TLS Protocol Version",         desc: "Confirms whether the server uses TLS 1.3 (best), TLS 1.2 (acceptable) or older deprecated versions." },
  { icon: "🔑", title: "Cipher Suite & Key Strength",  desc: "Identifies the encryption algorithm and key size — 2048 bits is the current minimum standard." },
  { icon: "📋", title: "Full SAN List",                desc: "Lists every domain name the certificate covers, including wildcards and multi-domain entries." },
  { icon: "🔍", title: "SHA-256 Fingerprint",          desc: "Cryptographic fingerprint to verify certificate authenticity and detect potential spoofing." },
];

const USE_CASES = [
  { who: "Website Owners",    why: "Verify your certificate is valid and won't expire without warning, protecting your visitors and SEO." },
  { who: "Developers",        why: "Debug HTTPS connection issues, confirm the right certificate is deployed and check SANs during setup." },
  { who: "Security Teams",    why: "Audit cipher suites and TLS versions across your organisation's domains for compliance and hardening." },
  { who: "SEO Professionals", why: "HTTPS is a Google ranking factor. Check that certificates are valid before and after migrations." },
];

export default function SSLCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />

      <SSLCheckerClient>
        {/* ── Server-rendered hero — in initial HTML so Google reads it ── */}
        <div className="mb-8">

          <div className="inline-flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-full px-3 py-1 text-xs text-[#00D4FF] font-semibold mb-3">
            Security Tools
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            Free SSL Certificate Checker — Security Grade, Expiry &amp; TLS Details
          </h1>

          <p className="text-gray-400 max-w-2xl mb-3 leading-relaxed text-base">
            Instantly inspect any website's SSL/TLS certificate. Our checker connects directly
            to the domain and retrieves the live certificate — giving you the security grade,
            exact expiry date, TLS protocol version, cipher suite, certificate issuer and every
            domain name the certificate covers. No browser extension needed. No login.
          </p>
          <p className="text-gray-500 max-w-2xl mb-6 leading-relaxed text-sm">
            Used by developers, security teams, SEO professionals and site owners to verify
            HTTPS is correctly configured, catch certificates before they expire, and audit
            TLS versions across multiple domains.
          </p>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-[#13131F] border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-sm font-bold text-white">{f.title}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Use cases */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3">Who uses the SSL Checker?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {USE_CASES.map(u => (
                <div key={u.who} className="flex gap-3">
                  <span className="text-[#00D4FF] font-extrabold text-sm flex-shrink-0 mt-0.5">→</span>
                  <div>
                    <span className="text-sm font-semibold text-white">{u.who}: </span>
                    <span className="text-sm text-gray-400">{u.why}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SSLCheckerClient>
    </>
  );
}
