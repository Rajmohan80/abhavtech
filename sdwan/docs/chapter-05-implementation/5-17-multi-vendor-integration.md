# 5.17 Multi-Vendor Integration

## Document Information

| Field | Value |
|-------|-------|
| Document Title | Multi-Vendor Integration |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Abhavtech |
| Classification | Internal Use |
| Target Audience | Network Engineers, Integration Teams |

---

## Overview

This section provides comprehensive guidance for integrating third-party devices and services with the Abhavtech SD-WAN deployment. Multi-vendor integration ensures seamless connectivity with existing infrastructure, partner networks, and cloud service providers.

### Integration Architecture

```
MULTI-VENDOR INTEGRATION TOPOLOGY
==================================

                    +------------------+
                    |   Cloud/SaaS     |
                    |  AWS, Azure, M365|
                    +--------+---------+
                             |
                             | IPsec/GRE
                             |
+------------------+    +----+----+    +------------------+
|  Third-Party     |    |         |    |  Legacy          |
|  SD-WAN Vendor   +----+ SD-WAN  +----+  Devices         |
|  (Site-to-Site)  |    | Edge    |    |  (Non-SD-WAN)    |
+------------------+    +----+----+    +------------------+
                             |
            +----------------+----------------+
            |                |                |
     +------+------+  +------+------+  +------+------+
     | Security    |  |   MPLS      |  |  Partner    |
     | Vendors     |  |   Provider  |  |  Networks   |
     | (Firewall)  |  |   CE/PE     |  |  (B2B)      |
     +-------------+  +-------------+  +-------------+

Integration Types:
├── IPsec Site-to-Site (Third-party SD-WAN, Cloud)
├── GRE Tunnels (Legacy sites, MPLS underlay)
├── BGP Peering (Service providers, Partners)
├── Service Insertion (Security vendors)
└── API Integration (Cloud services, Orchestration)
```

---

## Third-Party SD-WAN Integration

### Site-to-Site IPsec Tunnels

**Scenario**: Connecting to partner/acquired company using different SD-WAN vendor.

```
THIRD-PARTY SD-WAN INTEGRATION
==============================

Abhavtech                                Partner (Velocloud/Fortinet/etc.)
+-------------+                          +-------------+
| WAN Edge    |====IPsec IKEv2====>     | Third-Party |
| C8300       |                          | SD-WAN Edge |
| Mumbai DC   |                          | Partner HQ  |
+-------------+                          +-------------+
    |                                          |
    | SD-Access                                | Partner LAN
    | Fabric                                   | Network
```

#### IKEv2 IPsec Configuration

```
!------------------------------------------------------------
! WAN Edge Configuration - Third-Party IPsec Tunnel
!------------------------------------------------------------

! Crypto Keyring
crypto ikev2 keyring PARTNER-KEYRING
  peer PARTNER-HQ
    address 203.0.113.50
    pre-shared-key local <strong_psk_key>
    pre-shared-key remote <strong_psk_key>

! IKEv2 Proposal
crypto ikev2 proposal PARTNER-PROPOSAL
  encryption aes-cbc-256
  integrity sha512
  group 20

! IKEv2 Policy
crypto ikev2 policy PARTNER-POLICY
  match address local 198.51.100.10
  proposal PARTNER-PROPOSAL

! IKEv2 Profile
crypto ikev2 profile PARTNER-PROFILE
  match identity remote address 203.0.113.50 255.255.255.255
  identity local address 198.51.100.10
  authentication remote pre-share
  authentication local pre-share
  keyring local PARTNER-KEYRING
  dpd 10 5 periodic

! IPsec Transform Set
crypto ipsec transform-set PARTNER-TRANSFORM esp-aes 256 esp-sha512-hmac
  mode tunnel

! IPsec Profile
crypto ipsec profile PARTNER-IPSEC-PROFILE
  set transform-set PARTNER-TRANSFORM
  set ikev2-profile PARTNER-PROFILE
  set pfs group20

! Tunnel Interface
interface Tunnel100
  description Partner-HQ-IPsec-Tunnel
  ip address 172.30.100.1 255.255.255.252
  tunnel source GigabitEthernet0/0/0
  tunnel mode ipsec ipv4
  tunnel destination 203.0.113.50
  tunnel protection ipsec profile PARTNER-IPSEC-PROFILE
  ip mtu 1400
  ip tcp adjust-mss 1360

! Routing
router bgp 65100
  neighbor 172.30.100.2 remote-as 65300
  neighbor 172.30.100.2 description Partner-eBGP
  neighbor 172.30.100.2 password <bgp_password>
  neighbor 172.30.100.2 ebgp-multihop 2
  address-family ipv4 unicast
    neighbor 172.30.100.2 activate
    neighbor 172.30.100.2 route-map PARTNER-IN in
    neighbor 172.30.100.2 route-map PARTNER-OUT out
    neighbor 172.30.100.2 prefix-list PARTNER-PREFIXES in
    neighbor 172.30.100.2 maximum-prefix 100 warning-only

! Route Maps
route-map PARTNER-IN permit 10
  set local-preference 100
  set community 65100:300

route-map PARTNER-OUT permit 10
  match ip address prefix-list ADVERTISE-TO-PARTNER

! Prefix Lists
ip prefix-list PARTNER-PREFIXES seq 10 permit 192.168.0.0/16 le 24
ip prefix-list PARTNER-PREFIXES seq 20 permit 172.16.0.0/12 le 24
ip prefix-list ADVERTISE-TO-PARTNER seq 10 permit 10.10.0.0/16 le 24
ip prefix-list ADVERTISE-TO-PARTNER seq 20 permit 10.20.0.0/16 le 24
```

#### SD-WAN Manager Third-Party Configuration Template

```yaml
# Third-Party IPsec Feature Template
name: "Feature-ThirdParty-IPsec"
description: "IPsec tunnel to third-party SD-WAN"
device_type: ["vedge-C8000V", "vedge-C8300-1N1S-6T", "vedge-C8300-2N2S-6T"]

ipsec:
  tunnel:
    - tunnel_interface: "Tunnel{{thirdparty_tunnel_id}}"
      tunnel_source: "GigabitEthernet0/0/0"
      tunnel_destination: "{{partner_public_ip}}"
      tunnel_mode: "ipsec ipv4"
      
      ikev2:
        profile: "PARTNER-PROFILE"
        proposal:
          encryption: "aes-cbc-256"
          integrity: "sha512"
          dh_group: "20"
        keyring:
          peer_address: "{{partner_public_ip}}"
          pre_shared_key: "{{encrypted_psk}}"
        dpd:
          interval: 10
          retry: 5
          action: "periodic"
      
      ipsec:
        transform_set: "esp-aes-256 esp-sha512-hmac"
        mode: "tunnel"
        pfs: "group20"
      
      ip_config:
        address: "{{tunnel_local_ip}}"
        mask: "255.255.255.252"
        mtu: 1400
        tcp_mss: 1360

bgp:
  neighbor:
    - address: "{{tunnel_remote_ip}}"
      remote_as: "{{partner_asn}}"
      description: "Partner-eBGP-Peer"
      password: "{{bgp_password}}"
      ebgp_multihop: 2
      
variables:
  thirdparty_tunnel_id:
    type: "integer"
    range: "100-199"
  partner_public_ip:
    type: "ipv4"
  encrypted_psk:
    type: "passphrase"
  tunnel_local_ip:
    type: "ipv4"
  tunnel_remote_ip:
    type: "ipv4"
  partner_asn:
    type: "integer"
    range: "1-65535"
  bgp_password:
    type: "passphrase"
```

---

## Legacy Device Integration

### Non-SD-WAN Site Connectivity

**Scenario**: Connecting legacy routers at acquired offices before SD-WAN migration.

```
LEGACY SITE INTEGRATION
=======================

+-----------------+        IPsec/GRE        +----------------+
| SD-WAN Fabric   |========================>| Legacy Router  |
| Mumbai DC       |                         | (ISR 4331)     |
+-----------------+                         +----------------+
      |                                            |
      | OMP Routes                                 | Static/OSPF
      |                                            |
+-----+-----+                               +------+------+
| SD-WAN    |                               | Legacy LAN  |
| Overlay   |                               | 192.168.x.x |
+-----------+                               +-------------+

Methods:
1. IPsec Tunnel (Internet transport)
2. GRE over IPsec (Multi-protocol support)
3. DMVPN spoke (Existing DMVPN infrastructure)
```

#### GRE over IPsec Configuration

```
!------------------------------------------------------------
! SD-WAN WAN Edge - Legacy Site GRE/IPsec
!------------------------------------------------------------

! Crypto Configuration
crypto ikev2 keyring LEGACY-KEYRING
  peer LEGACY-SITE-01
    address 203.0.113.100
    pre-shared-key <legacy_psk>

crypto ikev2 profile LEGACY-IKEv2
  match identity remote address 203.0.113.100 255.255.255.255
  authentication remote pre-share
  authentication local pre-share
  keyring local LEGACY-KEYRING

crypto ipsec transform-set LEGACY-TRANSFORM esp-aes 256 esp-sha256-hmac
  mode transport

crypto ipsec profile LEGACY-IPSEC
  set transform-set LEGACY-TRANSFORM
  set ikev2-profile LEGACY-IKEv2

! GRE Tunnel over IPsec
interface Tunnel200
  description Legacy-Site-01-GRE-over-IPsec
  ip address 172.30.200.1 255.255.255.252
  ip mtu 1400
  ip tcp adjust-mss 1360
  tunnel source GigabitEthernet0/0/0
  tunnel destination 203.0.113.100
  tunnel mode gre ip
  tunnel protection ipsec profile LEGACY-IPSEC
  keepalive 10 3

! Routing to Legacy Site
ip route 192.168.10.0 255.255.255.0 Tunnel200

! Or use OSPF for dynamic routing
router ospf 100
  network 172.30.200.0 0.0.0.3 area 0
  redistribute omp subnets route-map OMP-TO-LEGACY

route-map OMP-TO-LEGACY permit 10
  match ip address prefix-list LEGACY-ALLOWED
  set metric 100
  set metric-type type-1

ip prefix-list LEGACY-ALLOWED seq 10 permit 10.0.0.0/8 le 24

!------------------------------------------------------------
! Legacy ISR 4331 Configuration
!------------------------------------------------------------

crypto ikev2 keyring SDWAN-KEYRING
  peer SDWAN-HUB
    address 198.51.100.10
    pre-shared-key <legacy_psk>

crypto ikev2 profile SDWAN-IKEv2
  match identity remote address 198.51.100.10 255.255.255.255
  authentication remote pre-share
  authentication local pre-share
  keyring local SDWAN-KEYRING

crypto ipsec transform-set SDWAN-TRANSFORM esp-aes 256 esp-sha256-hmac
  mode transport

crypto ipsec profile SDWAN-IPSEC
  set transform-set SDWAN-TRANSFORM
  set ikev2-profile SDWAN-IKEv2

interface Tunnel200
  description To-SD-WAN-Hub
  ip address 172.30.200.2 255.255.255.252
  ip mtu 1400
  tunnel source GigabitEthernet0/0/1
  tunnel destination 198.51.100.10
  tunnel mode gre ip
  tunnel protection ipsec profile SDWAN-IPSEC

router ospf 100
  network 172.30.200.0 0.0.0.3 area 0
  network 192.168.10.0 0.0.0.255 area 0
```

### DMVPN Integration

**Scenario**: Integrating existing DMVPN infrastructure with SD-WAN.

```
DMVPN HUB INTEGRATION
=====================

                  +------------------+
                  |   SD-WAN WAN     |
                  |   Edge (Hub)     |
                  +--------+---------+
                           |
              DMVPN Hub    | Tunnel0 (mGRE)
              NHRP NHS     |
                           |
         +-----------------+-----------------+
         |                 |                 |
   +-----+-----+     +-----+-----+     +-----+-----+
   | DMVPN     |     | DMVPN     |     | DMVPN     |
   | Spoke 1   |     | Spoke 2   |     | Spoke 3   |
   | (Legacy)  |     | (Legacy)  |     | (Legacy)  |
   +-----------+     +-----------+     +-----------+

Transition Strategy:
1. SD-WAN WAN Edge becomes DMVPN hub
2. Existing spokes connect without changes
3. Migrate spokes to SD-WAN over time
4. Decommission DMVPN when migration complete
```

```
!------------------------------------------------------------
! SD-WAN WAN Edge as DMVPN Hub
!------------------------------------------------------------

! DMVPN Hub Configuration
interface Tunnel0
  description DMVPN-Hub-Integration
  ip address 172.29.0.1 255.255.0.0
  ip mtu 1400
  ip tcp adjust-mss 1360
  ip nhrp network-id 100
  ip nhrp map multicast dynamic
  ip nhrp authentication DMVPNKEY
  ip nhrp redirect
  tunnel source GigabitEthernet0/0/0
  tunnel mode gre multipoint
  tunnel key 100
  tunnel protection ipsec profile DMVPN-IPSEC shared

! Crypto for DMVPN
crypto ikev2 keyring DMVPN-KEYRING
  peer DMVPN-SPOKES
    address 0.0.0.0 0.0.0.0
    pre-shared-key <dmvpn_key>

crypto ikev2 profile DMVPN-IKEv2
  match identity remote address 0.0.0.0 0.0.0.0
  authentication remote pre-share
  authentication local pre-share
  keyring local DMVPN-KEYRING

crypto ipsec transform-set DMVPN-TS esp-aes 256 esp-sha256-hmac
  mode transport

crypto ipsec profile DMVPN-IPSEC
  set transform-set DMVPN-TS
  set ikev2-profile DMVPN-IKEv2

! EIGRP for DMVPN (existing protocol)
router eigrp DMVPN-LEGACY
  address-family ipv4 autonomous-system 100
    network 172.29.0.0 0.0.255.255
    af-interface Tunnel0
      no split-horizon
      summary-address 10.0.0.0 255.0.0.0
    exit-af-interface
    topology base
      redistribute omp route-map OMP-TO-DMVPN
    exit-af-topology
  exit-address-family

route-map OMP-TO-DMVPN permit 10
  set metric 10000 100 255 1 1500
```

---

## Cloud Service Integration

### AWS Transit Gateway Integration

```
AWS TGW INTEGRATION
===================

            +------------------------+
            |    AWS Transit Gateway |
            |    (TGW-xxx)          |
            +----------+-------------+
                       |
          VPN Connection (2 tunnels)
          BGP over IPsec
                       |
            +----------+-------------+
            |    SD-WAN WAN Edge    |
            |    Mumbai DC          |
            +------------------------+

AWS Side:
- Transit Gateway with SD-WAN attachment
- Customer Gateway (CGW) pointing to WAN Edge
- VPN Connection with BGP

SD-WAN Side:
- IPsec tunnels to AWS TGW endpoints
- BGP peering over tunnels
- Route advertisement to SD-WAN overlay
```

```
!------------------------------------------------------------
! AWS Transit Gateway IPsec Configuration
!------------------------------------------------------------

! AWS Tunnel 1
crypto ikev2 keyring AWS-TGW-KEYRING
  peer AWS-TGW-TUNNEL1
    address 52.xx.xx.xx
    pre-shared-key <aws_psk_tunnel1>
  peer AWS-TGW-TUNNEL2
    address 52.yy.yy.yy
    pre-shared-key <aws_psk_tunnel2>

crypto ikev2 proposal AWS-IKEv2-PROPOSAL
  encryption aes-cbc-256
  integrity sha256
  group 14

crypto ikev2 policy AWS-IKEv2-POLICY
  proposal AWS-IKEv2-PROPOSAL

crypto ikev2 profile AWS-TGW-PROFILE-1
  match identity remote address 52.xx.xx.xx 255.255.255.255
  authentication remote pre-share
  authentication local pre-share
  keyring local AWS-TGW-KEYRING
  dpd 10 3 periodic

crypto ikev2 profile AWS-TGW-PROFILE-2
  match identity remote address 52.yy.yy.yy 255.255.255.255
  authentication remote pre-share
  authentication local pre-share
  keyring local AWS-TGW-KEYRING
  dpd 10 3 periodic

crypto ipsec transform-set AWS-TS esp-aes 256 esp-sha256-hmac
  mode tunnel

crypto ipsec profile AWS-IPSEC-1
  set transform-set AWS-TS
  set ikev2-profile AWS-TGW-PROFILE-1
  set pfs group14

crypto ipsec profile AWS-IPSEC-2
  set transform-set AWS-TS
  set ikev2-profile AWS-TGW-PROFILE-2
  set pfs group14

! Tunnel Interfaces
interface Tunnel301
  description AWS-TGW-Tunnel-1
  ip address 169.254.10.2 255.255.255.252
  tunnel source GigabitEthernet0/0/0
  tunnel mode ipsec ipv4
  tunnel destination 52.xx.xx.xx
  tunnel protection ipsec profile AWS-IPSEC-1
  ip tcp adjust-mss 1379

interface Tunnel302
  description AWS-TGW-Tunnel-2
  ip address 169.254.20.2 255.255.255.252
  tunnel source GigabitEthernet0/0/0
  tunnel mode ipsec ipv4
  tunnel destination 52.yy.yy.yy
  tunnel protection ipsec profile AWS-IPSEC-2
  ip tcp adjust-mss 1379

! BGP Configuration
router bgp 65100
  neighbor 169.254.10.1 remote-as 64512
  neighbor 169.254.10.1 description AWS-TGW-BGP-1
  neighbor 169.254.10.1 timers 10 30
  neighbor 169.254.20.1 remote-as 64512
  neighbor 169.254.20.1 description AWS-TGW-BGP-2
  neighbor 169.254.20.1 timers 10 30
  
  address-family ipv4 unicast
    neighbor 169.254.10.1 activate
    neighbor 169.254.10.1 soft-reconfiguration inbound
    neighbor 169.254.20.1 activate
    neighbor 169.254.20.1 soft-reconfiguration inbound
    network 10.10.0.0 mask 255.255.0.0
    network 10.20.0.0 mask 255.255.0.0
    maximum-paths 2
```

### Azure vWAN Integration

```
!------------------------------------------------------------
! Azure Virtual WAN IPsec Configuration
!------------------------------------------------------------

! Azure vWAN typically uses IKEv2 with certificate or PSK

crypto ikev2 keyring AZURE-VWAN-KEYRING
  peer AZURE-VWAN-GATEWAY
    address 20.xx.xx.xx
    pre-shared-key <azure_psk>

crypto ikev2 profile AZURE-VWAN-PROFILE
  match identity remote address 20.xx.xx.xx 255.255.255.255
  authentication remote pre-share
  authentication local pre-share
  keyring local AZURE-VWAN-KEYRING
  dpd 10 3 periodic

crypto ipsec transform-set AZURE-TS esp-gcm 256
  mode tunnel

crypto ipsec profile AZURE-IPSEC
  set transform-set AZURE-TS
  set ikev2-profile AZURE-VWAN-PROFILE
  set pfs group14

interface Tunnel400
  description Azure-vWAN-Connection
  ip address 172.31.0.2 255.255.255.252
  tunnel source GigabitEthernet0/0/0
  tunnel mode ipsec ipv4
  tunnel destination 20.xx.xx.xx
  tunnel protection ipsec profile AZURE-IPSEC

! BGP for Azure
router bgp 65100
  neighbor 172.31.0.1 remote-as 65515
  neighbor 172.31.0.1 description Azure-vWAN-BGP
  neighbor 172.31.0.1 ebgp-multihop 5
  
  address-family ipv4 unicast
    neighbor 172.31.0.1 activate
    neighbor 172.31.0.1 route-map AZURE-OUT out
    neighbor 172.31.0.1 route-map AZURE-IN in

route-map AZURE-OUT permit 10
  match ip address prefix-list ON-PREM-ROUTES
  set as-path prepend 65100 65100

route-map AZURE-IN permit 10
  set local-preference 100
```

---

## Service Provider Integration

### MPLS CE-PE Coexistence

**Scenario**: Running SD-WAN parallel with existing MPLS during migration.

```
MPLS COEXISTENCE ARCHITECTURE
=============================

                    MPLS Provider Cloud
                    +------------------+
                    |   P Routers      |
                    |   (Provider)     |
                    +--------+---------+
                             |
          +-----------------+-----------------+
          |                                   |
    +-----+-----+                       +-----+-----+
    |   PE      |                       |    PE     |
    | Provider  |                       |  Provider |
    +-----+-----+                       +-----+-----+
          |                                   |
    CE Interface                        CE Interface
          |                                   |
    +-----+-----+                       +-----+-----+
    | SD-Access |                       | SD-Access |
    |  Border   |                       |  Border   |
    |  Node     |                       |  Node     |
    +-----+-----+                       +-----+-----+
          |                                   |
    Handoff Link                        Handoff Link
          |                                   |
    +-----+-----+                       +-----+-----+
    |  SD-WAN   |                       |  SD-WAN   |
    | WAN Edge  |=======SD-WAN=========>| WAN Edge  |
    | Mumbai    |       Overlay         | Chennai   |
    +-----------+                       +-----------+

Traffic Flow Options:
1. SD-WAN Primary, MPLS Backup (recommended)
2. Load balance between SD-WAN and MPLS
3. Application-based steering (SaaS via SD-WAN, legacy via MPLS)
```

```
!------------------------------------------------------------
! SD-Access Border - MPLS and SD-WAN Coexistence
!------------------------------------------------------------

! MPLS CE Interface (existing)
interface TenGigabitEthernet1/0/2
  description MPLS-PE-Connection
  no switchport
  vrf forwarding Corporate-Data
  ip address 10.1.1.2 255.255.255.252
  
! BGP to MPLS PE (lower preference during migration)
router bgp 65200
  address-family ipv4 vrf Corporate-Data
    ! MPLS PE Neighbor
    neighbor 10.1.1.1 remote-as 65000
    neighbor 10.1.1.1 description MPLS-PE-eBGP
    neighbor 10.1.1.1 activate
    neighbor 10.1.1.1 route-map MPLS-BACKUP in
    
    ! SD-WAN WAN Edge Neighbor (higher preference)
    neighbor 10.100.100.1 remote-as 65100
    neighbor 10.100.100.1 description SD-WAN-Edge-eBGP
    neighbor 10.100.100.1 activate
    neighbor 10.100.100.1 route-map SDWAN-PREFER in

! Route Maps for Path Selection
route-map MPLS-BACKUP permit 10
  set local-preference 50
  set community 65200:50

route-map SDWAN-PREFER permit 10
  set local-preference 200
  set community 65200:200

! During cutover - swap preferences
! MPLS becomes preferred
route-map MPLS-PREFER permit 10
  set local-preference 200
  
route-map SDWAN-BACKUP permit 10
  set local-preference 50
```

---

## Security Vendor Integration

### Service Insertion for Firewalls

**Scenario**: Inserting Palo Alto or Fortinet firewalls into SD-WAN traffic path.

```
FIREWALL SERVICE INSERTION
==========================

+-----------+    +-----------+    +-----------+
| SD-WAN    |--->| Firewall  |--->| SD-WAN    |
| Ingress   |    | (Service  |    | Egress    |
| Interface |    |  Chain)   |    | Interface |
+-----------+    +-----------+    +-----------+

Service Chain Flow:
Internet -> WAN Edge VPN 0 -> Service VPN -> Firewall -> Internal
```

```
!------------------------------------------------------------
! SD-WAN Service Insertion - Firewall
!------------------------------------------------------------

! Service VPN Configuration with Service Insertion
! VPN 5 - Service Insertion VPN

! Configure Service Interface to Firewall
interface GigabitEthernet0/0/3
  description Firewall-Service-Interface
  no shutdown
  service-insertion

! Service Insertion Policy
policy
  service-insertion
    service-route SERVICE-FW
      vpn 10
        service-type FW
        address 10.5.5.10
        interface GigabitEthernet0/0/3

! Data Policy for Traffic Steering to Firewall
policy
  data-policy STEER-TO-FIREWALL
    vpn-list VPN-10-LIST
      sequence 10
        match
          destination-data-prefix-list INTERNET-BOUND
        action accept
          set
            service FW vpn 5
      sequence 20
        match
          source-data-prefix-list SENSITIVE-DATA
          destination-data-prefix-list BRANCH-NETWORKS
        action accept
          set
            service FW vpn 5

! Apply Policy
apply-policy
  site-list HUB-SITES
    data-policy STEER-TO-FIREWALL all
```

### Zscaler Integration (Cloud Security)

```
ZSCALER INTEGRATION
===================

Branch Sites                           Zscaler Cloud
+-----------+                         +-------------+
| WAN Edge  |===GRE/IPsec Tunnel====>| ZIA Node    |
| Branch    |                         | (Regional)  |
+-----------+                         +-------------+
     |
     | Internet Traffic
     | (SaaS, Web)
```

```
!------------------------------------------------------------
! Zscaler ZIA Integration - GRE Tunnel Method
!------------------------------------------------------------

! GRE Tunnel to Zscaler
interface Tunnel500
  description Zscaler-ZIA-GRE
  ip address negotiated
  tunnel source GigabitEthernet0/0/0
  tunnel destination 165.225.xx.xx
  tunnel mode gre ip
  ip mtu 1400

! Zscaler uses GRE with authentication header
! Authentication configured via Zscaler portal

! Policy-Based Routing to Zscaler
ip access-list extended INTERNET-TRAFFIC
  permit tcp any any eq 80
  permit tcp any any eq 443
  permit udp any any eq 53

route-map ZSCALER-PBR permit 10
  match ip address INTERNET-TRAFFIC
  set interface Tunnel500

interface GigabitEthernet0/0/2.10
  description Corporate-VLAN
  ip policy route-map ZSCALER-PBR

!------------------------------------------------------------
! Alternative: Zscaler IPsec Tunnel (Recommended)
!------------------------------------------------------------

crypto ikev2 keyring ZSCALER-KEYRING
  peer ZSCALER-PRIMARY
    address 165.225.xx.xx
    pre-shared-key <zscaler_psk>

crypto ikev2 profile ZSCALER-IKEv2
  match identity remote fqdn domain zscaler.net
  authentication remote pre-share
  authentication local pre-share
  keyring local ZSCALER-KEYRING

interface Tunnel501
  description Zscaler-ZIA-IPsec
  ip address negotiated
  tunnel source GigabitEthernet0/0/0
  tunnel mode ipsec ipv4
  tunnel destination 165.225.xx.xx
  tunnel protection ipsec profile ZSCALER-IPSEC
```

---

## API Integration

### Multi-Vendor Orchestration

```python
#!/usr/bin/env python3
"""
Multi-Vendor Integration API Framework
Orchestrates configuration across multiple vendor platforms
"""

import requests
import json
from abc import ABC, abstractmethod
from typing import Dict, List, Optional

class VendorAPI(ABC):
    """Abstract base class for vendor API integration"""
    
    @abstractmethod
    def authenticate(self) -> bool:
        pass
    
    @abstractmethod
    def get_devices(self) -> List[Dict]:
        pass
    
    @abstractmethod
    def get_tunnels(self) -> List[Dict]:
        pass
    
    @abstractmethod
    def create_tunnel(self, config: Dict) -> bool:
        pass

class CiscoSDWANAPI(VendorAPI):
    """Cisco SD-WAN Manager API"""
    
    def __init__(self, host: str, username: str, password: str):
        self.base_url = f"https://{host}:443"
        self.session = requests.Session()
        self.session.verify = False
        self.username = username
        self.password = password
    
    def authenticate(self) -> bool:
        auth_url = f"{self.base_url}/j_security_check"
        response = self.session.post(
            auth_url,
            data={"j_username": self.username, "j_password": self.password}
        )
        
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
            return True
        return False
    
    def get_devices(self) -> List[Dict]:
        url = f"{self.base_url}/dataservice/device"
        response = self.session.get(url)
        return response.json().get('data', [])
    
    def get_tunnels(self) -> List[Dict]:
        url = f"{self.base_url}/dataservice/device/tunnel/statistics"
        response = self.session.get(url)
        return response.json().get('data', [])
    
    def create_tunnel(self, config: Dict) -> bool:
        # Create IPsec tunnel via template attachment
        url = f"{self.base_url}/dataservice/template/device/config/attachfeature"
        response = self.session.post(url, json=config)
        return response.status_code == 200

class AWSTransitGatewayAPI(VendorAPI):
    """AWS Transit Gateway API via boto3"""
    
    def __init__(self, region: str, access_key: str, secret_key: str):
        import boto3
        self.ec2 = boto3.client(
            'ec2',
            region_name=region,
            aws_access_key_id=access_key,
            aws_secret_access_key=secret_key
        )
    
    def authenticate(self) -> bool:
        try:
            self.ec2.describe_transit_gateways()
            return True
        except Exception:
            return False
    
    def get_devices(self) -> List[Dict]:
        response = self.ec2.describe_transit_gateways()
        return response.get('TransitGateways', [])
    
    def get_tunnels(self) -> List[Dict]:
        response = self.ec2.describe_vpn_connections()
        return response.get('VpnConnections', [])
    
    def create_tunnel(self, config: Dict) -> bool:
        try:
            # Create Customer Gateway
            cgw = self.ec2.create_customer_gateway(
                Type='ipsec.1',
                PublicIp=config['customer_gateway_ip'],
                BgpAsn=config['bgp_asn']
            )
            
            # Create VPN Connection
            vpn = self.ec2.create_vpn_connection(
                Type='ipsec.1',
                CustomerGatewayId=cgw['CustomerGateway']['CustomerGatewayId'],
                TransitGatewayId=config['transit_gateway_id'],
                Options={
                    'EnableAcceleration': True,
                    'TunnelInsideIpVersion': 'ipv4'
                }
            )
            return True
        except Exception as e:
            print(f"Error creating AWS tunnel: {e}")
            return False

class MultiVendorOrchestrator:
    """Orchestrates operations across multiple vendor APIs"""
    
    def __init__(self):
        self.vendors: Dict[str, VendorAPI] = {}
    
    def register_vendor(self, name: str, api: VendorAPI):
        """Register a vendor API"""
        if api.authenticate():
            self.vendors[name] = api
            print(f"✓ Registered vendor: {name}")
        else:
            print(f"✗ Failed to authenticate: {name}")
    
    def get_all_tunnels(self) -> Dict[str, List[Dict]]:
        """Get tunnels from all registered vendors"""
        all_tunnels = {}
        for name, api in self.vendors.items():
            all_tunnels[name] = api.get_tunnels()
        return all_tunnels
    
    def verify_connectivity(self) -> Dict[str, bool]:
        """Verify connectivity to all vendors"""
        status = {}
        for name, api in self.vendors.items():
            try:
                devices = api.get_devices()
                status[name] = len(devices) > 0
            except Exception:
                status[name] = False
        return status
    
    def create_cross_vendor_tunnel(self, 
                                   source_vendor: str, 
                                   dest_vendor: str,
                                   config: Dict) -> bool:
        """Create tunnel between two different vendor platforms"""
        
        # This would contain logic to:
        # 1. Get public IPs from both sides
        # 2. Generate PSK
        # 3. Configure both ends
        # 4. Verify tunnel establishment
        
        print(f"Creating tunnel: {source_vendor} <-> {dest_vendor}")
        
        source_api = self.vendors.get(source_vendor)
        dest_api = self.vendors.get(dest_vendor)
        
        if not source_api or not dest_api:
            return False
        
        # Configure source side
        source_config = {
            'tunnel_destination': config['dest_public_ip'],
            'psk': config['psk'],
            'bgp_peer': config['dest_bgp_ip']
        }
        source_result = source_api.create_tunnel(source_config)
        
        # Configure destination side
        dest_config = {
            'customer_gateway_ip': config['source_public_ip'],
            'bgp_asn': config['source_bgp_asn'],
            'transit_gateway_id': config.get('tgw_id')
        }
        dest_result = dest_api.create_tunnel(dest_config)
        
        return source_result and dest_result

def main():
    """Example multi-vendor integration"""
    
    orchestrator = MultiVendorOrchestrator()
    
    # Register Cisco SD-WAN
    cisco_api = CiscoSDWANAPI(
        host="10.255.0.10",
        username="admin",
        password="<password>"
    )
    orchestrator.register_vendor("cisco_sdwan", cisco_api)
    
    # Register AWS
    aws_api = AWSTransitGatewayAPI(
        region="ap-south-1",
        access_key="<access_key>",
        secret_key="<secret_key>"
    )
    orchestrator.register_vendor("aws", aws_api)
    
    # Verify connectivity
    print("\nConnectivity Status:")
    status = orchestrator.verify_connectivity()
    for vendor, connected in status.items():
        print(f"  {vendor}: {'✓' if connected else '✗'}")
    
    # Get all tunnels
    print("\nTunnel Summary:")
    tunnels = orchestrator.get_all_tunnels()
    for vendor, tunnel_list in tunnels.items():
        print(f"  {vendor}: {len(tunnel_list)} tunnels")

if __name__ == "__main__":
    main()
```

---

## Verification and Monitoring

### Multi-Vendor Tunnel Monitoring

```
MULTI-VENDOR TUNNEL VERIFICATION
=================================

! Verify Third-Party IPsec Tunnel
show crypto ikev2 sa detail
show crypto ipsec sa peer 203.0.113.50
show interface Tunnel100
show ip route | include 172.30.100

! Verify BGP Peering
show bgp ipv4 unicast summary
show bgp ipv4 unicast neighbors 172.30.100.2
show bgp ipv4 unicast neighbors 172.30.100.2 routes
show bgp ipv4 unicast neighbors 172.30.100.2 advertised-routes

! Verify AWS TGW Tunnels
show crypto ikev2 sa | include 52.xx
show interface Tunnel301 | include packets
show interface Tunnel302 | include packets
show bgp ipv4 unicast summary | include 169.254

! Verify Legacy Site Connectivity
show interface Tunnel200 | include up|down
show crypto session peer 203.0.113.100
ping 192.168.10.1 source 10.10.0.1

! Comprehensive Check Script
show ip bgp vpnv4 all summary
show crypto session brief
show dmvpn | include Interface|Peer
```

### Integration Health Dashboard

```python
#!/usr/bin/env python3
"""
Multi-Vendor Integration Health Monitor
"""

import json
from datetime import datetime

def check_integration_health():
    """Check health of all multi-vendor integrations"""
    
    health_report = {
        'timestamp': datetime.now().isoformat(),
        'integrations': []
    }
    
    integrations = [
        {
            'name': 'Partner SD-WAN (Tunnel100)',
            'type': 'ipsec',
            'peer': '203.0.113.50',
            'status': check_tunnel_status('Tunnel100'),
            'bgp_state': check_bgp_neighbor('172.30.100.2')
        },
        {
            'name': 'AWS Transit Gateway',
            'type': 'aws_tgw',
            'tunnels': ['Tunnel301', 'Tunnel302'],
            'status': check_aws_tunnels(),
            'bgp_peers': ['169.254.10.1', '169.254.20.1']
        },
        {
            'name': 'Legacy DMVPN Sites',
            'type': 'dmvpn',
            'hub_interface': 'Tunnel0',
            'spoke_count': get_dmvpn_spoke_count(),
            'status': check_dmvpn_health()
        },
        {
            'name': 'Zscaler ZIA',
            'type': 'cloud_security',
            'tunnel': 'Tunnel501',
            'status': check_zscaler_tunnel()
        }
    ]
    
    health_report['integrations'] = integrations
    
    # Calculate overall health
    healthy_count = sum(1 for i in integrations if i['status'] == 'up')
    health_report['overall_health'] = f"{healthy_count}/{len(integrations)}"
    
    return health_report

def check_tunnel_status(tunnel_name):
    # Implementation would SSH to device and check tunnel
    return 'up'

def check_bgp_neighbor(peer_ip):
    # Implementation would check BGP state
    return 'established'

def check_aws_tunnels():
    # Implementation would check both AWS tunnels
    return 'up'

def get_dmvpn_spoke_count():
    # Implementation would count NHRP entries
    return 15

def check_dmvpn_health():
    return 'up'

def check_zscaler_tunnel():
    return 'up'

if __name__ == "__main__":
    report = check_integration_health()
    print(json.dumps(report, indent=2))
```

---

## Troubleshooting Multi-Vendor Issues

### Common Integration Issues

| Issue | Symptoms | Resolution |
|-------|----------|------------|
| IKEv2 Mismatch | Phase 1 fails | Verify encryption/integrity/DH group match |
| PSK Mismatch | Authentication failure | Confirm PSK identical on both ends |
| NAT-T Issues | Tunnel flapping | Enable NAT-T (UDP 4500) |
| MTU Problems | Large packet drops | Adjust MTU/MSS on tunnel interfaces |
| BGP Not Establishing | No routes learned | Check AS numbers, peer IPs, route-maps |
| Asymmetric Routing | One-way traffic | Verify return path routing |

### Debug Commands

```
! IKEv2 Debugging
debug crypto ikev2 packet
debug crypto ikev2 internal
debug crypto ikev2 error

! IPsec Debugging
debug crypto ipsec
debug crypto engine packet all

! BGP Debugging
debug bgp ipv4 unicast updates
debug bgp ipv4 unicast events

! GRE/DMVPN Debugging
debug tunnel
debug nhrp packet
debug dmvpn all
```

---

## Related Documentation

| Document | Description | Location |
|----------|-------------|----------|
| Cloud OnRamp Design | Cloud integration architecture | Section 2.9 |
| SD-Access Handoff | Fabric integration details | Section 5.12 |
| Security Architecture | Security integration | Chapter 3 |
| Troubleshooting | Issue resolution | Chapter 6.8 |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech | Initial release |

---

*This document is part of the SD-WAN Implementation & Deployment documentation series for Abhavtech.com*
