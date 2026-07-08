# 6.15 SLA Monitoring Framework

## 6.15.1 SLA Framework Overview

### Service Level Agreement Structure

```yaml
sla_framework_overview:
  purpose: "Define, measure, and report service levels for SD-WAN infrastructure"
  
  sla_categories:
    network_availability:
      description: "Overall network uptime and accessibility"
      target: "99.95%"
      measurement: "Monthly"
      
    performance:
      description: "Latency, packet loss, and jitter metrics"
      targets:
        latency: "< 100ms regional, < 200ms global"
        packet_loss: "< 0.1%"
        jitter: "< 30ms"
      measurement: "Continuous"
      
    incident_response:
      description: "Time to respond and resolve incidents"
      targets:
        sev1_response: "15 minutes"
        sev1_resolution: "2 hours"
        sev2_response: "30 minutes"
        sev2_resolution: "4 hours"
      measurement: "Per incident"
      
    change_management:
      description: "Change success and timeliness"
      targets:
        success_rate: "> 95%"
        on_time_delivery: "> 90%"
      measurement: "Monthly"
```

### SLA Stakeholders

```yaml
sla_stakeholders:
  internal:
    it_operations:
      role: "Service provider"
      responsibilities:
        - "Meet SLA targets"
        - "Report on performance"
        - "Continuous improvement"
        
    business_units:
      role: "Service consumer"
      responsibilities:
        - "Define requirements"
        - "Provide feedback"
        - "Escalate issues"
        
    it_management:
      role: "Governance"
      responsibilities:
        - "SLA approval"
        - "Resource allocation"
        - "Escalation resolution"
        
  external:
    isp_providers:
      circuits: "MPLS, Internet, 5G"
      slas: "Defined in service contracts"
      
    cisco_tac:
      support: "Hardware and software"
      sla: "Based on support contract level"
```

---

## 6.15.2 Network Availability SLA

### Availability Metrics Definition

```yaml
availability_sla:
  metric_definition:
    formula: "((Total Time - Downtime) / Total Time) × 100"
    
    inclusions:
      - "Unplanned outages"
      - "Emergency maintenance impact"
      - "Degraded performance (< 50% capacity)"
      
    exclusions:
      - "Planned maintenance windows"
      - "Customer-caused issues"
      - "Force majeure events"
      - "Third-party provider outages (with proof)"
      
  service_tiers:
    tier_1_critical:
      description: "Hub sites and controllers"
      target: "99.99%"
      max_downtime_monthly: "4.3 minutes"
      sites:
        - "Mumbai Hub"
        - "Chennai Hub"
        - "Controller cluster"
        
    tier_2_standard:
      description: "Regional branch sites"
      target: "99.95%"
      max_downtime_monthly: "21.6 minutes"
      sites:
        - "Bangalore Branch"
        - "Delhi Branch"
        - "Noida Branch"
        - "EMEA sites"
        - "Americas sites"
        
    tier_3_basic:
      description: "Remote and temporary sites"
      target: "99.5%"
      max_downtime_monthly: "3.6 hours"
```

### Availability Calculation Script

```python
#!/usr/bin/env python3
"""
Network Availability SLA Calculator
Calculates and reports availability metrics
"""

import requests
import json
from datetime import datetime, timedelta
from collections import defaultdict

class AvailabilitySLACalculator:
    def __init__(self, vmanage_host, username, password):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        
        # SLA targets by tier
        self.sla_targets = {
            'tier_1': 99.99,
            'tier_2': 99.95,
            'tier_3': 99.5
        }
        
        # Site tier mapping
        self.site_tiers = {
            'mumbai-hub': 'tier_1',
            'chennai-hub': 'tier_1',
            'bangalore-branch': 'tier_2',
            'delhi-branch': 'tier_2',
            'noida-branch': 'tier_2',
            'london-branch': 'tier_2',
            'frankfurt-branch': 'tier_2',
            'newjersey-branch': 'tier_2',
            'dallas-branch': 'tier_2'
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
            
    def get_device_state_history(self, device_id, start_time, end_time):
        """Get device reachability history"""
        url = f"{self.base_url}/dataservice/statistics/device/state"
        params = {
            'startDate': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'endDate': end_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'deviceId': device_id
        }
        
        response = self.session.get(url, params=params)
        return response.json() if response.status_code == 200 else None
        
    def get_maintenance_windows(self, start_time, end_time):
        """Get planned maintenance windows (from external system)"""
        # In production, this would query ITSM/change management system
        # Returns list of maintenance periods to exclude
        return [
            # Example: {'start': datetime, 'end': datetime, 'description': 'Planned maintenance'}
        ]
        
    def calculate_availability(self, device_id, site_name, start_time, end_time):
        """Calculate availability for a device"""
        total_seconds = (end_time - start_time).total_seconds()
        
        # Get state history
        history = self.get_device_state_history(device_id, start_time, end_time)
        
        downtime_seconds = 0
        if history and 'data' in history:
            for event in history['data']:
                if event.get('reachability') == 'unreachable':
                    event_start = datetime.fromisoformat(event['entry_time'])
                    event_end = datetime.fromisoformat(event.get('exit_time', end_time.isoformat()))
                    downtime_seconds += (event_end - event_start).total_seconds()
                    
        # Exclude planned maintenance
        maintenance_windows = self.get_maintenance_windows(start_time, end_time)
        for window in maintenance_windows:
            if window['start'] >= start_time and window['end'] <= end_time:
                # Adjust downtime for planned maintenance
                pass
                
        # Calculate availability
        uptime_seconds = total_seconds - downtime_seconds
        availability = (uptime_seconds / total_seconds) * 100
        
        # Get SLA target
        tier = self.site_tiers.get(site_name, 'tier_2')
        target = self.sla_targets[tier]
        
        return {
            'device_id': device_id,
            'site_name': site_name,
            'tier': tier,
            'period_start': start_time.isoformat(),
            'period_end': end_time.isoformat(),
            'total_minutes': total_seconds / 60,
            'downtime_minutes': downtime_seconds / 60,
            'availability_percent': round(availability, 4),
            'sla_target': target,
            'sla_met': availability >= target,
            'gap': round(availability - target, 4)
        }
        
    def generate_monthly_report(self, year, month):
        """Generate monthly availability report"""
        # Calculate period
        start_time = datetime(year, month, 1)
        if month == 12:
            end_time = datetime(year + 1, 1, 1)
        else:
            end_time = datetime(year, month + 1, 1)
            
        report = {
            'report_type': 'Monthly Availability SLA',
            'period': f"{year}-{month:02d}",
            'generated_at': datetime.now().isoformat(),
            'sites': [],
            'summary': {
                'total_sites': 0,
                'sites_meeting_sla': 0,
                'sites_missing_sla': 0,
                'by_tier': defaultdict(lambda: {'count': 0, 'meeting': 0})
            }
        }
        
        # Get all devices
        url = f"{self.base_url}/dataservice/device"
        response = self.session.get(url)
        
        if response.status_code == 200:
            devices = response.json().get('data', [])
            
            for device in devices:
                if device.get('device-type') == 'vedge':
                    device_id = device.get('deviceId')
                    site_name = device.get('site-id', 'unknown')
                    
                    availability = self.calculate_availability(
                        device_id, site_name, start_time, end_time
                    )
                    
                    report['sites'].append(availability)
                    report['summary']['total_sites'] += 1
                    
                    tier = availability['tier']
                    report['summary']['by_tier'][tier]['count'] += 1
                    
                    if availability['sla_met']:
                        report['summary']['sites_meeting_sla'] += 1
                        report['summary']['by_tier'][tier]['meeting'] += 1
                    else:
                        report['summary']['sites_missing_sla'] += 1
                        
        # Calculate overall SLA achievement
        if report['summary']['total_sites'] > 0:
            report['summary']['overall_sla_achievement'] = (
                report['summary']['sites_meeting_sla'] / 
                report['summary']['total_sites'] * 100
            )
        else:
            report['summary']['overall_sla_achievement'] = 0
            
        return report
        
    def format_report(self, report):
        """Format report for output"""
        output = []
        output.append("=" * 70)
        output.append("NETWORK AVAILABILITY SLA REPORT")
        output.append("=" * 70)
        output.append(f"Period: {report['period']}")
        output.append(f"Generated: {report['generated_at']}")
        output.append("")
        
        output.append("SUMMARY")
        output.append("-" * 70)
        output.append(f"Total Sites: {report['summary']['total_sites']}")
        output.append(f"Meeting SLA: {report['summary']['sites_meeting_sla']}")
        output.append(f"Missing SLA: {report['summary']['sites_missing_sla']}")
        output.append(f"Overall Achievement: {report['summary']['overall_sla_achievement']:.2f}%")
        output.append("")
        
        output.append("BY TIER")
        output.append("-" * 70)
        for tier, data in report['summary']['by_tier'].items():
            pct = (data['meeting'] / data['count'] * 100) if data['count'] > 0 else 0
            output.append(f"  {tier}: {data['meeting']}/{data['count']} ({pct:.2f}%)")
        output.append("")
        
        # Sites missing SLA
        missing = [s for s in report['sites'] if not s['sla_met']]
        if missing:
            output.append("SITES MISSING SLA")
            output.append("-" * 70)
            for site in sorted(missing, key=lambda x: x['availability_percent']):
                output.append(
                    f"  {site['site_name']}: {site['availability_percent']:.4f}% "
                    f"(target: {site['sla_target']}%, gap: {site['gap']:.4f}%)"
                )
                output.append(f"    Downtime: {site['downtime_minutes']:.2f} minutes")
            output.append("")
            
        output.append("=" * 70)
        return "\n".join(output)


if __name__ == "__main__":
    calculator = AvailabilitySLACalculator(
        vmanage_host="10.100.1.10",
        username="admin",
        password="admin_password"
    )
    
    # Generate last month's report
    now = datetime.now()
    last_month = now.month - 1 if now.month > 1 else 12
    year = now.year if now.month > 1 else now.year - 1
    
    report = calculator.generate_monthly_report(year, last_month)
    print(calculator.format_report(report))
```

---

## 6.15.3 Performance SLA Metrics

### Performance Thresholds

```yaml
performance_sla:
  latency:
    regional_intra_india:
      target: "< 50ms"
      warning: "> 40ms"
      critical: "> 50ms"
      measurement: "Round-trip time"
      
    india_to_emea:
      target: "< 150ms"
      warning: "> 120ms"
      critical: "> 150ms"
      
    india_to_americas:
      target: "< 200ms"
      warning: "> 160ms"
      critical: "> 200ms"
      
    global_average:
      target: "< 100ms"
      warning: "> 80ms"
      critical: "> 100ms"
      
  packet_loss:
    target: "< 0.1%"
    warning: "> 0.05%"
    critical: "> 0.1%"
    measurement: "5-minute average"
    
  jitter:
    voice_traffic:
      target: "< 30ms"
      warning: "> 20ms"
      critical: "> 30ms"
      
    video_traffic:
      target: "< 50ms"
      warning: "> 40ms"
      critical: "> 50ms"
      
    standard_traffic:
      target: "< 100ms"
      warning: "> 80ms"
      critical: "> 100ms"
      
  throughput:
    circuit_utilization:
      target: "< 80% sustained"
      warning: "> 70%"
      critical: "> 80%"
      measurement: "15-minute average"
```

### Performance SLA Monitoring Script

```python
#!/usr/bin/env python3
"""
Performance SLA Monitor
Real-time monitoring of performance metrics against SLA
"""

import requests
import json
from datetime import datetime, timedelta
from typing import Dict, List

class PerformanceSLAMonitor:
    def __init__(self, vmanage_host, username, password):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        
        # SLA thresholds
        self.thresholds = {
            'latency': {
                'regional': {'warning': 40, 'critical': 50},
                'global': {'warning': 80, 'critical': 100}
            },
            'loss': {'warning': 0.05, 'critical': 0.1},
            'jitter': {
                'voice': {'warning': 20, 'critical': 30},
                'video': {'warning': 40, 'critical': 50},
                'default': {'warning': 80, 'critical': 100}
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
            
    def get_tunnel_statistics(self, hours=1):
        """Get tunnel performance statistics"""
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=hours)
        
        url = f"{self.base_url}/dataservice/statistics/approute/fec/aggregation"
        params = {
            'startDate': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'endDate': end_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'count': 1000
        }
        
        response = self.session.get(url, params=params)
        return response.json() if response.status_code == 200 else None
        
    def get_application_statistics(self, hours=1):
        """Get application performance statistics"""
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=hours)
        
        url = f"{self.base_url}/dataservice/statistics/dpi/aggregation"
        params = {
            'startDate': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'endDate': end_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'count': 1000
        }
        
        response = self.session.get(url, params=params)
        return response.json() if response.status_code == 200 else None
        
    def evaluate_latency_sla(self, latency_ms, is_regional=True):
        """Evaluate latency against SLA"""
        threshold_type = 'regional' if is_regional else 'global'
        thresholds = self.thresholds['latency'][threshold_type]
        
        if latency_ms >= thresholds['critical']:
            return {'status': 'CRITICAL', 'sla_met': False}
        elif latency_ms >= thresholds['warning']:
            return {'status': 'WARNING', 'sla_met': True}
        else:
            return {'status': 'OK', 'sla_met': True}
            
    def evaluate_loss_sla(self, loss_percent):
        """Evaluate packet loss against SLA"""
        if loss_percent >= self.thresholds['loss']['critical']:
            return {'status': 'CRITICAL', 'sla_met': False}
        elif loss_percent >= self.thresholds['loss']['warning']:
            return {'status': 'WARNING', 'sla_met': True}
        else:
            return {'status': 'OK', 'sla_met': True}
            
    def evaluate_jitter_sla(self, jitter_ms, traffic_type='default'):
        """Evaluate jitter against SLA"""
        thresholds = self.thresholds['jitter'].get(traffic_type, self.thresholds['jitter']['default'])
        
        if jitter_ms >= thresholds['critical']:
            return {'status': 'CRITICAL', 'sla_met': False}
        elif jitter_ms >= thresholds['warning']:
            return {'status': 'WARNING', 'sla_met': True}
        else:
            return {'status': 'OK', 'sla_met': True}
            
    def get_current_sla_status(self):
        """Get current SLA status across all metrics"""
        status = {
            'timestamp': datetime.now().isoformat(),
            'overall_status': 'OK',
            'metrics': {
                'latency': [],
                'packet_loss': [],
                'jitter': []
            },
            'violations': []
        }
        
        # Get tunnel statistics
        tunnel_stats = self.get_tunnel_statistics(hours=1)
        
        if tunnel_stats and 'data' in tunnel_stats:
            for tunnel in tunnel_stats['data']:
                src_site = tunnel.get('local_site_id', 'unknown')
                dst_site = tunnel.get('remote_site_id', 'unknown')
                
                # Latency evaluation
                latency = tunnel.get('latency', 0)
                latency_eval = self.evaluate_latency_sla(latency)
                
                latency_record = {
                    'source': src_site,
                    'destination': dst_site,
                    'value': latency,
                    'unit': 'ms',
                    'status': latency_eval['status'],
                    'sla_met': latency_eval['sla_met']
                }
                status['metrics']['latency'].append(latency_record)
                
                if not latency_eval['sla_met']:
                    status['violations'].append({
                        'metric': 'latency',
                        'path': f"{src_site} → {dst_site}",
                        'value': f"{latency}ms",
                        'threshold': 'critical'
                    })
                    
                # Packet loss evaluation
                loss = tunnel.get('loss', 0)
                loss_eval = self.evaluate_loss_sla(loss)
                
                loss_record = {
                    'source': src_site,
                    'destination': dst_site,
                    'value': loss,
                    'unit': '%',
                    'status': loss_eval['status'],
                    'sla_met': loss_eval['sla_met']
                }
                status['metrics']['packet_loss'].append(loss_record)
                
                if not loss_eval['sla_met']:
                    status['violations'].append({
                        'metric': 'packet_loss',
                        'path': f"{src_site} → {dst_site}",
                        'value': f"{loss}%",
                        'threshold': 'critical'
                    })
                    
                # Jitter evaluation
                jitter = tunnel.get('jitter', 0)
                jitter_eval = self.evaluate_jitter_sla(jitter)
                
                jitter_record = {
                    'source': src_site,
                    'destination': dst_site,
                    'value': jitter,
                    'unit': 'ms',
                    'status': jitter_eval['status'],
                    'sla_met': jitter_eval['sla_met']
                }
                status['metrics']['jitter'].append(jitter_record)
                
                if not jitter_eval['sla_met']:
                    status['violations'].append({
                        'metric': 'jitter',
                        'path': f"{src_site} → {dst_site}",
                        'value': f"{jitter}ms",
                        'threshold': 'critical'
                    })
                    
        # Determine overall status
        if status['violations']:
            status['overall_status'] = 'SLA VIOLATION'
        elif any(m['status'] == 'WARNING' for m in status['metrics']['latency']):
            status['overall_status'] = 'WARNING'
            
        return status
        
    def generate_sla_dashboard(self, status):
        """Generate SLA dashboard output"""
        output = []
        output.append("=" * 70)
        output.append("PERFORMANCE SLA DASHBOARD")
        output.append("=" * 70)
        output.append(f"Timestamp: {status['timestamp']}")
        output.append(f"Overall Status: {status['overall_status']}")
        output.append("")
        
        # Violations
        if status['violations']:
            output.append("ACTIVE SLA VIOLATIONS")
            output.append("-" * 70)
            for v in status['violations']:
                output.append(f"  [{v['metric'].upper()}] {v['path']}: {v['value']}")
            output.append("")
            
        # Summary statistics
        output.append("METRIC SUMMARY")
        output.append("-" * 70)
        
        for metric_name, metrics in status['metrics'].items():
            if metrics:
                ok_count = sum(1 for m in metrics if m['status'] == 'OK')
                warn_count = sum(1 for m in metrics if m['status'] == 'WARNING')
                crit_count = sum(1 for m in metrics if m['status'] == 'CRITICAL')
                
                values = [m['value'] for m in metrics]
                avg_value = sum(values) / len(values) if values else 0
                max_value = max(values) if values else 0
                
                output.append(f"  {metric_name.upper()}:")
                output.append(f"    Status: OK={ok_count}, WARNING={warn_count}, CRITICAL={crit_count}")
                output.append(f"    Average: {avg_value:.2f}, Max: {max_value:.2f}")
                
        output.append("")
        output.append("=" * 70)
        
        return "\n".join(output)


if __name__ == "__main__":
    monitor = PerformanceSLAMonitor(
        vmanage_host="10.100.1.10",
        username="admin",
        password="admin_password"
    )
    
    status = monitor.get_current_sla_status()
    print(monitor.generate_sla_dashboard(status))
```

---

## 6.15.4 Incident Response SLA

### Incident SLA Targets

```yaml
incident_response_sla:
  severity_1:
    description: "Critical business impact - complete outage"
    response_time: "15 minutes"
    update_frequency: "Every 15 minutes"
    resolution_target: "2 hours"
    escalation_time: "30 minutes to L3"
    
  severity_2:
    description: "Major impact - significant degradation"
    response_time: "30 minutes"
    update_frequency: "Every 30 minutes"
    resolution_target: "4 hours"
    escalation_time: "2 hours to L3"
    
  severity_3:
    description: "Moderate impact - partial service impact"
    response_time: "2 hours"
    update_frequency: "Every 2 hours"
    resolution_target: "8 hours"
    escalation_time: "4 hours to L2"
    
  severity_4:
    description: "Minor impact - minimal business effect"
    response_time: "8 hours"
    update_frequency: "Daily"
    resolution_target: "24 hours"
    escalation_time: "Next business day"
```

### Incident SLA Tracking

```python
#!/usr/bin/env python3
"""
Incident Response SLA Tracker
Tracks incident response and resolution against SLA
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List

class IncidentSLATracker:
    def __init__(self):
        # SLA targets in minutes
        self.sla_targets = {
            'SEV-1': {
                'response': 15,
                'resolution': 120,  # 2 hours
                'escalation': 30
            },
            'SEV-2': {
                'response': 30,
                'resolution': 240,  # 4 hours
                'escalation': 120
            },
            'SEV-3': {
                'response': 120,  # 2 hours
                'resolution': 480,  # 8 hours
                'escalation': 240
            },
            'SEV-4': {
                'response': 480,  # 8 hours
                'resolution': 1440,  # 24 hours
                'escalation': 1440
            }
        }
        
    def calculate_metrics(self, incident):
        """Calculate SLA metrics for an incident"""
        severity = incident.get('severity', 'SEV-3')
        targets = self.sla_targets.get(severity, self.sla_targets['SEV-3'])
        
        created_at = datetime.fromisoformat(incident['created_at'])
        acknowledged_at = datetime.fromisoformat(incident['acknowledged_at']) if incident.get('acknowledged_at') else None
        resolved_at = datetime.fromisoformat(incident['resolved_at']) if incident.get('resolved_at') else None
        
        metrics = {
            'incident_id': incident['id'],
            'severity': severity,
            'created_at': incident['created_at']
        }
        
        # Response time (MTTA)
        if acknowledged_at:
            response_minutes = (acknowledged_at - created_at).total_seconds() / 60
            metrics['response_time_minutes'] = round(response_minutes, 2)
            metrics['response_sla_target'] = targets['response']
            metrics['response_sla_met'] = response_minutes <= targets['response']
            metrics['response_sla_breach_minutes'] = max(0, response_minutes - targets['response'])
        else:
            # Still open - check if already breached
            current_minutes = (datetime.now() - created_at).total_seconds() / 60
            metrics['response_time_minutes'] = None
            metrics['response_sla_target'] = targets['response']
            metrics['response_at_risk'] = current_minutes > targets['response'] * 0.8
            
        # Resolution time (MTTR)
        if resolved_at:
            resolution_minutes = (resolved_at - created_at).total_seconds() / 60
            metrics['resolution_time_minutes'] = round(resolution_minutes, 2)
            metrics['resolution_sla_target'] = targets['resolution']
            metrics['resolution_sla_met'] = resolution_minutes <= targets['resolution']
            metrics['resolution_sla_breach_minutes'] = max(0, resolution_minutes - targets['resolution'])
        else:
            # Still open
            current_minutes = (datetime.now() - created_at).total_seconds() / 60
            metrics['resolution_time_minutes'] = None
            metrics['resolution_sla_target'] = targets['resolution']
            metrics['resolution_at_risk'] = current_minutes > targets['resolution'] * 0.8
            metrics['time_remaining_minutes'] = max(0, targets['resolution'] - current_minutes)
            
        return metrics
        
    def generate_sla_report(self, incidents: List[Dict], period_name: str):
        """Generate SLA achievement report"""
        report = {
            'period': period_name,
            'generated_at': datetime.now().isoformat(),
            'summary': {
                'total_incidents': len(incidents),
                'by_severity': {},
                'response_sla_achievement': 0,
                'resolution_sla_achievement': 0
            },
            'incidents': []
        }
        
        response_met = 0
        response_total = 0
        resolution_met = 0
        resolution_total = 0
        
        severity_stats = {}
        
        for incident in incidents:
            metrics = self.calculate_metrics(incident)
            report['incidents'].append(metrics)
            
            severity = metrics['severity']
            if severity not in severity_stats:
                severity_stats[severity] = {
                    'count': 0,
                    'response_met': 0,
                    'resolution_met': 0,
                    'avg_response': [],
                    'avg_resolution': []
                }
                
            severity_stats[severity]['count'] += 1
            
            if metrics.get('response_sla_met') is not None:
                response_total += 1
                if metrics['response_sla_met']:
                    response_met += 1
                    severity_stats[severity]['response_met'] += 1
                if metrics.get('response_time_minutes'):
                    severity_stats[severity]['avg_response'].append(metrics['response_time_minutes'])
                    
            if metrics.get('resolution_sla_met') is not None:
                resolution_total += 1
                if metrics['resolution_sla_met']:
                    resolution_met += 1
                    severity_stats[severity]['resolution_met'] += 1
                if metrics.get('resolution_time_minutes'):
                    severity_stats[severity]['avg_resolution'].append(metrics['resolution_time_minutes'])
                    
        # Calculate achievements
        if response_total > 0:
            report['summary']['response_sla_achievement'] = round(response_met / response_total * 100, 2)
        if resolution_total > 0:
            report['summary']['resolution_sla_achievement'] = round(resolution_met / resolution_total * 100, 2)
            
        # Calculate per-severity stats
        for severity, stats in severity_stats.items():
            report['summary']['by_severity'][severity] = {
                'count': stats['count'],
                'response_achievement': round(stats['response_met'] / stats['count'] * 100, 2) if stats['count'] > 0 else 0,
                'resolution_achievement': round(stats['resolution_met'] / stats['count'] * 100, 2) if stats['count'] > 0 else 0,
                'avg_response_minutes': round(sum(stats['avg_response']) / len(stats['avg_response']), 2) if stats['avg_response'] else None,
                'avg_resolution_minutes': round(sum(stats['avg_resolution']) / len(stats['avg_resolution']), 2) if stats['avg_resolution'] else None
            }
            
        return report
        
    def format_report(self, report):
        """Format report for display"""
        output = []
        output.append("=" * 70)
        output.append("INCIDENT RESPONSE SLA REPORT")
        output.append("=" * 70)
        output.append(f"Period: {report['period']}")
        output.append(f"Generated: {report['generated_at']}")
        output.append(f"Total Incidents: {report['summary']['total_incidents']}")
        output.append("")
        
        output.append("OVERALL SLA ACHIEVEMENT")
        output.append("-" * 70)
        output.append(f"  Response SLA: {report['summary']['response_sla_achievement']}%")
        output.append(f"  Resolution SLA: {report['summary']['resolution_sla_achievement']}%")
        output.append("")
        
        output.append("BY SEVERITY")
        output.append("-" * 70)
        for severity, stats in sorted(report['summary']['by_severity'].items()):
            output.append(f"  {severity}:")
            output.append(f"    Count: {stats['count']}")
            output.append(f"    Response Achievement: {stats['response_achievement']}%")
            output.append(f"    Resolution Achievement: {stats['resolution_achievement']}%")
            if stats['avg_response_minutes']:
                output.append(f"    Avg Response: {stats['avg_response_minutes']} minutes")
            if stats['avg_resolution_minutes']:
                output.append(f"    Avg Resolution: {stats['avg_resolution_minutes']} minutes")
            output.append("")
            
        # SLA breaches
        breaches = [i for i in report['incidents'] if not i.get('resolution_sla_met', True)]
        if breaches:
            output.append("SLA BREACHES")
            output.append("-" * 70)
            for incident in breaches:
                output.append(f"  {incident['incident_id']} ({incident['severity']})")
                if incident.get('response_sla_breach_minutes'):
                    output.append(f"    Response breach: {incident['response_sla_breach_minutes']} minutes over")
                if incident.get('resolution_sla_breach_minutes'):
                    output.append(f"    Resolution breach: {incident['resolution_sla_breach_minutes']} minutes over")
            output.append("")
            
        output.append("=" * 70)
        return "\n".join(output)


if __name__ == "__main__":
    tracker = IncidentSLATracker()
    
    # Sample incidents
    sample_incidents = [
        {
            'id': 'INC001',
            'severity': 'SEV-1',
            'created_at': '2025-01-15T10:00:00',
            'acknowledged_at': '2025-01-15T10:12:00',
            'resolved_at': '2025-01-15T11:45:00'
        },
        {
            'id': 'INC002',
            'severity': 'SEV-2',
            'created_at': '2025-01-15T14:00:00',
            'acknowledged_at': '2025-01-15T14:25:00',
            'resolved_at': '2025-01-15T18:30:00'
        },
        {
            'id': 'INC003',
            'severity': 'SEV-1',
            'created_at': '2025-01-16T09:00:00',
            'acknowledged_at': '2025-01-16T09:20:00',  # Breached
            'resolved_at': '2025-01-16T12:00:00'  # Breached
        }
    ]
    
    report = tracker.generate_sla_report(sample_incidents, 'January 2025')
    print(tracker.format_report(report))
```

---

## 6.15.5 Change Management SLA

### Change SLA Metrics

```yaml
change_management_sla:
  metrics:
    change_success_rate:
      description: "Percentage of changes completed without issues"
      target: "> 95%"
      calculation: "(Successful Changes / Total Changes) × 100"
      
    on_time_delivery:
      description: "Changes completed within scheduled window"
      target: "> 90%"
      calculation: "(On-Time Changes / Total Changes) × 100"
      
    change_related_incidents:
      description: "Incidents caused by changes"
      target: "< 2%"
      calculation: "(Change-Caused Incidents / Total Changes) × 100"
      
    emergency_change_rate:
      description: "Emergency changes as percentage of total"
      target: "< 5%"
      calculation: "(Emergency Changes / Total Changes) × 100"
      
    pir_completion:
      description: "Post-implementation reviews completed"
      target: "100% for major changes"
      
  reporting:
    frequency: "Monthly"
    distribution:
      - "IT Management"
      - "Change Advisory Board"
      - "Service Delivery Manager"
```

---

## 6.15.6 SLA Reporting Framework

### Report Templates

```yaml
sla_reporting:
  daily_report:
    audience: "Operations Team"
    content:
      - "Current SLA status (dashboard view)"
      - "Active violations"
      - "At-risk metrics"
    format: "Dashboard/Email"
    
  weekly_report:
    audience: "IT Management"
    content:
      - "Weekly SLA summary"
      - "Trend analysis"
      - "Top issues"
      - "Remediation progress"
    format: "PDF/Presentation"
    
  monthly_report:
    audience: "IT Leadership, Business Stakeholders"
    content:
      - "Monthly SLA achievement"
      - "Availability by site/tier"
      - "Performance metrics"
      - "Incident response metrics"
      - "Change management metrics"
      - "Trend analysis (3-month)"
      - "Improvement initiatives"
    format: "Executive Report"
    
  quarterly_report:
    audience: "Executive Team, Board"
    content:
      - "Quarterly SLA summary"
      - "Business impact analysis"
      - "Cost of downtime"
      - "Investment recommendations"
      - "Risk assessment"
    format: "Executive Summary"
```

### Automated SLA Report Generator

```python
#!/usr/bin/env python3
"""
SLA Report Generator
Generates comprehensive SLA reports
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List
import os

class SLAReportGenerator:
    def __init__(self, config):
        self.config = config
        self.report_data = {}
        
    def collect_availability_data(self, start_date, end_date):
        """Collect availability metrics"""
        # In production, query vManage API
        return {
            'overall': 99.97,
            'by_tier': {
                'tier_1': {'target': 99.99, 'actual': 99.995, 'met': True},
                'tier_2': {'target': 99.95, 'actual': 99.96, 'met': True},
                'tier_3': {'target': 99.5, 'actual': 99.8, 'met': True}
            },
            'by_site': [
                {'site': 'Mumbai Hub', 'availability': 99.998},
                {'site': 'Chennai Hub', 'availability': 99.995},
                {'site': 'Bangalore Branch', 'availability': 99.96},
                {'site': 'Delhi Branch', 'availability': 99.94},
                {'site': 'London Branch', 'availability': 99.97}
            ]
        }
        
    def collect_performance_data(self, start_date, end_date):
        """Collect performance metrics"""
        return {
            'latency': {
                'average': 45,
                'p95': 78,
                'max': 120,
                'sla_target': 100,
                'sla_met': True
            },
            'packet_loss': {
                'average': 0.02,
                'p95': 0.05,
                'max': 0.08,
                'sla_target': 0.1,
                'sla_met': True
            },
            'jitter': {
                'average': 12,
                'p95': 25,
                'max': 45,
                'sla_target': 30,
                'sla_met': True
            }
        }
        
    def collect_incident_data(self, start_date, end_date):
        """Collect incident metrics"""
        return {
            'total_incidents': 15,
            'by_severity': {
                'SEV-1': {'count': 2, 'response_met': 2, 'resolution_met': 1},
                'SEV-2': {'count': 5, 'response_met': 5, 'resolution_met': 4},
                'SEV-3': {'count': 6, 'response_met': 6, 'resolution_met': 6},
                'SEV-4': {'count': 2, 'response_met': 2, 'resolution_met': 2}
            },
            'response_sla_achievement': 100,
            'resolution_sla_achievement': 86.7,
            'mttr_hours': 2.5
        }
        
    def collect_change_data(self, start_date, end_date):
        """Collect change management metrics"""
        return {
            'total_changes': 45,
            'successful': 44,
            'failed': 1,
            'success_rate': 97.8,
            'on_time': 42,
            'on_time_rate': 93.3,
            'emergency_changes': 2,
            'emergency_rate': 4.4,
            'change_incidents': 0,
            'incident_rate': 0
        }
        
    def generate_monthly_report(self, year, month):
        """Generate comprehensive monthly SLA report"""
        start_date = datetime(year, month, 1)
        end_date = datetime(year, month + 1, 1) if month < 12 else datetime(year + 1, 1, 1)
        
        report = {
            'metadata': {
                'report_type': 'Monthly SLA Report',
                'period': f"{year}-{month:02d}",
                'generated_at': datetime.now().isoformat(),
                'generated_by': 'SLA Report Generator'
            },
            'executive_summary': {},
            'availability': self.collect_availability_data(start_date, end_date),
            'performance': self.collect_performance_data(start_date, end_date),
            'incidents': self.collect_incident_data(start_date, end_date),
            'changes': self.collect_change_data(start_date, end_date)
        }
        
        # Generate executive summary
        report['executive_summary'] = {
            'overall_sla_status': 'MET',
            'availability_achievement': f"{report['availability']['overall']}%",
            'performance_status': 'All metrics within SLA',
            'incident_resolution_rate': f"{report['incidents']['resolution_sla_achievement']}%",
            'change_success_rate': f"{report['changes']['success_rate']}%",
            'key_highlights': [
                "Network availability exceeded 99.95% target",
                "All performance metrics within SLA thresholds",
                "One SEV-1 incident exceeded resolution SLA",
                "Change success rate above 95% target"
            ],
            'areas_for_improvement': [
                "SEV-1 resolution time improvement needed",
                "Continue monitoring high-latency paths"
            ]
        }
        
        return report
        
    def format_markdown_report(self, report):
        """Format report as Markdown"""
        md = []
        
        md.append(f"# SD-WAN SLA Report - {report['metadata']['period']}")
        md.append(f"\n*Generated: {report['metadata']['generated_at']}*\n")
        
        # Executive Summary
        md.append("## Executive Summary\n")
        md.append(f"**Overall SLA Status:** {report['executive_summary']['overall_sla_status']}\n")
        
        md.append("### Key Metrics")
        md.append(f"- Availability: {report['executive_summary']['availability_achievement']}")
        md.append(f"- Incident Resolution: {report['executive_summary']['incident_resolution_rate']}")
        md.append(f"- Change Success: {report['executive_summary']['change_success_rate']}\n")
        
        md.append("### Key Highlights")
        for highlight in report['executive_summary']['key_highlights']:
            md.append(f"- {highlight}")
        md.append("")
        
        md.append("### Areas for Improvement")
        for area in report['executive_summary']['areas_for_improvement']:
            md.append(f"- {area}")
        md.append("")
        
        # Availability Section
        md.append("## Network Availability\n")
        md.append(f"**Overall Availability:** {report['availability']['overall']}%\n")
        
        md.append("### By Service Tier")
        md.append("| Tier | Target | Actual | Status |")
        md.append("|------|--------|--------|--------|")
        for tier, data in report['availability']['by_tier'].items():
            status = "✓ Met" if data['met'] else "✗ Missed"
            md.append(f"| {tier.replace('_', ' ').title()} | {data['target']}% | {data['actual']}% | {status} |")
        md.append("")
        
        # Performance Section
        md.append("## Performance Metrics\n")
        md.append("| Metric | Average | P95 | Max | Target | Status |")
        md.append("|--------|---------|-----|-----|--------|--------|")
        
        perf = report['performance']
        md.append(f"| Latency (ms) | {perf['latency']['average']} | {perf['latency']['p95']} | {perf['latency']['max']} | <{perf['latency']['sla_target']} | {'✓' if perf['latency']['sla_met'] else '✗'} |")
        md.append(f"| Packet Loss (%) | {perf['packet_loss']['average']} | {perf['packet_loss']['p95']} | {perf['packet_loss']['max']} | <{perf['packet_loss']['sla_target']} | {'✓' if perf['packet_loss']['sla_met'] else '✗'} |")
        md.append(f"| Jitter (ms) | {perf['jitter']['average']} | {perf['jitter']['p95']} | {perf['jitter']['max']} | <{perf['jitter']['sla_target']} | {'✓' if perf['jitter']['sla_met'] else '✗'} |")
        md.append("")
        
        # Incidents Section
        md.append("## Incident Management\n")
        md.append(f"**Total Incidents:** {report['incidents']['total_incidents']}\n")
        md.append(f"**Response SLA Achievement:** {report['incidents']['response_sla_achievement']}%\n")
        md.append(f"**Resolution SLA Achievement:** {report['incidents']['resolution_sla_achievement']}%\n")
        md.append(f"**Mean Time to Resolve:** {report['incidents']['mttr_hours']} hours\n")
        
        md.append("### By Severity")
        md.append("| Severity | Count | Response Met | Resolution Met |")
        md.append("|----------|-------|--------------|----------------|")
        for sev, data in report['incidents']['by_severity'].items():
            md.append(f"| {sev} | {data['count']} | {data['response_met']}/{data['count']} | {data['resolution_met']}/{data['count']} |")
        md.append("")
        
        # Changes Section
        md.append("## Change Management\n")
        changes = report['changes']
        md.append(f"**Total Changes:** {changes['total_changes']}\n")
        md.append(f"**Success Rate:** {changes['success_rate']}% (Target: >95%)\n")
        md.append(f"**On-Time Delivery:** {changes['on_time_rate']}% (Target: >90%)\n")
        md.append(f"**Emergency Change Rate:** {changes['emergency_rate']}% (Target: <5%)\n")
        md.append(f"**Change-Related Incidents:** {changes['incident_rate']}% (Target: <2%)\n")
        
        return "\n".join(md)
        
    def save_report(self, report, format='markdown'):
        """Save report to file"""
        period = report['metadata']['period']
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        
        if format == 'markdown':
            filename = f"sla_report_{period}_{timestamp}.md"
            content = self.format_markdown_report(report)
        else:
            filename = f"sla_report_{period}_{timestamp}.json"
            content = json.dumps(report, indent=2)
            
        filepath = f"/var/reports/{filename}"
        os.makedirs(os.path.dirname(filepath), exist_ok=True)
        
        with open(filepath, 'w') as f:
            f.write(content)
            
        return filepath


if __name__ == "__main__":
    config = {
        'vmanage_host': '10.100.1.10',
        'report_path': '/var/reports'
    }
    
    generator = SLAReportGenerator(config)
    
    # Generate current month report
    now = datetime.now()
    report = generator.generate_monthly_report(now.year, now.month)
    
    # Print markdown report
    print(generator.format_markdown_report(report))
```

---

## 6.15.7 SLA Violation Management

### Violation Handling Process

```yaml
sla_violation_process:
  detection:
    automated:
      - "Real-time monitoring alerts"
      - "Threshold breach notifications"
      - "Trend analysis warnings"
    manual:
      - "Monthly SLA review"
      - "Customer complaints"
      - "Audit findings"
      
  classification:
    minor:
      description: "Single metric slightly over threshold"
      response: "Document and monitor"
      escalation: "Weekly report"
      
    moderate:
      description: "Multiple metrics or significant breach"
      response: "Root cause analysis"
      escalation: "Manager notification"
      
    major:
      description: "Critical SLA breach affecting business"
      response: "Immediate action required"
      escalation: "Director notification"
      
  remediation:
    immediate_actions:
      - "Identify root cause"
      - "Implement fix or workaround"
      - "Document incident"
      
    follow_up_actions:
      - "Complete root cause analysis"
      - "Implement permanent fix"
      - "Update procedures if needed"
      - "Report to stakeholders"
      
  service_credits:
    calculation: "Based on contract terms"
    approval: "Service Delivery Manager"
    documentation: "Formal request required"
```

### SLA Escalation Matrix

```yaml
sla_escalation_matrix:
  level_1:
    trigger: "SLA warning threshold reached"
    notified: "Operations Team Lead"
    response_time: "1 hour"
    action: "Investigate and remediate"
    
  level_2:
    trigger: "SLA breached < 1 hour"
    notified: "Network Manager"
    response_time: "30 minutes"
    action: "Review remediation, allocate resources"
    
  level_3:
    trigger: "SLA breached > 1 hour or major impact"
    notified: "IT Director"
    response_time: "15 minutes"
    action: "Executive oversight, vendor escalation"
    
  level_4:
    trigger: "SLA breached > 4 hours or business critical"
    notified: "CTO"
    response_time: "Immediate"
    action: "Crisis management, executive communication"
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
