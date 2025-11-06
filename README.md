# Hugues Clouâtre - Personal Website

[![CI](https://github.com/clouatre-labs/clouatre.ca/actions/workflows/ci.yml/badge.svg)](https://github.com/clouatre-labs/clouatre.ca/actions/workflows/ci.yml)
[![Deploy](https://github.com/clouatre-labs/clouatre.ca/actions/workflows/deploy.yml/badge.svg)](https://github.com/clouatre-labs/clouatre.ca/actions/workflows/deploy.yml)
[![License](https://img.shields.io/github/license/clouatre-labs/clouatre.ca.svg)](./LICENSE)
[![Bun](https://img.shields.io/badge/bun-%23000000.svg?style=flat&logo=bun&logoColor=white)](https://bun.sh)
[![Astro](https://img.shields.io/badge/astro-%232C2052.svg?style=flat&logo=astro&logoColor=white)](https://astro.build)
[![Protected by Gitleaks](https://img.shields.io/badge/protected%20by-gitleaks-blue)](https://github.com/gitleaks/gitleaks)

Personal website and blog at [clouatre-labs.github.io/clouatre.ca](https://clouatre-labs.github.io/clouatre.ca/)

Technology leadership, AI workflows, and cloud architecture insights.

## Tech Stack

- **Astro** with Astro Paper theme
- **Bun** - Fast JavaScript runtime and package manager
- **Biome** - Fast linter and formatter
- **GitHub Pages** deployment
- **Tailwind CSS** styling
- **Gitleaks** - Secret scanning (organization license)

## Development

```bash
# Install dependencies
bun install

# Start dev server
bun dev      # http://localhost:4321/clouatre.ca/

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
