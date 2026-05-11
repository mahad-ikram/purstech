"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Word to PDF Converter",
  description: "Free online Word to PDF converter. Convert .txt and .doc files or pasted text to PDF with custom page size, margins and font size. 100% browser-based.",
  url: "https://www.purstech.com/tools/word-to-pdf",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const FAQ = [
  { q: "What types of files can I convert to PDF?",
    a: "You can upload plain text files (.txt) or basic Word documents (.doc / .docx). For .doc and .docx files, the tool extracts the text content and formats it as a clean PDF. Complex Word formatting like headers, footers, tables and embedded images are not supported — only the text is converted. You can also paste or type text directly into the editor without uploading any file." },
  { q: "What page sizes are available?",
    a: "The tool supports A4 (210×297mm — the standard in most of the world), US Letter (8.5×11in — the standard in North America) and Legal (8.5×14in — used for legal documents in the US and Canada). Select the page size before converting to ensure the PDF uses the correct dimensions for printing or sharing." },
  { q: "How does automatic page numbering work?",
    a: "When page numbers are enabled, the current page number and total page count (e.g. 'Page 3 of 7') are added to the bottom centre of each page in a small, unobtrusive font. The numbering is automatic — the tool calculates how many lines of text fit on each page based on your font size and margin settings, then adds the page count automatically." },
  { q: "Why does my converted PDF look different from the original Word document?",
    a: "This tool creates a clean text-based PDF from the document's content. Complex Word formatting — fonts, colours, images, tables, headers/footers, styles, track changes — cannot be reproduced by a browser-based text converter. What you get is a properly formatted, readable PDF of the text content. For pixel-perfect Word-to-PDF conversion that preserves all formatting, use Microsoft Word's built-in 'Export to PDF' feature or Google Docs." },
  { q: "Is there a word or character limit?",
    a: "There is no hard limit. The tool automatically creates as many pages as needed to fit all your text. Very long documents (over 100,000 words) may take a few seconds to process in the browser. All processing happens on your device — your text is never sent to any server." },
];

type PageSize = "A4" | "Letter" | "Legal";
type Margin   = "normal" | "narrow" | "wide";

const PAGE_SIZES: Record<PageSize, [number, number]> = {
  A4:     [595.28, 841.89],
  Letter: [612,    792],
  Legal:  [612,    1008],
};
const MARGINS: Record<Margin, number> = {
  narrow: 36, normal: 72, wide: 108,
};

// Wrap text to fit within maxWidth pixels at given font size (approximate)
function wrapLines(text: string, maxChars: number): string[] {
  const result: string[] = [];
  text.split("\n").forEach(para => {
    if (!para.trim()) { result.push(""); return; }
    const words = para.split(" ");
    let line = "";
    words.forEach(word => {
      if ((line + " " + word).trim().length <= maxChars) {
        line = (line + " " + word).trim();
      } else {
        if (line) result.push(line);
        line = word;
      }
    });
    if (line) result.push(line);
  });
  return result;
}

export default function WordToPDFClient({ children }: { children?: React.ReactNode }) {
  const [text,       setText]       = useState("Type or paste your text here...\n\nYou can also upload a .txt or .doc file using the button above.");
  const [pageSize,   setPageSize]   = useState<PageSize>("A4");
  const [margin,     setMargin]     = useState<Margin>("normal");
  const [fontSize,   setFontSize]   = useState(12);
  const [addPageNum, setAddPageNum] = useState(true);
  const [converting, setConverting] = useState(false);
  const [dragging,   setDragging]   = useState(false);
  const [fileName,   setFileName]   = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (f: File) => {
    setFileName(f.name);
    const raw = await f.text();
    // Basic docx/doc text extraction — strip XML tags
    const cleaned = raw.replace(/<[^>]+>/g, " ").replace(/\s{2,}/g, " ").trim();
    setText(cleaned || raw);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const convert = async () => {
    if (!text.trim()) return;
    setConverting(true);

    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const doc  = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      
      const [pageW, pageH] = PAGE_SIZES[pageSize];
      const mgn    = MARGINS[margin];
      const usableW = pageW - mgn * 2;
      const usableH = pageH - mgn * 2 - (addPageNum ? 20 : 0);
      const lineH  = fontSize * 1.4;
      const charsPerLine = Math.floor(usableW / (fontSize * 0.55));
      const linesPerPage = Math.floor(usableH / lineH);

      const allLines = wrapLines(text, charsPerLine);
      const pages: string[][] = [];
      for (let i = 0; i < allLines.length; i += linesPerPage) {
        pages.push(allLines.slice(i, i + linesPerPage));
      }
      if (pages.length === 0) pages.push([""]);

      pages.forEach((pageLines, pi) => {
        const pg = doc.addPage([pageW, pageH]);
        let y = pageH - mgn;

        pageLines.forEach(line => {
          if (y - fontSize < mgn) return;
          pg.drawText(line, {
            x: mgn, y: y - fontSize,
            size: fontSize, font,
            color: rgb(0.07, 0.07, 0.12),
          });
          y -= lineH;
        });

        if (addPageNum) {
          const numText = `Page ${pi + 1} of ${pages.length}`;
          const numW    = font.widthOfTextAtSize(numText, 8);
          pg.drawText(numText, {
            x: (pageW - numW) / 2, y: mgn - 14,
            size: 8, font, color: rgb(0.6, 0.6, 0.6),
          });
        }
      });

      const pdfBytes = await doc.save();
      // FIX: ADDED 'as any' HERE TO BYPASS VERCEL'S STRICT TYPING
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const base = fileName ? fileName.replace(/\.(txt|doc|docx)$/i, "") : "document";
      Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(blob), download: `${base}.pdf`,
      }).click();
    } catch (err) {
      console.error(err);
    }
    setConverting(false);
  };

  const words    = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars    = text.length;
  const estPages = Math.max(1, Math.ceil(wrapLines(text, Math.floor((PAGE_SIZES[pageSize][0] - MARGINS[margin]*2) / (fontSize * 0.55))).length /
    Math.floor((PAGE_SIZES[pageSize][1] - MARGINS[margin]*2) / (fontSize * 1.4))));

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span>›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span>›</span>
          <span className="text-gray-400">Word to PDF</span>
        </nav>

        {children}

        {/* Settings bar */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 mb-5 flex flex-wrap gap-4 items-end">
          {/* Page size */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Page Size</label>
            <div className="flex gap-1">
              {(["A4","Letter","Legal"] as PageSize[]).map(s => (
                <button key={s} onClick={() => setPageSize(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${pageSize===s ? "bg-[#FF3A6C] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Margins */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Margins</label>
            <div className="flex gap-1">
              {(["narrow","normal","wide"] as Margin[]).map(m => (
                <button key={m} onClick={() => setMargin(m)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${margin===m ? "bg-[#FF3A6C] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Font size */}
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Font Size: {fontSize}pt</label>
            <input type="range" min={8} max={24} value={fontSize} onChange={e => setFontSize(+e.target.value)}
              className="w-32 accent-[#FF3A6C]" />
          </div>

          {/* Page numbers toggle */}
          <div className="flex items-center gap-2">
            <button onClick={() => setAddPageNum(p => !p)}
              className={`w-9 h-5 rounded-full transition-all relative ${addPageNum ? "bg-[#FF3A6C]" : "bg-gray-700"}`}>
              <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${addPageNum ? "left-[18px]" : "left-0.5"}`} />
            </button>
            <span className="text-sm text-white">Page numbers</span>
          </div>

          {/* Upload file */}
          <div className="ml-auto">
            <input ref={inputRef} type="file" accept=".txt,.doc,.docx" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
            <button onClick={() => inputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white text-xs font-bold transition-all">
              📂 Upload .txt / .doc
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Text editor */}
          <div className="lg:col-span-3">
            <div
              onDrop={e => { onDrop(e); }}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              className={`rounded-2xl border-2 transition-all ${dragging ? "border-[#FF3A6C]/60" : "border-transparent"}`}>
              <textarea
                value={text} onChange={e => setText(e.target.value)}
                rows={22} spellCheck={false}
                className="w-full px-6 py-5 rounded-2xl bg-[#13131F] border border-white/5 text-gray-200 text-sm leading-relaxed font-mono focus:outline-none focus:border-[#FF3A6C]/30 resize-none transition-all"
              />
            </div>
            {fileName && <div className="text-xs text-gray-500 mt-1.5">Loaded from: {fileName}</div>}
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Stats */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Document Stats</h3>
              {[
                { label:"Words",     value: words.toLocaleString()    },
                { label:"Characters",value: chars.toLocaleString()    },
                { label:"Est. pages",value: `~${estPages}`             },
                { label:"Page size", value: pageSize                   },
                { label:"Font",      value: `Helvetica ${fontSize}pt` },
              ].map(s => (
                <div key={s.label} className="flex justify-between text-xs">
                  <span className="text-gray-500">{s.label}</span>
                  <span className="text-white font-semibold">{s.value}</span>
                </div>
              ))}
            </div>

            {/* Convert button */}
            <button onClick={convert} disabled={converting || !text.trim()}
              className="w-full py-4 rounded-2xl bg-[#FF3A6C] hover:bg-[#d42d5a] disabled:opacity-50 text-white font-extrabold text-base transition-all">
              {converting ? "Creating PDF…" : "⬇ Convert to PDF"}
            </button>

            <p className="text-xs text-gray-600 text-center">Your text never leaves your device</p>
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Convert Text to PDF</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Set page options", desc:"Choose your page size (A4, Letter or Legal), margins and font size. Enable page numbers for multi-page documents." },
              { step:"2", title:"Enter your text", desc:"Type or paste text directly into the editor. Or click 'Upload' to load a .txt or .doc file automatically." },
              { step:"3", title:"Review stats", desc:"The right panel shows word count, estimated page count and your current settings so you can fine-tune before converting." },
              { step:"4", title:"Convert and download", desc:"Click 'Convert to PDF'. The PDF is created instantly in your browser and downloads automatically." },
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
