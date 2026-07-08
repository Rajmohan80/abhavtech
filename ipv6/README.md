# AbhavTech IPv6 Migration Guide

Comprehensive enterprise IPv6 migration documentation covering SD-WAN, SD-Access, multi-cloud, unified communications, observability, and security deployment across 19 global sites.

## Project Overview

This MkDocs Material site documents a complete IPv6 migration for a global enterprise network, providing detailed implementation guides across seven comprehensive chapters:

1. **Getting Started** — IPv6 planning, addressing, and foundation setup
2. **SD-WAN Foundation** — Cisco SD-WAN underlay deployment (5 hubs, 14 branches)
3. **SD-Access Overlay** — Campus fabric with LISP/VXLAN and ISE TrustSec
4. **Multi-Cloud Integration** — Azure/GCP connectivity and Vertex AI integration
5. **Collaboration & UC** — Webex Calling and Contact Center deployment
6. **Observability** — ThousandEyes, Splunk, AppDynamics monitoring stack
7. **Security, Edge & AI** — SASE, zero-trust, WiFi 7, AI-driven optimization

## Quick Start

### Local Development

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Serve locally:**
   ```bash
   mkdocs serve
   ```
   Site will be available at `http://localhost:8000`

3. **Build static site:**
   ```bash
   mkdocs build
   ```
   Output will be in `site/` directory

### Build Validation

Run strict validation before deployment:

```bash
mkdocs build --strict
```

This catches broken links, missing files, and navigation errors. **Zero warnings required** for production deployment.

## Project Structure

```
ipv6-migration/
├── mkdocs.yml                    # Site configuration
├── requirements.txt              # Python dependencies
├── .gitignore                    # Git exclusions
├── README.md                     # This file
├── DEPLOYMENT.md                 # Cloudflare Pages deployment guide
├── CONVERSION_REPORT.md          # Conversion details and statistics
├── docs/
│   ├── index.md                  # Homepage (landing page)
│   ├── stylesheets/
│   │   └── extra.css             # Custom CSS (gradient header, colors)
│   ├── chapter1-getting-started/
│   │   ├── README.md             # Chapter overview
│   │   ├── master-reference-card.md
│   │   └── week1-planning-addressing-tooling.md
│   ├── chapter2-sdwan-foundation/
│   │   ├── README.md
│   │   ├── week2-mumbai-hub-deployment.md
│   │   ├── week3-remaining-hubs-deployment.md
│   │   ├── week4-5-branch-sites-deployment.md
│   │   ├── phase1b-sdwan-advanced-topics.md
│   │   └── phase1-addendum-nat64-troubleshooting.md
│   ├── chapter3-sdaccess-overlay/
│   ├── chapter4-multicloud-integration/
│   ├── chapter5-collaboration-uc/
│   ├── chapter6-observability/
│   ├── chapter7-security-edge-ai/
│   └── appendices/
│       ├── disclaimer.md
│       ├── glossary.md
│       └── references.md
└── site/                         # Generated output (ignored by Git)
```

## Technology Stack

- **MkDocs Material 9.5+** — Documentation framework
- **Python 3.11+** — Build environment
- **Cloudflare Pages** — Deployment platform (recommended)

## Features

- **Custom Design** — Gradient header (sky blue), wider layout, two-tone tab bar
- **AI-Assisted Disclaimer** — Transparently marked throughout
- **Tabbed Navigation** — 8 main sections in header tabs
- **Collapsible Sidebar** — Section-based navigation
- **Right TOC** — Auto-scroll tracking with `toc.follow`
- **Dark/Light Mode** — Toggle in header
- **Search** — Full-text search with highlighting
- **Mobile Responsive** — Optimized for all devices

## Key Conventions

### Markdown Rules

- **One H1 per file** — Page title only
- **No emoji in headings** — Breaks anchor generation
- **Lowercase filenames** — Hyphenated (e.g., `week2-mumbai-hub-deployment.md`)
- **README.md as gateways** — Chapter overviews, not individual doc links on homepage

### Navigation Pattern

- **Homepage (index.md)** → Links to chapter README.md files only
- **Chapter README** → Links to individual documents within chapter
- This preserves navigation context and sidebar state

## Deployment

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for step-by-step Cloudflare Pages deployment instructions.

## Conversion Details

See **[CONVERSION_REPORT.md](CONVERSION_REPORT.md)** for:
- Source file analysis
- Markdown violations fixed
- Chapter organization decisions
- Build validation results

## About AbhavTech

This documentation is part of the **[AbhavTech](https://abhavtech.com)** technical portfolio, demonstrating how AI can generate comprehensive, enterprise-grade migration and deployment guides. All content is transparently marked as AI-assisted and developed with Claude (Anthropic).

### Portfolio Sites

- **[abhavtech.com](https://abhavtech.com)** — Main portfolio site
- **[knowledge.abhavtech.com](https://knowledge.abhavtech.com)** — Webex Contact Center deployment guide
- **[cybersecurity.abhavtech.com](https://cybersecurity.abhavtech.com)** — Cybersecurity frameworks
- **[sdwan.abhavtech.com](https://sdwan.abhavtech.com)** — Cisco Catalyst SD-WAN guide
- **[ipv6.abhavtech.com](https://ipv6.abhavtech.com)** — This site (pending deployment)

## License

This documentation is provided for educational and reference purposes. See [Disclaimer](docs/appendices/disclaimer.md) for full terms.

## Contact

**Raj Mohan**  
Principal Consultant — UC/CC Solutions  
[LinkedIn](https://linkedin.com/in/rajmohan-uc) | [GitHub](https://github.com/rajmohan-uc) | [abhavtech.com](https://abhavtech.com)

---

*Documentation Version: 1.0*  
*Last Updated: March 2026*  
*Framework: MkDocs Material v2.1*
