"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const LOAN_FAQ = [
  { q: "How is the monthly loan payment calculated?", a: "The monthly payment is calculated using the standard amortization formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n - 1 ], where P is the principal loan amount, i is the monthly interest rate, and n is the total number of months." },
  { q: "How do extra payments affect my loan?", a: "Making extra payments applies directly to your principal balance. By reducing the principal faster, you pay less total interest over the life of the loan and reach your payoff date months or even years earlier." },
  { q: "What is an amortization schedule?", a: "An amortization schedule is a complete table of periodic loan payments, showing the amount of principal and the amount of interest that comprise each payment until the loan is paid off at the end of its term." },
  { q: "Does this calculator work for auto and personal loans?", a: "Yes, this calculator works perfectly for auto loans, personal loans, student loans, and fixed-rate mortgages. It uses standard compounding logic applicable to almost all consumer loans." },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type":    "FAQPage",
  mainEntity: LOAN_FAQ.map(f => ({
    "@type": "Question",
    name:    f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function LoanCalculatorClient() {
  const [principal, setPrincipal] = useState<number | "">(25000);
  const [rate, setRate] = useState<number | "">(5.5);
  const [years, setYears] = useState<number | "">(5);
  const [extraPayment, setExtraPayment] = useState<number | "">(0);

  const results = useMemo(() => {
    const P = Number(principal) || 0;
    const R = Number(rate) || 0;
    const Y = Number(years) || 0;
    const E = Number(extraPayment) || 0;

    if (P <= 0 || R <= 0 || Y <= 0) return null;

    const monthlyRate = R / 100 / 12;
    const totalMonths = Y * 12;
    
    // Standard Payment Formula
    const standardPayment = (P * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths));
    const actualPayment = standardPayment + E;

    let balance = P;
    let totalInterest = 0;
    let monthsTaken = 0;
    const schedule = [];

    while (balance > 0 && monthsTaken < 1200) { // Safety cap at 100 years
      monthsTaken++;
      const interestForMonth = balance * monthlyRate;
      let principalForMonth = actualPayment - interestForMonth;

      if (balance < principalForMonth) {
        principalForMonth = balance;
      }

      totalInterest += interestForMonth;
      balance -= principalForMonth;

      schedule.push({
        month: monthsTaken,
        payment: principalForMonth + interestForMonth,
        principal: principalForMonth,
        interest: interestForMonth,
        balance: Math.max(0, balance)
      });
    }

    return {
      monthlyPayment: standardPayment,
      totalPayment: P + totalInterest,
      totalInterest,
      monthsSaved: totalMonths - monthsTaken,
      schedule,
      interestRatio: (totalInterest / (P + totalInterest)) * 100,
      principalRatio: (P / (P + totalInterest)) * 100
    };
  }, [principal, rate, years, extraPayment]);

  function exportCSV() {
    if (!results) return;
    const headers = ["Month", "Payment", "Principal", "Interest", "Remaining Balance"];
    const rows = results.schedule.map(r => [
      r.month,
      r.payment.toFixed(2),
      r.principal.toFixed(2),
      r.interest.toFixed(2),
      r.balance.toFixed(2)
    ]);
    const csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "amortization-schedule.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link>
          <span>›</span>
          <span className="text-gray-400">Loan Calculator</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Finance Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">Advanced Loan Calculator</h1>
          <p className="text-gray-400 max-w-2xl">Calculate monthly payments, total interest, and see exactly how much money and time you save by making extra payments. Generate a full amortization schedule.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inputs */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Loan Amount ($)</label>
                <input type="number" value={principal} onChange={e => setPrincipal(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-lg font-bold focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Interest Rate (%)</label>
                <input type="number" step="0.1" value={rate} onChange={e => setRate(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-lg font-bold focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Loan Term (Years)</label>
                <input type="number" value={years} onChange={e => setYears(e.target.value ? Number(e.target.value) : "")}
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/10 text-white text-lg font-bold focus:outline-none focus:border-[#6C3AFF]/60 transition-all" />
              </div>
              <div className="pt-4 border-t border-white/5">
                <label className="text-xs font-bold text-[#00D4FF] uppercase tracking-wider mb-2 block flex items-center gap-2">
                  <span>⚡ Extra Monthly Payment ($)</span>
                </label>
                <input type="number" value={extraPayment} onChange={e => setExtraPayment(e.target.value ? Number(e.target.value) : "")}
                  placeholder="Optional"
                  className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-[#00D4FF]/30 text-white text-lg font-bold focus:outline-none focus:border-[#00D4FF]/80 transition-all" />
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-8">
            {results ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#13131F] border border-[#6C3AFF]/20 rounded-2xl p-6 text-center shadow-lg shadow-[#6C3AFF]/5">
                    <div className="text-sm font-bold text-gray-500 mb-1">Standard Monthly Payment</div>
                    <div className="text-3xl font-extrabold text-white">${results.monthlyPayment.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                  </div>
                  <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 text-center">
                    <div className="text-sm font-bold text-gray-500 mb-1">Total Interest Paid</div>
                    <div className="text-3xl font-extrabold text-[#FF3A6C]">${results.totalInterest.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                  </div>
                  <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 text-center">
                    <div className="text-sm font-bold text-gray-500 mb-1">Total Cost of Loan</div>
                    <div className="text-3xl font-extrabold text-white">${results.totalPayment.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</div>
                  </div>
                </div>

                {/* Visualizer */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
                  <h3 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Cost Breakdown</h3>
                  <div className="w-full h-8 rounded-full overflow-hidden flex bg-[#0A0A14]">
                    <div style={{ width: `${results.principalRatio}%` }} className="h-full bg-[#6C3AFF] transition-all duration-500" title="Principal" />
                    <div style={{ width: `${results.interestRatio}%` }} className="h-full bg-[#FF3A6C] transition-all duration-500" title="Interest" />
                  </div>
                  <div className="flex justify-between mt-3 text-sm">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#6C3AFF]"></span><span className="text-white">Principal ({results.principalRatio.toFixed(1)}%)</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#FF3A6C]"></span><span className="text-white">Interest ({results.interestRatio.toFixed(1)}%)</span></div>
                  </div>
                </div>

                {/* Extra Payments impact */}
                {(Number(extraPayment) > 0 && results.monthsSaved > 0) && (
                  <div className="bg-gradient-to-r from-[#00D4FF]/10 to-[#6C3AFF]/10 border border-[#00D4FF]/30 rounded-2xl p-6 flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <div className="text-[#00D4FF] font-extrabold text-xl mb-1">🎉 You saved {Math.floor(results.monthsSaved / 12)} years and {results.monthsSaved % 12} months!</div>
                      <div className="text-gray-400 text-sm">By paying an extra ${Number(extraPayment)} per month.</div>
                    </div>
                  </div>
                )}

                {/* Amortization Table */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Amortization Schedule</h3>
                    <button onClick={exportCSV} className="px-4 py-2 bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-xs font-bold rounded-lg transition-all">⬇ Export CSV</button>
                  </div>
                  <div className="overflow-x-auto max-h-96">
                    <table className="w-full text-sm text-right">
                      <thead className="sticky top-0 bg-[#13131F] shadow-sm">
                        <tr className="text-gray-500 border-b border-white/10">
                          <th className="py-3 pr-4 text-left">Month</th>
                          <th className="py-3 pr-4">Payment</th>
                          <th className="py-3 pr-4">Principal</th>
                          <th className="py-3 pr-4">Interest</th>
                          <th className="py-3">Balance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.schedule.map((row) => (
                          <tr key={row.month} className="border-b border-white/5 hover:bg-white/[0.02]">
                            <td className="py-3 pr-4 text-gray-400 text-left">{row.month}</td>
                            <td className="py-3 pr-4 font-mono text-white">${row.payment.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                            <td className="py-3 pr-4 font-mono text-[#6C3AFF]">${row.principal.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                            <td className="py-3 pr-4 font-mono text-[#FF3A6C]">${row.interest.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                            <td className="py-3 font-mono text-white font-bold">${row.balance.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-12 text-center h-full flex flex-col justify-center items-center">
                <div className="text-5xl mb-4">🏦</div>
                <h3 className="text-xl font-bold text-white mb-2">Enter Loan Details</h3>
                <p className="text-gray-500 max-w-sm">Enter your principal amount, interest rate, and loan term on the left to see your full schedule and cost breakdown.</p>
              </div>
            )}
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-8">
          <h2 className="text-xl font-extrabold text-white mb-6">How to Use the Loan Calculator</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-sm text-gray-400">
            {[
              {step:"1",title:"Enter Principal",desc:"Input the total amount you are borrowing (e.g., 25000 for a car loan)."},
              {step:"2",title:"Set Rate & Term",desc:"Enter your annual interest rate and the total number of years to pay it back."},
              {step:"3",title:"Simulate Savings",desc:"Enter an optional extra monthly payment to see how many months and interest dollars you can save."},
              {step:"4",title:"Export Schedule",desc:"Review the Principal vs Interest breakdown and download the full amortization schedule as a CSV."},
            ].map(s => (
              <div key={s.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#6C3AFF]/20 text-[#6C3AFF] border border-[#6C3AFF]/30 flex items-center justify-center font-bold flex-shrink-0">{s.step}</div>
                <div>
                  <div className="font-bold text-white mb-1.5 text-base">{s.title}</div>
                  <div className="leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {LOAN_FAQ.map((faq, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{faq.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 mt-16 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/about" className="hover:text-gray-400 transition-colors">About</Link>
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
