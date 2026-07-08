# 3.13 Security Operations & Threat Response

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-SEC-3.13 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

This section documents the Security Operations Center (SOC) integration and threat response procedures for Abhavtech's SD-WAN deployment. It covers the integration between SD-WAN security telemetry and SOC tools, incident response workflows, forensic capabilities, and coordination with broader enterprise security operations.

### 1.1 Security Operations Architecture

```
+------------------------------------------------------------------+
|              SECURITY OPERATIONS ARCHITECTURE                     |
+------------------------------------------------------------------+
|                                                                   |
|  Data Sources:                                                    |
|  +------------------+  +------------------+  +------------------+ |
|  | SD-WAN Telemetry |  | SD-Access Logs   |  | Cloud Security   | |
|  | - NetFlow        |  | - Auth logs      |  | - CloudTrail     | |
|  | - UTD Alerts     |  | - SGACL logs     |  | - GuardDuty      | |
|  | - Syslog         |  | - Stealthwatch   |  | - Security Hub   | |
|  +--------+---------+  +--------+---------+  +--------+---------+ |
|           |                     |                     |           |
|           +---------------------+---------------------+           |
|                                 |                                 |
|                          +------v------+                          |
|                          |    SIEM     |                          |
|                          | (Splunk)    |                          |
|                          +------+------+                          |
|                                 |                                 |
|           +---------------------+---------------------+           |
|           |                     |                     |           |
|  +--------v---------+  +--------v---------+  +--------v---------+ |
|  | Threat Intel     |  | Security Analytics|  | Case Management | |
|  | (ThreatGrid)     |  | (SecureX)        |  | (ServiceNow)    | |
|  +------------------+  +------------------+  +------------------+ |
|                                                                   |
|                          +-------------+                          |
|                          |     SOC     |                          |
|                          | Operations  |                          |
|                          +-------------+                          |
|                                                                   |
+------------------------------------------------------------------+
```

### 1.2 SOC Integration Points

| Integration | Purpose | Protocol | Frequency |
|-------------|---------|----------|-----------|
| vManage → SIEM | Security events | Syslog/CEF | Real-time |
| WAN Edge → SIEM | Traffic logs | NetFlow v9 | 1 minute |
| UTD → SIEM | Threat alerts | Syslog | Real-time |
| ISE → SIEM | Auth events | pxGrid | Real-time |
| SIEM → SOAR | Automation | API | Event-driven |

---

## 2. SIEM Integration

### 2.1 Log Collection Architecture

```
+------------------------------------------------------------------+
|                   LOG COLLECTION ARCHITECTURE                     |
+------------------------------------------------------------------+
|                                                                   |
|  Branch Sites                          Data Centers               |
|  +------------------+                  +------------------+       |
|  | WAN Edge         |                  | WAN Edge         |       |
|  | - Syslog         |                  | - Syslog         |       |
|  | - NetFlow        |                  | - NetFlow        |       |
|  +--------+---------+                  +--------+---------+       |
|           |                                     |                 |
|           |                                     |                 |
|           +----------------+--------------------+                 |
|                            |                                      |
|                     +------v------+                               |
|                     | Log Forwarder|                              |
|                     | (Splunk UF)  |                              |
|                     +------+------+                               |
|                            |                                      |
|                     +------v------+                               |
|                     | Log Indexer |                               |
|                     | (Splunk)    |                               |
|                     +------+------+                               |
|                            |                                      |
|                     +------v------+                               |
|                     | Search Head |                               |
|                     | Cluster     |                               |
|                     +-------------+                               |
|                                                                   |
+------------------------------------------------------------------+
```

### 2.2 Syslog Configuration

```
! WAN Edge Syslog Configuration
logging host 10.254.1.50 vrf Mgmt transport udp port 514
logging host 10.254.1.51 vrf Mgmt transport tcp port 6514 secure
logging source-interface Loopback0
logging trap informational
logging facility local7

! Structured Logging (CEF Format)
logging discriminator CEF-EVENTS severity includes 4 5 6
logging host 10.254.1.50 discriminator CEF-EVENTS

! UTD Specific Logging
utd engine standard
 logging host 10.254.1.50
 logging level info
 alert
  severity critical action syslog snmp-trap email
  severity high action syslog snmp-trap
  severity medium action syslog
 !
!
```

### 2.3 NetFlow Configuration

```
! NetFlow v9 for Security Analytics
flow record SECURITY-RECORD
 match ipv4 source address
 match ipv4 destination address
 match ipv4 protocol
 match transport source-port
 match transport destination-port
 match interface input
 match flow direction
 collect counter bytes long
 collect counter packets long
 collect timestamp sys-uptime first
 collect timestamp sys-uptime last
 collect application name

flow exporter SIEM-EXPORT
 destination 10.254.1.60
 source Loopback0
 transport udp 2055
 export-protocol netflow-v9
 template data timeout 60

flow monitor SECURITY-MONITOR
 record SECURITY-RECORD
 exporter SIEM-EXPORT
 cache timeout active 60
 cache timeout inactive 15

interface GigabitEthernet0/0/1
 ip flow monitor SECURITY-MONITOR input
 ip flow monitor SECURITY-MONITOR output
!
```

---

## 3. Security Analytics

### 3.1 Detection Use Cases

```
+------------------------------------------------------------------+
|                   SECURITY DETECTION USE CASES                    |
+------------------------------------------------------------------+
|                                                                   |
|  Use Case                | Detection Method    | Response        |
|  ------------------------+---------------------+-----------------|
|  Malware Download        | UTD + AMP           | Block + Alert   |
|  C2 Communication        | UTD + DNS Security  | Block + Isolate |
|  Data Exfiltration       | NetFlow Anomaly     | Alert + Invest  |
|  Lateral Movement        | SGACL Violations    | Block + Alert   |
|  Brute Force             | Auth Log Analysis   | Block + Alert   |
|  Policy Violation        | DLP + URL Filter    | Alert + Log     |
|  Unauthorized Access     | SGACL + ACL         | Block + Alert   |
|  DDoS Attack             | Traffic Analysis    | Mitigate + Alert|
|                                                                   |
+------------------------------------------------------------------+
```

### 3.2 Splunk Detection Rules

```
! Splunk Search: Malware Detection
index=sdwan sourcetype=utd_alerts severity=critical OR severity=high
| stats count by src_ip, dest_ip, threat_name, action
| where count > 0

! Splunk Search: Data Exfiltration Detection
index=sdwan sourcetype=netflow
| stats sum(bytes) as total_bytes by src_ip, dest_ip
| where total_bytes > 1073741824
| lookup internal_ips ip as src_ip OUTPUT internal
| where internal="true"
| lookup internal_ips ip as dest_ip OUTPUT internal as dest_internal
| where dest_internal!="true"

! Splunk Search: Unauthorized Access Attempts
index=sdwan sourcetype=syslog "SGACL" "deny"
| stats count by src_sgt, dest_sgt, src_ip, dest_ip
| where count > 10

! Splunk Search: Brute Force Detection
index=sdwan sourcetype=syslog "authentication" "failure"
| stats count by src_ip, username
| where count > 5
```

### 3.3 Alert Correlation

```
+------------------------------------------------------------------+
|                    ALERT CORRELATION RULES                        |
+------------------------------------------------------------------+
|                                                                   |
|  Rule: Compromised Endpoint Detection                             |
|  +----------------------------------------------------------+    |
|  | Condition 1: Malware alert from UTD                       |   |
|  | AND                                                       |   |
|  | Condition 2: Unusual outbound traffic pattern             |   |
|  | AND                                                       |   |
|  | Condition 3: DNS queries to suspicious domains            |   |
|  | =                                                         |   |
|  | Action: Create P1 incident, initiate quarantine           |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Rule: Insider Threat Detection                                   |
|  +----------------------------------------------------------+    |
|  | Condition 1: Access to sensitive resources (SGT 11/12)    |   |
|  | AND                                                       |   |
|  | Condition 2: Outside normal working hours                 |   |
|  | AND                                                       |   |
|  | Condition 3: Large data transfer                          |   |
|  | =                                                         |   |
|  | Action: Alert security team, enable enhanced logging      |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 4. Incident Response

### 4.1 Incident Classification

| Severity | Description | Response Time | Examples |
|----------|-------------|---------------|----------|
| P1 Critical | Active breach, data loss | 15 minutes | Ransomware, active exfil |
| P2 High | Confirmed threat, potential impact | 1 hour | Malware detection, C2 |
| P3 Medium | Suspicious activity | 4 hours | Policy violations |
| P4 Low | Informational | 24 hours | Failed auth attempts |

### 4.2 Incident Response Workflow

```
+------------------------------------------------------------------+
|                 INCIDENT RESPONSE WORKFLOW                        |
+------------------------------------------------------------------+
|                                                                   |
|  Phase 1: Detection & Triage (0-15 min)                          |
|  +----------------------------------------------------------+    |
|  | 1. Alert received in SIEM/SOC                             |   |
|  | 2. SOC analyst validates alert (false positive check)     |   |
|  | 3. Classify severity (P1/P2/P3/P4)                        |   |
|  | 4. Create incident ticket                                 |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Phase 2: Containment (15-60 min)                                |
|  +----------------------------------------------------------+    |
|  | 1. Isolate affected systems (SGT change, port shutdown)   |   |
|  | 2. Block malicious IPs/domains                            |   |
|  | 3. Preserve evidence (packet captures, logs)              |   |
|  | 4. Notify stakeholders                                    |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Phase 3: Investigation (1-24 hours)                             |
|  +----------------------------------------------------------+    |
|  | 1. Determine root cause                                   |   |
|  | 2. Identify scope of compromise                           |   |
|  | 3. Collect forensic evidence                              |   |
|  | 4. Document timeline                                      |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Phase 4: Eradication & Recovery (24-72 hours)                   |
|  +----------------------------------------------------------+    |
|  | 1. Remove threat from environment                         |   |
|  | 2. Patch vulnerabilities                                  |   |
|  | 3. Restore systems from backup if needed                  |   |
|  | 4. Verify clean state                                     |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Phase 5: Post-Incident (1-2 weeks)                              |
|  +----------------------------------------------------------+    |
|  | 1. Conduct lessons learned                                |   |
|  | 2. Update detection rules                                 |   |
|  | 3. Improve defenses                                       |   |
|  | 4. Close incident                                         |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.3 Containment Actions

```
! Immediate Containment - Quarantine Endpoint
! Via ISE pxGrid ANC
POST /ise/eps/config/anc/endpoint
{
  "macAddress": "AA:BB:CC:DD:EE:FF",
  "policyName": "QUARANTINE"
}

! Block Malicious IP at WAN Edge
ip access-list extended EMERGENCY-BLOCK
 deny ip host 192.0.2.100 any log
 deny ip any host 192.0.2.100 log
 permit ip any any

interface GigabitEthernet0/0/1
 ip access-group EMERGENCY-BLOCK in
!

! Block Domain via Umbrella
! (Via Umbrella API)
POST /policies/v2/destinationlists/{listId}/destinations
{
  "destination": "malicious-domain.com",
  "comment": "Blocked - Incident #12345"
}

! Disable User Account
! (Via ISE Guest API)
PUT /ers/config/guestuser/{userId}/suspend
```

---

## 5. Forensic Capabilities

### 5.1 Evidence Collection

```
+------------------------------------------------------------------+
|                   FORENSIC EVIDENCE SOURCES                       |
+------------------------------------------------------------------+
|                                                                   |
|  Evidence Type        | Source              | Retention          |
|  ---------------------+---------------------+-------------------|
|  Traffic Captures     | WAN Edge (EPC)      | 7 days            |
|  NetFlow Records      | SIEM                | 90 days           |
|  Authentication Logs  | ISE                 | 2 years           |
|  Config Changes       | vManage Audit       | 1 year            |
|  Threat Alerts        | UTD/AMP logs        | 1 year            |
|  DNS Queries          | Umbrella            | 30 days           |
|  URL Access           | URL Filter logs     | 90 days           |
|                                                                   |
+------------------------------------------------------------------+
```

### 5.2 Packet Capture Configuration

```
! Embedded Packet Capture (EPC) on WAN Edge
monitor capture FORENSIC-CAPTURE interface GigabitEthernet0/0/1 both
monitor capture FORENSIC-CAPTURE access-list CAPTURE-FILTER
monitor capture FORENSIC-CAPTURE buffer size 50
monitor capture FORENSIC-CAPTURE limit duration 3600

ip access-list extended CAPTURE-FILTER
 permit ip host 172.16.10.50 any
 permit ip any host 172.16.10.50

! Start capture
monitor capture FORENSIC-CAPTURE start

! Export capture
monitor capture FORENSIC-CAPTURE export tftp://10.254.1.100/captures/incident-12345.pcap

! Stop and clear
monitor capture FORENSIC-CAPTURE stop
no monitor capture FORENSIC-CAPTURE
```

### 5.3 Log Export for Forensics

```
! Export logs for forensic analysis
! SD-WAN Manager API

GET /dataservice/device/log/file?deviceId={deviceId}&logType=security

! Response: Download link for log bundle

! ISE Log Export
GET /admin/API/mnt/Session/EndPointIPAddress/{ipAddress}

! Umbrella Activity Export
GET /reports/v2/activity?from={timestamp}&to={timestamp}&ip={ipAddress}
```

---

## 6. SOAR Integration

### 6.1 Automated Response Playbooks

```
+------------------------------------------------------------------+
|                   SOAR PLAYBOOK: MALWARE RESPONSE                 |
+------------------------------------------------------------------+
|                                                                   |
|  Trigger: UTD malware alert (severity >= high)                    |
|                                                                   |
|  Step 1: Enrich Alert                                             |
|  +----------------------------------------------------------+    |
|  | - Query ISE for user/device details                       |   |
|  | - Query ThreatGrid for malware details                    |   |
|  | - Query CMDB for asset information                        |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Step 2: Automated Containment                                    |
|  +----------------------------------------------------------+    |
|  | - If confirmed malware: Quarantine via ISE ANC            |   |
|  | - Block file hash across all endpoints                    |   |
|  | - Block C2 domain in Umbrella                             |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Step 3: Create Incident                                          |
|  +----------------------------------------------------------+    |
|  | - Create ServiceNow incident                              |   |
|  | - Attach enrichment data                                  |   |
|  | - Assign to security team                                 |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Step 4: Notify                                                   |
|  +----------------------------------------------------------+    |
|  | - Send Slack notification to #security-alerts             |   |
|  | - Page on-call if P1                                      |   |
|  | - Email affected user's manager                           |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 6.2 SOAR API Integration

```python
# SOAR Playbook: Quarantine Endpoint via ISE
import requests

def quarantine_endpoint(mac_address, incident_id):
    """Quarantine endpoint via ISE pxGrid ANC"""
    
    ise_url = "https://ise.abhavtech.com/ers/config/ancendpoint"
    
    payload = {
        "ErsAncEndpoint": {
            "macAddress": mac_address,
            "policyName": "QUARANTINE"
        }
    }
    
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    
    response = requests.post(
        ise_url,
        json=payload,
        headers=headers,
        auth=("api_user", "api_password"),
        verify=True
    )
    
    if response.status_code == 201:
        log_action(incident_id, f"Quarantined {mac_address}")
        return True
    else:
        log_error(incident_id, f"Quarantine failed: {response.text}")
        return False
```

---

## 7. Metrics and Reporting

### 7.1 Security KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| MTTD (Mean Time to Detect) | < 15 minutes | Alert timestamp - event timestamp |
| MTTR (Mean Time to Respond) | < 1 hour | Containment timestamp - alert timestamp |
| False Positive Rate | < 5% | FP alerts / total alerts |
| Incidents per Month | Trending down | Count of P1/P2 incidents |
| Threat Block Rate | > 99% | Blocked / (blocked + allowed) |

### 7.2 SOC Dashboard

```
+------------------------------------------------------------------+
|                   SOC OPERATIONAL DASHBOARD                       |
+------------------------------------------------------------------+
|                                                                   |
|  Current Status:                                                  |
|  +----------------------------------------------------------+    |
|  | Active Incidents: 3 (P1: 0, P2: 1, P3: 2)                |    |
|  | Alerts (24h): 1,247 | Blocked Threats: 156               |    |
|  | Analyst Queue: 12 pending review                          |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Threat Trends (7 days):                                          |
|  +----------------------------------------------------------+    |
|  | Malware:     ████████░░ 156 (↓12%)                       |    |
|  | Phishing:    ██████░░░░ 89 (↑5%)                         |    |
|  | DDoS:        ██░░░░░░░░ 12 (↓50%)                        |    |
|  | Policy Viol: ████░░░░░░ 45 (→ stable)                    |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Performance Metrics:                                             |
|  +----------------------------------------------------------+    |
|  | MTTD: 8 min (Target: 15 min) ✅                           |    |
|  | MTTR: 45 min (Target: 60 min) ✅                          |    |
|  | FP Rate: 3.2% (Target: 5%) ✅                             |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 8. Best Practices Summary

### 8.1 SOC Integration Best Practices

- Centralize all security logs in SIEM
- Use consistent log formats (CEF/LEEF)
- Enable real-time alerting for critical events
- Maintain 90+ days of searchable logs

### 8.2 Incident Response Best Practices

- Document all IR procedures
- Test playbooks quarterly
- Maintain current contact lists
- Conduct tabletop exercises

### 8.3 Forensic Best Practices

- Preserve evidence chain of custody
- Enable packet capture capability
- Maintain adequate log retention
- Document all forensic procedures

---

## References

| Document | Description | Location |
|----------|-------------|----------|
| NIST SP 800-61 | Incident Response Guide | nist.gov |
| Cisco SecureX Guide | XDR integration | cisco.com |
| Splunk SD-WAN App | SIEM integration | splunkbase.com |
| Abhavtech IR Playbook | Internal IR procedures | SharePoint |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
*Document ID: SDWAN-SEC-3.13*
