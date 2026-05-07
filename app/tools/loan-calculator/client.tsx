"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

// ── JSON-LD ────────────────────────────────────────────────────────────────────
const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Loan Calculator",
  description: "Free loan calculator with amortization schedule, extra payment simulator and loan comparison.",
  url: "https://purstech.com/tools/loan-calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const FAQ = [
  {
    q: "How is my monthly loan payment calculated?",
    a: "Monthly loan payment is calculated using the standard amortization formula: M = P × [r(1+r)^n] / [(1+r)^n - 1], where P is the principal, r is the monthly interest rate (annual rate ÷ 12), and n is the number of payments. This formula ensures each payment covers the interest due that month plus a portion of the principal, with the split shifting toward more principal over time.",
  },
  {
    q: "What is an amortization schedule?",
    a: "An amortization schedule is a complete table showing every payment over the life of your loan, broken down into principal and interest portions. Early payments are mostly interest — for example, on a 30-year mortgage, over 70% of your first payment goes to interest. Over time the balance shifts, and your final payments are nearly all principal. Our calculator generates the full schedule showing every monthly payment.",
  },
  {
    q: "How much can extra payments save me?",
    a: "Extra payments can dramatically reduce the total interest you pay and shorten your loan term. On a $30,000 car loan at 7% over 60 months, paying an extra $100/month saves about $1,200 in interest and pays off the loan 11 months early. The earlier in the loan term you make extra payments, the more you save — because you reduce the principal that future interest is calculated on.",
  },
  {
    q: "What is the difference between APR and interest rate?",
    a: "The interest rate is the base cost of borrowing expressed as a percentage. APR (Annual Percentage Rate) includes the interest rate plus additional fees (origination fees, points, mortgage insurance) expressed as a yearly rate. APR is always equal to or higher than the interest rate. When comparing loans, always compare APRs — two loans with the same interest rate can have very different APRs if one has higher fees.",
  },
  {
    q: "Should I choose a shorter or longer loan term?",
    a: "A shorter term means higher monthly payments but dramatically less total interest paid. A longer term means lower monthly payments but significantly more interest over the life of the loan. For example, a $20,000 loan at 6%: over 36 months you pay about $1,850 total interest; over 72 months you pay about $3,760. Use our loan comparison feature to see the trade-off side by side.",
  },
];

interface AmortRow { month: number; payment: number; principal: number; interest: number; balance: number; }

function calcLoan(principal: number, annualRate: number, months: number, extra: number) {
  if (!principal || !annualRate || !months) return null;
  const r = annualRate / 100 / 12;
  const basePayment = r === 0
    ? principal / months
    : (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);

  const schedule: AmortRow[] = [];
  let balance = principal;
  let totalInterest = 0;

  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    const principalPart = Math.min(balance, basePayment + extra - interest);
    const payment = interest + principalPart;
    balance = Math.max(0, balance - principalPart);
    totalInterest += interest;
    schedule.push({ month: m, payment, principal: principalPart, interest, balance });
    if (balance === 0) break;
  }

  return {
    monthlyPayment: basePayment,
    totalPayment: basePayment * schedule.length + extra * schedule.length,
    totalInterest,
    schedule,
    actualMonths: schedule.length,
  };
}

const fmt = (n: number, d = 2) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: d }).format(n);

export default function LoanCalculatorClient() {
  const [amount,    setAmount]    = useState("25000");
  const [rate,      setRate]      = useState("7.5");
  const [years,     setYears]     = useState("5");
  const [extra,     setExtra]     = useState("0");
  const [compare,   setCompare]   = useState(false);
  const [amount2,   setAmount2]   = useState("25000");
  const [rate2,     setRate2]     = useState("6.5");
  const [years2,    setYears2]    = useState("5");
  const [showAmort, setShowAmort] = useState(false);
  const [showRows,  setShowRows]  = useState(24);

  const result  = useMemo(() => calcLoan(+amount, +rate, +years * 12, +extra), [amount, rate, years, extra]);
  const result2 = useMemo(() => calcLoan(+amount2, +rate2, +years2 * 12, 0), [amount2, rate2, years2]);
  const base    = useMemo(() => calcLoan(+amount, +rate, +years * 12, 0), [amount, rate, years]);

  const extraSavings = base && result ? {
    interest: base.totalInterest - result.totalInterest,
    months:   base.actualMonths - result.actualMonths,
  } : null;

  const pctInterest = result ? (result.totalInterest / (result.totalInterest + +amount)) * 100 : 0;

  // Start date for payoff
  const payoffDate = result ? (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + result.actualMonths);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  })() : "";

  const InputField = ({ label, value, onChange, prefix = "", suffix = "" }: {
    label: string; value: string; onChange: (v: string) => void; prefix?: string; suffix?: string;
  }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1">{label}</label>
      <div className="flex items-center gap-0">
        {prefix && <span className="px-3 py-2.5 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm">{prefix}</span>}
        <input value={value} onChange={e => onChange(e.target.value)} type="number" min="0"
          className={`flex-1 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all
            ${prefix ? "" : "rounded-l-xl"} ${suffix ? "" : "rounded-r-xl"}`} />
        {suffix && <span className="px-3 py-2.5 bg-[#0A0A14] border border-l-0 border-white/10 rounded-r-xl text-gray-400 text-sm">{suffix}</span>}
      </div>
    </div>
  );

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
          <span className="text-gray-400">Loan Calculator</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Finance Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Loan Calculator — Monthly Payment &amp; Amortization Schedule
          </h1>
          <p className="text-gray-400 max-w-2xl">Calculate your exact monthly payment, total interest, and full amortization schedule. Simulate extra payments and compare two loan options side by side.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-white text-sm">Loan Details</h3>
              <InputField label="Loan Amount" value={amount} onChange={setAmount} prefix="$" />
              <InputField label="Annual Interest Rate" value={rate} onChange={setRate} suffix="%" />
              <InputField label="Loan Term" value={years} onChange={setYears} suffix="years" />
            </div>
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-3">
              <h3 className="font-bold text-white text-sm">Extra Monthly Payment</h3>
              <InputField label="Extra payment per month" value={extra} onChange={setExtra} prefix="$" />
              {extraSavings && +extra > 0 && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 space-y-1 text-xs">
                  <div className="text-green-400 font-bold">Extra payment impact:</div>
                  <div className="text-gray-300">Interest saved: <strong className="text-green-400">{fmt(extraSavings.interest)}</strong></div>
                  <div className="text-gray-300">Loan shortened by: <strong className="text-green-400">{extraSavings.months} months</strong></div>
                  <div className="text-gray-300">New payoff: <strong className="text-white">{payoffDate}</strong></div>
                </div>
              )}
            </div>
            <button onClick={() => setCompare(p => !p)}
              className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all border ${compare ? "bg-[#6C3AFF] text-white border-transparent" : "bg-[#13131F] border-white/10 text-gray-400 hover:text-white"}`}>
              {compare ? "✓ Comparing Two Loans" : "⇔ Compare Two Loans"}
            </button>
            {compare && (
              <div className="bg-[#13131F] border border-[#6C3AFF]/20 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-[#6C3AFF] text-sm">Loan B</h3>
                <InputField label="Loan Amount" value={amount2} onChange={setAmount2} prefix="$" />
                <InputField label="Annual Interest Rate" value={rate2} onChange={setRate2} suffix="%" />
                <InputField label="Loan Term" value={years2} onChange={setYears2} suffix="years" />
              </div>
            )}
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {result && (
              <>
                {/* Main results */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Monthly Payment", value: fmt(result.monthlyPayment), color: "text-[#6C3AFF]", big: true },
                    { label: "Total Interest", value: fmt(result.totalInterest), color: "text-[#FF3A6C]", big: true },
                    { label: "Total Cost",      value: fmt(result.totalInterest + +amount), color: "text-white", big: false },
                    { label: "Payoff Date",     value: payoffDate, color: "text-cyan-400", big: false },
                  ].map(s => (
                    <div key={s.label} className="bg-[#13131F] border border-white/5 rounded-2xl p-4 text-center">
                      <div className={`font-extrabold ${s.big ? "text-2xl" : "text-base"} ${s.color}`}>{s.value}</div>
                      <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Principal vs Interest bar */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Cost Breakdown</h3>
                  <div className="flex h-5 rounded-full overflow-hidden mb-2">
                    <div className="bg-[#6C3AFF] transition-all" style={{ width: `${100 - pctInterest}%` }} />
                    <div className="bg-[#FF3A6C] transition-all flex-1" />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400">
                    <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#6C3AFF] mr-1" />Principal {fmt(+amount)} ({(100 - pctInterest).toFixed(0)}%)</span>
                    <span><span className="inline-block w-2.5 h-2.5 rounded-full bg-[#FF3A6C] mr-1" />Interest {fmt(result.totalInterest)} ({pctInterest.toFixed(0)}%)</span>
                  </div>
                </div>

                {/* Comparison */}
                {compare && result2 && (
                  <div className="bg-[#13131F] border border-[#6C3AFF]/20 rounded-2xl p-5">
                    <h3 className="text-sm font-bold text-white mb-4">Loan A vs Loan B Comparison</h3>
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-xs text-gray-500 border-b border-white/5">
                          <th className="text-left py-2"></th>
                          <th className="text-right py-2 text-[#6C3AFF]">Loan A</th>
                          <th className="text-right py-2 text-cyan-400">Loan B</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Monthly Payment", fmt(result.monthlyPayment), fmt(result2.monthlyPayment)],
                          ["Total Interest",  fmt(result.totalInterest),  fmt(result2.totalInterest)],
                          ["Total Cost",      fmt(result.totalInterest + +amount), fmt(result2.totalInterest + +amount2)],
                          ["Payoff",          `${result.actualMonths} months`,    `${result2.actualMonths} months`],
                        ].map(([label, a, b]) => (
                          <tr key={String(label)} className="border-b border-white/5">
                            <td className="py-2.5 text-gray-400">{label}</td>
                            <td className="py-2.5 text-right font-semibold text-[#6C3AFF]">{a}</td>
                            <td className="py-2.5 text-right font-semibold text-cyan-400">{b}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Amortization */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <button onClick={() => setShowAmort(p => !p)}
                    className="w-full flex items-center justify-between">
                    <span className="font-bold text-white text-sm">Full Amortization Schedule ({result.actualMonths} payments)</span>
                    <span className={`text-[#6C3AFF] text-xl transition-transform ${showAmort ? "rotate-45" : ""}`}>+</span>
                  </button>
                  {showAmort && (
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="text-gray-500 border-b border-white/5">
                            <th className="text-left py-2">Month</th>
                            <th className="text-right py-2">Payment</th>
                            <th className="text-right py-2">Principal</th>
                            <th className="text-right py-2">Interest</th>
                            <th className="text-right py-2">Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.schedule.slice(0, showRows).map(row => (
                            <tr key={row.month} className="border-b border-white/5 hover:bg-white/[0.02]">
                              <td className="py-2 text-gray-500">{row.month}</td>
                              <td className="py-2 text-right text-white">{fmt(row.payment)}</td>
                              <td className="py-2 text-right text-green-400">{fmt(row.principal)}</td>
                              <td className="py-2 text-right text-red-400">{fmt(row.interest)}</td>
                              <td className="py-2 text-right text-gray-300">{fmt(row.balance)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {result.schedule.length > showRows && (
                        <button onClick={() => setShowRows(r => r + 24)}
                          className="w-full mt-3 py-2 text-xs text-[#6C3AFF] hover:text-white transition-colors">
                          Show more rows ({result.schedule.length - showRows} remaining)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Loan Calculator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Enter loan details", desc:"Input the loan amount, annual interest rate and term in years. Results update instantly." },
              { step:"2", title:"Simulate extra payments", desc:"Enter any extra monthly amount to see exactly how much interest you save and how many months you cut from the loan." },
              { step:"3", title:"Review the amortization schedule", desc:"Expand the full schedule to see every monthly payment broken into principal and interest portions." },
              { step:"4", title:"Compare two loans", desc:"Toggle the comparison mode to enter a second loan and see a side-by-side breakdown of monthly payment, total interest and payoff date." },
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
