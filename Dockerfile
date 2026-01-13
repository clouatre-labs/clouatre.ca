# Base stage for building the static files
FROM node:lts@sha256:50113f9d3a239ce9e523550e46363d3a8ca7b58f6af70fd9ecb4698b2ad89ccb AS base
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Runtime stage for serving the application
FROM nginx:mainline-alpine-slim@sha256:fc0cff8d49db19250104d2fba8bd1ee3fc2a09ed8163de582804e5d137df7821 AS runtime
COPY --from=base /app/dist /usr/share/nginx/html
EXPOSE 80
