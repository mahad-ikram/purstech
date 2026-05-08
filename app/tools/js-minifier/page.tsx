import type { Metadata } from "next";
import JSMinifierClient from "./client";

export const metadata: Metadata = {
  title:       "Free JavaScript Minifier Online — Compress & Beautify JS Instantly | PursTech",
  description: "Minify JavaScript code online for free. Remove comments, whitespace and dead code. See real compression stats, gzip size estimate and diff view. Also beautifies/formats JS. No login.",
  keywords:    ["javascript minifier","js minifier online","minify javascript free","compress javascript","js uglify online","javascript beautifier"],
  openGraph: {
    title:       "Free JavaScript Minifier Online — Compress & Beautify JS | PursTech",
    description: "Minify and compress JavaScript instantly. See compression stats, gzip estimate and diff. Free, no upload.",
    url:         "https://purstech.com/tools/js-minifier",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free JavaScript Minifier Online | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/js-minifier" },
};

export default function JSMinifierPage() {
  return <JSMinifierClient />;
}
