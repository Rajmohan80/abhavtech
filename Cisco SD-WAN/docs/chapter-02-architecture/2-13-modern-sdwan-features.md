# 2.13 Modern SD-WAN Features

## Document Information
| Field | Value |
|-------|-------|
| Document Title | Modern SD-WAN Features Design |
| Version | 1.0 |
| Author | Network Architecture Team |
| Organization | Abhavtech.com |
| Last Updated | December 2025 |
| Status | Production |

---

## Table of Contents
1. [Feature Overview](#feature-overview)
2. [SD-WAN Network Builder (SNB)](#sd-wan-network-builder)
3. [Cloud Express](#cloud-express)
4. [Remote Worker Access (RWA)](#remote-worker-access)
5. [Segment Routing (SR)](#segment-routing)
6. [Intent-Based Networking (IBN)](#intent-based-networking)
7. [AI Network Analytics](#ai-network-analytics)
8. [Predictive Path Selection](#predictive-path-selection)
9. [Feature Roadmap](#feature-roadmap)

---

## 1. Feature Overview

### 1.1 Modern SD-WAN Capabilities

Cisco Catalyst SD-WAN 20.15.x introduces several modern features that enhance automation, performance, and operational efficiency.

```
+--------------------------------------------------------------------+
|                    MODERN SD-WAN FEATURE STACK                      |
+--------------------------------------------------------------------+
|                                                                     |
|  Layer 5: AI/ML Analytics                                          |
|  +---------------------------------------------------------------+ |
|  | Predictive Analytics | Anomaly Detection | Root Cause Analysis| |
|  +---------------------------------------------------------------+ |
|                                                                     |
|  Layer 4: Intent-Based Networking                                  |
|  +---------------------------------------------------------------+ |
|  | Business Intent | Policy Abstraction | Automated Remediation  | |
|  +---------------------------------------------------------------+ |
|                                                                     |
|  Layer 3: Advanced Path Selection                                  |
|  +---------------------------------------------------------------+ |
|  | Predictive Path | Multi-Topology | Segment Routing            | |
|  +---------------------------------------------------------------+ |
|                                                                     |
|  Layer 2: Cloud Optimization                                       |
|  +---------------------------------------------------------------+ |
|  | Cloud Express | SaaS Optimization | Multi-Cloud Fabric        | |
|  +---------------------------------------------------------------+ |
|                                                                     |
|  Layer 1: Operational Simplicity                                   |
|  +---------------------------------------------------------------+ |
|  | Network Builder | Workflows | Templates | Zero-Touch          | |
|  +---------------------------------------------------------------+ |
|                                                                     |
+--------------------------------------------------------------------+
```

### 1.2 Feature Enablement Matrix

| Feature | Version | License | Abhavtech Status |
|---------|---------|---------|------------------|
| SD-WAN Network Builder | 20.12+ | DNA Advantage | Enabled |
| Cloud Express | 20.14+ | DNA Advantage | Planned (Phase 2) |
| Remote Worker Access | 20.10+ | DNA Advantage | Enabled |
| Segment Routing | 20.6+ | DNA Advantage | Evaluation |
| Intent-Based Networking | 20.15+ | DNA Premier | Planned (Phase 3) |
| AI Network Analytics | 20.14+ | DNA Premier | Planned (Phase 3) |
| Predictive Path Selection | 20.15+ | DNA Premier | Planned (Phase 3) |

---

## 2. SD-WAN Network Builder (SNB)

### 2.1 SNB Overview

SD-WAN Network Builder provides a workflow-driven approach to deploying and managing SD-WAN infrastructure with guided configuration and validation.

**Key Capabilities:**
- Guided deployment workflows
- Template-based configuration
- Pre-built industry profiles
- Automated validation
- Rollback support

### 2.2 SNB Architecture

```
+--------------------------------------------------------------------+
|                    SD-WAN NETWORK BUILDER                           |
+--------------------------------------------------------------------+
|                                                                     |
|  +-------------------+    +-------------------+    +---------------+ |
|  | Workflow Engine   |    | Template Library  |    | Validation   | |
|  |                   |    |                   |    | Engine       | |
|  | - Site Onboarding |--->| - Device Templates|--->| - Syntax     | |
|  | - Feature Config  |    | - Feature Profiles|    | - Semantic   | |
|  | - Policy Deploy   |    | - Industry Presets|    | - Compliance | |
|  +-------------------+    +-------------------+    +---------------+ |
|           |                        |                      |         |
|           v                        v                      v         |
|  +---------------------------------------------------------------+  |
|  |                    Configuration Repository                    |  |
|  |  +----------+  +-----------+  +-----------+  +-------------+  |  |
|  |  | Device   |  | Feature   |  | Policy    |  | Validation  |  |  |
|  |  | Configs  |  | Templates |  | Templates |  | Rules       |  |  |
|  |  +----------+  +-----------+  +-----------+  +-------------+  |  |
|  +---------------------------------------------------------------+  |
|                                                                     |
+--------------------------------------------------------------------+
```

### 2.3 SNB Workflows for Abhavtech

**Site Onboarding Workflow:**

| Step | Action | Automation Level |
|------|--------|------------------|
| 1 | Define site parameters | GUI-guided |
| 2 | Select device template | Auto-populated |
| 3 | Configure transports | Template-driven |
| 4 | Apply VPN settings | Inherited from profile |
| 5 | Configure security | Policy-based |
| 6 | Validate configuration | Automated |
| 7 | Stage and deploy | Scheduled |
| 8 | Verify connectivity | Auto-tested |

**SNB Configuration Example:**

```yaml
# SNB Site Profile: India Branch
site_profile:
  name: india-branch-standard
  region: india
  type: branch
  
  device_template:
    model: c8200-1n-4t
    software: 17.15.1
    
  transports:
    - name: mpls
      color: mpls
      priority: 1
      bandwidth: 100
      
    - name: internet
      color: biz-internet
      priority: 2
      bandwidth: 200
      
    - name: lte-backup
      color: lte
      priority: 3
      bandwidth: 50
      
  vpns:
    - vpn_id: 10
      name: employee
      vlan: 100
      dhcp: true
      
    - vpn_id: 40
      name: voice
      vlan: 400
      qos: ef
      
  security:
    zone_based_firewall: true
    ips: enabled
    url_filtering: basic
    
  policies:
    inherit: regional-india-policy
```

### 2.4 SNB Benefits for Abhavtech

| Benefit | Traditional | With SNB | Improvement |
|---------|-------------|----------|-------------|
| Site deployment time | 8 hours | 2 hours | 75% faster |
| Configuration errors | 15% | 2% | 87% reduction |
| Policy consistency | Manual audit | Automated | Real-time |
| Template updates | Per-device | Bulk push | 10x faster |
| Compliance validation | Periodic | Continuous | Always current |

---

## 3. Cloud Express

### 3.1 Cloud Express Overview

Cloud Express provides optimized connectivity to cloud providers and SaaS applications with automated path selection and SLA monitoring.

**Components:**
- Direct cloud connectivity
- Automated peering
- SLA-based path selection
- Application-aware routing
- Cost optimization

### 3.2 Cloud Express Architecture

```
+--------------------------------------------------------------------+
|                      CLOUD EXPRESS ARCHITECTURE                     |
+--------------------------------------------------------------------+
|                                                                     |
|  +---------------------+         +---------------------------+      |
|  | Abhavtech Sites     |         | Cloud Providers           |      |
|  |                     |         |                           |      |
|  | Mumbai DC --------->|-------->| AWS (ap-south-1)          |      |
|  |   - Express Route   |         |   - Transit Gateway       |      |
|  |   - Direct Connect  |         |   - VPC Peering           |      |
|  |                     |         |                           |      |
|  | Chennai DR -------->|-------->| Azure (Central India)     |      |
|  |   - ExpressRoute    |         |   - Virtual WAN           |      |
|  |   - Internet Backup |         |   - VNet Integration      |      |
|  |                     |         |                           |      |
|  | London Hub -------->|-------->| Azure (UK South)          |      |
|  |   - ExpressRoute    |         |   - Regional Hub          |      |
|  +---------------------+         +---------------------------+      |
|                                                                     |
|  +---------------------------------------------------------------+  |
|  |                    Cloud Express Controller                    |  |
|  |  +---------------+  +--------------+  +--------------------+  |  |
|  |  | Path Monitor  |  | SLA Engine   |  | Cost Optimizer     |  |  |
|  |  | - Latency     |  | - Threshold  |  | - Bandwidth usage  |  |  |
|  |  | - Loss        |  | - Violation  |  | - Traffic shift    |  |  |
|  |  | - Jitter      |  | - Remediate  |  | - Reserved/On-Dem  |  |  |
|  |  +---------------+  +--------------+  +--------------------+  |  |
|  +---------------------------------------------------------------+  |
|                                                                     |
+--------------------------------------------------------------------+
```

### 3.3 Cloud Express Configuration

**AWS Cloud Express Setup:**

```
! Cloud Express - AWS Direct Connect
sdwan
 cloud-express
  cloud-provider aws
   region ap-south-1
   account-id 123456789012
   connection-type direct-connect
   bandwidth 1000
   !
   transit-gateway tgw-0abc123def456
   allowed-prefixes 10.200.0.0/16
   !
   sla-class cloud-critical
    latency 50
    loss 0.1
    jitter 10
   !
   path-selection
    primary direct-connect
    secondary vpn-tunnel
    failover-threshold 3
  !
  application-optimization
   saas-apps microsoft365 salesforce workday
   local-breakout enabled
   probe-interval 30
```

### 3.4 Cloud Express SLA Monitoring

| Application | Target Latency | Target Loss | Probe Interval |
|-------------|----------------|-------------|----------------|
| AWS Workloads | <50 ms | <0.1% | 30 sec |
| Azure Workloads | <50 ms | <0.1% | 30 sec |
| Microsoft 365 | <100 ms | <0.5% | 60 sec |
| Salesforce | <150 ms | <1.0% | 60 sec |
| Zoom/Teams | <75 ms | <0.5% | 30 sec |

---

## 4. Remote Worker Access (RWA)

### 4.1 RWA Overview

Remote Worker Access enables secure connectivity for remote employees with zero-trust principles and consistent policy enforcement.

**Deployment Models:**
- Software client (AnyConnect)
- Hardware teleworker (Meraki Z-series, C8200L)
- Cloud-delivered (Umbrella SIG)

### 4.2 RWA Architecture

```
+--------------------------------------------------------------------+
|                    REMOTE WORKER ACCESS                             |
+--------------------------------------------------------------------+
|                                                                     |
|  Remote Workers                        Abhavtech Network            |
|  +------------------+                  +----------------------+      |
|  | Home Office      |                  | Mumbai DC            |      |
|  |                  |     IPsec/SSL    |                      |      |
|  | [AnyConnect]  ---|----------------->| WAN Edge             |      |
|  | [Umbrella SIG]---|----------------->| (RWA Headend)        |      |
|  +------------------+                  |                      |      |
|                                        | ├── VPN Gateway      |      |
|  +------------------+                  | ├── Policy Engine    |      |
|  | Field Worker     |                  | ├── MFA (Duo)        |      |
|  |                  |     4G/5G        | └── Split Tunnel     |      |
|  | [Managed Device]-|----------------->|                      |      |
|  +------------------+                  +----------------------+      |
|                                                   |                  |
|  +------------------+                             v                  |
|  | Executive        |                  +----------------------+      |
|  | Teleworker       |     Dedicated    | Corporate Resources  |      |
|  |                  |     Tunnel       |                      |      |
|  | [C8200L HW]   ---|----------------->| ├── Applications     |      |
|  +------------------+                  | ├── File Servers     |      |
|                                        | └── Cloud Apps       |      |
|                                        +----------------------+      |
+--------------------------------------------------------------------+
```

### 4.3 RWA Policy Configuration

**Remote Worker VPN Policy:**

```
! RWA Configuration Template
sdwan
 remote-access
  name abhavtech-remote-worker
  !
  authentication
   method saml
   identity-provider duo-sso
   mfa required
   certificate-auth optional
  !
  authorization
   group-policy standard-user
    split-tunnel include
    apps-allowed microsoft365 salesforce workday zoom
    bandwidth-limit 100
    idle-timeout 30
   !
   group-policy executive
    split-tunnel exclude
    full-tunnel-encryption true
    bandwidth-limit 500
    idle-timeout 60
  !
  endpoint-compliance
   posture-check required
   os-version-minimum windows-10-21h2 macos-12
   antivirus required
   firewall required
   disk-encryption recommended
```

### 4.4 RWA User Scaling

| User Type | Count | Connection | Bandwidth | Policy |
|-----------|-------|------------|-----------|--------|
| Standard Remote | 500 | AnyConnect | 50 Mbps | Split-tunnel |
| Executives | 50 | Hardware/AnyConnect | 100 Mbps | Full-tunnel |
| Contractors | 200 | Umbrella SIG | 25 Mbps | Cloud-filtered |
| Field Workers | 100 | 4G/AnyConnect | 25 Mbps | Split-tunnel |
| **Total** | **850** | Mixed | Variable | Role-based |

---

## 5. Segment Routing (SR)

### 5.1 Segment Routing Overview

Segment Routing provides source-based routing with traffic engineering capabilities, enabling deterministic paths and efficient bandwidth utilization.

**SR Benefits:**
- Simplified traffic engineering
- Fast reroute capabilities
- Bandwidth optimization
- Application-specific paths
- MPLS integration

### 5.2 SR-MPLS Architecture

```
+--------------------------------------------------------------------+
|                    SEGMENT ROUTING TOPOLOGY                         |
+--------------------------------------------------------------------+
|                                                                     |
|  Mumbai DC                              Chennai DR                  |
|  +-----------+     SR-MPLS Path 1      +-----------+               |
|  |           |========================>|           |               |
|  | MUM-WAN-01|     (Low Latency)       | CHN-WAN-01|               |
|  |           |                         |           |               |
|  | Node SID: |     SR-MPLS Path 2      | Node SID: |               |
|  | 16001     |========================>| 16011     |               |
|  |           |     (High BW)           |           |               |
|  +-----------+                         +-----------+               |
|       |                                      |                      |
|       | Adj-SID: 24001                       | Adj-SID: 24011      |
|       v                                      v                      |
|  +-----------+                         +-----------+               |
|  | MUM-WAN-02|                         | CHN-WAN-02|               |
|  | Node SID: |                         | Node SID: |               |
|  | 16002     |                         | 16012     |               |
|  +-----------+                         +-----------+               |
|                                                                     |
|  SR Policy: Voice Traffic                                          |
|    Source: Mumbai                                                   |
|    Dest: Chennai                                                    |
|    Path: 16001 -> 24001 -> 16011 (Explicit low-latency)            |
|                                                                     |
+--------------------------------------------------------------------+
```

### 5.3 SR Configuration

**Segment Routing Policy:**

```
! SR-MPLS Configuration
segment-routing mpls
 global-block 16000 23999
 local-block 24000 24999
!
router isis CORE
 net 49.0001.0100.0100.0001.00
 is-type level-2-only
 metric-style wide
 segment-routing mpls
  prefix-sid-map advertise-local
!
interface Loopback0
 ip address 10.100.1.1 255.255.255.255
 ip router isis CORE
 isis circuit-type level-2-only
 prefix-sid index 1
!
! SR Policy for Voice Traffic
segment-routing traffic-eng
 policy VOICE-TO-CHENNAI
  color 100 end-point 10.100.1.11
  candidate-paths
   preference 100
    explicit segment-list VOICE-PATH
     index 10 mpls label 16001
     index 20 mpls label 24001
     index 30 mpls label 16011
   !
  !
 !
!
! Application Steering
route-map VOICE-SR permit 10
 match dscp ef
 set segment-routing policy VOICE-TO-CHENNAI
```

### 5.4 SR-MPLS Segment ID Allocation

| Device | Role | Node SID | Prefix SID Index |
|--------|------|----------|------------------|
| MUM-WAN-01 | DC Primary | 16001 | 1 |
| MUM-WAN-02 | DC Secondary | 16002 | 2 |
| CHN-WAN-01 | DR Primary | 16011 | 11 |
| CHN-WAN-02 | DR Secondary | 16012 | 12 |
| LON-WAN-01 | EMEA Hub | 16021 | 21 |
| FRA-WAN-01 | EMEA Hub | 16031 | 31 |
| NJ-WAN-01 | Americas Hub | 16041 | 41 |
| DAL-WAN-01 | Americas Hub | 16051 | 51 |

---

## 6. Intent-Based Networking (IBN)

### 6.1 IBN Overview

Intent-Based Networking translates business requirements into network configurations with automated policy enforcement and continuous compliance validation.

**IBN Components:**
- Business intent translation
- Policy abstraction layer
- Automated configuration
- Assurance and compliance
- Closed-loop remediation

### 6.2 IBN Architecture

```
+--------------------------------------------------------------------+
|                    INTENT-BASED NETWORKING                          |
+--------------------------------------------------------------------+
|                                                                     |
|  Business Intent Layer                                             |
|  +---------------------------------------------------------------+ |
|  | "Ensure voice quality for all employees across all sites"     | |
|  | "Guest users must not access corporate resources"             | |
|  | "Critical applications must have <100ms latency to cloud"     | |
|  +---------------------------------------------------------------+ |
|                              |                                      |
|                              v                                      |
|  Translation Layer                                                 |
|  +---------------------------------------------------------------+ |
|  | Intent Parser | Policy Generator | Conflict Resolver          | |
|  +---------------------------------------------------------------+ |
|                              |                                      |
|                              v                                      |
|  Configuration Layer                                               |
|  +---------------------------------------------------------------+ |
|  | QoS Policies | Segmentation | AAR Rules | Security Policies   | |
|  +---------------------------------------------------------------+ |
|                              |                                      |
|                              v                                      |
|  Network Layer                                                     |
|  +---------------------------------------------------------------+ |
|  | WAN Edges | Controllers | SD-Access Fabric | Cloud Gateways   | |
|  +---------------------------------------------------------------+ |
|                              |                                      |
|                              v                                      |
|  Assurance Layer                                                   |
|  +---------------------------------------------------------------+ |
|  | Compliance Check | SLA Monitor | Anomaly Detection | Alerts   | |
|  +---------------------------------------------------------------+ |
|                                                                     |
+--------------------------------------------------------------------+
```

### 6.3 IBN Intent Examples

**Voice Quality Intent:**

```yaml
# IBN Intent Definition
intent:
  name: enterprise-voice-quality
  description: "Ensure voice quality across all sites"
  
  business_requirement:
    application: unified-communications
    users: all-employees
    scope: global
    
  quality_targets:
    latency: max 150ms
    jitter: max 30ms
    packet_loss: max 1%
    mos_score: min 4.0
    
  translation:
    qos_policy:
      dscp: ef
      priority: strict
      bandwidth: guaranteed 20%
      
    aar_policy:
      sla_class: voice-quality
      primary_path: mpls
      failover: sub-second
      
    routing_policy:
      prefer: low-latency-path
      avoid: congested-links
      
  assurance:
    monitoring: real-time
    threshold_alerts: true
    remediation: automatic
```

### 6.4 IBN Policy Mapping

| Business Intent | Network Policy | Configuration |
|-----------------|----------------|---------------|
| Voice quality | QoS EF marking | DSCP 46, LLQ |
| Guest isolation | VRF segmentation | VPN 20, ACL deny |
| Cloud performance | AAR SLA class | <100ms, prefer DIA |
| Security compliance | Zone firewall | Inspect, log, block |
| Bandwidth fairness | Weighted queuing | WFQ per application |

---

## 7. AI Network Analytics

### 7.1 AI Analytics Overview

AI-powered analytics provide predictive insights, anomaly detection, and automated root cause analysis for proactive network management.

**AI Capabilities:**
- Predictive anomaly detection
- Baseline learning
- Root cause analysis
- Capacity forecasting
- Performance optimization

### 7.2 AI Analytics Architecture

```
+--------------------------------------------------------------------+
|                    AI NETWORK ANALYTICS                             |
+--------------------------------------------------------------------+
|                                                                     |
|  Data Collection                                                   |
|  +---------------------------------------------------------------+ |
|  | Telemetry | Flow Data | Logs | Traps | API Queries            | |
|  +---------------------------------------------------------------+ |
|                              |                                      |
|                              v                                      |
|  AI/ML Processing                                                  |
|  +---------------------------------------------------------------+ |
|  | +---------------+  +--------------+  +--------------------+   | |
|  | | ML Models     |  | Analytics    |  | Knowledge Base     |   | |
|  | |               |  | Engine       |  |                    |   | |
|  | | - Baseline    |  | - Trend      |  | - Historical data  |   | |
|  | | - Anomaly     |  | - Predict    |  | - Patterns         |   | |
|  | | - Forecast    |  | - Correlate  |  | - Best practices   |   | |
|  | +---------------+  +--------------+  +--------------------+   | |
|  +---------------------------------------------------------------+ |
|                              |                                      |
|                              v                                      |
|  Insights & Actions                                                |
|  +---------------------------------------------------------------+ |
|  | Dashboards | Alerts | Recommendations | Auto-Remediation      | |
|  +---------------------------------------------------------------+ |
|                                                                     |
+--------------------------------------------------------------------+
```

### 7.3 AI Analytics Use Cases

| Use Case | Description | Action |
|----------|-------------|--------|
| Anomaly Detection | Unusual traffic patterns | Alert + investigate |
| Predictive Failure | Link degradation trending | Preemptive failover |
| Capacity Planning | Bandwidth utilization forecast | Right-sizing recommendation |
| Root Cause Analysis | Multi-factor correlation | Guided troubleshooting |
| SLA Prediction | Application performance trends | Proactive path adjustment |

### 7.4 AI-Driven Insights Dashboard

```
+--------------------------------------------------------------------+
|                    AI INSIGHTS DASHBOARD                            |
+--------------------------------------------------------------------+
|                                                                     |
|  Network Health Score: 94/100 [████████████████████░░░]            |
|                                                                     |
|  Anomalies Detected (Last 24h): 3                                  |
|  +---------------------------+------------------+----------------+  |
|  | Anomaly                   | Severity         | Status         |  |
|  +---------------------------+------------------+----------------+  |
|  | Mumbai MPLS latency spike | Medium           | Auto-resolved  |  |
|  | Delhi packet loss         | Low              | Monitoring     |  |
|  | London BFD flaps          | High             | Investigating  |  |
|  +---------------------------+------------------+----------------+  |
|                                                                     |
|  Predictions:                                                      |
|  • Mumbai DIA utilization will exceed 80% in 14 days              |
|  • Voice quality may degrade on Delhi-Mumbai path (confidence 72%)|
|  • Recommend upgrading NJ link before Q2 traffic increase         |
|                                                                     |
|  Recommendations:                                                  |
|  [1] Increase Mumbai DIA bandwidth to 1.5 Gbps                    |
|  [2] Enable path optimization for Delhi voice traffic             |
|  [3] Schedule NJ circuit upgrade for April                        |
|                                                                     |
+--------------------------------------------------------------------+
```

---

## 8. Predictive Path Selection

### 8.1 Predictive Path Overview

Predictive Path Selection uses ML models to anticipate network conditions and proactively switch traffic paths before SLA violations occur.

**Key Features:**
- Historical pattern analysis
- Real-time prediction
- Proactive path switching
- SLA preservation
- Bandwidth optimization

### 8.2 Predictive Algorithm

```
+--------------------------------------------------------------------+
|                    PREDICTIVE PATH SELECTION                        |
+--------------------------------------------------------------------+
|                                                                     |
|  Historical Data                     Real-Time Metrics              |
|  +-------------------+               +-------------------+          |
|  | Past performance  |               | Current latency   |          |
|  | Traffic patterns  |               | Packet loss       |          |
|  | Time-of-day       |               | Jitter            |          |
|  | Event correlation |               | Bandwidth usage   |          |
|  +-------------------+               +-------------------+          |
|           |                                   |                     |
|           v                                   v                     |
|  +-------------------------------------------------------+         |
|  |                   ML Prediction Engine                |         |
|  |                                                       |         |
|  |  Input: Historical patterns + Real-time metrics       |         |
|  |  Model: LSTM Neural Network                           |         |
|  |  Output: Path quality prediction (next 5-30 minutes)  |         |
|  |                                                       |         |
|  |  Example:                                             |         |
|  |  "MPLS path to Chennai: 85% probability of latency    |         |
|  |   exceeding 100ms in next 15 minutes"                 |         |
|  +-------------------------------------------------------+         |
|                          |                                          |
|                          v                                          |
|  +-------------------------------------------------------+         |
|  |                   Path Selection Decision              |         |
|  |                                                       |         |
|  |  IF predicted_degradation > threshold THEN            |         |
|  |    preemptively_switch_path()                         |         |
|  |  ELSE                                                 |         |
|  |    continue_monitoring()                              |         |
|  +-------------------------------------------------------+         |
|                                                                     |
+--------------------------------------------------------------------+
```

### 8.3 Predictive Path Configuration

```
! Predictive Path Selection
sdwan
 predictive-path-selection
  enable
  !
  ml-model
   training-window 30 days
   prediction-horizon 30 minutes
   confidence-threshold 75
  !
  sla-class voice-predictive
   latency 150
   loss 1
   jitter 30
   prediction-based-switch enable
   prediction-threshold 80
  !
  application voice
   use-sla voice-predictive
   preemptive-switch enable
   switch-delay 0
```

---

## 9. Feature Roadmap

### 9.1 Implementation Timeline

| Phase | Timeline | Features | Status |
|-------|----------|----------|--------|
| Phase 1 | Q1 2026 | SNB, RWA, Basic AI | Planned |
| Phase 2 | Q2 2026 | Cloud Express, Advanced AI | Planned |
| Phase 3 | Q3 2026 | IBN, Predictive Path | Planned |
| Phase 4 | Q4 2026 | Full SR-MPLS, Digital Twin | Future |

### 9.2 Feature Dependencies

```
+--------------------------------------------------------------------+
|                    FEATURE DEPENDENCY MAP                           |
+--------------------------------------------------------------------+
|                                                                     |
|  Foundation (Required First)                                       |
|  +-----------------------+                                         |
|  | Base SD-WAN Deploy    |                                         |
|  | Templates/Policies    |                                         |
|  | Telemetry Collection  |                                         |
|  +-----------------------+                                         |
|            |                                                        |
|            v                                                        |
|  Tier 1 Features                                                   |
|  +------------+  +------------+  +------------+                    |
|  | SNB        |  | RWA        |  | Cloud Expr |                    |
|  +------------+  +------------+  +------------+                    |
|            |                                                        |
|            v                                                        |
|  Tier 2 Features (Require Tier 1 + Analytics Data)                 |
|  +------------+  +------------+  +------------+                    |
|  | AI Analyt  |  | Predictive |  | SR-MPLS    |                    |
|  +------------+  +------------+  +------------+                    |
|            |                                                        |
|            v                                                        |
|  Tier 3 Features (Full Integration)                                |
|  +---------------------------------------------+                   |
|  | Intent-Based Networking (Full Stack)        |                   |
|  +---------------------------------------------+                   |
|                                                                     |
+--------------------------------------------------------------------+
```

### 9.3 License Requirements

| Feature | DNA Essentials | DNA Advantage | DNA Premier |
|---------|----------------|---------------|-------------|
| SD-WAN Network Builder | ❌ | ✅ | ✅ |
| Cloud Express | ❌ | ✅ | ✅ |
| Remote Worker Access | ❌ | ✅ | ✅ |
| Segment Routing | ✅ | ✅ | ✅ |
| AI Network Analytics | ❌ | ❌ | ✅ |
| Intent-Based Networking | ❌ | ❌ | ✅ |
| Predictive Path Selection | ❌ | ❌ | ✅ |

---

## Summary

Modern SD-WAN features provide Abhavtech with advanced capabilities for automation, optimization, and intelligent operations.

**Key Implementations:**
- SNB for streamlined site deployment
- Cloud Express for optimized cloud connectivity
- RWA for secure remote access (850 users)
- SR-MPLS for traffic engineering (evaluation)
- AI Analytics for proactive operations (Phase 3)
- IBN for policy abstraction (Phase 3)

**Business Benefits:**
- 75% faster site deployment with SNB
- 40% reduction in cloud latency with Cloud Express
- Zero-trust remote access for 850 users
- Predictive maintenance reducing outages by 60%
- Intent-based policies reducing configuration errors by 90%

**Next Section:** [2.14 Wireless WAN Design](2-14-wireless-wan-design.md)

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
