import type { Metadata } from "next";
import ColorPickerClient from "./client";

export const metadata: Metadata = {
  // Renders: "Free Color Picker — HEX, RGB, HSL Online | PursTech" (51 chars ✅)
  title: "Free Color Picker — HEX, RGB, HSL Online",

  description:
    "Free online color picker — pick any color and get HEX, RGB, HSL, HSV and CMYK codes instantly, plus shades, tints and a contrast checker.",

  alternates: { canonical: "/tools/color-picker" },

  keywords: [
    "color picker", "hex color picker", "rgb color picker",
    "what color is opposite green", "complementary color picker",
    "hsl color picker", "color codes generator", "free color picker",
  ],

  openGraph: {
    type:        "website",
    url:         "https://www.purstech.com/tools/color-picker",
    siteName:    "PursTech",
    title:       "Free Color Picker — HEX, RGB, HSL, HSV, CMYK",
    description: "Pick any color and get all format codes instantly. Shade generator, contrast checker and complementary colors. Free, no login.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Color Picker — PursTech" }],
  },

  twitter: {
    card:        "summary_large_image",
    title:       "Free Color Picker — HEX, RGB, HSL, HSV, CMYK",
    description: "Pick any color and get all format codes instantly. Shade generator, contrast checker. Free.",
    images:      ["/og-image.png"],
    creator:     "@purstech",
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const APP_SCHEMA = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  applicationCategory: "MultimediaApplication",
  operatingSystem: "Web Browser",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  name: "Color Picker", url: "https://www.purstech.com/tools/color-picker",
  description: "Free online color picker. Pick any color with a visual picker, RGB sliders or hex input. Instantly get HEX, RGB, HSL, HSV and CMYK codes with one-click copy.",
  inLanguage: "en-US",
  isAccessibleForFree: true,
  publisher: { "@type": "Organization", "@id": "https://www.purstech.com/#organization", name: "PursTech", logo: { "@type": "ImageObject", url: "https://www.purstech.com/og-image.png", width: 1200, height: 630 } },
  featureList: [
    "Visual color picker with RGB sliders",
    "HEX, RGB, HSL, HSV and CMYK one-click copy",
    "Shade and tint generator",
    "Complementary color display",
    "WCAG contrast checker (vs white and black)",
    "15 preset colors",
    "Color info: hue, saturation, lightness, luminance",
  ],
};

const HOWTO_SCHEMA = {
  "@context": "https://schema.org", "@type": "HowTo",
  name: "How to Use the Color Picker",
  description: "Use PursTech's free Color Picker to pick any color and get HEX, RGB, HSL, HSV and CMYK codes.",
  totalTime: "PT1M",
  step: [
    { "@type": "HowToStep", position: 1, name: "Pick a Color",
      text: "Click the colour square to open your browser's colour picker. Or type a HEX code directly. Or drag the RGB sliders to mix your exact colour.",
      url: "https://www.purstech.com/tools/color-picker" },
    { "@type": "HowToStep", position: 2, name: "Copy Any Format",
      text: "Click the copy icon next to HEX, RGB, HSL, HSV, or CMYK to instantly copy that value. Use HEX for web development, CMYK for print.",
      url: "https://www.purstech.com/tools/color-picker" },
    { "@type": "HowToStep", position: 3, name: "Explore and Refine",
      text: "Use the shades panel to find lighter or darker versions. Check the contrast ratio to ensure your colour is accessible for all users.",
      url: "https://www.purstech.com/tools/color-picker" },
  ],
};

const FAQ_SCHEMA = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "What color is opposite green (or red) on the color wheel?",
      acceptedAnswer: { "@type": "Answer", text: "On the traditional artists' (RYB) colour wheel, green's opposite is red — and red's is green. On the digital RGB/HSL wheel this tool uses, green's exact complement is magenta and red's is cyan. Pick any colour and its complement appears automatically." } },
    { "@type": "Question", name: "What is the difference between HEX, RGB, and HSL?",
      acceptedAnswer: { "@type": "Answer", text: "HEX is a 6-digit code used in web/CSS (e.g. #6C3AFF). RGB defines colour using Red, Green, Blue channels from 0–255. HSL defines colour using Hue (0–360°), Saturation (0–100%) and Lightness (0–100%) — more intuitive for designers." } },
    { "@type": "Question", name: "What is CMYK?",
      acceptedAnswer: { "@type": "Answer", text: "CMYK (Cyan, Magenta, Yellow, Key/Black) is the colour model used in printing. If you're sending colours to a printer, use CMYK values. Digital screens use RGB." } },
    { "@type": "Question", name: "What is colour contrast ratio?",
      acceptedAnswer: { "@type": "Answer", text: "Contrast ratio measures how readable text is against a background. WCAG accessibility guidelines require at least 4.5:1 for normal text and 3:1 for large text. Our tool shows your colour's contrast against white and black." } },
    { "@type": "Question", name: "What are complementary colours?",
      acceptedAnswer: { "@type": "Answer", text: "Complementary colours sit opposite each other on the colour wheel. They create maximum contrast when used together — great for CTAs, highlights and attention-grabbing design." } },
    { "@type": "Question", name: "Can I copy the colour values?",
      acceptedAnswer: { "@type": "Answer", text: "Yes — click the copy icon next to any colour format (HEX, RGB, HSL, HSV, CMYK) to instantly copy it to your clipboard." } },
  ],
};

const BREADCRUMB_SCHEMA = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",         item: "https://www.purstech.com"                    },
    { "@type": "ListItem", position: 2, name: "Tools",        item: "https://www.purstech.com/tools"              },
    { "@type": "ListItem", position: 3, name: "Image Tools",  item: "https://www.purstech.com/categories/image"   },
    { "@type": "ListItem", position: 4, name: "Color Picker", item: "https://www.purstech.com/tools/color-picker" },
  ],
};

export default function ColorPickerPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HOWTO_SCHEMA)      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_SCHEMA)        }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />
      <ColorPickerClient />
    </>
  );
}
