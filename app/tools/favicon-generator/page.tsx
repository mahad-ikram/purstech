import type { Metadata } from "next";
import FaviconGeneratorClient from "./client";

export const metadata: Metadata = {
  title:       "Free Favicon Generator Online — Create favicon.ico & All Sizes Instantly | PursTech",
  description: "Generate favicons in all required sizes from any image — favicon.ico, 16×16, 32×32, Apple Touch Icon 180×180, Android 192×192 and more. Get the HTML code too.",
  keywords:    ["favicon generator","create favicon online","favicon.ico generator","apple touch icon generator","favicon from image"],
  openGraph: {
    title:       "Free Favicon Generator Online | PursTech",
    description: "Generate all favicon sizes from any image — including favicon.ico and Apple Touch Icon. Get HTML code instantly. Free, browser-based.",
    url:         "https://purstech.com/tools/favicon-generator",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Favicon Generator Online | PursTech",
    description: "Generate all favicon sizes + Apple Touch Icon + HTML code. Free and instant.",
    images:      ["/og-image.png"],
  },
  alternates: { canonical: "/tools/favicon-generator" },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type":    "SoftwareApplication",
  name:       "Favicon Generator",
  description:"Free online favicon generator — creates all required sizes from any image including favicon.ico and Apple Touch Icon.",
  url:        "https://purstech.com/tools/favicon-generator",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function FaviconGeneratorPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <FaviconGeneratorClient />
    </>
  );
}
