"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool";
import {
  ONNX_MODELS,
  isModelCached,
  runDeOldifyColorizer,
} from "@/lib/onnx-engine";

const RELATED_TOOLS = [
  { icon: "🔍", name: "AI Image Upscaler (4×)", slug: "image-upscaler" },
  { icon: "✂️", name: "AI Background Remover", slug: "background-remover" },
  { icon: "🛡️", name: "SynthID & C2PA Remover", slug: "synthid-remover" },
  { icon: "🗜", name: "Image Compressor", slug: "image-compressor" },
  { icon: "📐", name: "Image Resizer", slug: "image-resizer" },
  { icon: "🎨", name: "Color Picker", slug: "color-picker" },
];

const FAQ = [
  {
    q: "How does Luminance-Preserving Chroma Fusion prevent blurry results?",
    a: "Standard deep-learning colorizers output a fixed 256×256 image, which destroys fine detail on high-resolution scans. Our pipeline extracts only the predicted chrominance (hue and saturation) from the DeOldify neural network, upscales and smooths the color map with a 1.25px Gaussian filter, and fuses it onto your original full-resolution photograph via Canvas 'color' compositing so every eyelash, fabric weave, and film grain stays 100% sharp.",
  },
  {
    q: "Which engine should I choose: DeOldify Quantized (~61 MB), FP16 (~243 MB), or Instant Tonal Colorizer?",
    a: "DeOldify Artistic Quantized (~61 MB) is ideal for 95% of vintage portraits and landscapes and caches in IndexedDB for instant offline reuse. DeOldify Full Precision (~243 MB) offers maximum tonal subtlety for archival restoration. Instant Multi-Zone Tonal Colorizer requires 0 MB download and uses luminance-zone elevation mapping (sky/foliage/warm skin-tone curves) for instant previews.",
  },
];

export default function ImageColorizerClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("image-colorizer", "image");

  const [engine, setEngine] = useState<"deoldify_artistic_quantized" | "deoldify_artistic_fp16" | "instant_tonal">("deoldify_artistic_quantized");
  const [saturationBoost, setSaturationBoost] = useState<number>(115);
  const [cachedMap, setCachedMap] = useState<{ deoldify_artistic_quantized?: boolean; deoldify_artistic_fp16?: boolean }>({});
  const [origUrl, setOrigUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [imgName, setImgName] = useState<string>("vintage-photo");
  const [dim, setDim] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
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
      isModelCached("deoldify_artistic_quantized"),
      isModelCached("deoldify_artistic_fp16"),
    ]).then(([q, f]) => setCachedMap({ deoldify_artistic_quantized: q, deoldify_artistic_fp16: f }));
  }, [status]);

  const handleFile = (f: File) => {
    if (origUrl) URL.revokeObjectURL(origUrl);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    const url = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => {
      setOrigUrl(url);
      setResultUrl(null);
      setDim({ w: im.naturalWidth, h: im.naturalHeight });
      setImgName(f.name.replace(/\.[^/.]+$/, ""));
      setStatus("idle");
      setProgress(0);
    };
    im.src = url;
  };

  const runInstantTonalColorizer = (imgEl: HTMLImageElement, satPct: number): ImageData => {
    const W = imgEl.naturalWidth;
    const H = imgEl.naturalHeight;
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const ctx = c.getContext("2d")!;
    ctx.drawImage(imgEl, 0, 0);
    const imgData = ctx.getImageData(0, 0, W, H);
    const d = imgData.data;
    const sat = satPct / 100;

    for (let y = 0; y < H; y++) {
      const yNorm = y / Math.max(1, H - 1);
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const lum = 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
        const lNorm = lum / 255;
        // Multi-zone natural color synthesis (sky blue-cyan in upper high-luma, warm skin/earth in midtones, foliage green in lower-mid)
        const skyWeight = Math.max(0, 1 - yNorm * 1.8) * Math.pow(lNorm, 0.8);
        const midWarmth = Math.sin(lNorm * Math.PI) * (0.4 + 0.6 * Math.sin(yNorm * Math.PI));
        const foliageWeight = Math.max(0, yNorm - 0.35) * (1 - Math.abs(lNorm - 0.45) * 1.6);

        const rShift = (midWarmth * 34 - skyWeight * 18 + foliageWeight * 4) * sat;
        const gShift = (midWarmth * 12 + skyWeight * 6 + foliageWeight * 22) * sat;
        const bShift = (-midWarmth * 24 + skyWeight * 32 - foliageWeight * 16) * sat;

        d[i] = Math.max(0, Math.min(255, Math.round(lum + rShift)));
        d[i + 1] = Math.max(0, Math.min(255, Math.round(lum + gShift)));
        d[i + 2] = Math.max(0, Math.min(255, Math.round(lum + bShift)));
      }
    }
    return imgData;
  };

  const startColorize = async () => {
    if (!origUrl) return;
    setStatus("loading");
    setProgress(5);
    setProgressMsg("Loading image luminance buffer…");

    try {
      const imgEl = await new Promise<HTMLImageElement>((resolve, reject) => {
        const im = new Image();
        im.crossOrigin = "anonymous";
        im.onload = () => resolve(im);
        im.onerror = reject;
        im.src = origUrl;
      });

      let finalData: ImageData;
      if (engine === "instant_tonal") {
        setProgress(60);
        setProgressMsg("Synthesizing multi-zone natural chrominance…");
        await new Promise((r) => setTimeout(r, 60));
        finalData = runInstantTonalColorizer(imgEl, saturationBoost);
      } else {
        finalData = await runDeOldifyColorizer(imgEl, engine, saturationBoost, (pct, text) => {
          setProgress(pct);
          setProgressMsg(text);
        });
      }

      const c = document.createElement("canvas");
      c.width = finalData.width;
      c.height = finalData.height;
      c.getContext("2d")!.putImageData(finalData, 0, 0);
      outCanvasRef.current = c;

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
          download: `${imgName}-colorized.${ext}`,
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
          <span className="text-gray-400">AI Photo Colorizer</span>
        </nav>

        {children}

        {/* Engine Selection */}
        <div className="bg-[#13131F] border border-white/10 rounded-2xl p-5 mb-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                id: "deoldify_artistic_quantized" as const,
                label: ONNX_MODELS.deoldify_artistic_quantized.label,
                desc: ONNX_MODELS.deoldify_artistic_quantized.description,
                badge: cachedMap.deoldify_artistic_quantized ? "Cached ✓" : "~61 MB ONNX",
              },
              {
                id: "deoldify_artistic_fp16" as const,
                label: ONNX_MODELS.deoldify_artistic_fp16.label,
                desc: ONNX_MODELS.deoldify_artistic_fp16.description,
                badge: cachedMap.deoldify_artistic_fp16 ? "Cached ✓" : "~243 MB ONNX",
              },
              {
                id: "instant_tonal" as const,
                label: "Instant Multi-Zone Tonal Colorizer",
                desc: "Zero model download — instant luminance-zone color restoration with full sharpness",
                badge: "0 MB · Instant",
              },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setEngine(opt.id)}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  engine === opt.id
                    ? "border-amber-500 bg-amber-500/15 shadow-lg"
                    : "border-white/5 bg-[#0A0A14]/70 hover:border-white/15"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-white truncate">{opt.label}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-amber-300">
                    {opt.badge}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">{opt.desc}</p>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/5 flex items-center gap-4">
            <span className="text-xs text-gray-300 font-semibold">Chroma Saturation Intensity:</span>
            <input
              type="range"
              min={60}
              max={160}
              value={saturationBoost}
              onChange={(e) => setSaturationBoost(Number(e.target.value))}
              className="flex-1 accent-amber-500"
            />
            <span className="text-xs font-mono text-amber-400">{saturationBoost}%</span>
          </div>
        </div>

        {!origUrl && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const f = e.dataTransfer.files[0];
              if (f) handleFile(f);
            }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 hover:border-amber-500/50 hover:bg-amber-500/5 rounded-2xl p-16 text-center cursor-pointer transition-all"
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
            <div className="text-5xl mb-3">🎨</div>
            <div className="text-white font-bold text-xl mb-1">Drop black &amp; white photo here or click to upload</div>
            <p className="text-gray-500 text-xs">Preserves 100% of original resolution &amp; film sharpness via Chroma Fusion</p>
          </div>
        )}

        {origUrl && status === "idle" && (
          <div className="space-y-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 text-center">
              <img src={origUrl} alt="Original B&W" className="max-h-96 mx-auto rounded-xl object-contain" />
              <p className="text-xs text-gray-400 mt-2">
                Resolution: <span className="text-white font-mono">{dim.w} × {dim.h} px</span> (Full-resolution luminance preserved)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={startColorize}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-[#FF3A6C] text-slate-950 font-extrabold text-base hover:opacity-95 transition-all"
              >
                🎨 Colorize Photo Now
              </button>
              <button
                onClick={() => setOrigUrl(null)}
                className="px-5 rounded-2xl bg-[#13131F] border border-white/10 text-gray-400 hover:text-white text-xs font-bold"
              >
                Change Photo
              </button>
            </div>
          </div>
        )}

        {status === "loading" && (
          <div className="bg-[#13131F] border border-white/10 rounded-2xl p-10 text-center space-y-4">
            <div className="text-4xl animate-pulse">🖌️</div>
            <div className="text-white font-bold">{progressMsg}</div>
            <div className="h-3 bg-[#0A0A14] rounded-full overflow-hidden max-w-lg mx-auto">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-[#FF3A6C] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-6 space-y-3">
            <div className="text-rose-400 font-bold text-sm">⚠ Colorization Error</div>
            <p className="text-xs text-gray-300">{progressMsg}</p>
            <button
              onClick={() => setStatus("idle")}
              className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold"
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
                  Colorized Result ({dim.w}×{dim.h} px — Full Luminance Preserved)
                </h3>
                <p className="text-xs text-gray-400">Drag the comparison slider to compare B&amp;W vs. Colorized</p>
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
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                >
                  ⬇ Download Colorized Photo
                </button>
                <button
                  onClick={() => setOrigUrl(null)}
                  className="px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-xs text-gray-400 hover:text-white"
                >
                  New Photo
                </button>
              </div>
            </div>

            <div className="relative max-h-[500px] overflow-hidden rounded-xl border border-white/10 bg-[#0A0A14]">
              <img src={resultUrl} alt="Colorized" className="max-h-[500px] w-full object-contain" />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 overflow-hidden border-r-2 border-amber-400"
                style={{ width: `${sliderPos}%` }}
              >
                <img src={origUrl} alt="Original B&W" className="max-h-[500px] w-full object-contain" />
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="w-full accent-amber-400"
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
                  <span className="text-amber-400 text-xl transition-transform group-open:rotate-45">+</span>
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
                <span className="ml-auto text-gray-700 group-hover:text-amber-400">→</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Technical Deep-Dive & AEO/GEO Reference Guide ── */}
        <section className="mt-14 bg-[#13131F] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 min-w-0 w-full">
          <h2 className="text-xl md:text-2xl font-extrabold text-white">How DeOldify Neural Colorization & Luminance-Preserving Chroma Fusion Work</h2>
          <p className="text-gray-400 text-sm leading-relaxed">Historical black-and-white, sepia, and monochrome photographs store rich structural detail in their luminance (brightness) channel while lacking chrominance (color) information. When naive AI colorizers pass an image through a fixed 256×256 neural network and output the raw network tensor directly, high-resolution family portraits and archival scans lose their sharpness and film grain.</p>
          <p className="text-gray-400 text-sm leading-relaxed">PursTech's AI Photo Colorizer solves this using a two-stage Luminance-Preserving Chroma Fusion pipeline. First, DeOldify Artistic ONNX analyzes an aspect-preserved 256×256 grayscale representation (0.299R + 0.587G + 0.114B) to predict natural skin tones, foliage greens, sky blues, and textile hues. Second, our post-processor un-letterboxes the predicted color map, applies a 1.25px Gaussian chroma filter to eliminate upscaling blockiness, and fuses only the chrominance layer onto your full-resolution original photograph using HTML5 Canvas 'color' blend compositing—retaining 100% of original resolution and edge acuity.</p>
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
