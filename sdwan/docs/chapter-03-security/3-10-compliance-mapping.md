# 3.10 Compliance Mapping

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-SEC-3.10 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

This section documents the compliance mapping between Abhavtech's SD-WAN security implementation and major regulatory frameworks. The SD-WAN deployment has been designed to meet requirements from NIST Cybersecurity Framework, PCI-DSS v4.0, SOC 2 Type II, ISO 27001:2022, and GDPR where applicable to network infrastructure.

### 1.1 Compliance Overview

```
+------------------------------------------------------------------+
|                   COMPLIANCE FRAMEWORK COVERAGE                   |
+------------------------------------------------------------------+
|                                                                   |
|  Framework        | Applicability       | Status     | Gap       |
|  -----------------+---------------------+------------+-----------|
|  NIST CSF 2.0     | All operations      | Compliant  | None      |
|  PCI-DSS v4.0     | Payment processing  | Compliant  | None      |
|  SOC 2 Type II    | Service delivery    | Compliant  | None      |
|  ISO 27001:2022   | ISMS                | Compliant  | None      |
|  GDPR             | EU data handling    | Compliant  | None      |
|  HIPAA            | Not applicable      | N/A        | N/A       |
|                                                                   |
+------------------------------------------------------------------+
```

### 1.2 SD-WAN Security Controls Matrix

| Control Category | SD-WAN Feature | Frameworks Addressed |
|------------------|----------------|----------------------|
| Encryption | IPsec AES-256-GCM | NIST, PCI, ISO, SOC2 |
| Access Control | RBAC, MFA | NIST, PCI, ISO, SOC2 |
| Segmentation | VPN isolation, SGT | NIST, PCI, ISO |
| Monitoring | Logging, SIEM | All frameworks |
| Threat Detection | UTD, IPS | NIST, PCI, ISO |

---

## 2. NIST Cybersecurity Framework 2.0

### 2.1 Framework Overview

```
+------------------------------------------------------------------+
|                   NIST CSF 2.0 FUNCTIONS                          |
+------------------------------------------------------------------+
|                                                                   |
|  +-------------+  +-------------+  +-------------+                |
|  |   GOVERN    |  |  IDENTIFY   |  |   PROTECT   |               |
|  +-------------+  +-------------+  +-------------+                |
|  | Policy      |  | Asset Mgmt  |  | Access Ctrl |               |
|  | Risk Mgmt   |  | Risk Assess |  | Encryption  |               |
|  | Oversight   |  | Business Env|  | Segmentation|               |
|  +------+------+  +------+------+  +------+------+                |
|         |                |                |                       |
|         +----------------+----------------+                       |
|                          |                                        |
|  +-------------+  +------v------+  +-------------+                |
|  |   DETECT    |  |   RESPOND   |  |   RECOVER   |               |
|  +-------------+  +-------------+  +-------------+                |
|  | Monitoring  |  | Incident Rsp|  | Recovery    |               |
|  | Anomalies   |  | Mitigation  |  | Improvement |               |
|  | Continuous  |  | Communicate |  | Planning    |               |
|  +-------------+  +-------------+  +-------------+                |
|                                                                   |
+------------------------------------------------------------------+
```

### 2.2 NIST CSF Control Mapping

| NIST Control | Requirement | SD-WAN Implementation | Evidence |
|--------------|-------------|----------------------|----------|
| ID.AM-1 | Physical device inventory | vManage device inventory | Automated discovery |
| ID.AM-2 | Software platforms mapped | Template-based config | Configuration DB |
| ID.RA-1 | Vulnerabilities identified | UTD signatures | Vulnerability scan |
| PR.AC-1 | Identity management | ISE integration | Auth logs |
| PR.AC-3 | Remote access managed | Secure overlay tunnels | IPsec config |
| PR.AC-4 | Access permissions managed | RBAC policies | Permission audit |
| PR.AC-5 | Network integrity protected | Segmentation | VPN isolation |
| PR.DS-1 | Data-at-rest protected | N/A (transit only) | N/A |
| PR.DS-2 | Data-in-transit protected | AES-256-GCM encryption | Crypto config |
| PR.DS-5 | Protections against leaks | DLP, URL filtering | Policy rules |
| PR.IP-1 | Baseline config created | Template management | Golden configs |
| PR.PT-1 | Audit logs enabled | Comprehensive logging | Syslog config |
| DE.AE-1 | Network operations monitored | vManage analytics | Dashboard |
| DE.CM-1 | Network monitored | Real-time monitoring | NOC procedures |
| DE.CM-4 | Malicious code detected | UTD, AMP | Alert logs |
| RS.RP-1 | Response plan executed | Incident runbooks | IR procedures |
| RC.RP-1 | Recovery plan executed | DR procedures | DR runbooks |

---

## 3. PCI-DSS v4.0 Compliance

### 3.1 Cardholder Data Environment (CDE) Scope

```
+------------------------------------------------------------------+
|                   PCI-DSS SCOPE IN SD-WAN                         |
+------------------------------------------------------------------+
|                                                                   |
|  In-Scope Components:                                             |
|  +----------------------------------------------------------+    |
|  | - VPN 100 (PCI Zone)                                      |   |
|  | - WAN Edge routers at Mumbai DC, Chennai DR               |   |
|  | - SD-WAN Manager (management access)                      |   |
|  | - Transit networks carrying CDE traffic                   |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Out-of-Scope (Segmented):                                        |
|  +----------------------------------------------------------+    |
|  | - VPN 10, 20, 30, 40 (non-CDE traffic)                    |   |
|  | - Branch sites without payment processing                 |   |
|  | - Guest network (VPN 20)                                  |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Segmentation Validation:                                         |
|  - Annual penetration testing confirms isolation                 |
|  - VPN isolation prevents cross-segment access                   |
|  - Firewall rules enforce CDE boundaries                         |
|                                                                   |
+------------------------------------------------------------------+
```

### 3.2 PCI-DSS Requirement Mapping

| PCI Req | Description | SD-WAN Control | Evidence |
|---------|-------------|----------------|----------|
| 1.2 | Network security controls | Zone-based firewall | FW policy |
| 1.3 | Access restricted | VPN isolation | Segment config |
| 1.4 | Network connections documented | vManage inventory | Topology docs |
| 2.2 | Secure configurations | Hardening templates | Config baseline |
| 2.3 | Wireless security | 802.1X, WPA3 | Wireless config |
| 3.4 | PAN rendered unreadable | N/A (transit) | N/A |
| 4.1 | Strong cryptography | AES-256-GCM | IPsec config |
| 4.2 | PAN secured in transit | Encryption | Tunnel verify |
| 5.2 | Anti-malware | UTD, AMP | Threat logs |
| 6.4 | Secure development | N/A (vendor) | Cisco CVD |
| 7.1 | Access by need-to-know | RBAC | User roles |
| 8.2 | Strong authentication | MFA, certificates | Auth config |
| 8.3 | MFA for remote access | SAML + MFA | SSO config |
| 10.1 | Audit trails | Comprehensive logs | Syslog |
| 10.2 | Audit log content | User actions logged | Log samples |
| 10.3 | Time synchronization | NTP | NTP config |
| 10.5 | Audit log protection | Secure syslog | TLS config |
| 11.3 | Penetration testing | Annual test | Pentest report |
| 11.4 | Network intrusion detection | UTD IPS | Alert logs |
| 12.10 | Incident response | IR procedures | Runbooks |

### 3.3 PCI-Specific Configuration

```
! PCI Zone Firewall Policy
zone-pair security ZP-PCI-TO-INTERNET source PCI-ZONE destination INTERNET-ZONE
 description "PCI CDE to Internet - Payment Gateway Only"
 service-policy type inspect PM-PCI-EGRESS
!

policy-map type inspect PM-PCI-EGRESS
 class CM-PAYMENT-GATEWAY
  inspect
  log
 class class-default
  drop log
!

class-map type inspect match-all CM-PAYMENT-GATEWAY
 match access-group name ACL-PAYMENT-PROCESSORS
!

ip access-list extended ACL-PAYMENT-PROCESSORS
 permit tcp any host 192.0.2.100 eq 443  ! Payment processor 1
 permit tcp any host 192.0.2.101 eq 443  ! Payment processor 2
 deny ip any any log

! PCI Logging Requirements
logging host 10.254.1.50 transport tcp port 6514 secure
logging trap informational
logging source-interface Loopback0
!
```

---

## 4. SOC 2 Type II Compliance

### 4.1 Trust Service Criteria

```
+------------------------------------------------------------------+
|                   SOC 2 TRUST SERVICE CRITERIA                    |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------+                                             |
|  |    SECURITY      |  Protect against unauthorized access        |
|  +------------------+                                             |
|  | - Access control | - IPsec encryption                         |
|  | - Network security| - Segmentation                            |
|  | - Monitoring     | - UTD threat detection                     |
|  +------------------+                                             |
|                                                                   |
|  +------------------+                                             |
|  |  AVAILABILITY    |  System operates as committed              |
|  +------------------+                                             |
|  | - HA design      | - Controller redundancy                    |
|  | - DR capability  | - Multi-path routing                       |
|  | - Monitoring     | - SLA tracking                             |
|  +------------------+                                             |
|                                                                   |
|  +------------------+                                             |
|  | CONFIDENTIALITY  |  Data protected as committed                |
|  +------------------+                                             |
|  | - Encryption     | - AES-256 for all traffic                  |
|  | - Access control | - Role-based access                        |
|  | - Data handling  | - DLP policies                             |
|  +------------------+                                             |
|                                                                   |
|  +------------------+                                             |
|  |    INTEGRITY     |  Complete, accurate, authorized            |
|  +------------------+                                             |
|  | - Change mgmt    | - Template versioning                      |
|  | - Validation     | - Config compliance                        |
|  | - Monitoring     | - Integrity verification                   |
|  +------------------+                                             |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.2 SOC 2 Control Mapping

| TSC | Control Point | SD-WAN Implementation | Testing Procedure |
|-----|---------------|----------------------|-------------------|
| CC6.1 | Logical access | RBAC, MFA | User access review |
| CC6.2 | Registration | Provisioning workflow | Account creation |
| CC6.3 | Role modification | Role-based templates | Role change audit |
| CC6.6 | Threats identified | UTD, IPS | Threat log review |
| CC6.7 | Transmission protection | IPsec encryption | Crypto validation |
| CC6.8 | Unauthorized access | Firewall policies | Policy review |
| CC7.1 | Detection mechanisms | Monitoring, alerts | Alert validation |
| CC7.2 | Monitoring systems | vManage, SIEM | Dashboard review |
| CC7.3 | Threat evaluation | Incident analysis | Incident reports |
| CC7.4 | Incident response | IR procedures | Tabletop exercise |
| CC8.1 | Change management | Template workflow | Change records |
| A1.1 | Capacity planning | Performance monitoring | Capacity reports |
| A1.2 | Environmental threats | HA, DR | DR test results |
| C1.1 | Confidential info | Encryption, DLP | Encryption audit |

---

## 5. ISO 27001:2022 Compliance

### 5.1 Annex A Control Mapping

| ISO Control | Description | SD-WAN Implementation |
|-------------|-------------|----------------------|
| A.5.1 | Policies for info security | Security policy docs |
| A.5.15 | Access control | RBAC, MFA |
| A.5.17 | Authentication | Certificate-based, MFA |
| A.5.23 | Cloud services security | Cloud OnRamp security |
| A.5.24 | Incident management | IR procedures |
| A.8.1 | User endpoint devices | Endpoint security |
| A.8.3 | Information access restriction | Segmentation, ACLs |
| A.8.5 | Secure authentication | Strong auth |
| A.8.7 | Protection against malware | UTD, AMP |
| A.8.9 | Configuration management | Template management |
| A.8.10 | Information deletion | Secure decommission |
| A.8.15 | Logging | Comprehensive logging |
| A.8.16 | Monitoring activities | Real-time monitoring |
| A.8.20 | Networks security | Encryption, segmentation |
| A.8.21 | Security of network services | Secure protocols |
| A.8.22 | Segregation of networks | VPN isolation |
| A.8.23 | Web filtering | URL filtering |
| A.8.24 | Use of cryptography | AES-256, TLS 1.3 |
| A.8.26 | Application security | AppFW policies |

### 5.2 Statement of Applicability

```
+------------------------------------------------------------------+
|                ISO 27001 STATEMENT OF APPLICABILITY               |
+------------------------------------------------------------------+
|                                                                   |
|  Control Domain           | Applicable | Implemented | Excluded  |
|  -------------------------+-----------+-------------+-----------|
|  A.5 Organizational       | 37        | 37          | 0         |
|  A.6 People               | 8         | 8           | 0         |
|  A.7 Physical             | 14        | N/A         | 14*       |
|  A.8 Technological        | 34        | 34          | 0         |
|                                                                   |
|  * Physical controls managed by data center providers             |
|                                                                   |
|  SD-WAN Specific Controls:                                        |
|  +----------------------------------------------------------+    |
|  | A.8.20 Network Security:                                  |   |
|  | - IPsec encryption for all WAN traffic                    |   |
|  | - Certificate-based authentication                        |   |
|  | - TLS 1.3 for management                                  |   |
|  +----------------------------------------------------------+    |
|  | A.8.22 Segregation of Networks:                           |   |
|  | - 6 Service VPNs for traffic isolation                    |   |
|  | - SGT-based microsegmentation                             |   |
|  | - Zone-based firewall policies                            |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 6. GDPR Considerations

### 6.1 Network-Level GDPR Controls

| GDPR Article | Requirement | SD-WAN Implementation |
|--------------|-------------|----------------------|
| Art. 25 | Data protection by design | Encryption by default |
| Art. 32 | Security of processing | Technical measures |
| Art. 33 | Breach notification | Incident detection |
| Art. 44-49 | International transfers | Regional segmentation |

### 6.2 Data Residency Configuration

```
! Regional Traffic Policy for GDPR
policy
 data-policy EU-DATA-RESIDENCY
  vpn-list VPN-10-EMPLOYEE
   ! EU user data stays in EU
   sequence 10
    match
     source-data-prefix-list EU-USER-SUBNETS
     destination-data-prefix-list EU-SERVERS
    action accept
     set
      local-tloc-list EU-REGION-TLOCS
    !
   !
   
   ! Block EU data to non-EU regions
   sequence 20
    match
     source-data-prefix-list EU-USER-SUBNETS
     destination-data-prefix-list NON-EU-SERVERS
    action drop
     log
    !
   !
  !
 !
!
```

---

## 7. Compliance Monitoring and Reporting

### 7.1 Compliance Dashboard

```
+------------------------------------------------------------------+
|                 COMPLIANCE MONITORING DASHBOARD                   |
+------------------------------------------------------------------+
|                                                                   |
|  Framework Status:                                                |
|  +----------------------------------------------------------+    |
|  | Framework     | Score  | Last Audit | Next Audit         |    |
|  +----------------------------------------------------------+    |
|  | NIST CSF      | 94%    | Nov 2025   | Nov 2026           |    |
|  | PCI-DSS       | 100%   | Oct 2025   | Oct 2026           |    |
|  | SOC 2         | 96%    | Sep 2025   | Sep 2026           |    |
|  | ISO 27001     | 98%    | Aug 2025   | Aug 2026           |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Control Effectiveness:                                           |
|  +----------------------------------------------------------+    |
|  | Control              | Status    | Evidence              |    |
|  +----------------------------------------------------------+    |
|  | Encryption           | Effective | 100% tunnel encrypted |    |
|  | Access Control       | Effective | 0 unauthorized access |    |
|  | Logging              | Effective | 100% events captured  |    |
|  | Segmentation         | Effective | 0 cross-VPN violations|    |
|  | Threat Detection     | Effective | 99.9% detection rate  |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 7.2 Audit Evidence Collection

```
! Automated Compliance Evidence Collection
! Run monthly for audit preparation

! Encryption Status
show crypto ipsec sa summary > encryption_evidence.txt

! Access Control Evidence  
show sdwan users > user_access_evidence.txt

! Logging Status
show logging > logging_config_evidence.txt

! Segmentation Verification
show sdwan policy service-chain > segmentation_evidence.txt

! Configuration Compliance
show sdwan running-config | include security > security_config.txt
```

---

## 8. Best Practices Summary

### 8.1 Compliance Best Practices

- Map controls to multiple frameworks to reduce redundancy
- Automate evidence collection for continuous compliance
- Conduct regular gap assessments against framework updates
- Maintain documentation for audit readiness

### 8.2 Audit Preparation Best Practices

- Keep evidence repository current (monthly updates)
- Document control exceptions with compensating controls
- Train staff on compliance requirements
- Conduct internal audits before external assessments

---

## References

| Document | Description | Location |
|----------|-------------|----------|
| NIST CSF 2.0 | Framework document | nist.gov |
| PCI-DSS v4.0 | Payment card standard | pcisecuritystandards.org |
| SOC 2 Guide | Trust services criteria | aicpa.org |
| ISO 27001:2022 | ISMS standard | iso.org |
| Abhavtech Compliance Policy | Internal compliance | SharePoint |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
*Document ID: SDWAN-SEC-3.10*
