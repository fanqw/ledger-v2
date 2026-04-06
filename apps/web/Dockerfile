FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-workspace.yaml ./
COPY packages ./packages
COPY apps/web/package.json ./apps/web/package.json
RUN pnpm install --filter web... --no-frozen-lockfile

FROM deps AS build
COPY . .
RUN pnpm --filter web build

FROM base AS runner
ENV NODE_ENV=production
COPY --from=build /app .
EXPOSE 3000
CMD ["pnpm", "--filter", "web", "start"]
