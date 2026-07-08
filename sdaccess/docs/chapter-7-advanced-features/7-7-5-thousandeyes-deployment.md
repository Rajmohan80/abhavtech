# 7.7.5 ThousandEyes Enterprise Deployment

## Document Information
| Item | Details |
|------|---------|
| Organization | Abhavtech.com |
| Domain | abhavtech.com |
| Version | 2.0 |
| Last Updated | December 2025 |

---

## 1. ThousandEyes Integration Overview

### 1.1 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│              Abhavtech ThousandEyes Architecture                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                    ┌─────────────────────┐                          │
│                    │  ThousandEyes Cloud │                          │
│                    │     Portal          │                          │
│                    └──────────┬──────────┘                          │
│                               │                                      │
│       ┌───────────────────────┼───────────────────────┐             │
│       │                       │                       │             │
│       ▼                       ▼                       ▼             │
│ ┌───────────┐          ┌───────────┐          ┌───────────┐        │
│ │   APAC    │          │   EMEA    │          │   AMER    │        │
│ │  Agents   │          │  Agents   │          │  Agents   │        │
│ └───────────┘          └───────────┘          └───────────┘        │
│                                                                     │
│ Agent Types:                                                        │
│ • Cat 9300/9400 (Campus)                                           │
│ • Cat 8300/8200 (SD-WAN)                                           │
│ • Endpoint Agents (Laptops)                                        │
│ • Cloud Agents (ThousandEyes hosted)                               │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### 1.2 Agent Deployment Summary

| Site | Cat 9300/9400 Agents | SD-WAN Agents | Endpoint Agents |
|------|---------------------|---------------|-----------------|
| Mumbai | 8 | 2 | 500 |
| Chennai | 4 | 2 | 300 |
| London | 6 | 2 | 400 |
| Frankfurt | 4 | 1 | 200 |
| New Jersey | 10 | 2 | 600 |
| Dallas | 4 | 2 | 300 |
| **Total** | **36** | **11** | **2,300** |

---

## 2. Catalyst Center Integration

### 2.1 ThousandEyes Token Configuration

**Step 1: Get Account Group Token**
```
ThousandEyes Portal → Cloud & Enterprise Agents → Agent Settings
→ Add New Enterprise Agent → Cisco Application Hosting

Copy: Account Group Token
Token: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Step 2: Configure Catalyst Center Integration**
```
Catalyst Center → System → Settings → External Services → ThousandEyes

ThousandEyes Integration:
  Account Token: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Status: ✓ Connected
  
Click "Save"
```

### 2.2 Agent Image Upload

```
Catalyst Center → Provision → App Hosting for Switches

Step 1: Import Agent Image
  Click "Import Application"
  Select: thousandeyes-enterprise-agent-4.x.x.tar
  
Step 2: Configure Application
  Name: ThousandEyes-Agent
  Version: 4.x.x
  Platform: Catalyst 9300/9400
  
Step 3: Configure Runtime Options
  Account Token: <paste token>
  Hostname Prefix: te-agent
```

---

## 3. Catalyst 9300/9400 Agent Deployment

### 3.1 Prerequisites

```yaml
Prerequisites:
  Hardware:
    - Catalyst 9300-24UX, 9300-48UXM or 9400 (with Sup 1)
    - Minimum 8GB RAM
    - SSD recommended (or 8GB+ flash)
    
  Software:
    - IOS-XE 17.3.3+ (9300)
    - IOS-XE 17.5.1+ (9400)
    
  Licensing:
    - DNA Advantage subscription
    - ThousandEyes units included (22 units/month per agent)
    
  Network:
    - HTTPS access to ThousandEyes cloud
    - Management VLAN connectivity
```

### 3.2 Catalyst Center Deployment Workflow

**Step 1: Navigate to App Hosting**
```
Provision → App Hosting for Switches → Service Catalog
```

**Step 2: Select Devices**
```
Select switches for agent deployment:
  ☑ MUM-ED-01.abhavtech.com (9300-48UXM)
  ☑ MUM-ED-02.abhavtech.com (9300-48UXM)
  ☑ MUM-DIST-01.abhavtech.com (9400)
  ...
```

**Step 3: Configure Agent Settings**
```
Application: ThousandEyes-Agent
Version: 4.x.x

Agent Configuration:
  Agent Name: {{device_hostname}}-te
  Account Token: <auto-populated>
  
  Network:
    Interface VLAN: 100 (Management)
    IP Assignment: DHCP
    
  Resources:
    CPU: 2 cores
    Memory: 2048 MB
    Storage: 2048 MB
```

**Step 4: Deploy**
```
Click "Deploy" → Monitor progress
Expected Time: 5-10 minutes per device
```

### 3.3 Manual CLI Deployment (Alternative)

```
! Enable IOx
MUM-ED-01# configure terminal
MUM-ED-01(config)# iox

! Configure App Hosting
MUM-ED-01(config)# app-hosting appid ThousandEyes
MUM-ED-01(config-app-hosting)# app-vnic AppGigabitEthernet trunk
MUM-ED-01(config-config-app-hosting-trunk)# vlan 100 guest-interface 0
MUM-ED-01(config-config-app-hosting-trunk)# guest-ipaddress 10.100.0.200 netmask 255.255.255.0
MUM-ED-01(config-config-app-hosting-trunk)# exit
MUM-ED-01(config-app-hosting)# app-default-gateway 10.100.0.1 guest-interface 0
MUM-ED-01(config-app-hosting)# app-resource docker
MUM-ED-01(config-app-hosting-docker)# run-opts "--hostname=mum-ed-01-te"
MUM-ED-01(config-app-hosting-docker)# run-opts "-e TEAGENT_ACCOUNT_TOKEN=<token>"
MUM-ED-01(config-app-hosting-docker)# exit
MUM-ED-01(config-app-hosting)# start
MUM-ED-01(config-app-hosting)# end

! Verify
MUM-ED-01# show app-hosting list
App id                           State
----------------------------------------------
ThousandEyes                     RUNNING
```

---

## 4. Test Configuration

### 4.1 Network Tests

```yaml
Network_Tests:

  Test_1_Internal_Reachability:
    Type: Agent-to-Agent
    Source: Mumbai Agents
    Target: All regional agents
    Protocol: ICMP, TCP/443
    Interval: 5 minutes
    Alerts: Latency > 100ms, Loss > 1%
    
  Test_2_DC_Connectivity:
    Type: Network - Agent to Server
    Source: All campus agents
    Targets:
      - dc-core.abhavtech.com (10.100.100.1)
      - sap.abhavtech.com (10.100.100.50)
    Protocol: TCP/443
    Interval: 2 minutes
    
  Test_3_Underlay_Path:
    Type: Path Visualization
    Source: Branch agents (SD-WAN)
    Target: Data center
    Protocol: ICMP
    Shows: Hop-by-hop latency, loss, jitter
```

### 4.2 SaaS Application Tests

```yaml
SaaS_Tests:

  Test_Microsoft365:
    Type: Web - HTTP Server
    URL: https://outlook.office365.com
    Agents: All enterprise agents
    Interval: 5 minutes
    Metrics: Response time, availability
    Alerts: Response > 2000ms
    
  Test_Salesforce:
    Type: Web - HTTP Server
    URL: https://abhavtech.my.salesforce.com
    Agents: All enterprise agents
    Interval: 5 minutes
    
  Test_Webex:
    Type: Web - HTTP Server
    URL: https://webex.com
    Agents: All enterprise agents
    Interval: 2 minutes
    SLA: 99.9% availability
```

### 4.3 Voice/Video Quality Tests

```yaml
Voice_Video_Tests:

  Test_Webex_Media:
    Type: Voice - RTP Stream
    Target: Webex Media servers
    Codec: G.711
    Duration: 30 seconds
    Interval: 10 minutes
    Metrics: MOS, latency, jitter, loss
    Alert: MOS < 3.5
    
  Test_Teams_Quality:
    Type: Voice - RTP Stream  
    Target: Microsoft Teams edge servers
    Codec: G.711
    Alert: Jitter > 30ms, Loss > 1%
```

---

## 5. SD-WAN Integration

### 5.1 Agent on Catalyst SD-WAN Routers

```
! Catalyst 8300 SD-WAN ThousandEyes Configuration
!
app-hosting appid ThousandEyes
 app-vnic AppGigabitEthernet trunk
  vlan 1 guest-interface 0
  guest-ipaddress 10.106.1.200 netmask 255.255.255.0
 app-default-gateway 10.106.1.1 guest-interface 0
 app-resource profile custom
  cpu 2000
  memory 2048
  persist-disk 2048
 app-resource docker
  run-opts "-e TEAGENT_ACCOUNT_TOKEN=<token>"
  run-opts "--hostname dallas-sdwan-te"
 start
!
```

### 5.2 Overlay vs Underlay Visibility

```
┌─────────────────────────────────────────────────────────────────────┐
│           SD-WAN Path Visibility with ThousandEyes                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   Branch (Dallas)              Underlay Path              Hub (NJ)  │
│   ┌───────────┐               ┌─────────┐              ┌──────────┐│
│   │ C8300     │═══Overlay════▶│ SD-WAN  │═══Overlay═══▶│ C8300    ││
│   │ TE Agent  │               │ Fabric  │              │ TE Agent ││
│   └─────┬─────┘               └────┬────┘              └────┬─────┘│
│         │                          │                        │      │
│         │    ┌─────────────────────┘                        │      │
│         │    │                                              │      │
│         │    ▼ Underlay Hops Visible                        │      │
│         │    ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐           │      │
│         └───▶│ ISP  │→│ POP  │→│ MPLS │→│ ISP  │──────────▶│      │
│              │ Edge │ │Router│ │ Core │ │ Edge │           │      │
│              └──────┘ └──────┘ └──────┘ └──────┘           │      │
│                                                                     │
│   ThousandEyes shows:                                              │
│   • Overlay tunnel status                                          │
│   • Underlay path (all L3 hops)                                    │
│   • Per-hop latency and loss                                       │
│   • BGP routing changes                                            │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Alerting and Integration

### 6.1 Alert Configuration

```
ThousandEyes → Alerts → Alert Rules

Alert Rule: Critical-Application-Degradation
  Tests: Microsoft365, Salesforce, SAP
  Conditions:
    - Availability < 99%
    - Response Time > 3000ms
    - Packet Loss > 5%
  
  Notifications:
    - Email: noc@abhavtech.com
    - Webex Teams: #network-alerts
    - PagerDuty: Production-NOC
    
Alert Rule: Network-Path-Change
  Tests: All network tests
  Conditions:
    - Path change detected
    - New hop introduced
    - BGP route change
    
  Notifications:
    - Email: network-team@abhavtech.com
```

### 6.2 Webex Integration

```
ThousandEyes → Integrations → Webex Teams

Webex Configuration:
  Bot Token: ************************
  Space: #thousandeyes-alerts
  
  Alert Format:
    ┌────────────────────────────────────────┐
    │ 🚨 ThousandEyes Alert                   │
    ├────────────────────────────────────────┤
    │ Test: Microsoft365 Availability        │
    │ Agent: mum-ed-01-te                    │
    │ Issue: Response time 4500ms            │
    │ Time: 2025-12-26 14:32:00 UTC         │
    │                                        │
    │ [View in ThousandEyes]                 │
    └────────────────────────────────────────┘
```

### 6.3 Splunk Integration

```
ThousandEyes → Integrations → Splunk

Splunk HEC Configuration:
  URL: https://splunk.abhavtech.com:8088
  Token: ************************
  Index: thousandeyes
  
Data Exported:
  - Test results (JSON)
  - Alert events
  - Path trace data
  - Agent status
```

---

## 7. Dashboard and Reporting

### 7.1 Executive Dashboard

```
ThousandEyes → Dashboards → Abhavtech Executive

┌──────────────────────────────────────────────────────────────┐
│ Application Experience Summary                                │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│ Overall Health: 94.2% ████████████████░░░░                   │
│                                                              │
│ Application     Availability  Response Time  Status         │
│ ────────────────────────────────────────────────────────    │
│ Microsoft 365   99.9%         245ms          ✅ Healthy     │
│ Salesforce      99.8%         312ms          ✅ Healthy     │
│ SAP ERP         99.5%         456ms          ✅ Healthy     │
│ Webex           99.9%         123ms          ✅ Healthy     │
│ AWS (us-east)   99.7%         89ms           ✅ Healthy     │
│                                                              │
│ Active Alerts: 2                                             │
│ • High latency to APAC from Mumbai (investigating)          │
│ • Packet loss on Dallas MPLS link (ISP notified)           │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 8. Troubleshooting

### 8.1 Common Issues

| Issue | Cause | Resolution |
|-------|-------|------------|
| Agent offline | Network connectivity | Check VLAN, gateway, firewall |
| No data | Token mismatch | Verify account token |
| High CPU on switch | Insufficient resources | Increase CPU/memory allocation |
| Test failures | Target unreachable | Verify firewall rules |

### 8.2 Verification Commands

```
! Check agent status
show app-hosting list
show app-hosting detail appid ThousandEyes

! Check container networking
show app-hosting resource

! Check logs
app-hosting connect appid ThousandEyes session
root@agent# te-agent -s  # Status
root@agent# cat /var/log/te-agent.log
```

---

*Document Version: 2.0*
*Abhavtech.com - SD-Access Implementation*
