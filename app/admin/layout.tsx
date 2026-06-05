"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

// ─── Auth check ───────────────────────────────────────────────────────────────
// Simple password protection stored in sessionStorage.
// Replace ADMIN_PASSWORD with your own strong password.

const ADMIN_PASSWORD = "purstech2025admin"; // ← CHANGE THIS to your own password

// ✅ Added: Messages nav item — second from the top so it's visible
const NAV_ITEMS = [
  { icon: "📊", label: "Dashboard",    href: "/admin"           },
  { icon: "💬", label: "Messages",     href: "/admin/messages"  },
  { icon: "🔧", label: "Tools",        href: "/admin/tools"     },
  { icon: "🤖", label: "AI Agents",    href: "/admin/agents"    },
  { icon: "📝", label: "Blog",         href: "/admin/blog"      },
  { icon: "💰", label: "Revenue",      href: "/admin/revenue"   },
  { icon: "🔍", label: "SEO",          href: "/admin/seo"       },
  { icon: "👥", label: "Users",        href: "/admin/users"     },
  { icon: "⚙️", label: "Settings",     href: "/admin/settings"  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname();
  const router    = useRouter();
  const [auth,    setAuth]    = useState(false);
  const [checked, setChecked] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // ✅ Live unread message count — drives the badge on the Messages nav item
  const [newMessages, setNewMessages] = useState<number | null>(null);

  // Check auth on mount
  useEffect(() => {
    const ok = sessionStorage.getItem("purstech_admin") === "true";
    setAuth(ok);
    setChecked(true);
    if (!ok && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [pathname, router]);

  // ✅ Fetch unread message count + refresh every 30s
  const fetchNewCount = useCallback(() => {
    fetch("/api/admin/messages?status=new&limit=1")
      .then(r => r.ok ? r.json() : null)
      .then(j => setNewMessages(j?.counts?.new ?? 0))
      .catch(() => setNewMessages(null));
  }, []);

  useEffect(() => {
    if (!auth || pathname === "/admin/login") return;
    fetchNewCount();
    const id = setInterval(fetchNewCount, 30_000);
    return () => clearInterval(id);
  }, [auth, pathname, fetchNewCount]);

  const handleLogout = () => {
    sessionStorage.removeItem("purstech_admin");
    router.replace("/admin/login");
  };

  // Login page renders without sidebar
  if (pathname === "/admin/login") return <>{children}</>;

  // Loading flicker prevention
  if (!checked) return null;
  if (!auth)    return null;

  return (
    <div className="min-h-screen bg-[#0A0A14] text-white flex font-sans">

      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-[#0D0D1A] border-r border-white/5
        flex flex-col z-50 transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-xl font-black">Purs<span className="text-[#6C3AFF]">Tech</span></Link>
          <div className="text-xs text-gray-600 mt-1 font-medium">Admin Panel</div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-xs text-green-400 font-semibold">All systems live</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            // ✅ Show pink badge with unread count on the Messages item
            const hasBadge = item.href === "/admin/messages" && newMessages != null && newMessages > 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  active ? "bg-[#6C3AFF] text-white shadow-lg shadow-violet-900/30" : "text-gray-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {hasBadge ? (
                  <span className="bg-[#FF3A6C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
                    {newMessages! > 99 ? "99+" : newMessages}
                  </span>
                ) : active ? (
                  <span className="w-1.5 h-1.5 bg-white rounded-full" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/5 space-y-2">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-white hover:bg-white/5 transition-all">
            <span>🌐</span> View Live Site
          </Link>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all">
            <span>🚪</span> Log Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-[#0D0D1A] border-b border-white/5 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-white transition-colors p-1">☰</button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            {/* ✅ Unread messages indicator in topbar */}
            {newMessages != null && newMessages > 0 && (
              <Link href="/admin/messages"
                className="hidden sm:flex items-center gap-2 bg-[#FF3A6C]/10 border border-[#FF3A6C]/30 rounded-full px-3 py-1.5 text-xs hover:bg-[#FF3A6C]/20 transition-all">
                <span className="text-base">💬</span>
                <span className="text-[#FF3A6C] font-bold">{newMessages} new</span>
              </Link>
            )}
            <div className="hidden sm:flex items-center gap-2 bg-[#13131F] border border-white/5 rounded-full px-3 py-1.5 text-xs">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              <span className="text-gray-400">purstech.com</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#6C3AFF] flex items-center justify-center text-sm font-black">P</div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
