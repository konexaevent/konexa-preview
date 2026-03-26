# Konexa

Konexa is now structured as a `Next.js + Supabase` application focused on
social familiarity through real shared activities.

## What is included

- Email/password login and signup
- Optional Google auth flow through Supabase OAuth
- Persistent session with Supabase SSR middleware
- Personal dashboard with:
  - upcoming activities
  - past activities
  - shared connections
- Activity detail page that highlights familiar participants
- Database schema for profiles, bookings and social connections

## Main folders

- `app/`: Next.js App Router pages
- `lib/`: queries, demo fallback data and Supabase clients
- `supabase/schema.sql`: schema, indexes, triggers and RLS policies
- `types/database.ts`: app-side database typing baseline

## Setup

1. Install Node.js 20+.
2. Copy `.env.example` to `.env.local`.
3. Fill in your Supabase project credentials.
4. Run the SQL in [schema.sql](/Users/alex/Desktop/PROVA%20CODEX/supabase/schema.sql).
5. Optionally seed starter activities with [seed.sql](/Users/alex/Desktop/PROVA%20CODEX/supabase/seed.sql).
6. Install dependencies and start the app:

```bash
npm install
npm run dev
```

## Publish on the internet

To make Konexa accessible from any browser, like a normal public website:

1. Create a project in `Vercel`.
2. Import this folder as a Next.js app.
3. Add the environment variables from `.env.local` or `.env.example`.
4. Set `NEXT_PUBLIC_APP_URL` to your real public domain.
5. Deploy.

After that, users will be able to:

- open Konexa from any browser using a public URL
- use it directly as a normal website from desktop or mobile browsers

Good examples:

- `https://konexa.app`
- `https://app.konexa.app`

## Deploy on Vercel

Fastest way:

1. Create an account in `Vercel`.
2. Upload this project to a GitHub repository.
3. In Vercel, click `Add New > Project`.
4. Import the GitHub repository that contains `Konexa`.
5. Vercel will detect `Next.js` automatically.
6. Add these environment variables:

```bash
NEXT_PUBLIC_APP_URL=https://your-real-domain.vercel.app
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

7. Click `Deploy`.

After the first deploy:

1. Open `Project Settings > Domains`.
2. Add your custom domain if you have one.
3. Update `NEXT_PUBLIC_APP_URL` with the final public domain.
4. Redeploy.

If you still do not have Supabase configured:

- the app will open online
- but it will continue using demo mode for profile and data persistence

## Notes

- When Supabase is not configured, the app falls back to demo data so the UI
  still renders.
- The project is oriented as a browser-based website, while keeping account,
  profile, activity, and community functionality online.
- Shared connections are not calculated with heavy joins on every request.
  They are precomputed into `user_connections` and `connection_activities`
  through triggers on `activity_participants`.
- Joining an activity is wired through
  [app/actions.ts](/Users/alex/Desktop/PROVA%20CODEX/app/actions.ts), so once
  Supabase is configured the feed and detail page can insert real bookings.
- The current machine did not have `node` or `npm` available, so this code was
  prepared but not executed locally here.
