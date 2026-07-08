# Appendices

Reference materials, templates, checklists, and compliance documentation to support the CUCM & UCCX to Webex migration project.

## Appendix Overview

### Reference Materials

**[Appendix A: Glossary ->](glossary.md)**  
Terms, acronyms, and definitions used throughout the documentation

**[Appendix B: Reference Links ->](reference-links.md)**  
Webex documentation, compliance resources, vendor contacts, certification bodies

**[Appendix C: Support Contacts ->](support-contacts.md)**  
Cisco TAC, Webex support, PSTN providers, system integrators, escalation contacts

### Regional Compliance

**[Appendix D: India Telecom Reference ->](india-telecom-reference.md)**  
DoT/TRAI regulations, telecom circle mapping, toll bypass compliance procedures, carrier contact information

**[Appendix E: EMEA Certifications ->](emea-certifications.md)**  
GDPR compliance documentation, UK post-Brexit requirements, German BSI C5, EU Cloud Code of Conduct certification details

### Configuration Templates

**[Appendix F: DNS Templates ->](dns-templates.md)**  
DNS record templates for Webex Calling, split-brain DNS configuration, regional DNS requirements

**[Appendix G: Firewall Templates ->](firewall-templates.md)**  
Firewall rule templates by region, IP address ranges, port requirements, NAT configuration

**[Appendix H: Configuration Templates ->](configuration-templates.md)**  
Control Hub settings, India LGW CUBE configuration, Zone/Edge deployment, route group templates, emergency services configuration

### Operational Resources

**[Appendix I: Migration Runbook ->](migration-runbook.md)**  
Detailed hour-by-hour migration runbooks, pre-migration checklist, rollback procedures, validation testing

**[Appendix J: AI Observability Guide ->](ai-observability-guide.md)**  
AI monitoring dashboards, intent accuracy tracking, Virtual Agent performance metrics, Agent Assist analytics

**[Appendix K: Master Checklist ->](master-checklist.md)**  
Complete project checklist covering discovery, design, implementation, migration, and operations phases

---

## Quick Reference

### India Compliance

**Toll Bypass Prevention**:
- Required for: Geographic DIDs (+91-22-XXXX, +91-80-XXXX, etc.)
- Exempt: ITN numbers (9XXXXXXXXX)
- Solution: Local Gateway + Zone/Edge per telecom circle

**Telecom Circles** (Appendix D):
- Mumbai, Tamil Nadu, Karnataka, Delhi, UP West, Maharashtra, AP/Telangana

### EMEA Compliance

**Data Residency**:
- UK: London calling region, UK GDPR
- EU: Frankfurt calling region, EU GDPR, BSI C5

**Key Difference**:
- EMEA compliance = DATA residency (not PSTN routing)
- Local Gateway NOT required for compliance

### Configuration Quick Links

**DNS Templates** (Appendix F):
- SIP federation records
- Split-brain DNS for on-premises devices
- Regional DNS requirements

**Firewall Rules** (Appendix G):
- APAC: 202.177.192.0/19 (signaling), 210.4.192.0/20 (media)
- UK: 185.115.196.0/22 (signaling), 62.109.192.0/18 (media)
- EU: 64.68.96.0/19 (signaling), 170.133.128.0/18 (media)
- US: 64.68.96.0/19 (signaling), 170.133.128.0/18 (media)

**CUBE Templates** (Appendix H):
- ISR 4451-X (Mumbai)
- ISR 4351 (Chennai)
- ISR 4331 (Bangalore, Delhi, Noida, Hyderabad)

---

## Usage Guidelines

### For Discovery Phase

- **Appendix A**: Reference glossary for terminology alignment
- **Appendix D, E**: Understand regional compliance requirements
- **Appendix K**: Track discovery phase tasks

### For Design Phase

- **Appendix F, G, H**: Use templates for consistent design
- **Appendix B**: Reference Cisco/Webex documentation
- **Appendix K**: Track design phase deliverables

### For Implementation Phase

- **Appendix H**: Apply configuration templates
- **Appendix I**: Follow migration runbooks
- **Appendix K**: Execute implementation checklist

### For Operations Phase

- **Appendix C**: Contact support resources
- **Appendix J**: Monitor AI features (if deployed)
- **Appendix K**: Track operational tasks

---

## Document Maintenance

These appendices should be reviewed and updated:

**Quarterly**:
- Reference links (Appendix B)
- Support contacts (Appendix C)
- IP address ranges (Appendix G)

**Annually**:
- Compliance requirements (Appendix D, E)
- Configuration templates (Appendix H)

**As Needed**:
- Glossary (Appendix A)
- Runbooks (Appendix I)
- Master checklist (Appendix K)

---

## Feedback & Corrections

If you identify errors or outdated information in any appendix:

1. Document the issue with specific appendix and section reference
2. Submit via project change request process
3. Urgent corrections: contact migration team lead directly

---

*These appendices are living documents and will be updated throughout the migration project lifecycle.*

---

## Technical Appendices (10-Series)

**[Appendix 10E: Step-by-Step Configuration Procedures ->](configuration-templates.md)**  
Directory integration, SSO configuration, user data migration procedures

**[Appendix 10F: Jabber Remote Access & Client Migration ->](jabber-remote-access.md)**  
Remote access infrastructure discovery, Expressway assessment, Jabber to Webex App migration, remote user coexistence and cutover

**[Appendix 10G: Jabber to Webex Complete Migration Guide ->](jabber-webex-migration.md)**  
Seven-layer Jabber migration: identity, authentication, Expressway, client, IM & Presence, voice services, coexistence, and implementation playbook

**[Appendix 10H: Specialty Device Migration Guide ->](specialty-device-migration.md)**  
Analog device migration, paging system migration, video endpoint migration, third-party and specialty devices, call recording migration

**[Appendix 10I: Webex AI Observability Integration Guide ->](ai-observability-guide.md)**  
Splunk integration, ThousandEyes monitoring, AI metrics collection, observability dashboards

---

## WxCC-Specific References

**[Appendix K: CUCM to Webex Calling Master Checklist ->](master-checklist.md)**  
Complete pre-migration, cutover, and post-migration checklist for the CUCM -> Webex Calling migration

**[Appendix L: UCCX to WxCC Migration Master Checklist ->](uccx-wxcc-checklist.md)**  
Complete checklist for the UCCX -> Webex Contact Center migration phases

**[Appendix M: WxCC Master Reference Card ->](wxcc-reference-card.md)**  
Quick-reference specifications: entry points, queues, teams, agents, flows, and key configuration values
