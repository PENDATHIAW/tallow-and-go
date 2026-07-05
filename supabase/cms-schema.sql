-- Tallow & Go — CMS (prix, photos, textes éditoriaux)
-- Exécuter dans l'éditeur SQL Supabase (une seule fois)

create table if not exists public.shop_product_overrides (
  product_id text primary key,
  price integer check (price is null or price >= 0),
  image_url text,
  name text,
  tagline_fr text,
  tagline_en text,
  description_fr text,
  description_en text,
  featured boolean,
  active boolean,
  updated_at timestamptz not null default now()
);

create table if not exists public.shop_bundle_overrides (
  bundle_id text primary key,
  price integer check (price is null or price >= 0),
  image_url text,
  name text,
  tagline_fr text,
  tagline_en text,
  description_fr text,
  description_en text,
  active boolean,
  updated_at timestamptz not null default now()
);

create table if not exists public.shop_content_blocks (
  block_key text not null,
  locale text not null default 'fr' check (locale in ('fr', 'en')),
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (block_key, locale)
);

alter table public.shop_product_overrides enable row level security;
alter table public.shop_bundle_overrides enable row level security;
alter table public.shop_content_blocks enable row level security;

drop policy if exists "Overrides produits lisibles" on public.shop_product_overrides;
create policy "Overrides produits lisibles"
  on public.shop_product_overrides for select to anon, authenticated
  using (active is distinct from false);

drop policy if exists "Overrides bundles lisibles" on public.shop_bundle_overrides;
create policy "Overrides bundles lisibles"
  on public.shop_bundle_overrides for select to anon, authenticated
  using (active is distinct from false);

drop policy if exists "Contenu CMS lisible" on public.shop_content_blocks;
create policy "Contenu CMS lisible"
  on public.shop_content_blocks for select to anon, authenticated using (true);

grant select on public.shop_product_overrides to anon, authenticated;
grant select on public.shop_bundle_overrides to anon, authenticated;
grant select on public.shop_content_blocks to anon, authenticated;

create or replace function public.get_shop_config()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_products jsonb := '{}'::jsonb;
  v_bundles jsonb := '{}'::jsonb;
  v_content jsonb := '{}'::jsonb;
begin
  select coalesce(jsonb_object_agg(product_id, to_jsonb(p) - 'product_id'), '{}'::jsonb)
    into v_products
    from public.shop_product_overrides p
   where active is distinct from false;

  select coalesce(jsonb_object_agg(bundle_id, to_jsonb(b) - 'bundle_id'), '{}'::jsonb)
    into v_bundles
    from public.shop_bundle_overrides b
   where active is distinct from false;

  select coalesce(jsonb_object_agg(block_key || ':' || locale, content), '{}'::jsonb)
    into v_content
    from public.shop_content_blocks;

  return jsonb_build_object(
    'products', v_products,
    'bundles', v_bundles,
    'content', v_content
  );
end;
$$;

create or replace function public.admin_get_shop_config(p_user text, p_password text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_products jsonb := '{}'::jsonb;
  v_bundles jsonb := '{}'::jsonb;
  v_content jsonb := '{}'::jsonb;
begin
  if not public.admin_check(p_user, p_password) then
    raise exception 'Unauthorized';
  end if;

  select coalesce(jsonb_object_agg(product_id, to_jsonb(p) - 'product_id'), '{}'::jsonb)
    into v_products
    from public.shop_product_overrides p;

  select coalesce(jsonb_object_agg(bundle_id, to_jsonb(b) - 'bundle_id'), '{}'::jsonb)
    into v_bundles
    from public.shop_bundle_overrides b;

  select coalesce(jsonb_object_agg(block_key || ':' || locale, content), '{}'::jsonb)
    into v_content
    from public.shop_content_blocks;

  return jsonb_build_object(
    'products', v_products,
    'bundles', v_bundles,
    'content', v_content
  );
end;
$$;

create or replace function public.admin_upsert_product_override(
  p_user text,
  p_password text,
  p_product_id text,
  p_price integer,
  p_image_url text,
  p_name text,
  p_tagline_fr text,
  p_tagline_en text,
  p_description_fr text,
  p_description_en text,
  p_featured boolean,
  p_active boolean
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

  insert into public.shop_product_overrides (
    product_id, price, image_url, name, tagline_fr, tagline_en,
    description_fr, description_en, featured, active, updated_at
  ) values (
    p_product_id, p_price, nullif(trim(p_image_url), ''), nullif(trim(p_name), ''),
    nullif(trim(p_tagline_fr), ''), nullif(trim(p_tagline_en), ''),
    nullif(trim(p_description_fr), ''), nullif(trim(p_description_en), ''),
    p_featured, p_active, now()
  )
  on conflict (product_id) do update set
    price = excluded.price,
    image_url = excluded.image_url,
    name = excluded.name,
    tagline_fr = excluded.tagline_fr,
    tagline_en = excluded.tagline_en,
    description_fr = excluded.description_fr,
    description_en = excluded.description_en,
    featured = excluded.featured,
    active = excluded.active,
    updated_at = now();
end;
$$;

create or replace function public.admin_upsert_bundle_override(
  p_user text,
  p_password text,
  p_bundle_id text,
  p_price integer,
  p_image_url text,
  p_name text,
  p_tagline_fr text,
  p_tagline_en text,
  p_description_fr text,
  p_description_en text,
  p_active boolean
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

  insert into public.shop_bundle_overrides (
    bundle_id, price, image_url, name, tagline_fr, tagline_en,
    description_fr, description_en, active, updated_at
  ) values (
    p_bundle_id, p_price, nullif(trim(p_image_url), ''), nullif(trim(p_name), ''),
    nullif(trim(p_tagline_fr), ''), nullif(trim(p_tagline_en), ''),
    nullif(trim(p_description_fr), ''), nullif(trim(p_description_en), ''),
    p_active, now()
  )
  on conflict (bundle_id) do update set
    price = excluded.price,
    image_url = excluded.image_url,
    name = excluded.name,
    tagline_fr = excluded.tagline_fr,
    tagline_en = excluded.tagline_en,
    description_fr = excluded.description_fr,
    description_en = excluded.description_en,
    active = excluded.active,
    updated_at = now();
end;
$$;

create or replace function public.admin_upsert_content_block(
  p_user text,
  p_password text,
  p_block_key text,
  p_locale text,
  p_content jsonb
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

  insert into public.shop_content_blocks (block_key, locale, content, updated_at)
  values (p_block_key, p_locale, coalesce(p_content, '{}'::jsonb), now())
  on conflict (block_key, locale) do update set
    content = excluded.content,
    updated_at = now();
end;
$$;

grant execute on function public.get_shop_config() to anon, authenticated;
grant execute on function public.admin_get_shop_config(text, text) to anon, authenticated;
grant execute on function public.admin_upsert_product_override(text, text, text, integer, text, text, text, text, text, text, boolean, boolean) to anon, authenticated;
grant execute on function public.admin_upsert_bundle_override(text, text, text, integer, text, text, text, text, text, text, boolean) to anon, authenticated;
grant execute on function public.admin_upsert_content_block(text, text, text, text, jsonb) to anon, authenticated;
