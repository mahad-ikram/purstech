"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

// ✅ SCHEMA removed — now server-rendered as WebApplication in page.tsx

/* ── Module-scope arrays — Rule 10: .map() calls below match ─────────────── */
const FEATURES = [
  { icon:"📐", title:"7 Readability Formulas",      desc:"Flesch, Flesch-Kincaid, Gunning Fog, SMOG, Coleman-Liau, ARI and Dale-Chall — all calculated simultaneously with progress bars." },
  { icon:"🎯", title:"Target Audience Mode",         desc:"Set your target reader (5th grade → academic) and see a match score showing exactly how close your text is to that level." },
  { icon:"📚", title:"Famous Text Benchmarks",       desc:"See where your text sits relative to Harry Potter, NYT articles, Harvard Law Review and insurance policies on a single visual scale." },
  { icon:"📊", title:"Sentence Difficulty Map",      desc:"A colour-coded bar chart with one bar per sentence — instantly reveals where in your text the density is highest." },
  { icon:"🔍", title:"Annotated Text View",          desc:"Toggleable highlights: long sentences in yellow/red, complex words underlined. Shows the problem areas directly in your text." },
  { icon:"📈", title:"Vocabulary Richness (TTR)",    desc:"Type-Token Ratio measures how varied your vocabulary is — a key indicator of writing quality that no other free tool shows." },
];

const USE_CASES = [
  { who:"Content Writers & SEOs",       why:"Verify blog posts and landing pages target the right reading level for your audience before publishing." },
  { who:"Educators & Academics",        why:"Check whether reading materials are appropriate for student grade levels, and measure academic paper complexity." },
  { who:"UX & Product Writers",         why:"Ensure product copy, onboarding text and help articles are simple enough for all users — including non-native speakers." },
  { who:"Health & Legal Communicators", why:"SMOG formula is the standard for health literacy. Ensure patient-facing documents meet plain-language requirements." },
];

const COMPETITOR_TABLE = [
  { feature:"Number of formulas",             purstech:"7",   hemingway:"1",   webfx:"7",    readable:"6"   },
  { feature:"Target audience mode",           purstech:true,  hemingway:false, webfx:false,  readable:true  },
  { feature:"Famous text benchmarks",         purstech:true,  hemingway:false, webfx:false,  readable:false },
  { feature:"Sentence difficulty map",        purstech:true,  hemingway:false, webfx:false,  readable:false },
  { feature:"Annotated text highlights",      purstech:true,  hemingway:true,  webfx:false,  readable:false },
  { feature:"Complex word list",              purstech:true,  hemingway:false, webfx:false,  readable:true  },
  { feature:"Vocabulary richness (TTR)",      purstech:true,  hemingway:false, webfx:false,  readable:false },
  { feature:"Sentence length distribution",   purstech:true,  hemingway:false, webfx:false,  readable:false },
  { feature:"Download analysis report",       purstech:true,  hemingway:false, webfx:false,  readable:"paid"},
  { feature:"Live update as you type",        purstech:true,  hemingway:true,  webfx:false,  readable:false },
  { feature:"100% free, no account",          purstech:true,  hemingway:false, webfx:true,   readable:false },
];

type CellVal = boolean | string;
const CellIcon = ({ v }: { v: CellVal }) =>
  v === true    ? <span className="text-green-400 font-bold">✓</span> :
  v === false   ? <span className="text-gray-700">—</span> :
  typeof v === "string" && v !== "purstech"
    ? <span className={`font-semibold text-xs ${v === "paid" ? "text-yellow-400" : "text-gray-300"}`}>{v}</span>
    : <span className="text-green-400 font-bold text-xs">{v}</span>;

// ✅ Rule 8: FAQ uses <details>/<summary> — no useState toggle
const FAQ = [
  { q: "How do I improve my readability score quickly?",
    a: "The two most impactful changes are: 1) Shorten your sentences — split any sentence over 25 words into two. This alone can move a score by 5-15 points. 2) Replace complex words with simpler alternatives — 'use' instead of 'utilise', 'show' instead of 'demonstrate'. Use the complex words list to find specific candidates." },
  { q: "What is a good readability score for a website?",
    a: "For most websites, a Flesch Reading Ease score of 60-70 is ideal — roughly equivalent to a US 8th-9th grade reading level, readable by the majority of adult internet users. Marketing and e-commerce content should target 65-75. News articles typically score 60-65. Technical documentation can be lower (40-55) if the audience is specialists." },
  { q: "What is the Flesch Reading Ease score?",
    a: "A 0–100 scale where higher means easier reading: 60–70 is plain English (roughly 8th–9th grade) and 30–50 is college level. It is one of the 7 formulas this checker computes, alongside Flesch-Kincaid Grade, Gunning Fog and SMOG." },
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

How to use it: Look for clusters of orange and red bars — those are the sections of your text with the highest cognitive load. Click the Annotate tab to see those sentences highlighted directly in the text, then split the longest ones first. Splitting one 40-word sentence into two 20-word sentences can meaningfully improve your Flesch score.

Best practice: no more than 15-20% of your sentences should be over 25 words for general-audience writing.`,
  },
];

/* ── Syllable counter ────────────────────────────────────────────────────── */
function syllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const stripped = w.replace(/(?:[^laeiouy]|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  return Math.max(1, (stripped.match(/[aeiouy]{1,2}/g) ?? []).length);
}

/* ── Sentence splitter ───────────────────────────────────────────────────── */
function parseSentences(text: string): { text:string; wordCount:number }[] {
  return text.split(/(?<=[.!?])\s+/)
    .map(s => s.trim()).filter(s => s.length > 2)
    .map(s => ({ text:s, wordCount:s.split(/\s+/).filter(Boolean).length }));
}

/* ── Analysis interface ──────────────────────────────────────────────────── */
interface Analysis {
  words:number; sentences:number; chars:number; syllables:number;
  complexWords:number; complexWordList:string[];
  avgSentLen:number; avgSyllPerWord:number;
  flesch:number; fkGrade:number; fog:number; smog:number;
  colemanLiau:number; ari:number; daleChall:number;
  readLabel:string; vocabRichness:number;
  uniqueWords:number; longSentCount20:number; longSentCount30:number;
  readingMins:number;
  sentenceData:{ text:string; wordCount:number }[];
}

const DALE_CHALL_FAMILIAR = new Set([
  "a","about","above","across","after","again","against","air","all","almost","also","always","an","and","animal","another","answer","any","are","around","as","ask","at","away","back","be","because","been","before","behind","believe","best","better","between","big","black","body","book","both","bring","brother","but","by","call","came","can","carry","change","children","city","come","could","country","cut","day","did","different","do","does","done","door","down","during","each","early","earth","eat","end","enough","even","ever","every","example","eye","face","fact","family","far","feet","few","find","first","follow","food","for","form","found","four","from","front","full","get","give","go","going","good","great","grow","had","hand","happen","has","have","he","head","hear","help","her","here","high","him","his","home","how","idea","if","important","in","is","it","its","just","keep","kind","know","land","large","last","later","learn","leave","left","let","life","light","like","line","list","little","live","long","look","made","make","man","many","may","me","mean","men","mile","miss","more","most","mother","move","much","must","my","name","need","never","new","next","night","no","not","now","number","of","off","often","old","on","once","one","only","open","or","other","our","out","over","own","page","people","picture","place","play","point","put","question","right","river","road","run","said","same","saw","say","school","sea","second","see","seem","sentence","set","she","should","show","side","since","small","so","some","something","sometimes","song","soon","sound","spell","start","state","still","stop","story","study","such","take","tell","than","that","the","their","them","then","there","these","they","thing","think","this","those","three","through","time","to","together","too","top","turn","two","under","until","up","us","use","very","walk","want","was","watch","water","way","we","well","went","were","what","when","where","which","while","who","why","will","with","word","work","world","would","write","year","you","young","your",
]);

function runAnalysis(text: string): Analysis | null {
  const wordsArr = text.trim().split(/\s+/).filter(w => /\w/.test(w));
  const sentsArr = parseSentences(text);
  const W = wordsArr.length, S = Math.max(sentsArr.length, 1);
  if (W < 5) return null;

  const syllCounts = wordsArr.map(w => syllables(w));
  const totalSylls = syllCounts.reduce((a,b) => a+b, 0);
  const letters    = text.replace(/[^a-zA-Z]/g,"").length;
  const complexW   = wordsArr.filter((_,i) => syllCounts[i] >= 3);
  const complexSet = [...new Set(complexW.map(w => w.toLowerCase().replace(/[^a-z]/g,"")))].sort((a,b) => syllables(b)-syllables(a)).slice(0,20);
  const uniqueArr  = [...new Set(wordsArr.map(w => w.toLowerCase().replace(/[^a-z]/g,"")))];

  const flesch      = Math.min(100, Math.max(0, Math.round((206.835 - 1.015*(W/S) - 84.6*(totalSylls/W))*10)/10));
  const fkGrade     = Math.max(0, Math.round((0.39*(W/S) + 11.8*(totalSylls/W) - 15.59)*10)/10);
  const fog         = Math.max(0, Math.round((0.4*((W/S) + 100*(complexW.length/W)))*10)/10);
  const smog        = Math.max(0, Math.round((1.0430*Math.sqrt(complexW.length*(30/S)) + 3.1291)*10)/10);
  const colemanLiau = Math.max(0, Math.round((0.0588*((letters/W)*100) - 0.296*((S/W)*100) - 15.8)*10)/10);
  const ari         = Math.max(0, Math.round((4.71*(letters/W) + 0.5*(W/S) - 21.43)*10)/10);
  const unfamiliar  = wordsArr.filter(w => !DALE_CHALL_FAMILIAR.has(w.toLowerCase().replace(/[^a-z]/g,""))).length;
  const dcRaw       = 0.1579*((unfamiliar/W)*100) + 0.0496*(W/S);
  const daleChall   = Math.round((unfamiliar/W > 0.05 ? dcRaw + 3.6365 : dcRaw)*10)/10;
  const readLabel   = flesch >= 80 ? "Easy" : flesch >= 60 ? "Standard" : flesch >= 40 ? "Fairly Difficult" : "Difficult";

  return {
    words:W, sentences:S, chars:letters, syllables:totalSylls,
    complexWords:complexW.length, complexWordList:complexSet,
    avgSentLen:Math.round((W/S)*10)/10, avgSyllPerWord:Math.round((totalSylls/W)*100)/100,
    flesch, fkGrade, fog, smog, colemanLiau, ari, daleChall, readLabel,
    vocabRichness:Math.round((uniqueArr.length/W)*100), uniqueWords:uniqueArr.length,
    longSentCount20:sentsArr.filter(s=>s.wordCount>20).length,
    longSentCount30:sentsArr.filter(s=>s.wordCount>30).length,
    readingMins:Math.max(1, Math.ceil(W/200)),
    sentenceData:sentsArr,
  };
}

/* ── Target audience config ─────────────────────────────────────────────── */
const AUDIENCES = [
  { id:"child",    label:"5th Grade",     emoji:"🧒", targetFlesch:90, grade:"5"      },
  { id:"middle",   label:"Middle School", emoji:"📚", targetFlesch:80, grade:"6-8"    },
  { id:"high",     label:"High School",   emoji:"🎒", targetFlesch:70, grade:"9-12"   },
  { id:"general",  label:"General Adult", emoji:"👤", targetFlesch:60, grade:"13+"    },
  { id:"college",  label:"College",       emoji:"🎓", targetFlesch:45, grade:"College"},
  { id:"academic", label:"Academic/Pro",  emoji:"🔬", targetFlesch:25, grade:"PhD"    },
];

/* ── Famous benchmarks ───────────────────────────────────────────────────── */
const BENCHMARKS = [
  { name:"Insurance Policy",        flesch:14, color:"#ef4444" },
  { name:"Academic Paper",          flesch:30, color:"#f97316" },
  { name:"Harvard Business Review", flesch:43, color:"#f59e0b" },
  { name:"New York Times",          flesch:65, color:"#84cc16" },
  { name:"Harry Potter",            flesch:72, color:"#22c55e" },
  { name:"Twitter Help",            flesch:84, color:"#10b981" },
];

/* ── Sentence difficulty map ─────────────────────────────────────────────── */
function SentenceMap({ sentences }: { sentences:{ text:string; wordCount:number }[] }) {
  const maxW = Math.max(...sentences.map(s => s.wordCount), 1);
  return (
    <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
      {sentences.slice(0,40).map((s,i) => {
        const color = s.wordCount<=15 ? "#22c55e" : s.wordCount<=25 ? "#f59e0b" : s.wordCount<=35 ? "#f97316" : "#ef4444";
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="w-5 text-xs text-gray-700 text-right flex-shrink-0">{i+1}</span>
            <div className="relative flex-1 h-4 bg-[#0A0A14] rounded overflow-hidden"
              title={s.text.slice(0,100)+(s.text.length>100?"…":"")}>
              <div style={{width:`${(s.wordCount/maxW)*100}%`, backgroundColor:color}} className="h-full rounded transition-all" />
            </div>
            <span className="w-9 text-xs flex-shrink-0" style={{color}}>{s.wordCount}w</span>
          </div>
        );
      })}
      {sentences.length > 40 && (
        <div className="text-xs text-gray-600 text-center pt-1">+{sentences.length-40} more sentences</div>
      )}
    </div>
  );
}

/* ── Annotated text view ─────────────────────────────────────────────────── */
function AnnotatedText({ text, sentenceData, showSents, showComplex }: {
  text:string; sentenceData:{text:string; wordCount:number}[];
  showSents:boolean; showComplex:boolean;
}) {
  if (!showSents && !showComplex) {
    // ✅ QA FIX: Added break-words min-w-0 w-full to prevent layout blowout from massive strings
    return <div className="text-sm text-gray-200 leading-relaxed whitespace-pre-wrap break-words min-w-0 w-full">{text}</div>;
  }
  const complexWords = new Set(
    text.split(/\s+/).map(w => w.toLowerCase().replace(/[^a-z]/g,"")).filter(w => syllables(w) >= 3)
  );
  return (
    // ✅ QA FIX: Added break-words min-w-0 w-full
    <div className="text-sm leading-loose whitespace-pre-wrap break-words min-w-0 w-full">
      {sentenceData.map((sent,si) => {
        const sentBg = showSents
          ? sent.wordCount > 30 ? "bg-red-400/20 rounded"
          : sent.wordCount > 20 ? "bg-yellow-400/20 rounded"
          : "" : "";
        const words = sent.text.split(/(\s+)/);
        return (
          <span key={si} className={sentBg}>
            {words.map((token,wi) => {
              const clean = token.toLowerCase().replace(/[^a-z]/g,"");
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
const SAMPLE_TEXT = `Readability affects how quickly readers understand your message. Research shows that content written at the appropriate level for your audience consistently outperforms text that is too complex or too simple.

The most impactful factors are sentence length and word choice. Sentences under 20 words are easiest to process. Words with fewer syllables move faster in the reader's mind. When writing for a general audience, aim for a Flesch Reading Ease score between 60 and 70.

Some industries require technical language that naturally increases complexity. Medical, legal and scientific writing often scores below 40 on the Flesch scale. This is acceptable when the audience expects and understands that vocabulary.

Replace this sample with your own text to analyse its readability. The tool will calculate seven industry-standard formulas simultaneously and show you exactly which sentences and words are driving your complexity scores.`;

/* ── Helper: formula color ───────────────────────────────────────────────── */
function fColor(value:number, max:number, invert:boolean): string {
  const pct = Math.min(value/max, 1);
  if (!invert) return pct > 0.6 ? "bg-green-500" : pct > 0.4 ? "bg-yellow-500" : "bg-red-500";
  return pct < 0.45 ? "bg-green-500" : pct < 0.7 ? "bg-yellow-500" : "bg-red-500";
}

/* ── Main component ──────────────────────────────────────────────────────── */
export default function ReadabilityCheckerClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("readability-checker", "ai"); // ✅ Rule 3

  const [text,        setText]        = useState(SAMPLE_TEXT);
  const [targetId,    setTargetId]    = useState("general");
  const [tab,         setTab]         = useState<"scores"|"map"|"annotate">("scores");
  const [showSents,   setShowSents]   = useState(true);
  const [showComplex, setShowComplex] = useState(true);

  const analysis = useMemo(() => runAnalysis(text), [text]);
  const audience = AUDIENCES.find(a => a.id === targetId) ?? AUDIENCES[3];
  const matchScore = analysis
    ? Math.max(0, Math.min(100, Math.round(100 - Math.abs(analysis.flesch - audience.targetFlesch) * 2)))
    : 0;
  const matchColor = matchScore >= 75 ? "text-green-400" : matchScore >= 45 ? "text-yellow-400" : "text-red-400";

  const formulas = analysis ? [
    { name:"Flesch Reading Ease", value:analysis.flesch,      max:100, invert:false, suffix:"",  note:`${analysis.readLabel}` },
    { name:"Flesch-Kincaid Grade",value:analysis.fkGrade,     max:18,  invert:true,  suffix:"",  note:"Grade level" },
    { name:"Gunning Fog",         value:analysis.fog,         max:20,  invert:true,  suffix:"",  note:"Grade level" },
    { name:"SMOG Index",          value:analysis.smog,        max:18,  invert:true,  suffix:"",  note:"Grade level" },
    { name:"Coleman-Liau",        value:analysis.colemanLiau, max:18,  invert:true,  suffix:"",  note:"Grade level" },
    { name:"ARI",                 value:analysis.ari,         max:18,  invert:true,  suffix:"",  note:"Grade level" },
    { name:"Dale-Chall",          value:analysis.daleChall,   max:10,  invert:true,  suffix:"",  note:"Familiar words" },
  ] : [];

  // ✅ Download report
  const downloadReport = () => {
    if (!analysis) return;
    const lines = [
      "READABILITY ANALYSIS REPORT",
      "Generated by PursTech — https://www.purstech.com/tools/readability-checker",
      "",
      "=== SCORES ===",
      `Flesch Reading Ease:  ${analysis.flesch} (${analysis.readLabel})`,
      `Flesch-Kincaid Grade: ${analysis.fkGrade}`,
      `Gunning Fog Index:    ${analysis.fog}`,
      `SMOG Index:           ${analysis.smog}`,
      `Coleman-Liau Index:   ${analysis.colemanLiau}`,
      `ARI:                  ${analysis.ari}`,
      `Dale-Chall:           ${analysis.daleChall}`,
      "",
      "=== TEXT STATISTICS ===",
      `Words:                ${analysis.words}`,
      `Sentences:            ${analysis.sentences}`,
      `Characters:           ${analysis.chars}`,
      `Syllables:            ${analysis.syllables}`,
      `Complex words (3+ syllables): ${analysis.complexWords}`,
      `Average sentence length:      ${analysis.avgSentLen} words`,
      `Average syllables per word:   ${analysis.avgSyllPerWord}`,
      `Vocabulary richness (TTR):    ${analysis.vocabRichness}%`,
      `Unique words:         ${analysis.uniqueWords}`,
      `Sentences > 20 words: ${analysis.longSentCount20}`,
      `Sentences > 30 words: ${analysis.longSentCount30}`,
      `Reading time:         ~${analysis.readingMins} min`,
      "",
      `=== TOP COMPLEX WORDS ===`,
      analysis.complexWordList.join(", "),
    ];
    // Notice: array of strings used in Blob, so `as any` is indeed NOT required here.
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob), download: "readability-report.txt",
    }).click();
  };

  return (
    // ✅ Rule 6: flex flex-col overflow-x-hidden
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      {/* ── Navbar — Rule 4: sticky + backdrop-blur + Go Pro ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      {/* ✅ Rule 7: flex-grow w-full on main */}
      <main className="max-w-7xl mx-auto px-4 py-10 flex-grow w-full">

        {/* ✅ Rule 11: aria-label + /categories/ai + aria-hidden on › */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/ai" className="hover:text-gray-400">AI Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Readability Checker</span>
        </nav>

        {/* Server-rendered hero */}
        {children}

        {/* ✅ Rule 9: min-w-0 on both grid children */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">

          {/* Left: Input */}
          <div className="min-w-0 flex flex-col gap-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 min-w-0 w-full">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Your Text</span>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  {analysis && <>
                    <span>{analysis.words} words</span>
                    <span>{analysis.sentences} sentences</span>
                    <span>~{analysis.readingMins} min read</span>
                  </>}
                </div>
              </div>
              {/* ✅ QA FIX: Added w-full min-w-0 break-words to text area */}
              <textarea value={text} onChange={e => setText(e.target.value)} rows={14}
                placeholder="Paste your text here — scores update as you type..."
                className="w-full min-w-0 break-words px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-gray-200 text-sm leading-relaxed focus:outline-none focus:border-[#6C3AFF]/40 resize-none transition-all" />
              <button onClick={() => setText("")}
                className="mt-1 text-xs text-gray-700 hover:text-[#FF3A6C] transition-colors">× Clear</button>
            </div>

            {/* Target audience */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">🎯 Target Audience</h3>
              <div className="grid grid-cols-3 gap-2">
                {AUDIENCES.map(a => (
                  <button key={a.id} onClick={() => setTargetId(a.id)}
                    className={`p-2 rounded-xl text-xs font-bold transition-all text-center border ${
                      targetId===a.id ? "bg-[#6C3AFF] border-[#6C3AFF] text-white" : "bg-[#0A0A14] border-white/5 text-gray-400 hover:text-white"
                    }`}>
                    <div className="text-base">{a.emoji}</div>
                    <div className="mt-0.5">{a.label}</div>
                  </button>
                ))}
              </div>
              {analysis && (
                <div className="mt-3 flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[#0A0A14] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${matchScore>=75?"bg-green-500":matchScore>=45?"bg-yellow-500":"bg-red-500"}`}
                      style={{width:`${matchScore}%`}} />
                  </div>
                  <span className={`text-sm font-extrabold flex-shrink-0 ${matchColor}`}>{matchScore}% match</span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Analysis */}
          <div className="min-w-0 flex flex-col gap-4">

            {/* Tab bar */}
            <div className="flex gap-1 bg-[#13131F] border border-white/5 p-1 rounded-xl">
              {(["scores","map","annotate"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold capitalize transition-all ${tab===t ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"}`}>
                  {t === "scores" ? "📊 Scores" : t === "map" ? "📈 Map" : "🔍 Annotate"}
                </button>
              ))}
            </div>

            {/* Scores tab */}
            {tab === "scores" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-3">
                {!analysis && (
                  <p className="text-gray-500 text-sm text-center py-6">Enter at least 5 words to see scores</p>
                )}
                {analysis && formulas.map(f => (
                  <div key={f.name}>
                    <div className="flex justify-between items-baseline mb-1">
                      <span className="text-xs font-semibold text-gray-400">{f.name}</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-extrabold text-white">{f.value}</span>
                        <span className="text-[10px] text-gray-600">{f.note}</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-[#0A0A14] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${fColor(f.value, f.max, f.invert)}`}
                        style={{width:`${Math.min((f.value/f.max)*100,100)}%`}} />
                    </div>
                  </div>
                ))}
                {analysis && (
                  <div className="pt-3 border-t border-white/5 grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-[#0A0A14] rounded-xl p-2 text-center">
                      <div className="text-lg font-extrabold text-[#6C3AFF]">{analysis.vocabRichness}%</div>
                      <div className="text-gray-600">Vocab Richness</div>
                    </div>
                    <div className="bg-[#0A0A14] rounded-xl p-2 text-center">
                      <div className="text-lg font-extrabold text-[#6C3AFF]">{analysis.complexWords}</div>
                      <div className="text-gray-600">Complex Words</div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Map tab */}
            {tab === "map" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <div className="flex gap-4 text-xs mb-3">
                  {[{color:"#22c55e",label:"≤15w"},{color:"#f59e0b",label:"16-25w"},{color:"#f97316",label:"26-35w"},{color:"#ef4444",label:">35w"}].map(l => (
                    <span key={l.label} className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{background:l.color}} />{l.label}
                    </span>
                  ))}
                </div>
                {analysis ? <SentenceMap sentences={analysis.sentenceData} />
                  : <p className="text-gray-500 text-sm text-center py-6">Enter text to see sentence map</p>}
              </div>
            )}

            {/* Annotate tab */}
            {tab === "annotate" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0 w-full">
                <div className="flex gap-4 mb-3 text-xs">
                  <button onClick={() => setShowSents(p=>!p)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all border ${showSents?"bg-yellow-500/20 border-yellow-500/30 text-yellow-400":"bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"}`}>
                    Long sentences
                  </button>
                  <button onClick={() => setShowComplex(p=>!p)}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all border ${showComplex?"bg-yellow-500/20 border-yellow-500/30 text-yellow-400":"bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"}`}>
                    Complex words
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto min-w-0 w-full">
                  {analysis
                    ? <AnnotatedText text={text} sentenceData={analysis.sentenceData} showSents={showSents} showComplex={showComplex} />
                    : <p className="text-gray-500 text-sm text-center py-6">Enter text to see annotated view</p>}
                </div>
              </div>
            )}

            {/* Download + benchmarks */}
            {analysis && (
              <>
                <button onClick={downloadReport}
                  className="w-full py-3 rounded-xl bg-[#13131F] border border-white/10 hover:border-[#6C3AFF]/40 text-gray-300 hover:text-white text-sm font-bold transition-all">
                  ⬇ Download Full Report (.txt)
                </button>

                {/* Benchmark scale */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Famous Text Benchmarks</h3>
                  <div className="relative h-5 bg-[#0A0A14] rounded-full overflow-visible mb-3">
                    {BENCHMARKS.map(b => (
                      <div key={b.name} title={`${b.name} (${b.flesch})`}
                        className="absolute top-0 bottom-0 w-0.5 cursor-help"
                        style={{left:`${b.flesch}%`, background:b.color}} />
                    ))}
                    <div className="absolute top-0 bottom-0 w-2.5 h-5 rounded-full border-2 border-white bg-white/20 -translate-x-1/2 transition-all"
                      style={{left:`${Math.min(100,Math.max(0,analysis.flesch))}%`}}
                      title={`Your text: ${analysis.flesch}`} />
                  </div>
                  <div className="flex justify-between text-[10px] text-gray-600">
                    <span>0 — Hardest</span>
                    <span>100 — Easiest</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1 mt-2">
                    {BENCHMARKS.map(b => (
                      <div key={b.name} className="flex items-center gap-1.5 text-[10px]">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{background:b.color}} />
                        <span className="text-gray-600 truncate">{b.name}: {b.flesch}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Complex word list */}
                {analysis.complexWordList.length > 0 && (
                  <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 min-w-0 w-full">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Top Complex Words</h3>
                    <div className="flex flex-wrap gap-1.5 min-w-0">
                      {analysis.complexWordList.map(w => (
                        // ✅ QA FIX: Added break-all to prevent insanely long garbage words from blowing out the bounds
                        <span key={w} className="text-xs bg-[#0A0A14] border border-white/10 px-2 py-0.5 rounded-lg text-gray-400 font-mono break-all">
                          {w}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Features grid ── */}
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-extrabold text-white mb-5">Why PursTech is the Most Complete Free Readability Tool</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map(f => (
              <div key={f.title} className="flex gap-3">
                <span className="text-2xl flex-shrink-0">{f.icon}</span>
                <div>
                  <div className="font-semibold text-white text-sm mb-1">{f.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Use Cases ── */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-extrabold text-white mb-5">Who Uses the Readability Checker</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {USE_CASES.map(u => (
              <div key={u.who} className="flex gap-3 bg-[#0A0A14] rounded-xl p-4">
                <div>
                  <div className="font-semibold text-white text-sm mb-1">{u.who}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{u.why}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Competitor table ── */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 mb-12 overflow-x-auto">
          <h2 className="text-xl font-extrabold text-white mb-5">Feature Comparison</h2>
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-white/5">
                <th className="text-left py-2 font-semibold">Feature</th>
                <th className="text-center py-2 text-[#6C3AFF] font-bold">PursTech</th>
                <th className="text-center py-2">Hemingway</th>
                <th className="text-center py-2">WebFX</th>
                <th className="text-center py-2">Readable</th>
              </tr>
            </thead>
            <tbody>
              {COMPETITOR_TABLE.map(row => (
                <tr key={row.feature} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="py-2.5 text-gray-400 text-xs">{row.feature}</td>
                  <td className="py-2.5 text-center"><CellIcon v={row.purstech} /></td>
                  <td className="py-2.5 text-center"><CellIcon v={row.hemingway} /></td>
                  <td className="py-2.5 text-center"><CellIcon v={row.webfx} /></td>
                  <td className="py-2.5 text-center"><CellIcon v={row.readable} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── FAQ — Rule 8: <details>/<summary>, Rule 10: FAQ.map() matches const FAQ ── */}
        <div className="max-w-3xl mb-12">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{item.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </main>

      {/* ✅ Rule 5: Privacy/Terms/Contact + © 2026 */}
      <footer className="border-t border-white/5 mt-4 py-8 text-center">
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
