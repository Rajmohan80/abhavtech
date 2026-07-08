# CHAPTER 8: INTEGRATION WITH PHASE 2 AI-ENABLED OBSERVABILITY

## 8.1 AI Observability Integration Overview

### 8.1.1 Phase 2 AI Observability Recap

**Abhavtech's Phase 2 AI-Enabled Observability** (deployed Q3-Q4 2024) established intelligent network monitoring using AI/ML:

**Core Components:**
- **Splunk Enterprise 9.x + MLTK**: Anomaly detection, predictive analytics
- **ThousandEyes**: Internet/WAN path visibility, WiFi experience monitoring
- **AppDynamics + Cognition Engine**: Application performance monitoring (APM)
- **DNAC Assurance + AI Network Analytics**: Network health prediction

**Phase 5 Integration Goal**: Extend AI observability to WiFi 7 infrastructure with enhanced telemetry.

---

### 8.1.2 WiFi 7 Telemetry Enhancements

**New WiFi 7 Metrics (vs WiFi 6):**

| Metric Category | WiFi 6 Telemetry | WiFi 7 Enhanced Telemetry | Use Case |
|----------------|------------------|---------------------------|----------|
| **MLO Link Status** | N/A (single link) | Link 0 (5 GHz) + Link 1 (6 GHz) status, RSSI, PHY rate | Failover detection, load balancing analysis |
| **Channel Width** | 80/160 MHz | 320 MHz (6 GHz) | Capacity planning, interference detection |
| **Modulation** | 1024-QAM max | 4096-QAM (WiFi 7) | Signal quality correlation with throughput |
| **Multi-RU** | N/A | Multi-RU efficiency (concurrent client allocation) | AP capacity optimization |
| **AP Load** | Client count | Client count + aggregate throughput per AP | Hotspot identification |

---

## 8.2 Splunk Integration (WiFi 7 Analytics)

### 8.2.1 Splunk Data Sources

**WiFi 7 Telemetry Ingestion:**

```yaml
Data Source 1: ISE pxGrid (Client Context)
  Index: ise_pxgrid
  Sourcetype: ise:session
  Frequency: Real-time (event-driven)
  Volume: ~50 events/sec (1,420 WiFi 7 clients × session events)
  
  Key Fields:
    - userName (john.exec@abhavtech.com)
    - macAddress (AA:BB:CC:DD:EE:FF)
    - ipAddress (10.252.10.55)
    - sgt (11 = Executives)
    - ssid (Corp-Secure-7)
    - apName (MUM-F6-AP01)
    - mloEnabled (true/false)
    - rssi (-58 dBm)
    - phyRate (5764 Mbps)

Data Source 2: WLC Syslog (AP Events)
  Index: wlc_logs
  Sourcetype: cisco:wlc
  Frequency: Real-time (syslog UDP 514)
  Volume: ~200 events/sec
  
  Key Events:
    - Client association/disassociation
    - AP channel changes (RRM)
    - MLO link failover
    - Client roaming (inter-AP)

Data Source 3: DNAC Telemetry (via REST API)
  Index: dnac_telemetry
  Sourcetype: dnac:assurance
  Frequency: Polling (every 5 minutes)
  Volume: Batch (all clients, APs pulled every 5 min)
  
  Key Metrics:
    - Client health score (0-10)
    - AP channel utilization (%)
    - Client throughput (Mbps)
    - Client latency (ms)
    - Onboarding time (seconds)

Data Source 4: Fabric Edge Switch Logs (SGACL)
  Index: fabric_logs
  Sourcetype: cisco:aci
  Frequency: Real-time (syslog)
  Volume: ~500 events/sec (all SGACL permit/deny)
  
  Key Events:
    - SGACL permit: SGT 11 → SGT 80
    - SGACL deny: SGT 16 → SGT 80 (contractor blocked)
```

---

### 8.2.2 Splunk Dashboards (WiFi 7 Monitoring)

**Dashboard 1: WiFi 7 Real-Time Health**

```splunk
# Panel 1: Active WiFi 7 Clients (Live Count)
index=ise_pxgrid sourcetype=ise:session ssid="Corp-Secure-7" 
| stats dc(macAddress) as active_clients

# Expected Output: 1,420 clients ✓

# Panel 2: Average PHY Rate (6 GHz, 320 MHz)
index=ise_pxgrid ssid="Corp-Secure-7" mloEnabled=true
| stats avg(phyRate) as avg_phy_rate by apName
| sort -avg_phy_rate
| head 10

# Expected Output:
# MUM-F6-AP01: 5,124 Mbps ✓ (excellent)
# MUM-F6-AP02: 4,987 Mbps ✓
# ...

# Panel 3: Client RSSI Distribution (Heatmap)
index=ise_pxgrid ssid="Corp-Secure-7"
| bin rssi span=5
| stats count by rssi
| sort rssi

# Output: Histogram showing most clients between -55 to -65 dBm ✓

# Panel 4: MLO Link Failover Events (Last 24 Hours)
index=wlc_logs sourcetype=cisco:wlc "MLO failover"
| stats count by apName, clientMac
| sort -count

# Output: Identify APs with frequent failovers (channel interference?)
# MUM-F3-AP05: 12 failovers (investigate Ch 31 interference)

# Panel 5: Top 10 Bandwidth Consumers
index=ise_pxgrid ssid="Corp-Secure-7"
| stats sum(bytesTransferred) as total_bytes by userName
| eval total_GB = round(total_bytes / 1024 / 1024 / 1024, 2)
| sort -total_GB
| head 10

# Output:
# john.exec@abhavtech.com: 125 GB (heavy user)
# jane.vp@abhavtech.com: 98 GB
# ...
```

---

**Dashboard 2: WiFi 7 Anomaly Detection (MLTK)**

```splunk
# Use Splunk MLTK (Machine Learning Toolkit) for anomaly detection

# Model 1: Predict Client Throughput (Detect Degradation)
| inputlookup wifi7_client_baseline.csv
| fit DensityFunction phyRate by apName into wifi7_throughput_model

# Apply model to live data (detect outliers)
index=ise_pxgrid ssid="Corp-Secure-7"
| apply wifi7_throughput_model
| where outlier=1
| table userName, macAddress, apName, phyRate, expected_phyRate

# Output: Clients with abnormal throughput (performance issues)
# user456@abhavtech.com: 1.2 Gbps (expected: 4.5 Gbps) ← Investigate

# Model 2: Predict AP Channel Utilization (Capacity Planning)
index=dnac_telemetry sourcetype=dnac:assurance
| stats avg(channelUtilization) as util by apName, _time
| timechart span=1h avg(util) by apName
| predict "MUM-F6-AP01" as predicted_util algorithm=LLP future_timespan=24

# Output: Predicted channel utilization for next 24 hours
# If predicted_util >80% → Alert: "MUM-F6-AP01 will be saturated in 8 hours"

# Model 3: Anomaly Detection (Client Roaming Patterns)
index=wlc_logs sourcetype=cisco:wlc "client roaming"
| stats count as roam_count by clientMac, _time
| streamstats window=24 avg(roam_count) as baseline by clientMac
| eval anomaly = if(roam_count > baseline * 3, 1, 0)
| where anomaly=1

# Output: Clients with abnormal roaming (potential RF issues or client issues)
# Client AA:BB:CC:DD:EE:FF: 45 roams/hour (baseline: 5 roams/hour) ← Investigate
```

---

### 8.2.3 Splunk Alerts (Proactive Monitoring)

**Alert 1: WiFi 7 Client Performance Degradation**

```splunk
# Alert Trigger: Client PHY rate drops below 2 Gbps (50% of target)

index=ise_pxgrid ssid="Corp-Secure-7" phyRate<2000
| stats count by userName, macAddress, apName, rssi, phyRate
| where count > 3  # Sustained degradation (3+ samples in 5 min)

# Alert Action:
#   1. Create ServiceNow ticket (P3)
#   2. Send Slack notification to #wifi-ops
#   3. Email: network-ops@abhavtech.com

# Alert Message:
# "WiFi 7 Performance Alert: john.exec@abhavtech.com
#  AP: MUM-F6-AP01, PHY Rate: 1.8 Gbps (expected: 4.5 Gbps)
#  RSSI: -78 dBm (poor signal)
#  Action: Relocate user closer to AP or investigate channel interference"
```

**Alert 2: High AP Channel Utilization**

```splunk
# Alert Trigger: AP channel utilization >70% (approaching saturation)

index=dnac_telemetry sourcetype=dnac:assurance channelUtilization>70
| stats avg(channelUtilization) as avg_util by apName
| where avg_util > 70

# Alert Action:
#   1. DNAC RRM: Trigger dynamic channel assignment (move to less congested channel)
#   2. Create ServiceNow ticket (P4): "Consider adding AP to relieve MUM-F6-AP01"
#   3. Slack notification to #wifi-ops

# Alert Message:
# "High Channel Utilization Alert: MUM-F6-AP01
#  Channel: 31 (6 GHz, 320 MHz), Utilization: 78%
#  Clients: 22 (approaching 25-client recommended max)
#  Action: DNAC RRM auto-adjusting channel or add AP"
```

**Alert 3: MLO Link Failover Storm**

```splunk
# Alert Trigger: >10 MLO failovers in 10 minutes (same client)

index=wlc_logs sourcetype=cisco:wlc "MLO failover"
| bucket _time span=10m
| stats count as failover_count by clientMac, _time
| where failover_count > 10

# Alert Action:
#   1. Create ServiceNow ticket (P2): "Client experiencing frequent MLO failovers"
#   2. Email: wifi-support@abhavtech.com
#   3. Automatic remediation: Disable MLO for this client (fallback to single-link)

# Alert Message:
# "MLO Failover Storm: Client AA:BB:CC:DD:EE:FF
#  Failovers: 15 (last 10 minutes)
#  Likely Cause: 6 GHz channel interference or client WiFi driver issue
#  Action: Disabled MLO for client, recommend driver update"
```

---

## 8.3 ThousandEyes Integration (WiFi Experience Monitoring)

### 8.3.1 ThousandEyes Enterprise Agent Deployment

**WiFi 7 Monitoring Strategy:**

```yaml
Agent Deployment:
  Location: Mumbai HQ Floor 6 (Executive Floor)
  Device: Cisco Catalyst 9300 (wired, monitoring wireless endpoints)
  Agent Type: Enterprise Agent (Docker container on C9300)
  
  Tests Configured:
    1. HTTP Server Test (WiFi 7 Client → Internet)
       Target: https://www.google.com
       Interval: 2 minutes
       Metrics: Response time, availability, packet loss
    
    2. Network Test (WiFi 7 Client → Corporate Server)
       Target: 10.252.80.10 (Application Server, SGT 80)
       Protocol: ICMP (ping)
       Interval: 1 minute
       Metrics: Latency, packet loss, jitter
    
    3. WiFi Experience Test (SSID: Corp-Secure-7)
       Target: Corp-Secure-7 SSID (6 GHz, 320 MHz)
       Interval: 5 minutes
       Metrics: RSSI, channel utilization, client count, throughput

Alerting:
  • Latency >20ms sustained (5 min): Email wifi-ops@abhavtech.com
  • Packet loss >1%: Create ServiceNow ticket (P3)
  • WiFi availability <99%: Escalate to P2
```

---

### 8.3.2 ThousandEyes WiFi 7 Dashboards

**Dashboard: WiFi 7 End-User Experience**

```yaml
View 1: Path Visualization (WiFi → Internet)
  • Hop-by-hop latency from WiFi 7 client to google.com
  • Visualize: WiFi 7 AP → Fabric Edge → Border → FTD Firewall → Internet
  
  Expected Latency Breakdown:
    WiFi 7 (client → AP): 3-5ms ✓
    AP → Fabric Edge: 1ms
    Fabric Edge → Border: 2ms
    Border → FTD: 1ms
    FTD → Internet: 8-12ms (varies)
    Total: 15-21ms ✓

View 2: WiFi Signal Quality (RSSI Heatmap)
  • Floor plan overlay: Show RSSI per location (Mumbai Floor 6)
  • Color coding: Green (-50 to -60 dBm), Yellow (-60 to -70 dBm), Red (<-70 dBm)
  • Identify: Dead zones (RSSI <-70 dBm) requiring additional APs

View 3: Throughput Timeline (Last 24 Hours)
  • Line graph: Aggregate WiFi 7 client throughput (Gbps)
  • Peak usage: 9-11 AM (executives arrive), 2-4 PM (afternoon meetings)
  • Trough usage: 12-1 PM (lunch), 6 PM+ (off-hours)
  
  Insights:
    • Peak throughput: 180 Gbps (40 APs × 4.5 Gbps avg) ✓
    • Average: 120 Gbps
    • Capacity headroom: 60% (comfortable)
```

---

### 8.3.3 ThousandEyes Alerts (WiFi SLA Monitoring)

**Alert 1: WiFi 7 Latency SLA Violation**

```yaml
Alert Name: WiFi-7-Latency-SLA-Violation
Trigger: Latency >20ms sustained for 5 minutes
Target: Corp-Secure-7 SSID, Mumbai Floor 6

Alert Conditions:
  • Metric: End-to-end latency (client → server)
  • Threshold: >20ms
  • Duration: 5 consecutive samples (5 minutes)

Alert Actions:
  1. Email: wifi-ops@abhavtech.com
  2. Slack: #wifi-alerts channel
  3. ServiceNow: Create P3 ticket
  4. Webhooks: Trigger DNAC API to check AP health

Alert Message:
  "ThousandEyes Alert: WiFi 7 Latency SLA Violation
   Location: Mumbai Floor 6
   SSID: Corp-Secure-7
   Current Latency: 28ms (SLA: <20ms)
   Duration: 5 minutes
   Recommended Action: Check AP MUM-F6-AP01 channel interference"
```

**Alert 2: WiFi 7 Availability SLA Violation**

```yaml
Alert Name: WiFi-7-Availability-SLA-Violation
Trigger: SSID availability <99% (calculated over 24 hours)

Alert Conditions:
  • Metric: SSID availability (% of time clients can connect)
  • Threshold: <99%
  • Window: 24-hour rolling average

Alert Actions:
  1. Email: CTO, Network Director (executive escalation)
  2. ServiceNow: Create P1 ticket (critical)
  3. PagerDuty: Page on-call network engineer

Alert Message:
  "CRITICAL: WiFi 7 Availability SLA Violation
   SSID: Corp-Secure-7
   Availability: 98.2% (SLA: 99%)
   Downtime: 17 minutes (last 24 hours)
   Root Cause: [Investigate WLC/AP failures]"
```

---

## 8.4 AppDynamics Integration (Application Performance)

### 8.4.1 AppDynamics + Cognition Engine

**WiFi 7 + Application Performance Correlation:**

```yaml
AppDynamics Deployment:
  • Agents: Installed on application servers (10.252.80.x)
  • Monitored Apps: SharePoint, Webex, VDI (VMware Horizon), Salesforce
  • WiFi Correlation: AppDynamics correlates slow app response with WiFi client metrics

Cognition Engine (AI/ML):
  • Baseline: Normal app response time for WiFi 7 clients (2-5 sec)
  • Anomaly Detection: Detect when app response time >10 sec (abnormal)
  • Root Cause Analysis: Correlate with WiFi metrics (RSSI, PHY rate, packet loss)
  
  Example Correlation:
    • User: john.exec@abhavtech.com
    • App: SharePoint document load time: 18 seconds (baseline: 3 seconds)
    • WiFi Metrics (from DNAC via API):
      - RSSI: -82 dBm (poor signal) ← Root cause
      - PHY Rate: 1.1 Gbps (degraded from 4.5 Gbps)
    • AppDynamics Verdict: "Slow app performance due to poor WiFi signal"
    • Recommendation: "User should move closer to AP or switch to wired connection"
```

---

### 8.4.2 AppDynamics Business Transactions (WiFi Context)

**Business Transaction: Webex Meeting Join Time**

```yaml
Transaction Definition:
  • Start: User clicks "Join Webex Meeting" button
  • End: Video/audio connected, meeting active
  • Target: <5 seconds (90th percentile)

WiFi 7 Impact:
  • Wired Clients: 3.2 seconds (baseline)
  • WiFi 7 Clients (Good Signal, RSSI >-65 dBm): 3.8 seconds ✓
  • WiFi 7 Clients (Poor Signal, RSSI <-75 dBm): 8.5 seconds ✗

AppDynamics Dashboard:
  • Metric: Webex Join Time by Network Type (Wired vs WiFi 7)
  • Visualization: Box plot showing distribution
  • Insight: WiFi 7 clients with RSSI >-65 dBm perform nearly identical to wired ✓
  • Action: Ensure 90% of WiFi 7 clients have RSSI >-65 dBm (AP density)
```

---

**Business Transaction: VDI Login Time**

```yaml
Transaction Definition:
  • Start: User launches VMware Horizon client
  • End: Windows 10 VDI desktop fully loaded
  • Target: <15 seconds (90th percentile)

WiFi 7 Impact:
  • Wired Clients: 12 seconds (baseline)
  • WiFi 7 Clients (320 MHz, MLO): 13 seconds ✓ (comparable)
  • WiFi 6 Clients (80 MHz): 22 seconds (significantly slower)

AppDynamics + Cognition Engine Insight:
  • WiFi 7 (4.5 Gbps) delivers wired-like VDI performance ✓
  • WiFi 6 (1.2 Gbps) insufficient for VDI (>15 sec load time)
  • Recommendation: Prioritize WiFi 7 migration for VDI users (engineers, executives)
```

---

### 8.4.3 AppDynamics Alerts (App Performance + WiFi)

**Alert: Slow App Performance Correlated with WiFi Degradation**

```yaml
Alert Name: App-Performance-WiFi-Correlation
Trigger: Application response time >2× baseline AND WiFi RSSI <-70 dBm

Alert Logic:
  1. AppDynamics detects slow SharePoint response (>10 seconds)
  2. Query DNAC API: Get user's WiFi metrics (RSSI, PHY rate, AP name)
  3. If RSSI <-70 dBm → Root cause likely WiFi signal
  4. Create ticket with context: "User experiencing slow app due to poor WiFi signal"

Alert Actions:
  1. ServiceNow: Auto-create ticket (P4)
  2. Email: User + IT support
  3. Suggested Remediation: "Move closer to AP or switch to wired"

Alert Message:
  "User: john.exec@abhavtech.com
   Issue: Slow SharePoint performance (18 sec load time, baseline: 3 sec)
   Root Cause: Poor WiFi signal (RSSI: -82 dBm, AP: MUM-F6-AP01)
   Recommendation: User should relocate to improve signal or use wired connection"
```

---

## 8.5 DNAC AI Network Analytics

### 8.5.1 DNAC Assurance + AI

**DNAC AI-Powered Features (WiFi 7):**

```yaml
Feature 1: Client Health Score (0-10)
  • AI Model: Predicts client health based on 50+ metrics
  • Inputs: RSSI, SNR, packet loss, retry rate, roaming frequency, onboarding time
  • Output: Health score 0 (critical) to 10 (excellent)
  
  WiFi 7 Client Example:
    • User: john.exec@abhavtech.com
    • RSSI: -58 dBm (excellent)
    • SNR: 42 dB (excellent)
    • Packet Loss: 0.01% (excellent)
    • Health Score: 9.5/10 ✓ (healthy)

Feature 2: Predictive Issue Detection
  • AI Model: Predicts client issues 10-15 minutes before they occur
  • Example: RSSI trending downward (-58 → -68 → -75 dBm over 10 min)
  • Prediction: "Client will lose connectivity in 8 minutes if trend continues"
  • Action: Proactive alert to user or auto-roam to better AP

Feature 3: Network Health Heatmap
  • AI Model: Aggregates all client health scores by location (floor, AP)
  • Visualization: Color-coded floor plan (green/yellow/red)
  • Insight: Identify problem areas (red zones = poor WiFi coverage)
  
  Mumbai Floor 6 Example:
    • North Wing: 95% clients health score >8 (green) ✓
    • South Wing: 60% clients health score <5 (red) ✗ ← Add AP

Feature 4: RRM Optimization (Radio Resource Management)
  • AI Model: Dynamically adjusts AP channels, transmit power
  • Objective: Maximize client health scores, minimize interference
  • WiFi 7 Enhancement: Optimizes 320 MHz channel allocation (Ch 31, 63, 95)
  
  Example:
    • Before RRM: MUM-F6-AP01 on Ch 31, high interference from neighboring AP
    • After RRM: MUM-F6-AP01 moved to Ch 63, interference reduced 40%
    • Result: Client health scores improved 8.2 → 9.5 ✓
```

---

### 8.5.2 DNAC Dashboards (AI-Powered Insights)

**Dashboard: Network Health (AI-Driven)**

```yaml
Panel 1: Overall Network Health Score (0-10)
  • Aggregates all client health scores (1,420 WiFi 7 clients)
  • Score: 8.9/10 ✓ (healthy)
  • Trend: +0.3 (improving over last 24 hours)

Panel 2: Top 10 Unhealthy Clients
  • AI identifies clients with health score <5
  • Example:
    - user789@abhavtech.com: Score 3.2 (RSSI -82 dBm, poor signal)
    - Action: Recommend relocation or wired fallback

Panel 3: Predicted Issues (Next 1 Hour)
  • AI predicts 3 clients will experience connectivity issues
  • Example:
    - Client AA:BB:CC:DD:EE:FF: Predicted disconnect in 22 minutes
    - Reason: RSSI trending downward (-65 → -78 dBm in last 15 min)
    - Recommended Action: Proactive roam to MUM-F6-AP02

Panel 4: RRM Optimization History
  • Timeline: Shows RRM channel changes over last 7 days
  • Impact: Channel utilization reduced from 75% → 45% (RRM optimization)
  • Result: Client health scores improved ✓
```

---

### 8.5.3 DNAC AI Alerts (Predictive)

**Alert: Predicted Client Disconnect**

```yaml
Alert Name: DNAC-AI-Predicted-Disconnect
Trigger: AI model predicts client will lose connectivity in <10 minutes

Alert Logic:
  1. AI analyzes client metrics (RSSI, SNR, packet loss trends)
  2. If RSSI dropping rapidly (>10 dBm in 5 min) → Predict disconnect
  3. Trigger proactive alert before client actually disconnects

Alert Actions:
  1. Email: User (john.exec@abhavtech.com)
  2. Push Notification: "Your WiFi signal is degrading, please move closer to AP"
  3. Auto-Remediation: DNAC triggers proactive roam to better AP

Alert Message:
  "DNAC AI Alert: Your WiFi connection may drop soon
   Current RSSI: -76 dBm (poor)
   Trend: Degrading (-58 → -76 dBm in last 10 minutes)
   Recommended Action: Move closer to AP MUM-F6-AP01 or switch to MUM-F6-AP02"
```

---

## 8.6 Cross-Platform Correlation (Unified Observability)

### 8.6.1 Integration Architecture

**Unified Observability Platform:**

```
┌──────────────────────────────────────────────────────────────────┐
│        UNIFIED AI OBSERVABILITY (WiFi 7 + Apps + Network)        │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Data Sources (WiFi 7 Telemetry):                               │
│  ├─ ISE pxGrid: User identity, SGT, WiFi context                │
│  ├─ WLC Syslog: AP events, MLO failovers, client roaming        │
│  ├─ DNAC REST API: Client health, AP metrics, RRM changes       │
│  └─ Fabric Edge Logs: SGACL events, SGT enforcement             │
│                  │                                              │
│                  ▼ Ingestion Layer                              │
│  Splunk Enterprise 9.x:                                         │
│  ├─ Index: ise_pxgrid, wlc_logs, dnac_telemetry, fabric_logs   │
│  ├─ MLTK Models: Anomaly detection, predictive analytics       │
│  └─ Dashboards: Real-time WiFi 7 health, user experience       │
│                  │                                              │
│                  ▼ Correlation Engine                           │
│  AppDynamics + Cognition Engine:                               │
│  ├─ Correlate: Slow app performance ↔ Poor WiFi signal         │
│  ├─ Business Transactions: Webex join time, VDI login time     │
│  └─ Root Cause Analysis: "Slow app due to WiFi RSSI -82 dBm"   │
│                  │                                              │
│                  ▼ Predictive AI                                │
│  DNAC AI Network Analytics:                                     │
│  ├─ Client Health Prediction: Detect issues 10 min early       │
│  ├─ RRM Optimization: Auto-adjust channels for max performance │
│  └─ Network Health Heatmap: Visualize coverage gaps            │
│                  │                                              │
│                  ▼ End-User Experience Monitoring               │
│  ThousandEyes:                                                  │
│  ├─ Path Visualization: WiFi → Internet latency breakdown      │
│  ├─ SLA Monitoring: Latency <20ms, Availability >99%           │
│  └─ Alerts: Email, Slack, ServiceNow ticket creation           │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

### 8.6.2 Example: Unified Troubleshooting Workflow

**Scenario: Executive Reports "Slow Webex Meetings"**

```yaml
Step 1: User Reports Issue
  • User: john.exec@abhavtech.com
  • Complaint: "Webex meetings freezing, video quality poor"
  • Ticket: ServiceNow INC0012345 (P3)

Step 2: Splunk Correlation (WiFi Metrics)
  Query: index=ise_pxgrid userName="john.exec@abhavtech.com" ssid="Corp-Secure-7"
  
  Result:
    • RSSI: -78 dBm (poor signal) ← Potential root cause
    • PHY Rate: 1.8 Gbps (degraded from 4.5 Gbps baseline)
    • AP: MUM-F6-AP01 (Floor 6 North Wing)

Step 3: DNAC Client Health Check
  Navigate: DNAC → Assurance → Client 360 → john.exec@abhavtech.com
  
  Result:
    • Health Score: 4.2/10 (unhealthy) ✗
    • Issue: Poor signal strength (RSSI -78 dBm)
    • Recommended Action: Relocate user or add AP

Step 4: AppDynamics Business Transaction Analysis
  Navigate: AppDynamics → Business Transactions → Webex Meeting Join
  Filter: User = john.exec@abhavtech.com
  
  Result:
    • Webex Join Time: 18 seconds (baseline: 4 seconds) ✗
    • Root Cause: Poor WiFi signal (RSSI -78 dBm from DNAC API)
    • Cognition Engine Verdict: "Slow Webex performance correlated with WiFi degradation"

Step 5: ThousandEyes Path Visualization
  Navigate: ThousandEyes → WiFi Experience Test → Mumbai Floor 6
  
  Result:
    • WiFi Segment Latency: 28ms (WiFi client → AP) ✗ (expected: 3-5ms)
    • Root Cause: High packet loss on WiFi segment (3% loss)
    • Action: User experiencing wireless issues, not internet/server issues

Step 6: Resolution
  • Root Cause: Poor WiFi signal (RSSI -78 dBm, user far from AP)
  • Resolution Options:
    1. User relocates to North Wing (closer to MUM-F6-AP01)
    2. IT adds AP in user's current location (MUM-F6-AP03, new deployment)
  • User chose Option 1 (relocated)
  • Follow-Up:
    - RSSI improved: -78 → -62 dBm ✓
    - PHY Rate improved: 1.8 → 4.3 Gbps ✓
    - Webex join time: 18 → 4.5 seconds ✓
    - Health Score: 4.2 → 9.1/10 ✓
  • Ticket resolved (1 hour)
```

---

## 8.7 AI Observability Summary

### 8.7.1 Integration Success Metrics (Phase 5A)

**AI Observability Health (Week 16):**

| Metric | Target | Result | Status |
|--------|--------|--------|--------|
| **Mean Time to Detect (MTTD)** | <5 min | **2.8 min** | ✅ Exceeded |
| **Mean Time to Resolve (MTTR)** | <30 min | **18 min** | ✅ Exceeded |
| **False Positive Alert Rate** | <10% | **6%** | ✅ Met |
| **Predicted Issue Accuracy** | >80% | **87%** | ✅ Exceeded |
| **User Satisfaction (Monitoring)** | >85% | **92%** | ✅ Exceeded |

**Key Achievements:**
- ✅ Splunk MLTK detects WiFi 7 anomalies 2.8 min average (vs 15 min manual monitoring)
- ✅ AppDynamics correlates slow app performance with WiFi metrics (unified troubleshooting)
- ✅ DNAC AI predicts client disconnects 10-15 min early (proactive alerts)
- ✅ ThousandEyes monitors WiFi 7 SLAs (latency <20ms, availability >99%)

---

### 8.7.2 Operational Benefits

**For Network Operations Team:**

1. **Proactive Issue Detection**: AI predicts 87% of WiFi issues before users report (reduced helpdesk tickets)
2. **Faster Resolution**: Unified observability reduces MTTR from 45 min (manual) to 18 min (AI-assisted)
3. **Automated RRM**: DNAC AI optimizes channels automatically (no manual tuning required)

**For End Users:**

1. **Better Experience**: WiFi 7 health score 8.9/10 (vs 6.5/10 WiFi 6)
2. **Fewer Disruptions**: Predicted issues alerted early (users can relocate before disconnect)
3. **Transparent Performance**: Users see WiFi metrics in real-time (self-service troubleshooting)
