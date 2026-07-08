# 7.2 WxCC Migration Timeline

## 7.2.1 Overall Schedule

```
   WXCC MIGRATION - OVERALL TIMELINE
   WEEK   PHASE   ACTIVITIES
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   Week 1-2   PREPARATION   Training curriculum development
   Sandbox environment setup
   Final Chapter 6 validation
   Cutover runbook finalization
   Week 3-4   TRAINING   Wave 1 agent training (Chennai)
   (Wave 1)   Supervisor training
   UAT with business SMEs
   Week 5   WAVE 1 CUTOVER   Chennai (30 agents)
   (Pilot)   Weekend cutover
   5-day stabilization
   Week 6   TRAINING   Wave 2 agent training (London, NJ)
   (Wave 2)
   Week 7   WAVE 2 CUTOVER   London (15) + New Jersey (10)
   Weekend cutover
   5-day stabilization
   Week 8-9   TRAINING   Wave 3 agent training (Mumbai)
   (Wave 3)   120 agents - largest batch
   Week 10   WAVE 3 CUTOVER   Mumbai HQ (120 agents)
   (Final)   Weekend cutover
   24x7 operation - highest risk
   Week 11-12   HYPERCARE   Enhanced support
   Issue resolution
   Performance tuning
   Week 13   STABILIZATION   Handover to BAU operations
   UCCX decommission planning
   Project closure
```

## 7.2.2 Wave Migration Plan

| Wave | Site | Agents | Teams | Weekend | Risk Level |
|------|------|--------|-------|---------|------------|
| **Wave 1 (Pilot)** | Chennai | 30 | Chennai_Support, India_Digital_Team | Week 5 | LOW |
| **Wave 2** | London + New Jersey | 25 | EMEA_Team, Americas_Team | Week 7 | MEDIUM |
| **Wave 3** | Mumbai HQ | 120 | India_Sales, India_Support, India_TechSupport, India_Billing | Week 10 | HIGH |
| **TOTAL** | 4 Sites | **175** | 8 Teams | 3 Weekends | |

**Wave Selection Rationale:**

| Wave | Rationale |
|------|-----------|
| **Wave 1 - Chennai** | Lowest risk: 30 agents, 9AM-9PM hours (not 24x7), single timezone, provides pilot learnings |
| **Wave 2 - London/NJ** | Medium risk: 25 agents, business hours only, tests multi-region routing |
| **Wave 3 - Mumbai** | Highest risk: 120 agents, 24x7 operation, primary support hub - benefits from Wave 1/2 learnings |

## 7.2.3 Wave 1 Detailed Schedule (Chennai Pilot)

| Day | Date | Activity | Owner | Hours |
|-----|------|----------|-------|-------|
| **Pre-Week** | | | | |
| Mon-Fri | Week 3-4 | Agent training (30 agents) | Training Lead | 2hr/day |
| Fri | Week 4 | Training completion sign-off | Training Lead | - |
| Fri | Week 4 | Go/No-Go decision call | PM + Leads | 30 min |
| **Cutover Weekend** | | | | |
| Fri | 6:00 PM IST | Cutover start - UCCX disable | Voice Eng | - |
| Fri | 6:30 PM | Entry Point DNS/routing switch | Voice Eng | - |
| Fri | 7:00 PM | Agent Desktop login validation | CC Ops | - |
| Fri | 8:00 PM | Test calls (all scenarios) | QA | 1 hr |
| Fri | 9:00 PM | Issue resolution window | All | 3 hr |
| Sat | 9:00 AM | Day 1 Live - first customer calls | CC Ops | - |
| Sat | All day | Enhanced monitoring | Voice Eng + CC Ops | 12 hr |
| Sun | All day | Stabilization | Voice Eng | 12 hr |
| **Week 5 (Stabilization)** | | | | |
| Mon-Fri | Week 5 | Production monitoring | CC Ops | - |
| Fri | Week 5 | Wave 1 sign-off | CC Ops Manager | - |

## 7.2.4 Wave 2 Detailed Schedule (London + New Jersey)

| Day | Date | Activity | Owner | Hours |
|-----|------|----------|-------|-------|
| **Pre-Week** | | | | |
| Mon-Fri | Week 6 | Agent training (25 agents) | Training Lead | 2hr/day |
| Fri | Week 6 | Go/No-Go decision call | PM + Leads | 30 min |
| **Cutover Weekend** | | | | |
| Sat | 2:00 AM UTC | Cutover start (off-hours all regions) | Voice Eng | - |
| Sat | 2:30 AM | Entry Point routing switch (EMEA/US) | Voice Eng | - |
| Sat | 3:00 AM | Agent Desktop login validation | CC Ops | - |
| Sat | 4:00 AM | Test calls (EMEA + Americas flows) | QA | 1 hr |
| Sat | 9:00 AM UK | Day 1 Live - London | CC Ops | - |
| Sat | 9:00 AM ET | Day 1 Live - New Jersey | CC Ops | - |
| **Week 7 (Stabilization)** | | | | |
| Mon-Fri | Week 7 | Production monitoring | CC Ops | - |
| Fri | Week 7 | Wave 2 sign-off | CC Ops Manager | - |

## 7.2.5 Wave 3 Detailed Schedule (Mumbai HQ)

| Day | Date | Activity | Owner | Hours |
|-----|------|----------|-------|-------|
| **Pre-Week** | | | | |
| Week 8-9 | | Agent training (120 agents - 4 batches) | Training Lead | 2hr/day |
| Fri | Week 9 | Training completion sign-off | Training Lead | - |
| Fri | Week 9 | Final Go/No-Go decision call | PM + Leads | 1 hr |
| **Cutover Weekend** | | | | |
| Sat | 12:01 AM IST | Cutover start (lowest call volume) | Voice Eng | - |
| Sat | 12:30 AM | India Entry Points routing switch | Voice Eng | - |
| Sat | 1:00 AM | Agent Desktop login (night shift) | CC Ops | - |
| Sat | 2:00 AM | Test calls (all India flows) | QA | 1 hr |
| Sat | 3:00 AM | Issue resolution window | All | 3 hr |
| Sat | 6:00 AM | Day shift handover | CC Ops | - |
| Sat-Sun | All day | Enhanced 24x7 monitoring | Voice Eng + CC Ops | 48 hr |
| **Week 10 (Stabilization)** | | | | |
| Mon-Fri | Week 10 | 24x7 production monitoring | CC Ops | - |
| Fri | Week 10 | Wave 3 sign-off | CC Ops Manager | - |

---

