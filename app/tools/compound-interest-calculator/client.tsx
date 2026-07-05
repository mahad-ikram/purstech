"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ ADDED

// ✅ SCHEMA removed — now server-rendered in page.tsx (WebApplication type)

// ── Related tools (finance category) ─────────────────────────────────────────
const RELATED_TOOLS = [
  { icon:"🏦", name:"Loan Calculator",       slug:"loan-calculator"       },
  { icon:"🏠", name:"Mortgage Calculator",   slug:"mortgage-calculator"   },
  { icon:"🔢", name:"Percentage Calculator", slug:"percentage-calculator" },
  { icon:"💱", name:"Currency Converter",    slug:"currency-converter"    },
  { icon:"🎂", name:"Age Calculator",        slug:"age-calculator"        },
];

const FAQ = [
  { q:"What is the compound interest formula?",
    a:"A = P(1 + r/n)^(nt), where P is your starting principal, r is the annual rate as a decimal, n is how many times interest compounds per year, and t is the number of years. When you add regular contributions, each deposit grows by the same formula for its remaining time — the calculator handles all of that instantly." },
  { q:"Is interest compounded daily better than monthly?",
    a:"Slightly, yes — at the same rate, compound interest calculated daily grows a little faster than monthly or yearly because interest starts earning interest sooner. Switch the compounding frequency here (daily, monthly, quarterly, semi-annually or annually) to see the exact difference on your numbers." },
  { q:"Can I use this as a savings account (HYSA) calculator?",
    a:"Yes — enter your balance as the principal, your APY as the rate, set compounding to daily or monthly (most high-yield savings accounts compound daily), and add your monthly deposit as a contribution. The growth chart shows exactly what your savings account will be worth." },
  { q:"What is the difference between simple and compound interest?",
    a:"Simple interest is calculated only on the original principal. Compound interest is calculated on the principal plus all previously earned interest — meaning your earnings generate their own earnings. This 'interest on interest' effect is why Albert Einstein allegedly called compound interest the eighth wonder of the world. Over long periods, the difference is enormous: $10,000 at 8% simple interest for 30 years grows to $34,000; with compound interest it grows to over $100,000." },
  { q:"How does compounding frequency affect my returns?",
    a:"More frequent compounding means slightly higher returns, because each compounding period, your interest is added to the principal and begins earning its own interest sooner. Daily compounding vs annual compounding on $10,000 at 10% for 10 years: annual gives $25,937; daily gives $27,179 — about 5% more. The difference between monthly and daily is minimal for most investors. What matters far more is the interest rate and how long you stay invested." },
  { q:"What are regular contributions and why do they matter?",
    a:"Regular contributions are periodic additions to your investment — for example, investing $500 every month into an index fund. They matter enormously because they continuously add to the principal that earns compound returns. Our calculator shows the dramatic difference: $10,000 invested once at 8% for 30 years grows to $100,626. The same $10,000 plus $200/month at 8% for 30 years grows to $370,422 — nearly 4× more, from just $200 extra per month." },
  { q:"What is CAGR and how is it calculated?",
    a:"CAGR (Compound Annual Growth Rate) is the rate at which an investment grows from its initial value to its final value, as if it grew at a steady rate every year. Formula: CAGR = (End Value / Start Value)^(1/Years) - 1. CAGR is useful for comparing investments of different lengths or with irregular returns. An investment that grew from $1,000 to $3,000 in 10 years has a CAGR of 11.6%, meaning it effectively grew 11.6% per year on average." },
  { q:"How does inflation affect the real value of compound interest returns?",
    a:"Inflation erodes the purchasing power of your future returns. If your investment earns 8% annually but inflation runs at 3%, your real return is approximately 5% (known as the real rate of return). Our inflation-adjusted calculation shows you the true purchasing power of your future wealth in today's dollars. For long-term planning, real returns matter more than nominal returns — a 10% return in a 9% inflation environment barely keeps pace with rising prices." },
];

const COMPOUND_FREQS = [
  { label:"Annually",      n:1   },
  { label:"Semi-annually", n:2   },
  { label:"Quarterly",     n:4   },
  { label:"Monthly",       n:12  },
  { label:"Weekly",        n:52  },
  { label:"Daily",         n:365 },
];

const CONTRIB_FREQS = [
  { label:"Monthly",   n:12 },
  { label:"Quarterly", n:4  },
  { label:"Annually",  n:1  },
  { label:"None",      n:0  },
];

const fmt    = (n: number) => new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:0 }).format(n);
const fmtPct = (n: number) => `${n.toFixed(2)}%`;

interface YearRow { year: number; balance: number; totalContrib: number; totalInterest: number; }

function calcCompound(
  principal: number, rate: number, years: number,
  compFreq: number, contribAmt: number, contribFreq: number, inflation: number
) {
  if (!principal && !contribAmt) return null;
  const r = rate / 100, inf = inflation / 100;
  const rows: YearRow[] = [];
  let balance = principal, totalContrib = principal;

  for (let y = 1; y <= years; y++) {
    balance = balance * Math.pow(1 + r / compFreq, compFreq);
    if (contribFreq > 0 && contribAmt > 0) {
      const rPeriod = r / contribFreq, nPeriods = contribFreq;
      const fvContrib = rPeriod === 0
        ? contribAmt * nPeriods
        : contribAmt * ((Math.pow(1 + rPeriod, nPeriods) - 1) / rPeriod) * (1 + rPeriod);
      balance += fvContrib;
      totalContrib = principal + contribAmt * (contribFreq === 12 ? y * 12 : contribFreq === 4 ? y * 4 : y);
    }
    rows.push({ year: y, balance, totalContrib, totalInterest: balance - totalContrib });
  }

  const finalBalance  = balance;
  const finalInterest = finalBalance - totalContrib;
  const realBalance   = finalBalance / Math.pow(1 + inf, years);
  const cagr          = years > 0 ? (Math.pow(finalBalance / Math.max(principal, 1), 1 / years) - 1) * 100 : 0;

  return { finalBalance, totalContrib, finalInterest, realBalance, cagr, rows };
}

export default function CompoundInterestClient() {
  // ✅ Track usage in Supabase → admin dashboard
  useTrackTool("compound-interest-calculator", "finance");

  const [principal,       setPrincipal]       = useState("10000");
  const [rate,            setRate]            = useState("8");
  const [years,           setYears]           = useState("20");
  const [compFreqIdx,     setCompFreqIdx]     = useState(3); // monthly
  const [contribFreqIdx,  setContribFreqIdx]  = useState(0); // monthly
  const [contrib,         setContrib]         = useState("200");
  const [inflation,       setInflation]       = useState("3");
  const [showInflation,   setShowInflation]   = useState(false);
  const [showTable,       setShowTable]       = useState(false);

  const compFreq = COMPOUND_FREQS[compFreqIdx].n;
  const contribF = CONTRIB_FREQS[contribFreqIdx].n;

  const result = useMemo(() =>
    calcCompound(+principal, +rate, +years, compFreq, +contrib, contribF, +inflation),
    [principal, rate, years, compFreq, contrib, contribF, inflation]
  );

  const chartRows = result?.rows.slice(0, +years) ?? [];
  const maxVal    = Math.max(...chartRows.map(r => r.balance), 1);
  const chartH    = 200, chartW = 600;
  const barW      = Math.max(2, (chartW - 40) / Math.max(chartRows.length, 1) - 2);

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

        {/* ── Breadcrumb — fixed: aria-label + /categories/finance ── */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/finance" className="hover:text-gray-400">Finance Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Compound Interest Calculator</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">
            Finance Tools
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Compound Interest Calculator — Investment &amp; Savings Growth
          </h1>
          <p className="text-gray-400 max-w-2xl">
            See how your money grows with compound interest and regular contributions. Choose compounding frequency, see year-by-year growth and inflation-adjusted real returns.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* ── Inputs ── */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-white text-sm">Investment Details</h3>
              {[
                { label:"Initial Principal",    value:principal, setter:setPrincipal, pre:"$"     },
                { label:"Annual Interest Rate", value:rate,      setter:setRate,      suf:"%"     },
                { label:"Investment Period",    value:years,     setter:setYears,     suf:"years" },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">{f.label}</label>
                  <div className="flex">
                    {f.pre && <span className="px-3 py-2.5 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm">{f.pre}</span>}
                    <input value={f.value} onChange={e => f.setter(e.target.value)} type="number" min="0"
                      className={`flex-1 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all ${f.pre ? "" : "rounded-l-xl"} ${f.suf ? "" : "rounded-r-xl"}`} />
                    {f.suf && <span className="px-3 py-2.5 bg-[#0A0A14] border border-l-0 border-white/10 rounded-r-xl text-gray-400 text-sm">{f.suf}</span>}
                  </div>
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Compounding Frequency</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {COMPOUND_FREQS.map((f, i) => (
                    <button key={f.label} onClick={() => setCompFreqIdx(i)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all border ${compFreqIdx===i ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"}`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-white text-sm">Regular Contributions</h3>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-2">Contribution Frequency</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {CONTRIB_FREQS.map((f, i) => (
                    <button key={f.label} onClick={() => setContribFreqIdx(i)}
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all border ${contribFreqIdx===i ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"}`}>
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
              {contribF > 0 && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Amount per period</label>
                  <div className="flex">
                    <span className="px-3 py-2.5 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm">$</span>
                    <input value={contrib} onChange={e => setContrib(e.target.value)} type="number" min="0"
                      className="flex-1 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all rounded-r-xl" />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4">
              <button onClick={() => setShowInflation(p => !p)}
                className="w-full flex items-center justify-between text-sm font-bold text-white">
                <span>Inflation Adjustment</span>
                <span className={`text-[#6C3AFF] transition-transform ${showInflation ? "rotate-45" : ""}`}>+</span>
              </button>
              {showInflation && (
                <div className="mt-3">
                  <label className="block text-xs text-gray-400 mb-1">Inflation Rate</label>
                  <div className="flex">
                    <input value={inflation} onChange={e => setInflation(e.target.value)} type="number" min="0" step="0.1"
                      className="flex-1 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 rounded-l-xl transition-all" />
                    <span className="px-3 py-2.5 bg-[#0A0A14] border border-l-0 border-white/10 rounded-r-xl text-gray-400 text-sm">%</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Results ── */}
          <div className="lg:col-span-3 space-y-4">
            {result && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label:"Future Value",            value:fmt(result.finalBalance),  color:"text-green-400",   big:true  },
                    { label:"Total Interest",          value:fmt(result.finalInterest), color:"text-[#6C3AFF]",   big:true  },
                    { label:"Total Contributed",       value:fmt(result.totalContrib),  color:"text-white"                  },
                    { label:"CAGR",                    value:fmtPct(result.cagr),       color:"text-cyan-400"               },
                    ...(showInflation ? [{ label:"Real Value (today's $)", value:fmt(result.realBalance), color:"text-yellow-400" }] : []),
                  ].map(s => (
                    <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-4 text-center">
                      <div className={`font-extrabold ${(s as {big?:boolean}).big ? "text-2xl" : "text-lg"} ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* ✅ UI Enhancement 2: Milestone callout — interest exceeds contributions */}
                {result.finalInterest >= result.totalContrib && (
                  <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl px-5 py-3">
                    <span className="text-2xl">🎉</span>
                    <div>
                      <div className="text-green-400 font-bold text-sm">Your interest exceeds your contributions!</div>
                      <div className="text-gray-500 text-xs mt-0.5">
                        Your money is now working harder than you — {fmt(result.finalInterest)} in interest vs {fmt(result.totalContrib)} invested.
                      </div>
                    </div>
                  </div>
                )}

                {/* Breakdown bar */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Wealth Breakdown</h3>
                  <div className="flex h-5 rounded-full overflow-hidden mb-2">
                    <div className="bg-[#6C3AFF]" style={{ width:`${(result.totalContrib/result.finalBalance)*100}%` }} />
                    <div className="bg-green-500 flex-1" />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span><span className="inline-block w-2 h-2 rounded-full bg-[#6C3AFF] mr-1" />Contributions {fmt(result.totalContrib)}</span>
                    <span><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1" />Interest earned {fmt(result.finalInterest)}</span>
                  </div>
                </div>

                {/* SVG Growth Chart */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Growth Over Time</h3>
                  <div className="overflow-x-auto">
                    <svg viewBox={`0 0 ${chartW} ${chartH + 30}`} className="w-full" style={{ minWidth:300 }}>
                      {chartRows.map((row, i) => {
                        const x        = 30 + i * (barW + 2);
                        const contribH = Math.max(2, (row.totalContrib / maxVal) * chartH);
                        const totalH   = Math.max(2, (row.balance    / maxVal) * chartH);
                        return (
                          <g key={row.year}>
                            <rect x={x} y={chartH - contribH} width={barW} height={contribH}          fill="#6C3AFF" opacity={0.7} rx={1} />
                            <rect x={x} y={chartH - totalH}   width={barW} height={totalH - contribH} fill="#00C853" opacity={0.8} rx={1} />
                          </g>
                        );
                      })}
                      {[0, 0.25, 0.5, 0.75, 1].map(f => (
                        <text key={f} x={25} y={chartH - f * chartH + 4} fontSize={8} fill="#666" textAnchor="end">
                          {fmt(maxVal * f)}
                        </text>
                      ))}
                      {chartRows.filter(r => r.year % 5 === 0).map(r => (
                        <text key={r.year} x={30 + (r.year - 1) * (barW + 2) + barW / 2} y={chartH + 16} fontSize={8} fill="#666" textAnchor="middle">
                          Y{r.year}
                        </text>
                      ))}
                    </svg>
                  </div>
                  <div className="flex gap-4 text-xs mt-2 justify-center">
                    <span><span className="inline-block w-3 h-2 bg-[#6C3AFF] opacity-70 mr-1 rounded" />Contributions</span>
                    <span><span className="inline-block w-3 h-2 bg-green-500 opacity-80 mr-1 rounded" />Interest</span>
                  </div>
                </div>

                {/* Year-by-year table */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <button onClick={() => setShowTable(p => !p)} className="w-full flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Year-by-Year Breakdown</span>
                    <span className={`text-[#6C3AFF] text-xl transition-transform ${showTable ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {showTable && (
                    <div className="mt-4 overflow-x-auto max-h-72 overflow-y-auto">
                      <table className="w-full text-xs">
                        <thead className="sticky top-0 bg-[#13131F]">
                          <tr className="text-gray-500 border-b border-white/5">
                            <th className="text-left py-2">Year</th>
                            <th className="text-right py-2">Balance</th>
                            <th className="text-right py-2">Contributions</th>
                            <th className="text-right py-2">Interest</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.rows.map(row => (
                            <tr key={row.year} className="border-b border-white/5 hover:bg-white/[0.02]">
                              <td className="py-2 text-gray-400">Year {row.year}</td>
                              <td className="py-2 text-right text-green-400 font-semibold">{fmt(row.balance)}</td>
                              <td className="py-2 text-right text-[#6C3AFF]">{fmt(row.totalContrib)}</td>
                              <td className="py-2 text-right text-gray-300">{fmt(row.totalInterest)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* ✅ UI Enhancement 1: Financial disclaimer */}
                <div className="flex items-start gap-3 bg-yellow-400/5 border border-yellow-400/15 rounded-xl px-4 py-3">
                  <span className="text-yellow-400 flex-shrink-0 mt-0.5">⚠️</span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    For educational purposes only. Actual investment returns vary and are not guaranteed. Past performance does not predict future results. Consult a qualified financial advisor before making investment decisions.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── How to Use ── */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Compound Interest Calculator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Set your principal & rate",    desc:"Enter your starting investment amount, the expected annual interest rate and your investment timeframe in years." },
              { step:"2", title:"Choose compounding frequency", desc:"Select how often interest compounds — from annually to daily. More frequent compounding slightly increases returns." },
              { step:"3", title:"Add regular contributions",    desc:"Enter a monthly, quarterly or annual contribution to see how regular investing dramatically accelerates growth." },
              { step:"4", title:"Enable inflation adjustment",  desc:"Toggle inflation to see the real purchasing power of your future balance in today's dollars — important for retirement planning." },
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
          <h2 className="text-xl font-extrabold text-white mb-2">🔧 Related Finance Tools</h2>
          <p className="text-gray-500 text-sm mb-6">More free finance calculators — no login required</p>
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
