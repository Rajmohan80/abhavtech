# Access Anomalies

 XDR AUTOMATED RESPONSE PLAYBOOK EXECUTION

## Investigation Summary

**Incident:** Ransomware detected on endpoint triggered XDR automated response playbook, isolating device and blocking C2 within 45 seconds.

**Detection:** AMP detected WannaCry variant; XDR correlated across network/endpoint/cloud to execute multi-step remediation playbook.

**Impact:** Single endpoint infected; ransomware contained before encryption started, zero data loss.

**Outcome:** XDR automation prevented ransomware outbreak; validates AI-driven security orchestration.

---

## Step 1: Initial Detection - AMP Malware Alert

**Detection Timestamp:** 2026-02-01 15:42:18 UTC

**Alert Source:** Cisco AMP (Advanced Malware Protection)

```
AMP Alert: Ransomware Detected
SHA-256: a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0
File Name: invoice_Q1.exe
Detection: W32.WannaCry.Variant-95
Hostname: DESKTOP-HR-23
User: hr-user-maya@abhavtech.com
Path: C:\Users\hr-user-maya\Downloads\invoice_Q1.exe
Disposition: Malicious
Threat Score: 100/100
Action: Quarantined

Indicators:
- File attempts to encrypt user files (.docx, .xlsx, .pdf)
- Network beacon to 118.92.XX.XXX:443 (known C2)
- Creates mutex "MsWinZonesCacheCounterMutexA0" (WannaCry signature)
- Modifies registry: HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
```

**XDR Automation Trigger:**

Within 2 seconds of AMP alert, XDR (SecureX) receives webhook:

```json
{
  "event_type": "amp.malware.detected",
  "severity": "critical",
  "sha256": "a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0",
  "hostname": "DESKTOP-HR-23",
  "disposition": "Malicious",
  "detection_name": "W32.WannaCry.Variant-95",
  "threat_score": 100,
  "connector_guid": "<endpoint-guid>",
  "timestamp": "2026-02-01T15:42:18Z"
}
```

**XDR Playbook Selection:**

XDR automatically selects "Ransomware-Response-v2" playbook based on:
- Malware type: Ransomware
- Threat score: ≥90
- Disposition: Malicious

---

## Step 2: XDR Playbook Execution (Automated)

**Playbook:** Ransomware-Response-v2  
**Execution Mode:** Fully Automated (no human approval required for critical threats)  
**Start Time:** 2026-02-01 15:42:20 UTC (2 seconds after detection)

**Step 2.1: Endpoint Isolation (t+0s)**

```bash
CASE_ID="CASE-2026-014-RANSOMWARE"

POST https://orbital.amp.cisco.com/v0/isolate
{
  "connector_guid": "<endpoint-guid>",
  "comment": "Automated isolation - Ransomware detected (CASE-2026-014)"
}

## Response (t+3s):
{
  "status": "success",
  "isolated": true,
  "timestamp": "2026-02-01T15:42:23Z"
}

## Endpoint isolated from network in 3 seconds
```

**Step 2.2: Block C2 on Firewall (t+5s)**

```bash
## XDR calls FMC API to block C2 IP globally
POST https://fmc.abhavtech.com/api/fmc_config/v1/domain/{domain}/policy/accesspolicies/{policy}/accessrules
{
  "action": "BLOCK",
  "enabled": true,
  "name": "XDR-Auto-Block-Ransomware-C2-118.92.XX.XXX",
  "sourceNetworks": {"objects": [{"type": "Any"}]},
  "destinationNetworks": {"objects": [{"type": "Host", "value": "118.92.XX.XXX"}]},
  "logBegin": true,
  "logEnd": true,
  "sendEventsToFMC": true
}

## Deploy to all FTDs
POST https://fmc.abhavtech.com/api/fmc_config/v1/domain/{domain}/deployment/deployabledevices
{
  "type": "DeploymentRequest",
  "forceDeploy": true,
  "deviceList": ["all"]
}

## C2 blocked on all firewalls in 15 seconds (t+15s)
```

**Step 2.3: Block C2 Domain in DNS (t+10s)**

```bash
## XDR calls Umbrella API
POST https://api.umbrella.com/deployments/v2/destinations
{
  "domain": "wannacry-c2.example.com",
  "type": "blacklist",
  "comment": "XDR Auto-Block - Ransomware C2 (CASE-2026-014)"
}

## DNS sinkhole active in 10 seconds
```

**Step 2.4: Revoke User Sessions (t+12s)**

```bash
## XDR calls Duo API
POST https://api.duosecurity.com/admin/v1/users/hr-user-maya@abhavtech.com/sessions/revoke
{
  "all_sessions": true
}

## All user sessions revoked (VPN, SSO, etc.)
```

**Step 2.5: Create Incident Ticket (t+18s)**

```bash
## XDR calls ServiceNow API
POST https://abhavtech.service-now.com/api/now/table/incident
{
  "short_description": "Ransomware Detected - Automated Response Executed",
  "description": "WannaCry variant detected on DESKTOP-HR-23. XDR playbook executed: endpoint isolated, C2 blocked, user sessions revoked.",
  "urgency": "1",
  "impact": "1",
  "category": "Security - Malware",
  "assignment_group": "SOC-Forensics-Team",
  "u_automation": "XDR Playbook: Ransomware-Response-v2"
}

## INC0012357 created
```

**Step 2.6: Notify SOC Team (t+20s)**

```bash
## XDR sends Slack notification
POST https://slack.com/api/chat.postMessage
{
  "channel": "#security-alerts",
  "text": "🚨 *CRITICAL: Ransomware Detected*",
  "attachments": [{
    "color": "danger",
    "fields": [
      {"title": "Hostname", "value": "DESKTOP-HR-23", "short": true},
      {"title": "User", "value": "hr-user-maya@abhavtech.com", "short": true},
      {"title": "Malware", "value": "W32.WannaCry.Variant-95", "short": true},
      {"title": "Action", "value": "Endpoint Isolated + C2 Blocked", "short": true},
      {"title": "Incident", "value": "INC0012357", "short": true},
      {"title": "Response Time", "value": "20 seconds", "short": true}
    ]
  }]
}

## Email sent
MAILTO: soc-team@abhavtech.com
SUBJECT: CRITICAL: Ransomware Detected - XDR Auto-Response Executed
```

**Step 2.7: Capture Memory Dump (t+25s)**

```bash
## XDR calls Orbital API
POST https://orbital.amp.cisco.com/v0/jobs
{
  "name": "XDR Auto-Capture - Ransomware Memory Dump",
  "query": "memory_dump",
  "connector_guid": "<endpoint-guid>"
}

## Memory dump captured for forensic analysis
```

**Step 2.8: Query Threat Intelligence (t+30s)**

```bash
## XDR queries Talos, VirusTotal, ThreatGrid
GET https://talosintelligence.com/api/v2/details/ip/118.92.XX.XXX
GET https://www.virustotal.com/api/v3/files/a9b0c1d2e3f4a5b6...
GET https://panacea.threatgrid.com/api/v2/samples/a9b0c1d2e3f4a5b6.../analysis

## Enrich incident with TI data
PATCH https://abhavtech.service-now.com/api/now/table/incident/INC0012357
{
  "u_threat_intelligence": "WannaCry variant, APT attribution: Lazarus Group (NK), active C2: 118.92.XX.XXX, IoCs: 47 related hashes"
}
```

**Step 2.9: Check for Lateral Movement (t+35s)**

```bash
## XDR queries Splunk for lateral movement indicators
POST https://splunk.abhavtech.com/services/search/jobs
{
  "search": "index=windows sourcetype=WinEventLog:Security earliest=-15m | search src_ip=10.252.90.123 (EventCode=4624 OR EventCode=4625 OR EventCode=4648) | stats count by dest_ip EventCode",
  "earliest_time": "-15m"
}

## Results: 0 lateral movement attempts
## Ransomware contained to single endpoint
```

**Step 2.10: Playbook Completion (t+45s)**

```bash
## XDR logs playbook execution
POST https://securex.abhavtech.com/api/v1/incidents/CASE-2026-014/timeline
{
  "event": "Playbook Completed",
  "playbook": "Ransomware-Response-v2",
  "duration": "45 seconds",
  "steps_executed": 10,
  "steps_successful": 10,
  "status": "Success",
  "actions": [
    "Endpoint isolated (3s)",
    "C2 blocked on FTD (15s)",
    "C2 blocked in DNS (10s)",
    "User sessions revoked (12s)",
    "Incident created (18s)",
    "SOC notified (20s)",
    "Memory dump captured (25s)",
    "Threat intelligence queried (30s)",
    "Lateral movement checked (35s)",
    "Playbook completed (45s)"
  ]
}

## Full automated response completed in 45 seconds
```

---

## Step 3: Human Analyst Validation

**SOC Analyst Response (t+2 minutes):**

```bash
## Analyst reviews XDR incident
## Access SecureX dashboard

## Validate endpoint isolation
curl -k -X GET \
  "https://orbital.amp.cisco.com/v0/computers/<endpoint-guid>/isolation" \
  -H "Authorization: Bearer $ORBITAL_TOKEN"

## Response:
{
  "connector_guid": "<endpoint-guid>",
  "isolated": true,
  "isolation_start": "2026-02-01T15:42:23Z",
  "reason": "Ransomware detected - XDR automation"
}

## Confirmed isolated

## Validate C2 block
curl -k -X GET \
  "https://fmc.abhavtech.com/api/fmc_config/v1/domain/$FMC_DOMAIN/policy/accesspolicies/<policy-id>/accessrules?filter=name:XDR-Auto-Block" \
  -H "X-auth-access-token: $FMC_TOKEN"

## Confirmed C2 blocked

## Check for encrypted files
curl -k -X POST \
  "https://orbital.amp.cisco.com/v0/jobs" \
  -d '{
    "query": "SELECT path, filename, extension FROM file WHERE (extension = \".WNCRY\" OR extension = \".wcry\") AND ctime > 1738428138;",
    "connector_guid": "<endpoint-guid>"
  }'

## Results: 0 encrypted files
## Ransomware stopped before encryption began
```

---

## Step 4: Forensic Analysis

**4.1 Analyze Ransomware Sample:**

```bash
## Download malware from AMP quarantine
curl -k -X GET \
  "https://api.amp.cisco.com/v1/file/a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0/download" \
  -H "Authorization: Basic $(echo -n $AMP_CLIENT_ID:$AMP_API_KEY | base64)" \
  > /mnt/evidence_vault/EVD-20260201-001-wannacry-sample.exe

## Submit to ThreatGrid for sandbox analysis
curl -X POST \
  "https://panacea.threatgrid.com/api/v2/samples" \
  -H "api_key: $THREATGRID_API_KEY" \
  -F "sample=@/mnt/evidence_vault/EVD-20260201-001-wannacry-sample.exe" \
  -F "vm=win10"

## ThreatGrid Analysis Results:
{
  "sample_id": "12345678",
  "threat_score": 100,
  "behaviors": [
    "Encrypts user files with AES-256",
    "Appends .WNCRY extension",
    "Creates ransom note: @Please_Read_Me@.txt",
    "Deletes shadow copies (vssadmin delete shadows /all)",
    "Disables Windows Defender",
    "Spreads via EternalBlue SMB exploit (MS17-010)",
    "C2 communication: 118.92.XX.XXX:443 (TLS 1.2)"
  ],
  "network_indicators": [
    "118.92.XX.XXX:443",
    "wannacry-c2.example.com"
  ],
  "file_indicators": [
    "C:\\Windows\\mssecsvc.exe",
    "C:\\Windows\\tasksche.exe",
    "@Please_Read_Me@.txt"
  ]
}
```

**4.2 Impact Assessment:**

```bash
## Check encryption status
curl -k -X POST \
  "https://orbital.amp.cisco.com/v0/jobs" \
  -d '{
    "query": "SELECT count(*) as encrypted_files FROM file WHERE extension IN (\".WNCRY\", \".wcry\");",
    "connector_guid": "<endpoint-guid>"
  }'

## Results: encrypted_files = 0
## ZERO data loss - ransomware stopped before encryption

## Check user data integrity
curl -k -X POST \
  "https://orbital.amp.cisco.com/v0/jobs" \
  -d '{
    "query": "SELECT path, mtime FROM file WHERE directory LIKE \"%Documents%\" ORDER BY mtime DESC LIMIT 10;",
    "connector_guid": "<endpoint-guid>"
  }'

## Results show files NOT modified
## User data intact
```

---

## Step 5: Forensics Report

```python
report = {
    "case_id": "CASE-2026-014-RANSOMWARE",
    "investigation_type": "Ransomware Attack - XDR Automated Response",
    "incident_date": "2026-02-01",
    "analyst": "SOC-Analyst-Priya-Nair",
    
    "executive_summary": """
    WannaCry ransomware variant detected and contained within 45 seconds via
    XDR automated response playbook. Zero data loss, single endpoint affected.
    
    Attack Timeline:
    - 15:42:18 - AMP detects ransomware
    - 15:42:20 - XDR playbook auto-executes (2 seconds)
    - 15:42:23 - Endpoint isolated (3 seconds)
    - 15:42:35 - C2 blocked globally (15 seconds)
    - 15:43:03 - Playbook completed (45 seconds)
    
    Automated Actions (10 steps, 45 seconds):
    1. Endpoint isolation (AMP Orbital)
    2. C2 IP block (FMC/FTD)
    3. C2 domain sinkhole (Umbrella)
    4. User session revocation (Duo)
    5. Incident ticket creation (ServiceNow)
    6. SOC notification (Slack + Email)
    7. Memory dump capture (Orbital)
    8. Threat intelligence enrichment (Talos + VT + ThreatGrid)
    9. Lateral movement check (Splunk)
    10. Playbook completion log
    
    Impact: ZERO DATA LOSS
    - Files encrypted: 0
    - Lateral spread: 0
    - Downtime: 2 hours (endpoint rebuild)
    
    XDR Value:
    - Automated response 120x faster than human (45s vs. 90 minutes avg)
    - Prevented ransomware outbreak (single endpoint vs. potential 100+)
    - Cost avoidance: $2.5M (avg ransomware recovery cost)
    
    AI/ML Integration:
    - AMP behavioral detection (100% threat score)
    - XDR correlation across 5 data sources
    - Automated playbook selection (no human input)
    - Real-time threat intelligence enrichment
    """,
    
    "xdr_playbook_analysis": """
    Playbook: Ransomware-Response-v2
    Trigger: AMP malware detection + threat_score ≥ 90
    Mode: Fully automated (no approval required)
    
    Execution Timeline:
    00:00 - AMP webhook received by XDR
    00:02 - Playbook selected and started
    00:03 - Step 1: Endpoint isolated
    00:15 - Step 2: C2 blocked on FTD
    00:10 - Step 3: DNS sinkhole enabled
    00:12 - Step 4: User sessions revoked
    00:18 - Step 5: Incident ticket created
    00:20 - Step 6: SOC team notified
    00:25 - Step 7: Memory dump captured
    00:30 - Step 8: Threat intelligence queried
    00:35 - Step 9: Lateral movement checked
    00:45 - Step 10: Playbook completed
    
    Success Metrics:
    - Steps Executed: 10/10
    - Steps Successful: 10/10
    - Success Rate: 100%
    - Total Duration: 45 seconds
    - Human Validation: t+2 minutes
    
    Integration Points:
    - AMP (malware detection, endpoint isolation, memory capture)
    - FMC/FTD (C2 blocking)
    - Umbrella (DNS sinkhole)
    - Duo (session revocation)
    - ServiceNow (ticketing)
    - Slack (notification)
    - Splunk (correlation)
    - Talos/VirusTotal/ThreatGrid (threat intelligence)
    
    Compared to Manual Response:
    - Manual response time: ~90 minutes average
    - XDR response time: 45 seconds
    - Speed improvement: 120x faster
    - Human error risk: Eliminated
    """,
    
    "evidence_summary": [
        "EVD-20260201-001: WannaCry malware sample",
        "EVD-20260201-002: AMP trajectory",
        "EVD-20260201-003: Memory dump (8 GB)",
        "EVD-20260201-004: XDR playbook execution log",
        "EVD-20260201-005: ThreatGrid analysis report",
        "EVD-20260201-REPORT: Complete forensics report"
    ],
    
    "lessons_learned": """
    XDR Automation Effectiveness:
    1. Speed is critical - 45 seconds vs. 90 minutes prevents spread
    2. Automated response eliminates human delay and error
    3. Cross-platform integration essential (8 different systems)
    4. Threat intelligence enrichment adds context immediately
    5. Human validation still important (verify, don't approve)
    
    AI/ML Integration Success:
    - AMP behavioral detection: 100% threat score (accurate)
    - XDR playbook selection: Correct playbook chosen automatically
    - No false positives in this incident
    - Confidence in automation enables "auto-execute" mode
    
    Zero Trust Architecture Validation:
    - Endpoint isolation prevented lateral movement
    - Micro-segmentation contained threat
    - Continuous monitoring detected threat immediately
    - Automated response enforced policy instantly
    """,
    
    "recommendations": [
        "Expand XDR playbooks to cover more attack scenarios",
        "Implement predictive threat hunting using AI/ML",
        "Deploy automated patch management (MS17-010 was patched in 2017!)",
        "Enhance email security (malware arrived via phishing)",
        "Deploy backup/recovery automation for faster restoration",
        "Conduct tabletop exercise simulating XDR failure scenarios"
    ]
}

with open('/mnt/evidence_vault/REPORT-CASE-2026-014-RANSOMWARE.json', 'w') as f:
    json.dump(report, f, indent=2)

sha256sum /mnt/evidence_vault/REPORT-CASE-2026-014-RANSOMWARE.json
peer chaincode invoke -n evidence-contract -C evidence-channel \
  -c '{"Args":["CollectEvidence","EVD-20260201-REPORT","CASE-2026-014-RANSOMWARE",...]}'
```

---

**END OF PART 2E: ZERO TRUST FORENSICS**

---

This completes Part 2E with all 3 scenarios:
1. ✅ MFA Bypass Attempt Investigation
2. ✅ Device Trust Violation
3. ✅ XDR Automated Response Playbook Execution

**Total Evidence Items:** 15 blockchain-registered artifacts
**Total Steps:** 26 across 3 scenarios
**Word Count:** ~22,000 words

**Remaining Parts:**
- Part 2F: AI Observability Forensics (4 scenarios - FINAL PART)

**Next: Part 2F - AI Observability Forensics?**
