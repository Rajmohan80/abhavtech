# SD-WAN Migration Project Template
## Enterprise WAN Transformation | MPLS to SD-WAN Migration
### Phased Migration | Parallel Running | Risk Mitigation

---

## Document Information

| Field | Value |
|-------|-------|
| Document Title | SD-WAN Migration Project Template |
| Version | 1.0 |
| Date | January 2026 |
| Classification | Template - Reusable |
| Purpose | Guide for migrating from traditional WAN to SD-WAN |

---

## Document Purpose

This template provides a structured approach for migrating from a traditional WAN infrastructure (typically MPLS-based) to a Cisco Catalyst SD-WAN solution. It emphasizes risk mitigation, parallel running, and phased cutover strategies.

**Migration Scope:**
- Legacy MPLS WAN to SD-WAN transformation
- Hybrid operation during transition
- Circuit optimization and cost reduction
- Minimal business disruption
- Rollback procedures at every phase

---

## Table of Contents

1. [Current State Assessment](#1-current-state-assessment)
2. [Migration Strategy](#2-migration-strategy)
3. [Migration Architecture](#3-migration-architecture)
4. [Hardware & Capacity Planning](#4-hardware--capacity-planning)
5. [Migration Phases](#5-migration-phases)
6. [Site Migration Runbook](#6-site-migration-runbook)
7. [Rollback Procedures](#7-rollback-procedures)
8. [Financial Analysis](#8-financial-analysis)

---

## 1. Current State Assessment

## 1.1 Existing WAN Infrastructure Audit

### Current Architecture Documentation

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   CURRENT STATE - TRADITIONAL MPLS WAN                    │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│                      ┌─────────────────────┐                             │
│                      │   MPLS PROVIDER     │                             │
│                      │   BACKBONE          │                             │
│                      │   (Class of Service)│                             │
│                      └──────────┬──────────┘                             │
│                                 │                                         │
│              ┌──────────────────┼──────────────────┐                     │
│              │                  │                  │                     │
│         ┌────▼─────┐      ┌────▼─────┐      ┌────▼─────┐               │
│         │ Hub Site │      │ Hub Site │      │ Hub Site │               │
│         │  Router  │      │  Router  │      │  Router  │               │
│         │ (ISR 4K) │      │ (ISR 4K) │      │ (ASR 1K) │               │
│         └────┬─────┘      └────┬─────┘      └────┬─────┘               │
│              │                  │                  │                     │
│     ┌────────┴────────┐  ┌──────┴──────┐  ┌───────┴────────┐           │
│     │                 │  │             │  │                │           │
│  ┌──▼──┐  ┌──▼──┐  ┌──▼──┐  ┌──▼──┐  ┌──▼──┐  ┌──▼──┐  ┌──▼──┐       │
│  │BR-01│  │BR-02│  │BR-03│  │BR-04│  │BR-05│  │BR-06│  │BR-N │       │
│  │ISR  │  │ISR  │  │ISR  │  │ISR  │  │ISR  │  │ISR  │  │ISR  │       │
│  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘  └─────┘       │
│                                                                           │
│  CHARACTERISTICS:                                                         │
│  • Hub-and-spoke topology (no branch-to-branch)                          │
│  • Single MPLS transport per site                                        │
│  • Static QoS policies                                                   │
│  • Manual configuration per site                                         │
│  • Limited visibility and control                                        │
│  • High MPLS costs                                                       │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

### Current Infrastructure Inventory Template

| Site Name | Site Type | WAN Router Model | MPLS Circuit | Bandwidth | Monthly Cost | Contract End | Migration Priority |
|-----------|-----------|------------------|--------------|-----------|--------------|--------------|-------------------|
| Site-01 | Data Center | ASR 1006-X | Provider-A | 1 Gbps | $XX,XXX | MM/YYYY | Phase 4 |
| Site-02 | Regional Hub | ISR 4451 | Provider-A | 500 Mbps | $X,XXX | MM/YYYY | Phase 3 |
| Site-03 | Large Branch | ISR 4351 | Provider-A | 200 Mbps | $X,XXX | MM/YYYY | Phase 2 |
| Site-04 | Small Branch | ISR 4331 | Provider-A | 100 Mbps | $XXX | MM/YYYY | Phase 1 (Pilot) |

## 1.2 Pain Points Assessment

### Common MPLS WAN Challenges

| Challenge | Impact | SD-WAN Solution |
|-----------|--------|-----------------|
| **High Costs** | $XXX-XXX per Mbps | Internet + cellular = $XX-XX per Mbps |
| **Long Provisioning** | 60-90 days for new circuits | Internet: 7-30 days, ZTP: <1 hour |
| **Inflexibility** | Static bandwidth, rigid policies | Dynamic bandwidth, app-aware routing |
| **Poor Cloud Performance** | Backhauling to DC, high latency | Direct Internet Access (DIA) |
| **Limited Visibility** | Basic SNMP, manual troubleshooting | Real-time analytics, AI insights |
| **Complex Changes** | Manual CLI per device | Centralized templates, mass updates |

### Gap Analysis

| Requirement | Current State | Desired State | Gap |
|-------------|---------------|---------------|-----|
| Site deployment time | 60-90 days | <7 days | ZTP automation |
| Transport diversity | Single MPLS | Multi-transport | Add DIA + LTE |
| Cloud connectivity | Via DC backhual | Direct local breakout | DIA + Cloud OnRamp |
| Visibility | Limited SNMP | Real-time analytics | vManage dashboards |
| Failover time | 30-60 seconds (IGP) | <5 seconds | BFD + IPsec |
| Cost per Mbps | $XXX-XXX | $XX-XX | Internet economics |

## 1.3 Traffic Analysis

### Baseline Traffic Patterns

**Required Data Collection:**
- [ ] 30-day NetFlow/IPFIX data from all sites
- [ ] Peak hour identification per site
- [ ] Top 10 applications by bandwidth
- [ ] Inter-site traffic matrix
- [ ] Internet-bound traffic percentage
- [ ] Cloud/SaaS traffic volumes

### Traffic Flow Matrix Template

| Source Site | Destination | Current Path | Volume (Mbps) | % of Total | Latency | Loss |
|-------------|-------------|--------------|---------------|------------|---------|------|
| Branch-01 | Data Center | Via MPLS hub | 50 | 40% | 25ms | 0.1% |
| Branch-01 | Internet | Via DC | 40 | 32% | 60ms | 0.5% |
| Branch-01 | M365 Cloud | Via DC | 25 | 20% | 80ms | 1% |
| Branch-01 | Branch-02 | Via MPLS hub | 10 | 8% | 35ms | 0.2% |

### Application Baseline

| Application | Protocol | Port | Current BW | Latency Req | Post-Migration Transport |
|-------------|----------|------|------------|-------------|-------------------------|
| SAP ERP | TCP | 3200 | 20 Mbps | <100ms | MPLS primary, DIA backup |
| M365 | HTTPS | 443 | 50 Mbps | <50ms | DIA (local breakout) |
| Webex | UDP | 5004 | 10 Mbps | <150ms | Best path (AAR) |
| Backup | TCP | 443 | 100 Mbps | <500ms | Best-effort, any transport |

---

## 2. Migration Strategy

## 2.1 Migration Approach

### Parallel Running Strategy

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    PARALLEL RUNNING ARCHITECTURE                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   PHASE 1: INITIAL STATE (MPLS Only)                                     │
│   ┌──────────────┐                                                       │
│   │  Existing    │                                                       │
│   │  MPLS WAN    │────► All Production Traffic                          │
│   │  (ISR)       │                                                       │
│   └──────────────┘                                                       │
│                                                                           │
│                                                                           │
│   PHASE 2: PARALLEL RUNNING (MPLS + SD-WAN)                              │
│   ┌──────────────┐                                                       │
│   │  Existing    │────► 100% Production Traffic (Primary)               │
│   │  MPLS WAN    │                                                       │
│   │  (ISR)       │                                                       │
│   └──────────────┘                                                       │
│          │                                                                │
│          │ (Both Active)                                                 │
│          │                                                                │
│   ┌──────▼───────┐                                                       │
│   │   SD-WAN     │────► 0% Production, Validation & Testing             │
│   │  (C8000)     │                                                       │
│   └──────────────┘                                                       │
│                                                                           │
│                                                                           │
│   PHASE 3: GRADUAL CUTOVER (Traffic Migration)                           │
│   ┌──────────────┐                                                       │
│   │  Existing    │────► 20% Production (Non-critical)                   │
│   │  MPLS WAN    │                                                       │
│   │  (ISR)       │                                                       │
│   └──────────────┘                                                       │
│          │                                                                │
│          │ (Load share)                                                  │
│          │                                                                │
│   ┌──────▼───────┐                                                       │
│   │   SD-WAN     │────► 80% Production (Test applications)              │
│   │  (C8000)     │                                                       │
│   └──────────────┘                                                       │
│                                                                           │
│                                                                           │
│   PHASE 4: FULL CUTOVER (SD-WAN Primary)                                 │
│   ┌──────────────┐                                                       │
│   │  Existing    │────► Standby (Emergency rollback only)               │
│   │  MPLS WAN    │                                                       │
│   │  (ISR)       │                                                       │
│   └──────────────┘                                                       │
│          │                                                                │
│          │                                                                │
│          │                                                                │
│   ┌──────▼───────┐                                                       │
│   │   SD-WAN     │────► 100% Production Traffic                          │
│   │  (C8000)     │                                                       │
│   └──────────────┘                                                       │
│                                                                           │
│                                                                           │
│   PHASE 5: DECOMMISSION (MPLS Retirement)                                │
│   ┌──────────────┐                                                       │
│   │   SD-WAN     │────► 100% Production Traffic                          │
│   │  (C8000)     │                                                       │
│   │  Established │                                                       │
│   └──────────────┘                                                       │
│                                                                           │
│   (Old MPLS circuits terminated, ISR retired)                            │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

### Migration Models

| Model | Description | Risk Level | Duration | Use Case |
|-------|-------------|------------|----------|----------|
| **Big Bang** | Cut all sites in one weekend | High | 2-3 days | <10 sites, homogeneous |
| **Phased by Site** | Migrate sites one by one | Low | 3-6 months | Recommended for most |
| **Phased by Application** | Migrate apps one by one | Medium | 4-8 months | Complex app dependencies |
| **Pilot + Rollout** | Pilot 2-3 sites, then mass rollout | Low | 4-8 months | **Recommended** |

## 2.2 Risk Mitigation

### Risk Assessment Matrix

| Risk | Likelihood | Impact | Mitigation | Contingency |
|------|------------|--------|------------|-------------|
| **Application incompatibility** | Medium | High | Pre-migration testing | Immediate rollback |
| **Transport provider delays** | High | Medium | Order circuits early | Cellular backup |
| **Performance degradation** | Low | High | Parallel running | Route via old WAN |
| **Certificate issues** | Low | High | Pre-staging, validation | Manual cert install |
| **User resistance** | Medium | Medium | Training, communication | Gradual migration |
| **Configuration errors** | Low | High | Template validation | Automated rollback |

### Risk Mitigation Strategies

**Pre-Migration:**
- [ ] Comprehensive lab validation
- [ ] Pilot deployment (2-3 non-critical sites)
- [ ] Application compatibility testing
- [ ] Performance baseline capture
- [ ] Rollback plan documentation

**During Migration:**
- [ ] Parallel running (MPLS + SD-WAN)
- [ ] Gradual traffic cutover
- [ ] 24/7 monitoring during cutover windows
- [ ] Immediate rollback capability
- [ ] Vendor support on standby

**Post-Migration:**
- [ ] Extended monitoring (30 days)
- [ ] Performance comparison reports
- [ ] User satisfaction surveys
- [ ] Lessons learned documentation
- [ ] Decommission planning

---

## 3. Migration Architecture

## 3.1 Target State Architecture

### Future State SD-WAN

```
┌──────────────────────────────────────────────────────────────────────────┐
│                  TARGET STATE - SD-WAN ARCHITECTURE                       │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│                      ┌─────────────────────┐                             │
│                      │  SD-WAN Manager     │                             │
│                      │  (vManage Cluster)  │                             │
│                      └──────────┬──────────┘                             │
│                                 │                                         │
│              ┌──────────────────┼──────────────────┐                     │
│              │                  │                  │                     │
│        ┌─────▼──────┐    ┌─────▼──────┐    ┌─────▼──────┐              │
│        │  vSmart    │    │  vSmart    │    │  vBond     │              │
│        │  Region-A  │    │  Region-B  │    │  Cloud     │              │
│        └─────┬──────┘    └─────┬──────┘    └─────┬──────┘              │
│              │                  │                  │                     │
│              └──────────────────┴──────────────────┘                     │
│                                 │                                         │
│                        CONTROL PLANE (OMP)                               │
│                                 │                                         │
│       ┌─────────────────────────┴─────────────────────────┐             │
│       │                                                     │             │
│  ┌────▼──────┐                                    ┌────────▼───┐        │
│  │ Hub WAN   │◄──────────────────────────────────►│ Hub WAN    │        │
│  │ Edge (C8K)│      Full Mesh IPsec Tunnels      │ Edge (C8K) │        │
│  │ Multi-Xprt│                                    │ Multi-Xprt │        │
│  └────┬──────┘                                    └────┬───────┘        │
│       │                                                 │                 │
│       │  ┌─────────────────┬─────────────────┬────────┘                 │
│       │  │                 │                 │                           │
│  ┌────▼──▼──┐         ┌───▼────┐       ┌───▼────┐                      │
│  │ Branch   │         │ Branch │       │ Branch │                      │
│  │ C8200    │         │ C8200  │       │ C8200  │                      │
│  │ DIA+LTE  │         │DIA+LTE │       │DIA+LTE │                      │
│  └──────────┘         └────────┘       └────────┘                      │
│                                                                           │
│  BENEFITS:                                                                │
│  ✓ Multi-transport (MPLS, Internet, LTE, 5G)                            │
│  ✓ Application-aware routing                                             │
│  ✓ Direct Internet Access for SaaS                                      │
│  ✓ Automated provisioning (ZTP)                                          │
│  ✓ Centralized management                                                │
│  ✓ 60-70% cost reduction                                                 │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

## 3.2 Hybrid State Architecture

### Transition Architecture (During Migration)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                  HYBRID STATE - MPLS + SD-WAN COEXISTENCE                 │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   DATA CENTER / HUB SITE                                                 │
│   ┌──────────────────────────────────────────────────────────┐          │
│   │                                                             │          │
│   │   ┌──────────────┐              ┌──────────────┐         │          │
│   │   │ Legacy MPLS  │              │  SD-WAN      │         │          │
│   │   │ Router       │              │  WAN Edge    │         │          │
│   │   │ (ISR 4K)     │              │  (C8000)     │         │          │
│   │   └──────┬───────┘              └──────┬───────┘         │          │
│   │          │                              │                 │          │
│   │          │         ┌────────────────────┤                 │          │
│   │          │         │                    │                 │          │
│   │          │   ┌─────▼──────┐       ┌────▼──────┐          │          │
│   │          │   │   MPLS     │       │ Internet  │          │          │
│   │          │   │  Circuit   │       │ Circuit   │          │          │
│   │          │   └────────────┘       └───────────┘          │          │
│   │          │                                                 │          │
│   │   ┌──────▼─────────────────────────────────────────┐     │          │
│   │   │        Data Center Core / Distribution         │     │          │
│   │   │  (Both MPLS and SD-WAN routes available)       │     │          │
│   │   └────────────────────────────────────────────────┘     │          │
│   │                                                             │          │
│   └──────────────────────────────────────────────────────────┘          │
│                                                                           │
│   BRANCH SITE (Mixed)                                                    │
│   ┌──────────────────────────────────────────────────────────┐          │
│   │  Site A: MPLS Only      Site B: SD-WAN Only    Site C: Both         │
│   │  (Not Migrated)         (Migrated)             (In Progress)         │
│   │                                                                       │
│   │  ┌──────────┐           ┌──────────┐           ┌──────────┐        │
│   │  │   ISR    │           │  C8200   │           │   ISR    │        │
│   │  │   MPLS   │           │ DIA+LTE  │           │  (Stdby) │        │
│   │  └────┬─────┘           └────┬─────┘           └──────────┘        │
│   │       │                      │                  ┌──────────┐        │
│   │       │                      │                  │  C8200   │        │
│   │       │                      │                  │ (Active) │        │
│   │       │                      │                  └────┬─────┘        │
│   │       │                      │                       │               │
│   │       └──────────────────────┴───────────────────────┘               │
│   │                              │                                       │
│   │                    ┌─────────▼─────────┐                            │
│   │                    │  Branch LAN       │                            │
│   │                    └───────────────────┘                            │
│   └──────────────────────────────────────────────────────────────────┘  │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

### Coexistence Routing Strategy

| Scenario | Routing Method | Preference | Notes |
|----------|----------------|------------|-------|
| Hub: MPLS vs. SD-WAN | BGP or static routes | SD-WAN preferred | Use route metrics |
| Branch (during transition) | Dual default routes | SD-WAN primary | MPLS via higher metric |
| Application-specific | PBR on old router | Critical apps via MPLS | Until validated |
| Failback | Manual or automatic | Site-specific | Define in runbook |

---

## 4. Hardware & Capacity Planning

## 4.1 Hardware Migration Matrix

### Platform Replacement Guide

| Legacy Platform | Replacement | Throughput | Interfaces | Migration Notes |
|-----------------|-------------|------------|------------|-----------------|
| ASR 1001-X | C8500-12X4QC | 1G → 100G | 10G ports | DC/large hub |
| ASR 1002-HX | C8300-2N2S-6T | 500M → 10G | 10G ports | Regional hub |
| ISR 4451 | C8300-1N1S-4T2X | 500M → 5G | 1G/10G ports | Large branch |
| ISR 4351 | C8200-1N-4T | 200M → 2G | 1G ports | Medium branch |
| ISR 4331 | C8200L-1N-4T | 100M → 1G | 1G ports | Small branch |
| ISR 4321 | C8200L-1N-4T | 50M → 500M | 1G ports | Small branch |

### Hardware Procurement Planning

**Phased Procurement:**
- [ ] **Phase 0 (Foundation):** Controllers (vManage, vSmart, vBond)
- [ ] **Phase 1 (Pilot):** 2-3 pilot site WAN edges
- [ ] **Phase 2 (Branch Wave 1):** 20-30% of branch sites
- [ ] **Phase 3 (Branch Wave 2):** 40-50% of branch sites
- [ ] **Phase 4 (Hubs):** Hub/DC WAN edges
- [ ] **Phase 5 (Completion):** Remaining branches

## 4.2 Capacity Rightsizing

### Bandwidth Reassessment

**Opportunity: Bandwidth Optimization**

| Site | Current MPLS BW | Utilization | Recommended SD-WAN BW | Transport Mix | Savings |
|------|-----------------|-------------|----------------------|---------------|---------|
| Branch-01 | 100 Mbps | 40% | 100M DIA + 50M LTE | Internet primary | 60% |
| Branch-02 | 200 Mbps | 60% | 200M DIA + 100M LTE | Internet primary | 55% |
| Hub-01 | 500 Mbps | 80% | 500M DIA + 1G LTE | Multi-transport | 40% |

### Transport Replacement Strategy

```
┌──────────────────────────────────────────────────────────────────────────┐
│                   TRANSPORT MIGRATION STRATEGY                            │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   PHASE 1: ADD NEW TRANSPORTS (Parallel)                                 │
│   ┌────────────────────────────────────────────────────────┐            │
│   │  Site: Branch-01                                        │            │
│   │  ┌─────────────┐    ┌─────────────┐   ┌────────────┐  │            │
│   │  │ MPLS (Keep) │    │ DIA (Add)   │   │ LTE (Add)  │  │            │
│   │  │ 100 Mbps    │    │ 200 Mbps    │   │ 50 Mbps    │  │            │
│   │  │ $X,XXX/mo   │    │ $XXX/mo     │   │ $XXX/mo    │  │            │
│   │  └─────────────┘    └─────────────┘   └────────────┘  │            │
│   │                                                          │            │
│   │  Total Cost (Parallel): $X,XXX/month                    │            │
│   └────────────────────────────────────────────────────────┘            │
│                                                                           │
│   PHASE 2: MIGRATE TRAFFIC (Validation)                                  │
│   ┌────────────────────────────────────────────────────────┐            │
│   │  Traffic Distribution:                                  │            │
│   │  ├─ MPLS: 20% (critical apps only)                     │            │
│   │  ├─ DIA: 70% (majority of traffic)                     │            │
│   │  └─ LTE: 10% (overflow/backup)                         │            │
│   │                                                          │            │
│   │  Validation Period: 30 days                             │            │
│   └────────────────────────────────────────────────────────┘            │
│                                                                           │
│   PHASE 3: DECOMMISSION MPLS (Cost Savings)                              │
│   ┌────────────────────────────────────────────────────────┐            │
│   │  Site: Branch-01 (Post-Migration)                       │            │
│   │  ┌─────────────┐   ┌────────────┐                      │            │
│   │  │ DIA         │   │ LTE        │                      │            │
│   │  │ 200 Mbps    │   │ 50 Mbps    │                      │            │
│   │  │ $XXX/mo     │   │ $XXX/mo    │                      │            │
│   │  └─────────────┘   └────────────┘                      │            │
│   │                                                          │            │
│   │  Total Cost (Final): $XXX/month                         │            │
│   │  Monthly Savings: $XXX (60% reduction)                  │            │
│   └────────────────────────────────────────────────────────┘            │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Migration Phases

## 5.1 Phase 0: Foundation

### Timeline: Weeks 1-6

**Objectives:**
- Deploy SD-WAN controllers
- Configure management plane
- Create templates and policies
- Lab validation

**Deliverables:**
- [ ] vManage 3-node cluster operational
- [ ] vSmart controllers deployed (2+)
- [ ] vBond validators deployed (2)
- [ ] Feature templates created
- [ ] Device templates created
- [ ] Policy templates created
- [ ] Lab environment validated

### Controller Deployment

| Component | Quantity | Deployment | IP Addressing |
|-----------|----------|------------|---------------|
| vManage | 3 + 3 DR | Primary DC + DR site | Management subnet |
| vSmart | 2 per region | Distributed | Management subnet |
| vBond | 2 | Cloud-hosted | Public IP required |

## 5.2 Phase 1: Pilot

### Timeline: Weeks 7-10

**Objectives:**
- Deploy 2-3 pilot sites
- Validate ZTP process
- Test parallel running
- User acceptance testing

**Pilot Site Selection Criteria:**
- Non-critical site (low business risk)
- Moderate complexity (representative)
- Good network connectivity (fast troubleshooting)
- Local champion (engaged user community)

### Pilot Site Runbook

**Week 7: Planning**
- [ ] Select pilot sites (2-3 recommended)
- [ ] Order DIA and LTE circuits
- [ ] Procure WAN edge hardware
- [ ] Create site-specific templates
- [ ] Schedule cutover window

**Week 8-9: Installation**
- [ ] Install DIA circuit
- [ ] Install LTE backup
- [ ] Ship WAN edge hardware
- [ ] Stage device in vManage
- [ ] Pre-configure ZTP

**Week 10: Cutover & Validation**
- [ ] Power on WAN edge (ZTP)
- [ ] Validate control plane
- [ ] Validate data plane tunnels
- [ ] Parallel run with MPLS
- [ ] Gradual traffic migration
- [ ] 7-day stabilization period

### Pilot Success Criteria

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| ZTP success rate | 100% | | |
| Tunnel establishment time | <5 minutes | | |
| Control plane stability | 0 flaps | | |
| Application performance | ≥ baseline | | |
| User satisfaction | >80% positive | | |
| Issues found | Document all | | |

## 5.3 Phase 2: Branch Wave 1

### Timeline: Weeks 11-18

**Objectives:**
- Deploy 30-40% of branch sites
- Establish migration rhythm
- Refine processes based on pilot

**Site Prioritization:**
- Small branches first (lower risk)
- Sites with MPLS contracts expiring soon
- Sites with poor current performance
- Sites with lowest user counts

### Weekly Migration Cadence

| Week | Sites | Cumulative | Activities |
|------|-------|------------|------------|
| 11 | 5 | 5 | Deploy batch 1 |
| 12 | 5 | 10 | Monitor batch 1, deploy batch 2 |
| 13 | 5 | 15 | Monitor batch 2, deploy batch 3 |
| 14 | 5 | 20 | Monitor batch 3, deploy batch 4 |
| 15 | 5 | 25 | Monitor batch 4, deploy batch 5 |
| 16-18 | Continue | 30-50 | Accelerate pace |

## 5.4 Phase 3: Branch Wave 2

### Timeline: Weeks 19-24

**Objectives:**
- Deploy remaining branch sites
- Include larger, more complex branches

**Site Characteristics:**
- Large branches (higher user counts)
- Complex applications
- Regional hub sites

### Migration Velocity

**Target:** 8-10 sites per week (as processes mature)

## 5.5 Phase 4: Hub/Data Center Migration

### Timeline: Weeks 25-28

**Objectives:**
- Migrate hub and data center sites
- Highest risk, highest impact
- Extensive validation required

### Hub Migration Strategy

**Hub Site Characteristics:**
- Dual WAN edges (HA)
- Multiple transports (MPLS + DIA + 5G)
- SD-Access handoff (if applicable)
- High bandwidth requirements

**Special Considerations:**
- [ ] Deploy both WAN edges simultaneously
- [ ] Establish full mesh with all hubs
- [ ] Migrate inter-hub traffic first
- [ ] Migrate branch-to-hub traffic last
- [ ] Extended parallel running (2-4 weeks)
- [ ] 24/7 monitoring during transition

## 5.6 Phase 5: Optimization & MPLS Decommission

### Timeline: Weeks 29-32

**Objectives:**
- Fine-tune policies and performance
- Decommission legacy MPLS circuits
- Project closeout

**Activities:**
- [ ] Optimize application policies (AAR)
- [ ] Fine-tune QoS
- [ ] Review transport utilization
- [ ] Send MPLS circuit termination notices (90 days)
- [ ] Decommission old WAN routers
- [ ] Final cost comparison
- [ ] Lessons learned documentation
- [ ] Operational handover

---

## 6. Site Migration Runbook

## 6.1 Pre-Migration (T-2 weeks)

### Checklist

- [ ] **Site information gathered:**
  - [ ] Site name, address, site ID
  - [ ] Current WAN bandwidth and utilization
  - [ ] Application inventory
  - [ ] User count
  - [ ] Contact information (IT, facility)

- [ ] **Transport circuits ordered:**
  - [ ] DIA circuit ordered (30-45 day lead time)
  - [ ] LTE/5G SIM card ordered
  - [ ] Circuit IDs documented

- [ ] **Hardware staged:**
  - [ ] WAN Edge hardware ordered
  - [ ] NIMs/Service modules selected
  - [ ] Hardware shipped to site
  - [ ] Tracking number documented

- [ ] **vManage configuration:**
  - [ ] Device added to vManage inventory
  - [ ] Site ID assigned
  - [ ] System IP assigned
  - [ ] Device template created
  - [ ] Policies assigned

- [ ] **Cutover planning:**
  - [ ] Maintenance window scheduled
  - [ ] Stakeholders notified
  - [ ] Rollback plan documented
  - [ ] Change ticket opened

## 6.2 Migration Day (T=0)

### Hour-by-Hour Runbook

**T-0 (Start of Maintenance Window)**
- [ ] Join bridge/conference call
- [ ] Verify team roster (network, site contact, vendor)
- [ ] Capture baseline (ping tests, application tests)
- [ ] Take screenshots of current WAN stats

**T+0:15 (Installation)**
- [ ] Connect DIA circuit to WAN Edge
- [ ] Connect LTE/5G module
- [ ] Connect LAN interfaces to switch
- [ ] Power on WAN Edge
- [ ] Verify console access

**T+0:30 (ZTP Process)**
- [ ] Verify DHCP address obtained
- [ ] Verify DNS resolution (vBond)
- [ ] Monitor ZTP process on vManage
- [ ] Verify certificate exchange
- [ ] Verify control plane connections

**T+1:00 (Validation)**
- [ ] Verify OMP sessions (2+ vSmarts)
- [ ] Verify BFD tunnels (all green)
- [ ] Verify route learning
- [ ] Test basic connectivity (ping DC, hub)

**T+1:30 (Parallel Running)**
- [ ] Configure routing to prefer MPLS
- [ ] Allow SD-WAN as backup
- [ ] Test failover (disconnect MPLS briefly)
- [ ] Verify traffic returns to MPLS

**T+2:00 (Application Testing)**
- [ ] Test critical applications
  - [ ] ERP/SAP
  - [ ] Voice/Video
  - [ ] VDI/Citrix
  - [ ] Email
  - [ ] File sharing
- [ ] Compare performance to baseline

**T+3:00 (Gradual Cutover)**
- [ ] Shift 25% traffic to SD-WAN (adjust routing)
- [ ] Monitor for 15 minutes
- [ ] Shift 50% traffic to SD-WAN
- [ ] Monitor for 15 minutes
- [ ] Shift 75% traffic to SD-WAN
- [ ] Monitor for 15 minutes
- [ ] Shift 100% traffic to SD-WAN
- [ ] Monitor for 30 minutes

**T+4:00 (Stabilization)**
- [ ] Verify all applications functional
- [ ] Verify performance meets SLA
- [ ] Verify no error logs
- [ ] Leave MPLS as standby

**T+4:30 (Closeout)**
- [ ] Document any issues encountered
- [ ] Capture final statistics
- [ ] Close change ticket
- [ ] Schedule post-migration review (T+7 days)

## 6.3 Post-Migration (T+1 week)

### 7-Day Monitoring

- [ ] Daily dashboard review
- [ ] Daily incident review
- [ ] Application performance tracking
- [ ] Transport utilization analysis
- [ ] User feedback collection

### 7-Day Review Meeting

- [ ] Review performance metrics vs. baseline
- [ ] Review incident log
- [ ] Assess user satisfaction
- [ ] Decision: Full cutover or rollback
- [ ] If approved: Schedule MPLS decommission (T+30 days)

---

## 7. Rollback Procedures

## 7.1 Rollback Decision Criteria

### When to Rollback

| Scenario | Severity | Action |
|----------|----------|--------|
| **Application unavailable** | Critical | Immediate rollback |
| **Performance <50% baseline** | High | Rollback within 2 hours |
| **Intermittent connectivity** | Medium | Investigate, prepare rollback |
| **Single transport failure** | Low | Continue, leverage redundancy |

## 7.2 Rollback Procedures

### Immediate Rollback (Emergency)

**Duration: <15 minutes**

1. **Announce rollback decision**
   - Notify all stakeholders immediately

2. **Revert routing**
   - Increase MPLS route preference (decrease metric)
   - Decrease SD-WAN route preference (increase metric)
   - OR: Administratively shutdown SD-WAN interfaces

3. **Verify traffic flow**
   - Confirm traffic using MPLS
   - Test application connectivity
   - Verify baseline performance

4. **Document incident**
   - Capture logs from WAN Edge
   - Capture vManage alerts/alarms
   - Screenshot current state
   - Schedule post-mortem

### Graceful Rollback (Planned)

**Duration: 30-60 minutes**

1. **Gradual traffic shift**
   - Move 75% traffic to MPLS
   - Monitor for 10 minutes
   - Move 50% traffic to MPLS
   - Monitor for 10 minutes
   - Move 100% traffic to MPLS

2. **Validate stability**
   - Monitor for 30 minutes
   - Test all applications
   - Collect user feedback

3. **Determine root cause**
   - Analyze logs
   - Engage vendor support
   - Develop remediation plan
   - Schedule re-attempt

## 7.3 Rollback Testing

### Pre-Migration Rollback Test

**Recommended: Test rollback during pilot phase**

- [ ] Cutover to SD-WAN
- [ ] Run for 1 hour
- [ ] Deliberately initiate rollback
- [ ] Measure rollback time
- [ ] Verify application recovery
- [ ] Document lessons learned

---

## 8. Financial Analysis

## 8.1 Total Cost of Ownership (TCO)

### Cost Comparison Framework

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        TCO ANALYSIS (5-YEAR)                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   MPLS WAN (Current State)                                               │
│   ┌────────────────────────────────────────────────────┐                │
│   │  Annual Costs:                                      │                │
│   │  ├─ MPLS circuits: $XXX,XXX                        │                │
│   │  ├─ Router maintenance: $XX,XXX                    │                │
│   │  ├─ Network management: $XX,XXX                    │                │
│   │  └─ Carrier support: $XX,XXX                       │                │
│   │                                                      │                │
│   │  5-Year Total: $X,XXX,XXX                           │                │
│   └────────────────────────────────────────────────────┘                │
│                                                                           │
│                                                                           │
│   SD-WAN (Future State)                                                  │
│   ┌────────────────────────────────────────────────────┐                │
│   │  One-Time Costs:                                    │                │
│   │  ├─ WAN Edge hardware: $XXX,XXX                    │                │
│   │  ├─ Controller licenses: $XX,XXX                   │                │
│   │  ├─ Professional services: $XX,XXX                 │                │
│   │  └─ Training: $XX,XXX                              │                │
│   │                                                      │                │
│   │  Annual Recurring Costs:                            │                │
│   │  ├─ DIA circuits: $XXX,XXX (40% of MPLS)           │                │
│   │  ├─ LTE/5G backup: $XX,XXX                         │                │
│   │  ├─ DNA licenses: $XX,XXX                          │                │
│   │  ├─ Support: $XX,XXX                               │                │
│   │  └─ Management: $XX,XXX                            │                │
│   │                                                      │                │
│   │  5-Year Total: $X,XXX,XXX                           │                │
│   └────────────────────────────────────────────────────┘                │
│                                                                           │
│                                                                           │
│   NET SAVINGS: $XXX,XXX (X% reduction)                                   │
│   PAYBACK PERIOD: XX months                                              │
│   ROI: XX%                                                                │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

### Cost Model Template

| Component | MPLS (Annual) | SD-WAN (Annual) | Savings | Notes |
|-----------|---------------|-----------------|---------|-------|
| **Circuits** | | | | |
| Hub sites (6) | $XXX,XXX | $XX,XXX | $XXX,XXX | DIA 60% cheaper |
| Large branches (10) | $XXX,XXX | $XX,XXX | $XXX,XXX | DIA primary |
| Small branches (30) | $XXX,XXX | $XX,XXX | $XXX,XXX | DIA + LTE |
| **Hardware** | | | | |
| WAN routers | $XX,XXX | $XX,XXX (one-time) | - | Amortize over 5 years |
| Maintenance | $XX,XXX | $XX,XXX | $X,XXX | Lower maintenance |
| **Management** | | | | |
| Tools/licenses | $XX,XXX | $XX,XXX | $X,XXX | DNA Advantage |
| Operational labor | $XXX,XXX | $XX,XXX | $XX,XXX | Automation savings |
| **Total Annual** | **$X.X M** | **$X.X M** | **$XXX K** | **XX% savings** |

## 8.2 Return on Investment (ROI)

### ROI Calculation

```
ROI = (Net Benefit - Investment Cost) / Investment Cost × 100

Where:
  Net Benefit = (Annual MPLS Costs - Annual SD-WAN Costs) × 5 years
  Investment Cost = One-time implementation costs

Example:
  Annual MPLS: $X,XXX,XXX
  Annual SD-WAN: $XXX,XXX
  Savings/year: $X,XXX,XXX
  5-year savings: $X,XXX,XXX
  
  Implementation: $X,XXX,XXX
  
  ROI = ($XM - $X.XM) / $X.XM × 100 = 300%
  Payback Period = $X.XM / $X.XM = 1.25 years
```

### Business Case Summary

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| 5-Year Savings | $X.X M | >$X M | ✓ |
| Annual Savings | $X.X M | >$X M | ✓ |
| Payback Period | XX months | <24 months | ✓ |
| ROI | XX% | >100% | ✓ |
| Risk Level | Low/Medium/High | Low | ✓ |

## 8.3 MPLS Decommission Plan

### Circuit Termination Schedule

| Site | MPLS Provider | Contract End | Notice Period | Termination Date | Est. Savings/Month |
|------|---------------|--------------|---------------|------------------|-------------------|
| Site-01 | Provider-A | MM/YYYY | 90 days | T+120 days | $X,XXX |
| Site-02 | Provider-A | MM/YYYY | 90 days | T+120 days | $X,XXX |
| Site-03 | Provider-B | MM/YYYY | 60 days | T+90 days | $XXX |

### Decommission Process

**T+30 Days (Post-Migration Validation)**
- [ ] Verify 30-day stability
- [ ] Review performance reports
- [ ] Confirm user satisfaction
- [ ] Management approval for decommission

**T+30 to T+120 Days (Notice Period)**
- [ ] Send circuit termination notices
- [ ] Verify notice acceptance
- [ ] Schedule disconnection dates
- [ ] Plan equipment return (if leased)

**T+120 Days (Circuit Disconnection)**
- [ ] Provider disconnects circuits
- [ ] Verify final billing
- [ ] Return leased equipment
- [ ] Archive old router configs
- [ ] Retire old hardware

**T+150 Days (Project Closeout)**
- [ ] Final financial reconciliation
- [ ] Calculate actual vs. projected savings
- [ ] Project closure report
- [ ] Celebrate success! 🎉

---

## Appendix A: Migration Checklist Summary

### Master Checklist

**Foundation Phase**
- [ ] Controllers deployed and validated
- [ ] Templates and policies created
- [ ] Lab testing complete

**Pilot Phase**
- [ ] 2-3 pilot sites selected
- [ ] Pilot deployment successful
- [ ] Success criteria met
- [ ] Lessons learned documented

**Branch Migration**
- [ ] Wave 1 complete (30-40% sites)
- [ ] Wave 2 complete (remaining sites)
- [ ] All branches operational

**Hub Migration**
- [ ] Hub sites migrated
- [ ] Inter-hub connectivity validated
- [ ] Extended monitoring complete

**Closeout**
- [ ] 30-day post-migration validation
- [ ] MPLS decommission notices sent
- [ ] Financial analysis complete
- [ ] Operational handover
- [ ] Project closure report

---

## Appendix B: Common Migration Issues

| Issue | Symptom | Root Cause | Resolution |
|-------|---------|------------|------------|
| **ZTP failure** | Device not joining | DHCP opt 43 missing | Configure DHCP option |
| **Certificate error** | Control plane down | Expired/invalid cert | Regenerate certificate |
| **Poor performance** | High latency | Suboptimal path | Tune AAR policy |
| **App incompatibility** | App fails over SD-WAN | Hardcoded IPs | Update app config |
| **Tunnel flapping** | Intermittent connectivity | ISP instability | Adjust BFD timers |

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2026 | Network Architecture Team | Initial migration template |

---

**End of SD-WAN Migration Project Template**

*This document is a template. Customize all sections with your specific migration requirements, timelines, site details, and organizational processes.*

---

**Related Templates:**
- [SD-WAN Greenfield Deployment Template](#)
- [Site Migration Runbook](#)
- [Rollback Procedure](#)
- [Financial Analysis Worksheet](#)
