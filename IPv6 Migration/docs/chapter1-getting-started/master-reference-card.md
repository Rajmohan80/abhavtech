# ABHAVTECH IPv6 MIGRATION MASTER REFERENCE CARD
## ABV-IPV6-2025 | Version 1.0

**Organization:** Abhavtech  
**Date:** January 2025  
**Scope:** Enterprise-wide IPv6 dual-stack migration  
**Infrastructure:** 19 sites | SD-WAN | SD-Access | Multi-cloud (GCP/Azure) | 15,000+ endpoints  

---

## EXECUTIVE SUMMARY

### Business Drivers for IPv6

| Driver | Impact | Priority |
|--------|--------|----------|
| **IPv4 Exhaustion** | Running out of RFC1918 space across 19 sites + multi-cloud | HIGH |
| **Cloud-Native Apps** | GCP Vertex AI, Azure services prefer IPv6, better performance | HIGH |
| **Compliance** | Government mandates (US federal = IPv6 by 2025), future-proofing | MEDIUM |
| **IoT Scale** | 5,000+ IoT devices projected (2026-2028), IPv4 NAT becomes bottleneck | HIGH |
| **Carrier Requirements** | 5G/LTE private network requires IPv6 for carrier-grade NAT avoidance | MEDIUM |
| **Operational Efficiency** | Eliminate NAT complexity, simplified routing, better end-to-end visibility | MEDIUM |

### Strategic Decision: Dual-Stack (Not IPv6-Only)

```
MIGRATION APPROACH:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  ✅ DUAL-STACK MIGRATION (IPv4 + IPv6 running concurrently)      │
│     - Zero disruption to existing IPv4 services                   │
│     - IPv6 added incrementally per site/service                   │
│     - IPv4 remains operational indefinitely (5-10 year horizon)   │
│                                                                    │
│  ❌ NOT IPv6-Only Migration (too risky for production)            │
│     - Many vendor tools still IPv4-dependent (some NMS, security) │
│     - Third-party SaaS apps may not support IPv6                  │
│     - Business continuity risk unacceptable                       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### High-Level Timeline

| Phase | Duration | Focus | Status |
|-------|----------|-------|--------|
| **Phase 0** | Weeks 1-4 | Planning, addressing design, tooling prep | ⬅ THIS DOCUMENT |
| **Phase 1** | Weeks 5-12 | SD-WAN underlay IPv6, management plane | Q1 2025 |
| **Phase 2** | Weeks 13-20 | SD-Access IPv6 (1 pilot site → full rollout) | Q2 2025 |
| **Phase 3** | Weeks 21-28 | Cloud IPv6 (GCP, Azure), SaaS, Webex | Q2-Q3 2025 |
| **Phase 4** | Weeks 29-36 | Monitoring/observability IPv6, full validation | Q3 2025 |
| **Phase 5** | Weeks 37-44 | Optimization, documentation, training | Q4 2025 |

**Total Duration:** 44 weeks (11 months) from kickoff to production-ready dual-stack

---

## CURRENT IPv4 INFRASTRUCTURE BASELINE

### IPv4 Address Allocation Summary

```
CURRENT IPv4 SCHEME (RFC1918):
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  MANAGEMENT:           10.252.0.0/16                              │
│    ├─ DNAC:            10.252.10.0/24 (NJ), 10.252.20.0/24 (LON)  │
│    ├─ ISE PSN:         10.252.31.0/24                             │
│    ├─ vManage/vSmart:  10.252.31.10-13                            │
│    ├─ ThousandEyes:    10.252.60.0/24                             │
│    └─ Splunk:          10.252.31.50                               │
│                                                                    │
│  SD-ACCESS OVERLAY (Virtual Networks):                            │
│    ├─ VN_CORPORATE:    10.100.0.0/16 (primary), 10.101.0.0/16 (EMEA) │
│    ├─ VN_GUEST:        10.200.0.0/16                              │
│    ├─ VN_IOT:          10.150.0.0/16                              │
│    ├─ VN_SERVERS:      10.180.0.0/16                              │
│    └─ VN_VOICE:        10.190.0.0/16                              │
│                                                                    │
│  SD-WAN UNDERLAY:                                                  │
│    ├─ Loopbacks:       10.250.0.0/16 (RLOCs for LISP/VXLAN)       │
│    └─ P2P Links:       10.251.0.0/16 (/31 subnets)                │
│                                                                    │
│  BRANCH SITES (SD-WAN VPN 1):                                      │
│    └─ 192.168.50-62.0/24 (13 branch LANs)                         │
│                                                                    │
│  CLOUD:                                                            │
│    ├─ Azure VNets:     10.100.0.0/16 (India), 10.101.0.0/16 (US)  │
│    ├─ GCP VPC:         10.128.0.0/9 (GCP auto-mode VPC)           │
│    └─ ExpressRoute:    169.254.200-202.x (eBGP peering IPs)       │
│                                                                    │
│  TOTAL IPv4 CONSUMPTION: ~1.5 million addresses allocated          │
│  (Note: Most unused, but allocated = future expansion constrained) │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## IPv6 ADDRESSING STRATEGY

### Global Design Principles

```
IPv6 ADDRESSING PHILOSOPHY:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  1. PROVIDER-INDEPENDENT (PI) SPACE:                              │
│     Obtain /32 from ARIN (e.g., 2001:db8:abcd::/48 — example)     │
│     Advantage: Portable across ISPs, no renumbering               │
│                                                                    │
│  2. HIERARCHICAL ALLOCATION:                                       │
│     /32 (Global) → /40 (Region) → /48 (Site) → /56 (Building)     │
│     → /64 (VLAN/Subnet)                                            │
│                                                                    │
│  3. GLOBAL UNICAST (GUA) vs UNIQUE LOCAL (ULA):                   │
│     ├─ GUA (2001:db8::/32): Internet-routable, cloud peering      │
│     └─ ULA (fd00:abcd::/48): Internal-only, never advertised      │
│                                                                    │
│  4. ADDRESSING FORMAT (GUA):                                       │
│     2001:0db8:RRRR:SSSS:VVVV:FFFF::/64                            │
│       │    │    │    │    │    │                                  │
│       │    │    │    │    │    └─ Subnet (VLAN ID, VNI, etc.)    │
│       │    │    │    │    └────── Function (MGMT/DATA/VOICE)     │
│       │    │    │    └─────────── Site (1-63 for 19 sites + growth) │
│       │    │    └──────────────── Region (1=APAC, 2=EMEA, 3=AMER) │
│       │    └───────────────────── Abhavtech OUI                   │
│       └────────────────────────── Global prefix                   │
│                                                                    │
│  5. EUI-64 vs MANUAL ADDRESSING:                                   │
│     ├─ Servers/Infra: Static manual (::1, ::10, ::100, etc.)      │
│     ├─ Endpoints: SLAAC with privacy extensions                   │
│     └─ IoT: DHCPv6 with reservations (tracking requirement)       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Abhavtech IPv6 Allocation Plan

**Assumption:** ARIN assigns `2001:db8:abc0::/44` (example — replace with actual)

```
IPv6 REGIONAL ALLOCATION:
┌───────────────────────────────────────────────────────────────────────┐
│ Region    │ Prefix             │ Sites                  │ /48 Blocks │
├───────────────────────────────────────────────────────────────────────┤
│ APAC      │ 2001:db8:abc1::/48 │ Mumbai, Chennai + 11   │ 16 sites   │
│ EMEA      │ 2001:db8:abc2::/48 │ London, Frankfurt      │ 2 sites    │
│ Americas  │ 2001:db8:abc3::/48 │ NJ, Dallas + 1 Chicago │ 3 sites    │
│ Cloud     │ 2001:db8:abc4::/48 │ GCP, Azure, Webex      │ Reserved   │
│ IoT/Edge  │ 2001:db8:abc5::/48 │ Future 5G/LTE IoT      │ Reserved   │
│ Reserved  │ 2001:db8:abc6-f::/48 │ Future expansion     │ 10 blocks  │
└───────────────────────────────────────────────────────────────────────┘
```

### Per-Site Allocation (Example: Mumbai Hub)

```
MUMBAI HUB: 2001:db8:abc1:0001::/48
┌──────────────────────────────────────────────────────────────────────┐
│ Function       │ Prefix                        │ Purpose            │
├──────────────────────────────────────────────────────────────────────┤
│ UNDERLAY       │ 2001:db8:abc1:1::/56          │ Loopbacks, P2P     │
│   Loopbacks    │ 2001:db8:abc1:1:0::/64        │ IS-IS RLOCs        │
│   P2P Links    │ 2001:db8:abc1:1:1::/64        │ /127 subnets       │
│                                                                       │
│ MANAGEMENT     │ 2001:db8:abc1:1:100::/56      │ OOB, services      │
│   Device Mgmt  │ 2001:db8:abc1:1:100::/64      │ Switch/router mgmt │
│   Monitoring   │ 2001:db8:abc1:1:101::/64      │ TE, Splunk agents  │
│                                                                       │
│ OVERLAY (VNs)  │ 2001:db8:abc1:1:1000-5000::/56│ Per VN             │
│   VN_CORPORATE │ 2001:db8:abc1:1:1000::/56     │ 256 /64 subnets    │
│     Floor 1    │ 2001:db8:abc1:1:1001::/64     │ Data VLAN 1011     │
│     Floor 2    │ 2001:db8:abc1:1:1002::/64     │ Data VLAN 1012     │
│     Floor N    │ 2001:db8:abc1:1:100N::/64     │ ...                │
│   VN_GUEST     │ 2001:db8:abc1:1:2000::/56     │ Guest VLANs        │
│   VN_IOT       │ 2001:db8:abc1:1:3000::/56     │ IoT VLANs          │
│   VN_SERVERS   │ 2001:db8:abc1:1:4000::/56     │ DC VLANs           │
│   VN_VOICE     │ 2001:db8:abc1:1:5000::/56     │ Voice VLANs        │
│                                                                       │
│ SD-WAN VPNs    │ 2001:db8:abc1:1:8000::/56     │ SD-WAN service VPNs│
│   VPN 0        │ 2001:db8:abc1:1:8000::/64     │ WAN transport      │
│   VPN 1        │ 2001:db8:abc1:1:8001::/64     │ Corporate overlay  │
│   VPN 512      │ 2001:db8:abc1:1:8512::/64     │ OOB management     │
└──────────────────────────────────────────────────────────────────────┘
```

### ULA Allocation (Internal-Only)

```
ULA PREFIX: fd12:3456:7890::/48 (example — generate via RFC4193)
Purpose: Internal services that should NEVER reach internet
  - Test/lab environments
  - Isolated security zones
  - Internal DNS (split-horizon)
  
Not used for production — GUA preferred for simplicity
```

---

## PER-COMPONENT IPv6 MIGRATION

### 1. SD-WAN UNDERLAY (Phase 1 — Weeks 5-12)

**Current IPv4 State:**
- Loopbacks: `10.250.0.0/16` (/32 per device)
- P2P links: `10.251.0.0/16` (/31 per link)
- IS-IS routing underlay

**IPv6 Target State:**
- Loopbacks: `2001:db8:abc1:R:0::N/128` (R=region, N=node)
- P2P links: `2001:db8:abc1:R:1:L::/127` (L=link ID)
- IS-IS dual-stack (IPv4 + IPv6 in same process)

**Migration Steps:**

```
STEP 1: Enable IPv6 on Underlay Interfaces
! On Border Node MUM-BN-01
interface Loopback0
  ip address 10.250.1.1 255.255.255.255
  ipv6 address 2001:db8:abc1:1:0::1/128
  ipv6 enable
  
interface TenGigabitEthernet1/1/1
  description P2P-to-MUM-BN-02
  ip address 10.251.1.0 255.255.255.254
  ipv6 address 2001:db8:abc1:1:1:0::0/127
  ipv6 enable

STEP 2: Enable IS-IS IPv6
router isis UNDERLAY
  net 49.0001.0100.2500.1001.00
  address-family ipv6
    redistribute connected
  exit-address-family

STEP 3: Verify IPv6 Reachability
ping ipv6 2001:db8:abc1:1:0::2
traceroute ipv6 2001:db8:abc1:2:0::1  (London loopback)
show isis neighbors  (should show both IPv4 + IPv6 adjacency)
```

**Validation Criteria:**
- [ ] All 19 sites have IPv6 loopbacks configured
- [ ] IS-IS adjacencies dual-stack (IPv4 + IPv6)
- [ ] IPv6 ping success between all hub sites
- [ ] LISP RLOC registration supports IPv6 (LISP dual-stack)

---

### 2. SD-ACCESS OVERLAY (Phase 2 — Weeks 13-20)

**Current IPv4 State:**
- VN_CORPORATE: `10.100.0.0/16`
- Anycast gateways: `10.100.1.1/24` per floor
- LISP EID-to-RLOC mapping IPv4-only

**IPv6 Target State:**
- VN_CORPORATE: `2001:db8:abc1:1:1000::/56`
- Anycast gateway: `2001:db8:abc1:1:1001::1/64` per floor
- LISP dual-stack (IPv4 + IPv6 EIDs over IPv4/IPv6 RLOCs)

**Migration Steps:**

```
PILOT SITE: Mumbai Floor 1 (VLAN 1011)

STEP 1: Configure IPv6 Pool in DNAC
DNAC → Design → Network Settings → IP Address Pools → Add Pool
  Name: IPv6-MUM-F1-CORPORATE
  Type: Generic
  IPv6 Prefix: 2001:db8:abc1:1:1001::/64
  Gateway: 2001:db8:abc1:1:1001::1
  DHCPv6: Stateless (SLAAC with RA)
  DNS: 2001:db8:abc1:1:100::10 (IPv6 DNS server)

STEP 2: Edge Node SVI Configuration (Auto-generated by DNAC)
interface Vlan1011
  vrf forwarding VN_CORPORATE
  ip address 10.100.1.1 255.255.255.0
  ipv6 address 2001:db8:abc1:1:1001::1/64
  ipv6 enable
  ipv6 nd managed-config-flag
  ipv6 nd other-config-flag
  ipv6 dhcp server DHCPV6-POOL-CORPORATE
  mac-address 0000.0c9f.f001  (anycast MAC — same for IPv4 + IPv6)

STEP 3: LISP IPv6 Instance
router lisp
  instance-id 8001
    service ipv6
      eid-table vrf VN_CORPORATE
      database-mapping 2001:db8:abc1:1:1000::/56 locator-set RLOC-SET
      map-cache 2001:db8:abc1::/44 map-request
      map-server 2001:db8:abc1:1:0::3 key <key>
      map-resolver 2001:db8:abc1:1:0::3
    exit-service-ipv6
    
STEP 4: ISE IPv6 Profiling
ISE → Administration → Network Resources → Network Devices
  Add IPv6 address of edge switch: 2001:db8:abc1:1:0::10
  RADIUS/TACACS shared secret: <same as IPv4>
  
ISE → Policy → Policy Elements → Conditions → Network Conditions
  Add: IPv6 Endpoint Profiling (DHCPv6 option parsing)

STEP 5: Endpoint Testing
Windows 11 PC connects to Floor 1 port:
  > ipconfig /all
  Expected:
    IPv4: 10.100.1.50 (via DHCP)
    IPv6: 2001:db8:abc1:1:1001:a1b2:c3d4:e5f6:7890/64 (SLAAC)
    IPv6 DNS: 2001:db8:abc1:1:100::10
    
  > ping ipv6.google.com
  Expected: Success (dual-stack client prefers IPv6)
  
  > tracert -6 2001:db8:abc2:2:1001::50  (London endpoint)
  Expected: Via LISP fabric (Mumbai edge → CP → London edge)
```

**Rollout Plan:**
- Week 13: Mumbai Floor 1 pilot
- Week 14: Mumbai all floors (validation)
- Week 15-17: Chennai, Bangalore, Delhi (APAC sites)
- Week 18-19: London, Frankfurt (EMEA sites)
- Week 20: NJ, Dallas (Americas sites)

**Validation Criteria:**
- [ ] Dual-stack endpoints (IPv4 + IPv6) on all sites
- [ ] LISP IPv6 EID reachability cross-site
- [ ] ISE profiling/auth works for IPv6 endpoints
- [ ] SGT propagation works over IPv6 (SXP dual-stack)

---

### 3. SD-WAN SERVICE VPNs (Phase 1 — Weeks 5-12)

**Current IPv4 State:**
- VPN 0: WAN transport (MPLS, DIA, ExpressRoute peer IPs)
- VPN 1: Corporate overlay (`10.100.x.x`, `192.168.x.x`)
- VPN 2-5: Voice, Guest, IoT, Management

**IPv6 Target State:**
- VPN 0: IPv6 transport (dual-stack WAN circuits)
- VPN 1-5: IPv6 overlay prefixes per VPN

**Migration Steps:**

```
STEP 1: Enable IPv6 on WAN Circuits (VPN 0)
! ISP must provide IPv6 address — coordinate with Tata (MPLS), BT (DIA), Microsoft (ER)

! Example: Mumbai C8500-12X MPLS interface
interface TenGigabitEthernet0/0/0
  description MPLS-WAN-PRIMARY
  vrf forwarding 0
  ip address 172.16.100.2 255.255.255.252
  ipv6 address 2001:db8:abc1:1:8000::2/127  (ISP-assigned)
  tunnel-interface
    encapsulation ipsec
    color mpls
    
! BFD dual-stack
bfd interval 1000 min_rx 1000 multiplier 3
bfd ipv6 interval 1000 min_rx 1000 multiplier 3

STEP 2: OMP IPv6 Route Advertisement
! vManage automatically advertises IPv6 prefixes via OMP
! Verify:
show sdwan omp routes vpn 1 ipv6
! Expected: See 2001:db8:abc1:1:1000::/56 advertised from Mumbai

STEP 3: SD-WAN Tunnel IPv6 (Data Plane)
! IPsec tunnels automatically support IPv6 payload over IPv4/IPv6 underlay
! Preferred: IPv6 underlay (native) for better performance

show sdwan ipsec outbound-connections | include 2001
! Expected: IPv6 SA (Security Association) to other sites

STEP 4: Branch Sites (ISR 1100 with LTE)
! LTE carriers (Jio, Airtel) now provide IPv6 via CGN (Carrier-Grade NAT)
interface Cellular0
  ipv6 address autoconfig default
  ipv6 enable
  tunnel-interface
    color lte
```

**Validation:**
- [ ] IPv6 WAN circuits active (MPLS, DIA, LTE)
- [ ] OMP routes include IPv6 prefixes
- [ ] SD-WAN BFD sessions dual-stack
- [ ] Cross-site IPv6 ping via SD-WAN tunnel

---

### 4. MULTI-CLOUD IPv6 (Phase 3 — Weeks 21-28)

#### 4.1 Azure ExpressRoute IPv6

**Current State:**
- ExpressRoute Microsoft Peering: IPv4 only
- BGP peers: `169.254.200.1` ↔ `169.254.200.2` (link-local)

**Target State:**
- ExpressRoute supports dual-stack (IPv4 + IPv6)
- BGP peers: `169.254.200.1` + `fe80::1` (link-local IPv6)

**Migration:**

```
STEP 1: Enable IPv6 on Azure Side (Azure Portal)
ExpressRoute Circuit → Peering → Microsoft Peering → Edit
  ☑ Enable IPv6 Peering
  Primary IPv6 Subnet: 2001:db8:cafe:1::/126  (Microsoft provides)
  Secondary IPv6 Subnet: 2001:db8:cafe:2::/126
  
Azure VNet:
  Add IPv6 address space: 2001:db8:abc4:10::/56
  Subnets: Add IPv6 range to each subnet (e.g., 10.100.10.0/24 + 2001:db8:abc4:10:10::/64)

STEP 2: C8500-12X Configuration (Mumbai Hub)
interface TenGigabitEthernet0/0/2.4001
  description EXPRESSROUTE-PRIMARY
  encapsulation dot1Q 4001
  vrf forwarding 1
  ip address 169.254.200.2 255.255.255.252
  ipv6 address 2001:db8:cafe:1::2/126
  ipv6 enable
  
router bgp 65000
  address-family ipv6 vrf 1
    neighbor 2001:db8:cafe:1::1 remote-as 12076
    neighbor 2001:db8:cafe:1::1 activate
    network 2001:db8:abc1:1:1000::/56  (Advertise corporate IPv6)

STEP 3: Azure Private Endpoint IPv6
Azure SQL Private Endpoint:
  IPv4: 10.100.10.10
  IPv6: 2001:db8:abc4:10:10::10
  
DNS: Create AAAA record
  abhavtech-sql.database.windows.net → 2001:db8:abc4:10:10::10
```

**Validation:**
- [ ] ExpressRoute BGP: IPv4 + IPv6 sessions ESTABLISHED
- [ ] Azure VNet reachable via IPv6 from branches
- [ ] O365 IPv6 prefixes received (e.g., `2603::/20`)

---

#### 4.2 GCP Cloud Interconnect IPv6

**Current State:**
- Dedicated Interconnect: IPv4 BGP to Google ASN 16550
- VPC: Auto-mode (IPv4 10.128.0.0/9)

**Target State:**
- Dual-stack interconnect
- VPC: Dual-stack subnets

**Migration:**

```
STEP 1: GCP Cloud Console
VPC Network → Subnets → Edit subnet
  ☑ Enable IPv6
  IPv6 Access Type: External  (or Internal for private Google APIs)
  Stack Type: IPv4 and IPv6 (dual-stack)
  
Cloud Interconnect Attachment:
  BGP Session → Add IPv6
  GCP IPv6 Address: 2001:4860::/32 range (Google assigns)
  Customer IPv6: 2001:db8:abc1:1:8000::10/126

STEP 2: C8500-12X Configuration
interface TenGigabitEthernet0/0/1.100
  description GCP-INTERCONNECT
  encapsulation dot1Q 100
  vrf forwarding 1
  ip address 169.254.0.2 255.255.255.252
  ipv6 address 2001:db8:abc1:1:8000::10/126
  
router bgp 65000
  address-family ipv6 vrf 1
    neighbor 2001:db8:abc1:1:8000::9 remote-as 16550
    neighbor 2001:db8:abc1:1:8000::9 activate
```

---

### 5. ISE IPv6 SUPPORT (Phase 2 — Weeks 13-20)

**Current State:**
- RADIUS CoA: IPv4 only
- pxGrid: IPv4 communication
- Endpoint profiling: IPv4 attributes (DHCP, HTTP, DNS)

**Target State:**
- ISE 3.3+ supports full IPv6 (RADIUS, profiling, TrustSec)

**Migration:**

```
STEP 1: ISE Network Device IPv6 Addresses
ISE → Administration → Network Resources → Network Devices
  For each edge switch:
    IPv4 Address: 10.250.1.10
    IPv6 Address: 2001:db8:abc1:1:0::10
    Shared Secret: <same for IPv4 + IPv6>

STEP 2: IPv6 Profiling Policies
ISE → Policy → Profiling
  Create condition: DHCPv6-Option = (e.g., option 15 for domain)
  Windows 11: DHCPv6 Client Identifier (DUID)
  
ISE learns IPv6 endpoint:
  MAC: a1:b2:c3:d4:e5:f6
  IPv4: 10.100.1.50
  IPv6: 2001:db8:abc1:1:1001::a1b2:c3ff:fed4:e5f6
  Profile: Microsoft-Workstation

STEP 3: SGT Propagation (SXP/TrustSec)
! SXP supports IPv6 endpoints since ISE 3.0
! Automatic — no config change needed if ISE + switch on ISE 3.3+
```

---

### 6. CATALYST CENTER (DNAC) IPv6 (Phase 2 — Weeks 13-20)

**Current State:**
- DNAC management IP: IPv4 (`10.252.10.10`)
- Device discovery: IPv4
- Assurance telemetry: IPv4 only

**Target State:**
- DNAC 2.3.7+ supports IPv6 management
- Dual-stack discovery

**Migration:**

```
STEP 1: DNAC IPv6 Management
DNAC → System → Settings → Network
  Add IPv6 address: 2001:db8:abc1:1:100::10/64
  IPv6 Gateway: 2001:db8:abc1:1:100::1
  
STEP 2: Device Discovery (Dual-Stack)
DNAC → Tools → Discovery → Add Discovery
  IP Address/Range: 
    IPv4: 10.250.1.0/24
    IPv6: 2001:db8:abc1:1:0::/64
  Credentials: CDP/LLDP + SSH (same for IPv4/IPv6)

STEP 3: Assurance IPv6
DNAC → Assurance → Issues
  IPv6 client health appears alongside IPv4
  NetFlow: Dual-stack (IPv4 + IPv6 flows)
```

---

### 7. WEBEX CALLING / CONTACT CENTER IPv6 (Phase 3 — Weeks 21-28)

**Current State:**
- Webex media: IPv4 preferred
- SIP signaling: IPv4

**Target State:**
- Webex supports dual-stack (since 2023)
- Faster media setup via IPv6 (no NAT traversal)

**Migration:**

```
STEP 1: Webex Control Hub
Webex Admin → Calling → Service Settings
  ☑ Enable IPv6 for media
  
Webex Endpoint (Cisco IP Phone 8800):
  IPv4: 10.190.1.100
  IPv6: 2001:db8:abc1:1:5001::100 (SLAAC)
  
SIP Registration:
  IPv4 Registrar: sip.wxc.webex.com
  IPv6 Registrar: [2001:420:1c01::10] (example Webex IPv6)

STEP 2: QoS Marking (IPv6)
! SD-WAN AAR policy applies same DSCP to IPv6
policy-map AAR-TEAMS-VOICE
  class match ipv6 ms-teams-media
    set dscp ef
```

---

### 8. WiFi 7 (802.11be) IPv6 (Phase 2-3 — Weeks 13-28)

**Current State:**
- WiFi 6E: IPv4 clients via DHCP
- WLC: IPv4 management

**Target State:**
- WiFi 7 clients prefer IPv6 (better throughput via simplified header)
- WLC dual-stack

**Migration:**

```
STEP 1: WLC IPv6 Management
WLC (9800-CL) → Management → Interfaces
  Management Interface:
    IPv4: 10.252.40.10
    IPv6: 2001:db8:abc1:1:100::40

STEP 2: WLAN IPv6 Configuration
WLC → WLANs → Corp-Secure → Advanced
  ☑ IPv6 Support: Enable
  IPv6 ACL: (if needed, similar to IPv4 ACL)
  
Access Point (WiFi 7):
  Automatically gets dual-stack via CAPWAP tunnel to WLC

STEP 3: Client Testing
iPhone 15 / Samsung Galaxy S24 (WiFi 7 capable):
  Connects to Corp-Secure SSID
  Receives: IPv4 (DHCP) + IPv6 (SLAAC)
  Prefers: IPv6 for app traffic (OS default behavior)
```

---

### 9. OBSERVABILITY IPv6 (Phase 4 — Weeks 29-36)

#### 9.1 ThousandEyes IPv6

```
STEP 1: Enterprise Agent IPv6
ThousandEyes Cloud Agent (Mumbai):
  Add IPv6 interface: 2001:db8:abc1:1:101::60
  
Test Configuration:
  HTTP Server Test → Target: ipv6.google.com
  Agent-to-Agent Test → Target Agent IPv6: 2001:db8:abc2:2:101::60 (London)
```

#### 9.2 Splunk IPv6

```
STEP 1: Splunk Indexer IPv6
/opt/splunk/etc/system/local/inputs.conf:
[splunktcp://2001:db8:abc1:1:101::50:9997]
connection_host = ip

STEP 2: Universal Forwarder IPv6
Switch logs sent via IPv6 syslog:
logging host ipv6 2001:db8:abc1:1:101::50
```

#### 9.3 AppDynamics IPv6

```
AppDynamics Controller:
  Supports IPv6 agents since 23.x
  App Server Agent → Java opts:
    -Djava.net.preferIPv6Addresses=true
```

---

## TESTING AND VALIDATION

### Pre-Migration Testing (Week 1-4)

```bash
#!/bin/bash
# ipv6_readiness_check.sh

echo "=== IPv6 READINESS CHECK ==="

# Test 1: OS Support
for HOST in mum-bn-01 lon-bn-01 nj-bn-01; do
  echo "[$HOST] OS IPv6 support:"
  ssh $HOST "show version | include IOS"
# Expected: IOS-XE 17.15+ (native IPv6 support)
done

# Test 2: Hardware Capability
echo ""
echo "Hardware IPv6 forwarding:"
ssh mum-bn-01 "show platform hardware fed switch 1 fwd asic drops exceptions | include IPv6"
# Expected: IPv6 exceptions = 0 (hardware forwarding working)

# Test 3: ISP IPv6 Availability
echo ""
echo "ISP IPv6 Circuit Status:"
# Contact Tata, BT, Microsoft, Google for IPv6 provisioning timeline
```

### Post-Migration Validation (Per Phase)

```bash
#!/bin/bash
# ipv6_phase_validation.sh

PHASE=$1  # 1, 2, 3, or 4

case $PHASE in
  1)  # SD-WAN Underlay
    echo "=== PHASE 1 VALIDATION: SD-WAN UNDERLAY IPv6 ==="
    ssh mum-hub-01 "ping ipv6 2001:db8:abc2:2:0::1 repeat 5"  # Mumbai → London
    ssh mum-hub-01 "show isis ipv6 neighbors"
    ssh mum-hub-01 "show sdwan bfd sessions | include 2001"
    ;;
    
  2)  # SD-Access Overlay
    echo "=== PHASE 2 VALIDATION: SD-ACCESS OVERLAY IPv6 ==="
    ssh mum-ed-01 "show ipv6 interface vlan 1011 | include address"
    ssh mum-ed-01 "show lisp instance-id 8001 ipv6 database"
    ssh mum-ed-01 "ping vrf VN_CORPORATE ipv6 2001:db8:abc2:2:1001::50"  # Mumbai → London endpoint
    ;;
    
  3)  # Multi-Cloud
    echo "=== PHASE 3 VALIDATION: MULTI-CLOUD IPv6 ==="
    ssh mum-hub-01 "show bgp ipv6 unicast summary | grep 2001"  # ExpressRoute/GCP BGP
    ssh mum-hub-01 "ping ipv6 2001:db8:abc4:10:10::10"  # Azure SQL PE
    ;;
    
  4)  # Observability
    echo "=== PHASE 4 VALIDATION: OBSERVABILITY IPv6 ==="
    curl -s -6 "http://[2001:db8:abc1:1:101::50]:8088/services/collector/health" | jq .
# Expected: Splunk HEC health check via IPv6
    ;;
esac
```

---

## ROLLBACK STRATEGY

```
ROLLBACK DECISION MATRIX:
┌────────────────────────────────────────────────────────────────────┐
│ Scenario                      │ Action                           │
├────────────────────────────────────────────────────────────────────┤
│ IPv6 breaks IPv4 routing       │ IMMEDIATE: Disable IPv6 on       │
│                                │ affected interface, revert config│
│                                                                    │
│ Endpoint auth fails (ISE IPv6) │ ISE: Disable IPv6 profiling,     │
│                                │ fallback to IPv4-only policies   │
│                                                                    │
│ Cloud provider IPv6 issues     │ Remove IPv6 BGP neighbor,        │
│                                │ continue IPv4-only to cloud      │
│                                                                    │
│ Performance degradation        │ Investigate (likely MTU/PMTUD),  │
│                                │ if unresolved: disable IPv6      │
└────────────────────────────────────────────────────────────────────┘

ROLLBACK PROCEDURE (Generic):
1. Identify failing component (underlay, overlay, cloud)
2. Remove IPv6 config (keep IPv4 untouched)
3. Verify IPv4-only operation restored
4. Root-cause IPv6 failure in lab before retry

CRITICAL: IPv4 must NEVER be impacted during IPv6 rollout
```

---

## SECURITY CONSIDERATIONS

### IPv6-Specific Threats

| Threat | Mitigation |
|--------|------------|
| **RA Flooding** | RA Guard on all access ports (DNAC auto-configures) |
| **DHCPv6 Spoofing** | DHCPv6 Guard + Source Guard |
| **NDP Exhaustion** | NDP rate-limiting per port (1000/sec max) |
| **ICMPv6 Redirect** | Disable ICMPv6 redirects on end-user VLANs |
| **Tunneling (6in4, Teredo)** | Block at firewall — only native IPv6 allowed |

### ACL Translation (IPv4 → IPv6)

```
IPv4 ACL:
  permit tcp 10.100.1.0 0.0.0.255 host 10.180.5.10 eq 443

IPv6 Equivalent:
  permit tcp 2001:db8:abc1:1:1001::/64 host 2001:db8:abc1:1:4005::10 eq 443

SGACL (works same for IPv4 + IPv6):
  SGT 10 (Employees) → SGT 81 (AppServers): permit tcp/443
```

---

## TRAINING AND DOCUMENTATION

### Staff Training Requirements

| Role | Training | Duration |
|------|----------|----------|
| Network Engineers | IPv6 fundamentals, SD-WAN/SD-Access dual-stack config | 3 days |
| NOC Team | IPv6 troubleshooting, monitoring dashboards | 2 days |
| Security Team | IPv6 threats, ACL/firewall dual-stack policies | 2 days |
| Helpdesk | IPv6 client troubleshooting (ipconfig, tracert -6) | 1 day |

### Documentation Deliverables

- [ ] IPv6 Addressing Register (Excel/IPAM)
- [ ] DNAC IPv6 Pool Templates
- [ ] ISE IPv6 Profiling Policies
- [ ] SD-WAN vManage IPv6 Feature Templates
- [ ] Runbooks: IPv6 Deployment, Troubleshooting, Rollback
- [ ] Update network diagrams with IPv6 addressing

---

## SUCCESS METRICS

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Dual-Stack Coverage** | 100% of sites | IPv6 enabled on all 19 sites |
| **Endpoint IPv6 Adoption** | >80% prefer IPv6 | Monitor via DNAC Assurance (IPv6 flow ratio) |
| **Cloud IPv6 Traffic** | >50% to Azure/GCP via IPv6 | NetFlow analysis |
| **Zero IPv4 Impact** | 0 incidents caused by IPv6 | Incident tracker |
| **Performance Improvement** | <10% latency reduction (no NAT) | ThousandEyes metrics |
| **Rollback Events** | <3 rollbacks during migration | Change control log |

---

## APPENDIX A: IPv6 PREFIX ALLOCATION TABLE

```
COMPLETE ALLOCATION (Example — update with actual ARIN assignment):
┌────────────────────────────────────────────────────────────────────┐
│ Site          │ IPv6 Prefix            │ /48 Block               │
├────────────────────────────────────────────────────────────────────┤
│ Mumbai        │ 2001:db8:abc1:1::/48   │ Region 1, Site 1        │
│ Chennai       │ 2001:db8:abc1:2::/48   │ Region 1, Site 2        │
│ Bangalore     │ 2001:db8:abc1:3::/48   │ Region 1, Site 3        │
│ Delhi         │ 2001:db8:abc1:4::/48   │ Region 1, Site 4        │
│ ... (9 more)  │ 2001:db8:abc1:5-D::/48 │ ...                     │
│ London        │ 2001:db8:abc2:1::/48   │ Region 2, Site 1        │
│ Frankfurt     │ 2001:db8:abc2:2::/48   │ Region 2, Site 2        │
│ New Jersey    │ 2001:db8:abc3:1::/48   │ Region 3, Site 1        │
│ Dallas        │ 2001:db8:abc3:2::/48   │ Region 3, Site 2        │
│ Chicago       │ 2001:db8:abc3:3::/48   │ Region 3, Site 3        │
│ Azure         │ 2001:db8:abc4::/48     │ Cloud Region            │
│ GCP           │ 2001:db8:abc5::/48     │ Cloud Region            │
└────────────────────────────────────────────────────────────────────┘
```

---

## APPENDIX B: VENDOR SUPPORT MATRIX

| Vendor/Product | IPv6 Support | Min Version | Notes |
|----------------|--------------|-------------|-------|
| Cisco Catalyst 9000 | ✅ Full | IOS-XE 17.9+ | Hardware IPv6 forwarding |
| Cisco C8500 (SD-WAN) | ✅ Full | IOS-XE 17.9+ | Dual-stack underlay + overlay |
| Cisco ISE | ✅ Full | ISE 3.0+ | Profiling, RADIUS, TrustSec |
| Cisco DNAC | ✅ Full | DNAC 2.3.5+ | IPv6 pools, assurance |
| Cisco WLC 9800 | ✅ Full | IOS-XE 17.9+ | Dual-stack clients |
| vManage | ✅ Full | vManage 20.12+ | IPv6 VPN service |
| Azure ExpressRoute | ✅ Full | N/A | Dual-stack since 2020 |
| GCP Interconnect | ✅ Full | N/A | Dual-stack since 2021 |
| Webex Calling | ✅ Full | N/A | IPv6 media since 2023 |
| ThousandEyes | ✅ Full | Enterprise+ | IPv6 tests supported |
| Splunk | ✅ Full | Splunk 9.0+ | IPv6 syslog receivers |
| AppDynamics | ✅ Full | 23.x+ | IPv6 agents |

---

*© 2025 Abhavtech - IPv6 Migration Master Reference Card*
*Version 1.0 | Last Updated: January 2025*
