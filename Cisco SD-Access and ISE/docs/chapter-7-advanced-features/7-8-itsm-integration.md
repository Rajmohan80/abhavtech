# 7.8 ITSM Integration

### 7.8.1 ServiceNow Integration

```
+------------------------------------------------------------------+
|                    SERVICENOW INTEGRATION                         |
+------------------------------------------------------------------+

DNAC                          ServiceNow                Operations
+---------------+            +---------------+         +-------------+
|               |   Webhook  |               |         |             |
| Issue         |----------->| Incident      |-------->| NOC         |
| Detection     |            | Creation      |         | Dashboard   |
|               |            |               |         |             |
+---------------+            +---------------+         +-------------+
       |                            |                        |
       v                            v                        v
+---------------+            +---------------+         +-------------+
| Assurance     |   API      | CMDB          |         | Ticket      |
| Data          |----------->| Update        |         | Workflow    |
|               |            |               |         |             |
+---------------+            +---------------+         +-------------+
       |                            |                        |
       v                            v                        v
+---------------+            +---------------+         +-------------+
| Resolution    |   Webhook  | Incident      |         | Auto        |
| Confirmation  |<-----------| Closure       |<--------| Resolution  |
|               |            |               |         |             |
+---------------+            +---------------+         +-------------+
```

### 7.8.2 ServiceNow Integration Configuration

```yaml
# Platform > Developer Toolkit > ServiceNow Integration

ServiceNow_Settings:
  Instance: company.service-now.com
  API_Version: v2
  Authentication:
    Type: OAuth 2.0
    Client_ID: <client_id>
    Client_Secret: <client_secret>
    
  Incident_Mapping:
    DNAC_Priority_P1:
      ServiceNow_Priority: 1
      ServiceNow_Impact: 1
      ServiceNow_Urgency: 1
      Assignment_Group: Network-Critical
      
    DNAC_Priority_P2:
      ServiceNow_Priority: 2
      ServiceNow_Impact: 2
      ServiceNow_Urgency: 2
      Assignment_Group: Network-Operations
      
    DNAC_Priority_P3:
      ServiceNow_Priority: 3
      ServiceNow_Impact: 2
      ServiceNow_Urgency: 3
      Assignment_Group: Network-Support
      
  CMDB_Sync:
    Enable: Yes
    Sync_Interval: 4 hours
    Fields:
      - Device Name
      - IP Address
      - Serial Number
      - Software Version
      - Location
      - Role (Border/CP/Edge)
```

### 7.8.3 Webhook Payload Example

```json
{
  "eventId": "DEVICE_UNREACHABLE",
  "instanceId": "uuid-12345",
  "severity": "P1",
  "category": "Device",
  "type": "Network",
  "name": "MUM-ED-01 Unreachable",
  "description": "Device MUM-ED-01 is not responding to SNMP/ICMP",
  "timestamp": "2025-12-26T08:30:00Z",
  "details": {
    "deviceName": "MUM-ED-01",
    "deviceId": "device-uuid-001",
    "deviceIp": "10.252.12.5",
    "deviceType": "Catalyst 9300",
    "site": "Global/APAC/Mumbai/Building_MUM_HQ/Floor_1",
    "lastSeen": "2025-12-26T08:25:00Z",
    "impactedClients": 45
  },
  "suggestedActions": [
    "Check physical connectivity",
    "Verify power status",
    "Check upstream switch port"
  ]
}
```

---
