# Chapter 3: Webex Contact Center Design (Phase 2) -- 3.5 Skills and Routing Design

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
