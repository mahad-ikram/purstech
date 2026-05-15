import type { Metadata } from "next";
import PDFToWordClient from "./client";

export const metadata: Metadata = {
  title:       "Free PDF to Word Converter Online",
  description: "Convert PDF to Word or text online for free. Extract text from any PDF, preview the content, clean up formatting and download as .doc or .txt. 100% browser-based, no upload.",
  keywords:    ["pdf to word","pdf to word converter free","convert pdf to word online","extract text from pdf","pdf to doc free","pdf text extractor"],
  openGraph: {
    title:       "Free PDF to Word Converter Online | PursTech",
    description: "Extract text from PDFs and download as .doc or .txt. Preview content, clean formatting. Free and browser-based.",
    url:         "https://www.purstech.com/tools/pdf-to-word",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free PDF to Word Converter | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/pdf-to-word" },
};

const FEATURES = [
  "Extracts text from any text-based PDF instantly",
  "Page-by-page text preview with editing capability",
  "Download as .doc (Word), .txt or .html",
  "Text cleanup: remove extra spaces and empty lines",
  "Word, character and page count statistics",
  "Your PDFs never leave your device — 100% private",
];

export default function PDFToWordPage() {
  return (
    <PDFToWordClient>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-full px-3 py-1 text-xs text-[#FF3A6C] font-semibold mb-3">
          PDF Tools
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
          Free PDF to Word Converter Online — Extract Text from PDF
        </h1>
        <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
          Extract text from any PDF and download it as a Word .doc, plain .txt or HTML file.
          Preview and edit the extracted text before downloading. Supports page-by-page
          extraction, text cleanup, and shows word and character counts. Fully browser-based.
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
    </PDFToWordClient>
  );
}
