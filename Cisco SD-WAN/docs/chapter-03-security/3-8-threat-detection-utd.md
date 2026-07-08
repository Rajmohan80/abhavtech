# 3.8 Threat Detection (UTD)

## Document Information
| Field | Value |
|-------|-------|
| Document ID | SDWAN-SEC-3.8 |
| Version | 1.0 |
| Last Updated | December 2025 |
| Author | Network Architecture Team |
| Classification | Internal Use |

---

## 1. Executive Summary

This section documents the Unified Threat Defense (UTD) implementation for Abhavtech's SD-WAN deployment. UTD provides integrated threat detection and prevention capabilities including Intrusion Prevention System (IPS), malware detection, and threat intelligence integration directly on WAN Edge routers.

### 1.1 UTD Architecture

```
+------------------------------------------------------------------+
|                    UTD ARCHITECTURE OVERVIEW                      |
+------------------------------------------------------------------+
|                                                                   |
|                        WAN Edge Router                            |
|  +-------------------------------------------------------------+ |
|  |                                                              | |
|  |  +------------------+          +------------------+         | |
|  |  | Data Plane       |  Divert  | UTD Container    |         | |
|  |  | Engine           |--------->| (LXC)            |         | |
|  |  +--------+---------+          +--------+---------+         | |
|  |           |                             |                    | |
|  |           |                    +--------+--------+           | |
|  |           |                    |                 |           | |
|  |           |              +-----+-----+     +-----+-----+    | |
|  |           |              | Snort 3.0 |     | AMP/TG    |    | |
|  |           |              | IPS Engine|     | Malware   |    | |
|  |           |              +-----------+     +-----------+    | |
|  |           |                    |                 |           | |
|  |           |                    +--------+--------+           | |
|  |           |                             |                    | |
|  |           |                    +--------v--------+           | |
|  |           |                    | Verdict Engine  |           | |
|  |           |                    | PASS/DROP/ALERT |           | |
|  |           |                    +--------+--------+           | |
|  |           |                             |                    | |
|  |  +--------v---------+          +--------v--------+          | |
|  |  | Forward/Drop     |<---------| Return Traffic  |          | |
|  |  +------------------+          +------------------+          | |
|  |                                                              | |
|  +-------------------------------------------------------------+ |
|                                                                   |
+------------------------------------------------------------------+
```

### 1.2 Deployment Summary

| Site | UTD Mode | Snort Engine | AMP | ThreatGrid | License |
|------|----------|--------------|-----|------------|---------|
| Mumbai DC | Full | Snort 3.0 | Yes | Yes | Premier |
| Chennai DR | Full | Snort 3.0 | Yes | Yes | Premier |
| London | Full | Snort 3.0 | Yes | Yes | Premier |
| New Jersey | Full | Snort 3.0 | Yes | Yes | Premier |
| Bangalore | Standard | Snort 3.0 | Yes | No | Advantage |
| Delhi | Standard | Snort 3.0 | Yes | No | Advantage |
| Frankfurt | Standard | Snort 3.0 | Yes | No | Advantage |
| Dallas | Standard | Snort 3.0 | Yes | No | Advantage |
| Noida | Basic | DNS only | No | No | Essentials |

---

## 2. Snort 3.0 IPS Engine

### 2.1 Snort 3.0 Features

```
+------------------------------------------------------------------+
|                    SNORT 3.0 CAPABILITIES                         |
+------------------------------------------------------------------+
|                                                                   |
|  Performance Improvements:                                        |
|  +----------------------------------------------------------+    |
|  | - Multi-threaded architecture                             |    |
|  | - Hyperscan pattern matching                              |    |
|  | - Shared memory for rule matching                         |    |
|  | - Up to 10x performance improvement over Snort 2.x        |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Detection Capabilities:                                          |
|  +------------------+  +------------------+  +------------------+ |
|  | Protocol Analysis|  | Flow Tracking    |  | Content Match   | |
|  | - HTTP/2, HTTP/3 |  | - Session state  |  | - Regex         | |
|  | - TLS 1.3        |  | - Connection     |  | - PCRE          | |
|  | - QUIC          |  |   tracking       |  | - Hyperscan     | |
|  +------------------+  +------------------+  +------------------+ |
|                                                                   |
|  Signature Sources:                                               |
|  +----------------------------------------------------------+    |
|  | - Cisco Talos Intelligence (Primary)                      |   |
|  | - Snort Community Rules                                   |   |
|  | - Custom Organization Rules                               |   |
|  | - Emerging Threats (ET) Rules                             |   |
|  +----------------------------------------------------------+    |
|                                                                   |
+------------------------------------------------------------------+
```

### 2.2 IPS Policy Modes

| Mode | Description | Use Case | Abhavtech Sites |
|------|-------------|----------|-----------------|
| Detection | Alert only, no blocking | Initial deployment | None |
| Balanced | Block high/critical, alert medium | Production | Branch sites |
| Security | Block all matching threats | High security | DC/Hub sites |
| Connectivity | Minimize false positives | Sensitive apps | Voice VPN |

### 2.3 IPS Configuration

```
! UTD Engine Configuration
utd engine standard
 logging host 10.254.1.50
 logging level info
 
 ! Threat Inspection Configuration
 threat-inspection
  threat protection
  policy security
  
  ! Signature Update Settings
  signature update server url https://update.talos-intelligence.com
  signature update occur-at daily 02:00
  
  ! Logging
  log level info
 !
!

! UTD Policy for DC Sites
utd multi-tenancy
 policy DC-FULL-PROTECTION
  threat-inspection
   threat protection
   policy security
   
   ! High-confidence rules
   signature-set talos-rules
    action block
    confidence high
   !
   
   ! Medium-confidence rules
   signature-set talos-rules
    action alert
    confidence medium
   !
  !
 !
!
```

### 2.4 Signature Categories

```
+------------------------------------------------------------------+
|                    SIGNATURE CATEGORIES                           |
+------------------------------------------------------------------+
|                                                                   |
|  Category               | Action    | Signatures | Update Freq   |
|  -----------------------+-----------+------------+---------------|
|  Malware-CNC            | Block     | 15,000+    | Hourly        |
|  Exploit-Kit            | Block     | 8,000+     | Daily         |
|  Trojan                 | Block     | 25,000+    | Daily         |
|  Ransomware             | Block     | 5,000+     | Hourly        |
|  Phishing               | Block     | 10,000+    | Hourly        |
|  SQL-Injection          | Block     | 3,000+     | Daily         |
|  XSS                    | Block     | 2,500+     | Daily         |
|  DoS                    | Alert     | 1,500+     | Weekly        |
|  Policy-Violation       | Alert     | 5,000+     | Weekly        |
|  Protocol-Anomaly       | Alert     | 2,000+     | Weekly        |
|                                                                   |
+------------------------------------------------------------------+
```

---

## 3. Advanced Malware Protection (AMP)

### 3.1 AMP Architecture

```
+------------------------------------------------------------------+
|                    AMP INTEGRATION                                |
+------------------------------------------------------------------+
|                                                                   |
|  WAN Edge                              AMP Cloud                  |
|  +----------------+                   +----------------+          |
|  | File Transfer  |                   | AMP Cloud      |         |
|  | Detected       |   SHA256 Hash     | Lookup         |         |
|  |                |------------------>|                |          |
|  +-------+--------+                   +-------+--------+          |
|          |                                    |                   |
|          |                            +-------v--------+          |
|          |                            | Disposition:   |          |
|          |                            | - Clean        |          |
|          |                            | - Malicious    |          |
|          |                            | - Unknown      |          |
|          |                            +-------+--------+          |
|          |                                    |                   |
|          |         Verdict                    |                   |
|          |<-----------------------------------+                   |
|          |                                                        |
|  +-------v--------+                                              |
|  | Action:        |                                              |
|  | Allow/Block    |                                              |
|  +----------------+                                              |
|                                                                   |
|  For Unknown Files:                                              |
|  +----------------+                   +----------------+          |
|  | File Sample    |   Upload          | ThreatGrid     |         |
|  | Extraction     |------------------>| Sandbox        |         |
|  +----------------+                   +----------------+          |
|                                                                   |
+------------------------------------------------------------------+
```

### 3.2 AMP Configuration

```
! AMP Cloud Integration
utd engine standard
 file-inspection
  file-reputation
   cloud-lookup
  !
  
  ! File Analysis for Unknown Files
  file-analysis
   cloud-analysis
   submit-dynamic-analysis
  !
  
  ! Supported File Types
  file-type
   detect executable
   detect pdf
   detect ms-office
   detect archive
   detect script
  !
  
  ! Action on Malicious Files
  file-reputation
   action block malicious
   action alert unknown
  !
 !
!
```

### 3.3 File Type Inspection

| File Type | Inspection | Action on Malware | ThreatGrid |
|-----------|------------|-------------------|------------|
| EXE/DLL | Full | Block | Yes |
| PDF | Full | Block | Yes |
| Office (DOC/XLS/PPT) | Full | Block | Yes |
| Archive (ZIP/RAR) | Extract + Scan | Block | Yes |
| Scripts (JS/VBS/PS1) | Full | Block | Yes |
| Images | Hash only | Alert | No |
| Video/Audio | Hash only | Allow | No |

---

## 4. ThreatGrid Sandbox Integration

### 4.1 Sandbox Analysis

```
+------------------------------------------------------------------+
|                  THREATGRID SANDBOX                               |
+------------------------------------------------------------------+
|                                                                   |
|  Unknown File Detection:                                          |
|  +----------------------------------------------------------+    |
|  | 1. File hash not found in AMP cloud                       |   |
|  | 2. File submitted to ThreatGrid for analysis              |   |
|  | 3. Sandbox executes file in isolated environment          |   |
|  | 4. Behavior analysis (5-10 minutes)                       |   |
|  | 5. Threat score generated (0-100)                         |   |
|  | 6. Verdict returned to WAN Edge                           |   |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Analysis Techniques:                                             |
|  +------------------+  +------------------+  +------------------+ |
|  | Static Analysis  |  | Dynamic Analysis |  | Network Analysis| |
|  | - Disassembly    |  | - Execution      |  | - DNS queries   | |
|  | - Strings        |  | - Registry       |  | - HTTP requests | |
|  | - Imports        |  | - File system    |  | - C2 detection  | |
|  | - Entropy        |  | - Process tree   |  | - Data exfil    | |
|  +------------------+  +------------------+  +------------------+ |
|                                                                   |
+------------------------------------------------------------------+
```

### 4.2 ThreatGrid Configuration

```
! ThreatGrid Integration
utd engine standard
 file-inspection
  file-analysis
   api-key <THREATGRID_API_KEY>
   submit-dynamic-analysis
   
   ! Submission Criteria
   submit-for-analysis
    file-type executable
    file-type pdf
    file-type ms-office
   !
   
   ! Threat Score Threshold
   threat-score
    block-threshold 70
    alert-threshold 40
   !
  !
 !
!
```

---

## 5. Threat Intelligence Integration

### 5.1 Intelligence Sources

```
+------------------------------------------------------------------+
|                 THREAT INTELLIGENCE SOURCES                       |
+------------------------------------------------------------------+
|                                                                   |
|  +------------------+                                             |
|  | Cisco Talos      | Primary threat intelligence                 |
|  | (Included)       | - Real-time updates                        |
|  +------------------+ - Millions of threat indicators             |
|                                                                   |
|  +------------------+                                             |
|  | ThreatGrid       | Advanced malware analysis                   |
|  | (Premier)        | - Behavioral analysis                       |
|  +------------------+ - Zero-day detection                        |
|                                                                   |
|  +------------------+                                             |
|  | Umbrella         | DNS-layer intelligence                      |
|  | (Integrated)     | - Domain reputation                         |
|  +------------------+ - IP reputation                             |
|                                                                   |
|  +------------------+                                             |
|  | Custom Feeds     | Organization-specific                       |
|  | (Optional)       | - STIX/TAXII feeds                         |
|  +------------------+ - Internal threat lists                     |
|                                                                   |
+------------------------------------------------------------------+
```

### 5.2 Indicator Types

| Indicator Type | Source | Update Frequency | Volume |
|----------------|--------|------------------|--------|
| IP Addresses | Talos, Custom | Hourly | 500K+ |
| Domains | Talos, Umbrella | Hourly | 2M+ |
| URLs | Talos | Hourly | 10M+ |
| File Hashes | AMP, ThreatGrid | Real-time | 100M+ |
| Signatures | Snort Rules | Daily | 50K+ |

### 5.3 Custom Threat Feed Configuration

```
! Custom Threat Intelligence Feed
threat-intelligence
 feed ABHAVTECH-CUSTOM-FEED
  url https://threat-intel.abhavtech.com/feed.stix
  format stix
  update-interval 3600
  
  ! Actions for Indicators
  indicator ip-address
   action block
  !
  indicator domain
   action block
  !
  indicator url
   action block
  !
  indicator file-hash
   action block
  !
 !
!
```

---

## 6. Detection Policies by Traffic Type

### 6.1 Policy Matrix

| Traffic Type | IPS Mode | AMP | URL Filter | SSL Inspect |
|--------------|----------|-----|------------|-------------|
| Employee Internet | Security | Yes | Full | Yes |
| Guest Internet | Balanced | Yes | Full | No |
| Voice/Video | Connectivity | No | No | No |
| IoT | Security | Yes | Whitelist | No |
| Management | Security | Yes | No | No |

### 6.2 VPN-Specific Policies

```
! Policy for Employee VPN (Full Protection)
utd multi-tenancy
 policy VPN-10-EMPLOYEE
  threat-inspection
   threat protection
   policy security
  !
  file-inspection
   file-reputation cloud-lookup
   file-analysis submit-dynamic-analysis
  !
  web-filter
   url-filtering sourcedb external
   block-category malware
   block-category phishing-and-other-frauds
  !
 !
!

! Policy for Voice VPN (Minimal Inspection)
utd multi-tenancy
 policy VPN-40-VOICE
  threat-inspection
   threat protection
   policy connectivity
  !
  ! No file or web inspection for voice
 !
!

! Policy for IoT VPN (Strict)
utd multi-tenancy
 policy VPN-30-IOT
  threat-inspection
   threat protection
   policy security
  !
  web-filter
   url-filtering sourcedb external
   allow-list IOT-WHITELIST
   default-action block
  !
 !
!
```

---

## 7. Monitoring and Alerting

### 7.1 UTD Dashboard

```
+------------------------------------------------------------------+
|                    UTD MONITORING DASHBOARD                       |
+------------------------------------------------------------------+
|                                                                   |
|  Real-Time Metrics:                                               |
|  +----------------------------------------------------------+    |
|  | Metric                    | Value        | Trend         |    |
|  +----------------------------------------------------------+    |
|  | Threats Blocked (24h)     | 1,247        | ↑ 15%         |    |
|  | Malware Detected (24h)    | 23           | ↓ 5%          |    |
|  | IPS Alerts (24h)          | 3,456        | → Stable      |    |
|  | Files Analyzed (24h)      | 892          | ↑ 8%          |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Top Threats:                                                     |
|  +----------------------------------------------------------+    |
|  | 1. Emotet Trojan          | 156 blocks   | Critical      |    |
|  | 2. Trickbot               | 89 blocks    | Critical      |    |
|  | 3. SQL Injection Attempt  | 234 alerts   | High          |    |
|  | 4. Port Scan              | 567 alerts   | Medium        |    |
|  +----------------------------------------------------------+    |
|                                                                   |
|  Alert Thresholds:                                                |
|  - Critical: Immediate notification                              |
|  - High: 15-minute notification                                  |
|  - Medium: Daily summary                                         |
|  - Low: Weekly report                                            |
|                                                                   |
+------------------------------------------------------------------+
```

### 7.2 Alert Configuration

```
! UTD Alerting
utd engine standard
 logging host 10.254.1.50 transport tcp port 6514
 logging level info
 
 ! Alert on Critical Threats
 alert
  severity critical
   action syslog
   action snmp-trap
   action email security-team@abhavtech.com
  !
  
  severity high
   action syslog
   action snmp-trap
  !
  
  severity medium
   action syslog
  !
 !
!
```

---

## 8. Performance Optimization

### 8.1 Resource Allocation

| Platform | Max Throughput | Memory | CPU Cores | Concurrent Sessions |
|----------|----------------|--------|-----------|---------------------|
| C8500-12X4QC | 10 Gbps | 8 GB | 4 | 500,000 |
| C8300-2N2S-6T | 4 Gbps | 4 GB | 2 | 200,000 |
| C8200-1N-4T | 2 Gbps | 2 GB | 2 | 100,000 |

### 8.2 Performance Tuning

```
! UTD Performance Optimization
utd engine standard
 ! Resource Limits
 memory limit 4096
 packet-buffer 2048
 
 ! Threading Configuration
 threads inspection 4
 
 ! Connection Tracking
 max-sessions 200000
 session-timeout tcp 3600
 session-timeout udp 300
 
 ! Bypass for High-Volume Traffic
 bypass
  protocol tcp port 443 destination 13.107.0.0/16  ! M365
  protocol tcp port 443 destination 52.0.0.0/8     ! AWS
 !
!
```

---

## 9. Best Practices Summary

### 9.1 Deployment Best Practices

- Start with detection mode before enabling prevention
- Tune signature sets to minimize false positives
- Use VPN-specific policies for different traffic types
- Enable AMP for all file-bearing protocols

### 9.2 Operational Best Practices

- Update signatures daily (automatic)
- Review alert trends weekly
- Investigate critical alerts immediately
- Maintain exception lists for false positives

### 9.3 Performance Best Practices

- Size UTD resources appropriately for traffic volume
- Use bypass rules for trusted high-volume traffic
- Monitor CPU and memory utilization
- Enable hardware offload where available

---

## References

| Document | Description | Location |
|----------|-------------|----------|
| Cisco UTD Configuration Guide | Official UTD documentation | cisco.com |
| Snort 3.0 User Manual | IPS engine documentation | snort.org |
| Talos Intelligence | Threat research | talosintelligence.com |
| Abhavtech Threat Policy | Internal threat response | SharePoint |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use*
*Document ID: SDWAN-SEC-3.8*
