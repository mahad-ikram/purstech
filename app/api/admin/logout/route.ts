// app/api/admin/logout/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Logout endpoint — clears the `purstech_admin_session` cookie.
//
// Stateless: there's no server-side session store to invalidate, so the
// cookie clear is the entire logout operation. If you ever rotate
// ADMIN_SESSION_SECRET, all outstanding sessions become invalid instantly.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "purstech_admin_session";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0, // delete immediately
  });
  return response;
}
