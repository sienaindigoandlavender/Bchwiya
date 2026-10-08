-- Bchwiya initial schema. RLS is enabled on every table.
--
-- The database is shared with another app, so every object is prefixed with
-- `bchwiya_` and nothing touches auth.users.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.bchwiya_profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  role text not null check (role in ('learner', 'admin')) default 'learner',
  created_at timestamptz default now()
);

create table public.bchwiya_lesson_progress (
  user_id uuid not null references public.bchwiya_profiles on delete cascade,
  lesson_id text not null,
  completed_at timestamptz,
  visits int not null default 0,
  primary key (user_id, lesson_id)
);

create table public.bchwiya_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.bchwiya_profiles on delete cascade,
  kind text not null check (kind in ('lesson_check', 'module_test', 'review', 'mock_exam')),
  module_id text, -- null for mock_exam / review
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  score int,
  total int,
  passed boolean
);
create index bchwiya_attempts_user_idx on public.bchwiya_attempts (user_id, started_at desc);

create table public.bchwiya_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.bchwiya_attempts on delete cascade,
  user_id uuid not null references public.bchwiya_profiles on delete cascade,
  question_id text not null,
  rule_ids text[] not null default '{}',
  first_selection text[], -- what she picked first
  final_selection text[], -- what she submitted
  change_count int, -- how many times she changed her selection
  correct boolean,
  time_to_first_ms int, -- time until her first tap
  time_to_submit_ms int, -- time until submit
  created_at timestamptz not null default now()
);
create index bchwiya_answers_user_idx on public.bchwiya_answers (user_id, created_at desc);
create index bchwiya_answers_attempt_idx on public.bchwiya_answers (attempt_id);

create table public.bchwiya_review_queue (
  user_id uuid not null references public.bchwiya_profiles on delete cascade,
  question_id text not null,
  due_at timestamptz not null default now(),
  interval_days int not null default 0,
  correct_in_a_row int not null default 0,
  primary key (user_id, question_id)
);

create table public.bchwiya_module_progress (
  user_id uuid not null references public.bchwiya_profiles on delete cascade,
  module_id text not null,
  best_score_pct int,
  passed_at timestamptz,
  primary key (user_id, module_id)
);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- There is no login: the app talks to the database only from the server, with the
-- service role key (which bypasses RLS). RLS is on with no policies, so the public
-- anon key can read and write nothing.
-- ---------------------------------------------------------------------------

alter table public.bchwiya_profiles enable row level security;
alter table public.bchwiya_lesson_progress enable row level security;
alter table public.bchwiya_attempts enable row level security;
alter table public.bchwiya_answers enable row level security;
alter table public.bchwiya_review_queue enable row level security;
alter table public.bchwiya_module_progress enable row level security;
