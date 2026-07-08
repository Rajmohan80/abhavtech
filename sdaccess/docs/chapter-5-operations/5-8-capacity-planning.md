# 5.8 Capacity Planning

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
