AbhavTech — Enterprise Technical Documentation Portfolio
> **The Practitioner's Guide to Enterprise Migrations & Cross-Domain Integration**
![Site](https://img.shields.io/badge/Portfolio-abhavtech.com-1B6CA0?style=flat-square&logo=cloudflare)
![Built with MkDocs](https://img.shields.io/badge/Built%20with-MkDocs%20Material-2E8BC0?style=flat-square)
![Deployed on](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Pages-F38020?style=flat-square&logo=cloudflare)
![AI Assisted](https://img.shields.io/badge/AI%20Assisted-Claude%20%7C%20Anthropic-4AADE1?style=flat-square)
---
About
AbhavTech is a professional technical documentation portfolio built and maintained by Rajmohan M — Senior Network & AI Solution Architect, CCIE Collaboration #55207, CCDE Specialist.
The portfolio showcases enterprise-grade AI-assisted documentation across networking, security, cloud, and AI/ML domains. Each site is a standalone MkDocs Material documentation project, deployed independently to Cloudflare Pages from this monorepo.
This repository is a fictional showcase — the documentation uses realistic enterprise deployment scenarios to demonstrate comprehensive technical writing and AI-assisted documentation capabilities.
---
Live Documentation Sites
Subdomain	Topic	Description
sdwan.abhavtech.com	Cisco Catalyst SD-WAN	End-to-end enterprise SD-WAN: design, deployment, operations, automation
sdaccess.abhavtech.com	Cisco SD-Access	Campus fabric design, ISE integration, policy, migration
cucm.abhavtech.com	CUCM → Webex	Avaya-to-Webex CC migration runbooks and CUCM integration
uccx.abhavtech.com	UCCX → Webex	Contact centre migration from UCCX to Webex CC
wifi7.abhavtech.com	Wi-Fi 7	Enterprise wireless design and deployment
ipv6.abhavtech.com	IPv6	Enterprise IPv6 adoption and dual-stack migration
automation.abhavtech.com	Network Automation	Python, Ansible, Terraform, REST APIs for network operations
cloud.abhavtech.com	Cloud Integration	Hybrid cloud connectivity and enterprise cloud onramp
cybersecurity.abhavtech.com	Cybersecurity	Zero Trust, SASE, threat detection, compliance
edgeai.abhavtech.com	Edge AI	AI inferencing at the network edge — design and deployment
ai-network-design.abhavtech.com	AI Network Design	Network infrastructure sizing for AI workloads (Impact Score model)
ai-observability.abhavtech.com	AI Observability	Observability design for AI/ML pipelines and inference infrastructure
greenfield.abhavtech.com	Greenfield Design	Greenfield enterprise campus and DC design patterns
knowledge.abhavtech.com	Knowledge Base	Cross-domain reference articles and technical insights
---
Repository Structure
```
abhavtech/                          # Monorepo root
│
├── index.html                      # Hub homepage (abhavtech.com)
├── articles/                       # Technical Insights HTML articles
│   ├── article.css                 # Shared article stylesheet
│   ├── avaya-webex-runbooks.html
│   ├── sdwan-catalyst-docs-at-scale.html
│   ├── pentest-forensics-reports.html
│   ├── llms-technical-writing.html
│   ├── sizing-networks-for-ai.html
│   ├── edge-ai-fusion.html
│   └── ai-observability-design.html
│
├── sdwan/                          # SD-WAN MkDocs project
│   ├── mkdocs.yml
│   ├── requirements.txt
│   └── docs/
│       ├── index.md
│       └── ...
│
├── sdaccess/                       # SD-Access MkDocs project
├── cucm-webex/                     # CUCM/Webex MkDocs project
├── uccx-webex/                     # UCCX/Webex MkDocs project
├── wifi7/                          # Wi-Fi 7 MkDocs project
├── ipv6/                           # IPv6 MkDocs project
├── automation/                     # Automation MkDocs project
├── cloud/                          # Cloud MkDocs project
├── cybersecurity/                  # Cybersecurity MkDocs project
├── edgeai/                         # Edge AI MkDocs project
├── ai-network-design/              # AI Network Design MkDocs project
├── ai-observability/               # AI Observability MkDocs project
├── greenfield/                     # Greenfield MkDocs project
└── knowledge/                      # Knowledge Base MkDocs project
```
Each MkDocs project is an independent Cloudflare Pages deployment pointed at its subdirectory.
---
Tech Stack
Layer	Technology
Documentation framework	MkDocs 1.6.1 + Material theme
Markdown extensions	PyMdown Extensions
Deployment	Cloudflare Pages (per-project CI/CD)
DNS & Security	Cloudflare (DNS, WAF, DNSSEC)
Domain registrar	Hostinger
Python	3.11
AI assistance	Claude (Anthropic)
---
Cloudflare Pages — Build Configuration
Each subdomain project uses identical build settings:
Setting	Value
Build command	`pip install -r requirements.txt && mkdocs build`
Output directory	`site`
Root directory	`<project-folder>/` (e.g., `sdwan/`)
Python version	`3.11`
Build watch paths are scoped per project to prevent simultaneous builds across all sites on every push.
---
MkDocs Framework
A reusable MkDocs Material configuration framework underpins all sites in this portfolio. It encodes hard-won production decisions around navigation, TOC scrolling, diagram rendering, and Cloudflare deployment.
Key framework decisions (see `mkdocs-framework-template-v2.yml`):
`primary: custom` — gradient header via `extra.css` (not a flat Material colour)
`navigation.instant` enabled — required for `toc.follow` scroll tracking
`toc_depth: 2` — H2 only in right sidebar TOC
No `navigation.sections`, `navigation.expand`, or `toc.integrate`
No custom `position`/`overflow`/`height` CSS on `.md-sidebar--secondary` — breaks `toc.follow`
`README.md` as chapter gateway pages; `index.md` reserved for root landing page only
One H1 per file, no emoji in headings, no UTF-8 BOM
---
AI Network Design Workbook
The AI Network Design site (`ai-network-design.abhavtech.com`) is built around the Impact Score model developed by Scott Andersen in Infrastructure for AI Network Design and Architecture (BPB Publications, 2025).
> Andersen, S. (2025). *Infrastructure for AI Network Design and Architecture*. BPB Publications.  
> ISBN available at: [amzn.in/d/04OAa7V5](https://amzn.in/d/04OAa7V5)
The Impact Score model, scoring rubric, IS verdict bands, and workbook structure are attributed to Scott Andersen. AbhavTech's contribution is the interactive workbook implementation, enterprise scenario adaptation, and documentation design.
---
Author
Rajmohan M  
Senior Network & AI Solution Architect  
CCIE Collaboration #55207 | CCDE Specialist  
abhavtech.com · LinkedIn · GitHub
---
AI-Assisted Documentation Disclosure
All documentation in this portfolio was created with AI assistance (Claude, Anthropic) as a showcase of AI-assisted enterprise technical writing. Content is illustrative and based on realistic enterprise deployment patterns. It is provided for knowledge-sharing and portfolio purposes — not as production-ready configuration to be applied directly to live environments.
---
© 2025–2026 AbhavTech | Part of the AbhavTech technical documentation portfolio
