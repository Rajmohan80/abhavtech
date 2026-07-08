# Executive Summary

## 1. EXECUTIVE SUMMARY & SECURITY POSTURE

### 1.1 Abhavtech Security Architecture Overview

Abhavtech operates a defense-in-depth security architecture protecting 9 global sites, 12,000 users, and 25,000+ endpoints across APAC, EMEA, and Americas regions. The security infrastructure integrates 10+ platforms providing unified visibility, automated response, and continuous compliance monitoring.

**Enterprise Scale:**
- **Geographic Footprint:** 9 sites (6 campus: Mumbai, Chennai, London, Frankfurt, New Jersey, Dallas | 3 branch: Bangalore, Delhi, Noida)
- **User Base:** 12,000 employees, 500+ contractors, 6,000+ mobile devices (BYOD)
- **Network Infrastructure:** 940 wireless APs, 350+ switches, 25 routers (SD-WAN edges)
- **Endpoint Protection:** 25,000+ endpoints (AMP 99.2% coverage)
- **Security Operations:** 24x7 SOC (12 analysts), 5 security engineers, 8 network security engineers

#### 1.1.1 Integrated Security Platform Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                ABHAVTECH SECURITY ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TIER 1: EXTENDED DETECTION & RESPONSE (XDR)                                │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│   ┌─────────────────────────────────────────────────────────────┐          │
│   │  Cisco SecureX Premier (XDR Platform)                       │          │
│   │  ────────────────────────────────────────────────            │          │
│   │  • 8 Data Ribbons (ISE, FTD, Umbrella, AMP, Orbital...)     │          │
│   │  • Unified Threat Correlation (cross-platform)              │          │
│   │  • 8 Automated Playbooks (PB-001 to PB-008)                 │          │
│   │  • Threat Intelligence (Talos, FS-ISAC, CISA)               │          │
│   │  • UEBA (User & Entity Behavior Analytics)                  │          │
│   │  • 1-Year Data Retention (Premier tier)                     │          │
│   └─────────────────────┬───────────────────────────────────────┘          │
│                         │                                                   │
│                         ▼                                                   │
│            24x7 SOC Operations (Follow-the-Sun)                             │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TIER 2: IDENTITY & ACCESS MANAGEMENT                                       │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  ┌──────────────────────────┐      ┌──────────────────────────┐           │
│  │  ISE 14-Node Cluster     │      │  Duo Beyond (MFA)        │           │
│  │  ─────────────────────   │      │  ──────────────────      │           │
│  │  • 802.1X (EAP-TLS)      │      │  • 12,000 users           │           │
│  │  • MAB (MAC auth)        │      │  • 100% MFA coverage     │           │
│  │  • 25,000 endpoints      │      │  • Device trust          │           │
│  │  • TrustSec SGT (15-20)  │      │  • Impossible travel     │           │
│  │  • 30+ SGACLs            │      │  • UEBA integration      │           │
│  │  • pxGrid 2.0 (XDR/FMC)  │      │  • Risk-based auth       │           │
│  └──────────────────────────┘      └──────────────────────────┘           │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TIER 3: NETWORK SECURITY                                                   │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  ┌──────────────────────────┐      ┌──────────────────────────┐           │
│  │  FTD Firewalls (18 HA)   │      │  Umbrella SASE           │           │
│  │  ─────────────────────   │      │  ──────────────────      │           │
│  │  • IPS/IDS (Snort)       │      │  • DNS filtering         │           │
│  │  • SGT-aware policies    │      │  • Cloud Firewall        │           │
│  │  • File inspection       │      │  • SWG + DLP             │           │
│  │  • Malware blocking      │      │  • 6 DIA tunnels         │           │
│  │  • SSL decryption        │      │  • Anycast DDoS          │           │
│  │  • SD-WAN integration    │      │  • Investigate (TI)      │           │
│  └──────────────────────────┘      └──────────────────────────┘           │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TIER 4: ENDPOINT & PRIVILEGED ACCESS SECURITY                              │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  ┌──────────────────────────┐      ┌──────────────────────────┐           │
│  │  AMP for Endpoints       │      │  CyberArk PAM            │           │
│  │  ─────────────────────   │      │  ──────────────────      │           │
│  │  • 15,000+ agents        │      │  • Password vault        │           │
│  │  • Behavioral detection  │      │  • Session recording     │           │
│  │  • File trajectory       │      │  • Priv account mgmt     │           │
│  │  • Orbital forensics     │      │  • API integration       │           │
│  │  • Malware sandboxing    │      │  • 30-day auto-rotate    │           │
│  └──────────────────────────┘      └──────────────────────────┘           │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  TIER 5: MONITORING & INTELLIGENCE                                          │
│  ═══════════════════════════════════════════════════════════════════════   │
│                                                                             │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐             │
│  │ Splunk │  │  DNAC  │  │Thousand│  │ AppD   │  │ Webex  │             │
│  │  SIEM  │  │ Assure │  │  Eyes  │  │Cognition│  │  Obs   │             │
│  │100GB/d │  │  DNM   │  │ 6 Hubs │  │ Engine │  │Contact │             │
│  │ 90-day │  │  AI    │  │Path AI │  │  AIOps │  │ Center │             │
│  └────────┘  └────────┘  └────────┘  └────────┘  └────────┘             │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 1.1.2 Security Platform Integration Matrix

| Source Platform | Destination Platform | Integration Method | Data Flow Type | Refresh Rate | Use Case |
|----------------|---------------------|-------------------|----------------|--------------|----------|
| ISE | XDR (SecureX) | pxGrid 2.0 API (WebSocket) | Session, SGT, user/device context | Real-time | User/device enrichment for incidents |
| ISE | FMC | pxGrid + SXP | IP-to-SGT bindings | 5 minutes | SGT-aware firewall policies |
| ISE | Duo | RADIUS | MFA challenge/response | Real-time | Multi-factor authentication |
| FTD | XDR | eStreamer (syslog) | Security events, intrusion alerts | Real-time | Threat detection, correlation |
| FMC | ISE | pxGrid | User/device identity enrichment | Real-time | Identity-based firewall rules |
| Duo | XDR | Admin API (REST) | Auth events, impossible travel, device trust | Real-time | Authentication anomaly detection |
| Duo | ISE | RADIUS | MFA validation | Real-time | Network access control |
| Umbrella | XDR | S3 API | DNS queries, proxy logs, blocked domains | 5 minutes | DNS-layer threat detection |
| AMP | XDR | Cloud API (REST) | File execution, malware detection, isolation | Real-time | Endpoint threat detection |
| AMP Orbital | XDR | On-demand API | Forensics data (registry, files, processes) | On-demand | Incident investigation, forensics |
| Splunk | XDR | REST API | Correlated alerts, risk scores, UEBA | 5 minutes | Advanced threat detection, analytics |
| XDR | ServiceNow | REST API | Incident creation, status updates, enrichment | Real-time | Automated ticketing, workflow |
| XDR | Webex Teams | Webhook | Alert notifications, case updates | Real-time | SOC collaboration, comms |
| DNAC | Splunk | REST API (polling) | Assurance data, client health, device issues | 5 minutes | Network monitoring, correlation |
| ThousandEyes | Splunk | HTTP API | Path metrics, test results, BGP data | 5 minutes | Network path monitoring |
| AppDynamics | Splunk | HTTP API | APM data, transaction metrics, Cognition insights | 5 minutes | Application performance monitoring |
| vManage (SD-WAN) | Splunk | REST API | vEdge stats, tunnel health, app-aware routing | 5 minutes | SD-WAN monitoring |
| Secure Email | XDR | Cloud API | Email threat data, sandbox results, DLP | 15 minutes | Email security, phishing detection |

**Total Data Integration Points:** 17 bi-directional integrations, 100+ API calls per minute

### 1.2 Threat Landscape for Financial Services

As a financial services organization, Abhavtech faces sophisticated threat actors motivated by financial gain, espionage, and disruption. The threat landscape analysis is based on MITRE ATT&CK for Enterprise, Cisco Talos Intelligence, FS-ISAC threat advisories, and CISA alerts.

#### 1.2.1 Threat Actor Profiles & Tactics

| Threat Actor Type | Primary Motivation | Sophistication Level | Attack Vectors | Annual Incident Probability | Average Financial Impact | Abhavtech Defensive Posture |
|------------------|-------------------|---------------------|----------------|---------------------------|-------------------------|---------------------------|
| **Ransomware Groups (RaaS)** | Financial extortion ($5M-$50M ransoms) | High (professional operations, 24x7 support) | Phishing → credential theft → lateral movement → encryption + data theft (double extortion) | 70% (industry avg: 85% of financial services targeted) | $5M-$10M (ransom + recovery + downtime + reputation) | **STRONG:** AMP behavioral detection (93% efficacy), PB-005 auto-response (2-min MTTR), Veeam immutable backups (3-2-1 rule, 4-hour RTO) |
| **Business Email Compromise** | Wire fraud, invoice manipulation | Medium (social engineering focus) | Spear phishing → account takeover → CEO impersonation → fraudulent wire transfers | 60% (FS-ISAC: 45% of financial institutions affected in 2024) | $10K-$500K per incident (avg: $120K) | **STRONG:** Secure Email sandbox (92% detection rate), Duo MFA (100% coverage, impossible travel), UEBA baselines (risk score >75 = alert), PB-007 phishing response |
| **Insider Threats** | Data theft, sabotage, competitive advantage | Low-Medium (authorized access, hard to detect) | Privileged account abuse → data exfiltration via USB/cloud/email → IP theft | 35% (34% of all breaches involve insiders per Verizon DBIR) | $500K-$2M (IP theft, competitive damage, legal costs) | **MEDIUM:** UEBA behavioral baselines (90-day training), DLP (email/web/firewall), CyberArk PAM (session recording), SGT segmentation (least privilege), NetFlow volumetric analysis (>100GB egress = alert) |
| **Nation-State APTs** | Espionage, IP theft, long-term access, geopolitical objectives | Very High (APT28, APT29, APT41, Lazarus Group) | Supply chain attacks → zero-day exploits → persistent backdoors → credential harvesting → slow data exfiltration | 12% (targeted attacks on critical financial infrastructure) | $10M+ (IP theft, regulatory penalties, customer trust loss) | **MEDIUM:** Threat intel feeds (Talos, FS-ISAC, CISA), XDR correlation (8 data sources), quarterly external pen tests, network segmentation (SGT micro-segmentation), air-gapped backups |
| **Cybercriminals (Opportunistic)** | Credit card data theft, PCI database breaches | Medium (automated scanners, SQL injection, web skimming) | Web application vulnerabilities → SQL injection → database exfiltration → dark web sale | 45% (e-commerce/payment processing targets) | $500K-$2M (PCI fines $5K-$500K per month, forensics, credit monitoring) | **STRONG:** PCI-DSS compliance (quarterly audits), SGT segmentation (CDE isolated, SGT 85-89), WAF protection, TLS 1.2+ encryption, quarterly Nessus scans, Tenable vulnerability management |
| **Hacktivists** | Reputational damage, political statement, service disruption | Low-Medium (scripted DDoS, website defacement, data leaks) | DDoS attacks (volumetric, application-layer) → website defacement → data leaks (publicly embarrass) | 20% (public-facing organizations, controversial policies) | $100K-$500K (downtime, reputation, PR response) | **MEDIUM:** Umbrella Anycast DDoS mitigation (auto-scaling), CloudFlare (secondary), FTD rate limiting, SD-WAN traffic shaping, PB-008 DDoS response playbook |

#### 1.2.2 MITRE ATT&CK Top 20 Techniques (Abhavtech Risk Matrix)

**Risk Scoring Methodology:**
- **Likelihood:** Based on industry data (FS-ISAC, Verizon DBIR, CISA) + Abhavtech-specific factors (attack surface, controls)
- **Impact:** Rated as LOW (minor), MEDIUM (significant), HIGH (major), CRITICAL (catastrophic)
- **Risk Score:** (Likelihood_Percentage × 0.6) + (Impact_Value × 0.4) × 100
  - Impact Values: LOW=1, MEDIUM=2, HIGH=3, CRITICAL=4

| Rank | MITRE ID | Technique Name | Tactic | Abhavtech Attack Surface | Likelihood | Impact | Risk Score | Primary Detection Method | Secondary Detection | Automated Response |
|------|---------|----------------|--------|-------------------------|------------|--------|-----------|------------------------|-------------------|-------------------|
| 1 | T1566.001 | Phishing: Spearphishing Attachment | Initial Access | 3,200 email users, M365 integration, remote workforce | **HIGH (75%)** | **CRITICAL** | **95** | Secure Email sandbox (machine learning, 92% detection rate), AMP file reputation (Talos TI), suspicious attachment blocking (.js, .vbs, .wsf, .hta) | User-reported phishing button (M365), Splunk email analysis (sender reputation, domain age), XDR email threat correlation | **PB-007 (Manual):** Quarantine email → Extract IOCs → Block domains (Umbrella) → Alert users → Phishing simulation training |
| 2 | T1078 | Valid Accounts | Defense Evasion, Persistence, Privilege Escalation, Initial Access | Hybrid AD, 12,000 users, VPN (AnyConnect), Webex remote access, cloud apps (M365, Salesforce) | **HIGH (70%)** | **CRITICAL** | **90** | Duo MFA (100% coverage, push/biometric), UEBA impossible travel (>500 miles in <1 hour), failed auth rate (>5 in 10 min), ISE auth logs (anomalous locations) | CyberArk PAM monitoring (privileged accounts), Splunk correlation (auth + privileged actions), Azure AD risky sign-ins (cloud) | **PB-002 (Automated):** Lock AD account → Force MFA re-enrollment → Terminate all sessions (ISE CoA) → Password reset → Alert SOC |
| 3 | T1021.001 | Remote Desktop Protocol | Lateral Movement | 200+ servers with RDP enabled (admin access), 50+ jump hosts | **MEDIUM (45%)** | **HIGH** | **82** | FTD flow monitoring (RDP port 3389 traffic), ISE SGT violation alerts (unauthorized SGT → server SGT), NetFlow analysis (unusual RDP patterns) | Splunk Windows Event ID 4624 (logon type 10 = RDP), CyberArk session recording (privileged RDP), UEBA (unusual RDP usage) | **PB-003 (Semi-Auto):** ISE CoA → Terminate RDP session → Block source IP (FTD) → Quarantine source device (SGT 999) → SOC investigation |
| 4 | T1486 | Data Encrypted for Impact | Impact | Critical business data (ERP, CRM, file servers), financial systems (payment processing) | **MEDIUM (40%)** | **CRITICAL** | **85** | AMP behavioral ransomware detection (file encryption patterns, rapid file writes, suspicious processes), Splunk VSS deletion alerts (vssadmin delete shadows), UEBA (unusual file access patterns) | FTD file inspection (known ransomware signatures), Orbital forensics (process tree, registry keys), backup system alerts (VSS service stopped) | **PB-005 (Automated):** AMP isolate endpoints → ISE CoA SGT 999 → Network segmentation (disable inter-VLAN) → Verify Veeam backups → Forensics collection → Recovery plan |
| 5 | T1071.001 | Application Layer Protocol: Web Protocols | Command and Control | HTTPS outbound allowed (100+ SaaS apps), web browsing (12,000 users) | **HIGH (65%)** | **MEDIUM** | **77** | Umbrella Investigate (domain reputation <-100), FTD SSL decryption + IPS (C2 signatures), XDR Threat Response (Talos TI, VirusTotal) | Splunk DNS analysis (DGA detection, newly-seen domains), ThousandEyes BGP monitoring (suspicious ASNs), NetFlow (beaconing patterns: regular intervals) | **Semi-Auto:** FTD block IP → Umbrella block domain → ISE quarantine device → XDR case creation → SOC investigation |
| 6 | T1059.001 | Command and Scripting: PowerShell | Execution | Windows endpoints (3,000+), AD automation, admin scripts | **HIGH (60%)** | **MEDIUM** | **72** | AMP execution analysis (PowerShell commands, encoded scripts), Splunk PowerShell logging (Event ID 4104: script block logging), UEBA (unusual PowerShell usage by standard users) | Windows Defender ATP (if available), CyberArk PAM (privileged PowerShell sessions), Orbital forensics (PowerShell command history) | **Manual:** Splunk alert → SOC review script → If malicious: AMP isolate → ISE quarantine → Forensics |
| 7 | T1053.005 | Scheduled Task/Job: Scheduled Task | Persistence, Privilege Escalation | Windows Task Scheduler (all Windows endpoints/servers) | **MEDIUM (50%)** | **MEDIUM** | **66** | Splunk Windows Event ID 4698 (scheduled task creation), UEBA baseline deviations (unusual task creation times/users), AMP process monitoring | Orbital forensics (task XML content), CyberArk PAM (privileged task creation), Splunk correlation (task creation + suspicious process execution) | **Manual:** Splunk alert → SOC review task → If malicious: Delete task → Isolate endpoint → Investigate |
| 8 | T1105 | Ingress Tool Transfer | Command and Control | Internet-facing assets (DMZ web servers), VPN endpoints, email attachments | **MEDIUM (45%)** | **HIGH** | **69** | FTD file inspection (malicious file downloads), AMP file trajectory (file origin, propagation), Umbrella proxy (file downloads from suspicious domains) | Secure Email attachment sandboxing, Splunk HTTP download analysis, XDR file reputation (Talos, VirusTotal) | **Semi-Auto:** AMP block file → FTD block source IP → Umbrella block domain → ISE quarantine device → SOC investigation |
| 9 | T1562.001 | Impair Defenses: Disable or Modify Tools | Defense Evasion | AMP agents (15,000+), Windows Defender, ISE services, firewall rules | **MEDIUM (40%)** | **MEDIUM** | **60** | AMP heartbeat monitoring (agent offline >15 min), Splunk service stop alerts (Event ID 7036: AMP Connector, ISE services), Windows Defender status monitoring | DNAC device health monitoring (ISE services), FMC health checks (FTD services), CyberArk PAM (privileged service manipulation) | **Automated:** Splunk alert → Automated remediation (restart service if possible) → SOC escalation if fails → Endpoint isolation |
| 10 | T1048.003 | Exfiltration Over Alternative Protocol | Exfiltration | Multiple egress paths (DIA tunnels × 6, VPN, Webex, M365) | **MEDIUM (45%)** | **HIGH** | **69** | NetFlow volumetric analysis (>100GB egress threshold, >3 std dev from baseline), DLP (Umbrella, FTD, Secure Email), UEBA (unusual data access patterns) | Splunk DNS tunneling detection (high entropy queries), ThousandEyes bandwidth monitoring, FTD SSL decryption + DPI | **PB-004 (Semi-Auto):** ISE CoA terminate session → FTD block dest IP → Umbrella block domain → SOC investigation (scope) → Forensics |
| 11 | T1055 | Process Injection | Defense Evasion, Privilege Escalation | Windows systems (malware evasion technique) | **MEDIUM (40%)** | **MEDIUM** | **60** | AMP behavioral detection (injection patterns: CreateRemoteThread, NtQueueApcThread), Orbital forensics (process tree analysis, injected DLLs) | Windows Defender ATP (process hollowing detection), Splunk Sysmon Event ID 8 (CreateRemoteThread), UEBA (unusual process behavior) | **Manual:** AMP alert → SOC investigation → If malicious: Isolate endpoint → Forensics → Remediate |
| 12 | T1003.001 | OS Credential Dumping: LSASS Memory | Credential Access | Domain controllers, member servers (LSASS process running on all Windows) | **LOW (20%)** | **CRITICAL** | **62** | CyberArk PAM (privileged sessions), Splunk Event ID 4656 (LSASS process access), AMP behavioral detection (mimikatz, procdump patterns) | Orbital forensics (processes accessing LSASS), Windows Defender Credential Guard (prevents LSASS dumping), UEBA (unusual admin tool usage) | **Semi-Auto:** Splunk alert → SOC investigation → If confirmed: Isolate server → Reset all domain passwords (emergency) → CyberArk rotate |
| 13 | T1110.001 | Brute Force: Password Guessing | Credential Access | Exposed login pages (VPN, Webex, M365), SSH/RDP servers | **MEDIUM (35%)** | **MEDIUM** | **54** | Duo rate limiting (5 failed attempts = account lockout), ISE failed auth alerts (>5 in 10 min), Azure AD risky sign-ins (cloud apps) | Splunk correlation (multiple failed auths from same IP), FTD connection rate limiting, UEBA (unusual auth patterns) | **Semi-Auto:** Duo lockout account → FTD block source IP (after 10 attempts) → SOC notification → Investigate source IP (TOR, VPN, compromised host?) |
| 14 | T1068 | Exploitation for Privilege Escalation | Privilege Escalation | Windows/Linux systems (unpatched vulnerabilities, kernel exploits) | **LOW (15%)** | **HIGH** | **51** | Tenable Nessus quarterly scans (CVE detection), Talos IPS signatures (exploit detection), Splunk patch compliance dashboard | AMP behavioral detection (unusual system calls, kernel module loading), Orbital forensics (exploit artifacts), Windows Update status monitoring | **Manual:** Tenable report → Prioritize critical/high CVEs → ServiceNow patch tickets → Remediate within SLA (7 days critical, 30 days high) |
| 15 | T1547.001 | Boot or Logon Autostart Execution: Registry Run Keys / Startup Folder | Persistence | Windows endpoints (registry keys: HKCU/HKLM\Software\Microsoft\Windows\CurrentVersion\Run) | **MEDIUM (35%)** | **LOW** | **43** | AMP registry monitoring (Run key modifications), Splunk Event ID 4657 (registry value creation/modification), UEBA (unusual persistence mechanisms) | Orbital forensics (registry key contents), Windows Defender (startup item monitoring), CyberArk PAM (privileged registry access) | **Manual:** Splunk alert → SOC review registry key → If malicious: Delete key → AMP scan endpoint → Isolate if needed |
| 16 | T1027 | Obfuscated Files or Information | Defense Evasion | Email attachments, web downloads, malware payloads | **MEDIUM (40%)** | **MEDIUM** | **56** | Secure Email sandbox (detonation of obfuscated files), AMP static/dynamic analysis (entropy analysis, unpacking), FTD file reputation | Splunk base64/hex encoding detection (suspicious scripts), Umbrella proxy (obfuscated downloads), XDR Threat Response (file reputation) | **Semi-Auto:** Secure Email quarantine → AMP block hash → Umbrella block domain → SOC investigation → User notification |
| 17 | T1090 | Proxy: Internal Proxy, External Proxy, Multi-hop Proxy | Command and Control | Internet access required for business operations, proxy servers | **LOW (25%)** | **MEDIUM** | **43** | Umbrella proxy detection (suspicious proxy usage), FTD flow analysis (proxy traffic patterns), Splunk DNS (proxy domain queries) | ThousandEyes BGP monitoring (TOR exit nodes, VPN providers), NetFlow (connection chaining patterns), UEBA (unusual proxy usage) | **Manual:** Splunk alert → SOC investigation → If malicious: FTD block proxy IP → ISE quarantine user → Investigate intent |
| 18 | T1574.002 | Hijack Execution Flow: DLL Side-Loading | Persistence, Privilege Escalation, Defense Evasion | Windows systems (DLL search order hijacking) | **LOW (20%)** | **MEDIUM** | **40** | AMP DLL load monitoring (unsigned DLLs, suspicious paths), Orbital forensics (DLL load order), Splunk Event ID 7045 (service installation) | Windows Application Control (if deployed), CyberArk PAM (privileged DLL operations), UEBA (unusual DLL activity) | **Manual:** AMP alert → SOC investigation → If malicious: AMP isolate → Delete malicious DLL → Forensics → Remediate |
| 19 | T1136.001 | Create Account: Local Account | Persistence | Local admin rights on endpoints (some power users, helpdesk) | **LOW (20%)** | **MEDIUM** | **40** | Splunk Event ID 4720 (user account creation), CyberArk PAM audit (privileged account creation), UEBA (unusual account creation by non-IT users) | Active Directory monitoring (new user accounts), ISE endpoint profiling (new machine accounts), Orbital forensics | **Manual:** Splunk alert → SOC verify account (legitimate vs. malicious) → If malicious: Delete account → Isolate endpoint → Investigate |
| 20 | T1087.002 | Account Discovery: Domain Account | Discovery | Active Directory environment (LDAP queries, net commands) | **MEDIUM (30%)** | **LOW** | **34** | Splunk AD query monitoring (Event ID 4662: directory service access), UEBA (unusual AD queries by standard users), CyberArk PAM (privileged AD enumeration) | Orbital forensics (net user, net group commands), Windows Event ID 4798 (user enumeration), FTD (excessive LDAP traffic) | **Manual:** Splunk alert → SOC investigate query source → If reconnaissance: Quarantine device → Investigate for further compromise |

**Risk Heatmap Summary:**
- **CRITICAL Risk (Score 85-100):** 4 techniques (T1566.001, T1078, T1021.001, T1486)
- **HIGH Risk (Score 65-84):** 6 techniques (T1071.001, T1059.001, T1053.005, T1105, T1562.001, T1048.003)
- **MEDIUM Risk (Score 45-64):** 8 techniques (T1055, T1003.001, T1110.001, T1068, T1547.001, T1027, T1090, T1574.002)
- **LOW Risk (Score 20-44):** 2 techniques (T1136.001, T1087.002)

**Quarterly Review Process:**
1. Q1: SOC Lead reviews Top 20 list, updates likelihood based on recent incidents
2. Q2: Threat Hunter validates detection coverage, tests detection methods
3. Q3: Security Manager assesses control effectiveness, updates risk scores
4. Q4: CISO reviews annual trends, adjusts security budget/priorities for next year

### 1.3 Compliance Requirements

Abhavtech maintains compliance with multiple regulatory frameworks governing financial services, data protection, and information security. The compliance program operates under the direction of the CISO with oversight from the Compliance Analyst and external auditors.

#### 1.3.1 Compliance Framework Landscape

| Framework | Version | Applicability | Scope | Audit Frequency | Auditor | Last Audit Date | Next Audit Date | Current Status | Critical Findings | Medium Findings | Low Findings |
|-----------|---------|--------------|-------|-----------------|---------|----------------|----------------|----------------|------------------|----------------|--------------|
| **PCI-DSS** | v4.0 (2024) | All systems handling cardholder data | Cardholder Data Environment (CDE): SGT 85-89, payment gateway (8 servers), web servers (4), databases (2) | Quarterly (Report on Compliance) | External QSA (Trustwave) | 2024-Q4 (Dec 15, 2024) | 2025-Q1 (Mar 15, 2025) | ✅ **COMPLIANT** | 0 | 2 | 3 |
| **SOC 2 Type II** | AICPA TSC (2023) | Customer-facing SaaS platform, APIs | Cloud services (AWS), customer data processing, API gateway, web apps | Annual (12-month observation) | External auditor (Deloitte) | 2024-11 (Nov 30, 2024) | 2025-11 (Nov 30, 2025) | ✅ **COMPLIANT** | 0 | 0 | 1 |
| **GDPR** | 2016/679 (EU) | EU personal data processing | EMEA sites (London, Frankfurt, Amsterdam), EU customer data, employee data (EU residents) | Continuous (self-assessment) | Internal + Legal review | 2024-12 (Dec 31, 2024) | N/A (continuous) | ✅ **COMPLIANT** | 0 | 1 | 2 |
| **ISO 27001** | 2022 (updated Oct 2022) | Enterprise-wide ISMS | All IT systems, 93 controls across 4 themes (Organizational, People, Physical, Technological) | Annual (surveillance audit) | External auditor (BSI) | 2024-10 (Oct 15, 2024) | 2025-10 (Oct 15, 2025) | ✅ **COMPLIANT** | 0 | 3 | 5 |
| **NIST CSF** | 2.0 (Feb 2024) | Voluntary cybersecurity framework | All security operations, 6 functions (GOVERN added in 2.0) | Self-Assessment (Quarterly) | Internal (CISO + Security Manager) | 2025-Q1 (Jan 15, 2025) | 2025-Q2 (Apr 15, 2025) | ✅ **ON TRACK** | N/A | N/A | N/A |
| **CIS Controls** | v8 (May 2021) | 18 critical security controls | All IT infrastructure, targeting IG2 (enterprise baseline) and IG3 (critical systems) | Self-Assessment (Semi-Annual) | Internal (Security Manager + team) | 2024-H2 (Dec 31, 2024) | 2025-H1 (Jun 30, 2025) | ✅ **ON TRACK** | N/A | N/A | N/A |

**Compliance Dashboard (Executive View):**
- **Overall Compliance Score:** 97% (weighted average across all frameworks)
- **Audit Readiness:** 95% (evidence collection completeness)
- **Outstanding Findings:** 3 Medium, 11 Low (no Critical findings)
- **Remediation Target:** All Medium findings closed by 2025-Q2

#### 1.3.2 PCI-DSS v4.0 Detailed Compliance Matrix

**PCI-DSS Scope:** Abhavtech processes credit card transactions for customer payments (online, phone orders). The Cardholder Data Environment (CDE) consists of:
- **Web Servers (DMZ, SGT 85):** 4 servers hosting payment forms (HTTPS only, TLS 1.2+)
- **Application Servers (SGT 86):** 8 servers running payment processing logic (middleware, encryption, tokenization)
- **Database Servers (SGT 87):** 2 SQL servers storing tokenized card data (last 4 digits only, tokens linked to payment gateway)
- **Management Servers (SGT 88):** 2 jump hosts for CDE administration (CyberArk PAM, SOC access only)
- **Backup Servers (SGT 89):** 2 Veeam servers for CDE backups (encrypted, immutable, 90-day retention)

**Total CDE Assets:** 18 servers, segregated via TrustSec SGTs 85-89

**PCI-DSS v4.0 Requirements & Abhavtech Implementation:**

| Requirement | Sub-Requirements | Abhavtech Implementation | Control Evidence | Last Validated | Audit Finding |
|-------------|-----------------|-------------------------|-----------------|----------------|--------------|
| **1: Install and Maintain Network Security Controls** | 1.1-1.5 (Firewall rules, network segmentation) | • FTD firewalls (18 units) with default-deny policies<br>• TrustSec SGT segmentation (CDE isolated: SGT 85-89)<br>• SGACLs: Deny all except SGT 85→86→87 (payment flow)<br>• DMZ separation: SGT 85 (public) ← FTD ← Internet<br>• Annual firewall rule review (Dec 2024) | • FMC policy export (1,245 rules, default-deny at end)<br>• DNAC SGT matrix (15 SGTs, 32 SGACLs)<br>• ISE SGACL configs (SGT 85→86→87 allow, all else deny)<br>• Firewall rule review meeting minutes (Dec 5, 2024) | 2024-Q4 | ✅ PASS |
| **2: Apply Secure Configurations to All System Components** | 2.1-2.3 (Hardening, baseline configs) | • DNAC templates (CIS benchmarks for switches/routers)<br>• FMC platform settings (CIS benchmarks for FTD)<br>• Server hardening: CIS Windows Server 2022 / RHEL 8<br>• Service minimization (only required services enabled)<br>• Default password changes (all systems)<br>• Configuration management database (ServiceNow CMDB) | • DNAC template library (48 templates)<br>• FMC baseline configs (saved as "CDE-Baseline")<br>• Ansible playbooks (server hardening, 120 tasks)<br>• ServiceNow CMDB (18 CDE servers, config tracking) | 2024-Q4 | ✅ PASS (1 Medium finding: Document baseline rationale for custom configs) |
| **3: Protect Stored Account Data** | 3.1-3.7 (Encryption, tokenization, data retention) | • **Tokenization:** Primary card data sent to payment gateway (Stripe), only tokens stored in Abhavtech DB<br>• **Encryption at rest:** SQL Server TDE (AES-256), encryption keys in CyberArk vault<br>• **Data retention:** 90 days (transaction history), auto-purge after 90 days (SQL job)<br>• **Key management:** CyberArk PAM vault, annual key rotation<br>• **Rendering PAN unreadable:** Full PAN never stored, only last 4 digits + token | • Payment gateway integration diagram<br>• SQL Server TDE config screenshot (AES-256 enabled)<br>• CyberArk vault policy (encryption keys, rotation schedule)<br>• SQL job script (auto-purge after 90 days)<br>• Database schema (PAN column = token only, 32-char hash) | 2024-Q4 | ✅ PASS |
| **4: Protect Cardholder Data with Strong Cryptography During Transmission** | 4.1-4.2 (TLS, strong ciphers) | • **Web forms (customer):** TLS 1.2 / 1.3 only, cipher suite: TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384<br>• **API calls (payment gateway):** TLS 1.2, mutual TLS (client cert)<br>• **Weak ciphers disabled:** TLS 1.0/1.1, SSLv3, RC4, DES, 3DES all disabled<br>• **Certificate management:** Let's Encrypt auto-renewal (90-day certs), wildcard cert for *.abhavtech.com | • SSL Labs scan report (A+ rating, TLS 1.2/1.3 only)<br>• Cipher suite config (web server + load balancer)<br>• Certificate inventory (Let's Encrypt, auto-renewal logs)<br>• Weak cipher scan (Nessus report: 0 weak ciphers found) | 2024-Q4 | ✅ PASS |
| **5: Protect All Systems and Networks from Malicious Software** | 5.1-5.4 (Anti-malware, updates) | • **AMP for Endpoints:** 15,000+ agents, 99.2% coverage<br>• **CDE servers:** AMP Linux (for RHEL), AMP Windows<br>• **Behavioral detection:** Ransomware detection (file encryption patterns)<br>• **Signature updates:** AMP signatures auto-update (Talos, daily)<br>• **Malware scans:** Daily full scans (scheduled 2 AM), on-access scanning (real-time) | • AMP admin console screenshot (agent deployment list)<br>• AMP policy config (daily scans enabled, real-time protection)<br>• AMP signature version (updated daily, last update: 2025-01-23)<br>• AMP detection report (Q4 2024: 45 malware detections, all blocked) | 2024-Q4 | ✅ PASS |
| **6: Develop and Maintain Secure Systems and Software** | 6.1-6.5 (Patching, vulnerability management, secure dev) | • **Patch management:** Tenable Nessus quarterly scans, critical vulns patched within 7 days<br>• **CDE patch priority:** Critical vulns patched within 48 hours (emergency change)<br>• **Vulnerability tracking:** ServiceNow (automated ticket creation from Nessus)<br>• **Secure development:** SAST (SonarQube), DAST (OWASP ZAP), code review (GitLab MRs)<br>• **Change control:** ServiceNow CAB approval for all CDE changes | • Nessus scan report (Q4 2024: 3 critical vulns, patched within 48 hours)<br>• ServiceNow patch tickets (18 CDE servers, 100% patched)<br>• SonarQube scan results (0 critical issues in payment app code)<br>• Change request logs (Q4 2024: 12 CDE changes, all CAB-approved) | 2024-Q4 | ✅ PASS |
| **7: Restrict Access to System Components and Cardholder Data by Business Need to Know** | 7.1-7.3 (Least privilege, RBAC, access reviews) | • **Role-based access control:** ISE authorization policies (SGT-based)<br>• **Least privilege:** SOC analysts (SGT 10) can access CDE (SGT 85-89), Finance users (SGT 81) CANNOT<br>• **CyberArk PAM:** All CDE admin access via jump hosts (SGT 88), session recording<br>• **Quarterly access reviews:** Compliance Analyst reviews ISE policies, removes unused accounts<br>• **Segregation of duties:** Developers (SGT 60) CANNOT access production CDE | • ISE authorization policy export (SGT 10 → SGT 85-89 = Permit, SGT 15/81/82 → SGT 85-89 = Deny)<br>• CyberArk PAM audit log (all CDE admin sessions, session recordings)<br>• Quarterly access review report (Q4 2024: 5 unused accounts removed)<br>• SOD matrix (Developer vs. Production Admin = conflict, separate AD groups) | 2024-Q4 | ✅ PASS |
| **8: Identify Users and Authenticate Access to System Components** | 8.1-8.6 (MFA, strong passwords, account management) | • **Multi-factor authentication:** Duo MFA (100% coverage), push/biometric<br>• **All CDE access:** Duo MFA required (admin, jump hosts, VPN to CDE)<br>• **Password complexity:** AD policy (12 char min, complexity, 90-day expiration)<br>• **Account lockout:** 5 failed attempts = 30-min lockout<br>• **Privileged accounts:** CyberArk PAM, 30-day auto-rotate, session recording | • Duo admin console report (12,000 users, 100% enrolled)<br>• Duo policy config (MFA required for all CDE access)<br>• AD Group Policy Object (password policy screenshot)<br>• CyberArk vault report (18 CDE admin accounts, 30-day rotation) | 2024-Q4 | ✅ PASS |
| **9: Restrict Physical Access to Cardholder Data** | 9.1-9.5 (Badge system, CCTV, visitor management) | • **Data center physical security:** Badge system (HID prox cards), mantrap entry (NJ, London, Mumbai DCs)<br>• **CCTV surveillance:** 24x7 recording, 90-day retention, motion detection alerts<br>• **Visitor management:** Sign-in kiosk, escort required, visitor badge (auto-expires 8 hours)<br>• **Equipment cage:** Locked racks (CDE servers in separate cages), inventory tags<br>• **Quarterly audits:** Physical security audit (badge logs, CCTV footage review) | • PACS badge access logs (CDE data center, Q4 2024: 145 entries, all authorized)<br>• CCTV footage samples (random date, 24-hour review: no unauthorized access)<br>• Visitor log (Q4 2024: 12 visitors, all escorted, badge returned)<br>• Equipment inventory (CDE server cage, 18 servers, all tags present) | 2024-Q4 | ✅ PASS |
| **10: Log and Monitor All Access to System Components and Cardholder Data** | 10.1-10.7 (Audit logging, SIEM, log retention) | • **Centralized logging:** Splunk SIEM (100GB/day), CDE logs prioritized<br>• **Log sources:** FTD, ISE, CDE servers (Windows/Linux), payment app logs<br>• **Retention:** 90 days (hot), 1 year (archive to S3), 7 years (tape for legal hold)<br>• **Log review:** Daily SOC review (Splunk dashboards), automated alerts (suspicious activity)<br>• **Audit trail integrity:** Splunk log hashing (SHA-256), tamper detection | • Splunk index stats (index=pci_cde, 12GB/day avg, 90-day retention)<br>• Log source inventory (18 CDE servers, all forwarding to Splunk)<br>• Splunk dashboard screenshot (PCI-DSS Compliance Dashboard)<br>• Splunk alert examples (failed auth, privileged access, config changes) | 2024-Q4 | ✅ PASS (1 Medium finding: Enable NTP sync verification alerts for CDE servers) |
| **11: Test Security of Systems and Networks Regularly** | 11.1-11.6 (Vulnerability scans, pen tests, IDS/IPS) | • **Quarterly vulnerability scans:** Tenable Nessus (Approved Scanning Vendor), all CDE IPs<br>• **Annual external pen test:** Rapid7 (PCI-certified pen tester), full CDE scope<br>• **IDS/IPS:** FTD Snort IPS (CDE ingress/egress traffic monitoring), Talos signatures<br>• **File integrity monitoring:** Tripwire (CDE servers, critical file monitoring)<br>• **Network segmentation testing:** Annual SGACL testing (verify SGT isolation) | • Nessus scan report (Q4 2024: 0 critical/high vulns in CDE, "PASS" certification)<br>• Rapid7 pen test report (Dec 2024: 2 medium findings, remediated Jan 2025)<br>• FMC IPS stats (CDE traffic: 145K IPS events blocked in Q4 2024)<br>• Tripwire alerts (Q4 2024: 3 file change alerts, all authorized changes) | 2024-Q4 | ✅ PASS |
| **12: Support Information Security with Organizational Policies and Programs** | 12.1-12.10 (Policies, awareness, incident response) | • **Security policy:** Information Security Policy (v5.2, updated Oct 2024)<br>• **Acceptable Use Policy:** All employees sign AUP (annual re-acknowledgment)<br>• **Security awareness training:** Quarterly phishing simulations, annual training (Knowbe4)<br>• **Incident response plan:** XDR playbooks (PB-001 to PB-008), IR plan doc (v3.1)<br>• **Third-party vendor management:** Vendor security assessments (Tier 1: annual audit) | • Information Security Policy document (signed by CEO, Board-approved)<br>• AUP acknowledgment records (3,200 employees, 100% signed in 2024)<br>• Phishing simulation results (Q4 2024: 8% click rate, down from 15% in Q1)<br>• XDR playbook documentation (8 playbooks, tested quarterly) | 2024-Q4 | ✅ PASS |

**PCI-DSS Audit Process (Quarterly):**

1. **Week 1: Pre-Audit Preparation**
   - Evidence collection: Configs, logs, screenshots, policies, reports
   - Internal review: Compliance Analyst reviews evidence against ROC template
   - Gap remediation: Address any outstanding findings from previous quarter
   
2. **Week 2: QSA Scoping Call**
   - QSA (Trustwave) conducts scoping call with CISO + Compliance Analyst + Network team
   - Confirm CDE scope (18 servers, SGT 85-89, no changes from previous quarter)
   - Review evidence request list (30-40 documents)
   
3. **Week 3: Evidence Submission**
   - Upload evidence to QSA portal (secure SFTP)
   - QSA reviews evidence, requests clarifications/additional evidence
   
4. **Week 4: On-Site Assessment (if required)**
   - QSA on-site visit (2-3 days) for interviews, control testing, sampling
   - Interviews: CISO, Security Manager, Network Admin, DBA, SOC Analyst
   - Control testing: Validate 5 samples per control (e.g., 5 password resets, 5 access reviews)
   
5. **Week 5: Findings Review**
   - QSA issues preliminary findings report (typically 2-5 minor findings)
   - Abhavtech remediates findings (target: 7 days for Medium, immediate for Critical)
   - QSA validates remediation
   
6. **Week 6: Report on Compliance (ROC) Issuance**
   - QSA issues final ROC + Attestation of Compliance (AOC)
   - Compliance Analyst submits AOC to payment brands (Visa, Mastercard, Amex)
   - CISO presents ROC summary to Board of Directors (quarterly cyber committee meeting)

**Current Quarter Status (Q1 2025):**
- **Audit Scheduled:** Mar 8-12, 2025
- **Evidence Readiness:** 98% (2 outstanding items: NTP sync verification, custom config documentation)
- **Remediation Status:** 2 Medium findings from Q4 2024 closed (Jan 15, 2025)
- **Expected Outcome:** PASS (no critical findings anticipated)

#### 1.3.3 SOC 2 Type II Compliance

**SOC 2 Scope:** Customer-facing SaaS platform (https://platform.abhavtech.com), APIs (REST/GraphQL), customer data processing, AWS cloud infrastructure (US-East-1, US-West-2 regions).

**Trust Services Criteria (TSC) Mapped to Abhavtech Controls:**

| TSC Category | Criteria | Abhavtech Implementation | Evidence | Control Testing |
|--------------|----------|-------------------------|----------|----------------|
| **CC1: Control Environment** | CC1.1: CISO commitment to integrity/ethics | CISO reports to Board (dotted line), Security Committee (monthly), Code of Conduct (all employees sign) | • Org chart showing CISO reporting line<br>• Security Committee charter + meeting minutes<br>• Code of Conduct acknowledgment records | Annual interview (CISO, CEO, Board) |
| | CC1.2: Board oversight of cybersecurity | Board Cyber Committee (3 directors, quarterly meetings), CISO presents cybersecurity KPIs | • Board Cyber Committee charter<br>• Meeting minutes (Q1-Q4 2024)<br>• CISO presentation slides | Annual Board interview |
| | CC1.3: Organizational structure | Clear roles/responsibilities (see Section 2.1.3 GV.OV-01), RACI matrix, job descriptions | • Org chart<br>• Job descriptions (Security Manager, SOC Analyst, etc.)<br>• RACI matrix | Control design review |
| | CC1.4: Commitment to competence | Annual security training (Knowbe4), certifications (CISSP, CISM, CEH), performance reviews | • Training records (100% completion in 2024)<br>• Certification list (5 CISSPs, 2 CISMs)<br>• Performance review docs | Sample 5 employees' training records |
| | CC1.5: Accountability | Performance reviews tied to security objectives, disciplinary procedures for violations | • Performance review template (security objectives section)<br>• Disciplinary action log (2 incidents in 2024, both resolved) | Sample 5 performance reviews |
| **CC2: Communication & Information** | CC2.1: Internal communication | Weekly SOC meetings, monthly Security Committee, Webex Teams (#security channel) | • Meeting minutes (SOC, Security Committee)<br>• Webex Teams screenshot (#security channel, 1,200 messages in 2024) | Review communication logs |
| | CC2.2: External communication | Incident notification procedures (72-hour GDPR, 24-hour PCI-DSS), privacy policy (website) | • Incident notification templates<br>• Privacy policy (last updated Oct 2024)<br>• Email notification logs (1 GDPR notification in 2024) | Review notification process |
| | CC2.3: Obtaining, generating, using relevant quality information | Threat intelligence (Talos, FS-ISAC), Splunk analytics (MLTK), monthly security reports | • Threat intelligence subscriptions<br>• Splunk dashboards<br>• Monthly security reports (12 reports in 2024) | Review report quality |
| **CC3: Risk Assessment** | CC3.1: Risk identification | Quarterly risk assessments (CISO + Security Manager), risk register (ServiceNow) | • Risk register (18 risks identified in 2024)<br>• Risk assessment methodology doc<br>• Quarterly risk reports | Review risk assessment process |
| | CC3.2: Risk analysis | Risk scoring (Likelihood × Impact), risk treatment decisions (Accept, Mitigate, Transfer, Avoid) | • Risk scoring matrix<br>• Risk treatment plan (Q1-Q4 2024)<br>• Board risk summary | Sample 5 risks' analysis |
| | CC3.3: Risk response | Mitigation plans (ServiceNow tasks), risk monitoring (quarterly), cyber insurance ($5M coverage) | • ServiceNow risk mitigation tasks<br>• Cyber insurance policy (Chubb, $5M coverage)<br>• Risk monitoring reports | Review mitigation effectiveness |
| | CC3.4: Fraud risk assessment | Insider threat UEBA baselines, BEC detection (Duo MFA, Secure Email), anti-fraud controls | • UEBA risk scores<br>• BEC detection stats (45 blocked in 2024)<br>• Anti-fraud policy | Test fraud detection controls |
| **CC4: Monitoring Activities** | CC4.1: Ongoing monitoring | 24x7 SOC monitoring, XDR alerts (real-time), Splunk dashboards (continuous) | • SOC shift logs (365 days of 24x7 coverage)<br>• XDR alert logs (12,000 alerts in 2024)<br>• Splunk uptime report (99.97% uptime) | Review monitoring logs |
| | CC4.2: Evaluating control deficiencies | Quarterly control effectiveness reviews, audit findings tracking (ServiceNow), remediation plans | • Control effectiveness reviews (Q1-Q4 2024)<br>• Audit findings log (0 critical, 3 medium in 2024)<br>• Remediation status reports | Sample 3 findings' remediation |
| **CC5: Control Activities** | CC5.1: Selection and development of controls | Security control framework (NIST CSF, CIS Controls, ISO 27001), control mapping | • Control framework documents<br>• Control mapping spreadsheet (93 ISO 27001 controls)<br>• Control implementation evidence | Review control selection rationale |
| | CC5.2: Controls in place for technology | ISE 802.1X, Duo MFA, FTD IPS, AMP, Umbrella, encryption (TLS 1.2+, AES-256) | • See Sections 1.1, 2.3, 2.4 for detailed controls<br>• Configuration evidence (ISE, FTD, etc.) | Test technical controls |
| | CC5.3: Policies and procedures | Information Security Policy (v5.2), Acceptable Use Policy, IR plan, change management policy | • Policy documents (8 policies, all Board-approved)<br>• Procedure documents (45 procedures)<br>• Policy acknowledgment records | Review policies |
| **CC6: Logical & Physical Access Controls** | CC6.1: Logical access (users) | ISE 802.1X (all users), Duo MFA (100% coverage), RBAC (ISE SGTs), quarterly access reviews | • ISE authentication reports (99.5% success rate)<br>• Duo enrollment list (12,000 users)<br>• Quarterly access review reports | Test access provisioning/de-provisioning |
| | CC6.2: Logical access (privileged) | CyberArk PAM (all admin accounts), Duo MFA (all admins), jump hosts (SGT 88), session recording | • CyberArk admin list (45 privileged accounts)<br>• Duo admin MFA logs<br>• CyberArk session recording samples | Test privileged access controls |
| | CC6.3: Logical access (removal) | Automated de-provisioning (Workday → AD → ISE → Duo), termination checklist (ServiceNow) | • De-provisioning automation logs (125 terminations in 2024, all within 1 hour)<br>• ServiceNow termination tickets | Sample 5 terminations |
| | CC6.6: Encryption | TLS 1.2+ (web apps, APIs), AES-256 (data at rest), IPsec (SD-WAN), MACsec (fabric) | • SSL Labs scan reports (A+ rating)<br>• TLS config (cipher suites)<br>• SQL Server TDE config (AES-256) | Test encryption implementation |
| | CC6.7: Physical access | Badge system (HID), CCTV (24x7), mantraps (DCs), visitor management, equipment cages | • PACS logs (data center access logs)<br>• CCTV footage samples<br>• Visitor logs | Test physical access controls |
| **CC7: System Operations** | CC7.1: Performance monitoring | DNAC Assurance (network health), ThousandEyes (SaaS performance), AppDynamics (app performance) | • DNAC health reports (average 98.5% health score)<br>• ThousandEyes availability reports (99.95% SaaS availability)<br>• AppDynamics Apdex scores (avg 0.92, target >0.90) | Review performance reports |
| | CC7.2: Capacity monitoring | Splunk capacity forecasting, DNAC capacity planning, ThousandEyes bandwidth monitoring | • Splunk capacity report (100GB/day avg, 150GB licensed, 50GB buffer)<br>• DNAC capacity forecast (next 12 months)<br>• ThousandEyes bandwidth trends | Review capacity planning |
| | CC7.3: Security incidents | XDR playbooks (PB-001 to PB-008), ServiceNow ticketing, incident response plan (v3.1) | • XDR case logs (120 incidents in 2024)<br>• ServiceNow incident tickets<br>• IR plan document + test results | Test incident response process |
| | CC7.4: Backup & recovery | Veeam backups (3-2-1 rule), immutable backups (30-day lock), DR testing (quarterly) | • Veeam backup reports (99.8% success rate)<br>• Veeam SureBackup test results (daily)<br>• DR test reports (Q1-Q4 2024, all successful) | Test backup restoration |
| | CC7.5: Availability | 99.99% uptime SLA (52 min/year), redundant systems (HA firewalls, ISE cluster, Splunk cluster) | • Uptime reports (2024: 99.97% actual, 13 minutes downtime)<br>• HA config evidence (FTD, ISE, Splunk)<br>• SLA reports (customer SLA dashboard) | Review availability metrics |
| **CC8: Change Management** | CC8.1: Change management | ServiceNow change requests (CAB approval), change calendar, rollback procedures | • ServiceNow change ticket logs (450 changes in 2024)<br>• CAB meeting minutes (weekly)<br>• Rollback procedure documentation | Sample 10 changes (approval, testing, rollback plan) |
| | CC8.2: Change authorization | CAB approval required (all production changes), emergency changes (CISO approval + post-review) | • CAB approval records (450 approved, 3 rejected)<br>• Emergency change log (8 emergency changes, all post-reviewed) | Review authorization process |
| **CC9: Risk Mitigation** | CC9.1: Incident response | IR plan (v3.1), XDR playbooks (8 automated), 24x7 SOC, escalation matrix | • IR plan document<br>• XDR playbook documentation<br>• SOC escalation matrix<br>• Incident response test results (quarterly) | Test IR plan execution |
| | CC9.2: Business continuity | DR plan (RTO 4 hours, RPO 1 hour), Veeam backups, DR site (London), annual DR test | • DR plan document<br>• DR test reports (2024: full DR test successful, 3.5-hour recovery)<br>• Veeam replication configs | Test DR plan execution |

**SOC 2 Type II Audit Timeline:**

- **Observation Period:** Nov 1, 2024 - Oct 31, 2025 (12 months)
- **Audit Fieldwork:** Nov 1-30, 2025 (4 weeks)
- **Report Issuance:** Dec 15, 2025 (target)
- **Auditor:** Deloitte
- **Expected Outcome:** Unqualified opinion (no material weaknesses)

**Current Status (Jan 2025):**
- **Observation Period:** 3 months complete (Nov 2024 - Jan 2025), 9 months remaining
- **Control Testing:** Ongoing (quarterly sampling by internal audit team)
- **Outstanding Issues:** 1 Low finding (minor documentation gap in change management, scheduled for remediation by Mar 2025)

*(Continued in part 2 due to length...)*

#### 1.3.4 GDPR Data Protection Compliance

**GDPR Scope:** All processing of EU residents' personal data at EMEA sites (London, Frankfurt, Amsterdam) and for EU customers/employees globally.

**GDPR Implementation Summary:**

| GDPR Article | Requirement | Abhavtech Implementation | Data Protection Officer (DPO) Actions |
|-------------|-------------|-------------------------|-----------------------------------|
| **Art. 5: Principles** | Lawfulness, fairness, transparency, data minimization | • Privacy policy (website, last updated Oct 2024)<br>• Data collection consent forms (marketing emails, cookies)<br>• Data minimization: Only collect necessary data (name, email, payment info; no SSN, no biometric) | DPO reviews data collection forms quarterly |
| **Art. 25: Data Protection by Design & Default** | Privacy by default, encryption | • TLS 1.2+ (all web apps), AES-256 (data at rest), SGT segmentation (HR data = SGT 82, isolated)<br>• DLP (prevent unauthorized data sharing) | DPO approves new data processing activities |
| **Art. 30: Records of Processing Activities (ROPA)** | Data inventory, processing purposes | • ROPA spreadsheet (18 data processing activities documented)<br>• Data flow diagrams (customer data, employee data, vendor data) | DPO maintains ROPA, updates quarterly |
| **Art. 32: Security of Processing** | Appropriate technical/organizational measures | • See Sections 1.1, 2.3 (encryption, access control, monitoring)<br>• ISO 27001:2022 certified (comprehensive ISMS) | DPO reviews security controls annual |
| **Art. 33: Breach Notification to Authority** | 72-hour notification to supervisory authority | • XDR playbooks include breach notification triggers<br>• Breach notification template (pre-approved by Legal)<br>• Data breach log (1 incident in 2024, notified within 48 hours) | DPO submits breach notifications to ICO (UK), CNIL (France) |
| **Art. 34: Breach Notification to Data Subjects** | Notify affected individuals | • Email notification template (customer comms team)<br>• Website notice (if >1,000 affected individuals) | DPO coordinates with Legal + PR |
| **Art. 15: Right of Access (DSAR)** | Provide copy of personal data upon request | • DSAR procedure (ServiceNow ticketing)<br>• DSAR response time: 30 days (GDPR requirement)<br>• 2024 DSARs: 45 requests, 100% responded within 30 days | DPO manages DSAR process |
| **Art. 17: Right to Erasure ("Right to be Forgotten")** | Delete personal data upon request | • Data retention policy (7 years for financial records, 3 years for marketing data)<br>• Auto-deletion after retention period (SQL jobs)<br>• Manual deletion process (Legal approval required for financial data) | DPO coordinates with IT + Legal |
| **Art. 20: Right to Data Portability** | Export data in machine-readable format | • API export (JSON format), CSV export (via customer portal)<br>• Self-service data export (customer account settings) | DPO ensures export process meets GDPR standards |
| **Art. 37: Data Protection Officer (DPO)** | Appoint DPO (organizations processing large-scale special category data) | • DPO appointed: Jane Doe (jane.doe@abhavtech.com)<br>• DPO reports to Board + Legal (independent) | DPO advises on GDPR compliance |

**GDPR Compliance Checklist (Quarterly Review):**

- ✅ Privacy policy updated and accessible (abhavtech.com/privacy)
- ✅ Consent forms for marketing emails (opt-in, not pre-checked)
- ✅ Data Processing Agreements (DPAs) signed with all vendors processing EU data (28 vendors, 100% signed)
- ✅ Encryption enabled: TLS 1.2+ (web), AES-256 (database), MACsec (network)
- ✅ Access controls: ISE 802.1X + Duo MFA + TrustSec SGT segmentation
- ✅ Incident response plan includes GDPR breach notification procedures (72-hour deadline)
- ✅ ROPA (Records of Processing Activities) maintained and current (last updated Jan 2025)
- ✅ Data retention policies enforced (auto-deletion after retention period)
- ✅ DSAR process documented and tested (45 DSARs processed in 2024, 100% within 30 days)
- ✅ DPO contact information published (website footer, privacy policy)
- ✅ Cross-border data transfer safeguards: EU data stored in EU-West-2 (AWS Ireland), Standard Contractual Clauses (SCCs) for US vendors

**GDPR Incident Example (2024):**

```
Incident: Unauthorized access to customer database (500 EU customers affected)
Date: 2024-08-15 10:30 AM GMT
Discovery: Splunk UEBA alert (unusual database query by employee account)
Root Cause: Employee account compromised (phishing, credential theft)

Timeline:
  10:30 AM: UEBA alert (SOC Analyst reviews)
  10:45 AM: Confirmed unauthorized access (database logs show 500 customer records queried)
  11:00 AM: Account locked (ISE CoA), password reset, forensics initiated
  11:30 AM: Security Manager briefed, GDPR breach assessment
  12:00 PM: DPO notified, Legal consulted
  1:00 PM: CISO approves breach notification (high risk to individuals: email + phone numbers exposed)
  2:00 PM: DPO submits breach notification to ICO (UK supervisory authority)
  3:00 PM: Email notification sent to 500 affected customers (breach details, mitigation steps)
  
Notification Content:
  • What happened: Employee account compromised, customer data accessed
  • Data exposed: Names, email addresses, phone numbers (NO payment data, NO SSNs)
  • Actions taken: Account locked, password reset, additional monitoring
  • Recommendations: Monitor for phishing emails, change password if same as Abhavtech account
  • Contact: DPO email (jane.doe@abhavtech.com) for questions
  
Outcome:
  ✅ ICO notification submitted within 48 hours (requirement: 72 hours)
  ✅ Customer notification sent within 5 hours
  ✅ No regulatory fine issued (timely notification, appropriate response)
  ✅ Post-incident review: Enhanced phishing training, improved UEBA tuning
```

### 1.4 Success Metrics & Key Performance Indicators (KPIs)

Abhavtech tracks security KPIs to measure operations effectiveness, maturity progression, and alignment with business objectives. KPIs are reviewed weekly (SOC), monthly (Security Committee), and quarterly (Board).

#### 1.4.1 Security Operations KPI Dashboard

| KPI Category | Metric | Baseline (Pre-XDR, 2023) | Current (Jan 2025) | Target (2025) | Measurement Source | Reporting Frequency | Trend | Owner |
|-------------|--------|-------------------------|-------------------|--------------|-------------------|-------------------|-------|-------|
| **Detection & Response** | Mean Time to Detect (MTTD) | 72 hours | **6 hours** ⬇ | <4 hours | XDR case timestamps (first alert), Splunk correlation | Daily (SOC dashboard) | **↓ Improving** (91% reduction) | SOC Lead |
| **Detection & Response** | Mean Time to Respond (MTTR) | 48 hours | **4 hours** ⬇ | <2 hours | XDR playbook execution time, ServiceNow ticket resolution | Daily (SOC dashboard) | **↓ Improving** (91% reduction) | SOC Lead |
| **Detection & Response** | Automated Incident Containment Rate | 0% | **70%** ⬆ | 85% | XDR playbook success rate (PB-001, 002, 005, 006 / total incidents) | Weekly (Security Manager) | **↑ Improving** | Security Manager |
| **Authentication & Access** | Authentication Success Rate | 95% | **98.5%** ⬆ | 99.5% | ISE authentication reports (successful auths / total attempts) | Daily (SOC dashboard) | **↑ Improving** | Network Admin |
| **Authentication & Access** | MFA Coverage | 60% | **100%** ⬆ | 100% | Duo admin console (enrolled users / total users), ISE (802.1X vs. MAB ratio) | Weekly (Security Manager) | **↑ Target Met** | Security Manager |
| **Alerting & Noise Reduction** | False Positive Rate | Unknown (no baseline) | **12%** | <5% | XDR case disposition (SOC analyst feedback: FP vs. TP) | Weekly (SOC Lead) | **→ Stable** (tuning needed) | SOC Lead |
| **Alerting & Noise Reduction** | Daily Alert Volume | 500/day | **180/day** ⬇ | <100/day | XDR alert count, Splunk notable events | Daily (SOC dashboard) | **↓ Improving** (64% reduction) | SOC Lead |
| **Vulnerability Management** | Critical Vulnerability Remediation Time | 30 days | **10 days** ⬇ | <7 days | Tenable scan delta (CVE discovery → patched), ServiceNow remediation tickets | Weekly (Security Engineer) | **↓ Improving** (67% faster) | Security Engineer |
| **Vulnerability Management** | Vulnerability Scan Coverage | 85% | **95%** ⬆ | 99% | Tenable asset inventory (scanned assets / total assets) | Monthly (Security Engineer) | **↑ Improving** | Security Engineer |
| **Phishing Defense** | Phishing Email Detection Rate | 75% | **92%** ⬆ | 95% | Secure Email sandbox reports (blocked phishing / total phishing) | Weekly (SOC Analyst) | **↑ Improving** | SOC Analyst |
| **Phishing Defense** | User-Reported Phishing Rate | 5% | **18%** ⬆ | 25% | User-reported phishing count / total phishing (indicates training effectiveness) | Monthly (Security Manager) | **↑ Improving** | Security Manager |
| **Endpoint Protection** | Endpoint Protection Coverage | 85% | **99.2%** ⬆ | 99.9% | AMP admin console (agent count / ISE endpoint count) | Daily (SOC dashboard) | **↑ Improving** | IT Operations |
| **Endpoint Protection** | Malware Detection & Block Rate | Unknown | **98%** | 99% | AMP detections blocked / total malware executions | Weekly (SOC Analyst) | **→ Stable** | SOC Analyst |
| **Uptime & Availability** | Security Services Uptime | 99.9% (525 min downtime/year) | **99.95%** ⬆ | 99.99% (52 min downtime/year) | DNAC Assurance (ISE uptime), FMC health (FTD uptime), Splunk uptime | Hourly (SOC dashboard) | **↑ Improving** | IT Operations |
| **Threat Intelligence** | MITRE ATT&CK Coverage | Unknown (no assessment) | **68%** | 80% | ATT&CK Navigator manual assessment (detection coverage / total techniques) | Quarterly (Threat Hunter) | **→ Baseline Established** | Threat Hunter |
| **Threat Intelligence** | Threat Intelligence IOC Hits | Unknown | **45/month** | <20/month | XDR Threat Response hits (Talos IOC matches / month) | Monthly (Threat Hunter) | **→ Stable** (higher hits = more threats detected) | Threat Hunter |
| **Insider Threat** | UEBA High-Risk Alerts | Unknown | **8/month** | <5/month | Splunk UEBA (risk score >75) | Monthly (SOC Lead) | **→ Stable** (tuning needed) | SOC Lead |
| **Compliance** | Audit Findings (Critical/High) | 12 findings | **3 findings** ⬇ | 0 findings | External auditor reports (PCI QSA, ISO 27001, SOC 2) | Quarterly (Compliance Analyst) | **↓ Improving** (75% reduction) | Compliance Analyst |
| **Compliance** | Compliance Score | 82% | **97%** ⬆ | 100% | Weighted average across all frameworks (PCI, SOC2, GDPR, ISO) | Quarterly (Compliance Analyst) | **↑ Improving** | Compliance Analyst |

#### 1.4.2 KPI Calculation Methodologies & Real-World Examples

**Mean Time to Detect (MTTD):**

```
Formula:
  MTTD = Σ (Time of First Alert - Time of Actual Compromise) / Number of Incidents
  
  Where:
    Time of Actual Compromise = Estimated based on forensics (malware execution, C2 connection, etc.)
    Time of First Alert = First system alert (AMP, FTD, ISE, etc.)
    
Example (January 2025, 10 incidents):
  Incident 1: Malware executed at 10:00 AM, AMP alert at 10:05 AM → MTTD = 5 minutes
  Incident 2: Lateral movement at 2:00 PM, FTD alert at 2:15 PM → MTTD = 15 minutes
  Incident 3: Data exfiltration at 8:00 PM, NetFlow alert at 8:30 PM → MTTD = 30 minutes
  Incident 4: Phishing email opened at 9:00 AM, user report at 9:45 AM → MTTD = 45 minutes
  Incident 5: Brute force attack at 11:00 PM, Duo alert at 11:02 PM → MTTD = 2 minutes
  Incident 6: Impossible travel at 3:00 AM, Duo alert at 3:01 AM → MTTD = 1 minute
  Incident 7: SGT violation at 1:00 PM, ISE alert at 1:00 PM → MTTD = 0 minutes (real-time)
  Incident 8: Ransomware at 6:00 AM, AMP alert at 6:03 AM → MTTD = 3 minutes
  Incident 9: C2 beaconing at 4:00 PM, Umbrella alert at 4:05 PM → MTTD = 5 minutes
  Incident 10: Credential dumping at 12:00 AM, CyberArk alert at 12:10 AM → MTTD = 10 minutes
  
  MTTD (January) = (5 + 15 + 30 + 45 + 2 + 1 + 0 + 3 + 5 + 10) / 10 = 11.6 minutes average
  
Monthly Trend:
  Nov 2024: 18 minutes
  Dec 2024: 14 minutes
  Jan 2025: 12 minutes
  Target: <4 hours (240 minutes) → Currently 12 minutes = 95% better than target ✅
```

**Mean Time to Respond (MTTR):**

```
Formula:
  MTTR = Σ (Time of Incident Resolved - Time of First Alert) / Number of Incidents
  
  Where:
    Time of First Alert = First system alert
    Time of Incident Resolved = Containment complete (malware isolated, account locked, etc.)
    
Example (January 2025, 10 incidents):
  Incident 1: Alert at 10:05 AM, AMP isolated at 10:07 AM (PB-001 auto-response) → MTTR = 2 minutes
  Incident 2: Alert at 2:15 PM, ISE CoA at 2:20 PM + investigation (PB-003) → MTTR = 5 minutes
  Incident 3: Alert at 8:30 PM, manual investigation + block at 10:00 PM → MTTR = 90 minutes
  Incident 4: Alert at 9:45 AM, email quarantine at 10:00 AM (PB-007 manual) → MTTR = 15 minutes
  Incident 5: Alert at 11:02 PM, account locked at 11:03 PM (PB-002 auto) → MTTR = 1 minute
  Incident 6: Alert at 3:01 AM, account locked at 3:02 AM (PB-006 auto) → MTTR = 1 minute
  Incident 7: Alert at 1:00 PM, ISE CoA at 1:00 PM (real-time block) → MTTR = 0 minutes
  Incident 8: Alert at 6:03 AM, AMP isolated + network segment at 6:10 AM (PB-005) → MTTR = 7 minutes
  Incident 9: Alert at 4:05 PM, FTD block + ISE quarantine at 4:10 PM → MTTR = 5 minutes
  Incident 10: Alert at 12:10 AM, manual investigation + containment at 1:00 AM → MTTR = 50 minutes
  
  MTTR (January) = (2 + 5 + 90 + 15 + 1 + 1 + 0 + 7 + 5 + 50) / 10 = 17.6 minutes average
  
Monthly Trend:
  Nov 2024: 35 minutes
  Dec 2024: 22 minutes
  Jan 2025: 18 minutes
  Target: <2 hours (120 minutes) → Currently 18 minutes = 85% better than target ✅
```

**Automated Incident Containment Rate:**

```
Formula:
  Automation Rate = (Fully Automated Incidents / Total Incidents) × 100%
  
  Where:
    Fully Automated = Incidents resolved by XDR playbooks without human intervention
    Total Incidents = All security incidents (automated + semi-automated + manual)
    
Example (January 2025):
  Total Incidents: 120
  Fully Automated (PB-001 Malware, PB-002 Credential, PB-005 Ransomware, PB-006 Impossible Travel): 84
  Semi-Automated (PB-003 Lateral Movement, PB-004 Exfiltration, PB-008 DDoS): 28
  Manual (PB-007 Phishing investigation): 8
  
  Automation Rate = (84 / 120) × 100% = 70%
  
Breakdown by Playbook:
  PB-001 (Malware-Containment): 45 incidents → 100% automated (AMP isolate → ISE CoA → FTD block → ServiceNow)
  PB-002 (Compromised-Credential): 18 incidents → 100% automated (lock account → force MFA → password reset)
  PB-003 (Lateral-Movement): 12 incidents → Semi-automated (auto-quarantine, then SOC investigates scope)
  PB-004 (Data-Exfiltration): 8 incidents → Semi-automated (auto-block, then SOC investigates data)
  PB-005 (Ransomware-Response): 3 incidents → 100% automated (isolate → segment → verify backups → forensics)
  PB-006 (Impossible-Travel): 18 incidents → 100% automated (lock account → alert admin → investigate location)
  PB-007 (Phishing-Response): 8 incidents → Manual (SOC extracts IOCs, blocks domains, alerts users)
  PB-008 (DDoS-Mitigation): 8 incidents → Semi-automated (Umbrella auto-mitigate, then SOC monitors)
  
Target: 85% automation → Current: 70% → Gap: Need to automate PB-007 phishing response
```

**False Positive Rate:**

```
Formula:
  FP Rate = (False Positive Alerts / Total Alerts) × 100%
  
  Where:
    False Positive = Alert that is not a real security incident (SOC analyst marks as FP)
    Total Alerts = All XDR alerts (true positive + false positive)
    
Example (Week of Jan 15-21, 2025):
  Total XDR Alerts: 250
  True Positives: 220 (confirmed security events)
  False Positives: 30 (e.g., legitimate admin activity flagged as suspicious)
  
  FP Rate = (30 / 250) × 100% = 12%
  
Common False Positives:
  1. UEBA: IT admin running scripts at 2 AM (legitimate maintenance, but flagged as "after-hours activity")
  2. Impossible Travel: User using VPN from home (IP shows different country than actual location)
  3. File Activity: Backup software mass-accessing files (flagged as "mass file access" by UEBA)
  4. SGT Violation: Network scan by authorized security tool (flagged by ISE)
  
Tuning Actions:
  1. Add IT admin accounts to UEBA allowlist (for after-hours maintenance)
  2. Adjust impossible travel distance threshold (500 miles → 1,000 miles for VPN users)
  3. Exclude backup software processes from file activity monitoring
  4. Add security scanner IPs to ISE allowlist
  
Target: <5% FP rate → Current: 12% → Gap: Ongoing tuning needed (weekly reviews)
```

#### 1.4.3 Executive KPI Reporting

**Splunk Executive Security Dashboard:**

- **Real-time KPIs:** Live gauges showing MTTD, MTTR, alert volume, authentication success rate
- **Trend Analysis:** 7-day, 30-day, 90-day trend lines for all KPIs
- **Heat Maps:** Incident distribution by time (hourly), type (malware, phishing, etc.), severity (P1-P4)
- **Drill-Down:** Click any metric to view underlying data (e.g., click MTTD → see all incidents with timestamps)
- **Threshold Alerts:** Auto-alert if KPI exceeds threshold (e.g., MTTR >4 hours → email to Security Manager)
- **Export:** PDF export for Board presentations (monthly)

**Monthly Security Metrics Report (Security Manager → CISO → Board):**

```markdown
# Executive Summary
Month: January 2025

## EXECUTIVE SUMMARY
- Overall Security Posture: STRONG ✅ (97% compliance score)
- Critical Incidents: 3 (all contained within MTTR target)
- Emerging Threats: LockBit 3.0 ransomware campaign (mitigated, AMP signatures updated)
- Key Achievements: MFA coverage reached 100%, MTTD reduced to 12 minutes (95% better than target)

## KEY PERFORMANCE INDICATORS

| Metric | Target | Actual | Status | Trend |
|--------|--------|--------|--------|-------|
| MTTD | <4 hours | 12 minutes | ✅ | ↓ |
| MTTR | <2 hours | 18 minutes | ✅ | ↓ |
| Automated Containment | 85% | 70% | ⚠️ | → |
| False Positive Rate | <5% | 12% | ⚠️ | → |
| MFA Coverage | 100% | 100% | ✅ | ✓ |
| Endpoint Coverage | 99.9% | 99.2% | ⚠️ | ↑ |
| Compliance Score | 100% | 97% | ✅ | ↑ |

## INCIDENT SUMMARY
- Total Incidents: 120 (vs. 145 in Dec 2024, -17% reduction)
- P1 Critical: 3 (ransomware attempts, all blocked by AMP)
- P2 High: 18 (phishing campaigns, compromised credentials)
- P3 Medium: 45 (malware detections, lateral movement attempts)
- P4 Low: 54 (false positives, benign anomalies)

## TOP THREATS (MITRE ATT&CK)
1. T1566.001 (Phishing): 18 incidents (detection rate: 92%)
2. T1078 (Valid Accounts): 15 incidents (Duo MFA blocked all)
3. T1486 (Ransomware): 3 incidents (AMP blocked all, 0 encryption occurred)

## UPCOMING ACTIVITIES
- Feb 2025: Quarterly PCI-DSS audit (March 8-12)
- Feb 2025: Phishing simulation for Finance team
- Mar 2025: Annual external penetration test (Rapid7)
- Mar 2025: UEBA tuning workshop (reduce false positives to <5%)
```

## 2. NIST
