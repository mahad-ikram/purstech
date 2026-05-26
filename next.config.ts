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
