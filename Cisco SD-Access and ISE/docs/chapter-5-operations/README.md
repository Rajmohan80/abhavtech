# Chapter 5: Operations & Monitoring

## Quick Navigation

| Section | Description |
|---------|-------------|
| [5.1 Operational Framework](#51-operational-framework) | ITIL-aligned operations model |
| [5.2 DNAC Assurance](#52-dnac-assurance-monitoring) | Health dashboards, analytics |
| [5.3 ISE Monitoring](#53-ise-monitoring-and-reporting) | RADIUS logs, profiling, posture |
| [5.4 Network Monitoring](#54-network-monitoring) | SNMP, syslog, NetFlow |
| [5.5 Alerting Framework](#55-alerting-and-notification) | Thresholds, escalation |
| [5.6 Incident Management](#56-incident-management) | Response procedures, RCA |
| [5.7 Change Management](#57-change-management) | CAB process, templates |
| [5.8 Capacity Planning](#58-capacity-planning) | Growth forecasting |
| [5.9 Troubleshooting](#59-troubleshooting-guides) | Common issues, resolution |
| [5.10 Performance Optimization](#510-performance-optimization) | Tuning, best practices |
| [5.11 Backup & Recovery](#511-backup-and-recovery) | Configuration management |
| [5.12 Compliance & Audit](#512-compliance-and-audit) | Reporting, evidence |

---

## 5.1 Operational Framework

### 5.1.1 ITIL-Aligned Operating Model

```
+------------------------------------------------------------------+
|                    SD-ACCESS OPERATIONS MODEL                     |
+------------------------------------------------------------------+

                    +-------------------+
                    |  Service Desk     |
                    |  (Tier 0/1)       |
                    +-------------------+
                            |
              +-------------+-------------+
              |                           |
    +-------------------+       +-------------------+
    |  Network Ops      |       |  Security Ops     |
    |  (Tier 2)         |       |  (Tier 2)         |
    +-------------------+       +-------------------+
              |                           |
              +-------------+-------------+
                            |
                    +-------------------+
                    |  Engineering      |
                    |  (Tier 3)         |
                    +-------------------+
                            |
                    +-------------------+
                    |  Vendor Support   |
                    |  (Cisco TAC)      |
                    +-------------------+
```

### 5.1.2 Team Roles and Responsibilities

| Role | Responsibilities | Shift Coverage |
|------|------------------|----------------|
| NOC Analyst (Tier 1) | Alert monitoring, initial triage, ticket creation | 24×7 (3 shifts) |
| Network Engineer (Tier 2) | Troubleshooting, configuration changes, incident resolution | 16×5 + on-call |
| Security Analyst (Tier 2) | ISE policy, authentication issues, security incidents | 16×5 + on-call |
| SD-Access Engineer (Tier 3) | Complex issues, design changes, vendor escalation | Business hours + on-call |
| DNAC Administrator | Platform administration, software updates, integrations | Business hours |
| ISE Administrator | Policy management, certificate management, profiling | Business hours |

### 5.1.3 Operational KPIs

| KPI | Target | Measurement | Frequency |
|-----|--------|-------------|-----------|
| Network Availability | 99.99% | DNAC Assurance | Real-time |
| Mean Time to Detect (MTTD) | <5 minutes | Alert to ticket | Monthly |
| Mean Time to Resolve (MTTR) | <2 hours (P2) | Ticket closure | Monthly |
| Authentication Success Rate | >99.5% | ISE reports | Daily |
| Change Success Rate | >95% | Post-change validation | Monthly |
| First Call Resolution | >70% | Service desk metrics | Monthly |

### 5.1.4 Operational Runbook Structure

```yaml
Runbooks:
  Daily_Operations:
    - Health_Check_Morning.md
    - Health_Check_Evening.md
    - Authentication_Report_Review.md
    
  Weekly_Operations:
    - Capacity_Review.md
    - Security_Posture_Review.md
    - Change_Review_Preparation.md
    
  Monthly_Operations:
    - Compliance_Report_Generation.md
    - License_Usage_Review.md
    - Performance_Baseline_Update.md
    
  Incident_Response:
    - Authentication_Failure_Triage.md
    - Fabric_Node_Down.md
    - WAN_Failover_Procedure.md
    - ISE_PSN_Failover.md
    
  Maintenance:
    - Software_Upgrade_Procedure.md
    - Certificate_Renewal.md
    - Backup_Verification.md
```

---

## 5.2 DNAC Assurance Monitoring

### 5.2.1 Network Health Dashboard

```
+------------------------------------------------------------------+
|                    DNAC NETWORK HEALTH DASHBOARD                  |
+------------------------------------------------------------------+
|                                                                    |
|  OVERALL HEALTH: 97%  [████████████████████░░░]                   |
|                                                                    |
|  +------------+  +------------+  +------------+  +------------+   |
|  | WIRED      |  | WIRELESS   |  | CLIENTS    |  | APPS       |   |
|  | 98%        |  | 95%        |  | 96%        |  | 99%        |   |
|  | [████████] |  | [███████░] |  | [███████░] |  | [████████] |   |
|  +------------+  +------------+  +------------+  +------------+   |
|                                                                    |
|  DEVICE HEALTH BY SITE:                                           |
|  +--------------------+-------+--------+--------+--------+        |
|  | Site               | Total | Good   | Fair   | Poor   |        |
|  +--------------------+-------+--------+--------+--------+        |
|  | Mumbai HQ          | 52    | 50     | 2      | 0      |        |
|  | Chennai HQ         | 40    | 39     | 1      | 0      |        |
|  | London HQ          | 46    | 44     | 2      | 0      |        |
|  | Frankfurt HQ       | 32    | 32     | 0      | 0      |        |
|  | New Jersey HQ      | 56    | 54     | 1      | 1      |        |
|  | Dallas HQ          | 36    | 35     | 1      | 0      |        |
|  +--------------------+-------+--------+--------+--------+        |
|                                                                    |
+------------------------------------------------------------------+
```

### 5.2.2 Assurance Navigation

```yaml
# DNAC Assurance > Health

Dashboard_Categories:
  Network_Health:
    Path: Assurance > Health > Network Health
    Metrics:
      - Overall Score
      - Device Reachability
      - Link Utilization
      - Error Rates
      
  Client_Health:
    Path: Assurance > Health > Client Health
    Metrics:
      - Wired Client Score
      - Wireless Client Score
      - Onboarding Success Rate
      - RSSI Distribution
      
  Application_Health:
    Path: Assurance > Health > Application Health
    Metrics:
      - Application Response Time
      - Packet Loss
      - Latency
      - Throughput
      
  Issue_Resolution:
    Path: Assurance > Issues & Events
    Categories:
      - P1 (Critical)
      - P2 (Major)
      - P3 (Minor)
      - P4 (Warning)
```

### 5.2.3 Key Health Metrics

**Device Health Scoring**

| Component | Weight | Metrics |
|-----------|--------|---------|
| Reachability | 25% | ICMP, SNMP response |
| CPU Utilization | 20% | Average, peak |
| Memory Utilization | 20% | Average, peak |
| Interface Errors | 15% | CRC, input/output errors |
| Environmental | 10% | Temperature, power supply |
| Software | 10% | Version compliance, bugs |

**Client Health Scoring**

| Component | Weight | Metrics |
|-----------|--------|---------|
| Onboarding | 30% | DHCP, AAA, association time |
| Connectivity | 25% | DNS resolution, gateway reachability |
| RSSI (Wireless) | 20% | Signal strength distribution |
| SNR (Wireless) | 15% | Signal-to-noise ratio |
| Data Rate | 10% | Throughput achieved |

### 5.2.4 Custom Dashboard Configuration

```yaml
# Create Custom Dashboard
# Assurance > Dashboard > + Add Dashboard

Custom_Executive_Dashboard:
  Name: SD-Access Executive Summary
  Widgets:
    - Type: Health_Trend
      Data: Network_Health
      Period: 7_days
      
    - Type: Top_Issues
      Data: All_Issues
      Count: 10
      
    - Type: Site_Comparison
      Data: All_Sites
      Metric: Health_Score
      
    - Type: Authentication_Success
      Data: ISE_Integration
      Period: 24_hours
      
Custom_Operations_Dashboard:
  Name: NOC Operations View
  Widgets:
    - Type: Real_Time_Alerts
      Severity: P1, P2
      
    - Type: Device_Status
      Filter: Fabric_Nodes
      
    - Type: Client_Onboarding
      Metric: Success_Rate
      Period: 1_hour
      
    - Type: Fabric_Health
      Components: LISP, VXLAN, SGT
```

### 5.2.5 Assurance API Queries

```python
#!/usr/bin/env python3
"""
DNAC Assurance API - Health Monitoring Script
"""

import requests
import json
from datetime import datetime

DNAC_HOST = "https://dnac.corp.local"
USERNAME = "api-user"
PASSWORD = "<api_password>"

def get_auth_token():
    """Obtain authentication token from DNAC"""
    url = f"{DNAC_HOST}/dna/system/api/v1/auth/token"
    response = requests.post(url, auth=(USERNAME, PASSWORD), verify=False)
    return response.json()["Token"]

def get_network_health(token):
    """Retrieve overall network health"""
    url = f"{DNAC_HOST}/dna/intent/api/v1/network-health"
    headers = {"X-Auth-Token": token, "Content-Type": "application/json"}
    
    response = requests.get(url, headers=headers, verify=False)
    return response.json()

def get_client_health(token):
    """Retrieve client health summary"""
    url = f"{DNAC_HOST}/dna/intent/api/v1/client-health"
    headers = {"X-Auth-Token": token, "Content-Type": "application/json"}
    
    timestamp = int(datetime.now().timestamp() * 1000)
    params = {"timestamp": timestamp}
    
    response = requests.get(url, headers=headers, params=params, verify=False)
    return response.json()

def get_issues(token, priority="P1"):
    """Retrieve active issues by priority"""
    url = f"{DNAC_HOST}/dna/intent/api/v1/issues"
    headers = {"X-Auth-Token": token, "Content-Type": "application/json"}
    
    params = {
        "priority": priority,
        "issueStatus": "active"
    }
    
    response = requests.get(url, headers=headers, params=params, verify=False)
    return response.json()

def main():
    token = get_auth_token()
    
    # Get network health
    network_health = get_network_health(token)
    print(f"Network Health Score: {network_health['response'][0]['healthScore']}%")
    
    # Get client health
    client_health = get_client_health(token)
    print(f"Client Health Score: {client_health['response'][0]['scoreDetail'][0]['scoreValue']}%")
    
    # Get P1 issues
    issues = get_issues(token, "P1")
    print(f"Active P1 Issues: {len(issues.get('response', []))}")

if __name__ == "__main__":
    main()
```

---

## 5.3 ISE Monitoring and Reporting

### 5.3.1 ISE Dashboard Overview

```
+------------------------------------------------------------------+
|                    ISE OPERATIONS DASHBOARD                       |
+------------------------------------------------------------------+
|                                                                    |
|  AUTHENTICATION SUMMARY (Last 24 Hours)                           |
|  +----------------+  +----------------+  +----------------+        |
|  | PASSED         |  | FAILED         |  | SUCCESS RATE   |        |
|  | 47,523         |  | 234            |  | 99.51%         |        |
|  +----------------+  +----------------+  +----------------+        |
|                                                                    |
|  AUTHENTICATION BY METHOD:                                         |
|  +------------------+----------+----------+----------+             |
|  | Method           | Passed   | Failed   | Rate     |             |
|  +------------------+----------+----------+----------+             |
|  | 802.1X (EAP-TLS) | 28,450   | 45       | 99.84%   |             |
|  | 802.1X (PEAP)    | 8,230    | 67       | 99.19%   |             |
|  | MAB              | 10,843   | 122      | 98.89%   |             |
|  +------------------+----------+----------+----------+             |
|                                                                    |
|  PSN NODE STATUS:                                                  |
|  +------------------+----------+----------+----------+             |
|  | Node             | Status   | Auth/sec | CPU      |             |
|  +------------------+----------+----------+----------+             |
|  | PSN-MUM-1        | Active   | 12.4     | 35%      |             |
|  | PSN-MUM-2        | Active   | 11.8     | 32%      |             |
|  | PSN-CHN-1        | Active   | 9.6      | 28%      |             |
|  | PSN-CHN-2        | Active   | 9.2      | 26%      |             |
|  | PSN-LON-1        | Active   | 11.2     | 33%      |             |
|  | PSN-LON-2        | Active   | 10.8     | 31%      |             |
|  +------------------+----------+----------+----------+             |
|                                                                    |
+------------------------------------------------------------------+
```

### 5.3.2 ISE Live Logs Analysis

```yaml
# Operations > RADIUS > Live Logs

Key_Filters:
  Failed_Authentications:
    Status: "Failed"
    Time_Range: "Last 1 Hour"
    Export: CSV for analysis
    
  Specific_User:
    Username: "user@corp.local"
    Time_Range: "Last 24 Hours"
    
  Specific_Endpoint:
    MAC_Address: "AA:BB:CC:DD:EE:FF"
    Time_Range: "Last 24 Hours"
    
  By_Policy:
    Authentication_Policy: "WIRED-ACCESS"
    Authorization_Policy: "Employee-Full"
    
Common_Failure_Reasons:
  5400: Authentication failed
  5411: Supplicant stopped responding
  5417: Dynamic authorization failed
  5440: Endpoint not found
  12302: Unknown NAS
  12514: EAP-TLS failed
  22028: Authentication timed out
  24408: User not found in identity store
  24459: Wrong password
```

### 5.3.3 ISE Reports

**Scheduled Reports Configuration**

```yaml
# Operations > Reports > Report Scheduler

Scheduled_Reports:
  Daily_Authentication_Summary:
    Report: Authentication Summary
    Schedule: Daily at 06:00 UTC
    Recipients: noc@corp.local
    Format: PDF, CSV
    
  Weekly_Profiler_Report:
    Report: Profiled Endpoints Summary
    Schedule: Weekly (Monday 08:00 UTC)
    Recipients: security-team@corp.local
    Format: PDF
    
  Monthly_Compliance_Report:
    Report: Posture Compliance
    Schedule: Monthly (1st, 08:00 UTC)
    Recipients: compliance@corp.local
    Format: PDF
    
  Weekly_Failed_Auth_Report:
    Report: RADIUS Authentication Troubleshooting
    Filter: Status = Failed
    Schedule: Weekly (Friday 17:00 UTC)
    Recipients: network-team@corp.local
    Format: CSV
```

**Key ISE Reports**

| Report Category | Report Name | Use Case |
|-----------------|-------------|----------|
| Authentication | RADIUS Authentication Summary | Overall auth health |
| Authentication | Top N Authentications by Failure | Troubleshooting |
| Authentication | RADIUS Accounting | Session tracking |
| Endpoints | Profiled Endpoints Summary | Device inventory |
| Endpoints | Endpoint MAC Authentication | MAB analysis |
| Posture | Posture Assessment by Condition | Compliance status |
| Guest | Guest Activity Report | Guest access audit |
| Device Admin | TACACS Authentication | Admin access audit |

### 5.3.4 ISE MnT (Monitoring and Troubleshooting)

```yaml
# Operations > Troubleshoot > Diagnostic Tools

Diagnostic_Tools:
  RADIUS_Authentication:
    Path: Operations > RADIUS > Live Logs
    Use: Real-time authentication monitoring
    
  Endpoint_Debug:
    Path: Operations > Troubleshoot > Endpoint Debug
    Use: Detailed endpoint troubleshooting
    Enable: Per endpoint MAC address
    Duration: 15 minutes default
    
  Evaluate_Configuration:
    Path: Operations > Troubleshoot > Evaluate Configuration
    Use: Test policy without actual authentication
    Input: Username, MAC, NAS details
    
  TCP_Dump:
    Path: Operations > Troubleshoot > TCP Dump
    Use: Packet capture for analysis
    Interface: Select PSN node
    Filter: RADIUS port 1812/1813
    
  Session_Trace:
    Path: Operations > Troubleshoot > Session Trace
    Use: End-to-end session analysis
    Enable: Per session or endpoint
```

### 5.3.5 ISE Monitoring CLI Commands

```bash
# SSH to ISE node
ssh admin@ise-pan-nj.corp.local

# Check application status
show application status ise

# Check RADIUS statistics
show logging application radius-live.log tail count 100

# Check PSN queue status
show ise internal psn-queue-status

# Check MnT database status
show ise internal mnts db-status

# Check replication status
show ise internal cluster replication

# Check certificate status
show ise internal certificates

# Check licensing
show license all

# Performance metrics
show cpu usage
show memory
show repository list
```

---

## 5.4 Network Monitoring

### 5.4.1 SNMP Monitoring Configuration

**Device SNMP Configuration**

```cisco
! SNMPv3 Configuration on Fabric Nodes

snmp-server group DNAC-GROUP v3 priv
snmp-server user dnac-snmp DNAC-GROUP v3 auth sha <auth_password> priv aes 128 <priv_password>
snmp-server host 10.252.10.10 version 3 priv dnac-snmp

! SNMP Traps
snmp-server enable traps snmp authentication linkdown linkup coldstart warmstart
snmp-server enable traps entity
snmp-server enable traps cpu threshold
snmp-server enable traps memory bufferpeak
snmp-server enable traps config
snmp-server enable traps bridge newroot topologychange
snmp-server enable traps stpx inconsistency root-inconsistency loop-inconsistency
snmp-server enable traps flash insertion removal
snmp-server enable traps envmon fan shutdown supply temperature status
snmp-server enable traps auth-framework sec-violation
snmp-server enable traps dot1x auth-fail-vlan no-resp
```

### 5.4.2 Syslog Configuration

**Device Syslog Configuration**

```cisco
! Syslog Configuration

logging buffered 65536 informational
logging host 10.252.1.30 transport udp port 514
logging host 10.252.1.31 transport udp port 514
logging source-interface Loopback0
logging trap informational

! Structured syslog for ISE profiling
logging discriminator ISE-PROFILING severity includes 6
logging host 10.252.30.10 discriminator ISE-PROFILING transport udp port 1514

! Timestamp configuration
service timestamps log datetime msec localtime show-timezone
service timestamps debug datetime msec localtime show-timezone
```

**Syslog Severity Levels**

| Level | Name | Description | Action |
|-------|------|-------------|--------|
| 0 | Emergency | System unusable | Page on-call |
| 1 | Alert | Immediate action needed | Page on-call |
| 2 | Critical | Critical conditions | Alert NOC |
| 3 | Error | Error conditions | Alert NOC |
| 4 | Warning | Warning conditions | Log, review |
| 5 | Notice | Normal but significant | Log |
| 6 | Informational | Informational messages | Log |
| 7 | Debug | Debug messages | Troubleshooting only |

### 5.4.3 NetFlow Configuration

```cisco
! NetFlow/Flexible NetFlow Configuration

flow exporter DNAC-EXPORTER
 destination 10.252.10.10
 source Loopback0
 transport udp 9996
 template data timeout 60
 option interface-table
 option sampler-table

flow record FABRIC-RECORD
 match ipv4 source address
 match ipv4 destination address
 match transport source-port
 match transport destination-port
 match ipv4 protocol
 match ipv4 tos
 collect counter bytes long
 collect counter packets long
 collect timestamp sys-uptime first
 collect timestamp sys-uptime last

flow monitor FABRIC-MONITOR
 record FABRIC-RECORD
 exporter DNAC-EXPORTER
 cache timeout active 60
 cache timeout inactive 15

! Apply to interfaces
interface range GigabitEthernet1/0/1-48
 ip flow monitor FABRIC-MONITOR input
 ip flow monitor FABRIC-MONITOR output
```

### 5.4.4 Fabric-Specific Monitoring

```cisco
! LISP Monitoring Commands
show lisp site
show lisp instance-id 8001 ipv4 database
show lisp instance-id 8001 ipv4 map-cache
show lisp session

! VXLAN Monitoring
show vxlan tunnel
show vxlan vni
show vxlan interface

! CTS/SGT Monitoring
show cts environment-data
show cts role-based permissions
show cts role-based sgt-map all
show cts role-based counters

! 802.1X Monitoring
show authentication sessions
show authentication interface <interface> details
show dot1x all summary

! Fabric Wireless Monitoring (on WLC)
show wireless fabric summary
show wireless profile fabric detailed <profile>
show wireless client summary
```

---

## 5.5 Alerting and Notification

### 5.5.1 Alert Severity Matrix

| Severity | Response Time | Examples | Notification |
|----------|---------------|----------|--------------|
| P1 - Critical | 15 minutes | Fabric site down, ISE PAN failure, DNAC cluster issue | SMS + Phone + Email |
| P2 - Major | 1 hour | Single node failure, auth success <95%, high CPU | Email + SMS |
| P3 - Minor | 4 hours | Non-critical device down, capacity warning | Email |
| P4 - Warning | 8 hours | Performance degradation, license warning | Email (batch) |

### 5.5.2 DNAC Alert Configuration

```yaml
# Platform > Developer Toolkit > Event Notifications

Event_Subscriptions:
  Critical_Device_Events:
    Events:
      - DEVICE_UNREACHABLE
      - INTERFACE_DOWN (uplinks)
      - HIGH_CPU_UTILIZATION (>90%)
      - HIGH_MEMORY_UTILIZATION (>90%)
    Notification:
      Type: Email, Webhook
      Recipients: noc-critical@corp.local
      Webhook: https://incident-mgmt.corp.local/api/v1/alerts

  Fabric_Events:
    Events:
      - FABRIC_SITE_DOWN
      - LISP_SESSION_DOWN
      - VXLAN_TUNNEL_DOWN
      - CONTROL_PLANE_UNREACHABLE
    Notification:
      Type: Email, Webhook
      Recipients: network-team@corp.local
      
  Authentication_Events:
    Events:
      - AUTH_SUCCESS_RATE_LOW (<95%)
      - ISE_PSN_UNREACHABLE
      - RADIUS_TIMEOUT
    Notification:
      Type: Email
      Recipients: security-team@corp.local
      
  Compliance_Events:
    Events:
      - DEVICE_CONFIG_DRIFT
      - SOFTWARE_VERSION_MISMATCH
      - SECURITY_ADVISORY_MATCH
    Notification:
      Type: Email
      Recipients: compliance@corp.local
```

### 5.5.3 Webhook Integration

```python
#!/usr/bin/env python3
"""
DNAC Webhook Receiver for Alert Processing
"""

from flask import Flask, request, jsonify
import json
import smtplib
from email.mime.text import MIMEText

app = Flask(__name__)

# Alert thresholds
CRITICAL_EVENTS = ['DEVICE_UNREACHABLE', 'FABRIC_SITE_DOWN', 'ISE_PSN_UNREACHABLE']
MAJOR_EVENTS = ['INTERFACE_DOWN', 'HIGH_CPU_UTILIZATION', 'LISP_SESSION_DOWN']

@app.route('/api/v1/alerts', methods=['POST'])
def receive_alert():
    """Process incoming DNAC alerts"""
    try:
        alert_data = request.json
        
        event_type = alert_data.get('eventId')
        severity = alert_data.get('severity')
        device = alert_data.get('details', {}).get('deviceName', 'Unknown')
        description = alert_data.get('description', 'No description')
        
        # Determine priority
        if event_type in CRITICAL_EVENTS:
            priority = 'P1'
            send_sms_alert(device, description)
        elif event_type in MAJOR_EVENTS:
            priority = 'P2'
        else:
            priority = 'P3'
        
        # Create incident ticket
        ticket_id = create_incident_ticket(
            priority=priority,
            device=device,
            event=event_type,
            description=description
        )
        
        # Send email notification
        send_email_alert(priority, device, event_type, description, ticket_id)
        
        return jsonify({'status': 'processed', 'ticket_id': ticket_id})
        
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

def create_incident_ticket(priority, device, event, description):
    """Create incident ticket in ITSM system"""
    # Integration with ServiceNow, Remedy, etc.
    # Return ticket ID
    return f"INC{hash(device+event) % 1000000:06d}"

def send_email_alert(priority, device, event, description, ticket_id):
    """Send email notification"""
    msg = MIMEText(f"""
    Priority: {priority}
    Device: {device}
    Event: {event}
    Description: {description}
    Ticket: {ticket_id}
    """)
    msg['Subject'] = f"[{priority}] Network Alert: {event} on {device}"
    msg['From'] = 'noc-alerts@corp.local'
    msg['To'] = 'noc@corp.local'
    
    # Send email
    with smtplib.SMTP('smtp.corp.local') as server:
        server.send_message(msg)

def send_sms_alert(device, description):
    """Send SMS for critical alerts"""
    # Integration with SMS gateway
    pass

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
```

### 5.5.4 Escalation Matrix

```
+------------------------------------------------------------------+
|                    ESCALATION MATRIX                              |
+------------------------------------------------------------------+

Time Since    P1 (Critical)        P2 (Major)          P3 (Minor)
Detection
-----------   ----------------     ----------------    ----------------
0-15 min      NOC Analyst          NOC Analyst         NOC Analyst
              (Acknowledge)        (Acknowledge)       (Acknowledge)

15-30 min     Network Engineer     -                   -
              (Tier 2 engaged)

30-60 min     SD-Access Engineer   Network Engineer    -
              (Tier 3 engaged)     (Tier 2 engaged)

1-2 hours     Network Manager      -                   Network Engineer
              (Management aware)

2-4 hours     IT Director          SD-Access Engineer  -
              Cisco TAC opened     (Tier 3 engaged)

4+ hours      CTO/VP               Network Manager     SD-Access Engineer
              Executive bridge
```

---

## 5.6 Incident Management

### 5.6.1 Incident Classification

| Category | Sub-Category | Priority | SLA Response | SLA Resolve |
|----------|--------------|----------|--------------|-------------|
| Fabric | Site down | P1 | 15 min | 2 hours |
| Fabric | Node failure | P2 | 30 min | 4 hours |
| Authentication | Mass auth failure | P1 | 15 min | 2 hours |
| Authentication | User auth issue | P3 | 2 hours | 8 hours |
| Connectivity | Cross-site | P2 | 30 min | 4 hours |
| Connectivity | Local segment | P3 | 2 hours | 8 hours |
| Performance | Degradation >50% | P2 | 30 min | 4 hours |
| Performance | Minor degradation | P4 | 4 hours | 24 hours |
| Security | SGT bypass | P1 | 15 min | 2 hours |
| Security | Policy violation | P3 | 2 hours | 8 hours |

### 5.6.2 Incident Response Workflow

```
+------------------------------------------------------------------+
|                    INCIDENT RESPONSE WORKFLOW                     |
+------------------------------------------------------------------+

    [Alert Triggered]
           |
           v
    +-------------+
    | Detection   |---> Is this a real issue?
    | & Triage    |     NO: Close as false positive
    +-------------+
           | YES
           v
    +-------------+
    | Classify    |---> Assign Priority (P1-P4)
    | & Assign    |     Assign to appropriate team
    +-------------+
           |
           v
    +-------------+
    | Investigate |---> Gather diagnostic data
    |             |     Identify root cause
    +-------------+
           |
           v
    +-------------+
    | Resolve     |---> Implement fix
    |             |     Verify resolution
    +-------------+
           |
           v
    +-------------+
    | Close &     |---> Update knowledge base
    | Document    |     Create RCA (if P1/P2)
    +-------------+
```

### 5.6.3 Incident Response Procedures

**P1 Incident - Fabric Site Down**

```
INCIDENT: FABRIC SITE DOWN
Priority: P1
SLA: 2 hours to resolve

STEP 1: Initial Assessment (0-5 minutes)
- Identify affected site from DNAC Assurance
- Determine scope: Full site or partial
- Check recent changes in change log
- Notify stakeholders via incident bridge

STEP 2: Diagnostics (5-15 minutes)
- Check Border Node status
  show lisp site
  show vxlan tunnel
  show isis neighbors
  
- Check Control Plane status
  show lisp session
  
- Check underlay connectivity
  ping <loopback_addresses> source Loopback0
  
- Check ISE PSN connectivity
  show radius server-group RADIUS-GROUP
  
STEP 3: Isolation (15-30 minutes)
- Identify failed component(s)
- Check hardware status (fans, power, temperature)
- Check interface status
- Review syslog for errors

STEP 4: Resolution (30-120 minutes)
Option A: Hardware failure
  - Failover to redundant node (if available)
  - Initiate RMA process
  
Option B: Software issue
  - Reload affected device
  - Roll back recent configuration change
  
Option C: Connectivity issue
  - Fix underlay routing issue
  - Repair physical link
  
STEP 5: Verification
- Confirm LISP registrations restored
- Verify VXLAN tunnels established
- Test user authentication
- Confirm application connectivity

STEP 6: Post-Incident
- Complete incident ticket
- Schedule RCA within 24 hours
- Update runbook if new scenario
```

**P2 Incident - Authentication Failure**

```
INCIDENT: MASS AUTHENTICATION FAILURE
Priority: P2
SLA: 4 hours to resolve

STEP 1: Scope Assessment
- Check ISE live logs for failure patterns
- Identify affected:
  - Site(s)
  - Authentication method (dot1x, MAB)
  - User type (employees, guests, devices)

STEP 2: ISE Diagnostics
# On ISE GUI:
Operations > RADIUS > Live Logs
Filter: Status = Failed
Group by: Failure Reason

# Common failure reasons:
- 5400: Authentication failed (check AD)
- 22028: Authentication timeout (check PSN)
- 24408: User not found (check identity source)
- 12302: Unknown NAS (check RADIUS clients)

STEP 3: Resolution based on cause
Cause: ISE PSN overloaded
  - Check PSN CPU/memory
  - Redistribute load across node group
  - Add temporary PSN capacity

Cause: AD connectivity
  - Test AD connectivity from ISE
  - Check AD domain controller health
  - Verify service account credentials

Cause: Certificate issue
  - Check certificate validity
  - Verify certificate trust chain
  - Renew if expired

Cause: Policy misconfiguration
  - Review recent policy changes
  - Roll back to previous working policy
  - Test with policy evaluation tool

STEP 4: Verification
- Monitor live logs for successful auths
- Confirm auth success rate >99%
- Test sample users from affected scope
```

### 5.6.4 Root Cause Analysis Template

```markdown
# ROOT CAUSE ANALYSIS (RCA)

## Incident Details
- Incident ID: INC-XXXXXX
- Priority: P1/P2
- Duration: X hours Y minutes
- Affected Sites: [List]
- Affected Users: [Count]

## Timeline
| Time (UTC) | Event |
|------------|-------|
| HH:MM | Alert triggered |
| HH:MM | Incident acknowledged |
| HH:MM | Tier 2 engaged |
| HH:MM | Root cause identified |
| HH:MM | Fix implemented |
| HH:MM | Service restored |
| HH:MM | Incident closed |

## Root Cause
[Detailed technical description of root cause]

## Impact
- Business Impact: [Description]
- User Impact: [Number of users, duration]
- Revenue Impact: [If applicable]

## Resolution
[Steps taken to resolve the incident]

## Preventive Actions
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| [Action 1] | [Owner] | [Date] | [ ] |
| [Action 2] | [Owner] | [Date] | [ ] |

## Lessons Learned
- [Lesson 1]
- [Lesson 2]

## Approvals
- Network Lead: _____________ Date: _______
- Operations Manager: _____________ Date: _______
```

---

## 5.7 Change Management

### 5.7.1 Change Types

| Type | Description | Approval | Lead Time | Window |
|------|-------------|----------|-----------|--------|
| Standard | Pre-approved, low risk | Auto-approved | 24 hours | Anytime |
| Normal | Planned, documented | CAB | 5 business days | Maintenance |
| Emergency | Critical fix required | Emergency CAB | 2 hours | Immediate |
| Major | High impact, multiple sites | CAB + Steering | 10 business days | Weekend |

### 5.7.2 Change Request Template

```yaml
# CHANGE REQUEST FORM

CR_Number: CHG-XXXXXX
Requestor: [Name]
Date_Submitted: YYYY-MM-DD

# Change Details
Title: [Short description]
Description: |
  [Detailed description of the change]
  
Change_Type: [Standard | Normal | Emergency | Major]
Category: [Network | Security | Application | Infrastructure]
Priority: [Low | Medium | High | Critical]

# Scope
Affected_Systems:
  - [Device/System 1]
  - [Device/System 2]
  
Affected_Sites:
  - [Site 1]
  - [Site 2]
  
Affected_Users: [Number]

# Schedule
Requested_Date: YYYY-MM-DD
Requested_Time: HH:MM UTC
Estimated_Duration: [X hours]
Maintenance_Window: [Yes/No]

# Risk Assessment
Risk_Level: [Low | Medium | High]
Risk_Description: |
  [Potential risks and mitigations]
  
# Implementation Plan
Pre_Change_Steps:
  1. [Step 1]
  2. [Step 2]
  
Change_Steps:
  1. [Step 1]
  2. [Step 2]
  
Post_Change_Steps:
  1. [Validation 1]
  2. [Validation 2]
  
# Rollback Plan
Rollback_Trigger: [Conditions for rollback]
Rollback_Steps:
  1. [Step 1]
  2. [Step 2]
Rollback_Duration: [X minutes]

# Approvals
Technical_Approval: [Name] Date: _______
Business_Approval: [Name] Date: _______
CAB_Approval: [Date of CAB meeting]
```

### 5.7.3 DNAC Configuration Archive

```yaml
# Design > Network Settings > Configuration Archive

Archive_Settings:
  Schedule: Daily at 02:00 UTC
  Retention: 90 days
  Storage: Local + External SFTP
  
  External_Repository:
    Type: SFTP
    Server: config-backup.corp.local
    Path: /backups/dnac-configs/
    Username: backup-user
    Authentication: SSH Key
    
Compare_Configurations:
  # Tools > Configuration Archive > Compare
  Baseline: [Select reference config]
  Current: [Select current config]
  View: Side-by-side diff
  
Configuration_Compliance:
  # Provision > Templates > Compliance
  Enable: Yes
  Check_Interval: 24 hours
  Alert_on_Drift: Yes
  Auto_Remediate: No (manual approval)
```

### 5.7.4 Change Calendar

```
+------------------------------------------------------------------+
|                    MONTHLY CHANGE CALENDAR                        |
+------------------------------------------------------------------+
| Week 1                                                            |
|   Mon: No changes (Month-end close)                               |
|   Tue-Thu: Normal changes                                         |
|   Fri: Standard changes only                                      |
|   Sat-Sun: Major changes (if approved)                            |
|                                                                    |
| Week 2                                                            |
|   Mon-Thu: Normal changes                                         |
|   Fri: Standard changes only                                      |
|   Sat-Sun: Major changes (if approved)                            |
|                                                                    |
| Week 3                                                            |
|   Mon-Thu: Normal changes                                         |
|   Fri: Standard changes only                                      |
|   Sat-Sun: Major changes (if approved)                            |
|                                                                    |
| Week 4                                                            |
|   Mon-Wed: Normal changes                                         |
|   Thu: Change freeze begins                                       |
|   Fri-Sun: Emergency changes only                                 |
|                                                                    |
| Blackout Dates: [List company-specific blackout periods]          |
+------------------------------------------------------------------+
```

---

## 5.8 Capacity Planning

### 5.8.1 Capacity Metrics

| Resource | Current | Threshold | Capacity | Growth Rate |
|----------|---------|-----------|----------|-------------|
| Managed Devices | 854 | 6,400 | 8,000 (DNAC) | +5%/year |
| Endpoints | 19,000 | 160,000 | 200,000 (ISE) | +10%/year |
| Auth/sec (peak) | 47.5 | 380 | 475 (ISE cluster) | +10%/year |
| Fabric Sites | 36 | 80 | 100 (DNAC) | +2/year |
| Virtual Networks | 5 | 64 | 64 (per fabric) | +1/year |
| SGTs | 12 | 65,000 | 65,535 | Stable |

### 5.8.2 Capacity Planning Formula

```
CAPACITY GROWTH PROJECTION

Year 0 (Current):
  Devices: 854
  Endpoints: 19,000
  Auth_Rate: 47.5/sec

Year 1 Projection:
  Devices: 854 × 1.05 = 897
  Endpoints: 19,000 × 1.10 = 20,900
  Auth_Rate: 47.5 × 1.10 = 52.3/sec

Year 3 Projection:
  Devices: 854 × (1.05)³ = 989
  Endpoints: 19,000 × (1.10)³ = 25,289
  Auth_Rate: 47.5 × (1.10)³ = 63.2/sec

Year 5 Projection:
  Devices: 854 × (1.05)⁵ = 1,090
  Endpoints: 19,000 × (1.10)⁵ = 30,602
  Auth_Rate: 47.5 × (1.10)⁵ = 76.5/sec

CAPACITY UTILIZATION (Year 5):
  DNAC: 1,090 / 8,000 = 13.6% (Healthy)
  ISE Endpoints: 30,602 / 200,000 = 15.3% (Healthy)
  ISE Auth Rate: 76.5 / 475 = 16.1% (Healthy)
```

### 5.8.3 Capacity Monitoring Dashboard

```python
#!/usr/bin/env python3
"""
Capacity Monitoring Script
"""

import requests
import json

def check_dnac_capacity(dnac_host, token):
    """Check DNAC device capacity"""
    headers = {"X-Auth-Token": token}
    
    # Get device count
    url = f"{dnac_host}/dna/intent/api/v1/network-device/count"
    response = requests.get(url, headers=headers, verify=False)
    device_count = response.json()['response']
    
    max_devices = 8000  # DN2-HW-APL-XL cluster
    utilization = (device_count / max_devices) * 100
    
    return {
        'current': device_count,
        'max': max_devices,
        'utilization': round(utilization, 2),
        'status': 'OK' if utilization < 80 else 'WARNING' if utilization < 90 else 'CRITICAL'
    }

def check_ise_capacity(ise_host, username, password):
    """Check ISE endpoint capacity via ERS API"""
    auth = (username, password)
    headers = {'Accept': 'application/json'}
    
    # Get endpoint count
    url = f"{ise_host}/ers/config/endpoint?size=1"
    response = requests.get(url, auth=auth, headers=headers, verify=False)
    total = response.json()['SearchResult']['total']
    
    max_endpoints = 200000  # ISE 3.x cluster
    utilization = (total / max_endpoints) * 100
    
    return {
        'current': total,
        'max': max_endpoints,
        'utilization': round(utilization, 2),
        'status': 'OK' if utilization < 80 else 'WARNING' if utilization < 90 else 'CRITICAL'
    }

def generate_capacity_report():
    """Generate weekly capacity report"""
    # Implementation for capacity trending
    pass
```

---

## 5.9 Troubleshooting Guides

### 5.9.1 Authentication Troubleshooting

```
+------------------------------------------------------------------+
|          AUTHENTICATION TROUBLESHOOTING FLOWCHART                 |
+------------------------------------------------------------------+

User Cannot Authenticate
          |
          v
    +----------------+
    | Check ISE      |---> Authentication in live logs?
    | Live Logs      |
    +----------------+
          |
    +-----+-----+
    |           |
   YES          NO
    |           |
    v           v
+--------+  +------------------+
| Check  |  | Check switch     |
| Failure|  | connectivity     |
| Reason |  +------------------+
+--------+       |
    |            v
    v       +----------------+
[See       | Check RADIUS   |
 Table     | config on NAS  |
 Below]    | show radius    |
           | show aaa       |
           +----------------+
```

**Common ISE Failure Reasons and Resolutions**

| Error Code | Failure Reason | Resolution |
|------------|----------------|------------|
| 5400 | Authentication failed | Check user credentials in AD |
| 5411 | Supplicant stopped responding | Check client supplicant config |
| 5417 | Dynamic authorization failed | Check CoA configuration |
| 5440 | Endpoint not found in portal | Check guest portal config |
| 12302 | Unknown NAS | Add device to network devices |
| 12514 | EAP-TLS failed | Check client certificate |
| 22028 | Authentication timed out | Check PSN reachability |
| 24408 | User not found | Check identity source sequence |
| 24459 | Wrong password | User password issue |

**Switch-Side Authentication Debugging**

```cisco
! Enable authentication debugging
debug authentication all
debug dot1x all
debug radius authentication
debug radius verbose

! Check authentication session
show authentication sessions interface Gi1/0/10 details

! Expected output analysis:
! - Session ID: Unique identifier
! - Method: Should show dot1x or mab
! - Status: Should be "Authorized"
! - SGT: Should show assigned SGT value
! - VLAN: Should match expected VLAN

! Check RADIUS connectivity
test aaa group RADIUS-GROUP admin <password> new-code

! Clear and restart authentication
authentication restart interface Gi1/0/10
```

### 5.9.2 Fabric Troubleshooting

**LISP Troubleshooting**

```cisco
! Check LISP site registrations (on Control Plane)
show lisp site
! All edge nodes should be registered

! Check LISP database (on Edge Node)
show lisp instance-id 8001 ipv4 database
! Should show locally attached EIDs

! Check LISP map-cache (on Edge Node)
show lisp instance-id 8001 ipv4 map-cache
! Should show remote EID-to-RLOC mappings

! Verify LISP session
show lisp session
! Session to CP nodes should be established

! Debug LISP (use with caution)
debug lisp control-plane all
```

**VXLAN Troubleshooting**

```cisco
! Check VXLAN tunnels
show vxlan tunnel
! All tunnels should show "UP"

! Check VXLAN VNI mapping
show vxlan vni
! VNIs should match configured VNs

! Check VXLAN interface
show vxlan interface
! NVE interface should be up

! Verify VXLAN encapsulation
show interface nve1

! Trace packet path through fabric
traceroute vrf VN_CORPORATE <destination_ip>
```

**Underlay Troubleshooting**

```cisco
! Check IS-IS adjacencies
show isis neighbors
! All expected neighbors should be UP

! Check IS-IS database
show isis database detail
! All nodes should have LSP entries

! Check BFD status
show bfd neighbors
! BFD sessions should be UP

! Verify underlay reachability
ping <remote_loopback> source Loopback0

! Check MTU (must support jumbo frames)
ping <remote_loopback> source Loopback0 size 9000 df-bit
```

### 5.9.3 Wireless Troubleshooting

```cisco
! On WLC - Check client status
show wireless client summary
show wireless client mac-address <mac> detail

! Check AP fabric status
show ap summary
show ap name <ap-name> config general

! Check fabric connectivity
show wireless fabric summary
show wireless profile fabric detailed <profile>

! Debug wireless client
debug client mac-address <mac>

! Check RADIUS authentication
show radius server-group all
test aaa radius <server-ip> <username> <password>

! Check wireless SGT assignment
show wireless client mac-address <mac> detail | include SGT
```

### 5.9.4 Quick Reference Troubleshooting Commands

```
+------------------------------------------------------------------+
|                    QUICK TROUBLESHOOTING REFERENCE                |
+------------------------------------------------------------------+

COMPONENT          | VERIFY COMMAND                    | EXPECTED
-------------------|-----------------------------------|------------------
IS-IS              | show isis neighbors               | All UP
LISP               | show lisp site                    | All registered
VXLAN              | show vxlan tunnel                 | All UP
SGT                | show cts role-based sgt-map all   | IP-SGT bindings
802.1X             | show authentication sessions      | Sessions present
RADIUS             | test aaa group <name> <u> <p>     | Success
BFD                | show bfd neighbors                | All UP
MTU                | ping x.x.x.x size 9000 df-bit    | Success
WLC Fabric         | show wireless fabric summary      | Enabled
Client Auth        | show auth session int <if> det    | Authorized
```

---

## 5.10 Performance Optimization

### 5.10.1 DNAC Performance Tuning

```yaml
# System > Settings > System Configuration

Performance_Settings:
  Discovery_Threads: 10 (default)
  Inventory_Sync_Interval: 25 minutes
  Assurance_Collection_Interval: 5 minutes
  Configuration_Archive_Schedule: Daily
  
Database_Optimization:
  # Automatic maintenance runs nightly
  # Manual optimization if needed:
  # System > System 360 > Database Health
  
Log_Retention:
  Audit_Logs: 365 days
  System_Logs: 90 days
  Assurance_Data: 14 days (detailed), 90 days (summary)
```

### 5.10.2 ISE Performance Tuning

```yaml
# Administration > System > Settings

Performance_Settings:
  RADIUS_Request_Timeout: 5 seconds
  RADIUS_Connection_Attempts: 2
  Session_Timeout: 28800 seconds (8 hours)
  Idle_Timeout: 1800 seconds (30 minutes)
  
Profiler_Optimization:
  # Reduce unnecessary probes
  NMAP_Probe: Disabled (unless required)
  SNMP_Probe: Enabled (selective)
  NetFlow_Probe: Enabled (from key switches only)
  
Database_Maintenance:
  MnT_Purge_Interval: 7 days (detailed logs)
  Endpoint_Purge: 90 days (inactive)
  
PSN_Load_Balancing:
  Method: Round-robin
  Health_Check_Interval: 30 seconds
```

### 5.10.3 Switch Performance Tuning

```cisco
! Optimize authentication timers
interface range GigabitEthernet1/0/1-48
 authentication timer reauthenticate 28800
 authentication timer inactivity 1800
 dot1x timeout tx-period 10
 dot1x max-reauth-req 2

! Optimize RADIUS timeouts
radius-server timeout 5
radius-server retransmit 2
radius-server deadtime 15

! Optimize spanning-tree for faster convergence
spanning-tree mode rapid-pvst
spanning-tree portfast default
spanning-tree portfast bpduguard default

! Optimize for fabric
ip tcp path-mtu-discovery
```

---

## 5.11 Backup and Recovery

### 5.11.1 Backup Schedule

| System | Backup Type | Frequency | Retention | Location |
|--------|-------------|-----------|-----------|----------|
| DNAC | Full system | Weekly (Sunday 02:00) | 4 weeks | NFS + offsite |
| DNAC | Configuration | Daily (02:00) | 90 days | NFS |
| ISE | Full system | Weekly (Sunday 03:00) | 4 weeks | SFTP + offsite |
| ISE | Configuration | Daily (03:00) | 90 days | SFTP |
| Network Devices | Running config | Daily (02:00) | 90 days | TFTP/SCP |

### 5.11.2 DNAC Backup Procedure

```yaml
# System > Settings > Backup & Restore

Backup_Configuration:
  Destination: NFS
  NFS_Server: backup.corp.local
  NFS_Path: /backups/dnac/
  
  Schedule:
    Full_Backup: Weekly (Sunday 02:00 UTC)
    Config_Backup: Daily (02:00 UTC)
    
Manual_Backup:
  # System > Settings > Backup & Restore > Backup Now
  Type: Full Backup
  Encryption: AES-256
  Password: <backup_encryption_password>
  
Backup_Verification:
  # Monthly test restore to lab environment
  Test_Frequency: Monthly
  Validation: Confirm all data restored
```

### 5.11.3 ISE Backup Procedure

```bash
# CLI Backup
ssh admin@ise-pan-nj.corp.local

# Configure repository
repository BACKUP-REPO
 url sftp://backup.corp.local/ise-backups/
 user backup-user password plain <password>

# Perform backup
backup DAILY-BACKUP repository BACKUP-REPO ise-config encryption-key plain <key>

# Schedule backup
# Administration > System > Backup & Restore > Schedule

# Verify backup
show backup history

# Restore procedure (if needed)
restore DAILY-BACKUP repository BACKUP-REPO encryption-key plain <key>
```

### 5.11.4 Network Device Backup

```python
#!/usr/bin/env python3
"""
Network Device Configuration Backup Script
"""

import paramiko
import datetime
import os

DEVICES = [
    {'name': 'MUM-BN-01', 'ip': '10.252.12.1', 'type': 'cisco_ios'},
    {'name': 'MUM-BN-02', 'ip': '10.252.12.2', 'type': 'cisco_ios'},
    # Add all devices
]

USERNAME = 'netadmin'
PASSWORD = '<password>'
BACKUP_DIR = '/backups/network-configs/'

def backup_device(device):
    """Backup single device configuration"""
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(device['ip'], username=USERNAME, password=PASSWORD)
        
        stdin, stdout, stderr = ssh.exec_command('show running-config')
        config = stdout.read().decode()
        
        # Save to file
        date = datetime.datetime.now().strftime('%Y%m%d')
        filename = f"{BACKUP_DIR}{device['name']}_{date}.txt"
        
        with open(filename, 'w') as f:
            f.write(config)
        
        ssh.close()
        return True
        
    except Exception as e:
        print(f"Error backing up {device['name']}: {e}")
        return False

def main():
    os.makedirs(BACKUP_DIR, exist_ok=True)
    
    success = 0
    failed = 0
    
    for device in DEVICES:
        if backup_device(device):
            success += 1
        else:
            failed += 1
    
    print(f"Backup complete: {success} success, {failed} failed")

if __name__ == '__main__':
    main()
```

### 5.11.5 Disaster Recovery Procedure

```
+------------------------------------------------------------------+
|                    DISASTER RECOVERY PROCEDURE                    |
+------------------------------------------------------------------+

SCENARIO: Primary DNAC Cluster Failure (New Jersey)

Step 1: Assess Situation
- Confirm primary cluster is unrecoverable
- Verify DR site (London) infrastructure ready
- Notify stakeholders

Step 2: Activate DR DNAC Cluster
- Power on DR DNAC nodes (if cold standby)
- Restore latest backup to DR cluster
- Update DNS: dnac.corp.local -> DR cluster IP

Step 3: Reconnect Network Devices
- Devices will auto-reconnect to new DNAC IP via DNS
- Verify device inventory in DR DNAC
- Re-establish Assurance data collection

Step 4: Reconnect ISE Integration
- Update DNAC-ISE integration settings
- Verify pxGrid connection
- Test authentication policies

Step 5: Validation
- Verify all sites visible in DNAC
- Confirm Assurance data flowing
- Test device provisioning
- Validate policy deployment

Step 6: Communication
- Notify operations team of new procedures
- Update runbooks with DR DNAC details
- Schedule review of incident

RTO Target: 4 hours
RPO Target: 24 hours (daily backup)
```

---

## 5.12 Compliance and Audit

### 5.12.1 Compliance Reporting

| Regulation | Requirement | ISE/DNAC Feature | Report |
|------------|-------------|------------------|--------|
| PCI-DSS 7.1 | Access control | Authorization policies | ISE Auth Report |
| PCI-DSS 8.1 | User identification | 802.1X authentication | ISE Auth Report |
| PCI-DSS 10.1 | Audit trails | RADIUS accounting | ISE Accounting |
| SOC2 CC6.1 | Logical access | SGT-based segmentation | DNAC Policy Report |
| GDPR Art.32 | Access logging | RADIUS live logs | ISE Audit Report |
| HIPAA | Access control | Role-based policies | ISE Auth Report |

### 5.12.2 Audit Log Configuration

```cisco
! Enable comprehensive logging on network devices

archive
 log config
  logging enable
  notify syslog contenttype plaintext
  hidekeys

logging buffered 65536 informational
logging host 10.252.1.30 transport udp port 514

! AAA accounting
aaa accounting dot1x default start-stop group RADIUS-GROUP
aaa accounting exec default start-stop group TACACS-GROUP
aaa accounting commands 15 default start-stop group TACACS-GROUP
aaa accounting network default start-stop group RADIUS-GROUP
```

### 5.12.3 ISE Audit Reports

```yaml
# Administration > System > Logging > Remote Logging Targets

Audit_Logging:
  SIEM_Integration:
    Target: siem.corp.local
    Port: 6514
    Protocol: TLS-Syslog
    Format: RFC 5424
    Events:
      - Administrative Changes
      - Policy Changes
      - Authentication Events
      - Authorization Changes

Scheduled_Audit_Reports:
  # Operations > Reports > Report Scheduler
  
  Weekly_Admin_Audit:
    Report: Device Administration Audit
    Schedule: Weekly (Monday 08:00)
    Recipients: security-audit@corp.local
    
  Monthly_Policy_Changes:
    Report: Policy Change Audit
    Schedule: Monthly (1st, 08:00)
    Recipients: compliance@corp.local
    
  Quarterly_Access_Review:
    Report: Authentication Summary
    Schedule: Quarterly
    Recipients: audit@corp.local
```

### 5.12.4 Compliance Evidence Collection

```yaml
# Quarterly Compliance Evidence Package

Evidence_Package:
  Network_Segmentation:
    - DNAC Virtual Network configuration export
    - SGACL policy matrix export
    - Firewall rule export
    - Traffic flow samples showing enforcement
    
  Access_Control:
    - ISE authorization policy export
    - User authentication success rates
    - Failed authentication analysis
    - Service account review
    
  Audit_Trails:
    - RADIUS accounting logs (sample)
    - TACACS+ admin logs (sample)
    - Configuration change logs
    - Policy change audit trail
    
  Encryption:
    - MACsec configuration evidence
    - TLS certificate inventory
    - RADIUS encryption settings
    
  Change_Management:
    - Change tickets for period
    - CAB meeting minutes
    - Emergency change documentation
```

---

## Summary

Chapter 5 provides comprehensive operational guidance for maintaining the SD-Access environment, covering:

1. **Operational Framework**: ITIL-aligned model with defined roles and KPIs
2. **DNAC Assurance**: Health monitoring, custom dashboards, API integration
3. **ISE Monitoring**: Live logs, reports, MnT tools
4. **Network Monitoring**: SNMP, syslog, NetFlow configuration
5. **Alerting**: Severity matrix, webhook integration, escalation procedures
6. **Incident Management**: Classification, response workflows, RCA templates
7. **Change Management**: Types, templates, approval process
8. **Capacity Planning**: Metrics, projections, monitoring scripts
9. **Troubleshooting**: Flowcharts, common issues, debug commands
10. **Performance Optimization**: Tuning parameters for DNAC, ISE, switches
11. **Backup & Recovery**: Schedules, procedures, DR planning
12. **Compliance**: Reporting, audit logs, evidence collection

**Next Chapter**: Chapter 6 covers Migration Strategy and Financial Analysis.

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use Only*
