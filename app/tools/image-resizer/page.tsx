import type { Metadata } from "next";
import ImageResizerClient from "./client";

export const metadata: Metadata = {
  title: "Free Image Resizer — Resize Photos & Pictures Online",

  description:
    "Free image resizer — resize photos and pictures online to exact pixels or with 20+ social media presets (Instagram, Facebook, YouTube).",

  alternates: { canonical: "/tools/image-resizer" },

  keywords: [
    "image resizer online","free image resizer","photo resizer",
    "picture resizer","resize photo","image size reducer",
    "resize image for instagram","social media image resizer",
    "resize image to specific pixels","crop image online",
  ],

  openGraph: {
    type:     "website",
    url:      "https://www.purstech.com/tools/image-resizer",
    siteName: "PursTech",
    // ✅ Removed "| PursTech"
    title:       "Free Image & Photo Resizer Online — 20+ Social Presets",
    description: "Resize images to any dimension with 20+ social media presets. Lock aspect ratio, choose fit mode. Free and browser-based.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Image Resizer — PursTech" }],
  },

  twitter: {
    card: "summary_large_image",
    // ✅ Removed "| PursTech"
    title:       "Free Image & Photo Resizer — Social Media Presets",
    description: "Resize photos to any size with social media presets. Lock aspect ratio. Free, browser-based.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  // ✅ Added — was missing
  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

// ✅ WebApplication — was SoftwareApplication
const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebPage",
  name: "Image Resizer", url: "https://www.purstech.com/tools/image-resizer",
  description: "Free online image resizer with 20+ social media presets for Instagram, Twitter/X, Facebook, LinkedIn and YouTube. Aspect ratio lock, Cover/Contain/Stretch fit modes. 100% browser-based.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "20+ social media presets — Instagram, Twitter/X, Facebook, LinkedIn, YouTube",
    "Aspect ratio lock prevents stretching or squashing",
    "Cover, Contain and Stretch fit modes",
    "Percentage quick presets (25%, 50%, 75%, 100% of original)",
    "Custom width and height in pixels",
    "Output in JPEG, PNG or WebP format with quality slider",
    "Background color for Contain letterbox mode",
    "100% browser-based — images never leave your device",
  ],
};

// ✅ HowTo — 4 steps matching the tool workflow
const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Resize a Photo or Image Online",
  description: "Use PursTech's free Image Resizer to resize any image to exact pixel dimensions instantly.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Upload your image",
      text: "Drop any image onto the page or click to browse. Supports JPEG, PNG, WebP and GIF from any device.",
      url: "https://www.purstech.com/tools/image-resizer" },
    { "@type": "HowToStep", position: 2, name: "Choose a size",
      text: "Pick from 20+ social media presets for perfect platform dimensions, use percentage quick presets (50%, 75%), or enter custom width and height values.",
      url: "https://www.purstech.com/tools/image-resizer" },
    { "@type": "HowToStep", position: 3, name: "Select fit mode and format",
      text: "Choose Cover (crops to fill), Contain (letterboxes empty space) or Stretch. Set output format (JPEG, PNG, WebP) and quality.",
      url: "https://www.purstech.com/tools/image-resizer" },
    { "@type": "HowToStep", position: 4, name: "Resize and download",
      text: "Click Resize Image to generate the preview. Download your resized image in your chosen format immediately.",
      url: "https://www.purstech.com/tools/image-resizer" },
  ],
};

// ✅ FAQPage — 5 questions moved from client, now server-rendered for crawlers
const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I resize an image for Instagram?",
      acceptedAnswer: { "@type": "Answer", text: "Pick an Instagram preset — post (1080×1080), portrait (1080×1350) or story/reel (1080×1920) — and the resizer sets the exact dimensions Instagram expects. Lock the aspect ratio or use Cover mode so nothing looks stretched." } },
    { "@type": "Question", name: "How do I resize an image from MB to KB?",
      acceptedAnswer: { "@type": "Answer", text: "Reducing the pixel dimensions usually shrinks the file size dramatically — resizing a 4000px photo down to 1200px can turn several MB into a few hundred KB. For maximum compression at the same dimensions, run the result through our free Image Compressor." } },
    { "@type": "Question", name: "Does resizing an image reduce its quality?",
      acceptedAnswer: { "@type": "Answer", text: "Upscaling an image (making it larger than the original) will reduce quality because the tool must create pixels that don't exist in the source image. Downscaling (making it smaller) generally maintains excellent quality using bicubic interpolation — our resizer uses the browser's high-quality Canvas API scaling. For best results, always start from the highest resolution source image available." } },
    { "@type": "Question", name: "What does Lock Aspect Ratio mean?",
      acceptedAnswer: { "@type": "Answer", text: "Aspect ratio is the proportional relationship between an image's width and height. When aspect ratio lock is on, changing one dimension automatically adjusts the other to maintain the original proportions. For example, a 1920×1080 image has a 16:9 aspect ratio — if you set the width to 1280, the height automatically becomes 720. This prevents your image from appearing stretched or squashed." } },
    { "@type": "Question", name: "What is the difference between Contain, Cover and Stretch fit modes?",
      acceptedAnswer: { "@type": "Answer", text: "Contain fits the entire image inside the target dimensions while maintaining aspect ratio, leaving empty space (letterboxing) on the sides or top/bottom. Cover fills the entire target area while maintaining aspect ratio, cropping the parts that don't fit. Stretch fills the exact target dimensions by distorting the image. Cover is best for profile pictures and thumbnails; Contain is best for presentations and documents." } },
    { "@type": "Question", name: "What is the maximum image size I can resize?",
      acceptedAnswer: { "@type": "Answer", text: "There is no enforced file size limit since all processing happens in your browser. However, very large images (above 10MP) may slow down processing on older devices because the browser must hold the full image in memory. For best performance with large images, use Google Chrome or Firefox on a desktop computer." } },
    { "@type": "Question", name: "Can I resize to an exact pixel size for social media?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — use our built-in social media presets for perfectly sized images every time. We include precise dimensions for Instagram (square, portrait, story), Twitter/X, Facebook, LinkedIn and YouTube. Click any preset to instantly set the target dimensions, then adjust the fit mode depending on whether you want the image cropped or letterboxed." } },
  ],
};

// ✅ BreadcrumbList — added /categories/image step
const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.purstech.com"                      },
    { "@type": "ListItem", position: 2, name: "Tools",         item: "https://www.purstech.com/tools"                },
    { "@type": "ListItem", position: 3, name: "Image Tools",   item: "https://www.purstech.com/categories/image"     },
    { "@type": "ListItem", position: 4, name: "Image Resizer", item: "https://www.purstech.com/tools/image-resizer"  },
  ],
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />

      <ImageResizerClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            Image Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free Image & Photo Resizer — Resize Pictures to Any Size Online
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
