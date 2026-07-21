import type { Metadata } from "next";
import TextToSpeechClient from "./client";

export const metadata: Metadata = {
  title: "Free Text to Speech — Read Aloud Text Reader (TTS)",
  description: "Free text to speech — read any text aloud with natural-sounding AI voices in your browser. Adjust speed and pitch, then download the audio.",
  alternates: { canonical: "/tools/text-to-speech" },
  keywords: ["text to speech","read aloud","text reader","tts reader","text to voice","text to speech online free","what does tts mean","browser text to speech"],
  openGraph: {
    type: "website",
    url: "https://www.purstech.com/tools/text-to-speech",
    siteName: "PursTech",
    title: "Free Text to Speech Online — Read Text Aloud (TTS)",
    description: "Read any text aloud in your browser. Choose voice, adjust speed, pitch and volume. Free, private, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Text to Speech — PursTech" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Text to Speech Online — Multiple Voices",
    description: "Browser-based TTS with adjustable speed, pitch and volume. Free, private.",
    images: ["/og-image.png"],
    creator: "@purstech",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  applicationCategory: "UtilityApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  name: "Text to Speech", url: "https://www.purstech.com/tools/text-to-speech",
  description: "Free browser-based text to speech converter. Uses the Web Speech API to read any text aloud using all voices installed on your device. Adjustable speed, pitch and volume. Nothing sent to a server.",
  inLanguage: "en-US", isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "All voices installed on your device — grouped by language",
    "Adjustable speed (0.5× to 2×), pitch and volume",
    "Pause, resume and stop controls",
    "Live animated speaking indicator",
    "Word count, character count and estimated reading time",
    "5,000 character limit on free tier",
    "100% private — audio never leaves your device",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Convert Text to Speech Online",
  description: "Use PursTech's free Text to Speech tool to hear any text spoken aloud in seconds.",
  totalTime: "PT30S",
  step: [
    { "@type": "HowToStep", position: 1, name: "Enter your text",
      text: "Type or paste up to 5,000 characters into the text box, or click 'Load sample' to try it immediately.",
      url: "https://www.purstech.com/tools/text-to-speech" },
    { "@type": "HowToStep", position: 2, name: "Choose a voice and adjust settings",
      text: "Select any voice from your device's installed voices. Adjust speed (0.5× to 2×), pitch and volume using the sliders.",
      url: "https://www.purstech.com/tools/text-to-speech" },
    { "@type": "HowToStep", position: 3, name: "Press Speak",
      text: "Click the Speak button to hear your text. Pause, resume or stop at any time.",
      url: "https://www.purstech.com/tools/text-to-speech" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "How does the text to speech tool work?",
      acceptedAnswer: { "@type": "Answer", text: "It uses your browser's built-in Web Speech API to convert text into spoken audio. No audio is ever sent to a server — everything runs entirely on your device." } },
    { "@type": "Question", name: "What voices are available?",
      acceptedAnswer: { "@type": "Answer", text: "The available voices depend on your operating system and browser. Windows, macOS, iOS and Android each include different built-in voices. Most systems offer voices in multiple languages. Chrome typically has the most voices available." } },
    { "@type": "Question", name: "Can I download the audio?",
      acceptedAnswer: { "@type": "Answer", text: "Browser-based speech synthesis does not produce a downloadable audio file directly. To save audio, use your system's screen recording tool or upgrade to Pro for MP3 export." } },
    { "@type": "Question", name: "What languages are supported?",
      acceptedAnswer: { "@type": "Answer", text: "Supported languages depend on the voices installed on your device. Most modern systems support English, Spanish, French, German, Italian, Chinese, Japanese and many more." } },
    { "@type": "Question", name: "Is there a character limit?",
      acceptedAnswer: { "@type": "Answer", text: "The free version supports up to 5,000 characters. For longer documents, PursTech Pro removes this limit entirely." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",           item: "https://www.purstech.com" },
    { "@type": "ListItem", position: 2, name: "Tools",          item: "https://www.purstech.com/tools" },
    { "@type": "ListItem", position: 3, name: "Text Tools",     item: "https://www.purstech.com/categories/text" },
    { "@type": "ListItem", position: 4, name: "Text to Speech", item: "https://www.purstech.com/tools/text-to-speech" },
  ],
};

export default function TextToSpeechPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <TextToSpeechClient>
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            Text Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 leading-tight flex items-center gap-3">
            <span className="text-4xl flex-shrink-0">🔊</span> Text to Speech — Free TTS Reader
          </h1>
          <p className="text-gray-400 max-w-2xl leading-relaxed text-base">
            Convert any text to natural-sounding speech directly in your browser. Choose from all installed voices, adjust speed, pitch and volume. Free, no login, 100% private — nothing is sent to a server.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {["Free", "No Login", "Multiple Voices", "Adjustable Speed", "Private"].map(b => (
              <span key={b} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {b}</span>
            ))}
          </div>
        </div>
      </TextToSpeechClient>
    </>
  );
}
