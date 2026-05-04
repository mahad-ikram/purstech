import type { Metadata } from "next";
import ImageToTextClient from "./client";

export const metadata: Metadata = {
  title:       "Free Image to Text Converter Online — OCR Tool Extract Text from Images | PursTech",
  description: "Extract text from any image instantly using OCR. Supports 30+ languages including Arabic, Chinese and Hindi. Copy or download results. 100% browser-based, free, no login.",
  keywords:    ["image to text","ocr online free","extract text from image","image text extractor","tesseract ocr online"],
  openGraph: {
    title:       "Free Image to Text Converter — OCR Online | PursTech",
    description: "Extract text from images with OCR. 30+ languages, confidence score, copy and download. Free and browser-based.",
    url:         "https://purstech.com/tools/image-to-text",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Image to Text (OCR) | PursTech",
    description: "Extract text from images — 30+ languages, confidence score, copy & download.",
    images:      ["/og-image.png"],
  },
  alternates: { canonical: "/tools/image-to-text" },
};

const toolSchema = {
  "@context": "https://schema.org",
  "@type":    "SoftwareApplication",
  name:       "Image to Text Converter (OCR)",
  description:"Free online OCR tool to extract text from images. Supports 30+ languages. Browser-based.",
  url:        "https://purstech.com/tools/image-to-text",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

export default function ImageToTextPage() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }} />
      <ImageToTextClient />
    </>
  );
}
