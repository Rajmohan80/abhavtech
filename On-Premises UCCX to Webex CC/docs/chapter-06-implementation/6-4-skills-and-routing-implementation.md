# Chapter 6: Webex Contact Center Implementation -- 6.4 Skills & Routing Implementation

## 6.4 Skills & Routing Implementation

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
