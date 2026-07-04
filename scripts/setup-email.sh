#!/bin/bash
# Déploie la fonction email sur Supabase (à lancer une fois Resend + Supabase login OK)
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ ! -f .env.local ]]; then
  echo "❌ Fichier .env.local introuvable."
  exit 1
fi

# shellcheck disable=SC1091
source .env.local

if [[ -z "${RESEND_API_KEY:-}" ]]; then
  echo "❌ Ajoute RESEND_API_KEY=re_... dans .env.local"
  exit 1
fi

SHOP_EMAIL="${SHOP_EMAIL:-pendathiaw1995@gmail.com}"
FROM_EMAIL="${FROM_EMAIL:-Tallow & Go <onboarding@resend.dev>}"

echo "→ Connexion projet Supabase…"
npx supabase link --project-ref fykptfuqtvctixklmypt

echo "→ Secrets…"
npx supabase secrets set "RESEND_API_KEY=${RESEND_API_KEY}"
npx supabase secrets set "SHOP_EMAIL=${SHOP_EMAIL}"
npx supabase secrets set "FROM_EMAIL=${FROM_EMAIL}"

echo "→ Déploiement send-order-confirmation…"
npx supabase functions deploy send-order-confirmation --no-verify-jwt

echo "✅ Emails configurés. Teste une commande sur le site."
