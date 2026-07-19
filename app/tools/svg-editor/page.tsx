import type { Metadata } from "next";
// ✅ Removed `import React from "react"` — not needed in Next.js 13+
import SVGEditorClient from "./client";

export const metadata: Metadata = {
  title: "Free SVG Editor — React Export & Optimizer",
  description: "The most advanced free SVG editor online. Live code preview, shape toolbar, React JSX export, CSS data URI, SVG optimizer, Make Responsive, undo/redo, animation snippets, element tree and PNG export. No install.",
  alternates: { canonical: "/tools/svg-editor" },
  keywords: ["svg editor", "svg to react", "svg to jsx", "edit svg online", "svg optimizer", "svg viewer", "online svg editor"],
  openGraph: {
    type: "website",
    title: "Free Online SVG Editor — React Export, Optimizer & Animation",
    description: "Live SVG editor with React JSX export, CSS data URI, optimizer, undo/redo, element tree, animation snippets and PNG export. No install.",
    url: "https://www.purstech.com/tools/svg-editor",
    siteName: "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free Online SVG Editor" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online SVG Editor — React Export & Optimizer",
    description: "Live preview, React JSX export, optimizer, animation snippets, element tree. Best free SVG editor.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  // ✅ robots as object
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

// ✅ WebApplication (was SoftwareApplication)
const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "SVG Editor", url: "https://www.purstech.com/tools/svg-editor",
  description: "Free online SVG editor with live code preview, shape toolbar, React JSX export, CSS data URI, SVG optimizer, Make Responsive, undo/redo, animation snippets, element tree and multi-scale PNG export.",
  applicationCategory: "DeveloperApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
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
    "Statusbar showing line count and file size",
    "Dark and light preview background toggle",
    "Grid overlay on preview",
    "Zoom in/out on preview",
    "Download as SVG",
    "Export as PNG at 1x, 2x, 3x or 4x resolution",
  ],
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
};

// ✅ HowTo schema ADDED
const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Use the Online SVG Editor",
  description: "Use PursTech's free SVG Editor to create, edit and export SVG files instantly in your browser.",
  totalTime: "PT2M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Choose a template or start from scratch",
      text: "Select one of 10 built-in templates from the Templates panel, or type your own SVG code directly in the editor. The live preview updates with every keystroke.",
      url: "https://www.purstech.com/tools/svg-editor" },
    { "@type": "HowToStep", position: 2, name: "Edit and insert shapes",
      text: "Click shapes from the toolbar (rect, circle, ellipse, line, polygon, text, path, group) to insert them at the cursor. Use Ctrl+Z to undo and Ctrl+Y to redo.",
      url: "https://www.purstech.com/tools/svg-editor" },
    { "@type": "HowToStep", position: 3, name: "Clean and optimise",
      text: "Click Format to prettify, Minify to compact the code, Optimize to strip Inkscape/Figma/Illustrator artifacts, and Make Responsive to remove fixed dimensions.",
      url: "https://www.purstech.com/tools/svg-editor" },
    { "@type": "HowToStep", position: 4, name: "Export your SVG",
      text: "Download as SVG, copy as React JSX, copy as CSS data URI, or export as PNG at 1x, 2x, 3x or 4x resolution.",
      url: "https://www.purstech.com/tools/svg-editor" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How do I convert an SVG to a React (JSX) component?",
      acceptedAnswer: { "@type": "Answer", text: "Click Copy as React — the editor converts attributes to camelCase (stroke-width becomes strokeWidth, class becomes className) and wraps the markup as a ready-to-paste JSX component. Works with any template or your own SVG." } },
    { "@type": "Question", name: "What is SVG and when should I use it instead of PNG or JPEG?",
      acceptedAnswer: { "@type": "Answer", text: "SVG (Scalable Vector Graphics) is a text-based XML format that describes images mathematically. Use SVG for logos, icons, illustrations and charts — anything that needs to look sharp at any size. Use PNG for photographs and complex images with many distinct colours. SVGs can be styled with CSS, animated, and manipulated with JavaScript, making them far more versatile for web use." } },
    { "@type": "Question", name: "How do I convert an SVG for use in a React component?",
      acceptedAnswer: { "@type": "Answer", text: "SVG attributes use hyphenated names (stroke-width, fill-rule) but React requires camelCase (strokeWidth, fillRule) and class must become className. The Copy as React JSX button automatically converts all SVG attributes to their React equivalents so you can paste directly into .jsx or .tsx files." } },
    { "@type": "Question", name: "What is a viewBox and why is it important for responsive SVGs?",
      acceptedAnswer: { "@type": "Answer", text: "The viewBox attribute defines the internal coordinate system of an SVG. When you remove fixed width and height and keep only viewBox, the SVG becomes responsive and scales to fill its container. Our Make Responsive button automatically adds viewBox from the existing dimensions if missing, then removes the fixed width and height attributes." } },
    { "@type": "Question", name: "What does SVG optimisation do and how much can it reduce file size?",
      acceptedAnswer: { "@type": "Answer", text: "Our optimiser removes XML declarations, HTML comments, empty groups, Inkscape namespace attributes, Sodipodi attributes, Adobe Illustrator private data, and Figma data-name attributes. These artefacts can represent 20-40% of SVG file size exported from vector design tools, with zero visual change." } },
    { "@type": "Question", name: "How do I add animation to an SVG?",
      acceptedAnswer: { "@type": "Answer", text: "SVG supports SMIL animations inserted directly inside SVG elements. For example, to spin an element add <animateTransform attributeName='transform' type='rotate' from='0 50 50' to='360 50 50' dur='2s' repeatCount='indefinite'/> inside it. Our animation snippets panel provides ready-to-insert SMIL code for spin, pulse, fade-in and scale animations." } },
  ],
};

// ✅ BreadcrumbList with /categories/dev intermediate step
const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",       item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",      item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Dev Tools",  item: "https://www.purstech.com/categories/dev" },
    { "@type": "ListItem", position: 4, name: "SVG Editor", item: "https://www.purstech.com/tools/svg-editor" },
  ],
};

export default function SVGEditorPage() {
  // ✅ Removed `as any` cast
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
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
  );
}
