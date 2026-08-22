# sh0rtit

A simple link shortener. Paste a long URL, get a short code back, and pull up your recent links again on return visits (tracked via a session cookie) — no account needed.

## Stack

- Express (Node, TypeScript, ESM)
- Supabase (Postgres) for storage
- Plain HTML/CSS/TS on the frontend, no framework

## How it works

- `POST /api/new/` — validates and normalizes the submitted URL, hashes it (FNV-1a) into a short code, and stores `{long_link, short_link, session_id}` in Supabase.
- `GET /api/:id` — looks up the short code and 302-redirects to the original URL.
- `GET /init/` — returns the current session's last 10 shortened links, used to populate the list on page load.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Add a `src/.env` with your Supabase credentials:
   ```
   SUPABASE_URL=your-project-url
   SUPABASE_KEY=your-anon-key
   ```
3. Build and run:
   ```
   npm run dev
   ```
   Serves locally on `http://localhost:3000`.

## Scripts

- `npm run build` — compiles TypeScript and copies the client bundle into `public/dist/`.
- `npm start` — runs the compiled server (`dist/server.js`).
- `npm run dev` — build + start.
