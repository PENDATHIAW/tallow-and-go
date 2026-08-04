-- Settle and cancel sales; keep a visible audit trail instead of deleting.
-- Run after 20260804090000_secure_eden_admin_access.sql.

alter table public.eden_sales drop constraint if exists eden_sales_payment_status_check;
alter table public.eden_sales add constraint eden_sales_payment_status_check
  check (payment_status in ('paid','due','cancelled'));

create or replace function public.eden_settle_sale(p_sale_id uuid)
returns void
language plpgsql
security invoker
set search_path = public
as $$
begin
  if not public.eden_is_admin(auth.uid()) then
    raise exception 'Admin access required';
  end if;

  update public.eden_sales
  set payment_status = 'paid'
  where id = p_sale_id and payment_status = 'due';

  if not found then
    raise exception 'Sale not found or already settled';
  end if;
end;
$$;

create or replace function public.eden_cancel_sale(p_sale_id uuid, p_reason text default 'sale cancelled')
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_sale public.eden_sales%rowtype;
  v_item record;
begin
  if not public.eden_is_admin(auth.uid()) then
    raise exception 'Admin access required';
  end if;

  select * into v_sale from public.eden_sales where id = p_sale_id for update;
  if not found then
    raise exception 'Sale not found';
  end if;
  if v_sale.payment_status = 'cancelled' then
    return;
  end if;

  for v_item in select * from public.eden_sale_items where sale_id = p_sale_id loop
    update public.eden_scents
    set stock = stock + v_item.quantity,
        sold = greatest(0, sold - v_item.quantity),
        updated_at = now()
    where id = v_item.scent_id;

    insert into public.eden_stock_movements(scent_id, delta, reason, reference_id)
    values (v_item.scent_id, v_item.quantity, coalesce(nullif(btrim(p_reason), ''), 'sale cancelled'), p_sale_id);
  end loop;

  update public.eden_sales
  set payment_status = 'cancelled'
  where id = p_sale_id;
end;
$$;
