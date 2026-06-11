// app/api/admin/subscribers/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Admin endpoint for newsletter_subscribers (read-only).
// Auth: enforced by proxy.ts — matches /api/admin/:path*, so anonymous
// requests get 401 before this code ever runs.
// ─────────────────────────────────────────────────────────────────────────────

import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? "200"), 1000);

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, is_active, source, subscribed_at")
      .order("subscribed_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const subscribers = data ?? [];
    const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);

    return NextResponse.json({
      ok: true,
      subscribers,
      counts: {
        total:    subscribers.length,
        active:   subscribers.filter(s => s.is_active).length,
        today:    subscribers.filter(s => new Date(s.subscribed_at) >= todayStart).length,
      },
    });
  } catch (err) {
    console.error("[admin/subscribers] GET failed:", err);
    return NextResponse.json({ ok: false, error: "Could not load subscribers" }, { status: 500 });
  }
}
