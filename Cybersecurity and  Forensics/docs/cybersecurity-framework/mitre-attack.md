# MITRE ATT&CK

## 4. MITRE ATT&CK FRAMEWORK MAPPING

The MITRE ATT&CK (Adversarial Tactics, Techniques, and Common Knowledge) framework is a globally-accessible knowledge base of adversary tactics and techniques based on real-world observations. Abhavtech uses ATT&CK to:
- **Threat Detection:** Map detection capabilities to ATT&CK techniques
- **Threat Hunting:** Prioritize hunts based on Top 20 techniques
- **Purple Team Exercises:** Test defenses against specific ATT&CK techniques
- **Gap Analysis:** Identify detection gaps and improve coverage

### 4.1 MITRE ATT&CK Coverage Matrix

**Coverage Calculation:**
- **Detected:** Platform generates alert when technique is used (e.g., AMP detects T1059.001 PowerShell)
- **Partially Detected:** Some variants detected (e.g., phishing attachments detected, but not all phishing links)
- **Not Detected:** No automated detection (relies on manual review or threat hunting)

**Abhavtech ATT&CK Coverage Summary:**

| Tactic | Total Techniques (Enterprise ATT&CK) | Detected | Partially Detected | Not Detected | Coverage % |
|--------|-------------------------------------|----------|-------------------|--------------|-----------|
| **Initial Access** | 9 | 6 | 2 | 1 | **89%** ✅ |
| **Execution** | 12 | 8 | 3 | 1 | **92%** ✅ |
| **Persistence** | 19 | 11 | 5 | 3 | **84%** ✅ |
| **Privilege Escalation** | 13 | 7 | 4 | 2 | **85%** ✅ |
| **Defense Evasion** | 42 | 18 | 15 | 9 | **79%** ⚠️ |
| **Credential Access** | 15 | 9 | 4 | 2 | **87%** ✅ |
| **Discovery** | 30 | 14 | 10 | 6 | **80%** ⚠️ |
| **Lateral Movement** | 9 | 6 | 2 | 1 | **89%** ✅ |
| **Collection** | 17 | 8 | 6 | 3 | **82%** ✅ |
| **Command and Control** | 16 | 10 | 4 | 2 | **88%** ✅ |
| **Exfiltration** | 9 | 5 | 3 | 1 | **89%** ✅ |
| **Impact** | 13 | 8 | 3 | 2 | **85%** ✅ |

**Overall ATT&CK Coverage:** **84%** (196 detected/partially detected out of 234 total techniques)

**Gap Analysis:**
- **Defense Evasion (79%):** Lowest coverage, focus area for 2025
  - Gaps: Obfuscation techniques (T1027 variants), process injection (T1055 variants)
  - Mitigation: Enhanced AMP behavioral signatures, Orbital forensics automation
- **Discovery (80%):** Improve detection of reconnaissance activities
  - Gaps: Account discovery (T1087), network discovery (T1046)
  - Mitigation: Enhanced Splunk correlation rules, baseline user behavior

### 4.2 ATT&CK Tactic Breakdown: INITIAL ACCESS

**Tactic Purpose:** Adversary tries to get into your network (entry point).

| Technique ID | Technique Name | Sub-Techniques | Abhavtech Detection Method | Detection Tool | Automated Response | Coverage |
|-------------|----------------|---------------|---------------------------|---------------|-------------------|----------|
| **T1566** | Phishing | T1566.001 (Attachment), T1566.002 (Link), T1566.003 (Service) | • **Attachment:** Secure Email sandbox (92% detection), AMP file reputation<br>• **Link:** URL rewriting + Umbrella Investigate (malicious domains)<br>• **Service:** M365 ATP (SharePoint/OneDrive phishing) | Secure Email, AMP, Umbrella, M365 ATP | PB-007 (manual): Quarantine email → Extract IOCs → Block domains | ✅ Detected |
| **T1078** | Valid Accounts | T1078.001 (Default), T1078.002 (Domain), T1078.003 (Local), T1078.004 (Cloud) | • Duo MFA (100% coverage, impossible travel detection)<br>• UEBA (unusual auth patterns, failed auth >5)<br>• ISE auth logs (anomalous locations) | Duo, Splunk UEBA, ISE | PB-002 (automated): Lock account → Force MFA → Password reset | ✅ Detected |
| **T1133** | External Remote Services | - | • AnyConnect VPN monitoring (Duo MFA required)<br>• Webex remote access logs (ISE integration)<br>• Failed VPN attempts (>5 = alert) | Duo, ISE, Splunk | Manual review (SOC), block source IP if suspicious | ✅ Detected |
| **T1190** | Exploit Public-Facing Application | - | • FTD IPS (Snort signatures, web exploits)<br>• Umbrella proxy (malicious downloads)<br>• WAF (if deployed, currently gap) | FTD, Umbrella | FTD auto-block (IPS), Umbrella block domain | ⚠️ Partially Detected (WAF gap for web app exploits) |
| **T1189** | Drive-by Compromise | - | • Umbrella Investigate (malicious domains, newly-seen)<br>• AMP file reputation (downloaded malware) | Umbrella, AMP | AMP block file, Umbrella block domain | ✅ Detected |
| **T1195** | Supply Chain Compromise | T1195.001 (Software), T1195.002 (Hardware), T1195.003 (Software Distribution) | • Vendor security assessments (Tier 1: annual)<br>• AMP file reputation (software downloads)<br>• Code signing verification (WDAC) | Manual review (Procurement), AMP | Manual vendor review, block if compromised | ⚠️ Partially Detected (manual process, not automated) |
| **T1199** | Trusted Relationship | - | • Vendor access monitoring (CyberArk PAM for vendor accounts)<br>• VPN logs (vendor connections) | CyberArk, Duo, ISE | Manual review (SOC), terminate session if suspicious | ✅ Detected |
| **T1091** | Replication Through Removable Media | - | • AMP Device Control (USB mass storage blocked)<br>• AMP Autorun monitoring (USB malware execution) | AMP | AMP isolate endpoint, block USB device | ✅ Detected |
| **T1195.003** | Compromise Software Supply Chain | - | • See T1195 | See T1195 | See T1195 | ⚠️ Partially Detected |

**Initial Access Coverage:** 89% (6 fully detected, 2 partially detected, 1 not detected)

### 4.3 ATT&CK Heatmap (Visual Coverage)

**ATT&CK Navigator Heatmap Representation:**

```
MITRE ATT&CK COVERAGE HEATMAP (Abhavtech, January 2025)

Legend:
  █████ = Fully Detected (automated alert + response)
  ▓▓▓▓▓ = Partially Detected (some variants detected)
  ░░░░░ = Not Detected (manual review or gap)

┌─────────────────────────────────────────────────────────────────────┐
│                    ABHAVTECH ATT&CK COVERAGE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  INITIAL ACCESS (89%)          EXECUTION (92%)                      │
│  ══════════════════            ═════════════                        │
│  T1566 Phishing        █████   T1059 Command/Script    █████       │
│  T1078 Valid Accounts  █████   T1106 Native API        ▓▓▓▓▓       │
│  T1133 Remote Services █████   T1053 Scheduled Task    █████       │
│  T1190 Exploit Public  ▓▓▓▓▓   T1204 User Execution    █████       │
│  T1189 Drive-by        █████   T1047 WMI               ▓▓▓▓▓       │
│  T1195 Supply Chain    ▓▓▓▓▓   T1203 Exploitation      ▓▓▓▓▓       │
│  T1199 Trusted Rel     █████   T1129 Shared Modules    ░░░░░       │
│  T1091 Removable Media █████   T1072 Software Deploy   █████       │
│  T1195.003 Software    ▓▓▓▓▓   ...                                 │
│                                                                     │
│  PERSISTENCE (84%)             PRIVILEGE ESCALATION (85%)           │
│  ═════════════                 ═══════════════════                 │
│  T1098 Account Manip   █████   T1068 Exploit Vuln     ▓▓▓▓▓       │
│  T1547 Boot/Logon      █████   T1055 Process Inject   ▓▓▓▓▓       │
│  T1136 Create Account  █████   T1548 Abuse Elevation  █████       │
│  T1543 Service         █████   T1134 Access Token     ▓▓▓▓▓       │
│  T1053 Scheduled Task  █████   T1078 Valid Accounts   █████       │
│  ...                           ...                                 │
│                                                                     │
│  DEFENSE EVASION (79%)         CREDENTIAL ACCESS (87%)             │
│  ═══════════════               ══════════════════                  │
│  T1562 Impair Defenses █████   T1003 Credential Dump  ▓▓▓▓▓       │
│  T1070 Indicator Rem   ▓▓▓▓▓   T1110 Brute Force      █████       │
│  T1027 Obfuscation     ▓▓▓▓▓   T1555 Creds from Pwd   █████       │
│  T1055 Process Inject  ▓▓▓▓▓   T1056 Input Capture    ░░░░░       │
│  T1140 Deobfuscate     ░░░░░   T1558 Steal Kerberos   ▓▓▓▓▓       │
│  ...                           ...                                 │
│                                                                     │
│  DISCOVERY (80%)               LATERAL MOVEMENT (89%)               │
│  ════════════                  ════════════════                     │
│  T1087 Account Disc    ▓▓▓▓▓   T1021.001 RDP           █████       │
│  T1046 Network Scan    ▓▓▓▓▓   T1021.002 SMB           █████       │
│  T1082 System Info     █████   T1021.006 WinRM         ▓▓▓▓▓       │
│  T1083 File/Dir Disc   █████   T1080 Replication      ░░░░░       │
│  T1135 Network Share   █████   T1534 Internal Spear   ▓▓▓▓▓       │
│  ...                           ...                                 │
│                                                                     │
│  COLLECTION (82%)              COMMAND & CONTROL (88%)             │
│  ═══════════                   ══════════════════                  │
│  T1560 Archive Data    █████   T1071 App Layer Proto  █████       │
│  T1005 Local Data      █████   T1095 Non-App Proto    ▓▓▓▓▓       │
│  T1039 Network Data    ▓▓▓▓▓   T1001 Data Obfuscation ▓▓▓▓▓       │
│  T1025 Input Capture   ░░░░░   T1568 Dynamic DNS      █████       │
│  ...                           ...                                 │
│                                                                     │
│  EXFILTRATION (89%)            IMPACT (85%)                        │
│  ═══════════                   ═══════                             │
│  T1048 Exfil Alt Proto █████   T1486 Data Encrypted   █████       │
│  T1041 Exfil C2        █████   T1490 Inhibit Recovery █████       │
│  T1567 Exfil Web       ▓▓▓▓▓   T1485 Data Destruction ▓▓▓▓▓       │
│  T1020 Exfil Auto      ▓▓▓▓▓   T1498 DDoS             █████       │
│  ...                           ...                                 │
│                                                                     │
│  OVERALL COVERAGE: 84% (196 detected / 234 total techniques)       │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Top Detection Gaps (Priority for 2025):**

1. **T1027 Obfuscated Files/Information (Defense Evasion):**
   - Current: Secure Email sandbox detects some obfuscated files (92% detection)
   - Gap: Advanced obfuscation (steganography, custom packers) not detected
   - Mitigation: Enhance AMP behavioral analysis, add entropy-based detection

2. **T1055 Process Injection (Defense Evasion, Privilege Escalation):**
   - Current: AMP detects common injection (CreateRemoteThread), Orbital forensics can investigate
   - Gap: Advanced injection techniques (APC injection, process hollowing) partially detected
   - Mitigation: Deploy Windows Defender ATP (process monitoring), enhance AMP signatures

3. **T1087 Account Discovery (Discovery):**
   - Current: Splunk logs AD queries (Event ID 4662), UEBA detects unusual queries
   - Gap: Legitimate IT admin queries vs. reconnaissance not distinguished
   - Mitigation: Baseline IT admin behavior, tune UEBA thresholds

4. **T1056 Input Capture (Credential Access):**
   - Current: No automated detection (keyloggers, form grabbing)
   - Gap: Endpoint-based input capture not detected
   - Mitigation: Deploy Windows Defender ATP (credential guard), AMP behavioral rules

5. **T1140 Deobfuscate/Decode Files or Information (Defense Evasion):**
   - Current: Not detected (attackers decode obfuscated payloads at runtime)
   - Gap: No visibility into runtime deobfuscation
   - Mitigation: AMP Orbital live response, memory analysis

*(Continuing with detailed ISO 27001 controls mapping, SOC procedures, threat hunting methodology, continuous monitoring dashboards, compliance reporting templates, and comprehensive appendices...)*

## 5. ISO 27001
