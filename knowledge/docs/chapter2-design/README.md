# Chapter 2: Design Documentation

## Overview

This chapter contains the comprehensive design documentation for the Avaya to Webex Contact Center migration project. It covers architectural decisions, technical specifications, capacity planning, and implementation guidelines across all contact center components.

---

## Document Structure

### Core Design Documents (7 files)

1. **[README.md](README.md)** - This file, navigation guide for Chapter 2
2. **[component-mapping.md](component-mapping.md)** - Avaya to Webex component mapping
3. **[target-architecture-diagram.md](target-architecture-diagram.md)** - High-level architecture diagrams
4. **[telephony-architecture.md](telephony-architecture.md)** - PSTN connectivity and voice architecture
5. **[omnichannel-design.md](omnichannel-design.md)** - Voice, chat, email, and digital channels
6. **[integrations.md](integrations.md)** - CRM, WFM, and third-party integrations
7. **[security-and-compliance.md](security-and-compliance.md)** - Security architecture and compliance

---

### New Design Documents (6 files) - Added November 2025

8. **[design-principles.md](design-principles.md)**  
   - Core design tenets (scalability, resiliency, security-by-design)
   - Naming conventions (agents, queues, entry points)
   - Documentation standards and quality gates
   - Change management governance

9. **[assumptions-and-dependencies.md](assumptions-and-dependencies.md)**  
   - Network infrastructure prerequisites
   - Firewall rules and security requirements
   - PSTN carrier coordination
   - Licensing and cloud setup dependencies
   - Pre-migration checklist

10. **[network-architecture.md](network-architecture.md)**   
    - Network topology and connectivity models
    - QoS (Quality of Service) design and DSCP marking
    - Security architecture (firewalls, NAT, VLANs)
    - Internet circuit redundancy (dual ISP, BGP)
    - Home agent network considerations

11. **[cube-and-sbc-design.md](cube-and-sbc-design.md)**   
    - **On-premises CUBE vs Cloud-connected PSTN decision matrix**
    - **Critical DID impact analysis** (keep existing DIDs vs porting)
    - **CUBE session capacity planning** (encryption impact, sizing formulas)
    - **Session sizing for 1,000-agent deployment** (detailed calculations)
    - **Reusing existing CUBE capacity** (decision matrix and examples)
    - SIP trunk configuration (carrier and Webex)
    - TLS/SRTP encryption setup
    - High availability (HSRP active-standby)
    - Call flow examples and troubleshooting

12. **[agent-endpoints.md](agent-endpoints.md)**  
    - Desktop client options (Webex App, browser-based, IP phones)
    - SSO integration with Azure AD/Okta
    - Multi-factor authentication (MFA)
    - CUCM vs Webex Calling registration
    - Headset standards and audio configuration
    - Supervisor desktop and monitoring
    - Home agent requirements and security

13. **[dr-and-resiliency.md](dr-and-resiliency.md)** 
    - Recovery objectives (RTO/RPO targets)
    - CUBE/SBC failover procedures
    - Network redundancy and failover
    - Agent re-login and recovery procedures
    - Disaster recovery testing schedule
    - Incident response and escalation

---

### Future Design Documents (3 files) - Planned Q4 2025-Q1 2026

14. **[capacity-and-sizing.md](capacity-and-sizing.md)** 📋 PLANNED (23 KB)  
    - **Consolidation document** with references to existing capacity planning
    - **NEW: AI/automation capacity** (virtual agents, ASR, NLU, API rate limits, cost: $282K/month)
    - **NEW: Storage capacity** (call recordings 105 TB, transcripts, logs, backups)
    - **NEW: IVR capacity** (port sizing, speech recognition sessions)
    - Quick summaries of CUBE (→ cube-and-sbc-design.md Section 4), network (→ network-architecture.md Section 11)
    

15. **[license-mapping.md](license-mapping.md)** 📋 PLANNED (6.8 KB)  
    - Avaya to Webex license mapping table
    - Official Cisco SKUs and part numbers  
    - License types (Premium $120/user, Standard, Supervisor $90/user, add-ons)
    - Cost analysis and volume discounts
    - Procurement process and timeline
    

16. **[ai-and-automation-design.md](ai-and-automation-design.md)** 📋 PLANNED (11 KB)  
    - AI strategy and vision (maturity model, use cases, ROI)
    - Virtual agent design (Dialogflow CX, bot intents, conversational AI)
    - AI-powered routing (predictive behavioral routing, sentiment-based)
    - Real-time agent assist (knowledge base, next-best-action, transcription)
    - Post-call analytics (sentiment analysis, quality scoring automation)
    - RPA and process automation workflows
   

---

### Subfolders

#### acd-routing/ (5 files)
Detailed ACD (Automatic Call Distribution) routing design:

- **[README.md](acd-routing/README.md)** - ACD routing overview
- **[current-avaya-acd.md](acd-routing/current-avaya-acd.md)** - Avaya vectors, skills, hunt groups
- **[target-webex-acd.md](acd-routing/target-webex-acd.md)** - Webex queues, teams, flow designer
- **[routing-strategies.md](acd-routing/routing-strategies.md)** - Skills-based, priority, overflow routing
- **[migration-guide.md](acd-routing/migration-guide.md)** - Step-by-step migration approach

#### ivr-flows/ (3 files)
IVR (Interactive Voice Response) flow design:

- **[README.md](ivr-flows/README.md)** - IVR flows overview
- **[current-avaya-ivr.md](ivr-flows/current-avaya-ivr.md)** - Avaya VDN/vector analysis
- **[target-webex-connect.md](ivr-flows/target-webex-connect.md)** - Webex Flow Designer implementation

---

## Quick Navigation by Role

### For Architects
Start with these documents to understand strategic decisions:
1. [design-principles.md](design-principles.md) - Design philosophy
2. [target-architecture-diagram.md](target-architecture-diagram.md) - High-level view
3. [cube-and-sbc-design.md](cube-and-sbc-design.md) - Telephony architecture
4. [network-architecture.md](network-architecture.md) - Network design

### For Engineers (Implementation)
Focus on technical specifications:
1. [assumptions-and-dependencies.md](assumptions-and-dependencies.md) - Prerequisites
2. [cube-and-sbc-design.md](cube-and-sbc-design.md) - CUBE configuration
3. [network-architecture.md](network-architecture.md) - QoS, firewall rules
4. [agent-endpoints.md](agent-endpoints.md) - Desktop setup
5. [acd-routing/](acd-routing/) - Routing implementation

### For Project Managers
Understand scope and dependencies:
1. [component-mapping.md](component-mapping.md) - What's changing
2. [assumptions-and-dependencies.md](assumptions-and-dependencies.md) - Prerequisites
3. [dr-and-resiliency.md](dr-and-resiliency.md) - Risk mitigation

### For Business Stakeholders
Key business impact documents:
1. [cube-and-sbc-design.md](cube-and-sbc-design.md) - Section 3: DID implications
2. [omnichannel-design.md](omnichannel-design.md) - Customer experience
3. [dr-and-resiliency.md](dr-and-resiliency.md) - Business continuity

---

## Key Design Decisions Documented

### 1. SBC Deployment Strategy
**Decision:** On-premises CUBE (not cloud-connected PSTN)  
**Rationale:** Keep existing DIDs, avoid business disruption  
**Document:** [cube-and-sbc-design.md](cube-and-sbc-design.md) - Section 2

### 2. CUBE Session Capacity
**Requirement:** 6,000-6,500 sessions for 1,000 agents  
**Hardware:** 2× Cisco ASR 1002-HX (3,500 sessions each)  
**Document:** [cube-and-sbc-design.md](cube-and-sbc-design.md) - Section 4

### 3. Agent Desktop Strategy
**Primary:** Webex App (desktop + mobile)  
**Secondary:** Browser-based Agent Desktop  
**Rationale:** Best user experience, hybrid-ready  
**Document:** [agent-endpoints.md](agent-endpoints.md) - Section 2

### 4. Authentication Method
**Approach:** Single Sign-On (SSO) with Azure AD + MFA  
**Document:** [agent-endpoints.md](agent-endpoints.md) - Section 5

### 5. Network Design
**Internet connectivity:** Dual ISP with BGP failover  
**QoS marking:** DSCP EF for voice, AF41 for video  
**Document:** [network-architecture.md](network-architecture.md)

### 6. Disaster Recovery
**RTO:** 15 minutes for core contact center services  
**RPO:** 15 minutes for transactional data  
**Document:** [dr-and-resiliency.md](dr-and-resiliency.md) - Section 3

---
