# CHAPTER 10: PHASED ROLLOUT STRATEGY (PHASE 5B WAVES 1-3)

## 10.1 Rollout Strategy Overview

### 10.1.1 Phase 5B Deployment Model

**Post-Pilot Expansion (Phase 5A → Phase 5B):**

```yaml
Phase 5A (Pilot): COMPLETED ✓
  Duration: 16 weeks (Q2 2025)
  Sites: 4 sites (Mumbai, Chennai, Bangalore, London)
  APs: 115 WiFi 7 APs
  Users: 1,420 users (9% wireless adoption)
  Status: Validated (all use cases met, 92% satisfaction)

Phase 5B: Production Rollout (3 Waves)
  Duration: 72 weeks (Q3 2025 - Q2 2026)
  Sites: 15 remaining sites (19 total - 4 pilot sites)
  APs: 1,105 WiFi 7 APs (total 1,220 with pilot)
  Users: 13,500 users (total 14,920 with pilot)
  Target: 85% wireless adoption by Q2 2026

Wave Model:
  • Wave 1 (Week 17-30, Q3 2025): 6 large sites, 400 APs
  • Wave 2 (Week 31-52, Q4 2025-Q1 2026): 8 medium sites, 550 APs
  • Wave 3 (Week 53-65, Q2 2026): 5 small sites, 155 APs
```

---

### 10.1.2 Site Prioritization Criteria

**Ranking Logic (How Sites Selected for Each Wave):**

| Criterion | Weight | Measurement | Scoring |
|-----------|--------|-------------|---------|
| **Business Impact** | 40% | Revenue per site, executive count | HQ sites = 10, Regional = 7, Branch = 4 |
| **User Density** | 25% | Users per site | >500 users = 10, 200-500 = 7, <200 = 4 |
| **Current WiFi Age** | 20% | Legacy WiFi 5/6 AP age | >5 years = 10, 3-5 years = 7, <3 years = 4 |
| **Readiness** | 15% | Power/cooling/cabling infrastructure | Ready = 10, Minor upgrades = 7, Major = 4 |

**Wave 1 Sites (High Priority):**
- New Jersey HQ (Score: 9.2)
- Dallas Regional (Score: 8.8)
- Frankfurt HQ (Score: 8.6)
- Singapore HQ (Score: 8.4)
- Tokyo Regional (Score: 8.1)
- Sydney HQ (Score: 7.9)

---

## 10.2 Wave 1 Deployment (Q3 2025, Week 17-30)

### 10.2.1 Wave 1 Sites Overview

**6 Sites, 400 WiFi 7 APs, 5,200 Users:**

| Site | Location | Size (sq ft) | Users | APs Deployed | Legacy APs Replaced | Go-Live Week |
|------|----------|-------------|-------|--------------|---------------------|--------------|
| **New Jersey HQ** | Edison, NJ | 120,000 | 1,200 | 90 | 60 (WiFi 5) | Week 19 |
| **Dallas Regional** | Plano, TX | 80,000 | 950 | 65 | 45 (WiFi 6) | Week 21 |
| **Frankfurt HQ** | Frankfurt, DE | 95,000 | 850 | 70 | 50 (WiFi 5) | Week 23 |
| **Singapore HQ** | Singapore | 70,000 | 720 | 55 | 40 (WiFi 6) | Week 25 |
| **Tokyo Regional** | Tokyo, JP | 65,000 | 680 | 50 | 35 (WiFi 5) | Week 27 |
| **Sydney HQ** | Sydney, AU | 60,000 | 800 | 70 | 50 (WiFi 6) | Week 29 |
| **TOTAL** | 6 sites | 490,000 | **5,200** | **400** | **280** | **14 weeks** |

---

### 10.2.2 Wave 1 Timeline (14 Weeks)

**Gantt Chart (High-Level):**

```
Week:    17  18  19  20  21  22  23  24  25  26  27  28  29  30
         │   │   │   │   │   │   │   │   │   │   │   │   │   │
New Jersey:  [══════════════════]
         │   │   Prep  │Install│Test│Migrate│
         │   │         │       │    │       │
Dallas:      │   │   [══════════════════]
             │   │   │   │Prep │Install│Test│Migrate│
             │   │   │   │     │       │    │       │
Frankfurt:   │   │   │   │   [══════════════════]
             │   │   │   │   │   │Prep │Install│Test│Migrate│
             │   │   │   │   │   │     │       │    │       │
Singapore:   │   │   │   │   │   │   [══════════════════]
             │   │   │   │   │   │   │   │Prep │Install│Test│Migrate│
             │   │   │   │   │   │   │   │     │       │    │       │
Tokyo:       │   │   │   │   │   │   │   │   [══════════════════]
             │   │   │   │   │   │   │   │   │   │Prep │Install│Test│Migrate│
             │   │   │   │   │   │   │   │   │   │     │       │    │       │
Sydney:      │   │   │   │   │   │   │   │   │   │   [══════════════════]
                                                       │Prep │Install│Test│Migrate│

Legend:
  Prep = Week 1-2: Site survey, power/cooling validation, cabling
  Install = Week 3-4: AP mounting, WLC configuration, ISE policies
  Test = Week 5: RF validation, client testing, performance benchmarking
  Migrate = Week 6: User onboarding, wired port deactivation
```

---

### 10.2.3 Wave 1 Deployment Procedures (Per Site)

**New Jersey HQ Example (Week 17-22):**

```yaml
Week 17 (Preparation):
  Day 1-2: Site Walkthrough
    • Facilities team: Escort network team through 3 floors
    • Verify: Power outlets at AP locations (90 locations)
    • Verify: Ethernet cabling (Cat6A) from IDF to AP locations
    • Document: Any issues (missing cables, insufficient power)
  
  Day 3-5: Pre-Staging
    • Ship equipment: 90× Catalyst 9178I APs, 6× PoE++ switches (backup)
    • Stage in IDF: Unbox, label, test APs (bench testing)
    • Pre-configure: DNAC templates (AP profiles, RF profiles)
    • Coordinate: Facilities for lift/ladder access (ceiling mounting)

Week 18 (Installation):
  Day 1-3: AP Physical Installation
    • Install: 90 APs (30 APs/day, 3 teams of 2 technicians each)
    • Mounting: Cisco Universal AP Bracket (ceiling T-rail)
    • Cable: Connect PoE++ (802.3bt, 60W per AP)
    • Verify: AP powers on, joins WLC (CAPWAP tunnel)
  
  Day 4-5: WLC Configuration
    • Create: 3 SSIDs (Corp-Secure-7, Corp-Guest, Corp-IoT)
    • Apply: RF profiles (6 GHz 320 MHz, 5 GHz 160 MHz)
    • Enable: MLO, WPA3-Enterprise, 802.11r Fast Transition
    • Verify: All 90 APs operational in DNAC dashboard

Week 19 (Testing):
  Day 1-2: RF Validation (Ekahau Pro)
    • Survey: All 3 floors (120,000 sq ft)
    • Measure: RSSI, SNR, channel utilization, co-channel interference
    • Target: 95% coverage area has RSSI >-70 dBm
    • Result: 97% coverage ✓ (exceeds target)
  
  Day 3-4: Client Testing
    • Test devices: 10 laptops (WiFi 7-capable, Dell/Mac)
    • Connect: Corp-Secure-7 SSID (802.1X EAP-TLS)
    • Measure: Throughput (iPerf3), latency (ping), roaming (walk tests)
    • Result: Avg throughput 4.3 Gbps, latency 9.8ms, seamless roaming ✓
  
  Day 5: Performance Benchmarking
    • Load test: Simulate 1,200 concurrent clients (Ixia test equipment)
    • Measure: AP channel utilization, WLC CPU, fabric uplink usage
    • Result: Peak utilization 68% (acceptable, <80% target) ✓

Week 20-21 (User Migration):
  Week 20: Executive Floors (300 executives)
    • Communication: T-7 notification email (see Chapter 6)
    • On-site support: 8 IT technicians (2 per floor)
    • Migration: Floor-by-floor (75 users/day)
    • Helpdesk: Extended hours (7am-8pm vs normal 9am-5pm)
  
  Week 21: General Office Floors (900 employees)
    • Communication: T-7 notification, manager briefings
    • On-site support: 6 IT technicians (roaming)
    • Migration: 150 users/day (6 days, Mon-Sat)
    • Rollback: 8% opted for wired (72 users, acceptable)

Week 22 (Post-Migration):
  • Monitor: DNAC Client 360 (all 1,128 wireless users)
  • Survey: User satisfaction (target >90%, actual 91% ✓)
  • Optimize: DNAC RRM fine-tuning (channel adjustments)
  • Decommission: 60 legacy WiFi 5 APs (returned to inventory)
  • Closeout: Project signoff, lessons learned documentation
```

---

### 10.2.4 Wave 1 Success Metrics

**Wave 1 Completion (Week 30):**

| Metric | Target | Result | Status |
|--------|--------|--------|--------|
| **Sites Deployed** | 6 | **6** | ✅ Complete |
| **APs Operational** | 400 | **397** | ⚠️ 3 APs RMA'd (hardware failure) |
| **Users Migrated** | 5,200 | **4,826** | ✅ 93% adoption (7% opted wired) |
| **Wireless Adoption** | >85% | **93%** | ✅ Exceeded |
| **User Satisfaction** | >90% | **91%** | ✅ Met |
| **P1 Incidents** | 0 | **0** | ✅ Zero critical issues |
| **Timeline** | 14 weeks | **14 weeks** | ✅ On schedule |
| **Budget** | $4.2M | **$4.1M** | ✅ Under budget ($100K savings) |

**Cumulative Progress (After Wave 1):**
- Total sites: 10 of 19 (53%)
- Total APs: 512 of 1,220 (42%)
- Total users: 6,246 of 14,920 (42%)
- Cumulative wireless adoption: 40% ✓ (on track for 85% target)

---

## 10.3 Wave 2 Deployment (Q4 2025-Q1 2026, Week 31-52)

### 10.3.1 Wave 2 Sites Overview

**8 Sites, 550 WiFi 7 APs, 6,000 Users:**

| Site | Location | Size (sq ft) | Users | APs Deployed | Legacy APs Replaced | Go-Live Week |
|------|----------|-------------|-------|--------------|---------------------|--------------|
| **Hong Kong Regional** | Hong Kong | 55,000 | 680 | 45 | 30 (WiFi 6) | Week 33 |
| **Delhi Regional** | New Delhi, IN | 50,000 | 720 | 50 | 35 (WiFi 5) | Week 36 |
| **Amsterdam HQ** | Amsterdam, NL | 60,000 | 800 | 55 | 40 (WiFi 6) | Week 39 |
| **Paris Regional** | Paris, FR | 45,000 | 650 | 40 | 25 (WiFi 6) | Week 42 |
| **Madrid Regional** | Madrid, ES | 50,000 | 700 | 50 | 30 (WiFi 5) | Week 45 |
| **Milan Regional** | Milan, IT | 40,000 | 580 | 40 | 25 (WiFi 6) | Week 48 |
| **Chicago Regional** | Chicago, IL | 55,000 | 750 | 50 | 35 (WiFi 5) | Week 50 |
| **Toronto HQ** | Toronto, CA | 65,000 | 920 | 70 | 50 (WiFi 6) | Week 52 |
| **TOTAL** | 8 sites | 420,000 | **6,000** | **550** | **270** | **22 weeks** |

---

### 10.3.2 Wave 2 Lessons Learned (From Wave 1)

**Improvements Implemented:**

```yaml
Improvement 1: Faster AP Installation (30 → 40 APs/day)
  • Wave 1 Challenge: AP installation took 3-4 days (30 APs/day)
  • Wave 2 Solution: Increased crew size (6 technicians vs 4)
  • Result: 40 APs/day ✓ (25% faster)

Improvement 2: Pre-Migration User Training
  • Wave 1 Challenge: 15% of users needed helpdesk assistance (basic WiFi connection)
  • Wave 2 Solution: Mandatory 10-min video tutorial (sent T-14 days)
  • Result: Only 8% needed helpdesk ✓ (reduced by 47%)

Improvement 3: Automated Port Deactivation
  • Wave 1 Challenge: Manual switch port shutdown (time-consuming, prone to errors)
  • Wave 2 Solution: Python script (DNAC API) auto-disables wired ports after user migrates
  • Result: 90% faster port management ✓

Improvement 4: Real-Time Migration Dashboard
  • Wave 1 Challenge: Project managers relied on email updates (slow, fragmented)
  • Wave 2 Solution: Splunk dashboard "Wave 2 Migration Progress" (real-time)
  • Result: Improved visibility, faster issue detection ✓
```

---

### 10.3.3 Wave 2 Timeline (22 Weeks)

**Staggered Deployment (Overlap Sites):**

```
Week:    31  33  36  39  42  45  48  50  52
         │   │   │   │   │   │   │   │   │
Hong Kong:   [════════]
         │   │Prep│Install│Test│Migrate│
Delhi:       │   [════════]
             │   │   │Prep│Install│Test│Migrate│
Amsterdam:       │   │   [════════]
                 │   │   │   │Prep│Install│Test│Migrate│
Paris:           │   │   │   │   [════════]
                     │   │   │   │   │Prep│Install│Test│Migrate│
Madrid:              │   │   │   │   │   [════════]
                         │   │   │   │   │   │Prep│Install│Test│Migrate│
Milan:                   │   │   │   │   │   │   [════════]
                             │   │   │   │   │   │   │Prep│Install│Test│Migrate│
Chicago:                     │   │   │   │   │   │   │   [════════]
                                 │   │   │   │   │   │   │   │Prep│Install│Test│Migrate│
Toronto:                         │   │   │   │   │   │   │   │   [════════]
                                     │   │   │   │   │   │   │   │   │Prep│Install│Test│Migrate│

Sites overlap: Start new site every 3 weeks (vs 2 weeks in Wave 1, more conservative)
```

---

### 10.3.4 Wave 2 Success Metrics

**Wave 2 Completion (Week 52):**

| Metric | Target | Result | Status |
|--------|--------|--------|--------|
| **Sites Deployed** | 8 | **8** | ✅ Complete |
| **APs Operational** | 550 | **545** | ⚠️ 5 APs RMA'd (hardware failure, 1% failure rate) |
| **Users Migrated** | 6,000 | **5,580** | ✅ 93% adoption (consistent with Wave 1) |
| **Wireless Adoption** | >85% | **93%** | ✅ Exceeded |
| **User Satisfaction** | >90% | **93%** | ✅ Exceeded (improved from Wave 1: 91% → 93%) |
| **P1 Incidents** | 0 | **0** | ✅ Zero critical issues |
| **Timeline** | 22 weeks | **21 weeks** | ✅ 1 week ahead (efficiency gains) |
| **Budget** | $6.8M | **$6.5M** | ✅ Under budget ($300K savings) |

**Cumulative Progress (After Wave 2):**
- Total sites: 18 of 19 (95%)
- Total APs: 1,057 of 1,220 (87%)
- Total users: 11,826 of 14,920 (79%)
- Cumulative wireless adoption: 75% ✓ (on track for 85% target)

---

## 10.4 Wave 3 Deployment (Q2 2026, Week 53-65)

### 10.4.1 Wave 3 Sites Overview

**5 Sites, 155 WiFi 7 APs, 2,580 Users:**

| Site | Location | Size (sq ft) | Users | APs Deployed | Legacy APs Replaced | Go-Live Week |
|------|----------|-------------|-------|--------------|---------------------|--------------|
| **Mexico City Branch** | Mexico City, MX | 30,000 | 450 | 30 | 20 (WiFi 5) | Week 55 |
| **São Paulo Branch** | São Paulo, BR | 35,000 | 520 | 35 | 25 (WiFi 6) | Week 57 |
| **Johannesburg Branch** | Johannesburg, ZA | 25,000 | 380 | 25 | 15 (WiFi 5) | Week 59 |
| **Dubai Branch** | Dubai, UAE | 40,000 | 620 | 40 | 30 (WiFi 6) | Week 61 |
| **Seoul Branch** | Seoul, KR | 30,000 | 610 | 25 | 20 (WiFi 6) | Week 63 |
| **TOTAL** | 5 sites | 160,000 | **2,580** | **155** | **110** | **13 weeks** |

---

### 10.4.2 Wave 3 Characteristics (Branch Sites)

**Branch Site Considerations:**

```yaml
Difference from Wave 1-2 (HQ/Regional Sites):
  1. Smaller Scale: 25-40 APs per site (vs 50-90 APs in HQ sites)
  2. Single-Floor: Most branches are 1-2 floors (vs 3-5 floors in HQ)
  3. Faster Deployment: 2-week timeline per site (vs 3-week in Wave 1-2)
  4. Lower User Count: 380-620 users (vs 680-1,200 in Wave 1-2)

Branch-Specific Challenges:
  1. Limited On-Site IT: Branches have 1-2 IT staff (vs 10-15 in HQ)
     Solution: Remote support from HQ NOC, pre-configured APs (plug-and-play)
  
  2. Language Barriers: Some branches (Mexico City, São Paulo) non-English
     Solution: Translated training materials (Spanish, Portuguese)
  
  3. Time Zone Coordination: 5 sites across 5 time zones (UTC-6 to UTC+9)
     Solution: Staggered go-live times (local business hours)
  
  4. Infrastructure Limitations: Older buildings (power, cooling)
     Solution: Pre-deployment site audits, PoE++ switch upgrades if needed
```

---

### 10.4.3 Wave 3 Timeline (13 Weeks)

**Aggressive Timeline (2 Weeks Per Site):**

```
Week:    53  55  57  59  61  63  65
         │   │   │   │   │   │   │
Mexico City: [══════]
         │   │Prep│Install│Test│Migrate│
São Paulo:   │   [══════]
             │   │   │Prep│Install│Test│Migrate│
Johannesburg:│   │   [══════]
                 │   │   │Prep│Install│Test│Migrate│
Dubai:           │   │   [══════]
                     │   │   │Prep│Install│Test│Migrate│
Seoul:               │   │   [══════]
                         │   │   │Prep│Install│Test│Migrate│

2-week cycle per site (faster than Wave 1-2 due to smaller scale)
Total Wave 3 duration: 13 weeks (Week 53-65)
```

---

### 10.4.4 Wave 3 Success Metrics

**Wave 3 Completion (Week 65):**

| Metric | Target | Result | Status |
|--------|--------|--------|--------|
| **Sites Deployed** | 5 | **5** | ✅ Complete |
| **APs Operational** | 155 | **153** | ⚠️ 2 APs RMA'd (hardware failure, 1.3% failure rate) |
| **Users Migrated** | 2,580 | **2,400** | ✅ 93% adoption (consistent across all waves) |
| **Wireless Adoption** | >85% | **93%** | ✅ Exceeded |
| **User Satisfaction** | >90% | **94%** | ✅ Exceeded (highest of all waves) |
| **P1 Incidents** | 0 | **0** | ✅ Zero critical issues |
| **Timeline** | 13 weeks | **12 weeks** | ✅ 1 week ahead (efficiency gains) |
| **Budget** | $2.1M | **$2.0M** | ✅ Under budget ($100K savings) |

**Final Cumulative Progress (After Wave 3):**
- Total sites: **19 of 19 (100%)** ✅ Complete
- Total APs: **1,210 of 1,220 (99%)** ⚠️ 10 APs RMA'd (acceptable 0.8% failure rate)
- Total users: **14,226 of 14,920 (95%)** ✅ Exceeded target
- Cumulative wireless adoption: **85%** ✅ Target achieved

---

## 10.5 Post-Rollout Optimization (Phase 5C, Week 66-104)

### 10.5.1 Phase 5C Objectives

**Post-Deployment Optimization (38 Weeks):**

```yaml
Goal: Optimize WiFi 7 infrastructure, decommission legacy wired infrastructure

Phase 5C Activities:
  1. RF Optimization (Week 66-70, 5 weeks)
     • DNAC RRM fine-tuning (all 1,210 APs)
     • Eliminate channel interference (move to cleaner channels)
     • Optimize transmit power (reduce overlap, improve SNR)
  
  2. Legacy AP Decommissioning (Week 71-78, 8 weeks)
     • Remove 450 legacy WiFi 5/6 APs (returned to inventory)
     • Update DNAC inventory (remove decommissioned APs)
     • Physical removal (coordinate with facilities)
  
  3. Access Switch Consolidation (Week 79-95, 17 weeks)
     • Decommission 178 access switches (330 → 152 switches)
     • Repurpose switches (spare pool or secondary sites)
     • Update DNAC fabric topology
  
  4. Wired Port Decommissioning (Week 96-100, 5 weeks)
     • Disable 8,490 wired ports (switch port shutdown)
     • Document remaining 7,350 active wired ports
     • Update IPAM (IP address management)
  
  5. Final Documentation (Week 101-104, 4 weeks)
     • Update network diagrams (as-built)
     • Document lessons learned (all 3 waves)
     • Create runbooks (WiFi 7 operations)
     • Project closeout (final report to CTO)
```

---

### 10.5.2 Switch Consolidation Plan

**Before Phase 5 (Wired-First):**

```yaml
Infrastructure:
  • Access Switches: 330 switches (Catalyst 2960-X, 3650)
  • Active Ports: 15,840 ports (48 ports/switch × 330 switches)
  • Utilization: 48% (7,550 active devices)
  • PoE Consumption: 450W avg per switch (148.5 kW total)

Cost:
  • CapEx: $3.2M (replacement cost if refreshed)
  • OpEx: $420K/year (power, cooling, maintenance)
```

**After Phase 5C (Wireless-First):**

```yaml
Infrastructure:
  • Access Switches: 152 switches (54% reduction)
  • Active Ports: 7,350 ports (wired-only devices + 20% spare)
  • Utilization: 48% (3,530 active devices, same utilization %)
  • PoE Consumption: 450W avg per switch (68.4 kW total, 54% reduction)

Decommissioned:
  • 178 switches removed (returned to inventory/spare pool)
  • 8,490 ports freed (54% reduction)

Savings:
  • CapEx Savings: $3.2M (avoided switch refresh, 5-year lifecycle)
  • OpEx Savings: $420K/year × 54% = $227K/year (power, cooling)
  • ROI: CapEx savings alone justifies WiFi 7 investment ✓
```

---

### 10.5.3 Phase 5C Success Metrics

**Phase 5C Completion (Week 104):**

| Metric | Target | Result | Status |
|--------|--------|--------|--------|
| **RF Optimization** | 100% APs optimized | **100%** | ✅ Complete |
| **Legacy APs Removed** | 450 | **447** | ⚠️ 3 APs retained (IoT compatibility) |
| **Switches Decommissioned** | 178 | **176** | ⚠️ 2 switches retained (critical wired devices) |
| **Wired Ports Freed** | 8,490 | **8,394** | ⚠️ 96 ports retained (user requests) |
| **Power Savings** | 80 kW | **79 kW** | ✅ Met (54% reduction) |
| **Documentation Complete** | 100% | **100%** | ✅ Complete |

---

## 10.6 Rollout Summary & Lessons Learned

### 10.6.1 Overall Phase 5 Metrics (Week 1-104)

**Complete Phase 5 Journey:**

| Metric | Initial (Pre-Phase 5) | Final (Post-Phase 5C) | Change | Status |
|--------|----------------------|----------------------|--------|--------|
| **Wireless Adoption** | 30% (BYOD/guest) | **85%** (corporate) | +55% | ✅ Target achieved |
| **WiFi 7 APs Deployed** | 0 | **1,210** | +1,210 | ✅ Complete |
| **Legacy APs Decommissioned** | N/A | **447** | -447 | ✅ Retired |
| **Access Switches** | 330 | **152** | -178 (-54%) | ✅ Consolidated |
| **Active Wired Ports** | 15,840 | **7,350** | -8,490 (-54%) | ✅ Reduced |
| **Power Consumption** | 148.5 kW | **68.4 kW** | -80 kW (-54%) | ✅ Reduced |
| **User Satisfaction** | 65% (WiFi 6) | **94%** (WiFi 7) | +29% | ✅ Exceeded |
| **Wireless Throughput** | 1.2 Gbps (WiFi 6) | **4.5 Gbps** (WiFi 7) | +3.3 Gbps | ✅ Exceeded |

---

### 10.6.2 Top 10 Lessons Learned

**Across All Phases (5A, 5B Waves 1-3, 5C):**

```yaml
Lesson 1: Pilot is Essential (Phase 5A)
  • What: 16-week pilot validated all 3 use cases before production rollout
  • Impact: Zero P1 incidents in production (all issues discovered/fixed in pilot)
  • Recommendation: Always pilot new technology (minimum 10% of target deployment)

Lesson 2: User Communication is Critical (Chapter 6)
  • What: 3-week advance notice (T-21, T-14, T-7) reduced user resistance
  • Impact: 93% voluntary wireless adoption (target: 85%)
  • Recommendation: Over-communicate (email + Slack + manager briefings + town halls)

Lesson 3: On-Site Support Reduces Helpdesk Tickets (Chapter 6)
  • What: Roaming IT technicians on migration days (vs central helpdesk only)
  • Impact: 95% of issues resolved within 10 minutes (vs 30+ min remote support)
  • Recommendation: Budget for on-site support (1 technician per 100 users)

Lesson 4: Rollback Plan Builds Trust (Chapter 6)
  • What: 7-day opt-out option (users can revert to wired if unsatisfied)
  • Impact: Only 7% rolled back (lower than expected 10-15%)
  • Recommendation: Offer rollback option (increases trust, reduces anxiety)

Lesson 5: Phased Rollout Reduces Risk (Chapter 10)
  • What: 3-wave approach (Wave 1: large sites, Wave 2: medium, Wave 3: small)
  • Impact: Lessons learned from Wave 1 improved Wave 2-3 efficiency (25% faster)
  • Recommendation: Never "big bang" (phase rollout over 12-18 months)

Lesson 6: Automation Accelerates Deployment (Chapter 9)
  • What: AgenticOps auto-configured APs, auto-disabled wired ports
  • Impact: 40% faster deployment (vs manual configuration)
  • Recommendation: Invest in automation (Python scripts, DNAC APIs, AgenticOps)

Lesson 7: Real-Time Dashboards Improve Visibility (Chapter 8)
  • What: Splunk "Wave 2 Migration Progress" dashboard (real-time)
  • Impact: Project managers detected issues 5× faster (vs email updates)
  • Recommendation: Create migration dashboards (Splunk, Grafana, Tableau)

Lesson 8: Pre-Staging Reduces Installation Time (Chapter 10)
  • What: Pre-configure APs in IDF (bench testing, labeling, DNAC provisioning)
  • Impact: 30% faster installation (vs configure after mounting)
  • Recommendation: Pre-stage all equipment (reduces on-site time)

Lesson 9: Budget Contingency for Hardware Failures (Chapter 10)
  • What: 1% AP failure rate (12 APs RMA'd out of 1,220)
  • Impact: Budget included 5% contingency (sufficient for RMAs + spares)
  • Recommendation: Budget 5-10% contingency for hardware failures

Lesson 10: Celebrate Success (Chapter 10)
  • What: After Wave 3 completion, company-wide email from CTO celebrating team
  • Impact: Boosted morale, recognized 2-year effort
  • Recommendation: Celebrate milestones (pilot completion, Wave 1 go-live, final completion)
```

---

### 10.6.3 ROI Summary

**Phase 5 Return on Investment:**

```yaml
Total Investment (CapEx):
  • WiFi 7 APs: $1,210 × $1,200 = $1.45M
  • WLC HA pair: $250K
  • Fabric upgrades: $500K (10G uplinks, PoE++ switches)
  • Professional services: $800K (Cisco deployment, TAC support)
  • Internal labor: $1.2M (network team, 2 years × 3 FTEs)
  • TOTAL CapEx: $4.2M

Cost Savings (Benefits):
  • Switch refresh avoided: $3.2M (330 switches × $10K, 5-year lifecycle)
  • OpEx savings (power): $227K/year × 5 years = $1.14M
  • OpEx savings (cooling): $100K/year × 5 years = $500K
  • OpEx savings (maintenance): $50K/year × 5 years = $250K
  • TOTAL Savings: $5.09M (over 5 years)

ROI Calculation:
  • Net Benefit: $5.09M - $4.2M = $890K
  • ROI: ($890K / $4.2M) × 100% = 21% (5-year ROI)
  • Payback Period: 4.1 years (CapEx / annual savings)

Intangible Benefits (Not Quantified):
  • User productivity: 4× faster WiFi (4.5 Gbps vs 1 Gbps wired)
  • Agility: Office reconfigurations 3-5 weeks faster (no re-cabling)
  • Executive satisfaction: 94% prefer wireless-only workspace
  • Innovation: Edge AI cameras enabled (real-time security)
```
