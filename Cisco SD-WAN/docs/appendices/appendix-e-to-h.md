# Appendix E: Troubleshooting Guide

## E.1 Common Issues and Resolutions

### Control Plane Issues

#### Issue: WAN Edge Not Connecting to Controllers

```yaml
symptoms:
  - "show sdwan control connections" shows no connections
  - Device not appearing in vManage
  
diagnosis:
  step_1:
    check: "Verify vBond reachability"
    command: "ping vbond.abhavtech.com"
    
  step_2:
    check: "Verify certificate"
    command: "show sdwan certificate installed"
    
  step_3:
    check: "Verify system configuration"
    command: "show sdwan running-config | section system"
    
  step_4:
    check: "Check control connection attempts"
    command: "show sdwan control connections-history"
    
resolution:
  - "Verify organization-name matches"
  - "Verify vbond address is correct"
  - "Check certificate validity"
  - "Verify firewall allows DTLS (UDP 12346)"
  - "Check DNS resolution for vBond"
```

#### Issue: BFD Sessions Flapping

```yaml
symptoms:
  - Intermittent connectivity
  - BFD state changes in logs
  - Tunnel statistics showing high packet loss
  
diagnosis:
  step_1:
    check: "View BFD session status"
    command: "show sdwan bfd sessions"
    
  step_2:
    check: "Check BFD history"
    command: "show sdwan bfd history"
    
  step_3:
    check: "Verify circuit quality"
    command: "show sdwan tunnel statistics"
    
resolution:
  - "Adjust BFD timers (increase multiplier)"
  - "Check for circuit congestion"
  - "Verify MTU settings"
  - "Check for packet loss on transport"
  - "Consider longer poll-interval"
```

### Data Plane Issues

#### Issue: Traffic Not Following Expected Path

```yaml
symptoms:
  - Traffic using wrong tunnel/transport
  - AAR not selecting expected path
  
diagnosis:
  step_1:
    check: "Verify policy attachment"
    command: "show sdwan policy from-vsmart"
    
  step_2:
    check: "Check SLA metrics"
    command: "show sdwan app-route statistics"
    
  step_3:
    check: "Verify application recognition"
    command: "show sdwan app-fwd cflowd flows"
    
resolution:
  - "Verify SLA class thresholds"
  - "Check policy sequence order"
  - "Verify application list contents"
  - "Check preferred color configuration"
```

#### Issue: Slow Application Performance

```yaml
symptoms:
  - User complaints about slow apps
  - High latency reported
  
diagnosis:
  step_1:
    check: "Check path metrics"
    command: "show sdwan app-route statistics"
    
  step_2:
    check: "Verify QoS configuration"
    command: "show policy-map interface [int]"
    
  step_3:
    check: "Check for congestion"
    command: "show interface [int] | include drops"
    
resolution:
  - "Verify AAR policy for application"
  - "Check QoS queue assignments"
  - "Increase circuit bandwidth"
  - "Optimize traffic engineering"
```

## E.2 Troubleshooting Flowcharts

### Control Connection Troubleshooting

```
START: Control Connection Issues
        │
        ▼
┌───────────────────┐
│ Can ping vBond?   │
└───────────────────┘
        │
   NO   │   YES
   ▼    │    ▼
┌────────────┐  ┌───────────────────┐
│Check:      │  │Certificate valid? │
│- DNS       │  └───────────────────┘
│- Firewall  │          │
│- Routing   │     NO   │   YES
└────────────┘     ▼    │    ▼
                ┌────────────┐  ┌──────────────┐
                │Renew cert  │  │Org-name match│
                └────────────┘  └──────────────┘
                                       │
                                  NO   │   YES
                                  ▼    │    ▼
                               ┌────────────┐  ┌──────────┐
                               │Fix org-name│  │Check logs│
                               └────────────┘  └──────────┘
```

### BFD Troubleshooting

```
START: BFD Session Issues
        │
        ▼
┌───────────────────┐
│ Check BFD state   │
│ show sdwan bfd    │
└───────────────────┘
        │
   DOWN │   FLAPPING
   ▼    │    ▼
┌────────────┐  ┌───────────────────┐
│Check:      │  │Check BFD history  │
│- Tunnel    │  │for flap pattern   │
│- Transport │  └───────────────────┘
│- Routing   │          │
└────────────┘     ┌────┴────┐
                   ▼         ▼
              ┌─────────┐ ┌─────────────┐
              │Circuit  │ │Timer issue  │
              │quality  │ │Adjust BFD   │
              └─────────┘ └─────────────┘
```

## E.3 Debug Commands Reference

### Safe Debug Commands

```bash
## Control plane debugging
debug sdwan control connections
debug sdwan omp events
debug sdwan bfd events

## Policy debugging  
debug sdwan policy data-policy
debug sdwan policy app-route

## Certificate debugging
debug sdwan certificate events
```

### Debug Output Analysis

```yaml
debug_interpretation:
  control_connections:
    "DTLS handshake failed": "Check certificates and firewall"
    "Connection rejected": "Verify organization name"
    "No response from vBond": "Check vBond reachability"
    
  bfd:
    "Session down": "Transport issue or timer mismatch"
    "Echo failed": "Path quality issue"
    
  policy:
    "No match": "Check policy sequence and match criteria"
    "Action not applied": "Verify policy activation"
```

---

## Appendix F: API Examples

## F.1 Authentication Examples

### Python Authentication

```python
import requests
import urllib3
urllib3.disable_warnings()

def get_session(host, username, password):
    """Authenticate and return session with token"""
    session = requests.Session()
    session.verify = False
    
    # Authenticate
    auth_url = f"https://{host}/j_security_check"
    session.post(auth_url, data={
        'j_username': username,
        'j_password': password
    })
    
    # Get token
    token_url = f"https://{host}/dataservice/client/token"
    token = session.get(token_url).text
    session.headers['X-XSRF-TOKEN'] = token
    
    return session
```

### cURL Authentication

```bash
## Step 1: Authenticate
curl -k -c cookies.txt -X POST \
  "https://vmanage.abhavtech.com/j_security_check" \
  -d "j_username=admin&j_password=password"

## Step 2: Get token
XSRF_TOKEN=$(curl -k -b cookies.txt \
  "https://vmanage.abhavtech.com/dataservice/client/token")

## Step 3: Make API call
curl -k -b cookies.txt \
  -H "X-XSRF-TOKEN: $XSRF_TOKEN" \
  "https://vmanage.abhavtech.com/dataservice/device"
```

## F.2 Common API Operations

### Get All Devices

```python
def get_devices(session, host):
    url = f"https://{host}/dataservice/device"
    response = session.get(url)
    return response.json()['data']

## Usage
devices = get_devices(session, "vmanage.abhavtech.com")
for device in devices:
    print(f"{device['host-name']}: {device['reachability']}")
```

### Get Device Statistics

```python
def get_interface_stats(session, host, device_id):
    url = f"https://{host}/dataservice/statistics/interface"
    params = {'deviceId': device_id}
    response = session.get(url, params=params)
    return response.json()['data']
```

### Get Active Alarms

```python
def get_alarms(session, host, severity=None):
    url = f"https://{host}/dataservice/alarms"
    response = session.get(url)
    alarms = response.json()['data']
    
    if severity:
        alarms = [a for a in alarms if a['severity'] == severity]
    
    return alarms
```

## F.3 Postman Collection

### Collection Structure

```json
{
  "info": {
    "name": "Abhavtech SD-WAN API",
    "description": "vManage API collection"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/j_security_check",
            "body": {
              "mode": "urlencoded",
              "urlencoded": [
                {"key": "j_username", "value": "{{username}}"},
                {"key": "j_password", "value": "{{password}}"}
              ]
            }
          }
        },
        {
          "name": "Get Token",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/dataservice/client/token"
          }
        }
      ]
    },
    {
      "name": "Devices",
      "item": [
        {
          "name": "Get All Devices",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/dataservice/device"
          }
        }
      ]
    }
  ]
}
```

---

## Appendix G: Migration Checklists

## G.1 Pre-Migration Checklist

### Infrastructure Readiness

```yaml
infrastructure_checklist:
  controllers:
    - "[ ] vManage cluster deployed and healthy"
    - "[ ] vSmart controllers operational"
    - "[ ] vBond accessible from all sites"
    - "[ ] Controller certificates valid"
    
  templates:
    - "[ ] Feature templates created"
    - "[ ] Device templates created"
    - "[ ] Variables defined"
    - "[ ] Templates tested in lab"
    
  policies:
    - "[ ] Control policies defined"
    - "[ ] Data policies defined"
    - "[ ] AAR policies configured"
    - "[ ] Policies tested"
    
  circuits:
    - "[ ] New circuits provisioned"
    - "[ ] Circuits tested (speed, latency)"
    - "[ ] Backup circuits ready"
```

### Site Readiness

```yaml
site_checklist:
  hardware:
    - "[ ] WAN Edge device delivered"
    - "[ ] Device staged and configured"
    - "[ ] Power and rack space confirmed"
    - "[ ] Cabling prepared"
    
  network:
    - "[ ] IP addressing allocated"
    - "[ ] VLAN configuration ready"
    - "[ ] Firewall rules updated"
    - "[ ] DNS entries created"
    
  documentation:
    - "[ ] Migration runbook reviewed"
    - "[ ] Rollback procedure documented"
    - "[ ] Contact list updated"
    - "[ ] Escalation path defined"
```

## G.2 Migration Day Checklist

### Pre-Migration (T-30 minutes)

```yaml
pre_migration:
  - "[ ] Team assembled on bridge"
  - "[ ] Site contact available"
  - "[ ] Current state documented"
  - "[ ] Rollback procedure confirmed"
  - "[ ] Go/No-go decision made"
```

### During Migration

```yaml
migration_steps:
  - "[ ] WAN Edge powered on"
  - "[ ] Control connections verified"
  - "[ ] BFD tunnels established"
  - "[ ] OMP routes received"
  - "[ ] LAN connected"
  - "[ ] Traffic validated"
  - "[ ] Applications tested"
```

### Post-Migration

```yaml
post_migration:
  - "[ ] Performance validated"
  - "[ ] No critical alarms"
  - "[ ] User confirmation received"
  - "[ ] Documentation updated"
  - "[ ] NOC notified"
```

## G.3 Post-Migration Checklist

### Day 1 Verification

```yaml
day_1_checklist:
  - "[ ] All tunnels stable"
  - "[ ] No alarm escalations"
  - "[ ] Application performance acceptable"
  - "[ ] User feedback positive"
  - "[ ] Monitoring configured"
```

### Week 1 Verification

```yaml
week_1_checklist:
  - "[ ] Performance trends analyzed"
  - "[ ] Capacity verified"
  - "[ ] Issues documented"
  - "[ ] Optimization opportunities identified"
  - "[ ] Lessons learned captured"
```

---

## Appendix H: Compliance Reference

## H.1 Regulatory Mapping

### PCI DSS 4.0 Compliance

| Requirement | SD-WAN Implementation |
|-------------|----------------------|
| 1.1 Network segmentation | VPN/VRF segmentation |
| 1.2 Firewall configuration | Zone-based firewall |
| 2.1 Change management | Template versioning |
| 4.1 Encryption in transit | IPsec AES-256-GCM |
| 10.1 Audit logging | vManage audit logs |
| 10.7 Log retention | 1 year retention |

### SOX Compliance

| Requirement | SD-WAN Implementation |
|-------------|----------------------|
| Access controls | RBAC, TACACS+ |
| Change management | Approval workflows |
| Audit trails | Complete audit logging |
| Separation of duties | Role-based access |

### GDPR Compliance

| Requirement | SD-WAN Implementation |
|-------------|----------------------|
| Data protection | Encryption in transit |
| Access logging | Comprehensive audit logs |
| Data residency | Regional traffic policies |

## H.2 Security Baselines

### Configuration Baseline

```yaml
security_baseline:
  encryption:
    control_plane: "DTLS 1.2 AES-256-GCM"
    data_plane: "IPsec AES-256-GCM SHA-256"
    
  authentication:
    method: "TACACS+ with local fallback"
    password_policy:
      min_length: 12
      complexity: true
      rotation: "90 days"
      
  logging:
    level: "Informational"
    retention: "90 days active, 2 years archive"
    forwarding: "Syslog to SIEM"
    
  access_control:
    model: "RBAC"
    mfa: "Required for admin access"
```

### Audit Requirements

```yaml
audit_requirements:
  frequency:
    vulnerability_scan: "Weekly"
    configuration_audit: "Monthly"
    access_review: "Quarterly"
    full_compliance: "Annual"
    
  documentation:
    required:
      - "Network topology diagrams"
      - "Security policy documents"
      - "Access control lists"
      - "Change records"
      - "Incident reports"
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
