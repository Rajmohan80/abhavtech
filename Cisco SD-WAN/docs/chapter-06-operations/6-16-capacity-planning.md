# 6.16 Capacity Planning

## 6.16.1 Capacity Planning Framework

### Framework Overview

```yaml
capacity_planning_framework:
  purpose: "Ensure adequate resources to meet current and future demands"
  
  components:
    demand_forecasting:
      description: "Predict future capacity requirements"
      methods:
        - "Historical trend analysis"
        - "Business growth projections"
        - "Application roadmap alignment"
        
    capacity_monitoring:
      description: "Track current resource utilization"
      metrics:
        - "Bandwidth utilization"
        - "Device resources"
        - "Tunnel capacity"
        - "Controller resources"
        
    capacity_optimization:
      description: "Maximize efficiency of existing resources"
      techniques:
        - "Traffic engineering"
        - "QoS optimization"
        - "Resource consolidation"
        
    capacity_expansion:
      description: "Plan and implement capacity increases"
      triggers:
        - "80% sustained utilization"
        - "Growth projections"
        - "New site deployments"
```

### Planning Cycles

```yaml
capacity_planning_cycles:
  operational:
    frequency: "Weekly"
    focus: "Current utilization monitoring"
    deliverables:
      - "Utilization dashboard"
      - "Threshold alerts"
      - "Immediate action items"
      
  tactical:
    frequency: "Monthly"
    focus: "30-90 day capacity needs"
    deliverables:
      - "Monthly capacity report"
      - "Short-term upgrade plans"
      - "Budget requests"
      
  strategic:
    frequency: "Quarterly/Annual"
    focus: "6-24 month capacity roadmap"
    deliverables:
      - "Capacity roadmap"
      - "Technology refresh plan"
      - "Capital budget planning"
```

---

## 6.16.2 Bandwidth Capacity Planning

### Current Bandwidth Inventory

```yaml
bandwidth_inventory:
  hub_sites:
    mumbai_hub:
      mpls_circuit:
        provider: "Tata Communications"
        bandwidth: "1 Gbps"
        contract_end: "2026-06-30"
        upgrade_options: "2G, 5G, 10G"
      internet_circuit:
        provider: "Jio Business"
        bandwidth: "500 Mbps"
        contract_end: "2025-12-31"
        upgrade_options: "1G, 2G"
      backup_5g:
        provider: "Airtel 5G"
        bandwidth: "200 Mbps (burst)"
        
    chennai_hub:
      mpls_circuit:
        provider: "Tata Communications"
        bandwidth: "500 Mbps"
        upgrade_options: "1G, 2G"
      internet_circuit:
        provider: "ACT Fibernet"
        bandwidth: "300 Mbps"
        
  branch_sites:
    bangalore:
      mpls: "200 Mbps"
      internet: "100 Mbps"
    delhi:
      mpls: "200 Mbps"
      internet: "100 Mbps"
    london:
      mpls: "100 Mbps"
      internet: "100 Mbps"
    newjersey:
      mpls: "100 Mbps"
      internet: "200 Mbps"
```

### Bandwidth Utilization Monitoring

```python
#!/usr/bin/env python3
"""
Bandwidth Capacity Monitor
Monitors and reports bandwidth utilization for capacity planning
"""

import requests
import json
from datetime import datetime, timedelta
from collections import defaultdict

class BandwidthCapacityMonitor:
    def __init__(self, vmanage_host, username, password):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        
        # Bandwidth inventory (configured capacity in Mbps)
        self.bandwidth_inventory = {
            'mumbai-hub-edge01': {
                'mpls': 1000,
                'internet': 500,
                'lte': 200
            },
            'chennai-hub-edge01': {
                'mpls': 500,
                'internet': 300
            },
            'bangalore-branch-edge01': {
                'mpls': 200,
                'internet': 100
            }
        }
        
        # Thresholds
        self.thresholds = {
            'warning': 70,
            'critical': 80,
            'upgrade_trigger': 85
        }
        
    def authenticate(self, username, password):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        payload = {'j_username': username, 'j_password': password}
        self.session.post(auth_url, data=payload)
        
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
            
    def get_interface_statistics(self, device_id, hours=168):  # 7 days
        """Get interface utilization statistics"""
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=hours)
        
        url = f"{self.base_url}/dataservice/statistics/interface/aggregation"
        params = {
            'startDate': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'endDate': end_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'deviceId': device_id,
            'count': 10000
        }
        
        response = self.session.get(url, params=params)
        return response.json() if response.status_code == 200 else None
        
    def calculate_utilization(self, throughput_bps, capacity_mbps):
        """Calculate utilization percentage"""
        capacity_bps = capacity_mbps * 1000000
        return (throughput_bps / capacity_bps) * 100 if capacity_bps > 0 else 0
        
    def analyze_site_capacity(self, device_id, site_name):
        """Analyze capacity utilization for a site"""
        stats = self.get_interface_statistics(device_id)
        
        analysis = {
            'device_id': device_id,
            'site_name': site_name,
            'timestamp': datetime.now().isoformat(),
            'interfaces': [],
            'summary': {
                'highest_utilization': 0,
                'interfaces_warning': 0,
                'interfaces_critical': 0,
                'upgrade_recommended': []
            }
        }
        
        if not stats or 'data' not in stats:
            return analysis
            
        # Group by interface
        interface_data = defaultdict(list)
        for record in stats['data']:
            iface = record.get('interface')
            if iface:
                interface_data[iface].append(record)
                
        # Analyze each interface
        inventory = self.bandwidth_inventory.get(device_id, {})
        
        for iface, records in interface_data.items():
            # Calculate statistics
            tx_rates = [r.get('tx_kbps', 0) * 1000 for r in records]  # Convert to bps
            rx_rates = [r.get('rx_kbps', 0) * 1000 for r in records]
            
            if not tx_rates:
                continue
                
            # Determine interface type and capacity
            iface_type = self.determine_interface_type(iface)
            capacity = inventory.get(iface_type, 100)  # Default 100 Mbps
            
            avg_tx = sum(tx_rates) / len(tx_rates)
            avg_rx = sum(rx_rates) / len(rx_rates)
            peak_tx = max(tx_rates)
            peak_rx = max(rx_rates)
            p95_tx = sorted(tx_rates)[int(len(tx_rates) * 0.95)]
            p95_rx = sorted(rx_rates)[int(len(rx_rates) * 0.95)]
            
            # Calculate utilizations
            avg_util = self.calculate_utilization(max(avg_tx, avg_rx), capacity)
            peak_util = self.calculate_utilization(max(peak_tx, peak_rx), capacity)
            p95_util = self.calculate_utilization(max(p95_tx, p95_rx), capacity)
            
            # Determine status
            if p95_util >= self.thresholds['upgrade_trigger']:
                status = 'UPGRADE_NEEDED'
                analysis['summary']['upgrade_recommended'].append(iface)
            elif p95_util >= self.thresholds['critical']:
                status = 'CRITICAL'
                analysis['summary']['interfaces_critical'] += 1
            elif p95_util >= self.thresholds['warning']:
                status = 'WARNING'
                analysis['summary']['interfaces_warning'] += 1
            else:
                status = 'OK'
                
            interface_analysis = {
                'interface': iface,
                'type': iface_type,
                'capacity_mbps': capacity,
                'avg_utilization': round(avg_util, 2),
                'peak_utilization': round(peak_util, 2),
                'p95_utilization': round(p95_util, 2),
                'status': status,
                'metrics': {
                    'avg_tx_mbps': round(avg_tx / 1000000, 2),
                    'avg_rx_mbps': round(avg_rx / 1000000, 2),
                    'peak_tx_mbps': round(peak_tx / 1000000, 2),
                    'peak_rx_mbps': round(peak_rx / 1000000, 2),
                    'p95_tx_mbps': round(p95_tx / 1000000, 2),
                    'p95_rx_mbps': round(p95_rx / 1000000, 2)
                }
            }
            
            analysis['interfaces'].append(interface_analysis)
            
            if p95_util > analysis['summary']['highest_utilization']:
                analysis['summary']['highest_utilization'] = round(p95_util, 2)
                
        return analysis
        
    def determine_interface_type(self, interface_name):
        """Determine interface type from name"""
        if 'mpls' in interface_name.lower() or 'ge0/0/0' in interface_name.lower():
            return 'mpls'
        elif 'internet' in interface_name.lower() or 'ge0/0/1' in interface_name.lower():
            return 'internet'
        elif 'lte' in interface_name.lower() or 'cellular' in interface_name.lower():
            return 'lte'
        else:
            return 'unknown'
            
    def forecast_capacity_needs(self, analysis, growth_rate=0.05, months=12):
        """Forecast future capacity needs"""
        forecasts = []
        
        for iface in analysis['interfaces']:
            current_p95 = iface['p95_utilization']
            capacity = iface['capacity_mbps']
            
            # Project utilization growth
            monthly_growth = growth_rate / 12
            projected_utils = []
            
            for month in range(1, months + 1):
                projected_util = current_p95 * ((1 + monthly_growth) ** month)
                projected_utils.append({
                    'month': month,
                    'projected_utilization': round(projected_util, 2)
                })
                
            # Determine when upgrade needed
            upgrade_month = None
            for proj in projected_utils:
                if proj['projected_utilization'] >= self.thresholds['upgrade_trigger']:
                    upgrade_month = proj['month']
                    break
                    
            forecast = {
                'interface': iface['interface'],
                'current_utilization': current_p95,
                'current_capacity_mbps': capacity,
                'growth_assumption': f"{growth_rate * 100}% annual",
                'projections': projected_utils,
                'upgrade_needed_by': f"Month {upgrade_month}" if upgrade_month else "Not within forecast period",
                'recommended_capacity_mbps': self.recommend_upgrade(capacity) if upgrade_month else None
            }
            
            forecasts.append(forecast)
            
        return forecasts
        
    def recommend_upgrade(self, current_capacity):
        """Recommend next capacity tier"""
        tiers = [100, 200, 500, 1000, 2000, 5000, 10000]
        for tier in tiers:
            if tier > current_capacity * 1.5:
                return tier
        return current_capacity * 2
        
    def generate_capacity_report(self, sites):
        """Generate comprehensive capacity report"""
        report = {
            'report_type': 'Bandwidth Capacity Report',
            'generated_at': datetime.now().isoformat(),
            'analysis_period': '7 days',
            'sites': [],
            'summary': {
                'total_sites': 0,
                'sites_ok': 0,
                'sites_warning': 0,
                'sites_critical': 0,
                'immediate_upgrades_needed': []
            }
        }
        
        for site in sites:
            analysis = self.analyze_site_capacity(site['device_id'], site['name'])
            forecasts = self.forecast_capacity_needs(analysis)
            
            site_report = {
                'site': site['name'],
                'analysis': analysis,
                'forecasts': forecasts
            }
            
            report['sites'].append(site_report)
            report['summary']['total_sites'] += 1
            
            if analysis['summary']['interfaces_critical'] > 0:
                report['summary']['sites_critical'] += 1
            elif analysis['summary']['interfaces_warning'] > 0:
                report['summary']['sites_warning'] += 1
            else:
                report['summary']['sites_ok'] += 1
                
            if analysis['summary']['upgrade_recommended']:
                report['summary']['immediate_upgrades_needed'].append({
                    'site': site['name'],
                    'interfaces': analysis['summary']['upgrade_recommended']
                })
                
        return report
        
    def format_report(self, report):
        """Format capacity report for output"""
        output = []
        output.append("=" * 70)
        output.append("BANDWIDTH CAPACITY PLANNING REPORT")
        output.append("=" * 70)
        output.append(f"Generated: {report['generated_at']}")
        output.append(f"Analysis Period: {report['analysis_period']}")
        output.append("")
        
        output.append("EXECUTIVE SUMMARY")
        output.append("-" * 70)
        output.append(f"Total Sites Analyzed: {report['summary']['total_sites']}")
        output.append(f"  Sites OK: {report['summary']['sites_ok']}")
        output.append(f"  Sites Warning: {report['summary']['sites_warning']}")
        output.append(f"  Sites Critical: {report['summary']['sites_critical']}")
        output.append("")
        
        if report['summary']['immediate_upgrades_needed']:
            output.append("IMMEDIATE ACTION REQUIRED")
            output.append("-" * 70)
            for item in report['summary']['immediate_upgrades_needed']:
                output.append(f"  {item['site']}: {', '.join(item['interfaces'])}")
            output.append("")
            
        output.append("SITE DETAILS")
        output.append("-" * 70)
        
        for site in report['sites']:
            output.append(f"\n{site['site'].upper()}")
            output.append(f"  Highest Utilization: {site['analysis']['summary']['highest_utilization']}%")
            
            for iface in site['analysis']['interfaces']:
                output.append(f"  {iface['interface']}:")
                output.append(f"    Capacity: {iface['capacity_mbps']} Mbps")
                output.append(f"    Avg Util: {iface['avg_utilization']}%, P95: {iface['p95_utilization']}%, Peak: {iface['peak_utilization']}%")
                output.append(f"    Status: {iface['status']}")
                
        output.append("\n" + "=" * 70)
        return "\n".join(output)


if __name__ == "__main__":
    monitor = BandwidthCapacityMonitor(
        vmanage_host="10.100.1.10",
        username="admin",
        password="admin_password"
    )
    
    sites = [
        {'device_id': 'mumbai-hub-edge01', 'name': 'Mumbai Hub'},
        {'device_id': 'chennai-hub-edge01', 'name': 'Chennai Hub'},
        {'device_id': 'bangalore-branch-edge01', 'name': 'Bangalore Branch'}
    ]
    
    report = monitor.generate_capacity_report(sites)
    print(monitor.format_report(report))
```

---

## 6.16.3 Device Resource Capacity

### Resource Monitoring

```yaml
device_resource_capacity:
  cpu_capacity:
    thresholds:
      normal: "< 60%"
      warning: "60-75%"
      critical: "> 75%"
    scaling_triggers:
      - "Sustained > 70% for 7 days"
      - "Peak > 90% during business hours"
      
  memory_capacity:
    thresholds:
      normal: "< 70%"
      warning: "70-85%"
      critical: "> 85%"
    scaling_triggers:
      - "Sustained > 80% for 7 days"
      - "Memory leak detected"
      
  session_capacity:
    thresholds:
      normal: "< 60% of max"
      warning: "60-80% of max"
      critical: "> 80% of max"
    device_limits:
      c8500_12x4qc: 8000000
      c8300_2n2s: 2000000
      c8200_1n4t: 1000000
      c1111_8p: 500000
      
  tunnel_capacity:
    thresholds:
      normal: "< 70% of max"
      warning: "70-85% of max"
      critical: "> 85% of max"
    device_limits:
      c8500_12x4qc: 16000
      c8300_2n2s: 8000
      c8200_1n4t: 4000
```

### Device Capacity Planning Script

```python
#!/usr/bin/env python3
"""
Device Resource Capacity Planner
Monitors and plans device resource capacity
"""

import requests
from datetime import datetime, timedelta

class DeviceCapacityPlanner:
    def __init__(self, vmanage_host, username, password):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        
        # Device specifications
        self.device_specs = {
            'C8500-12X4QC': {
                'max_tunnels': 16000,
                'max_sessions': 8000000,
                'throughput_gbps': 40,
                'memory_gb': 32
            },
            'C8300-2N2S': {
                'max_tunnels': 8000,
                'max_sessions': 2000000,
                'throughput_gbps': 10,
                'memory_gb': 16
            },
            'C8200-1N-4T': {
                'max_tunnels': 4000,
                'max_sessions': 1000000,
                'throughput_gbps': 4,
                'memory_gb': 8
            },
            'C1111-8P': {
                'max_tunnels': 500,
                'max_sessions': 500000,
                'throughput_gbps': 1,
                'memory_gb': 4
            }
        }
        
        # Thresholds
        self.thresholds = {
            'cpu': {'warning': 60, 'critical': 75, 'upgrade': 80},
            'memory': {'warning': 70, 'critical': 85, 'upgrade': 90},
            'tunnels': {'warning': 70, 'critical': 85, 'upgrade': 90},
            'sessions': {'warning': 60, 'critical': 80, 'upgrade': 85}
        }
        
    def authenticate(self, username, password):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        payload = {'j_username': username, 'j_password': password}
        self.session.post(auth_url, data=payload)
        
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
            
    def get_device_statistics(self, device_id):
        """Get device resource statistics"""
        url = f"{self.base_url}/dataservice/device/system/status?deviceId={device_id}"
        response = self.session.get(url)
        return response.json() if response.status_code == 200 else None
        
    def get_device_info(self, device_id):
        """Get device information"""
        url = f"{self.base_url}/dataservice/device?deviceId={device_id}"
        response = self.session.get(url)
        return response.json() if response.status_code == 200 else None
        
    def analyze_device_capacity(self, device_id):
        """Analyze capacity for a single device"""
        stats = self.get_device_statistics(device_id)
        info = self.get_device_info(device_id)
        
        if not stats or not info:
            return None
            
        device_data = stats.get('data', [{}])[0]
        device_info = info.get('data', [{}])[0]
        
        model = device_info.get('device-model', 'Unknown')
        specs = self.device_specs.get(model, self.device_specs['C1111-8P'])
        
        analysis = {
            'device_id': device_id,
            'hostname': device_info.get('host-name'),
            'model': model,
            'site': device_info.get('site-id'),
            'timestamp': datetime.now().isoformat(),
            'resources': {}
        }
        
        # CPU Analysis
        cpu_usage = device_data.get('cpu_user', 0) + device_data.get('cpu_system', 0)
        analysis['resources']['cpu'] = {
            'current_percent': cpu_usage,
            'status': self.evaluate_threshold('cpu', cpu_usage),
            'recommendation': self.get_cpu_recommendation(cpu_usage, model)
        }
        
        # Memory Analysis
        mem_used = device_data.get('mem_used', 0)
        mem_total = device_data.get('mem_total', 1)
        mem_percent = (mem_used / mem_total) * 100 if mem_total > 0 else 0
        analysis['resources']['memory'] = {
            'used_mb': round(mem_used / 1024 / 1024, 2),
            'total_mb': round(mem_total / 1024 / 1024, 2),
            'current_percent': round(mem_percent, 2),
            'status': self.evaluate_threshold('memory', mem_percent),
            'recommendation': self.get_memory_recommendation(mem_percent, model)
        }
        
        # Tunnel Analysis
        tunnel_count = device_data.get('bfd_sessions_up', 0)
        max_tunnels = specs['max_tunnels']
        tunnel_percent = (tunnel_count / max_tunnels) * 100 if max_tunnels > 0 else 0
        analysis['resources']['tunnels'] = {
            'current': tunnel_count,
            'maximum': max_tunnels,
            'current_percent': round(tunnel_percent, 2),
            'status': self.evaluate_threshold('tunnels', tunnel_percent),
            'recommendation': self.get_tunnel_recommendation(tunnel_count, max_tunnels, model)
        }
        
        # Overall status
        statuses = [r['status'] for r in analysis['resources'].values()]
        if 'CRITICAL' in statuses:
            analysis['overall_status'] = 'CRITICAL'
        elif 'WARNING' in statuses:
            analysis['overall_status'] = 'WARNING'
        else:
            analysis['overall_status'] = 'OK'
            
        return analysis
        
    def evaluate_threshold(self, metric, value):
        """Evaluate metric against thresholds"""
        thresholds = self.thresholds.get(metric, self.thresholds['cpu'])
        
        if value >= thresholds['critical']:
            return 'CRITICAL'
        elif value >= thresholds['warning']:
            return 'WARNING'
        else:
            return 'OK'
            
    def get_cpu_recommendation(self, usage, model):
        """Get CPU capacity recommendation"""
        if usage >= self.thresholds['cpu']['upgrade']:
            return {
                'action': 'Upgrade device',
                'reason': f'CPU sustained at {usage}%',
                'options': self.get_upgrade_options(model)
            }
        elif usage >= self.thresholds['cpu']['critical']:
            return {
                'action': 'Optimize or prepare upgrade',
                'reason': f'CPU at {usage}%',
                'immediate': ['Review DPI settings', 'Check for routing loops']
            }
        return {'action': 'None required', 'status': 'Healthy'}
        
    def get_memory_recommendation(self, usage, model):
        """Get memory capacity recommendation"""
        if usage >= self.thresholds['memory']['upgrade']:
            return {
                'action': 'Upgrade device',
                'reason': f'Memory sustained at {usage}%',
                'options': self.get_upgrade_options(model)
            }
        elif usage >= self.thresholds['memory']['critical']:
            return {
                'action': 'Investigate and optimize',
                'reason': f'Memory at {usage}%',
                'immediate': ['Clear old software images', 'Check for memory leaks']
            }
        return {'action': 'None required', 'status': 'Healthy'}
        
    def get_tunnel_recommendation(self, current, maximum, model):
        """Get tunnel capacity recommendation"""
        percent = (current / maximum) * 100 if maximum > 0 else 0
        
        if percent >= self.thresholds['tunnels']['upgrade']:
            return {
                'action': 'Upgrade device',
                'reason': f'Tunnel capacity at {percent}%',
                'options': self.get_upgrade_options(model)
            }
        elif percent >= self.thresholds['tunnels']['critical']:
            return {
                'action': 'Plan upgrade or reduce mesh',
                'reason': f'Tunnel count at {percent}% of maximum',
                'immediate': ['Review mesh topology', 'Consider hub-and-spoke']
            }
        return {'action': 'None required', 'status': 'Healthy'}
        
    def get_upgrade_options(self, current_model):
        """Get upgrade options for a device model"""
        upgrade_path = {
            'C1111-8P': ['C8200-1N-4T', 'C8300-2N2S'],
            'C8200-1N-4T': ['C8300-2N2S', 'C8500-12X4QC'],
            'C8300-2N2S': ['C8500-12X4QC'],
            'C8500-12X4QC': ['C8500-12X4QC (add cluster)']
        }
        return upgrade_path.get(current_model, ['Contact Cisco for options'])
        
    def generate_capacity_plan(self, devices):
        """Generate comprehensive capacity plan"""
        plan = {
            'generated_at': datetime.now().isoformat(),
            'devices': [],
            'summary': {
                'total_devices': 0,
                'devices_ok': 0,
                'devices_warning': 0,
                'devices_critical': 0,
                'upgrades_needed': []
            }
        }
        
        for device_id in devices:
            analysis = self.analyze_device_capacity(device_id)
            if analysis:
                plan['devices'].append(analysis)
                plan['summary']['total_devices'] += 1
                
                if analysis['overall_status'] == 'CRITICAL':
                    plan['summary']['devices_critical'] += 1
                    plan['summary']['upgrades_needed'].append({
                        'device': analysis['hostname'],
                        'model': analysis['model'],
                        'reason': 'Critical resource utilization'
                    })
                elif analysis['overall_status'] == 'WARNING':
                    plan['summary']['devices_warning'] += 1
                else:
                    plan['summary']['devices_ok'] += 1
                    
        return plan


if __name__ == "__main__":
    planner = DeviceCapacityPlanner(
        vmanage_host="10.100.1.10",
        username="admin",
        password="admin_password"
    )
    
    devices = [
        'mumbai-hub-edge01',
        'chennai-hub-edge01',
        'bangalore-branch-edge01'
    ]
    
    plan = planner.generate_capacity_plan(devices)
    print(json.dumps(plan, indent=2))
```

---

## 6.16.4 Controller Capacity Planning

### Controller Sizing Guidelines

```yaml
controller_capacity:
  vmanage_cluster:
    current_deployment:
      nodes: 3
      vcpu_per_node: 16
      memory_per_node: "32 GB"
      storage_per_node: "1 TB SSD"
      
    scaling_metrics:
      devices_managed: 854
      max_devices_per_node: 2000
      current_utilization: "43%"
      
    scaling_triggers:
      - "Device count > 1500 per node"
      - "API response time > 5 seconds"
      - "Database growth > 80% capacity"
      
    expansion_options:
      vertical: "Increase vCPU/memory per node"
      horizontal: "Add nodes (up to 6)"
      
  vsmart:
    current_deployment:
      nodes: 2
      vcpu_per_node: 8
      memory_per_node: "16 GB"
      
    scaling_metrics:
      omp_peers: 854
      max_peers_per_vsmart: 2000
      routes_distributed: 15000
      
    scaling_triggers:
      - "OMP peer count > 1600"
      - "Route distribution latency > 30 seconds"
      - "Memory utilization > 80%"
      
  vbond:
    current_deployment:
      nodes: 2
      vcpu_per_node: 4
      memory_per_node: "8 GB"
      
    scaling_notes: "Typically does not require scaling"
```

### Controller Health Monitor

```python
#!/usr/bin/env python3
"""
Controller Capacity Monitor
Monitors controller cluster health and capacity
"""

import requests
from datetime import datetime

class ControllerCapacityMonitor:
    def __init__(self, vmanage_host, username, password):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        
        self.capacity_limits = {
            'vmanage': {
                'devices_per_node': 2000,
                'storage_warning_gb': 800,
                'storage_critical_gb': 900
            },
            'vsmart': {
                'omp_peers_per_node': 2000,
                'routes_warning': 50000,
                'routes_critical': 75000
            }
        }
        
    def authenticate(self, username, password):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        payload = {'j_username': username, 'j_password': password}
        self.session.post(auth_url, data=payload)
        
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
            
    def get_cluster_status(self):
        """Get vManage cluster status"""
        url = f"{self.base_url}/dataservice/clusterManagement/list"
        response = self.session.get(url)
        return response.json() if response.status_code == 200 else None
        
    def get_cluster_health(self):
        """Get cluster health metrics"""
        url = f"{self.base_url}/dataservice/clusterManagement/health/summary"
        response = self.session.get(url)
        return response.json() if response.status_code == 200 else None
        
    def get_device_count(self):
        """Get total managed device count"""
        url = f"{self.base_url}/dataservice/device/counters"
        response = self.session.get(url)
        return response.json() if response.status_code == 200 else None
        
    def analyze_vmanage_capacity(self):
        """Analyze vManage cluster capacity"""
        cluster_status = self.get_cluster_status()
        device_count = self.get_device_count()
        
        if not cluster_status:
            return None
            
        nodes = cluster_status.get('data', [])
        total_devices = device_count.get('data', [{}])[0].get('total', 0) if device_count else 0
        
        analysis = {
            'timestamp': datetime.now().isoformat(),
            'cluster_size': len(nodes),
            'total_devices': total_devices,
            'nodes': [],
            'recommendations': []
        }
        
        devices_per_node = total_devices / len(nodes) if nodes else 0
        max_per_node = self.capacity_limits['vmanage']['devices_per_node']
        utilization = (devices_per_node / max_per_node) * 100
        
        analysis['devices_per_node'] = round(devices_per_node)
        analysis['utilization_percent'] = round(utilization, 2)
        
        for node in nodes:
            node_info = {
                'ip': node.get('vManageIP'),
                'status': node.get('configurationDBClusterStatus'),
                'is_primary': node.get('isConfigurationDBPrimary', False)
            }
            analysis['nodes'].append(node_info)
            
        # Generate recommendations
        if utilization > 80:
            analysis['recommendations'].append({
                'priority': 'HIGH',
                'action': 'Add cluster node',
                'reason': f'Device per node ratio at {utilization:.0f}%'
            })
        elif utilization > 60:
            analysis['recommendations'].append({
                'priority': 'MEDIUM',
                'action': 'Plan cluster expansion',
                'reason': f'Device per node ratio at {utilization:.0f}%'
            })
            
        return analysis
        
    def project_capacity_needs(self, current_devices, growth_rate=0.1, months=12):
        """Project future capacity needs"""
        projections = []
        monthly_growth = growth_rate / 12
        
        for month in range(1, months + 1):
            projected_devices = current_devices * ((1 + monthly_growth) ** month)
            projections.append({
                'month': month,
                'projected_devices': int(projected_devices)
            })
            
        return projections


if __name__ == "__main__":
    monitor = ControllerCapacityMonitor(
        vmanage_host="10.100.1.10",
        username="admin",
        password="admin_password"
    )
    
    analysis = monitor.analyze_vmanage_capacity()
    if analysis:
        print(f"\nCluster Size: {analysis['cluster_size']} nodes")
        print(f"Total Devices: {analysis['total_devices']}")
        print(f"Devices per Node: {analysis['devices_per_node']}")
        print(f"Utilization: {analysis['utilization_percent']}%")
        
        if analysis['recommendations']:
            print("\nRecommendations:")
            for rec in analysis['recommendations']:
                print(f"  [{rec['priority']}] {rec['action']}: {rec['reason']}")
```

---

## 6.16.5 Capacity Planning Calendar

### Planning Timeline

```yaml
capacity_planning_calendar:
  weekly_activities:
    monday:
      - "Review utilization dashboards"
      - "Check threshold alerts"
      - "Update capacity tracker"
      
  monthly_activities:
    week_1:
      - "Generate monthly capacity report"
      - "Review trend analysis"
      - "Update forecasts"
      
    week_2:
      - "Capacity planning meeting"
      - "Review upgrade requests"
      - "Budget impact assessment"
      
    week_3:
      - "Vendor discussions (if upgrades needed)"
      - "Update capacity roadmap"
      
    week_4:
      - "Prepare monthly summary"
      - "Update documentation"
      
  quarterly_activities:
    - "Comprehensive capacity review"
    - "Technology refresh assessment"
    - "Budget planning for next quarter"
    - "Strategic capacity roadmap update"
    
  annual_activities:
    - "Annual capacity audit"
    - "3-year capacity forecast"
    - "Capital budget planning"
    - "Technology refresh roadmap"
```

### Capacity Tracking Template

```yaml
capacity_tracker:
  site_entry:
    site_name: ""
    last_updated: ""
    
    bandwidth:
      circuit_1:
        type: ""
        capacity_mbps: 0
        avg_utilization: 0
        peak_utilization: 0
        p95_utilization: 0
        status: "OK/WARNING/CRITICAL"
        upgrade_date: ""
        
    devices:
      device_name: ""
      model: ""
      cpu_avg: 0
      memory_avg: 0
      tunnels_current: 0
      tunnels_max: 0
      status: ""
      
    forecast:
      current_month: 0
      month_3: 0
      month_6: 0
      month_12: 0
      upgrade_needed_by: ""
      
    actions:
      - action: ""
        priority: ""
        due_date: ""
        owner: ""
        status: ""
```

---

## 6.16.6 Capacity Planning Best Practices

### Key Principles

```yaml
capacity_planning_best_practices:
  proactive_planning:
    principle: "Plan ahead, not react"
    practices:
      - "Maintain 20-30% headroom on all circuits"
      - "Forecast at least 12 months ahead"
      - "Budget for growth in annual planning"
      
  data_driven_decisions:
    principle: "Base decisions on metrics, not assumptions"
    practices:
      - "Use P95 utilization, not average"
      - "Consider business hours vs 24/7"
      - "Track trends over time"
      
  business_alignment:
    principle: "Align capacity with business needs"
    practices:
      - "Understand business growth plans"
      - "Coordinate with application teams"
      - "Support new site deployments"
      
  cost_optimization:
    principle: "Balance cost and capacity"
    practices:
      - "Right-size circuits and devices"
      - "Consider burst options"
      - "Evaluate contract terms"
```

### Common Capacity Planning Mistakes

```yaml
capacity_mistakes_to_avoid:
  reactive_planning:
    mistake: "Waiting until capacity is exhausted"
    impact: "Emergency upgrades, higher costs"
    solution: "Proactive monitoring and forecasting"
    
  over_provisioning:
    mistake: "Excessive capacity 'just in case'"
    impact: "Wasted budget"
    solution: "Data-driven sizing with reasonable headroom"
    
  ignoring_trends:
    mistake: "Looking only at current utilization"
    impact: "Surprised by rapid growth"
    solution: "Trend analysis and forecasting"
    
  siloed_planning:
    mistake: "Planning without business input"
    impact: "Misaligned capacity"
    solution: "Regular business alignment meetings"
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
