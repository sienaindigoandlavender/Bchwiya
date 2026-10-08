# Bchwiya

بشوية — "slowly, gently". A private, calm micro-learning app that teaches the Moroccan
_code de la route_ for the NARSA theory exam. Two users: one learner, one admin.

Stack: Next.js 15 (App Router, TypeScript), Tailwind CSS v4, Supabase (Postgres), Zod,
pnpm, Vercel. The site is hidden from search engines (robots.txt, meta tags, `X-Robots-Tag`).

## Setup

```bash
pnpm install
cp .env.example .env.local   # fill in the values below
pnpm dev                     # http://localhost:3000
```

### Environment variables

| Name                        | Purpose                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`  | Supabase project URL (Settings → API)                            |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (Settings → API → `service_role`). Server-only. |

There is no login: the app is for one learner, and only the server talks to the
database. Until both variables are set, every page shows "Bchwiya arrive bientôt".

## Supabase

Bchwiya lives inside an existing Supabase project shared with another app: every
table is prefixed `bchwiya_`, and nothing touches `auth.users`.

1. Open the project's **SQL editor** and run `supabase/migrations/20261008000000_init.sql`.
2. Set the two env vars above (in `.env.local` and on Vercel).

Zahra's profile is created on her first visit. RLS is on with no policies, so the
public anon key cannot read or write any `bchwiya_` table. `/admin` has no login
and no link in the app: it is reachable by URL only.

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
