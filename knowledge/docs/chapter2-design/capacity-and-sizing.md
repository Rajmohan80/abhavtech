# Capacity and Sizing - Consolidation Guide

## 1. Overview

**Purpose:** This document consolidates ALL capacity planning information across Webex Contact Center components. Rather than duplicate existing detailed content, this serves as a **master reference guide** pointing to comprehensive capacity planning already documented, while adding NEW capacity considerations for AI/automation and storage.

### Document Strategy

**This document provides:**
- ✅ **Quick reference** to existing detailed capacity planning (with links)
- ✅ **NEW detailed content** for AI/automation capacity (not covered elsewhere)
- ✅ **NEW detailed content** for storage capacity planning
- ✅ **Consolidated view** of all capacity requirements in one place

### Use This Document To:
1. Get a complete picture of ALL capacity requirements
2. Find where detailed capacity planning is documented
3. Understand AI/automation capacity considerations (new)
4. Plan storage and retention capacity (new)


## 1. Overview

**Purpose:** Master reference for ALL capacity planning across Webex Contact Center. This document:
- 📍 **References existing detailed capacity planning** (avoids duplication)
- 📝 **Provides NEW content** for AI/automation, storage, and IVR capacity
- 🎯 **Consolidates** all capacity requirements in one place

---

## 2. Capacity Planning Quick Reference

### 2.1 Voice/Telephony Capacity COVERED EXTENSIVELY

**📍 See:** **[cube-and-sbc-design.md - Section 4](cube-and-sbc-design.md#4-cube-session-capacity-planning-and-sizing)** (380 lines, most comprehensive)

**What's Covered:**
- ✅ CUBE session capacity formulas
- ✅ Encryption impact calculations (TLS+SRTP = ÷3 capacity)
- ✅ **Example: 1,000 agents → 6,084 sessions required**
- ✅ Hardware sizing: 2× ASR 1002-HX (7,000 sessions total)
- ✅ Reusing existing CUBE decision matrix
- ✅ Session sizing worksheet
- ✅ PSTN trunk capacity

**Quick Summary:**
```
Formula: ((Agents × 2) + Queue Calls) × 3 (encryption buffer)
Example: ((1,000 × 2) + 70) × 3 = 6,210 sessions
Hardware: 2× Cisco ASR 1002-HX = 7,000 sessions
Headroom: 13% buffer for growth
```

---

### 2.2 Network Bandwidth Capacity COVERED EXTENSIVELY

**📍 See:** **[network-architecture.md - Section 11](network-architecture.md#11-capacity-planning-and-growth-projections)** (Network capacity planning)

**What's Covered:**
- ✅ Internet circuit sizing (dual ISP, 500 Mbps each)
- ✅ Voice bandwidth: **87 Mbps for 1,000 concurrent calls** (G.711 codec)
- ✅ Video bandwidth: 75 Mbps for 50 sessions
- ✅ Agent desktop: 500 Mbps for 1,000 agents
- ✅ QoS headroom and oversubscription
- ✅ Home agent bandwidth requirements
- ✅ Capacity growth planning table

**Quick Summary:**
```
Total Required for 1,000 Agents:
├─ Voice:    87 Mbps  (1,000 calls @ G.711)
├─ Video:    75 Mbps  (50 concurrent sessions)
├─ Desktop: 500 Mbps  (1,000 agents @ 0.5 Mbps)
├─ Mgmt:     20 Mbps  (monitoring, management)
└─ TOTAL:   682 Mbps → Provision: 1,000 Mbps (dual 500 Mbps ISPs)
```

---

### 2.3 Agent Licensing Capacity COVERED

**📍 See:** **[assumptions-and-dependencies.md - Section 4.2](assumptions-and-dependencies.md#42-license-procurement)** (License requirements)

**What's Covered:**
- ✅ License requirements table (Premium, Standard, Supervisor)
- ✅ 1,000 Premium agents @ $120/user/month
- ✅ 50 Supervisors @ $90/user/month  
- ✅ 1,000 Webex Calling @ $25/user/month
- ✅ Recording storage: 500 hours/month @ $0.10/hour
- ✅ CUBE session license: 2,000 sessions (one-time)
- ✅ Total annual cost: ~$1,850,000

**Quick Summary:**
```
Agent Capacity Planning:
├─ Current:     1,000 agents
├─ Design:      1,300 agents (30% growth buffer)
├─ Peak:          700 concurrent (70% occupancy)
└─ Licenses:    1,050 (buffer for training, attrition)
```

---

### 2.4 Agent Capacity by Location COVERED

**📍 See:** **[design-principles.md - Section 4.1](design-principles.md#41-agent-capacity-planning)** (Agent capacity)

**What's Covered:**
- ✅ Current: 1,000 agents across 3 locations
- ✅ Design capacity: 1,300 agents (30% buffer)
- ✅ Location breakdown:
  - Hyderabad: 600 agents
  - Austin: 300 agents
  - London: 100 agents

---

## 3. IVR Capacity Planning (NEW CONTENT)

### 3.1 Traditional IVR Port Capacity

**IVR Port Sizing Formula:**
```
IVR Ports = (Call Arrival Rate × Avg IVR Duration) / 60

Example:
- Calls per hour: 1,200
- Avg IVR time: 90 seconds (1.5 minutes)
- Required ports: (1,200 × 1.5) / 60 = 30 IVR ports
- With 20% buffer: 36 ports
```

**Webex Connect Pricing Model:**
- Pay-per-use (no fixed port licensing)
- Concurrent session-based
- Elastic scaling (cloud-native)

### 3.2 Speech Recognition (ASR) Capacity

**Concurrent Speech Sessions:**
```
For 1,000-agent deployment:
├─ Peak IVR calls:           300 concurrent (30% of agents)
├─ Speech-enabled calls:     60% use ASR = 180 sessions
├─ With buffer (20%):        216 concurrent ASR sessions
└─ Provider: Google Speech-to-Text (1,000 streams/region)
```

**Google Speech-to-Text Quotas:**
| Quota Type | Default Limit | Recommended for 1,000 Agents |
|------------|---------------|------------------------------|
| Concurrent streaming requests | 100/region | Request increase to 250 |
| Synchronous requests/min | 1,000 | Sufficient |
| Total audio minutes/day | Unlimited | ~10,800 minutes/day |

**Cost Estimate:**
- Standard model: $0.006/15 seconds = $0.024/minute
- 180 concurrent × 2 min avg × 60 min/hour × 12 hours = 259,200 minutes/day
- Daily cost: 259,200 × $0.024 = **$6,221/day** or **$186K/month**

### 3.3 IVR Database Query Capacity

**Backend Integration Load:**
```
For account lookup IVR flows:
├─ IVR calls/hour:           1,200
├─ DB queries per call:      2 (lookup + verification)
├─ Total queries/hour:       2,400
├─ Peak queries/second:      0.67 QPS
└─ Database capacity:        Need <100ms response time
```

**Recommendations:**
- Database connection pool: 50 connections
- Query timeout: 5 seconds
- Caching for frequent lookups (reduce DB load)

---

## 4. AI and Automation Capacity Planning (NEW CONTENT)

### 4.1 Virtual Agent (Chatbot) Capacity

**Concurrent Bot Sessions:**
```
For 1,000-agent contact center:
├─ Digital deflection target:    30% of calls
├─ Peak calls/hour:               1,500
├─ Deflected to bot:              450 calls/hour
├─ Avg session duration:          4 minutes
├─ Concurrent bot sessions:       450 × (4/60) = 30 sessions
├─ With growth buffer (50%):      45 concurrent sessions
└─ Dialogflow CX capacity:        Sufficient (scales automatically)
```

**Dialogflow CX Quotas:**
| Quota | Default | Required for 1,000 Agents | Action |
|-------|---------|---------------------------|--------|
| Requests/minute | 600/project | ~100/min (peak) | Sufficient |
| Active sessions | 1,000 | 45 concurrent | Sufficient |
| Projects | 50 | 1-3 (dev/test/prod) | Sufficient |
| Maximum session length | 30 minutes | 10 min avg | Sufficient |

**Cost Estimate (Dialogflow CX):**
- Text requests: $0.007/request
- 450 sessions/hour × 10 requests/session = 4,500 requests/hour
- Monthly: 4,500 × 12 hours × 22 days = 1.2M requests
- Cost: 1.2M × $0.007 = **$8,400/month**

### 4.2 Natural Language Understanding (NLU) API Capacity

**Intent Detection Load:**
```
Voice + Chat + Email combined:
├─ Voice IVR (NLU):              180 concurrent sessions
├─ Chatbot:                      45 concurrent sessions
├─ Email auto-classification:    50 emails/hour = 0.014 concurrent
├─ Total NLU requests/min:       ~90/min (peak)
└─ Quota needed:                 600/min (default sufficient)
```

**Dialogflow CX Rate Limits:**
- Default: 600 requests/minute/project
- Recommended: Request increase to 1,000/min for production
- Burst handling: Cloud-native auto-scaling

### 4.3 Real-Time Call Transcription Capacity

**Live Transcription for Agent Assist:**
```
Selective transcription strategy:
├─ Total concurrent calls:        700 (70% of 1,000 agents)
├─ Transcribe high-value calls:   20% = 140 calls
├─ Provider: Google Speech-to-Text (streaming)
├─ Quota needed:                  1,000 concurrent streams/region
└─ Status: Within quota limits
```

**Cost Estimate (Real-Time Transcription):**
- Enhanced model: $0.009/15 seconds = $0.036/minute
- 140 calls × 8 min AHT × 60 min/hour × 12 hours = 806,400 minutes/day
- Daily cost: 806,400 × $0.036 = **$29,030/day** or **$871K/month**

**💡 Recommendation:** Start with 50 calls (10%) to control costs

### 4.4 Sentiment Analysis Capacity

**Post-Call Sentiment Analysis:**
```
Analyze all calls (batch processing):
├─ Daily calls:                   10,000 calls
├─ Transcription required:        10,000 calls × 8 min = 80,000 min
├─ Sentiment analysis:            10,000 API calls
├─ Provider: Google Natural Language API
└─ Processing time:               ~6 hours (batch overnight)
```

**Google Natural Language API Quotas:**
| Quota | Default | Required | Status |
|-------|---------|----------|--------|
| Requests/minute | 600 | ~100/min (batch) | Sufficient |
| Requests/day | 800,000 | 10,000/day | Sufficient |

**Cost Estimate:**
- Sentiment analysis: $1.00/1,000 text records
- 10,000 calls/day = 10,000 records
- Daily cost: 10,000 × $1.00/1,000 = **$10/day** or **$300/month**

### 4.5 Agent Assist - Knowledge Base Capacity

**Real-Time Knowledge Searches:**
```
Agent assist during calls:
├─ Concurrent calls:              700 (70% of agents)
├─ Knowledge searches/call:       3 searches
├─ Calls with searches:           30% = 210 calls
├─ Total searches/hour:           210 × 3 = 630 searches/hour
├─ Searches/minute:               10.5/min
└─ Search latency required:       <2 seconds
```

**Webex Agent Answers Capacity:**
- Cloud-based (Cisco-managed)
- Scales automatically
- No explicit capacity limits
- Charged per agent license

**Knowledge Base Size:**
- Articles: 5,000-10,000 articles
- Index size: ~500 MB
- Search index: Elasticsearch (cloud-hosted)

### 4.6 Post-Call Analytics - Batch Processing

**Speech Analytics Platform Capacity:**
```
For CallMiner/NICE/Verint:
├─ Daily recordings:              10,000 calls
├─ Avg call length:               8 minutes
├─ Total audio:                   80,000 minutes/day = 1,333 hours
├─ Processing speed:              Real-time × 10 (10 min audio = 1 min processing)
├─ Required capacity:             133 hours processing/day = 5.5 hours actual
└─ Batch window:                  Overnight (12 hours) - Sufficient
```

**Storage for Analytics:**
- Audio recordings: 1.6 TB/day (64 kbps × 10,000 calls × 8 min)
- Transcripts: 200 GB/day (text)
- Metadata: 50 GB/day
- **Total: 1.85 TB/day** or **56 TB/month**

### 4.7 AI/ML Model Training Capacity

**Training Data Volume:**
```
For predictive routing model:
├─ Training dataset:              100,000 historical calls
├─ Features per call:             50 attributes (duration, sentiment, outcome, etc.)
├─ Dataset size:                  ~5 GB
├─ Retraining frequency:          Weekly
├─ Training duration:             2-4 hours
└─ Compute: Cloud ML (Google AI Platform or AWS SageMaker)
```

**Cost Estimate (Model Training):**
- Google AI Platform: $2.50/hour (training)
- Weekly training: 4 hours × $2.50 = $10/week
- Monthly cost: **$40/month**

### 4.8 API Rate Limits Summary (Critical!)

**Third-Party AI Service Limits:**

| Service | Default Quota | Required for 1,000 Agents | Action Needed |
|---------|---------------|---------------------------|---------------|
| **Dialogflow CX** | 600 req/min | 100 req/min | ✅ Sufficient |
| **Google Speech-to-Text** | 100 concurrent streams/region | 250 streams | 🔴 Request increase |
| **Google Natural Language** | 600 req/min | 100 req/min | ✅ Sufficient |
| **OpenAI GPT (if used)** | 3,500 tokens/min | Varies | 🟡 Monitor usage |
| **Webex Connect APIs** | 1,000 req/min | 200 req/min | ✅ Sufficient |

**💡 Key Action Items:**
1. **Request Google Speech-to-Text quota increase** to 250-300 concurrent streams
2. Monitor Dialogflow CX usage and request increase if approaching 600 req/min
3. Implement rate limiting and retry logic in all AI integrations
4. Set up quota monitoring alerts (at 70% threshold)

### 4.9 AI Capacity Cost Summary

**Monthly AI/Automation Costs (1,000-agent deployment):**

| Component | Monthly Cost | Annual Cost |
|-----------|--------------|-------------|
| IVR Speech Recognition (ASR) | $186,000 | $2,232,000 |
| Real-Time Transcription (10% calls) | $87,100 | $1,045,200 |
| Dialogflow CX (Chatbot) | $8,400 | $100,800 |
| Sentiment Analysis (post-call) | $300 | $3,600 |
| Model Training | $40 | $480 |
| **TOTAL** | **$281,840** | **$3,382,080** |

**💡 Cost Optimization:**
- Start with 10-20% call transcription (not 100%)
- Use batch processing instead of real-time where possible
- Implement caching for frequent queries
- Use standard ASR models (vs enhanced) where accuracy permits

---

## 5. Storage Capacity Planning (NEW CONTENT)

### 5.1 Call Recording Storage

**Storage Calculation:**
```
For 1,000-agent deployment:
├─ Daily calls:                   10,000 calls
├─ Avg call duration:             8 minutes
├─ Recording format:              64 kbps compressed audio
├─ Daily storage:                 10,000 × 8 min × 64 kbps = 1.6 TB/day
├─ Monthly storage:               1.6 TB × 22 days = 35.2 TB/month
├─ Retention policy:              90 days (compliance)
└─ Total required:                35.2 TB × 3 = 105.6 TB
```

**Storage Tiers:**
| Tier | Retention | Access | Storage Type | Cost/TB/Month |
|------|-----------|--------|--------------|---------------|
| Hot | 0-30 days | Instant | SSD | $20 |
| Warm | 31-90 days | <1 min | HDD | $10 |
| Cold | 91-365 days | <1 hour | Archive | $2 |

**Cost Estimate:**
- Hot (35 TB): 35 × $20 = $700
- Warm (70 TB): 70 × $10 = $700
- Total: **$1,400/month** for call recordings

### 5.2 Transcript Storage

**Transcript Storage Calculation:**
```
Text transcripts (AI-generated):
├─ Daily transcripts:             10,000 calls
├─ Avg transcript size:           20 KB (8 min call, ~2,400 words)
├─ Daily storage:                 10,000 × 20 KB = 200 MB/day
├─ Monthly storage:               200 MB × 22 = 4.4 GB/month
├─ Retention:                     90 days
└─ Total required:                4.4 GB × 3 = 13.2 GB
```

**Cost:** Negligible (~$0.26/month for 13 GB)

### 5.3 Historical Reporting Data

**Analyzer Historical Data:**
```
Webex Analyzer data retention:
├─ Real-time data:                24 hours (in-memory)
├─ Historical reports:            13 months (Cisco-managed cloud)
├─ Custom exports:                Store locally if >13 months needed
├─ Estimated data size:           500 GB/year
└─ Storage: Included in Webex license (Cisco-managed)
```

**Custom Data Warehouse (if needed):**
- Export daily: 100 MB/day compressed
- Annual storage: 36 GB/year
- 5-year retention: 180 GB
- Cost: ~$3.60/month (cold storage)

### 5.4 System Logs and Audit Logs

**Log Storage:**
```
CUBE, Flow Designer, Integration logs:
├─ CUBE logs:                     50 MB/day
├─ Flow Designer logs:            100 MB/day
├─ Integration logs:              200 MB/day
├─ Webex CC platform logs:        Cisco-managed (included)
├─ Total custom logs:             350 MB/day = 7.7 GB/month
├─ Retention (audit):             365 days
└─ Total required:                7.7 GB × 12 = 92.4 GB
```

**Cost:** ~$1.85/month (cold storage)

### 5.5 Backup and Disaster Recovery Storage

**Configuration Backups:**
```
Daily backups of:
├─ Flow Designer flows:           50 MB
├─ Queue/routing configs:         10 MB
├─ Agent profiles:                5 MB
├─ Total per backup:              65 MB
├─ Daily backups × 90 days:       65 MB × 90 = 5.85 GB
└─ Geo-redundant storage:         5.85 GB × 2 = 11.7 GB
```

**Cost:** ~$0.23/month

### 5.6 Storage Capacity Summary

**Total Storage Requirements (1,000-agent deployment):**

| Storage Type | Size | Retention | Monthly Cost | Annual Cost |
|--------------|------|-----------|--------------|-------------|
| Call Recordings | 105 TB | 90 days | $1,400 | $16,800 |
| Transcripts | 13 GB | 90 days | $0.26 | $3 |
| Historical Data | 36 GB/year | 5 years | $3.60 | $43 |
| System Logs | 92 GB | 365 days | $1.85 | $22 |
| Backups | 12 GB | 90 days | $0.23 | $3 |
| **TOTAL** | **~105 TB** | **Mixed** | **$1,406** | **$16,871** |

**📍 Also see:** **[dr-and-resiliency.md](dr-and-resiliency.md)** for backup and DR storage strategies

---

## 6. Integration API Capacity

### 6.1 CRM Integration (Salesforce)

**API Call Volume:**
```
Screen pop and activity logging:
├─ Concurrent calls:              700
├─ Screen pop (inbound):          1 API call/call = 700 calls/hour
├─ Activity logging:              2 API calls/call = 1,400 calls/hour
├─ Total API calls/hour:          2,100 calls/hour
├─ API calls/minute:              35/min
└─ Salesforce limit:              100,000 API calls/day (Enterprise)
```

**Status:** ✅ Well within Salesforce limits

### 6.2 Workforce Management (WFM) Integration

**Data Sync Volume:**
```
Real-time adherence sync:
├─ Agent state updates:           Every 30 seconds
├─ Agents monitored:              1,000
├─ Updates per hour:              1,000 × (60/0.5) = 120,000 updates/hour
├─ API calls (batched):           120,000 / 100 = 1,200 API calls/hour
└─ Calabrio API limit:            No documented limit (cloud-native)
```

---

## 7. Capacity Monitoring and Alerting

### 7.1 Capacity Monitoring Thresholds

**Set alerts at these thresholds:**

| Component | Warning (%) | Critical (%) | Action |
|-----------|-------------|--------------|--------|
| CUBE sessions | 70% | 85% | Add CUBE capacity |
| Network bandwidth | 70% | 85% | Upgrade circuits |
| Storage (call recordings) | 75% | 90% | Add storage tier |
| AI API quotas | 70% | 85% | Request quota increase |
| Database connections | 70% | 85% | Scale database |

### 7.2 Capacity Planning Review Cadence

**Regular reviews:**
- **Weekly:** During initial migration (first 3 months)
- **Monthly:** First year post-migration
- **Quarterly:** Ongoing steady-state

---

## 8. Growth Planning and Scaling

### 8.1 3-Year Capacity Projection

**Assumed growth: 15% annually**

| Year | Agents | CUBE Sessions | Bandwidth | Storage (Monthly) | AI Costs (Monthly) |
|------|--------|---------------|-----------|-------------------|--------------------|
| Y1 | 1,000 | 6,084 | 682 Mbps | 105 TB | $281,840 |
| Y2 | 1,150 (+15%) | 6,997 | 784 Mbps | 121 TB | $324,116 |
| Y3 | 1,323 (+15%) | 8,046 | 902 Mbps | 139 TB | $372,733 |

**Key Scaling Decisions:**
- **Year 2:** Add 3rd CUBE (reach 10,500 total sessions)
- **Year 2:** Upgrade internet to 750 Mbps per circuit
- **Year 3:** Review storage tier strategy (move to cheaper cold storage)

---

## 9. Capacity Planning Tools

### 9.1 Available Calculators

**Use these tools for capacity planning:**

1. **CUBE Session Calculator** → See cube-and-sbc-design.md Section 4.6
2. **Network Bandwidth Calculator** → See network-architecture.md Section 11.3
3. **AI Cost Estimator** → Use Google Cloud Pricing Calculator
4. **Storage Cost Calculator** → AWS S3 Pricing Calculator or equivalent

### 9.2 Capacity Planning Spreadsheet

**Request from architecture team:**
- Excel workbook with all formulas
- Input: # of agents, growth %, usage patterns
- Output: All capacity requirements and costs

---

## 10. Summary and Recommendations

### 10.1 Critical Capacity Actions

**Must complete before go-live:**

1. ✅ **CUBE Capacity:** Verified in cube-and-sbc-design.md (2× ASR 1002-HX)
2. ✅ **Network Bandwidth:** Verified in network-architecture.md (dual 500 Mbps)
3. ✅ **Agent Licensing:** Verified in assumptions-and-dependencies.md (1,050 licenses)
4. 🔴 **Google Speech-to-Text Quota:** Request increase to 250-300 concurrent streams
5. 🟡 **Storage:** Provision 120 TB (20% buffer) for call recordings
6. 🟡 **AI Cost Budget:** Allocate $280-300K/month for AI services

### 10.2 Capacity Planning Success Factors

**Keys to successful capacity planning:**
- ✅ Use actual traffic data (not just estimates)
- ✅ Include 20-30% buffer for peaks and growth
- ✅ Monitor capacity utilization from Day 1
- ✅ Plan for 3-year growth (not just initial deployment)
- ✅ Set up automated alerts at 70% thresholds
- ✅ Review capacity quarterly

---

## 11. Document Cross-References

### Detailed Capacity Planning (Existing Docs)

| Topic | Document | Section |
|-------|----------|---------|
| **CUBE Sessions** | cube-and-sbc-design.md | Section 4 (380 lines) |
| **Network Bandwidth** | network-architecture.md | Section 11 |
| **Agent Licensing** | assumptions-and-dependencies.md | Section 4.2 |
| **Agent Capacity** | design-principles.md | Section 4.1 |
| **DR Storage** | dr-and-resiliency.md | Section 8 |

### New Content (This Document)

| Topic | Section |
|-------|---------|
| **IVR Capacity** | Section 3 |
| **AI/Automation Capacity** | Section 4 (most comprehensive) |
| **Storage Capacity** | Section 5 |
| **Integration APIs** | Section 6 |

---
