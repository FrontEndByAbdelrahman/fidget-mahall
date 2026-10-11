-- Run the entire script in the SQL Editor of the project's Supabase database.
-- The anon and authenticated roles can insert checkout fields only.
begin;

alter table public.users
  add column if not exists email text,
  add column if not exists "user-address" text,
  alter column id set default gen_random_uuid(),
  alter column created_at set default now(),
  enable row level security;

revoke all privileges on table public.users from public, anon, authenticated;
revoke select ("full-name", phone, email, "user-address", id, created_at),
  insert ("full-name", phone, email, "user-address", id, created_at),
  update ("full-name", phone, email, "user-address", id, created_at),
  references ("full-name", phone, email, "user-address", id, created_at)
  on table public.users from public, anon, authenticated;

grant usage on schema public to anon, authenticated;
grant insert ("full-name", phone, email, "user-address")
  on table public.users to anon, authenticated;

drop policy if exists "Allow valid checkout customer inserts" on public.users;
create policy "Allow valid checkout customer inserts"
  on public.users
  for insert
  to anon, authenticated
  with check (
    length(trim("full-name")) between 1 and 120
    and length(trim(phone)) between 1 and 40
    and length(trim(email)) between 3 and 254
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    and length(trim("user-address")) between 1 and 500
  );

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'users'
      and policyname = 'Allow valid checkout customer inserts'
      and cmd = 'INSERT'
  ) then
    raise exception 'Checkout INSERT policy was not created on public.users';
  end if;
end
$$;

commit;

select policyname, roles, cmd, with_check
from pg_policies
where schemaname = 'public'
  and tablename = 'users';
