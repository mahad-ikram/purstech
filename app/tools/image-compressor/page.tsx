import type { Metadata } from "next";
import ImageCompressorClient from "./client";

export const metadata: Metadata = {
  title:       "Free Image Compressor — JPEG, PNG & WebP",
  description: "Compress JPEG, PNG and WebP images online for free. Reduce file size by up to 90% with a live before/after preview. No upload limit, no login, browser-based.",
  keywords:    ["image compressor online","compress images free","reduce image file size","jpeg compressor","png compressor online"],
  openGraph: {
    title:       "Free Image Compressor Online | PursTech",
    description: "Compress JPEG, PNG and WebP images by up to 90% with live before/after preview. Free, browser-based, no login.",
    url:         "https://www.purstech.com/tools/image-compressor",
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
  url:        "https://www.purstech.com/tools/image-compressor",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(toolSchema) }}
      />

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