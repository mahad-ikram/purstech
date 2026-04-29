import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// ─── Global SEO Metadata ─────────────────────────────────────────────────────
// This applies to every page on PursTech automatically.
// Individual pages can override these with their own metadata.

export const metadata: Metadata = {
  // ── Basic ──────────────────────────────────────────────────────────────────
  title: {
    default: "PursTech — Stop Searching. Start Doing. | 10,000+ Free Online Tools",
    template: "%s | PursTech — Free Online Tools",
    // Example: "Image Compressor | PursTech — Free Online Tools"
  },
  description:
    "PursTech is the world's largest free tool ecosystem. 10,000+ tools for text, image, dev, SEO, AI, finance and security — no login, no ads, instant results. Powered by AI.",

  // ── Keywords ───────────────────────────────────────────────────────────────
  keywords: [
    "free online tools",
    "purstech",
    "image compressor",
    "word counter",
    "json formatter",
    "pdf tools",
    "seo tools",
    "ai tools",
    "developer tools",
    "text tools",
    "free tools no login",
    "online utilities",
  ],

  // ── Authors & Publisher ────────────────────────────────────────────────────
  authors: [{ name: "PursTech", url: "https://purstech.com" }],
  creator: "PursTech",
  publisher: "PursTech",

  // ── Canonical & Robots ────────────────────────────────────────────────────
  metadataBase: new URL("https://purstech.com"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // ── Open Graph (Facebook, LinkedIn, WhatsApp previews) ────────────────────
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://purstech.com",
    siteName: "PursTech",
    title: "PursTech — Stop Searching. Start Doing.",
    description:
      "10,000+ free online tools for everyone. Text, image, dev, SEO, AI, finance — no login required.",
    images: [
      {
        url: "/og-image.png",   // We'll create this image later
        width: 1200,
        height: 630,
        alt: "PursTech — The World's Largest Free Tool Ecosystem",
      },
    ],
  },

  // ── Twitter / X Card ──────────────────────────────────────────────────────
  twitter: {
    card: "summary_large_image",
    title: "PursTech — Stop Searching. Start Doing.",
    description: "10,000+ free online tools. No login. No ads. Powered by AI.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },

  // ── PWA / App Icons ───────────────────────────────────────────────────────
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },

  // ── Verification (add later when you set up Google Search Console) ────────
  // verification: {
  //   google: "your-google-verification-code",
  // },
};

// ─── JSON-LD Structured Data ─────────────────────────────────────────────────
// This tells Google exactly what kind of site this is.
// It can trigger rich results in search — important for SEO.

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "PursTech",
  url: "https://purstech.com",
  description:
    "The world's largest free online tool ecosystem. 10,000+ tools powered by AI.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://purstech.com/tools?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  sameAs: [
    "https://twitter.com/purstech",
    "https://linkedin.com/company/purstech",
  ],
};

// ─── Root Layout ─────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* JSON-LD Structured Data for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Preconnect to fonts for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Theme color (browser tab / mobile bar color) */}
        <meta name="theme-color" content="#0A0A14" />
        <meta name="color-scheme" content="dark" />

        {/* Prevent phone number auto-detection */}
        <meta name="format-detection" content="telephone=no" />
      </head>

      <body
        className={`${inter.className} bg-[#0A0A14] text-white antialiased`}
        suppressHydrationWarning
      >
        {/* Page content */}
        {children}

        {/* 
          Later we will add here:
          - Analytics script (Vercel Analytics)
          - Cookie consent banner
          - Toast notifications
        */}
      </body>
    </html>
  );
}
