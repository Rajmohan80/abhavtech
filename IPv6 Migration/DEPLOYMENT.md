# Deployment Guide — Cloudflare Pages

This guide provides step-by-step instructions for deploying the AbhavTech IPv6 Migration Guide to Cloudflare Pages with automatic CI/CD from GitHub.

---

## Prerequisites

Before starting:

- ✅ **GitHub account** with repository access (or create new repo)
- ✅ **Cloudflare account** (free tier works for documentation sites)
- ✅ **Custom domain** (optional) — `ipv6.abhavtech.com` or use `*.pages.dev` subdomain

---

## Step 1: Prepare GitHub Repository

### 1.1 Create Repository

1. Go to [github.com/new](https://github.com/new)
2. Name: `ipv6-migration-docs` (or your preferred name)
3. Visibility: **Public** or **Private** (both work with Cloudflare Pages)
4. Initialize: **Do not** add README, .gitignore, or license (we have those)
5. Click **Create repository**

### 1.2 Push Project to GitHub

```bash
cd ipv6-migration/

# Initialize git (if not already initialized)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: IPv6 Migration Guide"

# Add remote (replace with your GitHub username/org)
git remote add origin https://github.com/YOUR_USERNAME/ipv6-migration-docs.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy to Cloudflare Pages

### 2.1 Connect GitHub Repository

1. Log in to [dash.cloudflare.com](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Pages**
3. Click **Connect to Git**
4. Authorize Cloudflare to access your GitHub account
5. Select the repository: `ipv6-migration-docs`
6. Click **Begin setup**

### 2.2 Configure Build Settings

**Framework preset:** None (or Custom)

**Build configuration:**

| Setting | Value |
|---------|-------|
| **Production branch** | `main` |
| **Build command** | `pip install -r requirements.txt && mkdocs build` |
| **Build output directory** | `site` |
| **Root directory** | `/` (leave blank) |
| **Environment variables** | None required (Python available by default) |

### 2.3 Advanced Build Settings (Optional)

**Python version:**

If you need a specific Python version, add environment variable:

- **Key:** `PYTHON_VERSION`
- **Value:** `3.11` (or `3.10`, `3.9`)

Default Python version on Cloudflare Pages is usually sufficient.

### 2.4 Deploy

1. Click **Save and Deploy**
2. Cloudflare Pages will:
   - Clone the repository
   - Install dependencies from `requirements.txt`
   - Run `mkdocs build`
   - Deploy the `site/` directory

**First deployment** takes ~2-3 minutes.

### 2.5 Verify Deployment

Once deployed, you'll receive:

- **Pages URL:** `https://ipv6-migration-docs.pages.dev` (or similar)
- Click the URL to verify the site loads correctly

---

## Step 3: Custom Domain Setup (Optional)

### 3.1 Add Custom Domain

1. In Cloudflare Pages project, go to **Custom domains**
2. Click **Set up a custom domain**
3. Enter your domain: `ipv6.abhavtech.com`
4. Click **Continue**

### 3.2 DNS Configuration

**Option A: Domain already on Cloudflare**

Cloudflare will automatically create the required CNAME record.

**Option B: Domain on external DNS provider (e.g., Hostinger)**

Add a CNAME record to your DNS:

| Type | Name | Target | TTL |
|------|------|--------|-----|
| CNAME | `ipv6` | `ipv6-migration-docs.pages.dev` | 3600 |

**Option C: Apex domain (e.g., abhavtech.com → ipv6 subdomain)**

If using Cloudflare DNS, use CNAME flattening (automatic).

If using external DNS and apex domain, use A record pointing to Cloudflare Pages IP (check Cloudflare dashboard for current IP).

### 3.3 SSL Certificate

Cloudflare automatically provisions SSL certificates for custom domains. This may take **5-10 minutes**.

Once SSL is active, the custom domain status will show **Active**.

---

## Step 4: Automatic Deployments

### CI/CD Workflow

Every push to the `main` branch triggers automatic deployment:

1. Make changes locally
2. Commit and push:
   ```bash
   git add .
   git commit -m "Update Phase 3 content"
   git push origin main
   ```
3. Cloudflare Pages automatically rebuilds and deploys (2-3 minutes)

### Preview Deployments

Every pull request gets a **preview URL**:

- Create a branch: `git checkout -b feature/update-chapter-5`
- Make changes and push
- Open a pull request on GitHub
- Cloudflare generates unique preview URL: `https://abc123.ipv6-migration-docs.pages.dev`

---

## Step 5: Post-Deployment Validation

### 5.1 Smoke Test

Verify these pages load correctly:

- ✅ Homepage: `https://ipv6.abhavtech.com/`
- ✅ Chapter 1 Overview: `https://ipv6.abhavtech.com/chapter1-getting-started/`
- ✅ Master Reference Card: `https://ipv6.abhavtech.com/chapter1-getting-started/master-reference-card/`
- ✅ Disclaimer: `https://ipv6.abhavtech.com/appendices/disclaimer/`

### 5.2 Navigation Test

- ✅ Header tabs work (Getting Started, SD-WAN Foundation, etc.)
- ✅ Left sidebar collapsible sections function
- ✅ Right TOC auto-scrolls with page content
- ✅ Search returns relevant results
- ✅ Dark/light mode toggle works

### 5.3 Performance Check

Use [PageSpeed Insights](https://pagespeed.web.dev/):

- Target: **90+ score** (MkDocs Material sites typically score 95-100)

---

## Troubleshooting

### Build Fails with "mkdocs: command not found"

**Solution:** Ensure `requirements.txt` is in repo root and contains:
```
mkdocs>=1.5.0
mkdocs-material>=9.5.0
pymdown-extensions>=10.0
```

### Build Fails with "Config file 'mkdocs.yml' does not exist"

**Solution:** Verify `mkdocs.yml` is in repo root (not in `docs/` folder).

### Broken Links After Deployment

**Solution:** Run local validation before pushing:
```bash
mkdocs build --strict
```

Fix any warnings or errors before committing.

### Custom Domain Shows SSL Error

**Solution:** Wait 10-15 minutes for SSL certificate provisioning. Clear browser cache and retry.

### Site Renders Without Custom CSS

**Solution:** Verify `docs/stylesheets/extra.css` exists and is referenced in `mkdocs.yml`:
```yaml
extra_css:
  - stylesheets/extra.css
```

---

## Rollback Procedure

If a deployment breaks the site:

1. Go to Cloudflare Pages dashboard
2. Click **Deployments**
3. Find last working deployment
4. Click **⋯** → **Rollback to this deployment**
5. Site reverts to previous version instantly

---

## Advanced Configuration

### Build Caching

Cloudflare Pages caches `pip install` dependencies between builds for faster deployments.

### Branch Deployments

Deploy different branches to different URLs:

- `main` → `ipv6.abhavtech.com`
- `staging` → `staging.ipv6-migration-docs.pages.dev`
- Feature branches → Preview URLs

Configure in **Settings** → **Builds & deployments** → **Branch deployments**.

### Environment Variables

Add secrets or API keys:

1. Go to **Settings** → **Environment variables**
2. Add variables (e.g., `ANALYTICS_ID` for Google Analytics)
3. Reference in `mkdocs.yml` if needed

---

## Monitoring and Analytics

### Cloudflare Web Analytics (Privacy-Friendly)

1. Go to **Analytics & Logs** → **Web Analytics**
2. Click **Add a site**
3. Enter domain: `ipv6.abhavtech.com`
4. Copy JavaScript snippet
5. Add to `mkdocs.yml`:
   ```yaml
   extra:
     analytics:
       provider: custom
       property: CF_BEACON_TOKEN
   ```

### Google Analytics 4 (Optional)

Add GA4 tracking ID to `mkdocs.yml`:
```yaml
extra:
  analytics:
    provider: google
    property: G-XXXXXXXXXX
```

---

## Security Best Practices

- ✅ Enable **HTTPS only** (Cloudflare default)
- ✅ Enable **HSTS** (HTTP Strict Transport Security) in Cloudflare SSL/TLS settings
- ✅ Use **Cloudflare WAF** (Web Application Firewall) for DDoS protection
- ✅ Enable **Bot Fight Mode** to block scrapers

---

## Cost

**Cloudflare Pages Free Tier:**

- ✅ Unlimited sites
- ✅ Unlimited requests
- ✅ 500 builds/month
- ✅ 1 concurrent build

**Paid Plan ($20/month):**

- 5,000 builds/month
- 5 concurrent builds
- Advanced analytics

For documentation sites, **free tier is sufficient**.

---

## Support Resources

- **Cloudflare Pages Docs:** [developers.cloudflare.com/pages](https://developers.cloudflare.com/pages)
- **MkDocs Material Docs:** [squidfunk.github.io/mkdocs-material](https://squidfunk.github.io/mkdocs-material)
- **Community Support:** [community.cloudflare.com](https://community.cloudflare.com)

---

## Deployment Checklist

Before going live:

- [ ] Run `mkdocs build --strict` locally (zero warnings)
- [ ] Test all navigation links
- [ ] Verify custom CSS loads correctly
- [ ] Test dark/light mode toggle
- [ ] Check mobile responsiveness
- [ ] Validate SSL certificate on custom domain
- [ ] Test search functionality
- [ ] Review disclaimer and footer links
- [ ] Verify AI-assisted badge displays correctly

---

**Deployment complete!** Your IPv6 Migration Guide is now live at `https://ipv6.abhavtech.com/`

For updates, simply push to GitHub — Cloudflare Pages handles the rest automatically.
