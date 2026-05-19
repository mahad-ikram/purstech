"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ ADDED

// ✅ SCHEMA removed — now server-rendered in page.tsx (WebApplication + FAQPage + HowTo + BreadcrumbList)

// ── Related tools ─────────────────────────────────────────────────────────────
const RELATED_TOOLS = [
  { icon:"🎨", name:"Color Picker",      slug:"color-picker"      },
  { icon:"✏️",  name:"SVG Editor",        slug:"svg-editor"        },
  { icon:"💅", name:"CSS Minifier",      slug:"css-minifier"      },
  { icon:"🏷",  name:"Favicon Generator", slug:"favicon-generator" },
  { icon:"💻", name:"JSON Formatter",    slug:"json-formatter"    },
];

const FAQ = [
  { q:"What is the difference between HEX, RGB and HSL color formats?",
    a:"HEX (#RRGGBB) represents colors as hexadecimal values for red, green and blue channels. It's the most common format in web development. RGB uses decimal values from 0–255 for each channel and is more readable. HSL (Hue, Saturation, Lightness) represents color as its hue angle (0–360°), saturation (0–100%) and lightness (0–100%). HSL is the most intuitive for humans because adjusting saturation or lightness doesn't require understanding RGB arithmetic." },
  { q:"What is the difference between HSL and HSV?",
    a:"Both HSL and HSV use Hue and Saturation, but differ in the third component. HSL uses Lightness — 50% is a pure color, 0% is black and 100% is white. HSV uses Value (Brightness) — 100% is a pure color and 0% is black. HSL is preferred for CSS. HSV is more common in image editing tools like Photoshop because it better matches how artists intuitively think about color." },
  { q:"What is CMYK and when should I use it?",
    a:"CMYK (Cyan, Magenta, Yellow, Key/Black) is a subtractive color model used in color printing. Use CMYK for anything physically printed — business cards, brochures, packaging. Web and screen designs use RGB. Note that CMYK has a smaller gamut than RGB, so some bright screen colors cannot be perfectly reproduced in print." },
  { q:"What is WCAG contrast ratio and why does it matter for accessibility?",
    a:"WCAG contrast ratio measures how distinct a text color is from its background, on a scale of 1:1 (identical) to 21:1 (black on white). WCAG 2.1 requires Level AA — at least 4.5:1 for normal text and 3:1 for large text. Level AAA — at least 7:1 for normal text. Poor contrast makes text illegible for people with low vision or color blindness — roughly 8% of men have some form of color blindness." },
  { q:"What are tints and shades, and how are they generated?",
    a:"A tint is a color mixed with white — increasing HSL lightness toward 100%. A shade is a color mixed with black — decreasing lightness toward 0%. The tool generates 10 tints and 10 shades by incrementally adjusting HSL lightness, giving you a complete palette suitable for design systems and CSS variable sets." },
];

/* ── Color math ──────────────────────────────────────────────────────────────*/
interface RGB  { r: number; g: number; b: number; }
interface HSL  { h: number; s: number; l: number; }
interface HSV  { h: number; s: number; v: number; }
interface CMYK { c: number; m: number; y: number; k: number; }

function hexToRgb(hex: string): RGB | null {
  const clean = hex.replace("#", "");
  const full  = clean.length === 3 ? clean.split("").map(c => c+c).join("") : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return { r: parseInt(full.slice(0,2),16), g: parseInt(full.slice(2,4),16), b: parseInt(full.slice(4,6),16) };
}
function rgbToHex({ r, g, b }: RGB): string {
  return "#" + [r,g,b].map(v => Math.round(v).toString(16).padStart(2,"0")).join("");
}
function rgbToHsl({ r, g, b }: RGB): HSL {
  const R=r/255, G=g/255, B=b/255;
  const max=Math.max(R,G,B), min=Math.min(R,G,B), d=max-min;
  let h=0, s=0, l=(max+min)/2;
  if (d!==0) {
    s=d/(1-Math.abs(2*l-1));
    switch(max) {
      case R: h=((G-B)/d+(G<B?6:0))/6; break;
      case G: h=((B-R)/d+2)/6; break;
      case B: h=((R-G)/d+4)/6; break;
    }
  }
  return { h:Math.round(h*360), s:Math.round(s*100), l:Math.round(l*100) };
}
function hslToRgb({ h, s, l }: HSL): RGB {
  const S=s/100, L=l/100;
  const c=(1-Math.abs(2*L-1))*S, x=c*(1-Math.abs((h/60)%2-1)), m=L-c/2;
  let r=0,g=0,b=0;
  if      (h<60)  {r=c;g=x;b=0;}
  else if (h<120) {r=x;g=c;b=0;}
  else if (h<180) {r=0;g=c;b=x;}
  else if (h<240) {r=0;g=x;b=c;}
  else if (h<300) {r=x;g=0;b=c;}
  else            {r=c;g=0;b=x;}
  return { r:Math.round((r+m)*255), g:Math.round((g+m)*255), b:Math.round((b+m)*255) };
}
function rgbToHsv({ r, g, b }: RGB): HSV {
  const R=r/255, G=g/255, B=b/255;
  const max=Math.max(R,G,B), min=Math.min(R,G,B), d=max-min;
  let h=0;
  if (d!==0) {
    switch(max) {
      case R: h=((G-B)/d+(G<B?6:0))/6; break;
      case G: h=((B-R)/d+2)/6; break;
      case B: h=((R-G)/d+4)/6; break;
    }
  }
  return { h:Math.round(h*360), s:Math.round(max===0?0:(d/max)*100), v:Math.round(max*100) };
}
function rgbToCmyk({ r, g, b }: RGB): CMYK {
  if (r===0&&g===0&&b===0) return { c:0, m:0, y:0, k:100 };
  const R=r/255, G=g/255, B=b/255, k=1-Math.max(R,G,B);
  return { c:Math.round((1-R-k)/(1-k)*100), m:Math.round((1-G-k)/(1-k)*100), y:Math.round((1-B-k)/(1-k)*100), k:Math.round(k*100) };
}
function luminance({ r, g, b }: RGB): number {
  const [R,G,B]=[r,g,b].map(v=>{const s=v/255;return s<=0.03928?s/12.92:Math.pow((s+0.055)/1.055,2.4);});
  return 0.2126*R+0.7152*G+0.0722*B;
}
function contrastRatio(c1: RGB, c2: RGB): number {
  const l1=luminance(c1), l2=luminance(c2), light=Math.max(l1,l2), dark=Math.min(l1,l2);
  return (light+0.05)/(dark+0.05);
}
function generateTints(rgb: RGB, count=10): string[] {
  const hsl=rgbToHsl(rgb);
  return Array.from({length:count},(_,i)=>{const l=hsl.l+((100-hsl.l)*(i+1)/(count+1));return rgbToHex(hslToRgb({...hsl,l:Math.round(l)}));});
}
function generateShades(rgb: RGB, count=10): string[] {
  const hsl=rgbToHsl(rgb);
  return Array.from({length:count},(_,i)=>{const l=hsl.l-(hsl.l*(i+1)/(count+1));return rgbToHex(hslToRgb({...hsl,l:Math.round(l)}));});
}
function complementary(hsl: HSL): HSL { return {...hsl,h:(hsl.h+180)%360}; }
function analogous(hsl: HSL): HSL[] { return [{...hsl,h:(hsl.h-30+360)%360},hsl,{...hsl,h:(hsl.h+30)%360}]; }
function triadic(hsl: HSL): HSL[] { return [hsl,{...hsl,h:(hsl.h+120)%360},{...hsl,h:(hsl.h+240)%360}]; }
function splitComplementary(hsl: HSL): HSL[] { return [hsl,{...hsl,h:(hsl.h+150)%360},{...hsl,h:(hsl.h+210)%360}]; }

/* ── Named CSS Colors ────────────────────────────────────────────────────────*/
const CSS_COLORS: [string,string][] = [
  ["aliceblue","#F0F8FF"],["antiquewhite","#FAEBD7"],["aqua","#00FFFF"],["aquamarine","#7FFFD4"],
  ["azure","#F0FFFF"],["beige","#F5F5DC"],["bisque","#FFE4C4"],["black","#000000"],
  ["blanchedalmond","#FFEBCD"],["blue","#0000FF"],["blueviolet","#8A2BE2"],["brown","#A52A2A"],
  ["burlywood","#DEB887"],["cadetblue","#5F9EA0"],["chartreuse","#7FFF00"],["chocolate","#D2691E"],
  ["coral","#FF7F50"],["cornflowerblue","#6495ED"],["cornsilk","#FFF8DC"],["crimson","#DC143C"],
  ["cyan","#00FFFF"],["darkblue","#00008B"],["darkcyan","#008B8B"],["darkgoldenrod","#B8860B"],
  ["darkgray","#A9A9A9"],["darkgreen","#006400"],["darkkhaki","#BDB76B"],["darkmagenta","#8B008B"],
  ["darkolivegreen","#556B2F"],["darkorange","#FF8C00"],["darkorchid","#9932CC"],["darkred","#8B0000"],
  ["darksalmon","#E9967A"],["darkseagreen","#8FBC8F"],["darkslateblue","#483D8B"],["darkslategray","#2F4F4F"],
  ["darkturquoise","#00CED1"],["darkviolet","#9400D3"],["deeppink","#FF1493"],["deepskyblue","#00BFFF"],
  ["dimgray","#696969"],["dodgerblue","#1E90FF"],["firebrick","#B22222"],["floralwhite","#FFFAF0"],
  ["forestgreen","#228B22"],["fuchsia","#FF00FF"],["gainsboro","#DCDCDC"],["ghostwhite","#F8F8FF"],
  ["gold","#FFD700"],["goldenrod","#DAA520"],["gray","#808080"],["green","#008000"],
  ["greenyellow","#ADFF2F"],["honeydew","#F0FFF0"],["hotpink","#FF69B4"],["indianred","#CD5C5C"],
  ["indigo","#4B0082"],["ivory","#FFFFF0"],["khaki","#F0E68C"],["lavender","#E6E6FA"],
  ["lavenderblush","#FFF0F5"],["lawngreen","#7CFC00"],["lemonchiffon","#FFFACD"],["lightblue","#ADD8E6"],
  ["lightcoral","#F08080"],["lightcyan","#E0FFFF"],["lightgoldenrodyellow","#FAFAD2"],["lightgray","#D3D3D3"],
  ["lightgreen","#90EE90"],["lightpink","#FFB6C1"],["lightsalmon","#FFA07A"],["lightseagreen","#20B2AA"],
  ["lightskyblue","#87CEFA"],["lightslategray","#778899"],["lightsteelblue","#B0C4DE"],["lightyellow","#FFFFE0"],
  ["lime","#00FF00"],["limegreen","#32CD32"],["linen","#FAF0E6"],["magenta","#FF00FF"],
  ["maroon","#800000"],["mediumaquamarine","#66CDAA"],["mediumblue","#0000CD"],["mediumorchid","#BA55D3"],
  ["mediumpurple","#9370DB"],["mediumseagreen","#3CB371"],["mediumslateblue","#7B68EE"],
  ["mediumspringgreen","#00FA9A"],["mediumturquoise","#48D1CC"],["mediumvioletred","#C71585"],
  ["midnightblue","#191970"],["mintcream","#F5FFFA"],["mistyrose","#FFE4E1"],["moccasin","#FFE4B5"],
  ["navajowhite","#FFDEAD"],["navy","#000080"],["oldlace","#FDF5E6"],["olive","#808000"],
  ["olivedrab","#6B8E23"],["orange","#FFA500"],["orangered","#FF4500"],["orchid","#DA70D6"],
  ["palegoldenrod","#EEE8AA"],["palegreen","#98FB98"],["paleturquoise","#AFEEEE"],["palevioletred","#DB7093"],
  ["papayawhip","#FFEFD5"],["peachpuff","#FFDAB9"],["peru","#CD853F"],["pink","#FFC0CB"],
  ["plum","#DDA0DD"],["powderblue","#B0E0E6"],["purple","#800080"],["red","#FF0000"],
  ["rosybrown","#BC8F8F"],["royalblue","#4169E1"],["saddlebrown","#8B4513"],["salmon","#FA8072"],
  ["sandybrown","#F4A460"],["seagreen","#2E8B57"],["seashell","#FFF5EE"],["sienna","#A0522D"],
  ["silver","#C0C0C0"],["skyblue","#87CEEB"],["slateblue","#6A5ACD"],["slategray","#708090"],
  ["snow","#FFFAFA"],["springgreen","#00FF7F"],["steelblue","#4682B4"],["tan","#D2B48C"],
  ["teal","#008080"],["thistle","#D8BFD8"],["tomato","#FF6347"],["turquoise","#40E0D0"],
  ["violet","#EE82EE"],["wheat","#F5DEB3"],["white","#FFFFFF"],["whitesmoke","#F5F5F5"],
  ["yellow","#FFFF00"],["yellowgreen","#9ACD32"],
];

function nearestCssColor(rgb: RGB): string {
  let best="", bestDist=Infinity;
  for (const [name,hex] of CSS_COLORS) {
    const c=hexToRgb(hex);
    if (!c) continue;
    const d=Math.pow(c.r-rgb.r,2)+Math.pow(c.g-rgb.g,2)+Math.pow(c.b-rgb.b,2);
    if (d<bestDist){bestDist=d;best=name;}
  }
  return best;
}

/* ── Component ───────────────────────────────────────────────────────────────*/
export default function ColorCodeConverterClient() {
  // ✅ Track usage in Supabase → admin dashboard
  useTrackTool("color-code-converter", "dev");

  const [hex,          setHex]         = useState("#6C3AFF");
  const [alpha,        setAlpha]       = useState(100);
  const [scheme,       setScheme]      = useState<"complement"|"analogous"|"triadic"|"split">("analogous");
  const [copiedKey,    setCopiedKey]   = useState<string | null>(null);
  const [namedSearch,  setNamedSearch] = useState("");
  const [showNamed,    setShowNamed]   = useState(false);
  // ✅ Enhancement 1: color history — last 8 picked colors
  const [colorHistory, setColorHistory] = useState<string[]>(["#6C3AFF"]);
  // ✅ Enhancement 3: custom contrast pair
  const [contrastBg,   setContrastBg]  = useState("#FFFFFF");
  const [contrastFg,   setContrastFg]  = useState("#000000");

  // Wrap setHex to also record history (deduped, max 8)
  const setHexWithHistory = (newHex: string) => {
    setHex(newHex);
    setColorHistory(prev => {
      const deduped = [newHex, ...prev.filter(h => h.toLowerCase() !== newHex.toLowerCase())];
      return deduped.slice(0, 8);
    });
  };

  const rgb  = useMemo(() => hexToRgb(hex), [hex]);
  const hsl  = useMemo(() => rgb ? rgbToHsl(rgb) : null, [rgb]);
  const hsv  = useMemo(() => rgb ? rgbToHsv(rgb) : null, [rgb]);
  const cmyk = useMemo(() => rgb ? rgbToCmyk(rgb) : null, [rgb]);
  const tints  = useMemo(() => rgb ? generateTints(rgb)  : [], [rgb]);
  const shades = useMemo(() => rgb ? generateShades(rgb) : [], [rgb]);
  const contrastWhite = useMemo(() => rgb ? contrastRatio(rgb,{r:255,g:255,b:255}) : 0, [rgb]);
  const contrastBlack = useMemo(() => rgb ? contrastRatio(rgb,{r:0,g:0,b:0}) : 0, [rgb]);
  const nearestCss    = useMemo(() => rgb ? nearestCssColor(rgb) : "", [rgb]);
  const schemeColors  = useMemo(() => {
    if (!hsl) return [];
    const sets: Record<string,HSL[]> = {
      complement: [hsl, complementary(hsl)],
      analogous:  analogous(hsl),
      triadic:    triadic(hsl),
      split:      splitComplementary(hsl),
    };
    return sets[scheme].map(h => ({ hex: rgbToHex(hslToRgb(h)), hsl: h }));
  }, [hsl, scheme]);

  const a = alpha / 100;
  const formats = useMemo(() => {
    if (!rgb || !hsl || !hsv || !cmyk) return [];
    return [
      { key:"hex",    label:"HEX",     value: hex },
      { key:"rgb",    label:"RGB",     value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
      { key:"rgba",   label:"RGBA",    value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${a})` },
      { key:"hsl",    label:"HSL",     value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
      { key:"hsla",   label:"HSLA",    value: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a})` },
      { key:"hsv",    label:"HSV",     value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
      { key:"cmyk",   label:"CMYK",    value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
      { key:"cssvar", label:"CSS Var", value: `--color-primary: ${hex};` },
    ];
  }, [rgb, hsl, hsv, cmyk, hex, a]);

  function copy(key: string, value: string) {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  }
  function onHexInput(val: string) { setHexWithHistory(val.startsWith("#") ? val : "#" + val); }
  function onHslChange(part: keyof HSL, val: number) {
    if (!hsl) return;
    setHexWithHistory(rgbToHex(hslToRgb({ ...hsl, [part]: val })));
  }

  // ✅ Enhancement 2: export tints + shades as CSS custom properties
  function exportPalette() {
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const allSwatches = [...tints.slice().reverse(), hex, ...shades];
    const lines = allSwatches.map((h, i) => `  --color-${steps[i] ?? i * 100}: ${h};`).join("\n");
    const content = `:root {\n${lines}\n}\n`;
    const blob = new Blob([content], { type: "text/css" });
    const a = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `palette${hex}.css` });
    a.click(); URL.revokeObjectURL(a.href);
  }

  const wcagAA       = contrastWhite >= 4.5 || contrastBlack >= 4.5;
  const wcagAAA      = contrastWhite >= 7    || contrastBlack >= 7;
  const bestContrast = contrastWhite >= contrastBlack ? "white" : "black";

  // ✅ Enhancement 3: custom contrast pair
  const customRgbBg    = useMemo(() => hexToRgb(contrastBg) ?? {r:255,g:255,b:255}, [contrastBg]);
  const customRgbFg    = useMemo(() => hexToRgb(contrastFg) ?? {r:0,g:0,b:0},       [contrastFg]);
  const customContrast = useMemo(() => contrastRatio(customRgbFg, customRgbBg), [customRgbFg, customRgbBg]);
  const customWcagAA   = customContrast >= 4.5;
  const customWcagAAA  = customContrast >= 7;
  const filteredNamed = namedSearch
    ? CSS_COLORS.filter(([n]) => n.includes(namedSearch.toLowerCase())).slice(0,40)
    : CSS_COLORS.slice(0,80);

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      {/* ── Navbar — fixed: added Go Pro ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">
              Go Pro ⚡
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">

        {/* ── Breadcrumb — fixed: aria-label + /categories/dev ── */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/dev" className="hover:text-gray-400">Dev Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Color Code Converter</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Developer Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Color Code Converter — HEX, RGB, HSL, CMYK &amp; Color Schemes
          </h1>
          <p className="text-gray-400 max-w-2xl">
            Convert colors between all formats instantly. Generate tints, shades, complementary/analogous/triadic color schemes, and check WCAG accessibility contrast ratios.
          </p>
        </div>

        {/* Color picker + main display */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <div className="w-full h-32 rounded-xl mb-4 border border-white/10 relative overflow-hidden" style={{ backgroundColor: hex }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-bold text-lg px-3 py-1 rounded-xl"
                    style={{ color: bestContrast==="white"?"rgba(255,255,255,0.9)":"rgba(0,0,0,0.8)", backgroundColor: bestContrast==="white"?"rgba(0,0,0,0.2)":"rgba(255,255,255,0.2)" }}>
                    {hex.toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 items-center mb-4">
                <input type="color" value={hex} onChange={e => setHexWithHistory(e.target.value)}
                  className="w-12 h-10 rounded-lg border border-white/10 bg-[#0A0A14] cursor-pointer flex-shrink-0" />
                <input value={hex} onChange={e => onHexInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#6C3AFF]/60 transition-all"
                  placeholder="#6C3AFF" />
              </div>

              {/* ✅ Enhancement 1: Color history */}
              {colorHistory.length > 1 && (
                <div className="mb-4">
                  <div className="text-xs text-gray-600 mb-2">Recent</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {colorHistory.map((h, i) => (
                      <button key={i} onClick={() => setHexWithHistory(h)} title={h}
                        className={`w-7 h-7 rounded-lg border transition-all hover:scale-110 ${h === hex ? "border-white/60 scale-110" : "border-white/10 hover:border-white/40"}`}
                        style={{ backgroundColor: h }} />
                    ))}
                  </div>
                </div>
              )}
              {hsl && (
                <div className="space-y-3">
                  {[
                    { label:"H", key:"h" as keyof HSL, max:360, suffix:"°", grad:`linear-gradient(to right, hsl(0,${hsl.s}%,${hsl.l}%), hsl(60,${hsl.s}%,${hsl.l}%), hsl(120,${hsl.s}%,${hsl.l}%), hsl(180,${hsl.s}%,${hsl.l}%), hsl(240,${hsl.s}%,${hsl.l}%), hsl(300,${hsl.s}%,${hsl.l}%), hsl(360,${hsl.s}%,${hsl.l}%))` },
                    { label:"S", key:"s" as keyof HSL, max:100, suffix:"%", grad:`linear-gradient(to right, hsl(${hsl.h},0%,${hsl.l}%), hsl(${hsl.h},100%,${hsl.l}%))` },
                    { label:"L", key:"l" as keyof HSL, max:100, suffix:"%", grad:`linear-gradient(to right, #000, hsl(${hsl.h},${hsl.s}%,50%), #fff)` },
                  ].map(s => (
                    <div key={s.key}>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>{s.label}</span><span className="font-mono">{hsl[s.key]}{s.suffix}</span>
                      </div>
                      <div className="relative h-4 rounded-full overflow-hidden cursor-pointer" style={{ background: s.grad }}>
                        <input type="range" min={0} max={s.max} value={hsl[s.key]}
                          onChange={e => onHslChange(s.key, +e.target.value)}
                          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full" />
                        <div className="absolute top-0 bottom-0 w-4 h-4 rounded-full bg-white border-2 border-gray-800 shadow-lg pointer-events-none -translate-x-1/2"
                          style={{ left: `${(hsl[s.key]/s.max)*100}%` }} />
                      </div>
                    </div>
                  ))}
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Alpha</span><span className="font-mono">{alpha}%</span></div>
                    <input type="range" min={0} max={100} value={alpha} onChange={e => setAlpha(+e.target.value)} className="w-full accent-[#6C3AFF]" />
                  </div>
                </div>
              )}
              {nearestCss && (
                <div className="mt-3 text-xs text-gray-400">
                  Nearest CSS color: <span className="text-[#6C3AFF] font-semibold">{nearestCss}</span>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">All Color Formats</h3>
              <div className="space-y-2">
                {formats.map(f => (
                  <div key={f.key} className="flex items-center gap-3 bg-[#0A0A14] rounded-xl px-4 py-2.5 border border-white/5 hover:border-[#6C3AFF]/20 transition-all group">
                    <span className="text-xs font-bold text-gray-500 w-14 flex-shrink-0">{f.label}</span>
                    <code className="flex-1 text-sm text-white font-mono truncate">{f.value}</code>
                    <button onClick={() => copy(f.key, f.value)}
                      className={`text-xs px-3 py-1 rounded-lg transition-all border flex-shrink-0 ${
                        copiedKey===f.key ? "bg-green-600 text-white border-transparent" : "bg-[#13131F] border-white/10 text-gray-500 hover:text-white opacity-0 group-hover:opacity-100"
                      }`}>
                      {copiedKey===f.key ? "✓" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">WCAG Contrast Checker</h3>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="rounded-xl p-3 flex items-center gap-3 border border-white/10" style={{ backgroundColor: hex }}>
                  <span className="font-bold text-sm text-white">White text</span>
                  <span className="text-xs ml-auto font-mono text-white">{contrastWhite.toFixed(2)}:1</span>
                </div>
                <div className="rounded-xl p-3 flex items-center gap-3 border border-white/10" style={{ backgroundColor: hex }}>
                  <span className="font-bold text-sm text-black">Black text</span>
                  <span className="text-xs ml-auto font-mono text-black">{contrastBlack.toFixed(2)}:1</span>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <span className={`px-3 py-1.5 rounded-lg border font-semibold ${wcagAA?"bg-green-500/10 text-green-400 border-green-500/20":"bg-red-400/10 text-red-400 border-red-400/20"}`}>
                  {wcagAA?"✓":"✗"} WCAG AA
                </span>
                <span className={`px-3 py-1.5 rounded-lg border font-semibold ${wcagAAA?"bg-green-500/10 text-green-400 border-green-500/20":"bg-red-400/10 text-red-400 border-red-400/20"}`}>
                  {wcagAAA?"✓":"✗"} WCAG AAA
                </span>
                <span className="text-gray-500 flex items-center">Best on {bestContrast} background</span>
              </div>

              {/* ✅ Enhancement 3: Custom contrast pair */}
              <div className="mt-4 pt-4 border-t border-white/5">
                <div className="text-xs text-gray-500 font-medium mb-3">Custom Contrast Pair</div>
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <input type="color" value={contrastFg} onChange={e => setContrastFg(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-white/10 bg-[#0A0A14] cursor-pointer flex-shrink-0" />
                    <span className="text-xs text-gray-500">Text</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="color" value={contrastBg} onChange={e => setContrastBg(e.target.value)}
                      className="w-9 h-9 rounded-lg border border-white/10 bg-[#0A0A14] cursor-pointer flex-shrink-0" />
                    <span className="text-xs text-gray-500">Background</span>
                  </div>
                  <div className="rounded-xl px-4 py-2 flex items-center gap-3 border border-white/10 flex-1 min-w-[140px]"
                    style={{ backgroundColor: contrastBg }}>
                    <span className="font-bold text-sm" style={{ color: contrastFg }}>Sample text</span>
                    <span className="text-xs ml-auto font-mono font-bold" style={{ color: contrastFg }}>
                      {customContrast.toFixed(2)}:1
                    </span>
                  </div>
                </div>
                <div className="flex gap-3 text-xs">
                  <span className={`px-3 py-1.5 rounded-lg border font-semibold ${customWcagAA?"bg-green-500/10 text-green-400 border-green-500/20":"bg-red-400/10 text-red-400 border-red-400/20"}`}>
                    {customWcagAA?"✓":"✗"} AA
                  </span>
                  <span className={`px-3 py-1.5 rounded-lg border font-semibold ${customWcagAAA?"bg-green-500/10 text-green-400 border-green-500/20":"bg-red-400/10 text-red-400 border-red-400/20"}`}>
                    {customWcagAAA?"✓":"✗"} AAA
                  </span>
                  <button onClick={() => setContrastFg(hex)} className="text-xs text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">
                    Use current color as text →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tints & Shades */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Tints &amp; Shades</h3>
            {/* ✅ Enhancement 2: Export palette as CSS */}
            <button onClick={exportPalette}
              className="text-xs bg-[#6C3AFF]/20 hover:bg-[#6C3AFF]/40 text-[#6C3AFF] px-3 py-1.5 rounded-lg font-semibold transition-all">
              ⬇ Export CSS Variables
            </button>
          </div>
          <div className="mb-3">
            <div className="text-xs text-gray-500 mb-2">Tints (mixed with white)</div>
            <div className="flex gap-1.5 flex-wrap">
              {tints.map((t,i) => (
                <button key={i} onClick={() => setHexWithHistory(t)} title={t}
                  className="w-9 h-9 rounded-lg border border-white/10 hover:scale-110 transition-all hover:border-white/40 flex-shrink-0"
                  style={{ backgroundColor: t }} />
              ))}
            </div>
          </div>
          <div className="flex gap-1.5 flex-wrap mb-1">
            <button onClick={() => setHexWithHistory(hex)} title={hex}
              className="w-9 h-9 rounded-lg border-2 border-white/60 flex-shrink-0" style={{ backgroundColor: hex }} />
          </div>
          <div className="mt-2">
            <div className="text-xs text-gray-500 mb-2">Shades (mixed with black)</div>
            <div className="flex gap-1.5 flex-wrap">
              {shades.map((s,i) => (
                <button key={i} onClick={() => setHexWithHistory(s)} title={s}
                  className="w-9 h-9 rounded-lg border border-white/10 hover:scale-110 transition-all hover:border-white/40 flex-shrink-0"
                  style={{ backgroundColor: s }} />
              ))}
            </div>
          </div>
        </div>

        {/* Color Schemes */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
            <h3 className="text-sm font-bold text-white">Color Schemes</h3>
            <div className="flex gap-1">
              {(["complement","analogous","triadic","split"] as const).map(s => (
                <button key={s} onClick={() => setScheme(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all border ${
                    scheme===s?"bg-[#6C3AFF] text-white border-transparent":"bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                  }`}>{s}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            {schemeColors.map((c,i) => (
              <div key={i} className="text-center">
                <button onClick={() => setHexWithHistory(c.hex)}
                  className="w-16 h-16 rounded-xl border border-white/10 hover:scale-110 transition-all hover:border-white/40 block"
                  style={{ backgroundColor: c.hex }} />
                <div className="text-xs font-mono text-gray-400 mt-1.5">{c.hex}</div>
                <div className="text-xs text-gray-600">{c.hsl.h}°</div>
              </div>
            ))}
          </div>
        </div>

        {/* Named CSS Colors */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-6">
          <button onClick={() => setShowNamed(p => !p)} className="w-full flex items-center justify-between">
            <span className="font-bold text-white text-sm">Named CSS Colors ({CSS_COLORS.length})</span>
            <span className={`text-[#6C3AFF] text-xl transition-transform ${showNamed?"rotate-45":""}`}>+</span>
          </button>
          {showNamed && (
            <div className="mt-4">
              <input value={namedSearch} onChange={e => setNamedSearch(e.target.value)}
                placeholder="Search color name…"
                className="w-full px-4 py-2 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all mb-4" />
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-64 overflow-y-auto pr-1">
                {filteredNamed.map(([name,h]) => (
                  <button key={name} onClick={() => { setHexWithHistory(h); setShowNamed(false); }} title={`${name} — ${h}`}
                    className="flex flex-col items-center group">
                    <div className="w-full aspect-square rounded-lg border border-white/10 group-hover:scale-110 group-hover:border-white/40 transition-all" style={{ backgroundColor: h }} />
                    <span className="text-xs text-gray-600 mt-1 truncate w-full text-center group-hover:text-white transition-colors">{name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* How to Use */}
        <div className="mt-6 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Color Code Converter</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Pick or enter a color",  desc:"Click the color picker or type any HEX code. All format conversions update instantly." },
              { step:"2", title:"Copy in any format",     desc:"Hover over any format row and click Copy. Use CSS Var format for design system tokens." },
              { step:"3", title:"Generate tints & shades",desc:"Click any swatch to update the main color and build a complete scale for your design system." },
              { step:"4", title:"Check accessibility",    desc:"The WCAG contrast checker shows whether your color meets AA or AAA standards." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#6C3AFF] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div>
                  <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Related Tools ── */}
        <div className="mt-12">
          <h2 className="text-xl font-extrabold text-white mb-2">🔧 Related Developer Tools</h2>
          <p className="text-gray-500 text-sm mb-6">More free dev tools — no login required</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {RELATED_TOOLS.map(tool => (
              <Link key={tool.slug} href={`/tools/${tool.slug}`}
                className="group bg-[#13131F] border border-white/5 rounded-2xl p-4 flex flex-col items-center text-center gap-2 hover:border-[#6C3AFF]/40 hover:-translate-y-0.5 transition-all">
                <span className="text-2xl">{tool.icon}</span>
                <span className="text-white text-xs font-semibold group-hover:text-[#00D4FF] transition-colors leading-snug">{tool.name}</span>
                <span className="text-xs text-[#6C3AFF] font-medium opacity-0 group-hover:opacity-100 transition-opacity">Try it →</span>
              </Link>
            ))}
          </div>
        </div>

        {/* ── Pro CTA ── */}
        <div className="mt-10 bg-gradient-to-r from-[#6C3AFF]/10 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-7 flex flex-col sm:flex-row items-center gap-6">
          <div className="text-4xl">⚡</div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="font-extrabold text-white text-lg mb-1">Unlock PursTech Pro</h3>
            <p className="text-gray-500 text-sm">Unlimited tool usage, zero ads, batch processing and API access — from $5/month.</p>
          </div>
          <Link href="/pro" className="flex-shrink-0 px-7 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold text-sm transition-all shadow-lg shadow-violet-900/30">
            Get Pro →
          </Link>
        </div>

        {/* ── FAQ — always last ── */}
        <div className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f,i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>

      {/* ── Footer — fixed: About→Terms, © 2025→2026 ── */}
      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
