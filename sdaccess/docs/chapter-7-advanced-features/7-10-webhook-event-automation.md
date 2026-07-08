# 7.10 Webhook and Event-Driven Automation

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. Event-Driven Architecture Overview

### 1.1 Abhavtech Event Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Event-Driven Automation Architecture              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  EVENT SOURCES                    EVENT PROCESSOR        ACTIONS    │
│  ┌─────────────┐                 ┌─────────────┐                   │
│  │  Catalyst   │ ──Webhook────►  │             │  ───► ServiceNow  │
│  │   Center    │                 │   Event     │  ───► PagerDuty   │
│  └─────────────┘                 │   Handler   │  ───► Slack       │
│  ┌─────────────┐                 │  (Python)   │  ───► ISE CoA     │
│  │    ISE      │ ──pxGrid─────►  │             │  ───► Custom API  │
│  │  (pxGrid)   │                 │             │                   │
│  └─────────────┘                 └─────────────┘                   │
│  ┌─────────────┐                       │                           │
│  │   Splunk    │ ──Alert───────────────┘                           │
│  │             │                                                    │
│  └─────────────┘                                                    │
│                                                                     │
│  Event Handler Server: webhook.abhavtech.com (10.250.10.101)       │
│  Port: 5000 (Flask) / 8443 (pxGrid)                                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Event Types

| Source | Event Type | Trigger | Use Case |
|--------|------------|---------|----------|
| Catalyst Center | Network Issue | Device down, link failure | Auto-ticket creation |
| Catalyst Center | Security Alert | Rogue AP, unauthorized device | SOC notification |
| Catalyst Center | Assurance | SLA breach, poor client experience | Escalation |
| ISE pxGrid | Session | New connection, disconnect | Asset tracking |
| ISE pxGrid | Threat | TrustSec violation, posture failure | Automated response |
| Splunk | Correlation | Multiple failed auths, anomaly | Security response |

---

## 2. Catalyst Center Webhook Configuration

### 2.1 Configure Webhook Destination

```
Catalyst Center → System → Settings → External Services → Destinations

Add Destination:
  Name: Abhavtech-Webhook-Handler
  Type: REST Webhook Endpoint
  URL: https://webhook.abhavtech.com:5000/api/v1/dnac/events
  Method: POST
  Trust Certificate: Yes
  
  Headers:
    X-API-Key: <webhook-api-key>
    Content-Type: application/json
    
  Authentication:
    Type: None (using API key in header)
```

### 2.2 Configure Event Subscriptions

```
Catalyst Center → Platform → Developer Toolkit → Event Subscriptions

Create Subscription:
  Name: Network-Issues-Webhook
  Description: Send network issues to automation handler
  
  Event Types:
    ☑ NETWORK-DEVICES-1-1 (Device unreachable)
    ☑ NETWORK-DEVICES-1-2 (Device reachable)
    ☑ NETWORK-1-1 (Network device error)
    ☑ AP-1-1 (Access Point issues)
    ☑ SECURITY-1-1 (Security events)
    
  Destination: Abhavtech-Webhook-Handler
  
  Filter:
    Severity: WARNING, ERROR, CRITICAL
    Category: All
```

### 2.3 Sample Webhook Payload (Catalyst Center)

```json
{
  "version": "1.0.0",
  "instanceId": "ea05bd0e-1a2b-3c4d-5e6f-7a8b9c0d1e2f",
  "eventId": "NETWORK-DEVICES-1-1",
  "namespace": "ASSURANCE",
  "name": "Device Unreachable",
  "description": "Network device is unreachable",
  "type": "NETWORK",
  "category": "ERROR",
  "severity": "CRITICAL",
  "timestamp": 1703750400000,
  "domain": "Connectivity",
  "subDomain": "Device Reachability",
  "source": "catalyst.abhavtech.com",
  "details": {
    "deviceId": "abc123-device-uuid",
    "deviceName": "MUM-ED-05",
    "deviceIp": "10.100.1.15",
    "deviceFamily": "Switches and Hubs",
    "siteId": "site-uuid-123",
    "siteName": "Global/India/Mumbai",
    "lastContact": "2025-12-28T10:15:00Z"
  }
}
```

---

## 3. ISE pxGrid Integration

### 3.1 pxGrid Overview

```
pxGrid (Platform Exchange Grid):
├── Publish/Subscribe messaging
├── Real-time event streaming
├── Certificate-based authentication
├── WebSocket transport
└── Topics: Session, TrustSec, Profiler, ANC, MDM, etc.
```

### 3.2 pxGrid Client Configuration

```python
#!/usr/bin/env python3
"""
pxGrid Session Subscriber
/opt/abhavtech/automation/pxgrid_subscriber.py
"""

import ssl
import json
import websocket
from base64 import b64encode
import threading

class PxGridSubscriber:
    def __init__(self):
        self.pxgrid_host = "ise-pan.abhavtech.com"
        self.client_cert = "/opt/abhavtech/certs/pxgrid-client.pem"
        self.client_key = "/opt/abhavtech/certs/pxgrid-client.key"
        self.ca_cert = "/opt/abhavtech/certs/ise-ca.pem"
        self.node_name = "abhavtech-automation"
        
    def get_ssl_context(self):
        """Create SSL context with client certificate"""
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_CLIENT)
        context.load_cert_chain(self.client_cert, self.client_key)
        context.load_verify_locations(self.ca_cert)
        context.verify_mode = ssl.CERT_REQUIRED
        return context
    
    def subscribe_to_sessions(self, callback):
        """Subscribe to session topic"""
        ws_url = f"wss://{self.pxgrid_host}:8910/pxgrid/ise/pubsub"
        
        def on_message(ws, message):
            data = json.loads(message)
            callback(data)
        
        def on_error(ws, error):
            print(f"WebSocket error: {error}")
        
        def on_close(ws, close_status, close_msg):
            print("WebSocket closed")
        
        def on_open(ws):
            # Subscribe to session topic
            subscribe_msg = {
                "subscribe": {
                    "name": "sessionTopic"
                }
            }
            ws.send(json.dumps(subscribe_msg))
            print("Subscribed to session topic")
        
        ws = websocket.WebSocketApp(
            ws_url,
            on_message=on_message,
            on_error=on_error,
            on_close=on_close,
            on_open=on_open
        )
        
        ws.run_forever(sslopt={"context": self.get_ssl_context()})

def handle_session_event(event):
    """Process session events"""
    event_type = event.get('type')
    
    if event_type == 'SESSION_CONNECTED':
        print(f"New session: {event.get('macAddress')} - {event.get('userName')}")
        # Trigger downstream actions
        
    elif event_type == 'SESSION_DISCONNECTED':
        print(f"Session ended: {event.get('macAddress')}")
        
    elif event_type == 'SESSION_TOPIC_UPDATE':
        print(f"Session updated: {event.get('macAddress')}")

# Main
if __name__ == "__main__":
    subscriber = PxGridSubscriber()
    subscriber.subscribe_to_sessions(handle_session_event)
```

### 3.3 pxGrid Topics

| Topic | Description | Events |
|-------|-------------|--------|
| sessionTopic | Endpoint sessions | Connect, disconnect, update |
| securityGroupTopic | TrustSec events | SGT assignment changes |
| profilerConfigTopic | Profiler updates | New profiles, policy changes |
| ancTopic | Adaptive Network Control | Quarantine, unquarantine |
| trustsecPolicyDownloadTopic | Policy updates | SGACL changes |

---

## 4. Webhook Handler Service

### 4.1 Flask Webhook Handler

```python
#!/usr/bin/env python3
"""
Event Handler Service
/opt/abhavtech/automation/webhook_handler.py

Run: gunicorn -w 4 -b 0.0.0.0:5000 webhook_handler:app
"""

from flask import Flask, request, jsonify
import json
import logging
from datetime import datetime
import os

# Import action handlers
from handlers.servicenow import create_incident
from handlers.pagerduty import send_alert
from handlers.slack import post_message
from handlers.ise_coa import quarantine_endpoint

app = Flask(__name__)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('/var/log/abhavtech/webhook.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# API Key validation
API_KEY = os.getenv('WEBHOOK_API_KEY')

def validate_api_key():
    """Validate API key from header"""
    key = request.headers.get('X-API-Key')
    return key == API_KEY

@app.route('/api/v1/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

@app.route('/api/v1/dnac/events', methods=['POST'])
def handle_dnac_event():
    """Handle Catalyst Center webhook events"""
    
    if not validate_api_key():
        logger.warning(f"Invalid API key from {request.remote_addr}")
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        event = request.json
        logger.info(f"Received DNAC event: {event.get('eventId')}")
        
        # Route event to appropriate handler
        event_id = event.get('eventId', '')
        severity = event.get('severity', 'INFO')
        
        # Device unreachable - Critical
        if event_id == 'NETWORK-DEVICES-1-1':
            handle_device_unreachable(event)
            
        # Security event
        elif event_id.startswith('SECURITY-'):
            handle_security_event(event)
            
        # AP issue
        elif event_id.startswith('AP-'):
            handle_ap_event(event)
            
        # Client experience issue
        elif event_id.startswith('CLIENT-'):
            handle_client_event(event)
        
        return jsonify({'status': 'processed', 'eventId': event_id}), 200
        
    except Exception as e:
        logger.error(f"Error processing event: {e}")
        return jsonify({'error': str(e)}), 500

def handle_device_unreachable(event):
    """Handle device unreachable events"""
    device_name = event.get('details', {}).get('deviceName')
    device_ip = event.get('details', {}).get('deviceIp')
    site_name = event.get('details', {}).get('siteName')
    
    logger.warning(f"Device unreachable: {device_name} ({device_ip}) at {site_name}")
    
    # Create ServiceNow incident
    incident = create_incident(
        short_description=f"Network Device Unreachable: {device_name}",
        description=f"""
Device: {device_name}
IP Address: {device_ip}
Site: {site_name}
Last Contact: {event.get('details', {}).get('lastContact')}
Event ID: {event.get('instanceId')}
        """,
        urgency='2',
        impact='2',
        category='Network',
        assignment_group='Network Operations'
    )
    logger.info(f"Created ServiceNow incident: {incident}")
    
    # Send PagerDuty alert if critical
    if event.get('severity') == 'CRITICAL':
        send_alert(
            summary=f"CRITICAL: {device_name} unreachable",
            severity='critical',
            source='Catalyst Center',
            component=device_name
        )
    
    # Post to Slack
    post_message(
        channel='#network-alerts',
        text=f"⚠️ Device Unreachable: *{device_name}* ({device_ip}) at {site_name}"
    )

def handle_security_event(event):
    """Handle security-related events"""
    event_name = event.get('name')
    details = event.get('details', {})
    
    logger.warning(f"Security event: {event_name}")
    
    # Rogue AP detected
    if 'rogue' in event_name.lower():
        post_message(
            channel='#security-alerts',
            text=f"🚨 Rogue AP Detected: {details.get('rogueApMac', 'Unknown')}"
        )
        
    # Unauthorized device
    elif 'unauthorized' in event_name.lower():
        mac = details.get('macAddress')
        if mac:
            # Quarantine the device
            quarantine_endpoint(mac, reason=event_name)
            post_message(
                channel='#security-alerts',
                text=f"🔒 Unauthorized device quarantined: {mac}"
            )

def handle_ap_event(event):
    """Handle Access Point events"""
    ap_name = event.get('details', {}).get('apName')
    issue = event.get('name')
    
    post_message(
        channel='#wireless-alerts',
        text=f"📡 AP Issue: *{ap_name}* - {issue}"
    )

def handle_client_event(event):
    """Handle client experience events"""
    # Log for analysis but don't alert unless threshold exceeded
    logger.info(f"Client event: {event.get('name')}")

@app.route('/api/v1/ise/threat', methods=['POST'])
def handle_ise_threat():
    """Handle ISE threat events from pxGrid"""
    
    if not validate_api_key():
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        event = request.json
        mac = event.get('macAddress')
        threat = event.get('threatType')
        
        logger.warning(f"ISE Threat: {threat} for {mac}")
        
        # Auto-quarantine for high threats
        if event.get('threatLevel', 0) >= 8:
            quarantine_endpoint(mac, reason=f"Auto-quarantine: {threat}")
            
            # Alert SOC
            send_alert(
                summary=f"High threat endpoint quarantined: {mac}",
                severity='high',
                source='ISE pxGrid',
                component=mac
            )
        
        return jsonify({'status': 'processed'}), 200
        
    except Exception as e:
        logger.error(f"Error processing ISE threat: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/v1/splunk/alert', methods=['POST'])
def handle_splunk_alert():
    """Handle Splunk correlation alerts"""
    
    if not validate_api_key():
        return jsonify({'error': 'Unauthorized'}), 401
    
    try:
        alert = request.json
        alert_name = alert.get('search_name')
        results = alert.get('results', [])
        
        logger.info(f"Splunk alert: {alert_name} with {len(results)} results")
        
        # Brute force detection
        if 'brute_force' in alert_name.lower():
            for result in results:
                mac = result.get('mac_address')
                if mac:
                    quarantine_endpoint(mac, reason="Brute force attack detected")
        
        # Create incident for all Splunk alerts
        create_incident(
            short_description=f"Splunk Alert: {alert_name}",
            description=json.dumps(alert, indent=2),
            urgency='2',
            impact='2',
            category='Security',
            assignment_group='Security Operations'
        )
        
        return jsonify({'status': 'processed'}), 200
        
    except Exception as e:
        logger.error(f"Error processing Splunk alert: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
```

### 4.2 Action Handlers

```python
# /opt/abhavtech/automation/handlers/servicenow.py
"""ServiceNow Integration"""

import requests
import os

SNOW_INSTANCE = os.getenv('SNOW_INSTANCE', 'abhavtech.service-now.com')
SNOW_USER = os.getenv('SNOW_USER')
SNOW_PASS = os.getenv('SNOW_PASS')

def create_incident(short_description, description, urgency='3', impact='3',
                    category='Network', assignment_group='Network Operations'):
    """Create ServiceNow incident"""
    
    url = f"https://{SNOW_INSTANCE}/api/now/table/incident"
    
    payload = {
        'short_description': short_description,
        'description': description,
        'urgency': urgency,
        'impact': impact,
        'category': category,
        'assignment_group': assignment_group,
        'caller_id': 'automation-service'
    }
    
    response = requests.post(
        url,
        auth=(SNOW_USER, SNOW_PASS),
        headers={'Content-Type': 'application/json', 'Accept': 'application/json'},
        json=payload
    )
    
    if response.status_code == 201:
        return response.json().get('result', {}).get('number')
    else:
        raise Exception(f"Failed to create incident: {response.text}")
```

```python
# /opt/abhavtech/automation/handlers/slack.py
"""Slack Integration"""

import requests
import os

SLACK_WEBHOOK = os.getenv('SLACK_WEBHOOK_URL')

def post_message(channel, text, blocks=None):
    """Post message to Slack channel"""
    
    payload = {
        'channel': channel,
        'text': text
    }
    
    if blocks:
        payload['blocks'] = blocks
    
    response = requests.post(
        SLACK_WEBHOOK,
        json=payload,
        headers={'Content-Type': 'application/json'}
    )
    
    return response.status_code == 200
```

```python
# /opt/abhavtech/automation/handlers/ise_coa.py
"""ISE CoA Handler"""

import requests
import os

ISE_HOST = os.getenv('ISE_HOST', 'ise-pan.abhavtech.com')
ISE_USER = os.getenv('ISE_USER')
ISE_PASS = os.getenv('ISE_PASS')

def quarantine_endpoint(mac_address, reason="Automated quarantine"):
    """Quarantine endpoint via ISE ANC policy"""
    
    url = f"https://{ISE_HOST}:9060/ers/config/ancendpoint/apply"
    
    payload = {
        "OperationAdditionalData": {
            "additionalData": [
                {"name": "macAddress", "value": mac_address},
                {"name": "policyName", "value": "QUARANTINE"}
            ]
        }
    }
    
    response = requests.put(
        url,
        auth=(ISE_USER, ISE_PASS),
        headers={'Content-Type': 'application/json', 'Accept': 'application/json'},
        json=payload,
        verify=True
    )
    
    return response.status_code == 204
```

---

## 5. Systemd Service Configuration

### 5.1 Webhook Handler Service

```ini
# /etc/systemd/system/abhavtech-webhook.service

[Unit]
Description=Abhavtech Webhook Handler
After=network.target

[Service]
Type=exec
User=automation
Group=automation
WorkingDirectory=/opt/abhavtech/automation
Environment="PATH=/opt/abhavtech/automation/venv/bin"
EnvironmentFile=/opt/abhavtech/automation/.env
ExecStart=/opt/abhavtech/automation/venv/bin/gunicorn \
    --workers 4 \
    --bind 0.0.0.0:5000 \
    --access-logfile /var/log/abhavtech/webhook-access.log \
    --error-logfile /var/log/abhavtech/webhook-error.log \
    webhook_handler:app
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

### 5.2 pxGrid Subscriber Service

```ini
# /etc/systemd/system/abhavtech-pxgrid.service

[Unit]
Description=Abhavtech pxGrid Subscriber
After=network.target

[Service]
Type=simple
User=automation
Group=automation
WorkingDirectory=/opt/abhavtech/automation
Environment="PATH=/opt/abhavtech/automation/venv/bin"
EnvironmentFile=/opt/abhavtech/automation/.env
ExecStart=/opt/abhavtech/automation/venv/bin/python pxgrid_subscriber.py
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
```

### 5.3 Enable Services

```bash
# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable abhavtech-webhook
sudo systemctl enable abhavtech-pxgrid
sudo systemctl start abhavtech-webhook
sudo systemctl start abhavtech-pxgrid

# Check status
sudo systemctl status abhavtech-webhook
sudo systemctl status abhavtech-pxgrid
```

---

## 6. Event Flow Examples

### 6.1 Device Failure Flow

```yaml
Device_Failure_Workflow:
  
  1_Event_Source:
    System: Catalyst Center
    Event: NETWORK-DEVICES-1-1 (Device Unreachable)
    Trigger: Switch MUM-ED-05 stops responding
    
  2_Webhook_Delivery:
    Destination: webhook.abhavtech.com:5000/api/v1/dnac/events
    Payload: JSON with device details
    
  3_Event_Processing:
    Handler: handle_device_unreachable()
    Actions:
      - Log event
      - Create ServiceNow incident (INC0012345)
      - Send PagerDuty alert (if critical)
      - Post Slack message to #network-alerts
      
  4_Human_Response:
    NOC receives: PagerDuty notification + Slack message
    ServiceNow: Incident auto-created with details
    Action: Engineer investigates and resolves
    
  5_Resolution:
    Device recovers → NETWORK-DEVICES-1-2 event
    ServiceNow: Auto-update incident
    Slack: Resolution notification
```

### 6.2 Security Threat Flow

```yaml
Security_Threat_Workflow:
  
  1_Detection:
    System: ISE
    Event: Multiple failed authentications from same MAC
    Trigger: 10 failures in 5 minutes
    
  2_Correlation:
    System: Splunk
    Alert: "Brute Force Attack Detected"
    Contains: MAC address, source IP, failure count
    
  3_Webhook_Delivery:
    Destination: webhook.abhavtech.com:5000/api/v1/splunk/alert
    
  4_Automated_Response:
    Handler: handle_splunk_alert()
    Actions:
      - Call quarantine_endpoint(mac)
      - ISE applies QUARANTINE ANC policy
      - CoA sent to switch
      - Endpoint isolated
      
  5_Notification:
    - ServiceNow incident created
    - PagerDuty alert to SOC
    - Slack message to #security-alerts
    
  6_SOC_Investigation:
    - Review in XDR
    - Forensic collection
    - Remediation
    - Release from quarantine (if false positive)
```

---

## 7. Monitoring and Troubleshooting

### 7.1 Webhook Monitoring

```bash
# Check webhook handler logs
tail -f /var/log/abhavtech/webhook.log

# Check service status
systemctl status abhavtech-webhook

# Test webhook endpoint
curl -X POST \
  "https://webhook.abhavtech.com:5000/api/v1/dnac/events" \
  -H "X-API-Key: ${API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"eventId": "TEST-EVENT", "severity": "INFO"}'

# Check health endpoint
curl "https://webhook.abhavtech.com:5000/api/v1/health"
```

### 7.2 Event Metrics Dashboard

```yaml
Webhook_Metrics:
  Endpoints:
    - /metrics (Prometheus format)
    
  Metrics_Collected:
    - webhook_events_total (counter by event_type)
    - webhook_processing_seconds (histogram)
    - webhook_errors_total (counter by error_type)
    - webhook_actions_total (counter by action_type)
    
  Alerting:
    - High error rate (>5% in 5 minutes)
    - Processing latency (>5 seconds)
    - Service unavailable
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
