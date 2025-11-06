---
title: "Pre-Validating DNS Migrations with AI"
pubDatetime: 2025-11-06T02:00:00Z
description: "How we migrated 15 DNS records from AWS Route53 to Cloudflare with zero downtime by testing everything before switching nameservers."
tags: ["devops", "ai", "cloudflare", "dns"]
featured: true
---

DNS migrations typically require weekend deployment windows and backup plans. We migrated 15 critical DNS records (email, Google Workspace) from AWS Route53 to Cloudflare during business hours with zero downtime.

The key: Pre-validate everything before switching nameservers.

## The Setup

**Before:**
- Hosting: GitHub Pages
- DNS: AWS Route53 ($12/year)
- 15 DNS records including email (MX, SPF, DKIM, DMARC) and Google Workspace

**After:**
- Hosting: Cloudflare Pages  
- DNS: Cloudflare (free)
- Same 15 records, validated before switching

## The Problem with Traditional Migrations

Most DNS migrations work like this:

1. Manually copy DNS records to new provider
2. Hope you didn't make typos
3. Switch nameservers
4. Find out what broke

A single mistake in an MX record can black-hole email for days.

## The AI-Assisted Approach

**About Goose:** [Goose](https://github.com/block/goose) is an open-source AI assistant that can execute terminal commands, use APIs, and automate infrastructure tasks. It runs locally and integrates with your existing tools (AWS CLI, GitHub CLI, etc.). *(We'll cover our Goose setup in a future post.)*

**Our prompt to Goose:**

```
I want to migrate from GitHub Pages to Cloudflare Pages. The domain 
clouatre.ca is registered at Squarespace. I need zero downtime - email 
and Google Workspace cannot break. Use a risk-adverse approach.
```

That's it. We didn't know:
- Where DNS was hosted (Goose found Route53)
- How many DNS records existed (Goose discovered 15)
- What the records were (Goose exported them all)
- The hosted zone ID (Goose looked it up)

Goose figured everything out and executed all commands. We just directed the outcome.

### Step 1: Export Existing DNS

Goose used AWS CLI to export all Route53 records:

```bash
# Goose executed this (we didn't touch the terminal)
aws route53 list-resource-record-sets \
  --hosted-zone-id Z2FILZ24FFH72X > route53-backup.json
```

### Step 2: Import to Cloudflare

Goose used Wrangler CLI and Cloudflare API to create the zone and import all 15 records. Domain still pointed to Route53—nothing broken yet.

### Step 3: Pre-Validate (The Critical Step)

Here's what most migrations skip: **Test new DNS before switching.**

We told Goose: "Validate all records before switching. I want zero risk."

Goose executed dig commands against Cloudflare's nameservers:

```bash
# Goose ran these tests (we just reviewed the output)
dig @oaklyn.ns.cloudflare.com clouatre.ca MX +short
# Result: All 5 Google Mail servers ✓

dig @oaklyn.ns.cloudflare.com clouatre.ca TXT +short | grep spf
# Result: SPF record identical ✓

dig @oaklyn.ns.cloudflare.com agenda.clouatre.ca CNAME +short
# Result: Google Workspace working ✓
```

Goose also compared Route53 vs Cloudflare records programmatically using AWS CLI and curl to query the Cloudflare API. Every record matched.

We knew email would work. Traditional migrations? You find out after switching.

### Step 4: Switch Nameservers

Our only manual action: Changed nameservers at Squarespace registrar.
- From: Route53 nameservers
- To: Cloudflare nameservers (Goose provided the exact values)

Clicked save at 2pm on Wednesday. Zero downtime.

## Results

| Metric | Before | After |
|--------|--------|-------|
| DNS Resolution | 20-30ms | 10-15ms |
| Deploy Time | 5-8 min | 38 sec |
| DNS Cost | $12/year | $0 |
| Migration Risk | High | Zero |

## Key Lessons

### 1. Pre-Validate by Querying New Nameservers Directly

You can test new DNS infrastructure before switching:

```bash
dig @new-nameserver.example.com yourdomain.com MX +short
```

This eliminates hope-based deployment.

### 2. Lower TTL in Advance for Faster Propagation

Our Route53 NS records had 48-hour TTL. This meant DNS propagation took up to 2 days globally.

For our static personal site, this was fine—we had time.

**For production sites that can't wait:**
1. Lower NS record TTL to 300 seconds (5 minutes)
2. Wait one week for old TTL to expire globally
3. Then migrate (5-minute propagation instead of 48 hours)

Plan ahead if you need fast propagation.

### 3. Keep Backup Access

Add a backup record (`old.yourdomain.com`) pointing to previous hosting. Instant fallback if needed.

### 4. Automate Record Import

Manual DNS record copying = typos. Use APIs to export from old provider, import to new provider. Goose automated:
- AWS CLI for export
- Cloudflare API for import
- Programmatic comparison to verify

## What AI Actually Did

1. Exported all Route53 records (AWS CLI)
2. Created Cloudflare zone (API)
3. Imported 15 records (API, no manual copying)
4. Generated validation scripts (dig commands)
5. Compared records programmatically (verified all matched)
6. Created monitoring scripts (watched propagation)
7. Identified the 48-hour TTL problem (would've blindsided us)

**Time saved:** 4-8 hours of manual work. **Risk eliminated:** Zero typos, pre-validated.

## Applicability

This approach works for any DNS migration:
1. Export existing DNS (programmatically)
2. Import to new provider (programmatically)
3. Pre-validate by querying new nameservers
4. Switch nameservers at registrar
5. Monitor propagation

**Cost reality:** Cloudflare's free tier works for most sites (500 builds/month, unlimited bandwidth). High-traffic sites need paid plans ($20+/month).

## The Bottom Line

Modern infrastructure migrations don't require weekend work and crossed fingers. Pre-validation eliminates guesswork.

Test new infrastructure before switching traffic to it.
