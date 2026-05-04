"use client";

import { useState, useRef } from "react";
import Link from "next/link";

const LANGUAGES = [
  { code: "eng", name: "English"    },
  { code: "ara", name: "Arabic"     },
  { code: "chi_sim", name: "Chinese (Simplified)"  },
  { code: "chi_tra", name: "Chinese (Traditional)" },
  { code: "fra", name: "French"     },
  { code: "deu", name: "German"     },
  { code: "hin", name: "Hindi"      },
  { code: "ita", name: "Italian"    },
  { code: "jpn", name: "Japanese"   },
  { code: "kor", name: "Korean"     },
  { code: "por", name: "Portuguese" },
  { code: "rus", name: "Russian"    },
  { code: "spa", name: "Spanish"    },
  { code: "tur", name: "Turkish"    },
  { code: "nld", name: "Dutch"      },
  { code: "pol", name: "Polish"     },
  { code: "swe", name: "Swedish"    },
  { code: "nor", name: "Norwegian"  },
  { code: "dan", name: "Danish"     },
  { code: "fin", name: "Finnish"    },
  { code: "ukr", name: "Ukrainian"  },
  { code: "vie", name: "Vietnamese" },
  { code: "tha", name: "Thai"       },
  { code: "ind", name: "Indonesian" },
  { code: "hrv", name: "Croatian"   },
  { code: "ces", name: "Czech"      },
  { code: "slk", name: "Slovak"     },
  { code: "ron", name: "Romanian"   },
  { code: "hun", name: "Hungarian"  },
  { code: "cat", name: "Catalan"    },
];

const FAQ = [
  {
    q: "What is OCR and how does it work?",
    a: "OCR (Optical Character Recognition) is technology that converts images containing text into machine-readable text that you can copy, edit and search. Our tool uses Tesseract.js — an open-source OCR engine originally developed by HP and now maintained by Google. It analyses the patterns of pixels in an image to identify characters, working entirely in your browser without any server upload.",
  },
  {
    q: "What types of images produce the best OCR results?",
    a: "OCR accuracy is highest on images with dark text on a light background, a minimum resolution of 300 DPI (or 1000px wide for screen images), horizontal text orientation and minimal background noise. Scanned documents, screenshots and photos of printed text all work well. Handwriting, stylised fonts and very low-resolution images produce less accurate results. Increasing contrast before running OCR significantly improves accuracy on difficult images.",
  },
  {
    q: "Is my image uploaded to a server when I use this tool?",
    a: "No — all OCR processing happens entirely in your browser using WebAssembly. Your images are never sent to any server, never stored, and never transmitted. This makes our OCR tool safe for processing confidential documents, personal ID images, private contracts and sensitive business information. The Tesseract.js engine downloads language data files (about 2-4MB per language) from a CDN on first use, then caches them locally.",
  },
  {
    q: "What do the confidence percentages mean?",
    a: "Each character recognised by the OCR engine has a confidence score from 0 to 100%. A score above 90% means the engine is very confident it identified the character correctly. Scores between 70–90% are reasonable but may contain occasional errors. Below 70% the recognition is unreliable. The overall confidence shown is the average across all recognised characters. Low confidence usually indicates poor image quality or an unsupported font.",
  },
  {
    q: "Can I extract text from PDFs using this tool?",
    a: "This tool extracts text from image files (JPEG, PNG, WebP, GIF, BMP). For PDFs that contain actual text layers (not scanned), you can copy text directly without OCR. For scanned PDF documents, take screenshots of each page and run them through this OCR tool. For bulk PDF OCR, dedicated tools like Adobe Acrobat or pdfplumber offer more efficient workflows.",
  },
];

type Status = "idle" | "loading" | "recognising" | "done" | "error";

export default function ImageToTextClient() {
  const [image,      setImage]      = useState<string | null>(null);
  const [imageName,  setImageName]  = useState("image");
  const [lang,       setLang]       = useState("eng");
  const [status,     setStatus]     = useState<Status>("idle");
  const [progress,   setProgress]   = useState(0);
  const [progressMsg,setProgressMsg] = useState("");
  const [text,       setText]       = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const [wordCount,  setWordCount]  = useState(0);
  const [copied,     setCopied]     = useState(false);
  const [dragging,   setDragging]   = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function loadImage(file: File) {
    const reader = new FileReader();
    reader.onload = e => {
      setImage(e.target?.result as string);
      setImageName(file.name.replace(/\.[^/.]+$/, ""));
      setText(""); setConfidence(null); setProgress(0); setStatus("idle");
    };
    reader.readAsDataURL(file);
  }

  async function runOCR() {
    if (!image) return;
    setStatus("loading");
    setProgress(5);
    setProgressMsg("Loading OCR engine...");
    setText("");
    setConfidence(null);

    try {
      // Dynamic import to avoid SSR issues
      const { createWorker } = await import("tesseract.js");
      setProgress(20);
      setProgressMsg("Initialising language model...");

      const worker = await createWorker(lang, 1, {
        logger: (m: { status: string; progress: number }) => {
          if (m.status === "recognizing text") {
            setStatus("recognising");
            setProgress(30 + Math.round(m.progress * 65));
            setProgressMsg(`Recognising text… ${Math.round(m.progress * 100)}%`);
          } else if (m.status === "loading tesseract core") {
            setProgress(10);
            setProgressMsg("Loading OCR core...");
          } else if (m.status === "initializing tesseract") {
            setProgress(15);
            setProgressMsg("Initialising engine...");
          }
        },
      });

      setProgress(30);
      setProgressMsg("Analysing image...");

      const result = await worker.recognize(image);
      await worker.terminate();

      const extractedText = result.data.text.trim();
      const conf = result.data.confidence;
      setText(extractedText);
      setConfidence(conf);
      setWordCount(extractedText.split(/\s+/).filter(Boolean).length);
      setProgress(100);
      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setProgressMsg("Failed to process image. Please try a different image.");
    }
  }

  function copy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function download() {
    const blob = new Blob([text], { type: "text/plain" });
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob),
      download: `${imageName}-ocr-text.txt`,
    });
    a.click();
  }

  const confColor = confidence === null ? "text-gray-500"
    : confidence >= 90 ? "text-green-400"
    : confidence >= 70 ? "text-yellow-400"
    : "text-[#FF3A6C]";

  const confLabel = confidence === null ? ""
    : confidence >= 90 ? "High confidence"
    : confidence >= 70 ? "Medium confidence — may contain errors"
    : "Low confidence — check results carefully";

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
          <span className="text-gray-400">Image to Text</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Image Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Image to Text Converter Online — Extract Text from Any Image
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Powered by Tesseract OCR. Supports 30+ languages including Arabic, Chinese, Hindi and Japanese. See confidence scores, word counts and highlights. 100% browser-based.
          </p>
        </div>

        {/* Language selector */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 mb-5">
          <label className="block text-sm font-semibold text-white mb-2">Recognition Language</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {LANGUAGES.slice(0, 10).map(l => (
              <button key={l.code} onClick={() => setLang(l.code)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  lang === l.code
                    ? "bg-[#6C3AFF] text-white border-transparent"
                    : "bg-[#0A0A14] border-white/5 text-gray-400 hover:text-white hover:border-white/10"
                }`}>
                {l.name}
              </button>
            ))}
          </div>
          <div className="mt-2">
            <select value={lang} onChange={e => setLang(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all">
              <option value="" disabled>Or select any of 30+ languages...</option>
              {LANGUAGES.map(l => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Upload */}
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) loadImage(f); }}
          onClick={() => !image && inputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl transition-all mb-5 ${
            image ? "border-white/5 bg-[#13131F]" : dragging ? "border-[#6C3AFF] bg-[#6C3AFF]/5 cursor-pointer" : "border-white/10 hover:border-[#6C3AFF]/40 hover:bg-[#6C3AFF]/5 cursor-pointer"
          }`}>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) loadImage(f); }} />

          {image ? (
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-white">{imageName}</span>
                <button onClick={() => { setImage(null); setText(""); setStatus("idle"); }}
                  className="text-xs text-gray-600 hover:text-[#FF3A6C] transition-colors">
                  × Change image
                </button>
              </div>
              <img src={image} alt="Upload" className="max-w-full max-h-72 object-contain mx-auto rounded-xl" />
            </div>
          ) : (
            <div className="p-12 text-center">
              <div className="text-5xl mb-3">🔍</div>
              <div className="text-white font-bold text-lg mb-1">Drop an image here or click to upload</div>
              <div className="text-gray-500 text-sm">JPEG · PNG · WebP · GIF · BMP · Scanned documents</div>
            </div>
          )}
        </div>

        {/* Run OCR button */}
        {image && status !== "loading" && status !== "recognising" && (
          <button onClick={runOCR}
            className="w-full py-4 rounded-2xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white font-bold transition-all shadow-lg shadow-violet-900/30 text-lg mb-5">
            🔍 Extract Text from Image
          </button>
        )}

        {/* Progress */}
        {(status === "loading" || status === "recognising") && (
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white">{progressMsg}</span>
              <span className="text-sm text-[#6C3AFF] font-bold">{progress}%</span>
            </div>
            <div className="h-2 bg-[#0A0A14] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              First run downloads language data (~3MB) and caches it locally. Subsequent runs are instant.
            </p>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-2xl p-4 mb-5">
            <div className="text-[#FF3A6C] font-bold text-sm mb-1">⚠ OCR Failed</div>
            <div className="text-gray-400 text-xs">{progressMsg}</div>
          </div>
        )}

        {/* Results */}
        {status === "done" && text && (
          <div className="space-y-4">
            {/* Stats bar */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 flex flex-wrap gap-6">
              <div className="text-center">
                <div className="text-xl font-extrabold text-white">{wordCount}</div>
                <div className="text-xs text-gray-500">Words</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-extrabold text-white">{text.length}</div>
                <div className="text-xs text-gray-500">Characters</div>
              </div>
              {confidence !== null && (
                <div className="text-center">
                  <div className={`text-xl font-extrabold ${confColor}`}>{Math.round(confidence)}%</div>
                  <div className="text-xs text-gray-500">Confidence</div>
                </div>
              )}
              {confidence !== null && (
                <div className="flex-1 flex items-center">
                  <div>
                    <div className="h-1.5 bg-[#0A0A14] rounded-full overflow-hidden w-32 mb-1">
                      <div className={`h-full rounded-full ${
                        confidence >= 90 ? "bg-green-500" : confidence >= 70 ? "bg-yellow-500" : "bg-[#FF3A6C]"
                      }`} style={{ width: `${confidence}%` }} />
                    </div>
                    <div className={`text-xs ${confColor}`}>{confLabel}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Extracted text */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Extracted Text</h3>
                <div className="flex gap-2">
                  <button onClick={copy}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      copied ? "bg-green-600 text-white" : "bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white"
                    }`}>
                    {copied ? "✓ Copied!" : "Copy Text"}
                  </button>
                  <button onClick={download}
                    className="px-4 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-xs font-bold transition-all">
                    ⬇ Download TXT
                  </button>
                </div>
              </div>
              <textarea
                value={text}
                onChange={e => { setText(e.target.value); setWordCount(e.target.value.split(/\s+/).filter(Boolean).length); }}
                rows={16}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all resize-none font-mono leading-relaxed"
              />
              <p className="text-xs text-gray-600 mt-2">
                💡 The text is editable — correct any OCR errors directly above before copying or downloading.
              </p>
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="mt-6 bg-[#13131F] border border-white/5 rounded-2xl p-5">
          <h3 className="font-bold text-white text-sm mb-3">💡 Tips for Better OCR Results</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-400">
            {[
              "Use high-resolution images — minimum 300 DPI or 1000px wide",
              "Ensure dark text on a light background for best accuracy",
              "Straighten skewed or tilted document images before scanning",
              "Increase image contrast for faded or low-quality documents",
              "Select the correct language — wrong language drastically reduces accuracy",
              "For mixed-language documents, try running OCR twice with different language settings",
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#6C3AFF] flex-shrink-0">•</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Extract Text from Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Select your language", desc:"Choose the language of the text in your image. Selecting the correct language significantly improves OCR accuracy." },
              { step:"2", title:"Upload your image", desc:"Drop a screenshot, scanned document, photo or any image containing text. JPEG, PNG, WebP and GIF are all supported." },
              { step:"3", title:"Extract text", desc:"Click the Extract button. The OCR engine processes the image locally in your browser. First run downloads language data (3MB) and caches it." },
              { step:"4", title:"Copy or download", desc:"Review the extracted text, correct any errors directly in the text area, then copy to clipboard or download as a .txt file." },
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
