import type { Metadata } from "next";
import PDFMergerClient from "./client";

export const metadata: Metadata = {
  title:       "Free PDF Merger Online — Combine PDF Files in Any Order | PursTech",
  description: "Merge multiple PDF files into one online for free. Drag to reorder, select page ranges from each file, set metadata on the merged PDF. 100% browser-based, no upload, instant.",
  keywords:    ["pdf merger","merge pdf files online free","combine pdf","pdf combiner","join pdf files","pdf joiner online"],
  openGraph: {
    title:       "Free PDF Merger Online — Combine PDFs in Any Order | PursTech",
    description: "Merge PDFs online — drag to reorder, select page ranges, set merged PDF metadata. Free and browser-based.",
    url:         "https://www.purstech.com/tools/pdf-merger",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free PDF Merger Online | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/pdf-merger" },
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
    <PDFMergerClient>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-full px-3 py-1 text-xs text-[#FF3A6C] font-semibold mb-3">
          PDF Tools
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
          Free PDF Merger Online — Combine PDF Files in Any Order
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
  );
}
