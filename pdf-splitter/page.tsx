import type { Metadata } from "next";
import PDFSplitterClient from "./client";

export const metadata: Metadata = {
  title: "Split PDF Free — Extract & Separate PDF Pages",
  description: "Free PDF splitter — split a PDF into individual pages or custom ranges. Extract, separate or remove pages, then download. No upload, no signup.",
  alternates: { canonical: "/tools/pdf-splitter" },
  keywords: ["split pdf","pdf splitter","extract pages from pdf","how to separate pages in pdf","pdf separator","save one page of pdf","unmerge pdf","pdf split","extract pdf pages"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/pdf-splitter",
    siteName: "PursTech",
    title: "Split PDF Online Free — Extract & Separate Pages",
    description: "Split PDFs by page, range or extract specific pages. ZIP download. Free and browser-based.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PDF Splitter — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free PDF Splitter Online — Extract & Split Pages",
    description: "4 split modes: every page, custom ranges, extract or remove pages. ZIP download. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  name: "PDF Splitter", url: "https://www.purstech.com/tools/pdf-splitter",
  description: "Free browser-based PDF splitter with 4 modes: split every page, custom ranges, extract specific pages, or remove pages. Visual page grid selector, range preview and ZIP download of all parts.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Every Page mode: one PDF per page",
    "Custom Ranges mode: split into range groups separated by semicolons",
    "Extract mode: keep only selected pages",
    "Remove mode: delete selected pages, keep the rest",
    "Visual page grid — click to select pages for extract/remove modes",
    "Range preview shows file count before splitting",
    "Download single PDF or all parts as a ZIP archive",
    "Zero quality loss — pages are copied without re-encoding",
    "Your files never leave your device — 100% browser-based",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Split a PDF Online",
  description: "Use PursTech's free PDF Splitter to split, extract or remove pages from any PDF instantly.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose a split mode",
      text: "Every Page creates one PDF per page. Custom Ranges splits by range groups. Extract keeps only selected pages. Remove deletes selected pages.",
      url: "https://www.purstech.com/tools/pdf-splitter" },
    { "@type": "HowToStep", position: 2, name: "Upload your PDF",
      text: "Drag and drop or click to browse. The tool reads the file locally — nothing is uploaded to any server.",
      url: "https://www.purstech.com/tools/pdf-splitter" },
    { "@type": "HowToStep", position: 3, name: "Select pages or enter ranges",
      text: "For Extract and Remove modes, click page thumbnails in the visual grid. For Custom Ranges, type groups separated by semicolons like '1-5; 6-10'.",
      url: "https://www.purstech.com/tools/pdf-splitter" },
    { "@type": "HowToStep", position: 4, name: "Split and download",
      text: "Click Split. Download individual files or all parts at once as a ZIP archive.",
      url: "https://www.purstech.com/tools/pdf-splitter" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I save just one page of a PDF?",
      acceptedAnswer: { "@type": "Answer", text: "Switch to Extract mode, click the page you want in the visual page grid, and download — you get a new PDF containing only that page at original quality. Select multiple pages the same way to save any subset." } },
    { "@type": "Question", name: "Can I split a PDF without Adobe Acrobat?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — this splitter runs entirely in your browser, free. Use Every Page mode to unmerge a combined PDF, Custom Ranges to break it into parts, or Extract/Remove modes for specific pages. No Acrobat, no upload — files never leave your device." } },
    { "@type": "Question", name: "What is the difference between 'Extract' and 'Remove' mode?",
      acceptedAnswer: { "@type": "Answer", text: "Extract mode creates a new PDF containing only the pages you select — the rest are discarded. Remove mode creates a new PDF containing all pages EXCEPT the ones you select. Use Extract when you want a specific subset. Use Remove when you want to delete a few unwanted pages and keep everything else." } },
    { "@type": "Question", name: "How do I split a PDF into multiple separate files by range?",
      acceptedAnswer: { "@type": "Answer", text: "Select Custom Ranges mode and enter ranges separated by semicolons. For example, '1-5; 6-10; 11-15' creates three separate PDFs. You can mix single pages and ranges: '1-3; 5; 7-9' creates three files. A preview shows how many files will be created before you click Split." } },
    { "@type": "Question", name: "Will the split PDFs maintain the original quality?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. The split operation copies the original page objects into new PDF documents without re-encoding anything. Text remains searchable, images remain at their original resolution, and fonts are preserved exactly. There is zero quality loss in any split mode." } },
    { "@type": "Question", name: "Can I split a PDF and then re-merge the parts in a different order?",
      acceptedAnswer: { "@type": "Answer", text: "Absolutely. Split your PDF using Every Page mode to get each page as a separate file, then use our PDF Merger to combine them in any order you like. This effectively lets you rearrange pages in any sequence." } },
    { "@type": "Question", name: "What range syntax does the custom ranges field accept?",
      acceptedAnswer: { "@type": "Answer", text: "Single pages (5), inclusive ranges (1-3), and comma-separated combinations (1-3, 5, 7-10) are supported. To split into multiple output files, separate range groups with a semicolon: '1-5; 6-10' creates two PDFs. Page numbers are 1-indexed. Invalid page numbers beyond the document length are silently ignored." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",          item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",         item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "PDF Tools",     item: "https://www.purstech.com/categories/pdf" },
    { "@type": "ListItem", position: 4, name: "PDF Splitter",  item: "https://www.purstech.com/tools/pdf-splitter" },
  ],
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <PDFSplitterClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-full px-3 py-1 text-xs text-[#FF3A6C] font-semibold mb-3">PDF Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Split PDF Free — Extract, Separate or Remove PDF Pages
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
    </>
  );
}
