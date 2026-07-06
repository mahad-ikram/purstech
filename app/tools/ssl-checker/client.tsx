"use client";

import { useState } from "react";
import Link from "next/link";
import { useTrackTool } from "@/hooks/useTrackTool"; // ✅ Rule 3

// ✅ SCHEMA removed — now server-rendered as WebApplication in page.tsx

/* ── Rich FAQ — Rule 10: module scope, FAQ.map() below matches ────────────── */
/* ── Rule 8: <details>/<summary> — no useState toggle ────────────────────── */
const FAQ = [
  { q: "What is an SSL certificate?",
    a: "An SSL/TLS certificate (secure socket layer certificate) is a small digital file that proves a website's identity and enables the encrypted https:// padlock. It binds a domain name to a public key, is signed by a trusted Certificate Authority, and expires on a set date. This checker decodes and grades all of it for any domain." },
  { q: "How do I decode an SSL certificate's details?",
    a: "Enter the domain — the checker performs a live TLS handshake and decodes the certificate for you: issuer chain, validity dates and days remaining, Subject Alternative Names, key strength, TLS protocol version and the SHA-256 fingerprint. No OpenSSL commands needed." },
  { q: "How often should I check my SSL certificate?",
    a: "Check your SSL certificate at least 30 and 90 days before expiry. Certificates are issued for a maximum of 398 days. Set calendar reminders at 90 days and 30 days before the expiry date shown. An expired certificate causes all browsers to block visitors with a security warning, costing significant traffic and revenue." },
  {
    q: "What does each security grade (A+, A, B, C, D, F) mean?",
    a: `The grade is calculated from three factors: TLS protocol version, key strength and days remaining.

A+ (Best) — TLS 1.3, key ≥ 2048 bits, more than 30 days remaining. Optimal configuration. No action needed.

A — TLS 1.3 with a strong key but expiring within 30 days, or TLS 1.2 with strong key and >30 days. Excellent — consider scheduling renewal if expiry is near.

B — TLS 1.2 with a 2048-bit or stronger key. Still acceptable for most purposes but upgrading to TLS 1.3 is recommended for better performance (TLS 1.3 handshakes are ~40% faster).

C — TLS 1.2 with a weaker configuration or key under 2048 bits. Action recommended: contact your hosting provider to upgrade the TLS configuration and key size.

D — Certificate expires in under 7 days. Urgent action required: renew immediately to avoid visitor-blocking security warnings.

F — Certificate is expired, unreachable, or self-signed on a public domain. Visitors are seeing a browser security warning right now. Renew and reinstall the certificate immediately.`,
  },
  {
    q: "What is the difference between SSL and TLS, and which version should my site use?",
    a: `SSL (Secure Sockets Layer) was the original protocol for encrypting web connections, developed by Netscape in the 1990s. It was replaced by TLS (Transport Layer Security), which is the current standard. Despite this, the industry still calls digital certificates "SSL certificates" — a legacy naming convention.

Version history and status:
• SSL 2.0 (1995) — Retired. Critically vulnerable.
• SSL 3.0 (1996) — Retired. Vulnerable to POODLE attack.
• TLS 1.0 (1999) — Deprecated by all major browsers in 2020.
• TLS 1.1 (2006) — Deprecated by all major browsers in 2020.
• TLS 1.2 (2008) — Still widely supported and acceptable. Minimum standard.
• TLS 1.3 (2018) — Current best practice. Faster (1-RTT handshake vs 2-RTT), removes weak cipher options, mandatory forward secrecy.

You should target TLS 1.3 with TLS 1.2 as a fallback for legacy clients. TLS 1.0 and 1.1 should be disabled entirely on your server. Most modern hosting platforms (Cloudflare, Nginx, Apache with OpenSSL 1.1+) support TLS 1.3 by default.`,
  },
  {
    q: "My SSL certificate is expiring — what exact steps do I take to renew it?",
    a: `The renewal process depends on how your certificate was originally issued:

Let's Encrypt (free, 90-day certificates):
Most hosting panels (cPanel, Plesk, Cloudflare, Netlify, Vercel) handle Let's Encrypt renewals automatically via a cron job or ACME client. If it's not auto-renewing, run: certbot renew (on your server), or enable automatic renewal in your hosting panel settings.

Commercial certificates (DigiCert, Sectigo, Comodo, etc.):
1. Generate a new CSR (Certificate Signing Request) from your server or hosting panel.
2. Submit the CSR to your certificate authority and complete domain validation.
3. Download the issued certificate files (.crt + .ca-bundle).
4. Install them via your hosting panel or server config (Nginx: ssl_certificate path; Apache: SSLCertificateFile path).
5. Reload your web server: nginx -s reload or systemctl restart apache2.
6. Verify with our SSL checker — the new expiry date should reflect the renewed term.

After renewal, always re-check with our tool to confirm the new certificate is live and the grade is A or A+.`,
  },
  {
    q: "What are Subject Alternative Names (SANs) and what is a wildcard certificate?",
    a: `Subject Alternative Names (SANs) are the list of hostnames that a single certificate is authorised to protect. Modern certificates stopped relying on the older "Common Name" field and now use SANs exclusively for multi-domain coverage.

A typical certificate might include these SANs:
• example.com (the apex domain)
• www.example.com (the www subdomain)
• mail.example.com (the mail server)
• api.example.com (an API endpoint)

A wildcard certificate uses an asterisk: *.example.com. This covers every subdomain one level deep — www.example.com, api.example.com, blog.example.com — but NOT sub-subdomains like staging.api.example.com, and NOT the apex domain example.com itself (though most wildcard certificates also include example.com as a second SAN).

Multi-domain (SAN/UCC) certificates can include completely different base domains in their SAN list — example.com and totally-different.com in a single certificate. This is common for SaaS platforms that serve multiple customer domains from shared infrastructure.

Our SSL checker displays the complete SAN list so you can verify all hostnames are covered before going live.`,
  },
  {
    q: "Does having an SSL certificate help with Google SEO rankings?",
    a: `Yes — HTTPS has been an official Google ranking signal since 2014, when Google announced it as a "lightweight" ranking factor. In practice, the signal is meaningful: sites without HTTPS receive a visible "Not Secure" warning in Chrome (affecting ~65% of global browser users), which increases bounce rates and damages trust — both of which hurt rankings indirectly.

What matters for SEO specifically:
• Valid, unexpired certificate — expired certs trigger security warnings that prevent users from accessing your site at all.
• HTTPS implemented site-wide — not just the homepage. All pages should redirect HTTP to HTTPS with a 301 permanent redirect.
• Consistent canonical URLs — your site should use either https://example.com or https://www.example.com consistently everywhere, not a mix.
• No mixed content — all images, scripts and CSS loaded on HTTPS pages must also use HTTPS, or browsers will block or flag them.

A certificate grade of B or above is sufficient for SEO purposes. The difference between A and A+ won't affect rankings, but an expired certificate (grade F) can completely de-index your site if Google's crawler can't access it.`,
  },
];

/* ── Content Repositioned for UX ─────────────────────────────────────────── */
const FEATURES = [
  { icon:"🏅", title:"Security Grade A+ to F",       desc:"Instant letter grade based on TLS version, key strength and certificate validity." },
  { icon:"📅", title:"Expiry Countdown",             desc:"See exactly how many days remain before the certificate expires, colour-coded by urgency." },
  { icon:"🔒", title:"TLS Protocol Version",         desc:"Confirms whether the server uses TLS 1.3 (best), TLS 1.2 (acceptable) or older deprecated versions." },
  { icon:"🔑", title:"Cipher Suite & Key Strength",  desc:"Identifies the encryption algorithm and key size — 2048 bits is the current minimum standard." },
  { icon:"📋", title:"Full SAN List",                desc:"Lists every domain name the certificate covers, including wildcards and multi-domain entries." },
  { icon:"🔍", title:"SHA-256 Fingerprint",          desc:"Cryptographic fingerprint to verify certificate authenticity and detect potential spoofing." },
];

const USE_CASES = [
  { who:"Website Owners",    why:"Verify your certificate is valid and won't expire without warning, protecting your visitors and SEO." },
  { who:"Developers",        why:"Debug HTTPS connection issues, confirm the right certificate is deployed and check SANs during setup." },
  { who:"Security Teams",    why:"Audit cipher suites and TLS versions across your organisation's domains for compliance and hardening." },
  { who:"SEO Professionals", why:"HTTPS is a Google ranking factor. Check that certificates are valid before and after migrations." },
];

/* ── Security recommendations by grade ───────────────────────────────────── */
const GRADE_RECS: Record<string, { color:string; bg:string; border:string; icon:string; headline:string; actions:string[] }> = {
  "A+": { color:"text-green-400", bg:"bg-green-500/10", border:"border-green-500/20", icon:"✅", headline:"Excellent — your SSL configuration is optimal.",
    actions:["Schedule a renewal reminder 60 days before expiry.", "Re-check after any server migration or CDN change."] },
  "A":  { color:"text-green-400", bg:"bg-green-500/10", border:"border-green-500/20", icon:"✅", headline:"Strong configuration — minor improvements possible.",
    actions:["Verify auto-renewal is enabled if using Let's Encrypt.", "Consider TLS 1.3-only mode if you can drop legacy clients."] },
  "B":  { color:"text-cyan-400", bg:"bg-cyan-500/10", border:"border-cyan-500/20", icon:"⚠️", headline:"Good but room to improve.",
    actions:["Enable TLS 1.3 on your server — it's faster and more secure than TLS 1.2.", "Disable TLS 1.0 and TLS 1.1 if they're still enabled.", "Contact your hosting provider if you can't update settings directly."] },
  "B-": { color:"text-cyan-400", bg:"bg-cyan-500/10", border:"border-cyan-500/20", icon:"⚠️", headline:"Acceptable, but upgrades recommended.",
    actions:["Enable TLS 1.3 support.", "Review your cipher suite — prefer ECDHE with AES-GCM."] },
  "C":  { color:"text-yellow-400", bg:"bg-yellow-500/10", border:"border-yellow-500/20", icon:"🔶", headline:"Below current best practice — action recommended.",
    actions:["Upgrade TLS configuration to require TLS 1.2 minimum.", "Increase key size to 2048 bits or use ECDSA 256-bit key.", "Run an SSL Labs full scan for a detailed remediation report.", "Consider switching to a modern CDN (Cloudflare, Fastly) for automatic TLS hardening."] },
  "D":  { color:"text-orange-400", bg:"bg-orange-500/10", border:"border-orange-500/20", icon:"🚨", headline:"Certificate expires very soon — renew immediately.",
    actions:["Log in to your hosting panel and renew the certificate NOW.", "If using Let's Encrypt, run: certbot renew --force-renewal.", "Verify the renewed certificate is live with this checker.", "Enable auto-renewal to prevent this recurring."] },
  "F":  { color:"text-red-400", bg:"bg-red-500/10", border:"border-red-500/20", icon:"🔴", headline:"Certificate is expired or invalid — visitors are blocked.",
    actions:["Your site is showing a browser security warning to all visitors right now.", "Renew immediately via your hosting panel or Let's Encrypt.", "After installing the new certificate, restart your web server.", "Re-check here to confirm the grade has improved."] },
};

const GRADE_COLORS: Record<string, string> = {
  "A+": "text-green-400 bg-green-400/10 border-green-400/30",
  "A":  "text-green-400 bg-green-400/10 border-green-400/30",
  "B":  "text-cyan-400  bg-cyan-400/10  border-cyan-400/30",
  "B-": "text-cyan-400  bg-cyan-400/10  border-cyan-400/30",
  "C":  "text-yellow-400 bg-yellow-400/10 border-yellow-400/30",
  "D":  "text-orange-400 bg-orange-400/10 border-orange-400/30",
  "F":  "text-red-400   bg-red-400/10   border-red-400/30",
};

const GRADE_LABEL: Record<string, string> = {
  "A+":"Excellent", "A":"Strong", "B":"Good", "B-":"Fair", "C":"Weak", "D":"Critical", "F":"Failed",
};

// ✅ Rule 10: POPULAR at module scope — POPULAR.map() below matches
const POPULAR = ["google.com","github.com","cloudflare.com","stripe.com","vercel.com","mozilla.org"];

interface CertResult {
  domain:string; grade:string; valid:boolean; daysLeft:number; pctUsed:number;
  validFrom:string; validTo:string; subject:Record<string,string>;
  issuer:Record<string,string>; serialNumber:string; fingerprint:string;
  fingerprint256:string; bits:number; subjectAltName:string;
  protocol:string; cipherName:string; cipherVersion:string; selfSigned:boolean;
}

export default function SSLCheckerClient({ children }: { children?: React.ReactNode }) {
  useTrackTool("ssl-checker", "security"); // ✅ Rule 3

  const [domain,  setDomain]  = useState("");
  const [loading, setLoading] = useState(false);
  const [result,  setResult]  = useState<CertResult | null>(null);
  const [error,   setError]   = useState("");

  const check = async (d?: string) => {
    const target = (d ?? domain).trim().replace(/^https?:\/\//i, "").split("/")[0];
    if (!target) return;
    setLoading(true); setError(""); setResult(null);
    try {
      const res  = await fetch(`/api/ssl-check?domain=${encodeURIComponent(target)}`);
      const data = await res.json();
      if (data.error) setError(data.error);
      else setResult(data);
    } catch { setError("Request failed — check your internet connection."); }
    setLoading(false);
  };

  const rec        = result ? (GRADE_RECS[result.grade] ?? GRADE_RECS["C"]) : null;
  const gradeColor = result ? (GRADE_COLORS[result.grade] ?? "text-gray-400 bg-gray-400/10 border-gray-400/30") : "";
  const gradeLabel = result ? (GRADE_LABEL[result.grade] ?? "") : "";

  const expiryBarColor = result
    ? result.daysLeft < 0  ? "bg-red-500"
    : result.daysLeft < 7  ? "bg-red-500"
    : result.daysLeft < 30 ? "bg-orange-500"
    : result.daysLeft < 90 ? "bg-yellow-500"
    : "bg-green-500" : "";

  const sans      = result?.subjectAltName?.split(",").map(s => s.trim().replace(/^DNS:/, "")) ?? [];
  const issuerOrg = result?.issuer?.O ?? result?.issuer?.CN ?? "Unknown";
  const subjCN    = result?.subject?.CN ?? "";

  return (
    // ✅ Rule 6: flex flex-col overflow-x-hidden
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans flex flex-col overflow-x-hidden">

      {/* ── Navbar — ✅ Rule 4: sticky + backdrop-blur (already had both) + Go Pro ── */}
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
      <main className="max-w-3xl mx-auto px-4 py-10 flex-grow w-full">

        {/* ✅ Rule 11: aria-label + /categories/security + aria-hidden on › */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-6 flex items-center gap-2">
          <Link href="/"      className="hover:text-gray-400 transition-colors">Home</Link><span aria-hidden="true">›</span>
          <Link href="/tools" className="hover:text-gray-400 transition-colors">Tools</Link><span aria-hidden="true">›</span>
          <Link href="/categories/security" className="hover:text-gray-400 transition-colors">Security Tools</Link><span aria-hidden="true">›</span>
          <span className="text-gray-400">SSL Checker</span>
        </nav>

        {/* Server-rendered hero */}
        {children}

        {/* Domain input — ✅ QA FIX: min-w-0 w-full added */}
        <div className="flex gap-2 mb-4 min-w-0 w-full">
          <input value={domain} onChange={e => setDomain(e.target.value)}
            onKeyDown={e => e.key === "Enter" && check()}
            placeholder="e.g. example.com or https://example.com"
            className="flex-1 min-w-0 px-4 py-3 rounded-xl bg-[#13131F] border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-[#00D4FF]/50 transition-all" />
          <button onClick={() => check()} disabled={loading}
            className="px-6 py-3 rounded-xl bg-[#00D4FF] hover:bg-[#00b8d9] disabled:opacity-50 text-black font-extrabold text-sm transition-all min-w-[80px]">
            {loading ? "…" : "Check"}
          </button>
        </div>

        {/* Quick-pick domains */}
        <div className="flex flex-wrap gap-2 mb-7">
          <span className="text-xs text-gray-600 self-center">Try:</span>
          {POPULAR.map(d => (
            <button key={d} onClick={() => { setDomain(d); check(d); }}
              className="px-3 py-1.5 rounded-lg bg-[#13131F] border border-white/5 text-gray-400 text-xs hover:text-white hover:border-[#00D4FF]/30 transition-all font-mono">
              {d}
            </button>
          ))}
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-xl px-4 py-3 mb-5">{error}</div>
        )}

        {loading && (
          <div className="text-center py-14 text-gray-400">
            <div className="text-4xl mb-3 animate-pulse">🔒</div>
            <div className="text-sm">Connecting to <span className="text-white font-mono">{domain}</span>…</div>
            <div className="text-xs text-gray-600 mt-1">Retrieving certificate via TLS handshake</div>
          </div>
        )}

        {result && (
          <div className="space-y-4 min-w-0 w-full">

            {/* Main grade card */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6 min-w-0 w-full">
              <div className="flex items-start gap-5">
                <div className={`text-4xl font-black border-2 rounded-2xl w-20 h-20 flex flex-col items-center justify-center flex-shrink-0 ${gradeColor}`}>
                  <span className="leading-none">{result.grade}</span>
                  <span className="text-xs font-semibold mt-0.5 opacity-80">{gradeLabel}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1 min-w-0 w-full">
                    <span className="text-lg font-extrabold text-white font-mono truncate">{result.domain}</span>
                    {result.selfSigned && (
                      <span className="text-xs bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 px-2 py-0.5 rounded-full font-semibold flex-shrink-0">
                        Self-signed
                      </span>
                    )}
                  </div>
                  <div className={`text-sm font-semibold mb-3 ${result.valid && result.daysLeft > 0 ? "text-green-400" : "text-red-400"}`}>
                    {result.valid && result.daysLeft > 0
                      ? `✓ Certificate valid — ${result.daysLeft} day${result.daysLeft !== 1 ? "s" : ""} remaining`
                      : result.daysLeft < 0 ? "✗ Certificate has expired" : "✗ Certificate invalid"}
                  </div>
                  <div className="mb-1.5">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Issued {new Date(result.validFrom).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}</span>
                      <span>Expires {new Date(result.validTo).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}</span>
                    </div>
                    <div className="h-2.5 bg-[#0A0A14] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${expiryBarColor}`}
                        style={{ width:`${Math.max(2, 100 - Math.min(result.pctUsed, 100))}%` }} />
                    </div>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-500 flex-wrap">
                    <span>{result.protocol ?? "—"}</span>
                    <span>·</span>
                    <span>{result.cipherName ?? "—"}</span>
                    <span>·</span>
                    <span>{result.bits ? `${result.bits}-bit key` : "—"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Security recommendation */}
            {rec && (
              <div className={`rounded-2xl p-5 border ${rec.bg} ${rec.border} min-w-0 w-full`}>
                <div className={`font-bold text-sm mb-2 ${rec.color}`}>{rec.icon} {rec.headline}</div>
                <ul className="space-y-1">
                  {rec.actions.map((a, i) => (
                    <li key={i} className="text-xs text-gray-400 flex gap-2">
                      <span className="flex-shrink-0 mt-0.5">›</span><span>{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ✅ QA FIX: min-w-0 w-full on parent grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-w-0 w-full">
              {[
                { label:"Common Name",    value:subjCN || "—"              },
                { label:"Certificate CA", value:issuerOrg                  },
                { label:"Issuer Country", value:result.issuer?.C ?? "—"    },
                { label:"Protocol",       value:result.protocol ?? "—"     },
                { label:"Cipher Suite",   value:result.cipherName ?? "—"   },
                { label:"Key Strength",   value:result.bits ? `${result.bits} bits` : "—" },
              ].map(row => (
                <div key={row.label} className="min-w-0 bg-[#13131F] border border-white/5 rounded-xl px-4 py-3">
                  <div className="text-xs text-gray-500 mb-0.5">{row.label}</div>
                  <div className="text-sm font-semibold text-white font-mono truncate" title={row.value}>{row.value}</div>
                </div>
              ))}
            </div>

            {/* ── Fingerprint ─────────────────────────────────────────────── */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 min-w-0 w-full">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">SHA-256 Fingerprint</div>
              <div className="font-mono text-xs text-white break-all leading-relaxed bg-[#0A0A14] rounded-xl px-3 py-2.5">
                {result.fingerprint256 || result.fingerprint || "—"}
              </div>
            </div>

            {/* ── Subject Alternative Names ─────────────────────────────── */}
            {sans.length > 0 && (
              <div className="bg-[#13131F] border border-white/5 rounded-2xl p-4 min-w-0 w-full">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
                  Subject Alternative Names ({sans.length})
                </div>
                <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto min-w-0 w-full">
                  {sans.map((san, i) => (
                    // ✅ QA FIX: Added break-all to SAN badges to prevent mobile blowout on long domains
                    <span key={i} className="text-xs bg-[#0A0A14] border border-white/10 px-2 py-0.5 rounded-lg font-mono text-gray-300 break-all">
                      {san}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Re-check button */}
            <button onClick={() => check(result.domain)}
              className="w-full py-3 rounded-xl text-xs font-bold bg-[#13131F] border border-white/10 text-gray-400 hover:text-white hover:border-[#00D4FF]/30 transition-all">
              ↻ Re-check {result.domain}
            </button>
          </div>
        )}

        {/* ── Re-positioned SEO Content (Below Tool, Above How-to) ── */}
        <div className="mt-16 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-[#13131F] border border-white/5 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-sm font-bold text-white">{f.title}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-white mb-3">Who uses the SSL Checker?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {USE_CASES.map(u => (
                <div key={u.who} className="flex gap-3">
                  <span className="text-[#00D4FF] font-extrabold text-sm flex-shrink-0 mt-0.5">→</span>
                  <div>
                    <span className="text-sm font-semibold text-white">{u.who}: </span>
                    <span className="text-sm text-gray-400">{u.why}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How to Use */}
        <div className="mt-12 bg-[#13131F] border border-white/5 rounded-2xl p-6">
          <h2 className="text-xl font-extrabold text-white mb-5">How to Use the SSL Checker</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              { step:"1", title:"Enter a domain",            desc:"Type any domain (e.g. example.com) or click a popular domain shortcut. The https:// prefix is stripped automatically." },
              { step:"2", title:"Click Check",               desc:"The tool connects directly to the domain via TLS handshake and retrieves the live certificate — typically in under 3 seconds." },
              { step:"3", title:"Read the grade & details",  desc:"Review the letter grade (A+ to F), expiry countdown, TLS version, cipher suite, issuer and Subject Alternative Names." },
              { step:"4", title:"Act on the recommendation", desc:"Each grade comes with specific next steps. After renewing an expired certificate, click Re-check to confirm the new cert is live." },
            ].map(s => (
              <div key={s.step} className="flex gap-3">
                <div className="w-7 h-7 rounded-full bg-[#00D4FF] flex items-center justify-center text-black font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</div>
                <div>
                  <div className="font-semibold text-white text-sm mb-1">{s.title}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ — Rule 8: <details>/<summary>, Rule 10: FAQ.map() matches const FAQ above */}
        <div className="mt-10 max-w-3xl">
          <h2 className="text-2xl font-extrabold text-white mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <details key={i} className="group bg-[#13131F] border border-white/5 rounded-2xl overflow-hidden hover:border-[#00D4FF]/20 transition-all">
                <summary className="px-6 py-4 cursor-pointer flex items-center justify-between gap-4 text-white font-semibold text-sm list-none">
                  <span>{f.q}</span>
                  <span className="text-[#00D4FF] text-xl flex-shrink-0 transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed whitespace-pre-line">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </main>

      {/* ✅ Rule 5: Privacy/Terms/Contact + © 2026 */}
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
