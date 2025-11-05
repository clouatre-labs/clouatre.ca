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

## License

Code/structure: MIT License  
Content: © 2025 Hugues Clouâtre
