---
title: "Migrating to Cloudflare Pages: One Prompt, Zero Manual Work"
pubDatetime: 2025-11-06T12:00:00Z
modDatetime: 2026-01-21T19:27:00Z
description: "Migrate to Cloudflare Pages with zero downtime. AI-assisted DNS, hosting, and CI/CD migration with pre-validated testing. Real metrics."
tags:
  - automation
  - cloudflare
  - devops
  - goose
  - migration
featured: true
---

We migrated website infrastructure from Amazon Route53 + GitHub Pages to Cloudflare **in 2 hours, during business hours**. This included hosting, DNS, and CI/CD. Zero downtime. Zero manual commands.

**The entire migration:** One prompt. Then review and approve AI-proposed changes.

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

DNS migrations CAN be done with zero downtime, but they require extensive planning and careful execution. One misconfigured MX record means email down for hours. Imagine missing customer orders, support tickets, or sales inquiries during your peak season.

**The difference with AI assistance:**

Same zero-downtime outcome, but with programmatic validation instead of manual checklists. Business hours execution becomes feasible because pre-validation eliminates guesswork. Teams without specialized DevOps expertise can execute complex migrations confidently.

**Strategic value:**

Infrastructure changes shift from high-stress, weekend events to business-hours execution with automated validation—still requiring experienced engineers to evaluate proposals, but with dramatically reduced risk and time investment. Preview deployments enable stakeholder review before release.

**The transformation:** From possible-but-stressful to routine-and-confident.

## The Starting Prompt

**What we told Goose ([open-source AI assistant](https://github.com/block/goose)):**

```text file="Initial_Prompt"
I want to migrate from GitHub Pages to Cloudflare Pages.
The domain clouatre.ca is registered at Squarespace.
I need zero downtime - email and Google Workspace cannot break.
Use a risk-adverse approach.
```

*This prompt started a [5-phase recipe workflow](/posts/ai-assisted-development-judgment-over-implementation/#the-recipe-model-codifying-judgment) with mandatory approval gates: I reviewed and approved each phase (Analyze → Research → Plan → Implement → Prepare). Not autonomous execution, AI-assisted with human governance at every decision point.*

We didn't need to specify:
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

![Cloudflare migration workflow diagram showing approval gates and validation steps](@/assets/images/migration-workflow.png)
*Figure 1: AI-assisted migration workflow with two human approval gates ensuring governance and confidence*

## What Got Automated

Goose handled five critical phases:

**Discovery & Cleanup**
- Analyzed 20+ Route53 records
- Identified 15 critical (email, Google Workspace, SSL)
- Flagged 5 obsolete (old servers, expired validations)

**Pre-Migration Validation**
- Exported Route53 → imported to Cloudflare via APIs
- Tested all records against Cloudflare nameservers BEFORE switching
- Verified email servers, SPF, DKIM, DMARC, CNAMEs
- Generated validation report: 100% match confirmed

**CI/CD Reconfiguration**
- Updated GitHub Actions deployment target (GitHub Pages → Cloudflare)
- Fixed base URL issues (GitHub's `/repo/` → root `/`)
- Created preview deployment workflow with 7-day auto-cleanup
- Result: 38-second deploys (was 5-8 minutes)

**Governance Trail**
- Created PRs with migration context, rationale, rollback procedures
- Every change reviewable before production
- Audit trail for compliance

**Preview Infrastructure**
- Every branch gets preview URL automatically
- Stakeholder review before merge
- Zero maintenance (auto-cleanup configured)

## The Only Manual Step

Creating a Cloudflare API token (2 minutes):
1. Cloudflare dashboard → API Tokens
2. Create token with Pages permissions
3. Store in GitHub secrets

Everything else: automated.

![Cloudflare infrastructure comparison showing before and after architecture](@/assets/images/infrastructure-comparison.png)
*Figure 2: Infrastructure transformation - from fragmented AWS/GitHub setup to unified Cloudflare platform*

## Results

Traditional manual DNS migrations typically require 4-6 hours of focused work and weekend execution windows to minimize business risk: planning, exporting records, importing, testing, monitoring propagation.

| Metric | Before | After | Business Impact |
|--------|--------|-------|-----------------|
| DNS Resolution | 20-30ms | 10-15ms | 50% faster global access |
| Deploy Time | 5-8 min | 38 sec | **88% reduction** - 10x faster iteration |
| Platform Cost | Route53: $12/year | Cloudflare: Free | Cost-neutral migration |
| Preview Deployments | None | Per PR | Catch issues before production |
| Migration Window | Weekend (risk mitigation) | 2 hours, business hours | Eliminates deployment stress |

*Table 1: Before and after metrics - Complete migration (DNS + Hosting + CI/CD) completed in 2 hours, zero downtime, zero manual commands*

## What Business Impact Does AI-Assisted Migration Deliver?

**What this approach enables:**

- **Reduce specialized knowledge dependency** - DevOps tasks no longer require memorizing cloud provider CLIs, DNS record formats, or deployment configurations
- **Lower operational risk** - Programmatic validation means migrations happen with confidence, not guesswork
- **Faster iteration** - Preview deployments enable stakeholder review before production release
- **Cost efficiency** - Reduced deployment time by 88% (5-8min → 38sec), freeing developer time for feature work

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

**Value:** Reduces specialized knowledge requirement, eliminates manual typos, compresses migration timeline from 4-6 hours (planning + execution + validation) to 2 hours (review + approval).

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

Preview deployments:

- Reduces deployment anxiety
- Catches issues early
- Enables stakeholder review
- Faster iteration

**For technical leaders:** Preview deployments shift risk from production to staging, enabling confident releases.

### 5. The Paradigm Shift: From Careful Planning to Confident Execution

**Traditional DNS migration approach:**

- Weekend deployment windows (lower risk, higher stress)
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

We knew every record worked before switching. No deployment anxiety, no weekend stress, no contingency planning—just confidence through programmatic validation.

**The proof:** This blog post was reviewed at a preview URL before going live—using the same automation we're describing. The system documents itself.

## When Does This Approach Apply?

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

## What Is the ROI of AI-Assisted Infrastructure Migration?

**Time savings compound quickly:**

- **Deployment speed:** 88% faster (5-8min → 38sec) = ~7 minutes saved per deploy
- **At 5 deploys/day:** 35 minutes/day = 213 hours/year of developer time recovered
- **Migration execution:** 2 hours (vs typical 2-3 day weekend projects)

**Risk avoidance value:**

- Zero-downtime migrations eliminate revenue loss windows
- Pre-validation prevents email outages (typical cost: hours of missed customer communications)
- Preview deployments catch production issues before customer impact

**Platform economics:**

Cloudflare Pages free tier (500 builds/month, unlimited bandwidth) serves most businesses. High-traffic sites may need paid plans ($20-$200/month), but deployment speed gains alone justify the cost through developer productivity.

**The real ROI:** Developer time back for feature work, not infrastructure babysitting.

---

**Want to try this approach?**
- [Goose AI assistant](https://github.com/block/goose) (open source)
- [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)
- Our workflow: [GitHub repository](https://github.com/clouatre-labs/clouatre.ca)
