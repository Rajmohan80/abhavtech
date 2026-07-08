# Appendix M: Detailed Capacity Planning & Design Guide

**9-Site Global Deployment | Hardware Selection | Performance Engineering**

**Sites:** Mumbai | Chennai | London | Frankfurt | New Jersey | Dallas | Bangalore | Delhi | Noida

---

### Document Information

| Field | Value |
|-------|-------|
| Document Title | Abhavtech SD-WAN Capacity Planning & Design |
| Version | 1.0 |
| Date | January 2026 |
| Organization | Abhavtech.com |
| Classification | Internal - Technical Reference |
| Status | Production Design |

---

### Executive Summary

This document provides comprehensive capacity planning, hardware selection rationale, and traffic flow design for Abhavtech's 9-site Cisco Catalyst SD-WAN deployment. The design supports current requirements while accommodating 5-year growth projections from 2,500 users to 10,000 users across global operations.

**Key Metrics:**
- **Sites:** 9 (6 hubs, 3 branches)
- **WAN Edge Devices:** 15 (dual at hubs, single at branches)
- **Total Users:** 2,500 (current) → 10,000 (Year 5)
- **Aggregate Bandwidth:** 4,500 Mbps (current) → 30,000 Mbps (Year 5)
- **Software:** vManage 20.15.x, vSmart 20.15.x, IOS-XE 17.15.x
- **Integration:** SD-Access fabric handoff (independent domain model)

---

### Table of Contents

1. [Site-Specific Analysis](#1-site-specific-analysis)
2. [Hardware Selection Rationale](#2-hardware-selection-rationale)
3. [Capacity Planning by Site](#3-capacity-planning-by-site)
4. [Traffic Flow Design](#4-traffic-flow-design)
5. [Transport Architecture](#5-transport-architecture)
6. [Performance Baselines](#6-performance-baselines)
7. [Growth Projections](#7-growth-projections)
8. [Design Considerations](#8-design-considerations)

---

## 1. Site-Specific Analysis

### 1.1 Site Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    ABHAVTECH GLOBAL SITE TOPOLOGY                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│                         SD-WAN CONTROLLER PLANE                           │
│                      ┌────────────────────────┐                          │
│                      │ vManage Cluster (3+3)  │                          │
│                      │ Mumbai DC + Chennai DR │                          │
│                      └───────────┬────────────┘                          │
│                                  │                                        │
│                  ┌───────────────┼───────────────┐                       │
│                  │               │               │                       │
│            ┌─────▼──────┐  ┌────▼──────┐  ┌────▼──────┐                │
│            │ vSmart x2  │  │ vSmart x2 │  │ vBond x2  │                │
│            │  Mumbai    │  │  Chennai  │  │  Cloud    │                │
│            └─────┬──────┘  └────┬──────┘  └────┬──────┘                │
│                  │              │              │                         │
│                  └──────────────┴──────────────┘                         │
│                           DATA PLANE                                      │
│                                 │                                         │
│        ┌────────────────────────┼────────────────────────┐               │
│        │                        │                        │               │
│   ASIA-PACIFIC              EMEA                    AMERICAS             │
│   ┌─────────────┐       ┌─────────────┐         ┌─────────────┐        │
│   │ Mumbai DC   │◄─────►│ London      │◄───────►│ New Jersey  │        │
│   │ (Hub)       │       │ (Hub)       │         │ (Hub)       │        │
│   │ C8500 x2    │       │ C8300 x2    │         │ C8300 x2    │        │
│   └──────┬──────┘       └──────┬──────┘         └──────┬──────┘        │
│          │                     │                        │               │
│   ┌──────▼──────┐       ┌──────▼──────┐         ┌──────▼──────┐        │
│   │ Chennai DR  │       │ Frankfurt   │         │ Dallas      │        │
│   │ (Hub)       │       │ (Hub)       │         │ (Hub)       │        │
│   │ C8500 x2    │       │ C8300 x2    │         │ C8300 x2    │        │
│   └──────┬──────┘       └─────────────┘         └─────────────┘        │
│          │                                                               │
│   ┌──────┴────────────┐                                                 │
│   │      │      │      │                                                 │
│   ▼      ▼      ▼      │                                                 │
│ ┌───┐ ┌───┐ ┌────┐    │                                                 │
│ │BLR│ │DEL│ │NOI │    │                                                 │
│ │C82│ │C82│ │C82L│    │                                                 │
│ └───┘ └───┘ └────┘    │                                                 │
│                        │                                                 │
└────────────────────────┘─────────────────────────────────────────────────┘
```

### 1.2 Detailed Site Matrix

| Site Code | Location | Region | Type | Users | SD-Access | WAN Edge Model | Qty | Primary Role |
|-----------|----------|--------|------|-------|-----------|----------------|-----|--------------|
| **MUM** | Mumbai | APAC | Data Center | 800 | Yes (Border x4) | C8500-12X4QC | 2 | Primary Hub APAC |
| **CHN** | Chennai | APAC | Data Center | 600 | Yes (Border x4) | C8500-12X4QC | 2 | DR + Secondary Hub |
| **LON** | London | EMEA | Regional HQ | 150 | No | C8300-2N2S-6T | 2 | Primary Hub EMEA |
| **FRA** | Frankfurt | EMEA | Regional Office | 50 | No | C8300-2N2S-6T | 2 | Secondary Hub EMEA |
| **NJ** | New Jersey | Americas | Regional HQ | 30 | No | C8300-2N2S-6T | 2 | Primary Hub Americas |
| **DAL** | Dallas | Americas | Regional Office | 20 | No | C8300-2N2S-6T | 2 | Secondary Hub Americas |
| **BLR** | Bangalore | APAC | Branch | 400 | No | C8200-1N-4T | 1 | Large Branch |
| **DEL** | Delhi | APAC | Branch | 350 | No | C8200-1N-4T | 1 | Large Branch |
| **NOI** | Noida | APAC | Branch | 100 | No | C8200L-1N-4T | 1 | Medium Branch |

---

## 2. Hardware Selection Rationale

### 2.1 Controller Infrastructure

#### vManage Cluster Sizing

**Selected Configuration: Large Scale**

| Component | Specification | Rationale |
|-----------|---------------|-----------|
| **Nodes** | 3 (active cluster) + 3 (DR) | HA + disaster recovery |
| **vCPU** | 32 per node | Support 501-2000 edges |
| **RAM** | 128 GB per node | Analytics + logging |
| **Storage** | 2 TB SSD per node | Statistics database |
| **Deployment** | ESXi hypervisor | Existing infrastructure |
| **Location** | Mumbai (Primary), Chennai (DR) | Regional distribution |

**Growth Headroom:**
- Current: 15 WAN edges
- Year 5 projection: 85 WAN edges
- Controller capacity: Up to 2,000 edges
- **Headroom: 95%** ✓

#### vSmart Controller Sizing

**Deployment Model: Regional Distribution**

| Location | Quantity | vCPU | RAM | Edges Supported | OMP Routes |
|----------|----------|------|-----|-----------------|------------|
| Mumbai DC | 2 | 16 | 32 GB | 500-2000 | 250,000 |
| Chennai DR | 2 | 16 | 32 GB | 500-2000 | 250,000 |
| **Total** | **4** | **64** | **128 GB** | **2000-4000** | **500K** |

**Rationale:**
- 4 controllers provide 2:1 redundancy
- Each WAN edge connects to 2 vSmarts minimum
- Regional placement reduces OMP latency
- Mumbai controllers serve APAC/EMEA
- Chennai controllers serve Americas + backup

#### vBond Validator

**Deployment Model: Cloud-Hosted**

| Attribute | Specification |
|-----------|---------------|
| **Quantity** | 2 (active-active) |
| **vCPU** | 2 per instance |
| **RAM** | 4 GB per instance |
| **Location** | AWS (Mumbai region), AWS (Singapore region) |
| **Public IP** | Yes (required for ZTP) |
| **DNS** | vbond.abhavtech.com (Round-robin) |

### 2.2 WAN Edge Selection by Site

#### Mumbai DC (MUM) - Primary Data Center

**Selected Platform: Cisco Catalyst 8500-12X4QC (x2)**

| Requirement | Specification | C8500 Capability | Match |
|-------------|---------------|------------------|-------|
| **Throughput** | 5,000 Mbps (current), 16,000 Mbps (Y5) | 100 Gbps | ✓ |
| **Users** | 800 (current), 2,000 (Y5) | 10,000+ | ✓ |
| **Tunnels** | 200 (current), 1,000 (Y5) | 16,000 | ✓ |
| **Sessions** | 500K (current), 2M (Y5) | 2M | ✓ |
| **High Availability** | Active-active dual router | Supported | ✓ |
| **SD-Access Handoff** | 4x Border nodes | 12x 10GbE ports | ✓ |
| **Encryption** | AES-256-GCM hardware | Hardware crypto | ✓ |
| **UTD** | Snort 3.0 IPS | Full UTD support | ✓ |
| **5G Backup** | Yes | Cellular module support | ✓ |

**Interface Utilization:**

```
Mumbai WAN Edge 1 (MUM-WAN-01):
┌────────────────────────────────────────────────────────────┐
│ C8500-12X4QC Interface Layout                              │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ Te0/0/0 [10G] ──► MPLS Transport (Tata, 2 Gbps)           │
│ Te0/0/1 [10G] ──► DIA Transport (Tata, 2 Gbps)            │
│ Cell0/4/0 ─────► 5G Backup (Jio, 1 Gbps)                  │
│                                                             │
│ Te0/1/0 [10G] ──► SD-Access Border-1 (VRF handoff)        │
│ Te0/1/1 [10G] ──► SD-Access Border-2 (VRF handoff)        │
│ Te0/1/2 [10G] ──► SD-Access Border-3 (VRF handoff)        │
│ Te0/1/3 [10G] ──► SD-Access Border-4 (VRF handoff)        │
│                                                             │
│ Te0/2/0 [10G] ──► Campus Core (Management)                │
│                                                             │
│ Fo0/3/0 [40G] ──► Reserved for future expansion           │
│                                                             │
└────────────────────────────────────────────────────────────┘

Port Utilization: 9 of 16 ports (56%)
```

#### Chennai DR (CHN) - Disaster Recovery + Secondary Hub

**Selected Platform: Cisco Catalyst 8500-12X4QC (x2)**

| Requirement | Specification | Match |
|-------------|---------------|-------|
| **Throughput** | 4,000 Mbps (current), 12,000 Mbps (Y5) | ✓ (same as Mumbai) |
| **HA** | Active-active | ✓ |
| **SD-Access** | 4x Border nodes | ✓ |
| **Role** | DR + active hub for branches | ✓ |

**Note:** Chennai uses identical hardware to Mumbai for:
- Simplified spare parts inventory
- DR failover capability
- Consistent performance profile

#### London (LON) - Primary Hub EMEA

**Selected Platform: Cisco Catalyst 8300-2N2S-6T (x2)**

| Requirement | Specification | C8300 Capability | Match |
|-------------|---------------|------------------|-------|
| **Throughput** | 1,000 Mbps (current), 3,000 Mbps (Y5) | 10 Gbps | ✓ |
| **Users** | 150 (current), 400 (Y5) | 2,000+ | ✓ |
| **Tunnels** | 50 (current), 200 (Y5) | 8,000 | ✓ |
| **HA** | Active-active | Supported | ✓ |
| **Ports** | 3 transports + 2 LAN | 2xNIM + 6x1G | ✓ |

**Interface Layout:**

```
London WAN Edge 1 (LON-WAN-01):
┌────────────────────────────────────────────────────────────┐
│ C8300-2N2S-6T Interface Layout                             │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ NIM Slot 0: NIM-2GE-CU-SFP                                 │
│   ├─ Gi0/0/0 ──► MPLS Transport (BT, 500 Mbps)            │
│   └─ Gi0/0/1 ──► DIA Transport (BT, 500 Mbps)             │
│                                                             │
│ NIM Slot 1: NIM-LTEA-EA (LTE Americas/EMEA)               │
│   └─ Cell0/1/0 ──► 5G Backup (EE, 500 Mbps)               │
│                                                             │
│ Onboard Ports:                                             │
│   ├─ Gi0/0/2 ──► Campus Core (VLAN trunk)                 │
│   ├─ Gi0/0/3 ──► Management VLAN                          │
│   └─ Gi0/0/4-5 ──► Reserved                               │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

#### Frankfurt, New Jersey, Dallas (FRA, NJ, DAL) - Regional Hubs

**Selected Platform: Cisco Catalyst 8300-2N2S-6T (x2 each site)**

**Rationale:** Same as London
- Consistent platform across all regional hubs
- Simplified operations and training
- Common spare parts pool
- Right-sized for 50-500 user sites

#### Bangalore, Delhi (BLR, DEL) - Large Branches

**Selected Platform: Cisco Catalyst 8200-1N-4T (x1 each)**

| Requirement | Specification | C8200 Capability | Match |
|-------------|---------------|------------------|-------|
| **Throughput** | 300-650 Mbps (current-Y3) | 1-2 Gbps | ✓ |
| **Users** | 350-400 | 1,000+ | ✓ |
| **HA** | Single router + transport redundancy | Supported | ✓ |
| **Cost** | Budget-conscious | Mid-range | ✓ |

**Interface Layout:**

```
Bangalore WAN Edge (BLR-WAN-01):
┌────────────────────────────────────────────────────────────┐
│ C8200-1N-4T Interface Layout                               │
├────────────────────────────────────────────────────────────┤
│                                                             │
│ NIM Slot 0: NIM-2GE-CU-SFP + NIM-LTEA-LA                  │
│   ├─ Gi0/0/0 ──► DIA Transport (Jio, 200 Mbps)            │
│   └─ Cell0/0/1 ──► LTE Backup (Airtel, 100 Mbps)          │
│                                                             │
│ Onboard Ports:                                             │
│   ├─ Gi0/0/1 ──► Campus Distribution Switch               │
│   ├─ Gi0/0/2 ──► Management VLAN                          │
│   └─ Gi0/0/3-4 ──► Reserved                               │
│                                                             │
└────────────────────────────────────────────────────────────┘
```

**Why No Dual Routers:**
- Cost optimization for branch sites
- Transport redundancy (DIA + LTE) provides adequate resilience
- MTTR target: 4 hours (spare on-site)
- Business criticality: Medium (can tolerate brief outages)

#### Noida (NOI) - Medium Branch

**Selected Platform: Cisco Catalyst 8200L-1N-4T (x1)**

| Requirement | Specification | C8200L Capability | Match |
|-------------|---------------|-------------------|-------|
| **Throughput** | 100-500 Mbps | 500 Mbps - 1 Gbps | ✓ |
| **Users** | 100 (current), 250 (Y5) | 500+ | ✓ |
| **Cost** | Most budget-friendly | Entry-level | ✓ |
| **Complexity** | Simplified operations | Limited features OK | ✓ |

---

## 3. Capacity Planning by Site

### 3.1 Mumbai DC (MUM) - Detailed Capacity Analysis

#### Current State (Year 0 - 2026)

**User Profile:**
- Total users: 800
- Knowledge workers: 600 (75%)
- Power users (engineering): 150 (19%)
- Executives: 50 (6%)

**Bandwidth Calculation:**

| Component | Quantity | BW per Unit | Subtotal |
|-----------|----------|-------------|----------|
| **User Traffic** | | | |
| Knowledge workers | 600 | 2 Mbps | 1,200 Mbps |
| Power users | 150 | 4 Mbps | 600 Mbps |
| Executives | 50 | 3 Mbps | 150 Mbps |
| **User Subtotal** | | | **1,950 Mbps** |
| | | | |
| **Application Traffic** | | | |
| Voice (10% concurrent) | 80 calls | 100 Kbps | 8 Mbps |
| Video (5% concurrent) | 40 sessions | 3 Mbps | 120 Mbps |
| SAP ERP | 200 concurrent | 100 Kbps | 20 Mbps |
| Citrix VDI | 100 sessions | 150 Kbps | 15 Mbps |
| File sync (OneDrive) | 400 users | 500 Kbps | 200 Mbps |
| **App Subtotal** | | | **363 Mbps** |
| | | | |
| **Inter-Site Traffic** | | | |
| To Chennai DR | | | 800 Mbps |
| To other hubs | | | 500 Mbps |
| From branches | | | 1,500 Mbps |
| **Inter-Site Subtotal** | | | **2,800 Mbps** |
| | | | |
| **Cloud Traffic** | | | |
| M365 (via DIA) | | | 500 Mbps |
| AWS (Mumbai region) | | | 300 Mbps |
| **Cloud Subtotal** | | | **800 Mbps** |
| | | | |
| **Total Before Overhead** | | | **5,913 Mbps** |
| **20% Overhead** | | | **1,183 Mbps** |
| **TOTAL CALCULATED** | | | **7,096 Mbps** |

**Provisioned Transport:**

| Transport | Bandwidth | Utilization @ Peak | Headroom |
|-----------|-----------|-------------------|----------|
| MPLS | 2,000 Mbps | 70% (1,400 Mbps) | 30% |
| DIA | 2,000 Mbps | 60% (1,200 Mbps) | 40% |
| 5G | 1,000 Mbps | 10% (100 Mbps, backup) | 90% |
| **Total** | **5,000 Mbps** | **54%** | **46%** |

**Platform Validation:**
- C8500-12X4QC rated: 100 Gbps
- Required (with IPsec + UTD): ~7 Gbps effective
- C8500 effective (IPsec + UTD): ~55 Gbps
- **Headroom: 87%** ✓

#### Year 3 Projection (2029)

**Users:** 800 → 2,000 (150% growth)
**Calculated Bandwidth:** 7,096 Mbps × 1.5 ×1.2 (traffic growth) = **12,773 Mbps**

**Provisioned Transport (Year 3):**

| Transport | Bandwidth | Cost/Month |
|-----------|-----------|------------|
| MPLS (retained) | 2,000 Mbps | $XX,XXX |
| DIA (upgraded) | 5,000 Mbps | $XX,XXX |
| 5G (upgraded) | 2,000 Mbps | $X,XXX |
| **Total** | **9,000 Mbps** | **$XX,XXX** |

**Platform:** C8500 still adequate (55 Gbps effective >> 12.7 Gbps required)

#### Year 5 Projection (2031)

**Users:** 800 → 3,000
**Calculated Bandwidth:** ~18,000 Mbps

**Recommendation:** 
- Option A: Upgrade to dual 100G interfaces
- Option B: Add third C8500 (3-way active-active)
- **Selected:** Option A (simpler, lower OPEX)

### 3.2 Chennai DR (CHN)

#### Current State

| Metric | Value | Notes |
|--------|-------|-------|
| Users | 600 | 75% of Mumbai |
| Calculated BW | 5,327 Mbps | Similar profile to Mumbai |
| Provisioned Transport | MPLS 2G + DIA 1.5G + 5G 500M | 4,000 Mbps total |
| Peak Utilization | 62% | |
| Platform | C8500-12X4QC x2 | Same as Mumbai (DR parity) |

#### Special Considerations

**Disaster Recovery Role:**
- Must handle 100% Mumbai traffic if DR invoked
- Provisioned for 80% Mumbai + 100% local = **9,000 Mbps minimum**
- Current: 4,000 Mbps (will increase to 9G by Y2)

**Replication Traffic:**
- Mumbai ↔ Chennai: 800 Mbps dedicated
- Database replication: Real-time
- Backup replication: Off-peak

### 3.3 Regional Hubs (LON, FRA, NJ, DAL)

#### London (LON)

| Metric | Current | Year 3 | Year 5 |
|--------|---------|--------|--------|
| **Users** | 150 | 400 | 800 |
| **User BW** | 435 Mbps | 1,160 Mbps | 2,320 Mbps |
| **App BW** | 109 Mbps | 290 Mbps | 580 Mbps |
| **Cloud BW** | 200 Mbps | 500 Mbps | 1,000 Mbps |
| **Inter-Hub** | 100 Mbps | 300 Mbps | 600 Mbps |
| **Total Calculated** | 844 Mbps | 2,250 Mbps | 4,500 Mbps |
| **Provisioned** | 1,000 Mbps | 3,000 Mbps | 5,000 Mbps |
| **Platform** | C8300 (10G capable) | C8300 | C8300 or C8500 |

#### Frankfurt (FRA), New Jersey (NJ), Dallas (DAL)

**Similar sizing methodology applied:**

| Site | Users (Y0/Y5) | BW (Y0/Y5) | Platform |
|------|---------------|------------|----------|
| Frankfurt | 50 / 400 | 500M / 3G | C8300 / C8300 |
| New Jersey | 30 / 500 | 300M / 4G | C8300 / C8300 |
| Dallas | 20 / 300 | 200M / 2.5G | C8300 / C8300 |

### 3.4 Branches (BLR, DEL, NOI)

#### Bangalore (BLR)

**Current State:**

| Component | Calculation | Result |
|-----------|-------------|--------|
| Users | 400 | |
| User traffic | 400 × 2 Mbps | 800 Mbps |
| Application traffic | Voice: 3M, Video: 20M, Apps: 25M | 48 Mbps |
| Cloud traffic | M365: 100M | 100 Mbps |
| **Total (with overhead)** | (800+48+100) × 1.2 | **1,138 Mbps** |
| **Provisioned** | DIA 200M + LTE 100M | **300 Mbps** |
| **Utilization @ Peak** | | **~75%** |

**Analysis:**
- Current provisioning appears undersized
- Recommendation: Upgrade DIA to 500 Mbps by Year 1
- Platform: C8200-1N-4T (2 Gbps capable) adequate through Year 5

#### Delhi (DEL)

| Metric | Current | Year 3 |
|--------|---------|--------|
| Users | 350 | 700 |
| Calculated BW | 1,000 Mbps | 2,000 Mbps |
| Provisioned | 300 Mbps | 1,000 Mbps |
| Platform | C8200 (adequate) | C8200 (adequate) |

#### Noida (NOI)

| Metric | Current | Year 5 |
|--------|---------|--------|
| Users | 100 | 250 |
| Calculated BW | 286 Mbps | 715 Mbps |
| Provisioned | 200 Mbps | 500 Mbps |
| Platform | C8200L (500M-1G) | C8200 (upgrade needed Y4) |

---

## 4. Traffic Flow Design

### 4.1 Hub-to-Hub Traffic Flows

#### Inter-Hub Connectivity Matrix

```
                    HUB-TO-HUB TRAFFIC MATRIX
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│                     MUM ─────── CHN                                       │
│                      │ \       / │                                       │
│                  800M│  \300M /  │600M                                   │
│                      │   \   /   │                                       │
│                      │    \ /    │                                       │
│                      │     X     │                                       │
│                      │    / \    │                                       │
│                      │   /   \   │                                       │
│                      │  /     \  │                                       │
│                      │ /       \ │                                       │
│                     LON ─────── FRA                                       │
│                      │   200M    │                                       │
│                      │           │                                       │
│                 150M │           │ 100M                                  │
│                      │           │                                       │
│                      NJ ────────DAL                                       │
│                         150M                                              │
│                                                                           │
│   TRAFFIC VOLUMES (Mbps, Current):                                       │
│   ────────────────────────────────────                                   │
│   Mumbai ↔ Chennai:    800 (DB replication, shared services)            │
│   Mumbai ↔ London:     300 (APAC-EMEA integration)                      │
│   Mumbai ↔ NJ:         200 (APAC-Americas integration)                  │
│   Chennai ↔ London:    200 (Backup path)                                │
│   Chennai ↔ NJ:        150 (Backup path)                                │
│   London ↔ Frankfurt:  200 (Regional collaboration)                     │
│   London ↔ NJ:         100 (Trans-Atlantic)                             │
│   NJ ↔ Dallas:         150 (Americas regional)                          │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Hub-to-Hub Traffic Characteristics

| Flow | Volume | Type | Transport Preference | SLA |
|------|--------|------|----------------------|-----|
| MUM ↔ CHN | 800M | DB replication, shared services | MPLS (primary) | <10ms, <0.1% loss |
| MUM ↔ LON | 300M | Integration, file sharing | MPLS preferred | <120ms |
| MUM ↔ NJ | 200M | Integration, reporting | MPLS preferred | <180ms |
| LON ↔ FRA | 200M | EMEA regional | MPLS/DIA | <20ms |
| NJ ↔ DAL | 150M | Americas regional | MPLS/DIA | <30ms |

### 4.2 Branch-to-Hub Traffic Flows

#### Branch Traffic Distribution

```
                BRANCH-TO-HUB TRAFFIC PATTERNS
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│   Bangalore (BLR) ───► Mumbai (Primary): 200 Mbps                       │
│                   └──► Chennai (Backup): 50 Mbps                        │
│                                                                           │
│   Delhi (DEL) ───────► Mumbai (Primary): 180 Mbps                       │
│                   └──► Chennai (Backup): 45 Mbps                        │
│                                                                           │
│   Noida (NOI) ───────► Mumbai (Primary): 80 Mbps                        │
│                   └──► Chennai (Backup): 20 Mbps                        │
│                                                                           │
│   TRAFFIC BREAKDOWN BY DESTINATION:                                       │
│                                                                           │
│   ┌───────────────────────────────────────────────────────┐             │
│   │ Bangalore (400 users, 300 Mbps provisioned):          │             │
│   ├───────────────────────────────────────────────────────┤             │
│   │ → Mumbai DC (SAP, file servers): 200 Mbps             │             │
│   │ → Chennai DR (backup): 50 Mbps                        │             │
│   │ → Internet (M365, cloud): 100 Mbps (local breakout)   │             │
│   │ → Overhead/Other: 50 Mbps                             │             │
│   └───────────────────────────────────────────────────────┘             │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Branch Application Profiles

| Application | Destination | % of BW | Transport | QoS Class |
|-------------|-------------|---------|-----------|-----------|
| **SAP ERP** | Mumbai DC | 30% | MPLS preferred | Business-Critical |
| **File Servers** | Mumbai DC | 25% | MPLS/DIA | Default |
| **M365** | Internet | 20% | DIA (local breakout) | Default |
| **Voice** | Mumbai UC | 5% | Best path (AAR) | Real-Time |
| **Video Conf** | Cloud/Internet | 10% | DIA preferred | Real-Time |
| **Backup** | Chennai DR | 5% | Best-effort | Best-Effort |
| **Other** | Mixed | 5% | Default | Default |

### 4.3 Application-Aware Routing (AAR) Configuration

#### SLA Classes

```
┌──────────────────────────────────────────────────────────────────────────┐
│                 ABHAVTECH APPLICATION SLA CLASSES                         │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   REAL-TIME (Voice, Video):                                              │
│   ────────────────────────────                                           │
│   • Latency: <150ms                                                      │
│   • Jitter: <30ms                                                        │
│   • Loss: <1%                                                            │
│   • Applications: Webex, Teams, SIP                                      │
│   • Transport: Any (automatically selects best)                          │
│   • Failover: Immediate (<5 seconds)                                     │
│                                                                           │
│   BUSINESS-CRITICAL (SAP, Oracle, Citrix):                               │
│   ─────────────────────────────────────────                              │
│   • Latency: <200ms                                                      │
│   • Jitter: <50ms                                                        │
│   • Loss: <2%                                                            │
│   • Applications: SAP, Oracle ERP, Citrix VDI                           │
│   • Transport: Prefer MPLS, allow DIA                                    │
│   • Failover: Switch within 60 seconds                                   │
│                                                                           │
│   DEFAULT (General business):                                            │
│   ───────────────────────────                                            │
│   • Latency: <300ms                                                      │
│   • Jitter: <100ms                                                       │
│   • Loss: <5%                                                            │
│   • Applications: HTTP, HTTPS, email                                     │
│   • Transport: Load balance across all                                   │
│   • Failover: Switch within 120 seconds                                  │
│                                                                           │
│   BEST-EFFORT (Bulk data):                                               │
│   ───────────────────────────                                            │
│   • Latency: No limit                                                    │
│   • Jitter: No limit                                                     │
│   • Loss: <10%                                                           │
│   • Applications: Backup, file sync (non-interactive)                    │
│   • Transport: Least-cost path                                           │
│   • Failover: None (wait for recovery)                                   │
│                                                                           │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Mumbai to London - AAR Example

**Scenario: Multiple applications from MUM to LON**

| Application | SLA Class | Normal Path | Fallback Path | Path Logic |
|-------------|-----------|-------------|---------------|------------|
| **Webex** | Real-Time | MPLS (8ms jitter) | DIA (12ms jitter) | Latency OK on both, prefer MPLS for stability |
| **SAP** | Bus-Critical | MPLS (10ms RTT) | DIA (15ms RTT) | MPLS meets <200ms easily |
| **File Sync** | Default | DIA (higher BW) | MPLS | DIA has more available bandwidth |
| **Backup** | Best-Effort | DIA (off-peak) | - | Use cheapest path |

**Failover Example:**
```
Normal State:
  Webex ─────MPLS─────► London (Latency: 125ms, Loss: 0.1%)
  
Event: MPLS latency spikes to 200ms (SLA violation)
  
AAR Action (within 5 seconds):
  Webex ─────DIA──────► London (Latency: 140ms, Loss: 0.3%)
  
Recovery: After MPLS stabilizes for 10 minutes, traffic returns
```

---

## 5. Transport Architecture

### 5.1 Transport Strategy by Site

#### Hub Sites (MUM, CHN, LON, FRA, NJ, DAL)

**Triple Transport Model:**

| Transport | Bandwidth | Monthly Cost | Purpose | Weight |
|-----------|-----------|--------------|---------|--------|
| **MPLS** | 500M-2G | $XXK-25K | Primary (critical apps) | 1 |
| **DIA** | 500M-2G | $XXX-X,XXX | Primary (cloud, Internet) | 1 |
| **5G/LTE** | 100M-1G | $XXX-X,XXX | Backup (last-resort) | 50 |

**Mumbai Transport Details:**

| Circuit ID | Provider | Type | Bandwidth | IP Subnet | Cost/Month | SLA |
|------------|----------|------|-----------|-----------|------------|-----|
| MPLS-MUM-001 | Tata Communications | MPLS L3VPN | 2 Gbps | 198.51.100.0/30 | $XX,XXX | 99.9% |
| DIA-MUM-001 | Tata Communications | Dedicated Internet | 2 Gbps | 203.0.113.0/30 | $X,XXX | 99.5% |
| 5G-MUM-001 | Jio | 5G SA | 1 Gbps (burst) | DHCP | $X,XXX | 99% |

#### Branch Sites (BLR, DEL, NOI)

**Dual Transport Model:**

| Site | Primary | Bandwidth | Secondary | Bandwidth | Total Cost |
|------|---------|-----------|-----------|-----------|------------|
| Bangalore | Jio DIA | 200M | Airtel LTE | 100M | $XXX/mo |
| Delhi | Airtel DIA | 200M | Jio LTE | 100M | $XXX/mo |
| Noida | Tata DIA | 100M | Jio LTE | 50M | $XXX/mo |

**Cost Comparison vs. MPLS:**

| Site | Old MPLS Cost | New SD-WAN Cost | Savings | % Reduction |
|------|---------------|-----------------|---------|-------------|
| Bangalore | $X,XXX/mo | $XXX/mo | $X,XXX/mo | 80% |
| Delhi | $X,XXX/mo | $XXX/mo | $X,XXX/mo | 74% |
| Noida | $X,XXX/mo | $XXX/mo | $X,XXX/mo | 73% |

### 5.2 Transport Performance Baselines

#### Expected SLA by Transport Type

| Transport | Site | Latency (to MUM) | Jitter | Loss | Notes |
|-----------|------|------------------|--------|------|-------|
| **MPLS** | | | | | |
| Mumbai ↔ Chennai | MPLS | 5ms | 1ms | 0.01% | Intra-region, excellent |
| Mumbai ↔ Bangalore | MPLS | 12ms | 2ms | 0.05% | Regional fiber |
| Mumbai ↔ London | MPLS | 120ms | 5ms | 0.1% | Trans-continental |
| **DIA** | | | | | |
| Mumbai ↔ Chennai | DIA | 8ms | 2ms | 0.02% | Good peering |
| Mumbai ↔ Bangalore | DIA | 20ms | 8ms | 0.2% | Acceptable |
| Mumbai ↔ London | DIA | 140ms | 15ms | 0.3% | Variable routing |
| **5G/LTE** | | | | | |
| Mumbai local | 5G | 25ms | 10ms | 0.5% | Backup only |
| Bangalore | LTE | 35ms (to MUM) | 15ms | 1% | Last-resort |

---

## 6. Performance Baselines

### 6.1 Application Performance Targets

#### By Application Type

| Application | Latency Target | Throughput | Concurrent Users | Platform Requirement |
|-------------|----------------|------------|------------------|----------------------|
| **SAP ERP** | <100ms | 50-100 Kbps/user | 200 @ Mumbai | Low latency path |
| **M365** | <50ms (to cloud) | Variable | 800 @ Mumbai | DIA local breakout |
| **Webex** | <150ms | 2-4 Mbps | 40 concurrent | Real-time QoS |
| **Citrix VDI** | <50ms | 150 Kbps/session | 100 concurrent | Consistent latency |
| **File Sharing** | <200ms | Bursty | 400 concurrent | High bandwidth |

### 6.2 Feature Impact on Performance

#### C8500 (Mumbai/Chennai)

| Feature Enabled | Raw Throughput | Effective Throughput | Impact |
|-----------------|----------------|----------------------|--------|
| Baseline | 100 Gbps | 100 Gbps | 0% |
| + IPsec AES-256 | 100 Gbps | 85 Gbps | -15% |
| + UTD (Snort 3.0) | 85 Gbps | 55 Gbps | -35% |
| **Final** | **100 Gbps** | **~55 Gbps** | **-45%** |

**Validation:**
- Mumbai requirement: 7 Gbps (current), 18 Gbps (Year 5)
- C8500 effective: 55 Gbps
- **Headroom: 67% (Year 5)** ✓

#### C8300 (Regional Hubs)

| Feature Enabled | Raw Throughput | Effective Throughput |
|-----------------|----------------|----------------------|
| Baseline | 10 Gbps | 10 Gbps |
| + IPsec + UTD | 10 Gbps | 5.5 Gbps |

**Validation:**
- London requirement: 2.25 Gbps (Year 3)
- C8300 effective: 5.5 Gbps
- **Headroom: 59%** ✓

#### C8200 (Branches)

| Feature Enabled | Raw Throughput | Effective Throughput |
|-----------------|----------------|----------------------|
| Baseline | 1-2 Gbps | 1-2 Gbps |
| + IPsec + UTD | 1-2 Gbps | 1.1 Gbps |

**Validation:**
- Bangalore requirement: 1.1 Gbps
- C8200 effective: 1.1 Gbps
- **Headroom: Minimal (plan upgrade Year 3)** ⚠️

---

## 7. Growth Projections

### 7.1 5-Year Capacity Roadmap

#### Aggregate Deployment Statistics

| Metric | Y0 (2026) | Y1 (2027) | Y3 (2029) | Y5 (2031) | CAGR |
|--------|-----------|-----------|-----------|-----------|------|
| **Sites** | 9 | 12 | 25 | 50 | 40% |
| **WAN Edges** | 15 | 22 | 45 | 85 | 42% |
| **Users** | 2,500 | 3,500 | 6,000 | 10,000 | 32% |
| **Bandwidth (Mbps)** | 4,500 | 7,000 | 15,000 | 30,000 | 46% |
| **VPNs/Segments** | 5 | 8 | 12 | 15 | 25% |
| **Policies** | 50 | 100 | 200 | 350 | 48% |

#### When to Upgrade

| Site | Component | Current | Upgrade Trigger | Upgrade To | Timeline |
|------|-----------|---------|-----------------|------------|----------|
| **Mumbai** | Transport | 5G total | >70% utilization | 10G MPLS + 5G DIA | Year 3 |
| **Chennai** | Transport | 4G total | DR capacity | Match Mumbai | Year 2 |
| **London** | Platform | C8300 | >60% throughput | C8500 or 2nd C8300 | Year 4 |
| **Bangalore** | Platform | C8200 | >80% throughput | C8300 | Year 3 |
| **Noida** | Platform | C8200L | >500M sustained | C8200 | Year 4 |
| **Controllers** | vManage | 32v/128G | >500 edges | No change needed | N/A |
| **Controllers** | vSmart | 16v/32G | >2000 edges | No change needed | N/A |

### 7.2 Cost Projections

#### Capital Expenditure (CapEx)

| Year | Hardware | Licenses | Services | Total CapEx | Notes |
|------|----------|----------|----------|-------------|-------|
| Y0 | $XXXK | $XXXK | $XXXK | $XXXK | Initial deployment |
| Y1 | $XXXK | $XXK | $XXK | $XXXK | 3 new sites |
| Y2 | $XXK | $XXK | $XXK | $XXXK | Chennai upgrade |
| Y3 | $XXXK | $XXXK | $XXK | $XXXK | 13 new sites |
| Y5 | $XXXK | $XXXK | $XXK | $XXXK | 25 new sites |
| **5-Year Total** | **$X.XXM** | **$XXXK** | **$XXXK** | **$X.XXM** | |

#### Operational Expenditure (OpEx)

| Category | Y0 | Y3 | Y5 | Notes |
|----------|----|----|----|----|
| **Transport Costs** | $XXXK | $XXXK | $X.XM | DIA scales with BW |
| **DNA Licensing** | $XXXK | $XXXK | $XXXK | Per-device + bandwidth |
| **Support/Maintenance** | $XXXK | $XXXK | $XXXK | 20% of CapEx |
| **Operational Labor** | $XXXK | $XXXK | $XXXK | NOC + engineering |
| **Annual OpEx** | **$XXXK** | **$X.XM** | **$X.XM** | |

**vs. MPLS Baseline:**
- Y0 MPLS: $X.XM/year
- Y0 SD-WAN: $XXXK/year
- **Savings: 61% ($X.XXM/year)**

---

## 8. Design Considerations

### 8.1 Key Design Decisions

#### Decision 1: Dual WAN Edge at Hubs Only

**Rationale:**
- Hubs aggregate traffic from multiple branches
- Hub failures impact many users (blast radius)
- Cost justified by criticality
- Branches have transport redundancy (DIA + LTE) for resiliency

**Trade-off:**
- Branch MTTR: 4 hours (acceptable for business)
- Spare hardware staged at regional hubs

#### Decision 2: MPLS Retention Strategy

**Kept:**
- Mumbai ↔ Chennai (critical DB replication)
- Hub-to-hub primary paths
- Cost: $XXXK/year

**Migrated:**
- All branch MPLS circuits
- Branch-to-hub uses DIA + LTE
- Savings: $XXXK/year

**Rationale:**
- Hub-to-hub MPLS provides consistent low latency
- Cost reduction while maintaining critical performance

#### Decision 3: DIA Local Breakout for SaaS

**Decision:**
- M365, Webex, cloud apps bypass hub
- Direct from branch to Internet
- Umbrella DNS filtering at all sites

**Benefits:**
- Reduced hub backhaul (saves ~500 Mbps @ Mumbai)
- Better user experience (lower latency to cloud)
- Cost-effective

#### Decision 4: No Branch-to-Branch Direct Tunnels

**Decision:**
- All branch traffic routes via hubs
- No on-demand branch-to-branch tunnels (at launch)

**Rationale:**
- Minimal branch-to-branch traffic (estimated <5%)
- Simplified troubleshooting
- Can enable on-demand later if needed

#### Decision 5: Hardware Crypto Mandatory

**Decision:**
- All platforms must have hardware crypto acceleration
- AES-256-GCM encryption enabled by default

**Rationale:**
- Minimal performance impact with HW crypto
- Compliance requirements (data-in-transit encryption)
- No CPU penalty

### 8.2 SD-Access Integration Considerations

#### Mumbai/Chennai SD-Access Handoff

**Architecture:**
- Independent domain model (SD-Access ↔ SD-WAN are separate)
- L3 VRF handoff via eBGP
- SD-Access Border nodes: 4 per site (C9500-40X)
- Connectivity: 4x 10GbE links per WAN Edge

**VN-to-VPN Mapping:**

| SD-Access VN | VN ID | SD-WAN VPN | VPN ID | Purpose |
|--------------|-------|------------|--------|---------|
| Corporate | 4097 | Corporate | 10 | Employee endpoints |
| Guest | 4098 | Guest | 20 | Guest WiFi |
| Servers | 4099 | Servers | 30 | DC servers |
| Voice | 4100 | Voice | 40 | IP phones, UC |
| IoT | 4101 | IoT | 50 | Smart building |

**Route Exchange:**
- SD-Access exports: Campus subnets (LISP EIDs)
- SD-WAN exports: WAN site subnets
- Filtering: Deny default routes, summarize where possible

**SGT Propagation:**
- Inline tagging across WAN
- TrustSec enabled on WAN Edge
- SGT preserved end-to-end

### 8.3 High Availability Considerations

#### Failure Scenarios and Recovery

| Scenario | Detection Time | Failover Time | Total RTO | Impact |
|----------|----------------|---------------|-----------|--------|
| **Transport link failure** | 3s (BFD) | <1s | <5s | Seamless |
| **WAN Edge failure (hub)** | 3s (BFD) | <2s | <10s | Brief disruption |
| **vSmart failure** | 30s (OMP keepalive) | <30s | <60s | No data plane impact |
| **vManage failure** | N/A | N/A | 0s | No impact (data plane) |
| **Site-level failure (hub)** | Variable | <30s | <2 min | Route to backup hub |

#### BFD Timer Settings

| Link Type | Hello Interval | Multiplier | Failure Detection |
|-----------|----------------|------------|-------------------|
| MPLS (stable) | 1000ms | 3 | 3 seconds |
| DIA (variable) | 1000ms | 7 | 7 seconds |
| LTE (high variance) | 1000ms | 10 | 10 seconds |

**Rationale:**
- Tighter timers for stable links (MPLS)
- Looser timers for variable links (LTE) to avoid false positives

### 8.4 Security Considerations

#### Encryption

**Control Plane:**
- DTLS 1.2 (all control connections)
- Certificate-based authentication (PKI)
- Perfect Forward Secrecy (PFS)

**Data Plane:**
- IPsec ESP (all data traffic)
- AES-256-GCM (authenticated encryption)
- Hardware offload (no CPU penalty)
- Anti-replay protection (64-bit sequence)

#### Segmentation

**VPN Isolation:**
- VPN 10 (Corporate) isolated from VPN 20 (Guest)
- Inter-VPN routing disabled by default
- Firewall inspection for any inter-VPN traffic

#### Threat Prevention

**UTD (Unified Threat Defense):**
- Snort 3.0 IPS at hub sites
- Signature-based + behavioral detection
- Auto-update (daily)
- Performance: ~35-40% throughput impact (acceptable)

**URL Filtering:**
- Cisco Umbrella at all sites
- DNS-layer security
- SaaS security for M365, Salesforce

---

### Appendix A: Hardware BOMs

#### Mumbai DC (MUM) - Bill of Materials

| Part Number | Description | Quantity | Unit Price | Extended |
|-------------|-------------|----------|------------|----------|
| C8500-12X4QC | Catalyst 8500 chassis | 2 | $XX,XXX | $XXX,XXX |
| PWR-8500-AC | 8500 AC power supply | 4 | $X,XXX | $X,XXX |
| NIM-LTEA-EA | 5G LTE module | 2 | $X,XXX | $X,XXX |
| SFP-10G-SR | 10G SFP+ transceiver | 20 | $XXX | $XX,XXX |
| CON-SNT-C85012X | SmartNet 8x5xNBD | 2 | $X,XXX | $XX,XXX |
| **Subtotal Mumbai** | | | | **$XXX,XXX** |

#### Bangalore (BLR) - Bill of Materials

| Part Number | Description | Quantity | Unit Price | Extended |
|-------------|-------------|----------|------------|----------|
| C8200-1N-4T | Catalyst 8200 chassis | 1 | $X,XXX | $X,XXX |
| NIM-2GE-CU-SFP | Dual GE NIM | 1 | $XXX | $XXX |
| NIM-LTEA-LA | 4G LTE module | 1 | $X,XXX | $X,XXX |
| CON-SNT-C82001N | SmartNet 8x5xNBD | 1 | $XXX | $XXX |
| **Subtotal Bangalore** | | | | **$XX,XXX** |

#### Total Deployment Hardware Cost

| Site Tier | Sites | Cost per Site | Total |
|-----------|-------|---------------|-------|
| Tier 1 (C8500 x2) | 2 | $XXXK | $XXXK |
| Tier 2 (C8300 x2) | 4 | $XXK | $XXXK |
| Tier 3 (C8200 x1) | 2 | $XXK | $XXK |
| Tier 4 (C8200L x1) | 1 | $XK | $XK |
| Controllers (vManage, vSmart, vBond) | - | $XXK | $XXK |
| **Grand Total** | **9** | | **$XXXK** |

---

### Appendix B: Interface Addressing Plan

#### Mumbai WAN Edge (MUM-WAN-01)

| Interface | Description | IP Address | Subnet Mask | VRF/VPN | VLAN | Notes |
|-----------|-------------|------------|-------------|---------|------|-------|
| Te0/0/0 | MPLS Transport | 198.51.100.1 | /30 | VPN 0 | - | Tata MPLS |
| Te0/0/1 | DIA Transport | 203.0.113.1 | /30 | VPN 0 | - | Tata DIA |
| Cell0/4/0 | 5G Backup | DHCP | - | VPN 0 | - | Jio 5G |
| Te0/1/0 | SD-Access Border-1 | 10.252.10.1 | /30 | VPN 10 | - | Corporate |
| Te0/1/1 | SD-Access Border-2 | 10.252.10.5 | /30 | VPN 20 | - | Guest |
| Te0/1/2 | SD-Access Border-3 | 10.252.10.9 | /30 | VPN 30 | - | Servers |
| Te0/1/3 | SD-Access Border-4 | 10.252.10.13 | /30 | VPN 40 | - | Voice |
| Loopback0 | System IP | 10.100.1.1 | /32 | - | - | OMP/BFD |

#### System IP and Site ID Allocation

| Site | Site ID | System IP (Edge 1) | System IP (Edge 2) | Region |
|------|---------|--------------------|--------------------|--------|
| Mumbai | 100 | 10.100.1.1 | 10.100.1.2 | APAC |
| Chennai | 110 | 10.100.2.1 | 10.100.2.2 | APAC |
| London | 200 | 10.100.3.1 | 10.100.3.2 | EMEA |
| Frankfurt | 210 | 10.100.4.1 | 10.100.4.2 | EMEA |
| New Jersey | 300 | 10.100.5.1 | 10.100.5.2 | Americas |
| Dallas | 310 | 10.100.6.1 | 10.100.6.2 | Americas |
| Bangalore | 120 | 10.100.7.1 | - | APAC |
| Delhi | 130 | 10.100.8.1 | - | APAC |
| Noida | 140 | 10.100.9.1 | - | APAC |

---

### Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | January 2026 | Network Architecture Team | Initial detailed design |

---

**End of Abhavtech SD-WAN Detailed Capacity Planning & Traffic Flow Design**

*This document contains actual deployment data for Abhavtech.com's 9-site SD-WAN implementation and should be treated as confidential.*

---
