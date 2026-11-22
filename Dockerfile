# syntax=docker/dockerfile:1
# Stages: deps → source → test (CI checks) / build → runtime (the image that runs).
# BuildKit reuses each layer until its inputs change: `npm ci` reruns only when package*.json changes,
# and the npm download cache and the Next.js build cache survive even then.
# Build-time settings (ALLOW_INDEXING, SITE_URL, NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_LOGIN_ENABLED,
# NEXT_PUBLIC_AUTH_PORTAL_URL) come from a .env.production file
# placed in the build context; the deploy writes it from the environment's .env on the server.

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS source
ENV NEXT_TELEMETRY_DISABLED=1
COPY . .

FROM source AS test
RUN npm run typecheck && npm run pricing:check

FROM source AS build
ENV NEXT_OUTPUT=standalone
RUN --mount=type=cache,target=/app/.next/cache npm run build

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 CMD wget -q -O /dev/null http://127.0.0.1:3000/ || exit 1
CMD ["node", "server.js"]
