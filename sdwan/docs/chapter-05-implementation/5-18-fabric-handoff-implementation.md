# 5.18 Fabric Handoff Implementation (Detailed)

## Document Information

| Field | Value |
|-------|-------|
| Document Title | Fabric Handoff Implementation - Detailed |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Abhavtech |
| Classification | Internal Use |
| Target Audience | Network Engineers, Implementation Teams |

---

## Overview

This section provides detailed, step-by-step implementation procedures for the SD-Access to SD-WAN fabric handoff configuration. This builds upon the architectural overview in Section 5.12 with complete CLI configurations, verification commands, and troubleshooting procedures.

### Handoff Architecture Reference

```
DETAILED FABRIC HANDOFF TOPOLOGY
=================================

SD-ACCESS FABRIC                                  SD-WAN OVERLAY
+------------------+                              +------------------+
|   Catalyst 9500  |                              |   C8500-12X4QC   |
|   Border Node    |                              |   WAN Edge       |
|   Mumbai DC      |                              |   Mumbai DC      |
+--------+---------+                              +--------+---------+
         |                                                 |
         | Te1/0/1 (Trunk)                    Te0/0/0 (Trunk) |
         |                                                 |
         +----------------[ L2 Switch ]-------------------+
                          (If needed)
                              OR
         +------------------[ Direct ]--------------------+
                           Connection

Physical Connection Options:
1. Direct fiber connection (recommended)
2. Through intermediate L2 switch
3. Port-channel for redundancy

Interface Types:
- 10GBASE-SR (SFP+) - Short reach
- 10GBASE-LR (SFP+) - Long reach (if distance > 300m)

Handoff Method: VRF-Lite with eBGP
- Each VN/VRF has dedicated VLAN and /30 subnet
- BGP advertises routes between domains
- TrustSec/SGT propagates security tags
```

---

## Pre-Implementation Checklist

### Hardware Verification

```
PRE-IMPLEMENTATION HARDWARE CHECKLIST
=====================================

Border Node (Catalyst 9500):
☐ 10G SFP+ ports available for handoff
☐ Sufficient switching capacity
☐ Current IOS-XE version (17.9.x+)
☐ TCAM resources for BGP routes

WAN Edge (C8500-12X4QC):
☐ 10G SFP+ ports available for handoff
☐ Current IOS-XE version (17.15.x)
☐ Sufficient memory for BGP tables
☐ Template capacity in vManage

Verification Commands:

! Border Node - Check available ports
show interface status | include Te1/0
show platform hardware fed active fwd-asic resource tcam utilization

! WAN Edge - Check available ports
show interface status | include Te0/0
show sdwan system status
```

### IP Addressing Plan

```
HANDOFF IP ADDRESSING SCHEME
============================

VRF/VPN Mapping:
┌────────────────┬──────────────┬───────────────┬──────────────────────┐
│ VN Name        │ SD-Access    │ SD-WAN        │ Handoff Subnet       │
│                │ VRF          │ VPN           │                      │
├────────────────┼──────────────┼───────────────┼──────────────────────┤
│ Corporate      │ Corp-Data    │ VPN 10        │ 10.100.100.0/30      │
│ Guest          │ Guest-Net    │ VPN 20        │ 10.100.200.0/30      │
│ Voice          │ Voice-UC     │ VPN 30        │ 10.100.130.0/30      │
│ IoT            │ IoT-Net      │ VPN 40        │ 10.100.140.0/30      │
│ Shared Svc     │ Shared-Svc   │ VPN 50        │ 10.100.150.0/30      │
└────────────────┴──────────────┴───────────────┴──────────────────────┘

Per-Subnet IP Assignment:
- .1 = WAN Edge (SD-WAN side)
- .2 = Border Node (SD-Access side)

VLAN Assignment for Handoff:
┌─────────────┬────────────────┐
│ VRF/VPN     │ Handoff VLAN   │
├─────────────┼────────────────┤
│ Corporate   │ VLAN 3010      │
│ Guest       │ VLAN 3020      │
│ Voice       │ VLAN 3030      │
│ IoT         │ VLAN 3040      │
│ Shared Svc  │ VLAN 3050      │
└─────────────┴────────────────┘
```

---

## Step-by-Step Implementation

### Phase 1: Physical Layer Configuration

#### Step 1.1: Border Node Physical Interface

```
!====================================================================
! BORDER NODE - PHYSICAL INTERFACE CONFIGURATION
! Device: Catalyst 9500 (Mumbai DC Border)
! Interface: TenGigabitEthernet1/0/1
!====================================================================

! Enter configuration mode
configure terminal

! Configure physical interface as routed port
interface TenGigabitEthernet1/0/1
  description SD-WAN-HANDOFF-TO-WAN-EDGE
  no switchport
  no ip address
  no shutdown

! Enable CTS on physical interface (required for SGT)
  cts manual
    policy static sgt 0 trusted
    no propagate sgt

! Configure for jumbo frames (optional but recommended)
  mtu 9000

exit

! Verify physical interface
do show interface TenGigabitEthernet1/0/1 status
do show interface TenGigabitEthernet1/0/1 | include line protocol
```

#### Step 1.2: WAN Edge Physical Interface

```
!====================================================================
! WAN EDGE - PHYSICAL INTERFACE CONFIGURATION
! Device: C8500-12X4QC (Mumbai DC WAN Edge)
! Interface: TenGigabitEthernet0/0/0
!====================================================================

! Note: This can be configured via CLI or vManage template

! CLI Method:
configure terminal

interface TenGigabitEthernet0/0/0
  description SDACCESS-HANDOFF-TO-BORDER
  no ip address
  no shutdown
  mtu 9000

exit

! Verify physical interface
do show interface TenGigabitEthernet0/0/0 status
do show interface TenGigabitEthernet0/0/0 | include line protocol
```

### Phase 2: Subinterface Configuration

#### Step 2.1: Border Node Subinterfaces (All VRFs)

```
!====================================================================
! BORDER NODE - SUBINTERFACE CONFIGURATION
! All VRFs with dot1Q encapsulation
!====================================================================

configure terminal

!--------------------------------------------------------------------
! Corporate VRF - VLAN 3010
!--------------------------------------------------------------------
interface TenGigabitEthernet1/0/1.3010
  description HANDOFF-CORPORATE-VPN10
  encapsulation dot1Q 3010
  vrf forwarding Corporate-Data
  ip address 10.100.100.2 255.255.255.252
  no shutdown
  
  ! CTS Configuration for SGT
  cts manual
    policy static sgt 100 trusted
    propagate sgt

!--------------------------------------------------------------------
! Guest VRF - VLAN 3020
!--------------------------------------------------------------------
interface TenGigabitEthernet1/0/1.3020
  description HANDOFF-GUEST-VPN20
  encapsulation dot1Q 3020
  vrf forwarding Guest-Network
  ip address 10.100.200.2 255.255.255.252
  no shutdown
  
  cts manual
    policy static sgt 200 trusted
    propagate sgt

!--------------------------------------------------------------------
! Voice VRF - VLAN 3030
!--------------------------------------------------------------------
interface TenGigabitEthernet1/0/1.3030
  description HANDOFF-VOICE-VPN30
  encapsulation dot1Q 3030
  vrf forwarding Voice-UC
  ip address 10.100.130.2 255.255.255.252
  no shutdown
  
  cts manual
    policy static sgt 110 trusted
    propagate sgt

!--------------------------------------------------------------------
! IoT VRF - VLAN 3040
!--------------------------------------------------------------------
interface TenGigabitEthernet1/0/1.3040
  description HANDOFF-IOT-VPN40
  encapsulation dot1Q 3040
  vrf forwarding IoT-Network
  ip address 10.100.140.2 255.255.255.252
  no shutdown
  
  cts manual
    policy static sgt 120 trusted
    propagate sgt

!--------------------------------------------------------------------
! Shared Services VRF - VLAN 3050
!--------------------------------------------------------------------
interface TenGigabitEthernet1/0/1.3050
  description HANDOFF-SHARED-VPN50
  encapsulation dot1Q 3050
  vrf forwarding Shared-Services
  ip address 10.100.150.2 255.255.255.252
  no shutdown
  
  cts manual
    policy static sgt 300 trusted
    propagate sgt

exit

! Verify all subinterfaces
do show ip interface brief | include Te1/0/1
```

#### Step 2.2: WAN Edge Subinterfaces (All VPNs)

```
!====================================================================
! WAN EDGE - SUBINTERFACE CONFIGURATION
! All Service VPNs with dot1Q encapsulation
!====================================================================

configure terminal

!--------------------------------------------------------------------
! VPN 10 (Corporate) - VLAN 3010
!--------------------------------------------------------------------
interface TenGigabitEthernet0/0/0.10
  description SDACCESS-HANDOFF-VPN10
  encapsulation dot1Q 3010
  ip address 10.100.100.1 255.255.255.252
  no shutdown
  
  ! CTS Configuration
  cts manual
    policy static sgt 100 trusted
    propagate sgt

! Associate with VPN 10
sdwan
  interface TenGigabitEthernet0/0/0.10
    tunnel-interface
    encapsulation ipsec
    color mpls
    no allow-service all
    allow-service bgp
    no shutdown

!--------------------------------------------------------------------
! VPN 20 (Guest) - VLAN 3020
!--------------------------------------------------------------------
interface TenGigabitEthernet0/0/0.20
  description SDACCESS-HANDOFF-VPN20
  encapsulation dot1Q 3020
  ip address 10.100.200.1 255.255.255.252
  no shutdown
  
  cts manual
    policy static sgt 200 trusted
    propagate sgt

!--------------------------------------------------------------------
! VPN 30 (Voice) - VLAN 3030
!--------------------------------------------------------------------
interface TenGigabitEthernet0/0/0.30
  description SDACCESS-HANDOFF-VPN30
  encapsulation dot1Q 3030
  ip address 10.100.130.1 255.255.255.252
  no shutdown
  
  cts manual
    policy static sgt 110 trusted
    propagate sgt

!--------------------------------------------------------------------
! VPN 40 (IoT) - VLAN 3040
!--------------------------------------------------------------------
interface TenGigabitEthernet0/0/0.40
  description SDACCESS-HANDOFF-VPN40
  encapsulation dot1Q 3040
  ip address 10.100.140.1 255.255.255.252
  no shutdown
  
  cts manual
    policy static sgt 120 trusted
    propagate sgt

!--------------------------------------------------------------------
! VPN 50 (Shared Services) - VLAN 3050
!--------------------------------------------------------------------
interface TenGigabitEthernet0/0/0.50
  description SDACCESS-HANDOFF-VPN50
  encapsulation dot1Q 3050
  ip address 10.100.150.1 255.255.255.252
  no shutdown
  
  cts manual
    policy static sgt 300 trusted
    propagate sgt

exit

! Verify all subinterfaces
do show ip interface brief | include Te0/0/0
```

### Phase 3: BGP Configuration

#### Step 3.1: Border Node BGP (AS 65200)

```
!====================================================================
! BORDER NODE - COMPLETE BGP CONFIGURATION
! AS 65200 (SD-Access)
!====================================================================

configure terminal

! BGP Router Configuration
router bgp 65200
  bgp router-id 10.10.50.5
  bgp log-neighbor-changes
  no bgp default ipv4-unicast
  
  ! Peer Template for SD-WAN Neighbors
  template peer-session SDWAN-SESSION
    remote-as 65100
    password 7 <encrypted_password>
    timers 3 10
    fall-over bfd
  exit-peer-session
  
  template peer-policy SDWAN-POLICY
    send-community both
    soft-reconfiguration inbound
    maximum-prefix 1000 warning-only
  exit-peer-policy
  
  !------------------------------------------------------------------
  ! Corporate VRF
  !------------------------------------------------------------------
  address-family ipv4 vrf Corporate-Data
    redistribute lisp metric 100
    redistribute connected
    aggregate-address 10.10.0.0 255.255.0.0 summary-only
    
    neighbor 10.100.100.1 inherit peer-session SDWAN-SESSION
    neighbor 10.100.100.1 description SD-WAN-VPN10
    neighbor 10.100.100.1 activate
    neighbor 10.100.100.1 inherit peer-policy SDWAN-POLICY
    neighbor 10.100.100.1 route-map SDWAN-IMPORT-CORP in
    neighbor 10.100.100.1 route-map SDWAN-EXPORT-CORP out
    
    maximum-paths 2
    maximum-paths ibgp 2
  exit-address-family
  
  !------------------------------------------------------------------
  ! Guest VRF
  !------------------------------------------------------------------
  address-family ipv4 vrf Guest-Network
    redistribute lisp metric 100
    redistribute connected
    aggregate-address 10.30.0.0 255.255.0.0 summary-only
    
    neighbor 10.100.200.1 inherit peer-session SDWAN-SESSION
    neighbor 10.100.200.1 description SD-WAN-VPN20
    neighbor 10.100.200.1 activate
    neighbor 10.100.200.1 inherit peer-policy SDWAN-POLICY
    neighbor 10.100.200.1 route-map SDWAN-IMPORT-GUEST in
    neighbor 10.100.200.1 route-map SDWAN-EXPORT-GUEST out
    
    maximum-paths 2
  exit-address-family
  
  !------------------------------------------------------------------
  ! Voice VRF
  !------------------------------------------------------------------
  address-family ipv4 vrf Voice-UC
    redistribute lisp metric 100
    redistribute connected
    aggregate-address 10.13.0.0 255.255.0.0 summary-only
    
    neighbor 10.100.130.1 inherit peer-session SDWAN-SESSION
    neighbor 10.100.130.1 description SD-WAN-VPN30
    neighbor 10.100.130.1 activate
    neighbor 10.100.130.1 inherit peer-policy SDWAN-POLICY
    neighbor 10.100.130.1 route-map SDWAN-IMPORT-VOICE in
    neighbor 10.100.130.1 route-map SDWAN-EXPORT-VOICE out
    
    maximum-paths 2
  exit-address-family
  
  !------------------------------------------------------------------
  ! IoT VRF
  !------------------------------------------------------------------
  address-family ipv4 vrf IoT-Network
    redistribute lisp metric 100
    redistribute connected
    aggregate-address 10.14.0.0 255.255.0.0 summary-only
    
    neighbor 10.100.140.1 inherit peer-session SDWAN-SESSION
    neighbor 10.100.140.1 description SD-WAN-VPN40
    neighbor 10.100.140.1 activate
    neighbor 10.100.140.1 inherit peer-policy SDWAN-POLICY
    neighbor 10.100.140.1 route-map SDWAN-IMPORT-IOT in
    neighbor 10.100.140.1 route-map SDWAN-EXPORT-IOT out
    
    maximum-paths 2
  exit-address-family
  
  !------------------------------------------------------------------
  ! Shared Services VRF
  !------------------------------------------------------------------
  address-family ipv4 vrf Shared-Services
    redistribute lisp metric 100
    redistribute connected
    aggregate-address 10.15.0.0 255.255.0.0 summary-only
    
    neighbor 10.100.150.1 inherit peer-session SDWAN-SESSION
    neighbor 10.100.150.1 description SD-WAN-VPN50
    neighbor 10.100.150.1 activate
    neighbor 10.100.150.1 inherit peer-policy SDWAN-POLICY
    neighbor 10.100.150.1 route-map SDWAN-IMPORT-SHARED in
    neighbor 10.100.150.1 route-map SDWAN-EXPORT-SHARED out
    
    maximum-paths 2
  exit-address-family

exit

!--------------------------------------------------------------------
! Route Maps for Traffic Engineering
!--------------------------------------------------------------------

! Import from SD-WAN (set local preference based on source)
route-map SDWAN-IMPORT-CORP permit 10
  description Routes from SD-WAN overlay
  set local-preference 150
  set community 65200:100 additive

route-map SDWAN-IMPORT-GUEST permit 10
  set local-preference 150
  set community 65200:200 additive

route-map SDWAN-IMPORT-VOICE permit 10
  set local-preference 150
  set community 65200:300 additive

route-map SDWAN-IMPORT-IOT permit 10
  set local-preference 150
  set community 65200:400 additive

route-map SDWAN-IMPORT-SHARED permit 10
  set local-preference 150
  set community 65200:500 additive

! Export to SD-WAN (filter what to advertise)
route-map SDWAN-EXPORT-CORP permit 10
  match ip address prefix-list CORP-PREFIXES
  set metric 100

route-map SDWAN-EXPORT-GUEST permit 10
  match ip address prefix-list GUEST-PREFIXES
  set metric 100

route-map SDWAN-EXPORT-VOICE permit 10
  match ip address prefix-list VOICE-PREFIXES
  set metric 100

route-map SDWAN-EXPORT-IOT permit 10
  match ip address prefix-list IOT-PREFIXES
  set metric 100

route-map SDWAN-EXPORT-SHARED permit 10
  match ip address prefix-list SHARED-PREFIXES
  set metric 100

!--------------------------------------------------------------------
! Prefix Lists
!--------------------------------------------------------------------
ip prefix-list CORP-PREFIXES seq 10 permit 10.10.0.0/16 le 24
ip prefix-list CORP-PREFIXES seq 20 permit 10.11.0.0/16 le 24

ip prefix-list GUEST-PREFIXES seq 10 permit 10.30.0.0/16 le 24

ip prefix-list VOICE-PREFIXES seq 10 permit 10.13.0.0/16 le 24

ip prefix-list IOT-PREFIXES seq 10 permit 10.14.0.0/16 le 24

ip prefix-list SHARED-PREFIXES seq 10 permit 10.15.0.0/16 le 24

end

! Save configuration
write memory
```

#### Step 3.2: WAN Edge BGP (AS 65100)

```
!====================================================================
! WAN EDGE - COMPLETE BGP CONFIGURATION
! AS 65100 (SD-WAN)
!====================================================================

configure terminal

router bgp 65100
  bgp router-id 10.255.0.101
  bgp log-neighbor-changes
  no bgp default ipv4-unicast
  
  !------------------------------------------------------------------
  ! VPN 10 (Corporate)
  !------------------------------------------------------------------
  address-family ipv4 vrf 10
    redistribute omp
    redistribute connected
    redistribute static
    
    neighbor 10.100.100.2 remote-as 65200
    neighbor 10.100.100.2 description SDACCESS-BORDER-CORP
    neighbor 10.100.100.2 password <encrypted_password>
    neighbor 10.100.100.2 activate
    neighbor 10.100.100.2 send-community both
    neighbor 10.100.100.2 soft-reconfiguration inbound
    neighbor 10.100.100.2 route-map SDACCESS-IMPORT-CORP in
    neighbor 10.100.100.2 route-map SDACCESS-EXPORT-CORP out
    neighbor 10.100.100.2 maximum-prefix 1000 warning-only
    
    maximum-paths 4
  exit-address-family
  
  !------------------------------------------------------------------
  ! VPN 20 (Guest)
  !------------------------------------------------------------------
  address-family ipv4 vrf 20
    redistribute omp
    redistribute connected
    
    neighbor 10.100.200.2 remote-as 65200
    neighbor 10.100.200.2 description SDACCESS-BORDER-GUEST
    neighbor 10.100.200.2 password <encrypted_password>
    neighbor 10.100.200.2 activate
    neighbor 10.100.200.2 send-community both
    neighbor 10.100.200.2 soft-reconfiguration inbound
    neighbor 10.100.200.2 route-map SDACCESS-IMPORT-GUEST in
    neighbor 10.100.200.2 route-map SDACCESS-EXPORT-GUEST out
    
    maximum-paths 4
  exit-address-family
  
  !------------------------------------------------------------------
  ! VPN 30 (Voice)
  !------------------------------------------------------------------
  address-family ipv4 vrf 30
    redistribute omp
    redistribute connected
    
    neighbor 10.100.130.2 remote-as 65200
    neighbor 10.100.130.2 description SDACCESS-BORDER-VOICE
    neighbor 10.100.130.2 password <encrypted_password>
    neighbor 10.100.130.2 activate
    neighbor 10.100.130.2 send-community both
    neighbor 10.100.130.2 soft-reconfiguration inbound
    neighbor 10.100.130.2 route-map SDACCESS-IMPORT-VOICE in
    neighbor 10.100.130.2 route-map SDACCESS-EXPORT-VOICE out
    
    maximum-paths 4
  exit-address-family
  
  !------------------------------------------------------------------
  ! VPN 40 (IoT)
  !------------------------------------------------------------------
  address-family ipv4 vrf 40
    redistribute omp
    redistribute connected
    
    neighbor 10.100.140.2 remote-as 65200
    neighbor 10.100.140.2 description SDACCESS-BORDER-IOT
    neighbor 10.100.140.2 password <encrypted_password>
    neighbor 10.100.140.2 activate
    neighbor 10.100.140.2 send-community both
    neighbor 10.100.140.2 soft-reconfiguration inbound
    neighbor 10.100.140.2 route-map SDACCESS-IMPORT-IOT in
    neighbor 10.100.140.2 route-map SDACCESS-EXPORT-IOT out
    
    maximum-paths 4
  exit-address-family
  
  !------------------------------------------------------------------
  ! VPN 50 (Shared Services)
  !------------------------------------------------------------------
  address-family ipv4 vrf 50
    redistribute omp
    redistribute connected
    
    neighbor 10.100.150.2 remote-as 65200
    neighbor 10.100.150.2 description SDACCESS-BORDER-SHARED
    neighbor 10.100.150.2 password <encrypted_password>
    neighbor 10.100.150.2 activate
    neighbor 10.100.150.2 send-community both
    neighbor 10.100.150.2 soft-reconfiguration inbound
    neighbor 10.100.150.2 route-map SDACCESS-IMPORT-SHARED in
    neighbor 10.100.150.2 route-map SDACCESS-EXPORT-SHARED out
    
    maximum-paths 4
  exit-address-family

exit

!--------------------------------------------------------------------
! OMP Advertisement Configuration
!--------------------------------------------------------------------
sdwan
  omp
    advertise bgp
    advertise connected
    advertise static
    ecmp-limit 4

!--------------------------------------------------------------------
! Route Maps for Traffic Engineering
!--------------------------------------------------------------------

! Import from SD-Access
route-map SDACCESS-IMPORT-CORP permit 10
  set metric 100

route-map SDACCESS-IMPORT-GUEST permit 10
  set metric 100

route-map SDACCESS-IMPORT-VOICE permit 10
  set metric 100

route-map SDACCESS-IMPORT-IOT permit 10
  set metric 100

route-map SDACCESS-IMPORT-SHARED permit 10
  set metric 100

! Export to SD-Access
route-map SDACCESS-EXPORT-CORP permit 10
  match ip address prefix-list WAN-CORP-PREFIXES
  set metric 100

route-map SDACCESS-EXPORT-GUEST permit 10
  match ip address prefix-list WAN-GUEST-PREFIXES
  set metric 100

route-map SDACCESS-EXPORT-VOICE permit 10
  match ip address prefix-list WAN-VOICE-PREFIXES
  set metric 100

route-map SDACCESS-EXPORT-IOT permit 10
  match ip address prefix-list WAN-IOT-PREFIXES
  set metric 100

route-map SDACCESS-EXPORT-SHARED permit 10
  match ip address prefix-list WAN-SHARED-PREFIXES
  set metric 100

!--------------------------------------------------------------------
! Prefix Lists (Remote site prefixes via SD-WAN)
!--------------------------------------------------------------------
ip prefix-list WAN-CORP-PREFIXES seq 10 permit 10.20.0.0/16 le 24
ip prefix-list WAN-CORP-PREFIXES seq 20 permit 10.21.0.0/16 le 24

ip prefix-list WAN-GUEST-PREFIXES seq 10 permit 10.31.0.0/16 le 24

ip prefix-list WAN-VOICE-PREFIXES seq 10 permit 10.23.0.0/16 le 24

ip prefix-list WAN-IOT-PREFIXES seq 10 permit 10.24.0.0/16 le 24

ip prefix-list WAN-SHARED-PREFIXES seq 10 permit 10.25.0.0/16 le 24

end

write memory
```

### Phase 4: TrustSec/SGT Configuration

#### Step 4.1: ISE Integration on Border Node

```
!====================================================================
! BORDER NODE - TRUSTSEC CONFIGURATION
! ISE Integration for SGT
!====================================================================

configure terminal

! CTS Credentials (from ISE)
cts credentials id BORDER-MUM-01 password 0 <cts_password>

! AAA Configuration for CTS
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa authorization network ISE-CTS-LIST group radius
aaa accounting dot1x default start-stop group radius

! RADIUS Server Configuration
radius server ISE-PRIMARY
  address ipv4 10.10.50.21 auth-port 1812 acct-port 1813
  key 0 <radius_key>

radius server ISE-SECONDARY
  address ipv4 10.10.50.22 auth-port 1812 acct-port 1813
  key 0 <radius_key>

aaa group server radius ISE-SERVERS
  server name ISE-PRIMARY
  server name ISE-SECONDARY

! CTS Global Configuration
cts authorization list ISE-CTS-LIST
cts role-based enforcement

! Enable CTS SXP (optional - for SGT exchange)
cts sxp enable
cts sxp default password <sxp_password>
cts sxp default source-ip 10.10.50.5
cts sxp connection peer 10.10.50.21 password default mode peer speaker hold-time 0 0

! SGT Mappings (manual fallback)
cts role-based sgt-map 10.10.0.0/16 sgt 100
cts role-based sgt-map 10.13.0.0/16 sgt 110
cts role-based sgt-map 10.14.0.0/16 sgt 120
cts role-based sgt-map 10.30.0.0/16 sgt 200
cts role-based sgt-map 10.15.0.0/16 sgt 300

! Verify CTS
do show cts credentials
do show cts pacs
do show cts role-based sgt-map all
```

#### Step 4.2: CTS on WAN Edge

```
!====================================================================
! WAN EDGE - TRUSTSEC CONFIGURATION
!====================================================================

configure terminal

! CTS Credentials
cts credentials id WAN-EDGE-MUM-01 password 0 <cts_password>

! AAA for CTS
aaa new-model
aaa authentication dot1x default group radius
aaa authorization network default group radius
aaa authorization network CTS-AUTH group radius

! RADIUS Server (ISE)
radius server ISE-01
  address ipv4 10.10.50.21 auth-port 1812 acct-port 1813
  key 0 <radius_key>

radius server ISE-02
  address ipv4 10.10.50.22 auth-port 1812 acct-port 1813
  key 0 <radius_key>

aaa group server radius ISE-GROUP
  server name ISE-01
  server name ISE-02

! CTS Configuration
cts authorization list CTS-AUTH
cts role-based enforcement

! Enable SGT propagation on SD-WAN tunnels
! This is typically configured via vManage template

! Verify
do show cts credentials
do show cts interface summary
do show cts role-based counters
```

### Phase 5: BFD Configuration (Optional but Recommended)

```
!====================================================================
! BFD FOR FAST FAILOVER
!====================================================================

! Border Node BFD
configure terminal

! Enable BFD on subinterfaces
interface TenGigabitEthernet1/0/1.3010
  bfd interval 100 min_rx 100 multiplier 3

interface TenGigabitEthernet1/0/1.3020
  bfd interval 100 min_rx 100 multiplier 3

interface TenGigabitEthernet1/0/1.3030
  bfd interval 100 min_rx 100 multiplier 3

interface TenGigabitEthernet1/0/1.3040
  bfd interval 100 min_rx 100 multiplier 3

interface TenGigabitEthernet1/0/1.3050
  bfd interval 100 min_rx 100 multiplier 3

! BGP BFD Fall-over (already in peer template)
router bgp 65200
  template peer-session SDWAN-SESSION
    fall-over bfd

exit

! WAN Edge BFD
interface TenGigabitEthernet0/0/0.10
  bfd interval 100 min_rx 100 multiplier 3

! Repeat for all subinterfaces...

! Verify BFD
do show bfd neighbors
```

---

## vManage Template Configuration

### Handoff Feature Template

```yaml
#====================================================================
# SD-WAN MANAGER - HANDOFF FEATURE TEMPLATE
# Template for SD-Access fabric handoff configuration
#====================================================================

template_name: "Feature-SDACCESS-Handoff"
template_description: "SD-Access Border Handoff - VRF-Lite/BGP"
device_types:
  - "vedge-C8300-1N1S-6T"
  - "vedge-C8300-2N2S-6T"
  - "vedge-C8500-12X4QC"

# Interface Configuration Section
interfaces:
  - name: "TenGigabitEthernet0/0/0"
    description: "SDACCESS-HANDOFF"
    shutdown: false
    
    subinterfaces:
      - vlan_id: "{{corp_handoff_vlan}}"
        ip_address: "{{corp_handoff_ip}}"
        ip_mask: "255.255.255.252"
        vrf: 10
        cts:
          manual: true
          sgt: 100
          propagate: true
      
      - vlan_id: "{{guest_handoff_vlan}}"
        ip_address: "{{guest_handoff_ip}}"
        ip_mask: "255.255.255.252"
        vrf: 20
        cts:
          manual: true
          sgt: 200
          propagate: true
      
      - vlan_id: "{{voice_handoff_vlan}}"
        ip_address: "{{voice_handoff_ip}}"
        ip_mask: "255.255.255.252"
        vrf: 30
        cts:
          manual: true
          sgt: 110
          propagate: true
      
      - vlan_id: "{{iot_handoff_vlan}}"
        ip_address: "{{iot_handoff_ip}}"
        ip_mask: "255.255.255.252"
        vrf: 40
        cts:
          manual: true
          sgt: 120
          propagate: true
      
      - vlan_id: "{{shared_handoff_vlan}}"
        ip_address: "{{shared_handoff_ip}}"
        ip_mask: "255.255.255.252"
        vrf: 50
        cts:
          manual: true
          sgt: 300
          propagate: true

# BGP Configuration Section
bgp:
  as_number: 65100
  router_id: "{{system_ip}}"
  
  address_families:
    - vrf: 10
      neighbor:
        address: "{{corp_border_ip}}"
        remote_as: 65200
        password: "{{bgp_password}}"
        send_community: "both"
        soft_reconfig_inbound: true
      redistribute:
        - omp
        - connected
        - static
    
    - vrf: 20
      neighbor:
        address: "{{guest_border_ip}}"
        remote_as: 65200
        password: "{{bgp_password}}"
        send_community: "both"
      redistribute:
        - omp
        - connected
    
    - vrf: 30
      neighbor:
        address: "{{voice_border_ip}}"
        remote_as: 65200
        password: "{{bgp_password}}"
        send_community: "both"
      redistribute:
        - omp
        - connected
    
    - vrf: 40
      neighbor:
        address: "{{iot_border_ip}}"
        remote_as: 65200
        password: "{{bgp_password}}"
        send_community: "both"
      redistribute:
        - omp
        - connected
    
    - vrf: 50
      neighbor:
        address: "{{shared_border_ip}}"
        remote_as: 65200
        password: "{{bgp_password}}"
        send_community: "both"
      redistribute:
        - omp
        - connected

# OMP Configuration
omp:
  advertise_bgp: true
  advertise_connected: true
  advertise_static: true
  ecmp_limit: 4

# Variables
variables:
  corp_handoff_vlan:
    description: "Corporate Handoff VLAN"
    type: "integer"
    default: 3010
  
  corp_handoff_ip:
    description: "Corporate Handoff IP (WAN Edge)"
    type: "ipv4"
    default: "10.100.100.1"
  
  corp_border_ip:
    description: "Corporate Border IP"
    type: "ipv4"
    default: "10.100.100.2"
  
  guest_handoff_vlan:
    type: "integer"
    default: 3020
  
  guest_handoff_ip:
    type: "ipv4"
    default: "10.100.200.1"
  
  guest_border_ip:
    type: "ipv4"
    default: "10.100.200.2"
  
  voice_handoff_vlan:
    type: "integer"
    default: 3030
  
  voice_handoff_ip:
    type: "ipv4"
    default: "10.100.130.1"
  
  voice_border_ip:
    type: "ipv4"
    default: "10.100.130.2"
  
  iot_handoff_vlan:
    type: "integer"
    default: 3040
  
  iot_handoff_ip:
    type: "ipv4"
    default: "10.100.140.1"
  
  iot_border_ip:
    type: "ipv4"
    default: "10.100.140.2"
  
  shared_handoff_vlan:
    type: "integer"
    default: 3050
  
  shared_handoff_ip:
    type: "ipv4"
    default: "10.100.150.1"
  
  shared_border_ip:
    type: "ipv4"
    default: "10.100.150.2"
  
  bgp_password:
    type: "passphrase"
    description: "BGP Neighbor Password"
```

---

## Verification Procedures

### Comprehensive Verification Script

```python
#!/usr/bin/env python3
"""
SD-Access to SD-WAN Handoff Verification Script
Comprehensive validation of fabric handoff configuration
"""

import paramiko
import re
import json
from datetime import datetime
from typing import Dict, List, Tuple

class HandoffVerification:
    def __init__(self):
        self.results = {
            'timestamp': datetime.now().isoformat(),
            'border_node': {},
            'wan_edge': {},
            'end_to_end': {},
            'overall_status': 'UNKNOWN'
        }
    
    def connect_device(self, host: str, username: str, password: str) -> paramiko.SSHClient:
        """Establish SSH connection to device"""
        client = paramiko.SSHClient()
        client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        client.connect(host, username=username, password=password, look_for_keys=False)
        return client
    
    def run_command(self, client: paramiko.SSHClient, command: str) -> str:
        """Execute command and return output"""
        stdin, stdout, stderr = client.exec_command(command)
        return stdout.read().decode('utf-8')
    
    def verify_border_node(self, host: str, username: str, password: str) -> Dict:
        """Verify border node configuration and status"""
        results = {
            'host': host,
            'checks': []
        }
        
        try:
            client = self.connect_device(host, username, password)
            
            # Check 1: Physical Interface Status
            output = self.run_command(client, "show interface Te1/0/1 | include line protocol")
            interface_up = "line protocol is up" in output
            results['checks'].append({
                'name': 'Physical Interface',
                'status': 'PASS' if interface_up else 'FAIL',
                'details': output.strip()
            })
            
            # Check 2: Subinterfaces Status
            output = self.run_command(client, "show ip interface brief | include Te1/0/1\\.")
            subint_count = len([l for l in output.split('\n') if 'up' in l.lower()])
            results['checks'].append({
                'name': 'Subinterfaces',
                'status': 'PASS' if subint_count >= 5 else 'FAIL',
                'details': f"{subint_count} subinterfaces up"
            })
            
            # Check 3: BGP Neighbors
            output = self.run_command(client, "show bgp vpnv4 unicast all summary")
            bgp_established = output.count('Established') if 'Established' in output else 0
            results['checks'].append({
                'name': 'BGP Neighbors',
                'status': 'PASS' if bgp_established >= 5 else 'FAIL',
                'details': f"{bgp_established} BGP neighbors established"
            })
            
            # Check 4: Routes Received from SD-WAN
            output = self.run_command(client, "show bgp vpnv4 unicast vrf Corporate-Data | include 65100")
            routes_received = len([l for l in output.split('\n') if '65100' in l])
            results['checks'].append({
                'name': 'Routes from SD-WAN',
                'status': 'PASS' if routes_received > 0 else 'WARN',
                'details': f"{routes_received} routes received from AS 65100"
            })
            
            # Check 5: CTS Status
            output = self.run_command(client, "show cts interface Te1/0/1.3010")
            cts_enabled = "CTS is enabled" in output or "SGT" in output
            results['checks'].append({
                'name': 'CTS/TrustSec',
                'status': 'PASS' if cts_enabled else 'WARN',
                'details': 'CTS enabled' if cts_enabled else 'CTS not detected'
            })
            
            client.close()
            
        except Exception as e:
            results['checks'].append({
                'name': 'Connection',
                'status': 'FAIL',
                'details': str(e)
            })
        
        # Calculate overall status
        statuses = [c['status'] for c in results['checks']]
        if all(s == 'PASS' for s in statuses):
            results['overall'] = 'PASS'
        elif any(s == 'FAIL' for s in statuses):
            results['overall'] = 'FAIL'
        else:
            results['overall'] = 'WARN'
        
        return results
    
    def verify_wan_edge(self, host: str, username: str, password: str) -> Dict:
        """Verify WAN Edge configuration and status"""
        results = {
            'host': host,
            'checks': []
        }
        
        try:
            client = self.connect_device(host, username, password)
            
            # Check 1: Physical Interface Status
            output = self.run_command(client, "show interface Te0/0/0 | include line protocol")
            interface_up = "line protocol is up" in output
            results['checks'].append({
                'name': 'Physical Interface',
                'status': 'PASS' if interface_up else 'FAIL',
                'details': output.strip()
            })
            
            # Check 2: Subinterfaces Status
            output = self.run_command(client, "show ip interface brief | include Te0/0/0\\.")
            subint_count = len([l for l in output.split('\n') if 'up' in l.lower()])
            results['checks'].append({
                'name': 'Subinterfaces',
                'status': 'PASS' if subint_count >= 5 else 'FAIL',
                'details': f"{subint_count} subinterfaces up"
            })
            
            # Check 3: BGP Neighbors
            output = self.run_command(client, "show bgp vpnv4 unicast all summary")
            bgp_established = output.count('65200')
            results['checks'].append({
                'name': 'BGP to Border',
                'status': 'PASS' if bgp_established >= 5 else 'FAIL',
                'details': f"BGP sessions with AS 65200: {bgp_established}"
            })
            
            # Check 4: OMP Routes
            output = self.run_command(client, "show sdwan omp routes vpn 10 | count")
            omp_routes = re.search(r'Number of lines.*?(\d+)', output)
            route_count = int(omp_routes.group(1)) if omp_routes else 0
            results['checks'].append({
                'name': 'OMP Routes VPN 10',
                'status': 'PASS' if route_count > 0 else 'WARN',
                'details': f"{route_count} OMP routes in VPN 10"
            })
            
            # Check 5: Control Connections
            output = self.run_command(client, "show sdwan control connections | include vSmart")
            vsmart_connected = 'vsmart' in output.lower() and 'up' in output.lower()
            results['checks'].append({
                'name': 'vSmart Connection',
                'status': 'PASS' if vsmart_connected else 'FAIL',
                'details': 'vSmart connected' if vsmart_connected else 'vSmart not connected'
            })
            
            client.close()
            
        except Exception as e:
            results['checks'].append({
                'name': 'Connection',
                'status': 'FAIL',
                'details': str(e)
            })
        
        # Calculate overall status
        statuses = [c['status'] for c in results['checks']]
        if all(s == 'PASS' for s in statuses):
            results['overall'] = 'PASS'
        elif any(s == 'FAIL' for s in statuses):
            results['overall'] = 'FAIL'
        else:
            results['overall'] = 'WARN'
        
        return results
    
    def verify_end_to_end(self, border_host: str, wan_edge_host: str,
                          username: str, password: str) -> Dict:
        """Verify end-to-end connectivity"""
        results = {
            'checks': []
        }
        
        try:
            # Test from Border Node to WAN Edge
            border_client = self.connect_device(border_host, username, password)
            
            # Ping test per VRF
            vrfs = [
                ('Corporate-Data', '10.100.100.1'),
                ('Guest-Network', '10.100.200.1'),
                ('Voice-UC', '10.100.130.1'),
                ('IoT-Network', '10.100.140.1'),
                ('Shared-Services', '10.100.150.1')
            ]
            
            for vrf_name, peer_ip in vrfs:
                output = self.run_command(
                    border_client, 
                    f"ping vrf {vrf_name} {peer_ip} repeat 3"
                )
                success = "!!!" in output or "Success rate is 100" in output
                results['checks'].append({
                    'name': f'Ping {vrf_name}',
                    'status': 'PASS' if success else 'FAIL',
                    'details': f"Border -> WAN Edge ({peer_ip})"
                })
            
            border_client.close()
            
        except Exception as e:
            results['checks'].append({
                'name': 'End-to-End Test',
                'status': 'FAIL',
                'details': str(e)
            })
        
        # Calculate overall status
        statuses = [c['status'] for c in results['checks']]
        if all(s == 'PASS' for s in statuses):
            results['overall'] = 'PASS'
        elif any(s == 'FAIL' for s in statuses):
            results['overall'] = 'FAIL'
        else:
            results['overall'] = 'WARN'
        
        return results
    
    def generate_report(self) -> str:
        """Generate verification report"""
        report = []
        report.append("=" * 70)
        report.append("SD-ACCESS TO SD-WAN HANDOFF VERIFICATION REPORT")
        report.append(f"Generated: {self.results['timestamp']}")
        report.append("=" * 70)
        
        # Border Node Results
        if self.results.get('border_node'):
            report.append("\n[BORDER NODE VERIFICATION]")
            report.append(f"Host: {self.results['border_node'].get('host', 'N/A')}")
            for check in self.results['border_node'].get('checks', []):
                status_icon = "✓" if check['status'] == 'PASS' else "✗" if check['status'] == 'FAIL' else "⚠"
                report.append(f"  {status_icon} {check['name']}: {check['status']}")
                report.append(f"    Details: {check['details']}")
            report.append(f"  Overall: {self.results['border_node'].get('overall', 'N/A')}")
        
        # WAN Edge Results
        if self.results.get('wan_edge'):
            report.append("\n[WAN EDGE VERIFICATION]")
            report.append(f"Host: {self.results['wan_edge'].get('host', 'N/A')}")
            for check in self.results['wan_edge'].get('checks', []):
                status_icon = "✓" if check['status'] == 'PASS' else "✗" if check['status'] == 'FAIL' else "⚠"
                report.append(f"  {status_icon} {check['name']}: {check['status']}")
                report.append(f"    Details: {check['details']}")
            report.append(f"  Overall: {self.results['wan_edge'].get('overall', 'N/A')}")
        
        # End-to-End Results
        if self.results.get('end_to_end'):
            report.append("\n[END-TO-END VERIFICATION]")
            for check in self.results['end_to_end'].get('checks', []):
                status_icon = "✓" if check['status'] == 'PASS' else "✗" if check['status'] == 'FAIL' else "⚠"
                report.append(f"  {status_icon} {check['name']}: {check['status']}")
            report.append(f"  Overall: {self.results['end_to_end'].get('overall', 'N/A')}")
        
        # Overall Status
        overall_statuses = [
            self.results.get('border_node', {}).get('overall'),
            self.results.get('wan_edge', {}).get('overall'),
            self.results.get('end_to_end', {}).get('overall')
        ]
        overall_statuses = [s for s in overall_statuses if s]
        
        if all(s == 'PASS' for s in overall_statuses):
            self.results['overall_status'] = 'PASS'
        elif any(s == 'FAIL' for s in overall_statuses):
            self.results['overall_status'] = 'FAIL'
        else:
            self.results['overall_status'] = 'WARN'
        
        report.append("\n" + "=" * 70)
        report.append(f"OVERALL HANDOFF STATUS: {self.results['overall_status']}")
        report.append("=" * 70)
        
        return "\n".join(report)

def main():
    """Run handoff verification"""
    verifier = HandoffVerification()
    
    # Configure credentials
    username = "admin"
    password = "<password>"
    
    # Border Node (Catalyst 9500)
    print("Verifying Border Node...")
    verifier.results['border_node'] = verifier.verify_border_node(
        host="10.10.50.5",
        username=username,
        password=password
    )
    
    # WAN Edge (C8500)
    print("Verifying WAN Edge...")
    verifier.results['wan_edge'] = verifier.verify_wan_edge(
        host="10.255.0.101",
        username=username,
        password=password
    )
    
    # End-to-End Tests
    print("Verifying End-to-End Connectivity...")
    verifier.results['end_to_end'] = verifier.verify_end_to_end(
        border_host="10.10.50.5",
        wan_edge_host="10.255.0.101",
        username=username,
        password=password
    )
    
    # Generate and print report
    report = verifier.generate_report()
    print(report)
    
    # Save report
    with open('handoff_verification_report.txt', 'w') as f:
        f.write(report)
    
    # Save JSON results
    with open('handoff_verification_results.json', 'w') as f:
        json.dump(verifier.results, f, indent=2)

if __name__ == "__main__":
    main()
```

---

## Troubleshooting Guide

### Common Issues and Resolutions

| Issue | Symptoms | Resolution |
|-------|----------|------------|
| BGP not establishing | Neighbor stuck in Active/Idle | Check VLAN IDs, IP addresses, AS numbers, password |
| No routes exchanged | BGP up but no routes | Verify redistribute commands, prefix-lists, route-maps |
| SGT not propagating | Traffic blocked by SGACL | Check CTS configuration on both sides, ISE integration |
| Asymmetric routing | One-way traffic | Verify routes in both directions, check route preferences |
| MTU issues | Large packet drops | Ensure MTU matches on both ends (recommend 9000) |

### Debug Commands

```
! Border Node Debugging
debug bgp vpnv4 unicast updates
debug bgp vpnv4 unicast events
debug cts all
debug lisp control-plane all

! WAN Edge Debugging
debug bgp vpnv4 unicast updates
debug sdwan omp events
debug cts all

! Clear commands (use with caution)
clear bgp vpnv4 unicast vrf Corporate-Data * soft
clear cts credentials
```

---

## Related Documentation

| Document | Description | Location |
|----------|-------------|----------|
| SD-Access Handoff Overview | Architectural overview | Section 5.12 |
| SD-Access Integration Design | Design principles | Section 2.7 |
| Zero Trust Security | End-to-end security | Section 3.12 |
| Troubleshooting Guide | Issue resolution | Chapter 6.8 |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech | Initial release |

---

*This document is part of the SD-WAN Implementation & Deployment documentation series for Abhavtech.com*
