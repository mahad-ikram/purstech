"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [form,      setForm]      = useState({ name:"", email:"", subject:"", message:"" });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    // Simulate submission delay
    await new Promise(r => setTimeout(r, 800));
    setSubmitted(true);
    setLoading(false);
  };

  const CONTACT_ITEMS = [
    { icon:"📧", label:"General Enquiries",  value:"hello@purstech.com",   href:"mailto:hello@purstech.com"   },
    { icon:"🔒", label:"Privacy & Data",     value:"privacy@purstech.com", href:"mailto:privacy@purstech.com" },
    { icon:"⚖️", label:"Legal",              value:"legal@purstech.com",   href:"mailto:legal@purstech.com"   },
    { icon:"💳", label:"Billing & Pro",      value:"billing@purstech.com", href:"mailto:billing@purstech.com" },
  ];

  const FAQ_ITEMS = [
    { q:"How do I report a bug?",           a:"Use the contact form and select 'Bug Report' as the subject. Please include the tool name, what you were doing and what went wrong." },
    { q:"Can I suggest a new tool?",        a:"Absolutely — we love suggestions! Use the form below and tell us what tool you need and why it would be useful." },
    { q:"How do I cancel my Pro subscription?", a:"Log into your account, go to Settings, and click Cancel Subscription. You will keep Pro access until the end of your billing period." },
    { q:"Is my data safe in your tools?",   a:"Yes. All tool processing happens in your browser. We never store what you type into any tool." },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      {/* Navbar */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">← Home</Link>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-16">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-600 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-400">Contact</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-4 py-1.5 text-xs text-[#6C3AFF] font-semibold mb-4">
            Get in Touch
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Contact Us</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Have a question, suggestion or found a bug? We&apos;d love to hear from you.
            We typically respond within 24–48 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* Left: Contact details */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Email contacts */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Contact Details</h2>
              <div className="space-y-4">
                {CONTACT_ITEMS.map(item => (
                  <a key={item.label} href={item.href}
                    className="flex items-center gap-3 group">
                    <div className="w-10 h-10 bg-[#6C3AFF]/10 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium">{item.label}</div>
                      <div className="text-sm text-[#6C3AFF] group-hover:text-[#00D4FF] transition-colors font-medium">
                        {item.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Response time */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Response Times</h2>
              <div className="space-y-3">
                {[
                  { label:"General enquiries",  time:"24–48 hours" },
                  { label:"Bug reports",        time:"24 hours"    },
                  { label:"Billing issues",     time:"12–24 hours" },
                  { label:"Privacy requests",   time:"72 hours"    },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{r.label}</span>
                    <span className="text-white font-semibold">{r.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social */}
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-6">
              <h2 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Follow Us</h2>
              <div className="space-y-3">
                {[
                  { label:"Twitter / X",  handle:"@purstech", href:"https://twitter.com/purstech"  },
                  { label:"LinkedIn",     handle:"PursTech",  href:"https://linkedin.com/company/purstech" },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                    className="flex justify-between text-sm hover:text-[#6C3AFF] transition-colors">
                    <span className="text-gray-500">{s.label}</span>
                    <span className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors font-semibold">{s.handle}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Contact form */}
          <div className="lg:col-span-3">
            <div className="bg-[#13131F] border border-white/5 rounded-2xl p-8">
              <h2 className="text-lg font-extrabold text-white mb-6">Send Us a Message</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-extrabold text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-500 mb-6">
                    Thanks for reaching out. We&apos;ll get back to you within 24–48 hours.
                  </p>
                  <button onClick={() => { setSubmitted(false); setForm({ name:"", email:"", subject:"", message:"" }); }}
                    className="px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white font-bold text-sm transition-all">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">
                        Your Name *
                      </label>
                      <input type="text" value={form.name} onChange={e => set("name", e.target.value)}
                        placeholder="John Smith"
                        className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">
                        Email Address *
                      </label>
                      <input type="email" value={form.email} onChange={e => set("email", e.target.value)}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm" />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">
                      Subject
                    </label>
                    <select value={form.subject} onChange={e => set("subject", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm">
                      <option value="">Select a subject...</option>
                      <option value="general">General Enquiry</option>
                      <option value="bug">Bug Report</option>
                      <option value="suggestion">Tool Suggestion</option>
                      <option value="billing">Billing / Pro Subscription</option>
                      <option value="privacy">Privacy / Data Request</option>
                      <option value="partnership">Partnership / Business</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-500 font-medium block mb-2 uppercase tracking-wider">
                      Message *
                    </label>
                    <textarea value={form.message} onChange={e => set("message", e.target.value)}
                      rows={6} placeholder="Tell us how we can help..."
                      className="w-full px-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm resize-none" />
                    <div className="text-right text-xs text-gray-600 mt-1">{form.message.length} / 2000</div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!form.name || !form.email || !form.message || loading}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold transition-all shadow-lg shadow-violet-900/30">
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : "Send Message →"}
                  </button>

                  <p className="text-xs text-gray-600 text-center">
                    By submitting this form you agree to our{" "}
                    <Link href="/privacy" className="text-[#6C3AFF] hover:text-[#00D4FF] transition-colors">Privacy Policy</Link>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="bg-[#13131F] border border-white/5 rounded-2xl p-5">
                <h3 className="font-bold text-white text-sm mb-2">{item.q}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>

      </main>

      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
        <div className="flex justify-center gap-6 mt-3 text-xs text-gray-600">
          <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms"   className="hover:text-gray-400 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-400 transition-colors">Contact</Link>
        </div>
        <p className="text-gray-700 text-xs mt-3">© 2025 PursTech. All rights reserved.</p>
      </footer>
    </div>
  );
}
