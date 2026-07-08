# Chapter 2: Architecture Design

> **Chapter Version**: 1.0  
> **Last Updated**: December 2025

---

## Chapter Overview

This chapter provides the comprehensive technical architecture for the SD-Access deployment, including fabric design, node placement, underlay/overlay design, and integration patterns following Cisco Validated Design (CVD) best practices.

---

## 2.1 SD-Access Architecture Overview

### 2.1.1 Cisco SD-Access Building Blocks

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SD-ACCESS ARCHITECTURE LAYERS                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║                        MANAGEMENT PLANE                               ║  │
│  ║  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        ║  │
│  ║  │   DNA Center    │  │      ISE        │  │   Stealthwatch  │        ║  │
│  ║  │                 │  │                 │  │                 │        ║  │
│  ║  │ • Automation    │  │ • Identity      │  │ • Analytics     │        ║  │
│  ║  │ • Assurance     │  │ • Policy        │  │ • Threat        │        ║  │
│  ║  │ • Provisioning  │  │ • Profiling     │  │ • Visibility    │        ║  │
│  ║  │ • Policies      │  │ • SGT           │  │                 │        ║  │
│  ║  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘        ║  │
│  ╚═══════════╪════════════════════╪════════════════════╪═════════════════╝  │
│              │                    │                    │                    │
│              │              pxGrid Integration         │                    │
│              │                    │                    │                    │
│  ╔═══════════╧════════════════════╧════════════════════╧═════════════════╗  │
│  ║                         CONTROL PLANE                                 ║  │
│  ║                                                                       ║  │
│  ║     LISP (Locator/ID Separation Protocol)                             ║  │
│  ║     ┌──────────────────────────────────────────────────────────┐      ║  │
│  ║     │  • Map-Server / Map-Resolver (MS/MR)                     │      ║  │
│  ║     │  • EID-to-RLOC Mapping Database                          │      ║  │
│  ║     │  • Host Mobility Tracking                                │      ║  │
│  ║     │  • xTR Registration                                      │      ║  │
│  ║     └──────────────────────────────────────────────────────────┘      ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║                          DATA PLANE                                   ║  │
│  ║                                                                       ║  │
│  ║     VXLAN (Virtual Extensible LAN)                                    ║  │
│  ║     ┌──────────────────────────────────────────────────────────┐      ║  │
│  ║     │  • Overlay Tunnels (VNI per Virtual Network)             │      ║  │
│  ║     │  • SGT Inline Tagging (CMD Header)                       │      ║  │
│  ║     │  • Anycast Gateway (Distributed Default Gateway)         │      ║  │
│  ║     │  • 50-byte Overhead (Encapsulation)                      │      ║  │
│  ║     └──────────────────────────────────────────────────────────┘      ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                                                                             │
│  ╔═══════════════════════════════════════════════════════════════════════╗  │
│  ║                        PHYSICAL PLANE (UNDERLAY)                      ║  │
│  ║                                                                       ║  │
│  ║     IS-IS Underlay Routing                                            ║  │
│  ║     ┌──────────────────────────────────────────────────────────┐      ║  │
│  ║     │  • Loopback Reachability (RLOC addresses)                │      ║  │
│  ║     │  • L3 Routed Access (no STP)                             │      ║  │
│  ║     │  • Point-to-Point Links                                  │      ║  │
│  ║     │  • Fast Convergence (< 1 second)                         │      ║  │
│  ║     └──────────────────────────────────────────────────────────┘      ║  │
│  ╚═══════════════════════════════════════════════════════════════════════╝  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.1.2 Fabric Node Roles

| Node Role | Function | Redundancy | Hardware Platform |
|-----------|----------|------------|-------------------|
| **Fabric Edge** | Host onboarding, SGT assignment, VXLAN encap/decap | Per switch (StackWise) | Catalyst 9300/9400 |
| **Control Plane** | LISP MS/MR, EID-RLOC mapping, mobility | 2 per fabric site | Catalyst 9500 |
| **Border Node** | Inter-fabric, WAN, DC connectivity | 2 per hub site | Catalyst 9500 High |
| **Intermediate** | L3 underlay routing only | Per design | Catalyst 9500 |
| **Extended Node** | Extended fabric to IDF | Per requirement | Catalyst IE3x00 |
| **Wireless Controller** | AP management, fabric integration | HA pair | Catalyst 9800-40 |

---

## 2.2 Global Fabric Design

### 2.2.1 Multi-Site Fabric Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    GLOBAL MULTI-SITE SD-ACCESS DESIGN                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                         ┌─────────────────────┐                             │
│                         │    DNA CENTER       │                             │
│                         │    HA CLUSTER       │                             │
│                         │  (New Jersey + DR)  │                             │
│                         └──────────┬──────────┘                             │
│                                    │                                        │
│               ┌────────────────────┼────────────────────┐                   │
│               │                    │                    │                   │
│               ▼                    ▼                    ▼                   │
│  ┌────────────────────┐ ┌────────────────────┐ ┌────────────────────┐       │
│  │   FABRIC SITE:     │ │   FABRIC SITE:     │ │   FABRIC SITE:     │       │
│  │   APAC-MUMBAI      │ │   EMEA-LONDON      │ │   AMER-NEWJERSEY   │       │
│  │                    │ │                    │ │                    │       │
│  │  ┌──────────────┐  │ │  ┌──────────────┐  │ │  ┌──────────────┐  │       │
│  │  │ Control Plane│  │ │  │ Control Plane│  │ │  │ Control Plane│  │       │
│  │  │   Nodes (2)  │  │ │  │   Nodes (2)  │  │ │  │   Nodes (2)  │  │       │
│  │  └──────────────┘  │ │  └──────────────┘  │ │  └──────────────┘  │       │
│  │  ┌──────────────┐  │ │  ┌──────────────┐  │ │  ┌──────────────┐  │       │
│  │  │ Border Nodes │  │ │  │ Border Nodes │  │ │  │ Border Nodes │  │       │
│  │  │     (2)      │  │ │  │     (2)      │  │ │  │     (2)      │  │       │
│  │  └──────────────┘  │ │  └──────────────┘  │ │  └──────────────┘  │       │
│  │  ┌──────────────┐  │ │  ┌──────────────┐  │ │  ┌──────────────┐  │       │
│  │  │ Fabric Edge  │  │ │  │ Fabric Edge  │  │ │  │ Fabric Edge  │  │       │
│  │  │   Nodes      │  │ │  │   Nodes      │  │ │  │   Nodes      │  │       │
│  │  └──────────────┘  │ │  └──────────────┘  │ │  └──────────────┘  │       │
│  └─────────┬──────────┘ └─────────┬──────────┘ └─────────┬──────────┘       │
│            │                      │                      │                  │
│  ╔═════════╧══════════════════════╧══════════════════════╧═════════════════╗│
│  ║                     SD-ACCESS TRANSIT / SD-WAN                          ║│
│  ║            (Inter-Site Connectivity with SGT Propagation)               ║│
│  ╚═════════════════════════════════════════════════════════════════════════╝│
│            │                      │                      │                  │
│  ┌─────────┴──────────┐ ┌─────────┴──────────┐ ┌─────────┴──────────┐       │
│  │ FABRIC SITE:       │ │ FABRIC SITE:       │ │ FABRIC SITE:       │       │
│  │ APAC-CHENNAI       │ │ EMEA-FRANKFURT     │ │ AMER-DALLAS        │       │
│  └────────────────────┘ └────────────────────┘ └────────────────────┘       │
│            │                      │                      │                  │
│     ┌──────┴──────┐        ┌──────┴──────┐        ┌──────┴──────┐           │
│     ▼      ▼      ▼        ▼      ▼      ▼        ▼      ▼      ▼           │
│  [BLR]  [DEL]  [NOI]    [EMEA Branches]       [US Branches]                 │
│  Branch Branch Branch                                                       │
│  Sites  Sites  Sites                                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2.2 Fabric Site Hierarchy

| Fabric Site | Parent | Type | Connected Branches |
|-------------|--------|------|-------------------|
| **APAC-Mumbai** | None (Primary) | Hub Fabric | Chennai, Bangalore, Delhi, Noida |
| **APAC-Chennai** | APAC-Mumbai | Hub Fabric | Local branches |
| **EMEA-London** | None (Primary) | Hub Fabric | Frankfurt, EU branches |
| **EMEA-Frankfurt** | EMEA-London | Hub Fabric | DACH branches |
| **AMER-NewJersey** | None (Primary) | Hub Fabric | Dallas, US branches |
| **AMER-Dallas** | AMER-NewJersey | Hub Fabric | Southwest US branches |

---

## 2.3 Hub Site Design (Large Campus)

### 2.3.1 Mumbai Hub - Reference Design

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MUMBAI HUB SITE - FABRIC TOPOLOGY                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         WAN / TRANSIT LAYER                           │  │
│  │  ┌─────────────┐    ┌─────────────┐    ┌─────────────────────────┐    │  │
│  │  │ SD-WAN Edge │    │ SD-WAN Edge │    │    MPLS PE Router       │    │  │
│  │  │  (vEdge 1)  │    │  (vEdge 2)  │    │   (Service Provider)    │    │  │
│  │  └──────┬──────┘    └──────┬──────┘    └───────────┬─────────────┘    │  │
│  └─────────┼──────────────────┼───────────────────────┼──────────────────┘  │
│            │                  │                       │                     │
│            └──────────────────┼───────────────────────┘                     │
│                               │                                             │
│  ┌────────────────────────────┼──────────────────────────────────────────┐  │
│  │                     FABRIC BORDER LAYER                               │  │
│  │                            │                                          │  │
│  │     ┌──────────────────────┴──────────────────────┐                   │  │
│  │     │                                             │                   │  │
│  │  ┌──┴───────────┐                     ┌───────────┴──┐                │  │
│  │  │ BORDER NODE 1│═════════════════════│ BORDER NODE 2│                │  │
│  │  │ C9500-48Y4C  │    (VPC/MLAG)       │ C9500-48Y4C  │                │  │
│  │  │              │                     │              │                │  │
│  │  │ • External   │                     │ • External   │                │  │
│  │  │   Border     │                     │   Border     │                │  │
│  │  │ • Fusion     │                     │ • Fusion     │                │  │
│  │  │   Router     │                     │   Router     │                │  │
│  │  └───────┬──────┘                     └───────┬──────┘                │  │
│  └──────────┼────────────────────────────────────┼───────────────────────┘  │
│             │                                    │                          │
│  ┌──────────┼────────────────────────────────────┼───────────────────────┐  │
│  │          │      CONTROL PLANE LAYER           │                       │  │
│  │          │                                    │                       │  │
│  │  ┌───────┴──────┐                     ┌───────┴──────┐                │  │
│  │  │ CP NODE 1    │                     │ CP NODE 2    │                │  │
│  │  │ C9500-24Y4C  │                     │ C9500-24Y4C  │                │  │
│  │  │              │                     │              │                │  │
│  │  │ • LISP MS/MR │                     │ • LISP MS/MR │                │  │
│  │  │ • Map-Server │                     │ • Map-Server │                │  │
│  │  └───────┬──────┘                     └───────┬──────┘                │  │
│  └──────────┼────────────────────────────────────┼───────────────────────┘  │
│             │                                    │                          │
│  ┌──────────┴────────────────────────────────────┴───────────────────────┐  │
│  │                     FABRIC EDGE LAYER (Access)                        │  │
│  │                                                                       │  │
│  │    BUILDING A           BUILDING B           BUILDING C               │  │
│  │  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐            │  │
│  │  │ C9300-48U   │      │ C9300-48U   │      │ C9300-48U   │            │  │
│  │  │ Stack (4)   │      │ Stack (4)   │      │ Stack (4)   │            │  │
│  │  │             │      │             │      │             │            │  │
│  │  │ Edge Node 1 │      │ Edge Node 3 │      │ Edge Node 5 │            │  │
│  │  └──────┬──────┘      └──────┬──────┘      └──────┬──────┘            │  │
│  │         │                    │                    │                   │  │
│  │  ┌──────┴──────┐      ┌──────┴──────┐      ┌──────┴──────┐            │  │
│  │  │ C9300-48U   │      │ C9300-48U   │      │ C9300-48U   │            │  │
│  │  │ Stack (4)   │      │ Stack (4)   │      │ Stack (4)   │            │  │
│  │  │             │      │             │      │             │            │  │
│  │  │ Edge Node 2 │      │ Edge Node 4 │      │ Edge Node 6 │            │  │
│  │  └─────────────┘      └─────────────┘      └─────────────┘            │  │
│  │                                                                       │  │
│  │  [Employees]  [VoIP]  [IoT]  [Guests]  [Printers]  [OT Devices]       │  │
│  │   SGT:10     SGT:20  SGT:30  SGT:40    SGT:50      SGT:60             │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.3.2 Hub Site Hardware Bill of Materials

**Mumbai Hub (Reference for all Hub Sites)**

| Component | Model | Quantity | Role | Licenses |
|-----------|-------|----------|------|----------|
| **Border Node** | C9500-48Y4C | 2 | External Border + Fusion | DNA Advantage |
| **Control Plane** | C9500-24Y4C | 2 | LISP MS/MR | DNA Advantage |
| **Edge Node** | C9300-48U | 48 | Fabric Edge (Stacks of 4) | DNA Advantage |
| **Wireless Controller** | C9800-40 | 2 | Fabric Wireless (HA) | DNA Advantage |
| **Access Points** | C9130AXI | 120 | Wi-Fi 6 | DNA Advantage |
| **ISE PSN** | SNS-3655-K9 | 2 | Policy Service Node | ISE Plus |

**Scaling Reference for Other Hub Sites:**

| Site | Border | CP | Edge | WLC | APs |
|------|--------|----|----- |-----|-----|
| **Chennai** | 2 × C9500 | 2 × C9500 | 36 × C9300 | 2 × C9800-40 | 90 |
| **London** | 2 × C9500 | 2 × C9500 | 42 × C9300 | 2 × C9800-40 | 100 |
| **Frankfurt** | 2 × C9500 | 2 × C9500 | 28 × C9300 | 2 × C9800-40 | 70 |
| **New Jersey** | 2 × C9500 | 2 × C9500 | 52 × C9300 | 2 × C9800-80 | 130 |
| **Dallas** | 2 × C9500 | 2 × C9500 | 32 × C9300 | 2 × C9800-40 | 80 |

---

## 2.4 Branch Site Design

### 2.4.1 Large Branch Design (Bangalore, Delhi - 300+ Users)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   LARGE BRANCH - FABRIC-IN-A-BOX                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                         ┌─────────────────────┐                             │
│                         │   WAN Connection    │                             │
│                         │   (MPLS + DIA)      │                             │
│                         └──────────┬──────────┘                             │
│                                    │                                        │
│  ┌─────────────────────────────────┼─────────────────────────────────────┐  │
│  │                                 │                                     │  │
│  │     ┌───────────────────────────┴───────────────────────────┐         │  │
│  │     │                                                       │         │  │
│  │  ┌──┴─────────────────┐                  ┌──────────────────┴──┐      │  │
│  │  │   FABRIC-IN-A-BOX  │                  │   FABRIC-IN-A-BOX   │      │  │
│  │  │   C9300-48UXM      │══════════════════│   C9300-48UXM       │      │  │
│  │  │   (Stack of 2)     │   StackWise-480  │   (Stack of 2)      │      │  │
│  │  │                    │                  │                     │      │  │
│  │  │ • Border Node      │                  │ • Border Node       │      │  │
│  │  │ • Control Plane    │                  │ • Control Plane     │      │  │
│  │  │ • Edge Node        │                  │ • Edge Node         │      │  │
│  │  │ (All-in-One)       │                  │ (All-in-One)        │      │  │
│  │  └─────────┬──────────┘                  └───────────┬─────────┘      │  │
│  │            │                                         │                │  │
│  │            │                                         │                │  │
│  │  ┌─────────┴─────────────────────────────────────────┴─────────┐      │  │
│  │  │              FABRIC EDGE (Access Layer)                     │      │  │
│  │  │                                                             │      │  │
│  │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │      │  │
│  │  │  │C9300-48U│  │C9300-48U│  │C9300-24U│  │C9200-24P│         │      │  │
│  │  │  │Edge Sw 1│  │Edge Sw 2│  │Edge Sw 3│  │Edge Sw 4│         │      │  │
│  │  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘         │      │  │
│  │  │       │            │            │            │               │      │  │
│  │  │  [Employees]  [VoIP]      [Printers]    [IoT/OT]            │      │  │
│  │  │                                                             │      │  │
│  │  └─────────────────────────────────────────────────────────────┘      │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────┐      │  │
│  │  │                    WIRELESS                                 │      │  │
│  │  │  ┌──────────┐  C9800-CL (VM) or Embedded Wireless           │      │  │
│  │  │  │  C9800   │  on C9300                                     │      │  │
│  │  │  │  (EWC)   │                                               │      │  │
│  │  │  └────┬─────┘                                               │      │  │
│  │  │       │                                                     │      │  │
│  │  │  [C9130AXI × 30]  [C9120AXI × 10]                           │      │  │
│  │  │                                                             │      │  │
│  │  └─────────────────────────────────────────────────────────────┘      │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.4.2 Medium Branch Design (Noida - 100-300 Users)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   MEDIUM BRANCH - SIMPLIFIED DESIGN                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                         ┌─────────────────────┐                             │
│                         │   WAN Connection    │                             │
│                         │   (MPLS/SD-WAN)     │                             │
│                         └──────────┬──────────┘                             │
│                                    │                                        │
│  ┌─────────────────────────────────┼─────────────────────────────────────┐  │
│  │                                 │                                     │  │
│  │  ┌──────────────────────────────┴───────────────────────────────┐     │  │
│  │  │           FABRIC-IN-A-BOX (Single/Stack)                     │     │  │
│  │  │                                                              │     │  │
│  │  │  ┌─────────────────────────────────────────────────────────┐ │     │  │
│  │  │  │                 C9300-48UXM Stack (2)                   │ │     │  │
│  │  │  │                                                         │ │     │  │
│  │  │  │  • Border Node (Integrated)                             │ │     │  │
│  │  │  │  • Control Plane Node (Integrated)                      │ │     │  │
│  │  │  │  • Fabric Edge (Integrated)                             │ │     │  │
│  │  │  │  • Embedded Wireless Controller (EWC)                   │ │     │  │
│  │  │  │                                                         │ │     │  │
│  │  │  │  Uplinks: 2 × 10G to WAN                                │ │     │  │
│  │  │  │  Access Ports: 96 × 1G PoE+ (48 per switch)             │ │     │  │
│  │  │  │                                                         │ │     │  │
│  │  │  └─────────────────────────────────────────────────────────┘ │     │  │
│  │  │                                                              │     │  │
│  │  └──────────────────────────────────────────────────────────────┘     │  │
│  │                                                                       │  │
│  │  ┌─────────────────────────────────────────────────────────────┐      │  │
│  │  │                   ENDPOINTS                                 │      │  │
│  │  │                                                             │      │  │
│  │  │   [Employees: 200]  [VoIP: 100]  [IoT: 50]  [Guest: 50]     │      │  │
│  │  │                                                             │      │  │
│  │  │   [C9130AXI × 15 Access Points]                             │      │  │
│  │  │                                                             │      │  │
│  │  └─────────────────────────────────────────────────────────────┘      │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.4.3 Branch Hardware Summary

| Branch Type | Example Sites | Border/CP | Edge Switches | WLC Model | APs |
|-------------|---------------|-----------|---------------|-----------|-----|
| **Large (500+ users)** | Bangalore | 2 × C9300 Fabric-in-a-Box | 8-16 × C9300 | C9800-L or EWC | 30-50 |
| **Medium (100-500)** | Delhi, Noida | 2 × C9300 Fabric-in-a-Box | 2-8 × C9300 | EWC | 10-30 |
| **Small (< 100)** | EMEA/US branches | 1-2 × C9200/C9300 | Integrated | EWC | 5-15 |

---

## 2.5 Underlay Network Design

### 2.5.1 IS-IS Underlay Routing

**Design Decisions:**

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **IGP Protocol** | IS-IS | Recommended by Cisco CVD for SD-Access |
| **IS-IS Level** | Level-2 only | Single area, simpler design |
| **Network Type** | Point-to-Point | All fabric links |
| **Authentication** | HMAC-SHA-256 | Security requirement |
| **Metric Type** | Wide metrics | Large scale support |
| **BFD** | Enabled | Sub-second convergence |

**IS-IS Configuration Template (Border/CP Node):**

```
! ============================================================
! IS-IS UNDERLAY CONFIGURATION - BORDER/CP NODE
! ============================================================

router isis FABRIC-UNDERLAY
 net 49.0001.0100.0001.0001.00
 domain-password UNDERLAY-SECRET
 is-type level-2-only
 metric-style wide
 log-adjacency-changes
 passive-interface default
 no passive-interface TenGigabitEthernet1/0/1
 no passive-interface TenGigabitEthernet1/0/2
 !
 address-family ipv4 unicast
  maximum-paths 4
  redistribute connected route-map LOOPBACK-ONLY
 exit-address-family

! ============================================================
! INTERFACE CONFIGURATION FOR IS-IS
! ============================================================

interface Loopback0
 description FABRIC UNDERLAY LOOPBACK (RLOC)
 ip address 10.250.1.1 255.255.255.255
 ip router isis FABRIC-UNDERLAY

interface TenGigabitEthernet1/0/1
 description TO-CP-NODE-1
 no switchport
 ip address 10.251.1.0 255.255.255.254
 ip router isis FABRIC-UNDERLAY
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3

interface TenGigabitEthernet1/0/2
 description TO-EDGE-NODE-STACK
 no switchport
 ip address 10.251.1.2 255.255.255.254
 ip router isis FABRIC-UNDERLAY
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3

! ============================================================
! BFD CONFIGURATION
! ============================================================

bfd slow-timers 2000

! ============================================================
! KEY CHAIN FOR IS-IS AUTHENTICATION
! ============================================================

key chain ISIS-KEY
 key 1
  key-string SECURE-ISIS-KEY
  cryptographic-algorithm hmac-sha-256
```

### 2.5.2 Underlay IP Addressing

**Global Underlay Addressing Scheme:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    UNDERLAY IP ADDRESSING SCHEME                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  LOOPBACK ADDRESSES (RLOCs):                                                │
│  ────────────────────────────                                               │
│  Supernet:        10.250.0.0/16                                             │
│                                                                             │
│  Regional Allocation:                                                       │
│  ┌───────────────────────────────────────────────────────────┐              │
│  │ Region    │ Range              │ Sites                    │              │
│  ├───────────┼────────────────────┼──────────────────────────┤              │
│  │ APAC      │ 10.250.1.0/20      │ Mumbai, Chennai, Branches│              │
│  │ EMEA      │ 10.250.16.0/20     │ London, Frankfurt, EU    │              │
│  │ Americas  │ 10.250.32.0/20     │ NJ, Dallas, US Branches  │              │
│  │ Reserved  │ 10.250.48.0/20     │ Future expansion         │              │
│  └───────────────────────────────────────────────────────────┘              │
│                                                                             │
│  Site-Level Allocation (Example - Mumbai):                                  │
│  ┌───────────────────────────────────────────────────────────┐              │
│  │ Device Type        │ Range            │ Addresses         │              │
│  ├────────────────────┼──────────────────┼───────────────────┤              │
│  │ Border Nodes       │ 10.250.1.1-2/32  │ 2 addresses       │              │
│  │ CP Nodes           │ 10.250.1.3-4/32  │ 2 addresses       │              │
│  │ Edge Nodes         │ 10.250.1.10-60/32│ 50 addresses      │              │
│  │ WLC                │ 10.250.1.200-201 │ 2 addresses       │              │
│  └───────────────────────────────────────────────────────────┘              │
│                                                                             │
│  POINT-TO-POINT LINKS:                                                      │
│  ─────────────────────                                                      │
│  Supernet:        10.251.0.0/16                                             │
│  Subnet Size:     /31 (2 addresses per link)                                │
│                                                                             │
│  Regional Allocation:                                                       │
│  ┌───────────────────────────────────────────────────────────┐              │
│  │ Region    │ Range              │ Links                    │              │
│  ├───────────┼────────────────────┼──────────────────────────┤              │
│  │ APAC      │ 10.251.1.0/20      │ All APAC inter-switch    │              │
│  │ EMEA      │ 10.251.16.0/20     │ All EMEA inter-switch    │              │
│  │ Americas  │ 10.251.32.0/20     │ All Americas inter-switch│              │
│  └───────────────────────────────────────────────────────────┘              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2.6 Overlay Network Design

### 2.6.1 Virtual Network (VN) Design

**Virtual Networks (Overlay Segmentation):**

| VN Name | VNI | Purpose | IP Pool | SGTs Assigned |
|---------|-----|---------|---------|---------------|
| **VN_CORPORATE** | 8001 | Employee access | 10.100.0.0/16 | 10, 20, 30 |
| **VN_GUEST** | 8002 | Guest/Visitor | 10.200.0.0/16 | 40 |
| **VN_IOT** | 8003 | IoT/OT devices | 10.150.0.0/16 | 50, 60, 70 |
| **VN_SERVERS** | 8004 | Data Center servers | 10.180.0.0/16 | 80, 90 |
| **VN_VOICE** | 8005 | Voice/UC endpoints | 10.190.0.0/16 | 25 |

### 2.6.2 Scalable Group Tag (SGT) Design

**SGT Matrix:**

| SGT | Value | Name | Description | VN |
|-----|-------|------|-------------|----| 
| **SGT-EMPLOYEES** | 10 | Employees | Corporate users, full access | VN_CORPORATE |
| **SGT-EXECUTIVES** | 11 | Executives | Executive users, priority | VN_CORPORATE |
| **SGT-CONTRACTORS** | 15 | Contractors | Limited access, temp users | VN_CORPORATE |
| **SGT-VOICE** | 20 | VoIP | IP phones, voice traffic | VN_CORPORATE |
| **SGT-PRINTERS** | 30 | Printers | Network printers | VN_CORPORATE |
| **SGT-GUESTS** | 40 | Guests | Guest network, internet only | VN_GUEST |
| **SGT-IOT-SENSORS** | 50 | IoT Sensors | Building sensors | VN_IOT |
| **SGT-OT-DEVICES** | 60 | OT Devices | Manufacturing devices | VN_IOT |
| **SGT-CAMERAS** | 70 | Cameras | IP cameras | VN_IOT |
| **SGT-SERVERS-PROD** | 80 | Prod Servers | Production workloads | VN_SERVERS |
| **SGT-SERVERS-DEV** | 90 | Dev Servers | Dev/Test workloads | VN_SERVERS |
| **SGT-QUARANTINE** | 999 | Quarantine | Non-compliant endpoints | N/A |

### 2.6.3 SGT Policy Matrix (SGACL)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCALABLE GROUP ACCESS CONTROL (SGACL)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SOURCE (Rows) → DESTINATION (Columns)                                      │
│                                                                             │
│  ┌─────────────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┬──────┐    │
│  │ SRC \ DST   │ EMP  │ EXEC │ VOICE│ PRNT │GUEST │ IOT  │ SRV-P│ SRV-D│    │
│  │             │ (10) │ (11) │ (20) │ (30) │ (40) │ (50) │ (80) │ (90) │    │
│  ├─────────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤    │
│  │ EMPLOYEES   │  ✓   │  ─   │  ✓   │  ✓   │  ─   │  ─   │ ✓(L) │  ✓   │    │
│  │ (10)        │      │      │      │      │      │      │      │      │    │
│  ├─────────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤    │
│  │ EXECUTIVES  │  ✓   │  ✓   │  ✓   │  ✓   │  ─   │  ─   │  ✓   │  ✓   │    │
│  │ (11)        │      │      │      │      │      │      │      │      │    │
│  ├─────────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤    │
│  │ CONTRACTORS │  ─   │  ─   │  ✓   │  ✓   │  ─   │  ─   │  ─   │ ✓(L) │    │
│  │ (15)        │      │      │      │      │      │      │      │      │    │
│  ├─────────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤    │
│  │ VOICE       │  ✓   │  ✓   │  ✓   │  ─   │  ─   │  ─   │ ✓(V) │  ─   │    │
│  │ (20)        │      │      │      │      │      │      │      │      │    │
│  ├─────────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤    │
│  │ PRINTERS    │  ─   │  ─   │  ─   │  ─   │  ─   │  ─   │ ✓(P) │  ─   │    │
│  │ (30)        │      │      │      │      │      │      │      │      │    │
│  ├─────────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤    │
│  │ GUESTS      │  ─   │  ─   │  ─   │  ─   │  ✓   │  ─   │  ─   │  ─   │    │
│  │ (40)        │      │      │      │      │      │      │      │      │    │
│  ├─────────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤    │
│  │ IOT-SENSORS │  ─   │  ─   │  ─   │  ─   │  ─   │  ✓   │ ✓(I) │  ─   │    │
│  │ (50)        │      │      │      │      │      │      │      │      │    │
│  ├─────────────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┼──────┤    │
│  │ QUARANTINE  │  ─   │  ─   │  ─   │  ─   │  ─   │  ─   │  ─   │  ─   │    │
│  │ (999)       │      │      │      │      │      │      │      │      │    │
│  └─────────────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┴──────┘    │
│                                                                             │
│  LEGEND:                                                                    │
│  ✓ = Full access (permit all)                                               │
│  ─ = Deny (implicit or explicit)                                            │
│  ✓(L) = Limited access (specific ports only)                                │
│  ✓(V) = Voice only (RTP/SIP)                                                │
│  ✓(P) = Print protocols only (9100, IPP)                                    │
│  ✓(I) = IoT protocols only (MQTT, CoAP)                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2.7 DNA Center Design

### 2.7.1 DNAC Cluster Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DNA CENTER CLUSTER DESIGN                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  PRIMARY CLUSTER (New Jersey Data Center):                                  │
│  ──────────────────────────────────────────                                 │
│                                                                             │
│      ┌──────────────────────────────────────────────────────────┐           │
│      │              DNAC 3-NODE HA CLUSTER                      │           │
│      │                                                          │           │
│      │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │           │
│      │  │   NODE 1     │ │   NODE 2     │ │   NODE 3     │      │           │
│      │  │  DN2-HW-APL  │ │  DN2-HW-APL  │ │  DN2-HW-APL  │      │           │
│      │  │     -XL      │ │     -XL      │ │     -XL      │      │           │
│      │  │              │ │              │ │              │      │           │
│      │  │ IP: .11      │ │ IP: .12      │ │ IP: .13      │      │           │
│      │  └──────────────┘ └──────────────┘ └──────────────┘      │           │
│      │           │              │              │                │           │
│      │           └──────────────┼──────────────┘                │           │
│      │                          │                               │           │
│      │              Cluster VIP: 10.252.1.10                    │           │
│      │              FQDN: dnac.company.local                    │           │
│      │                                                          │           │
│      └──────────────────────────────────────────────────────────┘           │
│                                                                             │
│  DISASTER RECOVERY (London Data Center):                                    │
│  ─────────────────────────────────────────                                  │
│                                                                             │
│      ┌──────────────────────────────────────────────────────────┐           │
│      │              DNAC DR CLUSTER (Standby)                   │           │
│      │                                                          │           │
│      │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐      │           │
│      │  │   NODE 1     │ │   NODE 2     │ │   NODE 3     │      │           │
│      │  │  DN2-HW-APL  │ │  DN2-HW-APL  │ │  DN2-HW-APL  │      │           │
│      │  │     -XL      │ │     -XL      │ │     -XL      │      │           │
│      │  │              │ │              │ │              │      │           │
│      │  │ IP: .21      │ │ IP: .22      │ │ IP: .23      │      │           │
│      │  └──────────────┘ └──────────────┘ └──────────────┘      │           │
│      │                                                          │           │
│      │              Cluster VIP: 10.252.2.10                    │           │
│      │              FQDN: dnac-dr.company.local                 │           │
│      │                                                          │           │
│      └──────────────────────────────────────────────────────────┘           │
│                                                                             │
│  REPLICATION:                                                               │
│  ────────────                                                               │
│  • Active/Passive configuration                                             │
│  • Configuration backup: Daily to DR                                        │
│  • RTO: 4 hours | RPO: 24 hours                                             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.7.2 DNAC Appliance Specifications

| Specification | DN2-HW-APL-XL (Selected) |
|---------------|--------------------------|
| **Network Devices** | Up to 8,000 |
| **Endpoints** | Up to 200,000 |
| **Access Points** | Up to 16,000 |
| **Cores** | 56 cores |
| **Memory** | 512 GB RAM |
| **Storage** | 12 TB SSD (RAID) |
| **Network Interfaces** | 4 × 10 GbE, 2 × 1 GbE |
| **High Availability** | 3-node cluster |

### 2.7.3 DNAC Network Requirements

| Interface | Purpose | VLAN | IP Range |
|-----------|---------|------|----------|
| **Enterprise** | Device management, southbound | 100 | 10.252.1.0/24 |
| **Management** | GUI access, northbound | 101 | 10.252.2.0/24 |
| **Cluster** | Inter-node communication | 102 | 10.252.3.0/24 |
| **Services** | ISE, AAA, NTP, DNS | 100 | Same as Enterprise |

---

## 2.8 ISE Design

### 2.8.1 ISE Distributed Deployment

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ISE DISTRIBUTED DEPLOYMENT                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     PRIMARY ADMIN NODE (PAN)                          │  │
│  │                                                                       │  │
│  │  Location: New Jersey                                                 │  │
│  │  Appliance: SNS-3695-K9                                               │  │
│  │  Roles: Primary PAN, Primary MnT, pxGrid Publisher                    │  │
│  │  IP: 10.252.10.10                                                     │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                               │                                             │
│                               │ Sync                                        │
│                               ▼                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                   SECONDARY ADMIN NODE (PAN)                          │  │
│  │                                                                       │  │
│  │  Location: London                                                     │  │
│  │  Appliance: SNS-3695-K9                                               │  │
│  │  Roles: Secondary PAN, Secondary MnT, pxGrid Subscriber               │  │
│  │  IP: 10.252.20.10                                                     │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                    POLICY SERVICE NODES (PSN)                         │  │
│  │                                                                       │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐                     │  │
│  │  │ APAC PSN Pair       │  │ APAC PSN Pair       │                     │  │
│  │  │ Location: Mumbai    │  │ Location: Chennai   │                     │  │
│  │  │ Model: SNS-3655-K9  │  │ Model: SNS-3655-K9  │                     │  │
│  │  │ IP: 10.252.11.10-11 │  │ IP: 10.252.12.10-11 │                     │  │
│  │  └─────────────────────┘  └─────────────────────┘                     │  │
│  │                                                                       │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐                     │  │
│  │  │ EMEA PSN Pair       │  │ EMEA PSN Pair       │                     │  │
│  │  │ Location: London    │  │ Location: Frankfurt │                     │  │
│  │  │ Model: SNS-3655-K9  │  │ Model: SNS-3655-K9  │                     │  │
│  │  │ IP: 10.252.21.10-11 │  │ IP: 10.252.22.10-11 │                     │  │
│  │  └─────────────────────┘  └─────────────────────┘                     │  │
│  │                                                                       │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐                     │  │
│  │  │ Americas PSN Pair   │  │ Americas PSN Pair   │                     │  │
│  │  │ Location: NJ        │  │ Location: Dallas    │                     │  │
│  │  │ Model: SNS-3655-K9  │  │ Model: SNS-3655-K9  │                     │  │
│  │  │ IP: 10.252.31.10-11 │  │ IP: 10.252.32.10-11 │                     │  │
│  │  └─────────────────────┘  └─────────────────────┘                     │  │
│  │                                                                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  NODE GROUPS:                                                               │
│  ────────────                                                               │
│  • APAC-PSN-GROUP: Mumbai PSN, Chennai PSN                                  │
│  • EMEA-PSN-GROUP: London PSN, Frankfurt PSN                                │
│  • AMER-PSN-GROUP: NJ PSN, Dallas PSN                                       │
│                                                                             │
│  LOAD BALANCING:                                                            │
│  ───────────────                                                            │
│  • NAD configuration points to PSN Node Group                               │
│  • RADIUS load balancing via node group                                     │
│  • Failover: Automatic within node group                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.8.2 ISE Integration with DNAC

| Integration Point | Protocol | Purpose |
|-------------------|----------|---------|
| **pxGrid** | TLS 1.2 | Real-time context sharing |
| **REST API** | HTTPS | Policy push, status updates |
| **ERS API** | HTTPS | Endpoint management |
| **SGT Mapping** | pxGrid | Dynamic SGT-IP binding |

---

## 2.9 Wireless Design

### 2.9.1 Fabric-Enabled Wireless Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                FABRIC-ENABLED WIRELESS ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      DNA CENTER                                       │  │
│  │                (Wireless Controller Management)                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                               │                                             │
│              ┌────────────────┼────────────────┐                            │
│              │                │                │                            │
│              ▼                ▼                ▼                            │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐                    │
│  │   C9800-40    │  │   C9800-40    │  │   C9800-CL    │                    │
│  │   (Mumbai)    │  │   (London)    │  │   (Branch)    │                    │
│  │   HA Pair     │  │   HA Pair     │  │   VM Based    │                    │
│  └───────────────┘  └───────────────┘  └───────────────┘                    │
│         │                   │                   │                           │
│         │    CAPWAP Tunnel  │    CAPWAP Tunnel  │                           │
│         │   (Control Only)  │   (Control Only)  │                           │
│         │                   │                   │                           │
│  ┌──────┴───────────────────┴───────────────────┴──────┐                    │
│  │                  FABRIC EDGE NODES                  │                    │
│  │         (Access Points Connect to Fabric)           │                    │
│  └──────────────────────────────────────────────────────┘                   │
│         │                   │                   │                           │
│         ▼                   ▼                   ▼                            │
│  ┌───────────┐       ┌───────────┐       ┌───────────┐                      │
│  │ C9130AXI  │       │ C9130AXI  │       │ C9120AXI  │                      │
│  │   (AP)    │       │   (AP)    │       │   (AP)    │                      │
│  │           │       │           │       │           │                      │
│  │ Fabric    │       │ Fabric    │       │ Fabric    │                      │
│  │ Mode      │       │ Mode      │       │ Mode      │                      │
│  └───────────┘       └───────────┘       └───────────┘                      │
│         │                   │                   │                           │
│     ┌───┴───┐           ┌───┴───┐           ┌───┴───┐                       │
│     ▼       ▼           ▼       ▼           ▼       ▼                        │
│  [Client][Client]    [Client][Client]    [Client][Client]                   │
│  SGT:10   SGT:40     SGT:10   SGT:40     SGT:10   SGT:40                    │
│                                                                             │
│  DATA PATH:                                                                 │
│  ──────────                                                                 │
│  Client → AP → VXLAN Tunnel → Fabric Edge → Overlay → Border                │
│                                                                             │
│  Key Points:                                                                │
│  • Control traffic: CAPWAP to WLC                                           │
│  • Data traffic: Locally switched via fabric                                │
│  • SGT assigned at wireless client authentication                           │
│  • Same policy as wired (consistent)                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.9.2 SSID to VN Mapping

| SSID | Authentication | VN | SGT | Purpose |
|------|----------------|----|----|---------|
| **Corp-Secure** | 802.1X (EAP-TLS) | VN_CORPORATE | Dynamic (ISE) | Employee wireless |
| **Corp-Guest** | Web Auth | VN_GUEST | 40 | Visitor access |
| **Corp-IoT** | PSK + MAC | VN_IOT | 50 | IoT devices |
| **Corp-Voice** | 802.1X | VN_VOICE | 20 | Wireless phones |

---

## 2.10 Integration Design

### 2.10.1 SD-WAN Integration (High-Level)

> **Note**: Detailed SD-WAN design is covered in a separate project. This section covers integration points only.

| Integration Point | Description | Configuration |
|-------------------|-------------|---------------|
| **Transit** | SD-Access to SD-WAN handoff | Border Node L3 handoff |
| **Policy** | SGT propagation to SD-WAN | VRF-aware SGT |
| **Control** | vManage-DNAC integration | API-based |
| **Data Plane** | VXLAN-to-IPsec handoff | Border encapsulation |

**SD-WAN Transit Architecture (Conceptual):**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SD-ACCESS TO SD-WAN TRANSIT                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SD-ACCESS FABRIC                        SD-WAN OVERLAY                     │
│  ┌───────────────┐                       ┌───────────────┐                  │
│  │               │                       │               │                  │
│  │  VXLAN/LISP   │    L3 Handoff         │   IPsec/DTLS  │                  │
│  │   Overlay     │ ──────────────────►   │    Overlay    │                  │
│  │               │   (VRF Routing)       │               │                  │
│  │               │                       │               │                  │
│  │  ┌─────────┐  │                       │  ┌─────────┐  │                  │
│  │  │ Border  │  │    10.100.0.0/16      │  │ vEdge   │  │                  │
│  │  │  Node   │◄─┼──────────────────────►│  │ Router  │  │                  │
│  │  └─────────┘  │   (Corporate VN)      │  └─────────┘  │                  │
│  │               │                       │               │                  │
│  │  ┌─────────┐  │    10.200.0.0/16      │  ┌─────────┐  │                  │
│  │  │ Border  │  │   (Guest VN)          │  │ vEdge   │  │                  │
│  │  │  Node   │◄─┼──────────────────────►│  │ Router  │  │                  │
│  │  └─────────┘  │                       │  └─────────┘  │                  │
│  │               │                       │               │                  │
│  └───────────────┘                       └───────────────┘                  │
│                                                                             │
│  SGT PROPAGATION:                                                           │
│  • SGT inline tagging within SD-Access                                      │
│  • SGT-to-VRF mapping at border                                             │
│  • VPN label carries context in SD-WAN                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2.11 Sizing Summary

### 2.11.1 Hardware Summary by Site

| Site | Border | CP | Edge | WLC | APs | ISE PSN |
|------|--------|----|----- |-----|-----|---------|
| **Mumbai** | 2 × C9500-48Y4C | 2 × C9500-24Y4C | 48 × C9300 | 2 × C9800-40 | 120 | 2 × SNS-3655 |
| **Chennai** | 2 × C9500-48Y4C | 2 × C9500-24Y4C | 36 × C9300 | 2 × C9800-40 | 90 | 2 × SNS-3655 |
| **London** | 2 × C9500-48Y4C | 2 × C9500-24Y4C | 42 × C9300 | 2 × C9800-40 | 100 | 2 × SNS-3655 |
| **Frankfurt** | 2 × C9500-48Y4C | 2 × C9500-24Y4C | 28 × C9300 | 2 × C9800-40 | 70 | 2 × SNS-3655 |
| **New Jersey** | 2 × C9500-48Y4C | 2 × C9500-24Y4C | 52 × C9300 | 2 × C9800-80 | 130 | 2 × SNS-3655 |
| **Dallas** | 2 × C9500-48Y4C | 2 × C9500-24Y4C | 32 × C9300 | 2 × C9800-40 | 80 | 2 × SNS-3655 |
| **Bangalore** | 2 × C9300 FiaB | - | 8 × C9300 | EWC | 40 | Local PSN access |
| **Delhi** | 2 × C9300 FiaB | - | 6 × C9300 | EWC | 30 | Local PSN access |
| **Noida** | 2 × C9300 FiaB | - | 4 × C9300 | EWC | 15 | Local PSN access |

**DNAC Cluster**: 6 × DN2-HW-APL-XL (3 Primary + 3 DR)  
**ISE Nodes**: 2 × SNS-3695 (PAN) + 12 × SNS-3655 (PSN)

---

## 2.8 SD-WAN Integration Design

### 2.8.1 Integration Architecture Overview

**Note**: SD-WAN detailed design is covered in a separate project document. This section focuses on the SD-Access to SD-WAN integration points.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SD-ACCESS TO SD-WAN INTEGRATION                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    SD-ACCESS FABRIC                          SD-WAN FABRIC                 │
│    (Campus/Branch LAN)                       (WAN Connectivity)            │
│                                                                             │
│    ┌─────────────────────┐                  ┌─────────────────────┐        │
│    │    DNA CENTER       │◄────────────────►│     vMANAGE         │        │
│    │   (SD-Access Mgmt)  │    API/pxGrid    │   (SD-WAN Mgmt)     │        │
│    └──────────┬──────────┘                  └──────────┬──────────┘        │
│               │                                        │                   │
│    ┌──────────┴──────────┐                  ┌──────────┴──────────┐        │
│    │                     │                  │                     │        │
│    │   FABRIC BORDER     │    L3 Handoff    │    SD-WAN EDGE      │        │
│    │   (C9500-48Y4C)     │◄────────────────►│    (ISR/C8500)      │        │
│    │                     │   VRF/VLAN       │                     │        │
│    └──────────┬──────────┘                  └──────────┬──────────┘        │
│               │                                        │                   │
│    ┌──────────┴──────────┐                  ┌──────────┴──────────┐        │
│    │   FABRIC OVERLAY    │                  │   SD-WAN OVERLAY    │        │
│    │   (VXLAN/LISP)      │                  │   (IPsec/DTLS)      │        │
│    │   VN → VRF → VLAN   │                  │   VRF → VPN         │        │
│    └─────────────────────┘                  └─────────────────────┘        │
│                                                                             │
│    HANDOFF DESIGN:                                                          │
│    ═══════════════                                                          │
│    VN_CORPORATE (VNI 8001) ──► VLAN 3001 ──► VRF CORP ──► VPN 10           │
│    VN_GUEST     (VNI 8002) ──► VLAN 3002 ──► VRF GUEST──► VPN 40           │
│    VN_IOT       (VNI 8003) ──► VLAN 3003 ──► VRF IOT  ──► VPN 50           │
│    VN_SERVERS   (VNI 8004) ──► VLAN 3004 ──► VRF SRV  ──► VPN 80           │
│    VN_VOICE     (VNI 8005) ──► VLAN 3005 ──► VRF VOICE──► VPN 20           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.8.2 Border to SD-WAN Handoff Design

**Physical Connectivity**

| Hub Site | Fabric Border | SD-WAN Edge | Handoff Interface | Bandwidth |
|----------|---------------|-------------|-------------------|-----------|
| Mumbai | MUM-BN-01/02 | MUM-SDWAN-01/02 | Te1/0/48 (trunk) | 10 Gbps |
| Chennai | CHN-BN-01/02 | CHN-SDWAN-01/02 | Te1/0/48 (trunk) | 10 Gbps |
| London | LON-BN-01/02 | LON-SDWAN-01/02 | Te1/0/48 (trunk) | 10 Gbps |
| Frankfurt | FRA-BN-01/02 | FRA-SDWAN-01/02 | Te1/0/48 (trunk) | 10 Gbps |
| New Jersey | NJ-BN-01/02 | NJ-SDWAN-01/02 | Te1/0/48 (trunk) | 10 Gbps |
| Dallas | DAL-BN-01/02 | DAL-SDWAN-01/02 | Te1/0/48 (trunk) | 10 Gbps |

**VLAN/VRF Mapping**

| Virtual Network | VLAN ID | VRF Name | SD-WAN VPN | IP Subnet (Handoff) |
|-----------------|---------|----------|------------|---------------------|
| VN_CORPORATE | 3001 | VRF_CORP | VPN 10 | 10.240.1.0/30 per site |
| VN_GUEST | 3002 | VRF_GUEST | VPN 40 | 10.240.2.0/30 per site |
| VN_IOT | 3003 | VRF_IOT | VPN 50 | 10.240.3.0/30 per site |
| VN_SERVERS | 3004 | VRF_SRV | VPN 80 | 10.240.4.0/30 per site |
| VN_VOICE | 3005 | VRF_VOICE | VPN 20 | 10.240.5.0/30 per site |

### 2.8.3 Border Node Handoff Configuration

```cisco
! Fabric Border Node - SD-WAN Handoff Configuration
! Example: MUM-BN-01

! Trunk interface to SD-WAN Edge
interface TenGigabitEthernet1/0/48
 description TO-MUM-SDWAN-01
 switchport mode trunk
 switchport trunk allowed vlan 3001-3005
 no shutdown

! Handoff SVIs - Corporate VN
interface Vlan3001
 description SDWAN-HANDOFF-VN_CORPORATE
 vrf forwarding VN_CORPORATE
 ip address 10.240.1.2 255.255.255.252
 no shutdown

! Handoff SVIs - Guest VN
interface Vlan3002
 description SDWAN-HANDOFF-VN_GUEST
 vrf forwarding VN_GUEST
 ip address 10.240.2.2 255.255.255.252
 no shutdown

! Handoff SVIs - IoT VN
interface Vlan3003
 description SDWAN-HANDOFF-VN_IOT
 vrf forwarding VN_IOT
 ip address 10.240.3.2 255.255.255.252
 no shutdown

! Handoff SVIs - Servers VN
interface Vlan3004
 description SDWAN-HANDOFF-VN_SERVERS
 vrf forwarding VN_SERVERS
 ip address 10.240.4.2 255.255.255.252
 no shutdown

! Handoff SVIs - Voice VN
interface Vlan3005
 description SDWAN-HANDOFF-VN_VOICE
 vrf forwarding VN_VOICE
 ip address 10.240.5.2 255.255.255.252
 no shutdown

! BGP Peering with SD-WAN Edge (per VRF)
router bgp 65001
 !
 address-family ipv4 vrf VN_CORPORATE
  redistribute lisp metric 100
  neighbor 10.240.1.1 remote-as 65100
  neighbor 10.240.1.1 description MUM-SDWAN-01-CORP
  neighbor 10.240.1.1 activate
  neighbor 10.240.1.1 send-community both
 exit-address-family
 !
 address-family ipv4 vrf VN_GUEST
  redistribute lisp metric 100
  neighbor 10.240.2.1 remote-as 65100
  neighbor 10.240.2.1 description MUM-SDWAN-01-GUEST
  neighbor 10.240.2.1 activate
 exit-address-family
 !
 address-family ipv4 vrf VN_IOT
  redistribute lisp metric 100
  neighbor 10.240.3.1 remote-as 65100
  neighbor 10.240.3.1 description MUM-SDWAN-01-IOT
  neighbor 10.240.3.1 activate
 exit-address-family
 !
 address-family ipv4 vrf VN_SERVERS
  redistribute lisp metric 100
  neighbor 10.240.4.1 remote-as 65100
  neighbor 10.240.4.1 description MUM-SDWAN-01-SRV
  neighbor 10.240.4.1 activate
 exit-address-family
 !
 address-family ipv4 vrf VN_VOICE
  redistribute lisp metric 100
  neighbor 10.240.5.1 remote-as 65100
  neighbor 10.240.5.1 description MUM-SDWAN-01-VOICE
  neighbor 10.240.5.1 activate
 exit-address-family
```

### 2.8.4 SD-WAN Transport Design (High-Level)

**Hub Site Transports**

| Hub Site | Primary Transport | Secondary Transport | Total WAN BW |
|----------|-------------------|---------------------|--------------|
| Mumbai | MPLS 1 Gbps | Internet 500 Mbps | 1.5 Gbps |
| Chennai | MPLS 500 Mbps | Internet 500 Mbps | 1 Gbps |
| London | MPLS 1 Gbps | Internet 500 Mbps | 1.5 Gbps |
| Frankfurt | MPLS 500 Mbps | Internet 500 Mbps | 1 Gbps |
| New Jersey | MPLS 1 Gbps | Internet 1 Gbps | 2 Gbps |
| Dallas | MPLS 500 Mbps | Internet 500 Mbps | 1 Gbps |

**Branch Site Transports**

| Branch Type | Primary Transport | Secondary Transport | Example Sites |
|-------------|-------------------|---------------------|---------------|
| Large Branch | MPLS 200 Mbps | Internet 100 Mbps + 5G | Bangalore, Delhi |
| Medium Branch | Internet 100 Mbps | 5G/LTE 50 Mbps | Noida, EMEA offices |
| Small Branch | Internet 50 Mbps | 5G/LTE 30 Mbps | Remote sales offices |
| Temp/Remote | 5G/LTE 50 Mbps | - | Pop-up sites |

**SD-WAN Application-Aware Routing Policies**

| Application Category | SLA Class | Primary Path | Fallback Path |
|----------------------|-----------|--------------|---------------|
| Voice/Video (Real-time) | Low-Latency | MPLS | Internet (if latency OK) |
| Business Critical | Business | MPLS | Internet |
| Collaboration | Interactive | MPLS or Internet (best) | Auto-select |
| Cloud/SaaS | Cloud-Optimized | Internet (DIA) | MPLS backhaul |
| General Data | Default | Internet | MPLS |
| Guest Traffic | Best-Effort | Internet (DIA) | - |

### 2.8.5 SD-WAN to SD-Access Policy Correlation

**SGT to Application Policy Mapping**

| SGT | SGT Name | SD-WAN Treatment | QoS | DIA Allowed |
|-----|----------|------------------|-----|-------------|
| 10 | Employees | Business Critical | AF31 | Limited |
| 11 | Executives | Real-Time Priority | EF | No |
| 15 | Contractors | Default | BE | Yes (monitored) |
| 20 | Voice | Real-Time | EF | No |
| 25 | Video | Interactive | AF41 | No |
| 30 | Printers | Default | BE | No |
| 40 | Guests | Best-Effort | BE | Yes (filtered) |
| 50 | IoT-Sensors | Low-Latency | AF21 | Cloud only |
| 60 | OT-Devices | Business Critical | AF31 | No |
| 70 | Cameras | Interactive | AF41 | No |
| 80 | Servers-Prod | Business Critical | AF31 | No |
| 90 | Servers-Dev | Default | AF21 | Limited |

### 2.8.6 Branch Fabric-in-a-Box SD-WAN Integration

For branch sites using Fabric-in-a-Box (FiaB):

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BRANCH SD-ACCESS + SD-WAN DESIGN                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│    OPTION 1: Separate Devices (Recommended for Large Branches)              │
│    ═══════════════════════════════════════════════════════════              │
│                                                                             │
│    ┌─────────────────────┐          ┌─────────────────────┐                │
│    │  FABRIC-IN-A-BOX    │──────────│   SD-WAN EDGE       │                │
│    │  C9300-48UXM        │  L3 VRF  │   ISR 4331          │                │
│    │  (Border+Edge+CP)   │  Handoff │   (cEdge Mode)      │                │
│    └─────────────────────┘          └─────────────────────┘                │
│                                             │                               │
│                              ┌──────────────┼──────────────┐               │
│                              │              │              │               │
│                         ┌────┴───┐    ┌────┴───┐    ┌────┴───┐            │
│                         │  MPLS  │    │Internet│    │  5G    │            │
│                         └────────┘    └────────┘    └────────┘            │
│                                                                             │
│    OPTION 2: Converged Device (Small Branches - Future)                    │
│    ═══════════════════════════════════════════════════                     │
│                                                                             │
│    ┌─────────────────────┐                                                 │
│    │  CONVERGED DEVICE   │                                                 │
│    │  Catalyst 8300      │                                                 │
│    │  (SD-Access Edge +  │                                                 │
│    │   SD-WAN Edge)      │                                                 │
│    └─────────────────────┘                                                 │
│              │                                                              │
│    ┌─────────┼─────────┐                                                   │
│    │         │         │                                                   │
│ ┌──┴──┐  ┌──┴──┐  ┌──┴──┐                                                 │
│ │MPLS │  │Int  │  │ 5G  │                                                 │
│ └─────┘  └─────┘  └─────┘                                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.8.7 Migration Coordination (SD-Access + SD-WAN)

**Parallel Migration Timeline**

| Phase | SD-Access Activities | SD-WAN Activities | Duration |
|-------|---------------------|-------------------|----------|
| **Phase 1** | DNAC/ISE deployment | vManage/vSmart deployment | Weeks 1-6 |
| **Phase 2** | Mumbai pilot (fabric) | Mumbai pilot (cEdge) | Weeks 7-10 |
| **Phase 3** | Hub sites fabric | Hub sites SD-WAN overlay | Weeks 11-22 |
| **Phase 4** | Branch fabric | Branch SD-WAN | Weeks 23-34 |
| **Phase 5** | Optimization | MPLS circuit right-sizing | Weeks 35-40 |

**Critical Dependencies**

| SD-Access Milestone | SD-WAN Dependency | Coordination Needed |
|---------------------|-------------------|---------------------|
| Border node deployment | SD-WAN edge available | Joint cutover window |
| VN-to-VRF mapping | VPN segment configuration | Policy alignment |
| Fabric site go-live | WAN transport ready | Validation testing |
| Policy enforcement | App-aware routing | SGT-to-SLA mapping |

---

## Chapter Summary

This chapter defined the comprehensive SD-Access architecture including:

1. **Fabric Design**: Multi-site fabric with 6 hub sites and 30+ branches
2. **Node Roles**: Clear Border, CP, and Edge node placement
3. **Underlay**: IS-IS routing with /31 point-to-point links
4. **Overlay**: 5 Virtual Networks, 12+ SGTs, VXLAN encapsulation
5. **DNAC**: 3-node HA cluster with DR
6. **ISE**: Distributed deployment with regional PSN pairs
7. **Wireless**: Fabric-enabled C9800 with C9130/9120 APs
8. **SD-WAN Integration**: Border-to-Edge L3 handoff, VN-to-VPN mapping

**Note**: SD-WAN detailed design (vManage, vSmart, transport policies, SLA classes) is covered in a separate project document.

**Next Step**: Proceed to [Chapter 3: Network & Security](../chapter-3-network-security/README.md) for detailed security design.

---

> **Document Control**  
> Version: 1.0 | Last Updated: December 2025  
> Classification: Technical Design Document
