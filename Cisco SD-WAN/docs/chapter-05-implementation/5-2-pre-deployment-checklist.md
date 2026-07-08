# 5.2 Pre-Deployment Checklist

## Document Information
- **Version:** 1.0
- **Last Updated:** December 2025
- **Author:** Abhavtech Network Engineering
- **Classification:** Internal Use

---

## 5.2.1 Infrastructure Prerequisites

### Network Infrastructure Checklist

| Category | Item | Status | Owner | Verification |
|----------|------|--------|-------|--------------|
| **Connectivity** | Internet circuits at all sites | ☐ | ISP Team | Bandwidth test |
| | MPLS circuits operational (parallel) | ☐ | WAN Team | Route verification |
| | LTE/5G backup circuits | ☐ | Mobile Team | Failover test |
| | Out-of-band management network | ☐ | NOC | Console access |
| **IP Addressing** | Management IP ranges allocated | ☐ | IPAM Team | Infoblox verify |
| | Transport IP ranges allocated | ☐ | IPAM Team | No conflicts |
| | Service VPN IP ranges allocated | ☐ | IPAM Team | VPN mapping |
| | NAT pool ranges allocated | ☐ | IPAM Team | DIA NAT |
| **DNS** | SD-WAN Manager FQDN | ☐ | DNS Team | Resolution test |
| | SD-WAN Controller FQDNs | ☐ | DNS Team | Resolution test |
| | SD-WAN Validator FQDNs | ☐ | DNS Team | Resolution test |
| **Firewall** | Control plane ports (12346, 12446) | ☐ | Security | ACL verify |
| | Management ports (443, 8443) | ☐ | Security | Access test |
| | BFD ports (12386) | ☐ | Security | UDP permit |

### IP Address Allocation Summary

```
+------------------------------------------------------------------+
|                IP ADDRESS ALLOCATION - ABHAVTECH                  |
+------------------------------------------------------------------+

MANAGEMENT NETWORK (VPN 512):
┌─────────────────────────────────────────────────────────────────┐
│  SD-WAN Manager Cluster:    10.255.0.0/24                       │
│    - sdwan-mgr-1:           10.255.0.11                         │
│    - sdwan-mgr-2:           10.255.0.12                         │
│    - sdwan-mgr-3:           10.255.0.13                         │
│    - Cluster VIP:           10.255.0.10                         │
│                                                                  │
│  SD-WAN Controllers:        10.255.1.0/24                       │
│    - vsmart-mumbai-1:       10.255.1.11                         │
│    - vsmart-mumbai-2:       10.255.1.12                         │
│    - vsmart-chennai-1:      10.255.1.21                         │
│    - vsmart-chennai-2:      10.255.1.22                         │
│                                                                  │
│  WAN Edge Management:       10.255.10.0/24 - 10.255.19.0/24     │
│    - Mumbai:                10.255.10.0/24                       │
│    - Chennai:               10.255.11.0/24                       │
│    - Bangalore:             10.255.12.0/24                       │
│    - Delhi:                 10.255.13.0/24                       │
│    - Noida:                 10.255.14.0/24                       │
│    - London:                10.255.15.0/24                       │
│    - Frankfurt:             10.255.16.0/24                       │
│    - New Jersey:            10.255.17.0/24                       │
│    - Dallas:                10.255.18.0/24                       │
└─────────────────────────────────────────────────────────────────┘

TRANSPORT NETWORK (VPN 0):
┌─────────────────────────────────────────────────────────────────┐
│  System IPs (TLOC):         10.255.255.0/24                     │
│    - Mumbai Hub-1:          10.255.255.1                        │
│    - Mumbai Hub-2:          10.255.255.2                        │
│    - Chennai Hub-1:         10.255.255.3                        │
│    - Chennai Hub-2:         10.255.255.4                        │
│    - Bangalore:             10.255.255.11                       │
│    - Delhi:                 10.255.255.12                       │
│    - Noida:                 10.255.255.13                       │
│    - London:                10.255.255.21                       │
│    - Frankfurt:             10.255.255.22                       │
│    - New Jersey:            10.255.255.31                       │
│    - Dallas:                10.255.255.32                       │
│                                                                  │
│  Transport Interfaces:      Assigned by ISP (public)            │
└─────────────────────────────────────────────────────────────────┘

SERVICE VPNs:
┌─────────────────────────────────────────────────────────────────┐
│  VPN 10 (Employee):         10.10.0.0/16                        │
│  VPN 20 (Guest):            10.20.0.0/16                        │
│  VPN 30 (IoT):              10.30.0.0/16                        │
│  VPN 40 (Voice):            10.40.0.0/16                        │
│  VPN 50 (Shared Services):  10.50.0.0/16                        │
│  VPN 100 (PCI):             10.100.0.0/16                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5.2.2 Hardware Prerequisites

### Controller Hardware

| Component | Specification | Quantity | Status |
|-----------|---------------|----------|--------|
| **SD-WAN Manager** | | | |
| vCPU | 32 cores | 3 VMs | ☐ |
| Memory | 64 GB | 3 VMs | ☐ |
| Storage | 1 TB SSD | 3 VMs | ☐ |
| Network | 10 Gbps | 3 VMs | ☐ |
| **SD-WAN Controller** | | | |
| vCPU | 8 cores | 4 VMs | ☐ |
| Memory | 16 GB | 4 VMs | ☐ |
| Storage | 100 GB | 4 VMs | ☐ |
| Network | 1 Gbps | 4 VMs | ☐ |

### WAN Edge Hardware

| Site | Model | Quantity | Interfaces | Status |
|------|-------|----------|------------|--------|
| Mumbai DC | C8500-12X4QC | 2 | 12x10G, 4x100G | ☐ Staged |
| Chennai DR | C8500-12X4QC | 2 | 12x10G, 4x100G | ☐ Staged |
| London | C8300-2N2S-6T | 2 | 2xNIM, 6x1G | ☐ Shipped |
| Frankfurt | C8300-2N2S-6T | 2 | 2xNIM, 6x1G | ☐ Shipped |
| New Jersey | C8300-2N2S-6T | 2 | 2xNIM, 6x1G | ☐ Shipped |
| Dallas | C8300-2N2S-6T | 2 | 2xNIM, 6x1G | ☐ Shipped |
| Bangalore | C8300-1N1S-6T | 2 | 1xNIM, 6x1G | ☐ Ordered |
| Delhi | C8300-1N1S-6T | 2 | 1xNIM, 6x1G | ☐ Ordered |
| Noida | C8300-1N1S-6T | 2 | 1xNIM, 6x1G | ☐ Ordered |

### Hardware Verification Checklist

```bash
#!/bin/bash
# hardware_verification.sh - Pre-deployment hardware check

echo "=== ABHAVTECH SD-WAN HARDWARE VERIFICATION ==="

# Check serial numbers against purchase order
echo "Step 1: Serial Number Verification"
cat << 'EOF'
Site: Mumbai DC
  Router 1: FCW2534L0AB (Expected: FCW2534L0AB) [MATCH]
  Router 2: FCW2534L0AC (Expected: FCW2534L0AC) [MATCH]
EOF

# Verify firmware versions
echo "Step 2: Firmware Version Check"
cat << 'EOF'
Minimum IOS-XE: 17.15.1a
  Mumbai-1: 17.15.1a [OK]
  Mumbai-2: 17.15.1a [OK]
EOF

# Check licenses
echo "Step 3: License Verification"
cat << 'EOF'
Required: DNA Advantage
  Mumbai-1: DNA-A-P-25G [OK]
  Mumbai-2: DNA-A-P-25G [OK]
EOF
```

---

## 5.2.3 Software Prerequisites

### Software Versions

| Component | Required Version | Status | Download Location |
|-----------|------------------|--------|-------------------|
| SD-WAN Manager | 20.15.1 | ☐ | software.cisco.com |
| SD-WAN Controller | 20.15.1 | ☐ | software.cisco.com |
| SD-WAN Validator | 20.15.1 | ☐ | software.cisco.com |
| WAN Edge IOS-XE | 17.15.1a | ☐ | software.cisco.com |

### License Requirements

| License Type | Quantity | Term | Status |
|--------------|----------|------|--------|
| DNA Advantage - 25G | 4 | 5 years | ☐ Ordered |
| DNA Advantage - 10G | 8 | 5 years | ☐ Ordered |
| DNA Advantage - 1G | 6 | 5 years | ☐ Ordered |
| SD-WAN Controller | 4 | Perpetual | ☐ Included |
| SD-WAN Manager | 1 | Perpetual | ☐ Included |
| Security Bundle | 18 | 5 years | ☐ Ordered |
| Umbrella SIG | 500 users | 5 years | ☐ Ordered |

---

## 5.2.4 Security Prerequisites

### Certificate Requirements

| Certificate | Type | Purpose | Status |
|-------------|------|---------|--------|
| Root CA | Enterprise CA | Trust anchor | ☐ Exported |
| Controller Certs | Signed by CA | Controller auth | ☐ Pending |
| WAN Edge Certs | Signed by CA | Device auth | ☐ Pending |
| HTTPS Cert | Public CA | vManage UI | ☐ Ordered |

### Enterprise CA Configuration Verification

```bash
# Verify CA certificate export
openssl x509 -in /etc/pki/ca-trust/source/anchors/abhavtech-root-ca.crt \
  -text -noout | grep -E "(Subject|Issuer|Not After)"

# Expected output:
# Subject: CN=Abhavtech-Root-CA, O=Abhavtech, C=IN
# Issuer: CN=Abhavtech-Root-CA, O=Abhavtech, C=IN
# Not After : Dec 31 23:59:59 2035 GMT

# Verify CA chain
openssl verify -CAfile abhavtech-root-ca.crt abhavtech-issuing-ca.crt
```

### Firewall Rules Prerequisites

| Source | Destination | Port | Protocol | Purpose | Status |
|--------|-------------|------|----------|---------|--------|
| WAN Edge | vBond | 12346 | UDP/DTLS | Authentication | ☐ |
| WAN Edge | vSmart | 12346 | UDP/DTLS | OMP | ☐ |
| WAN Edge | vManage | 12346 | UDP/DTLS | Management | ☐ |
| WAN Edge | WAN Edge | 12346 | UDP/DTLS | IPsec IKE | ☐ |
| WAN Edge | WAN Edge | 12386 | UDP | BFD | ☐ |
| Admin | vManage | 443 | TCP | Web UI | ☐ |
| Admin | vManage | 8443 | TCP | API | ☐ |
| vManage | SMTP | 25/587 | TCP | Email alerts | ☐ |
| vManage | NTP | 123 | UDP | Time sync | ☐ |
| vManage | DNS | 53 | UDP/TCP | Resolution | ☐ |

---

## 5.2.5 Integration Prerequisites

### SD-Access Integration Readiness

| Requirement | Status | Owner | Notes |
|-------------|--------|-------|-------|
| Border nodes identified | ☐ | LAN Team | Mumbai: CAT-C9500-BN-1/2 |
| VRF-Lite subinterfaces ready | ☐ | LAN Team | Dot1Q encapsulation |
| BGP AS numbers assigned | ☐ | Architecture | SD-Access: 65100, SD-WAN: 65200 |
| Route-map filters defined | ☐ | LAN Team | Prevent loops |
| CTS inline tagging enabled | ☐ | Security | End-to-end SGT |

### SD-Access Border Configuration Verification

```
! Verify SD-Access border is ready for handoff
Border-Node# show vrf
  Name         Default RD     Protocols   Interfaces
  Employee     1:10           ipv4        Vlan10, Gi1/0/1.10
  Guest        1:20           ipv4        Vlan20, Gi1/0/1.20
  IoT          1:30           ipv4        Vlan30, Gi1/0/1.30
  Voice        1:40           ipv4        Vlan40, Gi1/0/1.40
  Shared       1:50           ipv4        Vlan50, Gi1/0/1.50

! Verify subinterface for WAN Edge handoff
Border-Node# show run interface GigabitEthernet1/0/1.10
  interface GigabitEthernet1/0/1.10
   encapsulation dot1Q 10
   vrf forwarding Employee
   ip address 172.16.1.1 255.255.255.252
   no shutdown
```

### External System Integration

| System | Integration Type | Purpose | Status |
|--------|------------------|---------|--------|
| ISE 3.3 | RADIUS | WAN Edge authentication | ☐ Ready |
| Catalyst Center 2.3.7 | REST API | Unified management | ☐ Pending |
| Infoblox IPAM | API | IP allocation | ☐ Ready |
| Splunk | Syslog | Security analytics | ☐ Pending |
| PagerDuty | Webhook | Alert escalation | ☐ Pending |
| ServiceNow | API | ITSM integration | ☐ Pending |

---

## 5.2.6 Operational Prerequisites

### Team Readiness

| Role | Training Required | Status | Certification |
|------|-------------------|--------|---------------|
| Network Engineers | SD-WAN Operations | ☐ | CCNP SD-WAN |
| NOC Analysts | SD-WAN Monitoring | ☐ | Internal |
| Security Team | SD-WAN Security | ☐ | Internal |
| Helpdesk | Basic Troubleshooting | ☐ | Internal |

### Documentation Readiness

| Document | Status | Owner |
|----------|--------|-------|
| High-Level Design | ☐ Complete | Architect |
| Low-Level Design | ☐ In Progress | Engineer |
| Runbook Draft | ☐ In Progress | Operations |
| Test Plan | ☐ Complete | QA |
| Rollback Procedures | ☐ In Progress | Engineer |

---

## 5.2.7 Final Pre-Deployment Checklist

### Go/No-Go Checklist

```
+------------------------------------------------------------------+
|              ABHAVTECH SD-WAN DEPLOYMENT GO/NO-GO                 |
+------------------------------------------------------------------+
|                                                                   |
|  Date: _______________    Phase: _______________                 |
|                                                                   |
|  INFRASTRUCTURE                                       Sign-off   |
|  ☐ All internet circuits tested and operational       _______    |
|  ☐ IP addresses allocated and verified                _______    |
|  ☐ DNS entries created and resolving                  _______    |
|  ☐ Firewall rules implemented and tested              _______    |
|                                                                   |
|  HARDWARE                                             Sign-off   |
|  ☐ All equipment received and inventoried             _______    |
|  ☐ Serial numbers match purchase orders               _______    |
|  ☐ Equipment staged at deployment locations           _______    |
|  ☐ Console access verified                            _______    |
|                                                                   |
|  SOFTWARE                                             Sign-off   |
|  ☐ Controller images downloaded                       _______    |
|  ☐ WAN Edge images downloaded                         _______    |
|  ☐ Licenses activated in Cisco Smart Account          _______    |
|  ☐ Security signatures updated                        _______    |
|                                                                   |
|  SECURITY                                             Sign-off   |
|  ☐ CA certificates exported                           _______    |
|  ☐ Certificate signing process documented             _______    |
|  ☐ Firewall rules tested                              _______    |
|  ☐ ISE integration ready                              _______    |
|                                                                   |
|  INTEGRATION                                          Sign-off   |
|  ☐ SD-Access border configuration validated           _______    |
|  ☐ BGP parameters agreed                              _______    |
|  ☐ External system APIs tested                        _______    |
|                                                                   |
|  OPERATIONAL                                          Sign-off   |
|  ☐ Team training completed                            _______    |
|  ☐ Documentation available                            _______    |
|  ☐ Escalation contacts confirmed                      _______    |
|  ☐ Change approval obtained                           _______    |
|                                                                   |
|  DECISION: ☐ GO   ☐ NO-GO                                        |
|                                                                   |
|  Approver: _________________  Date: _______________              |
|                                                                   |
+------------------------------------------------------------------+
```

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech Network Engineering | Initial release |

---

*Abhavtech Confidential - SD-WAN Pre-Deployment Checklist*
