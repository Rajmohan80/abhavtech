# 2.5 Underlay Network Design

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
