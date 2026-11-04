import { createAdminClient } from "@/lib/supabase";
import { NextResponse } from "next/server";

// GET /api/admin/stats
// Returns all real data for the admin dashboard.
// Protected by service role key — only callable from server context.
// TODO Phase 3B: add auth middleware to protect this route from public access.

export async function GET() {
  try {
    const sb = createAdminClient();

    const todayStart  = new Date(); todayStart.setHours(0,0,0,0);
    const weekAgo     = new Date(Date.now() - 7  * 86_400_000);
    const monthStart  = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);

    // Run all queries in parallel
    const [
      totalRes,
      todayRes,
      weekRes,
      monthRes,
      topToolsRes,
      categoriesRes,
      recentRes,
      dailyRes,
      hourlyRes,
    ] = await Promise.all([
      // Total all-time uses
      sb.from("tool_uses").select("*", { count: "exact", head: true }),
      // Today
      sb.from("tool_uses").select("*", { count: "exact", head: true })
        .gte("created_at", todayStart.toISOString()),
      // Last 7 days
      sb.from("tool_uses").select("*", { count: "exact", head: true })
        .gte("created_at", weekAgo.toISOString()),
      // This month
      sb.from("tool_uses").select("*", { count: "exact", head: true })
        .gte("created_at", monthStart.toISOString()),
      // Top 10 tools (via RPC function)
      sb.rpc("get_top_tools", { n: 10 }),
      // Category breakdown (via RPC)
      sb.rpc("get_category_stats"),
      // Recent 25 events
      sb.from("tool_uses")
        .select("id, tool_slug, tool_category, created_at")
        .order("created_at", { ascending: false })
        .limit(25),
      // Daily trend last 7 days (via RPC)
      sb.rpc("get_daily_trend", { days: 7 }),
      // Hourly trend today (via RPC)
      sb.rpc("get_hourly_today"),
    ]);

    return NextResponse.json({
      totalUses:  totalRes.count  ?? 0,
      todayUses:  todayRes.count  ?? 0,
      weekUses:   weekRes.count   ?? 0,
      monthUses:  monthRes.count  ?? 0,
      topTools:   topToolsRes.data   ?? [],
      categories: categoriesRes.data ?? [],
      recent:     recentRes.data     ?? [],
      dailyTrend: dailyRes.data      ?? [],
      hourlyToday:hourlyRes.data     ?? [],
      fetchedAt:  new Date().toISOString(),
    });
  } catch (err) {
    console.error("[admin/stats]", err);
    return NextResponse.json({ error: "Stats fetch failed" }, { status: 500 });
  }
}
