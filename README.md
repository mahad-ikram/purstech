This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Environment Setup

This project needs the following environment variables. Create a `.env.local`
file in the project root (never commit it — it's gitignored) and set on Vercel
under **Project → Settings → Environment Variables**.

```bash
# ── Supabase (database + admin data) ──────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key

# ── Admin panel auth (HMAC-signed session) ────────────────────────
ADMIN_USERNAME=choose-a-username
ADMIN_PASSWORD=choose-a-strong-password
ADMIN_SESSION_SECRET=long-random-string-for-signing-cookies

# ── Optional: AI features (if/when enabled) ───────────────────────
# ANTHROPIC_API_KEY=sk-ant-...
```

**Never expose the service-role key or any secret in `NEXT_PUBLIC_*` vars** —
only the anon key is safe for the browser. Rotate `ADMIN_PASSWORD` if it has
ever been shared in plaintext (e.g. in an old roadmap doc).

### Run locally
```bash
npm install
npm run dev      # http://localhost:3000
```
