"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

const FAQ = [
  { q: "How does the automatic background removal work?", a: "PursTech uses a neural network model (ONNX Runtime) that runs entirely inside your browser using WebAssembly. The model analyses every pixel of your image to classify it as foreground or background and produces a clean transparent result. Your image is never sent to any server. On first use the model downloads (~5MB) and is cached locally for instant future use." },
  { q: "Is my image uploaded anywhere?", a: "No. The AI model downloads to your device once and runs locally in your browser using WebAssembly. Your image is processed entirely in memory — nothing is ever transmitted over the internet. Safe for confidential product photos, personal photos and private documents." },
  { q: "Why does the first removal take longer?", a: "On the very first use the browser downloads the AI model files (~5MB) and compiles them via WebAssembly. This takes 5–20 seconds depending on your connection. After that the model is cached and every subsequent removal completes in 2–5 seconds." },
  { q: "What types of images work best?", a: "The AI works on any type of image — people, animals, products, logos, cars and complex scenes. It produces particularly clean results on people, product photography and animals. For best results use a high-resolution image (at least 512×512px) with reasonable lighting." },
  { q: "Can I refine the result after automatic removal?", a: "Yes — after AI removal, use the Soft Eraser to remove remaining background patches and the Restore brush to bring back accidentally removed subject pixels. Both use a soft-edge brush for natural blending. Undo any number of steps and toggle between original and result at any time." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.map(f => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

type ToolMode = "erase" | "restore";

// ── Comparison Slider ─────────────────────────────────────────────────────────
function ComparisonSlider({ before, after, width, height }: { before: string; after: string; width: number; height: number }) {
  const [pos, setPos]   = useState(50);
  const [drag, setDrag] = useState(false);
  const containerRef    = useRef<HTMLDivElement>(null);

  const updatePos = useCallback((clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos(Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100)));
  }, []);

  useEffect(() => {
    const mm = (e: MouseEvent) => { if (drag) updatePos(e.clientX); };
    const mu = () => setDrag(false);
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup",   mu);
    return () => { window.removeEventListener("mousemove", mm); window.removeEventListener("mouseup", mu); };
  }, [drag, updatePos]);

  return (
    <div ref={containerRef} className="relative select-none overflow-hidden rounded-xl w-full"
      style={{ aspectRatio: `${width} / ${height}` }}
      onMouseDown={e => { setDrag(true); updatePos(e.clientX); }}
      onTouchStart={e => updatePos(e.touches[0].clientX)}
      onTouchMove={e => updatePos(e.touches[0].clientX)}>

      <div className="absolute inset-0"
        style={{ backgroundImage: "repeating-conic-gradient(#AAAAAA 0% 25%,#EEEEEE 0% 50%) 0 0/20px 20px" }}>
        <img src={after} alt="Result" className="w-full h-full object-contain" draggable={false} />
      </div>

      <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
        <img src={before} alt="Original" draggable={false}
          className="absolute top-0 left-0 h-full object-contain"
          style={{ width: `${(100 / Math.max(pos, 0.1)) * 100}%`, maxWidth: "none" }} />
      </div>

      <div className="absolute top-0 bottom-0" style={{ left: `${pos}%`, transform: "translateX(-50%)" }}>
        <div className="absolute inset-y-0 w-0.5 bg-white shadow-lg left-1/2 -translate-x-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-full shadow-xl flex items-center justify-center cursor-ew-resize border-2 border-[#6C3AFF] z-10">
          <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
            <path d="M1 5H13M5 1L1 5L5 9M9 1L13 5L9 9" stroke="#6C3AFF" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>

      <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg font-semibold pointer-events-none">Original</div>
      <div className="absolute top-2 right-2 bg-[#6C3AFF]/80 text-white text-xs px-2 py-1 rounded-lg font-semibold pointer-events-none">Removed</div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function BackgroundRemoverClient() {
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

  const redrawDisplay = useCallback(() => {
    const wc = canvasRef.current, dc = displayRef.current;
    if (!wc || !dc) return;
    dc.width  = wc.width;
    dc.height = wc.height;
    const ctx = dc.getContext("2d")!;
    const SZ  = 12;
    for (let y = 0; y < dc.height; y += SZ)
      for (let x = 0; x < dc.width; x += SZ) {
        ctx.fillStyle = (Math.floor(x/SZ)+Math.floor(y/SZ))%2===0 ? "#BBBBBB" : "#EEEEEE";
        ctx.fillRect(x, y, SZ, SZ);
      }
    if (bgFill) {
      const tmp = document.createElement("canvas");
      tmp.width = wc.width; tmp.height = wc.height;
      const tc  = tmp.getContext("2d")!;
      tc.fillStyle = bgColor; tc.fillRect(0,0,tmp.width,tmp.height); tc.drawImage(wc,0,0);
      ctx.drawImage(tmp, 0, 0);
    } else {
      ctx.drawImage(wc, 0, 0);
    }
  }, [bgFill, bgColor]);

  useEffect(() => { if (status === "done" && showTools) redrawDisplay(); }, [bgFill, bgColor, status, showTools, redrawDisplay]);

  function loadFile(f: File) {
    const url = URL.createObjectURL(f);
    const img = new Image();
    img.onload = () => {
      setFile(f); setOrigUrl(url); setImgW(img.naturalWidth); setImgH(img.naturalHeight);
      setImgName(f.name.replace(/\.[^/.]+$/, "")); setResultUrl(null);
      setStatus("idle"); setProgress(0); setUndoStack([]); setShowTools(false); setView("compare");
      requestAnimationFrame(() => {
        const oc = origRef.current;
        if (!oc) return;
        oc.width = img.naturalWidth; oc.height = img.naturalHeight;
        oc.getContext("2d")!.drawImage(img, 0, 0);
      });
    };
    img.src = url;
  }

  async function removeBackground() {
    if (!file) return;
    setStatus("loading"); setProgress(5); setProgressMsg("Initialising AI model…");
    try {
      const { removeBackground: removeBg } = await import("@imgly/background-removal");
      setProgress(20); setProgressMsg("Downloading neural network model (~5MB, cached after first use)…");
      const resultBlob = await removeBg(file, {
        publicPath: "https://unpkg.com/@imgly/background-removal@1.4.5/dist/",
        progress: (key: string, current: number, total: number) => {
          if (total > 0) {
            setProgress(Math.min(Math.round((current/total)*60)+20, 80));
            if      (key.includes("ort"))   setProgressMsg("Loading inference engine…");
            else if (key.includes("model")) setProgressMsg("Loading segmentation model…");
          }
        },
      });
      setProgress(85); setProgressMsg("Segmenting image…");
      const rUrl = URL.createObjectURL(resultBlob);
      const rImg = new Image();
      rImg.onload = () => {
        const wc = canvasRef.current!;
        wc.width = rImg.naturalWidth; wc.height = rImg.naturalHeight;
        wc.getContext("2d")!.drawImage(rImg, 0, 0);
        setResultUrl(rUrl); setProgress(100); setStatus("done"); setView("compare");
      };
      rImg.src = rUrl;
    } catch(err) {
      console.error(err);
      setStatus("error");
      setProgressMsg("AI model failed to load. Please check your internet connection for the first-time model download.");
    }
  }

  function buildExportUrl() {
    const wc = canvasRef.current!;
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
    const a = Object.assign(document.createElement("a"), { href: buildExportUrl(), download: `${imgName}-no-bg.png` });
    a.click();
  }

  function pushUndo() {
    const wc = canvasRef.current!;
    setUndoStack(prev => [...prev.slice(-19), wc.getContext("2d")!.getImageData(0,0,wc.width,wc.height)]);
  }

  function undo() {
    if (!undoStack.length) return;
    canvasRef.current!.getContext("2d")!.putImageData(undoStack[undoStack.length-1], 0, 0);
    setUndoStack(p => p.slice(0,-1));
    redrawDisplay();
    canvasRef.current!.toBlob(blob => { if (blob) setResultUrl(URL.createObjectURL(blob)); }, "image/png");
  }

  function doPaint(x: number, y: number) {
    const wc = canvasRef.current!, ctx = wc.getContext("2d")!;
    const w = wc.width, h = wc.height;
    const imd = ctx.getImageData(0, 0, w, h);
    const origCtx  = origRef.current?.getContext("2d");
    const origData = origCtx?.getImageData(0, 0, w, h);
    const r = brushSize / 2;
    for (let dy=-r; dy<=r; dy++) for (let dx=-r; dx<=r; dx++) {
      const dist = Math.sqrt(dx*dx+dy*dy);
      if (dist > r) continue;
      const px = Math.round(x+dx), py = Math.round(y+dy);
      if (px<0||px>=w||py<0||py>=h) continue;
      const i = (py*w+px)*4;
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
    const dc = displayRef.current!, rect = dc.getBoundingClientRect();
    return { x: Math.round((e.clientX-rect.left)*(dc.width/rect.width)), y: Math.round((e.clientY-rect.top)*(dc.height/rect.height)) };
  }

  function startOver() {
    setFile(null); setOrigUrl(null); setResultUrl(null);
    setStatus("idle"); setProgress(0); setUndoStack([]); setShowTools(false);
  }

  const BG_SWATCHES = ["#FFFFFF","#000000","#F5F5F5","#1A1A2E","#FF6B6B","#4ECDC4","#6C3AFF","#FFD93D","#2ECC71","#E74C3C"];

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <canvas ref={canvasRef} className="hidden" />
      <canvas ref={origRef}   className="hidden" />

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10 flex-grow">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span>›</span>
          <span className="text-gray-400">Background Remover</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Image Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Free AI Background Remover Online — Remove Backgrounds Automatically</h1>
          <p className="text-gray-400 max-w-2xl">AI-powered background removal using a neural network that runs entirely in your browser. No upload, no account. Includes a comparison slider, manual refinement brushes and background fill.</p>
        </div>

        {/* UPLOAD */}
        {!origUrl && (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f=e.dataTransfer.files[0]; if(f?.type.startsWith("image/")) loadFile(f); }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-20 text-center cursor-pointer transition-all ${dragging ? "border-[#6C3AFF] bg-[#6C3AFF]/5 scale-[1.01]" : "border-white/10 hover:border-[#6C3AFF]/40 hover:bg-[#6C3AFF]/5"}`}>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => { const f=e.target.files?.[0]; if(f) loadFile(f); }} />
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
                <div className="h-full bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
            {progress < 30 && <p className="text-xs text-gray-600">💡 First-time use downloads the AI model (~5MB) and caches it locally. Future removals are instant.</p>}
          </div>
        )}

        {/* ERROR */}
        {status === "error" && (
          <div className="bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-2xl p-6 space-y-3">
            <div className="text-[#FF3A6C] font-bold">⚠ AI Model Error</div>
            <div className="text-gray-400 text-sm">{progressMsg}</div>
            <button onClick={() => setStatus("idle")} className="px-5 py-2.5 rounded-xl bg-[#6C3AFF] text-white text-sm font-bold">Try Again</button>
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
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${view===v ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"}`}>
                    {v==="compare" ? "⇔ Compare" : v==="result" ? "✓ Result" : "○ Original"}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex gap-2">
                <button onClick={startOver} className="px-4 py-2 rounded-xl bg-[#13131F] border border-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-all">New Image</button>
                <button onClick={download}  className="px-5 py-2 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-sm font-bold transition-all">⬇ Download PNG</button>
              </div>
            </div>

            {/* Canvas */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
              {view==="compare" && <ComparisonSlider before={origUrl} after={resultUrl} width={imgW} height={imgH} />}
              {view==="result"  && <div className="rounded-xl overflow-hidden" style={{ backgroundImage: "repeating-conic-gradient(#AAAAAA 0% 25%,#EEEEEE 0% 50%) 0 0/20px 20px" }}><img src={resultUrl} alt="Result" className="w-full object-contain max-h-[600px]" /></div>}
              {view==="original"&& <img src={origUrl} alt="Original" className="w-full object-contain max-h-[600px] rounded-xl" />}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* BG fill */}
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Replace Background</span>
                  <button onClick={() => setBgFill(p => !p)}
                    className={`w-11 h-6 rounded-full transition-all relative ${bgFill ? "bg-[#6C3AFF]" : "bg-gray-700"}`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-200 ${bgFill ? "left-6" : "left-1"}`} />
                  </button>
                </div>
                {bgFill && <>
                  <div className="flex gap-2 items-center">
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                      className="w-10 h-8 rounded-lg border border-white/10 bg-[#0A0A14] cursor-pointer flex-shrink-0" />
                    <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 font-mono" />
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {BG_SWATCHES.map(c => (
                      <button key={c} onClick={() => setBgColor(c)}
                        className="w-7 h-7 rounded-lg border-2 transition-all hover:scale-110"
                        style={{ backgroundColor: c, borderColor: bgColor===c ? "#6C3AFF" : "transparent" }} />
                    ))}
                  </div>
                  <div className="rounded-xl overflow-hidden border border-white/10 aspect-video"
                    style={{ backgroundColor: bgColor }}>
                    <img src={resultUrl} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                </>}
              </div>

              {/* Refine */}
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-white">Manual Refinement</span>
                  <button onClick={() => { setShowTools(p => !p); if (!showTools) setTimeout(redrawDisplay, 50); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${showTools ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"}`}>
                    {showTools ? "Hide" : "Show Tools"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 flex-1">Fine-tune AI result with soft eraser and restore brushes for pixel-perfect edges.</p>
                <div className="mt-3 flex gap-3">
                  {[
                    { icon:"👥", label:"People" },
                    { icon:"🛍", label:"Products" },
                    { icon:"🐾", label:"Animals" },
                  ].map(t => (
                    <div key={t.label} className="flex items-center gap-1 text-xs text-gray-500">
                      <span>{t.icon}</span><span>{t.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Refinement panel */}
            {showTools && (
              <div className="bg-[#13131F] border border-[#6C3AFF]/20 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-white text-sm">✏️ Manual Refinement</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-2 block font-semibold">Brush Mode</label>
                    <div className="flex gap-2">
                      {([{id:"erase" as ToolMode,label:"✏️ Eraser"},{id:"restore" as ToolMode,label:"♻️ Restore"}]).map(m => (
                        <button key={m.id} onClick={() => setMode(m.id)}
                          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${mode===m.id ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"}`}>
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2"><label className="text-xs text-gray-500 font-semibold">Brush Size</label><span className="text-xs text-white font-bold">{brushSize}px</span></div>
                    <input type="range" min={4} max={100} value={brushSize} onChange={e => setBrushSize(Number(e.target.value))} className="w-full accent-[#6C3AFF]" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={undo} disabled={!undoStack.length}
                    className="px-4 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 text-xs font-semibold transition-all">
                    ↩ Undo ({undoStack.length})
                  </button>
                  <p className="text-xs text-gray-500 flex items-center flex-1">Click and drag on the canvas to paint</p>
                </div>
                <div className="rounded-xl overflow-hidden" style={{ backgroundImage: "repeating-conic-gradient(#AAAAAA 0% 25%,#EEEEEE 0% 50%) 0 0/16px 16px" }}>
                  <canvas ref={displayRef}
                    style={{ maxWidth:"100%", cursor:"cell", display:"block", margin: "0 auto" }}
                    onMouseDown={() => { pushUndo(); setIsDrawing(true); }}
                    onMouseMove={e => { if (isDrawing) { const p=getPos(e); doPaint(p.x,p.y); } }}
                    onMouseUp={() => { setIsDrawing(false); canvasRef.current?.toBlob(blob => { if (blob) setResultUrl(URL.createObjectURL(blob)); },"image/png"); }}
                    onMouseLeave={() => setIsDrawing(false)} />
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 text-center">
              {[{label:"Width",value:`${imgW}px`},{label:"Height",value:`${imgH}px`},{label:"Export",value:"PNG + Alpha"}].map(s => (
                <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-xl p-3">
                  <div className="text-sm font-bold text-white">{s.value}</div>
                  <div className="text-xs text-gray-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How to Use */}
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-8">
          <h2 className="text-xl font-extrabold text-white mb-6">How to Remove Image Background with AI</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-400">
            {[
              {step:"1",title:"Upload any image",desc:"Drop or click to upload. Works on people, products, animals, cars, logos — any subject against any background."},
              {step:"2",title:"AI processes automatically",desc:"Click Remove Background. The neural network runs in your browser, analyses every pixel and produces a clean transparent result in seconds."},
              {step:"3",title:"Drag the comparison slider",desc:"Drag the slider to reveal the before/after difference. Switch views. Replace the background with any solid color using the color picker."},
              {step:"4",title:"Refine edges & download",desc:"Use manual refinement tools to perfect any edges. Download as PNG to preserve full transparency for Canva, Figma or any design tool."},
            ].map(s => (
              <div key={s.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#6C3AFF]/20 text-[#6C3AFF] border border-[#6C3AFF]/30 flex items-center justify-center font-bold flex-shrink-0">{s.step}</div>
                <div>
                  <div className="font-bold text-white mb-1.5 text-base">{s.title}</div>
                  <div className="leading-relaxed">{s.desc}</div>
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

      <footer className="border-t border-white/5 mt-auto py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/about"   className="hover:text-gray-400 transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
