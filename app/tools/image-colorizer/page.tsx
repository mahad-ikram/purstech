import type { Metadata } from "next";
import ImageColorizerClient from "./client";

export const metadata: Metadata = {
  title: "Free AI Photo Colorizer — Colorize Black & White Photos Online",
  description:
    "Colorize black and white, vintage, or sepia photos automatically in your browser using DeOldify Artistic ONNX AI and luminance-preserving chroma fusion. 100% private.",
  keywords: [
    "ai photo colorizer", "colorize black and white photos free",
    "deoldify online browser", "restore old photos ai free",
    "black and white to color ai", "vintage photo colorizer no upload",
    "local ai image colorizer", "sepia photo color restoration",
  ],
  alternates: { canonical: "/tools/image-colorizer" },
  openGraph: {
    title: "Free AI Photo Colorizer — Local DeOldify B&W Restoration",
    description: "Restore black and white photographs into vibrant color locally in your browser using DeOldify ONNX Runtime Web and luminance-preserving chroma fusion.",
    url: "https://www.purstech.com/tools/image-colorizer",
    siteName: "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Photo Colorizer — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Photo Colorizer — Restore B&W Photos Locally",
    description: "Colorize black and white photos in your browser with DeOldify ONNX AI. Zero server uploads.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://www.purstech.com/tools/image-colorizer/#software",
  isPartOf: { "@id": "https://www.purstech.com/#website" },
  datePublished: "2026-11-12",
  dateModified: "2026-11-14",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  name: "PursTech AI Photo Colorizer",
  url: "https://www.purstech.com/tools/image-colorizer",
  description: "Client-side AI photo colorization powered by DeOldify Artistic ONNX Runtime Web and full-resolution luminance preservation.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: {
    "@type": "Organization",
    "@id": "https://www.purstech.com/#organization",
    name: "PursTech",
    logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 },
  },
  featureList: [
    "DeOldify Artistic ONNX Neural Colorization (Quantized ~61 MB & Full Precision ~243 MB)",
    "Luminance-Preserving Chroma Fusion (globalCompositeOperation = 'color') keeps 100% of original sharpness",
    "Instant Zero-Download Multi-Zone Vintage Color Restoration Mode",
    "Adjustable Chroma Saturation Boost (60%–160%)",
    "IndexedDB local model caching for offline execution",
    "Interactive before/after split slider and WebP/PNG/JPEG export",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Colorize Black and White Photos with AI in Your Browser",
  description: "Restore vintage family portraits and historical black-and-white photographs with local AI.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Choose Your Colorization Engine",
      text: "Select DeOldify Artistic Quantized (~61 MB), DeOldify Full Precision (~243 MB), or Instant Multi-Zone Tonal Colorizer, and adjust the Chroma Saturation slider.",
      url: "https://www.purstech.com/tools/image-colorizer",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Upload a Black & White or Sepia Photo",
      text: "Drop your historical portrait or landscape onto the dropzone. Processing stays 100% inside your browser.",
      url: "https://www.purstech.com/tools/image-colorizer",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Compare and Download",
      text: "Use the interactive before/after slider to inspect skin tones, foliage, and sky restoration, then export in WebP, PNG, or JPEG.",
      url: "https://www.purstech.com/tools/image-colorizer",
    },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Image Tools", item: "https://www.purstech.com/categories/image" },
    { "@type": "ListItem", position: 4, name: "AI Photo Colorizer", item: "https://www.purstech.com/tools/image-colorizer" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does the colorizer keep my high-resolution photo sharp?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "DeOldify runs neural inference on a 256×256 aspect-preserved grayscale tensor to predict natural chrominance (color channels). Instead of outputting a blurry 256×256 image, our pipeline un-letterboxes the predicted chroma, applies a 1.25px smoothing filter to remove blockiness, and composites ONLY the color channels over your full-resolution original photograph using HTML5 Canvas 'color' blend mode—preserving 100% of original grain and edge sharpness.",
      },
    },
    {
      "@type": "Question",
      name: "Are my family photos uploaded to a server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All inference runs locally via ONNX Runtime Web and WebAssembly. Once the DeOldify model is cached in your browser's IndexedDB, you can colorize unlimited family photos completely offline.",
      },
    },
  ],
};

export default function ImageColorizerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <ImageColorizerClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-3 py-1 text-xs text-amber-400 font-semibold mb-3">
            Image Tools · DeOldify ONNX Color Restoration
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free AI Photo Colorizer — Restore Black &amp; White Photos Locally
          </h1>
          <p className="text-gray-400 max-w-3xl leading-relaxed text-base">
            <strong>PursTech&apos;s AI Photo Colorizer</strong> restores vintage black-and-white, monochrome, and sepia photographs into realistic color directly in your browser using{" "}
            <strong><code className="text-[#00D4FF] font-mono">DeOldify Artistic</code> ONNX neural networks</strong> (Quantized ~61 MB &amp; Full Precision ~243 MB cached in IndexedDB) and{" "}
            <strong>Luminance-Preserving Chroma Fusion</strong> (<code className="text-amber-400 font-mono">globalCompositeOperation = &quot;color&quot;</code>) to preserve 100% of original resolution and edge sharpness.
          </p>
        </div>
      </ImageColorizerClient>
    </>
  );
}
