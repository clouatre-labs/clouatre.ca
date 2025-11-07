---
title: "Migrating to Cloudflare Pages: One Prompt, Zero Manual Work"
pubDatetime: 2025-11-06T02:00:00Z
description: "Complete infrastructure migration in 2 hours with zero downtime. AI-assisted DNS, hosting, and CI/CD migration with pre-validated testing. Real metrics."
tags: ["devops", "ai", "cloudflare", "cicd", "automation", "goose", "dns", "migration"]
featured: true
---

We migrated complete website infrastructure from Amazon Route53 + GitHub Pages to Cloudflare **in 2 hours, during business hours**. This included hosting, DNS, and CI/CD. Zero downtime. Zero manual commands.

**The entire migration:** Started with one prompt, then reviewed and approved AI-proposed changes.

**Why this matters for executives:** DNS migrations traditionally require specialized DevOps knowledge, extended maintenance windows, and carry significant risk. A single misconfigured record can break email, take down services, or disrupt business operations for hours. This approach eliminates that risk through programmatic validation and automation.

The only manual step: Creating a Cloudflare API token.

## Table of contents

## The Starting Point

**Infrastructure:**
- **Code repository:** GitHub (unchanged after migration)
- **Hosting:** GitHub Pages
- **DNS:** Amazon Route53 (20+ DNS records)
- **Domain:** Squarespace (registrar)
- **CI/CD:** GitHub Actions → GitHub Pages

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

## Why This Matters for Your Business

**The traditional challenge:**

DNS migrations CAN be done with zero downtime, but they require extensive planning and careful execution. One misconfigured MX record means email down for hours—imagine missing customer orders, support tickets, or sales inquiries during your peak season.

**The difference with AI assistance:**

Same zero-downtime outcome, but with programmatic validation instead of manual checklists. Business hours execution becomes feasible because pre-validation eliminates guesswork. Teams without specialized DevOps expertise can execute complex migrations confidently.

**Strategic value:**

Infrastructure changes shift from high-stress, weekend events requiring senior engineers to low-risk, automated processes that junior engineers can review and approve. Preview deployments enable stakeholder review before release.

**The transformation:** From possible-but-stressful to routine-and-confident.

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

![Migration workflow diagram showing approval gates and validation steps](/assets/migration-workflow.png)
*Figure 1: AI-assisted migration workflow with two human approval gates ensuring governance and confidence*

## What Goose Automated

### 1. DNS Discovery & Cleanup

Goose analyzed all Route53 records, kept 15 critical ones (MX, SPF, DKIM, DMARC, Google Workspace CNAMEs), deleted 5 obsolete ones (old Redmine servers, temporary SSL validation records).

### 2. DNS Migration with Pre-Validation

**The validation approach:**

1. Export all Route53 records using AWS CLI
2. Import to Cloudflare via API
3. Test against Cloudflare nameservers BEFORE switching
4. Verify all 5 email servers respond correctly

**Result:** Zero risk. We confirmed email would work before changing anything in production.

Every record validated before switching.

### 3. GitHub Actions CI/CD Setup

**What changed:** Deployment target only. Code still lives in GitHub repository.

**Before:** GitHub Actions → GitHub Pages  
**After:** GitHub Actions → Cloudflare Pages

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

![Infrastructure comparison showing before and after architecture](/assets/infrastructure-comparison.png)
*Figure 2: Infrastructure transformation - from fragmented AWS/GitHub setup to unified Cloudflare platform*

## Results

| Metric | Before | After | Business Impact |
|--------|--------|-------|-----------------|
| DNS Resolution | 20-30ms | 10-15ms | 50% faster global access |
| Deploy Time | 5-8 min | 38 sec | **88% reduction** - 10x faster iteration |
| DNS Cost | $12/year | Free | $12/year savings |
| Preview Deployments | None | Per PR | Catch issues before production |
| Migration Time | Days (typical) | 2 hours | **67% time savings** vs traditional |

**Complete migration (DNS + Hosting + CI/CD) completed in 2 hours. Zero downtime, zero manual commands.**

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

**How validation worked:**

Goose tested all DNS records against Cloudflare's nameservers before we switched. This included email servers, Google Workspace records, and SSL validation.

**The process:**

1. Query Cloudflare nameservers for each record type
2. Verify MX records (all 5 email servers)
3. Verify TXT records (SPF, DKIM, DMARC)
4. Verify CNAME records (Google Workspace services)
5. Generate validation report

**Business outcome:** We knew email, Google Workspace, and website would work before changing nameservers. Zero guessing.

### 3. Automate Record Migration

20+ DNS records, each with specific formats, priorities, TTLs. Manual copying guarantees typos.

**Goose used APIs for accuracy:**

- Export from Route53 (AWS CLI)
- Import to Cloudflare (API)
- Programmatic comparison (verified all matched)

**Result:** Zero typos. Zero manual record editing.

### 4. Preview Deployments Change Everything

The ability to review changes before production delivers multiple benefits.

**Impact areas:**

- Reduces deployment anxiety
- Catches issues early
- Enables stakeholder review
- Faster iteration

**For technical leaders:** Preview deployments shift risk from production to staging, enabling confident releases.

### 5. The Paradigm Shift: From Careful Planning to Confident Execution

**Traditional DNS migration approach:**

- Weekend deployment windows (lower risk window, but stressful)
- Manual command execution (careful, but one typo = disaster)
- Sequential testing after switching (discover errors in production)
- Specialized knowledge required (dig syntax, DNS formats, cloud CLIs)
- Extensive planning and checklists (mitigates risk but time-intensive)

**AI-assisted migration approach:**

- Business hours execution (confidence through pre-validation)
- Programmatic execution (eliminates manual typos)
- Pre-validated testing (know it works before switching)
- Domain expertise offloaded (AI handles implementation syntax)
- Less planning overhead (validation happens automatically)

**The transformation:** From "plan exhaustively and execute carefully" to "validate programmatically and execute confidently."

Traditional migrations CAN achieve zero downtime, but they require more planning and carry higher risk of manual errors. We knew every record worked before switching nameservers. No deployment anxiety. No extensive contingency planning. Just confidence through automation.

**The proof:** This blog post was reviewed at a preview URL before going live—using the same automation we're describing. The system documents itself.

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

---

**Want to try this approach?**
- [Goose AI assistant](https://github.com/block/goose) (open source)
- [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)
- Our workflow: [GitHub repository](https://github.com/clouatre-labs/clouatre.ca)
