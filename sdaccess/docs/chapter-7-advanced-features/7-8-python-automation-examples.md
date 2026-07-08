# 7.8 Python Automation Examples

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. Overview

### 1.1 Automation Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Abhavtech Automation Framework                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐             │
│  │ Automation  │    │  Catalyst   │    │    ISE      │             │
│  │   Server    │───►│   Center    │───►│   PAN/PSN   │             │
│  │ (Python)    │    │   REST API  │    │   ERS API   │             │
│  └──────┬──────┘    └─────────────┘    └─────────────┘             │
│         │                                                           │
│         │           ┌─────────────┐    ┌─────────────┐             │
│         └──────────►│   pxGrid    │───►│   Webhooks  │             │
│                     │   (Pub/Sub) │    │  (Events)   │             │
│                     └─────────────┘    └─────────────┘             │
│                                                                     │
│  Automation Server: automation.abhavtech.com (10.250.10.100)       │
│  Python Version: 3.11+                                              │
│  Key Libraries: dnacentersdk, requests, pxgrid-util                │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Required Python Packages

```bash
# /opt/abhavtech/automation/requirements.txt

dnacentersdk>=2.6.0          # Cisco DNA Center SDK
requests>=2.31.0             # HTTP library
urllib3>=2.0.0               # HTTP client
python-dotenv>=1.0.0         # Environment variables
pyyaml>=6.0                  # YAML parsing
jinja2>=3.1.0                # Template engine
pandas>=2.0.0                # Data analysis
schedule>=1.2.0              # Job scheduling
websocket-client>=1.6.0      # WebSocket for pxGrid
cryptography>=41.0.0         # Certificate handling

# Install command
pip install -r requirements.txt
```

---

## 2. Catalyst Center SDK Examples

### 2.1 Authentication and Connection

```python
#!/usr/bin/env python3
"""
Catalyst Center SDK - Connection Setup
/opt/abhavtech/automation/dnac_connection.py
"""

from dnacentersdk import DNACenterAPI
from dotenv import load_dotenv
import os
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv('/opt/abhavtech/automation/.env')

def get_dnac_connection():
    """
    Establish connection to Catalyst Center
    Returns: DNACenterAPI object
    """
    try:
        dnac = DNACenterAPI(
            base_url=os.getenv('DNAC_URL', 'https://catalyst.abhavtech.com'),
            username=os.getenv('DNAC_USER', 'api-admin'),
            password=os.getenv('DNAC_PASS'),
            version='2.3.7.6',
            verify=True,  # Verify SSL certificate
            debug=False
        )
        logger.info("Successfully connected to Catalyst Center")
        return dnac
    except Exception as e:
        logger.error(f"Failed to connect to Catalyst Center: {e}")
        raise

# Example usage
if __name__ == "__main__":
    dnac = get_dnac_connection()
    # Test connection
    sites = dnac.sites.get_site()
    print(f"Connected! Found {len(sites.response)} sites")
```

### 2.2 Fabric Site Management

```python
#!/usr/bin/env python3
"""
Fabric Site Operations
/opt/abhavtech/automation/fabric_operations.py
"""

from dnac_connection import get_dnac_connection
import json

class FabricOperations:
    def __init__(self):
        self.dnac = get_dnac_connection()
    
    def get_all_fabric_sites(self):
        """Get all fabric sites"""
        sites = self.dnac.sda.get_sda_fabric_info()
        return sites.response if sites else []
    
    def get_fabric_site_health(self, site_name):
        """Get health score for a fabric site"""
        # Get site ID first
        site = self.dnac.sites.get_site(name=site_name)
        if not site.response:
            return None
        
        site_id = site.response[0]['id']
        
        # Get health
        health = self.dnac.site_health.get_site_health(
            site_id=site_id
        )
        return health
    
    def add_edge_node_to_fabric(self, device_ip, site_name):
        """Add edge node to fabric site"""
        payload = {
            "deviceManagementIpAddress": device_ip,
            "siteNameHierarchy": site_name,
            "deviceRole": "EDGE_NODE"
        }
        
        result = self.dnac.sda.add_fabric_devices(payload=[payload])
        return result
    
    def get_fabric_devices(self, site_name):
        """Get all devices in a fabric site"""
        devices = self.dnac.sda.get_sda_fabric_devices(
            site_name_hierarchy=site_name
        )
        return devices.response if devices else []
    
    def get_virtual_networks(self, site_name):
        """Get VNs configured in fabric site"""
        vns = self.dnac.sda.get_virtual_network_with_scalable_groups(
            site_name_hierarchy=site_name
        )
        return vns

# Example usage
if __name__ == "__main__":
    fabric = FabricOperations()
    
    # Get all fabric sites
    sites = fabric.get_all_fabric_sites()
    print("Fabric Sites:")
    for site in sites:
        print(f"  - {site.get('fabricName', 'Unknown')}")
    
    # Get Mumbai fabric health
    health = fabric.get_fabric_site_health("Global/India/Mumbai")
    if health:
        print(f"\nMumbai Site Health: {health}")
```

### 2.3 Device Inventory and Compliance

```python
#!/usr/bin/env python3
"""
Device Inventory and Compliance Automation
/opt/abhavtech/automation/device_compliance.py
"""

from dnac_connection import get_dnac_connection
import pandas as pd
from datetime import datetime

class DeviceCompliance:
    def __init__(self):
        self.dnac = get_dnac_connection()
    
    def get_all_network_devices(self):
        """Get complete device inventory"""
        devices = self.dnac.devices.get_device_list()
        return devices.response if devices else []
    
    def get_devices_by_family(self, family):
        """Get devices filtered by family (Switches, Routers, etc.)"""
        devices = self.dnac.devices.get_device_list(family=family)
        return devices.response if devices else []
    
    def check_software_compliance(self):
        """Check software compliance for all devices"""
        compliance = self.dnac.compliance.get_compliance_status()
        return compliance.response if compliance else []
    
    def get_devices_needing_upgrade(self, target_version):
        """Find devices not running target IOS-XE version"""
        devices = self.get_all_network_devices()
        non_compliant = []
        
        for device in devices:
            current_version = device.get('softwareVersion', '')
            if current_version != target_version:
                non_compliant.append({
                    'hostname': device.get('hostname'),
                    'ip': device.get('managementIpAddress'),
                    'current_version': current_version,
                    'target_version': target_version,
                    'family': device.get('family'),
                    'platform': device.get('platformId')
                })
        
        return non_compliant
    
    def generate_inventory_report(self, output_file=None):
        """Generate CSV inventory report"""
        devices = self.get_all_network_devices()
        
        # Create DataFrame
        df = pd.DataFrame([{
            'Hostname': d.get('hostname'),
            'IP Address': d.get('managementIpAddress'),
            'Platform': d.get('platformId'),
            'Software Version': d.get('softwareVersion'),
            'Serial Number': d.get('serialNumber'),
            'Uptime': d.get('upTime'),
            'Last Updated': d.get('lastUpdated'),
            'Reachability': d.get('reachabilityStatus'),
            'Family': d.get('family'),
            'Role': d.get('role'),
            'Site': d.get('siteId')
        } for d in devices])
        
        if output_file:
            df.to_csv(output_file, index=False)
            print(f"Report saved to {output_file}")
        
        return df
    
    def trigger_compliance_check(self, device_ids=None):
        """Trigger compliance check for devices"""
        if device_ids:
            result = self.dnac.compliance.run_compliance(
                deviceUuids=device_ids
            )
        else:
            # Run for all devices
            result = self.dnac.compliance.run_compliance()
        
        return result

# Example usage
if __name__ == "__main__":
    compliance = DeviceCompliance()
    
    # Generate inventory report
    report = compliance.generate_inventory_report(
        output_file=f"/tmp/inventory_{datetime.now().strftime('%Y%m%d')}.csv"
    )
    print(f"Total devices: {len(report)}")
    
    # Check for devices needing upgrade
    target = "17.12.3"
    non_compliant = compliance.get_devices_needing_upgrade(target)
    print(f"\nDevices not running {target}: {len(non_compliant)}")
    for d in non_compliant[:5]:  # Show first 5
        print(f"  - {d['hostname']}: {d['current_version']}")
```

### 2.4 Automated Provisioning

```python
#!/usr/bin/env python3
"""
Automated Device Provisioning
/opt/abhavtech/automation/auto_provision.py
"""

from dnac_connection import get_dnac_connection
import time

class AutoProvisioning:
    def __init__(self):
        self.dnac = get_dnac_connection()
    
    def claim_pnp_device(self, serial_number, site_name, template_name=None):
        """
        Claim a PnP device and assign to site
        
        Args:
            serial_number: Device serial number
            site_name: Target site hierarchy (e.g., "Global/India/Mumbai")
            template_name: Optional day-0 template
        """
        # Get device from PnP inventory
        pnp_devices = self.dnac.device_onboarding_pnp.get_device_list(
            serialNumber=serial_number
        )
        
        if not pnp_devices:
            raise ValueError(f"Device {serial_number} not found in PnP")
        
        device_id = pnp_devices[0]['id']
        
        # Get site ID
        site = self.dnac.sites.get_site(name=site_name)
        site_id = site.response[0]['id']
        
        # Claim device
        claim_payload = {
            "deviceClaimList": [{
                "deviceId": device_id,
                "configList": []
            }],
            "siteId": site_id
        }
        
        if template_name:
            # Add template configuration
            template = self.dnac.configuration_templates.get_templates(
                name=template_name
            )
            if template:
                claim_payload["deviceClaimList"][0]["configList"].append({
                    "configId": template[0]['id'],
                    "configParameters": []
                })
        
        result = self.dnac.device_onboarding_pnp.claim_device(**claim_payload)
        return result
    
    def provision_device_to_fabric(self, device_ip, site_name, role="EDGE_NODE"):
        """
        Provision device as fabric node
        
        Args:
            device_ip: Device management IP
            site_name: Fabric site hierarchy
            role: EDGE_NODE, BORDER_NODE, or CONTROL_PLANE_NODE
        """
        # Add to fabric
        payload = {
            "deviceManagementIpAddress": device_ip,
            "siteNameHierarchy": site_name,
            "deviceRole": role
        }
        
        result = self.dnac.sda.add_fabric_devices(payload=[payload])
        
        # Wait for task completion
        task_id = result.response.get('taskId')
        if task_id:
            self._wait_for_task(task_id)
        
        return result
    
    def assign_ip_pool_to_vn(self, site_name, vn_name, ip_pool_name):
        """Assign IP pool to Virtual Network at site"""
        payload = {
            "siteNameHierarchy": site_name,
            "virtualNetworkName": vn_name,
            "ipPoolName": ip_pool_name,
            "trafficType": "DATA",
            "isLayer2FloodingEnabled": False,
            "isThisCriticalPool": False
        }
        
        result = self.dnac.sda.add_ip_pool_in_sda_virtual_network(**payload)
        return result
    
    def _wait_for_task(self, task_id, timeout=300):
        """Wait for task completion"""
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            task = self.dnac.task.get_task_by_id(task_id)
            
            if task.response.get('isError'):
                raise Exception(f"Task failed: {task.response.get('failureReason')}")
            
            if task.response.get('endTime'):
                return task.response
            
            time.sleep(5)
        
        raise TimeoutError(f"Task {task_id} did not complete within {timeout}s")

# Example usage
if __name__ == "__main__":
    provisioner = AutoProvisioning()
    
    # Claim new switch
    try:
        result = provisioner.claim_pnp_device(
            serial_number="FCW2345L0AB",
            site_name="Global/India/Mumbai/Building-A",
            template_name="EDGE-DAY0-TEMPLATE"
        )
        print(f"Device claimed successfully: {result}")
    except Exception as e:
        print(f"Claim failed: {e}")
```

---

## 3. ISE ERS API Examples

### 3.1 ISE Connection and Authentication

```python
#!/usr/bin/env python3
"""
ISE ERS API Connection
/opt/abhavtech/automation/ise_connection.py
"""

import requests
import json
from dotenv import load_dotenv
import os
import urllib3

# Disable SSL warnings (for lab only - use proper certs in production)
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

load_dotenv('/opt/abhavtech/automation/.env')

class ISEConnection:
    def __init__(self):
        self.base_url = os.getenv('ISE_URL', 'https://ise-pan.abhavtech.com:9060')
        self.username = os.getenv('ISE_USER', 'api-admin')
        self.password = os.getenv('ISE_PASS')
        self.headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        self.session = requests.Session()
        self.session.auth = (self.username, self.password)
        self.session.headers.update(self.headers)
        self.session.verify = True  # Set to cert path in production
    
    def get(self, endpoint):
        """GET request to ISE ERS API"""
        url = f"{self.base_url}/ers/config/{endpoint}"
        response = self.session.get(url)
        response.raise_for_status()
        return response.json()
    
    def post(self, endpoint, data):
        """POST request to ISE ERS API"""
        url = f"{self.base_url}/ers/config/{endpoint}"
        response = self.session.post(url, json=data)
        response.raise_for_status()
        return response.json() if response.text else None
    
    def put(self, endpoint, data):
        """PUT request to ISE ERS API"""
        url = f"{self.base_url}/ers/config/{endpoint}"
        response = self.session.put(url, json=data)
        response.raise_for_status()
        return response.json() if response.text else None
    
    def delete(self, endpoint):
        """DELETE request to ISE ERS API"""
        url = f"{self.base_url}/ers/config/{endpoint}"
        response = self.session.delete(url)
        response.raise_for_status()
        return True
```

### 3.2 Endpoint Management

```python
#!/usr/bin/env python3
"""
ISE Endpoint Management
/opt/abhavtech/automation/ise_endpoints.py
"""

from ise_connection import ISEConnection
import json

class EndpointManager:
    def __init__(self):
        self.ise = ISEConnection()
    
    def get_all_endpoints(self, page=1, size=100):
        """Get paginated list of endpoints"""
        endpoint = f"endpoint?page={page}&size={size}"
        return self.ise.get(endpoint)
    
    def get_endpoint_by_mac(self, mac_address):
        """Get endpoint by MAC address"""
        # Format MAC address (ISE uses XX:XX:XX:XX:XX:XX)
        mac = mac_address.upper().replace('-', ':')
        endpoint = f"endpoint?filter=mac.EQ.{mac}"
        return self.ise.get(endpoint)
    
    def get_endpoint_by_id(self, endpoint_id):
        """Get endpoint by ID"""
        return self.ise.get(f"endpoint/{endpoint_id}")
    
    def create_endpoint(self, mac_address, group_id, description=None):
        """Create new endpoint"""
        payload = {
            "ERSEndPoint": {
                "mac": mac_address.upper().replace('-', ':'),
                "groupId": group_id,
                "staticGroupAssignment": True
            }
        }
        if description:
            payload["ERSEndPoint"]["description"] = description
        
        return self.ise.post("endpoint", payload)
    
    def update_endpoint_group(self, endpoint_id, new_group_id):
        """Update endpoint group assignment"""
        # Get current endpoint
        current = self.get_endpoint_by_id(endpoint_id)
        
        # Update group
        current["ERSEndPoint"]["groupId"] = new_group_id
        
        return self.ise.put(f"endpoint/{endpoint_id}", current)
    
    def delete_endpoint(self, endpoint_id):
        """Delete endpoint"""
        return self.ise.delete(f"endpoint/{endpoint_id}")
    
    def bulk_import_endpoints(self, endpoints_list):
        """
        Bulk import endpoints from list
        
        Args:
            endpoints_list: List of dicts with 'mac', 'group', 'description'
        """
        results = {'success': [], 'failed': []}
        
        for ep in endpoints_list:
            try:
                result = self.create_endpoint(
                    mac_address=ep['mac'],
                    group_id=ep['group'],
                    description=ep.get('description')
                )
                results['success'].append(ep['mac'])
            except Exception as e:
                results['failed'].append({
                    'mac': ep['mac'],
                    'error': str(e)
                })
        
        return results

# Example usage
if __name__ == "__main__":
    em = EndpointManager()
    
    # Get all endpoints (first page)
    endpoints = em.get_all_endpoints()
    print(f"Total endpoints: {endpoints.get('SearchResult', {}).get('total', 0)}")
    
    # Search by MAC
    result = em.get_endpoint_by_mac("AA:BB:CC:DD:EE:FF")
    if result.get('SearchResult', {}).get('resources'):
        print("Endpoint found!")
```

### 3.3 Security Group Tag (SGT) Management

```python
#!/usr/bin/env python3
"""
ISE SGT Management
/opt/abhavtech/automation/ise_sgt.py
"""

from ise_connection import ISEConnection

class SGTManager:
    def __init__(self):
        self.ise = ISEConnection()
    
    def get_all_sgts(self):
        """Get all Security Group Tags"""
        return self.ise.get("sgt")
    
    def get_sgt_by_name(self, name):
        """Get SGT by name"""
        endpoint = f"sgt?filter=name.EQ.{name}"
        return self.ise.get(endpoint)
    
    def get_sgt_by_value(self, value):
        """Get SGT by tag value"""
        endpoint = f"sgt?filter=value.EQ.{value}"
        return self.ise.get(endpoint)
    
    def create_sgt(self, name, value, description=None):
        """
        Create new SGT
        
        Args:
            name: SGT name (e.g., "Employees")
            value: SGT value (e.g., 10)
            description: Optional description
        """
        payload = {
            "Sgt": {
                "name": name,
                "value": value,
                "description": description or f"SGT for {name}",
                "propogateToApic": False
            }
        }
        return self.ise.post("sgt", payload)
    
    def get_sgacl_policies(self):
        """Get all SGACL policies"""
        return self.ise.get("egressmatrixcell")
    
    def create_sgacl_policy(self, source_sgt_id, dest_sgt_id, sgacl_ids, status="ENABLED"):
        """
        Create SGACL policy (matrix cell)
        
        Args:
            source_sgt_id: Source SGT ID
            dest_sgt_id: Destination SGT ID
            sgacl_ids: List of SGACL IDs to apply
            status: ENABLED, DISABLED, or MONITOR
        """
        payload = {
            "EgressMatrixCell": {
                "sourceSgtId": source_sgt_id,
                "destinationSgtId": dest_sgt_id,
                "matrixCellStatus": status,
                "sgacls": sgacl_ids
            }
        }
        return self.ise.post("egressmatrixcell", payload)

# Example usage
if __name__ == "__main__":
    sgt_mgr = SGTManager()
    
    # Get all SGTs
    sgts = sgt_mgr.get_all_sgts()
    print("Current SGTs:")
    for sgt in sgts.get('SearchResult', {}).get('resources', []):
        print(f"  - {sgt.get('name')}")
```

### 3.4 Network Device (NAD) Management

```python
#!/usr/bin/env python3
"""
ISE Network Access Device Management
/opt/abhavtech/automation/ise_nad.py
"""

from ise_connection import ISEConnection

class NADManager:
    def __init__(self):
        self.ise = ISEConnection()
    
    def get_all_nads(self):
        """Get all Network Access Devices"""
        return self.ise.get("networkdevice")
    
    def get_nad_by_ip(self, ip_address):
        """Get NAD by IP address"""
        endpoint = f"networkdevice?filter=ipaddress.EQ.{ip_address}"
        return self.ise.get(endpoint)
    
    def create_nad(self, name, ip_address, radius_key, tacacs_key=None,
                   device_type="Cisco", location="Global"):
        """
        Create new Network Access Device
        
        Args:
            name: Device name
            ip_address: Management IP
            radius_key: RADIUS shared secret
            tacacs_key: Optional TACACS+ key
            device_type: Device profile name
            location: Network device group
        """
        payload = {
            "NetworkDevice": {
                "name": name,
                "NetworkDeviceIPList": [{
                    "ipaddress": ip_address,
                    "mask": 32
                }],
                "authenticationSettings": {
                    "radiusSharedSecret": radius_key,
                    "enableKeyWrap": False
                },
                "profileName": device_type,
                "coaPort": 1700,
                "NetworkDeviceGroupList": [
                    f"Location#All Locations#{location}",
                    f"Device Type#All Device Types#{device_type}"
                ],
                "trustsecsettings": {
                    "deviceAuthenticationSettings": {
                        "sgaDeviceId": name,
                        "sgaDevicePassword": radius_key
                    },
                    "deviceConfigurationDeployment": {
                        "includeWhenDeployingSGTUpdates": True,
                        "enableModePassword": ""
                    },
                    "sgaNotificationAndUpdates": {
                        "downlaodEnvironmentDataEveryXSeconds": 86400,
                        "downloadPeerAuthorizationPolicyEveryXSeconds": 86400,
                        "reAuthenticationEveryXSeconds": 86400,
                        "downloadSGACLListsEveryXSeconds": 86400,
                        "otherSGADevicesToTrustThisDevice": True,
                        "sendConfigurationToDevice": True,
                        "sendConfigurationToDeviceUsing": "ENABLE_USING_COA",
                        "coaSourceHost": "ise-psn-01.abhavtech.com"
                    }
                }
            }
        }
        
        if tacacs_key:
            payload["NetworkDevice"]["tacacsSettings"] = {
                "sharedSecret": tacacs_key,
                "connectModeOptions": "ON_LEGACY"
            }
        
        return self.ise.post("networkdevice", payload)
    
    def bulk_add_nads(self, devices):
        """
        Bulk add NADs from list
        
        Args:
            devices: List of dicts with name, ip, radius_key
        """
        results = {'success': [], 'failed': []}
        
        for device in devices:
            try:
                self.create_nad(
                    name=device['name'],
                    ip_address=device['ip'],
                    radius_key=device['radius_key'],
                    tacacs_key=device.get('tacacs_key'),
                    device_type=device.get('device_type', 'Cisco'),
                    location=device.get('location', 'Global')
                )
                results['success'].append(device['name'])
            except Exception as e:
                results['failed'].append({
                    'name': device['name'],
                    'error': str(e)
                })
        
        return results

# Example usage
if __name__ == "__main__":
    nad_mgr = NADManager()
    
    # Add new switch
    result = nad_mgr.create_nad(
        name="MUM-ED-99",
        ip_address="10.100.1.99",
        radius_key="$RadiusSecret$",
        device_type="Cisco",
        location="Mumbai"
    )
    print(f"NAD created: {result}")
```

---

## 4. Scheduled Automation Jobs

### 4.1 Daily Health Check Script

```python
#!/usr/bin/env python3
"""
Daily Health Check Automation
/opt/abhavtech/automation/daily_health_check.py

Schedule: Daily at 06:00 AM via cron
0 6 * * * /usr/bin/python3 /opt/abhavtech/automation/daily_health_check.py
"""

from dnac_connection import get_dnac_connection
from ise_connection import ISEConnection
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
import json

class DailyHealthCheck:
    def __init__(self):
        self.dnac = get_dnac_connection()
        self.ise = ISEConnection()
        self.report = []
    
    def check_dnac_health(self):
        """Check Catalyst Center overall health"""
        try:
            health = self.dnac.topology.get_overall_network_health()
            score = health.response[0].get('healthScore', 0)
            self.report.append(f"Catalyst Center Health Score: {score}%")
            return score >= 90
        except Exception as e:
            self.report.append(f"ERROR: Cannot get DNAC health - {e}")
            return False
    
    def check_fabric_sites(self):
        """Check all fabric sites health"""
        try:
            sites = self.dnac.sda.get_sda_fabric_info()
            healthy = 0
            unhealthy = []
            
            for site in sites.response:
                if site.get('status') == 'Active':
                    healthy += 1
                else:
                    unhealthy.append(site.get('fabricName'))
            
            self.report.append(f"Fabric Sites: {healthy} healthy, {len(unhealthy)} unhealthy")
            if unhealthy:
                self.report.append(f"  Unhealthy sites: {', '.join(unhealthy)}")
            
            return len(unhealthy) == 0
        except Exception as e:
            self.report.append(f"ERROR: Cannot check fabric sites - {e}")
            return False
    
    def check_ise_nodes(self):
        """Check ISE node status"""
        try:
            nodes = self.ise.get("deployment/node")
            active = 0
            inactive = []
            
            for node in nodes.get('SearchResult', {}).get('resources', []):
                node_detail = self.ise.get(f"deployment/node/{node['id']}")
                status = node_detail.get('Node', {}).get('nodeStatus')
                
                if status == 'CONNECTED':
                    active += 1
                else:
                    inactive.append(node.get('name'))
            
            self.report.append(f"ISE Nodes: {active} active, {len(inactive)} inactive")
            if inactive:
                self.report.append(f"  Inactive nodes: {', '.join(inactive)}")
            
            return len(inactive) == 0
        except Exception as e:
            self.report.append(f"ERROR: Cannot check ISE nodes - {e}")
            return False
    
    def check_device_reachability(self):
        """Check network device reachability"""
        try:
            devices = self.dnac.devices.get_device_list()
            total = len(devices.response)
            unreachable = [d for d in devices.response 
                         if d.get('reachabilityStatus') != 'Reachable']
            
            self.report.append(f"Network Devices: {total - len(unreachable)}/{total} reachable")
            if unreachable:
                self.report.append(f"  Unreachable: {', '.join([d.get('hostname') for d in unreachable[:5]])}")
                if len(unreachable) > 5:
                    self.report.append(f"    ...and {len(unreachable) - 5} more")
            
            return len(unreachable) == 0
        except Exception as e:
            self.report.append(f"ERROR: Cannot check devices - {e}")
            return False
    
    def run_checks(self):
        """Run all health checks"""
        self.report = [
            "=" * 60,
            f"DAILY HEALTH CHECK - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            "=" * 60,
            ""
        ]
        
        results = {
            'Catalyst Center': self.check_dnac_health(),
            'Fabric Sites': self.check_fabric_sites(),
            'ISE Nodes': self.check_ise_nodes(),
            'Device Reachability': self.check_device_reachability()
        }
        
        self.report.append("")
        self.report.append("=" * 60)
        overall = all(results.values())
        self.report.append(f"OVERALL STATUS: {'HEALTHY ✓' if overall else 'ISSUES DETECTED ✗'}")
        self.report.append("=" * 60)
        
        return overall, '\n'.join(self.report)
    
    def send_report(self, recipients, report_text):
        """Send report via email"""
        msg = MIMEMultipart()
        msg['Subject'] = f"Daily Health Check - {datetime.now().strftime('%Y-%m-%d')}"
        msg['From'] = 'automation@abhavtech.com'
        msg['To'] = ', '.join(recipients)
        
        msg.attach(MIMEText(report_text, 'plain'))
        
        with smtplib.SMTP('smtp.abhavtech.com', 25) as server:
            server.send_message(msg)

# Main execution
if __name__ == "__main__":
    checker = DailyHealthCheck()
    overall, report = checker.run_checks()
    
    print(report)
    
    # Send email
    recipients = ['noc@abhavtech.com', 'network-team@abhavtech.com']
    checker.send_report(recipients, report)
    
    # Exit with appropriate code
    exit(0 if overall else 1)
```

---

## 5. Environment Configuration

### 5.1 Environment Variables File

```bash
# /opt/abhavtech/automation/.env
# DO NOT COMMIT TO VERSION CONTROL

# Catalyst Center
DNAC_URL=https://catalyst.abhavtech.com
DNAC_USER=api-admin
DNAC_PASS=<secure-password>

# ISE
ISE_URL=https://ise-pan.abhavtech.com:9060
ISE_USER=api-admin
ISE_PASS=<secure-password>

# pxGrid
PXGRID_HOST=ise-pan.abhavtech.com
PXGRID_CLIENT_CERT=/opt/abhavtech/automation/certs/pxgrid-client.pem
PXGRID_CLIENT_KEY=/opt/abhavtech/automation/certs/pxgrid-client.key
PXGRID_CA_CERT=/opt/abhavtech/automation/certs/ise-ca.pem

# SMTP
SMTP_SERVER=smtp.abhavtech.com
SMTP_PORT=25
SMTP_FROM=automation@abhavtech.com

# ServiceNow
SNOW_INSTANCE=abhavtech.service-now.com
SNOW_USER=api-integration
SNOW_PASS=<secure-password>
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
