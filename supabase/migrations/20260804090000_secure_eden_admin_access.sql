-- Lock EDEN down to an explicit admin allowlist and add idempotency keys.
-- Run after 20260803225000_create_eden_management.sql.
--
-- IMPORTANT: after running this migration, every current EDEN account loses
-- access until you explicitly re-admit it. Finish with step 4 below (insert
-- your own auth user id into eden_admins) or you will lock yourself out too.

-- 1. Admin allowlist -----------------------------------------------------

create table if not exists public.eden_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  created_at timestamptz not null default now()
);

alter table public.eden_admins enable row level security;

drop policy if exists eden_admins_self_read on public.eden_admins;
create policy eden_admins_self_read on public.eden_admins
  for select to authenticated
  using (user_id = auth.uid());

-- 2. Security definer helpers ---------------------------------------------
-- security definer so RLS policies (and the client, for a quick UX check)
-- can evaluate admin status without needing their own select grant on
-- eden_admins, and without recursive RLS evaluation.

create or replace function public.eden_is_admin(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.eden_admins where user_id = p_user_id);
$$;

revoke all on function public.eden_is_admin(uuid) from public;
grant execute on function public.eden_is_admin(uuid) to authenticated, anon;

create or replace function public.eden_current_user_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select public.eden_is_admin(auth.uid());
$$;

revoke all on function public.eden_current_user_is_admin() from public;
grant execute on function public.eden_current_user_is_admin() to authenticated, anon;

-- 3. Replace "any authenticated user" policies with "admins only" --------

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'eden_odyssees','eden_scents','eden_materials','eden_recipes','eden_customers',
    'eden_sales','eden_sale_items','eden_expenses','eden_batches','eden_stock_movements'
  ] loop
    execute format('drop policy if exists %I on public.%I', table_name || '_authenticated', table_name);
    execute format('drop policy if exists %I on public.%I', table_name || '_admin_only', table_name);
    execute format(
      'create policy %I on public.%I for all to authenticated using (public.eden_is_admin(auth.uid())) with check (public.eden_is_admin(auth.uid()))',
      table_name || '_admin_only', table_name
    );
  end loop;
end $$;

-- 4. Re-admit yourself -----------------------------------------------------
-- Replace the uuid below with your own auth.users id (Authentication → Users
-- in Supabase, copy the "UID" column for your EDEN login) and run this once:
--
-- insert into public.eden_admins (user_id, email)
-- values ('00000000-0000-0000-0000-000000000000', 'votre-email@exemple.com')
-- on conflict (user_id) do nothing;

-- 5. Idempotency keys -------------------------------------------------------
-- One key per client-initiated action. A retried network call reuses the
-- same key, so the unique index below turns a duplicate insert into a no-op
-- (or, for the sale/stock RPCs, into a lookup of the original result).

alter table public.eden_sales add column if not exists idempotency_key text;
alter table public.eden_stock_movements add column if not exists idempotency_key text;
alter table public.eden_expenses add column if not exists idempotency_key text;
alter table public.eden_batches add column if not exists idempotency_key text;

create unique index if not exists eden_sales_idempotency_key_unique
  on public.eden_sales(idempotency_key) where idempotency_key is not null;
create unique index if not exists eden_stock_movements_idempotency_key_unique
  on public.eden_stock_movements(idempotency_key) where idempotency_key is not null;
create unique index if not exists eden_expenses_idempotency_key_unique
  on public.eden_expenses(idempotency_key) where idempotency_key is not null;
create unique index if not exists eden_batches_idempotency_key_unique
  on public.eden_batches(idempotency_key) where idempotency_key is not null;

-- 6. Re-create the sale/stock/batch functions: require admin, honor the key

create or replace function public.eden_record_sale(
  p_scent_id bigint,
  p_quantity integer,
  p_customer_name text default 'Cliente de passage',
  p_customer_phone text default null,
  p_channel text default 'WhatsApp',
  p_payment_method text default 'Espèces',
  p_idempotency_key text default null
)
returns uuid
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_scent public.eden_scents%rowtype;
  v_customer_id uuid;
  v_sale_id uuid;
  v_status text;
  v_unit_cost numeric;
begin
  if not public.eden_is_admin(auth.uid()) then
    raise exception 'Admin access required';
  end if;

  if p_idempotency_key is not null then
    select id into v_sale_id from public.eden_sales where idempotency_key = p_idempotency_key;
    if found then
      return v_sale_id;
    end if;
  end if;

  if p_quantity is null or p_quantity <= 0 then
    raise exception 'Quantity must be greater than zero';
  end if;

  select * into v_scent
  from public.eden_scents
  where id = p_scent_id and active = true
  for update;

  if not found then
    raise exception 'Scent not found';
  end if;
  if v_scent.stock < p_quantity then
    raise exception 'Insufficient stock';
  end if;

  if p_customer_phone is not null and btrim(p_customer_phone) <> '' then
    insert into public.eden_customers(name, phone)
    values (coalesce(nullif(btrim(p_customer_name), ''), 'Cliente'), btrim(p_customer_phone))
    on conflict (phone) where phone is not null and btrim(phone) <> ''
    do update set name = excluded.name, updated_at = now()
    returning id into v_customer_id;
  end if;

  v_status := case when lower(coalesce(p_payment_method, '')) in ('à payer','a payer','due') then 'due' else 'paid' end;
  v_unit_cost := public.eden_recipe_cost(p_scent_id);

  begin
    insert into public.eden_sales(
      customer_id, customer_name, customer_phone, channel, payment_method, payment_status, total, idempotency_key
    ) values (
      v_customer_id,
      coalesce(nullif(btrim(p_customer_name), ''), 'Cliente de passage'),
      nullif(btrim(coalesce(p_customer_phone, '')), ''),
      coalesce(nullif(btrim(p_channel), ''), 'WhatsApp'),
      coalesce(nullif(btrim(p_payment_method), ''), 'Espèces'),
      v_status,
      v_scent.sale_price * p_quantity,
      p_idempotency_key
    ) returning id into v_sale_id;
  exception when unique_violation then
    select id into v_sale_id from public.eden_sales where idempotency_key = p_idempotency_key;
    return v_sale_id;
  end;

  insert into public.eden_sale_items(sale_id, scent_id, quantity, unit_price, unit_cost)
  values (v_sale_id, p_scent_id, p_quantity, v_scent.sale_price, v_unit_cost);

  update public.eden_scents
  set stock = stock - p_quantity,
      sold = sold + p_quantity,
      updated_at = now()
  where id = p_scent_id;

  insert into public.eden_stock_movements(scent_id, delta, reason, reference_id)
  values (p_scent_id, -p_quantity, 'sale', v_sale_id);

  return v_sale_id;
end;
$$;

create or replace function public.eden_adjust_stock(
  p_scent_id bigint,
  p_delta integer,
  p_reason text default 'manual adjustment',
  p_idempotency_key text default null
)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_stock integer;
  v_existing uuid;
begin
  if not public.eden_is_admin(auth.uid()) then
    raise exception 'Admin access required';
  end if;

  if p_idempotency_key is not null then
    select id into v_existing from public.eden_stock_movements where idempotency_key = p_idempotency_key;
    if found then
      select stock into v_stock from public.eden_scents where id = p_scent_id;
      return v_stock;
    end if;
  end if;

  if p_delta is null or p_delta = 0 then
    raise exception 'Delta cannot be zero';
  end if;

  update public.eden_scents
  set stock = stock + p_delta, updated_at = now()
  where id = p_scent_id and stock + p_delta >= 0
  returning stock into v_stock;

  if v_stock is null then
    raise exception 'Invalid stock adjustment';
  end if;

  begin
    insert into public.eden_stock_movements(scent_id, delta, reason, idempotency_key)
    values (p_scent_id, p_delta, coalesce(nullif(btrim(p_reason), ''), 'manual adjustment'), p_idempotency_key);
  exception when unique_violation then
    null;
  end;

  return v_stock;
end;
$$;

create or replace function public.eden_receive_batch(p_batch_id uuid)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_batch public.eden_batches%rowtype;
  v_stock integer;
begin
  if not public.eden_is_admin(auth.uid()) then
    raise exception 'Admin access required';
  end if;

  select * into v_batch
  from public.eden_batches
  where id = p_batch_id
  for update;

  if not found then
    raise exception 'Batch not found';
  end if;
  if v_batch.status = 'received' then
    raise exception 'Batch already received';
  end if;
  if v_batch.status = 'cancelled' then
    raise exception 'Cancelled batch cannot be received';
  end if;

  update public.eden_scents
  set stock = stock + v_batch.quantity, updated_at = now()
  where id = v_batch.scent_id
  returning stock into v_stock;

  update public.eden_batches
  set status = 'received', received_at = now()
  where id = p_batch_id;

  insert into public.eden_stock_movements(scent_id, delta, reason, reference_id)
  values (v_batch.scent_id, v_batch.quantity, 'batch received', p_batch_id);

  return v_stock;
end;
$$;
