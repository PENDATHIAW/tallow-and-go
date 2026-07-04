-- Tallow & Go — Emails commande via Resend (pg_net)
-- Exécuter UNE FOIS dans Supabase → SQL Editor
-- Remplace __RESEND_API_KEY__ par ta clé re_... avant d'exécuter

create extension if not exists pg_net with schema extensions;

create schema if not exists private;

create table if not exists private.app_config (
  key text primary key,
  value text not null
);

revoke all on schema private from public;
revoke all on private.app_config from public;

insert into private.app_config (key, value) values
  ('resend_api_key', '__RESEND_API_KEY__'),
  ('shop_email', 'pendathiaw1995@gmail.com'),
  ('from_email', 'Tallow & Go <onboarding@resend.dev>')
on conflict (key) do update set value = excluded.value;

create or replace function public.send_order_confirmation_email(p_order jsonb, p_locale text default 'fr')
returns jsonb
language plpgsql
security definer
set search_path = public, private, extensions
as $$
declare
  resend_key text;
  shop_email text;
  from_email text;
  body text;
  customer_email text;
  customer_phone text;
  order_number text;
  email_sent boolean := false;
  shop_notified boolean := false;
  item record;
  item_lines text := '';
  locality_name text;
  payment_label text;
begin
  select value into resend_key from private.app_config where key = 'resend_api_key';
  select value into shop_email from private.app_config where key = 'shop_email';
  select value into from_email from private.app_config where key = 'from_email';

  if resend_key is null or resend_key = '' or resend_key = '__RESEND_API_KEY__' then
    return jsonb_build_object('ok', false, 'emailSent', false, 'shopNotified', false, 'reason', 'not_configured');
  end if;

  customer_email := nullif(trim(p_order #>> '{customer,email}'), '');
  customer_phone := coalesce(p_order #>> '{customer,phone}', '');
  order_number := coalesce(p_order #>> '{orderNumber}', '');

  locality_name := coalesce(
    p_order #>> array['locality','name', p_locale],
    p_order #>> '{locality,name,fr}',
    ''
  );

  payment_label := coalesce(p_order #>> '{paymentMethod}', '');

  for item in
    select * from jsonb_to_recordset(coalesce(p_order #> '{items}', '[]'::jsonb))
      as x(name text, quantity int, "unitPrice" int)
  loop
    item_lines := item_lines || E'\n• ' || item.name || ' × ' || item.quantity
      || ' — ' || to_char(item."unitPrice" * item.quantity, 'FM999G999G999') || ' F';
  end loop;

  body := case when p_locale = 'fr' then 'Commande Tallow & Go' else 'Tallow & Go order' end
    || E'\n\n' || case when p_locale = 'fr' then 'N° commande' else 'Order no.' end || ' : ' || order_number
    || E'\n' || (p_order #>> '{customer,name}') || ' · ' || customer_phone
    || case when customer_email is not null then E'\n' || customer_email else '' end
    || E'\n' || locality_name
    || E'\n' || coalesce(p_order #>> '{customer,address}', '')
    || item_lines
    || E'\n\n' || case when p_locale = 'fr' then 'Sous-total' else 'Subtotal' end
    || ' : ' || to_char((p_order #>> '{subtotal}')::int, 'FM999G999G999') || ' F'
    || E'\n' || case when p_locale = 'fr' then 'Livraison' else 'Shipping' end
    || ' : ' || to_char((p_order #>> '{shippingFee}')::int, 'FM999G999G999') || ' F'
    || E'\n' || case when p_locale = 'fr' then 'Total' else 'Total' end
    || ' : ' || to_char((p_order #>> '{total}')::int, 'FM999G999G999') || ' F'
    || E'\n' || case when p_locale = 'fr' then 'Paiement' else 'Payment' end || ' : ' || payment_label;

  if customer_email is not null then
    perform net.http_post(
      url := 'https://api.resend.com/emails',
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || resend_key,
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'from', from_email,
        'to', jsonb_build_array(customer_email),
        'subject', case when p_locale = 'fr'
          then 'Commande ' || order_number || ' — Tallow & Go'
          else 'Order ' || order_number || ' — Tallow & Go'
        end,
        'text', body
      )
    );
    email_sent := true;
  end if;

  perform net.http_post(
    url := 'https://api.resend.com/emails',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || resend_key,
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'from', from_email,
      'to', jsonb_build_array(shop_email),
      'subject', 'Nouvelle commande ' || order_number,
      'text', body || case when customer_email is null
        then E'\n\n⚠️ Pas d''email client — confirmer par WhatsApp au ' || customer_phone
        else ''
      end
    )
  );
  shop_notified := true;

  return jsonb_build_object('ok', true, 'emailSent', email_sent, 'shopNotified', shop_notified);
end;
$$;

grant execute on function public.send_order_confirmation_email(jsonb, text) to anon, authenticated;
