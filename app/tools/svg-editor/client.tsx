"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

// ✅ SCHEMA removed — now server-rendered as WebApplication in page.tsx

/* ── Content Arrays — Rule 10: module scope, .map() calls below match ────── */
const FEATURES = [
  { icon:"⏪", title:"Undo / Redo History",          desc:"Full edit history with Ctrl+Z / Ctrl+Y keyboard shortcuts. Every toolbar action and code change is tracked with a 50-step history stack." },
  { icon:"⚛️",  title:"Copy as React JSX",            desc:"Converts all SVG attributes to camelCase React equivalents (stroke-width → strokeWidth, class → className) for instant paste into .jsx/.tsx files." },
  { icon:"🎨", title:"CSS Data URI Copy",             desc:"Encodes the SVG as a data URI and generates a ready-to-paste CSS background-image property — no external file needed." },
  { icon:"📐", title:"Make Responsive",               desc:"Removes fixed width/height attributes and ensures viewBox is set, making the SVG scale fluidly in any container." },
  { icon:"⚡", title:"SVG Optimizer",                 desc:"Strips Inkscape, Illustrator and Figma-specific artefacts that bloat file size by 20-40% without affecting visual output." },
  { icon:"🎬", title:"Animation Snippets",            desc:"Insert ready-made SMIL animation code (spin, pulse, fade-in, scale) directly at the cursor position in your SVG." },
];

const USE_CASES = [
  { who:"Frontend Developers",  why:"Edit SVG icons, convert them to React components, optimise for production and test on dark/light backgrounds." },
  { who:"UI/UX Designers",      why:"Fine-tune SVG code exported from Figma or Illustrator, strip artefacts and preview at multiple scales." },
  { who:"Content Creators",     why:"Create custom SVG graphics from templates, animate them and embed directly in web pages without images." },
  { who:"Educators & Students", why:"Learn SVG syntax with a live preview, understand the element tree structure and experiment with shapes and paths." },
];

const COMPETITOR_TABLE = [
  { feature:"Live split-pane preview",     purstech:true, method:true,  svgomg:false, svgedit:true  },
  { feature:"Shape toolbar",               purstech:true, method:true,  svgomg:false, svgedit:true  },
  { feature:"10+ templates",               purstech:true, method:false, svgomg:false, svgedit:false },
  { feature:"Undo / Redo (Ctrl+Z)",        purstech:true, method:true,  svgomg:false, svgedit:true  },
  { feature:"React JSX export",            purstech:true, method:false, svgomg:false, svgedit:false },
  { feature:"CSS Data URI copy",           purstech:true, method:false, svgomg:false, svgedit:false },
  { feature:"Make Responsive button",      purstech:true, method:false, svgomg:false, svgedit:false },
  { feature:"SVG optimizer",               purstech:true, method:false, svgomg:true,  svgedit:false },
  { feature:"Animation snippets",          purstech:true, method:false, svgomg:false, svgedit:false },
  { feature:"Element tree view",           purstech:true, method:false, svgomg:false, svgedit:true  },
  { feature:"Color palette extraction",    purstech:true, method:false, svgomg:false, svgedit:false },
  { feature:"Dark/light preview toggle",   purstech:true, method:false, svgomg:true,  svgedit:false },
  { feature:"PNG export (multi-scale)",    purstech:true, method:false, svgomg:false, svgedit:true  },
  { feature:"No install, runs in browser", purstech:true, method:true,  svgomg:true,  svgedit:true  },
];

const CellIcon = ({ v }: { v: boolean | string }) =>
  v === true  ? <span className="text-green-400 font-bold">✓</span> :
  v === false ? <span className="text-gray-700">—</span> :
                <span className="text-yellow-400 text-xs font-semibold">{v}</span>;

/* ── Rule 8: FAQ uses <details>/<summary> ─────────────────────────────────── */
const FAQ = [
  { q:"How do I add animation to an SVG?",
    a:"SVG supports SMIL animations inserted directly inside SVG elements. For example, to spin an element add <animateTransform attributeName='transform' type='rotate' from='0 50 50' to='360 50 50' dur='2s' repeatCount='indefinite'/> inside it. Our animation snippets panel provides ready-to-insert SMIL code for spin, pulse, fade-in and scale animations." },
  { q:"What does SVG optimisation do and how much can it reduce file size?",
    a:"Our optimiser removes XML declarations, HTML comments, empty groups, Inkscape namespace attributes, Sodipodi attributes, Adobe Illustrator private data, and Figma data-name attributes. These artefacts can represent 20-40% of SVG file size exported from vector design tools, with zero visual change." },
  { q:"What is a viewBox and why is it important for responsive SVGs?",
    a:"The viewBox attribute defines the internal coordinate system of an SVG. When you remove fixed width and height and keep only viewBox, the SVG becomes responsive and scales to fill its container. Our Make Responsive button automatically adds viewBox from the existing dimensions if missing, then removes the fixed width and height attributes." },
  { q:"How do I convert an SVG to a React (JSX) component?",
    a:"Click Copy as React — the editor converts attributes to camelCase (stroke-width becomes strokeWidth, class becomes className) and wraps the markup as a ready-to-paste JSX component. Works with any template or your own SVG." },
  { q:"What is SVG and when should I use it instead of PNG or JPEG?",
    a:`SVG (Scalable Vector Graphics) is an XML-based format that describes images as mathematical shapes rather than pixels. It has four major advantages over raster formats:

Infinite scalability: SVGs look sharp at any size — from a 16×16 favicon to a 4K screen. PNG and JPEG are resolution-fixed and pixelate when enlarged.

Small file size: A simple icon SVG can be under 1 KB. An equivalent PNG would be 5-20 KB.

Animatable and interactive: SVG elements can be styled with CSS, animated and manipulated with JavaScript. You cannot do this with PNG.

Text-based: SVGs are human-readable XML, editable in any text editor and manageable in version control.

When to use PNG or JPEG instead: photographs, screenshots, and any image with more than a few thousand distinct colours where SVG path data would be larger than a compressed raster format.` },
  { q:"How do I convert an SVG for use in a React component?",
    a:`React has different attribute naming requirements from HTML/SVG. The key differences:

HTML SVG → React JSX
class → className
stroke-width → strokeWidth
fill-rule → fillRule
clip-rule → clipRule
stop-color → stopColor
xlink:href → xlinkHref
font-family → fontFamily
text-anchor → textAnchor

Our "Copy React JSX" button handles all of these conversions automatically. After copying, wrap the output in a functional component:

function IconName({ width = 24, height = 24, className = "" }) {
  return (
    <svg width={width} height={height} className={className} viewBox="0 0 24 24">
      {/* pasted SVG content here */}
    </svg>
  );
}

For large React projects, consider SVGR which can batch-convert SVG files as part of your build process.` },
  { q:"What does 'Make Responsive' do and when should I use it?",
    a:`SVGs exported from design tools typically have fixed pixel dimensions:
<svg width="200" height="200" xmlns="...">

A fixed-dimension SVG will not scale when you put it in a fluid-width container. The "Make Responsive" button:

1. Reads the existing width and height values
2. If no viewBox is set, creates one: viewBox="0 0 width height"
3. Removes the width and height attributes

Result: <svg viewBox="0 0 200 200" xmlns="...">

This SVG will now fill 100% of its parent container while maintaining the correct aspect ratio. Control the size from CSS: svg { width: 100%; max-width: 200px; }

When not to use it: if you need the SVG to render at a specific fixed size (e.g. a favicon), keep the explicit dimensions.` },
  { q:"What SVG artefacts does the optimiser remove?",
    a:`When you export SVG from Inkscape, Illustrator or Figma, the file contains extra data the browser doesn't need. Our optimiser removes:

Inkscape artefacts: xmlns:inkscape and xmlns:sodipodi namespace declarations, inkscape:label, inkscape:version, sodipodi:docname, sodipodi:namedview elements.

Illustrator artefacts: Adobe-specific namespace declarations, private XML processing instructions.

Figma artefacts: data-name attributes on every element, Figma component ID attributes.

General noise: XML declarations, HTML comments, empty <g></g> groups, redundant whitespace.

Typical savings: 15-40% file size reduction with zero visual change.` },
  { q:"How do I add animation to an SVG element?",
    a:`SVG supports two animation approaches:

1. SMIL (SVG native animations) — insert inside the SVG element:

Spin: <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="2s" repeatCount="indefinite"/>

Pulse: <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite"/>

Insert these inside the shape you want to animate (<circle>, <rect>, etc.). Our animation snippets button inserts code at your cursor position.

2. CSS animations — add a <style> block inside the SVG:
<style>
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .my-element { animation: spin 2s linear infinite; transform-origin: center; }
</style>

SMIL works everywhere including the <img> tag. CSS animations work in inline SVG and as external SVG files.` },
];

/* ── Templates ───────────────────────────────────────────────────────────── */
const TEMPLATES = [
  { name:"Gradient Circle", icon:"🔵", code:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <defs><radialGradient id="rg" cx="35%" cy="35%" r="65%"><stop offset="0%" stop-color="#00D4FF"/><stop offset="100%" stop-color="#6C3AFF"/></radialGradient></defs>
  <circle cx="50" cy="50" r="45" fill="url(#rg)"/>
</svg>` },
  { name:"Star",         icon:"⭐", code:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="50,5 61,35 95,35 68,57 79,91 50,70 21,91 32,57 5,35 39,35" fill="#FFD700" stroke="#FFA500" stroke-width="2"/>
</svg>` },
  { name:"Heart",        icon:"❤️", code:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <path d="M50,30 C50,30 35,15 20,22 C5,30 5,50 20,62 L50,90 L80,62 C95,50 95,30 80,22 C65,15 50,30 50,30 Z" fill="#FF3A6C" stroke="#c0003a" stroke-width="1.5"/>
</svg>` },
  { name:"Arrow",        icon:"➡️", code:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="0,35 60,35 60,15 100,50 60,85 60,65 0,65" fill="#6C3AFF" stroke="#4a2aaa" stroke-width="1.5" stroke-linejoin="round"/>
</svg>` },
  { name:"Spinner",      icon:"🌀", code:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="40" fill="none" stroke="#13131F" stroke-width="10"/>
  <circle cx="50" cy="50" r="40" fill="none" stroke="#6C3AFF" stroke-width="10" stroke-dasharray="62.8 188.5" stroke-linecap="round" transform="rotate(-90 50 50)">
    <animateTransform attributeName="transform" type="rotate" from="0 50 50" to="360 50 50" dur="1.2s" repeatCount="indefinite"/>
  </circle>
</svg>` },
  { name:"Simple Logo",  icon:"🅿", code:`<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <rect width="120" height="120" rx="24" fill="#6C3AFF"/>
  <text x="60" y="82" font-family="Arial,sans-serif" font-size="64" font-weight="bold" fill="white" text-anchor="middle">P</text>
</svg>` },
  { name:"Wave",         icon:"🌊", code:`<svg viewBox="0 0 200 80" xmlns="http://www.w3.org/2000/svg">
  <path d="M0,40 C30,10 70,70 100,40 C130,10 170,70 200,40 L200,80 L0,80 Z" fill="#00D4FF" opacity="0.8"/>
  <path d="M0,55 C30,25 70,85 100,55 C130,25 170,85 200,55 L200,80 L0,80 Z" fill="#6C3AFF" opacity="0.6"/>
</svg>` },
  { name:"Geometric",    icon:"🔷", code:`<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
  <polygon points="60,5 115,95 5,95" fill="none" stroke="#6C3AFF" stroke-width="3"/>
  <polygon points="60,25 95,80 25,80" fill="#6C3AFF" opacity="0.3"/>
  <circle cx="60" cy="52" r="12" fill="#00D4FF"/>
</svg>` },
  { name:"Badge",        icon:"🏷", code:`<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <rect x="10" y="10" width="80" height="80" rx="16" ry="16" fill="#0A0A14" stroke="#6C3AFF" stroke-width="3"/>
  <circle cx="50" cy="38" r="14" fill="#6C3AFF"/>
  <rect x="28" y="60" width="44" height="6" rx="3" fill="#6C3AFF" opacity="0.7"/>
  <rect x="34" y="72" width="32" height="5" rx="2.5" fill="#6C3AFF" opacity="0.4"/>
</svg>` },
  { name:"Blank Canvas", icon:"⬜", code:`<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="200" fill="#0A0A14"/>
</svg>` },
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

/* ── SVG utilities ────────────────────────────────────────────────────────── */
const htmlCommentRegex = new RegExp("", "g");
const xmlDeclRegex     = new RegExp("<\\?xml[^?]*\\?>\\s*", "gi");

function prettifySVG(svg: string): string {
  let indent = 0;
  return svg
    .replace(/></g, ">\n<")
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
    .replace(htmlCommentRegex, "")
    .replace(/\s{2,}/g, " ").replace(/\n/g, " ")
    .replace(/>\s+</g, "><").replace(/\s+>/g, ">").replace(/<\s+/g, "<")
    .trim();
}

function optimizeSVG(svg: string): string {
  return svg
    .replace(xmlDeclRegex, "")
    .replace(htmlCommentRegex, "")
    .replace(/\s*xmlns:inkscape="[^"]*"/g, "")
    .replace(/\s*xmlns:sodipodi="[^"]*"/g, "")
    .replace(/\s*xmlns:dc="[^"]*"/g, "")
    .replace(/\s*xmlns:cc="[^"]*"/g, "")
    .replace(/\s*xmlns:rdf="[^"]*"/g, "")
    .replace(/\s*inkscape:[a-z:-]+=["'][^"']*["']/gi, "")
    .replace(/\s*sodipodi:[a-z:-]+=["'][^"']*["']/gi, "")
    .replace(/<sodipodi:[^>]*\/>/gi, "")
    .replace(/<g\s*>\s*<\/g>/gi, "")
    .replace(/\s*data-name="[^"]*"/g, "")
    .replace(/\s{2,}/g, " ").trim();
}

function makeResponsive(svg: string): string {
  try {
    const doc = new DOMParser().parseFromString(svg, "image/svg+xml");
    const el  = doc.querySelector("svg");
    if (!el) return svg;
    const w = el.getAttribute("width"), h = el.getAttribute("height");
    if (!el.getAttribute("viewBox") && w && h) el.setAttribute("viewBox", `0 0 ${w} ${h}`);
    el.removeAttribute("width"); el.removeAttribute("height");
    return new XMLSerializer().serializeToString(doc.documentElement);
  } catch { return svg; }
}

function toReactJSX(svg: string): string {
  return `// Auto-generated React component\nexport default function SVGIcon({ width = 100, height = 100, className = "" }) {\n  return (\n    ` +
    svg
      .replace(xmlDeclRegex, "").replace(htmlCommentRegex, "")
      .replace(/class=/g,             "className=")
      .replace(/stroke-width=/g,      "strokeWidth=")
      .replace(/stroke-linecap=/g,    "strokeLinecap=")
      .replace(/stroke-linejoin=/g,   "strokeLinejoin=")
      .replace(/stroke-dasharray=/g,  "strokeDasharray=")
      .replace(/stroke-dashoffset=/g, "strokeDashoffset=")
      .replace(/fill-rule=/g,         "fillRule=")
      .replace(/clip-rule=/g,         "clipRule=")
      .replace(/stop-color=/g,        "stopColor=")
      .replace(/stop-opacity=/g,      "stopOpacity=")
      .replace(/font-family=/g,       "fontFamily=")
      .replace(/font-size=/g,         "fontSize=")
      .replace(/font-weight=/g,       "fontWeight=")
      .replace(/text-anchor=/g,       "textAnchor=")
      .replace(/xlink:href=/g,        "xlinkHref=")
      .replace(/(<svg\s)/,            '$1className={className} ')
      .trim()
    + `\n  );\n}`;
}

function toCSSDataURI(svg: string): string {
  return `background-image: url("data:image/svg+xml,${encodeURIComponent(minifySVG(svg))}");`;
}

function extractColors(svg: string): string[] {
  const colors = new Set<string>();
  const rx = /#([0-9A-Fa-f]{3,8})\b/g;
  let m;
  while ((m = rx.exec(svg)) !== null) colors.add(m[0].toUpperCase());
  return [...colors].slice(0, 16);
}

function parseSVGTree(svg: string): { tag:string; id?:string; fill?:string; depth:number }[] {
  try {
    const doc  = new DOMParser().parseFromString(svg, "image/svg+xml");
    const root = doc.querySelector("svg");
    if (!root) return [];
    const list: { tag:string; id?:string; fill?:string; depth:number }[] = [];
    function walk(node: Element, depth: number) {
      list.push({ tag:node.tagName, id:node.getAttribute("id")??undefined, fill:node.getAttribute("fill")??undefined, depth });
      Array.from(node.children).forEach(c => walk(c, depth+1));
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
    return {
      width:        el.getAttribute("width")   ?? "auto",
      height:       el.getAttribute("height")  ?? "auto",
      viewBox:      el.getAttribute("viewBox") ?? "not set",
      elements:     doc.querySelectorAll("*").length - 1,
      fileSize:     `${(svg.length / 1024).toFixed(1)} KB`,
      isResponsive: !el.hasAttribute("width") && !el.hasAttribute("height"),
      hasAnimation: svg.includes("<animate") || svg.includes("keyframes"),
    };
  } catch { return null; }
}

const DEFAULT_SVG = TEMPLATES[0].code;

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function SVGEditorClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("svg-editor", "dev"); // ✅ Rule 3

  const [code,         setCode]         = useState(DEFAULT_SVG);
  const [bg,           setBg]           = useState<"dark"|"light"|"transparent">("dark");
  const [showGrid,     setShowGrid]     = useState(false);
  const [zoom,         setZoom]         = useState(1);
  const [activeTab,    setActiveTab]    = useState<"elements"|"colors"|"info">("elements");
  const [showTemplates,setShowTemplates]= useState(false);
  const [showAnims,    setShowAnims]    = useState(false);
  const [copiedJSX,    setCopiedJSX]    = useState(false);
  const [copiedCSS,    setCopiedCSS]    = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const canvasRef   = useRef<HTMLCanvasElement>(null);

  // Undo/redo via refs (no re-render on history changes)
  const history = useRef<string[]>([DEFAULT_SVG]);
  const histIdx = useRef<number>(0);

  const push = (c: string) => {
    history.current = [...history.current.slice(0, histIdx.current + 1), c].slice(-50);
    histIdx.current = history.current.length - 1;
  };
  const handleChange = (val: string) => { setCode(val); push(val); };
  const undo = useCallback(() => {
    if (histIdx.current > 0) { histIdx.current--; setCode(history.current[histIdx.current]); }
  }, []);
  const redo = useCallback(() => {
    if (histIdx.current < history.current.length - 1) { histIdx.current++; setCode(history.current[histIdx.current]); }
  }, []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.ctrlKey || e.metaKey) && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [undo, redo]);

  const svgInfo  = useMemo(() => getSVGInfo(code),   [code]);
  const colors   = useMemo(() => extractColors(code), [code]);
  const elements = useMemo(() => parseSVGTree(code),  [code]);

  const insertAtCursor = (snippet: string) => {
    const ta    = textareaRef.current;
    const start = ta?.selectionStart ?? code.length;
    const end   = ta?.selectionEnd   ?? start;
    const next  = code.substring(0, start) + snippet + code.substring(end);
    setCode(next); push(next);
    requestAnimationFrame(() => { if (ta) { ta.selectionStart = ta.selectionEnd = start + snippet.length; ta.focus(); } });
  };

  // Toolbar actions
  const applyFn = (fn: (s:string)=>string) => { const c = fn(code); setCode(c); push(c); };

  // Export
  const copyJSX = () => { navigator.clipboard.writeText(toReactJSX(code)); setCopiedJSX(true); setTimeout(()=>setCopiedJSX(false), 2000); };
  const copyCSS = () => { navigator.clipboard.writeText(toCSSDataURI(code)); setCopiedCSS(true); setTimeout(()=>setCopiedCSS(false), 2000); };
  const downloadSVG = () => {
    const b = new Blob([code], { type:"image/svg+xml" });
    Object.assign(document.createElement("a"), { href:URL.createObjectURL(b), download:"image.svg" }).click();
  };
  const exportPNG = (scale: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const img = new Image();
    const b   = new Blob([code], { type:"image/svg+xml" });
    const url = URL.createObjectURL(b);
    img.onload = () => {
      const sz = 200 * scale;
      canvas.width = sz; canvas.height = sz;
      canvas.getContext("2d")?.drawImage(img, 0, 0, sz, sz);
      Object.assign(document.createElement("a"), { href:canvas.toDataURL(), download:`svg-${scale}x.png` }).click();
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  const bgStyle = bg === "dark" ? "bg-[#0A0A14]" : bg === "light" ? "bg-white" : "bg-[#0d0d1a] [background-image:repeating-conic-gradient(#13131F_0%_25%,#1a1a2e_0%_50%)] [background-size:20px_20px]";
  const lineCount = code.split("\n").length;
  const fileSize  = (code.length / 1024).toFixed(1);

  // ✅ QA FIX: Re-added svgDataUrl to allow <img> tag preview
  const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(code)}`;

  return (
    // ✅ Rule 6: flex flex-col overflow-x-hidden
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      {/* ── Navbar — Rule 4: sticky + backdrop-blur + Go Pro ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      {/* ✅ Rule 7: flex-grow w-full */}
      <main className="max-w-7xl mx-auto px-4 py-10 flex-grow w-full">

        {/* ✅ Rule 11: aria-label + /categories/dev + aria-hidden */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/dev" className="hover:text-gray-400">Dev Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">SVG Editor</span>
        </nav>

        {/* Server-rendered hero */}
        {children}

        {/* ✅ QA FIX: min-w-0 w-full added to protect layout boundaries */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 mb-10 min-w-0 w-full">

          {/* ── Left: Editor ── */}
          <div className="min-w-0 flex flex-col bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">

            {/* Shape toolbar */}
            <div className="px-3 py-2 border-b border-white/5 flex flex-wrap gap-1 items-center">
              {SHAPES.map(s => (
                <button key={s.label} onClick={() => insertAtCursor("\n" + s.code)}
                  title={s.label}
                  className="px-2 py-1 rounded-lg bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white text-xs transition-all flex items-center gap-1">
                  <span>{s.icon}</span><span className="hidden sm:inline">{s.label}</span>
                </button>
              ))}
            </div>

            {/* Action toolbar */}
            <div className="px-3 py-2 border-b border-white/5 flex flex-wrap gap-1 items-center justify-between">
              <div className="flex flex-wrap gap-1">
                <button onClick={() => setShowTemplates(p=>!p)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all border ${showTemplates ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/5 text-gray-400 hover:text-white"}`}>
                  📄 Templates
                </button>
                <button onClick={() => applyFn(prettifySVG)}  className="px-2 py-1 rounded-lg bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white text-xs transition-all">Format</button>
                <button onClick={() => applyFn(minifySVG)}    className="px-2 py-1 rounded-lg bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white text-xs transition-all">Minify</button>
                <button onClick={() => applyFn(optimizeSVG)}  className="px-2 py-1 rounded-lg bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white text-xs transition-all">⚡ Optimize</button>
                <button onClick={() => applyFn(makeResponsive)} className="px-2 py-1 rounded-lg bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white text-xs transition-all">📐 Responsive</button>
                <button onClick={() => setShowAnims(p=>!p)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all border ${showAnims ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/5 text-gray-400 hover:text-white"}`}>
                  🎬 Animate
                </button>
              </div>
              <div className="flex gap-1">
                <button onClick={undo} title="Undo (Ctrl+Z)" className="px-2 py-1 rounded-lg bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white text-xs transition-all">⏪</button>
                <button onClick={redo} title="Redo (Ctrl+Y)" className="px-2 py-1 rounded-lg bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white text-xs transition-all">⏩</button>
              </div>
            </div>

            {/* Templates panel */}
            {showTemplates && (
              <div className="border-b border-white/5 p-3 grid grid-cols-5 gap-1.5 max-h-36 overflow-y-auto">
                {TEMPLATES.map(t => (
                  <button key={t.name} onClick={() => { setCode(t.code); push(t.code); setShowTemplates(false); }}
                    title={t.name}
                    className="flex flex-col items-center gap-0.5 py-2 px-1 rounded-xl bg-[#0A0A14] border border-white/5 hover:border-[#6C3AFF]/40 transition-all text-center">
                    <span className="text-xl">{t.icon}</span>
                    <span className="text-[9px] text-gray-500 leading-tight">{t.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Animation snippets panel */}
            {showAnims && (
              <div className="border-b border-white/5 p-3 flex flex-wrap gap-1.5">
                {ANIM_SNIPPETS.map(a => (
                  <button key={a.name} onClick={() => insertAtCursor("\n" + a.code)}
                    className="px-3 py-1.5 rounded-lg bg-[#0A0A14] border border-white/5 text-gray-300 text-xs hover:border-[#6C3AFF]/40 hover:text-white transition-all">
                    {a.name}
                  </button>
                ))}
              </div>
            )}

            {/* Code editor — ✅ QA FIX: Added break-all to prevent long lines breaking flex */}
            <textarea ref={textareaRef} value={code} onChange={e => handleChange(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full min-w-0 break-all px-4 py-3 bg-[#0A0A14] text-green-400 text-xs font-mono resize-none focus:outline-none min-h-[280px] leading-relaxed" />

            {/* Statusbar */}
            <div className="px-3 py-1.5 border-t border-white/5 flex justify-between text-[10px] text-gray-600 font-mono">
              <span>{lineCount} lines</span>
              <span>{fileSize} KB</span>
            </div>

            {/* Element / Colors / Info tabs */}
            <div className="border-t border-white/5">
              <div className="flex">
                {(["elements","colors","info"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 text-xs font-semibold capitalize transition-all ${activeTab===tab ? "bg-[#0A0A14] text-[#6C3AFF] border-b border-[#6C3AFF]" : "text-gray-500 hover:text-white"}`}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="max-h-28 overflow-y-auto p-2 bg-[#0A0A14] min-w-0 w-full">
                {activeTab === "elements" && (
                  <div className="space-y-0.5 min-w-0 w-full">
                    {elements.slice(0,30).map((el,i) => (
                      <div key={i} className="flex items-center gap-1 text-[10px] font-mono min-w-0" style={{paddingLeft:`${el.depth*10}px`}}>
                        <span className="text-[#6C3AFF]">&lt;{el.tag}</span>
                        {el.id && <span className="text-yellow-400">#{el.id}</span>}
                        {el.fill && el.fill !== "none" && <span className="text-gray-500 truncate">{el.fill.slice(0,10)}</span>}
                        <span className="text-[#6C3AFF]">&gt;</span>
                      </div>
                    ))}
                    {elements.length === 0 && <span className="text-gray-600 text-xs">No elements</span>}
                  </div>
                )}
                {activeTab === "colors" && (
                  <div className="flex flex-wrap gap-1.5 p-1 min-w-0 w-full">
                    {colors.map(c => (
                      <div key={c} title={c} className="flex items-center gap-1">
                        <div className="w-4 h-4 rounded border border-white/10" style={{background:c}} />
                        <span className="text-[10px] text-gray-400 font-mono">{c}</span>
                      </div>
                    ))}
                    {colors.length === 0 && <span className="text-gray-600 text-xs">No colors found</span>}
                  </div>
                )}
                {activeTab === "info" && svgInfo && (
                  <div className="grid grid-cols-2 gap-1 text-[10px] min-w-0 w-full">
                    {[
                      ["Width",     svgInfo.width],
                      ["Height",    svgInfo.height],
                      ["ViewBox",   svgInfo.viewBox],
                      ["Elements",  svgInfo.elements],
                      ["File size", svgInfo.fileSize],
                      ["Responsive",svgInfo.isResponsive ? "Yes ✓" : "No"],
                      ["Animation", svgInfo.hasAnimation ? "Yes ✓" : "No"],
                    ].map(([k,v]) => (
                      <div key={String(k)} className="flex justify-between px-1 min-w-0">
                        <span className="text-gray-500 flex-shrink-0">{k}</span>
                        <span className="text-gray-300 font-mono truncate ml-2">{String(v)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right: Preview ── */}
          <div className="min-w-0 flex flex-col bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden">

            {/* Preview controls */}
            <div className="px-3 py-2 border-b border-white/5 flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-500">BG:</span>
              {(["dark","light","transparent"] as const).map(b => (
                <button key={b} onClick={() => setBg(b)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-all border ${bg===b ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/5 text-gray-400 hover:text-white"}`}>
                  {b}
                </button>
              ))}
              <div className="h-4 w-px bg-white/10 mx-1" />
              <button onClick={() => setShowGrid(p=>!p)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${showGrid ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/5 text-gray-400 hover:text-white"}`}>
                Grid
              </button>
              <div className="h-4 w-px bg-white/10 mx-1" />
              {[0.5,1,1.5,2].map(z => (
                <button key={z} onClick={() => setZoom(z)}
                  className={`px-2 py-1 rounded-lg text-xs font-semibold transition-all border ${zoom===z ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/5 text-gray-400 hover:text-white"}`}>
                  {z}×
                </button>
              ))}
            </div>

            {/* SVG preview — ✅ QA FIX: Restored <img> tag with svgDataUrl */}
            <div className={`flex-1 flex items-center justify-center min-h-[300px] overflow-hidden relative ${bgStyle} ${showGrid ? "[background-image:linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:20px_20px]" : ""}`}>
              <img src={svgDataUrl} alt="SVG Preview"
                   style={{ transform:`scale(${zoom})`, maxWidth:"80%", maxHeight:"80%", objectFit:"contain", transition:"transform 0.15s ease" }} />
            </div>

            {/* Hidden PNG canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Export panel */}
            <div className="border-t border-white/5 p-3 space-y-2">
              <div className="flex gap-1.5 flex-wrap">
                <button onClick={copyJSX}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex-1 ${copiedJSX ? "bg-green-600 text-white" : "bg-[#0A0A14] border border-white/10 text-gray-300 hover:text-white"}`}>
                  {copiedJSX ? "✓ Copied JSX" : "⚛️ Copy React JSX"}
                </button>
                <button onClick={copyCSS}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex-1 ${copiedCSS ? "bg-green-600 text-white" : "bg-[#0A0A14] border border-white/10 text-gray-300 hover:text-white"}`}>
                  {copiedCSS ? "✓ Copied CSS" : "🎨 Copy CSS URI"}
                </button>
                <button onClick={downloadSVG}
                  className="px-3 py-2 rounded-xl text-xs font-bold bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white transition-all">
                  ⬇ SVG
                </button>
              </div>
              <div className="flex gap-1">
                <span className="text-xs text-gray-600 self-center mr-1 flex-shrink-0">PNG:</span>
                {[1,2,3,4].map(s => (
                  <button key={s} onClick={() => exportPNG(s)}
                    className="flex-1 py-1.5 rounded-lg bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white text-xs font-semibold transition-all">
                    {s}×
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── SEO & Marketing Content (Moved Below Tool) ───────────────── */}
        <div className="mt-16 space-y-6 min-w-0 w-full">
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 min-w-0 w-full">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-[#13131F] border border-white/5 rounded-xl p-4 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl flex-shrink-0">{f.icon}</span>
                  <span className="text-sm font-bold text-white truncate">{f.title}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Use cases */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
            <h2 className="text-sm font-bold text-white mb-3">Who uses this tool?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 min-w-0 w-full">
              {USE_CASES.map(u => (
                <div key={u.who} className="flex gap-3 min-w-0">
                  <span className="text-[#6C3AFF] font-extrabold text-sm flex-shrink-0 mt-0.5">→</span>
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-white">{u.who}: </span>
                    <span className="text-sm text-gray-400">{u.why}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor table */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-x-auto min-w-0 w-full">
            <div className="px-5 pt-4 pb-2">
              <h2 className="text-sm font-bold text-white">PursTech vs Method Draw vs SVGOMG vs SVG-Edit</h2>
              <p className="text-xs text-gray-500 mt-0.5">SVG editor feature comparison</p>
            </div>
            <table className="w-full text-xs min-w-[500px]">
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
                  <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
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
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
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
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none select-none">
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
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
