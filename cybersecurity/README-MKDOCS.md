# Cybersecurity, Forensics & Penetration Testing

**AbhavTech Technical Documentation Portfolio**  
Site: [cybersecurity.abhavtech.com](https://cybersecurity.abhavtech.com)

Enterprise cybersecurity framework, network forensics procedures, and penetration testing
methodologies for Cisco-centric AI-driven infrastructure.

## Local Development

```bash
pip install -r requirements.txt
mkdocs serve
```

## Build & Validate

```bash
mkdocs build --strict
```

## Deploy

Push to GitHub — Cloudflare Pages builds automatically.

**Build command:** `pip install -r requirements.txt && mkdocs build`  
**Output directory:** `site`

## Structure

```
docs/
├── index.md                        # Landing page
├── stylesheets/extra.css           # Custom CSS
├── cybersecurity-framework/        # NIST, CIS, MITRE, ISO, SOC
├── network-forensics/              # SD-WAN, DNAC, Webex, FTD, Zero Trust, AI
└── penetration-testing/            # Methodology, test cases, purple team
appendices/                         # Reference cards, glossary, tools
```

---
*AI-Assisted Documentation | AbhavTech | Author: Rajmohan M*
