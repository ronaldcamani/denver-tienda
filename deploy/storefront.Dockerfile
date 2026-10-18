# Tienda Next.js. Las variables NEXT_PUBLIC_* quedan fijas al construir, por eso
# llegan como argumentos de build desde deploy/.env.
FROM node:22-bookworm-slim

WORKDIR /app

COPY package.json package-lock.json ./
COPY apps/backend/package.json apps/backend/
COPY apps/storefront/package.json apps/storefront/
COPY apps/woocommerce/package.json apps/woocommerce/
RUN npm ci --no-audit --no-fund

# npm deja next en node_modules de la raiz, donde esta React 18 del panel de
# Medusa, y la tienda usa React 19. Moviendo next (y styled-jsx) junto a la
# tienda, resuelven el React correcto y el build no falla en /404.
RUN mv node_modules/next node_modules/styled-jsx apps/storefront/node_modules/ \
 && mkdir -p apps/storefront/node_modules/.bin \
 && ln -sf ../next/dist/bin/next apps/storefront/node_modules/.bin/next

COPY apps/storefront apps/storefront

ARG NEXT_PUBLIC_MEDUSA_BACKEND_URL
ARG NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_DEFAULT_REGION=pe
ENV NEXT_PUBLIC_MEDUSA_BACKEND_URL=$NEXT_PUBLIC_MEDUSA_BACKEND_URL \
    NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=$NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY \
    NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL \
    NEXT_PUBLIC_DEFAULT_REGION=$NEXT_PUBLIC_DEFAULT_REGION \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build -w @dtc/storefront

ENV NODE_ENV=production
EXPOSE 8000
CMD ["npm", "run", "start", "-w", "@dtc/storefront"]
