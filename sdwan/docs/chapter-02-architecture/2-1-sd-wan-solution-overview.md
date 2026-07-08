# 2.1 SD-WAN Solution Overview

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-CH2-001 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Status | Final |
| Classification | Internal Use |

---

## 2.1.1 Cisco Catalyst SD-WAN Architecture Overview

### Solution Introduction

Cisco Catalyst SD-WAN (formerly Viptela SD-WAN) provides a cloud-delivered overlay WAN architecture that enables digital transformation through secure, scalable, and application-aware connectivity. For Abhavtech.com, this solution delivers centralized management, automated provisioning, and intelligent path selection across all 9 global sites.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              CISCO CATALYST SD-WAN SOLUTION ARCHITECTURE                    │
│                          Abhavtech.com Deployment                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        ┌─────────────────────┐                              │
│                        │    SD-WAN Manager   │                              │
│                        │   (3-node cluster)  │                              │
│                        │   Mumbai DC + DR    │                              │
│                        └──────────┬──────────┘                              │
│                                   │                                         │
│                    ┌──────────────┼──────────────┐                          │
│                    │              │              │                          │
│              ┌─────▼─────┐  ┌─────▼─────┐  ┌────▼──────┐                   │
│              │ SD-WAN    │  │ SD-WAN    │  │  SD-WAN   │                   │
│              │ Controller│  │ Controller│  │ Validator │                   │
│              │ (vSmart)  │  │ (vSmart)  │  │ (vBond)   │                   │
│              │ Mumbai x2 │  │ Chennai x2│  │ Cloud x2  │                   │
│              └─────┬─────┘  └─────┬─────┘  └────┬──────┘                   │
│                    │              │              │                          │
│                    └──────────────┼──────────────┘                          │
│                                   │                                         │
│       ┌───────────────────────────┼───────────────────────────┐            │
│       │                           │                           │            │
│  ┌────▼────┐  ┌────────┐  ┌──────▼──────┐  ┌────────┐  ┌────▼────┐       │
│  │ WAN Edge│  │WAN Edge│  │  WAN Edge   │  │WAN Edge│  │ WAN Edge│       │
│  │ Mumbai  │  │Chennai │  │  Bangalore  │  │ Delhi  │  │  Noida  │       │
│  │  (Hub)  │  │ (Hub)  │  │  (Branch)   │  │(Branch)│  │(Branch) │       │
│  └────┬────┘  └───┬────┘  └──────┬──────┘  └───┬────┘  └────┬────┘       │
│       │           │              │              │            │             │
│  ┌────▼────┐ ┌────▼────┐  ┌──────▼──────┐ ┌────▼────┐ ┌────▼────┐        │
│  │SD-Access│ │SD-Access│  │  SD-Access  │ │SD-Access│ │SD-Access│        │
│  │ Fabric  │ │ Fabric  │  │   Fabric    │ │ Fabric  │ │ Fabric  │        │
│  │ Border  │ │ Border  │  │   Border    │ │ Border  │ │ Border  │        │
│  └─────────┘ └─────────┘  └─────────────┘ └─────────┘ └─────────┘        │
│                                                                             │
│  EMEA Sites                              Americas Sites                     │
│  ┌────────┐  ┌─────────┐                 ┌─────────┐  ┌────────┐          │
│  │ London │  │Frankfurt│                 │   NJ    │  │ Dallas │          │
│  │  (Hub) │  │  (Hub)  │                 │  (Hub)  │  │  (Hub) │          │
│  └────────┘  └─────────┘                 └─────────┘  └────────┘          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Solution Components

| Component | Function | Deployment Model | Quantity |
|-----------|----------|------------------|----------|
| SD-WAN Manager (vManage) | Centralized management, monitoring, orchestration | 3-node cluster + DR | 6 nodes |
| SD-WAN Controller (vSmart) | Control plane, policy distribution, route reflection | Geo-distributed | 4 instances |
| SD-WAN Validator (vBond) | Authentication, orchestration, NAT traversal | Cloud-hosted | 2 instances |
| WAN Edge (cEdge) | Data plane, encryption, forwarding | Physical/Virtual | 15 devices |
| SD-WAN Analytics | Telemetry, visibility, insights | Integrated | 1 instance |

---

## 2.1.2 Software Version Selection

### Version Compatibility Matrix

| Component | Selected Version | Release Type | Support End Date |
|-----------|------------------|--------------|------------------|
| SD-WAN Manager | 20.15.1 | Extended Maintenance | December 2028 |
| SD-WAN Controller | 20.15.1 | Extended Maintenance | December 2028 |
| SD-WAN Validator | 20.15.1 | Extended Maintenance | December 2028 |
| WAN Edge IOS-XE | 17.15.1 | Extended Maintenance | December 2028 |
| Catalyst Center | 2.3.7.6 | Standard | June 2027 |
| ISE | 3.3 Patch 4 | Standard | March 2028 |

### Version Selection Rationale

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SOFTWARE VERSION SELECTION CRITERIA                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Selection Criteria           20.15.x Score    Alternative Scores           │
│  ─────────────────────────   ──────────────    ──────────────────           │
│  Extended Maintenance          ✓ 36 months     20.14.x: 18 months          │
│  Feature Completeness          ✓ Full MRF      20.12.x: Partial MRF        │
│  SD-Access Integration         ✓ CTS inline    20.9.x: Limited             │
│  Cloud OnRamp                  ✓ AWS/Azure     All versions                 │
│  Security Features             ✓ Snort 3.0     20.12.x: Snort 2.9          │
│  AI/ML Analytics               ✓ Full          20.9.x: Basic               │
│  Bug Fixes                     ✓ Latest        Historical versions          │
│                                                                             │
│  Final Score: 20.15.x = 95/100 (SELECTED)                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Features in 20.15.x

| Feature | Description | Business Value |
|---------|-------------|----------------|
| Multi-Region Fabric (MRF) | Hierarchical SD-WAN with regional boundaries | Optimized regional routing |
| Enhanced Cloud OnRamp | Improved SaaS/IaaS performance | 45% latency reduction |
| Snort 3.0 IPS | Next-gen intrusion prevention | Advanced threat protection |
| CTS Inline Tagging | Native SGT propagation | Zero-trust integration |
| AI Network Analytics | ML-based anomaly detection | Proactive operations |
| Wireless WAN | 5G/LTE integration | Transport diversity |

---

## 2.1.3 Deployment Architecture

### Global Topology Design

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ABHAVTECH.COM GLOBAL SD-WAN TOPOLOGY                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                              CONTROL PLANE                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   Mumbai DC              Chennai DR              Cloud              │   │
│  │   ┌─────────┐            ┌─────────┐            ┌─────────┐        │   │
│  │   │vManage  │────────────│vManage  │            │ vBond   │        │   │
│  │   │Cluster  │            │  DR     │            │ (AWS)   │        │   │
│  │   │(3-node) │            │(3-node) │            │         │        │   │
│  │   └────┬────┘            └────┬────┘            └────┬────┘        │   │
│  │        │                      │                      │             │   │
│  │   ┌────┴────┐            ┌────┴────┐                 │             │   │
│  │   │ vSmart  │            │ vSmart  │                 │             │   │
│  │   │  (x2)   │            │  (x2)   │                 │             │   │
│  │   └────┬────┘            └────┬────┘                 │             │   │
│  │        │                      │                      │             │   │
│  └────────┼──────────────────────┼──────────────────────┼─────────────┘   │
│           │                      │                      │                  │
│           └──────────────────────┼──────────────────────┘                  │
│                                  │                                         │
│                              DATA PLANE                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │   INDIA REGION             EMEA REGION           AMERICAS REGION   │   │
│  │   ════════════             ═══════════           ═══════════════   │   │
│  │                                                                     │   │
│  │   ┌─────────┐              ┌─────────┐           ┌─────────┐       │   │
│  │   │ Mumbai  │◄────────────►│ London  │◄─────────►│   NJ    │       │   │
│  │   │  DC     │              │  Hub    │           │   Hub   │       │   │
│  │   │(C8500)  │              │(C8300)  │           │(C8300)  │       │   │
│  │   └────┬────┘              └────┬────┘           └────┬────┘       │   │
│  │        │                        │                     │            │   │
│  │   ┌────┴────┐              ┌────┴────┐           ┌────┴────┐       │   │
│  │   │Chennai  │              │Frankfurt│           │ Dallas  │       │   │
│  │   │  DR     │              │  Hub    │           │   Hub   │       │   │
│  │   │(C8500)  │              │(C8300)  │           │(C8300)  │       │   │
│  │   └────┬────┘              └─────────┘           └─────────┘       │   │
│  │        │                                                           │   │
│  │   ┌────┼────────────┐                                              │   │
│  │   │    │            │                                              │   │
│  │   ▼    ▼            ▼                                              │   │
│  │ ┌────┐┌────┐     ┌────┐                                           │   │
│  │ │BLR ││DEL │     │NOI │                                           │   │
│  │ │Br  ││Br  │     │Br  │                                           │   │
│  │ └────┘└────┘     └────┘                                           │   │
│  │                                                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  Legend: ═══ Regional Fabric    ◄──► Inter-Region Tunnels                  │
│          DC = Data Center       Br = Branch                                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Site Classification

| Site | Classification | Router Model | Redundancy | Transport |
|------|----------------|--------------|------------|-----------|
| Mumbai | Data Center (Primary) | C8500-12X4QC (x2) | Active-Active | MPLS + DIA + 5G |
| Chennai | Data Center (DR) | C8500-12X4QC (x2) | Active-Active | MPLS + DIA + 5G |
| London | Regional Hub | C8300-2N2S-6T (x2) | Active-Active | MPLS + DIA |
| Frankfurt | Regional Hub | C8300-2N2S-6T (x2) | Active-Active | MPLS + DIA |
| New Jersey | Regional Hub | C8300-2N2S-6T (x2) | Active-Active | MPLS + DIA |
| Dallas | Regional Hub | C8300-2N2S-6T (x2) | Active-Active | MPLS + DIA |
| Bangalore | Branch | C8200L-1N-4T (x2) | Active-Standby | MPLS + DIA + 4G |
| Delhi | Branch | C8200L-1N-4T (x2) | Active-Standby | MPLS + DIA + 4G |
| Noida | Branch | C8200L-1N-4T (x1) | Single | DIA + 4G |

---

## 2.1.4 Functional Components Deep Dive

### SD-WAN Manager (vManage)

The SD-WAN Manager provides centralized management, monitoring, and orchestration for the entire SD-WAN fabric.

**Core Functions:**

| Function | Description |
|----------|-------------|
| Configuration Management | Template-based device configuration |
| Policy Orchestration | Centralized policy definition and distribution |
| Monitoring & Analytics | Real-time visibility and historical analytics |
| Software Management | Image repository and upgrade orchestration |
| Certificate Management | PKI infrastructure and certificate lifecycle |
| API Gateway | REST API for automation and integration |

**Deployment Specifications:**

| Parameter | Value |
|-----------|-------|
| Deployment Mode | Cluster (3-node) |
| vCPU per Node | 32 |
| Memory per Node | 128 GB |
| Storage per Node | 2 TB SSD |
| Network Interfaces | 2 (Management + Cluster) |
| Operating System | vManage OS |
| High Availability | Active-Active-Active |

**Cluster Architecture:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SD-WAN MANAGER CLUSTER ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                         Load Balancer VIP                                   │
│                        198.51.100.10:443                                    │
│                              │                                              │
│           ┌──────────────────┼──────────────────┐                          │
│           │                  │                  │                          │
│           ▼                  ▼                  ▼                          │
│     ┌──────────┐       ┌──────────┐       ┌──────────┐                     │
│     │ vManage1 │       │ vManage2 │       │ vManage3 │                     │
│     │ Primary  │◄─────►│ Secondary│◄─────►│ Tertiary │                     │
│     │          │       │          │       │          │                     │
│     │ Services:│       │ Services:│       │ Services:│                     │
│     │ - Config │       │ - Config │       │ - Config │                     │
│     │ - Stats  │       │ - Stats  │       │ - Stats  │                     │
│     │ - App    │       │ - App    │       │ - App    │                     │
│     │ - Coord  │       │ - Coord  │       │ - Coord  │                     │
│     └────┬─────┘       └────┬─────┘       └────┬─────┘                     │
│          │                  │                  │                            │
│          └──────────────────┼──────────────────┘                            │
│                             │                                               │
│                    Cluster Communication                                    │
│                    (Port 8443, TLS 1.3)                                     │
│                                                                             │
│  IP Addresses:                                                              │
│  Node 1: 198.51.100.11    Node 2: 198.51.100.12    Node 3: 198.51.100.13  │
│  Cluster IP: 198.51.100.10                                                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### SD-WAN Controller (vSmart)

The SD-WAN Controller implements the centralized control plane using OMP (Overlay Management Protocol).

**Core Functions:**

| Function | Description |
|----------|-------------|
| Route Reflection | OMP route distribution to WAN Edges |
| Policy Enforcement | Control and data policy implementation |
| Key Distribution | IPsec SA key exchange facilitation |
| Traffic Engineering | Path selection and load balancing |
| Service Chaining | Service insertion orchestration |

**Deployment Specifications:**

| Parameter | Value |
|-----------|-------|
| Quantity | 4 (2 per DC) |
| vCPU per Instance | 8 |
| Memory per Instance | 16 GB |
| Storage per Instance | 32 GB SSD |
| Network Interfaces | 2 |
| High Availability | Active-Active |
| Max WAN Edges | 5,400 per controller |

**Controller Placement:**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SD-WAN CONTROLLER DISTRIBUTION                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Mumbai Data Center                    Chennai DR Site                     │
│   ══════════════════                    ═══════════════                     │
│                                                                             │
│   ┌─────────────────┐                   ┌─────────────────┐                │
│   │ vSmart-Mumbai-1 │                   │vSmart-Chennai-1 │                │
│   │ System IP:      │                   │ System IP:      │                │
│   │ 10.255.255.1    │                   │ 10.255.255.3    │                │
│   │                 │                   │                 │                │
│   │ Site-ID: 100    │                   │ Site-ID: 200    │                │
│   │ Domain-ID: 1    │                   │ Domain-ID: 1    │                │
│   └────────┬────────┘                   └────────┬────────┘                │
│            │                                      │                         │
│            │         OMP Peering                  │                         │
│            └────────────────────────────────────►│                         │
│                                                                             │
│   ┌─────────────────┐                   ┌─────────────────┐                │
│   │ vSmart-Mumbai-2 │                   │vSmart-Chennai-2 │                │
│   │ System IP:      │                   │ System IP:      │                │
│   │ 10.255.255.2    │                   │ 10.255.255.4    │                │
│   │                 │                   │                 │                │
│   │ Site-ID: 100    │                   │ Site-ID: 200    │                │
│   │ Domain-ID: 1    │                   │ Domain-ID: 1    │                │
│   └─────────────────┘                   └─────────────────┘                │
│                                                                             │
│   Affinity Configuration:                                                   │
│   - India sites → vSmart-Mumbai preferred                                  │
│   - EMEA sites → vSmart-Chennai preferred (lower latency)                  │
│   - Americas sites → Round-robin                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### SD-WAN Validator (vBond)

The SD-WAN Validator provides initial authentication and orchestration for WAN Edge devices.

**Core Functions:**

| Function | Description |
|----------|-------------|
| Device Authentication | Certificate validation for onboarding |
| Controller Discovery | vSmart and vManage endpoint distribution |
| NAT Traversal | Public IP discovery for NAT'd devices |
| Load Distribution | WAN Edge to controller assignment |

**Deployment Specifications:**

| Parameter | Value |
|-----------|-------|
| Deployment Model | Cloud-hosted (AWS) |
| Quantity | 2 (Active-Active) |
| vCPU | 2 |
| Memory | 4 GB |
| Public Accessibility | Required (DNS resolvable) |
| Ports | UDP 12346, TCP 443 |

### WAN Edge Routers (cEdge)

WAN Edge routers implement the data plane for SD-WAN overlay.

**Hardware Selection:**

| Model | Role | Throughput | Interfaces | Deployment Sites |
|-------|------|------------|------------|------------------|
| C8500-12X4QC | DC Core | 100 Gbps | 12x10G + 4x40G | Mumbai, Chennai |
| C8300-2N2S-6T | Regional Hub | 10 Gbps | 2xNIM + 6x1G | London, Frankfurt, NJ, Dallas |
| C8200L-1N-4T | Branch | 2 Gbps | 1xNIM + 4x1G | Bangalore, Delhi, Noida |

**Feature Support Matrix:**

| Feature | C8500 | C8300 | C8200L |
|---------|-------|-------|--------|
| IPsec Throughput | 100 Gbps | 10 Gbps | 2 Gbps |
| Max Tunnels | 16,000 | 8,000 | 2,000 |
| AppQoE | Yes | Yes | Yes |
| UTD (Snort 3.0) | Yes | Yes | Limited |
| Cloud OnRamp | Yes | Yes | Yes |
| 5G Module | Yes | Yes | Yes |

---

## 2.1.5 Protocol Stack

### Control Plane Protocols

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SD-WAN PROTOCOL STACK                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        MANAGEMENT PLANE                             │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐        │   │
│  │  │ REST API  │  │   NETCONF │  │   SNMP    │  │  Syslog   │        │   │
│  │  │ (HTTPS)   │  │ (SSH/TLS) │  │  (v2c/v3) │  │  (UDP)    │        │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         CONTROL PLANE                               │   │
│  │  ┌───────────────────────────────────────────────────────────────┐ │   │
│  │  │                   OMP (Overlay Management Protocol)            │ │   │
│  │  │  - Route Distribution    - Policy Distribution                 │ │   │
│  │  │  - TLOC Resolution       - Key Exchange                       │ │   │
│  │  │  - Service Chaining      - Load Balancing                     │ │   │
│  │  └───────────────────────────────────────────────────────────────┘ │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐       │   │
│  │  │   DTLS    │  │    TLS    │  │    BFD    │  │   STUN    │       │   │
│  │  │ (Control) │  │  (Mgmt)   │  │ (Liveness)│  │   (NAT)   │       │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          DATA PLANE                                 │   │
│  │  ┌───────────────────────────────────────────────────────────────┐ │   │
│  │  │              IPsec (AES-256-GCM) / GRE Tunnels                 │ │   │
│  │  └───────────────────────────────────────────────────────────────┘ │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐       │   │
│  │  │    AAR    │  │    QoS    │  │    FEC    │  │   DRE     │       │   │
│  │  │ (Routing) │  │(Scheduling)│  │ (Repair) │  │ (Dedup)   │       │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      TRANSPORT PLANE                                │   │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐       │   │
│  │  │   MPLS    │  │  Internet │  │   5G/LTE  │  │ Satellite │       │   │
│  │  │ (Private) │  │  (Public) │  │ (Cellular)│  │   (LEO)   │       │   │
│  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### OMP Protocol Details

| Attribute | Value |
|-----------|-------|
| Protocol Type | BGP-like path-vector protocol |
| Transport | DTLS (UDP 12346) |
| Update Types | Routes, TLOCs, Services, Policies |
| Convergence | Sub-second with BFD |
| Graceful Restart | Supported (default 12 hours) |
| Authentication | Certificate-based |

**OMP Route Types:**

| Route Type | Description | Distribution |
|------------|-------------|--------------|
| OMP Route | Prefix from WAN Edge | vSmart → all WAN Edges |
| TLOC | Transport Locator | vSmart → all WAN Edges |
| Service Route | Firewall, IPS services | vSmart → applicable VPNs |
| vRoute | VPN-specific route | vSmart → VPN members |

---

## 2.1.6 SD-Access Integration Model

### Independent Domain Architecture

Abhavtech.com implements the Independent Domain integration model where SD-WAN and SD-Access operate as separate control domains with Layer 3 handoff at the fabric border.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              SD-ACCESS AND SD-WAN INDEPENDENT DOMAIN MODEL                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────┐     ┌─────────────────────────────┐       │
│  │      SD-ACCESS DOMAIN       │     │      SD-WAN DOMAIN          │       │
│  │                             │     │                             │       │
│  │  ┌──────────────────────┐   │     │   ┌──────────────────────┐ │       │
│  │  │   Catalyst Center    │   │     │   │   SD-WAN Manager     │ │       │
│  │  │   (DNA Controller)   │   │     │   │    (vManage)         │ │       │
│  │  └──────────────────────┘   │     │   └──────────────────────┘ │       │
│  │            │                │     │            │                │       │
│  │  ┌─────────▼────────────┐   │     │   ┌────────▼─────────────┐ │       │
│  │  │        ISE           │   │     │   │   SD-WAN Controller  │ │       │
│  │  │   (Policy Engine)    │   │     │   │     (vSmart)         │ │       │
│  │  └──────────────────────┘   │     │   └──────────────────────┘ │       │
│  │            │                │     │            │                │       │
│  │  ┌─────────▼────────────┐   │     │   ┌────────▼─────────────┐ │       │
│  │  │    Fabric Nodes      │   │     │   │     WAN Edge         │ │       │
│  │  │  (Edge, Control,     │   │     │   │   (cEdge Router)     │ │       │
│  │  │   Border Nodes)      │   │     │   │                      │ │       │
│  │  └──────────┬───────────┘   │     │   └──────────┬───────────┘ │       │
│  │             │               │     │              │              │       │
│  └─────────────┼───────────────┘     └──────────────┼──────────────┘       │
│                │                                    │                       │
│                │        INTEGRATION POINT           │                       │
│                │     ┌─────────────────────┐        │                       │
│                └────►│    L3 Handoff       │◄───────┘                       │
│                      │  ─────────────────  │                                │
│                      │  - VRF-Lite         │                                │
│                      │  - eBGP Peering     │                                │
│                      │  - CTS Inline SGT   │                                │
│                      │  - BFD Liveness     │                                │
│                      └─────────────────────┘                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### VRF/VN to Service VPN Mapping

| SD-Access VN | VRF Name | SD-WAN Service VPN | VLAN ID | SGT Range |
|--------------|----------|-------------------|---------|-----------|
| Employee_VN | CORPORATE | VPN 10 | 100 | 10-19 |
| Guest_VN | GUEST | VPN 20 | 200 | 20-29 |
| IoT_VN | IOT | VPN 30 | 300 | 30-39 |
| Voice_VN | VOICE | VPN 40 | 400 | 40-49 |
| Shared_Services_VN | SHARED | VPN 50 | 500 | 50-59 |

---

## 2.1.7 Licensing Model

### DNA Software Licensing

| License Tier | Features | Recommended |
|--------------|----------|-------------|
| DNA Essentials | Basic SD-WAN, segmentation, AAR | No |
| DNA Advantage | + Cloud OnRamp, UTD, ThousandEyes | **Yes** |
| DNA Premier | + Full Umbrella, Secure Workload | Optional |

### License Requirements for Abhavtech.com

| Component | License Type | Quantity | Term | Annual Cost |
|-----------|--------------|----------|------|-------------|
| WAN Edge Routers | DNA Advantage | 15 | 3-year | $XX,XXX |
| vManage | Included | 3 | - | Included |
| vSmart | Included | 4 | - | Included |
| vBond | Cloud-hosted | 2 | - | $X,XXX/year |
| ThousandEyes | WAN Insights | 15 | 3-year | $XX,XXX |
| **Total** | | | **3-year** | **$XXX,XXX** |

### Smart License Configuration

```
! WAN Edge Smart License Configuration
license smart transport smart
license smart url https://smartreceiver.cisco.com/licservice/license
!
! Register to Smart Account
license smart register idtoken <TOKEN>
!
! Verify License Status
show license status
show license usage
```

---

## 2.1.8 Scalability Parameters

### Controller Scalability

| Parameter | vManage Cluster | vSmart | vBond |
|-----------|-----------------|--------|-------|
| Max WAN Edges | 10,000 | 5,400 | 6,000 |
| Max OMP Routes | 500,000 | 500,000 | N/A |
| Max Service VPNs | 512 | 512 | N/A |
| Max Policies | 20,000 | 20,000 | N/A |
| Max Templates | 10,000 | N/A | N/A |

### Abhavtech.com Capacity Planning

| Resource | Current Need | Growth (3-year) | Capacity | Utilization |
|----------|--------------|-----------------|----------|-------------|
| WAN Edge Devices | 15 | 25 | 10,000 | 0.25% |
| OMP Routes | 500 | 1,000 | 500,000 | 0.2% |
| Service VPNs | 5 | 10 | 512 | 2% |
| IPsec Tunnels | 90 | 200 | 16,000 | 1.25% |
| Templates | 50 | 100 | 10,000 | 1% |

---

## 2.1.9 Solution Benefits Summary

### Quantified Benefits

| Benefit Category | Current State | Target State | Improvement |
|------------------|---------------|--------------|-------------|
| WAN Costs | $XX,XXX/month | $XX,XXX/month | 76% reduction |
| Provisioning Time | 8-12 weeks | 1-2 weeks | 80% faster |
| Application Latency (SaaS) | 85-120ms | 35-55ms | 50% reduction |
| WAN Availability | 99.92% | 99.99% | 7x fewer outages |
| Change Implementation | 2-4 weeks | <1 day | 95% faster |

### Strategic Benefits

| Benefit | Description |
|---------|-------------|
| Business Agility | Rapid site deployment, bandwidth on-demand |
| Cloud Transformation | Direct cloud access, optimized SaaS performance |
| Security Posture | Zero-trust integration, end-to-end encryption |
| Operational Efficiency | Single pane of glass, automation-ready |
| Cost Optimization | Transport flexibility, MPLS elimination |
| Future Ready | 5G/LEO support, AI/ML analytics |

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Network Architecture Team | Initial release |

---

*End of Section 2.1 - SD-WAN Solution Overview*
