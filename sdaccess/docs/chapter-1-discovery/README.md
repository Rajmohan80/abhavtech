# Chapter 1: Discovery & Assessment

> **Chapter Version**: 1.0  
> **Last Updated**: December 2025

---

## Chapter Overview

This chapter provides a comprehensive discovery and assessment framework for migrating from a traditional four-layer hierarchical network to Cisco SD-Access. The assessment covers infrastructure inventory, capability mapping, gap analysis, and readiness evaluation across all global sites.

---

## 1.1 Current State Infrastructure Inventory

### 1.1.1 Global Site Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      GLOBAL SITE TOPOLOGY - CURRENT STATE                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                              ┌───────────────┐                              │
│                              │   GLOBAL WAN  │                              │
│                              │  (MPLS + DIA) │                              │
│                              └───────┬───────┘                              │
│                                      │                                      │
│         ┌────────────────────────────┼────────────────────────────┐         │
│         │                            │                            │         │
│         ▼                            ▼                            ▼         │
│  ┌──────────────┐           ┌──────────────┐           ┌──────────────┐     │
│  │    APAC      │           │     EMEA     │           │   AMERICAS   │     │
│  │   REGION     │           │    REGION    │           │    REGION    │     │
│  └──────┬───────┘           └──────┬───────┘           └──────┬───────┘     │
│         │                          │                          │             │
│    ┌────┴────┐                ┌────┴────┐                ┌────┴────┐        │
│    │         │                │         │                │         │        │
│    ▼         ▼                ▼         ▼                ▼         ▼        │
│ ┌──────┐ ┌──────┐        ┌──────┐ ┌──────┐        ┌──────┐ ┌──────┐       │
│ │Mumbai│ │Chennai│       │London│ │Frank-│        │ New  │ │Dallas│       │
│ │ HUB  │ │  HUB  │       │ HUB  │ │ furt │        │Jersey│ │ HUB  │       │
│ └──┬───┘ └──┬───┘        └──┬───┘ └──┬───┘        └──┬───┘ └──┬───┘       │
│    │        │               │        │               │        │            │
│    └───┬────┘               └───┬────┘               └───┬────┘            │
│        │                        │                        │                  │
│   ┌────┴────┐              ┌────┴────┐              ┌────┴────┐             │
│   ▼    ▼    ▼              ▼    ▼    ▼              ▼    ▼    ▼             │
│ ┌───┐┌───┐┌───┐         ┌───┐┌───┐┌───┐         ┌───┐┌───┐┌───┐          │
│ │BLR││DEL││NOI│         │BR1││BR2││BR3│         │BR1││BR2││BR3│          │
│ └───┘└───┘└───┘         └───┘└───┘└───┘         └───┘└───┘└───┘          │
│  Bangalore Delhi Noida   EMEA Branches           US Branches              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.1.2 Site Classification Matrix

| Site Type | Location | Role | Users | Access Switches | Core/Dist | WAN Bandwidth |
|-----------|----------|------|-------|-----------------|-----------|---------------|
| **Regional HQ** | Mumbai | Primary HUB APAC | 2,500 | 48 | 4 Core, 8 Dist | 1 Gbps MPLS |
| **Regional HQ** | Chennai | Secondary HUB APAC | 1,800 | 36 | 2 Core, 6 Dist | 500 Mbps MPLS |
| **Regional HQ** | London | Primary HUB EMEA | 2,200 | 42 | 4 Core, 8 Dist | 1 Gbps MPLS |
| **Regional HQ** | Frankfurt | Secondary HUB EMEA | 1,500 | 28 | 2 Core, 4 Dist | 500 Mbps MPLS |
| **Regional HQ** | New Jersey | Primary HUB Americas | 2,800 | 52 | 4 Core, 10 Dist | 1 Gbps MPLS |
| **Regional HQ** | Dallas | Secondary HUB Americas | 1,600 | 32 | 2 Core, 6 Dist | 500 Mbps MPLS |
| **Large Branch** | Bangalore | Campus | 800 | 16 | 2 Dist | 200 Mbps MPLS |
| **Large Branch** | Delhi | Campus | 600 | 12 | 2 Dist | 150 Mbps MPLS |
| **Medium Branch** | Noida | Office | 300 | 6 | 1 Dist | 100 Mbps MPLS |
| **EMEA Branch** | Various (12 sites) | Mixed | 50-400 | 2-8 | 0-2 Dist | 50-200 Mbps |
| **US Branch** | Various (15 sites) | Mixed | 50-500 | 2-10 | 0-2 Dist | 50-250 Mbps |

### 1.1.3 Network Device Inventory Summary

| Device Category | Model Series | Quantity | Age (Years) | SD-Access Ready |
|-----------------|--------------|----------|-------------|-----------------|
| **Core Switches** | Catalyst 6500/6800 | 18 | 5-8 | No (Replace) |
| **Core Switches** | Catalyst 9500 | 6 | 1-2 | Yes |
| **Distribution** | Catalyst 4500-X | 32 | 4-6 | Partial |
| **Distribution** | Catalyst 9400 | 12 | 1-2 | Yes |
| **Access Switches** | Catalyst 3750/3850 | 180 | 4-8 | No (Replace) |
| **Access Switches** | Catalyst 9300 | 120 | 1-3 | Yes |
| **WAN Edge** | ISR 4451/4351 | 24 | 3-5 | Yes (SD-WAN Ready) |
| **Firewalls** | ASA 5500-X | 18 | 4-6 | Upgrade to FTD |
| **Wireless** | WLC 5520/8540 | 12 | 3-5 | Migrate to 9800 |
| **Wireless** | Aironet 2800/3800 | 450 | 2-4 | Yes |

### 1.1.4 Current WAN Infrastructure Inventory

**Current WAN Architecture: Traditional MPLS**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CURRENT WAN ARCHITECTURE - MPLS                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        ┌───────────────────────┐                            │
│                        │   MPLS PROVIDER       │                            │
│                        │   BACKBONE            │                            │
│                        │   (Global MPLS VPN)   │                            │
│                        └───────────┬───────────┘                            │
│                                    │                                        │
│       ┌────────────────────────────┼────────────────────────────┐          │
│       │                            │                            │          │
│       ▼                            ▼                            ▼          │
│  ┌─────────┐                 ┌─────────┐                 ┌─────────┐       │
│  │  APAC   │                 │  EMEA   │                 │ AMERICAS│       │
│  │   PE    │                 │   PE    │                 │   PE    │       │
│  │ Mumbai  │                 │ London  │                 │   NJ    │       │
│  └────┬────┘                 └────┬────┘                 └────┬────┘       │
│       │                           │                           │            │
│  ┌────┴────┐                 ┌────┴────┐                 ┌────┴────┐       │
│  │   CE    │                 │   CE    │                 │   CE    │       │
│  │ISR 4451 │                 │ISR 4451 │                 │ISR 4451 │       │
│  └────┬────┘                 └────┬────┘                 └────┬────┘       │
│       │                           │                           │            │
│       ▼                           ▼                           ▼            │
│  Campus LAN                  Campus LAN                  Campus LAN        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

CURRENT LIMITATIONS:
- Single transport (MPLS only) - no redundancy path diversity
- Manual configuration and provisioning
- No application-aware routing
- Limited visibility into WAN performance
- High cost per Mbps for MPLS circuits
- Long lead times for new circuit provisioning
```

**WAN Circuit Inventory**

| Site | Circuit Type | Provider | Bandwidth | Contract End | Monthly Cost |
|------|-------------|----------|-----------|--------------|--------------|
| **Mumbai** | MPLS L3VPN | Tata Comm | 1 Gbps | Dec 2026 | $X,XXX|
| **Mumbai** | DIA (Backup) | Airtel | 500 Mbps | Jun 2025 | $X,XXX|
| **Chennai** | MPLS L3VPN | Tata Comm | 500 Mbps | Dec 2026 | $X,XXX|
| **Chennai** | DIA (Backup) | Jio | 200 Mbps | Mar 2025 | $X,XXX|
| **London** | MPLS L3VPN | BT Global | 1 Gbps | Dec 2026 | $X,XXX|
| **London** | DIA (Backup) | Virgin | 500 Mbps | Sep 2025 | $X,XXX|
| **Frankfurt** | MPLS L3VPN | Deutsche Tel | 500 Mbps | Dec 2026 | $X,XXX|
| **Frankfurt** | DIA (Backup) | Vodafone | 200 Mbps | Jun 2025 | $X,XXX|
| **New Jersey** | MPLS L3VPN | AT&T | 1 Gbps | Dec 2026 | $X,XXX|
| **New Jersey** | DIA (Backup) | Verizon | 1 Gbps | Dec 2025 | $X,XXX|
| **Dallas** | MPLS L3VPN | AT&T | 500 Mbps | Dec 2026 | $X,XXX|
| **Dallas** | DIA (Backup) | Spectrum | 500 Mbps | Mar 2025 | $X,XXX|
| **Bangalore** | MPLS L3VPN | Tata Comm | 200 Mbps | Dec 2026 | $X,XXX|
| **Delhi** | MPLS L3VPN | Tata Comm | 150 Mbps | Dec 2026 | $X,XXX|
| **Noida** | MPLS L3VPN | Airtel | 100 Mbps | Sep 2025 | $X,XXX|
| **EMEA Branches** | MPLS L3VPN | Various | 50-200 Mbps | Various | $X,XXX-5,000 |
| **US Branches** | MPLS L3VPN | AT&T | 50-250 Mbps | Various | $X,XXX-4,500 |

**Current WAN Router Inventory**

| Location | Model | Role | IOS Version | SD-WAN Ready | Qty |
|----------|-------|------|-------------|--------------|-----|
| Mumbai | ISR 4451-X | CE Router | IOS-XE 17.6 | Yes (vEdge/cEdge) | 2 |
| Chennai | ISR 4351 | CE Router | IOS-XE 17.6 | Yes (cEdge) | 2 |
| London | ISR 4451-X | CE Router | IOS-XE 17.6 | Yes (vEdge/cEdge) | 2 |
| Frankfurt | ISR 4351 | CE Router | IOS-XE 17.6 | Yes (cEdge) | 2 |
| New Jersey | ISR 4451-X | CE Router | IOS-XE 17.6 | Yes (vEdge/cEdge) | 2 |
| Dallas | ISR 4351 | CE Router | IOS-XE 17.6 | Yes (cEdge) | 2 |
| Bangalore | ISR 4331 | CE Router | IOS-XE 17.3 | Yes (cEdge) | 1 |
| Delhi | ISR 4331 | CE Router | IOS-XE 17.3 | Yes (cEdge) | 1 |
| Noida | ISR 4321 | CE Router | IOS-XE 17.3 | Yes (cEdge) | 1 |
| EMEA Branches | ISR 4321/1100 | CE Router | Various | Partial | 12 |
| US Branches | ISR 4321/1100 | CE Router | Various | Partial | 15 |

**Current WAN Challenges**

| Challenge | Impact | Priority |
|-----------|--------|----------|
| Single transport dependency | No path diversity, SLA risk | Critical |
| Manual provisioning | 4-6 week lead time for changes | High |
| No application awareness | Cannot prioritize business apps | High |
| Limited visibility | Difficult to troubleshoot WAN issues | Medium |
| High MPLS costs | $X,XXX+/month total WAN spend | High |
| No cloud connectivity | Traffic hairpin through DC | Medium |
| Branch security | Backhauling all Internet traffic | Medium |

### 1.1.5 Target WAN Architecture - SD-WAN (Parallel Migration)

**Note**: SD-WAN detailed design is covered in a separate project document. This section provides integration context for the SD-Access migration.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TARGET WAN ARCHITECTURE - SD-WAN                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                      ┌─────────────────────────┐                            │
│                      │     vMANAGE             │                            │
│                      │  (Orchestration)        │                            │
│                      └───────────┬─────────────┘                            │
│                                  │                                          │
│          ┌───────────────────────┼───────────────────────┐                 │
│          │                       │                       │                 │
│          ▼                       ▼                       ▼                 │
│    ┌──────────┐           ┌──────────┐           ┌──────────┐             │
│    │ vSMART   │           │ vBOND    │           │ vSMART   │             │
│    │ (Control)│           │ (Auth)   │           │ (Control)│             │
│    └──────────┘           └──────────┘           └──────────┘             │
│                                                                             │
│    ════════════════════════════════════════════════════════════            │
│    ║              SD-WAN OVERLAY FABRIC                       ║            │
│    ║         (IPsec/DTLS over Multiple Transports)           ║            │
│    ════════════════════════════════════════════════════════════            │
│                                                                             │
│    TRANSPORT OPTIONS:                                                       │
│    ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐          │
│    │  MPLS    │    │ Internet │    │   5G/LTE │    │  Cloud   │          │
│    │ (Primary)│    │(Secondary)│   │ (Backup) │    │(Onramp)  │          │
│    └──────────┘    └──────────┘    └──────────┘    └──────────┘          │
│                                                                             │
│    HUB SITES (MPLS + Internet):                                            │
│    Mumbai, Chennai, London, Frankfurt, New Jersey, Dallas                   │
│                                                                             │
│    BRANCH SITES (Internet + 5G Backup):                                    │
│    Bangalore, Delhi, Noida, EMEA Branches, US Branches                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**SD-WAN Transport Strategy**

| Site Type | Primary Transport | Secondary Transport | Tertiary (Backup) |
|-----------|-------------------|---------------------|-------------------|
| **Hub Sites** | MPLS (existing) | Dedicated Internet | - |
| **Large Branches** | MPLS (existing) | Internet DIA | 5G/LTE |
| **Medium Branches** | Internet DIA | 5G/LTE | - |
| **Small Branches** | Internet DIA | 5G/LTE | - |
| **Remote/Temp Sites** | 5G/LTE (primary) | Internet (if available) | - |

**SD-WAN Edge Device Strategy**

| Site Type | Device Model | Transport Interfaces | Deployment |
|-----------|--------------|---------------------|------------|
| Hub Sites | C8500-12X (or existing ISR 4451 as cEdge) | 2×MPLS, 2×Internet | New or upgrade |
| Large Branch | ISR 4331/4351 (cEdge mode) | 1×MPLS, 1×Internet, 1×LTE | Upgrade existing |
| Medium Branch | ISR 1100-4G | 1×Internet, 1×LTE | New |
| Small Branch | ISR 1100-4GLTENA | 1×Internet, 1×LTE | New |

**SD-Access to SD-WAN Integration Points**

| Integration | SD-Access Component | SD-WAN Component | Handoff |
|-------------|---------------------|------------------|---------|
| Physical | Fabric Border Node | SD-WAN Edge Router | L3 VRF |
| Logical | Virtual Networks (VN) | VPN Segments | VRF-to-VPN mapping |
| Policy | SGT Tags | App-Aware Routing | Policy correlation |
| Management | DNA Center | vManage | API integration |
| Visibility | Assurance | vAnalytics | Combined dashboards |

---

## 1.2 Technical Requirements Analysis

### 1.2.1 Core Technical Requirements

| Requirement ID | Category | Requirement Description | Priority |
|----------------|----------|------------------------|----------|
| **NET-001** | Segmentation | Implement micro-segmentation across all sites | Critical |
| **NET-002** | Automation | Zero-touch provisioning for new switches | High |
| **NET-003** | Policy | Centralized policy management across regions | Critical |
| **NET-004** | Visibility | End-to-end path visibility and analytics | High |
| **NET-005** | Security | 802.1X authentication for all endpoints | Critical |
| **NET-006** | Mobility | Seamless roaming within and across buildings | Medium |
| **NET-007** | Scale | Support 15,000+ concurrent endpoints | Critical |
| **NET-008** | Availability | 99.99% uptime for critical services | Critical |
| **NET-009** | Compliance | Meet PCI-DSS, SOC2, GDPR requirements | Critical |
| **NET-010** | Integration | Integrate with existing ServiceNow, Splunk | High |

### 1.2.2 SD-Access Fabric Requirements

| Component | Requirement | Sizing |
|-----------|-------------|--------|
| **Fabric Sites** | Autonomous fabric per region | 6 primary fabrics |
| **Virtual Networks (VN)** | Separate overlay for business units | 4-6 VNs |
| **Scalable Groups (SGT)** | Micro-segmentation policies | 15-20 SGTs |
| **Anycast Gateway** | Distributed gateway per VN | Per Edge Node |
| **Host Pools** | IP address pools per site | /22 to /20 per site |
| **Control Plane HA** | Redundant CP nodes per fabric | 2 CP nodes per site |
| **Border Node HA** | Redundant border for WAN/DC | 2 Border nodes per hub |

### 1.2.3 DNAC Controller Requirements

**Cluster Sizing Calculation:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DNA CENTER SIZING CALCULATION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Total Network Devices:                                                     │
│  ──────────────────────                                                     │
│  Core Switches:           24 devices                                        │
│  Distribution Switches:   44 devices                                        │
│  Access Switches:        300 devices                                        │
│  WAN Routers:             24 devices                                        │
│  Wireless Controllers:    12 devices                                        │
│  Access Points:          450 devices                                        │
│  ─────────────────────────────────────                                      │
│  TOTAL MANAGED DEVICES:  854 devices                                        │
│                                                                             │
│  DNAC Appliance Selection:                                                  │
│  ─────────────────────────                                                  │
│  DN2-HW-APL-XL (Extra Large Cluster)                                        │
│                                                                             │
│  Capacity:                                                                  │
│  - Up to 8,000 network devices                                              │
│  - Up to 200,000 endpoints                                                  │
│  - 3-node cluster for HA                                                    │
│                                                                             │
│  Deployment: Single DNAC Cluster (Primary: New Jersey, DR: London)          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2.4 ISE Deployment Requirements

**ISE Node Sizing:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ISE DEPLOYMENT SIZING                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Endpoint Population:                                                       │
│  ────────────────────                                                       │
│  Employees (Corporate Devices):     12,000 endpoints                        │
│  BYOD Devices:                       3,000 endpoints                        │
│  IoT/OT Devices:                     2,500 endpoints                        │
│  Guest Devices (Peak):               1,500 endpoints                        │
│  ─────────────────────────────────────────────────                          │
│  TOTAL CONCURRENT ENDPOINTS:        19,000 endpoints                        │
│                                                                             │
│  ISE Deployment Model: Distributed                                          │
│  ─────────────────────────────────────                                      │
│                                                                             │
│  Primary Administration Node (PAN):                                         │
│    Location: New Jersey (Primary)                                           │
│    Appliance: SNS-3695-K9 (Large)                                           │
│                                                                             │
│  Secondary Administration Node (PAN):                                       │
│    Location: London (Secondary)                                             │
│    Appliance: SNS-3695-K9 (Large)                                           │
│                                                                             │
│  Policy Service Nodes (PSN) - Regional:                                     │
│    APAC: Mumbai, Chennai (2 × SNS-3655-K9)                                  │
│    EMEA: London, Frankfurt (2 × SNS-3655-K9)                                │
│    Americas: New Jersey, Dallas (2 × SNS-3655-K9)                           │
│                                                                             │
│  Monitoring & Troubleshooting Node (MnT):                                   │
│    Location: New Jersey (Co-located with PAN)                               │
│    Location: London (Co-located with Secondary PAN)                         │
│                                                                             │
│  pxGrid Nodes:                                                              │
│    Integrated with PAN nodes for SD-Access integration                      │
│                                                                             │
│  PSN Capacity Formula:                                                      │
│  ─────────────────────                                                      │
│  Authentications per second = Endpoints × Auth Rate × Peak Factor           │
│  19,000 × 0.001 × 2.5 = 47.5 auth/sec per PSN pair                          │
│                                                                             │
│  SNS-3655 supports up to 40,000 concurrent sessions                         │
│  Total PSN capacity: 6 nodes × 40,000 = 240,000 (sufficient headroom)       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1.3 Gap Analysis

### 1.3.1 Infrastructure Gaps

| Gap ID | Category | Current State | Required State | Remediation |
|--------|----------|---------------|----------------|-------------|
| **GAP-001** | Core Switches | Catalyst 6500/6800 (non-fabric) | Catalyst 9500 (fabric-ready) | Replace 18 devices |
| **GAP-002** | Access Switches | Catalyst 3750/3850 | Catalyst 9300/9200 | Replace 180 devices |
| **GAP-003** | WLC | 5520/8540 (AireOS) | 9800 (IOS-XE) | Migrate 12 controllers |
| **GAP-004** | Firewall | ASA 5500-X | FTD with SGT support | Upgrade/Replace 18 units |
| **GAP-005** | DNAC | None | DN2-HW-APL-XL Cluster | New deployment |
| **GAP-006** | ISE | Standalone ACS | ISE 3.x Distributed | New deployment |
| **GAP-007** | Underlay | Manual config, no automation | IS-IS/OSPF underlay | Redesign routing |
| **GAP-008** | Overlay | VLAN-based | VXLAN/LISP | New overlay fabric |

### 1.3.2 Capability Gaps

| Capability | Current | Target | Gap Impact |
|------------|---------|--------|------------|
| **Zero Trust** | Perimeter firewall only | End-to-end SGT | High - Security posture |
| **Automation** | CLI scripts, manual | Intent-based, API-driven | High - Operational efficiency |
| **Analytics** | SNMP, NetFlow | AI/ML Assurance | Medium - Proactive ops |
| **Profiling** | Static MAC-based | Dynamic ISE profiling | High - IoT security |
| **Guest Access** | Captive portal only | Sponsored, self-reg, BYOD | Medium - User experience |

### 1.3.3 Skills Gap Assessment

| Skill Area | Current Level | Required Level | Training Needed |
|------------|---------------|----------------|-----------------|
| **SD-Access Design** | Low | Expert | Cisco DESDG certification |
| **DNA Center Admin** | None | Advanced | DNAC Administration course |
| **ISE Configuration** | Basic | Expert | ISE for Engineers course |
| **Python/Ansible** | Basic | Intermediate | Network Automation training |
| **LISP/VXLAN** | None | Intermediate | SD-Access Fundamentals |

---

## 1.4 Network Assessment Details

### 1.4.1 Current IP Addressing Scheme

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CURRENT IP ADDRESSING STRUCTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  APAC Region (10.0.0.0/8 subset):                                           │
│  ─────────────────────────────────                                          │
│  Mumbai HQ:        10.10.0.0/16                                             │
│    - Data VLANs:   10.10.0.0/18                                             │
│    - Voice VLANs:  10.10.64.0/18                                            │
│    - Mgmt:         10.10.128.0/20                                           │
│    - Server:       10.10.144.0/20                                           │
│                                                                             │
│  Chennai HQ:       10.11.0.0/16                                             │
│  Bangalore:        10.12.0.0/17                                             │
│  Delhi:            10.13.0.0/17                                             │
│  Noida:            10.14.0.0/18                                             │
│                                                                             │
│  EMEA Region:                                                               │
│  ─────────────────                                                          │
│  London HQ:        10.20.0.0/16                                             │
│  Frankfurt HQ:     10.21.0.0/16                                             │
│  EMEA Branches:    10.22.0.0/16 - 10.29.0.0/16                              │
│                                                                             │
│  Americas Region:                                                           │
│  ─────────────────                                                          │
│  New Jersey HQ:    10.30.0.0/16                                             │
│  Dallas HQ:        10.31.0.0/16                                             │
│  US Branches:      10.32.0.0/16 - 10.45.0.0/16                              │
│                                                                             │
│  Infrastructure:                                                            │
│  ────────────────                                                           │
│  Loopbacks:        10.250.0.0/16                                            │
│  P2P Links:        10.251.0.0/16                                            │
│  Management OOB:   10.252.0.0/16                                            │
│                                                                             │
│  CURRENT VLAN COUNT: 847 VLANs across all sites                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.4.2 Current Routing Design

| Region | IGP | WAN Routing | MPLS Integration |
|--------|-----|-------------|------------------|
| **APAC** | OSPF Area 0 + Stubs | BGP with MPLS PE | VRF-Lite per tenant |
| **EMEA** | OSPF Area 0 + Stubs | BGP with MPLS PE | VRF-Lite per tenant |
| **Americas** | EIGRP + OSPF redistribution | BGP with MPLS PE | VRF-Lite per tenant |
| **Inter-Region** | eBGP over MPLS backbone | AS 65001 (Enterprise) | L3VPN |

### 1.4.3 Current Security Posture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CURRENT SECURITY ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Authentication:                                                            │
│  ───────────────                                                            │
│  - MAB (MAC Authentication Bypass) on 60% of ports                          │
│  - 802.1X on 25% of ports (corporate PCs only)                              │
│  - Open ports: 15% (legacy devices, printers)                               │
│                                                                             │
│  Authorization:                                                             │
│  ──────────────                                                             │
│  - VLAN assignment based on port/MAC                                        │
│  - No dynamic authorization                                                 │
│  - Static ACLs on distribution layer                                        │
│                                                                             │
│  Segmentation:                                                              │
│  ─────────────                                                              │
│  - VLAN-based segmentation                                                  │
│  - Inter-VLAN routing at distribution                                       │
│  - ACLs for east-west traffic (limited)                                     │
│  - Firewall for north-south traffic only                                    │
│                                                                             │
│  Identified Security Gaps:                                                  │
│  ─────────────────────────                                                  │
│  1. No endpoint profiling (unknown devices)                                 │
│  2. Limited east-west segmentation                                          │
│  3. No posture assessment                                                   │
│  4. Static VLAN = lateral movement risk                                     │
│  5. No IoT/OT visibility                                                    │
│  6. Guest network shares infrastructure                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1.5 Readiness Assessment

### 1.5.1 SD-Access Readiness Scorecard

| Assessment Area | Score | Status | Notes |
|-----------------|-------|--------|-------|
| **Network Hardware** | 45% | ⚠️ Partial | 40% devices need replacement |
| **WAN Infrastructure** | 70% | ⚠️ Partial | MPLS compatible, consider SD-WAN |
| **IP Addressing** | 80% | ✅ Ready | Structured scheme, minor optimization |
| **AAA Infrastructure** | 20% | ❌ Not Ready | ISE deployment required |
| **Controller (DNAC)** | 0% | ❌ Not Ready | New deployment required |
| **Wireless** | 55% | ⚠️ Partial | WLC migration to 9800 needed |
| **Staff Skills** | 30% | ⚠️ Partial | Training program required |
| **Documentation** | 40% | ⚠️ Partial | Standards need update |
| **Change Process** | 75% | ✅ Ready | Mature CAB process exists |
| **Monitoring Tools** | 50% | ⚠️ Partial | Integration with DNAC needed |

**Overall Readiness Score: 47%** - Significant preparation required.

### 1.5.2 Pre-Migration Checklist

| Category | Checklist Item | Status | Owner |
|----------|---------------|--------|-------|
| **Infrastructure** | Hardware inventory complete | ☐ | Network Ops |
| **Infrastructure** | Software versions documented | ☐ | Network Ops |
| **Infrastructure** | Device credentials verified | ☐ | Security |
| **Network** | IP address plan reviewed | ☐ | Network Arch |
| **Network** | Routing design documented | ☐ | Network Arch |
| **Network** | VLAN/Subnet mapping complete | ☐ | Network Ops |
| **Security** | Current ACL audit complete | ☐ | Security |
| **Security** | Authentication inventory | ☐ | Security |
| **Security** | Compliance requirements documented | ☐ | Compliance |
| **Applications** | Critical apps identified | ☐ | App Team |
| **Applications** | Traffic patterns documented | ☐ | Network Ops |
| **Operations** | Runbook review complete | ☐ | Ops Manager |
| **Operations** | Monitoring integration plan | ☐ | Ops Manager |
| **Training** | Training needs assessment | ☐ | HR/Training |
| **Training** | Lab environment available | ☐ | Network Arch |

---

## 1.6 Success Criteria & KPIs

### 1.6.1 Technical Success Metrics

| Metric | Current Baseline | Target | Measurement Method |
|--------|------------------|--------|-------------------|
| **Provisioning Time** | 2-4 weeks/site | < 4 hours/site | DNAC deployment logs |
| **Policy Deployment** | 1-2 days | < 5 minutes | ISE/DNAC timestamps |
| **Network Visibility** | 40% path visibility | 100% path trace | DNAC Assurance |
| **Security Incidents** | 15/month | < 5/month | SIEM correlation |
| **MTTR** | 4 hours average | < 30 minutes | Incident tickets |
| **Change Success Rate** | 85% | > 98% | CAB metrics |
| **Authentication Success** | 92% | > 99.5% | ISE reports |
| **Uptime** | 99.9% | 99.99% | Monitoring tools |

### 1.6.2 Business-Technical Alignment

| Business Objective | Technical Enabler | KPI |
|-------------------|-------------------|-----|
| Faster time-to-market | Zero-touch provisioning | Site deployment < 1 day |
| Reduced security risk | Micro-segmentation | 90% policy coverage |
| Operational efficiency | Automation/Assurance | 50% ticket reduction |
| Compliance readiness | Centralized audit logs | 100% endpoint visibility |
| Agility for M&A | Fabric extensibility | Site integration < 2 weeks |

---

## 1.7 Risk Assessment

### 1.7.1 Technical Risks

| Risk ID | Risk Description | Probability | Impact | Mitigation |
|---------|-----------------|-------------|--------|------------|
| **RISK-001** | Legacy device incompatibility | High | High | Phased hardware refresh |
| **RISK-002** | ISE learning curve impacts deployment | Medium | High | Pre-deployment training |
| **RISK-003** | Application breakage during migration | Medium | Critical | Extensive UAT, staged rollout |
| **RISK-004** | Authentication failures at cutover | Medium | High | Parallel run period |
| **RISK-005** | Insufficient bandwidth for VXLAN overhead | Low | Medium | Bandwidth assessment |
| **RISK-006** | DNAC-ISE integration issues | Medium | High | Lab validation |
| **RISK-007** | Skills gap delays deployment | High | Medium | Training program |
| **RISK-008** | Vendor support escalation delays | Low | Medium | TAC priority contract |

### 1.7.2 Risk Heat Map

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            RISK HEAT MAP                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  IMPACT ▲                                                                   │
│         │                                                                   │
│  CRITICAL│          ┌─────────┐                                             │
│         │          │RISK-003 │                                              │
│         │          │App Break│                                              │
│         │          └─────────┘                                              │
│    HIGH │ ┌─────────┐ ┌─────────┐ ┌─────────┐                               │
│         │ │RISK-001 │ │RISK-002 │ │RISK-004 │                               │
│         │ │Hardware │ │ISE Learn│ │Auth Fail│                               │
│         │ └─────────┘ └─────────┘ └─────────┘ ┌─────────┐                   │
│         │                                     │RISK-006 │                   │
│         │                                     │DNAC-ISE │                   │
│         │                                     └─────────┘                   │
│  MEDIUM │                         ┌─────────┐                               │
│         │                         │RISK-007 │ ┌─────────┐                   │
│         │                         │Skills   │ │RISK-008 │                   │
│         │                         └─────────┘ └─────────┘                   │
│    LOW  │         ┌─────────┐                                               │
│         │         │RISK-005 │                                               │
│         │         │Bandwidth│                                               │
│         │         └─────────┘                                               │
│         └─────────────────────────────────────────────────────────────────► │
│            LOW         MEDIUM        HIGH        CRITICAL                   │
│                              PROBABILITY                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 1.8 Stakeholder Mapping

### 1.8.1 RACI Matrix

| Activity | CIO | IT Director | Network Arch | Security | Operations | Vendors |
|----------|-----|-------------|--------------|----------|------------|---------|
| Strategy Approval | A | R | C | C | I | I |
| Architecture Design | I | A | R | C | C | C |
| Security Policy | I | A | C | R | C | I |
| Implementation | I | A | R | C | R | C |
| Testing/UAT | I | A | C | R | R | C |
| Go-Live Decision | A | R | C | C | C | I |
| Operations Handover | I | A | I | C | R | C |

**Legend**: R = Responsible, A = Accountable, C = Consulted, I = Informed

---

## Chapter Summary

This discovery and assessment phase has identified:

1. **Infrastructure State**: 47% overall readiness requiring significant hardware refresh
2. **Key Gaps**: DNAC/ISE deployment, 40% switch replacement, WLC migration
3. **Risks**: Legacy compatibility, skills gap, and application breakage as primary concerns
4. **Scale**: 854 managed devices, 19,000 endpoints across 6 hub sites and 30+ branches
5. **Target**: Comprehensive SD-Access fabric with centralized policy and automation

**Next Step**: Proceed to [Chapter 2: Architecture Design](../chapter-2-design/README.md) for detailed fabric design.

---

> **Document Control**  
> Version: 1.0 | Last Updated: December 2025  
> Classification: Technical Design Document
