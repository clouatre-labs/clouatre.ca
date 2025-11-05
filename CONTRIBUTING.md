# Contributing to clouatre.ca

Thank you for your interest in contributing! This is a personal website and blog, but contributions are welcome for:

## 🎯 What You Can Contribute

### Accepted Contributions
- ✅ Bug fixes (typos, broken links, rendering issues)
- ✅ Accessibility improvements
- ✅ Performance optimizations
- ✅ Documentation improvements
- ✅ Security fixes

### Not Accepted
- ❌ Content changes (blog posts, about page)
- ❌ Major design changes
- ❌ New features without prior discussion

## 🚀 Quick Start

### Prerequisites
- **Node.js**: 20+
- **pnpm**: 9+
- **Git**

### Development Setup

```bash
# Clone the repository
git clone https://github.com/clouatre-labs/clouatre.ca.git
cd clouatre.ca

# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Open http://localhost:4321/clouatre.ca/
```

### Build & Preview

```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📋 Development Workflow

### 1. Fork & Branch

```bash
# Fork the repo on GitHub, then:
git clone https://github.com/YOUR_USERNAME/clouatre.ca.git
cd clouatre.ca

# Create a feature branch
git checkout -b fix/broken-link-about-page
```

### 2. Make Changes

- Follow existing code style (Prettier configured)
- Test locally with `pnpm dev`
- Build to verify: `pnpm build`

### 3. Commit

Use [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Examples:
git commit -m "fix: correct LinkedIn URL in social links"
git commit -m "docs: update README with deployment instructions"
git commit -m "perf: optimize profile image size"
git commit -m "a11y: improve keyboard navigation in header"
```

**Types:**
- `fix:` Bug fixes
- `feat:` New features (rare for this site)
- `docs:` Documentation changes
- `style:` Code style (formatting, no code change)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Test changes
- `chore:` Maintenance tasks
- `a11y:` Accessibility improvements

### 4. Submit Pull Request

```bash
# Push your branch
git push origin fix/broken-link-about-page

# Open PR on GitHub
gh pr create --title "fix: correct LinkedIn URL" --body "Fixes #123"
```

## 🧪 Testing

### Manual Testing Checklist

Before submitting a PR, verify:

- [ ] Site builds successfully (`pnpm build`)
- [ ] No console errors in dev mode
- [ ] Light/dark mode works
- [ ] Responsive on mobile (Chrome DevTools)
- [ ] Links work correctly
- [ ] Images load properly
- [ ] No accessibility regressions

### Automated Checks

GitHub Actions will run:
- ✅ Gitleaks (secret scanning)
- ✅ Build verification
- ✅ Deployment to GitHub Pages

## 📝 Code Style

This project uses:
- **Prettier**: Auto-formatting (configured)
- **ESLint**: Linting (configured)
- **TypeScript**: Type checking

Run before committing:

```bash
# Format code
pnpm format

# Check linting
pnpm lint

# Type check
pnpm astro check
```

## 🔒 Security

### DO NOT Commit:
- Secrets or API keys
- Personal/confidential information
- Large binary files
- AI agent configs (`.amazonq/`, `.cursor/`, etc.)

### Gitleaks
All commits are scanned for secrets. If detected, the PR will be blocked.

## 🐛 Reporting Issues

### Bug Reports

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md) and include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Browser/device info

### Feature Requests

**Note:** This is a personal site, so feature requests may not be accepted.

For suggestions, open a [Discussion](https://github.com/clouatre-labs/clouatre.ca/discussions) first.

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License (code/structure).

**Note:** Blog content and personal information remain proprietary to Hugues Clouatre.

## 🙏 Recognition

Contributors will be:
- Listed in release notes
- Mentioned in commit messages
- Added to GitHub contributors list

## 📞 Contact

- **GitHub Issues**: For bugs and improvements
- **Email**: hugues@linux.com (for sensitive matters)
- **Discussions**: For questions and ideas

---

Thank you for contributing to make this site better!
