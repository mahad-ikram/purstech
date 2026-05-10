import type { Metadata } from "next";
import PDFSplitterClient from "./client";

export const metadata: Metadata = {
  title:       "Free PDF Splitter Online — Split PDF by Page, Range or Extract Pages | PursTech",
  description: "Split a PDF into individual pages or custom page ranges. Extract specific pages, remove pages, or split into equal parts. Download as separate PDFs or a ZIP. 100% browser-based.",
  keywords:    ["pdf splitter","split pdf online free","extract pages from pdf","pdf page extractor","separate pdf pages","split pdf into multiple files"],
  openGraph: {
    title:       "Free PDF Splitter Online — Extract & Split PDF Pages | PursTech",
    description: "Split PDFs by page, range or extract specific pages. ZIP download. Free and browser-based.",
    url:         "https://www.purstech.com/tools/pdf-splitter",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free PDF Splitter Online | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/pdf-splitter" },
};

const FEATURES = [
  "4 split modes: Every Page, Custom Ranges, Extract, Remove",
  "Visual page grid — click to select pages",
  "Custom range input: '1-3, 5, 7-10' syntax",
  "Download all split parts as a ZIP archive",
  "Preserves original PDF formatting and fonts",
  "Your files never leave your device — 100% private",
];

export default function PDFSplitterPage() {
  return (
    <PDFSplitterClient>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-full px-3 py-1 text-xs text-[#FF3A6C] font-semibold mb-3">
          PDF Tools
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
          Free PDF Splitter Online — Split by Page, Range or Extract Pages
        </h1>
        <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
          Split any PDF into individual pages or custom page ranges in seconds. Use the visual
          page grid to click and select exactly the pages you need, or enter a range like
          "1-3, 5, 7-10". Download all parts at once as a ZIP file. No server, no account.
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
    </PDFSplitterClient>
  );
}
