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
- ✅ **Auto Dependencies** - Dependabot + automated lockfile updates
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

## Dependency Management

This project uses **Dependabot** for automated dependency updates with automatic lockfile synchronization.

### How It Works

**Every Monday at 9 AM ET:**
1. Dependabot scans for dependency updates
2. Creates grouped PRs (Astro, Tailwind, dev tools, etc.)
3. **GitHub Actions automatically updates `bun.lock`**
4. CI validates the changes
5. You just review and merge

**Fully automated workflow:**
- ✅ Dependabot updates `package.json`
- ✅ GitHub Actions updates `bun.lock` automatically
- ✅ CI validates everything
- ✅ You just click "Merge"

### Handling Dependabot PRs

**Standard workflow (100% automated):**
```bash
# Just merge the PR - lockfile is auto-updated
gh pr merge <number> --squash
```

**View all Dependabot PRs:**
```bash
gh pr list --label dependencies
```

### Technical Details

**Lockfile automation:**
- Workflow: `.github/workflows/dependabot-auto-update-lockfile.yml`
- Triggers when Dependabot updates `package.json`
- Runs `bun install --no-save` to update `bun.lock`
- Commits lockfile with `github-actions[bot]`
- CI then validates the complete change

**Why This Works:**
- Dependabot doesn't support `bun.lock` natively (yet)
- GitHub Actions bot fills this gap automatically
- Zero manual intervention required
- Best of both worlds: Dependabot simplicity + Bun speed

### Why Not Renovate?

Renovate supports `bun.lock` natively but:
- ❌ Complex configuration (100+ lines JSON vs 70 lines YAML)
- ❌ Third-party app (not GitHub-native)
- ❌ Steeper learning curve
- ❌ More maintenance overhead

Our approach:
- ✅ Simple Dependabot config
- ✅ Small GitHub Actions workflow
- ✅ GitHub-native solution
- ✅ Fully automated (no manual steps)

## License

Code/structure: MIT License  
Content: © 2025 Hugues Clouâtre
