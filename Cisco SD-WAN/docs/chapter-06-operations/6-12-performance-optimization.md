# 6.12 Performance Optimization

## Document Information
- **Version**: 1.0
- **Last Updated**: December 2025
- **Author**: Abhavtech Network Team
- **Classification**: Internal Use

## Overview

This section provides comprehensive guidance for optimizing SD-WAN performance across Abhavtech's global infrastructure. Performance optimization ensures efficient utilization of network resources while maintaining application quality and user experience.

## Performance Optimization Framework

### Framework Architecture

```
+------------------------------------------------------------------+
|                PERFORMANCE OPTIMIZATION FRAMEWORK                 |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------+    +------------------+    +----------------+ |
|  | Baseline         |    | Monitor          |    | Analyze        | |
|  | Establishment    |    | Continuously     |    | Performance    | |
|  | - Metrics        |--->| - Real-time      |--->| - Trends       | |
|  | - Thresholds     |    | - Historical     |    | - Anomalies    | |
|  +------------------+    +------------------+    +----------------+ |
|           ^                                             |          |
|           |                                             v          |
|  +------------------+                          +----------------+  |
|  | Validate         |                          | Optimize       |  |
|  | Improvements     |<-------------------------| Configuration  |  |
|  | - Before/After   |                          | - Tunnels      |  |
|  | - User feedback  |                          | - QoS          |  |
|  +------------------+                          | - Policies     |  |
|                                                +----------------+  |
|                                                                    |
+------------------------------------------------------------------+
```

### Performance Dimensions

| Dimension | Metrics | Target | Optimization Focus |
|-----------|---------|--------|-------------------|
| Latency | Round-trip time | <100ms regional, <200ms global | Path selection, QoS |
| Throughput | Bandwidth utilization | 80% max sustained | Link capacity, shaping |
| Packet Loss | Loss percentage | <0.1% | Path redundancy, QoS |
| Jitter | Delay variation | <30ms for voice | Buffer tuning, prioritization |
| Availability | Uptime percentage | 99.95% | HA design, failover |

## Baseline Establishment

### Performance Baseline Metrics

```yaml
# Performance Baseline Configuration
baseline_metrics:
  network_performance:
    latency:
      india_regional:
        target_ms: 50
        acceptable_ms: 75
        critical_ms: 100
      emea_regional:
        target_ms: 60
        acceptable_ms: 90
        critical_ms: 120
      americas_regional:
        target_ms: 70
        acceptable_ms: 100
        critical_ms: 150
      india_to_emea:
        target_ms: 150
        acceptable_ms: 200
        critical_ms: 250
      india_to_americas:
        target_ms: 200
        acceptable_ms: 250
        critical_ms: 300
    
    throughput:
      hub_sites:
        mpls_mbps: 500
        internet_mbps: 200
        utilization_target: 70
        utilization_max: 85
      branch_sites:
        mpls_mbps: 100
        internet_mbps: 100
        utilization_target: 60
        utilization_max: 80
    
    packet_loss:
      mpls:
        target_percent: 0.01
        acceptable_percent: 0.05
        critical_percent: 0.1
      internet:
        target_percent: 0.1
        acceptable_percent: 0.5
        critical_percent: 1.0
    
    jitter:
      voice:
        target_ms: 10
        acceptable_ms: 20
        critical_ms: 30
      video:
        target_ms: 20
        acceptable_ms: 30
        critical_ms: 50
  
  application_performance:
    voice:
      mos_target: 4.0
      mos_acceptable: 3.6
      mos_critical: 3.0
    
    video:
      quality_target: "1080p"
      buffering_max_percent: 2
    
    sap:
      response_target_ms: 500
      response_acceptable_ms: 1000
    
    office365:
      latency_target_ms: 100
      latency_acceptable_ms: 200
```

### Baseline Collection Script

```python
#!/usr/bin/env python3
"""
Performance Baseline Collector
Collects baseline metrics for SD-WAN performance
"""

import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List
import statistics

class BaselineCollector:
    def __init__(self, vmanage_host: str, username: str, password: str):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
    
    def authenticate(self, username: str, password: str):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        self.session.post(
            auth_url,
            data={'j_username': username, 'j_password': password}
        )
    
    def collect_tunnel_metrics(self, hours: int = 24) -> Dict:
        """Collect tunnel performance metrics"""
        end_time = int(datetime.now().timestamp() * 1000)
        start_time = end_time - (hours * 3600 * 1000)
        
        url = f"{self.base_url}/dataservice/statistics/approute"
        params = {
            'startDate': start_time,
            'endDate': end_time,
            'timeZone': 'Asia/Kolkata'
        }
        
        response = self.session.get(url, params=params)
        data = response.json().get('data', [])
        
        # Aggregate metrics by site pair
        site_pairs = {}
        for entry in data:
            local_site = entry.get('local_site_id')
            remote_site = entry.get('remote_site_id')
            key = f"{local_site}-{remote_site}"
            
            if key not in site_pairs:
                site_pairs[key] = {
                    'latency': [],
                    'loss': [],
                    'jitter': []
                }
            
            site_pairs[key]['latency'].append(entry.get('latency', 0))
            site_pairs[key]['loss'].append(entry.get('loss', 0))
            site_pairs[key]['jitter'].append(entry.get('jitter', 0))
        
        # Calculate statistics
        baselines = {}
        for pair, metrics in site_pairs.items():
            baselines[pair] = {
                'latency': {
                    'avg': statistics.mean(metrics['latency']),
                    'p95': self._percentile(metrics['latency'], 95),
                    'max': max(metrics['latency'])
                },
                'loss': {
                    'avg': statistics.mean(metrics['loss']),
                    'p95': self._percentile(metrics['loss'], 95),
                    'max': max(metrics['loss'])
                },
                'jitter': {
                    'avg': statistics.mean(metrics['jitter']),
                    'p95': self._percentile(metrics['jitter'], 95),
                    'max': max(metrics['jitter'])
                }
            }
        
        return baselines
    
    def collect_interface_utilization(self, hours: int = 24) -> Dict:
        """Collect interface utilization metrics"""
        end_time = int(datetime.now().timestamp() * 1000)
        start_time = end_time - (hours * 3600 * 1000)
        
        url = f"{self.base_url}/dataservice/statistics/interface"
        params = {
            'startDate': start_time,
            'endDate': end_time
        }
        
        response = self.session.get(url, params=params)
        data = response.json().get('data', [])
        
        # Aggregate by device and interface
        interfaces = {}
        for entry in data:
            device = entry.get('vdevice_name')
            interface = entry.get('interface')
            key = f"{device}:{interface}"
            
            if key not in interfaces:
                interfaces[key] = {
                    'rx_kbps': [],
                    'tx_kbps': [],
                    'bandwidth_kbps': entry.get('if_speed', 1000000)
                }
            
            interfaces[key]['rx_kbps'].append(entry.get('rx_kbps', 0))
            interfaces[key]['tx_kbps'].append(entry.get('tx_kbps', 0))
        
        # Calculate utilization
        utilization = {}
        for iface, metrics in interfaces.items():
            bandwidth = metrics['bandwidth_kbps']
            avg_rx = statistics.mean(metrics['rx_kbps'])
            avg_tx = statistics.mean(metrics['tx_kbps'])
            peak_rx = max(metrics['rx_kbps'])
            peak_tx = max(metrics['tx_kbps'])
            
            utilization[iface] = {
                'avg_utilization_percent': ((avg_rx + avg_tx) / bandwidth) * 100,
                'peak_utilization_percent': ((peak_rx + peak_tx) / bandwidth) * 100,
                'avg_rx_mbps': avg_rx / 1000,
                'avg_tx_mbps': avg_tx / 1000,
                'peak_rx_mbps': peak_rx / 1000,
                'peak_tx_mbps': peak_tx / 1000
            }
        
        return utilization
    
    def collect_application_metrics(self, hours: int = 24) -> Dict:
        """Collect application performance metrics"""
        end_time = int(datetime.now().timestamp() * 1000)
        start_time = end_time - (hours * 3600 * 1000)
        
        url = f"{self.base_url}/dataservice/statistics/dpi"
        params = {
            'startDate': start_time,
            'endDate': end_time
        }
        
        response = self.session.get(url, params=params)
        data = response.json().get('data', [])
        
        # Aggregate by application
        applications = {}
        for entry in data:
            app = entry.get('application', 'unknown')
            
            if app not in applications:
                applications[app] = {
                    'bytes': [],
                    'packets': [],
                    'latency': []
                }
            
            applications[app]['bytes'].append(entry.get('total_bytes', 0))
            applications[app]['packets'].append(entry.get('total_packets', 0))
            if entry.get('latency'):
                applications[app]['latency'].append(entry.get('latency'))
        
        # Calculate statistics
        app_baselines = {}
        for app, metrics in applications.items():
            app_baselines[app] = {
                'total_bytes': sum(metrics['bytes']),
                'avg_bytes_per_interval': statistics.mean(metrics['bytes']),
                'avg_latency': statistics.mean(metrics['latency']) if metrics['latency'] else None
            }
        
        return app_baselines
    
    def _percentile(self, data: List[float], percentile: int) -> float:
        """Calculate percentile value"""
        if not data:
            return 0
        sorted_data = sorted(data)
        index = (percentile / 100) * (len(sorted_data) - 1)
        lower = int(index)
        upper = lower + 1
        if upper >= len(sorted_data):
            return sorted_data[-1]
        return sorted_data[lower] + (index - lower) * (sorted_data[upper] - sorted_data[lower])
    
    def generate_baseline_report(self) -> str:
        """Generate comprehensive baseline report"""
        tunnel_metrics = self.collect_tunnel_metrics(168)  # 7 days
        interface_util = self.collect_interface_utilization(168)
        app_metrics = self.collect_application_metrics(168)
        
        report = f"""
PERFORMANCE BASELINE REPORT
===========================
Collection Period: Last 7 days
Generated: {datetime.now().isoformat()}

TUNNEL PERFORMANCE BASELINE
---------------------------
"""
        for pair, metrics in sorted(tunnel_metrics.items()):
            report += f"\n{pair}:\n"
            report += f"  Latency: avg={metrics['latency']['avg']:.1f}ms, "
            report += f"p95={metrics['latency']['p95']:.1f}ms, "
            report += f"max={metrics['latency']['max']:.1f}ms\n"
            report += f"  Loss: avg={metrics['loss']['avg']:.3f}%, "
            report += f"p95={metrics['loss']['p95']:.3f}%\n"
            report += f"  Jitter: avg={metrics['jitter']['avg']:.1f}ms, "
            report += f"p95={metrics['jitter']['p95']:.1f}ms\n"
        
        report += """
INTERFACE UTILIZATION BASELINE
------------------------------
"""
        for iface, util in sorted(interface_util.items()):
            report += f"\n{iface}:\n"
            report += f"  Avg Utilization: {util['avg_utilization_percent']:.1f}%\n"
            report += f"  Peak Utilization: {util['peak_utilization_percent']:.1f}%\n"
            report += f"  Avg Throughput: {util['avg_rx_mbps']:.1f}/{util['avg_tx_mbps']:.1f} Mbps (RX/TX)\n"
        
        report += """
TOP APPLICATIONS BY VOLUME
--------------------------
"""
        sorted_apps = sorted(
            app_metrics.items(),
            key=lambda x: x[1]['total_bytes'],
            reverse=True
        )[:10]
        
        for app, metrics in sorted_apps:
            gb = metrics['total_bytes'] / (1024**3)
            report += f"  {app}: {gb:.2f} GB"
            if metrics['avg_latency']:
                report += f" (avg latency: {metrics['avg_latency']:.1f}ms)"
            report += "\n"
        
        return report


# Example usage
if __name__ == "__main__":
    collector = BaselineCollector(
        vmanage_host="vmanage.abhavtech.com",
        username="admin",
        password="secure_password"
    )
    
    print(collector.generate_baseline_report())
```

## Tunnel Optimization

### Tunnel Configuration Best Practices

```
+------------------------------------------------------------------+
|                   TUNNEL OPTIMIZATION                             |
+------------------------------------------------------------------+
|                                                                    |
|  BFD TUNING                                                       |
|  ----------                                                       |
|  Default: 1000ms hello, 7 multiplier (7 second detection)         |
|                                                                    |
|  Low Latency Links (<50ms):                                       |
|    bfd color mpls hello-interval 300 multiplier 3                 |
|    Detection: 900ms                                               |
|                                                                    |
|  High Latency Links (>150ms):                                     |
|    bfd color internet hello-interval 1000 multiplier 10           |
|    Detection: 10 seconds (avoids false positives)                 |
|                                                                    |
|  MTU OPTIMIZATION                                                  |
|  ----------------                                                 |
|  Default: 1500 bytes                                              |
|  IPsec overhead: 62 bytes (ESP + IV + Padding + Auth)             |
|  Recommended tunnel MTU: 1400 bytes                               |
|                                                                    |
|    interface GigabitEthernet0/0/0                                 |
|      mtu 1500                                                     |
|      ip mtu 1400                                                  |
|      tcp adjust-mss 1360                                          |
|                                                                    |
|  TUNNEL SCALING                                                   |
|  --------------                                                   |
|  Hub-and-Spoke: Full mesh to hubs, spoke-to-spoke via hub        |
|  Regional Mesh: Full mesh within region, hub connectivity         |
|                                                                    |
+------------------------------------------------------------------+
```

### BFD Optimization Configuration

```
! BFD Template for Low-Latency MPLS
bfd app-route multiplier 3
bfd app-route poll-interval 300000

! BFD Template for Internet (Higher Latency)
bfd app-route multiplier 10
bfd app-route poll-interval 1000000

! Per-Color BFD Tuning
sdwan
 bfd color mpls
  hello-interval 300
  pmtu-discovery
  multiplier 3
 !
 bfd color public-internet
  hello-interval 1000
  pmtu-discovery
  multiplier 7
 !
 bfd color lte
  hello-interval 1000
  pmtu-discovery
  multiplier 10
 !
!
```

### Tunnel Path Optimization

```python
#!/usr/bin/env python3
"""
Tunnel Path Optimizer
Analyzes and recommends tunnel optimizations
"""

import requests
from typing import Dict, List, Tuple

class TunnelOptimizer:
    def __init__(self, vmanage_host: str, username: str, password: str):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
    
    def authenticate(self, username: str, password: str):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        self.session.post(
            auth_url,
            data={'j_username': username, 'j_password': password}
        )
    
    def analyze_tunnel_performance(self) -> List[Dict]:
        """Analyze tunnel performance and identify issues"""
        url = f"{self.base_url}/dataservice/device/tunnel/statistics"
        response = self.session.get(url)
        tunnels = response.json().get('data', [])
        
        issues = []
        for tunnel in tunnels:
            # Check for high latency
            latency = tunnel.get('latency', 0)
            if latency > 200:
                issues.append({
                    'type': 'high_latency',
                    'device': tunnel.get('vdevice_name'),
                    'tunnel': tunnel.get('dest_ip'),
                    'value': latency,
                    'recommendation': 'Consider route optimization or different transport'
                })
            
            # Check for packet loss
            loss = tunnel.get('loss', 0)
            if loss > 1:
                issues.append({
                    'type': 'packet_loss',
                    'device': tunnel.get('vdevice_name'),
                    'tunnel': tunnel.get('dest_ip'),
                    'value': loss,
                    'recommendation': 'Check transport circuit quality, consider FEC'
                })
            
            # Check for high jitter
            jitter = tunnel.get('jitter', 0)
            if jitter > 50:
                issues.append({
                    'type': 'high_jitter',
                    'device': tunnel.get('vdevice_name'),
                    'tunnel': tunnel.get('dest_ip'),
                    'value': jitter,
                    'recommendation': 'Enable QoS, check for congestion'
                })
            
            # Check for BFD flapping
            bfd_flaps = tunnel.get('bfd_flaps', 0)
            if bfd_flaps > 10:
                issues.append({
                    'type': 'bfd_flapping',
                    'device': tunnel.get('vdevice_name'),
                    'tunnel': tunnel.get('dest_ip'),
                    'value': bfd_flaps,
                    'recommendation': 'Increase BFD multiplier or hello interval'
                })
        
        return issues
    
    def recommend_bfd_tuning(self, device_id: str) -> Dict:
        """Recommend BFD tuning based on path characteristics"""
        # Get tunnel statistics
        url = f"{self.base_url}/dataservice/device/tunnel/statistics"
        params = {'deviceId': device_id}
        response = self.session.get(url, params=params)
        tunnels = response.json().get('data', [])
        
        recommendations = {}
        for tunnel in tunnels:
            color = tunnel.get('local_color', 'unknown')
            avg_latency = tunnel.get('latency', 50)
            jitter = tunnel.get('jitter', 10)
            
            # Calculate recommended BFD settings
            if avg_latency < 50:
                # Low latency - aggressive detection
                hello = 300
                multiplier = 3
            elif avg_latency < 150:
                # Medium latency - balanced
                hello = 500
                multiplier = 5
            else:
                # High latency - conservative
                hello = 1000
                multiplier = max(7, int(avg_latency / 100) + 5)
            
            # Adjust for jitter
            if jitter > 30:
                multiplier += 2
            
            recommendations[color] = {
                'current_latency': avg_latency,
                'current_jitter': jitter,
                'recommended_hello': hello,
                'recommended_multiplier': multiplier,
                'detection_time_ms': hello * multiplier
            }
        
        return recommendations
    
    def generate_optimization_report(self) -> str:
        """Generate tunnel optimization report"""
        issues = self.analyze_tunnel_performance()
        
        report = """
TUNNEL OPTIMIZATION REPORT
==========================

IDENTIFIED ISSUES
-----------------
"""
        if not issues:
            report += "No significant issues identified.\n"
        else:
            for issue in issues:
                report += f"\nDevice: {issue['device']}\n"
                report += f"  Issue: {issue['type']}\n"
                report += f"  Tunnel: {issue['tunnel']}\n"
                report += f"  Value: {issue['value']}\n"
                report += f"  Recommendation: {issue['recommendation']}\n"
        
        return report


# Example usage
if __name__ == "__main__":
    optimizer = TunnelOptimizer(
        vmanage_host="vmanage.abhavtech.com",
        username="admin",
        password="secure_password"
    )
    
    print(optimizer.generate_optimization_report())
```

## QoS Optimization

### QoS Configuration Framework

```
+------------------------------------------------------------------+
|                      QOS OPTIMIZATION                             |
+------------------------------------------------------------------+
|                                                                    |
|  CLASSIFICATION                                                   |
|  --------------                                                   |
|  DPI-based: Automatic application detection                       |
|  DSCP-based: Trust markings from SD-Access                        |
|  ACL-based: Manual classification rules                           |
|                                                                    |
|  QUEUE STRUCTURE                                                  |
|  ---------------                                                  |
|  +--------------------+--------------------+                      |
|  | Queue              | Bandwidth          |                      |
|  |--------------------|--------------------+                      |
|  | Queue 0 (Control)  | 5% (strict)        |                      |
|  | Queue 1 (Voice)    | 10% (LLQ)          |                      |
|  | Queue 2 (Video)    | 20%                |                      |
|  | Queue 3 (Critical) | 25%                |                      |
|  | Queue 4 (Default)  | 25%                |                      |
|  | Queue 5 (Bulk)     | 15%                |                      |
|  +--------------------+--------------------+                      |
|                                                                    |
|  DSCP MAPPING                                                     |
|  ------------                                                     |
|  Voice: EF (46) -> Queue 1                                        |
|  Video: AF41 (34) -> Queue 2                                      |
|  Critical: AF31 (26) -> Queue 3                                   |
|  Default: DF (0) -> Queue 4                                       |
|  Bulk: CS1 (8) -> Queue 5                                         |
|                                                                    |
+------------------------------------------------------------------+
```

### Optimized QoS Policy

```
! QoS Policy Configuration
policy
 qos-map ENTERPRISE-QOS
  queue 0
   class Queue0
   bandwidth percent 5
   no buffer-percent
  !
  queue 1
   class Queue1
   bandwidth percent 10
   buffer-percent 10
   scheduling llq
  !
  queue 2
   class Queue2
   bandwidth percent 20
   buffer-percent 20
  !
  queue 3
   class Queue3
   bandwidth percent 25
   buffer-percent 25
  !
  queue 4
   class Queue4
   bandwidth percent 25
   buffer-percent 25
  !
  queue 5
   class Queue5
   bandwidth percent 15
   buffer-percent 20
  !
 !
 qos-scheduler ENTERPRISE-SCHEDULER
  class Queue0
   match dscp 48
   queue 0
  !
  class Queue1
   match dscp 46
   queue 1
  !
  class Queue2
   match dscp 34
   queue 2
  !
  class Queue3
   match dscp 26
   queue 3
  !
  class Queue4
   match dscp default
   queue 4
  !
  class Queue5
   match dscp 8
   queue 5
  !
 !
!
```

### QoS Performance Monitor

```python
#!/usr/bin/env python3
"""
QoS Performance Monitor
Monitors QoS queue utilization and drops
"""

import requests
from typing import Dict, List
from datetime import datetime

class QoSMonitor:
    def __init__(self, vmanage_host: str, username: str, password: str):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
    
    def authenticate(self, username: str, password: str):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        self.session.post(
            auth_url,
            data={'j_username': username, 'j_password': password}
        )
    
    def get_qos_statistics(self, device_id: str) -> Dict:
        """Get QoS queue statistics for device"""
        url = f"{self.base_url}/dataservice/device/qos"
        params = {'deviceId': device_id}
        
        response = self.session.get(url, params=params)
        return response.json().get('data', [])
    
    def analyze_queue_health(self, device_id: str) -> Dict:
        """Analyze QoS queue health"""
        stats = self.get_qos_statistics(device_id)
        
        analysis = {
            'device': device_id,
            'timestamp': datetime.now().isoformat(),
            'queues': {},
            'issues': []
        }
        
        for queue in stats:
            queue_num = queue.get('queue')
            tx_packets = queue.get('tx_packets', 0)
            drop_packets = queue.get('drop_packets', 0)
            
            drop_rate = (drop_packets / tx_packets * 100) if tx_packets > 0 else 0
            
            analysis['queues'][queue_num] = {
                'tx_packets': tx_packets,
                'drop_packets': drop_packets,
                'drop_rate_percent': drop_rate
            }
            
            # Check for issues
            if drop_rate > 1:
                analysis['issues'].append({
                    'queue': queue_num,
                    'issue': 'High drop rate',
                    'value': drop_rate,
                    'recommendation': 'Increase queue bandwidth or reduce traffic'
                })
            
            # Check voice queue specifically
            if queue_num == 1 and drop_packets > 0:
                analysis['issues'].append({
                    'queue': queue_num,
                    'issue': 'Voice queue drops',
                    'value': drop_packets,
                    'recommendation': 'Check LLQ configuration and voice traffic marking'
                })
        
        return analysis
    
    def recommend_queue_adjustment(self, device_id: str) -> Dict:
        """Recommend queue bandwidth adjustments"""
        stats = self.get_qos_statistics(device_id)
        
        total_tx = sum(q.get('tx_packets', 0) for q in stats)
        recommendations = {}
        
        for queue in stats:
            queue_num = queue.get('queue')
            tx_packets = queue.get('tx_packets', 0)
            drop_packets = queue.get('drop_packets', 0)
            current_bw = queue.get('bandwidth_percent', 0)
            
            # Calculate actual usage
            actual_usage = (tx_packets / total_tx * 100) if total_tx > 0 else 0
            drop_rate = (drop_packets / tx_packets * 100) if tx_packets > 0 else 0
            
            # Determine if adjustment needed
            if drop_rate > 1 and actual_usage > current_bw * 0.9:
                # Queue is overloaded
                recommended_bw = min(current_bw + 5, 40)
                adjustment = 'increase'
            elif actual_usage < current_bw * 0.3 and queue_num not in [0, 1]:
                # Queue is underutilized
                recommended_bw = max(current_bw - 5, 5)
                adjustment = 'decrease'
            else:
                recommended_bw = current_bw
                adjustment = 'none'
            
            recommendations[queue_num] = {
                'current_bandwidth': current_bw,
                'actual_usage': actual_usage,
                'drop_rate': drop_rate,
                'recommended_bandwidth': recommended_bw,
                'adjustment': adjustment
            }
        
        return recommendations


# Example usage
if __name__ == "__main__":
    monitor = QoSMonitor(
        vmanage_host="vmanage.abhavtech.com",
        username="admin",
        password="secure_password"
    )
    
    # Analyze specific device
    health = monitor.analyze_queue_health("10.100.1.1")
    print(f"Queue Health: {health}")
    
    # Get recommendations
    recs = monitor.recommend_queue_adjustment("10.100.1.1")
    print(f"Recommendations: {recs}")
```

## Application Performance Optimization

### AAR Optimization

```
+------------------------------------------------------------------+
|              APPLICATION-AWARE ROUTING OPTIMIZATION               |
+------------------------------------------------------------------+
|                                                                    |
|  SLA CLASS TUNING                                                 |
|  ----------------                                                 |
|                                                                    |
|  Voice SLA (Conservative):                                        |
|    Latency: 100ms | Loss: 1% | Jitter: 30ms                       |
|    Fallback: Any available path                                   |
|                                                                    |
|  Video SLA (Balanced):                                            |
|    Latency: 200ms | Loss: 2% | Jitter: 50ms                       |
|    Fallback: MPLS only                                            |
|                                                                    |
|  Critical Apps SLA:                                               |
|    Latency: 300ms | Loss: 3% | Jitter: N/A                        |
|    Fallback: Any transport                                        |
|                                                                    |
|  MEASUREMENT TUNING                                               |
|  -----------------                                                |
|  app-route poll-interval: 10 seconds (default 120)                |
|  Faster detection for real-time apps                              |
|                                                                    |
|  PATH SELECTION                                                   |
|  --------------                                                   |
|  Primary: MPLS (lower latency)                                    |
|  Secondary: Internet (backup)                                     |
|  Preference: MPLS=1, Internet=2                                   |
|                                                                    |
+------------------------------------------------------------------+
```

### Cloud OnRamp Optimization

```yaml
# Cloud OnRamp for SaaS Optimization
cloud_onramp:
  office365:
    enabled: true
    probing:
      interval_seconds: 10
      timeout_ms: 2000
    optimization:
      direct_internet_access: true
      preferred_transport: internet
      fallback: mpls_to_dia
    sites:
      - mumbai
      - chennai
      - london
      - new_jersey
  
  salesforce:
    enabled: true
    probing:
      interval_seconds: 30
      timeout_ms: 3000
    optimization:
      direct_internet_access: true
      preferred_transport: internet
      gateway: sig_zscaler
  
  aws:
    enabled: true
    regions:
      - ap-south-1    # Mumbai
      - eu-west-1     # Ireland
      - us-east-1     # Virginia
    connection_type: internet
    redundancy: multi-path
```

### DPI Optimization

```
! Enable DPI with caching for better performance
sdwan
 appqoe
  service-insertion
   tcpopt enable
   dreopt enable
  !
  dpi
   field-types all
   cache-timeout 3600
  !
 !
!

! Custom Application Definition
app-list CUSTOM-APPS
 app SAP-HANA
  l3-l4 tcp port 30015-30020
  server-names sap.abhavtech.com
 !
 app CUSTOM-ERP
  l3-l4 tcp port 8443
  server-names erp.abhavtech.com
 !
!
```

## Resource Optimization

### CPU and Memory Optimization

```python
#!/usr/bin/env python3
"""
Resource Optimization Advisor
Monitors and advises on device resource optimization
"""

import requests
from typing import Dict, List
from datetime import datetime

class ResourceOptimizer:
    def __init__(self, vmanage_host: str, username: str, password: str):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        
        # Resource thresholds
        self.thresholds = {
            'cpu_warning': 70,
            'cpu_critical': 85,
            'memory_warning': 75,
            'memory_critical': 90,
            'disk_warning': 80,
            'disk_critical': 95
        }
    
    def authenticate(self, username: str, password: str):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        self.session.post(
            auth_url,
            data={'j_username': username, 'j_password': password}
        )
    
    def get_device_resources(self) -> List[Dict]:
        """Get resource utilization for all devices"""
        url = f"{self.base_url}/dataservice/device/system/status"
        response = self.session.get(url)
        return response.json().get('data', [])
    
    def analyze_resources(self) -> Dict:
        """Analyze resource utilization across fabric"""
        devices = self.get_device_resources()
        
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'devices': {},
            'summary': {
                'total_devices': len(devices),
                'healthy': 0,
                'warning': 0,
                'critical': 0
            },
            'recommendations': []
        }
        
        for device in devices:
            device_id = device.get('system_ip', 'unknown')
            cpu = device.get('cpu_user', 0) + device.get('cpu_system', 0)
            memory = device.get('mem_used', 0)
            disk = device.get('disk_used', 0)
            
            status = 'healthy'
            issues = []
            
            # Check CPU
            if cpu >= self.thresholds['cpu_critical']:
                status = 'critical'
                issues.append(f'CPU critical: {cpu}%')
            elif cpu >= self.thresholds['cpu_warning']:
                status = 'warning'
                issues.append(f'CPU warning: {cpu}%')
            
            # Check Memory
            if memory >= self.thresholds['memory_critical']:
                status = 'critical'
                issues.append(f'Memory critical: {memory}%')
            elif memory >= self.thresholds['memory_warning']:
                if status != 'critical':
                    status = 'warning'
                issues.append(f'Memory warning: {memory}%')
            
            # Check Disk
            if disk >= self.thresholds['disk_critical']:
                status = 'critical'
                issues.append(f'Disk critical: {disk}%')
            elif disk >= self.thresholds['disk_warning']:
                if status != 'critical':
                    status = 'warning'
                issues.append(f'Disk warning: {disk}%')
            
            analysis['devices'][device_id] = {
                'cpu': cpu,
                'memory': memory,
                'disk': disk,
                'status': status,
                'issues': issues
            }
            
            analysis['summary'][status] += 1
            
            # Generate recommendations
            if cpu >= self.thresholds['cpu_warning']:
                analysis['recommendations'].append({
                    'device': device_id,
                    'issue': 'High CPU',
                    'current': cpu,
                    'actions': [
                        'Review DPI configuration (high CPU consumer)',
                        'Check for routing loops or excessive updates',
                        'Consider hardware upgrade if persistent'
                    ]
                })
            
            if memory >= self.thresholds['memory_warning']:
                analysis['recommendations'].append({
                    'device': device_id,
                    'issue': 'High Memory',
                    'current': memory,
                    'actions': [
                        'Clear old logs: request nms log-cleanup',
                        'Check for memory leaks (known bugs)',
                        'Reduce tunnel count if excessive'
                    ]
                })
            
            if disk >= self.thresholds['disk_warning']:
                analysis['recommendations'].append({
                    'device': device_id,
                    'issue': 'High Disk',
                    'current': disk,
                    'actions': [
                        'Clear old software images: request software remove',
                        'Clear old core dumps',
                        'Adjust log rotation settings'
                    ]
                })
        
        return analysis
    
    def generate_report(self) -> str:
        """Generate resource optimization report"""
        analysis = self.analyze_resources()
        
        report = f"""
RESOURCE OPTIMIZATION REPORT
============================
Generated: {analysis['timestamp']}

SUMMARY
-------
Total Devices: {analysis['summary']['total_devices']}
Healthy: {analysis['summary']['healthy']}
Warning: {analysis['summary']['warning']}
Critical: {analysis['summary']['critical']}

DEVICE STATUS
-------------
"""
        for device_id, data in analysis['devices'].items():
            report += f"\n{device_id}: {data['status'].upper()}\n"
            report += f"  CPU: {data['cpu']}% | Memory: {data['memory']}% | Disk: {data['disk']}%\n"
            if data['issues']:
                for issue in data['issues']:
                    report += f"  - {issue}\n"
        
        if analysis['recommendations']:
            report += """
RECOMMENDATIONS
---------------
"""
            for rec in analysis['recommendations']:
                report += f"\n{rec['device']} - {rec['issue']} ({rec['current']}%)\n"
                for action in rec['actions']:
                    report += f"  → {action}\n"
        
        return report


# Example usage
if __name__ == "__main__":
    optimizer = ResourceOptimizer(
        vmanage_host="vmanage.abhavtech.com",
        username="admin",
        password="secure_password"
    )
    
    print(optimizer.generate_report())
```

### Feature Optimization Guidelines

| Feature | CPU Impact | Memory Impact | Optimization |
|---------|------------|---------------|--------------|
| DPI | High | Medium | Disable if not needed, use custom apps sparingly |
| TCP Optimization | Medium | Medium | Enable only for high-latency links |
| SSL/TLS Proxy | Very High | High | Use selectively for specific apps |
| Packet Duplication | Low | Low | Enable only for critical links with loss |
| FEC | Medium | Low | Use instead of duplication when possible |
| Full Mesh Tunnels | Medium | High | Use hub-spoke for large deployments |

## Performance Optimization Checklist

```
+------------------------------------------------------------------+
|              PERFORMANCE OPTIMIZATION CHECKLIST                   |
+------------------------------------------------------------------+
|                                                                    |
|  TUNNEL OPTIMIZATION                                              |
|  [ ] BFD tuned for link characteristics                           |
|  [ ] MTU optimized (1400 for tunnels)                             |
|  [ ] TCP MSS adjusted (1360)                                      |
|  [ ] Appropriate mesh topology                                     |
|  [ ] TLOC preferences configured                                   |
|                                                                    |
|  QOS OPTIMIZATION                                                 |
|  [ ] Queue structure matches traffic profile                      |
|  [ ] Voice queue configured as LLQ                                |
|  [ ] DSCP markings preserved from SD-Access                       |
|  [ ] Shaper configured for circuit capacity                       |
|  [ ] No significant queue drops                                   |
|                                                                    |
|  APPLICATION OPTIMIZATION                                         |
|  [ ] DPI enabled and working                                      |
|  [ ] AAR policies configured for critical apps                    |
|  [ ] SLA classes tuned appropriately                              |
|  [ ] Cloud OnRamp enabled for SaaS                                |
|  [ ] Custom applications defined                                   |
|                                                                    |
|  RESOURCE OPTIMIZATION                                            |
|  [ ] CPU utilization <70% sustained                               |
|  [ ] Memory utilization <75%                                      |
|  [ ] Disk utilization <80%                                        |
|  [ ] Unnecessary features disabled                                |
|  [ ] Log rotation configured                                      |
|                                                                    |
|  MONITORING                                                       |
|  [ ] Baselines established                                        |
|  [ ] Alerting configured                                          |
|  [ ] Regular performance reviews                                   |
|  [ ] Capacity planning active                                     |
|                                                                    |
+------------------------------------------------------------------+
```

---

*Document version: 1.0*
*Last updated: December 2025*
*Classification: Internal Use*
