"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PDF Merger",
  description: "Free online PDF merger. Combine multiple PDFs with drag-to-reorder, per-file page ranges and custom metadata on the merged output.",
  url: "https://www.purstech.com/tools/pdf-merger",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const FAQ = [
  { q: "Is there a limit to how many PDFs I can merge?",
    a: "There is no hard limit. You can merge as many PDFs as your device's memory allows. For very large sets (50+ files or files over 50 MB each), we recommend merging in batches to avoid browser memory pressure. The final merged PDF can be any size — the tool processes everything locally without any server-side restrictions." },
  { q: "Can I choose specific pages from each PDF to include?",
    a: "Yes. Click the page range field next to each file and enter a range like '1-5, 8, 10-12'. Leave the field blank to include all pages from that file. Page ranges follow standard notation: single numbers (5), inclusive ranges (1-3), and comma-separated combinations (1-3, 5, 7-10). Only the specified pages will appear in the merged PDF." },
  { q: "Does merging PDFs preserve hyperlinks, bookmarks and form fields?",
    a: "Hyperlinks and basic formatting are preserved in the merged output. PDF bookmarks (outline/table of contents) from individual files are not carried over, as combining bookmarks from multiple sources can create conflicts. Form fields are preserved but may have overlapping field names when merging forms — if this is a concern, flatten the forms before merging. Annotations and comments are preserved." },
  { q: "Will the page order be exactly how I arranged the files?",
    a: "Yes. The merged PDF's page order follows your file list from top to bottom. Drag files to reorder them before merging. Each file's pages appear in their original order (or in the order you specified via page ranges). To reverse a specific file's pages, split it first and reorder the split pages." },
  { q: "Can I merge password-protected PDFs?",
    a: "Password-protected (encrypted) PDFs cannot be merged without first removing the password. Some PDFs have owner restrictions (no editing) but no user password — these can sometimes still be processed. If you receive an error for a specific file, that PDF has encryption that prevents modification. Decrypt it using its password before trying to merge." },
];

interface PdfEntry {
  id: string;
  file: File;
  bytes: ArrayBuffer;
  size: number;
  pageCount: number;
  pageRange: string;
  error?: string;
}

const fmtSize = (b: number) => b < 1024 * 1024 ? `${(b / 1024).toFixed(0)} KB` : `${(b / (1024 * 1024)).toFixed(1)} MB`;

function parseRange(rangeStr: string, total: number): number[] {
  if (!rangeStr.trim()) return Array.from({ length: total }, (_, i) => i);
  const pages = new Set<number>();
  rangeStr.split(",").forEach(part => {
    const [a, b] = part.trim().split("-").map(n => parseInt(n.trim()) - 1);
    if (isNaN(a)) return;
    if (isNaN(b)) { if (a >= 0 && a < total) pages.add(a); }
    else { for (let i = a; i <= Math.min(b, total - 1); i++) if (i >= 0) pages.add(i); }
  });
  return Array.from(pages).sort((a, b) => a - b);
}

export default function PDFMergerClient({ children }: { children?: React.ReactNode }) {
  const [entries,    setEntries]    = useState<PdfEntry[]>([]);
  const [dragging,   setDragging]   = useState(false);
  const [merging,    setMerging]    = useState(false);
  const [merged,     setMerged]     = useState<Uint8Array | null>(null);
  const [mergedSize, setMergedSize] = useState(0);
  const [showMeta,   setShowMeta]   = useState(false);
  const [metaTitle,  setMetaTitle]  = useState("");
  const [metaAuthor, setMetaAuthor] = useState("");
  const [error,      setError]      = useState("");
  const [dragIdx,    setDragIdx]    = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(async (files: File[]) => {
    const { PDFDocument } = await import("pdf-lib");
    const pdfs = files.filter(f => f.name.endsWith(".pdf") || f.type === "application/pdf");
    for (const file of pdfs) {
      try {
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        setEntries(p => [...p, {
          id: Math.random().toString(36).slice(2),
          file, bytes, size: file.size,
          pageCount: doc.getPageCount(),
          pageRange: "",
        }]);
      } catch {
        setEntries(p => [...p, {
          id: Math.random().toString(36).slice(2),
          file, bytes: new ArrayBuffer(0), size: file.size,
          pageCount: 0, pageRange: "",
          error: "Could not read PDF",
        }]);
      }
    }
    setMerged(null);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, [addFiles]);

  // Drag-to-reorder
  const onRowDragStart = (i: number) => setDragIdx(i);
  const onRowDragOver  = (e: React.DragEvent, i: number) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === i) return;
    setEntries(p => {
      const arr = [...p];
      const [item] = arr.splice(dragIdx, 1);
      arr.splice(i, 0, item);
      return arr;
    });
    setDragIdx(i);
  };
  const onRowDragEnd = () => setDragIdx(null);

  const updateRange = (id: string, val: string) =>
    setEntries(p => p.map(e => e.id === id ? { ...e, pageRange: val } : e));

  const removeEntry = (id: string) => { setEntries(p => p.filter(e => e.id !== id)); setMerged(null); };

  const merge = async () => {
    if (entries.length < 1) return;
    setMerging(true); setError(""); setMerged(null);
    try {
      const { PDFDocument } = await import("pdf-lib");
      const mergedDoc = await PDFDocument.create();
      if (metaTitle)  mergedDoc.setTitle(metaTitle);
      if (metaAuthor) mergedDoc.setAuthor(metaAuthor);

      for (const entry of entries) {
        if (!entry.bytes.byteLength || entry.error) continue;
        const srcDoc = await PDFDocument.load(entry.bytes, { ignoreEncryption: true });
        const indices = parseRange(entry.pageRange, entry.pageCount);
        const pages = await mergedDoc.copyPages(srcDoc, indices);
        pages.forEach(p => mergedDoc.addPage(p));
      }

      const out = await mergedDoc.save({ useObjectStreams: true });
      setMerged(out);
      setMergedSize(out.byteLength);
    } catch (err) {
      setError("Merge failed — check that all files are valid, unencrypted PDFs.");
    }
    setMerging(false);
  };

  const download = () => {
    if (!merged) return;
    // FIX: ADDED 'as any' HERE TO BYPASS VERCEL'S STRICT TYPING
    const blob = new Blob([merged as any], { type: "application/pdf" });
    Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob), download: "merged.pdf",
    }).click();
  };

  const totalPages = entries.reduce((s, e) => {
    const pages = parseRange(e.pageRange, e.pageCount);
    return s + pages.length;
  }, 0);

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
          <span className="text-gray-400">PDF Merger</span>
        </nav>

        {children}

        {/* Drop zone */}
        <div onDrop={onDrop} onDragOver={e => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-5 ${dragging ? "border-[#FF3A6C]/60 bg-[#FF3A6C]/5" : "border-white/10 hover:border-[#FF3A6C]/30 bg-[#13131F]"}`}>
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" multiple className="hidden"
            onChange={e => addFiles(Array.from(e.target.files ?? []))} />
          <div className="text-4xl mb-3">📑</div>
          <div className="font-bold text-white mb-1">Drop PDFs here or click to browse</div>
          <div className="text-xs text-gray-500">Add at least 2 PDFs · Drag the list below to reorder</div>
        </div>

        {/* File list — drag to reorder */}
        {entries.length > 0 && (
          <div className="space-y-2 mb-5">
            <div className="flex items-center justify-between text-xs text-gray-500 px-1 mb-2">
              <span>Drag rows to reorder · {entries.length} file{entries.length > 1 ? "s" : ""} · {totalPages} pages total</span>
              <button onClick={() => setEntries([])} className="hover:text-[#FF3A6C] transition-colors">Clear all</button>
            </div>
            {entries.map((e, i) => (
              <div key={e.id} draggable
                onDragStart={() => onRowDragStart(i)}
                onDragOver={ev => onRowDragOver(ev, i)}
                onDragEnd={onRowDragEnd}
                className={`bg-[#13131F] border rounded-xl px-4 py-3 flex items-center gap-3 cursor-grab active:cursor-grabbing transition-all ${dragIdx === i ? "border-[#FF3A6C]/40 opacity-60" : "border-white/5"}`}>
                <span className="text-gray-600 text-lg flex-shrink-0">⋮⋮</span>
                <span className="w-6 h-6 rounded-full bg-[#FF3A6C]/20 text-[#FF3A6C] text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{e.file.name}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{fmtSize(e.size)} · {e.pageCount} pages{e.error ? ` · ⚠ ${e.error}` : ""}</div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Page range</div>
                    <input value={e.pageRange} onChange={ev => updateRange(e.id, ev.target.value)}
                      placeholder={`1-${e.pageCount || "?"}`}
                      className="w-24 px-2 py-1 rounded-lg bg-[#0A0A14] border border-white/10 text-white text-xs focus:outline-none focus:border-[#FF3A6C]/50" />
                  </div>
                  <button onClick={() => removeEntry(e.id)} className="text-gray-600 hover:text-[#FF3A6C] transition-colors text-xl">×</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Metadata panel */}
        <button onClick={() => setShowMeta(p => !p)}
          className="w-full flex items-center justify-between bg-[#13131F] border border-white/5 rounded-xl px-5 py-3 mb-4 text-sm font-semibold text-white hover:border-white/20 transition-all">
          <span>⚙ Set metadata on merged PDF (optional)</span>
          <span className={`text-[#FF3A6C] transition-transform ${showMeta ? "rotate-45" : ""}`}>+</span>
        </button>
        {showMeta && (
          <div className="grid grid-cols-2 gap-3 mb-4 bg-[#13131F] border border-white/5 rounded-xl p-4">
            {[{ label:"Title", val:metaTitle, set:setMetaTitle }, { label:"Author", val:metaAuthor, set:setMetaAuthor }].map(f => (
              <div key={f.label}>
                <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                <input value={f.val} onChange={e => f.set(e.target.value)}
                  placeholder={`Merged PDF ${f.label}`}
                  className="w-full px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF3A6C]/50 transition-all" />
              </div>
            ))}
          </div>
        )}

        {error && <div className="mb-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{error}</div>}

        {/* Merge button */}
        {entries.length >= 1 && !merged && (
          <button onClick={merge} disabled={merging || entries.length < 2}
            className="w-full py-4 rounded-2xl bg-[#FF3A6C] hover:bg-[#d42d5a] disabled:opacity-50 text-white font-extrabold text-lg transition-all">
            {merging ? "Merging…" : entries.length < 2 ? "Add at least 2 PDFs to merge" : `🔗 Merge ${entries.length} PDFs`}
          </button>
        )}

        {/* Result */}
        {merged && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <div className="font-bold text-green-400 mb-1">✓ Merged successfully</div>
              <div className="text-xs text-gray-400">{totalPages} pages · {fmtSize(mergedSize)}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setMerged(null); }}
                className="px-4 py-2 rounded-xl bg-[#13131F] border border-white/10 text-gray-400 hover:text-white text-xs font-bold transition-all">
                ← Adjust
              </button>
              <button onClick={download}
                className="px-5 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-bold transition-all">
                ⬇ Download merged.pdf
              </button>
            </div>
          </div>
        )}

        {/* How to Use */}
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Merge PDF Files</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Upload your PDFs", desc:"Drop multiple PDF files into the upload zone. Each file shows its page count and file size." },
              { step:"2", title:"Reorder & set page ranges", desc:"Drag files to set the order they'll appear. Optionally enter a page range for each file (e.g. 1-3, 5)." },
              { step:"3", title:"Add metadata (optional)", desc:"Set a title and author on the merged PDF — useful for sharing or archiving." },
              { step:"4", title:"Merge and download", desc:"Click Merge. The combined PDF downloads instantly — no waiting, no server upload." },
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
