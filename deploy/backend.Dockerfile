# Backend Medusa (API, panel en /app y fotos en /static).
# Se construye desde la raiz del repositorio: ver deploy/docker-compose.yml.
FROM node:22-bookworm-slim

WORKDIR /app
ENV PATH=/app/node_modules/.bin:$PATH

# Primero solo los package.json, para reusar la instalacion si no cambian.
COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/
COPY apps/storefront/package.json apps/storefront/
COPY apps/woocommerce/package.json apps/woocommerce/
RUN npm ci --no-audit --no-fund

COPY apps/backend apps/backend
RUN npm run build -w @dtc/backend

# medusa build deja el servidor en .medusa/server; las dependencias se
# resuelven desde /app/node_modules.
WORKDIR /app/apps/backend/.medusa/server
ENV NODE_ENV=production
EXPOSE 9000

# Aplica migraciones (y la carga inicial la primera vez) y arranca.
CMD ["sh", "-c", "medusa db:migrate && medusa start"]
