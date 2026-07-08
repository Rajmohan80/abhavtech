# Migration Strategy

## 1.3 Migration Dependency Analysis

### 1.3.1 Hunt Group Dependencies

> **Note:** This section distinguishes between **CUCM Hunt Groups** (enterprise users - Phase 1) and **UCCX Contact Service Queues** (contact center - Phase 2). Both are documented here for complete dependency mapping.

**CUCM Hunt Groups (Phase 1 - Webex Calling):**

These are enterprise hunt groups for non-contact center use cases (reception, departmental coverage).

| Hunt Pilot | Hunt Pilot DN | Members | Type | Location | Migration Target |
|------------|--------------|---------|------|----------|------------------|
| HG_Mumbai_Reception | +91-22-4960-0000 | 8 | Circular | Mumbai | Webex Calling Hunt Group |
| HG_Mumbai_IT_Support | +91-22-4960-0001 | 12 | Top Down | Mumbai | Webex Calling Hunt Group |
| HG_Mumbai_HR | +91-22-4960-0002 | 6 | Circular | Mumbai | Webex Calling Hunt Group |
| HG_Mumbai_Finance | +91-22-4960-0003 | 8 | Longest Idle | Mumbai | Webex Calling Hunt Group |
| HG_Chennai_Reception | +91-44-4960-0000 | 4 | Circular | Chennai | Webex Calling Hunt Group |
| HG_Bangalore_Reception | +91-80-4960-0000 | 3 | Circular | Bangalore | Webex Calling Hunt Group |
| HG_Delhi_Reception | +91-11-4960-0000 | 3 | Circular | Delhi | Webex Calling Hunt Group |
| HG_London_Reception | +44-20-4960-0000 | 4 | Circular | London | Webex Calling Hunt Group |
| HG_London_Sales | +44-20-4960-0001 | 10 | Longest Idle | London | Webex Calling Hunt Group |
| HG_NJ_Reception | +1-201-496-0000 | 4 | Circular | New Jersey | Webex Calling Hunt Group |
| HG_NJ_Sales | +1-201-496-0001 | 8 | Longest Idle | New Jersey | Webex Calling Hunt Group |
| HG_Dallas_Reception | +1-214-496-0000 | 3 | Circular | Dallas | Webex Calling Hunt Group |

**CUCM Hunt Group Migration Batching Strategy:**

```
+-----------------------------------------------------------------------------+
|         HUNT GROUP MIGRATION DEPENDENCY MAP (PHASE 1)                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  RULE: All hunt group members must migrate in the SAME batch               |
|                                                                             |
|  Batch 1 (Pilot - 50 users):                                               |
|  +- IT Department (Mumbai) - 25 users                                      |
|  |  +- HG_Mumbai_IT_Support (12 members) <- ALL members in this batch       |
|  +- Non-hunt group IT users - 13 users                                     |
|                                                                             |
|  Batch 2 (Mumbai Wave 1 - 200 users):                                      |
|  +- Reception Team - 8 users                                               |
|  |  +- HG_Mumbai_Reception (8 members) <- ALL members in this batch         |
|  +- HR Department - 45 users                                               |
|  |  +- HG_Mumbai_HR (6 members) <- ALL members in this batch                |
|  +- Non-hunt group users - 147 users                                       |
|                                                                             |
|  Batch 3 (Mumbai Wave 2 - 200 users):                                      |
|  +- Finance Department - 55 users                                          |
|  |  +- HG_Mumbai_Finance (8 members) <- ALL members in this batch           |
|  +- Non-hunt group users - 145 users                                       |
|                                                                             |
|  [!]️ CONSTRAINT: Cannot split hunt group members across batches             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

### 1.3.2 Contact Center Dependencies (Phase 2 - Reference Only)

> **[!]️ PHASE 2 SCOPE:** The following UCCX Contact Service Queues (CSQs) and agent configurations will be migrated to **Webex Contact Center** as part of the UCCX migration phase. This section documents dependencies for Phase 2 planning.

**UCCX Contact Service Queues (CSQs) -> Webex Contact Center Queues:**

| CSQ Name | Pilot DN | Agents | Skills | Routing Type | WxCC Migration Target |
|----------|----------|--------|--------|--------------|----------------------|
| CSQ_Sales_India | +91-22-4960-1000 | 45 | Sales_EN, Sales_HI | Skills-based | WxCC Queue: Sales_India |
| CSQ_Sales_UK | +44-20-4960-1000 | 12 | Sales_EN | Skills-based | WxCC Queue: Sales_UK |
| CSQ_Sales_US | +1-201-496-1000 | 8 | Sales_EN | Skills-based | WxCC Queue: Sales_US |
| CSQ_Support_L1 | +91-22-4960-2000 | 35 | Support_L1, EN, HI | Skills-based | WxCC Queue: Support_L1 |
| CSQ_Support_L2 | +91-22-4960-2001 | 18 | Support_L2, EN | Skills-based | WxCC Queue: Support_L2 |
| CSQ_Support_Chennai | +91-44-4960-2000 | 25 | Support_L1, Tamil | Skills-based | WxCC Queue: Support_Chennai |
| CSQ_Billing | +91-22-4960-3000 | 15 | Billing, EN, HI | Longest Available | WxCC Queue: Billing |
| CSQ_Toll_Free_India | 1800-266-1000 | 40 | All Skills | Skills-based | WxCC Queue: TollFree_India |
| CSQ_Toll_Free_UK | +44-800-096-1000 | 10 | Sales_EN, Support | Skills-based | WxCC Queue: TollFree_UK |
| CSQ_Toll_Free_US | +1-800-096-1000 | 8 | Sales_EN, Support | Skills-based | WxCC Queue: TollFree_US |

**UCCX Agent Inventory (Phase 2):**

| Site | Voice Agents | Digital Agents | Supervisors | Teams | Skills |
|------|--------------|----------------|-------------|-------|--------|
| Mumbai | 95 | 15 | 8 | 6 | 12 |
| Chennai | 25 | 5 | 2 | 2 | 6 |
| London | 12 | 3 | 1 | 1 | 4 |
| New Jersey | 8 | 2 | 1 | 1 | 4 |
| **Total** | **140** | **25** | **12** | **10** | **18** |

**UCCX IVR Scripts -> Webex Contact Center Flow Designer (Phase 2):**

| Script Name | Type | Prompts | Steps | Complexity | Flow Designer Migration |
|-------------|------|---------|-------|------------|------------------------|
| Main_Menu_EN.aef | Voice | 8 | 24 | Medium | Flow: Main_Menu_English |
| Main_Menu_HI.aef | Voice | 8 | 24 | Medium | Flow: Main_Menu_Hindi |
| Sales_Routing.aef | Voice | 4 | 18 | Medium | Flow: Sales_Router |
| Support_Routing.aef | Voice | 6 | 32 | High | Flow: Support_Router |
| Callback_Request.aef | Voice | 3 | 15 | Low | Flow: Callback_Handler |
| After_Hours.aef | Voice | 2 | 8 | Low | Flow: After_Hours |
| Holiday_Greeting.aef | Voice | 1 | 4 | Low | Flow: Holiday_Message |
| Survey_Post_Call.aef | Voice | 5 | 12 | Medium | Auto CSAT (AI feature) |

**Contact Center Feature Dependencies (Phase 2):**

| UCCX Feature | Current Config | WxCC Equivalent | Migration Notes |
|--------------|----------------|-----------------|-----------------|
| Finesse Desktop | v12.5 | Webex Contact Center Agent Desktop | New UI, retrain agents |
| Skills-Based Routing | 18 skills configured | WxCC Skills | Recreate skill definitions |
| Supervisor Barge | Enabled | WxCC Supervisor Barge | Native feature |
| Supervisor Monitor | Enabled | WxCC Supervisor Monitor | Native feature |
| Whisper Coaching | Enabled | WxCC Whisper | Native feature |
| Call Recording | UCCX BiB + NICE | WxCC Recording | Cloud-native recording |
| Historical Reports | CUIC | WxCC Analyzer | New reporting platform |
| Real-time Reports | Finesse Gadgets | WxCC Supervisor Dashboard | New dashboard |
| Workforce Management | NICE IEX (external) | WxCC WFM or continue NICE | Evaluate options |
| Outbound Dialer | UCCX Outbound | WxCC Campaign Manager | License required |

**Contact Center Integration Dependencies (Phase 2):**

| Integration | Current State | WxCC Migration | Priority |
|-------------|--------------|----------------|----------|
| Salesforce CTI | Jabber + Finesse | Webex CC for Salesforce | P1 |
| CRM Screen Pop | Custom Finesse gadget | WxCC Desktop Connector | P1 |
| IVR Database Lookup | UCCX DB steps | Flow Designer HTTP nodes | P2 |
| Recording Export | NICE Engage | WxCC Recording API | P2 |
| WFM Integration | NICE IEX API | WxCC WFM API | P2 |
| Quality Management | NICE QM | WxCC QM or continue NICE | P3 |

```
+-----------------------------------------------------------------------------+
|         CONTACT CENTER MIGRATION DEPENDENCY SUMMARY (PHASE 2)               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |  PHASE 2 SCOPE - UCCX -> WEBEX CONTACT CENTER                        |   |
|  |  ===============================================================    |   |
|  |                                                                      |   |
|  |  AGENTS:        165 total (140 voice + 25 digital)                  |   |
|  |  SUPERVISORS:   12                                                   |   |
|  |  QUEUES:        10 CSQs -> 10 WxCC Queues                            |   |
|  |  IVR SCRIPTS:   8 UCCX scripts -> 8 Flow Designer flows              |   |
|  |  SKILLS:        18 skill definitions                                 |   |
|  |  INTEGRATIONS:  6 (Salesforce, CRM, Recording, WFM, etc.)           |   |
|  |                                                                      |   |
|  |  DOCUMENTATION: Chapter 3 (Design), Chapter 7.3 (Cutover)           |   |
|  |  STATUS:        Structure ready, content deferred to Phase 2        |   |
|  |                                                                      |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  [!]️ PHASE 1 DEPENDENCY:                                                    |
|  Contact Center agents must remain on CUCM until Phase 2 cutover.          |
|  Webex Calling coexistence trunks will route CC calls during Phase 1.      |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

### 1.3.3 Shared Line Dependencies

**Shared Line Inventory:**

| Primary User | Primary Extension | Shared With | Use Case | Migration Approach |
|--------------|------------------|-------------|----------|-------------------|
| CEO (Rajan Sharma) | 6001 | EA (Priya Patel) | Executive Assistant | Virtual Line |
| CFO (Amit Kapoor) | 6002 | EA (Sana Khan) | Executive Assistant | Virtual Line |
| CTO (Vikram Mehta) | 6003 | EA (Priya Patel) | Executive Assistant | Virtual Line |
| COO (Lakshmi Iyer) | 6004 | EA (Deepa Nair) | Executive Assistant | Virtual Line |
| Reception Main | 6100 | 8 reception phones | Coverage | Virtual Line |
| London MD (James Wilson) | 7001 | EA (Emma Thompson) | Executive Assistant | Virtual Line |
| US VP Sales (Michael Chen) | 8001 | EA (Jennifer Lopez) | Executive Assistant | Virtual Line |

**Shared Line Migration Rules:**

```
+-----------------------------------------------------------------------------+
|         SHARED LINE -> VIRTUAL LINE MIGRATION                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  CUCM SHARED LINE CONCEPT:                                                  |
|  +-------------+     +-------------+                                       |
|  |  Phone A    |     |  Phone B    |                                       |
|  |  Line 1:    |     |  Line 1:    |                                       |
|  |  Ext 6001   |---->|  Ext 6001   |  <- Same DN, shared appearance        |
|  |  (Primary)  |     |  (Shared)   |                                       |
|  +-------------+     +-------------+                                       |
|                                                                             |
|  WEBEX CALLING VIRTUAL LINE CONCEPT:                                       |
|  +-------------+     +-----------------------------------------+          |
|  |  User A     |     |  Virtual Line (Ext 6001)                |          |
|  |  Primary    |---->|  +- Primary: User A                     |          |
|  |  Owner      |     |  +- Shared: User B (EA)                 |          |
|  +-------------+     +-----------------------------------------+          |
|                                                                             |
|  MIGRATION STEPS:                                                          |
|  1. Create Virtual Line in Control Hub                                     |
|  2. Assign primary user as owner                                           |
|  3. Add shared appearance to assistant/secondary users                     |
|  4. Configure on devices (phones and Webex App)                           |
|                                                                             |
|  [!]️ CONSTRAINT: Primary user and all shared users must migrate together   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 1.3.4 Integration Dependencies

> **Note:** Integrations are categorized by migration phase. Phase 1 (Webex Calling) integrations migrate with enterprise users. Phase 2 (Webex Contact Center) integrations migrate with the contact center cutover.

**Phase 1 Integrations (Enterprise - Webex Calling):**

| Integration | Type | System | Protocol | Webex Solution | Priority |
|-------------|------|--------|----------|----------------|----------|
| Active Directory | User Sync | AD DS | LDAP/S | Webex Directory Connector | P1 - Pre-migration |
| Microsoft Exchange | Calendar | Exchange 2019 | EWS | Hybrid Calendar Service | P1 - Pre-migration |
| Salesforce (Click-to-Dial) | CRM | Salesforce | REST | Webex for Salesforce | P2 - Batch 1 |
| ServiceNow | ITSM | ServiceNow | REST API | Webex for ServiceNow | P3 - Post-migration |
| Door Entry | Intercom | 2N Helios | SIP | SIP Trunk to LGW | P3 - Site-by-site |
| Paging System | Overhead | Valcom | Multicast | Webex Paging Service | P3 - Site-by-site |
| Emergency Notification | E911 | RedSky E911 | SIP/API | Webex E911 (RedSky) | P1 - Pre-migration |
| Billing/CDR Export | Reporting | SAP | FTP/CSV | Webex Analytics API | P4 - Post-migration |

**Phase 2 Integrations (Contact Center - Webex CC):**

| Integration | Type | System | Protocol | WxCC Solution | Priority |
|-------------|------|--------|----------|---------------|----------|
| Salesforce CTI (Agent) | CRM Screen Pop | Salesforce | CTI | Webex CC for Salesforce | P1 - CC Cutover |
| CRM Screen Pop | Custom Gadget | Internal CRM | REST | WxCC Desktop Connector | P1 - CC Cutover |
| Call Recording | Compliance | NICE Engage | SIPREC | WxCC Native Recording | P1 - CC Cutover |
| Workforce Management | Scheduling | NICE IEX | API | WxCC WFM or NICE API | P2 - Post-cutover |
| Quality Management | QA Scoring | NICE QM | API | WxCC QM or continue NICE | P3 - Evaluate |
| IVR Database Lookup | Customer Data | Oracle DB | JDBC | Flow Designer HTTP | P1 - CC Cutover |
| Outbound Dialer | Campaigns | UCCX Outbound | Internal | WxCC Campaign Manager | P2 - Post-cutover |
| Reporting Export | Analytics | CUIC | SQL/API | WxCC Analyzer API | P2 - Post-cutover |

**Integration Migration Timeline:**

```
+-----------------------------------------------------------------------------+
|         INTEGRATION MIGRATION TIMELINE                                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PRE-MIGRATION (Before Phase 1 Batch 1):                                   |
|  ========================================                                  |
|  OK Active Directory -> Webex Directory Connector                            |
|  OK Emergency (E911) -> Webex E911 service                                   |
|  OK Exchange Calendar -> Hybrid Calendar Service                             |
|                                                                             |
|  PHASE 1 (CUCM -> Webex Calling):                                           |
|  ===============================                                           |
|  Batch 1: Salesforce Click-to-Dial (enterprise users)                      |
|  Batch 3: ServiceNow integration                                           |
|  Site-by-site: Door entry, Paging systems                                  |
|  Post-migration: CDR/Billing export                                        |
|                                                                             |
|  PHASE 2 (UCCX -> Webex Contact Center):                                    |
|  ======================================                                    |
|  CC Cutover Weekend:                                                        |
|    * Salesforce CTI (agent screen pop)                                     |
|    * CRM Desktop Connector                                                 |
|    * Call Recording (WxCC native)                                          |
|    * IVR Database lookups (Flow Designer)                                  |
|  Post-Cutover:                                                              |
|    * WFM integration (NICE or WxCC native)                                 |
|    * Quality Management                                                     |
|    * Reporting/Analytics export                                            |
|    * Outbound Campaign Manager                                             |
|                                                                             |
|  [!]️ NOTE: Salesforce has TWO integrations:                                 |
|     1. Click-to-dial for enterprise users (Phase 1)                        |
|     2. CTI screen pop for CC agents (Phase 2)                              |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**Integration Architecture - Coexistence Period:**

```
+-----------------------------------------------------------------------------+
|         INTEGRATION ARCHITECTURE DURING COEXISTENCE                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|                    +-------------------------------------+                 |
|                    |        ACTIVE DIRECTORY            |                 |
|                    |        (Single Source)             |                 |
|                    +---------------+---------------------+                 |
|                                    |                                       |
|                    +---------------+---------------+                       |
|                    |                               |                       |
|                    v                               v                       |
|      +-------------------------+    +-------------------------+           |
|      |    CUCM/UCCX            |    |    WEBEX CLOUD          |           |
|      |    (Contact Center)     |    |    (Enterprise Users)   |           |
|      |    -----------------    |    |    -----------------    |           |
|      |    LDAP Sync            |    |    Directory Connector  |           |
|      |    Finesse/Jabber       |    |    Webex App            |           |
|      |    UCCX Recording       |    |    Webex Recording      |           |
|      |    CUIC Reporting       |    |    Webex Analytics      |           |
|      +----------+--------------+    +----------+--------------+           |
|                 |                               |                          |
|                 |      +-------------+          |                          |
|                 +----->|  SIP Trunk  |<---------+                          |
|                        | (Interop)   |                                     |
|                        +-------------+                                     |
|                                                                             |
|  COEXISTENCE INTEGRATION RULES:                                            |
|  ==============================                                            |
|  * AD syncs to BOTH platforms during migration                             |
|  * Enterprise users use Webex integrations                                 |
|  * CC agents continue using UCCX/Finesse integrations                     |
|  * SIP trunk enables calls between platforms                               |
|  * Recording remains on respective platforms                               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

