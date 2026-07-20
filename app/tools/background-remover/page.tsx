import type { Metadata } from "next";
import BackgroundRemoverClient from "./client";

export const metadata: Metadata = {
  title: "Free Background Remover — Remove Background from Image",
  description:
    "Free AI background remover — remove the background from any image online and download a transparent PNG. Browser-based (no upload), manual brush refinement and a before/after slider.",
  keywords: [
    "free background remover", "background remover free",
    "remove background from image", "online background remover free",
    "ai background remover", "transparent background",
    "remove background from photo", "png background remover",
    "free background removal", "no upload background remover",
  ],
  alternates: { canonical: "/tools/background-remover" },
  openGraph: {
    title:       "Free Background Remover — Remove Background from Image",
    description: "Remove image backgrounds automatically with free AI. Browser-based — no upload needed. Comparison slider, manual brush refinement and PNG export.",
    url:         "https://www.purstech.com/tools/background-remover",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AI Background Remover — PursTech" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Background Remover — Transparent PNG, No Upload",
    description: "Remove backgrounds automatically using AI in your browser. Manual refinement brushes, comparison slider and transparent PNG export.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebPage",
  name: "AI Background Remover",
  url:  "https://www.purstech.com/tools/background-remover",
  description: "Free AI-powered background removal running entirely in your browser via WebAssembly. No upload, no account required.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "AI-powered automatic background removal using ONNX/WebAssembly",
    "Runs entirely in browser — no server upload",
    "Before/after comparison slider",
    "Manual soft-edge erase and restore brushes",
    "20-step undo history",
    "Background fill with custom colours",
    "Transparent PNG download",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Remove the Background from an Image for Free",
  description: "Use PursTech's free AI Background Remover to automatically remove backgrounds from any image.",
  totalTime: "PT2M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Upload any image",
      text: "Drop or click to upload. Works on people, products, animals, cars, logos — any subject against any background. Supports JPEG, PNG and WebP.",
      url: "https://www.purstech.com/tools/background-remover" },
    { "@type": "HowToStep", position: 2, name: "AI processes automatically",
      text: "Click Remove Background. The neural network runs in your browser, analyses every pixel and produces a clean transparent result. Your image never leaves your device.",
      url: "https://www.purstech.com/tools/background-remover" },
    { "@type": "HowToStep", position: 3, name: "Drag the comparison slider",
      text: "Drag the slider to reveal the before/after difference. Switch between Compare, Result and Original views. Replace the background with any solid colour.",
      url: "https://www.purstech.com/tools/background-remover" },
    { "@type": "HowToStep", position: 4, name: "Refine edges and download",
      text: "Use manual soft-edge erase and restore brushes to perfect any edges. Download as PNG to preserve full transparency for Canva, Figma or any design tool.",
      url: "https://www.purstech.com/tools/background-remover" },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",               item: "https://www.purstech.com"                          },
    { "@type": "ListItem", position: 2, name: "Tools",              item: "https://www.purstech.com/tools"                    },
    { "@type": "ListItem", position: 3, name: "Image Tools",        item: "https://www.purstech.com/categories/image"         },
    { "@type": "ListItem", position: 4, name: "Background Remover", item: "https://www.purstech.com/tools/background-remover" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I make an image with a transparent background?",
      acceptedAnswer: { "@type": "Answer", text: "That is exactly what this tool does. The AI removes the background and exports a PNG with true transparency, ready to drop onto any design, product listing or slide — no checkerboard baked in." } },
    { "@type": "Question", name: "How does the automatic background removal work?",
      acceptedAnswer: { "@type": "Answer", text: "PursTech uses a neural network model (ONNX Runtime) that runs entirely inside your browser using WebAssembly. The model analyses every pixel of your image to classify it as foreground or background and produces a clean transparent result. Your image is never sent to any server. On first use the model downloads (~5MB) and is cached locally for instant future use." } },
    { "@type": "Question", name: "Is my image uploaded anywhere?",
      acceptedAnswer: { "@type": "Answer", text: "No. The AI model downloads to your device once and runs locally in your browser using WebAssembly. Your image is processed entirely in memory — nothing is ever transmitted over the internet. Safe for confidential product photos, personal photos and private documents." } },
    { "@type": "Question", name: "Why does the first removal take longer?",
      acceptedAnswer: { "@type": "Answer", text: "On the very first use the browser downloads the AI model files (~5MB) and compiles them via WebAssembly. This takes 5–20 seconds depending on your connection. After that the model is cached and every subsequent removal completes in 2–5 seconds." } },
    { "@type": "Question", name: "What types of images work best?",
      acceptedAnswer: { "@type": "Answer", text: "The AI works on any type of image — people, animals, products, logos, cars and complex scenes. It produces particularly clean results on people, product photography and animals. For best results use a high-resolution image (at least 512×512px) with reasonable lighting." } },
    { "@type": "Question", name: "Can I refine the result after automatic removal?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — after AI removal, use the Soft Eraser to remove remaining background patches and the Restore brush to bring back accidentally removed subject pixels. Both use a soft-edge brush for natural blending. Undo any number of steps and toggle between original and result at any time." } },
  ],
};

export default function BackgroundRemoverPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <BackgroundRemoverClient />
    </>
  );
}
