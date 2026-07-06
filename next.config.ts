import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // non-www → www redirect is handled by Vercel at the domain level.
  // Change purstech.com redirect type from "307 Temporary" to "308 Permanent"
  // in Vercel Dashboard → Domains. No duplicate rule needed here.

  images: {
    // Allow loading images from any HTTPS source
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
  },

  // ── 301 redirects for renamed blog slugs (preserve Google indexing) ───────
  async redirects() {
    return [
      // Removed `-2025` year suffix from blog slugs to keep URLs timeless.
      // Old URLs were indexed by Google — these permanent redirects preserve
      // link equity and prevent 404s for any external backlinks.
      {
        source:      "/blog/best-free-json-formatter-tools-2025",
        destination: "/blog/best-free-json-formatter-tools",
        permanent:   true,  // 308 (Google treats same as 301)
      },
      {
        source:      "/blog/strong-password-guide-2025",
        destination: "/blog/strong-password-guide",
        permanent:   true,
      },
      {
        source:      "/blog/free-seo-tools-that-work-2025",
        destination: "/blog/free-seo-tools-that-work",
        permanent:   true,
      },

      // ── Old category URL pattern → unified /categories/ (added 6 Jul 2026) ──
      // The June URL unification changed all internal links to /categories/,
      // but Google still remembers old /category/* URLs — they were 404ing
      // (visible in GSC coverage). This preserves them permanently.
      {
        source:      "/category/:slug",
        destination: "/categories/:slug",
        permanent:   true,  // 308
      },
    ];
  },

  // ── Turbopack (Next.js 16 default bundler) ────────────────────────────────
  // Empty config silences the hard build error:
  //   "webpack config present but no turbopack config"
  // Turbopack handles WebAssembly natively — no additional rules needed for
  // @imgly/background-removal (ONNX Runtime loads WASM at browser runtime,
  // not at build time, so no bundler WASM config is required).
  turbopack: {},

  // ── webpack (fallback — only runs when Next.js is started with --webpack) ─
  // asyncWebAssembly + layers enable WASM module bundling for ONNX Runtime.
  // Kept here for local --webpack dev mode; Turbopack ignores this block.
  webpack: (config) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    return config;
  },
};

export default nextConfig;
