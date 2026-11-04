// app/api/subscribe/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Real submit endpoint for the PursTech Pro Waitlist / Newsletter form.
// Persists subscribers to Supabase `newsletter_subscribers` (read by
// /api/admin/subscribers). Prevents AdSense "deceptive/non-functional form" flags.
// ─────────────────────────────────────────────────────────────────────────────

import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source, plan, website } = body as {
      email?: string;
      source?: string;
      plan?: string;
      website?: string;
    };

    // Honeypot check — bots fill hidden fields
    if (website && website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    if (!email || typeof email !== "string" || !EMAIL_RE.test(email.trim())) {
      return NextResponse.json(
        { ok: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase().slice(0, 200);
    const taggedSource = [source || "pro-waitlist", plan ? plan.toLowerCase() : null]
      .filter(Boolean)
      .join(":");

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .upsert(
        {
          email: normalizedEmail,
          is_active: true,
          source: taggedSource,
          subscribed_at: new Date().toISOString(),
        },
        { onConflict: "email" }
      );

    if (error) {
      console.error("[subscribe] Supabase upsert error:", error.message);
      return NextResponse.json(
        { ok: false, error: "Could not save subscription — please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[subscribe] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, error: "Unexpected error — please try again." },
      { status: 500 }
    );
  }
}
