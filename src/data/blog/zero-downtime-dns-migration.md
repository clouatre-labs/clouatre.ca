---
title: "Migrating to Cloudflare Pages: One Prompt, Zero Manual Work"
pubDatetime: 2025-11-06T02:00:00Z
description: "How we migrated hosting, DNS, and CI/CD from AWS Route53 + GitHub Pages to Cloudflare—with a single prompt to an AI assistant. Preview deployments, automated validation, zero downtime. The only manual step: creating an API token."
tags: ["devops", "ai", "cloudflare", "cicd", "automation"]
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

Goose analyzed all Route53 records and categorized them:

**Critical (migrate these):**
- 5 MX records (Google Mail with priorities)
- SPF, DKIM, DMARC (email authentication)
- 4 Google Workspace CNAMEs (agenda, contacts, hugues, mail)
- 2 website records (apex + www)

**Temporary (can delete):**
- SSL validation records (Let's Encrypt, AWS ACM)
- Old Redmine server records (h1, redmine, redminegr)

Goose deleted 5 obsolete records, kept 15 critical ones.

### 2. DNS Migration with Pre-Validation

Goose exported Route53 records (AWS CLI), imported to Cloudflare (API), then validated BEFORE switching nameservers:

```bash
# Goose tested against Cloudflare nameservers (domain still on Route53)
dig @oaklyn.ns.cloudflare.com clouatre.ca MX +short
# Verified: All 5 Google Mail servers ✓

dig @oaklyn.ns.cloudflare.com agenda.clouatre.ca CNAME +short
# Verified: Google Workspace working ✓
```

Every record validated before switching. Traditional migrations? You find out after.

### 3. GitHub Actions CI/CD Setup

Goose created `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloudflare Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-24.04
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          command: pages deploy dist --project-name=clouatre-ca
          packageManager: bun
```

**Result:** 38-second deployments (vs 5-8 minutes on GitHub Pages)

### 4. Fixed Base URL Issues

GitHub Pages served at `/repo-name/`. Cloudflare Pages serves at root. Goose:
- Removed `base` config from `astro.config.ts`
- Fixed BASE_URL handling in all components
- Updated navigation links
- Fixed theme toggle script loading

All broken paths fixed automatically. We just reviewed the changes.

### 5. Created PRs with Full Context

Goose created pull requests with:
- Detailed change descriptions
- Migration rationale
- Rollback procedures
- Testing verification

Example: PR #20 for Cloudflare migration, PR #21 for package manager fix.

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
| Migration Time | N/A | 2 hours |
| Manual Commands | N/A | 0 |
| Downtime | N/A | 0 minutes |

### Developer Experience Improvements

**Before (GitHub Pages):**
- Push to main → wait 5-8 minutes → hope it works
- No preview deployments
- Hard to test changes before production

**After (Cloudflare Pages):**
- Push to branch → preview URL in 40 seconds
- Review changes before merging
- Merge to main → production in 38 seconds
- Rollback: revert commit, 38 seconds

## What Goose Actually Did

1. **Discovered infrastructure** (AWS CLI: found Route53, 20 DNS records)
2. **Analyzed DNS records** (categorized critical vs obsolete)
3. **Cleaned Route53** (deleted 5 old records)
4. **Created Cloudflare zone** (API)
5. **Imported 15 records** (API, programmatic)
6. **Pre-validated DNS** (dig commands against Cloudflare nameservers)
7. **Created GitHub workflow** (`.github/workflows/deploy.yml`)
8. **Created Wrangler config** (`wrangler.toml`)
9. **Fixed base URL issues** (Astro config, components, scripts)
10. **Created PRs** (with context and rollback procedures)
11. **Stored secrets** (GitHub repository secrets via `gh` CLI)
12. **Monitored propagation** (created monitoring scripts)

**Commands executed:** 100+  
**Commands we ran manually:** 0  
**Our time:** Reviewing outputs, approving changes  

## The Magic: Preview Deployments

Every branch gets a preview URL automatically:

```bash
# Push a branch
git push origin feat/new-feature

# Cloudflare builds and deploys in ~40 seconds
# Preview URL: https://feat-new-feature.clouatre-ca.pages.dev
```

**Use cases:**
- Review blog posts before publishing (this post!)
- Test UI changes with stakeholders
- Validate DNS changes (we did this!)
- Share work-in-progress

**Cost:** $0 (Cloudflare free tier: 500 builds/month, unlimited bandwidth)

## Key Lessons

### 1. AI Can Discover Your Infrastructure

We didn't know where DNS was hosted. Goose:
- Checked domain whois
- Found Route53 via AWS CLI
- Discovered the hosted zone ID
- Exported all records

**Traditional approach:** Manual discovery, documentation lookup, trial and error.

### 2. Pre-Validate Before Switching

Test new infrastructure before switching traffic:

```bash
dig @new-nameserver.example.com yourdomain.com MX +short
```

This eliminated risk. We knew email would work before switching nameservers.

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
