"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PDF to Word Converter",
  description: "Free online PDF to Word converter. Extracts text from PDFs with editable preview, text cleanup options and download as .doc, .txt or HTML.",
  url: "https://www.purstech.com/tools/pdf-to-word",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const FAQ = [
  { q: "Which types of PDFs can be converted?",
    a: "This tool extracts text from text-based PDFs — PDFs that were created digitally from Word documents, web pages, or other software. Scanned PDFs (images of paper pages) require OCR (Optical Character Recognition) to extract text, which is a different process. If you upload a scanned PDF and get empty text, try our Image to Text (OCR) tool instead, which uses Tesseract.js to process image-based pages." },
  { q: "Will the formatting be preserved?",
    a: "Basic text content is extracted faithfully, but complex formatting like tables, multi-column layouts, headers and footers, and decorative elements cannot be perfectly reconstructed. The extracted text reflects the reading order of the PDF's text objects. For .doc output, the text is wrapped in a basic Word document structure with standard paragraph formatting. For perfect formatting preservation, a desktop tool like Adobe Acrobat Pro is needed." },
  { q: "What is the difference between .doc, .txt and .html output?",
    a: ".txt is plain text with no formatting — the simplest and most compatible format. .doc wraps the text in a Word-compatible XML structure, preserving basic paragraph breaks and allowing the file to open in Microsoft Word or Google Docs for further editing. .html creates a web-viewable file with paragraph and page break tags, suitable for pasting into web editors or content management systems." },
  { q: "Can I edit the extracted text before downloading?",
    a: "Yes. The extracted text appears in an editable text area. You can correct any OCR-style artifacts, fix line breaks, add or remove content before downloading. This is especially useful for cleaning up PDFs with unusual text encoding or non-standard fonts that may cause minor extraction errors." },
  { q: "Why are some characters showing as garbled or replaced with '?' marks?",
    a: "This happens when a PDF uses embedded fonts with non-standard character encodings or uses special symbols not in the standard character set. The PDF specification allows fonts to use custom encoding tables, which can make text extraction ambiguous. In these cases, the extracted text may have placeholder characters. For highly accurate text recovery from such PDFs, a specialised desktop tool may give better results." },
];

type Format = "doc" | "txt" | "html";

declare global {
  interface Window { pdfjsLib: any; }
}

const loadPdfJs = async () => {
  if (typeof window === "undefined") return null;
  if (window.pdfjsLib) return window.pdfjsLib;
  await new Promise<void>((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
    s.onload = () => res(); s.onerror = () => rej(new Error("Failed to load PDF.js"));
    document.head.appendChild(s);
  });
  window.pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
  return window.pdfjsLib;
};

export default function PDFToWordClient({ children }: { children?: React.ReactNode }) {
  const [file,        setFile]       = useState<File | null>(null);
  const [extracting, setExtracting] = useState(false);
  const [pages,       setPages]      = useState<string[]>([]);
  const [text,        setText]       = useState("");
  const [editedText, setEditedText] = useState("");
  const [format,      setFormat]     = useState<Format>("doc");
  const [dragging,    setDragging]   = useState(false);
  const [error,       setError]      = useState("");
  const [cleanup,     setCleanup]    = useState(true);
  const [viewMode,    setViewMode]   = useState<"full" | "pages">("full");
  const [activePage, setActivePage] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const cleanText = useCallback((t: string) =>
    t.replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim(), []);

  const processFile = useCallback(async (f: File) => {
    setFile(f); setExtracting(true); setError(""); setPages([]); setText(""); setEditedText("");
    try {
      const pdfjsLib = await loadPdfJs();
      if (!pdfjsLib) throw new Error("PDF.js could not be loaded");
      const buf = await f.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: buf }).promise;
      const pageTexts: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const pg  = await pdf.getPage(i);
        const ctx = await pg.getTextContent();
        const raw = ctx.items.map((item: any) => item.str).join(" ");
        pageTexts.push(raw);
      }
      const combined = pageTexts.map((t, i) => `--- Page ${i + 1} ---\n${t}`).join("\n\n");
      const final    = cleanup ? cleanText(combined) : combined;
      setPages(pageTexts);
      setText(final);
      setEditedText(final);
    } catch (err) {
      setError("Could not extract text. This PDF may be encrypted, scanned (image-only) or use unsupported encoding.");
    }
    setExtracting(false);
  }, [cleanup, cleanText]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }, [processFile]);

  const download = () => {
    const content = editedText;
    let blob: Blob, filename: string;

    if (format === "txt") {
      blob = new Blob([content], { type: "text/plain" });
      filename = `${file?.name.replace(".pdf","") ?? "document"}.txt`;
    } else if (format === "html") {
      const html = `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${file?.name}</title>
<style>body{max-width:800px;margin:2rem auto;font-family:Georgia,serif;line-height:1.6;color:#1a1a1a;padding:0 1rem}p{margin:0 0 1rem}</style></head><body>
${content.split("\n").filter(l => l.trim()).map(l => `<p>${l.replace(/&/g,"&amp;").replace(/</g,"&lt;")}</p>`).join("\n")}
</body></html>`;
      blob = new Blob([html], { type: "text/html" });
      filename = `${file?.name.replace(".pdf","") ?? "document"}.html`;
    } else {
      // .doc — simple Word XML wrapper
      const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<?mso-application progid="Word.Document"?>
<w:wordDocument xmlns:w="http://schemas.microsoft.com/office/word/2003/wordml">
<w:body>
${content.split("\n").filter(l => l.trim()).map(l =>
  `<w:p><w:r><w:t xml:space="preserve">${l.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}</w:t></w:r></w:p>`
).join("\n")}
</w:body></w:wordDocument>`;
      blob = new Blob([docXml], { type: "application/msword" });
      filename = `${file?.name.replace(".pdf","") ?? "document"}.doc`;
    }
    Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob), download: filename,
    }).click();
  };

  const words = editedText.trim() ? editedText.trim().split(/\s+/).length : 0;
  const chars = editedText.length;

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span>›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span>›</span>
          <span className="text-gray-400">PDF to Word</span>
        </nav>

        {children}

        {/* Options row */}
        <div className="flex flex-wrap gap-3 items-center mb-5">
          <div className="flex items-center gap-2 bg-[#13131F] border border-white/5 rounded-xl px-4 py-2.5">
            <button onClick={() => setCleanup(p => !p)}
              className={`w-8 h-4.5 rounded-full transition-all relative ${cleanup ? "bg-[#FF3A6C]" : "bg-gray-700"} w-9 h-5`}>
              <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${cleanup ? "left-[22px]" : "left-0.5"}`} />
            </button>
            <span className="text-sm text-white">Clean up whitespace</span>
          </div>

          <div className="flex gap-1 bg-[#13131F] border border-white/5 p-1 rounded-xl">
            {(["doc","txt","html"] as Format[]).map(f => (
              <button key={f} onClick={() => setFormat(f)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${format === f ? "bg-[#FF3A6C] text-white" : "text-gray-400 hover:text-white"}`}>
                .{f}
              </button>
            ))}
          </div>
        </div>

        {/* Drop zone */}
        {!file && (
          <div onDrop={onDrop} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${dragging ? "border-[#FF3A6C]/60 bg-[#FF3A6C]/5" : "border-white/10 hover:border-[#FF3A6C]/30 bg-[#13131F]"}`}>
            <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) processFile(f); }} />
            <div className="text-4xl mb-3">📝</div>
            <div className="font-bold text-white mb-1">Drop a PDF here or click to browse</div>
            <div className="text-xs text-gray-500">Works with text-based PDFs · Not scanned images</div>
          </div>
        )}

        {error && <div className="mt-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</div>}

        {extracting && (
          <div className="mt-6 text-center py-10 text-gray-400">
            <div className="text-3xl mb-3 animate-spin">⚙️</div>
            Extracting text from PDF…
          </div>
        )}

        {pages.length > 0 && (
          <div className="mt-5 space-y-4">
            {/* File info + stats */}
            <div className="bg-[#13131F] border border-white/5 rounded-xl px-5 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-sm">
                <span className="text-2xl">📄</span>
                <span className="font-semibold text-white">{file?.name}</span>
              </div>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>{pages.length} pages</span>
                <span>{words.toLocaleString()} words</span>
                <span>{chars.toLocaleString()} chars</span>
                <button onClick={() => { setFile(null); setPages([]); setText(""); setEditedText(""); }}
                  className="text-[#FF3A6C] hover:text-white transition-colors">Change file</button>
              </div>
            </div>

            {/* View toggle */}
            <div className="flex gap-1 bg-[#13131F] border border-white/5 p-1 rounded-xl w-fit">
              {(["full","pages"] as const).map(v => (
                <button key={v} onClick={() => setViewMode(v)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${viewMode === v ? "bg-[#FF3A6C] text-white" : "text-gray-400 hover:text-white"}`}>
                  {v === "full" ? "Full text" : "Page by page"}
                </button>
              ))}
            </div>

            {/* Text editor */}
            {viewMode === "full" ? (
              <div>
                <div className="text-xs text-gray-500 mb-2">Edit before downloading:</div>
                <textarea value={editedText} onChange={e => setEditedText(e.target.value)} rows={20}
                  className="w-full px-5 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-gray-300 text-sm font-mono leading-relaxed focus:outline-none focus:border-[#FF3A6C]/30 resize-none transition-all" />
              </div>
            ) : (
              <div>
                <div className="flex gap-2 flex-wrap mb-3">
                  {pages.map((_, i) => (
                    <button key={i} onClick={() => setActivePage(i)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all border ${activePage === i ? "bg-[#FF3A6C] border-transparent text-white" : "bg-[#13131F] border-white/10 text-gray-400 hover:text-white"}`}>
                      {i+1}
                    </button>
                  ))}
                </div>
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <div className="text-xs text-gray-500 mb-2">Page {activePage + 1} of {pages.length}</div>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap font-mono">
                    {pages[activePage] || "(No text on this page)"}
                  </p>
                </div>
              </div>
            )}

            {/* Download */}
            <button onClick={download}
              className="w-full py-4 rounded-2xl bg-[#FF3A6C] hover:bg-[#d42d5a] text-white font-extrabold text-lg transition-all">
              ⬇ Download as .{format}
            </button>
          </div>
        )}

        {/* How to Use */}
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Convert PDF to Word</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Choose output format", desc:"Select .doc for Word compatibility, .txt for plain text, or .html for web use. Enable whitespace cleanup for cleaner output." },
              { step:"2", title:"Upload your PDF", desc:"Drag and drop a text-based PDF. The tool uses PDF.js to extract text directly in your browser — nothing is uploaded." },
              { step:"3", title:"Review and edit", desc:"Read the extracted text in Full or Page-by-page view. Edit directly in the text area to fix any extraction artifacts." },
              { step:"4", title:"Download", desc:"Click Download to get your .doc, .txt or .html file ready for use in Word, Google Docs or any text editor." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#FF3A6C] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div><div className="font-semibold text-white text-sm mb-1">{s.title}</div><div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#FF3A6C]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#FF3A6C] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/about" className="hover:text-gray-400">About</Link>
          <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
          <Link href="/contact" className="hover:text-gray-400">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}