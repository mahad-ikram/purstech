import Link from "next/link";
import type { Metadata } from "next";
import { BLOG_POSTS } from "./[slug]/page";

export const metadata: Metadata = {
  title:       "Blog — Tips, Guides & Tool News | PursTech",
  description: "Tutorials, tool guides, developer tips and product updates from the PursTech team.",
};

export default function BlogPage() {
  const posts = Object.values(BLOG_POSTS);

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

      <main className="max-w-5xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav className="text-xs text-gray-600 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span>›</span>
          <span className="text-gray-400">Blog</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-4 py-1.5 text-xs text-[#6C3AFF] font-semibold mb-4">
            ✍️ PursTech Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Tips, Guides &{" "}
            <span className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] bg-clip-text text-transparent">
              Tool News
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Tutorials, tool guides, developer tips and product updates — written to help you work faster.
          </p>
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}
              className="group bg-[#13131F] border border-white/5 rounded-2xl p-6 hover:border-[#6C3AFF]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/20 flex flex-col gap-3">

              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-2.5 py-1 rounded-full font-semibold">
                  {post.category}
                </span>
                <span className="text-xs text-gray-600">{post.readTime}</span>
              </div>

              <h2 className="font-extrabold text-white text-base leading-snug group-hover:text-[#6C3AFF] transition-colors line-clamp-2">
                {post.title}
              </h2>

              <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 flex-1">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-xs text-gray-600">{post.publishedAt}</span>
                <span className="text-xs text-[#6C3AFF] font-semibold group-hover:text-[#00D4FF] transition-colors">
                  Read article →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Newsletter */}
        <div className="bg-gradient-to-r from-[#6C3AFF]/10 to-[#00D4FF]/10 border border-[#6C3AFF]/20 rounded-3xl p-10 text-center">
          <h2 className="text-2xl font-extrabold text-white mb-3">Get New Articles in Your Inbox</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm">
            We publish new guides every week. No spam, unsubscribe any time.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" placeholder="your@email.com"
              className="flex-1 px-5 py-3 rounded-xl bg-[#13131F] border border-[#6C3AFF]/30 text-white placeholder-gray-600 focus:outline-none focus:border-[#00D4FF] transition-all text-sm" />
            <button className="px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#FF3A6C] text-white font-bold transition-all text-sm whitespace-nowrap">
              Subscribe →
            </button>
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
