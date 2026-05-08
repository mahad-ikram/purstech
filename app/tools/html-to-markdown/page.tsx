import type { Metadata } from "next";
import HtmlToMarkdownClient from "./client";

export const metadata: Metadata = {
  title:       "Free HTML to Markdown Converter Online — Instant, Clean Output | PursTech",
  description: "Convert HTML to Markdown instantly in your browser. Preserves headings, bold, italic, links, images, tables, code blocks and lists. GFM output, copy or download. Free, no login.",
  keywords:    ["html to markdown","html to markdown converter","convert html to markdown online","html markdown","turndown online"],
  openGraph: {
    title:       "Free HTML to Markdown Converter Online | PursTech",
    description: "Convert HTML to clean Markdown instantly. Tables, code blocks, GFM output. Free.",
    url:         "https://purstech.com/tools/html-to-markdown",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free HTML to Markdown Converter | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/html-to-markdown" },
};

export default function HtmlToMarkdownPage() {
  return <HtmlToMarkdownClient />;
}
