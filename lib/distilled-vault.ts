// lib/distilled-vault.ts
// Layer 2: Self-Learning Distilled Semantic Knowledge Vault + 55-Tool Canonical Catalog

export interface ToolCatalogItem {
  icon: string;
  name: string;
  slug: string;
  category: string;
  description: string;
}

export const PURSTECH_TOOL_CATALOG: ToolCatalogItem[] = [
  {
    "icon": "📝",
    "name": "Word Counter",
    "slug": "word-counter",
    "category": "text",
    "description": "Free browser-based Word Counter utility in the TEXT suite on PursTech."
  },
  {
    "icon": "🔤",
    "name": "Case Converter",
    "slug": "case-converter",
    "category": "text",
    "description": "Free browser-based Case Converter utility in the TEXT suite on PursTech."
  },
  {
    "icon": "📄",
    "name": "Lorem Ipsum Generator",
    "slug": "lorem-ipsum",
    "category": "text",
    "description": "Free browser-based Lorem Ipsum Generator utility in the TEXT suite on PursTech."
  },
  {
    "icon": "🔍",
    "name": "Diff Checker",
    "slug": "diff-checker",
    "category": "text",
    "description": "Free browser-based Diff Checker utility in the TEXT suite on PursTech."
  },
  {
    "icon": "🔊",
    "name": "Text to Speech",
    "slug": "text-to-speech",
    "category": "text",
    "description": "Free browser-based Text to Speech utility in the TEXT suite on PursTech."
  },
  {
    "icon": "💻",
    "name": "JSON Formatter",
    "slug": "json-formatter",
    "category": "dev",
    "description": "Free browser-based JSON Formatter utility in the DEV suite on PursTech."
  },
  {
    "icon": "🔐",
    "name": "Base64 Encoder",
    "slug": "base64-encoder",
    "category": "dev",
    "description": "Free browser-based Base64 Encoder utility in the DEV suite on PursTech."
  },
  {
    "icon": "🔗",
    "name": "URL Encoder",
    "slug": "url-encoder",
    "category": "dev",
    "description": "Free browser-based URL Encoder utility in the DEV suite on PursTech."
  },
  {
    "icon": "🎲",
    "name": "UUID Generator",
    "slug": "uuid-generator",
    "category": "dev",
    "description": "Free browser-based UUID Generator utility in the DEV suite on PursTech."
  },
  {
    "icon": "🔲",
    "name": "QR Code Generator",
    "slug": "qr-code-generator",
    "category": "dev",
    "description": "Free browser-based QR Code Generator utility in the DEV suite on PursTech."
  },
  {
    "icon": "🔑",
    "name": "Hash Generator",
    "slug": "hash-generator",
    "category": "dev",
    "description": "Free browser-based Hash Generator utility in the DEV suite on PursTech."
  },
  {
    "icon": "🎨",
    "name": "CSS Minifier",
    "slug": "css-minifier",
    "category": "dev",
    "description": "Free browser-based CSS Minifier utility in the DEV suite on PursTech."
  },
  {
    "icon": "🗜️",
    "name": "HTML Minifier",
    "slug": "html-minifier",
    "category": "dev",
    "description": "Free browser-based HTML Minifier utility in the DEV suite on PursTech."
  },
  {
    "icon": "🧪",
    "name": "Regex Tester",
    "slug": "regex-tester",
    "category": "dev",
    "description": "Free browser-based Regex Tester utility in the DEV suite on PursTech."
  },
  {
    "icon": "⚡",
    "name": "JS Minifier",
    "slug": "js-minifier",
    "category": "dev",
    "description": "Free browser-based JS Minifier utility in the DEV suite on PursTech."
  },
  {
    "icon": "📝",
    "name": "HTML to Markdown",
    "slug": "html-to-markdown",
    "category": "dev",
    "description": "Free browser-based HTML to Markdown utility in the DEV suite on PursTech."
  },
  {
    "icon": "✍️",
    "name": "Markdown Editor",
    "slug": "markdown-editor",
    "category": "dev",
    "description": "Free browser-based Markdown Editor utility in the DEV suite on PursTech."
  },
  {
    "icon": "🎨",
    "name": "Color Code Converter",
    "slug": "color-code-converter",
    "category": "dev",
    "description": "Free browser-based Color Code Converter utility in the DEV suite on PursTech."
  },
  {
    "icon": "✦",
    "name": "SVG Editor",
    "slug": "svg-editor",
    "category": "dev",
    "description": "Free browser-based SVG Editor utility in the DEV suite on PursTech."
  },
  {
    "icon": "🎨",
    "name": "Color Picker",
    "slug": "color-picker",
    "category": "image",
    "description": "Free browser-based Color Picker utility in the IMAGE suite on PursTech."
  },
  {
    "icon": "🗜️",
    "name": "Image Compressor",
    "slug": "image-compressor",
    "category": "image",
    "description": "Free browser-based Image Compressor utility in the IMAGE suite on PursTech."
  },
  {
    "icon": "📐",
    "name": "Image Resizer",
    "slug": "image-resizer",
    "category": "image",
    "description": "Free browser-based Image Resizer utility in the IMAGE suite on PursTech."
  },
  {
    "icon": "✂️",
    "name": "Background Remover",
    "slug": "background-remover",
    "category": "image",
    "description": "Free browser-based Background Remover utility in the IMAGE suite on PursTech."
  },
  {
    "icon": "🔍",
    "name": "AI Image Upscaler (4×)",
    "slug": "image-upscaler",
    "category": "image",
    "description": "Free browser-based AI Image Upscaler (4×) utility in the IMAGE suite on PursTech."
  },
  {
    "icon": "🎨",
    "name": "AI Photo Colorizer",
    "slug": "image-colorizer",
    "category": "image",
    "description": "Free browser-based AI Photo Colorizer utility in the IMAGE suite on PursTech."
  },
  {
    "icon": "🛡️",
    "name": "SynthID & C2PA Remover",
    "slug": "synthid-remover",
    "category": "image",
    "description": "Free browser-based SynthID & C2PA Remover utility in the IMAGE suite on PursTech."
  },
  {
    "icon": "🏷",
    "name": "Favicon Generator",
    "slug": "favicon-generator",
    "category": "image",
    "description": "Free browser-based Favicon Generator utility in the IMAGE suite on PursTech."
  },
  {
    "icon": "📷",
    "name": "Image to Text (OCR)",
    "slug": "image-to-text",
    "category": "image",
    "description": "Free browser-based Image to Text (OCR) utility in the IMAGE suite on PursTech."
  },
  {
    "icon": "🏷",
    "name": "Meta Tag Generator",
    "slug": "meta-tag-generator",
    "category": "seo",
    "description": "Free browser-based Meta Tag Generator utility in the SEO suite on PursTech."
  },
  {
    "icon": "🤖",
    "name": "Robots.txt Generator",
    "slug": "robots-txt-generator",
    "category": "seo",
    "description": "Free browser-based Robots.txt Generator utility in the SEO suite on PursTech."
  },
  {
    "icon": "🔍",
    "name": "Keyword Density Checker",
    "slug": "keyword-density-checker",
    "category": "seo",
    "description": "Free browser-based Keyword Density Checker utility in the SEO suite on PursTech."
  },
  {
    "icon": "📊",
    "name": "Open Graph Generator",
    "slug": "open-graph-generator",
    "category": "seo",
    "description": "Free browser-based Open Graph Generator utility in the SEO suite on PursTech."
  },
  {
    "icon": "🗺",
    "name": "Sitemap Generator",
    "slug": "sitemap-generator",
    "category": "seo",
    "description": "Free browser-based Sitemap Generator utility in the SEO suite on PursTech."
  },
  {
    "icon": "🧠",
    "name": "llms.txt Generator",
    "slug": "llms-txt-generator",
    "category": "seo",
    "description": "Free browser-based llms.txt Generator utility in the SEO suite on PursTech."
  },
  {
    "icon": "🛡️",
    "name": "AdSense Readiness Checker",
    "slug": "adsense-checker",
    "category": "seo",
    "description": "Free browser-based AdSense Readiness Checker utility in the SEO suite on PursTech."
  },
  {
    "icon": "🎂",
    "name": "Age Calculator",
    "slug": "age-calculator",
    "category": "finance",
    "description": "Free browser-based Age Calculator utility in the FINANCE suite on PursTech."
  },
  {
    "icon": "⚖️",
    "name": "BMI Calculator",
    "slug": "bmi-calculator",
    "category": "finance",
    "description": "Free browser-based BMI Calculator utility in the FINANCE suite on PursTech."
  },
  {
    "icon": "🔢",
    "name": "Percentage Calculator",
    "slug": "percentage-calculator",
    "category": "finance",
    "description": "Free browser-based Percentage Calculator utility in the FINANCE suite on PursTech."
  },
  {
    "icon": "📏",
    "name": "Unit Converter",
    "slug": "unit-converter",
    "category": "finance",
    "description": "Free browser-based Unit Converter utility in the FINANCE suite on PursTech."
  },
  {
    "icon": "💱",
    "name": "Currency Converter",
    "slug": "currency-converter",
    "category": "finance",
    "description": "Free browser-based Currency Converter utility in the FINANCE suite on PursTech."
  },
  {
    "icon": "🏦",
    "name": "Loan Calculator",
    "slug": "loan-calculator",
    "category": "finance",
    "description": "Free browser-based Loan Calculator utility in the FINANCE suite on PursTech."
  },
  {
    "icon": "📈",
    "name": "Compound Interest Calc",
    "slug": "compound-interest-calculator",
    "category": "finance",
    "description": "Free browser-based Compound Interest Calc utility in the FINANCE suite on PursTech."
  },
  {
    "icon": "🍽",
    "name": "Tip Calculator",
    "slug": "tip-calculator",
    "category": "finance",
    "description": "Free browser-based Tip Calculator utility in the FINANCE suite on PursTech."
  },
  {
    "icon": "🕐",
    "name": "Time Zone Converter",
    "slug": "time-zone-converter",
    "category": "finance",
    "description": "Free browser-based Time Zone Converter utility in the FINANCE suite on PursTech."
  },
  {
    "icon": "🏠",
    "name": "Mortgage Calculator",
    "slug": "mortgage-calculator",
    "category": "finance",
    "description": "Free browser-based Mortgage Calculator utility in the FINANCE suite on PursTech."
  },
  {
    "icon": "🔐",
    "name": "Password Generator",
    "slug": "password-generator",
    "category": "security",
    "description": "Free browser-based Password Generator utility in the SECURITY suite on PursTech."
  },
  {
    "icon": "🔒",
    "name": "SSL Certificate Checker",
    "slug": "ssl-checker",
    "category": "security",
    "description": "Free browser-based SSL Certificate Checker utility in the SECURITY suite on PursTech."
  },
  {
    "icon": "🌐",
    "name": "IP Address Lookup",
    "slug": "ip-lookup",
    "category": "security",
    "description": "Free browser-based IP Address Lookup utility in the SECURITY suite on PursTech."
  },
  {
    "icon": "🗜️",
    "name": "PDF Compressor",
    "slug": "pdf-compressor",
    "category": "pdf",
    "description": "Free browser-based PDF Compressor utility in the PDF suite on PursTech."
  },
  {
    "icon": "📑",
    "name": "PDF Merger",
    "slug": "pdf-merger",
    "category": "pdf",
    "description": "Free browser-based PDF Merger utility in the PDF suite on PursTech."
  },
  {
    "icon": "✂️",
    "name": "PDF Splitter",
    "slug": "pdf-splitter",
    "category": "pdf",
    "description": "Free browser-based PDF Splitter utility in the PDF suite on PursTech."
  },
  {
    "icon": "📝",
    "name": "PDF to Word",
    "slug": "pdf-to-word",
    "category": "pdf",
    "description": "Free browser-based PDF to Word utility in the PDF suite on PursTech."
  },
  {
    "icon": "📄",
    "name": "Word to PDF",
    "slug": "word-to-pdf",
    "category": "pdf",
    "description": "Free browser-based Word to PDF utility in the PDF suite on PursTech."
  },
  {
    "icon": "✓",
    "name": "Grammar Checker",
    "slug": "grammar-checker",
    "category": "ai",
    "description": "Free browser-based Grammar Checker utility in the AI suite on PursTech."
  },
  {
    "icon": "📊",
    "name": "Readability Checker",
    "slug": "readability-checker",
    "category": "ai",
    "description": "Free browser-based Readability Checker utility in the AI suite on PursTech."
  }
];

export interface DistilledLesson {
  id: string;
  questionPattern: string;
  keywords: string[];
  answer: string;
  recommendedTools: { name: string; slug: string; reason: string }[];
  recommendedBlogs: { title: string; slug: string }[];
  sourceTier: 'seed-distilled' | 'gemini-teacher-distilled' | 'student-verified';
  confidence: number;
  createdAt: string;
}

export const INITIAL_DISTILLED_VAULT: DistilledLesson[] = [
  {
    id: 'distill-synthid-c2pa-difference',
    questionPattern: 'What is the difference between Google SynthID and C2PA Content Credentials, and how do I remove both?',
    keywords: ['synthid', 'c2pa', 'difference', 'content credentials', 'watermark', 'remove', 'gemini', 'jumbf', 'invisible'],
    answer:
      '**C2PA (Coalition for Content Provenance and Authenticity)** embeds a cryptographic JUMBF manifest inside the file container metadata (such as JPEG `APP11` or PNG `caBX` chunks) linking the asset to its generator (e.g., OpenAI, Adobe Firefly, Google Gemini). **Google SynthID**, by contrast, embeds an imperceptible frequency-domain watermark directly into the pixel luminance/chrominance values (16px–32px spatial octaves) so it survives standard metadata stripping.\n\nTo neutralize both in a single pass locally in your browser:\n1. Open the **SynthID & C2PA Remover** (`/tools/synthid-remover`).\n2. Drop your AI-generated image to run the 7-layer forensic scanner (which checks 31 vendor signatures, C2PA JUMBF boxes, IPTC 2025.1 tags, China TC260 AIGC keys, and SynthID carrier energy).\n3. Enable **Deep SynthID Frequency Neutralizer (Butterworth-12 + Phase De-correlation)** and **Gemini Visible Corner Sparkle Inpainter** if needed, then export a clean canvas-reconstructed file.',
    recommendedTools: [
      { name: 'SynthID & C2PA Remover', slug: '/tools/synthid-remover', reason: 'Strips C2PA JUMBF, TC260, IPTC 2025.1, and neutralizes SynthID carrier frequencies locally.' },
      { name: 'Image Compressor', slug: '/tools/image-compressor', reason: 'Re-encodes clean pixel buffers with zero third-party server uploads.' }
    ],
    recommendedBlogs: [
      { title: '7 Best Free SynthID & C2PA AI Metadata Removers (2026–2027)', slug: '/blog/best-free-synthid-and-c2pa-removers' }
    ],
    sourceTier: 'seed-distilled',
    confidence: 0.99,
    createdAt: '2026-11-15T00:00:00Z'
  },
  {
    id: 'distill-adsense-low-value-content',
    questionPattern: 'Why did Google AdSense reject my tool website for Low value content even when ads.txt is Authorized?',
    keywords: ['adsense', 'rejected', 'low value content', 'authorized', 'ads.txt', 'policy', 'violation', 'fix', 'approve'],
    answer:
      'An **Authorized** `ads.txt` status only confirms domain ownership; Google AdSense triggers **Low value content** on utility or tool websites when its automated crawler and quality raters detect five structural signals:\n1. **Ad Script Firing on Utility/Legal/Dead-End Routes**: Loading `adsbygoogle.js` on `/login`, `/admin`, `/pro` (waitlist), `/contact`, or `/privacy` violates the AdSense Publisher Content Policy.\n2. **Duplicate URLs Serving Similar Components**: Having both `/word-counter` and `/tools/word-counter` causes crawler cannibalization unless consolidated with a `308 Permanent Redirect`.\n3. **Synthetic DOM Footprints**: Attributes like `data-adsense-enriched="true"` flag automated review scripts.\n4. **Missing Named E-E-A-T Authorship**: Tool pages need a verifiable human author bio, technical methodology, and FAQ schema.\n5. **Unlinked Come-Back-Later Monetization Pages**: Linking to an unfinished `/pro` tier signals an under-construction site.',
    recommendedTools: [
      { name: 'AdSense Readiness Checker', slug: '/tools/adsense-checker', reason: 'Runs a 26-point (2,600-pt) V-O-T-C-R audit and generates compliant ads.txt + Consent Mode v2 snippets.' },
      { name: 'Meta Tag Generator', slug: '/tools/meta-tag-generator', reason: 'Verifies canonical tags, Open Graph headers, and SEO meta descriptions.' }
    ],
    recommendedBlogs: [
      { title: 'How to Fix Google AdSense "Low Value Content" in 2026–2027', slug: '/blog/how-to-fix-google-adsense-low-value-content' }
    ],
    sourceTier: 'seed-distilled',
    confidence: 0.99,
    createdAt: '2026-11-15T00:00:00Z'
  },
  {
    id: 'distill-onnx-background-remover-models',
    questionPattern: 'Which AI model should I pick in the Background Remover for hair, fur, or e-commerce product cutouts?',
    keywords: ['background', 'remover', 'model', 'ormbg', 'birefnet', 'isnet', 'modnet', 'bria', 'hair', 'product', 'cutout'],
    answer:
      'PursTech runs 9 specialized ONNX WebGPU/WASM neural networks inside your browser (`IndexedDB` cached so weights download only once):\n- **Portraits & Fine Hair/Fur**: Choose **MODNet Portrait Matting** or **BiRefNet v2 Lite** for sub-pixel alpha matting around loose hair strands.\n- **E-Commerce Products & Logos**: Choose **ORMBG (Open Robust Background)** or **BRIA RMBG 1.4** for crisp geometric edges and shadow removal.\n- **Anime, Vectors & Illustrations**: Choose **ISNet Anime / General** to preserve thin line art without halo artifacts.',
    recommendedTools: [
      { name: 'Background Remover', slug: '/tools/background-remover', reason: 'Runs ORMBG, ISNet, BiRefNet v2, BRIA 1.4, and MODNet locally in browser.' },
      { name: 'AI Image Upscaler (4×)', slug: '/tools/image-upscaler', reason: 'Upscales cutouts 4x using Swin2SR tiled ONNX inference.' }
    ],
    recommendedBlogs: [
      { title: 'Best Free Background Removers (2026–2027 Tested)', slug: '/blog/best-free-background-removers' }
    ],
    sourceTier: 'seed-distilled',
    confidence: 0.98,
    createdAt: '2026-11-15T00:00:00Z'
  },
  {
    id: 'distill-upscale-old-black-and-white-photo',
    questionPattern: 'How can I restore, upscale, and colorize an old blurry black and white family photo for free?',
    keywords: ['restore', 'old', 'photo', 'black and white', 'bw', 'colorize', 'upscale', 'blurry', 'vintage', 'deoldify', 'swin2sr'],
    answer:
      'For best restoration quality, always run **Super-Resolution Upscaling first** and **Chroma-Fusion Colorization second** so the colorizer receives clean high-frequency luminance edges:\n1. Open **AI Image Upscaler (4×)** (`/tools/image-upscaler`) and run **Swin2SR 4x Super-Resolution** with tile-overlap deblocking to reconstruct facial details and film grain.\n2. Download the 4x PNG and drop it into **AI Photo Colorizer** (`/tools/image-colorizer`), which runs the **DeOldify Artistic ONNX neural network** and fuses predicted `a*b*` chrominance channels onto your original `L*` luminance channel so zero sharpness is lost.',
    recommendedTools: [
      { name: 'AI Image Upscaler (4×)', slug: '/tools/image-upscaler', reason: 'Reconstructs sharp 4x detail using Swin2SR tiled ONNX inference.' },
      { name: 'AI Photo Colorizer', slug: '/tools/image-colorizer', reason: 'Restores natural color via LAB luminance-preserving chroma fusion.' }
    ],
    recommendedBlogs: [
      { title: 'Best Free AI Image Upscalers (2026–2027)', slug: '/blog/best-free-ai-image-upscalers' },
      { title: 'Best Free AI Photo Colorizers (2026–2027)', slug: '/blog/best-free-ai-photo-colorizers' }
    ],
    sourceTier: 'seed-distilled',
    confidence: 0.98,
    createdAt: '2026-11-15T00:00:00Z'
  }
];

const RUNTIME_LEARNED_VAULT: DistilledLesson[] = [];

export function getAllVaultLessons(): DistilledLesson[] {
  return [...RUNTIME_LEARNED_VAULT, ...INITIAL_DISTILLED_VAULT];
}

export function absorbTeacherLesson(lesson: DistilledLesson): void {
  const exists = RUNTIME_LEARNED_VAULT.some((item) => item.id === lesson.id);
  if (!exists) {
    RUNTIME_LEARNED_VAULT.unshift(lesson);
  }
}

export function searchDistilledVault(query: string): { lesson: DistilledLesson | null; score: number } {
  const normalized = query.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
  const tokens = normalized.split(/\s+/).filter((w) => w.length > 2);
  if (tokens.length === 0) return { lesson: null, score: 0 };

  let bestLesson: DistilledLesson | null = null;
  let bestScore = 0;

  for (const item of getAllVaultLessons()) {
    let rawHits = 0;
    const patternLower = item.questionPattern.toLowerCase();
    for (const token of tokens) {
      if (item.keywords.some((kw) => kw.toLowerCase().includes(token) || token.includes(kw.toLowerCase()))) {
        rawHits += 2.2;
      } else if (patternLower.includes(token)) {
        rawHits += 1.2;
      }
    }
    const normalizedScore = Math.min(0.99, rawHits / Math.max(4, tokens.length * 1.4));
    if (normalizedScore > bestScore) {
      bestScore = normalizedScore;
      bestLesson = item;
    }
  }

  return {
    lesson: bestScore >= 0.55 ? bestLesson : null,
    score: Number(bestScore.toFixed(2))
  };
}
