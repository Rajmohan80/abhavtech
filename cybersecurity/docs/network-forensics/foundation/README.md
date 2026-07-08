# Network Forensics Foundation

## Key Innovations

**1. Blockchain Evidence Ledger**
- Distributed immutable ledger for evidence chain of custody
- SHA-256 hash anchoring with timestamp verification
- Tamper-proof audit trail for legal proceedings
- Automated evidence integrity validation

**2. Multi-Platform Correlation**
- Integration across 10+ security platforms
- 4 AI engines providing investigative intelligence
- Cross-domain forensic analysis (network, security, application)
- Automated timeline reconstruction

**3. AI-Enhanced Forensics**
- Deep Network Model (DNM): Anomaly detection and prediction
- Splunk MLTK: Behavioral analytics and threat hunting
- Cognition Engine: Application performance forensics
- ThousandEyes AI: Network path forensics
- XDR Analytics: Security event correlation

## Forensics Platform Integration

| Platform | Forensics Capability | Evidence Types | Retention |
|----------|---------------------|----------------|-----------|
| **Catalyst Center** | Network telemetry, Assurance AI, client health | PCAP, NetFlow, syslogs, config snapshots | 90 days |
| **Splunk Enterprise** | SIEM correlation, MLTK analytics, timeline reconstruction | Logs from all sources, ML model outputs | 1 year |
| **ISE** | AAA logs, posture assessment, pxGrid context | Auth logs, session data, profiler classifications | 180 days |
| **vManage** | SD-WAN analytics, OMP routing, IPsec tunnels | vEdge syslogs, DPI data, application visibility | 90 days |
| **FMC/FTD** | Firewall events, connection logs, IPS alerts | Connection events, file analysis, malware verdicts | 1 year |
| **XDR (SecureX)** | Cross-platform correlation, threat intelligence, playbooks | Ribbons, alerts, IOCs, incident timelines | 2 years |
| **ThousandEyes** | Network path analysis, BGP monitoring, application layer | HTTP archive (HAR), path traces, DNS queries | 90 days |
| **AppDynamics** | APM transactions, code-level traces, database queries | Transaction snapshots, error analytics, SQL statements | 30 days |
| **Webex Control Hub** | Call Detail Records (CDR), quality metrics, admin logs | CDR, CMR, audit logs, SIP ladder diagrams | 90 days |
| **Duo Admin Panel** | Authentication logs, device trust, MFA events | Auth logs, phone home, policy evaluations | 180 days |

## Investigation Types Supported

| Investigation Type | Trigger | Primary Platforms | Typical Duration | Success Criteria |
|-------------------|---------|-------------------|------------------|------------------|
| **Malware C2 Communication** | XDR Alert (malware detected) | XDR, FTD, Splunk, DNAC | 2-6 hours | C2 IP/domain identified, lateral movement mapped |
| **Data Exfiltration** | DLP alert, unusual egress traffic | FTD, Umbrella, Splunk, DNAC | 4-12 hours | Exfiltrated data volume quantified, attacker methodology documented |
| **Insider Threat** | UEBA anomaly, privilege escalation | Splunk MLTK, ISE, XDR, Duo | 8-24 hours | User activity timeline reconstructed, data access scope determined |
| **Webex Toll Fraud** | Billing anomaly, international calling spike | Webex Control Hub, SBC logs | 4-8 hours | Fraud calls identified, attack vector determined, $$ loss calculated |
| **Rogue Access Point** | DNAC rogue detection, RF interference | DNAC, WLC, Splunk | 2-4 hours | Rogue AP location identified, clients impacted, attacker device fingerprinted |
| **SD-WAN Attack** | vManage alert, tunnel anomaly | vManage, FTD, ThousandEyes | 4-8 hours | Attack type determined (OMP injection, IPsec hijack), impact scope |
| **Zero Trust Bypass** | Duo MFA bypass, device trust violation | Duo, ISE, XDR, Splunk | 4-12 hours | Bypass methodology documented, affected users identified |
| **AgenticOps Forensics** | AI workflow unexpected action | Splunk, DNAC, vManage, ISE | 1-3 hours | AI decision chain validated, action justified or corrected |

---

## CHAPTER 1: FORENSICS ARCHITECTURE
