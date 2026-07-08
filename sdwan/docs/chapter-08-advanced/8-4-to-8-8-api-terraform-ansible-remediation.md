# 8.4 REST API Reference

## 8.4.1 API Overview

### API Architecture

```yaml
api_architecture:
  base_url: "https://vmanage.abhavtech.com/dataservice"
  authentication: "Session-based with XSRF token"
  format: "JSON"
  
  api_categories:
    administration:
      prefix: "/admin"
      operations: "User management, settings"
      
    device:
      prefix: "/device"
      operations: "Device inventory, status, configuration"
      
    template:
      prefix: "/template"
      operations: "Feature and device templates"
      
    policy:
      prefix: "/template/policy"
      operations: "Policy management"
      
    statistics:
      prefix: "/statistics"
      operations: "Performance metrics"
      
    alarms:
      prefix: "/alarms"
      operations: "Alarm management"
```

### Authentication Flow

```python
#!/usr/bin/env python3
"""
vManage API Authentication
"""

import requests
import json

def authenticate(host, username, password):
    """
    Authenticate to vManage and get session token
    
    Returns:
        session: Authenticated requests session
        token: XSRF token for subsequent requests
    """
    session = requests.Session()
    session.verify = False
    
    # Step 1: POST credentials
    auth_url = f"https://{host}/j_security_check"
    auth_response = session.post(
        auth_url,
        data={'j_username': username, 'j_password': password}
    )
    
    # Check for successful login
    if auth_response.status_code != 200:
        raise Exception("Authentication failed")
        
    # Step 2: Get XSRF token
    token_url = f"https://{host}/dataservice/client/token"
    token_response = session.get(token_url)
    
    if token_response.status_code == 200:
        token = token_response.text
        session.headers['X-XSRF-TOKEN'] = token
        return session, token
    else:
        raise Exception("Failed to get XSRF token")
```

## 8.4.2 Common API Endpoints

### Device APIs

```yaml
device_apis:
  list_devices:
    method: "GET"
    endpoint: "/dataservice/device"
    response: "Array of device objects"
    example: |
      curl -k -X GET "https://vmanage/dataservice/device" \
        -H "Cookie: JSESSIONID=xxx" \
        -H "X-XSRF-TOKEN: xxx"
        
  device_status:
    method: "GET"
    endpoint: "/dataservice/device/status"
    parameters:
      deviceId: "Device UUID"
    response: "Device status details"
    
  device_counters:
    method: "GET"
    endpoint: "/dataservice/device/counters"
    response: "Aggregate device counts"
    
  control_connections:
    method: "GET"
    endpoint: "/dataservice/device/control/connections"
    parameters:
      deviceId: "Optional device filter"
    response: "Control connection status"
    
  bfd_sessions:
    method: "GET"
    endpoint: "/dataservice/device/bfd/sessions"
    parameters:
      deviceId: "Optional device filter"
    response: "BFD session status"
```

### Template APIs

```yaml
template_apis:
  list_feature_templates:
    method: "GET"
    endpoint: "/dataservice/template/feature"
    response: "Array of feature templates"
    
  list_device_templates:
    method: "GET"
    endpoint: "/dataservice/template/device"
    response: "Array of device templates"
    
  create_feature_template:
    method: "POST"
    endpoint: "/dataservice/template/feature"
    body:
      templateName: "Template name"
      templateDescription: "Description"
      templateType: "Template type"
      deviceType: "Device type"
      templateDefinition: "Template JSON"
    response: "Template ID"
    
  attach_template:
    method: "POST"
    endpoint: "/dataservice/template/device/config/attachcli"
    body:
      deviceTemplateList: "Array of device/template mappings"
    response: "Task ID"
```

### Policy APIs

```yaml
policy_apis:
  list_policies:
    method: "GET"
    endpoint: "/dataservice/template/policy/vsmart"
    response: "Array of vSmart policies"
    
  activate_policy:
    method: "POST"
    endpoint: "/dataservice/template/policy/vsmart/activate/{policyId}"
    response: "Task ID"
    
  deactivate_policy:
    method: "POST"
    endpoint: "/dataservice/template/policy/vsmart/deactivate/{policyId}"
    response: "Task ID"
```

---

# 8.5 vManage API Deep Dive

## 8.5.1 API Response Handling

### Standard Response Structure

```python
#!/usr/bin/env python3
"""
vManage API Response Handler
"""

import json
from typing import Dict, List, Optional

class APIResponse:
    """Handler for vManage API responses"""
    
    def __init__(self, response):
        self.status_code = response.status_code
        self.raw_response = response
        
        try:
            self.json_data = response.json()
        except:
            self.json_data = None
            
    @property
    def data(self) -> List[Dict]:
        """Extract data array from response"""
        if self.json_data:
            return self.json_data.get('data', [])
        return []
        
    @property
    def header(self) -> Dict:
        """Extract header from response"""
        if self.json_data:
            return self.json_data.get('header', {})
        return {}
        
    @property
    def is_success(self) -> bool:
        """Check if request was successful"""
        return self.status_code in [200, 201, 202]
        
    @property
    def error(self) -> Optional[str]:
        """Extract error message if present"""
        if self.json_data:
            return self.json_data.get('error', {}).get('message')
        return None
        
    def get_task_id(self) -> Optional[str]:
        """Extract task ID from async operations"""
        if self.json_data:
            return self.json_data.get('id')
        return None
```

## 8.5.2 Bulk Operations

### Bulk Device Operations

```python
#!/usr/bin/env python3
"""
Bulk Device Operations via API
"""

import requests
import json
import time

class BulkOperations:
    def __init__(self, session, base_url):
        self.session = session
        self.base_url = base_url
        
    def bulk_template_attach(self, template_id: str, devices: list, variables: dict) -> str:
        """Attach template to multiple devices"""
        
        device_list = []
        for device in devices:
            device_entry = {
                'csv-deviceId': device['deviceId'],
                'csv-deviceIP': device['systemIp'],
                'csv-host-name': device['hostname'],
            }
            device_entry.update(variables.get(device['deviceId'], {}))
            device_list.append(device_entry)
            
        payload = {
            'deviceTemplateList': [{
                'templateId': template_id,
                'device': device_list,
                'isEdited': False,
                'isMasterEdited': False
            }]
        }
        
        url = f"{self.base_url}/template/device/config/attachcli"
        response = self.session.post(url, json=payload)
        
        if response.status_code == 200:
            return response.json().get('id')
        else:
            raise Exception(f"Bulk attach failed: {response.text}")
            
    def bulk_reboot(self, device_ids: list) -> str:
        """Reboot multiple devices"""
        
        payload = {
            'action': 'reboot',
            'deviceIds': device_ids,
            'deviceType': 'vedge'
        }
        
        url = f"{self.base_url}/device/action/reboot"
        response = self.session.post(url, json=payload)
        
        return response.json().get('id')
        
    def wait_for_task(self, task_id: str, timeout: int = 600) -> dict:
        """Wait for bulk operation to complete"""
        
        url = f"{self.base_url}/device/action/status/{task_id}"
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            response = self.session.get(url)
            status = response.json()
            
            summary = status.get('summary', {})
            if summary.get('status') == 'done':
                return status
            elif summary.get('status') == 'failure':
                raise Exception(f"Task failed: {status}")
                
            time.sleep(10)
            
        raise TimeoutError(f"Task {task_id} timed out")
```

---

# 8.6 Terraform Integration

## 8.6.1 Terraform Provider Setup

### Provider Configuration

```hcl
# providers.tf

terraform {
  required_providers {
    sdwan = {
      source  = "CiscoDevNet/sdwan"
      version = "~> 0.3"
    }
  }
}

provider "sdwan" {
  url      = var.vmanage_url
  username = var.vmanage_username
  password = var.vmanage_password
  insecure = true
}

variable "vmanage_url" {
  description = "vManage URL"
  type        = string
  default     = "https://vmanage.abhavtech.com"
}

variable "vmanage_username" {
  description = "vManage username"
  type        = string
  sensitive   = true
}

variable "vmanage_password" {
  description = "vManage password"
  type        = string
  sensitive   = true
}
```

## 8.6.2 Feature Template Management

### System Template

```hcl
# templates/system_template.tf

resource "sdwan_system_feature_template" "branch_system" {
  name         = "ABVT-Branch-System"
  description  = "Branch site system template"
  device_types = ["vedge-C8000V", "vedge-C8300-2N2S-4T"]
  
  hostname_variable        = "system_hostname"
  system_ip_variable       = "system_ip"
  site_id_variable         = "site_id"
  
  console_baud_rate        = "115200"
  max_omp_sessions         = 2
  
  timezone                 = "Asia/Kolkata"
  
  location                 = "Branch Site"
  gps_longitude_variable   = "gps_longitude"
  gps_latitude_variable    = "gps_latitude"
}

resource "sdwan_system_feature_template" "hub_system" {
  name         = "ABVT-Hub-System"
  description  = "Hub site system template"
  device_types = ["vedge-C8500-12X4QC"]
  
  hostname_variable        = "system_hostname"
  system_ip_variable       = "system_ip"
  site_id_variable         = "site_id"
  
  console_baud_rate        = "115200"
  max_omp_sessions         = 4
  
  timezone                 = "Asia/Kolkata"
  location                 = "Hub Site"
}
```

### VPN Template

```hcl
# templates/vpn_template.tf

resource "sdwan_cedge_aaa_feature_template" "aaa" {
  name         = "ABVT-AAA"
  description  = "AAA configuration"
  device_types = ["vedge-C8000V", "vedge-C8300-2N2S-4T", "vedge-C8500-12X4QC"]
  
  server_auth_order = ["local", "tacacs"]
  
  radius_server {
    address    = "10.100.1.50"
    auth_port  = 1812
    acct_port  = 1813
    key        = var.radius_key
    key_type   = "7"
    timeout    = 5
    retransmit = 3
  }
}

resource "sdwan_cisco_vpn_feature_template" "vpn_0" {
  name         = "ABVT-VPN0-Transport"
  description  = "Transport VPN"
  device_types = ["vedge-C8000V", "vedge-C8300-2N2S-4T", "vedge-C8500-12X4QC"]
  
  vpn_id = 0
  name   = "Transport"
  
  dns_ipv4_primary_server   = "10.100.1.5"
  dns_ipv4_secondary_server = "10.100.1.6"
}

resource "sdwan_cisco_vpn_feature_template" "vpn_10" {
  name         = "ABVT-VPN10-Employee"
  description  = "Employee VPN"
  device_types = ["vedge-C8000V", "vedge-C8300-2N2S-4T", "vedge-C8500-12X4QC"]
  
  vpn_id = 10
  name   = "Employee"
  
  dns_ipv4_primary_server   = "10.100.1.5"
  dns_ipv4_secondary_server = "10.100.1.6"
  
  ipv4_static_route {
    prefix       = "0.0.0.0/0"
    next_hop     = "vpn0"
    next_hop_variable = "default_gateway"
  }
}
```

## 8.6.3 Device Template Management

```hcl
# templates/device_template.tf

resource "sdwan_device_template" "branch_template" {
  name        = "ABVT-Branch-Template"
  description = "Branch site device template"
  device_type = "vedge-C8300-2N2S-4T"
  
  general_template_list {
    template_id = sdwan_system_feature_template.branch_system.id
    template_type = "cisco_system"
  }
  
  general_template_list {
    template_id = sdwan_cedge_aaa_feature_template.aaa.id
    template_type = "cedge_aaa"
  }
  
  general_template_list {
    template_id = sdwan_cisco_vpn_feature_template.vpn_0.id
    template_type = "cisco_vpn"
  }
  
  general_template_list {
    template_id = sdwan_cisco_vpn_feature_template.vpn_10.id
    template_type = "cisco_vpn"
  }
}
```

---

# 8.7 Ansible Integration

## 8.7.1 Ansible Setup

### Inventory Configuration

```yaml
# inventory/hosts.yml

all:
  children:
    vmanage:
      hosts:
        vmanage.abhavtech.com:
          ansible_host: 10.100.1.10
          ansible_user: admin
          ansible_password: "{{ vault_vmanage_password }}"
          
    wan_edges:
      children:
        hub_sites:
          hosts:
            mumbai-hub-01:
              system_ip: 10.10.1.1
              site_id: 100
            chennai-hub-01:
              system_ip: 10.10.2.1
              site_id: 200
              
        branch_sites:
          hosts:
            bangalore-br-01:
              system_ip: 10.10.3.1
              site_id: 301
            delhi-br-01:
              system_ip: 10.10.4.1
              site_id: 302
```

### Variables

```yaml
# group_vars/all.yml

vmanage_host: vmanage.abhavtech.com
vmanage_port: 443

# NTP servers
ntp_servers:
  - 10.100.1.5
  - 10.100.1.6

# DNS servers
dns_servers:
  primary: 10.100.1.5
  secondary: 10.100.1.6

# Common settings
organization_name: "Abhavtech"
```

## 8.7.2 Ansible Playbooks

### Device Health Check Playbook

```yaml
# playbooks/health_check.yml

---
- name: SD-WAN Health Check
  hosts: localhost
  gather_facts: no
  
  vars:
    vmanage_host: "{{ lookup('env', 'VMANAGE_HOST') | default('vmanage.abhavtech.com') }}"
    vmanage_user: "{{ lookup('env', 'VMANAGE_USER') }}"
    vmanage_password: "{{ lookup('env', 'VMANAGE_PASSWORD') }}"
    
  tasks:
    - name: Authenticate to vManage
      uri:
        url: "https://{{ vmanage_host }}/j_security_check"
        method: POST
        body_format: form-urlencoded
        body:
          j_username: "{{ vmanage_user }}"
          j_password: "{{ vmanage_password }}"
        validate_certs: no
        status_code: 200
      register: auth_result
      
    - name: Get XSRF Token
      uri:
        url: "https://{{ vmanage_host }}/dataservice/client/token"
        method: GET
        validate_certs: no
        headers:
          Cookie: "{{ auth_result.cookies_string }}"
      register: token_result
      
    - name: Get Device List
      uri:
        url: "https://{{ vmanage_host }}/dataservice/device"
        method: GET
        validate_certs: no
        headers:
          Cookie: "{{ auth_result.cookies_string }}"
          X-XSRF-TOKEN: "{{ token_result.content }}"
      register: devices
      
    - name: Display Device Status
      debug:
        msg: "{{ item['host-name'] }}: {{ item['reachability'] }}"
      loop: "{{ devices.json.data }}"
      
    - name: Get Active Alarms
      uri:
        url: "https://{{ vmanage_host }}/dataservice/alarms"
        method: GET
        validate_certs: no
        headers:
          Cookie: "{{ auth_result.cookies_string }}"
          X-XSRF-TOKEN: "{{ token_result.content }}"
      register: alarms
      
    - name: Display Critical Alarms
      debug:
        msg: "CRITICAL: {{ item['type'] }} on {{ item['host-name'] }}"
      loop: "{{ alarms.json.data | selectattr('severity', 'equalto', 'Critical') | list }}"
```

### Template Push Playbook

```yaml
# playbooks/push_template.yml

---
- name: Push Device Template
  hosts: localhost
  gather_facts: no
  
  vars_prompt:
    - name: device_hostname
      prompt: "Enter device hostname"
      private: no
      
    - name: template_name
      prompt: "Enter template name"
      private: no
      
  tasks:
    - name: Include vManage connection
      include_vars: 
        file: ../group_vars/vmanage.yml
        
    - name: Authenticate to vManage
      uri:
        url: "https://{{ vmanage_host }}/j_security_check"
        method: POST
        body_format: form-urlencoded
        body:
          j_username: "{{ vmanage_user }}"
          j_password: "{{ vmanage_password }}"
        validate_certs: no
      register: auth
      
    - name: Get Token
      uri:
        url: "https://{{ vmanage_host }}/dataservice/client/token"
        method: GET
        validate_certs: no
        headers:
          Cookie: "{{ auth.cookies_string }}"
      register: token
      
    - name: Get Device ID
      uri:
        url: "https://{{ vmanage_host }}/dataservice/device"
        method: GET
        validate_certs: no
        headers:
          Cookie: "{{ auth.cookies_string }}"
          X-XSRF-TOKEN: "{{ token.content }}"
      register: devices
      
    - name: Set device facts
      set_fact:
        target_device: "{{ devices.json.data | selectattr('host-name', 'equalto', device_hostname) | first }}"
        
    - name: Push template (simplified)
      debug:
        msg: "Would push template {{ template_name }} to {{ target_device['deviceId'] }}"
```

---

# 8.8 Automated Remediation

## 8.8.1 Self-Healing Architecture

### Remediation Framework

```yaml
remediation_framework:
  architecture:
    event_source: "vManage alarms + syslog"
    processor: "Event-driven automation"
    executor: "Python scripts + Ansible"
    
  remediation_types:
    automatic:
      description: "No human intervention"
      examples:
        - "Tunnel flap recovery"
        - "Memory cleanup"
        - "Log rotation"
        
    semi_automatic:
      description: "Requires approval"
      examples:
        - "Device reboot"
        - "Configuration rollback"
        - "Circuit failover"
        
    manual:
      description: "Human action required"
      examples:
        - "Hardware replacement"
        - "Major configuration change"
```

## 8.8.2 Remediation Scripts

### Tunnel Recovery Script

```python
#!/usr/bin/env python3
"""
Automated Tunnel Recovery
Monitors and recovers tunnel failures
"""

import time
import logging
from abhavtech_sdk import AbhavtechSDWAN

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class TunnelRecovery:
    def __init__(self, sdk):
        self.sdk = sdk
        self.recovery_attempts = {}
        self.max_attempts = 3
        
    def monitor_tunnels(self):
        """Monitor BFD session status"""
        devices = self.sdk.get_devices(device_type='vedge')
        
        issues = []
        for device in devices:
            device_id = device.get('deviceId')
            bfd_sessions = self.sdk.get_bfd_sessions(device_id)
            
            down_tunnels = [s for s in bfd_sessions if s.get('state') != 'up']
            
            if down_tunnels:
                issues.append({
                    'device': device.get('host-name'),
                    'device_id': device_id,
                    'down_tunnels': down_tunnels
                })
                
        return issues
        
    def attempt_recovery(self, device_id, tunnel_info):
        """Attempt to recover failed tunnel"""
        
        # Track recovery attempts
        key = f"{device_id}:{tunnel_info.get('dest-ip')}"
        attempts = self.recovery_attempts.get(key, 0)
        
        if attempts >= self.max_attempts:
            logger.warning(f"Max recovery attempts reached for {key}")
            return False
            
        self.recovery_attempts[key] = attempts + 1
        
        # Recovery actions
        logger.info(f"Attempting recovery for {key} (attempt {attempts + 1})")
        
        # Action 1: Bounce the interface (if supported via API)
        # Action 2: Clear BFD session
        # Action 3: Verify TLOC advertisement
        
        # Monitor for recovery
        time.sleep(30)
        
        bfd_sessions = self.sdk.get_bfd_sessions(device_id)
        tunnel = [s for s in bfd_sessions 
                  if s.get('dest-ip') == tunnel_info.get('dest-ip')]
                  
        if tunnel and tunnel[0].get('state') == 'up':
            logger.info(f"Tunnel {key} recovered")
            del self.recovery_attempts[key]
            return True
        else:
            logger.warning(f"Recovery failed for {key}")
            return False
            
    def run(self, interval=60):
        """Main monitoring loop"""
        logger.info("Starting tunnel recovery monitor")
        
        while True:
            try:
                issues = self.monitor_tunnels()
                
                for issue in issues:
                    logger.warning(f"Tunnel issues on {issue['device']}")
                    
                    for tunnel in issue['down_tunnels']:
                        self.attempt_recovery(issue['device_id'], tunnel)
                        
            except Exception as e:
                logger.error(f"Error in monitoring loop: {e}")
                
            time.sleep(interval)


if __name__ == "__main__":
    sdk = AbhavtechSDWAN(
        host="vmanage.abhavtech.com",
        username="automation",
        password="secure_password"
    )
    
    recovery = TunnelRecovery(sdk)
    recovery.run()
```

### Certificate Renewal Automation

```python
#!/usr/bin/env python3
"""
Certificate Expiry Monitor and Renewal
"""

from datetime import datetime, timedelta
from abhavtech_sdk import AbhavtechSDWAN
import logging

logger = logging.getLogger(__name__)

class CertificateManager:
    def __init__(self, sdk):
        self.sdk = sdk
        self.warning_days = 30
        self.critical_days = 7
        
    def check_certificates(self):
        """Check certificate expiry status"""
        devices = self.sdk.get_devices()
        
        expiring = []
        
        for device in devices:
            # Would need certificate API endpoint
            # Simplified example
            cert_expiry = device.get('certificate-expiry')
            
            if cert_expiry:
                expiry_date = datetime.fromisoformat(cert_expiry)
                days_remaining = (expiry_date - datetime.now()).days
                
                if days_remaining <= self.warning_days:
                    expiring.append({
                        'device': device.get('host-name'),
                        'expiry_date': cert_expiry,
                        'days_remaining': days_remaining,
                        'severity': 'CRITICAL' if days_remaining <= self.critical_days else 'WARNING'
                    })
                    
        return expiring
        
    def initiate_renewal(self, device_id):
        """Initiate certificate renewal"""
        logger.info(f"Initiating certificate renewal for {device_id}")
        # Would call certificate renewal API
        pass
        
    def run(self):
        """Run certificate check and renewal"""
        expiring = self.check_certificates()
        
        for cert in expiring:
            logger.warning(f"Certificate expiring: {cert}")
            
            if cert['severity'] == 'CRITICAL':
                # Auto-renew critical certificates
                # self.initiate_renewal(cert['device_id'])
                pass
                
        return expiring


if __name__ == "__main__":
    sdk = AbhavtechSDWAN(
        host="vmanage.abhavtech.com",
        username="admin",
        password="admin_password"
    )
    
    cert_mgr = CertificateManager(sdk)
    expiring = cert_mgr.run()
    print(f"Expiring certificates: {expiring}")
```

---

*Document version: 1.0*
*Last updated: 2025*
*Classification: Internal Use*
