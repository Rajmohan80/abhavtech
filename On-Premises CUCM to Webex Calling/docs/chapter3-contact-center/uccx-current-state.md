# 3.1 UCCX Current State Assessment

## 3.1.1 UCCX Cluster Architecture

```
   ABHAVTECH UCCX CURRENT STATE - CLUSTER ARCHITECTURE
   CUCM CLUSTER
   (Integration Point)
   CTI Manager Connection
      
   UCCX PRIMARY   <-> HA <->  UCCX SECONDARY
   uccx-pub.abv.com   (Failover)   uccx-sub.abv.com
   Version: 12.5(1)SU2   Version: 12.5(1)SU2
   Agents: 175   Agents: 175 (HA)
   Licenses: Premium   Role: Hot Standby
   Scripts: 9
   CSQs: 6
   INTEGRATIONS:
   CUCM 14.0 CTI Integration (JTAPI)
   Finesse Desktop 12.5 (175 agents)
   Cisco MediaSense Recording (optional)
   Internal CRM via Database Integration (ODBC)
   Wallboard via CUIC Reporting
   CAPACITY UTILIZATION:
   Peak concurrent calls: 85 (of 150 voice agents)
   Peak IVR ports: 40 (of 60 licensed)
   Peak agent sessions: 160 (of 175 licensed)
   Daily call volume: 3,500-4,200 calls
```

## 3.1.2 UCCX Agent Distribution by Site

```
   ABHAVTECH UCCX AGENT DISTRIBUTION
   SITE   VOICE   DIGITAL   TOTAL   TEAMS   HOURS
   
   Mumbai HQ   100   20   120   Sales-IN, Support   24x7
   Billing, Tech
   
   Chennai   25   5   30   Sales-IN, Support   9AM-9PM
   
   London   15   0   15   Sales-EMEA,Support   9AM-6PM
   
   New Jersey   10   0   10   Sales-US, Support   9AM-6PM
   
   TOTAL   150   25   175
   NOTES:
   Mumbai is 24x7 operation (3 shifts)
   Digital agents handle Email, Chat (not WhatsApp currently)
   London/New Jersey share EMEA/US overflow to Mumbai after hours
   Chennai provides Hindi/Tamil overflow support to Mumbai
```

## 3.1.3 UCCX Contact Service Queue (CSQ) Inventory

```
   ABHAVTECH UCCX CSQ INVENTORY
   CSQ NAME   TYPE   AGENTS   SL   MAX Q   ROUTING MODEL
   
   Sales_India_CSQ   Voice   45   30s   300s   Longest Available
   Sales_EMEA_CSQ   Voice   12   30s   300s   Longest Available
   Sales_Americas_CSQ   Voice   8   30s   300s   Longest Available
   Support_CSQ   Voice   55   45s   600s   Skill-Based
   Billing_CSQ   Voice   15   30s   300s   Skill-Based
   TechSupport_CSQ   Voice   15   60s   900s   Skill-Based
   
   TOTAL VOICE   150
   
   Email_CSQ   Digital   15   4hrs   24hr   Round Robin
   Chat_CSQ   Digital   10   30s   300s   Longest Available
   
   TOTAL DIGITAL   25
   LEGEND:
   SL = Service Level Target (time to answer)
   Max Q = Maximum time in queue before overflow
   OVERFLOW ROUTING:
   Sales_EMEA_CSQ overflow   Sales_India_CSQ (after hours)
   Sales_Americas_CSQ overflow   Sales_India_CSQ (after hours)
   All queues ultimate overflow   Voicemail after max queue time
```

## 3.1.4 UCCX Script Inventory (Detailed)

```
   ABHAVTECH UCCX SCRIPT INVENTORY - DETAILED
   SCRIPT NAME   ENTRY POINT   COMPLEXITY   DEPENDENCIES
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   1. MainMenu_EN.aef
   Entry Point:   +91-22-4961-1000 (Mumbai Toll)
   1800-266-1000 (India Toll-Free)
   Description:   Primary English IVR - Main Menu
   Complexity:   MEDIUM (4 menu levels, DB lookup)
   Call Volume:   ~2,500 calls/day
   Dependencies:   DB_Lookup (customer validation)
   PromptLibrary_EN (42 prompts)
   Business Hours:  Route to queue per selection
   After Hours:   Route to AfterHours.aef
   Flow Logic:
   Welcome   Language Select (EN/HI)   Auth (optional)
   Main Menu (Sales/Support/Billing/Tech)   Queue
   2. MainMenu_HI.aef
   Entry Point:   Same as MainMenu_EN (Hindi option selected)
   Description:   Hindi IVR - Main Menu (parallel to EN)
   Complexity:   MEDIUM (mirrors EN flow)
   Call Volume:   ~800 calls/day
   Dependencies:   PromptLibrary_HI (25 prompts)
   Flow Logic:   Same as EN, Hindi prompts
   3. SalesQueue.aef
   Entry Point:   Internal (from MainMenu press 1)
   Description:   Sales queue treatment with EWT
   Complexity:   LOW (queue + announcements)
   Dependencies:   None (uses system EWT)
   Flow Logic:   Comfort Message   EWT   Hold Music   Agent
   4. SupportQueue.aef
   Entry Point:   Internal (from MainMenu press 2)
   Description:   Support queue with ticket lookup
   Complexity:   MEDIUM (ticket # input, DB lookup)
   Dependencies:   DB_Lookup (ticket status)
   Flow Logic:   Get Ticket#   Lookup   Read Status   Queue
   5. BillingQueue.aef
   Entry Point:   Internal (from MainMenu press 3)
   Description:   Billing queue with account balance
   Complexity:   MEDIUM (account lookup, balance read)
   Dependencies:   DB_Lookup (billing system)
   Flow Logic:   Get Account   Validate   Read Balance   Queue
   6. TechSupport.aef
   Entry Point:   Internal (from MainMenu press 4)
   Description:   Technical support with product selection
   Complexity:   MEDIUM (product menu, skill routing)
   Dependencies:   Skill routing (ProductA, ProductB, ProductC)
   Flow Logic:   Product Menu   Skill Assignment   Queue
   7. AfterHours.aef
   Entry Point:   Internal (from MainMenu after hours)
   Description:   After hours treatment
   Complexity:   LOW (message + callback offer)
   Dependencies:   HolidayList (custom holiday calendar)
   CallbackRequest (DB write)
   Flow Logic:   Closed Message   Callback Offer   Voicemail
   8. Callback.aef
   Entry Point:   Internal (from queue overflow or after hours)
   Description:   Callback scheduling
   Complexity:   HIGH (time slot selection, DB write, outbound)
   Dependencies:   CallbackScheduler (outbound integration)
   DB_Write (callback table)
   Flow Logic:   Get Callback#   Time Slot   Confirm   Schedule
   9. Survey.aef
   Entry Point:   Post-call (agent transfer)
   Description:   Post-call satisfaction survey
   Complexity:   MEDIUM (3 questions, DB write)
   Dependencies:   DB_Write (survey responses)
   Flow Logic:   Q1 (1-5)   Q2 (1-5)   Q3 (1-5)   Thank   End
   *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *  *
   SUMMARY:
   Total Scripts: 9
   HIGH Complexity: 1 (Callback)
   MEDIUM Complexity: 6
   LOW Complexity: 2
   Total Prompts: 87 (EN: 62, HI: 25)
   DB Integrations: 4 scripts require database connectivity
```

## 3.1.5 UCCX Skills Inventory

```
   ABHAVTECH UCCX SKILLS INVENTORY
   SKILL NAME   TYPE   VALUES   AGENTS   USED IN CSQ
   
   Sales   Boolean   True/False   65   Sales_India/EMEA
   Support   Boolean   True/False   55   Support_CSQ
   Billing   Boolean   True/False   15   Billing_CSQ
   TechnicalSupport   Boolean   True/False   15   TechSupport_CSQ
   Hindi   Boolean   True/False   80   All (routing)
   English   Boolean   True/False   175   All (required)
   ProductA   Boolean   True/False   8   TechSupport_CSQ
   ProductB   Boolean   True/False   7   TechSupport_CSQ
   
   MIGRATION NOTES:
   All skills will be recreated in WxCC
   Add new skills: Tamil, German (EMEA), Region_APAC/EMEA/US
   Convert Boolean to Proficiency where relevant
```

## 3.1.6 UCCX Reporting & Metrics (Baseline)

```
   ABHAVTECH UCCX - CURRENT PERFORMANCE METRICS (BASELINE)
   METRIC   CURRENT   TARGET (WxCC)   IMPROVEMENT
   
   Daily Call Volume   3,800   4,500+   AI handles
   Service Level (30s)   72%   85%   +13%
   Average Handle Time (AHT)   7.5 min   5.5 min   -2 min
   First Call Resolution (FCR)   68%   82%   +14%
   Call Abandonment Rate   8.5%   4%   -4.5%
   Customer Satisfaction (CSAT)   3.8/5   4.3/5   +0.5
   IVR Containment Rate   12%   35%   +23% (AI)
   Agent Occupancy   78%   72%   Better WLB
   Average Speed to Answer (ASA)   45 sec   25 sec   -20 sec
   
   NOTE: Target metrics assume Phase 2 completion with AI features enabled
```

---

