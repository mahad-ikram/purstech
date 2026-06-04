"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

const FAQ = [
  { q:"What types of files can I convert to PDF?",
    a:"You can upload plain text files (.txt) or basic Word documents (.doc / .docx). For .doc and .docx files, the tool extracts the text content and formats it as a clean PDF. Complex Word formatting like headers, footers, tables and embedded images are not supported — only the text is converted. You can also paste or type text directly into the editor without uploading any file." },
  { q:"What page sizes are available?",
    a:"The tool supports A4 (210×297mm — the standard in most of the world), US Letter (8.5×11in — the standard in North America) and Legal (8.5×14in — used for legal documents in the US and Canada). Select the page size before converting to ensure the PDF uses the correct dimensions for printing or sharing." },
  { q:"How does automatic page numbering work?",
    a:"When page numbers are enabled, the current page number and total page count (e.g. 'Page 3 of 7') are added to the bottom centre of each page in a small, unobtrusive font. The numbering is automatic — the tool calculates how many lines of text fit on each page based on your font size and margin settings, then adds the page count automatically." },
  { q:"Why does my converted PDF look different from the original Word document?",
    a:"This tool creates a clean text-based PDF from the document's content. Complex Word formatting — fonts, colours, images, tables, headers/footers, styles, track changes — cannot be reproduced by a browser-based text converter. What you get is a properly formatted, readable PDF of the text content. For pixel-perfect Word-to-PDF conversion that preserves all formatting, use Microsoft Word's built-in 'Export to PDF' feature or Google Docs." },
  { q:"Is there a word or character limit?",
    a:"There is no hard limit. The tool automatically creates as many pages as needed to fit all your text. Very long documents (over 100,000 words) may take a few seconds to process in the browser. All processing happens on your device — your text is never sent to any server." },
];

const RELATED_TOOLS = [
  { icon:"🗜",  name:"PDF Compressor", slug:"pdf-compressor" },
  { icon:"📎", name:"PDF Merger",      slug:"pdf-merger"     },
  { icon:"✂",  name:"PDF Splitter",    slug:"pdf-splitter"   },
  { icon:"📝", name:"PDF to Word",     slug:"pdf-to-word"    },
  { icon:"📄", name:"Word Counter",    slug:"word-counter"   },
];

const USE_CASES = [
  { icon:"🎓", title:"Students & Academics",   desc:"Convert lecture notes, essay drafts and study guides to PDF for sharing with classmates or submitting on platforms that require PDF format. Keep your formatting consistent across devices." },
  { icon:"💼", title:"Freelancers",           desc:"Turn invoices, proposals and contracts from a simple text editor into a professional PDF in seconds. No need to fire up Word or Google Docs for a one-page document." },
  { icon:"📋", title:"Quick Documentation",   desc:"Convert README files, release notes, meeting minutes and any plain-text content into shareable PDFs. Page numbers and consistent margins make multi-page documents easy to navigate." },
  { icon:"🔒", title:"Privacy-Sensitive Docs", desc:"Confidential notes, drafts and personal documents never leave your browser. Unlike most online converters, your text is not uploaded to any server during conversion." },
];

const PAGE_SIZE_REFERENCE = [
  { size:"A4",     dims:"210 × 297 mm",  inches:"8.27 × 11.69 in", region:"International standard", use:"Reports, letters, CVs in Europe, Asia, Australia and most of the world" },
  { size:"Letter", dims:"216 × 279 mm",  inches:"8.5 × 11 in",     region:"North America",          use:"Business documents, school assignments in US, Canada, Mexico" },
  { size:"Legal",  dims:"216 × 356 mm",  inches:"8.5 × 14 in",     region:"US / Canada legal",      use:"Contracts, real estate documents, longer legal filings" },
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
  useTrackTool("word-to-pdf", "pdf");

  const [text,       setText]       = useState("Type or paste your text here...\n\nYou can also upload a .txt or .doc file using the button above.");
  const [pageSize,   setPageSize]   = useState<PageSize>("A4");
  const [margin,     setMargin]     = useState<Margin>("normal");
  const [fontSize,   setFontSize]   = useState(12);
  const [addPageNum, setAddPageNum] = useState(true);
  const [converting, setConverting] = useState(false);
  const [dragging,   setDragging]   = useState(false);
  const [fileName,   setFileName]   = useState("");
  const [customName, setCustomName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (f: File) => {
    setFileName(f.name);
    const raw = await f.text();
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
      const mgn          = MARGINS[margin];
      const usableW      = pageW - mgn * 2;
      const usableH      = pageH - mgn * 2 - (addPageNum ? 20 : 0);
      const lineH        = fontSize * 1.4;
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
          pg.drawText(line, { x:mgn, y:y - fontSize, size:fontSize, font, color:rgb(0.07, 0.07, 0.12) });
          y -= lineH;
        });
        if (addPageNum) {
          const numText = `Page ${pi + 1} of ${pages.length}`;
          const numW    = font.widthOfTextAtSize(numText, 8);
          pg.drawText(numText, { x:(pageW - numW) / 2, y:mgn - 14, size:8, font, color:rgb(0.6, 0.6, 0.6) });
        }
      });

      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes as any], { type:"application/pdf" });
      
      const base = customName.trim()
        ? customName.trim().replace(/\.pdf$/i, "")
        : fileName
          ? fileName.replace(/\.(txt|doc|docx)$/i, "")
          : "document";
      Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(blob), download:`${base}.pdf`,
      }).click();
    } catch (err) {
      console.error(err);
    }
    setConverting(false);
  };

  const words    = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars    = text.length;
  const estPages = Math.max(1, Math.ceil(
    wrapLines(text, Math.floor((PAGE_SIZES[pageSize][0] - MARGINS[margin] * 2) / (fontSize * 0.55))).length /
    Math.floor((PAGE_SIZES[pageSize][1] - MARGINS[margin] * 2) / (fontSize * 1.4))
  ));

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#FF3A6C] hover:bg-[#6C3AFF] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10 flex-grow w-full">

        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/pdf" className="hover:text-gray-400">PDF Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Word to PDF</span>
        </nav>

        {children}

        {/* Settings bar */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 mb-5 flex flex-wrap gap-4 items-end min-w-0 w-full">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Page Size</label>
            <div className="flex gap-1 flex-wrap">
              {(["A4","Letter","Legal"] as PageSize[]).map(s => (
                <button key={s} onClick={() => setPageSize(s)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${pageSize===s ? "bg-[#FF3A6C] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Margins</label>
            <div className="flex gap-1 flex-wrap">
              {(["narrow","normal","wide"] as Margin[]).map(m => (
                <button key={m} onClick={() => setMargin(m)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all border ${margin===m ? "bg-[#FF3A6C] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Font Size: {fontSize}pt</label>
            <input type="range" min={8} max={24} value={fontSize} onChange={e => setFontSize(+e.target.value)}
              className="w-32 accent-[#FF3A6C]" />
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setAddPageNum(p => !p)} role="switch" aria-checked={addPageNum}
              className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0 ${addPageNum ? "bg-[#FF3A6C]" : "bg-gray-700"}`}>
              <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${addPageNum ? "left-[18px]" : "left-0.5"}`} />
            </button>
            <span className="text-sm text-white">Page numbers</span>
          </div>

          <div className="ml-auto w-full sm:w-auto mt-2 sm:mt-0">
            <input ref={inputRef} type="file" accept=".txt,.doc,.docx" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
            <button onClick={() => inputRef.current?.click()}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white text-xs font-bold transition-all truncate">
              📂 Upload .txt / .doc
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 min-w-0 w-full">

          {/* Editor */}
          <div className="lg:col-span-3 min-w-0 w-full">
            <div onDrop={onDrop}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              className={`rounded-2xl border-2 transition-all min-w-0 w-full ${dragging ? "border-[#FF3A6C]/60" : "border-transparent"}`}>
              <textarea value={text} onChange={e => setText(e.target.value)}
                rows={22} spellCheck={false}
                className="w-full min-w-0 px-6 py-5 rounded-2xl bg-[#13131F] border border-white/5 text-gray-200 text-sm leading-relaxed font-mono focus:outline-none focus:border-[#FF3A6C]/30 resize-none transition-all" />
            </div>
            {fileName && <div className="text-xs text-gray-500 mt-1.5 truncate pr-2 w-full">Loaded from: {fileName}</div>}
          </div>

          {/* Right panel */}
          <div className="min-w-0 space-y-4 w-full">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 space-y-3 min-w-0 w-full">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Document Stats</h3>
              {[
                { label:"Words",      value:words.toLocaleString()  },
                { label:"Characters", value:chars.toLocaleString()  },
                { label:"Est. pages", value:`~${estPages}`           },
                { label:"Page size",  value:pageSize                 },
                { label:"Font",       value:`Helvetica ${fontSize}pt` },
              ].map(s => (
                <div key={s.label} className="flex justify-between text-xs gap-2 min-w-0 w-full">
                  <span className="text-gray-500 flex-shrink-0">{s.label}</span>
                  <span className="text-white font-semibold truncate min-w-0 text-right">{s.value}</span>
                </div>
              ))}
            </div>

            <div className="min-w-0 w-full">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Output Filename</label>
              <div className="flex min-w-0 w-full">
                <input value={customName} onChange={e => setCustomName(e.target.value)}
                  placeholder={fileName ? fileName.replace(/\.(txt|doc|docx)$/i, "") : "document"}
                  className="flex-1 min-w-0 px-3 py-2 bg-[#0A0A14] border border-r-0 border-white/10 text-white text-xs focus:outline-none focus:border-[#FF3A6C]/60 rounded-l-xl truncate" />
                <span className="px-3 py-2 bg-[#0A0A14] border border-l-0 border-white/10 rounded-r-xl text-gray-500 text-xs flex-shrink-0">.pdf</span>
              </div>
            </div>

            <button onClick={convert} disabled={converting || !text.trim()}
              className="w-full py-4 rounded-2xl bg-[#FF3A6C] hover:bg-[#d42d5a] disabled:opacity-50 text-white font-extrabold text-base transition-all">
              {converting ? "Creating PDF…" : "⬇ Convert to PDF"}
            </button>

            <p className="text-xs text-gray-600 text-center">Your text never leaves your device</p>
          </div>
        </div>

        {/* ── Rich content ─────────────────────────────────────────────────── */}

        {/* Use Cases */}
        <section className="mt-12 min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-2">Who Uses This Tool</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-2xl leading-relaxed">A quick text-to-PDF converter is more useful than it sounds. Here are the four most common situations where this beats firing up Microsoft Word or Google Docs.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-w-0 w-full">
            {USE_CASES.map(u => (
              <div key={u.title} className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
                <div className="text-2xl mb-2 flex-shrink-0">{u.icon}</div>
                <div className="font-bold text-white text-sm mb-2 truncate pr-2">{u.title}</div>
                <p className="text-gray-500 text-xs leading-relaxed">{u.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Page Size Reference (MOBILE SAFE TABLE) */}
        <section className="mt-12 min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-2">Page Size Reference</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-2xl leading-relaxed">Not sure whether to use A4, Letter or Legal? This table explains the regional standards and typical use cases for each.</p>
          <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden min-w-0 w-full">
            <div className="overflow-x-auto w-full scrollbar-hide">
              <div className="min-w-[700px]">
                <div className="grid grid-cols-12 text-xs text-gray-500 font-semibold uppercase tracking-wider px-5 py-3 border-b border-white/5 gap-2 w-full">
                  <span className="col-span-1">Size</span>
                  <span className="col-span-3">Dimensions (mm)</span>
                  <span className="col-span-2">Inches</span>
                  <span className="col-span-2">Region</span>
                  <span className="col-span-4">Typical Use</span>
                </div>
                {PAGE_SIZE_REFERENCE.map(p => (
                  <div key={p.size} className="grid grid-cols-12 px-5 py-3 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors gap-2 text-xs w-full">
                    <span className="col-span-1 font-bold text-[#FF3A6C] self-center">{p.size}</span>
                    <span className="col-span-3 text-gray-300 font-mono self-center">{p.dims}</span>
                    <span className="col-span-2 text-gray-300 font-mono self-center">{p.inches}</span>
                    <span className="col-span-2 text-gray-400 self-center">{p.region}</span>
                    <span className="col-span-4 text-gray-500 self-center">{p.use}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Related Tools */}
        <section className="mt-12 min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-6">🔧 Related PDF Tools</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 min-w-0 w-full">
            {RELATED_TOOLS.map(tool => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}
                className="bg-[#13131F] border border-white/5 hover:border-[#FF3A6C]/30 rounded-2xl p-4 text-center transition-all group min-w-0">
                <div className="text-2xl mb-2 flex-shrink-0">{tool.icon}</div>
                <div className="text-xs font-semibold text-gray-400 group-hover:text-white transition-colors min-w-0 truncate">{tool.name}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Pro CTA */}
        <section className="mt-12 bg-gradient-to-br from-[#FF3A6C]/20 to-[#6C3AFF]/10 border border-[#FF3A6C]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 min-w-0 w-full">
          <div className="text-3xl flex-shrink-0">⚡</div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h3 className="font-bold text-white text-base mb-1 truncate pr-2">Upgrade to PursTech Pro</h3>
            <p className="text-gray-500 text-xs truncate whitespace-normal break-words">Bulk PDF generation, font customization, embedded images and API access. $7/month.</p>
          </div>
          <Link href="/pro" className="px-5 py-2.5 rounded-xl bg-[#FF3A6C] hover:bg-[#6C3AFF] text-white text-sm font-bold transition-all flex-shrink-0">Get Pro</Link>
        </section>

        {/* How to Use */}
        <section className="mt-12 min-w-0 w-full">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Convert Text to PDF</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 min-w-0 w-full">
            {[
              { step:"1", title:"Set page options",     desc:"Choose your page size (A4, Letter or Legal), margins and font size. Enable page numbers for multi-page documents." },
              { step:"2", title:"Enter your text",      desc:"Type or paste text directly into the editor. Or click Upload to load a .txt or .doc file automatically." },
              { step:"3", title:"Review stats",         desc:"The right panel shows word count, estimated page count and your current settings so you can fine-tune before converting." },
              { step:"4", title:"Convert & download",   desc:"Click Convert to PDF. Set a custom filename first if needed. The PDF is created instantly in your browser and downloads automatically." },
            ].map(s => (
              <div key={s.step} className="flex gap-3 min-w-0 w-full">
                <div className="w-7 h-7 rounded-full bg-[#FF3A6C] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div className="min-w-0 w-full">
                  <div className="font-semibold text-white text-sm mb-1 truncate pr-2">{s.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ — ✅ Rule 8: <details>/<summary> */}
        <section className="mt-10 max-w-3xl min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3 min-w-0 w-full">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#FF3A6C]/20 transition-all min-w-0 w-full">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none min-w-0 w-full">
                  <span className="min-w-0 pr-4">{f.q}</span>
                  <span className="text-[#FF3A6C] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* ✅ Rule 5: Privacy/Terms/Contact + © 2026 */}
      <footer className="border-t border-white/5 mt-16 py-8 text-center min-w-0 w-full">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
