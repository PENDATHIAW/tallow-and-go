-- Mise à jour emails : récap client inclus dans mail boutique (mode test Resend)
-- Exécuter dans Supabase → SQL Editor si les clients ne reçoivent pas encore leurs emails

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
  shop_body text;
  customer_email text;
  customer_phone text;
  order_number text;
  email_sent boolean := false;
  shop_notified boolean := false;
  sandbox_mode boolean := false;
  can_send_to_customer boolean := false;
  item record;
  item_lines text := '';
  locality_name text;
  payment_label text;
begin
  select value into resend_key from private.app_config where key = 'resend_api_key';
  select value into shop_email from private.app_config where key = 'shop_email';
  select value into from_email from private.app_config where key = 'from_email';

  if resend_key is null or resend_key = '' then
    return jsonb_build_object('ok', false, 'emailSent', false, 'shopNotified', false, 'reason', 'not_configured');
  end if;

  sandbox_mode := coalesce(from_email, '') ilike '%resend.dev%';
  customer_email := nullif(trim(p_order #>> '{customer,email}'), '');
  customer_phone := coalesce(p_order #>> '{customer,phone}', '');
  order_number := coalesce(p_order #>> '{orderNumber}', '');

  can_send_to_customer := customer_email is not null
    and (not sandbox_mode or lower(customer_email) = lower(shop_email));

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

  shop_body := body;

  if customer_email is null then
    shop_body := shop_body || E'\n\n⚠️ Pas d''email client — confirmer par WhatsApp au ' || customer_phone;
  elsif sandbox_mode and lower(customer_email) <> lower(shop_email) then
    shop_body := shop_body
      || E'\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      || E'\n📩 RÉCAP À TRANSMETTRE AU CLIENT'
      || E'\nEmail client : ' || customer_email
      || E'\n(Tant que le domaine Resend n''est pas vérifié, transférez ce récap au client.)'
      || E'\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━'
      || E'\n' || body;
  end if;

  if can_send_to_customer then
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
      'subject', case
        when customer_email is not null and sandbox_mode and lower(customer_email) <> lower(shop_email)
          then 'Nouvelle commande ' || order_number || ' — client ' || customer_email
        else 'Nouvelle commande ' || order_number
      end,
      'text', shop_body
    )
  );
  shop_notified := true;

  return jsonb_build_object(
    'ok', true,
    'emailSent', email_sent,
    'shopNotified', shop_notified,
    'customerRecapInShopEmail', customer_email is not null and sandbox_mode and lower(customer_email) <> lower(shop_email),
    'reason', case when sandbox_mode then 'resend_sandbox' else 'production' end
  );
end;
$$;

grant execute on function public.send_order_confirmation_email(jsonb, text) to anon, authenticated;
