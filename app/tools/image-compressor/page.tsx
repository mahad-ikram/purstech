import type { Metadata } from "next";
import ImageCompressorClient from "./client";

export const metadata: Metadata = {
  title:       "Free Image Compressor Online — Reduce Image Size Without Losing Quality | PursTech",
  description: "Compress JPEG, PNG and WebP images online for free. Reduce file size by up to 90% with a live before/after preview. No upload limit, no login, browser-based.",
  keywords:    ["image compressor online","compress images free","reduce image file size","jpeg compressor","png compressor online"],
  openGraph: {
    title:       "Free Image Compressor Online | PursTech",
    description: "Compress JPEG, PNG and WebP images by up to 90% with live before/after preview. Free, browser-based, no login.",
    url:         "https://purstech.com/tools/image-compressor",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Image Compressor Online | PursTech",
    description: "Compress images by up to 90% — JPEG, PNG, WebP. Free and browser-based.",
    images:      ["/og-image.png"],
  },
  alternates: { canonical: "/tools/image-compressor" },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type":    "SoftwareApplication",
  name:       "Image Compressor",
  description:"Free online image compressor — reduce JPEG, PNG and WebP file size by up to 90%.",
  url:        "https://purstech.com/tools/image-compressor",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function ImageCompressorPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <ImageCompressorClient />
    </>
  );
}
