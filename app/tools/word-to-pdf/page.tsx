import type { Metadata } from "next";
import WordToPDFClient from "./client";

export const metadata: Metadata = {
  title: "Free Word to PDF Converter Online",
  description: "Convert Word documents and plain text to PDF online for free. Upload a .txt or .doc file, or type/paste text directly. Choose page size, margins and font. 100% browser-based.",
  alternates: { canonical: "/tools/word-to-pdf" },
  keywords: ["word to pdf","convert word to pdf online free","text to pdf converter","txt to pdf","doc to pdf free","convert text to pdf","online pdf converter"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/word-to-pdf",
    siteName: "PursTech",
    title: "Free Word to PDF Converter Online",
    description: "Convert .txt or .doc files to PDF. Paste text, set page size and margins, download instantly. Free and browser-based.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Word to PDF Converter — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Word to PDF Converter — A4, Letter, Legal",
    description: "Convert text or .txt/.doc to PDF. Custom page size, margins, font size, page numbers. Free, browser-based.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Word to PDF Converter", url: "https://www.purstech.com/tools/word-to-pdf",
  description: "Free browser-based Word to PDF converter. Convert text, .txt or .doc files to PDF with adjustable page size (A4/Letter/Legal), margins, font size and automatic page numbering. Nothing leaves your device.",
  applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "Paste text or upload .txt / .doc / .docx files",
    "Page sizes: A4, US Letter and Legal",
    "Adjustable margins: Narrow, Normal and Wide",
    "Font size control from 8pt to 24pt",
    "Automatic multi-page layout",
    "Page numbering toggle (Page X of Y)",
    "Custom output filename",
    "Drag and drop file upload",
    "100% browser-based — text never leaves your device",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Convert Word or Text to PDF Online",
  description: "Use PursTech's free Word to PDF Converter to turn text or a .txt/.doc file into a clean PDF.",
  totalTime: "PT30S",
  step: [
    { "@type": "HowToStep", position: 1, name: "Set page options",
      text: "Choose your page size (A4, Letter or Legal), margins and font size. Enable page numbers for multi-page documents.",
      url: "https://www.purstech.com/tools/word-to-pdf" },
    { "@type": "HowToStep", position: 2, name: "Enter your text",
      text: "Type or paste text directly into the editor. Or click Upload to load a .txt or .doc file automatically.",
      url: "https://www.purstech.com/tools/word-to-pdf" },
    { "@type": "HowToStep", position: 3, name: "Review document stats",
      text: "The right panel shows word count, estimated page count and your current settings so you can fine-tune before converting.",
      url: "https://www.purstech.com/tools/word-to-pdf" },
    { "@type": "HowToStep", position: 4, name: "Convert and download",
      text: "Click Convert to PDF. The PDF is created instantly in your browser and downloads automatically. Set a custom filename first if needed.",
      url: "https://www.purstech.com/tools/word-to-pdf" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What types of files can I convert to PDF?",
      acceptedAnswer: { "@type": "Answer", text: "You can upload plain text files (.txt) or basic Word documents (.doc / .docx). For .doc and .docx files, the tool extracts the text content and formats it as a clean PDF. Complex Word formatting like headers, footers, tables and embedded images is not supported — only the text is converted. You can also paste or type text directly into the editor without uploading any file." } },
    { "@type": "Question", name: "What page sizes are available?",
      acceptedAnswer: { "@type": "Answer", text: "The tool supports A4 (210×297mm — the standard in most of the world), US Letter (8.5×11in — the standard in North America) and Legal (8.5×14in — used for legal documents in the US and Canada). Select the page size before converting to ensure the PDF uses the correct dimensions for printing or sharing." } },
    { "@type": "Question", name: "How does automatic page numbering work?",
      acceptedAnswer: { "@type": "Answer", text: "When page numbers are enabled, the current page number and total page count (for example, Page 3 of 7) are added to the bottom centre of each page. The numbering is automatic — the tool calculates how many lines of text fit on each page based on your font size and margin settings, then adds the page count automatically." } },
    { "@type": "Question", name: "Why does my converted PDF look different from the original Word document?",
      acceptedAnswer: { "@type": "Answer", text: "This tool creates a clean text-based PDF from the document's content. Complex Word formatting — fonts, colours, images, tables, headers, footers, styles — cannot be reproduced by a browser-based text converter. For pixel-perfect Word-to-PDF conversion that preserves all formatting, use Microsoft Word's built-in Export to PDF feature or Google Docs." } },
    { "@type": "Question", name: "Is there a word or character limit?",
      acceptedAnswer: { "@type": "Answer", text: "There is no hard limit. The tool automatically creates as many pages as needed to fit all your text. Very long documents (over 100,000 words) may take a few seconds to process in the browser. All processing happens on your device — your text is never sent to any server." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",         item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",        item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "PDF Tools",    item: "https://www.purstech.com/categories/pdf" },
    { "@type": "ListItem", position: 4, name: "Word to PDF",  item: "https://www.purstech.com/tools/word-to-pdf" },
  ],
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <WordToPDFClient>
        <div className="mb-8 min-w-0 w-full">
          <div className="inline-flex items-center gap-2 bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-full px-3 py-1 text-xs text-[#FF3A6C] font-semibold mb-3">
            PDF Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight truncate pr-2 whitespace-normal break-words">
            Free Word to PDF Converter Online — Text, .txt &amp; .doc to PDF
          </h1>
          <p className="text-gray-400 max-w-2xl mb-5 leading-relaxed">
            Convert any text or document to a clean, properly formatted PDF. Paste text directly,
            or upload a .txt or .doc file. Choose A4, Letter or Legal page size, set margins,
            pick your font size and download the PDF instantly — no account, no upload.
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 min-w-0 w-full">
            {FEATURES.map(f => (
              <li key={f} className="flex items-start gap-2 text-sm text-gray-400 min-w-0 w-full">
                <span className="text-[#FF3A6C] flex-shrink-0 mt-0.5 font-bold">✓</span>
                <span className="truncate whitespace-normal break-words">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </WordToPDFClient>
    </>
  );
}
