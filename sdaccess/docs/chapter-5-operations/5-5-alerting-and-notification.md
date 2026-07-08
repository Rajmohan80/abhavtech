# 5.5 Alerting and Notification

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
