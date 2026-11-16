"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

const NON_MONETIZED_PREFIXES = [
  "/admin",
  "/pro",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
];

export default function AdSenseScript() {
  const pathname = usePathname() || "/";
  const isExcluded = NON_MONETIZED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(prefix + "/")
  );

  if (isExcluded) return null;

  return (
    <Script
      id="google-adsense-script"
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6963502356186067"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
