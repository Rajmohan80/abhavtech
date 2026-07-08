# Avaya to Webex CC Migration — MkDocs Project

## Quick Start

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Local preview (live reload)
mkdocs serve

# 3. Build static site
mkdocs build
```

Site will be at `http://127.0.0.1:8000`

## Deploy to GitHub Pages

```bash
mkdocs gh-deploy --force
```

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. In Cloudflare Pages → Create project → Connect repo
3. Build settings:
   - Build command: `pip install -r requirements.txt && mkdocs build`
   - Build output directory: `site`
   - Python version: `3.11`

## Project Structure

```
mkdocs-project/
├── mkdocs.yml                  # Main config (nav, theme, extensions)
├── requirements.txt            # Python dependencies
├── .gitignore
├── README-MKDOCS.md            # This file
└── docs/
    ├── index.md                # Homepage
    ├── disclaimer.md
    ├── contact.md
    ├── project-summary.md
    ├── stylesheets/extra.css   # Custom branding
    ├── chapter1-discovery/     # 9 files
    ├── chapter2-design/        # 16 files + acd-routing/ + ivr-flows/
    ├── chapter3-network-security/
    ├── chapter4-implementation/
    ├── chapter5-operations/
    ├── chapter6-migration-enablement/
    ├── chapter7-integration/
    └── appendix/
```

## Customization Checklist

- [ ] Update `repo_url` in mkdocs.yml with your actual GitHub repo
- [ ] Update LinkedIn/GitHub links in `extra.social`
- [ ] Update `site_url` if deploying to a different path
- [ ] Replace placeholder LinkedIn/GitHub URLs in contact.md
