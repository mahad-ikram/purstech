import type { Metadata } from "next";
import ImageResizerClient from "./client";

export const metadata: Metadata = {
  title:       "Free Image Resizer Online — Resize Images to Any Dimension Instantly | PursTech",
  description: "Resize images online for free. Set custom dimensions, use social media presets (Instagram, Twitter, YouTube), lock aspect ratio and download in JPEG, PNG or WebP.",
  keywords:    ["image resizer online","resize image free","resize photo online","image resize tool","social media image resizer"],
  openGraph: {
    title:       "Free Image Resizer Online | PursTech",
    description: "Resize images to any dimension with 20+ social media presets. Lock aspect ratio. Free and browser-based.",
    url:         "https://purstech.com/tools/image-resizer",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Image Resizer Online | PursTech",
    description: "Resize photos to any size with social media presets. Free, browser-based.",
    images:      ["/og-image.png"],
  },
  alternates: { canonical: "/tools/image-resizer" },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type":    "SoftwareApplication",
  name:       "Image Resizer",
  description:"Free online image resizer with social media presets and aspect ratio lock.",
  url:        "https://purstech.com/tools/image-resizer",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function ImageResizerPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <ImageResizerClient />
    </>
  );
}
