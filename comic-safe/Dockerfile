# --- Base image with Puppeteer/Chromium dependencies (for both dev and prod) ---
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
    --no-install-recommends && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# --- Development stage (default) ---
FROM base AS dev
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install; \
    elif [ -f yarn.lock ]; then yarn install; \
    else npm install; fi
COPY . .
EXPOSE 3000
CMD ["npx", "nuxt", "dev"]

# --- Build stage ---
FROM base AS build
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm install; \
    elif [ -f yarn.lock ]; then yarn install; \
    else npm install; fi
COPY . .
RUN npm run build

# --- Production stage ---
FROM base AS prod
ENV NODE_ENV=production
WORKDIR /app
COPY --from=build /app/.output .output
COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]

HEALTHCHECK --interval=5s --timeout=3s --start-period=10s --retries=5 \
  CMD curl -f http://localhost:3000 || exit 1
