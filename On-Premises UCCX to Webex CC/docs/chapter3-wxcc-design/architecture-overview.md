# Chapter 3: Webex Contact Center Design (Phase 2) 
## UCCX to Webex Contact Center Migration 

**Document Version:** 2.0 - Phase 2 Detailed Design  
**Date:** January 2026  
**Classification:** Internal - Technical Reference  
**Organization:** Abhavtech.com  
**Project Code:** ABV-COLLAB-MIG-2026-P2  
**Model Guidance:** Opus 4.5 (Design/Architecture - Comprehensive/Explanatory)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 2.0 | Jan 2026 | Collaboration Architecture Team | Phase 2 Contact Center detailed design |
| | | | Entry Point/Queue configuration |
| | | | Flow Designer IVR detailed design |
| | | | Dialogflow CX integration |
| | | | Agent Assist implementation |

---

## Executive Summary

This chapter provides comprehensive design specifications for migrating Abhavtech's existing Cisco UCCX contact center to Webex Contact Center (WxCC). The design follows a migration-focused approach rather than greenfield, ensuring business continuity while leveraging modern cloud contact center capabilities.

**Migration Scope:**

| Metric | UCCX (Current) | WxCC (Target) |
|--------|---------------|---------------|
| **Total Agents** | 175 | 175 (scalable to 300) |
| **Voice Agents** | 150 | 150 |
| **Digital Agents** | 25 | 25 -> 50 (post-migration) |
| **IVR Scripts** | 9 UCCX scripts | 9 Flow Designer flows |
| **Audio Prompts** | 87 prompts | 87 prompts (converted) |
| **Languages** | English, Hindi | English, Hindi + Tamil (Phase 3) |
| **Queues** | 6 CSQ queues | 8 WxCC queues |
| **Skills** | 8 skills | 12 skills (expanded) |

**Key Design Principles:**

1. **Business Continuity First**: Zero-downtime migration with parallel operation period
2. **Feature Parity Before Enhancement**: Match UCCX functionality before adding WxCC features
3. **Multi-Region Compliance**: India DoT/TRAI, GDPR, UK Data Protection
4. **AI-Ready Architecture**: Built for Virtual Agent "Abhi" integration from Day 1

---

## Table of Contents

1. [UCCX Current State Assessment](#31-uccx-current-state-assessment)
2. [Webex Contact Center Architecture](#32-webex-contact-center-architecture)
3. [Entry Point Design](#33-entry-point-design)
4. [Queue Design](#34-queue-design)
5. [Skills and Routing Design](#35-skills-and-routing-design)
6. [Flow Designer - IVR Migration](#36-flow-designer-ivr-migration)
7. [Agent Desktop Design](#37-agent-desktop-design)
8. [Digital Channel Design](#38-digital-channel-design)
9. [AI Features Design](#39-ai-features-design)
10. [Contact Center Compliance by Region](#310-contact-center-compliance-by-region)

---

## 3.1 UCCX Current State Assessment 

## 3.1.1 UCCX Cluster Architecture

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH UCCX CURRENT STATE - CLUSTER ARCHITECTURE             |
+-----------------------------------------------------------------------------+
|                                                                             |
|                        +-------------------------+                          |
|                        |      CUCM CLUSTER       |                          |
|                        |   (Integration Point)   |                          |
|                        +-----------+-------------+                          |
|                                    |                                        |
|                          CTI Manager Connection                             |
|                                    |                                        |
|              +---------------------+---------------------+                 |
|              |                                           |                 |
|              v                                           v                 |
|   +---------------------+                 +---------------------+          |
|   |   UCCX PRIMARY      |    <- HA ->    |   UCCX SECONDARY    |          |
|   |   uccx-pub.abv.com  |    (Failover)   |   uccx-sub.abv.com  |          |
|   +---------------------+                 +---------------------+          |
|   | Version: 12.5(1)SU2 |                 | Version: 12.5(1)SU2 |          |
|   | Agents: 175         |                 | Agents: 175 (HA)    |          |
|   | Licenses: Premium   |                 | Role: Hot Standby   |          |
|   | Scripts: 9          |                 |                     |          |
|   | CSQs: 6             |                 |                     |          |
|   +---------------------+                 +---------------------+          |
|                                                                             |
|   INTEGRATIONS:                                                            |
|   -------------                                                            |
|   * CUCM 14.0 CTI Integration (JTAPI)                                     |
|   * Finesse Desktop 12.5 (175 agents)                                     |
|   * Cisco MediaSense Recording (optional)                                 |
|   * Internal CRM via Database Integration (ODBC)                          |
|   * Wallboard via CUIC Reporting                                          |
|                                                                             |
|   CAPACITY UTILIZATION:                                                    |
|   ---------------------                                                    |
|   * Peak concurrent calls: 85 (of 150 voice agents)                       |
|   * Peak IVR ports: 40 (of 60 licensed)                                   |
|   * Peak agent sessions: 160 (of 175 licensed)                            |
|   * Daily call volume: 3,500-4,200 calls                                  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.1.2 UCCX Agent Distribution by Site

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH UCCX AGENT DISTRIBUTION                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  SITE            | VOICE | DIGITAL | TOTAL | TEAMS              | HOURS   |
|  ----------------+-------+---------+-------+--------------------+---------|
|  Mumbai HQ       |   100 |      20 |   120 | Sales-IN, Support  | 24x7    |
|                  |       |         |       | Billing, Tech      |         |
|  ----------------+-------+---------+-------+--------------------+---------|
|  Chennai         |    25 |       5 |    30 | Sales-IN, Support  | 9AM-9PM |
|  ----------------+-------+---------+-------+--------------------+---------|
|  London          |    15 |       0 |    15 | Sales-EMEA,Support | 9AM-6PM |
|  ----------------+-------+---------+-------+--------------------+---------|
|  New Jersey      |    10 |       0 |    10 | Sales-US, Support  | 9AM-6PM |
|  ----------------+-------+---------+-------+--------------------+---------|
|  TOTAL           |   150 |      25 |   175 |                    |         |
|                                                                             |
|  NOTES:                                                                    |
|  ------                                                                    |
|  * Mumbai is 24x7 operation (3 shifts)                                    |
|  * Digital agents handle Email, Chat (not WhatsApp currently)             |
|  * London/New Jersey share EMEA/US overflow to Mumbai after hours         |
|  * Chennai provides Hindi/Tamil overflow support to Mumbai                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.1.3 UCCX Contact Service Queue (CSQ) Inventory

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH UCCX CSQ INVENTORY                                    |
+-----------------------------------------------------------------------------+
|                                                                             |
|  CSQ NAME           | TYPE    | AGENTS | SL    | MAX Q | ROUTING MODEL    |
|  -------------------+---------+--------+-------+-------+------------------|
|  Sales_India_CSQ    | Voice   |     45 | 30s   | 300s  | Longest Available|
|  Sales_EMEA_CSQ     | Voice   |     12 | 30s   | 300s  | Longest Available|
|  Sales_Americas_CSQ | Voice   |      8 | 30s   | 300s  | Longest Available|
|  Support_CSQ        | Voice   |     55 | 45s   | 600s  | Skill-Based      |
|  Billing_CSQ        | Voice   |     15 | 30s   | 300s  | Skill-Based      |
|  TechSupport_CSQ    | Voice   |     15 | 60s   | 900s  | Skill-Based      |
|  -------------------+---------+--------+-------+-------+------------------|
|  TOTAL VOICE        |         |    150 |       |       |                  |
|  -------------------+---------+--------+-------+-------+------------------|
|  Email_CSQ          | Digital |     15 | 4hrs  |  24hr | Round Robin      |
|  Chat_CSQ           | Digital |     10 | 30s   | 300s  | Longest Available|
|  -------------------+---------+--------+-------+-------+------------------|
|  TOTAL DIGITAL      |         |     25 |       |       |                  |
|                                                                             |
|  LEGEND:                                                                   |
|  SL = Service Level Target (time to answer)                               |
|  Max Q = Maximum time in queue before overflow                            |
|                                                                             |
|  OVERFLOW ROUTING:                                                         |
|  * Sales_EMEA_CSQ overflow -> Sales_India_CSQ (after hours)                |
|  * Sales_Americas_CSQ overflow -> Sales_India_CSQ (after hours)            |
|  * All queues ultimate overflow -> Voicemail after max queue time          |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.1.4 UCCX Script Inventory (Detailed)

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH UCCX SCRIPT INVENTORY - DETAILED                      |
+-----------------------------------------------------------------------------+
|                                                                             |
|  SCRIPT NAME        | ENTRY POINT    | COMPLEXITY | DEPENDENCIES           |
|  =======================================================================   |
|                                                                             |
|  1. MainMenu_EN.aef                                                        |
|  -----------------------------------------------------------------------   |
|     Entry Point:     +91-22-4960-1000 (Mumbai Toll)                        |
|                      1800-266-1000 (India Toll-Free)                       |
|     Description:     Primary English IVR - Main Menu                       |
|     Complexity:      MEDIUM (4 menu levels, DB lookup)                     |
|     Call Volume:     ~2,500 calls/day                                      |
|     Dependencies:    DB_Lookup (customer validation)                       |
|                      PromptLibrary_EN (42 prompts)                         |
|     Business Hours:  Route to queue per selection                          |
|     After Hours:     Route to AfterHours.aef                               |
|     Flow Logic:                                                            |
|       Welcome -> Language Select (EN/HI) -> Auth (optional) ->                |
|       Main Menu (Sales/Support/Billing/Tech) -> Queue                       |
|                                                                             |
|  2. MainMenu_HI.aef                                                        |
|  -----------------------------------------------------------------------   |
|     Entry Point:     Same as MainMenu_EN (Hindi option selected)           |
|     Description:     Hindi IVR - Main Menu (parallel to EN)                |
|     Complexity:      MEDIUM (mirrors EN flow)                              |
|     Call Volume:     ~800 calls/day                                        |
|     Dependencies:    PromptLibrary_HI (25 prompts)                         |
|     Flow Logic:      Same as EN, Hindi prompts                             |
|                                                                             |
|  3. SalesQueue.aef                                                         |
|  -----------------------------------------------------------------------   |
|     Entry Point:     Internal (from MainMenu press 1)                      |
|     Description:     Sales queue treatment with EWT                        |
|     Complexity:      LOW (queue + announcements)                           |
|     Dependencies:    None (uses system EWT)                                |
|     Flow Logic:      Comfort Message -> EWT -> Hold Music -> Agent            |
|                                                                             |
|  4. SupportQueue.aef                                                       |
|  -----------------------------------------------------------------------   |
|     Entry Point:     Internal (from MainMenu press 2)                      |
|     Description:     Support queue with ticket lookup                      |
|     Complexity:      MEDIUM (ticket # input, DB lookup)                    |
|     Dependencies:    DB_Lookup (ticket status)                             |
|     Flow Logic:      Get Ticket# -> Lookup -> Read Status -> Queue            |
|                                                                             |
|  5. BillingQueue.aef                                                       |
|  -----------------------------------------------------------------------   |
|     Entry Point:     Internal (from MainMenu press 3)                      |
|     Description:     Billing queue with account balance                    |
|     Complexity:      MEDIUM (account lookup, balance read)                 |
|     Dependencies:    DB_Lookup (billing system)                            |
|     Flow Logic:      Get Account -> Validate -> Read Balance -> Queue         |
|                                                                             |
|  6. TechSupport.aef                                                        |
|  -----------------------------------------------------------------------   |
|     Entry Point:     Internal (from MainMenu press 4)                      |
|     Description:     Technical support with product selection              |
|     Complexity:      MEDIUM (product menu, skill routing)                  |
|     Dependencies:    Skill routing (ProductA, ProductB, ProductC)          |
|     Flow Logic:      Product Menu -> Skill Assignment -> Queue               |
|                                                                             |
|  7. AfterHours.aef                                                         |
|  -----------------------------------------------------------------------   |
|     Entry Point:     Internal (from MainMenu after hours)                  |
|     Description:     After hours treatment                                 |
|     Complexity:      LOW (message + callback offer)                        |
|     Dependencies:    HolidayList (custom holiday calendar)                 |
|                      CallbackRequest (DB write)                            |
|     Flow Logic:      Closed Message -> Callback Offer -> Voicemail           |
|                                                                             |
|  8. Callback.aef                                                           |
|  -----------------------------------------------------------------------   |
|     Entry Point:     Internal (from queue overflow or after hours)         |
|     Description:     Callback scheduling                                   |
|     Complexity:      HIGH (time slot selection, DB write, outbound)        |
|     Dependencies:    CallbackScheduler (outbound integration)              |
|                      DB_Write (callback table)                             |
|     Flow Logic:      Get Callback# -> Time Slot -> Confirm -> Schedule        |
|                                                                             |
|  9. Survey.aef                                                             |
|  -----------------------------------------------------------------------   |
|     Entry Point:     Post-call (agent transfer)                            |
|     Description:     Post-call satisfaction survey                         |
|     Complexity:      MEDIUM (3 questions, DB write)                        |
|     Dependencies:    DB_Write (survey responses)                           |
|     Flow Logic:      Q1 (1-5) -> Q2 (1-5) -> Q3 (1-5) -> Thank -> End          |
|                                                                             |
|  =======================================================================   |
|  SUMMARY:                                                                  |
|  * Total Scripts: 9                                                        |
|  * HIGH Complexity: 1 (Callback)                                           |
|  * MEDIUM Complexity: 6                                                    |
|  * LOW Complexity: 2                                                       |
|  * Total Prompts: 87 (EN: 62, HI: 25)                                      |
|  * DB Integrations: 4 scripts require database connectivity                |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.1.5 UCCX Skills Inventory

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH UCCX SKILLS INVENTORY                                 |
+-----------------------------------------------------------------------------+
|                                                                             |
|  SKILL NAME        | TYPE      | VALUES      | AGENTS | USED IN CSQ        |
|  ------------------+-----------+-------------+--------+--------------------|
|  Sales             | Boolean   | True/False  |     65 | Sales_India/EMEA   |
|  Support           | Boolean   | True/False  |     55 | Support_CSQ        |
|  Billing           | Boolean   | True/False  |     15 | Billing_CSQ        |
|  TechnicalSupport  | Boolean   | True/False  |     15 | TechSupport_CSQ    |
|  Hindi             | Boolean   | True/False  |     80 | All (routing)      |
|  English           | Boolean   | True/False  |    175 | All (required)     |
|  ProductA          | Boolean   | True/False  |      8 | TechSupport_CSQ    |
|  ProductB          | Boolean   | True/False  |      7 | TechSupport_CSQ    |
|  ------------------+-----------+-------------+--------+--------------------|
|                                                                             |
|  MIGRATION NOTES:                                                          |
|  -----------------                                                         |
|  * All skills will be recreated in WxCC                                    |
|  * Add new skills: Tamil, German (EMEA), Region_APAC/EMEA/US              |
|  * Convert Boolean to Proficiency where relevant                           |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.1.6 UCCX Reporting & Metrics (Baseline)

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH UCCX - CURRENT PERFORMANCE METRICS (BASELINE)         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  METRIC                          | CURRENT   | TARGET (WxCC) | IMPROVEMENT  |
|  --------------------------------+-----------+---------------+--------------|
|  Daily Call Volume               | 3,800     | 4,500+        | AI handles   |
|  Service Level (30s)             | 72%       | 85%           | +13%         |
|  Average Handle Time (AHT)       | 7.5 min   | 5.5 min       | -2 min       |
|  First Call Resolution (FCR)     | 68%       | 82%           | +14%         |
|  Call Abandonment Rate           | 8.5%      | 4%            | -4.5%        |
|  Customer Satisfaction (CSAT)    | 3.8/5     | 4.3/5         | +0.5         |
|  IVR Containment Rate            | 12%       | 35%           | +23% (AI)    |
|  Agent Occupancy                 | 78%       | 72%           | Better WLB   |
|  Average Speed to Answer (ASA)   | 45 sec    | 25 sec        | -20 sec      |
|  --------------------------------+-----------+---------------+--------------|
|                                                                             |
|  NOTE: Target metrics assume Phase 2 completion with AI features enabled   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 3.2 Webex Contact Center Architecture 

## 3.2.1 WxCC Platform Selection

```
+-----------------------------------------------------------------------------+
|              WEBEX CONTACT CENTER - PLATFORM SELECTION                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  SELECTED PLATFORM: Webex Contact Center (Cloud)                           |
|                                                                             |
|  ALTERNATIVES EVALUATED:                                                   |
|  +---------------------------------------------------------------------+   |
|  | Option              | Pros                  | Cons                 |   |
|  +---------------------+-----------------------+----------------------+   |
|  | Webex CC (Cloud)    | Cloud-native          | Feature limitations  |   |
|  |                     | AI-ready (native)     | vs on-prem           |   |
|  |                     | Faster deployment     |                      |   |
|  |                     | Global redundancy     |                      |   |
|  |                     | [OK] SELECTED            |                      |   |
|  +---------------------+-----------------------+----------------------+   |
|  | Webex CCE           | Full UCM integration  | Complex deployment   |   |
|  | (Enterprise)        | Finesse compatible    | Higher cost          |   |
|  |                     |                       | On-prem component    |   |
|  +---------------------+-----------------------+----------------------+   |
|  | Third-party CC      | Best-of-breed option  | Multi-vendor mgmt    |   |
|  | (Genesys, NICE)     | Specialized features  | Integration effort   |   |
|  +---------------------+-----------------------+----------------------+   |
|                                                                             |
|  DECISION RATIONALE:                                                       |
|  --------------------                                                      |
|  1. Single-vendor strategy (Webex Calling + Contact Center)               |
|  2. Native AI integration (Webex AI Agent, Agent Assist)                  |
|  3. Cloud-first corporate mandate                                          |
|  4. Reduced operational complexity (no on-prem servers)                    |
|  5. Multi-region deployment with regional data residency                   |
|  6. Aligns with Abhavtech's AI technology company identity                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.2.2 WxCC Multi-Region Architecture

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH WEBEX CONTACT CENTER - MULTI-REGION ARCHITECTURE      |
+-----------------------------------------------------------------------------+
|                                                                             |
|                          +-------------------------+                        |
|                          |    WEBEX CONTROL HUB    |                        |
|                          |   (Single Organization)  |                        |
|                          |    Org Region: APAC     |                        |
|                          +------------+------------+                        |
|                                       |                                     |
|                    +------------------+------------------+                 |
|                    |                  |                  |                 |
|                    v                  v                  v                 |
|           +--------------+   +--------------+   +--------------+          |
|           |   WxCC       |   |   WxCC       |   |   WxCC       |          |
|           |   TENANT     |   |   TENANT     |   |   TENANT     |          |
|           |   APAC       |   |   EMEA       |   |   AMERICAS   |          |
|           |  (India DC)  |   |  (UK/EU DC)  |   |  (US DC)     |          |
|           +------+-------+   +------+-------+   +------+-------+          |
|                  |                  |                  |                   |
|                  v                  v                  v                   |
|           +--------------+   +--------------+   +--------------+          |
|           | SITES:       |   | SITES:       |   | SITES:       |          |
|           | - Mumbai     |   | - London     |   | - New Jersey |          |
|           | - Chennai    |   |              |   |              |          |
|           |              |   |              |   |              |          |
|           | Agents: 150  |   | Agents: 15   |   | Agents: 10   |          |
|           +--------------+   +--------------+   +--------------+          |
|                                                                             |
|  DATA RESIDENCY CONFIGURATION:                                             |
|  ------------------------------                                            |
|                                                                             |
|  Region      | WxCC Data Center | Recording Storage | Analytics           |
|  ------------+------------------+-------------------+---------------------|
|  India/APAC  | India DC         | India DC          | India DC            |
|  UK          | UK DC (London)   | UK DC             | UK DC               |
|  EU          | EU DC (Frankfurt)| EU DC             | EU DC               |
|  Americas    | US DC            | US DC             | US DC               |
|                                                                             |
|  [!]️ CRITICAL: India Contact Center data MUST reside in India DC          |
|     for DoT/TRAI compliance. This is configurable in Control Hub.         |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.2.3 WxCC Licensing Design

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH WxCC LICENSING REQUIREMENTS                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  LICENSE TYPE           | QUANTITY | UNIT COST | ANNUAL COST | NOTES       |
|  -----------------------+----------+-----------+-------------+-------------|
|  Standard Agent         |      100 | $XXX/mo   | $XX,XXX     | Voice only  |
|  Premium Agent          |       75 | $XXX/mo   | $XX,XXX     | Voice+Digital|
|  Supervisor             |       10 | $XXX/mo   | $X,XXX      | Monitoring  |
|  -----------------------+----------+-----------+-------------+-------------|
|  Webex AI Agent         |        1 | $XXX/mo   | $XX,XXX     | Virtual Agnt|
|  Agent Assist           |      175 | Included  | Included    | In Premium  |
|  -----------------------+----------+-----------+-------------+-------------|
|  WFO (Recording)        |      175 | $XXX/mo   | $XX,XXX     | All agents  |
|  WFO (QM)               |       50 | $XXX/mo   | $X,XXX      | Evaluation  |
|  WFO (WFM)              |      175 | $XXX/mo   | $XX,XXX     | Scheduling  |
|  -----------------------+----------+-----------+-------------+-------------|
|                                                                             |
|  ADDON CHANNELS:                                                           |
|  * WhatsApp Business: Via CCAI/Partner connector                          |
|  * Facebook Messenger: Native connector available                          |
|  * SMS: Via CCPP provider                                                  |
|                                                                             |
|  LICENSE DISTRIBUTION BY SITE:                                             |
|  -----------------------------                                             |
|  Mumbai HQ:   80 Standard + 40 Premium = 120 agents                       |
|  Chennai:     15 Standard + 15 Premium = 30 agents                        |
|  London:      5 Standard + 10 Premium = 15 agents                         |
|  New Jersey:  0 Standard + 10 Premium = 10 agents                         |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.2.4 WxCC to Webex Calling Integration

```
+-----------------------------------------------------------------------------+
|              WxCC - WEBEX CALLING INTEGRATION ARCHITECTURE                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|                     +-----------------------------+                         |
|                     |     PSTN / TOLL-FREE        |                         |
|                     |  1800-266-1000 (India TF)   |                         |
|                     |  +91-22-4960-1000 (Mumbai)  |                         |
|                     |  +44-20-XXXX-XXXX (London)  |                         |
|                     |  +1-201-XXX-XXXX (NJ)       |                         |
|                     +--------------+--------------+                         |
|                                    |                                        |
|                          PSTN Routing                                       |
|                     (LGW India / CCPP EMEA-US)                             |
|                                    |                                        |
|                                    v                                        |
|                     +-----------------------------+                         |
|                     |     WEBEX CALLING           |                         |
|                     |     (PSTN Termination)      |                         |
|                     +--------------+--------------+                         |
|                                    |                                        |
|                          Internal Routing                                   |
|                     (DN to Entry Point Mapping)                            |
|                                    |                                        |
|                                    v                                        |
|                     +-----------------------------+                         |
|                     |   WEBEX CONTACT CENTER      |                         |
|                     |   +---------------------+   |                         |
|                     |   |   ENTRY POINT       |   |                         |
|                     |   |   Sales_Voice_EP    |   |                         |
|                     |   |   Support_Voice_EP  |   |                         |
|                     |   +---------+-----------+   |                         |
|                     |             |               |                         |
|                     |             v               |                         |
|                     |   +---------------------+   |                         |
|                     |   |   FLOW DESIGNER     |   |                         |
|                     |   |   (IVR Processing)  |   |                         |
|                     |   +---------+-----------+   |                         |
|                     |             |               |                         |
|                     |             v               |                         |
|                     |   +---------------------+   |                         |
|                     |   |   QUEUES            |   |                         |
|                     |   |   (Skills-Based)    |   |                         |
|                     |   +---------+-----------+   |                         |
|                     |             |               |                         |
|                     |             v               |                         |
|                     |   +---------------------+   |                         |
|                     |   |   AGENT DESKTOP     |   |                         |
|                     |   |   (WebRTC/Webex App)|   |                         |
|                     |   +---------------------+   |                         |
|                     +-----------------------------+                         |
|                                                                             |
|  INTEGRATION METHOD: Native (Webex Calling to WxCC built-in)              |
|  TELEPHONY OPTION:   Webex Calling (Phase 1 migrated users)               |
|  AGENT ENDPOINT:     Webex App (softphone) or Desk Phone                  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 3.3 Entry Point Design 

## 3.3.1 Entry Point Strategy

Entry Points in Webex Contact Center serve as the ingress for all customer interactions. Each Entry Point maps to one or more phone numbers (DIDs) and routes calls to a specific Flow Designer flow.

```
+-----------------------------------------------------------------------------+
|              ENTRY POINT DESIGN STRATEGY                                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  UCCX APPROACH           | WXCC APPROACH            | MIGRATION IMPACT      |
|  ------------------------+--------------------------+-----------------------|
|  Single trigger per DN   | Entry Point per DN       | 1:1 mapping           |
|  CTI Route Point         | Entry Point + Flow       | Redesign routing      |
|  Application association | Entry Point Mapping      | Reconfigure in CH     |
|  ------------------------+--------------------------+-----------------------|
|                                                                             |
|  ABHAVTECH ENTRY POINT STRATEGY:                                           |
|  ===============================                                           |
|                                                                             |
|  1. REGIONAL ENTRY POINTS                                                  |
|     - Separate Entry Points per region (India, EMEA, Americas)             |
|     - Enables regional compliance and routing                              |
|     - Regional prompts and languages                                       |
|                                                                             |
|  2. FUNCTIONAL ENTRY POINTS                                                |
|     - Sales vs Support separation                                          |
|     - Different IVR treatments per function                                |
|     - Dedicated SLA tracking                                               |
|                                                                             |
|  3. CHANNEL ENTRY POINTS                                                   |
|     - Voice Entry Points (primary)                                         |
|     - Digital Entry Points (chat, WhatsApp, email)                        |
|     - Consistent customer experience across channels                       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.3.2 Entry Point Configuration Specifications

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH WXCC ENTRY POINT SPECIFICATIONS                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ENTRY POINT          | CHANNEL | DIAL NUMBER(S)       | FLOW              |
|  ========================================================================= |
|                                                                             |
|  EP-01: INDIA_MAIN_EP                                                      |
|  -------------------------------------------------------------------------  |
|  Name:                 India_Main_Voice_EP                                 |
|  Description:          Primary India voice entry - Sales & Support         |
|  Channel Type:         Telephony                                           |
|  Dial Numbers:         1800-266-1000 (India Toll-Free)                     |
|                        +91-22-4960-1000 (Mumbai Direct)                    |
|  Service Level:        30 seconds / 80%                                    |
|  Routing Flow:         India_MainMenu_Flow_v1                              |
|  Business Hours:       24x7 (Mumbai)                                       |
|  Overflow:             Voicemail after 300 seconds                         |
|  Recording:            All calls (consent-based)                           |
|  Data Residency:       India DC                                            |
|                                                                             |
|  EP-02: INDIA_SALES_EP                                                     |
|  -------------------------------------------------------------------------  |
|  Name:                 India_Sales_Voice_EP                                |
|  Description:          Dedicated India sales line                          |
|  Channel Type:         Telephony                                           |
|  Dial Numbers:         1800-266-1001 (Sales Toll-Free)                     |
|  Service Level:        20 seconds / 85%                                    |
|  Routing Flow:         India_Sales_Direct_Flow_v1                          |
|  Business Hours:       9:00 AM - 9:00 PM IST                               |
|  After Hours:          Route to India_Main_Voice_EP                        |
|  Priority:             High (sales revenue)                                |
|                                                                             |
|  EP-03: EMEA_MAIN_EP                                                       |
|  -------------------------------------------------------------------------  |
|  Name:                 EMEA_Main_Voice_EP                                  |
|  Description:          EMEA (UK/EU) voice entry point                      |
|  Channel Type:         Telephony                                           |
|  Dial Numbers:         +44-20-XXXX-XXXX (UK)                               |
|                        +49-69-XXXX-XXXX (Germany - future)                 |
|  Service Level:        30 seconds / 80%                                    |
|  Routing Flow:         EMEA_MainMenu_Flow_v1                               |
|  Business Hours:       9:00 AM - 6:00 PM GMT/CET                           |
|  After Hours:          Route to India_Main_Voice_EP (follow-the-sun)       |
|  Data Residency:       UK DC / EU DC                                       |
|                                                                             |
|  EP-04: AMERICAS_MAIN_EP                                                   |
|  -------------------------------------------------------------------------  |
|  Name:                 Americas_Main_Voice_EP                              |
|  Description:          Americas (US) voice entry point                     |
|  Channel Type:         Telephony                                           |
|  Dial Numbers:         +1-201-XXX-XXXX (New Jersey)                        |
|                        1-800-XXX-XXXX (US Toll-Free - future)              |
|  Service Level:        30 seconds / 80%                                    |
|  Routing Flow:         Americas_MainMenu_Flow_v1                           |
|  Business Hours:       9:00 AM - 6:00 PM EST                               |
|  After Hours:          Route to India_Main_Voice_EP (follow-the-sun)       |
|  Data Residency:       US DC                                               |
|                                                                             |
|  EP-05: DIGITAL_CHAT_EP                                                    |
|  -------------------------------------------------------------------------  |
|  Name:                 Global_Chat_EP                                      |
|  Description:          Web chat and WhatsApp entry                         |
|  Channel Type:         Chat                                                |
|  Asset:                Webex Connect widget / WhatsApp Business            |
|  Service Level:        15 seconds / 90%                                    |
|  Routing Flow:         Digital_Chat_Flow_v1                                |
|  Business Hours:       24x7 (Mumbai digital team)                          |
|                                                                             |
|  EP-06: DIGITAL_EMAIL_EP                                                   |
|  -------------------------------------------------------------------------  |
|  Name:                 Global_Email_EP                                     |
|  Description:          Email channel entry point                           |
|  Channel Type:         Email                                               |
|  Email Address:        support@abhavtech.com                               |
|  Service Level:        4 hours / 80%                                       |
|  Routing Flow:         Digital_Email_Flow_v1                               |
|  Business Hours:       Business hours (email SLA)                          |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.3.3 Entry Point Provisioning Steps

```
+-----------------------------------------------------------------------------+
|              ENTRY POINT PROVISIONING - STEP BY STEP                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  STEP 1: Access Control Hub                                                |
|  =========================                                                 |
|  1. Navigate to: admin.webex.com                                           |
|  2. Login with admin credentials                                           |
|  3. Select: Contact Center from Services menu                              |
|  4. Navigate to: Provisioning > Entry Points                               |
|                                                                             |
|  STEP 2: Create Entry Point (Example: India_Main_Voice_EP)                 |
|  =========================================================                 |
|  1. Click: "Create Entry Point"                                            |
|  2. General Settings:                                                      |
|     - Name: India_Main_Voice_EP                                            |
|     - Description: Primary India voice entry - Sales & Support             |
|     - Entry Point Type: Inbound                                            |
|     - Channel Type: Telephony                                              |
|                                                                             |
|  3. Routing Settings:                                                      |
|     - Routing Flow: India_MainMenu_Flow_v1 (select from dropdown)          |
|       (Note: Flow must be created first - see Section 3.6)                 |
|                                                                             |
|  4. Service Level Settings:                                                |
|     - Service Level Threshold: 30 (seconds)                                |
|     - Service Level Percentage: 80%                                        |
|                                                                             |
|  5. Advanced Settings:                                                     |
|     - Enable Recording: Yes                                                |
|     - Recording Pause Resume: Yes (for consent)                            |
|     - Enable Reporting: Yes                                                |
|                                                                             |
|  6. Click "Save"                                                           |
|  7. Note Entry Point ID: _______________                                   |
|                                                                             |
|  STEP 3: Map Dial Number to Entry Point                                    |
|  ========================================                                  |
|  1. Navigate to: Provisioning > Entry Point Mappings                       |
|  2. Click: "Create Mapping"                                                |
|  3. Select:                                                                |
|     - Entry Point: India_Main_Voice_EP                                     |
|     - Dial Number: 18001234567 (from Webex Calling)                       |
|  4. Click "Save"                                                           |
|  5. Repeat for additional numbers (+91-22-4960-1000)                       |
|                                                                             |
|  STEP 4: Verify Entry Point Status                                         |
|  ===================================                                       |
|  1. Entry Point status should show: "Active"                               |
|  2. Mapping status should show: "Configured"                               |
|  3. Test: Place a call to the mapped number                                |
|     - Expected: Call arrives at Entry Point                                |
|     - Expected: Flow Designer flow executes                                |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 3.4 Queue Design 

## 3.4.1 Queue Design Strategy

```
+-----------------------------------------------------------------------------+
|              QUEUE DESIGN STRATEGY - UCCX TO WXCC MIGRATION                  |
+-----------------------------------------------------------------------------+
|                                                                             |
|  UCCX CSQ           | WXCC QUEUE              | MIGRATION NOTES             |
|  -------------------+-------------------------+-----------------------------|
|  Sales_India_CSQ    | Sales_India_Queue       | Direct migration            |
|  Sales_EMEA_CSQ     | Sales_EMEA_Queue        | Direct migration            |
|  Sales_Americas_CSQ | Sales_Americas_Queue    | Direct migration            |
|  Support_CSQ        | Support_General_Queue   | Split by region             |
|                     | Support_India_Queue     | (new regional queues)       |
|                     | Support_EMEA_Queue      |                             |
|  Billing_CSQ        | Billing_Queue           | Direct migration            |
|  TechSupport_CSQ    | TechSupport_Queue       | Direct migration            |
|  Email_CSQ          | Digital_Email_Queue     | Rename + enhance            |
|  Chat_CSQ           | Digital_Chat_Queue      | Add WhatsApp                |
|  -------------------+-------------------------+-----------------------------|
|  TOTAL: 6 CSQs      | TOTAL: 10 Queues        | +4 new queues (regional)    |
|                                                                             |
|  QUEUE DESIGN PRINCIPLES:                                                  |
|  ========================                                                  |
|  1. One queue per major function + region combination                      |
|  2. Skills-based routing within each queue                                 |
|  3. Overflow paths between queues (regional -> global)                      |
|  4. Consistent SLA thresholds per queue type                               |
|  5. Queue-level reporting for KPI tracking                                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.4.2 Queue Configuration Specifications

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH WXCC QUEUE SPECIFICATIONS                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  QUEUE               | CHANNEL | SL    | MAX Q | ROUTING    | TEAM         |
|  ========================================================================  |
|                                                                             |
|  Q-01: Sales_India_Queue                                                   |
|  -------------------------------------------------------------------------  |
|  Name:               Sales_India_Queue                                     |
|  Description:        India B2C/B2B sales inquiries                         |
|  Channel Type:       Telephony                                             |
|  Queue Type:         Inbound                                               |
|  Service Level:      30 seconds                                            |
|  Max Time in Queue:  300 seconds (5 minutes)                               |
|  Routing Type:       Skills-Based (Longest Available Agent)                |
|  Skills Required:    Sales = TRUE, Region_India = TRUE                     |
|  Skill Relaxation:   After 120s: Remove Region_India                       |
|  Assigned Team:      India_Sales_Team                                      |
|  Overflow Action:    After max queue -> Voicemail_EP                        |
|  Music on Hold:      abhavtech_hold_music.wav                              |
|  Comfort Messages:   Every 60 seconds                                      |
|                                                                             |
|  Q-02: Sales_EMEA_Queue                                                    |
|  -------------------------------------------------------------------------  |
|  Name:               Sales_EMEA_Queue                                      |
|  Description:        UK/EU sales inquiries                                 |
|  Channel Type:       Telephony                                             |
|  Service Level:      30 seconds                                            |
|  Max Time in Queue:  300 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Sales = TRUE, Region_EMEA = TRUE                      |
|  Skill Relaxation:   After 90s: Add Region_India (follow-the-sun)          |
|  Assigned Team:      EMEA_Sales_Team, India_Sales_Team (backup)            |
|  After Hours:        Route to Sales_India_Queue                            |
|                                                                             |
|  Q-03: Sales_Americas_Queue                                                |
|  -------------------------------------------------------------------------  |
|  Name:               Sales_Americas_Queue                                  |
|  Description:        US/Americas sales inquiries                           |
|  Channel Type:       Telephony                                             |
|  Service Level:      30 seconds                                            |
|  Max Time in Queue:  300 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Sales = TRUE, Region_Americas = TRUE                  |
|  Skill Relaxation:   After 90s: Add Region_India                           |
|  Assigned Team:      Americas_Sales_Team, India_Sales_Team (backup)        |
|  After Hours:        Route to Sales_India_Queue                            |
|                                                                             |
|  Q-04: Support_India_Queue                                                 |
|  -------------------------------------------------------------------------  |
|  Name:               Support_India_Queue                                   |
|  Description:        India customer support                                |
|  Channel Type:       Telephony                                             |
|  Service Level:      45 seconds                                            |
|  Max Time in Queue:  600 seconds (10 minutes)                              |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Support = TRUE                                        |
|  Skills Preferred:   Hindi = TRUE (priority if available)                  |
|  Assigned Team:      India_Support_Team                                    |
|  Callback Option:    Offer callback after 180 seconds                      |
|                                                                             |
|  Q-05: Support_EMEA_Queue                                                  |
|  -------------------------------------------------------------------------  |
|  Name:               Support_EMEA_Queue                                    |
|  Description:        UK/EU customer support                                |
|  Channel Type:       Telephony                                             |
|  Service Level:      45 seconds                                            |
|  Max Time in Queue:  600 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Support = TRUE, Region_EMEA = TRUE                    |
|  Assigned Team:      EMEA_Support_Team, India_Support_Team (backup)        |
|  After Hours:        Route to Support_India_Queue                          |
|                                                                             |
|  Q-06: Billing_Queue                                                       |
|  -------------------------------------------------------------------------  |
|  Name:               Billing_Queue                                         |
|  Description:        Global billing and payment inquiries                  |
|  Channel Type:       Telephony                                             |
|  Service Level:      30 seconds                                            |
|  Max Time in Queue:  300 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Billing = TRUE                                        |
|  Assigned Team:      Billing_Team (Mumbai only)                            |
|  Security:           PCI-DSS compliant (pause recording for card data)     |
|                                                                             |
|  Q-07: TechSupport_Queue                                                   |
|  -------------------------------------------------------------------------  |
|  Name:               TechSupport_Queue                                     |
|  Description:        Technical product support                             |
|  Channel Type:       Telephony                                             |
|  Service Level:      60 seconds                                            |
|  Max Time in Queue:  900 seconds (15 minutes - complex issues)             |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    TechnicalSupport = TRUE                               |
|  Skills Preferred:   ProductA/ProductB/ProductC (based on selection)       |
|  Assigned Team:      TechSupport_Team                                      |
|  Screen Pop:         CRM ticket lookup on answer                           |
|                                                                             |
|  Q-08: Digital_Chat_Queue                                                  |
|  -------------------------------------------------------------------------  |
|  Name:               Digital_Chat_Queue                                    |
|  Description:        Web chat and WhatsApp                                 |
|  Channel Type:       Chat                                                  |
|  Service Level:      15 seconds                                            |
|  Max Time in Queue:  120 seconds                                           |
|  Concurrent Chats:   3 per agent                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Digital_Channels = TRUE                               |
|  Assigned Team:      Digital_Team                                          |
|  Auto-Response:      "Thank you for contacting Abhavtech..."               |
|                                                                             |
|  Q-09: Digital_Email_Queue                                                 |
|  -------------------------------------------------------------------------  |
|  Name:               Digital_Email_Queue                                   |
|  Description:        Email support channel                                 |
|  Channel Type:       Email                                                 |
|  Service Level:      4 hours                                               |
|  Max Time in Queue:  24 hours                                              |
|  Concurrent Emails:  5 per agent                                           |
|  Routing Type:       Round Robin                                           |
|  Assigned Team:      Digital_Team                                          |
|  Auto-Response:      "We received your email. Ticket #..."                 |
|                                                                             |
|  Q-10: Callback_Queue                                                      |
|  -------------------------------------------------------------------------  |
|  Name:               Callback_Queue                                        |
|  Description:        Scheduled callback requests                           |
|  Channel Type:       Telephony (Outbound)                                  |
|  Queue Type:         Outbound                                              |
|  Service Level:      Within scheduled window                               |
|  Routing Type:       Skills-Based (match original request)                 |
|  Assigned Team:      All teams (based on callback type)                    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.4.3 Queue Provisioning Steps

```
+-----------------------------------------------------------------------------+
|              QUEUE PROVISIONING - STEP BY STEP                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  STEP 1: Create Queue (Example: Sales_India_Queue)                         |
|  ==================================================                        |
|  1. Navigate: Contact Center > Provisioning > Queues                       |
|  2. Click: "Create Queue"                                                  |
|                                                                             |
|  3. General Settings:                                                      |
|     - Name: Sales_India_Queue                                              |
|     - Description: India B2C/B2B sales inquiries                           |
|     - Queue Type: Inbound Queue                                            |
|     - Channel Type: Telephony                                              |
|                                                                             |
|  4. Service Level Settings:                                                |
|     - Service Level Threshold: 30                                          |
|     - Maximum Time in Queue: 300                                           |
|                                                                             |
|  5. Routing Settings:                                                      |
|     - Call Distribution: Longest Available Agent                           |
|     - Skills Based Selection: Enabled                                      |
|     - Skills Requirements:                                                 |
|       Click "Add Skill Requirement"                                        |
|       - Skill: Sales                                                       |
|       - Operator: Equal To                                                 |
|       - Value: TRUE                                                        |
|       - Required: Yes                                                      |
|       Click "Add Skill Requirement"                                        |
|       - Skill: Region_India                                                |
|       - Operator: Equal To                                                 |
|       - Value: TRUE                                                        |
|       - Required: Yes                                                      |
|                                                                             |
|  6. Team Assignment:                                                       |
|     - Primary Team: India_Sales_Team                                       |
|     - (Team must be created first - see Team Provisioning)                 |
|                                                                             |
|  7. Skill Relaxation (Advanced):                                           |
|     - Enable Skill Relaxation: Yes                                         |
|     - After 120 seconds:                                                   |
|       Remove skill requirement: Region_India                               |
|       (Allows overflow to other regions)                                   |
|                                                                             |
|  8. Music and Messages:                                                    |
|     - Music On Hold: abhavtech_hold_music.wav                              |
|     - Comfort Message: "Your call is important to us..."                   |
|     - Comfort Message Interval: 60 seconds                                 |
|                                                                             |
|  9. Click "Save"                                                           |
|  10. Note Queue ID: _______________                                        |
|                                                                             |
|  REPEAT for each queue in the specifications above.                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 3.5 Skills and Routing Design 

## 3.5.1 Skills Inventory (WxCC)

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH WXCC SKILLS INVENTORY                                 |
+-----------------------------------------------------------------------------+
|                                                                             |
|  SKILL NAME           | TYPE       | VALUES/RANGE | AGENTS | MIGRATION     |
|  ========================================================================= |
|                                                                             |
|  FUNCTIONAL SKILLS (Business Function)                                     |
|  -------------------------------------------------------------------------  |
|  Sales                | Boolean    | True/False   |     65 | From UCCX     |
|  Support              | Boolean    | True/False   |     55 | From UCCX     |
|  Billing              | Boolean    | True/False   |     15 | From UCCX     |
|  TechnicalSupport     | Boolean    | True/False   |     15 | From UCCX     |
|  Digital_Channels     | Boolean    | True/False   |     25 | From UCCX     |
|                                                                             |
|  LANGUAGE SKILLS                                                           |
|  -------------------------------------------------------------------------  |
|  English              | Proficiency| 1-10         |    175 | Enhanced      |
|  Hindi                | Proficiency| 1-10         |     80 | Enhanced      |
|  Tamil                | Proficiency| 1-10         |     15 | NEW (Phase 3) |
|  German               | Proficiency| 1-10         |      5 | NEW (Phase 3) |
|                                                                             |
|  REGIONAL SKILLS                                                           |
|  -------------------------------------------------------------------------  |
|  Region_India         | Boolean    | True/False   |    150 | NEW           |
|  Region_EMEA          | Boolean    | True/False   |     15 | NEW           |
|  Region_Americas      | Boolean    | True/False   |     10 | NEW           |
|                                                                             |
|  PRODUCT SKILLS                                                            |
|  -------------------------------------------------------------------------  |
|  ProductA_Expert      | Proficiency| 1-10         |      8 | From UCCX     |
|  ProductB_Expert      | Proficiency| 1-10         |      7 | From UCCX     |
|  ProductC_Expert      | Proficiency| 1-10         |      5 | NEW           |
|                                                                             |
|  SPECIAL SKILLS                                                            |
|  -------------------------------------------------------------------------  |
|  VIP_Handler          | Boolean    | True/False   |     10 | NEW           |
|  Escalation_Handler   | Boolean    | True/False   |      5 | NEW           |
|  Callback_Qualified   | Boolean    | True/False   |     50 | NEW           |
|                                                                             |
|  ========================================================================= |
|  TOTAL SKILLS: 18 (vs 8 in UCCX)                                           |
|  NEW SKILLS: 10 (regional, language proficiency, special handling)         |
|                                                                             |
|  PROFICIENCY SCALE:                                                        |
|  1-3: Basic (can handle simple inquiries)                                  |
|  4-6: Intermediate (standard handling)                                     |
|  7-9: Advanced (complex issues)                                            |
|  10: Expert (training others, escalation point)                            |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.5.2 Skill Profile Design

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH SKILL PROFILE SPECIFICATIONS                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PROFILE NAME         | SKILLS INCLUDED                    | AGENT COUNT   |
|  ========================================================================= |
|                                                                             |
|  SP-01: Sales_India_EN_HI                                                  |
|  -------------------------------------------------------------------------  |
|  Description:         India sales agent - English & Hindi                  |
|  Skills:              Sales=TRUE, Region_India=TRUE                        |
|                       English=7, Hindi=7                                   |
|  Agent Count:         35                                                   |
|                                                                             |
|  SP-02: Sales_India_EN                                                     |
|  -------------------------------------------------------------------------  |
|  Description:         India sales agent - English only                     |
|  Skills:              Sales=TRUE, Region_India=TRUE                        |
|                       English=8, Hindi=3                                   |
|  Agent Count:         10                                                   |
|                                                                             |
|  SP-03: Sales_EMEA                                                         |
|  -------------------------------------------------------------------------  |
|  Description:         EMEA sales agent                                     |
|  Skills:              Sales=TRUE, Region_EMEA=TRUE                         |
|                       English=9                                            |
|  Agent Count:         12                                                   |
|                                                                             |
|  SP-04: Sales_Americas                                                     |
|  -------------------------------------------------------------------------  |
|  Description:         Americas sales agent                                 |
|  Skills:              Sales=TRUE, Region_Americas=TRUE                     |
|                       English=9                                            |
|  Agent Count:         8                                                    |
|                                                                             |
|  SP-05: Support_India_General                                              |
|  -------------------------------------------------------------------------  |
|  Description:         India support agent - general                        |
|  Skills:              Support=TRUE, Region_India=TRUE                      |
|                       English=7, Hindi=6                                   |
|  Agent Count:         40                                                   |
|                                                                             |
|  SP-06: Support_Billing                                                    |
|  -------------------------------------------------------------------------  |
|  Description:         Billing specialist                                   |
|  Skills:              Support=TRUE, Billing=TRUE                           |
|                       English=8                                            |
|  Agent Count:         15                                                   |
|                                                                             |
|  SP-07: TechSupport_ProductA                                               |
|  -------------------------------------------------------------------------  |
|  Description:         Technical support - Product A expert                 |
|  Skills:              TechnicalSupport=TRUE, ProductA_Expert=8             |
|                       English=8                                            |
|  Agent Count:         8                                                    |
|                                                                             |
|  SP-08: TechSupport_ProductB                                               |
|  -------------------------------------------------------------------------  |
|  Description:         Technical support - Product B expert                 |
|  Skills:              TechnicalSupport=TRUE, ProductB_Expert=8             |
|                       English=8                                            |
|  Agent Count:         7                                                    |
|                                                                             |
|  SP-09: Digital_Support                                                    |
|  -------------------------------------------------------------------------  |
|  Description:         Digital channel agent (chat, email)                  |
|  Skills:              Digital_Channels=TRUE, Support=TRUE                  |
|                       English=8, Hindi=5                                   |
|  Agent Count:         25                                                   |
|                                                                             |
|  SP-10: VIP_Handler                                                        |
|  -------------------------------------------------------------------------  |
|  Description:         VIP customer handler                                 |
|  Skills:              VIP_Handler=TRUE, Sales=TRUE, Support=TRUE           |
|                       English=9, Hindi=7                                   |
|  Agent Count:         10                                                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.5.3 Routing Logic Design

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH ROUTING LOGIC - DECISION FRAMEWORK                    |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ROUTING DECISION FLOW:                                                    |
|  =======================                                                   |
|                                                                             |
|  +------------------+                                                      |
|  | Call Arrives at  |                                                      |
|  | Entry Point      |                                                      |
|  +--------+---------+                                                      |
|           |                                                                |
|           v                                                                |
|  +------------------+     +------------------+                            |
|  | IVR Flow         |---->| Determine:       |                            |
|  | (Language, Menu) |     | - Language       |                            |
|  +------------------+     | - Function       |                            |
|                           | - Priority       |                            |
|                           +--------+---------+                            |
|                                    |                                       |
|                                    v                                       |
|  +-----------------------------------------------------------------+      |
|  |                     SKILL REQUIREMENTS SET                       |      |
|  +-----------------------------------------------------------------+      |
|  |                                                                 |      |
|  |  Example: Sales call, Hindi selected, from India Entry Point    |      |
|  |                                                                 |      |
|  |  Required Skills:                                               |      |
|  |  +- Sales = TRUE                                                |      |
|  |  +- Region_India = TRUE                                         |      |
|  |  +- Hindi >= 5 (proficiency)                                    |      |
|  |                                                                 |      |
|  |  Preferred Skills (if available):                               |      |
|  |  +- Hindi >= 7 (higher proficiency preferred)                   |      |
|  |                                                                 |      |
|  +-----------------------------------------------------------------+      |
|                                    |                                       |
|                                    v                                       |
|  +-----------------------------------------------------------------+      |
|  |                     AGENT SELECTION ALGORITHM                    |      |
|  +-----------------------------------------------------------------+      |
|  |                                                                 |      |
|  |  Priority Order:                                                |      |
|  |  1. Agents with ALL required skills AND highest proficiency     |      |
|  |  2. Among qualified agents: Longest Available Agent (LAA)       |      |
|  |  3. If tie: Round-robin selection                               |      |
|  |                                                                 |      |
|  +-----------------------------------------------------------------+      |
|                                    |                                       |
|                                    v                                       |
|  +-----------------------------------------------------------------+      |
|  |                     SKILL RELAXATION (OVERFLOW)                  |      |
|  +-----------------------------------------------------------------+      |
|  |                                                                 |      |
|  |  Wait Time    | Relaxation Action                               |      |
|  |  -------------+---------------------------------------------    |      |
|  |  0-60 sec     | Match all required + preferred skills           |      |
|  |  60-120 sec   | Match all required skills only                  |      |
|  |  120-180 sec  | Remove Region requirement (global pool)         |      |
|  |  180-300 sec  | Reduce language proficiency to minimum (3)      |      |
|  |  >300 sec     | Route to voicemail / callback offer             |      |
|  |                                                                 |      |
|  +-----------------------------------------------------------------+      |
|                                                                             |
|  PRIORITY BOOST CONDITIONS:                                                |
|  ==========================                                                |
|  * VIP Customer (CRM lookup): +2 priority levels                           |
|  * Repeat Caller (within 24hrs): +1 priority level                         |
|  * Negative Sentiment (AI detection): +1 priority level                    |
|  * Callback Request: Match original priority                               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 3.6 Flow Designer - IVR Migration 

## 3.6.1 Flow Migration Strategy

```
+-----------------------------------------------------------------------------+
|              UCCX TO FLOW DESIGNER - MIGRATION STRATEGY                      |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [!]️ CRITICAL UNDERSTANDING:                                                |
|  ===========================                                               |
|  There is NO automated migration tool from UCCX scripts to Flow Designer.  |
|  All flows must be MANUALLY RECREATED in Flow Designer.                    |
|  This is a RE-BUILD, not a CONVERSION.                                     |
|                                                                             |
|  MIGRATION APPROACH:                                                       |
|  ===================                                                       |
|                                                                             |
|  PHASE 1: DOCUMENT                                                         |
|  -----------------                                                         |
|  1. Export all UCCX scripts (.aef files)                                   |
|  2. Document each script's business logic as flowcharts                    |
|  3. Identify all dependencies (DB, external systems)                       |
|  4. Catalog all prompts and audio files                                    |
|  5. Map UCCX variables to WxCC flow variables                              |
|                                                                             |
|  PHASE 2: DESIGN                                                           |
|  ----------------                                                          |
|  1. Design equivalent flows in Flow Designer                               |
|  2. Identify WxCC-native alternatives for UCCX features                    |
|  3. Plan API integrations for database operations                          |
|  4. Design Virtual Agent integration points                                |
|                                                                             |
|  PHASE 3: BUILD                                                            |
|  -------------                                                             |
|  1. Create flows in Flow Designer (dev environment)                        |
|  2. Upload and configure audio prompts                                     |
|  3. Configure HTTP Request nodes for integrations                          |
|  4. Integrate with Dialogflow CX for AI capabilities                       |
|                                                                             |
|  PHASE 4: TEST                                                             |
|  ------------                                                              |
|  1. Unit test each flow independently                                      |
|  2. Integration test with backend systems                                  |
|  3. User acceptance testing (UAT)                                          |
|  4. Parallel operation with UCCX                                           |
|                                                                             |
|  PHASE 5: CUTOVER                                                          |
|  -------------                                                             |
|  1. Publish flows to production                                            |
|  2. Update Entry Point routing                                             |
|  3. Monitor and validate                                                   |
|  4. Decommission UCCX scripts                                              |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.6.2 UCCX Step to Flow Designer Activity Mapping

```
+-----------------------------------------------------------------------------+
|              UCCX STEP -> FLOW DESIGNER ACTIVITY - COMPLETE MAPPING           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  UCCX STEP              | FLOW DESIGNER ACTIVITY   | MIGRATION NOTES        |
|  =======================================================================   |
|                                                                             |
|  CALL HANDLING                                                             |
|  -----------------------+----------------------------+------------------    |
|  Accept                 | NewPhoneContact (implicit) | Auto on entry        |
|  Terminate              | Disconnect Contact         | Direct equivalent    |
|  Call Redirect          | Blind Transfer             | Transfer to DN       |
|  Consult Transfer       | Consult Transfer (Agent)   | Agent-initiated      |
|                                                                             |
|  MEDIA OPERATIONS                                                          |
|  -----------------------+----------------------------+------------------    |
|  Play Prompt            | Play Message               | Upload audio to      |
|                         |                            | Audio Files library  |
|  Get Digit String       | Collect Digits             | Similar config       |
|  Menu                   | Menu                       | DTMF menu            |
|  Record                 | Record                     | Built-in activity    |
|  Play Prompt (TTS)      | Play Message (TTS)         | Text-to-Speech       |
|                                                                             |
|  ROUTING                                                                   |
|  -----------------------+----------------------------+------------------    |
|  Select Resource        | Queue Contact              | Queue-based routing  |
|  (CSQ selection)        |                            |                      |
|  Get Contact Info       | Built-in Variables         | ANI, DNIS, etc.     |
|  Get Call Contact Info  | Contact Info Variables     | Session data         |
|                                                                             |
|  VARIABLES                                                                 |
|  -----------------------+----------------------------+------------------    |
|  Set Enterprise Info    | Set Variable               | Flow variables       |
|  Set Session Info       | Set Variable               | Global variables     |
|  Get/Set variable       | Set Variable               | Local/global         |
|                                                                             |
|  LOGIC & FLOW CONTROL                                                      |
|  -----------------------+----------------------------+------------------    |
|  If                     | Condition                  | Same logic           |
|  Switch                 | Case / Multiple Conditions | Branch logic         |
|  Goto                   | Connect nodes              | Visual connection    |
|  Label                  | Node naming                | Not needed           |
|  On Exception Goto      | Error Handling             | Global error path    |
|  Delay                  | Wait                       | Timed delay          |
|                                                                             |
|  DATABASE OPERATIONS                                                       |
|  -----------------------+----------------------------+------------------    |
|  DB Read                | HTTP Request               | REST API call        |
|  DB Write               | HTTP Request               | REST API call        |
|  DB Get                 | HTTP Request               | API middleware       |
|  (JDBC/ODBC)            | (JSON/REST)                | required             |
|                                                                             |
|  NOT SUPPORTED / ALTERNATIVES                                              |
|  =======================================================================   |
|                                                                             |
|  UCCX FEATURE           | WXCC ALTERNATIVE                                 |
|  -----------------------+----------------------------------------------    |
|  Finesse Gadget         | WxCC Agent Desktop widgets                       |
|  JTAPI Controls         | Not applicable (cloud)                           |
|  Custom Java Steps      | HTTP Request to external service                 |
|  Outbound Preview Dialer| WxCC Campaign Manager                            |
|  Send Email (script)    | HTTP Request to email API (SendGrid, etc.)       |
|  CTI Port monitoring    | WxCC Real-time reporting APIs                    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.6.3 Flow Design: India Main Menu (Detailed)

This section provides the complete Flow Designer configuration for the primary India IVR, migrated from UCCX MainMenu_EN.aef and MainMenu_HI.aef scripts.

```
+-----------------------------------------------------------------------------+
|              FLOW: India_MainMenu_Flow_v1                                    |
+-----------------------------------------------------------------------------+
|                                                                             |
|  FLOW METADATA:                                                            |
|  ================                                                          |
|  Flow Name:           India_MainMenu_Flow_v1                               |
|  Description:         Primary India IVR - Sales, Support, Billing, Tech    |
|  Entry Point:         India_Main_Voice_EP                                  |
|  Languages:           English (en-IN), Hindi (hi-IN)                       |
|  Source Scripts:      MainMenu_EN.aef, MainMenu_HI.aef (UCCX)              |
|  Version:             1.0                                                  |
|  Author:              Abhavtech CC Migration Team                          |
|                                                                             |
|  FLOW VARIABLES:                                                           |
|  ================                                                          |
|  selected_language    | String  | "en" or "hi"        | Language choice    |
|  menu_selection       | String  | "1","2","3","4"     | Main menu choice   |
|  customer_id          | String  | Customer ID         | From ANI lookup    |
|  customer_tier        | String  | "standard","vip"    | CRM lookup         |
|  consent_status       | String  | "pending","yes","no"| Recording consent  |
|  transfer_target      | String  | Queue name          | Routing decision   |
|  detected_intent      | String  | AI detected intent  | From Dialogflow    |
|  sentiment_score      | Number  | -1 to 1             | Sentiment value    |
|  business_hours       | Boolean | true/false          | Hours check        |
|  callback_requested   | Boolean | true/false          | Callback flag      |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Flow Diagram: India Main Menu

```
+-----------------------------------------------------------------------------+
|              INDIA_MAINMENU_FLOW_V1 - VISUAL FLOW DIAGRAM                    |
+-----------------------------------------------------------------------------+
|                                                                             |
|  START                                                                     |
|    |                                                                       |
|    v                                                                       |
|  +-----------------------------------------+                              |
|  | 1. NewPhoneContact                      |                              |
|  |    (Automatic - Call arrives)           |                              |
|  +----------------+------------------------+                              |
|                   |                                                        |
|                   v                                                        |
|  +-----------------------------------------+                              |
|  | 2. Set Variable: Initialize             |                              |
|  |    consent_status = "pending"           |                              |
|  |    selected_language = "en"             |                              |
|  |    callback_requested = false           |                              |
|  +----------------+------------------------+                              |
|                   |                                                        |
|                   v                                                        |
|  +-----------------------------------------+                              |
|  | 3. HTTP Request: Business Hours Check   |                              |
|  |    URL: {{ABHAVTECH_API}}/business-hours|                              |
|  |    Method: GET                          |                              |
|  |    Parse: business_hours = response.open|                              |
|  +----------------+------------------------+                              |
|                   |                                                        |
|           +-------+-------+                                               |
|           |               |                                               |
|           v               v                                               |
|    [business_hours    [business_hours                                     |
|     = TRUE]            = FALSE]                                           |
|           |               |                                               |
|           |               v                                               |
|           |    +-----------------------------------------+               |
|           |    | GOTO: AfterHours_Subflow               |               |
|           |    | (Closed message, callback, voicemail)  |               |
|           |    +-----------------------------------------+               |
|           |                                                               |
|           v                                                               |
|  +-----------------------------------------+                              |
|  | 4. Play Message: Welcome                |                              |
|  |    "Welcome to Abhavtech. This call     |                              |
|  |    may be recorded for quality.         |                              |
|  |    Press 1 to continue in English.      |                              |
|  |    Hindi ke liye 2 dabaiye."            |                              |
|  |    Audio: welcome_bilingual.wav         |                              |
|  +----------------+------------------------+                              |
|                   |                                                        |
|                   v                                                        |
|  +-----------------------------------------+                              |
|  | 5. Collect Digits: Language Selection   |                              |
|  |    Variable: language_choice            |                              |
|  |    Min Digits: 1                        |                              |
|  |    Max Digits: 1                        |                              |
|  |    Timeout: 5 seconds                   |                              |
|  |    No Input: Default to English (1)     |                              |
|  +----------------+------------------------+                              |
|                   |                                                        |
|           +-------+-------+                                               |
|           |               |                                               |
|           v               v                                               |
|      [1 pressed]    [2 pressed]                                           |
|           |               |                                               |
|           v               v                                               |
|  +----------------+ +----------------+                                   |
|  | Set Variable:  | | Set Variable:  |                                   |
|  | language="en"  | | language="hi"  |                                   |
|  +-------+--------+ +-------+--------+                                   |
|          |                  |                                             |
|          +--------+---------+                                             |
|                   |                                                        |
|                   v                                                        |
|  +-----------------------------------------+                              |
|  | 6. Condition: Check Language            |                              |
|  |    IF language = "en"                   |                              |
|  |       THEN: English prompts             |                              |
|  |       ELSE: Hindi prompts               |                              |
|  +----------------+------------------------+                              |
|                   |                                                        |
|                   v                                                        |
|  +-----------------------------------------+                              |
|  | 7. Virtual Agent: Intent Detection      |  <-- AI INTEGRATION         |
|  |    (Optional - can be DTMF-only)        |                              |
|  |    Dialogflow CX Agent: Abhi_VA         |                              |
|  |    Timeout: 5 seconds                   |                              |
|  |    Fallback: DTMF Menu                  |                              |
|  +----------------+------------------------+                              |
|                   |                                                        |
|           +-------+-------+                                               |
|           |               |                                               |
|           v               v                                               |
|    [Intent Detected]  [No Intent / DTMF]                                  |
|           |               |                                               |
|           |               v                                               |
|           |    +-----------------------------------------+               |
|           |    | 8. Play Message: Main Menu              |               |
|           |    |    [English Version]                    |               |
|           |    |    "Press 1 for Sales.                  |               |
|           |    |     Press 2 for Support.                |               |
|           |    |     Press 3 for Billing.                |               |
|           |    |     Press 4 for Technical Support.      |               |
|           |    |     Press 0 to speak with an agent."    |               |
|           |    |    Audio: main_menu_en.wav              |               |
|           |    +----------------+------------------------+               |
|           |                     |                                         |
|           |                     v                                         |
|           |    +-----------------------------------------+               |
|           |    | 9. Menu: Main Selection                 |               |
|           |    |    Variable: menu_selection             |               |
|           |    |    Options: 1, 2, 3, 4, 0               |               |
|           |    |    Invalid: Replay menu (max 3x)        |               |
|           |    +----------------+------------------------+               |
|           |                     |                                         |
|           +----------+----------+                                         |
|                      |                                                    |
|                      v                                                    |
|  +-----------------------------------------+                              |
|  | 10. Condition: Route by Selection       |                              |
|  |     SWITCH (menu_selection OR intent)   |                              |
|  +-----------------------------------------+                              |
|  | CASE "1" / "sales":                     |                              |
|  |   -> Queue: Sales_India_Queue            |                              |
|  |                                         |                              |
|  | CASE "2" / "support":                   |                              |
|  |   -> GOTO: Support_Submenu               |                              |
|  |                                         |                              |
|  | CASE "3" / "billing":                   |                              |
|  |   -> Queue: Billing_Queue                |                              |
|  |                                         |                              |
|  | CASE "4" / "tech_support":              |                              |
|  |   -> GOTO: TechSupport_Submenu           |                              |
|  |                                         |                              |
|  | CASE "0" / "agent":                     |                              |
|  |   -> Queue: Support_India_Queue (direct) |                              |
|  |                                         |                              |
|  | DEFAULT:                                |                              |
|  |   -> Replay menu / Transfer to agent     |                              |
|  +----------------+------------------------+                              |
|                   |                                                        |
|    +--------------+--------------+                                        |
|    |              |              |                                        |
|    v              v              v                                        |
|  [Sales]     [Support_SM]   [Queue]                                       |
|    |              |              |                                        |
|    v              v              v                                        |
|  +-----------------------------------------+                              |
|  | 11. Queue Contact                       |                              |
|  |     Queue: {{transfer_target}}          |                              |
|  |     Priority: {{customer_tier=="vip"    |                              |
|  |                ? "high" : "normal"}}    |                              |
|  |     Skills: Per queue configuration     |                              |
|  +----------------+------------------------+                              |
|                   |                                                        |
|                   v                                                        |
|  +-----------------------------------------+                              |
|  | 12. Play Music: Hold                    |                              |
|  |     Music: abhavtech_hold.wav           |                              |
|  |     Comfort: Every 60 seconds           |                              |
|  |     EWT Announcement: Yes               |                              |
|  +----------------+------------------------+                              |
|                   |                                                        |
|                   v                                                        |
|  END FLOW (Agent Answers or Overflow)                                     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.6.4 Prompt Migration Specifications

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH PROMPT MIGRATION - AUDIO FILE SPECIFICATIONS          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  AUDIO FORMAT REQUIREMENTS:                                                |
|  ==========================                                                |
|                                                                             |
|  UCCX FORMAT               | WXCC FORMAT             | ACTION              |
|  --------------------------+-------------------------+---------------------|
|  .wav (G.711 μ-law, 8kHz)  | .wav (PCM, 8kHz,       | Convert codec       |
|                            | 16-bit, mono)           |                     |
|  .wav (G.711 A-law, 8kHz)  | .wav (PCM, 8kHz,       | Convert codec       |
|                            | 16-bit, mono)           |                     |
|  .au files                 | .wav                    | Convert format      |
|  --------------------------+-------------------------+---------------------|
|                                                                             |
|  CONVERSION COMMANDS (FFmpeg):                                             |
|  ==============================                                            |
|                                                                             |
|  # Single file conversion                                                  |
|  ffmpeg -i input.wav -acodec pcm_s16le -ar 8000 -ac 1 output.wav          |
|                                                                             |
|  # Batch conversion (Linux/Mac)                                            |
|  for f in *.wav; do                                                        |
|    ffmpeg -i "$f" -acodec pcm_s16le -ar 8000 -ac 1 "converted_$f"         |
|  done                                                                      |
|                                                                             |
|  PROMPT INVENTORY:                                                         |
|  =================                                                         |
|                                                                             |
|  CATEGORY        | COUNT | LANGUAGE | UCCX FILE        | WXCC FILE        |
|  ----------------+-------+----------+------------------+------------------|
|  Welcome         |     2 | EN, HI   | welcome_en.wav   | welcome_en.wav   |
|                  |       |          | welcome_hi.wav   | welcome_hi.wav   |
|  Main Menu       |     2 | EN, HI   | mainmenu_en.wav  | mainmenu_en.wav  |
|  Sales Menu      |     2 | EN, HI   | sales_menu_*.wav | sales_menu_*.wav |
|  Support Menu    |     2 | EN, HI   | support_menu_*.* | support_menu_*.* |
|  Billing Menu    |     2 | EN, HI   | billing_menu_*.* | billing_menu_*.* |
|  Tech Support    |     2 | EN, HI   | tech_menu_*.wav  | tech_menu_*.wav  |
|  Queue Messages  |    12 | EN, HI   | queue_*.wav      | queue_*.wav      |
|  Hold Music      |     4 | N/A      | hold_*.wav       | hold_*.wav       |
|  After Hours     |     4 | EN, HI   | afterhours_*.wav | afterhours_*.wav |
|  Error Messages  |     6 | EN, HI   | error_*.wav      | error_*.wav      |
|  Callback        |     4 | EN, HI   | callback_*.wav   | callback_*.wav   |
|  Survey          |     6 | EN, HI   | survey_*.wav     | survey_*.wav     |
|  ----------------+-------+----------+------------------+------------------|
|  TOTAL           |    48 |          |                  |                  |
|  + System        |    39 |          |                  | (platform)       |
|  GRAND TOTAL     |    87 |          |                  |                  |
|                                                                             |
|  UPLOAD PROCEDURE:                                                         |
|  =================                                                         |
|  1. Navigate: Control Hub > Contact Center > Resources > Audio Files       |
|  2. Click: "Upload Audio Files"                                            |
|  3. Select converted .wav files (bulk upload supported)                    |
|  4. Organize in folders: /prompts/en/, /prompts/hi/, /music/               |
|  5. Reference in Flow Designer by path                                     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 3.7 Agent Desktop Design 

## 3.7.1 Agent Desktop Configuration

```
+-----------------------------------------------------------------------------+
|              WEBEX CONTACT CENTER AGENT DESKTOP DESIGN                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  DESKTOP TYPE: Webex Contact Center Agent Desktop (WebRTC)                 |
|  ACCESS URL:   desktop.wxcc.cisco.com                                      |
|  BROWSER:      Chrome (recommended), Edge, Firefox                         |
|  TELEPHONY:    WebRTC (primary) / Webex App / Desk Phone                   |
|                                                                             |
|  LAYOUT DESIGN:                                                            |
|  ==============                                                            |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  | HEADER BAR                                                          |   |
|  | +--------------------------------------------------------------+   |   |
|  | | [Abhavtech Logo]  Agent: Priya S.  | Status: Available v    |   |   |
|  | |                                     | Queue: Sales_India    |   |   |
|  | +--------------------------------------------------------------+   |   |
|  +---------------------------------------------------------------------+   |
|  | MAIN WORKSPACE                                                      |   |
|  | +-----------------------------+-------------------------------+   |   |
|  | | INTERACTION PANEL           | SCREEN POP / CRM              |   |   |
|  | |                             |                               |   |   |
|  | | +-------------------------+ | +---------------------------+ |   |   |
|  | | | Caller: +91-98XXX-XXXXX | | | Customer: Rajesh Kumar    | |   |   |
|  | | | Queue: Sales_India      | | | Account: ABV-00012345     | |   |   |
|  | | | Wait Time: 00:45        | | | Tier: Premium             | |   |   |
|  | | |                         | | | Last Contact: 15 Jan 2026 | |   |   |
|  | | | [Answer] [Decline]      | | |                           | |   |   |
|  | | +-------------------------+ | | Open Tickets: 2           | |   |   |
|  | |                             | | +-----------------------+ | |   |   |
|  | | CALL CONTROLS               | | | TKT-001: Billing Query| | |   |   |
|  | | +-------------------------+ | | | TKT-002: Product Info | | |   |   |
|  | | | [Hold] [Transfer]       | | | +-----------------------+ | |   |   |
|  | | | [Mute] [Conference]     | | |                           | |   |   |
|  | | | [Wrap-up] [End Call]    | | | [New Ticket] [View CRM]   | |   |   |
|  | | +-------------------------+ | +---------------------------+ |   |   |
|  | |                             |                               |   |   |
|  | | AI ASSISTANT PANEL          |                               |   |   |
|  | | +-------------------------+ |                               |   |   |
|  | | | Sentiment: 😊 Positive  | |                               |   |   |
|  | | |                         | |                               |   |   |
|  | | | Suggested Response:     | |                               |   |   |
|  | | | "I understand you have  | |                               |   |   |
|  | | | questions about your    | |                               |   |   |
|  | | | recent order..."        | |                               |   |   |
|  | | |                         | |                               |   |   |
|  | | | [Use] [Dismiss]         | |                               |   |   |
|  | | +-------------------------+ |                               |   |   |
|  | +-----------------------------+-------------------------------+   |   |
|  +---------------------------------------------------------------------+   |
|  | TASK LIST / QUEUE PANEL                                             |   |
|  | +--------------------------------------------------------------+   |   |
|  | | Active Tasks: 1 | Waiting: 12 | Chat: 2 | Email: 5           |   |   |
|  | +--------------------------------------------------------------+   |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.7.2 User Profile Configuration

```
+-----------------------------------------------------------------------------+
|              AGENT USER PROFILE SPECIFICATIONS                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PROFILE NAME         | ROLE        | PERMISSIONS                          |
|  ========================================================================= |
|                                                                             |
|  UP-01: Standard_Agent_Profile                                             |
|  -------------------------------------------------------------------------  |
|  Role:                Standard Agent                                       |
|  Agent Desktop:       [OK] Enabled                                            |
|  Multimedia Profile:  Voice + 2 concurrent chats                           |
|  Permissions:                                                              |
|    [OK] Answer/Make calls                                                     |
|    [OK] Hold/Resume                                                           |
|    [OK] Transfer (Blind/Consult)                                              |
|    [OK] Conference                                                            |
|    [OK] Wrap-up selection                                                     |
|    [OK] View queue statistics                                                 |
|    [X] Monitor other agents                                                  |
|    [X] Access reports                                                        |
|    [X] Change queue settings                                                 |
|                                                                             |
|  UP-02: Premium_Agent_Profile                                              |
|  -------------------------------------------------------------------------  |
|  Role:                Premium Agent                                        |
|  Agent Desktop:       [OK] Enabled                                            |
|  Multimedia Profile:  Voice + 3 concurrent chats + 5 emails                |
|  Additional:                                                               |
|    [OK] All Standard permissions                                              |
|    [OK] Access digital channels (WhatsApp, email)                             |
|    [OK] Agent Assist features                                                 |
|    [OK] Screen recording (training)                                           |
|                                                                             |
|  UP-03: Supervisor_Profile                                                 |
|  -------------------------------------------------------------------------  |
|  Role:                Supervisor                                           |
|  Agent Desktop:       [OK] Enabled (can take calls)                           |
|  Additional:                                                               |
|    [OK] All Premium permissions                                               |
|    [OK] Monitor agents (listen/whisper/barge)                                 |
|    [OK] View real-time dashboards                                             |
|    [OK] Access team reports                                                   |
|    [OK] Change agent states                                                   |
|    [OK] Re-skill agents (temporary)                                           |
|    [X] System configuration                                                  |
|                                                                             |
|  UP-04: Admin_Profile                                                      |
|  -------------------------------------------------------------------------  |
|  Role:                Administrator                                        |
|  Agent Desktop:       Optional                                             |
|  Additional:                                                               |
|    [OK] All Supervisor permissions                                            |
|    [OK] User provisioning                                                     |
|    [OK] Flow Designer access                                                  |
|    [OK] Queue/Entry Point configuration                                       |
|    [OK] Reporting and analytics                                               |
|    [OK] Audit log access                                                      |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 3.8 Digital Channel Design 

## 3.8.1 Digital Channel Strategy

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH DIGITAL CHANNEL DESIGN                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  CHANNEL          | CURRENT (UCCX) | TARGET (WXCC)  | TIMELINE             |
|  ========================================================================= |
|  Web Chat         | Basic          | Enhanced       | Phase 2 (immediate)  |
|  Email            | Manual inbox   | Integrated     | Phase 2 (immediate)  |
|  WhatsApp         | Not available  | WhatsApp Biz   | Phase 2 (Month 2)    |
|  Facebook         | Not available  | Messenger      | Phase 3 (optional)   |
|  SMS              | Not available  | Via CCPP       | Phase 3 (optional)   |
|  ========================================================================= |
|                                                                             |
|  DIGITAL AGENT CAPACITY:                                                   |
|  =======================                                                   |
|  Current Digital Agents:     25                                            |
|  Post-Migration Target:      50 (add 25 in Phase 3)                        |
|                                                                             |
|  CONCURRENCY LIMITS:                                                       |
|  Channel          | Concurrent Per Agent                                   |
|  Chat             | 3                                                      |
|  WhatsApp         | 3 (shared with Chat limit)                             |
|  Email            | 5                                                      |
|  Voice            | 1                                                      |
|                                                                             |
|  BLENDED AGENT MODEL:                                                      |
|  Digital agents can receive voice overflow during peak times.              |
|  Voice agents do NOT receive digital channels.                             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.8.2 Web Chat Configuration

```
+-----------------------------------------------------------------------------+
|              WEB CHAT WIDGET CONFIGURATION                                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  WIDGET DEPLOYMENT:                                                        |
|  ==================                                                        |
|  Widget Type:         Webex Connect Chat Widget                            |
|  Deployment:          JavaScript embed on www.abhavtech.com                |
|  Pages:               Support, Contact Us, Product pages                   |
|                                                                             |
|  WIDGET CODE SNIPPET:                                                      |
|  ====================                                                      |
|  <script>                                                                  |
|    !function(e,t){                                                         |
|      var n=document.createElement("script");                               |
|      n.type="text/javascript",                                             |
|      n.async=!0,                                                           |
|      n.src="https://chat.abhavtech.com/widget.js",                        |
|      n.onload=function(){                                                  |
|        WebexCCWidget.init({                                                |
|          orgId: "{{ABHAVTECH_ORG_ID}}",                                    |
|          entryPointId: "{{DIGITAL_CHAT_EP_ID}}",                          |
|          theme: {                                                          |
|            primaryColor: "#0066CC",                                        |
|            headerText: "Chat with Abhavtech",                              |
|            logo: "https://abhavtech.com/logo.png"                         |
|          },                                                                |
|          features: {                                                       |
|            fileUpload: true,                                               |
|            emoji: true,                                                    |
|            typing: true                                                    |
|          }                                                                 |
|        });                                                                 |
|      };                                                                    |
|      e.getElementsByTagName("head")[0].appendChild(n)                      |
|    }(document);                                                            |
|  </script>                                                                 |
|                                                                             |
|  PRE-CHAT FORM:                                                            |
|  ==============                                                            |
|  Required Fields:                                                          |
|    - Name (text)                                                           |
|    - Email (email, validated)                                              |
|    - Topic (dropdown: Sales, Support, Billing, Other)                      |
|  Optional Fields:                                                          |
|    - Order Number (if Support selected)                                    |
|    - Phone (for callback)                                                  |
|                                                                             |
|  BUSINESS HOURS BEHAVIOR:                                                  |
|  ========================                                                  |
|  During Hours:       Chat widget active, route to Digital_Chat_Queue       |
|  After Hours:        Show message: "Our team is offline. Please email      |
|                      support@abhavtech.com or call back during business    |
|                      hours."                                               |
|  Alternative:        Enable Virtual Agent "Abhi" 24x7 for basic queries    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.8.3 WhatsApp Business Integration

```
+-----------------------------------------------------------------------------+
|              WHATSAPP BUSINESS INTEGRATION DESIGN                            |
+-----------------------------------------------------------------------------+
|                                                                             |
|  INTEGRATION METHOD:    Webex Connect (IMI) WhatsApp Connector             |
|  WHATSAPP NUMBER:       +91-22-XXXX-XXXX (dedicated business number)       |
|  BUSINESS ACCOUNT:      Verified Abhavtech Business Account                |
|                                                                             |
|  MESSAGE TYPES SUPPORTED:                                                  |
|  =======================                                                   |
|  [OK] Text messages                                                           |
|  [OK] Image attachments (customer sends)                                      |
|  [OK] Document attachments (PDF, invoice)                                     |
|  [OK] Location sharing                                                        |
|  [OK] Quick reply buttons                                                     |
|  [OK] List messages (menu selection)                                          |
|  [OK] Template messages (proactive notifications)                             |
|                                                                             |
|  TEMPLATE MESSAGES (Pre-approved):                                         |
|  ==================================                                        |
|  1. Order Confirmation:                                                    |
|     "Hi {{customer_name}}, your order #{{order_id}} has been confirmed.   |
|     Expected delivery: {{delivery_date}}. Track: {{tracking_link}}"       |
|                                                                             |
|  2. Shipping Update:                                                       |
|     "Your order #{{order_id}} has shipped! Track your package:            |
|     {{tracking_link}}"                                                     |
|                                                                             |
|  3. Appointment Reminder:                                                  |
|     "Reminder: Your appointment with Abhavtech is scheduled for           |
|     {{date}} at {{time}}. Reply YES to confirm or NO to reschedule."      |
|                                                                             |
|  4. Survey Request:                                                        |
|     "How was your experience with Abhavtech? Rate us 1-5:                 |
|     1️⃣ 2️⃣ 3️⃣ 4️⃣ 5️⃣"                                                      |
|                                                                             |
|  ROUTING FLOW:                                                             |
|  =============                                                             |
|  1. Customer sends WhatsApp message                                        |
|  2. Webex Connect receives message                                         |
|  3. Virtual Agent "Abhi" attempts to handle (if enabled)                   |
|  4. If handoff needed -> Route to Digital_Chat_Queue                        |
|  5. Agent receives in unified Agent Desktop                                |
|  6. Agent responds (appears as WhatsApp message to customer)               |
|                                                                             |
|  24-HOUR SESSION WINDOW:                                                   |
|  =======================                                                   |
|  [!]️ WhatsApp limits business-initiated messages outside 24-hour window.   |
|  After 24 hours of customer inactivity, only Template messages allowed.   |
|  Solution: Send proactive Template if follow-up needed after 24 hours.    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 3.9 AI Features Design 

## 3.9.1 Virtual Agent "Abhi" - Detailed Design

```
+-----------------------------------------------------------------------------+
|              VIRTUAL AGENT "ABHI" - COMPREHENSIVE DESIGN                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  VIRTUAL AGENT NAME:     Abhi (अभि)                                        |
|  PLATFORM:               Webex AI Agent (formerly Dialogflow CX option)    |
|  VOICE:                  Neural TTS - Indian English Male                  |
|  PERSONA:                Friendly, professional, helpful                   |
|                                                                             |
|  PHASED ROLLOUT:                                                           |
|  ===============                                                           |
|                                                                             |
|  PHASE 1 (Month 1-2): Foundation                                           |
|  -------------------------------------------------------------------------  |
|  * 10 core intents (English only)                                          |
|  * Basic FAQ handling                                                      |
|  * Order status lookup (API integration)                                   |
|  * Containment target: 25%                                                 |
|                                                                             |
|  PHASE 2 (Month 3-4): Enhancement                                          |
|  -------------------------------------------------------------------------  |
|  * 25 intents (add Hindi language)                                         |
|  * Account balance inquiry                                                 |
|  * Appointment scheduling                                                  |
|  * Containment target: 35%                                                 |
|                                                                             |
|  PHASE 3 (Month 5-6): Advanced                                             |
|  -------------------------------------------------------------------------  |
|  * 50 intents                                                              |
|  * Complex troubleshooting flows                                           |
|  * Proactive recommendations                                               |
|  * Containment target: 45%                                                 |
|                                                                             |
|  PHASE 4 (Month 7-12): Optimization                                        |
|  -------------------------------------------------------------------------  |
|  * Add Tamil, German                                                       |
|  * Continuous learning from interactions                                   |
|  * Abhavtech AI Platform integration                                       |
|  * Containment target: 50%+                                                |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.9.2 Intent Library - Phase 1 (Detailed)

```
+-----------------------------------------------------------------------------+
|              ABHI VIRTUAL AGENT - PHASE 1 INTENT LIBRARY                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  INTENT 01: greeting.hello                                                 |
|  ========================================================================= |
|  Purpose:          Welcome customers, establish rapport                    |
|  Channels:         Voice, Chat, WhatsApp                                   |
|                                                                             |
|  Training Phrases (20):                                                    |
|  ----------------------                                                    |
|  English:                                                                  |
|  - Hello                                                                   |
|  - Hi                                                                      |
|  - Good morning                                                            |
|  - Good afternoon                                                          |
|  - Good evening                                                            |
|  - Hey there                                                               |
|  - I need help                                                             |
|                                                                             |
|  Hinglish:                                                                 |
|  - Namaste                                                                 |
|  - Hello, kaise hain aap                                                   |
|  - Hi, mujhe help chahiye                                                  |
|  - Namaste, main call kar raha/rahi hoon                                   |
|                                                                             |
|  Response Template:                                                        |
|  ------------------                                                        |
|  "Hello! Welcome to Abhavtech. I'm Abhi, your virtual assistant.          |
|   I can help you with:                                                     |
|   * Order status and tracking                                              |
|   * Product information                                                    |
|   * Account inquiries                                                      |
|   * Connect you to an agent                                                |
|   How can I help you today?"                                               |
|                                                                             |
|  Follow-up Intents: order.status, product.inquiry, agent.handoff           |
|                                                                             |
|  ========================================================================= |
|  INTENT 02: order.status                                                   |
|  ========================================================================= |
|  Purpose:          Check order delivery status and tracking                |
|  Channels:         Voice, Chat, WhatsApp                                   |
|  Integration:      HTTP Request to Order Management API                    |
|                                                                             |
|  Training Phrases (30):                                                    |
|  ----------------------                                                    |
|  Direct queries:                                                           |
|  - Where is my order                                                       |
|  - Track my order                                                          |
|  - Order status                                                            |
|  - Check order status                                                      |
|  - What is my order status                                                 |
|  - Is my order shipped                                                     |
|  - Has my order shipped                                                    |
|  - When will my order arrive                                               |
|  - Delivery status                                                         |
|  - Package location                                                        |
|                                                                             |
|  With order number:                                                        |
|  - Order 12345 status                                                      |
|  - Track order 12345                                                       |
|  - Where is order number 12345                                             |
|  - Status of ORD-12345                                                     |
|  - Check ORD-12345                                                         |
|                                                                             |
|  Hinglish:                                                                 |
|  - Mera order kahan hai                                                    |
|  - Order ka status kya hai                                                 |
|  - Delivery kab hogi                                                       |
|  - Package kahan pohoncha                                                  |
|  - Mera saman kab aayega                                                   |
|                                                                             |
|  Frustrated:                                                               |
|  - My order is late                                                        |
|  - Why is my order delayed                                                 |
|  - This is taking too long                                                 |
|  - I want to know where my order is                                        |
|                                                                             |
|  Required Entities:                                                        |
|  ------------------                                                        |
|  @order_number:    Pattern: ORD-[0-9]{5,8} or numeric 5-8 digits          |
|  @customer_email:  Optional, for lookup if no order number                 |
|  @customer_phone:  Optional, for lookup from ANI                           |
|                                                                             |
|  API Integration:                                                          |
|  -----------------                                                         |
|  Endpoint:         {{ABHAVTECH_API}}/orders/{{order_number}}/status       |
|  Method:           GET                                                     |
|  Headers:          Authorization: Bearer {{API_TOKEN}}                     |
|  Response Fields:  status, shipped_date, carrier, tracking_number,        |
|                    estimated_delivery, current_location                    |
|                                                                             |
|  Response Templates:                                                       |
|  -------------------                                                       |
|  [Order Found - In Transit]:                                               |
|  "Your order {{order_number}} shipped on {{shipped_date}} via             |
|   {{carrier}}. It's currently {{current_location}}.                       |
|   Expected delivery: {{estimated_delivery}}.                              |
|   Track it here: {{tracking_link}}"                                       |
|                                                                             |
|  [Order Found - Delivered]:                                                |
|  "Great news! Your order {{order_number}} was delivered on                |
|   {{delivered_date}} at {{delivered_time}}.                               |
|   Is there anything else I can help with?"                                |
|                                                                             |
|  [Order Not Found]:                                                        |
|  "I couldn't find an order with that number. Could you please            |
|   double-check the order number? It should start with ORD- followed      |
|   by 5-8 digits. Or I can look it up using your email address."          |
|                                                                             |
|  ========================================================================= |
|  INTENT 03: agent.handoff                                                  |
|  ========================================================================= |
|  Purpose:          Transfer to human agent                                 |
|  Channels:         Voice, Chat, WhatsApp                                   |
|                                                                             |
|  Training Phrases (25):                                                    |
|  ----------------------                                                    |
|  - Talk to a human                                                         |
|  - Speak to an agent                                                       |
|  - Transfer me to a person                                                 |
|  - I want to talk to someone                                               |
|  - Human please                                                            |
|  - Get me a representative                                                 |
|  - Real person                                                             |
|  - Operator                                                                |
|  - Agent please                                                            |
|  - I don't want to talk to a bot                                           |
|  - Connect me to support                                                   |
|  - This is not helping                                                     |
|  - You're not understanding me                                             |
|                                                                             |
|  Hinglish:                                                                 |
|  - Agent se baat karani hai                                                |
|  - Kisi insaan se baat karao                                               |
|  - Mujhe kisi se baat karni hai                                            |
|  - Real person chahiye                                                     |
|                                                                             |
|  Handoff Action:                                                           |
|  ---------------                                                           |
|  1. Set context: intent=agent_request, reason=customer_requested          |
|  2. Generate context summary for agent                                     |
|  3. Route to appropriate queue based on conversation topic                 |
|  4. Provide estimated wait time                                            |
|                                                                             |
|  Response Before Handoff:                                                  |
|  ------------------------                                                  |
|  "Of course! I'll connect you with one of our team members right away.   |
|   Based on our conversation, I'll transfer you to our {{queue_name}}      |
|   team. The estimated wait time is {{wait_time}}.                         |
|   Please hold while I connect you."                                       |
|                                                                             |
|  ========================================================================= |
|  ADDITIONAL PHASE 1 INTENTS (Summary):                                     |
|  ========================================================================= |
|  04. product.inquiry      - Product information requests                   |
|  05. store.hours          - Business hours and location                    |
|  06. billing.balance      - Account balance inquiry                        |
|  07. return.policy        - Return and refund policy                       |
|  08. password.reset       - Password reset assistance                      |
|  09. greeting.goodbye     - Conversation closure                           |
|  10. fallback.default     - Unrecognized input handling                    |
|                                                                             |
|  TOTAL TRAINING PHRASES (Phase 1): ~200                                    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.9.3 Agent Assist Implementation

```
+-----------------------------------------------------------------------------+
|              CISCO AI ASSISTANT - AGENT ASSIST CONFIGURATION                 |
+-----------------------------------------------------------------------------+
|                                                                             |
|  FEATURE                    | STATUS   | CONFIGURATION                     |
|  ========================================================================= |
|                                                                             |
|  REAL-TIME FEATURES:                                                       |
|  -------------------------------------------------------------------------  |
|  Context Summaries          | Enabled  | Auto-generate on transfer         |
|  Description:               AI-generated summary when call transfers       |
|                             between agents or from Virtual Agent           |
|                                                                             |
|  Suggested Responses        | Enabled  | Top 3 suggestions                 |
|  Description:               Real-time response suggestions based on        |
|                             conversation context and knowledge base        |
|                                                                             |
|  Sentiment Analysis         | Enabled  | Real-time display                 |
|  Description:               Customer sentiment (Positive/Neutral/Negative) |
|                             displayed in Agent Desktop                     |
|  Escalation Trigger:        Alert supervisor if sentiment is Negative      |
|                             for >2 minutes                                 |
|                                                                             |
|  Dropped Call Summaries     | Enabled  | Save to CRM                       |
|  Description:               AI summary if customer disconnects, saved      |
|                             for callback context                           |
|                                                                             |
|  POST-CALL FEATURES:                                                       |
|  -------------------------------------------------------------------------  |
|  Auto CSAT Scoring          | Planned  | Q2 2026                           |
|  Description:               AI-predicted CSAT without customer survey      |
|                             Based on interaction analysis                  |
|                                                                             |
|  Call Summary               | Enabled  | Auto-generate                     |
|  Description:               Automatic call summary for agent wrap-up       |
|                             Editable before save                           |
|                                                                             |
|  AGENT WELLBEING:                                                          |
|  -------------------------------------------------------------------------  |
|  Burnout Detection          | Planned  | Q2 2026                           |
|  Description:               Monitor agent stress indicators                |
|                             Recommend wellness breaks                      |
|  Wellness Break Trigger:    After 4 consecutive difficult calls            |
|                             Or 90% occupancy for 2+ hours                  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 3.10 Contact Center Compliance by Region 

## 3.10.1 India Contact Center Compliance

```
+-----------------------------------------------------------------------------+
|              INDIA CONTACT CENTER - COMPLIANCE REQUIREMENTS                  |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGULATION              | REQUIREMENT                | IMPLEMENTATION      |
|  ========================================================================= |
|                                                                             |
|  DOT/TRAI COMPLIANCE:                                                      |
|  -------------------------------------------------------------------------  |
|  Toll Bypass             | CC calls must originate    | WxCC India DC +     |
|  Prevention              | from Indian infrastructure | India PSTN egress   |
|                                                                             |
|  Data Residency          | Call recordings and CDRs   | WxCC India Data     |
|  (OSP Guidelines)        | stored in India for min    | Center enabled      |
|                          | 1 year                     |                     |
|                                                                             |
|  Agent Location          | OSP allows WFH with        | WFH policy with     |
|                          | approved security controls | VPN + endpoint      |
|                          |                            | security            |
|                                                                             |
|  RECORDING COMPLIANCE:                                                     |
|  -------------------------------------------------------------------------  |
|  Consent                 | Must inform callers about  | IVR consent prompt  |
|                          | recording                  | at flow start       |
|                                                                             |
|  PCI-DSS                 | Pause recording during     | Agent can pause     |
|  (Billing Queue)         | card number capture        | manually + auto     |
|                          |                            | pause on DTMF       |
|                                                                             |
|  Retention               | Minimum 1 year for OSP     | WxCC WFO retention  |
|                          | audit requirements         | set to 365 days     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 3.10.2 EMEA Contact Center Compliance

```
+-----------------------------------------------------------------------------+
|              EMEA CONTACT CENTER - COMPLIANCE REQUIREMENTS                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGULATION              | REQUIREMENT                | IMPLEMENTATION      |
|  ========================================================================= |
|                                                                             |
|  GDPR (UK/EU):                                                             |
|  -------------------------------------------------------------------------  |
|  Data Processing         | Lawful basis for           | Legitimate interest |
|                          | processing customer data   | (service delivery)  |
|                                                                             |
|  Data Residency          | UK data in UK DC           | UK Calling Region   |
|                          | EU data in EU DC           | EU Calling Region   |
|                                                                             |
|  Right to Erasure        | Customer can request       | Control Hub data    |
|                          | deletion of their data     | deletion workflow   |
|                                                                             |
|  Recording Consent       | Must inform and obtain     | IVR consent prompt  |
|  (Germany especially)    | consent before recording   | with opt-out option |
|                                                                             |
|  BSI C5 (Germany):                                                         |
|  -------------------------------------------------------------------------  |
|  Cloud Security          | Webex has BSI C5           | No additional       |
|                          | attestation                | config needed       |
|                                                                             |
|  OFCOM (UK):                                                               |
|  -------------------------------------------------------------------------  |
|  CLI Verification        | Outbound calls must show   | CCPP handles via    |
|                          | valid CLI                  | Webex Calling       |
|                                                                             |
|  Emergency Services      | 999/112 access required    | Handled by CCPP     |
|                          |                            | provider            |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## Chapter Summary

This chapter has provided comprehensive design specifications for migrating Abhavtech's UCCX contact center to Webex Contact Center, including:

**Completed Sections:**
- [OK] 3.1 UCCX Current State Assessment (detailed inventory)
- [OK] 3.2 Webex Contact Center Architecture (multi-region)
- [OK] 3.3 Entry Point Design (6 entry points)
- [OK] 3.4 Queue Design (10 queues)
- [OK] 3.5 Skills and Routing Design (18 skills)
- [OK] 3.6 Flow Designer - IVR Migration (detailed flow diagrams)
- [OK] 3.7 Agent Desktop Design (user profiles)
- [OK] 3.8 Digital Channel Design (Chat, WhatsApp, Email)
- [OK] 3.9 AI Features Design (Virtual Agent Abhi, Agent Assist)
- [OK] 3.10 Contact Center Compliance by Region

**Next Steps (Chapter 7: Migration Execution):**
- Contact Center cutover runbook
- Parallel operation procedures
- Agent training plan
- Go-live checklist

---

*© 2026 Abhavtech.com - Internal Use Only*
*Document Code: ABV-COLLAB-MIG-2026-P2-CH3*
