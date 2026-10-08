-- Bchwiya initial schema. RLS is enabled on every table.
--
-- The database is shared with another app, so every object is prefixed with
-- `bchwiya_` and nothing hooks into auth.users. Profiles are created by the seed
-- script only; auth users without a bchwiya_profiles row cannot use the app.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.bchwiya_profiles (
  id uuid primary key references auth.users on delete cascade,
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
-- Helpers
-- ---------------------------------------------------------------------------

-- security definer so policies on profiles can call it without recursing.
create or replace function public.bchwiya_is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.bchwiya_profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Learners read and write only their own rows. Admins read everything.
-- Roles are only changed with the service role (seed script), never by users.
-- ---------------------------------------------------------------------------

alter table public.bchwiya_profiles enable row level security;
alter table public.bchwiya_lesson_progress enable row level security;
alter table public.bchwiya_attempts enable row level security;
alter table public.bchwiya_answers enable row level security;
alter table public.bchwiya_review_queue enable row level security;
alter table public.bchwiya_module_progress enable row level security;

create policy "bchwiya_profiles: read own or admin" on public.bchwiya_profiles
  for select using (id = auth.uid() or public.bchwiya_is_admin());

-- lesson_progress
create policy "bchwiya_lesson_progress: read own or admin" on public.bchwiya_lesson_progress
  for select using (user_id = auth.uid() or public.bchwiya_is_admin());
create policy "bchwiya_lesson_progress: insert own" on public.bchwiya_lesson_progress
  for insert with check (user_id = auth.uid());
create policy "bchwiya_lesson_progress: update own" on public.bchwiya_lesson_progress
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- attempts
create policy "bchwiya_attempts: read own or admin" on public.bchwiya_attempts
  for select using (user_id = auth.uid() or public.bchwiya_is_admin());
create policy "bchwiya_attempts: insert own" on public.bchwiya_attempts
  for insert with check (user_id = auth.uid());
create policy "bchwiya_attempts: update own" on public.bchwiya_attempts
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- answers
create policy "bchwiya_answers: read own or admin" on public.bchwiya_answers
  for select using (user_id = auth.uid() or public.bchwiya_is_admin());
create policy "bchwiya_answers: insert own" on public.bchwiya_answers
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.bchwiya_attempts a where a.id = attempt_id and a.user_id = auth.uid()
    )
  );

-- review_queue
create policy "bchwiya_review_queue: read own or admin" on public.bchwiya_review_queue
  for select using (user_id = auth.uid() or public.bchwiya_is_admin());
create policy "bchwiya_review_queue: insert own" on public.bchwiya_review_queue
  for insert with check (user_id = auth.uid());
create policy "bchwiya_review_queue: update own" on public.bchwiya_review_queue
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "bchwiya_review_queue: delete own" on public.bchwiya_review_queue
  for delete using (user_id = auth.uid());

-- module_progress
create policy "bchwiya_module_progress: read own or admin" on public.bchwiya_module_progress
  for select using (user_id = auth.uid() or public.bchwiya_is_admin());
create policy "bchwiya_module_progress: insert own" on public.bchwiya_module_progress
  for insert with check (user_id = auth.uid());
create policy "bchwiya_module_progress: update own" on public.bchwiya_module_progress
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
