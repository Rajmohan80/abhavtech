# Chapter 8: Advanced Features & Automation

# 8.1 AI Assistant Integration

## 8.1.1 Cisco AI Assistant Overview

### AI Network Assistant Capabilities

```yaml
ai_assistant:
  name: "Cisco AI Network Assistant"
  platform: "Cisco Catalyst SD-WAN Manager"
  version: "20.15.x"
  
  capabilities:
    natural_language_queries:
      description: "Ask questions in plain English"
      examples:
        - "Show me sites with high latency"
        - "What's causing packet loss on Mumbai tunnels?"
        - "Which applications are consuming most bandwidth?"
        
    automated_insights:
      description: "Proactive issue detection"
      features:
        - "Anomaly detection"
        - "Performance degradation alerts"
        - "Capacity warnings"
        
    remediation_suggestions:
      description: "Recommended actions for issues"
      features:
        - "Configuration recommendations"
        - "Policy optimization"
        - "Troubleshooting steps"
        
    predictive_analytics:
      description: "Forecast future issues"
      features:
        - "Capacity predictions"
        - "Failure predictions"
        - "Traffic trend analysis"
```

### AI Assistant Configuration

```yaml
ai_assistant_config:
  enablement:
    menu_path: "Administration > Settings > AI Assistant"
    status: "Enabled"
    
  data_sharing:
    telemetry: "Enabled (anonymized)"
    network_data: "Enabled"
    user_queries: "Enabled for improvement"
    
  privacy_settings:
    data_retention: "90 days"
    pii_handling: "Filtered"
    regional_compliance: "GDPR compliant"
    
  integration:
    webhooks: "Enabled"
    api_access: "Enabled"
    third_party: "ServiceNow integration"
```

## 8.1.2 Using AI Assistant

### Query Examples

```yaml
ai_query_examples:
  network_health:
    query: "What is the current health of my network?"
    response_includes:
      - "Overall health score"
      - "Sites with issues"
      - "Top problems"
      
  troubleshooting:
    query: "Why is the Delhi branch experiencing slow SAP performance?"
    response_includes:
      - "Path analysis"
      - "Latency measurements"
      - "Recommended actions"
      
  capacity:
    query: "Which circuits will exceed 80% utilization next month?"
    response_includes:
      - "Capacity predictions"
      - "Growth trends"
      - "Upgrade recommendations"
      
  security:
    query: "Show me any security anomalies in the last 24 hours"
    response_includes:
      - "Security events"
      - "Threat indicators"
      - "Recommended mitigations"
```

---

# 8.2 SD-WAN Analytics & Machine Learning

## 8.2.1 Analytics Architecture

### Analytics Components

```yaml
analytics_architecture:
  data_collection:
    sources:
      - "WAN Edge telemetry"
      - "Controller metrics"
      - "Application flows"
      - "Security events"
    frequency: "Real-time + 5-minute aggregations"
    retention: "90 days detailed, 1 year summarized"
    
  processing:
    stream_processing:
      engine: "Apache Kafka"
      latency: "<1 second"
      
    batch_processing:
      engine: "Apache Spark"
      frequency: "Hourly/Daily"
      
  storage:
    time_series: "InfluxDB"
    events: "Elasticsearch"
    ml_models: "TensorFlow Serving"
    
  visualization:
    dashboards: "vManage built-in"
    custom: "Grafana integration"
    export: "API/CSV"
```

### Machine Learning Models

```yaml
ml_models:
  anomaly_detection:
    name: "Network Anomaly Detection"
    algorithm: "Isolation Forest + LSTM"
    features:
      - "Latency patterns"
      - "Packet loss trends"
      - "Bandwidth utilization"
      - "Connection patterns"
    training: "Continuous learning"
    accuracy: ">95%"
    
  predictive_maintenance:
    name: "Device Health Prediction"
    algorithm: "Random Forest"
    features:
      - "CPU utilization trends"
      - "Memory patterns"
      - "Error rates"
      - "Temperature (if available)"
    prediction_horizon: "7 days"
    
  capacity_forecasting:
    name: "Bandwidth Forecasting"
    algorithm: "Prophet + ARIMA"
    features:
      - "Historical utilization"
      - "Seasonal patterns"
      - "Growth trends"
    prediction_horizon: "30-90 days"
    
  application_classification:
    name: "Application Identification"
    algorithm: "Deep Learning (CNN)"
    features:
      - "Flow patterns"
      - "Packet signatures"
      - "Behavioral analysis"
    accuracy: ">99%"
```

## 8.2.2 Analytics Dashboards

### Performance Analytics

```yaml
performance_analytics:
  application_experience:
    metrics:
      - "Application latency"
      - "Transaction time"
      - "User experience score"
    visualization: "Time series + heatmaps"
    
  path_analytics:
    metrics:
      - "Path latency"
      - "Jitter"
      - "Packet loss"
    visualization: "Path comparison charts"
    
  capacity_analytics:
    metrics:
      - "Bandwidth utilization"
      - "Peak usage"
      - "Forecast"
    visualization: "Trend lines + predictions"
```

### Custom Analytics Query

```python
#!/usr/bin/env python3
"""
SD-WAN Analytics Query Script
Query and analyze SD-WAN metrics
"""

import requests
import pandas as pd
from datetime import datetime, timedelta

class SDWANAnalytics:
    def __init__(self, vmanage_host, username, password):
        self.base_url = f"https://{vmanage_host}"
        self.session = requests.Session()
        self.session.verify = False
        self.authenticate(username, password)
        
    def authenticate(self, username, password):
        auth_url = f"{self.base_url}/j_security_check"
        self.session.post(auth_url, data={'j_username': username, 'j_password': password})
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        if token_response.status_code == 200:
            self.session.headers['X-XSRF-TOKEN'] = token_response.text
            
    def get_app_route_statistics(self, hours=24):
        """Get application-aware routing statistics"""
        url = f"{self.base_url}/dataservice/statistics/approute"
        end_time = datetime.now()
        start_time = end_time - timedelta(hours=hours)
        
        params = {
            'startDate': start_time.strftime('%Y-%m-%dT%H:%M:%S'),
            'endDate': end_time.strftime('%Y-%m-%dT%H:%M:%S')
        }
        
        response = self.session.get(url, params=params)
        return response.json().get('data', []) if response.status_code == 200 else []
        
    def get_tunnel_statistics(self, device_id, hours=24):
        """Get tunnel statistics for a device"""
        url = f"{self.base_url}/dataservice/statistics/interface"
        params = {
            'deviceId': device_id,
            'hours': hours
        }
        
        response = self.session.get(url, params=params)
        return response.json().get('data', []) if response.status_code == 200 else []
        
    def analyze_latency_trends(self, data):
        """Analyze latency trends from app-route data"""
        if not data:
            return None
            
        df = pd.DataFrame(data)
        
        analysis = {
            'avg_latency': df['latency'].mean(),
            'max_latency': df['latency'].max(),
            'p95_latency': df['latency'].quantile(0.95),
            'trend': 'increasing' if df['latency'].iloc[-10:].mean() > df['latency'].iloc[:10].mean() else 'stable'
        }
        
        return analysis
        
    def detect_anomalies(self, data, threshold_std=2):
        """Simple anomaly detection using standard deviation"""
        if not data:
            return []
            
        df = pd.DataFrame(data)
        
        mean = df['latency'].mean()
        std = df['latency'].std()
        
        anomalies = df[df['latency'] > mean + threshold_std * std]
        
        return anomalies.to_dict('records')
        
    def generate_report(self, hours=24):
        """Generate analytics report"""
        app_route_data = self.get_app_route_statistics(hours)
        
        report = {
            'generated_at': datetime.now().isoformat(),
            'period_hours': hours,
            'latency_analysis': self.analyze_latency_trends(app_route_data),
            'anomalies': self.detect_anomalies(app_route_data),
            'data_points': len(app_route_data)
        }
        
        return report


if __name__ == "__main__":
    analytics = SDWANAnalytics(
        vmanage_host="10.100.1.10",
        username="admin",
        password="admin_password"
    )
    
    report = analytics.generate_report(hours=24)
    print(f"Analytics Report: {report}")
```

---

# 8.3 Python SDK

## 8.3.1 SDK Overview

### vManage Python SDK

```yaml
python_sdk:
  name: "vManage API SDK"
  repository: "https://github.com/CiscoDevNet/vmanage-api"
  version: "Compatible with 20.x"
  
  capabilities:
    - "Authentication management"
    - "Device inventory"
    - "Template management"
    - "Policy operations"
    - "Monitoring and alerts"
    - "Reporting"
    
  installation: |
    pip install vmanage-api
    # Or install from source
    git clone https://github.com/CiscoDevNet/vmanage-api.git
    cd vmanage-api
    pip install -e .
```

## 8.3.2 SDK Implementation

### Core SDK Class

```python
#!/usr/bin/env python3
"""
Abhavtech SD-WAN SDK
Production-ready wrapper for vManage API
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, List, Optional
import urllib3
urllib3.disable_warnings()


class AbhavtechSDWAN:
    """Main SDK class for Abhavtech SD-WAN operations"""
    
    def __init__(self, host: str, username: str, password: str, port: int = 443):
        self.host = host
        self.port = port
        self.username = username
        self.password = password
        self.base_url = f"https://{host}:{port}"
        self.session = requests.Session()
        self.session.verify = False
        self.token = None
        self._authenticate()
        
    def _authenticate(self):
        """Authenticate to vManage"""
        auth_url = f"{self.base_url}/j_security_check"
        payload = {
            'j_username': self.username,
            'j_password': self.password
        }
        
        response = self.session.post(auth_url, data=payload)
        
        if response.status_code != 200 or '<html>' in response.text:
            raise Exception("Authentication failed")
            
        # Get XSRF token
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url)
        
        if token_response.status_code == 200:
            self.token = token_response.text
            self.session.headers['X-XSRF-TOKEN'] = self.token
            
    def _get(self, endpoint: str, params: dict = None) -> dict:
        """Generic GET request"""
        url = f"{self.base_url}/dataservice/{endpoint}"
        response = self.session.get(url, params=params)
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"GET {endpoint} failed: {response.status_code}")
            
    def _post(self, endpoint: str, data: dict) -> dict:
        """Generic POST request"""
        url = f"{self.base_url}/dataservice/{endpoint}"
        headers = {'Content-Type': 'application/json'}
        response = self.session.post(url, headers=headers, json=data)
        
        if response.status_code in [200, 201]:
            return response.json()
        else:
            raise Exception(f"POST {endpoint} failed: {response.status_code}")
            
    # Device Operations
    def get_devices(self, device_type: str = None) -> List[Dict]:
        """Get all devices or filter by type"""
        result = self._get("device")
        devices = result.get('data', [])
        
        if device_type:
            devices = [d for d in devices if d.get('device-type') == device_type]
            
        return devices
        
    def get_device_status(self, device_id: str) -> Dict:
        """Get detailed device status"""
        return self._get(f"device/status?deviceId={device_id}")
        
    def get_device_counters(self) -> Dict:
        """Get device counters summary"""
        return self._get("device/counters")
        
    # Template Operations
    def get_feature_templates(self) -> List[Dict]:
        """Get all feature templates"""
        result = self._get("template/feature")
        return result.get('data', [])
        
    def get_device_templates(self) -> List[Dict]:
        """Get all device templates"""
        result = self._get("template/device")
        return result.get('data', [])
        
    def attach_template(self, template_id: str, device_ids: List[str], variables: Dict) -> str:
        """Attach template to devices"""
        payload = {
            'deviceTemplateList': [{
                'templateId': template_id,
                'device': [{'csv-deviceId': did, **variables} for did in device_ids],
                'isEdited': False,
                'isMasterEdited': False
            }]
        }
        
        result = self._post("template/device/config/attachcli", payload)
        return result.get('id')  # Returns task ID
        
    # Policy Operations
    def get_policies(self) -> List[Dict]:
        """Get all policies"""
        result = self._get("template/policy/vsmart")
        return result.get('data', [])
        
    def activate_policy(self, policy_id: str) -> str:
        """Activate a policy"""
        payload = {'policyId': policy_id}
        result = self._post("template/policy/vsmart/activate", payload)
        return result.get('id')
        
    # Monitoring Operations
    def get_alarms(self, active_only: bool = True) -> List[Dict]:
        """Get alarms"""
        params = {}
        if active_only:
            params['query'] = json.dumps({'rules': [{'field': 'active', 'value': ['true']}]})
            
        result = self._get("alarms", params)
        return result.get('data', [])
        
    def get_bfd_sessions(self, device_id: str = None) -> List[Dict]:
        """Get BFD session status"""
        endpoint = "device/bfd/sessions"
        if device_id:
            endpoint += f"?deviceId={device_id}"
            
        result = self._get(endpoint)
        return result.get('data', [])
        
    def get_control_connections(self, device_id: str = None) -> List[Dict]:
        """Get control connections"""
        endpoint = "device/control/connections"
        if device_id:
            endpoint += f"?deviceId={device_id}"
            
        result = self._get(endpoint)
        return result.get('data', [])
        
    def get_omp_routes(self, device_id: str) -> List[Dict]:
        """Get OMP routes for device"""
        result = self._get(f"device/omp/routes?deviceId={device_id}")
        return result.get('data', [])
        
    # Statistics Operations
    def get_interface_statistics(self, device_id: str, hours: int = 24) -> List[Dict]:
        """Get interface statistics"""
        result = self._get(f"statistics/interface?deviceId={device_id}&hours={hours}")
        return result.get('data', [])
        
    def get_app_route_statistics(self, device_id: str = None, hours: int = 24) -> List[Dict]:
        """Get application-aware routing statistics"""
        endpoint = f"statistics/approute?hours={hours}"
        if device_id:
            endpoint += f"&deviceId={device_id}"
            
        result = self._get(endpoint)
        return result.get('data', [])
        
    # Task Operations
    def get_task_status(self, task_id: str) -> Dict:
        """Get status of async task"""
        result = self._get(f"device/action/status/{task_id}")
        return result
        
    def wait_for_task(self, task_id: str, timeout: int = 300, interval: int = 10) -> Dict:
        """Wait for task completion"""
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            status = self.get_task_status(task_id)
            
            if status.get('summary', {}).get('status') in ['done', 'success']:
                return status
            elif status.get('summary', {}).get('status') == 'failure':
                raise Exception(f"Task {task_id} failed")
                
            time.sleep(interval)
            
        raise TimeoutError(f"Task {task_id} timed out")
        
    # Utility Methods
    def health_check(self) -> Dict:
        """Perform comprehensive health check"""
        health = {
            'timestamp': datetime.now().isoformat(),
            'vmanage': 'healthy',
            'devices': {},
            'alarms': {}
        }
        
        # Check devices
        devices = self.get_devices()
        health['devices'] = {
            'total': len(devices),
            'reachable': sum(1 for d in devices if d.get('reachability') == 'reachable'),
            'unreachable': sum(1 for d in devices if d.get('reachability') != 'reachable')
        }
        
        # Check alarms
        alarms = self.get_alarms()
        health['alarms'] = {
            'total': len(alarms),
            'critical': sum(1 for a in alarms if a.get('severity') == 'Critical'),
            'major': sum(1 for a in alarms if a.get('severity') == 'Major')
        }
        
        return health


# Example usage
if __name__ == "__main__":
    sdk = AbhavtechSDWAN(
        host="vmanage.abhavtech.com",
        username="admin",
        password="admin_password"
    )
    
    # Health check
    health = sdk.health_check()
    print(f"Network Health: {json.dumps(health, indent=2)}")
    
    # Get all WAN Edges
    wan_edges = sdk.get_devices(device_type='vedge')
    print(f"WAN Edges: {len(wan_edges)}")
    
    # Get active alarms
    alarms = sdk.get_alarms(active_only=True)
    print(f"Active Alarms: {len(alarms)}")
```

## 8.3.3 SDK Use Cases

### Automated Health Check Script

```python
#!/usr/bin/env python3
"""
Automated Network Health Check
Runs daily and generates report
"""

from abhavtech_sdk import AbhavtechSDWAN
from datetime import datetime
import smtplib
from email.mime.text import MIMEText
import json


def run_health_check():
    sdk = AbhavtechSDWAN(
        host="vmanage.abhavtech.com",
        username="automation_user",
        password="secure_password"
    )
    
    report = {
        'timestamp': datetime.now().isoformat(),
        'summary': 'HEALTHY',
        'checks': []
    }
    
    # Check 1: Device Reachability
    devices = sdk.get_devices()
    unreachable = [d for d in devices if d.get('reachability') != 'reachable']
    
    report['checks'].append({
        'name': 'Device Reachability',
        'status': 'PASS' if not unreachable else 'FAIL',
        'details': f"{len(devices) - len(unreachable)}/{len(devices)} devices reachable"
    })
    
    if unreachable:
        report['summary'] = 'DEGRADED'
        
    # Check 2: Control Connections
    counters = sdk.get_device_counters()
    expected = counters.get('data', [{}])[0].get('expectedControlConnections', 0)
    actual = counters.get('data', [{}])[0].get('controlConnections', 0)
    
    report['checks'].append({
        'name': 'Control Connections',
        'status': 'PASS' if actual >= expected else 'FAIL',
        'details': f"{actual}/{expected} control connections"
    })
    
    # Check 3: Active Alarms
    alarms = sdk.get_alarms()
    critical = sum(1 for a in alarms if a.get('severity') == 'Critical')
    
    report['checks'].append({
        'name': 'Critical Alarms',
        'status': 'PASS' if critical == 0 else 'FAIL',
        'details': f"{critical} critical alarms"
    })
    
    if critical > 0:
        report['summary'] = 'CRITICAL'
        
    return report


def send_report(report):
    """Send report via email"""
    msg = MIMEText(json.dumps(report, indent=2))
    msg['Subject'] = f"SD-WAN Health Report - {report['summary']}"
    msg['From'] = "sdwan-monitoring@abhavtech.com"
    msg['To'] = "network-team@abhavtech.com"
    
    # Send email (configure SMTP server)
    # smtp = smtplib.SMTP('mail.abhavtech.com')
    # smtp.send_message(msg)
    # smtp.quit()
    
    print(f"Report sent: {report['summary']}")


if __name__ == "__main__":
    report = run_health_check()
    print(json.dumps(report, indent=2))
    send_report(report)
```

### Bulk Configuration Script

```python
#!/usr/bin/env python3
"""
Bulk Configuration Update Script
Apply configuration changes to multiple devices
"""

from abhavtech_sdk import AbhavtechSDWAN
import json
import sys


def bulk_update_ntp(sdk, ntp_servers):
    """Update NTP servers across all devices"""
    
    # Get all feature templates of type 'cisco_system'
    templates = sdk.get_feature_templates()
    system_templates = [t for t in templates if t.get('templateType') == 'cisco_system']
    
    results = []
    
    for template in system_templates:
        # This would require template modification logic
        # Simplified example
        print(f"Would update template: {template.get('templateName')}")
        results.append({
            'template': template.get('templateName'),
            'status': 'would_update'
        })
        
    return results


def bulk_get_config_diff(sdk):
    """Get configuration drift across devices"""
    
    devices = sdk.get_devices(device_type='vedge')
    diffs = []
    
    for device in devices:
        # Check if running config matches template
        device_id = device.get('deviceId')
        
        # Would need to implement config comparison
        print(f"Checking device: {device.get('host-name')}")
        
    return diffs


if __name__ == "__main__":
    sdk = AbhavtechSDWAN(
        host="vmanage.abhavtech.com",
        username="admin",
        password="admin_password"
    )
    
    # Example: Update NTP
    ntp_servers = ["10.100.1.5", "10.100.1.6"]
    results = bulk_update_ntp(sdk, ntp_servers)
    print(json.dumps(results, indent=2))
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
