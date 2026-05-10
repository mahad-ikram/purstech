import type { Metadata } from "next";
import ImageResizerClient from "./client";

export const metadata: Metadata = {
  title:       "Free Image Resizer Online — Resize Images to Any Dimension Instantly | PursTech",
  description: "Resize images online for free. Set custom dimensions, use social media presets (Instagram, Twitter, YouTube), lock aspect ratio and download in JPEG, PNG or WebP.",
  keywords:    ["image resizer online","resize image free","resize photo online","image resize tool","social media image resizer"],
  openGraph: {
    title:       "Free Image Resizer Online | PursTech",
    description: "Resize images to any dimension with 20+ social media presets. Lock aspect ratio. Free and browser-based.",
    url:         "https://www.purstech.com/tools/image-resizer",
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
  description:"Free online image resizer with 20+ social media presets and aspect ratio lock.",
  url:        "https://www.purstech.com/tools/image-resizer",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const FEATURES = [
  "20+ social media presets — Instagram, Twitter, Facebook, LinkedIn, YouTube",
  "Aspect ratio lock prevents stretching or squashing",
  "Cover, Contain and Stretch fit modes",
  "Custom width and height in pixels",
  "Output in JPEG, PNG or WebP format",
  "100% browser-based — images never leave your device",
];

export default function ImageResizerPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />

      <ImageResizerClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            Image Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free Image Resizer Online — Resize Images to Any Dimension Instantly
          </h1>
          <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
            Resize any image to the exact pixel dimensions you need without installing software.
            Choose from 20+ built-in social media presets for Instagram, Twitter/X, Facebook,
            LinkedIn and YouTube. Lock the aspect ratio to prevent distortion, pick how the image
            fills the canvas, and download in JPEG, PNG or WebP. Runs entirely in your browser —
            your images never leave your device.
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
      </ImageResizerClient>
    </>
  );
}