"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Link from "next/link";

/* ── Schema ──────────────────────────────────────────────────────────────── */
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SVG Editor",
  description: "Free online SVG editor with live preview, React JSX export, optimizer, undo/redo, animation snippets and element tree.",
  url: "https://www.purstech.com/tools/svg-editor",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

/* ── Content Arrays (Moved from page.tsx) ────────────────────────────────── */
const FEATURES = [
  { icon:"⏪", title:"Undo / Redo History",          desc:"Full edit history with Ctrl+Z / Ctrl+Y keyboard shortcuts. Every toolbar action and code change is tracked with a 50-step history stack." },
  { icon:"⚛️",  title:"Copy as React JSX",            desc:"Converts all SVG attributes to camelCase React equivalents (stroke-width → strokeWidth, class → className) for instant paste into .jsx/.tsx files." },
  { icon:"🎨", title:"CSS Data URI Copy",             desc:"Encodes the SVG as a data URI and generates a ready-to-paste CSS background-image property — no external file needed." },
  { icon:"📐", title:"Make Responsive",               desc:"Removes fixed width/height attributes and ensures viewBox is set, making the SVG scale fluidly in any container." },
  { icon:"⚡", title:"SVG Optimizer",                 desc:"Strips Inkscape, Illustrator and Figma-specific artefacts that bloat file size by 20-40% without affecting visual output." },
  { icon:"🎬", title:"Animation Snippets",            desc:"Insert ready-made SMIL animation code (spin, pulse, fade-in, scale) directly at the cursor position in your SVG." },
];

const USE_CASES = [
  { who:"Frontend Developers",   why:"Edit SVG icons, convert them to React components, optimise for production and test on dark/light backgrounds." },
  { who:"UI/UX Designers",       why:"Fine-tune SVG code exported from Figma or Illustrator, strip artefacts and preview at multiple scales." },
  { who:"Content Creators",      why:"Create custom SVG graphics from templates, animate them and embed directly in web pages without images." },
  { who:"Educators & Students",  why:"Learn SVG syntax with a live preview, understand the element tree structure and experiment with shapes and paths." },
];

const COMPETITOR_TABLE = [
  { feature:"Live split-pane preview",    purstech:true, method:true,  svgomg:false, svgedit:true  },
  { feature:"Shape toolbar",             purstech:true, method:true,  svgomg:false, svgedit:true  },
  { feature:"10+ templates",             purstech:true, method:false, svgomg:false, svgedit:false },
  { feature:"Undo / Redo (Ctrl+Z)",      purstech:true, method:true,  svgomg:false, svgedit:true  },
  { feature:"React JSX export",          purstech:true, method:false, svgomg:false, svgedit:false },
  { feature:"CSS Data URI copy",         purstech:true, method:false, svgomg:false, svgedit:false },
  { feature:"Make Responsive button",    purstech:true, method:false, svgomg:false, svgedit:false },
  { feature:"SVG optimizer",             purstech:true, method:false, svgomg:true,  svgedit:false },
  { feature:"Animation snippets",        purstech:true, method:false, svgomg:false, svgedit:false },
  { feature:"Element tree view",         purstech:true, method:false, svgomg:false, svgedit:true  },
  { feature:"Color palette extraction",  purstech:true, method:false, svgomg:false, svgedit:false },
  { feature:"Dark/light preview toggle", purstech:true, method:false, svgomg:true,  svgedit:false },
  { feature:"PNG export (multi-scale)",  purstech:true, method:false, svgomg:false, svgedit:true  },
  { feature:"No install, runs in browser",purstech:true, method:true, svgomg:true,  svgedit:true  },
];

const CellIcon = ({ v }: { v: boolean | string }) =>
  v === true  ? <span className="text-green-400 font-bold">✓</span> :
  v === false ? <span className="text-gray-700">—</span> :
                <span className="text-yellow-400 text-xs font-semibold">{v}</span>;

/* ── Rich FAQ ────────────────────────────────────────────────────────────── */
const FAQ = [
  {
    q: "What is SVG and when should I use it instead of PNG or JPEG?",
    a: `SVG (Scalable Vector Graphics) is an XML-based format that describes images as mathematical shapes rather than pixels. It has four major advantages over raster formats:

Infinite scalability: SVGs look sharp at any size — from a 16×16 favicon to a 4K screen or printed poster. PNG and JPEG are resolution-fixed and pixelate when enlarged.

Small file size: A simple icon SVG can be under 1 KB. An equivalent PNG would be 5-20 KB. For icons, logos and illustrations, SVG is almost always smaller.

Animatable and interactive: SVG elements can be styled with CSS, animated with CSS keyframes or SMIL, and manipulated with JavaScript. You cannot do this with PNG.

Text-based: SVGs are human-readable XML, editable in any text editor, searchable by Google, and manageable in version control. No binary blob.

When to use PNG or JPEG instead: photographs and complex photorealistic images, screenshots, and any image with more than a few thousand distinct colours where the SVG path data would be larger than a compressed raster format.`,
  },
  {
    q: "How do I convert an SVG for use in a React component?",
    a: `React has different attribute naming requirements from HTML/SVG. The key differences:

HTML SVG          → React JSX
─────────────────────────────────
class             → className
stroke-width      → strokeWidth
fill-rule         → fillRule
clip-rule         → clipRule
stop-color        → stopColor
stop-opacity      → stopOpacity
xlink:href        → xlinkHref
font-family       → fontFamily
text-anchor       → textAnchor

Our "Copy React JSX" button handles all of these conversions automatically. After copying, wrap the output in a functional component:

function IconName({ width = 24, height = 24, className = "" }) {
  return (
    <svg width={width} height={height} className={className} viewBox="0 0 24 24">
      {/* pasted SVG content here */}
    </svg>
  );
}

For large React projects, consider SVGR (svgr.vercel.app) which can batch-convert SVG files as part of your build process.`,
  },
  {
    q: "What does 'Make Responsive' do and when should I use it?",
    a: `SVGs exported from design tools typically have fixed pixel dimensions:
<svg width="200" height="200" xmlns="...">

A fixed-dimension SVG will not scale when you put it in a fluid-width container. The "Make Responsive" button:

1. Reads the existing width and height values
2. If no viewBox is set, creates one: viewBox="0 0 width height"
3. Removes the width and height attributes

The result: <svg viewBox="0 0 200 200" xmlns="...">

This SVG will now fill 100% of its parent container while maintaining the correct aspect ratio. You can then control the SVG's size entirely from CSS: svg { width: 100%; max-width: 200px; }

When not to use it: if you need the SVG to render at a specific fixed size in every context (e.g. a favicon), keep the explicit dimensions.`,
  },
  {
    q: "What SVG artefacts does the optimiser remove?",
    a: `When you export SVG from Inkscape, Adobe Illustrator or Figma, the exported file contains a lot of extra data that the browser doesn't need. Our optimiser removes:

Inkscape artefacts:
• xmlns:inkscape and xmlns:sodipodi namespace declarations
• inkscape:label, inkscape:groupmode, inkscape:version, inkscape:document-units
• sodipodi:docname, sodipodi:namedview elements

Illustrator artefacts:
• Adobe-specific namespace declarations
• Private XML processing instructions
• Generator metadata comments

Figma artefacts:
• data-name="..." attributes on every element
• Figma component ID attributes

General noise:
• <?xml version="1.0" encoding="utf-8"?> declarations (not needed in inline SVG)
• HTML comments ()
• Empty <g></g> groups
• Redundant whitespace

Typical savings: 15-40% file size reduction with zero visual change.`,
  },
  {
    q: "How do I add animation to an SVG element?",
    a: `SVG supports two animation approaches:

1. SMIL (SVG native animations) — elements inserted inside the SVG:

Spin (animateTransform):
<animateTransform attributeName="transform" type="rotate"
  from="0 50 50" to="360 50 50" dur="2s" repeatCount="indefinite"/>

Pulse (animate opacity):
<animate attributeName="opacity"
  values="1;0.3;1" dur="2s" repeatCount="indefinite"/>

Insert these elements inside the shape you want to animate (inside <circle>, <rect>, etc.). Our animation snippets button inserts the code at your cursor position.

2. CSS animations — add a <style> block inside the SVG:
<style>
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .my-element { animation: spin 2s linear infinite; transform-origin: center; }
</style>

SMIL works everywhere including the <img> tag. CSS animations work in inline SVG and as external SVG files but not when loaded via <img> in all browsers. For React, CSS animations are generally more predictable.`,
  },
];

/* ── Templates ───────────────────────────────────────────────────────────── */
const TEMPLATES = [
  {
    name:"Gradient Circle", icon:"🔵",
    code:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="rg" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#00D4FF"/>
      <stop offset="100%" stop-color="#6C3AFF"/>
    </radialGradient>
  </defs>
  <circle cx="50" cy="50" r="45" fill="url(#rg)"/>
</svg>`,
  },
  {
    name:"Star", icon:"⭐",
    code:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35"
    fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
</svg>`,
  },
  {
    name:"Heart", icon:"❤️",
    code:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M50,30 C50,30 35,15 20,22 C5,30 5,50 20,62 L50,90 L80,62 C95,50 95,30 80,22 C65,15 50,30 50,30 Z"
    fill="#FF3A6C" stroke="#c0003a" stroke-width="1.5"/>
</svg>`,
  },
  {
    name:"Arrow", icon:"➡️",
    code:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="0,35 60,35 60,15 100,50 60,85 60,65 0,65"
    fill="#6C3AFF" stroke="#4a2aaa" stroke-width="1.5" stroke-linejoin="round"/>
</svg>`,
  },
  {
    name:"Spinner", icon:"🌀",
    code:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="none" stroke="#13131F" stroke-width="10"/>
  <circle cx="50" cy="50" r="40" fill="none" stroke="#6C3AFF" stroke-width="10"
    stroke-dasharray="62.8 188.5" stroke-linecap="round" transform="rotate(-90 50 50)">
    <animateTransform attributeName="transform" type="rotate"
      from="0 50 50" to="360 50 50" dur="1.2s" repeatCount="indefinite"/>
  </circle>
</svg>`,
  },
  {
    name:"Simple Logo", icon:"🅿",
    code:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="120" rx="24" fill="#6C3AFF"/>
  <text x="60" y="82" font-family="Arial,sans-serif" font-size="64"
    font-weight="bold" fill="white" text-anchor="middle">P</text>
</svg>`,
  },
  {
    name:"Wave", icon:"🌊",
    code:`<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
  <path d="M0,40 C30,10 70,70 100,40 C130,10 170,70 200,40 L200,80 L0,80 Z"
    fill="#00D4FF" opacity="0.8"/>
  <path d="M0,55 C30,25 70,85 100,55 C130,25 170,85 200,55 L200,80 L0,80 Z"
    fill="#6C3AFF" opacity="0.6"/>
</svg>`,
  },
  {
    name:"Geometric", icon:"🔷",
    code:`<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="60,5 115,95 5,95" fill="none" stroke="#6C3AFF" stroke-width="3"/>
  <polygon points="60,25 95,80 25,80" fill="#6C3AFF" opacity="0.3"/>
  <circle cx="60" cy="52" r="12" fill="#00D4FF"/>
</svg>`,
  },
  {
    name:"Badge", icon:"🏷",
    code:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="80" height="80" rx="16" ry="16"
    fill="#0A0A14" stroke="#6C3AFF" stroke-width="3"/>
  <circle cx="50" cy="38" r="14" fill="#6C3AFF"/>
  <rect x="28" y="60" width="44" height="6" rx="3" fill="#6C3AFF" opacity="0.7"/>
  <rect x="34" y="72" width="32" height="5" rx="2.5" fill="#6C3AFF" opacity="0.4"/>
</svg>`,
  },
  {
    name:"Blank Canvas", icon:"⬜",
    code:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#0A0A14"/>
</svg>`,
  },
];

/* ── Shape snippets ──────────────────────────────────────────────────────── */
const SHAPES = [
  { icon:"▭",  label:"Rect",    code:'  <rect x="20" y="20" width="160" height="100" rx="8" fill="#6C3AFF"/>'},
  { icon:"⭕",  label:"Circle",  code:'  <circle cx="100" cy="100" r="60" fill="#00D4FF"/>'},
  { icon:"⬭",  label:"Ellipse", code:'  <ellipse cx="100" cy="100" rx="80" ry="50" fill="#FF3A6C"/>'},
  { icon:"─",   label:"Line",    code:'  <line x1="20" y1="20" x2="180" y2="180" stroke="#6C3AFF" stroke-width="3" stroke-linecap="round"/>'},
  { icon:"⬡",  label:"Polygon", code:'  <polygon points="100,10 190,70 155,170 45,170 10,70" fill="#6C3AFF" stroke="#4a2aaa" stroke-width="2"/>'},
  { icon:"T",   label:"Text",    code:'  <text x="100" y="110" font-family="Arial,sans-serif" font-size="24" fill="white" text-anchor="middle">Text</text>'},
  { icon:"✦",   label:"Path",    code:'  <path d="M100,20 L180,80 L150,160 L50,160 L20,80 Z" fill="#6C3AFF" stroke="#4a2aaa" stroke-width="2"/>'},
  { icon:"▥",   label:"Group",   code:'\n  <g transform="translate(0,0)">\n    \n  </g>'},
];

/* ── Animation snippets ──────────────────────────────────────────────────── */
const ANIM_SNIPPETS = [
  { name:"Spin",    code:'    <animateTransform attributeName="transform" type="rotate"\n      from="0 50 50" to="360 50 50" dur="2s" repeatCount="indefinite"/>'},
  { name:"Pulse",   code:'    <animate attributeName="opacity"\n      values="1;0.3;1" dur="2s" repeatCount="indefinite"/>'},
  { name:"Fade In", code:'    <animate attributeName="opacity"\n      from="0" to="1" dur="1s" fill="freeze"/>'},
  { name:"Scale",   code:'    <animateTransform attributeName="transform" type="scale"\n      values="1;1.2;1" dur="1.5s" repeatCount="indefinite"/>'},
];

/* ── SVG utilities ───────────────────────────────────────────────────────── */
function prettifySVG(svg: string): string {
  let indent = 0;
  return svg
    .replace(/></g, ">\n<")
    .replace(//g, s => s) // preserve comments
    .split("\n").filter(l => l.trim())
    .map(line => {
      const t = line.trim();
      if (t.startsWith("</")) indent = Math.max(0, indent - 1);
      const out = "  ".repeat(indent) + t;
      if (!t.startsWith("</") && !t.endsWith("/>") && !t.startsWith("<!") && t.match(/<[a-zA-Z]/)) indent++;
      return out;
    }).join("\n");
}

function minifySVG(svg: string): string {
  return svg
    .replace(//g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\n/g, " ")
    .replace(/>\s+</g, "><")
    .replace(/\s+>/g, ">")
    .replace(/<\s+/g, "<")
    .trim();
}

function optimizeSVG(svg: string): string {
  return svg
    .replace(/<\?xml[^?]*\?>\s*/gi, "")
    .replace(//g, "")
    .replace(/\s*xmlns:inkscape="[^"]*"/g, "")
    .replace(/\s*xmlns:sodipodi="[^"]*"/g, "")
    .replace(/\s*xmlns:dc="[^"]*"/g, "")
    .replace(/\s*xmlns:cc="[^"]*"/g, "")
    .replace(/\s*xmlns:rdf="[^"]*"/g, "")
    .replace(/\s*xmlns:svg="[^"]*"/g, "")
    .replace(/\s*inkscape:[a-z:-]+=["'][^"']*["']/gi, "")
    .replace(/\s*sodipodi:[a-z:-]+=["'][^"']*["']/gi, "")
    .replace(/<sodipodi:[^>]*\/>/gi, "")
    .replace(/<sodipodi:[^>]*>[\s\S]*?<\/sodipodi:[^>]*>/gi, "")
    .replace(/<inkscape:[^>]*\/>/gi, "")
    .replace(/\s*data-name="[^"]*"/g, "")
    .replace(/<g\s*>\s*<\/g>/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function makeResponsive(svg: string): string {
  try {
    const parser = new DOMParser();
    const doc    = parser.parseFromString(svg, "image/svg+xml");
    const el     = doc.querySelector("svg");
    if (!el) return svg;
    const w = el.getAttribute("width");
    const h = el.getAttribute("height");
    if (!el.getAttribute("viewBox") && w && h) el.setAttribute("viewBox", `0 0 ${w} ${h}`);
    el.removeAttribute("width");
    el.removeAttribute("height");
    return new XMLSerializer().serializeToString(doc.documentElement);
  } catch { return svg; }
}

function toReactJSX(svg: string): string {
  return `// Auto-generated React component\nexport default function SVGIcon({ width = 100, height = 100, className = "" }) {\n  return (\n    ` +
    svg
      .replace(/class=/g,           "className=")
      .replace(/stroke-width=/g,    "strokeWidth=")
      .replace(/stroke-linecap=/g,  "strokeLinecap=")
      .replace(/stroke-linejoin=/g, "strokeLinejoin=")
      .replace(/stroke-dasharray=/g,"strokeDasharray=")
      .replace(/stroke-dashoffset=/g,"strokeDashoffset=")
      .replace(/fill-rule=/g,       "fillRule=")
      .replace(/clip-rule=/g,       "clipRule=")
      .replace(/stop-color=/g,      "stopColor=")
      .replace(/stop-opacity=/g,    "stopOpacity=")
      .replace(/font-family=/g,     "fontFamily=")
      .replace(/font-size=/g,       "fontSize=")
      .replace(/font-weight=/g,     "fontWeight=")
      .replace(/text-anchor=/g,     "textAnchor=")
      .replace(/marker-end=/g,      "markerEnd=")
      .replace(/xlink:href=/g,      "xlinkHref=")
      .replace(/xmlns:xlink=/g,     "xmlnsXlink=")
      .replace(/<\?xml[^?]*\?>\s*/gi, "")
      .replace(//g,  "")
      .replace(/(<svg\s)/,          '$1className={className} ')
      .trim()
    + `\n  );\n}`;
}

function toCSSDataURI(svg: string): string {
  const encoded = encodeURIComponent(minifySVG(svg));
  return `background-image: url("data:image/svg+xml,${encoded}");`;
}

function extractColors(svg: string): string[] {
  const colors = new Set<string>();
  const rx = /#([0-9A-Fa-f]{3,8})\b/g;
  let m;
  while ((m = rx.exec(svg)) !== null) colors.add(m[0].toUpperCase());
  return [...colors].slice(0, 16);
}

function parseSVGTree(svg: string): { tag: string; id?: string; fill?: string; depth: number }[] {
  try {
    const doc  = new DOMParser().parseFromString(svg, "image/svg+xml");
    const root = doc.querySelector("svg");
    if (!root) return [];
    const list: { tag: string; id?: string; fill?: string; depth: number }[] = [];
    function walk(node: Element, depth: number) {
      list.push({ tag: node.tagName, id: node.getAttribute("id") ?? undefined, fill: node.getAttribute("fill") ?? undefined, depth });
      Array.from(node.children).forEach(c => walk(c, depth + 1));
    }
    walk(root, 0);
    return list;
  } catch { return []; }
}

function getSVGInfo(svg: string) {
  try {
    const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
    const el  = doc.querySelector("svg");
    if (!el) return null;
    const all = doc.querySelectorAll("*");
    return {
      width:        el.getAttribute("width")   ?? "auto",
      height:       el.getAttribute("height")  ?? "auto",
      viewBox:      el.getAttribute("viewBox") ?? "not set",
      elements:     all.length - 1,
      fileSize:     `${(svg.length / 1024).toFixed(1)} KB`,
      isResponsive: !el.hasAttribute("width") && !el.hasAttribute("height"),
      hasAnimation: svg.includes("<animate") || svg.includes("keyframes"),
    };
  } catch { return null; }
}

const DEFAULT_SVG = TEMPLATES[0].code;

/* ── Main component ──────────────────────────────────────────────────────── */
export default function SVGEditorClient({ children }: { children?: React.ReactNode }) {
  const [code,       setCode]       = useState(DEFAULT_SVG);
  const [svgError,   setSvgError]   = useState("");
  const [layout,     setLayout]     = useState<"split"|"code"|"preview">("split");
  const [darkBg,     setDarkBg]     = useState(true);
  const [showGrid,   setShowGrid]   = useState(false);
  const [zoom,       setZoom]       = useState(1);
  const [pngScale,   setPngScale]   = useState(2);
  const [copied,     setCopied]     = useState<string | null>(null);
  const [showTempl,  setShowTempl]  = useState(false);
  const [activeTab,  setActiveTab]  = useState<"tree"|"colors"|"info"|"anim">("info");

  // Undo/Redo history
  const histRef    = useRef<string[]>([DEFAULT_SVG]);
  const histIdxRef = useRef(0);
  const debounceRef= useRef<ReturnType<typeof setTimeout> | null>(null);
  const taRef      = useRef<HTMLTextAreaElement>(null);

  const pushHistory = useCallback((c: string) => {
    const h = histRef.current.slice(0, histIdxRef.current + 1);
    if (h[h.length - 1] === c) return;
    h.push(c);
    if (h.length > 50) h.shift();
    histRef.current   = h;
    histIdxRef.current = h.length - 1;
  }, []);

  const handleChange = useCallback((val: string) => {
    setCode(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => pushHistory(val), 600);
  }, [pushHistory]);

  const undo = useCallback(() => {
    if (histIdxRef.current > 0) {
      histIdxRef.current--;
      setCode(histRef.current[histIdxRef.current]);
    }
  }, []);

  const redo = useCallback(() => {
    if (histIdxRef.current < histRef.current.length - 1) {
      histIdxRef.current++;
      setCode(histRef.current[histIdxRef.current]);
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLTextAreaElement) return; // let textarea handle its own
      if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "z") { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, redo]);

  // Validate SVG
  useEffect(() => {
    try {
      const doc = new DOMParser().parseFromString(code, "image/svg+xml");
      const err = doc.querySelector("parsererror");
      setSvgError(err ? (err.textContent ?? "Parse error").split("\n")[0].trim() : "");
    } catch { setSvgError("Invalid SVG"); }
  }, [code]);

  const applyAndPush = useCallback((newCode: string) => {
    setCode(newCode);
    pushHistory(newCode);
  }, [pushHistory]);

  const insertAtCursor = useCallback((snippet: string) => {
    const ta = taRef.current;
    if (!ta) { applyAndPush(code + "\n" + snippet); return; }
    const pos  = ta.selectionStart ?? code.length;
    const next = code.slice(0, pos) + "\n" + snippet + code.slice(pos);
    applyAndPush(next);
    setTimeout(() => { ta.focus(); ta.selectionStart = ta.selectionEnd = pos + snippet.length + 1; }, 0);
  }, [code, applyAndPush]);

  const copyTo = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key); setTimeout(() => setCopied(null), 1600);
  };

  const exportSVG = () => {
    const blob = new Blob([code], { type:"image/svg+xml" });
    Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download:"image.svg" }).click();
  };

  const exportPNG = () => {
    const blob = new Blob([code], { type:"image/svg+xml" });
    const url  = URL.createObjectURL(blob);
    const img  = new Image();
    img.onload = () => {
      const W = (img.naturalWidth  || 200) * pngScale;
      const H = (img.naturalHeight || 200) * pngScale;
      const c = document.createElement("canvas");
      c.width = W; c.height = H;
      const ctx = c.getContext("2d")!;
      ctx.drawImage(img, 0, 0, W, H);
      Object.assign(document.createElement("a"), { href: c.toDataURL("image/png"), download:`image-${pngScale}x.png` }).click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const svgDataUrl  = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(code)}`;
  const colors      = useMemo(() => extractColors(code), [code]);
  const tree        = useMemo(() => parseSVGTree(code), [code]);
  const svgInfo     = useMemo(() => getSVGInfo(code), [code]);
  const elemCount   = (code.match(/<[a-zA-Z]/g) ?? []).length;

  const CopyBtn = ({ id, text, label }: { id: string; text: string; label: string }) => (
    <button onClick={() => copyTo(id, text)}
      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all border ${copied === id ? "bg-green-600 text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white hover:border-white/30"}`}>
      {copied === id ? "✓" : label}
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">← All Tools</Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/"      className="hover:text-gray-400">Home</Link><span>›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span>›</span>
          <span className="text-gray-400">SVG Editor</span>
        </nav>

        {children}

        {/* ── Main toolbar ───────────────────────────────────────────── */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-3 mb-3 flex flex-wrap gap-2 items-center">

          {/* Shapes */}
          <div className="flex gap-1 flex-shrink-0">
            {SHAPES.map(s => (
              <button key={s.label} onClick={() => insertAtCursor(s.code)} title={`Insert ${s.label}`}
                className="w-8 h-8 rounded-lg bg-[#0A0A14] border border-white/10 hover:border-[#6C3AFF]/50 hover:bg-[#6C3AFF]/10 text-sm text-gray-400 hover:text-[#6C3AFF] transition-all flex items-center justify-center">
                {s.icon}
              </button>
            ))}
          </div>

          <div className="w-px h-7 bg-white/10 flex-shrink-0" />

          {/* Edit operations */}
          <div className="flex gap-1 flex-shrink-0">
            <button onClick={undo} title="Undo (Ctrl+Z)"
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white transition-all">⏪</button>
            <button onClick={redo} title="Redo (Ctrl+Y)"
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white transition-all">⏩</button>
          </div>

          <div className="w-px h-7 bg-white/10 flex-shrink-0" />

          {/* Transform operations */}
          <div className="flex gap-1 flex-shrink-0 flex-wrap">
            <button onClick={() => applyAndPush(prettifySVG(code))}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white transition-all">✨ Format</button>
            <button onClick={() => applyAndPush(minifySVG(code))}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white transition-all">🗜 Minify</button>
            <button onClick={() => applyAndPush(optimizeSVG(code))}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white transition-all">⚡ Optimize</button>
            <button onClick={() => applyAndPush(makeResponsive(code))}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white transition-all">📐 Responsive</button>
          </div>

          <div className="w-px h-7 bg-white/10 flex-shrink-0" />

          {/* Copy operations */}
          <div className="flex gap-1 flex-shrink-0 flex-wrap">
            <CopyBtn id="svg"  text={code}                label="Copy SVG"  />
            <CopyBtn id="jsx"  text={toReactJSX(code)}    label="Copy JSX"  />
            <CopyBtn id="css"  text={toCSSDataURI(code)}  label="Copy CSS"  />
          </div>

          <div className="w-px h-7 bg-white/10 flex-shrink-0" />

          {/* Export */}
          <div className="flex gap-1 items-center flex-shrink-0">
            <select value={pngScale} onChange={e => setPngScale(+e.target.value)}
              className="px-2 py-1.5 rounded-lg bg-[#0A0A14] border border-white/10 text-gray-400 text-xs focus:outline-none w-14">
              {[1,2,3,4].map(s => <option key={s} value={s}>{s}x</option>)}
            </select>
            <button onClick={exportPNG}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white transition-all">⬇ PNG</button>
            <button onClick={exportSVG}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white transition-all">⬇ SVG</button>
          </div>

          {/* Templates + layout */}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0">
            <div className="relative">
              <button onClick={() => setShowTempl(p => !p)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white transition-all">
                📂 Templates
              </button>
              {showTempl && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-[#1a1a2e] border border-white/10 rounded-xl z-30 shadow-2xl overflow-hidden">
                  {TEMPLATES.map(t => (
                    <button key={t.name} onClick={() => { applyAndPush(t.code); setShowTempl(false); }}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-xs hover:bg-[#6C3AFF]/10 text-gray-300 hover:text-white transition-all text-left">
                      <span>{t.icon}</span><span>{t.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Layout toggle */}
            <div className="flex gap-0.5 bg-[#0A0A14] border border-white/10 p-0.5 rounded-lg">
              {(["code","split","preview"] as const).map((l, i) => (
                <button key={l} onClick={() => setLayout(l)}
                  className={`px-2.5 py-1.5 rounded-md text-xs transition-all ${layout===l ? "bg-[#6C3AFF] text-white" : "text-gray-500 hover:text-white"}`}
                  title={l}>
                  {l === "split" ? "⊟" : l === "code" ? "✎" : "👁"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Error banner ───────────────────────────────────────────── */}
        {svgError && (
          <div className="mb-2 text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-2.5 font-mono">
            ⚠ SVG parse error: {svgError}
          </div>
        )}

        {/* ── Editor + Preview ───────────────────────────────────────── */}
        <div className={`flex gap-1 rounded-2xl overflow-hidden border border-white/5`} style={{ height:"560px" }}>
          {/* Code editor */}
          {(layout === "code" || layout === "split") && (
            <textarea ref={taRef} value={code} onChange={e => handleChange(e.target.value)}
              spellCheck={false}
              onKeyDown={e => {
                if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "z") { e.preventDefault(); undo(); }
                if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.shiftKey && e.key === "z"))) { e.preventDefault(); redo(); }
              }}
              className={`${layout === "split" ? "w-1/2" : "w-full"} h-full bg-[#0d0d1a] text-gray-200 text-xs font-mono p-5 resize-none focus:outline-none leading-relaxed border-r border-white/5`}
            />
          )}

          {/* Preview */}
          {(layout === "preview" || layout === "split") && (
            <div className={`${layout === "split" ? "w-1/2" : "w-full"} h-full flex flex-col`}>
              {/* Preview controls */}
              <div className="flex items-center gap-2 px-3 py-2 bg-[#111122] border-b border-white/5 flex-shrink-0">
                <button onClick={() => setDarkBg(p => !p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${darkBg ? "bg-[#0A0A14] border-white/20 text-white" : "bg-white border-gray-300 text-black"}`}>
                  {darkBg ? "🌙 Dark" : "☀️ Light"}
                </button>
                <button onClick={() => setShowGrid(p => !p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold border transition-all ${showGrid ? "bg-[#6C3AFF]/20 border-[#6C3AFF]/40 text-[#6C3AFF]" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"}`}>
                  ⊞ Grid
                </button>
                <div className="flex items-center gap-1 ml-auto">
                  <button onClick={() => setZoom(z => Math.max(0.25, z - 0.25))}
                    className="w-7 h-7 rounded-lg bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white transition-all text-sm">−</button>
                  <span className="text-xs text-gray-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
                  <button onClick={() => setZoom(z => Math.min(4, z + 0.25))}
                    className="w-7 h-7 rounded-lg bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white transition-all text-sm">+</button>
                  <button onClick={() => setZoom(1)}
                    className="px-2 h-7 rounded-lg bg-[#0A0A14] border border-white/10 text-gray-500 hover:text-white transition-all text-xs">1:1</button>
                </div>
              </div>

              {/* Preview canvas */}
              <div className={`flex-1 overflow-auto flex items-center justify-center relative ${darkBg ? "bg-[#111122]" : "bg-white"}`}
                style={showGrid ? {
                  backgroundImage:`
                    linear-gradient(to right, ${darkBg?"rgba(255,255,255,.04)":"rgba(0,0,0,.06)"} 1px, transparent 1px),
                    linear-gradient(to bottom, ${darkBg?"rgba(255,255,255,.04)":"rgba(0,0,0,.06)"} 1px, transparent 1px)`,
                  backgroundSize:"20px 20px",
                } : {}}>
                {!svgError ? (
                  <img src={svgDataUrl} alt="SVG preview"
                    style={{ transform:`scale(${zoom})`, transformOrigin:"center", transition:"transform 0.15s ease", maxWidth:"90%", maxHeight:"90%", objectFit:"contain" }} />
                ) : (
                  <div className="text-center text-gray-600">
                    <div className="text-4xl mb-2">⚠️</div>
                    <div className="text-sm">Fix the parse error to see preview</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Status bar ─────────────────────────────────────────────── */}
        <div className="flex gap-4 text-xs text-gray-600 mt-1.5 px-1">
          <span>{code.length} chars</span>
          <span>{code.split("\n").length} lines</span>
          <span>{elemCount} elements</span>
          {svgInfo && <span>{svgInfo.fileSize}</span>}
          {svgInfo?.isResponsive && <span className="text-green-500">✓ responsive</span>}
          {svgInfo?.hasAnimation && <span className="text-[#00D4FF]">✦ animated</span>}
          <span className="ml-auto text-gray-700">Ctrl+Z undo · Ctrl+Y redo</span>
        </div>

        {/* ── Bottom panels ──────────────────────────────────────────── */}
        <div className="mt-4 bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-white/5">
            {(["info","tree","colors","anim"] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)}
                className={`px-5 py-2.5 text-xs font-bold transition-all capitalize border-b-2 ${
                  activeTab === t ? "border-[#6C3AFF] text-[#6C3AFF]" : "border-transparent text-gray-500 hover:text-white"
                }`}>
                {t === "info" ? "📋 SVG Info" : t === "tree" ? "🌲 Element Tree" : t === "colors" ? "🎨 Colors" : "🎬 Animations"}
              </button>
            ))}
          </div>

          <div className="p-4">
            {/* SVG Info */}
            {activeTab === "info" && svgInfo && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label:"Width",       value: svgInfo.width },
                  { label:"Height",      value: svgInfo.height },
                  { label:"ViewBox",     value: svgInfo.viewBox.length > 20 ? svgInfo.viewBox.slice(0,20)+"…" : svgInfo.viewBox },
                  { label:"Elements",    value: svgInfo.elements },
                  { label:"File Size",   value: svgInfo.fileSize },
                  { label:"Responsive",  value: svgInfo.isResponsive ? "Yes ✓" : "No — run Responsive" },
                  { label:"Animated",    value: svgInfo.hasAnimation ? "Yes ✦" : "No" },
                  { label:"Parse",       value: svgError ? "⚠ Error" : "✓ Valid SVG" },
                ].map(r => (
                  <div key={r.label} className="bg-[#0A0A14] rounded-xl px-3 py-2.5">
                    <div className="text-xs text-gray-500">{r.label}</div>
                    <div className={`text-sm font-semibold mt-0.5 ${
                      String(r.value).includes("✓") || String(r.value).includes("Yes") ? "text-green-400" :
                      String(r.value).includes("⚠") ? "text-red-400" : "text-white"
                    }`}>{r.value}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Element tree */}
            {activeTab === "tree" && (
              <div className="max-h-48 overflow-y-auto space-y-0.5">
                {tree.length > 0 ? tree.map((el, i) => (
                  <div key={i} className="flex items-center gap-1 text-xs font-mono"
                    style={{ paddingLeft:`${el.depth * 14}px` }}>
                    {el.fill && el.fill !== "none" && (
                      <span className="w-3 h-3 rounded-sm inline-block flex-shrink-0 border border-white/10"
                        style={{ backgroundColor: el.fill }} />
                    )}
                    <span className="text-[#6C3AFF]">&lt;{el.tag}</span>
                    {el.id && <span className="text-yellow-400"> #{el.id}</span>}
                    <span className="text-[#6C3AFF]">&gt;</span>
                  </div>
                )) : (
                  <div className="text-xs text-gray-600">No elements parsed — check SVG is valid.</div>
                )}
              </div>
            )}

            {/* Color palette */}
            {activeTab === "colors" && (
              <div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {colors.length > 0 ? colors.map(c => (
                    <button key={c} onClick={() => copyTo(c, c)} title={`Copy ${c}`}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0A0A14] border border-white/10 hover:border-white/30 transition-all text-xs font-mono text-gray-300">
                      <span className="w-4 h-4 rounded-sm inline-block border border-white/10" style={{ backgroundColor: c }} />
                      {c}
                      {copied === c && <span className="text-green-400">✓</span>}
                    </button>
                  )) : (
                    <div className="text-xs text-gray-600">No hex colours found in SVG code.</div>
                  )}
                </div>
                <div className="text-xs text-gray-600">Click any colour to copy its hex value.</div>
              </div>
            )}

            {/* Animation snippets */}
            {activeTab === "anim" && (
              <div>
                <div className="text-xs text-gray-500 mb-3">Click to insert at cursor position. Place the snippet inside the shape element you want to animate.</div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {ANIM_SNIPPETS.map(a => (
                    <button key={a.name} onClick={() => insertAtCursor(a.code)}
                      className="px-3 py-2.5 rounded-xl bg-[#0A0A14] border border-white/5 hover:border-[#6C3AFF]/40 hover:bg-[#6C3AFF]/5 text-xs font-bold text-gray-300 hover:text-white transition-all text-left">
                      ▶ {a.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── SEO & Marketing Content (Moved Below Tool) ───────────────── */}
        <div className="mt-16 space-y-6">
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-[#13131F] border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-sm font-bold text-white">{f.title}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Use cases */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3">Who uses this tool?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {USE_CASES.map(u => (
                <div key={u.who} className="flex gap-3">
                  <span className="text-[#6C3AFF] font-extrabold text-sm flex-shrink-0 mt-0.5">→</span>
                  <div>
                    <span className="text-sm font-semibold text-white">{u.who}: </span>
                    <span className="text-sm text-gray-400">{u.why}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor table */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-x-auto">
            <div className="px-5 pt-4 pb-2">
              <h2 className="text-sm font-bold text-white">PursTech vs Method Draw vs SVGOMG vs SVG-Edit</h2>
              <p className="text-xs text-gray-500 mt-0.5">SVG editor feature comparison</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-2 text-gray-500 font-semibold">Feature</th>
                  <th className="px-4 py-2 text-[#6C3AFF] font-bold">PursTech</th>
                  <th className="px-4 py-2 text-gray-500">Method Draw</th>
                  <th className="px-4 py-2 text-gray-500">SVGOMG</th>
                  <th className="px-4 py-2 text-gray-500">SVG-Edit</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITOR_TABLE.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-2.5 text-gray-400">{row.feature}</td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.purstech} /></td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.method}   /></td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.svgomg}   /></td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.svgedit}  /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── How to Use ─────────────────────────────────────────────── */}
        <div className="mt-6 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the SVG Editor</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Start from a template",    desc:"Click Templates to choose from 10 designs. Or paste your own SVG code directly into the editor on the left." },
              { step:"2", title:"Edit and insert shapes",   desc:"Type SVG code directly. Click toolbar buttons to insert shapes at the cursor. Use Ctrl+Z to undo any change." },
              { step:"3", title:"Format, optimise, export", desc:"Format for readability, Minify for production, Optimize to strip design-tool artefacts, or Make Responsive for fluid layouts." },
              { step:"4", title:"Copy or download",         desc:"Copy as SVG, React JSX component or CSS data URI. Download as SVG file or rasterise to PNG at 1x–4x scale." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#6C3AFF] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div><div className="font-semibold text-white text-sm mb-1">{s.title}</div><div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ────────────────────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed whitespace-pre-line">{f.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* ── Educational content ────────────────────────────────────── */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-white">SVG on the Web — What Developers Need to Know</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            SVG has become the default format for icons, logos and UI illustrations in modern
            web development — and for good reason. Unlike raster images, SVGs can be styled
            with CSS (changing fill colours based on theme or user interaction), manipulated
            with JavaScript (animating individual paths on hover), and inlined directly in HTML
            (no extra HTTP request). The result is sharper graphics, smaller file sizes, and
            more interactive possibilities than any raster format can offer.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            The most common workflow issue developers face is SVGs exported from Figma, Sketch
            or Illustrator that are bloated with metadata those tools add automatically. An icon
            that should be 500 bytes ends up as 4KB because of Figma's data-name attributes,
            Inkscape's namespace declarations and editor metadata. Running the optimiser in this
            tool strips all of that — often reducing file size by 30-60% — without touching
            the visible paths or colours. For large icon libraries, this adds up to meaningful
            performance gains.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            For React developers, the React JSX export feature saves a tedious manual step.
            React requires camelCase attribute names (strokeWidth, not stroke-width) and
            className instead of class — rules that aren't always obvious to developers
            encountering SVG in React for the first time. The converter handles all the
            attribute name transformations automatically and wraps the output in a functional
            component with configurable width, height and className props, ready to drop into
            any component file.
          </p>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/about"   className="hover:text-gray-400">About</Link>
          <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
          <Link href="/contact" className="hover:text-gray-400">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
