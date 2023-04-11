FROM node:18-alpine AS base

# Create builder
FROM base AS builder

WORKDIR /app

COPY . .

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile

RUN pnpm run build

# Take only files needed from builder
FROM base AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml

RUN npm install -g pnpm

RUN pnpm install --frozen-lockfile --prod

EXPOSE 8080

ENV PORT 8080

CMD ["node", "dist/app.js"]