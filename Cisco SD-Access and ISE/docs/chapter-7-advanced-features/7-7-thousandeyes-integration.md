# 7.7 ThousandEyes Integration

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
