-- Bchwiya setup. Paste ALL of this into the Supabase SQL Editor and run once.
-- Safe to run again: nothing is duplicated.

create table if not exists public.bchwiya_profiles (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  role text not null default 'learner' check (role in ('learner', 'admin')),
  created_at timestamptz default now()
);

create table if not exists public.bchwiya_lesson_progress (
  user_id uuid not null references public.bchwiya_profiles on delete cascade,
  lesson_id text not null,
  completed_at timestamptz,
  visits int not null default 0,
  primary key (user_id, lesson_id)
);

create table if not exists public.bchwiya_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.bchwiya_profiles on delete cascade,
  kind text not null check (kind in ('lesson_check', 'module_test', 'review', 'mock_exam')),
  module_id text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  score int,
  total int,
  passed boolean
);

create table if not exists public.bchwiya_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.bchwiya_attempts on delete cascade,
  user_id uuid not null references public.bchwiya_profiles on delete cascade,
  question_id text not null,
  rule_ids text[] not null default '{}',
  first_selection text[],
  final_selection text[],
  change_count int,
  correct boolean,
  time_to_first_ms int,
  time_to_submit_ms int,
  created_at timestamptz not null default now()
);

create table if not exists public.bchwiya_review_queue (
  user_id uuid not null references public.bchwiya_profiles on delete cascade,
  question_id text not null,
  due_at timestamptz not null default now(),
  interval_days int not null default 0,
  correct_in_a_row int not null default 0,
  primary key (user_id, question_id)
);

create table if not exists public.bchwiya_module_progress (
  user_id uuid not null references public.bchwiya_profiles on delete cascade,
  module_id text not null,
  best_score_pct int,
  passed_at timestamptz,
  primary key (user_id, module_id)
);

create index if not exists bchwiya_attempts_user_idx on public.bchwiya_attempts (user_id, started_at desc);
create index if not exists bchwiya_answers_user_idx on public.bchwiya_answers (user_id, created_at desc);
create index if not exists bchwiya_answers_attempt_idx on public.bchwiya_answers (attempt_id);

alter table public.bchwiya_profiles enable row level security;
alter table public.bchwiya_lesson_progress enable row level security;
alter table public.bchwiya_attempts enable row level security;
alter table public.bchwiya_answers enable row level security;
alter table public.bchwiya_review_queue enable row level security;
alter table public.bchwiya_module_progress enable row level security;

insert into public.bchwiya_profiles (display_name, role)
select 'Zahra', 'learner'
where not exists (select 1 from public.bchwiya_profiles where role = 'learner');

select id, display_name, role from public.bchwiya_profiles;
