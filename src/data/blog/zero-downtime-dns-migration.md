---
title: "How AI Validated Our Zero-Downtime DNS Migration (And Saved Us a Weekend)"
pubDatetime: 2025-11-06T02:00:00Z
description: "DNS migrations keep engineers up at night. One typo can black-hole your email for 48 hours. Here's how we used AI to validate 15 DNS records, migrate to a faster platform, and deploy it all during business hours."
tags: ["devops", "ai", "cloudflare", "dns", "migration"]
featured: true
---

DNS migrations keep engineers up at night. One typo can black-hole your email for 48 hours. Here's how we used AI to validate 15 DNS records, migrate to a faster platform, and deploy it all—during business hours.

## The Problem

Our website was running on GitHub Pages. Fine for prototypes, but we needed better global performance. The challenge? Migrating 15 critical DNS records (including email and Google Workspace) without breaking anything.

Traditional DNS migrations require:
- Weekend deployment windows
- Manual record copying (error-prone)
- Cross-your-fingers testing
- 2-48 hour rollback if something breaks

The risk? A single typo could black-hole our email for two days. That's not acceptable for any business.

## Why This Migration Mattered

GitHub Pages served us well initially, but we hit limitations:

**Performance Issues:**
- DNS resolution: 20-30ms globally
- Limited CDN presence (250 edge locations)
- 5-8 minute deployment times

**Cost Considerations:**
- Route53 DNS: $0.50/month base + $0.40 per million queries
- Small cost, but multiplied across multiple domains adds up

**The Real Problem:**
Our Route53 nameserver records had a 48-hour TTL (Time To Live). That meant any migration would take two full days to propagate globally. Weekend work, backup plans, and high stress.

## The AI-Assisted Approach

Instead of hoping for the best, we used Goose (an AI assistant) to validate everything before switching.

### Phase 1: Pre-Migration Validation

Goose queried Cloudflare's nameservers **before we changed anything**:

```bash
# Test against Cloudflare DNS (before switching)
dig @oaklyn.ns.cloudflare.com clouatre.ca MX +short
# Verified: All 5 Google Mail servers, correct priorities

dig @oaklyn.ns.cloudflare.com clouatre.ca TXT +short | grep spf
# Verified: SPF record identical to Route53

dig @oaklyn.ns.cloudflare.com agenda.clouatre.ca CNAME +short
# Verified: Google Workspace CNAME preserved
```

Every critical record tested. Email MX records? Identical. Google Workspace CNAMEs? Identical. We knew it would work before changing anything.

### Phase 2: Risk Elimination

Added a backup record: `old.clouatre.ca` pointing to the original site. If the new site broke, users could access the old one immediately. Zero data loss, zero downtime.

### Phase 3: Execution

Changed nameservers at 2pm on a Wednesday. DNS propagated in 15 minutes. Old site accessible at `old.clouatre.ca`, new site live at `clouatre.ca`. 

Zero downtime. Zero stress.

## The Results

### Performance Improvements

| Metric | Before (GitHub Pages) | After (Cloudflare Pages) | Improvement |
|--------|----------------------|-------------------------|-------------|
| DNS Resolution | 20-30ms | 10-15ms | 2x faster |
| CDN Locations | 250 | 330 | 32% more coverage |
| Deploy Time | 5-8 minutes | 38 seconds | 8x faster |
| DDoS Protection | Basic | Enterprise-grade | Included free |

### Cost Impact

- Route53 DNS: $6-12/year → $0 (Cloudflare DNS free tier)
- Hosting: $0 (GitHub Pages) → $0 (Cloudflare Pages free tier)

**Note:** Cloudflare's free tier is generous but has limits:
- 500 builds per month
- 1 concurrent build
- Unlimited bandwidth and requests

For high-traffic sites (10M+ requests/month), you'd need the Pro plan ($20/month). For our use case, free tier is perfect.

### Risk Reduction

- Migration time: 48 hours → 2 hours
- Downtime: 0 minutes
- Rollback capability: Instant (revert nameservers)
- Email disruption: 0 (pre-validated)

### Developer Experience

What AI automated for us:
1. Analyzed 20 Route53 DNS records
2. Imported all to Cloudflare programmatically (no manual copying)
3. Generated validation scripts (dig queries against new nameservers)
4. Created real-time monitoring tools (watched propagation live)
5. Documented rollback procedures
6. Identified the 48-hour TTL problem (would've blindsided us)

What would've taken humans:
- 4-8 hours of manual DNS record copying
- Weekend migration window for safety
- Likely 1-2 typos in DNS records (they're unforgiving)
- No pre-validation capability (can't test before switching)

## Key Lessons

### 1. Validate Before You Migrate

Test against new infrastructure before switching. AI queried Cloudflare's nameservers while Route53 was still active. This eliminated "hope-based deployment."

### 2. Zero Risk Is Possible

Keep the old system accessible during migration. We added `old.clouatre.ca` pointing to CloudFront. Instant fallback if needed.

### 3. AI Accelerates Operations

- 2 hours vs 2 days (10x faster)
- Zero manual errors (DNS records are unforgiving)
- Developer focuses on strategy, AI handles execution

### 4. Know Your Scale

Our migration saved $12/year in DNS costs. Small, but it compounds:
- 10 domains: $120/year
- 100 domains: $1,200/year

More importantly: 2x faster DNS resolution and 8x faster deploys improve user experience and developer productivity daily.

**Cost Reality Check:** Cloudflare's free tier works for small-to-medium sites. High-traffic sites need paid plans. GitHub Pages remains free regardless of traffic (but slower globally).

## The Technical Stack

- **Old Setup:** GitHub Pages + Route53 DNS + CloudFront
- **New Setup:** Cloudflare Pages + Cloudflare DNS
- **Migration Tool:** Goose AI (open source)
- **Validation:** dig queries, DNS propagation monitoring
- **Deployment:** GitHub Actions (38-second builds)

## Why This Matters for Your Business

Modern infrastructure shouldn't require weekend migrations and backup plans. With AI-assisted validation, we proved you can migrate critical infrastructure during business hours—with zero risk and measurable improvements.

The future of DevOps isn't just automation; it's intelligent validation before execution. Test against production infrastructure before switching. Eliminate hope. Deploy with confidence.

---

**Interested in the approach?** The migration scripts and validation tools are available in our [GitHub repository](https://github.com/clouatre-labs/clouatre.ca). The workflow is reproducible for any DNS migration.

**Using Goose?** Check out our [OSS contribution workflow](https://github.com/clouatre-labs/clouatre.ca/tree/main/.github/workflows) for production-ready CI/CD patterns.
