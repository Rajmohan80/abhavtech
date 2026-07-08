# 4.2 Application-Aware Routing (AAR)

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-POL-4.2 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

Application-Aware Routing (AAR) enables intelligent path selection based on real-time network performance metrics. This section documents the AAR implementation for Abhavtech's SD-WAN deployment, including SLA class definitions, path selection algorithms, and fallback mechanisms.

### 1.1 AAR Architecture

```
+------------------------------------------------------------------+
|                    AAR ARCHITECTURE                               |
+------------------------------------------------------------------+
|                                                                   |
|  Application Traffic                                              |
|  +------------------+                                             |
|  | MS Teams Call    |                                             |
|  | App ID: ms-teams |                                             |
|  +--------+---------+                                             |
|           |                                                       |
|           v                                                       |
|  +------------------+     +------------------+                    |
|  | DPI Engine       |---->| App Classification|                   |
|  | (NBAR2)          |     | ms-teams detected |                   |
|  +------------------+     +--------+---------+                    |
|                                    |                              |
|                                    v                              |
|  +------------------+     +------------------+                    |
|  | App-Route Policy |<----| SLA Class Match  |                    |
|  | VOICE-SLA        |     | Latency < 150ms  |                    |
|  +--------+---------+     +------------------+                    |
|           |                                                       |
|           v                                                       |
|  +------------------+     +------------------+                    |
|  | BFD Probes       |---->| Path Health      |                    |
|  | Per Transport    |     | MPLS: OK         |                    |
|  +------------------+     | Internet: Degraded|                   |
|                           +--------+---------+                    |
|                                    |                              |
|                                    v                              |
|  +------------------+                                             |
|  | Path Selection   |                                             |
|  | Choose MPLS      |                                             |
|  +------------------+                                             |
|                                                                   |
+------------------------------------------------------------------+
```

### 1.2 Key Components

| Component | Function | Configuration |
|-----------|----------|---------------|
| NBAR2 | Deep packet inspection | Automatic |
| BFD | Path health monitoring | Per TLOC |
| SLA Class | Performance thresholds | Policy defined |
| App-Route Policy | Application-to-SLA mapping | Per VPN |

---

## 2. SLA Class Definitions

### 2.1 Abhavtech SLA Classes

```
+------------------------------------------------------------------+
|                    SLA CLASS DEFINITIONS                          |
+------------------------------------------------------------------+
|                                                                   |
|  SLA Class         | Latency | Loss  | Jitter | Use Case         |
|  ------------------+---------+-------+--------+------------------|
|  VOICE-CRITICAL    | 100 ms  | 0.5%  | 20 ms  | Voice/UC         |
|  VIDEO-REALTIME    | 150 ms  | 1%    | 30 ms  | Video conferencing|
|  BUSINESS-CRITICAL | 200 ms  | 1%    | 50 ms  | SAP, ERP, CRM    |
|  BUSINESS-STANDARD | 300 ms  | 2%    | 100 ms | Email, file share|
|  BEST-EFFORT       | 500 ms  | 5%    | 200 ms | Internet, updates|
|                                                                   |
+------------------------------------------------------------------+
```

### 2.2 SLA Class Configuration

```
! SLA Class Definitions
policy
 sla-class VOICE-CRITICAL
  latency 100
  loss 0
  jitter 20
 !
 sla-class VIDEO-REALTIME
  latency 150
  loss 1
  jitter 30
 !
 sla-class BUSINESS-CRITICAL
  latency 200
  loss 1
  jitter 50
 !
 sla-class BUSINESS-STANDARD
  latency 300
  loss 2
  jitter 100
 !
 sla-class BEST-EFFORT
  latency 500
  loss 5
  jitter 200
 !
!
```

### 2.3 SLA Measurement

```
+------------------------------------------------------------------+
|                    BFD-BASED SLA MEASUREMENT                      |
+------------------------------------------------------------------+
|                                                                   |
|  BFD Probe Configuration:                                         |
|  +----------------------------------------------------------+    |
|  | Parameter          | Value        | Description          |    |
|  +----------------------------------------------------------+    |
|  | Hello Interval     | 1000 ms      | Probe frequency      |    |
|  | Poll Interval      | 600000 ms    | SLA calculation      |    |
|  | Multiplier         | 6            | Failure detection    |    |
|  | App Probe Class    | All SLAs     | Per-SLA probing      |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Measurement Window:                                              |
|  - Rolling 10-minute average                                      |
|  - Updated every poll interval                                    |
|  - Exponential weighted moving average                            |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 3. Application Classification

### 3.1 Application Lists

```
! Voice Applications
policy
 lists
  app-list VOICE-APPS
   app cisco-jabber
   app cisco-phone
   app cisco-webex-calling
   app ms-teams-audio
   app zoom-audio
   app sip
   app rtp
   app rtcp
  !
  
  ! Video Applications
  app-list VIDEO-APPS
   app ms-teams-video
   app cisco-webex-video
   app zoom-video
   app youtube
   app vimeo
  !
  
  ! Business Critical Applications
  app-list BUSINESS-CRITICAL-APPS
   app salesforce
   app sap
   app oracle-db
   app ms-office-365
   app ms-sharepoint
   app servicenow
  !
  
  ! Collaboration Applications
  app-list COLLABORATION-APPS
   app ms-teams
   app cisco-webex
   app slack
   app zoom
  !
  
  ! Low Priority Applications
  app-list LOW-PRIORITY-APPS
   app bittorrent
   app windows-update
   app apple-update
   app dropbox
   app box
  !
 !
!
```

### 3.2 Custom Application Signatures

```
! Custom Application for Internal Apps
policy
 lists
  app-list INTERNAL-APPS
   app-family custom
  !
 !
!

! Define Custom Application on WAN Edge
app-hosting appid ABHAV-ERP
 app-resource profile custom
 name-server 10.254.1.20

policy-map type inspect match-first ABHAV-APPS
 class type inspect ABHAV-ERP
  match protocol http host "*.erp.abhavtech.com"
  match protocol https host "*.erp.abhavtech.com"
!
```

---

## 4. App-Route Policy Design

### 4.1 Complete App-Route Policy

```
! Abhavtech App-Route Policy
policy
 app-route-policy AAR-POLICY
  vpn-list VPN-10-EMPLOYEE
   ! Voice - Strictest SLA
   sequence 10
    match
     app-list VOICE-APPS
    !
    action
     sla-class VOICE-CRITICAL strict
     !
     backup-sla-preferred-color mpls
    !
   !
   
   ! Video - Real-time SLA
   sequence 20
    match
     app-list VIDEO-APPS
    !
    action
     sla-class VIDEO-REALTIME strict
     !
     backup-sla-preferred-color mpls biz-internet
    !
   !
   
   ! Business Critical - High SLA
   sequence 30
    match
     app-list BUSINESS-CRITICAL-APPS
    !
    action
     sla-class BUSINESS-CRITICAL
     !
     backup-sla-preferred-color mpls
    !
   !
   
   ! Collaboration - Medium SLA
   sequence 40
    match
     app-list COLLABORATION-APPS
    !
    action
     sla-class VIDEO-REALTIME
    !
   !
   
   ! Low Priority - Best Effort
   sequence 50
    match
     app-list LOW-PRIORITY-APPS
    !
    action
     sla-class BEST-EFFORT
     !
     backup-sla-preferred-color biz-internet lte
    !
   !
   
   ! Default - Standard SLA
   default-action
    sla-class BUSINESS-STANDARD
   !
  !
 !
!
```

### 4.2 SLA Action Modes

```
+------------------------------------------------------------------+
|                    SLA ACTION MODES                               |
+------------------------------------------------------------------+
|                                                                   |
|  MODE: STRICT                                                     |
|  +----------------------------------------------------------+    |
|  | - Traffic ONLY sent if SLA is met                         |   |
|  | - If no path meets SLA, traffic is DROPPED                |   |
|  | - Use for voice/video where quality > availability        |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  MODE: FALLBACK (Default)                                         |
|  +----------------------------------------------------------+    |
|  | - Try paths meeting SLA first                             |   |
|  | - If none available, use best available path              |   |
|  | - Balances quality and availability                       |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  MODE: PREFERRED COLOR                                            |
|  +----------------------------------------------------------+    |
|  | - Prefer specific transport colors                        |   |
|  | - Used with backup-sla-preferred-color                    |   |
|  | - Fallback order: preferred colors → any path             |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 5. Path Selection Algorithm

### 5.1 Path Selection Process

```
+------------------------------------------------------------------+
|                   PATH SELECTION ALGORITHM                        |
+------------------------------------------------------------------+
|                                                                   |
|  Step 1: Application Identification                               |
|  +----------------------------------------------------------+    |
|  | NBAR2 inspects packet → Identifies application           |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|                            v                                      |
|  Step 2: Policy Matching                                          |
|  +----------------------------------------------------------+    |
|  | Match app-route-policy sequence → Get SLA class          |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|                            v                                      |
|  Step 3: Path Evaluation                                          |
|  +----------------------------------------------------------+    |
|  | For each available TLOC:                                  |    |
|  |   - Check BFD metrics (latency, loss, jitter)            |    |
|  |   - Compare against SLA thresholds                       |    |
|  |   - Mark as SLA-compliant or non-compliant               |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|                            v                                      |
|  Step 4: Path Ranking                                             |
|  +----------------------------------------------------------+    |
|  | Rank compliant paths by:                                  |    |
|  |   1. Color preference (if configured)                    |    |
|  |   2. Lowest latency                                      |    |
|  |   3. Highest bandwidth                                   |    |
|  +----------------------------------------------------------+    |
|                            |                                      |
|                            v                                      |
|  Step 5: Path Selection                                           |
|  +----------------------------------------------------------+    |
|  | Select best path or ECMP load balance                    |    |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 5.2 Path Selection Example

```
! Example: Voice call from Mumbai to Chennai

Available Paths:
+----------------------------------------------------------+
| Path        | Latency | Loss  | Jitter | SLA Met | Rank  |
+----------------------------------------------------------+
| MPLS        | 45 ms   | 0.1%  | 8 ms   | Yes     | 1     |
| Internet    | 85 ms   | 0.5%  | 15 ms  | Yes     | 2     |
| LTE         | 120 ms  | 1.2%  | 35 ms  | No*     | -     |
+----------------------------------------------------------+
* LTE exceeds jitter threshold (20ms) for VOICE-CRITICAL

Result: Traffic sent via MPLS (best compliant path)

! If MPLS degrades:
+----------------------------------------------------------+
| Path        | Latency | Loss  | Jitter | SLA Met | Rank  |
+----------------------------------------------------------+
| MPLS        | 150 ms  | 2%    | 45 ms  | No      | -     |
| Internet    | 90 ms   | 0.8%  | 18 ms  | Yes     | 1     |
| LTE         | 110 ms  | 1.0%  | 22 ms  | No      | -     |
+----------------------------------------------------------+

Result: Traffic fails over to Internet automatically
```

---

## 6. Fallback and Failover

### 6.1 Fallback Behavior

```
! Fallback Configuration Options
policy
 app-route-policy AAR-WITH-FALLBACK
  vpn-list VPN-10-EMPLOYEE
   sequence 10
    match
     app-list VOICE-APPS
    !
    action
     ! Option 1: Strict (drop if no SLA)
     sla-class VOICE-CRITICAL strict
     
     ! Option 2: Fallback to preferred colors
     ! sla-class VOICE-CRITICAL
     ! backup-sla-preferred-color mpls biz-internet
     
     ! Option 3: Fallback to any path
     ! sla-class VOICE-CRITICAL fallback-to-best-path
    !
   !
  !
 !
!
```

### 6.2 Failover Timing

| Event | Detection Time | Failover Time | Total |
|-------|----------------|---------------|-------|
| BFD Failure | 6 seconds | < 1 second | ~7 seconds |
| SLA Degradation | 10-60 seconds | < 1 second | ~60 seconds |
| Transport Down | Immediate | < 1 second | < 2 seconds |

### 6.3 Graceful Failback

```
! Prevent flapping with dampening
policy
 sla-class VOICE-CRITICAL
  latency 100
  loss 0
  jitter 20
  ! Implicit dampening prevents rapid oscillation
 !
!

! BFD configuration for stability
bfd default-dscp 48
bfd app-route multiplier 6
bfd app-route poll-interval 600000
```

---

## 7. Transport Preferences

### 7.1 TLOC Lists

```
! Transport Preference Lists
policy
 lists
  ! MPLS Preferred for Voice/Business
  tloc-list MPLS-PREFERRED
   tloc 10.100.1.1 color mpls encap ipsec preference 1000
   tloc 10.100.1.1 color biz-internet encap ipsec preference 500
   tloc 10.100.1.1 color lte encap ipsec preference 100
  !
  
  ! Internet Preferred for General
  tloc-list INTERNET-PREFERRED
   tloc 10.100.1.1 color biz-internet encap ipsec preference 1000
   tloc 10.100.1.1 color mpls encap ipsec preference 500
   tloc 10.100.1.1 color lte encap ipsec preference 100
  !
  
  ! LTE Only for Backup
  tloc-list LTE-BACKUP
   tloc 10.100.1.1 color lte encap ipsec preference 100
  !
 !
!
```

### 7.2 Color Restrict

```
! Restrict traffic to specific colors
policy
 data-policy COLOR-RESTRICT
  vpn-list VPN-40-VOICE
   sequence 10
    match
     app-list VOICE-APPS
    !
    action accept
     set
      ! Only use MPLS for voice
      local-tloc color mpls
     !
    !
   !
  !
 !
!
```

---

## 8. Monitoring and Verification

### 8.1 Verification Commands

```
! Verify SLA class definitions
show sdwan policy sla-class

! Verify app-route policy
show sdwan policy app-route-policy-filter

! Verify path health per application
show sdwan app-route statistics

! Verify BFD sessions
show sdwan bfd sessions

! Real-time path selection
show sdwan app-route sla-class name VOICE-CRITICAL

! Application statistics
show sdwan app-fwd cflowd flow-count
```

### 8.2 AAR Dashboard Metrics

```
+------------------------------------------------------------------+
|                    AAR MONITORING DASHBOARD                       |
+------------------------------------------------------------------+
|                                                                   |
|  SLA Compliance by Application:                                   |
|  +----------------------------------------------------------+    |
|  | Application      | SLA Class      | Compliance | Trend   |   |
|  +----------------------------------------------------------+    |
|  | Voice (Teams)    | VOICE-CRITICAL | 99.8%      | ↑       |   |
|  | Video (WebEx)    | VIDEO-REALTIME | 98.5%      | →       |   |
|  | SAP              | BIZ-CRITICAL   | 99.2%      | ↑       |   |
|  | O365             | BIZ-STANDARD   | 99.9%      | →       |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Path Utilization:                                                |
|  +----------------------------------------------------------+    |
|  | Transport | Traffic (Gbps) | SLA Met | Latency (avg)     |   |
|  +----------------------------------------------------------+    |
|  | MPLS      | 4.2            | 99.5%   | 42 ms             |   |
|  | Internet  | 2.8            | 97.2%   | 78 ms             |   |
|  | LTE       | 0.3            | 94.1%   | 125 ms            |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 9. Best Practices Summary

### 9.1 SLA Class Design

- Define 4-6 SLA classes covering all application tiers
- Set realistic thresholds based on transport capabilities
- Use strict mode only for truly critical applications
- Test SLA thresholds in lab before production

### 9.2 App-Route Policy Design

- Group similar applications for policy efficiency
- Use default-action for unclassified traffic
- Order sequences from most to least specific
- Document application-to-SLA mappings

### 9.3 Operational Best Practices

- Monitor SLA compliance daily
- Tune thresholds based on observed performance
- Regular review of path selection decisions
- Alert on persistent SLA violations

---

## References

| Document | Description | Location |
|----------|-------------|----------|
| Cisco AAR Deployment Guide | Official AAR documentation | cisco.com |
| NBAR2 Protocol Pack | Application signatures | cisco.com |
| Abhavtech SLA Policy | Internal SLA requirements | SharePoint |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
*Document ID: SDWAN-POL-4.2*
