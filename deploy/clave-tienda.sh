#!/bin/sh
# Copia la clave publica de la tienda (publishable key) desde la base de datos a
# deploy/.env y activa la tienda. Se corre una vez, despues del primer arranque
# del backend.
set -e
cd "$(dirname "$0")"

CLAVE=$(docker compose exec -T postgres psql -U medusa -d denver_medusa -tAc \
  "select token from api_key where type = 'publishable' and revoked_at is null and deleted_at is null order by created_at limit 1")

if [ -z "$CLAVE" ]; then
  echo "Todavia no hay clave. Espera a que el backend termine de arrancar:"
  echo "  docker compose logs -f backend"
  exit 1
fi

sed -i '/^NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=/d;/^COMPOSE_PROFILES=/d' .env
printf 'NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=%s\nCOMPOSE_PROFILES=tienda\n' "$CLAVE" >> .env
echo "Clave guardada en deploy/.env. Ahora: docker compose up -d --build"
