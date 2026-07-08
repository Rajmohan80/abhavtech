# 4.5 Underlay Network Provisioning

## 4.5.1 Underlay Design Principles

### Design Overview

The underlay network provides Layer 3 IP connectivity between all fabric nodes. It uses IS-IS as the routing protocol with BFD for fast failure detection.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        UNDERLAY DESIGN PRINCIPLES                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ROUTING PROTOCOL: IS-IS (Level-2 Only)                                    │
│  ─────────────────────────────────────                                      │
│  • Single area per fabric site                                              │
│  • Wide metrics enabled                                                     │
│  • Point-to-point links (no DR/BDR election)                               │
│  • BFD for sub-second failover                                             │
│  • Authentication: HMAC-SHA-256                                            │
│                                                                             │
│  ADDRESSING:                                                                │
│  ───────────                                                                │
│  • Loopbacks: 10.250.0.0/16 (RLOC addresses)                               │
│  • P2P Links: 10.251.0.0/16 (/31 per link)                                 │
│  • Management: 10.252.0.0/16 (OOB management)                              │
│                                                                             │
│  MTU REQUIREMENTS:                                                          │
│  ─────────────────                                                          │
│  • Fabric links: 9100 bytes minimum                                        │
│  • VXLAN overhead: 50 bytes                                                │
│  • Original frame: 1500 bytes                                              │
│  • Total required: 1500 + 50 = 1550 (9100 provides headroom)              │
│                                                                             │
│  CONVERGENCE TARGETS:                                                       │
│  ────────────────────                                                       │
│  • Link failure detection: <100ms (BFD)                                    │
│  • Routing convergence: <1 second                                          │
│  • End-to-end failover: <2 seconds                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Underlay Topology Per Site Type

**Hub Site Topology (Full Mesh Core)**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HUB SITE UNDERLAY TOPOLOGY                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                          WAN / SD-WAN                                       │
│                              │                                              │
│            ┌─────────────────┴─────────────────┐                           │
│            │                                   │                           │
│      ┌─────┴─────┐                       ┌─────┴─────┐                     │
│      │ BORDER-1  │═══════════════════════│ BORDER-2  │                     │
│      │ Lo0: .1   │      10G P2P          │ Lo0: .2   │                     │
│      └─────┬─────┘                       └─────┬─────┘                     │
│            │╲                               ╱│                             │
│            │ ╲         Full Mesh          ╱ │                             │
│            │  ╲         10G P2P          ╱  │                             │
│            │   ╲                        ╱   │                             │
│      ┌─────┴─────┐                 ┌────┴──────┐                          │
│      │   CP-1    │═════════════════│   CP-2    │                          │
│      │ Lo0: .3   │     10G P2P     │ Lo0: .4   │                          │
│      └─────┬─────┘                 └─────┬─────┘                          │
│            │                             │                                 │
│            │     Distribution Layer      │                                 │
│            │      (L3 to Access)         │                                 │
│            │                             │                                 │
│    ┌───────┴───────┬───────────┬────────┴───────┐                        │
│    │               │           │                │                        │
│ ┌──┴───┐      ┌───┴──┐   ┌───┴──┐        ┌───┴──┐                       │
│ │Edge-1│      │Edge-2│   │Edge-3│  ...   │Edge-N│                       │
│ │Lo0:.5│      │Lo0:.6│   │Lo0:.7│        │Lo0:.N│                       │
│ └──────┘      └──────┘   └──────┘        └──────┘                       │
│                                                                             │
│  Link Types:                                                                │
│  ═══════ = 10G/25G P2P Links (IS-IS)                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Branch Site Topology (Fabric-in-a-Box)**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BRANCH SITE UNDERLAY TOPOLOGY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                          SD-WAN Edge                                        │
│                              │                                              │
│                        ┌─────┴─────┐                                       │
│                        │  FiaB-1   │═══════════┐                           │
│                        │(Border+CP)│           │ StackWise                 │
│                        │ Lo0: .1   │     ┌─────┴─────┐                     │
│                        └─────┬─────┘     │  FiaB-2   │                     │
│                              │           │(Border+CP)│                     │
│                              │           │ Lo0: .2   │                     │
│                              │           └─────┬─────┘                     │
│                              │                 │                           │
│                    ┌─────────┴─────────────────┘                           │
│                    │                                                        │
│            ┌───────┴───────┬───────────┐                                   │
│            │               │           │                                   │
│        ┌───┴──┐       ┌───┴──┐   ┌───┴──┐                                 │
│        │Edge-1│       │Edge-2│   │Edge-N│                                 │
│        │Lo0:.3│       │Lo0:.4│   │Lo0:.N│                                 │
│        └──────┘       └──────┘   └──────┘                                 │
│                                                                             │
│  Note: FiaB nodes combine Border, CP, and can also serve as Edge          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 4.5.2 Complete IP Addressing Scheme

### Loopback Address Allocation (10.250.0.0/16)

**Address Format**: `10.250.{site-id}.{node-id}/32`

| Region | Site | Site ID | Address Range | Capacity |
|--------|------|---------|---------------|----------|
| APAC | Mumbai | 1 | 10.250.1.0/24 | 254 nodes |
| APAC | Chennai | 2 | 10.250.2.0/24 | 254 nodes |
| APAC | Bangalore | 3 | 10.250.3.0/24 | 254 nodes |
| APAC | Delhi | 4 | 10.250.4.0/24 | 254 nodes |
| APAC | Noida | 5 | 10.250.5.0/24 | 254 nodes |
| EMEA | London | 16 | 10.250.16.0/24 | 254 nodes |
| EMEA | Frankfurt | 17 | 10.250.17.0/24 | 254 nodes |
| EMEA | Paris | 18 | 10.250.18.0/24 | 254 nodes |
| EMEA | Amsterdam | 19 | 10.250.19.0/24 | 254 nodes |
| EMEA | Dublin | 20 | 10.250.20.0/24 | 254 nodes |
| AMER | New Jersey | 32 | 10.250.32.0/24 | 254 nodes |
| AMER | Dallas | 33 | 10.250.33.0/24 | 254 nodes |
| AMER | Chicago | 34 | 10.250.34.0/24 | 254 nodes |
| AMER | Seattle | 35 | 10.250.35.0/24 | 254 nodes |
| AMER | Los Angeles | 36 | 10.250.36.0/24 | 254 nodes |

**Node ID Assignment Standard**

| Node Type | Node ID Range | Example (Mumbai) |
|-----------|---------------|------------------|
| Border Node 1 | 1 | 10.250.1.1/32 |
| Border Node 2 | 2 | 10.250.1.2/32 |
| Control Plane 1 | 3 | 10.250.1.3/32 |
| Control Plane 2 | 4 | 10.250.1.4/32 |
| Edge Nodes | 5-200 | 10.250.1.5/32 - 10.250.1.200/32 |
| Extended Nodes | 201-250 | 10.250.1.201/32 - 10.250.1.250/32 |
| Reserved | 251-254 | Future use |

### Complete Loopback Assignments - All Hub Sites

**Mumbai (Site ID: 1)**

| Hostname | Role | Loopback0 | Platform |
|----------|------|-----------|----------|
| MUM-BN-01 | Border Node | 10.250.1.1/32 | C9500-48Y4C |
| MUM-BN-02 | Border Node | 10.250.1.2/32 | C9500-48Y4C |
| MUM-CP-01 | Control Plane | 10.250.1.3/32 | C9500-24Y4C |
| MUM-CP-02 | Control Plane | 10.250.1.4/32 | C9500-24Y4C |
| MUM-ED-01 | Edge Node | 10.250.1.5/32 | C9300-48UXM |
| MUM-ED-02 | Edge Node | 10.250.1.6/32 | C9300-48UXM |
| MUM-ED-03 | Edge Node | 10.250.1.7/32 | C9300-48UXM |
| MUM-ED-04 | Edge Node | 10.250.1.8/32 | C9300-48UXM |
| MUM-ED-05 | Edge Node | 10.250.1.9/32 | C9300-48UXM |
| MUM-ED-06 | Edge Node | 10.250.1.10/32 | C9300-48UXM |
| MUM-ED-07 | Edge Node | 10.250.1.11/32 | C9300-48UXM |
| MUM-ED-08 | Edge Node | 10.250.1.12/32 | C9300-48UXM |
| ... | ... | ... | ... |
| MUM-ED-48 | Edge Node | 10.250.1.52/32 | C9300-48U |

**Chennai (Site ID: 2)**

| Hostname | Role | Loopback0 | Platform |
|----------|------|-----------|----------|
| CHN-BN-01 | Border Node | 10.250.2.1/32 | C9500-48Y4C |
| CHN-BN-02 | Border Node | 10.250.2.2/32 | C9500-48Y4C |
| CHN-CP-01 | Control Plane | 10.250.2.3/32 | C9500-24Y4C |
| CHN-CP-02 | Control Plane | 10.250.2.4/32 | C9500-24Y4C |
| CHN-ED-01 | Edge Node | 10.250.2.5/32 | C9300-48UXM |
| ... | ... | ... | ... |
| CHN-ED-36 | Edge Node | 10.250.2.40/32 | C9300-48U |

**London (Site ID: 16)**

| Hostname | Role | Loopback0 | Platform |
|----------|------|-----------|----------|
| LON-BN-01 | Border Node | 10.250.16.1/32 | C9500-48Y4C |
| LON-BN-02 | Border Node | 10.250.16.2/32 | C9500-48Y4C |
| LON-CP-01 | Control Plane | 10.250.16.3/32 | C9500-24Y4C |
| LON-CP-02 | Control Plane | 10.250.16.4/32 | C9500-24Y4C |
| LON-ED-01 | Edge Node | 10.250.16.5/32 | C9300-48UXM |
| ... | ... | ... | ... |
| LON-ED-42 | Edge Node | 10.250.16.46/32 | C9300-48U |

**Frankfurt (Site ID: 17)**

| Hostname | Role | Loopback0 | Platform |
|----------|------|-----------|----------|
| FRA-BN-01 | Border Node | 10.250.17.1/32 | C9500-48Y4C |
| FRA-BN-02 | Border Node | 10.250.17.2/32 | C9500-48Y4C |
| FRA-CP-01 | Control Plane | 10.250.17.3/32 | C9500-24Y4C |
| FRA-CP-02 | Control Plane | 10.250.17.4/32 | C9500-24Y4C |
| FRA-ED-01 | Edge Node | 10.250.17.5/32 | C9300-48UXM |
| ... | ... | ... | ... |
| FRA-ED-28 | Edge Node | 10.250.17.32/32 | C9300-48U |

**New Jersey (Site ID: 32)**

| Hostname | Role | Loopback0 | Platform |
|----------|------|-----------|----------|
| NJ-BN-01 | Border Node | 10.250.32.1/32 | C9500-48Y4C |
| NJ-BN-02 | Border Node | 10.250.32.2/32 | C9500-48Y4C |
| NJ-CP-01 | Control Plane | 10.250.32.3/32 | C9500-24Y4C |
| NJ-CP-02 | Control Plane | 10.250.32.4/32 | C9500-24Y4C |
| NJ-ED-01 | Edge Node | 10.250.32.5/32 | C9300-48UXM |
| ... | ... | ... | ... |
| NJ-ED-52 | Edge Node | 10.250.32.56/32 | C9300-48U |

**Dallas (Site ID: 33)**

| Hostname | Role | Loopback0 | Platform |
|----------|------|-----------|----------|
| DAL-BN-01 | Border Node | 10.250.33.1/32 | C9500-48Y4C |
| DAL-BN-02 | Border Node | 10.250.33.2/32 | C9500-48Y4C |
| DAL-CP-01 | Control Plane | 10.250.33.3/32 | C9500-24Y4C |
| DAL-CP-02 | Control Plane | 10.250.33.4/32 | C9500-24Y4C |
| DAL-ED-01 | Edge Node | 10.250.33.5/32 | C9300-48UXM |
| ... | ... | ... | ... |
| DAL-ED-32 | Edge Node | 10.250.33.36/32 | C9300-48U |

### Branch Site Loopback Assignments

**Bangalore (Site ID: 3) - Fabric-in-a-Box**

| Hostname | Role | Loopback0 | Platform |
|----------|------|-----------|----------|
| BLR-FIAB-01 | FiaB (Border+CP) | 10.250.3.1/32 | C9300-48UXM |
| BLR-FIAB-02 | FiaB (Border+CP) | 10.250.3.2/32 | C9300-48UXM |
| BLR-ED-01 | Edge Node | 10.250.3.3/32 | C9300-24U |
| BLR-ED-02 | Edge Node | 10.250.3.4/32 | C9300-24U |
| BLR-ED-03 | Edge Node | 10.250.3.5/32 | C9300-24U |
| BLR-ED-04 | Edge Node | 10.250.3.6/32 | C9300-24U |
| BLR-ED-05 | Edge Node | 10.250.3.7/32 | C9300-24U |
| BLR-ED-06 | Edge Node | 10.250.3.8/32 | C9300-24U |
| BLR-ED-07 | Edge Node | 10.250.3.9/32 | C9300-24U |
| BLR-ED-08 | Edge Node | 10.250.3.10/32 | C9300-24U |

**Delhi (Site ID: 4) - Fabric-in-a-Box**

| Hostname | Role | Loopback0 | Platform |
|----------|------|-----------|----------|
| DEL-FIAB-01 | FiaB (Border+CP) | 10.250.4.1/32 | C9300-48UXM |
| DEL-FIAB-02 | FiaB (Border+CP) | 10.250.4.2/32 | C9300-48UXM |
| DEL-ED-01 | Edge Node | 10.250.4.3/32 | C9300-24U |
| DEL-ED-02 | Edge Node | 10.250.4.4/32 | C9300-24U |
| DEL-ED-03 | Edge Node | 10.250.4.5/32 | C9300-24U |
| DEL-ED-04 | Edge Node | 10.250.4.6/32 | C9300-24U |
| DEL-ED-05 | Edge Node | 10.250.4.7/32 | C9300-24U |
| DEL-ED-06 | Edge Node | 10.250.4.8/32 | C9300-24U |

**Noida (Site ID: 5) - Fabric-in-a-Box**

| Hostname | Role | Loopback0 | Platform |
|----------|------|-----------|----------|
| NOI-FIAB-01 | FiaB (Border+CP) | 10.250.5.1/32 | C9300-24UXM |
| NOI-FIAB-02 | FiaB (Border+CP) | 10.250.5.2/32 | C9300-24UXM |
| NOI-ED-01 | Edge Node | 10.250.5.3/32 | C9200-24P |
| NOI-ED-02 | Edge Node | 10.250.5.4/32 | C9200-24P |

---

## 4.5.3 Point-to-Point Link Addressing (10.251.0.0/16)

### P2P Address Format

**Format**: `10.251.{site-id}.{link-id * 2}/31`

Each /31 provides 2 addresses:
- Even address (.0, .2, .4, etc.) = Lower node ID
- Odd address (.1, .3, .5, etc.) = Higher node ID

### Complete P2P Link Table - Mumbai (Site ID: 1)

| Link ID | From Device | From Interface | From IP | To Device | To Interface | To IP | Speed |
|---------|-------------|----------------|---------|-----------|--------------|-------|-------|
| 0 | MUM-BN-01 | Te1/0/1 | 10.251.1.0/31 | MUM-BN-02 | Te1/0/1 | 10.251.1.1/31 | 10G |
| 1 | MUM-BN-01 | Te1/0/2 | 10.251.1.2/31 | MUM-CP-01 | Te1/0/1 | 10.251.1.3/31 | 10G |
| 2 | MUM-BN-01 | Te1/0/3 | 10.251.1.4/31 | MUM-CP-02 | Te1/0/1 | 10.251.1.5/31 | 10G |
| 3 | MUM-BN-02 | Te1/0/2 | 10.251.1.6/31 | MUM-CP-01 | Te1/0/2 | 10.251.1.7/31 | 10G |
| 4 | MUM-BN-02 | Te1/0/3 | 10.251.1.8/31 | MUM-CP-02 | Te1/0/2 | 10.251.1.9/31 | 10G |
| 5 | MUM-CP-01 | Te1/0/3 | 10.251.1.10/31 | MUM-CP-02 | Te1/0/3 | 10.251.1.11/31 | 10G |
| 6 | MUM-CP-01 | Te1/0/4 | 10.251.1.12/31 | MUM-ED-01 | Te1/1/1 | 10.251.1.13/31 | 10G |
| 7 | MUM-CP-02 | Te1/0/4 | 10.251.1.14/31 | MUM-ED-01 | Te1/1/2 | 10.251.1.15/31 | 10G |
| 8 | MUM-CP-01 | Te1/0/5 | 10.251.1.16/31 | MUM-ED-02 | Te1/1/1 | 10.251.1.17/31 | 10G |
| 9 | MUM-CP-02 | Te1/0/5 | 10.251.1.18/31 | MUM-ED-02 | Te1/1/2 | 10.251.1.19/31 | 10G |
| 10 | MUM-CP-01 | Te1/0/6 | 10.251.1.20/31 | MUM-ED-03 | Te1/1/1 | 10.251.1.21/31 | 10G |
| 11 | MUM-CP-02 | Te1/0/6 | 10.251.1.22/31 | MUM-ED-03 | Te1/1/2 | 10.251.1.23/31 | 10G |
| 12 | MUM-CP-01 | Te1/0/7 | 10.251.1.24/31 | MUM-ED-04 | Te1/1/1 | 10.251.1.25/31 | 10G |
| 13 | MUM-CP-02 | Te1/0/7 | 10.251.1.26/31 | MUM-ED-04 | Te1/1/2 | 10.251.1.27/31 | 10G |
| 14 | MUM-CP-01 | Te1/0/8 | 10.251.1.28/31 | MUM-ED-05 | Te1/1/1 | 10.251.1.29/31 | 10G |
| 15 | MUM-CP-02 | Te1/0/8 | 10.251.1.30/31 | MUM-ED-05 | Te1/1/2 | 10.251.1.31/31 | 10G |
| ... | ... | ... | ... | ... | ... | ... | ... |

### Complete P2P Link Table - London (Site ID: 16)

| Link ID | From Device | From Interface | From IP | To Device | To Interface | To IP | Speed |
|---------|-------------|----------------|---------|-----------|--------------|-------|-------|
| 0 | LON-BN-01 | Te1/0/1 | 10.251.16.0/31 | LON-BN-02 | Te1/0/1 | 10.251.16.1/31 | 10G |
| 1 | LON-BN-01 | Te1/0/2 | 10.251.16.2/31 | LON-CP-01 | Te1/0/1 | 10.251.16.3/31 | 10G |
| 2 | LON-BN-01 | Te1/0/3 | 10.251.16.4/31 | LON-CP-02 | Te1/0/1 | 10.251.16.5/31 | 10G |
| 3 | LON-BN-02 | Te1/0/2 | 10.251.16.6/31 | LON-CP-01 | Te1/0/2 | 10.251.16.7/31 | 10G |
| 4 | LON-BN-02 | Te1/0/3 | 10.251.16.8/31 | LON-CP-02 | Te1/0/2 | 10.251.16.9/31 | 10G |
| 5 | LON-CP-01 | Te1/0/3 | 10.251.16.10/31 | LON-CP-02 | Te1/0/3 | 10.251.16.11/31 | 10G |
| 6 | LON-CP-01 | Te1/0/4 | 10.251.16.12/31 | LON-ED-01 | Te1/1/1 | 10.251.16.13/31 | 10G |
| 7 | LON-CP-02 | Te1/0/4 | 10.251.16.14/31 | LON-ED-01 | Te1/1/2 | 10.251.16.15/31 | 10G |
| ... | ... | ... | ... | ... | ... | ... | ... |

### Complete P2P Link Table - New Jersey (Site ID: 32)

| Link ID | From Device | From Interface | From IP | To Device | To Interface | To IP | Speed |
|---------|-------------|----------------|---------|-----------|--------------|-------|-------|
| 0 | NJ-BN-01 | Te1/0/1 | 10.251.32.0/31 | NJ-BN-02 | Te1/0/1 | 10.251.32.1/31 | 10G |
| 1 | NJ-BN-01 | Te1/0/2 | 10.251.32.2/31 | NJ-CP-01 | Te1/0/1 | 10.251.32.3/31 | 10G |
| 2 | NJ-BN-01 | Te1/0/3 | 10.251.32.4/31 | NJ-CP-02 | Te1/0/1 | 10.251.32.5/31 | 10G |
| 3 | NJ-BN-02 | Te1/0/2 | 10.251.32.6/31 | NJ-CP-01 | Te1/0/2 | 10.251.32.7/31 | 10G |
| 4 | NJ-BN-02 | Te1/0/3 | 10.251.32.8/31 | NJ-CP-02 | Te1/0/2 | 10.251.32.9/31 | 10G |
| 5 | NJ-CP-01 | Te1/0/3 | 10.251.32.10/31 | NJ-CP-02 | Te1/0/3 | 10.251.32.11/31 | 10G |
| ... | ... | ... | ... | ... | ... | ... | ... |

### Branch P2P Links - Bangalore (Site ID: 3)

| Link ID | From Device | From Interface | From IP | To Device | To Interface | To IP | Speed |
|---------|-------------|----------------|---------|-----------|--------------|-------|-------|
| 0 | BLR-FIAB-01 | Te1/1/1 | 10.251.3.0/31 | BLR-FIAB-02 | Te1/1/1 | 10.251.3.1/31 | 10G |
| 1 | BLR-FIAB-01 | Te1/1/3 | 10.251.3.2/31 | BLR-ED-01 | Te1/1/1 | 10.251.3.3/31 | 10G |
| 2 | BLR-FIAB-02 | Te1/1/3 | 10.251.3.4/31 | BLR-ED-01 | Te1/1/2 | 10.251.3.5/31 | 10G |
| 3 | BLR-FIAB-01 | Te1/1/4 | 10.251.3.6/31 | BLR-ED-02 | Te1/1/1 | 10.251.3.7/31 | 10G |
| 4 | BLR-FIAB-02 | Te1/1/4 | 10.251.3.8/31 | BLR-ED-02 | Te1/1/2 | 10.251.3.9/31 | 10G |
| ... | ... | ... | ... | ... | ... | ... | ... |

---

## 4.5.4 Management Network Addressing (10.252.0.0/16)

### Management Network Design

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      MANAGEMENT NETWORK DESIGN                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  OUT-OF-BAND MANAGEMENT:                                                    │
│  ───────────────────────                                                    │
│  • Dedicated management VLAN (VLAN 999)                                    │
│  • Separate physical/logical path from production                          │
│  • Jump servers for secure access                                          │
│  • TACACS+ authentication via ISE                                          │
│                                                                             │
│  MANAGEMENT SERVICES:                                                       │
│  ────────────────────                                                       │
│  • DNAC Cluster: 10.252.10.0/24                                            │
│  • ISE Cluster: 10.252.30.0/24                                             │
│  • WLC Management: 10.252.40.0/24                                          │
│  • Network Devices: 10.252.{site}.0/24                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Management IP Allocation by Site

| Site | VLAN | Subnet | Gateway | DHCP Range | Reserved |
|------|------|--------|---------|------------|----------|
| **Infrastructure** |
| DNAC Cluster | 10 | 10.252.10.0/24 | 10.252.10.1 | N/A | .10-.15 (nodes) |
| ISE PAN | 30 | 10.252.30.0/24 | 10.252.30.1 | N/A | .10-.15 (PAN) |
| ISE PSN | 31 | 10.252.31.0/24 | 10.252.31.1 | N/A | .10-.50 (PSN) |
| WLC | 40 | 10.252.40.0/24 | 10.252.40.1 | N/A | .10-.30 (WLC) |
| **Hub Sites** |
| Mumbai | 100 | 10.252.100.0/24 | 10.252.100.1 | .100-.200 | .1-.99 |
| Chennai | 101 | 10.252.101.0/24 | 10.252.101.1 | .100-.200 | .1-.99 |
| London | 116 | 10.252.116.0/24 | 10.252.116.1 | .100-.200 | .1-.99 |
| Frankfurt | 117 | 10.252.117.0/24 | 10.252.117.1 | .100-.200 | .1-.99 |
| New Jersey | 132 | 10.252.132.0/24 | 10.252.132.1 | .100-.200 | .1-.99 |
| Dallas | 133 | 10.252.133.0/24 | 10.252.133.1 | .100-.200 | .1-.99 |
| **Branch Sites** |
| Bangalore | 103 | 10.252.103.0/24 | 10.252.103.1 | .50-.100 | .1-.49 |
| Delhi | 104 | 10.252.104.0/24 | 10.252.104.1 | .50-.100 | .1-.49 |
| Noida | 105 | 10.252.105.0/24 | 10.252.105.1 | .50-.100 | .1-.49 |

### Device Management IP Assignments - All Hub Sites

**Mumbai (Site 100)**

| Hostname | Role | Management IP | Management VLAN |
|----------|------|---------------|-----------------|
| MUM-BN-01 | Border Node | 10.252.100.11 | 100 |
| MUM-BN-02 | Border Node | 10.252.100.12 | 100 |
| MUM-CP-01 | Control Plane | 10.252.100.13 | 100 |
| MUM-CP-02 | Control Plane | 10.252.100.14 | 100 |
| MUM-ED-01 | Edge Node | 10.252.100.21 | 100 |
| MUM-ED-02 | Edge Node | 10.252.100.22 | 100 |
| MUM-ED-03 | Edge Node | 10.252.100.23 | 100 |
| MUM-ED-04 | Edge Node | 10.252.100.24 | 100 |
| ... | ... | ... | ... |
| MUM-ED-48 | Edge Node | 10.252.100.68 | 100 |
| MUM-WLC-01 | WLC | 10.252.40.11 | 40 |
| MUM-WLC-02 | WLC | 10.252.40.12 | 40 |

**Chennai (Site 101)**

| Hostname | Role | Management IP | Management VLAN |
|----------|------|---------------|-----------------|
| CHN-BN-01 | Border Node | 10.252.101.11 | 101 |
| CHN-BN-02 | Border Node | 10.252.101.12 | 101 |
| CHN-CP-01 | Control Plane | 10.252.101.13 | 101 |
| CHN-CP-02 | Control Plane | 10.252.101.14 | 101 |
| CHN-ED-01 | Edge Node | 10.252.101.21 | 101 |
| ... | ... | ... | ... |

**London (Site 116)**

| Hostname | Role | Management IP | Management VLAN |
|----------|------|---------------|-----------------|
| LON-BN-01 | Border Node | 10.252.116.11 | 116 |
| LON-BN-02 | Border Node | 10.252.116.12 | 116 |
| LON-CP-01 | Control Plane | 10.252.116.13 | 116 |
| LON-CP-02 | Control Plane | 10.252.116.14 | 116 |
| LON-ED-01 | Edge Node | 10.252.116.21 | 116 |
| ... | ... | ... | ... |

**New Jersey (Site 132)**

| Hostname | Role | Management IP | Management VLAN |
|----------|------|---------------|-----------------|
| NJ-BN-01 | Border Node | 10.252.132.11 | 132 |
| NJ-BN-02 | Border Node | 10.252.132.12 | 132 |
| NJ-CP-01 | Control Plane | 10.252.132.13 | 132 |
| NJ-CP-02 | Control Plane | 10.252.132.14 | 132 |
| NJ-ED-01 | Edge Node | 10.252.132.21 | 132 |
| ... | ... | ... | ... |

---

## 4.5.5 IS-IS Configuration

### IS-IS NET Address Scheme

**NET Format**: `49.{area}.{system-id}.00`

- Area ID: 0001 (single area for simplicity)
- System ID: Derived from Loopback IP (e.g., 10.250.1.1 → 0102.5000.1001)

**System ID Derivation**:
```
IP Address: 10.250.1.1
Padded:     010.250.001.001
System ID:  0102.5000.1001
Full NET:   49.0001.0102.5000.1001.00
```

### Complete IS-IS NET Assignments - All Sites

**Mumbai**

| Device | Loopback | System ID | NET |
|--------|----------|-----------|-----|
| MUM-BN-01 | 10.250.1.1 | 0102.5000.1001 | 49.0001.0102.5000.1001.00 |
| MUM-BN-02 | 10.250.1.2 | 0102.5000.1002 | 49.0001.0102.5000.1002.00 |
| MUM-CP-01 | 10.250.1.3 | 0102.5000.1003 | 49.0001.0102.5000.1003.00 |
| MUM-CP-02 | 10.250.1.4 | 0102.5000.1004 | 49.0001.0102.5000.1004.00 |
| MUM-ED-01 | 10.250.1.5 | 0102.5000.1005 | 49.0001.0102.5000.1005.00 |
| MUM-ED-02 | 10.250.1.6 | 0102.5000.1006 | 49.0001.0102.5000.1006.00 |

**Chennai**

| Device | Loopback | System ID | NET |
|--------|----------|-----------|-----|
| CHN-BN-01 | 10.250.2.1 | 0102.5000.2001 | 49.0001.0102.5000.2001.00 |
| CHN-BN-02 | 10.250.2.2 | 0102.5000.2002 | 49.0001.0102.5000.2002.00 |
| CHN-CP-01 | 10.250.2.3 | 0102.5000.2003 | 49.0001.0102.5000.2003.00 |
| CHN-CP-02 | 10.250.2.4 | 0102.5000.2004 | 49.0001.0102.5000.2004.00 |

**London**

| Device | Loopback | System ID | NET |
|--------|----------|-----------|-----|
| LON-BN-01 | 10.250.16.1 | 0102.5001.6001 | 49.0001.0102.5001.6001.00 |
| LON-BN-02 | 10.250.16.2 | 0102.5001.6002 | 49.0001.0102.5001.6002.00 |
| LON-CP-01 | 10.250.16.3 | 0102.5001.6003 | 49.0001.0102.5001.6003.00 |
| LON-CP-02 | 10.250.16.4 | 0102.5001.6004 | 49.0001.0102.5001.6004.00 |

**New Jersey**

| Device | Loopback | System ID | NET |
|--------|----------|-----------|-----|
| NJ-BN-01 | 10.250.32.1 | 0102.5003.2001 | 49.0001.0102.5003.2001.00 |
| NJ-BN-02 | 10.250.32.2 | 0102.5003.2002 | 49.0001.0102.5003.2002.00 |
| NJ-CP-01 | 10.250.32.3 | 0102.5003.2003 | 49.0001.0102.5003.2003.00 |
| NJ-CP-02 | 10.250.32.4 | 0102.5003.2004 | 49.0001.0102.5003.2004.00 |

**Bangalore (Branch)**

| Device | Loopback | System ID | NET |
|--------|----------|-----------|-----|
| BLR-FIAB-01 | 10.250.3.1 | 0102.5000.3001 | 49.0001.0102.5000.3001.00 |
| BLR-FIAB-02 | 10.250.3.2 | 0102.5000.3002 | 49.0001.0102.5000.3002.00 |
| BLR-ED-01 | 10.250.3.3 | 0102.5000.3003 | 49.0001.0102.5000.3003.00 |

---

## 4.5.6 Complete Node Configurations

### Global Configuration Template (All Nodes)

```cisco
! ============================================================================
! GLOBAL CONFIGURATION - ALL FABRIC NODES
! ============================================================================

! Hostname (set per device)
hostname {SITE}-{ROLE}-{NUMBER}

! Enable secret
enable secret 9 $9$xxxx

! Service configuration
service timestamps debug datetime msec localtime show-timezone
service timestamps log datetime msec localtime show-timezone
service password-encryption
service sequence-numbers
no service pad
no service config

! Logging configuration
logging buffered 65536 informational
logging console critical
logging monitor warnings
logging trap informational
logging source-interface Loopback0
logging host 10.252.10.30 transport udp port 514

! NTP configuration
ntp server 10.252.10.20 prefer
ntp server 10.252.10.21
ntp source Loopback0

! DNS configuration
ip domain-name corp.local
ip name-server 10.252.10.25
ip name-server 10.252.10.26

! AAA configuration
aaa new-model
aaa authentication login default group tacacs+ local
aaa authentication enable default group tacacs+ enable
aaa authorization console
aaa authorization exec default group tacacs+ local if-authenticated
aaa authorization commands 15 default group tacacs+ local if-authenticated
aaa accounting exec default start-stop group tacacs+
aaa accounting commands 15 default start-stop group tacacs+

tacacs server ISE-TACACS-1
 address ipv4 10.252.30.10
 key 7 xxxxxx
 timeout 5
tacacs server ISE-TACACS-2
 address ipv4 10.252.30.11
 key 7 xxxxxx
 timeout 5

aaa group server tacacs+ ISE-TACACS
 server name ISE-TACACS-1
 server name ISE-TACACS-2

! SNMP configuration
snmp-server community {ro-community} RO
snmp-server community {rw-community} RW
snmp-server location {SITE} - {BUILDING}
snmp-server contact network-operations@corp.local
snmp-server enable traps
snmp-server host 10.252.10.30 version 2c {ro-community}

! VTY configuration
line vty 0 15
 access-class VTY-ACCESS in
 exec-timeout 30 0
 logging synchronous
 transport input ssh
 transport output none

! Console configuration
line con 0
 exec-timeout 15 0
 logging synchronous
 stopbits 1

! SSH configuration
ip ssh version 2
ip ssh time-out 60
ip ssh authentication-retries 3
crypto key generate rsa modulus 4096

! Archive configuration
archive
 path flash:archive
 write-memory

! Access lists
ip access-list standard VTY-ACCESS
 permit 10.252.0.0 0.0.255.255
 permit 10.250.0.0 0.0.255.255
 deny any log

! Banner
banner login ^
*************************************************************
*                    AUTHORIZED ACCESS ONLY                  *
*  Unauthorized access to this device is prohibited.         *
*  All activities are logged and monitored.                  *
*************************************************************
^

! ============================================================================
! MTU CONFIGURATION - CRITICAL FOR VXLAN
! ============================================================================
system mtu 9100
```

### Border Node Complete Configuration

```cisco
! ============================================================================
! BORDER NODE CONFIGURATION
! Example: MUM-BN-01 (C9500-48Y4C)
! ============================================================================

hostname MUM-BN-01

! --- Loopback Interface (RLOC) ---
interface Loopback0
 description FABRIC-RLOC-BORDER
 ip address 10.250.1.1 255.255.255.255
 ip router isis UNDERLAY
 isis circuit-type level-2-only

! --- IS-IS Process Configuration ---
router isis UNDERLAY
 net 49.0001.0102.5000.1001.00
 is-type level-2-only
 metric-style wide
 log-adjacency-changes all
 nsf ietf
 authentication mode md5 level-2
 authentication key-chain ISIS-KEY level-2
 passive-interface Loopback0
 !
 address-family ipv4 unicast
  redistribute connected route-map LOOPBACK-REDISTRIBUTE
 exit-address-family

! --- IS-IS Authentication Key Chain ---
key chain ISIS-KEY
 key 1
  key-string 7 {encrypted-key}
  cryptographic-algorithm hmac-sha-256
  send-lifetime 00:00:00 Jan 1 2025 infinite
  accept-lifetime 00:00:00 Jan 1 2025 infinite

! --- Route Map for Loopback Redistribution ---
route-map LOOPBACK-REDISTRIBUTE permit 10
 match interface Loopback0
!
route-map LOOPBACK-REDISTRIBUTE deny 20

! --- P2P Link to Border-2 ---
interface TenGigabitEthernet1/0/1
 description P2P-TO-MUM-BN-02
 no switchport
 mtu 9100
 ip address 10.251.1.0 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3
 no shutdown

! --- P2P Link to CP-1 ---
interface TenGigabitEthernet1/0/2
 description P2P-TO-MUM-CP-01
 no switchport
 mtu 9100
 ip address 10.251.1.2 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3
 no shutdown

! --- P2P Link to CP-2 ---
interface TenGigabitEthernet1/0/3
 description P2P-TO-MUM-CP-02
 no switchport
 mtu 9100
 ip address 10.251.1.4 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3
 no shutdown

! --- Management Interface ---
interface Vlan999
 description MANAGEMENT
 ip address 10.252.100.11 255.255.255.0
 no shutdown

interface TenGigabitEthernet1/0/47
 description MGMT-UPLINK
 switchport access vlan 999
 switchport mode access
 spanning-tree portfast

! --- QoS for Underlay ---
class-map match-any UNDERLAY-CONTROL
 match protocol isis
 match protocol bfd

policy-map UNDERLAY-EGRESS
 class UNDERLAY-CONTROL
  set dscp cs6
 class class-default
  set dscp default

interface range TenGigabitEthernet1/0/1-3
 service-policy output UNDERLAY-EGRESS

! --- BFD Global Configuration ---
bfd slow-timers 12000

! --- IP Routing ---
ip routing
ip multicast-routing

! --- Static Routes for Management ---
ip route 0.0.0.0 0.0.0.0 10.252.100.1 name MGMT-DEFAULT

! --- Save Configuration ---
end
write memory
```

### Control Plane Node Complete Configuration

```cisco
! ============================================================================
! CONTROL PLANE NODE CONFIGURATION
! Example: MUM-CP-01 (C9500-24Y4C)
! ============================================================================

hostname MUM-CP-01

! --- Loopback Interface (RLOC) ---
interface Loopback0
 description FABRIC-RLOC-CP
 ip address 10.250.1.3 255.255.255.255
 ip router isis UNDERLAY
 isis circuit-type level-2-only

! --- IS-IS Process Configuration ---
router isis UNDERLAY
 net 49.0001.0102.5000.1003.00
 is-type level-2-only
 metric-style wide
 log-adjacency-changes all
 nsf ietf
 authentication mode md5 level-2
 authentication key-chain ISIS-KEY level-2
 passive-interface Loopback0
 !
 address-family ipv4 unicast
  redistribute connected route-map LOOPBACK-REDISTRIBUTE
 exit-address-family

! --- IS-IS Authentication Key Chain ---
key chain ISIS-KEY
 key 1
  key-string 7 {encrypted-key}
  cryptographic-algorithm hmac-sha-256

! --- Route Map for Loopback Redistribution ---
route-map LOOPBACK-REDISTRIBUTE permit 10
 match interface Loopback0

! --- P2P Link to Border-1 ---
interface TenGigabitEthernet1/0/1
 description P2P-TO-MUM-BN-01
 no switchport
 mtu 9100
 ip address 10.251.1.3 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3
 no shutdown

! --- P2P Link to Border-2 ---
interface TenGigabitEthernet1/0/2
 description P2P-TO-MUM-BN-02
 no switchport
 mtu 9100
 ip address 10.251.1.7 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3
 no shutdown

! --- P2P Link to CP-2 ---
interface TenGigabitEthernet1/0/3
 description P2P-TO-MUM-CP-02
 no switchport
 mtu 9100
 ip address 10.251.1.10 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3
 no shutdown

! --- P2P Links to Edge Nodes ---
interface TenGigabitEthernet1/0/4
 description P2P-TO-MUM-ED-01
 no switchport
 mtu 9100
 ip address 10.251.1.12 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3
 no shutdown

interface TenGigabitEthernet1/0/5
 description P2P-TO-MUM-ED-02
 no switchport
 mtu 9100
 ip address 10.251.1.16 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3
 no shutdown

interface TenGigabitEthernet1/0/6
 description P2P-TO-MUM-ED-03
 no switchport
 mtu 9100
 ip address 10.251.1.20 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3
 no shutdown

! Continue for all edge nodes...

! --- Management Interface ---
interface Vlan999
 description MANAGEMENT
 ip address 10.252.100.13 255.255.255.0
 no shutdown

! --- IP Routing ---
ip routing

! --- Static Routes for Management ---
ip route 0.0.0.0 0.0.0.0 10.252.100.1 name MGMT-DEFAULT
```

### Edge Node Complete Configuration

```cisco
! ============================================================================
! EDGE NODE CONFIGURATION
! Example: MUM-ED-01 (C9300-48UXM)
! ============================================================================

hostname MUM-ED-01

! --- Loopback Interface (RLOC) ---
interface Loopback0
 description FABRIC-RLOC-EDGE
 ip address 10.250.1.5 255.255.255.255
 ip router isis UNDERLAY
 isis circuit-type level-2-only

! --- IS-IS Process Configuration ---
router isis UNDERLAY
 net 49.0001.0102.5000.1005.00
 is-type level-2-only
 metric-style wide
 log-adjacency-changes all
 nsf ietf
 authentication mode md5 level-2
 authentication key-chain ISIS-KEY level-2
 passive-interface Loopback0
 !
 address-family ipv4 unicast
  redistribute connected route-map LOOPBACK-REDISTRIBUTE
 exit-address-family

! --- IS-IS Authentication Key Chain ---
key chain ISIS-KEY
 key 1
  key-string 7 {encrypted-key}
  cryptographic-algorithm hmac-sha-256

! --- Uplink to CP-1 (10G SFP+) ---
interface TenGigabitEthernet1/1/1
 description UPLINK-TO-MUM-CP-01
 no switchport
 mtu 9100
 ip address 10.251.1.13 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3
 no shutdown

! --- Uplink to CP-2 (10G SFP+) ---
interface TenGigabitEthernet1/1/2
 description UPLINK-TO-MUM-CP-02
 no switchport
 mtu 9100
 ip address 10.251.1.15 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3
 no shutdown

! --- Management Interface ---
interface Vlan999
 description MANAGEMENT
 ip address 10.252.100.21 255.255.255.0
 no shutdown

interface GigabitEthernet1/0/48
 description MGMT-UPLINK
 switchport access vlan 999
 switchport mode access
 spanning-tree portfast

! --- Host-Facing Ports (Pre-configuration) ---
! These will be configured by DNAC for 802.1X/MAB
interface range GigabitEthernet1/0/1-44
 description USER-ACCESS-PORT
 switchport mode access
 switchport access vlan 1
 spanning-tree portfast
 spanning-tree bpduguard enable
 shutdown

! --- AP Ports ---
interface range GigabitEthernet1/0/45-47
 description AP-PORT
 switchport mode trunk
 spanning-tree portfast trunk
 shutdown

! --- IP Routing ---
ip routing

! --- Static Routes for Management ---
ip route 0.0.0.0 0.0.0.0 10.252.100.1 name MGMT-DEFAULT
```

### Branch Fabric-in-a-Box Configuration

```cisco
! ============================================================================
! FABRIC-IN-A-BOX CONFIGURATION
! Example: BLR-FIAB-01 (C9300-48UXM)
! ============================================================================

hostname BLR-FIAB-01

! --- Loopback Interface (RLOC) ---
interface Loopback0
 description FABRIC-RLOC-FIAB
 ip address 10.250.3.1 255.255.255.255
 ip router isis UNDERLAY
 isis circuit-type level-2-only

! --- IS-IS Process Configuration ---
router isis UNDERLAY
 net 49.0001.0102.5000.3001.00
 is-type level-2-only
 metric-style wide
 log-adjacency-changes all
 nsf ietf
 authentication mode md5 level-2
 authentication key-chain ISIS-KEY level-2
 passive-interface Loopback0
 !
 address-family ipv4 unicast
  redistribute connected route-map LOOPBACK-REDISTRIBUTE
 exit-address-family

! --- StackWise Virtual Link to FiaB-2 ---
interface TenGigabitEthernet1/1/1
 description SVL-TO-BLR-FIAB-02
 no switchport
 mtu 9100
 ip address 10.251.3.0 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3
 no shutdown

! --- Downlinks to Edge Nodes ---
interface TenGigabitEthernet1/1/3
 description DOWNLINK-TO-BLR-ED-01
 no switchport
 mtu 9100
 ip address 10.251.3.4 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3
 no shutdown

interface TenGigabitEthernet1/1/4
 description DOWNLINK-TO-BLR-ED-02
 no switchport
 mtu 9100
 ip address 10.251.3.6 255.255.255.254
 ip router isis UNDERLAY
 isis circuit-type level-2-only
 isis network point-to-point
 isis authentication mode md5
 isis authentication key-chain ISIS-KEY
 bfd interval 100 min_rx 100 multiplier 3
 no shutdown

! --- SD-WAN Handoff Interface ---
interface TenGigabitEthernet1/1/8
 description TO-BLR-SDWAN-01
 switchport mode trunk
 switchport trunk allowed vlan 3001-3005
 no shutdown

! --- Management Interface ---
interface Vlan999
 description MANAGEMENT
 ip address 10.252.103.11 255.255.255.0
 no shutdown

! --- IP Routing ---
ip routing

! --- Default Route via SD-WAN ---
ip route 0.0.0.0 0.0.0.0 10.252.103.1 name MGMT-DEFAULT
```

---

## 4.5.7 Pre-Provisioning Checklist

### Physical Layer Verification

| Check | Command/Action | Expected Result |
|-------|----------------|-----------------|
| Cable labeling | Visual inspection | All cables labeled per standard |
| Cable certification | Cat6a/OM4 test report | Pass for all fabric links |
| SFP+ compatibility | `show inventory` | Cisco-branded or validated |
| Port LED status | Visual inspection | Link lights on for connected ports |
| Power redundancy | `show environment power` | Dual PSU, both OK |
| Rack elevation | Documentation review | Matches rack diagram |

### Pre-Staging Verification

```bash
# Device Pre-Staging Checklist Script
# Run on each device before fabric provisioning

echo "=== PRE-STAGING VERIFICATION ==="

echo "1. Software Version Check"
show version | include Software

echo "2. Hardware Inventory"
show inventory

echo "3. Memory Status"
show processes memory sorted | head 10

echo "4. Flash Space"
show flash:

echo "5. Management Connectivity"
ping 10.252.10.10    ! DNAC
ping 10.252.30.10    ! ISE

echo "6. NTP Status"
show ntp status

echo "7. AAA Status"
test aaa group tacacs+ admin {password} legacy

echo "8. Interface Status"
show ip interface brief

echo "9. Neighbor Discovery"
show cdp neighbors

echo "10. Pre-existing Config (should be minimal)"
show running-config | include ^interface|^router|^vlan
```

---

## 4.5.8 Comprehensive Underlay Validation

### IS-IS Validation Commands

```cisco
! ============================================================================
! IS-IS VALIDATION SUITE
! ============================================================================

! --- Verify IS-IS Process ---
show isis neighbors
! Expected: All connected neighbors UP, L2 adjacency

! Example output:
! System Id      Type Interface         IP Address      State Holdtime Circuit Id
! MUM-BN-02      L2   Te1/0/1           10.251.1.1      UP    27       MUM-BN-01.01
! MUM-CP-01      L2   Te1/0/2           10.251.1.3      UP    28       MUM-BN-01.02
! MUM-CP-02      L2   Te1/0/3           10.251.1.5      UP    26       MUM-BN-01.03

! --- Verify IS-IS Database ---
show isis database detail
! Expected: All fabric nodes present in database

! --- Verify IS-IS Routes ---
show ip route isis
! Expected: All loopback /32 routes present

! Example output:
! i L2     10.250.1.2/32 [115/20] via 10.251.1.1, Te1/0/1
! i L2     10.250.1.3/32 [115/20] via 10.251.1.3, Te1/0/2
! i L2     10.250.1.4/32 [115/20] via 10.251.1.5, Te1/0/3
! i L2     10.250.1.5/32 [115/30] via 10.251.1.3, Te1/0/2

! --- Verify Metrics ---
show isis rib
! Check for consistent metrics

! --- Verify Authentication ---
show isis neighbors detail | include Auth
! Expected: Authentication successful on all adjacencies
```

### BFD Validation Commands

```cisco
! ============================================================================
! BFD VALIDATION SUITE
! ============================================================================

! --- Verify BFD Sessions ---
show bfd neighbors
! Expected: All sessions UP

! Example output:
! IPv4 Sessions
! NeighAddr           LD/RD   RH/RS   State     Int
! 10.251.1.1          1/1     Up      Up        Te1/0/1
! 10.251.1.3          2/2     Up      Up        Te1/0/2
! 10.251.1.5          3/3     Up      Up        Te1/0/3

! --- Verify BFD Details ---
show bfd neighbors detail
! Check interval, multiplier, echo mode

! --- Verify BFD Statistics ---
show bfd neighbors counters
! Check for any packet drops
```

### Connectivity Validation Scripts

```cisco
! ============================================================================
! CONNECTIVITY VALIDATION - RUN FROM EACH NODE
! ============================================================================

! --- Loopback Ping Test (Mumbai) ---
! From MUM-BN-01:
ping 10.250.1.2 source 10.250.1.1    ! BN-02
ping 10.250.1.3 source 10.250.1.1    ! CP-01
ping 10.250.1.4 source 10.250.1.1    ! CP-02
ping 10.250.1.5 source 10.250.1.1    ! ED-01
ping 10.250.1.6 source 10.250.1.1    ! ED-02
! ... continue for all nodes

! --- MTU Verification (CRITICAL) ---
! Test with large packets to ensure VXLAN will work
ping 10.250.1.2 source 10.250.1.1 size 8972 df-bit
! Expected: Success (8972 + 28 IP/ICMP = 9000 < 9100 MTU)

ping 10.250.1.2 source 10.250.1.1 size 9072 df-bit
! Expected: Fail if MTU is exactly 9100

! --- Traceroute Verification ---
traceroute 10.250.1.5 source 10.250.1.1
! Verify expected path through fabric

! --- End-to-End Latency ---
ping 10.250.1.5 source 10.250.1.1 repeat 1000
! Check for <1ms latency within site
```

---

## 4.5.9 Troubleshooting Common Issues

### Issue 1: IS-IS Adjacency Not Forming

```cisco
! Diagnostic commands
show isis neighbors
show isis interface
show isis adjacency-log
debug isis adj-packets

! Common causes and fixes:
! 1. MTU mismatch - Verify MTU on both ends
show interface Te1/0/1 | include MTU

! 2. Authentication mismatch
show isis neighbors detail | include Auth
show key chain

! 3. Level mismatch (should be L2-only)
show running-config | include isis.*level

! 4. Network type mismatch
show running-config interface Te1/0/1 | include network
```

### Issue 2: BFD Session Flapping

```cisco
! Diagnostic commands
show bfd neighbors detail
show bfd neighbors counters
show logging | include BFD

! Common causes and fixes:
! 1. Aggressive timers with CPU issues
show processes cpu history
! Consider relaxing BFD timers if CPU is high

! 2. Optical/cable issues
show interface Te1/0/1 | include errors|CRC

! 3. Micro-bursts causing drops
show interface Te1/0/1 | include output drops
```

### Issue 3: Incomplete Route Table

```cisco
! Diagnostic commands
show ip route isis
show isis database detail
show isis topology

! Common causes and fixes:
! 1. Route redistribution not configured
show running-config | include redistribute

! 2. Prefix filtering
show running-config | include route-map|prefix-list

! 3. Network partitioned
show isis neighbors
show isis database | include Number
```

---

## 4.5.10 Summary and Sign-Off

### Underlay Provisioning Checklist

| Phase | Task | Completed | Verified By | Date |
|-------|------|-----------|-------------|------|
| **Pre-Staging** |
| | Cable installation complete | ☐ | | |
| | All devices racked and powered | ☐ | | |
| | Base IOS installed | ☐ | | |
| | Management IP configured | ☐ | | |
| | AAA/NTP/DNS configured | ☐ | | |
| **IS-IS Configuration** |
| | Loopbacks configured | ☐ | | |
| | IS-IS process configured | ☐ | | |
| | P2P links configured | ☐ | | |
| | Authentication enabled | ☐ | | |
| | BFD enabled | ☐ | | |
| **Validation** |
| | All IS-IS adjacencies UP | ☐ | | |
| | All BFD sessions UP | ☐ | | |
| | Full loopback reachability | ☐ | | |
| | MTU test passed (9000+ bytes) | ☐ | | |
| | Convergence test passed (<2s) | ☐ | | |
| **Documentation** |
| | IP allocation spreadsheet updated | ☐ | | |
| | Topology diagrams updated | ☐ | | |
| | Configuration backed up | ☐ | | |

### Approval Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Network Engineer | | | |
| Network Architect | | | |
| Project Manager | | | |

---
