"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import GooglePreferredBadge from "@/components/GooglePreferredBadge";
import { BLOG_POSTS } from "./data";

// Schemas have been moved to page.tsx (server component) so crawlers see them
// without JavaScript. This file handles only interactive UI logic.

export default function BlogClient() {
  const [search,   setSearch]   = useState("");
  const [category, setCategory] = useState("All");

  const allPosts  = Object.values(BLOG_POSTS);
  const featured  = allPosts[0];
  const restPosts = allPosts.slice(1);

  const categories = useMemo(() => {
    const cats = new Set(allPosts.map(p => p.category));
    return ["All", ...Array.from(cats)];
  }, [allPosts]);

  const filteredPosts = useMemo(() => {
    return restPosts.filter(post => {
      const matchesSearch = !search.trim() ||
        post.title.toLowerCase().includes(search.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(search.toLowerCase()) ||
        post.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()));
      const matchesCategory = category === "All" || post.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [restPosts, search, category]);

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white font-sans">

      {/* ── Navbar — fixed: added /contact and /pro ── */}
      <nav className="border-b border-white/5 px-4 h-16 sticky top-0 bg-[#0A0A14]/95 backdrop-blur-md z-40 flex items-center w-full">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight flex-shrink-0">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link href="/tools" className="text-sm text-gray-400 hover:text-white transition-colors font-medium">All Tools</Link>
            <Link href="/blog" className="text-sm text-white font-semibold transition-colors">Blog</Link>
            <Link href="/about" className="hidden md:inline text-sm text-gray-400 hover:text-white transition-colors font-medium">About</Link>
            <Link href="/contact" className="hidden md:inline text-sm text-gray-400 hover:text-white transition-colors font-medium">Contact</Link>
            <Link href="/tools" className="px-3.5 py-1.5 rounded-lg bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-xs font-bold transition-all flex-shrink-0">
              50+ Free Tools ⚡
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-600 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
          <span aria-hidden="true">›</span>
          <span className="text-gray-400">Blog</span>
        </nav>

        {/* Hero */}
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 bg-[#6C3AFF]/10 border border-[#6C3AFF]/20 rounded-full px-4 py-1.5 text-xs text-[#6C3AFF] font-semibold mb-4">
            ✍️ PursTech Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Tips, Guides &amp;{" "}
            <span className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] bg-clip-text text-transparent">
              Tool News
            </span>
          </h1>
          <p className="text-gray-500 text-lg max-w-xl">
            Tutorials, tool guides, developer tips and product updates — written to help you work faster.
          </p>
        </div>

        {/* Featured post */}
        {featured && (
          <Link href={`/blog/${featured.slug}`}
            className="block group mb-12 relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#6C3AFF]/20 via-[#13131F] to-[#00D4FF]/10 border border-[#6C3AFF]/20 hover:border-[#6C3AFF]/50 transition-all hover:shadow-2xl hover:shadow-violet-900/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 md:p-12">
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="bg-gradient-to-r from-[#6C3AFF] to-[#00D4FF] text-white text-xs font-extrabold px-3 py-1 rounded-full">
                    ⭐ FEATURED
                  </span>
                  <span className="text-xs bg-[#6C3AFF]/10 text-[#6C3AFF] border border-[#6C3AFF]/20 px-2.5 py-1 rounded-full font-semibold">
                    {featured.category}
                  </span>
                  <span className="text-xs text-gray-500">{featured.readTime}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4 group-hover:text-[#00D4FF] transition-colors leading-snug">
                  {featured.title}
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">{featured.excerpt}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6C3AFF] to-[#00D4FF] flex items-center justify-center text-white font-extrabold">MI</div>
                  <div>
                    <div className="text-white font-semibold text-sm">Mahad Ikram</div>
                    <time dateTime={featured.publishedISO}>{featured.publishedAt}</time>
                  </div>
                </div>
              </div>
              <div className="hidden md:flex items-center justify-center">
                <div className="w-full h-64 bg-gradient-to-br from-[#6C3AFF]/30 to-[#00D4FF]/20 rounded-2xl flex items-center justify-center text-7xl">
                  📖
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Search + Category filter */}
        <div className="bg-[#13131F] border border-white/5 rounded-2xl p-5 mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0A0A14] border border-white/5 text-white placeholder-gray-600 focus:outline-none focus:border-[#6C3AFF]/50 transition-all text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    category === cat
                      ? "bg-[#6C3AFF] text-white shadow-lg"
                      : "bg-[#0A0A14] border border-white/5 text-gray-400 hover:text-white hover:border-white/10"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          {(search || category !== "All") && (
            <div className="text-xs text-gray-500 mt-3">
              Showing {filteredPosts.length} {filteredPosts.length === 1 ? "post" : "posts"}
              {search && <span> for &quot;{search}&quot;</span>}
            </div>
          )}
        </div>

        {/* Posts grid */}
        {filteredPosts.length === 0 ? (
          <div className="bg-[#13131F] border border-white/5 rounded-3xl p-16 text-center mb-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-extrabold text-white mb-2">No articles found</h3>
            <p className="text-gray-500 mb-6">Try a different search or category</p>
            <button
              onClick={() => { setSearch(""); setCategory("All"); }}
              className="px-6 py-3 rounded-xl bg-[#6C3AFF] hover:bg-[#5B2EE0] text-white text-sm font-bold transition-all"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {filteredPosts.map(post => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-[#13131F] border border-white/5 rounded-2xl p-6 hover:border-[#6C3AFF]/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-violet-900/20 flex flex-col gap-3"
              >
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
                  <time dateTime={post.publishedISO} className="text-xs text-gray-600">
                    {post.publishedAt}
                  </time>
                  <span className="text-xs text-[#6C3AFF] font-semibold group-hover:text-[#00D4FF] transition-colors">
                    Read article →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20 py-10 text-center bg-[#0A0A14] w-full min-w-0">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="text-xl font-black tracking-tight">
            Purs<span className="text-[#6C3AFF]">Tech</span>
          </Link>
          <p className="text-xs text-gray-500 mt-1.5">
            50+ Free Browser-Based Online Tools — No Login, No Limits, 100% Client-Side Privacy.
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-xs text-gray-400">
            <Link href="/tools" className="hover:text-white transition-colors">All Tools</Link>
            <Link href="/blog" className="hover:text-white transition-colors">Blog &amp; Guides</Link>
            <Link href="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
          </div>
          <p className="text-gray-600 text-xs mt-4">
            © 2026 PursTech · Engineered by <Link href="/about" className="text-gray-500 hover:text-gray-300">Mahad Ikram</Link>. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
