# AI-Enabled Observability Platform


---

## 1. EXECUTIVE SUMMARY & PLATFORM VISION

### 1.1 Observability Strategy

Abhavtech's AI-enabled observability strategy unifies network, application, and security telemetry into a single AI-driven platform to enable proactive operations and predictive incident prevention.

**Strategic Objectives:**

| Objective | Description | Reference Architecture |
|-----------|-------------|----------------------|
| End-to-End Visibility | Network + Application + Security correlation | Cisco Unified Observability Stack |
| AIOps | ML-driven alerting, root cause analysis, automated remediation | Splunk MLTK + AppDynamics Cognition Engine |
| Proactive Operations | Predictive detection before user impact (24-72hr forecast) | ThousandEyes Path AI + Deep Network Model |

**Observability Pillars:**

```
┌────────────────────────────────────────────────────────────────────────────┐
│                   ABHAVTECH OBSERVABILITY PILLARS                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  PILLAR 1: TELEMETRY COLLECTION                                            │
│  ────────────────────────────────────────────────────────────────────      │
│  • Logs: Syslog, API polling (DNAC, ISE, SD-WAN, FTD)                     │
│  • Metrics: SNMP, gRPC, NetFlow, OpenTelemetry                            │
│  • Traces: Distributed tracing (AppDynamics), path traces (ThousandEyes)  │
│  • Events: Security events (XDR), user events (ISE pxGrid)                │
│                                                                            │
│  PILLAR 2: AI/ML ANALYTICS                                                 │
│  ────────────────────────────────────────────────────────────────────      │
│  • Anomaly Detection: Behavioral baselines (MLTK, Cognition Engine, DNM)  │
│  • Predictive Alerting: Forecast issues 24-72 hours in advance            │
│  • Root Cause Analysis: Cross-tier correlation (app  to  network  to  infra)    │
│  • Capacity Forecasting: Resource planning based on growth trends          │
│                                                                            │
│  PILLAR 3: AUTOMATED RESPONSE                                              │
│  ────────────────────────────────────────────────────────────────────      │
│  • Self-Healing: Auto-remediation workflows (WF-001 to WF-008)            │
│  • Dynamic Routing: Path optimization based on quality metrics             │
│  • Auto-Scaling: Capacity adjustments based on AI forecasts               │
│  • Incident Orchestration: ServiceNow integration for ticket automation   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Current Monitoring Gaps

**Gap Analysis:**

| Gap | Current State | Impact | Resolution (Phase 2) |
|-----|--------------|--------|---------------------|
| **Siloed Tools** | DNAC, vManage, ISE operate independently | Manual correlation, slow MTTR (4 hours) | Splunk as central correlation hub |
| **Reactive Alerting** | Alerts after user reports issues | Poor customer experience | MLTK predictive models (24-72hr forecast) |
| **No SaaS Visibility** | Blind to Office 365, Salesforce, Webex performance | Cannot diagnose cloud app issues | ThousandEyes SaaS monitoring |
| **No APM** | No application performance monitoring | Unknown transaction response times | AppDynamics full-stack APM |
| **Manual Correlation** | Engineers correlate logs manually | High MTTR, human error | Automated topology-aware AI correlation |
| **Alert Fatigue** | 500+ alerts/day, 80% false positives | Missed critical alerts | MLTK alert prioritization (<100 alerts/day) |

### 1.3 AI Nervous System Vision

**AI Engine Ecosystem:**

| AI Engine | Location | Primary Data Sources | Focus Area | Output Type |
|-----------|----------|---------------------|------------|-------------|
| **Splunk MLTK** | Splunk Cloud/On-Prem | Logs, events, NetFlow, syslog (all platforms) | Security anomaly, correlation, forecasting | Alerts, risk scores, predictions |
| **Cognition Engine** | AppDynamics SaaS | APM traces, business transactions, code metrics | Application RCA, business impact assessment | Root cause, remediation suggestions |
| **ThousandEyes AI** | ThousandEyes Cloud | Path traces, latency, loss, jitter, ISP metrics | WAN/SaaS path prediction, outage forecast | Path recommendations, reroute triggers |
| **Deep Network Model** | Catalyst Center (DNAC) | DNAC Assurance (wireless, wired, client health) | Network optimization, anomaly detection | Recommendations, failure predictions |
| **XDR Analytics** | Cisco XDR Cloud | Endpoint, network, cloud security events | Threat correlation, risk scoring | Playbook triggers, incident cases |

### 1.4 Business Outcomes

**Target KPIs (Phase 2 Exit):**

| Outcome | Current | Target | Measurement Method |
|---------|---------|--------|-------------------|
| MTTR (Mean Time to Resolve) | 4 hours | <30 minutes | ServiceNow ticket closure time |
| Proactive Detection | 20% | 80% | Issues detected before user impact (via MLTK forecasts) |
| SLA Compliance | 99.9% | 99.99% | Uptime monitoring (ThousandEyes + DNAC) |
| Alert Noise | 500/day | <100/day | Splunk alert count (false positive reduction via MLTK) |
| Application Apdex | Unknown | >0.90 | AppDynamics Apdex scoring |
| Webex MOS | Unknown | >4.2 | ThousandEyes voice quality tests |

**Business Value:**

- **[Calculate based on your current costs]:** Reduced downtime (99.99% uptime = 52 minutes/year vs. 526 minutes/year at 99.9%)
- **40% faster troubleshooting:** MTTR from 4 hours to 30 minutes
- **60% operational efficiency:** Alert reduction from 500 to 100/day
- **Improved customer satisfaction:** Proactive issue resolution before impact


---

## 2. SPLUNK AI ARCHITECTURE

### 2.1 Splunk Platform Overview

**Note on Pricing:** All licensing costs mentioned in this document are illustrative examples only. Contact vendors directly for current pricing. See Document 2.B for detailed procurement guidance and pricing disclaimer.


Splunk Observability Cloud serves as the central hub for all telemetry, providing unified search, AI-driven analytics, and automated alerting.

#### 2.1.1 Deployment Architecture

**Splunk Cluster Design:**

| Component | Specification | Quantity | Location |
|-----------|--------------|----------|----------|
| Indexer | 16 vCPU, 64GB RAM, 2TB NVMe | 3 | NJ (Primary) |
| Indexer | 16 vCPU, 64GB RAM, 2TB NVMe | 3 | London (DR) |
| Search Head | 16 vCPU, 64GB RAM, 500GB SSD | 3 | NJ |
| Cluster Master | 8 vCPU, 32GB RAM, 200GB SSD | 1 | NJ |
| Heavy Forwarder | 8 vCPU, 16GB RAM, 200GB SSD | 6 | Regional |

**Splunk Licensing:**

- Daily Volume: 100 GB/day (average), 150 GB/day (peak)
- License Purchased: **150 GB/day**
- Annual Cost: (150 GB/day × $150/GB) + $50K MLTK = **[Contact Splunk for current pricing]**

#### 2.1.2 Data Ingestion Strategy

| Method | Use Case | Data Sources | Throughput |
|--------|----------|--------------|------------|
| **Syslog (UDP/TCP/TLS)** | Logs from network devices | DNAC, ISE, switches, routers, FTD | 20 GB/day |
| **API Polling** | Structured data from controllers | vManage API, FMC API, ISE ERS | 15 GB/day |
| **HTTP Event Collector (HEC)** | Application logs, metrics | AppDynamics, ThousandEyes, custom apps | 25 GB/day |
| **Universal Forwarder (UF)** | File monitoring, scripted inputs | Log files, scripts on servers | 30 GB/day |
| **OpenTelemetry** | Traces, metrics, logs (unified) | OTel collectors at 6 hubs | 10 GB/day |

**Total Daily Ingestion:** 100 GB/day (average), 150 GB/day (peak)

### 2.2 AI-Based Alerting

Splunk Machine Learning Toolkit (MLTK) enables AI-driven anomaly detection and predictive alerting.

**MLTK Models:**

| Model | Purpose | Training Data | Alert Threshold |
|-------|---------|---------------|-----------------|
| Auth-Anomaly | Unusual auth patterns | 90 days | >2 std dev |
| Traffic-Baseline | Network utilization | 30 days NetFlow | >3 std dev |
| App-Latency | Application deviation | 14 days APM | >2 std dev |
| User-Behavior | Insider threat | 90 days activity | Risk >75 |
| Failure-Prediction | Device failure | 180 days events | Confidence >80% |

### 2.3 Detection Models

**Network Anomaly Detection:**

```spl
index=thousandeyes sourcetype=thousandeyes:test:result
| eval latency_ms=latency
| eventstats avg(latency_ms) AS avg_latency, stdev(latency_ms) AS stdev_latency BY test_name
| eval z_score=(latency_ms - avg_latency) / stdev_latency
| where z_score > 3
| table _time, test_name, source_agent, latency_ms, avg_latency, z_score
| alert
```

### 2.4 OpenTelemetry Pipeline

**OTel Deployment:**

| Site | OTel Collector IP | CPU/RAM | Data Sources | Daily Throughput |
|------|------------------|---------|--------------|------------------|
| Mumbai | 10.252.1.100 | 4 vCPU, 8GB | DNAC, ISE, vManage, ThousandEyes | 25 GB/day |
| Chennai | 10.253.1.100 | 2 vCPU, 4GB | Local switches, routers | 5 GB/day |
| London | 10.254.1.100 | 4 vCPU, 8GB | DNAC, ISE, vManage, AppDynamics | 25 GB/day |
| Frankfurt | 10.255.1.100 | 2 vCPU, 4GB | Local switches, routers | 5 GB/day |
| New Jersey | 10.252.100.100 | 4 vCPU, 8GB | DNAC, ISE, vManage, AppDynamics | 30 GB/day |
| Dallas | 10.256.1.100 | 2 vCPU, 4GB | Local switches, routers | 10 GB/day |


---

## 3. THOUSANDEYES NETWORK INTELLIGENCE

### 3.1 ThousandEyes Platform Overview

ThousandEyes provides active monitoring of network paths, internet performance, and SaaS application reachability.

**ThousandEyes Licensing:**

- License Type: **Enterprise** (BGP, DNSSEC, API, integrations)
- Total Cost: 6 enterprise agents × $8K/year = **[Contact Cisco/ThousandEyes for current pricing]**

### 3.2 Enterprise Agent Deployment

**Agent Specifications:**

| Agent Location | Deployment | OS | Resources | Tests |
|---------------|-----------|-----|-----------|-------|
| Mumbai HQ | VM (vSphere) | Ubuntu 20.04 LTS | 2 vCPU, 4GB RAM, 50GB disk | MPLS, SaaS, Webex |
| Chennai | VM (vSphere) | Ubuntu 20.04 LTS | 2 vCPU, 4GB RAM, 50GB disk | MPLS, SaaS |
| London | VM (vSphere) | Ubuntu 20.04 LTS | 2 vCPU, 4GB RAM, 50GB disk | MPLS, SaaS, Webex |
| Frankfurt | VM (vSphere) | Ubuntu 20.04 LTS | 2 vCPU, 4GB RAM, 50GB disk | MPLS, SaaS |
| New Jersey | VM (vSphere) | Ubuntu 20.04 LTS | 2 vCPU, 4GB RAM, 50GB disk | MPLS, SaaS, Webex |
| Dallas | VM (vSphere) | Ubuntu 20.04 LTS | 2 vCPU, 4GB RAM, 50GB disk | MPLS, SaaS |

### 3.3 MPLS Path Visibility

**MPLS Test Configuration:**

| Test Name | Type | Source Agent | Target Agent | Interval | Metric | Alert Threshold |
|-----------|------|--------------|--------------|----------|--------|-----------------|
| MPLS-Mumbai-to-London | Agent-to-Agent | Mumbai | London | 1 min | Latency, Loss, Jitter | Latency >100ms, Loss >1% |
| MPLS-Mumbai-to-NJ | Agent-to-Agent | Mumbai | New Jersey | 1 min | Latency, Loss | Latency >150ms, Loss >1% |
| MPLS-London-to-NJ | Agent-to-Agent | London | New Jersey | 1 min | Latency, Loss | Latency >80ms, Loss >1% |
| MPLS-Chennai-to-Mumbai | Agent-to-Agent | Chennai | Mumbai | 1 min | Latency, Loss | Latency >20ms, Loss >0.5% |

### 3.4 SaaS Monitoring

**SaaS Application Tests:**

| Test Name | Type | Target | Source Agents | Interval | Metrics | Alert Threshold |
|-----------|------|--------|---------------|----------|---------|-----------------|
| Office365-Exchange | HTTP Server | outlook.office365.com | All 6 agents | 2 min | Response time, Availability | >500ms, <99.5% |
| Salesforce-Login | HTTP Server | login.salesforce.com | All 6 agents | 2 min | Response time, Availability | >800ms, <99.5% |
| Webex-Meetings-APAC | HTTP Server | webex.com | Mumbai, Chennai | 2 min | Response time | >300ms |
| Webex-Meetings-EMEA | HTTP Server | webex.com | London, Frankfurt | 2 min | Response time | >300ms |
| Webex-Meetings-AMER | HTTP Server | webex.com | New Jersey, Dallas | 2 min | Response time | >300ms |

### 3.5 Path Optimization AI

ThousandEyes AI analyzes path performance and recommends optimizations, integrated with SD-WAN vManage for dynamic path selection.

---

## 4. APPDYNAMICS & COGNITION ENGINE

### 4.1 AppDynamics Platform Overview

AppDynamics provides full-stack application performance monitoring (APM) with AI-driven root cause analysis via Cognition Engine.

**Deployment Model:** SaaS controller (AppDynamics Cloud, US2 region)

**Critical Applications for Monitoring:**

| Application | Tier | Language | Users | Business Impact | SLA (Response) | SLA (Error) |
|-------------|------|----------|-------|-----------------|----------------|-------------|
| Order Management | Tier 1 | Java 11 | 1,200 | Revenue-critical | <2s (p95) | <0.1% |
| Billing System | Tier 1 | Java 11 | 800 | Revenue-critical | <3s (p95) | <0.01% |
| CRM Portal | Tier 2 | .NET Core 6 | 2,000 | Customer-facing | <500ms (p95) | <0.5% |
| Customer Portal | Tier 2 | Python 3.10 (Django) | 5,000 | Customer-facing | <1s (p95) | <0.5% |
| ERP System | Tier 3 | SAP (ABAP) | 500 | Internal | <10s (p95) | <1% |

### 4.2 Application Performance Correlations

**Transaction Flow Map Example:**

Order-Submission Transaction (Normal: 1.2s):
1. HTTP POST  to  Nginx (50ms)
2. Forward  to  Order-Backend Java (200ms)
3. Validate Order  to  Oracle DB Query (150ms)
4. Call Payment API  to  Payment Gateway HTTPS (600ms)
5. Insert Order  to  Oracle DB Insert (100ms)
Total: 1,100ms

### 4.3 Business Journey Mapping

**Business Transactions:**

| Business Transaction | Tier | Avg Response (p50) | p95 Response | p99 Response | Error Rate | Calls/Min | Revenue/Call |
|---------------------|------|-------------------|-------------|-------------|------------|-----------|--------------|
| Order-Submission | Order-Backend | 1.2s | 1.8s | 2.5s | 0.05% | 45 | $150 |
| Payment-Processing | Billing-Backend | 2.1s | 2.9s | 3.8s | 0.01% | 40 | $150 |
| Customer-Login | CRM-Frontend | 450ms | 650ms | 900ms | 0.3% | 200 | N/A |
| Report-Generation | ERP-Backend | 8.5s | 12s | 15s | 0.8% | 5 | N/A |
| CRM-Search | CRM-Backend | 380ms | 550ms | 750ms | 0.2% | 180 | N/A |

### 4.4 AI-Based Anomaly Detection

AppDynamics Cognition Engine continuously learns normal behavior (14-day baseline) and detects deviations:

**Anomaly Detection Process:**
1. **Data Collection:** 14 days minimum baseline
2. **Pattern Recognition:** Time-based, day-of-week, seasonal patterns
3. **Baseline Establishment:** Define "normal" range per metric per time bucket
4. **Continuous Learning:** Re-train model weekly

### 4.5 Cognition Engine (AIOps)

**Cognition Engine Capabilities:**

| Capability | Function | Output |
|------------|----------|--------|
| Anomaly Detection | Identify deviation | Risk score |
| Root Cause Analysis | Correlate across tiers | Probable cause ranked |
| Impact Assessment | Determine blast radius | Affected users/apps |
| Remediation Suggestion | Recommend fix | Runbook link |
| Capacity Forecast | Predict resource needs | Growth report |

---

## 5. UNIFIED OBSERVABILITY INTEGRATION

### 5.1 Data Flow Architecture

**Index Design:**

| Index | Source | Hot Retention | Total Retention | Daily Volume |
|-------|--------|---------------|-----------------|--------------|
| network_infra | DNAC, vManage, switches | 30 days | 365 days | 15 GB |
| security | ISE, FTD, XDR | 90 days | 365 days | 25 GB |
| application | AppDynamics, custom | 30 days | 180 days | 20 GB |
| netflow | SD-WAN, borders | 7 days | 30 days | 30 GB |
| thousandeyes | TE metrics | 30 days | 90 days | 5 GB |
| audit | All platforms | 90 days | 730 days | 5 GB |

### 5.2 Cross-Platform Correlation

**Correlation Example:**

```spl
# Correlate AppDynamics slow transaction with network issues
index=application sourcetype=appdynamics:transaction response_time>2000
| join user_ip [search index=security sourcetype=cisco:ise:syslog]
| join mac_address [search index=network_infra sourcetype=cisco:dnac:client_health]
| eval root_cause=case(
    health_score < 50, "Wireless Issue",
    avg_loss > 1.0, "Network Issue (Packet Loss)",
    avg_latency > 150, "Network Issue (High Latency)",
    true(), "Application Issue"
)
| table _time, transaction_name, username, root_cause
```

### 5.3 Dashboard & Visualization

---

## 5.4 THREE-PLATFORM INTEGRATION ARCHITECTURE

### 5.4.1 Integration Overview

**Data Flow Architecture:**

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    UNIFIED OBSERVABILITY DATA FLOW                        │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  APPLICATION TIER (AppDynamics)                                          │
│  ────────────────────────────────────────────────────────────────        │
│  • Transaction traces, business metrics, Apdex scores                    │
│  • Export Method: HTTP Event Collector (HEC)                             │
│  • Destination: Splunk index=application                                 │
│  • Frequency: Real-time (5-second batch)                                 │
│                                                                          │
│                             ↓                                            │
│                                                                          │
│  NETWORK TIER (ThousandEyes)                                             │
│  ────────────────────────────────────────────────────────────────────    │
│  • Path traces, latency, loss, jitter, MOS scores                        │
│  • Export Method: Webhook  to  OTel Collector  to  Splunk HEC                  │
│  • Destination: Splunk index=thousandeyes                                │
│  • Frequency: Per test interval (1-2 minutes)                            │
│                                                                          │
│                             ↓                                            │
│                                                                          │
│  CORRELATION ENGINE (Splunk)                                             │
│  ────────────────────────────────────────────────────────────────────    │
│  • MLTK AI models, cross-platform correlation, dashboards                │
│  • Correlation Keys: client_ip, mac_address, transaction_id, timestamp   │
│  • Output: Root cause analysis, automated remediation triggers           │
│                                                                          │
│                             ↓                                            │
│                                                                          │
│  FEEDBACK LOOP                                                           │
│  ────────────────────────────────────────────────────────────────────    │
│  • Splunk  to  DNAC API (network topology, client health)                   │
│  • Splunk  to  vManage API (SD-WAN path rerouting via WF-001)               │
│  • Splunk  to  ServiceNow (incident creation, updates)                      │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 5.4.2 AppDynamics  to  Splunk Integration

**Configuration:**

**Step 1: Configure HEC Token in Splunk**

```bash
# Create HEC token for AppDynamics
curl -k -u admin:changeme https://10.252.100.10:8088/services/collector/token \
  -d name=appdynamics-hec \
  -d indexes=application

# Response:
# {"token": "ABC12345-1234-1234-1234-123456789ABC"}
```

**Step 2: Configure AppDynamics Analytics**

```bash
# AppDynamics Controller  to  Analytics  to  Configuration  to  Data Collectors
# Add HTTP Data Collector:

URL: https://10.252.100.10:8088/services/collector/event
Method: POST
Headers:
  Authorization: Splunk ABC12345-1234-1234-1234-123456789ABC
  Content-Type: application/json

# Payload Template (JSON):
{
  "time": "${timestamp}",
  "sourcetype": "appdynamics:transaction",
  "event": {
    "application": "${applicationName}",
    "tier": "${tierName}",
    "transaction": "${transactionName}",
    "response_time_ms": ${responseTime},
    "error": ${hasErrors},
    "user_ip": "${clientIP}",
    "session_id": "${sessionID}",
    "apdex_score": ${apdexScore}
  }
}
```

**Step 3: Configure Transaction Analytics**

```javascript
// AppDynamics Controller  to  Configuration  to  Transaction Detection
// Add custom data collectors to capture client IP, session ID

Data Collector Name: client_ip
Method Invocation: HTTP Request
Parameter: X-Forwarded-For header

Data Collector Name: session_id
Method Invocation: HTTP Request
Parameter: JSESSIONID cookie
```

**Data Volume:** 20 GB/day from AppDynamics  to  Splunk

---

### 5.4.3 ThousandEyes  to  Splunk Integration

**Configuration:**

**Step 1: Configure OTel HTTP Receiver**

```yaml
# /etc/otel-collector/config.yaml (on OTel collector at 10.252.100.100)

receivers:
  otlp:
    protocols:
      http:
        endpoint: 0.0.0.0:4318
  
  # ThousandEyes webhook receiver
  webhookevent:
    endpoint: 0.0.0.0:8080
    path: /thousandeyes

processors:
  batch:
    timeout: 5s
    send_batch_size: 1024
  
  # Add source attribute for routing
  resource:
    attributes:
      - key: source
        value: thousandeyes
        action: upsert

exporters:
  splunk_hec:
    token: "XYZ98765-9876-9876-9876-987654321XYZ"
    endpoint: "https://10.252.100.10:8088/services/collector"
    source: "thousandeyes"
    sourcetype: "thousandeyes:test:result"
    index: "thousandeyes"

service:
  pipelines:
    logs:
      receivers: [webhookevent]
      processors: [batch, resource]
      exporters: [splunk_hec]
```

**Step 2: Configure ThousandEyes Webhook**

```bash
# ThousandEyes Portal  to  Integrations  to  Webhooks
# Create webhook:

Name: Splunk-OTel-Integration
Target URL: http://10.252.100.100:8080/thousandeyes
Method: POST
Authentication: None (internal network)

# Event Types (select all):
☑ Test Alert
☑ Test Data
☑ Path Trace
☑ BGP Alert

# Payload Template (JSON):
{
  "test_name": "{{testName}}",
  "test_id": {{testId}},
  "agent_name": "{{agentName}}",
  "timestamp": "{{timestamp}}",
  "latency_ms": {{averageLatency}},
  "jitter_ms": {{jitter}},
  "loss_percent": {{loss}},
  "mos_score": {{mos}},
  "path_trace": "{{pathTrace}}",
  "alert_type": "{{alertType}}",
  "alert_state": "{{alertState}}"
}
```

**Step 3: Verify Data Flow**

```bash
# Check OTel collector logs
tail -f /var/log/otel-collector/collector.log | grep thousandeyes

# Check Splunk ingestion
curl -k -u admin:changeme https://10.252.100.10:8089/services/search/jobs \
  -d search='search index=thousandeyes earliest=-5m | stats count'
```

**Data Volume:** 5 GB/day from ThousandEyes  to  OTel  to  Splunk

---

### 5.4.4 Cross-Platform Correlation Queries

**Use Case 1: App Slowness  to  Network Root Cause**

**Scenario:** Order-Submission transaction is slow (response time >2s). Determine if cause is application code or network issue.

**Correlation Query:**

```spl
# Step 1: Find slow transactions from AppDynamics
index=application sourcetype=appdynamics:transaction 
    transaction="Order-Submission" response_time_ms>2000
| rename user_ip AS client_ip

# Step 2: Join with ISE to get MAC address
| join client_ip [
    search index=security sourcetype=cisco:ise:syslog
    | rename Framed-IP-Address AS client_ip
    | table client_ip, Calling-Station-Id
    | rename Calling-Station-Id AS mac_address
]

# Step 3: Join with DNAC client health
| join mac_address [
    search index=network_infra sourcetype=cisco:dnac:client_health
    | table mac_address, healthScore, rssi, snr, channel
]

# Step 4: Join with ThousandEyes path data
| join client_ip [
    search index=thousandeyes sourcetype=thousandeyes:test:result
    | stats avg(latency_ms) AS avg_latency, avg(loss_percent) AS avg_loss BY test_name
    | where test_name LIKE "%Mumbai%"
    | table test_name, avg_latency, avg_loss
]

# Step 5: Determine root cause
| eval root_cause=case(
    healthScore < 50, "WIRELESS_ISSUE (RSSI=" + rssi + "dBm, Health=" + healthScore + ")",
    avg_loss > 1.0, "NETWORK_ISSUE (Packet Loss=" + avg_loss + "%)",
    avg_latency > 150, "NETWORK_ISSUE (High Latency=" + avg_latency + "ms)",
    true(), "APPLICATION_ISSUE (Network and wireless are healthy)"
)

# Step 6: Output
| table _time, transaction, user_ip, mac_address, response_time_ms, healthScore, rssi, avg_latency, avg_loss, root_cause
| sort -_time
```

**Example Output:**

| _time | transaction | user_ip | mac_address | response_time_ms | healthScore | rssi | avg_latency | avg_loss | root_cause |
|-------|-------------|---------|-------------|------------------|-------------|------|-------------|----------|------------|
| 2025-01-17 14:32:15 | Order-Submission | 10.252.2.45 | 00:50:56:AB:CD:EF | 3200 | 35 | -75 | 95 | 0.2 | WIRELESS_ISSUE (RSSI=-75dBm, Health=35) |
| 2025-01-17 14:31:42 | Order-Submission | 10.252.3.12 | 00:50:56:12:34:56 | 2800 | 85 | -55 | 180 | 2.5 | NETWORK_ISSUE (Packet Loss=2.5%) |

---

**Use Case 2: Webex Quality  to  Path Issue  to  Auto-Remediation**

**Scenario:** Webex MOS drops below 4.0 at Chennai branch. Correlate with path metrics and trigger WF-001.

**Correlation Query:**

```spl
# Step 1: Detect MOS drop from ThousandEyes
index=thousandeyes sourcetype=thousandeyes:test:result 
    test_name="Webex-Calling-Global" agent_name="Chennai*" mos_score<4.0

# Step 2: Get path trace data
| join test_id [
    search index=thousandeyes sourcetype=thousandeyes:path:trace
    | table test_id, hop_number, hop_ip, hop_latency, hop_loss
]

# Step 3: Query vManage for circuit status
| map search="| rest https://10.252.50.10/dataservice/device/interface/statistics 
    | search device-id=vedge-chennai-01
    | table interface, tx-kbps, rx-kbps, tx-pps, rx-pps"

# Step 4: Determine if WF-001 should trigger
| eval wf001_trigger=case(
    mos_score < 4.0 AND hop_loss > 1.5, "YES - Reroute to backup circuit",
    mos_score < 4.0 AND tx-kbps > 80000, "YES - Enable QoS",
    true(), "NO - MOS issue not network-related"
)

# Step 5: Trigger workflow if needed
| where wf001_trigger!="NO"
| sendalert wf001_trigger
```

---

**Use Case 3: DNAC Network Issue  to  AppDynamics Impact Assessment**

**Scenario:** DNAC detects wireless issue affecting 15 clients. Determine which AppDynamics applications/transactions are impacted.

**Correlation Query:**

```spl
# Step 1: Get affected clients from DNAC
index=network_infra sourcetype=cisco:dnac:issue 
    issue_severity="HIGH" issue_category="wireless"
| rename affected_clients AS mac_list

# Step 2: Expand MAC list and join with ISE to get IP addresses
| mvexpand mac_list
| join mac_list [
    search index=security sourcetype=cisco:ise:syslog
    | rename Calling-Station-Id AS mac_list, Framed-IP-Address AS client_ip
    | table mac_list, client_ip, username
]

# Step 3: Join with AppDynamics to find affected transactions
| join client_ip [
    search index=application sourcetype=appdynamics:transaction earliest=-10m
    | rename user_ip AS client_ip
    | stats count AS transaction_count, avg(response_time_ms) AS avg_response, max(response_time_ms) AS max_response 
        BY client_ip, application, transaction
]

# Step 4: Calculate business impact
| eval business_impact=case(
    application="Order-Management" AND avg_response>2000, "CRITICAL - Revenue impact",
    application="CRM-Portal" AND avg_response>1000, "HIGH - Customer experience degraded",
    avg_response>500, "MEDIUM - Performance degraded",
    true(), "LOW - Minimal impact"
)

# Step 5: Output
| table username, client_ip, mac_list, application, transaction, transaction_count, avg_response, max_response, business_impact
| sort -business_impact
```

---

### 5.4.5 Integration API Calls

**AppDynamics  to  ThousandEyes Correlation API:**

Although AppDynamics and ThousandEyes don't directly integrate, Splunk acts as the correlation engine. However, for advanced use cases, we can query both APIs:

```python
import requests
import json
from datetime import datetime, timedelta

# Configuration
appdynamics_url = "https://abhavtech.saas.appdynamics.com"
appdynamics_user = "appdynamics-api@abhavtech.com"
appdynamics_password = "********"

thousandeyes_url = "https://api.thousandeyes.com"
thousandeyes_token = "Bearer xyz123..."

splunk_hec_url = "https://10.252.100.10:8088/services/collector/event"
splunk_hec_token = "Splunk ABC123..."

def correlate_app_network():
    """
    Correlate AppDynamics slow transactions with ThousandEyes path issues
    """
    
    # Step 1: Query AppDynamics for slow transactions (last 10 minutes)
    end_time = datetime.now()
    start_time = end_time - timedelta(minutes=10)
    
    appdynamics_params = {
        "time-range-type": "BEFORE_NOW",
        "duration-in-mins": 10,
        "output": "JSON"
    }
    
    appdynamics_response = requests.get(
        f"{appdynamics_url}/controller/rest/applications/Order-Management/metric-data",
        auth=(appdynamics_user + "@abhavtech", appdynamics_password),
        params=appdynamics_params
    )
    
    slow_transactions = []
    for metric in appdynamics_response.json():
        if metric['metricName'] == 'Average Response Time (ms)' and metric['metricValue'] > 2000:
            slow_transactions.append({
                'transaction': metric['transactionName'],
                'response_time': metric['metricValue'],
                'timestamp': metric['timestamp']
            })
    
    # Step 2: For each slow transaction, query ThousandEyes for path metrics
    for txn in slow_transactions:
        # Get client location from transaction metadata
        location = get_client_location(txn['transaction'])  # e.g., "Mumbai"
        
        # Query ThousandEyes for path metrics from that location
        te_params = {
            "window": "10m",
            "aid": 12345  # Account ID
        }
        
        te_response = requests.get(
            f"{thousandeyes_url}/v6/net/path-vis/{location}",
            headers={"Authorization": thousandeyes_token},
            params=te_params
        )
        
        path_metrics = te_response.json()
        
        # Step 3: Correlate and send to Splunk
        correlation_event = {
            "time": txn['timestamp'],
            "sourcetype": "correlation:app_network",
            "event": {
                "transaction": txn['transaction'],
                "app_response_time_ms": txn['response_time'],
                "network_latency_ms": path_metrics.get('averageLatency', 0),
                "network_loss_percent": path_metrics.get('loss', 0),
                "network_jitter_ms": path_metrics.get('jitter', 0),
                "correlation_score": calculate_correlation(txn, path_metrics),
                "root_cause": determine_root_cause(txn, path_metrics)
            }
        }
        
        # Send to Splunk HEC
        requests.post(
            splunk_hec_url,
            headers={
                "Authorization": f"Splunk {splunk_hec_token}",
                "Content-Type": "application/json"
            },
            json=correlation_event
        )

def calculate_correlation(app_metrics, network_metrics):
    """
    Calculate correlation score between app slowness and network issues
    """
    score = 0
    
    if network_metrics.get('loss', 0) > 1.0:
        score += 50  # High packet loss strongly correlates
    
    if network_metrics.get('latency', 0) > 150:
        score += 30  # High latency moderately correlates
    
    if network_metrics.get('jitter', 0) > 25:
        score += 20  # High jitter weakly correlates
    
    return min(score, 100)  # Cap at 100

def determine_root_cause(app_metrics, network_metrics):
    """
    Determine most likely root cause
    """
    if network_metrics.get('loss', 0) > 2.0:
        return "NETWORK - High packet loss"
    elif network_metrics.get('latency', 0) > 200:
        return "NETWORK - High latency"
    elif calculate_correlation(app_metrics, network_metrics) > 50:
        return "NETWORK - Multiple network issues detected"
    else:
        return "APPLICATION - Network metrics are healthy"

# Run correlation every 5 minutes
if __name__ == "__main__":
    correlate_app_network()
```

---

### 5.4.6 Integration Dashboard

**Unified Observability Dashboard (Splunk):**

```xml
<dashboard>
  <label>Unified Observability - App + Network Correlation</label>
  
  <row>
    <panel>
      <title>Application Performance (AppDynamics)</title>
      <table>
        <search>
          <query>
            index=application sourcetype=appdynamics:transaction
            | stats avg(response_time_ms) AS avg_response, 
                    max(response_time_ms) AS max_response,
                    count AS txn_count,
                    sum(eval(if(error=1, 1, 0))) AS error_count
              BY application, transaction
            | eval apdex=case(
                avg_response<1000, "Satisfied",
                avg_response<4000, "Tolerating",
                true(), "Frustrated"
              )
          </query>
        </search>
        <option name="drilldown">cell</option>
        <drilldown>
          <link target="_blank">/app/search/correlation_drill?transaction=$row.transaction$</link>
        </drilldown>
      </table>
    </panel>
  </row>
  
  <row>
    <panel>
      <title>Network Path Performance (ThousandEyes)</title>
      <table>
        <search>
          <query>
            index=thousandeyes sourcetype=thousandeyes:test:result
            | stats avg(latency_ms) AS avg_latency,
                    avg(loss_percent) AS avg_loss,
                    avg(jitter_ms) AS avg_jitter,
                    avg(mos_score) AS avg_mos
              BY test_name, agent_name
            | eval quality=case(
                avg_mos>=4.3, "Excellent",
                avg_mos>=4.0, "Good",
                avg_mos>=3.8, "Acceptable",
                true(), "Poor"
              )
          </query>
        </search>
      </table>
    </panel>
  </row>
  
  <row>
    <panel>
      <title>Correlated Issues (App + Network)</title>
      <table>
        <search>
          <query>
            index=application sourcetype=appdynamics:transaction response_time_ms>2000
            | join user_ip [
                search index=security sourcetype=cisco:ise:syslog
                | rename Framed-IP-Address AS user_ip, Calling-Station-Id AS mac_address
              ]
            | join mac_address [
                search index=network_infra sourcetype=cisco:dnac:client_health
              ]
            | join user_ip [
                search index=thousandeyes
                | stats avg(latency_ms) AS network_latency BY agent_name
              ]
            | eval correlation_type=case(
                healthScore<50, "Wireless Issue",
                network_latency>150, "WAN Issue",
                true(), "Application Issue"
              )
            | table _time, transaction, user_ip, response_time_ms, healthScore, network_latency, correlation_type
          </query>
        </search>
      </table>
    </panel>
  </row>
</dashboard>
```

---

**Integration Summary:**

| Integration | Method | Data Volume | Latency | Use Case |
|-------------|--------|-------------|---------|----------|
| AppDynamics  to  Splunk | HEC (direct) | 20 GB/day | <5 seconds | Real-time APM data |
| ThousandEyes  to  Splunk | Webhook  to  OTel  to  HEC | 5 GB/day | <30 seconds | Path and quality metrics |
| Splunk  to  DNAC | REST API (query) | N/A | <1 second | Client health lookup |
| Splunk  to  vManage | REST API (read/write) | N/A | <2 seconds | SD-WAN policy updates |
| Cross-Platform Correlation | SPL queries in Splunk | N/A | <5 seconds | Root cause analysis |


**Dashboard Specifications:**

| Dashboard | Audience | Refresh | Key Metrics |
|-----------|----------|---------|-------------|
| Executive | Leadership | 5 min | SLA, incidents, risk score |
| NOC APAC | Mumbai NOC | 30 sec | APAC health, alerts, tickets |
| NOC EMEA | London NOC | 30 sec | EMEA health, alerts, tickets |
| NOC Americas | NJ NOC | 30 sec | Americas health, alerts, tickets |
| Engineering | Network team | 1 min | Device health, path analysis, logs |
| Security | SOC | 30 sec | Threats, risk scores, incidents |
| **Webex/Collaboration** | NOC + Business | 1 min | Voice MOS, video quality, WxCC metrics |

---

## 6. WEBEX COLLABORATION OBSERVABILITY

### 6.1 Webex as First-Class AI Service

**Webex Infrastructure Summary:**

| Component | Deployment | Users/Agents | Business Impact |
|-----------|------------|--------------|-----------------|
| Webex Calling | Cloud (Cisco) | 3,200 users | Internal collaboration |
| Webex Contact Center (WxCC) | Cloud (Cisco) | 175 agents | Customer experience |
| Webex Meetings | Cloud (Cisco) | All users | Executive visibility |
| On-Prem SBC/CUBE | NJ, Mumbai, London | N/A | PSTN gateway |

### 6.2 ThousandEyes Webex Tests

**Dedicated Webex Tests:**

| Test Name | Type | Target | Interval | Alert Threshold |
|-----------|------|--------|----------|-----------------|
| Webex-Calling-Global | Voice | calling.webex.com | 1 min | MOS <4.0 |
| Webex-Meetings-APAC | HTTP | webex.com | 2 min | Response >300ms |
| Webex-Meetings-EMEA | HTTP | webex.com | 2 min | Response >300ms |
| Webex-Meetings-AMER | HTTP | webex.com | 2 min | Response >300ms |
| WxCC-Media-Mumbai | Voice | WxCC media server | 1 min | MOS <4.2 |
| WxCC-Media-London | Voice | WxCC media server | 1 min | MOS <4.2 |
| WxCC-Media-NJ | Voice | WxCC media server | 1 min | MOS <4.2 |
| WxCC-Signaling | HTTP | WxCC signaling | 30 sec | Response >200ms |

### 6.3 Webex QoE Thresholds

**Voice Quality (MOS-based):**

| Metric | Excellent | Good | Acceptable | Poor | Action |
|--------|-----------|------|------------|------|--------|
| MOS Score | >4.3 | 4.0-4.3 | 3.8-4.0 | <3.8 | WF-001 trigger |
| Jitter | <10ms | 10-20ms | 20-30ms | >30ms | QoS adjust |
| Latency | <100ms | 100-150ms | 150-200ms | >200ms | Path reroute |
| Packet Loss | <0.5% | 0.5-1% | 1-2% | >2% | Path reroute |

### 6.4 WxCC-Specific Metrics

**Contact Center KPIs:**

| Metric | Target | Alert | Business Impact |
|--------|--------|-------|-----------------|
| Agent Voice Quality | MOS >4.2 | <4.0 | Customer satisfaction |
| Screen Pop Latency | <500ms | >1s | Agent productivity |
| IVR Response | <200ms | >500ms | Abandonment rate |
| Recording Upload | <5s | >10s | Compliance risk |
| CRM Integration | <1s | >2s | Agent efficiency |

**WxCC Splunk Indexes:**

| Index | Source | Retention | Daily Volume | Use Case |
|-------|--------|-----------|--------------|----------|
| wxcc_cdr | Call Detail Records | 365 days | 2 GB | Compliance, reporting |
| wxcc_agent | Agent state changes | 90 days | 500 MB | Agent productivity |
| wxcc_quality | Voice quality metrics | 90 days | 1 GB | Quality troubleshooting |
| wxcc_integration | Salesforce events | 90 days | 500 MB | Integration monitoring |

### 6.5 WF-001: Webex-Branch-Optimize

**Workflow Purpose:** Automatically optimize SD-WAN QoS policies when Webex voice/video quality degrades at branch sites.

**Trigger Conditions:**

| Source | Metric | Threshold | Duration |
|--------|--------|-----------|----------|
| ThousandEyes | MOS score | <4.0 | >2 minutes |
| ThousandEyes | Jitter | >25ms | >2 minutes |
| ThousandEyes | Packet Loss | >1.5% | >2 minutes |
| vManage | Circuit utilization | >80% | N/A |
| DNAC Assurance | Webex client health | <70 | N/A |

**Guardrails:**

- Maximum 3 auto-actions per branch per hour
- Never affects Executive traffic (SGT-11)
- Never affects OT/Medical (SGT-60)
- Never affects Server traffic (SGT 80-83)
- Automatic rollback after 30 minutes

### 6.6 Webex Observability Dashboard

**Key Metrics:**

- Global MOS Heatmap (1-min refresh)
- Active Calls count
- Agent Status (Available/Busy/Away)
- Quality Alerts (open MOS alerts)
- WF-001 Actions (auto-optimizations today)
- CSAT Correlation (quality vs satisfaction)


---

## 7. IMPLEMENTATION PHASES

### PHASE 2: AI-ENABLED OBSERVABILITY (20 Weeks)

#### Phase 2A: Splunk Foundation (Weeks 1-6)

**Week 1-2: Splunk Licensing & Cluster Setup**

**Tasks:**
1. Procure Splunk Enterprise licenses (150 GB/day + MLTK add-on)
2. Provision VMs for Splunk cluster (NJ primary site)
3. Install Splunk Enterprise on all nodes
4. Configure indexer cluster (replication factor 3, search factor 2)

**Exit Criteria:**
- [ ] Splunk indexer cluster healthy (3 nodes)
- [ ] Search head cluster operational (3 nodes)
- [ ] License utilization <80%
- [ ] Test data ingestion: 10 GB/day successfully indexed

**Week 3-4: Heavy Forwarders & Universal Forwarders**

**Tasks:**
1. Deploy Heavy Forwarders at Mumbai, London (2 per site)
2. Deploy Universal Forwarders on DNAC, ISE, vManage, FMC servers
3. Configure syslog inputs on Heavy Forwarders

**Exit Criteria:**
- [ ] 4 Heavy Forwarders operational
- [ ] 21 Universal Forwarders deployed
- [ ] Data flow verified: Source  to  UF  to  HF  to  Indexer

**Week 5-6: OpenTelemetry Collectors**

**Tasks:**
1. Deploy OTel Collectors at 6 hub sites
2. Configure receivers, processors, exporters
3. Validate telemetry flow: Source  to  OTel  to  Splunk

**Exit Criteria:**
- [ ] 6 OTel Collectors deployed and healthy
- [ ] 100 GB/day ingestion via OTel + direct methods
- [ ] Zero data loss verified

**Phase 2A Exit Criteria:**
- [x] Splunk cluster operational (NJ + London DR)
- [x] 100 GB/day data ingestion
- [x] 6 indexes created with retention policies

---

#### Phase 2B: ThousandEyes (Weeks 7-12)

**Week 7-8: Agent Deployment (Mumbai, NJ)**

**Tasks:**
1. Procure ThousandEyes Enterprise licenses (6 agents)
2. Deploy agents at Mumbai, New Jersey
3. Configure tests: MPLS, Office 365, Webex

**Exit Criteria:**
- [ ] 2 agents registered and reporting
- [ ] 3 tests configured and running

**Week 9-10: Complete Agent Deployment**

**Tasks:**
1. Deploy agents at Chennai, Dallas, London, Frankfurt
2. Expand test coverage to 25 tests (MPLS, SaaS, Voice)

**Exit Criteria:**
- [ ] 6 agents operational
- [ ] 25 tests configured with alerts

**Week 11-12: DNAC/vManage Integration & OTel Export**

**Tasks:**
1. Configure ThousandEyes integration with DNAC and vManage
2. Configure webhook to OTel Collector
3. Validate data flow to Splunk

**Exit Criteria:**
- [ ] DNAC/vManage integration operational
- [ ] ThousandEyes data in Splunk index=thousandeyes

**Phase 2B Exit Criteria:**
- [x] 6 enterprise agents deployed
- [x] 25 tests configured (MPLS, SaaS, Voice, WxCC)
- [x] DNAC/vManage integration operational
- [x] Data exported to Splunk

---

#### Phase 2C: AppDynamics (Weeks 13-18)

**Week 13-14: Controller & Java Agents**

**Tasks:**
1. Provision AppDynamics SaaS controller
2. Deploy Java agents on Order Management, Billing servers
3. Configure business transactions

**Exit Criteria:**
- [ ] Controller accessible via SSO
- [ ] 5 Java agents reporting
- [ ] Business transactions visible

**Week 15-16: .NET Agents & Apdex**

**Tasks:**
1. Deploy .NET agents on CRM servers
2. Configure Apdex thresholds for all applications

**Exit Criteria:**
- [ ] 3 .NET agents reporting
- [ ] Apdex thresholds configured

**Week 17-18: Cognition Engine & DNAC Integration**

**Tasks:**
1. Enable Cognition Engine with 14-day baseline
2. Configure DNAC API integration
3. Configure export to Splunk via HEC

**Exit Criteria:**
- [ ] Cognition Engine baseline collection started
- [ ] DNAC integration operational
- [ ] AppDynamics metrics in Splunk

**Phase 2C Exit Criteria:**
- [x] 5 applications instrumented
- [x] Cognition Engine enabled
- [x] DNAC integration operational

---

#### Phase 2D: Integration (Weeks 19-20)

**Week 19: Correlation & MLTK Training**

**Tasks:**
1. Validate cross-platform correlation queries
2. Train 5 MLTK models
3. Create 6 dashboards

**Exit Criteria:**
- [ ] Correlation verified (app + network  to  root cause)
- [ ] 5 MLTK models deployed
- [ ] 6 dashboards created

**Week 20: ServiceNow Integration & Baseline Verification**

**Tasks:**
1. Configure Splunk  to  ServiceNow integration
2. **CRITICAL:** Verify 14-day baseline complete
3. Finalize documentation

**Exit Criteria:**
- [ ] ServiceNow integration working
- [ ] **14+ days baseline data collected** (MANDATORY)
- [ ] Documentation complete

**Phase 2D Exit Criteria:**
- [x] Cross-platform correlation verified
- [x] 5 MLTK models operational
- [x] 6 dashboards deployed
- [x] **14+ days baseline data collected**
- [x] Documentation complete

---

### PHASE 2 EXIT CRITERIA (OVERALL)

**Technical:**
- [x] Splunk: 100 GB/day ingestion, NJ + London DR
- [x] ThousandEyes: 6 agents, 25 tests
- [x] AppDynamics: 5 apps, Cognition Engine
- [x] MLTK: 5 models deployed
- [x] **14-Day Baseline collected** (CRITICAL for Phase 3)

**Performance:**
- [x] MTTR: <30 minutes
- [x] Proactive Detection: 80%
- [x] Alert Noise: <100/day

**Approval:**
- [x] Sign-off from IT Director
- [x] Sign-off from CIO
- [x] Phase 3 approved to proceed

---

## 8. OPERATIONAL PROCEDURES

### 8.1 Daily Operations

**Morning Checks (NOC Team - 10 minutes):**

1. **Splunk Health Check:**
   - Check indexer cluster health (all nodes green)
   - Verify search head cluster captain elected
   - Check license usage (<80% of 150 GB/day)
   - Review overnight alert summary

2. **ThousandEyes Health Check:**
   - Verify all 6 agents reporting (green status)
   - Review path tests (MPLS, SaaS, Voice)
   - Check for MOS <4.0 alerts
   - Verify no test failures (>5% error rate)

3. **AppDynamics Health Check:**
   - Verify all 5 applications reporting
   - Check Apdex scores (target: >0.90)
   - Review overnight anomalies
   - Check business transaction error rates

4. **Webex Health Check:**
   - Global MOS heatmap review (target: >4.2)
   - WxCC agent status (adequate coverage)
   - Review WF-001 actions
   - Check CSAT correlation

### 8.2 Incident Response Playbooks

**Playbook: Application Slowness Investigation**

**Trigger:** AppDynamics alert - Transaction response time >2s

**Steps (30 minutes total):**

1. **Identify Affected Application** (2 min)
   - Review transaction snapshot in AppDynamics

2. **Check Network Correlation** (5 min)
   - Run Splunk correlation query
   - Check DNAC client health

3. **Determine Root Cause** (3 min)
   - Analyze correlation results
   - Identify: App, Network, or Wireless issue

4. **Remediation** (10 min)
   - Execute appropriate fix
   - Trigger workflow if applicable

5. **Documentation** (5 min)
   - Update ServiceNow ticket
   - Log learning

**Total Time:** 30 minutes (meets MTTR target)

### 8.3 Change Management

**Change Process:**

1. **Change Request** (via ServiceNow)
   - Description, justification, impact, rollback plan

2. **Change Approval**
   - Low Impact: Manager approval, 24-hour notice
   - Medium Impact: CAB approval, 1-week notice
   - High Impact: CAB + CIO approval, 2-week notice

3. **Implementation**
   - Execute during approved window
   - Document all actions

4. **Post-Change Review**
   - Validate success
   - Execute rollback if needed
   - Close ticket


---

## APPENDICES

### Appendix A: Splunk Index Design & Retention Policies

**Index Configuration Example:**

```conf
# /opt/splunk/etc/apps/abhavtech_indexes/local/indexes.conf

[network_infra]
coldPath = $SPLUNK_DB/network_infra/colddb
enableDataIntegrityControl = 1
frozenTimePeriodInSecs = 31536000  # 365 days
homePath = $SPLUNK_DB/network_infra/db
maxDataSize = auto_high_volume
maxHotBuckets = 10
maxTotalDataSizeMB = 500000
maxWarmDBCount = 300
thawedPath = $SPLUNK_DB/network_infra/thaweddb

[security]
# 7-year retention for compliance
frozenTimePeriodInSecs = 220752000

[application]
# 180-day retention
frozenTimePeriodInSecs = 15552000

[netflow]
# 30-day retention
frozenTimePeriodInSecs = 2592000
```

---

### Appendix B: ThousandEyes Test Configuration Templates

**MPLS Agent-to-Agent Test JSON:**

```json
{
  "testName": "MPLS-Mumbai-to-London",
  "interval": 60,
  "enabled": 1,
  "alertsEnabled": 1,
  "type": "agent-to-agent",
  "protocol": "TCP",
  "port": 49153,
  "targetAgent": {
    "agentId": 789014,
    "agentName": "London-HQ-Agent"
  },
  "agents": [
    {
      "agentId": 789012,
      "agentName": "Mumbai-HQ-Agent"
    }
  ],
  "pathTraceMode": "inSession",
  "alertRules": [
    {
      "ruleId": 1001,
      "expression": "((loss >= 1))",
      "alertType": "Packet Loss",
      "minimumSources": 1,
      "roundsViolating": 2
    },
    {
      "ruleId": 1002,
      "expression": "((latency >= 100))",
      "alertType": "Latency",
      "minimumSources": 1,
      "roundsViolating": 2
    }
  ]
}
```

**Voice Test JSON:**

```json
{
  "testName": "Webex-Calling-Global",
  "interval": 60,
  "enabled": 1,
  "type": "voice",
  "server": "calling.webex.com:5004",
  "codec": "G.711",
  "dscp": 46,
  "duration": 10,
  "agents": [
    {"agentId": 789012},
    {"agentId": 789013},
    {"agentId": 789014},
    {"agentId": 789015},
    {"agentId": 789016},
    {"agentId": 789017}
  ],
  "alertRules": [
    {
      "ruleId": 3001,
      "expression": "((mos < 4.0))",
      "alertType": "Voice MOS",
      "minimumSources": 2,
      "roundsViolating": 2
    }
  ]
}
```

---

### Appendix C: AppDynamics Business Transaction Definitions

**Order-Submission Transaction YAML:**

```yaml
application: Order-Management
business_transaction:
  name: Order-Submission
  entry_point:
    type: SERVLET
    match_pattern:
      type: EQUALS
      pattern: /api/v1/order/submit
  naming_scheme: URI
  
  health_rules:
    - name: Order-Submission-Response-Time
      metric: Response Time (ms)
      critical_threshold: 2000
      warning_threshold: 1500
      duration: 5 minutes
    
    - name: Order-Submission-Error-Rate
      metric: Errors per Minute
      critical_threshold: 5
      warning_threshold: 2
      duration: 5 minutes
  
  data_collectors:
    - http_parameter: customer_id
    - http_parameter: order_total
    - session_id: JSESSIONID
  
  apdex_settings:
    satisfied_threshold: 2000
    tolerating_threshold: 8000
```

---

### Appendix D: MLTK Model Training Procedures

**Auth-Anomaly Model Training SPL:**

```spl
# Step 1: Prepare training data (90 days)
index=security sourcetype=cisco:ise:syslog earliest=-90d@d latest=now
| eval hour=strftime(_time, "%H")
| stats count AS auth_count BY username, hour

# Step 2: Train Density Function model
| fit DensityFunction auth_count BY username INTO auth_anomaly_model

# Step 3: Validate model (test on recent 7 days)
index=security sourcetype=cisco:ise:syslog earliest=-7d@d latest=now
| eval hour=strftime(_time, "%H")
| stats count AS auth_count BY username, hour
| apply auth_anomaly_model
| where "IsOutlier(auth_count)"=1
| stats count AS anomalies BY username

# Step 4: Deploy to production
# Model automatically saved in Splunk MLTK
# Create real-time alert using model
```

**Retraining Schedule:**
- Frequency: Weekly (every Sunday at 2 AM)
- Splunk cron: `0 2 * * 0`

---

### Appendix E: Dashboard JSON Templates

**Executive Dashboard Splunk XML:**

```xml
<dashboard>
  <label>Executive Dashboard - Abhavtech Observability</label>
  <description>Global KPIs, Application Health, Network Status</description>
  
  <row>
    <panel>
      <title>Global SLA Compliance</title>
      <single>
        <search>
          <query>
            | inputlookup sla_data.csv
            | stats avg(uptime_percent) AS sla
            | eval sla=round(sla, 2)
          </query>
          <earliest>-24h@h</earliest>
          <latest>now</latest>
        </search>
        <option name="drilldown">none</option>
        <option name="rangeColors">["0xff0000","0xffff00","0x00ff00"]</option>
        <option name="rangeValues">[99.9, 99.95]</option>
        <option name="underLabel">Target: 99.99%</option>
      </single>
    </panel>
    
    <panel>
      <title>Open Incidents</title>
      <table>
        <search>
          <query>
            index=snow_incidents status="Open"
            | stats count BY priority
            | rename priority AS "Priority", count AS "Count"
          </query>
        </search>
      </table>
    </panel>
  </row>
</dashboard>
```

---

### Appendix F: Alert Routing & Escalation Matrix

**Alert Routing Table:**

| Alert Source | Severity | Destination | Notification Method | Response Time SLA |
|--------------|----------|-------------|---------------------|------------------|
| Splunk MLTK | Critical | NOC + Security + PagerDuty | Phone call + SMS + Webex | 15 minutes |
| Splunk MLTK | High | NOC + Webex Space | Webex notification | 1 hour |
| Splunk MLTK | Medium | ServiceNow Queue | Email to team lead | 4 hours |
| AppDynamics | Critical | DevOps + PagerDuty | Phone call + Webex | 15 minutes |
| AppDynamics | High | DevOps + Webex Space | Webex notification | 1 hour |
| ThousandEyes | Critical | Network Team + PagerDuty | Phone call + Webex | 15 minutes |
| ThousandEyes | High | Network Team + Webex Space | Webex notification | 1 hour |
| WF-001 | Failure | Network Team + NOC | Webex notification | 30 minutes |

---

### Appendix G: API Integration Reference

**API Endpoints:**

| Platform | Endpoint | Method | Authentication | Rate Limit |
|----------|----------|--------|----------------|------------|
| Splunk HEC | https://10.252.100.10:8088/services/collector/event | POST | Bearer Token | 10K req/min |
| ThousandEyes | https://api.thousandeyes.com/v6/tests | GET | Bearer Token | 240 req/hour |
| AppDynamics | https://abhavtech.saas.appdynamics.com/controller/rest/applications | GET | Basic Auth | 120 req/min |
| DNAC | https://10.252.1.20/dna/intent/api/v1/client-health | GET | JWT Token | 300 req/min |
| vManage | https://10.252.50.10/dataservice/device | GET | Session Cookie | 100 req/min |
| ServiceNow | https://abhavtech.service-now.com/api/now/table/incident | POST | Basic Auth | 500 req/min |

---

### Appendix H: Capacity Planning Calculator

**Splunk Storage Capacity Python:**

```python
# Calculate Splunk storage requirements

daily_ingestion_gb = 100
hot_retention_days = 90
warm_retention_days = 275
replication_factor = 3

# Hot tier (NVMe SSD)
hot_storage_raw = daily_ingestion_gb * hot_retention_days
hot_storage_replicated = hot_storage_raw * replication_factor
hot_storage_required = hot_storage_replicated * 1.2
print(f"Hot Storage Required: {hot_storage_required / 1024:.1f} TB")

# Warm tier (SAS HDD)
warm_storage_raw = daily_ingestion_gb * warm_retention_days
warm_storage_replicated = warm_storage_raw * replication_factor
warm_storage_required = warm_storage_replicated * 1.2
print(f"Warm Storage Required: {warm_storage_required / 1024:.1f} TB")

# Total
total_storage = hot_storage_required + warm_storage_required
print(f"Total Storage Required: {total_storage / 1024:.1f} TB")

# Output:
# Hot Storage Required: 32.4 TB
# Warm Storage Required: 97.2 TB
# Total Storage Required: 129.6 TB
```

---

### Appendix I: Webex/WxCC Observability Configuration

**WxCC API Configuration YAML:**

```yaml
wxcc_api:
  base_url: https://api.wxcc-us1.cisco.com
  auth:
    client_id: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
    client_secret: XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
  endpoints:
    cdr: /v1/cdr
    agents: /v1/agents
    queues: /v1/queues
    recordings: /v1/recordings
  webhook:
    url: https://10.252.100.50:8088/services/collector/event
    token: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
```

**WxCC CDR Parsing (Splunk):**

```spl
# Parse WxCC Call Detail Records
index=wxcc_cdr sourcetype=wxcc:cdr
| spath input=_raw path=callId output=call_id
| spath input=_raw path=agentId output=agent_id
| spath input=_raw path=queue output=queue_name
| spath input=_raw path=duration output=duration_sec
| spath input=_raw path=disposition output=disposition
| eval duration_min=duration_sec/60
| table _time, call_id, agent_id, queue_name, duration_min, disposition
```

**WxCC Quality Metrics (ThousandEyes JSON):**

```json
{
  "testName": "WxCC-Media-Mumbai",
  "interval": 60,
  "enabled": 1,
  "type": "voice",
  "server": "wxcc-media-mum.webex.com:5004",
  "codec": "G.711",
  "dscp": 46,
  "duration": 10,
  "agents": [
    {
      "agentId": 789012,
      "agentName": "Mumbai-HQ-Agent"
    }
  ],
  "alertRules": [
    {
      "ruleId": 4001,
      "expression": "((mos < 4.2))",
      "alertType": "WxCC Voice Quality",
      "minimumSources": 1,
      "roundsViolating": 2
    }
  ]
}
```

---

*© 2025 Abhavtech - Document 2: AI-Enabled Observability v1.0*  


---

**END OF DOCUMENT 2**

