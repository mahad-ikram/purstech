import type { Metadata } from "next";
import PDFCompressorClient from "./client";

export const metadata: Metadata = {
  title: "Free PDF File Compressor — Compress PDF Online",
  description: "Free online PDF file compressor — reduce PDF size by up to 80% with three compression levels, metadata removal and batch processing. No upload to a server, 100% browser-based.",
  alternates: { canonical: "/tools/pdf-compressor" },
  keywords: ["pdf compressor","pdf file compressor","free pdf compressor","online pdf compressor","pdf size compressor","reduce pdf size","pdf compressor to 200kb","compress pdf without losing quality"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/pdf-compressor",
    siteName: "PursTech",
    title: "Free PDF File Compressor — Reduce PDF Size by 80%",
    description: "Reduce PDF file size by up to 80%. Batch compress, remove metadata, three compression levels. Free and browser-based.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Compressor — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF File Compressor — Compress PDF Online",
    description: "Batch compress PDF files, strip metadata, three levels. 100% browser-based. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebPage",
  name: "PDF Compressor", url: "https://www.purstech.com/tools/pdf-compressor",
  description: "Free browser-based PDF compressor. Reduce PDF size by up to 80% with three compression levels (Light, Medium, Maximum), metadata removal, batch processing and ZIP download.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Three compression levels: Light (5-15%), Medium (15-35%), Maximum (25-50%)",
    "Batch compress multiple PDFs simultaneously",
    "Remove embedded metadata (author, creator, dates)",
    "Real-time before/after file size comparison with savings percentage",
    "Download compressed files individually or as a ZIP archive",
    "Your PDFs never leave your device — 100% browser-based and private",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Compress a PDF Online",
  description: "Use PursTech's free PDF Compressor to reduce PDF file size instantly in your browser.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose compression level",
      text: "Pick Light for maximum compatibility, Medium for a good balance of size and speed, or Maximum for the smallest possible file size.",
      url: "https://www.purstech.com/tools/pdf-compressor" },
    { "@type": "HowToStep", position: 2, name: "Upload your PDFs",
      text: "Drag and drop one or more PDF files into the upload area, or click to browse your device. Multiple files can be processed at once.",
      url: "https://www.purstech.com/tools/pdf-compressor" },
    { "@type": "HowToStep", position: 3, name: "Click Compress",
      text: "Click the Compress button. All processing happens in your browser using pdf-lib. Watch the before/after size appear for each file.",
      url: "https://www.purstech.com/tools/pdf-compressor" },
    { "@type": "HowToStep", position: 4, name: "Download results",
      text: "Download each compressed PDF individually, or click Download All to get all compressed files in a single ZIP archive.",
      url: "https://www.purstech.com/tools/pdf-compressor" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Can I compress a PDF to 100KB or 200KB?",
      acceptedAnswer: { "@type": "Answer", text: "Often, yes — pick the Maximum level and check the output size. How far a PDF can shrink depends on what is inside it: text-based PDFs compress dramatically, while scanned or image-heavy PDFs are limited by their images. For those, compress the images first with our free Image Compressor, or split the document into fewer pages." } },
    { "@type": "Question", name: "How does browser-based PDF compression work?",
      acceptedAnswer: { "@type": "Answer", text: "Our compressor uses pdf-lib to re-encode your PDF using efficient object streams, removes redundant data structures, and strips embedded metadata. For text-heavy PDFs, savings of 10-50% are typical. PDFs with embedded images or already heavily optimised files may see smaller savings." } },
    { "@type": "Question", name: "Will compression reduce the visual quality of my PDF?",
      acceptedAnswer: { "@type": "Answer", text: "No. Our compression is lossless — it targets the file structure, not the content. Text, vector graphics and embedded fonts remain pixel-perfect. The Maximum level strips more metadata and uses tighter object packing with no effect on visual quality." } },
    { "@type": "Question", name: "What is PDF metadata and should I remove it?",
      acceptedAnswer: { "@type": "Answer", text: "PDF metadata includes the author name, creation software, creation date and custom properties. This is invisible to readers but adds to file size. Removing it is safe for most use cases. Keep metadata if you need to track document versions or for compliance requirements." } },
    { "@type": "Question", name: "Why is my compressed PDF larger than the original?",
      acceptedAnswer: { "@type": "Answer", text: "This can happen with PDFs that are already optimised, or PDFs where re-encoding adds overhead. pdf-lib rewrites the file structure, which occasionally adds a small fixed overhead. The tool will show a 0% savings result — always compare sizes before replacing your original." } },
    { "@type": "Question", name: "Is there a file size limit?",
      acceptedAnswer: { "@type": "Answer", text: "There is no hard limit — processing happens entirely in your browser using your device's RAM. Very large PDFs (over 200MB) may be slow on lower-powered devices. For best performance, we recommend processing files under 100MB per batch. Your files never touch our servers." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",           item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",          item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "PDF Tools",      item: "https://www.purstech.com/categories/pdf" },
    { "@type": "ListItem", position: 4, name: "PDF Compressor", item: "https://www.purstech.com/tools/pdf-compressor" },
  ],
};

const FEATURES = [
  "Batch compress multiple PDFs simultaneously",
  "3 compression levels: Light, Medium and Maximum",
  "Remove embedded metadata to shrink file size",
  "Real-time before/after file size comparison",
  "Download compressed files individually or as ZIP",
  "Your PDFs never leave your device — 100% private",
];

export default function PDFCompressorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <PDFCompressorClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-full px-3 py-1 text-xs text-[#FF3A6C] font-semibold mb-3">PDF Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free PDF Compressor Online — Reduce PDF File Size Instantly
          </h1>
          <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
            Compress PDF files by up to 80% without losing readability. Choose from three
            compression levels, strip hidden metadata, and batch process multiple files at once.
            Everything runs in your browser — your documents are never uploaded to any server.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
            {FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-[#FF3A6C] flex-shrink-0 mt-0.5 font-bold">✓</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </PDFCompressorClient>
    </>
  );
}
