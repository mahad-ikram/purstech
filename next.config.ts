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

  // ── Required for @imgly/background-removal (ONNX Runtime uses WebAssembly) ──
  // Without asyncWebAssembly the WASM module cannot be compiled and the AI
  // model silently fails to load. layers:true is required alongside it in
  // Next.js App Router.
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
