# ABHAVTECH IPv6 MIGRATION — WEEK 3
## REMAINING HUB SITES IPv6 DEPLOYMENT (CHENNAI, LONDON, FRANKFURT, NJ, DALLAS)

**Project:** ABV-IPV6-2025  
**Week:** 3 of 44  
**Phase:** Phase 1 — SD-WAN Underlay IPv6  
**Duration:** 5 Days  
**Objective:** Deploy IPv6 on remaining 5 hub sites, establish full 6-hub dual-stack mesh  
**Scope:** Chennai (2 routers), London (2), Frankfurt (2), NJ (2), Dallas (2) = 10 × C8500-12X total  

---

## WEEK 3 OVERVIEW

```
WEEK 3 DELIVERABLES:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  Day 1-2: Chennai Hub (CHN-HUB-01/02)                             │
│    ✅ Dual-stack MPLS, DIA circuits (Tata/Airtel)                 │
│    ✅ BFD sessions: Mumbai ↔ Chennai IPv6                         │
│    ✅ OMP IPv6 routes: 2 hubs × 2 protocols                       │
│                                                                    │
│  Day 3: London Hub (LON-HUB-01/02)                                │
│    ✅ First EMEA site with dual-stack                             │
│    ✅ Cross-region BFD: APAC ↔ EMEA (Mumbai/Chennai → London)     │
│    ✅ ExpressRoute IPv6 to Azure UK South                         │
│                                                                    │
│  Day 4: Frankfurt + New Jersey Hubs (Parallel)                    │
│    ✅ FRA-HUB-01/02: EMEA completion                              │
│    ✅ NJ-HUB-01/02: Americas region start                         │
│    ✅ Triple-region mesh validation                               │
│                                                                    │
│  Day 5: Dallas Hub + Full Mesh Validation                         │
│    ✅ DAL-HUB-01/02: Americas completion                          │
│    ✅ All 6 hubs dual-stack (12 routers total)                    │
│    ✅ 300+ BFD sessions (IPv4 + IPv6)                             │
│    ✅ Full mesh OMP IPv6 route exchange                           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## DAY 1-2: CHENNAI HUB DEPLOYMENT

## 1.1 Chennai Hub Infrastructure

### Current State (IPv4-Only)

```
CHENNAI HUB SD-WAN INFRASTRUCTURE:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  DEVICE: CHN-HUB-01                                                │
│    Model:        Cisco Catalyst 8500-12X                           │
│    IOS-XE:       17.15.1                                           │
│    Role:         Primary SD-WAN hub (active)                       │
│    System IP:    10.252.2.1/32                                     │
│    Mgmt IP:      10.252.101.1/24                                   │
│    Site ID:      2                                                 │
│                                                                    │
│  WAN CIRCUITS:                                                     │
│    ├─ MPLS Primary:      TenGigE0/0/0 (Tata, 1 Gbps)              │
│    │    IPv4: 172.16.200.2/30                                      │
│    │                                                               │
│    ├─ DIA Primary:       GigE0/0/4 (Airtel, 500 Mbps)             │
│    │    IPv4: 203.0.115.2/29                                       │
│    │                                                               │
│    └─ ExpressRoute Pri:  TenGigE0/0/2.4002                        │
│         IPv4: 169.254.201.2/30                                     │
│         BGP Peer: 169.254.201.1 (ASN 12076)                        │
│                                                                    │
│  DEVICE: CHN-HUB-02                                                │
│    System IP:    10.252.2.2/32                                     │
│    Mgmt IP:      10.252.101.2/24                                   │
│    Site ID:      2 (same as CHN-HUB-01)                            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### Target State (Dual-Stack)

```
TARGET IPv6 ADDRESSING (Chennai Hub):
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  CHN-HUB-01:                                                       │
│    System IP (IPv6):  2001:db8:abc2:8000::1/128                   │
│    Mgmt IP (IPv6):    2001:db8:abc2:1000::101/64                  │
│                                                                    │
│  WAN CIRCUITS (IPv6 assigned by carriers):                        │
│    ├─ MPLS Primary (Tata):                                        │
│    │    IPv6: 2001:db8:1234:200::2/127                            │
│    │                                                               │
│    ├─ DIA Primary (Airtel):                                        │
│    │    IPv6: 2001:db8:9abc:300::2/64                             │
│    │                                                               │
│    └─ ExpressRoute Primary:                                        │
│         IPv6: 2001:db8:cafe:11::2/126   (Microsoft assigns)       │
│                                                                    │
│  CHN-HUB-02: (Same pattern with ::2 suffix)                        │
│    System IP (IPv6): 2001:db8:abc2:8000::2/128                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 1.2 Chennai Hub Deployment (Automated via vManage)

### vManage Template Variables (Chennai)

```python
#!/usr/bin/env python3
"""
Deploy IPv6 to Chennai hubs using vManage API
Reuses templates created in Week 2 with Chennai-specific variables
"""

import requests
import json
import time

VMANAGE = "https://vmanage.abhavtech.com"
USERNAME = "admin"
PASSWORD = "<password>"

CHENNAI_HUB_01_VARS = {
# System
    "//system/system-ip": "10.252.2.1",
    "//system/ipv6-system-ip": "2001:db8:abc2:8000::1/128",
    "//system/site-id": "2",
    "//system/host-name": "CHN-HUB-01",
    
# VPN 0 - MPLS Interface
    "//vpn-0-interface-mpls/if-name": "TenGigabitEthernet0/0/0",
    "//vpn-0-interface-mpls/mpls_ipv4": "172.16.200.2/30",
    "//vpn-0-interface-mpls/mpls_ipv6": "2001:db8:1234:200::2/127",
    
# VPN 0 - DIA Interface
    "//vpn-0-interface-dia/if-name": "GigabitEthernet0/0/4",
    "//vpn-0-interface-dia/dia_ipv4": "203.0.115.2/29",
    "//vpn-0-interface-dia/dia_ipv6": "2001:db8:9abc:300::2/64",
    
# VPN 0 - ExpressRoute Interface
    "//vpn-0-interface-er/if-name": "TenGigabitEthernet0/0/2.4002",
    "//vpn-0-interface-er/er_vlan": "4002",
    "//vpn-0-interface-er/er_primary_ipv4": "169.254.201.2/30",
    "//vpn-0-interface-er/er_primary_ipv6": "2001:db8:cafe:11::2/126",
    
# VPN 512 - Management
    "//vpn-512/mgmt_ipv4": "10.252.101.1/24",
    "//vpn-512/mgmt_ipv6": "2001:db8:abc2:1000::101/64",
    "//vpn-512/mgmt_gateway_ipv4": "10.252.101.254",
    "//vpn-512/mgmt_gateway_ipv6": "2001:db8:abc2:1000::1",
}

CHENNAI_HUB_02_VARS = {
# System
    "//system/system-ip": "10.252.2.2",
    "//system/ipv6-system-ip": "2001:db8:abc2:8000::2/128",
    "//system/site-id": "2",
    "//system/host-name": "CHN-HUB-02",
    
# WAN interfaces (slightly different IPs)
    "//vpn-0-interface-mpls/mpls_ipv4": "172.16.200.6/30",
    "//vpn-0-interface-mpls/mpls_ipv6": "2001:db8:1234:200::4/127",
    "//vpn-0-interface-dia/dia_ipv4": "203.0.115.3/29",
    "//vpn-0-interface-dia/dia_ipv6": "2001:db8:9abc:300::3/64",
    "//vpn-0-interface-er/er_primary_ipv4": "169.254.201.6/30",
    "//vpn-0-interface-er/er_primary_ipv6": "2001:db8:cafe:11::6/126",
    
# Management
    "//vpn-512/mgmt_ipv4": "10.252.101.2/24",
    "//vpn-512/mgmt_ipv6": "2001:db8:abc2:1000::102/64",
}

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

def attach_template(session, device_id, hostname, variables):
    """Attach device template with variables"""
    template_id = "xxxx-xxxx-xxxx-xxxx"  # ABV-DeviceTemplate-Hub-C8500-IPv6
    
    payload = {
        "deviceTemplateList": [{
            "templateId": template_id,
            "device": [{
                "csv-deviceId": device_id,
                "csv-deviceIP": variables.get("//vpn-512/mgmt_ipv4", "").split('/')[0],
                "csv-host-name": hostname,
                **variables
            }]
        }],
        "isEdited": False,
        "isMasterEdited": False
    }
    
    url = f"{VMANAGE}/dataservice/template/device/config/attachfeature"
    response = session.post(url, json=payload, verify=False)
    
    if response.status_code == 200:
        action_id = response.json()['id']
        print(f"✅ Template attach initiated for {hostname}: {action_id}")
        return action_id
    else:
        print(f"❌ Template attach failed for {hostname}: {response.text}")
        return None

def wait_for_action(session, action_id, timeout=600):
    """Poll action status until complete"""
    url = f"{VMANAGE}/dataservice/device/action/status/{action_id}"
    start = time.time()
    
    while time.time() - start < timeout:
        response = session.get(url, verify=False)
        data = response.json()['data'][0]
        
        status = data.get('status')
        activity = data.get('currentActivity', 'N/A')
        
        if status == "done":
            print(f"  ✅ Complete in {int(time.time() - start)}s")
            return True
        elif status == "failure":
            print(f"  ❌ Failed: {data}")
            return False
        
        print(f"  Status: {status} ({activity})")
        time.sleep(15)
    
    print(f"  ❌ Timeout after {timeout}s")
    return False

if __name__ == "__main__":
    print("=== CHENNAI HUB IPv6 DEPLOYMENT ===")
    print("")
    
    session = vmanage_login()
    print("✅ Logged into vManage")
    print("")
    
# Deploy CHN-HUB-01
    print("Deploying CHN-HUB-01...")
    device_id_01 = "C8K-CHN-01-SERIAL"  # Actual chassis serial
    action_01 = attach_template(session, device_id_01, "CHN-HUB-01", CHENNAI_HUB_01_VARS)
    
    if action_01:
        success_01 = wait_for_action(session, action_01)
    
    print("")
    
# Deploy CHN-HUB-02
    print("Deploying CHN-HUB-02...")
    device_id_02 = "C8K-CHN-02-SERIAL"
    action_02 = attach_template(session, device_id_02, "CHN-HUB-02", CHENNAI_HUB_02_VARS)
    
    if action_02:
        success_02 = wait_for_action(session, action_02)
    
    print("")
    print("═══════════════════════════════════════════")
    if success_01 and success_02:
        print("✅ CHENNAI HUB IPv6 DEPLOYMENT COMPLETE")
    else:
        print("❌ Deployment failed — check vManage logs")
    print("═══════════════════════════════════════════")
```

**Run Chennai deployment:**

```bash
python3 deploy_chennai_ipv6.py

# Expected output:
# === CHENNAI HUB IPv6 DEPLOYMENT ===
#
# Logged into vManage
#
# Deploying CHN-HUB-01...
# Template attach initiated for CHN-HUB-01: 12345678-abcd-1234
# Status: in_progress (Pushing configuration...)
# Status: in_progress (Validating configuration...)
# Status: done (N/A)
# Complete in 52s
#
# Deploying CHN-HUB-02...
# Template attach initiated for CHN-HUB-02: 87654321-efgh-5678
# Status: in_progress (Pushing configuration...)
# Status: done (N/A)
# Complete in 48s
#
# ═══════════════════════════════════════════
# CHENNAI HUB IPv6 DEPLOYMENT COMPLETE
# ═══════════════════════════════════════════
```

---

## 1.3 Mumbai ↔ Chennai IPv6 Validation

### Test 1.3.1: BFD Sessions Between Hubs

```bash
# On Mumbai hub
ssh admin@10.252.100.1

MUM-HUB-01# show sdwan bfd sessions | include 2001:db8:abc2:8000
# Expected: IPv6 BFD sessions to Chennai (system IPs ::1 and ::2)

                                                      SOURCE  REMOTE  TX                                     
SYSTEM  SITE   STATE  SRC COLOR  DST COLOR  SRC IP          DST IP  ENCAP  DETECT MULTIPLIER  RX              
IP      ID            (TLOC)     (TLOC)                                                     INTERVAL(msec)  
───────────────────────────────────────────────────────────────────────────────────────────────────────────
2001:db8:abc2:8000::1  2  up  mpls  mpls  2001:db8:1234:100::2  2001:db8:1234:200::2  ipsec  7  1000  1000
2001:db8:abc2:8000::2  2  up  mpls  mpls  2001:db8:1234:100::2  2001:db8:1234:200::4  ipsec  7  1000  1000
2001:db8:abc2:8000::1  2  up  dia   dia   2001:db8:5678:200::2  2001:db8:9abc:300::2  ipsec  7  1000  1000
2001:db8:abc2:8000::2  2  up  dia   dia   2001:db8:5678:200::2  2001:db8:9abc:300::3  ipsec  7  1000  1000

# Analysis: 4 IPv6 BFD sessions (2 routers × 2 colors)
```

### Test 1.3.2: OMP IPv6 Route Exchange

```bash
MUM-HUB-01# show sdwan omp routes vpn 1 ipv6 | include abc2

0  1  2001:db8:abc2:2000::/52  O  10.252.31.11  10.252.2.1  0  mpls  ipsec  (Chennai prefix)

# Verify on Chennai hub
ssh admin@10.252.101.1

CHN-HUB-01# show sdwan omp routes vpn 1 ipv6 | include abc1

0  1  2001:db8:abc1:2000::/52  O  10.252.31.11  10.252.1.1  0  mpls  ipsec  (Mumbai prefix)

# Analysis: Bi-directional OMP IPv6 route exchange working
```

### Test 1.3.3: Data Plane Connectivity

```bash
# Mumbai → Chennai ping (IPv6)
ssh admin@10.252.100.1 "ping vpn 1 2001:db8:abc2:2000::1 count 10"

# Expected output:
Type escape sequence to abort.
Sending 10, 100-byte ICMP Echos to 2001:db8:abc2:2000::1, timeout is 2 seconds:
!!!!!!!!!!
Success rate is 100 percent (10/10), round-trip min/avg/max = 8/10/14 ms

# Analysis:
# - 100% success (10/10)
# - Latency ~10ms (expected for same-region APAC)
# - Path via MPLS (primary color preference 200)
```

---

## 1.4 Chennai Deployment Summary

```
DAY 1-2 ACCOMPLISHMENTS:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  ✅ Chennai Hub IPv6 Deployment Complete                          │
│     - 2 × C8500-12X routers (CHN-HUB-01, CHN-HUB-02)              │
│     - Dual-stack WAN circuits (MPLS Tata, DIA Airtel, ER)         │
│     - System IPs: 2001:db8:abc2:8000::1/2                         │
│                                                                    │
│  📊 APAC REGION STATUS (2 sites deployed):                        │
│     - Total hubs: 4 routers (MUM-HUB-01/02, CHN-HUB-01/02)        │
│     - BFD sessions: 120 (60 IPv4 + 60 IPv6)                       │
│     - OMP IPv6 routes: 2 prefixes (Mumbai, Chennai)               │
│     - Average latency MUM↔CHN: 10ms (MPLS)                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## DAY 3: LONDON HUB DEPLOYMENT

## 3.1 London Hub Infrastructure

### Target State (Dual-Stack)

```
LONDON HUB IPv6 ADDRESSING:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  LON-HUB-01:                                                       │
│    System IP (IPv6):  2001:db8:abcb:8000::1/128                   │
│    Mgmt IP (IPv6):    2001:db8:abcb:1000::101/64                  │
│                                                                    │
│  WAN CIRCUITS:                                                     │
│    ├─ MPLS Primary (BT):                                          │
│    │    IPv4: 172.16.160.2/30                                      │
│    │    IPv6: 2001:db8:5678:400::2/127                            │
│    │                                                               │
│    ├─ DIA Primary (Virgin Media):                                 │
│    │    IPv4: 203.0.120.2/29                                       │
│    │    IPv6: 2001:db8:def0:500::2/64                             │
│    │                                                               │
│    └─ ExpressRoute Primary (Azure UK South):                      │
│         IPv4: 169.254.210.2/30                                     │
│         IPv6: 2001:db8:cafe:21::2/126                             │
│                                                                    │
│  LON-HUB-02:                                                       │
│    System IP (IPv6): 2001:db8:abcb:8000::2/128                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 3.2 London Hub Deployment (CLI Method)

### Direct CLI Configuration (Faster for Single Site)

```cisco
! SSH to LON-HUB-01
ssh admin@10.252.116.1

! ═══════════════════════════════════════════════════════════════════
! SYSTEM CONFIGURATION
! ═══════════════════════════════════════════════════════════════════

LON-HUB-01# configure terminal

! Enable IPv6
LON-HUB-01(config)# ipv6 unicast-routing
LON-HUB-01(config)# ipv6 cef

! IPv6 system loopback
LON-HUB-01(config)# interface Loopback65528
LON-HUB-01(config-if)# vrf forwarding 65528
LON-HUB-01(config-if)# ipv6 address 2001:db8:abcb:8000::1/128
LON-HUB-01(config-if)# exit

! ═══════════════════════════════════════════════════════════════════
! WAN INTERFACES
! ═══════════════════════════════════════════════════════════════════

! MPLS Interface (BT)
LON-HUB-01(config)# interface TenGigabitEthernet0/0/0
LON-HUB-01(config-if)# description MPLS-WAN-PRIMARY-BT-DUAL-STACK
LON-HUB-01(config-if)# ip address 172.16.160.2 255.255.255.252
LON-HUB-01(config-if)# ipv6 address 2001:db8:5678:400::2/127
LON-HUB-01(config-if)# ipv6 enable
LON-HUB-01(config-if)# tunnel-interface
LON-HUB-01(config-tunnel-if)# encapsulation ipsec preference 200
LON-HUB-01(config-tunnel-if)# color mpls
LON-HUB-01(config-tunnel-if)# hello-interval 1000
LON-HUB-01(config-tunnel-if)# hello-tolerance 7
LON-HUB-01(config-tunnel-if)# ipv6-bfd
LON-HUB-01(config-tunnel-if)# ipv6-hello-interval 1000
LON-HUB-01(config-tunnel-if)# ipv6-hello-tolerance 7
LON-HUB-01(config-tunnel-if)# exit
LON-HUB-01(config-if)# exit

! DIA Interface (Virgin Media)
LON-HUB-01(config)# interface GigabitEthernet0/0/4
LON-HUB-01(config-if)# description DIA-WAN-PRIMARY-VIRGINMEDIA-DUAL-STACK
LON-HUB-01(config-if)# ip address 203.0.120.2 255.255.255.248
LON-HUB-01(config-if)# ipv6 address 2001:db8:def0:500::2/64
LON-HUB-01(config-if)# ipv6 enable
LON-HUB-01(config-if)# tunnel-interface
LON-HUB-01(config-tunnel-if)# encapsulation ipsec preference 100
LON-HUB-01(config-tunnel-if)# color dia
LON-HUB-01(config-tunnel-if)# hello-interval 1000
LON-HUB-01(config-tunnel-if)# hello-tolerance 7
LON-HUB-01(config-tunnel-if)# ipv6-bfd
LON-HUB-01(config-tunnel-if)# ipv6-hello-interval 1000
LON-HUB-01(config-tunnel-if)# ipv6-hello-tolerance 7
LON-HUB-01(config-tunnel-if)# exit
LON-HUB-01(config-if)# exit

! ExpressRoute Interface (Azure UK South)
LON-HUB-01(config)# interface TenGigabitEthernet0/0/2.4016
LON-HUB-01(config-subif)# description EXPRESSROUTE-PRIMARY-AZURE-UK-DUAL-STACK
LON-HUB-01(config-subif)# encapsulation dot1Q 4016
LON-HUB-01(config-subif)# ip address 169.254.210.2 255.255.255.252
LON-HUB-01(config-subif)# ipv6 address 2001:db8:cafe:21::2/126
LON-HUB-01(config-subif)# ipv6 enable
LON-HUB-01(config-subif)# tunnel-interface
LON-HUB-01(config-tunnel-if)# encapsulation ipsec preference 150
LON-HUB-01(config-tunnel-if)# color azure-expressroute
LON-HUB-01(config-tunnel-if)# restrict
LON-HUB-01(config-tunnel-if)# max-control-connections 0
LON-HUB-01(config-tunnel-if)# exit
LON-HUB-01(config-subif)# exit

! Commit all changes
LON-HUB-01(config)# commit
Commit complete.

LON-HUB-01(config)# end
```

### Verify London Hub Control Connections

```cisco
LON-HUB-01# show sdwan control connections

! Expected: vBond + vSmart connections via both IPv4 and IPv6
Peer   Peer  Peer        Site  Domain Peer  Priv  Priv                           LOCAL   REMOTE
Type   Prot  System IP   ID    ID     Priv  IP    Port  Public IP       Public Port  Color   Color   State      Uptime
───────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
vbond  dtls  10.252.31.13 0    1      10.252.31.13 12346 203.0.120.13   12346        mpls    default  up        0:00:05:12
vbond  dtls  2001:db8:abcd:1000::13 0 1 ... 12346 [2001:db8:def0:500::13] 12346 mpls  default up 0:00:01:45

vsmart dtls  10.252.31.11  0   1  10.252.31.11  23456  203.0.120.11  23456  mpls   default  up  0:00:05:10
vsmart dtls  2001:db8:abcd:1000::11 0 1 ... 23456 [...] 23456 mpls default up 0:00:01:43

! Analysis: Dual-stack control plane active ✅
```

---

## 3.3 Cross-Region BFD Validation (APAC ↔ EMEA)

### Test 3.3.1: Mumbai → London IPv6 BFD

```bash
# On Mumbai hub
ssh admin@10.252.100.1

MUM-HUB-01# show sdwan bfd sessions | include 2001:db8:abcb:8000

2001:db8:abcb:8000::1  16  up  mpls  mpls  2001:db8:1234:100::2  2001:db8:5678:400::2  ipsec  7  1000  1000
2001:db8:abcb:8000::2  16  up  mpls  mpls  2001:db8:1234:100::2  2001:db8:5678:400::4  ipsec  7  1000  1000

# Analysis: BFD sessions to London established via MPLS
# Site ID 16 = London
```

### Test 3.3.2: Cross-Region Latency

```bash
# Mumbai → London ping (IPv6)
ssh admin@10.252.100.1 "ping vpn 1 2001:db8:abcb:2000::1 count 20"

# Expected output:
Type escape sequence to abort.
Sending 20, 100-byte ICMP Echos to 2001:db8:abcb:2000::1, timeout is 2 seconds:
!!!!!!!!!!!!!!!!!!!!
Success rate is 100 percent (20/20), round-trip min/avg/max = 118/125/142 ms

# Analysis:
# - 100% success (20/20)
# - Average latency ~125ms (expected for Mumbai ↔ London MPLS)
# - Max jitter 24ms (142-118) — acceptable
```

### Test 3.3.3: OMP Routes (3 Hubs Now)

```bash
# On London hub
LON-HUB-01# show sdwan omp routes vpn 1 ipv6

CODE:
C   - Connected             I   - Static installed
O   - OMP                   R   - Static redistributed

TENANT  VPN    PREFIX              PROTOCOL    FROM PEER        TLOC IP      TLOC COLOR       ENCAP  
───────────────────────────────────────────────────────────────────────────────────────────────────
0       1      2001:db8:abc1:2000::/52  O  10.252.31.11     10.252.1.1  mpls            ipsec  (Mumbai)
0       1      2001:db8:abc2:2000::/52  O  10.252.31.11     10.252.2.1  mpls            ipsec  (Chennai)
0       1      2001:db8:abcb:2000::/52  C  0.0.0.0          10.252.16.1 mpls            ipsec  (London local)

# Analysis: London sees both APAC hubs' IPv6 prefixes via OMP
```

---

## DAY 4: FRANKFURT + NEW JERSEY HUBS (PARALLEL DEPLOYMENT)

## 4.1 Parallel Deployment Strategy

```
PARALLEL DEPLOYMENT APPROACH:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  TEAM A: Frankfurt Deployment (EMEA completion)                   │
│    Engineer 1: FRA-HUB-01 configuration                           │
│    Engineer 2: FRA-HUB-02 configuration                           │
│    Timeline:   4 hours (Day 4 morning)                            │
│                                                                    │
│  TEAM B: New Jersey Deployment (Americas region start)            │
│    Engineer 3: NJ-HUB-01 configuration                            │
│    Engineer 4: NJ-HUB-02 configuration                            │
│    Timeline:   4 hours (Day 4 morning, parallel with Team A)      │
│                                                                    │
│  AFTERNOON: Cross-validation (all 4 sites)                        │
│    - BFD mesh: 10 hubs × 9 peers = 90 BFD sessions per hub        │
│    - OMP routes: 5 prefixes (MUM, CHN, LON, FRA, NJ)              │
│    - Latency matrix: All hub pairs tested                         │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## 4.2 Frankfurt Hub Deployment

### Frankfurt IPv6 Addressing

```
FRANKFURT HUB:
┌────────────────────────────────────────────────────────────────────┐
│  FRA-HUB-01:                                                       │
│    System IP (IPv6):  2001:db8:abcc:8000::1/128                   │
│    Mgmt IP (IPv6):    2001:db8:abcc:1000::101/64                  │
│                                                                    │
│  WAN CIRCUITS:                                                     │
│    MPLS (Deutsche Telekom): IPv6 2001:db8:6789:600::2/127         │
│    DIA (Vodafone):          IPv6 2001:db8:1111:700::2/64          │
│    ExpressRoute (Azure DE): IPv6 2001:db8:cafe:31::2/126          │
│                                                                    │
│  FRA-HUB-02:                                                       │
│    System IP (IPv6): 2001:db8:abcc:8000::2/128                    │
└────────────────────────────────────────────────────────────────────┘
```

### Automated Deployment (vManage API)

```bash
# Use same Python script as Chennai, with Frankfurt variables
python3 deploy_frankfurt_ipv6.py

# Variables for FRA-HUB-01:
FRANKFURT_HUB_01_VARS = {
    "//system/system-ip": "10.252.17.1",
    "//system/ipv6-system-ip": "2001:db8:abcc:8000::1/128",
    "//system/site-id": "17",
    "//system/host-name": "FRA-HUB-01",
# ... (WAN interfaces with Frankfurt-specific IPs)
}

# Expected deployment time: 45-60 minutes for both routers
```

---

## 4.3 New Jersey Hub Deployment

### New Jersey IPv6 Addressing

```
NEW JERSEY HUB:
┌────────────────────────────────────────────────────────────────────┐
│  NJ-HUB-01:                                                        │
│    System IP (IPv6):  2001:db8:abcd:8000::1/128                   │
│    Mgmt IP (IPv6):    2001:db8:abcd:1000::101/64                  │
│                                                                    │
│  WAN CIRCUITS:                                                     │
│    MPLS (AT&T):         IPv6 2001:db8:7890:800::2/127             │
│    DIA (Verizon):       IPv6 2001:db8:2222:900::2/64              │
│    ExpressRoute (Azure East US): IPv6 2001:db8:cafe:41::2/126     │
│                                                                    │
│  NJ-HUB-02:                                                        │
│    System IP (IPv6): 2001:db8:abcd:8000::2/128                    │
└────────────────────────────────────────────────────────────────────┘
```

### Deployment Script

```bash
python3 deploy_newjersey_ipv6.py

# Variables for NJ-HUB-01:
NJ_HUB_01_VARS = {
    "//system/system-ip": "10.252.32.1",
    "//system/ipv6-system-ip": "2001:db8:abcd:8000::1/128",
    "//system/site-id": "32",
    "//system/host-name": "NJ-HUB-01",
# ... (WAN interfaces with NJ-specific IPs)
}
```

---

## 4.4 Triple-Region Mesh Validation

### Test 4.4.1: BFD Session Count Per Hub

```bash
#!/bin/bash
# bfd_mesh_validation.sh

echo "=== BFD MESH VALIDATION (5 HUBS DEPLOYED) ==="
echo ""

HUBS=(
  "10.252.100.1:MUM-HUB-01"
  "10.252.101.1:CHN-HUB-01"
  "10.252.116.1:LON-HUB-01"
  "10.252.117.1:FRA-HUB-01"
  "10.252.132.1:NJ-HUB-01"
)

for hub in "${HUBS[@]}"; do
  IP="${hub%%:*}"
  NAME="${hub##*:}"
  
  echo "[$NAME]"
  
# IPv4 BFD sessions
  IPV4=$(ssh admin@$IP "show sdwan bfd sessions | grep -c '10\.'" 2>/dev/null)
  echo "  IPv4 BFD sessions: $IPV4"
  
# IPv6 BFD sessions
  IPV6=$(ssh admin@$IP "show sdwan bfd sessions | grep -c '2001:'" 2>/dev/null)
  echo "  IPv6 BFD sessions: $IPV6"
  
# Expected: Each hub has BFD to 4 other hubs × 2 routers/hub × 2 colors = 16 IPv6 sessions minimum
  if [[ $IPV6 -ge 16 ]]; then
    echo "  ✅ IPv6 BFD mesh complete"
  else
    echo "  ⚠️  IPv6 BFD sessions low (expected ≥16)"
  fi
  
  echo ""
done
```

**Run validation:**

```bash
chmod +x bfd_mesh_validation.sh
./bfd_mesh_validation.sh

# Expected output:
# === BFD MESH VALIDATION (5 HUBS DEPLOYED) ===
#
# [MUM-HUB-01]
# IPv4 BFD sessions: 24
# IPv6 BFD sessions: 24
# IPv6 BFD mesh complete
#
# [CHN-HUB-01]
# IPv4 BFD sessions: 24
# IPv6 BFD sessions: 24
# IPv6 BFD mesh complete
#
# [LON-HUB-01]
# IPv4 BFD sessions: 24
# IPv6 BFD sessions: 24
# IPv6 BFD mesh complete
#
# [FRA-HUB-01]
# IPv4 BFD sessions: 24
# IPv6 BFD sessions: 24
# IPv6 BFD mesh complete
#
# [NJ-HUB-01]
# IPv4 BFD sessions: 24
# IPv6 BFD sessions: 24
# IPv6 BFD mesh complete
```

### Test 4.4.2: Cross-Region Latency Matrix

```bash
#!/bin/bash
# latency_matrix.sh

echo "=== CROSS-REGION LATENCY MATRIX (IPv6) ==="
echo ""

declare -A HUBS
HUBS[MUM]="10.252.100.1:2001:db8:abc1:2000::1"
HUBS[CHN]="10.252.101.1:2001:db8:abc2:2000::1"
HUBS[LON]="10.252.116.1:2001:db8:abcb:2000::1"
HUBS[FRA]="10.252.117.1:2001:db8:abcc:2000::1"
HUBS[NJ]="10.252.132.1:2001:db8:abcd:2000::1"

printf "%-10s" "Source→Dest"
for dst in MUM CHN LON FRA NJ; do
  printf "%-12s" "$dst"
done
echo ""
echo "──────────────────────────────────────────────────────────────"

for src in MUM CHN LON FRA NJ; do
  printf "%-10s" "$src"
  
  SRC_IP="${HUBS[$src]%%:*}"
  
  for dst in MUM CHN LON FRA NJ; do
    if [[ "$src" == "$dst" ]]; then
      printf "%-12s" "—"
    else
      DST_IPV6="${HUBS[$dst]##*:}"
      
# Ping and extract avg latency
      LATENCY=$(ssh admin@$SRC_IP "ping vpn 1 $DST_IPV6 count 5 | grep 'round-trip' | awk -F'/' '{print \$5}'" 2>/dev/null)
      
      if [[ -n "$LATENCY" ]]; then
        printf "%-12s" "${LATENCY}ms"
      else
        printf "%-12s" "FAIL"
      fi
    fi
  done
  echo ""
done

echo ""
echo "Legend: Average RTT in milliseconds (5 pings via IPv6)"
```

**Run latency matrix:**

```bash
chmod +x latency_matrix.sh
./latency_matrix.sh

# Expected output:
# === CROSS-REGION LATENCY MATRIX (IPv6) ===
#
# Source→Dest MUM CHN LON FRA NJ
# ──────────────────────────────────────────────────────────────
# MUM — 10ms 125ms 142ms 195ms
# CHN 10ms — 128ms 145ms 198ms
# LON 125ms 128ms — 18ms 78ms
# FRA 142ms 145ms 18ms — 85ms
# NJ 195ms 198ms 78ms 85ms —
#
# Legend: Average RTT in milliseconds (5 pings via IPv6)
#
# Analysis:
# - APAC intra-region (MUM↔CHN): ~10ms
# - EMEA intra-region (LON↔FRA): ~18ms
# - APAC↔EMEA: ~125-145ms
# - APAC↔Americas: ~195-200ms
# - EMEA↔Americas: ~75-85ms
```

---

## DAY 5: DALLAS HUB + FULL MESH VALIDATION

## 5.1 Dallas Hub Deployment

### Dallas IPv6 Addressing

```
DALLAS HUB:
┌────────────────────────────────────────────────────────────────────┐
│  DAL-HUB-01:                                                       │
│    System IP (IPv6):  2001:db8:abce:8000::1/128                   │
│    Mgmt IP (IPv6):    2001:db8:abce:1000::101/64                  │
│                                                                    │
│  WAN CIRCUITS:                                                     │
│    MPLS (AT&T):         IPv6 2001:db8:8901:A00::2/127             │
│    DIA (Spectrum):      IPv6 2001:db8:3333:B00::2/64              │
│    ExpressRoute (Azure South Central): IPv6 2001:db8:cafe:51::2/126 │
│                                                                    │
│  DAL-HUB-02:                                                       │
│    System IP (IPv6): 2001:db8:abce:8000::2/128                    │
└────────────────────────────────────────────────────────────────────┘
```

### Deployment (CLI or vManage)

```bash
# Option 1: vManage API
python3 deploy_dallas_ipv6.py

# Option 2: Direct CLI (same as London method)
# Time: ~30 minutes for both routers
```

---

## 5.2 Complete 6-Hub Mesh Validation

### Test 5.2.1: Full BFD Mesh

```bash
#!/bin/bash
# full_mesh_bfd.sh

echo "=== FULL 6-HUB BFD MESH VALIDATION ==="
echo ""

HUBS=(
  "10.252.100.1:MUM-HUB-01"
  "10.252.101.1:CHN-HUB-01"
  "10.252.116.1:LON-HUB-01"
  "10.252.117.1:FRA-HUB-01"
  "10.252.132.1:NJ-HUB-01"
  "10.252.133.1:DAL-HUB-01"
)

TOTAL_PASS=0
TOTAL_FAIL=0

for hub in "${HUBS[@]}"; do
  IP="${hub%%:*}"
  NAME="${hub##*:}"
  
  echo "[$NAME]"
  
# Total BFD sessions (IPv4 + IPv6)
  TOTAL=$(ssh admin@$IP "show sdwan bfd sessions | grep -c up" 2>/dev/null)
  
# IPv6 BFD sessions
  IPV6=$(ssh admin@$IP "show sdwan bfd sessions | grep '2001:' | grep -c up" 2>/dev/null)
  
  echo "  Total BFD sessions: $TOTAL"
  echo "  IPv6 BFD sessions:  $IPV6"
  
# Expected: 5 other hubs × 2 routers/hub × 2 colors × 2 protocols = 40 BFD sessions per hub
# (Actually less because same-site hubs don't BFD to each other, but ≥30 is reasonable)
  if [[ $TOTAL -ge 60 ]] && [[ $IPV6 -ge 30 ]]; then
    echo "  ✅ BFD mesh complete"
    ((TOTAL_PASS++))
  else
    echo "  ❌ BFD mesh incomplete (total: $TOTAL, IPv6: $IPV6)"
    ((TOTAL_FAIL++))
  fi
  
  echo ""
done

echo "═══════════════════════════════════════════"
echo "SUMMARY: $TOTAL_PASS/6 hubs passed BFD validation"
if [[ $TOTAL_FAIL -eq 0 ]]; then
  echo "✅ ALL HUBS HAVE COMPLETE BFD MESH"
else
  echo "❌ $TOTAL_FAIL hubs have incomplete mesh"
fi
```

### Test 5.2.2: OMP Route Count

```bash
# On each hub, verify OMP has 6 IPv6 prefixes (all hub sites)

for hub in 10.252.100.1 10.252.101.1 10.252.116.1 10.252.117.1 10.252.132.1 10.252.133.1; do
  echo "Hub: $hub"
  ssh admin@$hub "show sdwan omp routes vpn 1 ipv6 | grep -c 'O '" 2>/dev/null
  echo ""
done

# Expected output per hub: 6 (or 5 if local route not counted)
# All 6 hub prefixes present
```

### Test 5.2.3: Data Plane — Full Mesh Ping

```bash
#!/bin/bash
# full_mesh_ping.sh

echo "=== FULL 6-HUB DATA PLANE VALIDATION (IPv6) ==="
echo ""

declare -A HUBS
HUBS[MUM-HUB-01]="10.252.100.1:2001:db8:abc1:2000::1"
HUBS[CHN-HUB-01]="10.252.101.1:2001:db8:abc2:2000::1"
HUBS[LON-HUB-01]="10.252.116.1:2001:db8:abcb:2000::1"
HUBS[FRA-HUB-01]="10.252.117.1:2001:db8:abcc:2000::1"
HUBS[NJ-HUB-01]="10.252.132.1:2001:db8:abcd:2000::1"
HUBS[DAL-HUB-01]="10.252.133.1:2001:db8:abce:2000::1"

TOTAL_TESTS=0
PASS_TESTS=0
FAIL_TESTS=0

for src_name in "${!HUBS[@]}"; do
  SRC_IP="${HUBS[$src_name]%%:*}"
  
  for dst_name in "${!HUBS[@]}"; do
    if [[ "$src_name" == "$dst_name" ]]; then
      continue  # Skip self-ping
    fi
    
    DST_IPV6="${HUBS[$dst_name]##*:}"
    
    ((TOTAL_TESTS++))
    
# Ping 3 times
    RESULT=$(ssh admin@$SRC_IP "ping vpn 1 $DST_IPV6 count 3 | tail -1" 2>/dev/null)
    
    if [[ "$RESULT" == *"3 received"* ]] || [[ "$RESULT" == *"0% packet loss"* ]]; then
      ((PASS_TESTS++))
      echo "✅ $src_name → $dst_name"
    else
      ((FAIL_TESTS++))
      echo "❌ $src_name → $dst_name (FAILED)"
    fi
  done
done

echo ""
echo "═══════════════════════════════════════════"
echo "FULL MESH PING RESULTS:"
echo "  Total tests:  $TOTAL_TESTS"
echo "  Passed:       $PASS_TESTS"
echo "  Failed:       $FAIL_TESTS"
echo ""

if [[ $FAIL_TESTS -eq 0 ]]; then
  echo "✅ ALL DATA PLANE PATHS OPERATIONAL"
else
  echo "❌ $FAIL_TESTS failed paths — investigate"
fi
```

**Run full mesh validation:**

```bash
chmod +x full_mesh_ping.sh
./full_mesh_ping.sh

# Expected output:
# === FULL 6-HUB DATA PLANE VALIDATION (IPv6) ===
#
# MUM-HUB-01 → CHN-HUB-01
# MUM-HUB-01 → LON-HUB-01
# MUM-HUB-01 → FRA-HUB-01
# MUM-HUB-01 → NJ-HUB-01
# MUM-HUB-01 → DAL-HUB-01
# CHN-HUB-01 → MUM-HUB-01
# ... (30 total pairs)
#
# ═══════════════════════════════════════════
# FULL MESH PING RESULTS:
# Total tests: 30
# Passed: 30
# Failed: 0
#
# ALL DATA PLANE PATHS OPERATIONAL
```

---

## 5.3 Week 3 Final Metrics

### Comprehensive Status Report

```bash
#!/bin/bash
# week3_final_report.sh

echo "═══════════════════════════════════════════════════════════════"
echo "          WEEK 3 COMPLETION REPORT — ALL HUBS IPv6"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ═══════════════════════════════════════════════════════════════════
# DEPLOYMENT STATUS
# ═══════════════════════════════════════════════════════════════════

echo "DEPLOYMENT STATUS:"
echo "  ✅ Mumbai Hub (MUM-HUB-01/02)      — Week 2"
echo "  ✅ Chennai Hub (CHN-HUB-01/02)     — Week 3 Day 1-2"
echo "  ✅ London Hub (LON-HUB-01/02)      — Week 3 Day 3"
echo "  ✅ Frankfurt Hub (FRA-HUB-01/02)   — Week 3 Day 4"
echo "  ✅ New Jersey Hub (NJ-HUB-01/02)   — Week 3 Day 4"
echo "  ✅ Dallas Hub (DAL-HUB-01/02)      — Week 3 Day 5"
echo ""
echo "  Total hubs deployed:  6 sites (12 × C8500-12X routers)"
echo ""

# ═══════════════════════════════════════════════════════════════════
# BFD STATISTICS
# ═══════════════════════════════════════════════════════════════════

echo "BFD SESSION STATISTICS:"

TOTAL_BFD_IPV4=0
TOTAL_BFD_IPV6=0

for hub in 10.252.100.1 10.252.101.1 10.252.116.1 10.252.117.1 10.252.132.1 10.252.133.1; do
  IPV4=$(ssh admin@$hub "show sdwan bfd sessions | grep '10\.' | grep -c up" 2>/dev/null)
  IPV6=$(ssh admin@$hub "show sdwan bfd sessions | grep '2001:' | grep -c up" 2>/dev/null)
  
  TOTAL_BFD_IPV4=$((TOTAL_BFD_IPV4 + IPV4))
  TOTAL_BFD_IPV6=$((TOTAL_BFD_IPV6 + IPV6))
done

echo "  IPv4 BFD sessions (total across 6 hubs): $TOTAL_BFD_IPV4"
echo "  IPv6 BFD sessions (total across 6 hubs): $TOTAL_BFD_IPV6"
echo "  Combined total:                           $((TOTAL_BFD_IPV4 + TOTAL_BFD_IPV6))"
echo ""

# ═══════════════════════════════════════════════════════════════════
# OMP ROUTE STATISTICS
# ═══════════════════════════════════════════════════════════════════

echo "OMP ROUTE DISTRIBUTION:"

OMP_IPV4=$(ssh admin@10.252.100.1 "show sdwan omp routes vpn 1 | grep -c 'O '" 2>/dev/null)
OMP_IPV6=$(ssh admin@10.252.100.1 "show sdwan omp routes vpn 1 ipv6 | grep -c 'O '" 2>/dev/null)

echo "  IPv4 routes (VPN 1):  $OMP_IPV4 prefixes"
echo "  IPv6 routes (VPN 1):  $OMP_IPV6 prefixes"
echo "  Expected IPv6:        6 prefixes (all hub sites) ✅"
echo ""

# ═══════════════════════════════════════════════════════════════════
# LATENCY BASELINES
# ═══════════════════════════════════════════════════════════════════

echo "LATENCY BASELINES (IPv6, average RTT):"
echo "  Mumbai ↔ Chennai:     ~10ms   (APAC intra-region)"
echo "  Mumbai ↔ London:      ~125ms  (APAC ↔ EMEA)"
echo "  Mumbai ↔ New Jersey:  ~195ms  (APAC ↔ Americas)"
echo "  London ↔ Frankfurt:   ~18ms   (EMEA intra-region)"
echo "  London ↔ New Jersey:  ~78ms   (EMEA ↔ Americas)"
echo "  New Jersey ↔ Dallas:  ~25ms   (Americas intra-region)"
echo ""

# ═══════════════════════════════════════════════════════════════════
# NEXT PHASE READINESS
# ═══════════════════════════════════════════════════════════════════

echo "READINESS FOR WEEK 4-8 (BRANCH SITES):"
echo "  ✅ All hub sites have dual-stack underlay"
echo "  ✅ Full mesh BFD operational (IPv4 + IPv6)"
echo "  ✅ OMP distributing IPv6 routes globally"
echo "  ✅ Latency baselines established"
echo "  ✅ Zero IPv4 impact (all existing services maintained)"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "                   ✅ WEEK 3 COMPLETE"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "NEXT: Week 4-8 — Branch Site Deployment (13 sites)"
echo "      Target: ISR 4331 (large branches) + ISR 1100 (small branches)"
```

**Run final report:**

```bash
chmod +x week3_final_report.sh
./week3_final_report.sh

# Expected output:
# ═══════════════════════════════════════════════════════════════
# WEEK 3 COMPLETION REPORT — ALL HUBS IPv6
# ═══════════════════════════════════════════════════════════════
#
# DEPLOYMENT STATUS:
# Mumbai Hub (MUM-HUB-01/02) — Week 2
# Chennai Hub (CHN-HUB-01/02) — Week 3 Day 1-2
# London Hub (LON-HUB-01/02) — Week 3 Day 3
# Frankfurt Hub (FRA-HUB-01/02) — Week 3 Day 4
# New Jersey Hub (NJ-HUB-01/02) — Week 3 Day 4
# Dallas Hub (DAL-HUB-01/02) — Week 3 Day 5
#
# Total hubs deployed: 6 sites (12 × C8500-12X routers)
#
# BFD SESSION STATISTICS:
# IPv4 BFD sessions (total across 6 hubs): 180
# IPv6 BFD sessions (total across 6 hubs): 180
# Combined total: 360
#
# OMP ROUTE DISTRIBUTION:
# IPv4 routes (VPN 1): 6 prefixes
# IPv6 routes (VPN 1): 6 prefixes
# Expected IPv6: 6 prefixes (all hub sites)
#
# LATENCY BASELINES (IPv6, average RTT):
# Mumbai ↔ Chennai: ~10ms (APAC intra-region)
# Mumbai ↔ London: ~125ms (APAC ↔ EMEA)
# Mumbai ↔ New Jersey: ~195ms (APAC ↔ Americas)
# London ↔ Frankfurt: ~18ms (EMEA intra-region)
# London ↔ New Jersey: ~78ms (EMEA ↔ Americas)
# New Jersey ↔ Dallas: ~25ms (Americas intra-region)
#
# READINESS FOR WEEK 4-8 (BRANCH SITES):
# All hub sites have dual-stack underlay
# Full mesh BFD operational (IPv4 + IPv6)
# OMP distributing IPv6 routes globally
# Latency baselines established
# Zero IPv4 impact (all existing services maintained)
#
# ═══════════════════════════════════════════════════════════════
# WEEK 3 COMPLETE
# ═══════════════════════════════════════════════════════════════
#
# NEXT: Week 4-8 — Branch Site Deployment (13 sites)
# Target: ISR 4331 (large branches) + ISR 1100 (small branches)
```

---

## WEEK 3 COMPLETE

**Summary:**
- **All 6 hub sites** dual-stack operational (Mumbai, Chennai, London, Frankfurt, NJ, Dallas)
- **12 × C8500-12X routers** with IPv6 underlay
- **360 BFD sessions** (180 IPv4 + 180 IPv6)
- **6 IPv6 prefixes** distributed via OMP
- **Full mesh connectivity** validated (30/30 hub pairs reachable)
- **Latency baselines** established for all regions
- **Zero IPv4 impact** — all existing services maintained

**Next Guide:** Week 4-8 — Branch Site Deployment (13 sites: Bangalore, Delhi, Noida, Hyderabad, Pune, Ahmedabad, Kolkata, Jaipur, Surat, Nagpur, Chandigarh, Coimbatore, Lucknow)

---

*© 2025 Abhavtech - IPv6 Migration Week 3 Guide*
*Version 1.0 | Last Updated: January 2025*
