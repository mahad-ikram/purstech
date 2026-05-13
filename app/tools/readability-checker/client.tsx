"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

/* ── Schema ──────────────────────────────────────────────────────────────── */
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Readability Checker",
  description: "Advanced free readability checker with 7 formulas, target audience mode, sentence difficulty map, famous benchmarks and annotated text view.",
  url: "https://www.purstech.com/tools/readability-checker",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

/* ── Content Arrays (Moved from page.tsx) ────────────────────────────────── */
const FEATURES = [
  { icon:"📐", title:"7 Readability Formulas",        desc:"Flesch, Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau, ARI and Dale-Chall — all calculated simultaneously with progress bars." },
  { icon:"🎯", title:"Target Audience Mode",           desc:"Set your target reader (5th grade → academic) and see a match score showing exactly how close your text is to that level." },
  { icon:"📚", title:"Famous Text Benchmarks",         desc:"See where your text sits relative to Harry Potter, NYT articles, Harvard Law Review and insurance policies on a single visual scale." },
  { icon:"📊", title:"Sentence Difficulty Map",        desc:"A colour-coded bar chart with one bar per sentence — instantly reveals where in your text the density is highest." },
  { icon:"🔍", title:"Annotated Text View",            desc:"Toggleable highlights: long sentences in yellow/red, complex words underlined. Shows the problem areas directly in your text." },
  { icon:"📈", title:"Vocabulary Richness (TTR)",      desc:"Type-Token Ratio measures how varied your vocabulary is — a key indicator of writing quality that no other free tool shows." },
];

const USE_CASES = [
  { who:"Content Writers & SEOs",      why:"Verify blog posts and landing pages target the right reading level for your audience before publishing." },
  { who:"Educators & Academics",       why:"Check whether reading materials are appropriate for student grade levels, and measure academic paper complexity." },
  { who:"UX & Product Writers",        why:"Ensure product copy, onboarding text and help articles are simple enough for all users — including non-native speakers." },
  { who:"Health & Legal Communicators",why:"SMOG formula is the standard for health literacy. Ensure patient-facing documents meet plain-language requirements." },
];

const COMPETITOR_TABLE = [
  { feature:"Number of formulas",              purstech:"7",   hemingway:"1",   webfx:"7",    readable:"6"  },
  { feature:"Target audience mode",            purstech:true,  hemingway:false, webfx:false,  readable:true  },
  { feature:"Famous text benchmarks",          purstech:true,  hemingway:false, webfx:false,  readable:false },
  { feature:"Sentence difficulty map",         purstech:true,  hemingway:false, webfx:false,  readable:false },
  { feature:"Annotated text highlights",       purstech:true,  hemingway:true,  webfx:false,  readable:false },
  { feature:"Complex word list",               purstech:true,  hemingway:false, webfx:false,  readable:true  },
  { feature:"Vocabulary richness (TTR)",       purstech:true,  hemingway:false, webfx:false,  readable:false },
  { feature:"Sentence length distribution",   purstech:true,  hemingway:false, webfx:false,  readable:false },
  { feature:"Download analysis report",        purstech:true,  hemingway:false, webfx:false,  readable:"paid"},
  { feature:"Live update as you type",         purstech:true,  hemingway:true,  webfx:false,  readable:false },
  { feature:"100% free, no account",           purstech:true,  hemingway:false, webfx:true,   readable:false },
];

type CellVal = boolean | string;
const CellIcon = ({ v }: { v: CellVal }) =>
  v === true    ? <span className="text-green-400 font-bold">✓</span> :
  v === false   ? <span className="text-gray-700">—</span> :
  typeof v === "string" && v !== "purstech"
    ? <span className={`font-semibold text-xs ${v === "paid" ? "text-yellow-400" : "text-gray-300"}`}>{v}</span>
    : <span className="text-green-400 font-bold text-xs">{v}</span>;

const FAQ = [
  {
    q: "What is a good Flesch Reading Ease score and what should I target?",
    a: `The Flesch Reading Ease score runs from 0 (unreadably complex) to 100 (extremely simple). Here's how to interpret it and what to target by content type:

90-100: Very Easy — 5th grade level. Consumer product instructions, children's content.
80-90: Easy — 6th grade. Conversational copy, social media, simple emails.
70-80: Fairly Easy — 7th grade. Most marketing copy, landing pages.
60-70: Standard — 8th-9th grade. Blog posts, news articles, general web content. This is the sweet spot for most audiences.
50-60: Fairly Difficult — 10th-12th grade. Professional B2B content, technical blogs.
30-50: Difficult — College level. Academic blogs, whitepapers, research summaries.
0-30: Very Difficult — Graduate level. Academic papers, legal documents, medical literature.

Google doesn't use Flesch scores directly in its algorithm, but clear, readable content performs better because users stay longer, bounce less, and share more — all of which are indirect ranking signals.`,
  },
  {
    q: "What's the difference between all 7 readability formulas?",
    a: `Each formula was designed for a slightly different purpose and uses different inputs:

Flesch Reading Ease (1948): The oldest and most cited. Uses sentence length + syllables per word. Gives a 0-100 score where higher = easier. Best for: general writing quality assessment.

Flesch-Kincaid Grade Level (1975): Converts Flesch into a US school grade level. Developed for the US Navy to assess technical manuals. Best for: quick grade-level equivalence.

Gunning Fog Index (1952): Counts 3-syllable words as "complex." Grade-level output. Best for: journalism and business writing. Robert Gunning created it specifically for newspapers.

SMOG Index (1969): Simple Measure of Gobbledygook. Counts polysyllabic words in 30 sentences. The most validated formula for health communications — recommended by the CDC and NHS. Best for: health, safety and legal plain-language compliance.

Coleman-Liau Index (1975): Uses character counts rather than syllables, so it's less subjective. Best for: computerised text analysis where syllable counting is unreliable.

ARI (Automated Readability Index, 1967): Uses characters per word and words per sentence. Developed for real-time monitoring on typewriters. Best for: objective analysis without syllable ambiguity.

Dale-Chall (1948, updated 1995): Compares words against a list of 3,000 familiar words. Grades difficult unfamiliar words more harshly. Best for: educational and children's content assessment.`,
  },
  {
    q: "What are the famous text benchmarks and how should I use them?",
    a: `The benchmarks show where well-known published texts score, giving you real-world context for your own score. Here are the reference points used:

Harry Potter (J.K. Rowling): Flesch ~72 — This is the target for young adult and accessible general fiction. Rowling's prose is famously readable.

New York Times: Flesch ~65 — The standard for quality journalism. Clear to educated adults but not dumbed down.

Harvard Business Review: Flesch ~43 — Academic business writing. Appropriate for professional audiences.

Academic Research Papers: Flesch ~30 — Dense, specialised language assumed for expert readers.

Insurance Policies: Flesch ~16 — Notoriously difficult. Often cited as a readability failure case study.

Use the benchmark scale to quickly understand your text's difficulty in concrete terms. "I'm similar to an NYT article" is more intuitive than "I scored 63 on Flesch."`,
  },
  {
    q: "What is vocabulary richness and why does it matter?",
    a: `Vocabulary richness is measured by the Type-Token Ratio (TTR): the percentage of unique words out of total words. A TTR of 60% means 60 in every 100 words are distinct.

Why it matters:
High TTR suggests varied, precise vocabulary — a mark of skilled writing. Low TTR indicates repetitive, formulaic language that can feel monotonous to read.

Important caveat: TTR naturally decreases in longer texts because common words (the, and, is, you) inevitably repeat. For short texts (under 200 words), TTR above 70% is excellent. For medium texts (500-1000 words), 50-65% is strong. For long texts (2000+ words), 40-55% is expected and acceptable.

When improving vocabulary richness: identify the most repeated non-stop words from our overused words analysis, and replace some instances with synonyms where meaning is preserved. But don't sacrifice clarity for variety — precision is more important than diversity in technical writing.`,
  },
  {
    q: "What does the sentence difficulty map show and how do I use it?",
    a: `The sentence difficulty map displays one horizontal bar per sentence in your text. Each bar's length represents the number of words in that sentence. The colour indicates difficulty:

🟢 Green (≤15 words): Short, easy sentences. Readers process these instantly.
🟡 Yellow (16-25 words): Moderate length. Acceptable but watch the density.
🟠 Orange (26-35 words): Long sentences. Each one is a reading challenge.
🔴 Red (>35 words): Very long. These almost always need to be split.

How to use it: Look for clusters of orange and red bars — those are the sections of your text with the highest cognitive load. Click the "Annotate Text" button to see those sentences highlighted directly in the text, then split the longest ones first. Splitting one 40-word sentence into two 20-word sentences can meaningfully improve your Flesch score.

Best practice: no more than 15-20% of your sentences should be over 25 words for general-audience writing.`,
  },
];

/* ── Syllable counter ────────────────────────────────────────────────────── */
function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w)          return 0;
  if (w.length <= 3) return 1;
  const stripped = w.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  return Math.max(1, (stripped.match(/[aeiouy]{1,2}/g) ?? []).length);
}

/* ── Sentence splitter ───────────────────────────────────────────────────── */
function parseSentences(text: string): { text: string; wordCount: number }[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 2)
    .map(s => ({ text: s, wordCount: s.split(/\s+/).filter(Boolean).length }));
}

/* ── Full analysis engine ────────────────────────────────────────────────── */
interface Analysis {
  words: number; sentences: number; chars: number; syllables: number;
  complexWords: number; complexWordList: string[];
  avgSentLen: number; avgSyllPerWord: number;
  flesch: number; fkGrade: number; fog: number; smog: number;
  colemanLiau: number; ari: number; daleChall: number;
  readLabel: string; vocabRichness: number;
  uniqueWords: number; longSentCount20: number; longSentCount30: number;
  readingMins: number;
  sentenceData: { text: string; wordCount: number }[];
}

const DALE_CHALL_FAMILIAR = new Set([
  "a","about","above","across","after","again","against","air","all","almost","also",
  "always","an","and","animal","another","answer","any","are","around","as","ask","at",
  "away","back","be","because","been","before","behind","believe","best","better",
  "between","big","black","body","book","both","bring","brother","but","by","call",
  "came","can","carry","change","children","city","come","could","country","cut","day",
  "did","different","do","does","done","door","down","during","each","early","earth",
  "eat","end","enough","even","ever","every","example","eye","face","fact","family",
  "far","feet","few","find","first","follow","food","for","form","found","four","from",
  "front","full","get","give","go","going","good","great","grow","had","hand","happen",
  "has","have","he","head","hear","help","her","here","high","him","his","home","how",
  "idea","if","important","in","is","it","its","just","keep","kind","know","land",
  "large","last","later","learn","leave","left","let","life","light","like","line",
  "list","little","live","long","look","made","make","man","many","may","me","mean",
  "men","mile","miss","more","most","mother","move","much","must","my","name","need",
  "never","new","next","night","no","not","now","number","of","off","often","old","on",
  "once","one","only","open","or","other","our","out","over","own","page","people",
  "picture","place","play","point","put","question","right","river","road","run",
  "said","same","saw","say","school","sea","second","see","seem","sentence","set",
  "she","should","show","side","since","small","so","some","something","sometimes",
  "song","soon","sound","spell","start","state","still","stop","story","study",
  "such","take","tell","than","that","the","their","them","then","there","these",
  "they","thing","think","this","those","three","through","time","to","together","too",
  "top","turn","two","under","until","up","us","use","very","walk","want","was","watch",
  "water","way","we","well","went","were","what","when","where","which","while","who",
  "why","will","with","word","work","world","would","write","year","you","young","your",
]);

function runAnalysis(text: string): Analysis | null {
  const wordsArr   = text.trim().split(/\s+/).filter(w => /\w/.test(w));
  const sentsArr   = parseSentences(text);
  const W = wordsArr.length;
  const S = Math.max(sentsArr.length, 1);
  if (W < 5) return null;

  const syllCounts  = wordsArr.map(w => syllables(w));
  const totalSylls  = syllCounts.reduce((a, b) => a + b, 0);
  const letters     = text.replace(/[^a-zA-Z]/g, "").length;
  const complexW    = wordsArr.filter((_, i) => syllCounts[i] >= 3);
  const complexSet  = [...new Set(complexW.map(w => w.toLowerCase().replace(/[^a-z]/g, "")))].sort((a, b) => syllables(b) - syllables(a)).slice(0, 20);
  const uniqueArr   = [...new Set(wordsArr.map(w => w.toLowerCase().replace(/[^a-z]/g, "")))];

  // Flesch Reading Ease
  const flesch      = Math.min(100, Math.max(0, Math.round((206.835 - 1.015 * (W / S) - 84.6 * (totalSylls / W)) * 10) / 10));
  // FK Grade
  const fkGrade     = Math.max(0, Math.round((0.39 * (W / S) + 11.8 * (totalSylls / W) - 15.59) * 10) / 10);
  // Gunning Fog
  const fog         = Math.max(0, Math.round((0.4 * ((W / S) + 100 * (complexW.length / W))) * 10) / 10);
  // SMOG
  const smog        = Math.max(0, Math.round((1.0430 * Math.sqrt(complexW.length * (30 / S)) + 3.1291) * 10) / 10);
  // Coleman-Liau
  const colemanLiau = Math.max(0, Math.round((0.0588 * ((letters / W) * 100) - 0.296 * ((S / W) * 100) - 15.8) * 10) / 10);
  // ARI
  const ari         = Math.max(0, Math.round((4.71 * (letters / W) + 0.5 * (W / S) - 21.43) * 10) / 10);
  // Dale-Chall (simplified)
  const unfamiliar  = wordsArr.filter(w => !DALE_CHALL_FAMILIAR.has(w.toLowerCase().replace(/[^a-z]/g, ""))).length;
  const dcRaw       = 0.1579 * ((unfamiliar / W) * 100) + 0.0496 * (W / S);
  const daleChall   = Math.round((unfamiliar / W > 0.05 ? dcRaw + 3.6365 : dcRaw) * 10) / 10;

  const readLabel   = flesch >= 80 ? "Easy" : flesch >= 60 ? "Standard" : flesch >= 40 ? "Fairly Difficult" : "Difficult";

  return {
    words: W, sentences: S, chars: letters, syllables: totalSylls,
    complexWords: complexW.length, complexWordList: complexSet,
    avgSentLen:  Math.round((W / S) * 10) / 10,
    avgSyllPerWord: Math.round((totalSylls / W) * 100) / 100,
    flesch, fkGrade, fog, smog, colemanLiau, ari, daleChall,
    readLabel,
    vocabRichness: Math.round((uniqueArr.length / W) * 100),
    uniqueWords: uniqueArr.length,
    longSentCount20: sentsArr.filter(s => s.wordCount > 20).length,
    longSentCount30: sentsArr.filter(s => s.wordCount > 30).length,
    readingMins: Math.max(1, Math.ceil(W / 200)),
    sentenceData: sentsArr,
  };
}

/* ── Target audience config ─────────────────────────────────────────────── */
const AUDIENCES = [
  { id:"child",    label:"5th Grade",    emoji:"🧒", targetFlesch: 90, grade:"5"     },
  { id:"middle",   label:"Middle School",emoji:"📚", targetFlesch: 80, grade:"6-8"   },
  { id:"high",     label:"High School",  emoji:"🎒", targetFlesch: 70, grade:"9-12"  },
  { id:"general",  label:"General Adult",emoji:"👤", targetFlesch: 60, grade:"13+"   },
  { id:"college",  label:"College",      emoji:"🎓", targetFlesch: 45, grade:"College"},
  { id:"academic", label:"Academic/Pro", emoji:"🔬", targetFlesch: 25, grade:"PhD"   },
];

/* ── Famous benchmarks ───────────────────────────────────────────────────── */
const BENCHMARKS = [
  { name:"Insurance Policy",        flesch: 14, color:"#ef4444" },
  { name:"Academic Paper",          flesch: 30, color:"#f97316" },
  { name:"Harvard Business Review", flesch: 43, color:"#f59e0b" },
  { name:"New York Times",          flesch: 65, color:"#84cc16" },
  { name:"Harry Potter",            flesch: 72, color:"#22c55e" },
  { name:"Twitter Help",            flesch: 84, color:"#10b981" },
];

/* ── Sentence difficulty map ─────────────────────────────────────────────── */
function SentenceMap({ sentences }: { sentences: { text: string; wordCount: number }[] }) {
  const maxW = Math.max(...sentences.map(s => s.wordCount), 1);
  return (
    <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
      {sentences.slice(0, 40).map((s, i) => {
        const color = s.wordCount <= 15 ? "#22c55e" : s.wordCount <= 25 ? "#f59e0b" : s.wordCount <= 35 ? "#f97316" : "#ef4444";
        return (
          <div key={i} className="flex items-center gap-2 group">
            <span className="w-5 text-xs text-gray-700 text-right flex-shrink-0">{i + 1}</span>
            <div className="relative flex-1 h-4 bg-[#0A0A14] rounded overflow-hidden cursor-default"
              title={s.text.slice(0, 100) + (s.text.length > 100 ? "…" : "")}>
              <div style={{ width:`${(s.wordCount / maxW) * 100}%`, backgroundColor: color }}
                className="h-full rounded transition-all" />
            </div>
            <span className="w-9 text-xs flex-shrink-0" style={{ color }}>{s.wordCount}w</span>
          </div>
        );
      })}
      {sentences.length > 40 && (
        <div className="text-xs text-gray-600 text-center pt-1">+{sentences.length - 40} more sentences</div>
      )}
    </div>
  );
}

/* ── Annotated text view ─────────────────────────────────────────────────── */
function AnnotatedText({ text, sentenceData, showSents, showComplex }: {
  text: string; sentenceData: { text: string; wordCount: number }[];
  showSents: boolean; showComplex: boolean;
}) {
  if (!showSents && !showComplex) {
    return <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap">{text}</div>;
  }

  const complexWords = new Set(
    text.split(/\s+/)
      .map(w => w.toLowerCase().replace(/[^a-z]/g, ""))
      .filter(w => syllables(w) >= 3)
  );

  return (
    <div className="text-sm leading-loose whitespace-pre-wrap">
      {sentenceData.map((sent, si) => {
        const sentBg = showSents
          ? sent.wordCount > 30 ? "bg-red-400/20 rounded"
          : sent.wordCount > 20 ? "bg-yellow-400/20 rounded"
          : "" : "";

        const words = sent.text.split(/(\s+)/);
        return (
          <span key={si} className={sentBg}>
            {words.map((token, wi) => {
              const clean = token.toLowerCase().replace(/[^a-z]/g, "");
              const isComplex = showComplex && complexWords.has(clean) && syllables(clean) >= 3;
              return isComplex
                ? <span key={wi} className="underline decoration-[#f59e0b] decoration-wavy decoration-2 text-yellow-200 cursor-help"
                    title={`${syllables(clean)} syllables`}>{token}</span>
                : <span key={wi}>{token}</span>;
            })}
            {" "}
          </span>
        );
      })}
    </div>
  );
}

/* ── Sample text ─────────────────────────────────────────────────────────── */
const SAMPLE = `The rapid advancement of artificial intelligence technology has created unprecedented opportunities for businesses across virtually every industry sector. However, implementing these sophisticated systems effectively requires careful consideration of numerous complex factors. Organisations must evaluate their existing infrastructure capabilities, workforce competencies, and strategic objectives before committing to substantial technological transformation initiatives.

The successful integration of artificial intelligence into established operational workflows necessitates comprehensive planning, significant resource allocation, and ongoing maintenance commitments from dedicated technical personnel. Without adequate preparation and organisational change management, even the most advanced technological implementations frequently encounter substantial resistance from existing staff members.

Clear communication helps teams succeed. Short sentences are easier to read. People understand simple words faster.`;

/* ── Main component ──────────────────────────────────────────────────────── */
export default function ReadabilityCheckerClient({ children }: { children?: React.ReactNode }) {
  const [text,         setText]         = useState(SAMPLE);
  const [targetAud,    setTargetAud]    = useState("general");
  const [showSents,    setShowSents]    = useState(false);
  const [showComplex,  setShowComplex]  = useState(false);
  const [viewMode,     setViewMode]     = useState<"editor" | "annotated">("editor");
  const [copied,       setCopied]       = useState(false);

  const stats = useMemo(() => runAnalysis(text), [text]);
  const target = AUDIENCES.find(a => a.id === targetAud) ?? AUDIENCES[3];

  /* How close is the text to the target audience */
  const matchScore = stats
    ? Math.max(0, 100 - Math.abs(stats.flesch - target.targetFlesch) * 2)
    : 0;
  const matchLabel = matchScore >= 80 ? "✓ Great match" : matchScore >= 50 ? "~ Close match" : "✗ Off target";
  const matchColor = matchScore >= 80 ? "text-green-400" : matchScore >= 50 ? "text-yellow-400" : "text-red-400";

  const fleschInfo = stats
    ? stats.flesch >= 80 ? { label:"Easy",            color:"#22c55e" }
    : stats.flesch >= 60 ? { label:"Standard",        color:"#84cc16" }
    : stats.flesch >= 40 ? { label:"Fairly Difficult", color:"#f59e0b" }
    : stats.flesch >= 20 ? { label:"Difficult",        color:"#f97316" }
    : { label:"Very Difficult", color:"#ef4444" }
    : null;

  const downloadReport = () => {
    if (!stats) return;
    const lines = [
      `Readability Analysis Report — ${new Date().toLocaleDateString()}`,
      `Tool: PursTech Readability Checker`,
      ``,
      `SCORES`,
      `Flesch Reading Ease:     ${stats.flesch}/100 (${stats.readLabel})`,
      `Flesch-Kincaid Grade:    ${stats.fkGrade}`,
      `Gunning Fog Index:       ${stats.fog}`,
      `SMOG Index:              ${stats.smog}`,
      `Coleman-Liau Index:      ${stats.colemanLiau}`,
      `ARI:                     ${stats.ari}`,
      `Dale-Chall:              ${stats.daleChall}`,
      ``,
      `STATISTICS`,
      `Words:                   ${stats.words}`,
      `Sentences:               ${stats.sentences}`,
      `Average sentence length: ${stats.avgSentLen} words`,
      `Average syllables/word:  ${stats.avgSyllPerWord}`,
      `Complex words (3+ syl):  ${stats.complexWords} (${Math.round(stats.complexWords/stats.words*100)}%)`,
      `Vocabulary richness:     ${stats.vocabRichness}% (${stats.uniqueWords} unique words)`,
      `Sentences > 20 words:    ${stats.longSentCount20}`,
      `Sentences > 30 words:    ${stats.longSentCount30}`,
      `Estimated reading time:  ${stats.readingMins} min`,
      ``,
      `TOP COMPLEX WORDS`,
      stats.complexWordList.join(", "),
      ``,
      `TEXT`,
      `${"─".repeat(60)}`,
      text,
    ];
    const blob = new Blob([lines.join("\n")], { type:"text/plain" });
    Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob), download:"readability-report.txt",
    }).click();
  };

  /* Formula rows */
  const formulas = stats ? [
    { name:"Flesch Reading Ease", value:stats.flesch, max:100, desc:`${stats.readLabel} — ${stats.flesch >= 60 ? "suitable for general audiences" : "requires educated readers"}`, barColor:"#6C3AFF", invert:false },
    { name:"Flesch-Kincaid Grade", value:Math.min(stats.fkGrade,20), max:20, display:`Grade ${stats.fkGrade}`, desc:`US school grade ${Math.round(stats.fkGrade)} reading level`, barColor:"#00D4FF", invert:true },
    { name:"Gunning Fog",  value:Math.min(stats.fog,20),         max:20, display:`${stats.fog}`,        desc:`${stats.fog <= 12 ? "Suitable for general readers" : "Above newspaper level"}`, barColor:"#f97316", invert:true },
    { name:"SMOG Index",   value:Math.min(stats.smog,20),        max:20, display:`${stats.smog}`,       desc:"Best validated for health communications",    barColor:"#f59e0b", invert:true },
    { name:"Coleman-Liau", value:Math.min(stats.colemanLiau,20), max:20, display:`${stats.colemanLiau}`,desc:"Character-based formula — no syllable ambiguity", barColor:"#a855f7", invert:true },
    { name:"ARI",          value:Math.min(stats.ari,20),         max:20, display:`${stats.ari}`,        desc:"Automated — uses characters per word", barColor:"#ec4899", invert:true },
    { name:"Dale-Chall",   value:Math.min(stats.daleChall,16),   max:16, display:`${stats.daleChall}`,  desc:`Based on 3,000 familiar words — ${stats.daleChall < 8 ? "mostly familiar vocabulary" : "contains unfamiliar words"}`, barColor:"#14b8a6", invert:true },
  ] : [];

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">← All Tools</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/"      className="hover:text-gray-400">Home</Link><span>›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span>›</span>
          <span className="text-gray-400">Readability Checker</span>
        </nav>

        {/* ── Top Header from page.tsx ───────────────────────────────────── */}
        {children}

        {/* ── Target audience selector ──────────────────────────────────── */}
        <div className="mb-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Target Audience</div>
          <div className="flex flex-wrap gap-2">
            {AUDIENCES.map(a => (
              <button key={a.id} onClick={() => setTargetAud(a.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  targetAud === a.id
                    ? "bg-[#6C3AFF] text-white border-transparent"
                    : "bg-[#13131F] border-white/5 text-gray-400 hover:text-white hover:border-white/20"
                }`}>
                <span>{a.emoji}</span><span>{a.label}</span>
                <span className={`text-xs opacity-60 ${targetAud === a.id ? "text-white" : "text-gray-600"}`}>
                  (Grade {a.grade})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Main grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

          {/* Left: text input + annotated view */}
          <div className="space-y-3">
            {/* View toggle */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex gap-1 bg-[#13131F] border border-white/5 p-1 rounded-xl">
                {(["editor","annotated"] as const).map(v => (
                  <button key={v} onClick={() => setViewMode(v)}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${viewMode===v ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"}`}>
                    {v === "editor" ? "✎ Edit" : "🔍 Annotate"}
                  </button>
                ))}
              </div>
              {viewMode === "annotated" && (
                <>
                  <button onClick={() => setShowSents(p => !p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${showSents ? "bg-yellow-400/20 text-yellow-400 border-yellow-400/30" : "bg-[#13131F] border-white/10 text-gray-400 hover:text-white"}`}>
                    Long Sentences
                  </button>
                  <button onClick={() => setShowComplex(p => !p)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${showComplex ? "bg-orange-400/20 text-orange-400 border-orange-400/30" : "bg-[#13131F] border-white/10 text-gray-400 hover:text-white"}`}>
                    Complex Words
                  </button>
                </>
              )}
            </div>

            {/* Editor */}
            {viewMode === "editor" ? (
              <div className="relative">
                <textarea value={text} onChange={e => setText(e.target.value)} rows={16}
                  placeholder="Paste or type your text — all 7 scores update instantly as you type…"
                  className="w-full px-5 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-gray-200 text-sm leading-relaxed focus:outline-none focus:border-[#6C3AFF]/30 resize-none transition-all" />
                <span className="absolute bottom-3 right-3 text-xs text-gray-600">{text.length} chars</span>
              </div>
            ) : (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-h-[250px] max-h-[480px] overflow-y-auto">
                {stats ? (
                  <>
                    <AnnotatedText text={text} sentenceData={stats.sentenceData}
                      showSents={showSents} showComplex={showComplex} />
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-white/5 text-xs text-gray-600">
                      {showSents && <>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-red-400/30 inline-block" /> &gt;30 words</span>
                        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-yellow-400/20 inline-block" /> 21-30 words</span>
                      </>}
                      {showComplex && <span className="flex items-center gap-1"><span className="underline decoration-[#f59e0b] decoration-wavy">word</span> 3+ syllables</span>}
                    </div>
                  </>
                ) : (
                  <div className="text-gray-600 text-sm">Enter at least a few sentences to see the annotated view.</div>
                )}
              </div>
            )}

            {/* Quick stats row */}
            {stats && (
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label:"Words",       value: stats.words                     },
                  { label:"Sentences",   value: stats.sentences                 },
                  { label:"Avg length",  value: `${stats.avgSentLen}w`          },
                  { label:"Read time",   value: `${stats.readingMins} min`      },
                ].map(s => (
                  <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-xl p-3 text-center">
                    <div className="text-base font-extrabold text-white">{s.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Download + copy */}
            {stats && (
              <div className="flex gap-2">
                <button onClick={downloadReport}
                  className="flex-1 py-2.5 rounded-xl bg-[#13131F] border border-white/10 text-gray-300 hover:text-white text-sm font-bold transition-all">
                  ⬇ Download Report
                </button>
                <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
                  className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all border ${copied ? "bg-green-600 text-white border-transparent" : "bg-[#13131F] border-white/10 text-gray-300 hover:text-white"}`}>
                  {copied ? "✓ Copied" : "Copy Text"}
                </button>
              </div>
            )}
          </div>

          {/* Right: scores + match + benchmarks */}
          <div className="space-y-4">

            {/* Main Flesch + audience match */}
            {stats && fleschInfo ? (
              <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/30 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider mb-1">Flesch Reading Ease</div>
                    <div className="text-5xl font-black leading-none mb-1" style={{ color: fleschInfo.color }}>{stats.flesch}</div>
                    <div className="text-lg font-bold mb-3" style={{ color: fleschInfo.color }}>{fleschInfo.label}</div>
                    <div className="h-2.5 bg-[#0A0A14] rounded-full overflow-hidden w-48">
                      <div className="h-full rounded-full transition-all" style={{ width:`${stats.flesch}%`, backgroundColor: fleschInfo.color }} />
                    </div>
                  </div>
                  {/* Audience match */}
                  <div className="bg-[#0A0A14]/60 rounded-2xl p-3 text-center min-w-[120px]">
                    <div className="text-xs text-gray-500 mb-1">Audience Match</div>
                    <div className="text-2xl font-black" style={{ color: matchScore >= 80 ? "#22c55e" : matchScore >= 50 ? "#f59e0b" : "#ef4444" }}>{matchScore}%</div>
                    <div className="text-xs font-semibold mt-1" style={{ color: matchScore >= 80 ? "#22c55e" : matchScore >= 50 ? "#f59e0b" : "#ef4444" }}>{target.emoji} {target.label}</div>
                    <div className={`text-xs mt-0.5 ${matchColor}`}>{matchLabel}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 flex items-center justify-center text-gray-600 text-sm min-h-[130px]">
                Enter text to see readability scores
              </div>
            )}

            {/* 7 formula scores */}
            {stats && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">All 7 Formulas</h3>
                {formulas.map(f => {
                  const pct = (f.value / f.max) * 100;
                  const barPct = f.invert ? pct : pct;
                  return (
                    <div key={f.name}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-400">{f.name}</span>
                        <span className="font-bold text-white">{f.display ?? f.value}</span>
                      </div>
                      <div className="h-1.5 bg-[#0A0A14] rounded-full overflow-hidden mb-0.5">
                        <div className="h-full rounded-full transition-all" style={{ width:`${barPct}%`, backgroundColor: f.barColor }} />
                      </div>
                      <div className="text-xs text-gray-600">{f.desc}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Famous benchmarks scale */}
            {stats && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Where Your Text Sits</h3>
                <div className="relative">
                  {/* Scale bar */}
                  <div className="h-3 rounded-full overflow-hidden mb-2"
                    style={{ background:"linear-gradient(to right,#ef4444,#f97316,#f59e0b,#84cc16,#22c55e)" }} />
                  {/* Your score pointer */}
                  <div className="absolute top-0 w-0.5 h-3 bg-white" style={{ left:`${stats.flesch}%`, transform:"translateX(-50%)" }}>
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-xs text-white font-bold whitespace-nowrap">You</div>
                  </div>
                  {/* Benchmark labels */}
                  <div className="relative mt-1">
                    {BENCHMARKS.map(b => (
                      <div key={b.name} className="absolute text-center"
                        style={{ left:`${b.flesch}%`, transform:"translateX(-50%)" }}>
                        <div className="w-1 h-2 mx-auto mb-0.5 rounded-full" style={{ backgroundColor: b.color }} />
                        <div className="text-xs text-gray-600 whitespace-nowrap hidden sm:block" style={{ color: b.color }}>
                          {b.name.split(" ")[0]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between text-xs text-gray-700 mt-6">
                  <span>0 — Very Hard</span>
                  <span>100 — Very Easy</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Sentence difficulty map + vocab + complex words ──────────── */}
        {stats && (
          <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Sentence difficulty map */}
            <div className="md:col-span-2 bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <h3 className="text-sm font-bold text-white">Sentence Difficulty Map</h3>
                <div className="flex gap-3 text-xs">
                  {[["#22c55e","≤15w"],["#f59e0b","16-25w"],["#f97316","26-35w"],["#ef4444",">35w"]].map(([c,l]) => (
                    <span key={l} className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: c as string }} />
                      <span className="text-gray-500">{l}</span>
                    </span>
                  ))}
                </div>
              </div>
              <SentenceMap sentences={stats.sentenceData} />
              <div className="flex gap-4 mt-3 pt-3 border-t border-white/5 text-xs text-gray-500">
                <span>🟡 Sentences &gt;20w: <strong className="text-yellow-400">{stats.longSentCount20}</strong></span>
                <span>🔴 Sentences &gt;30w: <strong className="text-red-400">{stats.longSentCount30}</strong></span>
              </div>
            </div>

            {/* Vocab richness + complex words */}
            <div className="space-y-4">
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-3">Vocabulary Richness</h3>
                <div className="text-center mb-3">
                  <div className="text-4xl font-black" style={{ color: stats.vocabRichness > 65 ? "#22c55e" : stats.vocabRichness > 45 ? "#f59e0b" : "#ef4444" }}>
                    {stats.vocabRichness}%
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">Type-Token Ratio</div>
                </div>
                <div className="h-2 bg-[#0A0A14] rounded-full overflow-hidden mb-3">
                  <div className="h-full rounded-full transition-all"
                    style={{ width:`${stats.vocabRichness}%`, backgroundColor: stats.vocabRichness > 65 ? "#22c55e" : "#f59e0b" }} />
                </div>
                <div className="text-xs text-gray-500">{stats.uniqueWords} unique words out of {stats.words} total</div>
              </div>

              {/* Complex words */}
              {stats.complexWordList.length > 0 && (
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-bold text-white">Complex Words</h3>
                    <span className="text-xs text-gray-500">{stats.complexWords} (3+ syllables)</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                    {stats.complexWordList.map(w => (
                      <span key={w} className="px-2 py-0.5 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-300 text-xs font-mono">
                        {w} <span className="opacity-50">({syllables(w)})</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Improvement tips ─────────────────────────────────────────── */}
        {stats && (stats.fkGrade > 10 || stats.fog > 12 || stats.longSentCount20 > stats.sentences * 0.3) && (
          <div className="mt-5 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-white mb-3">💡 Personalised Improvement Tips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-400">
              {[
                stats.avgSentLen > 22  && `Avg sentence is ${stats.avgSentLen} words — target under 20. Split ${stats.longSentCount20} sentences over 20 words.`,
                stats.complexWords / stats.words > 0.15 && `${Math.round(stats.complexWords/stats.words*100)}% complex words (target <15%). Try replacing some from the list above.`,
                stats.avgSyllPerWord > 1.8 && `Avg word has ${stats.avgSyllPerWord} syllables. Favour shorter words — they improve every formula simultaneously.`,
                stats.vocabRichness < 40 && `Vocabulary richness is ${stats.vocabRichness}% — consider varying word choice to avoid repetition.`,
                stats.longSentCount30 > 0 && `You have ${stats.longSentCount30} sentence${stats.longSentCount30 > 1 ? "s" : ""} over 30 words — split these first for maximum score gain.`,
              ].filter(Boolean).map((tip, i) => (
                <div key={i} className="flex gap-2">
                  <span className="text-[#6C3AFF] flex-shrink-0">›</span>
                  <span>{String(tip)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SEO & Marketing Content (Moved Below Tool) ───────────────── */}
        <div className="mt-16 space-y-6">
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-[#13131F] border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-sm font-bold text-white">{f.title}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Use cases */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3">Who uses this tool?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {USE_CASES.map(u => (
                <div key={u.who} className="flex gap-3">
                  <span className="text-[#6C3AFF] font-extrabold text-sm flex-shrink-0 mt-0.5">→</span>
                  <div>
                    <span className="text-sm font-semibold text-white">{u.who}: </span>
                    <span className="text-sm text-gray-400">{u.why}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor table */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-x-auto">
            <div className="px-5 pt-4 pb-2">
              <h2 className="text-sm font-bold text-white">PursTech vs Hemingway vs WebFX vs Readable.io</h2>
              <p className="text-xs text-gray-500 mt-0.5">Readability tool feature comparison</p>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left px-5 py-2 text-gray-500 font-semibold">Feature</th>
                  <th className="px-4 py-2 text-[#6C3AFF] font-bold">PursTech</th>
                  <th className="px-4 py-2 text-gray-500">Hemingway</th>
                  <th className="px-4 py-2 text-gray-500">WebFX</th>
                  <th className="px-4 py-2 text-gray-500">Readable</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITOR_TABLE.map((row, i) => (
                  <tr key={i} className="border-b border-white/5 last:border-0">
                    <td className="px-5 py-2.5 text-gray-400">{row.feature}</td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.purstech} /></td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.hemingway} /></td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.webfx} /></td>
                    <td className="px-4 py-2.5 text-center"><CellIcon v={row.readable} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── How to Use ───────────────────────────────────────────────── */}
        <div className="mt-6 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Readability Checker</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Set your target audience",   desc:"Choose who you're writing for — 5th grade, high school, general adult, college or academic. The tool shows your audience match percentage." },
              { step:"2", title:"Paste your text",            desc:"All 7 readability formulas update live as you type. The sample text is pre-loaded so you can see the tool working immediately." },
              { step:"3", title:"Review scores and sentence map", desc:"Check all 7 formula scores, find your position on the famous text benchmark scale, and read the sentence difficulty map to spot dense paragraphs." },
              { step:"4", title:"Annotate and improve",       desc:"Switch to Annotate view to highlight long sentences and complex words directly in your text. Use the improvement tips to raise your score." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#6C3AFF] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div><div className="font-semibold text-white text-sm mb-1">{s.title}</div><div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        <div className="mt-10">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed whitespace-pre-line">{f.a}</div>
              </details>
            ))}
          </div>
        </div>

        {/* ── Educational content ─────────────────────────────────────── */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-white">Why Readability Matters — for SEO, Education and Communication</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Readability is one of the most consistently underestimated factors in effective
            communication. Studies from the Nielsen Norman Group repeatedly find that web users
            read at most 20-28% of words on a page in detail — they scan. Complex sentences
            and unfamiliar vocabulary break that scanning pattern, causing users to give up and
            leave. For commercial content, this means higher bounce rates, lower time-on-page,
            and fewer conversions — all compounding negative signals to search engines.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            In education, reading level accuracy is critical. Assigning materials significantly
            above a student's level produces frustration and disengagement. Below their level
            and they aren't challenged to grow. The seven formulas this tool provides were
            each developed for specific domains: Flesch for general use, SMOG for health and
            safety communications (where plain language compliance is often legally mandated),
            and Dale-Chall for children's educational materials. Using the right formula for
            your domain gives more meaningful results than any single metric.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Plain language advocates in government and healthcare have demonstrated measurable
            outcomes from improving readability. The US Center for Plain Language found that
            rewriting a Medicare form from grade 14 to grade 8 increased correct completion
            from 37% to 92%. The NHS's Plain English Campaign has shown similar results with
            patient information leaflets. These real-world outcomes are why organisations from
            the FDA to the UK Government Digital Service have adopted readability standards —
            and why measuring your content's grade level is genuinely important, not just
            an academic exercise.
          </p>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/about"   className="hover:text-gray-400">About</Link>
          <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
          <Link href="/contact" className="hover:text-gray-400">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
