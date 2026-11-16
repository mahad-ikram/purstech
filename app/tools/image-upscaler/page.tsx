import type { Metadata } from "next";
import ImageUpscalerClient from "./client";

export const metadata: Metadata = {
  title: "Free 4× AI Image Upscaler — Enhance & Upscale Photos Online",
  description:
    "Upscale images 2× to 4× using local Swin2SR ONNX Transformer AI or Edge-Directed Lanczos-3 Super-Resolution in your browser. 100% private, zero server uploads.",
  keywords: [
    "ai image upscaler", "free image upscaler", "4x image upscaler online",
    "upscale image without losing quality", "swin2sr browser upscaler",
    "enhance photo resolution free", "super resolution online free",
    "local ai image enhancer", "enlarge image 4x free",
  ],
  alternates: { canonical: "/tools/image-upscaler" },
  openGraph: {
    title: "Free 4× AI Image Upscaler — Local Swin2SR Super-Resolution",
    description: "Enhance image resolution up to 4× with on-device Swin2SR ONNX AI and tiled patch inference. 100% private, works offline after caching.",
    url: "https://www.purstech.com/tools/image-upscaler",
    siteName: "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "4× AI Image Upscaler — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free 4× AI Image Upscaler — No Server Upload",
    description: "Upscale photos 2× to 4× locally in your browser using Swin2SR ONNX WebAssembly and overlapping tile super-resolution.",
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
  "@id": "https://www.purstech.com/tools/image-upscaler/#software",
  isPartOf: { "@id": "https://www.purstech.com/#website" },
  datePublished: "2026-11-12",
  dateModified: "2026-11-14",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  name: "PursTech 4× AI Image Upscaler",
  url: "https://www.purstech.com/tools/image-upscaler",
  description: "Client-side 4× AI image super-resolution powered by Swin2SR ONNX Runtime Web and overlapping tile processing.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: {
    "@type": "Organization",
    "@id": "https://www.purstech.com/#organization",
    name: "PursTech",
    logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 },
  },
  featureList: [
    "4× Neural Super-Resolution via Swin2SR (Quantized ~18 MB & FP16 ~36 MB)",
    "Overlapping Tiled Patch Engine (32px, 64px, 128px) prevents seam artifacts and OOM crashes",
    "Instant Edge-Directed Lanczos + Unsharp Mask 2×/4× Super-Resolution Mode",
    "IndexedDB local model caching for offline execution",
    "Automatic alpha-channel transparency preservation",
    "Interactive before/after split comparison slider and WebP/PNG/JPEG export",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How to Upscale an Image 4× Without Losing Quality",
  description: "Enhance low-resolution photos, product shots, and AI art up to 4× locally in your browser.",
  totalTime: "PT1M",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Select Your Super-Resolution Engine & Tile Mode",
      text: "Choose between Swin2SR x4 Quantized (~18 MB), Swin2SR x4 FP16 (~36 MB), or Instant Edge-Directed 2×/4× Upscaling, and select Performance (32px), Balanced (64px), or Quality (128px) tile overlap.",
      url: "https://www.purstech.com/tools/image-upscaler",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Drop or Upload Your Image",
      text: "Upload any PNG, JPEG, or WebP image. Transparent PNGs and WebPs retain their full alpha channel during upscaling.",
      url: "https://www.purstech.com/tools/image-upscaler",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Compare Before & After and Export",
      text: "Inspect fine textures with the interactive split comparison slider and export your high-resolution result as WebP, PNG, or JPEG.",
      url: "https://www.purstech.com/tools/image-upscaler",
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
    { "@type": "ListItem", position: 4, name: "AI Image Upscaler", item: "https://www.purstech.com/tools/image-upscaler" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does Swin2SR 4× tiled super-resolution work in the browser?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Swin2SR is a Swin Transformer neural network trained on BSRGAN real-world image degradations (compression artifacts, sensor noise, and blur). To prevent browser memory overflow on large photos, our engine divides the image into overlapping patches (32×32, 64×64, or 128×128 pixels with 1–4px reflective padding), runs ONNX WebAssembly inference on each tile, strips the padded border, and stitches a seamless 4× output up to 8192×8192 pixels.",
      },
    },
    {
      "@type": "Question",
      name: "Are my images uploaded to any external server?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Never. The ONNX model weights download once from HuggingFace CDN and persist in your browser's IndexedDB storage. Every pixel calculation happens 100% locally on your device.",
      },
    },
    {
      "@type": "Question",
      name: "Does the upscaler preserve transparent backgrounds?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. When an input PNG or WebP contains alpha transparency, the engine upscales the RGB channels via Swin2SR and high-precision bicubic alpha interpolation, compositing them into a crisp transparent 4× output.",
      },
    },
  ],
};

export default function ImageUpscalerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <ImageUpscalerClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-full px-3 py-1 text-xs text-[#3B82F6] font-semibold mb-3">
            Image Tools · ONNX Super-Resolution
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free 4× AI Image Upscaler — Swin2SR Neural Super-Resolution
          </h1>
          <p className="text-gray-400 max-w-3xl leading-relaxed text-base">
            <strong>PursTech&apos;s 4× AI Image Upscaler</strong> enlarges low-resolution photos, e-commerce product shots, and AI artwork up to{" "}
            <strong>400% (8192×8192 px)</strong> directly in your browser using{" "}
            <strong><code className="text-[#00D4FF] font-mono">Swin2SR</code> ONNX Vision Transformer tiles</strong> (Quantized ~18 MB &amp; FP16 ~36 MB cached in IndexedDB) or{" "}
            <strong>Instant 2×/4× Edge-Directed Super-Resolution</strong>—100% private with full alpha transparency preservation and zero server uploads.
          </p>
        </div>
      </ImageUpscalerClient>
    </>
  );
}
