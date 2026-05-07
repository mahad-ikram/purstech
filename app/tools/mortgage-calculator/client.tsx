"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Mortgage Calculator",
  description: "Free mortgage calculator with full PITI breakdown, PMI, affordability checker, amortization schedule and rent vs buy comparison.",
  url: "https://purstech.com/tools/mortgage-calculator",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const FAQ = [
  {
    q: "What does PITI stand for and why does it matter?",
    a: "PITI stands for Principal, Interest, Taxes, and Insurance — the four components of a full monthly mortgage payment. Principal and interest repay the loan itself. Property taxes are collected monthly and held in escrow by your lender, then paid to local government annually. Homeowners insurance is also escrowed and paid annually. Knowing your full PITI payment — not just principal and interest — is critical for accurate budgeting, as taxes and insurance can add $300–$1,000+ per month to your payment.",
  },
  {
    q: "What is PMI and when can I remove it?",
    a: "PMI (Private Mortgage Insurance) is required by most lenders when your down payment is less than 20% of the purchase price. It protects the lender — not you — in case of default. PMI typically costs 0.5%–1.5% of the loan amount per year, adding $100–$400/month to your payment. You can request removal once your loan-to-value ratio reaches 80% (either through payments or appreciation). Under federal law (Homeowners Protection Act), lenders must automatically cancel PMI when your balance reaches 78% of the original purchase price.",
  },
  {
    q: "How much house can I afford?",
    a: "A common rule is that your total housing payment (PITI) should not exceed 28% of your gross monthly income, and total debt payments should not exceed 36% (the 28/36 rule). For example, with a $8,000/month gross income, maximum PITI would be $2,240. Use our affordability calculator — enter your income and we calculate the maximum home price you can afford. Lenders also consider credit score, debt-to-income ratio and employment history.",
  },
  {
    q: "How does down payment size affect my mortgage?",
    a: "A larger down payment reduces your loan amount, lowers monthly payments, and eliminates PMI once you reach 20%. It also reduces total interest paid over the life of the loan. However, a larger down payment means less cash on hand for emergencies and home repairs. Many financial advisors suggest 20% to avoid PMI, but FHA loans (3.5% down) and conventional loans (3% down) are available. Use our calculator to compare different down payment scenarios.",
  },
  {
    q: "Should I rent or buy? What does the calculator compare?",
    a: "The rent vs buy comparison considers your monthly mortgage payment, expected home price appreciation, equity built through principal payments, and the opportunity cost of your down payment. Buying generally makes more financial sense if you plan to stay 5+ years, as appreciation and equity accumulation offset the higher initial costs. Renting is better for flexibility or in overpriced markets. Our calculator provides a rough financial comparison — personal factors like lifestyle, stability and career plans matter equally.",
  },
];

const fmt = (n: number, d = 0) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: d }).format(n);
const fmtN = (n: number) => new Intl.NumberFormat("en-US").format(Math.round(n));

function calcMortgage(
  price: number, downPct: number, rate: number, years: number,
  propTax: number, insurance: number, hoa: number, pmiRate: number
) {
  const dp      = price * (downPct / 100);
  const loan    = price - dp;
  const r       = rate / 100 / 12;
  const n       = years * 12;

  const pi = r === 0 ? loan / n
    : (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  const monthlyTax = (price * propTax / 100) / 12;
  const monthlyIns = insurance / 12;
  const monthlyHOA = hoa;
  const needsPMI   = downPct < 20;
  const monthlyPMI = needsPMI ? (loan * pmiRate / 100) / 12 : 0;

  const total = pi + monthlyTax + monthlyIns + monthlyHOA + monthlyPMI;
  const totalInterest = (pi * n) - loan;

  // PMI removal month
  let pmiOffMonth = 0;
  if (needsPMI) {
    let bal = loan;
    for (let m = 1; m <= n; m++) {
      const interest = bal * r;
      const principal = pi - interest;
      bal -= principal;
      if (bal <= price * 0.8) { pmiOffMonth = m; break; }
    }
  }

  // Amortization — annual summary
  const annualRows = [];
  let balance = loan;
  let cumInterest = 0;
  let cumPrincipal = 0;
  for (let y = 1; y <= years; y++) {
    let yInterest = 0, yPrincipal = 0;
    for (let m = 0; m < 12 && balance > 0; m++) {
      const interest   = balance * r;
      const principal  = Math.min(balance, pi - interest);
      yInterest   += interest;
      yPrincipal  += principal;
      balance      = Math.max(0, balance - principal);
    }
    cumInterest  += yInterest;
    cumPrincipal += yPrincipal;
    annualRows.push({ year: y, payment: (pi * 12), interest: yInterest, principal: yPrincipal, balance, cumInterest });
  }

  return { dp, loan, pi, monthlyTax, monthlyIns, monthlyHOA, monthlyPMI, total, totalInterest, needsPMI, pmiOffMonth, annualRows };
}

export default function MortgageCalculatorClient() {
  const [price,       setPrice]     = useState("450000");
  const [downPct,     setDownPct]   = useState("20");
  const [rate,        setRate]      = useState("7.0");
  const [years,       setYears]     = useState("30");
  const [propTax,     setPropTax]   = useState("1.2");
  const [insurance,   setInsurance] = useState("1500");
  const [hoa,         setHoa]       = useState("0");
  const [pmiRate,     setPmiRate]   = useState("0.8");
  const [activeTab,   setActiveTab] = useState<"breakdown" | "amort" | "afford" | "rent">("breakdown");

  // Affordability
  const [income,      setIncome]    = useState("8000");
  const [debts,       setDebts]     = useState("500");

  // Rent vs Buy
  const [rentAmt,     setRentAmt]   = useState("2000");
  const [appreciation,setAppreciation] = useState("3");
  const [rentIncrease,setRentIncrease] = useState("3");

  const result = useMemo(() =>
    calcMortgage(+price, +downPct, +rate, +years, +propTax, +insurance, +hoa, +pmiRate),
    [price, downPct, rate, years, propTax, insurance, hoa, pmiRate]
  );

  // Affordability calc
  const afford = useMemo(() => {
    const maxPITI = +income * 0.28;
    const maxDebt = +income * 0.36 - +debts;
    const maxPayment = Math.min(maxPITI, maxDebt);
    const r = +rate / 100 / 12;
    const n = +years * 12;
    const estTaxInsHOA = (+price * (+propTax / 100) / 12) + (+insurance / 12) + +hoa;
    const maxPI = maxPayment - estTaxInsHOA;
    const maxLoan = maxPI <= 0 ? 0 : maxPI * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
    const maxPrice = maxLoan / (1 - +downPct / 100);
    const dtiPct  = ((result.total + +debts) / +income) * 100;
    return { maxPayment, maxPrice, dtiPct };
  }, [income, debts, rate, years, propTax, insurance, hoa, downPct, price, result]);

  // Rent vs Buy (5-year comparison)
  const rentVsBuy = useMemo(() => {
    const yrs = 5;
    const priceFuture = +price * Math.pow(1 + +appreciation / 100, yrs);
    const equityBuilt = +price - result.annualRows[yrs - 1]?.balance ?? 0;
    const totalBuyCost = result.total * 12 * yrs;
    let totalRentCost = 0, r = +rentAmt;
    for (let y = 0; y < yrs; y++) { totalRentCost += r * 12; r *= (1 + +rentIncrease / 100); }
    const buyNetWorth = (priceFuture - result.annualRows[yrs - 1]?.balance) - result.dp;
    const rentSavings = totalBuyCost - totalRentCost;
    return { totalBuyCost, totalRentCost, buyNetWorth, priceFuture, rentSavings };
  }, [price, rate, years, rentAmt, appreciation, rentIncrease, result]);

  const tabs = [
    { id:"breakdown" as const, label:"Payment Breakdown" },
    { id:"amort"     as const, label:"Amortization"      },
    { id:"afford"    as const, label:"Affordability"     },
    { id:"rent"      as const, label:"Rent vs Buy"       },
  ];

  const downDollars = +price * (+downPct / 100);

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
          <span className="text-gray-400">Mortgage Calculator</span>
        </nav>

        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-3 py-1 text-xs text-[#6C3AFF] font-semibold mb-3">Finance Tools</div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3">
            Free Mortgage Calculator — Monthly Payment, PITI &amp; Amortization
          </h1>
          <p className="text-gray-400 max-w-2xl">Calculate your complete monthly mortgage payment including principal, interest, taxes, insurance, HOA and PMI. Includes affordability checker, full amortization and rent vs buy comparison.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Inputs */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
              <h3 className="font-bold text-white text-sm">Home & Loan</h3>
              {[
                { label: "Home Price",            value: price,     setter: setPrice,     pre:"$" },
                { label: "Annual Interest Rate",  value: rate,      setter: setRate,      suf:"%" },
                { label: "Loan Term",             value: years,     setter: setYears,     suf:"years" },
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

              {/* Down payment */}
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-xs font-semibold text-gray-400">Down Payment</label>
                  <span className="text-xs text-white">{fmt(downDollars)} ({downPct}%)</span>
                </div>
                <input type="range" min={3} max={50} value={downPct}
                  onChange={e => setDownPct(e.target.value)}
                  className="w-full accent-[#6C3AFF] mb-1" />
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
                { label: "Annual Property Tax Rate", value: propTax,   setter: setPropTax,   suf:"%" },
                { label: "Annual Home Insurance",    value: insurance, setter: setInsurance, pre:"$" },
                { label: "HOA (monthly)",            value: hoa,       setter: setHoa,       pre:"$" },
                ...(result.needsPMI ? [{ label: "PMI Rate (annual)", value: pmiRate, setter: setPmiRate, suf:"%" }] : []),
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">{f.label}</label>
                  <div className="flex">
                    {f.pre && <span className="px-3 py-2.5 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm">{f.pre}</span>}
                    <input value={f.value} onChange={e => f.setter(e.target.value)} type="number" min="0" step="0.1"
                      className={`flex-1 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all ${f.pre ? "" : "rounded-l-xl"} ${f.suf ? "" : "rounded-r-xl"}`} />
                    {f.suf && <span className="px-3 py-2.5 bg-[#0A0A14] border border-l-0 border-white/10 rounded-r-xl text-gray-400 text-sm">{f.suf}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3 space-y-4">
            {/* Total monthly */}
            <div className="bg-gradient-to-br from-[#6C3AFF]/20 to-[#00D4FF]/10 border border-[#6C3AFF]/30 rounded-2xl p-5 text-center">
              <div className="text-xs text-gray-400 mb-1">Total Monthly Payment (PITI{result.needsPMI ? " + PMI" : ""})</div>
              <div className="text-5xl font-extrabold text-white mb-1">{fmt(result.total)}</div>
              <div className="text-sm text-gray-400">{fmt(result.loan)} loan · {fmt(result.dp)} down</div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-[#13131F] border border-white/5 p-1 rounded-xl overflow-x-auto">
              {tabs.map(t => (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    activeTab===t.id ? "bg-[#6C3AFF] text-white" : "text-gray-400 hover:text-white"
                  }`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Breakdown */}
            {activeTab === "breakdown" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-3">
                {[
                  { label:"Principal & Interest", value: result.pi,         color:"bg-[#6C3AFF]",   pct: (result.pi/result.total)*100 },
                  { label:"Property Tax",          value: result.monthlyTax, color:"bg-[#00D4FF]",   pct: (result.monthlyTax/result.total)*100 },
                  { label:"Home Insurance",        value: result.monthlyIns, color:"bg-green-500",   pct: (result.monthlyIns/result.total)*100 },
                  { label:"HOA",                   value: result.monthlyHOA, color:"bg-yellow-500",  pct: (result.monthlyHOA/result.total)*100 },
                  ...(result.needsPMI ? [{ label:"PMI", value: result.monthlyPMI, color:"bg-[#FF3A6C]", pct:(result.monthlyPMI/result.total)*100 }] : []),
                ].map(row => (
                  <div key={row.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-400">{row.label}</span>
                      <span className="font-bold text-white">{fmt(row.value)}/mo</span>
                    </div>
                    <div className="h-1.5 bg-[#0A0A14] rounded-full overflow-hidden">
                      <div className={`h-full ${row.color} rounded-full`} style={{ width: `${row.pct}%` }} />
                    </div>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-3 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-400">Total Interest (30yr)</span><span className="text-[#FF3A6C] font-bold">{fmt(result.totalInterest)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Total Cost</span><span className="text-white font-bold">{fmt(result.total * +years * 12)}</span></div>
                  {result.needsPMI && result.pmiOffMonth > 0 && (
                    <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3 text-xs text-yellow-400">
                      PMI removes automatically in month {result.pmiOffMonth} ({Math.floor(result.pmiOffMonth/12)} yrs {result.pmiOffMonth%12} mos) — saving {fmt(result.monthlyPMI)}/mo thereafter
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Amortization */}
            {activeTab === "amort" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full text-xs">
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

            {/* Affordability */}
            {activeTab === "afford" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
                <p className="text-xs text-gray-400">Based on the 28/36 debt-to-income rule.</p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Gross Monthly Income</label>
                    <div className="flex">
                      <span className="px-3 py-2.5 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm">$</span>
                      <input value={income} onChange={e => setIncome(e.target.value)} type="number"
                        className="flex-1 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 rounded-r-xl" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Other Monthly Debts</label>
                    <div className="flex">
                      <span className="px-3 py-2.5 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm">$</span>
                      <input value={debts} onChange={e => setDebts(e.target.value)} type="number"
                        className="flex-1 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 rounded-r-xl" />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#0A0A14] rounded-xl p-3 text-center">
                    <div className="text-xl font-extrabold text-green-400">{fmt(afford.maxPayment)}/mo</div>
                    <div className="text-xs text-gray-500 mt-1">Max PITI payment</div>
                  </div>
                  <div className="bg-[#0A0A14] rounded-xl p-3 text-center">
                    <div className="text-xl font-extrabold text-[#6C3AFF]">{fmt(afford.maxPrice, 0)}</div>
                    <div className="text-xs text-gray-500 mt-1">Max home price</div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Your debt-to-income ratio</span>
                    <span className={afford.dtiPct > 43 ? "text-red-400" : afford.dtiPct > 36 ? "text-yellow-400" : "text-green-400"}>
                      {afford.dtiPct.toFixed(1)}% {afford.dtiPct > 43 ? "(Too High)" : afford.dtiPct > 36 ? "(Caution)" : "(Good)"}
                    </span>
                  </div>
                  <div className="h-2 bg-[#0A0A14] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${afford.dtiPct > 43 ? "bg-red-500" : afford.dtiPct > 36 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${Math.min(afford.dtiPct, 100)}%` }} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-600 mt-1"><span>Ideal ≤28%</span><span>Max 43%</span></div>
                </div>
                <div className={`rounded-xl p-3 text-xs border ${
                  result.total > afford.maxPayment
                    ? "bg-red-400/10 border-red-400/20 text-red-400"
                    : "bg-green-400/10 border-green-400/20 text-green-400"
                }`}>
                  {result.total > afford.maxPayment
                    ? `⚠ This home's PITI payment (${fmt(result.total)}/mo) exceeds your max budget. Consider a lower price or larger down payment.`
                    : `✓ This home's PITI payment (${fmt(result.total)}/mo) is within your budget.`
                  }
                </div>
              </div>
            )}

            {/* Rent vs Buy */}
            {activeTab === "rent" && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 space-y-4">
                <p className="text-xs text-gray-400">5-year comparison. Simplified — actual results vary based on tax deductions, maintenance costs and local market conditions.</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label:"Current Monthly Rent", value:rentAmt, setter:setRentAmt, pre:"$" },
                    { label:"Annual Rent Increase",  value:rentIncrease, setter:setRentIncrease, suf:"%" },
                    { label:"Home Appreciation",     value:appreciation, setter:setAppreciation, suf:"%" },
                  ].map(f => (
                    <div key={f.label}>
                      <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                      <div className="flex">
                        {f.pre && <span className="px-3 py-2.5 bg-[#0A0A14] border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm">{f.pre}</span>}
                        <input value={f.value} onChange={e => f.setter(e.target.value)} type="number" step="0.1"
                          className={`flex-1 px-4 py-2.5 bg-[#0A0A14] border border-white/10 text-white text-sm focus:outline-none focus:border-[#6C3AFF]/60 transition-all ${f.pre ? "" : "rounded-l-xl"} ${f.suf ? "" : "rounded-r-xl"}`} />
                        {f.suf && <span className="px-3 py-2.5 bg-[#0A0A14] border border-l-0 border-white/10 rounded-r-xl text-gray-400 text-sm">{f.suf}</span>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">5-Year Buy Cost</div>
                    <div className="text-xl font-bold text-[#6C3AFF]">{fmt(rentVsBuy.totalBuyCost)}</div>
                    <div className="text-xs text-green-400 mt-1">Equity: {fmt(+price - result.annualRows[4]?.balance)}</div>
                    <div className="text-xs text-cyan-400">Home value: {fmt(rentVsBuy.priceFuture)}</div>
                  </div>
                  <div className="bg-[#13131F] border border-white/10 rounded-xl p-3 text-center">
                    <div className="text-xs text-gray-400 mb-1">5-Year Rent Cost</div>
                    <div className="text-xl font-bold text-white">{fmt(rentVsBuy.totalRentCost)}</div>
                    <div className="text-xs text-gray-500 mt-1">No equity built</div>
                    <div className="text-xs text-gray-500">Down payment invested</div>
                  </div>
                </div>
                <div className={`rounded-xl p-3 text-xs border text-center ${
                  rentVsBuy.buyNetWorth > 0 ? "bg-green-400/10 border-green-400/20 text-green-400" : "bg-yellow-400/10 border-yellow-400/20 text-yellow-400"
                }`}>
                  {rentVsBuy.buyNetWorth > 0
                    ? `After 5 years, buying builds ~${fmt(rentVsBuy.buyNetWorth)} more net worth than renting (assuming ${appreciation}% annual appreciation).`
                    : `Renting may be more cost-effective over 5 years given current market conditions and appreciation assumptions.`
                  }
                </div>
              </div>
            )}
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-10 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the Mortgage Calculator</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Enter the home details", desc:"Input the purchase price, adjust the down payment slider, set your interest rate and loan term. The full PITI payment updates instantly." },
              { step:"2", title:"Add all monthly costs", desc:"Include property tax rate, annual insurance and any HOA fees. If your down payment is under 20%, PMI is calculated automatically." },
              { step:"3", title:"Check affordability", desc:"Switch to the Affordability tab, enter your gross monthly income and existing debts to see if the payment fits the 28/36 debt-to-income rule." },
              { step:"4", title:"Compare rent vs buy", desc:"Use the Rent vs Buy tab to see a 5-year financial comparison — total costs paid, equity built and projected home value vs your rent trajectory." },
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
