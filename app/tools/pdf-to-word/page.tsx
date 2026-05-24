import type { Metadata } from "next";
import PDFToWordClient from "./client";

export const metadata: Metadata = {
  title: "Free PDF to Word Converter Online",
  description: "Convert PDF to Word or text online for free. Extract text from any PDF, preview the content, clean up formatting and download as .doc, .txt or .html. 100% browser-based, no upload.",
  alternates: { canonical: "/tools/pdf-to-word" },
  keywords: ["pdf to word","pdf to word converter free","convert pdf to word online","extract text from pdf","pdf to doc free","pdf text extractor"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/pdf-to-word",
    siteName: "PursTech",
    title: "Free PDF to Word Converter — Extract Text from PDF",
    description: "Extract text from PDFs and download as .doc, .txt or .html. Preview and edit content. Free and browser-based.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF to Word Converter — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF to Word Converter Online",
    description: "Extract text from PDFs. Edit, then download as .doc, .txt or .html. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "PDF to Word Converter", url: "https://www.purstech.com/tools/pdf-to-word",
  description: "Free browser-based PDF to Word converter. Extracts text from text-based PDFs using PDF.js. Edit extracted text, then download as .doc, .txt or .html. Files never leave your device.",
  applicationCategory: "UtilitiesApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "Extracts text from any text-based PDF using PDF.js",
    "Page-by-page and full text view modes",
    "Editable text area — fix extraction artifacts before downloading",
    "Copy extracted text to clipboard in one click",
    "Download as .doc (Word), .txt (plain text) or .html",
    "Whitespace cleanup toggle — removes extra spaces and empty lines",
    "Word count, character count and page count statistics",
    "Your PDFs never leave your device — 100% browser-based",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Convert PDF to Word Online",
  description: "Use PursTech's free PDF to Word Converter to extract and edit text from any PDF instantly.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose output format",
      text: "Select .doc for Word compatibility, .txt for plain text, or .html for web use. Enable whitespace cleanup for cleaner output.",
      url: "https://www.purstech.com/tools/pdf-to-word" },
    { "@type": "HowToStep", position: 2, name: "Upload your PDF",
      text: "Drag and drop a text-based PDF. The tool uses PDF.js to extract text directly in your browser — nothing is uploaded to any server.",
      url: "https://www.purstech.com/tools/pdf-to-word" },
    { "@type": "HowToStep", position: 3, name: "Review and edit",
      text: "Read the extracted text in Full or Page-by-page view. Edit directly in the text area to fix any extraction artifacts.",
      url: "https://www.purstech.com/tools/pdf-to-word" },
    { "@type": "HowToStep", position: 4, name: "Copy or download",
      text: "Click Copy Text to paste directly into Word, Notion or email, or click Download to get a .doc, .txt or .html file.",
      url: "https://www.purstech.com/tools/pdf-to-word" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Which types of PDFs can be converted?",
      acceptedAnswer: { "@type": "Answer", text: "This tool extracts text from text-based PDFs — PDFs created digitally from Word documents, web pages or other software. Scanned PDFs (images of paper pages) require OCR. If you upload a scanned PDF and get empty text, try our Image to Text tool instead." } },
    { "@type": "Question", name: "Will the formatting be preserved?",
      acceptedAnswer: { "@type": "Answer", text: "Basic text content is extracted faithfully, but complex formatting like tables, multi-column layouts, headers and footers cannot be perfectly reconstructed. For .doc output, text is wrapped in a basic Word document structure with standard paragraph formatting." } },
    { "@type": "Question", name: "What is the difference between .doc, .txt and .html output?",
      acceptedAnswer: { "@type": "Answer", text: ".txt is plain text with no formatting — the simplest and most compatible format. .doc wraps text in a Word-compatible XML structure allowing the file to open in Microsoft Word or Google Docs. .html creates a web-viewable file suitable for pasting into web editors or content management systems." } },
    { "@type": "Question", name: "Can I edit the extracted text before downloading?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. The extracted text appears in an editable text area. You can correct any artifacts, fix line breaks, and add or remove content before downloading or copying. This is especially useful for cleaning up PDFs with unusual text encoding." } },
    { "@type": "Question", name: "Why are some characters showing as garbled or replaced with question marks?",
      acceptedAnswer: { "@type": "Answer", text: "This happens when a PDF uses embedded fonts with non-standard character encodings. The PDF specification allows fonts to use custom encoding tables, which can make text extraction ambiguous. In these cases the extracted text may have placeholder characters — a specialised desktop tool may give better results." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",              item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",             item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "PDF Tools",         item: "https://www.purstech.com/categories/pdf" },
    { "@type": "ListItem", position: 4, name: "PDF to Word",       item: "https://www.purstech.com/tools/pdf-to-word" },
  ],
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <PDFToWordClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-full px-3 py-1 text-xs text-[#FF3A6C] font-semibold mb-3">PDF Tools</div>
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
    </>
  );
}
