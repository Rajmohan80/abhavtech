# 6.11 Incident Management

## Document Information
- **Version**: 1.0
- **Last Updated**: December 2025
- **Author**: Abhavtech Network Team
- **Classification**: Internal Use

## Overview

This section defines the incident management framework for Abhavtech's SD-WAN infrastructure. Effective incident management ensures rapid detection, diagnosis, and resolution of service disruptions while maintaining clear communication with stakeholders.

## Incident Management Framework

### Framework Architecture

```
+------------------------------------------------------------------+
|                  INCIDENT MANAGEMENT FRAMEWORK                    |
+------------------------------------------------------------------+
|                                                                    |
|  Detection         Triage           Resolution       Closure      |
|      |               |                  |               |          |
|      v               v                  v               v          |
|  +-------+      +--------+         +--------+      +--------+     |
|  |Monitor|      |Classify|         |Diagnose|      |Document|     |
|  |& Alert|----->|& Prior |-------->|& Fix   |----->|& Close |     |
|  +-------+      +--------+         +--------+      +--------+     |
|      |               |                  |               |          |
|      v               v                  v               v          |
|  +-------+      +--------+         +--------+      +--------+     |
|  |Auto   |      |Assign  |         |Escalate|      |Review  |     |
|  |Detect |      |Team    |         |If Needed|     |& Learn |     |
|  +-------+      +--------+         +--------+      +--------+     |
|                                                                    |
|  Continuous Communication & Stakeholder Updates                   |
+------------------------------------------------------------------+
```

### Incident Severity Levels

| Severity | Description | Response Time | Resolution Target | Examples |
|----------|-------------|---------------|-------------------|----------|
| SEV-1 | Critical - Complete service outage | 15 minutes | 2 hours | Full site outage, controller cluster down |
| SEV-2 | High - Major service degradation | 30 minutes | 4 hours | Multiple tunnel failures, AAR not working |
| SEV-3 | Medium - Partial service impact | 2 hours | 8 hours | Single tunnel down, degraded performance |
| SEV-4 | Low - Minimal impact | 8 hours | 24 hours | Non-critical alert, cosmetic issue |

### Incident Priority Matrix

```
+------------------------------------------------------------------+
|                    INCIDENT PRIORITY MATRIX                       |
+------------------------------------------------------------------+
|                                                                    |
|              |  Critical  |   High    |  Medium   |    Low       |
|   IMPACT     |   Impact   |  Impact   |  Impact   |   Impact     |
|--------------|------------|-----------|-----------|--------------|
| Urgent       |   SEV-1    |  SEV-1    |  SEV-2    |   SEV-3     |
| Urgency      |            |           |           |              |
|--------------|------------|-----------|-----------|--------------|
| High         |   SEV-1    |  SEV-2    |  SEV-2    |   SEV-3     |
| Urgency      |            |           |           |              |
|--------------|------------|-----------|-----------|--------------|
| Medium       |   SEV-2    |  SEV-2    |  SEV-3    |   SEV-4     |
| Urgency      |            |           |           |              |
|--------------|------------|-----------|-----------|--------------|
| Low          |   SEV-2    |  SEV-3    |  SEV-4    |   SEV-4     |
| Urgency      |            |           |           |              |
+------------------------------------------------------------------+
|                                                                    |
| Impact Criteria:                                                  |
| - Critical: All users/sites affected, revenue impact              |
| - High: Multiple sites or business-critical app affected          |
| - Medium: Single site or department affected                      |
| - Low: Individual user or non-critical function                   |
|                                                                    |
| Urgency Criteria:                                                 |
| - Urgent: No workaround, immediate business impact                |
| - High: Workaround exists but not sustainable                     |
| - Medium: Workaround available, manageable impact                 |
| - Low: Can wait for scheduled resolution                          |
+------------------------------------------------------------------+
```

## Incident Detection

### Detection Sources

```
+------------------------------------------------------------------+
|                     INCIDENT DETECTION SOURCES                    |
+------------------------------------------------------------------+
|                                                                    |
|  +----------------+     +----------------+     +----------------+  |
|  | vManage Alarms |     | SNMP Traps     |     | Syslog Events  |  |
|  | - Control plane|     | - Device status|     | - Error logs   |  |
|  | - Data plane   |     | - Interface    |     | - Security     |  |
|  | - Application  |     | - Environment  |     | - System       |  |
|  +----------------+     +----------------+     +----------------+  |
|          |                     |                     |            |
|          +---------------------+---------------------+            |
|                               |                                   |
|                               v                                   |
|                    +--------------------+                         |
|                    | Event Correlation  |                         |
|                    | (Splunk SIEM)      |                         |
|                    +--------------------+                         |
|                               |                                   |
|          +-------------------+|+-------------------+              |
|          |                    |                    |              |
|          v                    v                    v              |
|  +----------------+  +----------------+  +----------------+       |
|  | Auto-Ticket    |  | NOC Dashboard  |  | PagerDuty      |       |
|  | Creation       |  | Display        |  | Alert          |       |
|  +----------------+  +----------------+  +----------------+       |
|                                                                    |
+------------------------------------------------------------------+
```

### SD-WAN Specific Alerts

| Alert Type | Trigger | Severity | Auto-Ticket |
|------------|---------|----------|-------------|
| Control Connection Lost | WAN Edge loses all control connections | SEV-1 | Yes |
| Site Unreachable | All tunnels to site down | SEV-1 | Yes |
| Controller Cluster Degraded | vManage cluster node failure | SEV-1 | Yes |
| Multiple Tunnel Failures | >50% tunnels failed | SEV-2 | Yes |
| BFD Session Down | BFD flapping or down | SEV-2 | Yes |
| AAR SLA Violation | SLA threshold exceeded for 5 min | SEV-2 | Yes |
| Certificate Expiry Warning | Certificate expires in 30 days | SEV-3 | No |
| High CPU/Memory | Utilization >85% for 10 min | SEV-3 | Yes |
| Single Tunnel Down | One tunnel path failed | SEV-3 | Yes |
| Software Version Mismatch | Version inconsistency | SEV-4 | No |

### Automated Incident Creation

```python
#!/usr/bin/env python3
"""
Automated Incident Creator
Creates ServiceNow incidents from SD-WAN alerts
"""

import requests
import json
from datetime import datetime
from typing import Dict, Optional

class SDWANIncidentCreator:
    def __init__(
        self,
        vmanage_host: str,
        servicenow_instance: str,
        snow_user: str,
        snow_pass: str
    ):
        self.vmanage_url = f"https://{vmanage_host}"
        self.snow_url = f"https://{servicenow_instance}.service-now.com/api/now/table/incident"
        self.snow_auth = (snow_user, snow_pass)
        
        # Alert to severity mapping
        self.severity_map = {
            'control-connection-lost': 1,
            'site-unreachable': 1,
            'cluster-degraded': 1,
            'multiple-tunnel-failure': 2,
            'bfd-down': 2,
            'sla-violation': 2,
            'high-utilization': 3,
            'single-tunnel-down': 3,
            'certificate-warning': 4,
        }
        
        # Category mapping
        self.category_map = {
            'control-connection-lost': 'Network',
            'site-unreachable': 'Network',
            'cluster-degraded': 'Infrastructure',
            'multiple-tunnel-failure': 'Network',
            'bfd-down': 'Network',
            'sla-violation': 'Application',
            'high-utilization': 'Performance',
            'single-tunnel-down': 'Network',
            'certificate-warning': 'Security',
        }
    
    def create_incident(self, alert: Dict) -> Optional[str]:
        """Create ServiceNow incident from SD-WAN alert"""
        
        alert_type = alert.get('alert_type', 'unknown')
        severity = self.severity_map.get(alert_type, 3)
        category = self.category_map.get(alert_type, 'Network')
        
        # Build incident payload
        incident = {
            'short_description': self._format_short_description(alert),
            'description': self._format_description(alert),
            'impact': severity,
            'urgency': severity,
            'category': category,
            'subcategory': 'SD-WAN',
            'assignment_group': 'Network Operations',
            'caller_id': 'SD-WAN Monitoring',
            'configuration_item': alert.get('device_id', 'Unknown'),
            'u_affected_site': alert.get('site_name', 'Unknown'),
            'u_alert_id': alert.get('alert_id', ''),
        }
        
        # Create incident in ServiceNow
        response = requests.post(
            self.snow_url,
            auth=self.snow_auth,
            headers={'Content-Type': 'application/json'},
            json=incident
        )
        
        if response.status_code == 201:
            result = response.json()
            incident_number = result['result']['number']
            return incident_number
        else:
            print(f"Failed to create incident: {response.text}")
            return None
    
    def _format_short_description(self, alert: Dict) -> str:
        """Format incident short description"""
        alert_type = alert.get('alert_type', 'Unknown Alert')
        device = alert.get('device_id', 'Unknown Device')
        site = alert.get('site_name', 'Unknown Site')
        
        return f"SD-WAN: {alert_type} on {device} at {site}"
    
    def _format_description(self, alert: Dict) -> str:
        """Format detailed incident description"""
        return f"""
SD-WAN Automated Incident

Alert Details:
- Alert Type: {alert.get('alert_type', 'Unknown')}
- Alert ID: {alert.get('alert_id', 'Unknown')}
- Device: {alert.get('device_id', 'Unknown')}
- Site: {alert.get('site_name', 'Unknown')}
- Timestamp: {alert.get('timestamp', datetime.now().isoformat())}

Alert Message:
{alert.get('message', 'No message provided')}

Impact Assessment:
{alert.get('impact', 'Impact assessment pending')}

Recommended Actions:
1. Check vManage dashboard for current status
2. Verify control connections
3. Check affected tunnel/path status
4. Review recent changes

vManage Link: {self.vmanage_url}/monitor/dashboard
"""
    
    def process_alert_batch(self, alerts: list) -> Dict:
        """Process multiple alerts and create incidents"""
        results = {
            'processed': 0,
            'created': 0,
            'failed': 0,
            'incidents': []
        }
        
        for alert in alerts:
            results['processed'] += 1
            
            # Check if alert warrants auto-ticket
            alert_type = alert.get('alert_type', '')
            if self.severity_map.get(alert_type, 4) <= 3:
                incident_num = self.create_incident(alert)
                
                if incident_num:
                    results['created'] += 1
                    results['incidents'].append({
                        'alert_id': alert.get('alert_id'),
                        'incident': incident_num
                    })
                else:
                    results['failed'] += 1
        
        return results


class AlertProcessor:
    """Process vManage alerts and trigger incident creation"""
    
    def __init__(self, vmanage_host: str, username: str, password: str):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
    
    def authenticate(self, username: str, password: str):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        self.session.post(
            auth_url,
            data={'j_username': username, 'j_password': password}
        )
    
    def get_active_alerts(self) -> list:
        """Get active alerts from vManage"""
        url = f"{self.base_url}/dataservice/alarms"
        params = {
            'query': json.dumps({
                'query': {
                    'condition': 'AND',
                    'rules': [
                        {'field': 'active', 'type': 'boolean', 'value': ['true']}
                    ]
                }
            })
        }
        
        response = self.session.get(url, params=params)
        alerts = response.json().get('data', [])
        
        # Transform to standard format
        processed_alerts = []
        for alert in alerts:
            processed_alerts.append({
                'alert_id': alert.get('uuid'),
                'alert_type': self._classify_alert(alert),
                'device_id': alert.get('system-ip'),
                'site_name': alert.get('site-id'),
                'timestamp': alert.get('entry_time'),
                'message': alert.get('message'),
                'impact': alert.get('severity')
            })
        
        return processed_alerts
    
    def _classify_alert(self, alert: Dict) -> str:
        """Classify alert type from vManage alert data"""
        rule_name = alert.get('rule_name_display', '').lower()
        
        if 'control' in rule_name and 'connection' in rule_name:
            return 'control-connection-lost'
        elif 'bfd' in rule_name:
            return 'bfd-down'
        elif 'site' in rule_name and 'down' in rule_name:
            return 'site-unreachable'
        elif 'tunnel' in rule_name:
            return 'single-tunnel-down'
        elif 'cpu' in rule_name or 'memory' in rule_name:
            return 'high-utilization'
        elif 'certificate' in rule_name:
            return 'certificate-warning'
        else:
            return 'unknown'


# Example usage
if __name__ == "__main__":
    # Initialize components
    alert_processor = AlertProcessor(
        vmanage_host="vmanage.abhavtech.com",
        username="admin",
        password="secure_password"
    )
    
    incident_creator = SDWANIncidentCreator(
        vmanage_host="vmanage.abhavtech.com",
        servicenow_instance="abhavtech",
        snow_user="api_user",
        snow_pass="api_password"
    )
    
    # Get and process alerts
    alerts = alert_processor.get_active_alerts()
    results = incident_creator.process_alert_batch(alerts)
    
    print(f"Processed: {results['processed']}")
    print(f"Incidents Created: {results['created']}")
    print(f"Failed: {results['failed']}")
```

## Incident Response Procedures

### SEV-1 Response Procedure

```
+------------------------------------------------------------------+
|                   SEV-1 INCIDENT RESPONSE                         |
+------------------------------------------------------------------+
|                                                                    |
|  TIME        ACTION                         RESPONSIBLE           |
|  ----        ------                         -----------           |
|  T+0         Alert received                 Monitoring            |
|  T+5 min     Initial triage                 NOC L1                |
|  T+10 min    Incident declared              NOC L1                |
|  T+15 min    Bridge call initiated          Incident Manager      |
|  T+15 min    L2/L3 engaged                  Network Engineering   |
|  T+20 min    Management notified            Incident Manager      |
|  T+30 min    Initial assessment             Network Engineering   |
|  T+45 min    Progress update                Incident Manager      |
|  T+60 min    First resolution attempt       Network Engineering   |
|  T+90 min    Escalation if not resolved     Incident Manager      |
|  T+120 min   Target resolution              Network Engineering   |
|                                                                    |
|  Continuous: Status updates every 15 minutes                      |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  COMMUNICATION CHANNELS                                           |
|  -----------------------                                          |
|  Bridge Call: +91-XXXX-XXXXXX, PIN: 123456                       |
|  Slack: #incident-sdwan-sev1                                      |
|  Email: incident-major@abhavtech.com                              |
|                                                                    |
|  ESCALATION PATH                                                  |
|  ---------------                                                  |
|  L1 NOC -> L2 Network Eng -> L3 Sr. Eng -> Network Manager       |
|         -> Cisco TAC (if vendor escalation needed)                |
|                                                                    |
+------------------------------------------------------------------+
```

### Incident Response Runbook: Site Unreachable

```yaml
# Incident Runbook: Site Unreachable
incident_type: "Site Unreachable"
severity: "SEV-1"
target_resolution: "2 hours"

initial_assessment:
  steps:
    - step: 1
      action: "Verify site is actually unreachable"
      commands:
        - "ping <site-wan-edge-ip> from vManage"
        - "Check vManage dashboard for site status"
      expected: "Site shows as unreachable in vManage"
    
    - step: 2
      action: "Identify scope of outage"
      check_items:
        - "All tunnels down vs partial"
        - "Control plane vs data plane"
        - "Single WAN Edge vs all at site"
      commands:
        - "show sdwan control connections (from affected device if accessible)"
        - "show sdwan tunnel statistics"
    
    - step: 3
      action: "Check for related alerts"
      check_items:
        - "Circuit provider alerts"
        - "Power/environment alerts"
        - "Recent changes"

diagnosis:
  control_plane_failure:
    symptoms:
      - "Control connections show down"
      - "OMP not established"
    possible_causes:
      - "Certificate expired"
      - "Clock skew"
      - "Network/firewall blocking"
    resolution_steps:
      - "Check certificate: show sdwan certificate installed"
      - "Verify clock: show clock"
      - "Check firewall rules for UDP 12346"
  
  data_plane_failure:
    symptoms:
      - "Control connections up"
      - "Tunnels down or degraded"
      - "BFD failures"
    possible_causes:
      - "Transport circuit down"
      - "IPsec issue"
      - "MTU problems"
    resolution_steps:
      - "Check interface status: show interface brief"
      - "Check BFD: show sdwan bfd sessions"
      - "Check IPsec: show sdwan ipsec inbound-connections"
  
  device_failure:
    symptoms:
      - "Device completely unreachable"
      - "No response to any protocol"
    possible_causes:
      - "Power failure"
      - "Hardware failure"
      - "Software crash"
    resolution_steps:
      - "Contact site for physical check"
      - "Check console if available"
      - "Power cycle if authorized"

escalation_triggers:
  - "No improvement after 30 minutes"
  - "Root cause unclear after 1 hour"
  - "Hardware replacement needed"
  - "Vendor engagement required"

communication_template: |
  INCIDENT UPDATE - Site Unreachable
  ----------------------------------
  Incident: INC-XXXX
  Site: [Site Name]
  Status: [Investigating/Identified/Resolving/Resolved]
  
  Current State:
  [Description of current state]
  
  Actions Taken:
  [List of troubleshooting steps]
  
  Next Steps:
  [Planned actions]
  
  ETA to Resolution: [Time estimate]
  Next Update: [Time of next update]
```

### Incident Response Runbook: Controller Failure

```yaml
# Incident Runbook: vManage Controller Failure
incident_type: "vManage Controller Failure"
severity: "SEV-1"
target_resolution: "2 hours"

initial_assessment:
  steps:
    - step: 1
      action: "Verify vManage cluster status"
      commands:
        - "Access vManage UI (try all cluster nodes)"
        - "Check cluster status via API"
      api_call: "GET /dataservice/clusterManagement/list"
    
    - step: 2
      action: "Identify affected node(s)"
      check_items:
        - "Which node(s) unreachable"
        - "Cluster quorum status"
        - "Services status on healthy nodes"
    
    - step: 3
      action: "Check WAN Edge impact"
      check_items:
        - "Can WAN Edges still reach vSmart"
        - "Can WAN Edges reach vBond"
        - "Data plane still operational"

cluster_failure_scenarios:
  single_node_failure:
    impact: "Reduced redundancy, cluster still operational"
    actions:
      - "Verify remaining nodes healthy"
      - "Check cluster can still function (2/3 quorum)"
      - "Plan node recovery during maintenance window"
  
  quorum_lost:
    impact: "Management plane degraded, no config changes possible"
    actions:
      - "Prioritize restoring one failed node"
      - "Check network connectivity between nodes"
      - "Review cluster logs for root cause"
  
  full_cluster_failure:
    impact: "No management plane, data plane continues"
    actions:
      - "WAN Edges continue operating with cached config"
      - "Focus on vBond/vSmart for control plane"
      - "Restore from DR if available"

recovery_procedures:
  node_restart:
    steps:
      - "SSH to affected node"
      - "Check service status: request nms all status"
      - "Restart services: request nms all restart"
      - "Monitor cluster sync"
  
  node_rebuild:
    steps:
      - "Remove failed node from cluster"
      - "Redeploy vManage VM"
      - "Join to existing cluster"
      - "Wait for data sync"
      - "Verify cluster health"
  
  dr_failover:
    steps:
      - "Verify DR vManage available"
      - "Update DNS for vmanage.abhavtech.com"
      - "Verify WAN Edges can reach DR"
      - "Restore from latest backup"
      - "Validate all devices"

impact_mitigation:
  during_outage:
    - "WAN Edges continue normal operation"
    - "vSmart maintains OMP sessions"
    - "Data plane tunnels remain up"
    - "No configuration changes possible"
  
  workarounds:
    - "Use CLI for urgent device changes"
    - "Monitor via SNMP directly"
    - "Use vSmart for control policy if needed"
```

## Escalation Procedures

### Escalation Matrix

| Level | Role | Contact | Escalation Trigger |
|-------|------|---------|-------------------|
| L1 | NOC Analyst | noc@abhavtech.com | Initial response |
| L2 | Network Engineer | neteng@abhavtech.com | Complex diagnosis |
| L3 | Senior Engineer | senior-neteng@abhavtech.com | Expert analysis |
| L4 | Network Manager | network-mgr@abhavtech.com | Management decision |
| Vendor | Cisco TAC | TAC case | Hardware/software defect |

### Escalation Triggers

```
+------------------------------------------------------------------+
|                     ESCALATION TRIGGERS                           |
+------------------------------------------------------------------+
|                                                                    |
|  AUTOMATIC ESCALATION                                             |
|  --------------------                                             |
|  SEV-1 not resolved in 30 minutes  --> Escalate to L3            |
|  SEV-1 not resolved in 60 minutes  --> Escalate to L4            |
|  SEV-2 not resolved in 2 hours     --> Escalate to L3            |
|  SEV-3 not resolved in 4 hours     --> Escalate to L2            |
|                                                                    |
|  MANUAL ESCALATION                                                |
|  -----------------                                                |
|  Root cause unclear                --> Escalate to L3            |
|  Hardware replacement needed       --> Escalate + Cisco TAC      |
|  Software defect suspected         --> Escalate + Cisco TAC      |
|  Multiple sites affected           --> Escalate to L4            |
|  VIP user/site affected            --> Escalate to L4            |
|                                                                    |
|  CISCO TAC ESCALATION                                             |
|  --------------------                                             |
|  Hardware failure confirmed        --> Sev 2 TAC case            |
|  Software bug suspected            --> Sev 3 TAC case            |
|  Controller cluster issues         --> Sev 1 TAC case            |
|  Security vulnerability            --> Sev 1 TAC case            |
|                                                                    |
+------------------------------------------------------------------+
```

### Cisco TAC Engagement

```python
#!/usr/bin/env python3
"""
Cisco TAC Case Creator
Automated TAC case creation for SD-WAN incidents
"""

import requests
from typing import Dict

class CiscoTACIntegration:
    def __init__(self, client_id: str, client_secret: str):
        self.api_url = "https://api.cisco.com/case/v1/cases"
        self.token = self._get_token(client_id, client_secret)
    
    def _get_token(self, client_id: str, client_secret: str) -> str:
        """Get OAuth token for Cisco API"""
        auth_url = "https://cloudsso.cisco.com/as/token.oauth2"
        response = requests.post(
            auth_url,
            data={
                'grant_type': 'client_credentials',
                'client_id': client_id,
                'client_secret': client_secret
            }
        )
        return response.json()['access_token']
    
    def create_tac_case(
        self,
        severity: int,
        title: str,
        description: str,
        product_id: str,
        serial_number: str
    ) -> Dict:
        """Create Cisco TAC case"""
        
        case_data = {
            'title': title,
            'description': description,
            'severity': severity,
            'productId': product_id,
            'serialNumber': serial_number,
            'problemDescription': description,
            'technologyGroup': 'Enterprise Networking',
            'technology': 'SD-WAN',
            'subTechnology': 'Cisco Catalyst SD-WAN'
        }
        
        headers = {
            'Authorization': f'Bearer {self.token}',
            'Content-Type': 'application/json'
        }
        
        response = requests.post(
            self.api_url,
            headers=headers,
            json=case_data
        )
        
        return response.json()
    
    def upload_admin_tech(self, case_id: str, file_path: str):
        """Upload admin-tech to TAC case"""
        upload_url = f"{self.api_url}/{case_id}/attachments"
        
        headers = {
            'Authorization': f'Bearer {self.token}'
        }
        
        with open(file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(
                upload_url,
                headers=headers,
                files=files
            )
        
        return response.status_code == 200


# TAC case information template
tac_case_template = """
CISCO TAC CASE INFORMATION
==========================

Environment Details:
- Organization: Abhavtech.com
- Contract: CCO-XXXXXXXX
- SD-WAN Manager Version: 20.15.x
- WAN Edge IOS-XE Version: 17.15.x
- Deployment: Multi-region (9 sites)

Affected Device(s):
- Device Type: [vManage/vSmart/vBond/WAN Edge]
- System IP: [X.X.X.X]
- Serial Number: [XXXXXX]
- Site: [Site Name]

Problem Description:
[Detailed description of the issue]

Symptoms:
[List of observed symptoms]

Timeline:
- Issue first observed: [Date/Time]
- Impact started: [Date/Time]
- Current state: [Ongoing/Intermittent/Resolved]

Troubleshooting Performed:
1. [Step 1 and result]
2. [Step 2 and result]
3. [Step 3 and result]

Attachments:
- admin-tech from affected device
- vManage support bundle
- Relevant show command outputs
- Topology diagram

Contact Information:
- Primary: [Name] - [Phone] - [Email]
- Alternate: [Name] - [Phone] - [Email]

Bridge Line: [Number and PIN if available]
"""
```

## Communication Management

### Stakeholder Notification Matrix

| Severity | Internal Stakeholders | External Stakeholders | Frequency |
|----------|----------------------|----------------------|-----------|
| SEV-1 | IT Leadership, Business Owners, All IT Staff | Vendors, Customers (if impacted) | Every 15 min |
| SEV-2 | IT Management, Affected Team Leads | Vendors (if engaged) | Every 30 min |
| SEV-3 | Team Lead, Affected Users | N/A | Every 2 hours |
| SEV-4 | Assigned Engineer | N/A | On completion |

### Communication Templates

```markdown
# SEV-1 Initial Notification

Subject: [INCIDENT] SEV-1 - SD-WAN [Brief Description]

Priority: CRITICAL
Status: INVESTIGATING

Incident Summary:
- Incident ID: INC-SDWAN-2025-XXXX
- Start Time: [Time] IST
- Affected: [Sites/Services/Users]
- Impact: [Business Impact Description]

Current Status:
We are actively investigating a critical SD-WAN incident affecting 
[description]. Our Network Operations team has been engaged and is 
working to restore service.

Business Impact:
- [Impact 1]
- [Impact 2]

Actions in Progress:
- Bridge call established
- Engineering team engaged
- Vendor escalation [initiated/pending]

Next Update: [Time] IST (15 minutes)

Incident Bridge:
- Dial-in: +91-XXXX-XXXXXX
- PIN: 123456

For questions, contact: incident-manager@abhavtech.com
```

```markdown
# SEV-1 Resolution Notification

Subject: [RESOLVED] SEV-1 - SD-WAN [Brief Description]

Priority: INFORMATIONAL
Status: RESOLVED

Resolution Summary:
- Incident ID: INC-SDWAN-2025-XXXX
- Start Time: [Start Time] IST
- End Time: [End Time] IST
- Duration: [X hours Y minutes]
- Impact: [Summary of business impact]

Root Cause:
[Brief description of what caused the incident]

Resolution:
[Description of how the incident was resolved]

Prevention Measures:
[Actions being taken to prevent recurrence]

Post-Incident Review:
A PIR meeting will be held on [Date/Time] to review this incident.
Stakeholders will be invited separately.

Service Status:
All SD-WAN services have been restored to normal operation.

For questions, contact: network-ops@abhavtech.com
```

## Incident Metrics and Reporting

### Key Performance Indicators

| KPI | Target | Measurement |
|-----|--------|-------------|
| MTTA (Mean Time to Acknowledge) | <15 min (SEV-1) | Time from alert to acknowledgment |
| MTTD (Mean Time to Diagnose) | <30 min (SEV-1) | Time from ack to root cause |
| MTTR (Mean Time to Resolve) | <2 hours (SEV-1) | Time from alert to resolution |
| First Call Resolution | >60% | Resolved at L1 without escalation |
| SLA Achievement | >95% | Resolved within target time |
| Recurring Incidents | <10% | Same root cause within 30 days |

### Incident Dashboard

```python
#!/usr/bin/env python3
"""
Incident Metrics Dashboard
Real-time incident management metrics
"""

from datetime import datetime, timedelta
from typing import Dict, List
import statistics

class IncidentMetricsDashboard:
    def __init__(self, incidents: List[Dict]):
        self.incidents = incidents
    
    def calculate_mtta(self, severity: str = None) -> float:
        """Calculate Mean Time to Acknowledge"""
        filtered = self._filter_by_severity(severity)
        
        tta_values = []
        for inc in filtered:
            if inc.get('acknowledged_at') and inc.get('created_at'):
                created = datetime.fromisoformat(inc['created_at'])
                acked = datetime.fromisoformat(inc['acknowledged_at'])
                tta_values.append((acked - created).total_seconds() / 60)
        
        return statistics.mean(tta_values) if tta_values else 0
    
    def calculate_mttd(self, severity: str = None) -> float:
        """Calculate Mean Time to Diagnose"""
        filtered = self._filter_by_severity(severity)
        
        ttd_values = []
        for inc in filtered:
            if inc.get('diagnosed_at') and inc.get('acknowledged_at'):
                acked = datetime.fromisoformat(inc['acknowledged_at'])
                diagnosed = datetime.fromisoformat(inc['diagnosed_at'])
                ttd_values.append((diagnosed - acked).total_seconds() / 60)
        
        return statistics.mean(ttd_values) if ttd_values else 0
    
    def calculate_mttr(self, severity: str = None) -> float:
        """Calculate Mean Time to Resolve"""
        filtered = self._filter_by_severity(severity)
        
        ttr_values = []
        for inc in filtered:
            if inc.get('resolved_at') and inc.get('created_at'):
                created = datetime.fromisoformat(inc['created_at'])
                resolved = datetime.fromisoformat(inc['resolved_at'])
                ttr_values.append((resolved - created).total_seconds() / 60)
        
        return statistics.mean(ttr_values) if ttr_values else 0
    
    def calculate_sla_achievement(self, severity: str = None) -> float:
        """Calculate SLA achievement percentage"""
        filtered = self._filter_by_severity(severity)
        
        sla_targets = {
            'SEV-1': 120,   # 2 hours
            'SEV-2': 240,   # 4 hours
            'SEV-3': 480,   # 8 hours
            'SEV-4': 1440,  # 24 hours
        }
        
        within_sla = 0
        total = 0
        
        for inc in filtered:
            if inc.get('resolved_at') and inc.get('created_at'):
                sev = inc.get('severity', 'SEV-3')
                target = sla_targets.get(sev, 480)
                
                created = datetime.fromisoformat(inc['created_at'])
                resolved = datetime.fromisoformat(inc['resolved_at'])
                resolution_time = (resolved - created).total_seconds() / 60
                
                total += 1
                if resolution_time <= target:
                    within_sla += 1
        
        return (within_sla / total * 100) if total > 0 else 100
    
    def _filter_by_severity(self, severity: str = None) -> List[Dict]:
        """Filter incidents by severity"""
        if severity:
            return [i for i in self.incidents if i.get('severity') == severity]
        return self.incidents
    
    def generate_report(self, period_days: int = 30) -> str:
        """Generate incident metrics report"""
        
        # Filter to period
        cutoff = datetime.now() - timedelta(days=period_days)
        period_incidents = [
            i for i in self.incidents
            if datetime.fromisoformat(i.get('created_at', '2000-01-01')) > cutoff
        ]
        
        # Severity counts
        sev_counts = {}
        for inc in period_incidents:
            sev = inc.get('severity', 'Unknown')
            sev_counts[sev] = sev_counts.get(sev, 0) + 1
        
        report = f"""
INCIDENT MANAGEMENT METRICS REPORT
==================================
Period: Last {period_days} days
Generated: {datetime.now().isoformat()}

VOLUME SUMMARY
--------------
Total Incidents: {len(period_incidents)}
By Severity:
"""
        for sev in ['SEV-1', 'SEV-2', 'SEV-3', 'SEV-4']:
            count = sev_counts.get(sev, 0)
            report += f"  {sev}: {count}\n"
        
        report += f"""
PERFORMANCE METRICS
-------------------
                    SEV-1      SEV-2      SEV-3      Overall
MTTA (minutes):     {self.calculate_mtta('SEV-1'):.1f}       {self.calculate_mtta('SEV-2'):.1f}       {self.calculate_mtta('SEV-3'):.1f}       {self.calculate_mtta():.1f}
MTTD (minutes):     {self.calculate_mttd('SEV-1'):.1f}       {self.calculate_mttd('SEV-2'):.1f}       {self.calculate_mttd('SEV-3'):.1f}       {self.calculate_mttd():.1f}
MTTR (minutes):     {self.calculate_mttr('SEV-1'):.1f}      {self.calculate_mttr('SEV-2'):.1f}      {self.calculate_mttr('SEV-3'):.1f}      {self.calculate_mttr():.1f}

SLA ACHIEVEMENT
---------------
Overall SLA Achievement: {self.calculate_sla_achievement():.1f}%
SEV-1 SLA (2 hours): {self.calculate_sla_achievement('SEV-1'):.1f}%
SEV-2 SLA (4 hours): {self.calculate_sla_achievement('SEV-2'):.1f}%
SEV-3 SLA (8 hours): {self.calculate_sla_achievement('SEV-3'):.1f}%

TARGET COMPARISON
-----------------
"""
        # Add target comparisons
        targets = {'MTTA': 15, 'MTTD': 30, 'MTTR': 120, 'SLA': 95}
        actuals = {
            'MTTA': self.calculate_mtta('SEV-1'),
            'MTTD': self.calculate_mttd('SEV-1'),
            'MTTR': self.calculate_mttr('SEV-1'),
            'SLA': self.calculate_sla_achievement()
        }
        
        for metric, target in targets.items():
            actual = actuals[metric]
            status = "✓ ON TARGET" if (actual <= target if metric != 'SLA' else actual >= target) else "✗ MISS"
            report += f"{metric}: {actual:.1f} (Target: {target}) {status}\n"
        
        return report


# Example usage
if __name__ == "__main__":
    # Sample incident data
    sample_incidents = [
        {
            'id': 'INC-001',
            'severity': 'SEV-1',
            'created_at': '2025-01-01T10:00:00',
            'acknowledged_at': '2025-01-01T10:10:00',
            'diagnosed_at': '2025-01-01T10:30:00',
            'resolved_at': '2025-01-01T11:30:00'
        },
        {
            'id': 'INC-002',
            'severity': 'SEV-2',
            'created_at': '2025-01-02T14:00:00',
            'acknowledged_at': '2025-01-02T14:20:00',
            'diagnosed_at': '2025-01-02T15:00:00',
            'resolved_at': '2025-01-02T17:00:00'
        },
    ]
    
    dashboard = IncidentMetricsDashboard(sample_incidents)
    print(dashboard.generate_report(30))
```

## Quick Reference

### Incident Response Cheat Sheet

```
+------------------------------------------------------------------+
|                 INCIDENT RESPONSE QUICK REFERENCE                 |
+------------------------------------------------------------------+
|                                                                    |
|  SEV-1 CRITICAL                                                   |
|  --------------                                                   |
|  Response: 15 min | Resolution: 2 hours                           |
|  1. Acknowledge immediately                                       |
|  2. Open bridge call                                              |
|  3. Notify management                                             |
|  4. Engage L3 engineering                                         |
|  5. Updates every 15 minutes                                      |
|                                                                    |
|  SEV-2 HIGH                                                       |
|  ---------                                                        |
|  Response: 30 min | Resolution: 4 hours                           |
|  1. Acknowledge and triage                                        |
|  2. Assign to L2 engineer                                         |
|  3. Begin diagnosis                                               |
|  4. Updates every 30 minutes                                      |
|                                                                    |
|  SEV-3 MEDIUM                                                     |
|  -----------                                                      |
|  Response: 2 hours | Resolution: 8 hours                          |
|  1. Acknowledge within 2 hours                                    |
|  2. Assign to available engineer                                  |
|  3. Schedule resolution                                           |
|  4. Updates every 2 hours                                         |
|                                                                    |
|  SEV-4 LOW                                                        |
|  --------                                                         |
|  Response: 8 hours | Resolution: 24 hours                         |
|  1. Acknowledge within business day                               |
|  2. Add to work queue                                             |
|  3. Resolve as scheduled                                          |
|                                                                    |
+------------------------------------------------------------------+
|                                                                    |
|  ESCALATION CONTACTS                                              |
|  -------------------                                              |
|  L1 NOC: noc@abhavtech.com                                        |
|  L2 Engineering: neteng@abhavtech.com                             |
|  L3 Senior: senior-neteng@abhavtech.com                           |
|  Network Manager: +91-XXXX-XXXXXX                                 |
|  Cisco TAC: 1-800-553-2447                                        |
|                                                                    |
|  BRIDGE INFORMATION                                               |
|  -----------------                                                |
|  Dial: +91-XXXX-XXXXXX                                            |
|  PIN: 123456                                                      |
|  Slack: #incident-sdwan                                           |
|                                                                    |
+------------------------------------------------------------------+
```

---

*Document version: 1.0*
*Last updated: December 2025*
*Classification: Internal Use*
