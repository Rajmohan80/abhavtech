# 1.4 Network Assessment Details

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
