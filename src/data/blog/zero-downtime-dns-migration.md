---
title: "Migrating to Cloudflare Pages: One Prompt, Zero Manual Work"
pubDatetime: 2025-11-06T02:00:00Z
description: "How we migrated hosting, DNS, and CI/CD from AWS Route53 + GitHub Pages to Cloudflare—with a single prompt to an AI assistant. Preview deployments, automated validation, zero downtime. The only manual step: creating an API token."
tags: ["devops", "ai", "cloudflare", "cicd", "automation", "aws", "goose", "route53"]
featured: true
---

We migrated a complete website infrastructure—hosting, DNS, CI/CD—from AWS Route53 + GitHub Pages to Cloudflare in 2 hours during business hours. Zero downtime. Zero manual commands.

The only manual step: Creating a Cloudflare API token.

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

That's it. We didn't know:
- Where DNS was hosted (Goose found Route53)
- How many DNS records existed (Goose discovered 20+)
- Which records were critical vs obsolete
- How to configure Cloudflare Pages
- How to set up GitHub Actions for Cloudflare

**Goose figured everything out.**

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

GitHub Pages served at `/repo-name/`, Cloudflare at root. Goose removed `base` config, fixed all component paths, updated navigation and theme toggle.

### 5. Created PRs with Context

Pull requests included change descriptions, migration rationale, rollback procedures, and testing verification.

### 6. Preview Deployments

The best part: Every PR branch gets a preview URL **before** merging to production.

**This blog post?** You're reading it at a preview URL right now:
- Preview: `https://feat-update-blog-post-final.clouatre-ca.pages.dev`
- We review changes BEFORE they go live
- Production deploys only after approval

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

**Migration completed in 2 hours, zero downtime, zero manual commands.**

## Key Lessons

### 1. Goose Handles Implementation Details

You still need to understand what you're migrating, but you don't need to remember:
- Exact API syntax
- AWS CLI flags for Route53 operations
- Cloudflare API endpoints
- DNS record format specifics
- YAML workflow syntax

Goose discovered our infrastructure (Route53), analyzed the records, and executed the migration. We provided the goals and constraints, reviewed the approach, and approved changes.

**Value:** Reduces time from hours to minutes. Eliminates typos and omissions.

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

**Before:** Hours of manual DNS record copying, testing, hoping.  
**After:** Create token, give prompt, review changes.

## Applicability

This approach works for any infrastructure migration:

**Requirements:**
- AI assistant with CLI access (Goose, similar tools)
- Clear requirements (zero downtime, validate everything)
- Willingness to review AI outputs

**Workflow:**
1. Give AI the goal and constraints
2. Review what it discovers
3. Approve changes (PRs, DNS updates)
4. AI executes everything
5. Validate results

**Limitations:**
- Requires API access to both platforms
- Need to review AI decisions (don't blindly trust)
- Complex migrations need human judgment on priorities

## Cost Reality

**Cloudflare Pages free tier:**
- 500 builds/month
- 1 concurrent build
- Unlimited bandwidth and requests
- Unlimited preview deployments

**Perfect for:** Personal sites, small businesses, most projects.  
**Paid plans needed for:** High-traffic sites (millions of requests), teams needing multiple concurrent builds.

**GitHub Pages:** Remains free regardless of traffic (but slower globally, no preview deployments).

## The Bottom Line

Modern infrastructure migrations don't require:
- Weekend deployment windows
- Manual command execution
- Hope-based testing
- Extended downtime

With AI assistance:
- Describe the goal
- Review what AI discovers
- Approve changes
- AI executes everything

**The proof:** This blog post exists at a preview URL, created by the same automation we're describing. We're using the system to document itself.

---

**Want to try this approach?**
- [Goose AI assistant](https://github.com/block/goose) (open source)
- [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)
- Our workflow: [GitHub repository](https://github.com/clouatre-labs/clouatre.ca)

**Preview this exact post:** [feat-update-blog-post-final.clouatre-ca.pages.dev](https://feat-update-blog-post-final.clouatre-ca.pages.dev/posts/zero-downtime-dns-migration/)

*(We'll cover Goose setup in a future post.)*
