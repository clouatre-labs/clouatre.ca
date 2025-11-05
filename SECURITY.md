# Security Policy

## Supported Versions

We maintain security updates for the current version:

| Version | Supported          |
| ------- | ------------------ |
| Latest  | :white_check_mark: |

## Reporting a Vulnerability

We take the security of clouatre.ca seriously. If you discover a security vulnerability, please follow these steps:

### 1. **Do Not** Open a Public Issue

Please do not report security vulnerabilities through public GitHub issues.

### 2. Email Us Directly

Send details to: **hugues+website-security@linux.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### 3. Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 5 business days
- **Fix Timeline**: Depends on severity
  - Critical: Within 7 days
  - High: Within 14 days
  - Medium: Within 30 days
  - Low: Next regular update

### 4. Disclosure Policy

- We will acknowledge receipt of your vulnerability report
- We will provide regular updates on our progress
- We will notify you when the vulnerability is fixed
- We will publicly disclose the vulnerability after a fix is released
- We will credit you for the discovery (unless you prefer to remain anonymous)

## Security Best Practices

This website implements several security measures:

### Static Site Security
- Static site generation (no server-side code execution)
- HTTPS enforced via GitHub Pages
- No user authentication or data collection
- No analytics tracking (privacy-first)

### CI/CD Security
- **Gitleaks**: Automated secret scanning in every commit
- **Dependabot**: Automatic dependency updates
- **Branch protection**: Coming soon (rulesets)
- **Code review**: All changes reviewed before deployment

### Content Security
- No confidential information in repository
- Resume PDF reviewed for sensitive data
- `.gitignore` prevents AI agent configs and internal files
- Comprehensive protection for:
  - AI coding agents (`.amazonq/`, `.cursor/`, `.claude/`, etc.)
  - IDE settings
  - Confidential files (`*.confidential`, `*_INTERNAL*`)

### Dependencies
- Regular dependency updates via Dependabot
- Minimal attack surface (static site)
- Security scanning in GitHub Actions

## Scope

### In Scope
- Source code vulnerabilities
- Dependency vulnerabilities
- Secrets accidentally committed
- Information disclosure
- GitHub Actions workflow security

### Out of Scope
- GitHub Pages infrastructure (managed by GitHub)
- DNS/domain configuration (future)
- Client-side browser vulnerabilities
- Third-party theme code (Astro Paper)

## Security Updates

Security updates will be:
- Applied immediately for critical issues
- Deployed via GitHub Actions automatically
- Announced in commit messages and GitHub releases

Subscribe to releases on GitHub to receive security notifications.

## Contact

For security concerns: **hugues+website-security@linux.com**  
For general questions: Open a GitHub issue or discussion
