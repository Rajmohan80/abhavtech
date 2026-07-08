# SOC Operations

## 6. SECURITY OPERATIONS CENTER (SOC) PROCEDURES

The Abhavtech SOC operates 24x7x365 in a follow-the-sun model with **12 SOC analysts** (4 analysts per shift) providing continuous monitoring, incident triage, and response.

### 6.1 SOC Organization & Staffing

```
┌──────────────────────────────────────────────────────────────────┐
│                   ABHAVTECH SOC STRUCTURE                         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                         SOC Lead                                 │
│                         ────────                                 │
│                  (1 FTE, Day Shift NJ)                           │
│                                                                  │
│          ┌──────────────────┴──────────────────┐                │
│          │                                     │                │
│      L2 Analysts (6 FTEs)              L1 Analysts (6 FTEs)     │
│      ──────────────────                ──────────────────        │
│      • Incident Investigation          • Alert Triage           │
│      • Threat Hunting                  • Event Correlation       │
│      • Escalation to Security Mgr      • XDR Case Creation      │
│      • 3+ years experience             • 1-2 years experience   │
│                                                                  │
│  SHIFT SCHEDULE (24x7 Coverage):                                │
│  ───────────────────────────────────────                        │
│  Shift 1: 06:00-14:00 GMT (NJ)       → 2 L1 + 2 L2             │
│  Shift 2: 14:00-22:00 GMT (London)   → 2 L1 + 2 L2             │
│  Shift 3: 22:00-06:00 GMT (Mumbai)   → 2 L1 + 2 L2             │
│                                                                  │
│  ESCALATION PATH:                                               │
│  ────────────────                                               │
│  L1 Analyst → L2 Analyst → SOC Lead → Security Manager → CISO  │
│                                                                  │
│  SHIFT HANDOFF:                                                 │
│  ─────────────                                                  │
│  • 30-minute overlap (shift change)                             │
│  • Handoff notes in ServiceNow (open incidents, ongoing hunts)  │
│  • Webex Teams shift channel (real-time updates)                │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**SOC Analyst Skill Matrix:**

| Skill | L1 Analyst (Entry) | L2 Analyst (Senior) | SOC Lead | Required Training |
|-------|-------------------|-------------------|----------|------------------|
| **XDR Platform (SecureX)** | Triage alerts, create cases | Investigate cases, tune playbooks, threat response | Architect playbooks, mentor team, escalate to vendor | Cisco SecureX certification (40 hours) |
| **SIEM (Splunk)** | Read dashboards, run saved searches | Write SPL queries, create alerts, correlate events | Architect dashboards, optimize performance, manage licenses | Splunk Core Certified User (L1), Power User (L2), Admin (Lead) |
| **Endpoint (AMP)** | Review detections, isolate endpoints | Orbital forensics, trajectory analysis, custom IOC lists | Manage policies, integrate with XDR, tune detection | AMP for Endpoints training (20 hours) |
| **Network (ISE, FTD)** | Read auth logs, quarantine devices | Investigate SGT violations, tune policies, analyze flows | Design policies, integrate with XDR, capacity planning | ISE Fundamentals (40 hours), FTD Essentials (40 hours) |
| **Incident Response** | Follow playbooks (PB-001 to 008), escalate if unsure | Lead P2/P3 investigations, forensics, reporting | Lead P1 investigations, executive reporting, post-mortems | SANS SEC504 (Incident Response) or equivalent |
| **Threat Hunting** | Assist hunts (run queries), document findings | Lead hunts (hypothesis-driven), MITRE ATT&CK mapping | Define hunt program, prioritize threats, measure ROI | SANS SEC555 (SIEM/Tactical Analytics) or equivalent |
| **Compliance** | Understand PCI/SOC2 requirements | Collect audit evidence, support auditors | Coordinate audits, remediate findings, policy updates | PCI-DSS Fundamentals (8 hours), ISO 27001 Awareness (4 hours) |

### 6.2 Daily SOC Operations Workflow

**Standard Day Shift (06:00-14:00 GMT, NJ Team):**

```
06:00  Shift Start
       ──────────
       • Shift handoff from Mumbai team (Webex call, 30 min overlap)
       • Review overnight incidents in ServiceNow (filter: assigned to Mumbai, status=In Progress)
       • Check XDR alert queue (priority: P1 Critical alerts first)

06:30  Morning Briefing
       ───────────────
       • SOC Lead hosts 15-min standup (Webex Teams)
       • Topics: Overnight incidents, emerging threats (Talos alert review), priority focus areas
       • Assign tasks: L1 analysts (alert triage), L2 analysts (investigations, threat hunt)

07:00  Alert Triage (L1 Analysts)
       ──────────────────────────
       • XDR alert queue: ~60-80 alerts overnight (avg: 180/day ÷ 3 shifts = 60/shift)
       • Priority: P1 (Critical) > P2 (High) > P3 (Medium) > P4 (Low)
       • Triage process (per alert, ~10 min avg):
         1. Read alert description (XDR case summary)
         2. Gather context (user, device, location, recent activity)
         3. Enrich IOCs (Threat Response: file hash, IP, domain reputation)
         4. Correlate events (Splunk: related logs, timeline)
         5. Determine disposition:
            - TRUE POSITIVE → Escalate to L2 (if P1/P2) or contain (if automated playbook)
            - FALSE POSITIVE → Mark as FP in XDR, tune detection rule
            - BENIGN → Close case with notes

08:00  Incident Investigation (L2 Analysts)
       ────────────────────────────────────
       • P1 Critical (immediate): Ransomware, data breach, DDoS
         - Lead: L2 Analyst, Support: SOC Lead + Security Manager
         - Tools: AMP Orbital (forensics), FTD PCAP, ISE session logs, Splunk correlation
         - Timeline: Contain within 30 min, investigate 1-2 hours, report to CISO
       • P2 High (1-hour SLA): Phishing campaign, compromised credential, lateral movement
         - Lead: L2 Analyst, Support: L1 Analyst (data gathering)
         - Investigation: Scope (how many affected?), containment (quarantine), eradication (reset passwords)
       • P3 Medium (4-hour SLA): Single malware detection, policy violation, UEBA alert
         - Lead: L2 Analyst (independent)
         - Standard investigation: Validate detection, contain if needed, document findings

09:00  Threat Hunting (L2 Analyst, Dedicated Hunter)
       ───────────────────────────────────────────
       • Weekly hunt calendar (Mon: Phishing IOCs, Tue: Lateral Movement, Wed: Data Exfiltration, etc.)
       • Today's hunt: "Hunt for DNS Tunneling" (MITRE ATT&CK T1071.004)
       • Hypothesis: Attackers use DNS queries to exfiltrate data or receive C2 commands
       • Hunt process:
         1. Splunk query: `index=network sourcetype=umbrella | stats count by query_domain | where count > 100 AND len(query_domain) > 50`
         2. Identify high-entropy domains (DGA detection: domain randomness score >0.8)
         3. Cross-reference Umbrella Investigate (domain age, reputation, category)
         4. Investigate suspicious domains: Dest IPs, query frequency, affected users
         5. Findings: 3 suspicious domains (DGA, newly-seen <7 days, query count >500)
         6. Actions: Block domains (Umbrella), investigate affected devices (ISE + AMP)
         7. Document: Hunt report in Confluence, add IOCs to threat intel (XDR)

10:00  Splunk Dashboard Monitoring (L1 Analysts)
       ─────────────────────────────────────────
       • Real-time dashboards (displayed on SOC wall monitors):
         - XDR Alert Volume (live count, trend chart)
         - Failed Authentication Attempts (top users, top source IPs)
         - Network Traffic Anomalies (NetFlow volumetrics, >3 std dev from baseline)
         - AMP Malware Detections (hourly count, blocked vs. quarantined)
         - FTD IPS Events (top attackers, top targets, top signatures)
         - ISE SGT Violations (unauthorized access attempts, quarantine rate)
       • Proactive monitoring: If any metric spikes (e.g., failed auth >100 in 10 min), investigate immediately

11:00  Compliance Evidence Collection (L2 Analyst, Rotating Duty)
       ──────────────────────────────────────────────────────────
       • PCI-DSS quarterly audit prep (next audit: March 2025)
       • Tasks:
         - Export FMC firewall rules (CDE segmentation verification)
         - Export ISE SGACL matrix (CDE access control)
         - Export Splunk CDE logs (90-day retention verification, sample 5 days)
         - Screenshot AMP coverage (CDE servers, 100% agent deployment)
       • Upload evidence to shared folder (Compliance Analyst reviews)

12:00  Lunch Break (Rotating, 1 hour per analyst)
       ─────────────────────────────────────────

13:00  Incident Reporting & Documentation
       ────────────────────────────────────
       • L2 Analysts: Finalize investigation reports in ServiceNow
         - Incident timeline (UTC timestamps)
         - Root cause analysis (how did it happen?)
         - Containment actions (what was done?)
         - Lessons learned (how to prevent recurrence?)
       • Escalation: P1 incidents → Send email summary to CISO + Security Manager
       • Metrics update: Update SOC KPI dashboard (MTTD, MTTR, alert volume)

13:30  Shift Handoff Preparation
       ─────────────────────────
       • NJ team prepares handoff notes (ServiceNow + Webex Teams)
       • Open incidents: P1 (2 ransomware contained, forensics ongoing), P2 (5 phishing investigations), P3 (12 malware detections, all contained)
       • Priority for London team: Continue P1 forensics, complete P2 phishing scope analysis

14:00  Shift End (NJ) → Shift Start (London)
       ───────────────────────────────────
       • 30-minute overlap (13:30-14:00): NJ SOC Lead + London SOC Lead Webex call
       • London team takes over, repeats daily workflow for their shift
```

### 6.3 Incident Response Playbooks (XDR Automation)

**Playbook Execution Flow (Example: PB-001 Malware-Containment):**

```
┌─────────────────────────────────────────────────────────────────────┐
│          XDR PLAYBOOK: PB-001 MALWARE-CONTAINMENT                   │
│          (Fully Automated, ~2-minute MTTR)                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  TRIGGER:                                                           │
│  AMP detection: File execution blocked (reputation < -50)           │
│                                                                     │
│  STEP 1: ENRICH FILE (5 seconds)                                    │
│  ─────────────────────────────────────────────                     │
│  • XDR Threat Response: Check file hash (SHA-256) against:          │
│    - Cisco Talos Intelligence                                       │
│    - VirusTotal (API)                                               │
│    - MISP threat intel feed                                         │
│  • Result: File = "TrojanDownloader.Win32.Agent" (malicious)        │
│                                                                     │
│  STEP 2: GATHER CONTEXT (10 seconds)                                │
│  ──────────────────────────────────────────────                    │
│  • AMP File Trajectory:                                             │
│    - File origin: Email attachment (user: john.doe@abhavtech.com)   │
│    - File path: C:\Users\john.doe\Downloads\invoice.exe             │
│    - Execution: Blocked (AMP prevented execution)                   │
│  • ISE Context Lookup (pxGrid):                                     │
│    - Device: LAPTOP-12345 (john.doe's laptop)                       │
│    - IP address: 10.10.50.123                                       │
│    - SGT: 15 (Corporate User)                                       │
│    - Location: NJ Office, VLAN 50                                   │
│                                                                     │
│  STEP 3: CONTAINMENT (30 seconds)                                   │
│  ─────────────────────────────────────────────                     │
│  • AMP Action: Isolate endpoint (network connectivity disabled)     │
│    - Result: LAPTOP-12345 isolated, user sees "Network Isolated"    │
│  • ISE CoA (Change of Authorization):                               │
│    - ISE sends CoA to switch (port where LAPTOP-12345 connected)    │
│    - Switch re-authenticates device → ISE assigns SGT 999 (Quarantine)│
│    - SGACL: SGT 999 → All = DENY (no network access)               │
│  • FTD Block (Secondary):                                           │
│    - XDR creates FTD block rule: Block IP 10.10.50.123 (inbound/outbound)│
│    - Result: Even if device bypasses ISE, FTD blocks all traffic    │
│                                                                     │
│  STEP 4: NOTIFICATION (15 seconds)                                  │
│  ──────────────────────────────────────────────                    │
│  • ServiceNow: Create incident ticket (INC0012345)                  │
│    - Priority: P2 (High)                                            │
│    - Assigned: SOC L2 Analyst (current shift)                       │
│    - Summary: "Malware detected: TrojanDownloader on LAPTOP-12345"  │
│  • Webex Teams: Post alert to #soc-alerts channel                   │
│    - Message: "@soc-team P2 Malware: LAPTOP-12345 isolated, john.doe affected"│
│  • Email: Notify SOC Lead + Security Manager                        │
│                                                                     │
│  STEP 5: FORENSICS COLLECTION (30 seconds)                          │
│  ──────────────────────────────────────────────────                │
│  • AMP Orbital: Initiate live forensics collection                  │
│    - Collect: Process list, network connections, registry keys, file hashes│
│    - Store: XDR case (forensics data attached)                      │
│  • Splunk: Query related events (10-minute window before/after detection)│
│    - Search: `index=* host=LAPTOP-12345 earliest=-10m latest=+10m`  │
│    - Export: Timeline of events (auth, web browsing, email, file access)│
│                                                                     │
│  STEP 6: REMEDIATION GUIDANCE (10 seconds)                          │
│  ──────────────────────────────────────────────────                │
│  • XDR Case: Add remediation steps (for SOC Analyst to follow):     │
│    1. Review AMP Orbital forensics (check for persistence mechanisms)│
│    2. Interview user john.doe (how did they receive the file?)      │
│    3. Search email (Secure Email): Find other recipients of malicious email│
│    4. Block sender domain (Umbrella): Prevent future emails          │
│    5. Reimage endpoint (IT Ops): Clean install Windows 11            │
│    6. Restore user data (Veeam backup)                              │
│    7. Re-enroll device (ISE 802.1X certificate reissue)             │
│    8. Verify AMP agent (check connectivity, update signatures)       │
│    9. User training (phishing awareness)                            │
│                                                                     │
│  TOTAL PLAYBOOK EXECUTION TIME: ~2 MINUTES (fully automated)        │
│                                                                     │
│  HUMAN FOLLOW-UP: L2 Analyst investigates within 1 hour (P2 SLA)   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 7. THREAT HUNTING

---

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

---
