# Cloudflare Pages Deployment Guide

Step-by-step instructions for deploying this MkDocs Material site to Cloudflare Pages (recommended for abhavtech.com).

## Prerequisites

- [x] GitHub account with repository created
- [x] Cloudflare account with domain registered
- [x] Domain DNS managed by Cloudflare (or pointing to Cloudflare nameservers)

## Step 1: Push to GitHub

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Webex CC Greenfield documentation"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/abhavtech/webex-cc-greenfield.git

# Push to GitHub
git push -u origin main
```

## Step 2: Create Cloudflare Pages Project

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Select your account

2. **Navigate to Pages**
   - Sidebar: **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**

3. **Connect GitHub Repository**
   - Click **Connect GitHub**
   - Authorize Cloudflare to access your repositories
   - Select repository: `abhavtech/webex-cc-greenfield`
   - Click **Begin setup**

## Step 3: Configure Build Settings

**Project name:** `webex-cc-greenfield` (or your choice)

**Production branch:** `main`

**Build settings:**

| Setting | Value |
|---------|-------|
| **Framework preset** | None (select "None" from dropdown) |
| **Build command** | `pip install -r requirements.txt && mkdocs build` |
| **Build output directory** | `site` |
| **Root directory (optional)** | *(leave blank)* |

**Environment variables:**
- None required (MkDocs doesn't need environment variables)

**Advanced settings (expand if needed):**
- Build watch paths: `docs/**/*.md`, `mkdocs.yml`, `docs/stylesheets/*.css`
- Ignore command: *(leave blank)*

Click **Save and Deploy**

## Step 4: Monitor First Build

1. Cloudflare will trigger the first build automatically
2. Build logs will show:
   ```
   Installing dependencies from requirements.txt...
   Building MkDocs site...
   INFO - Building documentation to directory: /opt/buildhome/repo/site
   INFO - Documentation built in X.XX seconds
   Success! Deployed to production
   ```
3. First build takes ~2-3 minutes
4. You'll get a temporary URL: `https://webex-cc-greenfield.pages.dev`

## Step 5: Add Custom Domain

**Option A: Subdomain (Recommended)**

1. In Cloudflare Pages → Your project → **Custom domains** → **Set up a custom domain**
2. Enter: `knowledge.abhavtech.com` (or your choice)
3. Cloudflare will:
   - Detect that abhavtech.com is in your Cloudflare account
   - Automatically add the DNS record (CNAME to `webex-cc-greenfield.pages.dev`)
   - Provision SSL certificate (takes 1-2 minutes)
4. Click **Activate domain**

**Option B: Root Domain**

1. Enter: `abhavtech.com`
2. Cloudflare adds:
   - A record: `192.0.2.1` (Cloudflare Pages IP)
   - AAAA record: `100::` (IPv6)
   - TXT record for verification
3. SSL certificate auto-provisioned

**Verify domain:**
- Wait 2-5 minutes for DNS propagation
- Visit: `https://knowledge.abhavtech.com` (or your domain)
- Verify SSL (padlock icon in browser)

## Step 6: Configure Automatic Deployments

Cloudflare Pages automatically deploys on every push to `main`:

**Production deployments (main branch):**
- Trigger: Push to `main` or merge PR to `main`
- URL: `https://knowledge.abhavtech.com`
- Build time: ~1-2 minutes (cached dependencies)

**Preview deployments (other branches):**
- Trigger: Push to any branch
- URL: `https://[branch-name].webex-cc-greenfield.pages.dev`
- Useful for testing changes before merge

## Step 7: Deployment Settings (Optional)

### Build Caching

Cloudflare caches `pip` dependencies automatically. To clear cache:
- Pages → Your project → **Settings** → **Builds & deployments**
- Click **Clear build cache**

### Build Concurrency

Free plan: 1 concurrent build  
Pro plan: 5 concurrent builds

### Rollback

To rollback to previous deployment:
- Pages → Your project → **Deployments**
- Find previous successful deployment
- Click **Manage deployment** → **Rollback to this deployment**

### Environment Variables (if needed in future)

To add environment variables:
- Pages → Your project → **Settings** → **Environment variables**
- Click **Add variable**
- Enter name and value
- Select environment: Production, Preview, or Both

## Step 8: DNS Configuration at Hostinger

**If your domain is registered at Hostinger but DNS is managed by Cloudflare:**

1. **Log in to Hostinger**
2. **Navigate to Domains** → Select `abhavtech.com`
3. **DNS Settings** → Use Cloudflare nameservers:
   ```
   ns1.cloudflare.com
   ns2.cloudflare.com
   ```
4. **Save changes** (propagation takes 1-24 hours)

**If DNS is still at Hostinger:**
- Add CNAME record: `knowledge` → `webex-cc-greenfield.pages.dev`
- Or migrate DNS to Cloudflare (recommended for better integration)

## Step 9: Verify Deployment

**Checklist:**

- [ ] Site loads at custom domain: `https://knowledge.abhavtech.com`
- [ ] SSL certificate valid (padlock icon)
- [ ] Navigation works (all 7 tabs)
- [ ] Search functionality works
- [ ] Dark/light mode toggle works
- [ ] Mobile responsive (test on phone)
- [ ] All internal links work
- [ ] Code blocks have copy buttons
- [ ] TOC (right sidebar) scrolls with page

## Step 10: Update Future Content

**Workflow for content updates:**

```bash
# Make changes to markdown files
vim docs/chapter-1-business-requirements/business-requirements-sizing.md

# Test locally
mkdocs serve
# Visit http://localhost:8000 to preview

# Commit and push
git add docs/
git commit -m "Updated Chapter 1: Added new sizing calculations"
git push origin main

# Cloudflare automatically deploys in 1-2 minutes
# Check deployment: Pages → Deployments tab
```

## Troubleshooting

### Build Fails

**Check build logs:**
- Pages → Deployments → Click on failed deployment → View build log

**Common issues:**

1. **Python version mismatch:**
   - Add environment variable: `PYTHON_VERSION = 3.11`

2. **Dependency installation fails:**
   - Verify `requirements.txt` is in repository root
   - Check for typos in package names

3. **MkDocs build error:**
   - Run `mkdocs build --strict` locally
   - Fix any warnings before pushing

### Custom Domain Not Working

1. **DNS propagation:**
   - Wait 5-10 minutes after adding custom domain
   - Check DNS: `dig knowledge.abhavtech.com`

2. **SSL certificate pending:**
   - Wait 2-5 minutes for provisioning
   - Cloudflare auto-provisions Let's Encrypt certificates

3. **Domain verification failed:**
   - Ensure domain is in your Cloudflare account
   - Check nameservers: `whois abhavtech.com`

### Site Loads But Styling Broken

1. **CSS not loading:**
   - Check: `docs/stylesheets/extra.css` is in repository
   - Verify: `extra_css` in `mkdocs.yml` points to correct path

2. **Clear browser cache:**
   - Hard refresh: Ctrl+Shift+R (Windows) / Cmd+Shift+R (Mac)

## Performance Optimization

**Cloudflare Pages automatically provides:**
- ✅ Global CDN (300+ locations)
- ✅ HTTP/3 and QUIC
- ✅ Brotli compression
- ✅ Automatic image optimization
- ✅ DDoS protection
- ✅ SSL/TLS encryption

**Additional optimizations (optional):**
1. **Enable cache rules** (Pages → Custom domains → [domain] → Caching)
2. **Minify HTML/CSS/JS** (already done by MkDocs Material)
3. **Preload fonts** (custom CSS if needed)

## Analytics (Optional)

**Add Cloudflare Web Analytics:**
1. Pages → Your project → **Settings** → **Analytics**
2. Click **Enable Web Analytics**
3. Privacy-friendly, no cookies required
4. Dashboard shows: page views, unique visitors, top pages

**Or integrate Google Analytics:**
- Add tracking ID to `mkdocs.yml`:
  ```yaml
  extra:
    analytics:
      provider: google
      property: G-XXXXXXXXXX
  ```

## Cost

**Cloudflare Pages pricing:**
- Free tier: 500 builds/month, unlimited requests, 20,000 files
- Pro tier ($20/month): Unlimited builds, advanced features

**For abhavtech.com:**
- Free tier is more than sufficient
- ~20-30 builds/month expected (content updates)
- Site size: ~30 files (well under 20,000 limit)

## Support

**Cloudflare Pages documentation:**
- https://developers.cloudflare.com/pages/

**MkDocs Material:**
- https://squidfunk.github.io/mkdocs-material/

**AbhavTech:**
- Contact: [Your contact method]

---

**Last Updated:** March 2026  
**Deployment Status:** Ready for production  
**Estimated Setup Time:** 15-20 minutes (first deployment)
