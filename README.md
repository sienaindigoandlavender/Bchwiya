# Bchwiya

بشوية — "slowly, gently". A private, calm micro-learning app that teaches the Moroccan
_code de la route_ for the NARSA theory exam. Two users: one learner, one admin.

Stack: Next.js 15 (App Router, TypeScript), Tailwind CSS v4, Supabase (Postgres, RLS), Zod,
pnpm, Vercel. Fonts: EB Garamond (titles, lesson text) and DM Sans (interface), self-hosted
via Fontsource.

**Building phase: there is no login.** The app opens straight on `/`. The server uses the
service-role key and always acts as the learner profile (`BCHWIYA_LEARNER_ID`, or the first
`learner` row in `bchwiya_profiles`). `/admin` is open too. Login can come back later.

## Setup

```bash
pnpm install
cp .env.example .env.local   # fill in the values below
pnpm dev                     # http://localhost:3000
```

### Environment variables

| Name                        | Where      | Purpose                                                   |
| --------------------------- | ---------- | --------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`  | app + seed | Supabase project URL (Settings → API)                     |
| `SUPABASE_SERVICE_ROLE_KEY` | app + seed | Service role key. Server-only, never sent to the browser. |
| `BCHWIYA_LEARNER_ID`        | app        | Optional: pin the learner profile id                      |
| `ADMIN_EMAIL`               | seed only  | Gets the `admin` role                                     |
| `LEARNER_EMAIL`             | seed only  | Gets the `learner` role                                   |

On Vercel, `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are required at runtime.

## Supabase

Bchwiya can live inside an existing Supabase project shared with another app:
every table, function and policy is prefixed `bchwiya_`, and nothing touches
`auth.users` (no triggers).

Without the env vars (or without a learner profile) the app still builds and deploys,
and shows a setup notice on `/configuration`.

1. Use an existing project (or create one).
2. Run the migrations in `supabase/migrations/`, either:
   - with the CLI: `supabase link --project-ref <ref>` then `supabase db push`, or
   - by pasting each file, in order, into the SQL editor.
3. Building phase: `20261008010000_open_access_learner.sql` creates Zahra's learner profile
   without an auth user. (`pnpm seed` is for when login comes back.)

Every table keeps its RLS policies for when login returns. During the building phase the
service-role key bypasses them, so every query in the app filters by the learner's id itself.

## Scripts

| Command                                        | What it does                                       |
| ---------------------------------------------- | -------------------------------------------------- |
| `pnpm dev`                                     | Dev server                                         |
| `pnpm build`                                   | Validates content, then builds                     |
| `pnpm validate:content`                        | Zod schema checks plus broken-reference checks     |
| `pnpm lint` / `pnpm format` / `pnpm typecheck` | Hygiene                                            |
| `pnpm seed`                                    | Creates the admin and learner users and sets roles |

## Content

Content is plain JSON in git, validated at build time. No CMS.

```
content/fr/
  levels.json          levels → modules → ordered lessonIds
  rules.json           the rule catalogue (what analytics roll up to)
  lessons/<id>.json    one file per lesson; file name = lesson id
  questions/<module>.json  question bank per module; file name = module id
```

To add content:

1. Add any new rules to `rules.json`.
2. Write the lesson file and list its id under the module's `lessonIds` in `levels.json`.
3. Add questions to `questions/<moduleId>.json`. `correct` holds one or more option ids
   (more than one makes it a multi-answer question).
4. Point lesson `checks` at question ids (0 to 3).
5. Run `pnpm validate:content`. It fails on unknown `ruleIds`, `checks` pointing to
   missing questions, `correct` ids not in `options`, and lessons not listed in `levels.json`.

`media` is `{ "kind": "svg", "component": "Roundabout" | "Sign", "props": {…} }`,
`{ "kind": "image", "src": "file.png" }` (under `public/images/`), or `{ "kind": "none" }`.
Signs use `{ "preset": "cedez-le-passage" | "stop" | "sens-giratoire-obligatoire" | "giratoire-danger" }`.
Signs and diagrams are always SVG, never generated images.

JSON has no comments, so files carry notes in a `$comment` field. The `n2-m3` files are
marked `// TODO: verify against loi 52-05` until a human checks the legal accuracy.

### Unlocking

Modules open in order. A module with questions blocks the ones after it until its test is
passed (≥ 80 %). A module without questions (placeholder content) never blocks, and counts as
done once its lessons are done.

## i18n

All UI strings live in `src/i18n/fr.ts` and go through `t()`. Content lives under
`content/fr/`; Darija will mirror it under `content/ary/`. `<html dir>` comes from the
locale, and styles use logical properties (`ms-`, `pe-`, `start`, `end`) so RTL works later.

## Deploying to Vercel

1. Import the GitHub repo in Vercel (framework: Next.js; pnpm is detected from the lockfile).
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`, then deploy.
   Without them it still deploys and shows the setup notice.
