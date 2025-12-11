# Base stage for building the static files
FROM node:lts@sha256:aa648b387728c25f81ff811799bbf8de39df66d7e2d9b3ab55cc6300cb9175d9 AS base
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# Runtime stage for serving the application
FROM nginx:mainline-alpine-slim@sha256:a5459dbb9ed17c9f1eff5448a5dfb22ea3eb386a356e26fc16871dc426ac5383 AS runtime
COPY --from=base /app/dist /usr/share/nginx/html
EXPOSE 80
