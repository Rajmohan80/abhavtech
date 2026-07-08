# Enterprise Network Automation Framework Documentation

**MkDocs Material site for Infrastructure-as-Code automation covering SD-Access, SD-WAN, ISE, Webex, and Zero Trust**

---

## Quick Start

### Local Development

```bash
# Start local development server
./serve.sh

# Access documentation at http://127.0.0.1:8000
```

### Build Validation

```bash
# Run strict build validation
./validate.sh

# Should output: ✅ BUILD SUCCESSFUL
```

---

## Project Structure

```
automation-framework-mkdocs/
├── mkdocs.yml              # MkDocs configuration
├── requirements.txt        # Python dependencies
├── serve.sh                # Local dev server script
├── validate.sh             # Build validation script
├── docs/                   # Documentation content
│   ├── index.md            # Landing page
│   ├── chapter*/           # 13 chapters
│   ├── appendices/         # AI disclaimer, revision history
│   └── stylesheets/        # Custom CSS
├── CONVERSION_REPORT.md    # Detailed conversion documentation
├── DEPLOYMENT.md           # Cloudflare Pages deployment guide
└── README.md               # This file
```

---

## Documentation Chapters

1. **Executive Summary** - Business case, scope, toolchain
2. **Automation Architecture** - Hub-spoke model, tool responsibilities
3. **Development Environment** - VS Code, Python, Terraform, Ansible setup
4. **Secrets & Security** - HashiCorp Vault deployment
5. **Git Workflow** - Branching strategy, change approval
6. **Terraform Provisioning** - CML, DNAC, ISE, SD-WAN, Webex
7. **Zero Touch Provisioning** - Day-0 vs Day-N, PnP flows
8. **Ansible Configuration** - IS-IS, LISP, BGP, 802.1X playbooks
9. **Cloud Integrations** - Vertex AI, Azure AD
10. **Validation & Testing** - Automated validation playbooks
11. **Production Deployment** - Runbooks, checklists
12. **Operational Automation** - Day-2 operations, compliance
13. **DevNet Resources** - Terraform providers, Ansible collections

---

## Technology Stack

| Tool | Purpose |
|------|---------|
| **MkDocs** | Static site generator |
| **Material for MkDocs** | Theme and UI components |
| **Python 3.11+** | Build environment |

---

## Deployment

### Cloudflare Pages (Recommended)

See **[DEPLOYMENT.md](DEPLOYMENT.md)** for complete step-by-step instructions.

**Quick Reference**:

1. Push repository to GitHub
2. Connect to Cloudflare Pages
3. Build command: `pip install -r requirements.txt && mkdocs build`
4. Output directory: `site`
5. Deploy

Site available at: `https://your-project.pages.dev`

### Alternative Platforms

**GitHub Pages**:
```bash
mkdocs gh-deploy --force
```

**Netlify**: Same build settings as Cloudflare Pages

---

## Development Workflow

### Adding Content

1. Edit markdown files in `docs/`
2. Test locally: `./serve.sh`
3. Validate: `./validate.sh`
4. Commit and push

### Updating Navigation

Edit `mkdocs.yml` → `nav:` section

### Customizing Theme

Colors defined in `docs/stylesheets/extra.css`

---

## Build Requirements

- Python 3.8 or higher
- pip (Python package installer)
- Virtual environment (handled by helper scripts)

Dependencies automatically installed by `serve.sh` and `validate.sh`.

---

## Framework Compliance

This project follows **mkdocs-framework-template-v2.yml**:

✅ Custom color palette with gradient header  
✅ `toc_depth: 2` (H2 only in right sidebar)  
✅ `navigation.instant` enabled  
✅ NO `navigation.sections` or `navigation.expand`  
✅ One H1 per file  
✅ Lowercase hyphenated filenames  
✅ README.md as section gateways  

---

## AI-Assisted Documentation

This documentation was developed with Claude (Anthropic) assistance to demonstrate how AI can accelerate creation of comprehensive technical documentation.

See **[Disclaimer](docs/appendices/disclaimer.md)** for complete transparency statement.

---

## Project Information

**Author**: Rajmohan M  
**Company**: AbhavTech Networks  
**Website**: [abhavtech.com](https://abhavtech.com)  
**Purpose**: Professional portfolio demonstrating network automation expertise  
**License**: CC BY 4.0

---

## Support

- **Conversion Report**: See [CONVERSION_REPORT.md](CONVERSION_REPORT.md)
- **Deployment Guide**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Issues**: GitHub Issues (if repository is public)
- **Contact**: [LinkedIn](https://linkedin.com/in/raj-mohan-abhavtech)

---

## Version

**Documentation Version**: 2.0  
**Framework Version**: mkdocs-framework-template-v2.1  
**Last Updated**: March 31, 2026  
**Build Status**: ✅ PASSED (mkdocs build --strict)
