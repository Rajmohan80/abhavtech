# 3.12 Compliance Framework Mapping

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. SOC 2 Type II Control Mapping

### 1.1 Trust Services Criteria - Security

| SOC 2 Control | Description | SD-Access Implementation | Evidence Location |
|---------------|-------------|-------------------------|-------------------|
| **CC6.1** | Logical access security | ISE 802.1X authentication, role-based authorization | ISE Authentication Reports |
| **CC6.2** | User authentication | EAP-TLS certificates, Duo MFA for admins | ISE Policy Sets, Duo Logs |
| **CC6.3** | User registration/authorization | ISE authorization policies, AD group mapping | ISE Authorization Policies |
| **CC6.6** | Boundary protection | TrustSec SGT segmentation, SGACL policies | ISE TrustSec Matrix |
| **CC6.7** | Threat detection | Cisco XDR, AI Network Analytics | XDR Dashboard, Assurance |
| **CC6.8** | Malicious software prevention | ISE Posture, Secure Endpoint integration | Posture Reports |
| **CC7.1** | Security event detection | Splunk SIEM, ISE Live Logs | Splunk Dashboards |
| **CC7.2** | Security monitoring | Catalyst Center Assurance, ThousandEyes | Assurance Dashboard |
| **CC7.3** | Incident evaluation | XDR automated response, ISE CoA | Incident Reports |
| **CC7.4** | Incident response | Automated quarantine, SOC playbooks | XDR Playbooks |

### 1.2 SOC 2 Evidence Collection Matrix

```yaml
SOC2_Evidence_Collection:
  
  CC6.1_Logical_Access:
    Evidence_Required:
      - ISE Authentication Summary Report (monthly)
      - Failed authentication analysis
      - Endpoint inventory with access levels
    Location: ISE → Operations → Reports → Authentication
    Retention: 12 months
    Frequency: Monthly export
    
  CC6.6_Network_Segmentation:
    Evidence_Required:
      - TrustSec SGT policy matrix
      - SGACL configurations
      - Network segmentation diagram
      - Penetration test results
    Location: ISE → TrustSec → Policy → Matrix
    Retention: 12 months + current
    Frequency: Quarterly review
    
  CC7.2_Security_Monitoring:
    Evidence_Required:
      - Assurance health reports
      - Alert configuration screenshots
      - SIEM integration logs
      - Monitoring coverage map
    Location: Catalyst Center → Assurance
    Retention: 12 months
    Frequency: Monthly export
```

---

## 2. ISO 27001:2022 Control Mapping

### 2.1 Annex A Control Mapping

| ISO 27001 Control | Control Title | SD-Access Implementation | Compliance Status |
|-------------------|---------------|-------------------------|-------------------|
| **A.5.15** | Access control | ISE role-based access, SGT segmentation | ✅ Compliant |
| **A.5.16** | Identity management | Active Directory integration, ISE identity stores | ✅ Compliant |
| **A.5.17** | Authentication information | EAP-TLS certificates, WPA3 | ✅ Compliant |
| **A.5.18** | Access rights | ISE authorization policies, SGACL | ✅ Compliant |
| **A.8.1** | User endpoint devices | ISE Posture assessment, MDM integration | ✅ Compliant |
| **A.8.2** | Privileged access rights | TACACS+ for admin access, Duo MFA | ✅ Compliant |
| **A.8.3** | Information access restriction | Virtual Networks, micro-segmentation | ✅ Compliant |
| **A.8.5** | Secure authentication | 802.1X, MFA, certificate-based auth | ✅ Compliant |
| **A.8.7** | Protection against malware | ISE Posture, Secure Endpoint | ✅ Compliant |
| **A.8.15** | Logging | ISE MnT, Splunk SIEM, 365-day retention | ✅ Compliant |
| **A.8.16** | Monitoring activities | Catalyst Center Assurance, AI Analytics | ✅ Compliant |
| **A.8.20** | Network security | SD-Access fabric, TrustSec | ✅ Compliant |
| **A.8.21** | Network services security | RadSec, MACsec, VXLAN encryption | ✅ Compliant |
| **A.8.22** | Network segregation | Virtual Networks, fabric zones | ✅ Compliant |
| **A.8.23** | Web filtering | Cisco Umbrella integration | ✅ Compliant |

### 2.2 ISO 27001 Control Implementation Details

```
┌─────────────────────────────────────────────────────────────────────┐
│                ISO 27001 Control Implementation                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  A.8.20 Network Security                                            │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Requirement: Networks shall be managed and controlled to       │ │
│  │ protect information in systems and applications.               │ │
│  │                                                                │ │
│  │ Implementation:                                                │ │
│  │ • SD-Access fabric provides software-defined segmentation     │ │
│  │ • TrustSec SGT tags classify all traffic                      │ │
│  │ • SGACL policies enforce access between segments              │ │
│  │ • AI Analytics detects anomalous traffic patterns             │ │
│  │                                                                │ │
│  │ Evidence:                                                      │ │
│  │ • Fabric site configurations in Catalyst Center               │ │
│  │ • SGT matrix export from ISE                                  │ │
│  │ • SGACL policy documentation                                  │ │
│  │ • Network topology diagrams                                   │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  A.8.22 Network Segregation                                         │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │ Requirement: Groups of information services, users and        │ │
│  │ information systems shall be segregated in networks.          │ │
│  │                                                                │ │
│  │ Implementation:                                                │ │
│  │ • 5 Virtual Networks (VN_CORPORATE, VN_VOICE, etc.)          │ │
│  │ • Fabric Zones for building/floor isolation                   │ │
│  │ • 12 Security Group Tags for micro-segmentation               │ │
│  │ • Default-deny between VNs without explicit policy            │ │
│  │                                                                │ │
│  │ Evidence:                                                      │ │
│  │ • VN configuration screenshots                                │ │
│  │ • Zone assignments per site                                   │ │
│  │ • Inter-VN traffic analysis (should be minimal)               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 3. NIST Cybersecurity Framework 2.0 Mapping

### 3.1 Function-Level Mapping

| NIST CSF Function | Category | SD-Access Component | Implementation |
|-------------------|----------|---------------------|----------------|
| **IDENTIFY** | | | |
| ID.AM-1 | Asset inventory | Catalyst Center inventory | All 854 devices discovered |
| ID.AM-2 | Software inventory | Assurance software tracking | IOS-XE versions tracked |
| ID.AM-3 | Data flows | VN traffic analysis | NetFlow to Splunk |
| **PROTECT** | | | |
| PR.AA-1 | Identity management | ISE identity stores | AD, LDAP integration |
| PR.AA-2 | Authentication | 802.1X, EAP-TLS | Certificate-based auth |
| PR.AA-3 | Remote access | SASE Secure Access | ZTNA for remote users |
| PR.AA-5 | Access permissions | SGT/SGACL | Micro-segmentation |
| PR.DS-1 | Data at rest | MACsec encryption | Switch-to-switch |
| PR.DS-2 | Data in transit | VXLAN, WPA3 | Full path encryption |
| PR.PS-1 | Baseline configuration | Catalyst Center templates | Compliance scanning |
| **DETECT** | | | |
| DE.AE-1 | Baseline established | AI Analytics baseline | 30-day learning period |
| DE.AE-2 | Anomaly detection | Machine Reasoning Engine | Automated detection |
| DE.CM-1 | Network monitoring | Assurance, ThousandEyes | 24/7 monitoring |
| DE.CM-4 | Malicious code detection | ISE + Secure Endpoint | Real-time scanning |
| **RESPOND** | | | |
| RS.AN-1 | Incident analysis | XDR correlation | Multi-source analysis |
| RS.CO-2 | Incident reporting | ServiceNow integration | Automated tickets |
| RS.MI-1 | Incident containment | ISE CoA, quarantine | Automated response |
| RS.MI-2 | Incident mitigation | SGACL enforcement | Block lateral movement |
| **RECOVER** | | | |
| RC.RP-1 | Recovery execution | DR procedures | Documented runbooks |
| RC.CO-1 | Communications | Webex, PagerDuty | Incident notification |

### 3.2 NIST CSF Maturity Assessment

```yaml
NIST_CSF_Maturity:
  
  Current_State:
    IDENTIFY: Tier 3 (Repeatable)
    PROTECT: Tier 4 (Adaptive)
    DETECT: Tier 3 (Repeatable)
    RESPOND: Tier 3 (Repeatable)
    RECOVER: Tier 2 (Risk Informed)
    
  Target_State (12 months):
    IDENTIFY: Tier 4 (Adaptive)
    PROTECT: Tier 4 (Adaptive)
    DETECT: Tier 4 (Adaptive)
    RESPOND: Tier 4 (Adaptive)
    RECOVER: Tier 3 (Repeatable)
    
  Gap_Remediation:
    IDENTIFY:
      - Implement automated asset discovery refresh
      - Complete data flow documentation
      
    DETECT:
      - Enable all AI Analytics features
      - Tune anomaly detection baselines
      
    RECOVER:
      - Conduct quarterly DR tests
      - Document and test all recovery procedures
```

---

## 4. PCI-DSS v4.0 Control Mapping (Detailed)

### 4.1 Network Segmentation Controls

| PCI-DSS Req | Requirement | SD-Access Control | Test Procedure |
|-------------|-------------|-------------------|----------------|
| **1.3.1** | Restrict inbound CDE traffic | VN_PCI isolated VN | Penetration test |
| **1.3.2** | Restrict outbound CDE traffic | SGACL egress policy | Traffic analysis |
| **1.4.1** | NSCs between trusted/untrusted | Border node firewalling | Rule review |
| **1.4.2** | Inbound traffic restricted | ISE authorization | Policy audit |
| **2.2.1** | System hardening | Catalyst Center templates | Compliance scan |
| **7.2.1** | Access control system | ISE + TrustSec | Access review |
| **7.2.2** | Access based on job function | SGT role mapping | Matrix review |
| **8.3.1** | MFA for CDE access | Duo MFA integration | Auth log review |
| **10.2.1** | Audit log enabled | ISE MnT, Splunk | Log verification |
| **10.3.1** | Audit logs protected | Splunk retention | Access audit |
| **11.3.1** | Vulnerability scans | Posture assessment | Scan reports |

### 4.2 CDE Segmentation Evidence

```
┌─────────────────────────────────────────────────────────────────────┐
│              PCI-DSS CDE Segmentation Architecture                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │                    CARDHOLDER DATA ENVIRONMENT                 │ │
│  │                         VN_PCI (VLAN 100)                      │ │
│  │                                                                │ │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐                  │ │
│  │  │ POS       │  │ Payment   │  │ Card Data │                  │ │
│  │  │ Systems   │  │ Processor │  │ Database  │                  │ │
│  │  │ SGT: 100  │  │ SGT: 101  │  │ SGT: 102  │                  │ │
│  │  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘                  │ │
│  │        │              │              │                         │ │
│  │        └──────────────┼──────────────┘                         │ │
│  │                       │                                        │ │
│  │              SGACL: PCI-INTERNAL-ONLY                          │ │
│  │              (Permit only within CDE)                          │ │
│  │                       │                                        │ │
│  └───────────────────────┼────────────────────────────────────────┘ │
│                          │                                          │
│                 ┌────────┴────────┐                                │
│                 │   Border Node   │                                │
│                 │   SGACL: DENY   │                                │
│                 │   CDE ↔ Non-CDE │                                │
│                 └────────┬────────┘                                │
│                          │                                          │
│  ┌───────────────────────┴────────────────────────────────────────┐ │
│  │                    NON-CDE ENVIRONMENT                         │ │
│  │                    VN_CORPORATE (VLAN 10)                      │ │
│  │                                                                │ │
│  │  ┌───────────┐  ┌───────────┐  ┌───────────┐                  │ │
│  │  │ Employee  │  │ Corporate │  │ Printers  │                  │ │
│  │  │ Devices   │  │ Apps      │  │           │                  │ │
│  │  │ SGT: 10   │  │ SGT: 11   │  │ SGT: 20   │                  │ │
│  │  └───────────┘  └───────────┘  └───────────┘                  │ │
│  │                                                                │ │
│  └────────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  Segmentation Test Results:                                         │
│  • CDE → Non-CDE: BLOCKED ✓                                        │
│  • Non-CDE → CDE: BLOCKED ✓                                        │
│  • CDE Internal: PERMITTED (controlled) ✓                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 5. Compliance Audit Checklist

### 5.1 Pre-Audit Preparation

```yaml
Pre_Audit_Checklist:
  
  Documentation_Ready:
    - [ ] Network architecture diagrams (current)
    - [ ] SGT/SGACL policy matrix export
    - [ ] ISE policy set documentation
    - [ ] Authentication success reports (12 months)
    - [ ] Change management records
    - [ ] Incident response records
    - [ ] DR test results
    
  System_Screenshots:
    - [ ] Catalyst Center dashboard
    - [ ] ISE policy sets
    - [ ] TrustSec matrix
    - [ ] Splunk dashboards
    - [ ] Alert configurations
    
  Personnel:
    - [ ] Network architect available
    - [ ] Security engineer available
    - [ ] Operations lead available
    - [ ] Access to all systems prepared
```

### 5.2 Evidence Repository Structure

```
/evidence/
├── soc2/
│   ├── CC6.1_logical_access/
│   ├── CC6.6_boundary_protection/
│   ├── CC7.2_security_monitoring/
│   └── quarterly_reports/
├── iso27001/
│   ├── A.8.20_network_security/
│   ├── A.8.22_network_segregation/
│   └── annual_review/
├── pci-dss/
│   ├── req1_segmentation/
│   ├── req7_access_control/
│   ├── req10_logging/
│   └── penetration_tests/
└── nist-csf/
    ├── identify/
    ├── protect/
    ├── detect/
    ├── respond/
    └── recover/
```

---

## 6. Compliance Dashboard Metrics

### 6.1 Key Compliance Indicators

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Authentication Success Rate | >99% | 99.3% | ✅ |
| Endpoints with Valid SGT | 100% | 99.8% | ✅ |
| Posture Compliance Rate | >95% | 96.2% | ✅ |
| MFA Adoption (Admins) | 100% | 100% | ✅ |
| Patch Compliance (30 days) | >90% | 92% | ✅ |
| Log Retention | 365 days | 365 days | ✅ |
| DR Test Success | 100% | 100% | ✅ |
| Segmentation Test Pass | 100% | 100% | ✅ |

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
