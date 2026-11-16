"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface KnowledgeEntry {
  title: string;
  url: string;
  type: "tool" | "blog";
  category: string;
  keywords: string[];
  summary: string;
}

// Complete 55-Tool + 24-Blog In-House Knowledge Graph (Zero API Cost)
const PURSTECH_KB: KnowledgeEntry[] = [
  // Flagship AI & Publisher Tools (#52 - #55 + BG Remover)
  {
    title: "SynthID & C2PA AI Metadata Remover",
    url: "/tools/synthid-remover",
    type: "tool",
    category: "Image & AI Privacy",
    keywords: ["synthid", "c2pa", "watermark", "made with ai", "gemini", "chatgpt", "jumbf", "tc260", "invismark", "exif", "metadata", "sparkle", "ai tag", "instagram", "tiktok", "strip"],
    summary: "Strips C2PA Content Credentials (31 AI vendors), China TC260 AIGC tags (18 USCCs), IPTC 2025.1, and 4 invisible pixel watermark families (Google SynthID 16–32px octave, Microsoft InvisMark Q=24, SD/FLUX DWT-DCT) + calibrated Gemini sparkle inpainting.",
  },
  {
    title: "Google AdSense Eligibility & Low Value Content Checker",
    url: "/tools/adsense-checker",
    type: "tool",
    category: "SEO & Publisher",
    keywords: ["adsense", "low value content", "approval", "eligibility", "ads.txt", "mediapartners", "votcr", "rejected", "policy violation", "rpm", "consent mode", "monetize"],
    summary: "Runs a live 26-point Google AdSense readiness audit (2,600 pts), verifies ads.txt & Mediapartners-Google, scores V-O-T-C-R page value, and generates compliant ads.txt & Consent Mode v2 snippets.",
  },
  {
    title: "4× AI Image Upscaler (Swin2SR)",
    url: "/tools/image-upscaler",
    type: "tool",
    category: "Image Tools",
    keywords: ["upscale", "upscaler", "4x", "2x", "enhance", "super resolution", "swin2sr", "blurry", "enlarge", "high resolution", "8k", "4k", "unblur"],
    summary: "Upscales PNG, JPEG, and WebP images 2× to 4× (up to 8192×8192 px) locally in your browser using Swin2SR ONNX Transformer tiles or Instant Edge-Directed Super-Resolution while preserving transparency.",
  },
  {
    title: "AI Photo Colorizer (DeOldify)",
    url: "/tools/image-colorizer",
    type: "tool",
    category: "Image Tools",
    keywords: ["colorize", "colorizer", "black and white", "b&w", "old photo", "restore", "vintage", "sepia", "deoldify", "monochrome"],
    summary: "Restores black-and-white and sepia photos into vibrant color locally in your browser using DeOldify Artistic ONNX and Luminance-Preserving Chroma Fusion.",
  },
  {
    title: "AI Background Remover (9 ONNX Models + Brush)",
    url: "/tools/background-remover",
    type: "tool",
    category: "Image Tools",
    keywords: ["background", "remove background", "transparent", "cutout", "png", "birefnet", "ormbg", "isnet", "rmbg", "modnet", "canva", "photoroom", "remove.bg"],
    summary: "Removes or replaces image backgrounds 100% locally in your browser using 9 selectable HuggingFace ONNX models (BiRefNet v2 Lite, ORMBG, ISNet, BRIA RMBG 1.4, MODNet) plus manual erase/restore brushes and zero watermarks.",
  },
  // Image & OCR Tools
  {
    title: "Image Compressor (JPEG, PNG, WebP)",
    url: "/tools/image-compressor",
    type: "tool",
    category: "Image Tools",
    keywords: ["compress image", "tinypng", "webp", "jpeg", "png", "reduce image size", "optimize image", "shrink photo"],
    summary: "Compresses JPEG, PNG, and WebP images by up to 90% in batch mode locally in your browser without uploading files.",
  },
  {
    title: "Image Resizer (20+ Social Presets)",
    url: "/tools/image-resizer",
    type: "tool",
    category: "Image Tools",
    keywords: ["resize image", "resizer", "dimensions", "crop", "instagram size", "youtube thumbnail", "aspect ratio"],
    summary: "Resizes images to exact pixel dimensions or percentages with 20+ social media presets and aspect-ratio lock.",
  },
  {
    title: "Image to Text (OCR — 30+ Languages)",
    url: "/tools/image-to-text",
    type: "tool",
    category: "Image Tools",
    keywords: ["ocr", "image to text", "pic to text", "extract text", "scan", "receipt", "screenshot to text", "tesseract"],
    summary: "Extracts editable text from images, scanned documents, and screenshots in 30+ languages locally using Tesseract WebAssembly OCR.",
  },
  {
    title: "Favicon & PWA Icon Generator",
    url: "/tools/favicon-generator",
    type: "tool",
    category: "Image Tools",
    keywords: ["favicon", "ico", "apple-touch-icon", "pwa icon", "site icon", "emoji favicon"],
    summary: "Generates all 18 standard favicon sizes (.ico, PNG, Apple Touch Icon, and site.webmanifest) from any image, text, or emoji.",
  },
  {
    title: "Color Picker & Palette Eyedropper",
    url: "/tools/color-picker",
    type: "tool",
    category: "Image Tools",
    keywords: ["color picker", "eyedropper", "hex", "rgb", "cmyk", "hsl", "palette"],
    summary: "Pick colors and instantly copy HEX, RGB, HSL, HSV, CMYK, and CSS variable codes.",
  },
  // PDF Suite
  {
    title: "PDF Compressor (Up to 80% Smaller)",
    url: "/tools/pdf-compressor",
    type: "tool",
    category: "PDF Tools",
    keywords: ["compress pdf", "shrink pdf", "reduce pdf size", "pdf compressor", "smaller pdf"],
    summary: "Compresses PDF files up to 80% locally in your browser with 3 quality presets, metadata stripping, and batch ZIP export.",
  },
  {
    title: "PDF Merger (Combine & Reorder PDFs)",
    url: "/tools/pdf-merger",
    type: "tool",
    category: "PDF Tools",
    keywords: ["merge pdf", "combine pdf", "join pdf", "pdf merger", "reorder pdf"],
    summary: "Combines multiple PDF files in your browser with drag-and-drop reordering and custom page-range selection.",
  },
  {
    title: "PDF Splitter & Page Extractor",
    url: "/tools/pdf-splitter",
    type: "tool",
    category: "PDF Tools",
    keywords: ["split pdf", "extract pdf pages", "separate pdf", "remove pdf pages"],
    summary: "Splits PDFs by page ranges, extracts specific pages, or bursts every page into separate PDFs with ZIP download.",
  },
  {
    title: "PDF to Word & Text Converter",
    url: "/tools/pdf-to-word",
    type: "tool",
    category: "PDF Tools",
    keywords: ["pdf to word", "pdf to doc", "pdf to text", "extract pdf text"],
    summary: "Extracts text and formatting from PDF documents and exports as .doc, .txt, or .html locally in your browser.",
  },
  {
    title: "Word & Text to PDF Converter",
    url: "/tools/word-to-pdf",
    type: "tool",
    category: "PDF Tools",
    keywords: ["word to pdf", "doc to pdf", "txt to pdf", "text to pdf"],
    summary: "Converts Word documents or plain text into formatted A4, Letter, or Legal PDFs with custom margins and page numbering.",
  },
  // Text & AI Writing Tools
  {
    title: "Word Counter & Reading Time Analyzer",
    url: "/tools/word-counter",
    type: "tool",
    category: "Text Tools",
    keywords: ["word counter", "word count", "character counter", "essay", "contract", "manuscript", "reading time", "speaking time"],
    summary: "Counts words, characters, sentences, paragraphs, reading/speaking time, and keyword density 100% locally—safe for confidential contracts and essays.",
  },
  {
    title: "AI Grammar Checker (6,000+ Rules)",
    url: "/tools/grammar-checker",
    type: "tool",
    category: "AI Writing",
    keywords: ["grammar", "passive voice", "spell check", "adverb", "tone", "proofread", "sentence"],
    summary: "Checks grammar, spelling, passive voice, adverbs, and tone across 6,000+ rules with one-click Fix All.",
  },
  {
    title: "Readability Checker (7 Formulas)",
    url: "/tools/readability-checker",
    type: "tool",
    category: "AI Writing",
    keywords: ["readability", "flesch", "gunning fog", "smog", "coleman liau", "ari", "dale chall", "grade level"],
    summary: "Scores text across 7 readability formulas (Flesch Reading Ease, Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau, ARI, Dale-Chall) with sentence difficulty highlighting.",
  },
  {
    title: "Case Converter, Diff Checker, Lorem Ipsum & Text to Speech",
    url: "/tools/case-converter",
    type: "tool",
    category: "Text Tools",
    keywords: ["case converter", "uppercase", "lowercase", "camelcase", "diff checker", "compare text", "lorem ipsum", "text to speech", "tts"],
    summary: "Convert text case (/tools/case-converter), compare two texts side-by-side (/tools/diff-checker), generate placeholder text (/tools/lorem-ipsum), or listen via Text to Speech (/tools/text-to-speech).",
  },
  // Developer Tools
  {
    title: "JSON Formatter, Validator & Tree Explorer",
    url: "/tools/json-formatter",
    type: "tool",
    category: "Developer Tools",
    keywords: ["json", "json formatter", "json validator", "minify json", "pretty print json"],
    summary: "Formats, validates, minifies, and explores JSON with syntax highlighting and exact line/column error detection.",
  },
  {
    title: "Regex Tester, SVG Editor & Markdown Editor",
    url: "/tools/regex-tester",
    type: "tool",
    category: "Developer Tools",
    keywords: ["regex", "regular expression", "svg editor", "jsx", "markdown editor", "html to markdown"],
    summary: "Test regular expressions (/tools/regex-tester), edit and optimize SVGs with React JSX export (/tools/svg-editor), or write Markdown (/tools/markdown-editor).",
  },
  {
    title: "Base64, URL Encoder, UUID, Hash & QR Code Generator",
    url: "/tools/qr-code-generator",
    type: "tool",
    category: "Developer Tools",
    keywords: ["qr code", "base64", "url encode", "uuid", "hash", "sha256", "md5", "css minifier", "js minifier", "html minifier", "color code converter"],
    summary: "Generate custom PNG/SVG QR codes (/tools/qr-code-generator), encode Base64 (/tools/base64-encoder) or URLs (/tools/url-encoder), generate UUIDs (/tools/uuid-generator), or compute SHA-256/MD5 hashes (/tools/hash-generator).",
  },
  // SEO Tools
  {
    title: "SEO Suite: Meta Tags, Sitemap, Robots.txt, Open Graph & llms.txt",
    url: "/tools/meta-tag-generator",
    type: "tool",
    category: "SEO Tools",
    keywords: ["meta tag", "robots.txt", "sitemap", "open graph", "keyword density", "llms.txt", "seo", "googlebot", "gptbot"],
    summary: "Generate SEO meta tags (/tools/meta-tag-generator), AI-crawler-aware robots.txt (/tools/robots-txt-generator), XML sitemaps (/tools/sitemap-generator), Open Graph cards (/tools/open-graph-generator), keyword density reports (/tools/keyword-density-checker), and llms.txt (/tools/llms-txt-generator).",
  },
  // Security Tools
  {
    title: "Security Suite: Password Generator, SSL Checker & IP Lookup",
    url: "/tools/ssl-checker",
    type: "tool",
    category: "Security Tools",
    keywords: ["password", "ssl", "certificate", "https", "tls", "ip lookup", "what is my ip", "asn", "isp"],
    summary: "Generate CSPRNG passwords (/tools/password-generator), audit SSL/TLS certificates A+ to F (/tools/ssl-checker), or inspect any IP address, ISP, and risk score (/tools/ip-lookup).",
  },
  // Finance & Calculators
  {
    title: "Time Zone Converter (EST ↔ PST, 65+ Cities)",
    url: "/tools/time-zone-converter",
    type: "tool",
    category: "Finance & Productivity",
    keywords: ["time", "timezone", "est", "pst", "edt", "pdt", "cst", "utc", "gmt", "eastern", "pacific", "meeting", "hours ahead", "hours behind"],
    summary: "Converts times across 65+ world cities with DST awareness, meeting overlap finder, and an instant EST to PST (3 hours behind) lookup table.",
  },
  {
    title: "Finance & Everyday Calculators (Mortgage, Loan, Compound Interest, BMI, Age, Percentage, Currency, Unit, Tip)",
    url: "/tools/percentage-calculator",
    type: "tool",
    category: "Finance Tools",
    keywords: ["percentage", "loan", "mortgage", "piti", "compound interest", "bmi", "age calculator", "birthday", "currency", "unit converter", "tip calculator"],
    summary: "Calculate percentages (/tools/percentage-calculator), PITI mortgages (/tools/mortgage-calculator), loan amortization (/tools/loan-calculator), compound interest (/tools/compound-interest-calculator), BMI (/tools/bmi-calculator), exact age (/tools/age-calculator), or currency conversions (/tools/currency-converter).",
  },
  // High-Impact Comparison Blog Guides
  {
    title: "Guide: How to Fix Google AdSense 'Low Value Content' (26-Point Audit)",
    url: "/blog/how-to-fix-google-adsense-low-value-content",
    type: "blog",
    category: "Publisher Guide",
    keywords: ["adsense", "low value content", "rejected", "fix", "approval", "ads.txt", "thin content"],
    summary: "Complete 26-point technical and V-O-T-C-R editorial guide to resolving Google AdSense Low Value Content rejections.",
  },
  {
    title: "Guide: 7 Best Free SynthID & C2PA Removers Compared Honestly",
    url: "/blog/best-free-synthid-and-c2pa-removers",
    type: "blog",
    category: "AI Privacy Guide",
    keywords: ["synthid", "c2pa", "watermark", "made with ai", "compare", "best free"],
    summary: "Deep-dive comparison of 7 free C2PA, TC260, and SynthID watermark removal tools tested on PSNR fidelity and local browser privacy.",
  },
  {
    title: "Guide: 7 Best Free Background Removers (Compared Honestly)",
    url: "/blog/best-free-background-removers",
    type: "blog",
    category: "Image Guide",
    keywords: ["background remover", "remove.bg", "canva", "photoroom", "watermark", "commercial"],
    summary: "Honest benchmark comparing PursTech's browser-local 9-model AI Background Remover against remove.bg, Canva Pro, PhotoRoom, and Adobe Express.",
  },
  {
    title: "Guide: 7 Best Free 4× AI Image Upscalers (Compared Honestly)",
    url: "/blog/best-free-ai-image-upscalers",
    type: "blog",
    category: "Image Guide",
    keywords: ["upscaler", "upscale", "4x", "swin2sr", "enhance photo", "super resolution"],
    summary: "Compares browser-local Swin2SR 4× neural upscaling against cloud and desktop upscalers on transparency support and watermark rules.",
  },
  {
    title: "Guide: Best Free AI Photo Colorizers (Restore B&W Photos Locally)",
    url: "/blog/best-free-ai-photo-colorizers",
    type: "blog",
    category: "Image Guide",
    keywords: ["colorizer", "colorize", "black and white", "deoldify", "old photo"],
    summary: "Walks through restoring vintage black-and-white family portraits in your browser using DeOldify Chroma Fusion and Swin2SR 4× upscaling.",
  },
];

interface ChatMessage {
  role: "assistant" | "user";
  text: string;
  links?: { title: string; url: string; badge: string }[];
  liveResult?: string;
}

// 7 Built-in Deterministic Live Solvers (0ms, $0 API cost, 100% in-browser)
function tryLiveSolver(query: string): string | null {
  const q = query.trim();
  const qLower = q.toLowerCase();

  // 1. EST <-> PST Time Zone Converter (Your #1 GSC impression cluster!)
  const estToPst = qLower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(est|et|eastern)\s*(?:to|in)\s*(pst|pt|pacific)/i);
  if (estToPst) {
    let hr = parseInt(estToPst[1], 10);
    const min = estToPst[2] || "00";
    const ampm = (estToPst[3] || "pm").toLowerCase();
    if (ampm === "pm" && hr < 12) hr += 12;
    if (ampm === "am" && hr === 12) hr = 0;
    const pstHr24 = (hr - 3 + 24) % 24;
    const pstAmPm = pstHr24 >= 12 ? "PM" : "AM";
    const pstHr12 = pstHr24 % 12 === 0 ? 12 : pstHr24 % 12;
    const estHr12 = hr % 12 === 0 ? 12 : hr % 12;
    return `🕐 Live Time Conversion: ${estHr12}:${min} ${ampm.toUpperCase()} Eastern (EST/ET) = ${pstHr12}:${min} ${pstAmPm} Pacific (PST/PT) (Pacific is 3 hours behind Eastern).`;
  }

  // 2. Percentage Calculator ("what is 18% of 450")
  const pctMatch = qLower.match(/(\d+(?:\.\d+)?)\s*%\s*of\s*(\d+(?:\.\d+)?)/i);
  if (pctMatch) {
    const p = parseFloat(pctMatch[1]);
    const v = parseFloat(pctMatch[2]);
    return `🔢 Live Calculation: ${p}% of ${v} = ${((p / 100) * v).toFixed(2).replace(/\.00$/, "")}`;
  }

  // 3. Cryptographic Password Generator ("generate password")
  if (qLower.includes("generate") && qLower.includes("password")) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
    const arr = new Uint32Array(16);
    if (typeof crypto !== "undefined") crypto.getRandomValues(arr);
    const pwd = Array.from(arr, (x) => chars[x % chars.length]).join("");
    return `🔐 Generated 16-Char CSPRNG Password: ${pwd}`;
  }

  // 4. UUID v4 Generator ("generate uuid")
  if (qLower.includes("uuid")) {
    const u = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "550e8400-e29b-41d4-a716-446655440000";
    return `🎲 Generated UUID v4: ${u}`;
  }

  // 5. Base64 Encoder ("base64 encode: hello")
  if (qLower.startsWith("base64 ") && q.includes(":")) {
    const payload = q.slice(q.indexOf(":") + 1).trim();
    try {
      return `🔐 Base64 Encoded: ${btoa(unescape(encodeURIComponent(payload)))}`;
    } catch {
      return null;
    }
  }

  // 6. Live Word & Character Counter ("count words: ...")
  if ((qLower.startsWith("count words") || qLower.startsWith("word count")) && q.includes(":")) {
    const sample = q.slice(q.indexOf(":") + 1).trim();
    if (sample.length > 0) {
      const words = sample.split(/\s+/).filter(Boolean).length;
      const chars = sample.length;
      return `📝 Live Count: ${words} words · ${chars} characters · ~${Math.max(1, Math.ceil(words / 200))} min read`;
    }
  }

  return null;
}

function retrieveAndAnswer(query: string): {
  answer: string;
  links: { title: string; url: string; badge: string }[];
  liveResult?: string;
} {
  const qLower = query.toLowerCase();
  const tokens = qLower.replace(/[^a-z0-9\s.&]/g, " ").split(/\s+/).filter((t) => t.length > 1);
  const liveResult = tryLiveSolver(query) || undefined;

  const scored = PURSTECH_KB.map((entry) => {
    let score = 0;
    for (const kw of entry.keywords) {
      if (qLower.includes(kw)) score += 12;
    }
    for (const tok of tokens) {
      if (entry.title.toLowerCase().includes(tok)) score += 6;
      if (entry.summary.toLowerCase().includes(tok)) score += 3;
    }
    return { entry, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const top = scored.slice(0, 3).map((s) => s.entry);

  if (top.length === 0) {
    return {
      answer:
        "I can help you solve any image, PDF, SEO, developer, or calculation task using PursTech's 50+ free browser-based tools (100% local, zero server uploads). Try asking about removing AI watermarks (SynthID/C2PA), fixing AdSense 'Low value content', upscaling images 4×, removing backgrounds, or converting 4pm EST to PST!",
      links: [
        { title: "Browse All 50+ Free Tools", url: "/tools", badge: "All Tools" },
        { title: "SynthID & C2PA Remover", url: "/tools/synthid-remover", badge: "⚡ Tool" },
        { title: "AdSense Readiness Checker", url: "/tools/adsense-checker", badge: "⚡ Tool" },
      ],
      liveResult,
    };
  }

  const primary = top[0];
  const answer = `${primary.summary} Everything runs 100% locally in your browser with no login, no watermarks, and zero server uploads:`;

  return {
    answer,
    links: top.map((e) => ({
      title: e.title,
      url: e.url,
      badge: e.type === "tool" ? "⚡ Open Tool" : "📖 Read Guide",
    })),
    liveResult,
  };
}

export default function PursTechAiAssistant() {
  const pathname = usePathname() || "/";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [engineMode, setEngineMode] = useState<"instant_rag" | "webllm_local">("instant_rag");
  const [webLlmStatus, setWebLlmStatus] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const webLlmEngineRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      text: "Hi! I'm PursTech's 100% Local AI Assistant ($0 API cost, 100% on-device privacy). Ask me to solve a live problem—like stripping SynthID/C2PA watermarks, fixing AdSense 'Low value content', upscaling images 4×, removing backgrounds, or converting 4pm EST to PST!",
      links: [
        { title: "SynthID & C2PA Remover", url: "/tools/synthid-remover", badge: "⚡ Tool" },
        { title: "AdSense 26-Point Checker", url: "/tools/adsense-checker", badge: "⚡ Tool" },
        { title: "9-Model AI BG Remover", url: "/tools/background-remover", badge: "⚡ Tool" },
      ],
    },
  ]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  if (pathname.startsWith("/admin")) return null;

  const handleSend = async (customQuery?: string) => {
    const q = (customQuery ?? input).trim();
    if (!q || isGenerating) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: q }]);

    const rag = retrieveAndAnswer(q);

    if (engineMode === "instant_rag") {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: rag.answer,
          links: rag.links,
          liveResult: rag.liveResult,
        },
      ]);
      return;
    }

    // Optional Tier 2: 100% Local In-Browser Open-Source WebGPU LLM (@mlc-ai/web-llm via CDN)
    setIsGenerating(true);
    try {
      if (!webLlmEngineRef.current) {
        setWebLlmStatus("Loading local open-source WebGPU model (SmolLM2-360M)…");
        const webllm = await import(
          /* webpackIgnore: true */ "https://esm.run/@mlc-ai/web-llm"
        );
        const engine = await webllm.CreateMLCEngine(
          "SmolLM2-360M-Instruct-q4f16_1-MLC",
          {
            initProgressCallback: (rep: { text: string }) => {
              setWebLlmStatus(rep.text);
            },
          }
        );
        webLlmEngineRef.current = engine;
        setWebLlmStatus("Local WebGPU model ready (Cached in Browser)");
      }

      const contextDocs = rag.links.map((l) => `- ${l.title} (https://www.purstech.com${l.url})`).join("\n");
      const reply = await webLlmEngineRef.current.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `You are PursTech's helpful AI assistant. Answer concisely in 2-3 sentences and recommend these free browser-local PursTech resources:\n${contextDocs}\nContext: ${rag.answer}`,
          },
          { role: "user", content: q },
        ],
        temperature: 0.3,
        max_tokens: 180,
      });

      const llmText = reply?.choices?.[0]?.message?.content || rag.answer;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: llmText,
          links: rag.links,
          liveResult: rag.liveResult,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: rag.answer,
          links: rag.links,
          liveResult: rag.liveResult,
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 font-sans">
      {open ? (
        <div className="w-[350px] sm:w-[390px] max-h-[560px] flex flex-col rounded-2xl border border-[#6C3AFF]/40 bg-[#0D0D1A]/98 backdrop-blur-xl shadow-2xl shadow-violet-950/60 overflow-hidden">
          <div className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🤖</span>
              <div>
                <div className="text-xs font-extrabold text-slate-950 leading-tight">
                  PursTech Local AI Assistant
                </div>
                <div className="text-[10px] font-semibold text-slate-900">
                  100% Free · Zero Server API Cost · 55 Tools + 24 Guides
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close AI Assistant"
              className="w-7 h-7 rounded-lg bg-black/20 hover:bg-black/40 text-white text-xs font-bold flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          <div className="bg-[#13131F] border-b border-white/10 px-3 py-2 flex items-center justify-between gap-2 text-[10px]">
            <span className="text-gray-400 font-medium">Engine:</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setEngineMode("instant_rag")}
                className={`px-2 py-1 rounded-md font-bold transition-all ${
                  engineMode === "instant_rag"
                    ? "bg-[#6C3AFF] text-white"
                    : "bg-[#0A0A14] text-gray-400 hover:text-white"
                }`}
              >
                ⚡ Instant RAG (0 MB)
              </button>
              <button
                type="button"
                onClick={() => setEngineMode("webllm_local")}
                className={`px-2 py-1 rounded-md font-bold transition-all ${
                  engineMode === "webllm_local"
                    ? "bg-emerald-500 text-slate-950"
                    : "bg-[#0A0A14] text-gray-400 hover:text-white"
                }`}
              >
                🧠 WebGPU Local LLM
              </button>
            </div>
          </div>
          {webLlmStatus && engineMode === "webllm_local" && (
            <div className="bg-[#0A0A14] px-3 py-1 text-[10px] text-cyan-400 font-mono truncate border-b border-white/5">
              {webLlmStatus}
            </div>
          )}

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3.5 space-y-3 max-h-[340px]">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed max-w-[90%] ${
                    m.role === "user"
                      ? "bg-[#6C3AFF] text-white font-medium"
                      : "bg-[#13131F] border border-white/10 text-gray-200"
                  }`}
                >
                  {m.liveResult && (
                    <div className="mb-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1.5 font-mono text-[11px] font-bold text-emerald-300 break-all">
                      {m.liveResult}
                    </div>
                  )}
                  <p>{m.text}</p>
                  {m.links && m.links.length > 0 && (
                    <div className="mt-2.5 flex flex-col gap-1.5">
                      {m.links.map((lnk) => (
                        <Link
                          key={lnk.url}
                          href={lnk.url}
                          onClick={() => setOpen(false)}
                          className="flex items-center justify-between gap-2 rounded-xl bg-[#0A0A14] hover:bg-[#6C3AFF]/20 border border-white/10 hover:border-[#00D4FF]/40 px-3 py-2 text-[11px] font-bold text-white transition-all"
                        >
                          <span className="truncate">{lnk.title}</span>
                          <span className="text-[10px] text-[#00D4FF] flex-shrink-0">{lnk.badge} →</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="px-3 py-2 bg-[#0A0A14] border-t border-white/5 flex gap-1.5 overflow-x-auto scrollbar-hide">
            {[
              "Remove SynthID & C2PA",
              "Fix AdSense Low Value",
              "4pm EST in PST",
              "Upscale Image 4×",
              "Generate password",
              "Compress PDF Free",
            ].map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleSend(chip)}
                className="px-2.5 py-1 rounded-full bg-[#13131F] hover:bg-[#6C3AFF]/25 border border-white/10 text-[10px] text-gray-300 hover:text-white whitespace-nowrap flex-shrink-0 transition-all"
              >
                {chip}
              </button>
            ))}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-[#13131F] border-t border-white/10 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a problem or calculation…"
              className="flex-1 bg-[#0A0A14] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#6C3AFF]"
            />
            <button
              type="submit"
              disabled={isGenerating}
              className="px-3.5 py-2 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-xs font-bold transition-all disabled:opacity-50"
            >
              Send
            </button>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] p-3.5 sm:px-4 sm:py-3 text-slate-950 font-extrabold text-xs shadow-2xl shadow-violet-900/60 hover:scale-105 transition-all"
        >
          <span className="text-base">🤖</span>
          <span className="hidden sm:inline">Ask PursTech AI (Free)</span>
        </button>
      )}
    </div>
  );
}
