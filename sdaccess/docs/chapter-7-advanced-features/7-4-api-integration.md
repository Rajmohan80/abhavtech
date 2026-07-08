# 7.4 API Integration

### 7.4.1 DNAC API Overview

```
+------------------------------------------------------------------+
|                    DNAC API ARCHITECTURE                          |
+------------------------------------------------------------------+

External Systems                         DNAC Platform
+------------------+                    +------------------+
| ITSM             |                    |                  |
| (ServiceNow)     |<------------------>| Intent API       |
+------------------+     REST/JSON      | /dna/intent/...  |
                                        |                  |
+------------------+                    |------------------|
| SIEM             |                    |                  |
| (Splunk)         |<------------------>| Integration API  |
+------------------+     Webhooks       | /dna/system/...  |
                                        |                  |
+------------------+                    |------------------|
| Orchestration    |                    |                  |
| (Ansible)        |<------------------>| Platform API     |
+------------------+     REST/JSON      | /api/system/...  |
                                        |                  |
+------------------+                    |------------------|
| Custom Apps      |                    |                  |
| (Python)         |<------------------>| Reports API      |
+------------------+     REST/JSON      | /dna/data/...    |
+------------------------------------------------------------------+
```

### 7.4.2 Key API Endpoints

| Category | Endpoint | Method | Purpose |
|----------|----------|--------|---------|
| Authentication | /dna/system/api/v1/auth/token | POST | Get auth token |
| Devices | /dna/intent/api/v1/network-device | GET | List devices |
| Sites | /dna/intent/api/v1/site | GET/POST | Manage sites |
| Fabric | /dna/intent/api/v1/business/sda/fabric-site | GET | Fabric sites |
| Issues | /dna/intent/api/v1/issues | GET | Active issues |
| Events | /dna/intent/api/v1/events | GET | Event history |
| Templates | /dna/intent/api/v1/template-programmer/template | GET/POST | Templates |
| PnP | /dna/intent/api/v1/onboarding/pnp-device | GET/POST | PnP devices |

### 7.4.3 Webhook Configuration

```yaml
# Platform > Developer Toolkit > Event Notifications

Webhook_Subscriptions:
  
  Critical_Device_Events:
    Name: Critical Device Alerts
    Events:
      - DEVICE_UNREACHABLE
      - DEVICE_REBOOT
      - INTERFACE_DOWN
    Destination:
      Type: Webhook
      URL: https://hooks.corp.local/dnac/critical
      Method: POST
      Headers:
        Content-Type: application/json
        Authorization: Bearer <token>
    Payload_Format: JSON
    Retry: 3 attempts
    
  Fabric_Events:
    Name: Fabric Status Changes
    Events:
      - FABRIC_SITE_PROVISIONED
      - FABRIC_NODE_ADDED
      - LISP_SESSION_DOWN
    Destination:
      Type: Webhook
      URL: https://hooks.corp.local/dnac/fabric
      Method: POST
```

### 7.4.4 ISE API Integration

```python
#!/usr/bin/env python3
"""
ISE ERS API Integration Examples
"""

import requests
from requests.auth import HTTPBasicAuth

ISE_HOST = "https://ise-pan-nj.corp.local:9060"
USERNAME = "api-admin"
PASSWORD = "<password>"

headers = {
    "Accept": "application/json",
    "Content-Type": "application/json"
}

def get_endpoints():
    """Get all endpoints from ISE"""
    url = f"{ISE_HOST}/ers/config/endpoint"
    response = requests.get(
        url, 
        auth=HTTPBasicAuth(USERNAME, PASSWORD),
        headers=headers,
        verify=False
    )
    return response.json()

def get_endpoint_by_mac(mac_address):
    """Get specific endpoint by MAC"""
    url = f"{ISE_HOST}/ers/config/endpoint?filter=mac.EQ.{mac_address}"
    response = requests.get(
        url,
        auth=HTTPBasicAuth(USERNAME, PASSWORD),
        headers=headers,
        verify=False
    )
    return response.json()

def create_endpoint(mac_address, profile_id, group_id):
    """Create new endpoint"""
    url = f"{ISE_HOST}/ers/config/endpoint"
    payload = {
        "ERSEndPoint": {
            "mac": mac_address,
            "profileId": profile_id,
            "groupId": group_id,
            "staticProfileAssignment": True
        }
    }
    response = requests.post(
        url,
        auth=HTTPBasicAuth(USERNAME, PASSWORD),
        headers=headers,
        json=payload,
        verify=False
    )
    return response.json()

def get_network_devices():
    """Get all network devices"""
    url = f"{ISE_HOST}/ers/config/networkdevice"
    response = requests.get(
        url,
        auth=HTTPBasicAuth(USERNAME, PASSWORD),
        headers=headers,
        verify=False
    )
    return response.json()

def update_sgt_assignment(endpoint_id, sgt):
    """Update SGT assignment for endpoint"""
    url = f"{ISE_HOST}/ers/config/endpoint/{endpoint_id}"
    payload = {
        "ERSEndPoint": {
            "customAttributes": {
                "customAttributes": {
                    "SGT": sgt
                }
            }
        }
    }
    response = requests.put(
        url,
        auth=HTTPBasicAuth(USERNAME, PASSWORD),
        headers=headers,
        json=payload,
        verify=False
    )
    return response.json()
```

### 7.4.5 Ansible Integration

```yaml
# ansible/playbooks/dnac_site_provision.yml

---
- name: Provision New Site in DNAC
  hosts: localhost
  gather_facts: no
  vars:
    dnac_host: "dnac.corp.local"
    dnac_username: "admin"
    dnac_password: "{{ vault_dnac_password }}"
    site_name: "New_Branch_Site"
    parent_site: "Global/Americas/Branches_AMER"
    
  tasks:
    - name: Get DNAC Auth Token
      uri:
        url: "https://{{ dnac_host }}/dna/system/api/v1/auth/token"
        method: POST
        user: "{{ dnac_username }}"
        password: "{{ dnac_password }}"
        force_basic_auth: yes
        validate_certs: no
        status_code: 200
      register: auth_response
      
    - name: Set Auth Token
      set_fact:
        dnac_token: "{{ auth_response.json.Token }}"
        
    - name: Create Site
      uri:
        url: "https://{{ dnac_host }}/dna/intent/api/v1/site"
        method: POST
        headers:
          X-Auth-Token: "{{ dnac_token }}"
          Content-Type: "application/json"
        body_format: json
        body:
          type: "building"
          site:
            building:
              name: "{{ site_name }}"
              parentName: "{{ parent_site }}"
              address: "123 Main St, City, State"
        validate_certs: no
        status_code: [200, 202]
      register: site_response
      
    - name: Wait for Site Creation
      uri:
        url: "https://{{ dnac_host }}/dna/intent/api/v1/task/{{ site_response.json.response.taskId }}"
        method: GET
        headers:
          X-Auth-Token: "{{ dnac_token }}"
        validate_certs: no
      register: task_status
      until: task_status.json.response.endTime is defined
      retries: 30
      delay: 10
      
    - name: Display Result
      debug:
        msg: "Site {{ site_name }} created successfully"
```

---
