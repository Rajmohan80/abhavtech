# 7.12 Cisco XDR Integration

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Domain | abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. Cisco XDR Overview

### 1.1 Extended Detection and Response Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Abhavtech XDR Architecture                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ┌─────────────────────┐                          │
│                    │     Cisco XDR       │                          │
│                    │   Cloud Platform    │                          │
│                    └──────────┬──────────┘                          │
│                               │                                      │
│      ┌────────────────────────┼────────────────────────┐            │
│      │                        │                        │            │
│      ▼                        ▼                        ▼            │
│ ┌──────────┐           ┌──────────┐           ┌──────────┐         │
│ │ Network  │           │ Endpoint │           │  Email   │         │
│ │ Telemetry│           │ Security │           │ Security │         │
│ ├──────────┤           ├──────────┤           ├──────────┤         │
│ │• ISE     │           │• Secure  │           │• Secure  │         │
│ │• Catalyst│           │  Endpoint│           │  Email   │         │
│ │  Center  │           │  (AMP)   │           │  Gateway │         │
│ │• Firewall│           │• Orbital │           │          │         │
│ │• Umbrella│           │          │           │          │         │
│ └──────────┘           └──────────┘           └──────────┘         │
│      │                        │                        │            │
│      └────────────────────────┼────────────────────────┘            │
│                               │                                      │
│                    ┌──────────▼──────────┐                          │
│                    │   Unified Response  │                          │
│                    │  • Automated CoA    │                          │
│                    │  • Quarantine       │                          │
│                    │  • Block at edge    │                          │
│                    │  • SOC alerting     │                          │
│                    └─────────────────────┘                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Integration Components

| Component | Integration Type | Data Shared |
|-----------|-----------------|-------------|
| Cisco ISE | pxGrid/API | Sessions, endpoints, posture |
| Catalyst Center | API | Network events, assurance |
| Secure Endpoint | Native | Malware detections, IOCs |
| Umbrella | Native | DNS blocks, threats |
| Secure Firewall | eStreamer | IPS events, connections |
| Secure Email | API | Phishing, malware attachments |

---

## 2. ISE to XDR Integration

### 2.1 pxGrid Cloud Configuration

```
Administration → pxGrid Services → Settings → pxGrid Cloud

Enable XDR Integration:
  ☑ Enable pxGrid Cloud
  ☑ Share endpoint data with XDR
  ☑ Receive threat intelligence from XDR
  
Data Sharing:
  ☑ Endpoint sessions
  ☑ Authentication events
  ☑ Authorization results
  ☑ Posture assessments
  ☑ Profiling data
```

### 2.2 Threat-Centric NAC Configuration

```
Administration → Threat Centric NAC → Configure

Threat Sources:
  ┌─────────────────────────────────────────────────────────────┐
  │ Source              │ Status     │ Events/Hour │ Action     │
  ├─────────────────────┼────────────┼─────────────┼────────────┤
  │ Cisco XDR           │ Connected  │ 234         │ Auto-CoA   │
  │ Secure Endpoint     │ Connected  │ 456         │ Auto-CoA   │
  │ Umbrella            │ Connected  │ 1,234       │ Log only   │
  │ Stealthwatch        │ Connected  │ 89          │ Auto-CoA   │
  └─────────────────────┴────────────┴─────────────┴────────────┘

XDR Adapter Configuration:
  Name: Abhavtech-XDR-Adapter
  Cloud URL: visibility.amp.cisco.com
  API Client ID: ****************************
  API Key: ****************************
  
  Response Settings:
    Threat Score ≥ 90: Quarantine immediately
    Threat Score 70-89: Limit access + Alert
    Threat Score 50-69: Enhanced logging
    Threat Score < 50: Normal access
```

### 2.3 Automated Response Policy

```yaml
XDR_Response_Policies:

  Critical_Threat:
    Trigger: XDR threat_score >= 90
    Actions:
      - ISE CoA: Quarantine (SGT 999)
      - Block at firewall perimeter
      - Isolate from network segment
      - Alert SOC (PagerDuty P1)
      - Create ServiceNow incident
      - Collect forensic data
    SLA: Respond within 1 minute
    
  High_Threat:
    Trigger: XDR threat_score 70-89
    Actions:
      - ISE CoA: Limited access (SGT 998)
      - Block suspicious destinations
      - Alert SOC (PagerDuty P2)
      - Enable enhanced logging
    SLA: Respond within 5 minutes
    
  Medium_Threat:
    Trigger: XDR threat_score 50-69
    Actions:
      - Log all traffic
      - Alert security team (email)
      - Schedule endpoint scan
    SLA: Review within 30 minutes
```

---

## 3. Catalyst Center Integration

### 3.1 API Integration Setup

```python
# Catalyst Center to XDR Integration Script
# /opt/abhavtech/scripts/catalyst_xdr_integration.py

import requests
from datetime import datetime

XDR_API_URL = "https://api.xdr.cisco.com/v1"
CATALYST_API_URL = "https://catalyst.abhavtech.com/dna/intent/api/v1"

def send_network_event_to_xdr(event):
    """Send Catalyst Center event to XDR"""
    
    headers = {
        "Authorization": f"Bearer {XDR_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "source": "catalyst-center",
        "type": "network-event",
        "timestamp": datetime.utcnow().isoformat(),
        "data": {
            "event_type": event["type"],
            "device_ip": event["device_ip"],
            "severity": event["severity"],
            "description": event["message"]
        }
    }
    
    response = requests.post(
        f"{XDR_API_URL}/incidents",
        headers=headers,
        json=payload
    )
    
    return response.json()
```

### 3.2 Assurance Event Forwarding

```
Catalyst Center → System → Settings → External Services → XDR

XDR Integration:
  Status: ✓ Connected
  API Endpoint: https://api.xdr.cisco.com
  
  Event Types to Forward:
    ☑ Security Events (Critical/High)
    ☑ Anomaly Detections
    ☑ Rogue AP/Client Alerts
    ☑ Authentication Failures (bulk)
    ☑ Device Health Critical
    
  Forwarding Rules:
    Severity: Critical, High
    Rate Limit: 1000 events/minute
    Batch Size: 100 events
```

---

## 4. Incident Response Workflow

### 4.1 XDR Incident Workflow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    XDR Incident Response Flow                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   1. DETECTION                                                      │
│   ┌──────────────────────────────────────────────────────────────┐ │
│   │ XDR correlates events from multiple sources:                 │ │
│   │ • Secure Endpoint: Malware detected on endpoint              │ │
│   │ • ISE: Same endpoint authenticated on network               │ │
│   │ • Umbrella: C2 callback attempts blocked                    │ │
│   │ → Creates unified incident with threat score 95             │ │
│   └──────────────────────────────────────────────────────────────┘ │
│                               │                                     │
│                               ▼                                     │
│   2. INVESTIGATION                                                  │
│   ┌──────────────────────────────────────────────────────────────┐ │
│   │ XDR enriches incident with context:                          │ │
│   │ • User identity (from ISE)                                  │ │
│   │ • Device profile (from ISE/Intune)                          │ │
│   │ • Network location (from Catalyst Center)                   │ │
│   │ • File hash reputation (from Talos)                         │ │
│   │ • Historical behavior baseline                              │ │
│   └──────────────────────────────────────────────────────────────┘ │
│                               │                                     │
│                               ▼                                     │
│   3. CONTAINMENT (Automated)                                        │
│   ┌──────────────────────────────────────────────────────────────┐ │
│   │ XDR triggers automated response:                             │ │
│   │ • ISE: CoA to quarantine VLAN (SGT 999)                     │ │
│   │ • Firewall: Block lateral movement                          │ │
│   │ • Umbrella: Block related domains                           │ │
│   │ • Secure Endpoint: Isolate host                             │ │
│   └──────────────────────────────────────────────────────────────┘ │
│                               │                                     │
│                               ▼                                     │
│   4. REMEDIATION                                                    │
│   ┌──────────────────────────────────────────────────────────────┐ │
│   │ SOC analyst reviews and remediates:                          │ │
│   │ • Verify containment effective                              │ │
│   │ • Run forensic collection (Orbital)                         │ │
│   │ • Clean malware from endpoint                               │ │
│   │ • Update IOCs in threat intel                               │ │
│   │ • Release from quarantine when clean                        │ │
│   └──────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 4.2 ISE CoA Response Configuration

```
! ISE Authorization Profile for XDR Quarantine

Authorization Profile: XDR-Quarantine-Profile
  Access Type: ACCESS_ACCEPT
  VLAN: 999 (Quarantine)
  SGT: 999 (Quarantine)
  dACL: QUARANTINE-DACL
  
  URL Redirect:
    Redirect URL: https://remediation.abhavtech.com/quarantine
    Redirect ACL: REDIRECT-TO-QUARANTINE
  
  Posture:
    Posture Discovery: Enabled
    Posture Status: Non-Compliant
    
! DACL for Quarantine
ip access-list extended QUARANTINE-DACL
 permit udp any any eq 53        ! DNS for remediation portal
 permit tcp any host 10.250.10.100 eq 443  ! Remediation portal
 permit tcp any host 10.250.10.101 eq 443  ! AV update server
 deny ip any any log
```

---

## 5. XDR Dashboard for Abhavtech

### 5.1 Custom Dashboard Configuration

```
XDR → Dashboards → Custom → Create New

Dashboard: Abhavtech-SOC-Overview

Widgets:
  Row 1:
    ├── Threat Score Distribution (Pie chart)
    ├── Active Incidents by Severity (Bar chart)
    └── Endpoints by Risk Level (Heat map)
    
  Row 2:
    ├── Top 10 Targeted Endpoints (Table)
    ├── Geographic Attack Map (Map)
    └── Incident Timeline (Line chart)
    
  Row 3:
    ├── ISE Authentication Events (Trend)
    ├── Quarantined Endpoints (Counter)
    └── Mean Time to Respond (Gauge)
```

### 5.2 Executive Summary View

```
┌──────────────────────────────────────────────────────────────┐
│ Abhavtech XDR Executive Summary - Last 24 Hours              │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Security Posture Score: 94/100 ████████████████████░░        │
│                                                              │
│ Incidents:                    Response Metrics:              │
│ ├── Critical: 2 (resolved)   ├── MTTD: 2.3 minutes          │
│ ├── High: 8 (3 active)       ├── MTTR: 18.5 minutes         │
│ ├── Medium: 23               └── Auto-contained: 85%        │
│ └── Low: 156                                                 │
│                                                              │
│ Top Threats Detected:                                        │
│ 1. Emotet variant (blocked by Secure Endpoint)              │
│ 2. Phishing campaign (blocked by Secure Email)              │
│ 3. Cryptominer (blocked by Umbrella)                        │
│                                                              │
│ Network Actions Taken:                                       │
│ ├── Endpoints quarantined: 5                                │
│ ├── CoA issued: 12                                          │
│ └── Firewall blocks: 234                                    │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 6. Microsoft Sentinel Integration

### 6.1 XDR to Sentinel Data Connector

```yaml
Sentinel_Integration:
  
  Connector_Type: Cisco XDR Data Connector
  
  Data_Types_Ingested:
    - XDR Incidents
    - Secure Endpoint Alerts
    - Umbrella Events
    - ISE Authentication (via XDR)
    
  Log_Analytics_Tables:
    - CiscoXDR_Incidents_CL
    - CiscoSecureEndpoint_CL
    - CiscoUmbrella_CL
    - CiscoISE_Auth_CL
    
  Retention: 365 days
```

### 6.2 Sentinel Analytics Rules

```kql
// Sentinel Analytics Rule: XDR Critical Incident
CiscoXDR_Incidents_CL
| where TimeGenerated > ago(5m)
| where threat_score_d >= 90
| where status_s == "new"
| extend EndpointIP = tostring(parse_json(affected_assets_s)[0].ip)
| extend UserName = tostring(parse_json(affected_assets_s)[0].user)
| project TimeGenerated, incident_id_s, threat_score_d, EndpointIP, UserName
| join kind=inner (
    CiscoISE_Auth_CL
    | where TimeGenerated > ago(1h)
    | project AuthTime=TimeGenerated, UserName=username_s, NASIP=nas_ip_s
) on UserName
```

---

## 7. Operational Procedures

### 7.1 SOC Playbook - XDR Incident

```yaml
Playbook: XDR-Critical-Incident-Response

Trigger: XDR incident with threat_score >= 90

Step_1_Triage:
  Time: 0-2 minutes
  Actions:
    - Review XDR incident summary
    - Verify automated containment triggered
    - Check ISE for endpoint quarantine status
    - Validate firewall blocks in place
    
Step_2_Investigation:
  Time: 2-15 minutes
  Actions:
    - Review XDR timeline of events
    - Analyze affected endpoint in Secure Endpoint
    - Check Umbrella for DNS activity
    - Query ISE for user session history
    - Review Catalyst Center for network anomalies
    
Step_3_Containment_Verification:
  Time: 15-20 minutes
  Actions:
    - Confirm endpoint isolated (ping test)
    - Verify no lateral movement (firewall logs)
    - Check SGACL enforcement in fabric
    - Validate quarantine VLAN active
    
Step_4_Remediation:
  Time: 20-60 minutes
  Actions:
    - Run Orbital forensic collection
    - Remove malware via Secure Endpoint
    - Reset user credentials if compromised
    - Update threat intelligence
    
Step_5_Recovery:
  Time: 60+ minutes
  Actions:
    - Re-scan endpoint for clean status
    - Remove from quarantine via ISE
    - Monitor for 24 hours
    - Document lessons learned
```

---

## 8. Verification and Testing

### 8.1 Integration Health Check

```
# Check XDR API connectivity
curl -X GET "https://api.xdr.cisco.com/v1/health" \
  -H "Authorization: Bearer ${XDR_API_KEY}"

# Expected response:
{
  "status": "healthy",
  "integrations": {
    "ise": "connected",
    "catalyst_center": "connected",
    "secure_endpoint": "connected",
    "umbrella": "connected"
  }
}
```

### 8.2 Test Incident Simulation

```yaml
Test_Scenario: Malware Detection Response

Steps:
  1. Deploy EICAR test file on test endpoint
  2. Verify Secure Endpoint detection
  3. Confirm XDR incident creation
  4. Validate ISE CoA to quarantine
  5. Check Catalyst Center isolation
  6. Verify SOC notification received
  7. Execute remediation workflow
  8. Confirm release from quarantine

Expected_Results:
  - Detection: < 1 minute
  - Containment: < 2 minutes
  - SOC Alert: < 3 minutes
  - Full remediation: < 30 minutes
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
