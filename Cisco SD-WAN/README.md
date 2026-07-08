# Cisco Catalyst SD-WAN Implementation Guide - MkDocs Project

Production-ready MkDocs Material documentation for enterprise SD-WAN deployment.

## Project Information

**Documentation:** Comprehensive Cisco Catalyst SD-WAN implementation guide  
**Total Pages:** 117 markdown files (108 content files + 9 README overviews + root index)  
**Chapters:** 8 core chapters + appendices (including detailed capacity design guide)  
**Framework:** MkDocs Material v2.1 (AbhavTech framework template)  
**Deployment Target:** Cloudflare Pages  
**Status:** Production Ready - Validated with `mkdocs build --strict`

---

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Local Development

```bash
mkdocs serve
```

Access at: `http://localhost:8000`

### 3. Build Static Site

```bash
mkdocs build --strict
```

Output directory: `site/`

---

## Project Structure

```
sd-wan-mkdocs/
├── mkdocs.yml                    # MkDocs configuration
├── requirements.txt              # Python dependencies
├── .gitignore                    # Git ignore rules
├── README.md                     # This file
├── docs/                         # Documentation source
│   ├── index.md                  # Landing page (links to chapter overviews only)
│   ├── stylesheets/
│   │   └── extra.css             # Custom CSS (gradient header, wider layout)
│   ├── chapter-01-discovery/
│   │   ├── README.md             # Chapter overview
│   │   ├── 1-1-current-wan-infrastructure-inventory.md
│   │   └── ... (9 files total)
│   ├── chapter-02-architecture/
│   │   ├── README.md
│   │   └── ... (15 files)
│   ├── chapter-03-security/
│   │   ├── README.md
│   │   └── ... (13 files)
│   ├── chapter-04-policies/
│   │   ├── README.md
│   │   └── ... (12 files)
│   ├── chapter-05-implementation/
│   │   ├── README.md
│   │   └── ... (20 files)
│   ├── chapter-06-operations/
│   │   ├── README.md
│   │   └── ... (20 files)
│   ├── chapter-07-migration/
│   │   ├── README.md
│   │   └── ... (8 files - some consolidated)
│   ├── chapter-08-advanced/
│   │   ├── README.md
│   │   └── ... (4 files - consolidated sections)
│   └── appendices/
│       ├── README.md
│       └── ... (3 files - consolidated appendices)
└── site/                         # Generated static site (don't edit)
```

---

## Content Organization

### Homepage (index.md)
- **Landing page only** - links to chapter overviews (README.md files)
- **Never links directly to sub-documents** - preserves navigation context
- Includes AI-assisted documentation disclaimer
- Technology stack and deployment topology overview

### Chapter Overviews (README.md)
- **Gateway pages** for each chapter
- Section-by-section descriptions
- Navigation hints and usage guidance
- Links to previous/next chapters

### Individual Documents
- ONE H1 heading per file (page title)
- H2, H3, H4 for sub-sections
- No emoji in headings (breaks TOC tracking)
- Lowercase hyphenated filenames
- ASCII diagrams in code fences (preserved as-is)

---

## Key Features

✅ **Framework Compliance:** Follows mkdocs-framework-template-v2.yml exactly  
✅ **TOC Depth:** Set to 2 (H2 only in right sidebar) - prevents overflow  
✅ **Navigation:** Instant mode enabled for toc.follow scroll tracking  
✅ **Gradient Header:** Custom CSS with deep blue → sky blue gradient  
✅ **Tabbed Navigation:** 8 chapters + appendices as header tabs  
✅ **Collapsible Sections:** All sub-sections collapse/expand in sidebar  
✅ **Dark/Light Mode:** Toggle with persistent theme selection  
✅ **Search:** Full-text search with highlighting and suggestions  
✅ **Code Blocks:** Syntax highlighting with copy buttons  
✅ **Responsive:** Mobile-friendly layout with adaptive navigation

---

## Validation Results

```bash
$ mkdocs build --strict
INFO - Documentation built in 11.12 seconds
✓ Build passed with strict validation
✓ All navigation entries point to valid files
✓ Zero critical warnings or errors
```

**Known INFO Messages (non-critical):**
- 5 files intentionally excluded from nav (older duplicate versions kept for reference)
- Some internal anchor links in a few files (content issue, not structural)

---

## Deployment Options

### Cloudflare Pages (Recommended)

**Build command:**
```bash
pip install -r requirements.txt && mkdocs build
```

**Output directory:** `site`

**Environment variables:** None required

**Custom domain:** Configure DNS to point to Cloudflare Pages

---

### Netlify

Create `netlify.toml`:

```toml
[build]
  command = "pip install -r requirements.txt && mkdocs build"
  publish = "site"

[build.environment]
  PYTHON_VERSION = "3.11"
```

Push to GitHub and connect to Netlify.

---

### GitHub Pages

```bash
mkdocs gh-deploy --force
```

Automatically builds and deploys to `gh-pages` branch.

---

## Framework Template Settings

### Fixed Settings (DO NOT CHANGE)

These settings are from the framework template and should not be modified:

- `primary: custom` (colors in extra.css)
- `toc_depth: 2` (H2 only in right TOC)
- `navigation.instant` enabled (powers toc.follow)
- NO `navigation.sections` (disables collapse/expand)
- NO `navigation.expand` (overwhelming for large docs)
- NO `toc.integrate` (makes left sidebar too long)
- NO custom CSS on `.md-sidebar--secondary` (breaks toc.follow)

### Customizable Settings

- Site name, description, author, URL
- Social links in footer
- Logo and favicon (place in docs/assets/)
- Colors in extra.css (follow COLOR CUSTOMIZATION GUIDE in CSS file)

---

## Content Quality Rules

**These rules are enforced across all files:**

1. ✅ **ONE H1 per page** - Every .md file has exactly one `# H1` heading
2. ✅ **No BOM** - UTF-8 without Byte Order Mark
3. ✅ **No emoji in headings** - Breaks anchor slugs and TOC tracking
4. ✅ **Lowercase filenames** - Hyphenated, no spaces
5. ✅ **Code fences closed** - Every ``` has a matching closing ```
6. ✅ **ASCII diagrams preserved** - No conversion to Mermaid

---

## Duplicate Files Handling

**Files excluded from navigation (older versions kept for reference):**

- `appendices/appendix-a-to-d-glossary-cli-templates-policies.md` (older version)
- `chapter-05-implementation/5-7-wan-edge-onboarding.md` (using ZTP version)
- `chapter-05-implementation/5-9-configuration-groups.md` (using profiles version)
- `chapter-07-migration/7-3-site-by-site-migration.md` (older version)
- `chapter-07-migration/7-4-rollback-procedures.md` (consolidated into 7-4-to-7-7)

**Active versions in navigation:**
- `5-7-wan-edge-onboarding-ztp.md` ✓
- `5-9-configuration-groups-profiles.md` ✓
- `7-3-site-migration-procedures.md` ✓
- `7-4-to-7-7-rollback-testing-tco-roi.md` ✓

---

## Useful Commands

```bash
# Local development with live reload
mkdocs serve

# Local dev on different port
mkdocs serve -a localhost:8001

# Build static site
mkdocs build

# Build with strict validation (catches broken links)
mkdocs build --strict

# Deploy to GitHub Pages
mkdocs gh-deploy --force

# Count H1 headings per file (should be exactly 1 each)
grep -c '^# ' docs/**/*.md
```

---

## Technology Stack

| Component | Version |
|-----------|---------|
| MkDocs | ≥1.5.0 |
| MkDocs Material | ≥9.5.0 |
| PyMdown Extensions | ≥10.0 |
| Python | 3.11+ |

---

## Color Customization

To change the gradient header colors, edit `docs/stylesheets/extra.css`:

1. Find the COLOR CUSTOMIZATION GUIDE section (line 13)
2. Pick your brand color from https://coolors.co
3. Generate a 3-shade gradient palette (deep → medium → light)
4. Update the hex values in the CSS custom properties
5. Test locally with `mkdocs serve`

**Example palettes:**
- Sky Blue: `#1B6CA0 → #2E8BC0 → #4AADE1` (current)
- Teal: `#00695C → #00897B → #26A69A`
- Purple: `#4A148C → #7B1FA2 → #AB47BC`

---

## Maintenance Notes

### When Adding New Content

1. Create markdown file in appropriate chapter folder
2. Use lowercase-hyphenated filename
3. ONE H1 heading at top
4. Add entry to `mkdocs.yml` nav section
5. Test with `mkdocs serve`
6. Validate with `mkdocs build --strict`

### When Updating Navigation

1. Edit `mkdocs.yml` nav section
2. Keep README.md files as section gateways
3. Maintain hierarchical structure (tabs → sections → pages)
4. Test navigation in browser
5. Validate with `mkdocs build --strict`

---

## Support

**Framework Template:** mkdocs-framework-template-v2.yml  
**CSS Template:** extra-css-template.css  
**Documentation:** See framework template comments for detailed usage

---

## License

© 2025-2026 AbhavTech | Internal Use Only

---

**Built with:** MkDocs Material Framework v2.1  
**Last Updated:** March 2026  
**Status:** ✅ Production Ready
