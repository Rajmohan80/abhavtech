# 5.11 Branch Site Deployment

## Document Information
- **Version:** 2.1
- **Last Updated:** December 30, 2025
- **Author:** Abhavtech Network Architecture Team
- **Status:** Production Ready
- **Classification:** Internal Use Only

---

## 5.11.1 Branch Site Overview

Branch sites are remote locations with smaller footprint requiring streamlined deployment procedures. This section covers Abhavtech's branch site deployment strategy emphasizing zero-touch provisioning and remote management.

### Branch Site Topology

```
                    ┌─────────────────────────────────────────────────────────┐
                    │              BRANCH SITE TOPOLOGY                        │
                    │              Bangalore Office                            │
                    └─────────────────────────────────────────────────────────┘
                                              │
                   ┌──────────────────────────┼──────────────────────────┐
                   │                          │                          │
           ┌───────▼───────┐          ┌───────▼───────┐          ┌───────▼───────┐
           │   INTERNET    │          │   MPLS        │          │   LTE/5G      │
           │   (Primary)   │          │  (Optional)   │          │   (Backup)    │
           │   100 Mbps    │          │   50 Mbps     │          │   50 Mbps     │
           └───────┬───────┘          └───────┬───────┘          └───────┬───────┘
                   │                          │                          │
                   │ Gi0/0/0                  │ Gi0/0/1                  │ Cell0/1/0
                   │                          │                          │
           ┌───────┴──────────────────────────┴──────────────────────────┴───────┐
           │                                                                      │
           │                      C8300-1N1S-6T (WAN Edge)                        │
           │                      hostname: ABVT-BLR-WE01                         │
           │                      system-ip: 10.255.4.1                           │
           │                      site-id: 400                                    │
           │                                                                      │
           └───────┬──────────────────────────┬──────────────────────────────────┘
                   │ Gi0/0/2.10 (Corporate)   │ Gi0/0/2.20 (Guest)
                   │ Gi0/0/2.30 (Voice)       │
                   │                          │
           ┌───────┴──────────────────────────┴───────┐
           │                                          │
           │         SD-Access Extended Node          │
           │         or Standalone Switch             │
           │                                          │
           └──────────────────────────────────────────┘
```

### Abhavtech Branch Sites

| Site | Location | Role | WAN Edge Model | System-IP | Site-ID | Transport |
|------|----------|------|----------------|-----------|---------|-----------|
| Bangalore | India | Branch | C8300-1N1S-6T | 10.255.4.1 | 400 | Internet + LTE |
| Delhi | India | Branch | C8300-1N1S-6T | 10.255.4.2 | 401 | Internet + LTE |
| Noida | India | Branch | C8300-1N1S-6T | 10.255.4.3 | 402 | Internet + LTE |

---

## 5.11.2 Branch Deployment Strategy

### Deployment Methods

| Method | Use Case | Prerequisites | Timeline |
|--------|----------|---------------|----------|
| Cloud ZTP | Internet-first sites | DHCP/DNS, public vBond | Same day |
| USB Bootstrap | Air-gapped, no internet | Pre-generated config | Same day |
| PnP (Catalyst Center) | SD-Access integrated | PnP server configured | 1-2 days |
| Manual Console | Troubleshooting, special config | Console access | 2-4 hours |

### Recommended Branch Deployment Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    BRANCH SITE DEPLOYMENT WORKFLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

    PHASE 1: PRE-STAGING              PHASE 2: SHIPPING           PHASE 3: ONSITE
    (Network Team - Remote)           (Logistics)                 (Local IT/Vendor)
    
    ┌─────────────────────┐          ┌─────────────────────┐     ┌─────────────────────┐
    │ Add device to       │          │ Ship router to      │     │ Rack mount and      │
    │ vManage inventory   │───────▶  │ branch site         │────▶│ cable connections   │
    │ (serial number)     │          │                     │     │                     │
    └─────────────────────┘          └─────────────────────┘     └──────────┬──────────┘
                                                                            │
    ┌─────────────────────┐          ┌─────────────────────┐                ▼
    │ Configure device    │          │ Prepare USB with    │     ┌─────────────────────┐
    │ template and        │          │ bootstrap (if no    │     │ Power on device     │
    │ variables           │          │ DHCP/DNS)           │     │ Insert USB (if req) │
    └─────────────────────┘          └─────────────────────┘     └──────────┬──────────┘
                                                                            │
    ┌─────────────────────┐                                                 ▼
    │ Configure DHCP      │                                      ┌─────────────────────┐
    │ Option 43 and DNS   │◀─────────────────────────────────────│ Device boots and    │
    │ at branch           │          (Only if ZTP method)        │ discovers vBond     │
    └─────────────────────┘                                      └──────────┬──────────┘
                                                                            │
                                                                            ▼
    PHASE 4: VERIFICATION                                        ┌─────────────────────┐
    (Network Team - Remote)                                      │ Control connections │
                                                                 │ established         │
    ┌─────────────────────┐                                      │ Template applied    │
    │ Verify control      │◀─────────────────────────────────────└─────────────────────┘
    │ connections in      │
    │ vManage dashboard   │
    └──────────┬──────────┘
               │
               ▼
    ┌─────────────────────┐
    │ Run automated       │
    │ verification script │
    │ Confirm branch live │
    └─────────────────────┘
```

---

## 5.11.3 Pre-Staging Activities

### Device Inventory Registration

```python
#!/usr/bin/env python3
"""
Branch Device Pre-Staging Script
Add devices to vManage inventory before shipping
"""

import requests
import json
import urllib3
import csv

urllib3.disable_warnings()

class BranchPreStaging:
    def __init__(self, vmanage_host, username, password):
        self.vmanage_host = vmanage_host
        self.session = requests.Session()
        self.base_url = f"https://{vmanage_host}:443"
        self.login(username, password)
    
    def login(self, username, password):
        """Authenticate to vManage"""
        login_url = f"{self.base_url}/j_security_check"
        payload = {'j_username': username, 'j_password': password}
        
        response = self.session.post(login_url, data=payload, verify=False)
        
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url, verify=False)
        
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
    
    def add_wan_edge(self, device_info):
        """Add WAN Edge device to inventory"""
        url = f"{self.base_url}/dataservice/system/device"
        
        payload = {
            "deviceIP": device_info['system_ip'],
            "uuid": device_info['uuid'],
            "personality": "vedge",
            "serialNumber": device_info['serial_number'],
            "configOperationMode": "vmanage",
            "deviceModel": device_info['model'],
            "deviceState": "tokengenerated",
            "validity": "valid",
            "site-id": device_info['site_id'],
            "host-name": device_info['hostname']
        }
        
        response = self.session.post(url, json=payload, verify=False)
        return response.status_code == 200
    
    def upload_from_csv(self, csv_file):
        """Bulk upload devices from CSV"""
        devices_added = 0
        devices_failed = 0
        
        with open(csv_file, 'r') as f:
            reader = csv.DictReader(f)
            for row in reader:
                device_info = {
                    'hostname': row['hostname'],
                    'serial_number': row['serial_number'],
                    'uuid': row['uuid'],
                    'system_ip': row['system_ip'],
                    'site_id': row['site_id'],
                    'model': row['model']
                }
                
                if self.add_wan_edge(device_info):
                    print(f"✓ Added: {row['hostname']}")
                    devices_added += 1
                else:
                    print(f"✗ Failed: {row['hostname']}")
                    devices_failed += 1
        
        print(f"\nTotal: {devices_added} added, {devices_failed} failed")


# Branch device inventory CSV format
BRANCH_INVENTORY_CSV = """hostname,serial_number,uuid,system_ip,site_id,model
ABVT-BLR-WE01,FDO2345X1AB,C8300-1N1S-6T-UUID-001,10.255.4.1,400,C8300-1N1S-6T
ABVT-DEL-WE01,FDO2345X1AC,C8300-1N1S-6T-UUID-002,10.255.4.2,401,C8300-1N1S-6T
ABVT-NOI-WE01,FDO2345X1AD,C8300-1N1S-6T-UUID-003,10.255.4.3,402,C8300-1N1S-6T
"""

if __name__ == "__main__":
    prestager = BranchPreStaging(
        vmanage_host='sdwan-manager.abhavtech.com',
        username='admin',
        password='<password>'
    )
    
    # Save CSV and upload
    with open('/tmp/branch_inventory.csv', 'w') as f:
        f.write(BRANCH_INVENTORY_CSV)
    
    prestager.upload_from_csv('/tmp/branch_inventory.csv')
```

### Template Pre-Configuration

```
Branch Device Template Assignment
=================================

1. Create Branch Device Template in vManage:
   Configuration > Templates > Device Templates > Create Template

2. Template Name: Branch-C8300-Template

3. Feature Templates Included:
   - ABVT-System-Branch (System settings)
   - ABVT-VPN0-Transport-Internet (Internet transport)
   - ABVT-VPN0-Transport-LTE (LTE backup)
   - ABVT-VPN512-Management (OOB management)
   - ABVT-AAA-RADIUS-ISE (Authentication)
   - ABVT-Logging-Syslog (Logging)
   - ABVT-SNMP-v3 (Monitoring)
   - ABVT-NTP (Time sync)
   - ABVT-Banner (Login banner)
   - ABVT-VPN10-Corporate-Branch (Corporate VPN)
   - ABVT-VPN20-Guest-Branch (Guest VPN)
   - ABVT-VPN30-Voice-Branch (Voice VPN)
   - ABVT-Security-Branch (ZBFW policies)

4. Template Variables:
   {{device_hostname}} = Branch hostname
   {{device_system_ip}} = Branch system IP
   {{device_site_id}} = Branch site ID
   {{transport_internet_ip}} = ISP assigned IP (or DHCP)
   {{transport_internet_gateway}} = ISP gateway
   {{service_vpn10_ip}} = Corporate subnet gateway
   {{service_vpn20_ip}} = Guest subnet gateway
   {{service_vpn30_ip}} = Voice subnet gateway
```

### Variable CSV for Branch Sites

```csv
hostname,system_ip,site_id,internet_ip,internet_gw,corp_gw,guest_gw,voice_gw
ABVT-BLR-WE01,10.255.4.1,400,dhcp,dhcp,10.10.4.1,10.20.4.1,10.30.4.1
ABVT-DEL-WE01,10.255.4.2,401,dhcp,dhcp,10.10.5.1,10.20.5.1,10.30.5.1
ABVT-NOI-WE01,10.255.4.3,402,dhcp,dhcp,10.10.6.1,10.20.6.1,10.30.6.1
```

---

## 5.11.4 Cloud ZTP Deployment

### DHCP Configuration at Branch

```
! ISC DHCP Server Configuration for Branch ZTP
! File: /etc/dhcp/dhcpd.conf

subnet 192.168.1.0 netmask 255.255.255.0 {
  range 192.168.1.100 192.168.1.200;
  option routers 192.168.1.1;
  option domain-name-servers 10.10.100.10, 10.10.100.11;
  option domain-name "abhavtech.com";
  
  # SD-WAN ZTP Option 43
  # Format: 5A:1A:02:<vBond-IP-hex>:3B:09:<org-name-hex>
  # vBond: sdwan-validator.abhavtech.com (resolved to 13.234.56.78)
  # Org: Abhavtech
  option vendor-encapsulated-options 
    5A:1A:02:0D:EA:38:4E:3B:09:41:62:68:61:76:74:65:63:68;
}

# For Cisco WAN Edge devices
class "cisco-wan-edge" {
  match if option vendor-class-identifier = "ciscoSystems";
}
```

### DNS Configuration

```
; BIND Zone File for abhavtech.com
; Add ZTP discovery records

; vBond discovery - GeoDNS for regional vBonds
sdwan-validator    IN    A    13.234.56.78     ; Mumbai region
                   IN    A    13.250.78.90     ; Singapore region

; ZTP discovery CNAME
ztp.viptela.com.   IN    CNAME    sdwan-validator.abhavtech.com.
```

### ZTP Boot Sequence

```
Branch ZTP Boot Sequence
========================

1. Device powers on with factory default configuration

2. Device requests IP via DHCP
   - Receives IP address
   - Receives DHCP Option 43 with vBond address and org name

3. Device resolves vBond hostname
   - DNS query for sdwan-validator.abhavtech.com
   - Receives vBond IP (13.234.56.78)

4. Device initiates DTLS connection to vBond (UDP 12346)
   - Presents chassis serial number
   - vBond validates serial in authorized device list

5. vBond provides vManage and vSmart information
   - Device receives controller addresses
   - Device receives organization certificate

6. Device establishes control connections
   - DTLS to vManage
   - DTLS to vSmart(s)

7. vManage pushes device template
   - Template automatically attached based on device group
   - Configuration applied

8. Device operational
   - Data plane tunnels established
   - Traffic flows through SD-WAN fabric
```

---

## 5.11.5 USB Bootstrap Deployment

### Generate Bootstrap File

```python
#!/usr/bin/env python3
"""
USB Bootstrap File Generator for Branch Sites
"""

import json
import requests
import urllib3
import os

urllib3.disable_warnings()

class USBBootstrapGenerator:
    def __init__(self, vmanage_host, username, password):
        self.vmanage_host = vmanage_host
        self.session = requests.Session()
        self.base_url = f"https://{vmanage_host}:443"
        self.login(username, password)
    
    def login(self, username, password):
        """Authenticate to vManage"""
        login_url = f"{self.base_url}/j_security_check"
        payload = {'j_username': username, 'j_password': password}
        self.session.post(login_url, data=payload, verify=False)
        
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url, verify=False)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
    
    def get_root_cert(self):
        """Retrieve root CA certificate"""
        url = f"{self.base_url}/dataservice/certificate/rootca/cert"
        response = self.session.get(url, verify=False)
        return response.text
    
    def get_otp(self, device_uuid):
        """Generate OTP for device"""
        url = f"{self.base_url}/dataservice/system/device/bootstrap/device/{device_uuid}"
        params = {'configtype': 'cloudinit', 'inclDefRootCert': True}
        response = self.session.get(url, params=params, verify=False)
        data = response.json()
        return data.get('bootstrapConfig', '')
    
    def generate_bootstrap_file(self, device_info, output_dir):
        """Generate ciscosdwan.cfg for USB deployment"""
        
        # Get root CA and OTP
        root_cert = self.get_root_cert()
        otp_data = self.get_otp(device_info['uuid'])
        
        # Parse OTP data (base64 encoded JSON)
        import base64
        bootstrap_config = json.loads(base64.b64decode(otp_data))
        
        # Create ciscosdwan.cfg content
        config = {
            "ca-chain-cert": root_cert,
            "uuid": device_info['uuid'],
            "otp": bootstrap_config.get('otp', ''),
            "vbond": "sdwan-validator.abhavtech.com",
            "vbond-port": "12346",
            "organization-name": "Abhavtech"
        }
        
        # Write to file
        filename = f"ciscosdwan_{device_info['hostname']}.cfg"
        filepath = os.path.join(output_dir, filename)
        
        with open(filepath, 'w') as f:
            json.dump(config, f, indent=2)
        
        print(f"✓ Generated: {filepath}")
        return filepath
    
    def generate_all_branch_bootstraps(self, branch_devices, output_dir):
        """Generate bootstrap files for all branch devices"""
        
        os.makedirs(output_dir, exist_ok=True)
        
        for device in branch_devices:
            self.generate_bootstrap_file(device, output_dir)
        
        print(f"\nBootstrap files saved to: {output_dir}")
        print("Copy these files to FAT32 formatted USB drives")


if __name__ == "__main__":
    # Branch devices needing USB bootstrap
    branch_devices = [
        {'hostname': 'ABVT-BLR-WE01', 'uuid': 'C8300-1N1S-6T-UUID-001'},
        {'hostname': 'ABVT-DEL-WE01', 'uuid': 'C8300-1N1S-6T-UUID-002'},
        {'hostname': 'ABVT-NOI-WE01', 'uuid': 'C8300-1N1S-6T-UUID-003'},
    ]
    
    generator = USBBootstrapGenerator(
        vmanage_host='sdwan-manager.abhavtech.com',
        username='admin',
        password='<password>'
    )
    
    generator.generate_all_branch_bootstraps(
        branch_devices,
        output_dir='/tmp/branch_usb_bootstraps'
    )
```

### USB Preparation Procedure

```
USB Bootstrap Preparation
=========================

1. Format USB Drive
   - File system: FAT32
   - Volume label: SDWAN-BOOT
   - Minimum size: 1 GB

2. Copy Bootstrap File
   - Rename file to: ciscosdwan.cfg
   - Place in root directory of USB drive
   
   USB Drive Contents:
   /
   └── ciscosdwan.cfg

3. Verification
   - Verify file is readable
   - Check JSON syntax is valid
   - Confirm file size > 0 bytes

4. Labeling
   - Label USB with device hostname
   - Include site name and date
   - Example: "ABVT-BLR-WE01 | Bangalore | 2025-12-30"
```

### Onsite USB Deployment Procedure

```
Onsite USB Deployment Steps (For Local IT)
==========================================

PREREQUISITES:
- Router is rack mounted
- All cables connected (WAN, LAN, Power)
- USB drive with ciscosdwan.cfg ready

PROCEDURE:

Step 1: Insert USB Drive
   - Insert labeled USB into router's USB port
   - USB port typically on front panel

Step 2: Power On Router
   - Connect power cables
   - Toggle power switch ON
   - Observe boot sequence (LEDs)

Step 3: Wait for Bootstrap
   - Router boots to ROMMON
   - Detects USB drive
   - Reads ciscosdwan.cfg
   - Applies bootstrap configuration
   - Boot time: approximately 5-10 minutes

Step 4: Verify Boot Success
   - SYS LED should turn GREEN (solid)
   - WAN interface LEDs should show link
   - Do NOT remove USB during boot

Step 5: Remove USB (After 10 minutes)
   - Wait until boot is complete
   - Safely remove USB drive
   - Store USB securely

Step 6: Notify Network Team
   - Send confirmation email/message
   - Include: Site name, time completed
   - Network team will verify remotely

TROUBLESHOOTING:
- If SYS LED stays RED: Contact network team
- If no boot after 15 min: Check power, reseat USB
- If repeated failures: Schedule console session
```

---

## 5.11.6 Branch Configuration Details

### Day-0 Bootstrap Configuration (Applied via Template)

```
!============================================================
! Branch Site WAN Edge - Day-0 Configuration
! Site: Bangalore Branch
! Model: C8300-1N1S-6T
! Applied via vManage Device Template
!============================================================

! System Identity
hostname ABVT-BLR-WE01
!
sdwan
 system
  system-ip             10.255.4.1
  site-id               400
  organization-name     Abhavtech
  vbond sdwan-validator.abhavtech.com port 12346
  timezone Asia/Kolkata
 !
!

!------------------------------------------------------------
! VPN 0 - Transport (Internet Primary)
!------------------------------------------------------------
interface GigabitEthernet0/0/0
 description WAN-Internet-Primary-ISP
 ip dhcp client default-router distance 10
 ip mtu 1500
 mtu 1508
 !
 tunnel-interface
  encapsulation ipsec weight 1
  color biz-internet
  max-control-connections 2
  vbond sdwan-validator.abhavtech.com
  allow-service dhcp
  allow-service dns
  allow-service icmp
  allow-service https
  allow-service stun
  carrier carrier1
  nat-refresh-interval 5
 !
 no shutdown
!

!------------------------------------------------------------
! VPN 0 - Transport (LTE Backup)
!------------------------------------------------------------
interface Cellular0/1/0
 description WAN-LTE-Backup
 ip address negotiated
 !
 tunnel-interface
  encapsulation ipsec
  color lte
  max-control-connections 1
  vbond sdwan-validator.abhavtech.com
  last-resort-circuit
  low-bandwidth-link
  carrier carrier2
  nat-refresh-interval 5
 !
 no shutdown
!

!------------------------------------------------------------
! VPN 512 - Management
!------------------------------------------------------------
interface GigabitEthernet0
 description OOB-Management
 vrf forwarding Mgmt-intf
 ip address 10.10.254.41 255.255.255.0
 no shutdown
!

!------------------------------------------------------------
! VPN 10 - Corporate
!------------------------------------------------------------
interface GigabitEthernet0/0/2.10
 description LAN-Corporate
 encapsulation dot1Q 10
 vrf forwarding 10
 ip address 10.10.4.1 255.255.255.0
 no ip redirects
 no shutdown
!

!------------------------------------------------------------
! VPN 20 - Guest (with DIA)
!------------------------------------------------------------
interface GigabitEthernet0/0/2.20
 description LAN-Guest
 encapsulation dot1Q 20
 vrf forwarding 20
 ip address 10.20.4.1 255.255.255.0
 ip nat inside
 no shutdown
!
ip nat inside source list NAT-GUEST interface GigabitEthernet0/0/0 vrf 20 overload
ip access-list extended NAT-GUEST
 permit ip 10.20.0.0 0.0.255.255 any
!

!------------------------------------------------------------
! VPN 30 - Voice
!------------------------------------------------------------
interface GigabitEthernet0/0/2.30
 description LAN-Voice
 encapsulation dot1Q 30
 vrf forwarding 30
 ip address 10.30.4.1 255.255.255.0
 no shutdown
!

!------------------------------------------------------------
! Security - Zone-Based Firewall
!------------------------------------------------------------
zone security TRUST
zone security UNTRUST
zone security GUEST
!
zone-pair security TRUST-UNTRUST source TRUST destination UNTRUST
 service-policy type inspect BRANCH-TRUST-POLICY
!
zone-pair security GUEST-UNTRUST source GUEST destination UNTRUST
 service-policy type inspect BRANCH-GUEST-POLICY
!
interface GigabitEthernet0/0/2.10
 zone-member security TRUST
!
interface GigabitEthernet0/0/2.20
 zone-member security GUEST
!
interface GigabitEthernet0/0/2.30
 zone-member security TRUST
!
interface GigabitEthernet0/0/0
 zone-member security UNTRUST
!

!------------------------------------------------------------
! Services Configuration
!------------------------------------------------------------
! AAA
aaa authentication login default group ISE-SERVERS local
aaa authorization exec default group ISE-SERVERS local
!
! Logging
logging host 10.10.60.50 vrf Mgmt-intf
logging host 10.10.60.51 vrf Mgmt-intf
logging source-interface Loopback0
!
! SNMP
snmp-server community abhav-ro RO
snmp-server host 10.10.60.55 vrf Mgmt-intf version 3 sdwan-monitor
!
! NTP
ntp server 10.10.100.10 source GigabitEthernet0
ntp server 10.10.100.11 source GigabitEthernet0
!
! Banner
banner login ^
===============================================================
       ABHAVTECH.COM - BANGALORE BRANCH
       Authorized Access Only
       All activities are monitored and logged
===============================================================
^
```

---

## 5.11.7 SD-Access Extended Node Integration

### Branch with SD-Access Extended Node

```
                    ┌─────────────────────────────────────────────────────────┐
                    │     BRANCH WITH SD-ACCESS EXTENDED NODE                  │
                    └─────────────────────────────────────────────────────────┘

                    ┌─────────────────────────────────────────────────────────┐
                    │                        WAN                               │
                    │              Internet + LTE Backup                       │
                    └──────────────────────────┬──────────────────────────────┘
                                               │
                                               │
                              ┌────────────────▼────────────────┐
                              │                                  │
                              │   C8300-1N1S-6T (SD-WAN Edge)   │
                              │   hostname: ABVT-BLR-WE01       │
                              │                                  │
                              └────────────────┬────────────────┘
                                               │
                              Trunk: VLAN 10,20,30,40,50
                                               │
                              ┌────────────────▼────────────────┐
                              │                                  │
                              │   C9300-48P (Extended Node)     │
                              │   Managed by Catalyst Center    │
                              │                                  │
                              │   - Fabric edge functions       │
                              │   - SGT assignment              │
                              │   - Wireless controller         │
                              │                                  │
                              └────────────────┬────────────────┘
                                               │
                              ┌────────────────┼────────────────┐
                              │                │                │
                        ┌─────▼─────┐    ┌─────▼─────┐    ┌─────▼─────┐
                        │  Wired    │    │  Wireless │    │   IP      │
                        │  Clients  │    │  Clients  │    │  Phones   │
                        │  (VLAN10) │    │  (VLAN10) │    │  (VLAN30) │
                        └───────────┘    └───────────┘    └───────────┘
```

### Extended Node Handoff Configuration

```
! WAN Edge Configuration for Extended Node Handoff
! Trunk interface to Extended Node switch

interface GigabitEthernet0/0/2
 description Trunk-to-SD-Access-Extended-Node
 switchport trunk allowed vlan 10,20,30,40,50
 switchport mode trunk
 no shutdown
!

! Alternatively, use subinterfaces for routed handoff
interface GigabitEthernet0/0/2.10
 description Corporate-to-Extended-Node
 encapsulation dot1Q 10
 vrf forwarding 10
 ip address 10.100.4.1 255.255.255.252
 no shutdown
!
interface GigabitEthernet0/0/2.20
 description Guest-to-Extended-Node
 encapsulation dot1Q 20
 vrf forwarding 20
 ip address 10.100.4.5 255.255.255.252
 no shutdown
!
interface GigabitEthernet0/0/2.30
 description Voice-to-Extended-Node
 encapsulation dot1Q 30
 vrf forwarding 30
 ip address 10.100.4.9 255.255.255.252
 no shutdown
```

### Extended Node Switch Configuration

```
! Extended Node (C9300) Configuration
! Configured via Catalyst Center as Extended Node

! Uplink to WAN Edge
interface TenGigabitEthernet1/1/1
 description Uplink-to-SD-WAN-Edge
 switchport trunk allowed vlan 10,20,30,40,50
 switchport mode trunk
 cts role-based enforcement
 cts manual
  policy static sgt 0 trusted
 !
 spanning-tree portfast trunk
!

! Access ports (example)
interface GigabitEthernet1/0/1
 description Access-Port-Corporate
 switchport access vlan 10
 switchport mode access
 spanning-tree portfast
 device-tracking
 cts role-based enforcement
 !
 authentication port-control auto
 dot1x pae authenticator
!

! Wireless integration
wireless profile fabric-profile BRANCH-FABRIC
 vlan VLAN10
!
```

---

## 5.11.8 Branch Verification Procedures

### Remote Verification Checklist

```
Branch Site Remote Verification
===============================

CONTROL PLANE (from vManage Dashboard)
======================================
[ ] Device appears in vManage device list
[ ] Control status shows "Connected"
[ ] Certificate status shows "Valid"
[ ] Template attached and "In Sync"
[ ] Site-ID matches expected value
[ ] System-IP matches expected value

DATA PLANE (from vManage Dashboard)
===================================
[ ] All tunnels show "Up" status
[ ] BFD sessions established
[ ] Loss/latency within thresholds
[ ] At least 1 tunnel per transport

OMP STATUS (via vManage API or Device CLI)
==========================================
[ ] OMP peers show "up" state
[ ] Routes received from vSmart
[ ] Local routes advertised

SERVICE VPN STATUS
==================
[ ] VPN 10 (Corporate) routes present
[ ] VPN 20 (Guest) DIA functional
[ ] VPN 30 (Voice) QoS markings applied
```

### Automated Verification Script

```python
#!/usr/bin/env python3
"""
Branch Site Automated Verification Script
Run after each branch deployment
"""

import requests
import json
import urllib3
from datetime import datetime

urllib3.disable_warnings()

class BranchVerification:
    def __init__(self, vmanage_host, username, password):
        self.vmanage_host = vmanage_host
        self.session = requests.Session()
        self.base_url = f"https://{vmanage_host}:443"
        self.login(username, password)
    
    def login(self, username, password):
        login_url = f"{self.base_url}/j_security_check"
        payload = {'j_username': username, 'j_password': password}
        self.session.post(login_url, data=payload, verify=False)
        
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url, verify=False)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
    
    def check_device_status(self, system_ip):
        """Check overall device status"""
        url = f"{self.base_url}/dataservice/device"
        response = self.session.get(url, verify=False)
        devices = response.json().get('data', [])
        
        for device in devices:
            if device.get('system-ip') == system_ip:
                return {
                    'reachability': device.get('reachability', 'unknown'),
                    'status': device.get('status', 'unknown'),
                    'template_status': device.get('configStatusMessage', 'unknown')
                }
        return None
    
    def check_control_connections(self, system_ip):
        """Check control plane connections"""
        url = f"{self.base_url}/dataservice/device/control/connections"
        params = {'deviceId': system_ip}
        response = self.session.get(url, params=params, verify=False)
        connections = response.json().get('data', [])
        
        status = {
            'vbond': False,
            'vsmart': False,
            'vmanage': False
        }
        
        for conn in connections:
            if conn.get('state') == 'up':
                peer_type = conn.get('peer-type', '')
                if peer_type == 'vbond':
                    status['vbond'] = True
                elif peer_type == 'vsmart':
                    status['vsmart'] = True
                elif peer_type == 'vmanage':
                    status['vmanage'] = True
        
        return status
    
    def check_tunnels(self, system_ip):
        """Check data plane tunnels"""
        url = f"{self.base_url}/dataservice/device/tunnel/statistics"
        params = {'deviceId': system_ip}
        response = self.session.get(url, params=params, verify=False)
        tunnels = response.json().get('data', [])
        
        up_count = 0
        down_count = 0
        
        for tunnel in tunnels:
            if tunnel.get('tunnel-state') == 'up':
                up_count += 1
            else:
                down_count += 1
        
        return {'up': up_count, 'down': down_count}
    
    def check_omp_routes(self, system_ip, vpn):
        """Check OMP routes for a VPN"""
        url = f"{self.base_url}/dataservice/device/omp/routes"
        params = {'deviceId': system_ip, 'vpn': vpn}
        response = self.session.get(url, params=params, verify=False)
        routes = response.json().get('data', [])
        
        return len(routes)
    
    def verify_branch(self, branch_info):
        """Run full verification for a branch"""
        system_ip = branch_info['system_ip']
        hostname = branch_info['hostname']
        
        print(f"\n{'='*60}")
        print(f"BRANCH VERIFICATION: {hostname} ({system_ip})")
        print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*60}")
        
        results = {
            'hostname': hostname,
            'system_ip': system_ip,
            'passed': True,
            'checks': []
        }
        
        # Check 1: Device Status
        status = self.check_device_status(system_ip)
        if status:
            reachable = status['reachability'] == 'reachable'
            print(f"\n[Device Status]")
            print(f"  Reachability: {'✓ Reachable' if reachable else '✗ Unreachable'}")
            print(f"  Status: {status['status']}")
            print(f"  Template: {status['template_status']}")
            
            if not reachable:
                results['passed'] = False
            results['checks'].append({'device_status': reachable})
        else:
            print(f"\n[Device Status] ✗ Device not found in vManage")
            results['passed'] = False
        
        # Check 2: Control Connections
        ctrl = self.check_control_connections(system_ip)
        all_ctrl_up = all(ctrl.values())
        print(f"\n[Control Connections]")
        print(f"  vBond:   {'✓ UP' if ctrl['vbond'] else '✗ DOWN'}")
        print(f"  vSmart:  {'✓ UP' if ctrl['vsmart'] else '✗ DOWN'}")
        print(f"  vManage: {'✓ UP' if ctrl['vmanage'] else '✗ DOWN'}")
        
        if not all_ctrl_up:
            results['passed'] = False
        results['checks'].append({'control_connections': all_ctrl_up})
        
        # Check 3: Tunnels
        tunnels = self.check_tunnels(system_ip)
        all_tunnels_up = tunnels['down'] == 0 and tunnels['up'] > 0
        print(f"\n[Data Plane Tunnels]")
        print(f"  Tunnels Up:   {tunnels['up']}")
        print(f"  Tunnels Down: {tunnels['down']}")
        print(f"  Status: {'✓ ALL UP' if all_tunnels_up else '✗ ISSUES'}")
        
        if not all_tunnels_up:
            results['passed'] = False
        results['checks'].append({'tunnels': all_tunnels_up})
        
        # Check 4: OMP Routes
        print(f"\n[OMP Routes]")
        for vpn in [10, 20, 30]:
            route_count = self.check_omp_routes(system_ip, vpn)
            has_routes = route_count > 0
            print(f"  VPN {vpn}: {route_count} routes {'✓' if has_routes else '✗'}")
            if vpn == 10 and not has_routes:  # Corporate VPN must have routes
                results['passed'] = False
        
        # Summary
        print(f"\n{'='*60}")
        if results['passed']:
            print(f"RESULT: ✓ BRANCH VERIFICATION PASSED")
        else:
            print(f"RESULT: ✗ BRANCH VERIFICATION FAILED")
        print(f"{'='*60}")
        
        return results
    
    def verify_all_branches(self, branches):
        """Verify all branch sites"""
        all_results = []
        passed = 0
        failed = 0
        
        for branch in branches:
            result = self.verify_branch(branch)
            all_results.append(result)
            if result['passed']:
                passed += 1
            else:
                failed += 1
        
        print(f"\n{'='*60}")
        print(f"SUMMARY: {passed} passed, {failed} failed out of {len(branches)} branches")
        print(f"{'='*60}")
        
        return all_results


if __name__ == "__main__":
    branches = [
        {'hostname': 'ABVT-BLR-WE01', 'system_ip': '10.255.4.1'},
        {'hostname': 'ABVT-DEL-WE01', 'system_ip': '10.255.4.2'},
        {'hostname': 'ABVT-NOI-WE01', 'system_ip': '10.255.4.3'},
    ]
    
    verifier = BranchVerification(
        vmanage_host='sdwan-manager.abhavtech.com',
        username='admin',
        password='<password>'
    )
    
    verifier.verify_all_branches(branches)
```

---

## 5.11.9 Branch Deployment Runbook

### Single Branch Deployment Timeline

| Time | Activity | Responsible | Verification |
|------|----------|-------------|--------------|
| T-7 days | Add device to vManage inventory | Network Team | Device appears in list |
| T-5 days | Create/update device template | Network Team | Template validates |
| T-3 days | Generate USB bootstrap (if needed) | Network Team | File created |
| T-2 days | Ship router and USB to site | Logistics | Tracking confirmed |
| T+0 (Day 1) | Physical installation | Local IT | Photos submitted |
| T+0 (Day 1) | Cable connections | Local IT | Checklist signed |
| T+0 (Day 1) | Power on and boot | Local IT | LED status reported |
| T+0 + 15min | Remote verification | Network Team | Script passes |
| T+0 + 30min | End-to-end testing | Network Team | Traffic flows |
| T+1 day | 24-hour monitoring | NOC | No alerts |
| T+7 days | Closure and documentation | Network Team | Report filed |

### Go/No-Go Decision Points

| Checkpoint | Criteria | Action if Failed |
|------------|----------|------------------|
| Pre-ship | Device in vManage, template ready | Delay shipment |
| Pre-power | All cables connected correctly | Recheck cabling |
| Post-boot | Control connections up in 15 min | Troubleshoot or escalate |
| Post-config | Template applied successfully | Manual intervention |
| End-to-end | Traffic flows to hub sites | Rollback or escalate |

---

## 5.11.10 Troubleshooting Branch Deployments

### Common Issues and Solutions

| Issue | Symptoms | Root Cause | Solution |
|-------|----------|------------|----------|
| No DHCP | Device stuck at boot | DHCP server down | Check local DHCP, use USB |
| vBond unreachable | Control connection fails | Firewall blocking 12346 | Open UDP/TCP 12346 |
| Certificate error | Auth fails at vBond | Wrong org name | Regenerate bootstrap |
| Template fail | Device out of sync | Variable mismatch | Check template variables |
| No tunnels | BFD down | NAT/firewall issue | Check NAT traversal |
| Slow boot | Boot takes > 20 min | USB read errors | Replace USB, retry |

### Escalation Matrix

| Level | Timeframe | Action | Contact |
|-------|-----------|--------|---------|
| L1 | 0-15 min | Basic troubleshooting | NOC team |
| L2 | 15-60 min | Advanced CLI debug | Network engineers |
| L3 | 60+ min | Vendor engagement | Cisco TAC |

---

## References

- Cisco Catalyst SD-WAN Deployment Guide
- SD-WAN Zero Touch Provisioning Guide
- SD-Access Extended Node Design Guide
- Abhavtech Branch Deployment Standards

---

*Document Version: 2.1*
*Last Updated: December 30, 2025*
*Classification: Internal Use Only*
*Abhavtech.com - SD-WAN Documentation*
