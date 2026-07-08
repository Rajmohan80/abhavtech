# 1.7 Business Requirements

## Document Information

| Item | Details |
|------|---------|
| **Document Version** | 1.0 |
| **Last Updated** | December 2025 |
| **Author** | Network Architecture Team |
| **Organization** | Abhavtech.com |
| **Classification** | Internal Use Only |

---

## 1.7.1 Overview

This section documents the business requirements driving the SD-WAN migration initiative at Abhavtech.com. These requirements establish the business context for technical decisions and define the success criteria from a business perspective.

### Business Drivers

- Cost optimization (WAN expense reduction)
- Cloud-first strategy enablement
- Business agility and speed to market
- Enhanced user experience
- Digital transformation support
- Competitive advantage through network modernization

---

## 1.7.2 Cost Optimization Requirements

### WAN Cost Reduction Targets

| Category | Current Annual Cost | Target Reduction | Target Annual Cost |
|----------|--------------------|-----------------|--------------------|
| MPLS Circuits | $XXX,XXX | 80% | $XXX,XXX |
| Internet Circuits | $XXX,XXX | 0% (upgrade) | $XXX,XXX |
| Cellular Backup | $X,XXX | 0% (expand) | $XX,XXX |
| Hardware Maintenance | $XX,XXX | 40% | $XX,XXX |
| **Total WAN OpEx** | **$X,XXX,XXX** | **56%** | **$XXX,XXX** |

### Cost Savings Breakdown

```
                    PROJECTED ANNUAL SAVINGS
    ═══════════════════════════════════════════════════════════════

    CURRENT STATE (Annual):
    ┌─────────────────────────────────────────────────────────────┐
    │  MPLS Circuits         $XXX,XXX  ██████████████████████ 79% │
    │  Internet Circuits     $XXX,XXX  ████ 13%                   │
    │  Cellular Backup         $X,XXX  ▌ <1%                      │
    │  Hardware Maintenance   $XX,XXX  ██ 8%                      │
    │  ─────────────────────────────────────────────────────────  │
    │  TOTAL                $X,XXX,XXX                            │
    └─────────────────────────────────────────────────────────────┘

    FUTURE STATE (Annual):
    ┌─────────────────────────────────────────────────────────────┐
    │  MPLS Circuits (Year 2+)  $X     (Eliminated)               │
    │  Internet Primary     $XXX,XXX   ████████████ 42%           │
    │  Internet Secondary   $XXX,XXX   ██████ 25%                 │
    │  Cellular Backup       $XX,XXX   █ 4%                       │
    │  SD-WAN Licensing      $XX,XXX   ████ 19%                   │
    │  Hardware Maintenance  $XX,XXX   ███ 11%                    │
    │  ─────────────────────────────────────────────────────────  │
    │  TOTAL                $XXX,XXX                              │
    └─────────────────────────────────────────────────────────────┘

    ANNUAL SAVINGS: $XXX,XXX (62.5% reduction)
    3-YEAR SAVINGS: $X,XXX,XXX
    5-YEAR SAVINGS: $X,XXX,XXX
    ═══════════════════════════════════════════════════════════════
```

### ROI Requirements

| Metric | Target |
|--------|--------|
| Payback Period | <18 months |
| 3-Year ROI | >200% |
| 5-Year TCO Reduction | >50% |
| Annual OpEx Savings | >$XXX,XXX |

---

## 1.7.3 Cloud Strategy Requirements

### Cloud-First Initiative Support

| Requirement | Description | SD-WAN Enablement |
|-------------|-------------|-------------------|
| SaaS Optimization | Direct access to O365, Salesforce | Cloud OnRamp for SaaS |
| IaaS Connectivity | AWS, Azure integration | Cloud OnRamp for IaaS |
| Multi-Cloud Support | Avoid vendor lock-in | Cloud agnostic design |
| SASE Readiness | Secure cloud access | Umbrella/SSE integration |

### Cloud Application Performance Targets

| Application | Current Latency | Target Latency | Improvement |
|-------------|-----------------|----------------|-------------|
| Office 365 | 85-120 ms | <50 ms | >50% |
| Salesforce | 75-95 ms | <50 ms | >40% |
| AWS ap-south-1 | 25-40 ms | <20 ms | >30% |
| Azure centralindia | 20-35 ms | <15 ms | >30% |
| Webex | 70-110 ms | <40 ms | >50% |

### Cloud Connectivity Architecture

```
                    CLOUD-FIRST NETWORK ARCHITECTURE
    ═══════════════════════════════════════════════════════════════

    BRANCH SITES:
    ┌─────────────────────────────────────────────────────────────┐
    │                                                             │
    │   ┌────────────┐    Cloud OnRamp     ┌────────────┐        │
    │   │  Branch    │ ─────────────────► │   SaaS     │        │
    │   │  WAN Edge  │    DIA             │  (O365,    │        │
    │   │            │                    │ Salesforce)│        │
    │   └─────┬──────┘                    └────────────┘        │
    │         │                                                  │
    │         │ SD-WAN Overlay                                   │
    │         │                                                  │
    │   ┌─────▼──────┐                    ┌────────────┐        │
    │   │    Hub     │ ─────────────────► │   IaaS     │        │
    │   │  WAN Edge  │  Cloud OnRamp      │ (AWS/Azure)│        │
    │   │            │  for IaaS          │            │        │
    │   └────────────┘                    └────────────┘        │
    │                                                            │
    └─────────────────────────────────────────────────────────────┘
```

---

## 1.7.4 Business Agility Requirements

### Speed to Market

| Metric | Current State | Target State | Improvement |
|--------|---------------|--------------|-------------|
| New site deployment | 8-12 weeks | 1-2 weeks | 80% faster |
| Bandwidth upgrade | 4-6 weeks | Same day | 95% faster |
| New application onboarding | 2-4 weeks | 1-3 days | 90% faster |
| Policy change implementation | 1-2 weeks | <1 hour | 99% faster |

### Operational Agility

| Capability | Current | Target | Business Impact |
|------------|---------|--------|-----------------|
| Zero-touch provisioning | Manual | Automated | Reduced OpEx |
| Centralized management | Distributed | Single pane | Faster troubleshooting |
| Template-based deployment | Custom configs | Standardized | Consistency, speed |
| Self-service bandwidth | Not available | Portal-based | Business empowerment |

### M&A and Business Expansion Support

| Scenario | Current Timeline | Target Timeline |
|----------|------------------|-----------------|
| Acquire new company | 6-12 months integration | 4-8 weeks integration |
| Open new branch | 8-12 weeks | 1-2 weeks |
| Close/relocate site | 4-6 weeks | 1-2 weeks |
| Temporary/pop-up site | Not supported | 1-2 days with 4G/5G |

---

## 1.7.5 User Experience Requirements

### Application Performance

| Requirement | Metric | Target |
|-------------|--------|--------|
| Voice quality | MOS score | >4.2 |
| Video quality | Resolution maintained | 1080p sustained |
| SAP response | Transaction time | <2 seconds |
| Web browsing | Page load time | <3 seconds |
| File download | Throughput | >50 Mbps |

### Reliability Requirements

| Metric | Target | Business Justification |
|--------|--------|----------------------|
| WAN Availability | 99.99% | Revenue protection |
| Failover time | <1 second | Voice/video continuity |
| Packet loss | <0.1% | Application quality |
| Scheduled downtime | <4 hours/year | Business continuity |

### User Productivity Impact

```
                    USER PRODUCTIVITY METRICS
    ═══════════════════════════════════════════════════════════════

    METRIC                     CURRENT      TARGET      IMPACT
    ─────────────────────────────────────────────────────────────
    Application availability    98.5%        99.9%      +150 hrs/user/year
    SaaS performance           85ms         40ms       +45 min/user/day
    Video conference quality   3.5 MOS      4.3 MOS    Reduced rework
    Help desk tickets (WAN)    150/month    50/month   -67% IT overhead
    
    ESTIMATED PRODUCTIVITY GAIN: 2.3% workforce efficiency
    MONETARY VALUE: ~$X.XM annually (3,000 employees)
    ═══════════════════════════════════════════════════════════════
```

---

## 1.7.6 Security and Compliance Requirements

### Security Business Requirements

| Requirement | Business Driver | Priority |
|-------------|-----------------|----------|
| End-to-end encryption | Data protection | Critical |
| Segmentation | Compliance (PCI-DSS) | Critical |
| Threat prevention | Risk mitigation | High |
| Audit logging | Regulatory compliance | Critical |
| Zero-trust architecture | Security posture | High |

### Compliance Timeline Requirements

| Regulation | Deadline | SD-WAN Dependency |
|------------|----------|-------------------|
| PCI-DSS 4.0 | March 2025 | Segmentation, encryption |
| SOC 2 Audit | June 2025 | Logging, access control |
| ISO 27001 Renewal | September 2025 | All security controls |
| RBI Compliance | Ongoing | Data localization |

---

## 1.7.7 Digital Transformation Alignment

### Strategic IT Initiatives

| Initiative | SD-WAN Enablement | Timeline |
|------------|-------------------|----------|
| Cloud migration | Direct cloud connectivity | 2025 |
| Remote work | SASE/secure access | 2025 |
| IoT expansion | Segmentation, bandwidth | 2025-2026 |
| AI/ML adoption | Low-latency cloud access | 2026 |
| Edge computing | Branch compute support | 2026-2027 |

### Future-Proofing Requirements

| Capability | Current Need | Future Need (3yr) | SD-WAN Support |
|------------|--------------|-------------------|----------------|
| Bandwidth | 3 Gbps total | 10 Gbps total | Scalable |
| Sites | 9 | 15-20 | Template-based |
| Cloud apps | 10 | 30+ | Cloud OnRamp |
| IoT devices | 500 | 2,000+ | Segmentation |
| Remote users | 500 | 1,500+ | SASE integration |

---

## 1.7.8 Business Requirements Summary

### Priority Matrix

| Requirement Category | Priority | Weight | Success Criteria |
|---------------------|----------|--------|------------------|
| Cost Reduction | High | 30% | >50% OpEx reduction |
| Cloud Enablement | High | 25% | <50ms SaaS latency |
| Business Agility | High | 20% | <2 week site deployment |
| User Experience | Medium | 15% | >4.0 MOS, 99.9% availability |
| Security/Compliance | Critical | 10% | All audits passed |

### Business Case Summary

| Metric | Value |
|--------|-------|
| Total Investment (3 years) | $XXX,XXX |
| Total Savings (3 years) | $X,XXX,XXX |
| Net Benefit (3 years) | $X,XXX,XXX |
| ROI | 233% |
| Payback Period | 14 months |

### Executive Summary

The SD-WAN migration will deliver significant business value through cost reduction, improved cloud access, and enhanced operational agility. The project aligns with Abhavtech.com's digital transformation strategy and positions the network infrastructure to support future growth initiatives.

---

## References

| Document | Description |
|----------|-------------|
| Abhavtech IT Strategy 2025-2028 | Digital transformation roadmap |
| Cloud Migration Plan | Cloud-first initiative details |
| Financial Analysis Workbook | Detailed cost calculations |
| Compliance Requirements Matrix | Regulatory obligations |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use Only*
*Abhavtech.com - SD-WAN Documentation*
