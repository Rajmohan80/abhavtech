# 1.3 Application Requirements

## Document Information

| Item | Details |
|------|---------|
| **Document Version** | 1.0 |
| **Last Updated** | December 2025 |
| **Author** | Network Architecture Team |
| **Organization** | Abhavtech.com |
| **Classification** | Internal Use Only |

---

## 1.3.1 Overview

This section documents the network requirements for all business-critical applications at Abhavtech.com. Understanding application behavior, dependencies, and performance requirements is essential for designing effective SD-WAN policies, Application-Aware Routing (AAR), and Quality of Service (QoS) configurations.

### Objectives

- Catalog all applications requiring WAN connectivity
- Define performance SLAs for each application class
- Document application dependencies and traffic patterns
- Map applications to SD-WAN QoS classes
- Establish application-specific routing requirements

---

## 1.3.2 Application Classification Framework

### Application Criticality Tiers

```
                    APPLICATION CRITICALITY PYRAMID
                    ===============================

                           ╱╲
                          ╱  ╲
                         ╱ T1 ╲        Tier 1: Mission Critical
                        ╱──────╲       - Revenue-impacting
                       ╱   T2   ╲      - No acceptable downtime
                      ╱──────────╲     
                     ╱    T3      ╲    Tier 2: Business Critical
                    ╱──────────────╲   - Productivity-impacting
                   ╱      T4        ╲  - Limited downtime acceptable
                  ╱──────────────────╲ 
                 ╱       T5           ╲ Tier 3: Business Important
                ╱──────────────────────╲ - Important but not critical
                                        - Degradation acceptable
                                        
                                        Tier 4: Best Effort
                                        - Standard business apps
                                        
                                        Tier 5: Scavenger
                                        - Non-critical, background
```

### Criticality Tier Definitions

| Tier | Name | RPO | RTO | Downtime Cost | Examples |
|------|------|-----|-----|---------------|----------|
| T1 | Mission Critical | 0 | <15 min | >$XXXK/hour | Voice, Trading, Payment |
| T2 | Business Critical | <1 hr | <1 hr | $XX-XXXK/hour | SAP, Core DB |
| T3 | Business Important | <4 hr | <4 hr | $X-XXK/hour | Email, CRM |
| T4 | Best Effort | <24 hr | <24 hr | <$XK/hour | Web browsing |
| T5 | Scavenger | N/A | N/A | Minimal | Updates, Backup |

---

## 1.3.3 Tier 1: Mission Critical Applications

### Voice and Unified Communications

| Parameter | Requirement |
|-----------|-------------|
| **Application** | Cisco Unified CM, Webex Calling |
| **Protocol** | SIP (UDP 5060-5061), RTP (UDP 16384-32767) |
| **Bandwidth per call** | 64 Kbps (G.711), 24 Kbps (G.729) |
| **Concurrent calls** | 500 (Mumbai), 200 (branches) |
| **Latency** | <75 ms one-way |
| **Jitter** | <30 ms |
| **Packet Loss** | <1% |
| **MOS Score** | >4.0 |
| **Availability** | 99.999% |

#### Voice Traffic Flow

```
                         VOICE TRAFFIC ARCHITECTURE
    ═══════════════════════════════════════════════════════════════════

    ┌──────────────┐     SIP Signaling     ┌──────────────┐
    │   IP Phone   │◄────────────────────►│    CUCM      │
    │  Branch Site │     (UDP 5060)        │  Mumbai DC   │
    └──────┬───────┘                       └──────────────┘
           │                                      
           │ RTP Media (Local if same site, WAN if remote)
           │ UDP 16384-32767
           │
    ┌──────▼───────┐
    │  Remote IP   │
    │    Phone     │
    └──────────────┘

    QoS Marking:
    - SIP Signaling: DSCP CS3 (24)
    - RTP Media: DSCP EF (46)
```

### Video Conferencing

| Parameter | Webex | MS Teams |
|-----------|-------|----------|
| **Protocol** | HTTPS/UDP | HTTPS/UDP |
| **Ports** | 443, 9000, 5004 | 443, 3478-3481 |
| **Bandwidth (720p)** | 1.5 Mbps | 1.5 Mbps |
| **Bandwidth (1080p)** | 3.0 Mbps | 3.0 Mbps |
| **Latency** | <100 ms | <100 ms |
| **Jitter** | <30 ms | <30 ms |
| **Packet Loss** | <1% | <1% |
| **Concurrent sessions** | 150 | 200 |

---

## 1.3.4 Tier 2: Business Critical Applications

### SAP ERP/S4HANA

| Parameter | Requirement |
|-----------|-------------|
| **Application** | SAP S/4HANA, SAP GUI, Fiori |
| **Protocol** | RFC (TCP 3300-3399), HTTPS (443) |
| **Server Location** | Mumbai DC (Primary), Chennai DR |
| **Users** | 1,800 |
| **Bandwidth** | 50-100 Mbps sustained |
| **Latency** | <150 ms round-trip |
| **Jitter** | <50 ms |
| **Packet Loss** | <0.5% |
| **Session Timeout** | 30 minutes |

#### SAP Traffic Pattern

```
    ┌────────────────────────────────────────────────────────────────┐
    │                     SAP TRAFFIC PATTERNS                       │
    ├────────────────────────────────────────────────────────────────┤
    │                                                                │
    │  Morning Login Spike (08:00-09:30):                           │
    │  ████████████████████████ 180 Mbps                            │
    │                                                                │
    │  Steady State (09:30-17:00):                                  │
    │  ███████████████ 120 Mbps                                     │
    │                                                                │
    │  Month-End Close (Last 3 days):                               │
    │  ██████████████████████████████ 220 Mbps                      │
    │                                                                │
    │  After Hours (17:00-08:00):                                   │
    │  ████ 35 Mbps                                                 │
    │                                                                │
    └────────────────────────────────────────────────────────────────┘
```

### Database Replication

| Parameter | Requirement |
|-----------|-------------|
| **Application** | Oracle Data Guard, SQL Always-On |
| **Protocol** | Oracle Net (TCP 1521), SQL (TCP 1433) |
| **Replication Type** | Synchronous (Local), Async (DR) |
| **Bandwidth** | 100-150 Mbps sustained |
| **Latency** | <25 ms (sync), <100 ms (async) |
| **Packet Loss** | <0.1% (critical for sync) |
| **Recovery Point** | Zero data loss (sync) |

### Core Banking Application

| Parameter | Requirement |
|-----------|-------------|
| **Application** | Finacle Core Banking |
| **Protocol** | HTTPS (443), Custom (8080) |
| **Server Location** | Mumbai DC |
| **Users** | 450 |
| **Transactions/sec** | 150 TPS peak |
| **Latency** | <100 ms |
| **Availability** | 99.99% |

---

## 1.3.5 Tier 3: Business Important Applications

### Office 365 Suite

| Component | Protocol | Ports | Bandwidth | Latency | Notes |
|-----------|----------|-------|-----------|---------|-------|
| Exchange Online | HTTPS | 443 | 50 Kbps/user | <150 ms | Email, calendar |
| SharePoint | HTTPS | 443 | Variable | <200 ms | Document access |
| OneDrive | HTTPS | 443 | Variable | <200 ms | Sync traffic |
| Teams (Chat) | HTTPS | 443 | 20 Kbps/user | <200 ms | Messaging |

#### Office 365 Optimization Strategy

```
    ┌────────────────────────────────────────────────────────────────┐
    │              OFFICE 365 CLOUD ONRAMP STRATEGY                 │
    ├────────────────────────────────────────────────────────────────┤
    │                                                                │
    │  CURRENT PATH (via DC):                                       │
    │  Branch → MPLS → Mumbai DC → Internet → O365                  │
    │  Latency: 85-120ms                                            │
    │                                                                │
    │  OPTIMIZED PATH (Direct Internet Access):                     │
    │  Branch → Local Internet → O365 (nearest Microsoft PoP)       │
    │  Latency: 35-55ms                                             │
    │                                                                │
    │  IMPLEMENTATION:                                              │
    │  - Enable Cloud OnRamp for SaaS                               │
    │  - Configure O365 domains in trusted list                     │
    │  - Apply QoS for real-time components (Teams voice/video)     │
    │  - Monitor via vAnalytics cloud application metrics           │
    │                                                                │
    └────────────────────────────────────────────────────────────────┘
```

### Salesforce CRM

| Parameter | Requirement |
|-----------|-------------|
| **Application** | Salesforce Sales Cloud, Service Cloud |
| **Protocol** | HTTPS (443) |
| **Instance** | ap3.salesforce.com (Singapore) |
| **Users** | 450 |
| **Bandwidth** | 15-25 Mbps peak |
| **Latency** | <150 ms |
| **Availability** | 99.9% (SaaS SLA) |

### ServiceNow ITSM

| Parameter | Requirement |
|-----------|-------------|
| **Application** | ServiceNow Utah |
| **Protocol** | HTTPS (443) |
| **Instance** | abhavtech.service-now.com |
| **Users** | 380 |
| **Bandwidth** | 8-12 Mbps peak |
| **Latency** | <200 ms |

---

## 1.3.6 Application to QoS Mapping

### SD-WAN QoS Class Mapping

| Application | Traffic Class | DSCP | Queue Priority | Bandwidth % |
|-------------|---------------|------|----------------|-------------|
| Voice (RTP) | Real-Time | EF (46) | Priority Queue | 10% |
| Voice (SIP) | Call Signaling | CS3 (24) | Queue 1 | 2% |
| Video Conference | Real-Time | AF41 (34) | Queue 1 | 15% |
| SAP Interactive | Business Critical | AF31 (26) | Queue 2 | 25% |
| Database Replication | Business Critical | AF21 (18) | Queue 2 | 15% |
| Office 365 | Business Important | AF11 (10) | Queue 3 | 15% |
| Web Browsing | Default | BE (0) | Default Queue | 10% |
| File Transfer | Bulk Data | AF12 (12) | Queue 4 | 5% |
| Backup | Scavenger | CS1 (8) | Queue 5 | 3% |

### QoS Policy Diagram

```
                         SD-WAN QoS QUEUE MODEL
    ═══════════════════════════════════════════════════════════════

    ┌─────────────────────────────────────────────────────────────┐
    │                     TRAFFIC INGRESS                         │
    │    Application Recognition (NBAR2) + DPI                    │
    └────────────────────────────┬────────────────────────────────┘
                                 │
                                 ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                  CLASSIFICATION & MARKING                   │
    │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────┐ │
    │  │Voice/RTP│ │  Video  │ │   SAP   │ │  O365   │ │Default│ │
    │  │ DSCP EF │ │DSCP AF41│ │DSCP AF31│ │DSCP AF11│ │DSCP BE│ │
    │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └───┬───┘ │
    └───────┼───────────┼───────────┼───────────┼──────────┼─────┘
            │           │           │           │          │
            ▼           ▼           ▼           ▼          ▼
    ┌─────────────────────────────────────────────────────────────┐
    │                    QUEUING & SCHEDULING                     │
    │                                                             │
    │  ┌─────────┐  Priority Queue (LLQ) - 10%                   │
    │  │ Voice   │  - Strict priority                            │
    │  │   RTP   │  - Policed at 10% interface                   │
    │  └─────────┘                                               │
    │                                                             │
    │  ┌─────────┐  CBWFQ Queue 1 - 15%                          │
    │  │  Video  │  - Weighted fair queuing                      │
    │  │Conference│ - Guaranteed minimum                         │
    │  └─────────┘                                               │
    │                                                             │
    │  ┌─────────┐  CBWFQ Queue 2 - 40%                          │
    │  │Business │  - SAP, Database, Core Apps                   │
    │  │Critical │  - Largest allocation                         │
    │  └─────────┘                                               │
    │                                                             │
    │  ┌─────────┐  Default Queue - 35%                          │
    │  │ Default │  - Best effort traffic                        │
    │  │ + Bulk  │  - Includes scavenger                        │
    │  └─────────┘                                               │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘
```

---

## 1.3.7 Application SLA Requirements Matrix

### Complete SLA Matrix

| Application | Latency (ms) | Jitter (ms) | Loss (%) | Availability | QoS Class |
|-------------|--------------|-------------|----------|--------------|-----------|
| Voice (VoIP) | <75 | <30 | <1.0 | 99.999% | Real-Time |
| Video Conf | <100 | <30 | <1.0 | 99.99% | Real-Time |
| SAP GUI | <150 | <50 | <0.5 | 99.99% | Business Critical |
| SAP Fiori | <200 | <100 | <1.0 | 99.99% | Business Critical |
| Database Sync | <25 | <10 | <0.1 | 99.999% | Business Critical |
| Database Async | <100 | <50 | <0.5 | 99.99% | Business Critical |
| Core Banking | <100 | <30 | <0.5 | 99.99% | Business Critical |
| Office 365 | <150 | <100 | <1.0 | 99.9% | Business Important |
| Salesforce | <150 | <100 | <1.0 | 99.9% | Business Important |
| Web Browsing | <300 | N/A | <2.0 | 99.5% | Best Effort |
| File Transfer | N/A | N/A | <0.5 | 99.5% | Bulk Data |
| Backup | N/A | N/A | <0.1 | 99.0% | Scavenger |

### Application-Aware Routing (AAR) SLA Classes

| SLA Class | Latency Threshold | Loss Threshold | Jitter Threshold | Fallback Action |
|-----------|-------------------|----------------|------------------|-----------------|
| Real-Time | 100 ms | 1% | 30 ms | Switch path immediately |
| Critical | 150 ms | 2% | 50 ms | Switch within 1 sec |
| Important | 250 ms | 3% | 100 ms | Switch within 5 sec |
| Best Effort | 500 ms | 5% | N/A | No automatic switch |

---

## 1.3.8 Application Dependencies

### Application Dependency Map

```
                    APPLICATION DEPENDENCY MATRIX
    ═══════════════════════════════════════════════════════════════

    ┌─────────────────────────────────────────────────────────────┐
    │                                                             │
    │  ┌─────────┐      ┌─────────┐      ┌─────────┐             │
    │  │   SAP   │─────►│   DNS   │◄─────│  O365   │             │
    │  │  S/4H   │      │Infoblox │      │         │             │
    │  └────┬────┘      └────┬────┘      └────┬────┘             │
    │       │                │                │                   │
    │       │           ┌────▼────┐           │                   │
    │       └──────────►│   ISE   │◄──────────┘                   │
    │                   │ (AuthN) │                               │
    │                   └────┬────┘                               │
    │                        │                                    │
    │                   ┌────▼────┐                               │
    │                   │   AD    │                               │
    │                   │  LDAP   │                               │
    │                   └─────────┘                               │
    │                                                             │
    │  ┌─────────┐      ┌─────────┐      ┌─────────┐             │
    │  │  Voice  │─────►│  CUCM   │─────►│  NTP    │             │
    │  │         │      │         │      │         │             │
    │  └─────────┘      └─────────┘      └─────────┘             │
    │                                                             │
    └─────────────────────────────────────────────────────────────┘
```

### Critical Dependencies

| Application | Depends On | Impact if Unavailable | Mitigation |
|-------------|------------|----------------------|------------|
| All Apps | DNS (Infoblox) | Complete outage | Local DNS cache |
| All Apps | Active Directory | Authentication failure | Cached credentials |
| SAP | Oracle Database | SAP unavailable | DB HA cluster |
| Voice | CUCM | No call control | Survivable Gateway |
| Voice | NTP | Call timing issues | Multiple NTP sources |
| Email | Exchange Online | Email outage | O365 SLA (99.9%) |

---

## 1.3.9 Application Requirements Summary

### Summary by Category

| Category | Applications | Bandwidth | Latency | Priority |
|----------|-------------|-----------|---------|----------|
| Real-Time | Voice, Video | 25% | <100 ms | Highest |
| Business Critical | SAP, DB, Banking | 40% | <150 ms | High |
| Cloud/SaaS | O365, SFDC, SNow | 20% | <200 ms | Medium |
| Best Effort | Web, File | 15% | <500 ms | Low |

### Key Recommendations for SD-WAN Design

1. **Voice/Video**: Enable FEC and packet duplication for inter-region paths
2. **SAP**: Configure dedicated AAR SLA class with <150ms threshold
3. **Database Replication**: Use MPLS-only for synchronous replication
4. **Cloud SaaS**: Enable Cloud OnRamp with DIA at branches
5. **General**: Implement NBAR2 for deep application recognition

---

## References

| Document | Description |
|----------|-------------|
| Cisco SD-WAN AAR Design Guide | Application-Aware Routing |
| Cisco QoS Design Guide | QoS best practices |
| SAP Network Requirements | SAP Performance Note |
| Microsoft 365 Network Connectivity | O365 requirements |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use Only*
*Abhavtech.com - SD-WAN Documentation*
