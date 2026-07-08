# 5.2 DNAC Assurance Monitoring

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
