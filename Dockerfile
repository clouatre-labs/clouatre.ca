# Base stage for building the static files
FROM node:lts@sha256:0ab63cafa05b4c1db52959b40b7ea1f52753fe65f27a1b84f3991c296b1c16e6 AS base
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
