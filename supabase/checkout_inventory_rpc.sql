-- Run the entire script in the SQL Editor for this Supabase project.
-- Inventory updates and customer creation happen atomically on the database.
begin;

alter table public.users
  add column if not exists email text,
  add column if not exists "user-address" text,
  add column if not exists "total-price" text,
  add column if not exists "order-info" text,
  alter column id set default gen_random_uuid(),
  alter column created_at set default now(),
  enable row level security;

alter table public.products enable row level security;

do $$
begin
  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'stock'
      and data_type in ('smallint', 'integer', 'bigint', 'numeric')
  ) then
    raise exception 'Expected a numeric public.products.stock column';
  end if;

  if not exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'products'
      and column_name = 'price'
      and data_type in ('smallint', 'integer', 'bigint', 'numeric', 'real', 'double precision')
  ) then
    raise exception 'Expected a numeric public.products.price column';
  end if;
end
$$;

create table if not exists public.checkout_submissions (
  request_id uuid primary key,
  created_at timestamptz not null default now()
);
alter table public.checkout_submissions enable row level security;
revoke all privileges on table public.checkout_submissions from public, anon, authenticated;

revoke all privileges on table public.users from public, anon, authenticated;
revoke select ("full-name", phone, email, "user-address", "total-price", "order-info", id, created_at),
  insert ("full-name", phone, email, "user-address", "total-price", "order-info", id, created_at),
  update ("full-name", phone, email, "user-address", "total-price", "order-info", id, created_at),
  references ("full-name", phone, email, "user-address", "total-price", "order-info", id, created_at)
  on table public.users from public, anon, authenticated;

revoke all privileges on table public.products from public, anon, authenticated;
revoke select (id, name, description, price, image, created_at, stock),
  update (id, name, description, price, image, created_at, stock)
  on table public.products from public, anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select (id, name, description, price, image, created_at)
  on table public.products to anon, authenticated;

drop policy if exists "Public can read product catalog" on public.products;
create policy "Public can read product catalog"
  on public.products
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Allow valid checkout customer inserts" on public.users;
drop function if exists public.submit_checkout(jsonb, jsonb);
drop function if exists public.submit_checkout(jsonb, jsonb, uuid);

create or replace function public.submit_checkout(
  p_customer jsonb,
  p_items jsonb,
  p_request_id uuid
)
returns void
language plpgsql
security definer
set search_path = pg_catalog, public
as $$
declare
  item_record record;
  updated_product_id text;
  accepted_request_id uuid;
  updated_product_name text;
  unit_price numeric;
  subtotal numeric := 0;
  shipping numeric := 60;
  total_price numeric;
  order_lines jsonb := '[]'::jsonb;
begin
  if p_request_id is null
    or jsonb_typeof(p_customer) is distinct from 'object'
    or jsonb_typeof(p_items) is distinct from 'array'
  then
    raise exception using
      errcode = '22023',
      message = 'Invalid customer or cart data.';
  end if;

  if jsonb_array_length(p_items) < 1
    or jsonb_array_length(p_items) > 100
  then
    raise exception using
      errcode = '22023',
      message = 'Invalid customer or cart data.';
  end if;

  if length(trim(coalesce(p_customer->>'full-name', ''))) not between 1 and 120
    or length(trim(coalesce(p_customer->>'phone', ''))) not between 1 and 40
    or length(trim(coalesce(p_customer->>'email', ''))) not between 3 and 254
    or (p_customer->>'email') !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    or length(trim(coalesce(p_customer->>'user-address', ''))) not between 1 and 500
  then
    raise exception using
      errcode = '22023',
      message = 'Invalid customer information.';
  end if;

  if exists (
    select 1
    from jsonb_array_elements(p_items) as entries(item)
    where jsonb_typeof(entries.item) is distinct from 'object'
      or length(coalesce(entries.item->>'id', '')) = 0
      or length(coalesce(entries.item->>'id', '')) > 100
      or coalesce(entries.item->>'quantity', '') !~ '^[1-9][0-9]{0,6}$'
  ) then
    raise exception using
      errcode = '22023',
      message = 'Invalid product or quantity in cart.';
  end if;

  insert into public.checkout_submissions (request_id)
  values (p_request_id)
  on conflict (request_id) do nothing
  returning request_id into accepted_request_id;

  if accepted_request_id is null then
    return;
  end if;

  for item_record in
    select
      entries.item->>'id' as product_id,
      sum((entries.item->>'quantity')::integer)::integer as quantity
    from jsonb_array_elements(p_items) as entries(item)
    group by entries.item->>'id'
    order by entries.item->>'id'
  loop
    update public.products
    set stock = stock - item_record.quantity
    where id::text = item_record.product_id
      and stock >= item_record.quantity
      and price is not null
      and price >= 0
    returning id::text, name, price::numeric
      into updated_product_id, updated_product_name, unit_price;

    if updated_product_id is null then
      raise exception using
        errcode = 'P0001',
        message = 'Insufficient stock or product unavailable.';
    end if;

    subtotal := subtotal + unit_price * item_record.quantity;
    order_lines := order_lines || jsonb_build_array(
      jsonb_build_object(
        'product_id', updated_product_id,
        'name', updated_product_name,
        'quantity', item_record.quantity,
        'unit_price', unit_price,
        'line_total', unit_price * item_record.quantity
      )
    );

    updated_product_id := null;
  end loop;

  total_price := subtotal + shipping;

  insert into public.users (
    "full-name",
    phone,
    email,
    "user-address",
    "total-price",
    "order-info"
  )
  values (
    trim(p_customer->>'full-name'),
    trim(p_customer->>'phone'),
    trim(p_customer->>'email'),
    trim(p_customer->>'user-address'),
    round(total_price, 2)::text,
    jsonb_build_object(
      'items', order_lines,
      'subtotal', round(subtotal, 2),
      'shipping', shipping,
      'total', round(total_price, 2),
      'currency', 'EGP'
    )::text
  );
end;
$$;

revoke all on function public.submit_checkout(jsonb, jsonb, uuid) from public;
grant execute on function public.submit_checkout(jsonb, jsonb, uuid) to anon, authenticated;

commit;

notify pgrst, 'reload schema';

select to_regprocedure('public.submit_checkout(jsonb,jsonb,uuid)') as checkout_function;
