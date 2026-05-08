"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";

/* ── JSON-LD ─────────────────────────────────────────────────────────────────*/
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Regex Tester",
  description: "Free online regex tester with real-time match highlighting, named groups, replace mode and 30+ pattern library.",
  url: "https://purstech.com/tools/regex-tester",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

/* ── FAQ ─────────────────────────────────────────────────────────────────────*/
const FAQ = [
  {
    q: "What is a regular expression (regex)?",
    a: "A regular expression is a sequence of characters that defines a search pattern. Used in programming for string searching, validation and manipulation, regex is supported natively in JavaScript, Python, Java, PHP and most modern languages. For example, the pattern /^[\\w.]+@[\\w]+\\.[a-z]{2,}$/i matches most email addresses. Mastering regex allows you to solve complex text-processing tasks in a single line of code.",
  },
  {
    q: "What do the regex flags g, i, m, s mean?",
    a: "The g (global) flag finds all matches instead of stopping at the first. The i (case-insensitive) flag makes the match ignore letter case. The m (multiline) flag makes ^ and $ match the start and end of each line rather than the whole string. The s (dotAll) flag makes the dot (.) match newline characters as well as other characters — without this flag, . doesn't match \\n. You can combine flags: /pattern/gim applies global, case-insensitive and multiline simultaneously.",
  },
  {
    q: "What is the difference between greedy and lazy matching?",
    a: "Greedy quantifiers (*, +, ?) match as much text as possible while still allowing the overall pattern to match. Lazy quantifiers (*?, +?, ??) match as little text as possible. For example, on the string '<a>text</a>', the greedy pattern <.*> matches the entire string '<a>text</a>', while the lazy pattern <.*?> matches only '<a>'. Use lazy matching when you want to match the shortest possible string between delimiters.",
  },
  {
    q: "How do named capture groups work?",
    a: "Named capture groups use the syntax (?<name>pattern) and allow you to reference matched text by a meaningful name instead of a number. For example, /(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})/ on '2025-01-15' creates groups year='2025', month='01', day='15'. In JavaScript you access them via match.groups.year. Named groups make complex regex patterns far more readable and maintainable, especially when you have many capture groups.",
  },
  {
    q: "What are lookahead and lookbehind assertions?",
    a: "Lookahead (?=...) asserts that what follows the current position matches the pattern without consuming characters. Negative lookahead (?!...) asserts it does NOT match. Lookbehind (?<=...) asserts that what precedes the current position matches. For example, /\\d+(?= dollars)/ matches a number only if followed by ' dollars', and /(?<=\\$)\\d+/ matches digits only if preceded by '$'. Lookarounds are powerful for context-dependent matching without including the context in the result.",
  },
];

/* ── Pattern library ─────────────────────────────────────────────────────────*/
const PATTERNS = [
  { cat: "Validation", name: "Email",          pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}", flags: "i" },
  { cat: "Validation", name: "URL",            pattern: "https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_+.~#?&\\/=]*)", flags: "i" },
  { cat: "Validation", name: "IPv4 Address",   pattern: "\\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b", flags: "g" },
  { cat: "Validation", name: "Phone (US)",     pattern: "(\\+1)?[\\s.-]?\\(?[0-9]{3}\\)?[\\s.-]?[0-9]{3}[\\s.-]?[0-9]{4}", flags: "g" },
  { cat: "Validation", name: "Credit Card",    pattern: "\\b(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13})\\b", flags: "g" },
  { cat: "Validation", name: "Hex Color",      pattern: "#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b", flags: "g" },
  { cat: "Validation", name: "Zip Code (US)",  pattern: "\\b[0-9]{5}(?:-[0-9]{4})?\\b", flags: "g" },
  { cat: "Dates",      name: "Date YYYY-MM-DD",pattern: "(?<year>\\d{4})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[12]\\d|3[01])", flags: "g" },
  { cat: "Dates",      name: "Date MM/DD/YYYY",pattern: "(0[1-9]|1[0-2])\\/(0[1-9]|[12]\\d|3[01])\\/\\d{4}", flags: "g" },
  { cat: "Dates",      name: "Time HH:MM",     pattern: "([01]?[0-9]|2[0-3]):[0-5][0-9]", flags: "g" },
  { cat: "Text",       name: "Whitespace",     pattern: "\\s+", flags: "g" },
  { cat: "Text",       name: "Empty Lines",    pattern: "^\\s*$", flags: "gm" },
  { cat: "Text",       name: "Duplicate Words",pattern: "\\b(\\w+)\\s+\\1\\b", flags: "gi" },
  { cat: "Text",       name: "HTML Tags",      pattern: "<[^>]+>", flags: "g" },
  { cat: "Text",       name: "HTML Comments",  pattern: "<!--[\\s\\S]*?-->", flags: "g" },
  { cat: "Code",       name: "JS Comments",    pattern: "\\/\\/[^\n]*|\\/\\*[\\s\\S]*?\\*\\/", flags: "g" },
  { cat: "Code",       name: "Console.log",    pattern: "console\\.(log|warn|error|info)\\([^)]*\\);?", flags: "g" },
  { cat: "Code",       name: "TODO Comments",  pattern: "\\/\\/\\s*TODO:?.*", flags: "gi" },
  { cat: "Numbers",    name: "Integer",        pattern: "-?\\b\\d+\\b", flags: "g" },
  { cat: "Numbers",    name: "Float",          pattern: "-?\\b\\d+\\.\\d+\\b", flags: "g" },
  { cat: "Numbers",    name: "Currency (USD)", pattern: "\\$[0-9]{1,3}(?:,[0-9]{3})*(?:\\.[0-9]{2})?", flags: "g" },
];

const COLORS = ["bg-yellow-400/60","bg-green-400/60","bg-blue-400/60","bg-pink-400/60","bg-orange-400/60"];

/* ── Regex explainer ────────────────────────────────────────────────────────*/
function explainRegex(pattern: string): string[] {
  const explanations: string[] = [];
  let i = 0;
  const tokens: [string, string][] = [];

  const push = (tok: string, exp: string) => tokens.push([tok, exp]);

  while (i < pattern.length) {
    const ch = pattern[i];
    if (ch === "^") { push("^", "Start of string / line"); i++; }
    else if (ch === "$") { push("$", "End of string / line"); i++; }
    else if (ch === ".") { push(".", "Any character (except newline by default)"); i++; }
    else if (ch === "*") { push("*", "Zero or more of the preceding (greedy)"); i++; }
    else if (ch === "+") { push("+", "One or more of the preceding (greedy)"); i++; }
    else if (ch === "?") { push("?", "Zero or one of the preceding (optional)"); i++; }
    else if (ch === "|") { push("|", "Alternation — matches either side"); i++; }
    else if (ch === "\\") {
      const next = pattern[i+1] ?? "";
      const map: Record<string,string> = { d:"Digit [0-9]", D:"Non-digit", w:"Word char [a-zA-Z0-9_]",
        W:"Non-word char", s:"Whitespace", S:"Non-whitespace", b:"Word boundary",
        B:"Non-word boundary", n:"Newline", t:"Tab", r:"Carriage return" };
      push(`\\${next}`, map[next] ?? `Escaped character '${next}'`);
      i += 2;
    } else if (ch === "[") {
      const end = pattern.indexOf("]", i);
      const cls = end >= 0 ? pattern.slice(i, end+1) : "[...";
      push(cls, `Character class: matches any character in ${cls}`);
      i = end >= 0 ? end + 1 : i + 1;
    } else if (ch === "(") {
      if (pattern.slice(i).startsWith("(?<")) {
        const nameEnd = pattern.indexOf(">", i+3);
        const name = nameEnd > 0 ? pattern.slice(i+3, nameEnd) : "?";
        push(`(?<${name}>`, `Named capture group '${name}'`); i = nameEnd + 1;
      } else if (pattern.slice(i).startsWith("(?:")) {
        push("(?:", "Non-capturing group"); i += 3;
      } else if (pattern.slice(i).startsWith("(?=")) {
        push("(?=", "Positive lookahead"); i += 3;
      } else if (pattern.slice(i).startsWith("(?!")) {
        push("(?!", "Negative lookahead"); i += 3;
      } else if (pattern.slice(i).startsWith("(?<=")) {
        push("(?<=", "Positive lookbehind"); i += 4;
      } else if (pattern.slice(i).startsWith("(?<!")) {
        push("(?<!", "Negative lookbehind"); i += 4;
      } else { push("(", "Start of capturing group"); i++; }
    } else if (ch === ")") { push(")", "End of group"); i++; }
    else if (ch === "{") {
      const end = pattern.indexOf("}", i);
      const q = end >= 0 ? pattern.slice(i, end+1) : "{";
      push(q, `Quantifier: repeat ${q.replace("{","").replace("}","").replace(",", " to ")} times`);
      i = end >= 0 ? end + 1 : i + 1;
    } else { push(ch, `Literal character '${ch}'`); i++; }
  }

  return tokens.map(([tok, exp]) => `${tok.padEnd(12)} → ${exp}`);
}

/* ── Main ────────────────────────────────────────────────────────────────────*/
export default function RegexTesterClient() {
  const [pattern,   setPattern]   = useState("[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}");
  const [flags,     setFlags]     = useState({ g: true, i: true, m: false, s: false });
  const [testStr,   setTestStr]   = useState("Contact us at hello@purstech.com or support@example.org for help.\nInvalid: not-an-email @missing.com");
  const [replace,   setReplace]   = useState("");
  const [mode,      setMode]      = useState<"match" | "replace" | "explain">("match");
  const [showLib,   setShowLib]   = useState(false);
  const [libFilter, setLibFilter] = useState("All");

  const flagStr = Object.entries(flags).filter(([,v]) => v).map(([k]) => k).join("");

  const regexResult = useMemo(() => {
    if (!pattern) return { regex: null, error: null };
    try {
      const r = new RegExp(pattern, flagStr);
      return { regex: r, error: null };
    } catch (e) {
      return { regex: null, error: (e as Error).message };
    }
  }, [pattern, flagStr]);

  const matches = useMemo(() => {
    const { regex } = regexResult;
    if (!regex || !testStr) return [];
    const out: { index: number; match: string; groups: Record<string,string>; capGroups: string[] }[] = [];
    if (flags.g) {
      let m: RegExpExecArray | null;
      const r2 = new RegExp(pattern, flagStr);
      while ((m = r2.exec(testStr)) !== null) {
        out.push({ index: m.index, match: m[0], groups: m.groups ?? {}, capGroups: m.slice(1) });
        if (m[0].length === 0) r2.lastIndex++;
      }
    } else {
      const m = regex.exec(testStr);
      if (m) out.push({ index: m.index, match: m[0], groups: m.groups ?? {}, capGroups: m.slice(1) });
    }
    return out;
  }, [regexResult, testStr, pattern, flagStr, flags.g]);

  const highlighted = useMemo(() => {
    if (!testStr || matches.length === 0) return null;
    const parts: { text: string; idx: number | null }[] = [];
    let cursor = 0;
    matches.forEach((m, i) => {
      if (m.index > cursor) parts.push({ text: testStr.slice(cursor, m.index), idx: null });
      parts.push({ text: m.match, idx: i });
      cursor = m.index + m.match.length;
    });
    if (cursor < testStr.length) parts.push({ text: testStr.slice(cursor), idx: null });
    return parts;
  }, [testStr, matches]);

  const replaced = useMemo(() => {
    const { regex } = regexResult;
    if (!regex || mode !== "replace") return "";
    try { return testStr.replace(regex, replace); }
    catch { return "Replace error"; }
  }, [regexResult, testStr, replace, mode]);

  const explanation = useMemo(() => pattern ? explainRegex(pattern) : [], [pattern]);

  const cats = ["All", ...Array.from(new Set(PATTERNS.map(p => p.cat)))];
  const libItems = libFilter === "All" ? PATTERNS : PATTERNS.filter(p => p.cat === libFilter);

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span>›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span>›</span>
          <span className="text-gray-400">Regex Tester</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Developer Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Regex Tester Online — Real-Time Matching, Groups &amp; Explainer
          </h1>
          <p className="text-gray-400 max-w-2xl">Test, debug and understand regular expressions instantly. Real-time match highlighting, named group extraction, replace mode, 20+ pattern library and a plain-English regex explainer.</p>
        </div>

        {/* Pattern input */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-gray-500 font-mono text-lg select-none">/</span>
            <input
              value={pattern}
              onChange={e => setPattern(e.target.value)}
              placeholder="Enter regular expression pattern…"
              className={`flex-1 px-4 py-2.5 rounded-xl bg-[#0A0A14] border text-white text-sm font-mono focus:outline-none transition-all ${
                regexResult.error ? "border-[#FF3A6C]/60" : "border-white/10 focus:border-[#6C3AFF]/60"
              }`}
            />
            <span className="text-gray-500 font-mono text-lg select-none">/</span>
            <span className="font-mono text-[#6C3AFF] text-sm w-8">{flagStr}</span>
          </div>

          {/* Flags */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">Flags:</span>
            {(["g","i","m","s"] as const).map(f => {
              const labels: Record<string,string> = { g:"global", i:"ignore case", m:"multiline", s:"dotAll" };
              return (
                <button key={f} onClick={() => setFlags(p => ({ ...p, [f]: !p[f] }))}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all border ${
                    flags[f] ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-500 hover:text-white"
                  }`}>
                  {f} <span className="opacity-60 text-[10px] normal-case">{labels[f]}</span>
                </button>
              );
            })}
            <div className="ml-auto flex gap-1">
              {(["match","replace","explain"] as const).map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all border ${
                    mode===m ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                  }`}>{m}</button>
              ))}
            </div>
          </div>

          {regexResult.error && (
            <div className="mt-2 text-xs text-[#FF3A6C] bg-[#FF3A6C]/10 border border-[#FF3A6C]/20 rounded-xl px-3 py-2 font-mono">
              ⚠ {regexResult.error}
            </div>
          )}
        </div>

        {/* Stats bar */}
        {!regexResult.error && (
          <div className="flex gap-4 mb-4 flex-wrap">
            {[
              { label: "Matches", value: matches.length, color: matches.length > 0 ? "text-green-400" : "text-gray-500" },
              { label: "Pattern length", value: pattern.length, color: "text-gray-400" },
              { label: "Test string length", value: testStr.length, color: "text-gray-400" },
              { label: "Groups", value: matches[0] ? Object.keys(matches[0].groups).length + matches[0].capGroups.length : 0, color: "text-cyan-400" },
            ].map(s => (
              <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-xl px-4 py-2 text-center">
                <span className={`font-extrabold text-lg ${s.color}`}>{s.value}</span>
                <span className="text-xs text-gray-600 ml-1.5">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* Test string */}
          <div className="space-y-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Test String</label>
              <textarea value={testStr} onChange={e => setTestStr(e.target.value)} rows={10}
                className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#6C3AFF]/60 resize-none transition-all leading-relaxed" />
            </div>

            {/* Replace input */}
            {mode === "replace" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Replacement (use $1, $2 or {"$<name>"} for groups)</label>
                <input value={replace} onChange={e => setReplace(e.target.value)}
                  placeholder='e.g. [REDACTED] or $<year>/$<month>'
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
              </div>
            )}
          </div>

          {/* Results */}
          <div className="space-y-4">
            {/* Match highlighting */}
            {mode === "match" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Match Preview {matches.length > 0 && <span className="text-green-400 ml-1">({matches.length} match{matches.length !== 1 ? "es" : ""})</span>}
                </label>
                <div className="bg-[#0A0A14] rounded-xl p-4 font-mono text-sm leading-relaxed min-h-[120px] whitespace-pre-wrap break-all">
                  {highlighted ? highlighted.map((part, i) => (
                    part.idx !== null
                      ? <mark key={i} className={`${COLORS[part.idx % COLORS.length]} text-black rounded px-0.5`}>{part.text}</mark>
                      : <span key={i} className="text-gray-300">{part.text}</span>
                  )) : <span className="text-gray-600">{testStr || "Enter a test string above"}</span>}
                </div>
              </div>
            )}

            {/* Replace result */}
            {mode === "replace" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Result after replace</label>
                <div className="bg-[#0A0A14] rounded-xl p-4 font-mono text-sm text-green-400 leading-relaxed min-h-[120px] whitespace-pre-wrap break-all">
                  {replaced || <span className="text-gray-600">Result appears here</span>}
                </div>
              </div>
            )}

            {/* Explainer */}
            {mode === "explain" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Plain-English Explainer</label>
                <div className="bg-[#0A0A14] rounded-xl p-4 font-mono text-xs leading-loose min-h-[120px] space-y-1">
                  {explanation.length > 0
                    ? explanation.map((line, i) => {
                        const [tok, exp] = line.split(" → ");
                        return (
                          <div key={i} className="flex gap-3">
                            <span className="text-[#6C3AFF] font-bold min-w-[80px]">{tok?.trim()}</span>
                            <span className="text-gray-400">{exp}</span>
                          </div>
                        );
                      })
                    : <span className="text-gray-600">Enter a pattern to explain</span>
                  }
                </div>
              </div>
            )}

            {/* Matches table */}
            {mode === "match" && matches.length > 0 && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">All Matches</label>
                <div className="overflow-x-auto max-h-64 overflow-y-auto">
                  <table className="w-full text-xs font-mono">
                    <thead className="sticky top-0 bg-[#13131F]">
                      <tr className="text-gray-500 border-b border-white/5">
                        <th className="text-left py-2">#</th>
                        <th className="text-left py-2">Match</th>
                        <th className="text-left py-2">Index</th>
                        {matches[0] && Object.keys(matches[0].groups).length > 0
                          ? Object.keys(matches[0].groups).map(k => <th key={k} className="text-left py-2">:{k}</th>)
                          : matches[0]?.capGroups.map((_, i) => <th key={i} className="text-left py-2">${i+1}</th>)
                        }
                      </tr>
                    </thead>
                    <tbody>
                      {matches.map((m, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="py-2 text-gray-600">{i+1}</td>
                          <td className={`py-2 ${COLORS[i % COLORS.length].replace("bg-","text-").replace("/60","")}`}>{m.match || '""'}</td>
                          <td className="py-2 text-gray-400">{m.index}</td>
                          {Object.keys(m.groups).length > 0
                            ? Object.values(m.groups).map((v,j) => <td key={j} className="py-2 text-cyan-400">{v ?? "—"}</td>)
                            : m.capGroups.map((v,j) => <td key={j} className="py-2 text-cyan-400">{v ?? "—"}</td>)
                          }
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pattern Library */}
        <div className="mt-6 bg-[#13131F] border border-white/5 rounded-2xl p-5">
          <button onClick={() => setShowLib(p => !p)}
            className="w-full flex items-center justify-between">
            <span className="font-bold text-white text-sm">📚 Pattern Library ({PATTERNS.length} patterns)</span>
            <span className={`text-[#6C3AFF] text-xl transition-transform ${showLib ? "rotate-45" : ""}`}>+</span>
          </button>
          {showLib && (
            <div className="mt-4">
              <div className="flex gap-2 flex-wrap mb-4">
                {cats.map(c => (
                  <button key={c} onClick={() => setLibFilter(c)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all border ${
                      libFilter===c ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"
                    }`}>{c}</button>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {libItems.map(p => (
                  <button key={p.name} onClick={() => {
                    setPattern(p.pattern);
                    setFlags({ g: p.flags.includes("g"), i: p.flags.includes("i"), m: p.flags.includes("m"), s: p.flags.includes("s") });
                    setShowLib(false);
                  }}
                    className="flex flex-col items-start px-4 py-3 bg-[#0A0A14] rounded-xl border border-white/5 hover:border-[#6C3AFF]/40 text-left transition-all group">
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-semibold text-white group-hover:text-[#6C3AFF] transition-colors">{p.name}</span>
                      <span className="text-xs text-gray-600 bg-[#13131F] px-2 py-0.5 rounded">{p.cat}</span>
                    </div>
                    <span className="text-xs text-gray-500 font-mono mt-1 truncate w-full">{p.pattern.slice(0, 40)}{p.pattern.length > 40 ? "…" : ""}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Regex Tester</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Enter your pattern", desc:"Type a regex pattern in the input field. Red border + error message appears immediately if the syntax is invalid. Toggle flags (g, i, m, s) as needed." },
              { step:"2", title:"Paste your test string", desc:"Enter the text you want to match against in the test string area. Matching highlights appear in real time as you type." },
              { step:"3", title:"Use Match, Replace or Explain", desc:"Match mode shows highlighted results and a groups table. Replace mode shows the text after substitution using $1 or named group references. Explain breaks down every token." },
              { step:"4", title:"Load a pattern from the library", desc:"Open the Pattern Library to find ready-to-use regex patterns for emails, URLs, dates, phone numbers, hex colours, HTML tags and more." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#6C3AFF] flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div><div className="font-semibold text-white text-sm mb-1">{s.title}</div><div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
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

      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/about" className="hover:text-gray-400">About</Link>
          <Link href="/privacy" className="hover:text-gray-400">Privacy</Link>
          <Link href="/contact" className="hover:text-gray-400">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2025 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
