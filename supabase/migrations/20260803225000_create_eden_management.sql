-- EDEN management platform
-- Run with Supabase migrations before opening /eden-admin.

create extension if not exists pgcrypto;

create table if not exists public.eden_odyssees (
  id text primary key,
  name text not null unique,
  accent text not null default '#8E93A8',
  prologue text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.eden_scents (
  id bigint primary key,
  odyssey_id text not null references public.eden_odyssees(id) on delete restrict,
  name text not null unique,
  sale_price integer not null default 12000 check (sale_price >= 0),
  stock integer not null default 0 check (stock >= 0),
  sold integer not null default 0 check (sold >= 0),
  low_stock_threshold integer not null default 5 check (low_stock_threshold >= 0),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.eden_materials (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  purchase_price integer not null default 0 check (purchase_price >= 0),
  purchase_quantity numeric not null default 1 check (purchase_quantity > 0),
  unit text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.eden_recipes (
  id uuid primary key default gen_random_uuid(),
  scent_id bigint not null references public.eden_scents(id) on delete cascade,
  material_id uuid not null references public.eden_materials(id) on delete restrict,
  quantity numeric not null check (quantity > 0),
  created_at timestamptz not null default now(),
  unique (scent_id, material_id)
);

create table if not exists public.eden_customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists eden_customers_phone_unique
  on public.eden_customers(phone)
  where phone is not null and btrim(phone) <> '';

create table if not exists public.eden_sales (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references public.eden_customers(id) on delete set null,
  customer_name text not null default 'Cliente de passage',
  customer_phone text,
  channel text not null default 'WhatsApp',
  payment_method text not null default 'Espèces',
  payment_status text not null default 'paid' check (payment_status in ('paid','due')),
  total integer not null default 0 check (total >= 0),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.eden_sale_items (
  id uuid primary key default gen_random_uuid(),
  sale_id uuid not null references public.eden_sales(id) on delete cascade,
  scent_id bigint not null references public.eden_scents(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  unit_price integer not null check (unit_price >= 0),
  unit_cost numeric not null default 0 check (unit_cost >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.eden_expenses (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  category text not null,
  amount integer not null check (amount > 0),
  spent_on date not null default current_date,
  notes text not null default '',
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.eden_batches (
  id uuid primary key default gen_random_uuid(),
  batch_code text not null unique,
  scent_id bigint not null references public.eden_scents(id) on delete restrict,
  quantity integer not null check (quantity > 0),
  started_on date not null default current_date,
  maturation_days integer not null default 21 check (maturation_days > 0),
  status text not null default 'maturing' check (status in ('maturing','ready','received','cancelled')),
  notes text not null default '',
  received_at timestamptz,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create table if not exists public.eden_stock_movements (
  id uuid primary key default gen_random_uuid(),
  scent_id bigint not null references public.eden_scents(id) on delete restrict,
  delta integer not null check (delta <> 0),
  reason text not null,
  reference_id uuid,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now()
);

create index if not exists eden_scents_odyssey_idx on public.eden_scents(odyssey_id);
create index if not exists eden_sales_created_idx on public.eden_sales(created_at desc);
create index if not exists eden_batches_status_idx on public.eden_batches(status, started_on);
create index if not exists eden_stock_movements_scent_idx on public.eden_stock_movements(scent_id, created_at desc);

alter table public.eden_odyssees enable row level security;
alter table public.eden_scents enable row level security;
alter table public.eden_materials enable row level security;
alter table public.eden_recipes enable row level security;
alter table public.eden_customers enable row level security;
alter table public.eden_sales enable row level security;
alter table public.eden_sale_items enable row level security;
alter table public.eden_expenses enable row level security;
alter table public.eden_batches enable row level security;
alter table public.eden_stock_movements enable row level security;

do $$
declare
  table_name text;
begin
  foreach table_name in array array[
    'eden_odyssees','eden_scents','eden_materials','eden_recipes','eden_customers',
    'eden_sales','eden_sale_items','eden_expenses','eden_batches','eden_stock_movements'
  ] loop
    execute format('drop policy if exists %I on public.%I', table_name || '_authenticated', table_name);
    execute format(
      'create policy %I on public.%I for all to authenticated using (true) with check (true)',
      table_name || '_authenticated', table_name
    );
  end loop;
end $$;

create or replace function public.eden_recipe_cost(p_scent_id bigint)
returns numeric
language sql
stable
security invoker
set search_path = public
as $$
  select coalesce(sum(r.quantity * (m.purchase_price::numeric / m.purchase_quantity)), 0)
  from public.eden_recipes r
  join public.eden_materials m on m.id = r.material_id
  where r.scent_id = p_scent_id;
$$;

create or replace function public.eden_record_sale(
  p_scent_id bigint,
  p_quantity integer,
  p_customer_name text default 'Cliente de passage',
  p_customer_phone text default null,
  p_channel text default 'WhatsApp',
  p_payment_method text default 'Espèces'
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
  if auth.uid() is null then
    raise exception 'Authentication required';
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

  insert into public.eden_sales(
    customer_id, customer_name, customer_phone, channel, payment_method, payment_status, total
  ) values (
    v_customer_id,
    coalesce(nullif(btrim(p_customer_name), ''), 'Cliente de passage'),
    nullif(btrim(coalesce(p_customer_phone, '')), ''),
    coalesce(nullif(btrim(p_channel), ''), 'WhatsApp'),
    coalesce(nullif(btrim(p_payment_method), ''), 'Espèces'),
    v_status,
    v_scent.sale_price * p_quantity
  ) returning id into v_sale_id;

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
  p_reason text default 'manual adjustment'
)
returns integer
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_stock integer;
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
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

  insert into public.eden_stock_movements(scent_id, delta, reason)
  values (p_scent_id, p_delta, coalesce(nullif(btrim(p_reason), ''), 'manual adjustment'));

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
  if auth.uid() is null then
    raise exception 'Authentication required';
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

insert into public.eden_odyssees(id, name, accent, prologue, sort_order) values
  ('moon','Moon Trip','#8E93A8','Embarquez pour une escapade où chaque senteur célèbre l’amour, les émotions et les instants partagés. Moon Trip vous transporte vers des destinations romantiques baignées par la lumière de la lune.',1),
  ('garden','Eden Garden','#7D8F6A','Poussez les portes d’EDEN et laissez-vous guider à travers un jardin où nature, lumière et sérénité s’unissent. Chaque senteur révèle un nouveau sentier vers le paradis.',2),
  ('iles','Îles Éternelles','#C08268','Explorez des îles lointaines où lagons, terres colorées et rivages paisibles composent un archipel intemporel. Chaque senteur est une nouvelle île à découvrir.',3),
  ('rivages','Rivages','#C88A3D','Marchez le long de rivages baignés de lumière, là où le sable chaud, les embruns et les couchers de soleil deviennent des souvenirs parfumés.',4),
  ('etoiles','Étoiles Nomades','#6D7FA3','Lorsque le ciel devient votre boussole, chaque étoile ouvre une nouvelle route. Cette Odyssée célèbre les grands espaces, les nuits infinies et la beauté du cosmos.',5),
  ('hiver','Souffle d’Hiver','#8FA7B7','Entre paysages givrés et refuges chaleureux, découvrez des senteurs qui réchauffent l’âme autant qu’elles parfument votre intérieur.',6),
  ('nuit','Évasions Nocturnes','#5C486D','Quand le monde s’endort, un autre voyage commence. Mystérieuse, profonde et envoûtante, cette Odyssée invite à explorer les plus belles heures de la nuit.',7)
on conflict (id) do update set
  name = excluded.name,
  accent = excluded.accent,
  prologue = excluded.prologue,
  sort_order = excluded.sort_order;

insert into public.eden_scents(id, odyssey_id, name, sale_price, stock, sold, low_stock_threshold) values
  (1,'moon','Un Soir à EDEN',12000,0,0,5),
  (2,'moon','Love Island',12000,0,0,5),
  (3,'moon','Paradis des Sens',12000,0,0,5),
  (4,'garden','Éclat d’Aurore',12000,0,0,5),
  (5,'garden','Kawthar',15000,0,0,5),
  (6,'garden','L’Allée des Merveilles',12000,0,0,5),
  (7,'iles','Île Rouge',12000,0,0,5),
  (8,'iles','Terre d’Azur',12000,0,0,5),
  (9,'iles','Baie Nacrée',12000,0,0,5),
  (10,'rivages','Forever SunScent',12000,0,0,5),
  (11,'rivages','Soleil d’Été',12000,0,0,5),
  (12,'rivages','Brise Ambrée',13500,0,0,5),
  (13,'etoiles','Poussière d’Étoiles',13500,0,0,5),
  (14,'etoiles','Éclat Cosmique',13500,0,0,5),
  (15,'etoiles','Lueur Céleste',13500,0,0,5),
  (16,'hiver','Oudivine',18000,0,0,5),
  (17,'hiver','Cocon d’Hiver',13500,0,0,5),
  (18,'hiver','Snow Velvet',13500,0,0,5),
  (19,'nuit','Escapade de Minuit',15000,0,0,5),
  (20,'nuit','Éclipse Lunaire',15000,0,0,5),
  (21,'nuit','Sillage Obscur',15000,0,0,5)
on conflict (id) do update set
  odyssey_id = excluded.odyssey_id,
  name = excluded.name,
  sale_price = excluded.sale_price,
  low_stock_threshold = excluded.low_stock_threshold,
  updated_at = now();
