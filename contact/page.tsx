import type { Metadata } from "next";
import ContactClient from "./client";

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Contact PursTech — Get Help & Send Feedback",
  description:
    "Get in touch with PursTech. Report bugs, suggest new tools, ask questions or get help with your subscription. We respond within 24–48 hours.",
  alternates: { canonical: "/contact" },
  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/contact",
    siteName:    "PursTech",
    title:       "Contact PursTech — Get Help & Send Feedback",
    description: "Report bugs, suggest new tools, get billing help or ask general questions. The PursTech team responds within 24–48 hours.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Contact PursTech" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Contact PursTech — Get Help & Send Feedback",
    description: "Bug reports, tool suggestions, billing questions — we respond within 24–48 hours.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// ─── JSON-LD Schemas ──────────────────────────────────────────────────────────

const CONTACT_SCHEMA = {
  "@context":   "https://schema.org",
  "@type":      "ContactPage",
  "@id":        "https://www.purstech.com/contact",
  name:         "Contact PursTech",
  description:  "Contact the PursTech team for bug reports, tool suggestions, billing inquiries and general questions.",
  url:          "https://www.purstech.com/contact",
  isPartOf:     { "@id": "https://www.purstech.com/#website" },
  about:        { "@id": "https://www.purstech.com/#organization" },
  contactPoint: [
    {
      "@type":            "ContactPoint",
      email:              "hello@purstech.com",
      contactType:        "customer service",
      availableLanguage:  "English",
    },
    {
      "@type":      "ContactPoint",
      email:        "privacy@purstech.com",
      contactType:  "privacy inquiries",
    },
    {
      "@type":      "ContactPoint",
      email:        "billing@purstech.com",
      contactType:  "billing support",
    },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type":    "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name:    "How do I report a bug?",
      acceptedAnswer: { "@type": "Answer", text: "Use the contact form and select 'Bug Report' as the subject. Please include the tool name, what you were doing and what went wrong. We investigate all bug reports within 24 hours." },
    },
    {
      "@type": "Question",
      name:    "Can I suggest a new tool?",
      acceptedAnswer: { "@type": "Answer", text: "Absolutely — we love suggestions! Use the contact form and select 'Tool Suggestion' as the subject. Tell us what tool you need and why it would be useful. Many of our best tools came from user suggestions." },
    },
    {
      "@type": "Question",
      name:    "How do I cancel my Pro subscription?",
      acceptedAnswer: { "@type": "Answer", text: "Log into your account, go to Settings, and click Cancel Subscription. You will keep full Pro access until the end of your current billing period. No questions asked." },
    },
    {
      "@type": "Question",
      name:    "Is my data safe when using PursTech tools?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. All tool processing happens entirely in your browser — your device. We never store what you type, paste or upload into any tool. Files and text you use in our tools never reach our servers." },
    },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context":        "https://schema.org",
  "@type":           "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",    item: "https://www.purstech.com"         },
    { "@type": "ListItem", position: 2, name: "Contact", item: "https://www.purstech.com/contact" },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(CONTACT_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />

      <ContactClient />
    </>
  );
}
