-- Bchwiya initial schema. RLS is enabled on every table.

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  role text not null check (role in ('learner', 'admin')) default 'learner',
  created_at timestamptz default now()
);

create table public.lesson_progress (
  user_id uuid not null references public.profiles on delete cascade,
  lesson_id text not null,
  completed_at timestamptz,
  visits int not null default 0,
  primary key (user_id, lesson_id)
);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  kind text not null check (kind in ('lesson_check', 'module_test', 'review', 'mock_exam')),
  module_id text, -- null for mock_exam / review
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  score int,
  total int,
  passed boolean
);
create index attempts_user_idx on public.attempts (user_id, started_at desc);

create table public.answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.attempts on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
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
create index answers_user_idx on public.answers (user_id, created_at desc);
create index answers_attempt_idx on public.answers (attempt_id);

create table public.review_queue (
  user_id uuid not null references public.profiles on delete cascade,
  question_id text not null,
  due_at timestamptz not null default now(),
  interval_days int not null default 0,
  correct_in_a_row int not null default 0,
  primary key (user_id, question_id)
);

create table public.module_progress (
  user_id uuid not null references public.profiles on delete cascade,
  module_id text not null,
  best_score_pct int,
  passed_at timestamptz,
  primary key (user_id, module_id)
);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

-- security definer so policies on profiles can call it without recursing.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Create a learner profile whenever an auth user is created.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- Learners read and write only their own rows. Admins read everything.
-- Roles are only changed with the service role (seed script), never by users.
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.attempts enable row level security;
alter table public.answers enable row level security;
alter table public.review_queue enable row level security;
alter table public.module_progress enable row level security;

create policy "profiles: read own or admin" on public.profiles
  for select using (id = auth.uid() or public.is_admin());

-- lesson_progress
create policy "lesson_progress: read own or admin" on public.lesson_progress
  for select using (user_id = auth.uid() or public.is_admin());
create policy "lesson_progress: insert own" on public.lesson_progress
  for insert with check (user_id = auth.uid());
create policy "lesson_progress: update own" on public.lesson_progress
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- attempts
create policy "attempts: read own or admin" on public.attempts
  for select using (user_id = auth.uid() or public.is_admin());
create policy "attempts: insert own" on public.attempts
  for insert with check (user_id = auth.uid());
create policy "attempts: update own" on public.attempts
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());

-- answers
create policy "answers: read own or admin" on public.answers
  for select using (user_id = auth.uid() or public.is_admin());
create policy "answers: insert own" on public.answers
  for insert with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.attempts a where a.id = attempt_id and a.user_id = auth.uid()
    )
  );

-- review_queue
create policy "review_queue: read own or admin" on public.review_queue
  for select using (user_id = auth.uid() or public.is_admin());
create policy "review_queue: insert own" on public.review_queue
  for insert with check (user_id = auth.uid());
create policy "review_queue: update own" on public.review_queue
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "review_queue: delete own" on public.review_queue
  for delete using (user_id = auth.uid());

-- module_progress
create policy "module_progress: read own or admin" on public.module_progress
  for select using (user_id = auth.uid() or public.is_admin());
create policy "module_progress: insert own" on public.module_progress
  for insert with check (user_id = auth.uid());
create policy "module_progress: update own" on public.module_progress
  for update using (user_id = auth.uid()) with check (user_id = auth.uid());
