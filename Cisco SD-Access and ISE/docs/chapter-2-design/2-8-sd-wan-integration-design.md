# 2.8 SD-WAN Integration Design

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
