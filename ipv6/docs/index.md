# AbhavTech Enterprise IPv6 Migration Guide

<span class="ai-badge">AI-Assisted Documentation</span>

---

## Complete Dual-Stack Migration: From Planning to Production

This guide documents a complete enterprise IPv6 dual-stack deployment across **19 global sites** — 2 HQ campuses, 4 regional hubs, and 13 branch sites — spanning APAC, EMEA, and Americas. The migration is structured as six sequential phases over 26 weeks, with each phase building on the previous.

**Project Scope:**

- **Timeline:** 26 weeks (Weeks 1–26), archetype-based deployment
- **Network Devices:** 708 devices fully dual-stacked
- **End Users:** ~15,150 employees, ~10,000 dual-stack endpoints
- **Technologies:** Cisco SD-WAN, SD-Access, ISE, Catalyst Center (DNAC), Webex Calling/Contact Center, Azure, GCP, ThousandEyes, Splunk, AppDynamics, Cisco FTD, UCS Edge AI
- **Sites:** Mumbai HQ, Chennai HQ, London, New Jersey, Dallas, Frankfurt hubs + 13 branch sites

---

## Full Infrastructure Architecture

The diagram below shows every major technology domain involved in the dual-stack migration. The six phases follow this left-to-right, bottom-up sequence — WAN underlay first, then campus overlay, then cloud, then UC, then observability, then security and Edge AI.

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║              ABHAVTECH — ENTERPRISE IPv6 DUAL-STACK ARCHITECTURE                    ║
║                    19 Sites | ~10,000 Endpoints | 26 Weeks                          ║
╚══════════════════════════════════════════════════════════════════════════════════════╝

┌─────────────────────────── PHASE 1 & 1B: SD-WAN UNDERLAY ──────────────────────────┐
│                                                                                      │
│   MPLS (Tata)          Internet (BT/Verizon)        LTE/5G (Backup)                 │
│   Dual-Stack BGP        Dual-Stack DIA               Fallback                       │
│        │                       │                          │                          │
│   ┌────▼───────────────────────▼──────────────────────────▼────┐                    │
│   │              SD-WAN OVERLAY (vManage 20.15.x)              │                    │
│   │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │                    │
│   │   │MUM-HUB   │  │CHN-HUB   │  │LON-HUB   │  │NJ-HUB    │  │                    │
│   │   │C8500-12X │  │C8500-12X │  │C8500-12X │  │C8500-12X │  │                    │
│   │   │(Site 1)  │  │(Site 2)  │  │(Site 16) │  │(Site 32) │  │                    │
│   │   └────┬─────┘  └────┬─────┘  └──────────┘  └──────────┘  │                    │
│   │        │              │     + DAL-HUB (Site 33)             │                    │
│   │        │              │     + FRA-HUB (Site 17)             │                    │
│   │        └──────────────┴─── 360 BFD sessions (180 v4+180 v6)│                    │
│   │                            13 Branch Sites (ISR4331/1100)   │                    │
│   └────────────────────────────────────────────────────────────┘                    │
└──────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────── PHASE 2 & 2B: SD-ACCESS CAMPUS OVERLAY ─────────────────────┐
│                                                                                      │
│   ┌──────────────── CATALYST CENTER (DNAC) 2.3.7.x ───────────────────────────┐    │
│   │  IPv6 Pool Management | Template Deployment | Assurance | Automation        │    │
│   └────────────────────────────┬──────────────────────────────────────────────┘    │
│                                 │                                                    │
│   ┌─────────────────────────────▼─────────────────────────────────────────────┐    │
│   │                    SD-ACCESS FABRIC (LISP/VXLAN)                           │    │
│   │                                                                             │    │
│   │  ┌─────────────────────────────────────────────────────────────────────┐   │    │
│   │  │  BORDER NODES (MUM-BN-01/02, CHN-BN-01)                            │   │    │
│   │  │  Dual-Stack Locators | BGP Handoff | SD-WAN ↔ Fabric               │   │    │
│   │  └──────────────────────┬──────────────────────────────────────────────┘   │    │
│   │                          │  LISP Instance 8001 (IPv6 EIDs)                 │    │
│   │  ┌───────────────────────▼─────────────────────────────────────────────┐   │    │
│   │  │  EDGE SWITCHES (C9300/C9500)    ANYCAST GATEWAY (SLAAC + DNS RA)    │   │    │
│   │  │  320+ switches dual-stack       IPv6 First-Hop Security              │   │    │
│   │  └──────────────────────┬──────────────────────────────────────────────┘   │    │
│   │                          │                                                  │    │
│   │  ┌────────────────────── │ ──────── WIRELESS ──────────────────────────┐   │    │
│   │  │  WLC 9800 (CAPWAP v6) │  1,220 WiFi 7 APs  │  2,500+ Wireless Clients│  │    │
│   │  └───────────────────────┴──────────────────────────────────────────────┘   │    │
│   │                                                                             │    │
│   │  ┌────── ISE 3.3+ ─────────────────────────────────────────────────────┐   │    │
│   │  │  IPv6 Profiling (Windows/iPhone/Android/IoT/Phone) | SGT | CoA       │   │    │
│   │  └─────────────────────────────────────────────────────────────────────┘   │    │
│   └─────────────────────────────────────────────────────────────────────────────┘    │
│   Endpoints: 7,500+ wired | 2,500+ wireless | 4,500 IP phones | 450 cameras         │
└──────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────── PHASE 3: MULTI-CLOUD IPv6 ─────────────────────────────────┐
│                                                                                      │
│   ┌────── AZURE ────────────────────┐    ┌────── GCP ──────────────────────────┐   │
│   │  ExpressRoute (10 Gbps)          │    │  Cloud Interconnect (10 Gbps)        │   │
│   │  Azure vWAN Hub (Central India)  │    │  Cloud Router (asia-south1)          │   │
│   │  VNet-Corp /48 | VNet-Prod /48   │    │  VPC-Prod-APAC /48                  │   │
│   │  Azure SQL DB (IPv6)             │    │  Vertex AI (IPv6 API)                │   │
│   │  Private Endpoints dual-stack    │    │  GCE VMs dual-stack | GKE Clusters   │   │
│   └──────────────────┬──────────────┘    └────────────────┬────────────────────┘   │
│                       └──────────────┬───────────────────────┘                      │
│                              SD-WAN Cloud OnRamp                                     │
│                         (Direct IPv6 routing, no NAT)                               │
└──────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────── PHASE 4: COLLABORATION & UC IPv6 ────────────────────────────────┐
│                                                                                      │
│   ┌──── WEBEX CALLING ──────────────────────────────────────────────────────────┐  │
│   │  4,500 Cisco IP Phones 8845/8865 (SIP over IPv6 | SLAAC | DNS via RA)       │  │
│   │  CUBE Dual-Stack PSTN Gateway (IPv6 internal ↔ IPv4 PSTN)                   │  │
│   │  QoS DSCP EF for RTP over IPv6 | VN_VOICE dual-stack                        │  │
│   └─────────────────────────────────────────────────────────────────────────────┘  │
│   ┌──── WEBEX CONTACT CENTER ───────────────────────────────────────────────────┐  │
│   │  500 Agent Workstations (dual-stack) | Finesse Desktop IPv6                  │  │
│   │  CTI Integration dual-stack | 93% of calls via IPv6 post-migration           │  │
│   └─────────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────── PHASE 5: OBSERVABILITY IPv6 ───────────────────────────────┐
│                                                                                      │
│  ThousandEyes        Splunk              AppDynamics         NetFlow/IPFIX           │
│  7 Enterprise Agents  3 Indexers          160 Agents          18 Exporters           │
│  IPv6 path tests      Syslog UDP/514      Java/.NET/Machine   UDP/9996               │
│  AAAA monitoring      NetFlow v9/IPFIX    Cognition Engine    50K flows/sec          │
│  Path vis (7 hops)    MLTK anomaly detect BT monitoring IPv6  IPv6 adoption trend    │
│                                                                                      │
│  Catalyst Center Assurance | AI-Powered Capacity Planning | 30-day forecasting      │
└──────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────── PHASE 6: SECURITY, EDGE AI & XDR ────────────────────────────────┐
│                                                                                      │
│   ┌──── CISCO FTD FIREWALLS ──────────────────────────────────────────────────┐    │
│   │  18 FTD units (9 HA pairs): Firepower 4145 + 2130                          │    │
│   │  FMC IPv6 Management | 12 ACPs | 1,200+ IPv6 IPS Signatures (Talos)        │    │
│   │  NAT66 | VPN Dual-Stack | FTD-ISE pxGrid (SXP over IPv6)                   │    │
│   └───────────────────────────────────────────────────────────────────────────┘    │
│   ┌──── ZERO TRUST (TrustSec) ────────────────────────────────────────────────┐    │
│   │  SGT Enforcement IPv4 + IPv6 | Duo MFA IPv6 | ISE CoA IPv6                 │    │
│   │  Inline SGT Tagging | pxGrid IPv6 | Continuous Verification                │    │
│   └───────────────────────────────────────────────────────────────────────────┘    │
│   ┌──── EDGE AI (UCS + NVIDIA) ───────────────────────────────────────────────┐    │
│   │  UCS XE9305 Chassis (Mumbai + Chennai) | 8x NVIDIA L4 GPUs (24GB)          │    │
│   │  450 Cameras dual-stack (RTSP over IPv6) | YOLOv8 | DeepFace | CNN         │    │
│   │  AgenticOps: ISE CoA quarantine | Webex alerts | BMS integration            │    │
│   │  Latency: 3.2ms avg (< 4ms target) | 99.98% bandwidth reduction            │    │
│   └───────────────────────────────────────────────────────────────────────────┘    │
│   ┌──── XDR + DNS SECURITY ───────────────────────────────────────────────────┐    │
│   │  SecureX XDR: ISE + FTD + Umbrella ribbons over IPv6                        │    │
│   │  Umbrella: IPv6 resolvers 2620:119:35::35 | AAAA filtering | NSD blocking   │    │
│   │  Automated response: < 15 sec (ISE CoA → FTD block → Umbrella → SNOW)      │    │
│   └───────────────────────────────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────────────────────────────────┘

Legend:
  Dual-stack = IPv4 + IPv6 coexistence throughout all phases
  SLAAC      = Stateless Address Autoconfiguration (RFC 4862)
  EID        = Endpoint Identifier (LISP)
  SGT        = Scalable Group Tag (TrustSec)
  BFD        = Bidirectional Forwarding Detection
  CAPWAP     = Control and Provisioning of Wireless Access Points
```

---

## Migration Phases at a Glance

| Phase | Weeks | Focus | Key Technology |
|-------|-------|-------|----------------|
| **Phase 0** | Week 1 | Planning, IPAM, ARIN allocation, lab | CML, Infoblox, tooling |
| **Phase 1 + 1B** | Weeks 2–8 | SD-WAN underlay dual-stack | C8500, vManage, BFD, NAT64 |
| **Phase 2 + 2B** | Weeks 9–17 | SD-Access campus overlay | DNAC, ISE, LISP/VXLAN, WLC 9800 |
| **Phase 3** | Weeks 15–17 | Multi-cloud IPv6 connectivity | Azure ExpressRoute, GCP Interconnect |
| **Phase 4** | Weeks 18–19 | Webex Calling & Contact Center | CUBE, IP Phones 8845/8865, Finesse |
| **Phase 5** | Weeks 20–23 | Observability & monitoring | ThousandEyes, Splunk, AppDynamics, NetFlow |
| **Phase 6** | Weeks 24–26 | Security, Edge AI, XDR | FTD, SecureX, UCS, NVIDIA L4, Umbrella |

**Achieved results:** 47% faster than planned (archetype-based deployment), 31.3% IPv6 traffic at Week 23 (growing 5%/week), MOS +0.2 improvement, cloud response time −13%, error rate −60%.

---

## Documentation Structure

### [Chapter 1: Getting Started](chapter1-getting-started/README.md)
Master Reference Card — addressing architecture, migration strategy, site inventory — plus Week 1 foundation activities: ARIN allocation, IPAM configuration, CML lab topology, and readiness tooling.

### [Chapter 2: SD-WAN Foundation](chapter2-sdwan-foundation/README.md)
Weeks 2–8. Mumbai hub greenfield deployment (C8500-12X pilot), remaining hub rollouts (Chennai, London, New Jersey, Dallas, Frankfurt), branch site archetypes (ISR 4331, ISR 1100+LTE, Fabric-in-a-Box), Phase 1B advanced topics (NAT64, service VPNs, transport overlays, Cloud OnRamp), and NAT64 troubleshooting addendum.

### [Chapter 3: SD-Access Overlay](chapter3-sdaccess-overlay/README.md)
Weeks 9–17. LISP/VXLAN dual-stack campus fabric deployment, Catalyst Center IPv6 pool and template management, ISE IPv6 profiling and SGT enforcement, Anycast Gateway with SLAAC, WiFi 7 WLC 9800 CAPWAP over IPv6, and Phase 2B advanced topics: multi-site, guest/IoT segmentation, and operations.

### [Chapter 4: Multi-Cloud Integration](chapter4-multicloud-integration/README.md)
Weeks 15–17. Azure ExpressRoute IPv6 BGP (ASN 64512 ↔ Microsoft 12076), Azure VNet dual-stack and Private Endpoints, GCP Cloud Interconnect IPv6 (link-local BGP), GCP VPC dual-stack and Vertex AI IPv6 connectivity, cross-cloud direct routing (no NAT), and Terraform/gcloud automation templates.

### [Chapter 5: Collaboration & UC](chapter5-collaboration-uc/README.md)
Weeks 18–19. Webex Calling IPv6 enablement — SIP registration over IPv6, 4,500 IP Phones 8845/8865 with SLAAC, CUBE dual-stack PSTN gateway, QoS for IPv6 RTP — and Webex Contact Center IPv6 with 500 agent workstations, Finesse desktop, CTI integration, and performance validation.

### [Chapter 6: Observability](chapter6-observability/README.md)
Weeks 20–23. ThousandEyes Enterprise Agent IPv6 deployment and path tests, Splunk dual-stack syslog/NetFlow collection and MLTK anomaly detection, AppDynamics agent IPv6 configuration and Cognition Engine baselining, NetFlow v9/IPFIX (50,000 flows/sec), IPv4 vs. IPv6 traffic analysis, and AI-powered capacity forecasting.

### [Chapter 7: Security, Edge & AI](chapter7-security-edge-ai/README.md)
Weeks 24–26. Cisco FTD firewall dual-stack (18 units, FMC IPv6 management, 1,200+ IPS signatures), Zero Trust SGT enforcement over IPv6 (ISE pxGrid, SXP, Duo MFA), Edge AI on UCS XE9305 with NVIDIA L4 GPUs (YOLOv8, DeepFace, 450 IPv6 cameras, AgenticOps workflows), SecureX XDR IPv6 telemetry, and Umbrella DNS security for IPv6.

### [Appendices](appendices/templates.md)
Glossary, references, disclaimer, and SD-Access deployment templates for download.

---

## Quick Navigation

| Resource | Description |
|----------|-------------|
| [Master Reference Card](chapter1-getting-started/master-reference-card.md) | Addressing scheme, site inventory, migration patterns — start here |
| [Week 1 Planning](chapter1-getting-started/week1-planning-addressing-tooling.md) | ARIN allocation, IPAM, CML lab, readiness tooling |
| [Mumbai Hub Deployment](chapter2-sdwan-foundation/week2-mumbai-hub-deployment.md) | Flagship C8500-12X greenfield — the reference for all hub deployments |
| [SD-Access Deployment Checklist](appendices/templates.md) | Step-by-step site checklist + all downloadable templates |
| [NAT64 Troubleshooting](chapter2-sdwan-foundation/phase1-addendum-nat64-troubleshooting.md) | NAT64/NAT66 operational guide |
| [Phase 6: Security & Edge AI](chapter7-security-edge-ai/phase6-security-edge-ai-deployment.md) | FTD, SecureX XDR, Umbrella, Edge AI |

---

## Prerequisites

- **IPv6 fundamentals:** Addressing (/48, /52, /64 hierarchy), SLAAC, DHCPv6, RA, NDP, extension headers
- **Cisco expertise:** IOS-XE 17.15+, SD-WAN (vManage), SD-Access (DNAC 2.3.7+), ISE 3.3+, Catalyst 9000 series
- **Lab environment:** Cisco CML or equivalent for pre-production testing
- **ARIN allocation:** /44 prefix minimum for full enterprise deployment (Abhavtech uses `2001:db8::/32` documentation range — replace with your actual allocation)

---

## About This Documentation

This guide is part of the **[AbhavTech](https://abhavtech.com)** technical documentation portfolio, demonstrating AI-assisted enterprise-grade technical content. All configurations reflect  deployment patterns validated against Cisco IOS-XE 17.15.x, vManage 20.15.x, DNAC 2.3.7.x, and ISE 3.3+.

**Author:** Rajmohan M | **Platform:** [abhavtech.com](https://abhavtech.com)

---

**Ready to begin?** Start with **[Chapter 1: Getting Started →](chapter1-getting-started/README.md)**
