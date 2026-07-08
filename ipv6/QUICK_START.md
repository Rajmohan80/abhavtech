# Quick Start Guide — IPv6 Migration Documentation

Get your IPv6 migration documentation site running in 5 minutes.

---

## Prerequisites

- **Python 3.9+** installed
- **Git** installed (for deployment)
- **Text editor** (VS Code, Sublime, etc.)

---

## Step 1: Extract and Navigate

```bash
unzip ipv6-migration-mkdocs.zip
cd ipv6-migration/
```

---

## Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

Or with virtual environment (recommended):

```bash
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

---

## Step 3: Start Local Server

### Option A: Using helper script

```bash
./serve.sh
```

### Option B: Direct command

```bash
mkdocs serve
```

Visit **http://localhost:8000** in your browser.

The server has **live reload** — any changes to markdown files automatically refresh the browser.

---

## Step 4: Validate Before Deployment

### Using helper script

```bash
./validate.sh
```

### Direct command

```bash
mkdocs build --strict
```

**Expected output:** `Documentation built in X seconds` with **zero warnings**.

---

## Step 5: Deploy to Cloudflare Pages

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for full instructions.

### Quick Deploy (after GitHub setup)

```bash
./deploy-cloudflare.sh "Initial deployment"
```

This will:
1. Run validation
2. Commit changes
3. Push to GitHub
4. Trigger Cloudflare Pages build

---

## Common Commands

### Local Development

```bash
./serve.sh              # Start dev server on port 8000
./serve.sh 8001         # Start dev server on custom port
```

### Build Validation

```bash
./validate.sh           # Run strict build validation
mkdocs build            # Build site to site/ directory
mkdocs build --clean    # Clean build (remove old files first)
```

### Deployment

```bash
./deploy-cloudflare.sh "Your commit message"
git push origin main    # Manual push (triggers auto-deploy)
```

---

## Project Structure Overview

```
ipv6-migration/
├── mkdocs.yml           # Site configuration
├── requirements.txt     # Python dependencies
├── docs/                # All markdown content
│   ├── index.md         # Homepage
│   ├── chapter1-getting-started/
│   ├── chapter2-sdwan-foundation/
│   ├── chapter3-sdaccess-overlay/
│   ├── chapter4-multicloud-integration/
│   ├── chapter5-collaboration-uc/
│   ├── chapter6-observability/
│   ├── chapter7-security-edge-ai/
│   └── appendices/
├── serve.sh             # Dev server helper
├── validate.sh          # Build validation helper
└── deploy-cloudflare.sh # Deployment helper
```

---

## Editing Content

### Add New Page

1. Create markdown file in appropriate chapter folder:
   ```bash
   touch docs/chapter2-sdwan-foundation/new-topic.md
   ```

2. Add to navigation in `mkdocs.yml`:
   ```yaml
   - "SD-WAN Foundation":
       - "Chapter Overview": chapter2-sdwan-foundation/README.md
       - "New Topic": chapter2-sdwan-foundation/new-topic.md
   ```

3. Validate changes:
   ```bash
   ./validate.sh
   ```

### Edit Existing Page

1. Open file in editor:
   ```bash
   code docs/chapter1-getting-started/master-reference-card.md
   ```

2. Make changes (remember: **one H1 per file**)

3. Save and check in browser (live reload shows changes instantly)

### Add Images

1. Place images in `docs/assets/`:
   ```bash
   cp ~/Downloads/diagram.png docs/assets/
   ```

2. Reference in markdown:
   ```markdown
   ![Network Topology](../assets/diagram.png)
   ```

---

## Customization

### Change Colors

Edit `docs/stylesheets/extra.css`:

```css
/* Line 26: Primary color (medium variant) */
--md-primary-fg-color: #3C9DD5;    /* Change this hex value */

/* Line 52-53: Gradient header */
.md-header {
  background: linear-gradient(135deg, #1B6CA0 0%, #2E8BC0 35%, #4AADE1 100%);
}
```

### Update Site Information

Edit `mkdocs.yml`:

```yaml
site_name: "Your Site Name"
site_description: "Your description"
site_url: https://your-domain.com
```

---

## Troubleshooting

### Issue: `mkdocs: command not found`

**Solution:** Install dependencies:
```bash
pip install -r requirements.txt
```

### Issue: Build warnings about broken links

**Solution:** Run validation to see details:
```bash
mkdocs build --strict
```

Fix all navigation entries in `mkdocs.yml` to point to existing files.

### Issue: Custom CSS not loading

**Solution:** Verify file path in `mkdocs.yml`:
```yaml
extra_css:
  - stylesheets/extra.css  # Must match actual file location
```

### Issue: Navigation tabs not showing

**Solution:** Ensure top-level nav items don't have files directly:
```yaml
# ❌ Wrong
- "Chapter 1": chapter1/file.md

# ✅ Correct
- "Chapter 1":
    - "Overview": chapter1/README.md
    - "Topic": chapter1/file.md
```

---

## Helper Scripts Reference

### serve.sh

```bash
./serve.sh       # Start on port 8000
./serve.sh 8001  # Start on custom port
```

### validate.sh

```bash
./validate.sh    # Run strict validation
echo $?          # Check exit code (0 = success, 1 = failure)
```

### deploy-cloudflare.sh

```bash
./deploy-cloudflare.sh "commit message"   # Validate, commit, push
```

---

## What's Next?

1. **Test locally** — Browse all chapters, verify navigation
2. **Customize branding** — Update colors, add logo/favicon
3. **Deploy to Cloudflare Pages** — Follow DEPLOYMENT.md
4. **Set up custom domain** — Point ipv6.abhavtech.com to Pages
5. **Enable analytics** — Add Cloudflare Web Analytics or GA4

---

## Documentation Links

- **Full Documentation:** [README.md](README.md)
- **Deployment Guide:** [DEPLOYMENT.md](DEPLOYMENT.md)
- **Conversion Report:** [CONVERSION_REPORT.md](CONVERSION_REPORT.md)
- **MkDocs Material Docs:** https://squidfunk.github.io/mkdocs-material

---

## Support

- **AbhavTech:** https://abhavtech.com
- **MkDocs Material:** https://squidfunk.github.io/mkdocs-material
- **Cloudflare Pages:** https://developers.cloudflare.com/pages

---

**Ready to go!** 🚀

Run `./serve.sh` and visit http://localhost:8000
