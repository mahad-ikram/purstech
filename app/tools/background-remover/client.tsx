"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3
import { ONNX_MODELS, OnnxModelKey, isModelCached, runSegmentationModel } from "@/lib/onnx-engine";

// ── Module-scope constants ───────────────
const RELATED_TOOLS = [
  { icon:"🔍", name:"AI Image Upscaler (4×)", slug:"image-upscaler"  },
  { icon:"🎨", name:"AI Photo Colorizer",     slug:"image-colorizer" },
  { icon:"🛡️", name:"SynthID & C2PA Remover", slug:"synthid-remover" },
  { icon:"🗜",  name:"Image Compressor",       slug:"image-compressor"},
  { icon:"📐", name:"Image Resizer",          slug:"image-resizer"   },
  { icon:"📷", name:"Image to Text (OCR)",    slug:"image-to-text"   },
];

const REMOVER_MODEL_KEYS: OnnxModelKey[] = [
  "ormbg_quantized",
  "ormbg_fp16",
  "isnet_quantized",
  "isnet_fp16",
  "birefnet_lite_fp16",
  "birefnet_lite",
  "rmbg_1_4_quantized",
  "rmbg_1_4_fp16",
  "modnet_quantized",
];

const FAQ = [
  { q:"How do I make an image with a transparent background?",
    a:"That is exactly what this tool does. The AI removes the background and exports a PNG with true transparency, ready to drop onto any design, product listing or slide — no checkerboard baked in." },
  { q:"How does the automatic background removal work?",
    a:"PursTech uses a neural network model (ONNX Runtime) that runs entirely inside your browser using WebAssembly. The model analyses every pixel of your image to classify it as foreground or background and produces a clean transparent result. Your image is never sent to any server. On first use the model downloads (~5MB) and is cached locally for instant future use." },
  { q:"Is my image uploaded anywhere?",
    a:"No. The AI model downloads to your device once and runs locally in your browser using WebAssembly. Your image is processed entirely in memory — nothing is ever transmitted over the internet. Safe for confidential product photos, personal photos and private documents." },
  { q:"Why does the first removal take longer?",
    a:"On the very first use the browser downloads the AI model files (~5MB) and compiles them via WebAssembly. This takes 5–20 seconds depending on your connection. After that the model is cached and every subsequent removal completes in 2–5 seconds." },
  { q:"What types of images work best?",
    a:"The AI works on any type of image — people, animals, products, logos, cars and complex scenes. It produces particularly clean results on people, product photography and animals. For best results use a high-resolution image (at least 512×512px) with reasonable lighting." },
  { q:"Can I refine the result after automatic removal?",
    a:"Yes — after AI removal, use the Soft Eraser to remove remaining background patches and the Restore brush to bring back accidentally removed subject pixels. Both use a soft-edge brush for natural blending. Undo any number of steps and toggle between original and result at any time." },
];

const BG_SWATCHES = ["#FFFFFF","#000000","#F5F5F5","#1A1A2E","#FF6B6B","#4ECDC4","#6C3AFF","#FFD93D","#2ECC71","#E74C3C"];

type ToolMode = "erase" | "restore";

// ── Comparison Slider ─────────────────────────────────────────────────────────
function ComparisonSlider({ before, after, width, height }: {
  before: string; after: string; width: number; height: number;
}) {
  const [pos,  setPos]  = useState(50);
  const [drag, setDrag] = useState(false);
  const containerRef    = useRef<HTMLDivElement>(null);

  const updatePos = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    const mm = (e: MouseEvent) => { if (drag) updatePos(e.clientX); };
    const mu = ()              => setDrag(false);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup",   mu);
    return () => { window.removeEventListener("mousemove", mm); window.removeEventListener("mouseup", mu); };
  }, [drag, updatePos]);

  return (
    <div ref={containerRef}
      className="relative select-none overflow-hidden rounded-xl w-full min-w-0"
      style={{ aspectRatio:`${width} / ${height}` }}
      onMouseDown={e => { setDrag(true); updatePos(e.clientX); }}
      onTouchStart={e => updatePos(e.touches[0].clientX)}
      onTouchMove={e  => updatePos(e.touches[0].clientX)}>

      <div className="absolute inset-0"
        style={{ backgroundImage:"repeating-conic-gradient(#AAAAAA 0% 25%,#EEEEEE 0% 50%) 0 0/20px 20px" }}>
        <img src={after} alt="Result" className="w-full h-full object-contain" draggable={false} />
      </div>
      <div className="absolute inset-0 overflow-hidden" style={{ width:`${pos}%` }}>
        <img src={before} alt="Original" draggable={false}
          className="absolute top-0 left-0 h-full object-contain"
          style={{ width:`${(100 / Math.max(pos, 0.1)) * 100}%`, maxWidth:"none" }} />
      </div>
      <div className="absolute top-0 bottom-0" style={{ left:`${pos}%`, transform:"translateX(-50%)" }}>
        <div className="absolute inset-y-0 w-0.5 bg-white shadow-lg left-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center cursor-ew-resize border-2 border-[#6C3AFF] z-10">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5H13M5 1L1 5L5 9M9 1L13 5L9 9" stroke="#6C3AFF" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      <div className="absolute top-2 left-2  bg-black/60     text-white text-xs px-2 py-1 rounded-lg font-semibold pointer-events-none">Original</div>
      <div className="absolute top-2 right-2 bg-[#6C3AFF]/80 text-white text-xs px-2 py-1 rounded-lg font-semibold pointer-events-none">Removed</div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BackgroundRemoverClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("background-remover", "image");

  const [file,        setFile]        = useState<File | null>(null);
  const [origUrl,     setOrigUrl]     = useState<string | null>(null);
  const [resultUrl,   setResultUrl]   = useState<string | null>(null);
  const [imgName,     setImgName]     = useState("image");
  const [imgW,        setImgW]        = useState(0);
  const [imgH,        setImgH]        = useState(0);
  const [status,      setStatus]      = useState<"idle"|"loading"|"done"|"error">("idle");
  const [progress,    setProgress]    = useState(0);
  const [progressMsg, setProgressMsg] = useState("");
  const [view,        setView]        = useState<"compare"|"result"|"original">("compare");
  const [bgFill,      setBgFill]      = useState(false);
  const [bgColor,     setBgColor]     = useState("#FFFFFF");
  const [mode,        setMode]        = useState<ToolMode>("erase");
  const [brushSize,   setBrushSize]   = useState(20);
  const [showTools,   setShowTools]   = useState(false);
  const [undoStack,   setUndoStack]   = useState<ImageData[]>([]);
  const [isDrawing,   setIsDrawing]   = useState(false);
  const [dragging,    setDragging]    = useState(false);
  const [selectedModel, setSelectedModel] = useState<OnnxModelKey | "imgly_auto">("ormbg_quantized");
  const [cachedModels, setCachedModels] = useState<Partial<Record<OnnxModelKey, boolean>>>({});
  const [exportFormat, setExportFormat] = useState<"image/png" | "image/webp" | "image/jpeg">("image/png");
  const [exportQuality, setExportQuality] = useState<number>(92);

  useEffect(() => {
    Promise.all(
      REMOVER_MODEL_KEYS.map(async (k) => [k, await isModelCached(k)] as const)
    ).then((entries) => {
      const m: Partial<Record<OnnxModelKey, boolean>> = {};
      entries.forEach(([k, v]) => { m[k] = v; });
      setCachedModels(m);
    });
  }, [status]);

  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const origRef    = useRef<HTMLCanvasElement>(null);
  const displayRef = useRef<HTMLCanvasElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  // ── redrawDisplay — paints canvasRef onto displayRef with checkered/fill bg ──
  const redrawDisplay = useCallback(() => {
    const wc = canvasRef.current, dc = displayRef.current;
    if (!wc || !dc) return;
    dc.width = wc.width; dc.height = wc.height;
    const ctx = dc.getContext("2d")!;
    const SZ = 12;
    for (let y = 0; y < dc.height; y += SZ)
      for (let x = 0; x < dc.width; x += SZ) {
        ctx.fillStyle = (Math.floor(x/SZ)+Math.floor(y/SZ))%2===0 ? "#BBBBBB" : "#EEEEEE";
        ctx.fillRect(x, y, SZ, SZ);
      }
    if (bgFill) {
      const tmp = document.createElement("canvas");
      tmp.width = wc.width; tmp.height = wc.height;
      const tc = tmp.getContext("2d")!;
      tc.fillStyle = bgColor; tc.fillRect(0,0,tmp.width,tmp.height); tc.drawImage(wc,0,0);
      ctx.drawImage(tmp, 0, 0);
    } else {
      ctx.drawImage(wc, 0, 0);
    }
  }, [bgFill, bgColor]);

  useEffect(() => {
    if (status === "done") redrawDisplay();
  }, [bgFill, bgColor, status, redrawDisplay]);

  useEffect(() => {
    if (status === "done" && showTools) requestAnimationFrame(redrawDisplay);
  }, [showTools, status, redrawDisplay]);

  function revokeIfBlob(url: string | null) {
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
  }

  function loadFile(f: File) {
    revokeIfBlob(origUrl);
    revokeIfBlob(resultUrl);
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setFile(f); setOrigUrl(url);
      setImgW(img.naturalWidth); setImgH(img.naturalHeight);
      setImgName(f.name.replace(/\.[^/.]+$/, ""));
      setResultUrl(null); setStatus("idle"); setProgress(0);
      setUndoStack([]); setShowTools(false); setView("compare");
      requestAnimationFrame(() => {
        const oc = origRef.current;
        if (!oc) return;
        oc.width = img.naturalWidth; oc.height = img.naturalHeight;
        oc.getContext("2d")!.drawImage(img, 0, 0);
      });
    };
    img.onerror = () => URL.revokeObjectURL(url);
    img.src = url;
  }

  // ── removeBackground (Multi-Model ONNX WebAssembly + IndexedDB Cache + @imgly Fallback) ──
  async function removeBackground() {
    if (!file || !origUrl) return;

    if (typeof WebAssembly === "undefined") {
      setStatus("error");
      setProgressMsg("Your browser does not support WebAssembly, which is required for AI processing.");
      return;
    }

    setStatus("loading");
    setProgress(5);
    setProgressMsg("Initialising local ONNX WebAssembly engine…");

    try {
      if (selectedModel !== "imgly_auto") {
        const imgEl = await new Promise<HTMLImageElement>((resolve, reject) => {
          const im = new Image();
          im.crossOrigin = "anonymous";
          im.onload = () => resolve(im);
          im.onerror = reject;
          im.src = origUrl;
        });

        const segmentedData = await runSegmentationModel(imgEl, selectedModel, (pct, msg) => {
          setProgress(pct);
          setProgressMsg(msg);
        });

        const wc = canvasRef.current;
        if (!wc) throw new Error("Canvas not mounted");
        wc.width = segmentedData.width;
        wc.height = segmentedData.height;
        wc.getContext("2d")!.putImageData(segmentedData, 0, 0);

        const blob = await new Promise<Blob>((resolve) =>
          wc.toBlob((b) => resolve(b!), "image/png")
        );
        revokeIfBlob(resultUrl);
        setResultUrl(URL.createObjectURL(blob));
        setProgress(100);
        setStatus("done");
        setView("compare");
        setProgressMsg("");
        return;
      }

      // Fallback / Alternative: @imgly/background-removal
      let removeBgFn: Function;
      const mod = await import("@imgly/background-removal");
      removeBgFn = (mod as any).removeBackground ?? (mod as any).default;
      setProgress(20);
      setProgressMsg("Loading @imgly segmentation model…");

      const resultBlob: Blob = await removeBgFn(file, {
        proxyToWorker: false,
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            setProgress(Math.min(Math.round((current / total) * 60) + 20, 80));
            if (key.includes("ort")) setProgressMsg("Loading ONNX inference engine…");
            else if (key.includes("model")) setProgressMsg("Loading segmentation model…");
          }
        },
      });

      revokeIfBlob(resultUrl);
      const rUrl = URL.createObjectURL(resultBlob);
      await new Promise<void>((resolve, reject) => {
        const rImg = new Image();
        rImg.onload = () => {
          const wc = canvasRef.current;
          if (!wc) { reject(new Error("Canvas not mounted")); return; }
          wc.width = rImg.naturalWidth;
          wc.height = rImg.naturalHeight;
          wc.getContext("2d")!.drawImage(rImg, 0, 0);
          setResultUrl(rUrl);
          setProgress(100);
          setStatus("done");
          setView("compare");
          setProgressMsg("");
          resolve();
        };
        rImg.onerror = () => reject(new Error("Result decode failed"));
        rImg.src = rUrl;
      });
    } catch (err: unknown) {
      console.error("Background removal error:", err);
      const raw = err instanceof Error ? err.message : String(err);
      setStatus("error");
      setProgressMsg(`AI Model Error: ${raw}`);
    }
  }

  function buildExportUrl(): string {
    const wc = canvasRef.current;
    if (!wc) return "";
    const q = exportQuality / 100;
    if (bgFill || exportFormat === "image/jpeg") {
      const tmp = document.createElement("canvas");
      tmp.width = wc.width; tmp.height = wc.height;
      const tc = tmp.getContext("2d")!;
      tc.fillStyle = bgFill ? bgColor : "#FFFFFF";
      tc.fillRect(0,0,tmp.width,tmp.height);
      tc.drawImage(wc,0,0);
      return tmp.toDataURL(exportFormat, exportFormat === "image/png" ? undefined : q);
    }
    return wc.toDataURL(exportFormat, exportFormat === "image/png" ? undefined : q);
  }

  function download() {
    const href = buildExportUrl();
    if (!href) return;
    const ext = exportFormat === "image/webp" ? "webp" : exportFormat === "image/jpeg" ? "jpg" : "png";
    Object.assign(document.createElement("a"), { href, download:`${imgName}-no-bg.${ext}` }).click();
  }

  function pushUndo() {
    const wc = canvasRef.current;
    if (!wc) return;
    setUndoStack(prev => [...prev.slice(-19), wc.getContext("2d")!.getImageData(0,0,wc.width,wc.height)]);
  }

  function undo() {
    const wc = canvasRef.current;
    if (!undoStack.length || !wc) return;
    wc.getContext("2d")!.putImageData(undoStack[undoStack.length-1], 0, 0);
    setUndoStack(p => p.slice(0,-1));
    redrawDisplay();
    wc.toBlob(b => {
      if (!b) return;
      revokeIfBlob(resultUrl);
      setResultUrl(URL.createObjectURL(b));
    }, "image/png");
  }

  function commitBrushStroke() {
    const wc = canvasRef.current;
    if (!wc) return;
    wc.toBlob(b => {
      if (!b) return;
      revokeIfBlob(resultUrl);
      setResultUrl(URL.createObjectURL(b));
    }, "image/png");
  }

  function doPaint(x: number, y: number) {
    const wc = canvasRef.current;
    if (!wc) return;
    const ctx = wc.getContext("2d")!;
    const w = wc.width, h = wc.height;
    const imd      = ctx.getImageData(0, 0, w, h);
    const origCtx  = origRef.current?.getContext("2d");
    const origData = origCtx?.getImageData(0, 0, w, h);
    const r = brushSize / 2;
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const dist = Math.sqrt(dx*dx+dy*dy);
      if (dist > r) continue;
      const px = Math.round(x+dx), py = Math.round(y+dy);
      if (px<0||px>=w||py<0||py>=h) continue;
      const i    = (py*w+px)*4;
      const soft = Math.cos((dist/r)*(Math.PI/2));
      if (mode === "erase") {
        imd.data[i+3] = Math.round(imd.data[i+3]*(1-soft));
      } else if (origData) {
        imd.data[i]   = origData.data[i];
        imd.data[i+1] = origData.data[i+1];
        imd.data[i+2] = origData.data[i+2];
        imd.data[i+3] = Math.min(255, imd.data[i+3]+Math.round(origData.data[i+3]*soft));
      }
    }
    ctx.putImageData(imd, 0, 0);
    redrawDisplay();
  }

  function getPos(e: React.MouseEvent<HTMLCanvasElement>) {
    const dc = displayRef.current!;
    const rect = dc.getBoundingClientRect();
    return {
      x: Math.round((e.clientX-rect.left)*(dc.width/rect.width)),
      y: Math.round((e.clientY-rect.top) *(dc.height/rect.height)),
    };
  }

  function startOver() {
    revokeIfBlob(resultUrl);
    setFile(null); setOrigUrl(null); setResultUrl(null);
    setStatus("idle"); setProgress(0); setProgressMsg("");
    setUndoStack([]); setShowTools(false);
  }

  // ── JSX ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden w-full">
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={origRef}   className="hidden" />

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
          <span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span aria-hidden="true">›</span>
          <Link href="/categories/image" className="hover:text-gray-400 transition-colors">Image Tools</Link>
          <span aria-hidden="true">›</span>
          <span className="text-gray-400">Background Remover</span>
        </nav>

        {children}

        {/* ✅ THE MISSING HERO SECTION - HARDCODED SO IT NEVER DISAPPEARS */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Image Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free AI Background Remover — Remove the Background from Any Image
          </h1>
          <p className="text-gray-400 max-w-2xl">AI-powered background removal using a neural network that runs entirely in your browser. No upload, no account. Includes a comparison slider, manual refinement brushes and background fill.</p>
        </div>

        {/* 9-Model ONNX Selector (Reverse-Engineered from Removerized + IndexedDB Cache) */}
        <div className="mb-6 bg-[#13131F] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00D4FF]">
                🧠 Multi-Model ONNX WebAssembly Engine (IndexedDB Offline Cache)
              </span>
              <p className="text-xs text-gray-400 mt-0.5">
                Choose from 9 specialized HuggingFace segmentation models (ORMBG, ISNet, BiRefNet v2 Lite, BRIA RMBG 1.4, MODNet) cached in your browser.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <select
                value={exportFormat}
                onChange={e => setExportFormat(e.target.value as any)}
                className="bg-[#0A0A14] border border-white/10 rounded-xl px-3 py-1.5 text-white text-xs"
              >
                <option value="image/png">Export: Transparent PNG</option>
                <option value="image/webp">Export: Transparent WebP</option>
                <option value="image/jpeg">Export: Studio JPEG</option>
              </select>
              {exportFormat !== "image/png" && (
                <span className="text-gray-400 font-mono">
                  Q:
                  <input
                    type="number"
                    min={50}
                    max={100}
                    value={exportQuality}
                    onChange={e => setExportQuality(Math.max(50, Math.min(100, Number(e.target.value))))}
                    className="ml-1 w-14 bg-[#0A0A14] border border-white/10 rounded-lg px-2 py-1 text-white text-xs"
                  />%
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {REMOVER_MODEL_KEYS.map((mk) => {
              const m = ONNX_MODELS[mk];
              const isSel = selectedModel === mk;
              const isCached = cachedModels[mk];
              return (
                <button
                  key={mk}
                  type="button"
                  onClick={() => setSelectedModel(mk)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    isSel
                      ? "border-[#6C3AFF] bg-[#6C3AFF]/15 shadow-lg"
                      : "border-white/5 bg-[#0A0A14]/70 hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-white truncate">{m.label}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${isCached ? "bg-emerald-500/20 text-emerald-300" : "bg-white/5 text-gray-400"}`}>
                      {isCached ? "Cached ✓" : m.size}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 line-clamp-1">{m.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* UPLOAD */}
        {!origUrl && (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f=e.dataTransfer.files[0]; if(f?.type.startsWith("image/")) loadFile(f); }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-20 text-center cursor-pointer transition-all min-w-0 w-full ${
              dragging ? "border-[#6C3AFF] bg-[#6C3AFF]/5 scale-[1.01]" : "border-white/10 hover:border-[#6C3AFF]/40 hover:bg-[#6C3AFF]/5"
            }`}>
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f=e.target.files?.[0]; if(f) loadFile(f); }} />
            <div className="text-6xl mb-4">✂️</div>
            <div className="text-white font-bold text-xl mb-2">Drop image here or click to upload</div>
            <div className="text-gray-500 text-sm mb-4">JPEG · PNG · WebP — AI handles any subject automatically</div>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600 min-w-0">
              {["People","Products","Animals","Logos","Cars","Furniture","Food","Flowers"].map(t => (
                <span key={t} className="bg-[#13131F] px-3 py-1 rounded-full border border-white/5">{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* READY */}
        {origUrl && status === "idle" && (
          <div className="space-y-5 min-w-0 w-full">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 min-w-0 w-full">
              <img src={origUrl} alt="Upload" className="max-w-full max-h-96 object-contain mx-auto rounded-xl" />
            </div>
            <div className="flex gap-3 min-w-0 w-full">
              <button onClick={removeBackground}
                className="flex-1 min-w-0 py-4 rounded-2xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] text-white font-extrabold text-lg hover:opacity-90 transition-all shadow-2xl shadow-violet-900/40">
                ✨ Remove Background Automatically
              </button>
              <button onClick={startOver}
                className="px-5 min-w-[80px] rounded-2xl bg-[#13131F] border border-white/10 text-gray-400 hover:text-white text-sm transition-all">
                Change
              </button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {status === "loading" && (
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-10 text-center space-y-5 min-w-0 w-full">
            <div className="text-5xl animate-pulse">🧠</div>
            <div>
              <div className="text-white font-bold text-lg mb-1">{progressMsg}</div>
              <div className="text-gray-500 text-sm">Neural network running locally — your image never leaves your device</div>
            </div>
            <div className="min-w-0 w-full">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Progress</span>
                <span className="text-[#6C3AFF] font-bold">{progress}%</span>
              </div>
              <div className="h-3 bg-[#0A0A14] rounded-full overflow-hidden w-full">
                <div className="h-full bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] rounded-full transition-all duration-500"
                  style={{ width:`${progress}%` }} />
              </div>
            </div>
            {progress < 30 && (
              <p className="text-xs text-gray-600">💡 First-time use downloads the AI model (~5MB) and caches it locally. Future removals are instant.</p>
            )}
          </div>
        )}

        {/* ERROR */}
        {status === "error" && (
          <div className="bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-2xl p-6 space-y-4 min-w-0 w-full">
            <div className="text-[#FF3A6C] font-bold text-sm">⚠ AI Model Error</div>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{progressMsg}</div>
            <div className="flex gap-2">
              <button onClick={() => { setStatus("idle"); setProgressMsg(""); }}
                className="px-5 py-2.5 rounded-xl bg-[#6C3AFF] text-white text-sm font-bold hover:bg-[#5B2EE0] transition-all">
                Try Again
              </button>
              <button onClick={startOver}
                className="px-5 py-2.5 rounded-xl bg-[#13131F] border border-white/10 text-gray-400 hover:text-white text-sm transition-all">
                New Image
              </button>
            </div>
          </div>
        )}

        {/* RESULT */}
        {status === "done" && origUrl && resultUrl && (
          <div className="space-y-5 min-w-0 w-full">
            {/* View tabs + actions */}
            <div className="flex items-center gap-2 flex-wrap min-w-0 w-full">
              <div className="flex gap-1 bg-[#13131F] border border-white/5 p-1 rounded-xl">
                {(["compare","result","original"] as const).map(v => (
                  <button key={v} onClick={() => setView(v)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                      view===v ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"
                    }`}>
                    {v==="compare" ? "⇔ Compare" : v==="result" ? "✓ Result" : "○ Original"}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex gap-2">
                <button onClick={startOver}
                  className="px-4 py-2 rounded-xl bg-[#13131F] border border-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-all">
                  New Image
                </button>
                <button onClick={download}
                  className="px-5 py-2 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-sm font-bold transition-all truncate">
                  ⬇ Download PNG
                </button>
              </div>
            </div>

            {/* View panel */}
            {view === "compare" && (
              <ComparisonSlider before={origUrl} after={resultUrl} width={imgW} height={imgH} />
            )}
            {view === "result" && (
              <div className="rounded-2xl overflow-hidden min-w-0 w-full"
                style={{ backgroundImage:"repeating-conic-gradient(#AAAAAA 0% 25%,#EEEEEE 0% 50%) 0 0/20px 20px" }}>
                <canvas ref={displayRef} className="w-full h-auto block" />
              </div>
            )}
            {view === "original" && (
              <div className="bg-[#13131F] rounded-2xl overflow-hidden min-w-0 w-full">
                <img src={origUrl} alt="Original" className="w-full h-auto max-h-[600px] object-contain mx-auto block" />
              </div>
            )}

            {/* Background fill */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 space-y-3 min-w-0 w-full">
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-sm font-bold text-white block sm:inline">Background Fill</span>
                  <span className="text-xs text-gray-500 sm:ml-2">Add a solid colour behind the subject</span>
                </div>
                <button onClick={() => setBgFill(p => !p)}
                  className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${bgFill ? "bg-[#6C3AFF]" : "bg-gray-700"}`}
                  role="switch" aria-checked={bgFill}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${bgFill ? "left-6" : "left-1"}`} />
                </button>
              </div>
              {bgFill && (
                <div className="flex flex-wrap gap-2 items-center min-w-0">
                  {BG_SWATCHES.map(color => (
                    <button key={color} onClick={() => setBgColor(color)} title={color}
                      className={`w-7 h-7 rounded-lg transition-all border-2 flex-shrink-0 ${bgColor===color ? "border-white scale-110" : "border-transparent"}`}
                      style={{ background:color }} />
                  ))}
                  <label className="w-7 h-7 rounded-lg overflow-hidden cursor-pointer relative border-2 border-white/20 flex-shrink-0">
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                    <div className="w-full h-full rounded-lg" style={{ background:bgColor }} />
                  </label>
                  <span className="text-xs text-gray-600 font-mono">{bgColor}</span>
                </div>
              )}
            </div>

            {/* Refinement brushes */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 min-w-0 w-full">
              <button onClick={() => setShowTools(p => !p)}
                className="w-full flex items-center justify-between text-left min-w-0">
                <div className="min-w-0 pr-2">
                  <span className="text-sm font-bold text-white block">🖌 Refine with brushes</span>
                  <p className="text-xs text-gray-500 mt-0.5">Erase remaining patches or restore removed pixels — undo anytime</p>
                </div>
                <span className="text-[#6C3AFF] text-xl flex-shrink-0 ml-2">{showTools ? "−" : "+"}</span>
              </button>

              {showTools && (
                <div className="mt-4 space-y-4 min-w-0 w-full">
                  <div className="flex gap-2 min-w-0 w-full">
                    {(["erase","restore"] as const).map(m => (
                      <button key={m} onClick={() => setMode(m)}
                        className={`flex-1 min-w-0 py-2 rounded-xl text-xs font-bold transition-all border ${
                          mode===m ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                        }`}>
                        {m==="erase" ? "✂ Erase" : "✦ Restore"}
                      </button>
                    ))}
                    <button onClick={undo} disabled={!undoStack.length}
                      className="px-4 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 text-xs font-semibold transition-all">
                      ↩ Undo
                    </button>
                  </div>
                  <div className="min-w-0 w-full">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Brush size</span>
                      <span className="text-white font-bold">{brushSize}px</span>
                    </div>
                    <input type="range" min={4} max={80} value={brushSize}
                      onChange={e => setBrushSize(Number(e.target.value))}
                      className="w-full min-w-0 h-2 rounded-full appearance-none cursor-pointer"
                      style={{ background:`linear-gradient(to right, #6C3AFF ${((brushSize-4)/76)*100}%, #1a1a2e ${((brushSize-4)/76)*100}%)` }} />
                  </div>
                  <div className="text-xs text-gray-600 bg-[#0A0A14] rounded-xl px-3 py-2 min-w-0 w-full">
                    {mode==="erase"
                      ? "Paint over remaining background patches to erase them. Use a small brush for precise edges."
                      : "Paint over areas that were accidentally removed to restore the original pixels."}
                  </div>
                  <canvas ref={displayRef}
                    className="w-full min-w-0 rounded-xl block"
                    style={{ cursor:"crosshair", maxHeight:"600px" }}
                    onMouseDown={e => { pushUndo(); setIsDrawing(true); const p=getPos(e); doPaint(p.x,p.y); }}
                    onMouseMove={e => { if (!isDrawing) return; const p=getPos(e); doPaint(p.x,p.y); }}
                    onMouseUp={() => { setIsDrawing(false); commitBrushStroke(); }}
                    onMouseLeave={() => { if (isDrawing) { setIsDrawing(false); commitBrushStroke(); } }}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── SEO & Marketing Content ───────────────── */}

        {/* Features */}
        <div className="mt-16 bg-[#13131F] border border-white/5 rounded-2xl p-6 min-w-0 w-full">
          <h2 className="text-xl font-extrabold text-white mb-5">Why PursTech Background Remover</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 min-w-0 w-full">
            {[
              { icon:"🔒", title:"100% Private",         desc:"The AI model runs entirely in your browser. Your image is never uploaded or transmitted — safe for confidential product photos and personal images." },
              { icon:"⚡", title:"Fast After First Use", desc:"After the initial ~5MB model download (cached locally), every subsequent removal completes in 2–5 seconds on most devices." },
              { icon:"⇔", title:"Comparison Slider",    desc:"Drag the slider to see exactly what was removed and what was kept, side by side, before downloading." },
              { icon:"🖌", title:"Manual Refinement",    desc:"Erase remaining background patches or restore accidentally removed subject pixels using the soft-edge brush tools." },
              { icon:"🎨", title:"Background Fill",      desc:"Add a solid colour behind the subject before downloading — perfect for product photos on white or any custom colour." },
              { icon:"🆓", title:"Free, No Account",    desc:"No login, no credit card, no limits. Works on any modern browser with WebAssembly support." },
            ].map(f => (
              <div key={f.title} className="flex gap-3 min-w-0">
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div className="min-w-0">
                  <div className="font-semibold text-white text-sm mb-1 truncate">{f.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 max-w-3xl min-w-0 w-full">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3 min-w-0 w-full">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all min-w-0 w-full">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none min-w-0 w-full">
                  <span className="min-w-0 pr-4">{f.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* Related tools */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
          <h3 className="text-sm font-bold text-white mb-4">🔧 Related Image Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 min-w-0 w-full">
            {RELATED_TOOLS.map(tool => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#0A0A14] transition-colors group min-w-0">
                <span className="text-xl flex-shrink-0">{tool.icon}</span>
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors min-w-0 truncate">{tool.name}</span>
                <span className="ml-auto text-gray-700 group-hover:text-[#6C3AFF] flex-shrink-0">→</span>
              </Link>
            ))}
          </div>
        </div>
      
        {/* ── Technical Deep-Dive & Reference Guide ── */}
        <section className="mt-14 bg-[#13131F] border border-white/5 rounded-2xl p-6 md:p-8 space-y-4 min-w-0 w-full">
          <h2 className="text-xl md:text-2xl font-extrabold text-white">How Browser-Based AI Background Removal Works Without Server Uploads</h2>
          <div className="space-y-3">
            <p className="text-gray-400 text-sm leading-relaxed">Traditional background removal tools either require manual pen-tool tracing in desktop software like Photoshop or GIMP, or force you to upload your photos to a cloud server that charges per high-resolution download. PursTech's AI Background Remover takes a fundamentally different approach: it runs a pre-trained semantic segmentation neural network directly inside your web browser using WebAssembly (WASM) and ONNX Runtime Web.</p>
            <p className="text-gray-400 text-sm leading-relaxed">When you drop a portrait, e-commerce product photo, or logo onto the canvas, the model analyzes foreground versus background pixel probabilities locally in your device's RAM, generating a smooth alpha-channel transparency mask capable of preserving fine edge details like hair strands, fur, and semi-transparent shadows. Once segmented, you can export a transparent PNG or composite your subject over a solid studio color, CSS gradient, or custom backdrop immediately.</p>
                        <p className="text-gray-400 text-sm leading-relaxed">Because inference happens 100% client-side after the model weights cache in your browser, your product photography, ID portraits, and client assets are never uploaded to an external server—giving you unlimited full-resolution exports with zero watermarks and complete data privacy.</p>
            <h3 className="text-base font-bold text-white pt-3">What Are the Best Free Web-Based Background Remover Tools Without Watermarks for Commercial Use in 2026?</h3>
            <div className="overflow-x-auto rounded-xl border border-white/10 mt-2">
              <table className="w-full text-left text-xs text-gray-300 border-collapse">
                <thead>
                  <tr className="bg-[#0A0A14] text-white border-b border-white/10">
                    <th className="p-3 font-bold">Platform</th>
                    <th className="p-3 font-bold">Free Full-HD Export</th>
                    <th className="p-3 font-bold">Watermark-Free Commercial Use</th>
                    <th className="p-3 font-bold">Privacy / Processing</th>
                    <th className="p-3 font-bold">AI Matting Models</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="p-3 font-bold text-[#00D4FF]">PursTech AI Background Remover</td>
                    <td className="p-3 text-emerald-400 font-semibold">Yes (Unlimited up to 4K+)</td>
                    <td className="p-3 text-emerald-400 font-semibold">100% Free, Zero Watermarks</td>
                    <td className="p-3 text-emerald-400 font-semibold">100% Local Browser WASM</td>
                    <td className="p-3">9 Models (BiRefNet v2, ORMBG, ISNet, RMBG 1.4, MODNet) + Brush</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Canva Background Remover</td>
                    <td className="p-3 text-amber-400">Requires Canva Pro Trial/Sub</td>
                    <td className="p-3 text-amber-400">Paid Pro Subscription Only</td>
                    <td className="p-3 text-gray-400">Cloud Server Upload</td>
                    <td className="p-3">Single Cloud Model</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">PhotoRoom / Pixelcut</td>
                    <td className="p-3 text-rose-400">Capped / Low-Res on Free Tier</td>
                    <td className="p-3 text-amber-400">Adds Watermark on Free Tier</td>
                    <td className="p-3 text-gray-400">Cloud Server Upload</td>
                    <td className="p-3">Single Cloud Model</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">remove.bg</td>
                    <td className="p-3 text-rose-400">0.25 MP Preview Only (Paid HD)</td>
                    <td className="p-3 text-amber-400">Requires Per-Image Credits</td>
                    <td className="p-3 text-gray-400">Cloud Server Upload</td>
                    <td className="p-3">Proprietary Cloud API</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── Related PursTech Blog Guides ── */}
        <section className="mt-10 min-w-0 w-full">
          <h2 className="text-lg font-extrabold text-white mb-4">📖 Related Guides &amp; Tutorials</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 min-w-0 w-full">
            <Link key="how-to-remove-background-gimp-canva" href="/blog/how-to-remove-background-gimp-canva" className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-4 transition-all group flex items-center justify-between gap-3 min-w-0">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6C3AFF] mb-1">In-Depth Guide</div>
                <div className="text-sm font-bold text-white group-hover:text-[#00D4FF] transition-colors truncate">How to Remove a Background in GIMP, Canva & Browser AI</div>
              </div>
              <span className="text-gray-600 group-hover:text-[#6C3AFF] transition-colors flex-shrink-0">→</span>
            </Link>
            <Link key="best-free-background-removers" href="/blog/best-free-background-removers" className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-4 transition-all group flex items-center justify-between gap-3 min-w-0">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6C3AFF] mb-1">In-Depth Guide</div>
                <div className="text-sm font-bold text-white group-hover:text-[#00D4FF] transition-colors truncate">Best Free Background Removers Tested</div>
              </div>
              <span className="text-gray-600 group-hover:text-[#6C3AFF] transition-colors flex-shrink-0">→</span>
            </Link>
            <Link key="how-to-compress-images-without-losing-quality" href="/blog/how-to-compress-images-without-losing-quality" className="bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/40 rounded-2xl p-4 transition-all group flex items-center justify-between gap-3 min-w-0">
              <div className="min-w-0">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#6C3AFF] mb-1">In-Depth Guide</div>
                <div className="text-sm font-bold text-white group-hover:text-[#00D4FF] transition-colors truncate">How to Compress Images Without Losing Quality</div>
              </div>
              <span className="text-gray-600 group-hover:text-[#6C3AFF] transition-colors flex-shrink-0">→</span>
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