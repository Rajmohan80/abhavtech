# Deployment Guide - CUCM to Webex Migration Documentation

This guide provides step-by-step instructions for deploying the MkDocs documentation site to Cloudflare Pages or other hosting platforms.

---

## Prerequisites

- GitHub account
- Cloudflare account (for Cloudflare Pages deployment)
- Domain registered at Hostinger (or any registrar)
- Git installed locally

---

## Deployment Path: GitHub → Cloudflare Pages (Recommended)

### Step 1: Push to GitHub

1. **Initialize Git repository** (if not already done):
   ```bash
   cd cucm-webex-migration
   git init
   git add .
   git commit -m "Initial commit - CUCM to Webex migration docs"
   ```

2. **Create GitHub repository**:
   - Go to https://github.com/new
   - Repository name: `cucm-webex-migration`
   - Visibility: Public or Private (your choice)
   - **DO NOT** initialize with README (you already have one)

3. **Push to GitHub**:
   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/cucm-webex-migration.git
   git branch -M main
   git push -u origin main
   ```

### Step 2: Deploy to Cloudflare Pages

1. **Login to Cloudflare Dashboard**:
   - Go to https://dash.cloudflare.com
   - Navigate to **Workers & Pages**

2. **Create Pages Project**:
   - Click **Create application** → **Pages** → **Connect to Git**
   - Select your GitHub account and authorize Cloudflare
   - Select the `cucm-webex-migration` repository

3. **Configure Build Settings**:
   ```
   Framework preset:     None
   Build command:        pip install -r requirements.txt && mkdocs build
   Build output dir:     site
   Root directory:       /
   ```

4. **Environment Variables**:
   ```
   PYTHON_VERSION = 3.11
   ```

5. **Deploy**:
   - Click **Save and Deploy**
   - Wait for build to complete (~2-3 minutes)
   - Your site will be available at: `https://cucm-webex-migration.pages.dev`

### Step 3: Configure Custom Domain

1. **In Cloudflare Pages project**:
   - Go to **Custom domains** tab
   - Click **Set up a custom domain**

2. **Add your domain**:
   ```
   abhavtech.com
   ```

3. **DNS Configuration**:
   
   **Option A: If domain is on Cloudflare**:
   - Cloudflare automatically creates CNAME record
   - Instant activation

   **Option B: If domain is on Hostinger**:
   - Login to Hostinger DNS management
   - Update DNS records:
     ```
     Type:  CNAME
     Name:  @ (or abhavtech.com)
     Value: cucm-webex-migration.pages.dev
     TTL:   Auto
     ```
   - Wait for DNS propagation (up to 24 hours, typically <1 hour)

4. **SSL/TLS**:
   - Cloudflare automatically provisions SSL certificate
   - Force HTTPS in Cloudflare Pages settings

### Step 4: Verify Deployment

1. **Test the site**:
   ```
   https://abhavtech.com
   ```

2. **Check navigation**:
   - Verify all chapters load
   - Test internal links
   - Check search functionality
   - Test mobile responsiveness

3. **Validate build**:
   - Check Cloudflare Pages build logs for warnings
   - Review Analytics for traffic

---

## Continuous Deployment

### Automatic Updates

Every push to the `main` branch triggers automatic rebuild and deployment:

```bash
# Make changes to documentation
git add .
git commit -m "Update Chapter 5 DNS configuration"
git push origin main

# Cloudflare Pages automatically rebuilds (2-3 minutes)
```

### Branch Previews

Cloudflare Pages creates preview URLs for pull requests:
- Create feature branch
- Push changes
- Open pull request on GitHub
- Cloudflare generates preview URL: `https://abc123.cucm-webex-migration.pages.dev`

---

## Alternative Deployment: Netlify

### Via netlify.toml (Included)

1. **Login to Netlify**: https://app.netlify.com

2. **New site from Git**:
   - Click **Add new site** → **Import an existing project**
   - Connect to GitHub
   - Select `cucm-webex-migration` repository

3. **Build settings** (auto-detected from netlify.toml):
   ```
   Build command:   pip install -r requirements.txt && mkdocs build
   Publish dir:     site
   ```

4. **Deploy**:
   - Click **Deploy site**
   - Site available at: `https://random-name-12345.netlify.app`

5. **Custom domain**:
   - Go to **Domain settings**
   - Add custom domain: `abhavtech.com`
   - Update DNS at Hostinger (same as Cloudflare)

---

## Alternative Deployment: GitHub Pages

### One-Command Deployment

```bash
mkdocs gh-deploy --force
```

This:
- Builds the site
- Creates/updates `gh-pages` branch
- Pushes to GitHub
- Site available at: `https://YOUR-USERNAME.github.io/cucm-webex-migration/`

### Custom Domain (GitHub Pages)

1. **In repository settings**:
   - Go to **Settings** → **Pages**
   - Custom domain: `abhavtech.com`

2. **DNS at Hostinger**:
   ```
   Type:  CNAME
   Name:  abhavtech.com
   Value: YOUR-USERNAME.github.io
   ```

3. **HTTPS**:
   - Enable **Enforce HTTPS** in GitHub Pages settings

---

## DNS Configuration Reference

### Cloudflare Pages

**If domain is on Cloudflare** (Recommended):
```
Type:  CNAME
Name:  abhavtech.com
Value: cucm-webex-migration.pages.dev
Proxy: Enabled (orange cloud)
```

**If domain is on Hostinger**:
```
Type:  CNAME
Name:  @ or abhavtech.com
Value: cucm-webex-migration.pages.dev
TTL:   Auto
```

### Netlify

```
Type:  CNAME
Name:  abhavtech.com
Value: random-name-12345.netlify.app
```

Or use Netlify nameservers (recommended):
```
dns1.p03.nsone.net
dns2.p03.nsone.net
dns3.p03.nsone.net
dns4.p03.nsone.net
```

---

## Hostinger Hosting Cancellation

Once deployed to Cloudflare Pages/Netlify:

1. **Retain domain registration** at Hostinger
2. **Cancel web hosting plan** (no longer needed)
3. **Keep DNS management** (unless moving to Cloudflare DNS)

**Cost Savings**:
- Web hosting: ~$3-10/month → $0
- DNS: Free (Hostinger or Cloudflare)
- CDN: Free (Cloudflare Pages/Netlify)
- SSL: Free (automatic)

---

## Monitoring & Analytics

### Cloudflare Pages Analytics

- **Built-in analytics**: Page views, unique visitors, bandwidth
- **Real User Monitoring (RUM)**: Core Web Vitals
- **No JavaScript required**: Server-side analytics

### Google Analytics (Optional)

Add to `mkdocs.yml`:
```yaml
extra:
  analytics:
    provider: google
    property: G-XXXXXXXXXX
```

### Search Console (Optional)

- Verify domain ownership
- Monitor search traffic
- Submit sitemap: `https://abhavtech.com/sitemap.xml`

---

## Troubleshooting

### Build Fails: "Module not found"

**Fix**: Verify `requirements.txt` includes all dependencies
```
mkdocs>=1.5.0
mkdocs-material>=9.5.0
pymdown-extensions>=10.0
```

### Build Fails: "Navigation item not found"

**Fix**: Run strict build locally to identify broken links
```bash
mkdocs build --strict
```

### DNS Not Resolving

**Fix**: Check DNS propagation
```bash
dig abhavtech.com
nslookup abhavtech.com
```

Wait up to 24 hours for full propagation.

### HTTPS Not Working

**Fix**: 
- Cloudflare: Ensure SSL mode is "Full" or "Full (strict)"
- Netlify: Enable "Force HTTPS" in domain settings
- GitHub Pages: Enable "Enforce HTTPS" in repository settings

---

## Post-Deployment Checklist

- [ ] Site loads at custom domain (https://abhavtech.com)
- [ ] HTTPS enabled and working
- [ ] All navigation links functional
- [ ] Search working
- [ ] Mobile responsive
- [ ] Dark/light mode toggle working
- [ ] Gradient header rendering correctly
- [ ] Analytics configured (if desired)
- [ ] DNS propagated globally
- [ ] Build logs clean (no errors)
- [ ] Hostinger web hosting cancelled (domain retained)

---

## Maintenance

### Regular Updates

**Weekly**:
- Review build logs
- Check for broken links
- Monitor analytics

**Monthly**:
- Update dependencies: `pip install --upgrade -r requirements.txt`
- Review Material for MkDocs changelog
- Test search functionality

**Quarterly**:
- Update reference links in documentation
- Review compliance requirements
- Refresh templates and examples

---

## Support

**Cloudflare Pages**: https://developers.cloudflare.com/pages/  
**Netlify**: https://docs.netlify.com/  
**MkDocs**: https://www.mkdocs.org/  
**Material for MkDocs**: https://squidfunk.github.io/mkdocs-material/

---

*Deployment guide for AbhavTech CUCM to Webex Migration Documentation*
