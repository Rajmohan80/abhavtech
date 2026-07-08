# 1.2 WAN Traffic Analysis

## Document Information

| Item | Details |
|------|---------|
| **Document Version** | 1.0 |
| **Last Updated** | December 2025 |
| **Author** | Network Architecture Team |
| **Organization** | Abhavtech.com |
| **Classification** | Internal Use Only |

---

## 1.2.1 Overview

This section provides a comprehensive analysis of Abhavtech.com's WAN traffic patterns, application flows, bandwidth utilization, and performance requirements. Understanding current traffic characteristics is essential for designing appropriate SD-WAN policies, QoS configurations, and capacity planning.

### Analysis Objectives

- Characterize application traffic by type and volume
- Identify peak usage patterns and bandwidth requirements
- Document latency and jitter sensitivity for critical applications
- Map traffic flows between sites for topology optimization
- Establish baselines for post-migration comparison

### Data Collection Period

| Parameter | Value |
|-----------|-------|
| Collection Start | October 1, 2025 |
| Collection End | November 30, 2025 |
| Duration | 61 days |
| Collection Method | NetFlow/IPFIX, SNMP, Application Visibility |
| Tools Used | SolarWinds NPM, Cisco Prime, Splunk |

---

## 1.2.2 Aggregate Bandwidth Analysis

### Global WAN Bandwidth Utilization

```
                        DAILY BANDWIDTH UTILIZATION PATTERN
                        ===================================

    Mbps
    ^
800 │                          ████████████
    │                       ███            ███
700 │                    ███                  ███
    │                  ██                        ██
600 │               ███                            ███
    │             ██                                  ██
500 │           ██                                      ██
    │         ██                                          ██
400 │       ██                                              ██
    │     ██                                                  ██
300 │   ██                                                      ██
    │ ██                                                          ██
200 │██                                                            ████
    ├────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────►
    0    2    4    6    8   10   12   14   16   18   20   22   24  Hour

    Legend: ████ Peak Hours (09:00-18:00 IST)  ░░░░ Off-Peak Hours
```

### Site-by-Site Bandwidth Utilization

| Site | Circuit Capacity | Avg Utilization | Peak Utilization | 95th Percentile |
|------|-----------------|-----------------|------------------|-----------------|
| Mumbai | 800 Mbps | 412 Mbps (52%) | 687 Mbps (86%) | 623 Mbps (78%) |
| Chennai | 500 Mbps | 234 Mbps (47%) | 398 Mbps (80%) | 356 Mbps (71%) |
| Bangalore | 200 Mbps | 156 Mbps (78%) | 189 Mbps (95%) | 178 Mbps (89%) |
| Delhi | 150 Mbps | 98 Mbps (65%) | 134 Mbps (89%) | 121 Mbps (81%) |
| Noida | 150 Mbps | 112 Mbps (75%) | 142 Mbps (95%) | 131 Mbps (87%) |
| London | 300 Mbps | 167 Mbps (56%) | 256 Mbps (85%) | 234 Mbps (78%) |
| Frankfurt | 300 Mbps | 189 Mbps (63%) | 267 Mbps (89%) | 245 Mbps (82%) |
| New Jersey | 500 Mbps | 312 Mbps (62%) | 445 Mbps (89%) | 398 Mbps (80%) |
| Dallas | 300 Mbps | 178 Mbps (59%) | 267 Mbps (89%) | 234 Mbps (78%) |

### Bandwidth Utilization Observations

| Finding | Impact | Recommendation |
|---------|--------|----------------|
| Bangalore at 95% peak utilization | Risk of congestion | Increase capacity to 300 Mbps |
| Noida at 95% peak utilization | Risk of congestion | Increase capacity to 300 Mbps |
| Mumbai DC under 60% average | Headroom available | Optimize with SD-WAN AAR |
| Inter-region traffic high at 40% | Global MPLS dependency | Enable DIA for SaaS |

---

## 1.2.3 Application Traffic Classification

### Application Distribution by Volume

```
                    APPLICATION TRAFFIC DISTRIBUTION
                    =================================

        ┌────────────────────────────────────────────────────┐
        │   Office 365 & Cloud SaaS          ████████████ 28%│
        │   SAP ERP/S4HANA                   █████████ 22%   │
        │   Video Conferencing (Webex/Teams) ███████ 18%     │
        │   Voice (SIP/RTP)                  ████ 8%         │
        │   Web Browsing                     ████ 8%         │
        │   File Transfer (SMB/CIFS)         ███ 6%          │
        │   Database Replication             ███ 5%          │
        │   Backup Traffic                   ██ 3%           │
        │   Other                            █ 2%            │
        └────────────────────────────────────────────────────┘
```

### Detailed Application Inventory

| Application | Protocol | Ports | Daily Volume | Peak Bandwidth | QoS Class |
|-------------|----------|-------|--------------|----------------|-----------|
| Office 365 | HTTPS | 443 | 892 GB | 245 Mbps | Business Critical |
| SAP ERP | RFC/HTTPS | 3300/443 | 734 GB | 198 Mbps | Business Critical |
| Webex | UDP/HTTPS | 9000/443 | 612 GB | 312 Mbps | Real-Time |
| MS Teams | UDP/HTTPS | 3478-3481/443 | 523 GB | 287 Mbps | Real-Time |
| Voice (SIP) | UDP | 5060-5061 | 89 GB | 45 Mbps | Real-Time |
| Voice (RTP) | UDP | 16384-32767 | 167 GB | 78 Mbps | Real-Time |
| Web Browsing | HTTPS/HTTP | 443/80 | 267 GB | 89 Mbps | Default |
| File Transfer | SMB | 445 | 201 GB | 67 Mbps | Bulk Data |
| Database Rep | Oracle | 1521 | 156 GB | 123 Mbps | Business Critical |
| Backup | Custom | Various | 98 GB | 234 Mbps (night) | Bulk Data |
| GitHub/GitLab | HTTPS | 443 | 78 GB | 45 Mbps | Business Critical |
| Salesforce | HTTPS | 443 | 67 GB | 34 Mbps | Business Critical |
| ServiceNow | HTTPS | 443 | 45 GB | 23 Mbps | Business Critical |

### Application Criticality Matrix

| Criticality | Applications | Bandwidth Share | Downtime Impact |
|-------------|-------------|-----------------|-----------------|
| Mission Critical | SAP, Database Rep, Voice | 35% | Immediate revenue impact |
| Business Critical | O365, Webex, Teams, CRM | 50% | Productivity loss |
| Best Effort | Web, File Transfer | 12% | Limited impact |
| Scavenger | Backup, Updates | 3% | Can be scheduled |

---

## 1.2.4 Traffic Flow Analysis

### Inter-Site Traffic Matrix (Average Daily Mbps)

```
                             INTER-SITE TRAFFIC MATRIX
    ═══════════════════════════════════════════════════════════════════
    
    FROM ▼   │ Mumbai │Chennai│ BLR  │ Delhi│ Noida│London│ FRA  │  NJ  │Dallas
    ─────────┼────────┼───────┼──────┼──────┼──────┼──────┼──────┼──────┼──────
    Mumbai   │   -    │  156  │  89  │  67  │  78  │  45  │  34  │  56  │  23
    Chennai  │  145   │   -   │  45  │  34  │  45  │  23  │  12  │  34  │  12
    BLR      │  78    │  34   │  -   │  23  │  34  │  12  │   8  │  15  │   8
    Delhi    │  56    │  28   │  18  │  -   │  23  │   8  │   6  │  12  │   6
    Noida    │  67    │  34   │  28  │  18  │  -   │   8  │   6  │  12  │   6
    London   │  42    │  18   │  10  │   6  │   6  │  -   │  34  │  23  │  15
    Frankfurt│  32    │  10   │   6  │   5  │   5  │  28  │  -   │  18  │  12
    NJ       │  48    │  28   │  12  │  10  │  10  │  18  │  15  │  -   │  56
    Dallas   │  20    │  10   │   6  │   5  │   5  │  12  │  10  │  48  │  -
    ═══════════════════════════════════════════════════════════════════
```

### Traffic Flow Visualization

```
                          MAJOR TRAFFIC FLOWS
                          ==================
    
                              ┌─────────┐
                              │ Mumbai  │
                              │   DC    │
                              └────┬────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
         156 Mbps             89 Mbps              78 Mbps
              │                    │                    │
              ▼                    ▼                    ▼
        ┌─────────┐          ┌─────────┐          ┌─────────┐
        │ Chennai │          │   BLR   │          │  Noida  │
        │   DR    │          │         │          │         │
        └────┬────┘          └─────────┘          └─────────┘
             │
        45 Mbps    ←── DC Replication (Off-peak: 234 Mbps)
             │
             ▼
    ┌──────────────────────────────────────────────────────────────┐
    │                    REGIONAL TRAFFIC FLOWS                    │
    │                                                              │
    │    Mumbai ◄──── 45 Mbps ────► London ◄──── 34 Mbps ────►    │
    │                                  ▲           Frankfurt       │
    │    Mumbai ◄──── 56 Mbps ────► NJ │                          │
    │                                  │                          │
    │                              18 Mbps                        │
    │                                  │                          │
    │                                  ▼                          │
    │                               Dallas                        │
    └──────────────────────────────────────────────────────────────┘
```

### Traffic Flow Optimization Opportunities

| Flow Pattern | Current Path | Optimized Path | Savings |
|--------------|--------------|----------------|---------|
| Branch → SaaS | Branch → DC → Internet | Branch → Local DIA | 60% latency |
| DC Replication | MPLS only | Scheduled MPLS + Internet | Cost reduction |
| Voice Regional | MPLS hairpin | Direct via SD-WAN | 40% latency |
| Video Conference | MPLS + Internet | Local DIA with QoS | Quality improvement |

---

## 1.2.5 Latency Analysis

### Current Latency Measurements

| Path | Measured RTT | Target RTT | Status | Primary Use |
|------|--------------|------------|--------|-------------|
| Mumbai ↔ Chennai | 18 ms | <25 ms | ✅ Good | DC Replication |
| Mumbai ↔ Bangalore | 22 ms | <30 ms | ✅ Good | Application Access |
| Mumbai ↔ Delhi | 28 ms | <35 ms | ✅ Good | Application Access |
| Mumbai ↔ Noida | 25 ms | <35 ms | ✅ Good | Application Access |
| Mumbai ↔ London | 142 ms | <150 ms | ✅ Good | Inter-region |
| Mumbai ↔ Frankfurt | 138 ms | <150 ms | ✅ Good | Inter-region |
| Mumbai ↔ New Jersey | 198 ms | <200 ms | ⚠️ Marginal | Inter-region |
| Mumbai ↔ Dallas | 212 ms | <200 ms | ❌ Exceeds | Inter-region |
| London ↔ Frankfurt | 12 ms | <20 ms | ✅ Good | EMEA internal |
| New Jersey ↔ Dallas | 38 ms | <50 ms | ✅ Good | Americas internal |

### Latency Distribution Analysis

```
                    LATENCY DISTRIBUTION BY APPLICATION
                    ===================================

    Application          0ms    50ms   100ms  150ms  200ms  250ms
                         │      │      │      │      │      │
    Voice/RTP            ├──────┤ Target: <50ms ✅
                         │░░░░░░│
                         │      │
    Video Conference     ├──────────┤ Target: <100ms ✅
                         │░░░░░░░░░░│
                         │          │
    SAP Interactive      ├───────────────┤ Target: <150ms ✅
                         │░░░░░░░░░░░░░░░│
                         │               │
    Web Browsing         ├─────────────────────┤ Target: <200ms ⚠️
                         │░░░░░░░░░░░░░░░░░░░░░│
                         │                     │
    File Transfer        ├───────────────────────────┤ Tolerant ✅
                         │░░░░░░░░░░░░░░░░░░░░░░░░░░░│
                         │                           │
```

### One-Way Delay (OWD) Requirements

| Application Type | Max OWD | Acceptable Jitter | Packet Loss Tolerance |
|------------------|---------|-------------------|----------------------|
| Voice (VoIP) | 75 ms | <30 ms | <1% |
| Video Conference | 100 ms | <30 ms | <1% |
| Real-Time Collaboration | 100 ms | <50 ms | <1% |
| Interactive Applications | 150 ms | <100 ms | <2% |
| Bulk Data Transfer | N/A | N/A | <0.1% |

---

## 1.2.6 Jitter and Packet Loss Analysis

### Current Performance Metrics

| Path | Avg Jitter | Max Jitter | Packet Loss | Impact |
|------|------------|------------|-------------|--------|
| Mumbai ↔ Chennai | 3 ms | 8 ms | 0.02% | None |
| Mumbai ↔ Bangalore | 5 ms | 12 ms | 0.05% | None |
| Mumbai ↔ Delhi | 6 ms | 15 ms | 0.08% | Minimal |
| Mumbai ↔ London | 12 ms | 28 ms | 0.12% | Video quality |
| Mumbai ↔ New Jersey | 18 ms | 35 ms | 0.18% | Voice quality |
| Mumbai ↔ Dallas | 22 ms | 45 ms | 0.25% | Voice/Video |

### Quality Degradation Events (Last 60 Days)

| Event Type | Count | Avg Duration | Affected Sites | Root Cause |
|------------|-------|--------------|----------------|------------|
| High Jitter (>30ms) | 23 | 18 min | Mumbai-NJ | MPLS congestion |
| Packet Loss (>1%) | 12 | 8 min | Delhi, Noida | Last mile |
| Brownout (<50% BW) | 8 | 45 min | Bangalore | Circuit issue |
| Blackout | 3 | 2 hr | Various | Provider outage |

---

## 1.2.7 Cloud and SaaS Traffic Analysis

### SaaS Application Traffic

| Application | Daily Traffic | Peak Users | Destination Region | Current Path |
|-------------|---------------|------------|-------------------|--------------|
| Office 365 | 892 GB | 2,850 | Multi-region | Via Mumbai DC |
| Salesforce | 67 GB | 450 | ap3 (Singapore) | Via Mumbai DC |
| ServiceNow | 45 GB | 380 | EU (Germany) | Via Mumbai DC |
| Webex | 523 GB | 1,200 | Global | Via Mumbai DC |
| GitHub | 78 GB | 340 | US (Virginia) | Via Mumbai DC |
| AWS (IaaS) | 234 GB | N/A | ap-south-1 | Via Mumbai DC |
| Azure (IaaS) | 189 GB | N/A | centralindia | Via Mumbai DC |

### Cloud Traffic Optimization Potential

```
                    CURRENT VS. OPTIMIZED SaaS PATH
                    ================================

    CURRENT (via DC):
    ┌────────┐     MPLS      ┌────────┐    Internet   ┌─────────────┐
    │ Branch │ ────────────► │Mumbai  │ ────────────► │ SaaS Cloud  │
    │ Delhi  │  ← 28ms →     │   DC   │  ← 45ms →     │ (Singapore) │
    └────────┘               └────────┘               └─────────────┘
                                      Total: ~73ms RTT

    OPTIMIZED (Direct Internet Access):
    ┌────────┐    Internet   ┌─────────────┐
    │ Branch │ ────────────► │ SaaS Cloud  │
    │ Delhi  │  ← 35ms →     │ (Singapore) │
    └────────┘               └─────────────┘
                    Total: ~35ms RTT (52% improvement)
```

### Cloud OnRamp Candidates

| Application | Current Latency | DIA Latency | Improvement | Priority |
|-------------|-----------------|-------------|-------------|----------|
| Office 365 | 85-120 ms | 35-55 ms | 45-55% | High |
| Salesforce | 75-95 ms | 40-50 ms | 40-50% | High |
| Webex | 70-110 ms | 30-45 ms | 50-60% | High |
| AWS ap-south-1 | 15-25 ms | 10-15 ms | 30-40% | Medium |
| Azure centralindia | 12-20 ms | 8-12 ms | 30-40% | Medium |

---

## 1.2.8 Time-Based Traffic Patterns

### Hourly Traffic Distribution

| Hour (IST) | Mumbai | Chennai | Branches | EMEA | Americas | Total |
|------------|--------|---------|----------|------|----------|-------|
| 00:00-02:00 | 125 | 78 | 45 | 89 | 234 | 571 |
| 02:00-04:00 | 98 | 67 | 34 | 67 | 256 | 522 |
| 04:00-06:00 | 89 | 56 | 28 | 56 | 198 | 427 |
| 06:00-08:00 | 156 | 89 | 67 | 78 | 145 | 535 |
| 08:00-10:00 | 345 | 178 | 134 | 156 | 112 | 925 |
| 10:00-12:00 | 456 | 234 | 167 | 189 | 98 | 1144 |
| 12:00-14:00 | 412 | 212 | 156 | 201 | 89 | 1070 |
| 14:00-16:00 | 478 | 245 | 178 | 212 | 145 | 1258 |
| 16:00-18:00 | 498 | 256 | 189 | 178 | 198 | 1319 |
| 18:00-20:00 | 234 | 145 | 98 | 134 | 245 | 856 |
| 20:00-22:00 | 178 | 112 | 67 | 112 | 278 | 747 |
| 22:00-00:00 | 145 | 89 | 56 | 98 | 256 | 644 |

### Peak Hour Analysis

| Metric | Global Peak | India Peak | EMEA Peak | Americas Peak |
|--------|------------|------------|-----------|---------------|
| Time | 14:00-16:00 IST | 14:00-16:00 IST | 14:00-16:00 GMT | 10:00-12:00 EST |
| Bandwidth | 1,319 Mbps | 923 Mbps | 212 Mbps | 278 Mbps |
| Overlap | 18:30-21:00 IST | India + Americas overlap period |

### Weekly Traffic Pattern

| Day | Avg Traffic | Peak Traffic | Notes |
|-----|-------------|--------------|-------|
| Monday | 1,245 Mbps | 1,456 Mbps | Week start, high sync activity |
| Tuesday | 1,189 Mbps | 1,389 Mbps | Normal operations |
| Wednesday | 1,201 Mbps | 1,412 Mbps | Normal operations |
| Thursday | 1,234 Mbps | 1,445 Mbps | Pre-weekend activity |
| Friday | 1,156 Mbps | 1,312 Mbps | Reduced afternoon |
| Saturday | 345 Mbps | 567 Mbps | Backup operations |
| Sunday | 289 Mbps | 478 Mbps | Maintenance window |

---

## 1.2.9 Traffic Analysis Summary

### Key Findings

| Category | Finding | Implication |
|----------|---------|-------------|
| Bandwidth | 78-95% peak at branches | Capacity upgrade needed |
| Applications | 50% SaaS-bound traffic | DIA with Cloud OnRamp |
| Latency | Inter-region exceeds targets | Regional optimization |
| Traffic Patterns | 40% DC-bound from branches | Direct breakout opportunity |
| Peak Hours | 14:00-16:00 IST global peak | QoS critical during peak |

### SD-WAN Design Recommendations

| Recommendation | Priority | Expected Benefit |
|----------------|----------|------------------|
| Implement Cloud OnRamp for SaaS | High | 45-55% latency reduction |
| Enable DIA at all branches | High | Reduced DC load, better SaaS |
| Increase branch bandwidth 50% | High | Eliminate congestion |
| Implement AAR for voice/video | High | Quality assurance |
| Configure FEC for long-haul paths | Medium | Packet loss mitigation |
| Schedule bulk transfers off-peak | Medium | Peak hour relief |

### Baseline Metrics for Post-Migration

| Metric | Current Baseline | Target Post-Migration |
|--------|------------------|----------------------|
| Avg WAN Latency (Regional) | 25 ms | <20 ms |
| Avg WAN Latency (Inter-region) | 175 ms | <160 ms |
| Avg Jitter | 15 ms | <10 ms |
| Packet Loss | 0.15% | <0.05% |
| SaaS Application Latency | 85 ms | <45 ms |
| Branch Utilization (Peak) | 90% | <70% |
| Voice MOS Score | 3.8 | >4.2 |

---

## References

| Document | Description |
|----------|-------------|
| NetFlow Analysis Report | Raw traffic data |
| SolarWinds NPM Reports | Bandwidth utilization |
| Cisco Prime Application Visibility | Deep packet inspection data |
| Splunk Traffic Logs | Historical traffic patterns |
| SD-WAN Design Guide | Cisco CVD reference |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use Only*
*Abhavtech.com - SD-WAN Documentation*
