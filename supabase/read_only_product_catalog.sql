-- Run in the Supabase SQL Editor. API roles may read only public catalog fields.
-- Keep this bucket dedicated to product images; its objects will be publicly viewable.
begin;

revoke create on schema public from public, anon, authenticated;
grant usage on schema public to anon, authenticated;

revoke all privileges on all tables in schema public from public, anon, authenticated;
revoke all privileges on all sequences in schema public from public, anon, authenticated;
revoke execute on all functions in schema public from public, anon, authenticated;

alter table public.products enable row level security;

do $$
declare
  existing_policy record;
begin
  for existing_policy in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'products'
  loop
    execute format(
      'drop policy if exists %I on public.products',
      existing_policy.policyname
    );
  end loop;
end
$$;

grant select (id, name, description, price, image, created_at)
on table public.products
to anon, authenticated;

create policy "Public can read product catalog"
on public.products
for select
to anon, authenticated
using (true);

do $$
begin
  if not exists (
    select 1 from storage.buckets where id = 'keyboard-fidget-img'
  ) then
    raise exception 'Expected public product image bucket "keyboard-fidget-img" was not found';
  end if;
end
$$;

update storage.buckets
set public = true
where id = 'keyboard-fidget-img';

drop policy if exists "Block client uploads to product images" on storage.objects;
create policy "Block client uploads to product images"
on storage.objects
as restrictive
for insert
to anon, authenticated
with check (bucket_id <> 'keyboard-fidget-img');

drop policy if exists "Block client updates to product images" on storage.objects;
create policy "Block client updates to product images"
on storage.objects
as restrictive
for update
to anon, authenticated
using (bucket_id <> 'keyboard-fidget-img')
with check (bucket_id <> 'keyboard-fidget-img');

drop policy if exists "Block client deletes to product images" on storage.objects;
create policy "Block client deletes to product images"
on storage.objects
as restrictive
for delete
to anon, authenticated
using (bucket_id <> 'keyboard-fidget-img');

alter default privileges in schema public
  revoke all privileges on tables from public, anon, authenticated;
alter default privileges in schema public
  revoke all privileges on sequences from public, anon, authenticated;
alter default privileges in schema public
  revoke execute on functions from public, anon, authenticated;

commit;
