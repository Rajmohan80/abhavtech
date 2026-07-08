# 2.3 Data Plane Design

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-CH2-003 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Status | Final |
| Classification | Internal Use |

---

## 2.3.1 Data Plane Architecture Overview

### WAN Edge Data Plane Components

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     SD-WAN DATA PLANE ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                          WAN EDGE ROUTER (cEdge)                            │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │ │
│  │  │                    FORWARDING PLANE                             │ │ │
│  │  │                                                                 │ │ │
│  │  │  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐   │ │ │
│  │  │  │   FIB     │  │   LFIB    │  │  TLOC     │  │ Service   │   │ │ │
│  │  │  │ (Routing) │  │  (Labels) │  │  Table    │  │  Chain    │   │ │ │
│  │  │  └───────────┘  └───────────┘  └───────────┘  └───────────┘   │ │ │
│  │  │                                                                 │ │ │
│  │  │  ┌─────────────────────────────────────────────────────────┐   │ │ │
│  │  │  │              SECURITY SERVICES                          │   │ │ │
│  │  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │   │ │ │
│  │  │  │  │ IPsec   │ │ Zone FW │ │  UTD    │ │ URL     │       │   │ │ │
│  │  │  │  │Encrypt  │ │         │ │(Snort3) │ │Filter   │       │   │ │ │
│  │  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │   │ │ │
│  │  │  └─────────────────────────────────────────────────────────┘   │ │ │
│  │  │                                                                 │ │ │
│  │  │  ┌─────────────────────────────────────────────────────────┐   │ │ │
│  │  │  │            APPLICATION INTELLIGENCE                     │   │ │ │
│  │  │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │   │ │ │
│  │  │  │  │ NBAR2   │ │  AAR    │ │   QoS   │ │  FEC    │       │   │ │ │
│  │  │  │  │  DPI    │ │(Routing)│ │Scheduler│ │(Repair) │       │   │ │ │
│  │  │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │   │ │ │
│  │  │  └─────────────────────────────────────────────────────────┘   │ │ │
│  │  │                                                                 │ │ │
│  │  └─────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                       │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │ │
│  │  │                    TRANSPORT INTERFACES                         │ │ │
│  │  │                                                                 │ │ │
│  │  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │ │ │
│  │  │  │    MPLS     │  │   Internet  │  │  Cellular   │             │ │ │
│  │  │  │  Transport  │  │  Transport  │  │  Transport  │             │ │ │
│  │  │  │             │  │             │  │  (5G/LTE)   │             │ │ │
│  │  │  │  Color:     │  │  Color:     │  │  Color:     │             │ │ │
│  │  │  │  mpls       │  │  biz-internet│ │  lte        │             │ │ │
│  │  │  │             │  │             │  │             │             │ │ │
│  │  │  │ TLOC:       │  │ TLOC:       │  │ TLOC:       │             │ │ │
│  │  │  │ 10.1.1.1    │  │ 203.0.113.1 │  │ DHCP        │             │ │ │
│  │  │  └─────────────┘  └─────────────┘  └─────────────┘             │ │ │
│  │  │                                                                 │ │ │
│  │  └─────────────────────────────────────────────────────────────────┘ │ │
│  │                                                                       │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Plane Processing Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     PACKET PROCESSING PIPELINE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  INGRESS                                                                    │
│  ═══════                                                                    │
│                                                                             │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐      │
│  │ Receive │──►│ Access  │──►│  DPI    │──►│  QoS    │──►│ Policy  │      │
│  │ Packet  │   │  List   │   │ (NBAR2) │   │ Classify│   │ Lookup  │      │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘      │
│                                                  │              │           │
│                                                  ▼              ▼           │
│                                           ┌─────────┐   ┌─────────┐        │
│                                           │  Mark   │   │  AAR    │        │
│                                           │  DSCP   │   │ Decision│        │
│                                           └─────────┘   └─────────┘        │
│                                                              │              │
│  FORWARDING                                                  │              │
│  ══════════                                                  ▼              │
│                                                        ┌─────────┐         │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐             │  Route  │         │
│  │  FIB    │◄──│  TLOC   │◄──│ Service │◄────────────│ Lookup  │         │
│  │ Lookup  │   │ Select  │   │  Chain  │             └─────────┘         │
│  └────┬────┘   └─────────┘   └─────────┘                                  │
│       │                                                                    │
│       ▼                                                                    │
│  EGRESS                                                                    │
│  ══════                                                                    │
│                                                                            │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐     │
│  │  QoS    │──►│ IPsec   │──►│  FEC    │──►│Encapsul │──►│ Transmit│     │
│  │ Schedule│   │ Encrypt │   │ (if on) │   │  -ate   │   │         │     │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘     │
│                                                                            │
│  Legend:                                                                   │
│  DPI = Deep Packet Inspection    AAR = Application-Aware Routing          │
│  TLOC = Transport Locator        FEC = Forward Error Correction           │
│                                                                            │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2.3.2 WAN Edge Router Placement

### Site-by-Site WAN Edge Design

| Site | Classification | Model | Quantity | HA Mode | Throughput |
|------|----------------|-------|----------|---------|------------|
| Mumbai DC | Data Center | C8500-12X4QC | 2 | Active-Active | 100 Gbps |
| Chennai DR | Data Center | C8500-12X4QC | 2 | Active-Active | 100 Gbps |
| London | Regional Hub | C8300-2N2S-6T | 2 | Active-Active | 10 Gbps |
| Frankfurt | Regional Hub | C8300-2N2S-6T | 2 | Active-Active | 10 Gbps |
| New Jersey | Regional Hub | C8300-2N2S-6T | 2 | Active-Active | 10 Gbps |
| Dallas | Regional Hub | C8300-2N2S-6T | 2 | Active-Active | 10 Gbps |
| Bangalore | Branch | C8200L-1N-4T | 2 | Active-Standby | 2 Gbps |
| Delhi | Branch | C8200L-1N-4T | 2 | Active-Standby | 2 Gbps |
| Noida | Small Branch | C8200L-1N-4T | 1 | Single | 2 Gbps |

### Data Center WAN Edge Design (Mumbai/Chennai)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATA CENTER WAN EDGE DESIGN                              │
│                        Mumbai DC / Chennai DR                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                         SD-ACCESS FABRIC                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │   ┌─────────────────┐           ┌─────────────────┐                  │ │
│  │   │  Border Node 1  │           │  Border Node 2  │                  │ │
│  │   │  C9500-48Y4C    │           │  C9500-48Y4C    │                  │ │
│  │   │                 │           │                 │                  │ │
│  │   │ Te1/0/49 ──────────────────────── Te1/0/49   │                  │ │
│  │   │ Te1/0/50       │           │       Te1/0/50   │                  │ │
│  │   └───────┬─────────┘           └─────────┬───────┘                  │ │
│  │           │VRF-Lite (L3)                  │VRF-Lite (L3)             │ │
│  │           │eBGP Peering                   │eBGP Peering              │ │
│  │           │                               │                          │ │
│  └───────────┼───────────────────────────────┼──────────────────────────┘ │
│              │                               │                            │
│  ┌───────────┼───────────────────────────────┼──────────────────────────┐ │
│  │           │                               │                          │ │
│  │   ┌───────▼───────┐           ┌───────────▼───────┐                  │ │
│  │   │  WAN Edge 1   │           │    WAN Edge 2     │                  │ │
│  │   │ C8500-12X4QC  │           │  C8500-12X4QC     │                  │ │
│  │   │               │           │                   │                  │ │
│  │   │ System IP:    │           │ System IP:        │                  │ │
│  │   │ 10.1.100.1    │           │ 10.1.100.2        │                  │ │
│  │   │ Site-ID: 100  │           │ Site-ID: 100      │                  │ │
│  │   │               │           │                   │                  │ │
│  │   │ ┌───────────┐ │           │ ┌───────────┐     │                  │ │
│  │   │ │ LAN-Side  │ │           │ │ LAN-Side  │     │                  │ │
│  │   │ │Te0/0/0-3  │ │           │ │Te0/0/0-3  │     │                  │ │
│  │   │ │(VRF-Lite) │ │           │ │(VRF-Lite) │     │                  │ │
│  │   │ └───────────┘ │           │ └───────────┘     │                  │ │
│  │   │               │           │                   │                  │ │
│  │   │ ┌───────────┐ │           │ ┌───────────┐     │                  │ │
│  │   │ │ WAN-Side  │ │           │ │ WAN-Side  │     │                  │ │
│  │   │ │Fo0/0/0    │─┼───────────┼─│Fo0/0/0    │     │                  │ │
│  │   │ │(MPLS)     │ │   TLOC    │ │(MPLS)     │     │                  │ │
│  │   │ │Fo0/0/1    │ │  Pairs    │ │Fo0/0/1    │     │                  │ │
│  │   │ │(Internet) │ │           │ │(Internet) │     │                  │ │
│  │   │ │Cellular0  │ │           │ │Cellular0  │     │                  │ │
│  │   │ │(5G Backup)│ │           │ │(5G Backup)│     │                  │ │
│  │   │ └───────────┘ │           │ └───────────┘     │                  │ │
│  │   │               │           │                   │                  │ │
│  │   └───────────────┘           └───────────────────┘                  │ │
│  │                                                                       │ │
│  │                        SD-WAN DATA PLANE                              │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Transport Connections:                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Interface  │ Color        │ CIR      │ Provider   │ Purpose        │  │
│  │────────────│──────────────│──────────│────────────│────────────────│  │
│  │ Fo0/0/0    │ mpls         │ 500 Mbps │ Tata MPLS  │ Primary WAN    │  │
│  │ Fo0/0/1    │ biz-internet │ 1 Gbps   │ Airtel DIA │ Secondary/SaaS │  │
│  │ Cellular0  │ lte          │ 100 Mbps │ Jio 5G    │ Backup         │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Branch WAN Edge Design (Bangalore/Delhi)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BRANCH WAN EDGE DESIGN                                 │
│                    Bangalore / Delhi / Noida                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                         SD-ACCESS FABRIC                                    │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                       │ │
│  │   ┌─────────────────┐                                                │ │
│  │   │  Border Node    │                                                │ │
│  │   │  C9300-48UXM    │                                                │ │
│  │   │                 │                                                │ │
│  │   │ Te1/1/1 ─────────────────────────────┐                          │ │
│  │   │ Te1/1/2 ──────────────────────────┐  │                          │ │
│  │   │                 │                 │  │                          │ │
│  │   └─────────────────┘                 │  │                          │ │
│  │                                       │  │                          │ │
│  └───────────────────────────────────────┼──┼──────────────────────────┘ │
│                                          │  │                            │
│                           VRF-Lite       │  │                            │
│                           eBGP           │  │                            │
│                                          │  │                            │
│  ┌───────────────────────────────────────┼──┼──────────────────────────┐ │
│  │                                       │  │                          │ │
│  │   ┌─────────────────────────────┐     │  │                          │ │
│  │   │      WAN Edge (Primary)     │     │  │                          │ │
│  │   │        C8200L-1N-4T         │◄────┘  │                          │ │
│  │   │                             │        │                          │ │
│  │   │  System IP: 10.1.103.1      │        │                          │ │
│  │   │  Site-ID: 103 (Bangalore)   │        │                          │ │
│  │   │                             │        │                          │ │
│  │   │  LAN: Gi0/0/0 (VRF-Lite)    │        │                          │ │
│  │   │  WAN: Gi0/0/1 (MPLS)        │        │                          │ │
│  │   │       Gi0/0/2 (Internet)    │        │                          │ │
│  │   │       Cellular0/1/0 (4G)    │        │                          │ │
│  │   │                             │        │                          │ │
│  │   │  HA State: Active           │        │                          │ │
│  │   └─────────────────────────────┘        │                          │ │
│  │                                          │                          │ │
│  │   ┌─────────────────────────────┐        │                          │ │
│  │   │     WAN Edge (Secondary)    │◄───────┘                          │ │
│  │   │        C8200L-1N-4T         │                                   │ │
│  │   │                             │                                   │ │
│  │   │  System IP: 10.1.103.2      │                                   │ │
│  │   │  Site-ID: 103 (Bangalore)   │                                   │ │
│  │   │                             │                                   │ │
│  │   │  HA State: Standby          │                                   │ │
│  │   └─────────────────────────────┘                                   │ │
│  │                                                                       │ │
│  │                        SD-WAN DATA PLANE                              │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Transport Connections:                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Interface    │ Color        │ CIR      │ Provider   │ Purpose      │  │
│  │──────────────│──────────────│──────────│────────────│──────────────│  │
│  │ Gi0/0/1      │ mpls         │ 100 Mbps │ Tata MPLS  │ Primary WAN  │  │
│  │ Gi0/0/2      │ biz-internet │ 200 Mbps │ Airtel DIA │ Secondary    │  │
│  │ Cellular0/1/0│ lte          │ 50 Mbps  │ Jio 4G     │ Backup       │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2.3.3 TLOC (Transport Locator) Design

### TLOC Architecture

Each WAN Edge interface used for SD-WAN transport is identified by a TLOC tuple: (System-IP, Color, Encapsulation).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          TLOC DESIGN MODEL                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TLOC Components:                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │                                                                     │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │  │
│  │  │  System IP   │  │    Color     │  │ Encapsulation│              │  │
│  │  │              │  │              │  │              │              │  │
│  │  │ 10.1.100.1   │ +│    mpls      │ +│    ipsec     │ = TLOC       │  │
│  │  │              │  │              │  │              │              │  │
│  │  │ (Unique per  │  │ (Transport   │  │ (Tunnel Type)│              │  │
│  │  │  WAN Edge)   │  │  Type)       │  │              │              │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │  │
│  │                                                                     │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  Example TLOCs for Mumbai WAN Edge 1:                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ TLOC 1: (10.1.100.1, mpls, ipsec)          - MPLS transport        │  │
│  │ TLOC 2: (10.1.100.1, biz-internet, ipsec)  - Internet transport    │  │
│  │ TLOC 3: (10.1.100.1, lte, ipsec)           - Cellular backup       │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### TLOC Color Assignment

| Color | Transport Type | Use Case | Sites |
|-------|----------------|----------|-------|
| `mpls` | Private MPLS | Enterprise WAN primary | All hubs |
| `biz-internet` | Business Internet/DIA | Secondary, SaaS access | All sites |
| `public-internet` | Broadband | Cost-effective branches | Noida |
| `lte` | 4G Cellular | Backup/failover | All Indian sites |
| `5g` | 5G Cellular | High-speed backup | Mumbai, Chennai |

### Global TLOC Allocation

| Site | System IP | TLOC 1 | TLOC 2 | TLOC 3 |
|------|-----------|--------|--------|--------|
| Mumbai WE-1 | 10.1.100.1 | mpls | biz-internet | 5g |
| Mumbai WE-2 | 10.1.100.2 | mpls | biz-internet | 5g |
| Chennai WE-1 | 10.1.200.1 | mpls | biz-internet | 5g |
| Chennai WE-2 | 10.1.200.2 | mpls | biz-internet | 5g |
| London WE-1 | 10.1.300.1 | mpls | biz-internet | - |
| London WE-2 | 10.1.300.2 | mpls | biz-internet | - |
| Frankfurt WE-1 | 10.1.301.1 | mpls | biz-internet | - |
| Frankfurt WE-2 | 10.1.301.2 | mpls | biz-internet | - |
| New Jersey WE-1 | 10.1.400.1 | mpls | biz-internet | - |
| New Jersey WE-2 | 10.1.400.2 | mpls | biz-internet | - |
| Dallas WE-1 | 10.1.401.1 | mpls | biz-internet | - |
| Dallas WE-2 | 10.1.401.2 | mpls | biz-internet | - |
| Bangalore WE-1 | 10.1.103.1 | mpls | biz-internet | lte |
| Bangalore WE-2 | 10.1.103.2 | mpls | biz-internet | lte |
| Delhi WE-1 | 10.1.104.1 | mpls | biz-internet | lte |
| Delhi WE-2 | 10.1.104.2 | mpls | biz-internet | lte |
| Noida WE-1 | 10.1.105.1 | - | biz-internet | lte |

### TLOC Interface Configuration

```
! Mumbai WAN Edge 1 - TLOC Configuration
interface TenGigabitEthernet0/0/0
 description "MPLS Transport - Tata Communications"
 ip address 172.16.1.2 255.255.255.252
 no shutdown
!
interface Tunnel100
 description "MPLS TLOC Tunnel"
 ip unnumbered TenGigabitEthernet0/0/0
 tunnel source TenGigabitEthernet0/0/0
 tunnel mode sdwan
!
sdwan
 interface TenGigabitEthernet0/0/0
  tunnel-interface
   encapsulation ipsec weight 1
   color mpls
   max-control-connections 2
   vbond vbond.abhavtech.com
   allow-service all
   no allow-service dhcp
  exit
 exit
!

interface TenGigabitEthernet0/0/1
 description "Internet Transport - Airtel DIA"
 ip address dhcp
 no shutdown
!
interface Tunnel101
 description "Internet TLOC Tunnel"
 ip unnumbered TenGigabitEthernet0/0/1
 tunnel source TenGigabitEthernet0/0/1
 tunnel mode sdwan
!
sdwan
 interface TenGigabitEthernet0/0/1
  tunnel-interface
   encapsulation ipsec weight 1
   color biz-internet
   max-control-connections 2
   vbond vbond.abhavtech.com
   allow-service all
   no allow-service dhcp
   nat-refresh-interval 5
  exit
 exit
!

interface Cellular0/1/0
 description "5G Backup - Jio"
 ip address negotiated
 no shutdown
!
sdwan
 interface Cellular0/1/0
  tunnel-interface
   encapsulation ipsec weight 1
   color lte
   max-control-connections 0
   vbond vbond.abhavtech.com
   allow-service all
   carrier default
   last-resort-circuit
  exit
 exit
!
```

---

## 2.3.4 IPsec Tunnel Design

### Encryption Standards

| Parameter | Specification |
|-----------|---------------|
| **Encryption Algorithm** | AES-256-GCM |
| **Key Exchange** | IKEv2 |
| **PFS Group** | DH Group 19 (256-bit ECDH) |
| **SA Lifetime** | 3600 seconds |
| **Anti-Replay** | 64-packet window |
| **Authentication** | Certificate-based |

### Tunnel Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    IPsec TUNNEL MESH TOPOLOGY                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                              FULL MESH (Hubs)                               │
│                                                                             │
│              Mumbai          Chennai         London         NJ              │
│                ●═══════════════●═══════════════●═══════════●               │
│                ║               ║               ║           ║               │
│                ║               ║               ║           ║               │
│                ●═══════════════●═══════════════●═══════════●               │
│             Frankfurt                                   Dallas              │
│                                                                             │
│             Total Hub-to-Hub Tunnels: 15 per transport                     │
│             (6 hubs × 5 connections ÷ 2 = 15)                              │
│                                                                             │
│                         HUB-AND-SPOKE (Branches)                           │
│                                                                             │
│                              Mumbai ●                                       │
│                             /   |   \                                       │
│                            /    |    \                                      │
│                     Bangalore  Delhi  Noida                                │
│                         ●       ●       ●                                   │
│                                                                             │
│             Total Branch Tunnels: 6 per branch (2 DC × 3 colors)           │
│                                                                             │
│  Tunnel Summary:                                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │ Tunnel Type       │ Per Transport │ Total (3 transports) │ Status   │  │
│  │───────────────────│───────────────│──────────────────────│──────────│  │
│  │ Hub-to-Hub        │ 15            │ 45                   │ Active   │  │
│  │ Hub-to-Branch     │ 18            │ 54                   │ Active   │  │
│  │ Branch-to-Branch  │ 0 (via hub)   │ 0                    │ N/A      │  │
│  │ Total Tunnels     │ 33            │ 99                   │          │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### IPsec Configuration

```
! IPsec Security Association Configuration
security
 ipsec
  rekey 3600
  replay-window 64
  authentication-type sha1-hmac ah-sha1-hmac
  integrity-type ip-udp-esp ip-udp-esp-no-id esp
 !
!

! Verify IPsec tunnels
show sdwan ipsec inbound-connections
show sdwan ipsec outbound-connections
show sdwan ipsec local-sa

! Example output:
DESTINATION     DESTINATION  REMOTE          REMOTE          LOCAL           SPI     
IP              PORT         TLOC ADDRESS    TLOC COLOR      TLOC COLOR              
--------------------------------------------------------------------------------
10.1.200.1      12346        198.51.100.21   mpls            mpls            256
10.1.200.1      12346        203.0.113.1     biz-internet    biz-internet    257
10.1.300.1      12346        81.2.69.142     mpls            mpls            258
```

---

## 2.3.5 BFD (Bidirectional Forwarding Detection)

### BFD Configuration

BFD provides sub-second failure detection for IPsec tunnels.

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Hello Interval | 1000 ms | Liveness probe frequency |
| Multiplier | 7 | Miss count before failure |
| Detection Time | 7 seconds | Failover trigger |
| Poll Interval | 600000 ms | Path characteristic measurement |

### BFD Template Configuration

```
! BFD Configuration on WAN Edge
sdwan
 bfd default-dscp 48
 bfd app-route multiplier 6
 bfd app-route poll-interval 120000
!

! Per-color BFD tuning
sdwan
 interface TenGigabitEthernet0/0/0
  tunnel-interface
   color mpls
   bfd
    color mpls
     hello-interval 1000
     multiplier 7
     pmtu-discovery
   !
  !
 !
!

! Verify BFD sessions
show sdwan bfd sessions

                                      SOURCE TLOC      REMOTE TLOC                       DST PUBLIC                      DST PUBLIC         DETECT   TX                              
SYSTEM IP        SITE ID  STATE       COLOR            COLOR            SOURCE IP        IP                              PORT        ENCAP  MULT     INTERVAL(msec)   UPTIME          
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
10.1.200.1       200      up          mpls             mpls             172.16.1.2       172.16.2.2                      12346       ipsec  7        1000             1:05:23:47      
10.1.200.1       200      up          biz-internet     biz-internet     203.0.113.1      203.0.114.1                     12346       ipsec  7        1000             1:05:23:45      
10.1.300.1       300      up          mpls             mpls             172.16.1.2       81.2.69.142                     12346       ipsec  7        1000             1:05:22:30
```

---

## 2.3.6 WAN Edge High Availability

### HA Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| Active-Active | Both routers forward traffic | Data centers, regional hubs |
| Active-Standby | Primary forwards, secondary monitors | Branch offices |
| Single Router | No redundancy | Small/remote branches |

### Active-Active Design (Data Center)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ACTIVE-ACTIVE HA DESIGN                                  │
│                         Mumbai Data Center                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                      SD-Access Border Nodes                                │
│                 (ECMP routing to both WAN Edges)                           │
│                                                                             │
│   ┌────────────────────────────────────────────────────────────────────┐  │
│   │                                                                    │  │
│   │  ┌────────────────┐              ┌────────────────┐               │  │
│   │  │  Border Node 1 │              │  Border Node 2 │               │  │
│   │  │                │              │                │               │  │
│   │  │ VRF CORPORATE  │              │ VRF CORPORATE  │               │  │
│   │  │ NH: 10.254.1.2 │              │ NH: 10.254.1.2 │               │  │
│   │  │ NH: 10.254.1.6 │              │ NH: 10.254.1.6 │               │  │
│   │  │                │              │                │               │  │
│   │  └───────┬────────┘              └───────┬────────┘               │  │
│   │          │                               │                        │  │
│   │          │ ECMP Load Balance             │                        │  │
│   │          │                               │                        │  │
│   └──────────┼───────────────────────────────┼────────────────────────┘  │
│              │                               │                            │
│     ┌────────▼────────┐             ┌────────▼────────┐                  │
│     │   WAN Edge 1    │             │   WAN Edge 2    │                  │
│     │  (Active)       │◄═══════════►│   (Active)      │                  │
│     │                 │  OMP Sync   │                 │                  │
│     │ System-IP:      │             │ System-IP:      │                  │
│     │ 10.1.100.1      │             │ 10.1.100.2      │                  │
│     │                 │             │                 │                  │
│     │ LAN: 10.254.1.2 │             │ LAN: 10.254.1.6 │                  │
│     │                 │             │                 │                  │
│     │ TLOCs:          │             │ TLOCs:          │                  │
│     │ - mpls          │             │ - mpls          │                  │
│     │ - biz-internet  │             │ - biz-internet  │                  │
│     │ - 5g            │             │ - 5g            │                  │
│     │                 │             │                 │                  │
│     └────────┬────────┘             └────────┬────────┘                  │
│              │                               │                            │
│              │     Remote Site Traffic       │                            │
│              ▼                               ▼                            │
│         ┌────────┐                      ┌────────┐                        │
│         │ MPLS   │                      │  DIA   │                        │
│         │ Cloud  │                      │ Cloud  │                        │
│         └────────┘                      └────────┘                        │
│                                                                             │
│  Traffic Distribution: 50/50 ECMP across both WAN Edges                   │
│  Failover Time: < 1 second (BFD-triggered)                                │
│  OMP Sync: Routes/policies synchronized between WAN Edges                  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### HA Configuration

```
! Active-Active Configuration (both WAN Edges)
! Same site-id, different system-ip

! WAN Edge 1
system
 system-ip             10.1.100.1
 site-id               100
 admin-tech-on-failure
!

! WAN Edge 2
system
 system-ip             10.1.100.2
 site-id               100
 admin-tech-on-failure
!

! BGP Configuration for LAN-side HA (both WAN Edges)
router bgp 65501
 bgp log-neighbor-changes
 !
 address-family ipv4 vrf CORPORATE
  neighbor 10.254.1.1 remote-as 65001
  neighbor 10.254.1.1 activate
  neighbor 10.254.1.1 soft-reconfiguration inbound
  redistribute omp
 exit-address-family
!
```

---

## 2.3.7 Service VPN Design

### VPN Segmentation Model

| Service VPN | VPN ID | Purpose | Associated VRF |
|-------------|--------|---------|----------------|
| Transport | 0 | Control plane, underlay | Global |
| Corporate | 10 | Employee traffic | CORPORATE |
| Guest | 20 | Guest/visitor access | GUEST |
| IoT | 30 | IoT devices | IOT |
| Voice | 40 | Unified communications | VOICE |
| PCI | 50 | Payment card processing | PCI |
| Management | 512 | Device management | Management |

### Service VPN Configuration

```
! Service VPN 10 - Corporate
vpn 10
 name "CORPORATE"
 ecmp-hash-key layer4
 !
 dns 10.10.10.53 primary
 dns 10.10.20.53 secondary
 !
 interface GigabitEthernet0/0/0.100
  ip address 10.254.1.2 255.255.255.252
  no shutdown
 !
 ip route 0.0.0.0 0.0.0.0 vpn 0
 !
 omp
  advertise connected
  advertise static
  advertise ospf external
 !
!

! Service VPN 40 - Voice (with QoS priority)
vpn 40
 name "VOICE"
 ecmp-hash-key layer4
 !
 interface GigabitEthernet0/0/0.400
  ip address 10.254.4.2 255.255.255.252
  bandwidth 100000
  no shutdown
 !
 ip route 0.0.0.0 0.0.0.0 vpn 0
!
```

---

## 2.3.8 Verification Commands

### Data Plane Verification

```
! Verify routing table
show sdwan omp routes vpn 10

! Verify TLOC table
show sdwan omp tlocs

! Verify tunnel status
show sdwan tunnel statistics

! Verify BFD status
show sdwan bfd history

! Verify IPsec SAs
show sdwan ipsec local-sa

! Verify interface status
show sdwan interface

! Performance statistics
show sdwan app-route statistics
```

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Network Architecture Team | Initial release |

---

*End of Section 2.3 - Data Plane Design*
