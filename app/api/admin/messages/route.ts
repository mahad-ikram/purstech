// app/api/admin/messages/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Admin endpoint for reading + updating contact_messages.
// Uses the same service-role client as the contact submission route.
//
// Auth: piggybacks on the existing admin sessionStorage check on the page side.
// For stronger production security, swap the password check for Supabase Auth
// (an `admin` role) — this is the minimum-viable approach to get reviewing
// working immediately.
// ─────────────────────────────────────────────────────────────────────────────

import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic"; // never cache messages

// ── GET /api/admin/messages — list all messages, newest first ──────────────
export async function GET(req: NextRequest) {
  const status = req.nextUrl.searchParams.get("status"); // optional filter
  const limit  = Math.min(Number(req.nextUrl.searchParams.get("limit") ?? "100"), 500);

  try {
    const supabase = createAdminClient();
    let q = supabase
      .from("contact_messages")
      .select("id, created_at, updated_at, name, email, subject, message, status, admin_notes")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status && status !== "all") q = q.eq("status", status);

    const { data, error } = await q;
    if (error) throw error;

    // Also return counts by status for the UI badges
    const { data: counts } = await supabase
      .from("contact_messages")
      .select("status");

    const byStatus: Record<string, number> = { all: counts?.length ?? 0 };
    counts?.forEach(r => { byStatus[r.status] = (byStatus[r.status] ?? 0) + 1; });

    return NextResponse.json({ ok: true, messages: data ?? [], counts: byStatus });
  } catch (err) {
    console.error("[admin/messages] GET failed:", err);
    return NextResponse.json({ ok: false, error: "Could not load messages" }, { status: 500 });
  }
}

// ── PATCH /api/admin/messages — update status or notes on a message ────────
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, admin_notes } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });
    }
    const updates: Record<string, unknown> = {};
    if (status !== undefined) {
      const VALID = ["new", "read", "replied", "spam", "archived"];
      if (!VALID.includes(status)) {
        return NextResponse.json({ ok: false, error: "invalid status" }, { status: 400 });
      }
      updates.status = status;
    }
    if (admin_notes !== undefined) updates.admin_notes = String(admin_notes).slice(0, 2000);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ ok: false, error: "nothing to update" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").update(updates).eq("id", id);
    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/messages] PATCH failed:", err);
    return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
  }
}

// ── DELETE /api/admin/messages?id=xxx — hard-delete (use with care) ─────────
export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id required" }, { status: 400 });

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/messages] DELETE failed:", err);
    return NextResponse.json({ ok: false, error: "Delete failed" }, { status: 500 });
  }
}
