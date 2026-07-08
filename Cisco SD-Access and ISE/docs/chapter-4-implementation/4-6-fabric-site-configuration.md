# 4.6 Fabric Site Configuration and Overlay Provisioning

## 4.6.1 Site Hierarchy Creation in DNAC

### Complete Site Hierarchy Structure

```yaml
# Design > Network Hierarchy
# Complete hierarchy for all regions

Global:
  ├── APAC:
  │   ├── Mumbai:
  │   │   └── Building_MUM_HQ:
  │   │       ├── Floor_1 (Endpoints: 240)
  │   │       ├── Floor_2 (Endpoints: 240)
  │   │       ├── Floor_3 (Endpoints: 240)
  │   │       ├── Floor_4 (Endpoints: 240)
  │   │       ├── Floor_5 (Endpoints: 240)
  │   │       ├── Floor_6 (Endpoints: 240)
  │   │       └── Data_Center (Servers: 200)
  │   │
  │   ├── Chennai:
  │   │   └── Building_CHN_HQ:
  │   │       ├── Floor_1 (Endpoints: 200)
  │   │       ├── Floor_2 (Endpoints: 200)
  │   │       ├── Floor_3 (Endpoints: 200)
  │   │       ├── Floor_4 (Endpoints: 200)
  │   │       └── Data_Center (Servers: 150)
  │   │
  │   ├── Bangalore:
  │   │   └── Building_BLR_BR1 (Endpoints: 150)
  │   │
  │   ├── Delhi:
  │   │   └── Building_DEL_BR1 (Endpoints: 120)
  │   │
  │   └── Noida:
  │       └── Building_NOI_BR1 (Endpoints: 60)
  │
  ├── EMEA:
  │   ├── London:
  │   │   └── Building_LON_HQ:
  │   │       ├── Floor_1 (Endpoints: 220)
  │   │       ├── Floor_2 (Endpoints: 220)
  │   │       ├── Floor_3 (Endpoints: 220)
  │   │       ├── Floor_4 (Endpoints: 220)
  │   │       └── Data_Center (Servers: 180)
  │   │
  │   ├── Frankfurt:
  │   │   └── Building_FRA_HQ:
  │   │       ├── Floor_1 (Endpoints: 180)
  │   │       ├── Floor_2 (Endpoints: 180)
  │   │       ├── Floor_3 (Endpoints: 180)
  │   │       └── Data_Center (Servers: 120)
  │   │
  │   ├── Paris:
  │   │   └── Building_PAR_BR1 (Endpoints: 100)
  │   │
  │   ├── Amsterdam:
  │   │   └── Building_AMS_BR1 (Endpoints: 80)
  │   │
  │   ├── Dublin:
  │   │   └── Building_DUB_BR1 (Endpoints: 80)
  │   │
  │   ├── Madrid:
  │   │   └── Building_MAD_BR1 (Endpoints: 60)
  │   │
  │   └── Milan:
  │       └── Building_MIL_BR1 (Endpoints: 60)
  │
  └── Americas:
      ├── New_Jersey:
      │   └── Building_NJ_HQ:
      │       ├── Floor_1 (Endpoints: 250)
      │       ├── Floor_2 (Endpoints: 250)
      │       ├── Floor_3 (Endpoints: 250)
      │       ├── Floor_4 (Endpoints: 250)
      │       ├── Floor_5 (Endpoints: 250)
      │       └── Data_Center (Servers: 250)
      │
      ├── Dallas:
      │   └── Building_DAL_HQ:
      │       ├── Floor_1 (Endpoints: 200)
      │       ├── Floor_2 (Endpoints: 200)
      │       ├── Floor_3 (Endpoints: 200)
      │       └── Data_Center (Servers: 150)
      │
      ├── Chicago:
      │   └── Building_CHI_BR1 (Endpoints: 100)
      │
      ├── Seattle:
      │   └── Building_SEA_BR1 (Endpoints: 80)
      │
      ├── Los_Angeles:
      │   └── Building_LAX_BR1 (Endpoints: 80)
      │
      ├── Atlanta:
      │   └── Building_ATL_BR1 (Endpoints: 60)
      │
      └── Denver:
          └── Building_DEN_BR1 (Endpoints: 50)
```

### Site Creation via DNAC API

```python
#!/usr/bin/env python3
"""
DNAC Site Hierarchy Creation Script
"""

import requests
import json

DNAC_HOST = "10.252.10.10"
DNAC_USER = "admin"
DNAC_PASS = "xxxxx"

# Site hierarchy definition
SITES = {
    "APAC": {
        "Mumbai": {
            "type": "building",
            "address": "123 Business Park, Mumbai, India",
            "floors": ["Floor_1", "Floor_2", "Floor_3", "Floor_4", "Floor_5", "Floor_6", "Data_Center"]
        },
        "Chennai": {
            "type": "building",
            "address": "456 Tech Park, Chennai, India",
            "floors": ["Floor_1", "Floor_2", "Floor_3", "Floor_4", "Data_Center"]
        },
        "Bangalore": {
            "type": "building",
            "address": "789 IT Park, Bangalore, India",
            "floors": []
        },
        "Delhi": {
            "type": "building",
            "address": "101 Corporate Park, Delhi, India",
            "floors": []
        },
        "Noida": {
            "type": "building",
            "address": "202 Business Center, Noida, India",
            "floors": []
        }
    },
    "EMEA": {
        "London": {
            "type": "building",
            "address": "10 Canary Wharf, London, UK",
            "floors": ["Floor_1", "Floor_2", "Floor_3", "Floor_4", "Data_Center"]
        },
        "Frankfurt": {
            "type": "building",
            "address": "20 Financial District, Frankfurt, Germany",
            "floors": ["Floor_1", "Floor_2", "Floor_3", "Data_Center"]
        }
        # ... additional sites
    },
    "Americas": {
        "New_Jersey": {
            "type": "building",
            "address": "100 Corporate Blvd, Newark, NJ, USA",
            "floors": ["Floor_1", "Floor_2", "Floor_3", "Floor_4", "Floor_5", "Data_Center"]
        },
        "Dallas": {
            "type": "building",
            "address": "200 Tech Center, Dallas, TX, USA",
            "floors": ["Floor_1", "Floor_2", "Floor_3", "Data_Center"]
        }
        # ... additional sites
    }
}

def get_auth_token():
    """Get DNAC authentication token"""
    url = f"https://{DNAC_HOST}/dna/system/api/v1/auth/token"
    response = requests.post(url, auth=(DNAC_USER, DNAC_PASS), verify=False)
    return response.json()["Token"]

def create_site(token, site_name, parent_path, site_type, address=None):
    """Create a site in DNAC"""
    url = f"https://{DNAC_HOST}/dna/intent/api/v1/site"
    headers = {
        "X-Auth-Token": token,
        "Content-Type": "application/json"
    }
    
    payload = {
        "type": site_type,
        "site": {
            site_type: {
                "name": site_name,
                "parentName": parent_path
            }
        }
    }
    
    if address and site_type == "building":
        payload["site"]["building"]["address"] = address
    
    response = requests.post(url, headers=headers, json=payload, verify=False)
    return response.json()

def main():
    token = get_auth_token()
    
    # Create regions
    for region in SITES:
        print(f"Creating region: {region}")
        create_site(token, region, "Global", "area")
        
        # Create cities/buildings
        for city, details in SITES[region].items():
            print(f"  Creating city: {city}")
            create_site(token, city, f"Global/{region}", "area")
            
            # Create building
            building_name = f"Building_{city[:3].upper()}_HQ"
            create_site(token, building_name, f"Global/{region}/{city}", 
                       "building", details.get("address"))
            
            # Create floors
            for floor in details.get("floors", []):
                print(f"    Creating floor: {floor}")
                create_site(token, floor, 
                           f"Global/{region}/{city}/{building_name}", "floor")

if __name__ == "__main__":
    main()
```

---

## 4.6.2 Network Settings Configuration

### Global Network Settings

```yaml
# Design > Network Settings > Global

Global_Network_Settings:
  
  # AAA Settings
  AAA:
    Server_Type: ISE
    Primary_Server: 10.252.30.10
    Secondary_Server: 10.252.30.11
    Protocol: RADIUS
    Shared_Secret: <encrypted>
    Authentication_Port: 1812
    Accounting_Port: 1813
  
  # DHCP Settings
  DHCP:
    # Inherited per site - see site overrides
    
  # DNS Settings
  DNS:
    Domain_Name: corp.local
    Primary_Server: 10.252.1.20
    Secondary_Server: 10.252.1.21
    
  # NTP Settings  
  NTP:
    Primary_Server: 10.252.1.10
    Secondary_Server: 10.252.1.11
    
  # Syslog Settings
  Syslog:
    Primary_Server: 10.252.10.30
    Protocol: UDP
    Port: 514
    
  # SNMP Settings
  SNMP:
    Version: v2c
    Read_Community: <encrypted>
    Write_Community: <encrypted>
    Trap_Server: 10.252.10.30
    
  # NetFlow Settings
  NetFlow:
    Collector: 10.252.10.30
    Port: 9996
```

### Site-Specific Network Settings

```yaml
# Design > Network Settings > Site Overrides

# APAC Sites
Site_Mumbai:
  Path: Global/APAC/Mumbai
  DHCP_Servers:
    - 10.10.0.10
    - 10.10.0.11
  Timezone: Asia/Kolkata
  
Site_Chennai:
  Path: Global/APAC/Chennai
  DHCP_Servers:
    - 10.10.16.10
    - 10.10.16.11
  Timezone: Asia/Kolkata

Site_Bangalore:
  Path: Global/APAC/Bangalore
  DHCP_Servers:
    - 10.10.0.10  # Uses Mumbai DHCP (relay)
  Timezone: Asia/Kolkata

Site_Delhi:
  Path: Global/APAC/Delhi
  DHCP_Servers:
    - 10.10.0.10  # Uses Mumbai DHCP (relay)
  Timezone: Asia/Kolkata

Site_Noida:
  Path: Global/APAC/Noida
  DHCP_Servers:
    - 10.10.0.10  # Uses Mumbai DHCP (relay)
  Timezone: Asia/Kolkata

# EMEA Sites
Site_London:
  Path: Global/EMEA/London
  DHCP_Servers:
    - 10.20.0.10
    - 10.20.0.11
  Timezone: Europe/London
  
Site_Frankfurt:
  Path: Global/EMEA/Frankfurt
  DHCP_Servers:
    - 10.20.16.10
    - 10.20.16.11
  Timezone: Europe/Berlin

# Americas Sites
Site_NewJersey:
  Path: Global/Americas/New_Jersey
  DHCP_Servers:
    - 10.30.0.10
    - 10.30.0.11
  Timezone: America/New_York
  
Site_Dallas:
  Path: Global/Americas/Dallas
  DHCP_Servers:
    - 10.30.16.10
    - 10.30.16.11
  Timezone: America/Chicago
```

---

## 4.6.3 IP Pool Reservation

### IP Pool Creation in DNAC

```yaml
# Design > Network Settings > IP Address Pools

# Global IP Pool Reservations
Global_Pools:
  
  # VN_CORPORATE Pools (10.100.0.0/16 - 10.109.0.0/16)
  CORPORATE_GLOBAL:
    Type: Generic
    Network: 10.100.0.0/14
    Gateway: N/A (subpools)
    
  # VN_GUEST Pools (10.200.0.0/16 - 10.209.0.0/16)
  GUEST_GLOBAL:
    Type: Generic
    Network: 10.200.0.0/14
    Gateway: N/A (subpools)
    
  # VN_IOT Pools (10.150.0.0/16 - 10.159.0.0/16)
  IOT_GLOBAL:
    Type: Generic
    Network: 10.150.0.0/14
    Gateway: N/A (subpools)
    
  # VN_SERVERS Pools (10.180.0.0/16 - 10.189.0.0/16)
  SERVERS_GLOBAL:
    Type: Generic
    Network: 10.180.0.0/14
    Gateway: N/A (subpools)
    
  # VN_VOICE Pools (10.190.0.0/16 - 10.199.0.0/16)
  VOICE_GLOBAL:
    Type: Generic
    Network: 10.190.0.0/14
    Gateway: N/A (subpools)
```

### Site-Specific IP Pool Subpools - Mumbai

```yaml
# Design > Network Settings > IP Address Pools > Mumbai

Mumbai_IP_Pools:

  # VN_CORPORATE Subpools
  CORP-MUM-F1:
    Parent_Pool: CORPORATE_GLOBAL
    Type: LAN
    Network: 10.100.1.0/24
    Gateway: 10.100.1.1
    DHCP_Server: 10.10.0.10
    DNS_Servers: 
      - 10.252.1.20
      - 10.252.1.21
    DHCP_Range: 10.100.1.10 - 10.100.1.250
    Reserved:
      - 10.100.1.1 (Gateway)
      - 10.100.1.2-9 (Infrastructure)
      
  CORP-MUM-F2:
    Parent_Pool: CORPORATE_GLOBAL
    Type: LAN
    Network: 10.100.2.0/24
    Gateway: 10.100.2.1
    DHCP_Server: 10.10.0.10
    DHCP_Range: 10.100.2.10 - 10.100.2.250
    
  CORP-MUM-F3:
    Parent_Pool: CORPORATE_GLOBAL
    Type: LAN
    Network: 10.100.3.0/24
    Gateway: 10.100.3.1
    DHCP_Server: 10.10.0.10
    DHCP_Range: 10.100.3.10 - 10.100.3.250
    
  CORP-MUM-F4:
    Parent_Pool: CORPORATE_GLOBAL
    Type: LAN
    Network: 10.100.4.0/24
    Gateway: 10.100.4.1
    DHCP_Server: 10.10.0.10
    DHCP_Range: 10.100.4.10 - 10.100.4.250
    
  CORP-MUM-F5:
    Parent_Pool: CORPORATE_GLOBAL
    Type: LAN
    Network: 10.100.5.0/24
    Gateway: 10.100.5.1
    DHCP_Server: 10.10.0.10
    DHCP_Range: 10.100.5.10 - 10.100.5.250
    
  CORP-MUM-F6:
    Parent_Pool: CORPORATE_GLOBAL
    Type: LAN
    Network: 10.100.6.0/24
    Gateway: 10.100.6.1
    DHCP_Server: 10.10.0.10
    DHCP_Range: 10.100.6.10 - 10.100.6.250

  # VN_GUEST Subpools
  GUEST-MUM:
    Parent_Pool: GUEST_GLOBAL
    Type: LAN
    Network: 10.200.1.0/24
    Gateway: 10.200.1.1
    DHCP_Server: 10.10.0.10
    DHCP_Range: 10.200.1.10 - 10.200.1.250
    
  # VN_IOT Subpools
  IOT-MUM-SENSORS:
    Parent_Pool: IOT_GLOBAL
    Type: LAN
    Network: 10.150.1.0/25
    Gateway: 10.150.1.1
    DHCP_Server: 10.10.0.10
    DHCP_Range: 10.150.1.10 - 10.150.1.120
    
  IOT-MUM-CAMERAS:
    Parent_Pool: IOT_GLOBAL
    Type: LAN
    Network: 10.150.1.128/25
    Gateway: 10.150.1.129
    DHCP_Server: 10.10.0.10
    DHCP_Range: 10.150.1.140 - 10.150.1.250
    
  IOT-MUM-OT:
    Parent_Pool: IOT_GLOBAL
    Type: LAN
    Network: 10.150.2.0/24
    Gateway: 10.150.2.1
    DHCP_Server: 10.10.0.10
    DHCP_Range: 10.150.2.10 - 10.150.2.200
    
  # VN_SERVERS Subpools
  SRV-MUM-PROD:
    Parent_Pool: SERVERS_GLOBAL
    Type: LAN
    Network: 10.180.1.0/24
    Gateway: 10.180.1.1
    DHCP_Server: N/A (Static)
    Reserved: 10.180.1.1-9
    
  SRV-MUM-DEV:
    Parent_Pool: SERVERS_GLOBAL
    Type: LAN
    Network: 10.180.2.0/24
    Gateway: 10.180.2.1
    DHCP_Server: 10.10.0.10
    DHCP_Range: 10.180.2.10 - 10.180.2.200
    
  SRV-MUM-DMZ:
    Parent_Pool: SERVERS_GLOBAL
    Type: LAN
    Network: 10.180.3.0/24
    Gateway: 10.180.3.1
    DHCP_Server: N/A (Static)
    
  # VN_VOICE Subpools
  VOICE-MUM:
    Parent_Pool: VOICE_GLOBAL
    Type: LAN
    Network: 10.190.1.0/24
    Gateway: 10.190.1.1
    DHCP_Server: 10.10.0.10
    DHCP_Range: 10.190.1.10 - 10.190.1.250
    Voice_VLAN: Enabled
```

### Site-Specific IP Pool Subpools - London

```yaml
# Design > Network Settings > IP Address Pools > London

London_IP_Pools:

  # VN_CORPORATE Subpools
  CORP-LON-F1:
    Parent_Pool: CORPORATE_GLOBAL
    Type: LAN
    Network: 10.101.1.0/24
    Gateway: 10.101.1.1
    DHCP_Server: 10.20.0.10
    DHCP_Range: 10.101.1.10 - 10.101.1.250
      
  CORP-LON-F2:
    Parent_Pool: CORPORATE_GLOBAL
    Type: LAN
    Network: 10.101.2.0/24
    Gateway: 10.101.2.1
    DHCP_Server: 10.20.0.10
    DHCP_Range: 10.101.2.10 - 10.101.2.250
    
  CORP-LON-F3:
    Parent_Pool: CORPORATE_GLOBAL
    Type: LAN
    Network: 10.101.3.0/24
    Gateway: 10.101.3.1
    DHCP_Server: 10.20.0.10
    DHCP_Range: 10.101.3.10 - 10.101.3.250
    
  CORP-LON-F4:
    Parent_Pool: CORPORATE_GLOBAL
    Type: LAN
    Network: 10.101.4.0/24
    Gateway: 10.101.4.1
    DHCP_Server: 10.20.0.10
    DHCP_Range: 10.101.4.10 - 10.101.4.250

  # VN_GUEST Subpools
  GUEST-LON:
    Parent_Pool: GUEST_GLOBAL
    Type: LAN
    Network: 10.201.1.0/24
    Gateway: 10.201.1.1
    DHCP_Server: 10.20.0.10
    DHCP_Range: 10.201.1.10 - 10.201.1.250
    
  # VN_IOT Subpools
  IOT-LON-SENSORS:
    Parent_Pool: IOT_GLOBAL
    Type: LAN
    Network: 10.151.1.0/25
    Gateway: 10.151.1.1
    DHCP_Server: 10.20.0.10
    DHCP_Range: 10.151.1.10 - 10.151.1.120
    
  IOT-LON-CAMERAS:
    Parent_Pool: IOT_GLOBAL
    Type: LAN
    Network: 10.151.1.128/25
    Gateway: 10.151.1.129
    DHCP_Server: 10.20.0.10
    DHCP_Range: 10.151.1.140 - 10.151.1.250
    
  # VN_SERVERS Subpools
  SRV-LON-PROD:
    Parent_Pool: SERVERS_GLOBAL
    Type: LAN
    Network: 10.181.1.0/24
    Gateway: 10.181.1.1
    DHCP_Server: N/A (Static)
    
  SRV-LON-DEV:
    Parent_Pool: SERVERS_GLOBAL
    Type: LAN
    Network: 10.181.2.0/24
    Gateway: 10.181.2.1
    DHCP_Server: 10.20.0.10
    DHCP_Range: 10.181.2.10 - 10.181.2.200
    
  # VN_VOICE Subpools
  VOICE-LON:
    Parent_Pool: VOICE_GLOBAL
    Type: LAN
    Network: 10.191.1.0/24
    Gateway: 10.191.1.1
    DHCP_Server: 10.20.0.10
    DHCP_Range: 10.191.1.10 - 10.191.1.250
```

### Site-Specific IP Pool Subpools - New Jersey

```yaml
# Design > Network Settings > IP Address Pools > New Jersey

NewJersey_IP_Pools:

  # VN_CORPORATE Subpools
  CORP-NJ-F1:
    Parent_Pool: CORPORATE_GLOBAL
    Type: LAN
    Network: 10.102.1.0/24
    Gateway: 10.102.1.1
    DHCP_Server: 10.30.0.10
    DHCP_Range: 10.102.1.10 - 10.102.1.250
      
  CORP-NJ-F2:
    Parent_Pool: CORPORATE_GLOBAL
    Type: LAN
    Network: 10.102.2.0/24
    Gateway: 10.102.2.1
    DHCP_Server: 10.30.0.10
    DHCP_Range: 10.102.2.10 - 10.102.2.250
    
  CORP-NJ-F3:
    Parent_Pool: CORPORATE_GLOBAL
    Type: LAN
    Network: 10.102.3.0/24
    Gateway: 10.102.3.1
    DHCP_Server: 10.30.0.10
    DHCP_Range: 10.102.3.10 - 10.102.3.250
    
  CORP-NJ-F4:
    Parent_Pool: CORPORATE_GLOBAL
    Type: LAN
    Network: 10.102.4.0/24
    Gateway: 10.102.4.1
    DHCP_Server: 10.30.0.10
    DHCP_Range: 10.102.4.10 - 10.102.4.250
    
  CORP-NJ-F5:
    Parent_Pool: CORPORATE_GLOBAL
    Type: LAN
    Network: 10.102.5.0/24
    Gateway: 10.102.5.1
    DHCP_Server: 10.30.0.10
    DHCP_Range: 10.102.5.10 - 10.102.5.250

  # VN_GUEST Subpools
  GUEST-NJ:
    Parent_Pool: GUEST_GLOBAL
    Type: LAN
    Network: 10.202.1.0/24
    Gateway: 10.202.1.1
    DHCP_Server: 10.30.0.10
    DHCP_Range: 10.202.1.10 - 10.202.1.250
    
  # VN_IOT Subpools
  IOT-NJ-SENSORS:
    Parent_Pool: IOT_GLOBAL
    Type: LAN
    Network: 10.152.1.0/25
    Gateway: 10.152.1.1
    DHCP_Server: 10.30.0.10
    DHCP_Range: 10.152.1.10 - 10.152.1.120
    
  IOT-NJ-CAMERAS:
    Parent_Pool: IOT_GLOBAL
    Type: LAN
    Network: 10.152.1.128/25
    Gateway: 10.152.1.129
    DHCP_Server: 10.30.0.10
    DHCP_Range: 10.152.1.140 - 10.152.1.250
    
  IOT-NJ-OT:
    Parent_Pool: IOT_GLOBAL
    Type: LAN
    Network: 10.152.2.0/24
    Gateway: 10.152.2.1
    DHCP_Server: 10.30.0.10
    DHCP_Range: 10.152.2.10 - 10.152.2.200
    
  # VN_SERVERS Subpools
  SRV-NJ-PROD:
    Parent_Pool: SERVERS_GLOBAL
    Type: LAN
    Network: 10.182.1.0/24
    Gateway: 10.182.1.1
    DHCP_Server: N/A (Static)
    
  SRV-NJ-DEV:
    Parent_Pool: SERVERS_GLOBAL
    Type: LAN
    Network: 10.182.2.0/24
    Gateway: 10.182.2.1
    DHCP_Server: 10.30.0.10
    DHCP_Range: 10.182.2.10 - 10.182.2.200
    
  SRV-NJ-DMZ:
    Parent_Pool: SERVERS_GLOBAL
    Type: LAN
    Network: 10.182.3.0/24
    Gateway: 10.182.3.1
    DHCP_Server: N/A (Static)
    
  # VN_VOICE Subpools
  VOICE-NJ:
    Parent_Pool: VOICE_GLOBAL
    Type: LAN
    Network: 10.192.1.0/24
    Gateway: 10.192.1.1
    DHCP_Server: 10.30.0.10
    DHCP_Range: 10.192.1.10 - 10.192.1.250
```

---

## 4.6.4 Fabric Site Provisioning

### Create Fabric Site - Mumbai

```yaml
# Provision > Fabric Sites > Create Fabric Site

Mumbai_Fabric_Site:
  Site: Global/APAC/Mumbai
  Authentication_Template: Closed Authentication
  
  # Fabric Settings
  Fabric_Type: LISP/VXLAN
  Control_Plane_Size: Medium
  Border_Type: Internal + External
  
  # Multicast Configuration
  Multicast: Native Multicast
  RP_Address: 10.250.1.3 (CP-01)
  RP_Backup: 10.250.1.4 (CP-02)
```

### Virtual Network Assignment - Mumbai

```yaml
# Provision > Fabric Sites > Mumbai > Virtual Networks

Mumbai_Virtual_Networks:

  VN_CORPORATE:
    VNI: 8001
    Traffic_Type: Data
    Layer3_Gateway: Distributed (Anycast)
    Associated_Pools:
      - CORP-MUM-F1 (10.100.1.0/24)
      - CORP-MUM-F2 (10.100.2.0/24)
      - CORP-MUM-F3 (10.100.3.0/24)
      - CORP-MUM-F4 (10.100.4.0/24)
      - CORP-MUM-F5 (10.100.5.0/24)
      - CORP-MUM-F6 (10.100.6.0/24)
    Wireless_Pools:
      - CORP-MUM-WLAN (10.100.7.0/24)
      
  VN_GUEST:
    VNI: 8002
    Traffic_Type: Data
    Layer3_Gateway: Centralized (Border)
    Associated_Pools:
      - GUEST-MUM (10.200.1.0/24)
    Internet_Access: Yes (via Fusion Router)
    Captive_Portal: Enabled
      
  VN_IOT:
    VNI: 8003
    Traffic_Type: Data
    Layer3_Gateway: Distributed (Anycast)
    Associated_Pools:
      - IOT-MUM-SENSORS (10.150.1.0/25)
      - IOT-MUM-CAMERAS (10.150.1.128/25)
      - IOT-MUM-OT (10.150.2.0/24)
      
  VN_SERVERS:
    VNI: 8004
    Traffic_Type: Data
    Layer3_Gateway: Centralized (Border)
    Associated_Pools:
      - SRV-MUM-PROD (10.180.1.0/24)
      - SRV-MUM-DEV (10.180.2.0/24)
      - SRV-MUM-DMZ (10.180.3.0/24)
      
  VN_VOICE:
    VNI: 8005
    Traffic_Type: Voice
    Layer3_Gateway: Distributed (Anycast)
    Associated_Pools:
      - VOICE-MUM (10.190.1.0/24)
    QoS_Policy: Voice-Optimized
```

---

## 4.6.5 Complete Overlay Configuration - Border Node

### Border Node LISP Configuration

```cisco
! ============================================================================
! BORDER NODE OVERLAY CONFIGURATION
! Example: MUM-BN-01 (C9500-48Y4C)
! ============================================================================

hostname MUM-BN-01

! --- LISP Instance Configuration ---
router lisp
 !
 ! LISP Site Configuration
 site MUMBAI
  description Mumbai Fabric Site
  authentication-key <encrypted-key>
 !
 ! Instance 8001 - VN_CORPORATE
 instance-id 8001
  remote-rloc-probe on-route-change
  service ipv4
   eid-table vrf VN_CORPORATE
   database-mapping 10.100.0.0/16 locator-set RLOC-SET
   map-cache 10.100.0.0/16 map-request
   !
   ! Border settings
   map-server 10.250.1.3 key <key>
   map-server 10.250.1.4 key <key>
   map-resolver 10.250.1.3
   map-resolver 10.250.1.4
   !
   use-petr 10.250.1.3 priority 1 weight 50
   use-petr 10.250.1.4 priority 1 weight 50
  exit-service-ipv4
 !
 ! Instance 8002 - VN_GUEST
 instance-id 8002
  remote-rloc-probe on-route-change
  service ipv4
   eid-table vrf VN_GUEST
   database-mapping 10.200.0.0/16 locator-set RLOC-SET
   map-cache 10.200.0.0/16 map-request
   map-server 10.250.1.3 key <key>
   map-server 10.250.1.4 key <key>
   map-resolver 10.250.1.3
   map-resolver 10.250.1.4
  exit-service-ipv4
 !
 ! Instance 8003 - VN_IOT
 instance-id 8003
  remote-rloc-probe on-route-change
  service ipv4
   eid-table vrf VN_IOT
   database-mapping 10.150.0.0/16 locator-set RLOC-SET
   map-cache 10.150.0.0/16 map-request
   map-server 10.250.1.3 key <key>
   map-server 10.250.1.4 key <key>
   map-resolver 10.250.1.3
   map-resolver 10.250.1.4
  exit-service-ipv4
 !
 ! Instance 8004 - VN_SERVERS
 instance-id 8004
  remote-rloc-probe on-route-change
  service ipv4
   eid-table vrf VN_SERVERS
   database-mapping 10.180.0.0/16 locator-set RLOC-SET
   map-cache 10.180.0.0/16 map-request
   map-server 10.250.1.3 key <key>
   map-server 10.250.1.4 key <key>
   map-resolver 10.250.1.3
   map-resolver 10.250.1.4
  exit-service-ipv4
 !
 ! Instance 8005 - VN_VOICE
 instance-id 8005
  remote-rloc-probe on-route-change
  service ipv4
   eid-table vrf VN_VOICE
   database-mapping 10.190.0.0/16 locator-set RLOC-SET
   map-cache 10.190.0.0/16 map-request
   map-server 10.250.1.3 key <key>
   map-server 10.250.1.4 key <key>
   map-resolver 10.250.1.3
   map-resolver 10.250.1.4
  exit-service-ipv4
 !
 ! RLOC Locator Set
 locator-set RLOC-SET
  10.250.1.1 priority 1 weight 50
  10.250.1.2 priority 1 weight 50
 exit-locator-set
!
exit-router-lisp

! --- VRF Definitions ---
vrf definition VN_CORPORATE
 rd 1:8001
 !
 address-family ipv4
  route-target export 1:8001
  route-target import 1:8001
 exit-address-family

vrf definition VN_GUEST
 rd 1:8002
 !
 address-family ipv4
  route-target export 1:8002
  route-target import 1:8002
 exit-address-family

vrf definition VN_IOT
 rd 1:8003
 !
 address-family ipv4
  route-target export 1:8003
  route-target import 1:8003
 exit-address-family

vrf definition VN_SERVERS
 rd 1:8004
 !
 address-family ipv4
  route-target export 1:8004
  route-target import 1:8004
 exit-address-family

vrf definition VN_VOICE
 rd 1:8005
 !
 address-family ipv4
  route-target export 1:8005
  route-target import 1:8005
 exit-address-family

! --- VXLAN Configuration (NVE Interface) ---
interface nve1
 description FABRIC-VXLAN-TUNNEL
 no ip address
 source-interface Loopback0
 host-reachability protocol lisp
 !
 ! VN_CORPORATE (VNI 8001)
 member vni 8001 mcast-group 239.1.1.1
 member vni 8001 vrf VN_CORPORATE
 member vni 8001 ingress-replication
 !
 ! VN_GUEST (VNI 8002)
 member vni 8002 mcast-group 239.1.1.2
 member vni 8002 vrf VN_GUEST
 member vni 8002 ingress-replication
 !
 ! VN_IOT (VNI 8003)
 member vni 8003 mcast-group 239.1.1.3
 member vni 8003 vrf VN_IOT
 member vni 8003 ingress-replication
 !
 ! VN_SERVERS (VNI 8004)
 member vni 8004 mcast-group 239.1.1.4
 member vni 8004 vrf VN_SERVERS
 member vni 8004 ingress-replication
 !
 ! VN_VOICE (VNI 8005)
 member vni 8005 mcast-group 239.1.1.5
 member vni 8005 vrf VN_VOICE
 member vni 8005 ingress-replication
!

! --- Border Handoff SVIs ---
! These are for external connectivity (SD-WAN, Firewall, DC)

! VN_CORPORATE Handoff
interface Vlan3001
 description SDWAN-HANDOFF-VN_CORPORATE
 vrf forwarding VN_CORPORATE
 ip address 10.240.1.1 255.255.255.252
 no shutdown

! VN_GUEST Handoff
interface Vlan3002
 description SDWAN-HANDOFF-VN_GUEST
 vrf forwarding VN_GUEST
 ip address 10.240.2.1 255.255.255.252
 no shutdown

! VN_IOT Handoff
interface Vlan3003
 description SDWAN-HANDOFF-VN_IOT
 vrf forwarding VN_IOT
 ip address 10.240.3.1 255.255.255.252
 no shutdown

! VN_SERVERS Handoff
interface Vlan3004
 description SDWAN-HANDOFF-VN_SERVERS
 vrf forwarding VN_SERVERS
 ip address 10.240.4.1 255.255.255.252
 no shutdown

! VN_VOICE Handoff
interface Vlan3005
 description SDWAN-HANDOFF-VN_VOICE
 vrf forwarding VN_VOICE
 ip address 10.240.5.1 255.255.255.252
 no shutdown

! --- BGP for External Connectivity ---
router bgp 65001
 bgp router-id 10.250.1.1
 bgp log-neighbor-changes
 !
 ! VN_CORPORATE
 address-family ipv4 vrf VN_CORPORATE
  redistribute lisp metric 100
  neighbor 10.240.1.2 remote-as 65100
  neighbor 10.240.1.2 description SDWAN-EDGE-CORP
  neighbor 10.240.1.2 activate
  neighbor 10.240.1.2 send-community both
 exit-address-family
 !
 ! VN_GUEST
 address-family ipv4 vrf VN_GUEST
  redistribute lisp metric 100
  neighbor 10.240.2.2 remote-as 65100
  neighbor 10.240.2.2 description SDWAN-EDGE-GUEST
  neighbor 10.240.2.2 activate
 exit-address-family
 !
 ! VN_IOT
 address-family ipv4 vrf VN_IOT
  redistribute lisp metric 100
  neighbor 10.240.3.2 remote-as 65100
  neighbor 10.240.3.2 description SDWAN-EDGE-IOT
  neighbor 10.240.3.2 activate
 exit-address-family
 !
 ! VN_SERVERS
 address-family ipv4 vrf VN_SERVERS
  redistribute lisp metric 100
  neighbor 10.240.4.2 remote-as 65100
  neighbor 10.240.4.2 description SDWAN-EDGE-SERVERS
  neighbor 10.240.4.2 activate
 exit-address-family
 !
 ! VN_VOICE
 address-family ipv4 vrf VN_VOICE
  redistribute lisp metric 100
  neighbor 10.240.5.2 remote-as 65100
  neighbor 10.240.5.2 description SDWAN-EDGE-VOICE
  neighbor 10.240.5.2 activate
 exit-address-family
!

! --- CTS (TrustSec) Configuration ---
cts authorization list ISE-CTS
cts role-based enforcement
cts role-based enforcement vlan-list all
cts role-based sgt-map 10.180.1.0/24 sgt 80
cts role-based sgt-map 10.180.2.0/24 sgt 90
!

! --- SGT Inline Tagging on Fabric Ports ---
interface range TenGigabitEthernet1/0/1-3
 cts role-based enforcement
 cts manual
  policy static sgt tag 2 trusted
!
```

---

## 4.6.6 Complete Overlay Configuration - Edge Node

### Edge Node LISP/VXLAN Configuration

```cisco
! ============================================================================
! EDGE NODE OVERLAY CONFIGURATION
! Example: MUM-ED-01 (C9300-48UXM)
! ============================================================================

hostname MUM-ED-01

! --- LISP Instance Configuration ---
router lisp
 !
 locator-set RLOC-SET
  10.250.1.5 priority 1 weight 100
 exit-locator-set
 !
 ! Instance 8001 - VN_CORPORATE
 instance-id 8001
  remote-rloc-probe on-route-change
  dynamic-eid CORPORATE_EID
   database-mapping 10.100.1.0/24 locator-set RLOC-SET
   eid-notify authentication-key <key>
   map-notify-group 239.1.1.1
  exit-dynamic-eid
  !
  service ipv4
   eid-table vrf VN_CORPORATE
   etr map-server 10.250.1.3 key <key>
   etr map-server 10.250.1.4 key <key>
   etr
   itr map-resolver 10.250.1.3
   itr map-resolver 10.250.1.4
   itr
  exit-service-ipv4
 !
 ! Instance 8002 - VN_GUEST
 instance-id 8002
  remote-rloc-probe on-route-change
  dynamic-eid GUEST_EID
   database-mapping 10.200.1.0/24 locator-set RLOC-SET
   eid-notify authentication-key <key>
   map-notify-group 239.1.1.2
  exit-dynamic-eid
  !
  service ipv4
   eid-table vrf VN_GUEST
   etr map-server 10.250.1.3 key <key>
   etr map-server 10.250.1.4 key <key>
   etr
   itr map-resolver 10.250.1.3
   itr map-resolver 10.250.1.4
   itr
  exit-service-ipv4
 !
 ! Instance 8003 - VN_IOT
 instance-id 8003
  remote-rloc-probe on-route-change
  dynamic-eid IOT_EID
   database-mapping 10.150.1.0/24 locator-set RLOC-SET
   eid-notify authentication-key <key>
   map-notify-group 239.1.1.3
  exit-dynamic-eid
  !
  service ipv4
   eid-table vrf VN_IOT
   etr map-server 10.250.1.3 key <key>
   etr map-server 10.250.1.4 key <key>
   etr
   itr map-resolver 10.250.1.3
   itr map-resolver 10.250.1.4
   itr
  exit-service-ipv4
 !
 ! Instance 8005 - VN_VOICE
 instance-id 8005
  remote-rloc-probe on-route-change
  dynamic-eid VOICE_EID
   database-mapping 10.190.1.0/24 locator-set RLOC-SET
   eid-notify authentication-key <key>
   map-notify-group 239.1.1.5
  exit-dynamic-eid
  !
  service ipv4
   eid-table vrf VN_VOICE
   etr map-server 10.250.1.3 key <key>
   etr map-server 10.250.1.4 key <key>
   etr
   itr map-resolver 10.250.1.3
   itr map-resolver 10.250.1.4
   itr
  exit-service-ipv4
 !
 ! Locator for this edge
 locator-table default
 locator default-set RLOC-SET
!
exit-router-lisp

! --- VRF Definitions ---
vrf definition VN_CORPORATE
 rd 1:8001
 address-family ipv4
  route-target export 1:8001
  route-target import 1:8001
 exit-address-family

vrf definition VN_GUEST
 rd 1:8002
 address-family ipv4
  route-target export 1:8002
  route-target import 1:8002
 exit-address-family

vrf definition VN_IOT
 rd 1:8003
 address-family ipv4
  route-target export 1:8003
  route-target import 1:8003
 exit-address-family

vrf definition VN_VOICE
 rd 1:8005
 address-family ipv4
  route-target export 1:8005
  route-target import 1:8005
 exit-address-family

! --- VXLAN Configuration (NVE Interface) ---
interface nve1
 description FABRIC-VXLAN-TUNNEL
 no ip address
 source-interface Loopback0
 host-reachability protocol lisp
 !
 member vni 8001 mcast-group 239.1.1.1
 member vni 8001 vrf VN_CORPORATE
 member vni 10011 vlan-based
 !
 member vni 8002 mcast-group 239.1.1.2
 member vni 8002 vrf VN_GUEST
 member vni 10021 vlan-based
 !
 member vni 8003 mcast-group 239.1.1.3
 member vni 8003 vrf VN_IOT
 member vni 10031 vlan-based
 !
 member vni 8005 mcast-group 239.1.1.5
 member vni 8005 vrf VN_VOICE
 member vni 10051 vlan-based
!

! --- L2 VLANs for Host Access ---
vlan 1011
 name VN_CORPORATE_DATA
 
vlan 1021
 name VN_GUEST_DATA

vlan 1031
 name VN_IOT_DATA

vlan 1051
 name VN_VOICE_DATA

! --- Anycast Gateway SVIs ---
! Using Virtual MAC for seamless mobility

interface Vlan1011
 description ANYCAST-GW-VN_CORPORATE
 vrf forwarding VN_CORPORATE
 ip address 10.100.1.1 255.255.255.0
 ip helper-address 10.10.0.10
 ip helper-address 10.10.0.11
 no ip redirects
 no ip proxy-arp
 ip route-cache same-interface
 no autostate
 lisp mobility dynamic-eid CORPORATE_EID
 mac-address 0000.0c9f.f001
 no shutdown

interface Vlan1021
 description ANYCAST-GW-VN_GUEST
 vrf forwarding VN_GUEST
 ip address 10.200.1.1 255.255.255.0
 ip helper-address 10.10.0.10
 no ip redirects
 no ip proxy-arp
 ip route-cache same-interface
 no autostate
 lisp mobility dynamic-eid GUEST_EID
 mac-address 0000.0c9f.f002
 no shutdown

interface Vlan1031
 description ANYCAST-GW-VN_IOT
 vrf forwarding VN_IOT
 ip address 10.150.1.1 255.255.255.0
 ip helper-address 10.10.0.10
 no ip redirects
 no ip proxy-arp
 ip route-cache same-interface
 no autostate
 lisp mobility dynamic-eid IOT_EID
 mac-address 0000.0c9f.f003
 no shutdown

interface Vlan1051
 description ANYCAST-GW-VN_VOICE
 vrf forwarding VN_VOICE
 ip address 10.190.1.1 255.255.255.0
 ip helper-address 10.10.0.10
 no ip redirects
 no ip proxy-arp
 ip route-cache same-interface
 no autostate
 lisp mobility dynamic-eid VOICE_EID
 mac-address 0000.0c9f.f005
 no shutdown

! --- VXLAN-to-VLAN Mapping ---
vlan configuration 1011
 member evpn-instance 8001 vni 10011

vlan configuration 1021
 member evpn-instance 8002 vni 10021

vlan configuration 1031
 member evpn-instance 8003 vni 10031

vlan configuration 1051
 member evpn-instance 8005 vni 10051

! --- Host-Facing Ports with 802.1X ---
interface GigabitEthernet1/0/1
 description USER-ACCESS-PORT
 switchport mode access
 switchport access vlan 1011
 authentication host-mode multi-auth
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 mab
 dot1x pae authenticator
 dot1x timeout tx-period 7
 spanning-tree portfast
 spanning-tree bpduguard enable
 cts role-based enforcement
 device-tracking attach-policy IPDT-POLICY
 ip dhcp snooping trust
 no shutdown

! Template for remaining access ports
interface range GigabitEthernet1/0/2-44
 description USER-ACCESS-PORT
 switchport mode access
 switchport access vlan 1011
 authentication host-mode multi-auth
 authentication order dot1x mab
 authentication priority dot1x mab
 authentication port-control auto
 authentication periodic
 authentication timer reauthenticate server
 mab
 dot1x pae authenticator
 dot1x timeout tx-period 7
 spanning-tree portfast
 spanning-tree bpduguard enable
 cts role-based enforcement
 device-tracking attach-policy IPDT-POLICY
 no shutdown

! --- Voice VLAN Configuration ---
interface range GigabitEthernet1/0/1-44
 switchport voice vlan 1051

! --- AP Ports ---
interface range GigabitEthernet1/0/45-47
 description AP-PORT
 switchport mode trunk
 switchport trunk allowed vlan 1011,1021,1031,1051
 spanning-tree portfast trunk
 device-tracking attach-policy IPDT-POLICY
 no shutdown

! --- CTS (TrustSec) Configuration ---
cts authorization list ISE-CTS
cts role-based enforcement
cts role-based enforcement vlan-list 1011,1021,1031,1051
!

! --- IP Device Tracking ---
device-tracking policy IPDT-POLICY
 tracking enable

! --- DHCP Snooping ---
ip dhcp snooping
ip dhcp snooping vlan 1011,1021,1031,1051
```

---

## 4.6.7 Control Plane Node Overlay Configuration

```cisco
! ============================================================================
! CONTROL PLANE NODE OVERLAY CONFIGURATION
! Example: MUM-CP-01 (C9500-24Y4C)
! ============================================================================

hostname MUM-CP-01

! --- LISP Map-Server/Map-Resolver Configuration ---
router lisp
 !
 ! Site definition
 site MUMBAI
  description Mumbai Fabric Site
  authentication-key <encrypted-key>
  !
  ! EID prefixes this site is authoritative for
  eid-prefix 10.100.0.0/16 accept-more-specifics
  eid-prefix 10.150.0.0/16 accept-more-specifics
  eid-prefix 10.180.0.0/16 accept-more-specifics
  eid-prefix 10.190.0.0/16 accept-more-specifics
  eid-prefix 10.200.0.0/16 accept-more-specifics
 exit-site
 !
 ! Instance 8001 - VN_CORPORATE
 instance-id 8001
  service ipv4
   map-server
   map-resolver
   map-server map-register-fallback site-registration-limit 10000
  exit-service-ipv4
 !
 ! Instance 8002 - VN_GUEST
 instance-id 8002
  service ipv4
   map-server
   map-resolver
   map-server map-register-fallback site-registration-limit 5000
  exit-service-ipv4
 !
 ! Instance 8003 - VN_IOT
 instance-id 8003
  service ipv4
   map-server
   map-resolver
   map-server map-register-fallback site-registration-limit 10000
  exit-service-ipv4
 !
 ! Instance 8004 - VN_SERVERS
 instance-id 8004
  service ipv4
   map-server
   map-resolver
   map-server map-register-fallback site-registration-limit 2000
  exit-service-ipv4
 !
 ! Instance 8005 - VN_VOICE
 instance-id 8005
  service ipv4
   map-server
   map-resolver
   map-server map-register-fallback site-registration-limit 5000
  exit-service-ipv4
 !
 locator-table default
 locator default-set RLOC-SET
 !
 locator-set RLOC-SET
  10.250.1.3 priority 1 weight 50
  10.250.1.4 priority 2 weight 50
 exit-locator-set
!
exit-router-lisp

! --- PIM Configuration for Multicast (RP) ---
ip multicast-routing
!
ip pim rp-address 10.250.1.3 ACL-FABRIC-MCAST
ip pim rp-address 10.250.1.4 ACL-FABRIC-MCAST priority 10
!
ip access-list standard ACL-FABRIC-MCAST
 permit 239.1.1.0 0.0.0.255
!
interface Loopback0
 ip pim sparse-mode
!
interface range TenGigabitEthernet1/0/1-24
 ip pim sparse-mode
```

---

## 4.6.8 Overlay Validation Commands

### LISP Validation

```cisco
! ============================================================================
! LISP VALIDATION COMMANDS
! ============================================================================

! --- Verify LISP Site Registration (on CP) ---
show lisp instance-id 8001 ipv4 server
! Expected: All edge nodes registered with their EID prefixes

! Example output:
! LISP Site Registration for IID 8001
! Site Name: MUMBAI
! Allowed EIDs:
!   10.100.0.0/16 accept-more-specifics
! Registrations:
!   10.100.1.0/24 via 10.250.1.5 (MUM-ED-01), uptime: 2d3h
!   10.100.2.0/24 via 10.250.1.6 (MUM-ED-02), uptime: 2d3h
!   ...

! --- Verify LISP Map-Cache (on Edge/Border) ---
show lisp instance-id 8001 ipv4 map-cache
! Expected: Remote EID-to-RLOC mappings cached

! Example output:
! LISP IPv4 Mapping Cache for LISP 0 EID-table vrf VN_CORPORATE (IID 8001)
! 10.100.2.0/24, uptime: 00:15:32, expires: 23:44:28
!   Locator: 10.250.1.6, State: up, Priority: 1, Weight: 100
! 10.100.3.0/24, uptime: 00:10:15, expires: 23:49:45
!   Locator: 10.250.1.7, State: up, Priority: 1, Weight: 100

! --- Verify LISP Database (on Edge) ---
show lisp instance-id 8001 ipv4 database
! Expected: Local EID prefixes registered

! --- Verify LISP ETR ---
show lisp instance-id 8001 ipv4 server etr-address
! Shows ETR registration status

! --- Verify All LISP Instances ---
show lisp service ipv4 summary
! Shows all VN instances and their status
```

### VXLAN Validation

```cisco
! ============================================================================
! VXLAN VALIDATION COMMANDS
! ============================================================================

! --- Verify NVE Interface ---
show nve interface nve1
! Expected: Interface UP with source Loopback0

! Example output:
! Interface: nve1, State: Admin Up, Oper Up
! Source-Interface: Loopback0 (primary: 10.250.1.5)
! VNI Summary: 5 VNIs configured

! --- Verify NVE VNI ---
show nve vni
! Expected: All VNIs UP with correct configuration

! Example output:
! Interface  VNI        Multicast-group   State Mode   BD    cfg  vrf
! nve1       8001       239.1.1.1         Up    L3CP   N/A   CLI  VN_CORPORATE
! nve1       8002       239.1.1.2         Up    L3CP   N/A   CLI  VN_GUEST
! nve1       8003       239.1.1.3         Up    L3CP   N/A   CLI  VN_IOT
! nve1       8004       239.1.1.4         Up    L3CP   N/A   CLI  VN_SERVERS
! nve1       8005       239.1.1.5         Up    L3CP   N/A   CLI  VN_VOICE

! --- Verify NVE Peers ---
show nve peers
! Expected: All fabric nodes as peers

! Example output:
! Interface  VNI      Type Peer-IP          RMAC              eVNI     state
! nve1       8001     L3CP 10.250.1.1       0000.0000.0000    8001     UP
! nve1       8001     L3CP 10.250.1.2       0000.0000.0000    8001     UP
! nve1       8001     L3CP 10.250.1.6       aabb.cc00.0200    8001     UP

! --- Verify VXLAN Encapsulation ---
show platform hardware fed switch active fwd-asic resource utilization
! Check VXLAN tunnel utilization
```

### VRF and Routing Validation

```cisco
! ============================================================================
! VRF AND ROUTING VALIDATION
! ============================================================================

! --- Verify VRF Configuration ---
show vrf
! Expected: All VNs present as VRFs

! Example output:
!   Name                             Protocols   Interfaces
!   VN_CORPORATE                     ipv4        Vl1011, Vl3001
!   VN_GUEST                         ipv4        Vl1021, Vl3002
!   VN_IOT                           ipv4        Vl1031, Vl3003
!   VN_SERVERS                       ipv4        Vl3004
!   VN_VOICE                         ipv4        Vl1051, Vl3005

! --- Verify VRF Routing Table ---
show ip route vrf VN_CORPORATE
! Expected: All subnets reachable via LISP or BGP

! Example output:
! Routing Table: VN_CORPORATE
!       10.0.0.0/8 is variably subnetted
! C        10.100.1.0/24 is directly connected, Vlan1011
! L        10.100.1.1/32 is directly connected, Vlan1011
! l        10.100.2.0/24 [163/1] via LISP0.8001, 00:15:32
! l        10.100.3.0/24 [163/1] via LISP0.8001, 00:10:15
! B        10.100.16.0/24 [20/0] via 10.240.1.2, 1d2h

! --- Verify BGP (on Border) ---
show ip bgp vpnv4 vrf VN_CORPORATE summary
! Expected: BGP peer UP with SD-WAN edge

! --- Verify ARP Table per VRF ---
show ip arp vrf VN_CORPORATE
! Shows host entries learned
```

### Anycast Gateway Validation

```cisco
! ============================================================================
! ANYCAST GATEWAY VALIDATION
! ============================================================================

! --- Verify SVI Configuration ---
show running-config interface Vlan1011
! Verify MAC address and VRF assignment

! --- Verify MAC Address ---
show interfaces Vlan1011 | include address
! Expected: Virtual MAC 0000.0c9f.f001

! --- Verify Anycast Consistency ---
! Run on multiple edge nodes:
show interfaces Vlan1011 | include address
! All should show same MAC: 0000.0c9f.f001

! --- Verify DHCP Relay ---
show ip dhcp relay information trusted-sources
show ip helper-address vrf VN_CORPORATE
```

### SGT/TrustSec Validation

```cisco
! ============================================================================
! SGT/TRUSTSEC VALIDATION
! ============================================================================

! --- Verify CTS Status ---
show cts pacs
! Shows PAC provisioning status

! --- Verify Environment Data ---
show cts environment-data
! Shows downloaded SGT data from ISE

! --- Verify SGT Assignments ---
show cts role-based sgt-map all
! Shows static and dynamic SGT mappings

! --- Verify SGACL Downloads ---
show cts role-based permissions
! Shows downloaded SGACL policies

! --- Verify Inline Tagging ---
show cts interface summary
! Shows CTS status per interface

! --- Verify SGT on Host ---
show device-tracking database
! Shows learned hosts with SGT
```

---

## 4.6.9 Complete VLAN-to-VNI Mapping Table

| Site | VN | VLAN | L2 VNI | L3 VNI | Subnet | Anycast GW |
|------|-----|------|--------|--------|--------|------------|
| **Mumbai** |
| | VN_CORPORATE | 1011 | 10011 | 8001 | 10.100.1.0/24 | 10.100.1.1 |
| | VN_GUEST | 1021 | 10021 | 8002 | 10.200.1.0/24 | 10.200.1.1 |
| | VN_IOT | 1031 | 10031 | 8003 | 10.150.1.0/24 | 10.150.1.1 |
| | VN_VOICE | 1051 | 10051 | 8005 | 10.190.1.0/24 | 10.190.1.1 |
| **Chennai** |
| | VN_CORPORATE | 1012 | 10012 | 8001 | 10.100.17.0/24 | 10.100.17.1 |
| | VN_GUEST | 1022 | 10022 | 8002 | 10.200.17.0/24 | 10.200.17.1 |
| | VN_IOT | 1032 | 10032 | 8003 | 10.150.17.0/24 | 10.150.17.1 |
| | VN_VOICE | 1052 | 10052 | 8005 | 10.190.17.0/24 | 10.190.17.1 |
| **London** |
| | VN_CORPORATE | 1013 | 10013 | 8001 | 10.101.1.0/24 | 10.101.1.1 |
| | VN_GUEST | 1023 | 10023 | 8002 | 10.201.1.0/24 | 10.201.1.1 |
| | VN_IOT | 1033 | 10033 | 8003 | 10.151.1.0/24 | 10.151.1.1 |
| | VN_VOICE | 1053 | 10053 | 8005 | 10.191.1.0/24 | 10.191.1.1 |
| **Frankfurt** |
| | VN_CORPORATE | 1014 | 10014 | 8001 | 10.101.17.0/24 | 10.101.17.1 |
| | VN_GUEST | 1024 | 10024 | 8002 | 10.201.17.0/24 | 10.201.17.1 |
| | VN_IOT | 1034 | 10034 | 8003 | 10.151.17.0/24 | 10.151.17.1 |
| | VN_VOICE | 1054 | 10054 | 8005 | 10.191.17.0/24 | 10.191.17.1 |
| **New Jersey** |
| | VN_CORPORATE | 1015 | 10015 | 8001 | 10.102.1.0/24 | 10.102.1.1 |
| | VN_GUEST | 1025 | 10025 | 8002 | 10.202.1.0/24 | 10.202.1.1 |
| | VN_IOT | 1035 | 10035 | 8003 | 10.152.1.0/24 | 10.152.1.1 |
| | VN_VOICE | 1055 | 10055 | 8005 | 10.192.1.0/24 | 10.192.1.1 |
| **Dallas** |
| | VN_CORPORATE | 1016 | 10016 | 8001 | 10.102.17.0/24 | 10.102.17.1 |
| | VN_GUEST | 1026 | 10026 | 8002 | 10.202.17.0/24 | 10.202.17.1 |
| | VN_IOT | 1036 | 10036 | 8003 | 10.152.17.0/24 | 10.152.17.1 |
| | VN_VOICE | 1056 | 10056 | 8005 | 10.192.17.0/24 | 10.192.17.1 |
| **Bangalore (Branch)** |
| | VN_CORPORATE | 1017 | 10017 | 8001 | 10.100.33.0/24 | 10.100.33.1 |
| | VN_GUEST | 1027 | 10027 | 8002 | 10.200.33.0/25 | 10.200.33.1 |
| | VN_IOT | 1037 | 10037 | 8003 | 10.150.33.0/25 | 10.150.33.1 |
| | VN_VOICE | 1057 | 10057 | 8005 | 10.190.33.0/25 | 10.190.33.1 |

---

## 4.6.10 Fabric Site Provisioning Checklist

| Phase | Task | Completed | Verified By | Date |
|-------|------|-----------|-------------|------|
| **Site Hierarchy** |
| | Site hierarchy created in DNAC | ☐ | | |
| | Network settings configured | ☐ | | |
| | IP pools reserved | ☐ | | |
| | DHCP servers validated | ☐ | | |
| **Fabric Creation** |
| | Fabric site created | ☐ | | |
| | Authentication template applied | ☐ | | |
| | Control plane nodes assigned | ☐ | | |
| | Border nodes assigned | ☐ | | |
| | Edge nodes added | ☐ | | |
| **Virtual Networks** |
| | VN_CORPORATE configured | ☐ | | |
| | VN_GUEST configured | ☐ | | |
| | VN_IOT configured | ☐ | | |
| | VN_SERVERS configured | ☐ | | |
| | VN_VOICE configured | ☐ | | |
| | IP pools assigned to VNs | ☐ | | |
| **Overlay Validation** |
| | LISP adjacencies verified | ☐ | | |
| | VXLAN tunnels verified | ☐ | | |
| | VRF routing verified | ☐ | | |
| | Anycast gateways verified | ☐ | | |
| | Host connectivity tested | ☐ | | |
| **Security** |
| | SGTs configured in ISE | ☐ | | |
| | SGACL policies pushed | ☐ | | |
| | CTS environment verified | ☐ | | |
| | Policy enforcement tested | ☐ | | |

---
