import type { Metadata } from "next";
import ProClient from "./client";

// ─── Metadata ─────────────────────────────────────────────────────────────────
// QA fixes:
//  ✅ Server component — metadata exports correctly
//  ✅ alternates.canonical added
//  ✅ openGraph + twitter added (critical — pricing pages get shared)
//  ✅ robots added
//  ✅ Product + FAQPage JSON-LD schemas added

export const metadata: Metadata = {
  // Renders: "PursTech Pro — Unlimited Tools from $5/month | PursTech" (55 chars ✅)
  title: "PursTech Pro — Unlimited Tools from $5/month",

  description:
    "Upgrade to PursTech Pro for unlimited tool usage, zero ads, API access, batch processing and priority support. Starting from $5/month. Cancel anytime.",
  // 151 chars ✅

  alternates: { canonical: "/pro" },

  keywords: [
    "purstech pro", "unlimited online tools", "ad free tools",
    "tools api access", "batch processing tools", "pro subscription",
    "purstech subscription", "online tools pro plan",
  ],

  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/pro",
    siteName:    "PursTech",
    title:       "PursTech Pro — Unlimited Tools from $5/month",
    description: "Unlimited tool usage, zero ads, API access, batch processing and priority support. Cancel anytime.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PursTech Pro — Unlimited Tools" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "PursTech Pro — Unlimited Tools from $5/month",
    description: "Unlimited tools, zero ads, API access and batch processing. Less than a coffee a week.",
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
// Product schema with two Offer entries (monthly + annual pricing)
// FAQPage schema matching the FAQS rendered in ProClient

const PRODUCT_SCHEMA = {
  "@context": "https://schema.org",
  "@type":    "Product",
  name:       "PursTech Pro",
  description:"Unlimited access to all 50 PursTech tools — no ads, API access, batch processing and priority support.",
  url:        "https://www.purstech.com/pro",
  brand:      { "@type": "Brand", name: "PursTech" },
  category:   "Software Subscription",
  offers: [
    {
      "@type":           "Offer",
      name:              "PursTech Pro Monthly",
      price:             "7.00",
      priceCurrency:     "USD",
      availability:      "https://schema.org/PreOrder",
      url:               "https://www.purstech.com/pro",
      description:       "Monthly subscription, billed monthly. Cancel anytime.",
      seller:            { "@type": "Organization", name: "PursTech" },
    },
    {
      "@type":           "Offer",
      name:              "PursTech Pro Annual",
      price:             "59.00",
      priceCurrency:     "USD",
      availability:      "https://schema.org/PreOrder",
      url:               "https://www.purstech.com/pro",
      description:       "Annual subscription billed as $59/year. Save 29% vs monthly.",
      seller:            { "@type": "Organization", name: "PursTech" },
    },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type":    "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name:    "When will PursTech Pro launch?",
      acceptedAnswer: { "@type": "Answer", text: "We are finalising the Pro tier and expect to launch within the next 4–8 weeks. Join the waitlist to be notified first and lock in the founding member price." },
    },
    {
      "@type": "Question",
      name:    "What payment methods will PursTech Pro accept?",
      acceptedAnswer: { "@type": "Answer", text: "We will accept all major credit and debit cards, as well as PayPal, processed securely via Stripe." },
    },
    {
      "@type": "Question",
      name:    "Can I cancel my PursTech Pro subscription at any time?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — cancel any time from your account settings. You keep Pro access until the end of your current billing period. No questions asked." },
    },
    {
      "@type": "Question",
      name:    "Will the free tier still exist after Pro launches?",
      acceptedAnswer: { "@type": "Answer", text: "Absolutely. PursTech will always have a generous free tier. Pro is for power users who want unlimited access and extra features." },
    },
    {
      "@type": "Question",
      name:    "Is there a team or business plan?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — we are planning a Teams plan for organisations. Join the waitlist and mention your team size for early access." },
    },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context":        "https://schema.org",
  "@type":           "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.purstech.com"      },
    { "@type": "ListItem", position: 2, name: "Pro",  item: "https://www.purstech.com/pro"  },
  ],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PRODUCT_SCHEMA)    }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <ProClient />
    </>
  );
}
