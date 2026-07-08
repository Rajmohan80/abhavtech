# 2.4 Overlay Topology Design

## Document Information
| Field | Value |
|-------|-------|
| Document Title | Overlay Topology Design |
| Section Number | 2.4 |
| Version | 1.0 |
| Last Updated | December 30, 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 2.4.1 Overlay Topology Overview

### Purpose and Scope

The overlay topology design defines the logical network structure that operates on top of the physical transport infrastructure. This design enables Abhavtech.com to create a secure, policy-driven WAN that abstracts the underlying transport complexity while providing deterministic application performance.

### Topology Selection Criteria

| Criterion | Hub-and-Spoke | Partial Mesh | Full Mesh | Selected |
|-----------|---------------|--------------|-----------|----------|
| Branch Count Support | Excellent | Good | Limited | Hub-and-Spoke |
| DC/Hub Traffic Pattern | Optimal | Good | N/A | Hub-and-Spoke |
| Branch-to-Branch Direct | No | Yes | Yes | Partial Mesh |
| Control Plane Scale | Minimal | Moderate | High | Partial Mesh |
| Tunnel Count | Low | Moderate | High | Partial Mesh |
| Management Complexity | Low | Moderate | High | Partial Mesh |
| Bandwidth Efficiency | Lower | Higher | Highest | Partial Mesh |

### Selected Topology: Hierarchical Partial Mesh

```
                              OVERLAY TOPOLOGY - ABHAVTECH.COM
+==============================================================================+
|                              REGIONAL HUB LAYER                              |
|                           (Full Mesh Between Hubs)                           |
+==============================================================================+
|                                                                              |
|     +------------------+          +------------------+                       |
|     |   MUMBAI DC      |==========|   CHENNAI DR     |                       |
|     |   Primary Hub    |   IPsec  |   Secondary Hub  |                       |
|     |   C8500-12X4QC   |   Mesh   |   C8500-12X4QC   |                       |
|     +--------+---------+          +--------+---------+                       |
|              |                             |                                 |
|   +----------+----------+       +----------+----------+                      |
|   |          |          |       |          |          |                      |
+===|==========|==========|=======|==========|==========|======================+
    |          |          |       |          |          |
+===|==========|==========|=======|==========|==========|======================+
|   |  REGIONAL HUB LAYER |       |  REGIONAL HUB LAYER |                      |
+===|==========|==========|=======|==========|==========|======================+
    |          |          |       |          |          |
    v          v          v       v          v          v
+-------+  +-------+  +-------+  +-------+  +-------+  +-------+
|LONDON |  |FRANK- |  |NEW    |  |DALLAS |  |BANGA- |  |DELHI  |
|Hub    |  |FURT   |  |JERSEY |  |Hub    |  |LORE   |  |Branch |
|C8300  |  |Hub    |  |Hub    |  |C8300  |  |Branch |  |C8200L |
+---+---+  |C8300  |  |C8300  |  +---+---+  |C8200L |  +-------+
    |      +---+---+  +---+---+      |      +-------+      |
    |          |          |          |          |          |
    +====EMEA==+          +===AMER===+          +==INDIA===+
      Hub Mesh              Hub Mesh            Spoke Only
                                                    |
                                               +----+----+
                                               |  NOIDA  |
                                               | Branch  |
                                               | C8200L  |
                                               +---------+
+==============================================================================+
|                              TOPOLOGY SUMMARY                                |
+----------------------+-------------------------------------------------------+
| Hub-to-Hub           | Full IPsec mesh (Mumbai, Chennai, London, Frankfurt, |
|                      | New Jersey, Dallas) = 15 tunnel pairs per transport  |
+----------------------+-------------------------------------------------------+
| Hub-to-Branch        | Hub-and-spoke (Bangalore, Delhi, Noida to nearest    |
|                      | regional hub) = 6 tunnel pairs per transport         |
+----------------------+-------------------------------------------------------+
| Branch-to-Branch     | On-demand via regional hub (no direct tunnels)       |
+----------------------+-------------------------------------------------------+
| Total Tunnels        | 63 per transport × 3 transports = 189 tunnels        |
+----------------------+-------------------------------------------------------+
```

---

## 2.4.2 Tunnel Architecture

### Tunnel Types and Characteristics

| Tunnel Type | Encapsulation | Use Case | MTU | Overhead |
|-------------|---------------|----------|-----|----------|
| IPsec (GRE) | GRE over IPsec | Standard tunnels | 1400 | 62 bytes |
| IPsec (IPSEC) | Native IPsec | High-performance | 1442 | 58 bytes |
| TLOC Extension | Layer 2 | DC interconnect | 1400 | 62 bytes |
| SIG Tunnel | IPsec to cloud | SASE/SIG | 1400 | 62 bytes |

### Tunnel Color Assignment

```
                    TRANSPORT COLOR MAPPING
+==============================================================================+
|                                                                              |
|    COLOR           TRANSPORT TYPE              PREFERENCE     SLA CLASS      |
|    ─────           ──────────────              ──────────     ─────────      |
|    mpls            Private MPLS WAN            Primary        Business       |
|    biz-internet    Business-grade Internet     Secondary      Default        |
|    public-internet Consumer Internet           Tertiary       Bulk           |
|    lte             LTE Cellular Backup         Emergency      Real-Time      |
|    5g              5G Cellular (Future)        Emergency      Real-Time      |
|    private1        AWS Direct Connect          Cloud-Pref     Business       |
|    private2        Azure ExpressRoute          Cloud-Pref     Business       |
|                                                                              |
+==============================================================================+

SITE COLOR AVAILABILITY MATRIX
+-------------+------+------+--------+-----+----+----------+----------+
| Site        | MPLS | Biz  | Public | LTE | 5G | Private1 | Private2 |
+-------------+------+------+--------+-----+----+----------+----------+
| Mumbai DC   |  ✓   |  ✓   |   ✓    |  ✓  | -  |    ✓     |    ✓     |
| Chennai DR  |  ✓   |  ✓   |   ✓    |  ✓  | -  |    ✓     |    ✓     |
| London      |  ✓   |  ✓   |   -    |  ✓  | -  |    ✓     |    ✓     |
| Frankfurt   |  ✓   |  ✓   |   -    |  ✓  | -  |    ✓     |    ✓     |
| New Jersey  |  ✓   |  ✓   |   -    |  ✓  | -  |    ✓     |    ✓     |
| Dallas      |  ✓   |  ✓   |   -    |  ✓  | -  |    ✓     |    ✓     |
| Bangalore   |  ✓   |  ✓   |   ✓    |  ✓  | -  |    -     |    -     |
| Delhi       |  ✓   |  ✓   |   ✓    |  ✓  | -  |    -     |    -     |
| Noida       |  -   |  ✓   |   ✓    |  ✓  | -  |    -     |    -     |
+-------------+------+------+--------+-----+----+----------+----------+
```

### TLOC Configuration

#### Hub Site TLOC Definition (Mumbai DC)

```
! Mumbai DC WAN Edge 1 - TLOC Configuration
system
 system-ip             10.1.100.1
 site-id               100
 organization-name     "Abhavtech-SD-WAN"
 vbond 13.234.xxx.xxx port 12346
!
! MPLS Transport TLOC
interface GigabitEthernet0/0/0
 description MPLS-Transport-to-Provider
 ip address 172.16.1.2 255.255.255.252
 tunnel-interface
  encapsulation ipsec weight 1
  color mpls restrict
  max-control-connections 2
  no allow-service all
  allow-service dhcp
  allow-service dns
  allow-service icmp
  allow-service sshd
  allow-service netconf
  allow-service ntp
  allow-service stun
  allow-service bfd
 !
!
! Business Internet Transport TLOC
interface GigabitEthernet0/0/1
 description Business-Internet-Primary
 ip address dhcp
 tunnel-interface
  encapsulation ipsec weight 1
  color biz-internet
  carrier Tata-Communications
  max-control-connections 2
  vmanage-connection-preference 5
  no allow-service all
  allow-service dhcp
  allow-service dns
  allow-service icmp
  allow-service stun
 !
!
! Public Internet Transport TLOC  
interface GigabitEthernet0/0/2
 description Public-Internet-Backup
 ip address dhcp
 tunnel-interface
  encapsulation ipsec weight 1
  color public-internet
  carrier Airtel-Broadband
  max-control-connections 1
  no allow-service all
  allow-service stun
 !
!
! LTE Backup Transport TLOC
interface Cellular0/2/0
 description LTE-Emergency-Backup
 ip address negotiated
 tunnel-interface
  encapsulation ipsec weight 1
  color lte
  carrier Jio-4G
  max-control-connections 0
  no allow-service all
  allow-service stun
  low-bandwidth-link
 !
```

#### Branch Site TLOC Definition (Noida)

```
! Noida Branch WAN Edge - TLOC Configuration
system
 system-ip             10.1.105.1
 site-id               105
 organization-name     "Abhavtech-SD-WAN"
 vbond 13.234.xxx.xxx port 12346
!
! Business Internet Transport TLOC
interface GigabitEthernet0/0/0
 description Business-Internet-Primary
 ip address dhcp
 tunnel-interface
  encapsulation ipsec weight 1
  color biz-internet
  carrier Tata-Communications
  max-control-connections 2
  vmanage-connection-preference 5
  no allow-service all
  allow-service dhcp
  allow-service dns
  allow-service icmp
  allow-service stun
 !
!
! Public Internet Transport TLOC
interface GigabitEthernet0/0/1
 description Public-Internet-Backup
 ip address dhcp
 tunnel-interface
  encapsulation ipsec weight 1
  color public-internet
  carrier Airtel-Broadband
  max-control-connections 1
  no allow-service all
  allow-service stun
 !
!
! LTE Backup Transport TLOC
interface Cellular0/1/0
 description LTE-Emergency-Backup
 ip address negotiated
 tunnel-interface
  encapsulation ipsec weight 1
  color lte
  carrier Jio-4G
  max-control-connections 0
  no allow-service all
  allow-service stun
  low-bandwidth-link
 !
```

---

## 2.4.3 Site Types and Roles

### Site Classification Matrix

| Site Type | Role | Tunnel Behavior | Route Preference | Examples |
|-----------|------|-----------------|------------------|----------|
| Data Center | Primary Hub | Full mesh to all hubs, attract all traffic | Highest (0) | Mumbai |
| DR Site | Secondary Hub | Full mesh, standby for DC | High (100) | Chennai |
| Regional Hub | Transit Hub | Full mesh to other hubs, hub for branches | Medium (200) | London, NJ |
| Large Branch | Spoke | Hub-and-spoke to regional hub | Default (500) | Bangalore |
| Small Branch | Spoke | Hub-and-spoke, single WAN Edge | Default (500) | Noida |
| Remote Worker | Edge | Direct to cloud or hub | Lowest (1000) | Future |

### Site-ID and System-IP Allocation

```
                    SITE IDENTIFICATION SCHEME
+==============================================================================+
|                                                                              |
|  REGION        SITE            SITE-ID    SYSTEM-IP RANGE    WAN EDGES      |
|  ──────        ────            ───────    ───────────────    ─────────      |
|                                                                              |
|  INDIA-DC      Mumbai DC       100        10.1.100.1-2       2 (HA Pair)    |
|  INDIA-DR      Chennai DR      200        10.1.200.1-2       2 (HA Pair)    |
|  INDIA         Bangalore       103        10.1.103.1-2       2 (HA Pair)    |
|  INDIA         Delhi           104        10.1.104.1-2       2 (HA Pair)    |
|  INDIA         Noida           105        10.1.105.1         1 (Single)     |
|                                                                              |
|  EMEA          London          300        10.1.300.1-2       2 (HA Pair)    |
|  EMEA          Frankfurt       301        10.1.301.1-2       2 (HA Pair)    |
|                                                                              |
|  AMERICAS      New Jersey      400        10.1.400.1-2       2 (HA Pair)    |
|  AMERICAS      Dallas          401        10.1.401.1-2       2 (HA Pair)    |
|                                                                              |
+------------------------------------------------------------------------------+
|  SITE-ID NUMBERING CONVENTION                                                |
|  ─────────────────────────────                                               |
|  1xx = India Region (100=DC, 103-199=Branches)                              |
|  2xx = India DR Region (200=DR, 203-299=DR Branches)                        |
|  3xx = EMEA Region (300=Primary Hub, 301-399=Sites)                         |
|  4xx = Americas Region (400=Primary Hub, 401-499=Sites)                     |
+==============================================================================+
```

### Hub Site Configuration

```
! Mumbai DC - Hub Site Role Configuration
policy
 control-policy HUB-ROLE
  sequence 10
   match route
    site-list BRANCH-SITES
   !
   action accept
    set
     tloc-action primary
     preference 0
    !
   !
  !
  sequence 20
   match route
    site-list HUB-SITES
   !
   action accept
    set
     preference 100
    !
   !
  !
  default-action accept
 !
!
apply-policy
 site-list DC-SITES
  control-policy HUB-ROLE out
 !
!
lists
 site-list DC-SITES
  site-id 100
 !
 site-list DR-SITES
  site-id 200
 !
 site-list HUB-SITES
  site-id 100
  site-id 200
  site-id 300
  site-id 301
  site-id 400
  site-id 401
 !
 site-list BRANCH-SITES
  site-id 103
  site-id 104
  site-id 105
 !
```

---

## 2.4.4 Topology Policies

### Control Policy for Hub-and-Spoke

```
! Control Policy - Hub Preference for Branch Traffic
policy
 control-policy BRANCH-TO-HUB
  sequence 10
   match route
    site-list INDIA-BRANCHES
    prefix-list CORPORATE-PREFIXES
   !
   action accept
    set
     tloc-list INDIA-HUBS-TLOC
     tloc-action strict
    !
   !
  !
  sequence 20
   match route
    site-list EMEA-SITES
    prefix-list CORPORATE-PREFIXES
   !
   action accept
    set
     tloc-list EMEA-HUBS-TLOC
     tloc-action strict
    !
   !
  !
  sequence 30
   match route
    site-list AMERICAS-SITES
    prefix-list CORPORATE-PREFIXES
   !
   action accept
    set
     tloc-list AMERICAS-HUBS-TLOC
     tloc-action strict
    !
   !
  !
  default-action accept
 !
!
lists
 site-list INDIA-BRANCHES
  site-id 103-105
 !
 site-list INDIA-HUBS
  site-id 100
  site-id 200
 !
 site-list EMEA-SITES
  site-id 300-399
 !
 site-list AMERICAS-SITES
  site-id 400-499
 !
 tloc-list INDIA-HUBS-TLOC
  tloc 10.1.100.1 color mpls encap ipsec
  tloc 10.1.100.2 color mpls encap ipsec
  tloc 10.1.200.1 color mpls encap ipsec
  tloc 10.1.200.2 color mpls encap ipsec
 !
 tloc-list EMEA-HUBS-TLOC
  tloc 10.1.300.1 color mpls encap ipsec
  tloc 10.1.300.2 color mpls encap ipsec
  tloc 10.1.301.1 color mpls encap ipsec
  tloc 10.1.301.2 color mpls encap ipsec
 !
 tloc-list AMERICAS-HUBS-TLOC
  tloc 10.1.400.1 color mpls encap ipsec
  tloc 10.1.400.2 color mpls encap ipsec
  tloc 10.1.401.1 color mpls encap ipsec
  tloc 10.1.401.2 color mpls encap ipsec
 !
 prefix-list CORPORATE-PREFIXES
  ip-prefix 10.0.0.0/8 le 32
  ip-prefix 172.16.0.0/12 le 32
  ip-prefix 192.168.0.0/16 le 32
 !
```

### Topology Policy for Regional Affinity

```
! Control Policy - Regional Affinity
policy
 control-policy REGIONAL-AFFINITY
  sequence 10
   match route
    site-list INDIA-ALL
    prefix-list ALL-PREFIXES
   !
   action accept
    set
     affinity-group preference 1 2
     affinity-group 1
    !
   !
  !
  sequence 20
   match route
    site-list EMEA-ALL
    prefix-list ALL-PREFIXES
   !
   action accept
    set
     affinity-group preference 3 4
     affinity-group 3
    !
   !
  !
  sequence 30
   match route
    site-list AMERICAS-ALL
    prefix-list ALL-PREFIXES
   !
   action accept
    set
     affinity-group preference 5 6
     affinity-group 5
    !
   !
  !
  default-action accept
 !
!
! Affinity Group Definitions
! Group 1: India DC (Mumbai)
! Group 2: India DR (Chennai) + India Branches
! Group 3: EMEA Primary (London)
! Group 4: EMEA Secondary (Frankfurt)
! Group 5: Americas Primary (New Jersey)
! Group 6: Americas Secondary (Dallas)
```

---

## 2.4.5 Tunnel Restrict and Preferences

### Color Restrict Configuration

```
                    TUNNEL COLOR RESTRICTIONS
+==============================================================================+
|                                                                              |
|  USE CASE                     CONFIGURATION                 BEHAVIOR         |
|  ────────                     ─────────────                 ────────         |
|                                                                              |
|  MPLS-Only Corporate          color mpls restrict           Only MPLS peers  |
|  Internet Breakout            color biz-internet            All colors peer  |
|  LTE Last Resort              color lte                     Peer when needed |
|  Cloud Direct Connect         color private1 restrict       Only cloud peers |
|                                                                              |
+==============================================================================+
```

### TLOC Preference and Weight

```
! TLOC Preference Configuration - Mumbai DC
interface GigabitEthernet0/0/0
 tunnel-interface
  color mpls restrict
  preference 100                 ! Highest preference for MPLS
  weight 1
 !
!
interface GigabitEthernet0/0/1
 tunnel-interface
  color biz-internet
  preference 50                  ! Medium preference for business internet
  weight 1
 !
!
interface GigabitEthernet0/0/2
 tunnel-interface
  color public-internet
  preference 25                  ! Lower preference for public internet
  weight 1
 !
!
interface Cellular0/2/0
 tunnel-interface
  color lte
  preference 10                  ! Lowest preference for LTE
  weight 1
  low-bandwidth-link            ! Limit control connections
 !
```

### Tunnel Group Configuration

```
! Tunnel Groups for Load Balancing
sdwan
 tunnel-group MPLS-GROUP
  tunnel 10.1.100.1 color mpls
  tunnel 10.1.100.2 color mpls
 !
 tunnel-group INTERNET-GROUP
  tunnel 10.1.100.1 color biz-internet
  tunnel 10.1.100.2 color biz-internet
  tunnel 10.1.100.1 color public-internet
  tunnel 10.1.100.2 color public-internet
 !
 tunnel-group ALL-TRANSPORTS
  tunnel 10.1.100.1 color mpls
  tunnel 10.1.100.2 color mpls
  tunnel 10.1.100.1 color biz-internet
  tunnel 10.1.100.2 color biz-internet
 !
```

---

## 2.4.6 Tunnel Count Analysis

### Per-Site Tunnel Calculation

```
                    TUNNEL COUNT ANALYSIS
+==============================================================================+
|                                                                              |
|  SITE TYPE          PEER COUNT    TRANSPORTS    TUNNELS/PEER    TOTAL       |
|  ─────────          ──────────    ──────────    ────────────    ─────       |
|                                                                              |
|  DC/DR HUBS                                                                  |
|  Mumbai DC          7 hubs        4             2 (HA)          56          |
|                     3 branches    4             1-2             18          |
|                                                                    ───       |
|                                                   Mumbai Total:   74         |
|                                                                              |
|  Chennai DR         7 hubs        4             2 (HA)          56          |
|                     3 branches    4             1-2             18          |
|                                                                    ───       |
|                                                   Chennai Total:  74         |
|                                                                              |
|  REGIONAL HUBS                                                               |
|  London             7 hubs        3             2 (HA)          42          |
|  Frankfurt          7 hubs        3             2 (HA)          42          |
|  New Jersey         7 hubs        3             2 (HA)          42          |
|  Dallas             7 hubs        3             2 (HA)          42          |
|                                                                              |
|  BRANCHES                                                                    |
|  Bangalore          2 hubs        3             2 (HA)          12          |
|  Delhi              2 hubs        3             2 (HA)          12          |
|  Noida              2 hubs        3             1 (Single)      6           |
|                                                                              |
+------------------------------------------------------------------------------+
|  OVERLAY SUMMARY                                                             |
|  ───────────────                                                             |
|  Total Tunnel Endpoints:    17 WAN Edges                                    |
|  Hub-to-Hub Tunnels:        42 pairs × 3 transports = 126                   |
|  Hub-to-Branch Tunnels:     10 pairs × 3 transports = 30                    |
|  Total IPsec Tunnels:       156 (bi-directional counted once)               |
|  Effective Tunnel Count:    312 (counting both directions)                  |
+==============================================================================+
```

### Tunnel Scale Limits

| Component | Current | Year 1 | Year 3 | Platform Limit |
|-----------|---------|--------|--------|----------------|
| WAN Edges | 17 | 22 | 30 | 10,000 |
| IPsec Tunnels | 156 | 200 | 300 | 8,000 per vSmart |
| OMP Routes | 500 | 750 | 1,500 | 500,000 |
| Control Connections | 68 | 90 | 120 | 6,000 per vSmart |

---

## 2.4.7 Overlay Verification

### Tunnel Status Verification

```
! Verify BFD Sessions
Mumbai-DC-WAN1# show sdwan bfd sessions

                                      SOURCE TLOC           REMOTE TLOC                             DST PUBLIC                      DST PUBLIC                                      
SYSTEM IP        SITE ID  STATE       COLOR       COLOR            SOURCE IP                       IP                              PORT    ENCAP  MULTIPLIER  TIMEOUT(msec)  UPTIME  
------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
10.1.100.2       100      up          mpls        mpls             172.16.1.2                      172.16.1.6                      12346   ipsec  7           7000           45:12:33 
10.1.200.1       200      up          mpls        mpls             172.16.1.2                      172.17.1.2                      12346   ipsec  7           7000           45:12:30 
10.1.200.2       200      up          mpls        mpls             172.16.1.2                      172.17.1.6                      12346   ipsec  7           7000           45:12:28 
10.1.300.1       300      up          mpls        mpls             172.16.1.2                      172.18.1.2                      12346   ipsec  7           7000           45:12:25 
10.1.300.2       300      up          mpls        mpls             172.16.1.2                      172.18.1.6                      12346   ipsec  7           7000           45:12:22 
10.1.100.2       100      up          biz-internet biz-internet    103.21.xxx.1                    103.21.xxx.5                    12346   ipsec  7           7000           45:10:15 
10.1.200.1       200      up          biz-internet biz-internet    103.21.xxx.1                    203.0.113.10                    12346   ipsec  7           7000           45:10:12 
10.1.103.1       103      up          biz-internet biz-internet    103.21.xxx.1                    103.22.xxx.1                    12346   ipsec  7           7000           45:08:45 
10.1.103.2       103      up          biz-internet biz-internet    103.21.xxx.1                    103.22.xxx.5                    12346   ipsec  7           7000           45:08:42 
```

### OMP Peer Verification

```
! Verify OMP Peer Status
Mumbai-DC-WAN1# show sdwan omp peers

                         DOMAIN    OVERLAY   SITE                              
PEER             TYPE    ID        ID        ID        STATE    UPTIME        
---------------------------------------------------------------------------------
10.255.255.1     vsmart  1         1         0         up       45:15:22      
10.255.255.2     vsmart  1         1         0         up       45:15:20      
10.255.255.3     vsmart  1         1         0         up       45:15:18      
10.255.255.4     vsmart  1         1         0         up       45:15:15      
```

### TLOC Table Verification

```
! Verify TLOC Table
Mumbai-DC-WAN1# show sdwan omp tlocs

-----------------------------------------------------------------------------------------------------------------
TLOC                      RECEIVED VIA    ENCAP   PREF   WEIGHT   ORIGINATOR   COLOR           STATUS   BFD-STATUS
-----------------------------------------------------------------------------------------------------------------
10.1.100.1
    mpls                  ompv2           ipsec   100    1        10.1.100.1   mpls            C,Red    up
    biz-internet          ompv2           ipsec   50     1        10.1.100.1   biz-internet    C,Red    up
    public-internet       ompv2           ipsec   25     1        10.1.100.1   public-internet C,Red    up
    lte                   ompv2           ipsec   10     1        10.1.100.1   lte             C,Red    up
10.1.100.2
    mpls                  ompv2           ipsec   100    1        10.1.100.2   mpls            R        up
    biz-internet          ompv2           ipsec   50     1        10.1.100.2   biz-internet    R        up
    public-internet       ompv2           ipsec   25     1        10.1.100.2   public-internet R        up
    lte                   ompv2           ipsec   10     1        10.1.100.2   lte             R        up
10.1.200.1
    mpls                  ompv2           ipsec   100    1        10.1.200.1   mpls            R        up
    biz-internet          ompv2           ipsec   50     1        10.1.200.1   biz-internet    R        up
10.1.103.1
    mpls                  ompv2           ipsec   100    1        10.1.103.1   mpls            R        up
    biz-internet          ompv2           ipsec   50     1        10.1.103.1   biz-internet    R        up
    public-internet       ompv2           ipsec   25     1        10.1.103.1   public-internet R        up
```

---

## 2.4.8 Topology Design Decisions

### Design Decision Matrix

| Decision Point | Options Considered | Selected Option | Rationale |
|----------------|---------------------|-----------------|-----------|
| Hub Connectivity | Full mesh / Partial | Full mesh | 6 hubs, manageable tunnel count, optimal latency |
| Branch Connectivity | Direct mesh / Hub-spoke | Hub-and-spoke | Simpler management, policy enforcement at hub |
| Transport Priority | MPLS first / Internet first | MPLS primary | SLA guarantee, existing investment |
| Color Restriction | Restrict / No restrict | Restrict for MPLS | Keep private traffic on private network |
| Tunnel Encapsulation | GRE/IPsec / Native IPsec | GRE over IPsec | Compatibility, multicast support |
| Regional Affinity | Enable / Disable | Enable | Optimize regional traffic patterns |

### Future Topology Considerations

| Enhancement | Timeline | Impact |
|-------------|----------|--------|
| On-demand branch mesh | Phase 2 | Enable direct branch-to-branch for latency-sensitive apps |
| 5G integration | Year 2 | Add 5G color for enhanced mobility |
| Cloud gateway sites | Phase 3 | Add cloud-based hub sites for SaaS optimization |
| Remote worker topology | Year 2 | Integrate remote access VPN with overlay |

---

## 2.4.9 Appendix: Overlay Topology Diagrams

### Regional View - India

```
                         INDIA REGION OVERLAY TOPOLOGY
+==============================================================================+
|                                                                              |
|                    +------------------+                                      |
|                    |    vSMART-1,2    |                                      |
|                    |   Mumbai Cluster |                                      |
|                    +--------+---------+                                      |
|                             |                                                |
|                             | OMP Sessions                                   |
|                             |                                                |
|         +-------------------+-------------------+                            |
|         |                   |                   |                            |
|         v                   v                   v                            |
|   +----------+        +----------+        +----------+                       |
|   | MUMBAI   |========| CHENNAI  |========| REGIONAL |                       |
|   | DC HUB   |  IPsec | DR HUB   |  IPsec | HUBS     |                       |
|   | WAN1/WAN2|  Mesh  | WAN1/WAN2|  Mesh  | (4 sites)|                       |
|   +----+-----+        +----+-----+        +----------+                       |
|        |                   |                                                 |
|        | Hub-Spoke         | Hub-Spoke                                       |
|        |                   |                                                 |
|   +----+--------+-----+----+                                                 |
|   |             |          |                                                 |
|   v             v          v                                                 |
| +--------+ +--------+ +--------+                                             |
| |BANGALORE| | DELHI  | | NOIDA  |                                            |
| |Branch  | |Branch  | |Branch  |                                             |
| |WAN1/2  | |WAN1/2  | |WAN1    |                                             |
| +--------+ +--------+ +--------+                                             |
|                                                                              |
| LEGEND:                                                                      |
| ======== Full Mesh IPsec Tunnels                                            |
| -------- Hub-and-Spoke Tunnels                                              |
|                                                                              |
+==============================================================================+
```

### Global View

```
                              GLOBAL OVERLAY TOPOLOGY
+==============================================================================+
|                                                                              |
|                          CONTROL PLANE                                       |
|              +--------+  +--------+  +--------+  +--------+                  |
|              |vSmart-1|  |vSmart-2|  |vSmart-3|  |vSmart-4|                  |
|              |Mumbai  |  |Mumbai  |  |Chennai |  |Chennai |                  |
|              +---+----+  +---+----+  +---+----+  +---+----+                  |
|                  |           |           |           |                       |
|                  +-----+-----+-----+-----+-----+-----+                       |
|                        |                 |                                   |
|                        v                 v                                   |
|  +===================DATA PLANE - FULL MESH HUBS===================+        |
|  |                                                                  |        |
|  |   MUMBAI<==========>CHENNAI<==========>LONDON<=======>FRANKFURT |        |
|  |      ^                 ^                  ^               ^      |        |
|  |      |                 |                  |               |      |        |
|  |      +========+========+                  +======+========+      |        |
|  |               |                                  |               |        |
|  |         NEW JERSEY<=========================>DALLAS              |        |
|  |                                                                  |        |
|  +==================================================================+        |
|                        |                                                     |
|                        v                                                     |
|  +=================BRANCH SITES (HUB-SPOKE)=================+               |
|  |                                                           |               |
|  |   BANGALORE -----> MUMBAI/CHENNAI                        |               |
|  |   DELHI     -----> MUMBAI/CHENNAI                        |               |
|  |   NOIDA     -----> MUMBAI/CHENNAI                        |               |
|  |                                                           |               |
|  +===========================================================+               |
|                                                                              |
+==============================================================================+
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 30, 2025 | Network Architecture Team | Initial release |

---

*This document is part of the Abhavtech.com SD-WAN Documentation Suite*
*Confidential - Internal Use Only*
