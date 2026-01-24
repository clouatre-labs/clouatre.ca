---
title: "Migrating to Cloudflare Pages: One Prompt, Zero Manual Work"
pubDatetime: 2025-11-06T12:00:00Z
modDatetime: 2026-01-24T19:21:00Z
description: "GitHub Pages to Cloudflare Pages in 2 hours with zero downtime. AI-assisted DNS, hosting, and CI/CD migration with validation and real metrics."
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

DNS migrations can be done with zero downtime, but they require extensive planning and careful execution. One misconfigured MX record means email down for hours. Imagine missing customer orders, support tickets, or sales inquiries during your peak season.

**The difference with AI assistance:**

Same zero-downtime outcome, but with programmatic validation instead of manual checklists. Business hours execution becomes feasible because pre-validation eliminates guesswork. Teams without specialized DevOps expertise can execute complex migrations confidently.

**Strategic value:**

Infrastructure changes shift from high-stress, weekend events to business-hours execution with automated validation. Experienced engineers still evaluate proposals, but with dramatically reduced risk and time investment. Preview deployments enable stakeholder review before release.

**The transformation:** From possible-but-stressful to routine-and-confident.

## The Starting Prompt

**What we told Goose ([open-source AI assistant](https://github.com/block/goose) powered by Claude Sonnet 4.5):**

> I want to migrate from GitHub Pages to Cloudflare Pages.
> The domain clouatre.ca is registered at Squarespace.
> I need zero downtime - email and Google Workspace cannot break.
> Check if DNSSEC is enabled and handle it appropriately.
> Use a risk-adverse approach.

This prompt started a [5-phase recipe workflow](/posts/ai-assisted-development-judgment-over-implementation/#the-recipe-model-codifying-judgment) with mandatory approval gates: I reviewed and approved each phase (Analyze → Research → Plan → Implement → Prepare). Not autonomous execution, AI-assisted with human governance at every decision point.

We didn't need to specify where DNS was hosted (discovered Route53 automatically), how many DNS records existed (found 20+), which records were critical vs obsolete, how to configure Cloudflare Pages, or how to set up GitHub Actions for Cloudflare. The AI handled discovery and analysis.

- **Claude Sonnet 4.5 (reasoning):** Analyzes context, decides what to do, discovers infrastructure, validates approach
- **Goose (execution layer):** Provides tool access (shell, git, AWS CLI, gh), manages conversation state, enforces approval gates
- **Human (governance):** Reviews proposals at gates, approves/rejects, maintains control

**Critical:** We reviewed every decision. The AI proposed, we approved. The combination of automation + human judgment enabled confidence.

![Cloudflare migration workflow diagram showing approval gates and validation steps](@/assets/images/migration-workflow.png)
*Figure 1: AI-assisted migration workflow with two human approval gates ensuring governance and confidence*

## What Got Automated

The migration workflow orchestrated five critical phases:

**Discovery & Cleanup**

Claude analyzed 20+ Route53 records and separated signal from noise: 15 critical records (email, Google Workspace, SSL validation) and 5 obsolete entries (old servers, expired validations). DNSSEC verification came back negative, confirming no migration blocker.

**Pre-Migration Validation**

Records were exported from Route53 and imported to Cloudflare via APIs, then tested against Cloudflare nameservers before switching. This included verifying email servers (MX priorities), SPF, DKIM, DMARC (exact TXT values), CNAMEs (Google Workspace), and comparing TTL values between source and target. The validation report confirmed 100% match.

**How validation worked in practice:**

```bash file="scripts/validate-cloudflare-dns.sh"
# Verify records match before switching nameservers
dig @nameserver1.cloudflare.com clouatre.ca MX +short  # [!code highlight]
# Output: 1 aspmx.l.google.com. (matches Route53)
diff <(aws route53 list-resource-record-sets) <(curl cloudflare-api)  # [!code highlight]
# Output: (empty = 100% match, zero risk)
```

*Code Snippet 1: Pre-validation against Cloudflare nameservers before switching (zero output from diff = zero risk)*

**CI/CD Reconfiguration**

GitHub Actions were updated to deploy to Cloudflare instead of GitHub Pages, with base URL fixes (GitHub's `/repo/` path to root `/`) and a preview deployment workflow with 7-day auto-cleanup. Result: 38-second deploys, down from 5-8 minutes.

**The CI/CD transformation:**

```yaml file=".github/workflows/deploy.yml"
# Cloudflare Pages deployment (38-second deploys)
- name: Deploy to Cloudflare Pages
  uses: cloudflare/wrangler-action@v3  # [!code highlight]
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    command: pages deploy dist --project-name=clouatre-ca  # [!code highlight]
```

*Code Snippet 2: GitHub Actions deployment to Cloudflare Pages (replaced GitHub Pages action for 88% faster deploys)*

**Governance Trail**

The assistant created PRs with migration context, rationale, and rollback procedures. Every change was reviewable before production, creating an audit trail for compliance.

**Preview Infrastructure**

Every branch gets a preview URL automatically. Stakeholders can review before merge, and the system handles auto-cleanup with zero maintenance.

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

### 1. The AI Stack Handles Implementation Details

You still need to understand what you're migrating, but you don't need to remember exact API syntax, AWS CLI flags for Route53 operations, Cloudflare API endpoints, DNS record format specifics, or YAML workflow syntax.

Claude discovered our infrastructure (Route53) and analyzed the records. Goose orchestrated the execution with tool access. We provided the goals and constraints, reviewed the approach, and approved changes.

**Value:** Reduces specialized knowledge requirement, eliminates manual typos, compresses migration timeline from 4-6 hours (planning + execution + validation) to 2 hours (review + approval).

### 2. Pre-Validation Eliminates Risk

All DNS records were tested against Cloudflare's nameservers before switching. This included email servers, Google Workspace records, and SSL validation. The process queried Cloudflare nameservers for each record type, verified all 5 MX records, verified TXT records (SPF, DKIM, DMARC), verified CNAME records (Google Workspace services), and generated a validation report.

**Business outcome:** We knew email, Google Workspace, and website would work before changing nameservers. Zero guessing.

### 3. Automate Record Migration

20+ DNS records, each with specific formats, priorities, TTLs. Manual copying guarantees typos. APIs provided accuracy: export from Route53 (AWS CLI), import to Cloudflare (API), and programmatic comparison to verify all matched.

**Result:** Zero typos. Zero manual record editing.

### 4. Preview Deployments Change Everything

Preview deployments reduce deployment anxiety, catch issues early, enable stakeholder review, and enable faster iteration. For technical leaders, preview deployments shift risk from production to staging, enabling confident releases.

### 5. The Paradigm Shift: From Careful Planning to Confident Execution

Traditional DNS migrations rely on weekend deployment windows (lower risk, higher stress), manual command execution (careful, but one typo equals disaster), sequential testing after switching (discover errors in production), specialized knowledge (dig syntax, DNS formats, cloud CLIs), and extensive planning with checklists (mitigates risk but time-intensive).

AI-assisted migrations enable business hours execution (confidence through pre-validation), programmatic execution (eliminates manual typos), pre-validated testing (know it works before switching), offloaded domain expertise (AI handles implementation syntax), and less planning overhead (validation happens automatically).

**The transformation:** From "plan exhaustively and execute carefully" to "validate programmatically and execute confidently."

We knew every record worked before switching. No deployment anxiety, no weekend stress, no contingency planning. Just confidence through programmatic validation.

**The proof:** This blog post was reviewed at a preview URL before going live. We used the same automation we're describing. The system documents itself.

## When Does This Approach Apply?

This approach works best for infrastructure migrations (DNS, hosting, CI/CD platforms) where teams lack specialized DevOps resources but need zero-downtime execution and audit trails. Requirements include AI assistant with CLI/API access (Goose or similar), API access to source and target platforms, clear migration constraints, and human review processes.

The trade-offs: reviewing AI decisions takes time, complex migrations may need human judgment on priorities, and initial setup requires configuring API tokens. Not suitable for instant-execution scenarios, environments prohibiting API access, or situations where teams lack domain knowledge to evaluate AI proposals.

## What Is the ROI of AI-Assisted Infrastructure Migration?

Time savings compound quickly. Deployment speed improved 88% (5-8min to 38sec), saving ~7 minutes per deploy. At 5 deploys per day, that's 35 minutes daily or 213 hours yearly of developer time recovered. Migration execution took 2 hours versus typical 2-3 day weekend projects.

Risk avoidance delivers additional value. Zero-downtime migrations eliminate revenue loss windows. Pre-validation prevents email outages (typical cost: hours of missed customer communications). Preview deployments catch production issues before customer impact.

Platform economics favor Cloudflare. The free tier (500 builds/month, unlimited bandwidth) serves most businesses. High-traffic sites may need paid plans ($20-$200/month), but deployment speed gains alone justify the cost through developer productivity.

**The real ROI:** Developer time back for feature work, not infrastructure babysitting.

---

## References

- Cloudflare, "Change your nameservers (Full setup)" (2026) — https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/
- Cloudflare, "DNSSEC" (2026) — https://developers.cloudflare.com/dns/dnssec/
