# 8.9 Event-Driven Automation

## 8.9.1 Event Architecture

### Event-Driven Framework

```yaml
event_driven_architecture:
  event_sources:
    vmanage_alarms:
      type: "Polling + Webhooks"
      frequency: "Real-time"
      categories:
        - "Control plane events"
        - "Data plane events"
        - "Security events"
        - "System events"
        
    syslog:
      type: "Stream"
      protocol: "UDP/TCP"
      format: "RFC 5424"
      
    snmp_traps:
      type: "Push"
      version: "SNMPv3"
      
  event_processor:
    type: "Apache Kafka"
    topics:
      - "sdwan-alarms"
      - "sdwan-syslog"
      - "sdwan-metrics"
      
  automation_engine:
    platform: "Custom Python + Ansible"
    triggers:
      - "Pattern matching"
      - "Threshold breach"
      - "Correlation rules"
```

### Event Processing Pipeline

```python
#!/usr/bin/env python3
"""
SD-WAN Event Processing Pipeline
"""

import json
import logging
from datetime import datetime
from typing import Dict, List, Callable
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class Event:
    """SD-WAN Event representation"""
    event_id: str
    event_type: str
    severity: str
    source: str
    timestamp: datetime
    data: Dict
    

class EventProcessor:
    """Process and route SD-WAN events"""
    
    def __init__(self):
        self.handlers: Dict[str, List[Callable]] = {}
        self.filters: List[Callable] = []
        self.processed_count = 0
        
    def register_handler(self, event_type: str, handler: Callable):
        """Register handler for event type"""
        if event_type not in self.handlers:
            self.handlers[event_type] = []
        self.handlers[event_type].append(handler)
        
    def register_filter(self, filter_func: Callable):
        """Register event filter"""
        self.filters.append(filter_func)
        
    def process_event(self, event: Event) -> bool:
        """Process a single event"""
        
        # Apply filters
        for filter_func in self.filters:
            if not filter_func(event):
                logger.debug(f"Event {event.event_id} filtered out")
                return False
                
        # Find handlers
        handlers = self.handlers.get(event.event_type, [])
        handlers.extend(self.handlers.get('*', []))  # Wildcard handlers
        
        if not handlers:
            logger.warning(f"No handler for event type: {event.event_type}")
            return False
            
        # Execute handlers
        for handler in handlers:
            try:
                handler(event)
            except Exception as e:
                logger.error(f"Handler error: {e}")
                
        self.processed_count += 1
        return True


class EventHandlers:
    """Standard event handlers"""
    
    @staticmethod
    def log_event(event: Event):
        """Log event to file"""
        logger.info(f"Event: {event.event_type} from {event.source} - {event.severity}")
        
    @staticmethod
    def alert_critical(event: Event):
        """Send alert for critical events"""
        if event.severity == 'Critical':
            # Send to PagerDuty/Teams/Email
            logger.warning(f"CRITICAL ALERT: {event.event_type} on {event.source}")
            
    @staticmethod
    def auto_remediate(event: Event):
        """Trigger auto-remediation"""
        remediation_map = {
            'bfd-state-change': 'tunnel_recovery',
            'memory-threshold': 'memory_cleanup',
            'certificate-expiring': 'cert_renewal'
        }
        
        if event.event_type in remediation_map:
            action = remediation_map[event.event_type]
            logger.info(f"Triggering remediation: {action}")
            # Execute remediation


class EventFilters:
    """Event filtering functions"""
    
    @staticmethod
    def severity_filter(min_severity: str):
        """Filter by minimum severity"""
        severity_order = ['Critical', 'Major', 'Minor', 'Warning']
        min_index = severity_order.index(min_severity)
        
        def filter_func(event: Event) -> bool:
            try:
                event_index = severity_order.index(event.severity)
                return event_index <= min_index
            except ValueError:
                return True
                
        return filter_func
        
    @staticmethod
    def site_filter(allowed_sites: List[str]):
        """Filter by site"""
        def filter_func(event: Event) -> bool:
            return event.data.get('site-id') in allowed_sites
        return filter_func


# Example usage
if __name__ == "__main__":
    processor = EventProcessor()
    
    # Register handlers
    processor.register_handler('*', EventHandlers.log_event)
    processor.register_handler('bfd-state-change', EventHandlers.auto_remediate)
    processor.register_handler('*', EventHandlers.alert_critical)
    
    # Register filters
    processor.register_filter(EventFilters.severity_filter('Minor'))
    
    # Process sample event
    event = Event(
        event_id="evt-001",
        event_type="bfd-state-change",
        severity="Major",
        source="bangalore-br-01",
        timestamp=datetime.now(),
        data={'site-id': '301', 'state': 'down'}
    )
    
    processor.process_event(event)
```

---

# 8.10 Webhook Integration

## 8.10.1 Webhook Configuration

### vManage Webhook Setup

```yaml
webhook_configuration:
  vmanage_settings:
    menu_path: "Administration > Settings > Webhooks"
    
  webhook_endpoints:
    servicenow:
      url: "https://abhavtech.service-now.com/api/now/table/incident"
      method: "POST"
      headers:
        Content-Type: "application/json"
        Authorization: "Basic [encoded_credentials]"
      events:
        - "all-alarms"
        
    teams:
      url: "https://outlook.office.com/webhook/[webhook_id]"
      method: "POST"
      events:
        - "critical-alarms"
        
    custom_endpoint:
      url: "https://automation.abhavtech.com/sdwan/events"
      method: "POST"
      headers:
        X-API-Key: "[api_key]"
      events:
        - "all-events"
```

### Webhook Receiver

```python
#!/usr/bin/env python3
"""
SD-WAN Webhook Receiver
Flask application to receive and process webhooks
"""

from flask import Flask, request, jsonify
import json
import logging
from datetime import datetime

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.route('/sdwan/events', methods=['POST'])
def receive_event():
    """Receive SD-WAN webhook events"""
    
    # Validate API key
    api_key = request.headers.get('X-API-Key')
    if api_key != 'expected_api_key':
        return jsonify({'error': 'Unauthorized'}), 401
        
    # Parse event
    event_data = request.get_json()
    
    logger.info(f"Received event: {json.dumps(event_data, indent=2)}")
    
    # Process event
    event_type = event_data.get('type')
    severity = event_data.get('severity')
    
    if severity == 'Critical':
        handle_critical_event(event_data)
    elif event_type in ['bfd-state-change', 'control-connection-state-change']:
        handle_connectivity_event(event_data)
        
    return jsonify({'status': 'received', 'timestamp': datetime.now().isoformat()})


def handle_critical_event(event):
    """Handle critical events"""
    logger.warning(f"CRITICAL EVENT: {event.get('type')} on {event.get('host-name')}")
    # Send to PagerDuty
    # Create ServiceNow incident
    # Send Teams notification
    

def handle_connectivity_event(event):
    """Handle connectivity events"""
    logger.info(f"Connectivity event: {event.get('type')}")
    # Trigger monitoring
    # Update dashboard


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, ssl_context='adhoc')
```

---

# 8.11 SIEM Integration

## 8.11.1 Splunk Integration

### Splunk Configuration

```yaml
splunk_integration:
  data_inputs:
    syslog:
      type: "UDP"
      port: 514
      sourcetype: "syslog"
      index: "sdwan"
      
    api_polling:
      type: "Scripted input"
      interval: "300 seconds"
      sourcetype: "sdwan:api"
      index: "sdwan"
      
  indexes:
    sdwan:
      retention: "90 days"
      max_size: "500 GB"
      
  sourcetypes:
    sdwan_alarms:
      description: "vManage alarms"
      
    sdwan_events:
      description: "System events"
      
    sdwan_metrics:
      description: "Performance metrics"
```

### Splunk App for SD-WAN

```python
#!/usr/bin/env python3
"""
Splunk Modular Input for SD-WAN
Polls vManage API and sends data to Splunk
"""

import sys
import json
import time
from datetime import datetime

# Splunk SDK imports would go here
# from splunklib.modularinput import *

class SDWANInput:
    """SD-WAN modular input for Splunk"""
    
    def __init__(self, vmanage_host, username, password):
        self.vmanage_host = vmanage_host
        self.username = username
        self.password = password
        # Initialize vManage connection
        
    def get_alarms(self):
        """Get alarms from vManage"""
        # API call to get alarms
        pass
        
    def get_device_status(self):
        """Get device status"""
        # API call to get device status
        pass
        
    def format_event(self, data, sourcetype):
        """Format data as Splunk event"""
        return {
            'time': time.time(),
            'sourcetype': sourcetype,
            'source': 'sdwan:api',
            'index': 'sdwan',
            'event': json.dumps(data)
        }
        
    def stream_events(self):
        """Stream events to Splunk"""
        # Get alarms
        alarms = self.get_alarms()
        for alarm in alarms:
            yield self.format_event(alarm, 'sdwan:alarms')
            
        # Get device status
        devices = self.get_device_status()
        for device in devices:
            yield self.format_event(device, 'sdwan:devices')
```

### Splunk Dashboards

```xml
<!-- SD-WAN Overview Dashboard -->
<dashboard>
  <label>SD-WAN Overview</label>
  
  <row>
    <panel>
      <title>Device Health</title>
      <single>
        <search>
          <query>
            index=sdwan sourcetype=sdwan:devices 
            | stats dc(device_id) as total, 
                    dc(eval(if(reachability="reachable",device_id,null()))) as healthy
            | eval health_pct=round(healthy/total*100,1)
            | fields health_pct
          </query>
        </search>
      </single>
    </panel>
    
    <panel>
      <title>Active Alarms</title>
      <single>
        <search>
          <query>
            index=sdwan sourcetype=sdwan:alarms active=true
            | stats count
          </query>
        </search>
      </single>
    </panel>
  </row>
  
  <row>
    <panel>
      <title>Alarm Trend</title>
      <chart>
        <search>
          <query>
            index=sdwan sourcetype=sdwan:alarms
            | timechart span=1h count by severity
          </query>
        </search>
        <option name="charting.chart">line</option>
      </chart>
    </panel>
  </row>
</dashboard>
```

---

# 8.12 Custom Applications

## 8.12.1 Custom Dashboard Application

### React Dashboard

```javascript
// SD-WAN Dashboard React Component

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SDWANDashboard = () => {
  const [devices, setDevices] = useState([]);
  const [alarms, setAlarms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    try {
      const [deviceRes, alarmRes] = await Promise.all([
        axios.get('/api/sdwan/devices'),
        axios.get('/api/sdwan/alarms')
      ]);
      setDevices(deviceRes.data);
      setAlarms(alarmRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getHealthStatus = () => {
    const total = devices.length;
    const healthy = devices.filter(d => d.reachability === 'reachable').length;
    return { total, healthy, percentage: ((healthy / total) * 100).toFixed(1) };
  };

  if (loading) return <div>Loading...</div>;

  const health = getHealthStatus();

  return (
    <div className="dashboard">
      <h1>SD-WAN Dashboard</h1>
      
      <div className="metrics-row">
        <div className="metric-card">
          <h3>Network Health</h3>
          <div className="metric-value">{health.percentage}%</div>
          <div className="metric-detail">{health.healthy}/{health.total} devices</div>
        </div>
        
        <div className="metric-card">
          <h3>Active Alarms</h3>
          <div className="metric-value">{alarms.length}</div>
          <div className="metric-detail">
            {alarms.filter(a => a.severity === 'Critical').length} critical
          </div>
        </div>
      </div>
      
      <div className="device-list">
        <h2>Devices</h2>
        <table>
          <thead>
            <tr>
              <th>Hostname</th>
              <th>System IP</th>
              <th>Status</th>
              <th>Site ID</th>
            </tr>
          </thead>
          <tbody>
            {devices.map(device => (
              <tr key={device.deviceId}>
                <td>{device['host-name']}</td>
                <td>{device['system-ip']}</td>
                <td className={device.reachability === 'reachable' ? 'status-up' : 'status-down'}>
                  {device.reachability}
                </td>
                <td>{device['site-id']}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SDWANDashboard;
```

---

# 8.13 Automated Reporting

## 8.13.1 Report Generation

### Report Generator

```python
#!/usr/bin/env python3
"""
SD-WAN Automated Report Generator
Generates daily/weekly/monthly reports
"""

import json
from datetime import datetime, timedelta
from typing import Dict, List
import pandas as pd
from jinja2 import Template

class ReportGenerator:
    def __init__(self, sdk):
        self.sdk = sdk
        
    def generate_daily_report(self) -> Dict:
        """Generate daily operational report"""
        
        report = {
            'report_type': 'daily',
            'generated_at': datetime.now().isoformat(),
            'period': {
                'start': (datetime.now() - timedelta(days=1)).isoformat(),
                'end': datetime.now().isoformat()
            },
            'sections': {}
        }
        
        # Device Health
        devices = self.sdk.get_devices()
        report['sections']['device_health'] = {
            'total_devices': len(devices),
            'reachable': sum(1 for d in devices if d.get('reachability') == 'reachable'),
            'unreachable': sum(1 for d in devices if d.get('reachability') != 'reachable'),
            'unreachable_list': [d['host-name'] for d in devices if d.get('reachability') != 'reachable']
        }
        
        # Alarms Summary
        alarms = self.sdk.get_alarms()
        report['sections']['alarms'] = {
            'total': len(alarms),
            'by_severity': {
                'critical': sum(1 for a in alarms if a.get('severity') == 'Critical'),
                'major': sum(1 for a in alarms if a.get('severity') == 'Major'),
                'minor': sum(1 for a in alarms if a.get('severity') == 'Minor')
            }
        }
        
        return report
        
    def generate_weekly_report(self) -> Dict:
        """Generate weekly summary report"""
        
        report = {
            'report_type': 'weekly',
            'generated_at': datetime.now().isoformat(),
            'sections': {}
        }
        
        # Include daily metrics aggregated
        # Include trending analysis
        # Include SLA metrics
        
        return report
        
    def render_html_report(self, report: Dict) -> str:
        """Render report as HTML"""
        
        template = Template("""
        <!DOCTYPE html>
        <html>
        <head>
            <title>SD-WAN {{ report.report_type|title }} Report</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { background: #0066cc; color: white; padding: 20px; }
                .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
                .metric { display: inline-block; margin: 10px; padding: 10px; background: #f5f5f5; }
                .critical { color: red; }
                .healthy { color: green; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>SD-WAN {{ report.report_type|title }} Report</h1>
                <p>Generated: {{ report.generated_at }}</p>
            </div>
            
            <div class="section">
                <h2>Device Health</h2>
                <div class="metric">
                    <strong>Total Devices:</strong> {{ report.sections.device_health.total_devices }}
                </div>
                <div class="metric healthy">
                    <strong>Reachable:</strong> {{ report.sections.device_health.reachable }}
                </div>
                <div class="metric critical">
                    <strong>Unreachable:</strong> {{ report.sections.device_health.unreachable }}
                </div>
            </div>
            
            <div class="section">
                <h2>Alarms Summary</h2>
                <div class="metric critical">
                    <strong>Critical:</strong> {{ report.sections.alarms.by_severity.critical }}
                </div>
                <div class="metric">
                    <strong>Major:</strong> {{ report.sections.alarms.by_severity.major }}
                </div>
                <div class="metric">
                    <strong>Minor:</strong> {{ report.sections.alarms.by_severity.minor }}
                </div>
            </div>
        </body>
        </html>
        """)
        
        return template.render(report=report)
        
    def send_report(self, report: Dict, recipients: List[str]):
        """Send report via email"""
        html_content = self.render_html_report(report)
        # Send via SMTP
        pass


if __name__ == "__main__":
    from abhavtech_sdk import AbhavtechSDWAN
    
    sdk = AbhavtechSDWAN(
        host="vmanage.abhavtech.com",
        username="admin",
        password="admin_password"
    )
    
    generator = ReportGenerator(sdk)
    report = generator.generate_daily_report()
    html = generator.render_html_report(report)
    
    with open('daily_report.html', 'w') as f:
        f.write(html)
```

---

# 8.14 Network Digital Twin

## 8.14.1 Digital Twin Architecture

### Digital Twin Framework

```yaml
digital_twin:
  purpose: "Virtual replica for simulation and what-if analysis"
  
  components:
    topology_model:
      description: "Complete network topology"
      data_sources:
        - "vManage device inventory"
        - "Template configurations"
        - "Policy definitions"
        
    traffic_model:
      description: "Traffic patterns and baselines"
      data_sources:
        - "NetFlow/IPFIX"
        - "Application statistics"
        - "Historical trends"
        
    simulation_engine:
      description: "Run what-if scenarios"
      capabilities:
        - "Failure simulation"
        - "Policy changes"
        - "Capacity planning"
        
  use_cases:
    failure_analysis:
      - "What if Mumbai hub fails?"
      - "What if MPLS circuit goes down?"
      
    change_validation:
      - "Test policy changes"
      - "Validate new site deployment"
      
    capacity_planning:
      - "Model bandwidth growth"
      - "Plan for new applications"
```

### Digital Twin Implementation

```python
#!/usr/bin/env python3
"""
SD-WAN Network Digital Twin
Simulation and what-if analysis
"""

import json
import networkx as nx
from typing import Dict, List
from dataclasses import dataclass


@dataclass
class Site:
    site_id: str
    name: str
    site_type: str  # hub/branch
    wan_edges: List[str]
    circuits: List[Dict]
    

@dataclass
class Tunnel:
    source: str
    destination: str
    transport: str  # mpls/internet
    metrics: Dict  # latency, loss, jitter
    

class NetworkDigitalTwin:
    """Digital twin of SD-WAN network"""
    
    def __init__(self):
        self.topology = nx.Graph()
        self.sites: Dict[str, Site] = {}
        self.tunnels: List[Tunnel] = []
        
    def load_from_vmanage(self, sdk):
        """Load topology from vManage"""
        
        # Load devices
        devices = sdk.get_devices()
        for device in devices:
            site_id = device.get('site-id')
            
            if site_id not in self.sites:
                self.sites[site_id] = Site(
                    site_id=site_id,
                    name=device.get('host-name', '').split('-')[0],
                    site_type='hub' if 'hub' in device.get('host-name', '').lower() else 'branch',
                    wan_edges=[],
                    circuits=[]
                )
                
            self.sites[site_id].wan_edges.append(device.get('deviceId'))
            
        # Load BFD sessions to build tunnel map
        for device in devices:
            bfd_sessions = sdk.get_bfd_sessions(device.get('deviceId'))
            
            for session in bfd_sessions:
                if session.get('state') == 'up':
                    self.tunnels.append(Tunnel(
                        source=device.get('site-id'),
                        destination=session.get('dst-site-id'),
                        transport=session.get('color'),
                        metrics={
                            'latency': session.get('average-latency', 0),
                            'loss': session.get('average-loss', 0),
                            'jitter': session.get('average-jitter', 0)
                        }
                    ))
                    
        # Build NetworkX graph
        for site_id, site in self.sites.items():
            self.topology.add_node(site_id, **vars(site))
            
        for tunnel in self.tunnels:
            self.topology.add_edge(
                tunnel.source,
                tunnel.destination,
                transport=tunnel.transport,
                **tunnel.metrics
            )
            
    def simulate_failure(self, failed_component: str) -> Dict:
        """Simulate component failure"""
        
        result = {
            'failed_component': failed_component,
            'impact': [],
            'recovery_paths': []
        }
        
        # Create copy of topology
        sim_topology = self.topology.copy()
        
        # Remove failed component
        if failed_component in sim_topology.nodes:
            # Site failure
            sim_topology.remove_node(failed_component)
            result['impact'].append(f"Site {failed_component} isolated")
            
            # Check connectivity
            if not nx.is_connected(sim_topology):
                components = list(nx.connected_components(sim_topology))
                for i, component in enumerate(components):
                    if len(component) < len(self.sites) / 2:
                        result['impact'].append(f"Isolated sites: {component}")
                        
        # Check for alternate paths
        for site_id in self.sites:
            if site_id != failed_component:
                for target in self.sites:
                    if target != site_id and target != failed_component:
                        try:
                            path = nx.shortest_path(sim_topology, site_id, target)
                            result['recovery_paths'].append({
                                'from': site_id,
                                'to': target,
                                'path': path
                            })
                        except nx.NetworkXNoPath:
                            result['impact'].append(f"No path from {site_id} to {target}")
                            
        return result
        
    def analyze_capacity(self, growth_rate: float = 0.1) -> Dict:
        """Analyze capacity with projected growth"""
        
        analysis = {
            'current_utilization': {},
            'projected_utilization': {},
            'recommendations': []
        }
        
        for tunnel in self.tunnels:
            # Simulate growth
            current_util = tunnel.metrics.get('utilization', 50)  # Placeholder
            projected_util = current_util * (1 + growth_rate)
            
            key = f"{tunnel.source}-{tunnel.destination}"
            analysis['current_utilization'][key] = current_util
            analysis['projected_utilization'][key] = projected_util
            
            if projected_util > 80:
                analysis['recommendations'].append({
                    'tunnel': key,
                    'action': 'Increase bandwidth',
                    'current': current_util,
                    'projected': projected_util
                })
                
        return analysis


if __name__ == "__main__":
    twin = NetworkDigitalTwin()
    
    # Load from vManage (would need SDK instance)
    # twin.load_from_vmanage(sdk)
    
    # Simulate failure
    # result = twin.simulate_failure('100')  # Mumbai site
    # print(json.dumps(result, indent=2))
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
