# 3.2.5 ISE 3.3/3.4 Advanced Features

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Domain | abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. ISE 3.3/3.4 Feature Overview

### 1.1 Deployment Summary

| Site | ISE Version | Hardware | Role |
|------|-------------|----------|------|
| New Jersey (Primary) | ISE 3.4 Patch 3 | SNS-3755-K9 | PAN, MnT |
| London (Secondary) | ISE 3.4 Patch 3 | SNS-3755-K9 | PAN, MnT |
| All Sites | ISE 3.4 Patch 3 | SNS-3715-K9 | PSN |

### 1.2 New Features Matrix

| Feature | ISE 3.3 | ISE 3.4 | Abhavtech Status |
|---------|---------|---------|------------------|
| AI/ML Profiling (MFC) | ✅ | ✅ | Enabled |
| pxGrid Cloud | ✅ | ✅ Enhanced | Enabled |
| Wi-Fi Edge Analytics | ✅ | ✅ | Enabled |
| URL Pusher | ❌ | ✅ | Enabled |
| Sync Now | ❌ | ✅ | Enabled |
| Common Policy | ❌ | ✅ | Planned |
| VTI Native IPsec | ❌ | ✅ | Enabled |
| Controlled App Restart | ✅ | ✅ | Enabled |
| Split Upgrade | ✅ | ✅ | Available |

---

## 2. AI/ML Endpoint Analytics

### 2.1 Multi-Factor Classification (MFC)

MFC uses cloud-based machine learning to identify unknown endpoints by clustering similar devices and proposing classification.

```
┌─────────────────────────────────────────────────────────────────────┐
│                    AI Endpoint Analytics Flow                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Unknown Endpoint              ISE PSN                 AI Cloud    │
│   ┌───────────┐              ┌───────────┐           ┌───────────┐ │
│   │ MAC: xxxx │──RADIUS──────│ Profiling │──Deident─►│ ML Engine │ │
│   │ No Profile│  Attributes  │  Probes   │  Data     │           │ │
│   └───────────┘              └─────┬─────┘           └─────┬─────┘ │
│                                    │                       │       │
│                                    ▼                       ▼       │
│                              ┌───────────┐           ┌───────────┐ │
│                              │ Endpoint  │◄──MFC─────│ Cluster   │ │
│                              │ Database  │  Proposal │ Analysis  │ │
│                              └───────────┘           └───────────┘ │
│                                                                     │
│   MFC Classifications:                                              │
│   ├── MFC Hardware Manufacturer (e.g., "Apple Inc.")               │
│   ├── MFC Hardware Model (e.g., "iPhone 15 Pro")                   │
│   ├── MFC Operating System (e.g., "iOS 17.2")                      │
│   └── MFC Endpoint Type (e.g., "Mobile Phone")                     │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 2.2 Enabling AI Endpoint Analytics

**Step 1: Enable Cloud Connection**
```
Administration → System → Settings → Cisco AI Analytics

Cloud Connection Settings:
  ☑ Enable Cisco AI Analytics
  Connection Status: Connected
  Data Sharing: ☑ Send anonymized endpoint data
  
Click "Save"
```

**Step 2: Configure MFC Settings**
```
Work Centers → Profiler → Settings → AI Endpoint Analytics

MFC Configuration:
  ☑ Enable Multi-Factor Classification
  ☑ Auto-apply MFC profiles with confidence > 90%
  ☑ Send notifications for new clusters
  
  Cluster Review:
    Notification Email: soc@abhavtech.com
    Review Period: 7 days
```

### 2.3 MFC Authorization Conditions

```xml
<!-- Use MFC attributes in authorization policy -->

<!-- Condition: MFC-Identified Apple Devices -->
<condition name="MFC-Apple-Devices">
  <attribute>Endpoint:MFCHardwareManufacturer</attribute>
  <operator>EQUALS</operator>
  <value>Apple Inc.</value>
</condition>

<!-- Condition: MFC-Identified IoT Sensors -->
<condition name="MFC-IoT-Sensors">
  <attribute>Endpoint:MFCEndpointType</attribute>
  <operator>EQUALS</operator>
  <value>IoT Sensor</value>
</condition>

<!-- Authorization Rule using MFC -->
<rule name="MFC-Apple-BYOD">
  <condition>MFC-Apple-Devices AND BYOD-Registered</condition>
  <result>
    <profile>BYOD-Apple-Access</profile>
    <sgt>Employee-BYOD (SGT 16)</sgt>
  </result>
</rule>
```

---

## 3. pxGrid Cloud Integration

### 3.1 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    pxGrid Cloud Architecture                         │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Abhavtech ISE                    Cisco Cloud                      │
│   ┌───────────────┐              ┌─────────────────┐               │
│   │ ISE PAN       │              │ Cisco pxGrid    │               │
│   │ NJ-ISE-01     │──HTTPS:443──►│ Cloud Portal    │               │
│   │               │              │                 │               │
│   │ pxGrid Cloud  │◄─────────────│ Catalyst Cloud  │               │
│   │ Agent (Hermes)│  Pub/Sub     │ Applications    │               │
│   └───────────────┘              └────────┬────────┘               │
│                                           │                         │
│                                           ▼                         │
│                              ┌────────────────────────┐            │
│                              │   Cloud Applications   │            │
│                              ├────────────────────────┤            │
│                              │ • Cisco XDR            │            │
│                              │ • Cisco SecureX        │            │
│                              │ • Cisco Umbrella       │            │
│                              │ • Cisco Secure Access  │            │
│                              │ • Third-party SIEMs    │            │
│                              └────────────────────────┘            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Enabling pxGrid Cloud (ISE 3.4+)

**Step 1: Enable pxGrid Cloud Service**
```
Administration → pxGrid Services → Settings → pxGrid Cloud

pxGrid Cloud Configuration:
  ☑ Enable pxGrid Cloud
  Primary pxGrid Node: NJ-ISE-PXG-01.abhavtech.com
  Secondary pxGrid Node: LON-ISE-PXG-01.abhavtech.com
  
Click "Enable"
```

**Step 2: Register with Cisco Catalyst Cloud Portal**
```
1. Navigate to https://dna.cisco.com
2. Log in with Cisco CCO credentials
3. Subscribe to pxGrid Cloud offer
4. Generate registration token
5. Paste token in ISE
```

**Step 3: Integrate Cloud Applications (ISE 3.4 Native Catalog)**
```
Administration → System → Deployment → Integration Catalog

Available Applications:
  ┌──────────────────┬──────────────┬───────────┐
  │ Application      │ Type         │ Status    │
  ├──────────────────┼──────────────┼───────────┤
  │ Cisco XDR        │ Single       │ Connected │
  │ Cisco Umbrella   │ Single       │ Connected │
  │ Cisco Secure     │ Multi        │ Connected │
  │ ServiceNow       │ Single       │ Pending   │
  └──────────────────┴──────────────┴───────────┘

Click "Onboard" → Select Application → "Connect" → "Activate"
```

### 3.3 pxGrid Direct Visibility

**URL Fetcher Configuration (Pull from CMDB)**
```
Work Centers → Profiler → pxGrid Direct → Connectors

Add Connector:
  Name: ServiceNow-CMDB-Abhavtech
  Type: URL Fetcher
  URL: https://abhavtech.service-now.com/api/now/table/cmdb_ci
  Authentication: OAuth 2.0
  Client ID: ****
  Client Secret: ****
  
  Attribute Mapping:
    ServiceNow Field → ISE Attribute
    ─────────────────────────────────
    sys_id           → AssetID
    name             → AssetName
    asset_tag        → AssetTag
    department       → Department
    location         → Location
    owner            → Owner
    
  Sync Schedule: Every 4 hours
```

**URL Pusher Configuration (ISE 3.4 - Push from External)**
```
Work Centers → Profiler → pxGrid Direct → URL Pusher

Pusher Endpoint:
  URL: https://nj-ise-01.abhavtech.com/api/v1/pxgrid-direct/push
  Authentication: Bearer Token
  
  JSON Payload Format:
  {
    "endpoints": [
      {
        "mac": "AA:BB:CC:DD:EE:FF",
        "attributes": {
          "AssetID": "ASSET-001",
          "Department": "Engineering",
          "Owner": "John Smith",
          "CriticalAsset": "true"
        }
      }
    ]
  }
```

**Sync Now (On-Demand Synchronization)**
```
Work Centers → Profiler → pxGrid Direct → Connectors

Select: ServiceNow-CMDB-Abhavtech
Actions → Sync Now

Sync Options:
  ○ Full Sync (All records)
  ● Incremental Sync (Changed since last sync)
  
Click "Start Sync"
```

---

## 4. Wi-Fi Edge Analytics

### 4.1 Overview

Wi-Fi Edge Analytics leverages device-specific attributes from Cisco Catalyst 9800 WLCs to enhance profiling accuracy.

### 4.2 Configuration

**Step 1: Enable on WLC**
```
! Catalyst 9800 WLC Configuration
!
wireless profile profiling profiling-global
 profiling enable
 http-tlv-caching
 device-classification
!
wireless profiling
 analytics push-timer 60
!
```

**Step 2: Configure ISE Integration**
```
Administration → System → Settings → Profiling

Wi-Fi Edge Analytics:
  ☑ Enable Wi-Fi Edge Analytics
  
  Supported Vendors:
    ☑ Apple (iOS devices)
    ☑ Intel (Windows devices)
    ☑ Samsung (Android devices)
    
  Attribute Collection:
    ☑ Device Model
    ☑ OS Version
    ☑ Firmware Version
    ☑ Hardware Capabilities
```

### 4.3 Enhanced Profiling Attributes

| Attribute | Source | Example Value |
|-----------|--------|---------------|
| Device Model | WLC | iPhone 15 Pro Max |
| OS Version | WLC | iOS 17.2.1 |
| Chipset | WLC | Apple A17 Pro |
| Wi-Fi Capabilities | WLC | Wi-Fi 6E, WPA3 |
| Device Name | WLC | John's iPhone |

---

## 5. Enhanced Security Features

### 5.1 Virtual Tunnel Interface (VTI) Native IPsec

For FIPS 140-3 compliance, ISE 3.4 supports VTI-based IPsec.

```
! ISE CLI Configuration for VTI IPsec
!
interface Tunnel0
 ip address 172.16.0.1 255.255.255.252
 tunnel source GigabitEthernet0
 tunnel destination 10.0.0.1
 tunnel mode ipsec ipv4
 tunnel protection ipsec profile ABHAVTECH-IPSEC
!
crypto ipsec profile ABHAVTECH-IPSEC
 set transform-set AES256-SHA256
 set pfs group21
!
crypto ipsec transform-set AES256-SHA256 esp-aes 256 esp-sha256-hmac
!
```

### 5.2 Endpoint Topics Settings (Data Sharing)

```
Administration → System → Settings → Endpoint Topics

Data Sharing Configuration:
  
  Share with AI Endpoint Analytics:
    ☑ MAC Address
    ☑ IP Address
    ☑ Profiling Attributes
    ☑ Authentication Status
    ☐ User Identity (privacy protected)
  
  Share with pxGrid Cloud:
    ☑ Endpoint Status
    ☑ SGT Assignment
    ☑ Session Information
    ☑ Posture Status
  
  Publish AI Analytics Profiles:
    ☑ Use AI profiles for authorization
    Confidence Threshold: 85%
```

### 5.3 Osquery Conditions (ISE 3.4 Patch 2+)

```
Work Centers → Posture → Policy Elements → Conditions → Osquery

Osquery Condition:
  Name: Antivirus-Running-Check
  Query: |
    SELECT name, state 
    FROM services 
    WHERE name LIKE '%antivirus%' 
    AND state = 'RUNNING'
  
  Expected Result: At least 1 row returned
  
Requirements:
  Compliance Module: 4.3.3394+
  Secure Client: 5.1.7+
```

---

## 6. Operational Improvements

### 6.1 Controlled Application Restart

Reduces ISE reboot time by ~40% through selective service restart.

```
! ISE CLI - Controlled Restart
application restart ise

! Status Check
show application status ise

Expected Output:
ISE PROCESS NAME                       STATE            PROCESS ID
--------------------------------------------------------------------
Database Listener                      running          1234
Database Server                        running          1235
Application Server                     running          1236
Profiler Database                      running          1237
...
Restart Time: 12 minutes (vs 20+ minutes traditional)
```

### 6.2 Split Upgrade

Upgrade PSN nodes independently without full deployment upgrade.

```
Split Upgrade Procedure:
1. Upgrade Secondary PAN first
2. Promote Secondary to Primary
3. Upgrade original Primary (now Secondary)
4. Upgrade PSN nodes in groups
   Group 1: APAC PSNs (MUM, CHE)
   Group 2: EMEA PSNs (LON, FRA)
   Group 3: AMER PSNs (NJ, DAL)
5. Verify each group before proceeding
```

### 6.3 Open TAC Cases from GUI (ISE 3.3+)

```
Administration → System → Support → Open TAC Case

Case Information:
  Severity: 2 - High
  Problem Category: Policy Service
  Problem Description: [Auto-populated from diagnostics]
  
  Attachments:
    ☑ Support Bundle (auto-generated)
    ☑ Diagnostic Report
    
Click "Submit Case"
```

---

## 7. Abhavtech ISE 3.4 Policy Updates

### 7.1 MFC-Enhanced Authorization Policy Set

```
Policy Set: SD-ACCESS-WIRED-MFC
├── Rule: MFC-Known-Corporate-Device
│   Condition: MFCEndpointType EQUALS "Workstation" AND AD-Member
│   Result: Corporate-Full-Access, SGT 10
│
├── Rule: MFC-Known-Mobile-BYOD
│   Condition: MFCHardwareManufacturer IN ("Apple","Samsung") AND BYOD-Reg
│   Result: BYOD-Access, SGT 16
│
├── Rule: MFC-IoT-Sensor-Identified
│   Condition: MFCEndpointType EQUALS "IoT Sensor"
│   Result: IoT-Limited-Access, SGT 50
│
├── Rule: MFC-Camera-Identified
│   Condition: MFCEndpointType EQUALS "IP Camera"
│   Result: Camera-Restricted, SGT 70
│
├── Rule: MFC-Unknown-Cluster-Review
│   Condition: MFCClusterID EXISTS AND MFCConfidence < 80
│   Result: Quarantine-Review, SGT 999
│
└── Default: Continue to standard MAB rules
```

### 7.2 pxGrid Direct Enhanced Conditions

```
<!-- ServiceNow CMDB Attribute Conditions -->

<condition name="CMDB-Critical-Asset">
  <attribute>Endpoint:pxGridDirect:CriticalAsset</attribute>
  <operator>EQUALS</operator>
  <value>true</value>
</condition>

<condition name="CMDB-Executive-Device">
  <attribute>Endpoint:pxGridDirect:Department</attribute>
  <operator>EQUALS</operator>
  <value>Executive</value>
</condition>

<!-- Authorization Rule -->
<rule name="CMDB-Critical-Asset-Access">
  <condition>CMDB-Critical-Asset OR CMDB-Executive-Device</condition>
  <result>
    <profile>Executive-Full-Access</profile>
    <sgt>Executive (SGT 11)</sgt>
    <dacl>PERMIT-ALL-CRITICAL</dacl>
  </result>
</rule>
```

---

## 8. Verification and Monitoring

### 8.1 AI Analytics Dashboard

```
Work Centers → Profiler → Endpoint Analytics → AI Dashboard

Dashboard Metrics:
┌──────────────────────────────────────────────────────────────┐
│ AI Endpoint Analytics Summary                                 │
├──────────────────────────────────────────────────────────────┤
│ Total Endpoints Analyzed: 15,234                             │
│ MFC Classified: 12,456 (81.8%)                               │
│ Pending Review: 342                                          │
│ Unknown Clusters: 18                                         │
│                                                              │
│ Classification Breakdown:                                     │
│   ├── Workstations: 5,234                                    │
│   ├── Mobile Phones: 3,456                                   │
│   ├── Tablets: 1,234                                         │
│   ├── IoT Devices: 1,876                                     │
│   ├── Printers: 456                                          │
│   └── Other: 200                                             │
└──────────────────────────────────────────────────────────────┘
```

### 8.2 pxGrid Cloud Status

```
Administration → pxGrid Services → pxGrid Cloud → Status

Connection Status:
  Primary Node: NJ-ISE-PXG-01.abhavtech.com - Connected
  Secondary Node: LON-ISE-PXG-01.abhavtech.com - Connected
  
  Hermes Process: Running (PID: 12345)
  Last Heartbeat: 2 seconds ago
  
Cloud Applications:
  ├── Cisco XDR: Active, 1,234 events/hour
  ├── Cisco Umbrella: Active, DNS integration
  └── Cisco Secure Access: Active, ZTNA policies synced
```

---

## 9. Migration Checklist

### 9.1 ISE 3.1/3.2 to ISE 3.4 Upgrade

```yaml
Pre_Upgrade_Checklist:
  - [ ] Backup current ISE configuration
  - [ ] Verify hardware compatibility (SNS 3700 series recommended)
  - [ ] Check license status (Advantage required for AI Analytics)
  - [ ] Document current policy configuration
  - [ ] Schedule maintenance window (4-6 hours)
  - [ ] Notify stakeholders

Upgrade_Steps:
  - [ ] Upgrade Secondary PAN to 3.4
  - [ ] Promote Secondary to Primary
  - [ ] Upgrade original Primary
  - [ ] Upgrade PSN nodes (split by region)
  - [ ] Enable new 3.4 features
  - [ ] Verify all integrations

Post_Upgrade_Validation:
  - [ ] All nodes healthy in deployment
  - [ ] RADIUS authentication working
  - [ ] pxGrid services operational
  - [ ] Catalyst Center integration verified
  - [ ] AI Analytics connected to cloud
  - [ ] New features functional
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
