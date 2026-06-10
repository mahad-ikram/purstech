// proxy.ts
// ─────────────────────────────────────────────────────────────────────────────
// Server-side auth guard for the admin panel — Next.js 16 "proxy" convention.
// (Next 16 renamed middleware.ts → proxy.ts and the export → proxy.)
//
// Runs on Vercel's Edge runtime BEFORE any page or API route is reached.
// Verifies the `purstech_admin_session` cookie using HMAC-SHA256 + the
// ADMIN_SESSION_SECRET env var. Unauthenticated requests are:
//   - Redirected to /admin/login   (for /admin/* page routes)
//   - Returned 401 JSON            (for /api/admin/* routes)
//
// Public exceptions: /admin/login, /api/admin/login, /api/admin/logout.
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";

// Must match the cookie name used in login + logout routes
const COOKIE_NAME = "purstech_admin_session";

// ── HMAC-SHA256 token verification (Web Crypto — works in Edge runtime) ─────
async function verifyToken(token: string, secret: string): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [bodyB64, sigB64] = parts;

  // Decode + validate payload
  let payload: { exp?: number; sub?: string };
  try {
    payload = JSON.parse(b64UrlDecodeString(bodyB64));
  } catch {
    return false;
  }

  // Must have expiry, must not be expired, must be admin subject
  if (!payload.exp || payload.exp < Date.now()) return false;
  if (payload.sub !== "admin") return false;

  // Verify HMAC signature
  const enc = new TextEncoder();
  try {
    const key = await crypto.subtle.importKey(
      "raw",
      enc.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const sigBytes = b64UrlDecode(sigB64);
    return await crypto.subtle.verify("HMAC", key, sigBytes, enc.encode(bodyB64));
  } catch {
    return false;
  }
}

// ── base64url helpers ───────────────────────────────────────────────────────
function b64UrlNormalize(input: string): string {
  const b64 = input.replace(/-/g, "+").replace(/_/g, "/");
  return b64 + "=".repeat((4 - (b64.length % 4)) % 4);
}
function b64UrlDecodeString(input: string): string {
  return atob(b64UrlNormalize(input));
}
function b64UrlDecode(input: string): Uint8Array {
  const bin = atob(b64UrlNormalize(input));
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

// ── Proxy (Next 16 name for middleware) ──────────────────────────────────────
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public endpoints — login form + login/logout APIs must be reachable
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return NextResponse.next();
  }

  const secret = process.env.ADMIN_SESSION_SECRET;

  // Fail-closed if env var is missing — never let admin routes through
  if (!secret) {
    console.error("[proxy] ADMIN_SESSION_SECRET not configured");
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json(
        { error: "Server misconfigured: missing ADMIN_SESSION_SECRET" },
        { status: 500 },
      );
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  // Verify the session cookie
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const valid = token ? await verifyToken(token, secret) : false;

  if (!valid) {
    // API routes: structured 401, no redirect (clients shouldn't follow)
    if (pathname.startsWith("/api/admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Page routes: redirect to login
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

// ── Matcher: which routes this proxy protects ───────────────────────────────
export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
