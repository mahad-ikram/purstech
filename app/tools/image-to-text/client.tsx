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
          <Link href="/tools" className="ho