# 6.4 Alerting Configuration

## Document Information

| Field | Value |
|-------|-------|
| Document Title | Alerting Configuration |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Abhavtech |
| Classification | Internal Use |
| Target Audience | Network Operations, NOC |

---

## Overview

This section details the alerting configuration for the Abhavtech SD-WAN infrastructure, including alarm definitions, notification channels, and escalation procedures.

### Alerting Architecture

```
ALERTING FLOW
=============

┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Event     │───►│   Filter    │───►│  Correlate  │───►│  Notify     │
│  Detection  │    │   & Enrich  │    │  & Dedupe   │    │  & Escalate │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
      │                   │                  │                  │
      ▼                   ▼                  ▼                  ▼
 • vManage         • Add context       • Suppress        • Email
 • SNMP Traps      • Severity map      • Correlate       • Slack
 • Syslog          • Device info       • Root cause      • PagerDuty
 • BFD             • Site info         • Incident        • ServiceNow
```

---

## vManage Alarm Configuration

### Alarm Categories

| Category | Description | Default Severity |
|----------|-------------|------------------|
| System | Device health | Warning-Critical |
| Control | Control plane events | Warning-Critical |
| OMP | Overlay routing | Warning-Major |
| BFD | Path detection | Major-Critical |
| Security | Security events | Warning-Critical |
| Interface | Interface events | Warning-Major |
| Tunnel | IPsec tunnel events | Major-Critical |
| App-route | Application routing | Warning-Major |
| Policy | Policy violations | Warning |

### Critical Alarms

| Alarm Type | Severity | Description | Response Time |
|------------|----------|-------------|---------------|
| Device Unreachable | Critical | Device offline | 15 min |
| Cluster Node Down | Critical | vManage node failure | 15 min |
| All Tunnels Down | Critical | Complete site isolation | 15 min |
| Certificate Expired | Critical | Security compromise | Immediate |
| Control Connection Lost | Critical | Control plane failure | 15 min |
| Security Breach | Critical | Threat detected | Immediate |

### Alarm Rule Configuration

```
VMANAGE ALARM RULES
===================

Rule: Device Unreachable Alert
├── Trigger: Device reachability = "unreachable"
├── Severity: Critical
├── Notification: Email + PagerDuty
├── Suppress: 2 minutes
└── Clear: Auto-clear when reachable

Rule: High CPU Alert
├── Trigger: CPU > 80% for 5 minutes
├── Severity: Warning
├── Notification: Email + Slack
├── Suppress: 10 minutes
└── Clear: CPU < 70% for 5 minutes

Rule: Tunnel Down Alert
├── Trigger: Tunnel state = "down"
├── Severity: Major
├── Notification: Email + Slack
├── Suppress: 1 minute
└── Clear: Auto-clear when up

Rule: Certificate Expiry Warning
├── Trigger: Days remaining < 30
├── Severity: Warning
├── Notification: Email
├── Suppress: Daily
└── Clear: Certificate renewed
```

### vManage Alert API Configuration

```python
#!/usr/bin/env python3
"""Configure vManage Alarm Rules via API"""

import requests
import json
import urllib3
urllib3.disable_warnings()

class AlarmConfiguration:
    """Configure SD-WAN alerting"""
    
    def __init__(self, vmanage_ip, username, password):
        self.vmanage = vmanage_ip
        self.session = requests.Session()
        self.authenticate(username, password)
    
    def authenticate(self, username, password):
        auth_url = f"https://{self.vmanage}/j_security_check"
        self.session.post(auth_url,
                         data={"j_username": username, "j_password": password},
                         verify=False)
        token_url = f"https://{self.vmanage}/dataservice/client/token"
        token_resp = self.session.get(token_url, verify=False)
        self.session.headers["X-XSRF-TOKEN"] = token_resp.text
    
    def get_alarm_rules(self):
        """Get current alarm rules"""
        url = f"https://{self.vmanage}/dataservice/alarms/rules"
        resp = self.session.get(url, verify=False)
        return resp.json().get("data", [])
    
    def create_custom_alarm_rule(self, rule_config):
        """Create custom alarm rule"""
        url = f"https://{self.vmanage}/dataservice/alarms/rules"
        resp = self.session.post(url, json=rule_config, verify=False)
        return resp.json()
    
    def configure_email_notification(self, email_config):
        """Configure email notifications"""
        url = f"https://{self.vmanage}/dataservice/settings/configuration/emailsettings"
        
        payload = {
            "smtpServer": email_config["smtp_server"],
            "smtpPort": email_config["smtp_port"],
            "smtpAuth": email_config["smtp_auth"],
            "smtpUsername": email_config.get("username", ""),
            "smtpPassword": email_config.get("password", ""),
            "smtpTls": email_config["tls_enabled"],
            "fromAddress": email_config["from_address"]
        }
        
        resp = self.session.put(url, json=payload, verify=False)
        return resp.status_code == 200
    
    def configure_webhook(self, webhook_config):
        """Configure webhook notifications"""
        url = f"https://{self.vmanage}/dataservice/settings/configuration/webhook"
        
        payload = {
            "webhookServerUrl": webhook_config["url"],
            "webhookUsername": webhook_config.get("username", ""),
            "webhookPassword": webhook_config.get("password", ""),
            "enableWebhook": True
        }
        
        resp = self.session.put(url, json=payload, verify=False)
        return resp.status_code == 200


# Example usage
if __name__ == "__main__":
    config = AlarmConfiguration(
        vmanage_ip="10.255.0.10",
        username="admin",
        password="admin123"
    )
    
    # Configure email
    email_config = {
        "smtp_server": "smtp.abhavtech.com",
        "smtp_port": 587,
        "smtp_auth": True,
        "username": "alerts@abhavtech.com",
        "password": "email_password",
        "tls_enabled": True,
        "from_address": "sdwan-alerts@abhavtech.com"
    }
    config.configure_email_notification(email_config)
    
    # Configure webhook for Slack/PagerDuty
    webhook_config = {
        "url": "https://hooks.slack.com/services/xxx/yyy/zzz"
    }
    config.configure_webhook(webhook_config)
```

---

## Notification Channels

### Email Configuration

| Setting | Value |
|---------|-------|
| SMTP Server | smtp.abhavtech.com |
| SMTP Port | 587 |
| TLS | Enabled |
| From Address | sdwan-alerts@abhavtech.com |
| Authentication | Username/Password |

### Email Distribution Lists

| List | Recipients | Alert Types |
|------|------------|-------------|
| sdwan-critical@abhavtech.com | NOC, On-Call, Manager | P1, P2 |
| sdwan-ops@abhavtech.com | NOC, L2 Engineers | All |
| sdwan-security@abhavtech.com | Security Team | Security events |
| sdwan-mgmt@abhavtech.com | IT Management | P1, Weekly summary |

### Slack Integration

```yaml
# Slack Webhook Configuration
channels:
  - name: "#sdwan-critical"
    webhook: "https://hooks.slack.com/services/T.../B.../xxx"
    alerts:
      - severity: Critical
      - severity: Major (P1)
    format: extended
    
  - name: "#sdwan-alerts"
    webhook: "https://hooks.slack.com/services/T.../B.../yyy"
    alerts:
      - severity: Warning
      - severity: Minor
    format: compact
    
  - name: "#sdwan-ops"
    webhook: "https://hooks.slack.com/services/T.../B.../zzz"
    alerts:
      - all non-critical
    format: standard

message_template: |
  :rotating_light: *SD-WAN Alert*
  *Severity:* {{ severity }}
  *Device:* {{ hostname }} ({{ system_ip }})
  *Type:* {{ alarm_type }}
  *Message:* {{ message }}
  *Time:* {{ timestamp }}
  <{{ vmanage_url }}|View in vManage>
```

### PagerDuty Integration

```yaml
# PagerDuty Configuration
pagerduty:
  integration_key: "YOUR_PAGERDUTY_INTEGRATION_KEY"
  
  services:
    - name: "SD-WAN Critical"
      routing_key: "R0_CRITICAL_xxx"
      severity_map:
        Critical: critical
        Major: error
      
    - name: "SD-WAN Operations"
      routing_key: "R0_OPS_yyy"
      severity_map:
        Warning: warning
        Minor: info

  escalation_policy: "SD-WAN On-Call"
  
  schedules:
    - name: "Primary On-Call"
      rotation: weekly
      
    - name: "Secondary On-Call"
      rotation: weekly
      delay: 15  # minutes
```

### ServiceNow Integration

```python
#!/usr/bin/env python3
"""ServiceNow Ticket Creation"""

import requests
import json
from datetime import datetime

class ServiceNowIntegration:
    """Create ServiceNow incidents from SD-WAN alerts"""
    
    def __init__(self, instance, username, password):
        self.base_url = f"https://{instance}.service-now.com"
        self.auth = (username, password)
        self.headers = {
            "Content-Type": "application/json",
            "Accept": "application/json"
        }
    
    def create_incident(self, alert):
        """Create incident from SD-WAN alert"""
        
        # Map severity to impact/urgency
        severity_map = {
            "Critical": {"impact": "1", "urgency": "1"},
            "Major": {"impact": "2", "urgency": "2"},
            "Warning": {"impact": "3", "urgency": "3"},
            "Minor": {"impact": "3", "urgency": "3"}
        }
        
        sev = severity_map.get(alert["severity"], {"impact": "3", "urgency": "3"})
        
        payload = {
            "short_description": f"SD-WAN: {alert['type']} on {alert['hostname']}",
            "description": f"""
SD-WAN Alert Details:
- Device: {alert['hostname']} ({alert['system_ip']})
- Site: {alert.get('site', 'Unknown')}
- Alert Type: {alert['type']}
- Severity: {alert['severity']}
- Message: {alert['message']}
- Time: {alert['timestamp']}
- vManage Link: {alert.get('url', 'N/A')}
            """,
            "impact": sev["impact"],
            "urgency": sev["urgency"],
            "category": "Network",
            "subcategory": "SD-WAN",
            "assignment_group": "Network Operations",
            "caller_id": "sdwan_monitor",
            "cmdb_ci": alert['hostname']
        }
        
        url = f"{self.base_url}/api/now/table/incident"
        resp = requests.post(url, auth=self.auth, 
                            headers=self.headers, 
                            json=payload)
        
        if resp.status_code == 201:
            return resp.json()["result"]["number"]
        return None
    
    def update_incident(self, incident_number, update):
        """Update existing incident"""
        url = f"{self.base_url}/api/now/table/incident"
        query = f"?sysparm_query=number={incident_number}"
        
        resp = requests.get(url + query, auth=self.auth, headers=self.headers)
        if resp.status_code == 200 and resp.json()["result"]:
            sys_id = resp.json()["result"][0]["sys_id"]
            update_url = f"{self.base_url}/api/now/table/incident/{sys_id}"
            requests.patch(update_url, auth=self.auth, 
                          headers=self.headers, json=update)
    
    def resolve_incident(self, incident_number, resolution):
        """Resolve incident when alert clears"""
        self.update_incident(incident_number, {
            "state": "6",  # Resolved
            "close_code": "Resolved",
            "close_notes": resolution
        })
```

---

## Alert Suppression & Correlation

### Suppression Rules

| Rule | Condition | Duration | Purpose |
|------|-----------|----------|---------|
| Flapping Suppression | Same alert < 5 min | 5 min | Prevent noise |
| Maintenance Window | During scheduled window | Variable | Planned work |
| Dependency Suppression | Upstream device down | Until clear | Root cause only |
| Batch Suppression | > 10 same alerts | 15 min | Mass event |

### Correlation Rules

```yaml
# Alert Correlation Configuration
correlation_rules:
  - name: "Site Outage"
    description: "Correlate multiple device alerts at same site"
    conditions:
      - alert_type: "Device Unreachable"
      - same_site: true
      - count: >= 2
      - timeframe: 5 minutes
    action:
      - create_parent: "Site Outage - {{ site_name }}"
      - severity: Critical
      - suppress_children: true
  
  - name: "Transport Failure"
    description: "Correlate tunnel downs on same transport"
    conditions:
      - alert_type: "Tunnel Down"
      - same_color: true
      - count: >= 3
      - timeframe: 2 minutes
    action:
      - create_parent: "Transport Failure - {{ color }}"
      - severity: Major
      - notify: transport-team@abhavtech.com
  
  - name: "Controller Impact"
    description: "Multiple devices losing control connection"
    conditions:
      - alert_type: "Control Connection Lost"
      - count: >= 5
      - timeframe: 2 minutes
    action:
      - create_parent: "Controller Health Issue"
      - severity: Critical
      - escalate: L3
```

---

## Escalation Procedures

### Escalation Matrix

```
ESCALATION TIMELINE
===================

P1 - Critical:
├── 0 min:  Alert generated
├── 5 min:  NOC acknowledgment required
├── 15 min: L2 engagement if not acknowledged
├── 30 min: L3 engagement if not resolved
├── 60 min: Management notification
├── 2 hrs:  Director notification
└── 4 hrs:  Executive notification

P2 - High:
├── 0 min:  Alert generated
├── 15 min: NOC acknowledgment required
├── 30 min: L2 engagement if not acknowledged
├── 2 hrs:  L3 engagement if not resolved
├── 4 hrs:  Management notification
└── 8 hrs:  Director notification

P3 - Medium:
├── 0 min:  Alert generated
├── 30 min: Acknowledgment required
├── 4 hrs:  Escalate if not addressed
└── 24 hrs: Manager review

P4 - Low:
├── 0 min:  Alert generated
├── 4 hrs:  Review required
└── 72 hrs: Resolution target
```

### On-Call Schedule

| Week | Primary | Secondary | Manager |
|------|---------|-----------|---------|
| 1 | Engineer A | Engineer B | Manager X |
| 2 | Engineer B | Engineer C | Manager X |
| 3 | Engineer C | Engineer D | Manager X |
| 4 | Engineer D | Engineer A | Manager X |

---

## Alert Templates

### Email Alert Template

```html
Subject: [{{ severity }}] SD-WAN Alert: {{ type }} on {{ hostname }}

<html>
<body style="font-family: Arial, sans-serif;">
  <div style="background-color: {{ severity_color }}; padding: 10px; color: white;">
    <h2>SD-WAN Alert - {{ severity }}</h2>
  </div>
  
  <div style="padding: 15px;">
    <table style="border-collapse: collapse; width: 100%;">
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Device</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">{{ hostname }} ({{ system_ip }})</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Site</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">{{ site_name }}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Alert Type</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">{{ type }}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Message</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">{{ message }}</td>
      </tr>
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;"><strong>Time</strong></td>
        <td style="padding: 8px; border: 1px solid #ddd;">{{ timestamp }}</td>
      </tr>
    </table>
    
    <p style="margin-top: 15px;">
      <a href="{{ vmanage_url }}" style="background-color: #0066cc; color: white; 
         padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        View in vManage
      </a>
    </p>
  </div>
  
  <div style="background-color: #f5f5f5; padding: 10px; font-size: 12px;">
    This is an automated alert from the Abhavtech SD-WAN monitoring system.
    Do not reply to this email.
  </div>
</body>
</html>
```

---

## Related Documentation

| Document | Description | Location |
|----------|-------------|----------|
| Monitoring Framework | Monitoring design | Section 6.3 |
| Troubleshooting Guide | Issue resolution | Section 6.8 |
| Operations Runbooks | Response procedures | Section 6.13 |
| HA Failover Procedures | Failover handling | Section 6.14 |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech | Initial release |

---

*This document is part of the SD-WAN Operations & Monitoring documentation series for Abhavtech.com*
