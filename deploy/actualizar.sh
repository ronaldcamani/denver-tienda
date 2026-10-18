#!/bin/sh
# Baja lo ultimo de main, reconstruye y reinicia los servicios, y comprueba que
# el backend responda. Lo usa el deploy automatico y se puede correr a mano.
set -e
cd "$(dirname "$0")"

git fetch -q origin main
git merge --ff-only origin/main

docker compose up -d --build --remove-orphans
docker image prune -f >/dev/null

echo "Esperando al backend..."
i=0
until docker compose exec -T backend node -e "fetch('http://localhost:9000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))" 2>/dev/null; do
  i=$((i + 1))
  if [ "$i" -gt 60 ]; then
    echo "El backend no respondio. Revisa: docker compose logs backend"
    exit 1
  fi
  sleep 5
done
docker compose ps
echo "Tienda actualizada."
