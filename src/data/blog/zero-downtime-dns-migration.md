---
title: "Migrating to Cloudflare Pages: One Prompt, Zero Manual Work"
pubDatetime: 2025-11-06T02:00:00Z
description: "How we migrated hosting, DNS, and CI/CD from AWS Route53 + GitHub Pages to Cloudflare—starting with a single prompt to an AI assistant. Preview deployments, automated validation, zero downtime. The only manual step: creating an API token."
tags: ["devops", "ai", "cloudflare", "cicd", "automation", "aws", "goose", "route53"]
featured: true
---

We migrated complete website infrastructure—hosting, DNS, CI/CD—from AWS Route53 + GitHub Pages to Cloudflare **in 2 hours, during business hours**. Zero downtime. Zero manual commands.

**The entire migration:** Started with one prompt, then reviewed and approved AI-proposed changes.

**Why this matters for executives:** DNS migrations traditionally require specialized DevOps knowledge, extended maintenance windows, and carry significant risk. A single misconfigured record can break email, take down services, or disrupt business operations for hours. This approach eliminates that risk through programmatic validation and automation.

The only manual step: Creating a Cloudflare API token.

## Table of contents

## The Starting Point

**Infrastructure:**
- Hosting: GitHub Pages
- DNS: AWS Route53 (20+ DNS records)
- Domain: Squarespace (registrar)
- CI/CD: GitHub Actions → GitHub Pages

**Critical services:**
- Email (5 MX records for Google Workspace)
- Google Workspace services (Calendar, Contacts, Sites)
- SSL validation records
- Legacy service records (needed cleanup)

## The Goal

Migrate everything to Cloudflare:
- Faster DNS globally
- Faster deployments
- Simplified infrastructure (one platform)
- Preview deployments for PRs
- Zero downtime (email cannot break)

## The Prompt

**What we told Goose ([open-source AI assistant](https://github.com/block/goose)):**

```
I want to migrate from GitHub Pages to Cloudflare Pages. The domain 
clouatre.ca is registered at Squarespace. I need zero downtime - email 
and Google Workspace cannot break. Use a risk-adverse approach.
```

**That's it.** We didn't need to specify:
- Where DNS was hosted (Goose discovered Route53)
- How many DNS records existed (Goose found 20+)
- Which records were critical vs obsolete
- How to configure Cloudflare Pages
- How to set up GitHub Actions for Cloudflare

**Goose handled the discovery and analysis.**

**What made this possible:**
- Goose detects the environment (WSL, Linux, macOS) and installs needed tools (AWS CLI, dig, git, gh)
- Goose discovers infrastructure state through exploration
- Goose validates before executing (tested DNS against Cloudflare nameservers)
- Goose creates audit trails (PRs with context, commit history)

**Critical:** We reviewed every decision. The AI proposed, we approved. The combination of automation + human judgment enabled confidence.

## What Goose Automated

### 1. DNS Discovery & Cleanup

Goose analyzed all Route53 records, kept 15 critical ones (MX, SPF, DKIM, DMARC, Google Workspace CNAMEs), deleted 5 obsolete ones (old Redmine servers, temporary SSL validation records).

### 2. DNS Migration with Pre-Validation

Exported Route53 records (AWS CLI), imported to Cloudflare (API), validated BEFORE switching nameservers:

```bash
dig @oaklyn.ns.cloudflare.com clouatre.ca MX +short
# Verified: All 5 Google Mail servers ✓
```

Every record validated before switching.

### 3. GitHub Actions CI/CD Setup

Created `.github/workflows/deploy.yml` for 38-second deployments (vs 5-8 minutes on GitHub Pages).

### 4. Fixed Base URL Issues

GitHub Pages served content at `/repo-name/`, Cloudflare at root. Goose identified this, removed the `base` configuration, and fixed all component paths—navigation, theme toggle, asset references. We reviewed the PR and approved.

### 5. Created PRs with Context

Pull requests included change descriptions, migration rationale, rollback procedures, and testing verification.

### 6. Preview Deployments

The best part: Every PR branch gets a preview URL **before** merging to production. We review changes BEFORE they go live, and production deploys only after approval. Goose even configured automatic cleanup (7-day TTL for old previews)—zero maintenance required.

## The Only Manual Step

Creating a Cloudflare API token (2 minutes):
1. Cloudflare dashboard → API Tokens
2. Create token with Pages permissions
3. Store in GitHub secrets

That's it. Everything else: automated.

## Results

| Metric | Before | After |
|--------|--------|-------|
| DNS Resolution | 20-30ms (Route53) | 10-15ms (Cloudflare) | 
| Deploy Time | 5-8 min | 38 sec |
| DNS Cost | $12/year | $0 |
| Preview Deployments | No | Yes (per PR) |

**Complete migration (DNS + Hosting + CI/CD) completed in ~2 hours. Zero downtime, zero manual commands.**

## Business Impact

**What this approach enables:**

- **Reduce specialized knowledge dependency** - DevOps tasks no longer require memorizing cloud provider CLIs, DNS record formats, or deployment configurations
- **Lower operational risk** - Programmatic validation means migrations happen with confidence, not guesswork
- **Faster iteration** - Preview deployments enable stakeholder review before production release
- **Cost efficiency** - Eliminated $12/year DNS hosting, reduced deployment time by 88% (5-8min → 38sec)

**Who benefits:**
- Small businesses without dedicated DevOps teams
- Technical leaders managing infrastructure migrations
- Teams wanting to reduce deployment anxiety and increase velocity

## Key Lessons

### 1. Goose Handles Implementation Details

You still need to understand what you're migrating, but you don't need to remember:
- Exact API syntax
- AWS CLI flags for Route53 operations
- Cloudflare API endpoints
- DNS record format specifics
- YAML workflow syntax

Goose discovered our infrastructure (Route53), analyzed the records, and executed the migration. We provided the goals and constraints, reviewed the approach, and approved changes.

**Value:** Reduces specialized knowledge requirement, eliminates manual typos, compresses migration timeline from days (planning + execution + validation) to hours (review + approval).

### 2. Pre-Validation Eliminates Risk

Goose validated all DNS records against Cloudflare's nameservers before switching:

```bash
dig @oaklyn.ns.cloudflare.com clouatre.ca MX +short
dig @oaklyn.ns.cloudflare.com clouatre.ca TXT +short
dig @oaklyn.ns.cloudflare.com agenda.clouatre.ca CNAME +short
# ... validated all 15 critical records
```

Generated a validation report confirming every record matched. We knew email, Google Workspace, and website would work before changing nameservers. Zero guessing.

### 3. Automate Record Migration

20+ DNS records, each with specific formats, priorities, TTLs. Manual copying = guaranteed typos.

Goose used APIs:
- Export from Route53 (AWS CLI)
- Import to Cloudflare (API)
- Programmatic comparison (verified all matched)

Zero typos.

### 4. Preview Deployments Change Everything

The ability to review changes before production:
- Reduces deployment anxiety
- Catches issues early
- Enables stakeholder review
- Faster iteration

### 5. One Manual Step Is Acceptable

Creating an API token requires human authentication (good security practice). Everything else should be automated.

**Before:** Hours of manual DNS record copying and testing.  
**After:** Create token, give prompt, review changes.

## When This Approach Applies

**Ideal for:**
- Infrastructure migrations (DNS, hosting, CI/CD platforms)
- Teams without specialized DevOps resources
- Projects requiring zero-downtime migrations
- Organizations wanting audit trails and validation

**Requirements:**
- AI assistant with CLI/API access ([Goose](https://github.com/block/goose), similar tools)
- API access to source and target platforms
- Clear migration constraints (zero downtime, specific services to preserve)
- Human review and approval process

**Trade-offs:**
- Requires reviewing AI decisions (governance, not blind automation)
- Complex migrations may need human judgment on priorities
- Initial setup time for AI assistant and API tokens

**Not suitable for:**
- Migrations requiring instant execution (no time for review)
- Environments where API access is prohibited
- Situations where humans lack domain knowledge to evaluate AI proposals

## Cost Reality

**Cloudflare Pages free tier:**
- 500 builds/month
- 1 concurrent build
- Unlimited bandwidth and requests
- Unlimited preview deployments

**Perfect for:** Personal sites, small businesses, most projects.  
**Paid plans needed for:** High-traffic sites (millions of requests), teams needing multiple concurrent builds.

**GitHub Pages:** Remains free regardless of traffic (but slower globally, no preview deployments).

## The Paradigm Shift

**Traditional DNS migration:**
- Weekend deployment windows
- Manual command execution (one typo = disaster)
- Sequential testing after switching (discover missed records in production)
- Specialized knowledge required (dig syntax, DNS record formats, cloud provider CLIs)

**AI-assisted migration:**
- Business hours execution (confidence through validation)
- Programmatic execution (zero typos)
- Pre-validated testing (know it works before switching)
- Domain expertise offloaded (AI handles implementation details)

**The real transformation:** From "plan and execute carefully" to "validate and execute confidently." We knew every record worked before switching nameservers. No anxiety. No contingency planning for email outages. Just confidence.

**The proof:** This blog post was reviewed at a preview URL (`feat-update-blog-post-final.clouatre-ca.pages.dev`) before going live—using the same automation we're describing. The system documents itself.

---

**Want to try this approach?**
- [Goose AI assistant](https://github.com/block/goose) (open source)
- [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)
- Our workflow: [GitHub repository](https://github.com/clouatre-labs/clouatre.ca)

*(We'll cover Goose setup in a future post.)*
