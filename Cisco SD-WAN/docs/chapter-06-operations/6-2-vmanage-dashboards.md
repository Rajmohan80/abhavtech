# 6.2 vManage Dashboards

## Document Information

| Field | Value |
|-------|-------|
| Document Title | vManage Dashboards |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Abhavtech |
| Classification | Internal Use |
| Target Audience | Network Operations, NOC, Engineers |

---

## Overview

This section details the vManage dashboard configuration for monitoring the Abhavtech SD-WAN infrastructure. Dashboards provide real-time visibility into network health, performance, and security.

### Dashboard Strategy

```
DASHBOARD HIERARCHY
===================

Executive View (IT Director)
├── WAN Overview
├── SLA Compliance
├── Cost Summary
└── Availability Metrics

Operations View (NOC/L1)
├── Device Health
├── Tunnel Status
├── Active Alarms
└── Real-time Performance

Engineering View (L2/L3)
├── Detailed Analytics
├── Traffic Analysis
├── Policy Compliance
└── Capacity Metrics

Security View (Security Team)
├── Threat Dashboard
├── Security Events
├── Compliance Status
└── SGT Analytics
```

---

## Main Dashboard (Home)

### Dashboard Layout

```
vMANAGE HOME DASHBOARD
======================

┌──────────────────────────────────────────────────────────────────┐
│                        ABHAVTECH SD-WAN                          │
│                     Status: ● Healthy                            │
├─────────────────────┬────────────────────┬───────────────────────┤
│   DEVICE HEALTH     │  TUNNEL STATUS     │    ACTIVE ALARMS      │
│                     │                    │                       │
│   Total: 22         │  Total: 168        │   Critical: 0         │
│   ● Online: 22      │  ● Up: 168         │   Major: 2            │
│   ○ Offline: 0      │  ○ Down: 0         │   Minor: 5            │
│   ◐ Degraded: 0     │  ◐ Degraded: 0     │   Warning: 12         │
│                     │                    │                       │
├─────────────────────┼────────────────────┼───────────────────────┤
│   TRANSPORT HEALTH  │   APPLICATION      │    WAN BANDWIDTH      │
│                     │   PERFORMANCE      │                       │
│   MPLS: ● 100%      │  Office365: 98ms   │   ▄▄▄▄▆▆▆▇▇▇▇▇       │
│   Internet: ● 100%  │  Teams: 45ms       │   Current: 4.2 Gbps   │
│   LTE: ● 100%       │  SAP: 67ms         │   Peak: 7.8 Gbps      │
│                     │  Salesforce: 89ms  │   Avg: 3.6 Gbps       │
├─────────────────────┴────────────────────┴───────────────────────┤
│                       SITE STATUS MAP                            │
│                                                                  │
│     ◉ London    ◉ Frankfurt                                      │
│          \      /                                                │
│           \    /                                                 │
│    ◉ NJ ───●───● Mumbai ◉ Chennai                                │
│            /  \         \                                        │
│     ◉ Dallas   \         ◉ Bangalore                             │
│                 \        ◉ Delhi                                 │
│                  \       ◉ Noida                                 │
│                                                                  │
│     ● Hub (Online)  ◉ Branch (Online)  ○ Offline  ◐ Degraded     │
└──────────────────────────────────────────────────────────────────┘
```

### Widget Configuration

| Widget | Data Source | Refresh Rate | Alert Threshold |
|--------|-------------|--------------|-----------------|
| Device Health | /dataservice/device | 60 sec | Any offline |
| Tunnel Status | /dataservice/device/tunnel | 30 sec | Any down |
| Active Alarms | /dataservice/alarms | 30 sec | Any critical |
| Transport Health | /dataservice/device/interface | 60 sec | < 95% |
| Application Performance | /dataservice/statistics/approute | 60 sec | > 100ms latency |
| WAN Bandwidth | /dataservice/statistics/interface | 30 sec | > 80% utilization |

---

## Device Health Dashboard

### Device Status Widget

```
DEVICE STATUS OVERVIEW
======================

Controller Devices (10):
┌────────────────────────────────────────────────────────────────┐
│ Device              │ Status │ CPU  │ Memory │ Uptime         │
├────────────────────────────────────────────────────────────────┤
│ MUM-VMANAGE-01      │   ●    │ 45%  │  62%   │ 127d 4h 23m    │
│ MUM-VMANAGE-02      │   ●    │ 42%  │  58%   │ 127d 4h 23m    │
│ MUM-VMANAGE-03      │   ●    │ 38%  │  55%   │ 127d 4h 23m    │
│ MUM-VSMART-01       │   ●    │ 22%  │  45%   │ 127d 4h 23m    │
│ MUM-VSMART-02       │   ●    │ 20%  │  43%   │ 127d 4h 23m    │
│ CHE-VSMART-01       │   ●    │ 18%  │  42%   │ 127d 4h 23m    │
│ CHE-VSMART-02       │   ●    │ 15%  │  40%   │ 127d 4h 23m    │
│ CLOUD-VBOND-01      │   ●    │ 12%  │  35%   │ 127d 4h 23m    │
│ CLOUD-VBOND-02      │   ●    │ 10%  │  32%   │ 127d 4h 23m    │
│ CHE-VMANAGE-DR      │   ●    │ 8%   │  30%   │ 127d 4h 23m    │
└────────────────────────────────────────────────────────────────┘

WAN Edge Devices (22):
┌────────────────────────────────────────────────────────────────┐
│ Site        │ Device         │ Status │ CPU │ Tunnels │ BFD   │
├────────────────────────────────────────────────────────────────┤
│ Mumbai      │ MUM-WE-01      │   ●    │ 35% │  16/16  │ ●     │
│ Mumbai      │ MUM-WE-02      │   ●    │ 32% │  16/16  │ ●     │
│ Chennai     │ CHE-WE-01      │   ●    │ 30% │  16/16  │ ●     │
│ Chennai     │ CHE-WE-02      │   ●    │ 28% │  16/16  │ ●     │
│ London      │ LON-WE-01      │   ●    │ 25% │  14/14  │ ●     │
│ London      │ LON-WE-02      │   ●    │ 23% │  14/14  │ ●     │
│ Frankfurt   │ FRA-WE-01      │   ●    │ 22% │  14/14  │ ●     │
│ Frankfurt   │ FRA-WE-02      │   ●    │ 20% │  14/14  │ ●     │
│ New Jersey  │ NJ-WE-01       │   ●    │ 28% │  14/14  │ ●     │
│ New Jersey  │ NJ-WE-02       │   ●    │ 26% │  14/14  │ ●     │
│ Dallas      │ DAL-WE-01      │   ●    │ 24% │  14/14  │ ●     │
│ Dallas      │ DAL-WE-02      │   ●    │ 22% │  14/14  │ ●     │
│ Bangalore   │ BLR-WE-01      │   ●    │ 18% │   8/8   │ ●     │
│ Delhi       │ DEL-WE-01      │   ●    │ 16% │   8/8   │ ●     │
│ Noida       │ NOI-WE-01      │   ●    │ 15% │   8/8   │ ●     │
└────────────────────────────────────────────────────────────────┘

Status: ● Online  ○ Offline  ◐ Degraded  ◑ Rebooting
```

### Device Health API Query

```python
#!/usr/bin/env python3
"""Device Health Dashboard Data"""

import requests
import json
from datetime import datetime
import urllib3
urllib3.disable_warnings()

class DeviceHealthDashboard:
    """Retrieve device health for dashboard"""
    
    def __init__(self, vmanage_ip, username, password):
        self.vmanage = vmanage_ip
        self.session = requests.Session()
        self.authenticate(username, password)
    
    def authenticate(self, username, password):
        """Authenticate to vManage"""
        auth_url = f"https://{self.vmanage}/j_security_check"
        self.session.post(auth_url, 
                         data={"j_username": username, "j_password": password},
                         verify=False)
        token_url = f"https://{self.vmanage}/dataservice/client/token"
        token_resp = self.session.get(token_url, verify=False)
        self.session.headers["X-XSRF-TOKEN"] = token_resp.text
    
    def get_device_status(self):
        """Get all device status"""
        url = f"https://{self.vmanage}/dataservice/device"
        resp = self.session.get(url, verify=False)
        return resp.json().get("data", [])
    
    def get_device_health(self, device_ip):
        """Get device health metrics"""
        # CPU
        cpu_url = f"https://{self.vmanage}/dataservice/device/system/status?deviceId={device_ip}"
        cpu_resp = self.session.get(cpu_url, verify=False)
        
        # Memory
        mem_url = f"https://{self.vmanage}/dataservice/device/system/memUsage?deviceId={device_ip}"
        mem_resp = self.session.get(mem_url, verify=False)
        
        return {
            "cpu": cpu_resp.json().get("data", [{}])[0].get("cpu_user", 0),
            "memory": mem_resp.json().get("data", [{}])[0].get("mem_used_percent", 0)
        }
    
    def get_tunnel_status(self, device_ip):
        """Get tunnel status for device"""
        url = f"https://{self.vmanage}/dataservice/device/tunnel/statistics?deviceId={device_ip}"
        resp = self.session.get(url, verify=False)
        tunnels = resp.json().get("data", [])
        up = sum(1 for t in tunnels if t.get("state") == "up")
        return {"up": up, "total": len(tunnels)}
    
    def generate_dashboard_data(self):
        """Generate complete dashboard data"""
        devices = self.get_device_status()
        dashboard = {
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total": len(devices),
                "online": sum(1 for d in devices if d.get("reachability") == "reachable"),
                "offline": sum(1 for d in devices if d.get("reachability") != "reachable")
            },
            "devices": []
        }
        
        for device in devices:
            device_info = {
                "hostname": device.get("host-name"),
                "ip": device.get("system-ip"),
                "type": device.get("device-type"),
                "status": device.get("reachability"),
                "uptime": device.get("uptime-date")
            }
            
            if device.get("reachability") == "reachable":
                health = self.get_device_health(device.get("system-ip"))
                tunnels = self.get_tunnel_status(device.get("system-ip"))
                device_info.update({
                    "cpu": health["cpu"],
                    "memory": health["memory"],
                    "tunnels_up": tunnels["up"],
                    "tunnels_total": tunnels["total"]
                })
            
            dashboard["devices"].append(device_info)
        
        return dashboard


if __name__ == "__main__":
    dashboard = DeviceHealthDashboard(
        vmanage_ip="10.255.0.10",
        username="admin",
        password="admin123"
    )
    data = dashboard.generate_dashboard_data()
    print(json.dumps(data, indent=2))
```

---

## Tunnel Status Dashboard

### Tunnel Overview

```
TUNNEL STATUS DASHBOARD
=======================

Summary:
┌─────────────────────────────────────────────────────────────┐
│  Total Tunnels: 168    Up: 168 (100%)    Down: 0 (0%)       │
│  MPLS: 84 (100%)       Internet: 84 (100%)    LTE: 0        │
└─────────────────────────────────────────────────────────────┘

By Site:
┌────────────────────────────────────────────────────────────────┐
│ Site        │ MPLS Tunnels  │ Internet Tunnels │ Total Status │
├────────────────────────────────────────────────────────────────┤
│ Mumbai      │ ●●●●●●●●      │ ●●●●●●●●         │ 16/16 ●      │
│ Chennai     │ ●●●●●●●●      │ ●●●●●●●●         │ 16/16 ●      │
│ London      │ ●●●●●●●       │ ●●●●●●●          │ 14/14 ●      │
│ Frankfurt   │ ●●●●●●●       │ ●●●●●●●          │ 14/14 ●      │
│ New Jersey  │ ●●●●●●●       │ ●●●●●●●          │ 14/14 ●      │
│ Dallas      │ ●●●●●●●       │ ●●●●●●●          │ 14/14 ●      │
│ Bangalore   │ N/A           │ ●●●●             │  8/8  ●      │
│ Delhi       │ N/A           │ ●●●●             │  8/8  ●      │
│ Noida       │ N/A           │ ●●●●             │  8/8  ●      │
└────────────────────────────────────────────────────────────────┘
```

### Tunnel Matrix

```
TUNNEL CONNECTIVITY MATRIX
==========================

From \ To   │ MUM │ CHE │ LON │ FRA │ NJ  │ DAL │ BLR │ DEL │ NOI │
────────────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┼─────┤
Mumbai      │  -  │ ●●  │ ●●  │ ●●  │ ●●  │ ●●  │ ●●  │ ●●  │ ●●  │
Chennai     │ ●●  │  -  │ ●●  │ ●●  │ ●●  │ ●●  │ ●●  │ ●●  │ ●●  │
London      │ ●●  │ ●●  │  -  │ ●●  │ ●●  │ ●●  │ ●   │ ●   │ ●   │
Frankfurt   │ ●●  │ ●●  │ ●●  │  -  │ ●●  │ ●●  │ ●   │ ●   │ ●   │
New Jersey  │ ●●  │ ●●  │ ●●  │ ●●  │  -  │ ●●  │ ●   │ ●   │ ●   │
Dallas      │ ●●  │ ●●  │ ●●  │ ●●  │ ●●  │  -  │ ●   │ ●   │ ●   │
Bangalore   │ ●●  │ ●●  │ ●   │ ●   │ ●   │ ●   │  -  │ ●   │ ●   │
Delhi       │ ●●  │ ●●  │ ●   │ ●   │ ●   │ ●   │ ●   │  -  │ ●   │
Noida       │ ●●  │ ●●  │ ●   │ ●   │ ●   │ ●   │ ●   │ ●   │  -  │

Legend: ●● = MPLS + Internet    ● = Internet Only    ○ = Down
```

### BFD Session Status

```
BFD SESSION DASHBOARD
=====================

┌────────────────────────────────────────────────────────────────────┐
│ Site        │ Sessions │ Up  │ Down │ Avg RTT  │ Max Jitter       │
├────────────────────────────────────────────────────────────────────┤
│ Mumbai      │    16    │ 16  │  0   │  12 ms   │   3 ms           │
│ Chennai     │    16    │ 16  │  0   │  15 ms   │   4 ms           │
│ London      │    14    │ 14  │  0   │  145 ms  │   8 ms           │
│ Frankfurt   │    14    │ 14  │  0   │  138 ms  │   7 ms           │
│ New Jersey  │    14    │ 14  │  0   │  235 ms  │  12 ms           │
│ Dallas      │    14    │ 14  │  0   │  245 ms  │  15 ms           │
│ Bangalore   │     8    │  8  │  0   │  18 ms   │   4 ms           │
│ Delhi       │     8    │  8  │  0   │  22 ms   │   5 ms           │
│ Noida       │     8    │  8  │  0   │  25 ms   │   5 ms           │
└────────────────────────────────────────────────────────────────────┘
```

---

## Application Performance Dashboard

### Application SLA Overview

```
APPLICATION PERFORMANCE DASHBOARD
=================================

Top Applications by Traffic:
┌────────────────────────────────────────────────────────────────────┐
│ Application     │ Bandwidth │ Latency │ Loss  │ Jitter │ SLA      │
├────────────────────────────────────────────────────────────────────┤
│ MS Teams        │  1.2 Gbps │  45 ms  │ 0.00% │  5 ms  │ ● Meet   │
│ Office 365      │  890 Mbps │  52 ms  │ 0.01% │  4 ms  │ ● Meet   │
│ SAP ERP         │  450 Mbps │  67 ms  │ 0.00% │  3 ms  │ ● Meet   │
│ Salesforce      │  380 Mbps │  89 ms  │ 0.02% │  6 ms  │ ● Meet   │
│ Web Browsing    │  650 Mbps │ 120 ms  │ 0.05% │ 12 ms  │ ● Meet   │
│ File Transfer   │  420 Mbps │  78 ms  │ 0.00% │  4 ms  │ ● Meet   │
│ Database        │  280 Mbps │  35 ms  │ 0.00% │  2 ms  │ ● Meet   │
│ Backup          │  180 Mbps │ 156 ms  │ 0.10% │ 15 ms  │ ◐ Near   │
└────────────────────────────────────────────────────────────────────┘

SLA Status: ● Meeting SLA   ◐ Near Threshold   ○ Violating SLA
```

### Application Path Analysis

```
APPLICATION PATH SELECTION
==========================

Voice/Video (Real-Time):
┌──────────────────────────────────────────────────────────────┐
│ App          │ Preferred Path │ Current Path │ Failover      │
├──────────────────────────────────────────────────────────────┤
│ MS Teams     │ MPLS           │ MPLS ●       │ Internet      │
│ Zoom         │ MPLS           │ MPLS ●       │ Internet      │
│ WebEx        │ MPLS           │ MPLS ●       │ Internet      │
│ Voice (SIP)  │ MPLS           │ MPLS ●       │ Internet      │
└──────────────────────────────────────────────────────────────┘

Business Critical:
┌──────────────────────────────────────────────────────────────┐
│ SAP ERP      │ MPLS           │ MPLS ●       │ Internet      │
│ Oracle       │ MPLS           │ MPLS ●       │ Internet      │
│ Salesforce   │ Internet       │ Internet ●   │ MPLS          │
│ Office 365   │ Internet       │ Internet ●   │ MPLS          │
└──────────────────────────────────────────────────────────────┘

Default Traffic:
┌──────────────────────────────────────────────────────────────┐
│ Web          │ Internet       │ Internet ●   │ MPLS          │
│ Email        │ Internet       │ Internet ●   │ MPLS          │
│ Social       │ Internet       │ Internet ●   │ None          │
└──────────────────────────────────────────────────────────────┘
```

### SLA Trend Charts

```
SLA PERFORMANCE TRENDS (Last 24 Hours)
======================================

Latency (ms) - Voice Applications:
100 ┤
 80 ┤
 60 ┤               ▄▄    
 50 ┤──────────────────────────── Target
 40 ┤▄▄▄▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄
 20 ┤
  0 ┼────────────────────────────────────
    00  04  08  12  16  20  24 (Hours)

Packet Loss (%) - All Applications:
0.5 ┤
0.4 ┤
0.3 ┤
0.2 ┤
0.1 ┤──────────────────────────── Target
0.0 ┼▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
    00  04  08  12  16  20  24 (Hours)

Jitter (ms) - Real-Time Applications:
50  ┤
40  ┤
30  ┤──────────────────────────── Target
20  ┤
10  ┤▄▄▄▄▄▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
 0  ┼────────────────────────────────────
    00  04  08  12  16  20  24 (Hours)
```

---

## Security Dashboard

### Security Overview

```
SECURITY STATUS DASHBOARD
=========================

Security Health Score: 94/100 ●

┌─────────────────────┬──────────────────┬─────────────────────┐
│   THREAT STATUS     │  FIREWALL STATUS │   SGT STATUS        │
│                     │                  │                     │
│   Blocked: 1,247    │  Active: 22      │   Devices: 22/22    │
│   Alerts: 12        │  Rules: 156      │   Inline Tag: ●     │
│   Incidents: 0      │  Violations: 3   │   Propagation: ●    │
│                     │                  │                     │
└─────────────────────┴──────────────────┴─────────────────────┘

Recent Security Events (Last 24 Hours):
┌────────────────────────────────────────────────────────────────────┐
│ Time       │ Type        │ Source          │ Action    │ Severity │
├────────────────────────────────────────────────────────────────────┤
│ 14:23:45   │ IPS         │ 203.0.113.45    │ Blocked   │ High     │
│ 14:15:12   │ URL Filter  │ 10.20.30.105    │ Blocked   │ Medium   │
│ 13:58:33   │ Malware     │ 192.168.10.55   │ Quarantine│ High     │
│ 13:45:21   │ DDoS        │ External        │ Mitigated │ Medium   │
│ 12:30:00   │ Policy      │ 10.10.50.33     │ Denied    │ Low      │
└────────────────────────────────────────────────────────────────────┘
```

### Threat Analytics

```
THREAT ANALYSIS DASHBOARD
=========================

Threats by Category (Last 7 Days):
┌──────────────────────────────────────────────────────────────┐
│ Category          │ Count │ Blocked │ Allowed │ % Blocked   │
├──────────────────────────────────────────────────────────────┤
│ Malware           │  145  │   145   │    0    │   100%      │
│ Intrusion Attempt │  892  │   890   │    2    │   99.8%     │
│ Phishing          │  234  │   234   │    0    │   100%      │
│ DDoS              │   45  │    45   │    0    │   100%      │
│ Policy Violation  │  567  │   560   │    7    │   98.8%     │
│ Suspicious DNS    │  123  │   120   │    3    │   97.6%     │
└──────────────────────────────────────────────────────────────┘

Top Threat Sources:
1. 203.0.113.0/24  - 234 events (Blocked)
2. 198.51.100.0/24 - 189 events (Blocked)
3. 192.0.2.0/24    - 156 events (Blocked)
4. Internal        -  45 events (Reviewed)
```

---

## Custom Dashboard Creation

### Creating New Dashboard

**Navigation:** Monitor → Dashboards → Create New

```
CUSTOM DASHBOARD CONFIGURATION
==============================

Step 1: Dashboard Settings
- Name: "Regional Performance Dashboard"
- Description: "Performance metrics by region"
- Refresh Rate: 60 seconds
- Time Range: Last 24 hours

Step 2: Add Widgets
┌─────────────────────────────────────────────────────────────┐
│ Widget Type        │ Data Source       │ Visualization      │
├─────────────────────────────────────────────────────────────┤
│ Device Health      │ /device           │ Table              │
│ Tunnel Status      │ /device/tunnel    │ Status Grid        │
│ Bandwidth          │ /statistics/      │ Line Chart         │
│                    │ interface         │                    │
│ Latency            │ /statistics/      │ Area Chart         │
│                    │ approute          │                    │
│ Application        │ /statistics/dpi   │ Pie Chart          │
│ Alarms             │ /alarms           │ Table              │
└─────────────────────────────────────────────────────────────┘

Step 3: Layout Configuration
┌────────────────────┬────────────────────┐
│                    │                    │
│   Device Health    │   Tunnel Status    │
│      (50%)         │      (50%)         │
│                    │                    │
├────────────────────┴────────────────────┤
│                                         │
│            Bandwidth Chart              │
│               (100%)                    │
│                                         │
├────────────────────┬────────────────────┤
│                    │                    │
│   Latency Chart    │   Application Mix  │
│      (50%)         │      (50%)         │
│                    │                    │
├────────────────────┴────────────────────┤
│                                         │
│             Active Alarms               │
│               (100%)                    │
│                                         │
└─────────────────────────────────────────┘
```

### Dashboard API for Custom Widgets

```python
#!/usr/bin/env python3
"""Custom Dashboard Widget Data"""

import requests
import json
from datetime import datetime, timedelta
import urllib3
urllib3.disable_warnings()

class CustomDashboard:
    """Create custom dashboard widgets"""
    
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
    
    def get_regional_performance(self, region):
        """Get performance metrics for a region"""
        # Define region site mappings
        regions = {
            "India": ["mumbai", "chennai", "bangalore", "delhi", "noida"],
            "EMEA": ["london", "frankfurt"],
            "Americas": ["newjersey", "dallas"]
        }
        
        sites = regions.get(region, [])
        
        # Get devices in region
        devices_url = f"https://{self.vmanage}/dataservice/device"
        devices_resp = self.session.get(devices_url, verify=False)
        all_devices = devices_resp.json().get("data", [])
        
        region_devices = [d for d in all_devices 
                        if any(s in d.get("host-name", "").lower() for s in sites)]
        
        metrics = {
            "region": region,
            "device_count": len(region_devices),
            "devices_online": sum(1 for d in region_devices 
                                 if d.get("reachability") == "reachable"),
            "tunnels": {"up": 0, "total": 0},
            "avg_latency": 0,
            "bandwidth_mbps": 0
        }
        
        return metrics
    
    def get_sla_compliance(self, time_hours=24):
        """Get SLA compliance for time period"""
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=time_hours)
        
        # Format timestamps
        start_ts = int(start_time.timestamp() * 1000)
        end_ts = int(end_time.timestamp() * 1000)
        
        url = f"https://{self.vmanage}/dataservice/statistics/approute/fec/aggregation"
        params = {
            "startDate": start_ts,
            "endDate": end_ts,
            "timeZone": "UTC"
        }
        
        resp = self.session.get(url, params=params, verify=False)
        return resp.json().get("data", [])
    
    def generate_executive_summary(self):
        """Generate executive dashboard data"""
        # Device summary
        devices_url = f"https://{self.vmanage}/dataservice/device"
        devices = self.session.get(devices_url, verify=False).json().get("data", [])
        
        # Alarm summary
        alarms_url = f"https://{self.vmanage}/dataservice/alarms"
        alarms = self.session.get(alarms_url, verify=False).json().get("data", [])
        
        critical_alarms = sum(1 for a in alarms if a.get("severity") == "Critical")
        major_alarms = sum(1 for a in alarms if a.get("severity") == "Major")
        
        summary = {
            "timestamp": datetime.now().isoformat(),
            "health_score": 100 - (critical_alarms * 10) - (major_alarms * 2),
            "devices": {
                "total": len(devices),
                "online": sum(1 for d in devices if d.get("reachability") == "reachable"),
                "offline": sum(1 for d in devices if d.get("reachability") != "reachable")
            },
            "alarms": {
                "critical": critical_alarms,
                "major": major_alarms,
                "minor": sum(1 for a in alarms if a.get("severity") == "Minor"),
                "warning": sum(1 for a in alarms if a.get("severity") == "Warning")
            },
            "regional_status": {
                "India": self.get_regional_performance("India"),
                "EMEA": self.get_regional_performance("EMEA"),
                "Americas": self.get_regional_performance("Americas")
            }
        }
        
        return summary


if __name__ == "__main__":
    dashboard = CustomDashboard(
        vmanage_ip="10.255.0.10",
        username="admin",
        password="admin123"
    )
    summary = dashboard.generate_executive_summary()
    print(json.dumps(summary, indent=2))
```

---

## Dashboard Best Practices

### Widget Selection Guidelines

| Use Case | Recommended Widget | Data Source |
|----------|-------------------|-------------|
| Device status | Status grid | /device |
| Performance trends | Line chart | /statistics/* |
| Current metrics | Gauge | /realtime/* |
| Top-N analysis | Bar chart | /statistics/aggregation |
| Geographic view | Map | /device with location |
| Event list | Table | /alarms, /events |
| Composition | Pie chart | /statistics/dpi |

### Refresh Rate Guidelines

| Dashboard Type | Refresh Rate | Rationale |
|----------------|--------------|-----------|
| NOC Operations | 30 seconds | Real-time awareness |
| Engineering | 60 seconds | Detailed analysis |
| Executive | 5 minutes | Summary view |
| Security | 30 seconds | Quick detection |

### Dashboard Organization

```
DASHBOARD HIERARCHY
===================

Level 1: Executive Summary
├── Overall health score
├── Availability SLA
├── Cost metrics
└── Regional summary

Level 2: Operations Overview
├── Device status
├── Tunnel health
├── Active alarms
└── Performance metrics

Level 3: Detailed Analysis
├── Per-site dashboards
├── Application performance
├── Security analytics
└── Capacity trending

Level 4: Troubleshooting
├── Real-time diagnostics
├── Historical analysis
├── Comparative views
└── Root cause tools
```

---

## Related Documentation

| Document | Description | Location |
|----------|-------------|----------|
| Monitoring Framework | Overall monitoring design | Section 6.3 |
| Alerting Configuration | Alert setup | Section 6.4 |
| Analytics Deep Dive | Advanced analytics | Section 6.5 |
| Operations Runbooks | Daily procedures | Section 6.13 |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech | Initial release |

---

*This document is part of the SD-WAN Operations & Monitoring documentation series for Abhavtech.com*
