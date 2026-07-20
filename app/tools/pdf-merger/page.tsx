import type { Metadata } from "next";
import PDFMergerClient from "./client";

export const metadata: Metadata = {
  title: "Merge PDF Files Free — Combine PDF Online",
  description: "Free PDF merger — merge multiple PDF files into one online. Drag to reorder, pick page ranges, with no upload and no signup required.",
  alternates: { canonical: "/tools/pdf-merger" },
  keywords: ["merge pdf","combine pdf","pdf merger","pdf combiner","combine pdf files","how to combine pdf files","merge pdf online","pdf merge","file combiner"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/pdf-merger",
    siteName: "PursTech",
    title: "Merge PDF Free — Combine PDF Files in Any Order",
    description: "Merge PDFs online — drag to reorder, select page ranges, set merged PDF metadata. Free and browser-based.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Merger — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Merge PDF Free — Combine PDFs Online",
    description: "Drag to reorder, pick page ranges, set metadata. 100% browser-based. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebPage",
  name: "PDF Merger", url: "https://www.purstech.com/tools/pdf-merger",
  description: "Free browser-based PDF merger. Combine multiple PDFs with drag-to-reorder, per-file page ranges, custom metadata on merged output and instant download. Files never leave your device.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Drag to reorder PDF files before merging",
    "Select specific page ranges from each file (e.g. 1-3, 5, 7-10)",
    "Shows page count and file size for each uploaded PDF",
    "Set title and author metadata on the merged output",
    "Per-row page selection counter shows pages included",
    "Download merged PDF instantly — no waiting, no server upload",
    "Your files never leave your device — 100% private",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Merge PDF Files Online",
  description: "Use PursTech's free PDF Merger to combine multiple PDFs into one document instantly.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Upload your PDFs",
      text: "Drop multiple PDF files into the upload zone or click to browse. Each file shows its page count and file size.",
      url: "https://www.purstech.com/tools/pdf-merger" },
    { "@type": "HowToStep", position: 2, name: "Reorder and set page ranges",
      text: "Drag files to set the order they'll appear in the merged PDF. Optionally enter a page range for each file (e.g. 1-3, 5) — blank includes all pages.",
      url: "https://www.purstech.com/tools/pdf-merger" },
    { "@type": "HowToStep", position: 3, name: "Add metadata (optional)",
      text: "Click Set Metadata to add a title and author to the merged PDF — useful for sharing or archiving.",
      url: "https://www.purstech.com/tools/pdf-merger" },
    { "@type": "HowToStep", position: 4, name: "Merge and download",
      text: "Click Merge PDFs. The combined PDF is created in your browser and downloads instantly — no server upload, no wait.",
      url: "https://www.purstech.com/tools/pdf-merger" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I combine PDF files into one?",
      acceptedAnswer: { "@type": "Answer", text: "Drop your PDFs in, drag them into the order you want, optionally pick page ranges from each file (e.g. 1-3, 5), and hit Merge — a single combined PDF downloads instantly. No Acrobat needed, and nothing is uploaded to a server." } },
    { "@type": "Question", name: "Is there a limit to how many PDFs I can merge?",
      acceptedAnswer: { "@type": "Answer", text: "There is no hard limit. You can merge as many PDFs as your device's memory allows. For very large sets (50+ files or files over 50MB each), we recommend merging in batches to avoid browser memory pressure. All processing is private — your files never touch our servers." } },
    { "@type": "Question", name: "Can I choose specific pages from each PDF to include?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. Enter a page range next to each file: single numbers (5), inclusive ranges (1-3), or comma-separated combinations (1-3, 5, 7-10). Leave blank to include all pages. A counter shows how many pages are selected from each file before you merge." } },
    { "@type": "Question", name: "Does merging PDFs preserve hyperlinks, bookmarks and form fields?",
      acceptedAnswer: { "@type": "Answer", text: "Hyperlinks and basic formatting are preserved. PDF bookmarks from individual files are not carried over as combining them can create conflicts. Form fields are preserved but may have overlapping field names when merging forms — flatten forms before merging if this is a concern." } },
    { "@type": "Question", name: "Will the page order be exactly how I arranged the files?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. The merged PDF page order follows your file list from top to bottom. Drag files to reorder them before merging. Each file's pages appear in their original order, or in the order specified by your page ranges." } },
    { "@type": "Question", name: "Can I merge password-protected PDFs?",
      acceptedAnswer: { "@type": "Answer", text: "Password-protected PDFs cannot be merged without first removing the password. Some PDFs have owner restrictions but no user password and can sometimes still be processed. If you receive an error for a specific file, decrypt it using its password before trying to merge." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",       item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",      item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "PDF Tools",  item: "https://www.purstech.com/categories/pdf" },
    { "@type": "ListItem", position: 4, name: "PDF Merger", item: "https://www.purstech.com/tools/pdf-merger" },
  ],
};

const FEATURES = [
  "Drag to reorder PDF files before merging",
  "Select specific page ranges from each file",
  "Shows page count and file size for each PDF",
  "Set title, author and subject on merged output",
  "Download merged PDF instantly — no wait time",
  "Your files never leave your device — 100% private",
];

export default function PDFMergerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <PDFMergerClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-full px-3 py-1 text-xs text-[#FF3A6C] font-semibold mb-3">PDF Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Merge PDF Free — Combine PDF Files Into One, Any Order
          </h1>
          <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
            Merge multiple PDF files into a single document in seconds. Drag to reorder files,
            select specific page ranges from each PDF, and set title and author metadata on the
            final output. Everything runs locally in your browser with no file size limits.
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
      </PDFMergerClient>
    </>
  );
}
