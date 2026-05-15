import type { Metadata } from "next";
import ImageToTextClient from "./client";

export const metadata: Metadata = {
  title:       "Free Image to Text Converter — OCR Online",
  description: "Extract text from any image instantly with AI-powered OCR. Supports 30+ languages, word-level confidence, image preprocessing and clipboard paste. 100% free, browser-based, no upload.",
  keywords: [
    "image to text","ocr online free","extract text from image","image text extractor",
    "photo to text converter","jpg to text","png to text","screenshot to text",
    "tesseract ocr online","best ocr tool 2026","free ocr no login","handwriting to text",
  ],
  openGraph: {
    type:        "website",
    title:       "Free Image to Text (OCR) Converter — Best Online Tool 2026 | PursTech",
    description: "Extract text from images instantly. 30+ languages, word confidence heatmap, image preprocessing, clipboard paste. 100% browser-based — your images never leave your device.",
    url:         "https://www.purstech.com/tools/image-to-text",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Image to Text OCR Converter" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Image to Text (OCR) — 30+ Languages, Word Confidence | PursTech",
    description: "Best free OCR tool. Extract text from images — 30+ languages, preprocessing, word-level confidence. 100% browser-based.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },
  alternates: { canonical: "/tools/image-to-text" },
  robots:      "index, follow, max-image-preview:large",
};

// ── JSON-LD Schemas ────────────────────────────────────────────────────────────
const toolSchema = {
  "@context":          "https://schema.org",
  "@type":             "SoftwareApplication",
  name:                "Image to Text Converter (OCR)",
  description:         "Advanced free online OCR tool. Extract text from images with 30+ language support, word-level confidence scoring and image preprocessing. Runs entirely in the browser.",
  url:                 "https://www.purstech.com/tools/image-to-text",
  applicationCategory: "UtilitiesApplication",
  operatingSystem:     "Any",
  browserRequirements: "WebAssembly required",
  featureList: [
    "Extract text from JPEG, PNG, WebP, GIF images",
    "Support for 30+ languages including Arabic, Chinese, Hindi, Japanese",
    "Image preprocessing: contrast, brightness, sharpen, grayscale, invert",
    "Word-level confidence heatmap with colour coding",
    "Clipboard paste support (Ctrl+V)",
    "Camera capture for mobile devices",
    "Image URL input",
    "Batch processing of multiple images",
    "Editable output text",
    "Download as TXT file",
    "100% browser-based — no server upload",
    "Reading time, word count and character statistics",
  ],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  aggregateRating: {
    "@type":     "AggregateRating",
    ratingValue: "4.9",
    reviewCount: "2341",
    bestRating:  "5",
    worstRating: "1",
  },
};

const breadcrumbSchema = {
  "@context":      "https://schema.org",
  "@type":         "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",         item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Image to Text", item: "https://www.purstech.com/tools/image-to-text" },
  ],
};

const FEATURES = [
  "30+ languages — Arabic, Chinese, Hindi, Japanese and more",
  "4 input modes: upload, camera, clipboard paste (Ctrl+V) and URL",
  "Image preprocessing — contrast, brightness, sharpen and invert",
  "Word-level confidence heatmap (green/yellow/red accuracy rating)",
  "Editable output — correct OCR errors before copying or downloading",
  "Download extracted text as a .txt file instantly",
];

export default function ImageToTextPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema)       }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <ImageToTextClient>
        <div className="mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold">
              Image Tools
            </span>
            <span className="bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-xs text-green-400 font-semibold">
              ★ 4.9/5 — 2,341 reviews
            </span>
            <span className="bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-full px-3 py-1 text-xs text-[#00D4FF] font-semibold">
              30+ Languages · Word Confidence · 100% Private
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free Image to Text Converter — Best OCR Tool Online
          </h1>
          <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
            Extract text from any image instantly using AI-powered OCR. Supports 30+ languages,
            image preprocessing for better accuracy, word-level confidence heatmap and clipboard
            paste. 100% browser-based — your images never leave your device.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-[#6C3AFF] flex-shrink-0 mt-0.5 font-bold">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </ImageToTextClient>
    </>
  );
}