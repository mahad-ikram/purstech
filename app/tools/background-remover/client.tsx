"use client";

/*
 * REQUIRED SETUP (run once in terminal after npm install):
 *   mkdir -p public/bg-removal && cp -r node_modules/@imgly/background-removal/dist/. public/bg-removal/
 *
 * REQUIRED next.config.js:
 *   webpack: (config) => {
 *     config.experiments = { ...config.experiments, asyncWebAssembly: true, layers: true };
 *     return config;
 *   }
 */

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool";

// ── Module-scope constants (Rule 10 + no per-render allocation) ───────────────
const RELATED_TOOLS = [
  { icon:"🗜",  name:"Image Compressor",   slug:"image-compressor"  },
  { icon:"📐", name:"Image Resizer",       slug:"image-resizer"     },
  { icon:"🏷",  name:"Favicon Generator",  slug:"favicon-generator" },
  { icon:"🎨", name:"Color Picker",        slug:"color-picker"      },
  { icon:"📷", name:"Image to Text (OCR)", slug:"image-to-text"     },
];

const FAQ = [
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

// ✅ FIX: moved from inside component — no per-render rebuild
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
      className="relative select-none overflow-hidden rounded-xl w-full"
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
export default function BackgroundRemoverClient() {
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

  // ── ✅ FIX: revoke old blob URLs to prevent memory leaks ──────────────────
  function revokeIfBlob(url: string | null) {
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
  }

  // ── ✅ FIX: revoke previous origUrl before creating a new one ─────────────
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

  // ── removeBackground — production-hardened ───────────────────────────────
  async function removeBackground() {
    if (!file) return;

    // Guard: WebAssembly required for ONNX Runtime
    if (typeof WebAssembly === "undefined") {
      setStatus("error");
      setProgressMsg("Your browser does not support WebAssembly, which is required for AI processing. Please try Chrome 90+, Firefox 89+, or Edge 90+.");
      return;
    }

    setStatus("loading"); setProgress(5); setProgressMsg("Initialising AI model…");

    try {
      // Isolate import errors from runtime errors
      let removeBgFn: Function;
      try {
        const mod  = await import("@imgly/background-removal");
        removeBgFn = (mod as any).removeBackground ?? (mod as any).default;
        if (typeof removeBgFn !== "function")
          throw new Error("removeBackground export not found");
      } catch (importErr: unknown) {
        const msg = importErr instanceof Error ? importErr.message : String(importErr);
        throw new Error(`Failed to load AI library — ${msg}. Ensure @imgly/background-removal is installed.`);
      }

      setProgress(20); setProgressMsg("Loading AI model (~5MB, cached after first use)…");

      // ✅ publicPath: absolute URL to local files in public/bg-removal/
      //    Files are copied from node_modules by the build script in package.json:
      //    "build": "mkdir -p public/bg-removal && cp -r node_modules/@imgly/background-removal/dist/. public/bg-removal/ && next build"
      //    window.location.origin makes the base absolute so new URL(file, base) works.
      // ✅ proxyToWorker:false — Next.js App Router cannot bundle Web Workers
      const resultBlob: Blob = await removeBgFn(file, {
        publicPath:    `${window.location.origin}/bg-removal/`,
        proxyToWorker: false,
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            setProgress(Math.min(Math.round((current / total) * 60) + 20, 80));
            if      (key.includes("ort"))   setProgressMsg("Loading ONNX inference engine…");
            else if (key.includes("model")) setProgressMsg("Loading segmentation model…");
            else if (key.includes("fetch")) setProgressMsg("Fetching model assets…");
          }
        },
      });

      setProgress(85); setProgressMsg("Segmenting image…");

      // ✅ FIX 3: revokeIfBlob old resultUrl before creating new one
      revokeIfBlob(resultUrl);
      const rUrl = URL.createObjectURL(resultBlob);

      await new Promise<void>((resolve, reject) => {
        const rImg = new Image();
        rImg.onload = () => {
          try {
            const wc = canvasRef.current;
            if (!wc) throw new Error("Canvas not mounted");
            wc.width  = rImg.naturalWidth;
            wc.height = rImg.naturalHeight;
            wc.getContext("2d")!.drawImage(rImg, 0, 0);
            setResultUrl(rUrl);
            setProgress(100); setStatus("done"); setView("compare"); setProgressMsg("");
            resolve();
          } catch (canvasErr) { URL.revokeObjectURL(rUrl); reject(canvasErr); }
        };
        rImg.onerror = () => { URL.revokeObjectURL(rUrl); reject(new Error("Result image failed to decode")); };
        rImg.src = rUrl;
      });

    } catch (err: unknown) {
      console.error("Background removal error:", err);
      const raw = err instanceof Error ? err.message : String(err);

      // ✅ FIX 4: classify "Invalid base URL" explicitly
      const userMsg =
        raw.includes("Invalid base URL") || raw.includes("URL")
          ? `URL error — the model path could not be resolved. Ensure the setup command has been run:\nmkdir -p public/bg-removal && cp -r node_modules/@imgly/background-removal/dist/. public/bg-removal/`
        : raw.includes("not found") || raw.includes("isnet") || raw.includes("publicPath")
          ? `Model file not found. Run the setup command below, then reload.`
        : raw.includes("WebAssembly") || raw.includes("wasm") || raw.includes("compile")
          ? `WebAssembly error — ${raw}.\nCheck next.config.js: add asyncWebAssembly:true to webpack.experiments.`
        : raw.includes("fetch") || raw.includes("network") || raw.includes("Failed to fetch")
          ? "Network error — could not reach model files. Check your internet and try again."
        : raw.includes("Worker") || raw.includes("worker")
          ? `Web Worker error — add asyncWebAssembly:true and layers:true to next.config.js webpack.experiments.`
        : raw || "AI model failed to load. Please try again.";

      setStatus("error");
      setProgressMsg(userMsg);
    }
  }

  function buildExportUrl(): string {
    const wc = canvasRef.current;
    if (!wc) return "";
    if (bgFill) {
      const tmp = document.createElement("canvas");
      tmp.width = wc.width; tmp.height = wc.height;
      const tc = tmp.getContext("2d")!;
      tc.fillStyle = bgColor; tc.fillRect(0,0,tmp.width,tmp.height); tc.drawImage(wc,0,0);
      return tmp.toDataURL("image/png");
    }
    return wc.toDataURL("image/png");
  }

  function download() {
    const href = buildExportUrl();
    if (!href) return;
    Object.assign(document.createElement("a"), { href, download:`${imgName}-no-bg.png` }).click();
  }

  function pushUndo() {
    const wc = canvasRef.current;
    if (!wc) return;
    setUndoStack(prev => [...prev.slice(-19), wc.getContext("2d")!.getImageData(0,0,wc.width,wc.height)]);
  }

  // ✅ FIX: revoke old resultUrl when undo creates a new blob
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

  // ✅ FIX: revoke old resultUrl when brush creates a new blob
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
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={origRef}   className="hidden" />

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10 flex-grow w-full">
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span aria-hidden="true">›</span>
          <Link href="/categories/image" className="hover:text-gray-400 transition-colors">Image Tools</Link>
          <span aria-hidden="true">›</span>
          <span className="text-gray-400">Background Remover</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Image Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free AI Background Remover Online — Remove Backgrounds Automatically
          </h1>
          <p className="text-gray-400 max-w-2xl">AI-powered background removal using a neural network that runs entirely in your browser. No upload, no account. Includes a comparison slider, manual refinement brushes and background fill.</p>
        </div>

        {/* UPLOAD */}
        {!origUrl && (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f=e.dataTransfer.files[0]; if(f?.type.startsWith("image/")) loadFile(f); }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-20 text-center cursor-pointer transition-all ${
              dragging ? "border-[#6C3AFF] bg-[#6C3AFF]/5 scale-[1.01]" : "border-white/10 hover:border-[#6C3AFF]/40 hover:bg-[#6C3AFF]/5"
            }`}>
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f=e.target.files?.[0]; if(f) loadFile(f); }} />
            <div className="text-6xl mb-4">✂️</div>
            <div className="text-white font-bold text-xl mb-2">Drop image here or click to upload</div>
            <div className="text-gray-500 text-sm mb-4">JPEG · PNG · WebP — AI handles any subject automatically</div>
            <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-600">
              {["People","Products","Animals","Logos","Cars","Furniture","Food","Flowers"].map(t => (
                <span key={t} className="bg-[#13131F] px-3 py-1 rounded-full border border-white/5">{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* READY */}
        {origUrl && status === "idle" && (
          <div className="space-y-5">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
              <img src={origUrl} alt="Upload" className="max-w-full max-h-96 object-contain mx-auto rounded-xl" />
            </div>
            <div className="flex gap-3">
              <button onClick={removeBackground}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] text-white font-extrabold text-lg hover:opacity-90 transition-all shadow-2xl shadow-violet-900/40">
                ✨ Remove Background Automatically
              </button>
              <button onClick={startOver}
                className="px-5 rounded-2xl bg-[#13131F] border border-white/10 text-gray-400 hover:text-white text-sm transition-all">
                Change
              </button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {status === "loading" && (
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-10 text-center space-y-5">
            <div className="text-5xl animate-pulse">🧠</div>
            <div>
              <div className="text-white font-bold text-lg mb-1">{progressMsg}</div>
              <div className="text-gray-500 text-sm">Neural network running locally — your image never leaves your device</div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Progress</span>
                <span className="text-[#6C3AFF] font-bold">{progress}%</span>
              </div>
              <div className="h-3 bg-[#0A0A14] rounded-full overflow-hidden">
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
          <div className="bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-2xl p-6 space-y-4">
            <div className="text-[#FF3A6C] font-bold text-sm">⚠ AI Model Error</div>
            <div className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{progressMsg}</div>
            <div className="bg-[#0A0A14] rounded-xl p-4 space-y-2">
              <div className="text-xs text-gray-400 font-semibold">Required setup (run once in terminal):</div>
              <code className="block text-xs text-green-400 font-mono break-all leading-relaxed">
                mkdir -p public/bg-removal &amp;&amp; cp -r node_modules/@imgly/background-removal/dist/. public/bg-removal/
              </code>
              <div className="text-xs text-gray-400 font-semibold mt-2">Required in next.config.js:</div>
              <code className="block text-xs text-green-400 font-mono">
                webpack: (c) =&gt; &#123; c.experiments = &#123; asyncWebAssembly:true, layers:true &#125;; return c; &#125;
              </code>
            </div>
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
          <div className="space-y-5">
            {/* View tabs + actions */}
            <div className="flex items-center gap-2 flex-wrap">
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
                  className="px-5 py-2 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-sm font-bold transition-all">
                  ⬇ Download PNG
                </button>
              </div>
            </div>

            {/* View panel */}
            {view === "compare" && (
              <ComparisonSlider before={origUrl} after={resultUrl} width={imgW} height={imgH} />
            )}
            {view === "result" && (
              <div className="rounded-2xl overflow-hidden"
                style={{ backgroundImage:"repeating-conic-gradient(#AAAAAA 0% 25%,#EEEEEE 0% 50%) 0 0/20px 20px" }}>
                <canvas ref={displayRef} className="w-full h-auto block" />
              </div>
            )}
            {view === "original" && (
              <div className="bg-[#13131F] rounded-2xl overflow-hidden">
                <img src={origUrl} alt="Original" className="w-full h-auto max-h-[600px] object-contain mx-auto block" />
              </div>
            )}

            {/* Background fill */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-bold text-white">Background Fill</span>
                  <span className="text-xs text-gray-500 ml-2">Add a solid colour behind the subject</span>
                </div>
                <button onClick={() => setBgFill(p => !p)}
                  className={`w-11 h-6 rounded-full transition-all relative flex-shrink-0 ${bgFill ? "bg-[#6C3AFF]" : "bg-gray-700"}`}
                  role="switch" aria-checked={bgFill}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${bgFill ? "left-6" : "left-1"}`} />
                </button>
              </div>
              {bgFill && (
                <div className="flex flex-wrap gap-2 items-center">
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
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
              <button onClick={() => setShowTools(p => !p)}
                className="w-full flex items-center justify-between text-left">
                <div>
                  <span className="text-sm font-bold text-white">🖌 Refine with brushes</span>
                  <p className="text-xs text-gray-500 mt-0.5">Erase remaining patches or restore removed pixels — undo anytime</p>
                </div>
                <span className="text-[#6C3AFF] text-xl flex-shrink-0 ml-2">{showTools ? "−" : "+"}</span>
              </button>

              {showTools && (
                <div className="mt-4 space-y-4">
                  <div className="flex gap-2">
                    {(["erase","restore"] as const).map(m => (
                      <button key={m} onClick={() => setMode(m)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
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
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Brush size</span>
                      <span className="text-white font-bold">{brushSize}px</span>
                    </div>
                    <input type="range" min={4} max={80} value={brushSize}
                      onChange={e => setBrushSize(Number(e.target.value))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{ background:`linear-gradient(to right, #6C3AFF ${((brushSize-4)/76)*100}%, #1a1a2e ${((brushSize-4)/76)*100}%)` }} />
                  </div>
                  <div className="text-xs text-gray-600 bg-[#0A0A14] rounded-xl px-3 py-2">
                    {mode==="erase"
                      ? "Paint over remaining background patches to erase them. Use a small brush for precise edges."
                      : "Paint over areas that were accidentally removed to restore the original pixels."}
                  </div>
                  <canvas ref={displayRef}
                    className="w-full rounded-xl block"
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

        {/* Features */}
        <div className="mt-16 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">Why PursTech Background Remover</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon:"🔒", title:"100% Private",         desc:"The AI model runs entirely in your browser. Your image is never uploaded or transmitted — safe for confidential product photos and personal images." },
              { icon:"⚡", title:"Fast After First Use", desc:"After the initial ~5MB model download (cached locally), every subsequent removal completes in 2–5 seconds on most devices." },
              { icon:"⇔", title:"Comparison Slider",    desc:"Drag the slider to see exactly what was removed and what was kept, side by side, before downloading." },
              { icon:"🖌", title:"Manual Refinement",    desc:"Erase remaining background patches or restore accidentally removed subject pixels using the soft-edge brush tools." },
              { icon:"🎨", title:"Background Fill",      desc:"Add a solid colour behind the subject before downloading — perfect for product photos on white or any custom colour." },
              { icon:"🆓", title:"Free, No Account",    desc:"No login, no credit card, no limits. Works on any modern browser with WebAssembly support." },
            ].map(f => (
              <div key={f.title} className="flex gap-3">
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <div className="font-semibold text-white text-sm mb-1">{f.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* Related tools */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-5">
          <h3 className="text-sm font-bold text-white mb-4">🔧 Related Image Tools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {RELATED_TOOLS.map(tool => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#0A0A14] transition-colors group">
                <span className="text-xl flex-shrink-0">{tool.icon}</span>
                <span className="text-sm text-gray-400 group-hover:text-white transition-colors min-w-0 truncate">{tool.name}</span>
                <span className="ml-auto text-gray-700 group-hover:text-[#6C3AFF] flex-shrink-0">→</span>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-16 py-8 text-center">
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
