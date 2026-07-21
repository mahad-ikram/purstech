import type { Metadata } from "next";
import QRCodeGeneratorClient from "./client";

export const metadata: Metadata = {
  title: "Free QR Code Generator Online — URL, WiFi, Email & vCard",
  description: "Free QR code generator — create QR codes instantly for URLs, text, WiFi, email, phone and contacts. Custom colours and high-resolution PNG download.",
  alternates: { canonical: "/tools/qr-code-generator" },
  keywords: ["qr code generator","free qr code generator","qr code maker","wifi qr code generator","generate qr code for wifi","qr code generator for google forms","facebook qr code generator","qr code for website","vcard qr code","qr code png download","qr code svg","custom qr code free"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/qr-code-generator",
    siteName: "PursTech",
    title: "Free QR Code Generator — URL, WiFi, Email & vCard",
    description: "Generate QR codes for URLs, WiFi, email, phone and contacts. PNG + SVG download. Custom colours. Free, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free QR Code Generator" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Generator — URL, WiFi, Email & vCard",
    description: "Create QR codes for URLs, WiFi, email, phone & contacts. PNG + SVG download. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  name: "QR Code Generator", url: "https://www.purstech.com/tools/qr-code-generator",
  description: "Free online QR code generator for URLs, text, WiFi, email, phone numbers and vCard contacts. Supports PNG and SVG download with custom colours and error correction levels.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "URL QR code generator",
    "WiFi QR code — scan to connect without typing passwords",
    "Email QR code with subject and body pre-filled",
    "Phone number QR code",
    "vCard contact QR code",
    "Plain text QR code",
    "Custom foreground and background colours",
    "Error correction levels L, M, Q, H",
    "Download as PNG at 128px, 256px or 512px",
    "Download as SVG for infinite-resolution print",
    "Live QR data preview — verify encoded content",
    "No login required — 100% browser-based",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Generate a QR Code Online",
  description: "Use PursTech's free QR Code Generator to create a scannable QR code in seconds.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose QR type",
      text: "Select what your QR code should do — open a URL, share WiFi credentials, save a contact, dial a phone number, pre-fill an email, or display text.",
      url: "https://www.purstech.com/tools/qr-code-generator" },
    { "@type": "HowToStep", position: 2, name: "Enter your content",
      text: "Fill in the fields for your chosen type. The QR code preview updates instantly as you type. Verify the encoded data shown below the preview.",
      url: "https://www.purstech.com/tools/qr-code-generator" },
    { "@type": "HowToStep", position: 3, name: "Customise colours and download",
      text: "Optionally pick custom QR and background colours, set the error correction level (H for print), then download as PNG or SVG. Always scan-test before printing in bulk.",
      url: "https://www.purstech.com/tools/qr-code-generator" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I make a WiFi QR code?",
      acceptedAnswer: { "@type": "Answer", text: "Choose the WiFi type, enter your network name (SSID), password and security type, and download the code. Guests scan it with their phone camera and connect instantly — no typing the password." } },
    { "@type": "Question", name: "Can I make a QR code for a Google Form, Facebook page or any link?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — any link works. Pick the URL type and paste the address of your Google Form, Facebook page, Instagram profile, menu or website. The QR code opens that link when scanned, and it never expires." } },
    { "@type": "Question", name: "What is a QR code?",
      acceptedAnswer: { "@type": "Answer", text: "A QR (Quick Response) code is a 2D barcode that stores information — like a URL, text, or contact details — readable instantly by a phone camera. Invented in 1994, they are now used everywhere from product packaging to payment systems." } },
    { "@type": "Question", name: "How do I scan a QR code?",
      acceptedAnswer: { "@type": "Answer", text: "On iPhone: open the Camera app and point it at the QR code — a notification appears automatically. On Android: same with the Camera app, or use Google Lens. No special app needed on modern phones." } },
    { "@type": "Question", name: "What is error correction level?",
      acceptedAnswer: { "@type": "Answer", text: "Error correction allows QR codes to be read even if partially damaged or covered. Level L = 7% damage tolerance, M = 15%, Q = 25%, H = 30%. Use H if you plan to print on physical materials." } },
    { "@type": "Question", name: "Can I use the QR code commercially?",
      acceptedAnswer: { "@type": "Answer", text: "Yes, completely. QR codes generated here are yours to use however you like — websites, business cards, packaging, marketing materials, anywhere." } },
    { "@type": "Question", name: "What is the best size to print a QR code?",
      acceptedAnswer: { "@type": "Answer", text: "For print, a minimum of 2cm x 2cm is recommended. For large format (banners, posters), use at least 10cm x 10cm. Download SVG format for print — it scales to any size without quality loss. Always scan-test before printing in bulk." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",                  item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",                 item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Dev Tools",             item: "https://www.purstech.com/categories/dev" },
    { "@type": "ListItem", position: 4, name: "QR Code Generator",     item: "https://www.purstech.com/tools/qr-code-generator" },
  ],
};

const BADGES   = ["Free","No Login","PNG & SVG Download","Custom Colors","6 QR Types"];
const FEATURES = [
  "6 QR types: URL, text, WiFi, email, phone and vCard contact",
  "Custom QR colour and background colour picker",
  "Error correction levels L / M / Q / H",
  "Download as PNG (128 / 256 / 512 px) or SVG for print",
  "Live preview — QR updates instantly as you type",
  "No login, no watermark, no usage limits",
];

export default function QRCodeGeneratorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <QRCodeGeneratorClient>
        <div className="mb-8">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-4xl mt-1 flex-shrink-0">🔗</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Free QR Code Generator Online — URL, WiFi, Email &amp; vCard
              </h1>
              <p className="text-gray-400 mt-2 max-w-2xl leading-relaxed">
                Generate QR codes instantly for any purpose. Share a website link, let guests
                connect to WiFi without typing the password, save a contact, or send a
                pre-written email — all scannable from any phone camera. Download as PNG or
                SVG. No login, no watermark, completely free.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 mb-5">
            {BADGES.map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {b}</span>
            ))}
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-[#6C3AFF] flex-shrink-0 mt-0.5 font-bold">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </QRCodeGeneratorClient>
    </>
  );
}
