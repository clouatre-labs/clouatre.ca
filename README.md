# Hugues Clouâtre - Personal Website

[![CI](https://github.com/clouatre-labs/clouatre.ca/actions/workflows/ci.yml/badge.svg)](https://github.com/clouatre-labs/clouatre.ca/actions/workflows/ci.yml)
[![Deploy](https://github.com/clouatre-labs/clouatre.ca/actions/workflows/deploy.yml/badge.svg)](https://github.com/clouatre-labs/clouatre.ca/actions/workflows/deploy.yml)
[![License](https://img.shields.io/github/license/clouatre-labs/clouatre.ca.svg)](./LICENSE)
[![Bun](https://img.shields.io/badge/bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![Astro](https://img.shields.io/badge/astro-%232C2052.svg?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![Protected by Gitleaks](https://img.shields.io/badge/protected%20by-gitleaks-blue)](https://github.com/gitleaks/gitleaks)

Personal website and technical blog at [clouatre.ca](https://clouatre.ca)

Technology leadership, AI-assisted development, and cloud architecture insights for executive audiences.

## Tech Stack

- **[Astro](https://astro.build)** - Static site generator with [Astro Paper](https://github.com/satnaing/astro-paper) theme
- **[Bun](https://bun.sh)** - Fast JavaScript runtime and package manager
- **[Biome](https://biomejs.dev)** - Fast linter and formatter (replaces ESLint + Prettier)
- **[Cloudflare Pages](https://pages.cloudflare.com)** - Edge deployment with global CDN
- **[Tailwind CSS](https://tailwindcss.com)** - Utility-first styling
- **[Gitleaks](https://github.com/gitleaks/gitleaks)** - Secret scanning (organization license)

## Features

- ✅ **Optimized Images** - Automatic WebP conversion (50% size reduction)
- ✅ **Preview Deployments** - Every PR gets a preview URL
- ✅ **Auto Dependencies** - Renovate with merge queue
- ✅ **Fast Deploys** - 38 seconds (was 5-8 minutes on GitHub Pages)
- ✅ **SEO Optimized** - Meta tags, sitemaps, responsive images
- ✅ **Type Safe** - TypeScript throughout

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun dev      # http://localhost:4321

# Run checks (lint + format)
bun run check

# Auto-fix issues
bun run check:fix

# Build for production
bun run build

# Full local validation
bun run test:local
```

## Pre-commit Hooks

Git hooks are automatically installed via `simple-git-hooks`:

- **Pre-commit**: Auto-format staged files with Biome
- **Pre-push**: Run full validation (check + build)

## License

Code/structure: MIT License  
Content: © 2025 Hugues Clouâtre
