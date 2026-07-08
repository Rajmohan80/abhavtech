# 1.1 Current State Infrastructure Inventory

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
