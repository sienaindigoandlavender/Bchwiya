# Bchwiya — Build Brief for Claude Code

> **Bchwiya** (بشوية, "slowly, gently") is a private, calm micro-learning web app that teaches one learner, Zahra, the Moroccan *code de la route* so she passes the NARSA theory exam.
> It is not a product. There is no marketing, no SaaS, and no payments. Two users: Zahra (learner) and Jacqueline (admin).

**Status (Oct 8 2026):** scaffold built; open access and the first visual design are in.

## Design system (locked Oct 8 2026)

- Flat. No shadows, no gradients, no borders as decoration. Colour comes from soft pastel fills.
- White paper, deep aubergine ink (`--ink`). Never light grey text; secondary text uses `--ink-soft`.
- One strong colour, rose `--rose`, for actions and "you are here". Pastels: blush, lilac, mint, butter, peach, sky, cloud.
- Type: EB Garamond italic for titles (`.title`), EB Garamond roman for lesson and question text, DM Sans for the interface.
- Shapes: pill buttons, 28px blocks (`rounded-big`), 18px options (`rounded-card`).
- Girly and cute but calm: sparkles and the little pink car (`components/ui/LittleCar.tsx`) are the only ornaments.
- Shared UI is one component, imported everywhere: `PageHeader`, `ScoreHero`, `MissedList`, `StatusBadge`, `BottomNav`.
- Tokens live in `src/app/globals.css`. Restyle there first.

---

## 1. Stack

- **Next.js 15**, App Router, TypeScript (strict), `src/` directory
- **Tailwind CSS**, with design tokens as CSS variables in `globals.css` so the theme can be reskinned later
- **Supabase**: Postgres and Row Level Security. **Building phase: no login.** The server uses the service-role key and acts as the learner profile; the app opens on `/`.
- **Vercel** for deployment
- **pnpm**
- Validate content files with **Zod**
- No component library. Plain components in `src/components/`.
- Mobile-first: everything must work well on a phone at 360px wide.

## 2. Language and i18n

- All UI and content is in **French** for now.
- A **Darija translation** comes later, so make it i18n-ready from day one:
  - No hard-coded UI strings. Put them in `src/i18n/fr.ts`, with a typed dictionary and a `t()` helper.
  - Content lives under `content/fr/`. A future `content/ary/` will mirror it, using the locale code `ary` for Moroccan Arabic.
  - Use logical CSS (`ms-`, `me-`, `ps-`, `pe-`, `start`, `end`), never `left`/`right`, so RTL works later. Set `dir` on `<html>` from the locale.
- Code, comments and identifiers are in English.

## 3. Learning philosophy (these are hard rules)

The point is calm learning. Do not add stress mechanics.

- **No streaks, no countdown pressure, no lives, no leaderboards, no loud red failure states.**
- A wrong answer shows the correct answer plus a short explanation, in a neutral tone, then moves on.
- Timers exist **only** in the mock exam (examen blanc).
- After a break, the app greets her with something like "On reprend ?" and resumes where she left off. No guilt.
- Progress is shown as a **path** of levels and modules, not points.

## 4. Learning model

```
Niveau (level) → Module → Leçons (5-minute lessons) → Test de module
```

### Levels (seed these with titles; content is placeholder except where noted)

| id | Title |
|----|-------|
| `n0` | La route, c'est quoi ? |
| `n1` | Lire les panneaux |
| `n2` | Qui passe en premier |
| `n3` | Circuler |
| `n4` | Le conducteur et la voiture |
| `n5` | Situations réelles |
| `n6` | Prête pour l'examen |

Plus a standalone module, **Ma voiture** (`ma-voiture`): an illustrated, tappable car interior. It's a placeholder page for now.

### Flow

1. Lessons inside a module are done in order. Each lesson is a short series of **screens**: text plus an optional image or SVG, ending with 1 to 3 quick check questions (not scored toward unlocking).
2. After the last lesson, a **module test** (~10 questions) is scored.
3. **≥ 80%** passes, marks the module done, and unlocks the next module (or the next level after the last module).
4. **< 80%**: don't restart the module. Show the list of lessons linked to the missed questions (via `ruleIds`), let her revisit them, then retake the test. Retakes are unlimited.
5. Every wrong answer anywhere goes into her **review queue** (Révision).

### Exam format (for the mock exam)

The real NARSA exam is **40 questions, 40 minutes, pass mark 32/40**. Questions are mostly image-based and **can have more than one correct answer**. The question engine must support single- and multi-answer questions.

## 5. Content format

Content is **file-based**, versioned in git, and validated by Zod at build time. No CMS.

```
content/
  fr/
    levels.json            # ordered levels → modules
    rules.json             # the rule catalogue (the "skills" we track)
    lessons/
      n2-m3-l1.json        # one file per lesson
    questions/
      n2-m3.json           # the question bank per module
```

### `rules.json`
Each rule is one atomic thing to know. **This is what analytics roll up to.**
```json
{ "id": "priorite-giratoire-sans-panneau",
  "title": "Giratoire sans panneau : priorité à droite",
  "levelId": "n2" }
```

### Lesson
```json
{
  "id": "n2-m3-l1",
  "moduleId": "n2-m3",
  "title": "Le rond-point : deux règles",
  "minutes": 5,
  "ruleIds": ["priorite-giratoire-sans-panneau", "priorite-giratoire-cedez"],
  "screens": [
    { "type": "text", "body": "…", "media": { "kind": "svg", "component": "Roundabout" } },
    { "type": "keypoint", "body": "…" }
  ],
  "checks": ["q-n2-m3-001"]
}
```
`media.kind` is one of `svg` (a named React component from `src/components/diagrams/`), `image` (a path under `public/images/`), or `none`.

### Question
```json
{
  "id": "q-n2-m3-001",
  "moduleId": "n2-m3",
  "ruleIds": ["priorite-giratoire-cedez"],
  "prompt": "…",
  "media": { "kind": "svg", "component": "Roundabout", "props": { "variant": "cedez" } },
  "options": [
    { "id": "a", "text": "…" },
    { "id": "b", "text": "…" }
  ],
  "correct": ["b"],
  "explanation": "…"
}
```

### Seed content
- Seed **all 7 levels** with module titles (2 to 4 modules each, use sensible titles).
- Write **real French content for one module only**: `n2-m3` « Les ronds-points ». Zahra struggles with priority at roundabouts. Include 3 lessons and 8 to 10 questions covering:
  - The Moroccan rule: at a roundabout **with** a "cédez le passage" sign at the entry, traffic already in the ring has priority. **Without** that sign, *priorité à droite* applies, so entering traffic has priority.
  - Recognising the signs (the giratoire danger sign, cédez le passage, the obligation sign for sens giratoire).
  - Indicators and lane position when entering and exiting.
  - Add a `// TODO: verify against loi 52-05` comment in the file. A human will check legal accuracy.
- Everything else gets placeholder lessons (one screen saying "Contenu à venir") and no questions.

## 6. Data model (Supabase)

Write SQL migrations in `supabase/migrations/`. Enable RLS on every table.

```sql
profiles (
  id uuid primary key references auth.users,
  display_name text,
  role text not null check (role in ('learner','admin')) default 'learner',
  created_at timestamptz default now()
)

lesson_progress (
  user_id uuid references profiles,
  lesson_id text,
  completed_at timestamptz,
  visits int default 0,
  primary key (user_id, lesson_id)
)

attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles,
  kind text check (kind in ('lesson_check','module_test','review','mock_exam')),
  module_id text,           -- null for mock_exam / review
  started_at timestamptz default now(),
  finished_at timestamptz,
  score int,
  total int,
  passed boolean
)

answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid references attempts on delete cascade,
  user_id uuid references profiles,
  question_id text,
  rule_ids text[],
  first_selection text[],   -- what she picked first
  final_selection text[],   -- what she submitted
  change_count int,         -- how many times she changed her selection
  correct boolean,
  time_to_first_ms int,     -- time until her first tap
  time_to_submit_ms int,    -- time until submit
  created_at timestamptz default now()
)

review_queue (
  user_id uuid references profiles,
  question_id text,
  due_at timestamptz,
  interval_days int default 0,
  correct_in_a_row int default 0,
  primary key (user_id, question_id)
)

module_progress (
  user_id uuid references profiles,
  module_id text,
  best_score_pct int,
  passed_at timestamptz,
  primary key (user_id, module_id)
)
```

**RLS:** learners read and write only their own rows. Admins read everything. Create a `is_admin()` SQL helper.

**Review queue logic** (simple Leitner-style): a wrong answer sets `due_at = now()` and resets `correct_in_a_row`. A correct review doubles the interval (1 → 2 → 4 → 8 days). After 4 correct in a row, remove it from the queue.

## 7. Hesitation tracking (important)

The question component must capture, per question:
- `time_to_first_ms`: from the question being displayed to her first tap
- `time_to_submit_ms`: from display to submit
- `first_selection`, `final_selection`, `change_count`

Pause the timer when the tab is hidden (`visibilitychange`) so stepping away to make tea doesn't skew the data.
Write answers to Supabase as they happen, so nothing is lost if she closes the app mid-test.

## 8. Routes

| Route | Purpose |
|-------|---------|
| `/` | Home: "On reprend ?" card (resume where she left off) plus the level path |
| `/niveau/[levelId]` | A level's modules and status |
| `/module/[moduleId]` | A module's lessons, plus a "Passer le test" button once all lessons are done |
| `/lecon/[lessonId]` | Lesson player: swipe or tap through screens, then quick checks |
| `/test/[moduleId]` | Module test, one question per screen, results at the end |
| `/test/[moduleId]/resultat/[attemptId]` | Result: score, missed questions, linked lessons to revisit |
| `/revision` | Review queue: questions due today |
| `/examen-blanc` | Mock exam, 40 questions, 40-min timer, 32/40 to pass. Draws from all available questions; if fewer than 40 exist, use what's there and show a note. |
| `/ma-voiture` | Placeholder page for the car interior module |
| `/admin` | Jacqueline's dashboard (admin role only) |

No auth gate during the building phase. `/configuration` explains missing env vars or a missing learner profile.

## 9. Admin dashboard (`/admin`)

Functional, not pretty. Server components querying Supabase.
- **Overview:** modules passed, current position, last activity, time spent this week.
- **Rules table:** each rule with accuracy %, average `time_to_submit_ms`, average `change_count`, and number of attempts. Sort by weakest. Flag:
  - **"Hésitation"**: correct but slow (above her median time) or often changed
  - **"Confusion"**: wrong and fast (below her median time)
- **Attempts history:** list of tests with score, date and duration. Click through to per-question detail.
- **Mock exam history:** scores over time (a simple table is fine; a chart comes later).

## 10. Components to scaffold

- `QuestionCard`: single- and multi-answer, captures hesitation metrics, calm feedback
- `LessonPlayer`: screen-by-screen with a progress bar, works with swipe and buttons
- `LevelPath`: vertical path of levels and modules showing locked, available, in-progress and done
- `ResumeCard`
- `diagrams/Roundabout.tsx`: a simple SVG roundabout with `variant: 'cedez' | 'sans-panneau'` and positioned cars. Basic shapes are fine; it'll be redesigned.
- `signs/Sign.tsx`: a generic SVG road sign renderer driven by props (`shape: triangle | circle | octagon | square | inverted-triangle`, colours, inner pictogram slot). Seed with: cédez le passage, stop, sens giratoire obligatoire, the giratoire danger triangle.

Never use AI-generated images for signs or anything she has to learn from. Signs and diagrams are always SVG.

## 11. Project hygiene

- `README.md` covering setup, env vars, how to add content, and how to run migrations
- `.env.example` with `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, optional `BCHWIYA_LEARNER_ID`
- A `pnpm validate:content` script that runs the Zod checks and fails on broken references (unknown `ruleIds`, `checks` pointing to missing questions, `correct` IDs not in `options`)
- A seed script that creates the two profiles (set roles by email via env vars `ADMIN_EMAIL` and `LEARNER_EMAIL`)
- ESLint and Prettier
- Small, focused commits

## 12. Out of scope for now

Audio, Darija content, payments, notifications, gamification, the visual redesign, Midjourney imagery, and the Ma voiture interactive content.

## 13. Definition of done

- `pnpm dev` runs; `pnpm build` passes; `pnpm validate:content` passes.
- She can log in, see the path, open `n2-m3`, go through 3 lessons, take the test, see her result with links back to lessons, and find missed questions in Révision.
- Every answer lands in `answers` with timing and change data.
- The admin can log in and see the rules table populated from her answers.
- It deploys to Vercel with Supabase env vars set.
