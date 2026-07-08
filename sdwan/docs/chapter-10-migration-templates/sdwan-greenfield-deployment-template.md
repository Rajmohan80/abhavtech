# SD-WAN Greenfield Deployment Template
## Enterprise Network Transformation Guide
### Cisco Catalyst SD-WAN | Zero-Touch Provisioning | Multi-Cloud Integration

---

## Document Information

| Field | Value |
|-------|-------|
| Document Title | SD-WAN Greenfield Deployment Template |
| Version | 1.0 |
| Date | January 2026 |
| Classification | Template - Reusable |
| Purpose | Generic template for greenfield SD-WAN deployments |

---

## Document Purpose

This template provides a comprehensive framework for planning and deploying a greenfield Cisco Catalyst SD-WAN solution. Use this as a starting point to customize for your specific organizational requirements.

**Scope:**
- Complete greenfield SD-WAN deployment
- Multi-site WAN transformation
- Cloud connectivity integration
- Security and segmentation
- Automated provisioning and operations

---

## Table of Contents

1. [Discovery & Requirements](#1-discovery--requirements)
2. [Architecture Design](#2-architecture-design)
3. [Hardware Selection](#3-hardware-selection)
4. [Capacity Planning](#4-capacity-planning)
5. [Traffic Flow Design](#5-traffic-flow-design)
6. [Implementation Planning](#6-implementation-planning)
7. [Validation & Testing](#7-validation--testing)
8. [Operations Handover](#8-operations-handover)

---

## 1. Discovery & Requirements

## 1.1 Business Requirements

### Strategic Objectives
- [ ] Define business drivers for SD-WAN adoption
- [ ] Identify cost reduction targets (e.g., MPLS savings %)
- [ ] Document agility requirements (site deployment time goals)
- [ ] Define cloud connectivity priorities (AWS, Azure, M365, etc.)
- [ ] Establish operational efficiency goals
- [ ] Document business continuity requirements

### Success Criteria
- [ ] Define availability targets (99.9%, 99.95%, 99.99%)
- [ ] Set application performance SLAs
- [ ] Establish migration timeline milestones
- [ ] Define ROI metrics
- [ ] Set user satisfaction KPIs

## 1.2 Site Discovery

### Site Classification

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          SITE CLASSIFICATION                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   DATA CENTER/HUB SITES                BRANCH SITES                       │
│   ┌─────────────────────┐              ┌─────────────────────┐          │
│   │ • Large facilities  │              │ • Remote offices     │          │
│   │ • Dual WAN Edges    │              │ • Single WAN Edge    │          │
│   │ • Multiple transports│             │ • Dual transport     │          │
│   │ • SD-Access handoff │              │ • Limited staff      │          │
│   │ • High bandwidth    │              │ • Variable BW needs  │          │
│   └─────────────────────┘              └─────────────────────┘          │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

### Site Inventory Template

| Site Name | Site Type | Region | Users | Current WAN | Bandwidth Req | HA Req | Priority |
|-----------|-----------|--------|-------|-------------|---------------|--------|----------|
| Site-01 | Data Center | Region-A | XXX | MPLS | X Gbps | Dual | P1 |
| Site-02 | Regional Hub | Region-A | XXX | MPLS | XXX Mbps | Dual | P1 |
| Site-03 | Large Branch | Region-B | XXX | MPLS | XXX Mbps | Single | P2 |
| Site-04 | Small Branch | Region-C | XX | MPLS/Internet | XX Mbps | Single | P3 |

## 1.3 Application Discovery

### Application Classification

| Application | Type | Users | Bandwidth | Latency Req | Loss Tolerance | Transport | Priority |
|-------------|------|-------|-----------|-------------|----------------|-----------|----------|
| Voice/UC | Real-Time | All | 100K/call | <150ms | <1% | All | Critical |
| Video Conf | Real-Time | All | 2-4 Mbps | <200ms | <2% | All | Critical |
| ERP (SAP) | Business-Critical | 500 | Variable | <300ms | <3% | Preferred | High |
| M365 | SaaS | All | Variable | <100ms | <3% | DIA | High |
| File Transfer | Best-Effort | 100 | Bursty | <500ms | <5% | Any | Low |

### Traffic Baseline Requirements
- [ ] Capture 30-day bandwidth utilization baseline
- [ ] Identify peak traffic hours and patterns
- [ ] Document application-specific latency requirements
- [ ] Measure current quality metrics (loss, jitter)
- [ ] Map traffic flows between sites

## 1.4 Transport Assessment

### Transport Options Evaluation

| Transport Type | Use Case | Bandwidth | Cost/Mbps | SLA | Lead Time |
|----------------|----------|-----------|-----------|-----|-----------|
| MPLS | Primary (Hub) | 100M-1G | $$$ | 99.9% | 60-90 days |
| DIA Business Internet | Primary (Branch) | 100M-1G | $$ | 99.5% | 30-45 days |
| Broadband Internet | Secondary | 50M-500M | $ | Best effort | 7-14 days |
| 4G/5G LTE | Backup | 10M-100M | $$ | 99% | 1-7 days |
| LEO Satellite | Remote backup | 50M-200M | $$ | 99% | 14-30 days |

### Transport Decision Matrix
- [ ] Evaluate provider coverage per region
- [ ] Compare SLA guarantees and penalties
- [ ] Assess contract terms and flexibility
- [ ] Document ISP redundancy requirements
- [ ] Plan transport color assignments

## 1.5 Security Requirements

### Security Framework
- [ ] Document compliance requirements (PCI-DSS, HIPAA, GDPR, SOX)
- [ ] Define data-in-transit encryption standards
- [ ] Identify segmentation requirements (VPN/VRF)
- [ ] Assess firewall and UTD requirements
- [ ] Define zero-trust security objectives
- [ ] Plan DDoS protection requirements

### Security Zones

```
┌──────────────────────────────────────────────────────────────────────────┐
│                        SECURITY SEGMENTATION                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   VPN/VRF SEGMENTS:                                                       │
│                                                                           │
│   VPN 10 - Corporate (Users, Workstations)                               │
│   VPN 20 - Guest (Internet-only, isolated)                               │
│   VPN 30 - Servers (Data center applications)                            │
│   VPN 40 - Voice (UC, SIP trunks)                                        │
│   VPN 50 - IoT/OT (Smart building, industrial)                           │
│                                                                           │
│   VPN 0 - Transport (Underlay, management)                               │
│   VPN 512 - Management (Out-of-band management)                          │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Design

## 2.1 SD-WAN Architecture Overview

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                 CISCO CATALYST SD-WAN ARCHITECTURE                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│                      ┌─────────────────────┐                             │
│                      │  SD-WAN Manager     │                             │
│                      │  (vManage Cluster)  │                             │
│                      │  3-Node HA          │                             │
│                      └──────────┬──────────┘                             │
│                                 │                                         │
│              ┌──────────────────┼──────────────────┐                     │
│              │                  │                  │                     │
│        ┌─────▼──────┐    ┌─────▼──────┐    ┌─────▼──────┐              │
│        │ SD-WAN     │    │ SD-WAN     │    │  SD-WAN    │              │
│        │ Controller │    │ Controller │    │ Validator  │              │
│        │ (vSmart)   │    │ (vSmart)   │    │  (vBond)   │              │
│        │  Region 1  │    │  Region 2  │    │  Cloud     │              │
│        └─────┬──────┘    └─────┬──────┘    └─────┬──────┘              │
│              │                  │                  │                     │
│              └──────────────────┼──────────────────┘                     │
│                                 │                                         │
│                    CONTROL PLANE (DTLS/OMP)                              │
│                                 │                                         │
│       ┌─────────────────────────┴─────────────────────────┐             │
│       │                                                     │             │
│  ┌────▼──────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │             │
│  │  WAN      │  │  WAN     │  │  WAN     │  │  WAN     │ │             │
│  │  Edge 1   │  │  Edge 2  │  │  Edge 3  │  │  Edge N  │ │             │
│  │  (Hub)    │  │  (Hub)   │  │ (Branch) │  │ (Branch) │ │             │
│  └────┬──────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘ │             │
│       │              │              │              │       │             │
│       └──────────────┴──────────────┴──────────────┘       │             │
│                                                             │             │
│                  DATA PLANE (IPsec Tunnels)                 │             │
│                                                             │             │
└──────────────────────────────────────────────────────────────────────────┘
```

### Component Roles

| Component | Role | Quantity | Deployment Location |
|-----------|------|----------|---------------------|
| SD-WAN Manager (vManage) | Centralized management | 3 (cluster) + DR | Primary DC + DR site |
| SD-WAN Controller (vSmart) | Control plane, route distribution | 2-4 | Regional distribution |
| SD-WAN Validator (vBond) | ZTP orchestration | 2 | Cloud-hosted (public IP) |
| WAN Edge | Data plane forwarding | Per site | All sites |

## 2.2 Control Plane Design

### Controller Placement Strategy

| Deployment Model | Use Case | Pros | Cons |
|------------------|----------|------|------|
| Centralized (Single Region) | <10 sites, single region | Simple, low cost | Single point of failure |
| Regional Distribution | 10-100 sites, multi-region | Optimal latency, scalability | Higher complexity |
| Geo-Redundant | >100 sites, global | Maximum resilience | Highest cost/complexity |

### Controller Capacity Planning

| Parameter | Small Deployment | Medium Deployment | Large Deployment |
|-----------|------------------|-------------------|------------------|
| WAN Edge Devices | <50 | 50-500 | >500 |
| vSmart Controllers | 2 | 4 | 6-8 |
| vSmart vCPU/RAM | 8/16GB | 16/32GB | 32/64GB |
| Max OMP Routes | 10,000 | 100,000 | 500,000 |

## 2.3 Data Plane Design

### Overlay Topology Options

**Hub-and-Spoke Topology:**
```
            Hub Site (Full Mesh)
                  ┌──┐
            ┌────►│H1│◄────┐
            │     └──┘     │
            │              │
         ┌──┴──┐        ┌──┴──┐
         │ H2  │◄──────►│ H3  │
         └──┬──┘        └──┬──┘
            │              │
     ┌──────┼──────────────┼──────┐
     │      │              │      │
   ┌─▼─┐  ┌─▼─┐          ┌─▼─┐  ┌─▼─┐
   │B1 │  │B2 │          │B3 │  │B4 │
   └───┘  └───┘          └───┘  └───┘
   
   Branches (Spoke) - No direct connectivity
```

**Regional Mesh Topology:**
```
       Region A              Region B
    ┌──────────┐          ┌──────────┐
    │ H1◄─────►H2│        │ H3◄─────►H4│
    │  │    │  │          │  │    │  │
    │  ▼    ▼  │          │  ▼    ▼  │
    │ B1    B2 │          │ B3    B4 │
    └──────────┘          └──────────┘
         │                     │
         └──────Regional───────┘
                Border
```

### Tunnel Design Considerations

| Factor | Recommendation | Notes |
|--------|----------------|-------|
| Hub-to-Hub | Full mesh IPsec | Optimal inter-hub traffic |
| Hub-to-Branch | Hub-and-spoke | Minimize branch complexity |
| Branch-to-Branch | Via hub (default) | Enable direct on-demand |
| Encryption | AES-256-GCM | Hardware acceleration |
| BFD Timers | 1000ms hello, 3x multiplier | Balance detection vs. overhead |

## 2.4 Transport Design

### Multi-Transport Strategy

```
┌──────────────────────────────────────────────────────────────────────────┐
│                       MULTI-TRANSPORT DESIGN                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   WAN EDGE                                                                │
│   ┌────────────────────────────────────────────────────────────┐         │
│   │                                                             │         │
│   │  ┌──────────────┐        ┌──────────────┐                 │         │
│   │  │ Transport 1  │        │ Transport 2  │                 │         │
│   │  │ MPLS         │        │ DIA Internet │                 │         │
│   │  │ (color:mpls) │        │ (color:biz)  │                 │         │
│   │  │ Weight: 1    │        │ Weight: 1    │                 │         │
│   │  │ Primary      │        │ Primary      │                 │         │
│   │  └──────┬───────┘        └──────┬───────┘                 │         │
│   │         │                       │                          │         │
│   │         │   ┌──────────────┐   │   ┌──────────────┐      │         │
│   │         │   │ Transport 3  │   │   │ Transport 4  │      │         │
│   │         │   │ Broadband    │   │   │ 4G/5G LTE    │      │         │
│   │         │   │ (color:pub)  │   │   │ (color:lte)  │      │         │
│   │         │   │ Weight: 10   │   │   │ Weight: 50   │      │         │
│   │         │   │ Secondary    │   │   │ Last-resort  │      │         │
│   │         │   └──────┬───────┘   │   └──────┬───────┘      │         │
│   │         │          │            │          │               │         │
│   │         └──────────┴────────────┴──────────┘               │         │
│   │                           │                                 │         │
│   │                  ┌────────▼────────┐                        │         │
│   │                  │  Load Balancing │                        │         │
│   │                  │  & Failover     │                        │         │
│   │                  │  Engine         │                        │         │
│   │                  └─────────────────┘                        │         │
│   └────────────────────────────────────────────────────────────┘         │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

### Transport Color Scheme

| Color | Transport Type | Use Case | Typical Bandwidth |
|-------|----------------|----------|-------------------|
| mpls | MPLS VPN | Primary, low latency | 100M-1G |
| biz-internet | Business DIA | Primary, cloud traffic | 100M-1G |
| public-internet | Broadband | Secondary | 50M-500M |
| lte | 4G/5G Cellular | Backup, temporary | 10M-100M |
| custom1 | Private WAN | Special circuits | Variable |

## 2.5 Segmentation Design

### VPN Segmentation Strategy

| VPN ID | Segment Name | Purpose | Routing | Internet |
|--------|--------------|---------|---------|----------|
| 0 | Transport | WAN underlay | Static/OSPF | Yes |
| 10 | Corporate | User traffic | Full mesh | Via gateway |
| 20 | Guest | Guest access | Local breakout | Direct |
| 30 | Servers | Data center | Hub-only | Via gateway |
| 40 | Voice | UC traffic | Direct paths | No |
| 50 | IoT/OT | Smart devices | Restricted | Via gateway |
| 512 | Management | OOB mgmt | Isolated | No |

---

## 3. Hardware Selection

## 3.1 Platform Selection Criteria

### Decision Matrix

| Factor | Weight | C8500 | C8300 | C8200 | C8200L |
|--------|--------|-------|-------|-------|--------|
| Throughput | 30% | 100G | 10G | 2G | 500M |
| Port Density | 15% | Excellent | Good | Good | Limited |
| Feature Support | 25% | Full | Full | Full | Limited |
| Scalability | 15% | Excellent | Good | Good | Basic |
| Cost | 15% | $$$$  | $$$ | $$ | $ |
| **Total Score** | 100% | **Tier 1** | **Tier 2** | **Tier 3** | **Tier 4** |

## 3.2 Hardware Selection Guide

### Hub/Data Center Sites

**Recommended Platform: C8500 Series or C8300-2N2S-6T**

| Model | Throughput | Use Case | Key Features |
|-------|------------|----------|--------------|
| C8500-12X4QC | 100 Gbps | Large DC | 12x10G + 4x40/100G, full features |
| C8500-20X6C | 100 Gbps | XL DC | 20x10G + 6x40/100G, maximum scale |
| C8300-2N2S-6T | 10 Gbps | Regional hub | 2xNIM + 6x1G, cost-effective |

**Typical Hub Configuration:**
- Dual WAN Edge routers (active-active)
- Minimum 3 transport interfaces (MPLS, DIA, LTE)
- Hardware crypto acceleration
- UTD-capable (Snort 3.0)
- Cloud OnRamp support

### Branch Sites

**Large Branch: C8200-1N-4T or C8300-1N1S-4T2X**

| Users | Platform | Throughput | Interfaces | Redundancy |
|-------|----------|------------|------------|------------|
| 200-500 | C8200-1N-4T | 1-2 Gbps | 1xNIM + 4x1G | Single or dual |
| 500-1000 | C8300-1N1S-4T2X | 5-10 Gbps | 1xNIM + 1xSM + 4x1G + 2x10G | Dual recommended |

**Medium Branch: C8200-1N-4T**

| Users | Platform | Throughput | Interfaces | Redundancy |
|-------|----------|------------|------------|------------|
| 50-200 | C8200-1N-4T | 1 Gbps | 1xNIM + 4x1G | Single |

**Small Branch: C8200L-1N-4T**

| Users | Platform | Throughput | Interfaces | Redundancy |
|-------|----------|------------|------------|------------|
| <50 | C8200L-1N-4T | 500 Mbps | 1xNIM + 4x1G | Single |

## 3.3 Interface Modules

### Network Interface Modules (NIM)

| Module | Interfaces | Bandwidth | Use Case |
|--------|------------|-----------|----------|
| NIM-2GE-CU-SFP | 2x1G RJ45/SFP | 2 Gbps | MPLS/DIA |
| NIM-4G | 4x1G RJ45 | 4 Gbps | Multi-transport |
| NIM-2MFT-T1/E1 | 2xMFT (TDM) | TDM | Legacy voice |
| NIM-1MFT-T1/E1 | 1xMFT (TDM) | TDM | Legacy PRI |
| NIM-LTEA-EA | 4G LTE Americas | 100M | Cellular backup |
| NIM-LTEA-LA | 4G LTE LATAM | 100M | Cellular backup |

### Service Modules

| Module | Purpose | Features |
|--------|---------|----------|
| SM-X-XG4X2X | Expansion | 4x1G + 2x10G ports |
| SM-X-XXG4X2X | High-speed | 4x10G + 2x40G ports |
| SM-X-PVDM | Voice/UC | DSP resources for voice |

---

## 4. Capacity Planning

## 4.1 Bandwidth Calculation Methodology

### Formula

```
Total_Site_BW = (User_Traffic + Application_Traffic + Overhead)

Where:
  User_Traffic = Users × Average_BW_per_User
  Application_Traffic = Σ(App_Concurrent_Sessions × App_BW_per_Session)
  Overhead = (User_Traffic + Application_Traffic) × 20%
```

### Bandwidth Per User Baseline

| User Type | Bandwidth/User | Applications |
|-----------|----------------|--------------|
| Knowledge Worker | 1-2 Mbps | Email, web, file sharing |
| Power User | 3-5 Mbps | CAD, video editing, large files |
| Executive | 2-3 Mbps | HD video conf, presentations |
| Basic User | 0.5-1 Mbps | Email, basic web |

### Application Bandwidth Requirements

| Application | Concurrent Users | BW/Session | Peak BW |
|-------------|------------------|------------|---------|
| Voice (G.711) | 10% of users | 100 Kbps | Calculate |
| Video Conf (HD) | 5% of users | 2-4 Mbps | Calculate |
| VDI/Citrix | 20% of users | 150 Kbps | Calculate |
| File Sync (OneDrive) | 50% of users | Variable | Calculate |
| SAP/ERP | 30% of users | 50-100 Kbps | Calculate |

## 4.2 Site Sizing Worksheet

### Sample Calculation (Branch Site: 200 Users)

| Component | Quantity | BW/Unit | Subtotal |
|-----------|----------|---------|----------|
| **User Traffic** | | | |
| Knowledge Workers | 150 | 2 Mbps | 300 Mbps |
| Power Users | 30 | 4 Mbps | 120 Mbps |
| Executives | 20 | 3 Mbps | 60 Mbps |
| **Subtotal Users** | **200** | | **480 Mbps** |
| | | | |
| **Application Traffic** | | | |
| Voice (10% concurrent) | 20 | 100 Kbps | 2 Mbps |
| Video (5% concurrent) | 10 | 3 Mbps | 30 Mbps |
| VDI (20% concurrent) | 40 | 150 Kbps | 6 Mbps |
| **Subtotal Apps** | | | **38 Mbps** |
| | | | |
| **Total Before Overhead** | | | **518 Mbps** |
| **20% Overhead** | | | **104 Mbps** |
| **TOTAL REQUIRED** | | | **622 Mbps** |
| | | | |
| **Provisioned** | | | **1 Gbps** |
| **Headroom** | | | **38%** |

## 4.3 WAN Edge Throughput Impact

### Feature Performance Impact

| Feature | Throughput Impact | Mitigation |
|---------|-------------------|------------|
| IPsec AES-256 | 10-15% reduction | Hardware crypto engine |
| UTD (IPS/IDS) | 30-40% reduction | Size for encrypted throughput |
| DPI | 20-30% reduction | Enable selectively |
| Application Visibility | 5-10% reduction | Acceptable overhead |
| SSL Inspection | 40-50% reduction | Use sparingly |

### Effective Throughput Calculation

```
Example: C8300-2N2S-6T (Rated 10 Gbps)

Raw Throughput: 10,000 Mbps
After IPsec: 10,000 × 0.85 = 8,500 Mbps
After UTD: 8,500 × 0.65 = 5,525 Mbps
Effective: ~5.5 Gbps with IPsec + UTD enabled
```

## 4.4 Controller Capacity Planning

### vManage Sizing

| Deployment Size | Edges | vCPU | RAM | Storage | Cluster |
|-----------------|-------|------|-----|---------|---------|
| Small (<50) | 1-50 | 16 | 32GB | 500GB | Optional |
| Medium (50-500) | 51-500 | 32 | 64GB | 1TB | Required |
| Large (500-2000) | 501-2000 | 32 | 128GB | 2TB | Required |
| XL (>2000) | 2001+ | 32 | 128GB | 4TB+ | Required |

### vSmart Sizing

| Scale | Edges per vSmart | vCPU | RAM | OMP Routes |
|-------|------------------|------|-----|------------|
| Small | <500 | 8 | 16GB | 50,000 |
| Medium | 500-2000 | 16 | 32GB | 250,000 |
| Large | 2000-5000 | 32 | 64GB | 500,000 |

### vBond Sizing

| Deployment Size | vCPU | RAM | Notes |
|-----------------|------|-----|-------|
| All sizes | 2 | 4GB | Lightweight, stateless |

---

## 5. Traffic Flow Design

## 5.1 Application-Aware Routing (AAR)

### SLA Classes

```
┌──────────────────────────────────────────────────────────────────────────┐
│                      APPLICATION SLA CLASSES                              │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   REAL-TIME (Voice, Video)                                               │
│   ├─ Latency: <150ms                                                     │
│   ├─ Jitter: <30ms                                                       │
│   ├─ Loss: <1%                                                           │
│   └─ Transport: Prefer MPLS, failover DIA                                │
│                                                                           │
│   BUSINESS-CRITICAL (ERP, CRM, Citrix)                                   │
│   ├─ Latency: <200ms                                                     │
│   ├─ Jitter: <50ms                                                       │
│   ├─ Loss: <2%                                                           │
│   └─ Transport: Prefer MPLS, allow DIA                                   │
│                                                                           │
│   DEFAULT (General business apps)                                        │
│   ├─ Latency: <300ms                                                     │
│   ├─ Jitter: <100ms                                                      │
│   ├─ Loss: <5%                                                           │
│   └─ Transport: Load balance across all                                  │
│                                                                           │
│   BEST-EFFORT (Bulk data, backup)                                        │
│   ├─ Latency: No limit                                                   │
│   ├─ Jitter: No limit                                                    │
│   ├─ Loss: No limit                                                      │
│   └─ Transport: Use least-cost path                                      │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

### Traffic Flow Patterns

**Pattern 1: Branch-to-Data-Center (Hub-and-Spoke)**
```
Branch Site                Hub Site              Data Center
┌─────────┐               ┌─────────┐           ┌─────────┐
│ Branch  │─────────────►│  Hub    │─────────►│   DC    │
│ User    │   MPLS/DIA    │ WAN Edge│   MPLS   │ Servers │
│         │◄─────────────│         │◄─────────│         │
└─────────┘               └─────────┘           └─────────┘

Traffic: Corporate apps, file servers, ERP
Transport: Prefer low-latency (MPLS)
Policy: Enforce QoS, AAR
```

**Pattern 2: Branch-to-Internet (Local Breakout)**
```
Branch Site               Cloud/SaaS
┌─────────┐               ┌─────────┐
│ Branch  │─────────────►│   M365  │
│ User    │  Direct DIA   │   AWS   │
│         │               │  Cloud  │
└─────────┘               └─────────┘

Traffic: M365, Salesforce, Webex, internet
Transport: Direct Internet Access (DIA)
Policy: Local breakout, Umbrella filtering
```

**Pattern 3: Branch-to-Branch (On-Demand)**
```
Branch A                  Branch B
┌─────────┐               ┌─────────┐
│ Branch  │◄────────────►│ Branch  │
│   A     │  Direct Tunnel│   B     │
│         │  (On-demand)  │         │
└─────────┘               └─────────┘

Traffic: Site-to-site collaboration (rare)
Transport: Dynamic tunnel establishment
Policy: Create on SLA violation via hub
```

## 5.2 QoS Design

### QoS Queue Mapping

| Traffic Class | DSCP | Queue | % BW | Use Case |
|---------------|------|-------|------|----------|
| Voice | EF (46) | Priority | 10% | VoIP, UC |
| Video | AF41 (34) | Priority | 20% | Video conferencing |
| Business-Critical | AF31 (26) | 1 | 30% | ERP, CRM, Citrix |
| Default | 0 | 2 | 30% | General apps |
| Best-Effort | 0 | 3 | 10% | Bulk transfer |

### Bandwidth Allocation Example (100 Mbps Circuit)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         QoS BANDWIDTH ALLOCATION                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   Total Bandwidth: 100 Mbps                                              │
│                                                                           │
│   ┌────────────────────────────────────────────────────────────┐         │
│   │ Voice (EF)          │ 10 Mbps    ████                       │         │
│   ├────────────────────────────────────────────────────────────┤         │
│   │ Video (AF41)        │ 20 Mbps    ████████                  │         │
│   ├────────────────────────────────────────────────────────────┤         │
│   │ Business-Critical   │ 30 Mbps    ████████████              │         │
│   ├────────────────────────────────────────────────────────────┤         │
│   │ Default             │ 30 Mbps    ████████████              │         │
│   ├────────────────────────────────────────────────────────────┤         │
│   │ Best-Effort         │ 10 Mbps    ████                       │         │
│   └────────────────────────────────────────────────────────────┘         │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

## 5.3 Direct Internet Access (DIA)

### DIA Strategy

| Traffic Type | DIA Location | Security | Use Case |
|--------------|--------------|----------|----------|
| SaaS (M365, Salesforce) | Branch local | Umbrella DNS | All sites |
| IaaS (AWS, Azure) | Hub sites | UTD + Umbrella | Hub-centric |
| General Internet | Branch local | Umbrella SIG | All sites |
| Guest WiFi | Branch local | Isolated VPN | All sites |

---

## 6. Implementation Planning

## 6.1 Phased Deployment Approach

### Phase Strategy

```
┌──────────────────────────────────────────────────────────────────────────┐
│                       PHASED DEPLOYMENT TIMELINE                          │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   Phase 1: Foundation (Weeks 1-4)                                        │
│   ├─ Deploy SD-WAN Manager cluster                                       │
│   ├─ Deploy SD-WAN Controllers                                           │
│   ├─ Deploy SD-WAN Validators                                            │
│   ├─ Configure templates and policies                                    │
│   └─ Lab validation                                                      │
│                                                                           │
│   Phase 2: Pilot (Weeks 5-8)                                             │
│   ├─ Deploy 1-2 pilot branch sites                                       │
│   ├─ Validate ZTP process                                                │
│   ├─ Test application performance                                        │
│   ├─ Validate failover scenarios                                         │
│   └─ User acceptance testing                                             │
│                                                                           │
│   Phase 3: Branch Rollout (Weeks 9-20)                                   │
│   ├─ Deploy all branch sites (5-10 per week)                             │
│   ├─ Parallel run with existing WAN                                      │
│   ├─ Gradual traffic migration                                           │
│   └─ Weekly cutover windows                                              │
│                                                                           │
│   Phase 4: Hub Migration (Weeks 21-24)                                   │
│   ├─ Deploy hub WAN edges                                                │
│   ├─ Configure hub-to-hub full mesh                                      │
│   ├─ Migrate inter-hub traffic                                           │
│   └─ Validate DC connectivity                                            │
│                                                                           │
│   Phase 5: Optimization (Weeks 25-28)                                    │
│   ├─ Fine-tune policies and QoS                                          │
│   ├─ Optimize transport selection                                        │
│   ├─ Performance benchmarking                                            │
│   └─ Operational handover                                                │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

## 6.2 Zero-Touch Provisioning (ZTP)

### ZTP Workflow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    ZERO-TOUCH PROVISIONING FLOW                           │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   1. WAN Edge Powers On                                                  │
│      └─► DHCP request on all interfaces                                  │
│                                                                           │
│   2. Receive DHCP Response                                               │
│      ├─► IP address                                                      │
│      ├─► Default gateway                                                 │
│      └─► Option 43: vBond IP/FQDN                                        │
│                                                                           │
│   3. Contact SD-WAN Validator (vBond)                                    │
│      └─► DTLS connection to vBond                                        │
│                                                                           │
│   4. Certificate Validation                                              │
│      ├─► Present serial number                                           │
│      ├─► Validate signed certificate                                     │
│      └─► Mutual authentication                                           │
│                                                                           │
│   5. Receive Controller List                                             │
│      ├─► vSmart IP addresses                                             │
│      ├─► vManage IP address                                              │
│      └─► Site ID, system IP                                              │
│                                                                           │
│   6. Establish Control Connections                                       │
│      ├─► DTLS to vSmart controllers                                      │
│      ├─► DTLS to vManage                                                 │
│      └─► Receive initial configuration                                   │
│                                                                           │
│   7. Download Template Configuration                                     │
│      ├─► Device template from vManage                                    │
│      ├─► Feature templates                                               │
│      └─► Apply configuration                                             │
│                                                                           │
│   8. Operational State                                                   │
│      ├─► Build OMP adjacencies                                           │
│      ├─► Establish data plane tunnels                                    │
│      └─► Ready for production traffic                                    │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

## 6.3 Cutover Planning

### Site Cutover Checklist

**Pre-Cutover (T-1 week):**
- [ ] WAN Edge hardware shipped and received
- [ ] Transport circuits installed and tested
- [ ] Device templates created and validated
- [ ] Certificates generated and uploaded
- [ ] Cutover plan approved
- [ ] Rollback plan documented
- [ ] Change window scheduled
- [ ] Stakeholders notified

**Cutover Day (T=0):**
- [ ] Verify current network baseline
- [ ] Power on WAN Edge
- [ ] Verify ZTP completion
- [ ] Validate control plane (OMP sessions)
- [ ] Validate data plane (BFD tunnels)
- [ ] Test application connectivity
- [ ] Cutover traffic (gradual or immediate)
- [ ] Monitor for issues (4 hours)
- [ ] Close change ticket

**Post-Cutover (T+1 day):**
- [ ] Validate 24-hour stability
- [ ] Review performance metrics
- [ ] Document lessons learned
- [ ] Schedule transport decommission (if applicable)

---

## 7. Validation & Testing

## 7.1 Testing Methodology

### Test Categories

| Category | Scope | Success Criteria |
|----------|-------|------------------|
| **Infrastructure** | Control/data plane | All tunnels green, OMP sessions up |
| **Connectivity** | End-to-end reachability | All sites can reach all destinations |
| **Performance** | Latency, throughput, loss | Meet or exceed baseline |
| **Failover** | Transport failure scenarios | RTO <30 seconds, no packet loss |
| **Security** | Encryption, segmentation | All traffic encrypted, VPNs isolated |
| **Applications** | Real-world app testing | Applications meet SLA requirements |

## 7.2 Test Plan Template

### Infrastructure Testing

| Test ID | Test Case | Expected Result | Pass/Fail |
|---------|-----------|-----------------|-----------|
| INF-01 | Verify vManage cluster formation | 3 nodes, all healthy | |
| INF-02 | Verify vSmart OMP sessions | All edges show 2+ OMP peers | |
| INF-03 | Verify vBond reachability | Accessible on public IP | |
| INF-04 | Verify certificate validity | Valid certs, no expiry warnings | |
| INF-05 | Verify BFD tunnel status | All tunnels "up", no flapping | |

### Connectivity Testing

| Test ID | Test Case | Expected Result | Pass/Fail |
|---------|-----------|-----------------|-----------|
| CON-01 | Branch to DC ICMP | <20ms latency, 0% loss | |
| CON-02 | Branch to Branch (via hub) | Reachable via hub | |
| CON-03 | Hub to Hub | Direct connectivity, <150ms | |
| CON-04 | VPN isolation | VPN 10 cannot reach VPN 20 | |
| CON-05 | Internet breakout | Local breakout working | |

### Application Testing

| Test ID | Application | Test Method | SLA Target | Result |
|---------|-------------|-------------|------------|--------|
| APP-01 | Voice (SIP) | Test call | <150ms, <1% loss | |
| APP-02 | Video Conf | Zoom/Webex session | <200ms, <2% loss | |
| APP-03 | ERP (SAP) | Transaction test | <300ms response | |
| APP-04 | M365 | Email send/receive | <100ms to cloud | |
| APP-05 | File Transfer | 100MB file copy | Throughput >50 Mbps | |

### Failover Testing

| Test ID | Scenario | Expected Behavior | Downtime | Result |
|---------|----------|-------------------|----------|--------|
| FAIL-01 | Primary transport failure | Failover to secondary | <5 sec | |
| FAIL-02 | WAN Edge failure (hub) | Failover to backup edge | <10 sec | |
| FAIL-03 | vSmart failure | Edge connects to backup | <30 sec | |
| FAIL-04 | vManage failure | Cluster failover | <60 sec | |
| FAIL-05 | Internet circuit failure | Failover to cellular | <10 sec | |

## 7.3 Performance Baseline

### Metrics to Capture

**Pre-Migration Baseline:**
- Average latency (site-to-site matrix)
- Peak bandwidth utilization
- Packet loss percentage
- Application response times
- Mean time between failures (MTBF)

**Post-Migration Target:**
- Latency: Same or better
- Bandwidth: Same or better (with headroom)
- Loss: <0.5% for all traffic classes
- Application performance: Meet SLA
- MTBF: Improved (fewer incidents)

---

## 8. Operations Handover

## 8.1 Operational Runbooks

### Essential Runbooks

| Runbook | Purpose | Priority |
|---------|---------|----------|
| Adding a New Site | ZTP process, template assignment | P1 |
| Troubleshooting Tunnel Issues | BFD, IPsec, certificate problems | P1 |
| Software Upgrade Procedure | vManage, vSmart, vEdge upgrade | P1 |
| Transport Failure Response | Failover validation, carrier escalation | P1 |
| Performance Degradation | AAR troubleshooting, path analysis | P2 |
| Certificate Renewal | Annual certificate renewal process | P2 |
| Adding New Applications | Policy updates, QoS tuning | P2 |
| Monthly Health Check | Proactive maintenance tasks | P3 |

## 8.2 Monitoring & Alerting

### Critical Alerts

| Alert | Threshold | Action |
|-------|-----------|--------|
| Tunnel Down | Any BFD tunnel down >5 min | Investigate immediately |
| Control Plane Loss | OMP session down | Escalate to TAC |
| CPU High | >80% for 15 min | Review resource usage |
| Memory High | >90% | Plan capacity upgrade |
| Certificate Expiry | <30 days | Renew certificates |
| Transport SLA Violation | Latency >SLA threshold | Review AAR, contact ISP |

### Dashboard Metrics

**Real-Time Monitoring:**
- Tunnel health (color-coded map)
- Transport utilization
- Application performance (top 10)
- Active alarms
- Traffic flows (sankey diagram)

**Historical Trends:**
- Bandwidth utilization (7/30/90 days)
- Latency trends by site
- Packet loss trends
- Application SLA compliance %

## 8.3 Training Requirements

### Training Matrix

| Role | Training Topics | Duration |
|------|----------------|----------|
| **Network Architects** | Design principles, advanced features | 3 days |
| **Network Engineers** | Day-to-day operations, troubleshooting | 5 days |
| **NOC Staff** | Monitoring, tier 1 troubleshooting | 2 days |
| **Security Team** | Segmentation, firewall policies | 2 days |
| **Helpdesk** | User-facing issues, escalation | 1 day |

---

## 9. Appendices

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| **AAR** | Application-Aware Routing - Intelligent path selection based on SLA |
| **BFD** | Bidirectional Forwarding Detection - Fast failure detection protocol |
| **DTLS** | Datagram TLS - Encryption protocol for control plane |
| **OMP** | Overlay Management Protocol - SD-WAN routing protocol |
| **TLOC** | Transport Location - Endpoint of a data plane tunnel |
| **vBond** | SD-WAN Validator - Orchestrates ZTP process |
| **vManage** | SD-WAN Manager - Centralized management platform |
| **vSmart** | SD-WAN Controller - Control plane intelligence |
| **ZTP** | Zero-Touch Provisioning - Automated device onboarding |

## Appendix B: Reference Architecture Diagrams

**To be customized with:**
- Site-specific topology
- Transport provider details
- IP addressing scheme
- Cloud connectivity diagrams
- Security zone diagrams

## Appendix C: Configuration Templates

**To be included:**
- Feature templates (System, VPN, Interface)
- Device templates per platform
- Policy templates (AAR, QoS, Security)
- CLI configuration samples

## Appendix D: Vendor Contacts

| Vendor | Contact Type | Information |
|--------|--------------|-------------|
| Cisco TAC | Technical Support | +1-800-XXX-XXXX |
| Transport Provider | Circuit Support | To be documented |
| Cisco Account Team | Sales/Licensing | To be documented |
| Integration Partners | Professional Services | To be documented |

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2026 | Network Architecture Team | Initial template creation |

---

**End of Greenfield Deployment Template**

*This document is a template. Customize all sections with your specific requirements, site details, hardware selections, and organizational processes.*

---

**Related Templates:**
- [SD-WAN Migration Project Template](#)
- [Capacity Planning Worksheet](#)
- [Traffic Flow Design Template](#)
- [Implementation Checklist](#)
