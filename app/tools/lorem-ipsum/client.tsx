"use client";

import { useState } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; 

const RELATED_TOOLS = [
  { icon: "🔤", name: "Case Converter",   slug: "case-converter"    },
  { icon: "📝", name: "Word Counter",     slug: "word-counter"      },
  { icon: "✍️", name: "Grammar Checker",  slug: "grammar-checker"   },
  { icon: "📊", name: "Readability Score",slug: "readability-score" },
  { icon: "🔍", name: "Diff Checker",     slug: "diff-checker"      },
];

const FAQ = [
  { q: "What is Lorem Ipsum?", a: "Lorem Ipsum is dummy placeholder text used in graphic design, publishing and web development. It has been the standard filler text since the 1500s, derived from a Latin work by Cicero." },
  { q: "Why do designers use Lorem Ipsum?", a: "It lets designers focus on layout and visual design without being distracted by the actual content. Readable but meaningless text prevents the eye from focusing on words rather than design." },
  { q: "Is Lorem Ipsum real Latin?", a: "It is derived from Latin but scrambled and altered so it reads as pseudo-Latin. It is not actually meaningful Latin prose." },
  { q: "Can I use this text commercially?", a: "Yes. Lorem Ipsum is placeholder text in the public domain. It can be used freely in any project — commercial or personal." },
  { q: "What is the difference between paragraphs, sentences and words?", a: "Paragraphs generate multiple sentences grouped together — ideal for body text. Sentences generate individual complete sentences for captions or subtitles. Words generate raw word sequences without punctuation, useful for heading and label placeholders." },
];

const LOREM_WORDS = [
  "lorem","ipsum","dolor","sit","amet","consectetur","adipiscing","elit","sed","do","eiusmod","tempor",
  "incididunt","ut","labore","et","dolore","magna","aliqua","enim","ad","minim","veniam","quis","nostrud",
  "exercitation","ullamco","laboris","nisi","aliquip","ex","ea","commodo","consequat","duis","aute","irure",
  "in","reprehenderit","voluptate","velit","esse","cillum","eu","fugiat","nulla","pariatur","excepteur","sint",
  "occaecat","cupidatat","non","proident","sunt","culpa","qui","officia","deserunt","mollit","anim","id","est",
  "perspiciatis","unde","omnis","iste","natus","error","voluptatem","accusantium","doloremque","laudantium",
  "totam","rem","aperiam","eaque","ipsa","quae","ab","illo","inventore","veritatis","quasi","architecto",
  "beatae","vitae","dicta","explicabo","nemo","ipsam","quia","voluptas","aspernatur","aut","odit","fugit",
];

function getWords(count: number): string[] {
  return Array.from({ length: count }, () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
}

function generateSentence(): string {
  const words = getWords(Math.floor(Math.random() * 10) + 8);
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(): string {
  return Array.from({ length: Math.floor(Math.random() * 3) + 4 }, generateSentence).join(" ");
}

function generateText(type: "paragraphs"|"sentences"|"words", count: number, startWithLorem: boolean): string {
  if (type === "paragraphs") {
    const paras = Array.from({ length: count }, generateParagraph);
    if (startWithLorem) paras[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
    return paras.join("\n\n");
  }
  if (type === "sentences") {
    const sents = Array.from({ length: count }, generateSentence);
    if (startWithLorem) sents[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
    return sents.join(" ");
  }
  const words = getWords(count);
  if (startWithLorem) { words[0] = "Lorem"; words[1] = "ipsum"; }
  return words.join(" ");
}

export default function LoremIpsumClient() {
  useTrackTool("lorem-ipsum", "text");

  const [type,       setType]       = useState<"paragraphs"|"sentences"|"words">("paragraphs");
  const [count,      setCount]      = useState(3);
  const [startLorem, setStartLorem] = useState(true);
  const [output,     setOutput]     = useState("");
  const [copied,     setCopied]     = useState(false);

  const maxCount = type === "words" ? 500 : type === "sentences" ? 20 : 10;

  const handleGenerate = () => {
    setOutput(generateText(type, count, startLorem));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    Object.assign(document.createElement("a"), {
      href:     URL.createObjectURL(new Blob([output], { type: "text/plain" })),
      download: "lorem-ipsum.txt",
    }).click();
  };

  const wordCount = output ? output.trim().split(/\s+/).length : 0;
  const charCount = output.length;

  return (
    // ✅ CRITICAL QA FIX: Mobile Fortification
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10 flex-grow w-full">

        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/text" className="hover:text-gray-400">Text Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Lorem Ipsum Generator</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">📄</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Lorem Ipsum Generator</h1>
              <p className="text-gray-500 mt-1">Generate placeholder lorem ipsum text by paragraphs, sentences or word count — free, instant.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 flex flex-col gap-5 min-w-0">

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex flex-col gap-5">
              <div>
                <label className="text-xs text-gray-500 font-medium block mb-3 uppercase tracking-wider">Generate</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["paragraphs","sentences","words"] as const).map(t => (
                    <button key={t} onClick={() => { setType(t); setCount(Math.min(count, t==="words"?500:t==="sentences"?20:10)); }}
                      className={`py-3 rounded-xl text-sm font-bold transition-all capitalize ${
                        type === t ? "bg-[#6C3AFF] text-white" : "bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white"
                      }`}>{t}</button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-xs text-gray-500 font-medium uppercase tracking-wider">How many {type}</label>
                  <span className="text-2xl font-extrabold text-[#6C3AFF]">{count}</span>
                </div>
                <input type="range" min={1} max={maxCount} value={count}
                  onChange={e => setCount(Number(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[#6C3AFF]" />
              </div>

              <div className="flex items-center justify-between bg-[#0A0A14] rounded-xl px-4 py-3">
                <div>
                  <div className="text-sm font-semibold text-white">Start with &ldquo;Lorem ipsum...&rdquo;</div>
                  <div className="text-xs text-gray-500">Begin with the classic opening phrase</div>
                </div>
                <button onClick={() => setStartLorem(!startLorem)}
                  className={`w-11 h-6 rounded-full transition-all relative ${startLorem ? "bg-[#6C3AFF]" : "bg-gray-700"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${startLorem ? "left-6" : "left-1"}`} />
                </button>
              </div>

              <button onClick={handleGenerate}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] hover:opacity-90 text-white font-extrabold text-lg transition-all shadow-xl shadow-violet-900/30">
                ✨ Generate Lorem Ipsum
              </button>
            </div>

            {output && (
              <div className="min-w-0">
                <div className="flex flex-wrap items-center justify-between mb-2 gap-3">
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>Words: <span className="text-white font-bold">{wordCount}</span></span>
                    <span>Chars: <span className="text-white font-bold">{charCount}</span></span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleDownload}
                      className="text-xs bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg font-semibold transition-all">
                      ⬇ .txt
                    </button>
                    <button onClick={handleCopy}
                      className="text-xs bg-[#6C3AFF]/20 hover:bg-[#6C3AFF]/40 text-[#6C3AFF] px-3 py-1.5 rounded-lg font-bold transition-all">
                      {copied ? "✅ Copied!" : "📋 Copy Text"}
                    </button>
                  </div>
                </div>
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 text-sm text-gray-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto break-words">
                  {output}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">💡 When to Use Lorem Ipsum</h3>
              <div className="space-y-3 text-xs text-gray-500">
                {["Wireframes and mockups","Website templates","Print design layouts","App UI prototypes","Typography testing","Client presentations"].map(u => (
                  <div key={u} className="flex items-center gap-2">
                    <span className="text-[#6C3AFF]">→</span><span>{u}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">🔧 Related Tools</h3>
              <div className="space-y-2">
                {RELATED_TOOLS.map(tool => (
                  <Link key={tool.slug} href={`/tools/${tool.slug}`}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#0A0A14] transition-colors group">
                    <span className="text-xl">{tool.icon}</span>
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors">{tool.name}</span>
                    <span className="ml-auto text-gray-700 group-hover:text-[#6C3AFF] transition-colors">→</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">Custom word lists, bulk export, API access</p>
              <Link href="/pro"
                className="block w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all text-center">
                Get Pro — $7/mo
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-auto py-8 text-center">
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
