# Chapter 7: Advanced Features & Automation

## Quick Navigation

| Section | Description |
|---------|-------------|
| [7.1 AI/ML Analytics](#71-aiml-analytics-overview) | DNAC AI-driven insights |
| [7.2 Predictive Analytics](#72-predictive-analytics) | Proactive issue detection |
| [7.3 Network Automation](#73-network-automation) | Day-0/Day-1/Day-N automation |
| [7.4 API Integration](#74-api-integration) | REST APIs, webhooks |
| [7.5 SD-WAN Integration](#75-sd-wan-integration-overview) | High-level fabric-to-WAN |
| [7.6 Stealthwatch Integration](#76-stealthwatch-integration) | Network visibility |
| [7.7 ThousandEyes Integration](#77-thousandeyes-integration) | End-to-end visibility |
| [7.8 ITSM Integration](#78-itsm-integration) | ServiceNow, Remedy |
| [7.9 Custom Applications](#79-custom-applications) | Automation workflows |
| [7.10 Future Roadmap](#710-future-roadmap) | Innovation pipeline |

---

## 7.1 AI/ML Analytics Overview

### 7.1.1 DNAC AI-Driven Network Capabilities

```
+------------------------------------------------------------------+
|                    DNAC AI/ML ARCHITECTURE                        |
+------------------------------------------------------------------+

                    +---------------------------+
                    |      AI/ML Engine         |
                    |   (Cloud + On-Premises)   |
                    +---------------------------+
                              |
        +---------------------+---------------------+
        |                     |                     |
+---------------+    +----------------+    +----------------+
| Anomaly       |    | Predictive     |    | Automated      |
| Detection     |    | Analytics      |    | Remediation    |
+---------------+    +----------------+    +----------------+
        |                     |                     |
+---------------+    +----------------+    +----------------+
| Baseline      |    | Trend          |    | Self-Healing   |
| Learning      |    | Forecasting    |    | Actions        |
+---------------+    +----------------+    +----------------+
        |                     |                     |
        +---------------------+---------------------+
                              |
                    +---------------------------+
                    |     Network Telemetry     |
                    | (SNMP, Syslog, NetFlow,   |
                    |  Streaming Telemetry)     |
                    +---------------------------+
```

### 7.1.2 AI/ML Use Cases

| Use Case | Description | Benefit |
|----------|-------------|---------|
| Anomaly Detection | Identifies abnormal patterns in network behavior | Early issue detection |
| Root Cause Analysis | Correlates events to identify underlying issues | Faster MTTR |
| Predictive Insights | Forecasts potential failures before they occur | Proactive maintenance |
| Trend Analysis | Identifies long-term patterns in network usage | Capacity planning |
| Client Experience | Analyzes user connectivity patterns | Improved satisfaction |
| Security Analytics | Detects suspicious traffic patterns | Threat identification |

### 7.1.3 Machine Learning Models

```yaml
ML_Models_in_DNAC:
  
  Baseline_Learning:
    Type: Unsupervised clustering
    Purpose: Establish normal behavior patterns
    Training_Period: 14 days minimum
    Updates: Continuous (rolling window)
    
  Anomaly_Detection:
    Type: Statistical + ML hybrid
    Purpose: Identify deviations from baseline
    Sensitivity: Configurable (Low/Medium/High)
    False_Positive_Rate: <5% target
    
  Predictive_Failure:
    Type: Time-series forecasting
    Purpose: Predict device/link failures
    Horizon: 24-72 hours ahead
    Confidence: >85% accuracy
    
  Root_Cause_Correlation:
    Type: Graph-based reasoning
    Purpose: Correlate multi-source events
    Data_Sources:
      - Syslog events
      - SNMP traps
      - NetFlow anomalies
      - Client connectivity
```

### 7.1.4 Enabling AI Analytics

```yaml
# DNAC Configuration for AI Analytics

# System > Settings > AI Analytics

AI_Analytics_Settings:
  Cloud_Connectivity:
    Enabled: Yes
    Endpoint: analytics.cisco.com
    Data_Sharing: Telemetry only (anonymized)
    
  Baseline_Learning:
    Enabled: Yes
    Learning_Period: 14 days
    Sensitivity: Medium
    
  Anomaly_Detection:
    Enabled: Yes
    Categories:
      - Device health anomalies
      - Client connectivity anomalies
      - Application performance anomalies
      - Security anomalies
    Alert_Threshold: Medium confidence
    
  Predictive_Insights:
    Enabled: Yes
    Forecast_Window: 48 hours
    Notification: Email + Dashboard
```

---

## 7.2 Predictive Analytics

### 7.2.1 Predictive Issue Detection

```
+------------------------------------------------------------------+
|                    PREDICTIVE ANALYTICS FLOW                      |
+------------------------------------------------------------------+

     Telemetry           ML Processing        Prediction
     Collection          & Analysis           & Action
         |                   |                    |
         v                   v                    v
+---------------+    +----------------+    +----------------+
| Device        |    | Pattern        |    | Predicted      |
| Metrics       |--->| Recognition    |--->| Issues         |
| (CPU, Memory, |    | (Baseline      |    | (24-72 hrs)    |
| Errors, etc.) |    | Comparison)    |    |                |
+---------------+    +----------------+    +----------------+
         |                   |                    |
+---------------+    +----------------+    +----------------+
| Client        |    | Trend          |    | Recommended    |
| Connectivity  |--->| Forecasting    |--->| Actions        |
| (Auth, RSSI,  |    | (Time-series)  |    |                |
| Throughput)   |    |                |    |                |
+---------------+    +----------------+    +----------------+
         |                   |                    |
+---------------+    +----------------+    +----------------+
| Application   |    | Correlation    |    | Automated      |
| Performance   |--->| Analysis       |--->| Remediation    |
| (Latency,     |    | (Multi-source) |    | (Optional)     |
| Loss)         |    |                |    |                |
+---------------+    +----------------+    +----------------+
```

### 7.2.2 Predictive Metrics

| Metric Category | Prediction Type | Lead Time | Accuracy |
|-----------------|-----------------|-----------|----------|
| Device CPU | High utilization forecast | 24-48 hours | 87% |
| Memory Usage | Memory exhaustion prediction | 24-48 hours | 89% |
| Link Errors | Interface degradation | 12-24 hours | 82% |
| Wireless Client | Onboarding failure likelihood | 1-4 hours | 78% |
| Authentication | PSN overload prediction | 2-8 hours | 85% |
| Application | Performance degradation | 1-4 hours | 80% |

### 7.2.3 Predictive Dashboard Configuration

```yaml
# Assurance > AI Driven > Predictive Insights

Predictive_Dashboard:
  
  Device_Predictions:
    Display: Top 10 at-risk devices
    Metrics:
      - Predicted CPU exhaustion
      - Memory pressure forecast
      - Temperature trend
    Actions:
      - Create maintenance ticket
      - Schedule proactive reload
      - Alert operations team
      
  Client_Predictions:
    Display: Sites with predicted issues
    Metrics:
      - Onboarding failure probability
      - Roaming issue likelihood
      - DHCP/DNS failure risk
    Actions:
      - Pre-position support resources
      - Adjust wireless parameters
      - Scale PSN capacity
      
  Application_Predictions:
    Display: Applications at risk
    Metrics:
      - Latency degradation forecast
      - Packet loss trend
      - Throughput reduction
    Actions:
      - Adjust QoS policies
      - Reroute traffic
      - Alert application owners
```

---

## 7.3 Network Automation

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

## 7.4 API Integration

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

## 7.5 SD-WAN Integration Overview

### 7.5.1 SD-WAN Integration Architecture

```
+------------------------------------------------------------------+
|                    SD-ACCESS TO SD-WAN INTEGRATION                |
+------------------------------------------------------------------+

     SD-ACCESS FABRIC                      SD-WAN OVERLAY
     (Campus/Branch)                       (WAN Transport)
          |                                      |
          v                                      v
+-------------------+                  +-------------------+
|   Fabric Border   |                  |   SD-WAN Edge     |
|   (C9500)         |<---------------->|   (vEdge/cEdge)   |
+-------------------+   L3 Handoff     +-------------------+
          |            VLAN 3001-3010          |
          |                                     |
+-------------------+                  +-------------------+
|   LISP/VXLAN      |                  |   IPsec/DTLS      |
|   (Overlay)       |                  |   (Transport)     |
+-------------------+                  +-------------------+
          |                                     |
+-------------------+                  +-------------------+
|   IS-IS           |                  |   OMP/BGP         |
|   (Underlay)      |                  |   (Control)       |
+-------------------+                  +-------------------+

INTEGRATION POINTS:
1. Border Node <-> SD-WAN Edge (L3 VRF handoff)
2. Policy: SGT propagation via VRF-aware routing
3. Control: vManage-DNAC API integration
4. Visibility: Unified assurance view
```

### 7.5.2 Transport Design (High-Level)

| Transport | Purpose | Sites | SLA |
|-----------|---------|-------|-----|
| MPLS | Primary WAN (business-critical) | All hub sites | 99.99% |
| Internet | Secondary/backup (general traffic) | All sites | 99.9% |
| 5G/LTE | Tertiary/emergency (failover) | Key branches | 99.5% |

### 7.5.3 Border-to-SD-WAN Handoff

```cisco
! Border Node - SD-WAN Handoff Configuration
! This is the L3 VRF handoff from Fabric Border to SD-WAN Edge

! VRF Definition for SD-WAN handoff
vrf definition SDWAN-TRANSIT
 rd 65001:3001
 address-family ipv4
  route-target export 65001:3001
  route-target import 65001:3001
 exit-address-family

! Handoff Interface to SD-WAN Edge
interface TenGigabitEthernet1/0/48
 description TO-SDWAN-EDGE-01
 no switchport

interface TenGigabitEthernet1/0/48.3001
 description SDWAN-HANDOFF-VN_CORPORATE
 encapsulation dot1Q 3001
 vrf forwarding VN_CORPORATE
 ip address 10.240.1.2 255.255.255.252
 
interface TenGigabitEthernet1/0/48.3002
 description SDWAN-HANDOFF-VN_GUEST
 encapsulation dot1Q 3002
 vrf forwarding VN_GUEST
 ip address 10.240.1.6 255.255.255.252

interface TenGigabitEthernet1/0/48.3003
 description SDWAN-HANDOFF-VN_IOT
 encapsulation dot1Q 3003
 vrf forwarding VN_IOT
 ip address 10.240.1.10 255.255.255.252

! BGP Peering with SD-WAN Edge
router bgp 65001
 address-family ipv4 vrf VN_CORPORATE
  neighbor 10.240.1.1 remote-as 65100
  neighbor 10.240.1.1 description SDWAN-EDGE-01
  neighbor 10.240.1.1 activate
  redistribute lisp metric 100
 exit-address-family
```

### 7.5.4 Policy Propagation

```yaml
# SGT-to-VPN Mapping at SD-WAN Edge

SGT_VPN_Mapping:
  SGT-EMPLOYEES (10):
    VPN: 10
    SLA_Class: Business-Critical
    Policy: Direct-Internet-Access (DIA) disabled
    
  SGT-GUESTS (40):
    VPN: 40
    SLA_Class: Best-Effort
    Policy: DIA enabled (local breakout)
    
  SGT-IOT-SENSORS (50):
    VPN: 50
    SLA_Class: Low-Latency
    Policy: DIA disabled, cloud breakout only
    
  SGT-VOICE (20):
    VPN: 20
    SLA_Class: Real-Time
    Policy: MPLS preferred, low-latency path
```

### 7.5.5 Hub Site Transport Details

**Hub sites retain MPLS as primary with Internet for secondary/overflow traffic.**

| Hub Site | MPLS Circuit | Internet Circuit | 5G Backup | SD-WAN Edge |
|----------|--------------|------------------|-----------|-------------|
| Mumbai | 1 Gbps (Tata) | 500 Mbps (Airtel) | - | ISR 4451 ×2 |
| Chennai | 500 Mbps (Tata) | 500 Mbps (Jio) | - | ISR 4351 ×2 |
| London | 1 Gbps (BT) | 500 Mbps (Virgin) | - | ISR 4451 ×2 |
| Frankfurt | 500 Mbps (DT) | 500 Mbps (Vodafone) | - | ISR 4351 ×2 |
| New Jersey | 1 Gbps (AT&T) | 1 Gbps (Verizon) | - | ISR 4451 ×2 |
| Dallas | 500 Mbps (AT&T) | 500 Mbps (Spectrum) | - | ISR 4351 ×2 |

### 7.5.6 Branch Site Transport Details

**Branch sites migrate from MPLS to Internet-primary with 5G/LTE backup.**

| Branch Type | Sites | Primary Transport | Secondary Transport | SD-WAN Edge |
|-------------|-------|-------------------|---------------------|-------------|
| Large Branch | Bangalore, Delhi | Internet 200 Mbps | 5G 100 Mbps | ISR 4331 |
| Medium Branch | Noida + 10 EMEA | Internet 100 Mbps | LTE 50 Mbps | ISR 1100-4G |
| Small Branch | 15 US + 5 EMEA | Internet 50 Mbps | LTE 30 Mbps | ISR 1100-4GLTENA |
| Remote/Temp | As needed | 5G 50 Mbps | - | IR 1101 |

**Branch MPLS Circuit Decommissioning Schedule**

| Phase | Sites | MPLS Status | Internet Status | 5G Status |
|-------|-------|-------------|-----------------|-----------|
| Phase 2 (Pilot) | Bangalore | Active | Add 200 Mbps | Add 5G |
| Phase 3 (Hubs) | - | Active (all hubs) | Add circuits | - |
| Phase 4 (Branches) | All branches | Decommission | Primary | Active |
| Phase 5 (Optimize) | All | Hub-only MPLS | All sites | All branches |

**Expected WAN Cost Savings (Post-Migration)**

| Current Cost | Target Cost | Monthly Savings | Annual Savings |
|--------------|-------------|-----------------|----------------|
| $X,XXX/mo | $X,XXX/mo | $X,XXX/mo | $X,XXX/yr |

*Savings from replacing expensive MPLS circuits at branches with Internet + 5G*

### 7.5.7 SD-WAN Integration Scope

| Aspect | Covered in This Document | Separate SD-WAN Project |
|--------|--------------------------|-------------------------|
| Border-to-Edge handoff | Yes (L3 VRF) | Full design |
| SGT propagation | Yes (high-level) | Detailed policy |
| Transport selection | Yes (overview) | Full SLA design |
| vManage-DNAC API | Yes (reference) | Integration scripts |
| Application policy | No | Complete design |
| Security policy | No | Complete design |
| Cloud onramp | No | Complete design |

---

## 7.6 Stealthwatch Integration

### 7.6.1 Stealthwatch Architecture

```
+------------------------------------------------------------------+
|                    STEALTHWATCH INTEGRATION                       |
+------------------------------------------------------------------+

Network Devices              Stealthwatch              DNAC/ISE
(NetFlow Source)            (Analytics)               (Context)

+---------------+        +------------------+       +-------------+
| Fabric Nodes  |------->| Stealthwatch     |<----->| DNAC        |
| (NetFlow)     |        | Management       |       | (Assurance) |
+---------------+        | Console (SMC)    |       +-------------+
       |                 +------------------+              |
       |                        |                          |
+---------------+        +------------------+       +-------------+
| Border Nodes  |------->| Flow Collector   |<----->| ISE         |
| (NetFlow)     |        | (FC)             |       | (pxGrid)    |
+---------------+        +------------------+       +-------------+
       |                        |
       |                        v
+---------------+        +------------------+
| WAN Routers   |------->| Flow Sensor      |
| (NetFlow)     |        | (FS)             |
+---------------+        +------------------+
                                |
                                v
                         +------------------+
                         | UDP Director     |
                         | (Load Balance)   |
                         +------------------+
```

### 7.6.2 NetFlow Configuration for Stealthwatch

```cisco
! NetFlow Configuration on Fabric Nodes

flow exporter STEALTHWATCH
 destination 10.252.50.10
 source Loopback0
 transport udp 2055
 template data timeout 60
 option interface-table
 option exporter-stats
 option application-table

flow record STEALTHWATCH-RECORD
 match ipv4 source address
 match ipv4 destination address
 match transport source-port
 match transport destination-port
 match ipv4 protocol
 match ipv4 tos
 match interface input
 match flow direction
 collect counter bytes long
 collect counter packets long
 collect timestamp sys-uptime first
 collect timestamp sys-uptime last
 collect application name

flow monitor STEALTHWATCH-MONITOR
 exporter STEALTHWATCH
 record STEALTHWATCH-RECORD
 cache timeout active 60
 cache timeout inactive 15

! Apply to all interfaces
interface range GigabitEthernet1/0/1-48
 ip flow monitor STEALTHWATCH-MONITOR input
 ip flow monitor STEALTHWATCH-MONITOR output
```

### 7.6.3 ISE-Stealthwatch pxGrid Integration

```yaml
# ISE pxGrid Configuration for Stealthwatch

pxGrid_Integration:
  ISE_Settings:
    # Administration > pxGrid Services
    Enable_pxGrid: Yes
    
  Stealthwatch_Client:
    Name: Stealthwatch-SMC
    Client_Certificate: stealthwatch-smc.corp.local.pem
    Topics_Subscribed:
      - Session Directory
      - Endpoint Profile
      - TrustSec Configuration
      
  Data_Exchange:
    ISE_to_Stealthwatch:
      - User identity (username)
      - Endpoint MAC address
      - SGT assignment
      - Device profile
      - Session state
      
    Stealthwatch_to_ISE:
      - Threat indicators
      - Anomaly detection
      - Rapid Threat Containment (RTC)
```

### 7.6.4 Threat Detection Use Cases

| Use Case | Detection Method | Response |
|----------|------------------|----------|
| Malware C2 | Known bad IP/domain | Quarantine endpoint (ISE) |
| Data exfiltration | Unusual outbound volume | Alert + investigate |
| Lateral movement | Internal scanning patterns | Micro-segment (SGT) |
| Crypto mining | CPU/network signature | Block + remediate |
| DDoS participation | Outbound flood patterns | Rate limit + alert |
| Insider threat | Abnormal user behavior | Monitor + escalate |

---

## 7.7 ThousandEyes Integration

### 7.7.1 ThousandEyes Deployment

```
+------------------------------------------------------------------+
|                    THOUSANDEYES INTEGRATION                       |
+------------------------------------------------------------------+

                    ThousandEyes Cloud Platform
                    +-------------------------+
                    |   ThousandEyes Portal   |
                    |   (Analytics & Alerts)  |
                    +-------------------------+
                              |
        +---------------------+---------------------+
        |                     |                     |
+---------------+    +----------------+    +----------------+
| Cloud Agents  |    | Enterprise     |    | Endpoint       |
| (Internet     |    | Agents         |    | Agents         |
| Visibility)   |    | (On-Prem)      |    | (User Device)  |
+---------------+    +----------------+    +----------------+
        |                     |                     |
        v                     v                     v
+---------------+    +----------------+    +----------------+
| SaaS Apps     |    | DC/Cloud       |    | Client         |
| Internet      |    | Applications   |    | Experience     |
| Path          |    | Internal Path  |    | Monitoring     |
+---------------+    +----------------+    +----------------+
```

### 7.7.2 Enterprise Agent Deployment

```yaml
# ThousandEyes Enterprise Agent Locations

Enterprise_Agents:
  Mumbai_DC:
    Agent_Name: TE-MUM-DC-01
    Type: Virtual Appliance
    Location: Mumbai Data Center
    IP: 10.252.60.11
    Tests:
      - Internal application monitoring
      - DNAC/ISE reachability
      - WAN path visualization
      
  London_DC:
    Agent_Name: TE-LON-DC-01
    Type: Virtual Appliance
    Location: London Data Center
    IP: 10.252.60.21
    Tests:
      - Cross-region connectivity
      - SaaS application access
      - Internet path analysis
      
  New_Jersey_DC:
    Agent_Name: TE-NJ-DC-01
    Type: Virtual Appliance
    Location: New Jersey Data Center
    IP: 10.252.60.31
    Tests:
      - Primary DC monitoring
      - Cloud provider connectivity
      - Global path analysis
```

### 7.7.3 DNAC-ThousandEyes Integration

```yaml
# System > Settings > External Services > ThousandEyes

ThousandEyes_Integration:
  Enable: Yes
  API_Token: <thousandeyes_api_token>
  Account_Group: Enterprise-SD-Access
  
  Test_Mappings:
    DNAC_to_ThousandEyes:
      Site: Mumbai
      ThousandEyes_Agent: TE-MUM-DC-01
      Tests:
        - HTTP Server (DNAC GUI)
        - HTTP Server (ISE GUI)
        - Network (Internal Apps)
        
  Dashboard_Integration:
    Display_in_Assurance: Yes
    Correlation: Enabled
    Alert_Sync: Bidirectional
```

---

## 7.8 ITSM Integration

### 7.8.1 ServiceNow Integration

```
+------------------------------------------------------------------+
|                    SERVICENOW INTEGRATION                         |
+------------------------------------------------------------------+

DNAC                          ServiceNow                Operations
+---------------+            +---------------+         +-------------+
|               |   Webhook  |               |         |             |
| Issue         |----------->| Incident      |-------->| NOC         |
| Detection     |            | Creation      |         | Dashboard   |
|               |            |               |         |             |
+---------------+            +---------------+         +-------------+
       |                            |                        |
       v                            v                        v
+---------------+            +---------------+         +-------------+
| Assurance     |   API      | CMDB          |         | Ticket      |
| Data          |----------->| Update        |         | Workflow    |
|               |            |               |         |             |
+---------------+            +---------------+         +-------------+
       |                            |                        |
       v                            v                        v
+---------------+            +---------------+         +-------------+
| Resolution    |   Webhook  | Incident      |         | Auto        |
| Confirmation  |<-----------| Closure       |<--------| Resolution  |
|               |            |               |         |             |
+---------------+            +---------------+         +-------------+
```

### 7.8.2 ServiceNow Integration Configuration

```yaml
# Platform > Developer Toolkit > ServiceNow Integration

ServiceNow_Settings:
  Instance: company.service-now.com
  API_Version: v2
  Authentication:
    Type: OAuth 2.0
    Client_ID: <client_id>
    Client_Secret: <client_secret>
    
  Incident_Mapping:
    DNAC_Priority_P1:
      ServiceNow_Priority: 1
      ServiceNow_Impact: 1
      ServiceNow_Urgency: 1
      Assignment_Group: Network-Critical
      
    DNAC_Priority_P2:
      ServiceNow_Priority: 2
      ServiceNow_Impact: 2
      ServiceNow_Urgency: 2
      Assignment_Group: Network-Operations
      
    DNAC_Priority_P3:
      ServiceNow_Priority: 3
      ServiceNow_Impact: 2
      ServiceNow_Urgency: 3
      Assignment_Group: Network-Support
      
  CMDB_Sync:
    Enable: Yes
    Sync_Interval: 4 hours
    Fields:
      - Device Name
      - IP Address
      - Serial Number
      - Software Version
      - Location
      - Role (Border/CP/Edge)
```

### 7.8.3 Webhook Payload Example

```json
{
  "eventId": "DEVICE_UNREACHABLE",
  "instanceId": "uuid-12345",
  "severity": "P1",
  "category": "Device",
  "type": "Network",
  "name": "MUM-ED-01 Unreachable",
  "description": "Device MUM-ED-01 is not responding to SNMP/ICMP",
  "timestamp": "2025-12-26T08:30:00Z",
  "details": {
    "deviceName": "MUM-ED-01",
    "deviceId": "device-uuid-001",
    "deviceIp": "10.252.12.5",
    "deviceType": "Catalyst 9300",
    "site": "Global/APAC/Mumbai/Building_MUM_HQ/Floor_1",
    "lastSeen": "2025-12-26T08:25:00Z",
    "impactedClients": 45
  },
  "suggestedActions": [
    "Check physical connectivity",
    "Verify power status",
    "Check upstream switch port"
  ]
}
```

---

## 7.9 Custom Applications

### 7.9.1 Automation Workflow Examples

**Workflow 1: Automated Guest VLAN Provisioning**

```python
#!/usr/bin/env python3
"""
Automated Guest VLAN Provisioning Workflow
Triggered by: New branch site request
"""

import requests
import json

DNAC_HOST = "https://dnac.corp.local"
ISE_HOST = "https://ise-pan-nj.corp.local:9060"

def provision_guest_network(site_name, vlan_id, ip_pool):
    """
    End-to-end guest network provisioning
    1. Create IP pool in DNAC
    2. Add pool to VN_GUEST
    3. Create guest portal in ISE
    4. Configure authorization policy
    """
    
    # Step 1: Create IP Pool in DNAC
    create_ip_pool(site_name, ip_pool)
    
    # Step 2: Add to VN_GUEST in fabric
    add_pool_to_vn(site_name, "VN_GUEST", ip_pool)
    
    # Step 3: Configure ISE guest portal
    create_guest_portal(site_name)
    
    # Step 4: Update authorization policy
    update_auth_policy(site_name)
    
    return {"status": "success", "site": site_name}

def create_ip_pool(site_name, ip_pool):
    """Create IP pool in DNAC"""
    # Implementation
    pass

def add_pool_to_vn(site_name, vn_name, ip_pool):
    """Add IP pool to Virtual Network"""
    # Implementation
    pass

def create_guest_portal(site_name):
    """Create guest portal in ISE"""
    # Implementation
    pass

def update_auth_policy(site_name):
    """Update ISE authorization policy"""
    # Implementation
    pass
```

**Workflow 2: Automated Endpoint Onboarding**

```python
#!/usr/bin/env python3
"""
Automated IoT Device Onboarding Workflow
Triggered by: New IoT device MAC registration
"""

def onboard_iot_device(mac_address, device_type, location):
    """
    IoT device onboarding workflow
    1. Add to ISE endpoint database
    2. Assign profile based on device type
    3. Assign to appropriate SGT
    4. Update authorization policy
    5. Notify operations team
    """
    
    # Determine profile and SGT based on device type
    profile_mapping = {
        "sensor": {"profile": "IoT-Building-Sensor", "sgt": "SGT-IOT-SENSORS"},
        "camera": {"profile": "IP-Camera", "sgt": "SGT-CAMERAS"},
        "hvac": {"profile": "HVAC-Controller", "sgt": "SGT-OT-DEVICES"},
        "printer": {"profile": "Printer", "sgt": "SGT-PRINTERS"}
    }
    
    config = profile_mapping.get(device_type, {"profile": "Unknown", "sgt": "SGT-QUARANTINE"})
    
    # Add endpoint to ISE
    add_endpoint_to_ise(mac_address, config["profile"])
    
    # Assign SGT
    assign_sgt(mac_address, config["sgt"])
    
    # Notify operations
    send_notification(mac_address, device_type, location, config["sgt"])
    
    return {"status": "onboarded", "mac": mac_address, "sgt": config["sgt"]}
```

### 7.9.2 Custom Dashboard Development

```python
#!/usr/bin/env python3
"""
Custom Executive Dashboard - Flask Application
"""

from flask import Flask, render_template, jsonify
import requests
from datetime import datetime

app = Flask(__name__)

DNAC_HOST = "https://dnac.corp.local"
ISE_HOST = "https://ise-pan-nj.corp.local:9060"

@app.route('/api/dashboard/summary')
def get_dashboard_summary():
    """Get executive dashboard summary"""
    
    summary = {
        "timestamp": datetime.now().isoformat(),
        "network_health": get_network_health(),
        "client_health": get_client_health(),
        "authentication": get_auth_summary(),
        "issues": get_active_issues(),
        "sites": get_site_status()
    }
    
    return jsonify(summary)

@app.route('/api/dashboard/sites/<site_name>')
def get_site_details(site_name):
    """Get detailed site information"""
    
    details = {
        "site": site_name,
        "devices": get_site_devices(site_name),
        "clients": get_site_clients(site_name),
        "health_score": get_site_health(site_name),
        "issues": get_site_issues(site_name)
    }
    
    return jsonify(details)

@app.route('/api/dashboard/compliance')
def get_compliance_status():
    """Get compliance dashboard"""
    
    compliance = {
        "posture_compliant": get_posture_compliance(),
        "software_compliant": get_software_compliance(),
        "policy_compliant": get_policy_compliance(),
        "certificate_status": get_certificate_status()
    }
    
    return jsonify(compliance)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

---

## 7.10 Future Roadmap

### 7.10.1 Innovation Pipeline

| Timeline | Feature | Description | Impact |
|----------|---------|-------------|--------|
| Q1 2025 | AI-Driven Remediation | Automated issue resolution | Reduced MTTR 50% |
| Q2 2025 | Extended Node Expansion | IoT/OT fabric extension | Broader coverage |
| Q3 2025 | Multi-Cloud Integration | AWS/Azure fabric extension | Hybrid cloud |
| Q4 2025 | Zero Trust 2.0 | Continuous verification | Enhanced security |
| Q1 2026 | 6GHz Wi-Fi (Wi-Fi 6E) | New AP deployment | Higher capacity |
| Q2 2026 | Digital Twin | Network simulation | Change validation |

### 7.10.2 Technology Evolution

```
+------------------------------------------------------------------+
|                    TECHNOLOGY EVOLUTION ROADMAP                   |
+------------------------------------------------------------------+

2025 H1                 2025 H2                 2026+
+----------------+      +----------------+      +----------------+
| Current State  |      | Enhanced       |      | Future State   |
+----------------+      +----------------+      +----------------+
| SD-Access 2.x  | ---> | SD-Access 3.x  | ---> | SD-Access 4.x  |
| ISE 3.2        | ---> | ISE 3.4        | ---> | ISE 4.x        |
| DNAC 2.3       | ---> | DNAC 2.4       | ---> | DNAC 3.x       |
| Wi-Fi 6        | ---> | Wi-Fi 6E       | ---> | Wi-Fi 7        |
| Cat 9300/9500  | ---> | Cat 9400/9600  | ---> | Next-Gen       |
+----------------+      +----------------+      +----------------+
         |                      |                      |
         v                      v                      v
+----------------+      +----------------+      +----------------+
| Micro-segment  |      | Intent-Based   |      | Autonomous     |
| Policy         |      | Assurance      |      | Network        |
+----------------+      +----------------+      +----------------+
```

### 7.10.3 Continuous Improvement Process

```yaml
Continuous_Improvement:
  
  Quarterly_Reviews:
    - Network health trending
    - Security posture assessment
    - Capacity utilization analysis
    - User satisfaction survey
    
  Annual_Initiatives:
    - Technology refresh planning
    - License optimization
    - Training program update
    - Vendor relationship review
    
  Innovation_Pilots:
    - New feature evaluation (lab)
    - Limited production testing
    - Business case development
    - Phased rollout plan
```

---

## Summary

Chapter 7 covers advanced features and automation capabilities:

1. **AI/ML Analytics**: DNAC's machine learning for anomaly detection and prediction
2. **Predictive Analytics**: Proactive issue detection with 24-72 hour forecasting
3. **Network Automation**: Day-0/Day-1/Day-N automation with PnP and templates
4. **API Integration**: REST APIs, webhooks, and automation scripts
5. **SD-WAN Integration**: High-level border-to-edge handoff design
6. **Stealthwatch Integration**: Network visibility and threat detection
7. **ThousandEyes Integration**: End-to-end path visibility
8. **ITSM Integration**: ServiceNow incident automation
9. **Custom Applications**: Workflow examples and dashboard development
10. **Future Roadmap**: Technology evolution and innovation pipeline

**Note**: SD-WAN detailed design is out of scope for this document and will be covered in a separate project.

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use Only*
