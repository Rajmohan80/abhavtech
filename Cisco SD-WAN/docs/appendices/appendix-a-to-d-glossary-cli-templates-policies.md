# Appendix A: Glossary & Terminology

## A.1 SD-WAN Core Terms

| Term | Definition |
|------|------------|
| **AAR** | Application-Aware Routing - Dynamic path selection based on application SLA requirements |
| **BFD** | Bidirectional Forwarding Detection - Fast failure detection protocol for tunnels |
| **CFLOWD** | Cisco Flow Data - NetFlow-based traffic analysis |
| **Control Plane** | Management and signaling traffic between controllers and WAN Edges |
| **Data Plane** | User traffic forwarded through IPsec tunnels between WAN Edges |
| **DIA** | Direct Internet Access - Local internet breakout at branch sites |
| **DTLS** | Datagram Transport Layer Security - Encryption for control plane |
| **IPsec** | Internet Protocol Security - Encryption for data plane tunnels |
| **LISP** | Locator/Identifier Separation Protocol - Used in SD-Access fabric |
| **MRF** | Multi-Region Fabric - Hierarchical SD-WAN for large deployments |
| **OMP** | Overlay Management Protocol - Proprietary routing protocol for SD-WAN |
| **SLA** | Service Level Agreement - Performance requirements (latency, loss, jitter) |
| **TLOC** | Transport Location - Unique identifier for WAN Edge transport interface |
| **VPN** | Virtual Private Network - Logical segmentation in SD-WAN |
| **VRRP** | Virtual Router Redundancy Protocol - HA for WAN Edge pairs |
| **ZTP** | Zero Touch Provisioning - Automated device onboarding |

## A.2 Controller Terms

| Term | Definition |
|------|------------|
| **SD-WAN Manager** | Central management platform (formerly vManage) |
| **SD-WAN Controller** | Policy distribution and route reflection (formerly vSmart) |
| **SD-WAN Validator** | Authentication and orchestration (formerly vBond) |
| **WAN Edge** | Edge router running SD-WAN (C8300, C8500, etc.) |

## A.3 Policy Terms

| Term | Definition |
|------|------------|
| **Centralized Policy** | Policies pushed from SD-WAN Controller to WAN Edges |
| **Localized Policy** | Policies configured directly on WAN Edge |
| **Control Policy** | Affects OMP route advertisement and selection |
| **Data Policy** | Affects traffic forwarding decisions |
| **App-Route Policy** | SLA-based path selection for applications |
| **VPN Membership** | Which sites can communicate within a VPN |

## A.4 SD-Access Integration Terms

| Term | Definition |
|------|------------|
| **Fabric Border** | SD-Access device connecting to external networks |
| **Fabric Handoff** | L3 connection between SD-Access and SD-WAN |
| **VN** | Virtual Network - SD-Access segmentation (maps to VRF) |
| **SGT** | Scalable Group Tag - TrustSec security classification |
| **CTS** | Cisco TrustSec - Security group tagging framework |
| **Catalyst Center** | SD-Access management platform (formerly DNA Center) |

---

## Appendix B: CLI Command Reference

## B.1 Show Commands - Control Plane

```
! Controller connectivity
show sdwan control connections
show sdwan control local-properties
show sdwan control connection-history

! OMP status
show sdwan omp summary
show sdwan omp peers
show sdwan omp routes
show sdwan omp tlocs
show sdwan omp services

! Certificate status
show sdwan certificate installed
show sdwan certificate root-ca-cert
show sdwan certificate serial
```

## B.2 Show Commands - Data Plane

```
! BFD tunnels
show sdwan bfd sessions
show sdwan bfd summary
show sdwan bfd history

! IPsec tunnels
show sdwan ipsec inbound-connections
show sdwan ipsec outbound-connections
show sdwan ipsec local-sa

! Interface status
show sdwan interface
show interface summary
show ip interface brief
```

## B.3 Show Commands - Routing

```
! Routing tables
show ip route vrf [vrf-name]
show ip bgp vpnv4 all summary
show sdwan omp routes vpn [vpn-id]

! Policy routing
show sdwan policy from-vsmart
show sdwan policy access-list
show sdwan policy data-policy
show sdwan policy app-route-policy
```

## B.4 Show Commands - Application

```
! Application recognition
show sdwan app-fwd cflowd flows
show sdwan app-route stats
show sdwan app-route sla-class

! DPI statistics
show sdwan dpi flows
show sdwan dpi statistics
show sdwan dpi summary
```

## B.5 Show Commands - System

```
! System status
show sdwan system status
show sdwan running-config
show version
show inventory

! Resource utilization
show processes cpu sorted
show processes memory sorted
show platform hardware qfp active datapath utilization
```

## B.6 Debug Commands

```
! Enable debugging (use with caution)
debug sdwan omp events
debug sdwan bfd events
debug sdwan control connection
debug sdwan ipsec

! Packet tracing
debug platform condition ipv4 [source] [dest]
debug platform packet-trace packet 1024 fia-trace
show platform packet-trace statistics
```

## B.7 Configuration Commands

```
! Basic system configuration
system
 system-ip [ip-address]
 site-id [site-id]
 organization-name [org-name]
 vbond [vbond-ip]

! Transport interface
interface GigabitEthernet0/0/0
 ip address dhcp
 tunnel-interface
  encapsulation ipsec
  color biz-internet
  no allow-service all
  allow-service dhcp
  allow-service dns
  allow-service icmp
  allow-service sshd
  allow-service netconf
  allow-service ntp
  allow-service stun

! Service VPN interface
interface GigabitEthernet0/0/1
 vrf forwarding 10
 ip address 10.10.1.1 255.255.255.0
 no shutdown
```

---

## Appendix C: Template Library

## C.1 System Templates

### Branch System Template

```yaml
template_name: "ABVT-Branch-System"
template_type: "cisco_system"
device_types:
  - "vedge-C8300-2N2S-4T"
  
parameters:
  hostname:
    type: "variable"
    variable_name: "system_hostname"
    
  system_ip:
    type: "variable"
    variable_name: "system_ip"
    
  site_id:
    type: "variable"
    variable_name: "site_id"
    
  organization_name:
    type: "constant"
    value: "Abhavtech"
    
  console_baud_rate:
    type: "constant"
    value: "115200"
    
  max_omp_sessions:
    type: "constant"
    value: 2
    
  timezone:
    type: "constant"
    value: "Asia/Kolkata"
```

### Hub System Template

```yaml
template_name: "ABVT-Hub-System"
template_type: "cisco_system"
device_types:
  - "vedge-C8500-12X4QC"
  
parameters:
  hostname:
    type: "variable"
    variable_name: "system_hostname"
    
  system_ip:
    type: "variable"
    variable_name: "system_ip"
    
  site_id:
    type: "variable"
    variable_name: "site_id"
    
  max_omp_sessions:
    type: "constant"
    value: 4
    
  track_transport:
    type: "constant"
    value: true
    
  track_interface_tag:
    type: "constant"
    value: 1
```

## C.2 VPN Templates

### Transport VPN (VPN 0)

```yaml
template_name: "ABVT-VPN0-Transport"
template_type: "cisco_vpn"

parameters:
  vpn_id:
    value: 0
    
  name:
    value: "Transport"
    
  dns_primary:
    type: "variable"
    variable_name: "dns_primary"
    default: "10.100.1.5"
    
  dns_secondary:
    type: "variable"
    variable_name: "dns_secondary"
    default: "10.100.1.6"
```

### Employee VPN (VPN 10)

```yaml
template_name: "ABVT-VPN10-Employee"
template_type: "cisco_vpn"

parameters:
  vpn_id:
    value: 10
    
  name:
    value: "Employee"
    
  dns_primary:
    value: "10.100.1.5"
    
  ecmp_hash_key:
    value: "layer4"
    
  default_route:
    gateway: "vpn0"
```

## C.3 Interface Templates

### WAN Interface Template

```yaml
template_name: "ABVT-WAN-Interface"
template_type: "cisco_vpn_interface"

parameters:
  interface_name:
    type: "variable"
    variable_name: "wan_interface"
    
  ip_address:
    type: "variable"
    variable_name: "wan_ip"
    
  tunnel_interface:
    enabled: true
    
    color:
      type: "variable"
      variable_name: "wan_color"
      
    encapsulation:
      value: "ipsec"
      preference: 100
      weight: 1
      
    allowed_services:
      dhcp: true
      dns: true
      icmp: true
      sshd: true
      netconf: true
      ntp: true
      stun: true
      
    exclude_controller_group_list:
      type: "variable"
      variable_name: "exclude_controllers"
```

---

## Appendix D: Policy Examples

## D.1 Application-Aware Routing Policy

### SLA Class Definition

```yaml
sla_classes:
  voice_sla:
    name: "Voice-SLA"
    latency: 150
    loss: 1
    jitter: 30
    
  video_sla:
    name: "Video-SLA"
    latency: 200
    loss: 2
    jitter: 50
    
  business_critical_sla:
    name: "Business-Critical-SLA"
    latency: 300
    loss: 5
    jitter: 100
```

### App-Route Policy

```yaml
app_route_policy:
  name: "ABVT-AAR-Policy"
  
  sequences:
    - sequence_id: 10
      match:
        app_list: "voice-applications"
      action:
        sla_class: "Voice-SLA"
        preferred_color: "mpls"
        backup_color: "biz-internet"
        
    - sequence_id: 20
      match:
        app_list: "video-applications"
      action:
        sla_class: "Video-SLA"
        preferred_color: "mpls"
        
    - sequence_id: 30
      match:
        app_list: "business-critical"
      action:
        sla_class: "Business-Critical-SLA"
        
    - sequence_id: 1000
      match:
        any: true
      action:
        accept: true
```

## D.2 Data Policy Examples

### DIA Policy for SaaS

```yaml
data_policy:
  name: "ABVT-DIA-SaaS"
  description: "Direct Internet Access for SaaS applications"
  
  sequences:
    - sequence_id: 10
      match:
        app_list: "microsoft-365"
        source_vpn: 10
      action:
        nat_use_vpn0: true
        
    - sequence_id: 20
      match:
        app_list: "salesforce"
        source_vpn: 10
      action:
        nat_use_vpn0: true
        
    - sequence_id: 1000
      match:
        any: true
      action:
        accept: true
```

### Traffic Engineering Policy

```yaml
data_policy:
  name: "ABVT-Traffic-Engineering"
  
  sequences:
    - sequence_id: 10
      match:
        dscp: 46
        source_vpn: 10
      action:
        set_local_tloc_preference: 100
        set_tloc_color: "mpls"
        
    - sequence_id: 20
      match:
        dscp: 26
        source_vpn: 10
      action:
        set_local_tloc_preference: 80
```

## D.3 Control Policy Examples

### Hub and Spoke Topology

```yaml
control_policy:
  name: "ABVT-Hub-Spoke"
  description: "Route traffic through hub sites"
  
  sequences:
    - sequence_id: 10
      match:
        site_list: "branch-sites"
        vpn_list: "employee-vpn"
      action:
        set_service: "FW"
        service_tloc:
          ip: "10.10.1.1"
          color: "mpls"
          encap: "ipsec"
          
    - sequence_id: 1000
      match:
        any: true
      action:
        accept: true
```

### VPN Membership Policy

```yaml
control_policy:
  name: "ABVT-VPN-Membership"
  description: "Control VPN route exchange"
  
  sequences:
    - sequence_id: 10
      match:
        site_list: "india-sites"
        vpn_list: "guest-vpn"
      action:
        export_to: "india-sites-only"
        
    - sequence_id: 20
      match:
        site_list: "emea-sites"
        vpn_list: "guest-vpn"
      action:
        export_to: "emea-sites-only"
```

## D.4 QoS Policy

### QoS Map

```yaml
qos_policy:
  name: "ABVT-QoS-Map"
  
  queues:
    - queue: 0
      bandwidth: 30
      dscp_map: [46, 34]  # EF, AF41
      scheduling: "llq"
      description: "Voice/Video"
      
    - queue: 1
      bandwidth: 25
      dscp_map: [26, 28]  # AF31, AF32
      scheduling: "wrr"
      description: "Business Critical"
      
    - queue: 2
      bandwidth: 20
      dscp_map: [18, 20]  # AF21, AF22
      scheduling: "wrr"
      description: "Transactional"
      
    - queue: 3
      bandwidth: 15
      dscp_map: [10, 12]  # AF11, AF12
      scheduling: "wrr"
      description: "Bulk Data"
      
    - queue: 4
      bandwidth: 10
      dscp_map: [0]  # BE
      scheduling: "wrr"
      description: "Best Effort"
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
