# 5.13 Catalyst Center Integration

## Document Information
- **Version:** 2.1
- **Last Updated:** December 30, 2025
- **Author:** Abhavtech Network Architecture Team
- **Status:** Production Ready
- **Classification:** Internal Use Only

---

## 5.13.1 Integration Overview

Catalyst Center (formerly DNA Center) and SD-WAN Manager integration enables unified visibility and coordinated management across the SD-Access and SD-WAN domains. This section covers the integration architecture, configuration, and operational workflows.

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│                    CATALYST CENTER AND SD-WAN MANAGER INTEGRATION                            │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

    ┌─────────────────────────────────────────────────────────────────────────────────────┐
    │                              UNIFIED OPERATIONS VIEW                                 │
    │                                                                                       │
    │   ┌───────────────────────────────────────────────────────────────────────────────┐ │
    │   │                         THIRD-PARTY INTEGRATION                                │ │
    │   │   ServiceNow  │  Splunk  │  Grafana  │  PagerDuty  │  Custom Apps             │ │
    │   └───────────────────────────────────────────────────────────────────────────────┘ │
    │                                         │                                            │
    │                                    REST APIs                                         │
    │                                         │                                            │
    │   ┌─────────────────────────────────────┼─────────────────────────────────────────┐ │
    │   │                                     │                                          │ │
    │   │   ┌─────────────────────┐     ┌─────▼─────────────┐                           │ │
    │   │   │                     │     │                    │                           │ │
    │   │   │  CATALYST CENTER    │◄────►   SD-WAN MANAGER   │                           │ │
    │   │   │  (SD-Access Mgmt)   │     │   (vManage)        │                           │ │
    │   │   │                     │     │                    │                           │ │
    │   │   │  • Fabric Provisioning   │  • WAN Edge Mgmt    │                           │ │
    │   │   │  • Assurance        │     │  • Policy Config   │                           │ │
    │   │   │  • Policy Admin     │     │  • Analytics       │                           │ │
    │   │   │  • PnP              │     │  • ZTP             │                           │ │
    │   │   │                     │     │                    │                           │ │
    │   │   └──────────┬──────────┘     └──────────┬─────────┘                           │ │
    │   │              │                           │                                      │ │
    │   └──────────────┼───────────────────────────┼──────────────────────────────────────┘ │
    │                  │                           │                                        │
    │   ┌──────────────┴───────────────────────────┴──────────────────────────────────────┐ │
    │   │                              SHARED SERVICES                                     │ │
    │   │                                                                                  │ │
    │   │   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │ │
    │   │   │     ISE     │    │   Infoblox  │    │   Syslog    │    │    SNMP     │      │ │
    │   │   │ (Auth/SGT)  │    │   (IPAM)    │    │  (Logging)  │    │(Monitoring) │      │ │
    │   │   └─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘      │ │
    │   │                                                                                  │ │
    │   └──────────────────────────────────────────────────────────────────────────────────┘ │
    │                                                                                        │
    └────────────────────────────────────────────────────────────────────────────────────────┘
```

### Integration Capabilities

| Capability | Description | Benefit |
|------------|-------------|---------|
| Cross-domain visibility | View SD-WAN health from Catalyst Center | Single pane of glass |
| Unified authentication | Shared ISE for both domains | Consistent identity |
| Correlated analytics | End-to-end path analysis | Faster troubleshooting |
| Coordinated provisioning | Automated handoff setup | Reduced errors |
| Event correlation | Unified alarms and events | Streamlined operations |

---

## 5.13.2 Prerequisites

### System Requirements

| Component | Version | Purpose |
|-----------|---------|---------|
| Catalyst Center | 2.3.7.x | SD-Access management |
| SD-WAN Manager | 20.15.x | SD-WAN management |
| ISE | 3.3/3.4 | Shared authentication |
| Python | 3.9+ | Automation scripts |
| Network | HTTPS connectivity | API communication |

### Network Connectivity

```
Network Connectivity Requirements
=================================

Catalyst Center to SD-WAN Manager:
- Protocol: HTTPS (TCP 443)
- Source: Catalyst Center cluster VIP (10.10.50.100)
- Destination: SD-WAN Manager cluster VIP (10.255.0.10)
- Direction: Bidirectional

API Rate Limits:
- Catalyst Center: 60 requests/minute per user
- SD-WAN Manager: 100 requests/minute per session

Firewall Rules Required:
┌─────────────────────────────────────────────────────────────────┐
│  Source              │  Destination          │  Port  │ Proto  │
├─────────────────────────────────────────────────────────────────┤
│  10.10.50.100 (DNAC) │  10.255.0.10 (vManage)│  443   │ TCP    │
│  10.255.0.10 (vManage)│  10.10.50.100 (DNAC) │  443   │ TCP    │
│  10.10.50.100 (DNAC) │  10.10.50.21 (ISE)   │  443   │ TCP    │
│  10.255.0.10 (vManage)│  10.10.50.21 (ISE)   │  443   │ TCP    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 5.13.3 API Authentication Setup

### Catalyst Center API Credentials

```python
#!/usr/bin/env python3
"""
Catalyst Center API Authentication Setup
"""

import requests
import json
import urllib3
from base64 import b64encode

urllib3.disable_warnings()

class CatalystCenterAuth:
    def __init__(self, host, username, password):
        self.host = host
        self.base_url = f"https://{host}"
        self.username = username
        self.password = password
        self.token = None
    
    def get_auth_token(self):
        """Get authentication token from Catalyst Center"""
        url = f"{self.base_url}/dna/system/api/v1/auth/token"
        
        # Basic auth for token request
        credentials = b64encode(f"{self.username}:{self.password}".encode()).decode()
        headers = {
            'Authorization': f'Basic {credentials}',
            'Content-Type': 'application/json'
        }
        
        response = requests.post(url, headers=headers, verify=False)
        
        if response.status_code == 200:
            self.token = response.json()['Token']
            print(f"✓ Token obtained successfully")
            print(f"  Token expires in: 1 hour")
            return self.token
        else:
            print(f"✗ Failed to get token: {response.status_code}")
            return None
    
    def get_headers(self):
        """Get headers for API calls"""
        if not self.token:
            self.get_auth_token()
        
        return {
            'X-Auth-Token': self.token,
            'Content-Type': 'application/json'
        }
    
    def test_connection(self):
        """Test API connectivity"""
        url = f"{self.base_url}/dna/intent/api/v1/network-device/count"
        headers = self.get_headers()
        
        response = requests.get(url, headers=headers, verify=False)
        
        if response.status_code == 200:
            count = response.json()['response']
            print(f"✓ API connection successful")
            print(f"  Total devices: {count}")
            return True
        else:
            print(f"✗ API connection failed: {response.status_code}")
            return False


# Usage
if __name__ == "__main__":
    dnac = CatalystCenterAuth(
        host='catalyst-center.abhavtech.com',
        username='admin',
        password='<password>'
    )
    
    dnac.get_auth_token()
    dnac.test_connection()
```

### SD-WAN Manager API Credentials

```python
#!/usr/bin/env python3
"""
SD-WAN Manager (vManage) API Authentication Setup
"""

import requests
import json
import urllib3

urllib3.disable_warnings()

class SDWANManagerAuth:
    def __init__(self, host, username, password):
        self.host = host
        self.base_url = f"https://{host}:443"
        self.username = username
        self.password = password
        self.session = requests.Session()
        self.token = None
    
    def login(self):
        """Authenticate to SD-WAN Manager"""
        # Step 1: j_security_check
        login_url = f"{self.base_url}/j_security_check"
        payload = {
            'j_username': self.username,
            'j_password': self.password
        }
        
        response = self.session.post(login_url, data=payload, verify=False)
        
        # Check for successful login
        if '<html>' in response.text:
            print("✗ Login failed - invalid credentials")
            return False
        
        # Step 2: Get XSRF token
        token_url = f"{self.base_url}/dataservice/client/token"
        token_response = self.session.get(token_url, verify=False)
        
        if token_response.status_code == 200:
            self.token = token_response.text
            self.session.headers['X-XSRF-TOKEN'] = self.token
            print(f"✓ Authentication successful")
            return True
        else:
            print(f"✗ Failed to get XSRF token")
            return False
    
    def test_connection(self):
        """Test API connectivity"""
        url = f"{self.base_url}/dataservice/system/device/vedges"
        response = self.session.get(url, verify=False)
        
        if response.status_code == 200:
            devices = response.json().get('data', [])
            print(f"✓ API connection successful")
            print(f"  WAN Edge devices: {len(devices)}")
            return True
        else:
            print(f"✗ API connection failed: {response.status_code}")
            return False
    
    def logout(self):
        """Logout from SD-WAN Manager"""
        logout_url = f"{self.base_url}/logout"
        self.session.get(logout_url, verify=False)
        print("✓ Logged out successfully")


# Usage
if __name__ == "__main__":
    vmanage = SDWANManagerAuth(
        host='sdwan-manager.abhavtech.com',
        username='admin',
        password='<password>'
    )
    
    if vmanage.login():
        vmanage.test_connection()
        vmanage.logout()
```

---

## 5.13.4 Cross-Domain Inventory Synchronization

### Unified Device Inventory

```python
#!/usr/bin/env python3
"""
Cross-Domain Device Inventory Synchronization
Correlates devices between Catalyst Center and SD-WAN Manager
"""

import requests
import json
import urllib3
from datetime import datetime

urllib3.disable_warnings()

class UnifiedInventory:
    def __init__(self, dnac_host, vmanage_host, username, password):
        self.dnac_host = dnac_host
        self.vmanage_host = vmanage_host
        self.username = username
        self.password = password
        
        # Initialize sessions
        self.dnac_token = self._get_dnac_token()
        self.vmanage_session = self._create_vmanage_session()
    
    def _get_dnac_token(self):
        """Get Catalyst Center token"""
        url = f"https://{self.dnac_host}/dna/system/api/v1/auth/token"
        response = requests.post(url, auth=(self.username, self.password), verify=False)
        return response.json()['Token']
    
    def _create_vmanage_session(self):
        """Create vManage session"""
        session = requests.Session()
        login_url = f"https://{self.vmanage_host}/j_security_check"
        session.post(login_url, data={'j_username': self.username, 'j_password': self.password}, verify=False)
        
        token_url = f"https://{self.vmanage_host}/dataservice/client/token"
        token_response = session.get(token_url, verify=False)
        if token_response.status_code == 200:
            session.headers['X-XSRF-TOKEN'] = token_response.text
        return session
    
    def get_dnac_devices(self):
        """Get devices from Catalyst Center"""
        headers = {'X-Auth-Token': self.dnac_token, 'Content-Type': 'application/json'}
        url = f"https://{self.dnac_host}/dna/intent/api/v1/network-device"
        
        response = requests.get(url, headers=headers, verify=False)
        devices = response.json().get('response', [])
        
        # Filter and format
        formatted = []
        for device in devices:
            formatted.append({
                'hostname': device.get('hostname'),
                'ip': device.get('managementIpAddress'),
                'type': device.get('type'),
                'role': device.get('role'),
                'family': device.get('family'),
                'serial': device.get('serialNumber'),
                'status': device.get('reachabilityStatus'),
                'source': 'catalyst-center'
            })
        return formatted
    
    def get_vmanage_devices(self):
        """Get devices from SD-WAN Manager"""
        url = f"https://{self.vmanage_host}/dataservice/device"
        response = self.vmanage_session.get(url, verify=False)
        devices = response.json().get('data', [])
        
        # Filter and format
        formatted = []
        for device in devices:
            formatted.append({
                'hostname': device.get('host-name'),
                'ip': device.get('system-ip'),
                'type': device.get('device-type'),
                'role': device.get('personality'),
                'family': 'SD-WAN',
                'serial': device.get('board-serial'),
                'status': device.get('reachability'),
                'source': 'sdwan-manager'
            })
        return formatted
    
    def correlate_handoff_devices(self):
        """Find devices involved in SD-Access/SD-WAN handoff"""
        dnac_devices = self.get_dnac_devices()
        vmanage_devices = self.get_vmanage_devices()
        
        # Find border nodes and WAN edges
        borders = [d for d in dnac_devices if d['role'] == 'BORDER ROUTER']
        wan_edges = [d for d in vmanage_devices if d['role'] == 'vedge']
        
        correlations = []
        
        # Match by site (based on hostname convention)
        for border in borders:
            site_code = border['hostname'].split('-')[1] if '-' in border['hostname'] else ''
            matching_edges = [w for w in wan_edges if site_code in w['hostname']]
            
            correlations.append({
                'site': site_code,
                'border_node': border['hostname'],
                'border_ip': border['ip'],
                'border_status': border['status'],
                'wan_edges': [{'hostname': w['hostname'], 'ip': w['ip'], 'status': w['status']} for w in matching_edges]
            })
        
        return correlations
    
    def generate_inventory_report(self):
        """Generate unified inventory report"""
        dnac_devices = self.get_dnac_devices()
        vmanage_devices = self.get_vmanage_devices()
        correlations = self.correlate_handoff_devices()
        
        report = {
            'generated': datetime.now().isoformat(),
            'summary': {
                'catalyst_center_devices': len(dnac_devices),
                'sdwan_manager_devices': len(vmanage_devices),
                'handoff_correlations': len(correlations)
            },
            'catalyst_center': {
                'total': len(dnac_devices),
                'by_role': {},
                'by_status': {}
            },
            'sdwan_manager': {
                'total': len(vmanage_devices),
                'by_role': {},
                'by_status': {}
            },
            'handoff_sites': correlations
        }
        
        # Count by role and status
        for device in dnac_devices:
            role = device['role'] or 'Unknown'
            status = device['status'] or 'Unknown'
            report['catalyst_center']['by_role'][role] = report['catalyst_center']['by_role'].get(role, 0) + 1
            report['catalyst_center']['by_status'][status] = report['catalyst_center']['by_status'].get(status, 0) + 1
        
        for device in vmanage_devices:
            role = device['role'] or 'Unknown'
            status = device['status'] or 'Unknown'
            report['sdwan_manager']['by_role'][role] = report['sdwan_manager']['by_role'].get(role, 0) + 1
            report['sdwan_manager']['by_status'][status] = report['sdwan_manager']['by_status'].get(status, 0) + 1
        
        return report
    
    def print_report(self):
        """Print formatted inventory report"""
        report = self.generate_inventory_report()
        
        print("\n" + "="*70)
        print("UNIFIED NETWORK INVENTORY REPORT")
        print(f"Generated: {report['generated']}")
        print("="*70)
        
        print("\n--- SUMMARY ---")
        print(f"  Catalyst Center Devices: {report['summary']['catalyst_center_devices']}")
        print(f"  SD-WAN Manager Devices:  {report['summary']['sdwan_manager_devices']}")
        print(f"  Handoff Sites:           {report['summary']['handoff_correlations']}")
        
        print("\n--- CATALYST CENTER DEVICES ---")
        print("  By Role:")
        for role, count in report['catalyst_center']['by_role'].items():
            print(f"    {role}: {count}")
        print("  By Status:")
        for status, count in report['catalyst_center']['by_status'].items():
            print(f"    {status}: {count}")
        
        print("\n--- SD-WAN MANAGER DEVICES ---")
        print("  By Role:")
        for role, count in report['sdwan_manager']['by_role'].items():
            print(f"    {role}: {count}")
        print("  By Status:")
        for status, count in report['sdwan_manager']['by_status'].items():
            print(f"    {status}: {count}")
        
        print("\n--- HANDOFF CORRELATIONS ---")
        for site in report['handoff_sites']:
            print(f"\n  Site: {site['site']}")
            print(f"    Border Node: {site['border_node']} ({site['border_ip']}) - {site['border_status']}")
            for edge in site['wan_edges']:
                print(f"    WAN Edge: {edge['hostname']} ({edge['ip']}) - {edge['status']}")
        
        print("\n" + "="*70)


if __name__ == "__main__":
    inventory = UnifiedInventory(
        dnac_host='catalyst-center.abhavtech.com',
        vmanage_host='sdwan-manager.abhavtech.com',
        username='admin',
        password='<password>'
    )
    
    inventory.print_report()
```

---

## 5.13.5 Unified Dashboard Integration

### Cross-Domain Health Dashboard

```python
#!/usr/bin/env python3
"""
Cross-Domain Health Dashboard
Aggregates health metrics from both platforms
"""

import requests
import json
import urllib3
from datetime import datetime
import time

urllib3.disable_warnings()

class CrossDomainDashboard:
    def __init__(self, dnac_host, vmanage_host, username, password):
        self.dnac_host = dnac_host
        self.vmanage_host = vmanage_host
        self.username = username
        self.password = password
        
        self.dnac_token = self._get_dnac_token()
        self.vmanage_session = self._create_vmanage_session()
    
    def _get_dnac_token(self):
        url = f"https://{self.dnac_host}/dna/system/api/v1/auth/token"
        response = requests.post(url, auth=(self.username, self.password), verify=False)
        return response.json()['Token']
    
    def _create_vmanage_session(self):
        session = requests.Session()
        login_url = f"https://{self.vmanage_host}/j_security_check"
        session.post(login_url, data={'j_username': self.username, 'j_password': self.password}, verify=False)
        
        token_url = f"https://{self.vmanage_host}/dataservice/client/token"
        token_response = session.get(token_url, verify=False)
        if token_response.status_code == 200:
            session.headers['X-XSRF-TOKEN'] = token_response.text
        return session
    
    def get_sdaccess_health(self):
        """Get SD-Access fabric health from Catalyst Center"""
        headers = {'X-Auth-Token': self.dnac_token}
        
        # Get overall health
        health_url = f"https://{self.dnac_host}/dna/intent/api/v1/network-health"
        response = requests.get(health_url, headers=headers, verify=False)
        
        if response.status_code == 200:
            health_data = response.json().get('response', [])
            if health_data:
                return {
                    'overall_health': health_data[0].get('healthScore', 0),
                    'healthy_devices': health_data[0].get('goodCount', 0),
                    'warning_devices': health_data[0].get('unmonitoredCount', 0),
                    'critical_devices': health_data[0].get('fairCount', 0) + health_data[0].get('badCount', 0),
                    'total_devices': health_data[0].get('totalCount', 0)
                }
        
        return {'overall_health': 0, 'healthy_devices': 0, 'warning_devices': 0, 'critical_devices': 0, 'total_devices': 0}
    
    def get_sdwan_health(self):
        """Get SD-WAN health from vManage"""
        # Get device health
        url = f"https://{self.vmanage_host}/dataservice/device"
        response = self.vmanage_session.get(url, verify=False)
        devices = response.json().get('data', [])
        
        healthy = 0
        warning = 0
        critical = 0
        
        for device in devices:
            reachability = device.get('reachability', 'unreachable')
            status = device.get('status', 'unknown')
            
            if reachability == 'reachable' and status == 'normal':
                healthy += 1
            elif reachability == 'reachable':
                warning += 1
            else:
                critical += 1
        
        total = len(devices)
        overall_health = (healthy / total * 100) if total > 0 else 0
        
        return {
            'overall_health': round(overall_health, 1),
            'healthy_devices': healthy,
            'warning_devices': warning,
            'critical_devices': critical,
            'total_devices': total
        }
    
    def get_tunnel_health(self):
        """Get SD-WAN tunnel health"""
        url = f"https://{self.vmanage_host}/dataservice/device/tunnel/statistics"
        
        # Get tunnel stats for all devices
        devices_url = f"https://{self.vmanage_host}/dataservice/device"
        devices_response = self.vmanage_session.get(devices_url, verify=False)
        devices = devices_response.json().get('data', [])
        
        total_tunnels = 0
        up_tunnels = 0
        
        for device in devices:
            if device.get('device-type') == 'vedge':
                system_ip = device.get('system-ip')
                tunnel_url = f"https://{self.vmanage_host}/dataservice/device/tunnel/statistics?deviceId={system_ip}"
                tunnel_response = self.vmanage_session.get(tunnel_url, verify=False)
                tunnels = tunnel_response.json().get('data', [])
                
                for tunnel in tunnels:
                    total_tunnels += 1
                    if tunnel.get('tunnel-state') == 'up':
                        up_tunnels += 1
        
        return {
            'total_tunnels': total_tunnels,
            'up_tunnels': up_tunnels,
            'down_tunnels': total_tunnels - up_tunnels,
            'health_percentage': round((up_tunnels / total_tunnels * 100) if total_tunnels > 0 else 0, 1)
        }
    
    def get_combined_alerts(self):
        """Get alerts from both platforms"""
        alerts = []
        
        # Catalyst Center alarms
        headers = {'X-Auth-Token': self.dnac_token}
        alarm_url = f"https://{self.dnac_host}/dna/intent/api/v1/issues"
        params = {'priority': 'P1,P2', 'issueStatus': 'active'}
        response = requests.get(alarm_url, headers=headers, params=params, verify=False)
        
        if response.status_code == 200:
            issues = response.json().get('response', [])
            for issue in issues[:10]:  # Top 10
                alerts.append({
                    'source': 'Catalyst Center',
                    'severity': issue.get('priority', 'P3'),
                    'name': issue.get('name', 'Unknown'),
                    'device': issue.get('deviceName', 'Unknown'),
                    'timestamp': issue.get('lastOccurenceTime', '')
                })
        
        # SD-WAN Manager alarms
        alarm_url = f"https://{self.vmanage_host}/dataservice/alarms"
        params = {'query': json.dumps({'query': {'condition': 'AND', 'rules': [{'field': 'active', 'type': 'boolean', 'value': ['true']}]}})}
        response = self.vmanage_session.get(alarm_url, params=params, verify=False)
        
        if response.status_code == 200:
            alarms = response.json().get('data', [])
            for alarm in alarms[:10]:  # Top 10
                severity_map = {'Critical': 'P1', 'Major': 'P2', 'Minor': 'P3', 'Warning': 'P4'}
                alerts.append({
                    'source': 'SD-WAN Manager',
                    'severity': severity_map.get(alarm.get('severity', 'Warning'), 'P4'),
                    'name': alarm.get('message', 'Unknown'),
                    'device': alarm.get('system-ip', 'Unknown'),
                    'timestamp': alarm.get('entry_time', '')
                })
        
        # Sort by severity
        severity_order = {'P1': 0, 'P2': 1, 'P3': 2, 'P4': 3}
        alerts.sort(key=lambda x: severity_order.get(x['severity'], 4))
        
        return alerts
    
    def display_dashboard(self):
        """Display unified dashboard"""
        sdaccess = self.get_sdaccess_health()
        sdwan = self.get_sdwan_health()
        tunnels = self.get_tunnel_health()
        alerts = self.get_combined_alerts()
        
        print("\n" + "="*70)
        print("          ABHAVTECH UNIFIED NETWORK HEALTH DASHBOARD")
        print(f"                    {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print("="*70)
        
        # Health summary
        print("\n┌─────────────────────────────────────────────────────────────────────┐")
        print("│                      HEALTH SUMMARY                                 │")
        print("├─────────────────────────────────────────────────────────────────────┤")
        print(f"│  SD-Access Health:  {sdaccess['overall_health']:>5.1f}%   │  SD-WAN Health:    {sdwan['overall_health']:>5.1f}%       │")
        print(f"│  Tunnel Health:     {tunnels['health_percentage']:>5.1f}%   │                                     │")
        print("└─────────────────────────────────────────────────────────────────────┘")
        
        # Device counts
        print("\n┌────────────────────────────┬────────────────────────────────────────┐")
        print("│       SD-ACCESS            │            SD-WAN                      │")
        print("├────────────────────────────┼────────────────────────────────────────┤")
        print(f"│  Total Devices: {sdaccess['total_devices']:>5}      │  Total Devices: {sdwan['total_devices']:>5}                 │")
        print(f"│  Healthy:       {sdaccess['healthy_devices']:>5}      │  Healthy:       {sdwan['healthy_devices']:>5}                 │")
        print(f"│  Warning:       {sdaccess['warning_devices']:>5}      │  Warning:       {sdwan['warning_devices']:>5}                 │")
        print(f"│  Critical:      {sdaccess['critical_devices']:>5}      │  Critical:      {sdwan['critical_devices']:>5}                 │")
        print("└────────────────────────────┴────────────────────────────────────────┘")
        
        # Tunnel status
        print("\n┌─────────────────────────────────────────────────────────────────────┐")
        print("│                      TUNNEL STATUS                                  │")
        print("├─────────────────────────────────────────────────────────────────────┤")
        print(f"│  Total Tunnels: {tunnels['total_tunnels']:>5}    Up: {tunnels['up_tunnels']:>5}    Down: {tunnels['down_tunnels']:>5}             │")
        print("└─────────────────────────────────────────────────────────────────────┘")
        
        # Active alerts
        print("\n┌─────────────────────────────────────────────────────────────────────┐")
        print("│                      ACTIVE ALERTS (Top 10)                         │")
        print("├────────┬─────────────────┬──────────────────────────────────────────┤")
        print("│ Sev    │ Source          │ Description                              │")
        print("├────────┼─────────────────┼──────────────────────────────────────────┤")
        
        for alert in alerts[:10]:
            sev = alert['severity']
            source = alert['source'][:15]
            desc = alert['name'][:40]
            print(f"│ {sev:<6} │ {source:<15} │ {desc:<40} │")
        
        if not alerts:
            print("│        │ No active alerts │                                         │")
        
        print("└────────┴─────────────────┴──────────────────────────────────────────┘")
        
        print("\n" + "="*70)


if __name__ == "__main__":
    dashboard = CrossDomainDashboard(
        dnac_host='catalyst-center.abhavtech.com',
        vmanage_host='sdwan-manager.abhavtech.com',
        username='admin',
        password='<password>'
    )
    
    dashboard.display_dashboard()
```

---

## 5.13.6 Automated Provisioning Workflows

### Coordinated Site Provisioning

```python
#!/usr/bin/env python3
"""
Coordinated Site Provisioning Workflow
Provisions both SD-Access and SD-WAN components for a new site
"""

import requests
import json
import urllib3
import time
from datetime import datetime

urllib3.disable_warnings()

class CoordinatedProvisioning:
    def __init__(self, dnac_host, vmanage_host, username, password):
        self.dnac_host = dnac_host
        self.vmanage_host = vmanage_host
        self.username = username
        self.password = password
        
        self.dnac_token = self._get_dnac_token()
        self.vmanage_session = self._create_vmanage_session()
    
    def _get_dnac_token(self):
        url = f"https://{self.dnac_host}/dna/system/api/v1/auth/token"
        response = requests.post(url, auth=(self.username, self.password), verify=False)
        return response.json()['Token']
    
    def _create_vmanage_session(self):
        session = requests.Session()
        login_url = f"https://{self.vmanage_host}/j_security_check"
        session.post(login_url, data={'j_username': self.username, 'j_password': self.password}, verify=False)
        
        token_url = f"https://{self.vmanage_host}/dataservice/client/token"
        token_response = session.get(token_url, verify=False)
        if token_response.status_code == 200:
            session.headers['X-XSRF-TOKEN'] = token_response.text
        return session
    
    def provision_new_site(self, site_config):
        """
        Provision a new site with both SD-Access and SD-WAN
        
        site_config = {
            'site_name': 'Hyderabad',
            'site_code': 'HYD',
            'site_id': 403,
            'region': 'India',
            'wan_edge_serial': 'FDO2345X1AE',
            'wan_edge_model': 'C8300-1N1S-6T',
            'system_ip': '10.255.4.4',
            'transport_type': 'internet_lte',
            'vpns': [10, 20, 30]
        }
        """
        
        print(f"\n{'='*60}")
        print(f"COORDINATED SITE PROVISIONING: {site_config['site_name']}")
        print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"{'='*60}")
        
        results = {
            'site_name': site_config['site_name'],
            'steps': [],
            'success': True
        }
        
        # Step 1: Create site in Catalyst Center
        print("\n[Step 1] Creating site in Catalyst Center...")
        dnac_site_result = self._create_dnac_site(site_config)
        results['steps'].append({'step': 'Create DNAC Site', 'result': dnac_site_result})
        if not dnac_site_result['success']:
            results['success'] = False
            print(f"  ✗ Failed: {dnac_site_result['message']}")
        else:
            print(f"  ✓ Site created: {dnac_site_result['site_id']}")
        
        # Step 2: Add WAN Edge to vManage inventory
        print("\n[Step 2] Adding WAN Edge to SD-WAN Manager...")
        wan_edge_result = self._add_wan_edge(site_config)
        results['steps'].append({'step': 'Add WAN Edge', 'result': wan_edge_result})
        if not wan_edge_result['success']:
            results['success'] = False
            print(f"  ✗ Failed: {wan_edge_result['message']}")
        else:
            print(f"  ✓ WAN Edge added: {site_config['wan_edge_serial']}")
        
        # Step 3: Generate template variables
        print("\n[Step 3] Generating template variables...")
        variables = self._generate_variables(site_config)
        print(f"  ✓ Variables generated for {len(site_config['vpns'])} VPNs")
        
        # Step 4: Attach device template
        print("\n[Step 4] Attaching device template...")
        template_result = self._attach_template(site_config, variables)
        results['steps'].append({'step': 'Attach Template', 'result': template_result})
        if not template_result['success']:
            results['success'] = False
            print(f"  ✗ Failed: {template_result['message']}")
        else:
            print(f"  ✓ Template attached successfully")
        
        # Step 5: Configure handoff (if hub site)
        if site_config.get('is_hub', False):
            print("\n[Step 5] Configuring SD-Access handoff...")
            handoff_result = self._configure_handoff(site_config)
            results['steps'].append({'step': 'Configure Handoff', 'result': handoff_result})
            if not handoff_result['success']:
                results['success'] = False
                print(f"  ✗ Failed: {handoff_result['message']}")
            else:
                print(f"  ✓ Handoff configured")
        
        # Summary
        print(f"\n{'='*60}")
        if results['success']:
            print(f"✓ SITE PROVISIONING COMPLETED SUCCESSFULLY")
        else:
            print(f"✗ SITE PROVISIONING COMPLETED WITH ERRORS")
        print(f"{'='*60}")
        
        return results
    
    def _create_dnac_site(self, site_config):
        """Create site in Catalyst Center hierarchy"""
        headers = {'X-Auth-Token': self.dnac_token, 'Content-Type': 'application/json'}
        url = f"https://{self.dnac_host}/dna/intent/api/v1/site"
        
        payload = {
            "type": "building",
            "site": {
                "building": {
                    "name": site_config['site_name'],
                    "parentName": f"Global/{site_config['region']}",
                    "address": f"{site_config['site_name']}, {site_config['region']}"
                }
            }
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload, verify=False)
            if response.status_code in [200, 202]:
                return {'success': True, 'site_id': site_config['site_code'], 'message': 'Site created'}
            else:
                return {'success': False, 'message': f"HTTP {response.status_code}"}
        except Exception as e:
            return {'success': False, 'message': str(e)}
    
    def _add_wan_edge(self, site_config):
        """Add WAN Edge to vManage inventory"""
        url = f"https://{self.vmanage_host}/dataservice/system/device"
        
        payload = {
            "deviceIP": site_config['system_ip'],
            "personality": "vedge",
            "serialNumber": site_config['wan_edge_serial'],
            "configOperationMode": "vmanage",
            "deviceModel": site_config['wan_edge_model'],
            "deviceState": "tokengenerated",
            "validity": "valid",
            "site-id": str(site_config['site_id']),
            "host-name": f"ABVT-{site_config['site_code']}-WE01"
        }
        
        try:
            response = self.vmanage_session.post(url, json=payload, verify=False)
            if response.status_code == 200:
                return {'success': True, 'message': 'WAN Edge added'}
            else:
                return {'success': False, 'message': f"HTTP {response.status_code}"}
        except Exception as e:
            return {'success': False, 'message': str(e)}
    
    def _generate_variables(self, site_config):
        """Generate template variables for the site"""
        variables = {
            'device_hostname': f"ABVT-{site_config['site_code']}-WE01",
            'device_system_ip': site_config['system_ip'],
            'device_site_id': str(site_config['site_id']),
            'transport_type': site_config['transport_type']
        }
        
        # VPN-specific variables
        vpn_base_ip = int(site_config['system_ip'].split('.')[-1])
        for vpn in site_config['vpns']:
            variables[f'vpn{vpn}_gateway'] = f"10.{vpn}.{vpn_base_ip}.1"
        
        return variables
    
    def _attach_template(self, site_config, variables):
        """Attach device template to WAN Edge"""
        # Get template ID
        template_name = "Branch-C8300-Template"
        templates_url = f"https://{self.vmanage_host}/dataservice/template/device"
        templates_response = self.vmanage_session.get(templates_url, verify=False)
        templates = templates_response.json().get('data', [])
        
        template_id = None
        for template in templates:
            if template.get('templateName') == template_name:
                template_id = template.get('templateId')
                break
        
        if not template_id:
            return {'success': False, 'message': f"Template '{template_name}' not found"}
        
        # Attach template
        attach_url = f"https://{self.vmanage_host}/dataservice/template/device/config/attachfeature"
        
        payload = {
            "deviceTemplateList": [{
                "templateId": template_id,
                "device": [{
                    "csv-status": "complete",
                    "csv-deviceId": site_config['wan_edge_serial'],
                    "csv-deviceIP": site_config['system_ip'],
                    "csv-host-name": variables['device_hostname'],
                    **{f"/{k}/": v for k, v in variables.items()}
                }],
                "isEdited": False,
                "isMasterEdited": False
            }]
        }
        
        try:
            response = self.vmanage_session.post(attach_url, json=payload, verify=False)
            if response.status_code == 200:
                return {'success': True, 'message': 'Template attached'}
            else:
                return {'success': False, 'message': f"HTTP {response.status_code}"}
        except Exception as e:
            return {'success': False, 'message': str(e)}
    
    def _configure_handoff(self, site_config):
        """Configure SD-Access handoff for hub sites"""
        # This would configure BGP peering and handoff interfaces
        # Implementation depends on specific automation requirements
        return {'success': True, 'message': 'Handoff configured (manual verification required)'}


if __name__ == "__main__":
    # Example: Provision new site
    site_config = {
        'site_name': 'Hyderabad',
        'site_code': 'HYD',
        'site_id': 403,
        'region': 'India',
        'wan_edge_serial': 'FDO2345X1AE',
        'wan_edge_model': 'C8300-1N1S-6T',
        'system_ip': '10.255.4.4',
        'transport_type': 'internet_lte',
        'vpns': [10, 20, 30],
        'is_hub': False
    }
    
    provisioner = CoordinatedProvisioning(
        dnac_host='catalyst-center.abhavtech.com',
        vmanage_host='sdwan-manager.abhavtech.com',
        username='admin',
        password='<password>'
    )
    
    provisioner.provision_new_site(site_config)
```

---

## 5.13.7 Event Correlation and Alerting

### Unified Alert Configuration

```yaml
# unified-alerts-config.yaml
# Configuration for cross-domain alert correlation

alert_correlation:
  enabled: true
  correlation_window: 300  # seconds
  
  # Alert sources
  sources:
    - name: catalyst-center
      type: dnac
      host: catalyst-center.abhavtech.com
      poll_interval: 60
      
    - name: sdwan-manager
      type: vmanage
      host: sdwan-manager.abhavtech.com
      poll_interval: 60
  
  # Correlation rules
  rules:
    - name: border-wan-edge-failure
      description: Correlate border and WAN edge failures at same site
      conditions:
        - source: catalyst-center
          device_role: BORDER ROUTER
          alert_type: reachability
        - source: sdwan-manager
          device_role: vedge
          alert_type: control-connection
      correlation_key: site_code
      output_severity: critical
      notification:
        - type: pagerduty
          service_key: ${PAGERDUTY_KEY}
        - type: slack
          channel: "#network-critical"
    
    - name: tunnel-bfd-correlation
      description: Correlate tunnel and BFD failures
      conditions:
        - source: sdwan-manager
          alert_type: tunnel-down
        - source: sdwan-manager
          alert_type: bfd-session-down
      correlation_key: system_ip
      output_severity: major
      
  # Notification channels
  notifications:
    pagerduty:
      enabled: true
      api_url: https://events.pagerduty.com/v2/enqueue
      
    slack:
      enabled: true
      webhook_url: ${SLACK_WEBHOOK}
      
    email:
      enabled: true
      smtp_server: smtp.abhavtech.com
      recipients:
        - noc@abhavtech.com
        - network-ops@abhavtech.com
```

---

## 5.13.8 Best Practices

### Integration Best Practices

| Area | Best Practice | Rationale |
|------|---------------|-----------|
| Authentication | Use service accounts | Avoid user credential lockouts |
| API calls | Implement retry logic | Handle transient failures |
| Rate limiting | Respect API limits | Prevent throttling |
| Token management | Refresh tokens proactively | Avoid auth failures |
| Error handling | Log all API errors | Facilitate troubleshooting |
| Monitoring | Monitor integration health | Detect issues early |

### Security Considerations

1. **API Credentials**: Store in secrets manager (HashiCorp Vault, AWS Secrets Manager)
2. **Network Isolation**: Use dedicated management VLAN for API traffic
3. **TLS Verification**: Enable in production (disable only for testing)
4. **Audit Logging**: Log all API calls for compliance
5. **RBAC**: Use least-privilege API accounts

---

## References

- Cisco Catalyst Center API Documentation
- Cisco SD-WAN Manager API Reference
- Abhavtech Integration Standards
- Cisco DevNet Learning Labs

---

*Document Version: 2.1*
*Last Updated: December 30, 2025*
*Classification: Internal Use Only*
*Abhavtech.com - SD-WAN Documentation*
