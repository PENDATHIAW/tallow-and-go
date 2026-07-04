#!/bin/bash
# Génère le SQL prêt à coller dans Supabase (clé lue depuis .env.local)
set -euo pipefail
cd "$(dirname "$0")/.."
source .env.local
if [[ -z "${RESEND_API_KEY:-}" ]]; then
  echo "RESEND_API_KEY manquant dans .env.local" >&2
  exit 1
fi
sed "s/__RESEND_API_KEY__/${RESEND_API_KEY}/g" supabase/setup-resend-emails.sql
