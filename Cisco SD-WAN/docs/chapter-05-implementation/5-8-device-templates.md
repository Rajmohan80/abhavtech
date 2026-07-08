# 5.8 Device Templates (CLI/Feature)

## Document Information
- **Version**: 1.0
- **Last Updated**: December 2025
- **Author**: Network Architecture Team
- **Status**: Production Ready

## Overview

This section provides comprehensive guidance on creating and managing device templates for Abhavtech.com's SD-WAN deployment. Templates enable consistent, scalable configuration management across all WAN Edge devices while supporting site-specific customization through variables.

## Template Architecture

### Template Hierarchy

```
+------------------------------------------------------------------+
|                    SD-WAN Template Hierarchy                      |
+------------------------------------------------------------------+
|                                                                    |
|  +----------------------------------------------------------+     |
|  |                    Device Templates                       |     |
|  |  (Complete device configuration - attaches to device)    |     |
|  +----------------------------------------------------------+     |
|            |              |              |                         |
|            v              v              v                         |
|  +----------------+ +----------------+ +----------------+          |
|  | DC-Hub-C8500   | | Reg-Hub-C8300  | | Branch-C8300  |          |
|  | Template       | | Template       | | Template       |          |
|  +----------------+ +----------------+ +----------------+          |
|            |              |              |                         |
|            +-------+------+------+-------+                         |
|                    |             |                                  |
|                    v             v                                  |
|  +----------------------------------------------------------+     |
|  |                   Feature Templates                       |     |
|  |  (Reusable building blocks - referenced by device)       |     |
|  +----------------------------------------------------------+     |
|  |                                                           |     |
|  | +----------+ +----------+ +----------+ +----------+      |     |
|  | |  System  | |  VPN 0   | | VPN 512  | |   AAA    |      |     |
|  | +----------+ +----------+ +----------+ +----------+      |     |
|  |                                                           |     |
|  | +----------+ +----------+ +----------+ +----------+      |     |
|  | | Logging  | |   SNMP   | | Security | |   OMP    |      |     |
|  | +----------+ +----------+ +----------+ +----------+      |     |
|  |                                                           |     |
|  | +----------+ +----------+ +----------+ +----------+      |     |
|  | |  Banner  | |   NTP    | | BGP/OSPF | | Policy   |      |     |
|  | +----------+ +----------+ +----------+ +----------+      |     |
|  |                                                           |     |
|  +----------------------------------------------------------+     |
|                                                                    |
|  +----------------------------------------------------------+     |
|  |              CLI Add-On Templates (Optional)              |     |
|  |  (Custom CLI for features not in Feature Templates)      |     |
|  +----------------------------------------------------------+     |
|                                                                    |
+------------------------------------------------------------------+
```

### Template Types Comparison

| Template Type | Purpose | Flexibility | Use Case |
|---------------|---------|-------------|----------|
| **Feature Template** | GUI-based configuration blocks | Limited to schema | Standard configurations |
| **CLI Template** | Free-form CLI configuration | Full flexibility | Custom/advanced features |
| **Device Template** | Container for feature templates | Combines both types | Complete device config |
| **CLI Add-On** | Supplements device template | CLI injection points | Edge cases, workarounds |

## Feature Templates

### Core Feature Template Library

#### System Feature Template

```
Template Name: ABVT-System-Base
Template Type: Cisco System
Description: Base system configuration for all WAN Edges

+------------------------------------------------------------------+
|                     System Template Variables                     |
+------------------------------------------------------------------+
| Variable Name          | Type    | Default/Value                 |
+------------------------+---------+-------------------------------+
| //system/host-name     | String  | {{device_hostname}}           |
| //system/system-ip     | IP      | {{device_system_ip}}          |
| //system/site-id       | Integer | {{device_site_id}}            |
| //system/organization  | String  | Abhavtech                     |
| //system/vbond         | String  | sdwan-validator.abhavtech.com |
| //system/timezone      | String  | Asia/Kolkata                  |
| //system/idle-timeout  | Integer | 30                            |
| //system/console-baud  | Integer | 115200                        |
| //system/gps-location  | Object  | {{site_gps_lat}}/{{site_gps_long}} |
+------------------------------------------------------------------+

Basic Settings:
- Site ID: {{device_site_id}}
- System IP: {{device_system_ip}}
- Hostname: {{device_hostname}}
- Timezone: Asia/Kolkata
- Console Baud Rate: 115200
- Idle Timeout: 30 minutes

Advanced Settings:
- Control Session Pacing: Enabled
- Track Transport: Enabled
- Track Interface Tag: 1000
- On-Demand Tunnel: Disabled
- On-Demand Idle Timeout: 10 minutes
```

#### VPN 0 Transport Template (MPLS)

```
Template Name: ABVT-VPN0-Transport-MPLS
Template Type: Cisco VPN Interface Ethernet
Description: MPLS transport interface configuration

+------------------------------------------------------------------+
|                    VPN0 MPLS Interface Variables                  |
+------------------------------------------------------------------+
| Variable Name              | Type    | Default/Value             |
+----------------------------+---------+---------------------------+
| vpn0_mpls_interface        | String  | GigabitEthernet0/0/1      |
| vpn0_mpls_ip               | IP      | {{mpls_interface_ip}}     |
| vpn0_mpls_mask             | IP      | 255.255.255.252           |
| vpn0_mpls_gateway          | IP      | {{mpls_gateway_ip}}       |
| vpn0_mpls_bandwidth        | Integer | {{mpls_bandwidth_kbps}}   |
| vpn0_mpls_mtu              | Integer | 1500                      |
+------------------------------------------------------------------+

Interface Configuration:
- Shutdown: No
- Interface Name: {{vpn0_mpls_interface}}
- Description: MPLS-WAN-Transport
- IPv4 Address: {{vpn0_mpls_ip}}/{{vpn0_mpls_mask}}
- DHCP: Disabled (static IP for MPLS)

Tunnel Interface:
- Tunnels: Enabled
- Color: mpls
- Restrict: No
- Carrier: carrier1
- NAT Refresh Interval: 5
- Hello Interval: 1000 ms
- Hello Tolerance: 12
- Encapsulation: IPsec (prefer) / GRE
- Weight: 1
- Max Control Connections: Unlimited

Allow Service:
- All: No
- DHCP: Yes
- DNS: Yes
- ICMP: Yes
- SSH: Yes (Management Access)
- HTTPS: Yes
- SNMP: Yes
- BFD: Yes
- Netconf: No
- NTP: Yes
- OSPF: No
- STUN: Yes
```

#### VPN 0 Transport Template (Internet/DIA)

```
Template Name: ABVT-VPN0-Transport-Internet
Template Type: Cisco VPN Interface Ethernet
Description: Internet/DIA transport interface configuration

+------------------------------------------------------------------+
|                  VPN0 Internet Interface Variables                |
+------------------------------------------------------------------+
| Variable Name              | Type    | Default/Value             |
+----------------------------+---------+---------------------------+
| vpn0_inet_interface        | String  | GigabitEthernet0/0/0      |
| vpn0_inet_dhcp             | Boolean | true                      |
| vpn0_inet_ip               | IP      | {{inet_interface_ip}}     |
| vpn0_inet_mask             | IP      | 255.255.255.0             |
| vpn0_inet_gateway          | IP      | {{inet_gateway_ip}}       |
| vpn0_inet_bandwidth        | Integer | {{inet_bandwidth_kbps}}   |
| vpn0_inet_nat              | Boolean | true                      |
+------------------------------------------------------------------+

Interface Configuration:
- Shutdown: No
- Interface Name: {{vpn0_inet_interface}}
- Description: Internet-DIA-Transport
- IPv4 Address: DHCP (or Static: {{vpn0_inet_ip}}/{{vpn0_inet_mask}})
- NAT: Enabled (for DIA)

Tunnel Interface:
- Tunnels: Enabled
- Color: biz-internet
- Restrict: No
- Carrier: carrier2
- NAT Refresh Interval: 5
- Hello Interval: 1000 ms
- Hello Tolerance: 12
- Encapsulation: IPsec
- Weight: 1
- TLOC Preference: 100 (lower than MPLS)

Allow Service:
- All: No
- DHCP: Yes
- DNS: Yes
- ICMP: Yes
- SSH: No (not exposed to Internet)
- HTTPS: No
- BFD: Yes
- STUN: Yes
```

#### VPN 0 Transport Template (LTE Backup)

```
Template Name: ABVT-VPN0-Transport-LTE
Template Type: Cisco VPN Interface Cellular
Description: LTE/5G backup transport configuration

+------------------------------------------------------------------+
|                    VPN0 LTE Interface Variables                   |
+------------------------------------------------------------------+
| Variable Name              | Type    | Default/Value             |
+----------------------------+---------+---------------------------+
| vpn0_lte_interface         | String  | Cellular0/1/0             |
| vpn0_lte_apn               | String  | {{carrier_apn}}           |
| vpn0_lte_profile           | Integer | 1                         |
| vpn0_lte_ip_negotiated     | Boolean | true                      |
| vpn0_lte_pdn_type          | String  | ipv4                      |
+------------------------------------------------------------------+

Cellular Profile:
- Profile ID: 1
- APN: {{vpn0_lte_apn}}
- PDN Type: IPv4
- Authentication: None (or PAP/CHAP if required)
- IP Negotiated: Yes

Interface Configuration:
- Shutdown: No
- Interface Name: Cellular0/1/0
- Description: LTE-Backup-Transport
- IP Negotiated: Enabled
- Bandwidth Upstream: 10000 kbps
- Bandwidth Downstream: 50000 kbps

Tunnel Interface:
- Tunnels: Enabled
- Color: lte
- Restrict: No
- Carrier: carrier3
- Last-Resort-Circuit: Yes
- Low-Bandwidth-Link: Yes
- Max Control Connections: 2
- Encapsulation: IPsec
- Weight: 1
- TLOC Preference: 50 (lowest priority)

Allow Service:
- All: No
- DHCP: Yes
- DNS: Yes
- ICMP: Yes
- BFD: Yes
- STUN: Yes
```

#### VPN 512 Management Template

```
Template Name: ABVT-VPN512-Management
Template Type: Cisco VPN
Description: Out-of-band management VPN configuration

+------------------------------------------------------------------+
|                   VPN 512 Management Variables                    |
+------------------------------------------------------------------+
| Variable Name              | Type    | Default/Value             |
+----------------------------+---------+---------------------------+
| vpn512_interface           | String  | GigabitEthernet0          |
| vpn512_ip                  | IP      | {{mgmt_interface_ip}}     |
| vpn512_mask                | IP      | 255.255.255.0             |
| vpn512_gateway             | IP      | {{mgmt_gateway_ip}}       |
| vpn512_dns_primary         | IP      | 10.10.100.10              |
| vpn512_dns_secondary       | IP      | 10.10.100.11              |
+------------------------------------------------------------------+

VPN Configuration:
- VPN ID: 512
- VPN Name: Management
- Enable: Yes
- OMP Admin Distance (IPv4): 250
- OMP Admin Distance (IPv6): 250

DNS:
- Primary: 10.10.100.10
- Secondary: 10.10.100.11

Interface (GigabitEthernet0):
- Shutdown: No
- Description: OOB-Management
- IPv4 Address: {{vpn512_ip}}/{{vpn512_mask}}
- DHCP Helper: None

Static Route:
- Prefix: 10.255.0.0/24 (vManage cluster)
- Next Hop: {{vpn512_gateway}}
- Admin Distance: 1
```

#### AAA/RADIUS Template

```
Template Name: ABVT-AAA-RADIUS-ISE
Template Type: Cisco AAA
Description: RADIUS authentication with ISE

+------------------------------------------------------------------+
|                      AAA Template Variables                       |
+------------------------------------------------------------------+
| Variable Name              | Type    | Default/Value             |
+----------------------------+---------+---------------------------+
| radius_server_primary      | IP      | 10.10.50.21               |
| radius_server_secondary    | IP      | 10.10.50.22               |
| radius_secret              | String  | {{radius_shared_secret}}  |
| radius_source_interface    | String  | Loopback0                 |
| radius_timeout             | Integer | 5                         |
| radius_retransmit          | Integer | 3                         |
+------------------------------------------------------------------+

Authentication Order:
1. Server (RADIUS/TACACS+)
2. Local

RADIUS Server Group: ISE-SERVERS
- Server 1: 10.10.50.21 (Priority: 1)
- Server 2: 10.10.50.22 (Priority: 2)
- Secret Key: {{radius_secret}}
- Source Interface: Loopback0
- Timeout: 5 seconds
- Retransmit: 3

User Groups (mapped from RADIUS):
- netadmin: Network Administrators (privilege 15)
- netoper: Network Operators (privilege 7)
- security: Security Team (privilege 15, read-only)

Local Fallback Users:
- admin: privilege 15 (emergency access)
- readonly: privilege 1 (monitoring only)
```

#### Logging/Syslog Template

```
Template Name: ABVT-Logging-Syslog
Template Type: Cisco Logging
Description: Centralized logging to Splunk

+------------------------------------------------------------------+
|                    Logging Template Variables                     |
+------------------------------------------------------------------+
| Variable Name              | Type    | Default/Value             |
+----------------------------+---------+---------------------------+
| syslog_server_primary      | IP      | 10.10.60.50               |
| syslog_server_secondary    | IP      | 10.10.60.51               |
| syslog_source_interface    | String  | Loopback0                 |
| syslog_vpn                 | Integer | 512                       |
| syslog_priority            | String  | information               |
+------------------------------------------------------------------+

Disk Logging:
- Enable: Yes
- Max Size: 100 MB
- Log Rotations: 10

Server Configuration:
- Server 1: 10.10.60.50
  - VPN: 512
  - Source Interface: Loopback0
  - Priority: informational
- Server 2: 10.10.60.51
  - VPN: 512
  - Source Interface: Loopback0
  - Priority: informational

Priority Settings:
- Console: critical
- Monitor: informational
- Syslog: informational
```

#### SNMP Template

```
Template Name: ABVT-SNMP-v3
Template Type: Cisco SNMP
Description: SNMP v3 monitoring configuration

+------------------------------------------------------------------+
|                     SNMP Template Variables                       |
+------------------------------------------------------------------+
| Variable Name              | Type    | Default/Value             |
+----------------------------+---------+---------------------------+
| snmp_contact               | String  | noc@abhavtech.com         |
| snmp_location              | String  | {{site_location}}         |
| snmp_user                  | String  | sdwan-monitor             |
| snmp_auth_password         | String  | {{snmp_auth_pass}}        |
| snmp_priv_password         | String  | {{snmp_priv_pass}}        |
| snmp_trap_target           | IP      | 10.10.60.55               |
+------------------------------------------------------------------+

SNMP Settings:
- Shutdown: No
- Contact: noc@abhavtech.com
- Location: {{snmp_location}}

SNMP v3 View:
- Name: SDWAN-VIEW
- OID: 1.3.6.1 (included)

SNMP v3 Group:
- Name: SDWAN-GROUP
- Security Level: auth-priv
- View: SDWAN-VIEW (read)

SNMP v3 User:
- Name: sdwan-monitor
- Group: SDWAN-GROUP
- Auth Protocol: SHA
- Auth Password: {{snmp_auth_password}}
- Priv Protocol: AES-256
- Priv Password: {{snmp_priv_password}}

Trap Target:
- Server: 10.10.60.55
- VPN: 512
- Source Interface: Loopback0
- Community/User: sdwan-monitor
```

#### Banner Template

```
Template Name: ABVT-Banner
Template Type: Cisco Banner
Description: Login and MOTD banners

+------------------------------------------------------------------+
|                    Banner Template Content                        |
+------------------------------------------------------------------+

Login Banner:
***********************************************************************
*                                                                     *
*           ABHAVTECH.COM - AUTHORIZED ACCESS ONLY                    *
*                                                                     *
*  This system is the property of Abhavtech.com. Unauthorized        *
*  access to this device is prohibited. All connections may be       *
*  monitored and recorded. Disconnect IMMEDIATELY if you are not     *
*  an authorized user.                                                *
*                                                                     *
*  By accessing this system, you consent to monitoring and agree     *
*  to comply with all applicable security policies.                   *
*                                                                     *
***********************************************************************

MOTD Banner:
===============================================================
  Hostname: $(hostname)
  System IP: $(system-ip)
  Site ID: $(site-id)
  SD-WAN Manager: sdwan-manager.abhavtech.com
  Support: noc@abhavtech.com | +91-22-XXXX-XXXX
===============================================================
```

#### NTP Template

```
Template Name: ABVT-NTP
Template Type: Cisco NTP
Description: Network Time Protocol configuration

+------------------------------------------------------------------+
|                     NTP Template Variables                        |
+------------------------------------------------------------------+
| Variable Name              | Type    | Default/Value             |
+----------------------------+---------+---------------------------+
| ntp_server_primary         | IP      | 10.10.100.10              |
| ntp_server_secondary       | IP      | 10.10.100.11              |
| ntp_source_interface       | String  | Loopback0                 |
| ntp_vpn                    | Integer | 512                       |
+------------------------------------------------------------------+

NTP Servers:
- Server 1: 10.10.100.10
  - VPN: 512
  - Source Interface: Loopback0
  - Prefer: Yes
- Server 2: 10.10.100.11
  - VPN: 512
  - Source Interface: Loopback0
  - Prefer: No

Authentication:
- Enable: Yes
- Key ID: 1
- MD5 Value: {{ntp_auth_key}}
```

## Service VPN Templates

### VPN 10 - Corporate Data

```
Template Name: ABVT-VPN10-Corporate
Template Type: Cisco VPN
Description: Corporate data service VPN

+------------------------------------------------------------------+
|                   VPN 10 Corporate Variables                      |
+------------------------------------------------------------------+
| Variable Name              | Type    | Default/Value             |
+----------------------------+---------+---------------------------+
| vpn10_name                 | String  | Corporate-Data            |
| vpn10_interface            | String  | GigabitEthernet0/0/2      |
| vpn10_subinterface_id      | Integer | 10                        |
| vpn10_vlan                 | Integer | 10                        |
| vpn10_ip                   | IP      | {{vpn10_interface_ip}}    |
| vpn10_mask                 | IP      | 255.255.255.0             |
+------------------------------------------------------------------+

VPN Configuration:
- VPN ID: 10
- VPN Name: Corporate-Data
- Enable: Yes
- OMP Admin Distance: 251
- ECMP: Enable

DNS:
- Primary: 10.10.100.10
- Secondary: 10.10.100.11

Subinterface (for SD-Access handoff):
- Interface: GigabitEthernet0/0/2.10
- VLAN: 10
- Description: SD-Access-Handoff-VPN10
- IPv4 Address: {{vpn10_ip}}/30

Static Routes (advertise to SD-WAN fabric):
- 10.10.0.0/16 → Null0 (aggregate)
- Host routes learned via BGP from SD-Access
```

### VPN 20 - Guest Network

```
Template Name: ABVT-VPN20-Guest
Template Type: Cisco VPN
Description: Guest network service VPN (isolated)

+------------------------------------------------------------------+
|                    VPN 20 Guest Variables                         |
+------------------------------------------------------------------+
| Variable Name              | Type    | Default/Value             |
+----------------------------+---------+---------------------------+
| vpn20_name                 | String  | Guest-Network             |
| vpn20_interface            | String  | GigabitEthernet0/0/2      |
| vpn20_subinterface_id      | Integer | 20                        |
| vpn20_vlan                 | Integer | 20                        |
| vpn20_ip                   | IP      | {{vpn20_interface_ip}}    |
| vpn20_dia_enable           | Boolean | true                      |
+------------------------------------------------------------------+

VPN Configuration:
- VPN ID: 20
- VPN Name: Guest-Network
- Enable: Yes
- OMP Advertise: Connected, Static, BGP
- ECMP: Enable

Direct Internet Access (DIA):
- Enable NAT: Yes
- NAT Interface: VPN 0 Internet interface
- NAT Pool: Dynamic (interface IP)

DNS (Public):
- Primary: 8.8.8.8
- Secondary: 8.8.4.4

Note: Guest VPN is isolated - no route leaking to other VPNs
```

### VPN 30 - Voice/UC

```
Template Name: ABVT-VPN30-Voice
Template Type: Cisco VPN
Description: Voice and unified communications VPN

+------------------------------------------------------------------+
|                    VPN 30 Voice Variables                         |
+------------------------------------------------------------------+
| Variable Name              | Type    | Default/Value             |
+----------------------------+---------+---------------------------+
| vpn30_name                 | String  | Voice-UC                  |
| vpn30_interface            | String  | GigabitEthernet0/0/2      |
| vpn30_subinterface_id      | Integer | 30                        |
| vpn30_vlan                 | Integer | 30                        |
| vpn30_ip                   | IP      | {{vpn30_interface_ip}}    |
+------------------------------------------------------------------+

VPN Configuration:
- VPN ID: 30
- VPN Name: Voice-UC
- Enable: Yes
- OMP Admin Distance: 251
- ECMP: Enable

QoS Treatment:
- Voice traffic (DSCP EF) → SLA Class: Low-Latency
- Signaling (DSCP CS3) → SLA Class: Business-Critical
```

### VPN 40 - IoT/OT

```
Template Name: ABVT-VPN40-IoT
Template Type: Cisco VPN
Description: IoT and operational technology VPN

+------------------------------------------------------------------+
|                     VPN 40 IoT Variables                          |
+------------------------------------------------------------------+
| Variable Name              | Type    | Default/Value             |
+----------------------------+---------+---------------------------+
| vpn40_name                 | String  | IoT-OT                    |
| vpn40_interface            | String  | GigabitEthernet0/0/2      |
| vpn40_subinterface_id      | Integer | 40                        |
| vpn40_vlan                 | Integer | 40                        |
| vpn40_ip                   | IP      | {{vpn40_interface_ip}}    |
+------------------------------------------------------------------+

VPN Configuration:
- VPN ID: 40
- VPN Name: IoT-OT
- Enable: Yes
- OMP Admin Distance: 251

Security:
- Route Leaking: To VPN 50 (Shared Services) only
- No DIA access
- Firewall inspection: Enabled via ZBFW
```

### VPN 50 - Shared Services

```
Template Name: ABVT-VPN50-Shared
Template Type: Cisco VPN
Description: Shared services (DNS, NTP, AD, etc.)

+------------------------------------------------------------------+
|                  VPN 50 Shared Services Variables                 |
+------------------------------------------------------------------+
| Variable Name              | Type    | Default/Value             |
+----------------------------+---------+---------------------------+
| vpn50_name                 | String  | Shared-Services           |
| vpn50_interface            | String  | GigabitEthernet0/0/2      |
| vpn50_subinterface_id      | Integer | 50                        |
| vpn50_vlan                 | Integer | 50                        |
| vpn50_ip                   | IP      | {{vpn50_interface_ip}}    |
+------------------------------------------------------------------+

VPN Configuration:
- VPN ID: 50
- VPN Name: Shared-Services
- Enable: Yes
- OMP Admin Distance: 251

Route Leaking Configuration:
- Import from VPN 10: Yes (Corporate)
- Import from VPN 30: Yes (Voice)
- Import from VPN 40: Yes (IoT)
- Export to VPN 10/30/40: Yes

Services Hosted:
- DNS servers
- NTP servers
- Active Directory
- DHCP (central)
- ISE PSN
- Monitoring servers
```

## CLI Templates

### CLI Template for BGP (SD-Access Handoff)

```
Template Name: ABVT-CLI-BGP-SDACCESS
Template Type: CLI Add-On Template
Description: BGP configuration for SD-Access border handoff

+------------------------------------------------------------------+
|                    CLI BGP Template Variables                     |
+------------------------------------------------------------------+
| Variable Name              | Type    | Default/Value             |
+----------------------------+---------+---------------------------+
| bgp_local_as               | Integer | 65100                     |
| bgp_router_id              | IP      | {{device_system_ip}}      |
| bgp_neighbor_1_ip          | IP      | {{border1_handoff_ip}}    |
| bgp_neighbor_1_as          | Integer | 65200                     |
| bgp_neighbor_2_ip          | IP      | {{border2_handoff_ip}}    |
| bgp_neighbor_2_as          | Integer | 65200                     |
+------------------------------------------------------------------+

CLI Configuration:
```

```
! BGP Configuration for SD-Access Fabric Handoff
! Applied via CLI Add-On Template

router bgp {{bgp_local_as}}
 bgp router-id {{bgp_router_id}}
 bgp log-neighbor-changes
 bgp graceful-restart
 !
 ! Address family for VPN 10 (Corporate)
 address-family ipv4 vrf Corporate-Data
  redistribute connected
  redistribute static
  maximum-paths 2
  !
  neighbor {{bgp_neighbor_1_ip}} remote-as {{bgp_neighbor_1_as}}
  neighbor {{bgp_neighbor_1_ip}} description SD-Access-Border-1
  neighbor {{bgp_neighbor_1_ip}} activate
  neighbor {{bgp_neighbor_1_ip}} soft-reconfiguration inbound
  neighbor {{bgp_neighbor_1_ip}} send-community both
  !
  neighbor {{bgp_neighbor_2_ip}} remote-as {{bgp_neighbor_2_as}}
  neighbor {{bgp_neighbor_2_ip}} description SD-Access-Border-2
  neighbor {{bgp_neighbor_2_ip}} activate
  neighbor {{bgp_neighbor_2_ip}} soft-reconfiguration inbound
  neighbor {{bgp_neighbor_2_ip}} send-community both
 exit-address-family
 !
 ! Repeat for VPN 30 (Voice)
 address-family ipv4 vrf Voice-UC
  redistribute connected
  redistribute static
  maximum-paths 2
  !
  neighbor {{bgp_voice_neighbor_1_ip}} remote-as {{bgp_neighbor_1_as}}
  neighbor {{bgp_voice_neighbor_1_ip}} activate
  neighbor {{bgp_voice_neighbor_1_ip}} send-community both
  !
  neighbor {{bgp_voice_neighbor_2_ip}} remote-as {{bgp_neighbor_2_as}}
  neighbor {{bgp_voice_neighbor_2_ip}} activate
  neighbor {{bgp_voice_neighbor_2_ip}} send-community both
 exit-address-family
!
```

### CLI Template for CTS/TrustSec

```
Template Name: ABVT-CLI-CTS-SGT
Template Type: CLI Add-On Template
Description: Cisco TrustSec/SGT configuration for end-to-end segmentation

CLI Configuration:
```

```
! CTS/TrustSec Configuration
! Enables SGT propagation between SD-Access and SD-WAN

cts authorization list ISE-CTS-LIST
!
cts role-based enforcement
cts role-based enforcement vlan-list all
!
! Enable CTS on SD-Access handoff interfaces
interface GigabitEthernet0/0/2.10
 cts role-based enforcement
 cts manual
  policy static sgt {{vpn10_local_sgt}} trusted
!
interface GigabitEthernet0/0/2.30
 cts role-based enforcement
 cts manual
  policy static sgt {{vpn30_local_sgt}} trusted
!
! Propagate SGT over SD-WAN tunnels (inline tagging)
interface Tunnel100001
 cts role-based enforcement
!
interface Tunnel100002
 cts role-based enforcement
!
! Logging for SGT events
cts logging verbose
!
```

### CLI Template for Advanced QoS

```
Template Name: ABVT-CLI-QoS-Advanced
Template Type: CLI Add-On Template
Description: Advanced QoS policies beyond feature template capabilities

CLI Configuration:
```

```
! Advanced QoS Configuration
! Supplements standard QoS feature template

! Custom class-maps for application groups
class-map match-any VOICE-SIGNALING
 match protocol sip
 match protocol skinny
 match protocol h323
 match dscp cs3
!
class-map match-any VIDEO-CONFERENCING
 match protocol webex-meeting
 match protocol ms-teams-media
 match protocol zoom-media
 match dscp af41
!
class-map match-any BUSINESS-APPS
 match protocol ms-office-365
 match protocol salesforce
 match protocol sap
 match dscp af21
!
! Policy-map for WAN egress
policy-map WAN-EGRESS-POLICY
 class VOICE-SIGNALING
  priority level 1
  police cir 1000000
 class VIDEO-CONFERENCING
  priority level 2
  police cir 5000000
 class BUSINESS-APPS
  bandwidth remaining percent 40
  random-detect dscp-based
 class class-default
  bandwidth remaining percent 30
  random-detect
!
! Apply to WAN interfaces
interface GigabitEthernet0/0/0
 service-policy output WAN-EGRESS-POLICY
interface GigabitEthernet0/0/1
 service-policy output WAN-EGRESS-POLICY
!
```

## Device Templates

### DC Hub Device Template (C8500)

```
Template Name: DC-Hub-C8500-Template
Device Model: C8500-12X4QC
Description: Complete device template for DC hub routers

+------------------------------------------------------------------+
|              DC Hub C8500 Device Template Structure               |
+------------------------------------------------------------------+
| Section              | Feature Template                          |
+----------------------+-------------------------------------------+
| System               | ABVT-System-Base                          |
| Banner               | ABVT-Banner                               |
| NTP                  | ABVT-NTP                                  |
| AAA                  | ABVT-AAA-RADIUS-ISE                       |
| Logging              | ABVT-Logging-Syslog                       |
| SNMP                 | ABVT-SNMP-v3                              |
| OMP                  | ABVT-OMP-Hub                              |
+----------------------+-------------------------------------------+
| Transport VPN (0)    | ABVT-VPN0-Base                            |
| - MPLS Interface     | ABVT-VPN0-Transport-MPLS                  |
| - Internet Interface | ABVT-VPN0-Transport-Internet              |
| - LTE Interface      | ABVT-VPN0-Transport-LTE                   |
+----------------------+-------------------------------------------+
| Management VPN (512) | ABVT-VPN512-Management                    |
+----------------------+-------------------------------------------+
| Service VPN 10       | ABVT-VPN10-Corporate                      |
| - LAN Interface      | ABVT-VPN10-Interface-Hub                  |
| - BGP                | ABVT-VPN10-BGP                            |
+----------------------+-------------------------------------------+
| Service VPN 20       | ABVT-VPN20-Guest                          |
| - LAN Interface      | ABVT-VPN20-Interface-Hub                  |
+----------------------+-------------------------------------------+
| Service VPN 30       | ABVT-VPN30-Voice                          |
| - LAN Interface      | ABVT-VPN30-Interface-Hub                  |
+----------------------+-------------------------------------------+
| Service VPN 40       | ABVT-VPN40-IoT                            |
| - LAN Interface      | ABVT-VPN40-Interface-Hub                  |
+----------------------+-------------------------------------------+
| Service VPN 50       | ABVT-VPN50-Shared                         |
| - LAN Interface      | ABVT-VPN50-Interface-Hub                  |
+----------------------+-------------------------------------------+
| Security             | ABVT-Security-ZBFW-Hub                    |
| Security Policy      | ABVT-Security-Policy-Hub                  |
+----------------------+-------------------------------------------+
| CLI Add-On           | ABVT-CLI-BGP-SDACCESS                     |
| CLI Add-On           | ABVT-CLI-CTS-SGT                          |
| CLI Add-On           | ABVT-CLI-QoS-Advanced                     |
+----------------------+-------------------------------------------+

Device-Specific Variables (per device):
- device_hostname: MUM-DC-CORE-01
- device_system_ip: 10.255.255.103
- device_site_id: 101
- mpls_interface_ip: 172.16.101.2
- mpls_gateway_ip: 172.16.101.1
- inet_interface_ip: 203.0.113.2
- inet_gateway_ip: 203.0.113.1
- mgmt_interface_ip: 10.255.0.103
- mgmt_gateway_ip: 10.255.0.1
- vpn10_interface_ip: 10.101.10.1
- border1_handoff_ip: 10.101.10.2
- border2_handoff_ip: 10.101.10.6
```

### Branch Device Template (C8300)

```
Template Name: Branch-C8300-Template
Device Model: C8300-1N1S-6T
Description: Complete device template for branch routers

+------------------------------------------------------------------+
|              Branch C8300 Device Template Structure               |
+------------------------------------------------------------------+
| Section              | Feature Template                          |
+----------------------+-------------------------------------------+
| System               | ABVT-System-Base                          |
| Banner               | ABVT-Banner                               |
| NTP                  | ABVT-NTP                                  |
| AAA                  | ABVT-AAA-RADIUS-ISE                       |
| Logging              | ABVT-Logging-Syslog                       |
| SNMP                 | ABVT-SNMP-v3                              |
| OMP                  | ABVT-OMP-Spoke                            |
+----------------------+-------------------------------------------+
| Transport VPN (0)    | ABVT-VPN0-Base                            |
| - Internet Interface | ABVT-VPN0-Transport-Internet              |
| - LTE Interface      | ABVT-VPN0-Transport-LTE                   |
+----------------------+-------------------------------------------+
| Management VPN (512) | ABVT-VPN512-Management                    |
+----------------------+-------------------------------------------+
| Service VPN 10       | ABVT-VPN10-Corporate                      |
| - LAN Interface      | ABVT-VPN10-Interface-Branch               |
+----------------------+-------------------------------------------+
| Service VPN 20       | ABVT-VPN20-Guest                          |
| - LAN Interface      | ABVT-VPN20-Interface-Branch               |
+----------------------+-------------------------------------------+
| Service VPN 30       | ABVT-VPN30-Voice                          |
| - LAN Interface      | ABVT-VPN30-Interface-Branch               |
+----------------------+-------------------------------------------+
| Security             | ABVT-Security-ZBFW-Branch                 |
+----------------------+-------------------------------------------+

Device-Specific Variables (per device):
- device_hostname: BLR-BR-WAN-01
- device_system_ip: 10.255.255.121
- device_site_id: 201
- inet_interface_ip: DHCP
- inet_gateway_ip: DHCP
- mgmt_interface_ip: 10.255.0.121
- mgmt_gateway_ip: 10.255.0.1
- vpn10_interface_ip: 10.201.10.1
```

## Template Variables Management

### Variable Types

| Type | Description | Example |
|------|-------------|---------|
| **Device-Specific** | Unique per device | hostname, system-ip |
| **Site-Specific** | Same for all devices at site | site-id, GPS coords |
| **Global** | Same across all devices | org-name, vbond |
| **Calculated** | Derived from other variables | Loopback IP from system-ip |

### Variable Naming Convention

```
+------------------------------------------------------------------+
|                 Variable Naming Convention                        |
+------------------------------------------------------------------+

Format: {{scope_feature_parameter}}

Scope Prefixes:
- device_   : Device-specific (hostname, system_ip)
- site_     : Site-specific (site_id, location)
- vpn#_     : VPN-specific (vpn10_ip, vpn20_gateway)
- global_   : Global values (organization, vbond)

Examples:
- {{device_hostname}}          → MUM-DC-WAN-01
- {{device_system_ip}}         → 10.255.255.101
- {{site_id}}                  → 101
- {{site_location}}            → Mumbai DC, India
- {{vpn10_interface_ip}}       → 10.101.10.1
- {{vpn0_mpls_gateway}}        → 172.16.101.1
- {{global_vbond}}             → sdwan-validator.abhavtech.com
+------------------------------------------------------------------+
```

### Variable Spreadsheet Template

```csv
# device_variables.csv
# Import to vManage for bulk device provisioning

hostname,system_ip,site_id,location,mpls_ip,mpls_gw,inet_ip,inet_gw,vpn10_ip,vpn20_ip,vpn30_ip
MUM-DC-CORE-01,10.255.255.103,101,"Mumbai DC",172.16.101.2,172.16.101.1,203.0.113.2,203.0.113.1,10.101.10.1,10.101.20.1,10.101.30.1
MUM-DC-CORE-02,10.255.255.104,101,"Mumbai DC",172.16.101.6,172.16.101.5,203.0.113.6,203.0.113.5,10.101.10.5,10.101.20.5,10.101.30.5
CHE-DC-WAN-01,10.255.255.111,102,"Chennai DC",172.16.102.2,172.16.102.1,203.0.114.2,203.0.114.1,10.102.10.1,10.102.20.1,10.102.30.1
CHE-DC-WAN-02,10.255.255.112,102,"Chennai DC",172.16.102.6,172.16.102.5,203.0.114.6,203.0.114.5,10.102.10.5,10.102.20.5,10.102.30.5
BLR-BR-WAN-01,10.255.255.121,201,"Bangalore",DHCP,DHCP,DHCP,DHCP,10.201.10.1,10.201.20.1,10.201.30.1
DEL-BR-WAN-01,10.255.255.131,202,"Delhi",DHCP,DHCP,DHCP,DHCP,10.202.10.1,10.202.20.1,10.202.30.1
NOI-BR-WAN-01,10.255.255.141,203,"Noida",DHCP,DHCP,DHCP,DHCP,10.203.10.1,10.203.20.1,10.203.30.1
```

## Template Operations

### Creating Feature Template via API

```python
#!/usr/bin/env python3
"""
Create feature templates via vManage API
File: create_feature_templates.py
"""

from vmanage_session import VManageSession
import json

VMANAGE_HOST = "10.255.0.10"

SYSTEM_TEMPLATE = {
    "templateName": "ABVT-System-Base",
    "templateDescription": "Base system configuration for all WAN Edges",
    "templateType": "cisco_system",
    "deviceType": ["vedge-C8300-1N1S-6T", "vedge-C8300-2N2S-6T", "vedge-C8500-12X4QC"],
    "templateDefinition": {
        "system": {
            "host-name": {
                "vipObjectType": "object",
                "vipType": "variableName",
                "vipVariableName": "device_hostname"
            },
            "system-ip": {
                "vipObjectType": "object",
                "vipType": "variableName",
                "vipVariableName": "device_system_ip"
            },
            "site-id": {
                "vipObjectType": "object",
                "vipType": "variableName",
                "vipVariableName": "site_id"
            },
            "organization-name": {
                "vipObjectType": "object",
                "vipType": "constant",
                "vipValue": "Abhavtech"
            },
            "vbond": {
                "vipObjectType": "object",
                "vipType": "constant",
                "vipValue": "sdwan-validator.abhavtech.com"
            },
            "timezone": {
                "vipObjectType": "object",
                "vipType": "constant",
                "vipValue": "Asia/Kolkata"
            },
            "idle-timeout": {
                "vipObjectType": "object",
                "vipType": "constant",
                "vipValue": 30
            }
        }
    }
}

def create_feature_template(vm, template_def):
    """Create a feature template"""
    url = f"https://{vm.host}/dataservice/template/feature"
    response = vm.session.post(url, json=template_def)
    
    if response.status_code == 200:
        result = response.json()
        print(f"Created template: {template_def['templateName']} (ID: {result['templateId']})")
        return result['templateId']
    else:
        print(f"Failed to create template: {response.text}")
        return None

def list_feature_templates(vm):
    """List all feature templates"""
    url = f"https://{vm.host}/dataservice/template/feature"
    response = vm.session.get(url)
    
    if response.status_code == 200:
        templates = response.json()['data']
        print(f"\nFound {len(templates)} feature templates:")
        for t in templates:
            print(f"  - {t['templateName']} ({t['templateType']})")
        return templates
    return []

if __name__ == "__main__":
    vm = VManageSession(VMANAGE_HOST, "admin", "Admin123!")
    
    # Create system template
    create_feature_template(vm, SYSTEM_TEMPLATE)
    
    # List all templates
    list_feature_templates(vm)
```

### Attaching Device Template

```python
#!/usr/bin/env python3
"""
Attach device template to WAN Edge
File: attach_device_template.py
"""

from vmanage_session import VManageSession
import json
import time

VMANAGE_HOST = "10.255.0.10"

def get_template_id(vm, template_name):
    """Get template ID by name"""
    url = f"https://{vm.host}/dataservice/template/device"
    response = vm.session.get(url)
    
    for template in response.json()['data']:
        if template['templateName'] == template_name:
            return template['templateId']
    return None

def get_device_input(vm, template_id, device_id):
    """Get input schema for device template attachment"""
    url = f"https://{vm.host}/dataservice/template/device/config/input"
    payload = {
        "templateId": template_id,
        "deviceIds": [device_id],
        "isEdited": False,
        "isMasterEdited": False
    }
    response = vm.session.post(url, json=payload)
    return response.json()

def attach_template(vm, template_name, device_uuid, variables):
    """Attach device template with variables"""
    template_id = get_template_id(vm, template_name)
    if not template_id:
        print(f"Template {template_name} not found")
        return False
    
    # Get input schema
    input_schema = get_device_input(vm, template_id, device_uuid)
    device_input = input_schema['data'][0]
    
    # Fill in variables
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
        return wait_for_completion(vm, action_id)
    else:
        print(f"Attach failed: {response.text}")
        return False

def wait_for_completion(vm, action_id, timeout=600):
    """Wait for action to complete"""
    start = time.time()
    
    while time.time() - start < timeout:
        url = f"https://{vm.host}/dataservice/device/action/status/{action_id}"
        response = vm.session.get(url)
        status = response.json()
        
        summary = status.get('summary', {})
        if summary.get('status') == 'done':
            print("Template attachment completed successfully")
            return True
        elif summary.get('status') == 'failed':
            print(f"Template attachment failed: {status}")
            return False
        
        print(f"Status: {summary.get('status', 'unknown')} - waiting...")
        time.sleep(15)
    
    print("Timeout waiting for template attachment")
    return False

if __name__ == "__main__":
    vm = VManageSession(VMANAGE_HOST, "admin", "Admin123!")
    
    # Example: Attach branch template to Bangalore router
    variables = {
        "//system/host-name": "BLR-BR-WAN-01",
        "//system/system-ip": "10.255.255.121",
        "//system/site-id": "201",
        "vpn512_ip": "10.255.0.121",
        "vpn512_gateway": "10.255.0.1",
        "vpn10_ip": "10.201.10.1",
        "vpn20_ip": "10.201.20.1",
        "vpn30_ip": "10.201.30.1"
    }
    
    attach_template(vm, "Branch-C8300-Template", "device-uuid-here", variables)
```

### Template Change Monitoring

```python
#!/usr/bin/env python3
"""
Monitor template changes and configuration drift
File: monitor_template_drift.py
"""

from vmanage_session import VManageSession
import json
from datetime import datetime

VMANAGE_HOST = "10.255.0.10"

def check_config_status(vm):
    """Check configuration status of all devices"""
    url = f"https://{vm.host}/dataservice/device"
    response = vm.session.get(url)
    devices = response.json()['data']
    
    drift_report = {
        "timestamp": datetime.now().isoformat(),
        "total_devices": 0,
        "in_sync": 0,
        "out_of_sync": 0,
        "no_template": 0,
        "devices": []
    }
    
    for device in devices:
        if device.get('device-type') != 'vedge':
            continue
        
        drift_report['total_devices'] += 1
        status = device.get('configStatusMessage', 'Unknown')
        
        device_info = {
            "hostname": device.get('host-name'),
            "system_ip": device.get('system-ip'),
            "status": status,
            "template": device.get('template', 'None')
        }
        
        if 'In Sync' in status:
            drift_report['in_sync'] += 1
        elif 'No Template' in status:
            drift_report['no_template'] += 1
        else:
            drift_report['out_of_sync'] += 1
            device_info['drift_details'] = get_drift_details(vm, device['deviceId'])
        
        drift_report['devices'].append(device_info)
    
    return drift_report

def get_drift_details(vm, device_id):
    """Get configuration drift details for a device"""
    url = f"https://{vm.host}/dataservice/template/config/attached/{device_id}"
    response = vm.session.get(url)
    
    if response.status_code == 200:
        return response.json()
    return None

def print_drift_report(report):
    """Print formatted drift report"""
    print("\n" + "="*70)
    print(f"Configuration Drift Report - {report['timestamp']}")
    print("="*70)
    print(f"Total Devices: {report['total_devices']}")
    print(f"In Sync: {report['in_sync']}")
    print(f"Out of Sync: {report['out_of_sync']}")
    print(f"No Template: {report['no_template']}")
    
    if report['out_of_sync'] > 0:
        print("\n" + "-"*70)
        print("Devices with Configuration Drift:")
        print("-"*70)
        for device in report['devices']:
            if 'drift_details' in device:
                print(f"\n⚠ {device['hostname']} ({device['system_ip']})")
                print(f"  Status: {device['status']}")
                print(f"  Template: {device['template']}")

if __name__ == "__main__":
    vm = VManageSession(VMANAGE_HOST, "admin", "Admin123!")
    report = check_config_status(vm)
    print_drift_report(report)
    
    # Save report
    with open('drift_report.json', 'w') as f:
        json.dump(report, f, indent=2)
```

## Template Best Practices

### Design Principles

| Principle | Description | Implementation |
|-----------|-------------|----------------|
| **Modularity** | Break into reusable components | Separate feature templates per function |
| **Inheritance** | Common base, specialized extensions | Base system template + role-specific |
| **Variables** | Parameterize site-specific values | Use meaningful variable names |
| **Versioning** | Track template changes | Include version in template name |
| **Testing** | Validate before production | Lab environment first |

### Template Naming Convention

```
Format: ABVT-{Type}-{Function}[-{Variant}][-v{Version}]

Examples:
- ABVT-System-Base-v1.0
- ABVT-VPN0-Transport-MPLS-v1.0
- ABVT-VPN0-Transport-Internet-v1.0
- ABVT-VPN10-Corporate-Hub-v1.0
- ABVT-VPN10-Corporate-Branch-v1.0
- ABVT-Security-ZBFW-Hub-v1.0
- ABVT-CLI-BGP-SDACCESS-v1.0
```

### Template Testing Checklist

```
+------------------------------------------------------------------+
|                    Template Testing Checklist                     |
+------------------------------------------------------------------+

Pre-Deployment:
[ ] Template syntax validated (no errors in vManage)
[ ] All required variables defined
[ ] Variable types match expected values
[ ] CLI add-on templates parse correctly
[ ] Device compatibility verified (model support)

Lab Testing:
[ ] Attach template to lab device
[ ] Verify all features configure correctly
[ ] Test control plane connectivity
[ ] Test data plane traffic flow
[ ] Verify security policies applied
[ ] Test failover scenarios
[ ] Validate QoS marking and queuing
[ ] Check logging and monitoring

Production Deployment:
[ ] Change request approved
[ ] Maintenance window scheduled
[ ] Rollback plan documented
[ ] Monitoring alerts configured
[ ] Post-deployment verification script ready
+------------------------------------------------------------------+
```

## Summary

Device and feature templates provide scalable configuration management for Abhavtech.com's SD-WAN deployment:

| Component | Count | Purpose |
|-----------|-------|---------|
| Feature Templates | ~25 | Reusable configuration blocks |
| CLI Add-On Templates | 5-10 | Advanced customization |
| Device Templates | 3-5 | Complete device configurations |
| Variables | ~50 | Site/device-specific parameters |

Key template categories:
- **System**: Basic device identity and settings
- **Transport**: VPN 0 interfaces (MPLS, Internet, LTE)
- **Management**: VPN 512 OOB access
- **Service VPNs**: Business segmentation (VPN 10-50)
- **Security**: ZBFW, policies, CTS
- **Routing**: BGP, OMP settings
- **Monitoring**: Logging, SNMP, NTP

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Network Architecture Team | Initial release |

**Next Section**: [5.9 Configuration Groups & Profiles](5-9-configuration-groups.md)
