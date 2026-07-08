# 5.7 WAN Edge Onboarding (ZTP)

## Document Information
- **Version**: 1.0
- **Last Updated**: December 2025
- **Author**: Network Architecture Team
- **Status**: Production Ready

## Overview

This section provides comprehensive procedures for onboarding WAN Edge devices to the Abhavtech.com SD-WAN fabric using Zero Touch Provisioning (ZTP), Plug and Play (PnP), and manual methods. The onboarding process authenticates devices, establishes control plane connectivity, and applies configuration templates automatically.

## Onboarding Methods Comparison

```
+------------------------------------------------------------------+
|                    WAN Edge Onboarding Methods                    |
+------------------------------------------------------------------+
|                                                                    |
|  +----------------+  +----------------+  +----------------+        |
|  |      ZTP       |  |      PnP       |  |    Manual     |        |
|  |  (Preferred)   |  |  (Alternate)   |  |  (Fallback)   |        |
|  +----------------+  +----------------+  +----------------+        |
|  | - DHCP/DNS     |  | - Catalyst Ctr |  | - CLI config  |        |
|  | - Cloud ZTP    |  | - Local PnP    |  | - USB bootstrap|       |
|  | - Automatic    |  | - Semi-auto    |  | - SSH access  |        |
|  +----------------+  +----------------+  +----------------+        |
|         |                   |                   |                  |
|         v                   v                   v                  |
|  +----------------------------------------------------------+     |
|  |              SD-WAN Manager Authentication               |     |
|  |           Certificate Exchange & Validation              |     |
|  +----------------------------------------------------------+     |
|         |                   |                   |                  |
|         v                   v                   v                  |
|  +----------------------------------------------------------+     |
|  |               Control Plane Connectivity                 |     |
|  |        vBond → vManage → vSmart (DTLS Tunnels)          |     |
|  +----------------------------------------------------------+     |
|         |                   |                   |                  |
|         v                   v                   v                  |
|  +----------------------------------------------------------+     |
|  |              Template Push & Activation                  |     |
|  |         Device/Feature Templates Applied                 |     |
|  +----------------------------------------------------------+     |
|                                                                    |
+------------------------------------------------------------------+
```

## Method Selection Matrix

| Method | Use Case | Prerequisites | Automation Level |
|--------|----------|---------------|------------------|
| **Cloud ZTP** | Greenfield sites | Internet, DHCP | Fully automatic |
| **On-Prem ZTP** | Secure environments | Local DHCP/DNS | Fully automatic |
| **PnP via Catalyst Center** | SD-Access integrated sites | Catalyst Center | Semi-automatic |
| **Manual Bootstrap** | Air-gapped, troubleshooting | Console/SSH access | Manual |
| **USB Provisioning** | No network connectivity | USB drive | Semi-automatic |

## Pre-Onboarding Requirements

### Device Inventory Preparation

Before onboarding, devices must be added to SD-WAN Manager:

```
SD-WAN Manager → Configuration → Devices → WAN Edge List

Required Information per Device:
+------------------+-------------------------+--------------------------+
| Field            | Example                 | Source                   |
+------------------+-------------------------+--------------------------+
| Chassis Number   | C8300-2N2S-6T-MUM-01   | show sdwan system status |
| Serial Number    | FDO24311234            | Physical label / CLI     |
| Model            | C8300-2N2S-6T          | Part number              |
| Site ID          | 101                     | Site planning doc        |
| System IP        | 10.255.255.101         | IP allocation plan       |
| Hostname         | MUM-DC-WAN-01          | Naming standard          |
| Device Group     | MUM-DC-HUBS            | Template mapping         |
+------------------+-------------------------+--------------------------+
```

### Upload WAN Edge List via CSV

```csv
# wan-edge-inventory.csv
chassis-number,serial-number,model,site-id,system-ip,hostname,device-group
C8300-2N2S-6T-MUM-01,FDO24311234,C8300-2N2S-6T,101,10.255.255.101,MUM-DC-WAN-01,MUM-DC-HUBS
C8300-2N2S-6T-MUM-02,FDO24311235,C8300-2N2S-6T,101,10.255.255.102,MUM-DC-WAN-02,MUM-DC-HUBS
C8500-12X4QC-MUM-01,FDO24412345,C8500-12X4QC,101,10.255.255.103,MUM-DC-CORE-01,MUM-DC-HUBS
C8500-12X4QC-MUM-02,FDO24412346,C8500-12X4QC,101,10.255.255.104,MUM-DC-CORE-02,MUM-DC-HUBS
C8300-2N2S-6T-CHE-01,FDO24321234,C8300-2N2S-6T,102,10.255.255.111,CHE-DC-WAN-01,CHE-DC-HUBS
C8300-2N2S-6T-CHE-02,FDO24321235,C8300-2N2S-6T,102,10.255.255.112,CHE-DC-WAN-02,CHE-DC-HUBS
C8300-1N1S-6T-BLR-01,FDO24331234,C8300-1N1S-6T,201,10.255.255.121,BLR-BR-WAN-01,INDIA-BRANCHES
C8300-1N1S-6T-DEL-01,FDO24341234,C8300-1N1S-6T,202,10.255.255.131,DEL-BR-WAN-01,INDIA-BRANCHES
C8300-1N1S-6T-NOI-01,FDO24351234,C8300-1N1S-6T,203,10.255.255.141,NOI-BR-WAN-01,INDIA-BRANCHES
```

### API-Based Device Upload

```python
#!/usr/bin/env python3
"""
Upload WAN Edge devices to SD-WAN Manager
File: upload_wan_edge_inventory.py
"""

import requests
import json
import csv
import urllib3
urllib3.disable_warnings()

VMANAGE_HOST = "10.255.0.10"
VMANAGE_USER = "admin"
VMANAGE_PASS = "Admin123!"

class VManageSession:
    def __init__(self, host, user, password):
        self.host = host
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(user, password)
    
    def authenticate(self, user, password):
        """Authenticate and get session token"""
        url = f"https://{self.host}/j_security_check"
        data = {"j_username": user, "j_password": password}
        response = self.session.post(url, data=data)
        
        # Get XSRF token
        url = f"https://{self.host}/dataservice/client/token"
        response = self.session.get(url)
        if response.status_code == 200:
            self.session.headers["X-XSRF-TOKEN"] = response.text
    
    def upload_wan_edge_list(self, csv_file):
        """Upload WAN Edge devices from CSV"""
        devices = []
        
        with open(csv_file, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                device = {
                    "chpiAddress": row['chassis-number'],
                    "serialNumber": row['serial-number'],
                    "deviceModel": row['model'],
                    "siteId": row['site-id'],
                    "systemIp": row['system-ip'],
                    "hostName": row['hostname'],
                    "deviceGroups": [row['device-group']],
                    "validity": "valid",
                    "uploadSource": "CSV"
                }
                devices.append(device)
        
        url = f"https://{self.host}/dataservice/system/device"
        response = self.session.post(url, json=devices)
        
        if response.status_code == 200:
            print(f"Successfully uploaded {len(devices)} devices")
            return response.json()
        else:
            print(f"Upload failed: {response.text}")
            return None
    
    def generate_bootstrap_config(self, device_serial):
        """Generate bootstrap configuration for a device"""
        url = f"https://{self.host}/dataservice/system/device/bootstrap/device/{device_serial}?configtype=cloudinit"
        response = self.session.get(url)
        return response.text if response.status_code == 200 else None

if __name__ == "__main__":
    vm = VManageSession(VMANAGE_HOST, VMANAGE_USER, VMANAGE_PASS)
    vm.upload_wan_edge_list("wan-edge-inventory.csv")
```

## Zero Touch Provisioning (ZTP)

### ZTP Architecture

```
+------------------------------------------------------------------+
|                      ZTP Workflow Flow                            |
+------------------------------------------------------------------+
|                                                                    |
|  WAN Edge         DHCP/DNS         vBond           vManage        |
|  (Factory)        Server           Validator       Manager        |
|      |                |                |               |          |
|      |---DHCP Discover-->|            |               |          |
|      |<--DHCP Offer------|            |               |          |
|      |   (Option 43)     |            |               |          |
|      |                   |            |               |          |
|      |---DNS Query---------------------->|            |          |
|      |   (ztp.viptela.com)               |            |          |
|      |<--DNS Response--------------------|            |          |
|      |   (vBond IP)                      |            |          |
|      |                                   |            |          |
|      |---DTLS Connect------------------->|            |          |
|      |   (Port 12346)                    |            |          |
|      |<--Auth Challenge------------------|            |          |
|      |---Certificate/Serial------------->|            |          |
|      |<--vManage IP List-----------------|            |          |
|      |                                   |            |            |
|      |---DTLS Connect----------------------------------->|        |
|      |   (Port 12346)                                    |        |
|      |<--Template Config---------------------------------|        |
|      |---Config Applied--------------------------------->|        |
|      |<--Activation Complete-----------------------------|        |
|      |                                                    |        |
+------------------------------------------------------------------+
```

### Cloud-Based ZTP Configuration

#### Step 1: Configure vBond in vManage

```
SD-WAN Manager → Administration → Settings → Organization Settings

Organization Name: Abhavtech
vBond DNS/IP: sdwan-validator.abhavtech.com
vBond Port: 12346

SD-WAN Manager → Configuration → Devices → Controllers
- Add Controller: vBond
- IP Address: 13.234.xxx.xxx (AWS public IP)
- Generate CSR → Install signed certificate
```

#### Step 2: DHCP Server Configuration (Option 43)

```
! ISC DHCP Server Configuration
! /etc/dhcp/dhcpd.conf

subnet 10.10.100.0 netmask 255.255.255.0 {
    range 10.10.100.100 10.10.100.200;
    option routers 10.10.100.1;
    option domain-name-servers 10.10.100.10;
    option domain-name "abhavtech.com";
    
    # Option 43 for ZTP
    # Format: 5A 1A 02 <vBond-IP-hex> 3B 09 <org-name>
    # vBond IP: 13.234.56.78 = 0D EA 38 4E
    # Org Name: Abhavtech = 41 62 68 61 76 74 65 63 68
    option vendor-encapsulated-options 
        5A:1A:02:0D:EA:38:4E:3B:09:41:62:68:61:76:74:65:63:68;
}

# Alternative: DNS-based ZTP (preferred)
subnet 10.10.100.0 netmask 255.255.255.0 {
    range 10.10.100.100 10.10.100.200;
    option routers 10.10.100.1;
    option domain-name-servers 10.10.100.10;
    option domain-name "abhavtech.com";
}
```

#### Step 3: DNS Configuration for ZTP

```
; BIND DNS Zone File
; /var/named/abhavtech.com.zone

$TTL 86400
@   IN  SOA ns1.abhavtech.com. admin.abhavtech.com. (
            2025123001 ; Serial
            3600       ; Refresh
            1800       ; Retry
            604800     ; Expire
            86400      ; Minimum TTL
)

; Name Servers
    IN  NS  ns1.abhavtech.com.
    IN  NS  ns2.abhavtech.com.

; A Records for SD-WAN
ns1                 IN  A   10.10.100.10
ns2                 IN  A   10.10.100.11

; vBond DNS Records (GeoDNS recommended)
sdwan-validator     IN  A   13.234.56.78      ; Primary (Mumbai)
                    IN  A   13.250.78.90      ; Secondary (Singapore)
vbond-primary       IN  A   13.234.56.78
vbond-secondary     IN  A   13.250.78.90

; ZTP DNS Record (required for cloud ZTP)
; WAN Edge queries: ztp.viptela.com (redirected internally)
ztp.viptela.com.    IN  CNAME   sdwan-validator.abhavtech.com.

; vManage DNS
sdwan-manager       IN  A   10.255.0.10       ; Cluster VIP
vmanage-1           IN  A   10.255.0.11
vmanage-2           IN  A   10.255.0.12
vmanage-3           IN  A   10.255.0.13
```

#### Step 4: Firewall Rules for ZTP

```
! Internet Firewall (Palo Alto / Fortinet)
! Allow ZTP traffic from WAN Edge Management VLAN

! Outbound from WAN Edge to vBond (Internet)
rule ztp-vbond-dtls {
    source-zone: inside
    dest-zone: outside
    source: 10.10.100.0/24  # WAN Edge management subnet
    destination: 13.234.56.78/32, 13.250.78.90/32
    application: custom-dtls
    service: udp/12346
    action: allow
    log: yes
}

rule ztp-vbond-tls {
    source-zone: inside
    dest-zone: outside  
    source: 10.10.100.0/24
    destination: 13.234.56.78/32, 13.250.78.90/32
    application: custom-tls
    service: tcp/12346
    action: allow
    log: yes
}

! Outbound DNS
rule ztp-dns {
    source-zone: inside
    dest-zone: outside
    source: 10.10.100.0/24
    destination: any
    application: dns
    service: udp/53
    action: allow
    log: yes
}
```

### On-Premises ZTP Configuration

For secure environments that cannot use cloud ZTP:

#### Internal vBond Configuration

```
! vBond Configuration (On-Premises)
system
 host-name               vBond-OnPrem-1
 system-ip               10.255.2.10
 site-id                 1
 organization-name       Abhavtech
 vbond 10.255.2.10 local vbond-only
!
vpn 0
 interface ge0/0
  ip address 10.255.2.10/24
  tunnel-interface
   encapsulation ipsec
   color default
   allow-service all
   no allow-service netconf
  exit
  no shutdown
 exit
 ip route 0.0.0.0/0 10.255.2.1
!
vpn 512
 interface eth0
  ip address 10.255.0.100/24
  no shutdown
 exit
!
```

#### On-Prem DHCP Configuration

```
! Cisco IOS DHCP Server
ip dhcp pool WAN-EDGE-MGMT
 network 10.10.100.0 255.255.255.0
 default-router 10.10.100.1
 dns-server 10.10.100.10
 domain-name abhavtech.com
 option 43 hex 5A.1A.02.0A.FF.02.0A.3B.09.41.62.68.61.76.74.65.63.68
 ! Option 43 breakdown:
 ! 5A = ZTP option code
 ! 1A = Length
 ! 02 = IP type (IPv4)
 ! 0A.FF.02.0A = 10.255.2.10 (vBond IP)
 ! 3B = Org separator
 ! 09 = Org name length
 ! 41.62.68.61.76.74.65.63.68 = "Abhavtech"
!
```

## PnP Integration with Catalyst Center

### Catalyst Center PnP for SD-WAN

When WAN Edge devices are co-located with SD-Access fabric, Catalyst Center can assist with initial connectivity:

```
+------------------------------------------------------------------+
|                PnP-Assisted SD-WAN Onboarding                     |
+------------------------------------------------------------------+
|                                                                    |
|  WAN Edge         Catalyst         SD-WAN          SD-WAN        |
|  (Factory)        Center           Validator       Manager        |
|      |                |                |               |          |
|      |---PnP Discovery-->|            |               |          |
|      |<--Day-0 Config----|            |               |          |
|      |   (Bootstrap)     |            |               |          |
|      |                   |            |               |          |
|      |---Connect to vBond----------------->|          |          |
|      |   (Using PnP config)                |          |          |
|      |<--Authenticate---------------------|          |          |
|      |                                     |          |          |
|      |---SD-WAN Onboarding----------------------------->|        |
|      |<--Full Configuration-----------------------------|        |
|      |                                                   |        |
+------------------------------------------------------------------+
```

#### Catalyst Center Bootstrap Template

```
! Day-0 Bootstrap for SD-WAN Onboarding via PnP
! Applied by Catalyst Center PnP

hostname ${DEVICE_NAME}
!
username admin privilege 15 secret Admin123!
enable secret Enable123!
!
! Basic IP connectivity for ZTP
interface GigabitEthernet0/0/0
 ip address dhcp
 no shutdown
!
! Management VRF
vrf definition Mgmt-intf
 address-family ipv4
 exit-address-family
!
interface GigabitEthernet0
 vrf forwarding Mgmt-intf
 ip address dhcp
 no shutdown
!
! SD-WAN Mode Enable
sdwan
 interface GigabitEthernet0/0/0
  tunnel-interface
   encapsulation ipsec
   color biz-internet
  exit
 exit
!
! vBond Configuration
system
 organization-name Abhavtech
 vbond sdwan-validator.abhavtech.com
!
! AAA for vManage
aaa authentication login default local
aaa authorization exec default local
!
! Enable SSH
ip ssh version 2
line vty 0 4
 login local
 transport input ssh
!
```

## Manual Onboarding Procedures

### Console-Based Bootstrap

For devices without network connectivity or troubleshooting scenarios:

#### Step 1: Initial Console Access

```
! Connect via console (9600 8N1)
! Default credentials: admin / admin

Router> enable
Router# configure terminal

! Set hostname
Router(config)# hostname MUM-DC-WAN-01

! Configure management interface
Router(config)# interface GigabitEthernet0
Router(config-if)# ip address 10.10.100.50 255.255.255.0
Router(config-if)# no shutdown
Router(config-if)# exit

! Add default route
Router(config)# ip route 0.0.0.0 0.0.0.0 10.10.100.1
```

#### Step 2: SD-WAN Mode Configuration

```
! Enable SD-WAN (controller mode)
Router(config)# sdwan
Router(config-sdwan)# interface GigabitEthernet0/0/0
Router(config-interface)# tunnel-interface
Router(config-tunnel-interface)# encapsulation ipsec
Router(config-tunnel-interface)# color mpls
Router(config-tunnel-interface)# exit
Router(config-interface)# exit
Router(config-sdwan)# exit

! System configuration
Router(config)# system
Router(config-system)# system-ip 10.255.255.101
Router(config-system)# site-id 101
Router(config-system)# organization-name Abhavtech
Router(config-system)# vbond sdwan-validator.abhavtech.com
Router(config-system)# exit
```

#### Step 3: Certificate Installation

```
! Request root CA certificate chain
Router# request platform software sdwan root-cert-chain install bootflash:root-ca-chain.pem

! Generate CSR
Router# request platform software sdwan csr
! CSR output appears - copy this

! After CA signs the certificate, install it
Router# request platform software sdwan certificate install bootflash:wan-edge-signed.pem
```

#### Step 4: Verify Control Connections

```
Router# show sdwan control connections
                                                                                       PEER                                          PEER                                          CONTROLLER 
PEER    PEER PEER            SITE       DOMAIN PEER                                    PRIV  PEER                                    PUB                                           GROUP      
TYPE    PROT SYSTEM IP       ID         ID     PRIVATE IP                              PORT  PUBLIC IP                               PORT  LOCAL COLOR     PROXY STATE UPTIME      ID         
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
vsmart  dtls 10.255.1.11     1          1      10.255.1.11                             12346 10.255.1.11                             12346 mpls            No    up     0:02:15:30  0           
vsmart  dtls 10.255.1.12     1          1      10.255.1.12                             12346 10.255.1.12                             12346 mpls            No    up     0:02:15:28  0           
vbond   dtls 10.255.2.1      0          0      13.234.56.78                            12346 13.234.56.78                            12346 biz-internet    -     up     0:02:16:00  0           
vmanage dtls 10.255.0.11     1          0      10.255.0.11                             12346 10.255.0.11                             12346 mpls            No    up     0:02:15:45  0           
```

### USB Bootstrap Provisioning

For air-gapped environments or remote sites without initial connectivity:

#### Step 1: Generate Bootstrap File in vManage

```
SD-WAN Manager → Configuration → Devices → WAN Edge List
→ Select Device → More Actions → Generate Bootstrap Configuration

Options:
- Cloud-Init: Standard format (USB FAT32)
- Bootstrap: Legacy format
- Include Organization Name: Yes
- Include vBond IP/DNS: Yes
```

#### Step 2: Bootstrap File Content

```
! ciscosdwan.cfg (USB root directory)
! Generated by vManage for device FDO24311234

{
  "ca-chain-cert": "-----BEGIN CERTIFICATE-----\nMIID...ROOT_CA...==\n-----END CERTIFICATE-----\n-----BEGIN CERTIFICATE-----\nMIID...ISSUING_CA...==\n-----END CERTIFICATE-----",
  "otp": "abc123def456ghi789",
  "organization-name": "Abhavtech",
  "uuid": "C8300-2N2S-6T-MUM-01",
  "vbond": "sdwan-validator.abhavtech.com",
  "vbond-port": "12346"
}
```

#### Step 3: USB Installation Procedure

```
1. Format USB drive as FAT32
2. Copy ciscosdwan.cfg to USB root directory
3. Insert USB into WAN Edge USB port
4. Power on device (or reload if already on)
5. Device reads bootstrap file automatically
6. Verify with: show sdwan control local-properties
```

#### Automated USB Config Generator Script

```python
#!/usr/bin/env python3
"""
Generate USB bootstrap files for multiple WAN Edge devices
File: generate_usb_bootstrap.py
"""

import json
import os
from vmanage_session import VManageSession

VMANAGE_HOST = "10.255.0.10"
OUTPUT_DIR = "/tmp/usb_bootstrap"

def generate_bootstrap_files(device_list):
    """Generate bootstrap files for each device"""
    vm = VManageSession(VMANAGE_HOST, "admin", "Admin123!")
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    for device in device_list:
        serial = device['serial']
        hostname = device['hostname']
        
        # Get bootstrap from vManage
        bootstrap = vm.generate_bootstrap_config(serial)
        
        if bootstrap:
            # Create device-specific directory
            device_dir = os.path.join(OUTPUT_DIR, hostname)
            os.makedirs(device_dir, exist_ok=True)
            
            # Write bootstrap file
            config_path = os.path.join(device_dir, "ciscosdwan.cfg")
            with open(config_path, 'w') as f:
                f.write(bootstrap)
            
            print(f"Generated: {config_path}")
        else:
            print(f"Failed to generate bootstrap for {hostname}")

if __name__ == "__main__":
    devices = [
        {"serial": "FDO24311234", "hostname": "MUM-DC-WAN-01"},
        {"serial": "FDO24311235", "hostname": "MUM-DC-WAN-02"},
        {"serial": "FDO24331234", "hostname": "BLR-BR-WAN-01"},
        {"serial": "FDO24341234", "hostname": "DEL-BR-WAN-01"},
        {"serial": "FDO24351234", "hostname": "NOI-BR-WAN-01"},
    ]
    generate_bootstrap_files(devices)
```

## WAN Edge Authentication Process

### Device Authentication Flow

```
+------------------------------------------------------------------+
|                 WAN Edge Authentication Flow                      |
+------------------------------------------------------------------+
|                                                                    |
|  1. Serial Number Validation                                       |
|     +----------------------------------------------------------+  |
|     | vManage WAN Edge List contains serial: FDO24311234       |  |
|     | Device presents serial during authentication             |  |
|     | Match = Proceed, No Match = Reject                       |  |
|     +----------------------------------------------------------+  |
|                              |                                     |
|                              v                                     |
|  2. Certificate Validation                                         |
|     +----------------------------------------------------------+  |
|     | Device presents certificate signed by Enterprise CA      |  |
|     | vManage/vBond validates against installed root CA        |  |
|     | Certificate chain must be complete and valid             |  |
|     +----------------------------------------------------------+  |
|                              |                                     |
|                              v                                     |
|  3. Organization Name Validation                                   |
|     +----------------------------------------------------------+  |
|     | Certificate CN/SAN contains organization: Abhavtech      |  |
|     | Must match vManage configured organization               |  |
|     +----------------------------------------------------------+  |
|                              |                                     |
|                              v                                     |
|  4. Control Connection Establishment                               |
|     +----------------------------------------------------------+  |
|     | DTLS/TLS tunnel established                              |  |
|     | OMP session initiated                                    |  |
|     | Device moves to "In Sync" state                          |  |
|     +----------------------------------------------------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

### Authentication Methods

| Method | Description | Use Case |
|--------|-------------|----------|
| **Serial/Chassis** | Device serial number in WAN Edge list | Production (standard) |
| **Enterprise Certificate** | PKI-based with Enterprise CA | Secure environments |
| **Symantec/DigiCert** | Third-party CA (Cisco partnership) | Cloud ZTP |
| **OTP (One-Time Password)** | Temporary auth for initial connect | Lab/POC |

### Configuring Enterprise Certificate Authentication

```
! SD-WAN Manager Configuration
SD-WAN Manager → Administration → Settings → Enterprise Root Certificate

1. Upload Enterprise Root CA certificate (PEM format)
2. Enable "Enterprise Certificate Authentication"
3. Set certificate validation mode: "Strict"

! WAN Edge Certificate Requirements
- Subject CN: <chassis-number>
- SAN: DNS:<hostname>.abhavtech.com
- Key Usage: Digital Signature, Key Encipherment
- Extended Key Usage: Server Auth, Client Auth
- Validity: 2 years (730 days)
- Signature Algorithm: SHA-256 with RSA
```

## Template Assignment During Onboarding

### Pre-Staging Templates

Before device arrival, prepare templates in vManage:

```
SD-WAN Manager → Configuration → Templates

Template Hierarchy:
├── Device Templates
│   ├── DC-Hub-C8500-Template
│   │   └── Features: System, VPN0, VPN512, AAA, Logging, SNMP, Security
│   ├── Regional-Hub-C8300-Template
│   │   └── Features: System, VPN0, VPN512, AAA, Logging, SNMP, Security
│   └── Branch-C8300-Template
│       └── Features: System, VPN0, VPN512, AAA, Logging, SNMP
│
├── Feature Templates (Reusable)
│   ├── AAA-RADIUS-ISE
│   ├── Logging-Syslog-Splunk
│   ├── SNMP-v3-Monitoring
│   ├── Security-ZBFW-Basic
│   ├── VPN0-Transport-MPLS
│   ├── VPN0-Transport-Internet
│   └── VPN0-Transport-LTE
│
└── Configuration Groups (20.12+)
    ├── India-Hubs-Group
    ├── India-Branches-Group
    ├── EMEA-Hubs-Group
    └── Americas-Hubs-Group
```

### Automatic Template Attachment

Configure automatic template assignment based on device group:

```python
#!/usr/bin/env python3
"""
Auto-attach templates to devices after onboarding
File: auto_attach_templates.py
"""

import time
from vmanage_session import VManageSession

VMANAGE_HOST = "10.255.0.10"

TEMPLATE_MAPPING = {
    "MUM-DC-HUBS": {
        "template": "DC-Hub-C8500-Template",
        "variables": {
            "//system/host-name": "device_hostname",
            "//system/system-ip": "device_system_ip",
            "//system/site-id": "device_site_id",
            "vpn0_mpls_ip": "from_ipam",
            "vpn0_internet_ip": "from_ipam"
        }
    },
    "INDIA-BRANCHES": {
        "template": "Branch-C8300-Template",
        "variables": {
            "//system/host-name": "device_hostname",
            "//system/system-ip": "device_system_ip",
            "//system/site-id": "device_site_id",
            "vpn0_internet_ip": "from_ipam"
        }
    }
}

def attach_template_to_device(vm, device_id, template_name, variables):
    """Attach device template to a specific device"""
    
    # Get template ID
    templates = vm.get_device_templates()
    template_id = None
    for t in templates:
        if t['templateName'] == template_name:
            template_id = t['templateId']
            break
    
    if not template_id:
        print(f"Template {template_name} not found")
        return False
    
    # Get device input schema
    url = f"https://{vm.host}/dataservice/template/device/config/input"
    payload = {
        "templateId": template_id,
        "deviceIds": [device_id],
        "isEdited": False,
        "isMasterEdited": False
    }
    response = vm.session.post(url, json=payload)
    input_schema = response.json()
    
    # Fill in variables
    device_input = input_schema['data'][0]
    for key, value in variables.items():
        if key in device_input:
            device_input[key] = value
    
    # Attach template
    url = f"https://{vm.host}/dataservice/template/device/config/attachfeature"
    payload = {
        "deviceTemplateList": [{
            "templateId": template_id,
            "device": [device_input],
            "isEdited": False,
            "isMasterEdited": False
        }]
    }
    response = vm.session.post(url, json=payload)
    
    if response.status_code == 200:
        action_id = response.json()['id']
        print(f"Template attach initiated: {action_id}")
        return wait_for_action(vm, action_id)
    
    return False

def wait_for_action(vm, action_id, timeout=300):
    """Wait for action to complete"""
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        url = f"https://{vm.host}/dataservice/device/action/status/{action_id}"
        response = vm.session.get(url)
        status = response.json()
        
        if status['summary']['status'] == 'done':
            return True
        elif status['summary']['status'] == 'failed':
            print(f"Action failed: {status}")
            return False
        
        time.sleep(10)
    
    print("Action timed out")
    return False

def monitor_and_attach():
    """Monitor for new devices and auto-attach templates"""
    vm = VManageSession(VMANAGE_HOST, "admin", "Admin123!")
    
    while True:
        # Get devices pending template
        url = f"https://{vm.host}/dataservice/system/device/vedges"
        response = vm.session.get(url)
        devices = response.json()['data']
        
        for device in devices:
            if device.get('configStatusMessage') == 'No Template Attached':
                device_group = device.get('deviceGroups', [''])[0]
                
                if device_group in TEMPLATE_MAPPING:
                    mapping = TEMPLATE_MAPPING[device_group]
                    print(f"Attaching template to {device['host-name']}")
                    
                    # Prepare variables
                    variables = {
                        "//system/host-name": device['host-name'],
                        "//system/system-ip": device['system-ip'],
                        "//system/site-id": str(device['site-id'])
                    }
                    
                    attach_template_to_device(
                        vm, 
                        device['uuid'],
                        mapping['template'],
                        variables
                    )
        
        time.sleep(60)  # Check every minute

if __name__ == "__main__":
    monitor_and_attach()
```

## Onboarding Verification

### Post-Onboarding Checklist

```
+------------------------------------------------------------------+
|               WAN Edge Onboarding Verification                    |
+------------------------------------------------------------------+

1. Control Plane Connectivity
   [ ] vBond connection established
   [ ] vManage connection established  
   [ ] vSmart connection(s) established
   [ ] All connections show "up" state

2. Certificate Status
   [ ] Root CA installed and valid
   [ ] Device certificate installed
   [ ] Certificate not expired
   [ ] Certificate chain complete

3. Device Registration
   [ ] Device appears in vManage inventory
   [ ] Correct hostname assigned
   [ ] Correct system IP assigned
   [ ] Correct site ID assigned

4. Template Application
   [ ] Device template attached
   [ ] All feature templates applied
   [ ] No configuration drift
   [ ] Status shows "In Sync"

5. OMP Status
   [ ] OMP peers established
   [ ] Routes received from vSmart
   [ ] Routes advertised to vSmart
   [ ] No OMP errors in logs

6. BFD Sessions
   [ ] BFD sessions to other WAN Edges
   [ ] All colors showing "up"
   [ ] Latency/loss within expected range
+------------------------------------------------------------------+
```

### Verification Commands

```
! Verify control connections
show sdwan control connections

! Verify certificate status
show sdwan certificate installed
show sdwan certificate root-ca-cert
show sdwan certificate validity

! Verify system status
show sdwan system status

! Verify OMP peers
show sdwan omp peers

! Verify OMP routes received
show sdwan omp routes

! Verify BFD sessions
show sdwan bfd sessions

! Verify tunnel status
show sdwan tunnel statistics

! Verify software version
show version | include Software

! Verify running config vs template
show sdwan running-config | redirect bootflash:running.txt
! Compare with expected config from template
```

### Bulk Verification Script

```python
#!/usr/bin/env python3
"""
Bulk verify WAN Edge onboarding status
File: verify_wan_edge_onboarding.py
"""

from vmanage_session import VManageSession
import json

VMANAGE_HOST = "10.255.0.10"

def verify_all_devices():
    """Verify onboarding status of all WAN Edge devices"""
    vm = VManageSession(VMANAGE_HOST, "admin", "Admin123!")
    
    # Get all WAN Edge devices
    url = f"https://{vm.host}/dataservice/device"
    response = vm.session.get(url)
    devices = response.json()['data']
    
    wan_edges = [d for d in devices if d['device-type'] == 'vedge']
    
    report = {
        "total_devices": len(wan_edges),
        "online": 0,
        "offline": 0,
        "template_attached": 0,
        "no_template": 0,
        "in_sync": 0,
        "out_of_sync": 0,
        "devices": []
    }
    
    for device in wan_edges:
        device_status = {
            "hostname": device.get('host-name', 'Unknown'),
            "system_ip": device.get('system-ip', 'Unknown'),
            "site_id": device.get('site-id', 'Unknown'),
            "reachability": device.get('reachability', 'unknown'),
            "config_status": device.get('configStatusMessage', 'Unknown'),
            "certificate_status": "Unknown",
            "control_connections": {}
        }
        
        # Get control connections
        if device.get('reachability') == 'reachable':
            report["online"] += 1
            
            url = f"https://{vm.host}/dataservice/device/control/connections?deviceId={device['deviceId']}"
            conn_response = vm.session.get(url)
            if conn_response.status_code == 200:
                connections = conn_response.json().get('data', [])
                for conn in connections:
                    peer_type = conn.get('peer-type')
                    device_status["control_connections"][peer_type] = conn.get('state', 'unknown')
        else:
            report["offline"] += 1
        
        # Check template status
        if 'In Sync' in device.get('configStatusMessage', ''):
            report["template_attached"] += 1
            report["in_sync"] += 1
        elif 'No Template' in device.get('configStatusMessage', ''):
            report["no_template"] += 1
        else:
            report["out_of_sync"] += 1
        
        report["devices"].append(device_status)
    
    return report

def print_report(report):
    """Print formatted verification report"""
    print("\n" + "="*70)
    print("WAN Edge Onboarding Verification Report")
    print("="*70)
    print(f"\nTotal Devices: {report['total_devices']}")
    print(f"Online: {report['online']} | Offline: {report['offline']}")
    print(f"Template Attached: {report['template_attached']} | No Template: {report['no_template']}")
    print(f"In Sync: {report['in_sync']} | Out of Sync: {report['out_of_sync']}")
    
    print("\n" + "-"*70)
    print("Device Details:")
    print("-"*70)
    
    for device in report['devices']:
        status_icon = "✓" if device['reachability'] == 'reachable' else "✗"
        print(f"\n{status_icon} {device['hostname']} ({device['system_ip']})")
        print(f"  Site ID: {device['site_id']}")
        print(f"  Status: {device['reachability']}")
        print(f"  Config: {device['config_status']}")
        if device['control_connections']:
            print(f"  Control: vBond={device['control_connections'].get('vbond', 'N/A')}, "
                  f"vManage={device['control_connections'].get('vmanage', 'N/A')}, "
                  f"vSmart={device['control_connections'].get('vsmart', 'N/A')}")

if __name__ == "__main__":
    report = verify_all_devices()
    print_report(report)
    
    # Save detailed report
    with open('onboarding_report.json', 'w') as f:
        json.dump(report, f, indent=2)
    print("\nDetailed report saved to: onboarding_report.json")
```

## Troubleshooting Onboarding Issues

### Common Issues and Resolutions

| Issue | Symptoms | Resolution |
|-------|----------|------------|
| **vBond unreachable** | No control connections | Verify DNS, firewall rules, vBond public IP |
| **Certificate invalid** | Auth fails, connection rejected | Reinstall CA chain, regenerate device cert |
| **Serial not in list** | Device rejected by vManage | Add device to WAN Edge List |
| **Wrong org name** | Auth fails | Verify organization name matches exactly |
| **Time out of sync** | Certificate validation fails | Sync NTP (ntp server 10.10.100.10) |
| **DHCP not working** | No IP, no ZTP | Verify DHCP scope, Option 43 format |
| **Template attach fails** | Config not applied | Check template variables, device compatibility |

### Debug Commands

```
! Enable detailed debugging
debug sdwan control all
debug sdwan certificate all
debug sdwan dtls all

! Check vBond discovery
show sdwan control local-properties

! Verify DTLS status
show sdwan control connections-history

! Check certificate details
show crypto pki certificates verbose

! Verify NTP sync
show ntp associations
show clock

! Check routing to vBond
show ip route 13.234.56.78
traceroute 13.234.56.78

! Verify DNS resolution
ping sdwan-validator.abhavtech.com

! Check firewall/NAT traversal
show sdwan tunnel sla
```

### Onboarding Flowchart for Troubleshooting

```
+------------------------------------------------------------------+
|                 Onboarding Troubleshooting Flow                   |
+------------------------------------------------------------------+
|                                                                    |
|  Device Not Appearing in vManage?                                  |
|            |                                                       |
|            v                                                       |
|  +------------------+    No    +-------------------------+        |
|  | Serial in WAN    |--------->| Add device to WAN Edge  |        |
|  | Edge List?       |          | List in vManage         |        |
|  +------------------+          +-------------------------+        |
|            | Yes                                                   |
|            v                                                       |
|  +------------------+    No    +-------------------------+        |
|  | Device has IP?   |--------->| Check DHCP server       |        |
|  | (show ip int br) |          | Verify DHCP pool        |        |
|  +------------------+          +-------------------------+        |
|            | Yes                                                   |
|            v                                                       |
|  +------------------+    No    +-------------------------+        |
|  | DNS resolving    |--------->| Check DNS config        |        |
|  | vBond FQDN?      |          | Verify A records        |        |
|  +------------------+          +-------------------------+        |
|            | Yes                                                   |
|            v                                                       |
|  +------------------+    No    +-------------------------+        |
|  | Can ping vBond   |--------->| Check firewall rules    |        |
|  | public IP?       |          | Verify routing          |        |
|  +------------------+          +-------------------------+        |
|            | Yes                                                   |
|            v                                                       |
|  +------------------+    No    +-------------------------+        |
|  | DTLS connection  |--------->| Check UDP 12346 allowed |        |
|  | establishing?    |          | Try TCP 12346 fallback  |        |
|  +------------------+          +-------------------------+        |
|            | Yes                                                   |
|            v                                                       |
|  +------------------+    No    +-------------------------+        |
|  | Certificate      |--------->| Verify CA chain         |        |
|  | valid?           |          | Reinstall certificates  |        |
|  +------------------+          +-------------------------+        |
|            | Yes                                                   |
|            v                                                       |
|  +------------------+    No    +-------------------------+        |
|  | Org name match?  |--------->| Correct organization    |        |
|  |                  |          | name in certificate     |        |
|  +------------------+          +-------------------------+        |
|            | Yes                                                   |
|            v                                                       |
|  +--------------------------------------------------+             |
|  | Device should appear - check vManage logs        |             |
|  | show sdwan control connections-history           |             |
|  +--------------------------------------------------+             |
|                                                                    |
+------------------------------------------------------------------+
```

## Site-Specific Onboarding Procedures

### Hub Site Onboarding (Mumbai DC Example)

```
+------------------------------------------------------------------+
|              Mumbai DC Hub Site Onboarding                        |
+------------------------------------------------------------------+

Pre-Requisites:
- 2x C8500-12X4QC routers staged
- 2x C8300-2N2S-6T routers staged
- MPLS circuit active (100 Mbps)
- DIA circuit active (500 Mbps)
- SD-Access border nodes ready for handoff

Day 1: Infrastructure Preparation
1. Verify physical cabling and port assignments
2. Confirm IP addressing from IPAM
3. Test ISP circuits end-to-end
4. Validate firewall rules for SD-WAN

Day 2: WAN Edge Onboarding
1. Connect C8500-12X4QC-01 to management network
2. Verify ZTP bootstrap (or manual if needed)
3. Wait for control connections (vBond → vManage → vSmart)
4. Verify device appears in vManage "In Sync"

Day 3: Template Application
1. Attach DC-Hub-C8500-Template to device
2. Verify all interfaces configured
3. Test MPLS transport tunnel
4. Test Internet transport tunnel

Day 4: Second Router & HA
1. Onboard C8500-12X4QC-02 using same procedure
2. Verify BFD between hub routers
3. Test control plane redundancy
4. Validate data plane failover

Day 5: SD-Access Integration
1. Configure VRF-Lite subinterfaces
2. Establish eBGP with border nodes
3. Verify route exchange
4. Test end-to-end connectivity

Verification:
- [ ] All 4 WAN Edges online and in sync
- [ ] MPLS + Internet transports up
- [ ] BFD sessions established
- [ ] SD-Access handoff operational
- [ ] Traffic flowing correctly
```

### Branch Site Onboarding (Bangalore Example)

```
+------------------------------------------------------------------+
|             Bangalore Branch Site Onboarding                      |
+------------------------------------------------------------------+

Pre-Requisites:
- 1x C8300-1N1S-6T router shipped to site
- DIA circuit active (100 Mbps)
- LTE backup SIM installed
- Local IT contact available

Remote Onboarding Steps:

1. Pre-Stage in vManage
   - Add device serial to WAN Edge List
   - Assign to INDIA-BRANCHES device group
   - Pre-attach Branch-C8300-Template

2. Ship Router with USB Bootstrap
   - Generate bootstrap config in vManage
   - Copy to FAT32 USB drive
   - Ship with router

3. Local Installation (by local IT)
   - Connect WAN port to ISP handoff
   - Connect LAN port to SD-Access border (if present)
   - Insert USB drive
   - Power on router
   - Wait 15 minutes for onboarding

4. Remote Verification (by network team)
   - Verify device appears in vManage
   - Confirm control connections up
   - Test end-to-end connectivity to Mumbai DC
   - Validate application performance

5. Post-Onboarding
   - Remove USB drive (local IT)
   - Update inventory system
   - Close deployment ticket
```

## Summary

WAN Edge onboarding supports multiple methods to accommodate various deployment scenarios:

| Method | Best For | Automation |
|--------|----------|------------|
| Cloud ZTP | Greenfield, Internet access | Full |
| On-Prem ZTP | Secure/isolated environments | Full |
| PnP + Catalyst Center | SD-Access integrated sites | Semi |
| Manual Console | Troubleshooting, air-gapped | None |
| USB Bootstrap | Remote sites, no IT staff | Semi |

Key success factors for Abhavtech.com deployment:
- Pre-stage all device serials in vManage WAN Edge List
- Configure DNS with proper vBond records
- Prepare DHCP with Option 43 for non-DNS environments
- Pre-create and test templates before device arrival
- Use automation scripts for bulk operations
- Maintain verification checklists for each site type

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Network Architecture Team | Initial release |

**Next Section**: [5.8 Device Templates (CLI/Feature)](5-8-device-templates.md)
