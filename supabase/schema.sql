-- Tallow & Go — Schéma e-commerce (commandes, localités, admin)
-- Exécuter dans l'éditeur SQL Supabase

create extension if not exists "pgcrypto";

-- Localités (miroir seed frontend, modifiable en admin)
create table if not exists public.localities (
  id text primary key,
  name_fr text not null,
  name_en text not null,
  zone_group text not null,
  shipping_fee integer not null check (shipping_fee >= 0),
  active boolean not null default true
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  locality_id text not null,
  locality_label text not null,
  address_details text,
  payment_method text not null check (payment_method in ('wave', 'orange_money', 'cash')),
  subtotal integer not null check (subtotal >= 0),
  shipping_fee integer not null check (shipping_fee >= 0),
  total integer not null check (total >= 0),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  item_type text not null check (item_type in ('product', 'bundle')),
  item_id text not null,
  item_name text not null,
  unit_price integer not null check (unit_price >= 0),
  quantity integer not null check (quantity > 0),
  line_total integer not null check (line_total >= 0)
);

create index if not exists idx_orders_created on public.orders(created_at desc);
create index if not exists idx_order_items_order on public.order_items(order_id);
create index if not exists idx_order_items_product on public.order_items(item_id);

-- Newsletter (conservé)
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.localities enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "Localités lisibles publiquement"
  on public.localities for select to anon, authenticated using (active = true);

-- INSERT only (pas de SELECT public) : le frontend génère l'UUID et n'utilise pas RETURNING
create policy "Création commande publique"
  on public.orders for insert to anon, authenticated with check (true);

create policy "Création lignes commande publique"
  on public.order_items for insert to anon, authenticated with check (true);

create policy "Inscription newsletter publique"
  on public.newsletter_subscribers for insert to anon, authenticated with check (true);

grant usage on schema public to anon, authenticated;
grant select on public.localities to anon, authenticated;
grant insert on public.orders to anon, authenticated;
grant insert on public.order_items to anon, authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;

-- Fonctions admin (mot de passe via secret — remplacer en production)
create or replace function public.admin_check(p_user text, p_password text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  return p_user = coalesce(current_setting('app.admin_user', true), 'penda')
     and p_password = coalesce(current_setting('app.admin_password', true), 'Mariemediatta10#');
end;
$$;

create or replace function public.admin_get_orders(p_user text, p_password text)
returns setof public.orders
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_check(p_user, p_password) then
    raise exception 'Unauthorized';
  end if;
  return query select * from public.orders order by created_at desc;
end;
$$;

create or replace function public.admin_get_order_items(p_user text, p_password text)
returns setof public.order_items
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_check(p_user, p_password) then
    raise exception 'Unauthorized';
  end if;
  return query select * from public.order_items;
end;
$$;

create or replace function public.admin_update_order_status(
  p_user text, p_password text, p_order_id uuid, p_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.admin_check(p_user, p_password) then
    raise exception 'Unauthorized';
  end if;
  update public.orders set status = p_status where id = p_order_id;
end;
$$;

-- Seed localités (extrait — compléter via dashboard si besoin)
insert into public.localities (id, name_fr, name_en, zone_group, shipping_fee) values
  ('plateau', 'Plateau', 'Plateau', 'dakar-2000', 2000),
  ('medina', 'Médina', 'Médina', 'dakar-2000', 2000),
  ('fann', 'Fann / Point E / Amitié', 'Fann / Point E / Amitié', 'dakar-2000', 2000),
  ('yoff', 'Yoff', 'Yoff', 'dakar-1500', 1500),
  ('mermoz', 'Mermoz / Sacré-Cœur', 'Mermoz / Sacré-Cœur', 'dakar-1500', 1500),
  ('pikine', 'Pikine', 'Pikine', 'dakar-3500', 3500),
  ('guediawaye', 'Guédiawaye', 'Guédiawaye', 'dakar-3500', 3500),
  ('rufisque', 'Rufisque', 'Rufisque', 'rufisque-4000', 4000),
  ('thies', 'Thiès', 'Thiès', 'thies-mbour', 3000),
  ('mbour', 'Mbour / Saly', 'Mbour / Saly', 'thies-mbour', 3000),
  ('saint-louis', 'Saint-Louis', 'Saint-Louis', 'regions', 5000),
  ('autre-region', 'Autre localité régionale', 'Other regional location', 'regions', 5000)
on conflict (id) do nothing;

grant execute on function public.admin_check to anon, authenticated;
grant execute on function public.admin_get_orders to anon, authenticated;
grant execute on function public.admin_get_order_items to anon, authenticated;
grant execute on function public.admin_update_order_status to anon, authenticated;
