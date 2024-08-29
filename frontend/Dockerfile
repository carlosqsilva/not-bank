FROM node:22.7.0-alpine AS base
RUN apk update && apk add ca-certificates
RUN corepack enable

FROM base AS builder
WORKDIR /app
RUN pnpm add -g turbo@2
COPY . .
RUN turbo prune frontend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM base AS installer
WORKDIR /app

COPY --from=builder /app/out/json/ .
RUN pnpm install

COPY --from=builder /app/out/full/ .
RUN pnpm run build

FROM caddy:2.8.4-alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 app
USER app
COPY --from=installer /app .

CMD node apps/api/dist/index.js