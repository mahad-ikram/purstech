// app/api/admin/login/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Admin login endpoint.
//
// Validates submitted password against the ADMIN_PASSWORD env var using a
// timing-safe comparison, then issues a 7-day HMAC-signed session cookie.
//
// Brute-force mitigation: every failed attempt sleeps 1.5s before responding.
// (Cheap rate-limiting without external state.)
//
// On success: returns { ok: true } and sets `purstech_admin_session` cookie
// (httpOnly, secure, sameSite=lax).
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "purstech_admin_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// ── Sign a payload with HMAC-SHA256, return `payload.sig` (both base64url) ─
function signToken(payload: object, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", secret).update(body).digest("base64url");
  return `${body}.${sig}`;
}

// ── Constant-time string comparison (prevents timing attacks) ──────────────
function constantTimeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  // Different lengths still need a comparison to avoid leaking length info
  if (aBuf.length !== bBuf.length) {
    // Run a dummy compare against itself so timing is similar
    timingSafeEqual(aBuf, aBuf);
    return false;
  }
  return timingSafeEqual(aBuf, bBuf);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function POST(req: NextRequest) {
  try {
    const adminPassword = process.env.ADMIN_PASSWORD;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!adminPassword || !sessionSecret) {
      console.error(
        "[admin/login] Missing env vars. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in Vercel.",
      );
      return NextResponse.json(
        { error: "Server misconfigured — contact admin." },
        { status: 500 },
      );
    }

    const body = await req.json().catch(() => ({}));
    const password = typeof body?.password === "string" ? body.password : "";

    // Empty / missing password — still slow down to prevent enumeration
    if (!password) {
      await sleep(1500);
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    // Timing-safe comparison against env var
    if (!constantTimeEqual(password, adminPassword)) {
      await sleep(1500);
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    // ── Success — issue signed session cookie ────────────────────────────
    const exp = Date.now() + SESSION_DURATION_MS;
    const token = signToken({ sub: "admin", iat: Date.now(), exp }, sessionSecret);

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,                    // not accessible to JS — XSS-resistant
      secure: true,                      // HTTPS only
      sameSite: "lax",                   // CSRF protection
      path: "/",                         // available across the site
      maxAge: SESSION_DURATION_MS / 1000, // seconds
    });

    return response;
  } catch (err) {
    console.error("[admin/login] Unexpected error:", err);
    await sleep(1500);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

