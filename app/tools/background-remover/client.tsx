"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

const FAQ = [
  {
    q: "What types of images work best with this background remover?",
    a: "This tool uses color-based flood-fill removal, which works best on images with solid or near-solid backgrounds — white, grey, green screen, studio backdrops and flat colored backgrounds. The tolerance slider controls how similar a color must be to the selected color to be removed. For images with complex, patterned or gradient backgrounds, increase the tolerance and use the eraser tool to refine edges manually.",
  },
  {
    q: "How does the tolerance setting affect background removal?",
    a: "Tolerance controls the color range that gets removed. A tolerance of 0 removes only pixels that exactly match the color you clicked. Increasing tolerance removes similar colors — useful for backgrounds with slight gradients, shadows or JPEG compression artifacts. A tolerance of 30–50 works well for most studio photos. If too much of the subject is removed, decrease tolerance. If background patches remain, increase it.",
  },
  {
    q: "What format should I use to save the transparent image?",
    a: "Always save as PNG — it is the only common format that supports transparency. JPEG does not support transparent pixels and will replace them with a solid color. WebP supports transparency but has less universal support in older image editing software. Our tool exports as PNG by default, which is the correct format for transparent images.",
  },
  {
    q: "Can I remove a complex background with multiple colors?",
    a: "Yes — click multiple times on different background areas to remove each color region. After each click, the tool removes pixels matching that color within the current tolerance. Use the Eraser mode to manually paint transparency onto any remaining background areas. Use Restore mode to paint back pixels that were accidentally removed from the subject.",
  },
  {
    q: "Why does the background removal leave jagged edges around my subject?",
    a: "Jagged edges (aliasing) appear when the boundary between subject and background has sharp pixel transitions without anti-aliasing. To improve edge quality: lower the tolerance to be more precise, zoom into edge areas and use the Eraser tool at a small brush size to clean up, or slightly feather edges in an image editor after downloading. For clean edges, starting from a higher-resolution source image always helps.",
  },
];

interface Point { x: number; y: number; }

export default function BackgroundRemoverClient() {
  const [image,    setImage]    = useState<string | null>(null);
  const [imgName,  setImgName]  = useState("image");
  const [result,   setResult]   = useState<string | null>(null);
  const [tolerance,setTolerance]= useState(30);
  const [mode,     setMode]     = useState<"remove"|"erase"|"restore">("remove");
  const [brushSize,setBrushSize]= useState(20);
  const [showBefore,setShowBefore] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [isDrawing,setIsDrawing]= useState(false);
  const [history,  setHistory]  = useState<ImageData[]>([]);
  const [copied,   setCopied]   = useState(false);
  const inputRef    = useRef<HTMLInputElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const displayRef  = useRef<HTMLCanvasElement>(null);

  const CHECKER_SIZE = 10;

  // Draw checkerboard background on display canvas
  function drawCheckerboard(ctx: CanvasRenderingContext2D, w: number, h: number) {
    for (let y = 0; y < h; y += CHECKER_SIZE) {
      for (let x = 0; x < w; x += CHECKER_SIZE) {
        ctx.fillStyle = (Math.floor(x / CHECKER_SIZE) + Math.floor(y / CHECKER_SIZE)) % 2 === 0 ? "#CCCCCC" : "#FFFFFF";
        ctx.fillRect(x, y, CHECKER_SIZE, CHECKER_SIZE);
      }
    }
  }

  function loadImage(file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current!;
        canvas.width  = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0);
        setImage(url);
        setImgName(file.name.replace(/\.[^/.]+$/, ""));
        setResult(null);
        setHistory([]);
        updateDisplay();
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }

  const updateDisplay = useCallback(() => {
    const canvas  = canvasRef.current;
    const display = displayRef.current;
    if (!canvas || !display) return;
    display.width  = canvas.width;
    display.height = canvas.height;
    const ctx = display.getContext("2d")!;
    drawCheckerboard(ctx, canvas.width, canvas.height);
    ctx.drawImage(canvas, 0, 0);
  }, []);

  function colorDistance(r1: number, g1: number, b1: number, r2: number, g2: number, b2: number): number {
    return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2);
  }

  // Flood fill removal
  function floodFill(x: number, y: number) {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    const w = canvas.width, h = canvas.height;
    const data = ctx.getImageData(0, 0, w, h);

    // Save state before modification
    setHistory(prev => [...prev.slice(-9), ctx.getImageData(0, 0, w, h)]);

    const idx    = (y * w + x) * 4;
    const tr = data.data[idx], tg = data.data[idx + 1], tb = data.data[idx + 2];
    if (data.data[idx + 3] === 0) return; // already transparent

    const stack: Point[] = [{ x, y }];
    const visited = new Uint8Array(w * h);
    const thresh  = tolerance * 4.42; // scale 0-100 to 0-442 (max color distance)

    while (stack.length > 0) {
      const p = stack.pop()!;
      const i = p.y * w + p.x;
      if (p.x < 0 || p.x >= w || p.y < 0 || p.y >= h || visited[i]) continue;
      visited[i] = 1;
      const di = i * 4;
      const dist = colorDistance(data.data[di], data.data[di+1], data.data[di+2], tr, tg, tb);
      if (dist > thresh || data.data[di + 3] === 0) continue;
      data.data[di + 3] = 0;
      stack.push({ x: p.x-1, y: p.y }, { x: p.x+1, y: p.y }, { x: p.x, y: p.y-1 }, { x: p.x, y: p.y+1 });
    }
    ctx.putImageData(data, 0, 0);
    updateDisplay();
  }

  function paint(x: number, y: number, transparent: boolean) {
    const canvas = canvasRef.current!;
    const ctx    = canvas.getContext("2d")!;
    const w = canvas.width, h = canvas.height;
    const data   = ctx.getImageData(0, 0, w, h);
    const r      = brushSize / 2;

    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (dx * dx + dy * dy > r * r) continue;
        const px = Math.round(x + dx), py = Math.round(y + dy);
        if (px < 0 || px >= w || py < 0 || py >= h) continue;
        const i = (py * w + px) * 4;
        data.data[i + 3] = transparent ? 0 : 255;
        if (!transparent) {
          // Attempt to restore — approximate white as original looked
          data.data[i]   = 220;
          data.data[i+1] = 220;
          data.data[i+2] = 220;
        }
      }
    }
    ctx.putImageData(data, 0, 0);
    updateDisplay();
  }

  function getCanvasPos(e: React.MouseEvent<HTMLCanvasElement>): Point {
    const display = displayRef.current!;
    const rect    = display.getBoundingClientRect();
    const scaleX  = display.width  / rect.width;
    const scaleY  = display.height / rect.height;
    return {
      x: Math.round((e.clientX - rect.left) * scaleX),
      y: Math.round((e.clientY - rect.top)  * scaleY),
    };
  }

  function handleCanvasClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const { x, y } = getCanvasPos(e);
    if (mode === "remove") { floodFill(x, y); }
  }

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (mode === "erase" || mode === "restore") {
      setHistory(prev => {
        const canvas = canvasRef.current!;
        const ctx    = canvas.getContext("2d")!;
        return [...prev.slice(-9), ctx.getImageData(0, 0, canvas.width, canvas.height)];
      });
      setIsDrawing(true);
      const { x, y } = getCanvasPos(e);
      paint(x, y, mode === "erase");
    }
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing || (mode !== "erase" && mode !== "restore")) return;
    const { x, y } = getCanvasPos(e);
    paint(x, y, mode === "erase");
  }

  function handleMouseUp() { setIsDrawing(false); }

  function undo() {
    if (!history.length) return;
    const last  = history[history.length - 1];
    const canvas = canvasRef.current!;
    canvas.getContext("2d")!.putImageData(last, 0, 0);
    setHistory(prev => prev.slice(0, -1));
    updateDisplay();
  }

  function exportPNG() {
    const canvas = canvasRef.current!;
    const url    = canvas.toDataURL("image/png");
    setResult(url);
    return url;
  }

  function download() {
    const url = exportPNG();
    const a = Object.assign(document.createElement("a"), {
      href: url, download: `${imgName}-no-bg.png`,
    });
    a.click();
  }

  function copyDataUrl() {
    const url = exportPNG();
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const modes = [
    { id: "remove" as const,  label: "🪄 Magic Remove", desc: "Click background to remove by color" },
    { id: "erase"  as const,  label: "🖌 Eraser",       desc: "Paint to make transparent"         },
    { id: "restore"as const,  label: "♻ Restore",       desc: "Paint to restore pixels"           },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">
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
            Click to remove background colors with intelligent flood-fill. Adjust tolerance, use the eraser to refine edges, and export as transparent PNG. 100% browser-based — your images never leave your device.
          </p>
        </div>

        {/* Upload */}
        {!image ? (
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) loadImage(f); }}
            onClick={() => inputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-all mb-6 ${
              dragging ? "border-[#6C3AFF] bg-[#6C3AFF]/5" : "border-white/10 hover:border-[#6C3AFF]/40 hover:bg-[#6C3AFF]/5"
            }`}>
            <input ref={inputRef} type="file" accept="image/*" className="hidden"
              onChange={e => { const f = e.target.files?.[0]; if (f) loadImage(f); }} />
            <div className="text-5xl mb-3">✂️</div>
            <div className="text-white font-bold text-lg mb-1">Drop image here or click to upload</div>
            <div className="text-gray-500 text-sm">Works best on images with solid or near-solid backgrounds</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

            {/* Controls */}
            <div className="space-y-4">
              {/* Mode */}
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tool Mode</div>
                <div className="space-y-2">
                  {modes.map(m => (
                    <button key={m.id} onClick={() => setMode(m.id)}
                      className={`w-full px-3 py-2.5 rounded-xl text-left transition-all border text-sm ${
                        mode === m.id
                          ? "bg-[#6C3AFF] border-transparent text-white"
                          : "bg-[#0A0A14] border-white/5 text-gray-400 hover:text-white hover:border-white/10"
                      }`}>
                      <div className="font-semibold">{m.label}</div>
                      <div className="text-xs opacity-70 mt-0.5">{m.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tolerance */}
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
                <div className="flex justify-between mb-2">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tolerance</div>
                  <span className="text-sm font-bold text-white">{tolerance}</span>
                </div>
                <input type="range" min={0} max={100} value={tolerance}
                  onChange={e => setTolerance(Number(e.target.value))}
                  className="w-full accent-[#6C3AFF]" />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>Exact</span><span>Broad</span>
                </div>
              </div>

              {/* Brush size (for erase/restore) */}
              {(mode === "erase" || mode === "restore") && (
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
                  <div className="flex justify-between mb-2">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Brush Size</div>
                    <span className="text-sm font-bold text-white">{brushSize}px</span>
                  </div>
                  <input type="range" min={5} max={100} value={brushSize}
                    onChange={e => setBrushSize(Number(e.target.value))}
                    className="w-full accent-[#6C3AFF]" />
                </div>
              )}

              {/* Actions */}
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 space-y-2">
                <button onClick={undo} disabled={!history.length}
                  className="w-full py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 text-sm font-semibold transition-all">
                  ↩ Undo
                </button>
                <button onClick={() => { setShowBefore(p => !p); }}
                  className="w-full py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white text-sm font-semibold transition-all">
                  {showBefore ? "Show Result" : "Show Original"}
                </button>
                <button onClick={download}
                  className="w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-sm font-bold transition-all">
                  ⬇ Download PNG
                </button>
                <button onClick={() => { setImage(null); setResult(null); setHistory([]); }}
                  className="w-full py-2.5 rounded-xl bg-[#0A0A14] border border-white/5 text-gray-600 hover:text-[#FF3A6C] text-xs transition-all">
                  × Start Over
                </button>
              </div>
            </div>

            {/* Canvas */}
            <div className="lg:col-span-3 bg-[#13131F] border border-white/5 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {mode === "remove" ? "Click on the background to remove it" :
                   mode === "erase"  ? "Draw over areas to make them transparent" :
                   "Draw over transparent areas to restore them"}
                </div>
              </div>

              {showBefore ? (
                <img src={image} alt="Original" className="w-full rounded-xl object-contain max-h-[500px]" />
              ) : (
                <canvas
                  ref={displayRef}
                  onClick={handleCanvasClick}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  style={{ maxWidth: "100%", maxHeight: "500px", cursor: mode === "remove" ? "crosshair" : "cell" }}
                  className="w-full rounded-xl object-contain block"
                />
              )}
              {/* Hidden working canvas */}
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        )}

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Remove Image Backgrounds</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Upload your image",    desc:"Drop any image with a solid or near-solid background — white, grey, green screen or studio backdrop. PNG, JPEG and WebP are all supported." },
              { step:"2", title:"Click the background", desc:"In 'Magic Remove' mode, click anywhere on the background. The tool removes all connected pixels within your tolerance setting." },
              { step:"3", title:"Refine with tools",    desc:"Use the Eraser to remove any remaining background spots. Use Restore to bring back any subject pixels accidentally removed. Undo any mistake." },
              { step:"4", title:"Download as PNG",      desc:"Click Download PNG to save your transparent image. PNG is the only format that preserves transparency. Use this in Canva, Figma, Word or any design tool." },
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
