-- Zahra's journal: one row per thing she does in the app.
create table if not exists public.bchwiya_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.bchwiya_profiles on delete cascade,
  type text not null,
  path text,
  data jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists bchwiya_events_user_idx
  on public.bchwiya_events (user_id, created_at desc);

alter table public.bchwiya_events enable row level security;
