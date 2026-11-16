import type { Metadata } from "next";
import SynthIdRemoverClient from "./client";

export const metadata: Metadata = {
  title: "Free SynthID & C2PA Metadata Remover — Clean AI Image Provenance",
  description:
    "Inspect and strip C2PA Content Credentials (JUMBF), China TC260 AIGC tags, EXIF/XMP/IPTC metadata, and SynthID pixel frequency carriers 100% locally in your browser. Free, no upload, up to 30MB.",
  alternates: { canonical: "/tools/synthid-remover" },
  keywords: [
    "synthid remover",
    "c2pa metadata remover",
    "remove c2pa content credentials",
    "ai image metadata remover",
    "synthid watermark detector and remover",
    "strip exif xmp iptc ai tags",
    "remove made with ai label",
    "tc260 aigc metadata remover",
  ],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/synthid-remover",
    siteName: "PursTech",
    title: "Free SynthID & C2PA Metadata Remover — Local Browser AI Provenance Cleaner",
    description:
      "Audit and strip C2PA Content Credentials (31 AI vendors), China TC260 AIGC labels, IPTC 2025.1 tags, and 4 invisible pixel watermark families (SynthID 16-32px octave, InvisMark, DWT-DCT) locally in your browser.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Free SynthID & C2PA Metadata Remover — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free SynthID & C2PA Metadata Remover — 100% Local Browser Tool",
    description:
      "Inspect and remove C2PA JUMBF, TC260 AIGC, EXIF/IPTC headers, and SynthID/InvisMark frequency carriers in your browser with live 2D-FFT & PSNR verification.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const APP_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://www.purstech.com/tools/synthid-remover/#software",
  isPartOf: { "@id": "https://www.purstech.com/#website" },
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  name: "PursTech SynthID & C2PA AI Metadata Remover",
  url: "https://www.purstech.com/tools/synthid-remover",
  datePublished: "2026-11-05",
  dateModified: "2026-11-14",
  description:
    "Browser-based multi-standard AI provenance inspector and invisible watermark frequency neutralizer. Detects and strips C2PA JUMBF manifests (31 vendors & 20+ soft-binding IDs), China TC260 AIGC labels (18 USCC producers), IPTC 2025.1 tags, Google SynthID 16-32px spatial octave carriers, Microsoft InvisMark (Q=24), and SD/FLUX chroma DWT-DCT (Q=36).",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: {
    "@type": "Organization",
    "@id": "https://www.purstech.com/#organization",
    name: "PursTech",
    logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 },
  },
  featureList: [
    "100% client-side WebAssembly and HTML5 Canvas processing — zero server uploads",
    "Multi-standard provenance audit: C2PA JUMBF (31 AI signers), 20+ C2PA Soft-Binding IDs, China TC260 AIGC JSON (18 USCC codes), and IPTC 2025.1",
    "4-family invisible pixel watermark neutralizer: Google SynthID 16-32px spatial octave, DeSynth 12th-order Butterworth filter, Microsoft InvisMark (Q=24), and SD/FLUX YUV DWT-DCT (Q=36)",
    "Calibrated visible corner/badge inpainting presets (Google Gemini 48×48 / 96×96 sparkle, Doubao, Jimeng, Kling, Qwen, Samsung Galaxy AI, Microsoft Designer)",
    "Live 256×256 2D Fast Fourier Transform (FFT) spectrum analyzer and 20× residual carrier heatmap",
    "Real-time PSNR (dB) and SSIM visual fidelity verification with interactive before/after split slider",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": "https://www.purstech.com/tools/synthid-remover/#howto",
  name: "How to Inspect and Remove SynthID, C2PA, and TC260 AI Metadata from Images",
  description: "Audit and strip container-level AI provenance headers and pixel-domain steganographic carriers locally in your web browser.",
  totalTime: "PT30S",
  step: [
    {
      "@type": "HowToStep",
      position: 1,
      name: "Select your disruption pipeline and optional corner preset",
      text: "Choose Full 4-Family Hybrid Suite (recommended), SynthID 16-32px Octave + Butterworth-12, Surgical InvisMark & DWT-DCT, or Lossless Metadata Strip (∞ dB PSNR). Optionally enable a calibrated visible corner preset such as Google Gemini Sparkle.",
      url: "https://www.purstech.com/tools/synthid-remover",
    },
    {
      "@type": "HowToStep",
      position: 2,
      name: "Drop or browse your AI-generated images",
      text: "Upload PNG, JPEG, WebP, AVIF, or HEIC images up to 30MB. The binary parser immediately inspects PNG caBX/tEXt/iTXt, JPEG APP1/APP11/APP13, and WebP C2PA/XMP chunks.",
      url: "https://www.purstech.com/tools/synthid-remover",
    },
    {
      "@type": "HowToStep",
      position: 3,
      name: "Verify 2D-FFT spectrum, PSNR/SSIM, and download",
      text: "Compare the before and after 2D-FFT magnitude spectra, confirm that C2PA and TC260 segments are stripped, inspect the split preview, and download your clean PNG, WebP, or JPEG.",
      url: "https://www.purstech.com/tools/synthid-remover",
    },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://www.purstech.com/tools/synthid-remover/#faq",
  mainEntity: [
    {
      "@type": "Question",
      name: "What is the technical difference between C2PA Content Credentials, China TC260 labels, and Google SynthID?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "C2PA Content Credentials and China's mandatory TC260 (GB/T 45438-2025) labels are container-level metadata headers stored in JPEG APP11 JUMBF segments, PNG caBX/tEXt/iTXt chunks, WebP C2PA/XMP chunks, and IPTC digitalSourceType fields. Google DeepMind's SynthID, Microsoft InvisMark, and Stable Diffusion's DWT-DCT watermark are imperceptible steganographic signals embedded directly into pixel values across spatial-frequency bands.",
      },
    },
    {
      "@type": "Question",
      name: "Where does Google SynthID store its energy in AI-generated images?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Empirical spectral perturbation analysis shows that Google SynthID embeds an additive post-hoc neural residual (x' = x + g(x)) whose primary energy concentrates in the 16-to-32-pixel spatial period octave alongside high-frequency radial Fourier rings (0.25–0.48 Nyquist) and opponent-color (Red-Green and Blue-Yellow) chrominance channels. Disrupting the 16–32px spatial octave and high-frequency carrier lattice while protecting high-gradient edges neutralizes carrier spikes at 38–46+ dB PSNR.",
      },
    },
    {
      "@type": "Question",
      name: "How does the tool detect and neutralize Microsoft InvisMark and Stable Diffusion DWT-DCT watermarks?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Microsoft Paint and Designer embed InvisMark (Watermarker.dll wire format) by quantizing 4×4 Haar-LL luminance DCT singular values modulo Q = 24.0 around centers (6.0, 18.0) to encode a 144-bit UUID. Stable Diffusion, SDXL, and FLUX pipelines using imwatermark quantize YUV chroma (U/V) 4×4 Haar-LL DCT coefficients modulo Q = 36. Our surgical block shifter perturbs 4×4 luminance and chroma coefficients across half-quantum boundaries without blurring edges.",
      },
    },
    {
      "@type": "Question",
      name: "How does the calibrated Google Gemini visible sparkle remover work?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Google Gemini places its semi-transparent white four-pointed sparkle at exact deterministic coordinates in the bottom-right corner: a 48×48px box with 32px right/bottom margins on images ≤1024px, and a 96×96px box with 64px right/bottom margins on images >1024×1024px. When enabled, our calibrated preset isolates that exact region and reconstructs the background using inverse-distance boundary biharmonic interpolation and micro-grain matching.",
      },
    },
    {
      "@type": "Question",
      name: "Why do Instagram, TikTok, LinkedIn, and Facebook automatically tag my uploads as 'Made with AI'?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Social platforms parse uploaded file containers for C2PA JUMBF manifests (signed by OpenAI, Google LLC, Adobe Firefly, Microsoft, Runway, Ideogram, or xAI Grok), IPTC 2025.1 digitalSourceType markers ('trainedAlgorithmicMedia' or 'compositeWithTrainedAlgorithmicMedia'), and China TC260 AIGC JSON chunks. Re-synthesizing a fresh container from raw RGBA canvas pixels strips 100% of these container headers.",
      },
    },
    {
      "@type": "Question",
      name: "Are my images ever uploaded to a server during inspection or cleaning?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. All binary chunk parsing, 256×256 Cooley-Tukey 2D Fast Fourier Transform (FFT) spectral analysis, 12th-order Butterworth filtering, and clean container encoding execute 100% locally inside your browser's RAM using JavaScript TypedArrays and HTML5 Canvas.",
      },
    },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "@id": "https://www.purstech.com/tools/synthid-remover/#breadcrumb",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools", item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Image Tools", item: "https://www.purstech.com/categories/image" },
    { "@type": "ListItem", position: 4, name: "SynthID & C2PA Remover", item: "https://www.purstech.com/tools/synthid-remover" },
  ],
};

export default function SynthIdRemoverPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />

      <SynthIdRemoverClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            Image &amp; AI Provenance Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Free SynthID &amp; C2PA Metadata Remover — Clean AI Image Provenance
          </h1>
          <p className="text-gray-400 max-w-3xl leading-relaxed text-base">
            <strong>PursTech&apos;s SynthID &amp; C2PA Remover</strong> is a 100% client-side browser utility that inspects and strips{" "}
            <strong>C2PA Content Credentials (<code className="text-[#00D4FF] font-mono">JUMBF</code> across 31 AI vendors)</strong>,{" "}
            <strong>China TC260 AIGC labels (<code className="text-[#00D4FF] font-mono">GB/T 45438-2025</code> across 18 USCC producers)</strong>,{" "}
            <code className="text-[#00D4FF] font-mono">IPTC 2025.1</code> disclosure tags, and{" "}
            <strong>4 invisible pixel watermark families</strong> (Google SynthID 16–32px spatial octave, Microsoft InvisMark{" "}
            <code className="text-[#6C3AFF] font-mono">Q=24</code>, and SD/FLUX DWT-DCT <code className="text-[#6C3AFF] font-mono">Q=36</code>) while preserving facial details and text clarity at <strong>38–48+ dB PSNR</strong>.
          </p>
        </div>
      </SynthIdRemoverClient>
    </>
  );
}
