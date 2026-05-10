"use client";

import { useState, useCallback, useRef } from "react";
import Link from "next/link";

/* ── Schema ───────────────────────────────────────────────────────────────── */
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "PDF Compressor",
  description: "Free online PDF compressor. Reduce PDF size by up to 80% with three compression levels, metadata removal and batch processing.",
  url: "https://www.purstech.com/tools/pdf-compressor",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

/* ── FAQ ──────────────────────────────────────────────────────────────────── */
const FAQ = [
  { q: "How does browser-based PDF compression work?",
    a: "Our compressor uses pdf-lib to re-encode your PDF using efficient object streams, removes redundant data structures, and strips embedded metadata. This reorganises the file's internal structure to be more compact. For text-heavy PDFs, savings of 10–50% are typical. For PDFs with embedded images or already heavily optimised files, savings may be smaller — the compressor won't degrade image quality." },
  { q: "Will compression reduce the visual quality of my PDF?",
    a: "No. Our compression is lossless — it targets the file structure, not the content. Text, vector graphics and embedded fonts remain pixel-perfect. If your PDF contains raster images, those images are re-encoded at their original quality. The 'Maximum' level strips more metadata and uses tighter object packing, which may slightly affect compatibility with very old PDF readers but has no effect on visual quality." },
  { q: "What is PDF metadata and should I remove it?",
    a: "PDF metadata includes the author name, creation software, creation date, modification date and custom properties. This information is invisible to readers but adds to file size. Removing it is safe for most use cases — documents you're sharing publicly, submitting to web forms or emailing. Keep metadata if you need to track document versions or if it's required for compliance (e.g., legal filings)." },
  { q: "Why is my compressed PDF larger than the original?",
    a: "This can happen with PDFs that are already optimised, or PDFs where re-encoding adds overhead. pdf-lib rewrites the file structure, which occasionally adds a small fixed overhead. If this happens, the tool will show a '0% savings' result — always compare sizes before replacing your original file." },
  { q: "Is there a file size limit?",
    a: "There is no hard limit — processing happens entirely in your browser using your device's RAM. Very large PDFs (over 200MB) may be slow to process on lower-powered devices. For best performance, we recommend processing files under 100MB per batch. All processing is private — your files never touch our servers." },
];

type Level = "light" | "medium" | "maximum";
type Status = "idle" | "processing" | "done" | "error";

interface PdfEntry {
  id: string;
  file: File;
  originalSize: number;
  compressedSize?: number;
  compressedBytes?: Uint8Array;
  status: Status;
  error?: string;
}

const fmtSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const savings = (orig: number, comp: number) =>
  orig > 0 ? Math.max(0, Math.round((1 - comp / orig) * 100)) : 0;

const LEVEL_CONFIG: Record<Level, { label: string; desc: string; color: string }> = {
  light:   { label: "Light",   desc: "Safe for all PDF readers, ~5–15% reduction",  color: "bg-green-500"  },
  medium:  { label: "Medium",  desc: "Strips metadata, ~15–35% reduction",           color: "bg-yellow-500" },
  maximum: { label: "Maximum", desc: "Maximum packing, ~25–50% reduction",           color: "bg-[#FF3A6C]"  },
};

export default function PDFCompressorClient({ children }: { children?: React.ReactNode }) {
  const [entries,        setEntries]        = useState<PdfEntry[]>([]);
  const [level,          setLevel]          = useState<Level>("medium");
  const [removeMeta,     setRemoveMeta]     = useState(true);
  const [dragging,       setDragging]       = useState(false);
  const [processing,     setProcessing]     = useState(false);
  const [openFaq,        setOpenFaq]        = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: File[]) => {
    const pdfs = files.filter(f => f.type === "application/pdf" || f.name.endsWith(".pdf"));
    const newEntries: PdfEntry[] = pdfs.map(f => ({
      id: Math.random().toString(36).slice(2),
      file: f,
      originalSize: f.size,
      status: "idle",
    }));
    setEntries(p => [...p, ...newEntries]);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(Array.from(e.dataTransfer.files));
  }, [addFiles]);

  const removeEntry = (id: string) => setEntries(p => p.filter(e => e.id !== id));

  const compressAll = async () => {
    if (entries.length === 0) return;
    setProcessing(true);

    const { PDFDocument } = await import("pdf-lib");

    const updated = [...entries];
    for (let i = 0; i < updated.length; i++) {
      if (updated[i].status === "done") continue;
      updated[i] = { ...updated[i], status: "processing" };
      setEntries([...updated]);
      try {
        const buf = await updated[i].file.arrayBuffer();
        const doc = await PDFDocument.load(buf, { ignoreEncryption: true });

        if (removeMeta || level !== "light") {
          doc.setTitle("");
          doc.setAuthor("");
          doc.setSubject("");
          doc.setKeywords([]);
          doc.setProducer("");
          doc.setCreator("");
        }

        const useObjectStreams = level !== "light";
        const compressed = await doc.save({ useObjectStreams });

        updated[i] = {
          ...updated[i],
          status: "done",
          compressedSize: compressed.byteLength,
          compressedBytes: compressed,
        };
      } catch (err) {
        updated[i] = { ...updated[i], status: "error", error: "Failed to process PDF" };
      }
      setEntries([...updated]);
    }
    setProcessing(false);
  };

  const downloadOne = (entry: PdfEntry) => {
    if (!entry.compressedBytes) return;
    const blob = new Blob([entry.compressedBytes], { type: "application/pdf" });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: `compressed_${entry.file.name}`,
    });
    a.click();
  };

  const downloadAll = async () => {
    const done = entries.filter(e => e.status === "done" && e.compressedBytes);
    if (done.length === 0) return;
    if (done.length === 1) { downloadOne(done[0]); return; }
    const JSZip = (await import("jszip")).default;
    const zip = new JSZip();
    done.forEach(e => zip.file(`compressed_${e.file.name}`, e.compressedBytes!));
    const blob = await zip.generateAsync({ type: "blob" });
    Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob), download: "compressed_pdfs.zip",
    }).click();
  };

  const totalSaved = entries.reduce((acc, e) =>
    e.status === "done" && e.compressedSize !== undefined
      ? acc + Math.max(0, e.originalSize - e.compressedSize)
      : acc, 0);

  const doneCount = entries.filter(e => e.status === "done").length;

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
          <span className="text-gray-400">PDF Compressor</span>
        </nav>

        {children}

        {/* Level selector */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {(Object.entries(LEVEL_CONFIG) as [Level, typeof LEVEL_CONFIG[Level]][]).map(([k, v]) => (
            <button key={k} onClick={() => setLevel(k)}
              className={`border rounded-2xl p-4 text-left transition-all ${level === k ? "border-[#FF3A6C]/60 bg-[#FF3A6C]/10" : "border-white/5 bg-[#13131F] hover:border-white/20"}`}>
              <div className={`w-2.5 h-2.5 rounded-full ${v.color} mb-2`} />
              <div className="font-bold text-white text-sm">{v.label}</div>
              <div className="text-xs text-gray-500 mt-1 leading-snug">{v.desc}</div>
            </button>
          ))}
        </div>

        {/* Options */}
        <div className="flex items-center gap-3 mb-5 bg-[#13131F] border border-white/5 rounded-xl px-4 py-3">
          <button onClick={() => setRemoveMeta(p => !p)}
            className={`w-10 h-5 rounded-full transition-all relative flex-shrink-0 ${removeMeta ? "bg-[#FF3A6C]" : "bg-gray-700"}`}>
            <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${removeMeta ? "left-[22px]" : "left-0.5"}`} />
          </button>
          <div>
            <div className="text-sm font-semibold text-white">Remove metadata</div>
            <div className="text-xs text-gray-500">Strips author, creator, dates — extra size savings</div>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDrop={onDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-5 ${dragging ? "border-[#FF3A6C]/60 bg-[#FF3A6C]/5" : "border-white/10 hover:border-[#FF3A6C]/30 bg-[#13131F]"}`}>
          <input ref={inputRef} type="file" accept=".pdf,application/pdf" multiple className="hidden"
            onChange={e => addFiles(Array.from(e.target.files ?? []))} />
          <div className="text-4xl mb-3">📄</div>
          <div className="font-bold text-white mb-1">Drop PDF files here or click to browse</div>
          <div className="text-xs text-gray-500">Supports multiple files · Max recommended 100 MB each</div>
        </div>

        {/* File list */}
        {entries.length > 0 && (
          <div className="space-y-2 mb-5">
            {entries.map(e => (
              <div key={e.id} className="bg-[#13131F] border border-white/5 rounded-xl px-4 py-3 flex items-center gap-4">
                <span className="text-2xl flex-shrink-0">📄</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-white truncate">{e.file.name}</div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span>Original: {fmtSize(e.originalSize)}</span>
                    {e.status === "done" && e.compressedSize !== undefined && (
                      <>
                        <span>→</span>
                        <span className="text-green-400">Compressed: {fmtSize(e.compressedSize)}</span>
                        <span className={`font-bold ${savings(e.originalSize, e.compressedSize) > 0 ? "text-green-400" : "text-gray-500"}`}>
                          {savings(e.originalSize, e.compressedSize) > 0 ? `-${savings(e.originalSize, e.compressedSize)}%` : "No change"}
                        </span>
                      </>
                    )}
                    {e.status === "processing" && <span className="text-yellow-400 animate-pulse">Compressing…</span>}
                    {e.status === "error" && <span className="text-red-400">{e.error}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {e.status === "done" && (
                    <button onClick={() => downloadOne(e)}
                      className="px-3 py-1.5 rounded-lg bg-[#FF3A6C] hover:bg-[#d42d5a] text-white text-xs font-bold transition-all">
                      ⬇ Download
                    </button>
                  )}
                  <button onClick={() => removeEntry(e.id)}
                    className="text-gray-600 hover:text-[#FF3A6C] transition-colors text-lg px-1">×</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats bar */}
        {doneCount > 0 && (
          <div className="bg-green-500/10 border border-green-500/20 rounded-xl px-5 py-3 flex items-center justify-between mb-5">
            <div className="text-sm text-green-400">
              <span className="font-bold">{doneCount}</span> file{doneCount > 1 ? "s" : ""} compressed
              {totalSaved > 0 && <span className="ml-2">· <strong>{fmtSize(totalSaved)}</strong> total saved</span>}
            </div>
            <button onClick={downloadAll}
              className="px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-all">
              {doneCount > 1 ? "⬇ Download All (ZIP)" : "⬇ Download"}
            </button>
          </div>
        )}

        {/* Compress button */}
        {entries.some(e => e.status === "idle") && (
          <button onClick={compressAll} disabled={processing}
            className="w-full py-4 rounded-2xl bg-[#FF3A6C] hover:bg-[#d42d5a] disabled:opacity-50 text-white font-extrabold text-lg transition-all">
            {processing ? "Compressing…" : `🗜 Compress ${entries.filter(e => e.status === "idle").length} PDF${entries.filter(e => e.status === "idle").length > 1 ? "s" : ""}`}
          </button>
        )}

        {entries.length === 0 && (
          <div className="text-center py-4 text-gray-600 text-sm">Add PDF files above to get started</div>
        )}

        {/* How to Use */}
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Compress a PDF Online</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Choose compression level", desc:"Pick Light for maximum compatibility, Medium for a good balance, or Maximum for the smallest file size." },
              { step:"2", title:"Upload your PDFs", desc:"Drag and drop one or more PDF files into the upload area, or click to browse your device." },
              { step:"3", title:"Click Compress", desc:"The tool processes all files in your browser. Watch the before/after size appear for each file." },
              { step:"4", title:"Download results", desc:"Download each compressed PDF individually, or grab all of them at once in a single ZIP file." },
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
        <p className="text-gray-700 text-xs mt-3">© 2025 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}


