# 5.7 WAN Edge Onboarding (ZTP)

## Document Information
- **Version:** 1.0
- **Last Updated:** December 2025
- **Author:** Abhavtech Network Architecture Team
- **Status:** Production Ready
- **Review Cycle:** Quarterly

## Table of Contents
1. [Overview](#overview)
2. [Zero-Touch Provisioning Architecture](#zero-touch-provisioning-architecture)
3. [PnP Connect Portal Configuration](#pnp-connect-portal-configuration)
4. [Bootstrap Configuration Methods](#bootstrap-configuration-methods)
5. [Manual Bootstrap Configuration](#manual-bootstrap-configuration)
6. [Automated ZTP Workflow](#automated-ztp-workflow)
7. [Enterprise PKI Integration](#enterprise-pki-integration)
8. [WAN Edge Device Preparation](#wan-edge-device-preparation)
9. [Onboarding Hub Site WAN Edges](#onboarding-hub-site-wan-edges)
10. [Onboarding Branch Site WAN Edges](#onboarding-branch-site-wan-edges)
11. [Multi-Tenant Onboarding](#multi-tenant-onboarding)
12. [Troubleshooting Onboarding Issues](#troubleshooting-onboarding-issues)
13. [Verification and Validation](#verification-and-validation)
14. [Onboarding Automation Scripts](#onboarding-automation-scripts)

---

## Overview

### Purpose

This section provides comprehensive procedures for onboarding WAN Edge devices into the Abhavtech SD-WAN fabric using Zero-Touch Provisioning (ZTP) and manual bootstrap methods. The onboarding process establishes control plane connectivity between WAN Edges and SD-WAN controllers, enabling centralized management and policy deployment.

### Onboarding Methods Summary

| Method | Use Case | Prerequisites | Complexity |
|--------|----------|---------------|------------|
| ZTP via PnP Connect | New device deployment | Internet, PnP portal access | Low |
| ZTP via DHCP | Staging environment | DHCP server, Option 43 | Medium |
| Manual Bootstrap | Air-gapped, legacy | Console access | High |
| USB Bootstrap | Remote sites, no internet | USB preparation | Medium |
| API-Driven | Automated deployments | API integration | Medium |

### Abhavtech Onboarding Strategy

```
+------------------------------------------------------------------+
|                    WAN Edge Onboarding Flow                       |
+------------------------------------------------------------------+
|                                                                   |
|  [New Device]                                                     |
|       |                                                           |
|       v                                                           |
|  +--------+     +-------------+     +-----------+                 |
|  | Power  |---->| PnP/ZTP     |---->| vBond     |                 |
|  | On     |     | Discovery   |     | Auth      |                 |
|  +--------+     +-------------+     +-----------+                 |
|                       |                   |                       |
|                       v                   v                       |
|               +-------------+     +-----------+                   |
|               | Bootstrap   |     | vManage   |                   |
|               | Config      |     | Register  |                   |
|               +-------------+     +-----------+                   |
|                       |                   |                       |
|                       v                   v                       |
|               +-------------+     +-----------+                   |
|               | Certificate |     | Template  |                   |
|               | Install     |     | Push      |                   |
|               +-------------+     +-----------+                   |
|                       |                   |                       |
|                       +-------+   +-------+                       |
|                               |   |                               |
|                               v   v                               |
|                       +---------------+                           |
|                       | Control Plane |                           |
|                       | Established   |                           |
|                       +---------------+                           |
|                               |                                   |
|                               v                                   |
|                       +---------------+                           |
|                       | Data Plane    |                           |
|                       | Active        |                           |
|                       +---------------+                           |
|                                                                   |
+------------------------------------------------------------------+
```

### Device Inventory for Onboarding

| Site | Device Model | Quantity | System IP | Site ID |
|------|--------------|----------|-----------|---------|
| Mumbai DC | C8500-12X4QC | 2 | 10.255.255.1-2 | 100 |
| Chennai DC | C8500-12X4QC | 2 | 10.255.255.11-12 | 110 |
| London Hub | C8300-2N2S-6T | 2 | 10.255.255.21-22 | 200 |
| Frankfurt Hub | C8300-2N2S-6T | 2 | 10.255.255.31-32 | 210 |
| New Jersey Hub | C8300-2N2S-6T | 2 | 10.255.255.41-42 | 300 |
| Dallas Hub | C8300-2N2S-6T | 2 | 10.255.255.51-52 | 310 |
| Bangalore Branch | C8300-1N1S-6T | 2 | 10.255.255.61-62 | 120 |
| Delhi Branch | C8300-1N1S-6T | 2 | 10.255.255.71-72 | 130 |
| Noida Branch | C8300-1N1S-6T | 2 | 10.255.255.81-82 | 140 |

---

## Zero-Touch Provisioning Architecture

### ZTP Components

```
+------------------------------------------------------------------+
|                     ZTP Architecture                              |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------+          +------------------+               |
|  |                  |          |                  |               |
|  |  PnP Connect     |<-------->|  SD-WAN Manager  |               |
|  |  Portal (Cloud)  |  Sync    |  (On-Premises)   |               |
|  |                  |          |                  |               |
|  +------------------+          +------------------+               |
|          ^                              ^                         |
|          |                              |                         |
|          | Device                       | Control                 |
|          | Claim                        | Plane                   |
|          |                              |                         |
|  +------------------+          +------------------+               |
|  |                  |          |                  |               |
|  |  Smart Account   |          |  SD-WAN          |               |
|  |  Virtual Account |          |  Validator       |               |
|  |                  |          |                  |               |
|  +------------------+          +------------------+               |
|          ^                              ^                         |
|          |                              |                         |
|          | License                      | Auth                    |
|          | Entitlement                  | Orchestration           |
|          |                              |                         |
|  +------------------+          +------------------+               |
|  |                  |          |                  |               |
|  |  Cisco Commerce  |          |  WAN Edge        |               |
|  |  (Order Entry)   |          |  Device          |               |
|  |                  |          |                  |               |
|  +------------------+          +------------------+               |
|                                                                   |
+------------------------------------------------------------------+
```

### ZTP Workflow Stages

| Stage | Action | Component | Duration |
|-------|--------|-----------|----------|
| 1 | Device ships with serial in Smart Account | Cisco Commerce | N/A |
| 2 | Device claimed to Virtual Account | PnP Connect | Manual |
| 3 | Controller profile assigned | PnP Connect | Manual |
| 4 | Device powered on, DHCP obtained | WAN Edge | 2 min |
| 5 | Device contacts devicehelper.cisco.com | WAN Edge | 30 sec |
| 6 | PnP redirects to vBond | PnP Connect | 30 sec |
| 7 | vBond authenticates device | SD-WAN Validator | 1 min |
| 8 | Device registers with vManage | SD-WAN Manager | 2 min |
| 9 | Certificate installed | SD-WAN Manager | 1 min |
| 10 | Template pushed | SD-WAN Manager | 2-5 min |
| 11 | Control connections established | vSmart | 2 min |
| 12 | BFD tunnels formed | WAN Edges | 2-5 min |

### Network Requirements for ZTP

```
Firewall Rules Required for ZTP:
================================

# PnP Connect Portal Access
Source: WAN Edge Management
Destination: devicehelper.cisco.com (52.40.128.195, 34.213.60.66)
Port: TCP/443 (HTTPS)

# Cisco Cloud Services
Source: WAN Edge Management
Destination: tools.cisco.com
Port: TCP/443 (HTTPS)

# vBond Public Access
Source: WAN Edge WAN Interface
Destination: sdwan-validator.abhavtech.com (Elastic IPs)
Ports: UDP/12346, TCP/12346

# vManage Access (after vBond redirect)
Source: WAN Edge WAN Interface
Destination: vmanage.abhavtech.com
Ports: TCP/443, TCP/8443

# DNS Resolution
Source: WAN Edge Management
Destination: Corporate DNS / 8.8.8.8
Port: UDP/53
```

---

## PnP Connect Portal Configuration

### Smart Account Setup

**Abhavtech Smart Account:**
- Account Name: Abhavtech Corporation
- Account Domain: abhavtech.com
- Smart Account ID: SA-ABHA-2024-001

**Virtual Accounts:**
| Virtual Account | Purpose | Device Assignment |
|-----------------|---------|-------------------|
| SD-WAN-Production | Production devices | All production WAN Edges |
| SD-WAN-Lab | Lab/test devices | Lab WAN Edges |
| SD-WAN-DR | DR site devices | DR specific equipment |

### PnP Connect Controller Profile

**Create Controller Profile in PnP Connect:**

1. Navigate to: software.cisco.com → PnP Connect
2. Select Virtual Account: SD-WAN-Production
3. Create Controller Profile:

```
Profile Name: Abhavtech-SD-WAN-Production
Profile Type: SD-WAN

Primary Controller:
  Controller Type: vBond
  Protocol: DTLS
  IP/FQDN: sdwan-validator.abhavtech.com
  Port: 12346

Secondary Controller:
  Controller Type: vBond
  Protocol: DTLS
  IP/FQDN: sdwan-validator-secondary.abhavtech.com
  Port: 12346

Organization Name: Abhavtech
vManage URL: https://vmanage.abhavtech.com:8443

Certificate Authority:
  CA Type: Enterprise
  Root CA: Import Abhavtech Root CA certificate
```

### Device Claim Process

**Option 1: Automatic Claim via Order**
- Devices ordered with Smart Account ID auto-populate
- No manual action required
- Verify serial numbers appear in PnP Connect

**Option 2: Manual Device Claim**
```
1. Navigate to PnP Connect Portal
2. Click "Add Devices"
3. Select "Add Devices Manually"
4. Enter device information:
   - Serial Number: FCW2XXXXXXX
   - Product ID: C8300-2N2S-6T
5. Assign to Virtual Account: SD-WAN-Production
6. Apply Controller Profile: Abhavtech-SD-WAN-Production
7. Click "Add Devices"
```

**Option 3: Bulk Device Import**
```csv
# devices.csv format for bulk import
serial_number,product_id,virtual_account,controller_profile
FCW2448P1AB,C8500-12X4QC,SD-WAN-Production,Abhavtech-SD-WAN-Production
FCW2448P1AC,C8500-12X4QC,SD-WAN-Production,Abhavtech-SD-WAN-Production
FCW2448P1AD,C8300-2N2S-6T,SD-WAN-Production,Abhavtech-SD-WAN-Production
FCW2448P1AE,C8300-2N2S-6T,SD-WAN-Production,Abhavtech-SD-WAN-Production
```

### Synchronize PnP with SD-WAN Manager

**vManage PnP Sync Configuration:**

```
Administration → Settings → PnP Connect Sync

Smart Account: Abhavtech Corporation
Username: pnp-admin@abhavtech.com
Password: ********

Sync Options:
  - Auto Sync: Enabled
  - Sync Interval: 15 minutes
  - Sync on Device Add: Enabled

Virtual Accounts to Sync:
  [x] SD-WAN-Production
  [x] SD-WAN-Lab
  [ ] SD-WAN-DR

Click "Sync Now" to initiate immediate sync
```

**Verify Sync Status:**
```
Configuration → Devices → WAN Edge List

Filter: Status = Staging

Expected Results:
- All devices from PnP Connect appear
- Status: Staging (waiting for device connection)
- Serial numbers match PnP portal
```

---

## Bootstrap Configuration Methods

### Method Comparison

| Method | Internet Required | Automation | Security | Typical Use |
|--------|-------------------|------------|----------|-------------|
| PnP/ZTP | Yes | Full | Medium | Standard deployment |
| DHCP Option 43 | Local | Full | Medium | Staging center |
| Manual Console | No | None | High | Air-gapped sites |
| USB Bootstrap | No | Partial | High | Remote sites |
| API Provisioning | Yes | Full | High | DevOps pipelines |

### DHCP Option 43 Configuration

**For Staging Environment - InfoBlox DHCP:**

```
# InfoBlox DHCP Option 43 Configuration
# Encapsulated vendor-specific option for Cisco PnP

Option 43 Sub-options:
  Suboption 1 (Device ID): C8300
  Suboption 2 (Server IP): 10.255.0.10  # vManage cluster VIP
  Suboption 3 (Port): 8443
  Suboption 4 (Transport): https

Hex Encoded Option 43:
option vendor-encapsulated-options 
  05:01:0A:FF:00:0A:20:F3:68:74:74:70:73:3A:2F:2F:31:30:2E:32:35:35:2E:30:2E:31:30:3A:38:34:34:33;

# Alternative: URL-based redirect
option vendor-encapsulated-options 
  "5A;B2;K4;I10.255.0.10;J8443";
```

**Cisco IOS DHCP Server (for lab):**
```
ip dhcp pool SDWAN-STAGING
 network 10.100.0.0 255.255.255.0
 default-router 10.100.0.1
 dns-server 10.255.0.50
 option 43 ascii "5A;B2;K4;I10.255.0.10;J8443"
 lease 1
```

### USB Bootstrap Preparation

**Create USB Bootstrap Configuration:**

```bash
# USB Bootstrap file structure
USB Drive (FAT32):
├── ciscosdwan_cloud_init.cfg    # Day-0 configuration
├── root-ca.pem                   # Enterprise Root CA
└── serialFile.viptela            # Optional: Serial mapping
```

**ciscosdwan_cloud_init.cfg Content:**
```
Content-Type: multipart/mixed; boundary="===============boundary=="
MIME-Version: 1.0

--===============boundary==
Content-Type: text/cloud-config; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="cloud-config"

#cloud-config
vinitparam:
 - uuid             : C8K-MUMBAI-WE01-XXXXXXXX
 - org              : Abhavtech
 - vbond            : sdwan-validator.abhavtech.com
 - otp              : <OTP from vManage>
 - rcc              : true

--===============boundary==
Content-Type: text/cloud-boothook; charset="us-ascii"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
Content-Disposition: attachment; filename="cloud-boothook"

#cloud-boothook

system
 system-ip             10.255.255.1
 site-id               100
 organization-name     "Abhavtech"
 vbond sdwan-validator.abhavtech.com port 12346
!
--===============boundary==--
```

---

## Manual Bootstrap Configuration

### Console Access Setup

**Connection Parameters:**
- Baud Rate: 9600 (default) or 115200
- Data Bits: 8
- Parity: None
- Stop Bits: 1
- Flow Control: None

### Initial Device Access

```
! Device boots with factory default
! Press Enter to access initial configuration dialog

Would you like to enter the initial configuration dialog? [yes/no]: no

Router> enable
Router# configure terminal
```

### Day-0 Bootstrap Configuration

**Mumbai DC WAN Edge 01 - Manual Bootstrap:**

```
! ============================================
! C8500-12X4QC - Mumbai DC Primary WAN Edge
! Serial: FCW2448P1AB
! ============================================

! Hostname and basic settings
hostname C8K-MUMBAI-WE01
!
! System settings for SD-WAN
system
 system-ip             10.255.255.1
 site-id               100
 organization-name     "Abhavtech"
 vbond sdwan-validator.abhavtech.com port 12346
!

! VPN 0 - Transport (WAN)
vpn 0
 name "Transport-VPN"
 !
 ! MPLS Transport Interface
 interface GigabitEthernet0/0/0
  ip address 172.16.100.1/30
  no shutdown
  tunnel-interface
   encapsulation ipsec weight 1
   color mpls
   max-control-connections 2
   vbond sdwan-validator.abhavtech.com
   vmanage-connection-preference 5
  !
 !
 ! Internet Transport Interface  
 interface GigabitEthernet0/0/1
  ip dhcp-client
  no shutdown
  tunnel-interface
   encapsulation ipsec weight 1
   color biz-internet
   max-control-connections 2
   vbond sdwan-validator.abhavtech.com
   vmanage-connection-preference 5
   nat-refresh-interval 5
  !
 !
 ! Default routes for transports
 ip route 0.0.0.0/0 172.16.100.2
 ip route 0.0.0.0/0 dhcp
!

! VPN 512 - Management
vpn 512
 name "Management-VPN"
 !
 interface GigabitEthernet0/0/7
  ip address 10.255.0.101/24
  no shutdown
 !
 ip route 0.0.0.0/0 10.255.0.1
!

! AAA for local authentication
aaa authentication login default local
aaa authorization exec default local
!
username admin privilege 15 secret Abh@vt3ch!2025
!

! Enable SSH
ip ssh version 2
line vty 0 4
 transport input ssh
 login authentication default
!

! NTP Configuration
ntp server 10.255.0.50 vpn 512
!

! Logging
logging server 10.255.0.60 vpn 512
logging source-interface GigabitEthernet0/0/7
!
```

### Generate and Install Certificates Manually

```
! Generate Certificate Signing Request
request platform software sdwan csr

! Output will be displayed - copy entire CSR block
! Submit to Enterprise CA for signing

! After receiving signed certificate from CA:
! 1. Install Root CA certificate chain
request platform software sdwan root-cert-chain install bootflash:root-ca-chain.pem

! 2. Install signed device certificate  
request platform software sdwan certificate install bootflash:device-cert.pem

! Verify certificate installation
show sdwan certificate installed
show sdwan certificate root-ca-cert
show sdwan certificate validity
```

### Verify Control Connections

```
! Check vBond connectivity
show sdwan control connections | include vbond

! Expected output:
PEER     PEER     PEER             SITE   DOMAIN   PEER            PRIV   PEER           PUB          
TYPE     PROT     SYSTEM IP        ID     ID       PRIVATE IP      PORT   PUBLIC IP      PORT   STATE
-------------------------------------------------------------------------------------------------------
vbond    dtls     -                0      0        52.66.xxx.xxx   12346  52.66.xxx.xxx  12346  up

! Check vManage connectivity
show sdwan control connections | include vmanage

! Check vSmart connectivity
show sdwan control connections | include vsmart

! Full control connection summary
show sdwan control connections
show sdwan control local-properties
```

---

## Automated ZTP Workflow

### ZTP State Machine

```
+------------------------------------------------------------------+
|                     ZTP State Diagram                             |
+------------------------------------------------------------------+
|                                                                   |
|  [INIT] ──────────────────────────────────────────────────────>  |
|    │                                                              |
|    ▼                                                              |
|  [DHCP_DISCOVER] ─────────────────────────────────────────────>  |
|    │                                                              |
|    │ IP Obtained                                                  |
|    ▼                                                              |
|  [PNP_DISCOVERY] ─────────────────────────────────────────────>  |
|    │                                                              |
|    │ Contact devicehelper.cisco.com                               |
|    ▼                                                              |
|  [REDIRECT_RECEIVED] ─────────────────────────────────────────>  |
|    │                                                              |
|    │ vBond address received                                       |
|    ▼                                                              |
|  [VBOND_AUTH] ────────────────────────────────────────────────>  |
|    │                                                              |
|    │ Serial verified, org matched                                 |
|    ▼                                                              |
|  [VMANAGE_REGISTER] ──────────────────────────────────────────>  |
|    │                                                              |
|    │ Device appears in vManage                                    |
|    ▼                                                              |
|  [CERT_INSTALL] ──────────────────────────────────────────────>  |
|    │                                                              |
|    │ Enterprise certificate installed                             |
|    ▼                                                              |
|  [TEMPLATE_ATTACH] ───────────────────────────────────────────>  |
|    │                                                              |
|    │ Configuration pushed                                         |
|    ▼                                                              |
|  [VSMART_CONNECT] ────────────────────────────────────────────>  |
|    │                                                              |
|    │ OMP sessions established                                     |
|    ▼                                                              |
|  [OPERATIONAL] ───────────────────────────────────────────────>  |
|    │                                                              |
|    │ BFD tunnels up, traffic flowing                             |
|    ▼                                                              |
|  [COMPLETE]                                                       |
|                                                                   |
+------------------------------------------------------------------+
```

### Pre-Stage Devices in vManage

**Add WAN Edge Device Manually (if not via PnP sync):**

```
Configuration → Devices → WAN Edge List → Add WAN Edge

Device Information:
  Device Model: C8500-12X4QC
  Serial Number: FCW2448P1AB
  Chassis Number: (auto-generated or enter UUID)
  Device Type: vEdge Cloud (IOS-XE)
  
Credentials:
  Generate Bootstrap Configuration: Yes
  Include Default Root Certificate: No (using Enterprise CA)
  
Configuration Group: Mumbai-DC-Hub (pre-created)
```

### Generate OTP for Device Authentication

```
Configuration → Devices → WAN Edge List

1. Select device: C8K-MUMBAI-WE01 (FCW2448P1AB)
2. Click "..." menu → Generate Bootstrap Configuration
3. Options:
   - Include Organization Name: Yes
   - Include OTP: Yes
   - Include vBond Address: Yes
   - Include Root Certificate: Yes (Enterprise CA)
   
4. Download bootstrap file or copy OTP

Generated OTP: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
OTP Validity: 24 hours (default)
```

### ZTP Monitoring in vManage

**Real-Time ZTP Status:**
```
Monitor → Devices → WAN Edge

Filter by Status:
- Staging: Device claimed, waiting to connect
- Onboarding: Device connecting, certificate pending
- In Sync: Template attached, config pushed
- Online: Fully operational

ZTP Events Dashboard:
Administration → Settings → PnP → View Events

Event Types:
- DEVICE_CLAIMED: Device added to PnP
- REDIRECT_SENT: vBond address sent to device
- AUTH_SUCCESS: Device authenticated
- CERT_INSTALLED: Certificate installed
- CONFIG_PUSHED: Template configuration applied
- CONTROL_UP: Control connections established
```

---

## Enterprise PKI Integration

### Certificate Authority Requirements

**Abhavtech SD-WAN CA Configuration:**
- CA Type: Enterprise Subordinate CA
- Key Algorithm: RSA 4096-bit
- Hash Algorithm: SHA-256
- Validity: 10 years (Issuing CA), 2 years (device certs)
- CRL Distribution: http://ca.abhavtech.com/crl/sdwan-ca.crl
- OCSP Responder: http://ocsp.abhavtech.com

### vManage Enterprise CA Configuration

```
Administration → Settings → Enterprise Root Certificate

Certificate Operations:
1. Download Current Root CA (for backup)
2. Install Enterprise Root CA

Upload Abhavtech Root CA:
  - File: abhavtech-root-ca.pem
  - Format: PEM (Base64 encoded)
  
Upload Abhavtech SD-WAN Issuing CA:
  - File: abhavtech-sdwan-issuing-ca.pem
  - Chain: Combined root + issuing CA chain

Verify Chain:
  - Root CA: Abhavtech Root CA
  - Issuing CA: Abhavtech SD-WAN CA
  - Chain Length: 2
  - Validity: OK
```

### Automatic Certificate Signing

**Configure vManage for Automatic CSR Signing:**

```
Administration → Settings → Certificate Signing

Mode: Automatic (Enterprise CA)

Enterprise CA Settings:
  CA Server URL: https://ca.abhavtech.com/certsrv
  CA Template: SDWANCertificate
  
Authentication:
  Method: Certificate-based
  Client Certificate: vmanage-ca-client.pfx
  Client Certificate Password: ********
  
Or:
  Method: Username/Password
  CA Username: sdwan-cert-admin
  CA Password: ********
  
Automatic Signing:
  Auto-Sign New Device CSRs: Enabled
  Auto-Sign Renewal CSRs: Enabled
  
Notification:
  Email on Certificate Issue: noc@abhavtech.com
  Email on Signing Failure: security@abhavtech.com
```

### Manual Certificate Process (if automatic not configured)

```
Step 1: Device generates CSR during onboarding
        CSR appears in: Administration → Settings → Controller Certificate Authorization

Step 2: Download CSR
        Configuration → Certificates → WAN Edge List
        Select device → Download CSR

Step 3: Submit to Enterprise CA
        # Using certreq (Windows)
        certreq -submit -attrib "CertificateTemplate:SDWANCertificate" device.csr device.cer
        
        # Using openssl (Linux)
        openssl ca -config /etc/pki/sdwan-ca.cnf -in device.csr -out device.cer

Step 4: Upload signed certificate to vManage
        Configuration → Certificates → WAN Edge List
        Select device → Install Certificate → Upload device.cer

Step 5: Verify installation
        Device status changes from "CSR Pending" to "Certificate Installed"
```

---

## WAN Edge Device Preparation

### Hardware Verification

**Pre-Deployment Checklist per Device:**

| Check Item | Verification Method | Expected Result |
|------------|---------------------|-----------------|
| Model matches order | Physical inspection | C8500-12X4QC / C8300-2N2S-6T |
| Serial number | show version | Matches PnP claim |
| IOS-XE version | show version | 17.15.1a or later |
| Memory | show platform resources | ≥16GB (C8500), ≥8GB (C8300) |
| Storage | show platform software ... | ≥32GB available |
| Licenses | show license status | DNA Advantage active |
| Modules installed | show inventory | All ordered modules present |

### Factory Reset (if required)

```
! If device has previous configuration, factory reset:

! Method 1: From privileged exec
request platform software sdwan software reset

! Method 2: From ROMMON (if locked out)
rommon 1 > confreg 0x2142
rommon 2 > reset

! After boot, reset to default
Router# write erase
Router# delete /force viptela_serial*.viptela
Router# delete /force *.cfg
Router# reload
```

### Software Upgrade (if needed)

```
! Check current version
show version | include Cisco IOS XE Software

! If not 17.15.x, upgrade via USB or TFTP:

! USB method:
copy usbflash0:c8300-universalk9.17.15.01a.SPA.bin bootflash:
request platform software package install switch all file bootflash:c8300-universalk9.17.15.01a.SPA.bin

! TFTP method:
copy tftp://10.255.0.100/c8300-universalk9.17.15.01a.SPA.bin bootflash:
request platform software package install switch all file bootflash:c8300-universalk9.17.15.01a.SPA.bin

! Activate new version
request platform software package install switch all file bootflash:c8300-universalk9.17.15.01a.SPA.bin on-reboot
reload
```

### Enable Controller Mode

```
! Verify current mode
show sdwan running-config | section system

! If autonomous mode, convert to controller mode:
controller-mode enable

! Device will reload and boot in controller mode
! After reload, SD-WAN commands become available
```

---

## Onboarding Hub Site WAN Edges

### Mumbai DC Hub - Complete Onboarding Procedure

**Step 1: Physical Installation**
```
Physical Connections:
=====================
C8500-12X4QC Slot/Port Assignments:

Interface                 Connection              Cable Type
-------------------------------------------------------------------------
TenGigabitEthernet0/0/0   MPLS PE Router          SMF LC-LC
TenGigabitEthernet0/0/1   Internet Router         SMF LC-LC
TenGigabitEthernet0/0/2   Internet Router 2       SMF LC-LC
TenGigabitEthernet0/0/3   LTE Gateway             Cat6 RJ45
TenGigabitEthernet0/0/4   SD-Access Border 1      SMF LC-LC (VRF-Lite)
TenGigabitEthernet0/0/5   SD-Access Border 2      SMF LC-LC (VRF-Lite)
TenGigabitEthernet0/0/6   Spare/Future            -
TenGigabitEthernet0/0/7   Management Network      Cat6 RJ45
FortyGigabitEthernet0/0/0 Core Switch Uplink     QSFP+ SR4
```

**Step 2: Verify PnP/ZTP Prerequisites**
```
Network Connectivity Pre-Checks:
================================

# From staging network, verify DNS resolution
nslookup devicehelper.cisco.com
  → Should resolve to Cisco cloud IPs

# Verify vBond reachability
nslookup sdwan-validator.abhavtech.com
  → Should resolve to vBond public IPs

# Verify HTTPS to PnP portal
curl -I https://devicehelper.cisco.com
  → Should return HTTP 200
```

**Step 3: Power On and Monitor ZTP**
```
Console Monitoring Commands:
============================

! Watch ZTP progress on console
debug pnp all

! Expected console output sequence:
%PNP-6-PNP_DHCP_CONFIG_ACQUIRED: DHCP config acquired...
%PNP-6-PNP_DISCOVERY_STARTED: PnP discovery started...
%PNP-6-HTTP_CONNECTED: HTTP connection to devicehelper.cisco.com...
%PNP-6-PNP_REDIRECT_RECEIVED: Redirect to sdwan-validator.abhavtech.com...
%SDWAN-6-CONTROL_CONN_UP: Control connection to vBond established...
%SDWAN-6-VMANAGE_REGISTERED: Device registered with vManage...
```

**Step 4: Monitor in vManage**
```
vManage Dashboard Monitoring:
=============================

Monitor → Devices → WAN Edge

Device: C8K-MUMBAI-WE01
Serial: FCW2448P1AB
Status: (watch progression)
  1. Staging → 
  2. Onboarding → 
  3. In Sync → 
  4. Online

Timeline (typical):
- 0:00 - Device powered on
- 0:02 - DHCP obtained
- 0:03 - PnP discovery complete
- 0:04 - vBond authentication
- 0:05 - vManage registration
- 0:07 - Certificate installed
- 0:10 - Template attached
- 0:12 - Control connections up
- 0:15 - BFD tunnels forming
- 0:20 - Fully operational
```

**Step 5: Verify Control Plane**
```
! On WAN Edge device:
show sdwan control connections

! Expected output:
PEER     PEER     PEER             SITE   DOMAIN   PEER            PRIV   PEER           PUB          
TYPE     PROT     SYSTEM IP        ID     ID       PRIVATE IP      PORT   PUBLIC IP      PORT   STATE
-------------------------------------------------------------------------------------------------------
vbond    dtls     -                0      0        52.66.50.1      12346  52.66.50.1     12346  up
vbond    dtls     -                0      0        3.1.200.1       12346  3.1.200.1      12346  up
vsmart   dtls     10.255.1.11      100    1        10.255.1.11     12346  10.255.1.11    12346  up
vsmart   dtls     10.255.1.12      100    1        10.255.1.12     12346  10.255.1.12    12346  up
vsmart   dtls     10.255.1.21      110    1        10.255.1.21     12346  10.255.1.21    12346  up
vsmart   dtls     10.255.1.22      110    1        10.255.1.22     12346  10.255.1.22    12346  up
vmanage  dtls     10.255.0.11      100    0        10.255.0.11     12346  10.255.0.11    12346  up
```

**Step 6: Attach Device Template**
```
vManage Template Attachment:
============================

Configuration → Templates → Device Templates
Select: Mumbai-DC-Hub-Template
Click: Attach Devices

Select Device: C8K-MUMBAI-WE01 (FCW2448P1AB)
Click: Attach

Device Variables Input:
-----------------------
system_ip: 10.255.255.1
site_id: 100
hostname: C8K-MUMBAI-WE01
mpls_ip: 172.16.100.1/30
mpls_gateway: 172.16.100.2
internet_dhcp: true
lte_apn: abhavtech.lte
management_ip: 10.255.0.101/24

Click: Configure Devices → Confirm
```

### Chennai DC Hub - Onboarding Procedure

**Repeat Steps 1-6 with Chennai-specific values:**

| Parameter | Chennai WE01 | Chennai WE02 |
|-----------|--------------|--------------|
| Hostname | C8K-CHENNAI-WE01 | C8K-CHENNAI-WE02 |
| Serial | FCW2448P1AC | FCW2448P1AD |
| System IP | 10.255.255.11 | 10.255.255.12 |
| Site ID | 110 | 110 |
| MPLS IP | 172.16.110.1/30 | 172.16.110.5/30 |
| Management IP | 10.255.0.111/24 | 10.255.0.112/24 |

---

## Onboarding Branch Site WAN Edges

### Branch Site Onboarding Workflow

```
+------------------------------------------------------------------+
|              Branch Site ZTP Workflow (Simplified)                |
+------------------------------------------------------------------+
|                                                                   |
|  Pre-Work (NOC):                                                  |
|  +-----------------+     +------------------+                     |
|  | Add device to   |---->| Assign to branch |                     |
|  | PnP Connect     |     | config group     |                     |
|  +-----------------+     +------------------+                     |
|                                                                   |
|  On-Site (Technician):                                            |
|  +-----------------+     +------------------+                     |
|  | Connect cables  |---->| Power on device  |                     |
|  | per diagram     |     |                  |                     |
|  +-----------------+     +------------------+                     |
|           |                      |                                |
|           v                      v                                |
|  +-----------------+     +------------------+                     |
|  | ZTP auto-       |---->| Template auto-   |                     |
|  | provisions      |     | attaches         |                     |
|  +-----------------+     +------------------+                     |
|                                  |                                |
|                                  v                                |
|                         +------------------+                      |
|                         | NOC verifies     |                      |
|                         | connectivity     |                      |
|                         +------------------+                      |
|                                                                   |
+------------------------------------------------------------------+
```

### Bangalore Branch - Onboarding Example

**Pre-Deployment (NOC Actions):**
```
1. Verify device in PnP Connect
   - Serial: FCW2448P1AE
   - Model: C8300-1N1S-6T
   - Controller Profile: Abhavtech-SD-WAN-Production

2. Create Configuration Group (if not exists)
   Configuration → Templates → Configuration Groups
   Name: India-Branch-Standard
   Settings: Pre-configured for branch requirements

3. Pre-assign device to configuration group
   Configuration → Devices → WAN Edge List
   Select: FCW2448P1AE (Staging)
   Assign Configuration Group: India-Branch-Standard
   
4. Set device variables in advance
   Device Variables:
   - system_ip: 10.255.255.61
   - site_id: 120
   - hostname: C8K-BANGALORE-WE01
   - wan_interface_ip: DHCP
   - management_ip: 10.120.0.1/24
```

**On-Site Installation (Technician Actions):**
```
Physical Connection Guide for Branch:
=====================================

C8300-1N1S-6T Port Assignments:

Port              Connection              Notes
------------------------------------------------------------
GE0/0/0           Internet Circuit        ISP handoff
GE0/0/1           LTE Modem               4G/5G backup
GE0/0/2           SD-Access Border        VRF-Lite handoff
GE0/0/3           Spare                   Future use
GE0/0/4           Management Switch       OOB management
GE0/0/5           Console                 Local console

Power Requirements:
- Input: 100-240V AC
- Power consumption: ~150W typical
- UPS recommended: 30 minutes runtime

Step-by-Step:
1. Rack mount device in designated location
2. Connect cables per diagram above
3. Connect power cable
4. Power on device (front panel switch)
5. Wait 15-20 minutes for ZTP completion
6. Verify front panel LEDs:
   - SYS: Green (solid)
   - ACT: Green (blinking = traffic)
   - WAN: Green (link up)
```

**NOC Verification:**
```
vManage Verification:
====================

Monitor → Devices → WAN Edge List
Filter: site-id = 120

Expected Status: Online
Control Connections: 6/6 (2 vBond, 4 vSmart, vManage implicit)
BFD Sessions: Up (to hub sites)

CLI Verification (via vManage):
Tools → SSH Terminal → Select C8K-BANGALORE-WE01

show sdwan control connections
show sdwan bfd sessions
show sdwan omp summary
show interface summary
```

### Bulk Branch Onboarding

**For Multiple Branch Sites:**

```python
#!/usr/bin/env python3
"""
Bulk Branch Onboarding Script
Prepares multiple devices for ZTP onboarding
"""

import requests
import json
import csv

# vManage connection
VMANAGE_HOST = "vmanage.abhavtech.com"
VMANAGE_USER = "admin"
VMANAGE_PASS = "********"

# Branch device list
BRANCH_DEVICES = [
    {"serial": "FCW2448P1AE", "hostname": "C8K-BANGALORE-WE01", 
     "system_ip": "10.255.255.61", "site_id": 120},
    {"serial": "FCW2448P1AF", "hostname": "C8K-BANGALORE-WE02", 
     "system_ip": "10.255.255.62", "site_id": 120},
    {"serial": "FCW2448P1AG", "hostname": "C8K-DELHI-WE01", 
     "system_ip": "10.255.255.71", "site_id": 130},
    {"serial": "FCW2448P1AH", "hostname": "C8K-DELHI-WE02", 
     "system_ip": "10.255.255.72", "site_id": 130},
    {"serial": "FCW2448P1AI", "hostname": "C8K-NOIDA-WE01", 
     "system_ip": "10.255.255.81", "site_id": 140},
    {"serial": "FCW2448P1AJ", "hostname": "C8K-NOIDA-WE02", 
     "system_ip": "10.255.255.82", "site_id": 140},
]

CONFIG_GROUP = "India-Branch-Standard"

class vManageSession:
    def __init__(self, host, user, password):
        self.host = host
        self.session = requests.Session()
        self.session.verify = False
        self.login(user, password)
    
    def login(self, user, password):
        url = f"https://{self.host}/j_security_check"
        data = {"j_username": user, "j_password": password}
        response = self.session.post(url, data=data)
        
        # Get CSRF token
        token_url = f"https://{self.host}/dataservice/client/token"
        token_response = self.session.get(token_url)
        if token_response.status_code == 200:
            self.session.headers["X-XSRF-TOKEN"] = token_response.text
    
    def assign_config_group(self, serial, config_group, variables):
        """Assign configuration group and variables to device"""
        url = f"https://{self.host}/dataservice/template/device/config/attachcg"
        
        payload = {
            "deviceTemplateList": [{
                "templateId": self.get_config_group_id(config_group),
                "device": [{
                    "csv-deviceId": serial,
                    "csv-host-name": variables.get("hostname"),
                    "//system/system-ip": variables.get("system_ip"),
                    "//system/site-id": str(variables.get("site_id")),
                }]
            }]
        }
        
        response = self.session.post(url, json=payload)
        return response.json()
    
    def get_config_group_id(self, name):
        """Get configuration group ID by name"""
        url = f"https://{self.host}/dataservice/template/policy/vsmart"
        response = self.session.get(url)
        # Parse and return ID (simplified)
        return "config-group-id"

def main():
    vmanage = vManageSession(VMANAGE_HOST, VMANAGE_USER, VMANAGE_PASS)
    
    for device in BRANCH_DEVICES:
        print(f"Preparing {device['hostname']} ({device['serial']})...")
        
        result = vmanage.assign_config_group(
            serial=device["serial"],
            config_group=CONFIG_GROUP,
            variables={
                "hostname": device["hostname"],
                "system_ip": device["system_ip"],
                "site_id": device["site_id"]
            }
        )
        
        print(f"  Result: {result}")
    
    print("\nAll devices prepared for ZTP onboarding")
    print("Ship devices to sites - they will auto-provision on power-up")

if __name__ == "__main__":
    main()
```

---

## Multi-Tenant Onboarding

### Tenant Isolation Architecture

```
+------------------------------------------------------------------+
|                  Multi-Tenant SD-WAN Model                        |
+------------------------------------------------------------------+
|                                                                   |
|  SD-WAN Manager (Provider)                                        |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |  +------------------+  +------------------+                 |  |
|  |  | Tenant A         |  | Tenant B         |                 |  |
|  |  | (Abhavtech)      |  | (Subsidiary)     |                 |  |
|  |  | Org: Abhavtech   |  | Org: SubCo       |                 |  |
|  |  +------------------+  +------------------+                 |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                                                                   |
|  WAN Edge Assignment:                                             |
|  +-----------------+          +-----------------+                 |
|  | Abhavtech       |          | SubCo           |                 |
|  | Devices         |          | Devices         |                 |
|  | (18 WAN Edges)  |          | (4 WAN Edges)   |                 |
|  +-----------------+          +-----------------+                 |
|                                                                   |
+------------------------------------------------------------------+
```

### Tenant-Specific Onboarding

**For Abhavtech Primary Tenant:**
```
Organization: Abhavtech
vBond: sdwan-validator.abhavtech.com
PnP Controller Profile: Abhavtech-SD-WAN-Production

Device Assignment:
- All 9 sites
- 18 WAN Edge devices
- Configuration Groups: Hub and Branch templates
```

**For Subsidiary Tenant (if applicable):**
```
Organization: SubCo
vBond: sdwan-validator.subco.com (or shared)
PnP Controller Profile: SubCo-SD-WAN-Production

Device Assignment:
- Separate Virtual Account in Smart Account
- Isolated configuration groups
- Separate VPN assignments
```

---

## Troubleshooting Onboarding Issues

### Common Issues and Resolutions

| Issue | Symptoms | Root Cause | Resolution |
|-------|----------|------------|------------|
| PnP not starting | Device at default config | No DHCP, DNS failure | Verify network connectivity |
| vBond unreachable | Stuck at "Connecting" | Firewall blocking 12346 | Open UDP/TCP 12346 |
| Auth failure | "Organization mismatch" | Wrong org in PnP profile | Verify org name matches |
| CSR pending | Device stuck in "Onboarding" | CA not configured | Configure auto-signing or manual sign |
| Template fail | Config push errors | Variable mismatch | Check template variables |
| No BFD | Control up, no data plane | Tunnel interface config | Verify tunnel-interface config |

### Diagnostic Commands

```
! ZTP/PnP Troubleshooting
show pnp status
show pnp profile
show pnp tech-support
debug pnp all

! Control Plane Issues
show sdwan control connections
show sdwan control local-properties
show sdwan control connection-history
debug sdwan control all

! Certificate Issues
show sdwan certificate installed
show sdwan certificate root-ca-cert
show sdwan certificate serial
show sdwan certificate validity
debug sdwan certificate

! vBond Connectivity
show sdwan control connections | include vbond
ping vrf 0 sdwan-validator.abhavtech.com
traceroute vrf 0 sdwan-validator.abhavtech.com

! BFD/Data Plane Issues
show sdwan bfd sessions
show sdwan bfd summary
show sdwan tunnel statistics
debug sdwan bfd
```

### ZTP Failure Recovery

**Scenario 1: PnP Discovery Failure**
```
! Check DHCP assignment
show dhcp lease

! Manually configure vBond if PnP fails
configure terminal
system
 vbond sdwan-validator.abhavtech.com port 12346
!
commit

! Force PnP retry
pnp service reset
```

**Scenario 2: Certificate Installation Failure**
```
! Check CSR status
show sdwan certificate signing-request

! Regenerate CSR if corrupted
request platform software sdwan csr

! Manually install after getting signed cert
request platform software sdwan certificate install bootflash:signed-cert.pem
```

**Scenario 3: Template Push Failure**
```
! In vManage, check push status
Configuration → Devices → WAN Edge List
Select device → Config History

! Common errors:
- "Variable not defined" → Add missing variable
- "Interface not found" → Check interface naming
- "Duplicate IP" → Resolve IP conflict

! Force template re-push
Configuration → Devices → WAN Edge List
Select device → More Actions → Push Configuration
```

### Log Collection for TAC

```
! Collect comprehensive logs
request platform software sdwan troubleshoot collect

! Transfer to TFTP/SCP
copy bootflash:sdwan-troubleshoot-*.tar.gz tftp://10.255.0.100/

! Or via vManage
Administration → Settings → Troubleshooting
Select device → Collect Logs
```

---

## Verification and Validation

### Post-Onboarding Verification Checklist

```
+------------------------------------------------------------------+
|              WAN Edge Onboarding Verification                     |
+------------------------------------------------------------------+

Device: _____________________  Serial: _____________________

Control Plane Verification:
---------------------------
[ ] vBond connections: ___/2 (both primary and secondary)
[ ] vSmart connections: ___/4 (all controllers)
[ ] vManage connection: Up
[ ] Certificate status: Valid, expires: __________
[ ] OMP state: Up
[ ] OMP routes received: _____ prefixes

Data Plane Verification:
------------------------
[ ] BFD sessions: _____ up
[ ] IPsec tunnels: _____ established
[ ] TLOC colors active: [ ]MPLS [ ]Internet [ ]LTE
[ ] Traffic flowing through tunnels: Yes/No

Configuration Verification:
---------------------------
[ ] Template attached: __________
[ ] Config in sync with vManage: Yes/No
[ ] All interfaces operational: Yes/No
[ ] VPN 0 (Transport) configured: Yes/No
[ ] VPN 512 (Management) configured: Yes/No
[ ] Service VPNs configured: Yes/No

Integration Verification:
-------------------------
[ ] SD-Access handoff interface: Up
[ ] BGP to SD-Access border: Established
[ ] VRF routes exchanged: Yes/No
[ ] SGT propagation working: Yes/No

Sign-off:
---------
Verified by: _____________________ Date: __________
```

### Automated Verification Script

```python
#!/usr/bin/env python3
"""
WAN Edge Onboarding Verification Script
"""

import requests
import json
from datetime import datetime

VMANAGE_HOST = "vmanage.abhavtech.com"
VMANAGE_USER = "admin"
VMANAGE_PASS = "********"

def verify_device_onboarding(session, device_ip):
    """Verify complete onboarding status for a device"""
    
    results = {
        "device_ip": device_ip,
        "timestamp": datetime.now().isoformat(),
        "checks": {}
    }
    
    # Check control connections
    url = f"https://{VMANAGE_HOST}/dataservice/device/control/connections"
    params = {"deviceId": device_ip}
    response = session.get(url, params=params)
    
    if response.status_code == 200:
        connections = response.json().get("data", [])
        vbond_count = sum(1 for c in connections if c["peer-type"] == "vbond" and c["state"] == "up")
        vsmart_count = sum(1 for c in connections if c["peer-type"] == "vsmart" and c["state"] == "up")
        vmanage_count = sum(1 for c in connections if c["peer-type"] == "vmanage" and c["state"] == "up")
        
        results["checks"]["vbond_connections"] = {"expected": 2, "actual": vbond_count, "pass": vbond_count >= 1}
        results["checks"]["vsmart_connections"] = {"expected": 4, "actual": vsmart_count, "pass": vsmart_count >= 2}
        results["checks"]["vmanage_connection"] = {"expected": 1, "actual": vmanage_count, "pass": vmanage_count >= 1}
    
    # Check BFD sessions
    url = f"https://{VMANAGE_HOST}/dataservice/device/bfd/sessions"
    params = {"deviceId": device_ip}
    response = session.get(url, params=params)
    
    if response.status_code == 200:
        sessions = response.json().get("data", [])
        up_sessions = sum(1 for s in sessions if s["state"] == "up")
        results["checks"]["bfd_sessions"] = {"actual": up_sessions, "pass": up_sessions > 0}
    
    # Check certificate validity
    url = f"https://{VMANAGE_HOST}/dataservice/device/certificate/validity"
    params = {"deviceId": device_ip}
    response = session.get(url, params=params)
    
    if response.status_code == 200:
        cert_data = response.json().get("data", [])
        if cert_data:
            expiry = cert_data[0].get("expiration-date", "Unknown")
            results["checks"]["certificate"] = {"expiry": expiry, "pass": True}
    
    # Check OMP status
    url = f"https://{VMANAGE_HOST}/dataservice/device/omp/summary"
    params = {"deviceId": device_ip}
    response = session.get(url, params=params)
    
    if response.status_code == 200:
        omp_data = response.json().get("data", [])
        if omp_data:
            omp_state = omp_data[0].get("operstate", "unknown")
            routes = omp_data[0].get("routes-received", 0)
            results["checks"]["omp_state"] = {"state": omp_state, "routes": routes, "pass": omp_state == "up"}
    
    # Calculate overall status
    all_passed = all(check.get("pass", False) for check in results["checks"].values())
    results["overall_status"] = "PASS" if all_passed else "FAIL"
    
    return results

def main():
    # Create session
    session = requests.Session()
    session.verify = False
    
    # Login
    login_url = f"https://{VMANAGE_HOST}/j_security_check"
    session.post(login_url, data={"j_username": VMANAGE_USER, "j_password": VMANAGE_PASS})
    
    # Get CSRF token
    token_url = f"https://{VMANAGE_HOST}/dataservice/client/token"
    token = session.get(token_url).text
    session.headers["X-XSRF-TOKEN"] = token
    
    # Verify all devices
    devices = [
        "10.255.255.1",   # Mumbai WE01
        "10.255.255.2",   # Mumbai WE02
        "10.255.255.11",  # Chennai WE01
        "10.255.255.12",  # Chennai WE02
        # Add more devices...
    ]
    
    print("=" * 60)
    print("WAN Edge Onboarding Verification Report")
    print("=" * 60)
    
    for device_ip in devices:
        results = verify_device_onboarding(session, device_ip)
        
        print(f"\nDevice: {device_ip}")
        print("-" * 40)
        
        for check, data in results["checks"].items():
            status = "✓" if data.get("pass") else "✗"
            print(f"  {status} {check}: {data}")
        
        print(f"\n  Overall: {results['overall_status']}")
    
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()
```

---

## Onboarding Automation Scripts

### Complete ZTP Preparation Script

```python
#!/usr/bin/env python3
"""
Complete ZTP Preparation Script
Prepares all devices for automated onboarding
"""

import requests
import json
import csv
import time
from datetime import datetime

class SDWANOnboardingManager:
    def __init__(self, vmanage_host, username, password):
        self.host = vmanage_host
        self.session = requests.Session()
        self.session.verify = False
        self._login(username, password)
    
    def _login(self, username, password):
        """Authenticate to vManage"""
        url = f"https://{self.host}/j_security_check"
        response = self.session.post(url, data={
            "j_username": username,
            "j_password": password
        })
        
        # Get CSRF token
        token_url = f"https://{self.host}/dataservice/client/token"
        token = self.session.get(token_url).text
        self.session.headers["X-XSRF-TOKEN"] = token
    
    def add_wan_edge(self, serial, model, chassis_id=None):
        """Add WAN Edge device to vManage"""
        url = f"https://{self.host}/dataservice/system/device/vedges"
        
        payload = {
            "deviceModel": model,
            "serialNumber": serial,
            "chpiId": chassis_id or serial,
            "deviceIP": "",
            "validity": "valid"
        }
        
        response = self.session.post(url, json=payload)
        return response.json()
    
    def generate_bootstrap(self, serial, include_otp=True):
        """Generate bootstrap configuration for device"""
        url = f"https://{self.host}/dataservice/system/device/bootstrap"
        
        params = {
            "serialNumber": serial,
            "includeOTP": include_otp,
            "includeRootCert": True
        }
        
        response = self.session.get(url, params=params)
        return response.json()
    
    def attach_template(self, device_id, template_id, variables):
        """Attach device template with variables"""
        url = f"https://{self.host}/dataservice/template/device/config/attachfeature"
        
        payload = {
            "deviceTemplateList": [{
                "templateId": template_id,
                "device": [{
                    "csv-deviceId": device_id,
                    **variables
                }],
                "isEdited": False,
                "isMasterEdited": False
            }]
        }
        
        response = self.session.post(url, json=payload)
        return response.json()
    
    def get_device_status(self, serial):
        """Get device onboarding status"""
        url = f"https://{self.host}/dataservice/device"
        response = self.session.get(url)
        
        if response.status_code == 200:
            devices = response.json().get("data", [])
            for device in devices:
                if device.get("uuid") == serial or device.get("board-serial") == serial:
                    return device
        return None
    
    def wait_for_online(self, serial, timeout=600):
        """Wait for device to come online"""
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            status = self.get_device_status(serial)
            if status and status.get("reachability") == "reachable":
                return True
            time.sleep(30)
        
        return False

def prepare_site_devices(manager, site_config):
    """Prepare all devices for a site"""
    
    print(f"\nPreparing site: {site_config['site_name']} (Site ID: {site_config['site_id']})")
    print("-" * 50)
    
    for device in site_config["devices"]:
        print(f"  Processing {device['hostname']} ({device['serial']})...")
        
        # Add device to vManage
        result = manager.add_wan_edge(
            serial=device["serial"],
            model=device["model"]
        )
        print(f"    Added to vManage: {result.get('status', 'OK')}")
        
        # Generate bootstrap
        bootstrap = manager.generate_bootstrap(device["serial"])
        print(f"    Bootstrap generated: OTP = {bootstrap.get('otp', 'N/A')[:8]}...")
        
        # Pre-stage template attachment
        variables = {
            "//system/system-ip": device["system_ip"],
            "//system/site-id": str(site_config["site_id"]),
            "csv-host-name": device["hostname"],
        }
        
        # Add site-specific variables
        variables.update(device.get("variables", {}))
        
        print(f"    Template variables staged")
        
    print(f"  Site {site_config['site_name']} preparation complete")

def main():
    # Configuration
    VMANAGE_HOST = "vmanage.abhavtech.com"
    VMANAGE_USER = "admin"
    VMANAGE_PASS = "********"
    
    # Site configurations
    SITES = [
        {
            "site_name": "Mumbai DC",
            "site_id": 100,
            "template": "Mumbai-DC-Hub-Template",
            "devices": [
                {
                    "serial": "FCW2448P1AB",
                    "model": "C8500-12X4QC",
                    "hostname": "C8K-MUMBAI-WE01",
                    "system_ip": "10.255.255.1",
                    "variables": {
                        "mpls_ip": "172.16.100.1/30",
                        "mpls_gateway": "172.16.100.2"
                    }
                },
                {
                    "serial": "FCW2448P1AC",
                    "model": "C8500-12X4QC",
                    "hostname": "C8K-MUMBAI-WE02",
                    "system_ip": "10.255.255.2",
                    "variables": {
                        "mpls_ip": "172.16.100.5/30",
                        "mpls_gateway": "172.16.100.6"
                    }
                }
            ]
        },
        {
            "site_name": "Bangalore Branch",
            "site_id": 120,
            "template": "India-Branch-Standard",
            "devices": [
                {
                    "serial": "FCW2448P1AE",
                    "model": "C8300-1N1S-6T",
                    "hostname": "C8K-BANGALORE-WE01",
                    "system_ip": "10.255.255.61",
                    "variables": {}
                },
                {
                    "serial": "FCW2448P1AF",
                    "model": "C8300-1N1S-6T",
                    "hostname": "C8K-BANGALORE-WE02",
                    "system_ip": "10.255.255.62",
                    "variables": {}
                }
            ]
        }
        # Add more sites...
    ]
    
    # Initialize manager
    print("=" * 60)
    print("SD-WAN ZTP Preparation Script")
    print(f"Timestamp: {datetime.now().isoformat()}")
    print("=" * 60)
    
    manager = SDWANOnboardingManager(VMANAGE_HOST, VMANAGE_USER, VMANAGE_PASS)
    
    # Process all sites
    for site in SITES:
        prepare_site_devices(manager, site)
    
    print("\n" + "=" * 60)
    print("ZTP Preparation Complete")
    print("Devices are ready for shipping and auto-provisioning")
    print("=" * 60)

if __name__ == "__main__":
    main()
```

---

## Summary

### Key Takeaways

1. **ZTP is the preferred method** for production deployments - minimizes manual configuration and human error

2. **PnP Connect integration** with Smart Account enables true zero-touch experience when devices are ordered with correct account association

3. **Enterprise PKI integration** is essential for production security - automatic certificate signing streamlines operations

4. **Pre-staging devices** in vManage with configuration groups and variables enables fully automated deployment

5. **Verification is critical** - always run post-onboarding checks before declaring a device production-ready

### Onboarding Timeline Summary

| Site Type | Preparation Time | ZTP Time | Total |
|-----------|------------------|----------|-------|
| Hub Site | 2 hours | 20 minutes | 2.5 hours |
| Branch Site | 30 minutes | 15 minutes | 45 minutes |
| Bulk (10 branches) | 2 hours | 15 min each | 4.5 hours |

### Next Steps After Onboarding

1. Verify control plane connectivity to all controllers
2. Confirm BFD tunnels established to hub sites
3. Validate SD-Access fabric handoff (Section 5.12)
4. Apply traffic policies and QoS (Chapter 4 policies)
5. Begin traffic migration per cutover runbook (Section 5.15)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech | Initial release |

---

*Document: 5.7 WAN Edge Onboarding (ZTP)*
*Abhavtech SD-WAN Documentation Project*
*Confidential - Internal Use Only*
