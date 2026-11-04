import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

// POST /api/track
// Body: { slug: string, category: string, sessionId?: string }
//
// Called silently from every tool page on mount.
// Uses service role key — never exposed to the browser.
// Fails silently so it never breaks the tool itself.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, category, sessionId } = body;

    if (!slug || typeof slug !== "string") {
      return NextResponse.json({ ok: false, error: "Missing slug" }, { status: 400 });
    }

    const supabase = createAdminClient();

    const { error } = await supabase.from("tool_uses").insert({
      tool_slug:     slug.toLowerCase().trim(),
      tool_category: (category ?? "unknown").toLowerCase().trim(),
      session_id:    sessionId ?? null,
    });

    if (error) {
      console.error("[track] Supabase error:", error.message);
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[track] Unexpected error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
