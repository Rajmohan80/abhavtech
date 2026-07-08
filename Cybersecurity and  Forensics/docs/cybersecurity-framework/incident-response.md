# Incident Response

## 7. THREAT HUNTING PROGRAM

Threat hunting is the proactive search for threats that evade automated detection systems. Abhavtech's threat hunting program follows a hypothesis-driven approach aligned with MITRE ATT&CK.

### 7.1 Threat Hunting Methodology

**Hunt Maturity Model (Abhavtech: Level 3 - Procedure-Based):**

| Level | Description | Abhavtech Status |
|-------|-------------|-----------------|
| **Level 0 - Reactive** | No proactive hunting, rely only on alerts | ❌ Surpassed |
| **Level 1 - Ad-hoc** | Occasional hunts, no process | ❌ Surpassed |
| **Level 2 - Tool-Assisted** | Regular hunts using SIEM, but reactive to intelligence | ❌ Surpassed |
| **Level 3 - Procedure-Based** | Documented hunt playbooks, weekly hunts, hypothesis-driven | ✅ **Current State** |
| **Level 4 - Innovative** | Custom tools, automation, machine learning-enhanced hunting | ⚠️ **Target for 2026** |

**Hunt Process (6 Steps):**

1. **Hypothesis Development:** Based on threat intelligence, MITRE ATT&CK, recent incidents
2. **Data Collection:** Gather relevant data sources (Splunk, NetFlow, AMP, ISE logs)
3. **Query/Analysis:** Run Splunk queries, correlate events, identify anomalies
4. **Investigat Investigation:** Deep-dive into suspicious findings, validate true positives
5. **Response:** Contain threats, update detections, add IOCs to threat intel
6. **Documentation:** Hunt report (findings, IOCs, lessons learned), share with team

### 7.2 Weekly Hunt Calendar (Rotating Themes)

| Week | Hunt Theme | MITRE ATT&CK Focus | Data Sources | Expected Findings | Success Criteria |
|------|-----------|-------------------|--------------|------------------|------------------|
| **Week 1** | Phishing Infrastructure | T1566 (Phishing) | Secure Email, Umbrella DNS, Splunk email logs | Malicious domains, phishing kits, compromised accounts | Find 5+ phishing domains, block via Umbrella |
| **Week 2** | Lateral Movement | T1021 (Remote Services), T1570 (Lateral Tool Transfer) | ISE auth logs, FTD flows, AMP process execution | Unusual RDP/SMB, admin account usage patterns | Identify 2+ unauthorized lateral movement attempts |
| **Week 3** | Data Exfiltration | T1048 (Exfil Over Alt Protocol), T1041 (Exfil Over C2) | NetFlow, DLP logs, Umbrella proxy | Large data transfers, DNS tunneling, unusual cloud uploads | Detect 1+ data exfiltration attempt |
| **Week 4** | Credential Access | T1003 (Credential Dumping), T1110 (Brute Force) | CyberArk PAM, ISE failed auth, Splunk Event ID 4624/4625 | Mimikatz usage, brute force attacks, password spraying | Find 3+ credential access attempts |

## 8. CONTINUOUS SECURITY MONITORING

### 8.1 Unified Security Dashboard (Splunk Enterprise Security)

**Real-Time Security Metrics (SOC Wall Display - 4K Monitors × 6):**

```
Monitor 1: XDR Alert Feed (Live Scroll)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  [10:23:45] P2 - AMP Malware: TrojanDownloader on LAPTOP-456
  [10:22:18] P3 - ISE SGT Violation: User SGT 15 → Server SGT 81 (Denied)
  [10:20:05] P1 - Duo Impossible Travel: user@domain (NYC → London, 30 min)
  [10:18:42] P3 - FTD IPS: SQL Injection attempt blocked (Web Server DMZ)

Monitor 2: Incident Status Board
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Open Incidents: 18
    P1 Critical: 0
    P2 High: 3 (avg age: 2.5 hours)
    P3 Medium: 10 (avg age: 6 hours)
    P4 Low: 5 (avg age: 12 hours)
  
  SLA Compliance: 95% (target: 98%)
  MTTR Today: 22 minutes (target: <120 min)

Monitor 3: Network Traffic Heatmap (ThousandEyes)
Monitor 4: Endpoint Health Status (AMP Coverage %)
Monitor 5: Authentication Success Rate (ISE/Duo)
Monitor 6: Compliance Scorecard (PCI/SOC2/ISO/GDPR)
```

## 9. COMPLIANCE
