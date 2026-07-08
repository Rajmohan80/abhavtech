# Configuration Templates

**Ready-to-Use Configuration Snippets**

---

## Overview

This appendix provides configuration templates and code snippets that can be adapted for your specific environment. Always test thoroughly in lab environments before production deployment.

---

## SD-WAN Templates

### vManage Device Template Structure

```yaml
# Device Template for Branch ISR 1100
template_name: "Branch-ISR1100-Template"
device_type: "vedge-ISR-1100-4G"
description: "Standard branch router template"

feature_templates:
  - name: "System-Template"
    type: "cisco_system"
  - name: "VPN0-Template"
    type: "cisco_vpn"
  - name: "VPN10-Template"
    type: "cisco_vpn"
  - name: "Banner-Template"
    type: "cisco_banner"
  - name: "OMP-Template"
    type: "cisco_omp"
```

### BGP Configuration (Cloud Interconnect)

```
router bgp 65001
 bgp log-neighbor-changes
 neighbor 169.254.1.1 remote-as 16550
 neighbor 169.254.1.1 description GCP-Cloud-Router-Primary
 neighbor 169.254.1.5 remote-as 16550
 neighbor 169.254.1.5 description GCP-Cloud-Router-Secondary
 !
 address-family ipv4
  network 10.100.0.0 mask 255.255.0.0
  neighbor 169.254.1.1 activate
  neighbor 169.254.1.1 soft-reconfiguration inbound
  neighbor 169.254.1.5 activate
  neighbor 169.254.1.5 soft-reconfiguration inbound
  maximum-paths 2
 exit-address-family
```

### QoS Policy Template

```
policy
 class-map match-any VOICE
  match dscp ef
 !
 class-map match-any VIDEO
  match dscp af41
 !
 class-map match-any CRITICAL-DATA
  match dscp af31
 !
 policy-map BRANCH-EGRESS
  class VOICE
   priority percent 20
  class VIDEO
   bandwidth percent 25
  class CRITICAL-DATA
   bandwidth percent 30
  class class-default
   bandwidth percent 25
```

---

## GCP Terraform Templates

### Cloud Interconnect VLAN Attachment

```hcl
# GCP Cloud Interconnect VLAN Attachment
resource "google_compute_interconnect_attachment" "mumbai_primary" {
  name         = "mumbai-interconnect-primary"
  region       = "asia-south1"
  type         = "DEDICATED"
  router       = google_compute_router.mumbai_router.id
  
  interconnect = "projects/${var.project_id}/global/interconnects/mumbai-interconnect"
  
  vlan_tag8021q = 100
  
  candidate_subnets = ["169.254.1.0/29"]
  
  admin_enabled = true
}

# Cloud Router Configuration
resource "google_compute_router" "mumbai_router" {
  name    = "mumbai-cloud-router"
  region  = "asia-south1"
  network = google_compute_network.vpc_network.id
  
  bgp {
    asn = 16550
    advertise_mode = "CUSTOM"
    
    advertised_ip_ranges {
      range = "10.128.0.0/16"
      description = "GCP VPC Range"
    }
  }
}

# BGP Peer Configuration
resource "google_compute_router_peer" "mumbai_bgp_peer" {
  name                      = "mumbai-bgp-peer-primary"
  router                    = google_compute_router.mumbai_router.name
  region                    = "asia-south1"
  peer_ip_address          = "169.254.1.2"
  peer_asn                 = 65001
  advertised_route_priority = 100
  interface                = google_compute_router_interface.mumbai_interface.name
}
```

### Vertex AI Service Account

```hcl
# Service Account for Vertex AI
resource "google_service_account" "vertex_ai_sa" {
  account_id   = "vertex-ai-service-account"
  display_name = "Vertex AI Service Account"
  project      = var.project_id
}

# IAM Roles
resource "google_project_iam_member" "vertex_ai_user" {
  project = var.project_id
  role    = "roles/aiplatform.user"
  member  = "serviceAccount:${google_service_account.vertex_ai_sa.email}"
}

resource "google_project_iam_member" "vertex_ai_admin" {
  project = var.project_id
  role    = "roles/aiplatform.admin"
  member  = "serviceAccount:${google_service_account.vertex_ai_sa.email}"
}
```

---

## Azure Terraform Templates

### ExpressRoute Circuit

```hcl
# Azure ExpressRoute Circuit
resource "azurerm_express_route_circuit" "mumbai_circuit" {
  name                  = "mumbai-expressroute-circuit"
  resource_group_name   = azurerm_resource_group.network_rg.name
  location              = "centralindia"
  service_provider_name = "Tata Communications"
  peering_location      = "Mumbai"
  bandwidth_in_mbps     = 1000
  
  sku {
    tier   = "Standard"
    family = "MeteredData"
  }
  
  tags = {
    Environment = "Production"
    Project     = "Multi-Cloud"
  }
}

# Microsoft Peering for Office 365
resource "azurerm_express_route_circuit_peering" "microsoft_peering" {
  peering_type                  = "MicrosoftPeering"
  express_route_circuit_name    = azurerm_express_route_circuit.mumbai_circuit.name
  resource_group_name           = azurerm_resource_group.network_rg.name
  peer_asn                      = 65001
  primary_peer_address_prefix   = "192.168.100.0/30"
  secondary_peer_address_prefix = "192.168.100.4/30"
  vlan_id                       = 200
  
  microsoft_peering_config {
    advertised_public_prefixes = ["203.0.113.0/24"]
  }
}
```

### Virtual WAN Hub

```hcl
# Virtual WAN
resource "azurerm_virtual_wan" "global_vwan" {
  name                = "global-virtual-wan"
  resource_group_name = azurerm_resource_group.network_rg.name
  location            = azurerm_resource_group.network_rg.location
}

# Virtual Hub
resource "azurerm_virtual_hub" "india_hub" {
  name                = "india-central-hub"
  resource_group_name = azurerm_resource_group.network_rg.name
  location            = "centralindia"
  virtual_wan_id      = azurerm_virtual_wan.global_vwan.id
  address_prefix      = "10.200.0.0/23"
  
  sku = "Standard"
}

# VPN Gateway
resource "azurerm_vpn_gateway" "india_vpn_gw" {
  name                = "india-vpn-gateway"
  resource_group_name = azurerm_resource_group.network_rg.name
  location            = "centralindia"
  virtual_hub_id      = azurerm_virtual_hub.india_hub.id
}
```

---

## Python Automation Scripts

### vManage API Authentication

```python
#!/usr/bin/env python3
"""
vManage API Authentication and Session Management
"""

import requests
import json
from requests.packages.urllib3.exceptions import InsecureRequestWarning

# Disable SSL warnings for lab environments
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

class vManageAPI:
    def __init__(self, host, username, password):
        self.host = host
        self.base_url = f"https://{host}"
        self.username = username
        self.password = password
        self.session = requests.Session()
        self.token = None
    
    def login(self):
        """Authenticate and get session token"""
        url = f"{self.base_url}/j_security_check"
        payload = {
            'j_username': self.username,
            'j_password': self.password
        }
        
        response = self.session.post(url, data=payload, verify=False)
        
        if response.status_code == 200:
            # Get XSRF token
            token_url = f"{self.base_url}/dataservice/client/token"
            token_response = self.session.get(token_url, verify=False)
            
            if token_response.status_code == 200:
                self.token = token_response.text
                self.session.headers['X-XSRF-TOKEN'] = self.token
                return True
        
        return False
    
    def get_device_list(self):
        """Get list of all devices"""
        url = f"{self.base_url}/dataservice/device"
        response = self.session.get(url, verify=False)
        
        if response.status_code == 200:
            return response.json()
        return None
    
    def get_template_list(self):
        """Get list of device templates"""
        url = f"{self.base_url}/dataservice/template/device"
        response = self.session.get(url, verify=False)
        
        if response.status_code == 200:
            return response.json()
        return None

# Usage example
if __name__ == "__main__":
    vmanage = vManageAPI(
        host="vmanage.example.com",
        username="admin",
        password="password"
    )
    
    if vmanage.login():
        print("Login successful")
        devices = vmanage.get_device_list()
        print(f"Found {len(devices['data'])} devices")
    else:
        print("Login failed")
```

### ThousandEyes Test Creation

```python
#!/usr/bin/env python3
"""
Create ThousandEyes network tests via API
"""

import requests
import json

class ThousandEyesAPI:
    def __init__(self, api_token):
        self.api_token = api_token
        self.base_url = "https://api.thousandeyes.com/v6"
        self.headers = {
            'Authorization': f'Bearer {api_token}',
            'Content-Type': 'application/json'
        }
    
    def create_agent_to_server_test(self, test_name, target, agents):
        """Create agent-to-server network test"""
        url = f"{self.base_url}/tests/agent-to-server/new"
        
        payload = {
            "testName": test_name,
            "interval": 60,
            "server": target,
            "protocol": "ICMP",
            "agents": [{"agentId": agent_id} for agent_id in agents]
        }
        
        response = requests.post(
            url,
            headers=self.headers,
            data=json.dumps(payload)
        )
        
        if response.status_code == 201:
            return response.json()
        else:
            raise Exception(f"Test creation failed: {response.text}")

# Usage
te_api = ThousandEyesAPI(api_token="your-api-token")
test = te_api.create_agent_to_server_test(
    test_name="GCP Vertex AI Latency Test",
    target="10.128.0.10",
    agents=[123456, 789012]  # Enterprise Agent IDs
)
print(f"Created test ID: {test['test'][0]['testId']}")
```

---

## Monitoring & Validation Scripts

### BGP Session Validation

```bash
#!/bin/bash
# BGP Session Health Check

ROUTER_IP="10.100.1.1"
USERNAME="admin"

echo "=== BGP Session Status ==="
ssh ${USERNAME}@${ROUTER_IP} "show ip bgp summary" | grep -v "^$"

echo ""
echo "=== BGP Routes Received ==="
ssh ${USERNAME}@${ROUTER_IP} "show ip bgp neighbors | include Prefixes"

echo ""
echo "=== BGP AS Path ==="
ssh ${USERNAME}@${ROUTER_IP} "show ip bgp | include 10.128.0.0"
```

### IPsec Tunnel Validation

```bash
#!/bin/bash
# IPsec Tunnel Health Check

VMANAGE_URL="https://vmanage.example.com"
API_TOKEN="your-api-token"

# Get tunnel status
curl -k -X GET \
  "${VMANAGE_URL}/dataservice/device/tunnel/statistics" \
  -H "X-XSRF-TOKEN: ${API_TOKEN}" \
  | jq '.data[] | select(.tunnel_state != "up") | {tunnel: .tunnel_name, state: .tunnel_state}'
```

---

## Helper Scripts

### IP Address Calculator

```python
#!/usr/bin/env python3
"""IP subnet calculator for cloud integrations"""

import ipaddress

def calculate_subnets(base_network, num_subnets, new_prefix):
    """Calculate subnet breakdown"""
    network = ipaddress.ip_network(base_network)
    subnets = list(network.subnets(new_prefix=new_prefix))
    
    print(f"Base Network: {base_network}")
    print(f"Requested Subnets: {num_subnets}")
    print(f"New Prefix: /{new_prefix}")
    print("\nSubnet Allocation:")
    
    for i, subnet in enumerate(subnets[:num_subnets]):
        print(f"Subnet {i+1}: {subnet}")
        print(f"  Network: {subnet.network_address}")
        print(f"  Gateway: {list(subnet.hosts())[0]}")
        print(f"  Broadcast: {subnet.broadcast_address}")
        print(f"  Usable Hosts: {subnet.num_addresses - 2}")
        print()

# Example usage
calculate_subnets("10.100.0.0/16", 5, 24)
```

---

## Configuration Validation Checklist

```markdown
# Pre-Deployment Validation

## Network Connectivity
- [ ] DIA circuits tested and operational
- [ ] SD-WAN tunnels established
- [ ] BGP sessions in "Established" state
- [ ] IPsec tunnels showing "up" status
- [ ] Routing tables verified

## Cloud Connectivity
- [ ] GCP Cloud Interconnect provisioned
- [ ] Azure ExpressRoute circuits active
- [ ] BGP peering configured and validated
- [ ] Route advertisement verified

## Security
- [ ] ISE policies deployed
- [ ] Umbrella DNS redirection active
- [ ] MFA enforcement enabled
- [ ] Certificate expiration dates checked

## Monitoring
- [ ] ThousandEyes agents deployed
- [ ] Alerts configured
- [ ] Dashboards created
- [ ] Baseline metrics captured

## Documentation
- [ ] As-built diagrams updated
- [ ] IP addressing spreadsheet current
- [ ] Runbooks validated
- [ ] Contact lists updated
```

---

*Always customize these templates for your specific environment and requirements.*
