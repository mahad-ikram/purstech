import type { Metadata } from "next";
import PasswordGeneratorClient from "./client";

export const metadata: Metadata = {
  title: "Free Password Generator — Cryptographically Secure",
  description: "Generate strong, random, cryptographically secure passwords instantly. Set length, character types and entropy. 100% private — nothing is ever stored or sent to any server.",
  alternates: { canonical: "/tools/password-generator" },
  keywords: ["password generator","secure password generator","random password generator","strong password maker","cryptographic password free"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/password-generator",
    siteName: "PursTech",
    title: "Free Password Generator — Cryptographically Secure",
    description: "Generate strong, secure passwords instantly. Entropy meter, custom length and character sets. 100% private. Free, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Password Generator — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Password Generator — Cryptographically Secure",
    description: "Secure passwords with entropy meter, custom length and character sets. 100% private.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Password Generator", url: "https://www.purstech.com/tools/password-generator",
  description: "Free cryptographically secure password generator. Custom length (6–64), character type selection, ambiguous character exclusion, entropy meter, batch generation and .txt export.",
  applicationCategory: "SecurityApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "Uses crypto.getRandomValues — not Math.random",
    "Custom length from 6 to 64 characters",
    "Uppercase, lowercase, numbers and symbols toggles",
    "Exclude ambiguous characters (I, l, 1, O, 0)",
    "Real-time entropy meter in bits",
    "Generate 1, 5 or 10 passwords at once",
    "Copy single or all passwords to clipboard",
    "Download batch as .txt file",
    "100% browser-based — nothing sent to any server",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Generate a Secure Password",
  description: "Use PursTech's free Password Generator to create cryptographically secure passwords instantly.",
  totalTime: "PT30S",
  step: [
    { "@type": "HowToStep", position: 1, name: "Set password length",
      text: "Drag the slider to choose a length between 6 and 64 characters. 16+ characters is recommended for most accounts.",
      url: "https://www.purstech.com/tools/password-generator" },
    { "@type": "HowToStep", position: 2, name: "Choose character types",
      text: "Enable uppercase, lowercase, numbers and symbols for maximum entropy. Check Exclude Ambiguous to avoid characters that look similar (I, l, 1, O, 0).",
      url: "https://www.purstech.com/tools/password-generator" },
    { "@type": "HowToStep", position: 3, name: "Click Generate",
      text: "Click Generate Password to instantly create cryptographically secure passwords using your browser's crypto.getRandomValues API.",
      url: "https://www.purstech.com/tools/password-generator" },
    { "@type": "HowToStep", position: 4, name: "Copy and store",
      text: "Click Copy next to any password, or Copy All / Download .txt for a batch. Store passwords in a password manager like Bitwarden or 1Password.",
      url: "https://www.purstech.com/tools/password-generator" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How does the password generator work?",
      acceptedAnswer: { "@type": "Answer", text: "It uses your browser's built-in cryptographically secure random number generator (crypto.getRandomValues) to pick characters from the character sets you select. This is far more secure than Math.random() and is the same API used by professional security tools." } },
    { "@type": "Question", name: "Is my generated password stored anywhere?",
      acceptedAnswer: { "@type": "Answer", text: "No. Everything happens entirely in your browser. No password is ever sent to any server. Your generated passwords are 100% private and leave no trace." } },
    { "@type": "Question", name: "What makes a password strong?",
      acceptedAnswer: { "@type": "Answer", text: "Length is the single biggest factor. A 20-character password with mixed characters is exponentially harder to crack than a 10-character one. We recommend at least 16 characters with uppercase, lowercase, numbers and symbols, giving 80+ bits of entropy." } },
    { "@type": "Question", name: "What is password entropy?",
      acceptedAnswer: { "@type": "Answer", text: "Entropy measures how unpredictable a password is in bits. It is calculated as length multiplied by log2(pool size). A 16-character password with all character types has about 100 bits of entropy — effectively uncrackable with current hardware." } },
    { "@type": "Question", name: "Should I use a password manager?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — always. Use this tool to generate strong passwords, then store them in a password manager like Bitwarden (free and open-source) or 1Password so you never need to remember them. Never reuse passwords across accounts." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                  item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",                 item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Security Tools",        item: "https://www.purstech.com/categories/security" },
    { "@type": "ListItem", position: 4, name: "Password Generator",    item: "https://www.purstech.com/tools/password-generator" },
  ],
};

export default function PasswordGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <PasswordGeneratorClient />
    </>
  );
}
