# Appendix I: Vendor and Support Contacts

## I.1 Cisco Support

### TAC Contact Information

```yaml
cisco_tac:
  contract: "Cisco SmartNet"
  contract_number: "ABVT-SMARTNET-2025"
  coverage: "24x7x4"
  
  contact_methods:
    web: "https://mycase.cloudapps.cisco.com"
    phone:
      us: "1-800-553-2447"
      india: "1800-103-3211"
      emea: "+31-20-357-1504"
    email: "tac@cisco.com"
    
  severity_levels:
    severity_1:
      description: "Network down"
      response: "15 minutes"
      
    severity_2:
      description: "Severely degraded"
      response: "2 hours"
      
    severity_3:
      description: "Network impaired"
      response: "4 hours"
      
    severity_4:
      description: "Information request"
      response: "1 business day"
```

### Cisco Account Team

```yaml
cisco_account_team:
  account_manager:
    name: "[Account Manager Name]"
    email: "am@cisco.com"
    phone: "+1-xxx-xxx-xxxx"
    
  systems_engineer:
    name: "[SE Name]"
    email: "se@cisco.com"
    phone: "+1-xxx-xxx-xxxx"
    
  customer_success:
    name: "[CSM Name]"
    email: "csm@cisco.com"
```

## I.2 Service Provider Contacts

### MPLS Provider (Tata Communications)

```yaml
tata_communications:
  account_number: "ABVT-TATA-2024"
  support:
    noc_phone: "+91-22-xxxx-xxxx"
    noc_email: "noc@tatacommunications.com"
    portal: "https://enterprise.tatacommunications.com"
    
  account_manager:
    name: "[AM Name]"
    email: "am@tatacommunications.com"
    
  sla:
    availability: "99.95%"
    mttr: "4 hours"
```

### Internet Providers

```yaml
internet_providers:
  jio_business:
    regions: ["Mumbai", "Bangalore"]
    support: "+91-xxxx-xxxxxx"
    portal: "https://business.jio.com"
    
  act_fibernet:
    regions: ["Chennai", "Delhi"]
    support: "+91-xxxx-xxxxxx"
    portal: "https://www.actcorp.in/business"
    
  international:
    provider: "Regional providers"
    # Contact details per region
```

## I.3 Implementation Partner

### Cisco Partner

```yaml
implementation_partner:
  name: "[Partner Company Name]"
  tier: "Cisco Gold Partner"
  
  contacts:
    project_manager:
      name: "[PM Name]"
      email: "pm@partner.com"
      phone: "+91-xxxx-xxxxxx"
      
    technical_lead:
      name: "[Tech Lead Name]"
      email: "tech@partner.com"
      certifications: ["CCIE #xxxxx"]
      
  support:
    phone: "+91-xxxx-xxxxxx"
    email: "support@partner.com"
    hours: "24x7 for critical issues"
```

---

## Appendix J: Design Templates

## J.1 High-Level Design Template

### HLD Document Structure

```yaml
hld_template:
  sections:
    1_executive_summary:
      - "Project overview"
      - "Business objectives"
      - "Scope"
      
    2_current_state:
      - "Network topology"
      - "WAN infrastructure"
      - "Pain points"
      
    3_target_architecture:
      - "SD-WAN design"
      - "Controller architecture"
      - "WAN Edge deployment"
      - "Transport design"
      
    4_integration:
      - "SD-Access integration"
      - "Security integration"
      - "Cloud connectivity"
      
    5_migration_approach:
      - "Migration strategy"
      - "Site sequencing"
      - "Timeline"
      
    6_operations:
      - "Management model"
      - "Support structure"
      
    appendices:
      - "Site details"
      - "IP addressing"
      - "Bill of materials"
```

## J.2 Low-Level Design Template

### LLD Document Structure

```yaml
lld_template:
  sections:
    1_controller_design:
      - "vManage configuration"
      - "vSmart configuration"
      - "vBond configuration"
      
    2_template_design:
      - "Feature templates"
      - "Device templates"
      - "Variable mapping"
      
    3_policy_design:
      - "Control policies"
      - "Data policies"
      - "Application policies"
      
    4_site_designs:
      - "Per-site configuration"
      - "Interface assignments"
      - "Routing design"
      
    5_integration_design:
      - "SD-Access handoff"
      - "BGP configuration"
      - "Security policies"
```

## J.3 Site Design Template

### Site Design Document

```yaml
site_design_template:
  site_information:
    site_name: ""
    site_id: ""
    site_type: "[Hub|Branch]"
    address: ""
    
  hardware:
    wan_edge:
      model: ""
      quantity: ""
      
  connectivity:
    transports:
      - type: ""
        provider: ""
        bandwidth: ""
        ip_addressing: ""
        
  configuration:
    system_ip: ""
    vpns: []
    interfaces: []
    
  integration:
    sd_access: "[Yes|No]"
    fabric_border: ""
```

---

## Appendix K: Lab Environment Setup

## K.1 Lab Topology

### Lab Architecture

```
LAB TOPOLOGY
============

                    ┌─────────────┐
                    │   vBond     │
                    │ (Lab Cloud) │
                    └──────┬──────┘
                           │
         ┌─────────────────┼─────────────────┐
         │                 │                 │
    ┌────┴────┐      ┌─────┴─────┐     ┌────┴────┐
    │ vManage │      │  vSmart   │     │ vSmart  │
    │ (VM)    │      │  (VM) #1  │     │ (VM) #2 │
    └────┬────┘      └─────┬─────┘     └────┬────┘
         │                 │                 │
         └─────────────────┼─────────────────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
         ┌────┴────┐  ┌────┴────┐  ┌────┴────┐
         │Lab Hub  │  │Lab BR 1 │  │Lab BR 2 │
         │(CSRv)   │  │(CSRv)   │  │(CSRv)   │
         └─────────┘  └─────────┘  └─────────┘
```

## K.2 Lab Requirements

### Hardware/VM Requirements

```yaml
lab_requirements:
  vmanage:
    vcpu: 16
    memory: "32 GB"
    storage: "500 GB"
    
  vsmart:
    vcpu: 4
    memory: "8 GB"
    storage: "20 GB"
    
  vbond:
    vcpu: 2
    memory: "4 GB"
    storage: "20 GB"
    
  wan_edge_csrv:
    vcpu: 2
    memory: "4 GB"
    storage: "8 GB"
```

### Network Requirements

```yaml
lab_network:
  management:
    subnet: "192.168.100.0/24"
    gateway: "192.168.100.1"
    
  transport:
    vpn0_subnet: "10.0.0.0/24"
    internet_sim: "10.1.0.0/24"
    mpls_sim: "10.2.0.0/24"
    
  service:
    vpn10: "10.10.0.0/24"
    vpn20: "10.20.0.0/24"
```

## K.3 Lab Configuration

### Controller Deployment

```yaml
lab_deployment:
  vmanage:
    hostname: "lab-vmanage"
    system_ip: "1.1.1.1"
    vpn0_ip: "192.168.100.10"
    organization: "Abhavtech-Lab"
    
  vsmart_1:
    hostname: "lab-vsmart-1"
    system_ip: "2.2.2.1"
    vpn0_ip: "192.168.100.11"
    
  vsmart_2:
    hostname: "lab-vsmart-2"
    system_ip: "2.2.2.2"
    vpn0_ip: "192.168.100.12"
    
  vbond:
    hostname: "lab-vbond"
    system_ip: "3.3.3.1"
    vpn0_ip: "192.168.100.13"
```

### WAN Edge Deployment

```yaml
lab_wan_edges:
  hub:
    hostname: "lab-hub-01"
    system_ip: "10.10.1.1"
    site_id: 100
    vpn0_interfaces:
      - name: "GigabitEthernet1"
        ip: "10.1.0.1/24"
        color: "biz-internet"
      - name: "GigabitEthernet2"
        ip: "10.2.0.1/24"
        color: "mpls"
        
  branch_1:
    hostname: "lab-branch-01"
    system_ip: "10.10.2.1"
    site_id: 201
    
  branch_2:
    hostname: "lab-branch-02"
    system_ip: "10.10.3.1"
    site_id: 202
```

## K.4 Lab Test Cases

### Validation Tests

```yaml
lab_tests:
  basic_connectivity:
    - "Control connections to all controllers"
    - "BFD tunnels between all sites"
    - "OMP route exchange"
    
  failover:
    - "Primary tunnel failure"
    - "Controller failover"
    - "WAN Edge HA failover"
    
  policy:
    - "AAR path selection"
    - "QoS queuing"
    - "Data policy actions"
    
  integration:
    - "SD-Access BGP peering (if applicable)"
    - "SGT propagation"
```

---

## Appendix L: SD-Access Integration Quick Reference

## L.1 Integration Architecture

### Fabric Handoff Overview

```
SD-ACCESS + SD-WAN INTEGRATION
==============================

SD-Access Fabric                    SD-WAN Overlay
                                    
┌──────────────────┐               ┌──────────────────┐
│   Fabric Site    │               │   SD-WAN Site    │
│                  │               │                  │
│  ┌────────────┐  │               │  ┌────────────┐  │
│  │   Fabric   │  │   L3 Handoff  │  │  WAN Edge  │  │
│  │   Border   │◄─┼───────────────┼─►│   Router   │  │
│  │   Node     │  │    eBGP       │  │            │  │
│  └────────────┘  │               │  └────────────┘  │
│                  │               │                  │
│  VN: Employee    │               │  VPN 10          │
│  VN: Guest       │               │  VPN 20          │
│  VN: IoT         │               │  VPN 30          │
│  VN: Voice       │               │  VPN 40          │
│                  │               │                  │
└──────────────────┘               └──────────────────┘
```

## L.2 VRF-to-VPN Mapping

### Abhavtech VN/VPN Mapping

| SD-Access VN | VRF Name | SD-WAN VPN | Purpose |
|--------------|----------|------------|---------|
| Employee | VRF_EMPLOYEE | VPN 10 | Corporate users |
| Guest | VRF_GUEST | VPN 20 | Guest access |
| IoT | VRF_IOT | VPN 30 | IoT devices |
| Voice | VRF_VOICE | VPN 40 | Voice/UC |
| Shared_Services | VRF_SHARED | VPN 50 | Shared services |

## L.3 BGP Configuration Quick Reference

### Fabric Border Configuration

```bash
! SD-Access Fabric Border Node
router bgp 65001
 bgp router-id 10.100.1.1
 !
 address-family ipv4 vrf VRF_EMPLOYEE
  neighbor 10.255.1.2 remote-as 65100
  neighbor 10.255.1.2 activate
  neighbor 10.255.1.2 send-community both
  redistribute connected
  redistribute lisp
 exit-address-family
```

### WAN Edge Configuration

```bash
! SD-WAN WAN Edge
router bgp 65100
 bgp router-id 10.10.1.1
 !
 address-family ipv4 vrf 10
  neighbor 10.255.1.1 remote-as 65001
  neighbor 10.255.1.1 activate
  neighbor 10.255.1.1 send-community both
  redistribute omp
 exit-address-family
```

## L.4 SGT Propagation

### TrustSec Configuration

```bash
! WAN Edge CTS Configuration
cts role-based enforcement
cts role-based enforcement vlan-list all
!
cts role-based sgt-map 10.10.10.0/24 sgt 10
cts role-based sgt-map 10.20.20.0/24 sgt 20
```

### SGT Reference

| SGT | Name | Description |
|-----|------|-------------|
| 10 | Employees | Corporate employees |
| 11 | Contractors | External contractors |
| 20 | Guests | Guest users |
| 30 | IoT_Devices | IoT endpoints |
| 40 | Voice_Devices | IP phones |
| 50 | Servers | Data center servers |
| 99 | Quarantine | Quarantined devices |

## L.5 Integration Verification Commands

### SD-Access Side

```bash
## Verify BGP peering
show ip bgp vpnv4 all summary

## Verify LISP routes
show lisp site

## Verify CTS
show cts role-based sgt-map all
```

### SD-WAN Side

```bash
## Verify BGP peering
show ip bgp vpnv4 vrf 10 summary

## Verify OMP routes from BGP
show sdwan omp routes vpn 10

## Verify CTS
show cts role-based sgt-map all
```

## L.6 Troubleshooting Quick Reference

### Common Integration Issues

| Issue | Check | Resolution |
|-------|-------|------------|
| BGP not establishing | show ip bgp neighbors | Verify IP, ASN, password |
| Routes not exchanging | show ip bgp vpnv4 all | Check redistribution |
| SGT not propagating | show cts interface | Verify CTS config |
| VRF mismatch | show vrf | Align VRF/VPN mapping |

### Integration Health Check Script

```python
#!/usr/bin/env python3
"""Quick integration health check"""

def check_integration(sdk):
    # Check BGP sessions
    # Check route counts
    # Check SGT propagation
    # Return health status
    pass
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
