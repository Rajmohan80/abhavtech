# ABHAVTECH IPv6 MIGRATION — WEEK 4-5
## BRANCH SITES IPv6 DEPLOYMENT (THREE ARCHETYPES)

**Project:** ABV-IPV6-2025  
**Week:** 4-5 of 44  
**Phase:** Phase 1 — SD-WAN Underlay IPv6 (Completion)  
**Duration:** 10 Days (2 weeks)  
**Objective:** Deploy IPv6 on representative branch sites covering all deployment models  
**Scope:** Bangalore (Large Branch), Noida (Small Branch + LTE), Hyderabad (Fabric-in-a-Box)  

---

## OVERVIEW: WHY THREE SITES INSTEAD OF THIRTEEN

```
BRANCH SITE DEPLOYMENT STRATEGY:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  PROBLEM: 13 branch sites with similar configurations             │
│           Documenting each individually = redundant + time waste  │
│                                                                    │
│  SOLUTION: Identify distinct archetypes, document those deeply    │
│            Remaining 10 sites replicate the patterns              │
│                                                                    │
│  THREE ARCHETYPES COVER ALL VARIATIONS:                           │
│                                                                    │
│  1️⃣ LARGE BRANCH (Bangalore — ISR 4331)                          │
│     - Dual WAN circuits (MPLS + DIA)                              │
│     - 500 users, multiple VLANs                                   │
│     - Full QoS, application-aware routing                         │
│     - Represents: Bangalore, Delhi, Noida (initial plans)         │
│                                                                    │
│  2️⃣ SMALL BRANCH + LTE (Noida — ISR 1100-4GLTENA)                │
│     - Single primary circuit + LTE backup                         │
│     - 150-200 users, simplified design                            │
│     - Cellular WAN edge with IPv6                                 │
│     - Represents: 10 small branches (Hyderabad, Pune, Ahmedabad,  │
│                   Kolkata, Jaipur, Surat, Nagpur, Chandigarh,     │
│                   Coimbatore, Lucknow)                            │
│                                                                    │
│  3️⃣ FABRIC-IN-A-BOX (Hyderabad — C9300-24UX)                     │
│     - Single device = SD-WAN edge + SD-Access fabric              │
│     - Combined underlay/overlay in one box                        │
│     - Perfect for 100-250 user sites                              │
│     - Represents: Future small campus deployments                 │
│                                                                    │
│  REPLICATION APPROACH:                                             │
│    Week 4:   Deploy 3 archetypes (detailed documentation)        │
│    Week 5:   Validate, create templates                          │
│    Week 6-8: NOC team replicates to remaining 10 sites           │
│              (using vManage templates, no new docs needed)        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

## WEEK 4: ARCHETYPE DEPLOYMENTS

## Day 1-3: BANGALORE (LARGE BRANCH)

### 1.1 Bangalore Infrastructure

```
BANGALORE BRANCH DETAILS:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  DEVICE: BLR-ISR-01                                                │
│    Model:        Cisco ISR 4331                                    │
│    IOS-XE:       17.15.1                                           │
│    Role:         Branch SD-WAN edge                                │
│    System IP:    10.252.50.1/32                                    │
│    Site ID:      50                                                │
│    Users:        500                                               │
│                                                                    │
│  WAN CIRCUITS:                                                     │
│    ├─ MPLS (Tata):                                                │
│    │    Interface: GigabitEthernet0/0/0                           │
│    │    IPv4: 172.16.50.2/30                                       │
│    │    Bandwidth: 100 Mbps                                        │
│    │                                                               │
│    └─ DIA (Airtel):                                               │
│         Interface: GigabitEthernet0/0/1                           │
│         IPv4: 203.0.150.2/29                                       │
│         Bandwidth: 50 Mbps                                         │
│                                                                    │
│  LAN INTERFACES:                                                   │
│    ├─ VPN 1 (Corporate): GigE0/0/2.10                             │
│    │    VLAN 10, IPv4: 192.168.50.1/24                            │
│    │    500 users (DHCP pool .10-.250)                            │
│    │                                                               │
│    ├─ VPN 2 (Guest): GigE0/0/2.20                                 │
│    │    VLAN 20, IPv4: 192.168.51.1/24                            │
│    │    Guest WiFi                                                 │
│    │                                                               │
│    └─ VPN 5 (Voice): GigE0/0/2.50                                 │
│         VLAN 50, IPv4: 192.168.55.1/24                            │
│         Webex phones                                               │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 1.2 Bangalore IPv6 Addressing Plan

```
BANGALORE IPv6 ALLOCATION (from 2001:db8:abc3::/48):
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  SYSTEM:                                                           │
│    System IP (IPv6):  2001:db8:abc3:8000::1/128                   │
│    Management:        2001:db8:abc3:1000::50/64                   │
│                                                                    │
│  WAN CIRCUITS (IPv6):                                              │
│    MPLS (Tata):       2001:db8:1234:50::2/127                     │
│    DIA (Airtel):      2001:db8:9abc:50::2/64                      │
│                                                                    │
│  SERVICE VPNs (IPv6):                                              │
│    VPN 1 (Corporate): 2001:db8:abc3:2010::/64                     │
│      Gateway: 2001:db8:abc3:2010::1                               │
│      DHCP pool: Stateless (SLAAC)                                 │
│                                                                    │
│    VPN 2 (Guest):     2001:db8:abc3:3020::/64                     │
│      Gateway: 2001:db8:abc3:3020::1                               │
│                                                                    │
│    VPN 5 (Voice):     2001:db8:abc3:6050::/64                     │
│      Gateway: 2001:db8:abc3:6050::1                               │
│      DHCPv6: Stateless (Webex endpoints prefer SLAAC)             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### 1.3 Bangalore Deployment (vManage Templates)

#### System Template for Bangalore

```
vManage → Configuration → Templates → Feature Templates → Add Template

TEMPLATE NAME: ABV-System-IPv6-Branch-ISR4331
Device Type: vedge-ISR-4331
Template Type: System

┌────────────────────────────────────────────────────────────────────┐
│ Basic Configuration                                                │
├────────────────────────────────────────────────────────────────────┤
│ Hostname:              {{system_hostname}}                         │
│ System IP:             {{system_ip}}                               │
│ IPv6 System IP:        {{system_ipv6}}                            │
│ Site ID:               {{site_id}}                                 │
│ Organization:          Abhavtech                                   │
│ vBond:                 vbond.abhavtech.com                         │
│ Timezone:              Asia/Kolkata                               │
│                                                                    │
│ Control Session PPS:   300                                        │
│ Max OMP Sessions:      2  (branch connects to 2 vSmarts)          │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### VPN 0 MPLS Interface Template

```
TEMPLATE NAME: ABV-IF-VPN0-MPLS-IPv6-Branch
Device Type: vedge-ISR-4331
Template Type: VPN Interface Ethernet

┌────────────────────────────────────────────────────────────────────┐
│ Interface Name:        GigabitEthernet0/0/0                        │
│ Description:           MPLS-WAN-PRIMARY-DUAL-STACK                 │
│                                                                    │
│ IPv4 Address:          {{mpls_ipv4}}                              │
│   Example: 172.16.50.2/30                                         │
│                                                                    │
│ IPv6 Address:          {{mpls_ipv6}}                              │
│   Example: 2001:db8:1234:50::2/127                               │
│                                                                    │
│ Tunnel:                On                                         │
│ Color:                 mpls                                       │
│ Encapsulation:         ipsec                                      │
│ Preference:            200  (primary)                             │
│                                                                    │
│ BFD:                                                              │
│   IPv4 BFD:            Enabled (1000ms / mult 7)                  │
│   IPv6 BFD:            Enabled (1000ms / mult 7)                  │
│                                                                    │
│ Bandwidth Upstream:    100000  (100 Mbps)                         │
│ Bandwidth Downstream:  100000                                     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### VPN 0 DIA Interface Template

```
TEMPLATE NAME: ABV-IF-VPN0-DIA-IPv6-Branch
Device Type: vedge-ISR-4331

┌────────────────────────────────────────────────────────────────────┐
│ Interface Name:        GigabitEthernet0/0/1                        │
│ Description:           DIA-WAN-BACKUP-DUAL-STACK                   │
│                                                                    │
│ IPv4 Address:          {{dia_ipv4}}                               │
│   Example: 203.0.150.2/29                                         │
│                                                                    │
│ IPv6 Address:          {{dia_ipv6}}                               │
│   Example: 2001:db8:9abc:50::2/64                                │
│                                                                    │
│ Tunnel:                On                                         │
│ Color:                 dia                                        │
│ Preference:            100  (backup to MPLS)                      │
│                                                                    │
│ BFD:                                                              │
│   IPv4 BFD:            Enabled                                    │
│   IPv6 BFD:            Enabled                                    │
│                                                                    │
│ NAT:                   On  (DIA requires NAT for IPv4 internet)   │
│   NAT Type:            Interface                                  │
│   UDP Timeout:         1                                          │
│   TCP Timeout:         60                                         │
│                                                                    │
│ Bandwidth:             50000  (50 Mbps)                           │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

#### VPN 1 Service Interface Template (Corporate LAN)

```
TEMPLATE NAME: ABV-IF-VPN1-Corporate-IPv6-Branch
Device Type: vedge-ISR-4331
Template Type: VPN Interface Ethernet

┌────────────────────────────────────────────────────────────────────┐
│ Interface Name:        GigabitEthernet0/0/2.10                     │
│ Description:           CORPORATE-LAN-DUAL-STACK                    │
│ Encapsulation:         dot1Q                                      │
│ VLAN ID:               10                                         │
│                                                                    │
│ IPv4 Configuration:                                                │
│   IP Address:          {{vpn1_ipv4}}                              │
│     Example: 192.168.50.1/24                                      │
│   DHCP Helper:         10.252.31.15  (ISE DHCP)                   │
│                                                                    │
│ IPv6 Configuration:                                                │
│   IPv6 Address:        {{vpn1_ipv6}}                              │
│     Example: 2001:db8:abc3:2010::1/64                            │
│   IPv6 RA:             Enabled                                    │
│     Managed Flag:      Off  (SLAAC only)                          │
│     Other Config:      On   (DNS via RA)                          │
│   DNS Server (IPv6):   2001:db8:abc1:1000::53                    │
│                                                                    │
│ ACL:                                                              │
│   IPv4 ACL (Inbound):  CORPORATE-IN-ACL                           │
│   IPv6 ACL (Inbound):  CORPORATE-IN-v6-ACL                        │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### 1.4 Bangalore Deployment Script

```python
#!/usr/bin/env python3
"""
Deploy IPv6 to Bangalore branch via vManage API
ISR 4331 with dual WAN circuits
"""

import requests
import json
import time

VMANAGE = "https://vmanage.abhavtech.com"
USERNAME = "admin"
PASSWORD = "<password>"

BANGALORE_VARS = {
# System
    "//system/system-ip": "10.252.50.1",
    "//system/ipv6-system-ip": "2001:db8:abc3:8000::1/128",
    "//system/site-id": "50",
    "//system/host-name": "BLR-ISR-01",
    
# VPN 0 - MPLS
    "//vpn-0-interface-mpls/if-name": "GigabitEthernet0/0/0",
    "//vpn-0-interface-mpls/mpls_ipv4": "172.16.50.2/30",
    "//vpn-0-interface-mpls/mpls_ipv6": "2001:db8:1234:50::2/127",
    "//vpn-0-interface-mpls/bandwidth": "100000",
    
# VPN 0 - DIA
    "//vpn-0-interface-dia/if-name": "GigabitEthernet0/0/1",
    "//vpn-0-interface-dia/dia_ipv4": "203.0.150.2/29",
    "//vpn-0-interface-dia/dia_ipv6": "2001:db8:9abc:50::2/64",
    "//vpn-0-interface-dia/bandwidth": "50000",
    
# VPN 1 - Corporate LAN
    "//vpn-1-interface/if-name": "GigabitEthernet0/0/2.10",
    "//vpn-1-interface/vlan": "10",
    "//vpn-1-interface/vpn1_ipv4": "192.168.50.1/24",
    "//vpn-1-interface/vpn1_ipv6": "2001:db8:abc3:2010::1/64",
    
# VPN 2 - Guest
    "//vpn-2-interface/if-name": "GigabitEthernet0/0/2.20",
    "//vpn-2-interface/vlan": "20",
    "//vpn-2-interface/vpn2_ipv4": "192.168.51.1/24",
    "//vpn-2-interface/vpn2_ipv6": "2001:db8:abc3:3020::1/64",
    
# VPN 5 - Voice
    "//vpn-5-interface/if-name": "GigabitEthernet0/0/2.50",
    "//vpn-5-interface/vlan": "50",
    "//vpn-5-interface/vpn5_ipv4": "192.168.55.1/24",
    "//vpn-5-interface/vpn5_ipv6": "2001:db8:abc3:6050::1/64",
    
# VPN 512 - Management
    "//vpn-512/mgmt_ipv4": "10.252.150.1/24",
    "//vpn-512/mgmt_ipv6": "2001:db8:abc3:1000::50/64",
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

def attach_template(session, device_id, variables):
    """Attach device template"""
    template_id = "yyyy-yyyy-yyyy-yyyy"  # ABV-DeviceTemplate-Branch-ISR4331-IPv6
    
    payload = {
        "deviceTemplateList": [{
            "templateId": template_id,
            "device": [{
                "csv-deviceId": device_id,
                "csv-deviceIP": "10.252.150.1",
                "csv-host-name": "BLR-ISR-01",
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
        print(f"✅ Template attach initiated: {action_id}")
        return action_id
    else:
        print(f"❌ Template attach failed: {response.text}")
        return None

def wait_for_action(session, action_id, timeout=600):
    """Poll until complete"""
    url = f"{VMANAGE}/dataservice/device/action/status/{action_id}"
    start = time.time()
    
    while time.time() - start < timeout:
        response = session.get(url, verify=False)
        data = response.json()['data'][0]
        
        status = data.get('status')
        
        if status == "done":
            print(f"✅ Complete in {int(time.time() - start)}s")
            return True
        elif status == "failure":
            print(f"❌ Failed: {data}")
            return False
        
        print(f"  {status}...")
        time.sleep(15)
    
    return False

if __name__ == "__main__":
    print("=== BANGALORE BRANCH IPv6 DEPLOYMENT ===")
    
    session = vmanage_login()
    print("✅ Logged into vManage\n")
    
    device_id = "ISR4331-BLR-SERIAL"
    action = attach_template(session, device_id, BANGALORE_VARS)
    
    if action:
        success = wait_for_action(session, action)
        if success:
            print("\n✅ BANGALORE IPv6 DEPLOYMENT COMPLETE")
        else:
            print("\n❌ Deployment failed")
```

**Run Bangalore deployment:**

```bash
python3 deploy_bangalore_ipv6.py

# Expected: 45-60 minutes deployment time
```

---

### 1.5 Bangalore Validation

```bash
#!/bin/bash
# validate_bangalore.sh

echo "=== BANGALORE BRANCH IPv6 VALIDATION ==="

# Test 1: Control connections
echo "Test 1: Control Plane"
ssh admin@10.252.150.1 "show sdwan control connections | grep vsmart | wc -l"
# Expected: 4 (2 vSmarts × IPv4+IPv6)

# Test 2: BFD to hubs
echo "Test 2: BFD Sessions to Hubs"
ssh admin@10.252.150.1 "show sdwan bfd sessions | grep '2001:' | wc -l"
# Expected: 12 (6 hubs × 2 routers/hub = 12 IPv6 BFD sessions)

# Test 3: OMP routes received
echo "Test 3: OMP IPv6 Routes"
ssh admin@10.252.150.1 "show sdwan omp routes vpn 1 ipv6 | grep -c 'O '"
# Expected: 6+ (all hub prefixes)

# Test 4: Local LAN reachable
echo "Test 4: LAN IPv6 Connectivity"
ssh admin@10.252.150.1 "ping vpn 1 2001:db8:abc3:2010::50 count 3"
# Expected: 3/3 success (test client on LAN)

# Test 5: Internet reachability (IPv6)
echo "Test 5: Internet IPv6 via DIA"
ssh admin@10.252.150.1 "ping vpn 1 2001:4860:4860::8888 count 3"
# Expected: 3/3 success (Google DNS IPv6)

echo ""
echo "✅ Bangalore validation complete"
```

---

## Day 4-6: NOIDA (SMALL BRANCH + LTE)

### 2.1 Noida Infrastructure

```
NOIDA BRANCH DETAILS (SMALL + CELLULAR):
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  DEVICE: NOI-ISR-01                                                │
│    Model:        Cisco ISR 1100-4GLTENA                            │
│    IOS-XE:       17.15.1                                           │
│    Role:         Small branch with LTE backup                      │
│    System IP:    10.252.55.1/32                                    │
│    Site ID:      55                                                │
│    Users:        200                                               │
│                                                                    │
│  WAN CIRCUITS:                                                     │
│    ├─ Primary (Airtel Fiber):                                     │
│    │    Interface: GigabitEthernet0/0/0                           │
│    │    IPv4: 203.0.155.2/29                                       │
│    │    Bandwidth: 50 Mbps                                         │
│    │                                                               │
│    └─ Backup (Jio LTE):                                           │
│         Interface: Cellular0/2/0                                   │
│         IPv4: DHCP (carrier-assigned)                             │
│         IPv6: SLAAC (carrier CGN provides IPv6)                   │
│         Bandwidth: 25 Mbps                                         │
│                                                                    │
│  LAN:                                                              │
│    ├─ VPN 1: GigE0/0/1 (single VLAN, simple)                      │
│    │    IPv4: 192.168.55.1/24                                      │
│    │    200 users                                                  │
│    │                                                               │
│    └─ WiFi AP: Connected to GigE0/0/1                             │
│         Corporate + Guest SSIDs                                    │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 2.2 Noida IPv6 Addressing

```
NOIDA IPv6 (from 2001:db8:abc5::/48):
┌────────────────────────────────────────────────────────────────────┐
│  System IP (IPv6):    2001:db8:abc5:8000::1/128                   │
│  Management:          2001:db8:abc5:1000::55/64                   │
│                                                                    │
│  WAN:                                                              │
│    Primary (Airtel):  2001:db8:9abc:155::2/64                     │
│    LTE (Jio):         Auto-config via SLAAC from carrier          │
│                       (Typical: 2405:xxxx:xxxx:xxxx::/64)         │
│                                                                    │
│  LAN (VPN 1):         2001:db8:abc5:2001::/64                     │
│    Gateway:           2001:db8:abc5:2001::1                       │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### 2.3 Noida LTE IPv6 Configuration

#### Cellular Interface Template

```
TEMPLATE NAME: ABV-IF-VPN0-LTE-IPv6-Branch
Device Type: vedge-ISR-1100-4GLTENA
Template Type: VPN Interface Cellular

┌────────────────────────────────────────────────────────────────────┐
│ Interface Name:        Cellular0/2/0                               │
│ Description:           LTE-BACKUP-JIO-DUAL-STACK                   │
│                                                                    │
│ Profile:               1                                          │
│ APN:                   jionet  (Jio APN)                          │
│                                                                    │
│ IPv4 Configuration:                                                │
│   Address:             Negotiated (via DHCP from tower)           │
│                                                                    │
│ IPv6 Configuration:                                                │
│   IPv6 Address:        Autoconfig                                 │
│     Type:              SLAAC                                      │
│     Accept RA:         Yes                                        │
│     Default Route:     From RA                                    │
│                                                                    │
│ Tunnel:                On                                         │
│ Color:                 lte                                        │
│ Preference:            50  (lowest — last resort)                 │
│ Restrict:              Off                                        │
│                                                                    │
│ BFD:                                                              │
│   IPv4 BFD:            Enabled                                    │
│   IPv6 BFD:            Enabled                                    │
│   Hello Interval:      1000ms                                     │
│   Multiplier:          7                                          │
│                                                                    │
│ Bandwidth:             25000  (25 Mbps)                           │
│                                                                    │
│ NAT:                   On  (LTE typically behind carrier CGN)     │
│   Type:                Interface                                  │
│                                                                    │
│ Access Control:                                                   │
│   Allowed Services:    All  (control + data over LTE)             │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘

NOTES ON LTE IPv6:
  - Jio/Airtel provide native IPv6 via SLAAC (no DHCPv6 needed)
  - IPv4 is typically via carrier-grade NAT (CGNAT)
  - IPv6 provides direct public addressing (no NAT required)
  - SD-WAN BFD works over both IPv4 CGNAT and IPv6
  - Prefer IPv6 for control plane on LTE (better performance)
```

---

### 2.4 Noida Deployment

```python
#!/usr/bin/env python3
"""
Deploy IPv6 to Noida branch (ISR 1100 + LTE)
"""

NOIDA_VARS = {
# System
    "//system/system-ip": "10.252.55.1",
    "//system/ipv6-system-ip": "2001:db8:abc5:8000::1/128",
    "//system/site-id": "55",
    "//system/host-name": "NOI-ISR-01",
    
# VPN 0 - Primary WAN (Airtel Fiber)
    "//vpn-0-interface-primary/if-name": "GigabitEthernet0/0/0",
    "//vpn-0-interface-primary/primary_ipv4": "203.0.155.2/29",
    "//vpn-0-interface-primary/primary_ipv6": "2001:db8:9abc:155::2/64",
    "//vpn-0-interface-primary/bandwidth": "50000",
    "//vpn-0-interface-primary/color": "dia",
    
# VPN 0 - LTE Backup (Jio)
    "//vpn-0-interface-lte/if-name": "Cellular0/2/0",
    "//vpn-0-interface-lte/apn": "jionet",
    "//vpn-0-interface-lte/profile": "1",
    "//vpn-0-interface-lte/ipv4": "negotiated",
    "//vpn-0-interface-lte/ipv6": "autoconfig",
    "//vpn-0-interface-lte/bandwidth": "25000",
    "//vpn-0-interface-lte/color": "lte",
    "//vpn-0-interface-lte/preference": "50",
    
# VPN 1 - Corporate LAN (single VLAN)
    "//vpn-1-interface/if-name": "GigabitEthernet0/0/1",
    "//vpn-1-interface/vpn1_ipv4": "192.168.55.1/24",
    "//vpn-1-interface/vpn1_ipv6": "2001:db8:abc5:2001::1/64",
    
# VPN 512 - Management
    "//vpn-512/mgmt_ipv4": "10.252.155.1/24",
    "//vpn-512/mgmt_ipv6": "2001:db8:abc5:1000::55/64",
}

# Use same deployment script as Bangalore
# python3 deploy_noida_ipv6.py
```

---

### 2.5 Noida LTE Failover Test

```bash
#!/bin/bash
# lte_failover_test.sh

echo "=== NOIDA LTE FAILOVER TEST ==="

# Baseline: Traffic via primary WAN
echo "Baseline: Ping Mumbai via primary DIA"
ssh admin@10.252.155.1 "ping vpn 1 2001:db8:abc1:2000::1 count 5"
# Expected: 5/5 success

# Check current active path
echo ""
echo "Current BFD sessions:"
ssh admin@10.252.155.1 "show sdwan bfd sessions | grep up | awk '{print \$1, \$5}'"

# Simulate primary WAN failure
echo ""
echo "--- Simulating primary WAN failure (shutdown GigE0/0/0) ---"
ssh admin@10.252.155.1 "configure terminal; interface GigabitEthernet0/0/0; shutdown; commit"

# Wait for BFD timeout + LTE activation
echo "Waiting 15s for LTE failover..."
sleep 15

# Test connectivity over LTE
echo ""
echo "Testing connectivity over LTE:"
ssh admin@10.252.155.1 "ping vpn 1 2001:db8:abc1:2000::1 count 5"
# Expected: 4-5/5 success (may lose 1 during switchover)

# Verify LTE is active
echo ""
echo "Active BFD sessions (should be LTE):"
ssh admin@10.252.155.1 "show sdwan bfd sessions | grep lte | grep up"

# Check IPv6 specifically
echo ""
echo "IPv6 over LTE:"
ssh admin@10.252.155.1 "show ipv6 interface Cellular0/2/0 | include address"
# Expected: Auto-configured IPv6 address from Jio

# Restore primary
echo ""
echo "--- Restoring primary WAN ---"
ssh admin@10.252.155.1 "configure terminal; interface GigabitEthernet0/0/0; no shutdown; commit"
sleep 20

echo ""
echo "✅ LTE failover test complete"
echo "   Primary → LTE: ~10-15s convergence"
echo "   LTE → Primary: ~15-20s restoration"
```

---

## Day 7-10: HYDERABAD (FABRIC-IN-A-BOX)

### 3.1 Fabric-in-a-Box Concept

```
FABRIC-IN-A-BOX (FiaB) ARCHITECTURE:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  TRADITIONAL APPROACH (Separate devices):                         │
│    ┌──────────────┐        ┌──────────────┐                      │
│    │  SD-WAN Edge │───WAN──│              │                      │
│    │  (C8500/ISR) │        │  Campus      │                      │
│    └──────┬───────┘        │  (SD-Access) │                      │
│           │                │  Fabric      │                      │
│           └────────────────│  (C9300)     │                      │
│                            └──────────────┘                       │
│    Requires: 2+ devices, complex handoff                          │
│                                                                    │
│  FABRIC-IN-A-BOX (Single device):                                 │
│    ┌────────────────────────────────────────┐                    │
│    │   Cisco Catalyst 9300-24UX (FiaB)      │                    │
│    │                                         │                    │
│    │  ┌─────────────┐   ┌─────────────┐    │                    │
│    │  │  SD-WAN     │   │  SD-Access  │    │                    │
│    │  │  Edge       │   │  Fabric     │    │                    │
│    │  │  (vEdge)    │   │  (Border+CP)│    │                    │
│    │  └──────┬──────┘   └──────┬──────┘    │                    │
│    │         │                  │            │                    │
│    │         └──────Internal────┘            │                    │
│    │                Handoff                  │                    │
│    └────────────────────────────────────────┘                    │
│           │                    │                                  │
│          WAN                  LAN                                 │
│                                                                    │
│  BENEFITS:                                                         │
│    ✅ Single device = lower cost, simpler management              │
│    ✅ Integrated SD-WAN + SD-Access in one box                    │
│    ✅ No physical handoff cable required                          │
│    ✅ Perfect for 100-300 user sites                              │
│    ✅ Dual-stack underlay + overlay in single config              │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### 3.2 Hyderabad FiaB Infrastructure

```
HYDERABAD FABRIC-IN-A-BOX:
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  DEVICE: HYD-FIAB-01                                               │
│    Model:        Cisco Catalyst 9300-24UX                          │
│    IOS-XE:       17.15.1 (SDWAN + SD-Access capable)               │
│    Role:         Combined SD-WAN edge + SD-Access fabric           │
│    System IP:    10.252.52.1/32                                    │
│    Site ID:      52                                                │
│    Users:        200                                               │
│                                                                    │
│  SD-WAN COMPONENT (VPN 0 / WAN):                                   │
│    ├─ MPLS: TenGigE1/0/1                                          │
│    │    IPv4: 172.16.52.2/30                                       │
│    │                                                               │
│    └─ DIA: GigE1/0/2                                              │
│         IPv4: 203.0.152.2/29                                       │
│                                                                    │
│  SD-ACCESS COMPONENT (Campus Fabric):                             │
│    ├─ Role: Border + Control Plane + Edge (all-in-one)            │
│    ├─ LISP: Instance 8001 (VN_CORPORATE)                          │
│    ├─ VXLAN: NVE interface for overlay                            │
│    └─ Access Ports: 1-20 (employee laptops, APs)                  │
│                                                                    │
│  INTERNAL HANDOFF:                                                 │
│    ├─ Logical (no physical cable)                                 │
│    ├─ VRF leaking: VPN 1 ↔ VN_CORPORATE                          │
│    └─ BGP: SD-WAN OMP ↔ SD-Access LISP route exchange            │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 3.3 Hyderabad IPv6 Addressing

```
HYDERABAD IPv6 (from 2001:db8:abc6::/48):
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  SD-WAN COMPONENT:                                                 │
│    System IP (IPv6):  2001:db8:abc6:8000::1/128                   │
│    MPLS IPv6:         2001:db8:1234:52::2/127                     │
│    DIA IPv6:          2001:db8:9abc:152::2/64                     │
│                                                                    │
│  SD-ACCESS COMPONENT:                                              │
│    Loopback0 (RLOC):  2001:db8:abc6:0::1/128                      │
│    Underlay P2P:      (internal — no external P2P in FiaB)        │
│                                                                    │
│  OVERLAY (VN_CORPORATE):                                           │
│    IPv6 Prefix:       2001:db8:abc6:2000::/52                     │
│    Floor 1 VLAN:      2001:db8:abc6:2001::/64                     │
│      Gateway:         2001:db8:abc6:2001::1 (anycast)             │
│                                                                    │
│  HANDOFF (VRF Leaking):                                            │
│    SD-WAN VPN 1 ← BGP → SD-Access VN_CORPORATE                    │
│    IPv6 routes redistributed bi-directionally                     │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### 3.4 Hyderabad FiaB Configuration (Key Sections)

#### SD-WAN Configuration Block

```cisco
! ═══════════════════════════════════════════════════════════════════
! SD-WAN COMPONENT (VPN 0 + VPN 1)
! ═══════════════════════════════════════════════════════════════════

! Enable IPv6
ipv6 unicast-routing
ipv6 cef

! SD-WAN System
sdwan
  system-ip 10.252.52.1
  ipv6-system-ip 2001:db8:abc6:8000::1
  site-id 52
  organization-name Abhavtech
  vbond vbond.abhavtech.com
  
! VPN 0 (WAN) — MPLS
interface TenGigabitEthernet1/0/1
  description MPLS-WAN-DUAL-STACK
  no switchport
  ip address 172.16.52.2 255.255.255.252
  ipv6 address 2001:db8:1234:52::2/127
  ipv6 enable
  tunnel-interface
    encapsulation ipsec preference 200
    color mpls
    hello-interval 1000
    hello-tolerance 7
    ipv6-bfd
    ipv6-hello-interval 1000
    ipv6-hello-tolerance 7
  exit
  no shutdown

! VPN 0 — DIA
interface GigabitEthernet1/0/2
  description DIA-WAN-DUAL-STACK
  no switchport
  ip address 203.0.152.2 255.255.255.248
  ipv6 address 2001:db8:9abc:152::2/64
  ipv6 enable
  tunnel-interface
    encapsulation ipsec preference 100
    color dia
    hello-interval 1000
    hello-tolerance 7
    ipv6-bfd
  exit
  no shutdown
```

#### SD-Access Configuration Block

```cisco
! ═══════════════════════════════════════════════════════════════════
! SD-ACCESS COMPONENT (LISP + VXLAN)
! ═══════════════════════════════════════════════════════════════════

! Loopback for LISP RLOC (dual-stack)
interface Loopback0
  description SD-ACCESS-RLOC
  ip address 10.250.52.1 255.255.255.255
  ipv6 address 2001:db8:abc6:0::1/128

! LISP configuration (Border + CP + Edge combined)
router lisp
  !
  ! FiaB acts as Border, CP, and Edge simultaneously
  eid-table default instance-id 8001
  exit-eid-table
  !
  ! Instance 8001 — VN_CORPORATE (IPv4)
  instance-id 8001
    service ipv4
      eid-table vrf VN_CORPORATE
      database-mapping 10.100.52.0/24 locator-set RLOC-SET priority 1 weight 50
      map-cache 10.100.0.0/8 map-request
      map-server 10.250.52.1 key fiab-key
      map-resolver 10.250.52.1
      use-petr 10.250.52.1 priority 1 weight 50
    exit-service-ipv4
    !
    ! Instance 8001 — VN_CORPORATE (IPv6)
    service ipv6
      eid-table vrf VN_CORPORATE
      database-mapping 2001:db8:abc6:2000::/52 locator-set RLOC-SET
      map-cache 2001:db8::/32 map-request
      map-server 2001:db8:abc6:0::1 key fiab-key
      map-resolver 2001:db8:abc6:0::1
      use-petr 2001:db8:abc6:0::1 priority 1 weight 50
    exit-service-ipv6
  !
  locator-set RLOC-SET
    ipv4-interface Loopback0 priority 1 weight 50
    ipv6-interface Loopback0 priority 1 weight 50
    exit-locator-set
  !
  exit-router-lisp

! VRF for VN_CORPORATE
vrf definition VN_CORPORATE
  rd 1:8001
  !
  address-family ipv4
    route-target export 1:8001
    route-target import 1:8001
  exit-address-family
  !
  address-family ipv6
    route-target export 1:8001
    route-target import 1:8001
  exit-address-family

! VXLAN (NVE interface)
interface nve1
  description FABRIC-VXLAN-TUNNEL
  no ip address
  source-interface Loopback0
  host-reachability protocol lisp
  member vni 8001 vrf VN_CORPORATE
  member vni 10011 vlan-based
  no shutdown

! Overlay SVI (Anycast Gateway)
vlan 1011
  name VN_CORPORATE_DATA_F1

interface Vlan1011
  description ANYCAST-GW-VN_CORPORATE-FLOOR1
  vrf forwarding VN_CORPORATE
  ip address 10.100.52.1 255.255.255.0
  ipv6 address 2001:db8:abc6:2001::1/64
  ipv6 enable
  ipv6 nd managed-config-flag
  mac-address 0000.0c9f.f001
  lisp mobility dynamic-eid CORPORATE_EID_v4
  lisp mobility dynamic-eid CORPORATE_EID_v6
  no shutdown
```

#### Handoff Configuration (VRF Leaking)

```cisco
! ═══════════════════════════════════════════════════════════════════
! INTERNAL HANDOFF (SD-WAN VPN 1 ↔ SD-Access VN_CORPORATE)
! ═══════════════════════════════════════════════════════════════════

! BGP for route exchange between SD-WAN and SD-Access
router bgp 65052
  !
  ! VRF VN_CORPORATE (SD-Access side)
  address-family ipv4 vrf VN_CORPORATE
    redistribute lisp
    redistribute connected
  exit-address-family
  !
  address-family ipv6 vrf VN_CORPORATE
    redistribute lisp
    redistribute connected
  exit-address-family
  !
  ! Peer with SD-WAN OMP (internal)
  neighbor 10.252.52.1 remote-as 65052
  neighbor 10.252.52.1 update-source Loopback0
  !
  address-family ipv4
    neighbor 10.252.52.1 activate
    neighbor 10.252.52.1 send-community both
  exit-address-family
  !
  address-family ipv6
    neighbor 2001:db8:abc6:8000::1 activate
    neighbor 2001:db8:abc6:8000::1 send-community both
  exit-address-family

! SD-WAN OMP to BGP redistribution
sdwan
  omp
    address-family ipv4
      advertise bgp
    exit-address-family
    address-family ipv6
      advertise bgp
    exit-address-family
```

---

### 3.5 Hyderabad FiaB Validation

```bash
#!/bin/bash
# validate_fiab.sh

echo "=== FABRIC-IN-A-BOX VALIDATION (HYDERABAD) ==="

# Test 1: SD-WAN Control Plane
echo "Test 1: SD-WAN Control Connections"
ssh admin@10.252.152.1 "show sdwan control connections | grep vsmart | wc -l"
# Expected: 4 (2 vSmarts × IPv4+IPv6)

# Test 2: SD-Access LISP Registration
echo "Test 2: LISP IPv6 Database"
ssh admin@10.252.152.1 "show lisp instance-id 8001 ipv6 database"
# Expected: 2001:db8:abc6:2000::/52 registered

# Test 3: BFD to Hubs (SD-WAN component)
echo "Test 3: BFD to Hubs"
ssh admin@10.252.152.1 "show sdwan bfd sessions | grep '2001:' | wc -l"
# Expected: 12 (6 hubs × 2 routers)

# Test 4: VXLAN Tunnel Status
echo "Test 4: VXLAN Tunnel"
ssh admin@10.252.152.1 "show interface nve1 | include 'line protocol'"
# Expected: line protocol is up

# Test 5: Client Connectivity (Dual-Stack)
echo "Test 5: Client SLAAC"
ssh admin@10.252.152.1 "show ipv6 dhcp binding | count"
# Expected: 0 (SLAAC, no DHCPv6 bindings)

ssh admin@10.252.152.1 "show ipv6 neighbors vlan 1011 | count"
# Expected: 50-100 (endpoint IPv6 addresses)

# Test 6: Route Exchange (SD-WAN ↔ SD-Access)
echo "Test 6: Route Exchange"
ssh admin@10.252.152.1 "show bgp ipv6 unicast vrf VN_CORPORATE summary"
# Expected: BGP peer UP, routes exchanged

# Test 7: End-to-End (HYD client → MUM hub)
echo "Test 7: Client to Mumbai Hub"
# From a Hyderabad client: ping 2001:db8:abc1:2000::1
# Expected: Success (via SD-Access → SD-WAN → OMP → Mumbai)

echo ""
echo "✅ Fabric-in-a-Box validation complete"
```

---

## WEEK 4-5 COMPLETION: REPLICATION GUIDE

### Template Deployment for Remaining 10 Sites

```
REPLICATION STRATEGY (Week 6-8):
┌────────────────────────────────────────────────────────────────────┐
│                                                                    │
│  ARCHETYPE MAPPING:                                                │
│                                                                    │
│  Large Branch Template (Bangalore model):                          │
│    → Delhi (Site 51)                                               │
│    → (No others — most sites are small)                            │
│                                                                    │
│  Small Branch + LTE Template (Noida model):                        │
│    → Hyderabad (Site 52) — if not using FiaB                      │
│    → Pune (Site 53)                                                │
│    → Ahmedabad (Site 54)                                           │
│    → Kolkata (Site 56)                                             │
│    → Jaipur (Site 57)                                              │
│    → Surat (Site 58)                                               │
│    → Nagpur (Site 59)                                              │
│    → Chandigarh (Site 60)                                          │
│    → Coimbatore (Site 61)                                          │
│    → Lucknow (Site 62)                                             │
│                                                                    │
│  Fabric-in-a-Box Template (Hyderabad model):                      │
│    → Use for any future 100-250 user sites                        │
│    → Optional: Convert existing small branches to FiaB            │
│                                                                    │
│  ─────────────────────────────────────────────────────────────────│
│                                                                    │
│  DEPLOYMENT PROCESS (per site):                                    │
│    1. Update vManage template variables (30 min)                  │
│       - System IP, Site ID, Interface IPs                         │
│    2. Attach template via vManage API (45 min)                    │
│    3. Validation script (15 min)                                  │
│    4. Total: ~90 minutes per site                                 │
│                                                                    │
│  PARALLEL DEPLOYMENT:                                              │
│    - 2 engineers × 2 sites/day = 4 sites/day                      │
│    - 10 remaining sites ÷ 4/day = 2.5 days                        │
│    - Add buffer: 5 days (Week 6)                                  │
│                                                                    │
│  VALIDATION:                                                       │
│    - Week 7: Full mesh validation (all 19 sites)                  │
│    - Week 8: Performance baselines, documentation                 │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

---

### Week 4-5 Summary Report

```bash
#!/bin/bash
# week4_5_summary.sh

echo "═══════════════════════════════════════════════════════════════"
echo "      WEEK 4-5 COMPLETION REPORT — BRANCH ARCHETYPES"
echo "═══════════════════════════════════════════════════════════════"
echo ""

echo "ARCHETYPE DEPLOYMENTS:"
echo "  ✅ Bangalore (Large Branch — ISR 4331)"
echo "     - Dual WAN (MPLS + DIA)"
echo "     - 500 users, multi-VPN"
echo "     - IPv6 dual-stack on all interfaces"
echo ""
echo "  ✅ Noida (Small Branch — ISR 1100 + LTE)"
echo "     - Primary WAN + LTE backup"
echo "     - 200 users, simplified config"
echo "     - IPv6 over cellular (Jio SLAAC)"
echo ""
echo "  ✅ Hyderabad (Fabric-in-a-Box — C9300-24UX)"
echo "     - Combined SD-WAN + SD-Access"
echo "     - Single device solution"
echo "     - Dual-stack underlay + overlay"
echo ""

echo "TEMPLATES CREATED:"
echo "  - ABV-DeviceTemplate-Branch-ISR4331-IPv6"
echo "  - ABV-DeviceTemplate-Branch-ISR1100-LTE-IPv6"
echo "  - ABV-DeviceTemplate-FiaB-C9300-IPv6"
echo ""

echo "VALIDATION RESULTS:"
echo "  ✅ Bangalore: 12 IPv6 BFD sessions to hubs"
echo "  ✅ Noida: LTE failover <15s convergence"
echo "  ✅ Hyderabad: SD-WAN ↔ SD-Access handoff operational"
echo ""

echo "READY FOR REPLICATION:"
echo "  - 10 remaining small branches (Week 6)"
echo "  - Templates ready for vManage deployment"
echo "  - Estimated: 5 days for remaining sites"
echo ""

echo "═══════════════════════════════════════════════════════════════"
echo "           ✅ WEEK 4-5 COMPLETE — ARCHETYPES VALIDATED"
echo "═══════════════════════════════════════════════════════════════"
echo ""
echo "NEXT: Phase 1 Completion (Week 6-8)"
echo "      - Deploy remaining 10 branches (5 days)"
echo "      - Full 19-site mesh validation (2 days)"
echo "      - Documentation and baseline (3 days)"
echo ""
echo "AFTER Phase 1: Move to Phase 2 (SD-Access Overlay IPv6)"
```

---

## WEEK 4-5 COMPLETE

**Summary:**
- **Three deployment archetypes** documented in detail:
  1. **Large Branch** (Bangalore — ISR 4331, dual WAN)
  2. **Small Branch + LTE** (Noida — ISR 1100, cellular backup)
  3. **Fabric-in-a-Box** (Hyderabad — C9300, SD-WAN + SD-Access combined)
- **Templates ready** for remaining 10 sites
- **LTE IPv6 validated** (cellular with SLAAC, BFD over IPv6)
- **FiaB validated** (single-device solution for small campuses)
- **Replication strategy** defined for Week 6-8

**Phase 1 Status:**
- Hubs: ✅ Complete (6 sites, 12 routers)
- Branches: ✅ Archetypes complete, 10 sites remaining
- Total: 9/19 sites dual-stack, templates ready for remaining 10

**Next:** Phase 2 — SD-Access Overlay IPv6 Deployment

---

*© 2025 Abhavtech - IPv6 Migration Week 4-5 Guide*
*Version 1.0 | Last Updated: January 2025*
