"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Compound Interest Calculator",
  description: "Free compound interest calculator with regular contributions, multiple compounding frequencies and year-by-year growth breakdown.",
  url: "https://purstech.com/tools/compound-interest-calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const FAQ = [
  {
    q: "What is the difference between simple and compound interest?",
    a: "Simple interest is calculated only on the original principal. Compound interest is calculated on the principal plus all previously earned interest — meaning your earnings generate their own earnings. This 'interest on interest' effect is why Albert Einstein allegedly called compound interest the eighth wonder of the world. Over long periods, the difference is enormous: $10,000 at 8% simple interest for 30 years grows to $34,000; with compound interest it grows to over $100,000.",
  },
  {
    q: "How does compounding frequency affect my returns?",
    a: "More frequent compounding means slightly higher returns, because each compounding period, your interest is added to the principal and begins earning its own interest sooner. Daily compounding vs annual compounding on $10,000 at 10% for 10 years: annual gives $25,937; daily gives $27,179 — about 5% more. The difference between monthly and daily is minimal for most investors. What matters far more is the interest rate and how long you stay invested.",
  },
  {
    q: "What are regular contributions and why do they matter?",
    a: "Regular contributions are periodic additions to your investment — for example, investing $500 every month into an index fund. They matter enormously because they continuously add to the principal that earns compound returns. Our calculator shows the dramatic difference: $10,000 invested once at 8% for 30 years grows to $100,626. The same $10,000 plus $200/month at 8% for 30 years grows to $370,422 — nearly 4× more, from just $200 extra per month.",
  },
  {
    q: "What is CAGR and how is it calculated?",
    a: "CAGR (Compound Annual Growth Rate) is the rate at which an investment grows from its initial value to its final value, as if it grew at a steady rate every year. Formula: CAGR = (End Value / Start Value)^(1/Years) - 1. CAGR is useful for comparing investments of different lengths or with irregular returns. An investment that grew from $1,000 to $3,000 in 10 years has a CAGR of 11.6%, meaning it effectively grew 11.6% per year on average.",
  },
  {
    q: "How does inflation affect the real value of compound interest returns?",
    a: "Inflation erodes the purchasing power of your future returns. If your investment earns 8% annually but inflation runs at 3%, your real return is approximately 5% (known as the real rate of return). Our inflation-adjusted calculation shows you the true purchasing power of your future wealth in today's dollars. For long-term planning, real returns matter more than nominal returns — a 10% return in a 9% inflation environment barely keeps pace with rising prices.",
  },
];

const COMPOUND_FREQS = [
  { label: "Annually",    n: 1   },
  { label: "Semi-annually", n: 2 },
  { label: "Quarterly",   n: 4   },
  { label: "Monthly",     n: 12  },
  { label: "Weekly",      n: 52  },
  { label: "Daily",       n: 365 },
];

const CONTRIB_FREQS = [
  { label: "Monthly",   n: 12  },
  { label: "Quarterly", n: 4   },
  { label: "Annually",  n: 1   },
  { label: "None",      n: 0   },
];

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

const fmtPct = (n: number) => `${n.toFixed(2)}%`;

interface YearRow { year: number; balance: number; totalContrib: number; totalInterest: number; }

function calcCompound(
  principal: number, rate: number, years: number,
  compFreq: number, contribAmt: number, contribFreq: number, inflation: number
) {
  if (!principal && !contribAmt) return null;
  const r = rate / 100;
  const inf = inflation / 100;
  const rows: YearRow[] = [];
  let balance = principal;
  let totalContrib = principal;

  for (let y = 1; y <= years; y++) {
    // Compound interest for the year
    balance = balance * Math.pow(1 + r / compFreq, compFreq);
    // Add contributions
    if (contribFreq > 0 && contribAmt > 0) {
      // FV of an annuity for this year
      const rPeriod = r / contribFreq;
      const nPeriods = contribFreq;
      const fvContrib = rPeriod === 0
        ? contribAmt * nPeriods
        : contribAmt * ((Math.pow(1 + rPeriod, nPeriods) - 1) / rPeriod) * (1 + rPeriod);
      balance += fvContrib;
      totalContrib += contribAmt * (contribFreq / (12 / (12 / contribFreq === 0 ? 1 : 12 / contribFreq)));
      // Simpler: just add contributions * freq
      totalContrib = principal + contribAmt * (contribFreq === 12 ? y * 12 : contribFreq === 4 ? y * 4 : y);
    }
    rows.push({ year: y, balance, totalContrib, totalInterest: balance - totalContrib });
  }

  const finalBalance = balance;
  const finalInterest = finalBalance - totalContrib;
  const realBalance = finalBalance / Math.pow(1 + inf, years);
  const cagr = years > 0 ? (Math.pow(finalBalance / principal, 1 / years) - 1) * 100 : 0;

  return { finalBalance, totalContrib, finalInterest, realBalance, cagr, rows };
}

export default function CompoundInterestClient() {
  const [principal,    setPrincipal]    = useState("10000");
  const [rate,         setRate]         = useState("8");
  const [years,        setYears]        = useState("20");
  const [compFreqIdx,  setCompFreqIdx]  = useState(3); // monthly
  const [contribFreqIdx, setContribFreqIdx] = useState(0); // monthly
  const [contrib,      setContrib]      = useState("200");
  const [inflation,    setInflation]    = useState("3");
  const [showInflation,setShowInflation]= useState(false);
  const [showTable,    setShowTable]    = useState(false);

  const compFreq  = COMPOUND_FREQS[compFreqIdx].n;
  const contribF  = CONTRIB_FREQS[contribFreqIdx].n;

  const result = useMemo(() =>
    calcCompound(+principal, +rate, +years, compFreq, +contrib, contribF, +inflation),
    [principal, rate, years, compFreq, contrib, contribF, inflation]
  );

  // SVG chart
  const chartRows = result?.rows.slice(0, +years) ?? [];
  const maxVal    = Math.max(...chartRows.map(r => r.balance), 1);
  const chartH    = 200;
  const chartW    = 600;
  const barW      = Math.max(2, (chartW - 40) / chartRows.length - 2);

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span>›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span>›</span>
          <span className="text-gray-400">Compound Interest Calculator</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Finance Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Compound Interest Calculator — With Contributions &amp; Growth Chart
          </h1>
          <p className="text-gray-400 max-w-2xl">See how your money grows with compound interest and regular contributions. Choose compounding frequency, see year-by-year growth and inflation-adjusted real returns.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-white text-sm">Investment Details</h3>

              {[
                { label: "Initial Principal", value: principal, setter: setPrincipal, pre: "$" },
                { label: "Annual Interest Rate", value: rate, setter: setRate, suf: "%" },
                { label: "Investment Period", value: years, setter: setYears, suf: "years" },
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
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all border ${compFreqIdx === i ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"}`}>
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
                      className={`py-1.5 rounded-lg text-xs font-semibold transition-all border ${contribFreqIdx === i ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#0A0A14] border-white/10 text-gray-400 hover:text-white"}`}>
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

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {result && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Future Value",       value: fmt(result.finalBalance),  color: "text-green-400", big: true },
                    { label: "Total Interest",     value: fmt(result.finalInterest), color: "text-[#6C3AFF]", big: true },
                    { label: "Total Contributed",  value: fmt(result.totalContrib),  color: "text-white" },
                    { label: `CAGR`,               value: fmtPct(result.cagr),       color: "text-cyan-400" },
                    ...(showInflation ? [{ label: `Real Value (today's $)`, value: fmt(result.realBalance), color: "text-yellow-400" }] : []),
                  ].map(s => (
                    <div key={s.label} className={`bg-[#13131F] border border-white/5 rounded-2xl p-4 text-center ${s.big ? "" : ""}`}>
                      <div className={`font-extrabold ${(s as { big?: boolean }).big ? "text-2xl" : "text-lg"} ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Breakdown bar */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Wealth Breakdown</h3>
                  <div className="flex h-5 rounded-full overflow-hidden mb-2">
                    <div className="bg-[#6C3AFF]" style={{ width: `${(result.totalContrib / result.finalBalance) * 100}%` }} />
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
                    <svg viewBox={`0 0 ${chartW} ${chartH + 30}`} className="w-full" style={{ minWidth: 300 }}>
                      {chartRows.map((row, i) => {
                        const x = 30 + i * (barW + 2);
                        const contribH = Math.max(2, (row.totalContrib / maxVal) * chartH);
                        const totalH   = Math.max(2, (row.balance / maxVal) * chartH);
                        return (
                          <g key={row.year}>
                            {/* Contribution bar */}
                            <rect x={x} y={chartH - contribH} width={barW} height={contribH} fill="#6C3AFF" opacity={0.7} rx={1} />
                            {/* Interest stacked */}
                            <rect x={x} y={chartH - totalH} width={barW} height={totalH - contribH} fill="#00C853" opacity={0.8} rx={1} />
                          </g>
                        );
                      })}
                      {/* Y axis labels */}
                      {[0, 0.25, 0.5, 0.75, 1].map(f => (
                        <text key={f} x={25} y={chartH - f * chartH + 4} fontSize={8} fill="#666" textAnchor="end">
                          {fmt(maxVal * f)}
                        </text>
                      ))}
                      {/* X axis year labels — every 5 years */}
                      {chartRows.filter(r => r.year % 5 === 0).map(r => {
                        const i = r.year - 1;
                        return (
                          <text key={r.year} x={30 + i * (barW + 2) + barW / 2} y={chartH + 16} fontSize={8} fill="#666" textAnchor="middle">
                            Y{r.year}
                          </text>
                        );
                      })}
                    </svg>
                  </div>
                  <div className="flex gap-4 text-xs mt-2 justify-center">
                    <span><span className="inline-block w-3 h-2 bg-[#6C3AFF] opacity-70 mr-1 rounded" />Contributions</span>
                    <span><span className="inline-block w-3 h-2 bg-green-500 opacity-80 mr-1 rounded" />Interest</span>
                  </div>
                </div>

                {/* Year-by-year table */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <button onClick={() => setShowTable(p => !p)}
                    className="w-full flex items-center justify-between">
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
              </>
            )}
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Compound Interest Calculator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Set your principal & rate", desc:"Enter your starting investment amount, the expected annual interest rate and your investment timeframe in years." },
              { step:"2", title:"Choose compounding frequency", desc:"Select how often interest compounds — from annually to daily. More frequent compounding slightly increases returns." },
              { step:"3", title:"Add regular contributions", desc:"Enter a monthly, quarterly or annual contribution to see how regular investing dramatically accelerates growth." },
              { step:"4", title:"Enable inflation adjustment", desc:"Toggle inflation to see the real purchasing power of your future balance in today's dollars — important for retirement planning." },
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
