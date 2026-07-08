# 5.1 Deployment Strategy Overview

## Document Information
- **Version:** 1.0
- **Last Updated:** December 2025
- **Author:** Abhavtech Network Engineering
- **Classification:** Internal Use
- **Document Type:** Implementation Guide

---

## 5.1.1 Deployment Philosophy

### Strategic Approach

The Abhavtech SD-WAN deployment follows a phased, risk-mitigated approach that ensures business continuity while transitioning from legacy MPLS infrastructure to modern software-defined networking.

```
+------------------------------------------------------------------+
|              ABHAVTECH SD-WAN DEPLOYMENT PHILOSOPHY               |
+------------------------------------------------------------------+
|                                                                   |
|  CORE PRINCIPLES:                                                 |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │  1. PARALLEL OPERATION                                     │  |
|  │     - Run SD-WAN alongside MPLS during migration           │  |
|  │     - Zero downtime cutover capability                     │  |
|  │     - Instant rollback available at all times              │  |
|  │                                                             │  |
|  │  2. PHASED APPROACH                                        │  |
|  │     - Foundation first (controllers, certificates)         │  |
|  │     - Hub sites second (anchoring fabric)                  │  |
|  │     - Branches third (systematic rollout)                  │  |
|  │                                                             │  |
|  │  3. VALIDATE CONTINUOUSLY                                  │  |
|  │     - Test at every stage                                  │  |
|  │     - Verify against success criteria                      │  |
|  │     - Document and sign-off before proceeding              │  |
|  │                                                             │  |
|  │  4. BUSINESS-ALIGNED TIMING                                │  |
|  │     - Avoid business-critical periods                      │  |
|  │     - Consider regional time zones                         │  |
|  │     - Align with change management windows                 │  |
|  └────────────────────────────────────────────────────────────┘  |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 5.1.2 Deployment Phases

### Phase Overview

```
+------------------------------------------------------------------+
|                    DEPLOYMENT PHASE ROADMAP                       |
+------------------------------------------------------------------+
|                                                                   |
|  PHASE 1: FOUNDATION (Weeks 1-3)                                 |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │  ► SD-WAN Manager cluster deployment (Mumbai DC)           │  |
|  │  ► SD-WAN Controller deployment (Mumbai + Chennai)         │  |
|  │  ► SD-WAN Validator configuration (Cloud-hosted)           │  |
|  │  ► Enterprise CA integration                               │  |
|  │  ► Certificate distribution framework                      │  |
|  │  Deliverable: Control plane operational                    │  |
|  └────────────────────────────────────────────────────────────┘  |
|           │                                                       |
|           ▼                                                       |
|  PHASE 2: HUB SITES (Weeks 4-6)                                  |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │  ► Mumbai DC WAN Edge deployment (C8500-12X4QC)            │  |
|  │  ► Chennai DR WAN Edge deployment (C8500-12X4QC)           │  |
|  │  ► SD-Access fabric handoff integration                    │  |
|  │  ► Inter-DC connectivity validation                        │  |
|  │  ► Policy framework deployment                             │  |
|  │  Deliverable: Hub fabric operational                       │  |
|  └────────────────────────────────────────────────────────────┘  |
|           │                                                       |
|           ▼                                                       |
|  PHASE 3: REGIONAL HUBS (Weeks 7-9)                              |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │  ► London hub deployment (C8300-2N2S-6T)                   │  |
|  │  ► Frankfurt hub deployment (C8300-2N2S-6T)                │  |
|  │  ► New Jersey hub deployment (C8300-2N2S-6T)               │  |
|  │  ► Dallas hub deployment (C8300-2N2S-6T)                   │  |
|  │  ► Regional mesh connectivity                              │  |
|  │  Deliverable: Global hub fabric                            │  |
|  └────────────────────────────────────────────────────────────┘  |
|           │                                                       |
|           ▼                                                       |
|  PHASE 4: INDIA BRANCHES (Weeks 10-12)                           |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │  ► Bangalore branch (C8300-1N1S-6T)                        │  |
|  │  ► Delhi branch (C8300-1N1S-6T)                            │  |
|  │  ► Noida branch (C8300-1N1S-6T)                            │  |
|  │  ► MPLS parallel operation testing                         │  |
|  │  ► Traffic steering validation                             │  |
|  │  Deliverable: India fully migrated                         │  |
|  └────────────────────────────────────────────────────────────┘  |
|           │                                                       |
|           ▼                                                       |
|  PHASE 5: MIGRATION COMPLETION (Weeks 13-15)                     |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │  ► Full production traffic cutover                         │  |
|  │  ► MPLS decommissioning (phased)                           │  |
|  │  ► Performance optimization                                │  |
|  │  ► Documentation finalization                              │  |
|  │  Deliverable: SD-WAN production                            │  |
|  └────────────────────────────────────────────────────────────┘  |
|                                                                   |
+------------------------------------------------------------------+
```

### Detailed Phase Timeline

| Phase | Duration | Sites | Key Activities | Exit Criteria |
|-------|----------|-------|----------------|---------------|
| Phase 1 | Weeks 1-3 | Control Plane | Manager, Controllers, Validators | All controllers UP, OMP established |
| Phase 2 | Weeks 4-6 | Mumbai, Chennai | Hub WAN Edge, SD-Access handoff | Inter-DC tunnels UP, fabric integrated |
| Phase 3 | Weeks 7-9 | London, Frankfurt, NJ, Dallas | Regional hubs | Global mesh operational |
| Phase 4 | Weeks 10-12 | Bangalore, Delhi, Noida | India branches | All India sites on SD-WAN |
| Phase 5 | Weeks 13-15 | All | Cutover, optimization | Production stable, MPLS decommissioned |

---

## 5.1.3 Parallel Operation Model

### MPLS + SD-WAN Coexistence

During the migration period, both MPLS and SD-WAN will operate in parallel, providing fallback capability and enabling gradual traffic migration.

```
+------------------------------------------------------------------+
|              PARALLEL OPERATION ARCHITECTURE                      |
+------------------------------------------------------------------+
|                                                                   |
|                        BRANCH SITE                                |
|  ┌──────────────────────────────────────────────────────────┐    |
|  │                    WAN Edge Router                        │    |
|  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │    |
|  │  │   MPLS VRF   │  │  SD-WAN VPN  │  │ Internet VPN │    │    |
|  │  │ (Legacy)     │  │   (Primary)  │  │  (DIA/SIG)   │    │    |
|  │  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘    │    |
|  │         │                 │                 │             │    |
|  └─────────┼─────────────────┼─────────────────┼─────────────┘    |
|            │                 │                 │                  |
|            ▼                 ▼                 ▼                  |
|       ┌─────────┐       ┌─────────┐       ┌─────────┐            |
|       │  MPLS   │       │ IPsec   │       │Internet │            |
|       │ Circuit │       │ Tunnel  │       │   DIA   │            |
|       └────┬────┘       └────┬────┘       └────┬────┘            |
|            │                 │                 │                  |
|            ▼                 ▼                 ▼                  |
|  ┌──────────────────────────────────────────────────────────┐    |
|  │                     SERVICE PROVIDER                      │    |
|  └──────────────────────────────────────────────────────────┘    |
|            │                 │                 │                  |
|            ▼                 ▼                 ▼                  |
|       ┌─────────┐       ┌─────────┐       ┌─────────┐            |
|       │  MPLS   │       │ IPsec   │       │Internet │            |
|       │ Circuit │       │ Tunnel  │       │   DIA   │            |
|       └────┬────┘       └────┬────┘       └────┬────┘            |
|            │                 │                 │                  |
|  ┌─────────┼─────────────────┼─────────────────┼─────────────┐   |
|  │         │                 │                 │              │   |
|  │  ┌──────┴───────┐  ┌──────┴───────┐  ┌──────┴───────┐    │   |
|  │  │   MPLS VRF   │  │  SD-WAN VPN  │  │ Internet VPN │    │   |
|  │  │ (Legacy)     │  │   (Primary)  │  │  (Backup)    │    │   |
|  │  └──────────────┘  └──────────────┘  └──────────────┘    │   |
|  │                    HUB SITE WAN Edge                      │   |
|  └──────────────────────────────────────────────────────────┘   |
|                                                                   |
+------------------------------------------------------------------+

TRAFFIC MIGRATION STAGES:

Stage 1: SD-WAN MPLS underlay (SD-WAN uses MPLS transport)
         - SD-WAN tunnels over MPLS circuits
         - MPLS VRF routes as backup
         
Stage 2: SD-WAN Internet primary (MPLS as backup)
         - Internet/DIA as primary transport
         - MPLS circuits remain active for failover
         
Stage 3: MPLS decommission (SD-WAN standalone)
         - All traffic on SD-WAN (Internet + LTE)
         - MPLS circuits cancelled
```

### Traffic Distribution During Migration

| Migration Stage | SD-WAN Traffic | MPLS Traffic | Failover |
|-----------------|----------------|--------------|----------|
| Initial (Week 1-3) | 0% | 100% | N/A |
| Hub Deployment (Week 4-6) | 20% (test) | 80% | MPLS primary |
| Regional Hubs (Week 7-9) | 50% | 50% | Bidirectional |
| Branch Deployment (Week 10-12) | 80% | 20% | SD-WAN primary |
| Post-Migration (Week 13+) | 100% | 0% | LTE backup |

---

## 5.1.4 Resource Requirements

### Personnel

| Role | Quantity | Phase Coverage | Responsibilities |
|------|----------|----------------|------------------|
| Project Manager | 1 | All phases | Timeline, coordination, reporting |
| SD-WAN Architect | 1 | All phases | Design validation, policy development |
| Network Engineers | 3 | All phases | Controller/router deployment |
| Security Engineer | 1 | Phase 2-5 | Certificate management, firewall policies |
| Cisco TAC/PS | 2 | Phase 1-2 | Controller deployment support |
| ISP Coordinators | 2 | Phase 4-5 | Circuit provisioning, DNS changes |

### Hardware and Software

| Component | Quantity | Deployment Phase | Lead Time |
|-----------|----------|------------------|-----------|
| SD-WAN Manager (VM) | 3 nodes | Phase 1 | Pre-staged |
| SD-WAN Controller (VM) | 4 nodes | Phase 1 | Pre-staged |
| SD-WAN Validator (Cloud) | 2 | Phase 1 | 1 week |
| C8500-12X4QC | 4 | Phase 2 | 6 weeks |
| C8300-2N2S-6T | 8 | Phase 2-3 | 4 weeks |
| C8300-1N1S-6T | 6 | Phase 4 | 4 weeks |
| DNA Subscription | All devices | Phase 1 | License order |

### Network Prerequisites

| Prerequisite | Status | Owner | Due Date |
|--------------|--------|-------|----------|
| Internet circuits provisioned | Pending | ISP Team | Week 0 |
| SD-Access border VRF-Lite ready | Complete | LAN Team | Complete |
| Enterprise CA operational | Complete | Security Team | Complete |
| DNS entries for controllers | Pending | DNS Team | Week 1 |
| Firewall rules for control plane | Pending | Security Team | Week 1 |
| IP address allocation | Complete | IPAM Team | Complete |

---

## 5.1.5 Success Criteria

### Phase-Specific Success Criteria

#### Phase 1: Foundation Success Criteria

| Criterion | Measurement | Target | Validation Method |
|-----------|-------------|--------|-------------------|
| Manager cluster healthy | Cluster status | 3/3 nodes UP | vManage dashboard |
| Controllers operational | OMP peers | All controllers UP | show omp peers |
| Validators reachable | Authentication | DTLS successful | show control connections |
| Certificates deployed | Device auth | 100% devices | Certificate status |
| Control plane latency | RTT | <50ms regional | BFD probes |

#### Phase 2: Hub Sites Success Criteria

| Criterion | Measurement | Target | Validation Method |
|-----------|-------------|--------|-------------------|
| Hub WAN Edge online | Control connections | 4/4 tunnels UP | show sdwan control connections |
| Inter-DC tunnels | BFD status | Mumbai-Chennai UP | show sdwan bfd sessions |
| SD-Access handoff | BGP peering | eBGP established | show bgp vpnv4 unicast summary |
| Route propagation | OMP routes | All VPN routes | show sdwan omp routes |
| Failover test | Convergence | <6 seconds | Simulated failure |

#### Phase 3-4: Site Deployment Success Criteria

| Criterion | Measurement | Target | Validation Method |
|-----------|-------------|--------|-------------------|
| Site online | Control + BFD | All connections UP | Dashboard green |
| SLA compliance | Latency/Loss/Jitter | Within class | show sdwan app-route sla-class |
| Application performance | Response time | ≤baseline+10% | ThousandEyes |
| DIA functional | Internet reachability | 100% uptime | Synthetic monitoring |
| Policy enforcement | Traffic path | Correct steering | Packet capture |

---

## 5.1.6 Risk Management

### Identified Risks and Mitigations

| Risk | Probability | Impact | Mitigation | Contingency |
|------|-------------|--------|------------|-------------|
| Controller failure during deployment | Low | High | Cluster redundancy, staged deployment | Rollback to MPLS |
| ISP circuit delays | Medium | Medium | Early ordering, multiple ISPs | Temporary LTE |
| SD-Access integration issues | Medium | High | Pre-validation in lab, Cisco PS | Manual routing |
| Certificate expiration | Low | Critical | 90-day buffer, automated renewal | Emergency CA re-issue |
| Performance degradation | Medium | High | Parallel operation, gradual migration | Traffic reversion to MPLS |

### Rollback Triggers

| Condition | Threshold | Action |
|-----------|-----------|--------|
| Control plane instability | >5 min outage | Pause migration, investigate |
| BFD flapping | >10 flaps/hour | Revert traffic to MPLS |
| Application degradation | >20% increase in response time | Traffic steering to MPLS |
| Data loss | Any packet loss >5% | Immediate MPLS failover |
| Security incident | Any breach | Full rollback, forensics |

---

## 5.1.7 Communication Plan

### Stakeholder Communication

| Stakeholder | Frequency | Method | Content |
|-------------|-----------|--------|---------|
| Executive Sponsor | Weekly | Email + Dashboard | Status, risks, decisions |
| IT Leadership | Bi-weekly | Meeting | Technical progress, issues |
| Operations Team | Daily during migration | Slack/Teams | Real-time updates |
| End Users | Pre/Post migration | Email | Scheduled outages, expectations |
| Vendors (Cisco, ISPs) | As needed | Email + Calls | Support requests, coordination |

### Escalation Matrix

| Level | Threshold | Contact | Response Time |
|-------|-----------|---------|---------------|
| L1 | Site issue | NOC | 15 minutes |
| L2 | Regional impact | Network Engineering | 30 minutes |
| L3 | Global impact | SD-WAN Architect | 1 hour |
| L4 | Business critical | CIO/CTO | 2 hours |
| Cisco TAC | P1/P2 | TAC SR | Per contract SLA |

---

## 5.1.8 Documentation Requirements

### Required Documents

| Document | Owner | Due | Purpose |
|----------|-------|-----|---------|
| Low-Level Design | Architect | Pre-Phase 1 | Technical specifications |
| Runbook | Operations | Pre-Phase 2 | Operational procedures |
| Test Plan | QA | Pre-Phase 2 | Validation criteria |
| Rollback Procedures | Engineering | Pre-Phase 2 | Recovery instructions |
| Training Materials | Training | Pre-Phase 5 | Operations enablement |
| As-Built Documentation | Engineering | Post-Phase 5 | Final configuration |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech Network Engineering | Initial release |

---

*Abhavtech Confidential - SD-WAN Deployment Strategy Guide*
