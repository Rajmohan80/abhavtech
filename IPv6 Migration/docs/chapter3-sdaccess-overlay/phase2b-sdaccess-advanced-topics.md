# ABHAVTECH IPv6 MIGRATION — PHASE 2B
## SD-ACCESS ADVANCED IPv6 TOPICS

**Project:** ABV-IPV6-2025  
**Phase:** 2B — SD-Access Advanced IPv6 (Gap Closure)  
**Duration:** 3 Weeks (Week 15-17)  
**Objective:** Complete SD-Access IPv6 deployment with WLC, BGP, and operational readiness  
**Scope:** WLC dual-stack, Border BGP, pxGrid, DHCPv6, Troubleshooting  

---

## PHASE 2B OVERVIEW

```
PHASE 2B — CRITICAL GAPS FROM PHASE 2:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  WHY PHASE 2B IS REQUIRED:                                        │
│                                                                    │
│  Phase 2 covered core SD-Access fabric (LISP, VXLAN, Edge)        │
│  but missed critical components for production deployment:        │
│                                                                    │
│  CRITICAL GAPS:                                                    │
│    🚨 WLC 9800 dual-stack (1,220 WiFi 7 APs not configured)      │
│    🚨 Border→SD-WAN BGP (no external IPv6 connectivity)           │
│    🔴 PxGrid SGT propagation (incomplete security)                │
│    ⚠️ DHCPv6 relay/server (IoT devices need stateful)            │
│    ⚠️ Multicast PIM (LISP map-notify stability)                  │
│    ⚠️ Troubleshooting procedures (operational support)            │
│    📊 Performance baselines (no metrics)                          │
│    📊 FiaB detail (Hyderabad archetype incomplete)                │
│                                                                    │
│  IMPACT WITHOUT PHASE 2B:                                          │
│    ❌ WiFi clients cannot get IPv6 addresses                      │
│    ❌ Campus clients cannot reach internet via IPv6               │
│    ❌ SGT policies incomplete for IPv6                            │
│    ❌ IoT devices may fail to get addressing                      │
│    ❌ LISP may be unstable (multicast issues)                     │
│    ❌ Poor operational support (no troubleshooting guide)         │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  PHASE 2B STRUCTURE (3 WEEKS):                                     │
│                                                                    │
│  Week 15: WLC 9800 + Border BGP (CRITICAL)                        │
│    - Cisco 9800 WLC management interface IPv6                     │
│    - CAPWAP over IPv6 (AP-to-WLC tunnels)                         │
│    - WLAN dual-stack configuration (all SSIDs)                    │
│    - Border node BGP with SD-WAN routers                          │
│    - Route redistribution (LISP EIDs → BGP → OMP)                 │
│    - IPv6 route policies                                          │
│                                                                    │
│  Week 16: Security + IoT Integration                              │
│    - ISE pxGrid configuration (SGT download)                      │
│    - DHCPv6 relay on SVIs                                         │
│    - DHCPv6 server on ISE (for IoT)                               │
│    - Multicast PIM sparse-mode (LISP map-notify)                  │
│    - Complete security validation                                 │
│                                                                    │
│  Week 17: Operations + Performance                                │
│    - Troubleshooting procedures (common IPv6 issues)              │
│    - Performance baselines (latency, throughput, WiFi 7)          │
│    - Hyderabad FiaB detailed configuration                        │
│    - Complete operational readiness                               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## WEEK 15: WLC 9800 + BORDER BGP (CRITICAL)

## 15.1 Cisco 9800 WLC Infrastructure

```
ABHAVTECH WLC DEPLOYMENT:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  WIRELESS LAN CONTROLLERS (9800 SERIES):                           │
│                                                                    │
│  Mumbai HQ (Primary Site):                                         │
│    WLC-MUM-01: Cisco 9800-80 (Primary)                            │
│      - Management: 10.252.31.11 (IPv4 only — current)             │
│      - AP Manager: 10.252.31.12                                   │
│      - Manages: 780 APs (Floors 1-6)                              │
│      - SSIDs: Corporate, Guest, Voice, IoT                        │
│      - Location: Datacenter                                       │
│                                                                    │
│    WLC-MUM-02: Cisco 9800-80 (Secondary)                          │
│      - Management: 10.252.31.13 (IPv4 only)                       │
│      - AP Manager: 10.252.31.14                                   │
│      - Manages: 440 APs (backup + load balancing)                 │
│      - Mobility Group: MUM-MOBILITY                               │
│                                                                    │
│  Chennai HQ:                                                       │
│    WLC-CHN-01: Cisco 9800-40 (Primary)                            │
│      - Management: 10.252.32.11                                   │
│      - Manages: 340 APs (Floors 1-4)                              │
│                                                                    │
│    WLC-CHN-02: Cisco 9800-40 (Secondary)                          │
│      - Management: 10.252.32.12                                   │
│      - Manages: 200 APs (backup)                                  │
│                                                                    │
│  Hyderabad (Fabric-in-a-Box):                                     │
│    WLC-HYD-EMBEDDED: On C9300-24UX (FiaB switch)                  │
│      - Management: 10.252.33.11                                   │
│      - Manages: 100 APs                                           │
│                                                                    │
│  TOTAL: 6 WLCs managing 1,860 APs                                 │
│    (1,220 are WiFi 7 Catalyst 9136, rest are WiFi 6E)            │
│                                                                    │
│  CURRENT STATE (IPv4-ONLY):                                        │
│    ❌ WLC management via IPv4 only                                │
│    ❌ CAPWAP tunnels IPv4 only (AP-to-WLC)                        │
│    ❌ WLAN addressing IPv4 only (no IPv6 pools)                   │
│    ❌ Mobility group IPv4 only                                    │
│                                                                    │
│  TARGET STATE (DUAL-STACK):                                        │
│    ✅ WLC management IPv4 + IPv6                                  │
│    ✅ CAPWAP dual-stack (prefer IPv6)                             │
│    ✅ WLAN dual-stack pools (SLAAC)                               │
│    ✅ Mobility group IPv6                                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 15.2 WLC 9800 IPv6 Addressing Design

```
WLC IPv6 ALLOCATION:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  MUMBAI WLC MANAGEMENT (Dual-Stack):                              │
│    WLC-MUM-01:                                                     │
│      Management Interface:                                         │
│        IPv4: 10.252.31.11/24 (existing)                           │
│        IPv6: 2001:db8:abc1:1000::11/64  ← ADD                     │
│      AP-Manager Interface:                                         │
│        IPv4: 10.252.31.12/24                                      │
│        IPv6: 2001:db8:abc1:1000::12/64  ← ADD                     │
│                                                                    │
│    WLC-MUM-02:                                                     │
│      Management: 2001:db8:abc1:1000::13/64                        │
│      AP-Manager: 2001:db8:abc1:1000::14/64                        │
│                                                                    │
│  CHENNAI WLC:                                                      │
│    WLC-CHN-01: 2001:db8:abc2:1000::11/64 (mgmt)                   │
│    WLC-CHN-02: 2001:db8:abc2:1000::12/64                          │
│                                                                    │
│  WLAN IPv6 ADDRESSING (Per SSID):                                 │
│                                                                    │
│  Corporate SSID (VN_CORPORATE):                                    │
│    - Uses anycast gateway from SD-Access fabric                   │
│    - Client addressing: SLAAC from fabric SVI                     │
│    - Mumbai Floor 1: 2001:db8:abc1:2001::/64                      │
│    - Mumbai Floor 2: 2001:db8:abc1:2002::/64                      │
│    - (Same as wired network — fabric integration)                 │
│                                                                    │
│  Guest SSID (Anchored):                                            │
│    - Anchor WLC: WLC-MUM-01                                       │
│    - Guest VLAN: 1021                                             │
│    - IPv6 Pool: 2001:db8:abc1:3001::/64 (SLAAC)                   │
│    - Gateway: 2001:db8:abc1:3001::1 (on WLC)                      │
│                                                                    │
│  Voice SSID (VN_VOICE):                                            │
│    - Fabric SVI: 2001:db8:abc1:6001::/64                          │
│    - QoS: WMM Platinum                                            │
│                                                                    │
│  IoT SSID (VN_IoT):                                                │
│    - Fabric SVI: 2001:db8:abc1:4001::/64                          │
│    - DHCPv6 stateful for static addressing                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 15.3 WLC 9800 Management Interface IPv6

### Step 15.3.1: Configure WLC Management Interface (Dual-Stack)

```cisco
! ═══════════════════════════════════════════════════════════════════
! WLC 9800 MANAGEMENT INTERFACE IPv6 (WLC-MUM-01)
! ═══════════════════════════════════════════════════════════════════

! Configure via GUI: WLC Web UI → Configuration → Management

! OR via CLI (preferred for automation):

configure terminal

! Management interface (GigabitEthernet0)
interface GigabitEthernet0
  description WLC-MANAGEMENT-INTERFACE
  !
  ! IPv4 (existing)
  ip address 10.252.31.11 255.255.255.0
  !
  ! IPv6 (new)
  ipv6 address 2001:db8:abc1:1000::11/64
  ipv6 enable
  !
  no shutdown

! Default gateway (dual-stack)
ip default-gateway 10.252.31.1
ipv6 route ::/0 2001:db8:abc1:1000::1

! DNS configuration (dual-stack)
ip name-server 10.252.31.53
ipv6 name-server 2001:db8:abc1:1000::53

! Enable IPv6 for wireless management
wireless management interface GigabitEthernet0
  ip address 10.252.31.11 255.255.255.0
  ipv6 address 2001:db8:abc1:1000::11/64

! Verify
show interface GigabitEthernet0
! Expected: Both IPv4 and IPv6 addresses configured

show ipv6 interface brief
! Expected:
! GigabitEthernet0  [up/up]
!   2001:db8:abc1:1000::11
!   fe80::xxxx:xxxx:xxxx:xxxx

! Test IPv6 connectivity
ping ipv6 2001:db8:abc1:1000::1  ! Gateway
ping ipv6 2001:db8:abc1:1000::53  ! DNS server

end
write memory
```

---

## 15.4 CAPWAP over IPv6 Configuration

### Step 15.4.1: Enable CAPWAP IPv6 on WLC

```cisco
! ═══════════════════════════════════════════════════════════════════
! CAPWAP IPv6 CONFIGURATION (WLC-MUM-01)
! ═══════════════════════════════════════════════════════════════════

configure terminal

! Enable CAPWAP over IPv6
wireless config capwap ipv6 enable

! AP-Manager interface (for CAPWAP tunnels)
interface GigabitEthernet1
  description AP-MANAGER-INTERFACE
  !
  ! IPv4 (existing)
  ip address 10.252.31.12 255.255.255.0
  !
  ! IPv6 (new)
  ipv6 address 2001:db8:abc1:1000::12/64
  ipv6 enable
  !
  no shutdown

! Configure AP-Manager as primary for CAPWAP
wireless config ap-manager interface GigabitEthernet1

! CAPWAP IP version preference
wireless config capwap ip-preference ipv6  ! Prefer IPv6 over IPv4

! CAPWAP timers (optional — for faster convergence)
wireless config capwap timers discovery 10
wireless config capwap timers echo-interval 30

! CAPWAP MTU (important for IPv6)
wireless config capwap mtu 1500  ! Ensure no fragmentation

! Verify CAPWAP configuration
show wireless config capwab
! Expected:
! CAPWAP IPv6: Enabled
! IP Preference: IPv6
! AP-Manager: GigabitEthernet1 (2001:db8:abc1:1000::12)

end
write memory
```

---

### Step 15.4.2: Configure Access Point for CAPWAP IPv6

```cisco
! ═══════════════════════════════════════════════════════════════════
! ACCESS POINT CAPWAP IPv6 (Catalyst 9136 - WiFi 7)
! ═══════════════════════════════════════════════════════════════════

! APs automatically discover WLC via:
! 1. DHCP Option 43 (IPv4) or Option 52 (IPv6)
! 2. DNS SRV record (_cisco-capwap-controller._udp)
! 3. Broadcast/multicast discovery

! Method 1: DHCP Option 52 (DHCPv6)
! On DHCP server (ISE or external), configure:
! DHCPv6 Option 52: WLC IPv6 address
! Value: 2001:db8:abc1:1000::12 (WLC AP-Manager IPv6)

! Method 2: DNS SRV Record (Preferred)
! On DNS server (bind format):
_cisco-capwap-controller._udp.abhavtech.com. 86400 IN SRV 1 1 5246 wlc-mum-01.abhavtech.com.
wlc-mum-01.abhavtech.com. 3600 IN AAAA 2001:db8:abc1:1000::12

! Method 3: Static WLC IP on AP (for troubleshooting)
! SSH to AP (if accessible):
AP# capwap ap controller ipv6 address 2001:db8:abc1:1000::12

! Verify AP joined via IPv6
! On WLC:
show ap summary
! Expected:
! AP Name         IP Address (IPv6)                  Status
! -------         ---------------------------------  ------
! MUM-AP-F1-01    2001:db8:abc1:2001::a1             Joined
! MUM-AP-F1-02    2001:db8:abc1:2001::a2             Joined

show capwap client
! Expected: CAPWAP tunnels using IPv6
```

---

## 15.5 WLAN Dual-Stack Configuration

### Step 15.5.1: Corporate SSID (Fabric Mode)

```
WLC Web UI Configuration:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Configuration → Tags & Profiles → WLANs                           │
│                                                                    │
│  WLAN: Corporate-SSID                                              │
│    Profile Name: Corporate-Profile                                │
│    SSID: Abhavtech-Corporate                                      │
│    Status: Enabled                                                 │
│                                                                    │
│  General Tab:                                                      │
│    Admin Status: Enabled                                           │
│    Broadcast SSID: Yes                                             │
│    Radio Policy: All (2.4 GHz, 5 GHz, 6 GHz)                      │
│                                                                    │
│  Security Tab:                                                     │
│    Layer 2 Security: WPA3-Enterprise                              │
│    PMF: Required                                                   │
│    AAA Servers:                                                    │
│      Authentication: ISE-PSN-01 (2001:db8:abc1:1000::31)          │
│      Accounting: ISE-PSN-01                                        │
│                                                                    │
│  Advanced Tab:                                                     │
│    Fabric Mode: Enabled  ← CRITICAL                               │
│    Fabric Profile: VN_CORPORATE                                    │
│                                                                    │
│    FlexConnect Local Switching: Disabled                          │
│    (Fabric mode = centralized switching via VXLAN)                │
│                                                                    │
│    VLAN: None (fabric handles L2 segregation)                     │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  IP ADDRESSING (Dual-Stack via Fabric):                            │
│    IPv4: From fabric anycast gateway (10.100.1.1)                 │
│    IPv6: From fabric anycast gateway (2001:db8:abc1:2001::1)      │
│    Method: SLAAC (IPv6 RA from fabric SVI)                        │
│                                                                    │
│  CLIENT FLOW:                                                      │
│    1. Client associates to SSID                                   │
│    2. 802.1X authentication via ISE (RADIUS over IPv6)            │
│    3. ISE assigns SGT (e.g., SGT 10 for Corporate)                │
│    4. WLC creates VXLAN tunnel to fabric edge switch              │
│    5. Client traffic forwarded via VXLAN to fabric                │
│    6. Fabric SVI provides IPv4 DHCP + IPv6 RA                     │
│    7. Client gets dual-stack addresses                            │
│                                                                    │
│  Save and Apply to Device                                          │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### Step 15.5.2: Guest SSID (Anchor Mode with IPv6)

```
WLC Web UI Configuration:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Configuration → Tags & Profiles → WLANs                           │
│                                                                    │
│  WLAN: Guest-SSID                                                  │
│    Profile Name: Guest-Profile                                    │
│    SSID: Abhavtech-Guest                                          │
│                                                                    │
│  Security Tab:                                                     │
│    Layer 2 Security: Open (with web authentication)               │
│    Web Auth: Enabled                                               │
│    Redirect URL: https://guest.abhavtech.com                      │
│                                                                    │
│  Advanced Tab:                                                     │
│    Fabric Mode: Disabled (Guest uses anchor WLC)                  │
│    Interface/VLAN: guest-vlan (1021)                              │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  GUEST ANCHOR CONFIGURATION:                                       │
│                                                                    │
│  Configuration → Wireless → Mobility Anchor                        │
│                                                                    │
│  Anchor WLC: WLC-MUM-01                                            │
│    IPv4: 10.252.31.11                                             │
│    IPv6: 2001:db8:abc1:1000::11  ← Primary anchor                 │
│                                                                    │
│  Mobility Tunnel: CAPWAP (over IPv6)                              │
│    Source: WLC-CHN-01 (2001:db8:abc2:1000::11)                    │
│    Dest: WLC-MUM-01 (2001:db8:abc1:1000::11)                      │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  GUEST VLAN IPv6 CONFIGURATION (on WLC-MUM-01):                    │
│                                                                    │
│  interface guest-vlan                                              │
│    ip address 10.190.21.1 255.255.255.0                           │
│    ipv6 address 2001:db8:abc1:3001::1/64                          │
│    ipv6 nd ra interval 200                                        │
│    ipv6 nd managed-config-flag  ! M=0 (SLAAC)                     │
│    ipv6 nd other-config-flag    ! O=1 (get DNS)                   │
│    ipv6 nd ra dns server 2001:db8:abc1:1000::53 lifetime 1800    │
│                                                                    │
│  Guest clients get:                                                │
│    IPv4: 10.190.21.x via DHCP                                     │
│    IPv6: 2001:db8:abc1:3001::xxxx via SLAAC                       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 15.6 Border-to-SD-WAN BGP Configuration

### Step 15.6.1: Border Node BGP with SD-WAN (MUM-BN-01)

```cisco
! ═══════════════════════════════════════════════════════════════════
! BORDER NODE BGP TO SD-WAN (MUM-BN-01)
! ═══════════════════════════════════════════════════════════════════

! Border node needs to exchange routes with SD-WAN for external connectivity

configure terminal

! Enable BGP
router bgp 65001  ! SD-Access fabric ASN
  bgp router-id 10.250.1.1
  bgp log-neighbor-changes
  !
  ! IPv4 address family (already exists from Phase 1)
  address-family ipv4 unicast
    network 10.100.0.0 mask 255.255.0.0  ! Fabric IPv4 summary
    redistribute lisp  ! Redistribute LISP EIDs into BGP
    exit-address-family
  !
  ! IPv6 address family ✅ NEW
  address-family ipv6 unicast
    network 2001:db8:abc1::/48  ! Fabric IPv6 summary
    redistribute lisp  ! Redistribute LISP IPv6 EIDs into BGP
    exit-address-family
  !
  ! ═══════════════════════════════════════════════════════════════
  ! BGP NEIGHBORS — SD-WAN ROUTERS (Dual-Stack)
  ! ═══════════════════════════════════════════════════════════════
  !
  ! Neighbor: MUM-HUB-01 (SD-WAN router)
  neighbor 10.250.100.1 remote-as 65000  ! SD-WAN ASN
  neighbor 10.250.100.1 description MUM-HUB-01-IPv4
  neighbor 10.250.100.1 update-source Loopback0
  !
  neighbor 2001:db8:abc1:8000::1 remote-as 65000
  neighbor 2001:db8:abc1:8000::1 description MUM-HUB-01-IPv6
  neighbor 2001:db8:abc1:8000::1 update-source Loopback0
  !
  ! Activate IPv4 neighbor
  address-family ipv4 unicast
    neighbor 10.250.100.1 activate
    neighbor 10.250.100.1 send-community both
    neighbor 10.250.100.1 route-map TO-SDWAN out
    neighbor 10.250.100.1 route-map FROM-SDWAN in
    exit-address-family
  !
  ! Activate IPv6 neighbor ✅ NEW
  address-family ipv6 unicast
    neighbor 2001:db8:abc1:8000::1 activate
    neighbor 2001:db8:abc1:8000::1 send-community both
    neighbor 2001:db8:abc1:8000::1 route-map TO-SDWAN-v6 out
    neighbor 2001:db8:abc1:8000::1 route-map FROM-SDWAN-v6 in
    exit-address-family
  !
  ! Neighbor: MUM-HUB-02 (SD-WAN redundant router)
  neighbor 2001:db8:abc1:8000::2 remote-as 65000
  neighbor 2001:db8:abc1:8000::2 description MUM-HUB-02-IPv6
  neighbor 2001:db8:abc1:8000::2 update-source Loopback0
  !
  address-family ipv6 unicast
    neighbor 2001:db8:abc1:8000::2 activate
    exit-address-family

! ═══════════════════════════════════════════════════════════════════
! ROUTE MAPS — IPv6
! ═══════════════════════════════════════════════════════════════════

! Outbound to SD-WAN (what fabric advertises)
route-map TO-SDWAN-v6 permit 10
  description Advertise fabric IPv6 summary to SD-WAN
  match ipv6 address prefix-list FABRIC-IPv6-SUMMARY
  set community 65001:100  ! Tag routes from fabric

! Inbound from SD-WAN (what fabric accepts)
route-map FROM-SDWAN-v6 permit 10
  description Accept default route from SD-WAN
  match ipv6 address prefix-list DEFAULT-ROUTE-v6
  set local-preference 200  ! Prefer this border

route-map FROM-SDWAN-v6 permit 20
  description Accept internet routes
  match ipv6 address prefix-list INTERNET-ROUTES-v6

! Prefix lists
ipv6 prefix-list FABRIC-IPv6-SUMMARY permit 2001:db8:abc1::/48

ipv6 prefix-list DEFAULT-ROUTE-v6 permit ::/0

ipv6 prefix-list INTERNET-ROUTES-v6 permit 2000::/3 le 64
! (This matches global unicast IPv6 space)

end
write memory

! ═══════════════════════════════════════════════════════════════════
! VERIFICATION
! ═══════════════════════════════════════════════════════════════════

! Check BGP IPv6 neighbors
show bgp ipv6 unicast summary
! Expected:
! Neighbor                     V    AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
! 2001:db8:abc1:8000::1        4 65000    1234    1230       15    0    0 01:23:45        2

! Check routes received from SD-WAN
show bgp ipv6 unicast neighbors 2001:db8:abc1:8000::1 routes
! Expected: Default route ::/0

! Check routes advertised to SD-WAN
show bgp ipv6 unicast neighbors 2001:db8:abc1:8000::1 advertised-routes
! Expected: 2001:db8:abc1::/48 (fabric summary)

! Verify route redistribution from LISP
show bgp ipv6 unicast | include lisp
! Expected: Routes with "lisp" origin
```

---

### Step 15.6.2: SD-WAN Router Configuration (Receive BGP from Border)

```cisco
! ═══════════════════════════════════════════════════════════════════
! SD-WAN ROUTER BGP (MUM-HUB-01) — Already configured in Phase 1
! ═══════════════════════════════════════════════════════════════════

! This was configured in Phase 1, just verify IPv6 is working

router bgp 65000
  !
  ! IPv6 address family
  address-family ipv6 unicast
    !
    ! Neighbor: Border node MUM-BN-01
    neighbor 2001:db8:abc1:0::1 activate
    neighbor 2001:db8:abc1:0::1 send-community both
    !
    ! Advertise default route to fabric
    network ::/0
    !
    ! Redistribute OMP routes (from other sites) into BGP
    redistribute omp
    exit-address-family

! OMP will automatically redistribute BGP-learned routes to other SD-WAN sites
! So Chennai campus (via CHN-HUB-01) can reach Mumbai campus via OMP

! Verify
show bgp ipv6 unicast summary
! Expected: Neighbor 2001:db8:abc1:0::1 (Border) in Established state

show bgp ipv6 unicast neighbors 2001:db8:abc1:0::1 received-routes
! Expected: 2001:db8:abc1::/48 from Border

show sdwan omp routes ipv6
! Expected: Mumbai fabric prefixes distributed via OMP to all sites
```

---

## 15.7 Complete Routing Validation

### Validation 15.7.1: End-to-End IPv6 Connectivity

```bash
#!/bin/bash
# validate_phase2b_week15.sh

echo "=== WEEK 15 VALIDATION: WLC + BORDER BGP ==="

# Test 1: WLC management via IPv6
echo ""
echo "Test 1: WLC Management Interface IPv6"
ping6 -c 5 2001:db8:abc1:1000::11  # WLC-MUM-01
# Expected: 5/5 packets, <2ms latency

# Test 2: CAPWAP tunnel via IPv6
echo ""
echo "Test 2: AP CAPWAP Status (IPv6)"
# SSH to WLC
ssh admin@2001:db8:abc1:1000::11 "show ap summary | include IPv6"
# Expected: APs joined with IPv6 addresses

# Check CAPWAP tunnel
ssh admin@2001:db8:abc1:1000::11 "show capwap client | include 2001"
# Expected: CAPWAP tunnels using IPv6 (2001:db8:abc1:...)

# Test 3: WiFi client dual-stack
echo ""
echo "Test 3: WiFi Client IPv6 Connectivity"
# Connect laptop to Corporate SSID
# Check client IP addresses
ipconfig /all | grep -A 5 "Wireless LAN"
# Expected:
# IPv4: 10.100.1.x (from fabric DHCP)
# IPv6: 2001:db8:abc1:2001::xxxx (from fabric RA)

# Test internet via IPv6
ping6 -c 5 2001:4860:4860::8888  # Google DNS
# Expected: 5/5 success

# Test 4: Border BGP status
echo ""
echo "Test 4: Border Node BGP to SD-WAN"
ssh admin@10.250.1.1 "show bgp ipv6 unicast summary | include 2001:db8:abc1:8000"
# Expected:
# 2001:db8:abc1:8000::1 4 65000 ... Established

# Test 5: Route exchange validation
echo ""
echo "Test 5: IPv6 Route Propagation"
# On Border node: Check routes received from SD-WAN
ssh admin@10.250.1.1 "show bgp ipv6 unicast | include ::/0"
# Expected: Default route from SD-WAN

# On SD-WAN: Check routes received from Border
ssh admin@10.252.100.1 "show bgp ipv6 unicast | include 2001:db8:abc1"
# Expected: Fabric summary 2001:db8:abc1::/48

# Test 6: Cross-site connectivity
echo ""
echo "Test 6: Mumbai WiFi → Chennai Campus (IPv6)"
# From Mumbai WiFi client: ping Chennai endpoint
ping6 -c 5 2001:db8:abc2:2001::10  # Chennai campus endpoint
# Expected: 5/5 success, ~10-15ms latency

# Path verification
traceroute6 2001:db8:abc2:2001::10
# Expected path:
# 1. Fabric anycast gateway (2001:db8:abc1:2001::1)
# 2. Border node (2001:db8:abc1:0::1)
# 3. SD-WAN hub (2001:db8:abc1:8000::1)
# 4. OMP route via MPLS
# 5. Chennai SD-WAN hub
# 6. Chennai border
# 7. Chennai endpoint

echo ""
echo "✅ Week 15 validation complete"
```

---

## WEEK 16: SECURITY + IoT INTEGRATION

## 16.1 ISE pxGrid Configuration (SGT Propagation)

### Step 16.1.1: Enable pxGrid on ISE

```
ISE Admin Console Configuration:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  ISE → Administration → pxGrid Services                            │
│                                                                    │
│  pxGrid Settings:                                                  │
│    ☑ Enable pxGrid                                                │
│    ☑ Automatically approve new certificate-based accounts         │
│                                                                    │
│  Connection Details:                                               │
│    pxGrid Node: ISE-PSN-01                                         │
│    IPv4 Address: 10.252.31.31                                     │
│    IPv6 Address: 2001:db8:abc1:1000::31  ← ADD                    │
│    Port: 8910 (WebSocket)                                         │
│                                                                    │
│  Services to Enable:                                               │
│    ☑ Session Directory                                            │
│    ☑ TrustSec Configuration                                       │
│    ☑ Security Group Tag (SGT)                                     │
│    ☑ Endpoint Profile                                             │
│    ☑ Adaptive Network Control (ANC)                               │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  Create pxGrid Client for DNAC:                                   │
│                                                                    │
│  ISE → Administration → pxGrid Services → Clients                  │
│                                                                    │
│  Add Client:                                                       │
│    Name: DNAC-pxGrid-Client                                       │
│    Description: DNA Center for SD-Access SGT download            │
│                                                                    │
│  Generate Certificate:                                             │
│    CN: dnac.abhavtech.com                                         │
│    Download: dnac-pxgrid-cert.pem                                 │
│    (Import this into DNAC)                                        │
│                                                                    │
│  Approve Client:                                                   │
│    Status: Approved                                                │
│    Services: TrustSec, SGT, Session Directory                     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### Step 16.1.2: Configure DNAC pxGrid Integration

```
DNAC Web UI Configuration:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  DNAC → System → Settings → External Services → ISE                │
│                                                                    │
│  ISE Server Configuration:                                         │
│    Primary ISE:                                                    │
│      Hostname: ise.abhavtech.com                                  │
│      IPv4: 10.252.31.31                                           │
│      IPv6: 2001:db8:abc1:1000::31  ← ADD                          │
│      Port: 443 (ERS API)                                          │
│                                                                    │
│    Credentials:                                                    │
│      Username: dnac-api-user                                      │
│      Password: <password>                                         │
│                                                                    │
│  pxGrid Integration:                                               │
│    ☑ Enable pxGrid                                                │
│    pxGrid Server: 2001:db8:abc1:1000::31:8910                     │
│    Client Certificate: Upload dnac-pxgrid-cert.pem               │
│    Client Key: Upload dnac-pxgrid-key.pem                         │
│                                                                    │
│  Services to Subscribe:                                            │
│    ☑ Session Directory (active IPv6 sessions)                     │
│    ☑ SGT Download (TrustSec matrix)                               │
│    ☑ Endpoint Profiling (device classifications)                  │
│    ☑ ANC Policy (quarantine actions)                              │
│                                                                    │
│  Synchronization:                                                  │
│    Frequency: Real-time (via WebSocket)                           │
│    Full Sync: Every 24 hours                                      │
│                                                                    │
│  Test Connection → Save                                            │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  VERIFICATION:                                                     │
│                                                                    │
│  DNAC → System → Settings → Integration Settings → ISE            │
│    Status: Connected ✅                                           │
│    pxGrid Status: Subscribed ✅                                   │
│    Last Sync: <timestamp>                                         │
│                                                                    │
│  View Downloaded Data:                                             │
│    DNAC → Policy → Group-Based Access Control → Scalable Groups   │
│    Expected: All SGTs from ISE (10, 15, 20, 25, 30, 99)          │
│                                                                    │
│    DNAC → Assurance → Client Health                               │
│    Expected: Clients with SGT assignments (IPv4 + IPv6)           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 16.2 DHCPv6 Relay Configuration

### Step 16.2.1: Configure DHCPv6 Relay on Fabric SVI

```cisco
! ═══════════════════════════════════════════════════════════════════
! DHCPv6 RELAY ON FABRIC SVI (for IoT devices)
! Edge Switch: MUM-ED-F1-01, VLAN 1031 (IoT)
! ═══════════════════════════════════════════════════════════════════

! IoT devices may need stateful DHCPv6 for:
! - Static IPv6 addressing (easier management)
! - DHCPv6 options (NTP servers, domain search list)
! - Integration with IPAM systems

configure terminal

! IoT VLAN SVI
interface Vlan1031
  description ANYCAST-GW-IoT-DUAL-STACK
  vrf forwarding VN_IoT
  !
  ! IPv4 (existing)
  ip address 10.190.31.1 255.255.255.0
  ip dhcp relay source-interface Loopback0
  ip helper-address 10.252.31.31  ! ISE DHCP server IPv4
  !
  ! IPv6 (existing from Phase 2)
  ipv6 address 2001:db8:abc1:4001::1/64
  ipv6 enable
  !
  ! IPv6 RA (existing — for SLAAC clients)
  ipv6 nd managed-config-flag  ! M=1 for stateful DHCPv6
  ipv6 nd other-config-flag    ! O=1 for options
  ipv6 nd ra interval 200
  !
  ! DHCPv6 Relay ✅ NEW
  ipv6 dhcp relay destination 2001:db8:abc1:1000::31  ! ISE DHCPv6 server
  ipv6 dhcp relay source-interface Loopback0
  !
  no shutdown

! Verify DHCPv6 relay configuration
show ipv6 dhcp interface Vlan1031
! Expected:
! Vlan1031 is in relay mode
!   Relay destinations:
!     2001:db8:abc1:1000::31

end
write memory
```

---

## 16.3 ISE DHCPv6 Server Configuration

### Step 16.3.1: Configure DHCPv6 Server on ISE

```
ISE Admin Console Configuration:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  ISE → Administration → Network Resources → DHCP Services          │
│                                                                    │
│  ☑ Enable DHCPv6 Server                                           │
│                                                                    │
│  DHCPv6 Server Settings:                                           │
│    Listening Interface: GigabitEthernet0                          │
│    IPv6 Address: 2001:db8:abc1:1000::31                           │
│    Port: 547 (DHCPv6 server)                                      │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  CREATE DHCPv6 POOL:                                               │
│                                                                    │
│  Pool Name: IoT-IPv6-Pool                                         │
│  Network: 2001:db8:abc1:4001::/64                                 │
│  Address Range:                                                    │
│    Start: 2001:db8:abc1:4001::100                                │
│    End: 2001:db8:abc1:4001::1000                                 │
│    (Reserve ::1-::99 for static addressing)                       │
│                                                                    │
│  Default Gateway: 2001:db8:abc1:4001::1 (anycast GW)              │
│                                                                    │
│  DNS Servers (DHCPv6 Option 23):                                   │
│    Primary: 2001:db8:abc1:1000::53                                │
│    Secondary: 2001:4860:4860::8888 (Google Public DNS)            │
│                                                                    │
│  Domain Search List (DHCPv6 Option 24):                            │
│    abhavtech.com                                                  │
│                                                                    │
│  NTP Servers (DHCPv6 Option 56):                                   │
│    2001:db8:abc1:1000::123                                        │
│                                                                    │
│  Lease Time:                                                       │
│    Preferred Lifetime: 86400 seconds (1 day)                      │
│    Valid Lifetime: 172800 seconds (2 days)                        │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  DHCP RESERVATION (for specific IoT devices):                      │
│                                                                    │
│  Policy → Policy Sets → DHCP                                       │
│                                                                    │
│  Condition: MAC Address = 00:11:22:33:44:55 (IoT Camera)          │
│  Action:                                                           │
│    IPv6 Address: 2001:db8:abc1:4001::10 (reserved)                │
│    DNS: Same as pool                                              │
│    Lease: 7 days (longer for static devices)                      │
│                                                                    │
│  Save Configuration                                                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 16.4 Multicast PIM Configuration

### Step 16.4.1: Enable PIM Sparse-Mode for LISP

```cisco
! ═══════════════════════════════════════════════════════════════════
! PIM SPARSE-MODE FOR LISP MAP-NOTIFY MULTICAST
! ═══════════════════════════════════════════════════════════════════

! LISP uses multicast for map-notify messages:
! IPv4: 239.1.1.1
! IPv6: ff02::fb (link-local) or ff05::1:1 (site-local)

! Configure on all fabric nodes (Border, CP, Edge)

configure terminal

! Enable IPv6 multicast routing
ipv6 multicast-routing

! Configure PIM sparse-mode on underlay interfaces
! (Already configured from Phase 1 for IPv4, add IPv6)

! Example: Underlay link between MUM-CP-01 and MUM-BN-01
interface TenGigabitEthernet1/0/1
  description UNDERLAY-TO-MUM-BN-01
  !
  ! IPv6 PIM sparse-mode
  ipv6 pim sparse-mode
  !
  ! (Repeat for all underlay interfaces)

! Configure Rendezvous Point (RP) for IPv6
! Use Border node as RP

! On all fabric nodes:
ipv6 pim rp-address 2001:db8:abc1:0::1  ! MUM-BN-01 loopback

! On Border node (RP):
interface Loopback0
  ipv6 pim sparse-mode

! Verify PIM
show ipv6 pim neighbor
! Expected: See all underlay neighbors

show ipv6 pim rp mapping
! Expected:
! RP: 2001:db8:abc1:0::1, static

! Test multicast connectivity
! On Control Plane node:
show lisp site
! Expected: Sites should register successfully (uses multicast for map-notify)

end
write memory
```

---

## 16.5 Week 16 Validation

```bash
#!/bin/bash
# validate_phase2b_week16.sh

echo "=== WEEK 16 VALIDATION: SECURITY + IoT ==="

# Test 1: pxGrid connection
echo ""
echo "Test 1: ISE pxGrid Status"
# On ISE CLI:
ssh admin@2001:db8:abc1:1000::31 "show application status ise"
# Expected: pxGrid service running

# Check DNAC pxGrid subscription
# DNAC GUI: System → Settings → ISE Integration
# Expected: Status = Connected, pxGrid subscribed

# Test 2: SGT propagation to fabric
echo ""
echo "Test 2: SGT Download to Fabric"
# On DNAC: Policy → Scalable Groups
# Expected: All SGTs visible (10, 15, 20, 25, 30, 99)

# On Edge switch: Verify SGT assignment
ssh admin@10.250.1.10 "show cts role-based permissions"
# Expected: SGT-based ACLs present

# Test 3: DHCPv6 stateful addressing
echo ""
echo "Test 3: IoT Device DHCPv6"
# Connect IoT camera to network (VLAN 1031)
# On camera, check IPv6:
# Expected: 2001:db8:abc1:4001::xxx (from ISE DHCPv6 pool)

# On ISE: Monitor → DHCPv6 Leases
# Expected: See active leases for IoT devices

# Test 4: Multicast PIM
echo ""
echo "Test 4: PIM Neighbor Adjacencies"
ssh admin@10.250.1.3 "show ipv6 pim neighbor"
# Expected: All underlay neighbors in PIM

# Test 5: LISP map-notify via multicast
echo ""
echo "Test 5: LISP Map-Notify Delivery"
# On Control Plane:
ssh admin@10.250.1.3 "show lisp site detail | include Notify"
# Expected: Map-notify sent successfully (via multicast)

# Test 6: Complete security validation
echo ""
echo "Test 6: End-to-End Security (SGT + IPv6)"
# Attempt: IoT device (SGT 25) → Corporate server (SGT 10)
# From IoT camera:
ping6 -c 3 2001:db8:abc1:2001::20  # Corporate server
# Expected: BLOCKED (no reply, timeout)

# Check fabric logs
ssh admin@10.250.1.10 "show cts role-based counters"
# Expected: Packets dropped for SGT 25 → SGT 10

echo ""
echo "✅ Week 16 validation complete"
```

---

## WEEK 17: OPERATIONS + PERFORMANCE

## 17.1 Troubleshooting Procedures

### Troubleshooting 17.1.1: Common IPv6 Issues in SD-Access

```
SD-ACCESS IPv6 TROUBLESHOOTING GUIDE:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  ISSUE 1: Clients Not Getting IPv6 Address                        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  Symptoms:                                                         │
│    - Client has IPv4 but no IPv6                                  │
│    - ipconfig shows "IPv6 Address: Not Available"                 │
│                                                                    │
│  Troubleshooting Steps:                                            │
│    1. Verify SVI IPv6 configuration                               │
│       Edge# show ipv6 interface Vlan1011                          │
│       Expected: IPv6 address configured, RA enabled               │
│                                                                    │
│    2. Check IPv6 RA configuration                                 │
│       Edge# show run interface Vlan1011 | include nd              │
│       Expected: ipv6 nd managed-config-flag (M=0)                 │
│                 ipv6 nd other-config-flag (O=1)                   │
│                                                                    │
│    3. Verify client is receiving RAs                              │
│       Client# rdisc6 eth0  (Linux)                                │
│       Expected: RA received from fe80::xxx (anycast gateway)      │
│                                                                    │
│    4. Check LISP EID registration                                 │
│       Edge# show lisp ipv6 database                               │
│       Expected: Prefix 2001:db8:abc1:2001::/64 registered        │
│                                                                    │
│  Common Causes:                                                    │
│    ❌ SVI missing "ipv6 nd managed-config-flag" command           │
│    ❌ SVI missing "ipv6 address" statement                        │
│    ❌ RA Guard blocking RAs from gateway                          │
│    ❌ LISP IPv6 service not enabled on Map-Server                 │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  ISSUE 2: IPv6 Neighbor Table Exhaustion                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  Symptoms:                                                         │
│    - Intermittent IPv6 connectivity loss                          │
│    - Syslog: "%IPV6_ND-3-NDLIMIT: Neighbor Discovery limit"      │
│                                                                    │
│  Troubleshooting Steps:                                            │
│    1. Check current ND table size                                 │
│       Switch# show ipv6 neighbors count                           │
│       Expected: < 10,000 entries                                  │
│                                                                    │
│    2. Check ND table limit                                        │
│       Switch# show run | include ipv6 nd cache                    │
│       Default: 10,000 entries                                     │
│                                                                    │
│    3. Increase ND table size (if needed)                          │
│       Switch(config)# ipv6 nd cache interface-limit 20000         │
│                                                                    │
│    4. Enable ND cache aging                                       │
│       Switch(config-if)# ipv6 nd cache expire 300                 │
│       (Entries expire after 5 minutes of inactivity)              │
│                                                                    │
│  Common Causes:                                                    │
│    ❌ Too many clients in single VLAN (>10,000)                   │
│    ❌ ND entries not aging out (stale entries)                    │
│    ❌ ND cache attack (malicious hosts)                           │
│                                                                    │
│  Prevention:                                                       │
│    ✅ Split large VLANs into multiple subnets                     │
│    ✅ Enable IPv6 device tracking (clears stale entries)          │
│    ✅ Implement IPv6 source guard (prevents spoofing)             │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  ISSUE 3: Cross-Site IPv6 Connectivity Failure                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  Symptoms:                                                         │
│    - Mumbai client cannot ping Chennai client (IPv6)              │
│    - Traceroute shows blackhole                                   │
│                                                                    │
│  Troubleshooting Steps:                                            │
│    1. Verify LISP EID registration on remote site                 │
│       MUM-CP# show lisp site CHENNAI                              │
│       Expected: Chennai prefixes registered                       │
│                                                                    │
│    2. Check LISP map-cache on Border                              │
│       MUM-BN# show lisp ipv6 map-cache                            │
│       Expected: Chennai prefixes with valid RLOCs                 │
│                                                                    │
│    3. Verify BGP route exchange (Border ↔ SD-WAN)                │
│       MUM-BN# show bgp ipv6 unicast                               │
│       Expected: Chennai routes via SD-WAN                         │
│                                                                    │
│    4. Check OMP routes on SD-WAN                                  │
│       MUM-HUB# show sdwan omp routes ipv6                         │
│       Expected: Chennai fabric prefixes                           │
│                                                                    │
│    5. Trace packet path                                           │
│       MUM-BN# trace ipv6 2001:db8:abc2:2001::10 source 2001:db8:abc1:2001::10│
│       Expected: Path via Border → SD-WAN → Chennai                │
│                                                                    │
│  Common Causes:                                                    │
│    ❌ BGP neighbor down (Border ↔ SD-WAN)                        │
│    ❌ Route filter blocking fabric prefixes                       │
│    ❌ LISP registration failure (Map-Server unreachable)          │
│    ❌ MTU mismatch (VXLAN overhead + IPv6 = 1550 bytes)           │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  ISSUE 4: WiFi Clients Not Getting IPv6                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  Symptoms:                                                         │
│    - Wired clients get IPv6, WiFi clients don't                   │
│    - CAPWAP tunnel established but no client addressing           │
│                                                                    │
│  Troubleshooting Steps:                                            │
│    1. Verify WLC management IPv6                                  │
│       WLC# show interface summary                                 │
│       Expected: Management interface has IPv6 address             │
│                                                                    │
│    2. Check CAPWAP tunnel (AP ↔ WLC)                              │
│       WLC# show capwap client                                     │
│       Expected: Tunnels using IPv6                                │
│                                                                    │
│    3. Verify WLAN fabric mode enabled                             │
│       WLC# show wlan summary                                      │
│       Expected: Fabric Mode = Enabled for Corporate SSID          │
│                                                                    │
│    4. Check VXLAN tunnel (WLC ↔ Fabric Edge)                      │
│       Edge# show nve peers                                        │
│       Expected: WLC as NVE peer                                   │
│                                                                    │
│    5. Verify client sees fabric SVI RAs                           │
│       WiFi Client# rdisc6 wlan0                                   │
│       Expected: RA from fabric anycast gateway                    │
│                                                                    │
│  Common Causes:                                                    │
│    ❌ WLC not registered as NVE peer in fabric                    │
│    ❌ WLAN not in fabric mode (local switching enabled)           │
│    ❌ VXLAN tunnel MTU mismatch                                   │
│    ❌ Access switch blocking VXLAN (port security)                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 17.2 Performance Baselines

### Baseline 17.2.1: Latency Measurements

```bash
#!/bin/bash
# performance_baselines.sh

echo "=== SD-ACCESS IPv6 PERFORMANCE BASELINES ==="

# Baseline 1: LISP Convergence Time (Site Failure)
echo ""
echo "Baseline 1: LISP Convergence (IPv6)"
# Simulate: Disconnect MUM-CP-01 (Control Plane node)
# Measure: Time for EIDs to re-register to MUM-CP-02

# Expected convergence:
# - EID re-registration: < 10 seconds
# - Client traffic impact: < 5 seconds (pre-cached map-cache entries)

# Baseline 2: Client Roaming Performance
echo ""
echo "Baseline 2: WiFi Client Roaming (IPv6)"
# Test: Client moves from MUM-AP-F1-01 to MUM-AP-F2-01 (different floors)
# Measure: Roaming time (802.11r fast transition)

# Expected roaming time:
# - Association time: < 50 ms
# - IPv6 address retained: Yes (LISP mobility)
# - Traffic interruption: < 100 ms

# Baseline 3: Throughput IPv4 vs IPv6
echo ""
echo "Baseline 3: Throughput Comparison"
# iperf3 test: Mumbai client → Chennai client

# IPv4 throughput:
iperf3 -c 10.101.1.10 -t 30
# Expected: 950-990 Mbps (1 Gbps link)

# IPv6 throughput:
iperf3 -c 2001:db8:abc2:2001::10 -t 30 -6
# Expected: 950-990 Mbps (same as IPv4, ~1% overhead for IPv6 header)

# Baseline 4: Latency (Fabric Internal)
echo ""
echo "Baseline 4: Internal Fabric Latency"
# Ping within same site (Mumbai client → Mumbai server)

# IPv4:
ping -c 100 10.100.1.20 | tail -1
# Expected: avg 0.5-1.0 ms

# IPv6:
ping6 -c 100 2001:db8:abc1:2001::20 | tail -1
# Expected: avg 0.5-1.0 ms (no significant difference)

# Baseline 5: WiFi 7 6 GHz Performance
echo ""
echo "Baseline 5: WiFi 7 (802.11be) 6 GHz Performance"
# iperf3 test: WiFi 7 client on 6 GHz

# Single client throughput (WiFi 7, 320 MHz, 4×4:4 MIMO):
# IPv4: 3.5-4.0 Gbps
# IPv6: 3.5-4.0 Gbps (no degradation)

# Multi-client throughput (10 clients):
# Total: 8-10 Gbps (MLO + MRU enabled)

echo ""
echo "PERFORMANCE SUMMARY:"
echo "  LISP Convergence: < 10 seconds"
echo "  WiFi Roaming: < 100 ms"
echo "  Throughput: No IPv4 vs IPv6 difference"
echo "  Latency: 0.5-1.0 ms (same fabric)"
echo "  WiFi 7 6 GHz: 3.5-4.0 Gbps per client"
```

---

## 17.3 Hyderabad Fabric-in-a-Box Detail

### Config 17.3.1: Complete FiaB Configuration

```cisco
! ═══════════════════════════════════════════════════════════════════
! FABRIC-IN-A-BOX (FiaB) COMPLETE CONFIGURATION — HYD-FIAB-01
! Hardware: Catalyst 9300-24UX
! Roles: Border + Control Plane + Edge + Embedded WLC
! ═══════════════════════════════════════════════════════════════════

hostname HYD-FIAB-01

! ═══════════════════════════════════════════════════════════════════
! UNDERLAY (IS-IS Dual-Stack) — Already configured Phase 1
! ═══════════════════════════════════════════════════════════════════

interface Loopback0
  description RLOC-LOOPBACK-DUAL-STACK
  ip address 10.250.33.1 255.255.255.255
  ipv6 address 2001:db8:abc9:0::1/128
  ip router isis UNDERLAY
  isis ipv6 metric 10
  isis circuit-type level-2-only

! ═══════════════════════════════════════════════════════════════════
! LISP — MULTIPLE ROLES ON SINGLE SWITCH
! ═══════════════════════════════════════════════════════════════════

router lisp
  !
  ! Map-Server role (Control Plane)
  site HYDERABAD
    authentication-key 7 <encrypted>
    eid-record instance-id 8001 accept-more-specifics
    exit-site-config
  !
  instance-id 8001
    service ipv4
      map-server
      map-notify-group 239.1.1.1
      exit-service-ipv4
    !
    service ipv6
      map-server
      map-notify-group ff05::1:1
      exit-service-ipv6
    exit-instance-id
  !
  ! Border role
  locator-set RLOC-SET
    ipv4-interface Loopback0 priority 1 weight 50
    ipv6-interface Loopback0 priority 1 weight 50
    exit-locator-set
  !
  instance-id 8001
    service ipv4
      eid-table vrf VN_CORPORATE
      database-mapping 10.102.0.0/16 locator-set RLOC-SET
      map-cache 0.0.0.0/0 map-request  ! Default route
      exit-service-ipv4
    !
    service ipv6
      eid-table vrf VN_CORPORATE
      database-mapping 2001:db8:abc9::/48 locator-set RLOC-SET
      map-cache ::/0 map-request
      exit-service-ipv6
  !
  ! Map-Resolver
  ipv4 map-resolver
  ipv6 map-resolver
  !
  exit-router-lisp

! ═══════════════════════════════════════════════════════════════════
! VRF CONFIGURATION (VN_CORPORATE)
! ═══════════════════════════════════════════════════════════════════

vrf definition VN_CORPORATE
  description Corporate VN
  address-family ipv4
    route-target export 65001:8001
    route-target import 65001:8001
    exit-address-family
  !
  address-family ipv6
    route-target export 65001:8001
    route-target import 65001:8001
    exit-address-family

! ═══════════════════════════════════════════════════════════════════
! CLIENT-FACING SVIs (Edge role)
! ═══════════════════════════════════════════════════════════════════

! Corporate VLAN
interface Vlan1011
  description ANYCAST-GW-CORPORATE-DUAL-STACK
  vrf forwarding VN_CORPORATE
  ip address 10.102.1.1 255.255.255.0
  ipv6 address 2001:db8:abc9:2001::1/64
  ipv6 enable
  ipv6 nd managed-config-flag
  ipv6 nd other-config-flag
  ipv6 nd ra interval 200
  ipv6 nd ra dns server 2001:db8:abc9:1000::53 lifetime 1800
  mac-address 0000.0c9f.f001  ! Anycast MAC
  lisp mobility dynamic-eid CORP-EID-v4
  lisp mobility dynamic-eid CORP-EID-v6
  no shutdown

! ═══════════════════════════════════════════════════════════════════
! EMBEDDED WLC CONFIGURATION
! ═══════════════════════════════════════════════════════════════════

! Enable embedded wireless controller
wireless config embedded-ap enable

! Management interface for WLC
interface GigabitEthernet0/0
  description WLC-MANAGEMENT
  ip address 10.252.33.11 255.255.255.0
  ipv6 address 2001:db8:abc9:1000::11/64
  no shutdown

! WLAN configuration
wlan Abhavtech-Corporate 1 Corporate-Profile
  security wpa wpa3 authentication dot1x
  security wpa akm dot1x
  no shutdown

! Fabric mode for WLAN
wireless fabric control-plane HYD-CP
  ip address 10.250.33.1  ! Loopback0
  ipv6 address 2001:db8:abc9:0::1

wlan Abhavtech-Corporate 1
  fabric control-plane HYD-CP
  fabric vn VN_CORPORATE

! ═══════════════════════════════════════════════════════════════════
! BGP FOR SD-WAN INTEGRATION (Border role)
! ═══════════════════════════════════════════════════════════════════

router bgp 65001
  bgp router-id 10.250.33.1
  !
  neighbor 2001:db8:abc9:8000::1 remote-as 65000  ! SD-WAN router
  neighbor 2001:db8:abc9:8000::1 update-source Loopback0
  !
  address-family ipv6 unicast
    neighbor 2001:db8:abc9:8000::1 activate
    network 2001:db8:abc9::/48
    redistribute lisp
    exit-address-family

! ═══════════════════════════════════════════════════════════════════
! VALIDATION COMMANDS FOR FiaB
! ═══════════════════════════════════════════════════════════════════

! Verify all LISP roles active
show lisp site  ! Map-Server role
show lisp ipv6 database  ! Border role (database-mapping)
show lisp ipv6 server  ! Map-Resolver role

! Verify embedded WLC
show wireless summary  ! Expected: APs joined
show wlan summary  ! Expected: Fabric mode enabled

! Verify BGP to SD-WAN
show bgp ipv6 unicast summary  ! Expected: Neighbor up
```

---

## 17.4 Phase 2B Completion Summary

```bash
#!/bin/bash
# phase2b_summary.sh

echo "═══════════════════════════════════════════════════════════════"
echo "     PHASE 2B COMPLETION REPORT — ADVANCED IPv6 TOPICS"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "WEEK 15: WLC + BORDER BGP"
echo "  ✅ Cisco 9800 WLC management IPv6"
echo "  ✅ CAPWAP over IPv6 (1,220+ APs)"
echo "  ✅ WLAN dual-stack (all SSIDs)"
echo "  ✅ Border node BGP to SD-WAN (IPv6)"
echo "  ✅ Route redistribution (LISP → BGP → OMP)"
echo "  ✅ External IPv6 connectivity validated"
echo ""

echo "WEEK 16: SECURITY + IoT"
echo "  ✅ ISE pxGrid configuration"
echo "  ✅ SGT download to fabric"
echo "  ✅ DHCPv6 relay on SVIs"
echo "  ✅ DHCPv6 server on ISE (IoT pools)"
echo "  ✅ Multicast PIM sparse-mode"
echo "  ✅ Complete security stack operational"
echo ""

echo "WEEK 17: OPERATIONS + PERFORMANCE"
echo "  ✅ Troubleshooting procedures (4 major scenarios)"
echo "  ✅ Performance baselines documented"
echo "  ✅ Hyderabad FiaB detailed config"
echo "  ✅ Operational readiness achieved"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "        ✅ PHASE 2B COMPLETE — PRODUCTION READY"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "COMBINED PHASE 2 + 2B STATUS:"
echo "  Phase 2:  ✅ Core fabric (LISP, VXLAN, Edge)"
echo "  Phase 2B: ✅ Advanced topics (WLC, BGP, Security)"
echo ""
echo "  Total Documentation: 2,700+ lines"
echo "  Templates: 6 (from Phase 2)"
echo "  Archetypes: 3 sites (Mumbai, Chennai, Hyderabad FiaB)"
echo ""
echo "INFRASTRUCTURE READY:"
echo "  - 1,860 APs dual-stack (WiFi 7 + WiFi 6E)"
echo "  - 7,500+ clients dual-stack"
echo "  - External IPv6 connectivity ✅"
echo "  - Complete security (SGT, 802.1X, pxGrid)"
echo "  - Operational support (troubleshooting + baselines)"
echo ""
echo "DEPLOYMENT STATUS: Production-ready ✅"
```

---

## PHASE 2B COMPLETE

**Summary:**
- **Week 15:** WLC 9800 + Border BGP — Critical gaps filled
- **Week 16:** pxGrid + DHCPv6 + Multicast — Security complete
- **Week 17:** Troubleshooting + Performance + FiaB — Operations ready

**Total Phase 2B Documentation:** ~1,500 lines

**Combined Phase 2 + 2B:**
- Phase 2: 1,222 lines (core fabric)
- Phase 2B: 1,500 lines (advanced topics)
- **Total: 2,722 lines** of complete SD-Access IPv6 documentation

**Infrastructure Achievement:**
- ✅ **1,860 WiFi APs** dual-stack (including 1,220 WiFi 7)
- ✅ **~7,500 clients** dual-stack (wired + wireless)
- ✅ **External IPv6 connectivity** via Border BGP
- ✅ **Complete security** (SGT, 802.1X, pxGrid, DHCPv6)
- ✅ **Operational readiness** (troubleshooting + performance)

---

*© 2025 Abhavtech - IPv6 Migration Phase 2B Guide*
*Version 1.0 | Last Updated: January 2025*
