import type { Metadata } from "next";
import MarkdownEditorClient from "./client";

export const metadata: Metadata = {
  title:       "Free Markdown Editor — Live Preview",
  description: "Write Markdown with a live split-pane preview. Full toolbar, GFM tables, task lists, code highlighting, word count, export as HTML or .md file. Free, no login, no account.",
  keywords:    ["markdown editor online","markdown live preview","online markdown editor","gfm editor","markdown to html editor free"],
  openGraph: {
    title:       "Free Online Markdown Editor — Live Preview & GFM Tables | PursTech",
    description: "Markdown editor with live preview, toolbar, GFM support and HTML/MD export. Free.",
    url:         "https://purstech.com/tools/markdown-editor",
    siteName:    "PursTech",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image", title: "Free Online Markdown Editor | PursTech", images: ["/og-image.png"] },
  alternates: { canonical: "/tools/markdown-editor" },
};

export default function MarkdownEditorPage() {
  return <MarkdownEditorClient />;
}
