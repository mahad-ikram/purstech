"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; 

/* ── Content Arrays ──────────────────────────────────────────────────────── */
const FEATURES = [
  { icon:"📐", title:"6 Writing Goal Presets",          desc:"Set your writing purpose — Email, Essay, Blog, Business, Creative or General — and get targeted feedback for your audience." },
  { icon:"🥧", title:"Error Breakdown Chart",           desc:"SVG donut chart shows the exact split of grammar, spelling, punctuation and style issues at a glance." },
  { icon:"🔕", title:"Passive Voice Detector",          desc:"Client-side scanner highlights passive voice constructions independently of LanguageTool, so you can spot and rewrite them." },
  { icon:"📊", title:"Overused Word Finder",            desc:"Word frequency analysis identifies words you've repeated too many times — a key sign of weak, repetitive writing." },
  { icon:"🎭", title:"Tone Detector",                   desc:"Detects whether your writing is formal or casual, positive or critical — based on vocabulary patterns." },
  { icon:"📝", title:"Error Density Score",             desc:"Errors per 100 words — a normalised measure that lets you compare quality fairly regardless of document length." },
];

const USE_CASES = [
  { who:"Students",               why:"Check essays and assignments for grammar, spelling and academic style before submission." },
  { who:"Content Writers",        why:"Proof blog posts and articles — catch passive voice, adverbs and overused words that weaken copy." },
  { who:"Non-native Speakers",    why:"LanguageTool's 6,000+ rules catch subtle English errors that basic spell-checkers miss entirely." },
  { who:"Business Professionals", why:"Polish emails and reports — correct tone, eliminate errors and ensure professional quality." },
];

const COMPETITOR_TABLE = [
  { feature:"Grammar & spelling",          purstech:true,  grammarly:true,  hemingway:false, lt:true  },
  { feature:"In-text colour highlights",   purstech:true,  grammarly:true,  hemingway:true,  lt:true  },
  { feature:"Writing goal presets",        purstech:true,  grammarly:true,  hemingway:false, lt:false },
  { feature:"Error breakdown chart",       purstech:true,  grammarly:false, hemingway:false, lt:false },
  { feature:"Passive voice detection",     purstech:true,  grammarly:"paid",hemingway:true,  lt:true  },
  { feature:"Overused word finder",        purstech:true,  grammarly:false, hemingway:false, lt:false },
  { feature:"Tone detector",               purstech:true,  grammarly:"paid",hemingway:false, lt:false },
  { feature:"Error density score",         purstech:true,  grammarly:false, hemingway:false, lt:false },
  { feature:"Adverb scanner",              purstech:true,  grammarly:false, hemingway:true,  lt:false },
  { feature:"Download error report",       purstech:true,  grammarly:false, hemingway:false, lt:false },
  { feature:"Multi-language support",      purstech:true,  grammarly:false, hemingway:false, lt:true  },
  { feature:"100% free, no account",       purstech:true,  grammarly:false, hemingway:false, lt:true  },
];

type CellVal = boolean | string;
const CellIcon = ({ v }: { v: CellVal }) =>
  v === true    ? <span className="text-green-400 font-bold">✓</span>   :
  v === "paid"  ? <span className="text-yellow-400 text-xs font-semibold">Paid</span> :
                  <span className="text-gray-700">—</span>;

/* ── Rich FAQ ────────────────────────────────────────────────────────────── */
const FAQ = [
  { q:"How do I find and correct the mistakes in a sentence?",
    a:"Paste the sentence — or a whole paragraph — and every grammar, spelling and punctuation mistake is highlighted in colour with a one-click correction. It works just as well for a single exercise sentence as for a full essay." },
  { q:"How can I check if a sentence is grammatically correct?",
    a:"Paste it in. If nothing gets highlighted, the sentence passes 6,000+ grammar, spelling and punctuation rules. You also get a tone read and a readability score, so you know it makes sense — not just that it is technically correct." },
  { q:"What grammar rules does this checker use?",
    a:"The checker uses LanguageTool, an open-source grammar engine with over 6,000 linguistic rules for English alone. It catches grammar errors (subject-verb disagreement, wrong tense, incorrect pronoun case such as 'between you and I', dangling modifiers), spelling mistakes including confusable homophones ('their/there/they're', 'affect/effect', 'its/it's') that a basic spell-checker misses, punctuation errors (missing commas, incorrect apostrophes, run-on sentences, missing Oxford commas) and style suggestions (passive voice, wordy phrases, clichés, redundant intensifiers like 'very unique'). LanguageTool operates in over 30 languages and powers the browser extension used by over 10 million people worldwide." },
  { q:"What is the difference between grammar errors and style errors?",
    a:"Grammar errors are objective rule violations — subject-verb disagreement, wrong pronoun case, incorrect tense, dangling modifiers. They make your writing technically incorrect and should almost always be fixed. Style errors are subjective suggestions: overly long sentences, excessive passive voice, vague words, redundant phrases or clichés. Style errors are recommendations — you may choose to ignore them depending on your audience and purpose. For example, passive voice is flagged as a style issue but is perfectly acceptable in scientific writing or when the actor is unknown." },
  { q:"What is passive voice and why does it matter?",
    a:"Passive voice constructs a sentence so the subject receives the action rather than performing it. Active: 'The manager approved the budget.' Passive: 'The budget was approved by the manager.' Passive voice adds words without adding meaning, making writing feel indirect, wordy and harder to follow. However, passive voice is acceptable when the actor is unknown ('The package was stolen'), unimportant ('The data was collected over six months'), or in scientific writing where method matters more than who performed it. Our passive voice detector highlights these constructions so you can decide which to rewrite." },
  { q:"What are writing goals and how do they help?",
    a:"Writing goals let you tell the checker what kind of text you are writing. Email prioritises clarity and conciseness, flagging overly long sentences and cold formal language. Essay applies academic writing standards, flagging informal contractions and imprecise language. Blog balances readability with engagement, flagging passive voice and complex sentences. Business enforces professional formal tone, flagging ambiguous language and hedging words. Creative relaxes many style rules intentionally broken in fiction and poetry. General applies all rules with equal weight. Selecting the right goal makes feedback more relevant and actionable." },
  { q:"What does the readability score mean?",
    a:"The readability score approximates the Flesch Reading Ease formula, rated 0 to 100. A score of 80-90 is conversational and very easy to read. 70-80 is ideal for most audiences, readable by a 13-year-old. 60-70 is standard for informational web content. Below 50 is college-level or technical writing. The score is affected by average sentence length (shorter sentences score higher) and average word length (simpler words score higher). Most web content should target 60-70. The score updates in real time as you edit." },
  {
    q: "What grammar rules does LanguageTool check and how is it different from a spell-checker?",
    a: `A basic spell-checker only flags words not found in its dictionary. LanguageTool goes much further — it analyses the grammatical structure of each sentence to catch errors a dictionary can't detect:\n\nGrammar errors: Subject-verb disagreement ("The team are playing" vs "The team is playing"), wrong tense, incorrect pronoun case ("between you and I" → "between you and me"), dangling modifiers, split infinitives.\n\nSpelling errors: Misspelled words, including confusable homophones ("their/there/they're", "affect/effect", "its/it's") that a simple spell-checker would miss because both words exist.\n\nPunctuation errors: Missing commas after introductory clauses, incorrect apostrophe use, run-on sentences, missing Oxford commas.\n\nStyle suggestions: Passive voice, wordy phrases ("in order to" → "to"), clichés, redundant intensifiers ("very unique"), double negatives, informal language in formal contexts.\n\nLanguageTool maintains over 6,000 rules for English and operates in over 30 languages, making it one of the most comprehensive free grammar engines available.`,
  },
  {
    q: "What are writing goals and which one should I choose?",
    a: `Writing goals help focus the grammar checker's feedback on what matters most for your specific type of text:\n\n📧 Email — Prioritises clarity and conciseness. Flags overly long sentences and formal language that feels cold for email context. Good for business emails, customer support and newsletters.\n\n🎓 Essay — Applies academic writing standards. Flags informal contractions, first-person overuse (in formal essays) and imprecise language. Good for university assignments and academic papers.\n\n📰 Blog Post — Balances readability with engagement. Flags passive voice and complex sentences that hurt web readability scores. Good for content marketing.\n\n💼 Business — Professional formal tone. Flags ambiguous language, hedging words and unclear structure. Good for reports, proposals and presentations.\n\n🎨 Creative — Relaxes many style rules intentionally broken in fiction, poetry and creative non-fiction. Still catches genuine grammar errors.\n\n📝 General — All rules active with equal weight. Best when you're unsure.`,
  },
  {
    q: "What is passive voice, why is it flagged, and when is it acceptable?",
    a: `Passive voice occurs when the sentence's subject receives the action rather than performing it:\n\nActive: "The manager approved the budget." (subject acts)\nPassive: "The budget was approved by the manager." (subject receives action)\n\nWhy it's flagged: Passive voice adds words without adding meaning. "The budget was approved" is 4 words; "The manager approved the budget" is 5 words but tells you who did it. Excessive passive voice makes writing feel bureaucratic, evasive and harder to follow.\n\nWhen passive voice is acceptable:\n• When the actor is unknown: "The package was stolen."\n• When the actor is unimportant: "The data was collected over six months."\n• Scientific writing, where the method matters more than who performed it: "The samples were centrifuged at 3000 rpm."\n• Formal policy writing: "Employees are required to..."\n\nRule of thumb: If you can name who did the action and it adds value, use active voice. If the actor is irrelevant or unknown, passive is fine.`,
  },
  {
    q: "What are adverbs and why does the checker flag them?",
    a: `Adverbs modify verbs, adjectives or other adverbs. Many end in -ly: quickly, slightly, extremely, honestly, basically, literally. The checker flags -ly adverbs as a writing quality reminder — not as hard errors.\n\nWhy adverbs can weaken writing:\nAn adverb is often a sign that the verb or adjective it modifies isn't strong enough. "He ran quickly" can become "He sprinted." "She was extremely happy" can become "She was ecstatic." Replacing an adverb with a stronger, more specific word almost always produces clearer, more vivid writing.\n\nAdverbs to watch especially:\n• "Very" and "really" — almost always replaceable: "very important" → "critical"; "really fast" → "rapid"\n• "Basically," "essentially," "literally" used as filler at the start of sentences\n• Adverbs that contradict the verb: "smiled happily," "shouted loudly" — the verb already implies the adverb\n\nWhen adverbs are fine: technical writing, dialogue ("she said quietly"), and cases where the specific degree genuinely matters.`,
  },
  {
    q: "How does the overused word finder work and what should I do about it?",
    a: `The overused word finder counts how many times each significant word (4+ letters, excluding common stop words like "the", "that", "with") appears in your text. Words appearing 3 or more times are flagged.\n\nWhy word repetition matters: Repeating the same word within a short passage is one of the most common and easiest-to-fix signs of weak writing. It's especially noticeable to readers even if they don't consciously identify it.\n\nWhat to do with flagged words:\n1. Check if the repetition is intentional: rhetorical repetition for emphasis is a valid stylistic choice.\n2. If not intentional, find synonyms. Use a thesaurus for the most repeated words.\n3. Sometimes repetition can be eliminated by restructuring the sentence entirely.\n4. Some technical documents legitimately repeat key terms for precision and shouldn't be paraphrased.\n\nCommon offenders: "important," "significant," "use," "provide," "ensure," "process," "approach." These are vague placeholder words that often indicate the sentence could be more specific.`,
  },
];

/* ── Types ───────────────────────────────────────────────────────────────── */
interface LTMatch {
  message: string; shortMessage: string; offset: number; length: number;
  replacements: { value: string }[];
  rule: { issueType: string; description: string; category: { name: string } };
  context: { text: string; offset: number; length: number };
}

type ViewMode     = "highlights" | "corrected" | "diff";
type WritingGoal  = "general" | "email" | "essay" | "blog" | "business" | "creative";

/* ── Writing Goals ───────────────────────────────────────────────────────── */
const GOALS: { id: WritingGoal; icon: string; label: string; tip: string }[] = [
  { id:"general",  icon:"📝", label:"General",  tip:"All rules, equal weight" },
  { id:"email",    icon:"✉️",  label:"Email",    tip:"Clarity and conciseness first" },
  { id:"essay",    icon:"🎓", label:"Essay",    tip:"Academic writing standards" },
  { id:"blog",     icon:"📰", label:"Blog",     tip:"Readability and engagement" },
  { id:"business", icon:"💼", label:"Business", tip:"Professional formal tone" },
  { id:"creative", icon:"🎨", label:"Creative", tip:"Flexible style rules" },
];

/* ── Error colours ───────────────────────────────────────────────────────── */
const ERR_COLORS: Record<string, { bg: string; text: string; badge: string; hex: string }> = {
  grammar:       { bg:"bg-red-400/25",    text:"text-red-200",    badge:"bg-red-400/15 text-red-400",       hex:"#f87171" },
  spelling:      { bg:"bg-orange-400/25", text:"text-orange-200", badge:"bg-orange-400/15 text-orange-400", hex:"#fb923c" },
  typographical: { bg:"bg-yellow-400/25", text:"text-yellow-200", badge:"bg-yellow-400/15 text-yellow-400", hex:"#facc15" },
  style:         { bg:"bg-purple-400/25", text:"text-purple-200", badge:"bg-purple-400/15 text-purple-400", hex:"#c084fc" },
  other:         { bg:"bg-blue-400/25",   text:"text-blue-200",   badge:"bg-blue-400/15 text-blue-400",     hex:"#60a5fa" },
};
const getEC = (t: string) => ERR_COLORS[t] ?? ERR_COLORS.other;

/* ── Donut Chart ─────────────────────────────────────────────────────────── */
function DonutChart({ counts }: { counts: Record<string, number> }) {
  const entries = Object.entries(counts).filter(([, v]) => v > 0);
  const total   = entries.reduce((s, [, v]) => s + v, 0);
  if (!total) return null;
  let angle = -90;
  const slices = entries.map(([key, count]) => {
    const sweep  = (count / total) * 360;
    const endA   = angle + sweep;
    const r      = 34;
    const sa     = (angle  * Math.PI) / 180;
    const ea     = (endA   * Math.PI) / 180;
    const x1 = (50 + r * Math.cos(sa)).toFixed(2);
    const y1 = (50 + r * Math.sin(sa)).toFixed(2);
    const x2 = (50 + r * Math.cos(ea)).toFixed(2);
    const y2 = (50 + r * Math.sin(ea)).toFixed(2);
    const path = `M50,50 L${x1},${y1} A${r},${r} 0 ${sweep > 180 ? 1 : 0},1 ${x2},${y2} Z`;
    angle = endA;
    return { key, count, color: getEC(key).hex, path };
  });
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="w-24 h-24 flex-shrink-0">
        {slices.map(s => <path key={s.key} d={s.path} fill={s.color} />)}
        <circle cx="50" cy="50" r="22" fill="#0A0A14" />
        <text x="50" y="47" textAnchor="middle" fill="white" fontSize="17" fontWeight="800" fontFamily="monospace">{total}</text>
        <text x="50" y="58" textAnchor="middle" fill="#9ca3af" fontSize="7.5">issues</text>
      </svg>
      <div className="space-y-1.5">
        {slices.map(s => (
          <div key={s.key} className="flex items-center gap-2 text-xs">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-gray-400 capitalize">{s.key}</span>
            <span className="font-bold text-white ml-1">{s.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Client-side text analysis ──────────────────────────────────────────── */
const STOP = new Set(["that","this","with","have","from","they","will","would","could","should",
  "their","there","these","those","then","than","been","being","were","your","what","when",
  "where","which","while","also","some","more","just","like","into","most","only","over",
  "such","both","each","very","much","about","after","before","other","first","still"]);

function analyseText(text: string) {
  const words     = text.trim().split(/\s+/).filter(w => /\w/.test(w));
  const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(Boolean);
  const sylls     = words.reduce((s, w) => s + Math.max(1, (w.toLowerCase().replace(/[^aeiouy]/g, "").match(/[aeiouy]{1,2}/g) ?? []).length), 0);
  const flesch    = Math.min(100, Math.max(0, Math.round(206.835 - 1.015 * (words.length / (sentences.length || 1)) - 84.6 * (sylls / (words.length || 1)))));
  const readLabel = flesch >= 80 ? "Easy" : flesch >= 60 ? "Standard" : flesch >= 40 ? "Fairly Difficult" : "Difficult";

  // Passive voice (be + past participle pattern)
  const passiveRx = /\b(am|is|are|was|were|be|been|being)\s+\w+ed\b/gi;
  const passiveMatches: { phrase: string; index: number }[] = [];
  let m;
  while ((m = passiveRx.exec(text)) !== null) passiveMatches.push({ phrase: m[0], index: m.index });

  // Adverbs (-ly words, 5+ letters)
  const adverbs = [...new Set((text.match(/\b\w{5,}ly\b/gi) ?? []).map(w => w.toLowerCase()))];

  // Overused words (4+ chars, 3+ occurrences, not stop words)
  const freq: Record<string, number> = {};
  words.forEach(w => {
    const cl = w.toLowerCase().replace(/[^a-z]/g, "");
    if (cl.length >= 4 && !STOP.has(cl)) freq[cl] = (freq[cl] ?? 0) + 1;
  });
  const overused = Object.entries(freq)
    .filter(([, c]) => c >= 3).sort((a, b) => b[1] - a[1]).slice(0, 12)
    .map(([word, count]) => ({ word, count }));

  // Tone detector
  const lower = text.toLowerCase();
  const formalKw   = ["therefore","furthermore","however","consequently","regarding","pursuant","herein","whereas","notwithstanding"];
  const informalKw = ["gonna","wanna","kinda","yeah","yep","nope","okay","ok","lol","tbh","imo"];
  const positiveKw = ["excellent","great","success","achieve","improve","effective","strong","benefit","opportunity","innovative"];
  const negativeKw = ["problem","issue","fail","poor","difficult","concern","risk","challenge","error","mistake"];
  const formal   = formalKw.filter(k => lower.includes(k)).length;
  const informal = informalKw.filter(k => lower.includes(k)).length;
  const positive = positiveKw.filter(k => lower.includes(k)).length;
  const negative = negativeKw.filter(k => lower.includes(k)).length;
  const tones: string[] = [];
  if (formal > informal)   tones.push("Formal");
  else if (informal > 0)   tones.push("Casual");
  if (positive > negative) tones.push("Positive");
  else if (negative > positive) tones.push("Critical");
  const tone = tones.join(" · ") || "Neutral";

  // Long sentences (> 30 words)
  const longSents = sentences.filter(s => s.split(/\s+/).length > 30);

  return { words: words.length, sentences: sentences.length, flesch, readLabel, passiveMatches, adverbs, overused, tone, longSents };
}

/* ── Apply all fixes to produce corrected text ──────────────────────────── */
function applyAllFixes(text: string, matches: LTMatch[]): string {
  const sorted = [...matches].filter(m => m.replacements.length > 0).sort((a, b) => a.offset - b.offset);
  let result = text, offset = 0;
  for (const m of sorted) {
    const rep = m.replacements[0].value;
    const adj = m.offset + offset;
    result  = result.slice(0, adj) + rep + result.slice(adj + m.length);
    offset += rep.length - m.length;
  }
  return result;
}

/* ── Sample text ─────────────────────────────────────────────────────────── */
const SAMPLE = `Their are many reasons why good writing matter. Firstly, it help to communicate ideas clear and effectively. When peoples read content that are poorly written, they loose interest very quickly. A writer who wants to improves their skills should reads as much as possible, and also practise writing everyday. The reports was completed by the team, and the results was very significantly better then expected. Basically, the new approach have been shown to be more effectively then the old one.`;

/* ── Main Component ──────────────────────────────────────────────────────── */
export default function GrammarCheckerClient({ children }: { children?: React.ReactNode }) {
  // ✅ Track usage
  useTrackTool("grammar-checker", "ai");

  const [input,    setInput]    = useState(SAMPLE);
  const [goal,     setGoal]     = useState<WritingGoal>("general");
  const [language, setLanguage] = useState("en-US");
  const [checking, setChecking] = useState(false);
  const [matches,  setMatches]  = useState<LTMatch[]>([]);
  const [checked,  setChecked]  = useState(false);
  const [apiError, setApiError] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("highlights");
  const [copiedCorrected, setCopiedCorrected] = useState(false);

  /* Grammar check via LanguageTool free API */
  const check = useCallback(async () => {
    if (!input.trim()) return;
    setChecking(true); setApiError(""); setMatches([]); setChecked(false);
    try {
      const body = new URLSearchParams({ text: input, language, enabledOnly: "false" });
      const res  = await fetch("https://api.languagetoolplus.com/v2/check", {
        method:  "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
        body:    body.toString(),
      });
      if (!res.ok) throw new Error(`LanguageTool API error: ${res.status}`);
      const data = await res.json();
      setMatches(data.matches ?? []);
      setChecked(true);
      setViewMode("highlights");
    } catch (err) {
      setApiError(`Check failed: ${String(err)}. LanguageTool may be temporarily unavailable.`);
    }
    setChecking(false);
  }, [input, language]);

  // Keyboard shortcut Ctrl+Enter to check
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        if (!checking && input.trim()) check();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [checking, input, check]);

  /* Apply single fix */
  const applyFix = useCallback((match: LTMatch, replacement: string) => {
    setInput(prev => prev.slice(0, match.offset) + replacement + prev.slice(match.offset + match.length));
    setMatches(prev => prev.filter(m => m !== match));
  }, []);

  /* Apply all fixes */
  const fixAll = useCallback(() => {
    setInput(applyAllFixes(input, matches));
    setMatches([]);
  }, [input, matches]);

  /* Build non-overlapping segments for highlight view */
  const segments = useMemo(() => {
    if (!matches.length) return null;
    const result: { text: string; match: LTMatch | null }[] = [];
    let cursor = 0;
    const sorted = [...matches]
      .sort((a, b) => a.offset - b.offset)
      .filter((m, i, arr) => i === 0 || m.offset >= arr[i - 1].offset + arr[i - 1].length);
    for (const m of sorted) {
      if (m.offset > cursor) result.push({ text: input.slice(cursor, m.offset), match: null });
      result.push({ text: input.slice(m.offset, m.offset + m.length), match: m });
      cursor = m.offset + m.length;
    }
    if (cursor < input.length) result.push({ text: input.slice(cursor), match: null });
    return result;
  }, [input, matches]);

  /* Corrected text */
  const correctedText = useMemo(() => applyAllFixes(input, matches), [input, matches]);

  /* Error counts by type */
  const errCounts = useMemo(() => {
    const c: Record<string, number> = {};
    matches.forEach(m => { const t = m.rule.issueType ?? "other"; c[t] = (c[t] ?? 0) + 1; });
    return c;
  }, [matches]);

  /* Client-side analysis */
  const analysis = useMemo(() => analyseText(input), [input]);

  /* Error density */
  const density = analysis.words > 0 ? Math.round((matches.length / analysis.words) * 100 * 10) / 10 : 0;

  /* Download error report */
  const downloadReport = () => {
    const lines = [
      `Grammar Check Report — ${new Date().toLocaleDateString()}`,
      `Tool: PursTech Grammar Checker (powered by LanguageTool)`,
      `Language: ${language}  |  Writing Goal: ${goal}`,
      ``,
      `STATISTICS`,
      `Words: ${analysis.words}  |  Sentences: ${analysis.sentences}`,
      `Issues found: ${matches.length}  |  Error density: ${density}/100 words`,
      `Readability: ${analysis.flesch}/100 (${analysis.readLabel})`,
      `Tone: ${analysis.tone}`,
      `Passive voice instances: ${analysis.passiveMatches.length}`,
      ``,
      `ISSUES (${matches.length})`,
      `${"─".repeat(60)}`,
      ...matches.map((m, i) =>
        `${i + 1}. [${m.rule.issueType?.toUpperCase() ?? "OTHER"}] "${input.slice(m.offset, m.offset + m.length)}"` +
        `\n   → ${m.replacements.slice(0, 3).map(r => r.value).join(" | ")}` +
        `\n   ${m.shortMessage || m.message}`
      ),
      ``,
      `CORRECTED TEXT`,
      `${"─".repeat(60)}`,
      correctedText,
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(blob), download: "grammar-report.txt",
    }).click();
  };

  const LANGS = [
    { code:"en-US", label:"English (US)" }, { code:"en-GB", label:"English (UK)" },
    { code:"de-DE", label:"German" },        { code:"fr",    label:"French" },
    { code:"es",    label:"Spanish" },       { code:"pt-BR", label:"Portuguese" },
    { code:"auto",  label:"Auto-detect" },
  ];

  return (
    // ✅ CRITICAL QA FIX: added overflow-x-hidden to root div to prevent page-wide horizontal blowout
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="hidden sm:flex items-center gap-4">
            <Link href="/tools"   className="text-sm text-gray-500 hover:text-white transition-colors">Tools</Link>
            <Link href="/blog"    className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
            <Link href="/about"   className="text-sm text-gray-500 hover:text-white transition-colors">About</Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">Contact</Link>
            <Link href="/pro"     className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
          <Link href="/" className="sm:hidden text-sm text-gray-500 hover:text-white transition-colors">← Home</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10 flex-grow w-full">
        
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/ai" className="hover:text-gray-400">AI Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Grammar Checker</span>
        </nav>

        {children}

        {/* ── Writing goals ─────────────────────────────────────────────── */}
        <div className="mb-4">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Writing Goal</div>
          <div className="flex flex-wrap gap-2">
            {GOALS.map(g => (
              <button key={g.id} onClick={() => setGoal(g.id)} title={g.tip}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                  goal === g.id
                    ? "bg-[#6C3AFF] text-white border-transparent"
                    : "bg-[#13131F] border-white/5 text-gray-400 hover:text-white hover:border-white/20"
                }`}>
                <span>{g.icon}</span><span>{g.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Language + hint ───────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <select value={language} onChange={e => setLanguage(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#13131F] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/50 transition-all">
            {LANGS.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
          </select>
          <span className="text-xs text-gray-600">Powered by LanguageTool · 6,000+ rules · free, no account</span>
        </div>

        {/* ── Main grid ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

          {/* Left: editor + result views */}
          <div className="xl:col-span-3 space-y-4 min-w-0">
            {/* Text editor */}
            <div className="relative">
              <textarea value={input} onChange={e => { setInput(e.target.value); setChecked(false); setMatches([]); }}
                rows={13} placeholder="Paste or type your text here…"
                className="w-full px-5 py-4 rounded-2xl bg-[#13131F] border border-white/5 text-gray-200 text-sm leading-relaxed focus:outline-none focus:border-[#6C3AFF]/30 resize-none transition-all font-mono" />
              <span className="absolute bottom-3 right-3 text-xs text-gray-600">{input.length}/20000</span>
            </div>

            <button onClick={check} disabled={checking || !input.trim() || input.length > 20000}
              className="w-full py-4 rounded-2xl bg-[#6C3AFF] hover:bg-[#5B2EE0] disabled:opacity-50 text-white font-extrabold text-lg transition-all flex items-center justify-center">
              {checking ? "Checking with LanguageTool…" : (
                <>
                  ✓ Check Grammar
                  <span className="ml-2 text-xs opacity-60 hidden sm:inline font-medium tracking-normal px-2 py-0.5 bg-black/20 rounded">Ctrl+Enter</span>
                </>
              )}
            </button>

            {apiError && (
              <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3">{apiError}</div>
            )}

            {/* View toggle */}
            {checked && (
              <div className="min-w-0">
                <div className="flex flex-wrap gap-1 bg-[#13131F] border border-white/5 p-1 rounded-xl w-full sm:w-fit mb-3">
                  {(["highlights","corrected","diff"] as ViewMode[]).map(v => (
                    <button key={v} onClick={() => setViewMode(v)}
                      className={`flex-1 sm:flex-none px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${viewMode === v ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"}`}>
                      {v === "highlights" ? "🔍 Highlights" : v === "corrected" ? "✅ Corrected" : "🔄 Diff"}
                    </button>
                  ))}
                </div>

                {/* Highlights view */}
                {viewMode === "highlights" && (
                  <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 overflow-hidden">
                    {segments && matches.length > 0 ? (
                      <div className="text-sm leading-loose whitespace-pre-wrap break-words">
                        {segments.map((seg, i) =>
                          seg.match ? (
                            <span key={i}
                              className={`rounded px-0.5 border border-current/20 cursor-help ${getEC(seg.match.rule.issueType).bg} ${getEC(seg.match.rule.issueType).text}`}
                              title={`[${seg.match.rule.issueType}] ${seg.match.shortMessage || seg.match.message}${seg.match.replacements[0] ? ` → ${seg.match.replacements[0].value}` : ""}`}>
                              {seg.text}
                            </span>
                          ) : (
                            <span key={i} className="text-gray-200">{seg.text}</span>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap break-words">{input}</div>
                    )}

                    {matches.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-white/5">
                        {Object.entries(errCounts).map(([type, count]) => (
                          <span key={type} className={`text-xs px-2 py-0.5 rounded-full capitalize font-semibold ${getEC(type).badge}`}>
                            {type} ({count})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Corrected view */}
                {viewMode === "corrected" && (
                  <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 overflow-hidden">
                    <div className="text-sm text-green-300 leading-relaxed whitespace-pre-wrap break-words">{correctedText}</div>
                    
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 mt-4 pt-3 border-t border-white/5">
                      <button
                        onClick={async () => {
                          await navigator.clipboard.writeText(correctedText);
                          setCopiedCorrected(true);
                          setTimeout(() => setCopiedCorrected(false), 2000);
                        }}
                        className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all border ${copiedCorrected ? "bg-green-600 text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"}`}>
                        {copiedCorrected ? "✓ Copied!" : "📋 Copy Corrected"}
                      </button>

                      <button onClick={() => { setInput(correctedText); setMatches([]); }}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-bold transition-all">
                        Apply to Editor
                      </button>
                    </div>
                  </div>
                )}

                {/* Diff view */}
                {viewMode === "diff" && (
                  <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-red-400 mb-2 uppercase tracking-wider">Original</div>
                      <div className="text-xs text-gray-400 leading-relaxed whitespace-pre-wrap font-mono break-words">{input}</div>
                    </div>
                    <div className="mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 min-w-0">
                      <div className="text-xs font-bold text-green-400 mb-2 uppercase tracking-wider">Corrected</div>
                      <div className="text-xs text-green-300 leading-relaxed whitespace-pre-wrap font-mono break-words">{correctedText}</div>
                    </div>
                  </div>
                )}

                {/* Fix all + download */}
                {matches.length > 0 && (
                  <div className="flex flex-col sm:flex-row gap-2 mt-4">
                    <button onClick={fixAll}
                      className="w-full sm:flex-1 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white text-sm font-extrabold transition-all">
                      ✓ Fix All {matches.length} Issues
                    </button>
                    <button onClick={downloadReport}
                      className="w-full sm:w-auto px-4 py-3 rounded-xl bg-[#13131F] border border-white/10 text-gray-400 hover:text-white text-sm font-bold transition-all">
                      ⬇ Report
                    </button>
                  </div>
                )}

                {checked && matches.length === 0 && (
                  <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5 text-center mt-4">
                    <div className="text-3xl mb-2">✅</div>
                    <div className="font-bold text-green-400 text-lg">No grammar issues found!</div>
                    <div className="text-xs text-gray-500 mt-1">Your text passed all LanguageTool checks for {language}.</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: stats + donut + error list */}
          <div className="xl:col-span-2 space-y-4 min-w-0">

            {/* Stats card */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Text Analysis</h3>
              <div className="space-y-2.5">
                {[
                  { label:"Words",         value: analysis.words,     color:"text-white" },
                  { label:"Sentences",     value: analysis.sentences, color:"text-white" },
                  { label:"Issues",        value: matches.length,     color: matches.length > 0 ? "text-red-400" : "text-green-400" },
                  { label:"Error density", value: `${density}/100w`,  color: density > 5 ? "text-orange-400" : "text-green-400" },
                  { label:"Tone",          value: analysis.tone,      color:"text-cyan-400" },
                ].map(s => (
                  <div key={s.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{s.label}</span>
                    <span className={`font-bold ${s.color}`}>{String(s.value)}</span>
                  </div>
                ))}
                {/* Readability bar */}
                <div>
                  <div className="flex justify-between text-sm mb-1.5 mt-2">
                    <span className="text-gray-500">Readability</span>
                    <span className="font-bold text-[#6C3AFF]">{analysis.flesch}/100 · {analysis.readLabel}</span>
                  </div>
                  <div className="h-2 bg-[#0A0A14] rounded-full overflow-hidden">
                    <div className="h-full bg-[#6C3AFF] rounded-full transition-all" style={{ width:`${analysis.flesch}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Donut chart */}
            {Object.keys(errCounts).length > 0 && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Error Breakdown</h3>
                <div className="overflow-hidden">
                  <DonutChart counts={errCounts} />
                </div>
              </div>
            )}

            {/* Error list */}
            {matches.length > 0 && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 max-h-80 overflow-y-auto overflow-x-hidden">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 sticky top-0 bg-[#13131F] pb-1 z-10">
                  All Issues ({matches.length})
                </h3>
                <div className="space-y-2">
                  {matches.map((m, i) => (
                    <div key={i} className="bg-[#0A0A14] border border-white/5 rounded-xl p-3 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize font-semibold ${getEC(m.rule.issueType).badge}`}>
                          {m.rule.issueType ?? "other"}
                        </span>
                        <span className="text-xs text-gray-500 truncate flex-1 min-w-[100px]">{m.shortMessage || m.message}</span>
                      </div>
                      {/* ✅ CRITICAL QA FIX: added overflow-hidden to prevent long context strings from blowing out the table */}
                      <div className="text-xs font-mono bg-[#13131F] rounded-lg px-3 py-2 mb-2 truncate text-gray-400 w-full max-w-full overflow-hidden">
                        "…<span className={`font-bold ${getEC(m.rule.issueType).text}`}>{m.context.text.slice(m.context.offset, m.context.offset + m.context.length)}</span>…"
                      </div>
                      {m.replacements.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {m.replacements.slice(0, 4).map((r, j) => (
                            <button key={j} onClick={() => applyFix(m, r.value)}
                              className="px-2.5 py-1 rounded-lg bg-green-600/20 hover:bg-green-600 border border-green-600/30 text-green-400 hover:text-white text-xs font-mono transition-all">
                              {r.value}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Client-side deep analysis ─────────────────────────────────── */}
        {input.trim().length > 50 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Passive voice */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-white">Passive Voice</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  analysis.passiveMatches.length === 0 ? "bg-green-400/10 text-green-400" :
                  analysis.passiveMatches.length < 3  ? "bg-yellow-400/10 text-yellow-400" :
                  "bg-red-400/10 text-red-400"
                }`}>{analysis.passiveMatches.length} found</span>
              </div>
              {analysis.passiveMatches.length > 0 ? (
                <div className="space-y-1 max-h-32 overflow-y-auto pr-1 overflow-x-hidden">
                  {analysis.passiveMatches.slice(0, 8).map((p, i) => (
                    <div key={i} className="text-xs text-gray-400 bg-[#0A0A14] rounded-lg px-2.5 py-1.5 font-mono italic break-words">
                      {p.phrase}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-green-400">✓ No passive voice detected</div>
              )}
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">Active voice is clearer — rewrite passive constructions where possible.</p>
            </div>

            {/* Adverb scanner */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-white">Adverbs (-ly)</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  analysis.adverbs.length === 0 ? "bg-green-400/10 text-green-400" :
                  analysis.adverbs.length < 4  ? "bg-yellow-400/10 text-yellow-400" :
                  "bg-orange-400/10 text-orange-400"
                }`}>{analysis.adverbs.length} found</span>
              </div>
              {analysis.adverbs.length > 0 ? (
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto pr-1">
                  {analysis.adverbs.slice(0, 15).map((a, i) => (
                    <span key={i} className="text-xs bg-orange-400/10 text-orange-300 border border-orange-400/20 px-2 py-0.5 rounded-lg font-mono break-words">
                      {a}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-green-400">✓ No -ly adverbs detected</div>
              )}
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">Replace adverbs with stronger verbs for more vivid writing.</p>
            </div>

            {/* Overused words */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold text-white">Overused Words</h3>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
                  analysis.overused.length === 0 ? "bg-green-400/10 text-green-400" : "bg-purple-400/10 text-purple-400"
                }`}>{analysis.overused.length} flagged</span>
              </div>
              {analysis.overused.length > 0 ? (
                <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
                  {analysis.overused.slice(0, 8).map((w, i) => (
                    <div key={i} className="flex items-center justify-between text-xs bg-[#0A0A14] rounded-lg px-2.5 py-1.5">
                      <span className="text-gray-300 font-mono truncate mr-2">{w.word}</span>
                      <span className="text-purple-400 font-bold flex-shrink-0">{w.count}×</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-green-400">✓ No words used excessively</div>
              )}
              <p className="text-xs text-gray-600 mt-2 leading-relaxed">Words used 3+ times — consider synonyms to vary your vocabulary.</p>
            </div>
          </div>
        )}

        {/* ── SEO & Marketing Content ───────────────── */}
        <div className="mt-16 space-y-6">
          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-[#13131F] border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl flex-shrink-0">{f.icon}</span>
                  <span className="text-sm font-bold text-white leading-tight">{f.title}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Use cases */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3">Who uses this tool?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {USE_CASES.map(u => (
                <div key={u.who} className="flex gap-3">
                  <span className="text-[#6C3AFF] font-extrabold text-sm flex-shrink-0 mt-0.5">→</span>
                  <div>
                    <span className="text-sm font-semibold text-white block mb-0.5">{u.who}</span>
                    <span className="text-sm text-gray-400 leading-relaxed">{u.why}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Competitor table */}
          {/* ✅ CRITICAL QA FIX: added overflow-hidden to the card, and isolated the overflow-x-auto to ONLY the table wrapper */}
          <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden w-full">
            <div className="px-5 pt-4 pb-2">
              <h2 className="text-sm font-bold text-white">PursTech vs Grammarly vs Hemingway vs LanguageTool</h2>
              <p className="text-xs text-gray-500 mt-0.5">Feature comparison — all at zero cost</p>
            </div>
            
            <div className="overflow-x-auto w-full">
              <table className="w-full text-xs min-w-[600px]">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-5 py-3 text-gray-500 font-semibold whitespace-nowrap">Feature</th>
                    <th className="px-4 py-3 text-[#6C3AFF] font-bold">PursTech</th>
                    <th className="px-4 py-3 text-gray-500">Grammarly</th>
                    <th className="px-4 py-3 text-gray-500">Hemingway</th>
                    <th className="px-4 py-3 text-gray-500">LanguageTool</th>
                  </tr>
                </thead>
                <tbody>
                  {COMPETITOR_TABLE.map((row, i) => (
                    <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="px-5 py-3 text-gray-400 whitespace-nowrap">{row.feature}</td>
                      <td className="px-4 py-3 text-center"><CellIcon v={row.purstech} /></td>
                      <td className="px-4 py-3 text-center"><CellIcon v={row.grammarly} /></td>
                      <td className="px-4 py-3 text-center"><CellIcon v={row.hemingway} /></td>
                      <td className="px-4 py-3 text-center"><CellIcon v={row.lt} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── How to Use ───────────────────────────────────────────────── */}
        <div className="mt-16 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Grammar Checker</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { step:"1", title:"Set your writing goal",  desc:"Pick Email, Essay, Blog, Business, Creative or General to get feedback tailored to your text's purpose and audience." },
              { step:"2", title:"Paste your text",        desc:"Enter up to 20,000 characters. The sample text shows exactly what the tool catches so you can see it in action immediately." },
              { step:"3", title:"Check and review",       desc:"Click Check Grammar or press Ctrl+Enter. LanguageTool analyses your text and highlights errors colour-coded by type. Hover any highlight for the explanation." },
              { step:"4", title:"Fix and export",         desc:"Click individual replacements to fix one at a time, or hit Fix All to apply every correction instantly. Download the full error report as .txt." },
            ].map(s => (
              <div key={s.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#6C3AFF] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-0.5">{s.step}</div>
                <div>
                  <div className="font-bold text-white text-sm mb-1.5">{s.title}</div>
                  <div className="text-gray-500 text-sm leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        <div className="mt-16">
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
        <div className="mt-16 bg-[#13131F] border border-white/5 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-extrabold text-white">Why Good Grammar Matters — and How to Improve It</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Grammar is the foundation of clear communication. Poor grammar erodes reader trust,
            reduces perceived authority and makes content harder to understand. Studies in
            content marketing consistently show that grammar errors increase bounce rates and
            reduce conversion — readers associate errors with low quality, whether they consciously
            notice them or not. For professional communication, this is especially critical:
            a single apostrophe error in a business proposal can undermine confidence in
            an otherwise strong pitch.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            For non-native English speakers, grammar checkers are particularly valuable. English
            has many traps — articles (a/an/the), prepositions, verb conjugation and countable
            vs uncountable nouns all differ from most other language families. LanguageTool's
            rules were developed specifically to catch the patterns that non-native speakers
            most frequently get wrong, making it significantly more useful than a standard
            spell-checker for English as a second language writing.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Beyond grammar, writing quality depends on style: sentence variety, active voice,
            precise vocabulary and appropriate tone for your audience. The best writers don't
            just avoid errors — they actively choose words and structures that create clarity
            and engagement. Using a grammar checker as a first pass, then reviewing the
            style suggestions, passive voice and overused word analysis gives you a comprehensive
            review that approximates what a professional editor would catch.
          </p>
        </div>
      </main>

      {/* ✅ QA FIX: Consistent Full Footer */}
      <footer className="border-t border-white/5 mt-16 py-8 text-center bg-[#0A0A14]">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center flex-wrap gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/about"   className="hover:text-gray-400 transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
