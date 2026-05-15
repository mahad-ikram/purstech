import type { Metadata } from "next";
import React from "react";
import SVGEditorClient from "./client";

export const metadata: Metadata = {
  title:       "Free SVG Editor — React Export & Optimizer",
  description: "The most advanced free SVG editor online. Live code preview, shape toolbar, React JSX export, CSS data URI, SVG optimizer, Make Responsive, undo/redo, animation snippets, element tree and PNG export. No install.",
  keywords: [
    "svg editor online", "svg code editor", "edit svg online free", "svg viewer online",
    "online svg editor", "svg to png converter", "svg formatter", "svg optimizer",
    "svg minifier", "svg to react component", "free svg editor", "svg animation editor",
    "vector editor online free", "svg code viewer", "live svg preview",
  ],
  openGraph: {
    type:        "website",
    title:       "Free Online SVG Editor — React Export, Optimizer & Animation | PursTech",
    description: "Live SVG editor with React JSX export, CSS data URI, optimizer, undo/redo, element tree, animation snippets and PNG export. No install.",
    url:         "https://www.purstech.com/tools/svg-editor",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Online SVG Editor" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Free Online SVG Editor | PursTech",
    description: "Live preview, React JSX export, optimizer, animation snippets, element tree. Best free SVG editor.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },
  alternates: { canonical: "/tools/svg-editor" },
  robots:      "index, follow, max-image-preview:large, max-snippet:-1",
};

/* ── JSON-LD schemas ─────────────────────────────────────────────────────── */
const APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "SVG Editor",
  description: "Free online SVG editor with live code preview, shape toolbar, React JSX export, CSS data URI copy, SVG optimizer, Make Responsive, undo/redo, animation snippets, element tree and multi-scale PNG export.",
  url: "https://www.purstech.com/tools/svg-editor",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  featureList: [
    "Live split-pane SVG code editor and preview",
    "Shape toolbar — rect, circle, ellipse, line, polygon, text, path, group",
    "10+ ready-to-edit SVG templates",
    "Undo/Redo with Ctrl+Z / Ctrl+Y keyboard shortcuts",
    "Copy as React JSX component (camelCase attribute conversion)",
    "Copy as CSS data URI for background-image use",
    "Make Responsive — removes width/height, ensures viewBox",
    "SVG optimizer — strips Inkscape/Figma/Illustrator artifacts",
    "Format (prettify) and Minify",
    "SVG animation code snippets (spin, pulse, fade, scale)",
    "Element tree view (parsed DOM)",
    "Color palette extracted from SVG",
    "SVG file info (dimensions, elements, file size)",
    "Dark and light preview background toggle",
    "Grid overlay on preview",
    "Zoom in/out on preview",
    "Download as SVG",
    "Export as PNG at 1x, 2x, 3x or 4x resolution",
  ],
  offers:   { "@type": "Offer", price: "0", priceCurrency: "USD" },
  author:   { "@type": "Organization", name: "PursTech", url: "https://www.purstech.com" },
  provider: { "@type": "Organization", name: "PursTech", url: "https://www.purstech.com" },
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",       item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",      item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "SVG Editor", item: "https://www.purstech.com/tools/svg-editor" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is SVG and when should I use it instead of PNG or JPEG?",
      acceptedAnswer: { "@type": "Answer", text: "SVG (Scalable Vector Graphics) is a text-based XML format that describes images mathematically rather than pixel by pixel. Use SVG for logos, icons, illustrations, charts and diagrams — anything that needs to look sharp at any size, from a tiny favicon to a billboard. Use PNG for photographs, screenshots and images with complex colour gradients. Use JPEG for photographs where smaller file size matters more than perfect quality. SVGs can be styled with CSS, animated, and manipulated with JavaScript, making them far more versatile than raster formats for web use." },
    },
    {
      "@type": "Question",
      name: "How do I convert an SVG for use in a React component?",
      acceptedAnswer: { "@type": "Answer", text: "SVG attributes use hyphenated names (stroke-width, fill-rule) but React requires camelCase (strokeWidth, fillRule) and 'class' must become 'className'. Our 'Copy as React JSX' button automatically converts all SVG attributes to their React equivalents, so you can paste directly into your .jsx or .tsx file. Wrap the output in a functional component with props for width, height and className to make it fully reusable. For production React projects, consider using SVGR or Vite's SVG plugin to handle SVG imports automatically." },
    },
    {
      "@type": "Question",
      name: "What is a viewBox and why is it important for responsive SVGs?",
      acceptedAnswer: { "@type": "Answer", text: "The viewBox attribute defines the internal coordinate system of an SVG: viewBox='x y width height'. It tells the SVG renderer what area of the coordinate space to show. When you remove the fixed width and height attributes from an SVG and keep only the viewBox, the SVG becomes responsive — it scales to fill its container while maintaining its proportions. Without viewBox, removing dimensions causes the SVG to default to 300×150 pixels. Our 'Make Responsive' button automatically adds viewBox from the existing dimensions if missing, then removes the fixed width and height attributes." },
    },
    {
      "@type": "Question",
      name: "What does SVG optimisation do and how much can it reduce file size?",
      acceptedAnswer: { "@type": "Answer", text: "SVG optimisation removes content that is invisible to the browser but adds file size. Our optimiser targets: XML declarations (?xml version tags), HTML comments, empty groups (<g></g>), Inkscape namespace attributes (inkscape:label, inkscape:version), Sodipodi attributes, Adobe Illustrator private data, and Figma data-name attributes. These artefacts are added automatically by vector design tools and can represent 20-40% of the file size in SVGs exported from Illustrator, Inkscape or Figma. After removing artefacts, the minify step compresses remaining whitespace to produce the smallest possible file." },
    },
    {
      "@type": "Question",
      name: "How do I add animation to an SVG?",
      acceptedAnswer: { "@type": "Answer", text: "SVG supports two animation methods: SMIL (SVG's built-in animation elements like <animate> and <animateTransform>) and CSS animations. SMIL animations are inserted directly inside the SVG element you want to animate. For example, to spin a circle, add <animateTransform attributeName='transform' type='rotate' from='0 50 50' to='360 50 50' dur='2s' repeatCount='indefinite'/> inside the <circle> element. Our animation snippets panel provides ready-to-insert SMIL code for spin, pulse, fade-in and scale animations. For CSS animations, add a <style> block inside the SVG with keyframe definitions and apply them via the element's class attribute." },
    },
  ],
};

export default function SVGEditorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />

      <SVGEditorClient>
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            Developer Tools
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free Online SVG Editor — Live Preview, React Export &amp; Optimizer
          </h1>

          <p className="text-gray-400 max-w-2xl mb-2 leading-relaxed text-sm">
            The most complete free SVG editor online. Write and edit SVG code with a live
            preview that updates every keystroke. Insert shapes from the toolbar, start from
            10 built-in templates, and export as React JSX, CSS data URI, or PNG.
          </p>
          <p className="text-gray-500 max-w-2xl leading-relaxed text-sm">
            Make SVGs responsive, optimise away Inkscape/Figma artefacts, and insert animation code snippets instantly.
          </p>
        </div>
      </SVGEditorClient>
    </>
  ) as any;
}
