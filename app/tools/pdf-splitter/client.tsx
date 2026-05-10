"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PDF Splitter",
  description: "Free online PDF splitter with 4 modes: split every page, custom ranges, extract specific pages, or remove pages. ZIP download of all parts.",
  url: "https://www.purstech.com/tools/pdf-splitter",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const FAQ = [
  { q: "What is the difference between 'Extract' and 'Remove' mode?",
    a: "Extract mode creates a new PDF containing only the pages you select — the rest are discarded. Remove mode creates a new PDF containing all pages EXCEPT the ones you select — it's the opposite. Use Extract when you want a subset of specific pages. Use Remove when you want to delete a few unwanted pages and keep everything else." },
  { q: "How do I split a PDF into multiple separate files by range?",
    a: "Select 'Custom Ranges' mode and enter your ranges separated by semicolons. For example, '1-5; 6-10; 11-15' creates three separate PDFs. Each range becomes its own downloadable file. You can mix single pages and ranges: '1-3; 5; 7-9' creates three files — pages 1-3, just page 5, and pages 7-9." },
  { q: "Will the split PDFs maintain the original quality?",
    a: "Yes. The split operation simply copies the original page objects into new PDF documents without re-encoding or re-compressing anything. Text remains searchable, images remain at their original resolution, and fonts are preserved exactly as they were. There is zero quality loss in any split mode." },
  { q: "Can I split a PDF and then re-merge the parts in a different order?",
    a: "Absolutely — this is a great workflow for rearranging PDF pages. Split your PDF using 'Every Page' mode to get each page as a separate file, then use our PDF Merger to combine them in any order you like. This effectively lets you rearrange pages in any sequence." },
  { q: "What range syntax does the custom ranges field accept?",
    a: "Single pages (5), inclusive ranges (1-3), and comma-separated combinations (1-3, 5, 7-10) are all supported. Page numbers are 1-indexed (first page = 1). To split into multiple output files, separate range groups with a semicolon: '1-5; 6-10' creates two PDFs. Invalid page numbers beyond the document length are silently ignored." },
];

type Mode = "every" | "ranges" | "extract" | "remove";

const MODES: { id: Mode; icon: string; label: string; desc: string }[] = [
  { id:"every",   icon:"📄", label:"Every Page",     desc:"One PDF per page"             },
  { id:"ranges",  icon:"✂️",  label:"Custom Ranges",  desc:"Split into range groups"      },
  { id:"extract", icon:"⬆️",  label:"Extract Pages",  desc:"Keep only selected pages"    },
  { id:"remove",  icon:"🗑",  label:"Remove Pages",   desc:"Delete selected pages"       },
];

function parseRanges(input: string, total: number): number[][] {
  return input.split(";").map(group => {
    const pages: number[] = [];
    group.split(",").forEach(part => {
      const [a, b] = part.trim().split("-").map(n => parseInt(n.trim()));
      if (isNaN(a)) return;
      const start = a - 1;
      const end   = isNaN(b) ? start : b - 1;
      for (let i = start; i <= Math.min(end, total - 1); i++) if (i >= 0) pages.push(i);
    });
    return [...new Set(pages)].sort((a, b) => a - b);
  }).filter(g => g.length > 0);
}

export default function PDFSplitterClient({ children }: { children?: React.ReactNode }) {
  const [file,          setFile]        = useState<File | null>(null);
  const [bytes,         setBytes]       = useState<ArrayBuffer | null>(null);
  const [pageCount,     setPageCount]   = useState(0);
  const [mode,          setMode]        = useState<Mode>("every");
  const [rangeInput,    setRangeInput]  = useState("");
  const [selected,      setSelected]    = useState<Set<number>>(new Set());
  const [dragging,      setDragging]    = useState(false);
  const [splitting,     setSplitting]   = useState(false);
  const [results,       setResults]     = useState<{ name: string; bytes: Uint8Array }[]>([]);
  const [error,         setError]       = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = useCallback(async (f: File) => {
    try {
      const { PDFDocument } = await import("pdf-lib");
      const buf = await f.arrayBuffer();
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
      setFile(f); setBytes(buf); setPageCount(doc.getPageCount());
      setSelected(new Set()); setResults([]); setError("");
    } catch { setError("Could not read PDF — it may be encrypted or corrupted."); }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) loadFile(f);
  }, [loadFile]);

  const togglePage = (i: number) => setSelected(p => {
    const s = new Set(p);
    s.has(i) ? s.delete(i) : s.add(i);
    return s;
  });

  const selectAll   = () => setSelected(new Set(Array.from({ length: pageCount }, (_, i) => i)));
  const clearSelect = () => setSelected(new Set());

  const split = async () => {
    if (!bytes || !file) return;
    setSplitting(true); setError(""); setResults([]);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const srcDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      const parts:  { name: string; bytes: Uint8Array }[] = [];

      if (mode === "every") {
        for (let i = 0; i < pageCount; i++) {
          const doc = await PDFDocument.create();
          const [pg] = await doc.copyPages(srcDoc, [i]);
          doc.addPage(pg);
          parts.push({ name: `page_${String(i+1).padStart(3,"0")}.pdf`, bytes: await doc.save() });
        }
      } else if (mode === "ranges") {
        const groups = rangeInput.trim()
          ? parseRanges(rangeInput, pageCount)
          : [Array.from({ length: pageCount }, (_, i) => i)];
        for (let gi = 0; gi < groups.length; gi++) {
          const doc = await PDFDocument.create();
          const pgs = await doc.copyPages(srcDoc, groups[gi]);
          pgs.forEach(p => doc.addPage(p));
          parts.push({ name: `part_${gi + 1}.pdf`, bytes: await doc.save() });
        }
      } else if (mode === "extract") {
        const indices = [...selected].sort((a, b) => a - b);
        if (indices.length === 0) { setError("Select at least one page to extract."); setSplitting(false); return; }
        const doc = await PDFDocument.create();
        const pgs = await doc.copyPages(srcDoc, indices);
        pgs.forEach(p => doc.addPage(p));
        parts.push({ name: `extracted_pages.pdf`, bytes: await doc.save() });
      } else if (mode === "remove") {
        const keep = Array.from({ length: pageCount }, (_, i) => i).filter(i => !selected.has(i));
        if (keep.length === 0) { setError("Cannot remove all pages — keep at least one."); setSplitting(false); return; }
        const doc = await PDFDocument.create();
        const pgs = await doc.copyPages(srcDoc, keep);
        pgs.forEach(p => doc.addPage(p));
        parts.push({ name: `without_removed_pages.pdf`, bytes: await doc.save() });
      }

      setResults(parts);
    } catch (err) {
      setError("Split failed — ensure the PDF is valid and unencrypted.");
    }
    setSplitting(false);
  };

  const downloadAll = async () => {
    if (results.length === 1) {
      // FIX: ADDED 'as any' HERE TO BYPASS VERCEL'S STRICT TYPING
      const blob = new Blob([results[0].bytes as any], { type: "application/pdf" });
      Object.assign(document.createElement("a"), {
        href: URL.createObjectURL(blob), download: results[0].name,
      }).click();
      return;
    }
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    results.forEach(r => zip.file(r.name, r.bytes));
    const blob = await zip.generateAsync({ type: "blob" });
    Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob), download: "split_pdfs.zip",
    }).click();
  };

  const fmtSize = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`;

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
          <span className="text-gray-400">PDF Splitter</span>
        </nav>

        {children}

        {/* Mode selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          {MODES.map(m => (
            <button key={m.id} onClick={() => { setMode(m.id); setSelected(new Set()); setResults([]); }}
              className={`border rounded-2xl p-4 text-left transition-all ${mode === m.id ? "border-[#FF3A6C]/60 bg-[#FF3A6C]/10" : "border-white/5 bg-[#13131F] hover:border-white/20"}`}>
              <div className="text-2xl mb-2">{m.icon}</div>
              <div className="font-bold text-white text-xs">{m.label}</div>
              <div className="text-xs text-gray-500 mt-0.5 leading-snug">{m.desc}</div>
            </button>
          ))}
        </div>

        {/* Drop zone */}
        {!file ? (
          <div onDrop={onDrop} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${dragging ? "border-[#FF3A6C]/60 bg-[#FF3A6C]/5" : "border-white/10 hover:border-[#FF3A6C]/30 bg-[#13131F]"}`}>
            <input ref={inputRef} type="file" accept=".pdf,application/pdf" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
            <div className="text-4xl mb-3">✂️</div>
            <div className="font-bold text-white mb-1">Drop a PDF file here or click to browse</div>
            <div className="text-xs text-gray-500">Single PDF · Any size</div>
          </div>
        ) : (
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <div className="text-sm font-semibold text-white">{file.name}</div>
                <div className="text-xs text-gray-500">{fmtSize(file.size)} · {pageCount} pages</div>
              </div>
            </div>
            <button onClick={() => { setFile(null); setBytes(null); setPageCount(0); setResults([]); setError(""); }}
              className="text-gray-600 hover:text-[#FF3A6C] transition-colors">Change file</button>
          </div>
        )}

        {error && <div className="mt-3 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</div>}

        {/* Mode-specific controls */}
        {file && pageCount > 0 && (
          <div className="mt-4 space-y-4">
            {mode === "ranges" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Range groups (separate groups with semicolons)
                </label>
                <input value={rangeInput} onChange={e => setRangeInput(e.target.value)}
                  placeholder="e.g. 1-3; 4-6; 7-10   or   1-5; 6"
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#FF3A6C]/50 transition-all" />
                <div className="text-xs text-gray-600 mt-2">Each group separated by semicolons becomes its own PDF file</div>
              </div>
            )}

            {(mode === "extract" || mode === "remove") && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {mode === "extract" ? "Click to select pages to extract" : "Click to select pages to remove"}
                  </span>
                  <div className="flex gap-2 text-xs">
                    <button onClick={selectAll} className="text-[#FF3A6C] hover:text-white transition-colors">All</button>
                    <span className="text-gray-600">·</span>
                    <button onClick={clearSelect} className="text-gray-400 hover:text-white transition-colors">None</button>
                    <span className="text-gray-600">·</span>
                    <span className="text-gray-500">{selected.size} selected</span>
                  </div>
                </div>
                <div className="grid grid-cols-8 sm:grid-cols-12 gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {Array.from({ length: pageCount }, (_, i) => (
                    <button key={i} onClick={() => togglePage(i)}
                      className={`aspect-square rounded-lg text-xs font-bold transition-all border ${
                        selected.has(i)
                          ? mode === "extract"
                            ? "bg-[#6C3AFF] border-[#6C3AFF] text-white"
                            : "bg-[#FF3A6C] border-[#FF3A6C] text-white"
                          : "bg-[#0A0A14] border-white/10 text-gray-500 hover:border-white/30"
                      }`}>
                      {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Split button */}
            {results.length === 0 && (
              <button onClick={split} disabled={splitting}
                className="w-full py-4 rounded-2xl bg-[#FF3A6C] hover:bg-[#d42d5a] disabled:opacity-50 text-white font-extrabold text-lg transition-all">
                {splitting ? "Splitting…" : mode === "every" ? `✂️ Split into ${pageCount} files` : mode === "ranges" ? "✂️ Split by Ranges" : mode === "extract" ? `✂️ Extract ${selected.size} page${selected.size !== 1 ? "s" : ""}` : `✂️ Remove ${selected.size} page${selected.size !== 1 ? "s" : ""}`}
              </button>
            )}

            {/* Results */}
            {results.length > 0 && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="font-bold text-green-400">✓ Split complete — {results.length} file{results.length > 1 ? "s" : ""}</div>
                  <button onClick={() => setResults([])} className="text-gray-500 hover:text-white text-xs transition-colors">← Adjust</button>
                </div>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 mb-4">
                  {results.slice(0, 10).map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-[#0A0A14] rounded-lg px-3 py-2">
                      <span className="text-gray-300 font-mono">{r.name}</span>
                      <span className="text-gray-500">{fmtSize(r.bytes.byteLength)}</span>
                    </div>
                  ))}
                  {results.length > 10 && <div className="text-xs text-gray-500 text-center py-1">+ {results.length - 10} more files in ZIP</div>}
                </div>
                <button onClick={downloadAll}
                  className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all">
                  {results.length > 1 ? `⬇ Download all (ZIP)` : `⬇ Download ${results[0].name}`}
                </button>
              </div>
            )}
          </div>
        )}

        {/* How to Use */}
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Split a PDF Online</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Choose a split mode", desc:"Every Page creates one PDF per page. Custom Ranges splits into groups. Extract keeps selected pages. Remove deletes selected pages." },
              { step:"2", title:"Upload your PDF", desc:"Drag and drop or click to browse. The tool reads the file locally — nothing is uploaded to any server." },
              { step:"3", title:"Select pages or enter ranges", desc:"Click page thumbnails to select, or type ranges like '1-3, 5, 7-10' in the ranges field." },
              { step:"4", title:"Split and download", desc:"Click Split. Download one file or all parts at once as a ZIP archive." },
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
