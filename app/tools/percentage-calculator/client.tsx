"use client";

import { useState } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

// ✅ Rule 10: all arrays declared at module scope — .map() calls below match
const RELATED_TOOLS = [
  { icon:"🎂", name:"Age Calculator",    slug:"age-calculator"    },
  { icon:"⚖️", name:"BMI Calculator",    slug:"bmi-calculator"    },
  { icon:"📏", name:"Unit Converter",    slug:"unit-converter"    },
  { icon:"🏦", name:"Loan Calculator",   slug:"loan-calculator"   },
  { icon:"📈", name:"Compound Interest", slug:"compound-interest-calculator" },
];

// ✅ Rule 8: FAQ now uses <details>/<summary> — openFaq useState removed
const FAQ = [
  { q:"How do I calculate percentage off (a discount)?",
    a:"Multiply the price by the remaining share: final price = price × (1 − discount ÷ 100). An $80 item at 25% off is 80 × 0.75 = $60. The calculator's subtract-a-percentage mode does this instantly." },
  { q:"What is the percent difference formula?",
    a:"Percent difference = |A − B| ÷ ((A + B) ÷ 2) × 100. It compares two values symmetrically — unlike percent change, it does not treat either number as the starting point." },
  { q:"How do I calculate what percentage one number is of another?",
    a:"Divide the part by the whole and multiply by 100. For example, 30 out of 150 = (30 ÷ 150) × 100 = 20%." },
  { q:"How do I find a percentage of a number?",
    a:"Multiply the number by the percentage divided by 100. For example, 15% of 200 = 200 × (15 ÷ 100) = 30." },
  { q:"What is percentage change?",
    a:"Percentage change measures how much a value has increased or decreased relative to its original value. Formula: ((New − Old) ÷ Old) × 100. A positive result is an increase, negative is a decrease." },
  { q:"What is percentage difference?",
    a:"Percentage difference compares two values without a defined 'before' and 'after'. Formula: |A − B| ÷ ((A + B) ÷ 2) × 100. Useful for comparing two equal measurements." },
  { q:"How do I reverse a percentage?",
    a:"To find the original value before a percentage was applied, divide the current value by (1 + percentage/100) for an increase, or (1 − percentage/100) for a decrease." },
];

type Mode = "percent_of" | "what_percent" | "percent_change" | "percent_diff" | "add_percent" | "subtract_percent";

// ✅ Rule 10: typed array declaration — regex handles `const X: Type[] = [`
const MODES: { id: Mode; label: string; desc: string }[] = [
  { id:"percent_of",       label:"% of a Number",    desc:"What is X% of Y?"              },
  { id:"what_percent",     label:"What % Is X of Y", desc:"X is what % of Y?"             },
  { id:"percent_change",   label:"% Change",          desc:"From X to Y — increase/decrease"},
  { id:"percent_diff",     label:"% Difference",      desc:"Difference between X and Y"    },
  { id:"add_percent",      label:"Add %",             desc:"Increase X by Y%"              },
  { id:"subtract_percent", label:"Subtract %",        desc:"Decrease X by Y%"              },
];

function calculate(mode: Mode, a: number, b: number): string {
  switch (mode) {
    case "percent_of":       return `${((b / 100) * a).toFixed(4).replace(/\.?0+$/, "")}`;
    case "what_percent":     return `${((a / b) * 100).toFixed(4).replace(/\.?0+$/, "")}%`;
    case "percent_change":   return `${(((b - a) / Math.abs(a)) * 100).toFixed(4).replace(/\.?0+$/, "")}%`;
    case "percent_diff":     return `${((Math.abs(a - b) / ((a + b) / 2)) * 100).toFixed(4).replace(/\.?0+$/, "")}%`;
    case "add_percent":      return `${(a * (1 + b / 100)).toFixed(4).replace(/\.?0+$/, "")}`;
    case "subtract_percent": return `${(a * (1 - b / 100)).toFixed(4).replace(/\.?0+$/, "")}`;
    default: return "—";
  }
}

function getLabel(mode: Mode): { a:string; b:string; result:string } {
  switch (mode) {
    case "percent_of":       return { a:"Percentage (%)",        b:"Number",              result:"Result"                };
    case "what_percent":     return { a:"Part",                  b:"Whole",               result:"Percentage"            };
    case "percent_change":   return { a:"Original Value",        b:"New Value",           result:"Percentage Change"     };
    case "percent_diff":     return { a:"Value A",               b:"Value B",             result:"Percentage Difference" };
    case "add_percent":      return { a:"Original Value",        b:"Percentage to Add",   result:"Result after Add"      };
    case "subtract_percent": return { a:"Original Value",        b:"Percentage to Remove",result:"Result after Remove"   };
  }
}

export default function PercentageCalculatorClient() {
  useTrackTool("percentage-calculator", "finance"); // ✅ Rule 3

  const [mode,         setMode]         = useState<Mode>("percent_of");
  const [a,            setA]            = useState("");
  const [b,            setB]            = useState("");
  const [result,       setResult]       = useState<string | null>(null);
  const [error,        setError]        = useState("");
  const [history,      setHistory]      = useState<{ expr:string; result:string }[]>([]);
  const [copiedResult, setCopiedResult] = useState(false); // ✅ UI: copy result
  // ✅ Rule 8: openFaq state REMOVED — FAQ now uses <details>/<summary>

  const labels = getLabel(mode);

  const handleCalc = () => {
    const na = parseFloat(a), nb = parseFloat(b);
    if (isNaN(na) || isNaN(nb)) { setError("Please enter valid numbers."); return; }
    if ((mode === "what_percent" || mode === "percent_change") && nb === 0) { setError("Cannot divide by zero."); return; }
    if (mode === "percent_diff" && (na + nb) === 0) { setError("Sum cannot be zero."); return; }
    setError("");
    const res = calculate(mode, na, nb);
    setResult(res);
    const expr = (() => {
      switch (mode) {
        case "percent_of":       return `${na}% of ${nb}`;
        case "what_percent":     return `${na} is what % of ${nb}`;
        case "percent_change":   return `% change from ${na} to ${nb}`;
        case "percent_diff":     return `% diff between ${na} and ${nb}`;
        case "add_percent":      return `${na} + ${nb}%`;
        case "subtract_percent": return `${na} − ${nb}%`;
      }
    })();
    setHistory(prev => [{ expr, result:res }, ...prev.slice(0,9)]);
  };

  // ✅ UI Enhancement: copy result to clipboard
  const copyResult = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    setCopiedResult(true);
    setTimeout(() => setCopiedResult(false), 2000);
  };

  const isIncrease = result && mode === "percent_change" && parseFloat(result) > 0;
  const isDecrease = result && mode === "percent_change" && parseFloat(result) < 0;

  return (
    // ✅ Rule 6: flex flex-col overflow-x-hidden
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      {/* ── Navbar — ✅ Rule 4: sticky + backdrop-blur + Go Pro ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">← All Tools</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      {/* ✅ Rule 7: flex-grow w-full on main */}
      <main className="max-w-7xl mx-auto px-4 py-10 flex-grow w-full">

        {/* ✅ Rule 11: aria-label + aria-hidden on › */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/finance" className="hover:text-gray-400">Finance Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Percentage Calculator</span>
        </nav>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🔢</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold">Percentage Calculator</h1>
              <p className="text-gray-500 mt-1">Calculate percent change, increase, decrease, difference and percentage off — 6 modes, instant results.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {["Free","No Login","6 Calculation Modes","History","Instant"].map(badge => (
              <span key={badge} className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-3 py-1 rounded-full font-medium">✓ {badge}</span>
            ))}
          </div>
        </div>

        {/* ✅ Rule 9: min-w-0 on BOTH grid children */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 min-w-0 flex flex-col gap-5">

            {/* Mode buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {MODES.map(m => (
                <button key={m.id} onClick={() => { setMode(m.id); setResult(null); setError(""); }}
                  className={`p-3 rounded-xl text-left transition-all border ${
                    mode===m.id
                      ? "bg-[#6C3AFF] border-[#6C3AFF] text-white shadow-lg shadow-violet-900/30"
                      : "bg-[#13131F] border-white/5 text-gray-400 hover:border-[#6C3AFF]/30 hover:text-white"
                  }`}>
                  <div className="text-xs font-extrabold">{m.label}</div>
                  <div className="text-[10px] mt-0.5 opacity-70">{m.desc}</div>
                </button>
              ))}
            </div>

            {/* Inputs */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[{ label:labels.a, value:a, set:setA }, { label:labels.b, value:b, set:setB }].map((f, i) => (
                  <div key={i}>
                    <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">{f.label}</label>
                    <input type="number" value={f.value} onChange={e => f.set(e.target.value)}
                      onKeyDown={e => e.key==="Enter" && handleCalc()}
                      placeholder="Enter number..."
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm" />
                  </div>
                ))}
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
              )}

              <button onClick={handleCalc}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] hover:opacity-90 text-white font-extrabold text-lg transition-all shadow-xl shadow-violet-900/30">
                = Calculate
              </button>

              {/* Result */}
              {result !== null && !error && (
                <div className={`rounded-2xl p-5 text-center border ${
                  isIncrease ? "bg-green-500/10 border-green-500/20" :
                  isDecrease ? "bg-red-500/10 border-red-500/20" :
                               "bg-[#6C3AFF]/10 border-[#6C3AFF]/20"
                }`}>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{labels.result}</div>
                  <div className={`text-5xl font-extrabold ${
                    isIncrease ? "text-green-400" : isDecrease ? "text-red-400" : "text-white"
                  }`}>
                    {isIncrease ? "↑ " : isDecrease ? "↓ " : ""}{result}
                  </div>
                  {mode === "percent_change" && (
                    <div className={`text-sm mt-2 ${isIncrease ? "text-green-400" : isDecrease ? "text-red-400" : "text-gray-400"}`}>
                      {isIncrease ? "Increase" : isDecrease ? "Decrease" : "No change"}
                    </div>
                  )}
                  {/* ✅ UI Enhancement: Copy result button */}
                  <button onClick={copyResult}
                    className={`mt-3 text-xs px-3 py-1.5 rounded-lg font-semibold transition-all ${
                      copiedResult ? "bg-green-600/30 text-green-400" : "bg-white/5 text-gray-500 hover:text-white hover:bg-white/10"
                    }`}>
                    {copiedResult ? "✓ Copied!" : "Copy result"}
                  </button>
                </div>
              )}
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-white">🕓 Calculation History</h3>
                  <button onClick={() => setHistory([])} className="text-xs text-gray-600 hover:text-red-400 transition-colors">Clear</button>
                </div>
                <div className="space-y-2">
                  {history.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-2 border-b border-white/5 last:border-0">
                      <span className="text-gray-400 min-w-0 truncate mr-3">{h.expr}</span>
                      <span className="text-[#6C3AFF] font-bold flex-shrink-0">{h.result}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — ✅ Rule 9: min-w-0 */}
          <div className="min-w-0 flex flex-col gap-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-4">📐 Quick Formulas</h3>
              <div className="space-y-3 text-xs">
                {[
                  { label:"% of number", formula:"(% ÷ 100) × number"       },
                  { label:"X is % of Y", formula:"(X ÷ Y) × 100"            },
                  { label:"% increase",  formula:"((New−Old) ÷ Old) × 100"  },
                  { label:"% decrease",  formula:"((Old−New) ÷ Old) × 100"  },
                  { label:"Add X%",      formula:"number × (1 + X/100)"      },
                  { label:"Remove X%",   formula:"number × (1 − X/100)"      },
                ].map(f => (
                  <div key={f.label} className="flex justify-between border-b border-white/5 pb-2 last:border-0 gap-2">
                    <span className="text-gray-500 flex-shrink-0">{f.label}</span>
                    <span className="text-[#6C3AFF] font-mono text-right">{f.formula}</span>
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
                    <span className="text-xl flex-shrink-0">{tool.icon}</span>
                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors min-w-0 truncate">{tool.name}</span>
                    <span className="ml-auto text-gray-700 group-hover:text-[#6C3AFF] transition-colors flex-shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* ✅ Pro CTA: <button> → <Link href="/pro"> */}
            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-2xl p-5 text-center">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-bold text-white text-sm mb-1">PursTech Pro</h3>
              <p className="text-gray-500 text-xs mb-4">Unlimited usage, zero ads, API access</p>
              <Link href="/pro"
                className="block w-full py-2.5 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-sm font-bold transition-all text-center">
                Get Pro — $7/mo
              </Link>
            </div>
          </div>
        </div>

        {/* How to Use */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">📖 How to Use the Percentage Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { step:"1", title:"Choose a Calculation Mode", desc:"Pick from 6 modes: find a percentage of a number, what percentage X is of Y, percentage change, difference, or add/subtract a percentage." },
              { step:"2", title:"Enter Your Numbers",        desc:"Type in the two values for your chosen mode. Press Enter or click Calculate for the instant result." },
              { step:"3", title:"See, Copy and Track",       desc:"Your answer appears instantly, colour-coded for increases (green) and decreases (red). Click Copy to copy the result. Last 10 calculations saved in history." },
            ].map(s => (
              <div key={s.step} className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#6C3AFF]/20 border border-[#6C3AFF]/30 flex items-center justify-center text-[#6C3AFF] font-black text-lg mb-4">{s.step}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ✅ Rule 8: FAQ now uses <details>/<summary> — openFaq useState removed */}
        {/* ✅ Rule 10: FAQ.map() matches const FAQ at module scope */}
        <section className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{item.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5">
                  <p className="text-gray-400 text-sm leading-relaxed">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
        </section>
      </main>

      {/* ✅ Rule 5: Privacy/Terms/Contact + © 2026 */}
      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. Free online tools for everyone.</p>
      </footer>
    </div>
  );
}
