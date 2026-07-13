---
description: Cisco SD-Access and ISE implementation guide covering fabric design, policy planes, identity services, and enterprise campus network automation.
---
# Cisco SD-Access & ISE Design and Implementation Guide

<span class="ai-badge">AI-Assisted Documentation</span>

**End-to-end design, security, implementation, operations, and migration for an enterprise Cisco Catalyst Center (DNAC) and Identity Services Engine (ISE) SD-Access fabric.**

**Author:** Rajmohan M
**Website:** [abhavtech.com](https://abhavtech.com)
---

## About This Documentation

This guide covers a global multi-site SD-Access deployment — fabric design, ISE policy and segmentation, firewall insertion, implementation runbooks, operations, and the migration business case. It is organised into seven chapters plus a consolidated design-references section and appendices.

**Target audience:** Network architects, security engineers, and operations teams deploying Cisco SD-Access with ISE.

**Technology stack:** Cisco Catalyst Center (DNAC), Identity Services Engine (ISE), Catalyst 9000 fabric nodes, with SD-WAN fabric handoff.

!!! warning "Disclaimer"
    This documentation is developed for knowledge-sharing purposes and is **not intended for production deployments**. It may contain errors, and vendor features or platform capabilities may have changed or been upgraded since publishing. Always validate designs against current Cisco documentation and your own environment before implementation.

---

## Documentation Sections

### [Discovery & Assessment](chapter-1-discovery/README.md)
Current-state inventory, technical requirements, gap and risk analysis, readiness assessment, and success criteria.

### [Design](chapter-2-design/README.md)
Fabric architecture, hub and branch design, underlay and overlay, LISP control plane, DNA Center and ISE design, SD-WAN integration, wireless, and sizing.

### [Network & Security](chapter-3-network-security/README.md)
Security architecture, ISE policy and segmentation, 802.1X, profiling, firewall integration, zero-trust, encryption, and compliance.

### [Implementation](chapter-4-implementation/README.md)
Cluster installation, ISE distributed deployment, underlay provisioning, fabric configuration, wireless integration, SD-WAN handoff, testing, cutover, and rollback.

### [Operations](chapter-5-operations/README.md)
Assurance monitoring, alerting, incident and change management, capacity planning, troubleshooting, backup and recovery, and HA failover.

### [Migration & Financials](chapter-6-migration-financials/README.md)
Migration strategy, legacy decommissioning, license mapping, TCO and ROI analysis, budget planning, and the business case.

### [Advanced Features](chapter-7-advanced-features/README.md)
AI/ML analytics, automation, REST APIs, SD-WAN integration, Stealthwatch and ThousandEyes, SASE, Cisco XDR, and AI-enhanced RRM.

### [Design Guides](design-guides/README.md)
Consolidated design references — capacity planning and hardware sizing, firewall insertion design, structured design data, and deployment planning guides and templates.

### [Appendices](appendices/README.md)
Glossary, CLI quick reference, port reference, IP allocation, hardware bill of materials, and references.

---

## AI-Assisted Documentation Disclaimer

This documentation was developed with assistance from Claude (Anthropic) as part of the AbhavTech technical documentation portfolio. Content reflects real-world enterprise SD-Access and ISE deployment patterns.

---


