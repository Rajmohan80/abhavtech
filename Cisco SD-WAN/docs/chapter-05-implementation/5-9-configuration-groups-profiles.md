# 5.9 Configuration Groups & Profiles

## Document Information
- **Version:** 1.0
- **Last Updated:** December 2025
- **Author:** Abhavtech Network Architecture Team
- **Status:** Production Ready
- **Review Cycle:** Quarterly

## Table of Contents
1. [Overview](#overview)
2. [Configuration Groups Architecture](#configuration-groups-architecture)
3. [Feature Profiles](#feature-profiles)
4. [Creating Configuration Groups](#creating-configuration-groups)
5. [Hub Site Configuration Groups](#hub-site-configuration-groups)
6. [Branch Site Configuration Groups](#branch-site-configuration-groups)
7. [Device Association](#device-association)
8. [Profile Inheritance](#profile-inheritance)
9. [Configuration Groups vs Traditional Templates](#configuration-groups-vs-traditional-templates)
10. [Migration from Templates to Configuration Groups](#migration-from-templates-to-configuration-groups)
11. [Advanced Use Cases](#advanced-use-cases)
12. [Troubleshooting](#troubleshooting)

---

## Overview

### Purpose

This section details the implementation of Configuration Groups and Feature Profiles for the Abhavtech SD-WAN deployment. Configuration Groups represent the modern, scalable approach to SD-WAN configuration management introduced in SD-WAN Manager 20.9, offering improved flexibility and operational efficiency over traditional device templates.

### Configuration Groups Benefits

| Capability | Traditional Templates | Configuration Groups |
|------------|----------------------|---------------------|
| Configuration Modularity | Feature templates | Feature profiles (more granular) |
| Device Association | One template per device | Multiple groups per device |
| Partial Updates | Push entire config | Update specific profiles |
| Profile Reuse | Copy templates | Share profiles across groups |
| Variable Scope | Device-level only | Profile, group, and device level |
| Deployment Model | Push-based | Intent-based |
| API Integration | Template-based | Profile-based (simpler) |

### Abhavtech Configuration Groups Strategy

```
+------------------------------------------------------------------+
|            Configuration Groups Architecture                      |
+------------------------------------------------------------------+
|                                                                   |
|  Configuration Groups (Device Assignment)                         |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |  +------------------+     +------------------+              |  |
|  |  | India-DC-Hub     |     | India-Branch     |              |  |
|  |  | Config Group     |     | Config Group     |              |  |
|  |  +------------------+     +------------------+              |  |
|  |                                                            |  |
|  |  +------------------+     +------------------+              |  |
|  |  | EMEA-Hub         |     | Americas-Hub     |              |  |
|  |  | Config Group     |     | Config Group     |              |  |
|  |  +------------------+     +------------------+              |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|           |                          |                           |
|           v                          v                           |
|  Feature Profiles (Configuration Building Blocks)                |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |  System Profiles:                                          |  |
|  |  +----------+ +----------+ +----------+ +----------+       |  |
|  |  |  Global  | |   Hub    | | Branch   | | Regional |       |  |
|  |  |  System  | |  System  | | System   | | Specific |       |  |
|  |  +----------+ +----------+ +----------+ +----------+       |  |
|  |                                                            |  |
|  |  Transport Profiles:                                       |  |
|  |  +----------+ +----------+ +----------+ +----------+       |  |
|  |  |   VPN0   | |   MPLS   | | Internet | |   LTE    |       |  |
|  |  |   Base   | | Transport| | Transport| | Backup   |       |  |
|  |  +----------+ +----------+ +----------+ +----------+       |  |
|  |                                                            |  |
|  |  Service Profiles:                                         |  |
|  |  +----------+ +----------+ +----------+ +----------+       |  |
|  |  |  VPN 10  | |  VPN 20  | |  VPN 40  | |  VPN 50  |       |  |
|  |  | Employee | |  Guest   | |  Voice   | |  Shared  |       |  |
|  |  +----------+ +----------+ +----------+ +----------+       |  |
|  |                                                            |  |
|  |  Policy Profiles:                                          |  |
|  |  +----------+ +----------+ +----------+ +----------+       |  |
|  |  |   QoS    | | Security | | Routing  | |   AAR    |       |  |
|  |  |  Profile | | Profile  | | Profile  | | Profile  |       |  |
|  |  +----------+ +----------+ +----------+ +----------+       |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                                                                   |
+------------------------------------------------------------------+
```

---

## Configuration Groups Architecture

### Components Overview

```
+------------------------------------------------------------------+
|              Configuration Groups Components                      |
+------------------------------------------------------------------+
|                                                                   |
|  Configuration Group                                              |
|  +------------------------------------------------------------+  |
|  |                                                            |  |
|  |  Metadata:                                                 |  |
|  |  - Name: India-DC-Hub                                      |  |
|  |  - Description: Hub sites in India DCs                     |  |
|  |  - Device Types: C8500, C8300                              |  |
|  |                                                            |  |
|  |  Associated Feature Profiles:                              |  |
|  |  +--------------------------------------------------+     |  |
|  |  | Profile Type     | Profile Name        | Required |     |  |
|  |  |------------------|---------------------|----------|     |  |
|  |  | System           | Hub-System-Profile  | Yes      |     |  |
|  |  | Transport        | Hub-VPN0-Profile    | Yes      |     |  |
|  |  | Service          | Employee-VPN10      | Yes      |     |  |
|  |  | Service          | Guest-VPN20         | Yes      |     |  |
|  |  | Service          | Voice-VPN40         | Yes      |     |  |
|  |  | Service          | Shared-VPN50        | Yes      |     |  |
|  |  | Management       | Mgmt-VPN512         | Yes      |     |  |
|  |  | Policy           | Hub-QoS-Policy      | Optional |     |  |
|  |  | CLI Add-On       | SD-Access-Handoff   | Optional |     |  |
|  |  +--------------------------------------------------+     |  |
|  |                                                            |  |
|  |  Group Variables:                                          |  |
|  |  +--------------------------------------------------+     |  |
|  |  | Variable           | Scope    | Value              |     |  |
|  |  |--------------------|----------|---------------------|     |  |
|  |  | region             | Group    | India               |     |  |
|  |  | timezone           | Group    | Asia/Kolkata        |     |  |
|  |  | dns_primary        | Group    | 10.255.0.50         |     |  |
|  |  | system_ip          | Device   | (per device)        |     |  |
|  |  | site_id            | Device   | (per device)        |     |  |
|  |  +--------------------------------------------------+     |  |
|  |                                                            |  |
|  +------------------------------------------------------------+  |
|                                                                   |
+------------------------------------------------------------------+
```

### Profile Types

| Profile Type | Purpose | Examples |
|--------------|---------|----------|
| System | Basic device settings | Hostname, system IP, site ID, timers |
| Transport (VPN 0) | WAN connectivity | Interfaces, tunnels, colors |
| Service (VPN 1-511) | Business services | Service VPNs, LAN interfaces |
| Management (VPN 512) | OOB management | Management interface, SSH |
| Policy | Traffic policies | QoS, ACLs, routing policies |
| Other | Additional config | CLI add-ons, security |

### Variable Hierarchy

```
Variable Resolution Order (highest to lowest priority):
=======================================================

1. Device-Level Variables
   - Specific to individual device
   - Overrides all other values
   - Example: system_ip = 10.255.255.1

2. Group-Level Variables
   - Shared across devices in group
   - Override profile defaults
   - Example: timezone = Asia/Kolkata

3. Profile-Level Variables
   - Default values in profile
   - Used if not overridden
   - Example: dns_primary = 10.255.0.50

4. Global Variables
   - Organization-wide defaults
   - Lowest priority
   - Example: organization_name = Abhavtech
```

---

## Feature Profiles

### System Feature Profile

**Profile: Hub-System-Profile**

```
Configuration → Configuration Groups → Feature Profiles → System

Profile Name: Hub-System-Profile
Description: System configuration for hub sites
Device Types: C8500-12X4QC, C8300-2N2S-6T

Basic Configuration:
--------------------
System IP: {{system_ip}}              [Device Variable]
Site ID: {{site_id}}                  [Device Variable]
Hostname: {{hostname}}                [Device Variable]
Organization Name: Abhavtech          [Global Constant]

Location:
  Description: {{location}}           [Device Variable]
  Latitude: {{gps_lat}}               [Device Variable]
  Longitude: {{gps_lon}}              [Device Variable]

Timezone: {{timezone}}                [Group Variable: Asia/Kolkata]

Console:
  Baud Rate: 115200
  
Device Groups: {{device_groups}}      [Device Variable]

System Settings:
  Max OMP Sessions: 4
  Track Transport: Enabled
  Track Interface Tag: {{track_tag}}  [Group Variable: 1]

Controller Settings:
  Controller Group List:
    - Group ID: 1
      Preference: 100
    - Group ID: 2
      Preference: 50
```

### Transport Profile - VPN 0

**Profile: Hub-Transport-Profile**

```
Configuration → Configuration Groups → Feature Profiles → Transport

Profile Name: Hub-Transport-Profile
Description: Transport VPN for hub sites
Associated VPN: 0

Basic Configuration:
--------------------
VPN ID: 0
VPN Name: Transport-VPN

DNS:
  Primary: {{dns_primary}}            [Group Variable]
  Secondary: {{dns_secondary}}        [Group Variable]

Interfaces:
-----------
Interface 1 - MPLS:
  Name: {{mpls_interface}}            [Device Variable]
  Description: MPLS PE Uplink
  IPv4:
    Address: {{mpls_ip}}              [Device Variable]
  Tunnel:
    Enable: Yes
    Color: mpls
    Encapsulation: IPsec
    Preference: {{mpls_preference}}   [Group Variable: 100]
    Weight: 1
  vBond as STUN: No

Interface 2 - Internet Primary:
  Name: {{inet1_interface}}           [Device Variable]
  Description: Primary Internet
  IPv4:
    DHCP: Enabled
  Tunnel:
    Enable: Yes
    Color: biz-internet
    Encapsulation: IPsec
    Preference: {{inet_preference}}   [Group Variable: 50]
    Weight: 1
  vBond as STUN: Yes
  NAT: Enabled

Interface 3 - Internet Secondary:
  Name: {{inet2_interface}}           [Device Variable]
  Description: Secondary Internet
  IPv4:
    DHCP: Enabled
  Tunnel:
    Enable: Yes
    Color: public-internet
    Encapsulation: IPsec
    Preference: 40
    Weight: 1
  NAT: Enabled

Interface 4 - LTE Backup:
  Name: {{lte_interface}}             [Device Variable]
  Description: LTE/5G Backup
  Type: Cellular
  APN: {{lte_apn}}                    [Group Variable]
  Tunnel:
    Enable: Yes
    Color: lte
    Encapsulation: IPsec
    Preference: 10
    Weight: 1
  NAT: Enabled

Static Routes:
--------------
Route 1: 0.0.0.0/0 via {{mpls_gateway}}    [Device Variable]
Route 2: 0.0.0.0/0 via DHCP (Internet)
```

### Service Profile - Employee VPN

**Profile: Employee-VPN10-Profile**

```
Configuration → Configuration Groups → Feature Profiles → Service

Profile Name: Employee-VPN10-Profile
Description: Employee services VPN
Associated VPN: 10

Basic Configuration:
--------------------
VPN ID: 10
VPN Name: Employee-Services

OMP:
  Advertise: OMP
  Advertise IPv4: Enabled
  Advertise IPv6: Enabled

DNS:
  Primary: {{vpn10_dns_primary}}      [Profile Variable: 10.10.0.50]
  Secondary: {{vpn10_dns_secondary}}  [Profile Variable: 10.10.0.51]

Interfaces:
-----------
Interface - SD-Access Handoff:
  Name: {{sda_interface}}.10          [Device Variable]
  Description: VRF-Lite to SD-Access Border
  Encapsulation:
    Type: 802.1Q
    VLAN: {{vpn10_vlan}}              [Group Variable: 3010]
  IPv4:
    Address: {{vpn10_handoff_ip}}     [Device Variable]
  Shutdown: No

Static Routes:
--------------
Route: {{vpn10_lan_subnet}} via {{vpn10_gateway}}

Route Redistribution:
---------------------
Static: Into OMP
Connected: Into OMP
```

### Service Profile - Guest VPN

**Profile: Guest-VPN20-Profile**

```
Configuration → Configuration Groups → Feature Profiles → Service

Profile Name: Guest-VPN20-Profile
Description: Guest network VPN (isolated)
Associated VPN: 20

Basic Configuration:
--------------------
VPN ID: 20
VPN Name: Guest-Network

OMP:
  Advertise: OMP
  Advertise IPv4: Enabled

DNS:
  Primary: 8.8.8.8                    [Public DNS - isolated]
  Secondary: 8.8.4.4

Interfaces:
-----------
Interface - SD-Access Handoff:
  Name: {{sda_interface}}.20          [Device Variable]
  Description: VRF-Lite to SD-Access Border - Guest
  Encapsulation:
    Type: 802.1Q
    VLAN: {{vpn20_vlan}}              [Group Variable: 3020]
  IPv4:
    Address: {{vpn20_handoff_ip}}     [Device Variable]
  Shutdown: No

Security:
---------
Note: Guest VPN is isolated - no route leaking with other VPNs
```

### Service Profile - Voice VPN

**Profile: Voice-VPN40-Profile**

```
Configuration → Configuration Groups → Feature Profiles → Service

Profile Name: Voice-VPN40-Profile
Description: Voice/UC services VPN
Associated VPN: 40

Basic Configuration:
--------------------
VPN ID: 40
VPN Name: Voice-UC-Services

OMP:
  Advertise: OMP
  Advertise IPv4: Enabled

DNS:
  Primary: {{vpn40_dns_primary}}      [Profile Variable: 10.40.0.50]

Interfaces:
-----------
Interface - SD-Access Handoff:
  Name: {{sda_interface}}.40          [Device Variable]
  Description: VRF-Lite to SD-Access Border - Voice
  Encapsulation:
    Type: 802.1Q
    VLAN: {{vpn40_vlan}}              [Group Variable: 3040]
  IPv4:
    Address: {{vpn40_handoff_ip}}     [Device Variable]
  Shutdown: No

QoS Note: Voice VPN traffic tagged for EF treatment via data policy
```

### Management Profile - VPN 512

**Profile: Management-VPN512-Profile**

```
Configuration → Configuration Groups → Feature Profiles → Management

Profile Name: Management-VPN512-Profile
Description: Out-of-band management VPN
Associated VPN: 512

Basic Configuration:
--------------------
VPN ID: 512
VPN Name: Management-OOB

DNS:
  Primary: {{mgmt_dns_primary}}       [Group Variable]

Interfaces:
-----------
Management Interface:
  Name: {{mgmt_interface}}            [Device Variable]
  Description: OOB Management Network
  IPv4:
    Address: {{mgmt_ip}}              [Device Variable]
    Gateway: {{mgmt_gateway}}         [Device Variable]
  Shutdown: No

Static Routes:
--------------
Default: 0.0.0.0/0 via {{mgmt_gateway}}
```

### Policy Profile - QoS

**Profile: Hub-QoS-Policy-Profile**

```
Configuration → Configuration Groups → Feature Profiles → Policy

Profile Name: Hub-QoS-Policy-Profile
Description: QoS policies for hub sites

QoS Map:
--------
Class: Voice (EF)
  DSCP: 46
  Bandwidth: 15%
  Priority: High
  
Class: Video (AF41)
  DSCP: 34
  Bandwidth: 25%
  Priority: Medium
  
Class: Business-Critical (AF31)
  DSCP: 26
  Bandwidth: 25%
  
Class: Transactional (AF21)
  DSCP: 18
  Bandwidth: 20%
  
Class: Best-Effort (BE)
  DSCP: 0
  Bandwidth: 15%

Shaping:
--------
Interface Shaping: Per-tunnel based on SLA class
```

### CLI Add-On Profile

**Profile: SD-Access-Handoff-CLI-Profile**

```
Configuration → Configuration Groups → Feature Profiles → Other/CLI

Profile Name: SD-Access-Handoff-CLI-Profile
Description: CLI configuration for SD-Access fabric integration

CLI Configuration:
------------------
! BGP Configuration for SD-Access Peering
router bgp 65200
 bgp router-id {{system_ip}}
 bgp log-neighbor-changes
 no bgp default ipv4-unicast
 !
 address-family ipv4 vrf EMPLOYEE
  redistribute connected
  redistribute omp
  neighbor {{vpn10_border1_peer}} remote-as 65100
  neighbor {{vpn10_border1_peer}} activate
  neighbor {{vpn10_border1_peer}} send-community both
  neighbor {{vpn10_border2_peer}} remote-as 65100
  neighbor {{vpn10_border2_peer}} activate
 exit-address-family
 !
 address-family ipv4 vrf GUEST
  redistribute connected
  redistribute omp
  neighbor {{vpn20_border1_peer}} remote-as 65100
  neighbor {{vpn20_border1_peer}} activate
  neighbor {{vpn20_border2_peer}} remote-as 65100
  neighbor {{vpn20_border2_peer}} activate
 exit-address-family
 !
 address-family ipv4 vrf VOICE
  redistribute connected
  redistribute omp
  neighbor {{vpn40_border1_peer}} remote-as 65100
  neighbor {{vpn40_border1_peer}} activate
  neighbor {{vpn40_border2_peer}} remote-as 65100
  neighbor {{vpn40_border2_peer}} activate
 exit-address-family
!

! CTS Configuration
cts role-based enforcement
cts role-based enforcement vlan-list all
```

---

## Creating Configuration Groups

### Configuration Group Creation Workflow

```
+------------------------------------------------------------------+
|           Configuration Group Creation Process                    |
+------------------------------------------------------------------+
|                                                                   |
|  Step 1: Define Group Metadata                                    |
|  +------------------------------------------------------------+  |
|  | Configuration → Configuration Groups → Add Group           |  |
|  |                                                            |  |
|  | Name: India-DC-Hub                                         |  |
|  | Description: Hub sites in India data centers               |  |
|  | Device Types: [ ] C8500-12X4QC                             |  |
|  |               [ ] C8300-2N2S-6T                             |  |
|  +------------------------------------------------------------+  |
|                          |                                        |
|                          v                                        |
|  Step 2: Associate Feature Profiles                               |
|  +------------------------------------------------------------+  |
|  | Required Profiles:                                         |  |
|  | [+] System Profile: Hub-System-Profile                     |  |
|  | [+] Transport Profile: Hub-Transport-Profile               |  |
|  | [+] Service Profile: Employee-VPN10-Profile                |  |
|  | [+] Service Profile: Guest-VPN20-Profile                   |  |
|  | [+] Service Profile: Voice-VPN40-Profile                   |  |
|  | [+] Management Profile: Management-VPN512-Profile          |  |
|  |                                                            |  |
|  | Optional Profiles:                                         |  |
|  | [+] Policy Profile: Hub-QoS-Policy-Profile                 |  |
|  | [+] CLI Profile: SD-Access-Handoff-CLI-Profile             |  |
|  +------------------------------------------------------------+  |
|                          |                                        |
|                          v                                        |
|  Step 3: Define Group Variables                                   |
|  +------------------------------------------------------------+  |
|  | Group-Level Variables:                                     |  |
|  | timezone: Asia/Kolkata                                     |  |
|  | dns_primary: 10.255.0.50                                   |  |
|  | dns_secondary: 10.255.0.51                                 |  |
|  | mpls_preference: 100                                       |  |
|  | inet_preference: 50                                        |  |
|  | lte_apn: abhavtech.enterprise                              |  |
|  | vpn10_vlan: 3010                                           |  |
|  | vpn20_vlan: 3020                                           |  |
|  | vpn40_vlan: 3040                                           |  |
|  +------------------------------------------------------------+  |
|                          |                                        |
|                          v                                        |
|  Step 4: Save Configuration Group                                 |
|  +------------------------------------------------------------+  |
|  | Click: Save                                                |  |
|  | Group Status: Ready for device association                 |  |
|  +------------------------------------------------------------+  |
|                                                                   |
+------------------------------------------------------------------+
```

### vManage GUI Steps

**Creating India-DC-Hub Configuration Group:**

```
1. Navigate to Configuration Groups:
   Configuration → Configuration Groups

2. Click "Add Configuration Group"

3. Basic Information:
   Name: India-DC-Hub
   Description: Configuration for India DC hub WAN Edges
   Solution Type: SD-WAN
   
4. Device Types:
   Select: vedge-C8500-12X4QC
   Select: vedge-C8300-2N2S-6T

5. Feature Profiles - Click "Add Profile" for each:

   System:
   - Click "Add System Profile"
   - Select: Hub-System-Profile
   - Configure group variables
   
   Transport:
   - Click "Add Transport Profile"
   - Select: Hub-Transport-Profile
   - Configure transport variables
   
   Service VPNs:
   - Click "Add Service Profile" (repeat for each VPN)
   - VPN 10: Employee-VPN10-Profile
   - VPN 20: Guest-VPN20-Profile
   - VPN 40: Voice-VPN40-Profile
   - VPN 50: Shared-VPN50-Profile
   
   Management:
   - Click "Add Management Profile"
   - Select: Management-VPN512-Profile
   
   Policy (Optional):
   - Click "Add Policy Profile"
   - Select: Hub-QoS-Policy-Profile
   
   Other/CLI (Optional):
   - Click "Add Other Profile"
   - Select: SD-Access-Handoff-CLI-Profile

6. Configure Group Variables:
   - Set values for all group-level variables
   - Leave device-specific variables empty (set during association)

7. Click "Save"
```

---

## Hub Site Configuration Groups

### India DC Hub Configuration Group

**Group: India-DC-Hub**

```
Configuration Group Definition:
===============================

Name: India-DC-Hub
Description: Mumbai and Chennai DC hub sites
Device Types: C8500-12X4QC, C8300-2N2S-6T

Associated Profiles:
--------------------
| Profile Type | Profile Name                  | Required |
|--------------|-------------------------------|----------|
| System       | Hub-System-Profile            | Yes      |
| Transport    | Hub-Transport-Profile         | Yes      |
| Service      | Employee-VPN10-Profile        | Yes      |
| Service      | Guest-VPN20-Profile           | Yes      |
| Service      | IoT-VPN30-Profile             | Yes      |
| Service      | Voice-VPN40-Profile           | Yes      |
| Service      | Shared-VPN50-Profile          | Yes      |
| Management   | Management-VPN512-Profile     | Yes      |
| Policy       | Hub-QoS-Policy-Profile        | Yes      |
| CLI          | SD-Access-Handoff-CLI-Profile | Yes      |

Group Variables:
----------------
| Variable Name       | Value              |
|---------------------|---------------------|
| timezone            | Asia/Kolkata        |
| dns_primary         | 10.255.0.50         |
| dns_secondary       | 10.255.0.51         |
| ntp_server_1        | 10.255.0.50         |
| ntp_server_2        | 10.255.0.51         |
| syslog_server       | 10.255.0.60         |
| mpls_preference     | 100                 |
| inet_preference     | 50                  |
| lte_apn             | abhavtech.enterprise|
| vpn10_vlan          | 3010                |
| vpn20_vlan          | 3020                |
| vpn30_vlan          | 3030                |
| vpn40_vlan          | 3040                |
| vpn50_vlan          | 3050                |
| radius_server_1     | 10.255.0.21         |
| radius_server_2     | 10.255.0.22         |
| controller_group_1  | 1                   |
| controller_group_2  | 2                   |

Associated Devices:
-------------------
| Device             | System IP     | Site ID |
|--------------------|---------------|---------|
| C8K-MUMBAI-WE01    | 10.255.255.1  | 100     |
| C8K-MUMBAI-WE02    | 10.255.255.2  | 100     |
| C8K-CHENNAI-WE01   | 10.255.255.11 | 110     |
| C8K-CHENNAI-WE02   | 10.255.255.12 | 110     |
```

### EMEA Hub Configuration Group

**Group: EMEA-Hub**

```
Configuration Group Definition:
===============================

Name: EMEA-Hub
Description: London and Frankfurt hub sites
Device Types: C8300-2N2S-6T

Associated Profiles:
--------------------
| Profile Type | Profile Name                  | Required |
|--------------|-------------------------------|----------|
| System       | Hub-System-Profile            | Yes      |
| Transport    | EMEA-Transport-Profile        | Yes      |
| Service      | Employee-VPN10-Profile        | Yes      |
| Service      | Guest-VPN20-Profile           | Yes      |
| Service      | Voice-VPN40-Profile           | Yes      |
| Service      | Shared-VPN50-Profile          | Yes      |
| Management   | Management-VPN512-Profile     | Yes      |
| Policy       | Hub-QoS-Policy-Profile        | Yes      |
| CLI          | SD-Access-Handoff-CLI-Profile | Yes      |

Group Variables:
----------------
| Variable Name       | Value              |
|---------------------|---------------------|
| timezone            | Europe/London       |
| dns_primary         | 10.200.0.50         |
| dns_secondary       | 10.200.0.51         |
| mpls_preference     | 100                 |
| inet_preference     | 50                  |
| vpn10_vlan          | 3010                |
| vpn20_vlan          | 3020                |
| vpn40_vlan          | 3040                |
| vpn50_vlan          | 3050                |
| controller_group_1  | 2                   |
| controller_group_2  | 1                   |

Note: EMEA uses controller group 2 (Chennai) as primary for latency
```

### Americas Hub Configuration Group

**Group: Americas-Hub**

```
Configuration Group Definition:
===============================

Name: Americas-Hub
Description: New Jersey and Dallas hub sites
Device Types: C8300-2N2S-6T

Group Variables:
----------------
| Variable Name       | Value              |
|---------------------|---------------------|
| timezone            | America/New_York    |
| dns_primary         | 10.300.0.50         |
| dns_secondary       | 10.300.0.51         |
| mpls_preference     | 100                 |
| inet_preference     | 50                  |
| controller_group_1  | 2                   |
| controller_group_2  | 1                   |
```

---

## Branch Site Configuration Groups

### India Branch Configuration Group

**Group: India-Branch**

```
Configuration Group Definition:
===============================

Name: India-Branch
Description: India branch sites (Bangalore, Delhi, Noida)
Device Types: C8300-1N1S-6T

Associated Profiles:
--------------------
| Profile Type | Profile Name                    | Required |
|--------------|---------------------------------|----------|
| System       | Branch-System-Profile           | Yes      |
| Transport    | Branch-Transport-Profile        | Yes      |
| Service      | Employee-VPN10-Profile          | Yes      |
| Service      | Guest-VPN20-Profile             | Yes      |
| Service      | Voice-VPN40-Profile             | Yes      |
| Management   | Management-VPN512-Profile       | Yes      |
| Policy       | Branch-QoS-Policy-Profile       | Yes      |
| CLI          | SD-Access-Handoff-Branch-CLI    | Yes      |

Group Variables:
----------------
| Variable Name       | Value              |
|---------------------|---------------------|
| timezone            | Asia/Kolkata        |
| dns_primary         | 10.255.0.50         |
| dns_secondary       | 10.255.0.51         |
| inet_preference     | 100                 |
| lte_preference      | 10                  |
| lte_apn             | abhavtech.branch    |
| vpn10_vlan          | 3010                |
| vpn20_vlan          | 3020                |
| vpn40_vlan          | 3040                |
| controller_group_1  | 1                   |
| controller_group_2  | 2                   |

Note: Branches have single border connection, no MPLS
      Internet is primary transport, LTE is backup only

Associated Devices:
-------------------
| Device               | System IP      | Site ID |
|----------------------|----------------|---------|
| C8K-BANGALORE-WE01   | 10.255.255.61  | 120     |
| C8K-BANGALORE-WE02   | 10.255.255.62  | 120     |
| C8K-DELHI-WE01       | 10.255.255.71  | 130     |
| C8K-DELHI-WE02       | 10.255.255.72  | 130     |
| C8K-NOIDA-WE01       | 10.255.255.81  | 140     |
| C8K-NOIDA-WE02       | 10.255.255.82  | 140     |
```

### Branch Transport Profile

**Profile: Branch-Transport-Profile**

```
Profile Name: Branch-Transport-Profile
Description: Transport VPN for branch sites (Internet + LTE only)

Basic Configuration:
--------------------
VPN ID: 0
VPN Name: Transport-VPN

Interfaces:
-----------
Interface 1 - Internet Primary:
  Name: {{inet_interface}}            [Device Variable]
  Description: Primary Internet
  IPv4:
    DHCP: Enabled
  Tunnel:
    Enable: Yes
    Color: biz-internet
    Encapsulation: IPsec
    Preference: {{inet_preference}}   [Group Variable: 100]
    Weight: 1
  vBond as STUN: Yes
  NAT: Enabled

Interface 2 - LTE Backup:
  Name: {{lte_interface}}             [Device Variable]
  Description: LTE/4G Backup
  Type: Cellular
  APN: {{lte_apn}}                    [Group Variable]
  Tunnel:
    Enable: Yes
    Color: lte
    Encapsulation: IPsec
    Preference: {{lte_preference}}    [Group Variable: 10]
    Weight: 1
  NAT: Enabled

Static Routes:
--------------
Route 1: 0.0.0.0/0 via DHCP (Internet)
Route 2: 0.0.0.0/0 via Cellular (LTE)

Note: No MPLS at branch sites - Internet-first design
```

---

## Device Association

### Device Association Process

```
+------------------------------------------------------------------+
|              Device Association Workflow                          |
+------------------------------------------------------------------+
|                                                                   |
|  Step 1: Select Configuration Group                               |
|  +------------------------------------------------------------+  |
|  | Configuration → Configuration Groups                       |  |
|  | Select: India-DC-Hub                                       |  |
|  | Click: Associated Devices                                  |  |
|  +------------------------------------------------------------+  |
|                          |                                        |
|                          v                                        |
|  Step 2: Add Devices to Group                                     |
|  +------------------------------------------------------------+  |
|  | Click: Associate Devices                                   |  |
|  | Available Devices:                                         |  |
|  | [x] C8K-MUMBAI-WE01 (10.255.255.1)                        |  |
|  | [x] C8K-MUMBAI-WE02 (10.255.255.2)                        |  |
|  | Click: Associate                                           |  |
|  +------------------------------------------------------------+  |
|                          |                                        |
|                          v                                        |
|  Step 3: Configure Device Variables                               |
|  +------------------------------------------------------------+  |
|  | Device: C8K-MUMBAI-WE01                                    |  |
|  |                                                            |  |
|  | System Variables:                                          |  |
|  | hostname: C8K-MUMBAI-WE01                                  |  |
|  | system_ip: 10.255.255.1                                    |  |
|  | site_id: 100                                               |  |
|  | location: Mumbai DC                                        |  |
|  |                                                            |  |
|  | Transport Variables:                                       |  |
|  | mpls_interface: TenGigabitEthernet0/0/0                    |  |
|  | mpls_ip: 172.16.100.1/30                                   |  |
|  | mpls_gateway: 172.16.100.2                                 |  |
|  | inet1_interface: TenGigabitEthernet0/0/1                   |  |
|  | inet2_interface: TenGigabitEthernet0/0/2                   |  |
|  |                                                            |  |
|  | Service Variables:                                         |  |
|  | sda_interface: TenGigabitEthernet0/0/4                     |  |
|  | vpn10_handoff_ip: 10.10.255.2/30                           |  |
|  | vpn10_border1_peer: 10.10.255.1                            |  |
|  | ... (continue for all service VPNs)                        |  |
|  +------------------------------------------------------------+  |
|                          |                                        |
|                          v                                        |
|  Step 4: Deploy Configuration                                     |  |
|  +------------------------------------------------------------+  |
|  | Review: Generated configuration preview                    |  |
|  | Validate: Check for conflicts                              |  |
|  | Deploy: Push to device                                     |  |
|  +------------------------------------------------------------+  |
|                                                                   |
+------------------------------------------------------------------+
```

### Device Variable Matrix

**Mumbai DC WAN Edges:**

```
+------------------------------------------------------------------+
|                Mumbai DC Device Variables                         |
+------------------------------------------------------------------+
| Variable                | C8K-MUMBAI-WE01    | C8K-MUMBAI-WE02   |
|-------------------------|--------------------|--------------------|
| hostname                | C8K-MUMBAI-WE01    | C8K-MUMBAI-WE02   |
| system_ip               | 10.255.255.1       | 10.255.255.2      |
| site_id                 | 100                | 100               |
| location                | Mumbai DC Rack A1  | Mumbai DC Rack A2 |
| gps_lat                 | 19.0760            | 19.0760           |
| gps_lon                 | 72.8777            | 72.8777           |
| device_groups           | mumbai,dc,hub      | mumbai,dc,hub     |
| mpls_interface          | Te0/0/0            | Te0/0/0           |
| mpls_ip                 | 172.16.100.1/30    | 172.16.100.5/30   |
| mpls_gateway            | 172.16.100.2       | 172.16.100.6      |
| inet1_interface         | Te0/0/1            | Te0/0/1           |
| inet2_interface         | Te0/0/2            | Te0/0/2           |
| lte_interface           | Cellular0/4/0      | Cellular0/4/0     |
| sda_border1_interface   | Te0/0/4            | Te0/0/4           |
| sda_border2_interface   | Te0/0/5            | Te0/0/5           |
| vpn10_border1_ip        | 10.10.255.2/30     | 10.10.255.6/30    |
| vpn10_border1_peer      | 10.10.255.1        | 10.10.255.5       |
| vpn10_border2_ip        | 10.10.255.10/30    | 10.10.255.14/30   |
| vpn10_border2_peer      | 10.10.255.9        | 10.10.255.13      |
| mgmt_interface          | Gi0/0/7            | Gi0/0/7           |
| mgmt_ip                 | 10.255.0.101/24    | 10.255.0.102/24   |
| mgmt_gateway            | 10.255.0.1         | 10.255.0.1        |
+------------------------------------------------------------------+
```

### Bulk Device Association via CSV

```csv
# devices_variables.csv
device_id,hostname,system_ip,site_id,location,mpls_interface,mpls_ip,mpls_gateway,inet1_interface,mgmt_ip
FCW2448P1AB,C8K-MUMBAI-WE01,10.255.255.1,100,Mumbai DC,Te0/0/0,172.16.100.1/30,172.16.100.2,Te0/0/1,10.255.0.101/24
FCW2448P1AC,C8K-MUMBAI-WE02,10.255.255.2,100,Mumbai DC,Te0/0/0,172.16.100.5/30,172.16.100.6,Te0/0/1,10.255.0.102/24
FCW2448P1AD,C8K-CHENNAI-WE01,10.255.255.11,110,Chennai DC,Te0/0/0,172.16.110.1/30,172.16.110.2,Te0/0/1,10.255.0.111/24
FCW2448P1AE,C8K-CHENNAI-WE02,10.255.255.12,110,Chennai DC,Te0/0/0,172.16.110.5/30,172.16.110.6,Te0/0/1,10.255.0.112/24
```

**Import Process:**
```
Configuration → Configuration Groups → India-DC-Hub
Associated Devices → Import CSV → Select file
Review imported values → Associate Devices
```

---

## Profile Inheritance

### Inheritance Model

```
+------------------------------------------------------------------+
|                   Profile Inheritance Model                       |
+------------------------------------------------------------------+
|                                                                   |
|  Base Profile (Parent)                                            |
|  +------------------------------------------------------------+  |
|  | Base-System-Profile                                        |  |
|  | - organization_name: Abhavtech (Global)                    |  |
|  | - console_baud: 115200                                     |  |
|  | - max_omp_sessions: 4                                      |  |
|  | - track_transport: enabled                                 |  |
|  +------------------------------------------------------------+  |
|           |                      |                               |
|           v                      v                               |
|  Derived Profiles (Children)                                     |
|  +--------------------------+  +--------------------------+      |
|  | Hub-System-Profile       |  | Branch-System-Profile    |      |
|  | Inherits: Base-System    |  | Inherits: Base-System    |      |
|  | Overrides:               |  | Overrides:               |      |
|  | - max_omp_sessions: 8    |  | - max_omp_sessions: 2    |      |
|  | Adds:                    |  | Adds:                    |      |
|  | - controller_groups      |  | - simplified_settings    |      |
|  +--------------------------+  +--------------------------+      |
|                                                                   |
+------------------------------------------------------------------+
```

### Creating Inherited Profiles

```
1. Create Base Profile:
   Configuration → Configuration Groups → Feature Profiles
   Add Profile: Base-System-Profile
   Configure common settings (organization, console, etc.)
   Save

2. Create Derived Profile:
   Add Profile: Hub-System-Profile
   Select "Inherit from": Base-System-Profile
   Override specific values as needed
   Add additional settings
   Save

3. Use in Configuration Group:
   When creating group, select Hub-System-Profile
   Base settings automatically included
   Overrides applied
```

---

## Configuration Groups vs Traditional Templates

### Feature Comparison

| Capability | Templates | Configuration Groups |
|------------|-----------|---------------------|
| **Configuration** | | |
| Modular config blocks | Feature Templates | Feature Profiles |
| Device assignment | Device Template → Device | Config Group → Device |
| Partial updates | Not supported | Supported |
| **Variables** | | |
| Variable scope | Device only | Profile, Group, Device |
| Default values | In template | In profile |
| Variable inheritance | Not supported | Supported |
| **Operations** | | |
| Update workflow | Edit template → Push all | Edit profile → Push affected |
| Rollback | Template version | Profile version |
| Impact analysis | Device-level | Profile-level |
| **API** | | |
| REST API complexity | Complex (template IDs) | Simpler (profile-based) |
| Automation friendly | Medium | High |

### When to Use Each

**Use Traditional Templates When:**
- Existing template investment
- Specific version requirements (<20.9)
- Full device configuration control
- Simple, static deployments

**Use Configuration Groups When:**
- New deployments on 20.9+
- Need partial update capability
- Variable inheritance required
- Complex multi-tier deployments
- Heavy automation/API usage

---

## Migration from Templates to Configuration Groups

### Migration Planning

```
+------------------------------------------------------------------+
|              Template to Config Group Migration                   |
+------------------------------------------------------------------+
|                                                                   |
|  Phase 1: Assessment                                              |
|  +------------------------------------------------------------+  |
|  | - Inventory existing templates                             |  |
|  | - Map feature templates to profiles                        |  |
|  | - Document variable mappings                               |  |
|  | - Identify customizations needing CLI profiles             |  |
|  +------------------------------------------------------------+  |
|                          |                                        |
|                          v                                        |
|  Phase 2: Profile Creation                                        |
|  +------------------------------------------------------------+  |
|  | - Create equivalent feature profiles                       |  |
|  | - Convert feature template logic                           |  |
|  | - Create CLI profiles for custom config                    |  |
|  | - Test profiles in lab                                     |  |
|  +------------------------------------------------------------+  |
|                          |                                        |
|                          v                                        |
|  Phase 3: Group Creation                                          |
|  +------------------------------------------------------------+  |
|  | - Create configuration groups                              |  |
|  | - Map devices from templates to groups                     |  |
|  | - Define group and device variables                        |  |
|  +------------------------------------------------------------+  |
|                          |                                        |
|                          v                                        |
|  Phase 4: Migration Execution                                     |
|  +------------------------------------------------------------+  |
|  | - Detach devices from templates                            |  |
|  | - Associate devices with config groups                     |  |
|  | - Deploy configuration                                     |  |
|  | - Validate functionality                                   |  |
|  +------------------------------------------------------------+  |
|                                                                   |
+------------------------------------------------------------------+
```

### Migration Script Example

```python
#!/usr/bin/env python3
"""
Template to Configuration Group Migration Script
"""

import requests
import json

VMANAGE_HOST = "vmanage.abhavtech.com"

class ConfigGroupMigrator:
    def __init__(self, host, username, password):
        self.host = host
        self.session = self._authenticate(username, password)
    
    def _authenticate(self, username, password):
        session = requests.Session()
        session.verify = False
        
        url = f"https://{self.host}/j_security_check"
        session.post(url, data={
            "j_username": username,
            "j_password": password
        })
        
        token_url = f"https://{self.host}/dataservice/client/token"
        token = session.get(token_url).text
        session.headers["X-XSRF-TOKEN"] = token
        
        return session
    
    def get_device_template(self, template_id):
        """Get device template details"""
        url = f"https://{self.host}/dataservice/template/device/object/{template_id}"
        response = self.session.get(url)
        return response.json()
    
    def get_feature_templates(self, template_id):
        """Get feature templates associated with device template"""
        url = f"https://{self.host}/dataservice/template/feature"
        response = self.session.get(url)
        return response.json().get("data", [])
    
    def create_feature_profile(self, profile_data):
        """Create feature profile from template"""
        url = f"https://{self.host}/dataservice/v1/feature-profile"
        response = self.session.post(url, json=profile_data)
        return response.json()
    
    def create_config_group(self, group_data):
        """Create configuration group"""
        url = f"https://{self.host}/dataservice/v1/config-group"
        response = self.session.post(url, json=group_data)
        return response.json()
    
    def migrate_template_to_group(self, template_id, group_name):
        """Full migration workflow"""
        
        # Get template details
        template = self.get_device_template(template_id)
        print(f"Migrating template: {template['templateName']}")
        
        # Create feature profiles from feature templates
        profiles = []
        for ft_id in template.get("generalTemplates", []):
            ft_data = self.get_feature_templates(ft_id)
            profile = self.convert_template_to_profile(ft_data)
            result = self.create_feature_profile(profile)
            profiles.append(result["id"])
            print(f"  Created profile: {profile['name']}")
        
        # Create configuration group
        group_data = {
            "name": group_name,
            "description": f"Migrated from {template['templateName']}",
            "deviceTypes": template.get("deviceType", []),
            "featureProfileIds": profiles
        }
        
        group = self.create_config_group(group_data)
        print(f"Created config group: {group_name}")
        
        return group
    
    def convert_template_to_profile(self, template_data):
        """Convert feature template to feature profile format"""
        # Conversion logic here
        profile = {
            "name": f"{template_data['templateName']}-profile",
            "description": template_data.get("templateDescription", ""),
            "type": template_data["templateType"],
            "definition": template_data.get("templateDefinition", {})
        }
        return profile

def main():
    migrator = ConfigGroupMigrator(
        VMANAGE_HOST,
        "admin",
        "********"
    )
    
    # Migrate Mumbai DC Hub template
    migrator.migrate_template_to_group(
        template_id="template-id-mumbai-hub",
        group_name="India-DC-Hub"
    )

if __name__ == "__main__":
    main()
```

---

## Advanced Use Cases

### Multi-Region Configuration Groups

```
Scenario: Different timezone and DNS per region
=========================================

Configuration Groups:
- India-DC-Hub     (timezone: Asia/Kolkata, dns: 10.255.0.50)
- EMEA-Hub         (timezone: Europe/London, dns: 10.200.0.50)
- Americas-Hub     (timezone: America/New_York, dns: 10.300.0.50)

All share same feature profiles, only group variables differ:
- Hub-System-Profile (timezone = {{timezone}})
- Hub-Transport-Profile (dns_primary = {{dns_primary}})
```

### Staged Rollout with Configuration Groups

```
Scenario: New feature profile testing
=====================================

1. Create test configuration group:
   - Name: India-DC-Hub-Test
   - Same profiles as production except new feature
   - Associate single test device

2. Test and validate:
   - Deploy to test device
   - Validate functionality
   - Document results

3. Promote to production:
   - Update production group profiles
   - Or reassign device back to production group

4. Full rollout:
   - Update remaining devices in production group
```

### Dynamic Profile Selection

```
Scenario: Different transport profiles based on site type
========================================================

Hub Sites (MPLS + Internet + LTE):
- Use: Hub-Transport-Profile
- Interfaces: 4 (MPLS, Internet x2, LTE)

Branch Sites (Internet + LTE):
- Use: Branch-Transport-Profile
- Interfaces: 2 (Internet, LTE)

Remote Sites (LTE Only):
- Use: Remote-Transport-Profile
- Interfaces: 1 (LTE only)

Implementation:
- Create separate configuration groups per site type
- Associate appropriate transport profile
- Share other profiles (service VPNs, management)
```

---

## Troubleshooting

### Common Issues

| Issue | Symptom | Resolution |
|-------|---------|------------|
| Profile not available | "Profile not found" | Check device type compatibility |
| Variable missing | "Required variable" error | Add missing variable at appropriate scope |
| Deploy failure | Configuration push error | Check profile syntax, variables |
| Inheritance conflict | Unexpected config | Review inheritance chain |
| Device incompatible | "Device type mismatch" | Verify device type in group definition |

### Diagnostic Commands

```
vManage Diagnostics:
====================

1. Configuration Group Status:
   Configuration → Configuration Groups → [Group Name]
   - Check profile assignments
   - View associated devices
   - Review group variables

2. Device Association Status:
   Configuration → Configuration Groups → [Group Name] → Associated Devices
   - In Sync: Configuration deployed successfully
   - Out of Sync: Pending changes
   - Error: Deployment failed

3. Profile Validation:
   Configuration → Configuration Groups → Feature Profiles → [Profile]
   - Validate profile syntax
   - Check variable definitions
   - Review device type compatibility

4. API Validation:
   GET /dataservice/v1/config-group/{group-id}/devices
   - Returns device list and status
```

### Debug on WAN Edge

```
! Verify configuration from config group
show sdwan running-config | section system
show sdwan running-config | section vpn 0
show sdwan running-config | section vpn 10

! Check OMP routes (validates service VPN config)
show sdwan omp routes

! Verify tunnel status
show sdwan bfd sessions
show sdwan tunnel statistics
```

---

## Summary

### Configuration Groups Inventory

| Group Name | Sites | Devices | Profiles |
|------------|-------|---------|----------|
| India-DC-Hub | Mumbai, Chennai | 4 | 10 |
| EMEA-Hub | London, Frankfurt | 4 | 9 |
| Americas-Hub | New Jersey, Dallas | 4 | 9 |
| India-Branch | Bangalore, Delhi, Noida | 6 | 8 |

### Key Takeaways

1. **Configuration Groups** provide modern, scalable configuration management
2. **Feature Profiles** are reusable building blocks shared across groups
3. **Variable hierarchy** enables flexible customization at profile, group, and device levels
4. **Partial updates** improve operational efficiency vs. full template pushes
5. **Migration path** available from traditional templates to configuration groups

### Next Steps

1. Create all feature profiles for Abhavtech deployment
2. Create configuration groups for each site type
3. Associate devices and configure variables
4. Deploy configurations and validate
5. Proceed to Hub Site Deployment (Section 5.10)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech | Initial release |

---

*Document: 5.9 Configuration Groups & Profiles*
*Abhavtech SD-WAN Documentation Project*
*Confidential - Internal Use Only*
