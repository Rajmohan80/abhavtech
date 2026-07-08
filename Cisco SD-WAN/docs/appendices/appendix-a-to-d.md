# Appendices

## Appendix A: Glossary

## A.1 SD-WAN Terminology

### Control Plane Terms

| Term | Definition |
|------|------------|
| **OMP** | Overlay Management Protocol - Cisco proprietary routing protocol for SD-WAN overlay |
| **TLOC** | Transport Location - Unique identifier combining system-ip, color, and encapsulation |
| **vBond** | SD-WAN Validator - Orchestrates initial authentication and controller discovery |
| **vManage** | SD-WAN Manager - Centralized management, monitoring, and configuration platform |
| **vSmart** | SD-WAN Controller - Implements control plane policies and route distribution |
| **BFD** | Bidirectional Forwarding Detection - Fast failure detection for tunnels |

### Data Plane Terms

| Term | Definition |
|------|------------|
| **WAN Edge** | Customer premise router running SD-WAN software (C8000 series) |
| **IPsec** | Internet Protocol Security - Encryption for data plane tunnels |
| **DTLS** | Datagram Transport Layer Security - Encryption for control plane |
| **Color** | Transport identifier (mpls, biz-internet, public-internet, lte, 5g) |
| **Service VPN** | VRF for user traffic (VPN 1-511) |
| **Transport VPN** | VPN 0 - WAN-facing interfaces |
| **Management VPN** | VPN 512 - Out-of-band management |

### Policy Terms

| Term | Definition |
|------|------------|
| **AAR** | Application-Aware Routing - Traffic steering based on application SLA |
| **SLA Class** | Performance thresholds (latency, loss, jitter) for application routing |
| **Data Policy** | Traffic manipulation at data plane (DIA, service insertion) |
| **Control Policy** | Route manipulation at control plane (topology, path selection) |
| **Centralized Policy** | Policies applied at vSmart controller |
| **Localized Policy** | Policies applied directly on WAN Edge |

### Integration Terms

| Term | Definition |
|------|------------|
| **Fabric Handoff** | L3 connection between SD-Access border and SD-WAN WAN Edge |
| **VN** | Virtual Network - SD-Access segmentation construct |
| **SGT** | Scalable Group Tag - TrustSec micro-segmentation identifier |
| **CTS** | Cisco TrustSec - Security group-based access control |
| **eBGP** | External BGP - Routing protocol for fabric handoff |

## A.2 Acronym Reference

| Acronym | Full Form |
|---------|-----------|
| AAR | Application-Aware Routing |
| API | Application Programming Interface |
| BGP | Border Gateway Protocol |
| BFD | Bidirectional Forwarding Detection |
| CASB | Cloud Access Security Broker |
| CFLOWD | Cisco Flow Data |
| CLI | Command Line Interface |
| CPE | Customer Premises Equipment |
| CSR | Cloud Services Router |
| CTS | Cisco TrustSec |
| DIA | Direct Internet Access |
| DMVPN | Dynamic Multipoint VPN |
| DNA | Digital Network Architecture |
| DTLS | Datagram Transport Layer Security |
| ECMP | Equal Cost Multi-Path |
| FWaaS | Firewall as a Service |
| GRE | Generic Routing Encapsulation |
| HA | High Availability |
| IaC | Infrastructure as Code |
| IBN | Intent-Based Networking |
| IOS-XE | Cisco Operating System |
| IPsec | Internet Protocol Security |
| ISE | Identity Services Engine |
| LISP | Locator/ID Separation Protocol |
| LTE | Long-Term Evolution |
| MRF | Multi-Region Fabric |
| MPLS | Multiprotocol Label Switching |
| NAT | Network Address Translation |
| NOC | Network Operations Center |
| OMP | Overlay Management Protocol |
| QoS | Quality of Service |
| REST | Representational State Transfer |
| SASE | Secure Access Service Edge |
| SD-Access | Software-Defined Access |
| SD-WAN | Software-Defined Wide Area Network |
| SGT | Scalable Group Tag |
| SIEM | Security Information and Event Management |
| SLA | Service Level Agreement |
| SNMP | Simple Network Management Protocol |
| SNB | SD-WAN Network Bridge |
| SR | Segment Routing |
| SSE | Security Service Edge |
| SWG | Secure Web Gateway |
| TACACS+ | Terminal Access Controller Access-Control System Plus |
| TCO | Total Cost of Ownership |
| TLOC | Transport Location |
| VN | Virtual Network |
| VPN | Virtual Private Network |
| VRF | Virtual Routing and Forwarding |
| ZTNA | Zero Trust Network Access |
| ZTP | Zero Touch Provisioning |

---

## Appendix B: CLI Reference

## B.1 Show Commands

### Control Plane Verification

```bash
## Controller connections
show sdwan control connections
show sdwan control local-properties

## OMP status
show sdwan omp summary
show sdwan omp peers
show sdwan omp routes
show sdwan omp tlocs

## BFD sessions
show sdwan bfd sessions
show sdwan bfd history

## Certificate status
show sdwan certificate installed
show sdwan certificate root-ca-cert
show sdwan certificate serial
```

### Data Plane Verification

```bash
## Tunnel status
show sdwan tunnel statistics
show sdwan ipsec inbound-connections
show sdwan ipsec outbound-connections

## Interface status
show sdwan interface statistics
show interface summary

## Routing
show ip route vrf [vrf-name]
show sdwan policy from-vsmart
```

### Policy Verification

```bash
## Applied policies
show sdwan policy access-list-associations
show sdwan policy data-policy-filter
show sdwan policy app-route-policy-filter

## QoS
show sdwan policy qos-scheduler-info
show policy-map interface [interface]

## Application recognition
show sdwan app-route statistics
show sdwan app-fwd cflowd statistics
```

### Troubleshooting Commands

```bash
## System health
show sdwan system status
show sdwan running-config
show platform hardware throughput level

## Logging
show logging
show sdwan notification stream viptela

## Debug (use with caution)
debug sdwan [feature]
debug platform condition feature sdwan controlplane subfeature [all|omp|bfd]
```

## B.2 Configuration Commands

### Basic System Configuration

```bash
system
 system-ip             10.10.1.1
 site-id               100
 organization-name     "Abhavtech"
 vbond vbond.abhavtech.com port 12346
!
```

### VPN Configuration

```bash
vpn 10
 name "Employee"
 ecmp-hash-key layer4
 !
 ip route 0.0.0.0/0 vpn 0
 !
 interface GigabitEthernet0/0/1
  ip address 10.10.10.1/24
  no shutdown
 !
!
```

### Policy Configuration

```bash
policy
 sla-class VOICE
  latency 150
  loss 1
  jitter 30
 !
 app-route-policy VOICE-POLICY
  vpn-list VPN-10
   sequence 10
    match
     app-list VOICE-APPS
    !
    action
     sla-class VOICE preferred-color mpls
    !
   !
  !
 !
!
```

---

## Appendix C: Template Library

## C.1 Feature Template Reference

### System Templates

| Template Name | Purpose | Device Types |
|---------------|---------|--------------|
| ABVT-System-Hub | Hub site system settings | C8500 |
| ABVT-System-Branch | Branch site system settings | C8300 |
| ABVT-System-Remote | Remote site system settings | C8200L |

### VPN Templates

| Template Name | VPN ID | Purpose |
|---------------|--------|---------|
| ABVT-VPN0-Transport | 0 | WAN transport interfaces |
| ABVT-VPN10-Employee | 10 | Employee traffic |
| ABVT-VPN20-Guest | 20 | Guest traffic |
| ABVT-VPN30-IoT | 30 | IoT devices |
| ABVT-VPN40-Voice | 40 | Voice/UC traffic |
| ABVT-VPN512-Mgmt | 512 | Management traffic |

### Interface Templates

| Template Name | Interface Type | Purpose |
|---------------|----------------|---------|
| ABVT-VPN0-MPLS | GigabitEthernet | MPLS WAN interface |
| ABVT-VPN0-Internet | GigabitEthernet | Internet WAN interface |
| ABVT-VPN0-LTE | Cellular | LTE backup interface |
| ABVT-LAN-Access | GigabitEthernet | LAN access interface |
| ABVT-LAN-Trunk | GigabitEthernet | LAN trunk interface |

## C.2 Device Template Reference

### Hub Templates

| Template Name | Components | Sites |
|---------------|------------|-------|
| ABVT-Hub-Primary | System, AAA, VPN0, VPN10-40, VPN512, Security, Logging | Mumbai, Chennai |
| ABVT-Hub-Regional | System, AAA, VPN0, VPN10-40, VPN512 | London, New Jersey |

### Branch Templates

| Template Name | Components | Sites |
|---------------|------------|-------|
| ABVT-Branch-Standard | System, AAA, VPN0, VPN10, VPN512 | Bangalore, Delhi, Noida |
| ABVT-Branch-EMEA | System, AAA, VPN0, VPN10, VPN512 | Frankfurt |
| ABVT-Branch-Americas | System, AAA, VPN0, VPN10, VPN512 | Dallas |

## C.3 Template Variables

### Common Variables

| Variable | Description | Example |
|----------|-------------|---------|
| system_hostname | Device hostname | MUM-WAN-EDGE-01 |
| system_ip | System IP address | 10.10.1.1 |
| site_id | Site identifier | 100 |
| vpn0_ipv4_address | Transport interface IP | 203.0.113.1/30 |
| vpn0_ipv4_gateway | Transport gateway | 203.0.113.2 |
| lan_ipv4_address | LAN interface IP | 10.10.10.1/24 |

---

## Appendix D: Certificate Management

## D.1 Certificate Architecture

### Certificate Hierarchy

```
Cisco SD-WAN Root CA
├── Controller Certificates
│   ├── vManage Certificate
│   ├── vSmart Certificate
│   └── vBond Certificate
│
└── WAN Edge Certificates
    ├── Hub WAN Edge Certificates
    └── Branch WAN Edge Certificates
```

### Certificate Types

| Type | Purpose | Validity |
|------|---------|----------|
| Root CA | Trust anchor | 10 years |
| Controller | vManage/vSmart/vBond identity | 1 year |
| WAN Edge | Device identity and encryption | 1 year |

## D.2 Certificate Operations

### View Installed Certificates

```bash
show sdwan certificate installed

## Output example:
Certificate:
    Data:
        Version: 3 (0x2)
        Serial Number: 1234567890
        Signature Algorithm: sha256WithRSAEncryption
        Issuer: CN=Cisco SD-WAN Root CA
        Validity
            Not Before: Jan  1 00:00:00 2025 GMT
            Not After : Jan  1 00:00:00 2026 GMT
        Subject: CN=MUM-WAN-EDGE-01
```

### Certificate Renewal Process

```yaml
certificate_renewal:
  automatic:
    enabled: true
    threshold_days: 30
    
  manual_process:
    step_1:
      action: "Generate CSR"
      command: "request platform software sdwan csr"
      
    step_2:
      action: "Submit to CA"
      method: "vManage or manual"
      
    step_3:
      action: "Install certificate"
      command: "request platform software sdwan certificate install [file]"
      
    step_4:
      action: "Verify installation"
      command: "show sdwan certificate installed"
```

### Certificate Troubleshooting

```bash
## Check certificate expiry
show sdwan certificate serial

## Check root CA
show sdwan certificate root-ca-cert

## Check certificate chain
show sdwan certificate chain

## Debug certificate issues
debug sdwan certificate
```

## D.3 Certificate Monitoring

### Expiry Alerting

```yaml
certificate_monitoring:
  alert_thresholds:
    warning: 30  # days
    critical: 7  # days
    
  notification:
    method: "Email + ServiceNow"
    recipients:
      - "network-team@abhavtech.com"
      
  automation:
    auto_renewal: true
    renewal_window: "30 days before expiry"
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
