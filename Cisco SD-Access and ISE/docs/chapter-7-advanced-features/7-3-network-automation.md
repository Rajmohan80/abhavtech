# 7.3 Network Automation

### 7.3.1 Automation Framework

```
+------------------------------------------------------------------+
|                    DNAC AUTOMATION LAYERS                         |
+------------------------------------------------------------------+

+------------------------------------------------------------------+
|                         INTENT LAYER                              |
|  (Business Intent: "Deploy new site", "Onboard IoT devices")      |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                         POLICY LAYER                              |
|  (Network Policies: VNs, SGTs, Access Control, QoS)               |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                       AUTOMATION LAYER                            |
|  (Templates, Workflows, Scripts, APIs)                            |
+------------------------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                      INFRASTRUCTURE LAYER                         |
|  (Switches, Routers, WLCs, APs, ISE)                              |
+------------------------------------------------------------------+
```

### 7.3.2 Day-0/Day-1/Day-N Automation

| Phase | Activities | DNAC Features |
|-------|------------|---------------|
| Day-0 | Initial device setup, PnP onboarding | Plug and Play, LAN Automation |
| Day-1 | Configuration deployment, policy push | Templates, Fabric provisioning |
| Day-N | Ongoing operations, changes, updates | Command Runner, Software Updates |

### 7.3.3 Plug and Play (PnP) Configuration

```yaml
# Provision > Plug and Play

PnP_Settings:
  Global_Settings:
    Default_Site: Global
    Software_Compliance: Enabled
    Image_Distribution: On-demand
    
  Device_Profiles:
    Edge_Switch_Profile:
      Product_Family: Catalyst 9300
      Software_Image: cat9k_iosxe.17.12.02.SPA.bin
      Template: Edge_Node_Day0
      Site_Assignment: By serial number mapping
      
    Border_Node_Profile:
      Product_Family: Catalyst 9500
      Software_Image: cat9k_iosxe.17.12.02.SPA.bin
      Template: Border_Node_Day0
      Site_Assignment: By serial number mapping

  Serial_Number_Mapping:
    # Pre-populate for new device arrivals
    FCW2345L001: Global/APAC/Mumbai/Building_MUM_HQ/Floor_1
    FCW2345L002: Global/APAC/Mumbai/Building_MUM_HQ/Floor_2
    # ... continue for all devices
```

### 7.3.4 LAN Automation

```yaml
# Provision > LAN Automation

LAN_Automation_Settings:
  Primary_Site: Global/APAC/Mumbai
  
  Discovery_Settings:
    Primary_Device: MUM-BN-01 (seed device)
    Discovery_Protocol: CDP
    Discovery_Depth: 4 hops
    
  Device_Naming:
    Pattern: "{site}-{role}-{number:02d}"
    Example: MUM-ED-01, MUM-ED-02
    
  IP_Pool:
    Management_Pool: 10.252.12.0/24
    P2P_Pool: 10.251.0.0/16
    Loopback_Pool: 10.250.0.0/16
    
  Underlay_Protocol:
    IGP: IS-IS
    Level: Level-2-only
    Authentication: MD5
    BFD: Enabled
```

### 7.3.5 Configuration Templates

**Day-0 Template Example**

```jinja2
{# Day-0 Edge Node Template #}
{# Variables: hostname, management_ip, ntp_server, dns_server #}

hostname {{ hostname }}

! Management Interface
interface Vlan100
 description MANAGEMENT
 ip address {{ management_ip }} 255.255.255.0
 no shutdown

! AAA Configuration
aaa new-model
aaa authentication login default group radius local
aaa authorization exec default group radius local
aaa accounting exec default start-stop group radius

! RADIUS Configuration
radius server ISE-PSN-1
 address ipv4 {{ ise_psn_1 }} auth-port 1812 acct-port 1813
 key {{ radius_key }}
radius server ISE-PSN-2
 address ipv4 {{ ise_psn_2 }} auth-port 1812 acct-port 1813
 key {{ radius_key }}

aaa group server radius RADIUS-GROUP
 server name ISE-PSN-1
 server name ISE-PSN-2

! NTP Configuration
ntp server {{ ntp_server_1 }}
ntp server {{ ntp_server_2 }}

! DNS Configuration
ip name-server {{ dns_server_1 }}
ip name-server {{ dns_server_2 }}
ip domain name corp.local

! Logging
logging host {{ syslog_server }}
logging source-interface Loopback0
logging trap informational

! SNMP
snmp-server community {{ snmp_community }} RO
snmp-server host {{ dnac_ip }} version 2c {{ snmp_community }}

! Save Configuration
end
write memory
```

**Day-N Template Example (Add VLAN)**

```jinja2
{# Day-N Template: Add New VLAN #}
{# Variables: vlan_id, vlan_name, svi_ip, svi_mask #}

vlan {{ vlan_id }}
 name {{ vlan_name }}

{% if svi_ip is defined %}
interface Vlan{{ vlan_id }}
 description {{ vlan_name }}
 ip address {{ svi_ip }} {{ svi_mask }}
 no shutdown
{% endif %}

end
write memory
```

### 7.3.6 Command Runner Automation

```python
#!/usr/bin/env python3
"""
DNAC Command Runner - Bulk Configuration Script
"""

import requests
import json
import time

DNAC_HOST = "https://dnac.corp.local"
USERNAME = "admin"
PASSWORD = "<password>"

def get_auth_token():
    """Get authentication token"""
    url = f"{DNAC_HOST}/dna/system/api/v1/auth/token"
    response = requests.post(url, auth=(USERNAME, PASSWORD), verify=False)
    return response.json()["Token"]

def run_commands(token, device_uuids, commands):
    """Execute commands on multiple devices"""
    url = f"{DNAC_HOST}/dna/intent/api/v1/network-device-poller/cli/read-request"
    
    headers = {
        "X-Auth-Token": token,
        "Content-Type": "application/json"
    }
    
    payload = {
        "commands": commands,
        "deviceUuids": device_uuids,
        "timeout": 0
    }
    
    response = requests.post(url, headers=headers, json=payload, verify=False)
    task_id = response.json()["response"]["taskId"]
    
    return task_id

def get_task_result(token, task_id):
    """Get command execution results"""
    url = f"{DNAC_HOST}/dna/intent/api/v1/task/{task_id}"
    headers = {"X-Auth-Token": token}
    
    # Poll for completion
    for _ in range(30):
        response = requests.get(url, headers=headers, verify=False)
        task = response.json()["response"]
        
        if task["isError"]:
            return {"error": task["failureReason"]}
        
        if "endTime" in task:
            # Get file output
            file_id = json.loads(task["progress"])["fileId"]
            file_url = f"{DNAC_HOST}/dna/intent/api/v1/file/{file_id}"
            file_response = requests.get(file_url, headers=headers, verify=False)
            return file_response.json()
        
        time.sleep(2)
    
    return {"error": "Timeout waiting for task completion"}

def main():
    token = get_auth_token()
    
    # Example: Get interface status on all edge switches
    edge_device_uuids = [
        "device-uuid-1",
        "device-uuid-2",
        # Add device UUIDs
    ]
    
    commands = [
        "show interface status",
        "show authentication sessions"
    ]
    
    task_id = run_commands(token, edge_device_uuids, commands)
    print(f"Task ID: {task_id}")
    
    results = get_task_result(token, task_id)
    print(json.dumps(results, indent=2))

if __name__ == "__main__":
    main()
```

### 7.3.7 Software Image Management (SWIM)

```yaml
# Design > Image Repository

Software_Image_Management:
  
  Golden_Images:
    Catalyst_9500:
      Version: 17.12.2
      Image: cat9k_iosxe.17.12.02.SPA.bin
      MD5: abc123def456...
      Status: Golden
      
    Catalyst_9300:
      Version: 17.12.2
      Image: cat9k_iosxe.17.12.02.SPA.bin
      MD5: abc123def456...
      Status: Golden
      
    Catalyst_9800_WLC:
      Version: 17.12.2
      Image: C9800-80-universalk9_wlc.17.12.02.SPA.bin
      MD5: xyz789...
      Status: Golden
      
  Upgrade_Schedule:
    Site: Mumbai
    Window: Sunday 02:00-06:00 IST
    Strategy: Rolling upgrade
    Batch_Size: 10 devices
    Validation: Health check post-upgrade
    Rollback: Automatic on failure
```

---
