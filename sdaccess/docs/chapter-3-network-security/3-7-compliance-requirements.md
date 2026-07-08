# 3.7 Compliance Requirements

### 3.7.1 Compliance Framework Mapping

| Requirement | Standard | SD-Access Control | Evidence |
|-------------|----------|-------------------|----------|
| **Network Segmentation** | PCI-DSS 1.3 | Virtual Networks, SGT | DNAC Network Hierarchy |
| **Access Control** | PCI-DSS 7.1 | ISE Authorization | ISE Policy Reports |
| **Authentication** | PCI-DSS 8.1 | 802.1X, MFA | ISE Authentication Logs |
| **Encryption** | PCI-DSS 4.1 | VXLAN, MACsec, TLS | Encryption Config |
| **Logging** | PCI-DSS 10.1 | ISE, DNAC Logs | SIEM Integration |
| **Vulnerability Mgmt** | PCI-DSS 6.1 | Posture Assessment | ISE Posture Reports |
| **Data Protection** | GDPR Art. 32 | Encryption, Access Control | Data Flow Diagrams |
| **Audit Trail** | SOC2 CC6.1 | Centralized Logging | Log Retention Policy |

### 3.7.2 PCI-DSS Cardholder Data Environment (CDE)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PCI-DSS NETWORK SEGMENTATION                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    CARDHOLDER DATA ENVIRONMENT                      │    │
│  │                         VN_PCI (Separate VN)                        │    │
│  │                                                                     │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │    │
│  │  │ Payment     │  │ POS         │  │ Card Data   │                 │    │
│  │  │ Terminals   │  │ Systems     │  │ Storage     │                 │    │
│  │  │ SGT: 100    │  │ SGT: 101    │  │ SGT: 102    │                 │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                 │    │
│  │                                                                     │    │
│  │  SGACL: Only PCI-authorized traffic permitted                       │    │
│  │  Firewall: Additional L7 inspection                                 │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                        │
│                                    │ L3 Firewall Inspection                 │
│                                    │ (All traffic logged)                   │
│                                    ▼                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    CORPORATE NETWORK                                │    │
│  │                         VN_CORPORATE                                │    │
│  │                                                                     │    │
│  │  No direct access to CDE                                            │    │
│  │  Jump server required for admin access                              │    │
│  │                                                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  CONTROLS:                                                                  │
│  ─────────                                                                  │
│  • Separate Virtual Network for CDE                                         │
│  • Dedicated SGTs for payment systems                                       │
│  • SGACL blocks all unauthorized traffic                                    │
│  • Firewall with IPS/IDS for L7 inspection                                  │
│  • All traffic logged and sent to SIEM                                      │
│  • MFA required for all CDE access                                          │
│  • Quarterly ASV scans                                                      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---
