# 6.5 Analytics Deep Dive

## Document Information

| Field | Value |
|-------|-------|
| Document Title | Analytics Deep Dive |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Abhavtech |
| Classification | Internal Use |
| Target Audience | Network Operations, Engineering |

---

## Overview

This section covers advanced analytics capabilities for the Abhavtech SD-WAN infrastructure, including application visibility, traffic analysis, and predictive insights.

### Analytics Framework

```
ANALYTICS CAPABILITIES
======================

Real-Time Analytics:
├── Device health scoring
├── Tunnel performance metrics
├── Application flow analysis
├── Security event correlation
└── SLA compliance tracking

Historical Analytics:
├── Trend analysis (30/60/90 days)
├── Capacity forecasting
├── Performance baselines
├── Anomaly detection
└── Root cause patterns

Predictive Analytics:
├── Failure prediction
├── Capacity planning
├── Traffic forecasting
├── Maintenance scheduling
└── Cost optimization
```

---

## Application Visibility

### DPI Analytics

```
APPLICATION CLASSIFICATION
==========================

Layer 7 Visibility:
┌────────────────────────────────────────────────────────────────┐
│ Category          │ Applications  │ Bandwidth │ Sessions      │
├────────────────────────────────────────────────────────────────┤
│ Collaboration     │ 12            │ 2.4 Gbps  │ 15,234        │
│ ├── MS Teams      │               │ 1.2 Gbps  │ 8,456         │
│ ├── Zoom          │               │ 650 Mbps  │ 3,234         │
│ └── WebEx         │               │ 550 Mbps  │ 3,544         │
│                   │               │           │               │
│ Business Apps     │ 8             │ 1.8 Gbps  │ 12,567        │
│ ├── SAP           │               │ 890 Mbps  │ 4,567         │
│ ├── Office 365    │               │ 650 Mbps  │ 5,678         │
│ └── Salesforce    │               │ 260 Mbps  │ 2,322         │
│                   │               │           │               │
│ Web & Internet    │ 200+          │ 1.2 Gbps  │ 45,678        │
│ Cloud Services    │ 15            │ 980 Mbps  │ 8,234         │
│ Network Services  │ 10            │ 450 Mbps  │ 2,345         │
└────────────────────────────────────────────────────────────────┘
```

### Application Performance Analytics

```python
#!/usr/bin/env python3
"""Application Performance Analytics"""

import requests
import json
from datetime import datetime, timedelta
import pandas as pd
import urllib3
urllib3.disable_warnings()

class ApplicationAnalytics:
    """Analyze application performance"""
    
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
    
    def get_application_stats(self, hours=24):
        """Get application statistics"""
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=hours)
        
        url = f"https://{self.vmanage}/dataservice/statistics/dpi/aggregation"
        params = {
            "startDate": int(start_time.timestamp() * 1000),
            "endDate": int(end_time.timestamp() * 1000),
            "timeZone": "UTC"
        }
        
        resp = self.session.get(url, params=params, verify=False)
        return resp.json().get("data", [])
    
    def get_app_route_stats(self, hours=24):
        """Get application-aware routing statistics"""
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=hours)
        
        url = f"https://{self.vmanage}/dataservice/statistics/approute/aggregation"
        params = {
            "startDate": int(start_time.timestamp() * 1000),
            "endDate": int(end_time.timestamp() * 1000),
            "timeZone": "UTC"
        }
        
        resp = self.session.get(url, params=params, verify=False)
        return resp.json().get("data", [])
    
    def analyze_sla_compliance(self, app_name, sla_thresholds):
        """Analyze SLA compliance for application"""
        stats = self.get_app_route_stats()
        
        app_stats = [s for s in stats if s.get("application") == app_name]
        
        if not app_stats:
            return None
        
        total_samples = len(app_stats)
        violations = {
            "latency": 0,
            "loss": 0,
            "jitter": 0
        }
        
        for stat in app_stats:
            if stat.get("latency", 0) > sla_thresholds["latency"]:
                violations["latency"] += 1
            if stat.get("loss", 0) > sla_thresholds["loss"]:
                violations["loss"] += 1
            if stat.get("jitter", 0) > sla_thresholds["jitter"]:
                violations["jitter"] += 1
        
        return {
            "application": app_name,
            "total_samples": total_samples,
            "sla_compliance": {
                "latency": round((1 - violations["latency"]/total_samples) * 100, 2),
                "loss": round((1 - violations["loss"]/total_samples) * 100, 2),
                "jitter": round((1 - violations["jitter"]/total_samples) * 100, 2)
            },
            "violations": violations
        }
    
    def generate_app_report(self):
        """Generate comprehensive application report"""
        apps = self.get_application_stats()
        
        # Convert to DataFrame for analysis
        df = pd.DataFrame(apps)
        
        report = {
            "generated_at": datetime.now().isoformat(),
            "summary": {
                "total_applications": len(df["application"].unique()) if not df.empty else 0,
                "total_bandwidth_gbps": round(df["bytes"].sum() / 1e9, 2) if not df.empty else 0,
                "total_sessions": int(df["flows"].sum()) if not df.empty else 0
            },
            "top_applications_by_bandwidth": [],
            "top_applications_by_sessions": []
        }
        
        if not df.empty:
            # Top by bandwidth
            top_bw = df.groupby("application")["bytes"].sum().nlargest(10)
            report["top_applications_by_bandwidth"] = [
                {"app": app, "bytes": int(bytes_val)}
                for app, bytes_val in top_bw.items()
            ]
            
            # Top by sessions
            top_sessions = df.groupby("application")["flows"].sum().nlargest(10)
            report["top_applications_by_sessions"] = [
                {"app": app, "sessions": int(sessions)}
                for app, sessions in top_sessions.items()
            ]
        
        return report


if __name__ == "__main__":
    analytics = ApplicationAnalytics(
        vmanage_ip="10.255.0.10",
        username="admin",
        password="admin123"
    )
    
    # Generate report
    report = analytics.generate_app_report()
    print(json.dumps(report, indent=2))
    
    # Check SLA compliance for Voice
    voice_sla = {
        "latency": 150,  # ms
        "loss": 0.1,     # %
        "jitter": 30     # ms
    }
    compliance = analytics.analyze_sla_compliance("voice-video", voice_sla)
    print(json.dumps(compliance, indent=2))
```

---

## Traffic Analytics

### Bandwidth Analysis

```
BANDWIDTH TRENDS (Last 7 Days)
==============================

Total WAN Bandwidth Utilization:
10 Gbps ┤                                    
 8 Gbps ┤    ▄▄▄▄    ▄▄▄▄    ▄▄▄▄    ▄▄▄▄  Peak
 6 Gbps ┤▄▄▄▄████▄▄▄▄████▄▄▄▄████▄▄▄▄████▄▄
 4 Gbps ┤████████████████████████████████████ Average
 2 Gbps ┤████████████████████████████████████
 0 Gbps ┼────────────────────────────────────
        Mon  Tue  Wed  Thu  Fri  Sat  Sun

By Transport:
┌────────────────────────────────────────────────────┐
│ Transport    │ Avg Utilization │ Peak │ % of Total │
├────────────────────────────────────────────────────┤
│ MPLS         │ 3.2 Gbps (64%)  │ 4.8  │    52%     │
│ Internet     │ 2.8 Gbps (56%)  │ 4.2  │    45%     │
│ LTE Backup   │ 0.2 Gbps (10%)  │ 0.8  │     3%     │
└────────────────────────────────────────────────────┘

By Site (Top 5):
┌────────────────────────────────────────────────────┐
│ Site         │ Ingress │ Egress │ Total  │ Trend   │
├────────────────────────────────────────────────────┤
│ Mumbai       │ 1.8 Gbps│ 1.6 Gbps│ 3.4 Gbps│   ↑ 5% │
│ Chennai      │ 1.2 Gbps│ 1.1 Gbps│ 2.3 Gbps│   → 0% │
│ London       │ 0.9 Gbps│ 0.8 Gbps│ 1.7 Gbps│   ↑ 3% │
│ New Jersey   │ 0.8 Gbps│ 0.7 Gbps│ 1.5 Gbps│   ↓ 2% │
│ Bangalore    │ 0.4 Gbps│ 0.3 Gbps│ 0.7 Gbps│   ↑ 8% │
└────────────────────────────────────────────────────┘
```

### Traffic Flow Analysis

```
TOP TRAFFIC FLOWS (Last 24 Hours)
=================================

Source          │ Destination     │ Application │ Bandwidth │ Path
────────────────┼─────────────────┼─────────────┼───────────┼──────
Mumbai-VPN10    │ Chennai-VPN10   │ SAP         │ 450 Mbps  │ MPLS
Mumbai-VPN10    │ Cloud-O365      │ Office365   │ 380 Mbps  │ Internet
Bangalore-VPN10 │ Mumbai-VPN10    │ Database    │ 280 Mbps  │ MPLS
London-VPN10    │ Mumbai-VPN10    │ Teams       │ 220 Mbps  │ MPLS
Delhi-VPN30     │ Chennai-VPN30   │ Voice       │ 180 Mbps  │ MPLS
Mumbai-VPN20    │ Internet        │ Guest       │ 150 Mbps  │ Internet
```

---

## Performance Analytics

### SLA Dashboard Analytics

```
SLA PERFORMANCE SUMMARY
=======================

Voice Applications (Real-Time SLA):
┌────────────────────────────────────────────────────────────────┐
│ Metric          │ Target │ Current │ 7-Day Avg │ Compliance   │
├────────────────────────────────────────────────────────────────┤
│ Latency         │ <150ms │  45 ms  │   48 ms   │ 99.8% ●      │
│ Jitter          │ <30ms  │   8 ms  │   10 ms   │ 99.9% ●      │
│ Packet Loss     │ <0.1%  │ 0.01%   │  0.02%    │ 99.95% ●     │
│ Availability    │ 99.99% │ 99.99%  │  99.99%   │ 100% ●       │
└────────────────────────────────────────────────────────────────┘

Business Applications (Business-Critical SLA):
┌────────────────────────────────────────────────────────────────┐
│ Metric          │ Target │ Current │ 7-Day Avg │ Compliance   │
├────────────────────────────────────────────────────────────────┤
│ Latency         │ <200ms │  67 ms  │   72 ms   │ 99.5% ●      │
│ Jitter          │ <50ms  │  12 ms  │   15 ms   │ 99.8% ●      │
│ Packet Loss     │ <0.5%  │ 0.02%   │  0.05%    │ 99.9% ●      │
│ Availability    │ 99.9%  │ 99.95%  │  99.92%   │ 100% ●       │
└────────────────────────────────────────────────────────────────┘

● Meeting SLA   ◐ Near Threshold (>95%)   ○ Below SLA (<95%)
```

### Path Analytics

```
PATH PERFORMANCE MATRIX
=======================

From Mumbai to all sites:
┌────────────────────────────────────────────────────────────────────┐
│ Destination │ MPLS Latency │ Internet Latency │ Active Path │ AAR  │
├────────────────────────────────────────────────────────────────────┤
│ Chennai     │    12 ms     │      18 ms       │    MPLS     │ ●    │
│ Bangalore   │    15 ms     │      22 ms       │    MPLS     │ ●    │
│ Delhi       │    18 ms     │      25 ms       │    MPLS     │ ●    │
│ Noida       │    20 ms     │      28 ms       │    MPLS     │ ●    │
│ London      │   142 ms     │     165 ms       │    MPLS     │ ●    │
│ Frankfurt   │   135 ms     │     158 ms       │    MPLS     │ ●    │
│ New Jersey  │   232 ms     │     255 ms       │    MPLS     │ ●    │
│ Dallas      │   248 ms     │     270 ms       │    MPLS     │ ●    │
└────────────────────────────────────────────────────────────────────┘

AAR: Application-Aware Routing Status
● Optimal path selected   ◐ Suboptimal   ○ SLA violation
```

---

## Predictive Analytics

### Capacity Forecasting

```python
#!/usr/bin/env python3
"""Capacity Forecasting Analytics"""

import numpy as np
from datetime import datetime, timedelta
import json

class CapacityForecaster:
    """Predict capacity needs based on historical data"""
    
    def __init__(self, historical_data):
        """
        historical_data: List of dicts with 'date' and 'utilization' keys
        """
        self.data = historical_data
    
    def calculate_growth_rate(self):
        """Calculate average monthly growth rate"""
        if len(self.data) < 2:
            return 0
        
        utilizations = [d["utilization"] for d in self.data]
        
        # Calculate month-over-month growth
        growth_rates = []
        for i in range(1, len(utilizations)):
            if utilizations[i-1] > 0:
                rate = (utilizations[i] - utilizations[i-1]) / utilizations[i-1]
                growth_rates.append(rate)
        
        return np.mean(growth_rates) if growth_rates else 0
    
    def forecast_utilization(self, months_ahead):
        """Forecast utilization for future months"""
        if not self.data:
            return []
        
        current = self.data[-1]["utilization"]
        growth_rate = self.calculate_growth_rate()
        
        forecasts = []
        for month in range(1, months_ahead + 1):
            projected = current * ((1 + growth_rate) ** month)
            forecasts.append({
                "month": month,
                "projected_utilization": round(projected, 2),
                "threshold_breach": projected > 80  # 80% threshold
            })
        
        return forecasts
    
    def calculate_runway(self, threshold=80):
        """Calculate months until threshold is reached"""
        current = self.data[-1]["utilization"] if self.data else 0
        growth_rate = self.calculate_growth_rate()
        
        if growth_rate <= 0 or current >= threshold:
            return 0 if current >= threshold else float('inf')
        
        # months = log(threshold/current) / log(1+growth_rate)
        months = np.log(threshold / current) / np.log(1 + growth_rate)
        return max(0, int(months))
    
    def generate_capacity_report(self):
        """Generate capacity planning report"""
        growth_rate = self.calculate_growth_rate()
        runway = self.calculate_runway()
        forecast = self.forecast_utilization(12)
        
        return {
            "generated_at": datetime.now().isoformat(),
            "current_utilization": self.data[-1]["utilization"] if self.data else 0,
            "monthly_growth_rate": round(growth_rate * 100, 2),
            "runway_months": runway,
            "recommendation": self._get_recommendation(runway),
            "12_month_forecast": forecast
        }
    
    def _get_recommendation(self, runway):
        """Get capacity recommendation based on runway"""
        if runway <= 3:
            return "CRITICAL: Immediate capacity expansion required"
        elif runway <= 6:
            return "WARNING: Plan capacity expansion within 3 months"
        elif runway <= 12:
            return "INFO: Monitor and plan capacity review"
        else:
            return "OK: Capacity sufficient for foreseeable future"


# Example usage
if __name__ == "__main__":
    # Sample historical data
    historical = [
        {"date": "2025-01", "utilization": 45},
        {"date": "2025-02", "utilization": 48},
        {"date": "2025-03", "utilization": 50},
        {"date": "2025-04", "utilization": 53},
        {"date": "2025-05", "utilization": 55},
        {"date": "2025-06", "utilization": 58},
        {"date": "2025-07", "utilization": 60},
        {"date": "2025-08", "utilization": 62},
        {"date": "2025-09", "utilization": 65},
        {"date": "2025-10", "utilization": 67},
        {"date": "2025-11", "utilization": 70},
        {"date": "2025-12", "utilization": 72}
    ]
    
    forecaster = CapacityForecaster(historical)
    report = forecaster.generate_capacity_report()
    print(json.dumps(report, indent=2))
```

### Anomaly Detection

```
ANOMALY DETECTION FRAMEWORK
===========================

Monitored Metrics:
├── Traffic volume (baseline ± 3σ)
├── Latency patterns (baseline ± 2σ)
├── Session counts (baseline ± 3σ)
├── Error rates (absolute threshold)
└── Path selections (policy compliance)

Recent Anomalies Detected:
┌────────────────────────────────────────────────────────────────────┐
│ Time       │ Metric      │ Expected │ Actual  │ Deviation │ Action │
├────────────────────────────────────────────────────────────────────┤
│ 14:23      │ Traffic     │ 4.2 Gbps │ 6.8 Gbps│ +62%      │ Alert  │
│ 12:15      │ Latency     │ 45 ms    │ 125 ms  │ +178%     │ Alert  │
│ 09:45      │ Sessions    │ 15,000   │ 8,500   │ -43%      │ Info   │
│ Yesterday  │ Path        │ MPLS     │ Internet│ Failover  │ Log    │
└────────────────────────────────────────────────────────────────────┘

Anomaly Status: 2 Active Investigations
```

---

## Reporting

### Automated Reports

| Report | Frequency | Recipients | Content |
|--------|-----------|------------|---------|
| Executive Summary | Weekly | Management | SLA, Cost, Availability |
| Operations Report | Daily | NOC, L2 | Health, Incidents, Changes |
| Performance Report | Weekly | Engineering | Metrics, Trends, Capacity |
| Security Report | Daily | Security | Threats, Compliance |
| SLA Report | Monthly | All | Detailed SLA analysis |

### Report Generation Script

```python
#!/usr/bin/env python3
"""Automated Report Generation"""

import json
from datetime import datetime, timedelta
from jinja2 import Template

class ReportGenerator:
    """Generate SD-WAN analytics reports"""
    
    def __init__(self, analytics_data):
        self.data = analytics_data
    
    def generate_executive_summary(self):
        """Generate executive summary report"""
        template = Template("""
# SD-WAN Executive Summary
Generated: {{ timestamp }}
Period: {{ period }}

## Health Score: {{ health_score }}/100

## Key Metrics
| Metric | Value | Trend |
|--------|-------|-------|
| Availability | {{ availability }}% | {{ availability_trend }} |
| SLA Compliance | {{ sla_compliance }}% | {{ sla_trend }} |
| Active Sites | {{ active_sites }}/{{ total_sites }} | - |
| WAN Cost | ${{ wan_cost }} | {{ cost_trend }} |

## Highlights
{% for highlight in highlights %}
- {{ highlight }}
{% endfor %}

## Actions Required
{% for action in actions %}
- {{ action }}
{% endfor %}
        """)
        
        return template.render(
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M"),
            period="Last 7 Days",
            health_score=self.data.get("health_score", 95),
            availability=self.data.get("availability", 99.99),
            availability_trend="↑",
            sla_compliance=self.data.get("sla_compliance", 99.5),
            sla_trend="→",
            active_sites=self.data.get("active_sites", 9),
            total_sites=self.data.get("total_sites", 9),
            wan_cost=self.data.get("wan_cost", 45000),
            cost_trend="↓ 5%",
            highlights=self.data.get("highlights", [
                "Zero P1 incidents this week",
                "SLA compliance maintained above target",
                "Successful DR test completed"
            ]),
            actions=self.data.get("actions", [
                "Certificate renewal due in 25 days",
                "Capacity review scheduled for next week"
            ])
        )
```

---

## Related Documentation

| Document | Description | Location |
|----------|-------------|----------|
| Monitoring Framework | Monitoring design | Section 6.3 |
| SLA Monitoring | SLA framework | Section 6.15 |
| Capacity Planning | Capacity management | Section 6.16 |
| AI/ML Analytics | Advanced ML features | Chapter 8.2 |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech | Initial release |

---

*This document is part of the SD-WAN Operations & Monitoring documentation series for Abhavtech.com*
