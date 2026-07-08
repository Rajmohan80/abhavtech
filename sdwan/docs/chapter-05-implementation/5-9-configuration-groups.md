# 5.9 Configuration Groups & Profiles

## Document Information
- **Version**: 1.0
- **Last Updated**: December 2025
- **Author**: Network Architecture Team
- **Status**: Production Ready

## Overview

Configuration Groups and Feature Profiles represent the modern configuration management approach introduced in SD-WAN Manager 20.12+. This section covers the implementation of this hierarchical configuration model for Abhavtech.com's SD-WAN deployment, providing enhanced flexibility and operational efficiency compared to traditional device templates.

## Configuration Groups Architecture

### Hierarchical Structure

```
+------------------------------------------------------------------+
|              Configuration Groups Hierarchy                       |
+------------------------------------------------------------------+
|                                                                    |
|  +----------------------------------------------------------+     |
|  |                  Configuration Groups                     |     |
|  |        (Top-level container for device types)            |     |
|  +----------------------------------------------------------+     |
|            |              |              |                         |
|            v              v              v                         |
|  +----------------+ +----------------+ +----------------+          |
|  | DC-Hubs-Group  | | Branch-Group   | | Remote-Group  |          |
|  +----------------+ +----------------+ +----------------+          |
|            |              |              |                         |
|            v              v              v                         |
|  +----------------------------------------------------------+     |
|  |                   Feature Profiles                        |     |
|  |     (Reusable configuration building blocks)             |     |
|  +----------------------------------------------------------+     |
|  |                                                           |     |
|  | +-------------+ +-------------+ +-------------+          |     |
|  | |   System    | |  Transport  | |   Service   |          |     |
|  | |   Profile   | |   Profile   | |   Profile   |          |     |
|  | +-------------+ +-------------+ +-------------+          |     |
|  |                                                           |     |
|  | +-------------+ +-------------+ +-------------+          |     |
|  | |    Policy   | |  Security   | |    CLI      |          |     |
|  | |   Profile   | |   Profile   | |  Profile    |          |     |
|  | +-------------+ +-------------+ +-------------+          |     |
|  |                                                           |     |
|  +----------------------------------------------------------+     |
|                              |                                     |
|                              v                                     |
|  +----------------------------------------------------------+     |
|  |                     Parcels                               |     |
|  |      (Atomic configuration units within profiles)        |     |
|  +----------------------------------------------------------+     |
|                                                                    |
+------------------------------------------------------------------+
```

### Configuration Groups vs Device Templates

| Aspect | Device Templates | Configuration Groups |
|--------|------------------|---------------------|
| **Introduction** | Original (17.2+) | Modern (20.12+) |
| **Structure** | Flat, monolithic | Hierarchical, modular |
| **Flexibility** | Limited inheritance | Full profile sharing |
| **Variable Scope** | Per-device only | Group, profile, device levels |
| **Partial Updates** | Full push required | Incremental changes |
| **Multi-tenancy** | Complex | Native support |
| **Recommended For** | Legacy, simple deployments | New deployments, scale |

## Configuration Groups Design

### Abhavtech.com Configuration Groups

```
+------------------------------------------------------------------+
|              Abhavtech Configuration Groups Layout                |
+------------------------------------------------------------------+

ABVT-DC-Hubs-CG
├── Description: DC and Regional Hub Routers
├── Device Models: C8500-12X4QC, C8300-2N2S-6T
├── Sites: Mumbai DC, Chennai DC, London, Frankfurt, NJ, Dallas
├── Feature Profiles:
│   ├── System: ABVT-System-Hub-Profile
│   ├── Transport: ABVT-Transport-MultiWAN-Profile
│   ├── Service: ABVT-Service-Full-Profile
│   ├── Policy: ABVT-Policy-Hub-Profile
│   ├── Security: ABVT-Security-Hub-Profile
│   └── CLI: ABVT-CLI-Hub-Profile
└── Associated Devices: 12 (2 per hub site)

ABVT-India-Branches-CG
├── Description: India Branch Office Routers
├── Device Models: C8300-1N1S-6T
├── Sites: Bangalore, Delhi, Noida
├── Feature Profiles:
│   ├── System: ABVT-System-Branch-Profile
│   ├── Transport: ABVT-Transport-DIA-LTE-Profile
│   ├── Service: ABVT-Service-Branch-Profile
│   ├── Policy: ABVT-Policy-Branch-Profile
│   └── Security: ABVT-Security-Branch-Profile
└── Associated Devices: 3 (1 per branch)

ABVT-EMEA-Hubs-CG
├── Description: EMEA Regional Hub Routers
├── Device Models: C8300-2N2S-6T
├── Sites: London, Frankfurt
├── Feature Profiles:
│   ├── System: ABVT-System-Hub-Profile
│   ├── Transport: ABVT-Transport-MultiWAN-Profile
│   ├── Service: ABVT-Service-Full-Profile
│   └── Security: ABVT-Security-Hub-Profile
└── Associated Devices: 4 (2 per hub)

ABVT-Americas-Hubs-CG
├── Description: Americas Regional Hub Routers
├── Device Models: C8300-2N2S-6T
├── Sites: New Jersey, Dallas
├── Feature Profiles:
│   ├── System: ABVT-System-Hub-Profile
│   ├── Transport: ABVT-Transport-MultiWAN-Profile
│   ├── Service: ABVT-Service-Full-Profile
│   └── Security: ABVT-Security-Hub-Profile
└── Associated Devices: 4 (2 per hub)

+------------------------------------------------------------------+
```

### Creating Configuration Groups

#### Via SD-WAN Manager GUI

```
SD-WAN Manager → Configuration → Configuration Groups

Step 1: Create Configuration Group
- Name: ABVT-DC-Hubs-CG
- Description: DC and Regional Hub Routers for Abhavtech
- Solution Type: SD-WAN
- Device Models: 
  - C8500-12X4QC
  - C8300-2N2S-6T

Step 2: Associate Feature Profiles
- System Profile: ABVT-System-Hub-Profile
- Transport Profile: ABVT-Transport-MultiWAN-Profile
- Service Profile: ABVT-Service-Full-Profile
- Policy Profile: ABVT-Policy-Hub-Profile
- Security Profile: ABVT-Security-Hub-Profile
- CLI Profile: ABVT-CLI-Hub-Profile (optional)

Step 3: Define Group Variables
- Organization: Abhavtech
- vBond: sdwan-validator.abhavtech.com
- DNS Primary: 10.10.100.10
- NTP Server: 10.10.100.10
- Syslog Server: 10.10.60.50

Step 4: Associate Devices
- Add devices from inventory
- Map device-specific variables
```

#### Via API

```python
#!/usr/bin/env python3
"""
Create Configuration Groups via API
File: create_config_groups.py
"""

from vmanage_session import VManageSession
import json

VMANAGE_HOST = "10.255.0.10"

def create_configuration_group(vm, group_config):
    """Create a new configuration group"""
    url = f"https://{vm.host}/dataservice/v1/config-group"
    response = vm.session.post(url, json=group_config)
    
    if response.status_code in [200, 201]:
        result = response.json()
        print(f"Created config group: {group_config['name']} (ID: {result.get('id')})")
        return result
    else:
        print(f"Failed to create config group: {response.status_code} - {response.text}")
        return None

# DC Hubs Configuration Group
DC_HUBS_GROUP = {
    "name": "ABVT-DC-Hubs-CG",
    "description": "DC and Regional Hub Routers for Abhavtech",
    "solution": "sdwan",
    "profiles": [
        {
            "type": "system",
            "id": "{{system_profile_id}}"
        },
        {
            "type": "transport",
            "id": "{{transport_profile_id}}"
        },
        {
            "type": "service",
            "id": "{{service_profile_id}}"
        },
        {
            "type": "policy",
            "id": "{{policy_profile_id}}"
        },
        {
            "type": "security",
            "id": "{{security_profile_id}}"
        }
    ],
    "devices": [
        {
            "deviceId": "{{device_uuid_1}}",
            "variables": {
                "system_host_name": "MUM-DC-CORE-01",
                "system_system_ip": "10.255.255.103",
                "system_site_id": "101"
            }
        },
        {
            "deviceId": "{{device_uuid_2}}",
            "variables": {
                "system_host_name": "MUM-DC-CORE-02",
                "system_system_ip": "10.255.255.104",
                "system_site_id": "101"
            }
        }
    ]
}

# Branch Configuration Group
BRANCH_GROUP = {
    "name": "ABVT-India-Branches-CG",
    "description": "India Branch Office Routers",
    "solution": "sdwan",
    "profiles": [
        {
            "type": "system",
            "id": "{{system_branch_profile_id}}"
        },
        {
            "type": "transport",
            "id": "{{transport_branch_profile_id}}"
        },
        {
            "type": "service",
            "id": "{{service_branch_profile_id}}"
        },
        {
            "type": "security",
            "id": "{{security_branch_profile_id}}"
        }
    ]
}

if __name__ == "__main__":
    vm = VManageSession(VMANAGE_HOST, "admin", "Admin123!")
    
    # Create configuration groups
    create_configuration_group(vm, DC_HUBS_GROUP)
    create_configuration_group(vm, BRANCH_GROUP)
```

## Feature Profiles

### Profile Types

| Profile Type | Purpose | Contents |
|--------------|---------|----------|
| **System** | Device identity, management | Hostname, system IP, AAA, logging, SNMP |
| **Transport** | WAN connectivity | VPN 0 interfaces, tunnels, colors |
| **Service** | Business services | Service VPNs (1-65534), LAN interfaces |
| **Policy** | Traffic engineering | AAR, QoS, data/control policies |
| **Security** | Protection features | ZBFW, IPS, URL filtering |
| **CLI** | Custom configuration | Free-form CLI additions |

### System Profile

```
Profile Name: ABVT-System-Hub-Profile
Profile Type: System
Description: System configuration for hub routers

+------------------------------------------------------------------+
|                    System Profile Parcels                         |
+------------------------------------------------------------------+

Basic Parcel:
├── Organization Name: Abhavtech
├── vBond: sdwan-validator.abhavtech.com
├── Hostname: {{system_host_name}}
├── System IP: {{system_system_ip}}
├── Site ID: {{system_site_id}}
├── Timezone: Asia/Kolkata
├── Console Baud Rate: 115200
└── Idle Timeout: 30 minutes

AAA Parcel:
├── Authentication Order: RADIUS, Local
├── RADIUS Server Group: ISE-SERVERS
│   ├── Server 1: 10.10.50.21 (Priority 1)
│   └── Server 2: 10.10.50.22 (Priority 2)
├── Timeout: 5 seconds
├── Retransmit: 3
├── Source Interface: Loopback0
└── Local Users:
    ├── admin (privilege 15)
    └── readonly (privilege 1)

Logging Parcel:
├── Syslog Server 1: 10.10.60.50
├── Syslog Server 2: 10.10.60.51
├── VPN: 512
├── Source Interface: Loopback0
├── Priority: informational
└── Disk Enable: Yes (100MB, 10 rotations)

NTP Parcel:
├── Server 1: 10.10.100.10 (prefer)
├── Server 2: 10.10.100.11
├── VPN: 512
├── Source Interface: Loopback0
└── Authentication: MD5 (Key ID 1)

SNMP Parcel:
├── Contact: noc@abhavtech.com
├── Location: {{site_location}}
├── SNMP v3 User: sdwan-monitor
├── Auth: SHA / {{snmp_auth_pass}}
├── Priv: AES-256 / {{snmp_priv_pass}}
└── Trap Target: 10.10.60.55 (VPN 512)

Banner Parcel:
├── Login: [Authorized Access Warning]
└── MOTD: [Device Info Display]

+------------------------------------------------------------------+
```

### Transport Profile (Multi-WAN)

```
Profile Name: ABVT-Transport-MultiWAN-Profile
Profile Type: Transport
Description: Multi-WAN transport for hub routers (MPLS + Internet + LTE)

+------------------------------------------------------------------+
|                  Transport Profile Parcels                        |
+------------------------------------------------------------------+

VPN 0 Basic Parcel:
├── VPN ID: 0
├── VPN Name: Transport
├── DNS Primary: 10.10.100.10
├── DNS Secondary: 10.10.100.11
└── Enhanced App Routing: Enabled

MPLS Interface Parcel:
├── Interface: {{transport_mpls_interface}}
├── Description: MPLS-WAN-Transport
├── IP Address: {{transport_mpls_ip}}/{{transport_mpls_mask}}
├── Gateway: {{transport_mpls_gateway}}
├── Bandwidth: {{transport_mpls_bandwidth_kbps}}
├── MTU: 1500
├── Tunnel Interface:
│   ├── Color: mpls
│   ├── Restrict: No
│   ├── Encapsulation: IPsec (prefer), GRE
│   ├── Hello Interval: 1000ms
│   ├── Hello Tolerance: 12
│   ├── TLOC Preference: 200
│   └── Weight: 1
└── Allow Services: DHCP, DNS, ICMP, SSH, HTTPS, SNMP, BFD, NTP, STUN

Internet Interface Parcel:
├── Interface: {{transport_inet_interface}}
├── Description: Internet-DIA-Transport
├── IP Address: DHCP (or {{transport_inet_ip}})
├── NAT: Enabled
├── Bandwidth: {{transport_inet_bandwidth_kbps}}
├── Tunnel Interface:
│   ├── Color: biz-internet
│   ├── Encapsulation: IPsec
│   ├── TLOC Preference: 100
│   └── Weight: 1
└── Allow Services: DHCP, DNS, ICMP, BFD, STUN

LTE Interface Parcel:
├── Interface: Cellular0/1/0
├── Description: LTE-Backup-Transport
├── Profile ID: 1
├── APN: {{transport_lte_apn}}
├── IP Negotiated: Yes
├── Tunnel Interface:
│   ├── Color: lte
│   ├── Last Resort Circuit: Yes
│   ├── Low Bandwidth Link: Yes
│   ├── TLOC Preference: 50
│   ├── Max Control Connections: 2
│   └── Weight: 1
└── Allow Services: DHCP, DNS, ICMP, BFD, STUN

Static Route Parcel:
├── Default Route via MPLS: 0.0.0.0/0 → {{transport_mpls_gateway}}
├── Default Route via Internet: 0.0.0.0/0 → {{transport_inet_gateway}}
└── Management Routes: 10.255.0.0/24 → VPN 512

+------------------------------------------------------------------+
```

### Service Profile (Full Services)

```
Profile Name: ABVT-Service-Full-Profile
Profile Type: Service
Description: Full service VPN configuration for hub sites

+------------------------------------------------------------------+
|                   Service Profile Parcels                         |
+------------------------------------------------------------------+

VPN 10 - Corporate Data:
├── VPN ID: 10
├── VPN Name: Corporate-Data
├── OMP Admin Distance: 251
├── ECMP: Enabled
├── DNS: 10.10.100.10, 10.10.100.11
├── Interface Parcel:
│   ├── Subinterface: {{service_vpn10_interface}}.10
│   ├── VLAN: 10
│   ├── Description: SD-Access-Handoff-Corporate
│   ├── IP: {{service_vpn10_ip}}/30
│   └── CTS Role-Based Enforcement: Enabled
├── BGP Parcel:
│   ├── Local AS: 65100
│   ├── Router ID: {{system_system_ip}}
│   ├── Neighbor 1: {{service_vpn10_bgp_neighbor1}} (AS 65200)
│   └── Neighbor 2: {{service_vpn10_bgp_neighbor2}} (AS 65200)
└── Static Routes: 10.10.0.0/16 → Aggregate

VPN 20 - Guest Network:
├── VPN ID: 20
├── VPN Name: Guest-Network
├── OMP Admin Distance: 251
├── DIA: Enabled (NAT to VPN 0 Internet)
├── DNS: 8.8.8.8, 8.8.4.4 (Public)
├── Interface Parcel:
│   ├── Subinterface: {{service_vpn20_interface}}.20
│   ├── VLAN: 20
│   └── IP: {{service_vpn20_ip}}/24
└── Note: Isolated - No route leaking

VPN 30 - Voice/UC:
├── VPN ID: 30
├── VPN Name: Voice-UC
├── OMP Admin Distance: 251
├── ECMP: Enabled
├── Interface Parcel:
│   ├── Subinterface: {{service_vpn30_interface}}.30
│   ├── VLAN: 30
│   ├── IP: {{service_vpn30_ip}}/30
│   └── CTS Role-Based Enforcement: Enabled
├── BGP Parcel:
│   └── Neighbors: Same as VPN 10
└── QoS: Voice priority queue

VPN 40 - IoT/OT:
├── VPN ID: 40
├── VPN Name: IoT-OT
├── OMP Admin Distance: 251
├── Interface Parcel:
│   ├── Subinterface: {{service_vpn40_interface}}.40
│   ├── VLAN: 40
│   └── IP: {{service_vpn40_ip}}/24
├── Route Leaking: To VPN 50 only
└── Security: Enhanced ZBFW inspection

VPN 50 - Shared Services:
├── VPN ID: 50
├── VPN Name: Shared-Services
├── OMP Admin Distance: 251
├── Interface Parcel:
│   ├── Subinterface: {{service_vpn50_interface}}.50
│   ├── VLAN: 50
│   └── IP: {{service_vpn50_ip}}/24
├── Route Import: VPN 10, 30, 40
└── Route Export: To VPN 10, 30, 40

VPN 512 - Management:
├── VPN ID: 512
├── VPN Name: Management
├── Interface Parcel:
│   ├── Interface: GigabitEthernet0
│   ├── IP: {{mgmt_ip}}/24
│   └── Gateway: {{mgmt_gateway}}
└── DNS: 10.10.100.10, 10.10.100.11

+------------------------------------------------------------------+
```

### Security Profile

```
Profile Name: ABVT-Security-Hub-Profile
Profile Type: Security
Description: Security configuration for hub routers

+------------------------------------------------------------------+
|                   Security Profile Parcels                        |
+------------------------------------------------------------------+

Zone-Based Firewall Parcel:
├── Zones:
│   ├── TRUST (VPN 10, 30, 50)
│   ├── UNTRUST (VPN 0)
│   ├── GUEST (VPN 20)
│   ├── IOT (VPN 40)
│   └── SELF (Router)
├── Zone Pairs:
│   ├── TRUST → UNTRUST: Inspect
│   ├── TRUST → GUEST: Deny
│   ├── TRUST → IOT: Limited
│   ├── IOT → TRUST: Deny
│   ├── GUEST → UNTRUST: Allow (DIA)
│   └── * → SELF: Control Traffic Only
└── Default Action: Drop

Application Firewall Parcel:
├── Policy: Hub-AppFW-Policy
├── Rules:
│   ├── Allow: ms-office-365, webex, salesforce
│   ├── Block: bittorrent, tor, anonymous-proxy
│   └── Log: All blocked applications
└── Default: Allow (with logging)

IPS/IDS Parcel:
├── Mode: IPS (inline blocking)
├── Signature Set: Cisco Talos
├── Update Frequency: Daily
├── Actions:
│   ├── Critical: Block + Alert
│   ├── High: Block + Alert
│   ├── Medium: Alert Only
│   └── Low: Log Only
└── Exclusions: Known false positives

URL Filtering Parcel:
├── Mode: Block
├── Categories Blocked:
│   ├── Malware
│   ├── Phishing
│   ├── Gambling
│   ├── Adult Content
│   └── Cryptomining
├── Allow Override: No
└── Logging: All blocked URLs

Umbrella Integration Parcel:
├── DNS Security: Enabled
├── Umbrella Token: {{umbrella_token}}
├── Registration: Automatic
├── VPNs: 10, 20, 30, 40, 50
└── Block Page: Redirect to Umbrella

TLS Decryption Parcel (Optional):
├── Mode: Enabled for inspection
├── CA Certificate: Internal CA
├── Bypass Categories:
│   ├── Banking/Financial
│   └── Healthcare
└── Log Decrypted Sessions: Yes

+------------------------------------------------------------------+
```

### CLI Profile

```
Profile Name: ABVT-CLI-Hub-Profile
Profile Type: CLI
Description: Additional CLI configuration for hub routers

+------------------------------------------------------------------+
|                      CLI Profile Parcels                          |
+------------------------------------------------------------------+

BGP Advanced Parcel:
```
! Advanced BGP Configuration
router bgp 65100
 bgp bestpath as-path multipath-relax
 bgp additional-paths install
 bgp additional-paths select all
 bgp additional-paths send receive
 !
 address-family ipv4 vrf Corporate-Data
  bgp dampening
  neighbor {{bgp_neighbor_1}} route-map SDACCESS-IN in
  neighbor {{bgp_neighbor_1}} route-map SDACCESS-OUT out
  neighbor {{bgp_neighbor_2}} route-map SDACCESS-IN in
  neighbor {{bgp_neighbor_2}} route-map SDACCESS-OUT out
 exit-address-family
!
route-map SDACCESS-IN permit 10
 set local-preference 200
!
route-map SDACCESS-OUT permit 10
 set community 65100:100
!
```

CTS/TrustSec Parcel:
```
! TrustSec Configuration for SGT Propagation
cts authorization list ISE-CTS-LIST
cts role-based enforcement
cts role-based enforcement vlan-list all
!
interface {{service_vpn10_interface}}.10
 cts role-based enforcement
 cts manual
  policy static sgt 100 trusted
!
interface {{service_vpn30_interface}}.30
 cts role-based enforcement
 cts manual
  policy static sgt 300 trusted
!
cts logging verbose
!
```

QoS Advanced Parcel:
```
! Advanced QoS Policies
class-map match-any INTERACTIVE-VIDEO
 match protocol webex-meeting
 match protocol ms-teams-media
 match protocol zoom-media
 match dscp af41 af42
!
class-map match-any BULK-DATA
 match protocol ftp
 match protocol sftp
 match dscp af11 af12 af13
!
policy-map SDWAN-WAN-OUT
 class INTERACTIVE-VIDEO
  priority level 1 percent 20
  queue-limit 64 packets
 class BULK-DATA
  bandwidth remaining percent 20
  queue-limit 128 packets
  random-detect dscp-based
!
```

+------------------------------------------------------------------+
```

## Parcels

### Parcel Concepts

Parcels are the atomic configuration units within feature profiles:

```
+------------------------------------------------------------------+
|                      Parcel Architecture                          |
+------------------------------------------------------------------+

Feature Profile (e.g., Transport)
│
├── Parcel 1: VPN 0 Basic
│   ├── VPN ID
│   ├── VPN Name
│   └── DNS Settings
│
├── Parcel 2: MPLS Interface
│   ├── Interface Name
│   ├── IP Configuration
│   ├── Tunnel Settings
│   └── Allow Services
│
├── Parcel 3: Internet Interface
│   ├── Interface Name
│   ├── IP Configuration
│   ├── NAT Settings
│   └── Tunnel Settings
│
├── Parcel 4: LTE Interface
│   ├── Cellular Profile
│   ├── APN Settings
│   └── Tunnel Settings
│
└── Parcel 5: Static Routes
    ├── Default Routes
    └── Management Routes

+------------------------------------------------------------------+
```

### Creating Parcels via API

```python
#!/usr/bin/env python3
"""
Create Feature Profile Parcels via API
File: create_parcels.py
"""

from vmanage_session import VManageSession
import json

VMANAGE_HOST = "10.255.0.10"

# System Basic Parcel
SYSTEM_BASIC_PARCEL = {
    "name": "ABVT-System-Basic",
    "description": "Basic system settings for Abhavtech",
    "data": {
        "timezone": {
            "optionType": "global",
            "value": "Asia/Kolkata"
        },
        "hostname": {
            "optionType": "variable",
            "value": "{{system_host_name}}"
        },
        "systemIp": {
            "optionType": "variable",
            "value": "{{system_system_ip}}"
        },
        "siteId": {
            "optionType": "variable",
            "value": "{{system_site_id}}"
        },
        "organizationName": {
            "optionType": "global",
            "value": "Abhavtech"
        },
        "vBond": {
            "optionType": "global",
            "value": "sdwan-validator.abhavtech.com"
        },
        "idleTimeout": {
            "optionType": "global",
            "value": 30
        },
        "consoleBaudRate": {
            "optionType": "global",
            "value": "115200"
        }
    }
}

# AAA Parcel
AAA_PARCEL = {
    "name": "ABVT-AAA-ISE",
    "description": "AAA configuration with ISE RADIUS",
    "data": {
        "authenticationOrder": {
            "optionType": "global",
            "value": ["server", "local"]
        },
        "radiusServers": [
            {
                "address": {
                    "optionType": "global",
                    "value": "10.10.50.21"
                },
                "key": {
                    "optionType": "variable",
                    "value": "{{radius_secret}}"
                },
                "priority": {
                    "optionType": "global",
                    "value": 1
                }
            },
            {
                "address": {
                    "optionType": "global",
                    "value": "10.10.50.22"
                },
                "key": {
                    "optionType": "variable",
                    "value": "{{radius_secret}}"
                },
                "priority": {
                    "optionType": "global",
                    "value": 2
                }
            }
        ],
        "timeout": {
            "optionType": "global",
            "value": 5
        },
        "retransmit": {
            "optionType": "global",
            "value": 3
        }
    }
}

# Transport MPLS Interface Parcel
TRANSPORT_MPLS_PARCEL = {
    "name": "ABVT-Transport-MPLS",
    "description": "MPLS WAN transport interface",
    "data": {
        "interfaceName": {
            "optionType": "variable",
            "value": "{{transport_mpls_interface}}"
        },
        "description": {
            "optionType": "global",
            "value": "MPLS-WAN-Transport"
        },
        "ipAddress": {
            "optionType": "variable",
            "value": "{{transport_mpls_ip}}"
        },
        "subnetMask": {
            "optionType": "variable",
            "value": "{{transport_mpls_mask}}"
        },
        "tunnelInterface": {
            "color": {
                "optionType": "global",
                "value": "mpls"
            },
            "encapsulation": [
                {
                    "type": "ipsec",
                    "preference": 100
                },
                {
                    "type": "gre",
                    "preference": 50
                }
            ],
            "helloInterval": {
                "optionType": "global",
                "value": 1000
            },
            "helloTolerance": {
                "optionType": "global",
                "value": 12
            },
            "tlocPreference": {
                "optionType": "global",
                "value": 200
            }
        },
        "allowService": {
            "dhcp": True,
            "dns": True,
            "icmp": True,
            "ssh": True,
            "https": True,
            "snmp": True,
            "bfd": True,
            "ntp": True,
            "stun": True
        }
    }
}

def create_parcel(vm, profile_id, parcel_type, parcel_def):
    """Create a parcel within a feature profile"""
    url = f"https://{vm.host}/dataservice/v1/feature-profile/{profile_id}/parcel/{parcel_type}"
    response = vm.session.post(url, json=parcel_def)
    
    if response.status_code in [200, 201]:
        result = response.json()
        print(f"Created parcel: {parcel_def['name']} (ID: {result.get('parcelId')})")
        return result
    else:
        print(f"Failed to create parcel: {response.status_code} - {response.text}")
        return None

if __name__ == "__main__":
    vm = VManageSession(VMANAGE_HOST, "admin", "Admin123!")
    
    # Assume system profile ID is known
    system_profile_id = "profile-id-here"
    
    # Create parcels
    create_parcel(vm, system_profile_id, "system/basic", SYSTEM_BASIC_PARCEL)
    create_parcel(vm, system_profile_id, "system/aaa", AAA_PARCEL)
```

## Variables Management

### Variable Hierarchy

```
+------------------------------------------------------------------+
|                    Variable Hierarchy Levels                      |
+------------------------------------------------------------------+

Level 1: Global Variables (Organization-wide)
├── organization_name: Abhavtech
├── vbond_address: sdwan-validator.abhavtech.com
├── dns_primary: 10.10.100.10
├── ntp_server: 10.10.100.10
└── syslog_server: 10.10.60.50

Level 2: Configuration Group Variables (Device Type)
├── DC-Hubs-CG:
│   ├── role: hub
│   ├── omp_advertise: aggregate
│   └── security_level: high
├── Branch-CG:
│   ├── role: spoke
│   ├── omp_advertise: connected
│   └── security_level: standard
└── EMEA-Hubs-CG:
    ├── role: regional_hub
    └── timezone: Europe/London

Level 3: Profile Variables (Feature-specific)
├── Transport Profile:
│   ├── mpls_color: mpls
│   ├── inet_color: biz-internet
│   └── lte_color: lte
├── Service Profile:
│   ├── vpn10_name: Corporate-Data
│   ├── vpn20_name: Guest-Network
│   └── vpn30_name: Voice-UC
└── Security Profile:
    ├── zbfw_default_action: drop
    └── ips_mode: inline

Level 4: Device Variables (Device-specific)
├── MUM-DC-CORE-01:
│   ├── system_host_name: MUM-DC-CORE-01
│   ├── system_system_ip: 10.255.255.103
│   ├── system_site_id: 101
│   ├── transport_mpls_ip: 172.16.101.2
│   └── service_vpn10_ip: 10.101.10.1
└── BLR-BR-WAN-01:
    ├── system_host_name: BLR-BR-WAN-01
    ├── system_system_ip: 10.255.255.121
    ├── system_site_id: 201
    └── service_vpn10_ip: 10.201.10.1

+------------------------------------------------------------------+
```

### Variable Definitions Export/Import

```python
#!/usr/bin/env python3
"""
Export/Import variable definitions for Configuration Groups
File: manage_variables.py
"""

from vmanage_session import VManageSession
import json
import csv

VMANAGE_HOST = "10.255.0.10"

def export_variables(vm, config_group_id, output_file):
    """Export variables from configuration group to CSV"""
    url = f"https://{vm.host}/dataservice/v1/config-group/{config_group_id}/device/variables"
    response = vm.session.get(url)
    
    if response.status_code == 200:
        variables = response.json()
        
        # Get all variable names
        all_vars = set()
        for device in variables.get('data', []):
            all_vars.update(device.get('variables', {}).keys())
        
        # Write to CSV
        with open(output_file, 'w', newline='') as f:
            writer = csv.writer(f)
            header = ['device_id', 'hostname'] + sorted(list(all_vars))
            writer.writerow(header)
            
            for device in variables.get('data', []):
                row = [device['deviceId'], device.get('hostname', 'Unknown')]
                for var in sorted(list(all_vars)):
                    row.append(device.get('variables', {}).get(var, ''))
                writer.writerow(row)
        
        print(f"Exported {len(variables.get('data', []))} devices to {output_file}")
        return True
    return False

def import_variables(vm, config_group_id, input_file):
    """Import variables from CSV to configuration group"""
    devices = []
    
    with open(input_file, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            device_id = row.pop('device_id')
            row.pop('hostname', None)
            
            devices.append({
                "deviceId": device_id,
                "variables": {k: v for k, v in row.items() if v}
            })
    
    url = f"https://{vm.host}/dataservice/v1/config-group/{config_group_id}/device/variables"
    response = vm.session.put(url, json={"devices": devices})
    
    if response.status_code == 200:
        print(f"Imported variables for {len(devices)} devices")
        return True
    else:
        print(f"Import failed: {response.text}")
        return False

if __name__ == "__main__":
    vm = VManageSession(VMANAGE_HOST, "admin", "Admin123!")
    
    config_group_id = "config-group-id-here"
    
    # Export current variables
    export_variables(vm, config_group_id, "dc_hubs_variables.csv")
    
    # Import updated variables
    # import_variables(vm, config_group_id, "dc_hubs_variables_updated.csv")
```

## Deployment Operations

### Deploy Configuration Group

```python
#!/usr/bin/env python3
"""
Deploy Configuration Group to devices
File: deploy_config_group.py
"""

from vmanage_session import VManageSession
import time

VMANAGE_HOST = "10.255.0.10"

def deploy_config_group(vm, config_group_id, device_ids=None):
    """Deploy configuration group to devices"""
    url = f"https://{vm.host}/dataservice/v1/config-group/{config_group_id}/device/deploy"
    
    payload = {}
    if device_ids:
        payload["devices"] = device_ids
    
    response = vm.session.post(url, json=payload)
    
    if response.status_code == 200:
        result = response.json()
        action_id = result.get('id')
        print(f"Deployment initiated: {action_id}")
        return wait_for_deployment(vm, action_id)
    else:
        print(f"Deployment failed: {response.text}")
        return False

def wait_for_deployment(vm, action_id, timeout=600):
    """Wait for deployment to complete"""
    start = time.time()
    
    while time.time() - start < timeout:
        url = f"https://{vm.host}/dataservice/device/action/status/{action_id}"
        response = vm.session.get(url)
        
        if response.status_code == 200:
            status = response.json()
            summary = status.get('summary', {})
            
            print(f"Status: {summary.get('status')} - "
                  f"Success: {summary.get('count', {}).get('success', 0)} - "
                  f"Failed: {summary.get('count', {}).get('failure', 0)}")
            
            if summary.get('status') == 'done':
                return True
            elif summary.get('status') == 'failed':
                print("Deployment failed - check device logs")
                return False
        
        time.sleep(15)
    
    print("Deployment timed out")
    return False

def preview_deployment(vm, config_group_id, device_id):
    """Preview configuration changes before deployment"""
    url = f"https://{vm.host}/dataservice/v1/config-group/{config_group_id}/device/{device_id}/config/preview"
    response = vm.session.get(url)
    
    if response.status_code == 200:
        preview = response.json()
        print("Configuration Preview:")
        print(preview.get('config', 'No config available'))
        return preview
    return None

if __name__ == "__main__":
    vm = VManageSession(VMANAGE_HOST, "admin", "Admin123!")
    
    config_group_id = "config-group-id-here"
    
    # Preview first
    preview_deployment(vm, config_group_id, "device-uuid-here")
    
    # Deploy to all devices in group
    deploy_config_group(vm, config_group_id)
    
    # Or deploy to specific devices
    # deploy_config_group(vm, config_group_id, ["device-uuid-1", "device-uuid-2"])
```

### Configuration Group Status Monitoring

```python
#!/usr/bin/env python3
"""
Monitor Configuration Group deployment status
File: monitor_config_groups.py
"""

from vmanage_session import VManageSession
from datetime import datetime

VMANAGE_HOST = "10.255.0.10"

def get_config_group_status(vm):
    """Get status of all configuration groups"""
    url = f"https://{vm.host}/dataservice/v1/config-group"
    response = vm.session.get(url)
    
    if response.status_code != 200:
        return None
    
    groups = response.json().get('data', [])
    
    report = {
        "timestamp": datetime.now().isoformat(),
        "groups": []
    }
    
    for group in groups:
        group_info = {
            "name": group.get('name'),
            "id": group.get('id'),
            "device_count": group.get('deviceCount', 0),
            "profiles": [p.get('type') for p in group.get('profiles', [])]
        }
        
        # Get device status for this group
        devices_url = f"https://{vm.host}/dataservice/v1/config-group/{group['id']}/device"
        devices_response = vm.session.get(devices_url)
        
        if devices_response.status_code == 200:
            devices = devices_response.json().get('data', [])
            group_info['devices'] = []
            
            in_sync = 0
            out_of_sync = 0
            
            for device in devices:
                status = device.get('configStatus', 'unknown')
                if status == 'In Sync':
                    in_sync += 1
                else:
                    out_of_sync += 1
                
                group_info['devices'].append({
                    "hostname": device.get('hostname'),
                    "system_ip": device.get('systemIp'),
                    "status": status
                })
            
            group_info['in_sync'] = in_sync
            group_info['out_of_sync'] = out_of_sync
        
        report['groups'].append(group_info)
    
    return report

def print_status_report(report):
    """Print formatted status report"""
    print("\n" + "="*70)
    print(f"Configuration Groups Status - {report['timestamp']}")
    print("="*70)
    
    for group in report['groups']:
        sync_status = f"✓ {group.get('in_sync', 0)}" if group.get('out_of_sync', 0) == 0 else f"⚠ {group.get('out_of_sync', 0)} out of sync"
        print(f"\n{group['name']}")
        print(f"  Devices: {group['device_count']} | Status: {sync_status}")
        print(f"  Profiles: {', '.join(group['profiles'])}")
        
        if group.get('out_of_sync', 0) > 0:
            print("  Out-of-sync devices:")
            for device in group.get('devices', []):
                if device['status'] != 'In Sync':
                    print(f"    - {device['hostname']} ({device['status']})")

if __name__ == "__main__":
    vm = VManageSession(VMANAGE_HOST, "admin", "Admin123!")
    report = get_config_group_status(vm)
    
    if report:
        print_status_report(report)
        
        # Save report
        with open('config_group_status.json', 'w') as f:
            import json
            json.dump(report, f, indent=2)
```

## Migration from Device Templates

### Migration Strategy

```
+------------------------------------------------------------------+
|            Device Template to Configuration Group Migration       |
+------------------------------------------------------------------+

Phase 1: Inventory Assessment
├── Document existing device templates
├── List all feature templates in use
├── Identify template variables
├── Map devices to templates
└── Timeline: 1 week

Phase 2: Profile Design
├── Create equivalent feature profiles
├── Design parcel structure
├── Define variable hierarchy
├── Create CLI profiles for custom configs
└── Timeline: 2 weeks

Phase 3: Lab Validation
├── Deploy to lab devices
├── Compare generated configs
├── Test all features
├── Validate failover scenarios
└── Timeline: 1 week

Phase 4: Pilot Migration
├── Select 2-3 production devices
├── Schedule maintenance window
├── Migrate one device at a time
├── Validate post-migration
└── Timeline: 1 week

Phase 5: Full Migration
├── Migrate remaining devices by site type
├── Start with branches (lower risk)
├── Then regional hubs
├── Finally DC hubs
└── Timeline: 2-3 weeks

+------------------------------------------------------------------+
```

### Migration Script

```python
#!/usr/bin/env python3
"""
Migrate devices from Device Templates to Configuration Groups
File: migrate_to_config_groups.py
"""

from vmanage_session import VManageSession
import json
import time

VMANAGE_HOST = "10.255.0.10"

def get_device_template_config(vm, device_id):
    """Get current device template configuration"""
    url = f"https://{vm.host}/dataservice/template/config/attached/{device_id}"
    response = vm.session.get(url)
    return response.json() if response.status_code == 200 else None

def detach_device_template(vm, device_id):
    """Detach current device template"""
    url = f"https://{vm.host}/dataservice/template/config/device/mode/cli"
    payload = {
        "deviceType": "vedge",
        "devices": [{"deviceId": device_id}]
    }
    response = vm.session.post(url, json=payload)
    
    if response.status_code == 200:
        action_id = response.json().get('id')
        return wait_for_action(vm, action_id)
    return False

def attach_config_group(vm, config_group_id, device_id, variables):
    """Attach device to configuration group"""
    # Add device to config group
    url = f"https://{vm.host}/dataservice/v1/config-group/{config_group_id}/device"
    payload = {
        "devices": [{
            "deviceId": device_id,
            "variables": variables
        }]
    }
    response = vm.session.post(url, json=payload)
    
    if response.status_code == 200:
        # Deploy configuration
        deploy_url = f"https://{vm.host}/dataservice/v1/config-group/{config_group_id}/device/deploy"
        deploy_response = vm.session.post(deploy_url, json={"devices": [device_id]})
        
        if deploy_response.status_code == 200:
            action_id = deploy_response.json().get('id')
            return wait_for_action(vm, action_id)
    return False

def wait_for_action(vm, action_id, timeout=600):
    """Wait for action to complete"""
    start = time.time()
    while time.time() - start < timeout:
        url = f"https://{vm.host}/dataservice/device/action/status/{action_id}"
        response = vm.session.get(url)
        status = response.json().get('summary', {}).get('status')
        
        if status == 'done':
            return True
        elif status == 'failed':
            return False
        
        time.sleep(15)
    return False

def migrate_device(vm, device_id, target_config_group_id, variables):
    """Migrate a single device from template to config group"""
    print(f"Migrating device {device_id}...")
    
    # Step 1: Get current config for reference
    current_config = get_device_template_config(vm, device_id)
    if current_config:
        with open(f"backup_{device_id}.json", 'w') as f:
            json.dump(current_config, f, indent=2)
        print("  ✓ Configuration backed up")
    
    # Step 2: Detach from device template
    if detach_device_template(vm, device_id):
        print("  ✓ Detached from device template")
    else:
        print("  ✗ Failed to detach - aborting")
        return False
    
    # Step 3: Attach to configuration group
    if attach_config_group(vm, target_config_group_id, device_id, variables):
        print("  ✓ Attached to configuration group")
        return True
    else:
        print("  ✗ Failed to attach to config group")
        return False

if __name__ == "__main__":
    vm = VManageSession(VMANAGE_HOST, "admin", "Admin123!")
    
    # Example migration
    migrate_device(
        vm,
        device_id="device-uuid-here",
        target_config_group_id="config-group-id-here",
        variables={
            "system_host_name": "BLR-BR-WAN-01",
            "system_system_ip": "10.255.255.121",
            "system_site_id": "201"
        }
    )
```

## Summary

Configuration Groups and Feature Profiles provide modern, scalable configuration management for Abhavtech.com:

| Component | Purpose | Abhavtech Implementation |
|-----------|---------|-------------------------|
| Configuration Groups | Device type containers | 4 groups (DC Hubs, Branches, EMEA, Americas) |
| System Profile | Device identity | 2 profiles (Hub, Branch) |
| Transport Profile | WAN connectivity | 2 profiles (MultiWAN, DIA-LTE) |
| Service Profile | Business services | 2 profiles (Full, Branch) |
| Security Profile | Protection | 2 profiles (Hub, Branch) |
| CLI Profile | Custom configs | 1 profile (Hub advanced) |

Key benefits over device templates:
- Hierarchical variable inheritance
- Incremental configuration changes
- Better multi-tenancy support
- Simplified profile reuse across groups
- Improved operational efficiency

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Network Architecture Team | Initial release |

**Next Section**: [5.10 Hub Site Deployment](5-10-hub-site-deployment.md)
