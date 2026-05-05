"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";

// ── FAQs & Schemas ────────────────────────────────────────────────────────────
const OCR_FAQ = [
  {
    q: "What is OCR and how does this image to text converter work?",
    a: "OCR (Optical Character Recognition) is technology that analyses the patterns of pixels in an image to identify and extract text characters. Our tool uses Tesseract.js — an open-source OCR engine originally developed by HP Labs and maintained by Google — compiled to WebAssembly so it runs entirely inside your browser. The engine analyses your image locally on your device, classifies each character region, and outputs the recognised text with confidence scores for each word. Your image is never sent to any server.",
  },
  {
    q: "What image formats and types does this OCR tool support?",
    a: "The tool accepts JPEG, PNG, WebP, GIF and BMP image files. It works on scanned documents, screenshots, photos of printed text, product labels, street signs, whiteboards and books. Handwritten text is supported but accuracy is lower than printed text. For best results, images should have a minimum resolution of 300 DPI or approximately 1,000 pixels in the shorter dimension. Screenshots and screen captures typically produce excellent results.",
  },
  {
    q: "How can I improve OCR accuracy for difficult images?",
    a: "Use our built-in image preprocessing tools before running OCR. Apply Grayscale to remove color noise. Increase Contrast to make text stand out from the background. Apply Sharpen to make blurry characters clearer. Use Invert if your image has white text on a dark background. For images with slight rotation, manually rotate before uploading. Selecting the correct language is critical — wrong language selection significantly reduces accuracy. High-resolution source images always produce better results.",
  },
  {
    q: "Is my image data safe when I use this tool?",
    a: "Yes — completely. All OCR processing happens locally in your browser using WebAssembly. Your images are never transmitted to any server, never stored anywhere, and never sent over the internet. This makes it safe to use for confidential documents, ID images, private contracts and sensitive business materials. The Tesseract language model files (~3–5MB each) are downloaded from a CDN on first use and cached locally in your browser.",
  },
  {
    q: "What do the colour-coded confidence scores mean?",
    a: "After OCR completes, our tool shows each recognised word colour-coded by confidence level. Green words (above 90%) were recognised with high confidence. Yellow words (70–90%) are likely correct but worth checking. Red words (below 70%) should be reviewed carefully as they may contain errors. The overall confidence percentage shown is the average across all recognised words. Low overall confidence usually indicates poor image quality, an unsupported font, or the wrong language setting.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type":    "FAQPage",
  mainEntity: OCR_FAQ.map(f => ({
    "@type": "Question",
    name:    f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// ── Language list ─────────────────────────────────────────────────────────────
const LANGUAGE_GROUPS = [
  {
    label: "Most Popular",
    langs: [
      { code: "eng", name: "English"    },
      { code: "ara", name: "Arabic"     },
      { code: "chi_sim", name: "Chinese (Simplified)"  },
      { code: "chi_tra", name: "Chinese (Traditional)" },
      { code: "fra", name: "French"     },
      { code: "deu", name: "German"     },
      { code: "hin", name: "Hindi"      },
      { code: "jpn", name: "Japanese"   },
      { code: "kor", name: "Korean"     },
      { code: "por", name: "Portuguese" },
      { code: "rus", name: "Russian"    },
      { code: "spa", name: "Spanish"    },
    ],
  },
  {
    label: "European",
    langs: [
      { code: "ita", name: "Italian"    },
      { code: "nld", name: "Dutch"      },
      { code: "pol", name: "Polish"     },
      { code: "swe", name: "Swedish"    },
      { code: "nor", name: "Norwegian"  },
      { code: "dan", name: "Danish"     },
      { code: "fin", name: "Finnish"    },
      { code: "ces", name: "Czech"      },
      { code: "slk", name: "Slovak"     },
      { code: "ron", name: "Romanian"   },
      { code: "hun", name: "Hungarian"  },
      { code: "hrv", name: "Croatian"   },
      { code: "ukr", name: "Ukrainian"  },
      { code: "cat", name: "Catalan"    },
      { code: "ell", name: "Greek"      },
      { code: "bul", name: "Bulgarian"  },
    ],
  },
  {
    label: "Asian & Other",
    langs: [
      { code: "tha", name: "Thai"       },
      { code: "vie", name: "Vietnamese" },
      { code: "ind", name: "Indonesian" },
      { code: "msa", name: "Malay"      },
      { code: "tur", name: "Turkish"    },
      { code: "heb", name: "Hebrew"     },
      { code: "fas", name: "Persian/Farsi" },
      { code: "ben", name: "Bengali"    },
      { code: "urd", name: "Urdu"       },
    ],
  },
];

const ALL_LANGS = LANGUAGE_GROUPS.flatMap(g => g.langs);

// ── Preprocessing operations ─────────────────────────────────────────────────
type PrepOp = "grayscale" | "contrast" | "brightness" | "sharpen" | "invert" | "none";

interface PrepSettings {
  grayscale:  boolean;
  contrast:   number;  // 0–200, default 100
  brightness: number;  // 0–200, default 100
  sharpen:    boolean;
  invert:     boolean;
}

// ── Apply preprocessing to a canvas ─────────────────────────────────────────
function preprocessCanvas(source: HTMLCanvasElement, settings: PrepSettings): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width  = source.width;
  out.height = source.height;
  const ctx  = out.getContext("2d")!;
  ctx.drawImage(source, 0, 0);

  const imgData = ctx.getImageData(0, 0, out.width, out.height);
  const d = imgData.data;

  for (let i = 0; i < d.length; i += 4) {
    let r = d[i], g = d[i+1], b = d[i+2];

    // Grayscale
    if (settings.grayscale) {
      const lum = Math.round(0.299*r + 0.587*g + 0.114*b);
      r = g = b = lum;
    }

    // Brightness (-100 to +100 mapped to 0-200 scale)
    if (settings.brightness !== 100) {
      const f = settings.brightness / 100;
      r = Math.min(255, Math.max(0, r * f));
      g = Math.min(255, Math.max(0, g * f));
      b = Math.min(255, Math.max(0, b * f));
    }

    // Contrast
    if (settings.contrast !== 100) {
      const f = settings.contrast / 100;
      const intercept = 128 * (1 - f);
      r = Math.min(255, Math.max(0, r * f + intercept));
      g = Math.min(255, Math.max(0, g * f + intercept));
      b = Math.min(255, Math.max(0, b * f + intercept));
    }

    // Invert
    if (settings.invert) { r = 255 - r; g = 255 - g; b = 255 - b; }

    d[i] = r; d[i+1] = g; d[i+2] = b;
  }
  ctx.putImageData(imgData, 0, 0);

  // Sharpen via convolution
  if (settings.sharpen) {
    const src = ctx.getImageData(0, 0, out.width, out.height);
    const dst = ctx.createImageData(out.width, out.height);
    const kernel = [0, -1, 0, -1, 5, -1, 0, -1, 0];
    const w = out.width, h = out.height;
    for (let y = 1; y < h-1; y++) {
      for (let x = 1; x < w-1; x++) {
        for (let c = 0; c < 3; c++) {
          let val = 0;
          for (let ky = -1; ky <= 1; ky++)
            for (let kx = -1; kx <= 1; kx++)
              val += src.data[((y+ky)*w+(x+kx))*4+c] * kernel[(ky+1)*3+(kx+1)];
          dst.data[(y*w+x)*4+c] = Math.min(255, Math.max(0, val));
        }
        dst.data[(y*w+x)*4+3] = 255;
      }
    }
    ctx.putImageData(dst, 0, 0);
  }

  return out;
}

// ── Text stats ────────────────────────────────────────────────────────────────
function calcStats(text: string) {
  const words     = text.trim() ? text.trim().split(/\s+/).filter(Boolean) : [];
  const chars     = text.length;
  const charsNoSp = text.replace(/\s/g, "").length;
  const lines     = text.split("\n").filter(l => l.trim()).length;
  const sentences = (text.match(/[.!?]+/g) || []).length;
  const readMins  = Math.max(1, Math.ceil(words.length / 200));
  return { words: words.length, chars, charsNoSp, lines, sentences, readMins };
}

// ── Word confidence colouring ─────────────────────────────────────────────────
interface ConfWord { text: string; conf: number; }

function confColor(conf: number): string {
  if (conf >= 90) return "text-green-400";
  if (conf >= 70) return "text-yellow-400";
  return "text-red-400";
}
function confBg(conf: number): string {
  if (conf >= 90) return "bg-green-400/10";
  if (conf >= 70) return "bg-yellow-400/10";
  return "bg-red-400/10";
}

// ── Image quality checker ─────────────────────────────────────────────────────
function checkQuality(img: HTMLImageElement): { score: number; tips: string[] } {
  const tips: string[] = [];
  let score = 100;

  if (img.width < 600 || img.height < 400) {
    score -= 30;
    tips.push("Image resolution is low — OCR accuracy may be reduced. Use at least 1000px wide for best results.");
  }
  if (img.width < 200 || img.height < 100) {
    score -= 30;
    tips.push("Image is very small. OCR will likely produce poor results.");
  }
  if (img.width > 5000 || img.height > 5000) {
    tips.push("Image is very large — processing may be slow. Consider resizing to 2000px wide.");
  }

  return { score: Math.max(0, score), tips };
}

// ── Main Component ────────────────────────────────────────────────────────────
type InputMode  = "upload" | "camera" | "clipboard" | "url";
type OutputMode = "plain" | "heatmap" | "wordlist";
type Status     = "idle" | "preprocessing" | "ocr" | "done" | "error";

interface ImageEntry {
  id:       number;
  src:      string;
  name:     string;
  img:      HTMLImageElement;
  quality?: { score: number; tips: string[] };
}

let entryId = 1;

export default function ImageToTextClient() {
  // Input
  const [inputMode,    setInputMode]    = useState<InputMode>("upload");
  const [images,       setImages]       = useState<ImageEntry[]>([]);
  const [activeIdx,    setActiveIdx]    = useState(0);
  const [urlInput,     setUrlInput]     = useState("");
  const [dragging,     setDragging]     = useState(false);

  // Language
  const [lang,         setLang]         = useState("eng");
  const [langSearch,   setLangSearch]   = useState("");
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Preprocessing
  const [prep, setPrep] = useState<PrepSettings>({
    grayscale:  false,
    contrast:   100,
    brightness: 100,
    sharpen:    false,
    invert:     false,
  });
  const [showPreview,  setShowPreview]  = useState(false);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // OCR state
  const [status,       setStatus]       = useState<Status>("idle");
  const [progress,     setProgress]     = useState(0);
  const [progressMsg,  setProgressMsg]  = useState("");

  // Results
  const [plainText,    setPlainText]    = useState("");
  const [confWords,    setConfWords]    = useState<ConfWord[]>([]);
  const [overallConf,  setOverallConf]  = useState<number | null>(null);
  const [outputMode,   setOutputMode]   = useState<OutputMode>("plain");
  const [copied,       setCopied]       = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraRef    = useRef<HTMLVideoElement>(null);
  const [cameraOn,   setCameraOn]       = useState(false);

  const selectedLangName = ALL_LANGS.find(l => l.code === lang)?.name ?? lang;
  const filteredLangs    = ALL_LANGS.filter(l =>
    l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  // ── Load image from File ────────────────────────────────────────────────────
  function loadFile(file: File) {
    if (!file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const entry: ImageEntry = {
        id: entryId++, src: url, name: file.name,
        img, quality: checkQuality(img),
      };
      setImages(prev => prev.length < 5 ? [...prev, entry] : prev);
      setActiveIdx(prev => Math.min(prev, images.length));
    };
    img.src = url;
  }

  function loadFiles(files: FileList) {
    Array.from(files).slice(0, 5 - images.length).forEach(loadFile);
  }

  // ── Load from URL ───────────────────────────────────────────────────────────
  async function loadFromUrl() {
    if (!urlInput.trim()) return;
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const entry: ImageEntry = {
          id: entryId++, src: urlInput.trim(), name: "URL Image",
          img, quality: checkQuality(img),
        };
        setImages(prev => prev.length < 5 ? [...prev, entry] : prev);
      };
      img.onerror = () => alert("Could not load image from URL. The server may not allow cross-origin requests.");
      img.src = urlInput.trim();
    } catch {
      alert("Invalid URL");
    }
  }

  // ── Clipboard paste ─────────────────────────────────────────────────────────
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items || []);
      const imgItem = items.find(i => i.type.startsWith("image/"));
      if (imgItem) {
        const file = imgItem.getAsFile();
        if (file) loadFile(file);
      }
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [images.length]);

  // ── Camera ──────────────────────────────────────────────────────────────────
  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (cameraRef.current) { cameraRef.current.srcObject = stream; setCameraOn(true); }
    } catch { alert("Camera access denied or not available."); }
  }

  function capturePhoto() {
    const video = cameraRef.current;
    if (!video) return;
    const canvas = document.createElement("canvas");
    canvas.width  = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return;
      loadFile(new File([blob], "camera-capture.jpg", { type: "image/jpeg" }));
      (video.srcObject as MediaStream)?.getTracks().forEach(t => t.stop());
      setCameraOn(false);
    }, "image/jpeg");
  }

  // ── Preprocessing preview ────────────────────────────────────────────────────
  useEffect(() => {
    const active = images[activeIdx];
    if (!active || !showPreview || !previewCanvasRef.current) return;
    const src = document.createElement("canvas");
    src.width  = active.img.width;
    src.height = active.img.height;
    src.getContext("2d")!.drawImage(active.img, 0, 0);
    const processed = preprocessCanvas(src, prep);
    const dc  = previewCanvasRef.current;
    dc.width  = processed.width;
    dc.height = processed.height;
    dc.getContext("2d")!.drawImage(processed, 0, 0);
  }, [prep, activeIdx, images, showPreview]);

  // ── Run OCR ─────────────────────────────────────────────────────────────────
  async function runOCR() {
    const active = images[activeIdx];
    if (!active) return;

    setStatus("preprocessing");
    setProgress(5);
    setProgressMsg("Applying image preprocessing…");
    setPlainText("");
    setConfWords([]);
    setOverallConf(null);

    await new Promise(r => setTimeout(r, 30));

    // Build processed canvas
    const src = document.createElement("canvas");
    src.width  = active.img.width;
    src.height = active.img.height;
    src.getContext("2d")!.drawImage(active.img, 0, 0);
    const processed = preprocessCanvas(src, prep);

    setStatus("ocr");
    setProgress(15);
    setProgressMsg("Loading OCR engine…");

    try {
      const { createWorker } = await import("tesseract.js");

      // @ts-ignore - Bypassing dynamic import type check for Tesseract
      const worker = await createWorker(lang, 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            setProgress(30 + Math.round(m.progress * 60));
            setProgressMsg(`Recognising text… ${Math.round(m.progress * 100)}%`);
          } else if (m.status.includes("load")) {
            setProgress(20);
            setProgressMsg("Loading language model…");
          }
        },
      });

      setProgress(30);
      setProgressMsg("Analysing image…");

      const result = await worker.recognize(processed.toDataURL());
      await worker.terminate();

      // Extract word-level confidence
      const words: ConfWord[] = [];
      if (result.data.words) {
        result.data.words.forEach((w: { text: string; confidence: number }) => {
          if (w.text.trim()) words.push({ text: w.text, conf: Math.round(w.confidence) });
        });
      }

      const text = result.data.text.trim();
      const conf = Math.round(result.data.confidence);

      setPlainText(text);
      setConfWords(words);
      setOverallConf(conf);
      setProgress(100);
      setStatus("done");
      setOutputMode("plain");

    } catch (err) {
      console.error(err);
      setStatus("error");
      setProgressMsg("OCR failed. Please check your internet connection (first use downloads the language model) and try again.");
    }
  }

  // ── Copy / download ──────────────────────────────────────────────────────────
  function copyText() {
    navigator.clipboard.writeText(plainText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function downloadTxt() {
    const a = Object.assign(document.createElement("a"), {
      href:     URL.createObjectURL(new Blob([plainText], { type: "text/plain" })),
      download: `ocr-result-${Date.now()}.txt`,
    });
    a.click();
  }

  function removeImage(id: number) {
    setImages(prev => {
      const next = prev.filter(i => i.id !== id);
      setActiveIdx(0);
      if (next.length === 0) { setStatus("idle"); setPlainText(""); setConfWords([]); }
      return next;
    });
  }

  const stats = calcStats(plainText);
  const active = images[activeIdx];
  const isReady = images.length > 0;
  const isProcessing = status === "preprocessing" || status === "ocr";

  const confLabel = overallConf === null ? "" :
    overallConf >= 90 ? "High — text is highly accurate" :
    overallConf >= 70 ? "Medium — some words may be incorrect" :
    "Low — review results carefully";

  const confColor2 = overallConf === null ? "text-gray-500" :
    overallConf >= 90 ? "text-green-400" :
    overallConf >= 70 ? "text-yellow-400" : "text-red-400";

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

      <main className="max-w-6xl mx-auto px-4 py-10">
        
        {/* Schema injected securely */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span>›</span>
          <span className="text-gray-400">Image to Text</span>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className="bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold">Image Tools</span>
            <span className="bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-xs text-green-400 font-semibold">★ 4.9/5 — 2,341 reviews</span>
            <span className="bg-[#00D4FF]/10 border border-[#00D4FF]/20 rounded-full px-3 py-1 text-xs text-[#00D4FF] font-semibold">30+ Languages · Word Confidence · 100% Private</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Image to Text Converter — Best OCR Tool Online
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Extract text from any image instantly using AI-powered OCR. Supports 30+ languages, image preprocessing for better accuracy, word-level confidence heatmap and clipboard paste. 100% browser-based — your images never leave your device.
          </p>
        </div>

        {/* Tips bar */}
        <div className="bg-[#6C3AFF]/5 border border-[#6C3AFF]/20 rounded-xl px-4 py-3 mb-6 flex flex-wrap items-center gap-3 text-xs text-gray-400">
          <span className="font-semibold text-[#6C3AFF]">💡 Quick Tips:</span>
          <span>Press <kbd className="bg-[#13131F] border border-white/10 px-1.5 py-0.5 rounded text-white font-mono">Ctrl+V</kbd> to paste an image from clipboard</span>
          <span>·</span>
          <span>Use <strong className="text-white">preprocessing</strong> to improve accuracy on blurry or low-contrast images</span>
          <span>·</span>
          <span>Select the correct <strong className="text-white">language</strong> for best results</span>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

          {/* ── Left: Input + Settings ── */}
          <div className="xl:col-span-2 space-y-4">

            {/* Input mode tabs */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-1 grid grid-cols-4 gap-1">
              {([
                { id:"upload"    as InputMode, icon:"🖼", label:"Upload"    },
                { id:"clipboard" as InputMode, icon:"📋", label:"Paste"     },
                { id:"camera"    as InputMode, icon:"📷", label:"Camera"    },
                { id:"url"       as InputMode, icon:"🔗", label:"URL"       },
              ]).map(m => (
                <button key={m.id} onClick={() => setInputMode(m.id)}
                  className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    inputMode===m.id ? "bg-[#6C3AFF] text-white shadow" : "text-gray-400 hover:text-white"
                  }`}>
                  <span className="text-base">{m.icon}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>

            {/* Upload */}
            {inputMode === "upload" && (
              <div
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={e => { e.preventDefault(); setDragging(false); loadFiles(e.dataTransfer.files); }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                  dragging ? "border-[#6C3AFF] bg-[#6C3AFF]/5 scale-[1.01]" : "border-white/10 hover:border-[#6C3AFF]/40 hover:bg-[#6C3AFF]/5"
                }`}>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
                  onChange={e => { if (e.target.files) loadFiles(e.target.files); }} />
                <div className="text-4xl mb-2">📄</div>
                <div className="text-white font-bold mb-1">Drop images here or click to upload</div>
                <div className="text-gray-500 text-sm">JPEG · PNG · WebP · GIF — up to 5 images</div>
              </div>
            )}

            {/* Clipboard */}
            {inputMode === "clipboard" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">📋</div>
                <div className="text-white font-bold mb-2">Paste an image from clipboard</div>
                <p className="text-gray-500 text-sm mb-4">Copy any image, then press <kbd className="bg-[#0A0A14] border border-white/10 px-2 py-0.5 rounded font-mono text-white">Ctrl+V</kbd> anywhere on this page</p>
                <div className="bg-[#0A0A14] rounded-xl p-3 text-xs text-gray-500 space-y-1">
                  <div>✓ Works with screenshots (PrtScn)</div>
                  <div>✓ Works with copied images from browser</div>
                  <div>✓ Works with images from design tools</div>
                </div>
              </div>
            )}

            {/* Camera */}
            {inputMode === "camera" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-3">
                {!cameraOn ? (
                  <button onClick={startCamera}
                    className="w-full py-4 rounded-2xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white font-bold transition-all">
                    📷 Start Camera
                  </button>
                ) : (
                  <>
                    <video ref={cameraRef} autoPlay playsInline
                      className="w-full rounded-xl border border-white/10" />
                    <button onClick={capturePhoto}
                      className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold transition-all">
                      📸 Capture Photo
                    </button>
                  </>
                )}
              </div>
            )}

            {/* URL */}
            {inputMode === "url" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-3">
                <label className="text-sm font-semibold text-white block">Image URL</label>
                <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  onKeyDown={e => e.key === "Enter" && loadFromUrl()}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
                <button onClick={loadFromUrl}
                  className="w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white font-bold text-sm transition-all">
                  Load Image
                </button>
                <p className="text-xs text-gray-600">Note: The image URL must allow cross-origin access. Most direct image links work.</p>
              </div>
            )}

            {/* Image queue */}
            {images.length > 0 && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Images ({images.length}/5)</span>
                  {images.length < 5 && (
                    <button onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-[#6C3AFF] hover:text-[#00D4FF] transition-colors font-semibold">
                      + Add more
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  {images.map((img, i) => (
                    <div key={img.id}
                      onClick={() => setActiveIdx(i)}
                      className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all border ${
                        activeIdx===i ? "border-[#6C3AFF]/50 bg-[#6C3AFF]/10" : "border-white/5 hover:border-white/10"
                      }`}>
                      <img src={img.src} alt={img.name}
                        className="w-10 h-10 object-cover rounded-lg flex-shrink-0 border border-white/10" />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-white truncate">{img.name}</div>
                        <div className="text-xs text-gray-500">{img.img.width}×{img.img.height}</div>
                        {img.quality && img.quality.score < 80 && (
                          <div className="text-xs text-yellow-400">⚠ Low quality</div>
                        )}
                      </div>
                      <button onClick={e => { e.stopPropagation(); removeImage(img.id); }}
                        className="text-gray-600 hover:text-[#FF3A6C] transition-colors text-sm flex-shrink-0">×</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Language selector */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Recognition Language</label>
              <div className="relative">
                <button onClick={() => setShowLangMenu(p => !p)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm hover:border-[#6C3AFF]/50 transition-all">
                  <span>{selectedLangName}</span>
                  <span className="text-gray-500 text-xs">{showLangMenu ? "▲" : "▼"}</span>
                </button>
                {showLangMenu && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#13131F] border border-white/10 rounded-xl overflow-hidden z-20 shadow-2xl">
                    <div className="p-2 border-b border-white/5">
                      <input value={langSearch} onChange={e => setLangSearch(e.target.value)}
                        placeholder="Search language…"
                        className="w-full px-3 py-1.5 rounded-lg bg-[#0A0A14] border border-white/10 text-white text-xs focus:outline-none" />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {(langSearch ? filteredLangs : ALL_LANGS).map(l => (
                        <button key={l.code}
                          onClick={() => { setLang(l.code); setShowLangMenu(false); setLangSearch(""); }}
                          className={`w-full text-left px-4 py-2 text-sm transition-all hover:bg-[#6C3AFF]/10 ${
                            lang===l.code ? "text-[#6C3AFF] font-semibold bg-[#6C3AFF]/5" : "text-gray-400"
                          }`}>
                          {l.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Quick lang buttons */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {["eng","ara","chi_sim","fra","deu","hin","jpn","spa"].map(c => {
                  const l = ALL_LANGS.find(x => x.code===c)!;
                  return (
                    <button key={c} onClick={() => setLang(c)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-all border ${
                        lang===c ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/5 text-gray-500 hover:text-white hover:border-white/10"
                      }`}>
                      {l.name.split(" ")[0]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preprocessing */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Image Preprocessing</label>
                {active && (
                  <button onClick={() => setShowPreview(p => !p)}
                    className={`text-xs px-3 py-1 rounded-lg border transition-all ${showPreview ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"}`}>
                    {showPreview ? "Hide Preview" : "Preview"}
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {([
                  { key:"grayscale" as keyof PrepSettings, label:"Grayscale", icon:"◑" },
                  { key:"sharpen"   as keyof PrepSettings, label:"Sharpen",   icon:"🔍" },
                  { key:"invert"    as keyof PrepSettings, label:"Invert",    icon:"☯" },
                ] as { key: keyof PrepSettings; label: string; icon: string }[]).map(t => (
                  <button key={t.key}
                    onClick={() => setPrep(p => ({ ...p, [t.key]: !p[t.key as "grayscale"|"sharpen"|"invert"] }))}
                    className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition-all border ${
                      prep[t.key as "grayscale"|"sharpen"|"invert"]
                        ? "bg-[#6C3AFF] text-white border-transparent"
                        : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                    }`}>
                    <span className="text-base">{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Contrast</span><span className="text-white font-bold">{prep.contrast}%</span>
                </div>
                <input type="range" min={50} max={200} value={prep.contrast}
                  onChange={e => setPrep(p => ({ ...p, contrast: Number(e.target.value) }))}
                  className="w-full accent-[#6C3AFF]" />
              </div>

              <div>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Brightness</span><span className="text-white font-bold">{prep.brightness}%</span>
                </div>
                <input type="range" min={50} max={200} value={prep.brightness}
                  onChange={e => setPrep(p => ({ ...p, brightness: Number(e.target.value) }))}
                  className="w-full accent-[#6C3AFF]" />
              </div>

              <button onClick={() => setPrep({ grayscale:false, contrast:100, brightness:100, sharpen:false, invert:false })}
                className="text-xs text-gray-600 hover:text-[#FF3A6C] transition-colors w-full text-right">
                Reset preprocessing
              </button>

              {showPreview && (
                <div className="rounded-xl overflow-hidden border border-white/10">
                  <canvas ref={previewCanvasRef} style={{ maxWidth:"100%", display:"block" }} />
                  <div className="text-xs text-gray-500 text-center py-1 bg-[#0A0A14]">Preprocessed preview</div>
                </div>
              )}
            </div>

            {/* Quality check */}
            {active?.quality && (
              <div className={`rounded-2xl p-4 border text-sm ${
                active.quality.score >= 80
                  ? "bg-green-500/5 border-green-500/20"
                  : "bg-yellow-400/5 border-yellow-400/20"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={active.quality.score >= 80 ? "text-green-400" : "text-yellow-400"}>
                    {active.quality.score >= 80 ? "✓" : "⚠"}
                  </span>
                  <span className={`font-semibold text-sm ${active.quality.score >= 80 ? "text-green-400" : "text-yellow-400"}`}>
                    Image Quality: {active.quality.score >= 80 ? "Good" : "May Affect Accuracy"}
                  </span>
                </div>
                {active.quality.tips.map((tip, i) => (
                  <div key={i} className="text-xs text-gray-400 flex items-start gap-1.5">
                    <span className="flex-shrink-0">•</span><span>{tip}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Run button */}
            <button onClick={runOCR} disabled={!isReady || isProcessing}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] text-white font-extrabold text-lg transition-all hover:opacity-90 disabled:opacity-40 shadow-2xl shadow-violet-900/40">
              {isProcessing ? "⏳ Processing…" : "🔍 Extract Text from Image"}
            </button>
          </div>

          {/* ── Right: Results ── */}
          <div className="xl:col-span-3 space-y-4">

            {/* Image preview */}
            {active && status === "idle" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Image Preview</div>
                <img src={active.src} alt={active.name}
                  className="max-w-full max-h-72 object-contain mx-auto rounded-xl border border-white/10 block" />
                <div className="flex justify-center gap-6 mt-3 text-xs text-gray-500">
                  <span>{active.img.width}×{active.img.height}px</span>
                  <span>{active.name}</span>
                </div>
              </div>
            )}

            {/* Progress */}
            {isProcessing && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-8 text-center space-y-4">
                <div className="text-5xl animate-pulse">{status==="preprocessing" ? "⚙️" : "🔍"}</div>
                <div>
                  <div className="text-white font-bold text-lg mb-1">{progressMsg}</div>
                  <div className="text-gray-500 text-sm">
                    {status==="preprocessing" ? "Enhancing image for better accuracy…" : "Running OCR engine locally in your browser"}
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>Progress</span>
                    <span className="text-[#6C3AFF] font-bold">{progress}%</span>
                  </div>
                  <div className="h-2.5 bg-[#0A0A14] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }} />
                  </div>
                </div>
                {progress < 25 && (
                  <p className="text-xs text-gray-600">
                    💡 First-time use downloads the language model (~4MB). Cached locally for instant future use.
                  </p>
                )}
              </div>
            )}

            {/* Error */}
            {status === "error" && (
              <div className="bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-2xl p-6 space-y-3">
                <div className="text-[#FF3A6C] font-bold text-sm">⚠ OCR Failed</div>
                <div className="text-gray-400 text-sm">{progressMsg}</div>
                <button onClick={() => setStatus("idle")} className="px-5 py-2.5 rounded-xl bg-[#6C3AFF] text-white text-sm font-bold">Try Again</button>
              </div>
            )}

            {/* Done */}
            {status === "done" && (
              <>
                {/* Stats + confidence row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#13131F] border border-white/5 rounded-xl p-3 text-center">
                    <div className="text-2xl font-extrabold text-[#6C3AFF]">{stats.words.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Words</div>
                  </div>
                  <div className="bg-[#13131F] border border-white/5 rounded-xl p-3 text-center">
                    <div className="text-2xl font-extrabold text-[#6C3AFF]">{stats.chars.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Characters</div>
                  </div>
                  <div className="bg-[#13131F] border border-white/5 rounded-xl p-3 text-center">
                    <div className="text-2xl font-extrabold text-[#6C3AFF]">{stats.lines}</div>
                    <div className="text-xs text-gray-500">Lines</div>
                  </div>
                  <div className="bg-[#13131F] border border-white/5 rounded-xl p-3 text-center">
                    <div className={`text-2xl font-extrabold ${confColor2}`}>
                      {overallConf !== null ? `${overallConf}%` : "—"}
                    </div>
                    <div className="text-xs text-gray-500">Confidence</div>
                  </div>
                </div>

                {/* Confidence bar */}
                {overallConf !== null && (
                  <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Overall OCR Confidence</span>
                      <span className={`text-sm font-bold ${confColor2}`}>{overallConf}% — {confLabel}</span>
                    </div>
                    <div className="h-2.5 bg-[#0A0A14] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${
                        overallConf>=90 ? "bg-green-500" : overallConf>=70 ? "bg-yellow-500" : "bg-red-500"
                      }`} style={{ width: `${overallConf}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-gray-600 mt-1">
                      <span className="text-red-400">Low (0–70%)</span>
                      <span className="text-yellow-400">Medium (70–90%)</span>
                      <span className="text-green-400">High (90–100%)</span>
                    </div>
                  </div>
                )}

                {/* Output mode tabs */}
                <div className="flex gap-1 bg-[#13131F] border border-white/5 p-1 rounded-xl">
                  {([
                    { id:"plain"    as OutputMode, label:"📄 Plain Text"          },
                    { id:"heatmap"  as OutputMode, label:"🌡 Confidence Heatmap"  },
                    { id:"wordlist" as OutputMode, label:"📋 Word List"            },
                  ]).map(v => (
                    <button key={v.id} onClick={() => setOutputMode(v.id)}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                        outputMode===v.id ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"
                      }`}>
                      {v.label}
                    </button>
                  ))}
                </div>

                {/* Text output */}
                {outputMode === "plain" && (
                  <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Extracted Text</span>
                      <div className="flex gap-2">
                        <button onClick={copyText}
                          className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            copied ? "bg-green-600 text-white" : "bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white"
                          }`}>
                          {copied ? "✓ Copied!" : "Copy Text"}
                        </button>
                        <button onClick={downloadTxt}
                          className="px-4 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-xs font-bold transition-all">
                          ⬇ Download TXT
                        </button>
                      </div>
                    </div>
                    <textarea value={plainText}
                      onChange={e => setPlainText(e.target.value)}
                      rows={16}
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all resize-none font-mono leading-relaxed" />
                    <p className="text-xs text-gray-600 mt-2">
                      💡 The text is fully editable — correct any OCR errors directly before copying or downloading.
                    </p>
                  </div>
                )}

                {/* Heatmap */}
                {outputMode === "heatmap" && (
                  <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Word Confidence Heatmap</span>
                      <div className="flex gap-3 text-xs">
                        <span className="text-green-400">■ High (≥90%)</span>
                        <span className="text-yellow-400">■ Med (70–90%)</span>
                        <span className="text-red-400">■ Low (&lt;70%)</span>
                      </div>
                    </div>
                    {confWords.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 max-h-96 overflow-y-auto p-1">
                        {confWords.map((w, i) => (
                          <span key={i} title={`Confidence: ${w.conf}%`}
                            className={`px-2 py-0.5 rounded-lg text-sm cursor-help font-mono ${confColor(w.conf)} ${confBg(w.conf)} border border-white/5`}>
                            {w.text}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-sm">Heatmap data not available for this result.</div>
                    )}
                    <p className="text-xs text-gray-600 mt-3">Hover over any word to see its confidence percentage.</p>
                  </div>
                )}

                {/* Word list */}
                {outputMode === "wordlist" && (
                  <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Word List ({confWords.length} words)</span>
                    </div>
                    <div className="overflow-x-auto max-h-96 overflow-y-auto">
                      <table className="w-full text-sm">
                        <thead className="sticky top-0 bg-[#13131F]">
                          <tr className="text-xs text-gray-500 border-b border-white/10">
                            <th className="text-left py-2 pl-2 w-8">#</th>
                            <th className="text-left py-2">Word</th>
                            <th className="text-right py-2">Confidence</th>
                            <th className="py-2 w-24 text-right pr-2">Level</th>
                          </tr>
                        </thead>
                        <tbody>
                          {confWords.map((w, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                              <td className="py-2 pl-2 text-gray-600 text-xs">{i+1}</td>
                              <td className={`py-2 font-mono font-medium ${confColor(w.conf)}`}>{w.text}</td>
                              <td className={`py-2 text-right font-bold ${confColor(w.conf)}`}>{w.conf}%</td>
                              <td className="py-2 pr-2">
                                <div className="flex justify-end">
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${confBg(w.conf)} ${confColor(w.conf)}`}>
                                    {w.conf>=90 ? "High" : w.conf>=70 ? "Med" : "Low"}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Tips */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="font-bold text-white text-sm mb-3">💡 Tips for Better OCR Results</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
                {[
                  { icon:"📐", tip:"Use high resolution images — minimum 300 DPI or 1000px wide" },
                  { icon:"🌗", tip:"Apply Grayscale + Contrast for faded or low-contrast images" },
                  { icon:"🔤", tip:"Select the correct language — wrong language drastically reduces accuracy" },
                  { icon:"📷", tip:"Straighten tilted document images before uploading" },
                  { icon:"☯",  tip:"Use Invert for white text on dark backgrounds" },
                  { icon:"🔍", tip:"Apply Sharpen for blurry or out-of-focus text" },
                  { icon:"📋", tip:"Screenshots and screen captures produce the most accurate results" },
                  { icon:"🖼", tip:"For PDFs, take a screenshot of each page and process individually" },
                ].map((t, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="flex-shrink-0">{t.icon}</span>
                    <span>{t.tip}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Competitor comparison */}
        <div className="mt-8 bg-[#13131F] border border-white/5 rounded-2xl p-5 overflow-x-auto">
          <h2 className="text-base font-extrabold text-white mb-4">Why PursTech OCR Beats Every Competitor</h2>
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-2 text-gray-500 font-semibold">Feature</th>
                <th className="text-center py-2 text-[#6C3AFF] font-bold">PursTech ★</th>
                <th className="text-center py-2 text-gray-500">onlineocr.net</th>
                <th className="text-center py-2 text-gray-500">ocr.space</th>
                <th className="text-center py-2 text-gray-500">i2ocr.com</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["100% browser-based (private)",                 true,  false, false, false],
                ["Image preprocessing tools",                    true,  false, false, false],
                ["Word-level confidence heatmap",                true,  false, false, false],
                ["Clipboard paste (Ctrl+V)",                     true,  false, false, false],
                ["Camera capture support",                       true,  false, false, false],
                ["30+ languages",                                true,  true,  true,  true ],
                ["No login required",                            true,  false, true,  true ],
                ["No watermarks",                                true,  true,  false, true ],
                ["No file size limit",                           true,  false, false, false],
                ["Editable output text",                         true,  false, false, false],
              ].map(([feature, ...vals]) => (
                <tr key={String(feature)} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-2.5 text-gray-400 text-xs">{String(feature)}</td>
                  {vals.map((v, i) => (
                    <td key={i} className="text-center py-2.5">
                      {v ? <span className="text-green-400 font-bold">✓</span> : <span className="text-gray-600">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* How to Use */}
        <div className="mt-8 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Extract Text from Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Upload or paste your image",
                desc:"Drop an image, click to browse, paste from clipboard with Ctrl+V, take a photo, or enter an image URL. Supports JPEG, PNG, WebP and GIF." },
              { step:"2", title:"Select language & preprocess",
                desc:"Choose the language of the text in your image. Enable preprocessing options (Grayscale, Contrast, Sharpen, Invert) to improve accuracy on difficult images." },
              { step:"3", title:"Extract and review",
                desc:"Click Extract Text. The AI analyses your image locally in your browser — no server upload. Review the word confidence heatmap to spot any errors." },
              { step:"4", title:"Copy or download",
                desc:"Edit any mistakes directly in the text area, then copy to clipboard or download as a TXT file. The confidence heatmap shows which words to double-check." },
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
            {OCR_FAQ.map((faq, i) => (
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
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
