# --- Base stage: system dependencies, lockfiles, working dir ---
FROM node:20 AS base
RUN apt-get update && apt-get install -y \
    libnss3 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libgbm1 \
    libgtk-3-0 \
    libasound2 \
    chromium \
    chromium-driver \
    --no-install-recommends && rm -rf /var/lib/apt/lists/*
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
WORKDIR /app
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# --- Dev stage: all deps, full source, dev server ---
FROM base AS dev
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install; \
    elif [ -f yarn.lock ]; then yarn install; \
    else npm install; fi
COPY . .
EXPOSE 3000
CMD ["npx", "nuxt", "dev"]

# --- Build stage: extends dev, builds app, prunes dev deps ---
FROM dev AS build
RUN npm run build \
 && if [ -f package-lock.json ]; then npm prune --omit=dev; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm prune --prod; \
    elif [ -f yarn.lock ]; then yarn install --production --ignore-scripts; \
    else npm prune --omit=dev; fi

# --- Prod stage: extends base, only copies built output and prod deps ---
FROM base AS prod
COPY --from=build /app/.output .output
COPY --from=build /app/package.json ./
COPY --from=build /app/package-lock.json* ./
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]

HEALTHCHECK --interval=5s --timeout=3s --start-period=10s --retries=5 \
  CMD curl -f http://localhost:3000 || exit 1
