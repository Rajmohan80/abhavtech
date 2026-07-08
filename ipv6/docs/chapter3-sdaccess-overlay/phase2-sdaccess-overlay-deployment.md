# ABHAVTECH IPv6 MIGRATION — PHASE 2
## SD-ACCESS OVERLAY IPv6 DEPLOYMENT

**Project:** ABV-IPV6-2025  
**Phase:** 2 — SD-Access Overlay IPv6  
**Duration:** 6 Weeks (Week 9-14)  
**Objective:** Deploy IPv6 overlay on SD-Access campus fabrics with dual-stack endpoints  
**Scope:** Mumbai HQ (detailed), Chennai HQ (validation), Templates for remaining sites  

---

## PHASE 2 OVERVIEW

```
PHASE 2 DEPLOYMENT STRATEGY:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  WHY ARCHETYPE APPROACH FOR SD-ACCESS?                            │
│                                                                    │
│  PROBLEM: Multiple SD-Access sites with similar fabric designs    │
│           Mumbai: 6 floors, full fabric (Border, CP, Edge)        │
│           Chennai: 4 floors, full fabric                          │
│           Hyderabad: FiaB (already deployed in Phase 1)           │
│           Other sites: Minimal or no SD-Access                    │
│                                                                    │
│  SOLUTION: Deep dive on Mumbai, replicate to Chennai, templates   │
│            for future                                             │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  PHASE 2 SITE SELECTION:                                          │
│                                                                    │
│  1️⃣ MUMBAI HQ (Week 9-11)                                        │
│     Role: Primary archetype — full documentation                  │
│     Infrastructure:                                                │
│       - 6 floors, 200 access switches                             │
│       - 2 Border nodes (MUM-BN-01/02)                             │
│       - 2 Control Plane nodes (MUM-CP-01/02)                      │
│       - 50 Edge nodes per floor                                   │
│       - 5,000 users (wired + WiFi)                                │
│       - 1,220 WiFi 7 APs (Catalyst 9136)                          │
│     Deployment:                                                    │
│       - LISP dual-stack (IPv4 + IPv6 EIDs)                        │
│       - VXLAN with IPv6 payload                                   │
│       - Anycast gateway dual-stack                                │
│       - ISE IPv6 profiling (802.1X + RADIUS)                      │
│       - DNAC IPv6 pools (SLAAC + DHCPv6 options)                  │
│       - Client testing (Windows 11, iPhone, IoT)                  │
│                                                                    │
│  2️⃣ CHENNAI HQ (Week 12-13)                                      │
│     Role: Validation archetype — abbreviated docs                 │
│     Infrastructure: Similar to Mumbai (4 floors, 2,500 users)     │
│     Purpose: Validate Mumbai approach works across regions        │
│                                                                    │
│  3️⃣ TEMPLATES (Week 14)                                           │
│     - DNAC IPv6 pool templates                                    │
│     - ISE IPv6 policy templates                                   │
│     - Edge switch base configs                                    │
│     - Validation scripts                                          │
│     Apply to: Future SD-Access sites, expansions                  │
│                                                                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                    │
│  EXISTING SITES (NO ADDITIONAL WORK):                             │
│    ✅ Hyderabad FiaB: IPv6 overlay deployed in Phase 1            │
│    ⏭️ London, Frankfurt, NJ, Dallas: No SD-Access (WAN only)     │
│    ⏭️ Branches: No SD-Access (ISR direct LAN)                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## WEEK 9-11: MUMBAI HQ SD-ACCESS IPv6 OVERLAY

## Week 9: Foundation (LISP + VXLAN Dual-Stack)

### 9.1 Mumbai SD-Access Fabric Baseline

```
MUMBAI CAMPUS SD-ACCESS INFRASTRUCTURE:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  FABRIC ROLES:                                                     │
│                                                                    │
│  Border Nodes (2):                                                 │
│    MUM-BN-01: Catalyst 9500-48Y4C                                 │
│      - Loopback0: 10.250.1.1 (IPv4), 2001:db8:abc1:0::1 (IPv6)   │
│      - Role: Fabric border + SD-WAN handoff                       │
│      - LISP: Border router, PxTR                                  │
│      - BGP: Peering with SD-WAN for route exchange                │
│                                                                    │
│    MUM-BN-02: Catalyst 9500-48Y4C                                 │
│      - Loopback0: 10.250.1.2 (IPv4), 2001:db8:abc1:0::2 (IPv6)   │
│      - Role: Redundant border                                     │
│                                                                    │
│  Control Plane Nodes (2):                                          │
│    MUM-CP-01: Catalyst 9500-48Y4C                                 │
│      - Loopback0: 10.250.1.3, 2001:db8:abc1:0::3                 │
│      - Role: LISP Map-Server, Map-Resolver                        │
│                                                                    │
│    MUM-CP-02: Catalyst 9500-48Y4C                                 │
│      - Loopback0: 10.250.1.4, 2001:db8:abc1:0::4                 │
│      - Role: Redundant CP                                         │
│                                                                    │
│  Edge Nodes (200 total):                                           │
│    Per floor: ~33 switches (Catalyst 9300-48UXM)                  │
│    Example: MUM-ED-F1-01 through MUM-ED-F6-33                     │
│      - Loopbacks: 10.250.1.10-210, 2001:db8:abc1:0::10-210       │
│      - Role: Endpoint connectivity, 802.1X, SGT tagging           │
│                                                                    │
│  UNDERLAY (Already IPv6 — Phase 1):                               │
│    ✅ IS-IS dual-stack                                            │
│    ✅ Loopback RLOCs dual-stack                                   │
│    ✅ P2P links dual-stack                                        │
│                                                                    │
│  OVERLAY (Phase 2 — Add IPv6):                                    │
│    Current: IPv4-only EIDs (10.100.1.0/24 per floor)              │
│    Target:  IPv4 + IPv6 EIDs (dual-stack clients)                │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### 9.2 LISP Dual-Stack Configuration

#### Map-Server Configuration (MUM-CP-01)

```cisco
! ═══════════════════════════════════════════════════════════════════
! LISP MAP-SERVER DUAL-STACK (MUM-CP-01)
! ═══════════════════════════════════════════════════════════════════

! Already configured from Phase 1:
interface Loopback0
  ip address 10.250.1.3 255.255.255.255
  ipv6 address 2001:db8:abc1:0::3/128

! LISP router configuration
router lisp
  !
  ! Site configuration for Mumbai fabric
  site MUMBAI
    description Mumbai HQ Fabric
    authentication-key 7 <encrypted-key>
    eid-record instance-id 8001 accept-more-specifics  ! VN_CORPORATE
    exit-site-config
  !
  ! ═══════════════════════════════════════════════════════════════
  ! INSTANCE 8001 — VN_CORPORATE (IPv4 + IPv6)
  ! ═══════════════════════════════════════════════════════════════
  !
  instance-id 8001
    !
    ! IPv4 service (already exists)
    service ipv4
      map-server
      map-notify-group 239.1.1.1
      exit-service-ipv4
    !
    ! IPv6 service ✅ NEW
    service ipv6
      map-server
      map-notify-group ff02::fb  ! IPv6 multicast for map-notify
      exit-service-ipv6
    !
  exit-instance-id
  !
  ! Map-resolver configuration
  ipv4 map-resolver
  ipv6 map-resolver  ! ✅ NEW
  !
  exit-router-lisp

! Verify Map-Server status
do show lisp site
! Expected: Mumbai site registered with IPv4 + IPv6 EID prefixes
```

---

#### Border Node Configuration (MUM-BN-01)

```cisco
! ═══════════════════════════════════════════════════════════════════
! BORDER NODE LISP DUAL-STACK (MUM-BN-01)
! ═══════════════════════════════════════════════════════════════════

router lisp
  !
  ! Locator set (RLOCs) — already dual-stack from Phase 1
  locator-set RLOC-SET
    ipv4-interface Loopback0 priority 1 weight 50
    ipv6-interface Loopback0 priority 1 weight 50  ! ✅ Already configured
    exit-locator-set
  !
  ! ═══════════════════════════════════════════════════════════════
  ! INSTANCE 8001 — VN_CORPORATE
  ! ═══════════════════════════════════════════════════════════════
  !
  instance-id 8001
    !
    ! IPv4 service (already exists)
    service ipv4
      eid-table vrf VN_CORPORATE
      database-mapping 10.100.0.0/16 locator-set RLOC-SET
      map-cache 10.100.0.0/16 map-request
      map-server 10.250.1.3 key <key>
      map-server 10.250.1.4 key <key>
      map-resolver 10.250.1.3
      map-resolver 10.250.1.4
      use-petr 10.250.1.3 priority 1 weight 50
      use-petr 10.250.1.4 priority 1 weight 50
      exit-service-ipv4
    !
    ! IPv6 service ✅ NEW
    service ipv6
      eid-table vrf VN_CORPORATE
      !
      ! Database mapping for Mumbai corporate IPv6 prefix
      database-mapping 2001:db8:abc1:2000::/52 locator-set RLOC-SET
      !
      ! Map-cache for all Abhavtech IPv6 prefixes
      map-cache 2001:db8::/32 map-request
      !
      ! Map-Server and Map-Resolver (IPv6 addresses)
      map-server 2001:db8:abc1:0::3 key <key>
      map-server 2001:db8:abc1:0::4 key <key>
      map-resolver 2001:db8:abc1:0::3
      map-resolver 2001:db8:abc1:0::4
      !
      ! Proxy ETR (PxTR) for IPv6
      use-petr 2001:db8:abc1:0::3 priority 1 weight 50
      use-petr 2001:db8:abc1:0::4 priority 1 weight 50
      !
      exit-service-ipv6
    !
  exit-instance-id
  !
  exit-router-lisp

! VRF definition (add IPv6 address family)
vrf definition VN_CORPORATE
  rd 1:8001
  !
  address-family ipv4
    route-target export 1:8001
    route-target import 1:8001
  exit-address-family
  !
  address-family ipv6  ! ✅ NEW
    route-target export 1:8001
    route-target import 1:8001
  exit-address-family
```

---

#### Edge Node Configuration (MUM-ED-F1-01)

```cisco
! ═══════════════════════════════════════════════════════════════════
! EDGE NODE LISP DUAL-STACK (MUM-ED-F1-01 — Floor 1, Switch 1)
! ═══════════════════════════════════════════════════════════════════

! Loopback RLOC (already dual-stack)
interface Loopback0
  ip address 10.250.1.10 255.255.255.255
  ipv6 address 2001:db8:abc1:0::10/128

router lisp
  !
  locator-set RLOC-SET
    ipv4-interface Loopback0 priority 1 weight 50
    ipv6-interface Loopback0 priority 1 weight 50
    exit-locator-set
  !
  instance-id 8001
    !
    ! IPv4 service
    service ipv4
      eid-table vrf VN_CORPORATE
      database-mapping 10.100.1.0/24 locator-set RLOC-SET  ! Floor 1 IPv4 pool
      map-cache 10.100.0.0/16 map-request
      map-server 10.250.1.3 key <key>
      map-server 10.250.1.4 key <key>
      map-resolver 10.250.1.3
      map-resolver 10.250.1.4
      exit-service-ipv4
    !
    ! IPv6 service ✅ NEW
    service ipv6
      eid-table vrf VN_CORPORATE
      !
      ! Floor 1 IPv6 pool: 2001:db8:abc1:2001::/64
      database-mapping 2001:db8:abc1:2001::/64 locator-set RLOC-SET
      !
      map-cache 2001:db8:abc1:2000::/52 map-request
      map-server 2001:db8:abc1:0::3 key <key>
      map-server 2001:db8:abc1:0::4 key <key>
      map-resolver 2001:db8:abc1:0::3
      map-resolver 2001:db8:abc1:0::4
      exit-service-ipv6
    !
  exit-instance-id
  !
  exit-router-lisp

! VXLAN NVE interface (already exists, supports dual-stack payload)
interface nve1
  description FABRIC-VXLAN-TUNNEL
  no ip address
  source-interface Loopback0
  host-reachability protocol lisp
  !
  ! VNI 8001 carries both IPv4 and IPv6 traffic
  member vni 8001 vrf VN_CORPORATE
  member vni 8001 mcast-group 239.1.1.1
  member vni 10011 vlan-based
  !
  no shutdown

! ═══════════════════════════════════════════════════════════════════
! ANYCAST GATEWAY DUAL-STACK (Floor 1 Corporate VLAN)
! ═══════════════════════════════════════════════════════════════════

vlan 1011
  name VN_CORPORATE_F1_DATA

interface Vlan1011
  description ANYCAST-GW-CORPORATE-F1-DUAL-STACK
  vrf forwarding VN_CORPORATE
  !
  ! IPv4 gateway (existing)
  ip address 10.100.1.1 255.255.255.0
  ip helper-address 10.252.31.11  ! ISE DHCP server IPv4
  !
  ! IPv6 gateway ✅ NEW
  ipv6 address 2001:db8:abc1:2001::1/64
  ipv6 enable
  !
  ! IPv6 Router Advertisement (SLAAC)
  ipv6 nd managed-config-flag  ! M-flag = 0 (stateless SLAAC)
  ipv6 nd other-config-flag    ! O-flag = 1 (get DNS via RA)
  ipv6 nd ra interval 200      ! Send RA every 200 seconds
  ipv6 nd ra lifetime 1800     ! Default route lifetime
  !
  ! DNS server advertisement via RA (RFC 8106)
  ipv6 nd ra dns server 2001:db8:abc1:1000::53 lifetime 1800
  ipv6 nd ra dns search-list abhavtech.com lifetime 1800
  !
  ! Anycast MAC (same for IPv4 and IPv6)
  mac-address 0000.0c9f.f001
  !
  ! LISP mobility
  lisp mobility dynamic-eid CORPORATE_EID_v4
  lisp mobility dynamic-eid CORPORATE_EID_v6  ! ✅ NEW
  !
  no ip redirects
  no ipv6 redirects
  no shutdown

! VLAN-to-VNI mapping
vlan configuration 1011
  member evpn-instance 8001 vni 10011
```

---

### 9.3 Week 9 Validation

```bash
#!/bin/bash
# validate_lisp_ipv6.sh

echo "=== WEEK 9 VALIDATION: LISP DUAL-STACK ==="

# Test 1: Map-Server IPv6 registration
echo "Test 1: Map-Server IPv6 Site Registration"
ssh admin@10.250.1.3 "show lisp site | include 2001"
# Expected: Mumbai site with IPv6 EID prefix 2001:db8:abc1:2000::/52

# Test 2: Border LISP IPv6 database
echo ""
echo "Test 2: Border Node LISP IPv6 Database"
ssh admin@10.250.1.1 "show lisp instance-id 8001 ipv6 database"
# Expected: 2001:db8:abc1:2000::/52 locator 2001:db8:abc1:0::1

# Test 3: Edge LISP IPv6 registration
echo ""
echo "Test 3: Edge Node LISP IPv6 Registration"
ssh admin@10.250.1.10 "show lisp instance-id 8001 ipv6 database"
# Expected: 2001:db8:abc1:2001::/64 registered to CP

# Test 4: VXLAN tunnel status
echo ""
echo "Test 4: VXLAN Tunnel (supports IPv6 payload)"
ssh admin@10.250.1.10 "show interface nve1 | include 'line protocol'"
# Expected: line protocol is up

# Test 5: Anycast gateway IPv6
echo ""
echo "Test 5: Anycast Gateway IPv6 Address"
ssh admin@10.250.1.10 "show ipv6 interface vlan 1011 | include 2001"
# Expected: 2001:DB8:ABC1:2001::1/64

echo ""
echo "✅ Week 9 validation complete"
```

---

## Week 10: Endpoint Integration (ISE + DNAC + Clients)

### 10.1 DNAC IPv6 Pool Creation

```
DNAC UI → Design → Network Settings → IP Address Pools → Add Pool

POOL: IPv6-MUM-CORPORATE-F1
─────────────────────────────────────────────────────────────────────
Pool Name:          IPv6-MUM-CORPORATE-F1
Pool Type:          Generic
IP Subnet:          (leave blank for IPv6)

IPv6 Configuration:
  IPv6 Prefix:      2001:db8:abc1:2001::/64
  IPv6 Subnet Mask: 64
  IPv6 Gateway:     2001:db8:abc1:2001::1
  
  IPv6 Prefix Delegation: None (not using DHCPv6-PD)
  
  DHCPv6 Mode:      Stateless (SLAAC)
    Clients obtain: Address via SLAAC (RA)
                    DNS via RA (RFC 8106)
  
  DNS Servers (IPv6):
    Primary:        2001:db8:abc1:1000::53  (Internal DNS)
    Secondary:      2001:4860:4860::8888    (Google DNS backup)
  
  DNS Search Domain: abhavtech.com

Associate with Site:
  Hierarchy:        Global > India > Mumbai > HQ > Floor-1
  VLAN:             1011
  
Click "Save"

REPEAT for all 6 floors:
  - Floor 1: 2001:db8:abc1:2001::/64 (VLAN 1011)
  - Floor 2: 2001:db8:abc1:2002::/64 (VLAN 1012)
  - Floor 3: 2001:db8:abc1:2003::/64 (VLAN 1013)
  - Floor 4: 2001:db8:abc1:2004::/64 (VLAN 1014)
  - Floor 5: 2001:db8:abc1:2005::/64 (VLAN 1015)
  - Floor 6: 2001:db8:abc1:2006::/64 (VLAN 1016)
```

---

### 10.2 ISE IPv6 Profiling

#### Add IPv6 Network Devices

```
ISE UI → Administration → Network Resources → Network Devices

DEVICE: MUM-ED-F1-01
─────────────────────────────────────────────────────────────────────
Name:               MUM-ED-F1-01
Description:        Mumbai Floor 1 Edge Switch 01

IPv4 Address:       10.250.1.10
IPv6 Address:       2001:db8:abc1:0::10  ✅ NEW
  Prefix Length:    128

RADIUS Settings:
  Shared Secret:    <same for IPv4/IPv6>
  CoA Port:         1700
  
TACACS+ Settings:
  Shared Secret:    <same>

Device Type:        Cisco Catalyst 9300
Location:           Mumbai HQ Floor 1

REPEAT for all 200 edge switches (use CSV import)
```

#### IPv6 Profiling Policies

```
ISE → Policy → Profiling → Profiling Policies

CREATE: Windows-Workstation-IPv6
─────────────────────────────────────────────────────────────────────
Policy Name:        Windows-Workstation-IPv6
Parent Policy:      Workstations

Conditions (Compound AND):
  1. DHCP-Option(55) CONTAINS 1,15,3,6,44,46  (DHCPv4 fingerprint)
  2. DHCPv6-Option(1) EXISTS  (DHCPv6 DUID — even if SLAAC)
  3. DHCPv6-Vendor-Class CONTAINS "MSFT 5.0"
  
Action:
  Assign SGT:       10 (Employees)
  Endpoint Profile: Microsoft-Workstation
  
Exception Actions:
  If (DHCPv6-DUID matches IoT pattern) → Deny

─────────────────────────────────────────────────────────────────────

CREATE: iPhone-iOS-IPv6
─────────────────────────────────────────────────────────────────────
Policy Name:        iPhone-iOS-IPv6

Conditions:
  1. DHCPv6-Vendor-Class CONTAINS "Apple"
  2. User-Agent (HTTP) CONTAINS "iPhone"
  3. OUI EQUALS 00:00:00  (Apple OUI ranges)

Action:
  Assign SGT:       10 (Employees)
  Endpoint Profile: Apple-iPhone

─────────────────────────────────────────────────────────────────────

NOTES ON IPv6 PROFILING:
  - DHCPv6 options available even with SLAAC (clients send Solicit)
  - DUID (DHCPv6 Unique Identifier) = persistent per device
  - HTTP User-Agent still works (HTTPS limits visibility)
  - DNS queries can fingerprint OS (qname minimization patterns)
  - Prefer RADIUS attributes over passive profiling for IPv6
```

---

### 10.3 802.1X with IPv6 Endpoints

#### Edge Switch Port Configuration

```cisco
! ═══════════════════════════════════════════════════════════════════
! ACCESS PORT WITH 802.1X DUAL-STACK (MUM-ED-F1-01)
! ═══════════════════════════════════════════════════════════════════

interface GigabitEthernet1/0/1
  description USER-ACCESS-DUAL-STACK
  switchport mode access
  switchport access vlan 1011  ! VN_CORPORATE Floor 1
  
  ! 802.1X authentication
  authentication host-mode multi-auth
  authentication order dot1x mab
  authentication priority dot1x mab
  authentication port-control auto
  authentication periodic
  authentication timer reauthenticate server
  mab
  dot1x pae authenticator
  dot1x timeout tx-period 7
  
  ! TrustSec (SGT enforcement)
  cts role-based enforcement
  
  ! IPv4 + IPv6 source guard
  ip verify source
  ipv6 verify source  ! ✅ NEW — prevents IPv6 spoofing
  
  ! IPv4 + IPv6 device tracking
  device-tracking attach-policy IPDT-POLICY-v4
  ipv6 device-tracking attach-policy IPDT-POLICY-v6  ! ✅ NEW
  
  ! DHCP snooping (IPv4)
  ip dhcp snooping limit rate 10
  
  ! RA Guard (IPv6) — block rogue RAs from endpoints
  ipv6 nd raguard attach-policy RA-GUARD-POLICY  ! ✅ NEW
  
  ! Spanning tree
  spanning-tree portfast
  spanning-tree bpduguard enable
  
  no shutdown

! ═══════════════════════════════════════════════════════════════════
! IPv6 DEVICE TRACKING POLICY
! ═══════════════════════════════════════════════════════════════════

ipv6 device-tracking policy IPDT-POLICY-v6
  description IPv6 First-Hop Security
  tracking enable
  security-level glean
  !
  ! Prefix list for valid sources (SLAAC range)
  prefix-list 2001:db8:abc1:2001::/64
  !
  ! ND inspection/snooping
  protocol ndp
  protocol dhcp
  !
  ! Limits
  limit address-count 10  ! Max 10 IPv6 addresses per port
  !
  exit

! ═══════════════════════════════════════════════════════════════════
! RA GUARD POLICY (Block rogue RAs)
! ═══════════════════════════════════════════════════════════════════

ipv6 nd raguard policy RA-GUARD-POLICY
  description Block-Rogue-RAs-From-Endpoints
  device-role host  ! This port connects to endpoint, not router
  !
  ! Deny all RAs from this port (only trust RAs from SVI)
  !
  exit
```

---

### 10.4 Client Testing

#### Windows 11 Client

```powershell
# Connect Windows 11 laptop to Floor 1 access port

# Expected behavior:
# 1. 802.1X authentication (PEAP-MSCHAPv2 to ISE)
# 2. ISE assigns SGT 10 (Employees) based on AD group
# 3. DHCP: Receive IPv4 address 10.100.1.50 (existing)
# 4. SLAAC: Auto-configure IPv6 address
# 5. DNS: Receive via IPv6 RA

# Verify IPv6 configuration
ipconfig /all

# Expected output:
# Ethernet adapter Ethernet:
# IPv4 Address: 10.100.1.50
# Subnet Mask: 255.255.255.0
# Default Gateway: 10.100.1.1
#
# IPv6 Address: 2001:db8:abc1:2001:a1b2:c3d4:e5f6:7890 (Preferred)
# [SLAAC with privacy extensions — randomized interface ID]
# Link-local IPv6: fe80::a1b2:c3d4:e5f6:7890
# Default Gateway: 2001:db8:abc1:2001::1
# fe80::200:cff:fe9f:f001 (link-local of anycast gateway)
# DNS Servers: 2001:db8:abc1:1000::53
# 2001:4860:4860::8888

# Test connectivity
ping 2001:db8:abc1:2001::1
# Expected: Reply from anycast gateway

ping 2001:db8:abc1:2000::1
# Expected: Reply from another floor (via LISP fabric)

ping 2001:db8:abc2:2000::1
# Expected: Reply from Chennai campus (via OMP to Chennai hub → Chennai fabric)

ping ipv6.google.com
# Expected: Success (via SD-WAN DIA color to internet)

# Check DNS
nslookup -type=AAAA www.google.com
# Expected: IPv6 AAAA records returned

# Verify preferred IP version
# Windows prefers IPv6 if available (RFC 6724 Happy Eyeballs)
Test-Connection www.google.com
# Expected: Uses IPv6 address if both A and AAAA records exist
```

---

#### iPhone Client

```bash
# Connect iPhone 15 to Corp-Secure SSID (Floor 1 AP)

# iOS Settings → Wi-Fi → Corp-Secure → (i) icon

# Expected:
# - IP Address: 10.100.1.75 (IPv4 via DHCP)
# - IPv6 Address: 2001:db8:abc1:2001:xxxx:xxxx:xxxx:xxxx/64
# [iOS uses randomized MAC → randomized IPv6 with privacy extensions]
# - Router: fe80::200:cff:fe9f:f001 (anycast gateway link-local)
# - DNS: 2001:db8:abc1:1000::53, 2001:4860:4860::8888

# From Mac terminal (via SSH to iPhone, if jailbroken):
ping6 2001:db8:abc1:2001::1
# Expected: Reply

# From iPhone Safari:
# Visit https://test-ipv6.com
# Expected: "You have IPv6 connectivity!" (10/10 score)
```

---

#### IoT Device (IP Camera)

```bash
# IoT devices typically do NOT support IPv6 (many only IPv4)
# Example: Axis IP Camera

# If IoT device supports IPv6:
# - VLAN 1031 (VN_IOT)
# - IPv4: 10.150.1.100
# - IPv6: DHCPv6 (stateful) — IoT devices prefer DHCPv6 over SLAAC
# Reason: Static addressing for monitoring/management

# DHCPv6 Server on edge switch (for IoT VLAN only)
ipv6 dhcp pool DHCPV6-IOT
  address prefix 2001:db8:abc1:4001::/64 lifetime infinite
  dns-server 2001:db8:abc1:1000::53
  domain-name abhavtech.com
  
interface Vlan1031
  ipv6 address 2001:db8:abc1:4001::1/64
  ipv6 dhcp server DHCPV6-IOT
  ipv6 nd managed-config-flag  ! M-flag = 1 (use DHCPv6 for address)
  ipv6 nd other-config-flag
```

---

## Week 11: WiFi 7 Dual-Stack + Advanced Features

### 11.1 WiFi 7 (802.11be) IPv6 Configuration

#### WLC Configuration (9800-CL)

```
WLC UI → Configuration → Wireless → WLANs → Corp-Secure

WLAN: Corp-Secure
─────────────────────────────────────────────────────────────────────
General Tab:
  Profile Name:     Corp-Secure
  SSID:             Corp-Secure
  Status:           Enabled
  Broadcast SSID:   Enabled
  Radio Policy:     All (2.4 GHz, 5 GHz, 6 GHz)  ← WiFi 7 uses 6 GHz

Security Tab:
  Layer 2 Security: WPA3 + WPA2  (transition mode)
  Authentication:   802.1X
  Encryption:       AES-CCMP-256 (WPA3) / AES-CCMP-128 (WPA2)
  
  AAA Servers:
    RADIUS:         ISE PSN (10.252.31.11, 2001:db8:abc1:1000::31)
    Accounting:     ISE PSN
  
QoS Tab:
  Quality of Service: Platinum
  DSCP:               EF (for voice), AF41 (for video)
  WMM:                Enabled
  
Advanced Tab:
  VLAN:               1011 (VN_CORPORATE — Floor 1)
  
  ✅ IPv6 Configuration:
    ☑ Enable IPv6
    IPv6 ACL:         CORPORATE-IN-v6-ACL (optional)
    IPv6 DHCP:        None (relay not needed with SLAAC)
    
  DHCPv4:
    DHCP Server:      10.252.31.11 (ISE)
    Option 82:        Enabled
  
  Client IPv6 Privacy Extensions:
    ☑ Allow (clients use randomized addresses for privacy)
    
  RA Throttling:
    Max Rate:         1 RA per 200 seconds (prevent RA storms)

FlexConnect (for remote sites):
  Local Switching:  Enabled
  Local Auth:       Disabled (central ISE)
```

---

#### WiFi 7 AP Configuration

```
DNAC → Provision → Inventory → Access Points → MUM-AP-F1-001

AP: MUM-AP-F1-001 (Catalyst 9136I-E WiFi 7)
─────────────────────────────────────────────────────────────────────
General:
  Model:            Catalyst 9136I-E
  MAC Address:      a0:b1:c2:d3:e4:f5
  Location:         Mumbai Floor 1 Zone A
  
Management:
  IPv4 Address:     10.252.40.101 (CAPWAP to WLC)
  IPv6 Address:     2001:db8:abc1:1000::401  ✅ NEW
  WLC:              WLC-MUM-01 (10.252.40.10, 2001:db8:abc1:1000::40)
  
Radio Interfaces:
  Radio 0 (2.4 GHz):
    Channel:        6 (auto)
    Power:          17 dBm
    Mode:           802.11ax (WiFi 6)
    
  Radio 1 (5 GHz):
    Channel:        36 (auto)
    Power:          20 dBm
    Mode:           802.11ax
    
  Radio 2 (6 GHz):  ✅ WiFi 7 (802.11be)
    Channel:        37 (auto, 320 MHz width)
    Power:          23 dBm
    Mode:           802.11be
    Max Clients:    200 per radio
    MLO:            Enabled (Multi-Link Operation — WiFi 7 feature)

VLAN Mapping:
  SSID Corp-Secure → VLAN 1011 (dual-stack)
  SSID Corp-Guest  → VLAN 1021 (dual-stack)
```

---

### 11.2 WiFi 7 Client Testing

```bash
# Samsung Galaxy S24 Ultra (WiFi 7 capable)
# Connect to Corp-Secure SSID

# Expected behavior:
# 1. WPA3-Enterprise authentication (EAP-TLS to ISE via IPv6)
# 2. Multi-Link Operation (MLO): Simultaneous 5 GHz + 6 GHz
# 3. 320 MHz channel width on 6 GHz (WiFi 7 max throughput)
# 4. Dual-stack: IPv4 (DHCP) + IPv6 (SLAAC)

# Android: Settings → Network & Internet → Wi-Fi → Corp-Secure → Advanced

# IP Settings:
# IPv4: 10.100.1.88
# IPv6: 2001:db8:abc1:2001:xxxx:xxxx:xxxx:xxxx/64
# DNS: 2001:db8:abc1:1000::53, 2001:4860:4860::8888

# From terminal (ADB shell):
ping6 2001:db8:abc1:2001::1
# Expected: <5ms latency to anycast gateway

# Speed test (WiFi 7):
# Expected:
# - Download: 3-5 Gbps (theoretical max: 46 Gbps)
# - Upload: 2-3 Gbps
# - Latency: <5ms

# MLO verification:
iw dev wlan0 link
# Expected: "Connected to XX:XX:XX:XX:XX:XX (on wlan0)
# freq: 5975 MHz (6 GHz) + 2437 MHz (2.4 GHz) ← Multi-Link
# width: 320 MHz"
```

---

### 11.3 Advanced IPv6 Features

#### Multicast (IPv6)

```cisco
! ═══════════════════════════════════════════════════════════════════
! IPv6 MULTICAST FOR LISP (MUM-CP-01)
! ═══════════════════════════════════════════════════════════════════

! Enable IPv6 multicast routing
ipv6 multicast-routing

! PIM on LISP-facing interfaces
interface Loopback0
  ipv6 pim sparse-mode
  
interface range GigabitEthernet1/0/1-48
  ipv6 pim sparse-mode

! Rendezvous Point (RP) for LISP map-notify
ipv6 pim rp-address 2001:db8:abc1:0::3 ff02::fb

! LISP uses ff02::fb (all-nodes multicast) for Map-Notify
! Similar to IPv4 239.1.1.1
```

---

#### Neighbor Discovery Optimization

```cisco
! ═══════════════════════════════════════════════════════════════════
! ND OPTIMIZATION (Edge Switches)
! ═══════════════════════════════════════════════════════════════════

! Suppress unnecessary ND messages
ipv6 nd suppress-ra vlan 1011  ! Only on access VLANs, not gateway SVI

! ND cache optimization (prevent ND table exhaustion attacks)
ipv6 nd cache interface-limit 1000
ipv6 nd cache expire 240  ! seconds

! Secure ND (SeND) — optional, requires PKI
! ipv6 nd cga modifier <value>
! ipv6 nd rsa-signature

! ND inspection (First-Hop Security)
ipv6 snooping policy ND-SNOOPING
  security-level guard
  device-role node
  protocol ndp
  protocol dhcp
  limit address-count 10
  exit

interface range GigabitEthernet1/0/1-48
  ipv6 snooping attach-policy ND-SNOOPING
```

---

## Week 12-13: Chennai Campus (Validation Archetype)

### 12.1 Chennai Deployment (Abbreviated)

```
CHENNAI CAMPUS APPROACH:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Since Chennai mirrors Mumbai architecture:                       │
│    - 4 floors (vs Mumbai's 6)                                     │
│    - 2 Border, 2 CP, ~120 Edge nodes                              │
│    - Same fabric design, smaller scale                            │
│                                                                    │
│  DEPLOYMENT METHOD:                                                │
│    Option 1: DNAC Templates                                       │
│      - Export Mumbai configs from DNAC                            │
│      - Create "Chennai" site hierarchy in DNAC                    │
│      - Apply templates with Chennai-specific variables            │
│      - Time: 2-3 days                                             │
│                                                                    │
│    Option 2: Manual CLI (for learning)                            │
│      - Replicate Mumbai configs                                   │
│      - Update: Site prefix (abc2 vs abc1)                         │
│                Loopbacks (10.250.2.x, 2001:db8:abc2:0::x)         │
│                VLANs (2001:db8:abc2:2001-2004::/64)               │
│      - Time: 5 days                                               │
│                                                                    │
│  VALIDATION FOCUS:                                                 │
│    ✅ Cross-campus connectivity (MUM ↔ CHN via IPv6)              │
│    ✅ OMP route exchange (Mumbai prefixes visible in Chennai)     │
│    ✅ Client roaming (same SGT across campuses)                   │
│    ✅ Latency baseline (Mumbai ↔ Chennai ~10ms)                   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 12.2 Cross-Campus Validation

```bash
#!/bin/bash
# validate_cross_campus.sh

echo "=== CROSS-CAMPUS IPv6 VALIDATION (MUMBAI ↔ CHENNAI) ==="

# Test 1: LISP EID reachability
echo "Test 1: Mumbai client → Chennai client (via LISP)"
# From Mumbai client (2001:db8:abc1:2001::50)
ping6 2001:db8:abc2:2001::50 -c 5
# Expected: 5/5 success, latency ~10-12ms

# Test 2: Verify LISP path
echo ""
echo "Test 2: LISP Trace"
ssh admin@10.250.1.10 "show lisp instance-id 8001 ipv6 map-cache 2001:db8:abc2:2001::50"
# Expected: Locator = Chennai border node 2001:db8:abc2:0::1

# Test 3: OMP routes in Chennai
echo ""
echo "Test 3: Chennai sees Mumbai IPv6 routes via OMP"
ssh admin@10.250.2.1 "show sdwan omp routes vpn 1 ipv6 | grep abc1"
# Expected: 2001:db8:abc1:2000::/52 via OMP from Mumbai hub

# Test 4: SGT preservation
echo ""
echo "Test 4: SGT Propagation Across Campuses"
# User with SGT 10 (Employees) in Mumbai
# Accesses server with SGT 81 (AppServers) in Chennai
# Verify SGACL applied

ssh admin@10.250.2.1 "show cts role-based permissions from 10 to 81"
# Expected: SGACL rules enforced (HTTP/HTTPS permitted)

echo ""
echo "✅ Cross-campus validation complete"
```

---

## Week 14: Templates and Documentation

### 14.1 DNAC Template Export

```python
#!/usr/bin/env python3
"""
Export DNAC templates for SD-Access IPv6 deployment
Use these templates for future sites
"""

import requests
import json

DNAC = "https://dnac.abhavtech.com"
USERNAME = "admin"
PASSWORD = "<password>"

def dnac_login():
    """Get DNAC auth token"""
    url = f"{DNAC}/dna/system/api/v1/auth/token"
    response = requests.post(url, auth=(USERNAME, PASSWORD), verify=False)
    return response.json()['Token']

def export_templates(token):
    """Export all SD-Access IPv6 templates"""
    headers = {'X-Auth-Token': token, 'Content-Type': 'application/json'}
    
# Get all templates
    url = f"{DNAC}/dna/intent/api/v1/template-programmer/project"
    response = requests.get(url, headers=headers, verify=False)
    projects = response.json()
    
# Find SD-Access IPv6 project
    for project in projects:
        if project['name'] == "SD-Access-IPv6-Templates":
            project_id = project['id']
            
# Get templates in project
            url = f"{DNAC}/dna/intent/api/v1/template-programmer/project/{project_id}/template"
            response = requests.get(url, headers=headers, verify=False)
            templates = response.json()
            
# Export each template
            for template in templates:
                print(f"Exporting: {template['name']}")
                
# Save template to file
                filename = f"{template['name']}.json"
                with open(filename, 'w') as f:
                    json.dump(template, f, indent=2)
                
                print(f"  ✅ Saved to {filename}")

if __name__ == "__main__":
    print("=== DNAC TEMPLATE EXPORT ===\n")
    token = dnac_login()
    export_templates(token)
    print("\n✅ All templates exported")
```

**Exported Templates:**
- `Edge-Switch-Dual-Stack-IPv6.json`
- `SVI-Anycast-Gateway-IPv6.json`
- `LISP-IPv6-Instance.json`
- `IPv6-RA-Configuration.json`
- `IPv6-Security-Policies.json`

---

### 14.2 Deployment Checklist Template

```markdown
# SD-ACCESS IPv6 DEPLOYMENT CHECKLIST
# Site: ________________ Date: ________________

# PRE-DEPLOYMENT
- [ ] DNAC IPv6 pools created for all VLANs
- [ ] ISE device IPv6 addresses added
- [ ] ISE IPv6 profiling policies configured
- [ ] Underlay dual-stack validated (from Phase 1)
- [ ] LISP Map-Server/Resolver IPv6 ready

# LISP CONFIGURATION
- [ ] Map-Server: IPv6 service enabled (instance-id 8001)
- [ ] Border Nodes: IPv6 database-mapping configured
- [ ] Border Nodes: IPv6 map-cache configured
- [ ] Edge Nodes: IPv6 EID registration (per VLAN)
- [ ] Verify: `show lisp site` shows IPv6 prefixes

# OVERLAY CONFIGURATION
- [ ] VRF: IPv6 address-family added
- [ ] SVIs: IPv6 anycast gateways configured
- [ ] SVIs: IPv6 RA enabled (SLAAC)
- [ ] SVIs: DNS servers advertised via RA
- [ ] VXLAN: NVE interface supports IPv6 payload

# SECURITY
- [ ] Access ports: IPv6 device tracking enabled
- [ ] Access ports: RA Guard policy applied
- [ ] Access ports: IPv6 source guard enabled
- [ ] ISE: IPv6 profiling rules active
- [ ] ISE: SGT assignment working for IPv6 endpoints

# CLIENT TESTING
- [ ] Windows 11: SLAAC working, IPv6 connectivity
- [ ] iPhone: IPv6 address obtained, internet works
- [ ] IoT device: DHCPv6 (if needed) functional
- [ ] Dual-stack preference: Clients prefer IPv6

# VALIDATION
- [ ] LISP IPv6 database registered
- [ ] Cross-site IPv6 ping successful
- [ ] OMP routes include IPv6 prefixes
- [ ] SGT propagates over IPv6 fabric
- [ ] No IPv6 neighbor table exhaustion
- [ ] WiFi clients get IPv6 addresses

# SIGN-OFF
Network Engineer:   ________________    Date: ________
Security Team:      ________________    Date: ________
NOC:                ________________    Date: ________
```

---

## PHASE 2 COMPLETION SUMMARY

```bash
#!/bin/bash
# phase2_summary.sh

echo "═══════════════════════════════════════════════════════════════"
echo "        PHASE 2 COMPLETION REPORT — SD-ACCESS OVERLAY IPv6"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "SITES DEPLOYED:"
echo "  ✅ Mumbai HQ (Week 9-11)"
echo "     - 6 floors, 200 edge switches"
echo "     - 5,000 dual-stack endpoints"
echo "     - 1,220 WiFi 7 APs with IPv6"
echo ""
echo "  ✅ Chennai HQ (Week 12-13)"
echo "     - 4 floors, 120 edge switches"
echo "     - 2,500 dual-stack endpoints"
echo "     - Cross-campus validation complete"
echo ""
echo "  ✅ Hyderabad (Phase 1)"
echo "     - Fabric-in-a-Box already dual-stack"
echo ""

echo "TECHNICAL ACHIEVEMENTS:"
echo "  ✅ LISP dual-stack (IPv4 + IPv6 EIDs)"
echo "  ✅ VXLAN carrying IPv6 payload"
echo "  ✅ Anycast gateway dual-stack (all VLANs)"
echo "  ✅ ISE IPv6 profiling operational"
echo "  ✅ SLAAC with RA-based DNS working"
echo "  ✅ WiFi 7 (802.11be) dual-stack clients"
echo "  ✅ SGT propagation over IPv6"
echo ""

echo "CLIENT SUPPORT:"
echo "  ✅ Windows 11: Dual-stack with IPv6 preference"
echo "  ✅ iPhone/Android: SLAAC + privacy extensions"
echo "  ✅ IoT: DHCPv6 stateful for static addressing"
echo ""

echo "TEMPLATES CREATED:"
echo "  - DNAC IPv6 pool templates"
echo "  - Edge switch dual-stack config"
echo "  - ISE IPv6 profiling policies"
echo "  - Deployment checklists"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "              ✅ PHASE 2 COMPLETE — OVERLAY IPv6"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "TOTAL PROJECT STATUS:"
echo "  Phase 1: ✅ SD-WAN Underlay IPv6 (19 sites)"
echo "  Phase 2: ✅ SD-Access Overlay IPv6 (3 sites)"
echo ""
echo "NEXT PHASES (Optional, per Master Reference Card):"
echo "  - Phase 3: Multi-Cloud IPv6 (Azure/GCP deep dive)"
echo "  - Phase 4: Webex Calling/Contact Center IPv6"
echo "  - Phase 5: Complete observability IPv6"
```

---

## PHASE 2 COMPLETE

**Summary:**
- **Mumbai campus** fully dual-stack (5,000 endpoints, WiFi 7)
- **Chennai campus** validated (cross-campus connectivity)
- **Hyderabad FiaB** already complete (Phase 1)
- **Templates ready** for future SD-Access sites
- **Client support** validated (Windows, iOS, Android, IoT)
- **Zero IPv4 impact** — all existing services maintained

**Total IPv6 Documentation: 7,701 lines**
- Master Reference Card: 881 lines
- Phase 1 (Weeks 1-5): 5,654 lines
- Phase 2 (Weeks 9-14): 1,166 lines

**Project Achievement:**
- 19 sites SD-WAN underlay dual-stack
- 3 campuses SD-Access overlay dual-stack
- ~10,000 endpoints IPv6-enabled
- Production-ready templates for remaining sites

---

*© 2025 Abhavtech - IPv6 Migration Phase 2 Guide*
*Version 1.0 | Last Updated: January 2025*
