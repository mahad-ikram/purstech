import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PursTech — The World's Largest Free Tool Ecosystem",
  description:
    "Learn about PursTech — who we are, what we built, and why we believe every person on the internet deserves access to professional-grade tools for free.",
};

const STATS = [
  { value: "20+",  label: "Free Tools"         },
  { value: "190+", label: "Countries Reached"  },
  { value: "0",    label: "Login Required"     },
  { value: "$0",   label: "Cost to Use"        },
];

const VALUES = [
  {
    icon: "🔓",
    title: "Free Forever",
    desc:  "Every core tool on PursTech is free. No paywalls, no trial periods, no credit card required. We believe access to great tools should not depend on your budget.",
  },
  {
    icon: "🔒",
    title: "Private by Default",
    desc:  "All tool processing happens in your browser. We never store what you type, paste or upload into any tool. Your data stays on your device.",
  },
  {
    icon: "⚡",
    title: "Instant Results",
    desc:  "No waiting, no loading spinners. Every tool on PursTech delivers results the moment you need them — built for speed from the ground up.",
  },
  {
    icon: "🤖",
    title: "Powered by AI",
    desc:  "Our AI agents continuously research trending tools, build new ones, and write helpful content — so PursTech grows and improves every single day automatically.",
  },
];

const TEAM = [
  {
    icon: "👨‍💻",
    name: "The PursTech Team",
    role: "Builders & Creators",
    desc: "We are a small, passionate team of developers and designers who got tired of hunting across dozens of websites for basic tools. So we built one place that has everything.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      {/* Navbar */}
      <nav className="border-b border-white/5 px-4 py-4 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-black">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/tools"   className="text-sm text-gray-500 hover:text-white transition-colors">Tools</Link>
            <Link href="/blog"    className="text-sm text-gray-500 hover:text-white transition-colors">Blog</Link>
            <Link href="/contact" className="text-sm text-gray-500 hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-16">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-600 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-400">About</span>
        </nav>

        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-4 py-1.5 text-xs text-[#6C3AFF] font-semibold mb-5">
            Our Story
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 leading-tight">
            We Built the Tool Website
            <br />
            <span className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] bg-clip-text text-transparent">
              We Always Wished Existed
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Every day, millions of people search for simple tools — a word counter, a JSON formatter,
            a password generator. They land on cluttered, ad-heavy websites that barely work on mobile.
            We decided to fix that.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-16">
          {STATS.map((s) => (
            <div key={s.label}
              className="bg-[#13131F] border border-white/5 rounded-2xl p-5 text-center hover:border-[#6C3AFF]/30 transition-colors">
              <div className="text-3xl font-extrabold text-[#6C3AFF] mb-1">{s.value}</div>
              <div className="text-xs text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Our story */}
        <div className="bg-[#13131F] border border-white/5 rounded-3xl p-8 md:p-10 mb-16">
          <h2 className="text-2xl font-extrabold text-white mb-6">The Problem We Solved</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              Think about the last time you needed to format a JSON file, compress an image, or generate
              a strong password. You probably opened a new tab, typed something into Google, clicked the
              first result, and were immediately greeted by a wall of ads, a cookie banner, a newsletter
              popup, and a tool that looked like it was built in 2009.
            </p>
            <p>
              That experience — repeated by millions of people every single day — is what PursTech was
              built to replace. We wanted a single destination where every tool is fast, clean,
              mobile-friendly, and completely free. No login walls. No usage limits on the basics.
              No hunting around.
            </p>
            <p>
              We started with 20 of the most-searched tools on the internet — from word counters and
              JSON formatters to QR code generators and password tools. Every single one was designed
              from scratch with three non-negotiable principles: it must be fast, it must be private,
              and it must actually work.
            </p>
            <p>
              Today PursTech serves users in over 190 countries. We add new tools every week and our
              AI-powered content system ensures every tool comes with clear documentation, how-to guides,
              and answers to the most common questions. We are just getting started.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-white text-center mb-10">What We Stand For</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map((v) => (
              <div key={v.title}
                className="bg-[#13131F] border border-white/5 rounded-2xl p-6 hover:border-[#6C3AFF]/30 transition-colors">
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="font-extrabold text-white text-base mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#6C3AFF] via-[#4B2CC0] to-[#00D4FF] p-px mb-16">
          <div className="bg-[#0D0D1A] rounded-3xl p-8 md:p-10 text-center">
            <h2 className="text-2xl font-extrabold text-white mb-4">Our Mission</h2>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto">
              To give every person on the internet — regardless of their budget, location or technical
              skill — access to professional-grade tools that save time, solve problems and make work
              easier. Completely free. Always.
            </p>
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-2xl font-extrabold text-white text-center mb-8">Who We Are</h2>
          {TEAM.map((member) => (
            <div key={member.name}
              className="bg-[#13131F] border border-white/5 rounded-2xl p-6 flex items-start gap-5">
              <div className="w-14 h-14 bg-[#6C3AFF]/20 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">
                {member.icon}
              </div>
              <div>
                <div className="font-extrabold text-white text-base">{member.name}</div>
                <div className="text-[#6C3AFF] text-xs font-semibold mb-2">{member.role}</div>
                <p className="text-gray-500 text-sm leading-relaxed">{member.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-[#13131F] border border-white/5 rounded-3xl p-10">
          <h2 className="text-2xl font-extrabold text-white mb-3">Ready to Stop Searching?</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Browse our full collection of free tools — no account needed, no limits on the basics.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/tools"
              className="px-8 py-4 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold transition-all shadow-lg shadow-violet-900/30">
              Browse All Tools →
            </Link>
            <Link href="/contact"
              className="px-8 py-4 rounded-xl bg-[#13131F] border border-white/10 hover:border-[#6C3AFF]/40 text-white font-bold transition-all">
              Get in Touch
            </Link>
          </div>
        </div>

      </main>

      <footer className="border-t border-white/5 mt-20 py-8 text-center">
        <Link href="/" className="text-xl font-black">
          Purs<span className="text-[#6C3AFF]">Tech</span>
        </Link>
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
