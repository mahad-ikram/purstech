// app/api/contact/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Real submit endpoint for the Contact page.
// Replaces the fake `setTimeout` "submit" that was in client.tsx.
//
// Why this matters for AdSense:
//   Reviewers test contact forms. A form that "succeeds" without persisting
//   anything is treated as deceptive UX and contributes to "low value content".
//
// Anti-spam: simple honeypot field + minimum content length. Add reCAPTCHA
// or hCaptcha later if you start getting bots.
// ─────────────────────────────────────────────────────────────────────────────

import { createAdminClient } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

export const runtime = "nodejs"; // need crypto module

type Body = {
  name?:    string;
  email?:   string;
  subject?: string;
  message?: string;
  // honeypot — should always be empty for real users
  website?: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Body;
    const { name, email, subject, message, website } = body;

    // ── Honeypot — bots fill every visible-looking field ────────────────
    if (website && website.length > 0) {
      // Pretend success so the bot moves on; don't actually persist
      return NextResponse.json({ ok: true });
    }

    // ── Validation ───────────────────────────────────────────────────────
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ ok: false, error: "Name is required" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: "Valid email is required" }, { status: 400 });
    }
    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json({ ok: false, error: "Message must be at least 10 characters" }, { status: 400 });
    }
    if (message.length > 5000) {
      return NextResponse.json({ ok: false, error: "Message too long (5000 char max)" }, { status: 400 });
    }

    // ── Soft IP rate-limit signal — hash before storing for GDPR ────────
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const ipHash = createHash("sha256").update(ip + "purstech-salt").digest("hex").slice(0, 16);
    const ua = req.headers.get("user-agent")?.slice(0, 200) ?? null;

    // ── Persist ──────────────────────────────────────────────────────────
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").insert({
      name:       name.trim().slice(0, 100),
      email:      email.trim().toLowerCase().slice(0, 200),
      subject:    subject?.trim().slice(0, 200) ?? null,
      message:    message.trim().slice(0, 5000),
      ip_hash:    ipHash,
      user_agent: ua,
    });

    if (error) {
      console.error("[contact] Supabase insert failed:", error.message);
      return NextResponse.json({ ok: false, error: "Could not save message — please try again" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json({ ok: false, error: "Unexpected error" }, { status: 500 });
  }
}
