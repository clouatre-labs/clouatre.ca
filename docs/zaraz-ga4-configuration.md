# Zaraz GA4 Configuration

## Overview

Google Analytics 4 tracking is implemented via Cloudflare Zaraz, an edge-executed analytics platform. This approach provides:

- Zero main thread blocking (analytics run on Cloudflare edge)
- No gtag.js library added to codebase
- Free tier support
- Automatic performance optimization

## Setup Instructions

### 1. Cloudflare Dashboard Configuration

1. Log in to Cloudflare Dashboard
2. Navigate to your domain
3. Go to **Analytics & Insights** > **Zaraz**
4. Click **Create** to add a new tool
5. Select **Google Analytics 4** from the tool library
6. Configure with your GA4 Measurement ID (format: `G-XXXXXXXXXX`)

### 2. Trigger Configuration

Create a trigger to fire on all page views:

- **Trigger Name:** Page View
- **Trigger Type:** Page View
- **Conditions:** None (fires on all pages)

### 3. Tool Settings

- **Measurement ID:** Your GA4 property ID
- **Send Page View:** Enabled
- **User ID:** Optional (for cross-device tracking)

## AI Referrer Tracking

To track traffic from AI tools (ChatGPT, Claude, Perplexity, etc.):

### Method 1: Custom Event (Recommended)

Zaraz automatically captures referrer information in GA4. AI traffic appears as:

- **Source:** `chatgpt.com`, `claude.ai`, `perplexity.ai`, etc.
- **Medium:** `referral`
- **Campaign:** Auto-detected from referrer

### Method 2: Custom Dimension (Optional)

For enhanced AI tool classification:

1. In GA4, create a custom dimension: `ai_tool_source`
2. In Zaraz, add custom event parameter:
   ```
   ai_tool_source: (referrer contains 'chatgpt' ? 'ChatGPT' : 
                     referrer contains 'claude' ? 'Claude' : 
                     referrer contains 'perplexity' ? 'Perplexity' : 'Other')
   ```

## Verification

1. Deploy changes to Cloudflare
2. Visit your site from an AI tool (or use referrer header in dev tools)
3. Check GA4 real-time reports within 30 seconds
4. Verify page views and referrer source appear correctly

## Maintenance

- Monitor Zaraz dashboard for tool health
- Review GA4 reports monthly for anomalies
- Update GA4 property ID if migrating properties
- No code changes required for updates

## References

- [Cloudflare Zaraz Documentation](https://developers.cloudflare.com/zaraz/)
- [Google Analytics 4 Setup](https://support.google.com/analytics/answer/10089681)
- [GA4 Referrer Tracking](https://support.google.com/analytics/answer/12633562)
