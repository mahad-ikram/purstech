import type { Metadata } from "next";
import BackgroundRemoverClient from "./client";

export const metadata: Metadata = {
  title:       "Free Background Remover Online — Remove Image Background Instantly | PursTech",
  description: "Remove image backgrounds online for free. Click to select background color, adjust tolerance, and export as transparent PNG. No upload, 100% browser-based.",
  keywords:    ["background remover online free","remove image background","transparent background maker","remove white background","png background remover"],
  openGraph: {
    title:       "Free Background Remover Online | PursTech",
    description: "Remove image backgrounds online — click to select, adjust tolerance, export as transparent PNG. Free and browser-based.",
    url:         "https://purstech.com/tools/background-remover",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Background Remover Online | PursTech",
    description: "Remove backgrounds with click-to-select, tolerance control and transparent PNG export.",
    images:      ["/og-image.png"],
  },
  alternates: { canonical: "/tools/background-remover" },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type":    "SoftwareApplication",
  name:       "Background Remover",
  description:"Free online background remover — click to select background color, adjust tolerance and export as transparent PNG.",
  url:        "https://purstech.com/tools/background-remover",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function BackgroundRemoverPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <BackgroundRemoverClient />
    </>
  );
}
