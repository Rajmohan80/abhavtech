# Chapter 7: WxCC Migration Execution (Phase 2) 

## UCCX to Webex Contact Center Migration Procedures

---

**Document Version:** 1.0  
**Date:** January 2026  
**Classification:** Internal - Technical Reference  
**Organization:** Abhavtech.com  
**Project Code:** ABV-COLLAB-MIG-2026-P2-CH7  
**Cross-Reference:** Chapter 3 (WxCC Design v2.0), Chapter 6 (WxCC Implementation v3.0), Chapter 7 Phase 1 (CUCM Migration)  
**Model Guidance:** Sonnet 4.5 (Implementation/Operations - Concise/Actionable)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2026 | Collaboration Architecture Team | Initial WxCC migration execution procedures |
| | | | Weekend cutover runbook |
| | | | Agent training program |
| | | | Site-sequenced rollout plan |

---

## Migration Summary

| Metric | UCCX (Current) | WxCC (Target) | Migration Scope |
|--------|----------------|---------------|-----------------|
| **Total Agents** | 175 | 175 | All agents |
| **Voice Agents** | 150 | 150 | 4 sites |
| **Digital Agents** | 25 | 25 -> 50 | Post-migration expansion |
| **Sites** | 4 | 4 | Chennai -> London/NJ -> Mumbai |
| **Queues** | 6 CSQs | 10 WxCC Queues | Expanded routing |
| **Skills** | 8 | 18 | Enhanced skill model |
| **IVR Scripts** | 9 | 9 Flows | Rebuilt in Flow Designer |
| **Virtual Agent** | None | Abhi (Dialogflow CX) | New capability |

---

## 7.1 Migration Prerequisites 

## 7.1.1 Phase 1 Dependency

```
+-----------------------------------------------------------------------------+
|              WXCC MIGRATION - PHASE 1 DEPENDENCY                            |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [!]️ CRITICAL: UCCX REQUIRES CUCM FOR CTI CONNECTIVITY                      |
|                                                                             |
|  DEPENDENCY CHAIN:                                                         |
|  -----------------                                                         |
|                                                                             |
|  +-------------+     CTI (JTAPI)    +-------------+                        |
|  |    UCCX     |<-------------------|    CUCM     |                        |
|  |  (Contact   |                    |  (Call      |                        |
|  |   Center)   |                    |  Control)   |                        |
|  +-------------+                    +-------------+                        |
|        |                                   |                               |
|        |                                   |                               |
|        |    MIGRATION IMPACT:              |                               |
|        |    -----------------              |                               |
|        |                                   |                               |
|        v                                   v                               |
|  Once CC agents move to             Once CUCM is decommissioned,          |
|  Webex Calling (Phase 1             UCCX loses CTI connectivity.          |
|  Batch 5), they cannot              No parallel operation possible.       |
|  receive UCCX routed calls.                                               |
|                                                                             |
|  IMPLICATION:                                                              |
|  ------------                                                              |
|  WxCC cutover is effectively a BIG BANG for contact center.               |
|  Phase 1 completion is a HARD GATE for Phase 2.                           |
|  Rollback = Full stack rollback (Webex Calling -> CUCM -> UCCX)             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 7.1.2 Prerequisites Checklist

```
+-----------------------------------------------------------------------------+
|              WXCC MIGRATION - PREREQUISITES CHECKLIST                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PHASE 1 COMPLETION (MANDATORY)                                            |
|  -----------------------------------------------------------------------   |
|  [ ] All 175 CC agents migrated to Webex Calling (Chapter 7 P1 Batch 5)   |
|  [ ] CC agent desk phones registered to Webex Calling                     |
|  [ ] Webex App deployed to all CC agents                                  |
|  [ ] PSTN connectivity validated (LGW India, CCPP EMEA/US)               |
|  [ ] Phase 1 48-hour stability confirmed for CC agents                    |
|  [ ] CUCM decommission NOT started (rollback path preserved)              |
|                                                                             |
|  CHAPTER 6 IMPLEMENTATION (MANDATORY)                                      |
|  -----------------------------------------------------------------------   |
|  [ ] WxCC tenant activated (India DC)                                     |
|  [ ] All 175 agent licenses assigned                                      |
|  [ ] 6 Entry Points configured                                            |
|  [ ] 10 Queues configured                                                 |
|  [ ] 18 Skills created                                                    |
|  [ ] 12 Skill Profiles created                                            |
|  [ ] 8 Teams configured                                                   |
|  [ ] 9 Flows built and validated                                          |
|  [ ] 87 Audio prompts uploaded (62 EN + 25 HI)                           |
|  [ ] Virtual Agent "Abhi" integrated (Dialogflow CX)                     |
|  [ ] Salesforce connector configured                                      |
|  [ ] Recording enabled (100% all calls)                                   |
|  [ ] PCI auto-pause configured (Billing queue)                           |
|  [ ] All 20 test scenarios passed (Chapter 6.10.2)                       |
|                                                                             |
|  INFRASTRUCTURE                                                            |
|  -----------------------------------------------------------------------   |
|  [ ] DNS entries prepared for cutover                                     |
|  [ ] Toll-free number porting request submitted (if applicable)          |
|  [ ] SD-WAN QoS validated (ABV-SDWAN-2024)                               |
|  [ ] India DC data residency confirmed                                    |
|                                                                             |
|  TRAINING                                                                  |
|  -----------------------------------------------------------------------   |
|  [ ] Agent training curriculum finalized                                  |
|  [ ] Supervisor training curriculum finalized                             |
|  [ ] Training environment provisioned (sandbox tenant)                    |
|  [ ] Training schedule published                                          |
|                                                                             |
|  OPERATIONS                                                                |
|  -----------------------------------------------------------------------   |
|  [ ] Cutover runbook reviewed and signed off                             |
|  [ ] Rollback procedures documented                                       |
|  [ ] Hypercare support schedule confirmed                                 |
|  [ ] Help desk briefed on WxCC support                                   |
|  [ ] Vendor TAC cases opened (preventive)                                |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 7.1.3 Go/No-Go Gate

| Gate | Criteria | Owner | Status |
|------|----------|-------|--------|
| **G1** | Phase 1 CC agents stable 48+ hours | Voice Eng Lead | [ ] |
| **G2** | Chapter 6 implementation 100% complete | WxCC Eng Lead | [ ] |
| **G3** | All 20 test scenarios passed | QA Lead | [ ] |
| **G4** | Agent training 100% complete (per wave) | Training Lead | [ ] |
| **G5** | Cutover runbook signed off | Project Manager | [ ] |
| **G6** | Rollback plan validated | Voice Eng Lead | [ ] |
| **G7** | Business owner approval | CC Operations Mgr | [ ] |
| **G8** | No P1/P2 open defects | QA Lead | [ ] |

**Decision:** All gates MUST be passed before cutover proceeds.

---

## 7.2 Migration Timeline 

## 7.2.1 Overall Schedule

```
+-----------------------------------------------------------------------------+
|              WXCC MIGRATION - OVERALL TIMELINE                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  WEEK    | PHASE                | ACTIVITIES                               |
|  ========================================================================  |
|                                                                             |
|  Week 1-2  | PREPARATION        | Training curriculum development         |
|            |                    | Sandbox environment setup               |
|            |                    | Final Chapter 6 validation              |
|            |                    | Cutover runbook finalization            |
|                                                                             |
|  Week 3-4  | TRAINING           | Wave 1 agent training (Chennai)         |
|            | (Wave 1)           | Supervisor training                     |
|            |                    | UAT with business SMEs                  |
|                                                                             |
|  Week 5    | WAVE 1 CUTOVER     | Chennai (30 agents)                     |
|            | (Pilot)            | Weekend cutover                         |
|            |                    | 5-day stabilization                     |
|                                                                             |
|  Week 6    | TRAINING           | Wave 2 agent training (London, NJ)      |
|            | (Wave 2)           |                                         |
|                                                                             |
|  Week 7    | WAVE 2 CUTOVER     | London (15) + New Jersey (10)          |
|            |                    | Weekend cutover                         |
|            |                    | 5-day stabilization                     |
|                                                                             |
|  Week 8-9  | TRAINING           | Wave 3 agent training (Mumbai)          |
|            | (Wave 3)           | 120 agents - largest batch              |
|                                                                             |
|  Week 10   | WAVE 3 CUTOVER     | Mumbai HQ (120 agents)                  |
|            | (Final)            | Weekend cutover                         |
|            |                    | 24x7 operation - highest risk           |
|                                                                             |
|  Week 11-12| HYPERCARE          | Enhanced support                        |
|            |                    | Issue resolution                        |
|            |                    | Performance tuning                      |
|                                                                             |
|  Week 13   | STABILIZATION      | Handover to BAU operations             |
|            |                    | UCCX decommission planning              |
|            |                    | Project closure                         |
|                                                                             |
+-----------------------------------------------------------------------------+
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

## 7.3 Agent Training Program 

## 7.3.1 Training Curriculum Overview

```
+-----------------------------------------------------------------------------+
|              WXCC AGENT TRAINING CURRICULUM                                 |
+-----------------------------------------------------------------------------+
|                                                                             |
|  MODULE | TOPIC                          | DURATION | AUDIENCE             |
|  ========================================================================  |
|                                                                             |
|  DAY 1 - FUNDAMENTALS (All Agents)                                        |
|  -------------------------------------------------------------------------  |
|  M1     | WxCC Overview & Architecture   | 30 min   | All agents          |
|  M2     | Agent Desktop Navigation       | 45 min   | All agents          |
|  M3     | Login/Logout & State Changes   | 30 min   | All agents          |
|  M4     | Handling Voice Calls           | 45 min   | Voice agents        |
|  M5     | Call Controls (Hold/Transfer)  | 30 min   | Voice agents        |
|                                                                             |
|  DAY 2 - ADVANCED FEATURES                                                |
|  -------------------------------------------------------------------------  |
|  M6     | Agent Assist & AI Features     | 30 min   | Premium agents      |
|  M7     | Handling Digital Channels      | 45 min   | Digital agents (25) |
|  M8     | Chat Conversations             | 30 min   | Digital agents      |
|  M9     | Email Handling                 | 30 min   | Digital agents      |
|  M10    | Wrap-up & Disposition Codes    | 15 min   | All agents          |
|                                                                             |
|  DAY 3 - PRACTICAL EXERCISES                                              |
|  -------------------------------------------------------------------------  |
|  M11    | Hands-on Lab: Voice Calls      | 60 min   | All agents          |
|  M12    | Hands-on Lab: Transfers        | 30 min   | All agents          |
|  M13    | Hands-on Lab: Digital (Chat)   | 30 min   | Digital agents      |
|  M14    | Assessment & Certification     | 30 min   | All agents          |
|                                                                             |
|  SUPERVISOR TRACK (Additional)                                            |
|  -------------------------------------------------------------------------  |
|  S1     | Supervisor Desktop Overview    | 30 min   | Supervisors (10)    |
|  S2     | Real-time Monitoring           | 30 min   | Supervisors         |
|  S3     | Whisper/Barge/Monitor          | 30 min   | Supervisors         |
|  S4     | Reports & Analytics            | 45 min   | Supervisors         |
|  S5     | Agent State Management         | 15 min   | Supervisors         |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 7.3.2 Training Schedule by Wave

**Wave 1 - Chennai (30 Agents + 2 Supervisors)**

| Date | Session | Attendees | Trainer |
|------|---------|-----------|---------|
| Week 3 Mon | M1-M5 (Day 1 - Fundamentals) | 15 agents (Batch A) | Training Lead |
| Week 3 Tue | M1-M5 (Day 1 - Fundamentals) | 15 agents (Batch B) | Training Lead |
| Week 3 Wed | M6-M10 (Day 2 - Advanced) | 30 agents (combined) | Training Lead |
| Week 3 Thu | M11-M14 (Day 3 - Labs) | 30 agents (combined) | Training Lead |
| Week 3 Fri | S1-S5 (Supervisor Track) | 2 supervisors | Training Lead |
| Week 4 | Refresher + UAT Support | Selected agents | Training Lead |

**Wave 2 - London/NJ (25 Agents + 2 Supervisors)**

| Date | Session | Attendees | Trainer |
|------|---------|-----------|---------|
| Week 6 Mon | M1-M5 (Day 1) - Virtual | 15 London | Regional Trainer |
| Week 6 Mon | M1-M5 (Day 1) - Virtual | 10 NJ | Regional Trainer |
| Week 6 Tue | M6-M10 (Day 2) - Virtual | 25 agents (combined) | Regional Trainer |
| Week 6 Wed | M11-M14 (Day 3) - Virtual | 25 agents | Regional Trainer |
| Week 6 Thu | S1-S5 (Supervisor Track) | 2 supervisors | Regional Trainer |

**Wave 3 - Mumbai HQ (120 Agents + 6 Supervisors)**

| Date | Session | Attendees | Trainer |
|------|---------|-----------|---------|
| Week 8 Mon-Tue | M1-M5 (Day 1) | 30 agents (Batch A) | Training Lead |
| Week 8 Wed-Thu | M1-M5 (Day 1) | 30 agents (Batch B) | Training Lead |
| Week 8 Fri | M1-M5 (Day 1) | 30 agents (Batch C) | Training Lead |
| Week 9 Mon | M1-M5 (Day 1) | 30 agents (Batch D) | Training Lead |
| Week 9 Tue-Wed | M6-M14 (Day 2-3) | 60 agents (Batch A+B) | Training Lead |
| Week 9 Thu-Fri | M6-M14 (Day 2-3) | 60 agents (Batch C+D) | Training Lead |
| Week 9 Fri PM | S1-S5 (Supervisor Track) | 6 supervisors | Training Lead |

## 7.3.3 Training Completion Criteria

| Criteria | Requirement | Verification |
|----------|-------------|--------------|
| Attendance | 100% module attendance | Attendance log |
| Lab Completion | Complete all hands-on exercises | Lab checklist |
| Assessment | Score ≥ 80% on certification exam | Online assessment |
| Sign-off | Agent acknowledges readiness | Sign-off form |

```
+-----------------------------------------------------------------------------+
|              AGENT TRAINING CERTIFICATION                                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Agent Name: _____________________________                                 |
|  Employee ID: ____________  Site: _______________                          |
|  Training Wave: [ ] Wave 1  [ ] Wave 2  [ ] Wave 3                              |
|                                                                             |
|  MODULES COMPLETED:                                                        |
|  -------------------------------------------------------------------------  |
|  [ ] M1: WxCC Overview              [ ] M8: Chat Conversations                |
|  [ ] M2: Agent Desktop Navigation   [ ] M9: Email Handling                    |
|  [ ] M3: Login/Logout               [ ] M10: Wrap-up & Disposition            |
|  [ ] M4: Handling Voice Calls       [ ] M11: Lab - Voice                      |
|  [ ] M5: Call Controls              [ ] M12: Lab - Transfers                  |
|  [ ] M6: Agent Assist               [ ] M13: Lab - Digital                    |
|  [ ] M7: Digital Channels           [ ] M14: Assessment                       |
|                                                                             |
|  ASSESSMENT SCORE: ___________ / 100  (Pass: ≥80)                         |
|                                                                             |
|  CERTIFICATION STATUS: [ ] CERTIFIED  [ ] REQUIRES RETAKE                     |
|                                                                             |
|  Agent Signature: ___________________  Date: ___________                   |
|  Trainer Signature: _________________  Date: ___________                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 7.3.4 Training Materials

| Material | Format | Location |
|----------|--------|----------|
| WxCC Agent Desktop Quick Reference | PDF (2 pages) | SharePoint/Training |
| Agent State Transition Guide | PDF (1 page) | SharePoint/Training |
| Call Handling Procedures | PDF (4 pages) | SharePoint/Training |
| Digital Channel Quick Guide | PDF (2 pages) | SharePoint/Training |
| Supervisor Dashboard Guide | PDF (3 pages) | SharePoint/Training |
| Training Videos (M1-M14) | MP4 | LMS |
| Lab Environment Access | URL | training.wxcc.abhavtech.com |
| Assessment Portal | URL | LMS |

---

## 7.4 Cutover Runbook 

## 7.4.1 Cutover Overview

```
+-----------------------------------------------------------------------------+
|              WXCC CUTOVER - HIGH-LEVEL APPROACH                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  CUTOVER TYPE: Weekend Big-Bang (per wave)                                 |
|                                                                             |
|  WHY WEEKEND:                                                              |
|  * Lowest call volume period                                               |
|  * Maximum time for issue resolution                                       |
|  * Minimal customer impact                                                 |
|  * Staff availability for extended hours                                   |
|                                                                             |
|  WHY BIG-BANG (NOT PARALLEL):                                             |
|  * UCCX depends on CUCM CTI - no parallel possible after Phase 1          |
|  * Single Entry Point cannot route to both UCCX and WxCC simultaneously   |
|  * Clean cutover reduces complexity                                        |
|                                                                             |
|  CUTOVER SEQUENCE:                                                         |
|  -----------------                                                         |
|                                                                             |
|  +-------------+    +-------------+    +-------------+    +-------------+ |
|  |   FREEZE    |--->|   SWITCH    |--->|   VERIFY    |--->|   GO LIVE   | |
|  |   UCCX      |    |   ROUTING   |    |   WXCC      |    |             | |
|  +-------------+    +-------------+    +-------------+    +-------------+ |
|       T-0             T+30 min          T+60 min          T+120 min       |
|                                                                             |
|  DURATION: ~3 hours (cutover) + 48 hours (stabilization)                  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 7.4.2 Cutover Team & Roles

| Role | Name | Responsibilities | Contact |
|------|------|------------------|---------|
| **Cutover Manager** | [PM Name] | Overall coordination, Go/No-Go decisions | +91-XXXXX |
| **Voice Engineering Lead** | [Eng Name] | Routing changes, Entry Points, Flows | +91-XXXXX |
| **WxCC Admin** | [Admin Name] | Control Hub configuration, agent activation | +91-XXXXX |
| **CC Operations Manager** | [Ops Name] | Agent coordination, business validation | +91-XXXXX |
| **Network Engineer** | [Net Name] | DNS changes, connectivity issues | +91-XXXXX |
| **QA Lead** | [QA Name] | Test execution, defect logging | +91-XXXXX |
| **Help Desk Lead** | [HD Name] | Agent support, issue triage | +91-XXXXX |
| **Vendor TAC** | Cisco TAC | Escalation support | TAC Case # |

## 7.4.3 Wave 1 Cutover Runbook (Chennai)

```
+-----------------------------------------------------------------------------+
|              WAVE 1 CUTOVER RUNBOOK - CHENNAI                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  DATE: [Week 5 Friday]                                                     |
|  START TIME: 6:00 PM IST                                                   |
|  END TIME: 9:00 PM IST (Go-Live ready)                                    |
|                                                                             |
|  TIME     | TASK                              | OWNER        | STATUS     |
|  ========================================================================= |
|                                                                             |
|  PRE-CUTOVER (4:00 PM - 6:00 PM)                                          |
|  -------------------------------------------------------------------------  |
|  4:00 PM  | Go/No-Go call                     | Cutover Mgr  | [ ]          |
|  4:30 PM  | Notify Chennai agents - logout    | CC Ops       | [ ]          |
|  5:00 PM  | Verify all Chennai agents logged  | CC Ops       | [ ]          |
|           | out of UCCX Finesse               |              |            |
|  5:30 PM  | Final UCCX backup                 | Voice Eng    | [ ]          |
|  5:45 PM  | Notify help desk - cutover start  | Cutover Mgr  | [ ]          |
|                                                                             |
|  CUTOVER EXECUTION (6:00 PM - 7:30 PM)                                    |
|  -------------------------------------------------------------------------  |
|  6:00 PM  | *** CUTOVER START ***             | Cutover Mgr  | [ ]          |
|  6:00 PM  | Disable Chennai agents in UCCX    | Voice Eng    | [ ]          |
|           | (make agents unavailable)         |              |            |
|  6:15 PM  | Update Entry Point routing:       | WxCC Admin   | [ ]          |
|           | - Enable WxCC India_Main flow     |              |            |
|           | - Chennai queues active           |              |            |
|  6:30 PM  | Verify WxCC Entry Points active   | Voice Eng    | [ ]          |
|           | Control Hub -> CC -> Entry Points   |              |            |
|  6:45 PM  | Chennai agents login to WxCC      | CC Ops       | [ ]          |
|           | Agent Desktop                     |              |            |
|  7:00 PM  | Verify 30 agents showing          | WxCC Admin   | [ ]          |
|           | "Available" in WxCC               |              |            |
|  7:15 PM  | Recording validation (test call)  | Voice Eng    | [ ]          |
|  7:30 PM  | *** CUTOVER COMPLETE ***          | Cutover Mgr  | [ ]          |
|                                                                             |
|  VALIDATION (7:30 PM - 9:00 PM)                                           |
|  -------------------------------------------------------------------------  |
|  7:30 PM  | Execute test scenarios:           | QA Lead      |            |
|           | [ ] TC-01: India TF -> Sales queue   |              | [ ]          |
|           | [ ] TC-02: Hindi language selection |              | [ ]          |
|           | [ ] TC-09: Virtual Agent "Abhi"     |              | [ ]          |
|           | [ ] TC-13: Agent hold/resume        |              | [ ]          |
|           | [ ] TC-14: Blind transfer           |              | [ ]          |
|           | [ ] TC-17: Web chat (if applicable) |              | [ ]          |
|  8:30 PM  | Test results review               | QA Lead      | [ ]          |
|  8:45 PM  | Issue resolution (if needed)      | Voice Eng    | [ ]          |
|  9:00 PM  | Go-Live confirmation              | Cutover Mgr  | [ ]          |
|                                                                             |
|  GO-LIVE (Saturday 9:00 AM IST)                                           |
|  -------------------------------------------------------------------------  |
|  9:00 AM  | Chennai operations start on WxCC  | CC Ops       | [ ]          |
|  9:00 AM  | Enhanced monitoring begins        | Voice Eng    | [ ]          |
|  Ongoing  | Issue tracking & resolution       | All          | [ ]          |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 7.4.4 Wave 3 Cutover Runbook (Mumbai - 24x7)

```
+-----------------------------------------------------------------------------+
|              WAVE 3 CUTOVER RUNBOOK - MUMBAI HQ (24x7)                      |
+-----------------------------------------------------------------------------+
|                                                                             |
|  DATE: [Week 10 Saturday]                                                  |
|  START TIME: 12:01 AM IST (Saturday, lowest volume)                       |
|  END TIME: 6:00 AM IST (Day shift start)                                  |
|                                                                             |
|  [!]️ SPECIAL CONSIDERATIONS:                                               |
|  * Mumbai operates 24x7 - cutover during lowest volume (midnight)         |
|  * Night shift (20 agents) handles calls during cutover                   |
|  * All 120 agents transition by 6:00 AM day shift start                   |
|  * Supervisor on-site throughout cutover                                   |
|                                                                             |
|  TIME     | TASK                              | OWNER        | STATUS     |
|  ========================================================================= |
|                                                                             |
|  PRE-CUTOVER (10:00 PM - 12:00 AM)                                        |
|  -------------------------------------------------------------------------  |
|  10:00 PM | Go/No-Go call (final)             | Cutover Mgr  | [ ]          |
|  10:30 PM | Night shift briefing              | CC Ops       | [ ]          |
|  11:00 PM | Verify Wave 1+2 stable            | Voice Eng    | [ ]          |
|  11:30 PM | Final UCCX Mumbai backup          | Voice Eng    | [ ]          |
|  11:45 PM | All teams on standby              | Cutover Mgr  | [ ]          |
|                                                                             |
|  CUTOVER EXECUTION (12:01 AM - 2:00 AM)                                   |
|  -------------------------------------------------------------------------  |
|  12:01 AM | *** CUTOVER START ***             | Cutover Mgr  | [ ]          |
|  12:01 AM | Disable Mumbai agents in UCCX     | Voice Eng    | [ ]          |
|  12:15 AM | Update India Entry Point routing  | WxCC Admin   | [ ]          |
|           | - All India flows now to WxCC     |              |            |
|  12:30 AM | Night shift (20) login to WxCC    | CC Ops       | [ ]          |
|  12:45 AM | Verify agents "Available" in WxCC | WxCC Admin   | [ ]          |
|  1:00 AM  | First live customer calls         | CC Ops       | [ ]          |
|  1:30 AM  | Recording validation              | Voice Eng    | [ ]          |
|  2:00 AM  | *** NIGHT SHIFT OPERATIONAL ***   | Cutover Mgr  | [ ]          |
|                                                                             |
|  VALIDATION & MONITORING (2:00 AM - 6:00 AM)                              |
|  -------------------------------------------------------------------------  |
|  2:00 AM  | Execute full test matrix          | QA Lead      | [ ]          |
|  3:00 AM  | Test results review               | QA Lead      | [ ]          |
|  3:30 AM  | Issue resolution window           | Voice Eng    | [ ]          |
|  5:00 AM  | Day shift agents begin login      | CC Ops       | [ ]          |
|  5:30 AM  | Verify 80+ agents available       | WxCC Admin   | [ ]          |
|  6:00 AM  | Day shift handover complete       | CC Ops       | [ ]          |
|  6:00 AM  | *** FULL OPERATIONS ON WXCC ***   | Cutover Mgr  | [ ]          |
|                                                                             |
|  POST-CUTOVER MONITORING                                                   |
|  -------------------------------------------------------------------------  |
|  6:00 AM  | Enhanced monitoring begins        | Voice Eng    | [ ]          |
|  8:00 AM  | Morning status call               | Cutover Mgr  | [ ]          |
|  12:00 PM | Midday status call                | Cutover Mgr  | [ ]          |
|  6:00 PM  | Evening status call               | Cutover Mgr  | [ ]          |
|  Sunday   | 24-hour stability review          | All          | [ ]          |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 7.4.5 Entry Point Routing Switch Procedure

**Procedure: Switch PSTN Routing to WxCC**

| Step | Action | Verification |
|------|--------|--------------|
| 1 | Login to Control Hub (admin.webex.com) | Org = Abhavtech.com |
| 2 | Navigate: Services -> Contact Center -> Entry Points | Entry Point list displayed |
| 3 | Select Entry Point (e.g., India_Main_Voice_EP) | EP details shown |
| 4 | Verify DN Mapping: | |
| | - 1800-266-1000 (India TF) | Mapped |
| | - +91-22-4960-1000 (Mumbai DID) | Mapped |
| 5 | Verify Flow Assignment: India_MainMenu_Flow_v1 | Flow active |
| 6 | Set Entry Point Status: **Active** | Status = Active |
| 7 | Test inbound call to mapped number | Call reaches WxCC flow |

**Entry Points to Activate per Wave:**

| Wave | Entry Points | Numbers |
|------|--------------|---------|
| Wave 1 (Chennai) | India_Main_Voice_EP (partial) | Test DIDs only |
| Wave 2 (London/NJ) | EMEA_Main_Voice_EP, Americas_Main_Voice_EP | +44-20-XXXX, +1-201-XXX |
| Wave 3 (Mumbai) | India_Main_Voice_EP, India_Sales_Direct_EP | 1800-266-1000, 1800-266-1001, +91-22-4960-1000 |
| Post-Cutover | Global_Chat_EP, Global_Email_EP | Web widget, support@abhavtech.com |

## 7.4.6 Agent Login Verification

**Procedure: Verify Agent Desktop Connectivity**

| Step | Action | Expected Result |
|------|--------|-----------------|
| 1 | Agent opens browser (Chrome recommended) | Browser launches |
| 2 | Navigate to: desktop.wxcc-us1.cisco.com | Login page displayed |
| 3 | Enter Webex credentials (SSO) | Azure AD login |
| 4 | Select Station: Webex Calling (Extension) | Extension pre-populated |
| 5 | Click "Sign In" | Agent Desktop loads |
| 6 | Change state to "Available" | State changes |
| 7 | Verify Team assignment | Correct team shown |
| 8 | Verify Queue visibility | Assigned queues visible |

**Agent Verification Checklist (per agent):**

```
+-----------------------------------------------------------------------------+
|              AGENT LOGIN VERIFICATION                                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Agent Name: ___________________  Extension: __________                    |
|  Site: [ ] Chennai  [ ] London  [ ] NJ  [ ] Mumbai                                |
|  Wave: [ ] 1  [ ] 2  [ ] 3                                                       |
|                                                                             |
|  VERIFICATION:                                                             |
|  [ ] Login successful                                                        |
|  [ ] Correct Team displayed: ___________________                            |
|  [ ] State change works (Available/Not Ready)                               |
|  [ ] Phone extension registered                                              |
|  [ ] Test call received successfully                                         |
|  [ ] Agent Assist visible (Premium agents only)                             |
|  [ ] Digital channels visible (if applicable)                               |
|                                                                             |
|  Issues: _________________________________________________________        |
|                                                                             |
|  Verified By: ___________________  Time: __________                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 7.5 Rollback Procedures 

## 7.5.1 Rollback Decision Framework

```
+-----------------------------------------------------------------------------+
|              ROLLBACK DECISION FRAMEWORK                                    |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [!]️ CRITICAL: ROLLBACK = FULL STACK REVERT                                |
|                                                                             |
|  Because UCCX requires CUCM CTI connectivity, rollback means:              |
|  1. Revert agents from WxCC to Webex Calling only (no CC)                 |
|  2. Re-enable CUCM (if still available during hypercare)                  |
|  3. Re-enable UCCX                                                         |
|  4. Re-register phones to CUCM                                             |
|                                                                             |
|  ROLLBACK TRIGGERS (Auto):                                                 |
|  -------------------------                                                 |
|  * > 50% of agents unable to login after 2 hours                          |
|  * > 30% of test scenarios failing after remediation attempts             |
|  * Complete Entry Point failure (no calls reaching WxCC)                  |
|  * Recording not functioning (compliance risk)                            |
|                                                                             |
|  ROLLBACK TRIGGERS (Manual - Business Decision):                          |
|  -----------------------------------------------                          |
|  * Customer impact exceeds acceptable threshold                           |
|  * Prolonged degradation with no resolution in sight                      |
|  * Business owner requests rollback                                       |
|                                                                             |
|  ROLLBACK WINDOW:                                                          |
|  ----------------                                                          |
|  * Wave 1-2: Rollback possible within 48 hours (CUCM still active)       |
|  * Wave 3: Rollback possible within 2 weeks (hypercare period)           |
|  * Post-hypercare: CUCM decommissioned - no rollback path                 |
|                                                                             |
|  ROLLBACK AUTHORITY:                                                       |
|  ------------------                                                        |
|  Primary:   CC Operations Manager + Voice Engineering Lead                |
|  Escalation: IT Director                                                  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 7.5.2 Rollback Procedure

**Procedure: Full Stack Rollback to UCCX**

| Step | Action | Owner | Time |
|------|--------|-------|------|
| 1 | **DECISION:** Confirm rollback required | CC Ops + Voice Eng | - |
| 2 | Notify all stakeholders (rollback initiated) | Cutover Mgr | 5 min |
| 3 | Agents logout from WxCC Agent Desktop | CC Ops | 10 min |
| 4 | Disable WxCC Entry Points | WxCC Admin | 5 min |
| 5 | Verify CUCM cluster is operational | Voice Eng | 5 min |
| 6 | Verify UCCX is operational | Voice Eng | 5 min |
| 7 | Re-enable UCCX agents | Voice Eng | 10 min |
| 8 | Revert PSTN routing to CUCM/UCCX | Voice Eng | 15 min |
| 9 | Agents login to Finesse (UCCX) | CC Ops | 15 min |
| 10 | Verify agent availability in UCCX | CC Ops | 5 min |
| 11 | Test inbound call to UCCX | QA Lead | 10 min |
| 12 | Confirm UCCX operational | Cutover Mgr | 5 min |
| 13 | Notify stakeholders (rollback complete) | Cutover Mgr | 5 min |
| 14 | Schedule post-mortem | PM | - |

**Estimated Rollback Duration:** 90 minutes

## 7.5.3 Partial Rollback (Wave-Specific)

For Wave 1 or Wave 2, if only the newly migrated site experiences issues:

| Step | Action |
|------|--------|
| 1 | Disable Entry Points for affected site only |
| 2 | Affected site agents logout from WxCC |
| 3 | Re-enable affected site agents in UCCX |
| 4 | Route affected site DIDs back to UCCX |
| 5 | Keep other waves operational on WxCC |
| 6 | Investigate and remediate before retry |

**Note:** Partial rollback only works if CUCM/UCCX still operational.

## 7.5.4 Post-Rollback Actions

| Action | Owner | Timeframe |
|--------|-------|-----------|
| Conduct post-mortem meeting | PM | Within 24 hours |
| Document root cause | Voice Eng | Within 48 hours |
| Create remediation plan | Voice Eng | Within 1 week |
| Re-schedule cutover attempt | PM | Per remediation |
| Communicate to stakeholders | PM | Ongoing |

---

## 7.6 Go-Live Validation 

## 7.6.1 Go-Live Checklist

```
+-----------------------------------------------------------------------------+
|              WXCC GO-LIVE VALIDATION CHECKLIST                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ENTRY POINTS                                                              |
|  -----------------------------------------------------------------------   |
|  [ ] EP-01: India_Main_Voice_EP active                                    |
|  [ ] EP-02: India_Sales_Direct_EP active                                  |
|  [ ] EP-03: EMEA_Main_Voice_EP active                                     |
|  [ ] EP-04: Americas_Main_Voice_EP active                                 |
|  [ ] EP-05: Global_Chat_EP active                                         |
|  [ ] EP-06: Global_Email_EP active                                        |
|                                                                             |
|  QUEUES                                                                    |
|  -----------------------------------------------------------------------   |
|  [ ] All 10 queues visible in real-time dashboard                        |
|  [ ] Agents assigned to correct queues                                    |
|  [ ] Service Level thresholds configured                                  |
|                                                                             |
|  AGENTS                                                                    |
|  -----------------------------------------------------------------------   |
|  [ ] 175 agents provisioned                                               |
|  [ ] All agents able to login                                             |
|  [ ] Agent state changes working                                          |
|  [ ] Phone integration (Webex Calling) working                           |
|                                                                             |
|  FLOWS                                                                     |
|  -----------------------------------------------------------------------   |
|  [ ] India_MainMenu_Flow_v1 - working                                     |
|  [ ] Language selection (EN/HI) - working                                 |
|  [ ] Menu routing - all options working                                   |
|  [ ] Virtual Agent Abhi - responding                                      |
|  [ ] After hours flow - activates correctly                               |
|                                                                             |
|  RECORDING                                                                 |
|  -----------------------------------------------------------------------   |
|  [ ] Recording enabled (100% calls)                                       |
|  [ ] Consent announcement playing                                         |
|  [ ] PCI pause working (Billing queue)                                   |
|  [ ] Recordings accessible in WFO                                         |
|                                                                             |
|  INTEGRATIONS                                                              |
|  -----------------------------------------------------------------------   |
|  [ ] Salesforce screen pop working                                        |
|  [ ] Dialogflow CX (Abhi) responding                                     |
|  [ ] Agent Assist suggestions appearing                                   |
|                                                                             |
|  SUPERVISOR                                                                |
|  -----------------------------------------------------------------------   |
|  [ ] Real-time dashboard accessible                                       |
|  [ ] Agent monitoring (whisper/barge) working                            |
|  [ ] Reports generating                                                    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 7.6.2 Test Scenario Matrix

| ID | Scenario | Entry Point | Expected Result | Pass |
|----|----------|-------------|-----------------|------|
| TC-01 | India TF -> English -> Sales | EP-01 | Routes to Sales_India_Queue | [ ] |
| TC-02 | India TF -> Hindi -> Support | EP-01 | Routes to Support_India_Queue | [ ] |
| TC-03 | Mumbai DID -> Billing | EP-01 | Routes to Billing_Queue | [ ] |
| TC-04 | Invalid menu option | EP-01 | Retry prompt (max 3x) | [ ] |
| TC-05 | No input timeout | EP-01 | Default to English | [ ] |
| TC-06 | After hours call | EP-01 | AfterHours flow | [ ] |
| TC-07 | UK number inbound | EP-03 | Routes to EMEA queues | [ ] |
| TC-08 | US number inbound | EP-04 | Routes to Americas queues | [ ] |
| TC-09 | Virtual Agent "Where is my order" | EP-01 | Abhi provides order status | [ ] |
| TC-10 | Virtual Agent Hindi query | EP-01 | Abhi responds in Hindi | [ ] |
| TC-11 | Virtual Agent escalation | EP-01 | Transfers to agent with context | [ ] |
| TC-12 | Virtual Agent 3x no input | EP-01 | Auto escalate to agent | [ ] |
| TC-13 | Agent hold/resume | - | MOH plays, call resumes | [ ] |
| TC-14 | Blind transfer to queue | - | Transfer completes | [ ] |
| TC-15 | Consult transfer | - | Context preserved | [ ] |
| TC-16 | 3-way conference | - | Conference works | [ ] |
| TC-17 | Web chat conversation | EP-05 | Chat routed to agent | [ ] |
| TC-18 | WhatsApp inbound | EP-05 | Routed to Digital queue | [ ] |
| TC-19 | Email routing | EP-06 | Email in queue | [ ] |
| TC-20 | Recording playback | - | Recording accessible | [ ] |

**Pass Criteria:** ≥ 95% (19/20 scenarios pass)

## 7.6.3 Performance Validation

| Metric | Target | Actual | Pass |
|--------|--------|--------|------|
| Agent login time | < 30 seconds | | [ ] |
| Call setup time | < 3 seconds | | [ ] |
| IVR prompt playback | No audio issues | | [ ] |
| Agent Desktop responsiveness | < 2 seconds | | [ ] |
| Screen pop latency | < 3 seconds | | [ ] |
| Recording start | Within 2 seconds | | [ ] |

## 7.6.4 Go-Live Sign-Off

```
+-----------------------------------------------------------------------------+
|              WXCC GO-LIVE SIGN-OFF                                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  WAVE: [ ] Wave 1 (Chennai)  [ ] Wave 2 (London/NJ)  [ ] Wave 3 (Mumbai)        |
|  DATE: _______________  TIME: _______________                              |
|                                                                             |
|  VALIDATION RESULTS:                                                       |
|  -------------------------------------------------------------------------  |
|  Entry Points Active:        _____ / 6                                     |
|  Queues Operational:         _____ / 10                                    |
|  Agents Logged In:           _____ / [Wave Total]                         |
|  Test Scenarios Passed:      _____ / 20                                    |
|  Critical Defects:           _____                                         |
|                                                                             |
|  GO-LIVE DECISION: [ ] APPROVED  [ ] NOT APPROVED                             |
|                                                                             |
|  SIGN-OFF:                                                                 |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  Role                    | Name              | Signature      | Date       |
|  ------------------------+-------------------+----------------+------------|
|  Voice Engineering Lead  |                   |                |            |
|  CC Operations Manager   |                   |                |            |
|  QA Lead                 |                   |                |            |
|  Project Manager         |                   |                |            |
|  Business Owner          |                   |                |            |
|  ------------------------+-------------------+----------------+------------|
|                                                                             |
|  NOTES:                                                                    |
|  _____________________________________________________________________    |
|  _____________________________________________________________________    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 7.7 Hypercare Period 

## 7.7.1 Hypercare Overview

```
+-----------------------------------------------------------------------------+
|              WXCC HYPERCARE - 2 WEEK SUPPORT PERIOD                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  DURATION: 2 weeks post Wave 3 cutover (Weeks 11-12)                      |
|                                                                             |
|  PURPOSE:                                                                  |
|  * Enhanced monitoring and rapid issue resolution                          |
|  * Performance tuning based on production data                             |
|  * User support and additional training as needed                          |
|  * Final validation before BAU handover                                    |
|                                                                             |
|  SUPPORT MODEL:                                                            |
|  -----------------                                                         |
|                                                                             |
|  Week 11 (First Week):                                                    |
|  * Voice Engineering: On-site Mumbai (24x7 coverage)                      |
|  * WxCC Admin: On-call (8 AM - 10 PM IST)                                 |
|  * Help Desk: Extended hours                                               |
|  * Daily status calls: 8 AM, 12 PM, 6 PM IST                              |
|                                                                             |
|  Week 12 (Second Week):                                                   |
|  * Voice Engineering: On-call (reduced coverage)                          |
|  * WxCC Admin: Normal hours                                                |
|  * Daily status calls: 9 AM IST only                                      |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 7.7.2 Hypercare Contacts

| Role | Name | Contact | Availability |
|------|------|---------|--------------|
| Hypercare Lead | [Voice Eng Lead] | +91-XXXXX | 24x7 (Week 11) |
| WxCC Admin | [Admin Name] | +91-XXXXX | 8 AM - 10 PM |
| CC Operations | [Ops Lead] | +91-XXXXX | 24x7 |
| Help Desk | Support Team | +91-XXXXX | Extended |
| Cisco TAC | TAC Case # | [Case Number] | 24x7 |

## 7.7.3 Issue Escalation Matrix

| Severity | Definition | Response | Resolution | Escalation |
|----------|------------|----------|------------|------------|
| **P1 - Critical** | Complete service outage | 15 min | 2 hours | Immediate to IT Director |
| **P2 - High** | Major feature broken (recording, routing) | 30 min | 4 hours | 1 hour to Voice Eng Lead |
| **P3 - Medium** | Single agent/queue issue | 1 hour | 8 hours | Normal process |
| **P4 - Low** | Minor issue, workaround exists | 4 hours | 24 hours | Normal process |

## 7.7.4 Daily Status Report Template

```
+-----------------------------------------------------------------------------+
|              WXCC HYPERCARE - DAILY STATUS REPORT                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Date: _______________  Report #: _____                                    |
|  Prepared By: _______________                                              |
|                                                                             |
|  OVERALL STATUS: [ ] GREEN  [ ] YELLOW  [ ] RED                                 |
|                                                                             |
|  KEY METRICS (Last 24 Hours):                                             |
|  -------------------------------------------------------------------------  |
|  Total Calls Handled:          _______                                     |
|  Service Level (30s):          _______% (Target: 85%)                     |
|  Average Handle Time:          _______ min (Target: 5.5 min)              |
|  Abandonment Rate:             _______% (Target: < 4%)                    |
|  Virtual Agent Containment:    _______% (Target: 25%)                     |
|  Agent Availability:           _______% (Target: > 95%)                   |
|                                                                             |
|  ISSUES (Open):                                                            |
|  -------------------------------------------------------------------------  |
|  ID    | Severity | Description              | Status   | Owner           |
|  ------+----------+--------------------------+----------+-----------------|
|        |          |                          |          |                 |
|        |          |                          |          |                 |
|                                                                             |
|  ISSUES (Resolved Today):                                                  |
|  -------------------------------------------------------------------------  |
|  ID    | Description                         | Resolution                 |
|  ------+-------------------------------------+----------------------------|
|        |                                     |                            |
|                                                                             |
|  ACTIONS FOR TOMORROW:                                                     |
|  -------------------------------------------------------------------------  |
|  1. ________________________________________________________________      |
|  2. ________________________________________________________________      |
|                                                                             |
|  RISKS:                                                                    |
|  -------------------------------------------------------------------------  |
|  1. ________________________________________________________________      |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 7.7.5 Hypercare Exit Criteria

| Criteria | Threshold | Actual | Pass |
|----------|-----------|--------|------|
| Service Level (30s) | ≥ 80% (7-day avg) | | [ ] |
| System availability | ≥ 99.5% | | [ ] |
| P1 incidents | 0 open | | [ ] |
| P2 incidents | ≤ 2 open | | [ ] |
| Agent satisfaction | ≥ 80% positive | | [ ] |
| Recording compliance | 100% | | [ ] |
| Training completion | 100% | | [ ] |
| Documentation complete | 100% | | [ ] |

**Exit Decision:** All criteria must be met for hypercare exit.

---

## 7.8 UCCX Decommissioning 

## 7.8.1 Decommission Prerequisites

```
+-----------------------------------------------------------------------------+
|              UCCX DECOMMISSION - PREREQUISITES                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  TIMING: After hypercare completion + 2-week buffer (Week 15+)            |
|                                                                             |
|  PREREQUISITES:                                                            |
|  -------------------------------------------------------------------------  |
|  [ ] All waves successfully migrated                                      |
|  [ ] Hypercare exit criteria met                                          |
|  [ ] 2-week stability period (no rollbacks)                               |
|  [ ] All 175 agents operational on WxCC                                   |
|  [ ] UCCX has 0 active calls for 2 weeks                                  |
|  [ ] Business owner sign-off for decommission                             |
|  [ ] Backup of all UCCX data archived                                     |
|  [ ] CDR/Recording data migrated or retained per compliance               |
|                                                                             |
|  [!]️ ONCE UCCX IS DECOMMISSIONED, ROLLBACK TO UCCX IS NOT POSSIBLE        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 7.8.2 UCCX Data Archival

| Data Type | Retention | Archive Location | Owner |
|-----------|-----------|------------------|-------|
| Call Detail Records (CDR) | 7 years | Archive storage | IT Ops |
| Call Recordings | Per compliance (1 yr India) | WFO migration or archive | CC Ops |
| Agent Statistics | 2 years | Data warehouse | Analytics |
| Script Backup (.aef files) | 2 years | Documentation repo | Voice Eng |
| Configuration Export | Permanent | Project documentation | Voice Eng |
| Queue Configuration | Permanent | Project documentation | Voice Eng |

## 7.8.3 UCCX Decommission Procedure

| Step | Action | Owner | Verification |
|------|--------|-------|--------------|
| 1 | Verify 0 active agents in UCCX | CC Ops | RTMT shows 0 |
| 2 | Verify 0 calls in last 14 days | Voice Eng | CDR check |
| 3 | Final backup of UCCX | Voice Eng | DRS backup |
| 4 | Export all historical reports | CC Ops | Reports saved |
| 5 | Archive call recordings | CC Ops | Per compliance |
| 6 | Disable UCCX services | Voice Eng | Services stopped |
| 7 | Remove CTI Route Points from CUCM | Voice Eng | CTI RPs deleted |
| 8 | Shutdown UCCX secondary | Voice Eng | VM powered off |
| 9 | Shutdown UCCX primary | Voice Eng | VM powered off |
| 10 | Update DNS records | Network | UCCX FQDNs removed |
| 11 | Delete UCCX VMs | IT Ops | VMs deleted |
| 12 | Release IP addresses | Network | IPAM updated |
| 13 | Update network diagrams | Network | Diagrams updated |
| 14 | Notify Cisco licensing | Procurement | Licenses released |
| 15 | Document decommission | PM | Project closure |

## 7.8.4 Post-Decommission Validation

| Check | Expected | Actual | Pass |
|-------|----------|--------|------|
| UCCX servers powered off | Yes | | [ ] |
| UCCX DNS records removed | Yes | | [ ] |
| CTI Route Points removed from CUCM | Yes | | [ ] |
| Backup archived and accessible | Yes | | [ ] |
| Licensing updated with Cisco | Yes | | [ ] |
| Documentation updated | Yes | | [ ] |

---

## 7.9 Migration Quick Reference 

## 7.9.1 Pre-Cutover Checklist

- [ ] Phase 1 (Webex Calling) complete for CC agents
- [ ] Chapter 6 implementation 100% complete
- [ ] All 20 test scenarios passed
- [ ] Agent training complete (per wave)
- [ ] Cutover team assembled and briefed
- [ ] Go/No-Go decision: **GO**

## 7.9.2 Cutover Day Checklist

- [ ] Agents logged out of UCCX Finesse
- [ ] UCCX agents disabled
- [ ] WxCC Entry Points activated
- [ ] Agents logged into WxCC Agent Desktop
- [ ] Test calls validated
- [ ] Recording verified
- [ ] Go-Live confirmed

## 7.9.3 Post-Cutover Checklist

- [ ] Enhanced monitoring active
- [ ] Daily status calls scheduled
- [ ] Issue log initiated
- [ ] Help desk handling WxCC calls
- [ ] Hypercare support engaged
- [ ] Wave sign-off obtained

## 7.9.4 Key Contacts

| Role | Contact |
|------|---------|
| Cutover Manager | [Name] - +91-XXXXX |
| Voice Engineering | [Name] - +91-XXXXX |
| CC Operations | [Name] - +91-XXXXX |
| Help Desk | +91-XXXXX |
| Cisco TAC | Case #XXXXXXXX |

---

## Document References

| Reference | Description |
|-----------|-------------|
| Chapter 1 | Discovery & Current State Assessment |
| Chapter 3 v2.0 | Webex Contact Center Design (source of truth) |
| Chapter 6 v3.0 | WxCC Implementation Procedures |
| Chapter 7 Phase 1 | CUCM to Webex Calling Migration |
| Master Reference Card | Single source of truth for specifications |
| WxCC Admin Guide | help.webex.com/en-us/article/n4jgze8 |

---

*© 2026 Abhavtech.com - Internal Use Only*  
*Document Code: ABV-COLLAB-MIG-2026-P2-CH7 v1.0*
