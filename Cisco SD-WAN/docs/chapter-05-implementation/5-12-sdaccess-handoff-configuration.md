# 5.12 SD-Access Handoff Configuration

## Document Information
- **Version:** 2.1
- **Last Updated:** December 30, 2025
- **Author:** Abhavtech Network Architecture Team
- **Status:** Production Ready
- **Classification:** Internal Use Only

---

## 5.12.1 SD-Access Integration Overview

The integration between SD-Access and SD-WAN is critical for extending fabric segmentation across the WAN. This section provides detailed configuration procedures for establishing the handoff between SD-Access border nodes and SD-WAN WAN Edge routers.

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                        SD-ACCESS AND SD-WAN INTEGRATION ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────────────────────┐
    │                              SD-ACCESS FABRIC DOMAIN                                  │
    │                              (Managed by Catalyst Center)                            │
    │                                                                                       │
    │   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐       │
    │   │   Control   │     │   Control   │     │   Border    │     │   Border    │       │
    │   │   Plane     │     │   Plane     │     │   Node      │     │   Node      │       │
    │   │   Node      │     │   Node      │     │  (Primary)  │     │ (Secondary) │       │
    │   └─────────────┘     └─────────────┘     └──────┬──────┘     └──────┬──────┘       │
    │                                                   │                   │               │
    │                                                   │ BGP AS 65200     │               │
    └───────────────────────────────────────────────────┼───────────────────┼───────────────┘
                                                        │                   │
                                            ┌───────────┴───────────────────┴───────────┐
                                            │          L3 HANDOFF (VRF-Lite)            │
                                            │     VLANs: 3010, 3020, 3030, 3040, 3050   │
                                            │     eBGP Peering per VRF                  │
                                            │     SGT Inline Tagging                    │
                                            └───────────┬───────────────────┬───────────┘
                                                        │                   │
    ┌───────────────────────────────────────────────────┼───────────────────┼───────────────┐
    │                                                   │                   │               │
    │   ┌──────────────────────────────────────────────┴─────────────────────┴────────────┐│
    │   │                                                                                  ││
    │   │                           SD-WAN WAN EDGE ROUTERS                               ││
    │   │                           (Managed by SD-WAN Manager)                           ││
    │   │                                                                                  ││
    │   │    ┌──────────────┐                                    ┌──────────────┐         ││
    │   │    │  WAN Edge    │         IPsec / DTLS Tunnels       │  WAN Edge    │         ││
    │   │    │  Primary     │◄──────────────────────────────────►│  Secondary   │         ││
    │   │    │  AS 65100    │                                    │  AS 65100    │         ││
    │   │    └──────┬───────┘                                    └──────┬───────┘         ││
    │   │           │                                                   │                 ││
    │   └───────────┼───────────────────────────────────────────────────┼─────────────────┘│
    │               │                                                   │                  │
    │               └─────────────────┬─────────────────────────────────┘                  │
    │                                 │                                                    │
    │                    ┌────────────┼────────────┐                                       │
    │                    │            │            │                                       │
    │               ┌────▼────┐  ┌────▼────┐  ┌────▼────┐                                 │
    │               │  MPLS   │  │Internet │  │  LTE    │                                 │
    │               │Transport│  │Transport│  │ Backup  │                                 │
    │               └─────────┘  └─────────┘  └─────────┘                                 │
    │                                                                                      │
    │                              SD-WAN OVERLAY DOMAIN                                   │
    └──────────────────────────────────────────────────────────────────────────────────────┘
```

### Handoff Methods Comparison

| Method | Use Case | Complexity | Scalability | SGT Support |
|--------|----------|------------|-------------|-------------|
| VRF-Lite with eBGP | Recommended for most deployments | Medium | High | Yes |
| Static Routing | Small deployments, testing | Low | Limited | Limited |
| LISP to BGP | Advanced, multi-site | High | Very High | Yes |
| Fusion Router | Legacy integration | High | Medium | Limited |

### Abhavtech Handoff Design

| Parameter | Value |
|-----------|-------|
| Handoff Method | VRF-Lite with eBGP |
| SD-Access Border AS | 65200 |
| SD-WAN WAN Edge AS | 65100 |
| Handoff VLANs | 3010, 3020, 3030, 3040, 3050 |
| Handoff Subnet | /30 per VRF |
| SGT Propagation | Inline tagging (CTS) |
| Route Summarization | Yes, at border |

---

## 5.12.2 Physical Connectivity

### Cabling Requirements

```
Physical Handoff Connectivity
=============================

SD-Access Border Node (C9500-48Y4C)          SD-WAN WAN Edge (C8500-12X4QC)
┌────────────────────────────────────┐       ┌────────────────────────────────────┐
│                                    │       │                                    │
│  Te1/0/1 ─────────────────────────────────── Te0/0/0                           │
│  (Trunk to WAN Edge Primary)       │       │  (Trunk to Border Primary)        │
│                                    │       │                                    │
│  Te1/0/2 ─────────────────────────────────── Te0/0/1 (Cross-connect)           │
│  (Trunk to WAN Edge Secondary)     │       │                                    │
│                                    │       │                                    │
└────────────────────────────────────┘       └────────────────────────────────────┘

Cable Specifications:
- Cable Type: 10GBASE-SR SFP+ with OM4 MMF
- Maximum Length: 400m (for OM4)
- Alternative: 10GBASE-LR SFP+ for longer runs

Redundancy:
- Primary: Border-Primary to WAN-Edge-Primary
- Secondary: Border-Secondary to WAN-Edge-Secondary
- Cross-connect: Border-Primary to WAN-Edge-Secondary (optional)
```

### Interface Allocation

| Site | Border Node | Border Interface | WAN Edge | WAN Edge Interface | VLANs |
|------|-------------|------------------|----------|-------------------|-------|
| Mumbai | ABVT-MUM-BN01 | Te1/0/1 | ABVT-MUM-WE01 | Te0/0/0 | 3010-3050 |
| Mumbai | ABVT-MUM-BN02 | Te1/0/1 | ABVT-MUM-WE02 | Te0/0/0 | 3010-3050 |
| Chennai | ABVT-CHE-BN01 | Te1/0/1 | ABVT-CHE-WE01 | Te0/0/0 | 3010-3050 |
| Chennai | ABVT-CHE-BN02 | Te1/0/1 | ABVT-CHE-WE02 | Te0/0/0 | 3010-3050 |

---

## 5.12.3 VRF-to-VPN Mapping

### Mapping Table

| SD-Access VN | VRF Name | VLAN ID | Handoff VLAN | SD-WAN VPN | Purpose |
|--------------|----------|---------|--------------|------------|---------|
| Corporate_VN | Corporate-Data | 10 | 3010 | VPN 10 | Employee data |
| Guest_VN | Guest-Network | 20 | 3020 | VPN 20 | Guest internet |
| Voice_VN | Voice-UC | 30 | 3030 | VPN 30 | Voice/UC traffic |
| IoT_VN | IoT-Network | 40 | 3040 | VPN 40 | IoT devices |
| Shared_VN | Shared-Services | 50 | 3050 | VPN 50 | DNS, DHCP, AD |

### Handoff IP Addressing

| VRF/VPN | Handoff VLAN | Border IP | WAN Edge IP | Subnet |
|---------|--------------|-----------|-------------|--------|
| Corporate | 3010 | 10.100.100.2/30 | 10.100.100.1/30 | 10.100.100.0/30 |
| Guest | 3020 | 10.100.200.2/30 | 10.100.200.1/30 | 10.100.200.0/30 |
| Voice | 3030 | 10.100.130.2/30 | 10.100.130.1/30 | 10.100.130.0/30 |
| IoT | 3040 | 10.100.140.2/30 | 10.100.140.1/30 | 10.100.140.0/30 |
| Shared | 3050 | 10.100.150.2/30 | 10.100.150.1/30 | 10.100.150.0/30 |

---

## 5.12.4 SD-Access Border Node Configuration

### Border Node Physical Interface

```
!============================================================
! SD-Access Border Node Configuration
! Device: ABVT-MUM-BN01 (C9500-48Y4C)
! Role: Internal Border Node with L3 Handoff to SD-WAN
!============================================================

! Physical Interface to WAN Edge (Trunk)
interface TenGigabitEthernet1/0/1
 description L3-Handoff-to-SDWAN-WAN-Edge-Primary
 no switchport
 no ip address
 !
 ! Enable CTS inline tagging
 cts role-based enforcement
 cts manual
  policy static sgt 0 trusted
  propagate sgt
 !
 no shutdown
!
```

### Border Node VRF Subinterfaces

```
!------------------------------------------------------------
! VRF Subinterfaces for L3 Handoff
!------------------------------------------------------------

! Corporate VRF Handoff (VN: Corporate_VN)
interface TenGigabitEthernet1/0/1.3010
 description L3-Handoff-Corporate-to-SDWAN-VPN10
 encapsulation dot1Q 3010
 vrf forwarding Corporate-Data
 ip address 10.100.100.2 255.255.255.252
 no ip redirects
 no ip proxy-arp
 !
 ! CTS Configuration for SGT propagation
 cts role-based enforcement
 cts manual
  policy static sgt 0 trusted
  propagate sgt
 !
!

! Guest VRF Handoff (VN: Guest_VN)
interface TenGigabitEthernet1/0/1.3020
 description L3-Handoff-Guest-to-SDWAN-VPN20
 encapsulation dot1Q 3020
 vrf forwarding Guest-Network
 ip address 10.100.200.2 255.255.255.252
 no ip redirects
 no ip proxy-arp
!

! Voice VRF Handoff (VN: Voice_VN)
interface TenGigabitEthernet1/0/1.3030
 description L3-Handoff-Voice-to-SDWAN-VPN30
 encapsulation dot1Q 3030
 vrf forwarding Voice-UC
 ip address 10.100.130.2 255.255.255.252
 no ip redirects
 no ip proxy-arp
 !
 cts role-based enforcement
 cts manual
  policy static sgt 0 trusted
  propagate sgt
 !
!

! IoT VRF Handoff (VN: IoT_VN)
interface TenGigabitEthernet1/0/1.3040
 description L3-Handoff-IoT-to-SDWAN-VPN40
 encapsulation dot1Q 3040
 vrf forwarding IoT-Network
 ip address 10.100.140.2 255.255.255.252
 no ip redirects
 no ip proxy-arp
 !
 cts role-based enforcement
 cts manual
  policy static sgt 0 trusted
  propagate sgt
 !
!

! Shared Services VRF Handoff (VN: Shared_VN)
interface TenGigabitEthernet1/0/1.3050
 description L3-Handoff-SharedServices-to-SDWAN-VPN50
 encapsulation dot1Q 3050
 vrf forwarding Shared-Services
 ip address 10.100.150.2 255.255.255.252
 no ip redirects
 no ip proxy-arp
!
```

### Border Node BGP Configuration

```
!============================================================
! BGP Configuration on SD-Access Border Node
! eBGP peering with SD-WAN WAN Edge
!============================================================

router bgp 65200
 bgp router-id 10.255.200.1
 bgp log-neighbor-changes
 !
 ! Template for SD-WAN WAN Edge neighbors
 template peer-policy SDWAN-PEER-POLICY
  send-community both
  soft-reconfiguration inbound
  maximum-prefix 1000 80 warning-only
 exit-peer-policy
 !
 template peer-session SDWAN-PEER-SESSION
  remote-as 65100
  description SD-WAN-WAN-Edge-Peering
  password 7 <encrypted-password>
  timers 3 10
 exit-peer-session
 !
 !------------------------------------------------------------
 ! Corporate VRF BGP Configuration
 !------------------------------------------------------------
 address-family ipv4 vrf Corporate-Data
  !
  ! Redistribute LISP routes from fabric
  redistribute lisp metric 100
  !
  ! Advertise summary to SD-WAN
  aggregate-address 10.10.0.0 255.255.0.0 summary-only
  !
  ! SD-WAN WAN Edge Primary Neighbor
  neighbor 10.100.100.1 inherit peer-session SDWAN-PEER-SESSION
  neighbor 10.100.100.1 description ABVT-MUM-WE01-Corporate
  neighbor 10.100.100.1 activate
  neighbor 10.100.100.1 inherit peer-policy SDWAN-PEER-POLICY
  !
  ! SD-WAN WAN Edge Secondary Neighbor (if cross-connected)
  neighbor 10.100.100.5 inherit peer-session SDWAN-PEER-SESSION
  neighbor 10.100.100.5 description ABVT-MUM-WE02-Corporate
  neighbor 10.100.100.5 activate
  neighbor 10.100.100.5 inherit peer-policy SDWAN-PEER-POLICY
  !
  maximum-paths 2
 exit-address-family
 !
 !------------------------------------------------------------
 ! Guest VRF BGP Configuration
 !------------------------------------------------------------
 address-family ipv4 vrf Guest-Network
  redistribute lisp metric 100
  aggregate-address 10.20.0.0 255.255.0.0 summary-only
  !
  neighbor 10.100.200.1 inherit peer-session SDWAN-PEER-SESSION
  neighbor 10.100.200.1 description ABVT-MUM-WE01-Guest
  neighbor 10.100.200.1 activate
  neighbor 10.100.200.1 inherit peer-policy SDWAN-PEER-POLICY
  !
  maximum-paths 2
 exit-address-family
 !
 !------------------------------------------------------------
 ! Voice VRF BGP Configuration
 !------------------------------------------------------------
 address-family ipv4 vrf Voice-UC
  redistribute lisp metric 100
  aggregate-address 10.30.0.0 255.255.0.0 summary-only
  !
  neighbor 10.100.130.1 inherit peer-session SDWAN-PEER-SESSION
  neighbor 10.100.130.1 description ABVT-MUM-WE01-Voice
  neighbor 10.100.130.1 activate
  neighbor 10.100.130.1 inherit peer-policy SDWAN-PEER-POLICY
  !
  maximum-paths 2
 exit-address-family
 !
 !------------------------------------------------------------
 ! IoT VRF BGP Configuration
 !------------------------------------------------------------
 address-family ipv4 vrf IoT-Network
  redistribute lisp metric 100
  aggregate-address 10.40.0.0 255.255.0.0 summary-only
  !
  neighbor 10.100.140.1 inherit peer-session SDWAN-PEER-SESSION
  neighbor 10.100.140.1 description ABVT-MUM-WE01-IoT
  neighbor 10.100.140.1 activate
  neighbor 10.100.140.1 inherit peer-policy SDWAN-PEER-POLICY
  !
  maximum-paths 2
 exit-address-family
 !
 !------------------------------------------------------------
 ! Shared Services VRF BGP Configuration
 !------------------------------------------------------------
 address-family ipv4 vrf Shared-Services
  redistribute lisp metric 100
  redistribute connected
  !
  neighbor 10.100.150.1 inherit peer-session SDWAN-PEER-SESSION
  neighbor 10.100.150.1 description ABVT-MUM-WE01-Shared
  neighbor 10.100.150.1 activate
  neighbor 10.100.150.1 inherit peer-policy SDWAN-PEER-POLICY
  !
  maximum-paths 2
 exit-address-family
!
```

---

## 5.12.5 SD-WAN WAN Edge Configuration

### WAN Edge Subinterfaces

```
!============================================================
! SD-WAN WAN Edge Configuration for SD-Access Handoff
! Device: ABVT-MUM-WE01 (C8500-12X4QC)
!============================================================

! Physical Interface to Border Node
interface TenGigabitEthernet0/0/0
 description L3-Handoff-to-SDAccess-Border
 no ip address
 no shutdown
!

!------------------------------------------------------------
! Service VPN Subinterfaces
!------------------------------------------------------------

! VPN 10 - Corporate Handoff
interface TenGigabitEthernet0/0/0.10
 description SDAccess-Handoff-Corporate-VPN10
 encapsulation dot1Q 3010
 vrf forwarding 10
 ip address 10.100.100.1 255.255.255.252
 no ip redirects
 !
 ! CTS for SGT propagation
 cts role-based enforcement
 cts manual
  policy static sgt 100 trusted
  propagate sgt
 !
 no shutdown
!

! VPN 20 - Guest Handoff
interface TenGigabitEthernet0/0/0.20
 description SDAccess-Handoff-Guest-VPN20
 encapsulation dot1Q 3020
 vrf forwarding 20
 ip address 10.100.200.1 255.255.255.252
 no ip redirects
 no shutdown
!

! VPN 30 - Voice Handoff
interface TenGigabitEthernet0/0/0.30
 description SDAccess-Handoff-Voice-VPN30
 encapsulation dot1Q 3030
 vrf forwarding 30
 ip address 10.100.130.1 255.255.255.252
 no ip redirects
 !
 cts role-based enforcement
 cts manual
  policy static sgt 110 trusted
  propagate sgt
 !
 no shutdown
!

! VPN 40 - IoT Handoff
interface TenGigabitEthernet0/0/0.40
 description SDAccess-Handoff-IoT-VPN40
 encapsulation dot1Q 3040
 vrf forwarding 40
 ip address 10.100.140.1 255.255.255.252
 no ip redirects
 !
 cts role-based enforcement
 cts manual
  policy static sgt 120 trusted
  propagate sgt
 !
 no shutdown
!

! VPN 50 - Shared Services Handoff
interface TenGigabitEthernet0/0/0.50
 description SDAccess-Handoff-SharedServices-VPN50
 encapsulation dot1Q 3050
 vrf forwarding 50
 ip address 10.100.150.1 255.255.255.252
 no ip redirects
 no shutdown
!
```

### WAN Edge BGP Configuration

```
!============================================================
! BGP Configuration on SD-WAN WAN Edge
! eBGP peering with SD-Access Border
!============================================================

router bgp 65100
 bgp router-id 10.255.1.1
 bgp log-neighbor-changes
 !
 !------------------------------------------------------------
 ! VPN 10 - Corporate BGP
 !------------------------------------------------------------
 address-family ipv4 vrf 10
  !
  ! Redistribute OMP routes to BGP (for SD-Access)
  redistribute omp
  redistribute connected
  redistribute static
  !
  ! SD-Access Border Primary Neighbor
  neighbor 10.100.100.2 remote-as 65200
  neighbor 10.100.100.2 description SDAccess-Border-Primary
  neighbor 10.100.100.2 password 7 <encrypted-password>
  neighbor 10.100.100.2 activate
  neighbor 10.100.100.2 send-community both
  neighbor 10.100.100.2 soft-reconfiguration inbound
  neighbor 10.100.100.2 maximum-prefix 1000 80 warning-only
  !
  ! SD-Access Border Secondary Neighbor
  neighbor 10.100.100.6 remote-as 65200
  neighbor 10.100.100.6 description SDAccess-Border-Secondary
  neighbor 10.100.100.6 password 7 <encrypted-password>
  neighbor 10.100.100.6 activate
  neighbor 10.100.100.6 send-community both
  neighbor 10.100.100.6 soft-reconfiguration inbound
  neighbor 10.100.100.6 maximum-prefix 1000 80 warning-only
  !
  maximum-paths 4
  maximum-paths ibgp 4
 exit-address-family
 !
 !------------------------------------------------------------
 ! VPN 20 - Guest BGP
 !------------------------------------------------------------
 address-family ipv4 vrf 20
  redistribute omp
  redistribute connected
  !
  neighbor 10.100.200.2 remote-as 65200
  neighbor 10.100.200.2 description SDAccess-Border-Guest
  neighbor 10.100.200.2 activate
  neighbor 10.100.200.2 send-community both
  !
  maximum-paths 2
 exit-address-family
 !
 !------------------------------------------------------------
 ! VPN 30 - Voice BGP
 !------------------------------------------------------------
 address-family ipv4 vrf 30
  redistribute omp
  redistribute connected
  !
  neighbor 10.100.130.2 remote-as 65200
  neighbor 10.100.130.2 description SDAccess-Border-Voice
  neighbor 10.100.130.2 activate
  neighbor 10.100.130.2 send-community both
  !
  maximum-paths 2
 exit-address-family
 !
 !------------------------------------------------------------
 ! VPN 40 - IoT BGP
 !------------------------------------------------------------
 address-family ipv4 vrf 40
  redistribute omp
  redistribute connected
  !
  neighbor 10.100.140.2 remote-as 65200
  neighbor 10.100.140.2 description SDAccess-Border-IoT
  neighbor 10.100.140.2 activate
  neighbor 10.100.140.2 send-community both
  !
  maximum-paths 2
 exit-address-family
 !
 !------------------------------------------------------------
 ! VPN 50 - Shared Services BGP
 !------------------------------------------------------------
 address-family ipv4 vrf 50
  redistribute omp
  redistribute connected
  redistribute static
  !
  neighbor 10.100.150.2 remote-as 65200
  neighbor 10.100.150.2 description SDAccess-Border-Shared
  neighbor 10.100.150.2 activate
  neighbor 10.100.150.2 send-community both
  !
  maximum-paths 2
 exit-address-family
!
```

---

## 5.12.6 SGT/TrustSec Configuration

### CTS Global Configuration (WAN Edge)

```
!============================================================
! TrustSec/CTS Configuration on SD-WAN WAN Edge
! For SGT propagation across WAN
!============================================================

! CTS Global Settings
cts authorization list ISE-CTS-LIST
cts role-based enforcement
cts role-based enforcement vlan-list all
cts logging verbose
!
! RADIUS Configuration for CTS
aaa authorization network ISE-CTS-LIST group ISE-SERVERS
!
radius server ISE-PRIMARY
 address ipv4 10.10.50.21 auth-port 1812 acct-port 1813
 key 7 <encrypted-key>
 pac key 7 <encrypted-pac-key>
!
radius server ISE-SECONDARY
 address ipv4 10.10.50.22 auth-port 1812 acct-port 1813
 key 7 <encrypted-key>
 pac key 7 <encrypted-pac-key>
!
aaa group server radius ISE-SERVERS
 server name ISE-PRIMARY
 server name ISE-SECONDARY
!

! Interface CTS Configuration (applied via template)
interface TenGigabitEthernet0/0/0.10
 cts role-based enforcement
 cts manual
  policy static sgt 100 trusted
  propagate sgt
!
```

### SGT Mapping Table

| Traffic Type | SGT Value | Description | Applied At |
|--------------|-----------|-------------|------------|
| Employees | 100 | Corporate employees | Edge/WAN Edge |
| Contractors | 101 | External contractors | Edge/WAN Edge |
| Voice Phones | 110 | IP phones | Edge/WAN Edge |
| Video Endpoints | 111 | Video conferencing | Edge/WAN Edge |
| IoT Devices | 120 | IoT/OT devices | Edge/WAN Edge |
| Guests | 200 | Guest users | Edge/WAN Edge |
| Servers | 300 | Data center servers | WAN Edge |
| Management | 999 | Network management | WAN Edge |

### SGT Inline Tagging on WAN Tunnels

```
! Enable SGT propagation on SD-WAN tunnels
! This is configured via CLI template or configuration group

! Example tunnel interface with CTS
interface Tunnel100
 description IPsec-Tunnel-to-Remote-Site
 cts manual
  propagate sgt
!

! Verify CTS status
show cts interface summary

Interface            Mode        IFC-state  dot1x-role  peer-id   SGT         Manual        
-----------------------------------------------------------------------------
Te0/0/0.10           MANUAL      OPEN       unknown     unknown   100         Yes           
Te0/0/0.30           MANUAL      OPEN       unknown     unknown   110         Yes           
Te0/0/0.40           MANUAL      OPEN       unknown     unknown   120         Yes           
Tunnel100            MANUAL      OPEN       unknown     unknown   propagate   Yes           
```

---

## 5.12.7 Route Redistribution and Filtering

### OMP to BGP Redistribution

```
! On SD-WAN WAN Edge
! Redistribute OMP routes into BGP for SD-Access

router bgp 65100
 address-family ipv4 vrf 10
  !
  ! Redistribute OMP with route-map for filtering
  redistribute omp route-map OMP-TO-BGP-FILTER
  !
  ! Redistribute connected for local interfaces
  redistribute connected route-map CONNECTED-TO-BGP
 exit-address-family
!

! Route-map to filter OMP routes
route-map OMP-TO-BGP-FILTER permit 10
 match ip address prefix-list OMP-ALLOWED-PREFIXES
 set metric 100
!
route-map OMP-TO-BGP-FILTER deny 20
!

! Prefix list for allowed OMP routes
ip prefix-list OMP-ALLOWED-PREFIXES seq 10 permit 10.10.0.0/16 le 24
ip prefix-list OMP-ALLOWED-PREFIXES seq 20 permit 10.20.0.0/16 le 24
ip prefix-list OMP-ALLOWED-PREFIXES seq 30 permit 10.30.0.0/16 le 24
ip prefix-list OMP-ALLOWED-PREFIXES seq 40 permit 10.40.0.0/16 le 24
ip prefix-list OMP-ALLOWED-PREFIXES seq 50 permit 10.50.0.0/16 le 24

! Connected routes filter
route-map CONNECTED-TO-BGP permit 10
 match ip address prefix-list CONNECTED-PREFIXES
!
ip prefix-list CONNECTED-PREFIXES seq 10 permit 10.100.100.0/30
ip prefix-list CONNECTED-PREFIXES seq 20 permit 10.100.200.0/30
ip prefix-list CONNECTED-PREFIXES seq 30 permit 10.100.130.0/30
ip prefix-list CONNECTED-PREFIXES seq 40 permit 10.100.140.0/30
ip prefix-list CONNECTED-PREFIXES seq 50 permit 10.100.150.0/30
```

### BGP to OMP Redistribution

```
! On SD-WAN WAN Edge via vManage Template
! Redistribute BGP routes into OMP

sdwan
 omp
  !
  ! Advertise BGP routes to OMP
  advertise bgp
  !
  ! Advertise connected routes
  advertise connected
  !
  ! Advertise static routes
  advertise static
 !
!

! Verify routes in OMP
show sdwan omp routes vpn 10

Code:
C   -> chosen
I   -> installed
Red -> redistributed
Rej -> rejected

VPN    PREFIX              FROM PEER      LABEL    STATUS    TLOC IP         COLOR       
------------------------------------------------------------------------------------------
10     10.10.0.0/16        10.255.0.1     1003     C,I,R     10.255.1.1      mpls        
10     10.10.1.0/24        self           1003     C,I,Red   -               -           
10     10.10.2.0/24        self           1003     C,I,Red   -               -           
```

---

## 5.12.8 Verification Procedures

### Border Node Verification

```
! SD-Access Border Node Verification Commands

! Check BGP neighbor status
show bgp vpnv4 unicast all summary
BGP router identifier 10.255.200.1, local AS number 65200
Neighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
10.100.100.1    4 65100    1234    1198     1456    0    0 12:34:56       25
10.100.200.1    4 65100     987     965     1456    0    0 12:34:52       15

! Check routes received from SD-WAN
show bgp vpnv4 unicast vrf Corporate-Data
   Network          Next Hop            Metric LocPrf Weight Path
*> 10.10.0.0/16     10.100.100.1           100             0 65100 i
*> 10.10.10.0/24    10.100.100.1           100             0 65100 i
*> 10.10.20.0/24    10.100.100.1           100             0 65100 i

! Check LISP routes advertised to SD-WAN
show lisp site summary
LISP Site Summary for LISP 0:
  Number of configured sites:            5
  Number of registered sites:            5
  Sites with routing table information:  5

! Check CTS status
show cts interface TenGigabitEthernet1/0/1.3010
CTS Information for TenGigabitEthernet1/0/1.3010:
    CTS Mode: MANUAL
    IFC state: OPEN
    SGT propagation: enabled
```

### WAN Edge Verification

```
! SD-WAN WAN Edge Verification Commands

! Check BGP neighbors
show bgp vpnv4 unicast all summary
Neighbor        V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
10.100.100.2    4 65200    1198    1234     2345    0    0 12:34:56       50
10.100.130.2    4 65200     876     890     2345    0    0 12:34:50       30

! Check routes from SD-Access
show ip route vrf 10 bgp
B     10.10.0.0/16 [20/100] via 10.100.100.2, 12:34:56, Te0/0/0.10
B     10.10.1.0/24 [20/100] via 10.100.100.2, 12:34:56, Te0/0/0.10
B     10.10.2.0/24 [20/100] via 10.100.100.2, 12:34:56, Te0/0/0.10

! Check OMP routes
show sdwan omp routes vpn 10

! Check CTS interface status
show cts interface summary
Interface            Mode        IFC-state  dot1x-role  peer-id   SGT         Manual        
Te0/0/0.10           MANUAL      OPEN       unknown     unknown   100         Yes           

! Check CTS role-based counters
show cts role-based counters
```

### End-to-End Verification

```
End-to-End Handoff Verification Checklist
=========================================

1. PHYSICAL LAYER
   [ ] Interface status UP on both sides
   [ ] CRC errors = 0
   [ ] Input/output errors = 0
   Command: show interface Te0/0/0.10

2. BGP PEERING
   [ ] BGP neighbors in Established state
   [ ] Prefixes received > 0
   [ ] Prefixes sent > 0
   Command: show bgp vpnv4 unicast all summary

3. ROUTE EXCHANGE
   [ ] SD-Access routes visible in SD-WAN VPN
   [ ] SD-WAN routes visible in SD-Access VRF
   [ ] Route counts match expectations
   Command: show ip route vrf 10 | count

4. SGT PROPAGATION
   [ ] CTS enabled on handoff interfaces
   [ ] SGT values received correctly
   [ ] No SGT policy violations
   Command: show cts interface summary

5. TRAFFIC FLOW
   [ ] Ping from SD-Access host to remote SD-WAN site
   [ ] Traceroute shows expected path
   [ ] Application traffic flows end-to-end
   Command: ping vrf 10 <remote-ip> source <local-ip>

6. FAILOVER TEST
   [ ] Shut primary handoff interface
   [ ] Traffic fails over to secondary
   [ ] BGP reconverges < 30 seconds
   [ ] No traffic loss during failover
```

---

## 5.12.9 Troubleshooting Guide

### Common Issues and Solutions

| Issue | Symptoms | Diagnosis | Solution |
|-------|----------|-----------|----------|
| BGP not establishing | Neighbor stuck in Active | VLAN/IP mismatch | Verify VLAN and IP config |
| No routes received | Prefixes = 0 | Missing redistribution | Check redistribute config |
| SGT not propagating | SGT = 0 on remote | CTS not enabled | Enable CTS on interface |
| Asymmetric routing | Return traffic drops | Mismatched paths | Check ECMP/route metrics |
| MTU issues | Large packets drop | Jumbo frames | Verify MTU 1500+ on path |

### Debug Commands

```
! BGP debugging
debug bgp vpnv4 unicast updates
debug bgp vpnv4 unicast events

! CTS debugging  
debug cts all

! Interface debugging
debug interface TenGigabitEthernet0/0/0.10

! LISP debugging (on border)
debug lisp control-plane all
```

---

## 5.12.10 Automation Script

```python
#!/usr/bin/env python3
"""
SD-Access to SD-WAN Handoff Verification Script
Automated verification of integration health
"""

import requests
import json
import urllib3
from datetime import datetime

urllib3.disable_warnings()

class HandoffVerification:
    def __init__(self, vmanage_host, catalyst_center_host, username, password):
        self.vmanage_host = vmanage_host
        self.dnac_host = catalyst_center_host
        self.username = username
        self.password = password
        self.vmanage_session = self._create_vmanage_session()
        self.dnac_token = self._get_dnac_token()
    
    def _create_vmanage_session(self):
        session = requests.Session()
        login_url = f"https://{self.vmanage_host}/j_security_check"
        payload = {'j_username': self.username, 'j_password': self.password}
        session.post(login_url, data=payload, verify=False)
        
        token_url = f"https://{self.vmanage_host}/dataservice/client/token"
        token_response = session.get(token_url, verify=False)
        if token_response.status_code == 200:
            session.headers['X-XSRF-TOKEN'] = token_response.text
        return session
    
    def _get_dnac_token(self):
        url = f"https://{self.dnac_host}/dna/system/api/v1/auth/token"
        response = requests.post(url, auth=(self.username, self.password), verify=False)
        return response.json()['Token']
    
    def check_wan_edge_bgp(self, system_ip):
        """Check BGP status on WAN Edge"""
        url = f"https://{self.vmanage_host}/dataservice/device/bgp/neighbors"
        params = {'deviceId': system_ip}
        response = self.vmanage_session.get(url, params=params, verify=False)
        neighbors = response.json().get('data', [])
        
        results = []
        for neighbor in neighbors:
            if neighbor.get('vpn-id') in ['10', '20', '30', '40', '50']:
                results.append({
                    'vpn': neighbor.get('vpn-id'),
                    'neighbor': neighbor.get('peer-addr'),
                    'state': neighbor.get('state'),
                    'prefixes_received': neighbor.get('afi-safi-list', [{}])[0].get('prefixes-received', 0)
                })
        return results
    
    def check_border_health(self, border_ip):
        """Check SD-Access border health via Catalyst Center"""
        headers = {'X-Auth-Token': self.dnac_token}
        url = f"https://{self.dnac_host}/dna/intent/api/v1/network-device"
        params = {'managementIpAddress': border_ip}
        response = requests.get(url, headers=headers, params=params, verify=False)
        devices = response.json().get('response', [])
        
        if devices:
            return {
                'hostname': devices[0].get('hostname'),
                'reachability': devices[0].get('reachabilityStatus'),
                'role': devices[0].get('role')
            }
        return None
    
    def verify_handoff(self, sites):
        """Full handoff verification"""
        print("\n" + "="*70)
        print("SD-ACCESS TO SD-WAN HANDOFF VERIFICATION REPORT")
        print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*70)
        
        all_passed = True
        
        for site in sites:
            print(f"\n--- Site: {site['name']} ---")
            
            # Check WAN Edge BGP
            print("\n[WAN Edge BGP Status]")
            bgp_status = self.check_wan_edge_bgp(site['wan_edge_ip'])
            for bgp in bgp_status:
                status = '✓' if bgp['state'] == 'established' else '✗'
                print(f"  VPN {bgp['vpn']}: {bgp['neighbor']} - {bgp['state']} ({bgp['prefixes_received']} routes) {status}")
                if bgp['state'] != 'established':
                    all_passed = False
            
            # Check Border Node
            print("\n[SD-Access Border Status]")
            border_status = self.check_border_health(site['border_ip'])
            if border_status:
                reachable = border_status['reachability'] == 'Reachable'
                status = '✓' if reachable else '✗'
                print(f"  {border_status['hostname']}: {border_status['reachability']} {status}")
                if not reachable:
                    all_passed = False
            else:
                print(f"  ✗ Border not found")
                all_passed = False
        
        print("\n" + "="*70)
        print(f"OVERALL STATUS: {'✓ ALL CHECKS PASSED' if all_passed else '✗ SOME CHECKS FAILED'}")
        print("="*70)
        
        return all_passed


if __name__ == "__main__":
    sites = [
        {
            'name': 'Mumbai DC',
            'wan_edge_ip': '10.255.1.1',
            'border_ip': '10.10.50.101'
        },
        {
            'name': 'Chennai DR',
            'wan_edge_ip': '10.255.1.3',
            'border_ip': '10.10.51.101'
        }
    ]
    
    verifier = HandoffVerification(
        vmanage_host='sdwan-manager.abhavtech.com',
        catalyst_center_host='catalyst-center.abhavtech.com',
        username='admin',
        password='<password>'
    )
    
    verifier.verify_handoff(sites)
```

---

## References

- Cisco SD-Access SD-WAN Independent Domain Integration Guide
- Cisco Catalyst SD-WAN Design Guide
- TrustSec Design and Configuration Guide
- Abhavtech Network Architecture Standards

---

*Document Version: 2.1*
*Last Updated: December 30, 2025*
*Classification: Internal Use Only*
*Abhavtech.com - SD-WAN Documentation*
