"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";

const PRESETS: Record<string, { label: string; sizes: { name: string; w: number; h: number }[] }> = {
  "Instagram": {
    label: "📸",
    sizes: [
      { name: "Square Post", w: 1080, h: 1080 },
      { name: "Portrait Post", w: 1080, h: 1350 },
      { name: "Landscape Post", w: 1080, h: 566 },
      { name: "Story / Reels", w: 1080, h: 1920 },
      { name: "Profile Picture", w: 320, h: 320 },
    ],
  },
  "Twitter / X": {
    label: "𝕏",
    sizes: [
      { name: "Header Image", w: 1500, h: 500 },
      { name: "Post Image", w: 1200, h: 675 },
      { name: "Profile Picture", w: 400, h: 400 },
    ],
  },
  "Facebook": {
    label: "📘",
    sizes: [
      { name: "Cover Photo", w: 851, h: 315 },
      { name: "Post Image", w: 1200, h: 630 },
      { name: "Profile Picture", w: 180, h: 180 },
      { name: "Event Cover", w: 1920, h: 1080 },
    ],
  },
  "LinkedIn": {
    label: "💼",
    sizes: [
      { name: "Cover Photo", w: 1584, h: 396 },
      { name: "Post Image", w: 1200, h: 627 },
      { name: "Profile Picture", w: 400, h: 400 },
    ],
  },
  "YouTube": {
    label: "▶️",
    sizes: [
      { name: "Thumbnail", w: 1280, h: 720 },
      { name: "Channel Art", w: 2560, h: 1440 },
      { name: "Profile Picture", w: 800, h: 800 },
    ],
  },
  "Web & Print": {
    label: "🖥",
    sizes: [
      { name: "Full HD (1080p)", w: 1920, h: 1080 },
      { name: "4K UHD", w: 3840, h: 2160 },
      { name: "HD (720p)", w: 1280, h: 720 },
      { name: "Open Graph", w: 1200, h: 630 },
      { name: "A4 Portrait 300dpi", w: 2480, h: 3508 },
      { name: "Thumbnail", w: 300, h: 300 },
    ],
  },
};

const FAQ = [
  {
    q: "Does resizing an image reduce its quality?",
    a: "Upscaling an image (making it larger than the original) will reduce quality because the tool must create pixels that don't exist in the source image. Downscaling (making it smaller) generally maintains excellent quality using bicubic interpolation — our resizer uses the browser's high-quality Canvas API scaling. For best results, always start from the highest resolution source image available.",
  },
  {
    q: "What does 'Lock Aspect Ratio' mean?",
    a: "Aspect ratio is the proportional relationship between an image's width and height. When aspect ratio lock is on, changing one dimension automatically adjusts the other to maintain the original proportions. For example, a 1920×1080 image has a 16:9 aspect ratio — if you set the width to 1280, the height automatically becomes 720. This prevents your image from appearing stretched or squashed.",
  },
  {
    q: "What is the difference between Contain, Cover and Stretch fit modes?",
    a: "Contain fits the entire image inside the target dimensions while maintaining aspect ratio, leaving empty space (letterboxing) on the sides or top/bottom. Cover fills the entire target area while maintaining aspect ratio, cropping the parts that don't fit. Stretch fills the exact target dimensions by distorting the image, which can look unnatural. Cover is best for profile pictures and thumbnails; Contain is best for presentations and documents.",
  },
  {
    q: "What is the maximum image size I can resize?",
    a: "There is no enforced file size limit since all processing happens in your browser. However, very large images (above 10MP) may slow down processing on older devices because the browser must hold the full image in memory. For best performance with large images, we recommend using Google Chrome or Firefox on a desktop computer.",
  },
  {
    q: "Can I resize to an exact pixel size for social media?",
    a: "Yes — use our built-in social media presets for perfectly sized images every time. We include precise dimensions for Instagram (square, portrait, story), Twitter/X, Facebook, LinkedIn and YouTube. Click any preset to instantly set the target dimensions, then adjust the fit mode depending on whether you want the image cropped or letterboxed.",
  },
];

type FitMode = "stretch" | "contain" | "cover";

export default function ImageResizerClient() {
  const [original, setOriginal]   = useState<string | null>(null);
  const [origW,    setOrigW]      = useState(0);
  const [origH,    setOrigH]      = useState(0);
  const [origName, setOrigName]   = useState("image");
  const [width,    setWidth]      = useState(800);
  const [height,   setHeight]     = useState(600);
  const [lockAR,   setLockAR]     = useState(true);
  const [fitMode,  setFitMode]    = useState<FitMode>("cover");
  const [format,   setFormat]     = useState<"jpeg"|"png"|"webp">("jpeg");
  const [quality,  setQuality]    = useState(90);
  const [result,   setResult]     = useState<string | null>(null);
  const [bgColor,  setBgColor]    = useState("#FFFFFF");
  const [dragging, setDragging]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const arRef    = useRef(1);

  function loadImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        setOriginal(url); setOrigW(img.width); setOrigH(img.height);
        setOrigName(file.name.replace(/\.[^/.]+$/, ""));
        arRef.current = img.width / img.height;
        setWidth(img.width); setHeight(img.height);
        setResult(null);
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  }

  function onWidthChange(v: number) {
    setWidth(v);
    if (lockAR) setHeight(Math.round(v / arRef.current));
  }
  function onHeightChange(v: number) {
    setHeight(v);
    if (lockAR) setWidth(Math.round(v * arRef.current));
  }

  function applyPreset(w: number, h: number) {
    setWidth(w); setHeight(h);
    setLockAR(false);
    setResult(null);
  }

  const resize = useCallback(() => {
    if (!original) return;
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width  = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;

      ctx.fillStyle = format === "jpeg" ? "#FFFFFF" : bgColor;
      ctx.fillRect(0, 0, width, height);

      if (fitMode === "stretch") {
        ctx.drawImage(img, 0, 0, width, height);
      } else {
        const iAR = img.width / img.height;
        const tAR = width / height;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;
        let dx = 0, dy = 0, dw = width, dh = height;

        if (fitMode === "cover") {
          if (iAR > tAR) { sw = img.height * tAR; sx = (img.width - sw) / 2; }
          else           { sh = img.width / tAR;  sy = (img.height - sh) / 2; }
        } else { // contain
          if (iAR > tAR) { dh = width / iAR;  dy = (height - dh) / 2; }
          else           { dw = height * iAR; dx = (width - dw)  / 2; }
        }
        ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
      }

      const mime = format === "png" ? "image/png" : format === "webp" ? "image/webp" : "image/jpeg";
      setResult(canvas.toDataURL(mime, quality / 100));
    };
    img.src = original;
  }, [original, width, height, fitMode, format, quality, bgColor]);

  function download() {
    if (!result) return;
    const a = Object.assign(document.createElement("a"), {
      href: result, download: `${origName}-${width}x${height}.${format}`,
    });
    a.click();
  }

  const fileSizeEstimate = result
    ? Math.round((result.split(",")[1].length * 3) / 4)
    : null;

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
          <span className="text-gray-400">Image Resizer</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Image Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Image Resizer Online — Resize Images to Any Dimension Instantly
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Resize images with social media presets, aspect ratio lock and three fit modes. Output to JPEG, PNG or WebP. 100% browser-based — your images never leave your device.
          </p>
        </div>

        {/* Upload */}
        {!original ? (
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
            <div className="text-5xl mb-3">📐</div>
            <div className="text-white font-bold text-lg mb-1">Drop an image here or click to upload</div>
            <div className="text-gray-500 text-sm">JPEG · PNG · WebP · GIF · Any size</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Controls */}
            <div className="lg:col-span-2 space-y-4">

              {/* Original info */}
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Original Image</div>
                <div className="text-sm text-white font-medium truncate">{origName}</div>
                <div className="text-xs text-gray-500 mt-1">{origW} × {origH} px</div>
                <button onClick={() => { setOriginal(null); setResult(null); }}
                  className="mt-2 text-xs text-gray-600 hover:text-[#FF3A6C] transition-colors">× Change image</button>
              </div>

              {/* Social media presets */}
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Social Media Presets</div>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {Object.entries(PRESETS).map(([platform, data]) => (
                    <div key={platform}>
                      <div className="text-xs text-gray-600 mb-1 font-semibold">{data.label} {platform}</div>
                      <div className="space-y-1">
                        {data.sizes.map(s => (
                          <button key={s.name} onClick={() => applyPreset(s.w, s.h)}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#0A0A14] hover:bg-[#6C3AFF]/10 hover:border-[#6C3AFF]/30 border border-white/5 transition-all text-left group">
                            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">{s.name}</span>
                            <span className="text-xs text-gray-600 font-mono">{s.w}×{s.h}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom size */}
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 space-y-3">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">Custom Size</div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Width (px)</label>
                    <input type="number" value={width} min={1} max={10000}
                      onChange={e => onWidthChange(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Height (px)</label>
                    <input type="number" value={height} min={1} max={10000}
                      onChange={e => onHeightChange(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">Lock aspect ratio</span>
                  <button onClick={() => setLockAR(p => !p)}
                    className={`w-10 h-5 rounded-full transition-all relative ${lockAR ? "bg-[#6C3AFF]" : "bg-gray-700"}`}>
                    <div className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all ${lockAR ? "left-[22px]" : "left-0.5"}`} />
                  </button>
                </div>

                <div>
                  <div className="text-xs text-gray-500 mb-2">Fit Mode</div>
                  <div className="grid grid-cols-3 gap-1">
                    {(["cover","contain","stretch"] as FitMode[]).map(m => (
                      <button key={m} onClick={() => setFitMode(m)}
                        className={`py-2 rounded-lg text-xs font-semibold transition-all border ${
                          fitMode === m ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                        }`}>
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 mt-1.5">
                    {fitMode === "cover"   ? "Fill canvas — crops edges to fit" :
                     fitMode === "contain" ? "Fit inside — letterboxes empty space" :
                     "Stretch to exact dimensions"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Format</label>
                    <select value={format} onChange={e => setFormat(e.target.value as typeof format)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none transition-all">
                      <option value="jpeg">JPEG</option>
                      <option value="png">PNG</option>
                      <option value="webp">WebP</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Quality: {quality}%</label>
                    <input type="range" min={1} max={100} value={quality}
                      onChange={e => setQuality(Number(e.target.value))}
                      className="w-full mt-2 accent-[#6C3AFF]" />
                  </div>
                </div>

                {fitMode === "contain" && format !== "png" && (
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Background Color</label>
                    <div className="flex gap-2 items-center">
                      <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
                        className="w-10 h-8 rounded-lg border border-white/10 bg-[#0A0A14] cursor-pointer" />
                      <input type="text" value={bgColor} onChange={e => setBgColor(e.target.value)}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all font-mono" />
                    </div>
                  </div>
                )}

                <button onClick={resize}
                  className="w-full py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white font-bold transition-all shadow-lg shadow-violet-900/30">
                  ✨ Resize Image
                </button>
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Preview</div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-gray-500 text-center mb-2">Original · {origW}×{origH}</div>
                    <div className="bg-[#0A0A14] rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                      <img src={original!} alt="Original" className="max-w-full max-h-full object-contain" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-green-400 text-center mb-2">
                      Resized · {width}×{height}
                      {fileSizeEstimate && ` · ~${Math.round(fileSizeEstimate/1024)}KB`}
                    </div>
                    <div className="bg-[#0A0A14] rounded-xl overflow-hidden aspect-video flex items-center justify-center">
                      {result
                        ? <img src={result} alt="Resized" className="max-w-full max-h-full object-contain" />
                        : <div className="text-gray-600 text-xs text-center px-4">Click "Resize Image" to generate preview</div>
                      }
                    </div>
                  </div>
                </div>

                {result && (
                  <button onClick={download}
                    className="w-full mt-4 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold transition-all text-sm">
                    ⬇ Download {width}×{height} {format.toUpperCase()}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Resize Images Online</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Upload your image", desc:"Drop any image onto the page or click to browse. Supports JPEG, PNG, WebP and GIF from any device." },
              { step:"2", title:"Choose a size", desc:"Pick from 20+ social media presets for perfect platform dimensions, or enter custom width and height values." },
              { step:"3", title:"Select fit mode & format", desc:"Choose Cover (crops to fill), Contain (letterboxes) or Stretch. Set output format and quality." },
              { step:"4", title:"Resize & download", desc:"Click Resize Image to generate the preview. Download your resized image in your chosen format immediately." },
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
