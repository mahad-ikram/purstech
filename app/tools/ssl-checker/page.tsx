import type { Metadata } from "next";
import SSLCheckerClient from "./client";

export const metadata: Metadata = {
  title: "Free SSL Checker & Certificate Decoder — Expiry & Grade",
  description: "Check any website's SSL certificate instantly. See security grade A–F, days until expiry, TLS version, cipher suite, certificate issuer, key strength and all SANs. Free, no login required.",
  alternates: { canonical: "/tools/ssl-checker" },
  keywords: ["ssl checker", "certificate decoder", "ssl certificate checker", "cert decoder", "ssl decoder", "what is an ssl certificate", "how to check ssl certificate", "certificate reader", "ssl expiry checker", "secure socket layer"],
  openGraph: {
    type: "website",
    title: "Free SSL Certificate Checker — Grade, Expiry & TLS Details",
    description: "Instantly check any website's SSL certificate — grade, expiry countdown, TLS version, cipher suite, issuer and SANs. Free.",
    url: "https://www.purstech.com/tools/ssl-checker",
    siteName: "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free SSL Certificate Checker" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SSL Checker — Certificate Decoder, Grade A+ to F",
    description: "Security grade, expiry countdown, TLS version, cipher suite. Check any domain instantly. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebPage",
  name: "SSL Certificate Checker",
  description: "Free online SSL certificate checker. Inspect security grade A–F, expiry countdown, TLS version, cipher suite, certificate issuer, key strength and Subject Alternative Names for any domain.",
  url: "https://www.purstech.com/tools/ssl-checker",
  inLanguage: "en-US",
  isAccessibleForFree: true,
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
    "Re-check button for instant post-renewal verification",
  ],
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Check an SSL Certificate Online",
  description: "Use PursTech's free SSL Checker to inspect any domain's certificate in seconds.",
  totalTime: "PT30S",
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter a domain",
      text: "Type any domain name (e.g. example.com) or click one of the popular domain shortcuts to load it instantly. The https:// prefix is stripped automatically.",
      url: "https://www.purstech.com/tools/ssl-checker" },
    { "@type": "HowToStep", position: 2, name: "Click Check",
      text: "Click the Check button. The tool connects directly to the domain via TLS handshake and retrieves the live certificate — typically in under 3 seconds.",
      url: "https://www.purstech.com/tools/ssl-checker" },
    { "@type": "HowToStep", position: 3, name: "Review the security grade and details",
      text: "Read the letter grade (A+ to F), expiry countdown, TLS version, cipher suite, issuer, key strength and Subject Alternative Names.",
      url: "https://www.purstech.com/tools/ssl-checker" },
    { "@type": "HowToStep", position: 4, name: "Follow the recommended actions",
      text: "Each grade comes with specific recommended actions. After renewing an expired certificate, click Re-check to confirm the new certificate is live.",
      url: "https://www.purstech.com/tools/ssl-checker" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is an SSL certificate?",
      acceptedAnswer: { "@type": "Answer", text: "An SSL/TLS certificate (secure socket layer certificate) is a small digital file that proves a website's identity and enables the encrypted https:// padlock. It binds a domain name to a public key, is signed by a trusted Certificate Authority, and expires on a set date. This checker decodes and grades all of it for any domain." } },
    { "@type": "Question", name: "How do I decode an SSL certificate's details?",
      acceptedAnswer: { "@type": "Answer", text: "Enter the domain — the checker performs a live TLS handshake and decodes the certificate for you: issuer chain, validity dates and days remaining, Subject Alternative Names, key strength, TLS protocol version and the SHA-256 fingerprint. No OpenSSL commands needed." } },
    { "@type": "Question", name: "What does each security grade (A+, A, B, C, D, F) mean?",
      acceptedAnswer: { "@type": "Answer", text: "The security grade summarises TLS configuration quality on a scale of A+ to F. A+ means TLS 1.3, a 2048-bit+ key, and more than 30 days remaining. A uses TLS 1.3 with a strong key. B uses TLS 1.2 with a strong key. C indicates weaker configuration. D means the certificate expires in under 7 days. F means the certificate is already expired or no certificate was found." } },
    { "@type": "Question", name: "What is the difference between SSL and TLS, and which version should my site use?",
      acceptedAnswer: { "@type": "Answer", text: "SSL (Secure Sockets Layer) is the older, now-deprecated predecessor to TLS (Transport Layer Security). SSL 2.0 and 3.0 are considered insecure. TLS 1.0 and 1.1 were deprecated in 2020. Modern websites should use TLS 1.2 at minimum or TLS 1.3 for the best security and performance. Despite the distinction, the industry still refers to certificates as SSL certificates." } },
    { "@type": "Question", name: "My SSL certificate is expiring — what exact steps do I take to renew it?",
      acceptedAnswer: { "@type": "Answer", text: "To fix an expired SSL certificate: 1) Log in to your hosting control panel or certificate provider. 2) Renew — Let's Encrypt offers free 90-day certificates. 3) Install the new certificate. 4) Restart your web server. 5) Use Re-check to confirm the new certificate is live and the grade has improved." } },
    { "@type": "Question", name: "What are Subject Alternative Names (SANs) and what is a wildcard certificate?",
      acceptedAnswer: { "@type": "Answer", text: "Subject Alternative Names (SANs) are the list of domain names that a single SSL certificate covers. A certificate might include example.com, www.example.com, mail.example.com and api.example.com. Wildcard certificates use *.example.com to cover all subdomains. Our checker shows all SANs so you can verify exactly which hostnames the certificate protects." } },
    { "@type": "Question", name: "How often should I check my SSL certificate?",
      acceptedAnswer: { "@type": "Answer", text: "Check your SSL certificate at least 30 and 90 days before expiry. Certificates are issued for a maximum of 398 days. Set calendar reminders at 90 days and 30 days before the expiry date shown. An expired certificate causes all browsers to block visitors with a security warning, costing significant traffic and revenue." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",           item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",          item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Security Tools", item: "https://www.purstech.com/categories/security" },
    { "@type": "ListItem", position: 4, name: "SSL Checker",    item: "https://www.purstech.com/tools/ssl-checker" },
  ],
};

export default function SSLCheckerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />

      <SSLCheckerClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-full px-3 py-1 text-xs text-[#00D4FF] font-semibold mb-3">
            Security Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight">
            SSL Certificate Checker &amp; Decoder — Grade, Expiry &amp; Chain
          </h1>
          <p className="text-gray-400 max-w-2xl leading-relaxed text-base">
            Instantly inspect any website's SSL/TLS certificate. Our checker connects directly
            to the domain and retrieves the live certificate — giving you the security grade,
            exact expiry date, TLS protocol version, cipher suite, certificate issuer and every
            domain name the certificate covers. No browser extension needed.
          </p>
        </div>
      </SSLCheckerClient>
    </>
  );
}
