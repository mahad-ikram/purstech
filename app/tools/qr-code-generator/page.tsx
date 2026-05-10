import type { Metadata } from "next";
import QRCodeGeneratorClient from "./client";

export const metadata: Metadata = {
  title:       "Free QR Code Generator Online — URL, WiFi, Email & vCard | PursTech",
  description: "Generate QR codes instantly for URLs, text, WiFi credentials, email, phone numbers and contacts. Download PNG or SVG. Custom colours, 6 QR types, no login. 100% free.",
  keywords:    [
    "qr code generator","free qr code generator","qr code maker online",
    "wifi qr code generator","qr code for website","qr code url","vcard qr code",
    "qr code png download","qr code svg","custom qr code free",
  ],
  openGraph: {
    type:        "website",
    title:       "Free QR Code Generator — URL, WiFi, Email & vCard | PursTech",
    description: "Generate QR codes for URLs, WiFi, email, phone and contacts. Download PNG or SVG. Custom colours. Free, no login.",
    url:         "https://www.purstech.com/tools/qr-code-generator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free QR Code Generator" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free QR Code Generator | PursTech",
    description: "Create QR codes for URLs, WiFi, email, phone & contacts. PNG + SVG download. Free.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },
  alternates: { canonical: "/tools/qr-code-generator" },
};

const toolSchema = {
  "@context":          "https://schema.org",
  "@type":             "SoftwareApplication",
  name:                "QR Code Generator",
  description:         "Free online QR code generator for URLs, text, WiFi, email, phone numbers and vCard contacts. Supports PNG and SVG download with custom colours.",
  url:                 "https://www.purstech.com/tools/qr-code-generator",
  applicationCategory: "UtilitiesApplication",
  operatingSystem:     "Any",
  featureList: [
    "URL QR code generator",
    "WiFi QR code — scan to connect without typing passwords",
    "Email QR code with subject and body",
    "Phone number QR code",
    "vCard contact QR code",
    "Plain text QR code",
    "Custom foreground and background colours",
    "Error correction levels L, M, Q, H",
    "Download as PNG at 128px, 256px or 512px",
    "Download as SVG for infinite-resolution print",
    "No login required",
    "100% browser-based",
  ],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const breadcrumbSchema = {
  "@context":      "https://schema.org",
  "@type":         "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",              item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",             item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "QR Code Generator", item: "https://www.purstech.com/tools/qr-code-generator" },
  ],
};

const BADGES   = ["Free", "No Login", "PNG & SVG Download", "Custom Colors", "6 QR Types"];
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema)       }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

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
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">
                ✓ {b}
              </span>
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
