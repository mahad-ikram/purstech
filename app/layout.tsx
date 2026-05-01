import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// ─── Global SEO Metadata ─────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: "PursTech — Stop Searching. Start Doing. | 10,000+ Free Online Tools",
    template: "%s | PursTech — Free Online Tools",
  },
  description:
    "PursTech is the world's largest free tool ecosystem. 10,000+ tools for text, image, dev, SEO, AI, finance and security — no login, no ads, instant results. Powered by AI.",

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

  authors:   [{ name: "PursTech", url: "https://purstech.com" }],
  creator:   "PursTech",
  publisher: "PursTech",

  metadataBase: new URL("https://purstech.com"),
  alternates: {
    canonical: "/",
  },

  // ── Google Search Console verification ──────────────────────────────────────
  verification: {
    google: "google5dee1d926c4757f1",
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

  openGraph: {
    type:        "website",
    locale:      "en_US",
    url:         "https://purstech.com",
    siteName:    "PursTech",
    title:       "PursTech — Stop Searching. Start Doing.",
    description: "10,000+ free online tools for everyone. Text, image, dev, SEO, AI, finance — no login required.",
    images: [
      {
        url:    "/og-image.png",
        width:  1200,
        height: 630,
        alt:    "PursTech — The World's Largest Free Tool Ecosystem",
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "PursTech — Stop Searching. Start Doing.",
    description: "10,000+ free online tools. No login. No ads. Powered by AI.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  icons: {
    icon:      "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple:    "/apple-touch-icon.png",
  },
};

// ─── JSON-LD Structured Data ──────────────────────────────────────────────────

const jsonLd = {
  "@context":  "https://schema.org",
  "@type":     "WebSite",
  name:        "PursTech",
  url:         "https://purstech.com",
  description: "The world's largest free online tool ecosystem. 10,000+ tools powered by AI.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type":     "EntryPoint",
      urlTemplate: "https://purstech.com/tools?search={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
  sameAs: [
    "https://twitter.com/purstech",
    "https://linkedin.com/company/purstech",
  ],
};

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        {/* Google AdSense Verification Snippet */}
        <script 
          async 
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6963502356186067" 
          crossOrigin="anonymous"
        ></script>

        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-NP2Q5W1K5L"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NP2Q5W1K5L');
            `,
          }}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="theme-color"      content="#0A0A14" />
        <meta name="color-scheme"     content="dark" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body
        className={`${inter.className} bg-[#0A0A14] text-white antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
