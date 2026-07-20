import type { Metadata } from "next";
import ImageToTextClient from "./client";

export const metadata: Metadata = {
  title: "Free Image to Text Converter — Pic to Text OCR Online",
  description: "Free image to text converter — extract text from any image instantly with AI-powered OCR. 30+ languages, word-level accuracy, copy or download.",
  alternates: { canonical: "/tools/image-to-text" },
  keywords: ["image to text","pic to text","picture to text","image to text converter","extract text from image","copy text from image","photo to text converter","convert image to text","img to text","jpg to text","png to text","image to word converter","screenshot to text","handwriting to text"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/image-to-text",
    siteName: "PursTech",
    title: "Free Image to Text (OCR) Converter — Best Online Tool 2026",
    description: "Extract text from images instantly. 30+ languages, word confidence heatmap, image preprocessing, clipboard paste. 100% browser-based — your images never leave your device.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Image to Text OCR Converter" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Image to Text (OCR) — 30+ Languages, Word Confidence",
    description: "Best free OCR tool. Extract text from images — 30+ languages, preprocessing, word-level confidence. 100% browser-based.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebPage",
  name: "Image to Text Converter (OCR)", url: "https://www.purstech.com/tools/image-to-text",
  description: "Free online OCR tool. Extract text from images with 30+ language support, word-level confidence scoring and image preprocessing. Runs entirely in the browser using Tesseract.js WebAssembly.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  featureList: [
    "Extract text from JPEG, PNG, WebP, GIF images",
    "Support for 30+ languages including Arabic, Chinese, Hindi, Japanese",
    "Image preprocessing: contrast, brightness, sharpen, grayscale, invert",
    "Word-level confidence heatmap with colour coding",
    "Clipboard paste support (Ctrl+V)",
    "Camera capture for mobile devices",
    "Image URL input",
    "Batch processing of up to 5 images",
    "Editable output text",
    "Download as TXT file",
    "100% browser-based — no server upload required",
  ],
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Extract Text from an Image Online",
  description: "Use PursTech's free OCR tool to extract text from any image instantly in your browser.",
  totalTime: "PT2M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Upload or paste your image",
      text: "Drop an image, click to browse, paste from clipboard with Ctrl+V, take a photo, or enter an image URL. Supports JPEG, PNG, WebP and GIF.",
      url: "https://www.purstech.com/tools/image-to-text" },
    { "@type": "HowToStep", position: 2, name: "Select language and preprocess",
      text: "Choose the language of the text in your image from 30+ supported languages. Enable preprocessing options (Grayscale, Contrast, Sharpen, Invert) to improve accuracy on difficult images.",
      url: "https://www.purstech.com/tools/image-to-text" },
    { "@type": "HowToStep", position: 3, name: "Extract and review",
      text: "Click Extract Text. The OCR engine analyses your image locally in your browser using WebAssembly — no server upload. Review the word confidence heatmap to spot any errors.",
      url: "https://www.purstech.com/tools/image-to-text" },
    { "@type": "HowToStep", position: 4, name: "Copy or download",
      text: "Edit any mistakes directly in the editable text area, then copy to clipboard or download as a TXT file.",
      url: "https://www.purstech.com/tools/image-to-text" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I copy text from a picture or screenshot?",
      acceptedAnswer: { "@type": "Answer", text: "Paste or upload the picture, click Extract, and the OCR engine turns it into selectable text in seconds — then hit Copy. It works on screenshots, photos of documents, signs and whiteboards, in 30+ languages." } },
    { "@type": "Question", name: "Can I convert an image to a Word document?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — extract the text here, copy it, and paste it into Word or Google Docs with full editing. If your source is a PDF rather than an image, our free PDF to Word tool converts it directly." } },
    { "@type": "Question", name: "What is OCR and how does this image to text converter work?",
      acceptedAnswer: { "@type": "Answer", text: "OCR (Optical Character Recognition) analyses the patterns of pixels in an image to identify and extract text characters. Our tool uses Tesseract.js compiled to WebAssembly so it runs entirely inside your browser. Your image is never sent to any server." } },
    { "@type": "Question", name: "What image formats and types does this OCR tool support?",
      acceptedAnswer: { "@type": "Answer", text: "The tool accepts JPEG, PNG, WebP, GIF and BMP image files. It works on scanned documents, screenshots, photos of printed text, product labels, street signs, whiteboards and books. For best results, images should have a minimum resolution of 300 DPI or approximately 1,000 pixels in the shorter dimension." } },
    { "@type": "Question", name: "How can I improve OCR accuracy for difficult images?",
      acceptedAnswer: { "@type": "Answer", text: "Use the built-in image preprocessing tools before running OCR. Apply Grayscale to remove colour noise. Increase Contrast to make text stand out. Apply Sharpen for blurry characters. Use Invert if your image has white text on a dark background. Selecting the correct language is critical — wrong language selection significantly reduces accuracy." } },
    { "@type": "Question", name: "Is my image data safe when I use this tool?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — completely. All OCR processing happens locally in your browser using WebAssembly. Your images are never transmitted to any server, never stored anywhere, and never sent over the internet. This makes it safe to use for confidential documents, ID images, private contracts and sensitive business materials." } },
    { "@type": "Question", name: "What do the colour-coded confidence scores mean?",
      acceptedAnswer: { "@type": "Answer", text: "After OCR completes, each recognised word is colour-coded by confidence level. Green words (above 90%) were recognised with high confidence. Yellow words (70-90%) are likely correct but worth checking. Red words (below 70%) should be reviewed carefully as they may contain errors." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",         item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Image Tools",   item: "https://www.purstech.com/categories/image" },
    { "@type": "ListItem", position: 4, name: "Image to Text", item: "https://www.purstech.com/tools/image-to-text" },
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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <ImageToTextClient>
        <div className="mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold">
              Image Tools
            </span>
            <span className="bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-full px-3 py-1 text-xs text-[#00D4FF] font-semibold">
              30+ Languages · Word Confidence · 100% Private
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free Image to Text Converter — Picture to Text (OCR)
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
