import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog — Tips, Guides & Tool News | PursTech",
  description: "The PursTech blog — tutorials, tool guides, developer tips and product updates. Coming soon.",
};

const UPCOMING_POSTS = [
  { icon:"🔧", category:"Developer Tools", title:"Top 10 Free JSON Tools Every Developer Needs in 2025",       desc:"A deep dive into the best free JSON formatters, validators and converters available online." },
  { icon:"🖼️", category:"Image Tools",     title:"How to Compress Images Without Losing Quality",             desc:"A practical guide to reducing image file size for web — formats, tools and best practices." },
  { icon:"🔒", category:"Security",        title:"Why Password Generators Matter — and How to Use Them",       desc:"Everything you need to know about generating strong passwords and keeping your accounts safe." },
  { icon:"📊", category:"SEO",             title:"Free SEO Tools That Actually Work in 2025",                  desc:"The definitive list of the best free SEO tools — from meta tag generators to keyword checkers." },
  { icon:"💱", category:"Finance",         title:"Currency Converter vs Your Bank — Why Rates Differ",         desc:"A plain-English explanation of mid-market rates, bank margins and how to get the best deal." },
  { icon:"🤖", category:"AI Tools",        title:"How AI Is Changing the Way We Use Online Tools",             desc:"From grammar checkers to image generators — how AI is making free tools dramatically more powerful." },
];

export default function BlogPage() {
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
          <span className="text-gray-400">Blog</span>
        </nav>

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-4 py-1.5 text-xs text-[#6C3AFF] font-semibold mb-4">
            ✍️ PursTech Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Tips, Guides &{" "}
            <span className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] bg-clip-text text-transparent">
              Tool News
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Tutorials, tool guides, developer tips and product updates — written by our team and powered by AI.
          </p>

          {/* Coming soon badge */}
          <div className="mt-8 inline-flex flex-col items-center gap-3 bg-[#13131F] border border-[#6C3AFF]/20 rounded-3xl px-8 py-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
              <span className="text-yellow-400 font-bold text-sm uppercase tracking-widest">Launching Soon</span>
            </div>
            <p className="text-gray-400 text-sm max-w-sm text-center">
              Our AI writer (Quill) is preparing the first batch of articles. The blog launches in the coming weeks — subscribe below to be notified.
            </p>
          </div>
        </div>

        {/* Upcoming posts preview */}
        <div className="mb-16">
          <h2 className="text-xl font-extrabold text-white mb-2">Coming Soon</h2>
          <p className="text-gray-500 text-sm mb-8">Here&apos;s a preview of what we&apos;re working on:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {UPCOMING_POSTS.map((post, i) => (
              <div key={i}
                className="bg-[#13131F] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 opacity-70 hover:opacity-90 transition-opacity">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{post.icon}</span>
                  <span className="text-xs text-[#6C3AFF] font-semibold bg-[#6C3AFF]/10 px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                </div>
                <h3 className="font-bold text-white text-sm leading-snug">{post.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed flex-1">{post.desc}</p>
                <div className="flex items-center gap-2 text-xs text-gray-600 pt-2 border-t border-white/5">
                  <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                  <span>Coming soon</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter subscribe */}
        <div className="bg-gradient-to-r from-[#6C3AFF]/10 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-3xl p-10 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
            Get Notified When We Launch
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            Be the first to read our guides. We also send 5 new tool recommendations every week — free, no spam.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="your@email.com"
              className="flex-1 px-5 py-4 rounded-xl bg-[#13131F] border border-[#6C3AFF]/30 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4FF] transition-all text-sm" />
            <button className="px-7 py-4 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold transition-all duration-300 whitespace-nowrap">
              Notify Me →
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-3">No spam. Unsubscribe at any time.</p>
        </div>

        {/* Browse tools CTA */}
        <div className="mt-10 text-center">
          <p className="text-gray-500 text-sm mb-4">While you wait — explore our tools:</p>
          <Link href="/tools"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[#13131F] border border-white/5 hover:border-[#6C3AFF]/30 text-white font-bold transition-all">
            Browse All Tools →
          </Link>
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
