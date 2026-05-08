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
};

export default nextConfig;
