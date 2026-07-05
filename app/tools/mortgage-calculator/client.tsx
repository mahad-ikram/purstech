"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ ADDED

const FAQ = [
  { q:"Does this mortgage calculator include taxes and insurance?",
    a:"Yes — it calculates your full PITI payment: principal, interest, property tax and homeowners insurance, plus HOA fees and PMI if your down payment is under 20%. That is the real monthly number, not just principal and interest." },
  { q:"How much is PMI per month?",
    a:"PMI typically costs about 0.3% to 1.5% of the loan amount per year, split into monthly payments — roughly $75 to $375 a month on a $300,000 loan. The calculator estimates your PMI and shows the exact month it can be removed once you reach 20% equity." },
  { q:"Can I calculate a mortgage recast?",
    a:"Yes, approximately: a recast re-amortizes your remaining balance after a lump-sum payment, over the remaining term at the same rate. Enter your post-lump-sum balance as the loan amount, your remaining years as the term, and your current rate — the monthly payment shown is your recast payment." },
  { q:"Should I rent or buy?",
    a:"Buying generally makes more financial sense if you plan to stay 5+ years, as appreciation and equity accumulation offset the higher initial costs. Renting is better for flexibility or in overpriced markets. Our rent vs buy tab provides a 5-year financial comparison." },
  { q:"What does PITI stand for and why does it matter?",
    a:"PITI stands for Principal, Interest, Taxes, and Insurance — the four components of a full monthly mortgage payment. Principal and interest repay the loan itself. Property taxes are collected monthly and held in escrow. Homeowners insurance is also escrowed and paid annually. Taxes and insurance can add $300–$1,000+ per month beyond principal and interest." },
  { q:"What is PMI and when can I remove it?",
    a:"PMI (Private Mortgage Insurance) is required by most lenders when your down payment is less than 20%. It typically costs 0.5%–1.5% of the loan amount per year, adding $100–$400/month to your payment. Under the Homeowners Protection Act, lenders must automatically cancel PMI when your balance reaches 78% of the original purchase price." },
  { q:"How much house can I afford?",
    a:"A common rule is that your total housing payment (PITI) should not exceed 28% of your gross monthly income, and total debt payments should not exceed 36% (the 28/36 rule). Use our Affordability tab — enter your income and we calculate the maximum home price based on both rules." },
  { q:"How does down payment size affect my mortgage?",
    a:"A larger down payment reduces your loan amount, lowers monthly payments, and eliminates PMI once you reach 20%. It also reduces total interest paid over the life of the loan. Use the calculator to compare different down payment scenarios with the slider." },
  { q:"Should I rent or buy? What does the calculator compare?",
    a:"Buying generally makes more financial sense if you plan to stay 5+ years, as appreciation and equity accumulation offset higher initial costs. Renting is better for flexibility or in overpriced markets. Our Rent vs Buy tab provides a simplified 5-year financial comparison including equity built and home price appreciation." },
];

const fmt  = (n: number, d = 0) =>
  new Intl.NumberFormat("en-US", { style:"currency", currency:"USD", maximumFractionDigits:d }).format(n);

function calcMortgage(
  price: number, downPct: number, rate: number, years: number,
  propTax: number, insurance: number, hoa: number, pmiRate: number
) {
  const dp   = price * (downPct / 100);
  const loan = price - dp;
  const r    = rate / 100 / 12;
  const n    = years * 12;

  const pi = r === 0 ? loan / n : (loan * r * Math.pow(1+r, n)) / (Math.pow(1+r, n) - 1);
  const monthlyTax = (price * propTax / 100) / 12;
  const monthlyIns = insurance / 12;
  const monthlyHOA = hoa;
  const needsPMI   = downPct < 20;
  const monthlyPMI = needsPMI ? (loan * pmiRate / 100) / 12 : 0;
  const total      = pi + monthlyTax + monthlyIns + monthlyHOA + monthlyPMI;
  const totalInterest = (pi * n) - loan;

  let pmiOffMonth = 0;
  if (needsPMI) {
    let bal = loan;
    for (let m = 1; m <= n; m++) {
      const interest   = bal * r;
      const principal  = pi - interest;
      bal -= principal;
      if (bal <= price * 0.8) { pmiOffMonth = m; break; }
    }
  }

  const annualRows: { year:number; payment:number; interest:number; principal:number; balance:number; cumInterest:number }[] = [];
  let balance = loan, cumInterest = 0;
  for (let y = 1; y <= years; y++) {
    let yInterest = 0, yPrincipal = 0;
    for (let m = 0; m < 12 && balance > 0; m++) {
      const interest  = balance * r;
      const principal = Math.min(balance, pi - interest);
      yInterest  += interest; yPrincipal += principal;
      balance     = Math.max(0, balance - principal);
    }
    cumInterest += yInterest;
    annualRows.push({ year:y, payment:pi*12, interest:yInterest, principal:yPrincipal, balance, cumInterest });
  }

  return { dp, loan, pi, monthlyTax, monthlyIns, monthlyHOA, monthlyPMI, total, totalInterest, needsPMI, pmiOffMonth, annualRows };
}

export default function MortgageCalculatorClient() {
  useTrackTool("mortgage-calculator", "finance"); // ✅ ADDED

  const [price,       setPrice]      = useState("450000");
  const [downPct,     setDownPct]    = useState("20");
  const [rate,        setRate]       = useState("7.0");
  const [years,       setYears]      = useState("30");
  const [propTax,     setPropTax]    = useState("1.2");
  const [insurance,   setInsurance]  = useState("1500");
  const [hoa,         setHoa]        = useState("0");
  const [pmiRate,     setPmiRate]    = useState("0.8");
  const [activeTab,   setActiveTab]  = useState<"breakdown"|"amort"|"afford"|"rent">("breakdown");

  const [income,      setIncome]     = useState("8000");
  const [debts,       setDebts]      = useState("500");

  const [rentAmt,     setRentAmt]    = useState("2000");
  const [appreciation,setAppreciation] = useState("3");
  const [rentIncrease,setRentIncrease] = useState("3");

  const result = useMemo(() =>
    calcMortgage(+price, +downPct, +rate, +years, +propTax, +insurance, +hoa, +pmiRate),
    [price, downPct, rate, years, propTax, insurance, hoa, pmiRate]
  );

  const afford = useMemo(() => {
    const maxPITI     = +income * 0.28;
    const maxDebt     = +income * 0.36 - +debts;
    const maxPayment  = Math.min(maxPITI, maxDebt);
    const r = +rate / 100 / 12, n = +years * 12;
    const estTaxInsHOA = (+price * (+propTax / 100) / 12) + (+insurance / 12) + +hoa;
    const maxPI    = maxPayment - estTaxInsHOA;
    const maxLoan  = maxPI <= 0 ? 0 : maxPI * ((Math.pow(1+r,n)-1) / (r*Math.pow(1+r,n)));
    const maxPrice = maxLoan / (1 - +downPct / 100);
    const dtiPct   = ((result.total + +debts) / +income) * 100;
    return { maxPayment, maxPrice, dtiPct };
  }, [income, debts, rate, years, propTax, insurance, hoa, downPct, price, result]);

  const rentVsBuy = useMemo(() => {
    const yrs = 5;
    const priceFuture    = +price * Math.pow(1 + +appreciation/100, yrs);
    const balanceAtYear5 = result.annualRows[yrs-1]?.balance ?? 0;
    const totalBuyCost   = result.total * 12 * yrs;
    let totalRentCost = 0, r = +rentAmt;
    for (let y = 0; y < yrs; y++) { totalRentCost += r*12; r *= (1 + +rentIncrease/100); }
    const buyNetWorth = (priceFuture - balanceAtYear5) - result.dp;
    return { totalBuyCost, totalRentCost, buyNetWorth, priceFuture, balanceAtYear5 };
  }, [price, rate, years, rentAmt, appreciation, rentIncrease, result]);

  function downloadAmortCSV() {
    const headers = ["Year","Principal ($)","Interest ($)","Balance ($)","Equity ($)"];
    const rows    = result.annualRows.map(r => [
      `Year ${r.year}`, r.principal.toFixed(2), r.interest.toFixed(2),
      r.balance.toFixed(2), (+price - r.balance).toFixed(2),
    ]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    Object.assign(document.createElement("a"), {
      href:     URL.createObjectURL(new Blob([csv], { type:"text/csv" })),
      download: "mortgage-amortization.csv",
    }).click();
  }

  const downDollars = +price * (+downPct / 100);

  const tabs = [
    { id:"breakdown" as const, label:"Payment Breakdown" },
    { id:"amort"     as const, label:"Amortization"      },
    { id:"afford"    as const, label:"Affordability"     },
    { id:"rent"      as const, label:"Rent vs Buy"       },
  ];

  return (
    // ✅ NEW RULE: flex flex-col overflow-x-hidden on root div
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      {/* ── Navbar ── */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="flex items-center gap-4">
            <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
            <Link href="/pro" className="px-3 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white text-xs font-bold transition-all">Go Pro ⚡</Link>
          </div>
        </div>
      </nav>

      {/* ✅ NEW RULE: flex-grow w-full on main */}
      <main className="max-w-5xl mx-auto px-4 py-10 flex-grow w-full">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-gray-400">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/finance" className="hover:text-gray-400">Finance Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">Mortgage Calculator</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Finance Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Mortgage Calculator — Monthly Payment, PITI &amp; Amortization
          </h1>
          <p className="text-gray-400 max-w-2xl">Calculate your complete monthly mortgage payment including principal, interest, taxes, insurance, HOA and PMI. Includes affordability checker, full amortization and rent vs buy comparison.</p>
        </div>

        {/* Financial disclaimer */}
        <div className="mb-6 bg-yellow-500/5 border border-yellow-500/20 rounded-xl px-4 py-3 flex items-start gap-2">
          <span className="text-yellow-400 flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-xs text-gray-500 leading-relaxed">
            This calculator provides estimates for informational purposes only. Actual mortgage terms, rates, tax assessments and insurance vary by lender, location and borrower profile. Consult a qualified mortgage advisor before making real estate decisions.
          </p>
        </div>

        {/* ✅ Grid bounds fixed: min-w-0 on grid and cols */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 min-w-0">

          {/* ── Inputs ── */}
          <div className="lg:col-span-2 space-y-4 min-w-0">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-white text-sm">Home & Loan</h3>
              {[
                { label:"Home Price",           value:price,     setter:setPrice,    pre:"$" },
                { label:"Annual Interest Rate", value:rate,      setter:setRate,     suf:"%" },
                { label:"Loan Term",            value:years,     setter:setYears,    suf:"years" },
              ].map(f => (
                <div key={f.label} className="min-w-0">
                  <label className="block text-xs font-semibold text-gray-400 mb-1">{f.label}</label>
                  <div className="flex">
                    {f.pre && <span className="px-3 py-2.5 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm flex-shrink-0">{f.pre}</span>}
                    <input value={f.value} onChange={e => f.setter(e.target.value)} type="number" min="0"
                      className={`flex-1 min-w-0 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all ${f.pre?"":"rounded-l-xl"} ${f.suf?"":"rounded-r-xl"}`} />
                    {f.suf && <span className="px-3 py-2.5 bg-[#0A0A14] border border-l-0 border-white/10 rounded-r-xl text-gray-400 text-sm flex-shrink-0">{f.suf}</span>}
                  </div>
                </div>
              ))}
              <div>
                <div className="flex justify-between mb-1 flex-wrap gap-2">
                  <label className="text-xs font-semibold text-gray-400">Down Payment</label>
                  <span className="text-xs text-white">{fmt(downDollars)} ({downPct}%)</span>
                </div>
                <input type="range" min={3} max={50} value={downPct} onChange={e => setDownPct(e.target.value)} className="w-full accent-[#6C3AFF] mb-1" />
                <div className="flex justify-between text-xs text-gray-600">
                  <span>3%</span>
                  {+downPct < 20 && <span className="text-yellow-400">⚠ PMI required under 20%</span>}
                  <span>50%</span>
                </div>
              </div>
            </div>

            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-white text-sm">Monthly Costs</h3>
              {[
                { label:"Annual Property Tax Rate", value:propTax,   setter:setPropTax,   suf:"%" },
                { label:"Annual Home Insurance",    value:insurance, setter:setInsurance, pre:"$" },
                { label:"HOA (monthly)",            value:hoa,       setter:setHoa,       pre:"$" },
                ...(result.needsPMI ? [{ label:"PMI Rate (annual)", value:pmiRate, setter:setPmiRate, suf:"%" }] : []),
              ].map(f => (
                <div key={f.label} className="min-w-0">
                  <label className="block text-xs font-semibold text-gray-400 mb-1">{f.label}</label>
                  <div className="flex">
                    {f.pre && <span className="px-3 py-2.5 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm flex-shrink-0">{f.pre}</span>}
                    <input value={f.value} onChange={e => f.setter(e.target.value)} type="number" min="0" step="0.1"
                      className={`flex-1 min-w-0 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all ${f.pre?"":"rounded-l-xl"} ${f.suf?"":"rounded-r-xl"}`} />
                    {f.suf && <span className="px-3 py-2.5 bg-[#0A0A14] border border-l-0 border-white/10 rounded-r-xl text-gray-400 text-sm flex-shrink-0">{f.suf}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Results ── */}
          <div className="lg:col-span-3 space-y-4 min-w-0">
            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/30 rounded-2xl p-5 text-center min-w-0">
              <div className="text-xs text-gray-400 mb-1 truncate">Total Monthly Payment (PITI{result.needsPMI?" + PMI":""})</div>
              <div className="text-4xl md:text-5xl font-extrabold text-white mb-1 truncate break-all">{fmt(result.total)}</div>
              <div className="text-sm text-gray-400 truncate">{fmt(result.loan)} loan · {fmt(result.dp)} down</div>
            </div>

            {/* ✅ Added w-full to prevent tab flex overflow */}
            <div className="flex gap-1 bg-[#13131F] border border-white/5 p-1 rounded-xl overflow-x-auto w-full">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeTab===t.id?"bg-[#6C3AFF] text-white":"text-gray-400 hover:text-white"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Breakdown tab */}
            {activeTab === "breakdown" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-3">
                {[
                  { label:"Principal & Interest", value:result.pi,         color:"bg-[#6C3AFF]",   pct:(result.pi/result.total)*100 },
                  { label:"Property Tax",          value:result.monthlyTax, color:"bg-[#00D4FF]",   pct:(result.monthlyTax/result.total)*100 },
                  { label:"Home Insurance",        value:result.monthlyIns, color:"bg-green-500",   pct:(result.monthlyIns/result.total)*100 },
                  { label:"HOA",                   value:result.monthlyHOA, color:"bg-yellow-500",  pct:(result.monthlyHOA/result.total)*100 },
                  ...(result.needsPMI ? [{ label:"PMI", value:result.monthlyPMI, color:"bg-[#FF3A6C]", pct:(result.monthlyPMI/result.total)*100 }] : []),
                ].map(row => (
                  <div key={row.label}>
                    <div className="flex justify-between text-sm mb-1.5 flex-wrap gap-2">
                      <span className="text-gray-400">{row.label}</span>
                      <span className="font-bold text-white">{fmt(row.value)}/mo</span>
                    </div>
                    <div className="h-1.5 bg-[#0A0A14] rounded-full overflow-hidden w-full">
                      <div className={`h-full ${row.color} rounded-full`} style={{ width:`${row.pct}%` }} />
                    </div>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between flex-wrap gap-2"><span className="text-gray-400">Total Interest ({years}yr)</span><span className="text-[#FF3A6C] font-bold">{fmt(result.totalInterest)}</span></div>
                  <div className="flex justify-between flex-wrap gap-2"><span className="text-gray-400">Total Cost</span><span className="text-white font-bold">{fmt(result.total * +years * 12)}</span></div>
                  {result.needsPMI && result.pmiOffMonth > 0 && (
                    <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3 text-xs text-yellow-400 break-words">
                      PMI removes automatically in month {result.pmiOffMonth} ({Math.floor(result.pmiOffMonth/12)} yrs {result.pmiOffMonth%12} mos) — saving {fmt(result.monthlyPMI)}/mo thereafter
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Amortization tab */}
            {activeTab === "amort" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 min-w-0">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Annual Schedule</span>
                  <button onClick={downloadAmortCSV}
                    className="px-3 py-1.5 rounded-lg bg-[#0A0A14] border border-white/10 text-gray-400 hover:text-white text-xs font-bold transition-all">
                    ⬇ CSV
                  </button>
                </div>
                {/* ✅ Added w-full to lock horizontal bounds */}
                <div className="overflow-x-auto w-full max-h-96 overflow-y-auto">
                  <table className="w-full text-xs min-w-[400px]">
                    <thead className="sticky top-0 bg-[#13131F]">
                      <tr className="text-gray-500 border-b border-white/5">
                        <th className="text-left py-2">Year</th>
                        <th className="text-right py-2">Principal</th>
                        <th className="text-right py-2">Interest</th>
                        <th className="text-right py-2">Balance</th>
                        <th className="text-right py-2">Equity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.annualRows.map(r => (
                        <tr key={r.year} className="border-b border-white/5 hover:bg-white/[0.02]">
                          <td className="py-2.5 text-gray-400">Year {r.year}</td>
                          <td className="py-2.5 text-right text-green-400">{fmt(r.principal)}</td>
                          <td className="py-2.5 text-right text-red-400">{fmt(r.interest)}</td>
                          <td className="py-2.5 text-right text-white">{fmt(r.balance)}</td>
                          <td className="py-2.5 text-right text-[#6C3AFF]">{fmt(+price - r.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Affordability tab */}
            {activeTab === "afford" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
                <p className="text-xs text-gray-400">Based on the 28/36 debt-to-income rule.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Gross Monthly Income</label>
                    <div className="flex">
                      <span className="px-3 py-2.5 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm flex-shrink-0">$</span>
                      <input value={income} onChange={e => setIncome(e.target.value)} type="number"
                        className="flex-1 min-w-0 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all rounded-r-xl" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Monthly Debts</label>
                    <div className="flex">
                      <span className="px-3 py-2.5 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm flex-shrink-0">$</span>
                      <input value={debts} onChange={e => setDebts(e.target.value)} type="number"
                        className="flex-1 min-w-0 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all rounded-r-xl" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 min-w-0">
                  <div className="bg-[#0A0A14] rounded-xl p-3 text-center min-w-0">
                    <div className="text-xl font-extrabold text-[#6C3AFF] truncate">{fmt(afford.maxPrice, 0)}</div>
                    <div className="text-xs text-gray-500 truncate">Max Home Price</div>
                  </div>
                  <div className="bg-[#0A0A14] rounded-xl p-3 text-center min-w-0">
                    <div className="text-xl font-extrabold text-[#6C3AFF] truncate">{fmt(afford.maxPayment)}</div>
                    <div className="text-xs text-gray-500 truncate">Max PITI Payment</div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1 flex-wrap gap-2">
                    <span>Your Debt-to-Income Ratio</span>
                    <span className={afford.dtiPct <= 36 ? "text-green-400" : "text-[#FF3A6C]"}>{afford.dtiPct.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-[#0A0A14] rounded-full overflow-hidden w-full">
                    <div className={`h-full rounded-full ${afford.dtiPct <= 28 ? "bg-green-500" : afford.dtiPct <= 36 ? "bg-yellow-500" : "bg-[#FF3A6C]"}`}
                      style={{ width:`${Math.min(afford.dtiPct, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-green-400">Ideal (≤28%)</span>
                    <span className="text-yellow-400 hidden sm:inline">Acceptable (≤36%)</span>
                    <span className="text-[#FF3A6C]">High (&gt;36%)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Rent vs Buy tab */}
            {activeTab === "rent" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
                <p className="text-xs text-gray-400">5-year financial comparison assuming you stay in the home.</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label:"Monthly Rent",    value:rentAmt,      setter:setRentAmt,      pre:"$" },
                    { label:"Appreciation/yr", value:appreciation, setter:setAppreciation, suf:"%" },
                    { label:"Rent Increase/yr",value:rentIncrease, setter:setRentIncrease, suf:"%" },
                  ].map(f => (
                    <div key={f.label} className="min-w-0">
                      <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                      <div className="flex">
                        {f.pre && <span className="px-3 py-2.5 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm flex-shrink-0">{f.pre}</span>}
                        <input value={f.value} onChange={e => f.setter(e.target.value)} type="number" step="0.1"
                          className={`flex-1 min-w-0 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all ${f.pre?"":"rounded-l-xl"} ${f.suf?"":"rounded-r-xl"}`} />
                        {f.suf && <span className="px-3 py-2.5 bg-[#0A0A14] border border-l-0 border-white/10 rounded-r-xl text-gray-400 text-sm flex-shrink-0">{f.suf}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3 min-w-0">
                  <div className="bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-xl p-3 text-center min-w-0">
                    <div className="text-sm font-bold text-[#6C3AFF] mb-1 truncate">🏠 Buying</div>
                    <div className="text-xl font-extrabold text-white truncate break-all">{fmt(rentVsBuy.totalBuyCost, 0)}</div>
                    <div className="text-xs text-gray-500 truncate">5-yr total payments</div>
                    <div className="text-xs text-[#6C3AFF] mt-1 truncate">Net worth: {fmt(rentVsBuy.buyNetWorth, 0)}</div>
                  </div>
                  <div className="bg-[#0A0A14] rounded-xl p-3 text-center border border-white/10 min-w-0">
                    <div className="text-sm font-bold text-gray-400 mb-1 truncate">🏢 Renting</div>
                    <div className="text-xl font-extrabold text-white truncate break-all">{fmt(rentVsBuy.totalRentCost, 0)}</div>
                    <div className="text-xs text-gray-500 truncate">5-yr total rent paid</div>
                    <div className="text-xs text-gray-500 mt-1 truncate">No equity built</div>
                  </div>
                </div>
                <div className="bg-[#0A0A14] rounded-xl p-3 text-xs space-y-1 text-gray-400 break-words">
                  <div>Home value in 5 years: <strong className="text-white">{fmt(rentVsBuy.priceFuture, 0)}</strong></div>
                  <div>Loan balance at year 5: <strong className="text-white">{fmt(rentVsBuy.balanceAtYear5, 0)}</strong></div>
                  <div>Equity built: <strong className="text-[#6C3AFF]">{fmt(+price - rentVsBuy.balanceAtYear5, 0)}</strong></div>
                </div>
                <p className="text-xs text-gray-600">Simplified comparison. Real costs include maintenance (1–2%/yr), closing costs and opportunity cost of down payment.</p>
              </div>
            )}
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Mortgage Calculator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Enter home & loan",       desc:"Input home price, interest rate, loan term and adjust the down payment slider. A PMI warning appears below 20%." },
              { step:"2", title:"Review PITI breakdown",   desc:"See your full monthly payment split into Principal, Interest, Property Tax, Insurance, HOA and PMI with a visual bar for each." },
              { step:"3", title:"Check affordability",     desc:"Switch to Affordability, enter your gross income and existing debts to see the maximum home price you can afford (28/36 rule)." },
              { step:"4", title:"Compare rent vs buy",     desc:"Switch to Rent vs Buy and enter your current rent to see a 5-year financial comparison including equity and appreciation." },
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

        {/* FAQ */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#6C3AFF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none select-none">
                  <span>{f.q}</span>
                  <span className="text-[#6C3AFF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-16 py-8 text-center bg-[#0A0A14]">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center flex-wrap gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}