# Google Site Verification Setup

The site already has full support for Google Site Verification meta tags.

## How to Add Your Verification Code

### Step 1: Get Verification Code from Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Select your property: `clouatre.ca`
3. Go to **Settings** (gear icon) → **Ownership verification**
4. Under **Verification methods**, click **HTML tag**
5. Copy the `content` value from the meta tag

Example:
```html
<meta name="google-site-verification" content="ABC123xyz456..." />
```
Copy only: `ABC123xyz456...`

### Step 2: Add to Environment Variables

#### Local Development (.env)
```bash
PUBLIC_GOOGLE_SITE_VERIFICATION=ABC123xyz456...
```

#### Production (GitHub Secrets)
1. Go to: https://github.com/clouatre-labs/clouatre.ca/settings/secrets/actions
2. Click **New repository secret**
3. Name: `PUBLIC_GOOGLE_SITE_VERIFICATION`
4. Value: `ABC123xyz456...`
5. Click **Add secret**

#### Cloudflare Pages (Environment Variables)
1. Go to: https://dash.cloudflare.com/
2. **Workers & Pages** → `clouatre-ca` → **Settings** → **Environment variables**
3. Click **Add variable**
4. Variable name: `PUBLIC_GOOGLE_SITE_VERIFICATION`
5. Value: `ABC123xyz456...`
6. Click **Save**

### Step 3: Deploy & Verify

1. Commit and push changes (if any)
2. Wait for deployment to complete
3. Go back to Google Search Console
4. Click **Verify** button

The meta tag will automatically appear in your site's `<head>` section when the environment variable is set.

## Check if It's Working

Visit your site and view source (Right-click → View Page Source), look for:
```html
<meta name="google-site-verification" content="ABC123xyz456..." />
```

## Notes

- The verification code is **optional** - you're already verified through ownership transfer
- This adds redundancy and is considered best practice
- Multiple verification methods are recommended by Google
- If the environment variable is not set, the meta tag won't appear (no errors)
