# 5.10 Hub Site Deployment

## Document Information
- **Version:** 2.1
- **Last Updated:** December 30, 2025
- **Author:** Abhavtech Network Architecture Team
- **Status:** Production Ready
- **Classification:** Internal Use Only

---

## 5.10.1 Hub Site Deployment Overview

Hub sites serve as regional aggregation points for branch traffic, hosting critical services and providing connectivity to data centers, cloud resources, and the internet. This section provides detailed deployment procedures for Abhavtech's hub sites.

### Hub Site Topology

```
                            ┌─────────────────────────────────────────────────────────┐
                            │                    HUB SITE TOPOLOGY                      │
                            │                        Mumbai DC                          │
                            └─────────────────────────────────────────────────────────┘
                                                        │
                   ┌────────────────────────────────────┼────────────────────────────────────┐
                   │                                    │                                    │
           ┌───────▼───────┐                   ┌────────▼────────┐                   ┌───────▼───────┐
           │    INTERNET   │                   │      MPLS       │                   │   LTE/5G      │
           │   (Primary)   │                   │   (Secondary)   │                   │   (Backup)    │
           │  500 Mbps     │                   │   200 Mbps      │                   │   100 Mbps    │
           └───────┬───────┘                   └────────┬────────┘                   └───────┬───────┘
                   │                                    │                                    │
                   │ Gi0/0/0                            │ Gi0/0/1                            │ Cell0/1/0
                   │                                    │                                    │
           ┌───────┴────────────────────────────────────┴────────────────────────────────────┴───────┐
           │                                                                                          │
           │                              C8500-12X4QC (WAN Edge Primary)                            │
           │                              hostname: ABVT-MUM-WE01                                     │
           │                              system-ip: 10.255.1.1                                       │
           │                              site-id: 100                                                │
           │                                                                                          │
           └───────┬────────────────────────────────────┬────────────────────────────────────────────┘
                   │ Te0/0/0.10 (Corporate)             │ Te0/0/0.30 (Voice)
                   │ Te0/0/0.20 (Guest)                 │ Te0/0/0.40 (IoT)
                   │ Te0/0/0.50 (Shared Services)       │
                   │                                    │
           ┌───────┴────────────────────────────────────┴───────┐
           │                                                     │
           │              SD-Access Fabric Border                │
           │              (BGP Peering: eBGP AS 65100/65200)    │
           │                                                     │
           └─────────────────────────────────────────────────────┘
```

### Abhavtech Hub Sites

| Site | Location | Role | WAN Edge Model | System-IP | Site-ID | HA Mode |
|------|----------|------|----------------|-----------|---------|---------|
| Mumbai DC | India | Primary DC | C8500-12X4QC x2 | 10.255.1.1/1.2 | 100 | Active/Active |
| Chennai DR | India | DR Site | C8500-12X4QC x2 | 10.255.1.3/1.4 | 101 | Active/Active |
| London | EMEA | Regional Hub | C8300-2N2S-6T x2 | 10.255.2.1/2.2 | 200 | Active/Active |
| Frankfurt | EMEA | Regional Hub | C8300-2N2S-6T x2 | 10.255.2.3/2.4 | 201 | Active/Active |
| New Jersey | Americas | Regional Hub | C8300-2N2S-6T x2 | 10.255.3.1/3.2 | 300 | Active/Active |
| Dallas | Americas | Regional Hub | C8300-2N2S-6T x2 | 10.255.3.3/3.4 | 301 | Active/Active |

---

## 5.10.2 Pre-Deployment Requirements

### Infrastructure Prerequisites

| Category | Requirement | Verification |
|----------|-------------|--------------|
| Power | Dual power feeds, UPS backup | Site facilities checklist |
| Cooling | 2kW cooling capacity per rack unit | Environmental sensors |
| Rack Space | 2U per WAN Edge router | Data center floor plan |
| Cabling | Fiber (10G/25G LAN), SFP+ transceivers | Cable inventory |
| Console | Console server connectivity | Remote access test |

### Network Prerequisites

| Requirement | Details | Status Check |
|-------------|---------|--------------|
| MPLS Circuit | Active handoff, CPE configured | Carrier confirmation |
| Internet Circuit | Static IP or DHCP, default route | ISP confirmation |
| LTE/5G | SIM activated, APN configured | Carrier portal |
| Management Network | OOB access, VPN to NOC | Connectivity test |
| DNS Resolution | Internal DNS for SD-WAN controllers | nslookup verification |

### SD-WAN Prerequisites

```
Prerequisite Verification Commands (from SD-WAN Manager)
=========================================================

# Verify controllers are operational
show orchestrator connections

# Verify device inventory entry
show sdwan wan-edge-list
| include <serial-number>

# Verify certificate chain is available
show sdwan certificate root-ca-cert

# Verify templates are ready
show sdwan templates | include Hub
```

---

## 5.10.3 Physical Installation

### Rack Installation Procedure

**Step 1: Unpack and Inspect**
```
Physical Inspection Checklist
=============================
[ ] Verify correct model number on chassis label
[ ] Check for shipping damage
[ ] Confirm all SFP+ modules present
[ ] Verify power cables included (regional power type)
[ ] Check console cable availability
[ ] Verify rack mounting kit complete
```

**Step 2: Rack Mounting**
```
C8500-12X4QC Rack Installation
==============================
1. Install inner rails on chassis sides
2. Install outer rails in rack (standard 19" EIA)
3. Slide chassis into rack on rails
4. Secure with front mounting screws (M5)
5. Connect both power supplies to separate circuits
6. Verify power LED indicators:
   - PWR1: Green (active)
   - PWR2: Green (active)
   - SYS: Green (normal operation)
```

**Step 3: Cable Connections**

| Port | Connection | Cable Type | Termination |
|------|------------|------------|-------------|
| Gi0/0/0 | Internet Router | Cat6 UTP | ISP CPE |
| Gi0/0/1 | MPLS Router | Cat6 UTP | MPLS PE |
| Cell0/1/0 | LTE Antenna | Coax | Roof antenna |
| Te0/0/0 | SD-Access Border | 10GBASE-SR SFP+ | Border switch |
| Gi0 | OOB Management | Cat6 UTP | Mgmt switch |
| Console | Console Server | RJ45-USB | Console port |

---

## 5.10.4 Initial Bootstrap Configuration

### Console Connection

```bash
# Terminal settings
Speed: 9600 baud
Data bits: 8
Stop bits: 1
Parity: None
Flow control: None
```

### Day-0 Bootstrap Configuration

```
!============================================================
! Hub Site WAN Edge - Day-0 Bootstrap Configuration
! Site: Mumbai DC - Primary Router
! Model: C8500-12X4QC
!============================================================

! System Identity
hostname ABVT-MUM-WE01
!
! Enable SD-WAN Mode
sdwan
 system
  system-ip             10.255.1.1
  site-id               100
  organization-name     Abhavtech
  vbond sdwan-validator.abhavtech.com port 12346
 !
!
! VPN 512 - Management Interface
interface GigabitEthernet0
 description OOB-Management
 ip address 10.10.254.11 255.255.255.0
 no shutdown
!
ip route vrf Mgmt-intf 0.0.0.0 0.0.0.0 10.10.254.1
!
! Enable Control Plane Connectivity
ip domain lookup
ip name-server 10.10.100.10
!
! Time Synchronization
ntp server 10.10.100.10 source GigabitEthernet0
clock timezone IST 5 30
!
! Console/VTY Access
line console 0
 exec-timeout 30 0
 logging synchronous
!
line vty 0 4
 exec-timeout 30 0
 login local
 transport input ssh
!
! Local Admin Account
username admin privilege 15 secret 0 <initial-password>
!
! Enable SD-WAN Services
service tcp-keepalives-in
service tcp-keepalives-out
service timestamps debug datetime msec localtime
service timestamps log datetime msec localtime
service password-encryption
!
! Write Configuration
end
write memory
```

### Verify Initial Connectivity

```
! Verify management interface
show ip interface brief | include Gi0
GigabitEthernet0       10.10.254.11   YES NVRAM  up                    up

! Verify DNS resolution
ping sdwan-validator.abhavtech.com
Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 13.234.56.78, timeout is 2 seconds:
!!!!!
Success rate is 100 percent (5/5)

! Verify NTP synchronization
show ntp status
Clock is synchronized, stratum 3, reference is 10.10.100.10
```

---

## 5.10.5 Transport Interface Configuration

### VPN 0 Transport Interfaces

```
!============================================================
! VPN 0 Transport Configuration - Hub Site
! Multi-WAN with MPLS, Internet, and LTE
!============================================================

! VPN 0 Definition
vrf definition 0
 description Transport-VPN
 !
 address-family ipv4
 exit-address-family
!

!------------------------------------------------------------
! MPLS Transport Interface
!------------------------------------------------------------
interface GigabitEthernet0/0/1
 description WAN-MPLS-Transport-CARRIER1
 ip address 192.168.100.2 255.255.255.252
 no ip redirects
 ip mtu 1500
 mtu 1508
 !
 ! SD-WAN Tunnel Parameters
 tunnel-interface
  encapsulation ipsec weight 1
  encapsulation gre weight 2
  color mpls
  max-control-connections 2
  vbond sdwan-validator.abhavtech.com
  allow-service all
  no allow-service sshd
  allow-service netconf
  carrier carrier1
 !
 no shutdown
!

!------------------------------------------------------------
! Internet Transport Interface
!------------------------------------------------------------
interface GigabitEthernet0/0/0
 description WAN-Internet-Transport-ISP1
 ip address 203.0.113.10 255.255.255.248
 no ip redirects
 ip mtu 1500
 mtu 1508
 !
 ! NAT for DIA
 ip nat outside
 !
 ! SD-WAN Tunnel Parameters
 tunnel-interface
  encapsulation ipsec weight 1
  color biz-internet
  max-control-connections 2
  vbond sdwan-validator.abhavtech.com
  allow-service dhcp
  allow-service dns
  allow-service icmp
  allow-service https
  allow-service stun
  carrier carrier2
  nat-refresh-interval 5
  tloc-preference 100
 !
 no shutdown
!

!------------------------------------------------------------
! LTE Backup Transport Interface
!------------------------------------------------------------
interface Cellular0/1/0
 description WAN-LTE-Backup-CARRIER3
 ip address negotiated
 no ip redirects
 !
 ! Cellular Profile
 dialer in-band
 encapsulation slip
 dialer pool-member 1
 dialer-group 1
 !
 ! SD-WAN Tunnel Parameters
 tunnel-interface
  encapsulation ipsec
  color lte
  max-control-connections 1
  vbond sdwan-validator.abhavtech.com
  last-resort-circuit
  low-bandwidth-link
  carrier carrier3
  nat-refresh-interval 5
  tloc-preference 50
 !
 no shutdown
!
! LTE Dialer Configuration
interface Dialer1
 mtu 1500
 ip address negotiated
 encapsulation slip
 dialer pool 1
 dialer-group 1
!
dialer-list 1 protocol ip permit
!

!------------------------------------------------------------
! Static Routes for Transport
!------------------------------------------------------------
ip route 0.0.0.0 0.0.0.0 192.168.100.1 track 10
ip route 0.0.0.0 0.0.0.0 203.0.113.1 100 track 20
ip route 0.0.0.0 0.0.0.0 Dialer1 200
!
! SLA Tracking
ip sla 10
 icmp-echo 192.168.100.1 source-interface GigabitEthernet0/0/1
 frequency 5
ip sla schedule 10 life forever start-time now
!
ip sla 20
 icmp-echo 203.0.113.1 source-interface GigabitEthernet0/0/0
 frequency 5
ip sla schedule 20 life forever start-time now
!
track 10 ip sla 10 reachability
track 20 ip sla 20 reachability
```

### Verify Transport Connectivity

```
! Check all transport interfaces
show sdwan tunnel statistics

                                    TCP       TCP                               
BFD   PMTU  MTU   Rx     Tx     Rx     Tx     Lost   Lost
TUNNEL LOCAL                 REMOTE               STATE STATE STATE PKTS   PKTS   BYTES  BYTES  PKTS   %
------ --------------------- -------------------- ----- ----- ----- ------ ------ ------ ------ ------ ------
gre1   192.168.100.2         10.255.2.10          up    up    1500  12456  11234  2.1M   1.9M   0      0.00
ipsec1 203.0.113.10          10.255.2.10          up    up    1446  8234   7123   1.4M   1.2M   0      0.00
ipsec2 10.234.56.78          10.255.2.10          up    up    1446  456    389    78K    65K    0      0.00

! Verify control connections
show sdwan control connections

                                                                             PEER                                          PEER                                          
PEER    PEER     PEER             SITE        DOMAIN  PEER                   PRIV  PEER                   PUB              
TYPE    PROTOCOL SYSTEM IP        ID          ID      PUBLIC IP              PORT  PRIVATE IP             PORT  ORGANIZATION            LOCAL COLOR      PROXY STATE UPTIME      
---------------------------------------------------------------------------------------------------------------------
vsmart  dtls     10.255.0.1       0           1       10.255.0.1             12346 10.255.0.1             12346 Abhavtech               mpls             No    up     12:05:34:22
vsmart  dtls     10.255.0.2       0           1       10.255.0.2             12346 10.255.0.2             12346 Abhavtech               mpls             No    up     12:05:34:18
vbond   dtls     10.255.2.10      0           0       sdwan-validator.abh... 12346 10.255.2.10            12346 Abhavtech               mpls             -     up     12:05:35:01
vmanage dtls     10.255.0.10      0           0       10.255.0.10            12346 10.255.0.10            12346 Abhavtech               mpls             No    up     12:05:34:45
```

---

## 5.10.6 Service VPN Configuration

### VPN 10 - Corporate Data

```
!============================================================
! VPN 10 - Corporate Data Service VPN
! SD-Access Integration with BGP
!============================================================

vrf definition 10
 rd 65100:10
 description Corporate-Data-VPN
 !
 address-family ipv4
  route-target export 65100:10
  route-target import 65100:10
 exit-address-family
!
! Subinterface for SD-Access Handoff
interface TenGigabitEthernet0/0/0.10
 description LAN-Corporate-SDAccess-Handoff
 encapsulation dot1Q 10
 vrf forwarding 10
 ip address 10.100.100.1 255.255.255.252
 no ip redirects
 cts role-based enforcement
 cts manual
  policy static sgt 100 trusted
 !
 no shutdown
!
! BGP for SD-Access Integration
router bgp 65100
 !
 address-family ipv4 vrf 10
  redistribute connected
  redistribute static
  redistribute omp
  neighbor 10.100.100.2 remote-as 65200
  neighbor 10.100.100.2 description SD-Access-Border-Primary
  neighbor 10.100.100.2 activate
  neighbor 10.100.100.2 send-community both
  neighbor 10.100.100.2 maximum-prefix 1000
  neighbor 10.100.100.2 soft-reconfiguration inbound
  maximum-paths 2
 exit-address-family
!
! DNS and DHCP for VPN 10
ip name-server vrf 10 10.10.100.10
ip name-server vrf 10 10.10.100.11
```

### VPN 20 - Guest Network

```
!============================================================
! VPN 20 - Guest Network (Isolated with DIA)
!============================================================

vrf definition 20
 rd 65100:20
 description Guest-Network-VPN
 !
 address-family ipv4
  route-target export 65100:20
  route-target import 65100:20
 exit-address-family
!
! Subinterface for Guest
interface TenGigabitEthernet0/0/0.20
 description LAN-Guest-SDAccess-Handoff
 encapsulation dot1Q 20
 vrf forwarding 20
 ip address 10.100.200.1 255.255.255.252
 no ip redirects
 no shutdown
!
! NAT for Direct Internet Access
ip nat inside source list NAT-GUEST-ACL interface GigabitEthernet0/0/0 vrf 20 overload
!
ip access-list extended NAT-GUEST-ACL
 permit ip 10.20.0.0 0.0.255.255 any
!
! Guest uses public DNS
ip name-server vrf 20 8.8.8.8
ip name-server vrf 20 8.8.4.4
!
! Default route to Internet for DIA
ip route vrf 20 0.0.0.0 0.0.0.0 GigabitEthernet0/0/0 global
```

### VPN 30 - Voice/UC

```
!============================================================
! VPN 30 - Voice/Unified Communications
! QoS Priority Treatment
!============================================================

vrf definition 30
 rd 65100:30
 description Voice-UC-VPN
 !
 address-family ipv4
  route-target export 65100:30
  route-target import 65100:30
 exit-address-family
!
! Subinterface for Voice
interface TenGigabitEthernet0/0/0.30
 description LAN-Voice-SDAccess-Handoff
 encapsulation dot1Q 30
 vrf forwarding 30
 ip address 10.100.130.1 255.255.255.252
 no ip redirects
 cts role-based enforcement
 cts manual
  policy static sgt 110 trusted
 !
 no shutdown
!
! BGP for Voice VPN
router bgp 65100
 !
 address-family ipv4 vrf 30
  redistribute connected
  redistribute static
  redistribute omp
  neighbor 10.100.130.2 remote-as 65200
  neighbor 10.100.130.2 description SD-Access-Border-Voice
  neighbor 10.100.130.2 activate
  neighbor 10.100.130.2 send-community both
  maximum-paths 2
 exit-address-family
```

### VPN 40 - IoT and VPN 50 - Shared Services

```
!============================================================
! VPN 40 - IoT Network (Restricted)
!============================================================

vrf definition 40
 rd 65100:40
 description IoT-Network-VPN
 !
 address-family ipv4
  route-target export 65100:40
  route-target import 65100:40
  route-target import 65100:50
 exit-address-family
!
interface TenGigabitEthernet0/0/0.40
 description LAN-IoT-SDAccess-Handoff
 encapsulation dot1Q 40
 vrf forwarding 40
 ip address 10.100.140.1 255.255.255.252
 cts role-based enforcement
 cts manual
  policy static sgt 120 trusted
 !
 no shutdown
!

!============================================================
! VPN 50 - Shared Services
!============================================================

vrf definition 50
 rd 65100:50
 description Shared-Services-VPN
 !
 address-family ipv4
  route-target export 65100:50
  route-target import 65100:50
  route-target import 65100:10
  route-target import 65100:30
  route-target import 65100:40
 exit-address-family
!
interface TenGigabitEthernet0/0/0.50
 description LAN-SharedServices-SDAccess-Handoff
 encapsulation dot1Q 50
 vrf forwarding 50
 ip address 10.100.150.1 255.255.255.252
 no ip redirects
 no shutdown
```

---

## 5.10.7 OMP Configuration

### Hub Site OMP Settings

```
!============================================================
! OMP Configuration - Hub Site
! Full route advertisement with path preference
!============================================================

sdwan
 omp
  no shutdown
  graceful-restart
  advertisement-interval 1
  holdtime 60
  !
  ! Advertise connected routes
  advertise connected
  !
  ! Advertise BGP routes from SD-Access
  advertise bgp
  !
  ! Advertise static routes
  advertise static
  !
  ! ECMP Configuration
  ecmp-limit 4
  !
  ! Path Selection
  best-path region-path-length ignore
  best-path transport-gateway prefer
  !
  ! Overlay AS Number
  overlay-as 65100
  !
  ! Send path MTU
  send-path-limit 4
 !
!
```

### Verify OMP Status

```
! Check OMP peers
show sdwan omp peers

                         DOMAIN    OVERLAY   SITE   
PEER             TYPE    ID        ID        ID      STATE    UPTIME
----------------------------------------------------------------------
10.255.0.1       vsmart  1         1         0       up       12:05:45:33
10.255.0.2       vsmart  1         1         0       up       12:05:45:28

! Check OMP routes
show sdwan omp routes

Generating output, this might take time, please wait ...
Code:
C   -> chosen
I   -> installed
Red -> redistributed
Rej -> rejected
L   -> looped
R   -> resolved
S   -> stale
Ext -> extranet
Inv -> invalid
Stg -> staged
U   -> TLOC unresolved

                                                                                                            AFFINITY                                 
VPN    PREFIX              FROM PEER      LABEL    STATUS    TLOC IP         COLOR       ENCAP   PREFERENCE  GROUPS     REGION ID   REGION PATH
----------------------------------------------------------------------------------------------------------------------------------------------------------
10     10.10.0.0/16        10.255.0.1     1003     C,I,R     10.255.1.1      mpls        ipsec   -           None       None        -
10     10.10.0.0/16        10.255.0.1     1003     C,R       10.255.1.1      biz-internet ipsec  -           None       None        -
20     10.20.0.0/16        10.255.0.1     1020     C,I,R     10.255.1.1      mpls        ipsec   -           None       None        -
30     10.30.0.0/16        10.255.0.1     1030     C,I,R     10.255.1.1      mpls        ipsec   -           None       None        -
```

---

## 5.10.8 High Availability Configuration

### Active/Active Hub Deployment

```
                    ┌─────────────────────────────────────────────────────────┐
                    │           MUMBAI DC - ACTIVE/ACTIVE HA                  │
                    └─────────────────────────────────────────────────────────┘
                                              │
              ┌───────────────────────────────┼───────────────────────────────┐
              │                               │                               │
      ┌───────▼───────┐              ┌────────▼────────┐              ┌───────▼───────┐
      │   MPLS        │              │    INTERNET     │              │    LTE        │
      │   200 Mbps    │              │    500 Mbps     │              │    100 Mbps   │
      └───────┬───────┘              └────────┬────────┘              └───────┬───────┘
              │                               │                               │
      ┌───────┼───────────────────────────────┼───────────────────────────────┼───────┐
      │       │                               │                               │       │
      │  ┌────▼────┐                     ┌────▼────┐                     ┌────▼────┐  │
      │  │ MPLS-1  │                     │ INET-1  │                     │ LTE-1   │  │
      │  └────┬────┘                     └────┬────┘                     └────┬────┘  │
      │       │                               │                               │       │
      │  ┌────▼────────────────────────────────▼────────────────────────────────▼────┐│
      │  │                       ABVT-MUM-WE01 (Primary)                             ││
      │  │                       C8500-12X4QC                                        ││
      │  │                       System-IP: 10.255.1.1                               ││
      │  └────┬────────────────────────────────────────────────────────────────┬─────┘│
      │       │ Te0/0/0 (Trunk to SD-Access)                                   │      │
      │       │                                                                 │      │
      │  ┌────▼─────────────────────────────────────────────────────────────────▼────┐│
      │  │                        Nexus 9300 Cross-Connect                           ││
      │  │                        VLAN 10,20,30,40,50 (Service VPNs)                ││
      │  └────┬─────────────────────────────────────────────────────────────────┬────┘│
      │       │                                                                 │      │
      │  ┌────▼────────────────────────────────────────────────────────────────────▼─┐│
      │  │                       ABVT-MUM-WE02 (Secondary)                           ││
      │  │                       C8500-12X4QC                                        ││
      │  │                       System-IP: 10.255.1.2                               ││
      │  └────┬────────────────────────────────┬────────────────────────────────┬────┘│
      │       │                               │                               │       │
      │  ┌────▼────┐                     ┌────▼────┐                     ┌────▼────┐  │
      │  │ MPLS-2  │                     │ INET-2  │                     │ LTE-2   │  │
      │  └─────────┘                     └─────────┘                     └─────────┘  │
      │                                                                               │
      └───────────────────────────────────────────────────────────────────────────────┘
```

### HA Router Configuration (Secondary)

```
!============================================================
! Secondary Hub Router Configuration
! Active/Active with same templates
!============================================================

hostname ABVT-MUM-WE02
!
sdwan
 system
  system-ip             10.255.1.2
  site-id               100
  organization-name     Abhavtech
  vbond sdwan-validator.abhavtech.com port 12346
 !
!
! All transport and service VPN configs identical to primary
! ECMP load balancing handled by OMP
! BGP multi-path enabled for SD-Access integration
```

### ECMP and Load Balancing

```
! OMP ECMP Configuration (both routers)
sdwan
 omp
  ecmp-limit 4
 !
!
! BGP Maximum Paths (both routers)
router bgp 65100
 address-family ipv4 vrf 10
  maximum-paths 4
  maximum-paths ibgp 4
 exit-address-family
!
! SD-Access Border Configuration (on border switches)
! Ensure both WAN Edges are learned as equal-cost paths
router bgp 65200
 address-family ipv4 vrf Corporate-Data
  neighbor 10.100.100.1 remote-as 65100
  neighbor 10.100.100.1 description WAN-Edge-Primary
  neighbor 10.100.100.5 remote-as 65100
  neighbor 10.100.100.5 description WAN-Edge-Secondary
  maximum-paths 2
 exit-address-family
```

---

## 5.10.9 Security Configuration

### Zone-Based Firewall

```
!============================================================
! Zone-Based Firewall for Hub Site
!============================================================

! Zone Definitions
zone security TRUST
zone security UNTRUST
zone security GUEST
zone security IOT
!
! Class Maps for Traffic Classification
class-map type inspect match-any CORPORATE-TRAFFIC
 match protocol http
 match protocol https
 match protocol dns
 match protocol ssh
 match protocol ftp
!
class-map type inspect match-any VOICE-TRAFFIC
 match protocol sip
 match protocol h323
 match protocol skinny
 match protocol rtp
!
class-map type inspect match-any GUEST-INTERNET
 match protocol http
 match protocol https
 match protocol dns
!
! Policy Maps
policy-map type inspect TRUST-TO-UNTRUST-POLICY
 class type inspect CORPORATE-TRAFFIC
  inspect
 class type inspect VOICE-TRAFFIC
  inspect
 class class-default
  drop log
!
policy-map type inspect GUEST-TO-UNTRUST-POLICY
 class type inspect GUEST-INTERNET
  inspect
 class class-default
  drop log
!
policy-map type inspect UNTRUST-TO-TRUST-POLICY
 class class-default
  drop log
!
! Zone Pairs
zone-pair security TRUST-UNTRUST source TRUST destination UNTRUST
 service-policy type inspect TRUST-TO-UNTRUST-POLICY
!
zone-pair security GUEST-UNTRUST source GUEST destination UNTRUST
 service-policy type inspect GUEST-TO-UNTRUST-POLICY
!
zone-pair security UNTRUST-TRUST source UNTRUST destination TRUST
 service-policy type inspect UNTRUST-TO-TRUST-POLICY
!
! Interface Zone Assignment
interface TenGigabitEthernet0/0/0.10
 zone-member security TRUST
!
interface TenGigabitEthernet0/0/0.20
 zone-member security GUEST
!
interface TenGigabitEthernet0/0/0.40
 zone-member security IOT
!
interface GigabitEthernet0/0/0
 zone-member security UNTRUST
!
interface GigabitEthernet0/0/1
 zone-member security UNTRUST
```

### TrustSec/SGT Configuration

```
!============================================================
! TrustSec Configuration for Hub Site
! SGT Propagation to SD-Access
!============================================================

! CTS Global Configuration
cts authorization list ISE-CTS-LIST
cts role-based enforcement
cts role-based enforcement vlan-list all
!
! RADIUS Configuration for CTS
aaa authentication dot1x default group ISE-SERVERS
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
! SGT Inline Tagging on SD-Access Handoff
interface TenGigabitEthernet0/0/0.10
 cts manual
  policy static sgt 100 trusted
  propagate sgt
!
! SGT Inline Tagging on SD-WAN Tunnels
interface Tunnel100
 cts manual
  propagate sgt
```

---

## 5.10.10 Hub Deployment Verification

### Comprehensive Verification Checklist

```
Hub Site Deployment Verification
================================

1. PHYSICAL VERIFICATION
========================
[ ] Power supplies active (dual)
[ ] All interface LEDs correct
[ ] Console access working
[ ] Rack mounting secure

2. CONTROL PLANE VERIFICATION
=============================
# vBond Connection
show sdwan control connections | include vbond
Expected: State = up

# vSmart Connection
show sdwan control connections | include vsmart
Expected: State = up for all vSmarts

# vManage Connection
show sdwan control connections | include vmanage
Expected: State = up

# OMP Peers
show sdwan omp peers
Expected: All peers in 'up' state

3. DATA PLANE VERIFICATION
==========================
# All Tunnels
show sdwan tunnel statistics
Expected: All tunnels up, loss < 1%

# BFD Sessions
show sdwan bfd sessions
Expected: All sessions 'up'

# IPsec Security Associations
show crypto ipsec sa summary
Expected: All SAs established

4. SERVICE VPN VERIFICATION
===========================
# VRF Status
show vrf
Expected: All VRFs active

# BGP Neighbors (SD-Access)
show bgp vpnv4 unicast all summary
Expected: All neighbors established

# Route Table per VPN
show ip route vrf 10
show ip route vrf 20
show ip route vrf 30
Expected: Routes from SD-Access and OMP

5. SECURITY VERIFICATION
========================
# ZBFW Status
show zone-pair security
Expected: Policies applied

# CTS/SGT Status
show cts interface summary
Expected: Inline tagging enabled
```

### Automated Verification Script

```python
#!/usr/bin/env python3
"""
Hub Site Deployment Verification Script
Abhavtech SD-WAN Project
"""

import requests
import json
import urllib3
from datetime import datetime

urllib3.disable_warnings()

class HubVerification:
    def __init__(self, vmanage_host, username, password):
        self.vmanage_host = vmanage_host
        self.session = requests.Session()
        self.base_url = f"https://{vmanage_host}:443"
        self.login(username, password)
    
    def login(self, username, password):
        """Authenticate to vManage"""
        login_url = f"{self.base_url}/j_security_check"
        payload = {'j_username': username, 'j_password': password}
        
        response = self.session.post(login_url, data=payload, verify=False)
        
        # Get XSRF token
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url, verify=False)
        
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
            print("✓ Authentication successful")
    
    def verify_control_connections(self, system_ip):
        """Verify control plane connections for a device"""
        url = f"{self.base_url}/dataservice/device/control/connections"
        params = {'deviceId': system_ip}
        
        response = self.session.get(url, params=params, verify=False)
        data = response.json()
        
        results = {'vbond': False, 'vsmart': False, 'vmanage': False}
        
        for conn in data.get('data', []):
            peer_type = conn.get('peer-type', '')
            state = conn.get('state', '')
            
            if state == 'up':
                if peer_type == 'vbond':
                    results['vbond'] = True
                elif peer_type == 'vsmart':
                    results['vsmart'] = True
                elif peer_type == 'vmanage':
                    results['vmanage'] = True
        
        return results
    
    def verify_tunnels(self, system_ip):
        """Verify data plane tunnels"""
        url = f"{self.base_url}/dataservice/device/tunnel/statistics"
        params = {'deviceId': system_ip}
        
        response = self.session.get(url, params=params, verify=False)
        data = response.json()
        
        tunnels_up = 0
        tunnels_total = 0
        
        for tunnel in data.get('data', []):
            tunnels_total += 1
            if tunnel.get('tunnel-state') == 'up':
                tunnels_up += 1
        
        return {'up': tunnels_up, 'total': tunnels_total}
    
    def verify_omp_peers(self, system_ip):
        """Verify OMP peer status"""
        url = f"{self.base_url}/dataservice/device/omp/peers"
        params = {'deviceId': system_ip}
        
        response = self.session.get(url, params=params, verify=False)
        data = response.json()
        
        peers_up = 0
        peers_total = 0
        
        for peer in data.get('data', []):
            peers_total += 1
            if peer.get('state') == 'up':
                peers_up += 1
        
        return {'up': peers_up, 'total': peers_total}
    
    def generate_report(self, hub_routers):
        """Generate verification report for hub routers"""
        print("\n" + "="*60)
        print("HUB SITE DEPLOYMENT VERIFICATION REPORT")
        print(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*60 + "\n")
        
        all_passed = True
        
        for router in hub_routers:
            system_ip = router['system_ip']
            hostname = router['hostname']
            
            print(f"\n--- {hostname} ({system_ip}) ---")
            
            # Control connections
            ctrl = self.verify_control_connections(system_ip)
            print(f"  vBond:    {'✓ UP' if ctrl['vbond'] else '✗ DOWN'}")
            print(f"  vSmart:   {'✓ UP' if ctrl['vsmart'] else '✗ DOWN'}")
            print(f"  vManage:  {'✓ UP' if ctrl['vmanage'] else '✗ DOWN'}")
            
            if not all(ctrl.values()):
                all_passed = False
            
            # Tunnels
            tunnels = self.verify_tunnels(system_ip)
            tunnel_status = f"✓ {tunnels['up']}/{tunnels['total']}" if tunnels['up'] == tunnels['total'] else f"✗ {tunnels['up']}/{tunnels['total']}"
            print(f"  Tunnels:  {tunnel_status}")
            
            if tunnels['up'] != tunnels['total']:
                all_passed = False
            
            # OMP Peers
            omp = self.verify_omp_peers(system_ip)
            omp_status = f"✓ {omp['up']}/{omp['total']}" if omp['up'] == omp['total'] else f"✗ {omp['up']}/{omp['total']}"
            print(f"  OMP Peers: {omp_status}")
            
            if omp['up'] != omp['total']:
                all_passed = False
        
        print("\n" + "="*60)
        if all_passed:
            print("OVERALL STATUS: ✓ ALL CHECKS PASSED")
        else:
            print("OVERALL STATUS: ✗ SOME CHECKS FAILED")
        print("="*60)
        
        return all_passed


if __name__ == "__main__":
    # Hub routers to verify
    hub_routers = [
        {'hostname': 'ABVT-MUM-WE01', 'system_ip': '10.255.1.1'},
        {'hostname': 'ABVT-MUM-WE02', 'system_ip': '10.255.1.2'},
        {'hostname': 'ABVT-CHE-WE01', 'system_ip': '10.255.1.3'},
        {'hostname': 'ABVT-CHE-WE02', 'system_ip': '10.255.1.4'},
        {'hostname': 'ABVT-LON-WE01', 'system_ip': '10.255.2.1'},
        {'hostname': 'ABVT-LON-WE02', 'system_ip': '10.255.2.2'},
    ]
    
    verifier = HubVerification(
        vmanage_host='sdwan-manager.abhavtech.com',
        username='admin',
        password='<password>'
    )
    
    verifier.generate_report(hub_routers)
```

---

## 5.10.11 Hub Deployment Runbook

### Day-by-Day Deployment Schedule

| Day | Activity | Duration | Team |
|-----|----------|----------|------|
| Day 1 | Physical installation, cabling | 4 hours | DC Ops |
| Day 1 | Console access, initial bootstrap | 2 hours | Network |
| Day 2 | Transport configuration, vBond auth | 4 hours | Network |
| Day 2 | Control plane verification | 2 hours | Network |
| Day 3 | Service VPN configuration | 4 hours | Network |
| Day 3 | SD-Access BGP peering | 2 hours | Network |
| Day 4 | Security configuration (ZBFW, CTS) | 4 hours | Security |
| Day 4 | Template attachment and sync | 2 hours | Network |
| Day 5 | HA configuration and testing | 4 hours | Network |
| Day 5 | Full verification and documentation | 2 hours | Network |

### Rollback Triggers

| Condition | Threshold | Action |
|-----------|-----------|--------|
| Control connections down | > 5 minutes | Escalate and troubleshoot |
| Tunnel loss rate | > 5% | Check circuit quality |
| BGP peer down | > 2 minutes | Verify SD-Access config |
| Template sync failure | After 3 attempts | Escalate to TAC |

---

## References

- Cisco Catalyst SD-WAN Deployment Guide
- SD-WAN Large Global WAN Case Study
- SD-Access SD-WAN Independent Domain Integration Guide
- Abhavtech Network Architecture Standards

---

*Document Version: 2.1*
*Last Updated: December 30, 2025*
*Classification: Internal Use Only*
*Abhavtech.com - SD-WAN Documentation*
