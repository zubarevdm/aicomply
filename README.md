# AIComply

**Close Article 4 of the EU AI Act in one day** — AI literacy training, quiz,
verifiable compliance certificate and an audit-ready dashboard for EU SMBs.
Multilingual out of the box: **English · Dutch · German**.

This is **Product A** (the fast-money LMS) of the AIComply ladder. It is built so
**Product B — the AI Act Compliance Scanner** — slots in on top of the same
codebase, accounts and customers (see [Roadmap](#roadmap)).

---

## What's inside

| Flow | Route | Backend needed |
|------|-------|----------------|
| Conversion landing page | `/[locale]` | none |
| Course player (6 lessons) | `/[locale]/learn` | none |
| Quiz + certificate issue | `/[locale]/quiz` | none (PDF works); Supabase to persist |
| PDF certificate | `POST /api/certificate` | none (Supabase to store + verify) |
| Public certificate verification | `/verify/[certNo]` | Supabase |
| Magic-link login | `/[locale]/login` | Supabase |
| Admin dashboard (coverage, members, invite, audit CSV) | `/[locale]/dashboard` | Supabase |
| Employee invite/join | `/[locale]/join?token=…` | Supabase |
| Pricing → Stripe checkout | `POST /api/checkout` | Stripe (falls back to lead form) |
| Stripe webhook | `POST /api/stripe/webhook` | Stripe + Supabase |
| Lead / Scanner waitlist | `POST /api/waitlist` | Supabase (falls back to local JSONL) |

**Graceful degradation is intentional:** with *zero* configuration you can run the
public site, take the course, pass the quiz and download a real certificate PDF.
Add Supabase to unlock accounts, the dashboard and verification. Add Stripe to
turn the pricing buttons into real checkout.

## Tech stack

- **Next.js 16** (App Router, RSC) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Supabase** (Postgres + Auth + RLS) via `@supabase/ssr`
- **Stripe** Checkout + webhook
- **pdf-lib** for certificate generation
- **zod** for input validation
- Custom lightweight **i18n** (`/[locale]` routing, typed dictionaries)

> Note: Next 16 renamed the `middleware` convention to `proxy` — locale routing and
> session refresh live in [`src/proxy.ts`](src/proxy.ts).

---

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — runs without it
npm run dev                  # http://localhost:3000  → redirects to /en
```

Try the core funnel with no backend:
`/en` → **Train my team** → `/en/learn` → finish → `/en/quiz` → pass → download PDF.

## Enable the backend (Supabase)

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query →** paste [`supabase/migrations/0001_init.sql`](supabase/migrations/0001_init.sql) and run it.
   This creates the tables, RLS policies and the public `verify_certificate()` function.
3. **Settings → API**, copy into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server-only secret)
4. **Authentication → URL Configuration:** add `http://localhost:3000/auth/callback`
   (and your production URL) to the redirect allow-list.
5. Restart. Now `/en/dashboard` provisions an org on first login, the invite link
   works, certificates persist and `/verify/<no>` confirms them.

### How accounts work
- First person to log in and open the dashboard becomes the **org admin** (an
  organisation is auto-created).
- The admin shares the **invite link** (`/[locale]/join?token=…`); each employee
  logs in via magic link and is attached to the org as an **employee**.
- When an employee passes the quiz, their certificate is linked to the org and
  appears in the admin dashboard + audit export.

## Enable billing (Stripe)

1. Create 3 **one-time** Products/Prices (Starter / Team / Business).
2. Add to `.env.local`: `STRIPE_SECRET_KEY`, `STRIPE_PRICE_STARTER`,
   `STRIPE_PRICE_TEAM`, `STRIPE_PRICE_BUSINESS`.
3. Webhook → endpoint `https://yourdomain/api/stripe/webhook`, event
   `checkout.session.completed`; put the signing secret in `STRIPE_WEBHOOK_SECRET`.
   Local testing: `stripe listen --forward-to localhost:3000/api/stripe/webhook`.

Until Stripe is configured, the pricing buttons gracefully send users to the lead
form instead of erroring.

## Deploy (Vercel)

1. Push to a Git repo, import into Vercel.
2. Add all `.env.local` vars to the Vercel project (set `NEXT_PUBLIC_APP_URL` to
   your real domain — it drives certificate verify links and auth callbacks).
3. Add `https://yourdomain/auth/callback` to Supabase redirect URLs and the Stripe
   webhook to your domain. Deploy.

---

## Editing the product

- **Course & quiz content:** [`src/content/course.ts`](src/content/course.ts) — typed
  lessons + questions per locale. `passMark` and `version` live here.
- **Copy / translations:** [`src/i18n/dictionaries/`](src/i18n/dictionaries) (`en` is
  the source of truth; the `Dictionary` type keeps `nl`/`de` in sync).
- **Add a language:** add the code to [`src/i18n/config.ts`](src/i18n/config.ts), a
  dictionary file, a `COURSE_CONTENT` entry, and a `titleByLocale` entry.
- **Certificate design:** [`src/lib/certificate.ts`](src/lib/certificate.ts).

## Compliance positioning

AIComply sells *peace of mind*, not education. Every public surface states clearly
that it provides **training and record-keeping tools, not legal advice**. Keep that
disclaimer in place and consider a lawyer partner to review templates before
launching Product B.

## Roadmap

- **Product A (this repo)** — AI literacy LMS. Fast money + a base of paying customers.
- **Product B — AI Act Compliance Scanner** (the moat): a wizard that classifies a
  company's AI use cases by risk tier and generates the usage policy, AI inventory
  and transparency notices. Sold as an upsell to LMS customers (the Business plan
  already advertises early access; the Scanner waitlist on the landing page is live
  via `POST /api/waitlist` with `product=scanner`).
- **Automation Arbitrage** — independent passive n8n data product; separate stack,
  same operator.

---

© AIComply. Training and record-keeping tools — not legal advice.
