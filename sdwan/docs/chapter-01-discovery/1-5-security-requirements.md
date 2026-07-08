# 1.5 Security Requirements

## Document Information

| Item | Details |
|------|---------|
| **Document Version** | 1.0 |
| **Last Updated** | December 2025 |
| **Author** | Network Security Team |
| **Organization** | Abhavtech.com |
| **Classification** | Confidential |

---

## 1.5.1 Overview

This section documents the security requirements that must be addressed by the SD-WAN solution. These requirements encompass regulatory compliance, data protection, access control, and threat mitigation capabilities.

### Security Objectives

- Maintain end-to-end encryption for all WAN traffic
- Ensure compliance with regulatory frameworks
- Enable micro-segmentation aligned with SD-Access
- Implement zero-trust security principles
- Provide comprehensive threat detection and prevention

---

## 1.5.2 Compliance Requirements

### Applicable Regulatory Frameworks

| Framework | Scope | Requirements | Deadline |
|-----------|-------|--------------|----------|
| PCI-DSS 4.0 | Payment processing | Network segmentation, encryption | Mar 2025 |
| SOC 2 Type II | SaaS operations | Access controls, monitoring | Annual |
| ISO 27001 | Information security | ISMS, controls | Ongoing |
| GDPR | EU data handling | Data protection, privacy | Ongoing |
| RBI Guidelines | Indian banking | Data localization, security | Ongoing |
| HIPAA | Healthcare data | PHI protection | Where applicable |

### Compliance Mapping to SD-WAN Controls

| Compliance Area | Requirement | SD-WAN Control |
|-----------------|-------------|----------------|
| Network Segmentation | PCI-DSS 1.3 | Service VPNs, VRF isolation |
| Encryption in Transit | PCI-DSS 4.1 | IPsec AES-256-GCM |
| Access Control | SOC 2 CC6.1 | ISE integration, RBAC |
| Audit Logging | ISO 27001 A.12.4 | vManage audit logs |
| Intrusion Detection | PCI-DSS 11.4 | UTD (Snort IPS) |
| Change Management | SOC 2 CC8.1 | Configuration versioning |

---

## 1.5.3 Encryption Requirements

### Data-in-Transit Encryption

| Requirement | Specification | SD-WAN Implementation |
|-------------|--------------|----------------------|
| Encryption Algorithm | AES-256 minimum | AES-256-GCM |
| Key Exchange | IKEv2 | IKEv2 with PFS |
| Perfect Forward Secrecy | Required | DH Group 19/20 (ECDH) |
| Certificate Authority | Enterprise PKI | Cisco PKI or Enterprise CA |
| Certificate Rotation | Annual | Automated via vManage |
| TLS Version | 1.2 minimum | TLS 1.3 for control plane |

### Encryption Standards by Traffic Type

```
                    ENCRYPTION REQUIREMENTS BY TRAFFIC TYPE
    ═══════════════════════════════════════════════════════════════

    ┌─────────────────────────────────────────────────────────────┐
    │  CONTROL PLANE                                              │
    │  ┌─────────────────────────────────────────────────────────┐│
    │  │  vManage ↔ vSmart ↔ WAN Edge                           ││
    │  │  Protocol: DTLS 1.2 / TLS 1.3                          ││
    │  │  Cipher: AES-256-GCM                                    ││
    │  │  Auth: X.509 Certificates                               ││
    │  └─────────────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────┐
    │  DATA PLANE                                                 │
    │  ┌─────────────────────────────────────────────────────────┐│
    │  │  WAN Edge ↔ WAN Edge (Overlay)                         ││
    │  │  Protocol: IPsec ESP                                    ││
    │  │  Cipher: AES-256-GCM                                    ││
    │  │  IKE: IKEv2 with PFS (DH Group 19)                     ││
    │  │  Integrity: SHA-384                                     ││
    │  │  Rekey: 1 hour (data), 24 hours (IKE)                  ││
    │  └─────────────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────┐
    │  MANAGEMENT PLANE                                           │
    │  ┌─────────────────────────────────────────────────────────┐│
    │  │  Admin ↔ vManage                                        ││
    │  │  Protocol: HTTPS (TLS 1.3)                             ││
    │  │  Auth: SAML SSO + MFA via ISE                          ││
    │  └─────────────────────────────────────────────────────────┘│
    └─────────────────────────────────────────────────────────────┘
```

---

## 1.5.4 Segmentation Requirements

### Network Segmentation Strategy

| Segment | Purpose | SD-WAN VPN | VRF | Isolation Level |
|---------|---------|------------|-----|-----------------|
| Corporate | Employee access | VPN 10 | CORPORATE | Standard |
| Guest | Visitor access | VPN 20 | GUEST | Full isolation |
| IoT | Device connectivity | VPN 30 | IOT | Quarantine |
| Voice | Unified communications | VPN 40 | VOICE | QoS priority |
| PCI | Payment processing | VPN 50 | PCI | Enhanced |

### SD-Access VN to SD-WAN VPN Mapping

```
                    SEGMENTATION ALIGNMENT
    ═══════════════════════════════════════════════════════════════

    SD-ACCESS (LAN)                    SD-WAN (WAN)
    ───────────────────────────────────────────────────────────────
    
    ┌─────────────────┐                ┌─────────────────┐
    │   Employee_VN   │ ◄════════════► │    VPN 10       │
    │   VRF: CORP     │    VRF-Lite    │  VRF: CORPORATE │
    │   VNI: 50001    │    BGP/OSPF    │                 │
    └─────────────────┘                └─────────────────┘
    
    ┌─────────────────┐                ┌─────────────────┐
    │    Guest_VN     │ ◄════════════► │    VPN 20       │
    │   VRF: GUEST    │    VRF-Lite    │   VRF: GUEST    │
    │   VNI: 50002    │    BGP/OSPF    │                 │
    └─────────────────┘                └─────────────────┘
    
    ┌─────────────────┐                ┌─────────────────┐
    │     IoT_VN      │ ◄════════════► │    VPN 30       │
    │    VRF: IOT     │    VRF-Lite    │    VRF: IOT     │
    │   VNI: 50003    │    BGP/OSPF    │                 │
    └─────────────────┘                └─────────────────┘
    
    ┌─────────────────┐                ┌─────────────────┐
    │    Voice_VN     │ ◄════════════► │    VPN 40       │
    │   VRF: VOICE    │    VRF-Lite    │   VRF: VOICE    │
    │   VNI: 50004    │    BGP/OSPF    │                 │
    └─────────────────┘                └─────────────────┘
    
    ┌─────────────────┐                ┌─────────────────┐
    │    PCI_VN       │ ◄════════════► │    VPN 50       │
    │    VRF: PCI     │    VRF-Lite    │    VRF: PCI     │
    │   VNI: 50005    │    BGP/OSPF    │                 │
    └─────────────────┘                └─────────────────┘

    ═══════════════════════════════════════════════════════════════
```

### Inter-Segment Traffic Control

| Source Segment | Destination Segment | Allowed | Control |
|---------------|--------------------| --------|---------|
| Corporate | Corporate | Yes | Default allow |
| Corporate | Guest | No | Blocked |
| Corporate | Voice | Yes | SIP/RTP only |
| Corporate | PCI | Limited | Firewall inspection |
| Guest | Any Internal | No | Full isolation |
| IoT | Corporate | Limited | Specific services only |
| Voice | Corporate | Yes | Signaling only |
| PCI | Corporate | Limited | Reporting only |

---

## 1.5.5 TrustSec/SGT Requirements

### SGT Propagation Requirements

| Requirement | Description | Implementation |
|-------------|-------------|----------------|
| SGT Inline Tagging | Preserve SGT across WAN | CTS manual on WAN Edge |
| End-to-End Policy | Consistent policy LAN to WAN | ISE + vManage sync |
| SGT-Based Routing | Route by security group | Data policies with SGT match |
| Cross-Domain | SD-Access to SD-WAN | Inline tagging at handoff |

### Security Group Tag Inventory

| SGT Value | SGT Name | Description | Policy |
|-----------|----------|-------------|--------|
| 10 | Employees | Standard employees | Standard access |
| 11 | Executives | Executive staff | Enhanced access |
| 12 | Finance | Finance department | PCI access |
| 20 | Contractors | External contractors | Limited access |
| 30 | IT_Admin | IT administrators | Full access |
| 100 | Guests | Guest users | Internet only |
| 200 | IoT_Cameras | Security cameras | Restricted |
| 201 | IoT_HVAC | Building automation | Restricted |
| 300 | Voice_Phones | IP phones | Voice VLAN |
| 400 | PCI_Servers | Payment servers | PCI zone |

### SGT Propagation Architecture

```
                    END-TO-END SGT PROPAGATION
    ═══════════════════════════════════════════════════════════════

    ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐
    │  Endpoint  │───►│  SD-Access │───►│  SD-WAN    │───►│   Remote   │
    │  SGT: 10   │    │  Fabric    │    │  WAN Edge  │    │   Site     │
    └────────────┘    └────────────┘    └────────────┘    └────────────┘
         │                  │                  │                  │
         │ 802.1X/MAB      │ VXLAN-GPO        │ CTS Inline       │
         │ ISE assigns     │ SGT in header    │ SGT in ESP       │
         │ SGT:10          │ SGT:10           │ SGT:10           │
         │                  │                  │                  │
         ▼                  ▼                  ▼                  ▼
    ┌─────────────────────────────────────────────────────────────┐
    │              CONSISTENT POLICY ENFORCEMENT                  │
    │                                                             │
    │  ISE Policy: SGT:10 (Employees) can access:                │
    │  - Corporate applications (SGT:400)                        │
    │  - Voice services (SGT:300)                                │
    │  - Internet via DIA                                        │
    │                                                             │
    │  Denied:                                                   │
    │  - PCI servers without explicit need                       │
    │  - IoT management networks                                 │
    └─────────────────────────────────────────────────────────────┘
```

---

## 1.5.6 Threat Protection Requirements

### Required Security Features

| Feature | Requirement | SD-WAN Capability |
|---------|-------------|-------------------|
| Firewall | Zone-based + App-aware | Enterprise Firewall |
| IPS/IDS | Signature + anomaly detection | UTD (Snort 3.0) |
| URL Filtering | Category-based blocking | Umbrella/URL Filter |
| Malware Protection | AMP integration | Advanced Malware Protection |
| DNS Security | DNS-layer protection | Umbrella DNS |
| DDoS Protection | Volumetric attack mitigation | Rate limiting, ACLs |

### Security Service Locations

| Security Service | Hub Sites | Branch Sites | Cloud |
|-----------------|-----------|--------------|-------|
| Enterprise Firewall | ✅ | ✅ | N/A |
| IPS (UTD) | ✅ | ✅ (major) | N/A |
| URL Filtering | ✅ | ✅ | ✅ (Umbrella) |
| Advanced Malware | ✅ | Via cloud | ✅ |
| DNS Security | ✅ | ✅ | ✅ (Umbrella) |
| CASB | Via cloud | Via cloud | ✅ |

---

## 1.5.7 Access Control Requirements

### Administrative Access

| Role | Access Level | Authentication | Authorization |
|------|-------------|----------------|---------------|
| Network Admin | Full | SAML + MFA | vManage Admin |
| Security Admin | Security configs | SAML + MFA | Security Role |
| NOC Operator | Read + limited ops | SAML + MFA | Operator Role |
| Auditor | Read only | SAML + MFA | Read Only |
| API Service | Programmatic | Certificate + Token | API Role |

### Authentication Requirements

| Requirement | Specification |
|-------------|--------------|
| Primary Auth | SAML 2.0 via ISE/Okta |
| MFA | Required for all admin access |
| Session Timeout | 30 minutes idle |
| Password Policy | 14+ chars, complexity, 90-day rotation |
| Service Accounts | Certificate-based, no interactive login |
| API Authentication | OAuth 2.0 tokens, 1-hour expiry |

---

## 1.5.8 Audit and Logging Requirements

### Required Logging

| Log Type | Retention | Destination | Alert Threshold |
|----------|-----------|-------------|-----------------|
| Authentication | 1 year | Splunk/SIEM | Failed: 3 in 5 min |
| Configuration Changes | 2 years | Splunk/SIEM | All changes |
| Security Events | 1 year | Splunk/SIEM | Critical: immediate |
| Traffic Logs | 90 days | Local + SIEM | Anomalies |
| Performance Logs | 90 days | vAnalytics | SLA breaches |

### Audit Trail Requirements

```
                    AUDIT LOGGING ARCHITECTURE
    ═══════════════════════════════════════════════════════════════

    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
    │   vManage   │───►│   Syslog    │───►│   Splunk    │
    │  Audit Log  │    │   Server    │    │    SIEM     │
    └─────────────┘    └─────────────┘    └──────┬──────┘
                                                 │
    ┌─────────────┐    ┌─────────────┐           │
    │  WAN Edge   │───►│   Syslog    │───────────┤
    │  Security   │    │   Server    │           │
    └─────────────┘    └─────────────┘           │
                                                 │
    ┌─────────────┐                              │
    │    ISE      │──────────────────────────────┤
    │  Auth Logs  │                              │
    └─────────────┘                              │
                                                 ▼
                                          ┌─────────────┐
                                          │  Security   │
                                          │  Dashboard  │
                                          └─────────────┘
```

---

## 1.5.9 Security Requirements Summary

### Critical Security Requirements

| Priority | Requirement | SD-WAN Control | Status |
|----------|-------------|----------------|--------|
| P1 | End-to-end encryption | IPsec AES-256-GCM | Required |
| P1 | Network segmentation | Service VPNs | Required |
| P1 | SGT propagation | CTS inline tagging | Required |
| P1 | MFA for admin access | ISE/SAML integration | Required |
| P2 | IPS/IDS | UTD Snort | Required |
| P2 | URL filtering | Umbrella/Local | Required |
| P2 | Comprehensive logging | Syslog to SIEM | Required |
| P3 | Advanced malware | AMP integration | Recommended |
| P3 | CASB | Cloud integration | Recommended |

### Compliance Readiness Checklist

| Framework | Requirements Met | Gap | Remediation |
|-----------|------------------|-----|-------------|
| PCI-DSS 4.0 | 85% | IPS deployment | Enable UTD at all sites |
| SOC 2 | 90% | Audit retention | Extend to 2 years |
| ISO 27001 | 92% | None critical | Minor documentation |
| GDPR | 88% | Data localization | Configure geo-routing |

---

## References

| Document | Description |
|----------|-------------|
| Cisco SD-WAN Security Design Guide | Security architecture |
| PCI-DSS 4.0 Requirements | Payment card security |
| ISO 27001:2022 | Information security standard |
| Abhavtech Security Policy | Corporate security policy |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Confidential*
*Abhavtech.com - SD-WAN Documentation*
