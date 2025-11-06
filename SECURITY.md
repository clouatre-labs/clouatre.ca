# Security Policy

## Reporting a Vulnerability

Please report security vulnerabilities via GitHub's private vulnerability reporting:

**https://github.com/clouatre-labs/clouatre.ca/security/advisories/new**

Do not open public issues for security concerns.

## Security Measures

- Static site (no server-side code execution)
- HTTPS enforced via Cloudflare Pages
- Secret scanning via Gitleaks in CI/CD
- No tracking or analytics
- Protected files via `.gitignore`
