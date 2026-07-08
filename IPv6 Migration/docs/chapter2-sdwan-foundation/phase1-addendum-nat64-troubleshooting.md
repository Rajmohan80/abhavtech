# ABHAVTECH IPv6 MIGRATION — PHASE 1 ADDENDUM
## SD-WAN IPv6-SPECIFIC ADVANCED TOPICS

**Project:** ABV-IPV6-2025  
**Phase:** 1-Addendum — IPv6-Specific Features Only  
**Duration:** Optional (as needed)  
**Objective:** IPv6-specific SD-WAN features (NAT64, IPv6 troubleshooting)  
**Scope:** NAT64/NAT66, IPv6-specific troubleshooting scenarios  

---

## ADDENDUM OVERVIEW

```
PHASE 1-ADDENDUM — IPv6-SPECIFIC TOPICS ONLY:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  WHY THIS ADDENDUM:                                                │
│                                                                    │
│  Phase 1 (Weeks 2-5) completed IPv6 migration:                    │
│    ✅ Dual-stack WAN circuits (MPLS, DIA, ER, LTE)                │
│    ✅ BFD over IPv6 (360 sessions)                                │
│    ✅ OMP IPv6 route distribution                                 │
│    ✅ IPsec tunnels over IPv6                                     │
│    ✅ 19 sites dual-stack operational                             │
│                                                                    │
│  This addendum covers ONLY IPv6-specific features:                │
│    - NAT64 (IPv6-only clients → IPv4 services)                    │
│    - NAT66 (IPv6 source translation)                              │
│    - IPv6-specific troubleshooting scenarios                      │
│                                                                    │
│  NOTE: General SD-WAN features (policies, HA, Cloud OnRamp,       │
│        monitoring, etc.) are covered in the main SD-WAN           │
│        documentation project (Chapters 1-8, 132 sections).        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## SECTION 1: NAT64/NAT66 CONFIGURATION

## 1.1 NAT64 Overview

```
NAT64 USE CASE:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  SCENARIO: IPv6-Only Client Needs IPv4 Service Access             │
│                                                                    │
│  Example:                                                          │
│    Client: IPv6-only endpoint (2001:db8:abc1:2001::50)            │
│    Service: Legacy IPv4-only server (192.168.100.10)              │
│    Problem: IPv6 client cannot directly communicate with IPv4     │
│    Solution: NAT64 translates IPv6 ↔ IPv4 dynamically             │
│                                                                    │
│  NAT64 FLOW:                                                       │
│    1. IPv6 client sends packet to 64:ff9b::192.168.100.10         │
│       (IPv4 address embedded in IPv6 prefix)                      │
│    2. NAT64 router extracts IPv4 address (192.168.100.10)         │
│    3. Translates source IPv6 → IPv4 from pool                     │
│    4. Forwards IPv4 packet to destination                         │
│    5. Return traffic translated IPv4 → IPv6                       │
│                                                                    │
│  ABHAVTECH USE CASES:                                              │
│    - Branch with IPv6-only LAN accessing legacy datacenter apps   │
│    - IoT devices (IPv6-only) accessing IPv4 management servers    │
│    - Future-proofing for IPv6-only deployments                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 1.2 NAT64 Configuration on WAN Edge

```cisco
! ═══════════════════════════════════════════════════════════════════
! NAT64 CONFIGURATION (WAN Edge Router)
! Example: MUM-HUB-01 (Catalyst 8500-12X)
! ═══════════════════════════════════════════════════════════════════

configure terminal

! ───────────────────────────────────────────────────────────────────
! STEP 1: Define NAT64 Prefix (RFC 6052 Well-Known Prefix)
! ───────────────────────────────────────────────────────────────────

ipv6 nat prefix 64:ff9b::/96

! This prefix is used to embed IPv4 addresses in IPv6
! Example: IPv4 192.168.100.10 → IPv6 64:ff9b::192.168.100.10

! ───────────────────────────────────────────────────────────────────
! STEP 2: Create IPv4 Address Pool (for source translation)
! ───────────────────────────────────────────────────────────────────

ip nat pool NAT64-POOL 203.0.113.100 203.0.113.150 netmask 255.255.255.0

! Pool size: 51 IPv4 addresses (100-150)
! Used for translating IPv6 source addresses to IPv4

! ───────────────────────────────────────────────────────────────────
! STEP 3: Configure NAT64 Translation Rule
! ───────────────────────────────────────────────────────────────────

ipv6 nat v6v4 source list NAT64-ACL pool NAT64-POOL overload

! v6v4: IPv6 to IPv4 translation
! source list: Match IPv6 sources in ACL
! pool: Use NAT64-POOL for translated source addresses
! overload: Enable PAT (multiple IPv6 clients → single IPv4 with different ports)

! ───────────────────────────────────────────────────────────────────
! STEP 4: Define ACL (which IPv6 sources get NAT64)
! ───────────────────────────────────────────────────────────────────

ipv6 access-list NAT64-ACL
  permit ipv6 2001:db8:abc1::/48 64:ff9b::/96
  !
  ! Match: Source = Any IPv6 in Abhavtech space (2001:db8:abc1::/48)
  !        Destination = NAT64 prefix (64:ff9b::/96) 
  !        → Indicates IPv4 destination embedded in IPv6

! ───────────────────────────────────────────────────────────────────
! STEP 5: Apply NAT64 to Interfaces
! ───────────────────────────────────────────────────────────────────

! Inside interface (IPv6 clients)
interface GigabitEthernet0/1/0
  description SERVICE-VPN-1-CORPORATE
  vrf forwarding 1
  ipv6 nat
  !
  ! Enable NAT64 processing on this interface

! Outside interface (IPv4 destination)
interface TenGigabitEthernet0/0/4
  description DIA-PRIMARY-BT
  ip nat outside
  ipv6 nat
  !
  ! Mark as outside for NAT (both IPv4 NAT and NAT64)

! ───────────────────────────────────────────────────────────────────
! OPTIONAL: DNS64 for Name Resolution
! ───────────────────────────────────────────────────────────────────

! If IPv6 client queries DNS for IPv4-only server:
! DNS64 synthesizes AAAA record by embedding A record in NAT64 prefix

ip dns server
ipv6 nat translation dns-alg

! DNS-ALG: Translates DNS queries/responses for NAT64

! ───────────────────────────────────────────────────────────────────
! VERIFICATION
! ───────────────────────────────────────────────────────────────────

end
write memory

! Show NAT64 configuration
show ipv6 nat prefix

! Expected output:
! Prefix: 64:ff9b::/96

! Show NAT64 translations (active sessions)
show ipv6 nat translations

! Expected output:
! IPv6 source          IPv6 destination        IPv4 source    IPv4 destination
! 2001:db8:abc1:2001::50  64:ff9b::192.168.100.10  203.0.113.100  192.168.100.10

! Show NAT64 statistics
show ipv6 nat statistics

! Expected:
! Total active translations: 15
! Expired translations: 0
! Hits: 1,234
```

---

## 1.3 NAT66 Configuration (IPv6-to-IPv6 Source Translation)

```cisco
! ═══════════════════════════════════════════════════════════════════
! NAT66 CONFIGURATION
! Use Case: Translate internal IPv6 addresses to provider-assigned IPv6
! ═══════════════════════════════════════════════════════════════════

! SCENARIO:
!   Internal: 2001:db8:abc1::/48 (private/ULA IPv6)
!   External: 2001:0db8::/32 (ISP-assigned global IPv6)
!   Need: Source translation when going to internet

configure terminal

! ───────────────────────────────────────────────────────────────────
! STEP 1: Define NAT66 Prefix Mapping
! ───────────────────────────────────────────────────────────────────

ipv6 nat prefix inside 2001:db8:abc1::/48
ipv6 nat prefix outside 2001:0db8:0:1::/64

! Mapping:
!   Inside prefix: 2001:db8:abc1::/48 (internal addresses)
!   Outside prefix: 2001:0db8:0:1::/64 (ISP-provided addresses)

! ───────────────────────────────────────────────────────────────────
! STEP 2: Configure NAT66 Translation
! ───────────────────────────────────────────────────────────────────

ipv6 nat v6v6 source list NAT66-ACL prefix outside

! v6v6: IPv6-to-IPv6 translation
! source list: Match sources in ACL
! prefix outside: Use outside prefix for translation

ipv6 access-list NAT66-ACL
  permit ipv6 2001:db8:abc1::/48 any

! ───────────────────────────────────────────────────────────────────
! STEP 3: Apply to Interfaces
! ───────────────────────────────────────────────────────────────────

interface GigabitEthernet0/1/0  ! Inside
  ipv6 nat

interface TenGigabitEthernet0/0/4  ! Outside
  ipv6 nat

! ───────────────────────────────────────────────────────────────────
! VERIFICATION
! ───────────────────────────────────────────────────────────────────

show ipv6 nat translations

! Expected:
! Inside: 2001:db8:abc1:2001::50 → Outside: 2001:0db8:0:1::50
```

---

## SECTION 2: IPv6-SPECIFIC TROUBLESHOOTING

## 2.1 Control Plane Connectivity Issues (IPv6)

```
ISSUE: WAN Edge Cannot Connect to Controllers via IPv6
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  SYMPTOMS:                                                         │
│    - show sdwan control connections → All DOWN                    │
│    - Control connections work via IPv4 but fail via IPv6          │
│    - Logs show: "Failed to establish DTLS connection to vBond"    │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  TROUBLESHOOTING STEPS:                                            │
│                                                                    │
│  Step 1: Verify IPv6 Connectivity to vBond                        │
│    WAN-Edge# ping ipv6 2001:db8:abcd:1000::13                     │
│    ! vBond IPv6 address                                           │
│                                                                    │
│    Expected: 5/5 packets successful                               │
│    If FAILS: IPv6 routing issue or firewall blocking              │
│                                                                    │
│  Step 2: Check DTLS/TLS Ports (UDP 12346, TCP 23456)              │
│    ! Verify no firewall blocking these ports for IPv6             │
│    WAN-Edge# telnet 2001:db8:abcd:1000::13 23456                  │
│                                                                    │
│    Expected: Connection successful                                │
│    If FAILS: Firewall blocking TCP 23456 for IPv6                 │
│                                                                    │
│  Step 3: Verify Local Control Properties                          │
│    WAN-Edge# show sdwan control local-properties                  │
│                                                                    │
│    Look for:                                                       │
│      organization-name: Abhavtech                                 │
│      site-id: 10                                                  │
│      system-ip: 10.253.10.1                                       │
│      IPv6 address: 2001:db8:abc3:8000::1                          │
│      protocol: dtls                                               │
│      tls-port: 23456                                              │
│                                                                    │
│    If IPv6 address missing: Configuration issue                   │
│                                                                    │
│  Step 4: Check vBond Reachability via IPv6 Underlay               │
│    WAN-Edge# show ipv6 route 2001:db8:abcd:1000::13               │
│                                                                    │
│    Expected: Route exists via IPv6 transport (MPLS, DIA, ER)      │
│    If no route: OMP/BGP not advertising vBond IPv6 prefix         │
│                                                                    │
│  Step 5: Verify Certificates                                      │
│    WAN-Edge# show sdwan certificate validity                      │
│                                                                    │
│    Expected:                                                       │
│      Certificate valid: Yes                                       │
│      Serial number: <number>                                      │
│      Not valid before: <date>                                     │
│      Not valid after: <future date>                               │
│                                                                    │
│    If expired: Request new certificate                            │
│                                                                    │
│  Step 6: Check MTU for IPv6                                       │
│    ! IPv6 minimum MTU = 1280 bytes                                │
│    WAN-Edge# ping ipv6 2001:db8:abcd:1000::13 size 1280 df-bit    │
│                                                                    │
│    If FAILS: MTU too small on path                                │
│    Solution: Increase MTU on WAN interfaces to 1500+ bytes        │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  COMMON ROOT CAUSES:                                               │
│    ❌ Firewall blocking UDP 12346 or TCP 23456 for IPv6           │
│    ❌ No IPv6 route to vBond/vSmart                               │
│    ❌ Certificate expired or invalid                              │
│    ❌ MTU too small (< 1280 bytes) on IPv6 path                   │
│    ❌ IPv6 address not configured on control interface            │
│                                                                    │
│  RESOLUTION EXAMPLES:                                              │
│                                                                    │
│  Fix 1: Allow DTLS/TLS ports on firewall                          │
│    Firewall# ipv6 access-list ALLOW-SDWAN-CONTROL                 │
│    Firewall# permit udp any host 2001:db8:abcd:1000::13 eq 12346  │
│    Firewall# permit tcp any host 2001:db8:abcd:1000::13 eq 23456  │
│                                                                    │
│  Fix 2: Increase MTU on WAN interface                             │
│    WAN-Edge(config)# interface TenGigE0/0/0                        │
│    WAN-Edge(config-if)# mtu 1500                                   │
│    WAN-Edge(config-if)# ipv6 mtu 1500                              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2.2 BFD Session Failures (IPv6)

```
ISSUE: BFD Sessions Flapping or Not Establishing (IPv6 Only)
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  SYMPTOMS:                                                         │
│    - show sdwan bfd sessions → IPv6 sessions DOWN                 │
│    - IPv4 BFD sessions UP, IPv6 sessions flapping                 │
│    - show sdwan bfd history → frequent state changes              │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  TROUBLESHOOTING STEPS:                                            │
│                                                                    │
│  Step 1: Verify IPv6 Reachability to Remote TLOC                  │
│    MUM-HUB-01# ping ipv6 2001:db8:abc2:8000::1                    │
│    ! Remote hub TLOC IPv6                                         │
│                                                                    │
│    Expected: 5/5 success, latency <50ms                           │
│    If high packet loss: Transport quality issue                   │
│                                                                    │
│  Step 2: Check BFD Configuration                                  │
│    MUM-HUB-01# show sdwan running-config | section bfd            │
│                                                                    │
│    Expected:                                                       │
│      app-route multiplier 6                                       │
│      app-route poll-interval 600000                               │
│      multiplier 6                                                 │
│      poll-interval 600000                                         │
│                                                                    │
│    If multiplier too low (e.g., 3): Increase to 6 or 7            │
│                                                                    │
│  Step 3: Monitor BFD Packets (IPv6)                               │
│    MUM-HUB-01# debug platform condition ipv6 udp 12366 both       │
│    ! BFD uses UDP port 12366                                      │
│                                                                    │
│    Look for: BFD hello packets being sent/received                │
│    If packets not received: Firewall or routing issue             │
│                                                                    │
│  Step 4: Check Interface Statistics                               │
│    MUM-HUB-01# show interface TenGigE0/0/0 | include drops        │
│                                                                    │
│    If high output drops: Queue congestion                         │
│    If high input drops: Link oversubscribed                       │
│                                                                    │
│  Step 5: Verify IPsec Tunnel State                                │
│    MUM-HUB-01# show sdwan ipsec outbound-connections              │
│                                                                    │
│    Expected: State = up for remote TLOC                           │
│    If down: IPsec tunnel issue (check IKE/IPsec logs)             │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  COMMON ROOT CAUSES:                                               │
│    ❌ High packet loss on IPv6 transport (>3%)                    │
│    ❌ Asymmetric routing (different paths for IPv4/IPv6)          │
│    ❌ BFD multiplier too aggressive for lossy link                │
│    ❌ IPv6 fragmentation issues (BFD packets fragmented)          │
│    ❌ Firewall blocking UDP 12366 for IPv6                        │
│                                                                    │
│  RESOLUTION:                                                       │
│                                                                    │
│  Fix 1: Increase BFD multiplier (more tolerant of packet loss)    │
│    vManage → Configuration → Templates → Feature Template         │
│    Template: BFD                                                   │
│    Multiplier: 6 → 7 (or 10 for very lossy links)                 │
│                                                                    │
│  Fix 2: Reduce BFD hello interval (faster detection)              │
│    Hello interval: 1000ms → 500ms                                 │
│    (Only if link can handle higher BFD traffic)                   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2.3 OMP Route Advertisement Issues (IPv6)

```
ISSUE: IPv6 Routes Not Being Advertised/Received via OMP
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  SYMPTOMS:                                                         │
│    - show sdwan omp routes vpn 1 ipv6 → Missing expected routes   │
│    - IPv4 routes present, IPv6 routes absent                      │
│    - Remote sites cannot reach local IPv6 subnets                 │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  TROUBLESHOOTING STEPS:                                            │
│                                                                    │
│  Step 1: Verify IPv6 Routes in Local Routing Table                │
│    MUM-HUB-01# show ipv6 route vrf 1                               │
│                                                                    │
│    Expected: See local IPv6 subnets (2001:db8:abc1:2001::/64)     │
│    If missing: Routing issue (check interface config)             │
│                                                                    │
│  Step 2: Check OMP IPv6 Address-Family                            │
│    MUM-HUB-01# show sdwan omp summary                              │
│                                                                    │
│    Expected:                                                       │
│      oper-state: UP                                               │
│      routes-received: 150 (IPv4)                                  │
│      routes-received: 50 (IPv6)  ← Should see IPv6 routes        │
│                                                                    │
│    If IPv6 routes = 0: OMP not advertising IPv6                   │
│                                                                    │
│  Step 3: Verify OMP IPv6 Configuration                            │
│    MUM-HUB-01# show sdwan running-config | section omp            │
│                                                                    │
│    Expected:                                                       │
│      omp                                                           │
│        address-family ipv4                                        │
│          advertise connected                                      │
│          advertise static                                         │
│        address-family ipv6  ← Must be present                    │
│          advertise connected                                      │
│          advertise static                                         │
│                                                                    │
│    If IPv6 address-family missing: Add it via vManage template    │
│                                                                    │
│  Step 4: Check Route Filters (Control Policies)                   │
│    vManage → Configuration → Policies → Centralized Policy        │
│                                                                    │
│    Look for: Control policies blocking IPv6 route advertisement   │
│    Example problematic policy:                                    │
│      - Match: IPv6 prefix 2001:db8:abc1::/48                      │
│        Action: Reject                                             │
│                                                                    │
│  Step 5: Verify vSmart Connection                                 │
│    MUM-HUB-01# show sdwan control connections                     │
│                                                                    │
│    Expected: vSmart-1 and vSmart-2 both UP                        │
│    If DOWN: Control plane issue (see Section 2.1)                 │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  COMMON ROOT CAUSES:                                               │
│    ❌ OMP IPv6 address-family not configured                      │
│    ❌ Control policy blocking IPv6 route advertisement            │
│    ❌ IPv6 routes not in local routing table (config issue)       │
│    ❌ vSmart connection down (control plane failure)              │
│                                                                    │
│  RESOLUTION:                                                       │
│                                                                    │
│  Fix: Enable OMP IPv6 address-family                              │
│    vManage → Configuration → Templates → Feature Template         │
│    Template Type: OMP                                              │
│                                                                    │
│    Address Family IPv6:                                            │
│      ☑ Advertise Connected Routes                                │
│      ☑ Advertise Static Routes                                   │
│                                                                    │
│    Apply template to all WAN Edge devices                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 2.4 IPv6 Data Plane Forwarding Issues

```
ISSUE: IPv6 Traffic Not Forwarding Across SD-WAN Fabric
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  SYMPTOMS:                                                         │
│    - Ping to remote IPv6 endpoints fails                          │
│    - Traceroute shows packets not leaving local site              │
│    - IPv4 traffic works fine, IPv6 traffic drops                  │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  TROUBLESHOOTING STEPS:                                            │
│                                                                    │
│  Step 1: Verify Local IPv6 Connectivity                           │
│    Client# ping6 2001:db8:abc1:2001::1                            │
│    ! Local gateway IPv6                                           │
│                                                                    │
│    Expected: Success                                               │
│    If fails: Local IPv6 not working (check SVI config)            │
│                                                                    │
│  Step 2: Check IPv6 Route to Remote Destination                   │
│    MUM-HUB-01# show ipv6 route vrf 1 2001:db8:abc2:2001::10       │
│    ! Remote endpoint in Chennai                                   │
│                                                                    │
│    Expected:                                                       │
│      Routing entry for 2001:db8:abc2:2001::/64                    │
│      Known via "sdwan", distance 250                              │
│      Next hop: IPsec tunnel to CHN-HUB-01                         │
│                                                                    │
│    If no route: OMP issue (see Section 2.3)                       │
│                                                                    │
│  Step 3: Verify IPsec SA for IPv6                                 │
│    MUM-HUB-01# show crypto ipsec sa peer <remote-TLOC-IPv6>       │
│                                                                    │
│    Expected:                                                       │
│      Interface: Tunnel1000                                        │
│      local ident: IPv6 packets                                    │
│      remote ident: IPv6 packets                                   │
│      #pkts encaps: 1000+ (increasing)                             │
│      #pkts decrypt: 500+ (increasing)                             │
│                                                                    │
│    If #pkts = 0: IPsec not encrypting IPv6 traffic                │
│                                                                    │
│  Step 4: Check Data Policy (if configured)                        │
│    vManage → Monitor → Devices → WAN Edge → Real Time             │
│    → Data Policy                                                   │
│                                                                    │
│    Look for: Policy dropping IPv6 traffic                         │
│    Example: Default deny-all policy blocking IPv6                 │
│                                                                    │
│  Step 5: Packet Capture on WAN Interface                          │
│    MUM-HUB-01# monitor capture CAP interface TenGigE0/0/0 both    │
│    MUM-HUB-01# monitor capture CAP match ipv6 any any             │
│    MUM-HUB-01# monitor capture CAP start                          │
│    ! Generate test traffic                                        │
│    MUM-HUB-01# monitor capture CAP stop                           │
│    MUM-HUB-01# monitor capture CAP export flash:cap.pcap          │
│                                                                    │
│    Analyze in Wireshark: Look for IPv6 packets                    │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  COMMON ROOT CAUSES:                                               │
│    ❌ No OMP route for remote IPv6 destination                    │
│    ❌ IPsec SA not established for IPv6 traffic                   │
│    ❌ Data policy blocking IPv6 flows                             │
│    ❌ MTU issues (IPv6 packets being fragmented/dropped)          │
│    ❌ ACL on interface blocking IPv6                              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```


---

*© 2025 Abhavtech - IPv6 Migration Phase 1 Addendum*  
*IPv6-Specific Features Only*  
*Version 1.0 | January 2025*
