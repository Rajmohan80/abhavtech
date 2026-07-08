# Chapter 10: Advanced AI Integration & Implementation -- 10.10 Intent-Based Routing Architecture

## 10.10 Intent-Based Routing Architecture

## 10.10.1 Flow Modifications Overview

When AI is added in Phase 2B, the baseline IVR flows from Phase 2A must be modified to integrate Virtual Agent capabilities. This section documents the **critical changes** required.

### Flow Modification Summary

| Flow Name | Modification Type | Key Changes |
|-----------|-------------------|-------------|
| India_MainMenu_Flow_v1 | **MAJOR** | Add VA V2 node, intent routing, sentiment routing |
| EMEA_MainMenu_Flow_v1 | **MAJOR** | Add Webex AI Agent, DTMF fallback |
| Americas_MainMenu_Flow_v1 | **MAJOR** | Add Webex AI Agent, DTMF fallback |
| Digital_Chat_Flow_v1 | **MAJOR** | Add Dialogflow CX, rich responses |
| Support_QueueTreatment_v1 | **MINOR** | Add VA self-service offer during hold |
| NEW: VA_Containment_Flow_v1 | **CREATE** | End-to-end self-service |
| NEW: AI_Escalation_Subflow_v1 | **CREATE** | Context handoff to agents |

## 10.10.2 India Main Menu Flow - Before & After

### BEFORE: Phase 2A Baseline (DTMF Only)

```
+-----------------------------------------------------------------------------+
|        INDIA_MAINMENU_FLOW_V1 - PHASE 2A BASELINE                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [START] -> [Welcome Message] -> [Language Select DTMF] -> [Main Menu DTMF]   |
|                                      |                        |             |
|                               [1=English]              [1=Sales]            |
|                               [2=Hindi]                [2=Support]          |
|                                                        [3=Billing]          |
|                                                        [4=TechSup]          |
|                                                        [0=Agent]            |
|                                                             |               |
|                                                             v               |
|                                                     [Queue Selection]       |
|                                                                             |
|  CHARACTERISTICS:                                                          |
|  * 100% DTMF navigation                                                    |
|  * No natural language understanding                                       |
|  * All calls route to agents                                               |
|  * Containment: ~12%                                                       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### AFTER: Phase 2B AI-Enhanced

```
+-----------------------------------------------------------------------------+
|        INDIA_MAINMENU_FLOW_V1 - PHASE 2B AI-ENHANCED                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  [START]                                                                   |
|     |                                                                      |
|     v                                                                      |
|  [Set Variables: AI_Context, session_id, customer_ani]                     |
|     |                                                                      |
|     v                                                                      |
|  [Play Short Welcome: "Welcome to Abhavtech"]                              |
|     |                                                                      |
|     v                                                                      |
|  +=======================================================================+ |
|  |  * NEW: VIRTUAL AGENT V2 NODE                                        | |
|  |  Config: Abhi_Advanced_VA (Dialogflow CX)                            | |
|  |  Languages: en-IN, hi-IN (auto-detect)                               | |
|  |  Max Turns: 10                                                       | |
|  |  DTMF: Enabled                                                       | |
|  +============================+==========================================+ |
|                               |                                            |
|           +-------------------+-------------------+                        |
|           |                   |                   |                        |
|           v                   v                   v                        |
|      [HANDLED]          [ESCALATED]           [ERROR]                      |
|           |                   |                   |                        |
|           v                   v                   v                        |
|      [Survey]     +=======================+  [DTMF Fallback]              |
|           |       | * NEW: ROUTING LOGIC |       |                        |
|           v       |                       |       |                        |
|       [END]       | IF Sentiment < -0.5   |       |                        |
|    (Contained)    |   -> Priority Queue    |       |                        |
|                   | ELSE IF billing intent|       |                        |
|                   |   -> Billing Queue     |       |                        |
|                   | ELSE IF tech intent   |       |                        |
|                   |   -> TechSupport Queue |       |                        |
|                   | ELSE                  |       |                        |
|                   |   -> VA_Escalation_Que |       |                        |
|                   +===========+===========+       |                        |
|                               |                   |                        |
|                               v                   v                        |
|                        [QUEUE with             [DTMF Menu]                 |
|                         Context Vars]          1=Sales                     |
|                         * VA_Intent            2=Support                   |
|                         * VA_Sentiment         0=Agent                     |
|                         * VA_Transcript             |                      |
|                         * VA_Entities               v                      |
|                                               [QUEUE]                      |
|                                                                             |
|  KEY CHANGES:                                                              |
|  * VA V2 node replaces language selection + main DTMF menu                |
|  * Intent-based routing for escalated calls                               |
|  * Sentiment-aware priority routing                                        |
|  * Context variables passed to agents                                      |
|  * DTMF menu is FALLBACK only (on VA error)                               |
|  * Survey for contained interactions                                       |
|                                                                             |
|  EXPECTED OUTCOMES:                                                        |
|  * Containment: 12% -> 35%                                                  |
|  * AHT: 7.5 min -> 5.5 min                                                  |
|  * FCR: 68% -> 82%                                                          |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.10.3 Intent-to-Queue Mapping

| VA Last Intent | Target Queue | Skill Required | SL |
|----------------|--------------|----------------|----|
| order.status | VA_Escalation_Queue | AI_Escalation_Handler | 20s |
| order.track | VA_Escalation_Queue | AI_Escalation_Handler | 20s |
| product.inquiry | Sales_India_Queue | Sales | 30s |
| product.pricing | Sales_India_Queue | Sales | 30s |
| support.troubleshoot | TechSupport_Queue | TechnicalSupport | 45s |
| billing.inquiry | Billing_Queue | Billing | 60s |
| agent.handoff | VA_Escalation_Queue | AI_Escalation_Handler | 20s |
| *Sentiment < -0.5* | Sentiment_Priority_Queue | Sentiment_Recovery | **15s** |
| *Default/Error* | Support_India_Queue | Support | 45s |

## 10.10.4 Context Variables for Agent Screen Pop

When calls escalate from VA, these variables pass to agents:

| CAD Variable | Source | Purpose |
|--------------|--------|---------|
| VA_Intent | VirtualAgent.LastIntent | What customer asked about |
| VA_Confidence | VirtualAgent.IntentConfidence | How certain VA was |
| VA_Sentiment | VirtualAgent.Sentiment | Customer mood (positive/neutral/negative) |
| VA_Sentiment_Score | VirtualAgent.SentimentScore | Numeric score (-1.0 to +1.0) |
| VA_Escalation_Reason | VirtualAgent.ExitReason | Why VA ended |
| VA_Transcript_URL | VirtualAgent.TranscriptURL | Full conversation link |
| VA_Collected_Data | VirtualAgent.CustomPayload | Entities collected (JSON) |

---


Predictive Routing requires 6+ months of historical data. Phase 2B focuses on data collection:

| Data Point | Source | Used For |
|------------|--------|----------|
| Call outcomes | Wrap-up codes | Success prediction |
| Handle time per agent | Agent statistics | Efficiency matching |
| FCR by agent/queue | Survey + callbacks | Quality prediction |
| Customer intent | VA LastIntent | Skill matching |
| Sentiment trends | VA Sentiment | Priority routing |
| CSAT scores | Post-call survey | Outcome prediction |

**Phase 3 (Month 7+):** Enable WxCC Predictive Routing once sufficient data collected.

---


### Sentiment Routing Thresholds

| Score Range | Classification | Routing Action |
|-------------|----------------|----------------|
| -1.0 to -0.5 | Very Negative | -> Sentiment_Priority_Queue (15s SL) |
| -0.5 to -0.2 | Negative | -> Standard queue + Priority flag |
| -0.2 to +0.2 | Neutral | -> Standard intent-based routing |
| +0.2 to +1.0 | Positive | -> Standard intent-based routing |

**Sentiment_Priority_Queue Configuration:**
- Service Level: 15 seconds (aggressive)
- Skills: Sentiment_Recovery (Boolean)
- Agents: 15 (specially trained in de-escalation)
- Priority: Highest

---

*End of Part D: AI-Based Routing & Intelligence*

---


---
