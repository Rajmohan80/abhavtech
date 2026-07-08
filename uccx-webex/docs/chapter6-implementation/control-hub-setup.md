# Chapter 6: Webex Contact Center Implementation 

## Phase 2: UCCX to WxCC Migration - Detailed Implementation Procedures

---

**Document Version:** 3.0  
**Date:** January 2026  
**Classification:** Internal - Technical Reference  
**Organization:** Abhavtech.com  
**Project Code:** ABV-COLLAB-MIG-2026-P2-CH6  
**Cross-Reference:** Chapter 3 (WxCC Design v2.0)  
**Model Guidance:** Sonnet 4.5 (Implementation/Operations - Concise/Actionable)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 3.0 | Jan 2026 | Collaboration Architecture Team | Comprehensive implementation procedures |
| | | | Aligned with Chapter 3 v2.0 |
| | | | Dual-platform AI configuration (GCP + WxCC) |
| | | | Step-by-step provisioning procedures |

---

## Implementation Summary

| Metric | Chapter 3 Design | Implementation Target |
|--------|-----------------|----------------------|
| **Total Agents** | 175 | 175 (scalable to 300) |
| **Voice Agents** | 150 | 150 |
| **Digital Agents** | 25 | 25 -> 50 (post-migration) |
| **Entry Points** | 6 | 6 (4 voice + 2 digital) |
| **Queues** | 10 | 10 (migrated from 6 CSQs) |
| **Skills** | 18 | 18 (expanded from 8 UCCX) |
| **Flows** | 9 | 9 (rebuilt from UCCX scripts) |
| **Prompts** | 87 | 87 (62 EN + 25 HI) |
| **Virtual Agent** | Abhi | Dialogflow CX integration |

---

## 6.1 WxCC Tenant Setup 

## 6.1.1 Prerequisites Checklist

```
+-----------------------------------------------------------------------------+
|              WXCC TENANT SETUP - PREREQUISITES                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [ ] Phase 1 Webex Calling operational (Chapter 5 complete)                |
|  [ ] Control Hub Full Administrator access                                  |
|  [ ] WxCC licenses procured and assigned to organization                   |
|  [ ] Azure AD SSO configured (from Phase 1)                                |
|  [ ] Network connectivity validated per Chapter 5                          |
|  [ ] Salesforce Connected App OAuth configured                             |
|  [ ] Google Cloud Project created (for Dialogflow CX)                      |
|  [ ] India DC enabled for data residency compliance                        |
|                                                                             |
|  [!]️ CRITICAL: Do NOT proceed until Phase 1 Webex Calling is operational   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.1.2 Control Hub - Contact Center Activation

### Step-by-Step Procedure

**Step 1: Access Control Hub**

1. Navigate to: `admin.webex.com`
2. Login with Full Administrator credentials
3. Verify organization: **Abhavtech.com**

**Step 2: Activate Contact Center Service**

1. Navigate to: **Services** -> **Contact Center**
2. If not activated, click **"Set Up Contact Center"**
3. Select Platform: **Webex Contact Center (Next Generation)**
4. Select Region: **India** (for data residency compliance)
5. Confirm activation

**Step 3: Verify Activation Status**

```
+-----------------------------------------------------------------------------+
|  Expected Status After Activation:                                         |
|  ---------------------------------                                         |
|  Service Status:       Active                                              |
|  Data Center:          India DC (ap-south-1)                              |
|  Provisioning Status:  Complete                                            |
|  Org ID:               [Auto-generated]                                    |
+-----------------------------------------------------------------------------+
```

## 6.1.3 License Allocation (Per Chapter 3.2.3)

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH WXCC LICENSE ALLOCATION                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  LICENSE TYPE           | QUANTITY | ASSIGNMENT                            |
|  -----------------------+----------+---------------------------------------|
|  Standard Agent         |      100 | Voice-only agents                     |
|  Premium Agent          |       75 | Voice + Digital agents                |
|  Supervisor             |       10 | Team supervisors                      |
|  Webex AI Agent         |        1 | Virtual Agent "Abhi"                  |
|  Agent Assist           |      175 | Included with Premium (all agents)    |
|  WFO Recording          |      175 | All agents (compliance)               |
|  WFO Quality Management |       50 | Evaluation sample                     |
|  WFO Workforce Mgmt     |      175 | All agents (scheduling)               |
|  -----------------------+----------+---------------------------------------|
|                                                                             |
|  LICENSE DISTRIBUTION BY SITE:                                             |
|  -----------------------------                                             |
|  Mumbai HQ:   80 Standard + 40 Premium = 120 agents                       |
|  Chennai:     15 Standard + 15 Premium = 30 agents                        |
|  London:       5 Standard + 10 Premium = 15 agents                        |
|  New Jersey:   0 Standard + 10 Premium = 10 agents                        |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### License Assignment Procedure

**Navigation:** Control Hub -> Users -> [User] -> Services -> Contact Center

1. Select user to license
2. Enable **Contact Center** service
3. Select License Type: **Standard** or **Premium**
4. Click **Save**

> **💡 TIP:** Use bulk CSV upload for 175 agents - see Section 6.6.3

## 6.1.4 Security Baseline Configuration

### 6.1.4.1 Administrator Roles

**Navigation:** Control Hub -> Users -> Roles

```
+-----------------------------------------------------------------------------+
|              WXCC ADMINISTRATOR ROLES                                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ROLE                         | PERMISSIONS                    | ASSIGNEES |
|  -----------------------------+--------------------------------+-----------|
|  Full Administrator           | All Control Hub + Contact Ctr  |     3     |
|  Contact Center Administrator | CC provisioning only           |     2     |
|  Contact Center Supervisor    | Monitoring, team management    |    10     |
|  Read-Only Administrator      | View settings, no changes      |     2     |
|  -----------------------------+--------------------------------+-----------|
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 6.1.4.2 Security Settings

**Navigation:** Control Hub -> Settings -> Security

| Setting | Configuration | Notes |
|---------|--------------|-------|
| SSO | Azure AD SAML (from Phase 1) | Mandatory for compliance |
| Session Timeout (Agent Desktop) | 8 hours | Agent shift duration |
| Session Timeout (Admin Portal) | 4 hours | Security best practice |
| IP Restrictions | Enable for Admin access | Corporate IP ranges only |
| Audit Logging | Enable all actions | Required for compliance |
| API Access | OAuth 2.0 only | Disable basic auth |

### 6.1.4.3 Data Residency Configuration

**Navigation:** Control Hub -> Organization Settings -> Data Residency

```
+-----------------------------------------------------------------------------+
|              DATA RESIDENCY CONFIGURATION                                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGION        | DATA CENTER      | RECORDING STORAGE | COMPLIANCE         |
|  --------------+------------------+-------------------+--------------------|
|  India/APAC    | India DC         | India DC          | DoT/TRAI, OSP      |
|  UK            | UK DC (London)   | UK DC             | UK GDPR            |
|  EU            | EU DC (Frankfurt)| EU DC             | EU GDPR, BSI C5    |
|  Americas      | US DC            | US DC             | US regulations     |
|  --------------+------------------+-------------------+--------------------|
|                                                                             |
|  [!]️ CRITICAL: India data MUST reside in India DC for DoT/TRAI compliance |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 6.2 Entry Point Provisioning 

## 6.2.1 Entry Point Design (Per Chapter 3.3.2)

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH ENTRY POINT SPECIFICATIONS - 6 ENTRY POINTS          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  EP-01: India_Main_Voice_EP                                                |
|  =======================================================================   |
|  Name:                 India_Main_Voice_EP                                 |
|  Description:          Primary India voice entry - Sales & Support          |
|  Channel Type:         Telephony                                           |
|  Dial Numbers:         1800-266-1000 (Toll-Free)                           |
|                        +91-22-4960-1000 (Mumbai)                           |
|  Service Level:        30 seconds / 80%                                    |
|  Routing Flow:         India_MainMenu_Flow_v1                              |
|  Business Hours:       24x7 (Mumbai)                                       |
|  Recording:            Enabled with consent prompt                         |
|                                                                             |
|  EP-02: India_Sales_Direct_EP                                              |
|  =======================================================================   |
|  Name:                 India_Sales_Direct_EP                               |
|  Description:          Direct sales line (skip IVR)                         |
|  Channel Type:         Telephony                                           |
|  Dial Numbers:         1800-266-1001 (Sales Toll-Free)                     |
|  Service Level:        20 seconds / 85%                                    |
|  Routing Flow:         India_Sales_Direct_Flow_v1                          |
|  Business Hours:       9:00 AM - 9:00 PM IST                               |
|  After Hours:          Route to India_Main_Voice_EP                        |
|  Priority:             HIGH (revenue)                                      |
|                                                                             |
|  EP-03: EMEA_Main_Voice_EP                                                 |
|  =======================================================================   |
|  Name:                 EMEA_Main_Voice_EP                                  |
|  Description:          UK/EU voice entry point                             |
|  Channel Type:         Telephony                                           |
|  Dial Numbers:         +44-20-XXXX-XXXX (UK)                               |
|  Service Level:        30 seconds / 80%                                    |
|  Routing Flow:         EMEA_MainMenu_Flow_v1                               |
|  Business Hours:       9:00 AM - 6:00 PM GMT                               |
|  After Hours:          Route to India_Main_Voice_EP (follow-the-sun)       |
|  Data Residency:       UK DC                                               |
|                                                                             |
|  EP-04: Americas_Main_Voice_EP                                             |
|  =======================================================================   |
|  Name:                 Americas_Main_Voice_EP                              |
|  Description:          US voice entry point                                |
|  Channel Type:         Telephony                                           |
|  Dial Numbers:         +1-201-XXX-XXXX (New Jersey)                        |
|  Service Level:        30 seconds / 80%                                    |
|  Routing Flow:         Americas_MainMenu_Flow_v1                           |
|  Business Hours:       9:00 AM - 6:00 PM EST                               |
|  After Hours:          Route to India_Main_Voice_EP (follow-the-sun)       |
|  Data Residency:       US DC                                               |
|                                                                             |
|  EP-05: Global_Chat_EP                                                     |
|  =======================================================================   |
|  Name:                 Global_Chat_EP                                      |
|  Description:          Web Chat and WhatsApp                               |
|  Channel Type:         Chat                                                |
|  Asset:                Webex Connect widget / WhatsApp Business            |
|  Service Level:        15 seconds / 90%                                    |
|  Routing Flow:         Digital_Chat_Flow_v1                                |
|  Business Hours:       24x7 (Mumbai digital team)                          |
|                                                                             |
|  EP-06: Global_Email_EP                                                    |
|  =======================================================================   |
|  Name:                 Global_Email_EP                                     |
|  Description:          Email channel                                       |
|  Channel Type:         Email                                               |
|  Email Address:        support@abhavtech.com                               |
|  Service Level:        4 hours / 80%                                       |
|  Routing Flow:         Digital_Email_Flow_v1                               |
|  Business Hours:       Business hours SLA                                  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.2.2 Entry Point Provisioning - Step-by-Step

### Creating India_Main_Voice_EP

**Navigation:** Control Hub -> Contact Center -> Provisioning -> Entry Points

**Step 1: Access Entry Point Management**

1. Click **"Create Entry Point"**
2. Entry Point Type: **Inbound**

**Step 2: General Settings**

```
+-----------------------------------------------------------------------------+
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Name                       | India_Main_Voice_EP                          |
|  Description                | Primary India voice entry - Sales & Support  |
|  Entry Point Type           | Inbound                                      |
|  Channel Type               | Telephony                                    |
+-----------------------------------------------------------------------------+
```

**Step 3: Routing Settings**

```
+-----------------------------------------------------------------------------+
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Routing Flow               | India_MainMenu_Flow_v1 (select from dropdown)|
|  Music File                 | abhavtech_hold_music.wav                     |
|  Overflow Treatment         | Enable                                       |
|  Overflow Destination       | Voicemail_EP                                 |
+-----------------------------------------------------------------------------+
```

> **[!]️ NOTE:** Flow must be created first (Section 6.5) before associating with Entry Point

**Step 4: Service Level Settings**

```
+-----------------------------------------------------------------------------+
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Service Level Threshold    | 30 (seconds)                                 |
|  Service Level Percentage   | 80%                                          |
+-----------------------------------------------------------------------------+
```

**Step 5: Advanced Settings**

```
+-----------------------------------------------------------------------------+
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Enable Recording           | Yes                                          |
|  Recording Pause Resume     | Yes (for consent/PCI)                        |
|  Enable Reporting           | Yes                                          |
|  DNIS                       | (Set after dial number mapping)              |
+-----------------------------------------------------------------------------+
```

**Step 6: Save and Note Entry Point ID**

1. Click **"Save"**
2. **Record Entry Point ID:** _____________ (needed for dial number mapping)

## 6.2.3 Dial Number to Entry Point Mapping

**Navigation:** Control Hub -> Contact Center -> Provisioning -> Entry Point Mappings

**Step 1: Create Mapping for Toll-Free Number**

1. Click **"Create Mapping"**
2. Select Entry Point: **India_Main_Voice_EP**
3. Select Dial Number: **18001234567** (from Webex Calling)
4. Click **"Save"**

**Step 2: Create Mapping for Mumbai Number**

1. Click **"Create Mapping"**
2. Select Entry Point: **India_Main_Voice_EP**
3. Select Dial Number: **+91-22-4960-1000** (from Webex Calling)
4. Click **"Save"**

## 6.2.4 Entry Point Verification

```
+-----------------------------------------------------------------------------+
|              ENTRY POINT VERIFICATION CHECKLIST                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [ ] Entry Point status shows: "Active"                                    |
|  [ ] Dial number mapping shows: "Configured"                               |
|  [ ] Flow association verified                                             |
|  [ ] Test call placed to mapped number                                     |
|  [ ] Call arrives at Entry Point (check real-time dashboard)               |
|  [ ] Flow Designer flow executes                                           |
|                                                                             |
|  REPEAT for all 6 Entry Points                                             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 6.3 Queue Configuration 

## 6.3.1 Queue Design (Per Chapter 3.4)

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH QUEUE SPECIFICATIONS - 10 QUEUES                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  QUEUE               | CHANNEL | SL     | MAX Q  | ROUTING    | OVERFLOW  |
|  ========================================================================  |
|                                                                             |
|  Q-01: Sales_India_Queue                                                   |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      30 seconds                                            |
|  Max Time in Queue:  300 seconds (5 min)                                   |
|  Routing Type:       Skills-Based (Longest Available Agent)                |
|  Skills Required:    Sales=TRUE, Region_India=TRUE                         |
|  Skill Relaxation:   After 120s: Remove Region_India                       |
|  Team Assignment:    India_Sales_Team                                      |
|  Overflow Action:    Voicemail_EP                                          |
|  MOH:                abhavtech_hold_music.wav                              |
|  Comfort Messages:   Every 60 seconds                                      |
|                                                                             |
|  Q-02: Sales_EMEA_Queue                                                    |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      30 seconds                                            |
|  Max Time in Queue:  300 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Sales=TRUE, Region_EMEA=TRUE                          |
|  Skill Relaxation:   After 90s: Add Region_India (follow-the-sun)          |
|  Team Assignment:    EMEA_Sales_Team + India_Sales_Team (backup)           |
|  After Hours:        Route to Sales_India_Queue                            |
|                                                                             |
|  Q-03: Sales_Americas_Queue                                                |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      30 seconds                                            |
|  Max Time in Queue:  300 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Sales=TRUE, Region_Americas=TRUE                      |
|  Skill Relaxation:   After 90s: Add Region_India                           |
|  Team Assignment:    Americas_Sales_Team + India_Sales_Team (backup)       |
|                                                                             |
|  Q-04: Support_India_Queue                                                 |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      45 seconds                                            |
|  Max Time in Queue:  600 seconds (10 min)                                  |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Support=TRUE                                          |
|  Skills Preferred:   Hindi>=5 (priority if available)                      |
|  Team Assignment:    India_Support_Team                                    |
|  Callback Option:    Offer after 180 seconds                               |
|                                                                             |
|  Q-05: Support_EMEA_Queue                                                  |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      45 seconds                                            |
|  Max Time in Queue:  480 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Support=TRUE, Region_EMEA=TRUE                        |
|  Team Assignment:    EMEA_Support_Team + India_Support_Team (backup)       |
|                                                                             |
|  Q-06: Support_Americas_Queue                                              |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      45 seconds                                            |
|  Max Time in Queue:  480 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Support=TRUE, Region_Americas=TRUE                    |
|  Team Assignment:    Americas_Support_Team + India_Support_Team (backup)   |
|                                                                             |
|  Q-07: Billing_Queue                                                       |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      60 seconds                                            |
|  Max Time in Queue:  480 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Billing=TRUE                                          |
|  Team Assignment:    India_Billing_Team                                    |
|  Recording Pause:    Auto-pause for card capture (PCI)                     |
|                                                                             |
|  Q-08: TechSupport_Queue                                                   |
|  ----------------------------------------------------------------------    |
|  Channel:            Telephony                                             |
|  Service Level:      45 seconds                                            |
|  Max Time in Queue:  600 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    TechnicalSupport=TRUE                                 |
|  Skills Preferred:   ProductA_Expert OR ProductB_Expert                    |
|  Team Assignment:    India_TechSupport_Team                                |
|                                                                             |
|  Q-09: Digital_Chat_Queue                                                  |
|  ----------------------------------------------------------------------    |
|  Channel:            Chat / WhatsApp                                       |
|  Service Level:      15 seconds                                            |
|  Max Wait:           300 seconds                                           |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Digital_Channels=TRUE                                 |
|  Concurrent Limit:   3 chats per agent                                     |
|  Team Assignment:    India_Digital_Team                                    |
|                                                                             |
|  Q-10: Digital_Email_Queue                                                 |
|  ----------------------------------------------------------------------    |
|  Channel:            Email                                                 |
|  Service Level:      4 hours                                               |
|  Routing Type:       Skills-Based                                          |
|  Skills Required:    Digital_Channels=TRUE                                 |
|  Concurrent Limit:   5 emails per agent                                    |
|  Team Assignment:    India_Digital_Team                                    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.3.2 Queue Provisioning - Step-by-Step

### Creating Sales_India_Queue

**Navigation:** Control Hub -> Contact Center -> Provisioning -> Queues

**Step 1: Create Queue**

1. Click **"Create Queue"**
2. Select Queue Type: **Inbound**

**Step 2: General Settings**

| Field | Value |
|-------|-------|
| Name | Sales_India_Queue |
| Description | India B2C/B2B sales inquiries |
| Channel Type | Telephony |
| Queue Routing Type | Skills Based |

**Step 3: Service Level Settings**

| Field | Value |
|-------|-------|
| Service Level Threshold | 30 (seconds) |
| Maximum Time in Queue | 300 (seconds) |

**Step 4: Skills-Based Routing Configuration**

| Setting | Value |
|---------|-------|
| Skill Requirement 1 | Sales = TRUE |
| Skill Requirement 2 | Region_India = TRUE |
| Agent Selection | Longest Available Agent |

**Step 5: Skill Relaxation (Advanced)**

```
+-----------------------------------------------------------------------------+
|  WAIT TIME    | RELAXATION ACTION                                          |
|  -------------+------------------------------------------------------------|
|  0-60 sec     | Match all required + preferred skills                      |
|  60-120 sec   | Match all required skills only                             |
|  120-180 sec  | Remove Region_India (global pool)                          |
|  180-300 sec  | Reduce language proficiency to minimum                     |
|  >300 sec     | Route to voicemail / callback offer                        |
+-----------------------------------------------------------------------------+
```

**Step 6: Queue Treatment**

| Setting | Value |
|---------|-------|
| Music on Hold | abhavtech_hold_music.wav |
| Comfort Message | Every 60 seconds |
| Position Announcement | Enabled |
| EWT Announcement | Enabled |

**Step 7: Team Assignment**

1. Click **"Assign Team"**
2. Select: **India_Sales_Team**
3. Click **"Add"**

**Step 8: Save**

1. Click **"Save"**
2. **Record Queue ID:** _____________

**REPEAT for all 10 queues.**

---

## 6.4 Skills & Skill Profiles 

## 6.4.1 Skills Inventory (Per Chapter 3.5.1)

```
+-----------------------------------------------------------------------------+
|              ABHAVTECH WXCC SKILLS INVENTORY - 18 SKILLS                    |
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
|                                                                             |
|  PROFICIENCY SCALE:                                                        |
|  1-3: Basic (simple inquiries)     7-9: Advanced (complex issues)          |
|  4-6: Intermediate (standard)      10: Expert (escalation point)           |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.4.2 Skill Creation Procedure

**Navigation:** Control Hub -> Contact Center -> Provisioning -> Skills

### Creating Boolean Skill (Example: Sales)

**Step 1:** Click **"Create Skill"**

**Step 2:** Configure Skill

| Field | Value |
|-------|-------|
| Name | Sales |
| Description | Sales function capability |
| Skill Type | Boolean (True/False) |
| Service Level Impact | Yes |

**Step 3:** Click **"Save"**

### Creating Proficiency Skill (Example: English)

**Step 1:** Click **"Create Skill"**

**Step 2:** Configure Skill

| Field | Value |
|-------|-------|
| Name | English |
| Description | English language proficiency |
| Skill Type | Proficiency |
| Minimum Value | 1 |
| Maximum Value | 10 |

**Step 3:** Click **"Save"**

**REPEAT for all 18 skills.**

## 6.4.3 Skill Profile Configuration (Per Chapter 3.5.2)

```
+-----------------------------------------------------------------------------+
|              SKILL PROFILE SPECIFICATIONS - 12 PROFILES                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PROFILE NAME              | SKILLS INCLUDED                   | AGENTS    |
|  ========================================================================= |
|                                                                             |
|  SP-01: Sales_India_EN_HI                                                  |
|  -------------------------------------------------------------------------  |
|  Description:              India sales - bilingual                         |
|  Skills:                   Sales=TRUE, Region_India=TRUE                   |
|                            English=7, Hindi=7                              |
|  Agent Count:              35                                              |
|                                                                             |
|  SP-02: Sales_India_EN                                                     |
|  -------------------------------------------------------------------------  |
|  Description:              India sales - English only                      |
|  Skills:                   Sales=TRUE, Region_India=TRUE                   |
|                            English=8, Hindi=3                              |
|  Agent Count:              10                                              |
|                                                                             |
|  SP-03: Sales_EMEA                                                         |
|  -------------------------------------------------------------------------  |
|  Description:              EMEA sales                                      |
|  Skills:                   Sales=TRUE, Region_EMEA=TRUE                    |
|                            English=9                                       |
|  Agent Count:              12                                              |
|                                                                             |
|  SP-04: Sales_Americas                                                     |
|  -------------------------------------------------------------------------  |
|  Description:              Americas sales                                  |
|  Skills:                   Sales=TRUE, Region_Americas=TRUE                |
|                            English=9                                       |
|  Agent Count:              8                                               |
|                                                                             |
|  SP-05: Support_India_General                                              |
|  -------------------------------------------------------------------------  |
|  Description:              India support - general                         |
|  Skills:                   Support=TRUE, Region_India=TRUE                 |
|                            English=7, Hindi=6                              |
|  Agent Count:              35                                              |
|                                                                             |
|  SP-06: Support_India_Tech                                                 |
|  -------------------------------------------------------------------------  |
|  Description:              India technical support                         |
|  Skills:                   TechnicalSupport=TRUE, Support=TRUE             |
|                            English=8, ProductA_Expert=7                    |
|  Agent Count:              15                                              |
|                                                                             |
|  SP-07: Support_EMEA                                                       |
|  -------------------------------------------------------------------------  |
|  Description:              EMEA support                                    |
|  Skills:                   Support=TRUE, Region_EMEA=TRUE                  |
|                            English=9                                       |
|  Agent Count:              3                                               |
|                                                                             |
|  SP-08: Billing_India                                                      |
|  -------------------------------------------------------------------------  |
|  Description:              India billing                                   |
|  Skills:                   Billing=TRUE, Region_India=TRUE                 |
|                            English=7, Hindi=6                              |
|  Agent Count:              15                                              |
|                                                                             |
|  SP-09: Digital_India                                                      |
|  -------------------------------------------------------------------------  |
|  Description:              Digital channels (chat/email)                   |
|  Skills:                   Digital_Channels=TRUE                           |
|                            English=8, Hindi=5                              |
|  Agent Count:              20                                              |
|                                                                             |
|  SP-10: Digital_Global                                                     |
|  -------------------------------------------------------------------------  |
|  Description:              Global digital support                          |
|  Skills:                   Digital_Channels=TRUE                           |
|                            English=9                                       |
|  Agent Count:              5                                               |
|                                                                             |
|  SP-11: VIP_Handler                                                        |
|  -------------------------------------------------------------------------  |
|  Description:              VIP customer handling                           |
|  Skills:                   VIP_Handler=TRUE, Sales=TRUE, Support=TRUE      |
|                            English=10                                      |
|  Agent Count:              10                                              |
|                                                                             |
|  SP-12: Supervisor                                                         |
|  -------------------------------------------------------------------------  |
|  Description:              Supervisor (all skills for escalation)          |
|  Skills:                   Escalation_Handler=TRUE, All functions          |
|                            English=10                                      |
|  Agent Count:              10                                              |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Skill Profile Creation Procedure

**Navigation:** Control Hub -> Contact Center -> Provisioning -> Skill Profiles

**Step 1:** Click **"Create Skill Profile"**

**Step 2:** Configure Profile

| Field | Value (Example: Sales_India_EN_HI) |
|-------|-----------------------------------|
| Name | Sales_India_EN_HI |
| Description | India sales - bilingual |

**Step 3:** Add Skills

| Skill | Type | Value |
|-------|------|-------|
| Sales | Boolean | TRUE |
| Region_India | Boolean | TRUE |
| English | Proficiency | 7 |
| Hindi | Proficiency | 7 |

**Step 4:** Click **"Save"**

**REPEAT for all 12 skill profiles.**

---

## 6.5 Flow Designer Implementation 

## 6.5.1 Flow Migration Overview

```
+-----------------------------------------------------------------------------+
|              UCCX -> FLOW DESIGNER MIGRATION                                 |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [!]️ CRITICAL: NO automated migration tool exists.                          |
|     All flows must be MANUALLY RECREATED in Flow Designer.                 |
|     This is a RE-BUILD, not a CONVERSION.                                  |
|                                                                             |
|  UCCX SCRIPT          | WXCC FLOW                   | COMPLEXITY | STATUS  |
|  ---------------------+-----------------------------+------------+---------|
|  MainMenu_EN.aef      | India_MainMenu_Flow_v1      | MEDIUM     | Build   |
|  MainMenu_HI.aef      | (merged with EN flow)       | MEDIUM     | Build   |
|  SalesQueue.aef       | Sales_QueueTreatment_v1     | LOW        | Build   |
|  SupportQueue.aef     | Support_QueueTreatment_v1   | MEDIUM     | Build   |
|  BillingQueue.aef     | Billing_QueueTreatment_v1   | MEDIUM     | Build   |
|  TechSupport.aef      | TechSupport_Flow_v1         | MEDIUM     | Build   |
|  AfterHours.aef       | AfterHours_Subflow_v1       | LOW        | Build   |
|  Callback.aef         | Callback_Flow_v1            | HIGH       | Build   |
|  Survey.aef           | Survey_PostCall_v1          | MEDIUM     | Build   |
|  ---------------------+-----------------------------+------------+---------|
|                                                                             |
|  TOTAL: 9 UCCX Scripts -> 9 WxCC Flows                                     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.5.2 India Main Menu Flow - Detailed Node Structure

Per Chapter 3.6.3:

```
+-----------------------------------------------------------------------------+
|              INDIA_MAINMENU_FLOW_V1 - NODE-BY-NODE DESIGN                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  NODE | TYPE              | CONFIGURATION                      | OUTPUT    |
|  ========================================================================= |
|                                                                             |
|  1    | Start             | Entry Point trigger                | -> Node 2  |
|       |                   | Auto-accepts call                  |           |
|  -----+-------------------+------------------------------------+-----------|
|  2    | Set Variable      | Initialize variables:              | -> Node 3  |
|       |                   | consent_status = "pending"         |           |
|       |                   | selected_language = "en"           |           |
|       |                   | callback_requested = false         |           |
|  -----+-------------------+------------------------------------+-----------|
|  3    | HTTP Request      | Business Hours Check               | -> Node 4  |
|       |                   | URL: {{API}}/business-hours        |   or 3A   |
|       |                   | Parse: business_hours = response   |           |
|  -----+-------------------+------------------------------------+-----------|
|  3A   | GoTo              | IF business_hours = FALSE          | -> After   |
|       |                   | GoTo: AfterHours_Subflow           |   Hours   |
|  -----+-------------------+------------------------------------+-----------|
|  4    | Play Message      | Welcome + Recording Consent        | -> Node 5  |
|       |                   | "Welcome to Abhavtech. This call   |           |
|       |                   | may be recorded for quality.       |           |
|       |                   | Press 1 for English.               |           |
|       |                   | Hindi ke liye 2 dabaiye."          |           |
|       |                   | Audio: welcome_bilingual.wav       |           |
|  -----+-------------------+------------------------------------+-----------|
|  5    | Collect Digits    | Language Selection                 | -> Node 6  |
|       |                   | Variable: language_choice          |   or 6A   |
|       |                   | Min: 1, Max: 1, Timeout: 5s        |           |
|       |                   | No Input: Default to "1" (English) |           |
|  -----+-------------------+------------------------------------+-----------|
|  6    | Condition         | IF language_choice = "1"           | -> Node 7  |
|       |                   |   THEN: Set language = "en"        |           |
|  6A   | Condition         | IF language_choice = "2"           | -> Node 7  |
|       |                   |   THEN: Set language = "hi"        |           |
|  -----+-------------------+------------------------------------+-----------|
|  7    | Virtual Agent V2  | AI Intent Detection (Optional)     | -> Node 8  |
|       |                   | Agent: Abhi_VA                     |   or 8A   |
|       |                   | Timeout: 5s                        |           |
|       |                   | ON Handled: -> End (contained)      |           |
|       |                   | ON Escalate: -> Node 8              |           |
|       |                   | ON No Intent: -> Node 8             |           |
|  -----+-------------------+------------------------------------+-----------|
|  8    | Play Message      | Main Menu (language-specific)      | -> Node 9  |
|       |                   | IF language = "en":                |           |
|       |                   |   "Press 1 for Sales.              |           |
|       |                   |    Press 2 for Support.            |           |
|       |                   |    Press 3 for Billing.            |           |
|       |                   |    Press 4 for Technical Support.  |           |
|       |                   |    Press 0 to speak with agent."   |           |
|       |                   | Audio: main_menu_en.wav            |           |
|       |                   | IF language = "hi":                |           |
|       |                   | Audio: main_menu_hi.wav            |           |
|  -----+-------------------+------------------------------------+-----------|
|  9    | Menu              | Main Selection                     | -> Per     |
|       |                   | Variable: menu_selection           |   option  |
|       |                   | Options: 1, 2, 3, 4, 0             |           |
|       |                   | Invalid: Replay (max 3x)           |           |
|       |                   | 1 -> Sales Queue (Node 10)          |           |
|       |                   | 2 -> Support Queue (Node 11)        |           |
|       |                   | 3 -> Billing Queue (Node 12)        |           |
|       |                   | 4 -> TechSupport Queue (Node 13)    |           |
|       |                   | 0 -> General Queue (Node 14)        |           |
|  -----+-------------------+------------------------------------+-----------|
|  10   | Set Variable      | Set skill requirements:            | -> Node 15 |
|       |                   | skill_sales = TRUE                 |           |
|       |                   | queue_name = "Sales_India_Queue"   |           |
|  -----+-------------------+------------------------------------+-----------|
|  11   | Set Variable      | skill_support = TRUE               | -> Node 15 |
|       |                   | queue_name = "Support_India_Queue" |           |
|  -----+-------------------+------------------------------------+-----------|
|  12   | Set Variable      | skill_billing = TRUE               | -> Node 15 |
|       |                   | queue_name = "Billing_Queue"       |           |
|  -----+-------------------+------------------------------------+-----------|
|  13   | Set Variable      | skill_techsupport = TRUE           | -> Node 15 |
|       |                   | queue_name = "TechSupport_Queue"   |           |
|  -----+-------------------+------------------------------------+-----------|
|  14   | Set Variable      | Direct to agent                    | -> Node 15 |
|       |                   | queue_name = "Support_India_Queue" |           |
|  -----+-------------------+------------------------------------+-----------|
|  15   | Queue Contact     | Route to selected queue            | -> Agent   |
|       |                   | Queue: {{queue_name}}              |   or      |
|       |                   | Skills: Per variables set          |   Node 16 |
|       |                   | ON No Agent: -> Node 16             |           |
|  -----+-------------------+------------------------------------+-----------|
|  16   | Play Message      | Callback Offer                     | -> Node 17 |
|       |                   | "All agents busy. Press 1 for      |           |
|       |                   | callback, 2 to continue waiting."  |           |
|  -----+-------------------+------------------------------------+-----------|
|  17   | Menu              | Callback Selection                 |           |
|       |                   | 1 -> Callback_Flow (Subflow)        |           |
|       |                   | 2 -> Return to Queue (Node 15)      |           |
|  -----+-------------------+------------------------------------+-----------|
|  18   | Disconnect        | End Call                           | END       |
|       |                   | Play: goodbye.wav                  |           |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.5.3 Flow Creation Procedure

**Navigation:** Control Hub -> Contact Center -> Flows

**Step 1: Create New Flow**

1. Click **"Create Flow"**
2. Select Type: **Inbound Voice Flow**
3. Name: **India_MainMenu_Flow_v1**
4. Description: **Primary India IVR - English/Hindi main menu**

**Step 2: Build Flow Canvas**

1. Drag **"Start"** node (auto-placed)
2. Add nodes per design (Section 6.5.2)
3. Connect nodes with edges
4. Configure each node properties

**Step 3: Configure Virtual Agent Node (Node 7)**

```
+-----------------------------------------------------------------------------+
|  VIRTUAL AGENT V2 NODE CONFIGURATION                                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Virtual Agent              | Abhi (select from dropdown)                  |
|  Input Audio                | {{NewPhoneContact.MediaResourceId}}          |
|  Language                   | {{selected_language}}                        |
|  Welcome Event              | WELCOME                                      |
|  Timeout Per Turn           | 30 seconds                                   |
|  Max No Input               | 3                                            |
|  ---------------------------+--------------------------------------------|
|                                                                             |
|  OUTPUT VARIABLE MAPPING:                                                  |
|  VirtualAgent.TranscriptSummary -> {{va_summary}}                          |
|  VirtualAgent.LastIntent -> {{va_intent}}                                  |
|  VirtualAgent.EscalationReason -> {{va_reason}}                            |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**Step 4: Validate Flow**

1. Click **"Validate"** button
2. Review all errors/warnings
3. Fix any issues

**Step 5: Publish Flow**

1. Click **"Publish"**
2. Add version note: "Initial release"
3. Confirm publication

## 6.5.4 Audio Prompt Migration

### 6.5.4.1 Prompt Inventory (Per Chapter 3.1.4)

```
+-----------------------------------------------------------------------------+
|              AUDIO PROMPT INVENTORY - 87 FILES                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ENGLISH PROMPTS (62 files):                                               |
|  ===========================                                               |
|  Category             | Count | Examples                                   |
|  ---------------------+-------+--------------------------------------------|
|  Welcome/Greeting     |     5 | welcome_main.wav, welcome_support.wav      |
|  Main Menu            |     8 | menu_options.wav, press_1_sales.wav        |
|  Queue Messages       |    12 | queue_position.wav, hold_music.wav         |
|  Error Messages       |     6 | invalid_option.wav, timeout.wav            |
|  Transfer Messages    |     4 | transfer_agent.wav, please_hold.wav        |
|  After Hours          |     3 | after_hours.wav, leave_message.wav         |
|  Holiday              |     8 | holiday_general.wav, diwali.wav            |
|  Survey               |     5 | survey_intro.wav, rate_experience.wav      |
|  Callback             |     4 | callback_offer.wav, callback_confirm.wav   |
|  System               |     7 | goodbye.wav, thankyou.wav                  |
|                                                                             |
|  HINDI PROMPTS (25 files):                                                 |
|  =========================                                                 |
|  Category             | Count | Examples                                   |
|  ---------------------+-------+--------------------------------------------|
|  Welcome/Greeting     |     3 | swagat_main.wav                            |
|  Main Menu            |     8 | menu_hindi.wav, ek_dabaye.wav              |
|  Queue Messages       |     5 | pratiksha.wav, dhanyawad.wav               |
|  Error Messages       |     3 | galat_chunav.wav                           |
|  After Hours          |     2 | office_band.wav                            |
|  System               |     4 | namaste.wav, alvida.wav                    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 6.5.4.2 Audio Format Conversion

**WxCC Audio Requirements:**

| Parameter | Specification |
|-----------|--------------|
| Format | WAV (RIFF) |
| Sample Rate | 8000 Hz |
| Bit Depth | 16-bit |
| Channels | Mono |
| Max File Size | 10 MB |
| Max Duration | 5 minutes |

**Conversion Command (FFmpeg):**

```bash
## Single file conversion 
ffmpeg -i input.wav -ar 8000 -ac 1 -acodec pcm_s16le output.wav

## Bulk conversion script 
for file in *.wav; do
  ffmpeg -i "$file" -ar 8000 -ac 1 -acodec pcm_s16le "converted/${file}"
done
```

### 6.5.4.3 Audio Upload Procedure

**Navigation:** Control Hub -> Contact Center -> Resources -> Audio Files

1. Click **"Upload Audio"**
2. Select converted file
3. Enter Name (e.g., `welcome_main_en`)
4. Select Language: **English** or **Hindi**
5. Click **"Upload"**

**REPEAT for all 87 audio files.**

---

## 6.6 Agent Desktop & User Provisioning 

## 6.6.1 User Profile Design (Per Chapter 3.7.3)

```
+-----------------------------------------------------------------------------+
|              AGENT DESKTOP USER PROFILES - 4 PROFILES                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  UP-01: Standard_Agent_Profile                                             |
|  =======================================================================   |
|  Role:                 Standard Agent                                      |
|  Agent Desktop:        [OK] Enabled                                           |
|  Multimedia Profile:   Voice only (1 call at a time)                       |
|  Wrap-up Time:         60 seconds (auto)                                   |
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
|  Agent Count:          100                                                 |
|                                                                             |
|  UP-02: Premium_Agent_Profile                                              |
|  =======================================================================   |
|  Role:                 Premium Agent                                       |
|  Agent Desktop:        [OK] Enabled                                           |
|  Multimedia Profile:   Voice + 3 concurrent chats + 5 emails               |
|  Wrap-up Time:         90 seconds (manual)                                 |
|  Additional Permissions:                                                   |
|    [OK] All Standard permissions                                              |
|    [OK] Access digital channels (Chat, WhatsApp, Email)                       |
|    [OK] Agent Assist features                                                 |
|    [OK] Screen recording (training)                                           |
|  Agent Count:          75                                                  |
|                                                                             |
|  UP-03: Supervisor_Profile                                                 |
|  =======================================================================   |
|  Role:                 Supervisor                                          |
|  Agent Desktop:        [OK] Enabled (can take calls)                          |
|  Additional Permissions:                                                   |
|    [OK] All Premium permissions                                               |
|    [OK] Monitor agents (listen/whisper/barge)                                 |
|    [OK] View real-time dashboards                                             |
|    [OK] Access team reports                                                   |
|    [OK] Change agent states                                                   |
|    [OK] Re-skill agents (temporary)                                           |
|    [X] System configuration                                                  |
|  Supervisor Count:     10                                                  |
|                                                                             |
|  UP-04: Admin_Profile                                                      |
|  =======================================================================   |
|  Role:                 Administrator                                       |
|  Agent Desktop:        Optional                                            |
|  Additional Permissions:                                                   |
|    [OK] All Supervisor permissions                                            |
|    [OK] User provisioning                                                     |
|    [OK] Flow Designer access                                                  |
|    [OK] Queue/Entry Point configuration                                       |
|    [OK] Reporting and analytics                                               |
|    [OK] Audit log access                                                      |
|  Admin Count:          5                                                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.6.2 Team Configuration

```
+-----------------------------------------------------------------------------+
|              TEAM CONFIGURATION - 8 TEAMS                                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  TEAM NAME            | SITE       | AGENTS | SUPERVISOR     | QUEUES      |
|  ---------------------+------------+--------+----------------+-------------|
|  India_Sales_Team     | Mumbai     |     45 | Priya Sharma   | Sales_India |
|  India_Support_Team   | Mumbai     |     40 | Raj Kumar      | Support_IN  |
|  India_TechSupport    | Mumbai     |     15 | Amit Verma     | TechSupport |
|  India_Billing_Team   | Mumbai     |     15 | Sneha Gupta    | Billing     |
|  Chennai_Support      | Chennai    |     25 | Karthik Raja   | Support_IN  |
|  India_Digital_Team   | Chennai    |     25 | Lakshmi Iyer   | Digital     |
|  EMEA_Team            | London     |     15 | James Wilson   | Sales_EMEA  |
|  Americas_Team        | New Jersey |     10 | Mike Johnson   | Sales_Amer  |
|  ---------------------+------------+--------+----------------+-------------|
|  TOTAL                |            |    175 | 10             |             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.6.3 Bulk Agent Provisioning

### CSV Template for 175 Agents

| Column | Required | Example |
|--------|----------|---------|
| Email | Yes | agent1@abhavtech.com |
| First Name | Yes | Priya |
| Last Name | Yes | Sharma |
| Site | Yes | Mumbai |
| Team | Yes | India_Sales_Team |
| User Profile | Yes | Standard_Agent_Profile |
| Skill Profile | Yes | Sales_India_EN_HI |
| Multimedia Profile | Yes | Voice_Only |
| Extension | Optional | 81001 |

**Upload Procedure:**

1. Download CSV template from Control Hub
2. Populate with 175 agent records
3. Navigate to: Control Hub -> Users -> Bulk Manage
4. Upload CSV file
5. Review validation results
6. Confirm import

---

## 6.7 Digital Channel Setup 

## 6.7.1 Web Chat Widget Configuration (Per Chapter 3.8.2)

**Navigation:** Control Hub -> Contact Center -> Channels -> Chat

### Step 1: Create Chat Asset

1. Click **"Create Chat Asset"**
2. Configure:

| Field | Value |
|-------|-------|
| Name | Abhavtech_WebChat_Widget |
| Description | Customer support chat widget |
| Entry Point | Global_Chat_EP |

### Step 2: Widget Branding

| Setting | Value |
|---------|-------|
| Primary Color | #1F4E79 (Abhavtech blue) |
| Logo | Upload abhavtech_logo.png |
| Widget Title | Chat with Abhavtech |
| Subtitle | We're here to help |

### Step 3: Pre-Chat Form

| Field | Required | Type |
|-------|----------|------|
| Name | Yes | Text |
| Email | Yes | Email |
| Query Type | Yes | Dropdown (Sales/Support/Billing/Other) |

### Step 4: Generate Embed Code

```html
<!-- Abhavtech Chat Widget -->
<script>
  !function(e,t){
    var n=document.createElement("script");
    n.type="text/javascript",
    n.async=!0,
    n.src="https://wxcc-connect.webex.com/bundle/abhavtech_widget.js",
    (document.getElementsByTagName("head")[0]||
    document.getElementsByTagName("body")[0]).appendChild(n)
  }(window,document);
</script>
```

### Step 5: Deploy to Website

1. Provide embed code to web development team
2. Deploy to: www.abhavtech.com/support
3. Test widget functionality

## 6.7.2 WhatsApp Business Configuration

**Prerequisites:**
- WhatsApp Business Account (verified)
- Meta Business Suite access
- Approved message templates

**Navigation:** Control Hub -> Contact Center -> Channels -> Social Messaging

### Step 1: Connect WhatsApp Business

1. Click **"Add Channel"** -> **"WhatsApp"**
2. Authenticate with Meta Business Suite
3. Select WhatsApp Business number: +91-XXXXXXXXXX
4. Accept WhatsApp Business terms

### Step 2: Configure Channel

| Setting | Value |
|---------|-------|
| Entry Point | Global_Chat_EP |
| Queue | Digital_Chat_Queue |
| Auto-Response | Enabled (outside business hours) |
| Response Time SLA | 15 seconds |

## 6.7.3 Email Channel Configuration

**Navigation:** Control Hub -> Contact Center -> Channels -> Email

### Step 1: Connect Mailbox

1. Click **"Add Email Channel"**
2. Email Address: **support@abhavtech.com**
3. Mailbox Type: **Microsoft 365** (OAuth)
4. Authenticate with Microsoft 365

### Step 2: Configure Settings

| Setting | Value |
|---------|-------|
| Polling Interval | 30 seconds |
| Entry Point | Global_Email_EP |
| Default Queue | Digital_Email_Queue |
| Auto-Acknowledgment | Enabled |
| Service Level | 4 hours |

---

## 6.8 AI/Virtual Agent Setup - Dual Platform Configuration 

## 6.8.1 Architecture Overview

```
+-----------------------------------------------------------------------------+
|              VIRTUAL AGENT "ABHI" - DUAL PLATFORM ARCHITECTURE              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                     GOOGLE CLOUD PLATFORM                            |   |
|  |  +-------------+  +-------------+  +-------------+                  |   |
|  |  | Dialogflow  |  | Cloud       |  | Cloud       |                  |   |
|  |  | CX Agent    |  | Functions   |  | Speech/TTS  |                  |   |
|  |  | "Abhi"      |  | (Webhooks)  |  | APIs        |                  |   |
|  |  +------+------+  +------+------+  +-------------+                  |   |
|  |         |                |                                           |   |
|  |         +----------------+                                           |   |
|  |                |                                                     |   |
|  +----------------+-----------------------------------------------------+   |
|                   | Service Account + JSON Key                              |
|                   v                                                         |
|  +---------------------------------------------------------------------+   |
|  |                     WEBEX CONTACT CENTER                             |   |
|  |  +-------------+  +-------------+  +-------------+                  |   |
|  |  | Virtual     |  | Flow        |  | Agent       |                  |   |
|  |  | Agent       |  | Designer    |  | Desktop     |                  |   |
|  |  | Connector   |  | VA Node     |  | (Context)   |                  |   |
|  |  +-------------+  +-------------+  +-------------+                  |   |
|  |                                                                      |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.8.2 PART A: Google Cloud Platform Configuration

### 6.8.2.1 Prerequisites

| Requirement | Details |
|-------------|---------|
| Google Cloud Account | With billing enabled |
| IAM Permissions | Dialogflow API Admin, Service Account Admin |
| APIs to Enable | Dialogflow, Speech-to-Text, Text-to-Speech |
| Region | asia-south1 (Mumbai) for data residency |

### 6.8.2.2 Step 1: Create Google Cloud Project

**Navigation:** console.cloud.google.com

1. Click **"Select Project"** -> **"New Project"**
2. Project Name: **abhavtech-wxcc-ai**
3. Organization: **abhavtech.com**
4. Click **"Create"**
5. **Record Project ID:** abhavtech-wxcc-ai

### 6.8.2.3 Step 2: Enable Required APIs

**Navigation:** APIs & Services -> Library

Enable:
- [OK] Dialogflow API
- [OK] Cloud Speech-to-Text API
- [OK] Cloud Text-to-Speech API
- [OK] Cloud Functions API
- [OK] Secret Manager API

### 6.8.2.4 Step 3: Create Service Account

**Navigation:** IAM & Admin -> Service Accounts

1. Click **"Create Service Account"**
2. Name: **wxcc-dialogflow-connector**
3. Description: **Service account for Webex Contact Center integration**
4. Click **"Create and Continue"**

**Assign Roles:**
- Dialogflow API Client
- Dialogflow API Reader
- Service Account Token Creator

5. Click **"Done"**

**Generate JSON Key:**

1. Click on service account **wxcc-dialogflow-connector**
2. Go to **"Keys"** tab
3. Click **"Add Key"** -> **"Create New Key"**
4. Select **JSON**
5. Click **"Create"**
6. **SAVE the downloaded JSON file securely**

### 6.8.2.5 Step 4: Create Dialogflow CX Agent

**Navigation:** dialogflow.cloud.google.com/cx

1. Select Project: **abhavtech-wxcc-ai**
2. Click **"Create Agent"**
3. Configure:

```
+-----------------------------------------------------------------------------+
|  DIALOGFLOW CX AGENT CONFIGURATION                                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Display Name               | Abhi (अभि)                                   |
|  Location                   | asia-south1 (Mumbai)                         |
|  Default Language           | en (English)                                 |
|  Additional Languages       | hi (Hindi)                                   |
|  Time Zone                  | Asia/Kolkata                                 |
|  ---------------------------+--------------------------------------------|
|                                                                             |
|  ADVANCED SETTINGS:                                                        |
|  * Speech to Text: Google Cloud Speech                                     |
|  * Text to Speech: Neural voice (en-IN-Wavenet-A, hi-IN-Wavenet-A)        |
|  * Logging: Enable Cloud Logging                                           |
|  * Enable spell correction: Yes                                            |
|                                                                             |
+-----------------------------------------------------------------------------+
```

4. Click **"Create"**
5. **Record Agent ID:** (from Agent Settings)

### 6.8.2.6 Step 5: Configure Intents (Per Chapter 3.9.2)

**Phase 1 Intents - 15 Intents:**

```
+-----------------------------------------------------------------------------+
|              PHASE 1 INTENT LIBRARY - 15 INTENTS                            |
+-----------------------------------------------------------------------------+
|                                                                             |
|  INTENT               | TRAINING PHRASES | FULFILLMENT          | CHANNEL  |
|  ---------------------+------------------+----------------------+----------|
|  greeting.hello       | 20               | Greeting response    | All      |
|  order.status         | 30               | Webhook: /orders     | All      |
|  order.track          | 25               | Webhook: /tracking   | All      |
|  product.inquiry      | 40               | Knowledge Base       | All      |
|  product.pricing      | 25               | Webhook: /pricing    | All      |
|  account.balance      | 20               | Webhook: /balance    | Voice    |
|  account.info         | 20               | Webhook: /account    | All      |
|  support.general      | 35               | Escalate to agent    | All      |
|  support.troubleshoot | 30               | KB + escalate        | All      |
|  billing.inquiry      | 25               | Webhook: /billing    | Voice    |
|  hours.location       | 15               | Static response      | All      |
|  callback.request     | 15               | Callback flow        | Voice    |
|  agent.handoff        | 20               | Immediate escalate   | All      |
|  feedback.survey      | 15               | Survey flow          | All      |
|  fallback.default     | N/A              | Clarify + retry      | All      |
|  ---------------------+------------------+----------------------+----------|
|                                                                             |
|  TOTAL: 15 Intents, ~355 Training Phrases                                  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**Intent Creation Procedure:**

1. Navigate to **"Manage"** -> **"Intents"**
2. Click **"+ Create"**
3. Enter Intent Name: **order.status**
4. Add Training Phrases (30):
   - Where is my order
   - Track my order
   - Order status
   - What is my order status
   - Mera order kahan hai (Hindi)
   - Order ka status kya hai (Hindi)
   - (Add remaining variations)
5. Click **"Save"**

**REPEAT for all 15 intents.**

### 6.8.2.7 Step 6: Configure Webhook Fulfillment

**Create Cloud Function:**

**Navigation:** Cloud Functions -> Create Function

```javascript
// abhavtech-va-webhook/index.js
const functions = require('@google-cloud/functions-framework');

functions.http('dialogflowWebhook', async (req, res) => {
  const tag = req.body.fulfillmentInfo?.tag;
  const params = req.body.sessionInfo?.parameters || {};
  const ani = params.ani || '';
  
  let responseText = '';
  
  switch(tag) {
    case 'order-status':
      const orderNum = params.order_number;
      // Call Abhavtech Order API
      const status = await getOrderStatus(orderNum);
      responseText = `Your order ${orderNum} is ${status.status}. 
                      Expected delivery: ${status.delivery_date}.`;
      break;
      
    case 'account-balance':
      const balance = await getAccountBalance(ani);
      responseText = `Your current account balance is ₹${balance}.`;
      break;
      
    case 'product-pricing':
      const product = params.product_name;
      const pricing = await getProductPricing(product);
      responseText = `${product} pricing starts at ₹${pricing.base_price}. 
                      Would you like to know more?`;
      break;
      
    default:
      responseText = 'I understand. Let me connect you with an agent.';
  }
  
  res.json({
    fulfillment_response: {
      messages: [{
        text: { text: [responseText] }
      }]
    }
  });
});

// API helper functions
async function getOrderStatus(orderNum) {
  const response = await fetch(`${process.env.ABHAVTECH_API}/orders/${orderNum}`);
  return response.json();
}

async function getAccountBalance(phone) {
  const response = await fetch(`${process.env.ABHAVTECH_API}/customers/balance?phone=${phone}`);
  return response.json();
}

async function getProductPricing(product) {
  const response = await fetch(`${process.env.ABHAVTECH_API}/products/pricing?name=${product}`);
  return response.json();
}
```

**Deploy Function:**

```bash
gcloud functions deploy abhavtech-va-webhook \
  --gen2 \
  --runtime=nodejs18 \
  --region=asia-south1 \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars ABHAVTECH_API=https://api.abhavtech.com/v1 \
  --entry-point=dialogflowWebhook
```

**Configure in Dialogflow CX:**

1. Navigate to **"Manage"** -> **"Webhooks"**
2. Click **"+ Create"**
3. Display Name: **abhavtech-fulfillment-webhook**
4. Webhook URL: **(Cloud Function URL from deployment)**
5. Click **"Save"**

### 6.8.2.8 Step 7: Configure Escalation Flow

1. Create Intent: **agent.handoff**
2. Training Phrases:
   - Talk to an agent
   - I want to speak to someone
   - Human please
   - Connect me to a person
   - Agent
   - Representative
   - Mujhe agent se baat karni hai (Hindi)

3. Create Escalation Page:
   - Add Parameter: `live_agent_escalation` = `true`
   - Response: "I'm connecting you to an agent now. Please hold."

### 6.8.2.9 Step 8: Test Agent

1. Click **"Test Agent"** in Dialogflow CX Console
2. Test each intent with sample utterances
3. Verify webhook responses
4. Test Hindi language
5. Test escalation flow

---

## 6.8.3 PART B: Webex Contact Center Configuration

### 6.8.3.1 Step 1: Add Virtual Agent Connector

**Navigation:** Control Hub -> Contact Center -> Connectors

1. Click **"Set Up"** under Virtual Agent
2. Select **"Google Dialogflow CX"**
3. Click **"Next"**

### 6.8.3.2 Step 2: Configure Connection

```
+-----------------------------------------------------------------------------+
|  WXCC DIALOGFLOW CX CONNECTOR CONFIGURATION                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Connector Name             | Abhi-Dialogflow-Connector                    |
|  Google Cloud Project ID    | abhavtech-wxcc-ai                            |
|  Location                   | asia-south1                                  |
|  Agent ID                   | [From Dialogflow CX Agent Settings]          |
|  Service Account Key        | [Upload JSON key file]                       |
|  ---------------------------+--------------------------------------------|
+-----------------------------------------------------------------------------+
```

4. Upload Service Account JSON key
5. Click **"Test Connection"** - Verify "Connection Successful"
6. Click **"Save"**

### 6.8.3.3 Step 3: Create Virtual Agent Configuration

**Navigation:** Control Hub -> Contact Center -> Features -> Virtual Agent

1. Click **"Create Virtual Agent"**
2. Configure:

| Field | Value |
|-------|-------|
| Name | Abhi |
| Connector | Abhi-Dialogflow-Connector |
| Default Language | en-US |
| Additional Languages | hi-IN |
| Voice | Neural (Dialogflow TTS) |
| Max No Input | 3 |
| Max Turns | 10 |
| Timeout Per Turn | 30 seconds |

3. Click **"Save"**

### 6.8.3.4 Step 4: Add Virtual Agent Node to Flow

**Navigation:** Contact Center -> Flows -> India_MainMenu_Flow_v1 -> Edit

1. Add **"Virtual Agent V2"** node after language selection
2. Configure:

```
+-----------------------------------------------------------------------------+
|  VIRTUAL AGENT V2 NODE - FLOW DESIGNER CONFIGURATION                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Virtual Agent              | Abhi                                         |
|  Input Audio                | {{NewPhoneContact.MediaResourceId}}          |
|  Language                   | {{selected_language}}                        |
|  Welcome Event              | WELCOME                                      |
|  Timeout Per Turn           | 30 seconds                                   |
|  Max No Input               | 3                                            |
|  ---------------------------+--------------------------------------------|
|                                                                             |
|  OUTPUT PATHS:                                                             |
|  * Handled -> End Flow (contained call)                                     |
|  * Escalated -> Continue to DTMF Menu (Node 8)                             |
|  * Error -> Error handling -> Queue_Support                                  |
|                                                                             |
|  CONTEXT VARIABLES TO PASS TO AGENT:                                       |
|  * va_summary = {{VirtualAgent.TranscriptSummary}}                        |
|  * va_intent = {{VirtualAgent.LastIntent}}                                |
|  * va_reason = {{VirtualAgent.EscalationReason}}                          |
|                                                                             |
+-----------------------------------------------------------------------------+
```

3. Connect output paths
4. **Validate** and **Publish** flow

### 6.8.3.5 Virtual Agent Testing Checklist

```
+-----------------------------------------------------------------------------+
|              VIRTUAL AGENT "ABHI" - TESTING CHECKLIST                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  GOOGLE CLOUD SIDE:                                                        |
|  [ ] Service Account permissions correct                                   |
|  [ ] Dialogflow agent responds in test console                            |
|  [ ] Webhook integration works (order status, balance)                    |
|  [ ] Hindi language model trained and working                             |
|  [ ] Escalation intent triggers properly                                  |
|                                                                             |
|  WEBEX SIDE:                                                               |
|  [ ] Connector test passes ("Connection Successful")                      |
|  [ ] Virtual Agent node executes in flow                                  |
|  [ ] Speech recognized correctly                                          |
|  [ ] Contained calls end properly                                         |
|  [ ] Escalated calls route to queue with context                          |
|  [ ] Context (summary, intent, reason) visible in Agent Desktop           |
|                                                                             |
|  END-TO-END SCENARIOS:                                                     |
|  [ ] "Where is my order" -> Order status provided -> Call ends              |
|  [ ] "What is my balance" -> Balance stated -> Call ends                    |
|  [ ] "Talk to agent" -> Escalates with context -> Agent receives call       |
|  [ ] Hindi: "Mera order kahan hai" -> Status in Hindi -> Call ends          |
|  [ ] 3x no input -> Auto escalate -> Agent receives call                    |
|                                                                             |
|  CONTAINMENT TARGET: 25% (Phase 1)                                         |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 6.9 Recording & WFO Configuration 

## 6.9.1 Recording Configuration (Per Chapter 3.10)

```
+-----------------------------------------------------------------------------+
|              RECORDING CONFIGURATION BY REGION                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  REGION     | CONSENT        | STORAGE    | RETENTION | PCI PAUSE          |
|  -----------+----------------+------------+-----------+--------------------|
|  India      | Single-party + | India DC   | 365 days  | Auto on DTMF       |
|             | Announcement   |            | (OSP req) | (Billing queue)    |
|  UK         | Two-party      | UK DC      | 180 days  | Auto on DTMF       |
|             | (GDPR)         |            |           |                    |
|  EU         | Two-party      | EU DC      | 180 days  | Auto on DTMF       |
|             | (GDPR + C5)    |            |           |                    |
|  Americas   | Announce       | US DC      | 90 days   | Auto on DTMF       |
|             | (state-depend) |            |           |                    |
|  -----------+----------------+------------+-----------+--------------------|
|                                                                             |
|  [!]️ India OSP requires minimum 1-year (365 days) retention                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.9.2 Recording Settings

**Navigation:** Control Hub -> Contact Center -> Settings -> Recording

| Setting | Value |
|---------|-------|
| Recording Mode | All Calls (100%) |
| Recording Format | Dual-channel stereo |
| Recording Announcement | Enabled |
| Recording Pause/Resume | Enabled |
| Auto-Pause on DTMF | Enabled (for PCI) |
| Storage Location | Regional (per compliance) |
| Retention Period | 365 days (India), 180 days (EMEA), 90 days (US) |

## 6.9.3 Quality Management Setup

**Navigation:** Control Hub -> Contact Center -> WFO -> Quality Management

### Evaluation Forms

| Form Name | Target | Sections | Score |
|-----------|--------|----------|-------|
| QM_Voice_Sales | Sales agents | Greeting, Product Knowledge, Closing | 100 |
| QM_Voice_Support | Support agents | Greeting, Issue Resolution, FCR | 100 |
| QM_Digital | Digital agents | Response Time, Accuracy, Tone | 100 |

## 6.9.4 Workforce Management Setup

| Setting | Value |
|---------|-------|
| Schedule Adherence Target | 95% |
| Grace Period | 3 minutes |
| Alert Threshold | Below 90% |
| Forecast Method | Historical + AI |

---

## 6.10 Pre-Go-Live Validation 

## 6.10.1 Configuration Validation Checklist

```
+-----------------------------------------------------------------------------+
|              PRE-GO-LIVE CONFIGURATION CHECKLIST                            |
+-----------------------------------------------------------------------------+
|                                                                             |
|  COMPONENT          | ITEMS                                     | STATUS   |
|  =======================================================================   |
|                                                                             |
|  TENANT SETUP                                                              |
|  -----------------------------------------------------------------------   |
|  [ ] Tenant activated with India DC                                        |
|  [ ] Licenses assigned (100 Standard + 75 Premium + 10 Supervisor)        |
|  [ ] SSO configured and tested                                            |
|  [ ] Admin roles assigned                                                  |
|  [ ] Data residency verified                                               |
|                                                                             |
|  ENTRY POINTS                                                              |
|  -----------------------------------------------------------------------   |
|  [ ] 6 Entry Points created and active                                    |
|  [ ] Dial numbers mapped correctly                                        |
|  [ ] Flows associated with Entry Points                                   |
|  [ ] Test calls reach Entry Points                                        |
|                                                                             |
|  QUEUES                                                                    |
|  -----------------------------------------------------------------------   |
|  [ ] 10 Queues configured                                                 |
|  [ ] Skills-based routing configured                                      |
|  [ ] Skill relaxation tested                                              |
|  [ ] Overflow paths verified                                              |
|                                                                             |
|  SKILLS                                                                    |
|  -----------------------------------------------------------------------   |
|  [ ] 18 Skills created                                                    |
|  [ ] 12 Skill Profiles configured                                         |
|  [ ] Agents assigned skill profiles                                       |
|                                                                             |
|  FLOWS                                                                     |
|  -----------------------------------------------------------------------   |
|  [ ] 9 Flows built and published                                          |
|  [ ] 87 Audio prompts uploaded                                            |
|  [ ] Virtual Agent integration working                                    |
|  [ ] All flow paths tested                                                |
|                                                                             |
|  AGENTS                                                                    |
|  -----------------------------------------------------------------------   |
|  [ ] 175 Agents provisioned                                               |
|  [ ] 8 Teams configured                                                   |
|  [ ] User profiles assigned                                               |
|  [ ] Agent Desktop accessible                                             |
|                                                                             |
|  DIGITAL CHANNELS                                                          |
|  -----------------------------------------------------------------------   |
|  [ ] Chat widget deployed and tested                                      |
|  [ ] WhatsApp connected and tested                                        |
|  [ ] Email channel configured                                             |
|                                                                             |
|  AI / VIRTUAL AGENT                                                        |
|  -----------------------------------------------------------------------   |
|  [ ] GCP Dialogflow CX agent configured                                   |
|  [ ] 15 Intents trained and tested                                        |
|  [ ] WxCC connector connected                                             |
|  [ ] VA node in flows working                                             |
|  [ ] Escalation with context verified                                     |
|                                                                             |
|  RECORDING & COMPLIANCE                                                    |
|  -----------------------------------------------------------------------   |
|  [ ] Recording enabled (all calls)                                        |
|  [ ] Consent announcements playing                                        |
|  [ ] PCI auto-pause working                                               |
|  [ ] Regional storage verified                                            |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.10.2 Call Flow Test Scenarios

```
+-----------------------------------------------------------------------------+
|              CALL FLOW TEST MATRIX - 20 SCENARIOS                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ID     | SCENARIO                          | EXPECTED RESULT    | STATUS  |
|  =======================================================================   |
|                                                                             |
|  VOICE FLOWS                                                               |
|  -----------------------------------------------------------------------   |
|  TC-01  | India TF -> English -> Sales        | Sales_India_Queue  | [ ]     |
|  TC-02  | India TF -> Hindi -> Support        | Support_India_Queue| [ ]     |
|  TC-03  | Mumbai DID -> Billing              | Billing_Queue      | [ ]     |
|  TC-04  | Invalid menu option               | Retry (max 3x)     | [ ]     |
|  TC-05  | Timeout (no input)                | Default English    | [ ]     |
|  TC-06  | After hours call                  | AfterHours flow    | [ ]     |
|  TC-07  | UK number -> EMEA_Main_EP          | Sales_EMEA_Queue   | [ ]     |
|  TC-08  | US number -> Americas_Main_EP      | Sales_Americas_Q   | [ ]     |
|                                                                             |
|  VIRTUAL AGENT                                                             |
|  -----------------------------------------------------------------------   |
|  TC-09  | "Where is my order"               | Order status given | [ ]     |
|  TC-10  | "What is my balance" (Hindi)      | Balance in Hindi   | [ ]     |
|  TC-11  | "Talk to an agent"                | Escalate w/context | [ ]     |
|  TC-12  | 3x no input                       | Auto escalate      | [ ]     |
|                                                                             |
|  AGENT OPERATIONS                                                          |
|  -----------------------------------------------------------------------   |
|  TC-13  | Agent hold/resume                 | MOH plays, resume  | [ ]     |
|  TC-14  | Blind transfer to queue           | Transfer completes | [ ]     |
|  TC-15  | Consult transfer                  | Context preserved  | [ ]     |
|  TC-16  | Conference call                   | 3-way works        | [ ]     |
|                                                                             |
|  DIGITAL CHANNELS                                                          |
|  -----------------------------------------------------------------------   |
|  TC-17  | Web chat conversation             | Agent receives chat| [ ]     |
|  TC-18  | WhatsApp inbound                  | Routed to digital Q| [ ]     |
|  TC-19  | Email routing                     | Email in queue     | [ ]     |
|                                                                             |
|  RECORDING                                                                 |
|  -----------------------------------------------------------------------   |
|  TC-20  | Recording playback                | Recording accessible| [ ]    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.10.3 Go/No-Go Criteria

```
+-----------------------------------------------------------------------------+
|              GO/NO-GO DECISION CRITERIA                                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  CRITERIA                          | THRESHOLD        | ACTUAL   | STATUS  |
|  ----------------------------------+------------------+----------+---------|
|  All Entry Points functional       | 100% (6/6)       |          | [ ]     |
|  All Queues receiving calls        | 100% (10/10)     |          | [ ]     |
|  Agent Desktop accessible          | 100% (175/175)   |          | [ ]     |
|  Virtual Agent containment         | > 20%            |          | [ ]     |
|  Recording operational             | 100%             |          | [ ]     |
|  Test scenarios passed             | > 95% (19/20)    |          | [ ]     |
|  No P1/P2 defects open             | 0                |          | [ ]     |
|  Rollback plan documented          | Complete         |          | [ ]     |
|  Agent training completed          | 100%             |          | [ ]     |
|  Supervisor sign-off               | All supervisors  |          | [ ]     |
|  ----------------------------------+------------------+----------+---------|
|                                                                             |
|  FINAL DECISION: [ ] GO    [ ] NO-GO                                       |
|                                                                             |
|  Date: ________________  Time: ________________                            |
|  Approved By: _____________________________                                |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.10.4 Sign-Off

```
+-----------------------------------------------------------------------------+
|              IMPLEMENTATION SIGN-OFF                                        |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ROLE                    | NAME               | SIGNATURE     | DATE       |
|  ------------------------+--------------------+---------------+------------|
|  Project Manager         |                    |               |            |
|  Technical Lead          |                    |               |            |
|  CC Operations Manager   |                    |               |            |
|  IT Security             |                    |               |            |
|  Business Owner          |                    |               |            |
|  ------------------------+--------------------+---------------+------------|
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## Document References

| Reference | Description |
|-----------|-------------|
| Chapter 1 | Discovery & Current State Assessment |
| Chapter 3 v2.0 | Webex Contact Center Design (source of truth) |
| Chapter 4 | Security & Compliance |
| Chapter 5 | Network & Infrastructure |
| Dialogflow CX Docs | cloud.google.com/dialogflow/cx/docs |
| WxCC Admin Guide | help.webex.com/en-us/article/n4jgze8 |
| Flow Designer Guide | help.webex.com/en-us/article/n9n1j5w |

---

*© 2026 Abhavtech.com - Internal Use Only*  
*Document Code: ABV-COLLAB-MIG-2026-P2-CH6 v3.0*
