# 5.4 SD-WAN Controller Deployment

## Document Information
- **Version:** 1.0
- **Last Updated:** December 2025
- **Author:** Abhavtech Network Engineering
- **Classification:** Internal Use

---

## 5.4.1 Controller Architecture

### vSmart Topology

```
+------------------------------------------------------------------+
|           ABHAVTECH SD-WAN CONTROLLER ARCHITECTURE                |
+------------------------------------------------------------------+
|                                                                   |
|  MUMBAI DATA CENTER                    CHENNAI DR CENTER          |
|  ┌──────────────────────┐              ┌──────────────────────┐  |
|  │  vSmart-Mumbai-1     │              │  vSmart-Chennai-1    │  |
|  │  10.255.1.11         │◄────────────►│  10.255.1.21         │  |
|  │  (Primary)           │    OMP       │  (DR Primary)        │  |
|  └──────────┬───────────┘              └──────────┬───────────┘  |
|             │                                     │               |
|             │ Full Mesh OMP Peering               │               |
|             │                                     │               |
|  ┌──────────┴───────────┐              ┌──────────┴───────────┐  |
|  │  vSmart-Mumbai-2     │◄────────────►│  vSmart-Chennai-2    │  |
|  │  10.255.1.12         │    OMP       │  10.255.1.22         │  |
|  │  (Secondary)         │              │  (DR Secondary)      │  |
|  └──────────────────────┘              └──────────────────────┘  |
|                                                                   |
|  CONTROLLER ROLES:                                                |
|  - Route Reflector: Distribute OMP routes to WAN Edges           |
|  - Policy Engine: Apply centralized policies                     |
|  - Service Orchestration: Service chain management               |
|                                                                   |
|  CAPACITY:                                                        |
|  - 4 vSmarts support up to 4,000 WAN Edges                       |
|  - Each vSmart can handle 1,000 connections                      |
|  - Full redundancy with any single controller failure            |
|                                                                   |
+------------------------------------------------------------------+
```

### vSmart Specifications

| Parameter | Mumbai vSmarts | Chennai vSmarts |
|-----------|----------------|-----------------|
| vCPU | 8 cores | 8 cores |
| Memory | 16 GB | 16 GB |
| Storage | 100 GB SSD | 100 GB SSD |
| Network | 1 Gbps | 1 Gbps |
| Site-ID | 1 | 2 |
| System-IP | 10.255.1.11/12 | 10.255.1.21/22 |

---

## 5.4.2 vSmart Deployment

### VM Deployment

```bash
# Deploy vSmart OVA for Mumbai-1
ovftool --name="vSmart-Mumbai-1" \
  --datastore="DS_SDWAN_01" \
  --network="VM_SDWAN_MGMT" \
  --diskMode=thin \
  --prop:com.cisco.vm.hostname=vsmart-mumbai-1.abhavtech.com \
  --prop:com.cisco.vm.login=admin \
  --prop:com.cisco.vm.password=Abh@vT3ch$DW@N! \
  --prop:com.cisco.vm.eth0.ip=10.255.1.11 \
  --prop:com.cisco.vm.eth0.netmask=255.255.255.0 \
  --prop:com.cisco.vm.eth0.gateway=10.255.1.1 \
  viptela-smart-20.15.1-x86_64.ova \
  "vi://admin@vcenter.abhavtech.com/DC-Mumbai/host/Cluster-SDWAN"
```

### Initial Configuration

```
! vSmart-Mumbai-1 Configuration
vsmart# config terminal

system
 host-name vsmart-mumbai-1
 system-ip 10.255.1.11
 site-id 1
 organization-name "Abhavtech"
 vbond sdwan-validator.abhavtech.com port 12346
!
vpn 0
 ip route 0.0.0.0/0 10.255.1.1
 interface eth0
  ip address 10.255.1.11/24
  tunnel-interface
   allow-service all
   encapsulation dtls
  !
  no shutdown
 !
!
vpn 512
 ip route 0.0.0.0/0 10.255.100.1
 interface eth1
  ip address 10.255.100.21/24
  no shutdown
 !
!

! Commit configuration
commit
```

---

## 5.4.3 Certificate Installation

### Generate and Install Certificate

```
! Step 1: Generate CSR
vsmart-mumbai-1# request certificate generate csr

! Output CSR - submit to Enterprise CA
-----BEGIN CERTIFICATE REQUEST-----
MIIC...
-----END CERTIFICATE REQUEST-----

! Step 2: Sign with Enterprise CA (external process)
! Subject: CN=vsmart-mumbai-1.abhavtech.com,O=Abhavtech,C=IN
! Extended Key Usage: clientAuth, serverAuth

! Step 3: Install Root CA
vsmart-mumbai-1# request root-cert-chain install /home/admin/abhavtech-ca-chain.pem

! Step 4: Install signed certificate
vsmart-mumbai-1# request certificate install /home/admin/vsmart-mumbai-1-signed.pem

! Step 5: Verify certificate
vsmart-mumbai-1# show certificate installed
Certificate:
  Subject: CN=vsmart-mumbai-1.abhavtech.com,O=Abhavtech,C=IN
  Issuer: CN=Abhavtech-Issuing-CA,O=Abhavtech,C=IN
  Serial: 5B4C3D2E
  Valid: Dec 15 2025 - Dec 15 2027
  Status: Valid
```

---

## 5.4.4 OMP Configuration

### OMP Settings

```
! OMP configuration on vSmart
vsmart# config terminal

omp
 no shutdown
 graceful-restart
 timers
  graceful-restart-timer 43200
  holdtime 60
  keepalive 20
  advertisement-interval 1
 !
 address-family ipv4
  advertise bgp
  advertise connected
  advertise static
  advertise ospf external
 !
 address-family ipv6
  advertise bgp
  advertise connected
 !
!
commit

! Verify OMP status
vsmart# show omp summary
```

### OMP Tuning for Large Scale

```
! For 500+ WAN Edges, tune OMP parameters
omp
 send-path-limit 16
 ecmp-limit 8
 timers
  advertisement-interval 5
  holdtime 300
  keepalive 60
 !
!

! Enable graceful restart for maintenance
omp
 graceful-restart
 timers
  graceful-restart-timer 43200
 !
!
```

---

## 5.4.5 vSmart Affinity Configuration

### Site Affinity Groups

```
! Configure affinity for regional controllers
! Mumbai vSmarts primary for India region
! Chennai vSmarts primary for DR

vsmart-mumbai-1# config terminal

system
 controller-group-id 1
!

! On vManage, configure affinity policy
vManage GUI: Configuration > Templates > (System Template)

Controller Group Preference:
  Group 1 (Mumbai): Sites 1-99 (India)
  Group 2 (Chennai): Sites 100-199 (EMEA/Americas backup)

! Result: India sites prefer Mumbai vSmarts
!         EMEA/Americas failover to Chennai
```

### Multi-Tenant Isolation (If Required)

```
! For multi-tenant deployments, isolate tenants
vsmart# config terminal

tenant abhavtech
 organization-name "Abhavtech"
 domain-id 1
!

! Route isolation per tenant
policy
 lists
  site-list ABHAVTECH_SITES
   site-id 1-199
  !
 !
!
```

---

## 5.4.6 Policy Distribution

### Control Policy Application

```
! Control policies are configured on vManage and pushed to vSmart
! vSmart applies policies to OMP routes

vManage GUI: Configuration > Policies > Centralized Policy

! Example: Hub-and-Spoke Topology Policy
policy
 control-policy HUB-SPOKE
  sequence 10
   match route
    site-list BRANCH_SITES
   !
   action accept
    set
     tloc-list HUB_TOCS
    !
   !
  !
  default-action accept
 !
!

! Apply to site-list
apply-policy
 site-list BRANCH_SITES
  control-policy HUB-SPOKE out
 !
!
```

### Verify Policy Distribution

```
! On vSmart, verify policies received
vsmart# show running-config policy
vsmart# show omp policy

! Check policy application
vsmart# show sdwan running-config | section apply-policy

! Verify routes with policy applied
vsmart# show omp routes vpn 10
vsmart# show omp routes vpn 10 detail | include preference
```

---

## 5.4.7 Controller HA Validation

### HA Test Procedure

```bash
#!/bin/bash
# vsmart_ha_test.sh - vSmart HA validation

echo "=== VSMART HA VALIDATION ==="

# Test 1: Verify all vSmarts have OMP peers
echo "Test 1: OMP Peering"
for vsmart in vsmart-mumbai-1 vsmart-mumbai-2 vsmart-chennai-1 vsmart-chennai-2; do
    echo "Checking $vsmart..."
    ssh admin@$vsmart "show omp peers"
done

# Test 2: Verify route consistency
echo "Test 2: Route Consistency"
ssh admin@vsmart-mumbai-1 "show omp routes vpn 10 | count"
ssh admin@vsmart-chennai-1 "show omp routes vpn 10 | count"

# Test 3: Failover test
echo "Test 3: Controller Failover"
echo "ACTION: Shutdown vsmart-mumbai-1"
echo "EXPECTED: WAN Edges failover to vsmart-mumbai-2 within 60 seconds"
echo "VERIFY: show sdwan control connections on WAN Edge"

# Test 4: Split-brain prevention
echo "Test 4: Split-Brain Prevention"
echo "VERIFY: Only one active OMP session per WAN Edge to Mumbai cluster"
```

### HA Status Verification

```
! On any vSmart
vsmart# show omp peers

! Expected output (healthy):
Peer          Type   Domain    System IP       State       Uptime
vsmart-mum-2  vsmart 1         10.255.1.12     up          5d 3h 22m
vsmart-che-1  vsmart 1         10.255.1.21     up          5d 3h 22m
vsmart-che-2  vsmart 1         10.255.1.22     up          5d 3h 22m
mumbai-hub-1  vedge  1         10.255.255.1    up          4d 12h 15m
mumbai-hub-2  vedge  1         10.255.255.2    up          4d 12h 15m
...

! Verify control connections from WAN Edge
wan-edge# show sdwan control connections | include vsmart
vsmart  dtls  10.255.1.11  12346  10.255.255.11  12346  Yes   up   5d 3h
vsmart  dtls  10.255.1.12  12346  10.255.255.11  12346  Yes   up   5d 3h
```

---

## 5.4.8 Monitoring and Alerting

### vSmart Health Monitoring

```python
#!/usr/bin/env python3
"""vSmart Health Monitor"""

import requests
import json

VMANAGE = "sdwan-manager.abhavtech.com"

def get_vsmart_status():
    session = requests.Session()
    session.verify = False
    
    # Authenticate
    session.post(
        f"https://{VMANAGE}/j_security_check",
        data={"j_username": "admin", "j_password": "password"}
    )
    
    token = session.get(f"https://{VMANAGE}/dataservice/client/token").text
    session.headers["X-XSRF-TOKEN"] = token
    
    # Get vSmart status
    response = session.get(
        f"https://{VMANAGE}/dataservice/device/controllers",
        params={"deviceCategory": "controllers"}
    )
    
    controllers = response.json().get("data", [])
    
    for controller in controllers:
        if controller.get("device-type") == "vsmart":
            print(f"vSmart: {controller['host-name']}")
            print(f"  System IP: {controller['system-ip']}")
            print(f"  Status: {controller['reachability']}")
            print(f"  OMP Peers: {controller.get('ompPeers', 'N/A')}")
            print()

if __name__ == "__main__":
    get_vsmart_status()
```

### SNMP Monitoring

```
! Enable SNMP on vSmart for NMS monitoring
vsmart# config terminal

snmp
 view ALL-ACCESS
  oid 1
 !
 user snmpmonitor group ADMIN-GROUP auth sha-256 Snmp@Auth123! priv aes-256 Snmp@Priv123!
 group ADMIN-GROUP view ALL-ACCESS
 trap group TRAPS
  target-ip 10.10.1.50 port 162
 !
!
commit
```

---

## 5.4.9 Post-Deployment Verification

### vSmart Verification Checklist

| Check | Command | Expected | Status |
|-------|---------|----------|--------|
| All vSmarts reachable | ping from vManage | 100% | ☐ |
| OMP peers established | show omp peers | All UP | ☐ |
| Control connections | show control connections | vBond, vManage | ☐ |
| Certificate valid | show certificate installed | Valid | ☐ |
| Routes received | show omp routes | Expected count | ☐ |
| Policies active | show omp policy | Applied | ☐ |
| Memory utilization | show system status | <80% | ☐ |
| CPU utilization | show system status | <70% | ☐ |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech Network Engineering | Initial release |

---

*Abhavtech Confidential - SD-WAN Controller Deployment Guide*
