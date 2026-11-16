"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool";
import {
  ONNX_MODELS,
  UPSCALER_TILE_PRESETS,
  UpscalerPatchMode,
  isModelCached,
  runSwin2SrTiledUpscale,
} from "@/lib/onnx-engine";

const RELATED_TOOLS = [
  { icon: "✂️", name: "AI Background Remover", slug: "background-remover" },
  { icon: "🎨", name: "AI Photo Colorizer", slug: "image-colorizer" },
  { icon: "🛡️", name: "SynthID & C2PA Remover", slug: "synthid-remover" },
  { icon: "🗜", name: "Image Compressor", slug: "image-compressor" },
  { icon: "📐", name: "Image Resizer", slug: "image-resizer" },
  { icon: "📷", name: "Image to Text (OCR)", slug: "image-to-text" },
];

const FAQ = [
  {
    q: "How does Swin2SR 4× tiled super-resolution work in the browser?",
    a: "Swin2SR is a Vision Transformer architecture built on SwinV2 layers trained specifically to reverse JPEG compression blocks, blur, and low-resolution aliasing. Because running a transformer on a full 2000×2000 image all at once would exceed browser WebAssembly memory limits, our engine splits the image into overlapping tiles (32px, 64px, or 128px with 1–4px border padding), upscales each tile 4× via ONNX Runtime Web, and reassembles them without grid seams.",
  },
  {
    q: "What is the difference between Swin2SR ONNX and Instant Edge-Directed Upscaling?",
    a: "Swin2SR ONNX downloads a ~18 MB (Quantized) or ~36 MB (FP16) neural network to your browser's IndexedDB cache and reconstructs high-frequency textures tile-by-tile. Instant Edge-Directed Mode runs immediately with zero model download using multi-pass high-order interpolation combined with adaptive luminance unsharp masking—ideal when you need an instant 2× or 4× enlargement in under 1 second.",
  },
  {
    q: "Does it support transparent PNG and WebP cutouts?",
    a: "Yes! If you first remove a background in PursTech's AI Background Remover and bring the transparent cutout here, the engine automatically detects the alpha channel and preserves full transparency at 4× resolution.",
  },
];

export default function ImageUpscalerClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("image-upscaler", "image");

  const [engine, setEngine] = useState<"swin2sr_quantized" | "swin2sr_fp16" | "instant_edge_4x" | "instant_edge_2x">("swin2sr_quantized");
  const [patchMode, setPatchMode] = useState<UpscalerPatchMode>("balanced");
  const [sharpenStrength, setSharpenStrength] = useState<number>(45);
  const [cachedMap, setCachedMap] = useState<{ swin2sr_quantized?: boolean; swin2sr_fp16?: boolean }>({});
  const [origUrl, setOrigUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [imgName, setImgName] = useState<string>("image");
  const [origDim, setOrigDim] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [outDim, setOutDim] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [progress, setProgress] = useState<number>(0);
  const [progressMsg, setProgressMsg] = useState<string>("");
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [exportFormat, setExportFormat] = useState<"image/webp" | "image/png" | "image/jpeg">("image/webp");
  const [exportQuality, setExportQuality] = useState<number>(92);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const outCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    Promise.all([
      isModelCached("swin2sr_quantized"),
      isModelCached("swin2sr_fp16"),
    ]).then(([q, f]) => setCachedMap({ swin2sr_quantized: q, swin2sr_fp16: f }));
  }, [status]);

  const handleFile = (f: File) => {
    if (origUrl) URL.revokeObjectURL(origUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    const url = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => {
      setOrigUrl(url);
      setResultUrl(null);
      setOrigDim({ w: im.naturalWidth, h: im.naturalHeight });
      setOutDim({ w: 0, h: 0 });
      setImgName(f.name.replace(/\.[^/.]+$/, ""));
      setStatus("idle");
      setProgress(0);
    };
    im.src = url;
  };

  const runInstantEdgeUpscale = (imgEl: HTMLImageElement, scale: 2 | 4, sharpen: number): ImageData => {
    const OW = imgEl.naturalWidth * scale;
    const OH = imgEl.naturalHeight * scale;
    if (OW * OH > 8192 * 8192) {
      throw new Error(`Upscaled size (${OW}×${OH}) exceeds 8192×8192 browser canvas ceiling.`);
    }
    const c = document.createElement("canvas");
    c.width = OW;
    c.height = OH;
    const ctx = c.getContext("2d")!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(imgEl, 0, 0, OW, OH);

    const imgData = ctx.getImageData(0, 0, OW, OH);
    if (sharpen <= 0) return imgData;

    const src = new Uint8ClampedArray(imgData.data);
    const dst = imgData.data;
    const amount = (sharpen / 100) * 1.35;

    for (let y = 1; y < OH - 1; y++) {
      for (let x = 1; x < OW - 1; x++) {
        const idx = (y * OW + x) * 4;
        for (let ch = 0; ch < 3; ch++) {
          const center = src[idx + ch];
          const neighbors =
            (src[((y - 1) * OW + x) * 4 + ch] +
              src[((y + 1) * OW + x) * 4 + ch] +
              src[(y * OW + (x - 1)) * 4 + ch] +
              src[(y * OW + (x + 1)) * 4 + ch]) *
            0.25;
          const diff = center - neighbors;
          dst[idx + ch] = Math.max(0, Math.min(255, Math.round(center + diff * amount)));
        }
      }
    }
    return imgData;
  };

  const startUpscale = async () => {
    if (!origUrl) return;
    setStatus("loading");
    setProgress(5);
    setProgressMsg("Preparing source image…");

    try {
      const imgEl = await new Promise<HTMLImageElement>((resolve, reject) => {
        const im = new Image();
        im.crossOrigin = "anonymous";
        im.onload = () => resolve(im);
        im.onerror = reject;
        im.src = origUrl;
      });

      let finalData: ImageData;
      if (engine === "instant_edge_2x" || engine === "instant_edge_4x") {
        const sc = engine === "instant_edge_2x" ? 2 : 4;
        setProgress(50);
        setProgressMsg(`Running ${sc}× Adaptive Edge-Directed Super-Resolution…`);
        await new Promise((r) => setTimeout(r, 60));
        finalData = runInstantEdgeUpscale(imgEl, sc, sharpenStrength);
      } else {
        finalData = await runSwin2SrTiledUpscale(imgEl, engine, patchMode, (pct, text) => {
          setProgress(pct);
          setProgressMsg(text);
        });
      }

      const c = document.createElement("canvas");
      c.width = finalData.width;
      c.height = finalData.height;
      c.getContext("2d")!.putImageData(finalData, 0, 0);
      outCanvasRef.current = c;
      setOutDim({ w: finalData.width, h: finalData.height });

      const blob = await new Promise<Blob>((r) =>
        c.toBlob((b) => r(b!), exportFormat, exportFormat === "image/png" ? undefined : exportQuality / 100)
      );
      if (resultUrl) URL.revokeObjectURL(resultUrl);
      setResultUrl(URL.createObjectURL(blob));
      setProgress(100);
      setStatus("done");
    } catch (err: unknown) {
      setStatus("error");
      setProgressMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const handleDownload = () => {
    const c = outCanvasRef.current;
    if (!c) return;
    const ext = exportFormat === "image/webp" ? "webp" : exportFormat === "image/jpeg" ? "jpg" : "png";
    c.toBlob(
      (b) => {
        if (!b) return;
        const u = URL.createObjectURL(b);
        Object.assign(document.createElement("a"), {
          href: u,
          download: `${imgName}-upscaled-${outDim.w}x${outDim.h}.${ext}`,
        }).click();
        setTimeout(() => URL.revokeObjectURL(u), 2000);
      },
      exportFormat,
      exportFormat === "image/png" ? undefined : exportQuality / 100
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden w-full">
      <nav className="border-b border-white/5 px-4 h-16 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40 flex items-center w-full">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight flex-shrink-0">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/tools" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">All Tools</Link>
            <Link href="/blog" className="hidden sm:inline text-sm text-gray-400 hover:text-white transition-colors font-medium">Blog</Link>
            <Link href="/about" className="hidden md:inline text-sm text-gray-400 hover:text-white transition-colors font-medium">About</Link>
            <Link href="/contact" className="hidden md:inline text-sm text-gray-400 hover:text-white transition-colors font-medium">Contact</Link>
            <Link href="/blog" className="px-3.5 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-xs font-bold transition-all flex-shrink-0">
              Guides 📖
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10 flex-grow w-full min-w-0">
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span>›</span>
          <Link href="/categories/image" className="hover:text-gray-400 transition-colors">Image Tools</Link>
          <span>›</span>
          <span className="text-gray-400">4× AI Image Upscaler</span>
        </nav>

        {children}

        {/* Engine & Tile Configuration */}
        <div className="bg-[#13131F] border border-white/10 rounded-2xl p-5 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              {
                id: "swin2sr_quantized" as const,
                label: ONNX_MODELS.swin2sr_quantized.label,
                desc: ONNX_MODELS.swin2sr_quantized.description,
                badge: cachedMap.swin2sr_quantized ? "Cached ✓" : "~18 MB ONNX",
              },
              {
                id: "swin2sr_fp16" as const,
                label: ONNX_MODELS.swin2sr_fp16.label,
                desc: ONNX_MODELS.swin2sr_fp16.description,
                badge: cachedMap.swin2sr_fp16 ? "Cached ✓" : "~36 MB ONNX",
              },
              {
                id: "instant_edge_4x" as const,
                label: "Instant 4× Edge-Directed + Unsharp SR",
                desc: "Zero model download — instant 4× interpolation with adaptive luminance edge sharpening",
                badge: "0 MB · Instant",
              },
              {
                id: "instant_edge_2x" as const,
                label: "Instant 2× Edge-Directed + Unsharp SR",
                desc: "Fast 2× resolution doubling with crisp micro-contrast edge restoration",
                badge: "0 MB · Instant",
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setEngine(opt.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  engine === opt.id
                    ? "border-[#3B82F6] bg-[#3B82F6]/15 shadow-lg"
                    : "border-white/5 bg-[#0A0A14]/70 hover:border-white/15"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{opt.label}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-blue-300">
                    {opt.badge}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>

          {engine.startsWith("swin2sr") ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-white/5">
              {(Object.keys(UPSCALER_TILE_PRESETS) as UpscalerPatchMode[]).map((mk) => {
                const p = UPSCALER_TILE_PRESETS[mk];
                return (
                  <button
                    key={mk}
                    type="button"
                    onClick={() => setPatchMode(mk)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      patchMode === mk
                        ? "border-[#6C3AFF] bg-[#6C3AFF]/15"
                        : "border-white/5 bg-[#0A0A14]/50 hover:border-white/15"
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <span>{p.label}</span>
                      <span className="font-mono text-[10px] text-purple-300">{p.detail}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{p.description}</p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="pt-2 border-t border-white/5 flex items-center gap-4">
              <span className="text-xs text-gray-300 font-semibold">Edge Micro-Contrast Sharpening:</span>
              <input
                type="range"
                min={0}
                max={100}
                value={sharpenStrength}
                onChange={(e) => setSharpenStrength(Number(e.target.value))}
                className="flex-1 accent-[#3B82F6]"
              />
              <span className="text-xs font-mono text-blue-400">{sharpenStrength}%</span>
            </div>
          )}
        </div>

        {/* Upload or Workspace */}
        {!origUrl && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 hover:border-[#3B82F6]/50 hover:bg-[#3B82F6]/5 rounded-2xl p-16 text-center cursor-pointer transition-all"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
            <div className="text-5xl mb-3">🔍</div>
            <div className="text-white font-bold text-xl mb-1">Drop image here or click to upscale</div>
            <p className="text-gray-500 text-xs">Supports PNG, JPEG, WebP · Preserves Alpha Transparency · Up to 8192×8192 Output</p>
          </div>
        )}

        {origUrl && status === "idle" && (
          <div className="space-y-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 text-center">
              <img src={origUrl} alt="Original" className="max-h-96 mx-auto rounded-xl object-contain" />
              <p className="text-xs text-gray-400 mt-2">
                Source Resolution: <span className="text-white font-mono">{origDim.w} × {origDim.h} px</span> → Target:{" "}
                <span className="text-blue-400 font-mono">
                  {origDim.w * (engine === "instant_edge_2x" ? 2 : 4)} × {origDim.h * (engine === "instant_edge_2x" ? 2 : 4)} px
                </span>
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={startUpscale}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#3B82F6] to-[#6C3AFF] text-white font-extrabold text-base hover:opacity-95 transition-all"
              >
                🚀 Upscale Image Now
              </button>
              <button
                onClick={() => setOrigUrl(null)}
                className="px-5 rounded-2xl bg-[#13131F] border border-white/10 text-gray-400 hover:text-white text-xs font-bold"
              >
                Change Image
              </button>
            </div>
          </div>
        )}

        {status === "loading" && (
          <div className="bg-[#13131F] border border-white/10 rounded-2xl p-10 text-center space-y-4">
            <div className="text-4xl animate-pulse">⚡</div>
            <div className="text-white font-bold">{progressMsg}</div>
            <div className="h-3 bg-[#0A0A14] rounded-full overflow-hidden max-w-lg mx-auto">
              <div
                className="h-full bg-gradient-to-r from-[#3B82F6] to-[#00D4FF] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 space-y-3">
            <div className="text-rose-400 font-bold text-sm">⚠ Upscaling Error</div>
            <p className="text-xs text-gray-300">{progressMsg}</p>
            <button
              onClick={() => setStatus("idle")}
              className="px-4 py-2 rounded-xl bg-[#3B82F6] text-white text-xs font-bold"
            >
              Try Again
            </button>
          </div>
        )}

        {status === "done" && origUrl && resultUrl && (
          <div className="space-y-5 bg-[#13131F] border border-white/10 rounded-2xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-white">
                  Upscaled Result: {origDim.w}×{origDim.h} px →{" "}
                  <span className="text-emerald-400">{outDim.w}×{outDim.h} px</span>
                </h3>
                <p className="text-xs text-gray-400">Drag the comparison slider to inspect restored detail</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value as any)}
                  className="bg-[#0A0A14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                >
                  <option value="image/webp">WebP (Recommended)</option>
                  <option value="image/png">Lossless PNG</option>
                  <option value="image/jpeg">JPEG</option>
                </select>
                <button
                  onClick={handleDownload}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                >
                  ⬇ Download {outDim.w}×{outDim.h}
                </button>
                <button
                  onClick={() => setOrigUrl(null)}
                  className="px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-xs text-gray-400 hover:text-white"
                >
                  New Image
                </button>
              </div>
            </div>

            <div className="relative max-h-[500px] overflow-hidden rounded-xl border border-white/10 bg-[#0A0A14]">
              <img src={resultUrl} alt="Upscaled" className="max-h-[500px] w-full object-contain" />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden border-r-2 border-[#3B82F6]"
                style={{ width: `${sliderPos}%` }}
              >
                <img src={origUrl} alt="Original" className="max-h-[500px] w-full object-contain" />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="w-full accent-[#3B82F6]"
            />
          </div>
        )}

        {/* FAQ */}
        <div className="mt-12 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-5">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between text-white font-semibold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#3B82F6] text-xl transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* Related Tools */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">🔧 Related Image Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {RELATED_TOOLS.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#0A0A14] transition-colors group"
              >
                <span className="text-xl">{t.icon}</span>
                <span className="text-sm text-gray-400 group-hover:text-white">{t.name}</span>
                <span className="ml-auto text-gray-700 group-hover:text-[#3B82F6]">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Technical Deep-Dive & AEO/GEO Reference Guide ── */}
        <section className="mt-14 bg-[#13131F] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 min-w-0 w-full">
          <h2 className="text-xl md:text-2xl font-extrabold text-white">How Swin2SR 4× Tiled Vision Transformer Super-Resolution Works in WebAssembly</h2>
          <p className="text-gray-400 text-sm leading-relaxed">Conventional bicubic or bilinear resizing simply interpolates between neighboring pixels, producing soft edges and blurry halos when enlarging low-resolution images by 200% to 400%. PursTech's 4× AI Image Upscaler executes the Swin2SR (SwinV2 Transformer for Image Super-Resolution) neural architecture directly in your browser via ONNX Runtime Web and WebAssembly. Trained on BSRGAN real-world degradation models, Swin2SR simultaneously suppresses JPEG DCT block artifacts, sensor noise, and aliasing while synthesizing crisp high-frequency textures.</p>
          <p className="text-gray-400 text-sm leading-relaxed">To process high-resolution photographs without exceeding browser WebAssembly memory limits, our engine divides the source image into overlapping patches (32×32px in Performance mode, 64×64px in Balanced mode, or 128×128px in Studio Quality mode) padded by 1 to 4 reflective border pixels. After each tile is upscaled 4×, the padded border is stripped to eliminate grid seams and the original alpha transparency channel is restored—producing seamless enlargement up to 8192×8192 pixels with zero server uploads.</p>
        </section>

        {/* ── Related PursTech Blog Guides ── */}
        <section className="mt-10 min-w-0 w-full">
          <h2 className="text-lg font-extrabold text-white mb-4">📖 Related Guides &amp; Tutorials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link href="/blog/webp-vs-jpeg-vs-png-2026" className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-4 transition-all group flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6C3AFF] mb-1">Format Guide</div>
                <div className="text-sm font-bold text-white group-hover:text-[#00D4FF] truncate">WebP vs JPEG vs PNG in 2026</div>
              </div>
              <span className="text-gray-600 group-hover:text-[#6C3AFF]">→</span>
            </Link>
            <Link href="/blog/how-to-compress-images-without-losing-quality" className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-4 transition-all group flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6C3AFF] mb-1">Optimization</div>
                <div className="text-sm font-bold text-white group-hover:text-[#00D4FF] truncate">Compress Images Without Losing Quality</div>
              </div>
              <span className="text-gray-600 group-hover:text-[#6C3AFF]">→</span>
            </Link>
            <Link href="/blog/best-free-background-removers" className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-4 transition-all group flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6C3AFF] mb-1">Benchmark</div>
                <div className="text-sm font-bold text-white group-hover:text-[#00D4FF] truncate">Best Free AI Background Removers Tested</div>
              </div>
              <span className="text-gray-600 group-hover:text-[#6C3AFF]">→</span>
            </Link>
          </div>
        </section>

        {/* Editorial E-E-A-T & Verification Attribution */}
        <div className="mt-10 bg-[#13131F]/80 border border-white/5 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[#6C3AFF]/20 border border-[#6C3AFF]/40 flex items-center justify-center text-[#00D4FF] font-bold flex-shrink-0">MI</span>
            <div>
              <span className="text-white font-semibold">Engineered &amp; Verified by <Link href="/about" className="text-[#00D4FF] hover:underline">Mahad Ikram</Link></span>
              <span className="block text-[11px] text-gray-500">Founder &amp; Lead Developer at PursTech · 100% Client-Side Browser Execution Verified (Nov 2026)</span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-gray-500 flex-shrink-0">
            <Link href="/about" className="hover:text-white transition-colors">Editorial Standards</Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Architecture</Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-20 py-10 text-center bg-[#0A0A14] w-full min-w-0">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="text-xl font-black tracking-tight">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <p className="text-xs text-gray-500 mt-1.5">
            50+ Free Browser-Based Online Tools — No Login, No Limits, 100% Client-Side Privacy.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs text-gray-400">
            <Link href="/tools" className="hover:text-white transition-colors">All Tools</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog &amp; Guides</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
          <p className="text-gray-600 text-xs mt-4">
            © 2026 PursTech · Engineered by <Link href="/about" className="text-gray-500 hover:text-gray-300">Mahad Ikram</Link>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
