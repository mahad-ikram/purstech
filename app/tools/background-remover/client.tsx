"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type ToolMode = "magic" | "erase" | "restore";

interface RGB { r: number; g: number; b: number; }

// ─── FAQ ──────────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: "What types of images work best with this background remover?",
    a: "The tool works best on images with a solid or near-solid background — white studio backdrops, green screens, flat colored backgrounds and product photography. The Magic Remove flood-fill removes all connected pixels of similar color. The tolerance slider controls how aggressively it expands. For complex backgrounds, use the Eraser tool to manually paint transparency.",
  },
  {
    q: "How does the tolerance setting affect background removal?",
    a: "Tolerance controls the color range removed around your click point. At 0, only pixels that exactly match the clicked color are removed. At 50, pixels within a moderate color distance are removed — useful for JPEG-compressed images with subtle color variations. At 80+, broad color ranges are removed. Start at 30 and increase if background patches remain after clicking.",
  },
  {
    q: "What does Edge Feathering do?",
    a: "Edge feathering applies a soft blur to the transparency boundary, making the subject blend more naturally with new backgrounds. Without feathering, the edge of a removed background can look sharp and artificial. A feather value of 1-3 pixels is usually enough for clean results. Higher values create a softer, more blended edge useful for hair and fur.",
  },
  {
    q: "Can I replace the background with a color instead of keeping it transparent?",
    a: "Yes — toggle 'Background Fill' on and pick any color. The removed background area will be filled with your chosen color instead of transparency. This is useful when you need to place a subject on a white or branded background without needing a separate design tool. Download as PNG to preserve the result.",
  },
  {
    q: "Why should I save as PNG instead of JPEG?",
    a: "JPEG does not support transparent pixels — saving a transparent image as JPEG fills all transparent areas with solid white or black. PNG is the only format in common use that fully supports transparency. Always download your background-removed images as PNG. If file size is a concern, WebP also supports transparency and is typically smaller than PNG.",
  },
];

// ─── Color distance ───────────────────────────────────────────────────────────
function colorDist(a: RGB, b: RGB): number {
  return Math.sqrt((a.r - b.r) ** 2 + (a.g - b.g) ** 2 + (a.b - b.b) ** 2);
}

// ─── Flood fill (iterative BFS) ───────────────────────────────────────────────
function floodFill(
  data: Uint8ClampedArray,
  w: number, h: number,
  startX: number, startY: number,
  threshold: number
): Uint8Array {
  const mask = new Uint8Array(w * h); // 1 = to be removed
  const idx  = (startY * w + startX) * 4;
  const seed: RGB = { r: data[idx], g: data[idx + 1], b: data[idx + 2] };

  // already transparent
  if (data[idx + 3] === 0) return mask;

  const queue: number[] = [startY * w + startX];
  const visited = new Uint8Array(w * h);
  const maxDist = (threshold / 100) * 441.67; // scale 0-100 to 0-√(255²×3)

  while (queue.length > 0) {
    const pos = queue.pop()!;
    if (visited[pos]) continue;
    visited[pos] = 1;

    const x = pos % w, y = Math.floor(pos / w);
    const i = pos * 4;

    if (data[i + 3] === 0) { mask[pos] = 1; continue; } // already transparent

    const c: RGB = { r: data[i], g: data[i + 1], b: data[i + 2] };
    if (colorDist(c, seed) > maxDist) continue;

    mask[pos] = 1;

    if (x > 0)     queue.push(pos - 1);
    if (x < w - 1) queue.push(pos + 1);
    if (y > 0)     queue.push(pos - w);
    if (y < h - 1) queue.push(pos + w);
  }
  return mask;
}

// ─── Feather mask edges ───────────────────────────────────────────────────────
function featherMask(
  imageData: ImageData,
  mask: Uint8Array,
  radius: number
): void {
  if (radius === 0) {
    // Just apply hard mask
    for (let i = 0; i < mask.length; i++) {
      if (mask[i]) imageData.data[i * 4 + 3] = 0;
    }
    return;
  }
  const w = imageData.width, h = imageData.height;
  // Build distance field — distance from nearest non-masked pixel
  const dist = new Float32Array(w * h);
  for (let i = 0; i < mask.length; i++) dist[i] = mask[i] ? 0 : radius + 1;

  // Simple distance transform (Manhattan approximation)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (!mask[i]) continue;
      let minD = radius + 1;
      for (let dy = -radius; dy <= radius; dy++) {
        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
          if (!mask[ny * w + nx]) {
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < minD) minD = d;
          }
        }
      }
      dist[i] = minD;
    }
  }

  // Apply alpha based on distance
  for (let i = 0; i < mask.length; i++) {
    if (!mask[i]) continue;
    const d = dist[i];
    const alpha = d > radius ? 0 : Math.round((d / radius) * 255);
    imageData.data[i * 4 + 3] = alpha;
  }
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BackgroundRemoverClient() {
  const [imgSrc,     setImgSrc]     = useState<string | null>(null);
  const [imgName,    setImgName]    = useState("image");
  const [loaded,     setLoaded]     = useState(false);
  const [tolerance,  setTolerance]  = useState(32);
  const [feather,    setFeather]    = useState(1);
  const [brushSize,  setBrushSize]  = useState(24);
  const [mode,       setMode]       = useState<ToolMode>("magic");
  const [bgFill,     setBgFill]     = useState(false);
  const [bgColor,    setBgColor]    = useState("#FFFFFF");
  const [showOrig,   setShowOrig]   = useState(false);
  const [dragging,   setDragging]   = useState(false);
  const [isDrawing,  setIsDrawing]  = useState(false);
  const [undoStack,  setUndoStack]  = useState<ImageData[]>([]);
  const [zoom,       setZoom]       = useState(1);
  const [statusMsg,  setStatusMsg]  = useState("");

  const canvasRef  = useRef<HTMLCanvasElement>(null);  // working canvas (real RGBA data)
  const displayRef = useRef<HTMLCanvasElement>(null);  // visible canvas
  const origRef    = useRef<HTMLCanvasElement>(null);  // original (for show-original toggle)
  const inputRef   = useRef<HTMLInputElement>(null);
  const fileRef    = useRef<File | null>(null);

  // ── Draw display ────────────────────────────────────────────────────────────
  const redraw = useCallback(() => {
    const wc = canvasRef.current;
    const dc = displayRef.current;
    if (!wc || !dc) return;
    const w = wc.width, h = wc.height;
    dc.width  = w;
    dc.height = h;
    const ctx = dc.getContext("2d")!;

    // Checkerboard
    const SZ = 12;
    for (let y = 0; y < h; y += SZ) {
      for (let x = 0; x < w; x += SZ) {
        ctx.fillStyle = (Math.floor(x / SZ) + Math.floor(y / SZ)) % 2 === 0 ? "#CCCCCC" : "#FFFFFF";
        ctx.fillRect(x, y, SZ, SZ);
      }
    }

    if (bgFill) {
      // Fill removed areas with chosen color
      const temp = document.createElement("canvas");
      temp.width = w; temp.height = h;
      const tc = temp.getContext("2d")!;
      tc.fillStyle = bgColor;
      tc.fillRect(0, 0, w, h);
      tc.drawImage(wc, 0, 0);
      ctx.drawImage(temp, 0, 0);
    } else {
      ctx.drawImage(wc, 0, 0);
    }
  }, [bgFill, bgColor]);

  // Re-draw when bgFill/bgColor changes
  useEffect(() => { if (loaded) redraw(); }, [bgFill, bgColor, loaded, redraw]);

  // ── Load image onto canvas ──────────────────────────────────────────────────
  function loadFile(file: File) {
    fileRef.current = file;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      // Give React time to mount canvases
      requestAnimationFrame(() => {
        const wc = canvasRef.current;
        const oc = origRef.current;
        if (!wc || !oc) return;

        // Size canvases to image
        wc.width = oc.width = img.naturalWidth;
        wc.height = oc.height = img.naturalHeight;

        wc.getContext("2d")!.drawImage(img, 0, 0);
        oc.getContext("2d")!.drawImage(img, 0, 0);

        setImgSrc(url);
        setImgName(file.name.replace(/\.[^/.]+$/, ""));
        setLoaded(true);
        setUndoStack([]);
        setZoom(1);
        setStatusMsg("✓ Image loaded — click on the background to remove it");
        setTimeout(() => { redraw(); }, 50);
      });
    };
    img.src = url;
  }

  // ── Undo ────────────────────────────────────────────────────────────────────
  function pushUndo() {
    const wc = canvasRef.current!;
    const snap = wc.getContext("2d")!.getImageData(0, 0, wc.width, wc.height);
    setUndoStack(prev => [...prev.slice(-14), snap]);
  }

  function undo() {
    if (!undoStack.length) return;
    const last = undoStack[undoStack.length - 1];
    canvasRef.current!.getContext("2d")!.putImageData(last, 0, 0);
    setUndoStack(prev => prev.slice(0, -1));
    redraw();
    setStatusMsg("↩ Undo applied");
  }

  // ── Magic remove (flood fill) ───────────────────────────────────────────────
  function doMagicRemove(x: number, y: number) {
    const wc  = canvasRef.current!;
    const ctx = wc.getContext("2d")!;
    const w = wc.width, h = wc.height;
    const imgData = ctx.getImageData(0, 0, w, h);

    pushUndo();
    setStatusMsg("⏳ Processing...");

    // Run in next tick so status updates
    setTimeout(() => {
      const mask = floodFill(imgData.data, w, h, x, y, tolerance);
      featherMask(imgData, mask, feather);
      ctx.putImageData(imgData, 0, 0);
      redraw();
      const removed = Array.from(mask).filter(Boolean).length;
      setStatusMsg(`✓ Removed ${((removed / (w * h)) * 100).toFixed(1)}% of image pixels`);
    }, 10);
  }

  // ── Paint (erase/restore) ───────────────────────────────────────────────────
  function doPaint(x: number, y: number, transparent: boolean) {
    const wc  = canvasRef.current!;
    const ctx = wc.getContext("2d")!;
    const w = wc.width, h = wc.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const r = brushSize / 2;

    // Restore needs original pixel data
    const origCtx = origRef.current?.getContext("2d");
    const origData = origCtx?.getImageData(0, 0, w, h);

    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > r) continue;
        const px = Math.round(x + dx), py = Math.round(y + dy);
        if (px < 0 || px >= w || py < 0 || py >= h) continue;
        const i = (py * w + px) * 4;

        // Soft brush — alpha based on distance from center
        const softAlpha = Math.cos((dist / r) * (Math.PI / 2));

        if (transparent) {
          imgData.data[i + 3] = Math.round(imgData.data[i + 3] * (1 - softAlpha));
        } else if (origData) {
          // Blend back original pixels
          const oi  = i;
          const ta  = Math.round(origData.data[oi + 3] * softAlpha);
          const ca  = imgData.data[i + 3];
          const na  = Math.min(255, ca + ta);
          imgData.data[i]     = origData.data[oi];
          imgData.data[i + 1] = origData.data[oi + 1];
          imgData.data[i + 2] = origData.data[oi + 2];
          imgData.data[i + 3] = na;
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
    redraw();
  }

  // ── Canvas event helpers ────────────────────────────────────────────────────
  function getPos(e: React.MouseEvent<HTMLCanvasElement>): { x: number; y: number } {
    const dc   = displayRef.current!;
    const rect = dc.getBoundingClientRect();
    const scX  = dc.width  / rect.width;
    const scY  = dc.height / rect.height;
    return {
      x: Math.round((e.clientX - rect.left) * scX),
      y: Math.round((e.clientY - rect.top)  * scY),
    };
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    if (mode !== "magic") return;
    const { x, y } = getPos(e);
    doMagicRemove(x, y);
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (mode === "magic") return;
    pushUndo();
    setIsDrawing(true);
    const { x, y } = getPos(e);
    doPaint(x, y, mode === "erase");
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    doPaint(x, y, mode === "erase");
  }

  function handleMouseUp() { setIsDrawing(false); }

  // ── Download / Reset ────────────────────────────────────────────────────────
  function download() {
    const wc = canvasRef.current!;
    let url: string;

    if (bgFill) {
      const tmp = document.createElement("canvas");
      tmp.width = wc.width; tmp.height = wc.height;
      const tc = tmp.getContext("2d")!;
      tc.fillStyle = bgColor;
      tc.fillRect(0, 0, tmp.width, tmp.height);
      tc.drawImage(wc, 0, 0);
      url = tmp.toDataURL("image/png");
    } else {
      url = wc.toDataURL("image/png");
    }

    const a = Object.assign(document.createElement("a"), {
      href: url, download: `${imgName}-no-bg.png`,
    });
    a.click();
  }

  function reset() {
    const wc = canvasRef.current;
    const oc = origRef.current;
    if (!wc || !oc) return;
    wc.getContext("2d")!.drawImage(oc, 0, 0);
    setUndoStack([]);
    redraw();
    setStatusMsg("✓ Image restored to original");
  }

  function startOver() {
    setImgSrc(null);
    setLoaded(false);
    setUndoStack([]);
    setStatusMsg("");
  }

  // ─────────────────────────────────────────────────────────────────────────
  const cursorStyle = mode === "magic" ? "crosshair" : "cell";

  const modes: { id: ToolMode; icon: string; label: string; desc: string }[] = [
    { id: "magic",   icon: "🪄", label: "Magic Remove", desc: "Click background to flood-fill remove"  },
    { id: "erase",   icon: "✏️", label: "Soft Eraser",   desc: "Paint transparency with soft brush"     },
    { id: "restore", icon: "♻️", label: "Restore",       desc: "Paint back original pixels"             },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span>›</span>
          <span className="text-gray-400">Background Remover</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Image Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Background Remover Online — Remove Image Background Instantly
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Click to remove background colors with flood-fill, adjust tolerance and edge feathering, use a soft eraser for fine detail and export as transparent PNG. 100% browser-based — images never leave your device.
          </p>
        </div>

        {/* Hidden canvases — always mounted so refs are stable */}
        <canvas ref={canvasRef} className="hidden" />
        <canvas ref={origRef}   className="hidden" />

        {!loaded ? (
          /* ── Upload screen ── */
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) loadFile(f); }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-20 text-center cursor-pointer transition-all ${
              dragging ? "border-[#6C3AFF] bg-[#6C3AFF]/5 scale-[1.01]" : "border-white/10 hover:border-[#6C3AFF]/40 hover:bg-[#6C3AFF]/5"
            }`}>
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) loadFile(f); }} />
            <div className="text-6xl mb-4">✂️</div>
            <div className="text-white font-bold text-xl mb-2">Drop image here or click to upload</div>
            <div className="text-gray-500 text-sm mb-4">JPEG · PNG · WebP · GIF — any resolution</div>
            <div className="text-xs text-gray-600">Works best on images with solid backgrounds (white, grey, studio backdrop)</div>
          </div>
        ) : (
          /* ── Editor ── */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

            {/* ── Left controls ── */}
            <div className="space-y-3">

              {/* Status */}
              {statusMsg && (
                <div className="bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-xl px-4 py-2.5 text-xs text-[#6C3AFF] font-semibold">
                  {statusMsg}
                </div>
              )}

              {/* Tool mode */}
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tool</div>
                {modes.map(m => (
                  <button key={m.id} onClick={() => setMode(m.id)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-2 last:mb-0 text-left transition-all border ${
                      mode === m.id
                        ? "bg-[#6C3AFF] border-transparent"
                        : "bg-[#0A0A14] border-white/5 hover:border-white/10"
                    }`}>
                    <span className="text-lg flex-shrink-0">{m.icon}</span>
                    <div>
                      <div className={`text-sm font-bold ${mode === m.id ? "text-white" : "text-gray-300"}`}>{m.label}</div>
                      <div className={`text-xs ${mode === m.id ? "text-white/70" : "text-gray-600"}`}>{m.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Tolerance */}
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tolerance</span>
                  <span className="text-sm font-bold text-white">{tolerance}</span>
                </div>
                <input type="range" min={0} max={100} value={tolerance}
                  onChange={e => setTolerance(Number(e.target.value))}
                  className="w-full accent-[#6C3AFF]" />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Exact</span><span>Broad</span>
                </div>
              </div>

              {/* Edge feather */}
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Edge Feather</span>
                  <span className="text-sm font-bold text-white">{feather}px</span>
                </div>
                <input type="range" min={0} max={8} value={feather}
                  onChange={e => setFeather(Number(e.target.value))}
                  className="w-full accent-[#6C3AFF]" />
                <p className="text-xs text-gray-600 mt-1">Softens the removal edge</p>
              </div>

              {/* Brush size */}
              {mode !== "magic" && (
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brush Size</span>
                    <span className="text-sm font-bold text-white">{brushSize}px</span>
                  </div>
                  <input type="range" min={4} max={120} value={brushSize}
                    onChange={e => setBrushSize(Number(e.target.value))}
                    className="w-full accent-[#6C3AFF]" />
                </div>
              )}

              {/* Background fill */}
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Background Fill</span>
                  <button onClick={() => setBgFill(p => !p)}
                    className={`w-10 h-5 rounded-full transition-all relative ${bgFill ? "bg-[#6C3AFF]" : "bg-gray-700"}`}>
                    <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all duration-200 ${bgFill ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>
                {bgFill && (
                  <div className="flex gap-2 items-center">
                    <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                      className="w-10 h-8 rounded-lg border border-white/10 bg-[#0A0A14] cursor-pointer flex-shrink-0" />
                    <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 font-mono" />
                  </div>
                )}
              </div>

              {/* Zoom */}
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Zoom</span>
                  <span className="text-sm font-bold text-white">{Math.round(zoom * 100)}%</span>
                </div>
                <input type="range" min={0.25} max={3} step={0.25} value={zoom}
                  onChange={e => setZoom(Number(e.target.value))}
                  className="w-full accent-[#6C3AFF]" />
              </div>

              {/* Actions */}
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 space-y-2">
                <button onClick={undo} disabled={!undoStack.length}
                  className="w-full py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-sm font-semibold text-gray-400 hover:text-white disabled:opacity-30 transition-all">
                  ↩ Undo ({undoStack.length})
                </button>
                <button onClick={reset}
                  className="w-full py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-sm font-semibold text-gray-400 hover:text-white transition-all">
                  🔄 Reset to Original
                </button>
                <button onClick={download}
                  className="w-full py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-sm font-bold transition-all shadow-lg shadow-violet-900/30">
                  ⬇ Download PNG
                </button>
                <button onClick={startOver}
                  className="w-full py-2 text-xs text-gray-600 hover:text-[#FF3A6C] transition-all">
                  × Start Over
                </button>
              </div>
            </div>

            {/* ── Canvas area ── */}
            <div className="lg:col-span-3 bg-[#13131F] border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="text-xs text-gray-500 font-semibold">
                  {mode === "magic"
                    ? "🪄 Click anywhere on the background to remove it"
                    : mode === "erase"
                    ? "✏️ Click & drag to erase — soft edges included"
                    : "♻️ Click & drag to restore original pixels"}
                </div>
                <button onClick={() => setShowOrig(p => !p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    showOrig
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                  }`}>
                  {showOrig ? "← Result" : "Original →"}
                </button>
              </div>

              {/* Canvas wrapper with overflow scroll at zoom > 1 */}
              <div className="overflow-auto rounded-xl bg-[#0A0A14]" style={{ maxHeight: "600px" }}>
                {showOrig ? (
                  // Show original image
                  imgSrc && (
                    <img
                      src={imgSrc}
                      alt="Original"
                      style={{ transform: `scale(${zoom})`, transformOrigin: "top left", display: "block" }}
                      className="max-w-full"
                    />
                  )
                ) : (
                  // Show working canvas
                  <canvas
                    ref={displayRef}
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: "top left",
                      cursor: cursorStyle,
                      display: "block",
                      maxWidth: "100%",
                    }}
                    onClick={handleClick}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  />
                )}
              </div>

              <p className="text-xs text-gray-600 mt-2 text-center">
                Click multiple times on different background areas · Use Undo to step back
              </p>
            </div>
          </div>
        )}

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Remove Image Backgrounds</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Upload your image",
                desc:"Drop any image with a solid or near-solid background. Solid studio backdrops, white backgrounds and green screens give the best results." },
              { step:"2", title:"Click the background",
                desc:"Select Magic Remove mode and click anywhere on the background. Adjust tolerance if too little or too much is removed. Click multiple times for complex backgrounds." },
              { step:"3", title:"Refine edges",
                desc:"Use Soft Eraser to manually remove any remaining background patches. Use Restore to bring back any subject pixels accidentally removed. Use Undo to step back." },
              { step:"4", title:"Export transparent PNG",
                desc:"Click Download PNG to save with transparent background. Toggle Background Fill to replace transparency with a solid color. PNG preserves full transparency." },
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
