"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "IP Address Lookup",
  description: "Free IP address lookup. Find country, city, ISP, ASN, timezone and coordinates for any IP. Auto-detects your own IP.",
  url: "https://www.purstech.com/tools/ip-lookup",
  applicationCategory: "SecurityApplication",
  operatingSystem: "Any",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
};

const FAQ = [
  { q: "What information does an IP lookup reveal?",
    a: "An IP lookup reveals the approximate geographic location (accurate to city level), the ISP (Internet Service Provider), the organisation name, the Autonomous System Number (ASN), the timezone, latitude/longitude coordinates, country calling code and currency. It does NOT reveal your name, home address or any personal identity — that information is only available to ISPs and law enforcement with a legal order." },
  { q: "How accurate is IP geolocation?",
    a: "IP geolocation is typically 100% accurate for country, about 80% accurate for region/state, and 60–70% accurate for city. It is rarely accurate at street or postcode level. VPN users will see the VPN server's location, not their real location. Large corporate networks may show the company's headquarters location regardless of where individual employees are connecting from." },
  { q: "What is an ASN (Autonomous System Number)?",
    a: "An ASN is a unique number assigned to a network operated by an ISP, corporation, university or cloud provider. It identifies who controls a block of IP addresses. For example, Google uses AS15169 and Cloudflare uses AS13335. ASNs are registered with regional internet registries (RIPE, ARIN, APNIC) and are publicly visible. The ASN tells you the network operator even when the friendly ISP name isn't immediately recognisable." },
  { q: "Why does my IP show a different city than where I am?",
    a: "This is normal and happens for several reasons: your ISP may route traffic through a regional hub in a different city; mobile networks often show a carrier's main data centre location; VPNs show the VPN server's location; and some ISPs register IP blocks with their headquarters address. IP geolocation is an approximation based on registration records, not GPS or actual connection tracing." },
  { q: "Can I look up multiple IP addresses at once?",
    a: "Yes — switch to Batch mode, enter up to 10 IPs (one per line) and click Lookup All. Results appear in a comparison table showing country, city, ISP and ASN for each IP. This is useful for analysing server logs, reviewing form submission IPs or investigating patterns across multiple addresses." },
];

interface IPData {
  ip: string; city: string; region: string; region_code: string;
  country: string; country_name: string; country_code: string;
  postal: string; latitude: number; longitude: number;
  timezone: string; utc_offset: string; org: string; asn: string;
  currency: string; currency_name: string; country_calling_code: string;
  languages: string; error?: boolean; reason?: string;
}

async function fetchIP(ip = ""): Promise<IPData> {
  const url = ip ? `https://ipapi.co/${ip}/json/` : "https://ipapi.co/json/";
  const res = await fetch(url, { headers: { "Accept": "application/json" } });
  return res.json();
}

const Flag = ({ code }: { code: string }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={`https://flagcdn.com/24x18/${code.toLowerCase()}.png`}
    alt={code} className="inline-block rounded-sm" width={24} height={18} />
);

export default function IPLookupClient({ children }: { children?: React.ReactNode }) {
  const [query,        setQuery]        = useState("");
  const [loading,      setLoading]      = useState(false);
  const [result,       setResult]       = useState<IPData | null>(null);
  const [ownIP,        setOwnIP]        = useState<IPData | null>(null);
  const [error,        setError]        = useState("");
  const [batch,        setBatch]        = useState("");
  const [batchResults, setBatchResults] = useState<IPData[]>([]);
  const [batchLoading, setBatchLoading] = useState(false);
  const [batchMode,    setBatchMode]    = useState(false);

  useEffect(() => {
    fetchIP().then(d => { if (!d.error) setOwnIP(d); }).catch(() => {});
  }, []);

  const lookup = async (ip?: string) => {
    const target = (ip ?? query).trim();
    setLoading(true); setError(""); setResult(null);
    try {
      const data = await fetchIP(target);
      if (data.error) setError(data.reason ?? "Lookup failed — check the IP address format.");
      else setResult(data);
    } catch { setError("Request failed — check your internet connection."); }
    setLoading(false);
  };

  const lookupBatch = async () => {
    const ips = batch.trim().split("\n").map(s => s.trim()).filter(Boolean).slice(0, 10);
    if (!ips.length) return;
    setBatchLoading(true); setBatchResults([]);
    const results: IPData[] = [];
    for (const ip of ips) {
      try { results.push(await fetchIP(ip)); } catch {}
      await new Promise(r => setTimeout(r, 400)); // respect rate limit
    }
    setBatchResults(results);
    setBatchLoading(false);
  };

  const display = result ?? ownIP;
  const isOwn   = !result && !!ownIP;

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }} />
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <Link href="/tools" className="text-sm text-gray-500 hover:text-white transition-colors">All Tools</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10">
        <nav className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400">Home</Link><span>›</span>
          <Link href="/tools" className="hover:text-gray-400">Tools</Link><span>›</span>
          <span className="text-gray-400">IP Lookup</span>
        </nav>

        {children}

        {/* Mode tabs */}
        <div className="flex gap-1 bg-[#13131F] border border-white/5 p-1 rounded-xl w-fit mb-5">
          {[["Single IP", false], ["Batch (up to 10)", true]].map(([label, mode]) => (
            <button key={String(label)} onClick={() => setBatchMode(!!mode)}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${batchMode === !!mode ? "bg-[#00D4FF] text-black" : "text-gray-400 hover:text-white"}`}>
              {label}
            </button>
          ))}
        </div>

        {!batchMode ? (
          <>
            <div className="flex gap-2 mb-6">
              <input value={query} onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === "Enter" && lookup()}
                placeholder="Enter any IP address — or leave blank for your own IP"
                className="flex-1 px-4 py-3 rounded-xl bg-[#13131F] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00D4FF]/50 transition-all" />
              <button onClick={() => lookup()} disabled={loading}
                className="px-6 py-3 rounded-xl bg-[#00D4FF] hover:bg-[#00b8d9] disabled:opacity-50 text-black font-extrabold text-sm transition-all min-w-[80px]">
                {loading ? "…" : "Lookup"}
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-4">{error}</div>
            )}

            {display && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Main card */}
                <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-5 flex-wrap">
                    <span className="text-2xl font-black text-[#00D4FF] font-mono break-all">{display.ip}</span>
                    {display.country_code && <Flag code={display.country_code} />}
                    {isOwn && (
                      <span className="text-xs bg-[#00D4FF]/10 text-[#00D4FF] border border-[#00D4FF]/20 px-2 py-0.5 rounded-full">Your IP</span>
                    )}
                  </div>
                  {[
                    { label:"Country",  value: `${display.country_name} (${display.country_code})` },
                    { label:"Region",   value: `${display.region} (${display.region_code})`         },
                    { label:"City",     value: display.city || "—"                                 },
                    { label:"Postal",   value: display.postal || "—"                                 },
                    { label:"Timezone", value: `${display.timezone} (${display.utc_offset})`         },
                    { label:"Coords",   value: `${display.latitude}, ${display.longitude}`           },
                  ].map(r => (
                    <div key={r.label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                      <span className="text-sm text-gray-500">{r.label}</span>
                      <span className="text-sm font-semibold text-white text-right ml-4 truncate max-w-[60%]">{r.value}</span>
                    </div>
                  ))}
                </div>

                {/* Network + extra */}
                <div className="space-y-4">
                  <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Network</h3>
                    {[
                      { label:"ISP / Org", value: display.org  || "—" },
                      { label:"ASN",       value: display.asn  || "—" },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                        <span className="text-sm text-gray-500">{r.label}</span>
                        <span className="text-sm font-semibold text-white text-right ml-4 truncate max-w-[65%]">{r.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Country Info</h3>
                    {[
                      { label:"Calling Code", value: display.country_calling_code || "—" },
                      { label:"Currency",     value: `${display.currency_name} (${display.currency})` || "—" },
                      { label:"Languages",    value: (display.languages ?? "").split(",")[0] || "—" },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between py-2 border-b border-white/5 last:border-0">
                        <span className="text-sm text-gray-500">{r.label}</span>
                        <span className="text-sm font-semibold text-white text-right ml-4">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <textarea value={batch} onChange={e => setBatch(e.target.value)}
              placeholder={"Enter up to 10 IPs, one per line:\n8.8.8.8\n1.1.1.1\n..."}
              rows={8}
              className="w-full px-4 py-3 rounded-2xl bg-[#13131F] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00D4FF]/50 resize-none transition-all" />
            <button onClick={lookupBatch} disabled={batchLoading || !batch.trim()}
              className="w-full py-3 rounded-xl bg-[#00D4FF] hover:bg-[#00b8d9] disabled:opacity-50 text-black font-extrabold transition-all">
              {batchLoading ? "Looking up…" : "🔍 Lookup All"}
            </button>
            {batchResults.length > 0 && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-500 border-b border-white/5">
                      {["IP","Country","City","ISP / Org","ASN","Timezone"].map(h => (
                        <th key={h} className="text-left px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {batchResults.map((r, i) => (
                      <tr key={i} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-mono text-[#00D4FF]">{r.ip}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {r.country_code && <Flag code={r.country_code} />}
                            <span>{r.country_code}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{r.city || "—"}</td>
                        <td className="px-4 py-3 max-w-[140px] truncate">{r.org || "—"}</td>
                        <td className="px-4 py-3 font-mono text-xs">{r.asn || "—"}</td>
                        <td className="px-4 py-3">{r.timezone || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* How to Use */}
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Look Up an IP Address</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Your IP loads automatically", desc:"On page load, your own public IP address is detected and all details are displayed — no input needed." },
              { step:"2", title:"Lookup any IP", desc:"Type any IPv4 or IPv6 address in the input field and click Lookup to see full location and network details." },
              { step:"3", title:"Review all details", desc:"See country, city, region, timezone, ISP, ASN, currency and language all in one place." },
              { step:"4", title:"Use Batch for multiple IPs", desc:"Switch to Batch mode, paste up to 10 IPs (one per line) and get a side-by-side comparison table." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#00D4FF] flex items-center justify-center text-black font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div><div className="font-semibold text-white text-sm mb-1">{s.title}</div><div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#00D4FF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#00D4FF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
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
        <p className="text-gray-700 text-xs mt-3">© 2026 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
