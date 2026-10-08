# Bchwiya

بشوية — "slowly, gently". A private, calm micro-learning app that teaches the Moroccan
_code de la route_ for the NARSA theory exam. Two users: one learner, one admin.

Stack: Next.js 15 (App Router, TypeScript), Tailwind CSS v4, Supabase (Postgres, magic-link
Auth, RLS), Zod, pnpm, Vercel.

## Setup

```bash
pnpm install
cp .env.example .env.local   # fill in the values below
pnpm dev                     # http://localhost:3000
```

### Environment variables

| Name                            | Where      | Purpose                                           |
| ------------------------------- | ---------- | ------------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`      | app + seed | Supabase project URL (Settings → API)             |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | app        | Public anon key                                   |
| `SUPABASE_SERVICE_ROLE_KEY`     | seed only  | Service role key. Never expose it to the browser. |
| `ADMIN_EMAIL`                   | seed only  | Gets the `admin` role                             |
| `LEARNER_EMAIL`                 | seed only  | Gets the `learner` role                           |

On Vercel, only the two `NEXT_PUBLIC_*` variables are required at runtime.

## Supabase

1. Create a project.
2. Run the migrations in `supabase/migrations/`, either:
   - with the CLI: `supabase link --project-ref <ref>` then `supabase db push`, or
   - by pasting each file, in order, into the SQL editor.
3. **Auth → URL configuration**: set the Site URL to your deployment URL and add
   `https://<your-domain>/auth/callback` and `http://localhost:3000/auth/callback`
   to the redirect URLs.
4. Create the two users and set their roles: `pnpm seed`.
   Sign-ups are disabled from the app (`shouldCreateUser: false`), so only seeded users can log in.

Every table has RLS: the learner reads and writes only her own rows; the admin
(`public.is_admin()`) reads everything. Roles can only be changed with the service role.

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
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
3. Deploy, then add the deployment's `/auth/callback` URL to Supabase redirect URLs.
