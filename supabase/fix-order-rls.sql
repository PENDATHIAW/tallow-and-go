-- À exécuter dans Supabase → SQL Editor si la validation de commande échoue (RLS)
-- Corrige les droits INSERT pour anon + policies checkout

drop policy if exists "Création commande publique" on public.orders;
create policy "Création commande publique"
  on public.orders for insert to anon, authenticated with check (true);

drop policy if exists "Création lignes commande publique" on public.order_items;
create policy "Création lignes commande publique"
  on public.order_items for insert to anon, authenticated with check (true);

grant usage on schema public to anon, authenticated;
grant insert on public.orders to anon, authenticated;
grant insert on public.order_items to anon, authenticated;
