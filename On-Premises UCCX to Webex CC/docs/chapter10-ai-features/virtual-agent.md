# Chapter 10: Advanced AI Integration & Implementation 

> **Document Reference:** ABV-COLLAB-MIG-2026 | Chapter 10  
> **Cross-References:** Chapter 3 (WxCC Baseline Design), Chapter 9 (AI Strategic Roadmap)  
> **Style:** Comprehensive Technical Implementation (Opus 4.5)  
> **Phase:** 2B - AI Enhancement (Post-Baseline Migration)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Jan 2026 | Collaboration Architecture Team | Initial release |
| | | | Part A: AI Platform Architecture |
| | | | Part B: Webex AI Agent Implementation |
| | | | Part C: Dialogflow CX Implementation |
| | | | Part D: AI-Based Routing |
| | | | Part E: Agent Assist |
| | | | Part F: Training Framework |
| | | | Part G: Operations |

---

## Executive Summary

This chapter provides comprehensive technical implementation guidance for Abhavtech's AI-enhanced contact center capabilities. Building upon the strategic roadmap established in Chapter 9 and the baseline Webex Contact Center design documented in Chapter 3, this chapter delivers the detailed specifications, configurations, and procedures required to deploy the hybrid AI architecture.

**Critical Prerequisite:** The AI enhancements documented in this chapter are designed to be implemented **only after** the Phase 2A baseline migration (UCCX to WxCC) has been completed and stabilized for a minimum of 3 months. This sequencing ensures that the foundational contact center platform operates reliably before introducing AI complexity.

**Key Technical Decisions:**

| Decision | Choice | Rationale |
|----------|--------|-----------|
| AI Platform Architecture | Hybrid (Webex AI Agent + Dialogflow CX) | Optimizes cost, capability, and complexity |
| Voice IVR - Simple Tasks | Webex AI Agent | Native integration, included licensing |
| Complex Conversations | Google Dialogflow CX | Superior NLU, multi-language, API integration |
| GCP Project | abhavtech-wxcc-ai | Centralized AI resources |
| GCP Region | asia-south1 (Mumbai) | India data residency compliance |
| Custom Model Training | Separate future project | Not required for baseline AI deployment |

**Implementation Scope:**

```
+-----------------------------------------------------------------------------+
|                    CHAPTER 10 IMPLEMENTATION SCOPE                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  IN SCOPE (This Chapter):                                                  |
|  ========================                                                  |
|  [OK] Hybrid AI platform architecture design                                  |
|  [OK] Webex AI Agent configuration (5 simple intents)                        |
|  [OK] Dialogflow CX agent setup (10 complex intents)                         |
|  [OK] Flow Designer modifications for AI integration                         |
|  [OK] Intent-based routing configuration                                     |
|  [OK] Agent Assist enablement                                                |
|  [OK] Knowledge base creation                                                |
|  [OK] Webhook development (Python)                                           |
|  [OK] Testing and deployment procedures                                      |
|  [OK] AI operations and monitoring                                           |
|                                                                             |
|  OUT OF SCOPE (Future/Separate):                                          |
|  ================================                                          |
|  [X] Custom NLU model training (separate project if needed)                 |
|  [X] Predictive routing (requires 6+ months data - Phase 3)                 |
|  [X] Advanced analytics/BI (Phase 3)                                        |
|  [X] Abhavtech proprietary AI integration (Phase 4)                         |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## Table of Contents

### PART A: AI PLATFORM ARCHITECTURE
- 10.1 [AI Platform Selection & Hybrid Strategy](#101-ai-platform-selection-hybrid-strategy)
- 10.2 [Integration Architecture](#102-integration-architecture)

### PART B: WEBEX AI AGENT IMPLEMENTATION
- 10.3 [Webex AI Agent Configuration](#103-webex-ai-agent-configuration)
- 10.4 [Webex AI Agent - Abhavtech Implementation](#104-webex-ai-agent-abhavtech-implementation)

### PART C: GOOGLE DIALOGFLOW CX IMPLEMENTATION
- 10.5 [Dialogflow CX Architecture & Setup](#105-dialogflow-cx-architecture-setup)
- 10.6 [NLU Design & Intent Development](#106-nlu-design-intent-development)
- 10.7 [Conversational Flow Design](#107-conversational-flow-design)
- 10.8 [Webhook & Fulfillment Integration](#108-webhook-fulfillment-integration)
- 10.9 [Dialogflow CX - Abhavtech Implementation](#109-dialogflow-cx-abhavtech-implementation)

### PART D: AI-BASED ROUTING & INTELLIGENCE
- 10.10 [Intent-Based Routing Architecture](#1010-intent-based-routing-architecture)
- 10.11 [Predictive Routing Preparation](#1011-predictive-routing-preparation)
- 10.12 [Sentiment-Aware Routing](#1012-sentiment-aware-routing)

### PART E: AGENT ASSIST & REAL-TIME AI
- 10.13 [Cisco AI Assistant Configuration](#1013-cisco-ai-assistant-configuration)
- 10.14 [Knowledge Base Development](#1014-knowledge-base-development)

### PART F: MODEL TRAINING & OPTIMIZATION
- 10.15 [Training Strategy Decision Framework](#1015-training-strategy-decision-framework)
- 10.16 [Continuous Improvement Framework](#1016-continuous-improvement-framework)

### PART G: TESTING, DEPLOYMENT & OPERATIONS
- 10.17 [AI Testing Methodology](#1017-ai-testing-methodology)
- 10.18 [Deployment & Cutover](#1018-deployment--cutover)
- 10.19 [AI Operations (AIOps)](#1019-ai-operations-aiops)

### APPENDICES
- Appendix 10-A: [Dialogflow CX Agent Export](#appendix-10-a-dialogflow-cx-agent-export)
- Appendix 10-B: [Webhook Code Samples (Python)](#appendix-10-b-webhook-code-samples-python)
- Appendix 10-C: [Training Phrase Library](#appendix-10-c-training-phrase-library)
- Appendix 10-D: [Test Case Matrix](#appendix-10-d-test-case-matrix)

---

## PART A: AI PLATFORM ARCHITECTURE 

---

## 10.1 AI Platform Selection & Hybrid Strategy 

## 10.1.1 Webex Contact Center AI Options Overview

Webex Contact Center provides multiple pathways for integrating conversational AI capabilities. Understanding these options is essential for making informed architectural decisions that balance capability, cost, and operational complexity.

### Native Webex AI Agent

Webex AI Agent represents Cisco's native conversational AI solution, fully integrated into the Webex Contact Center platform. This solution provides a streamlined approach to virtual agent deployment without requiring external platform dependencies.

**Architecture Characteristics:**

```
+-----------------------------------------------------------------------------+
|                    WEBEX AI AGENT ARCHITECTURE                              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                        WEBEX CONTROL HUB                            |   |
|  |  +-----------------+  +-----------------+  +-----------------+     |   |
|  |  |  AI Agent       |  |  Intent         |  |  Response       |     |   |
|  |  |  Configuration  |  |  Designer       |  |  Templates      |     |   |
|  |  +--------+--------+  +--------+--------+  +--------+--------+     |   |
|  +-----------+--------------------+--------------------+---------------+   |
|              |                    |                    |                   |
|              +--------------------+--------------------+                   |
|                                   |                                        |
|                                   v                                        |
|  +---------------------------------------------------------------------+   |
|  |                    WEBEX AI ENGINE (Cisco Cloud)                    |   |
|  |  +-----------------+  +-----------------+  +-----------------+     |   |
|  |  |  Speech-to-Text |  |  NLU Engine     |  |  Text-to-Speech |     |   |
|  |  |  (ASR)          |  |  (Intent Match) |  |  (Neural TTS)   |     |   |
|  |  +-----------------+  +-----------------+  +-----------------+     |   |
|  +---------------------------------------------------------------------+   |
|                                   |                                        |
|                                   v                                        |
|  +---------------------------------------------------------------------+   |
|  |                    WxCC FLOW DESIGNER                               |   |
|  |                    (Virtual Agent Activity)                         |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  CHARACTERISTICS:                                                          |
|  * Fully managed by Cisco                                                  |
|  * Configuration via Control Hub UI                                        |
|  * No external dependencies                                                |
|  * Included in WxCC Premium licensing                                      |
|  * Limited customization options                                           |
|  * English-primary (other languages in roadmap)                           |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**Capability Assessment:**

| Capability | Webex AI Agent | Assessment for Abhavtech |
|------------|----------------|--------------------------|
| Intent Recognition | Good for simple intents | Sufficient for FAQ, routing |
| Multi-turn Conversations | Limited | Not suitable for troubleshooting |
| Language Support | English primary | Hindi support limited |
| API Integration | Basic HTTP actions | Limited for complex backends |
| DTMF Fallback | Native support | Essential for voice IVR |
| Latency | Low (native) | Excellent for voice |
| Customization | Limited | Constrained flexibility |
| Cost | Included in license | No additional cost |

### Google Dialogflow CX (CCAI)

Dialogflow CX, part of Google's Contact Center AI (CCAI) portfolio, represents an enterprise-grade conversational AI platform offering advanced natural language understanding and sophisticated dialog management capabilities.

**Architecture Characteristics:**

```
+-----------------------------------------------------------------------------+
|                    DIALOGFLOW CX ARCHITECTURE                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                    GOOGLE CLOUD PLATFORM                            |   |
|  |                    Project: abhavtech-wxcc-ai                       |   |
|  |                    Region: asia-south1 (Mumbai)                     |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |                 DIALOGFLOW CX AGENT                         |   |   |
|  |  |  +-----------+  +-----------+  +-----------+  +----------+ |   |   |
|  |  |  |  Flows    |  |  Pages    |  |  Intents  |  | Entities | |   |   |
|  |  |  +-----+-----+  +-----+-----+  +-----+-----+  +----+-----+ |   |   |
|  |  |        +--------------+--------------+-------------+       |   |   |
|  |  |                       v                                     |   |   |
|  |  |              +-----------------+                           |   |   |
|  |  |              |  NLU Engine     |                           |   |   |
|  |  |              |  (ML-based)     |                           |   |   |
|  |  |              +--------+--------+                           |   |   |
|  |  |                       |                                     |   |   |
|  |  |              +--------+--------+                           |   |   |
|  |  |              v                 v                           |   |   |
|  |  |  +-----------------+  +-----------------+                 |   |   |
|  |  |  |  Fulfillment    |  |  Response       |                 |   |   |
|  |  |  |  (Webhooks)     |  |  Generation     |                 |   |   |
|  |  |  +--------+--------+  +-----------------+                 |   |   |
|  |  +-----------+-------------------------------------------------+   |   |
|  +--------------+-----------------------------------------------------+   |
|                 |                                                          |
|                 v                                                          |
|  +---------------------------------------------------------------------+   |
|  |                    ABHAVTECH BACKEND SYSTEMS                        |   |
|  |  +-------------+  +-------------+  +-------------+                 |   |
|  |  |   Order     |  |   Account   |  |   Billing   |                 |   |
|  |  |   System    |  |   System    |  |   System    |                 |   |
|  |  +-------------+  +-------------+  +-------------+                 |   |
|  +---------------------------------------------------------------------+   |
|                 |                                                          |
|  +--------------+------------------------------------------------------+   |
|  |                    WxCC CCAI CONNECTOR                              |   |
|  |                    (Virtual Agent V2 Node)                          |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  CHARACTERISTICS:                                                          |
|  * Enterprise-grade NLU with ML models                                     |
|  * Page-based conversation design (state machine)                         |
|  * Native multi-language support (40+ languages)                          |
|  * Sophisticated webhook/fulfillment capabilities                         |
|  * Version control and environments                                       |
|  * Advanced analytics and training tools                                  |
|  * GCP consumption-based pricing                                          |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**Capability Assessment:**

| Capability | Dialogflow CX | Assessment for Abhavtech |
|------------|---------------|--------------------------|
| Intent Recognition | Excellent (ML-based) | Superior for complex queries |
| Multi-turn Conversations | Advanced (page-based) | Essential for troubleshooting |
| Language Support | 40+ languages | Full Hindi/English support |
| API Integration | Full webhook support | Required for order/account systems |
| DTMF Fallback | Via WxCC integration | Requires flow design |
| Latency | Moderate (external) | Acceptable for complex tasks |
| Customization | Extensive | Full control over NLU |
| Cost | GCP consumption | Additional operational cost |

### Google Dialogflow ES (Legacy)

Dialogflow ES (Essentials) represents the previous generation of Google's conversational AI platform. While still supported, it lacks the advanced capabilities of Dialogflow CX.

**Recommendation:** Dialogflow ES is **not recommended** for new implementations. Abhavtech should use Dialogflow CX for all complex conversational AI requirements.

## 10.1.2 Webex AI Agent vs. Dialogflow CX Comparison

The following comprehensive comparison evaluates both platforms across dimensions critical to Abhavtech's requirements:

```
+-----------------------------------------------------------------------------+
|                    PLATFORM COMPARISON MATRIX                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  DIMENSION              | WEBEX AI AGENT      | DIALOGFLOW CX              |
|  =======================================================================   |
|                                                                             |
|  NATURAL LANGUAGE UNDERSTANDING                                            |
|  -------------------------------------------------------------------------  |
|  Intent Accuracy        | Good (85-90%)       | Excellent (92-97%)         |
|  Entity Extraction      | Basic               | Advanced + Custom          |
|  Context Handling       | Session-based       | Flow/Page state machine    |
|  Sentiment Detection    | Basic               | Advanced + scoring         |
|  Confidence Scoring     | Yes                 | Yes + calibration          |
|                                                                             |
|  CONVERSATION DESIGN                                                       |
|  -------------------------------------------------------------------------  |
|  Multi-turn Support     | Limited (3-4 turns) | Unlimited                  |
|  Branching Logic        | Basic conditions    | Complex state machine      |
|  Slot Filling           | Manual              | Automatic + validation     |
|  Disambiguation         | Basic               | Advanced + configurable    |
|  Fallback Handling      | Single fallback     | Multi-level + per-page     |
|                                                                             |
|  LANGUAGE & VOICE                                                          |
|  -------------------------------------------------------------------------  |
|  English Support        | Excellent           | Excellent                  |
|  Hindi Support          | Limited             | Full (native)              |
|  Code-Switching         | Not supported       | Supported (Hinglish)       |
|  TTS Quality            | Good (Cisco)        | Excellent (Google Neural)  |
|  ASR Accuracy           | Good                | Excellent                  |
|  Custom Vocabulary      | Limited             | Supported                  |
|                                                                             |
|  INTEGRATION                                                               |
|  -------------------------------------------------------------------------  |
|  WxCC Native            | Yes (built-in)      | Via CCAI Connector         |
|  REST API Calls         | Basic HTTP          | Full webhook support       |
|  Authentication         | Basic               | OAuth, API keys, JWT       |
|  Response Formatting    | Text only           | Rich (cards, carousels)    |
|  Digital Channels       | Limited             | Full support               |
|                                                                             |
|  OPERATIONS                                                                |
|  -------------------------------------------------------------------------  |
|  Version Control        | Basic               | Full (environments)        |
|  A/B Testing            | Not available       | Supported                  |
|  Analytics              | Basic (Control Hub) | Advanced (GCP Console)     |
|  Training Tools         | Limited             | Extensive                  |
|  Debugging              | Basic logs          | Full conversation trace    |
|                                                                             |
|  COST & LICENSING                                                          |
|  -------------------------------------------------------------------------  |
|  Base Cost              | Included in WxCC    | GCP consumption-based      |
|  Per-Interaction        | $0                  | ~$0.002-0.007/request      |
|  Infrastructure         | None (managed)      | GCP project required       |
|  Support                | Cisco TAC           | Google Cloud Support       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.1.3 Hybrid Architecture Design for Abhavtech

Based on the comparative analysis, Abhavtech's requirements, and the principle of optimizing cost-capability-complexity balance, a **hybrid architecture** leveraging both platforms is recommended.

### Architectural Rationale

The hybrid approach assigns each interaction type to the platform best suited for that specific use case:

**Webex AI Agent - Optimal For:**
- Simple, transactional voice IVR tasks
- Static FAQ responses
- Menu navigation assistance
- Native WxCC feature integration (callbacks, surveys)
- Scenarios where latency is critical
- Cost-sensitive high-volume simple queries

**Dialogflow CX - Optimal For:**
- Complex multi-turn conversations
- Queries requiring backend API integration
- Multi-language interactions (Hindi/English)
- Digital channel conversations (chat, WhatsApp)
- Scenarios requiring sophisticated NLU
- Use cases benefiting from rich response formatting

### Hybrid Architecture Diagram

```
+-----------------------------------------------------------------------------+
|                    ABHAVTECH HYBRID AI ARCHITECTURE                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|                           CUSTOMER CONTACT                                  |
|                                 |                                           |
|              +------------------+------------------+                       |
|              |                                      |                       |
|              v                                      v                       |
|  +---------------------+                +---------------------+            |
|  |    VOICE CHANNEL    |                |   DIGITAL CHANNELS  |            |
|  |    (IVR Entry)      |                |  (Chat / WhatsApp)  |            |
|  +----------+----------+                +----------+----------+            |
|             |                                      |                       |
|             v                                      |                       |
|  +-------------------------------------+          |                       |
|  |   WxCC FLOW DESIGNER                |          |                       |
|  |   India_MainMenu_Flow_v1            |          |                       |
|  |                                     |          |                       |
|  |   +-----------------------------+   |          |                       |
|  |   |  INITIAL GREETING           |   |          |                       |
|  |   |  "Welcome to Abhavtech..."  |   |          |                       |
|  |   +--------------+--------------+   |          |                       |
|  |                  |                   |          |                       |
|  |                  v                   |          |                       |
|  |   +-----------------------------+   |          |                       |
|  |   |  COMPLEXITY ASSESSMENT      |   |          |                       |
|  |   |  (First utterance analysis) |   |          |                       |
|  |   +--------------+--------------+   |          |                       |
|  |                  |                   |          |                       |
|  |        +---------+---------+        |          |                       |
|  |        |                   |        |          |                       |
|  |        v                   v        |          |                       |
|  |  +-----------+      +-----------+   |          |                       |
|  |  |  SIMPLE   |      |  COMPLEX  |   |          |                       |
|  |  |  INTENT   |      |  INTENT   |   |          |                       |
|  |  +-----+-----+      +-----+-----+   |          |                       |
|  |        |                  |         |          |                       |
|  +--------+------------------+---------+          |                       |
|           |                  |                    |                       |
|           v                  v                    v                       |
|  +-----------------+  +-----------------------------------------+         |
|  | WEBEX AI AGENT  |  |          DIALOGFLOW CX                  |         |
|  | (Cisco Native)  |  |     (Google Cloud - asia-south1)        |         |
|  +-----------------+  +-----------------------------------------+         |
|  |                 |  |                                         |         |
|  | HANDLES:        |  | HANDLES:                                |         |
|  | * greeting      |  | * order.status / order.track            |         |
|  | * hours.location|  | * product.inquiry / product.pricing     |         |
|  | * callback.req  |  | * account.balance / account.info        |         |
|  | * survey        |  | * support.troubleshoot                  |         |
|  | * agent.handoff |  | * billing.inquiry                       |         |
|  | * fallback.dtmf |  | * All digital channel conversations     |         |
|  |                 |  |                                         |         |
|  | 5 Intents       |  | 10 Intents                              |         |
|  | ~40% of voice   |  | ~60% of voice + 100% digital            |         |
|  |                 |  |                                         |         |
|  | RESPONSES:      |  | RESPONSES:                              |         |
|  | * TTS prompts   |  | * TTS prompts (voice)                   |         |
|  | * DTMF menus    |  | * Rich cards (digital)                  |         |
|  |                 |  | * API data (dynamic)                    |         |
|  |                 |  |                                         |         |
|  +--------+--------+  +------------------+----------------------+         |
|           |                              |                                 |
|           |    +-------------------------+                                 |
|           |    |                         |                                 |
|           v    v                         v                                 |
|  +-----------------+          +---------------------------------+         |
|  |   CONTAINED     |          |    ESCALATION TO AGENT          |         |
|  |   (Self-Service)|          |    (Context Preserved)          |         |
|  |                 |          |                                 |         |
|  |   * FAQ answered|          |    VA_Escalation_Queue          |         |
|  |   * Callback set|          |    Sentiment_Priority_Queue     |         |
|  |   * Survey done |          |    Standard queues              |         |
|  |                 |          |                                 |         |
|  |   Target: 35%   |          |    Agent receives:              |         |
|  +-----------------+          |    * Conversation transcript    |         |
|                               |    * Detected intent            |         |
|                               |    * Customer sentiment         |         |
|                               |    * Collected data             |         |
|                               +---------------------------------+         |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Traffic Flow Distribution

Based on Abhavtech's current call patterns (Chapter 1 discovery data) and industry benchmarks, the expected traffic distribution across platforms:

```
+-----------------------------------------------------------------------------+
|                    EXPECTED TRAFFIC DISTRIBUTION                            |
+-----------------------------------------------------------------------------+
|                                                                             |
|  VOICE CHANNEL (3,800 daily calls)                                         |
|  =======================================================================   |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |####################-----------------------------------------------|   |
|  |      35%           |              65%                              |   |
|  |   AI CONTAINED     |         AGENT HANDLED                         |   |
|  |   (1,330 calls)    |         (2,470 calls)                         |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  AI Contained Breakdown:                                                   |
|  +---------------------------------------------------------------------+   |
|  |  Webex AI Agent    |  Dialogflow CX                                |   |
|  |       40%          |      60%                                      |   |
|  |    (532 calls)     |   (798 calls)                                 |   |
|  |                    |                                               |   |
|  |  * Hours/Location  |  * Order Status                               |   |
|  |  * Callbacks       |  * Account Balance                            |   |
|  |  * Surveys         |  * Product Info                               |   |
|  |  * Simple routing  |  * Troubleshooting                            |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  DIGITAL CHANNELS (500 daily interactions)                                 |
|  =======================================================================   |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |####################################-------------------------------|   |
|  |              50%                   |           50%                 |   |
|  |         AI CONTAINED               |      AGENT HANDLED            |   |
|  |        (250 interactions)          |     (250 interactions)        |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  All digital AI handled by Dialogflow CX (richer responses, carousels)    |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.1.4 Decision Matrix & Final Recommendation

### Use Case Assignment Matrix

| Use Case | Volume/Day | Platform | Channel | Rationale |
|----------|------------|----------|---------|-----------|
| **Greeting/Welcome** | 3,800 | Both | All | Entry point for all interactions |
| **Hours/Location FAQ** | ~200 | Webex AI Agent | Voice | Static response, low latency needed |
| **Callback Request** | ~150 | Webex AI Agent | Voice | Native WxCC callback feature |
| **Post-Call Survey** | ~500 | Webex AI Agent | Voice | Simple CSAT, native integration |
| **Order Status** | ~800 | Dialogflow CX | All | API integration, multi-turn |
| **Order Tracking** | ~400 | Dialogflow CX | All | External carrier API |
| **Product Inquiry** | ~600 | Dialogflow CX | All | Complex catalog, variations |
| **Product Pricing** | ~300 | Dialogflow CX | All | Dynamic pricing lookups |
| **Account Balance** | ~500 | Dialogflow CX | All | Secure API, authentication |
| **Account Info** | ~200 | Dialogflow CX | All | PII handling |
| **General Support** | ~400 | Dialogflow CX | All | Routing + context gathering |
| **Troubleshooting** | ~300 | Dialogflow CX | All | Multi-turn diagnostic |
| **Billing Inquiry** | ~350 | Dialogflow CX | All | Payment system integration |
| **Agent Handoff** | Variable | Both | All | Escalation path |
| **Fallback** | Variable | Both | All | Unrecognized handling |

### Final Architecture Recommendation

```
+-----------------------------------------------------------------------------+
|                    ABHAVTECH AI PLATFORM RECOMMENDATION                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  RECOMMENDATION: HYBRID ARCHITECTURE                                       |
|  ===================================                                       |
|                                                                             |
|  Platform 1: WEBEX AI AGENT                                                |
|  -------------------------------------------------------------------------  |
|  Purpose:       Simple voice IVR interactions                              |
|  Intents:       5 (greeting, hours, callback, survey, handoff)            |
|  Channels:      Voice only                                                 |
|  Integration:   Native WxCC                                                |
|  Cost:          Included in WxCC licensing                                 |
|  Implementation: Control Hub configuration                                 |
|                                                                             |
|  Platform 2: GOOGLE DIALOGFLOW CX                                          |
|  -------------------------------------------------------------------------  |
|  Purpose:       Complex conversations, digital channels                    |
|  Intents:       10 (order, product, account, support, billing)            |
|  Channels:      Voice + Chat + WhatsApp                                    |
|  Integration:   WxCC CCAI Connector (Virtual Agent V2)                    |
|  Cost:          GCP consumption-based                                      |
|  GCP Project:   abhavtech-wxcc-ai                                         |
|  GCP Region:    asia-south1 (Mumbai)                                      |
|  Implementation: Dialogflow CX Console + Flow Designer                    |
|                                                                             |
|  ORCHESTRATION LAYER: WxCC FLOW DESIGNER                                   |
|  -------------------------------------------------------------------------  |
|  * Routes to appropriate AI platform based on initial utterance           |
|  * Manages fallback to DTMF menus                                         |
|  * Handles context preservation for escalations                           |
|  * Controls queue routing based on intent/sentiment                       |
|                                                                             |
|  SUCCESS METRICS:                                                          |
|  -------------------------------------------------------------------------  |
|  * Overall containment: 35% (Phase 2B Month 3) -> 45% (Month 6)            |
|  * Voice containment: 35%                                                  |
|  * Digital containment: 50%                                                |
|  * Intent recognition accuracy: >90%                                       |
|  * Customer satisfaction: 4.3/5.0                                         |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 10.2 Integration Architecture 

## 10.2.1 WxCC Flow Designer AI Integration Points

The Flow Designer serves as the orchestration layer for all AI interactions, managing the routing between Webex AI Agent, Dialogflow CX, and human agents. Understanding the integration points and data flows is essential for proper implementation.

### Virtual Agent V2 Node Architecture

Webex Contact Center provides the Virtual Agent V2 node (also known as the Virtual Agent - Voice node) as the primary integration point for conversational AI within Flow Designer.

```
+-----------------------------------------------------------------------------+
|                    VIRTUAL AGENT V2 NODE ARCHITECTURE                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                    FLOW DESIGNER CANVAS                             |   |
|  |                                                                     |   |
|  |  +-------------+    +-----------------------------------------+    |   |
|  |  |  Play       |--->|          VIRTUAL AGENT V2               |    |   |
|  |  |  Message    |    |                                         |    |   |
|  |  |  (Welcome)  |    |  +---------------------------------+   |    |   |
|  |  +-------------+    |  |  CONFIGURATION                  |   |    |   |
|  |                     |  |                                 |   |    |   |
|  |                     |  |  Contact Center AI Config:      |   |    |   |
|  |                     |  |  +- Webex AI Agent (native)     |   |    |   |
|  |                     |  |  +- Dialogflow CX (CCAI)        |   |    |   |
|  |                     |  |                                 |   |    |   |
|  |                     |  |  Input Variables:               |   |    |   |
|  |                     |  |  +- customer_ani               |   |    |   |
|  |                     |  |  +- customer_language          |   |    |   |
|  |                     |  |  +- session_id                 |   |    |   |
|  |                     |  |                                 |   |    |   |
|  |                     |  |  Conversation Settings:         |   |    |   |
|  |                     |  |  +- Max turns: 10              |   |    |   |
|  |                     |  |  +- No-input timeout: 5s       |   |    |   |
|  |                     |  |  +- Speech complete timeout:3s |   |    |   |
|  |                     |  |  +- Barge-in: Enabled          |   |    |   |
|  |                     |  |                                 |   |    |   |
|  |                     |  +---------------------------------+   |    |   |
|  |                     |                                         |    |   |
|  |                     |  +---------------------------------+   |    |   |
|  |                     |  |  OUTPUT VARIABLES               |   |    |   |
|  |                     |  |                                 |   |    |   |
|  |                     |  |  VirtualAgent.LastIntent        |   |    |   |
|  |                     |  |  VirtualAgent.IntentConfidence  |   |    |   |
|  |                     |  |  VirtualAgent.Sentiment         |   |    |   |
|  |                     |  |  VirtualAgent.TranscriptURL     |   |    |   |
|  |                     |  |  VirtualAgent.CustomPayload     |   |    |   |
|  |                     |  |  VirtualAgent.ExitReason        |   |    |   |
|  |                     |  |                                 |   |    |   |
|  |                     |  +---------------------------------+   |    |   |
|  |                     |                                         |    |   |
|  |                     +--------------+------------+-------------+    |   |
|  |                                    |            |                  |   |
|  |                     +--------------+            +--------------+   |   |
|  |                     |                                          |   |   |
|  |                     v                                          v   |   |
|  |            +-----------------+                    +-----------------+  |
|  |            |    HANDLED      |                    |    ESCALATED    |  |
|  |            |  (Contained)    |                    |  (To Agent)     |  |
|  |            |                 |                    |                 |  |
|  |            |  * Self-service |                    |  * Queue node   |  |
|  |            |  * Disconnect   |                    |  * Context pass |  |
|  |            +-----------------+                    +-----------------+  |
|  |                                                                     |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Output Variables Reference

The Virtual Agent V2 node exposes the following output variables that can be used for routing decisions and context passing:

| Variable | Type | Description | Use Case |
|----------|------|-------------|----------|
| `VirtualAgent.LastIntent` | String | Final detected intent name | Route to specific queue |
| `VirtualAgent.IntentConfidence` | Float | Confidence score (0.0-1.0) | Low confidence -> agent |
| `VirtualAgent.Sentiment` | String | Detected sentiment (positive/neutral/negative) | Priority routing |
| `VirtualAgent.SentimentScore` | Float | Sentiment score (-1.0 to 1.0) | Threshold-based routing |
| `VirtualAgent.TranscriptURL` | String | URL to conversation transcript | Agent reference |
| `VirtualAgent.CustomPayload` | JSON | Custom data from Dialogflow | Pass collected entities |
| `VirtualAgent.ExitReason` | String | Why VA ended (handled/escalated/error/timeout) | Error handling |
| `VirtualAgent.Language` | String | Detected language code | Language-based routing |
| `VirtualAgent.TurnCount` | Integer | Number of conversation turns | Complexity tracking |

## 10.2.2 Dual Platform Connector Configuration

Abhavtech's hybrid architecture requires configuring both Webex AI Agent and Dialogflow CX connectors in Control Hub.

### Control Hub AI Configuration

```
+-----------------------------------------------------------------------------+
|                    CONTROL HUB AI CONFIGURATION                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Navigation: Control Hub -> Contact Center -> Features -> Virtual Agent       |
|                                                                             |
|  CONFIGURED AI PLATFORMS:                                                  |
|  =======================================================================   |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |  PLATFORM 1: Webex AI Agent                                         |   |
|  |  -----------------------------------------------------------------  |   |
|  |  Name:              Abhi_Simple_VA                                  |   |
|  |  Type:              Webex AI Agent (Native)                         |   |
|  |  Status:            * Active                                        |   |
|  |                                                                     |   |
|  |  Configuration:                                                     |   |
|  |  +- Agent Type:     Scripted + NLU                                 |   |
|  |  +- Language:       English (en-US)                                |   |
|  |  +- Voice:          en-US-Neural2-J (Male)                         |   |
|  |  +- Intents:        5 configured                                   |   |
|  |  +- Fallback:       DTMF menu                                      |   |
|  |                                                                     |   |
|  |  Used in Flows:                                                     |   |
|  |  +- EMEA_MainMenu_Flow_v1                                          |   |
|  |  +- Americas_MainMenu_Flow_v1                                      |   |
|  |  +- Survey_PostCall_v1                                             |   |
|  |                                                                     |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |  PLATFORM 2: Google Dialogflow CX                                   |   |
|  |  -----------------------------------------------------------------  |   |
|  |  Name:              Abhi_Advanced_VA                                |   |
|  |  Type:              Contact Center AI (Google)                      |   |
|  |  Status:            * Active                                        |   |
|  |                                                                     |   |
|  |  CCAI Integration:                                                  |   |
|  |  +- GCP Project:    abhavtech-wxcc-ai                              |   |
|  |  +- Region:         asia-south1                                    |   |
|  |  +- Agent ID:       abhi-va-prod                                   |   |
|  |  +- Environment:    production                                     |   |
|  |  +- Service Account: wxcc-ccai-connector@abhavtech-wxcc-ai.iam     |   |
|  |                                                                     |   |
|  |  Voice Configuration:                                               |   |
|  |  +- Language:       en-IN, hi-IN                                   |   |
|  |  +- Voice:          en-IN-Neural2-A (Male)                         |   |
|  |  +- STT Model:      phone_call (enhanced)                          |   |
|  |  +- Single Utterance: Disabled                                     |   |
|  |                                                                     |   |
|  |  Used in Flows:                                                     |   |
|  |  +- India_MainMenu_Flow_v1                                         |   |
|  |  +- Digital_Chat_Flow_v1                                           |   |
|  |  +- Support_QueueTreatment_v1                                      |   |
|  |                                                                     |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.2.3 Data Flow: Customer -> AI -> Agent

Understanding the complete data flow from customer initiation through AI processing to potential agent handoff is critical for implementation and troubleshooting.

### Voice Channel Data Flow

```
+-----------------------------------------------------------------------------+
|                    VOICE CHANNEL DATA FLOW                                  |
+-----------------------------------------------------------------------------+
|                                                                             |
|  STEP 1: CALL INITIATION                                                   |
|  =======================================================================   |
|                                                                             |
|  Customer ------------------------------------------------------> PSTN     |
|  Dials: 1800-266-1000                                                      |
|                                                                             |
|  PSTN ----------------------------------------------------------> Webex    |
|  SIP INVITE with:                                                 Calling  |
|  +- ANI: +91-98765-43210                                                  |
|  +- DNIS: 1800-266-1000                                                   |
|  +- Media: G.711                                                          |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  STEP 2: FLOW ENTRY                                                        |
|  =======================================================================   |
|                                                                             |
|  Webex Calling -------------------------------------------------> WxCC    |
|  Routes to Entry Point: India_Main_Voice_EP                                |
|                                                                             |
|  WxCC ---------------------------------------------------------> Flow     |
|  Executes: India_MainMenu_Flow_v1                               Designer  |
|                                                                             |
|  Available Variables:                                                      |
|  +- NewPhoneContact.ANI = "+919876543210"                                 |
|  +- NewPhoneContact.DNIS = "18001234567"                                  |
|  +- NewPhoneContact.EntryPointId = "EP-01"                                |
|  +- NewPhoneContact.Timestamp = "2026-01-15T10:30:00Z"                    |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  STEP 3: VIRTUAL AGENT ENGAGEMENT                                          |
|  =======================================================================   |
|                                                                             |
|  Flow Designer -------------------------------------------------> VA Node |
|  Virtual Agent V2 Node Configuration:                                      |
|  +- CCAI Config: Abhi_Advanced_VA (Dialogflow CX)                         |
|  +- Input: customer_ani = NewPhoneContact.ANI                             |
|  +- Language Override: None (auto-detect)                                 |
|                                                                             |
|  VA Node -------------------------------------------------------> GCP     |
|  gRPC/REST to Dialogflow CX:                                    Cloud     |
|  +- Project: abhavtech-wxcc-ai                                            |
|  +- Agent: abhi-va-prod                                                   |
|  +- Session ID: auto-generated                                            |
|  +- Query Input: Audio stream                                             |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  STEP 4: CONVERSATION LOOP                                                 |
|  =======================================================================   |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                                                                     |   |
|  |    CUSTOMER              DIALOGFLOW CX           BACKEND            |   |
|  |        |                      |                     |               |   |
|  |        |  "Check my order    |                     |               |   |
|  |        |   status"           |                     |               |   |
|  |        |--------------------->                     |               |   |
|  |        |                      |                     |               |   |
|  |        |              Intent: order.status         |               |   |
|  |        |              Entity: (none yet)           |               |   |
|  |        |                      |                     |               |   |
|  |        |  "Sure! What's your |                     |               |   |
|  |        |   order number?"    |                     |               |   |
|  |        |<---------------------                     |               |   |
|  |        |                      |                     |               |   |
|  |        |  "ORD-12345"        |                     |               |   |
|  |        |--------------------->                     |               |   |
|  |        |                      |                     |               |   |
|  |        |              Entity: order_number=12345   |               |   |
|  |        |                      |                     |               |   |
|  |        |                      |  Webhook Request    |               |   |
|  |        |                      |-------------------->|               |   |
|  |        |                      |                     |               |   |
|  |        |                      |  Webhook Response   |               |   |
|  |        |                      |  {status: "shipped",|               |   |
|  |        |                      |   carrier: "FedEx", |               |   |
|  |        |                      |   eta: "Jan 17"}    |               |   |
|  |        |                      |<--------------------|               |   |
|  |        |                      |                     |               |   |
|  |        |  "Your order shipped|                     |               |   |
|  |        |   via FedEx, arriving|                    |               |   |
|  |        |   January 17th..."  |                     |               |   |
|  |        |<---------------------                     |               |   |
|  |        |                      |                     |               |   |
|  |        |  "Thanks!"          |                     |               |   |
|  |        |--------------------->                     |               |   |
|  |        |                      |                     |               |   |
|  |        |              Intent: greeting.goodbye     |               |   |
|  |        |              Exit: HANDLED                |               |   |
|  |        |                      |                     |               |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  STEP 5: FLOW CONTINUATION                                                 |
|  =======================================================================   |
|                                                                             |
|  VA Node returns to Flow Designer with:                                    |
|  +- VirtualAgent.ExitReason = "handled"                                   |
|  +- VirtualAgent.LastIntent = "greeting.goodbye"                          |
|  +- VirtualAgent.Sentiment = "positive"                                   |
|  +- VirtualAgent.TurnCount = 4                                            |
|  +- VirtualAgent.CustomPayload = {"order_number": "12345",                |
|                                     "order_status": "shipped"}             |
|                                                                             |
|  Flow routes to HANDLED exit -> Disconnect node                             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Escalation Data Flow

When the virtual agent cannot resolve the customer's issue or the customer requests an agent, the escalation flow preserves conversation context:

```
+-----------------------------------------------------------------------------+
|                    ESCALATION DATA FLOW                                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  TRIGGER CONDITIONS FOR ESCALATION:                                        |
|  =======================================================================   |
|  * Customer says "speak to agent" / "talk to human"                        |
|  * Intent: agent.handoff detected                                          |
|  * Confidence below threshold (<0.6)                                       |
|  * Sentiment score < -0.5 (negative)                                       |
|  * Max turns exceeded (>10)                                                |
|  * Repeated fallback (>3 consecutive)                                      |
|  * Webhook failure                                                         |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  CONTEXT PASSED TO AGENT:                                                  |
|  =======================================================================   |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |  AGENT DESKTOP - SCREEN POP                                         |   |
|  |  -----------------------------------------------------------------  |   |
|  |                                                                     |   |
|  |  CUSTOMER INFORMATION                                               |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |  Phone:        +91-98765-43210                              |   |   |
|  |  |  Wait Time:    0:45                                         |   |   |
|  |  |  Entry Point:  India Main Voice                             |   |   |
|  |  |  Language:     English                                      |   |   |
|  |  +-------------------------------------------------------------+   |   |
|  |                                                                     |   |
|  |  AI CONVERSATION SUMMARY                                            |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |  Intent:       billing.inquiry -> agent.handoff              |   |   |
|  |  |  Confidence:   0.72                                         |   |   |
|  |  |  Sentiment:    Frustrated (-0.6)                            |   |   |
|  |  |  Turns:        6                                            |   |   |
|  |  |  Escalation:   Customer requested agent                     |   |   |
|  |  +-------------------------------------------------------------+   |   |
|  |                                                                     |   |
|  |  COLLECTED INFORMATION                                              |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |  Account Number:    ACC-789456                              |   |   |
|  |  |  Issue Type:        Billing dispute                         |   |   |
|  |  |  Invoice Number:    INV-2026-001234                         |   |   |
|  |  |  Disputed Amount:   ₹15,000                                 |   |   |
|  |  +-------------------------------------------------------------+   |   |
|  |                                                                     |   |
|  |  CONVERSATION TRANSCRIPT    [View Full Transcript]                  |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |  Abhi: Welcome to Abhavtech. How can I help?                |   |   |
|  |  |  Customer: I have a billing problem                         |   |   |
|  |  |  Abhi: I can help with billing. What's your account?        |   |   |
|  |  |  Customer: ACC-789456                                       |   |   |
|  |  |  Abhi: I see invoice INV-2026-001234. What's the issue?     |   |   |
|  |  |  Customer: I was charged twice! This is ridiculous!         |   |   |
|  |  |  Abhi: I understand. Let me connect you to billing...       |   |   |
|  |  +-------------------------------------------------------------+   |   |
|  |                                                                     |   |
|  |  SUGGESTED ACTIONS                                                  |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |  [Review Invoice]  [Issue Credit]  [Escalate to Supervisor] |   |   |
|  |  +-------------------------------------------------------------+   |   |
|  |                                                                     |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.2.4 Context Preservation Across Platforms

When calls are routed through both AI platforms (e.g., initial Webex AI Agent greeting followed by Dialogflow CX for complex handling), context must be preserved.

### Cross-Platform Context Variables

| Context Element | Source | Storage | Pass To |
|-----------------|--------|---------|---------|
| Session ID | Flow Designer | Flow variable | Both platforms |
| Customer ANI | SIP headers | Global variable | Both platforms + Agent |
| Detected Language | First platform | Flow variable | Second platform + Agent |
| Conversation History | Each platform | Transcript URL | Agent |
| Collected Entities | Each platform | Custom payload JSON | Agent |
| Sentiment Trend | Dialogflow CX | Flow variable | Queue selection |

### Context Preservation Flow

```
+-----------------------------------------------------------------------------+
|                    CONTEXT PRESERVATION IMPLEMENTATION                      |
+-----------------------------------------------------------------------------+
|                                                                             |
|  FLOW DESIGNER VARIABLES FOR CONTEXT:                                      |
|  =======================================================================   |
|                                                                             |
|  // Initialize at flow start                                               |
|  Set Variable: AI_Context = {                                              |
|      "session_id": {{NewPhoneContact.InteractionId}},                     |
|      "customer_ani": {{NewPhoneContact.ANI}},                             |
|      "entry_time": {{CurrentDateTime}},                                   |
|      "detected_language": "en",                                           |
|      "platforms_used": [],                                                |
|      "intents_detected": [],                                              |
|      "entities_collected": {},                                            |
|      "sentiment_scores": [],                                              |
|      "escalation_reason": null                                            |
|  }                                                                         |
|                                                                             |
|  // After Webex AI Agent interaction                                       |
|  Set Variable: AI_Context.platforms_used += ["webex_ai_agent"]            |
|  Set Variable: AI_Context.intents_detected += [VirtualAgent.LastIntent]   |
|                                                                             |
|  // After Dialogflow CX interaction                                        |
|  Set Variable: AI_Context.platforms_used += ["dialogflow_cx"]             |
|  Set Variable: AI_Context.intents_detected += [VirtualAgent.LastIntent]   |
|  Set Variable: AI_Context.entities_collected =                             |
|      JSON.parse(VirtualAgent.CustomPayload)                               |
|  Set Variable: AI_Context.sentiment_scores +=                              |
|      [VirtualAgent.SentimentScore]                                        |
|                                                                             |
|  // Before queue routing                                                   |
|  Set Variable: AI_Context.escalation_reason = VirtualAgent.ExitReason     |
|                                                                             |
|  // Pass to agent via CAD variables                                        |
|  Set CAD Variable: VA_Intent = AI_Context.intents_detected[-1]            |
|  Set CAD Variable: VA_Sentiment = AI_Context.sentiment_scores[-1]         |
|  Set CAD Variable: VA_Entities = JSON.stringify(                          |
|      AI_Context.entities_collected)                                        |
|  Set CAD Variable: VA_Transcript = VirtualAgent.TranscriptURL             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.2.5 Failover & Fallback Patterns

Robust AI implementation requires comprehensive failover handling for various failure scenarios.

### Failure Scenarios and Responses

```
+-----------------------------------------------------------------------------+
|                    FAILOVER & FALLBACK PATTERNS                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  SCENARIO 1: DIALOGFLOW CX UNAVAILABLE                                     |
|  =======================================================================   |
|                                                                             |
|  Detection:     VirtualAgent.ExitReason = "error"                          |
|                 Error contains "UNAVAILABLE" or "DEADLINE_EXCEEDED"        |
|                                                                             |
|  Response:      Fallback to Webex AI Agent for basic routing               |
|                 If Webex AI Agent also fails -> DTMF menu                   |
|                                                                             |
|  Flow Logic:                                                               |
|  +---------------------------------------------------------------------+   |
|  |  IF VirtualAgent.ExitReason == "error" THEN                         |   |
|  |      Log: "Dialogflow CX error: " + VirtualAgent.ErrorMessage       |   |
|  |      Play: "We're experiencing technical difficulties..."           |   |
|  |      GOTO: Webex_AI_Agent_Fallback                                  |   |
|  |  END IF                                                             |   |
|  |                                                                     |   |
|  |  IF Webex_AI_Fallback.ExitReason == "error" THEN                    |   |
|  |      Play: "Please use our menu to direct your call..."             |   |
|  |      GOTO: DTMF_Menu_Fallback                                       |   |
|  |  END IF                                                             |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  SCENARIO 2: LOW CONFIDENCE INTENT                                         |
|  =======================================================================   |
|                                                                             |
|  Detection:     VirtualAgent.IntentConfidence < 0.6                        |
|                                                                             |
|  Response:      Offer clarification OR transfer to agent                   |
|                                                                             |
|  Flow Logic:                                                               |
|  +---------------------------------------------------------------------+   |
|  |  IF VirtualAgent.IntentConfidence < 0.6 THEN                        |   |
|  |      IF VirtualAgent.TurnCount < 3 THEN                             |   |
|  |          Play: "I'm not sure I understood. Could you rephrase?"     |   |
|  |          GOTO: Virtual_Agent_Retry                                  |   |
|  |      ELSE                                                           |   |
|  |          Play: "Let me connect you with someone who can help..."    |   |
|  |          GOTO: Agent_Queue                                          |   |
|  |      END IF                                                         |   |
|  |  END IF                                                             |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  SCENARIO 3: WEBHOOK TIMEOUT                                               |
|  =======================================================================   |
|                                                                             |
|  Detection:     Dialogflow webhook returns timeout (>5 seconds)            |
|                                                                             |
|  Response:      Graceful degradation with limited information              |
|                                                                             |
|  Webhook Logic:                                                            |
|  +---------------------------------------------------------------------+   |
|  |  # In Dialogflow CX webhook configuration                           |   |
|  |  # Enable partial response before webhook timeout                   |   |
|  |                                                                     |   |
|  |  Partial Response (sent at 3 seconds):                              |   |
|  |  "Let me look that up for you..."                                   |   |
|  |                                                                     |   |
|  |  Timeout Response (sent at 5 seconds):                              |   |
|  |  "I'm having trouble accessing that information right now.          |   |
|  |   Would you like me to connect you with an agent, or try again?"    |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  SCENARIO 4: REPEATED NO-INPUT                                             |
|  =======================================================================   |
|                                                                             |
|  Detection:     3 consecutive no-input events                              |
|                                                                             |
|  Response:      Offer DTMF alternative, then agent                         |
|                                                                             |
|  Flow Logic:                                                               |
|  +---------------------------------------------------------------------+   |
|  |  Track: NoInputCount += 1                                           |   |
|  |                                                                     |   |
|  |  IF NoInputCount == 2 THEN                                          |   |
|  |      Play: "I didn't hear anything. You can also press 1 for        |   |
|  |             Sales, 2 for Support, or 0 for an agent."               |   |
|  |      Enable: DTMF collection                                        |   |
|  |  END IF                                                             |   |
|  |                                                                     |   |
|  |  IF NoInputCount >= 3 THEN                                          |   |
|  |      Play: "Let me transfer you to an agent..."                     |   |
|  |      GOTO: Support_Queue                                            |   |
|  |  END IF                                                             |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Fallback Hierarchy

```
+-----------------------------------------------------------------------------+
|                    ABHAVTECH FALLBACK HIERARCHY                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  LEVEL 1: PRIMARY AI PLATFORM                                              |
|  -------------------------------------------------------------------------  |
|  Voice Complex: Dialogflow CX                                              |
|  Voice Simple:  Webex AI Agent                                             |
|  Digital:       Dialogflow CX                                              |
|                                                                             |
|           |                                                                |
|           | If error/unavailable                                           |
|           v                                                                |
|                                                                             |
|  LEVEL 2: ALTERNATE AI PLATFORM                                            |
|  -------------------------------------------------------------------------  |
|  Voice: Webex AI Agent (basic intents only)                                |
|  Digital: Static response ("Agent will assist shortly")                    |
|                                                                             |
|           |                                                                |
|           | If error/unavailable                                           |
|           v                                                                |
|                                                                             |
|  LEVEL 3: DTMF MENU (Voice Only)                                           |
|  -------------------------------------------------------------------------  |
|  "Press 1 for Sales, Press 2 for Support..."                               |
|                                                                             |
|           |                                                                |
|           | If no valid input                                              |
|           v                                                                |
|                                                                             |
|  LEVEL 4: DIRECT AGENT ROUTING                                             |
|  -------------------------------------------------------------------------  |
|  Route to Support_India_Queue with flag: "AI_Unavailable"                  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

*End of Part A: AI Platform Architecture*

---

## PART B: WEBEX AI AGENT IMPLEMENTATION 

---

## 10.3 Webex AI Agent Configuration 

## 10.3.1 Control Hub AI Agent Setup

Webex AI Agent configuration is performed entirely through Control Hub, Cisco's cloud administration portal. This section provides step-by-step configuration procedures for Abhavtech's simple intent virtual agent.

### Prerequisites

Before configuring Webex AI Agent, ensure the following prerequisites are met:

| Prerequisite | Status | Verification |
|--------------|--------|--------------|
| WxCC tenant provisioned | Required | Control Hub -> Contact Center visible |
| Premium agent licenses | Required | At least 1 Premium license for AI features |
| Administrator access | Required | Full admin role in Control Hub |
| Entry points configured | Required | Chapter 3 entry points operational |
| Flows created (baseline) | Required | Chapter 6 flows deployed |

### Control Hub Navigation

```
+-----------------------------------------------------------------------------+
|                    CONTROL HUB - AI AGENT NAVIGATION                        |
+-----------------------------------------------------------------------------+
|                                                                             |
|  URL: https://admin.webex.com                                              |
|                                                                             |
|  NAVIGATION PATH:                                                          |
|  =======================================================================   |
|                                                                             |
|  1. Login to Control Hub                                                   |
|     +-> Organization: Abhavtech                                           |
|                                                                             |
|  2. Left Navigation                                                        |
|     +-> Services                                                          |
|         +-> Contact Center                                                |
|                                                                             |
|  3. Contact Center Dashboard                                               |
|     +-> Features (left panel)                                             |
|         +-> Virtual Agent                                                 |
|                                                                             |
|  4. Virtual Agent Management                                               |
|     +-> + Create Virtual Agent                                            |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Creating the Webex AI Agent

```
+-----------------------------------------------------------------------------+
|                    WEBEX AI AGENT CREATION WIZARD                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  STEP 1: BASIC INFORMATION                                                 |
|  =======================================================================   |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                                                                     |   |
|  |  Virtual Agent Name:    [Abhi_Simple_VA                        ]   |   |
|  |                                                                     |   |
|  |  Description:           [Simple voice IVR agent for basic      ]   |   |
|  |                         [intents - hours, callbacks, surveys   ]   |   |
|  |                                                                     |   |
|  |  Agent Type:            O Scripted                                 |   |
|  |                         * Scripted with NLU                        |   |
|  |                         O Dialogflow CX                            |   |
|  |                         O Dialogflow ES                            |   |
|  |                                                                     |   |
|  |  ℹ️ "Scripted with NLU" enables natural language understanding     |   |
|  |     while maintaining scripted flow control                        |   |
|  |                                                                     |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  STEP 2: LANGUAGE & VOICE SETTINGS                                         |
|  =======================================================================   |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                                                                     |   |
|  |  Primary Language:      [English (United States) - en-US     v]   |   |
|  |                                                                     |   |
|  |  Additional Languages:  [ ] Hindi (India) - hi-IN                    |   |
|  |                         [ ] English (India) - en-IN                  |   |
|  |                         [ ] English (UK) - en-GB                     |   |
|  |                                                                     |   |
|  |  [!]️ Note: Webex AI Agent has limited Hindi support.                |   |
|  |     Complex Hindi interactions should use Dialogflow CX.           |   |
|  |                                                                     |   |
|  |  Voice Selection:                                                  |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |  Language        | Voice Name            | Gender | Preview |   |   |
|  |  |  ----------------+-----------------------+--------+---------|   |   |
|  |  |  English (US)    | en-US-Neural2-J       | Male   | [>]     |   |   |
|  |  |  English (India) | en-IN-Neural2-A       | Male   | [>]     |   |   |
|  |  +-------------------------------------------------------------+   |   |
|  |                                                                     |   |
|  |  Speaking Rate:         [1.0                                  v]   |   |
|  |                         (0.5 = slower, 1.5 = faster)               |   |
|  |                                                                     |   |
|  |  Pitch:                 [0                                    v]   |   |
|  |                         (-10 to +10)                               |   |
|  |                                                                     |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  STEP 3: CONVERSATION SETTINGS                                             |
|  =======================================================================   |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                                                                     |   |
|  |  No-Input Timeout:      [5            ] seconds                    |   |
|  |  ℹ️ Time to wait for customer speech before no-input event         |   |
|  |                                                                     |   |
|  |  Speech Complete Timeout: [2          ] seconds                    |   |
|  |  ℹ️ Silence duration to consider utterance complete                |   |
|  |                                                                     |   |
|  |  Max No-Input Retries:  [3            ]                            |   |
|  |  ℹ️ Number of no-input events before escalation                    |   |
|  |                                                                     |   |
|  |  Max No-Match Retries:  [3            ]                            |   |
|  |  ℹ️ Number of unrecognized inputs before escalation                |   |
|  |                                                                     |   |
|  |  Barge-In:              * Enabled  O Disabled                      |   |
|  |  ℹ️ Allow customers to interrupt VA speech                         |   |
|  |                                                                     |   |
|  |  DTMF Collection:       * Enabled  O Disabled                      |   |
|  |  ℹ️ Accept DTMF input alongside speech                             |   |
|  |                                                                     |   |
|  |  Inter-digit Timeout:   [3            ] seconds                    |   |
|  |  ℹ️ Max time between DTMF digits                                   |   |
|  |                                                                     |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  STEP 4: ADVANCED SETTINGS                                                 |
|  =======================================================================   |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                                                                     |   |
|  |  Confidence Threshold:  [0.6          ]                            |   |
|  |  ℹ️ Minimum confidence for intent match (0.0 - 1.0)                |   |
|  |     Below threshold -> no-match event                               |   |
|  |                                                                     |   |
|  |  Logging Level:         [Standard                             v]   |   |
|  |                         * Minimal - Errors only                    |   |
|  |                         * Standard - Intents + Errors              |   |
|  |                         * Verbose - Full transcripts               |   |
|  |                                                                     |   |
|  |  Session Timeout:       [300          ] seconds                    |   |
|  |  ℹ️ Max duration for VA conversation                               |   |
|  |                                                                     |   |
|  |  Enable Analytics:      [x] Enabled                                  |   |
|  |  ℹ️ Collect intent analytics in Control Hub                        |   |
|  |                                                                     |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|                                      [Cancel]  [Save & Configure Intents]  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.3.2 Scripted vs. NLU-Based Agents

Webex AI Agent supports multiple agent types, each suited for different use cases:

### Agent Type Comparison

| Agent Type | NLU Capability | Use Case | Abhavtech Application |
|------------|---------------|----------|----------------------|
| **Scripted** | None - DTMF only | Simple menu-driven IVR | Not recommended |
| **Scripted with NLU** | Basic intent matching | Hybrid voice + DTMF | **Selected for simple intents** |
| **Dialogflow CX** | Advanced NLU | Complex conversations | Used via CCAI Connector |
| **Dialogflow ES** | Moderate NLU | Legacy integrations | Not recommended |

### Why "Scripted with NLU" for Abhavtech

The "Scripted with NLU" agent type provides the optimal balance for Abhavtech's simple intents:

**Advantages:**
- Maintains DTMF fallback capability for accessibility
- Provides basic natural language understanding
- Lower latency than external Dialogflow calls
- Included in WxCC licensing (no additional cost)
- Simple configuration via Control Hub UI

**Limitations (acceptable for simple intents):**
- Limited multi-turn conversation support
- Basic entity extraction
- English-primary (Hindi limited)
- No webhook/API integration

## 10.3.3 Intent & Entity Configuration

Webex AI Agent intents are configured directly in Control Hub. For Abhavtech, 5 simple intents are assigned to this platform.

### Intent Configuration Interface

```
+-----------------------------------------------------------------------------+
|                    WEBEX AI AGENT - INTENT CONFIGURATION                    |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Virtual Agent: Abhi_Simple_VA                                             |
|  Intents: 5 configured                                                     |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |  + Add Intent                                          [Import]     |   |
|  |                                                                     |   |
|  |  CONFIGURED INTENTS:                                                |   |
|  |  ----------------------------------------------------------------- |   |
|  |                                                                     |   |
|  |  [x] greeting.hello              Training Phrases: 15    [Edit] [⋮]  |   |
|  |    "Hello", "Hi", "Good morning"...                                |   |
|  |                                                                     |   |
|  |  [x] hours.location              Training Phrases: 20    [Edit] [⋮]  |   |
|  |    "What are your hours", "Where are you located"...               |   |
|  |                                                                     |   |
|  |  [x] callback.request            Training Phrases: 18    [Edit] [⋮]  |   |
|  |    "Call me back", "Request callback"...                           |   |
|  |                                                                     |   |
|  |  [x] agent.handoff               Training Phrases: 25    [Edit] [⋮]  |   |
|  |    "Speak to agent", "Human please"...                             |   |
|  |                                                                     |   |
|  |  [x] fallback.default            System Intent           [Edit] [⋮]  |   |
|  |    Handles unrecognized input                                      |   |
|  |                                                                     |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Intent: greeting.hello

```
+-----------------------------------------------------------------------------+
|                    INTENT: greeting.hello                                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Intent Name:       greeting.hello                                         |
|  Description:       Welcome and initial greeting                           |
|  Priority:          Normal                                                 |
|                                                                             |
|  TRAINING PHRASES (15):                                                    |
|  =======================================================================   |
|                                                                             |
|  English:                                                                  |
|  +- "Hello"                                                               |
|  +- "Hi"                                                                  |
|  +- "Hey"                                                                 |
|  +- "Good morning"                                                        |
|  +- "Good afternoon"                                                      |
|  +- "Good evening"                                                        |
|  +- "Hi there"                                                            |
|  +- "Hello there"                                                         |
|  +- "Hey there"                                                           |
|  +- "Greetings"                                                           |
|  +- "I need help"                                                         |
|  +- "Can you help me"                                                     |
|  +- "I'm calling about"                                                   |
|  +- "I have a question"                                                   |
|  +- "Is anyone there"                                                     |
|                                                                             |
|  RESPONSE:                                                                 |
|  =======================================================================   |
|                                                                             |
|  Response Type:     * Text-to-Speech  O Audio File                        |
|                                                                             |
|  Response Text:                                                            |
|  +---------------------------------------------------------------------+   |
|  |  Hello! Welcome to Abhavtech. I'm Abhi, your virtual assistant.    |   |
|  |                                                                     |   |
|  |  I can help you with business hours and locations, request a       |   |
|  |  callback, or connect you to one of our team members.              |   |
|  |                                                                     |   |
|  |  How can I help you today?                                         |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  Follow-up Action:  * Listen for next input                               |
|                     O End conversation                                    |
|                     O Transfer to flow                                    |
|                                                                             |
|  Context Output:    intent_greeting = true                                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Intent: hours.location

```
+-----------------------------------------------------------------------------+
|                    INTENT: hours.location                                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Intent Name:       hours.location                                         |
|  Description:       Business hours and office location inquiries           |
|  Priority:          Normal                                                 |
|                                                                             |
|  TRAINING PHRASES (20):                                                    |
|  =======================================================================   |
|                                                                             |
|  Hours-related:                                                            |
|  +- "What are your hours"                                                 |
|  +- "What time do you open"                                               |
|  +- "What time do you close"                                              |
|  +- "Are you open now"                                                    |
|  +- "Business hours"                                                      |
|  +- "When are you open"                                                   |
|  +- "Operating hours"                                                     |
|  +- "What are your working hours"                                         |
|  +- "Are you open on weekends"                                            |
|  +- "Are you open on Sunday"                                              |
|                                                                             |
|  Location-related:                                                         |
|  +- "Where are you located"                                               |
|  +- "What is your address"                                                |
|  +- "Office location"                                                     |
|  +- "Where is your office"                                                |
|  +- "How do I get to your office"                                         |
|  +- "Directions to your office"                                           |
|  +- "Office address"                                                      |
|  +- "Location please"                                                     |
|  +- "Where are you"                                                       |
|  +- "What city are you in"                                                |
|                                                                             |
|  RESPONSE:                                                                 |
|  =======================================================================   |
|                                                                             |
|  Response Text:                                                            |
|  +---------------------------------------------------------------------+   |
|  |  Our main support center in Mumbai is available 24 hours a day,    |   |
|  |  7 days a week.                                                    |   |
|  |                                                                     |   |
|  |  Our regional offices operate Monday through Friday:               |   |
|  |  - India offices: 9 AM to 9 PM Indian Standard Time               |   |
|  |  - London office: 9 AM to 6 PM British Time                       |   |
|  |  - New Jersey office: 9 AM to 6 PM Eastern Time                   |   |
|  |                                                                     |   |
|  |  Our headquarters is located in Mumbai, India.                     |   |
|  |                                                                     |   |
|  |  Is there anything else I can help you with?                       |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  Follow-up Action:  * Listen for next input                               |
|                                                                             |
|  Containment:       [x] Mark as contained (self-service complete)           |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Intent: callback.request

```
+-----------------------------------------------------------------------------+
|                    INTENT: callback.request                                 |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Intent Name:       callback.request                                       |
|  Description:       Customer requests a callback instead of waiting        |
|  Priority:          High                                                   |
|                                                                             |
|  TRAINING PHRASES (18):                                                    |
|  =======================================================================   |
|                                                                             |
|  +- "Call me back"                                                        |
|  +- "Request a callback"                                                  |
|  +- "I want a callback"                                                   |
|  +- "Can you call me back"                                                |
|  +- "Please call me back"                                                 |
|  +- "I'd like a callback"                                                 |
|  +- "Schedule a callback"                                                 |
|  +- "Callback please"                                                     |
|  +- "I don't want to wait"                                                |
|  +- "Rather than wait can you call me"                                    |
|  +- "Have someone call me"                                                |
|  +- "Get someone to call me"                                              |
|  +- "Don't want to hold"                                                  |
|  +- "Too long to wait"                                                    |
|  +- "I'll take a callback"                                                |
|  +- "Put me on the callback list"                                         |
|  +- "Call me instead"                                                     |
|  +- "Ring me back"                                                        |
|                                                                             |
|  RESPONSE:                                                                 |
|  =======================================================================   |
|                                                                             |
|  Response Text:                                                            |
|  +---------------------------------------------------------------------+   |
|  |  I'll arrange for one of our team members to call you back.        |   |
|  |                                                                     |   |
|  |  I have your number as ending in {{ANI_LAST_4}}.                   |   |
|  |  Is this the best number to reach you?                             |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  Follow-up:         Collect confirmation (Yes/No)                          |
|                                                                             |
|  On Confirmation:                                                          |
|  +---------------------------------------------------------------------+   |
|  |  Great! We'll call you back within 30 minutes during business      |   |
|  |  hours. Thank you for contacting Abhavtech.                        |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  Action:            * Transfer to flow: Callback_Flow_v1                  |
|                       (Passes: callback_requested = true,                 |
|                                callback_number = {{ANI}})                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Intent: agent.handoff

```
+-----------------------------------------------------------------------------+
|                    INTENT: agent.handoff                                    |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Intent Name:       agent.handoff                                          |
|  Description:       Customer explicitly requests human agent               |
|  Priority:          High                                                   |
|                                                                             |
|  TRAINING PHRASES (25):                                                    |
|  =======================================================================   |
|                                                                             |
|  Direct requests:                                                          |
|  +- "Speak to an agent"                                                   |
|  +- "Talk to a human"                                                     |
|  +- "Human please"                                                        |
|  +- "Agent please"                                                        |
|  +- "Real person"                                                         |
|  +- "Transfer me"                                                         |
|  +- "Connect me to someone"                                               |
|  +- "I want to talk to a person"                                          |
|  +- "Get me a representative"                                             |
|  +- "Let me speak to someone"                                             |
|  +- "Operator"                                                            |
|  +- "Representative"                                                      |
|  +- "Customer service"                                                    |
|                                                                             |
|  Frustration indicators:                                                   |
|  +- "I don't want to talk to a bot"                                       |
|  +- "You're not helping"                                                  |
|  +- "This isn't working"                                                  |
|  +- "You don't understand"                                                |
|  +- "I need a real person"                                                |
|  +- "Stop, I want an agent"                                               |
|  +- "Just transfer me"                                                    |
|  +- "Enough with the robot"                                               |
|  +- "I'm done with this bot"                                              |
|                                                                             |
|  Politeness variants:                                                      |
|  +- "Could I please speak to someone"                                     |
|  +- "Would it be possible to talk to a person"                            |
|  +- "May I speak with a representative"                                   |
|                                                                             |
|  RESPONSE:                                                                 |
|  =======================================================================   |
|                                                                             |
|  Response Text:                                                            |
|  +---------------------------------------------------------------------+   |
|  |  Of course! I'll connect you with one of our team members right    |   |
|  |  away. Please hold while I transfer you.                           |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  Action:            * Exit to flow with escalation                        |
|                       Exit Reason: agent_requested                        |
|                       Target: Queue selection node                        |
|                                                                             |
|  Context Output:    escalation_reason = "customer_requested"              |
|                     intent_history = [previous intents]                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Intent: fallback.default

```
+-----------------------------------------------------------------------------+
|                    INTENT: fallback.default (System)                        |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Intent Name:       fallback.default                                       |
|  Description:       Handles unrecognized input                             |
|  Type:              System Intent (automatically triggered)                |
|                                                                             |
|  TRIGGER CONDITIONS:                                                       |
|  =======================================================================   |
|                                                                             |
|  * No intent matched with confidence > threshold (0.6)                     |
|  * Speech recognized but not understood                                    |
|  * Gibberish or unclear audio                                             |
|                                                                             |
|  RESPONSE SEQUENCE:                                                        |
|  =======================================================================   |
|                                                                             |
|  Attempt 1:                                                                |
|  +---------------------------------------------------------------------+   |
|  |  I didn't quite catch that. Could you please repeat what you       |   |
|  |  need help with? You can say things like "business hours" or       |   |
|  |  "request a callback".                                             |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  Attempt 2:                                                                |
|  +---------------------------------------------------------------------+   |
|  |  I'm still having trouble understanding. You can also press 1      |   |
|  |  for Sales, 2 for Support, 3 for Billing, or 0 to speak with       |   |
|  |  an agent.                                                         |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  Attempt 3+ (Max retries exceeded):                                        |
|  +---------------------------------------------------------------------+   |
|  |  Let me connect you with someone who can better assist you.        |   |
|  |  Please hold.                                                      |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  Action after max retries: Transfer to Support_India_Queue                 |
|                                                                             |
|  DTMF FALLBACK MAPPING:                                                    |
|  =======================================================================   |
|                                                                             |
|  | DTMF | Action                        | Target Queue            |       |
|  |------|-------------------------------|-------------------------|       |
|  |  1   | Transfer to Sales             | Sales_India_Queue       |       |
|  |  2   | Transfer to Support           | Support_India_Queue     |       |
|  |  3   | Transfer to Billing           | Billing_Queue           |       |
|  |  0   | Transfer to Agent             | Support_India_Queue     |       |
|  |  *   | Repeat menu                   | (replay prompt)         |       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.3.4 Response Templates & TTS Settings

### TTS Configuration Best Practices

```
+-----------------------------------------------------------------------------+
|                    TTS CONFIGURATION FOR ABHAVTECH                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  VOICE SELECTION RATIONALE:                                                |
|  =======================================================================   |
|                                                                             |
|  Selected Voice: en-US-Neural2-J (Male)                                    |
|                                                                             |
|  Reasons:                                                                  |
|  * Male voice aligns with "Abhi" persona (अभि = masculine name)           |
|  * Neural2 provides natural intonation                                    |
|  * US English understood globally                                         |
|  * Clear articulation for phone channel quality                           |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  SSML USAGE FOR ENHANCED RESPONSES:                                        |
|  =======================================================================   |
|                                                                             |
|  While basic TTS text works for simple responses, SSML can enhance        |
|  specific prompts:                                                         |
|                                                                             |
|  Example - Hours Response with Pauses:                                     |
|  +---------------------------------------------------------------------+   |
|  |  <speak>                                                           |   |
|  |    Our main support center in Mumbai is available                  |   |
|  |    <break time="300ms"/> 24 hours a day, 7 days a week.           |   |
|  |    <break time="500ms"/>                                          |   |
|  |    Our regional offices operate Monday through Friday:             |   |
|  |    <break time="300ms"/>                                          |   |
|  |    <prosody rate="95%">                                           |   |
|  |      India offices: 9 AM to 9 PM Indian Standard Time.            |   |
|  |      <break time="200ms"/>                                        |   |
|  |      London office: 9 AM to 6 PM British Time.                    |   |
|  |      <break time="200ms"/>                                        |   |
|  |      New Jersey office: 9 AM to 6 PM Eastern Time.                |   |
|  |    </prosody>                                                     |   |
|  |  </speak>                                                         |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  RESPONSE TEMPLATE GUIDELINES:                                             |
|  =======================================================================   |
|                                                                             |
|  1. Keep responses concise (under 30 seconds of speech)                   |
|  2. Use natural conversational language                                   |
|  3. Avoid jargon and technical terms                                      |
|  4. Include clear next-step guidance                                      |
|  5. End with open question for continued engagement                       |
|  6. Provide DTMF alternatives for accessibility                           |
|                                                                             |
|  TONE GUIDELINES (Abhi Persona):                                          |
|  * Friendly but professional                                              |
|  * Helpful and patient                                                    |
|  * Apologetic when unable to help                                         |
|  * Confident in capabilities                                              |
|  * Never defensive or robotic                                             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.3.5 Voice IVR Integration (Abhavtech Flows)

### Flow Designer Integration Points

The Webex AI Agent integrates with Abhavtech's flows through the Virtual Agent activity node. The following diagram shows the integration for EMEA and Americas flows (which use Webex AI Agent for simpler English-only interactions):

```
+-----------------------------------------------------------------------------+
|                    EMEA_MainMenu_Flow_v1 - AI INTEGRATION                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                         FLOW CANVAS                                 |   |
|  |                                                                     |   |
|  |  +-------------+                                                   |   |
|  |  |   START     |                                                   |   |
|  |  |  (Entry)    |                                                   |   |
|  |  +------+------+                                                   |   |
|  |         |                                                           |   |
|  |         v                                                           |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |  SET VARIABLES                                              |   |   |
|  |  |  ---------------------------------------------------------  |   |   |
|  |  |  region = "EMEA"                                            |   |   |
|  |  |  language = "en-GB"                                         |   |   |
|  |  |  business_hours = CheckBusinessHours("EMEA")                |   |   |
|  |  +--------------------------+----------------------------------+   |   |
|  |                             |                                       |   |
|  |                             v                                       |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |  CONDITION: business_hours == true                          |   |   |
|  |  +-------------+-----------------------------+-----------------+   |   |
|  |                | TRUE                        | FALSE               |   |
|  |                v                             v                     |   |
|  |  +-------------------------+   +-------------------------+        |   |
|  |  |  VIRTUAL AGENT V2       |   |  AFTER HOURS SUBFLOW    |        |   |
|  |  |  ---------------------  |   |  (AfterHours_Subflow_v1)|        |   |
|  |  |                         |   +-------------------------+        |   |
|  |  |  Config: Abhi_Simple_VA |                                      |   |
|  |  |                         |                                      |   |
|  |  |  Input Variables:       |                                      |   |
|  |  |  +- customer_ani        |                                      |   |
|  |  |  +- region              |                                      |   |
|  |  |  +- language            |                                      |   |
|  |  |                         |                                      |   |
|  |  |  Settings:              |                                      |   |
|  |  |  +- Max Turns: 8        |                                      |   |
|  |  |  +- Timeout: 5s         |                                      |   |
|  |  |  +- DTMF: Enabled       |                                      |   |
|  |  |                         |                                      |   |
|  |  +----------+--------------+                                      |   |
|  |             |                                                      |   |
|  |    +--------+--------+-----------------+                          |   |
|  |    |                 |                 |                          |   |
|  |    v                 v                 v                          |   |
|  |  [HANDLED]      [ESCALATED]      [ERROR]                          |   |
|  |    |                 |                 |                          |   |
|  |    v                 |                 v                          |   |
|  |  +----------+       |           +------------------+              |   |
|  |  | End Call |       |           | DTMF FALLBACK    |              |   |
|  |  | (Survey) |       |           | MENU             |              |   |
|  |  +----------+       |           +--------+---------+              |   |
|  |                     |                    |                        |   |
|  |                     |                    |                        |   |
|  |                     +--------+-----------+                        |   |
|  |                              |                                    |   |
|  |                              v                                    |   |
|  |  +-------------------------------------------------------------+ |   |
|  |  |  QUEUE ROUTING LOGIC                                        | |   |
|  |  |  ---------------------------------------------------------  | |   |
|  |  |                                                             | |   |
|  |  |  SWITCH (VirtualAgent.LastIntent OR DTMF_Selection):        | |   |
|  |  |                                                             | |   |
|  |  |  CASE "callback.request":                                   | |   |
|  |  |      -> Callback_Flow_v1                                     | |   |
|  |  |                                                             | |   |
|  |  |  CASE "agent.handoff" OR DTMF "0":                         | |   |
|  |  |      -> Support_EMEA_Queue                                   | |   |
|  |  |                                                             | |   |
|  |  |  CASE DTMF "1":                                            | |   |
|  |  |      -> Sales_EMEA_Queue                                     | |   |
|  |  |                                                             | |   |
|  |  |  CASE DTMF "2":                                            | |   |
|  |  |      -> Support_EMEA_Queue                                   | |   |
|  |  |                                                             | |   |
|  |  |  DEFAULT:                                                   | |   |
|  |  |      -> Support_EMEA_Queue                                   | |   |
|  |  |                                                             | |   |
|  |  +-------------------------------------------------------------+ |   |
|  |                                                                   |   |
|  +-------------------------------------------------------------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 10.4 Webex AI Agent - Abhavtech Implementation 

## 10.4.1 Simple Intent Implementation Summary

This section consolidates the 5 intents implemented in Webex AI Agent for Abhavtech:

### Intent Implementation Matrix

| Intent | Training Phrases | Response Type | Exit Action | Containment |
|--------|-----------------|---------------|-------------|-------------|
| greeting.hello | 15 | TTS | Listen | No |
| hours.location | 20 | TTS | Listen | **Yes** |
| callback.request | 18 | TTS + Confirm | Transfer to Callback_Flow | **Yes** |
| agent.handoff | 25 | TTS | Escalate | No |
| fallback.default | System | TTS + DTMF | Retry/Escalate | No |

### Containment Flow

```
+-----------------------------------------------------------------------------+
|                    WEBEX AI AGENT CONTAINMENT FLOW                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|                         CUSTOMER CALL                                       |
|                              |                                              |
|                              v                                              |
|                    +-----------------+                                     |
|                    |  greeting.hello |                                     |
|                    +--------+--------+                                     |
|                             |                                              |
|         +-------------------+-------------------+                         |
|         |                   |                   |                         |
|         v                   v                   v                         |
|  +-------------+   +---------------+   +---------------+                  |
|  |hours.location|   |callback.request|  | OTHER INTENT |                  |
|  +------+------+   +-------+-------+   | (complex)    |                  |
|         |                  |           +-------+-------+                  |
|         |                  |                   |                          |
|         v                  v                   v                          |
|  +-------------+   +-----------------+  +-----------------+              |
|  | CONTAINED   |   | CONTAINED       |  | NOT CONTAINED   |              |
|  | ------------|   | ----------------|  | ----------------|              |
|  |             |   |                 |  |                 |              |
|  | Response:   |   | Transfer to     |  | Options:        |              |
|  | Hours info  |   | Callback_Flow   |  | 1. Dialogflow CX|              |
|  |             |   |                 |  | 2. DTMF menu    |              |
|  | Next: Listen|   | Callback queued |  | 3. Agent queue  |              |
|  | or Goodbye  |   |                 |  |                 |              |
|  +------+------+   +--------+--------+  +--------+--------+              |
|         |                   |                    |                        |
|         |                   |                    |                        |
|         v                   v                    v                        |
|  +---------------------------------------------------------------------+ |
|  |                         ANALYTICS                                   | |
|  |  -----------------------------------------------------------------  | |
|  |                                                                     | |
|  |  Webex AI Agent Expected Containment:                               | |
|  |                                                                     | |
|  |  Total Calls to Webex AI Agent: ~1,500/day (EMEA + Americas +      | |
|  |                                  simple India queries)              | |
|  |                                                                     | |
|  |  +- hours.location:     ~200 calls -> 95% contained = 190           | |
|  |  +- callback.request:   ~150 calls -> 100% contained = 150          | |
|  |  +- greeting -> goodbye: ~100 calls -> 100% contained = 100          | |
|  |  +- Other (escalated):  ~1,050 calls -> 0% contained = 0            | |
|  |                                                                     | |
|  |  Webex AI Agent Containment Rate: 440 / 1,500 = ~29%               | |
|  |                                                                     | |
|  |  Note: Complex queries route to Dialogflow CX for higher           | |
|  |        containment potential                                       | |
|  |                                                                     | |
|  +---------------------------------------------------------------------+ |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.4.2 DTMF Fallback Configuration

DTMF fallback ensures accessibility and provides a safety net when NLU fails:

### DTMF Menu Configuration

```
+-----------------------------------------------------------------------------+
|                    DTMF FALLBACK MENU CONFIGURATION                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  TRIGGER CONDITIONS:                                                       |
|  * fallback.default triggered 2+ times                                     |
|  * Customer presses any DTMF key during VA conversation                    |
|  * VA error/timeout                                                        |
|                                                                             |
|  DTMF MENU PROMPT:                                                         |
|  =======================================================================   |
|                                                                             |
|  "You can use your keypad to navigate. Press:                              |
|   1 for Sales,                                                             |
|   2 for Support,                                                           |
|   3 for Billing,                                                           |
|   4 for Technical Support,                                                 |
|   5 to request a callback,                                                 |
|   or 0 to speak with an agent.                                            |
|   To hear these options again, press star."                                |
|                                                                             |
|  DTMF ROUTING TABLE:                                                       |
|  =======================================================================   |
|                                                                             |
|  | Key | Action                      | Target                       |     |
|  |-----|-----------------------------|------------------------------|     |
|  |  1  | Route to Sales              | Sales_{Region}_Queue         |     |
|  |  2  | Route to Support            | Support_{Region}_Queue       |     |
|  |  3  | Route to Billing            | Billing_Queue                |     |
|  |  4  | Route to Tech Support       | TechSupport_Queue            |     |
|  |  5  | Request Callback            | Callback_Flow_v1             |     |
|  |  0  | Speak to Agent              | Support_{Region}_Queue       |     |
|  |  *  | Repeat Menu                 | (replay DTMF prompt)         |     |
|  |  #  | Return to VA                | (restart VA conversation)    |     |
|                                                                             |
|  TIMEOUT HANDLING:                                                         |
|  =======================================================================   |
|                                                                             |
|  * No DTMF input within 10 seconds: Repeat prompt once                     |
|  * No DTMF input after repeat: Route to Support_{Region}_Queue             |
|  * Invalid DTMF key: "That's not a valid option." + repeat                 |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.4.3 Native Callback Integration

Webex Contact Center provides native callback functionality that integrates seamlessly with Webex AI Agent:

### Callback Flow Integration

```
+-----------------------------------------------------------------------------+
|                    CALLBACK INTEGRATION FLOW                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  TRIGGER: callback.request intent detected by Webex AI Agent               |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |  CALLBACK_FLOW_v1                                                   |   |
|  |                                                                     |   |
|  |  +-------------+                                                   |   |
|  |  |   START     |                                                   |   |
|  |  |  (from VA)  |                                                   |   |
|  |  +------+------+                                                   |   |
|  |         |                                                           |   |
|  |         v                                                           |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |  SET CALLBACK PARAMETERS                                    |   |   |
|  |  |  ---------------------------------------------------------  |   |   |
|  |  |  callback_number = {{NewPhoneContact.ANI}}                  |   |   |
|  |  |  callback_name = {{VA_Collected_Name}} OR "Customer"        |   |   |
|  |  |  callback_reason = {{VirtualAgent.LastIntent}}              |   |   |
|  |  |  callback_queue = DetermineQueue(callback_reason)           |   |   |
|  |  |  preferred_time = {{VA_Collected_Time}} OR "ASAP"           |   |   |
|  |  +--------------------------+----------------------------------+   |   |
|  |                             |                                       |   |
|  |                             v                                       |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |  CALLBACK NODE (WxCC Native)                                |   |   |
|  |  |  ---------------------------------------------------------  |   |   |
|  |  |                                                             |   |   |
|  |  |  Callback Type:        * Courtesy Callback                  |   |   |
|  |  |                        O Voicemail Callback                 |   |   |
|  |  |                                                             |   |   |
|  |  |  Queue:                {{callback_queue}}                   |   |   |
|  |  |  Callback Number:      {{callback_number}}                  |   |   |
|  |  |  Callback ANI:         Abhavtech main number                |   |   |
|  |  |  Max Attempts:         3                                    |   |   |
|  |  |  Retry Interval:       15 minutes                           |   |   |
|  |  |                                                             |   |   |
|  |  |  CAD Variables:                                             |   |   |
|  |  |  +- Callback_Reason:   {{callback_reason}}                  |   |   |
|  |  |  +- Original_Time:     {{NewPhoneContact.Timestamp}}        |   |   |
|  |  |  +- VA_Transcript:     {{VirtualAgent.TranscriptURL}}       |   |   |
|  |  |                                                             |   |   |
|  |  +--------------------------+----------------------------------+   |   |
|  |                             |                                       |   |
|  |                             v                                       |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |  PLAY CONFIRMATION                                          |   |   |
|  |  |  ---------------------------------------------------------  |   |   |
|  |  |                                                             |   |   |
|  |  |  "Great! We've scheduled a callback to {{callback_number}}. |   |   |
|  |  |   One of our team members will call you back within 30      |   |   |
|  |  |   minutes during business hours.                            |   |   |
|  |  |                                                             |   |   |
|  |  |   Your callback reference number is {{Callback_ID}}.        |   |   |
|  |  |                                                             |   |   |
|  |  |   Thank you for contacting Abhavtech. Goodbye!"             |   |   |
|  |  |                                                             |   |   |
|  |  +--------------------------+----------------------------------+   |   |
|  |                             |                                       |   |
|  |                             v                                       |   |
|  |                      +-------------+                               |   |
|  |                      |  DISCONNECT |                               |   |
|  |                      +-------------+                               |   |
|  |                                                                     |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  CALLBACK EXECUTION (Agent Side):                                          |
|  =======================================================================   |
|                                                                             |
|  1. Callback appears in queue as "Callback" contact type                   |
|  2. Agent accepts callback from queue                                      |
|  3. System automatically dials customer                                    |
|  4. Agent sees screen pop with:                                            |
|     - Original call context                                                |
|     - VA conversation transcript                                           |
|     - Callback reason                                                      |
|  5. Call proceeds as normal voice interaction                              |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.4.4 Post-Call Survey Flow

Webex AI Agent handles the post-call survey for contained interactions:

### Survey Implementation

```
+-----------------------------------------------------------------------------+
|                    POST-CALL SURVEY IMPLEMENTATION                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  TRIGGER: After agent call ends OR after VA contained interaction          |
|                                                                             |
|  SURVEY_POSTCALL_V1 FLOW:                                                  |
|  =======================================================================   |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                                                                     |   |
|  |  SURVEY PROMPT 1 (CSAT):                                           |   |
|  |  -----------------------------------------------------------------  |   |
|  |  "Before you go, we'd love your feedback.                          |   |
|  |   On a scale of 1 to 5, with 5 being excellent, how would you      |   |
|  |   rate your experience today?                                      |   |
|  |                                                                     |   |
|  |   Press 1 for Poor, 2 for Fair, 3 for Good, 4 for Very Good,       |   |
|  |   or 5 for Excellent."                                             |   |
|  |                                                                     |   |
|  |  Collection: DTMF (1-5)                                            |   |
|  |  Variable: survey_csat = {{DTMF_Input}}                            |   |
|  |                                                                     |   |
|  |  -----------------------------------------------------------------  |   |
|  |                                                                     |   |
|  |  SURVEY PROMPT 2 (FCR - Optional):                                 |   |
|  |  -----------------------------------------------------------------  |   |
|  |  Condition: Only if interaction was agent-handled                  |   |
|  |                                                                     |   |
|  |  "Was your issue resolved in this call?                            |   |
|  |   Press 1 for Yes, or 2 for No."                                   |   |
|  |                                                                     |   |
|  |  Collection: DTMF (1-2)                                            |   |
|  |  Variable: survey_fcr = {{DTMF_Input}} == 1 ? true : false         |   |
|  |                                                                     |   |
|  |  -----------------------------------------------------------------  |   |
|  |                                                                     |   |
|  |  CLOSING:                                                          |   |
|  |  -----------------------------------------------------------------  |   |
|  |  "Thank you for your feedback! Have a great day. Goodbye."         |   |
|  |                                                                     |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
|  SURVEY DATA STORAGE:                                                      |
|  =======================================================================   |
|                                                                             |
|  Survey responses are stored in WxCC Analyzer as CAD variables:            |
|  * survey_csat (1-5)                                                       |
|  * survey_fcr (true/false)                                                 |
|  * survey_timestamp                                                        |
|  * interaction_id (for correlation)                                        |
|  * agent_id (if agent-handled)                                             |
|  * va_contained (true/false)                                               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.4.5 Testing & Validation

### Webex AI Agent Test Plan

```
+-----------------------------------------------------------------------------+
|                    WEBEX AI AGENT TEST PLAN                                 |
+-----------------------------------------------------------------------------+
|                                                                             |
|  TEST CATEGORY 1: INTENT RECOGNITION                                       |
|  =======================================================================   |
|                                                                             |
|  | Test ID | Test Case                    | Input              | Expected |
|  |---------|------------------------------|--------------------|----------|
|  | WAA-001 | Greeting - Standard          | "Hello"            | greeting |
|  | WAA-002 | Greeting - Variation         | "Hey there"        | greeting |
|  | WAA-003 | Hours - Direct               | "What are your     | hours    |
|  |         |                              |  hours"            |          |
|  | WAA-004 | Hours - Indirect             | "Are you open now" | hours    |
|  | WAA-005 | Location - Direct            | "Where are you"    | hours    |
|  | WAA-006 | Callback - Standard          | "Call me back"     | callback |
|  | WAA-007 | Callback - Variation         | "I don't want to   | callback |
|  |         |                              |  wait"             |          |
|  | WAA-008 | Agent - Direct               | "Speak to agent"   | handoff  |
|  | WAA-009 | Agent - Frustration          | "You're not        | handoff  |
|  |         |                              |  helping"          |          |
|  | WAA-010 | Fallback - Gibberish         | "asdfghjkl"        | fallback |
|  | WAA-011 | Fallback - Out of scope      | "What's the        | fallback |
|  |         |                              |  weather"          |          |
|                                                                             |
|  TEST CATEGORY 2: CONVERSATION FLOW                                        |
|  =======================================================================   |
|                                                                             |
|  | Test ID | Test Case                    | Sequence           | Expected |
|  |---------|------------------------------|--------------------|----------|
|  | WAA-020 | Contained - Hours            | Hello -> Hours ->    | Contained|
|  |         |                              | Thanks -> Bye       | + Survey |
|  | WAA-021 | Contained - Callback         | Hello -> Callback -> | Callback |
|  |         |                              | Confirm            | scheduled|
|  | WAA-022 | Escalation - Request         | Hello -> Agent      | Queue    |
|  | WAA-023 | Escalation - Fallback        | Hello -> ??? -> ???  | Queue    |
|  |         |                              | -> ???              |          |
|  | WAA-024 | DTMF Fallback                | Press 1 during VA  | DTMF menu|
|                                                                             |
|  TEST CATEGORY 3: ERROR HANDLING                                           |
|  =======================================================================   |
|                                                                             |
|  | Test ID | Test Case                    | Condition          | Expected |
|  |---------|------------------------------|--------------------|----------|
|  | WAA-030 | No Input - First             | 5s silence         | Re-prompt|
|  | WAA-031 | No Input - Multiple          | 3x 5s silence      | DTMF menu|
|  | WAA-032 | No Match - First             | Unrecognized x1    | Clarify  |
|  | WAA-033 | No Match - Multiple          | Unrecognized x3    | Queue    |
|  | WAA-034 | Barge-in                     | Interrupt prompt   | Listen   |
|                                                                             |
|  TEST EXECUTION:                                                           |
|  =======================================================================   |
|                                                                             |
|  Environment:    WxCC UAT tenant                                           |
|  Test Numbers:   Internal test DIDs                                        |
|  Testers:        QA team + Business SMEs                                   |
|  Duration:       2 days                                                    |
|  Pass Criteria:  >90% of test cases pass                                   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

*End of Part B: Webex AI Agent Implementation*

---

## PART C: GOOGLE DIALOGFLOW CX IMPLEMENTATION 

---

## 10.5 Dialogflow CX Architecture & Setup 

## 10.5.1 Dialogflow CX Concepts Overview

Dialogflow CX uses a state-machine based architecture that differs significantly from traditional intent-based conversational AI. Understanding these concepts is essential for proper implementation.

### Core Architecture Components

```
+-----------------------------------------------------------------------------+
|                    DIALOGFLOW CX ARCHITECTURE MODEL                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                         DIALOGFLOW CX AGENT                         |   |
|  |                         (Abhi VA - asia-south1)                     |   |
|  |                                                                     |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |                          FLOWS                              |   |   |
|  |  |  (Conversation modules - reusable building blocks)          |   |   |
|  |  |                                                             |   |   |
|  |  |  +---------------+  +---------------+  +---------------+   |   |   |
|  |  |  | Default Start |  | Order Flow    |  | Support Flow  |   |   |   |
|  |  |  | Flow          |  |               |  |               |   |   |   |
|  |  |  |               |  | * Order Status|  | * Troubleshoot|   |   |   |
|  |  |  | * Welcome     |  | * Order Track |  | * General Help|   |   |   |
|  |  |  | * Main Menu   |  | * Order Cancel|  | * Escalation  |   |   |   |
|  |  |  | * Routing     |  |               |  |               |   |   |   |
|  |  |  +-------+-------+  +-------+-------+  +-------+-------+   |   |   |
|  |  |          |                  |                  |           |   |   |
|  |  +----------+------------------+------------------+-----------+   |   |
|  |             |                  |                  |               |   |
|  |  +----------+------------------+------------------+-----------+   |   |
|  |  |                          PAGES                             |   |   |
|  |  |  (Conversation states within a flow)                       |   |   |
|  |  |                                                             |   |   |
|  |  |  Each Page contains:                                        |   |   |
|  |  |  +- Entry Fulfillment (what to say/do on entry)            |   |   |
|  |  |  +- Parameters (data to collect)                           |   |   |
|  |  |  +- Routes (transitions based on intents/conditions)       |   |   |
|  |  |  +- Event Handlers (no-match, no-input, etc.)              |   |   |
|  |  |                                                             |   |   |
|  |  |  Example Pages in Order Flow:                               |   |   |
|  |  |  [Start] -> [Collect Order#] -> [Lookup] -> [Provide Status]  |   |   |
|  |  |                                                             |   |   |
|  |  +-------------------------------------------------------------+   |   |
|  |                                                                     |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |                        INTENTS                              |   |   |
|  |  |  (User intention recognition)                               |   |   |
|  |  |                                                             |   |   |
|  |  |  * Training phrases (what users might say)                  |   |   |
|  |  |  * Parameters (entities to extract)                         |   |   |
|  |  |  * Reusable across flows/pages                              |   |   |
|  |  |                                                             |   |   |
|  |  |  Abhavtech Intents: 10 complex + system defaults            |   |   |
|  |  +-------------------------------------------------------------+   |   |
|  |                                                                     |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |                        ENTITIES                             |   |   |
|  |  |  (Data types to extract from conversation)                  |   |   |
|  |  |                                                             |   |   |
|  |  |  System Entities:  @sys.number, @sys.date, @sys.phone       |   |   |
|  |  |  Custom Entities:  @order_number, @product_name, @region    |   |   |
|  |  +-------------------------------------------------------------+   |   |
|  |                                                                     |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |                        WEBHOOKS                             |   |   |
|  |  |  (External API integration for dynamic data)                |   |   |
|  |  |                                                             |   |   |
|  |  |  * abhavtech-fulfillment (order, account, billing lookups)  |   |   |
|  |  |  * Timeout: 10 seconds                                      |   |   |
|  |  |  * Partial responses enabled                                |   |   |
|  |  +-------------------------------------------------------------+   |   |
|  |                                                                     |   |   
|  +---------------------------------------------------------------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Key Differences from Dialogflow ES

| Aspect | Dialogflow ES | Dialogflow CX |
|--------|---------------|---------------|
| Conversation Model | Intent-based | State-machine (Flows/Pages) |
| Context Management | Time-based contexts | Page-based state |
| Reusability | Limited | Flows are reusable modules |
| Multi-turn | Complex with contexts | Native via page transitions |
| Version Control | Basic | Full environments (draft/prod) |
| Visual Editor | Basic | Advanced flow visualization |
| Multi-language | Per-intent | Agent-wide with localization |

## 10.5.2 GCP Project Configuration

### GCP Project Details for Abhavtech

```
+-----------------------------------------------------------------------------+
|                    ABHAVTECH GCP PROJECT SPECIFICATION                      |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PROJECT DETAILS:                                                          |
|  =======================================================================   |
|                                                                             |
|  Project Name:        Abhavtech WxCC AI                                    |
|  Project ID:          abhavtech-wxcc-ai                                    |
|  Project Number:      [Auto-assigned by GCP]                               |
|  Organization:        abhavtech.com                                        |
|  Billing Account:     [Abhavtech billing account]                          |
|                                                                             |
|  REGIONAL CONFIGURATION:                                                   |
|  =======================================================================   |
|                                                                             |
|  Primary Region:      asia-south1 (Mumbai, India)                          |
|  Rationale:           Data residency compliance for India operations       |
|                                                                             |
|  [!]️ IMPORTANT: Dialogflow CX agent region cannot be changed after          |
|     creation. All data processing occurs in the selected region.           |
|                                                                             |
|  ENABLED APIs:                                                             |
|  =======================================================================   |
|                                                                             |
|  | API Name                          | Purpose                       |    |
|  |-----------------------------------|-------------------------------|    |
|  | Dialogflow API                    | Core CX functionality         |    |
|  | Cloud Speech-to-Text API          | Voice transcription           |    |
|  | Cloud Text-to-Speech API          | Response synthesis            |    |
|  | Cloud Functions API               | Webhook hosting               |    |
|  | Cloud Build API                   | Function deployment           |    |
|  | Cloud Run API                     | Alternative webhook hosting   |    |
|  | Secret Manager API                | Credential storage            |    |
|                                                                             |
|  SERVICE ACCOUNT:                                                          |
|  =======================================================================   |
|                                                                             |
|  Name:                wxcc-ccai-connector                                  |
|  Email:               wxcc-ccai-connector@abhavtech-wxcc-ai.iam.           |
|                       gserviceaccount.com                                  |
|  Roles:               * Dialogflow API Admin                               |
|                       * Dialogflow API Client                              |
|  Key:                 JSON key file (secured in credential vault)          |
|                                                                             |
|  IAM PERMISSIONS MATRIX:                                                   |
|  =======================================================================   |
|                                                                             |
|  | Principal               | Role                    | Purpose           | |
|  |-------------------------|-------------------------|-------------------| |
|  | wxcc-ccai-connector     | Dialogflow API Admin    | WxCC integration  | |
|  | wxcc-ccai-connector     | Dialogflow API Client   | API calls         | |
|  | admin@abhavtech.com     | Project Owner           | Full admin        | |
|  | devops@abhavtech.com    | Dialogflow API Admin    | Agent management  | |
|  | cc-team@abhavtech.com   | Dialogflow API Reader   | Testing/review    | |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.5.3 Agent Configuration

### Dialogflow CX Agent Specification

```
+-----------------------------------------------------------------------------+
|                    DIALOGFLOW CX AGENT SPECIFICATION                        |
+-----------------------------------------------------------------------------+
|                                                                             |
|  AGENT DETAILS:                                                            |
|  =======================================================================   |
|                                                                             |
|  Display Name:        Abhi VA                                              |
|  Agent ID:            [Auto-generated UUID]                                |
|  Location:            asia-south1                                          |
|  Default Language:    English (en)                                         |
|  Additional Languages: Hindi (hi)                                          |
|  Time Zone:           Asia/Kolkata (IST)                                   |
|                                                                             |
|  SPEECH SETTINGS:                                                          |
|  =======================================================================   |
|                                                                             |
|  Speech-to-Text:                                                           |
|  | Setting                          | Value                         |     |
|  |----------------------------------|-------------------------------|     |
|  | Speech Model                     | phone_call (enhanced)         |     |
|  | Speech Adaptation                | Enabled                       |     |
|  | Audio Encoding                   | LINEAR16                      |     |
|  | Sample Rate                      | 8000 Hz                       |     |
|  | Automatic Punctuation            | Enabled                       |     |
|  | Profanity Filter                 | Enabled                       |     |
|                                                                             |
|  Text-to-Speech (English - en-IN):                                         |
|  | Setting                          | Value                         |     |
|  |----------------------------------|-------------------------------|     |
|  | Voice Name                       | en-IN-Neural2-A               |     |
|  | Voice Gender                     | Male                          |     |
|  | Speaking Rate                    | 1.0                           |     |
|  | Pitch                            | 0                             |     |
|                                                                             |
|  Text-to-Speech (Hindi - hi-IN):                                           |
|  | Setting                          | Value                         |     |
|  |----------------------------------|-------------------------------|     |
|  | Voice Name                       | hi-IN-Neural2-A               |     |
|  | Voice Gender                     | Male                          |     |
|  | Speaking Rate                    | 1.0                           |     |
|  | Pitch                            | 0                             |     |
|                                                                             |
|  ADVANCED SPEECH SETTINGS:                                                 |
|  =======================================================================   |
|                                                                             |
|  | Setting                          | Value    | Purpose              |   |
|  |----------------------------------|----------|----------------------|   |
|  | No-speech Timeout                | 5 sec    | Wait for speech      |   |
|  | End of Speech Timeout            | 2 sec    | Detect utterance end |   |
|  | Max Speech Length                | 60 sec   | Long utterances      |   |
|  | Barge-in                         | Enabled  | Allow interruption   |   |
|  | Partial Responses                | Enabled  | Reduce latency       |   |
|  | Single Utterance Mode            | Disabled | Multi-turn support   |   |
|                                                                             |
|  LOGGING CONFIGURATION:                                                    |
|  =======================================================================   |
|                                                                             |
|  | Setting                          | Status   | Purpose              |   |
|  |----------------------------------|----------|----------------------|   |
|  | Cloud Logging                    | Enabled  | Audit and debug      |   |
|  | Conversation History             | Enabled  | Training data        |   |
|  | Interaction Logging              | Enabled  | Performance metrics  |   |
|  | Stackdriver Integration          | Enabled  | Monitoring           |   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 10.6 NLU Design & Intent Development 

## 10.6.1 Intent Architecture for Abhavtech

Abhavtech's Dialogflow CX agent implements 10 complex intents designed to handle multi-turn conversations requiring API integration.

### Intent Inventory

```
+-----------------------------------------------------------------------------+
|                    DIALOGFLOW CX INTENT INVENTORY                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  COMPLEX INTENTS (10) - Handled by Dialogflow CX:                          |
|  =======================================================================   |
|                                                                             |
|  | #  | Intent Name           | Category  | Complexity | API Required |    |
|  |----|-----------------------|-----------|------------|--------------|    |
|  | 1  | order.status          | Order     | Medium     | Yes          |    |
|  | 2  | order.track           | Order     | Medium     | Yes          |    |
|  | 3  | product.inquiry       | Product   | Medium     | Yes          |    |
|  | 4  | product.pricing       | Product   | Medium     | Yes          |    |
|  | 5  | account.balance       | Account   | High       | Yes (secure) |    |
|  | 6  | account.info          | Account   | High       | Yes (secure) |    |
|  | 7  | support.general       | Support   | Low        | No           |    |
|  | 8  | support.troubleshoot  | Support   | High       | Yes          |    |
|  | 9  | billing.inquiry       | Billing   | High       | Yes (secure) |    |
|  | 10 | agent.handoff         | Transfer  | Low        | No           |    |
|                                                                             |
|  SYSTEM INTENTS (Auto-created):                                            |
|  =======================================================================   |
|                                                                             |
|  | Intent Name                    | Purpose                            |   |
|  |--------------------------------|------------------------------------|   |
|  | Default Welcome Intent         | Initial greeting                   |   |
|  | Default Negative Intent        | "No" responses                     |   |
|  | Default Fallback Intent        | Unrecognized input                 |   |
|                                                                             |
|  SHARED INTENTS (Used across flows):                                       |
|  =======================================================================   |
|                                                                             |
|  | Intent Name                    | Purpose                            |   |
|  |--------------------------------|------------------------------------|   |
|  | confirmation.yes               | Positive confirmation              |   |
|  | confirmation.no                | Negative confirmation              |   |
|  | navigation.back                | Return to previous                 |   |
|  | navigation.main_menu           | Return to main menu                |   |
|  | smalltalk.thanks               | Gratitude expressions              |   |
|  | smalltalk.goodbye              | Farewell expressions               |   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.6.2 Intent Specifications

### Intent: order.status

```
+-----------------------------------------------------------------------------+
|                    INTENT SPECIFICATION: order.status                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  INTENT DETAILS:                                                           |
|  =======================================================================   |
|                                                                             |
|  Display Name:        order.status                                         |
|  Description:         Customer checking order status                       |
|  Priority:            Normal                                               |
|  ML Enabled:          Yes                                                  |
|                                                                             |
|  TRAINING PHRASES - ENGLISH (20):                                          |
|  =======================================================================   |
|                                                                             |
|  Basic queries:                                                            |
|  1.  What is my order status                                               |
|  2.  Check my order                                                        |
|  3.  Where is my order                                                     |
|  4.  Order status                                                          |
|  5.  Track my order                                                        |
|                                                                             |
|  Detailed queries:                                                         |
|  6.  I want to check my order                                              |
|  7.  What happened to my order                                             |
|  8.  Has my order shipped                                                  |
|  9.  When will my order arrive                                             |
|  10. I placed an order and want to know the status                         |
|                                                                             |
|  With order number (annotate @order_number):                               |
|  11. Check order [ORD-12345]                                               |
|  12. Status of order number [12345]                                        |
|  13. Where is order [ORD-67890]                                            |
|  14. What's the status of [ORD-11111]                                      |
|  15. Order [12345] status                                                  |
|                                                                             |
|  Variations:                                                               |
|  16. My order hasn't arrived                                               |
|  17. Order inquiry                                                         |
|  18. I need to track a package                                             |
|  19. Did my order ship yet                                                 |
|  20. Is my order on the way                                                |
|                                                                             |
|  TRAINING PHRASES - HINDI (10):                                            |
|  =======================================================================   |
|                                                                             |
|  1.  मेरे ऑर्डर का स्टेटस क्या है                                               |
|  2.  मेरा ऑर्डर कहाँ है                                                        |
|  3.  ऑर्डर स्टेटस चेक करो                                                      |
|  4.  मेरा ऑर्डर ट्रैक करो                                                      |
|  5.  ऑर्डर कब आएगा                                                            |
|  6.  मेरा पार्सल कहाँ है                                                       |
|  7.  ऑर्डर नंबर [बारह तीन चार पाँच] का स्टेटस                                   |
|  8.  शिपमेंट का स्टेटस                                                         |
|  9.  डिलीवरी कब होगी                                                          |
|  10. ऑर्डर अभी तक नहीं आया                                                    |
|                                                                             |
|  PARAMETERS:                                                               |
|  =======================================================================   |
|                                                                             |
|  | Parameter        | Entity Type     | Required | Prompt if Missing    |  |
|  |------------------|-----------------|----------|----------------------|  |
|  | order_number     | @order_number   | Yes      | "What is your order  |  |
|  |                  |                 |          |  number?"            |  |
|                                                                             |
|  FULFILLMENT:                                                              |
|  =======================================================================   |
|                                                                             |
|  Webhook:           abhavtech-fulfillment                                  |
|  Tag:               order_lookup                                           |
|  Timeout:           10 seconds                                             |
|  Partial Response:  "Let me look that up for you..."                       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### Intent: support.troubleshoot

```
+-----------------------------------------------------------------------------+
|                    INTENT SPECIFICATION: support.troubleshoot               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  INTENT DETAILS:                                                           |
|  =======================================================================   |
|                                                                             |
|  Display Name:        support.troubleshoot                                 |
|  Description:         Technical troubleshooting requests                   |
|  Priority:            High (complex multi-turn)                            |
|  ML Enabled:          Yes                                                  |
|                                                                             |
|  TRAINING PHRASES - ENGLISH (25):                                          |
|  =======================================================================   |
|                                                                             |
|  General troubleshooting:                                                  |
|  1.  I need help with a problem                                            |
|  2.  Something isn't working                                               |
|  3.  I'm having issues with my product                                     |
|  4.  Technical support please                                              |
|  5.  Help me troubleshoot                                                  |
|                                                                             |
|  Product-specific (annotate @product_name):                                |
|  6.  [Product A] is not working                                            |
|  7.  My [Product B] has a problem                                          |
|  8.  Issues with [Product C]                                               |
|  9.  [Product A] won't turn on                                             |
|  10. Having trouble with my [Product B]                                    |
|                                                                             |
|  Specific issues (annotate @issue_type):                                   |
|  11. It's showing an [error message]                                       |
|  12. I'm getting a [connection error]                                      |
|  13. The [screen is frozen]                                                |
|  14. [Battery not charging]                                                |
|  15. [App keeps crashing]                                                  |
|                                                                             |
|  Urgency indicators:                                                       |
|  16. It stopped working suddenly                                           |
|  17. This is urgent, I need it fixed now                                   |
|  18. I've tried everything and it still doesn't work                       |
|  19. This has been broken for days                                         |
|  20. I'm very frustrated with this issue                                   |
|                                                                             |
|  Previous attempts:                                                        |
|  21. I already tried restarting                                            |
|  22. Reboot didn't help                                                    |
|  23. I followed the manual but still not working                           |
|  24. Already reinstalled but same problem                                  |
|  25. Tech support told me to call back                                     |
|                                                                             |
|  TRAINING PHRASES - HINDI (10):                                            |
|  =======================================================================   |
|                                                                             |
|  1.  मुझे एक समस्या में मदद चाहिए                                              |
|  2.  कुछ काम नहीं कर रहा                                                      |
|  3.  मेरे प्रोडक्ट में दिक्कत है                                                |
|  4.  टेक्निकल सपोर्ट चाहिए                                                    |
|  5.  [प्रोडक्ट ए] काम नहीं कर रहा                                              |
|  6.  एरर मैसेज आ रहा है                                                       |
|  7.  यह अचानक बंद हो गया                                                      |
|  8.  मैंने रीस्टार्ट किया लेकिन ठीक नहीं हुआ                                     |
|  9.  बहुत परेशान हूँ इस प्रॉब्लम से                                            |
|  10. कृपया मेरी मदद करें                                                       |
|                                                                             |
|  PARAMETERS:                                                               |
|  =======================================================================   |
|                                                                             |
|  | Parameter        | Entity Type     | Required | Prompt if Missing    |  |
|  |------------------|-----------------|----------|----------------------|  |
|  | product_name     | @product_name   | Yes      | "Which product are   |  |
|  |                  |                 |          |  you having issues   |  |
|  |                  |                 |          |  with?"              |  |
|  | issue_type       | @issue_type     | No       | (collected in flow)  |  |
|  | troubleshoot_step| @sys.number     | No       | (flow-managed)       |  |
|                                                                             |
|  NOTE: This intent triggers a multi-turn troubleshooting flow with         |
|  step-by-step diagnostic questions managed by page transitions.            |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.6.3 Entity Definitions

### Custom Entities for Abhavtech

```
+-----------------------------------------------------------------------------+
|                    CUSTOM ENTITY DEFINITIONS                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ENTITY: @order_number                                                     |
|  =======================================================================   |
|                                                                             |
|  Type:              Regexp                                                 |
|  Pattern:           (ORD[-]?\d{5,10}|\d{5,10})                            |
|  Fuzzy Matching:    Enabled                                                |
|  Examples:          ORD-12345, ORD12345, 12345, 1234567890                 |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  ENTITY: @product_name                                                     |
|  =======================================================================   |
|                                                                             |
|  Type:              Map (with synonyms)                                    |
|                                                                             |
|  | Value           | Synonyms                                         |   |
|  |-----------------|------------------------------------------------|   |
|  | Product A       | product a, ProductA, prod a, first product     |   |
|  | Product B       | product b, ProductB, prod b, second product    |   |
|  | Product C       | product c, ProductC, prod c, third product     |   |
|  | Service X       | service x, ServiceX, srv x, main service       |   |
|  | Service Y       | service y, ServiceY, srv y, premium service    |   |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  ENTITY: @issue_type                                                       |
|  =======================================================================   |
|                                                                             |
|  Type:              Map (with synonyms)                                    |
|                                                                             |
|  | Value           | Synonyms                                         |   |
|  |-----------------|------------------------------------------------|   |
|  | not_working     | doesn't work, won't work, stopped working      |   |
|  | error_message   | error, showing error, error code               |   |
|  | connectivity    | can't connect, connection issue, network       |   |
|  | performance     | slow, freezing, lagging, hangs                 |   |
|  | display         | screen issue, display problem, blank screen    |   |
|  | battery         | battery, charging, power issue                 |   |
|  | login           | can't login, password, authentication          |   |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  ENTITY: @account_number                                                   |
|  =======================================================================   |
|                                                                             |
|  Type:              Regexp                                                 |
|  Pattern:           (ACC[-]?\d{6,10}|\d{6,10})                            |
|  Examples:          ACC-123456, ACC123456, 123456789                       |
|                                                                             |
|  -------------------------------------------------------------------------  |
|                                                                             |
|  ENTITY: @region                                                           |
|  =======================================================================   |
|                                                                             |
|  Type:              Map                                                    |
|                                                                             |
|  | Value           | Synonyms                                         |   |
|  |-----------------|------------------------------------------------|   |
|  | India           | india, IN, indian, mumbai, delhi, bangalore    |   |
|  | EMEA            | europe, uk, london, germany, emea              |   |
|  | Americas        | usa, us, america, new jersey, americas         |   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 10.7 Conversational Flow Design 

## 10.7.1 Flow Architecture

Abhavtech's Dialogflow CX agent uses a modular flow architecture where each major conversation domain has its own flow.

### Flow Inventory

```
+-----------------------------------------------------------------------------+
|                    DIALOGFLOW CX FLOW ARCHITECTURE                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                     DEFAULT START FLOW                              |   |
|  |                     (Entry point for all conversations)             |   |
|  |                                                                     |   |
|  |  +---------+    +--------------+    +-------------------------+   |   |
|  |  |  START  |--->|   Welcome    |--->|   Intent Detection      |   |   |
|  |  |  Page   |    |   Page       |    |   & Routing             |   |   |
|  |  +---------+    +--------------+    +-----------+-------------+   |   |
|  |                                                 |                 |   |
|  |                 +-------------------------------+-----------------+   |
|  |                 |               |               |               | |   |
|  |                 v               v               v               v |   |
|  |          +----------+   +----------+   +----------+   +--------+ |   |
|  |          |  Order   |   | Account  |   | Support  |   | Billing| |   |
|  |          |  Flow    |   | Flow     |   | Flow     |   | Flow   | |   |
|  |          +----------+   +----------+   +----------+   +--------+ |   |
|  |                                                                   |   |
|  +-------------------------------------------------------------------+   |
|                                                                             |
|  FLOW INVENTORY:                                                           |
|  =======================================================================   |
|                                                                             |
|  | Flow Name              | Pages | Purpose                         |     |
|  |------------------------|-------|---------------------------------|     |
|  | Default Start Flow     | 3     | Entry, welcome, routing         |     |
|  | Order Flow             | 5     | Order status, tracking          |     |
|  | Account Flow           | 4     | Account info, balance           |     |
|  | Support Flow           | 6     | Troubleshooting, general help   |     |
|  | Billing Flow           | 4     | Billing inquiries               |     |
|  | Product Flow           | 3     | Product info, pricing           |     |
|  | Escalation Flow        | 2     | Agent handoff                   |     |
|  | -----------------------------------------------------------------|     |
|  | TOTAL                  | 27    |                                 |     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.7.2 Order Flow Design

```
+-----------------------------------------------------------------------------+
|                    ORDER FLOW - DETAILED DESIGN                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                         ORDER FLOW                                  |   |
|  |                                                                     |   |
|  |   +-------------------------------------------------------------+   |   |
|  |   |                    PAGE: Start                              |   |   |
|  |   |  Entry: "I can help you with your order."                   |   |   |
|  |   |                                                             |   |   |
|  |   |  Routes:                                                    |   |   |
|  |   |  * order.status -> Collect Order Number page                 |   |   |
|  |   |  * order.track  -> Collect Order Number page                 |   |   |
|  |   +--------------------------+----------------------------------+   |   |
|  |                              |                                      |   |
|  |                              v                                      |   |
|  |   +-------------------------------------------------------------+   |   |
|  |   |              PAGE: Collect Order Number                     |   |   |
|  |   |  Entry: "What is your order number? It starts with ORD     |   |   |
|  |   |          followed by numbers."                              |   |   |
|  |   |                                                             |   |   |
|  |   |  Parameter: $session.params.order_number                    |   |   |
|  |   |  Entity:    @order_number                                   |   |   |
|  |   |  Required:  Yes                                             |   |   |
|  |   |                                                             |   |   |
|  |   |  Reprompt (no-match):                                       |   |   |
|  |   |  "I didn't catch that. Please say your order number,       |   |   |
|  |   |   like ORD-12345, or press the digits on your keypad."     |   |   |
|  |   |                                                             |   |   |
|  |   |  Routes:                                                    |   |   |
|  |   |  * $page.params.order_number (filled) -> Lookup page         |   |   |
|  |   |  * no-match (3x) -> Escalation Flow                          |   |   |
|  |   +--------------------------+----------------------------------+   |   |
|  |                              |                                      |   |
|  |                              v                                      |   |
|  |   +-------------------------------------------------------------+   |   |
|  |   |              PAGE: Order Lookup                             |   |   |
|  |   |  Entry Fulfillment:                                         |   |   |
|  |   |  * Webhook: abhavtech-fulfillment                          |   |   |
|  |   |  * Tag: order_lookup                                        |   |   |
|  |   |  * Partial: "Let me look that up..."                       |   |   |
|  |   |                                                             |   |   |
|  |   |  Routes (based on webhook response):                        |   |   |
|  |   |  * $webhook.status = "found" -> Order Status page            |   |   |
|  |   |  * $webhook.status = "not_found" -> Order Not Found page     |   |   |
|  |   |  * webhook.error -> Escalation Flow                          |   |   |
|  |   +--------------------------+----------------------------------+   |   |
|  |                              |                                      |   |
|  |              +---------------+---------------+                      |   |
|  |              |                               |                      |   |
|  |              v                               v                      |   |
|  |   +-----------------------+      +-----------------------+         |   |
|  |   | PAGE: Order Status    |      | PAGE: Order Not Found |         |   |
|  |   |                       |      |                       |         |   |
|  |   | Entry:                |      | Entry:                |         |   |
|  |   | "Your order           |      | "I couldn't find an   |         |   |
|  |   |  $webhook.order_num   |      |  order with that      |         |   |
|  |   |  is $webhook.status.  |      |  number. Would you    |         |   |
|  |   |  It shipped via       |      |  like to try again    |         |   |
|  |   |  $webhook.carrier     |      |  or speak to an       |         |   |
|  |   |  and should arrive    |      |  agent?"              |         |   |
|  |   |  $webhook.eta."       |      |                       |         |   |
|  |   |                       |      | Routes:               |         |   |
|  |   | Routes:               |      | * "try again" ->       |         |   |
|  |   | * "track" ->           |      |   Collect Order #     |         |   |
|  |   |   Tracking Details    |      | * "agent" ->           |         |   |
|  |   | * "anything else" ->   |      |   Escalation Flow     |         |   |
|  |   |   End Session         |      |                       |         |   |
|  |   | * "agent" ->           |      +-----------------------+         |   |
|  |   |   Escalation Flow     |                                        |   |
|  |   +-----------------------+                                        |   |
|  |                                                                     |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.7.3 Troubleshooting Flow Design

```
+-----------------------------------------------------------------------------+
|                    SUPPORT FLOW - TROUBLESHOOTING PATH                      |
+-----------------------------------------------------------------------------+
|                                                                             |
|  This flow implements a guided diagnostic conversation for technical        |
|  issues, demonstrating multi-turn capability.                               |
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                       SUPPORT FLOW                                  |   |
|  |                                                                     |   |
|  |  +-------------+                                                   |   |
|  |  |    Start    |                                                   |   |
|  |  |             | support.troubleshoot                              |   |
|  |  +------+------+                                                   |   |
|  |         |                                                           |   |
|  |         v                                                           |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |  PAGE: Collect Product                                      |   |   |
|  |  |  "Which product are you having issues with?"                |   |   |
|  |  |  Parameter: @product_name (required)                        |   |   |
|  |  +--------------------------+----------------------------------+   |   |
|  |                             | product collected                    |   |
|  |                             v                                      |   |
|  |  +-------------------------------------------------------------+   |   |
|  |  |  PAGE: Describe Issue                                       |   |   |
|  |  |  "Can you describe what's happening with your               |   |   |
|  |  |   $session.params.product_name?"                            |   |   |
|  |  |  Parameter: @issue_type (optional - extracted from speech)  |   |   |
|  |  +--------------------------+----------------------------------+   |   |
|  |                             |                                      |   |
|  |    +------------------------+------------------------+            |   |
|  |    |                        |                        |            |   |
|  |    v                        v                        v            |   |
|  |  [Connectivity]      [Not Working]            [Other Issue]      |   |
|  |    |                        |                        |            |   |
|  |    v                        v                        v            |   |
|  |  +-------------+    +-------------+          +-------------+    |   |
|  |  | PAGE:       |    | PAGE:       |          | PAGE:       |    |   |
|  |  | Check       |    | Power       |          | General     |    |   |
|  |  | Network     |    | Cycle       |          | Diagnostics |    |   |
|  |  |             |    |             |          |             |    |   |
|  |  | "First,     |    | "Let's try  |          | "Let me     |    |   |
|  |  |  check if   |    |  restarting |          |  gather     |    |   |
|  |  |  other      |    |  your       |          |  some       |    |   |
|  |  |  devices    |    |  device.    |          |  info..."   |    |   |
|  |  |  connect."  |    |  Turn it    |          |             |    |   |
|  |  |             |    |  off..."    |          +------+------+    |   |
|  |  +------+------+    +------+------+                 |           |   |
|  |         |                  |                        |           |   |
|  |         v                  v                        |           |   |
|  |  +-------------+    +-------------+                |           |   |
|  |  | PAGE:       |    | PAGE:       |                |           |   |
|  |  | Network     |    | Power       |                |           |   |
|  |  | Result      |    | Result      |                |           |   |
|  |  |             |    |             |                |           |   |
|  |  | "Did that   |    | "Is it      |                |           |   |
|  |  |  help?"     |    |  working    |                |           |   |
|  |  |             |    |  now?"      |                |           |   |
|  |  +------+------+    +------+------+                |           |   |
|  |         |                  |                        |           |   |
|  |    +----+----+        +----+----+                  |           |   |
|  |    |         |        |         |                  |           |   |
|  |   YES       NO       YES       NO                  |           |   |
|  |    |         |        |         |                  |           |   |
|  |    v         |        v         |                  |           |   |
|  | [Resolved]   |     [Resolved]   |                  |           |   |
|  |    |         |        |         |                  |           |   |
|  |    |         +--------+---------+------------------+           |   |
|  |    |                            |                               |   |
|  |    |                            v                               |   |
|  |    |                  +-----------------+                       |   |
|  |    |                  |  PAGE: Escalate |                       |   |
|  |    |                  |                 |                       |   |
|  |    |                  |  "I understand  |                       |   |
|  |    |                  |   this is       |                       |   |
|  |    |                  |   frustrating.  |                       |   |
|  |    |                  |   Let me        |                       |   |
|  |    |                  |   connect you   |                       |   |
|  |    |                  |   with a        |                       |   |
|  |    |                  |   specialist."  |                       |   |
|  |    |                  |                 |                       |   |
|  |    |                  |  -> Escalation   |                       |   |
|  |    |                  |    Flow         |                       |   |
|  |    |                  +-----------------+                       |   |
|  |    |                                                             |   |
|  |    v                                                             |   |
|  |  +-------------------------------------------------------------+ |   |
|  |  |  PAGE: Resolution                                           | |   |
|  |  |  "Great! I'm glad we could resolve that.                    | |   |
|  |  |   Is there anything else I can help you with?"              | |   |
|  |  |                                                             | |   |
|  |  |  Routes:                                                    | |   |
|  |  |  * "no" / smalltalk.goodbye -> End Session (contained)       | |   |
|  |  |  * Other -> Default Start Flow                               | |   |
|  |  +-------------------------------------------------------------+ |   |
|  |                                                                   |   |
|  +-------------------------------------------------------------------+   |
|                                                                             |
|  CONTEXT PASSED TO AGENT ON ESCALATION:                                    |
|  =======================================================================   |
|                                                                             |
|  * product_name: Which product customer has                                |
|  * issue_type: What kind of issue                                          |
|  * steps_attempted: List of troubleshooting steps tried                    |
|  * customer_responses: Results of each diagnostic                          |
|  * conversation_summary: AI-generated summary                              |
|  * sentiment_score: Customer frustration level                             |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 10.8 Webhook & Fulfillment Integration 

## 10.8.1 Webhook Architecture

Abhavtech's Dialogflow CX agent uses webhooks to integrate with backend systems for dynamic data retrieval.

### Webhook Specification

```
+-----------------------------------------------------------------------------+
|                    WEBHOOK ARCHITECTURE                                     |
+-----------------------------------------------------------------------------+
|                                                                             |
|  WEBHOOK CONFIGURATION:                                                    |
|  =======================================================================   |
|                                                                             |
|  Name:                abhavtech-fulfillment                                |
|  Base URL:            https://api.abhavtech.com/dialogflow/webhook         |
|  (OR Cloud Function): https://asia-south1-abhavtech-wxcc-ai.               |
|                       cloudfunctions.net/dialogflow-webhook                |
|  Timeout:             10 seconds                                           |
|  Authentication:      API Key (X-API-Key header)                           |
|                                                                             |
|  SUBRESOURCES (Tags):                                                      |
|  =======================================================================   |
|                                                                             |
|  | Tag               | URL Suffix    | Purpose                        |   |
|  |-------------------|---------------|--------------------------------|   |
|  | order_lookup      | /orders       | Order status, tracking         |   |
|  | account_lookup    | /accounts     | Account info, balance          |   |
|  | billing_lookup    | /billing      | Billing inquiries              |   |
|  | product_lookup    | /products     | Product info, pricing          |   |
|  | troubleshoot      | /support      | KB article lookup              |   |
|                                                                             |
|  REQUEST/RESPONSE FLOW:                                                    |
|  =======================================================================   |
|                                                                             |
|  +--------------+    +--------------+    +--------------------------+     |
|  | Dialogflow   |--->| Webhook      |--->| Abhavtech Backend       |     |
|  | CX Agent     |    | (Cloud Func) |    | Systems                 |     |
|  |              |<---|              |<---| * Order Management      |     |
|  |              |    |              |    | * Account Database      |     |
|  +--------------+    +--------------+    | * Billing System        |     |
|                                          | * Product Catalog       |     |
|                                          +--------------------------+     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.8.2 Webhook Request/Response Format

### Request Format (from Dialogflow CX)

```json
{
  "detectIntentResponseId": "uuid",
  "intentInfo": {
    "lastMatchedIntent": "projects/.../intents/order.status",
    "displayName": "order.status",
    "confidence": 0.95
  },
  "pageInfo": {
    "currentPage": "projects/.../pages/Order Lookup",
    "displayName": "Order Lookup"
  },
  "sessionInfo": {
    "session": "projects/.../sessions/session-id",
    "parameters": {
      "order_number": "ORD-12345"
    }
  },
  "fulfillmentInfo": {
    "tag": "order_lookup"
  },
  "languageCode": "en"
}
```

### Response Format (to Dialogflow CX)

```json
{
  "fulfillmentResponse": {
    "messages": [
      {
        "text": {
          "text": [
            "Your order ORD-12345 has shipped via FedEx and should arrive by January 17th."
          ]
        }
      }
    ]
  },
  "sessionInfo": {
    "parameters": {
      "order_status": "shipped",
      "carrier": "FedEx",
      "tracking_number": "FX123456789",
      "eta": "January 17, 2026",
      "webhook_status": "found"
    }
  }
}
```

## 10.8.3 Python Webhook Implementation

See **Appendix 10-B** for complete Python webhook code. Key implementation highlights:

```python
## Webhook endpoint structure (Python/Flask) 
## Full code in Appendix 10-B 

from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/dialogflow/webhook', methods=['POST'])
def webhook():
    req = request.get_json()
    tag = req.get('fulfillmentInfo', {}).get('tag', '')
    
    if tag == 'order_lookup':
        return handle_order_lookup(req)
    elif tag == 'account_lookup':
        return handle_account_lookup(req)
    elif tag == 'billing_lookup':
        return handle_billing_lookup(req)
    else:
        return handle_default(req)

def handle_order_lookup(req):
    """Handle order status lookup"""
    params = req.get('sessionInfo', {}).get('parameters', {})
    order_number = params.get('order_number')
    
## Call Abhavtech Order Management API 
    order_data = order_management_api.get_order(order_number)
    
    if order_data:
        response_text = f"Your order {order_number} is {order_data['status']}. "
        if order_data['status'] == 'shipped':
            response_text += f"It shipped via {order_data['carrier']} "
            response_text += f"and should arrive by {order_data['eta']}."
        
        return jsonify({
            "fulfillmentResponse": {
                "messages": [{"text": {"text": [response_text]}}]
            },
            "sessionInfo": {
                "parameters": {
                    "webhook_status": "found",
                    "order_status": order_data['status'],
                    "carrier": order_data.get('carrier'),
                    "eta": order_data.get('eta')
                }
            }
        })
    else:
        return jsonify({
            "fulfillmentResponse": {
                "messages": [{"text": {"text": [
                    f"I couldn't find order {order_number}. "
                    "Please check the number and try again."
                ]}}]
            },
            "sessionInfo": {
                "parameters": {"webhook_status": "not_found"}
            }
        })
```

---

## 10.9 Dialogflow CX - Abhavtech Implementation Summary 

## 10.9.1 Complete Agent Specification

```
+-----------------------------------------------------------------------------+
|                    ABHAVTECH DIALOGFLOW CX AGENT SUMMARY                    |
+-----------------------------------------------------------------------------+
|                                                                             |
|  AGENT OVERVIEW:                                                           |
|  =======================================================================   |
|                                                                             |
|  | Attribute              | Value                                    |    |
|  |------------------------|------------------------------------------|    |
|  | Agent Name             | Abhi VA                                  |    |
|  | GCP Project            | abhavtech-wxcc-ai                        |    |
|  | Region                 | asia-south1 (Mumbai)                     |    |
|  | Languages              | English (en), Hindi (hi)                 |    |
|  | Flows                  | 7                                        |    |
|  | Pages                  | 27                                       |    |
|  | Intents                | 10 custom + 6 shared + 3 system = 19     |    |
|  | Entities               | 5 custom + system                        |    |
|  | Webhooks               | 1 (5 tags)                               |    |
|  | Environments           | draft, staging, production               |    |
|                                                                             |
|  INTEGRATION SUMMARY:                                                      |
|  =======================================================================   |
|                                                                             |
|  WxCC Connector:         Abhi_Advanced_VA                                  |
|  Voice Settings:         en-IN-Neural2-A, hi-IN-Neural2-A                  |
|  Speech Model:           phone_call (enhanced)                             |
|  Used in Flows:          India_MainMenu_Flow_v1                            |
|                          Digital_Chat_Flow_v1                              |
|                          Support_QueueTreatment_v1                         |
|                                                                             |
|  EXPECTED PERFORMANCE:                                                     |
|  =======================================================================   |
|                                                                             |
|  | Metric                       | Target                              |   |
|  |------------------------------|-------------------------------------|   |
|  | Intent Recognition Accuracy  | >92%                                |   |
|  | Voice Containment Rate       | 35% (Month 3) -> 45% (Month 6)       |   |
|  | Digital Containment Rate     | 50%                                 |   |
|  | Average Handle Time (VA)     | <90 seconds for contained           |   |
|  | Escalation Rate              | <65%                                |   |
|  | Customer Satisfaction        | >4.0/5.0                            |   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

*End of Part C: Google Dialogflow CX Implementation*

---

## PART D: AI-BASED ROUTING & INTELLIGENCE 

---

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

## 10.11 Predictive Routing Preparation 

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

## 10.12 Sentiment-Aware Routing 

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

## PART E: AGENT ASSIST & REAL-TIME AI 

---

## 10.13 Cisco AI Assistant Configuration 

## 10.13.1 Agent Assist Features

Cisco AI Assistant (Agent Assist) provides real-time AI support to agents during customer interactions.

### Feature Matrix

| Feature | Status | Description |
|---------|--------|-------------|
| Real-time Transcription | [OK] Enabled | Live call transcript displayed |
| Conversation Summary | [OK] Enabled | AI-generated handoff summaries |
| Suggested Responses | [OK] Enabled | Context-aware response hints |
| Sentiment Analysis | [OK] Enabled | Real-time customer mood tracking |
| Knowledge Suggestions | [OK] Enabled | KB article recommendations |
| Auto Wrap-up Codes | [OK] Enabled | AI-suggested disposition |
| Next Best Action | ⏳ Phase 3 | Requires historical data |

### Configuration Summary

```
+-----------------------------------------------------------------------------+
|                    AGENT ASSIST CONFIGURATION                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  ENABLEMENT:                                                               |
|  * Voice Channels:    Enabled                                              |
|  * Digital Channels:  Enabled                                              |
|  * Languages:         English, Hindi                                       |
|                                                                             |
|  PROFILE ASSIGNMENT:                                                       |
|  * Premium_Agent:     [OK] Enabled (75 agents)                               |
|  * Supervisor:        [OK] Enabled (10 supervisors)                          |
|  * Standard_Agent:    [X] Disabled (voice-only, no Premium features)        |
|                                                                             |
|  FEATURE SETTINGS:                                                         |
|  * Max suggestions displayed:  3                                           |
|  * Confidence threshold:       70%                                         |
|  * Auto-refresh interval:      5 seconds                                   |
|  * Show confidence scores:     Yes (supervisors only)                      |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 10.13.2 Conversation Summaries

AI-generated summaries appear at key handoff points:

| Summary Type | Trigger | Content Includes |
|--------------|---------|------------------|
| VA Handoff Summary | VA -> Agent transfer | Intent, collected info, sentiment, escalation reason |
| Mid-Call Summary | Agent -> Agent transfer | Conversation so far, actions taken, open issues |
| Wrap-up Summary | Call end | Call reason, resolution, follow-up required |

### VA Handoff Summary Example

```
+-----------------------------------------------------------------------------+
|  AI CONVERSATION SUMMARY                                                   |
+-----------------------------------------------------------------------------+
|                                                                             |
|  Intent:         support.troubleshoot                                      |
|  Confidence:     87%                                                       |
|  Sentiment:      Frustrated (-0.4)                                         |
|  Turns:          6                                                         |
|                                                                             |
|  COLLECTED INFORMATION:                                                    |
|  * Product:      Product A                                                 |
|  * Issue:        Device not powering on                                    |
|  * Steps Tried:  Power cycle (no help), cable check (cables fine)          |
|                                                                             |
|  ESCALATION REASON:                                                        |
|  VA completed troubleshooting steps but issue persists.                    |
|  Customer requested human agent.                                           |
|                                                                             |
|  SUGGESTED ACTIONS:                                                        |
|  * Check warranty status                                                   |
|  * Offer replacement if under warranty                                     |
|  * Schedule technician visit if needed                                     |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 10.14 Knowledge Base Development 

## 10.14.1 Knowledge Base Specification

| Attribute | Value |
|-----------|-------|
| Name | Abhavtech_Support_KB |
| Total Articles | 125 |
| Languages | English (125), Hindi (45 priority) |
| Categories | 5 |

### Article Distribution

| Category | Articles | Description |
|----------|----------|-------------|
| Product_FAQs | 50 | Product features, specifications, compatibility |
| Troubleshooting_Guides | 30 | Step-by-step diagnostic procedures |
| Policies_Procedures | 20 | Returns, warranties, escalation paths |
| Billing_FAQs | 15 | Payment methods, invoicing, disputes |
| Company_Information | 10 | Contact info, locations, hours |

## 10.14.2 Knowledge Base Integration

The KB integrates with both Virtual Agent and Agent Assist:

**Virtual Agent (Dialogflow CX):**
- Webhook queries KB for troubleshooting steps
- Returns article content for VA to read to customer
- Tracks which articles were referenced

**Agent Assist:**
- Real-time article suggestions based on conversation
- Agents can search KB manually
- Usage analytics for continuous improvement

---

## PART F: MODEL TRAINING & OPTIMIZATION 

---

## 10.15 Training Strategy Decision Framework 

## 10.15.1 Custom Training Assessment

Custom model training is **OUT OF SCOPE** for Phase 2B. This section provides a decision framework for future consideration.

### When Custom Training is Required

| Scenario | Baseline Dialogflow | Custom Training Needed |
|----------|---------------------|------------------------|
| Standard intents (order, billing) | [OK] Sufficient | [X] Not required |
| Industry-specific terminology | [!]️ May struggle | [OK] Recommended |
| Proprietary product names | [!]️ Add as entities | [!]️ If entity extraction poor |
| Code-switching (Hinglish) | [!]️ Partial support | [OK] Significantly improves |
| Accent/dialect variations | [!]️ Standard model | [OK] For specific dialects |

### Abhavtech Assessment

| Factor | Assessment | Custom Training? |
|--------|------------|------------------|
| Intent complexity | Medium (10 intents) | [X] Not required |
| Product terminology | Low (standard tech) | [X] Entities sufficient |
| Language mix | Medium (EN + HI) | [!]️ Monitor performance |
| Accent variation | Medium (Indian English) | [X] en-IN model handles |

**Recommendation:** Proceed with baseline Dialogflow CX. Evaluate custom training after 3 months based on intent recognition accuracy metrics.

## 10.15.2 Continuous Improvement Framework

### Monthly Review Cycle

```
+-----------------------------------------------------------------------------+
|                    CONTINUOUS IMPROVEMENT CYCLE                             |
+-----------------------------------------------------------------------------+
|                                                                             |
|  WEEKLY:                                                                   |
|  [ ] Review low-confidence interactions in Dialogflow CX console             |
|  [ ] Add new training phrases for misrecognized intents                      |
|  [ ] Update entity synonyms as needed                                        |
|                                                                             |
|  MONTHLY:                                                                  |
|  [ ] Analyze containment rate trends                                         |
|  [ ] Review escalation reasons                                               |
|  [ ] Update KB articles based on common questions                            |
|  [ ] Tune confidence thresholds if needed                                    |
|                                                                             |
|  QUARTERLY:                                                                |
|  [ ] Comprehensive accuracy assessment                                       |
|  [ ] Add new intents if patterns emerge                                      |
|  [ ] Evaluate need for custom training                                       |
|  [ ] Update flow routing rules                                               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 10.16 Performance Optimization 

## 10.16.1 KPI Targets

| Metric | Baseline (2A) | Phase 2B Target | Optimized Target |
|--------|---------------|-----------------|------------------|
| Intent Recognition | N/A | >90% | >95% |
| Voice Containment | 12% | 35% | 45% |
| Digital Containment | 15% | 50% | 60% |
| AHT (Agent calls) | 7.5 min | 5.5 min | 5.0 min |
| FCR | 68% | 82% | 88% |
| CSAT | 3.8/5.0 | 4.3/5.0 | 4.5/5.0 |

## 10.16.2 Optimization Levers

| Lever | Impact | Effort |
|-------|--------|--------|
| Add training phrases | Medium | Low |
| Tune confidence thresholds | Medium | Low |
| Improve webhook response time | High | Medium |
| Expand intent coverage | High | Medium |
| Add Hindi training phrases | Medium | Medium |
| Custom speech adaptation | High | High |

---

## PART G: TESTING, DEPLOYMENT & OPERATIONS 

---

## 10.17 AI Testing Methodology 

## 10.17.1 Test Phases

| Phase | Focus | Duration | Pass Criteria |
|-------|-------|----------|---------------|
| Unit Testing | Individual intents | 2 days | >90% accuracy per intent |
| Integration Testing | Flow + VA integration | 3 days | All paths work |
| UAT | Business scenarios | 5 days | SME approval |
| Pilot | Limited production | 2 weeks | Metrics meet targets |

## 10.17.2 Test Case Categories

See **Appendix 10-D** for complete test matrices. Key categories:

| Category | Test Cases | Focus |
|----------|------------|-------|
| Intent Recognition | 50 | Verify correct intent detection |
| Entity Extraction | 30 | Verify data capture |
| Conversation Flow | 25 | Multi-turn navigation |
| Escalation Paths | 15 | Handoff to agents |
| Error Handling | 20 | Fallback and recovery |
| Language Support | 20 | Hindi interactions |

---

## 10.18 Deployment & Cutover 

## 10.18.1 Deployment Approach

**Phased Rollout Strategy:**

| Phase | Scope | Duration | Rollback Plan |
|-------|-------|----------|---------------|
| Phase 1 | 10% traffic (EMEA only) | 1 week | Disable VA node |
| Phase 2 | 25% traffic (+ Americas) | 1 week | Route around VA |
| Phase 3 | 50% traffic (+ India partial) | 2 weeks | Queue-level toggle |
| Phase 4 | 100% traffic (full India) | Ongoing | Flow version switch |

## 10.18.2 Cutover Checklist

```
+-----------------------------------------------------------------------------+
|                    PHASE 2B AI CUTOVER CHECKLIST                           |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PRE-CUTOVER (T-1 Week):                                                   |
|  [ ] All UAT test cases passed                                               |
|  [ ] Dialogflow CX agent in "production" environment                         |
|  [ ] CCAI Connector verified active                                          |
|  [ ] Flows published to production                                           |
|  [ ] Agent training completed                                                |
|  [ ] KB articles published                                                   |
|  [ ] Monitoring dashboards configured                                        |
|  [ ] Rollback procedure documented and tested                                |
|                                                                             |
|  CUTOVER DAY:                                                              |
|  [ ] Confirm low-traffic window                                              |
|  [ ] Enable VA in first region/percentage                                    |
|  [ ] Monitor real-time metrics                                               |
|  [ ] Verify agent screen pops working                                        |
|  [ ] Test escalation path manually                                           |
|  [ ] Confirm recording/logging operational                                   |
|                                                                             |
|  POST-CUTOVER (T+1 Day):                                                   |
|  [ ] Review overnight metrics                                                |
|  [ ] Check for error spikes                                                  |
|  [ ] Gather initial agent feedback                                           |
|  [ ] Address any critical issues                                             |
|  [ ] Proceed to next phase or rollback                                       |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 10.19 AI Operations (AIOps) 

## 10.19.1 Monitoring & Alerting

### Key Metrics to Monitor

| Metric | Threshold | Alert Level |
|--------|-----------|-------------|
| VA Error Rate | >5% | Critical |
| Containment Rate | <25% | Warning |
| Webhook Timeout Rate | >2% | Warning |
| Intent Confidence (avg) | <0.7 | Warning |
| Sentiment (trending negative) | <-0.3 avg | Info |

### Monitoring Tools

| Tool | Purpose | Dashboard |
|------|---------|-----------|
| WxCC Analyzer | Call metrics, containment | Control Hub |
| Dialogflow CX Console | Intent analytics, conversations | GCP Console |
| Cloud Monitoring | Webhook performance, errors | GCP Console |
| Custom Dashboard | Combined AI KPIs | Grafana/Looker |

## 10.19.2 Incident Response

### AI-Specific Runbooks

| Incident | Detection | Response |
|----------|-----------|----------|
| Dialogflow CX unavailable | Error exit spike | Enable DTMF fallback, page GCP |
| Webhook timeout | Timeout rate >5% | Check backend, increase timeout |
| Low containment | Rate drops >10% | Review recent conversations |
| High escalation | Rate spikes | Check intent training |

## 10.19.3 Operational Responsibilities

| Task | Frequency | Owner |
|------|-----------|-------|
| Review conversation logs | Daily | AI Operations |
| Add training phrases | Weekly | AI Operations |
| Update KB articles | Weekly | Content Team |
| Tune thresholds | Monthly | AI Operations |
| Performance review | Monthly | CC Manager + AI Ops |
| Capacity planning | Quarterly | IT + Finance |

---

*End of Part G: Testing, Deployment & Operations*

---

## APPENDICES 

---

## Appendix 10-A: Dialogflow CX Agent Export 

The complete Dialogflow CX agent configuration can be exported as a JSON blob for version control and disaster recovery.

**Export Procedure:**
1. Dialogflow CX Console -> Agent Settings -> Export
2. Select "Export as JSON"
3. Store in version control (Git)
4. Encrypt sensitive data before committing

**Key Files in Export:**
- `agent.json` - Agent settings
- `intents/*.json` - Intent definitions
- `entityTypes/*.json` - Entity definitions
- `flows/*.json` - Flow definitions
- `webhooks/*.json` - Webhook configurations

*Full export JSON available in project repository.*

---

## Appendix 10-B: Webhook Code Samples (Python) 

See separate file: **Appendix-10B-Webhook-Code-Python.py**

Key endpoints implemented:
- `/orders` - Order status lookup
- `/accounts` - Account information
- `/billing` - Billing inquiries
- `/products` - Product catalog
- `/support` - KB article search

---

## Appendix 10-C: Training Phrase Library 

Complete training phrase library for all 10 intents:

| Intent | English Phrases | Hindi Phrases | Total |
|--------|-----------------|---------------|-------|
| order.status | 20 | 10 | 30 |
| order.track | 15 | 8 | 23 |
| product.inquiry | 20 | 10 | 30 |
| product.pricing | 15 | 8 | 23 |
| account.balance | 18 | 10 | 28 |
| account.info | 15 | 8 | 23 |
| support.general | 20 | 10 | 30 |
| support.troubleshoot | 25 | 10 | 35 |
| billing.inquiry | 20 | 10 | 30 |
| agent.handoff | 25 | 10 | 35 |
| **TOTAL** | **193** | **94** | **287** |

*Full phrase list available in project repository.*

---

## Appendix 10-D: Test Case Matrix 

See separate file: **Appendix-10D-Test-Case-Matrix.xlsx**

Summary:
- Total Test Cases: 160
- Intent Recognition: 50
- Entity Extraction: 30
- Conversation Flow: 25
- Escalation Paths: 15
- Error Handling: 20
- Hindi Language: 20

---

*End of Chapter 10: Advanced AI Integration & Implementation*

---

## Document Summary

This chapter provided comprehensive technical guidance for implementing AI-enhanced contact center capabilities for Abhavtech, including:

- **Part A:** Hybrid AI platform architecture (Webex AI Agent + Dialogflow CX)
- **Part B:** Webex AI Agent configuration (5 simple intents)
- **Part C:** Dialogflow CX implementation (10 complex intents)
- **Part D:** AI-based routing with flow before/after documentation
- **Part E:** Agent Assist and Knowledge Base
- **Part F:** Training decision framework and optimization
- **Part G:** Testing, deployment, and operations

**Total Estimated Implementation Effort:** 18-24 hours across 6 sessions

**Dependencies:**
- Phase 2A baseline migration must be complete
- 3-month stabilization period before Phase 2B
- GCP project and billing configured
- Agent training on AI context handling

---

*© 2026 Abhavtech.com - Chapter 10 v1.0*
