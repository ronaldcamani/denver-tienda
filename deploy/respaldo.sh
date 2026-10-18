#!/bin/sh
# Respaldo diario de la base de datos y de las fotos en deploy/respaldos/.
# Guarda los ultimos 14 dias. Se programa con cron (ver deploy/README.md).
set -e
cd "$(dirname "$0")"
mkdir -p respaldos
FECHA=$(date +%Y-%m-%d_%H%M)

docker compose exec -T postgres pg_dump -U medusa -d denver_medusa -Fc \
  > "respaldos/base-$FECHA.dump"
docker compose exec -T backend tar -czf - -C /app/apps/backend/.medusa/server static \
  > "respaldos/fotos-$FECHA.tar.gz"

find respaldos -type f -mtime +14 -delete
echo "Respaldo listo: respaldos/base-$FECHA.dump y respaldos/fotos-$FECHA.tar.gz"
