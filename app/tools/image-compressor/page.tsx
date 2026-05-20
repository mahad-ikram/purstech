import type { Metadata } from "next";
import ImageCompressorClient from "./client";

export const metadata: Metadata = {
  // Renders: "Free Image Compressor — JPEG, PNG & WebP | PursTech" (52 chars ✅)
  title: "Free Image Compressor — JPEG, PNG & WebP",

  description:
    "Compress JPEG, PNG and WebP images online for free. Reduce file size by up to 90% with a live before/after preview. No upload limit, no login, browser-based.",

  alternates: { canonical: "/tools/image-compressor" },

  keywords: [
    "image compressor online","compress images free","reduce image file size",
    "jpeg compressor","png compressor online","webp converter",
    "batch image compressor","compress images without losing quality",
  ],

  openGraph: {
    type:     "website",
    url:      "https://www.purstech.com/tools/image-compressor",
    siteName: "PursTech",
    // ✅ Removed "| PursTech" — was double-branding
    title:       "Free Image Compressor Online — Reduce Image Size Without Losing Quality",
    description: "Compress JPEG, PNG and WebP images by up to 90% with live before/after preview. Free, browser-based, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Image Compressor — PursTech" }],
  },

  twitter: {
    card: "summary_large_image",
    // ✅ Removed "| PursTech"
    title:       "Free Image Compressor Online",
    description: "Compress images by up to 90% — JPEG, PNG, WebP. Free and browser-based.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  // ✅ Added — was missing entirely
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// ✅ WebApplication — was SoftwareApplication
const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Image Compressor", url: "https://www.purstech.com/tools/image-compressor",
  description: "Free online image compressor. Reduce JPEG, PNG and WebP file sizes by up to 90%. Batch compress up to 20 images with quality slider, format converter and live before/after comparison. 100% browser-based.",
  applicationCategory: "MultimediaApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript and HTML5 Canvas API", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "Batch compress up to 20 images at once",
    "Quality slider from maximum compression to best quality",
    "Convert to WebP for 25–35% extra size reduction",
    "Side-by-side before/after comparison per image",
    "Real-time file size and savings percentage display",
    "Quality presets: Web, Email, Print, Maximum",
    "Your images never leave your device — 100% private",
  ],
};

// ✅ HowTo — 4 steps matching the tool workflow
const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Compress Images Online",
  description: "Use PursTech's free Image Compressor to reduce JPEG, PNG and WebP file sizes instantly.",
  totalTime: "PT2M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Upload your images",
      text: "Drop images onto the upload zone or click to browse. You can upload up to 20 images at once for batch compression.",
      url: "https://www.purstech.com/tools/image-compressor" },
    { "@type": "HowToStep", position: 2, name: "Choose quality and format",
      text: "Adjust the quality slider or pick a preset (Web 80%, Email 70%, Print 92%). Select WebP for the best compression, or keep Auto to preserve the original format.",
      url: "https://www.purstech.com/tools/image-compressor" },
    { "@type": "HowToStep", position: 3, name: "Preview the results",
      text: "Each compressed image shows the new file size and percentage savings. Click Compare to see a side-by-side before/after comparison.",
      url: "https://www.purstech.com/tools/image-compressor" },
    { "@type": "HowToStep", position: 4, name: "Download",
      text: "Click Save next to any image to download it. Use Download All to save every compressed image at once.",
      url: "https://www.purstech.com/tools/image-compressor" },
  ],
};

// ✅ FAQPage — 5 questions from client, now server-rendered for crawlers
const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How much can I compress an image without losing visible quality?",
      acceptedAnswer: { "@type": "Answer", text: "For JPEG images, a quality setting of 70–85% typically reduces file size by 60–80% with no visible quality loss to the human eye at normal viewing distances. WebP achieves 25–35% better compression than JPEG at the same visual quality. Our quality slider lets you find the perfect balance for your specific image and use case." } },
    { "@type": "Question", name: "Is my image data safe when I use this compressor?",
      acceptedAnswer: { "@type": "Answer", text: "Completely. All compression happens directly in your browser using the HTML5 Canvas API. Your images are never uploaded to any server, never stored, and never transmitted over the internet. They exist only in your browser's memory during compression and are gone the moment you close the tab." } },
    { "@type": "Question", name: "What is the difference between JPEG, PNG and WebP compression?",
      acceptedAnswer: { "@type": "Answer", text: "JPEG uses lossy compression — permanently removing some image data — which produces very small files but with some quality degradation at extreme settings. PNG uses lossless compression, preserving every pixel perfectly but producing larger files. WebP is a modern format that outperforms both — achieving smaller files than JPEG at the same visual quality, with both lossy and lossless modes. For most web images, converting to WebP provides the best results." } },
    { "@type": "Question", name: "Why does my compressed PNG sometimes end up larger than the original?",
      acceptedAnswer: { "@type": "Answer", text: "PNG uses lossless compression, which means reducing file size is limited by how compressible the image data actually is. If your PNG contains a complex photograph with millions of unique color values, compression gains are minimal and can sometimes increase file size slightly. For photographs, convert to JPEG or WebP instead. PNG is ideal for logos, icons and graphics with large areas of flat color." } },
    { "@type": "Question", name: "Can I compress multiple images at once?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — our batch compression feature lets you upload and compress up to 20 images simultaneously. Each image is processed independently with your chosen quality and format settings. Download each compressed image individually or use Download All to save them all at once. Batch processing works entirely in your browser with no server needed." } },
  ],
};

// ✅ BreadcrumbList — added /categories/image step
const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",             item: "https://www.purstech.com"                         },
    { "@type": "ListItem", position: 2, name: "Tools",            item: "https://www.purstech.com/tools"                   },
    { "@type": "ListItem", position: 3, name: "Image Tools",      item: "https://www.purstech.com/categories/image"        },
    { "@type": "ListItem", position: 4, name: "Image Compressor", item: "https://www.purstech.com/tools/image-compressor"  },
  ],
};

const FEATURES = [
  "Batch compress up to 20 images at once",
  "Quality slider from maximum compression to best quality",
  "Convert to WebP for 25–35% extra size reduction",
  "Side-by-side before/after comparison per image",
  "Real-time file size and savings percentage display",
  "Your images never leave your device — 100% private",
];

export default function ImageCompressorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />

      <ImageCompressorClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            Image Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free Image Compressor Online — Reduce Image Size Without Losing Quality
          </h1>
          <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
            Large images are one of the biggest causes of slow websites and poor Google PageSpeed
            scores. Compress JPEG, PNG and WebP images by up to 90% with a live before/after
            preview. Batch compress up to 20 images at once. 100% browser-based — your images
            never leave your device, no server uploads, no privacy risk.
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
      </ImageCompressorClient>
    </>
  );
}
