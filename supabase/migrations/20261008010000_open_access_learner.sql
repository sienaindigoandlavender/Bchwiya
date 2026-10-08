-- Building phase: no login. The app acts as the first learner profile, so that
-- profile must exist without an auth user. Safe to run more than once.

-- 1. Profiles no longer require a matching auth.users row.
alter table public.bchwiya_profiles
  drop constraint if exists bchwiya_profiles_id_fkey;

alter table public.bchwiya_profiles
  alter column id set default gen_random_uuid();

-- 2. Zahra's learner profile, created only if no learner exists yet.
insert into public.bchwiya_profiles (display_name, role)
select 'Zahra', 'learner'
where not exists (
  select 1 from public.bchwiya_profiles where role = 'learner'
);

-- Check: should return one row for Zahra.
select id, display_name, role from public.bchwiya_profiles where role = 'learner';
