import type { Metadata } from "next";
import PDFCompressorClient from "./client";

export const metadata: Metadata = {
  title:       "Free PDF Compressor — Reduce PDF Size 80%",
  description: "Compress PDF files online for free. Reduce PDF size by up to 80% with three compression levels, metadata removal and batch processing. No upload to server — 100% browser-based.",
  keywords:    ["pdf compressor","compress pdf online free","reduce pdf size","pdf file size reducer","pdf optimizer","compress pdf without losing quality"],
  openGraph: {
    title:       "Free PDF Compressor Online | PursTech",
    description: "Reduce PDF file size by up to 80%. Batch compress, remove metadata, three compression levels. Free and browser-based.",
    url:         "https://www.purstech.com/tools/pdf-compressor",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free PDF Compressor Online | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/pdf-compressor" },
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
    <PDFCompressorClient>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-full px-3 py-1 text-xs text-[#FF3A6C] font-semibold mb-3">
          PDF Tools
        </div>
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
  );
}
