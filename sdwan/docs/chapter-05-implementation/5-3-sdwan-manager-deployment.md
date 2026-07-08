# 5.3 SD-WAN Manager Deployment

## Document Information
- **Version:** 1.0
- **Last Updated:** December 2025
- **Author:** Abhavtech Network Engineering
- **Classification:** Internal Use

---

## 5.3.1 SD-WAN Manager Architecture

### Cluster Topology

```
+------------------------------------------------------------------+
|            ABHAVTECH SD-WAN MANAGER CLUSTER ARCHITECTURE          |
+------------------------------------------------------------------+
|                                                                   |
|                         MUMBAI DATA CENTER                        |
|  ┌────────────────────────────────────────────────────────────┐  |
|  │                                                             │  |
|  │    ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │  |
|  │    │  vManage-1  │  │  vManage-2  │  │  vManage-3  │       │  |
|  │    │ 10.255.0.11 │  │ 10.255.0.12 │  │ 10.255.0.13 │       │  |
|  │    │   Primary   │  │  Secondary  │  │   Tertiary  │       │  |
|  │    └──────┬──────┘  └──────┬──────┘  └──────┬──────┘       │  |
|  │           │                │                │              │  |
|  │           └────────────────┼────────────────┘              │  |
|  │                            │                               │  |
|  │                     ┌──────┴──────┐                        │  |
|  │                     │ Cluster VIP │                        │  |
|  │                     │ 10.255.0.10 │                        │  |
|  │                     └─────────────┘                        │  |
|  │                                                             │  |
|  │    Database: Configuration, Statistics, Events             │  |
|  │    Services: NMS, Statistics, Application Server           │  |
|  │    Replication: Real-time across all 3 nodes               │  |
|  │                                                             │  |
|  └────────────────────────────────────────────────────────────┘  |
|                                                                   |
|  EXTERNAL ACCESS:                                                |
|  - Web UI: https://sdwan-manager.abhavtech.com (VIP)            |
|  - API: https://sdwan-manager.abhavtech.com:8443                |
|  - DNS: sdwan-manager.abhavtech.com → 10.255.0.10               |
|                                                                   |
+------------------------------------------------------------------+
```

### Node Specifications

| Parameter | Value | Notes |
|-----------|-------|-------|
| Number of Nodes | 3 | Cluster quorum |
| vCPU per Node | 32 | Dedicated cores |
| Memory per Node | 64 GB | Minimum 64 GB |
| Storage per Node | 1 TB SSD | NFS or local |
| Network per Node | 10 Gbps | Dual-homed |
| Hypervisor | VMware ESXi 7.0+ | Or KVM |
| VM Format | OVA | Download from Cisco |

---

## 5.3.2 VM Deployment

### OVA Deployment Steps

```bash
# Step 1: Download OVA from Cisco Software Central
# File: vmanage-20.15.1.ova (approximately 8 GB)

# Step 2: Deploy OVA using vSphere CLI (for each node)
ovftool --name="vManage-1" \
  --datastore="DS_SDWAN_01" \
  --network="VM_SDWAN_MGMT" \
  --diskMode=thin \
  --prop:com.cisco.vm.hostname=vmanage-1.abhavtech.com \
  --prop:com.cisco.vm.login=admin \
  --prop:com.cisco.vm.password=Abh@vT3ch$DW@N! \
  --prop:com.cisco.vm.eth0.ip=10.255.0.11 \
  --prop:com.cisco.vm.eth0.netmask=255.255.255.0 \
  --prop:com.cisco.vm.eth0.gateway=10.255.0.1 \
  --prop:com.cisco.vm.dns=10.10.1.10,10.10.1.11 \
  --prop:com.cisco.vm.domain=abhavtech.com \
  vmanage-20.15.1.ova \
  "vi://admin@vcenter.abhavtech.com/DC-Mumbai/host/Cluster-SDWAN"

# Repeat for vManage-2 (10.255.0.12) and vManage-3 (10.255.0.13)
```

### Initial Configuration via Console

```
! First boot configuration - vManage-1
vManage# system configure

Enter configuration mode
config# system
config-system# host-name vmanage-1
config-system# system-ip 10.255.0.11
config-system# site-id 1
config-system# organization-name "Abhavtech"
config-system# vbond sdwan-validator.abhavtech.com port 12346

config-system# exit
config# vpn 0
config-vpn-0# ip route 0.0.0.0/0 10.255.0.1
config-vpn-0# interface eth0
config-interface# ip address 10.255.0.11/24
config-interface# no tunnel-interface
config-interface# no shutdown
config-interface# exit

config-vpn-0# exit
config# vpn 512
config-vpn-512# ip route 0.0.0.0/0 10.255.0.1
config-vpn-512# interface eth1
config-interface# ip address 10.255.100.11/24
config-interface# no shutdown
config-interface# exit

config# commit
Commit complete.
```

---

## 5.3.3 Cluster Formation

### Cluster Configuration Steps

```
! Step 1: Initialize first node as cluster seed
vManage-1# request nms configuration-db init

! Step 2: On second and third nodes, join cluster
vManage-2# request nms configuration-db add 10.255.0.11 admin password
vManage-3# request nms configuration-db add 10.255.0.11 admin password

! Step 3: Verify cluster status
vManage-1# request nms configuration-db status

! Expected output:
Enabled: true
Status: established
Cluster members:
  Node 1: 10.255.0.11 - ACTIVE
  Node 2: 10.255.0.12 - ACTIVE  
  Node 3: 10.255.0.13 - ACTIVE
```

### Service Distribution

```
! Configure service distribution across cluster
vManage-1# request nms application-server services

! Verify service distribution
vManage-1# request nms all status

! Expected output:
NMS service status
  NMS Server    vmanage-1   10.255.0.11   RUNNING
  NMS Server    vmanage-2   10.255.0.12   RUNNING
  NMS Server    vmanage-3   10.255.0.13   RUNNING
Statistics service status
  Statistics    vmanage-1   10.255.0.11   RUNNING
  Statistics    vmanage-2   10.255.0.12   RUNNING
  Statistics    vmanage-3   10.255.0.13   RUNNING
Application Server status
  AppServer     vmanage-1   10.255.0.11   RUNNING
  AppServer     vmanage-2   10.255.0.12   STANDBY
  AppServer     vmanage-3   10.255.0.13   STANDBY
```

---

## 5.3.4 Certificate Configuration

### Enterprise CA Integration

```
! Step 1: Upload Root CA certificate
vManage GUI: Administration > Settings > Controller Certificate Authorization
  - Select "Enterprise Root Certificate"
  - Upload: abhavtech-root-ca.pem

! Step 2: Generate CSR for vManage
vManage-1# request certificate generate csr

! Copy CSR output and submit to Enterprise CA
! CA signs certificate with:
!   - Subject: CN=vmanage-1.abhavtech.com,O=Abhavtech,C=IN
!   - Key Usage: digitalSignature, keyEncipherment
!   - Extended Key Usage: serverAuth, clientAuth
!   - SAN: DNS:vmanage-1.abhavtech.com, IP:10.255.0.11

! Step 3: Install signed certificate
vManage-1# request certificate install /home/admin/vmanage-1-signed.pem

! Step 4: Verify certificate
vManage-1# show certificate installed
Certificate:
  Subject: CN=vmanage-1.abhavtech.com,O=Abhavtech,C=IN
  Issuer: CN=Abhavtech-Issuing-CA,O=Abhavtech,C=IN
  Serial: 4A3B2C1D
  Valid: Dec 15 2025 - Dec 15 2027
  Status: Valid

! Repeat for vManage-2 and vManage-3
```

### HTTPS Certificate (Web UI)

```
! For external web access, install public CA certificate
! Step 1: Generate PKCS12 with web certificate
openssl pkcs12 -export \
  -in sdwan-manager.abhavtech.com.crt \
  -inkey sdwan-manager.abhavtech.com.key \
  -certfile ca-chain.crt \
  -out sdwan-manager.p12 \
  -name "sdwan-manager"

! Step 2: Import to vManage
vManage GUI: Administration > Settings > Web Server Certificate
  - Upload PKCS12 file
  - Enter password
  - Apply

! Step 3: Verify web certificate
curl -v https://sdwan-manager.abhavtech.com 2>&1 | grep "subject:"
# * subject: CN=sdwan-manager.abhavtech.com; O=Abhavtech
```

---

## 5.3.5 System Settings

### Organization Settings

```
vManage GUI: Administration > Settings

Organization Name: Abhavtech
Validator Domain: sdwan-validator.abhavtech.com:12346

Certificate Settings:
  - Certificate Authority: Enterprise
  - Signing Method: Enterprise CA
  - Cert Validity: 365 days

Controller Settings:
  - vBond Port: 12346
  - vSmart Port: 12346
```

### Authentication Configuration

```
! RADIUS Integration with ISE
vManage GUI: Administration > Settings > AAA

RADIUS Server Configuration:
  - Server: ise.abhavtech.com
  - Port: 1812
  - Secret: ******
  - Timeout: 5 seconds
  - Retries: 3

User Groups:
  - netadmin → ISE Group: Network-Admin → Full Access
  - netoper → ISE Group: Network-Operator → Read-Only
  - security → ISE Group: Security-Admin → Security Policies

Local Admin (Backup):
  - Username: localadmin
  - Password: (encrypted)
  - Group: netadmin
```

### Logging and Monitoring

```
! Syslog Configuration
vManage GUI: Administration > Settings > Logging

Syslog Servers:
  - splunk.abhavtech.com:514 (UDP)
  - syslog-backup.abhavtech.com:514 (UDP)

Log Level: informational
Facility: local7

! SNMP Configuration
SNMP Version: v3
Security Level: authPriv
  - Username: snmpmonitor
  - Auth: SHA-256
  - Privacy: AES-256
Trap Destination: nms.abhavtech.com:162

! Email Alerts
SMTP Server: smtp.abhavtech.com:587
From: sdwan-alerts@abhavtech.com
Recipients: 
  - noc@abhavtech.com (Critical)
  - network-team@abhavtech.com (Warning)
```

---

## 5.3.6 Software Repository

### Image Upload

```
! Upload WAN Edge images for ZTP
vManage GUI: Maintenance > Software Repository

Images to Upload:
1. c8000v-universalk9.17.15.01a.SPA.bin (vEdge Cloud)
2. c8300-universalk9.17.15.01a.SPA.bin (C8300)
3. c8500-universalk9.17.15.01a.SPA.bin (C8500)

! Set default images per device type
vManage GUI: Maintenance > Software Repository > Set Default

Device Type: C8300-1N1S-6T
  Default Image: c8300-universalk9.17.15.01a.SPA.bin
  
Device Type: C8500-12X4QC
  Default Image: c8500-universalk9.17.15.01a.SPA.bin
```

### Virtual Image Repository

```
! For VM-based WAN Edges
vManage GUI: Maintenance > Software Repository > Virtual Images

Upload:
  - viptela-smart-20.15.1-x86_64.ova (vSmart)
  - viptela-bond-20.15.1-x86_64.ova (vBond)
  - cEdge-20.15.1-x86_64.ova (Cloud Router)
```

---

## 5.3.7 High Availability Validation

### Cluster HA Test

```bash
#!/bin/bash
# cluster_ha_test.sh - Validate vManage cluster HA

echo "=== VMANAGE CLUSTER HA TEST ==="

# Test 1: Verify all nodes responsive
echo "Test 1: Node Health Check"
for node in 10.255.0.11 10.255.0.12 10.255.0.13; do
    curl -sk "https://$node:443/dataservice/system/device/status" | \
      jq '.data[0].status'
done

# Test 2: Simulate primary node failure
echo "Test 2: Primary Node Failover"
echo "ACTION: Power off vManage-1 (10.255.0.11)"
echo "EXPECTED: VIP (10.255.0.10) fails over to vManage-2"
echo "VERIFY: Web UI remains accessible via VIP"

# Test 3: Database consistency
echo "Test 3: Database Replication"
echo "ACTION: Create test device template on any node"
echo "VERIFY: Template visible on all nodes within 30 seconds"

# Test 4: Service failover
echo "Test 4: Application Server Failover"
echo "ACTION: Stop app-server on primary"
echo "EXPECTED: Standby node promotes to active"
```

### Cluster Status Verification

```
! Comprehensive cluster health check
vManage# show nms all status
vManage# request nms configuration-db diagnostics

! Expected healthy output:
Cluster Status: ACTIVE
Nodes Online: 3/3
Database Replication: IN_SYNC
Services: ALL_RUNNING
Last Sync: 2025-12-15 10:30:00 UTC
```

---

## 5.3.8 Backup Configuration

### Scheduled Backup

```
! Configure automatic backup
vManage GUI: Maintenance > Backup & Restore

Backup Schedule:
  - Frequency: Daily
  - Time: 02:00 UTC
  - Retention: 30 days

Backup Location:
  - Type: Remote Server (SCP)
  - Server: backup.abhavtech.com
  - Path: /backups/sdwan/vmanage/
  - Username: backup-svc
  - SSH Key: (uploaded)

Backup Contents:
  ☑ Configuration Database
  ☑ Device Templates
  ☑ Policies
  ☑ Users and Groups
  ☑ Statistics (last 7 days)
```

### Manual Backup Command

```
! Trigger immediate backup
vManage# request nms configuration-db backup path /home/admin/backup_$(date +%Y%m%d).tar.gz

! Transfer to remote server
scp /home/admin/backup_20251215.tar.gz \
  backup-svc@backup.abhavtech.com:/backups/sdwan/vmanage/
```

---

## 5.3.9 Post-Deployment Verification

### Verification Checklist

| Check | Command/Method | Expected Result | Status |
|-------|----------------|-----------------|--------|
| Web UI accessible | https://sdwan-manager.abhavtech.com | Login page | ☐ |
| API responsive | GET /dataservice/system/device/status | 200 OK | ☐ |
| All nodes healthy | show nms all status | 3/3 RUNNING | ☐ |
| Database in sync | request nms configuration-db status | IN_SYNC | ☐ |
| Certificates valid | show certificate installed | Valid status | ☐ |
| Syslog flowing | Check Splunk | Events received | ☐ |
| SNMP working | snmpwalk -v3 | System OID returned | ☐ |
| Backup successful | Check backup server | File present | ☐ |

### API Health Check

```python
#!/usr/bin/env python3
"""vManage API Health Check"""

import requests
import urllib3
urllib3.disable_warnings()

VMANAGE_HOST = "sdwan-manager.abhavtech.com"
USERNAME = "admin"
PASSWORD = "password"

session = requests.Session()
session.verify = False

# Authenticate
auth_url = f"https://{VMANAGE_HOST}/j_security_check"
auth_data = {"j_username": USERNAME, "j_password": PASSWORD}
response = session.post(auth_url, data=auth_data)

# Get token
token_url = f"https://{VMANAGE_HOST}/dataservice/client/token"
token = session.get(token_url).text
session.headers["X-XSRF-TOKEN"] = token

# Health check
status_url = f"https://{VMANAGE_HOST}/dataservice/system/device/status"
response = session.get(status_url)

print(f"API Status: {response.status_code}")
print(f"Cluster Health: {response.json()}")
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech Network Engineering | Initial release |

---

*Abhavtech Confidential - SD-WAN Manager Deployment Guide*
