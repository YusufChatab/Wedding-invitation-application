# Wedding Invitation

A personalised Islamic wedding invitation site built with Next.js and Supabase.
Each guest gets their own link (e.g. `/yusuf-chatab`) that greets them by name,
lets them RSVP (with an optional plus one) and leave du'a/wishes for the couple.

## Setup

1. Install dependencies (Node 22 or newer):

   ```bash
   npm install
   ```

2. Create a Supabase project, open **SQL Editor**, and run `supabase/schema.sql`.

3. Copy `.env.example` to `.env.local` and fill in the values from
   **Project Settings → API Keys**. Without them the site runs in demo mode with
   sample guests.

4. Start the dev server:

   ```bash
   npm run dev
   ```

## Wedding details

Names, parents, date and venues live in `src/config/wedding.ts`.

## Guest list

Put the guests in an Excel file with the columns **Name**, **Plus One** (Yes/No)
and optionally **Phone**, then run:

```bash
npm run import-guests -- guests.xlsx
```

This adds the guests to Supabase and writes `guest-links.csv` with each guest's
personal link (set `SITE_URL` in `.env.local` to the live address first).
Re-running is safe: existing RSVPs and wishes are kept.

`dummy-guests.xlsx` holds 100 placeholder guests for testing
(`node scripts/make-dummy-excel.mts` regenerates it). Real guest lists and
`guest-links.csv` are git-ignored.

## Responses

In Supabase, open **Table Editor → rsvp_summary** to see each guest's status,
plus one and headcount. It can be exported to CSV.
