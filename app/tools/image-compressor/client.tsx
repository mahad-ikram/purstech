"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

interface ImageFile {
  id:           number;
  name:         string;
  originalSize: number;
  originalUrl:  string;
  compressedUrl: string | null;
  compressedSize: number | null;
  width:        number;
  height:       number;
  status:       "idle" | "compressing" | "done" | "error";
}

let fileId = 1;

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function savings(original: number, compressed: number): string {
  return `${Math.round((1 - compressed / original) * 100)}%`;
}

const FAQ = [
  {
    q: "How much can I compress an image without losing visible quality?",
    a: "For JPEG images, a quality setting of 70–85% typically reduces file size by 60–80% with no visible quality loss to the human eye at normal viewing distances. WebP achieves 25–35% better compression than JPEG at the same visual quality. Our quality slider lets you find the perfect balance for your specific image and use case.",
  },
  {
    q: "Is my image data safe when I use this compressor?",
    a: "Completely. All compression happens directly in your browser using the HTML5 Canvas API. Your images are never uploaded to any server, never stored, and never transmitted over the internet. They exist only in your browser's memory during compression and are gone the moment you close the tab.",
  },
  {
    q: "What is the difference between JPEG, PNG and WebP compression?",
    a: "JPEG uses lossy compression — permanently removing some image data — which produces very small files but with some quality degradation at extreme settings. PNG uses lossless compression, preserving every pixel perfectly but producing larger files. WebP is a modern format that outperforms both — achieving smaller files than JPEG at the same visual quality, with both lossy and lossless modes. For most web images, converting to WebP provides the best results.",
  },
  {
    q: "Why does my compressed PNG sometimes end up larger than the original?",
    a: "PNG uses lossless compression, which means reducing file size is limited by how compressible the image data actually is. If your PNG contains a complex photograph with millions of unique color values, compression gains are minimal and can sometimes increase file size slightly due to metadata overhead. For photographs, convert to JPEG or WebP instead. PNG is ideal for logos, icons, screenshots and graphics with large areas of flat color.",
  },
  {
    q: "Can I compress multiple images at once?",
    a: "Yes — our batch compression feature lets you upload and compress up to 20 images simultaneously. Each image is processed independently with your chosen quality and format settings. Download each compressed image individually by clicking its download button. Batch processing works entirely in your browser with no server needed.",
  },
];

export default function ImageCompressorClient() {
  const [files,    setFiles]    = useState<ImageFile[]>([]);
  const [quality,  setQuality]  = useState(80);
  const [format,   setFormat]   = useState<"original" | "jpeg" | "png" | "webp">("original");
  const [dragging, setDragging] = useState(false);
  const [preview,  setPreview]  = useState<string | null>(null); // id of image to preview
  const [comparing, setComparing] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const compress = useCallback(async (file: ImageFile, q: number, fmt: string) => {
    return new Promise<{ url: string; size: number }>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas  = document.createElement("canvas");
        canvas.width  = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        // White background for JPEG (no transparency support)
        if (fmt === "jpeg" || (fmt === "original" && file.name.match(/\.jpe?g$/i))) {
          ctx.fillStyle = "#FFFFFF";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        ctx.drawImage(img, 0, 0);
        const mimeType = fmt === "png" ? "image/png" : fmt === "webp" ? "image/webp" : fmt === "jpeg" ? "image/jpeg" :
          file.name.match(/\.png$/i) ? "image/png" : file.name.match(/\.(webp)$/i) ? "image/webp" : "image/jpeg";
        const dataUrl = canvas.toDataURL(mimeType, q / 100);
        // Estimate size from base64
        const base64 = dataUrl.split(",")[1];
        const size = Math.round((base64.length * 3) / 4);
        resolve({ url: dataUrl, size });
      };
      img.src = file.originalUrl;
    });
  }, []);

  const processFile = useCallback(async (imgFile: ImageFile, q: number, fmt: string) => {
    setFiles(prev => prev.map(f => f.id === imgFile.id ? { ...f, status: "compressing" } : f));
    const result = await compress(imgFile, q, fmt);
    setFiles(prev => prev.map(f => f.id === imgFile.id
      ? { ...f, status: "done", compressedUrl: result.url, compressedSize: result.size }
      : f));
  }, [compress]);

  function addFiles(fileList: FileList) {
    const allowed = ["image/jpeg","image/png","image/webp","image/gif"];
    Array.from(fileList).slice(0, 20 - files.length).forEach(f => {
      if (!allowed.includes(f.type)) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const url = e.target?.result as string;
        const img = new Image();
        img.onload = () => {
          const newFile: ImageFile = {
            id: fileId++, name: f.name, originalSize: f.size,
            originalUrl: url, compressedUrl: null, compressedSize: null,
            width: img.width, height: img.height, status: "idle",
          };
          setFiles(prev => [...prev, newFile]);
          processFile(newFile, quality, format);
        };
        img.src = url;
      };
      reader.readAsDataURL(f);
    });
  }

  // Re-compress all when quality or format changes
  useEffect(() => {
    files.forEach(f => { if (f.status === "done" || f.status === "idle") processFile(f, quality, format); });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality, format]);

  function download(f: ImageFile) {
    if (!f.compressedUrl) return;
    const ext = format === "original" ? f.name.split(".").pop() : format;
    const a = Object.assign(document.createElement("a"), {
      href: f.compressedUrl,
      download: `${f.name.replace(/\.[^/.]+$/, "")}-compressed.${ext}`,
    });
    a.click();
  }

  function downloadAll() {
    files.filter(f => f.compressedUrl).forEach(f => download(f));
  }

  function removeFile(id: number) {
    setFiles(prev => prev.filter(f => f.id !== id));
  }

  const totalOriginal   = files.reduce((a, f) => a + f.originalSize, 0);
  const totalCompressed = files.reduce((a, f) => a + (f.compressedSize || f.originalSize), 0);
  const doneCount       = files.filter(f => f.status === "done").length;

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/blog"  className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span>›</span>
          <span className="text-gray-400">Image Compressor</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Image Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Image Compressor Online — Reduce Image Size Without Losing Quality
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Compress JPEG, PNG and WebP images by up to 90% with a live before/after preview. Batch compress up to 20 images. 100% browser-based — your images never leave your device.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-white">Quality: {quality}%</label>
                <span className="text-xs text-gray-500">
                  {quality >= 85 ? "High Quality" : quality >= 65 ? "Balanced ✓" : quality >= 45 ? "Small File" : "Maximum Compression"}
                </span>
              </div>
              <input type="range" min={1} max={100} value={quality}
                onChange={e => setQuality(Number(e.target.value))}
                className="w-full accent-[#6C3AFF] cursor-pointer" />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Maximum Compression</span><span>Best Quality</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-white mb-2">Output Format</label>
              <div className="grid grid-cols-4 gap-2">
                {(["original","jpeg","png","webp"] as const).map(f => (
                  <button key={f} onClick={() => setFormat(f)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                      format === f ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                    }`}>
                    {f === "original" ? "Auto" : f.toUpperCase()}
                    {f === "webp" && <span className="block text-xs opacity-70">Best</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files); }}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all mb-6 ${
            dragging ? "border-[#6C3AFF] bg-[#6C3AFF]/5" : "border-white/10 hover:border-[#6C3AFF]/40 hover:bg-[#6C3AFF]/5"
          }`}>
          <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
            onChange={e => e.target.files && addFiles(e.target.files)} />
          <div className="text-4xl mb-3">🖼️</div>
          <div className="text-white font-bold text-lg mb-1">Drop images here or click to upload</div>
          <div className="text-gray-500 text-sm">JPEG · PNG · WebP · GIF · Up to 20 images · No file size limit</div>
        </div>

        {/* Batch summary */}
        {files.length > 0 && (
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-xl font-extrabold text-white">{files.length}</div>
                <div className="text-xs text-gray-500">Images</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-extrabold text-white">{formatBytes(totalOriginal)}</div>
                <div className="text-xs text-gray-500">Original</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-extrabold text-green-400">{formatBytes(totalCompressed)}</div>
                <div className="text-xs text-gray-500">Compressed</div>
              </div>
              {totalOriginal > 0 && (
                <div className="text-center">
                  <div className="text-xl font-extrabold text-[#6C3AFF]">
                    {savings(totalOriginal, totalCompressed)} saved
                  </div>
                  <div className="text-xs text-gray-500">Total savings</div>
                </div>
              )}
            </div>
            <div className="flex gap-2">
              {doneCount > 1 && (
                <button onClick={downloadAll}
                  className="px-4 py-2 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-sm font-bold transition-all">
                  ⬇ Download All ({doneCount})
                </button>
              )}
              <button onClick={() => setFiles([])}
                className="px-4 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-[#FF3A6C] text-sm transition-all">
                Clear All
              </button>
            </div>
          </div>
        )}

        {/* File list */}
        <div className="space-y-3">
          {files.map(f => (
            <div key={f.id} className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
              <div className="flex items-center gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-[#0A0A14] flex-shrink-0 border border-white/5">
                  <img src={f.compressedUrl || f.originalUrl} alt={f.name}
                    className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-white text-sm truncate mb-1">{f.name}</div>
                  <div className="text-xs text-gray-500 mb-2">{f.width}×{f.height}px</div>

                  {f.status === "compressing" && (
                    <div className="h-1.5 bg-[#0A0A14] rounded-full overflow-hidden">
                      <div className="h-full bg-[#6C3AFF] rounded-full animate-pulse w-3/4" />
                    </div>
                  )}

                  {f.status === "done" && f.compressedSize !== null && (
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 line-through">{formatBytes(f.originalSize)}</span>
                      <span className="text-xs">→</span>
                      <span className="text-xs text-green-400 font-semibold">{formatBytes(f.compressedSize)}</span>
                      <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full border border-green-500/20 font-bold">
                        {savings(f.originalSize, f.compressedSize)} smaller
                      </span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {f.status === "done" && (
                    <>
                      <button
                        onClick={() => setComparing(comparing === String(f.id) ? null : String(f.id))}
                        className="px-3 py-1.5 rounded-lg bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white text-xs transition-all">
                        {comparing === String(f.id) ? "Close" : "Compare"}
                      </button>
                      <button onClick={() => download(f)}
                        className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-xs font-bold transition-all">
                        ⬇ Save
                      </button>
                    </>
                  )}
                  <button onClick={() => removeFile(f.id)}
                    className="text-gray-600 hover:text-[#FF3A6C] transition-colors text-sm">×</button>
                </div>
              </div>

              {/* Before / After comparison */}
              {comparing === String(f.id) && f.compressedUrl && (
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1 text-center">Original · {formatBytes(f.originalSize)}</div>
                    <img src={f.originalUrl} alt="Original" className="w-full rounded-xl object-contain max-h-48" />
                  </div>
                  <div>
                    <div className="text-xs text-green-400 mb-1 text-center">
                      Compressed · {formatBytes(f.compressedSize!)} · {savings(f.originalSize, f.compressedSize!)} smaller
                    </div>
                    <img src={f.compressedUrl} alt="Compressed" className="w-full rounded-xl object-contain max-h-48" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Compress Images Online</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Upload your images", desc:"Drop images onto the upload zone or click to browse. You can upload up to 20 images at once for batch compression." },
              { step:"2", title:"Choose quality & format", desc:"Adjust the quality slider (70–85% is optimal for most images). Select WebP for the best compression, or keep Auto to preserve the original format." },
              { step:"3", title:"Preview the results", desc:"Each compressed image shows the new file size and percentage savings. Click Compare to see a side-by-side before/after comparison." },
              { step:"4", title:"Download", desc:"Click Save next to any image to download it. Use Download All to save every compressed image at once." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#6C3AFF] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div>
                  <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((faq, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{faq.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/about"   className="hover:text-gray-400 transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2025 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
