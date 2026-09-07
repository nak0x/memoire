# syntax=docker/dockerfile:1

# --- Construction ----------------------------------------------------------
FROM node:24-alpine AS build
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build

# --- Exécution -------------------------------------------------------------
# Nitro produit un bundle autonome : aucun node_modules n'est embarqué, et
# SQLite vient du module natif node:sqlite. L'image finale tient sous 200 Mo.
FROM node:24-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    NITRO_HOST=0.0.0.0 \
    NITRO_PORT=3000 \
    DB_PATH=/app/data/questionnaire.db \
    RETENTION_MONTHS=6

RUN mkdir -p /app/data && chown -R node:node /app
COPY --from=build --chown=node:node /app/.output ./.output

USER node
EXPOSE 3000
VOLUME ["/app/data"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:'+(process.env.NITRO_PORT||3000)+'/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["node", ".output/server/index.mjs"]
