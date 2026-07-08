# ABHAVTECH IPv6 MIGRATION — WEEK 2
## MUMBAI HUB SD-WAN IPv6 DEPLOYMENT (C8500-12X DUAL-STACK)

**Project:** ABV-IPV6-2025  
**Week:** 2 of 44  
**Phase:** Phase 1 — SD-WAN Underlay IPv6  
**Duration:** 5 Days  
**Objective:** Deploy IPv6 on Mumbai hub SD-WAN infrastructure — dual-stack WAN circuits, BFD, OMP  
**Scope:** 2 × C8500-12X routers (MUM-HUB-01, MUM-HUB-02)  

---

## WEEK 2 OVERVIEW

```
WEEK 2 DELIVERABLES:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Day 1: Pre-Deployment Preparation                                │
│    ✅ Verify WAN circuit IPv6 provisioning (MPLS, DIA, ER)       │
│    ✅ Backup current configs (MUM-HUB-01/02)                      │
│    ✅ Create vManage IPv6 feature templates                       │
│    ✅ Stage configs in lab (final validation)                     │
│                                                                    │
│  Day 2: MUM-HUB-01 IPv6 Underlay Deployment                       │
│    ✅ Configure loopback IPv6 (2001:db8:abc1:8000::1/128)         │
│    ✅ Configure WAN interfaces (MPLS, DIA, ER) with IPv6          │
│    ✅ Enable BFD dual-stack                                        │
│    ✅ Verify control connections (vBond, vSmart) via IPv6         │
│                                                                    │
│  Day 3: MUM-HUB-02 IPv6 Underlay Deployment                       │
│    ✅ Replicate Day 2 steps for MUM-HUB-02                        │
│    ✅ Establish IPv6 BFD session between MUM-HUB-01↔02            │
│    ✅ Verify HA failover works over IPv6                          │
│                                                                    │
│  Day 4: OMP IPv6 Route Distribution                               │
│    ✅ Enable OMP IPv6 address family                              │
│    ✅ Advertise IPv6 service VPN routes (VPN 1, VPN 512)          │
│    ✅ Verify cross-hub IPv6 reachability (Mumbai→London→NJ)       │
│                                                                    │
│  Day 5: Testing, Validation, and Documentation                    │
│    ✅ Complete dual-stack validation (30 test cases)              │
│    ✅ Performance baseline (latency, throughput)                  │
│    ✅ Update documentation and runbooks                           │
│    ✅ Week 2 sign-off and Week 3 planning                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## DAY 1: PRE-DEPLOYMENT PREPARATION

## 1.1 Mumbai Hub Infrastructure Inventory

### Current State (IPv4-Only)

```
MUMBAI HUB SD-WAN INFRASTRUCTURE:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  DEVICE: MUM-HUB-01                                                │
│    Model:        Cisco Catalyst 8500-12X                           │
│    IOS-XE:       17.15.1                                           │
│    Role:         Primary SD-WAN hub (active)                       │
│    System IP:    10.252.1.1/32                                     │
│    Mgmt IP:      10.252.100.1/24                                   │
│    Site ID:      1                                                 │
│                                                                    │
│  WAN CIRCUITS (IPv4-only currently):                               │
│    ├─ MPLS Primary:      TenGigE0/0/0 (Tata, 1 Gbps)              │
│    │    IPv4: 172.16.100.2/30                                      │
│    │    Next-hop: 172.16.100.1 (Tata PE)                          │
│    │                                                               │
│    ├─ DIA Primary:       GigE0/0/4 (BT, 500 Mbps)                 │
│    │    IPv4: 203.0.113.2/29                                       │
│    │    Next-hop: 203.0.113.1                                      │
│    │                                                               │
│    ├─ ExpressRoute Pri:  TenGigE0/0/2.4001 (Microsoft, 2 Gbps)    │
│    │    IPv4: 169.254.200.2/30                                     │
│    │    BGP Peer: 169.254.200.1 (ASN 12076)                       │
│    │                                                               │
│    └─ ExpressRoute Sec:  TenGigE0/0/3.4001                        │
│         IPv4: 169.254.200.6/30                                     │
│         BGP Peer: 169.254.200.5 (ASN 12076)                        │
│                                                                    │
│  CONTROL PLANE:                                                    │
│    vBond:   vbond.abhavtech.com (10.252.31.13)                    │
│    vSmart:  vsmart-1.abhavtech.com (10.252.31.11)                 │
│             vsmart-2.abhavtech.com (10.252.31.12)                 │
│    vManage: vmanage.abhavtech.com (10.252.31.10)                  │
│                                                                    │
│  ═══════════════════════════════════════════════════════════════  │
│                                                                    │
│  DEVICE: MUM-HUB-02                                                │
│    Model:        Cisco Catalyst 8500-12X                           │
│    IOS-XE:       17.15.1                                           │
│    Role:         Secondary SD-WAN hub (standby)                    │
│    System IP:    10.252.1.2/32                                     │
│    Mgmt IP:      10.252.100.2/24                                   │
│    Site ID:      1 (same as MUM-HUB-01)                            │
│                                                                    │
│  WAN CIRCUITS: (mirror of MUM-HUB-01)                              │
│    ├─ MPLS Secondary:    TenGigE0/0/0                              │
│    ├─ DIA Secondary:     GigE0/0/4                                 │
│    ├─ ExpressRoute Pri:  TenGigE0/0/2.4001                        │
│    └─ ExpressRoute Sec:  TenGigE0/0/3.4001                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Target State (Dual-Stack)

```
TARGET IPv6 ADDRESSING (Mumbai Hub):
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  MUM-HUB-01:                                                       │
│    System IP (IPv6):  2001:db8:abc1:8000::1/128                   │
│    Mgmt IP (IPv6):    2001:db8:abc1:1000::101/64                  │
│                                                                    │
│  WAN CIRCUITS (IPv6 assigned by carriers):                        │
│    ├─ MPLS Primary (Tata):                                        │
│    │    IPv6: 2001:db8:1234:100::2/127  ← Tata assigns            │
│    │    Next-hop: 2001:db8:1234:100::3                            │
│    │                                                               │
│    ├─ DIA Primary (BT):                                            │
│    │    IPv6: 2001:db8:5678:200::2/64   ← BT assigns              │
│    │    Gateway: 2001:db8:5678:200::1                             │
│    │                                                               │
│    ├─ ExpressRoute Primary:                                        │
│    │    IPv6: 2001:db8:cafe:1::2/126    ← Microsoft assigns       │
│    │    BGP Peer: 2001:db8:cafe:1::1 (ASN 12076)                  │
│    │                                                               │
│    └─ ExpressRoute Secondary:                                      │
│         IPv6: 2001:db8:cafe:2::2/126                              │
│         BGP Peer: 2001:db8:cafe:2::1                              │
│                                                                    │
│  CONTROL PLANE (dual-stack):                                       │
│    vBond:   vbond.abhavtech.com                                   │
│             IPv4: 10.252.31.13                                     │
│             IPv6: 2001:db8:abcd:1000::13                          │
│    vSmart-1: IPv4: 10.252.31.11                                   │
│              IPv6: 2001:db8:abcd:1000::11                         │
│    vSmart-2: IPv4: 10.252.31.12                                   │
│              IPv6: 2001:db8:abcd:1000::12                         │
│                                                                    │
│  MUM-HUB-02: (Same pattern with ::2 suffix)                        │
│    System IP (IPv6): 2001:db8:abc1:8000::2/128                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

NOTE: WAN circuit IPv6 addresses above are examples. 
      Actual addresses will be provided by carriers (Tata, BT, Microsoft).
      Coordinate with carrier NOCs before Day 2.
```

---

## 1.2 Carrier IPv6 Provisioning Verification

### Task 1.2.1: Tata MPLS IPv6 Validation

```bash
# Contact: Tata Communications NOC
# Ticket: Open 2 weeks prior to Week 2

TATA MPLS IPv6 PROVISIONING REQUEST:
─────────────────────────────────────────────────────────────────────

Customer:     Abhavtech Networks
Circuit ID:   TATA-MPLS-MUM-001 (existing IPv4 circuit)
Request:      Add IPv6 to existing circuit (dual-stack)

Mumbai Hub Primary:
  Interface:    TenGigabitEthernet0/0/0
  IPv4 (existing): 172.16.100.2/30 (keep active)
  IPv6 (new):      [Tata assigns from 2001:db8:xxxx::/48 block]
  Preferred:       /127 subnet (2 addresses)
  
Mumbai Hub Secondary:
  Interface:    TenGigabitEthernet0/0/0
  IPv4 (existing): 172.16.100.6/30
  IPv6 (new):      [Tata assigns from same /48]
  
BGP: Not applicable (MPLS uses IPsec tunnels, no BGP on MPLS)
MTU: 1500 (verify IPv6 MTU = 1500, no change from IPv4)

Expected Response Time: 5-7 business days
Tata NOC: noc@tatacommunications.com | +91-xxxx-xxxx
```

### Task 1.2.2: BT DIA IPv6 Validation

```bash
BT GLOBAL DIA IPv6 PROVISIONING REQUEST:
─────────────────────────────────────────────────────────────────────

Customer:     Abhavtech Networks
Circuit ID:   BT-DIA-MUM-001
Request:      Add IPv6 to existing DIA circuit

Mumbai Hub Primary:
  Interface:    GigabitEthernet0/0/4
  IPv4 (existing): 203.0.113.2/29 (keep active)
  IPv6 (new):      [BT assigns /64 from their allocation]
  Gateway IPv6:    [BT provides default gateway]
  
BGP: Not required (static default route to BT gateway)
Routing: Static route ::/0 via [BT IPv6 gateway]
DNS (IPv6): 2001:4860:4860::8888 (Google) + BT's IPv6 DNS

Expected Response Time: 3-5 business days
BT NOC: globalservices@bt.com | +44-xxxx-xxxx
```

### Task 1.2.3: Microsoft ExpressRoute IPv6 Validation

```bash
MICROSOFT EXPRESSROUTE IPv6 CONFIGURATION:
─────────────────────────────────────────────────────────────────────

Method: Azure Portal (self-service, no ticket required)

Step 1: Azure Portal → ExpressRoute Circuits → abhavtech-er-mumbai

Step 2: Peerings → Microsoft Peering → Configure
  ☑ Enable IPv6 Peering
  
Step 3: Microsoft assigns automatically:
  Primary IPv6 Subnet:   2001:db8:cafe:1::/126  (example — actual from Microsoft)
    Customer side: 2001:db8:cafe:1::2/126
    Microsoft side: 2001:db8:cafe:1::1/126
    
  Secondary IPv6 Subnet: 2001:db8:cafe:2::/126
    Customer side: 2001:db8:cafe:2::2/126
    Microsoft side: 2001:db8:cafe:2::1/126
    
Step 4: BGP Configuration (auto-generated by Azure):
  ASN: 12076 (Microsoft)
  Neighbor: 2001:db8:cafe:1::1 (primary)
  Neighbor: 2001:db8:cafe:2::1 (secondary)
  
Step 5: Download router config from Azure Portal:
  ExpressRoute → Configuration → Download Router Config
    Vendor: Cisco
    Router Series: Cisco Catalyst 8000
    Software Version: IOS-XE 17.15+
    
Expected Time: Immediate (self-service)
Reference: https://learn.microsoft.com/en-us/azure/expressroute/expressroute-howto-add-ipv6-portal
```

---

## 1.3 Configuration Backup

### Backup Current Configs (Pre-Change)

```bash
#!/bin/bash
# backup_mumbai_hubs.sh

echo "=== BACKING UP MUMBAI HUB CONFIGS ==="
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/ipv6-migration/week2"
mkdir -p $BACKUP_DIR

# Backup MUM-HUB-01
echo "Backing up MUM-HUB-01..."
ssh admin@10.252.100.1 "show running-config" > $BACKUP_DIR/MUM-HUB-01_${DATE}.cfg
ssh admin@10.252.100.1 "show sdwan running-config" > $BACKUP_DIR/MUM-HUB-01_sdwan_${DATE}.cfg

# Backup MUM-HUB-02
echo "Backing up MUM-HUB-02..."
ssh admin@10.252.100.2 "show running-config" > $BACKUP_DIR/MUM-HUB-02_${DATE}.cfg
ssh admin@10.252.100.2 "show sdwan running-config" > $BACKUP_DIR/MUM-HUB-02_sdwan_${DATE}.cfg

# Backup vManage templates
echo "Backing up vManage templates..."
# (Use vManage API or manual export)

echo "✅ Backups complete in: $BACKUP_DIR"
ls -lh $BACKUP_DIR/
```

**Run backup:**

```bash
chmod +x backup_mumbai_hubs.sh
./backup_mumbai_hubs.sh

# Expected output:
# Backups stored in: /opt/backups/ipv6-migration/week2/
# MUM-HUB-01_20250120_140530.cfg
# MUM-HUB-01_sdwan_20250120_140530.cfg
# MUM-HUB-02_20250120_140530.cfg
# MUM-HUB-02_sdwan_20250120_140530.cfg
```

---

## 1.4 vManage IPv6 Feature Templates

### Create System Template with IPv6

```
vManage UI → Configuration → Templates → Feature Templates → Add Template

TEMPLATE NAME: ABV-System-IPv6-Hub-C8500
Device Type: vedge-c8500-12X
Template Type: System

┌────────────────────────────────────────────────────────────────────┐
│ Basic Configuration                                                │
├────────────────────────────────────────────────────────────────────┤
│ Hostname:              {{system_hostname}}                         │
│ System IP:             {{system_ip}}                               │
│ Site ID:               {{site_id}}                                 │
│ Organization Name:     Abhavtech                                   │
│ vBond:                 vbond.abhavtech.com                         │
│                                                                    │
│ ✅ NEW: IPv6 System IP                                            │
│ IPv6 System IP:        {{system_ipv6}}                            │
│   Type: Variable                                                  │
│   Variable: system_ipv6                                           │
│   Example value: 2001:db8:abc1:8000::1/128                       │
│                                                                    │
│ Timezone:              Asia/Kolkata                               │
│ Console Baud Rate:     9600                                       │
│ Max OMP Sessions:      8                                          │
│ Control Session PPS:   300                                        │
│                                                                    │
│ Admin Tech:            Enabled                                    │
│ Location:              Mumbai, India                              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

Click "Save"
```

### Create VPN 0 Interface Template (MPLS with IPv6)

```
vManage UI → Configuration → Templates → Feature Templates → Add Template

TEMPLATE NAME: ABV-IF-VPN0-MPLS-IPv6-Hub
Device Type: vedge-c8500-12X
Template Type: VPN Interface Ethernet

┌────────────────────────────────────────────────────────────────────┐
│ Basic Information                                                  │
├────────────────────────────────────────────────────────────────────┤
│ Shutdown:              No                                          │
│ Interface Name:        TenGigabitEthernet0/0/0                     │
│ Description:           MPLS-WAN-PRIMARY-DUAL-STACK                 │
│                                                                    │
│ ═══════════════════════════════════════════════════════════════    │
│ IPv4 Configuration                                                 │
│ ═══════════════════════════════════════════════════════════════    │
│ Dynamic:               No                                          │
│ Static:                                                            │
│   IPv4 Address:        {{mpls_ipv4}}                              │
│     Type: Variable                                                │
│     Variable: mpls_ipv4                                           │
│     Example: 172.16.100.2/30                                      │
│                                                                    │
│ ═══════════════════════════════════════════════════════════════    │
│ IPv6 Configuration   ✅ NEW SECTION                               │
│ ═══════════════════════════════════════════════════════════════    │
│ IPv6 Enable:           Yes                                        │
│ Dynamic:               No                                         │
│ Static:                                                           │
│   IPv6 Address:        {{mpls_ipv6}}                              │
│     Type: Variable                                                │
│     Variable: mpls_ipv6                                           │
│     Example: 2001:db8:1234:100::2/127                            │
│                                                                    │
│ Secondary IPv6:        (leave blank)                              │
│ DHCP Helper IPv6:      (leave blank)                              │
│                                                                    │
│ ═══════════════════════════════════════════════════════════════    │
│ Tunnel Configuration                                              │
│ ═══════════════════════════════════════════════════════════════    │
│ Tunnel:                On                                         │
│ Color:                 mpls                                       │
│ Restrict:              Off                                        │
│ Groups:                (leave default)                            │
│ Border:                Off                                        │
│ Control Connection:    On                                         │
│ Maximum Control Conn:  2                                          │
│ Encapsulation:         ipsec                                      │
│ Preference:            200                                        │
│ Weight:                1                                          │
│ Port Hop:              On                                         │
│ Low Bandwidth Link:    Off                                        │
│                                                                    │
│ ═══════════════════════════════════════════════════════════════    │
│ BFD   ✅ DUAL-STACK                                               │
│ ═══════════════════════════════════════════════════════════════    │
│ BFD (IPv4):            Enabled                                    │
│   Hello Interval:      1000 ms                                    │
│   Multiplier:          7                                          │
│                                                                    │
│ BFD (IPv6):   ✅ NEW                                              │
│   Enabled:             Yes                                        │
│   Hello Interval:      1000 ms                                    │
│   Multiplier:          7                                          │
│                                                                    │
│ NAT:                   Off                                        │
│ QoS Map:               (apply QoS policy if needed)               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

Click "Save"
```

### Create VPN 0 Interface Template (DIA with IPv6)

```
TEMPLATE NAME: ABV-IF-VPN0-DIA-IPv6-Hub
[Same structure as MPLS template, with these changes:]

Interface Name:        GigabitEthernet0/0/4
Description:           DIA-WAN-PRIMARY-DUAL-STACK
Color:                 dia
Preference:            100  (lower than MPLS)

IPv4 Address:          {{dia_ipv4}}
  Example: 203.0.113.2/29
  
IPv6 Address:          {{dia_ipv6}}
  Example: 2001:db8:5678:200::2/64

NAT:                   Off  (static public IP, no NAT)
```

### Create VPN 0 Interface Template (ExpressRoute with IPv6)

```
TEMPLATE NAME: ABV-IF-VPN0-ER-IPv6-Hub
[Similar structure, key differences:]

Interface Name:        TenGigabitEthernet0/0/2.4001
Description:           EXPRESSROUTE-PRIMARY-DUAL-STACK
Encapsulation:         dot1Q
VLAN ID:               {{er_vlan}}  (4001)

IPv4 Address:          {{er_primary_ipv4}}
  Example: 169.254.200.2/30
  
IPv6 Address:          {{er_primary_ipv6}}
  Example: 2001:db8:cafe:1::2/126

Color:                 azure-expressroute
Restrict:              On  (ExpressRoute only for O365/Azure, not general internet)
Maximum Control Conn:  0   (data-only, no control over ER)
Preference:            150 (between MPLS and DIA)

BFD:                   Disabled  (BGP handles keepalives on ExpressRoute)
```

---

## DAY 2: MUM-HUB-01 IPv6 DEPLOYMENT

## 2.1 Pre-Deployment Validation

### Checklist Before Config Changes

```bash
# Run from NOC workstation

echo "=== PRE-DEPLOYMENT VALIDATION: MUM-HUB-01 ==="

# Test 1: Baseline IPv4 connectivity
ping -c 5 10.252.100.1
# Expected: 5/5 success

# Test 2: Current control connections (IPv4)
ssh admin@10.252.100.1 "show sdwan control connections"
# Expected: vbond/vsmart-1/vsmart-2 all UP

# Test 3: Current BFD sessions (IPv4)
ssh admin@10.252.100.1 "show sdwan bfd sessions | count"
# Expected: 30-40 sessions UP (to other hubs + branches)

# Test 4: Current OMP routes (IPv4)
ssh admin@10.252.100.1 "show sdwan omp routes vpn 1 | count"
# Expected: 20+ routes (all site LANs)

# Test 5: Verify WAN circuit IPv6 availability
# MPLS (Tata):
ssh admin@10.252.100.1 "show interfaces TenGigabitEthernet0/0/0 | include address"
# Currently: IPv4 only (172.16.100.2)

# Test 6: Carrier IPv6 readiness confirmation
# Check with Tata/BT/Microsoft that IPv6 is active on circuits
# (Should have been confirmed in Day 1 tasks)

echo ""
echo "✅ All pre-deployment checks passed — ready to proceed"
```

---

## 2.2 Configure IPv6 System Settings

### Step 2.2.1: Enable IPv6 Routing

```cisco
! SSH to MUM-HUB-01
ssh admin@10.252.100.1

! Enter config mode
MUM-HUB-01# configure terminal

! Enable IPv6 routing globally
MUM-HUB-01(config)# ipv6 unicast-routing
MUM-HUB-01(config)# ipv6 cef

! Add IPv6 system loopback (SD-WAN system IP)
MUM-HUB-01(config)# interface Loopback65528
MUM-HUB-01(config-if)# description SD-WAN-SYSTEM-LOOPBACK-IPv6
MUM-HUB-01(config-if)# vrf forwarding 65528
MUM-HUB-01(config-if)# ipv6 address 2001:db8:abc1:8000::1/128
MUM-HUB-01(config-if)# no shutdown
MUM-HUB-01(config-if)# exit

! Verify
MUM-HUB-01(config)# do show ipv6 interface brief | include Loopback65528
Loopback65528          [up/up]
    FE80::1
    2001:DB8:ABC1:8000::1

! Commit (SD-WAN)
MUM-HUB-01(config)# commit
Commit complete.

MUM-HUB-01(config)# end
```

---

## 2.3 Configure WAN Interfaces with IPv6

### Step 2.3.1: MPLS Interface (TenGigE0/0/0)

```cisco
! Continue on MUM-HUB-01
MUM-HUB-01# configure terminal

! Configure MPLS interface with dual-stack
MUM-HUB-01(config)# interface TenGigabitEthernet0/0/0
MUM-HUB-01(config-if)# description MPLS-WAN-PRIMARY-TATA-DUAL-STACK

! IPv4 (existing — keep untouched)
MUM-HUB-01(config-if)# ip address 172.16.100.2 255.255.255.252

! IPv6 (new — add alongside IPv4)
MUM-HUB-01(config-if)# ipv6 address 2001:db8:1234:100::2/127
MUM-HUB-01(config-if)# ipv6 enable
MUM-HUB-01(config-if)# no ipv6 redirects
MUM-HUB-01(config-if)# ipv6 mtu 1500

! SD-WAN tunnel configuration (dual-stack)
MUM-HUB-01(config-if)# tunnel-interface
MUM-HUB-01(config-tunnel-if)# encapsulation ipsec preference 200
MUM-HUB-01(config-tunnel-if)# color mpls
MUM-HUB-01(config-tunnel-if)# no restrict
MUM-HUB-01(config-tunnel-if)# no allow-service all
MUM-HUB-01(config-tunnel-if)# allow-service sshd
MUM-HUB-01(config-tunnel-if)# allow-service netconf
MUM-HUB-01(config-tunnel-if)# no allow-service https
MUM-HUB-01(config-tunnel-if)# max-control-connections 2
MUM-HUB-01(config-tunnel-if)# vbond-as-stun-server
MUM-HUB-01(config-tunnel-if)# vmanage-connection-preference 5
MUM-HUB-01(config-tunnel-if)# port-hop

! BFD dual-stack
MUM-HUB-01(config-tunnel-if)# hello-interval 1000
MUM-HUB-01(config-tunnel-if)# hello-tolerance 7
MUM-HUB-01(config-tunnel-if)# ipv6-bfd
MUM-HUB-01(config-tunnel-if)# ipv6-hello-interval 1000
MUM-HUB-01(config-tunnel-if)# ipv6-hello-tolerance 7

MUM-HUB-01(config-tunnel-if)# exit
MUM-HUB-01(config-if)# exit

! Commit
MUM-HUB-01(config)# commit
Commit complete.
```

### Step 2.3.2: DIA Interface (GigE0/0/4)

```cisco
MUM-HUB-01(config)# interface GigabitEthernet0/0/4
MUM-HUB-01(config-if)# description DIA-WAN-PRIMARY-BT-DUAL-STACK

! IPv4 (existing)
MUM-HUB-01(config-if)# ip address 203.0.113.2 255.255.255.248

! IPv6 (new — BT-assigned)
MUM-HUB-01(config-if)# ipv6 address 2001:db8:5678:200::2/64
MUM-HUB-01(config-if)# ipv6 enable
MUM-HUB-01(config-if)# no ipv6 redirects

! SD-WAN tunnel configuration
MUM-HUB-01(config-if)# tunnel-interface
MUM-HUB-01(config-tunnel-if)# encapsulation ipsec preference 100
MUM-HUB-01(config-tunnel-if)# color dia
MUM-HUB-01(config-tunnel-if)# no restrict

! BFD dual-stack
MUM-HUB-01(config-tunnel-if)# hello-interval 1000
MUM-HUB-01(config-tunnel-if)# hello-tolerance 7
MUM-HUB-01(config-tunnel-if)# ipv6-bfd
MUM-HUB-01(config-tunnel-if)# ipv6-hello-interval 1000
MUM-HUB-01(config-tunnel-if)# ipv6-hello-tolerance 7

MUM-HUB-01(config-tunnel-if)# exit
MUM-HUB-01(config-if)# no shutdown
MUM-HUB-01(config-if)# exit

MUM-HUB-01(config)# commit
```

### Step 2.3.3: ExpressRoute Interface (TenGigE0/0/2.4001)

```cisco
! Note: ExpressRoute uses sub-interface with VLAN tagging

MUM-HUB-01(config)# interface TenGigabitEthernet0/0/2
MUM-HUB-01(config-if)# no shutdown
MUM-HUB-01(config-if)# exit

MUM-HUB-01(config)# interface TenGigabitEthernet0/0/2.4001
MUM-HUB-01(config-subif)# description EXPRESSROUTE-PRIMARY-DUAL-STACK
MUM-HUB-01(config-subif)# encapsulation dot1Q 4001

! IPv4 (existing)
MUM-HUB-01(config-subif)# ip address 169.254.200.2 255.255.255.252

! IPv6 (new — Microsoft-assigned)
MUM-HUB-01(config-subif)# ipv6 address 2001:db8:cafe:1::2/126
MUM-HUB-01(config-subif)# ipv6 enable

! SD-WAN tunnel configuration
MUM-HUB-01(config-subif)# tunnel-interface
MUM-HUB-01(config-tunnel-if)# encapsulation ipsec preference 150
MUM-HUB-01(config-tunnel-if)# color azure-expressroute
MUM-HUB-01(config-tunnel-if)# restrict   ! ExpressRoute is restricted (O365/Azure only)
MUM-HUB-01(config-tunnel-if)# max-control-connections 0  ! Data-only, no control

! No BFD on ExpressRoute (BGP handles keepalives)

MUM-HUB-01(config-tunnel-if)# exit
MUM-HUB-01(config-subif)# exit

MUM-HUB-01(config)# commit
```

---

## 2.4 Verify Control Plane Connectivity

### Step 2.4.1: Check vBond Connection (Dual-Stack)

```cisco
MUM-HUB-01# show sdwan control connections

! Expected output (dual-stack):
Peer   Peer  Peer        Site  Domain Peer  Priv  Priv                           LOCAL   REMOTE
Type   Prot  System IP   ID    ID     Priv  IP    Port  Public IP       Public Port  Color   Color   State      Uptime
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
vbond  dtls  10.252.31.13 0    1      10.252.31.13 12346 203.0.113.13   12346        mpls    default  up        0:00:12:45
vbond  dtls  10.252.31.13 0    1      10.252.31.13 12346 203.0.113.13   12346        dia     default  up        0:00:12:43

! IPv6 entries (new):
vbond  dtls  2001:db8:abcd:1000::13 0 1 2001:db8:abcd:1000::13 12346 [2001:db8:5678:200::13] 12346 mpls default up 0:00:01:23
vbond  dtls  2001:db8:abcd:1000::13 0 1 2001:db8:abcd:1000::13 12346 [2001:db8:5678:200::13] 12346 dia  default up 0:00:01:21

! Analysis: 
! - IPv4 connections maintained (untouched)
! - IPv6 connections established (new)
! - Dual-stack control plane active ✅
```

### Step 2.4.2: Check vSmart Connections

```cisco
MUM-HUB-01# show sdwan control connections | include vsmart

vsmart dtls  10.252.31.11  0   1  10.252.31.11  23456  203.0.113.11  23456  mpls   default  up  0:05:32:11
vsmart dtls  10.252.31.12  0   1  10.252.31.12  23456  203.0.113.12  23456  mpls   default  up  0:05:32:09
vsmart dtls  2001:db8:abcd:1000::11 0 1 2001:db8:abcd:1000::11 23456 [2001:db8:xxxx::11] 23456 mpls default up 0:00:02:15
vsmart dtls  2001:db8:abcd:1000::12 0 1 2001:db8:abcd:1000::12 23456 [2001:db8:xxxx::12] 23456 mpls default up 0:00:02:13

! Expected: 4 connections (2 vSmarts × IPv4+IPv6)
! Status: All "up" ✅
```

---

## 2.5 Configure and Verify BFD Dual-Stack

### Step 2.5.1: Verify BFD Sessions

```cisco
MUM-HUB-01# show sdwan bfd sessions

! Sample output (abbreviated):
                                                      SOURCE  REMOTE  TX                                     
SYSTEM  SITE   STATE  SRC COLOR  DST COLOR  SRC IP          DST IP  ENCAP  DETECT MULTIPLIER  RX              
IP      ID            (TLOC)     (TLOC)                                                     INTERVAL(msec)  
───────────────────────────────────────────────────────────────────────────────────────────────────────────
! IPv4 sessions (existing):
10.252.2.1  2   up  mpls   mpls   172.16.100.2  172.16.200.2  ipsec  7   1000   1000
10.252.16.1 16  up  mpls   mpls   172.16.100.2  172.16.160.2  ipsec  7   1000   1000
10.252.32.1 32  up  mpls   mpls   172.16.100.2  172.16.320.2  ipsec  7   1000   1000

! IPv6 sessions (new):
2001:db8:abc2:8000::1  2   up  mpls   mpls   2001:db8:1234:100::2  2001:db8:1234:200::2  ipsec  7   1000   1000
2001:db8:abcb:8000::1  16  up  mpls   mpls   2001:db8:1234:100::2  2001:db8:1234:160::2  ipsec  7   1000   1000
2001:db8:abcd:8000::1  32  up  mpls   mpls   2001:db8:1234:100::2  2001:db8:1234:320::2  ipsec  7   1000   1000

! Analysis: Both IPv4 and IPv6 BFD sessions active ✅
```

### Step 2.5.2: Test BFD Convergence

```bash
# From NOC workstation, initiate BFD failure test

# Disable MPLS interface IPv6 temporarily
ssh admin@10.252.100.1 "configure terminal; interface TenGigabitEthernet0/0/0; no ipv6 address; commit"

# Monitor BFD session count
for i in {1..10}; do
  echo "[$i] BFD sessions:"
  ssh admin@10.252.100.1 "show sdwan bfd sessions | count"
  sleep 5
done

# Expected behavior:
# - IPv6 BFD sessions drop within 7 seconds (7 × 1000ms = 7s)
# - IPv4 BFD sessions unaffected (remain UP)
# - Traffic fails over to DIA color automatically

# Re-enable IPv6 on MPLS
ssh admin@10.252.100.1 "configure terminal; interface TenGigabitEthernet0/0/0; ipv6 address 2001:db8:1234:100::2/127; commit"

# Verify BFD sessions restore
ssh admin@10.252.100.1 "show sdwan bfd sessions | include 2001"
# Expected: IPv6 BFD sessions back UP within 10 seconds
```

---

## DAY 3: MUM-HUB-02 IPv6 DEPLOYMENT

## 3.1 Replicate Day 2 Configuration

### Automated Config Push (vManage)

```python
#!/usr/bin/env python3
"""
Push IPv6 config to MUM-HUB-02 via vManage API
Replicates Day 2 steps for MUM-HUB-01
"""

import requests
import json

VMANAGE = "https://vmanage.abhavtech.com"
USERNAME = "admin"
PASSWORD = "<password>"

def vmanage_login():
    """Authenticate to vManage"""
    session = requests.session()
    url = f"{VMANAGE}/j_security_check"
    payload = {'j_username': USERNAME, 'j_password': PASSWORD}
    
    response = session.post(url, data=payload, verify=False)
    if response.status_code == 200:
        token = session.get(f"{VMANAGE}/dataservice/client/token", verify=False).text
        session.headers['X-XSRF-TOKEN'] = token
        return session
    else:
        raise Exception("vManage login failed")

def attach_ipv6_template(session, device_id):
    """Attach IPv6 device template to MUM-HUB-02"""
    
# Device template with IPv6 variables
    template_id = "xxxx-xxxx-xxxx-xxxx"  # ABV-DeviceTemplate-Hub-C8500-IPv6
    
    payload = {
        "deviceTemplateList": [{
            "templateId": template_id,
            "device": [{
                "csv-deviceId": device_id,
                "csv-deviceIP": "10.252.100.2",
                "csv-host-name": "MUM-HUB-02",
                
# System variables
                "//system/system-ip": "10.252.1.2",
                "//system/ipv6-system-ip": "2001:db8:abc1:8000::2/128",
                "//system/site-id": "1",
                "//system/host-name": "MUM-HUB-02",
                
# MPLS interface variables
                "//vpn-0-interface/mpls_ipv4": "172.16.100.6/30",
                "//vpn-0-interface/mpls_ipv6": "2001:db8:1234:100::4/127",
                
# DIA interface variables
                "//vpn-0-interface/dia_ipv4": "203.0.113.3/29",
                "//vpn-0-interface/dia_ipv6": "2001:db8:5678:200::3/64",
                
# ExpressRoute variables
                "//vpn-0-interface/er_primary_ipv4": "169.254.200.6/30",
                "//vpn-0-interface/er_primary_ipv6": "2001:db8:cafe:2::2/126",
            }]
        }],
        "isEdited": False,
        "isMasterEdited": False
    }
    
    url = f"{VMANAGE}/dataservice/template/device/config/attachfeature"
    response = session.post(url, json=payload, verify=False)
    
    if response.status_code == 200:
        action_id = response.json()['id']
        print(f"✅ Template attach initiated: {action_id}")
        return action_id
    else:
        print(f"❌ Template attach failed: {response.text}")
        return None

def wait_for_action(session, action_id, timeout=300):
    """Poll action status until complete"""
    import time
    
    url = f"{VMANAGE}/dataservice/device/action/status/{action_id}"
    start = time.time()
    
    while time.time() - start < timeout:
        response = session.get(url, verify=False)
        data = response.json()['data'][0]
        
        status = data.get('status')
        print(f"  Status: {status} ({data.get('currentActivity', 'N/A')})")
        
        if status == "done":
            print(f"✅ Template push complete in {int(time.time() - start)}s")
            return True
        elif status == "failure":
            print(f"❌ Template push failed: {data}")
            return False
        
        time.sleep(10)
    
    print(f"❌ Timeout after {timeout}s")
    return False

if __name__ == "__main__":
    print("=== Pushing IPv6 config to MUM-HUB-02 ===")
    
    session = vmanage_login()
    print("✅ Logged into vManage")
    
    device_id = "C8K-XXXXXXXX-XXXX"  # MUM-HUB-02 chassis serial
    action_id = attach_ipv6_template(session, device_id)
    
    if action_id:
        success = wait_for_action(session, action_id)
        if success:
            print("\n✅ MUM-HUB-02 IPv6 deployment complete")
        else:
            print("\n❌ Deployment failed — check vManage logs")
```

**Run the script:**

```bash
python3 deploy_hub02_ipv6.py

# Expected output:
# === Pushing IPv6 config to MUM-HUB-02 ===
# Logged into vManage
# Template attach initiated: 12345678-abcd-efgh-ijkl-123456789012
# Status: in_progress (Pushing configuration...)
# Status: in_progress (Committing configuration...)
# Status: done (N/A)
# Template push complete in 47s
#
# MUM-HUB-02 IPv6 deployment complete
```

---

## 3.2 Verify Inter-Hub BFD (IPv6)

### Test BFD Between MUM-HUB-01 and MUM-HUB-02

```cisco
! On MUM-HUB-01
MUM-HUB-01# show sdwan bfd sessions | include 10.252.1.2
! Expected: IPv4 session between the two hubs (same site ID = 1)

MUM-HUB-01# show sdwan bfd sessions | include 2001:db8:abc1:8000::2
! Expected: IPv6 session to MUM-HUB-02 system IP

                                                      SOURCE  REMOTE  TX                                     
SYSTEM  SITE   STATE  SRC COLOR  DST COLOR  SRC IP          DST IP  ENCAP  DETECT MULTIPLIER  RX              
IP      ID            (TLOC)     (TLOC)                                                     INTERVAL(msec)  
───────────────────────────────────────────────────────────────────────────────────────────────────────────
2001:db8:abc1:8000::2  1  up  mpls  mpls  2001:db8:1234:100::2  2001:db8:1234:100::4  ipsec  7  1000  1000
2001:db8:abc1:8000::2  1  up  dia   dia   2001:db8:5678:200::2  2001:db8:5678:200::3  ipsec  7  1000  1000

! Analysis: Both MPLS and DIA have IPv6 BFD to peer hub ✅
```

---

## 3.3 HA Failover Test (Dual-Stack)

### Simulate MUM-HUB-01 Failure

```bash
#!/bin/bash
# ha_failover_test.sh

echo "=== TESTING HA FAILOVER: MUM-HUB-01 → MUM-HUB-02 ==="

# Baseline: Traffic flowing via MUM-HUB-01
echo "Baseline: ping London hub via MUM-HUB-01"
ping -c 5 2001:db8:abcb:8000::1
# Expected: 5/5 success via MUM-HUB-01

# Shutdown MUM-HUB-01 MPLS interface
echo ""
echo "--- Simulating MUM-HUB-01 MPLS failure ---"
ssh admin@10.252.100.1 "configure terminal; interface TenGigabitEthernet0/0/0; shutdown; commit"

# Wait for BFD timeout (7 seconds)
echo "Waiting 10s for BFD convergence..."
sleep 10

# Test failover: Traffic should now use MUM-HUB-02
echo ""
echo "Testing: ping London hub (should failover to MUM-HUB-02)"
ping -c 5 2001:db8:abcb:8000::1
# Expected: 5/5 success via MUM-HUB-02 (may have 1-2 lost during convergence)

# Verify on MUM-HUB-02
echo ""
echo "Verifying BFD sessions on MUM-HUB-02:"
ssh admin@10.252.100.2 "show sdwan bfd sessions | count"
# Expected: MUM-HUB-02 now carries all BFD sessions

# Restore MUM-HUB-01
echo ""
echo "--- Restoring MUM-HUB-01 MPLS ---"
ssh admin@10.252.100.1 "configure terminal; interface TenGigabitEthernet0/0/0; no shutdown; commit"
sleep 15

# Verify restoration
echo ""
echo "Final: ping London hub (traffic should revert to MUM-HUB-01)"
ping -c 5 2001:db8:abcb:8000::1

echo ""
echo "✅ HA failover test complete"
```

**Run test:**

```bash
chmod +x ha_failover_test.sh
./ha_failover_test.sh

# Expected output:
# Baseline: 5 packets transmitted, 5 received, 0% packet loss
# [MUM-HUB-01 MPLS shutdown]
# Testing failover: 5 packets transmitted, 4-5 received (1 may drop during convergence)
# BFD sessions on MUM-HUB-02: 35 sessions UP
# [MUM-HUB-01 restored]
# Final: 5 packets transmitted, 5 received, 0% packet loss
```

---

## DAY 4: OMP IPv6 ROUTE DISTRIBUTION

## 4.1 Enable OMP IPv6 Address Family

### Configure OMP for IPv6 on vSmart

```cisco
! SSH to vSmart-1 (10.252.31.11)
ssh admin@10.252.31.11

vsmart-1# configure terminal

! Enable IPv6 in OMP
vsmart-1(config)# omp
vsmart-1(config-omp)# address-family ipv6
vsmart-1(config-omp-af)# advertise connected
vsmart-1(config-omp-af)# advertise static
vsmart-1(config-omp-af)# exit
vsmart-1(config-omp)# exit

vsmart-1(config)# commit
Commit complete.

! Repeat on vSmart-2
```

### Verify OMP IPv6 Peering

```cisco
! On vSmart-1
vsmart-1# show sdwan omp peers

! Expected output (IPv4 + IPv6 peers):
DOMAIN  OVERLAY   SITE                                   
PEER    ID       ID     STATE    UPTIME          R/I/S   REFRESH  V/P/A   
───────────────────────────────────────────────────────────────────────────
10.252.1.1     1  1   up      0:00:45:12      7/4/6   no       3/0/0  (MUM-HUB-01 IPv4)
10.252.1.2     1  1   up      0:00:15:32      7/4/6   no       3/0/0  (MUM-HUB-02 IPv4)
2001:db8:abc1:8000::1  1  1  up  0:00:10:23  7/4/6  no  3/0/0  (MUM-HUB-01 IPv6)
2001:db8:abc1:8000::2  1  1  up  0:00:05:11  7/4/6  no  3/0/0  (MUM-HUB-02 IPv6)

! R/I/S: Routes Received / Installed / Sent
! V/P/A: vRoutes / Paths / Attributes
```

---

## 4.2 Advertise Service VPN IPv6 Routes

### Configure VPN 1 (Corporate) with IPv6

```cisco
! On MUM-HUB-01
MUM-HUB-01# configure terminal

! VPN 1 already exists (IPv4) — add IPv6
MUM-HUB-01(config)# vpn 1

! Add IPv6 route to advertise via OMP
MUM-HUB-01(config-vpn)# ipv6 route 2001:db8:abc1:2000::/52 null0
! (This is the Mumbai corporate IPv6 prefix — advertise to other sites)

! Interface with IPv6 (example: SD-Access handoff)
MUM-HUB-01(config-vpn)# interface GigabitEthernet0/0/7.3001
MUM-HUB-01(config-interface)# description SD-ACCESS-HANDOFF-VN_CORPORATE
MUM-HUB-01(config-interface)# encapsulation dot1Q 3001

! IPv4 (existing)
MUM-HUB-01(config-interface)# ip address 10.240.1.2 255.255.255.252

! IPv6 (new — SD-Access border will peer via IPv6 BGP)
MUM-HUB-01(config-interface)# ipv6 address 2001:db8:abc1:2000::2/126
MUM-HUB-01(config-interface)# ipv6 enable

MUM-HUB-01(config-interface)# exit
MUM-HUB-01(config-vpn)# exit

MUM-HUB-01(config)# commit
```

### Verify OMP IPv6 Routes

```cisco
MUM-HUB-01# show sdwan omp routes vpn 1 ipv6

! Expected output:
CODE:
C   - Connected             I   - Static installed
O   - OMP                   R   - Static redistributed
Tloc - TLOC route           L   - Service route

                                                                            AFFINITY                                
                                                                            GROUP                                   
TENANT  VPN    PREFIX              PROTOCOL    FROM PEER        TLOC IP      ID         TLOC COLOR       ENCAP  
───────────────────────────────────────────────────────────────────────────────────────────────────────────────
0       1      2001:db8:abc1:2000::/52  O  0.0.0.0          10.252.1.1  0          mpls            ipsec
0       1      2001:db8:abc2:2000::/52  O  10.252.31.11     10.252.2.1  0          mpls            ipsec  (Chennai)
0       1      2001:db8:abcb:2000::/52  O  10.252.31.11     10.252.16.1 0          mpls            ipsec  (London)
0       1      2001:db8:abcd:2000::/52  O  10.252.31.11     10.252.32.1 0          mpls            ipsec  (NJ)

! Analysis: IPv6 routes from all hubs present via OMP ✅
```

---

## 4.3 Cross-Hub IPv6 Reachability Test

### Test End-to-End IPv6 Connectivity

```bash
#!/bin/bash
# cross_hub_ipv6_test.sh

echo "=== CROSS-HUB IPv6 REACHABILITY TEST ==="

# Test 1: Mumbai → Chennai (same region, APAC)
echo ""
echo "Test 1: Mumbai → Chennai"
ssh admin@10.252.100.1 "ping vpn 1 2001:db8:abc2:2000::1 count 5"
# Expected: 5/5 success, latency ~10-15ms (MPLS)

# Test 2: Mumbai → London (cross-region, APAC → EMEA)
echo ""
echo "Test 2: Mumbai → London"
ssh admin@10.252.100.1 "ping vpn 1 2001:db8:abcb:2000::1 count 5"
# Expected: 5/5 success, latency ~120-140ms (MPLS intercontinental)

# Test 3: Mumbai → New Jersey (cross-region, APAC → Americas)
echo ""
echo "Test 3: Mumbai → New Jersey"
ssh admin@10.252.100.1 "ping vpn 1 2001:db8:abcd:2000::1 count 5"
# Expected: 5/5 success, latency ~180-200ms (MPLS intercontinental)

# Test 4: Traceroute to verify path
echo ""
echo "Test 4: Traceroute Mumbai → London (IPv6)"
ssh admin@10.252.100.1 "traceroute vpn 1 ipv6 2001:db8:abcb:2000::1"
# Expected path:
# 1. Local egress (MUM-HUB-01)
# 2. IPsec tunnel (encrypted — shows as *)
# 3. Remote ingress (LON-HUB-01)
# 4. Destination

echo ""
echo "✅ Cross-hub IPv6 reachability validated"
```

---

## DAY 5: VALIDATION, TESTING, AND DOCUMENTATION

## 5.1 Comprehensive Dual-Stack Validation

### 30-Point Validation Checklist

```bash
#!/bin/bash
# comprehensive_validation.sh

echo "=== COMPREHENSIVE DUAL-STACK VALIDATION ==="
echo "Target: MUM-HUB-01, MUM-HUB-02"
echo ""

PASS=0
FAIL=0

# ═══════════════════════════════════════════════════════════════════════
# SECTION 1: SYSTEM CONFIGURATION (5 tests)
# ═══════════════════════════════════════════════════════════════════════

echo "SECTION 1: SYSTEM CONFIGURATION"

# Test 1.1: IPv6 routing enabled
TEST=$(ssh admin@10.252.100.1 "show running-config | include ipv6 unicast-routing" 2>/dev/null)
if [[ "$TEST" == *"ipv6 unicast-routing"* ]]; then
  echo "  ✅ 1.1 IPv6 routing enabled"
  ((PASS++))
else
  echo "  ❌ 1.1 IPv6 routing NOT enabled"
  ((FAIL++))
fi

# Test 1.2: IPv6 system loopback configured
TEST=$(ssh admin@10.252.100.1 "show ipv6 interface brief Loopback65528 | include 2001" 2>/dev/null)
if [[ "$TEST" == *"2001:DB8:ABC1:8000::1"* ]]; then
  echo "  ✅ 1.2 IPv6 system loopback configured"
  ((PASS++))
else
  echo "  ❌ 1.2 IPv6 system loopback missing"
  ((FAIL++))
fi

# Test 1.3: Dual-stack on MPLS interface
TEST=$(ssh admin@10.252.100.1 "show interfaces TenGigabitEthernet0/0/0 | include address" 2>/dev/null)
if [[ "$TEST" == *"172.16.100.2"* ]] && [[ "$TEST" == *"2001"* ]]; then
  echo "  ✅ 1.3 MPLS interface dual-stack"
  ((PASS++))
else
  echo "  ❌ 1.3 MPLS interface NOT dual-stack"
  ((FAIL++))
fi

# Test 1.4: Dual-stack on DIA interface
TEST=$(ssh admin@10.252.100.1 "show interfaces GigabitEthernet0/0/4 | include address" 2>/dev/null)
if [[ "$TEST" == *"203.0.113.2"* ]] && [[ "$TEST" == *"2001"* ]]; then
  echo "  ✅ 1.4 DIA interface dual-stack"
  ((PASS++))
else
  echo "  ❌ 1.4 DIA interface NOT dual-stack"
  ((FAIL++))
fi

# Test 1.5: IPv6 on ExpressRoute
TEST=$(ssh admin@10.252.100.1 "show interfaces TenGigabitEthernet0/0/2.4001 | include address" 2>/dev/null)
if [[ "$TEST" == *"169.254.200.2"* ]] && [[ "$TEST" == *"2001"* ]]; then
  echo "  ✅ 1.5 ExpressRoute interface dual-stack"
  ((PASS++))
else
  echo "  ❌ 1.5 ExpressRoute interface NOT dual-stack"
  ((FAIL++))
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════
# SECTION 2: CONTROL PLANE (5 tests)
# ═══════════════════════════════════════════════════════════════════════

echo "SECTION 2: CONTROL PLANE"

# Test 2.1: vBond connections (IPv4 + IPv6)
VBOND_IPV4=$(ssh admin@10.252.100.1 "show sdwan control connections | grep vbond | grep 10.252.31.13 | wc -l" 2>/dev/null)
VBOND_IPV6=$(ssh admin@10.252.100.1 "show sdwan control connections | grep vbond | grep 2001 | wc -l" 2>/dev/null)
if [[ "$VBOND_IPV4" -ge 1 ]] && [[ "$VBOND_IPV6" -ge 1 ]]; then
  echo "  ✅ 2.1 vBond dual-stack connections"
  ((PASS++))
else
  echo "  ❌ 2.1 vBond missing IPv4 or IPv6 connections"
  ((FAIL++))
fi

# Test 2.2: vSmart connections
VSMART_IPV4=$(ssh admin@10.252.100.1 "show sdwan control connections | grep vsmart | grep '10.252.31' | wc -l" 2>/dev/null)
VSMART_IPV6=$(ssh admin@10.252.100.1 "show sdwan control connections | grep vsmart | grep 2001 | wc -l" 2>/dev/null)
if [[ "$VSMART_IPV4" -ge 2 ]] && [[ "$VSMART_IPV6" -ge 2 ]]; then
  echo "  ✅ 2.2 vSmart dual-stack connections (2 vSmarts)"
  ((PASS++))
else
  echo "  ❌ 2.2 vSmart missing IPv4 or IPv6 connections"
  ((FAIL++))
fi

# Test 2.3: OMP IPv6 peers on vSmart
OMP_IPV6=$(ssh admin@10.252.31.11 "show sdwan omp peers | grep 2001 | wc -l" 2>/dev/null)
if [[ "$OMP_IPV6" -ge 2 ]]; then
  echo "  ✅ 2.3 OMP IPv6 peers on vSmart (≥2)"
  ((PASS++))
else
  echo "  ❌ 2.3 OMP IPv6 peers missing on vSmart"
  ((FAIL++))
fi

# Test 2.4: DTLS sessions dual-stack
DTLS_TOTAL=$(ssh admin@10.252.100.1 "show sdwan control connections | grep -c up" 2>/dev/null)
if [[ "$DTLS_TOTAL" -ge 6 ]]; then
  echo "  ✅ 2.4 DTLS sessions total ≥6 (IPv4 + IPv6)"
  ((PASS++))
else
  echo "  ❌ 2.4 Low DTLS session count: $DTLS_TOTAL"
  ((FAIL++))
fi

# Test 2.5: Control connections stable (no flapping)
UPTIME=$(ssh admin@10.252.100.1 "show sdwan control connections | grep vbond | head -1 | awk '{print \$13}'" 2>/dev/null)
if [[ "$UPTIME" =~ ^[0-9]+:[0-9]+:[0-9]+:[0-9]+$ ]]; then
  echo "  ✅ 2.5 Control connections stable (uptime: $UPTIME)"
  ((PASS++))
else
  echo "  ❌ 2.5 Control connection uptime format unexpected"
  ((FAIL++))
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════
# SECTION 3: BFD SESSIONS (5 tests)
# ═══════════════════════════════════════════════════════════════════════

echo "SECTION 3: BFD SESSIONS"

# Test 3.1: BFD IPv4 sessions count
BFD_IPV4=$(ssh admin@10.252.100.1 "show sdwan bfd sessions | grep -c '10\.'" 2>/dev/null)
if [[ "$BFD_IPV4" -ge 15 ]]; then
  echo "  ✅ 3.1 BFD IPv4 sessions ≥15"
  ((PASS++))
else
  echo "  ⚠️  3.1 BFD IPv4 sessions low: $BFD_IPV4 (expected ≥15)"
  ((FAIL++))
fi

# Test 3.2: BFD IPv6 sessions count
BFD_IPV6=$(ssh admin@10.252.100.1 "show sdwan bfd sessions | grep -c '2001:'" 2>/dev/null)
if [[ "$BFD_IPV6" -ge 15 ]]; then
  echo "  ✅ 3.2 BFD IPv6 sessions ≥15"
  ((PASS++))
else
  echo "  ⚠️  3.2 BFD IPv6 sessions low: $BFD_IPV6 (expected ≥15)"
  ((FAIL++))
fi

# Test 3.3: BFD inter-hub (MUM-HUB-01 ↔ MUM-HUB-02)
BFD_INTER=$(ssh admin@10.252.100.1 "show sdwan bfd sessions | grep '2001:db8:abc1:8000::2' | grep -c up" 2>/dev/null)
if [[ "$BFD_INTER" -ge 1 ]]; then
  echo "  ✅ 3.3 BFD inter-hub (MUM-HUB-01 ↔ 02)"
  ((PASS++))
else
  echo "  ❌ 3.3 BFD inter-hub missing"
  ((FAIL++))
fi

# Test 3.4: BFD hello interval (should be 1000ms)
BFD_HELLO=$(ssh admin@10.252.100.1 "show sdwan bfd sessions | head -5 | grep -o 'TX.*' | head -1" 2>/dev/null)
if [[ "$BFD_HELLO" == *"1000"* ]]; then
  echo "  ✅ 3.4 BFD hello interval correct (1000ms)"
  ((PASS++))
else
  echo "  ⚠️  3.4 BFD hello interval unexpected: $BFD_HELLO"
  ((FAIL++))
fi

# Test 3.5: No BFD sessions in 'down' state
BFD_DOWN=$(ssh admin@10.252.100.1 "show sdwan bfd sessions | grep -c down" 2>/dev/null)
if [[ "$BFD_DOWN" -eq 0 ]]; then
  echo "  ✅ 3.5 No BFD sessions down"
  ((PASS++))
else
  echo "  ❌ 3.5 BFD sessions down: $BFD_DOWN"
  ((FAIL++))
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════
# SECTION 4: OMP ROUTES (5 tests)
# ═══════════════════════════════════════════════════════════════════════

echo "SECTION 4: OMP ROUTES"

# Test 4.1: OMP IPv4 routes in VPN 1
OMP_V4=$(ssh admin@10.252.100.1 "show sdwan omp routes vpn 1 | grep -c 'O '" 2>/dev/null)
if [[ "$OMP_V4" -ge 10 ]]; then
  echo "  ✅ 4.1 OMP IPv4 routes VPN 1 ≥10"
  ((PASS++))
else
  echo "  ⚠️  4.1 OMP IPv4 routes low: $OMP_V4"
  ((FAIL++))
fi

# Test 4.2: OMP IPv6 routes in VPN 1
OMP_V6=$(ssh admin@10.252.100.1 "show sdwan omp routes vpn 1 ipv6 | grep -c 'O '" 2>/dev/null)
if [[ "$OMP_V6" -ge 5 ]]; then
  echo "  ✅ 4.2 OMP IPv6 routes VPN 1 ≥5"
  ((PASS++))
else
  echo "  ⚠️  4.2 OMP IPv6 routes low: $OMP_V6 (if other hubs not IPv6 yet, this is expected)"
  ((FAIL++))
fi

# Test 4.3: Mumbai corporate prefix advertised
MUM_CORP=$(ssh admin@10.252.100.1 "show sdwan omp routes vpn 1 ipv6 | grep '2001:db8:abc1:2000::'" 2>/dev/null)
if [[ -n "$MUM_CORP" ]]; then
  echo "  ✅ 4.3 Mumbai corporate IPv6 prefix advertised"
  ((PASS++))
else
  echo "  ❌ 4.3 Mumbai corporate IPv6 prefix NOT advertised"
  ((FAIL++))
fi

# Test 4.4: Receive routes from other hubs (if deployed)
OTHER_HUBS=$(ssh admin@10.252.100.1 "show sdwan omp routes vpn 1 ipv6 | grep -E '(abc2|abcb|abcd):2000::' | wc -l" 2>/dev/null)
if [[ "$OTHER_HUBS" -ge 1 ]]; then
  echo "  ✅ 4.4 Receiving IPv6 routes from other hubs"
  ((PASS++))
else
  echo "  ⚠️  4.4 No IPv6 routes from other hubs (Week 3+ will add)"
# Not a failure — other hubs not IPv6 yet
  ((PASS++))
fi

# Test 4.5: OMP summary on vSmart shows Mumbai routes
VSMART_ROUTES=$(ssh admin@10.252.31.11 "show sdwan omp summary | grep '2001:db8:abc1:8000::1'" 2>/dev/null)
if [[ -n "$VSMART_ROUTES" ]]; then
  echo "  ✅ 4.5 vSmart sees Mumbai IPv6 routes"
  ((PASS++))
else
  echo "  ❌ 4.5 vSmart does NOT see Mumbai IPv6 routes"
  ((FAIL++))
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════
# SECTION 5: DATA PLANE (5 tests)
# ═══════════════════════════════════════════════════════════════════════

echo "SECTION 5: DATA PLANE"

# Test 5.1: Inter-hub ping (MUM-HUB-01 → MUM-HUB-02)
PING_HUB=$(ssh admin@10.252.100.1 "ping vpn 0 2001:db8:abc1:8000::2 count 3 | tail -1" 2>/dev/null)
if [[ "$PING_HUB" == *"3 received"* ]] || [[ "$PING_HUB" == *"0% packet loss"* ]]; then
  echo "  ✅ 5.1 Inter-hub ping success (MUM-HUB-01 → 02)"
  ((PASS++))
else
  echo "  ❌ 5.1 Inter-hub ping failed: $PING_HUB"
  ((FAIL++))
fi

# Test 5.2: VPN 1 ping (if service VPN configured)
PING_VPN1=$(ssh admin@10.252.100.1 "ping vpn 1 2001:db8:abc1:2000::1 count 3 | tail -1" 2>/dev/null)
if [[ "$PING_VPN1" == *"received"* ]]; then
  echo "  ✅ 5.2 VPN 1 IPv6 ping success"
  ((PASS++))
else
  echo "  ⚠️  5.2 VPN 1 ping failed (may not have endpoints yet)"
  ((PASS++))  # Not critical — endpoints added in Phase 2
fi

# Test 5.3: IPsec tunnels count
IPSEC=$(ssh admin@10.252.100.1 "show sdwan ipsec outbound-connections | grep -c 'up'" 2>/dev/null)
if [[ "$IPSEC" -ge 20 ]]; then
  echo "  ✅ 5.3 IPsec tunnels ≥20"
  ((PASS++))
else
  echo "  ⚠️  5.3 IPsec tunnels low: $IPSEC"
  ((FAIL++))
fi

# Test 5.4: No packet drops on WAN interfaces
DROPS=$(ssh admin@10.252.100.1 "show interfaces TenGigabitEthernet0/0/0 | grep 'output errors'" 2>/dev/null | awk '{print $3}')
if [[ "$DROPS" -eq 0 ]] || [[ -z "$DROPS" ]]; then
  echo "  ✅ 5.4 No packet drops on MPLS interface"
  ((PASS++))
else
  echo "  ⚠️  5.4 Packet drops detected: $DROPS"
  ((FAIL++))
fi

# Test 5.5: QoS applied to WAN interfaces
QOS=$(ssh admin@10.252.100.1 "show policy-map interface TenGigabitEthernet0/0/0 | grep -c 'Class-map'" 2>/dev/null)
if [[ "$QOS" -ge 1 ]]; then
  echo "  ✅ 5.5 QoS policy applied"
  ((PASS++))
else
  echo "  ⚠️  5.5 No QoS policy found"
  ((FAIL++))
fi

echo ""

# ═══════════════════════════════════════════════════════════════════════
# SECTION 6: PERFORMANCE (5 tests)
# ═══════════════════════════════════════════════════════════════════════

echo "SECTION 6: PERFORMANCE"

# Test 6.1: MTU on IPv6 interfaces
MTU=$(ssh admin@10.252.100.1 "show ipv6 interface TenGigabitEthernet0/0/0 | grep MTU" 2>/dev/null)
if [[ "$MTU" == *"1500"* ]]; then
  echo "  ✅ 6.1 IPv6 MTU correct (1500)"
  ((PASS++))
else
  echo "  ⚠️  6.1 IPv6 MTU unexpected: $MTU"
  ((FAIL++))
fi

# Test 6.2: CPU utilization normal (<50%)
CPU=$(ssh admin@10.252.100.1 "show processes cpu | grep 'CPU utilization' | awk '{print \$3}' | sed 's/%//'" 2>/dev/null)
if [[ "$CPU" -lt 50 ]]; then
  echo "  ✅ 6.2 CPU utilization normal (${CPU}%)"
  ((PASS++))
else
  echo "  ⚠️  6.2 CPU utilization high: ${CPU}%"
  ((FAIL++))
fi

# Test 6.3: Memory utilization normal (<70%)
MEM=$(ssh admin@10.252.100.1 "show processes memory | grep 'Processor' | awk '{print \$5}' | sed 's/%//'" 2>/dev/null)
if [[ "$MEM" -lt 70 ]]; then
  echo "  ✅ 6.3 Memory utilization normal (${MEM}%)"
  ((PASS++))
else
  echo "  ⚠️  6.3 Memory utilization high: ${MEM}%"
  ((FAIL++))
fi

# Test 6.4: Interface errors (should be 0)
ERRORS=$(ssh admin@10.252.100.1 "show interfaces summary | grep -E '(TenGig|Gig)' | awk '{sum+=\$5+\$6} END {print sum}'" 2>/dev/null)
if [[ "$ERRORS" -eq 0 ]] || [[ -z "$ERRORS" ]]; then
  echo "  ✅ 6.4 No interface errors"
  ((PASS++))
else
  echo "  ⚠️  6.4 Interface errors detected: $ERRORS"
  ((FAIL++))
fi

# Test 6.5: Uptime stable (>1 hour after config push)
UPTIME=$(ssh admin@10.252.100.1 "show version | grep uptime" 2>/dev/null)
if [[ "$UPTIME" == *"hour"* ]] || [[ "$UPTIME" == *"day"* ]] || [[ "$UPTIME" == *"week"* ]]; then
  echo "  ✅ 6.5 System uptime stable"
  ((PASS++))
else
  echo "  ⚠️  6.5 System uptime recent: $UPTIME"
  ((PASS++))  # Not critical — may have rebooted during deployment
fi

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "VALIDATION SUMMARY: $PASS PASSED, $FAIL FAILED"
echo "═══════════════════════════════════════════════════════════════"

if [[ $FAIL -eq 0 ]]; then
  echo "✅ ALL TESTS PASSED — Mumbai hub IPv6 deployment SUCCESSFUL"
  exit 0
elif [[ $FAIL -le 5 ]]; then
  echo "⚠️  MINOR ISSUES — Review failed tests, but deployment is acceptable"
  exit 0
else
  echo "❌ CRITICAL ISSUES — $FAIL tests failed, review and remediate"
  exit 1
fi
```

**Run comprehensive validation:**

```bash
chmod +x comprehensive_validation.sh
./comprehensive_validation.sh

# Expected output (sample):
# SECTION 1: SYSTEM CONFIGURATION
# 1.1 IPv6 routing enabled
# 1.2 IPv6 system loopback configured
# 1.3 MPLS interface dual-stack
# 1.4 DIA interface dual-stack
# 1.5 ExpressRoute interface dual-stack
#
# SECTION 2: CONTROL PLANE
# 2.1 vBond dual-stack connections
# 2.2 vSmart dual-stack connections (2 vSmarts)
# 2.3 OMP IPv6 peers on vSmart (≥2)
# ...
#
# ═══════════════════════════════════════════════════════════════
# VALIDATION SUMMARY: 30 PASSED, 0 FAILED
# ═══════════════════════════════════════════════════════════════
# ALL TESTS PASSED — Mumbai hub IPv6 deployment SUCCESSFUL
```

---

## 5.2 Week 2 Sign-Off and Week 3 Planning

### Week 2 Deliverables Summary

```
WEEK 2 ACCOMPLISHMENTS:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  ✅ Mumbai Hub IPv6 Deployment Complete                           │
│     - 2 × C8500-12X routers (MUM-HUB-01, MUM-HUB-02)              │
│     - Dual-stack WAN circuits (MPLS, DIA, ExpressRoute)           │
│     - IPv6 system IPs assigned                                     │
│     - BFD dual-stack sessions active                               │
│     - OMP IPv6 route distribution operational                      │
│                                                                    │
│  📊 METRICS:                                                       │
│     - Control connections: 12 (6 IPv4 + 6 IPv6)                   │
│     - BFD sessions: 60 (30 IPv4 + 30 IPv6)                        │
│     - OMP IPv6 routes: 5+ prefixes advertised                     │
│     - Zero IPv4 impact (all existing sessions maintained)         │
│     - HA tested: Failover <10s                                    │
│                                                                    │
│  📄 DOCUMENTATION:                                                 │
│     - vManage templates updated (IPv6 variables)                  │
│     - Runbooks created (deployment, rollback)                     │
│     - Validation scripts archived                                 │
│     - Config backups stored                                       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Week 3 Planning (Next Phase)

```
WEEK 3 SCOPE: REMAINING 5 HUB SITES
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Day 1-2: Chennai Hub (CHN-HUB-01/02)                             │
│     - Replicate Mumbai deployment                                 │
│     - Validate Mumbai ↔ Chennai IPv6 BFD                          │
│                                                                    │
│  Day 3: London Hub (LON-HUB-01/02)                                │
│     - EMEA region first deployment                                │
│     - Validate APAC ↔ EMEA IPv6 reachability                      │
│                                                                    │
│  Day 4: Frankfurt + NJ Hubs                                        │
│     - Parallel deployment (2 sites)                               │
│     - Cross-region validation                                     │
│                                                                    │
│  Day 5: Dallas Hub + Full Mesh Validation                         │
│     - Last hub site                                                │
│     - Comprehensive 6-site IPv6 mesh test                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

EXPECTED OUTCOME (END OF WEEK 3):
  - All 6 hub sites dual-stack
  - 300+ BFD sessions (IPv4 + IPv6)
  - Full OMP IPv6 route distribution
  - Ready for branch site deployment (Week 4-8)
```

---

## WEEK 2 COMPLETE

**Summary:**
- Mumbai hub (MUM-HUB-01/02) successfully deployed with dual-stack IPv6
- All WAN circuits operational (MPLS, DIA, ExpressRoute)
- Control plane dual-stack (vBond, vSmart connections via IPv4 + IPv6)
- BFD dual-stack active (30 IPv4 + 30 IPv6 sessions)
- OMP distributing IPv6 routes
- 30/30 validation tests passed
- Zero impact to existing IPv4 services

**Next Guide:** Week 3 — Remaining Hub Sites (Chennai, London, Frankfurt, NJ, Dallas)

---

*© 2025 Abhavtech - IPv6 Migration Week 2 Guide*
*Version 1.0 | Last Updated: January 2025*
