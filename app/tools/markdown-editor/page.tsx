import type { Metadata } from "next";
import MarkdownEditorClient from "./client";

export const metadata: Metadata = {
  title: "Free Markdown Editor — Live Preview",
  description: "Write Markdown with a live split-pane preview. Full toolbar, GFM tables, task lists, code highlighting, word count, export as HTML or .md file. Free, no login.",
  alternates: { canonical: "/tools/markdown-editor" },
  keywords: ["markdown editor online","markdown live preview","online markdown editor","gfm editor","markdown to html editor free","github flavored markdown editor"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/markdown-editor",
    siteName: "PursTech",
    title: "Free Online Markdown Editor — Live Preview & GFM Tables",
    description: "Markdown editor with live preview, toolbar, GFM support, Copy HTML and MD/HTML export. Free.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Markdown Editor — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Online Markdown Editor — Live Preview",
    description: "Live split-pane preview, toolbar, GFM tables, task lists, HTML export. Free.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "WebApplication",
  name: "Markdown Editor", url: "https://www.purstech.com/tools/markdown-editor",
  description: "Free online Markdown editor with live split-pane preview, 15-button formatting toolbar, GitHub Flavored Markdown (GFM), task lists, tables, word count, Copy HTML and export to .md or .html.",
  applicationCategory: "DeveloperApplication", operatingSystem: "Any",
  browserRequirements: "Requires JavaScript", inLanguage: "en-US",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
  publisher: { "@id": "https://www.purstech.com/#organization" },
  featureList: [
    "Live split-pane Markdown preview",
    "15-button toolbar: bold, italic, headings, code, lists, tables, links, HR",
    "GitHub Flavored Markdown: tables, task lists, strikethrough, fenced code",
    "Split / editor-only / preview-only layout modes",
    "Dark and light preview mode",
    "Fullscreen editing mode",
    "Word count, character count, line count and reading time",
    "Copy rendered HTML to clipboard",
    "Download as .md file or export as complete HTML document",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Use the Online Markdown Editor",
  description: "Use PursTech\'s free Markdown Editor to write, preview and export Markdown documents.",
  totalTime: "PT2M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Write in the editor",
      text: "Type Markdown in the left pane. Use the toolbar buttons for quick formatting — bold, italic, headings, code, lists, tables and more.",
      url: "https://www.purstech.com/tools/markdown-editor" },
    { "@type": "HowToStep", position: 2, name: "Watch the live preview",
      text: "The right pane renders your Markdown in real time. Switch between Split, Editor-only or Preview-only layouts using the view buttons.",
      url: "https://www.purstech.com/tools/markdown-editor" },
    { "@type": "HowToStep", position: 3, name: "Toggle dark preview mode",
      text: "Click the sun/moon button to switch the preview between light and dark mode — useful for checking how your content looks in different environments.",
      url: "https://www.purstech.com/tools/markdown-editor" },
    { "@type": "HowToStep", position: 4, name: "Export in your format",
      text: "Download as .md for GitHub and Markdown platforms, Copy HTML for email or CMS use, or export as a complete HTML file ready to open in any browser.",
      url: "https://www.purstech.com/tools/markdown-editor" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What is Markdown and when should I use it?",
      acceptedAnswer: { "@type": "Answer", text: "Markdown is a plain-text formatting syntax that converts to HTML. Use it for README files on GitHub/GitLab, documentation, blog posts (Ghost, Jekyll, Hugo), notes in Obsidian or Notion, comments on Stack Overflow and Reddit, and chat formatting in Slack, Discord and Teams. Its key advantage is that raw text is human-readable even without rendering." } },
    { "@type": "Question", name: "What is GitHub Flavored Markdown (GFM) and what extra features does it add?",
      acceptedAnswer: { "@type": "Answer", text: "GFM extends standard Markdown with: tables (using pipe characters), task lists (- [ ] for unchecked, - [x] for checked), strikethrough (~~text~~), fenced code blocks with syntax highlighting, autolinks and @mentions. GFM is the standard on GitHub, GitLab, VS Code preview and most developer platforms." } },
    { "@type": "Question", name: "How do I create a table in Markdown?",
      acceptedAnswer: { "@type": "Answer", text: "Use pipe characters to separate columns and hyphens for the header separator row. Add colons to control alignment: :--- for left, :---: for centre, ---: for right. Use our toolbar table button to insert a pre-formatted table template instantly." } },
    { "@type": "Question", name: "Can I add syntax-highlighted code in Markdown?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — use triple backtick fenced code blocks with a language identifier. For example, three backticks followed by javascript, your code, then three closing backticks. Supported identifiers include javascript, typescript, python, java, css, html, json, bash, sql, go, rust and many more." } },
    { "@type": "Question", name: "How do I export my Markdown as an HTML file?",
      acceptedAnswer: { "@type": "Answer", text: "Click Export HTML — it converts your Markdown to a complete HTML file with basic styling and downloads it immediately. For a raw .md file, click Download .md. To copy the HTML to use directly in an email or CMS, click Copy HTML in the editor toolbar." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",            item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",           item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Dev Tools",       item: "https://www.purstech.com/categories/dev" },
    { "@type": "ListItem", position: 4, name: "Markdown Editor", item: "https://www.purstech.com/tools/markdown-editor" },
  ],
};

export default function MarkdownEditorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <MarkdownEditorClient />
    </>
  );
}
