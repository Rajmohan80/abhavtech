# 1.4 Transport Assessment

## Document Information

| Item | Details |
|------|---------|
| **Document Version** | 1.0 |
| **Last Updated** | December 2025 |
| **Author** | Network Architecture Team |
| **Organization** | Abhavtech.com |
| **Classification** | Internal Use Only |

---

## 1.4.1 Overview

This section assesses the availability, performance, and cost of various WAN transport options at each Abhavtech.com site. The assessment informs SD-WAN transport selection, hybrid WAN design, and fallback strategies.

### Transport Options Evaluated

- MPLS (Existing)
- Business-Grade Internet (DIA)
- Broadband Internet
- 4G/LTE Cellular
- 5G Cellular (where available)
- LEO Satellite (future consideration)

---

## 1.4.2 Transport Assessment Matrix

### Complete Site-by-Site Assessment

| Site | MPLS | DIA (Business) | Broadband | 4G/LTE | 5G | LEO Sat |
|------|------|----------------|-----------|--------|-----|---------|
| Mumbai | ✅ 800 Mbps | ✅ 800 Mbps | ✅ 1 Gbps | ✅ | ✅ | Future |
| Chennai | ✅ 500 Mbps | ✅ 500 Mbps | ✅ 500 Mbps | ✅ | ✅ | Future |
| Bangalore | ✅ 200 Mbps | ✅ 300 Mbps | ✅ 500 Mbps | ✅ | ✅ | Future |
| Delhi | ✅ 150 Mbps | ✅ 200 Mbps | ✅ 300 Mbps | ✅ | Limited | Future |
| Noida | ✅ 150 Mbps | ✅ 200 Mbps | ✅ 300 Mbps | ✅ | Limited | Future |
| London | ✅ 300 Mbps | ✅ 500 Mbps | ✅ 1 Gbps | ✅ | ✅ | Future |
| Frankfurt | ✅ 300 Mbps | ✅ 500 Mbps | ✅ 1 Gbps | ✅ | ✅ | Future |
| New Jersey | ✅ 500 Mbps | ✅ 1 Gbps | ✅ 1 Gbps | ✅ | ✅ | Future |
| Dallas | ✅ 300 Mbps | ✅ 500 Mbps | ✅ 1 Gbps | ✅ | ✅ | Future |

---

## 1.4.3 MPLS Transport Assessment

### Current MPLS Providers

| Region | Primary Provider | Secondary Provider | Coverage |
|--------|-----------------|-------------------|----------|
| India | Tata Communications | Bharti Airtel | All 5 sites |
| EMEA | BT Global Services | Vodafone/Colt | All 2 sites |
| Americas | AT&T | Verizon/Lumen | All 2 sites |

### MPLS Performance Characteristics

| Metric | India Region | EMEA Region | Americas | Inter-Region |
|--------|-------------|-------------|----------|--------------|
| Latency (Avg) | 15-25 ms | 10-15 ms | 30-40 ms | 120-200 ms |
| Latency SLA | 25 ms | 20 ms | 50 ms | 200 ms |
| Jitter | <5 ms | <5 ms | <5 ms | <15 ms |
| Packet Loss | <0.1% | <0.1% | <0.1% | <0.2% |
| Availability | 99.95% | 99.99% | 99.95% | 99.9% |

### MPLS Cost Analysis

| Circuit | Monthly Cost | Cost per Mbps |
|---------|--------------|---------------|
| India MPLS (5 circuits) | $XX,XXX | $XX.XX |
| EMEA MPLS (4 circuits) | $XX,XXX | $XX.XX |
| Americas MPLS (4 circuits) | $XX,XXX | $XX.XX |
| **Total MPLS** | **$XX,XXX** | **$XX.XX** |

---

## 1.4.4 Internet Transport Assessment

### Business-Grade DIA Assessment

| Site | Provider | Bandwidth | Latency | SLA | Monthly Cost |
|------|----------|-----------|---------|-----|--------------|
| Mumbai | Tata/Airtel | 500+300 Mbps | 8-12 ms | 99.9% | $X,XXX |
| Chennai | ACT | 200 Mbps | 10-15 ms | 99.5% | $XXX |
| Bangalore | ACT | 150 Mbps | 12-18 ms | 99.5% | $XXX |
| Delhi | Excitel | 100 Mbps | 15-20 ms | 99.0% | $XXX |
| Noida | Spectra | 100 Mbps | 12-18 ms | 99.0% | $XXX |
| London | BT | 200 Mbps | 5-10 ms | 99.9% | $X,XXX |
| Frankfurt | DE-CIX | 200 Mbps | 5-10 ms | 99.9% | $X,XXX |
| New Jersey | Comcast Biz | 300 Mbps | 8-15 ms | 99.9% | $X,XXX |
| Dallas | Spectrum Biz | 200 Mbps | 10-18 ms | 99.5% | $XXX |

### Internet Latency to Cloud Regions

```
                    INTERNET LATENCY TO MAJOR CLOUD REGIONS
    ═══════════════════════════════════════════════════════════════

    FROM SITE      │ AWS ap-south-1 │ Azure India │ O365 India │ GCP asia
    ───────────────┼────────────────┼─────────────┼────────────┼──────────
    Mumbai         │     8 ms       │    10 ms    │   12 ms    │   15 ms
    Chennai        │    12 ms       │    14 ms    │   16 ms    │   18 ms
    Bangalore      │    10 ms       │    12 ms    │   14 ms    │   16 ms
    Delhi          │    15 ms       │    18 ms    │   20 ms    │   25 ms
    Noida          │    14 ms       │    16 ms    │   18 ms    │   22 ms
    ───────────────┼────────────────┼─────────────┼────────────┼──────────
    FROM SITE      │ AWS eu-west-1  │ Azure EU    │ O365 EU    │ GCP EU
    ───────────────┼────────────────┼─────────────┼────────────┼──────────
    London         │    12 ms       │    10 ms    │    8 ms    │   12 ms
    Frankfurt      │    10 ms       │     8 ms    │   10 ms    │    8 ms
    ───────────────┼────────────────┼─────────────┼────────────┼──────────
    FROM SITE      │ AWS us-east-1  │ Azure US    │ O365 US    │ GCP US
    ───────────────┼────────────────┼─────────────┼────────────┼──────────
    New Jersey     │     8 ms       │    10 ms    │   12 ms    │   15 ms
    Dallas         │    25 ms       │    22 ms    │   20 ms    │   28 ms
    ═══════════════════════════════════════════════════════════════
```

---

## 1.4.5 Cellular Transport Assessment

### 4G/LTE Availability

| Site | Provider | Signal Strength | Download | Upload | Latency |
|------|----------|-----------------|----------|--------|---------|
| Mumbai | Jio/Airtel/Vi | Excellent | 80 Mbps | 30 Mbps | 25 ms |
| Chennai | Jio/Airtel | Excellent | 70 Mbps | 25 Mbps | 28 ms |
| Bangalore | Jio/Airtel | Excellent | 75 Mbps | 28 Mbps | 25 ms |
| Delhi | Jio/Airtel/Vi | Good | 50 Mbps | 20 Mbps | 35 ms |
| Noida | Jio/Airtel | Good | 55 Mbps | 22 Mbps | 32 ms |
| London | EE/Vodafone | Excellent | 60 Mbps | 25 Mbps | 30 ms |
| Frankfurt | T-Mobile/Vodafone | Excellent | 65 Mbps | 28 Mbps | 28 ms |
| New Jersey | Verizon/AT&T | Excellent | 70 Mbps | 30 Mbps | 25 ms |
| Dallas | AT&T/T-Mobile | Excellent | 65 Mbps | 28 Mbps | 28 ms |

### 5G Availability Assessment

| Site | 5G Available | Provider | Expected Speed | Coverage |
|------|--------------|----------|----------------|----------|
| Mumbai | ✅ Yes | Jio/Airtel | 500+ Mbps | Good (urban) |
| Chennai | ✅ Yes | Jio/Airtel | 400+ Mbps | Good (urban) |
| Bangalore | ✅ Yes | Jio/Airtel | 500+ Mbps | Good (tech parks) |
| Delhi | ⚠️ Limited | Jio/Airtel | 300 Mbps | Partial |
| Noida | ⚠️ Limited | Jio | 250 Mbps | Partial |
| London | ✅ Yes | EE/Three | 400+ Mbps | Good |
| Frankfurt | ✅ Yes | Telekom/Vodafone | 400+ Mbps | Good |
| New Jersey | ✅ Yes | Verizon/T-Mobile | 500+ Mbps | Good |
| Dallas | ✅ Yes | AT&T/T-Mobile | 400+ Mbps | Good |

---

## 1.4.6 Transport Selection Framework

### Recommended Transport Mix

```
                    SD-WAN TRANSPORT SELECTION BY SITE TYPE
    ═══════════════════════════════════════════════════════════════

    DATA CENTER (Mumbai, Chennai):
    ┌────────────────────────────────────────────────────────────┐
    │  Transport 1: Business DIA (Primary)     │ 500+ Mbps      │
    │  Transport 2: MPLS (Overlay fallback)    │ 500+ Mbps      │
    │  Transport 3: Business DIA 2 (Secondary) │ 300 Mbps       │
    │  Transport 4: 4G/5G (Emergency)          │ 100 Mbps       │
    └────────────────────────────────────────────────────────────┘

    REGIONAL HUB (London, Frankfurt, NJ, Dallas):
    ┌────────────────────────────────────────────────────────────┐
    │  Transport 1: Business DIA (Primary)     │ 300-500 Mbps   │
    │  Transport 2: MPLS (Phase-out)           │ 200-300 Mbps   │
    │  Transport 3: 4G/5G (Backup)             │ 50-100 Mbps    │
    └────────────────────────────────────────────────────────────┘

    BRANCH (Bangalore, Delhi, Noida):
    ┌────────────────────────────────────────────────────────────┐
    │  Transport 1: Business DIA (Primary)     │ 200-300 Mbps   │
    │  Transport 2: Broadband (Secondary)      │ 300-500 Mbps   │
    │  Transport 3: 4G/LTE (Backup)            │ 50 Mbps        │
    └────────────────────────────────────────────────────────────┘
```

### Transport Cost Comparison

| Transport Type | Avg Cost/Mbps | Reliability | Latency | Use Case |
|---------------|---------------|-------------|---------|----------|
| MPLS | $XX.XX | 99.95% | Lowest | Critical apps |
| Business DIA | $X.XX | 99.5% | Low | Primary transport |
| Broadband | $X.XX | 99.0% | Low-Medium | Secondary |
| 4G/LTE | $XX.XX | 99.0% | Medium | Backup |
| 5G | $XX.XX | 99.0% | Low | Future primary |

---

## 1.4.7 Transport Recommendations

### Recommended SD-WAN Transport Strategy

| Phase | Timeline | Transport Strategy |
|-------|----------|-------------------|
| Phase 1 | Months 1-6 | Hybrid (MPLS + Internet) |
| Phase 2 | Months 7-12 | Internet Primary + MPLS Secondary |
| Phase 3 | Months 13-18 | Internet Only + 5G Backup |

### Site-Specific Recommendations

| Site | Recommended Primary | Recommended Secondary | Backup |
|------|--------------------|-----------------------|--------|
| Mumbai | DIA 500 Mbps | DIA 300 Mbps | 5G |
| Chennai | DIA 300 Mbps | DIA 200 Mbps | 4G |
| Bangalore | DIA 300 Mbps | Broadband 500 Mbps | 4G |
| Delhi | DIA 200 Mbps | Broadband 300 Mbps | 4G |
| Noida | DIA 200 Mbps | Broadband 300 Mbps | 4G |
| London | DIA 500 Mbps | DIA 200 Mbps | 5G |
| Frankfurt | DIA 500 Mbps | DIA 200 Mbps | 5G |
| New Jersey | DIA 500 Mbps | DIA 300 Mbps | 5G |
| Dallas | DIA 300 Mbps | Broadband 500 Mbps | 4G |

### Projected Cost Savings

| Current State | Future State | Monthly Savings |
|--------------|--------------|-----------------|
| MPLS: $XX,XXX | MPLS: $X (phased out) | $XX,XXX |
| DIA: $XX,XXX | DIA: $XX,XXX (upgraded) | -$X,XXX |
| Cellular: $XXX | Cellular: $X,XXX (expanded) | -$XXX |
| **Total: $XX,XXX** | **Total: $XX,XXX** | **$XX,XXX (76%)** |

---

## 1.4.8 Transport Assessment Summary

### Key Findings

1. **MPLS**: Reliable but expensive at $XX.XX/Mbps; phase-out candidate
2. **Internet**: Cost-effective at $X-X/Mbps; suitable for primary transport
3. **5G**: Available at major sites; viable for backup/burst capacity
4. **Cloud Proximity**: Direct internet provides 50-60% better SaaS latency

### Transport Decision Matrix

| Factor | MPLS | Internet | 4G/5G | Recommendation |
|--------|------|----------|-------|----------------|
| Cost | Poor | Excellent | Good | Internet primary |
| Latency | Excellent | Good | Fair | Internet + QoS |
| Reliability | Excellent | Good | Fair | Dual Internet |
| SLA | Excellent | Good | Fair | AAR failover |
| Scalability | Poor | Excellent | Good | Internet |

---

## References

| Document | Description |
|----------|-------------|
| Cisco SD-WAN Transport Design Guide | Transport best practices |
| Provider SLA Documentation | Service level agreements |
| Network Performance Baseline Report | Current measurements |

---

*Document Version: 1.0*
*Last Updated: December 2025*
*Classification: Internal Use Only*
*Abhavtech.com - SD-WAN Documentation*
