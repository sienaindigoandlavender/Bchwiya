-- "Mes panneaux": the signs Zahra has met in the street, and how her one-question check went.
create table if not exists public.bchwiya_spotted_signs (
  user_id uuid not null references public.bchwiya_profiles on delete cascade,
  sign_id text not null,
  first_spotted_at timestamptz not null default now(),
  last_spotted_at timestamptz not null default now(),
  times int not null default 1,
  last_check_correct boolean,
  primary key (user_id, sign_id)
);

alter table public.bchwiya_spotted_signs enable row level security;

drop policy if exists "spotted: own rows" on public.bchwiya_spotted_signs;
create policy "spotted: own rows" on public.bchwiya_spotted_signs
  for all using (user_id = auth.uid() or public.bchwiya_is_admin())
  with check (user_id = auth.uid());
