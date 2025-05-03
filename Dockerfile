ARG APP_NAME

# STAGE 1: Install dependencies
FROM node:22-alpine AS base

WORKDIR /app

FROM base AS deps

# Copy root files
COPY package.json yarn.lock ./
RUN yarn

# STAGE 2: Build app
FROM base AS builder

ARG APP_NAME

COPY . .

# Reuse installed deps
COPY --from=deps /app/node_modules ./node_modules

# Build the whole monorepo (tsconfig paths resolve shared libs)
RUN yarn build:$APP_NAME

# STAGE 3: Run the app
FROM base AS runner

ARG APP_NAME

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/$APP_NAME ./dist

CMD ["node", "dist/main.js"]
