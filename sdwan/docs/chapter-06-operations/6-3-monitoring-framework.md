# 6.3 Monitoring Framework

## Document Information

| Field | Value |
|-------|-------|
| Document Title | Monitoring Framework |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Abhavtech |
| Classification | Internal Use |
| Target Audience | Network Operations, IT Management |

---

## Overview

This section defines the comprehensive monitoring framework for the Abhavtech SD-WAN infrastructure, covering all aspects of network health, performance, and availability monitoring.

### Monitoring Architecture

```
MONITORING FRAMEWORK ARCHITECTURE
=================================

                    ┌───────────────────────────────┐
                    │      MONITORING LAYERS        │
                    └───────────────────────────────┘
                                  │
    ┌─────────────────────────────┼─────────────────────────────┐
    │                             │                             │
    ▼                             ▼                             ▼
┌─────────┐                 ┌─────────┐                   ┌─────────┐
│ COLLECT │                 │ ANALYZE │                   │  ACT    │
├─────────┤                 ├─────────┤                   ├─────────┤
│ SNMP    │                 │ Trending│                   │ Alert   │
│ Syslog  │────────────────►│ Anomaly │──────────────────►│ Ticket  │
│ NetFlow │                 │ Baseline│                   │ Auto-   │
│ API     │                 │ Predict │                   │ remediate│
│ Traps   │                 │         │                   │         │
└─────────┘                 └─────────┘                   └─────────┘
    │                             │                             │
    └─────────────────────────────┼─────────────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │     REPORTING/DISPLAY     │
                    ├───────────────────────────┤
                    │ Dashboards │ Reports      │
                    │ Grafana    │ SLA Reports  │
                    │ vManage    │ Capacity     │
                    └───────────────────────────┘
```

---

## Monitoring Components

### Data Collection Layer

| Component | Protocol | Port | Data Type | Frequency |
|-----------|----------|------|-----------|-----------|
| vManage API | HTTPS | 443 | All metrics | 30-60 sec |
| SNMP Polling | SNMPv3 | 161 | Device metrics | 60 sec |
| SNMP Traps | SNMPv3 | 162 | Events | Real-time |
| Syslog | TLS | 6514 | Logs | Real-time |
| NetFlow | UDP | 2055 | Traffic | 60 sec |
| BFD | UDP | 3784 | Path health | 1 sec |

### Monitoring Targets

```
MONITORING TARGET HIERARCHY
===========================

Infrastructure Layer:
├── Controllers
│   ├── vManage (Cluster health, DB sync, services)
│   ├── vSmart (OMP, control connections)
│   └── vBond (DTLS, authentication)
├── WAN Edges
│   ├── Hardware (CPU, memory, temperature)
│   ├── Interfaces (status, errors, utilization)
│   ├── Tunnels (state, BFD, performance)
│   └── Routing (OMP, BGP, routes)
└── Transports
    ├── MPLS circuits
    ├── Internet circuits
    └── LTE/5G connections

Service Layer:
├── Overlay Network
│   ├── Tunnel health
│   ├── Path performance
│   └── Failover status
├── Segmentation
│   ├── VPN health
│   ├── VRF routing
│   └── Policy compliance
└── Security
    ├── Firewall status
    ├── Threat detection
    └── SGT propagation

Application Layer:
├── Application Performance
│   ├── Latency per app
│   ├── Loss per app
│   └── Path selection
├── SLA Compliance
│   ├── Real-time apps
│   ├── Business apps
│   └── Default traffic
└── User Experience
    ├── Response time
    ├── Availability
    └── Throughput
```

---

## Metrics Collection

### Controller Metrics

| Metric | Source | Threshold | Alert |
|--------|--------|-----------|-------|
| vManage CPU | SNMP/API | > 80% | Warning |
| vManage Memory | SNMP/API | > 85% | Warning |
| vManage Disk | SNMP/API | > 80% | Critical |
| Cluster Sync | API | Out-of-sync | Critical |
| DB Replication | API | Lag > 5 min | Warning |
| vSmart CPU | SNMP/API | > 70% | Warning |
| OMP Peers | API | < Expected | Critical |
| Control Connections | API | Any down | Warning |

### WAN Edge Metrics

| Metric | Source | Threshold | Alert |
|--------|--------|-----------|-------|
| Device CPU | SNMP/API | > 75% | Warning |
| Device Memory | SNMP/API | > 80% | Warning |
| Interface Status | SNMP/API | Down | Critical |
| Interface Errors | SNMP | > 0.1% | Warning |
| Interface Utilization | SNMP | > 80% | Warning |
| Tunnel State | API | Down | Critical |
| BFD State | API | Down | Critical |
| OMP Routes | API | Missing | Warning |
| Certificate Expiry | API | < 30 days | Warning |

### Performance Metrics

| Metric | Source | Threshold | Alert |
|--------|--------|-----------|-------|
| Tunnel Latency | BFD/API | > 100ms | Warning |
| Tunnel Jitter | BFD/API | > 30ms | Warning |
| Tunnel Loss | BFD/API | > 0.1% | Warning |
| App Latency (Voice) | API | > 150ms | Critical |
| App Latency (Business) | API | > 200ms | Warning |
| Throughput | SNMP | < Expected | Warning |

---

## SNMP Configuration

### SNMPv3 Setup on WAN Edge

```
! SNMP v3 Configuration
snmp-server group SDWAN-MON v3 priv
snmp-server user sdwan-monitor SDWAN-MON v3 auth sha Auth-P@ss123 priv aes 256 Priv-P@ss456
snmp-server host 10.10.50.30 version 3 priv sdwan-monitor
snmp-server host 10.10.50.31 version 3 priv sdwan-monitor

! Enable traps
snmp-server enable traps snmp authentication linkdown linkup
snmp-server enable traps config
snmp-server enable traps entity
snmp-server enable traps cpu threshold
snmp-server enable traps memory bufferpeak

! Interface monitoring
snmp-server ifindex persist

! SNMP view (optional - limit accessible OIDs)
snmp-server view SDWAN-VIEW iso included
snmp-server group SDWAN-MON v3 priv read SDWAN-VIEW
```

### Key SNMP OIDs

| OID | Description | Poll Interval |
|-----|-------------|---------------|
| 1.3.6.1.4.1.9.9.109.1.1.1.1.6 | CPU 5-min avg | 60 sec |
| 1.3.6.1.4.1.9.9.48.1.1.1.6 | Memory used | 60 sec |
| 1.3.6.1.2.1.2.2.1.8 | Interface status | 30 sec |
| 1.3.6.1.2.1.2.2.1.10 | Interface in octets | 60 sec |
| 1.3.6.1.2.1.2.2.1.16 | Interface out octets | 60 sec |
| 1.3.6.1.2.1.2.2.1.14 | Interface in errors | 60 sec |
| 1.3.6.1.2.1.2.2.1.20 | Interface out errors | 60 sec |
| 1.3.6.1.4.1.9.9.823 | Cisco SD-WAN MIB | 60 sec |

---

## Syslog Configuration

### Syslog Setup

```
! Syslog Configuration on WAN Edge
logging host 10.10.50.30 transport tls port 6514
logging host 10.10.50.31 transport tls port 6514
logging source-interface Loopback0
logging trap informational
logging origin-id hostname
logging facility local6

! Structured syslog
logging message-counter syslog

! TLS Configuration
logging tls-profile SYSLOG-TLS
 cipher-suite aes-256-cbc-sha
 trustpoint SDWAN-ROOT-CA
```

### Syslog Severity Levels

| Level | Name | Description | Action |
|-------|------|-------------|--------|
| 0 | Emergency | System unusable | Immediate escalation |
| 1 | Alert | Immediate action needed | P1 ticket |
| 2 | Critical | Critical conditions | P1/P2 ticket |
| 3 | Error | Error conditions | P2 ticket |
| 4 | Warning | Warning conditions | Review |
| 5 | Notice | Normal but significant | Log |
| 6 | Informational | Informational | Log |
| 7 | Debug | Debug messages | Troubleshooting only |

### Key Syslog Messages

| Pattern | Severity | Description | Action |
|---------|----------|-------------|--------|
| %SDWAN-4-CONTROL_CONNECTION | Warning | Control plane issue | Investigate |
| %SDWAN-3-BFD_SESSION_DOWN | Error | BFD failure | Critical alert |
| %SDWAN-2-TUNNEL_DOWN | Critical | Tunnel down | P1 ticket |
| %SDWAN-5-OMP_PEER | Notice | OMP state change | Log |
| %SYS-5-CONFIG_I | Notice | Config change | Audit |
| %AUTHPRIV-3-SYSTEM | Error | Auth failure | Security alert |
| %CRYPTO-4-IKMP | Warning | IPsec issue | Investigate |

---

## API-Based Monitoring

### vManage API Monitoring Script

```python
#!/usr/bin/env python3
"""SD-WAN Monitoring Data Collection"""

import requests
import json
import time
from datetime import datetime
import urllib3
urllib3.disable_warnings()

class SDWANMonitor:
    """Comprehensive SD-WAN monitoring"""
    
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
    
    def collect_device_metrics(self):
        """Collect device health metrics"""
        metrics = []
        
        # Get all devices
        devices_url = f"https://{self.vmanage}/dataservice/device"
        devices = self.session.get(devices_url, verify=False).json().get("data", [])
        
        for device in devices:
            device_ip = device.get("system-ip")
            
            # Get system status
            status_url = f"https://{self.vmanage}/dataservice/device/system/status?deviceId={device_ip}"
            status = self.session.get(status_url, verify=False).json().get("data", [{}])[0]
            
            # Get memory usage
            mem_url = f"https://{self.vmanage}/dataservice/device/system/memUsage?deviceId={device_ip}"
            mem = self.session.get(mem_url, verify=False).json().get("data", [{}])[0]
            
            metrics.append({
                "timestamp": datetime.utcnow().isoformat(),
                "device": device.get("host-name"),
                "system_ip": device_ip,
                "reachability": device.get("reachability"),
                "cpu_user": status.get("cpu_user", 0),
                "cpu_system": status.get("cpu_system", 0),
                "memory_used_percent": mem.get("mem_used_percent", 0),
                "uptime": device.get("uptime-date")
            })
        
        return metrics
    
    def collect_tunnel_metrics(self):
        """Collect tunnel health metrics"""
        metrics = []
        
        # Get all tunnels
        tunnels_url = f"https://{self.vmanage}/dataservice/device/tunnel"
        tunnels = self.session.get(tunnels_url, verify=False).json().get("data", [])
        
        for tunnel in tunnels:
            metrics.append({
                "timestamp": datetime.utcnow().isoformat(),
                "source_ip": tunnel.get("system-ip"),
                "destination_ip": tunnel.get("dest-system-ip"),
                "color": tunnel.get("color"),
                "state": tunnel.get("state"),
                "tx_packets": tunnel.get("tx-packets"),
                "rx_packets": tunnel.get("rx-packets"),
                "tx_bytes": tunnel.get("tx-bytes"),
                "rx_bytes": tunnel.get("rx-bytes")
            })
        
        return metrics
    
    def collect_bfd_metrics(self):
        """Collect BFD session metrics"""
        metrics = []
        
        # Get all BFD sessions
        bfd_url = f"https://{self.vmanage}/dataservice/device/bfd/sessions"
        sessions = self.session.get(bfd_url, verify=False).json().get("data", [])
        
        for session in sessions:
            metrics.append({
                "timestamp": datetime.utcnow().isoformat(),
                "source_ip": session.get("system-ip"),
                "destination_ip": session.get("dst-ip"),
                "color": session.get("color"),
                "state": session.get("state"),
                "transitions": session.get("transitions"),
                "tx_interval": session.get("tx-interval"),
                "uptime": session.get("uptime-date")
            })
        
        return metrics
    
    def collect_alarm_metrics(self):
        """Collect current alarms"""
        alarms_url = f"https://{self.vmanage}/dataservice/alarms"
        alarms = self.session.get(alarms_url, verify=False).json().get("data", [])
        
        return [{
            "timestamp": datetime.utcnow().isoformat(),
            "alarm_id": a.get("uuid"),
            "severity": a.get("severity"),
            "component": a.get("component"),
            "type": a.get("type"),
            "message": a.get("message"),
            "device": a.get("system-ip"),
            "acknowledged": a.get("acknowledged")
        } for a in alarms]
    
    def collect_all_metrics(self):
        """Collect all metrics"""
        return {
            "collection_time": datetime.utcnow().isoformat(),
            "devices": self.collect_device_metrics(),
            "tunnels": self.collect_tunnel_metrics(),
            "bfd_sessions": self.collect_bfd_metrics(),
            "alarms": self.collect_alarm_metrics()
        }


def main():
    """Main monitoring loop"""
    monitor = SDWANMonitor(
        vmanage_ip="10.255.0.10",
        username="monitor",
        password="monitor123"
    )
    
    while True:
        try:
            metrics = monitor.collect_all_metrics()
            
            # Output metrics (send to monitoring system)
            print(json.dumps(metrics, indent=2))
            
            # Wait for next collection interval
            time.sleep(60)
            
        except Exception as e:
            print(f"Error collecting metrics: {e}")
            time.sleep(30)


if __name__ == "__main__":
    main()
```

---

## Monitoring Integration

### Grafana Integration

```
GRAFANA DASHBOARD ARCHITECTURE
==============================

Data Sources:
├── vManage API → Prometheus Exporter
├── SNMP → Prometheus SNMP Exporter
├── Syslog → Loki
└── NetFlow → InfluxDB

Dashboards:
├── SD-WAN Overview
│   ├── Device health panel
│   ├── Tunnel status panel
│   └── Alarm summary panel
├── Performance Analysis
│   ├── Latency graphs
│   ├── Bandwidth charts
│   └── Application metrics
├── Security Monitoring
│   ├── Threat events
│   ├── Policy violations
│   └── SGT analytics
└── Capacity Planning
    ├── Utilization trends
    ├── Growth projections
    └── Threshold alerts
```

### Prometheus Exporter Configuration

```yaml
# prometheus-sdwan-exporter.yml
global:
  scrape_interval: 60s
  evaluation_interval: 60s

scrape_configs:
  - job_name: 'sdwan-vmanage'
    static_configs:
      - targets: ['sdwan-exporter:9100']
    metrics_path: /metrics
    scheme: http

  - job_name: 'sdwan-devices'
    static_configs:
      - targets:
        - '10.100.1.1:9116'  # Mumbai Hub
        - '10.100.2.1:9116'  # Chennai Hub
        - '10.100.3.1:9116'  # London Hub
    metrics_path: /snmp
    params:
      module: [cisco_sdwan]
    relabel_configs:
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: snmp-exporter:9116

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - '/etc/prometheus/rules/*.yml'
```

### Alert Rules

```yaml
# prometheus-alerts.yml
groups:
  - name: sdwan-critical
    rules:
      - alert: DeviceDown
        expr: sdwan_device_reachable == 0
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "SD-WAN device {{ $labels.hostname }} is down"
          description: "Device has been unreachable for more than 2 minutes"

      - alert: TunnelDown
        expr: sdwan_tunnel_state == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Tunnel down between {{ $labels.source }} and {{ $labels.destination }}"

      - alert: HighCPU
        expr: sdwan_device_cpu_percent > 80
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High CPU on {{ $labels.hostname }}"
          description: "CPU usage is {{ $value }}%"

      - alert: HighMemory
        expr: sdwan_device_memory_percent > 85
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High memory on {{ $labels.hostname }}"

      - alert: CertificateExpiry
        expr: sdwan_certificate_days_remaining < 30
        for: 1h
        labels:
          severity: warning
        annotations:
          summary: "Certificate expiring on {{ $labels.hostname }}"
          description: "Certificate expires in {{ $value }} days"
```

---

## Monitoring Procedures

### Daily Monitoring Tasks

| Time | Task | Tool | Responsibility |
|------|------|------|----------------|
| 08:00 | Review overnight alarms | vManage/Grafana | NOC |
| 08:30 | Check device health | vManage | NOC |
| 09:00 | Verify tunnel status | vManage | NOC |
| 10:00 | Review performance metrics | Grafana | L2 |
| 12:00 | Midday health check | vManage | NOC |
| 14:00 | Application SLA review | vManage | L2 |
| 16:00 | Security event review | vManage/SIEM | Security |
| 17:00 | End-of-day summary | All | NOC |

### Health Check Script

```bash
#!/bin/bash
# SD-WAN Daily Health Check Script

VMANAGE="10.255.0.10"
USERNAME="monitor"
PASSWORD="monitor123"

echo "=========================================="
echo "SD-WAN Daily Health Check"
echo "Date: $(date)"
echo "=========================================="

# Get authentication token
TOKEN=$(curl -sk -X POST "https://${VMANAGE}/j_security_check" \
    -d "j_username=${USERNAME}&j_password=${PASSWORD}" \
    -c cookies.txt)

XSRF=$(curl -sk "https://${VMANAGE}/dataservice/client/token" \
    -b cookies.txt)

# Device Health
echo ""
echo "=== Device Health ==="
curl -sk "https://${VMANAGE}/dataservice/device" \
    -b cookies.txt \
    -H "X-XSRF-TOKEN: ${XSRF}" | \
    jq -r '.data[] | "\(.["host-name"]): \(.reachability)"'

# Tunnel Status
echo ""
echo "=== Tunnel Status ==="
TUNNELS=$(curl -sk "https://${VMANAGE}/dataservice/device/tunnel" \
    -b cookies.txt \
    -H "X-XSRF-TOKEN: ${XSRF}")
    
UP=$(echo $TUNNELS | jq '[.data[] | select(.state=="up")] | length')
DOWN=$(echo $TUNNELS | jq '[.data[] | select(.state!="up")] | length')
echo "Tunnels Up: $UP"
echo "Tunnels Down: $DOWN"

# Active Alarms
echo ""
echo "=== Active Alarms ==="
curl -sk "https://${VMANAGE}/dataservice/alarms" \
    -b cookies.txt \
    -H "X-XSRF-TOKEN: ${XSRF}" | \
    jq -r '.data[] | select(.acknowledged==false) | "\(.severity): \(.message)"'

# Cleanup
rm -f cookies.txt

echo ""
echo "=========================================="
echo "Health Check Complete"
echo "=========================================="
```

---

## Capacity Monitoring

### Utilization Thresholds

| Resource | Warning | Critical | Action |
|----------|---------|----------|--------|
| CPU | 70% | 85% | Review workload |
| Memory | 75% | 90% | Check leaks |
| Disk | 70% | 85% | Archive logs |
| Interface | 70% | 85% | Add capacity |
| Tunnels | 80% | 90% | Review design |

### Capacity Trending

```
CAPACITY TRENDING METRICS
=========================

Collect Monthly:
├── Peak CPU utilization
├── Peak memory utilization
├── Peak interface utilization
├── Total tunnel count
├── Total sessions
└── Storage consumption

Trend Analysis:
├── 3-month rolling average
├── Growth rate calculation
├── Capacity runway (months until threshold)
└── Forecast vs actuals comparison

Planning Triggers:
├── Runway < 6 months → Review capacity
├── Growth > 20% MoM → Investigate
├── Forecast miss > 10% → Update model
└── New sites planned → Factor in growth
```

---

## Related Documentation

| Document | Description | Location |
|----------|-------------|----------|
| vManage Dashboards | Dashboard configuration | Section 6.2 |
| Alerting Configuration | Alert setup | Section 6.4 |
| Analytics Deep Dive | Advanced analytics | Section 6.5 |
| Capacity Planning | Capacity management | Section 6.16 |

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | December 2025 | Abhavtech | Initial release |

---

*This document is part of the SD-WAN Operations & Monitoring documentation series for Abhavtech.com*
