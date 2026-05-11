import type { Metadata } from "next";
import WordToPDFClient from "./client";

export const metadata: Metadata = {
  title:       "Free Word to PDF Converter Online — Convert Text or .txt to PDF | PursTech",
  description: "Convert Word documents and plain text to PDF online for free. Upload a .txt or .doc file, or type/paste text directly. Choose page size, margins and font. 100% browser-based.",
  keywords:    ["word to pdf","convert word to pdf online free","text to pdf converter","txt to pdf","doc to pdf free","convert text to pdf"],
  openGraph: {
    title:       "Free Word to PDF Converter Online | PursTech",
    description: "Convert .txt or .doc files to PDF. Paste text, set page size and margins, download instantly. Free and browser-based.",
    url:         "https://www.purstech.com/tools/word-to-pdf",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free Word to PDF Converter | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/word-to-pdf" },
};

const FEATURES = [
  "Paste text or upload a .txt / .doc file",
  "Page sizes: A4, US Letter and Legal",
  "Adjustable margins: Normal, Narrow and Wide",
  "Font size control from 8pt to 24pt",
  "Automatic multi-page layout with page numbers",
  "Your content never leaves your device — 100% private",
];

export default function WordToPDFPage() {
  return (
    <WordToPDFClient>
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-full px-3 py-1 text-xs text-[#FF3A6C] font-semibold mb-3">
          PDF Tools
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
          Free Word to PDF Converter Online — Text, .txt &amp; .doc to PDF
        </h1>
        <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
          Convert any text or document to a clean, properly formatted PDF. Paste text directly,
          or upload a .txt or .doc file. Choose A4, Letter or Legal page size, set margins,
          pick your font size and download the PDF instantly — no account, no upload.
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
    </WordToPDFClient>
  );
}
