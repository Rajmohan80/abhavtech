# Solution Architecture: High-Level Design

## Executive Summary

This chapter provides the complete High-Level Design (HLD) for KidsWear India's greenfield Webex Contact Center deployment. The architecture integrates Cisco Webex Calling (India DCs), Cisco Webex Contact Center, Google Cloud Contact Center AI (Dialogflow CX + Vertex AI), Zendesk CRM, and Webex Digital Channels into a unified, AI-enabled, omnichannel contact center platform.

**Architecture Highlights:**
- Cloud-native deployment with India data residency (Webex Contact Center: Mumbai DC; Webex Calling: Mumbai + Chennai DCs)
- Hybrid IVR supporting both DTMF and natural language processing
- AI-powered predictive routing using Google Vertex AI
- Omnichannel support: Voice, WhatsApp, Web Chat, Email
- WebRTC-based agent desktop for remote workforce (home/store)
- Zero on-premises infrastructure required

---

## 1. Architecture Overview

### 1.1 Solution Components

| Component | Product | Version/Region | Purpose |
|-----------|---------|----------------|---------|
| **Cloud PSTN** | Webex Calling | India (Mumbai + Chennai DCs) | PSTN connectivity via Cloud Connect partners (Airtel, Tata Communications, Tata Tele Business Services) |
| **Contact Center Platform** | Webex Contact Center | India (Mumbai DC) | ACD, IVR, routing, agent desktop, WFO |
| **Conversational AI** | Google Dialogflow CX | GCP asia-south1 (Mumbai) | NLU, intent detection, sentiment analysis |
| **Predictive Routing** | Google Vertex AI | GCP asia-south1 (Mumbai) | ML-based optimal agent matching |
| **Analytics Data Store** | Google BigQuery | GCP asia-south1 (Mumbai) | Historical data for AI model training |
| **CRM** | Zendesk Suite Professional | Cloud (Zendesk infrastructure) | Customer 360, ticketing, screen pop |
| **Digital Channels** | Webex Connect/Engage | Cloud (Webex infrastructure) | WhatsApp, Web Chat, Email routing |
| **Agent Desktop** | Webex CC Agent Desktop | Browser (WebRTC) | Unified omnichannel agent interface |
| **Monitoring** | Webex CC Analyzer | Cloud | Real-time and historical reporting |

### 1.2 Architecture Principles

| Principle | Implementation |
|-----------|----------------|
| **Cloud-First** | No on-premises infrastructure; 100% cloud-native |
| **Data Residency** | All customer data stored in India (Mumbai/Chennai) |
| **API-First** | All integrations via REST APIs and webhooks |
| **Security by Design** | TLS 1.2+, SRTP, encryption at rest (AES-256) |
| **Scalability** | Auto-scaling cloud infrastructure; add agents on-demand |
| **High Availability** | Geo-redundant Webex DCs; 99.99% uptime SLA |
| **Remote-First** | Agents work from home/store using browser + internet |
| **AI-Augmented** | Every interaction enhanced by NLU and predictive AI |

---

## 2. End-to-End Architecture Diagram

### 2.1 Complete Solution Architecture

```
+------------------------------------------------------------------+
|                        CUSTOMER CHANNELS                         |
+------------------------------------------------------------------+
|  [Phone]     [WhatsApp]    [Web Chat]    [Email]    [Mobile App] |
|     |            |             |            |            |       |
+------------------------------------------------------------------+
      |            |             |            |            |
      v            +-------------+------------+------------+
+-------------+                   |
|   PSTN      |                   v
|  (India)    |         +------------------+
|             |         |  Webex Connect/  |
| Airtel/Tata |         |  Engage          |
| TTBS/Cloud  |         |  (Digital CPaaS) |
| Connect     |         +------------------+
+-------------+                   |
      |                           |
      v                           v
+------------------------------------------------------------------+
|                     WEBEX CALLING (PSTN LAYER)                   |
|                     Mumbai/Chennai Data Centers                  |
+------------------------------------------------------------------+
|  [Cloud Connect SIP Trunking]  [Media Processing]  [Compliance]  |
|  [India Regulatory Compliance] [Call Routing to CC] [Recording]  |
+------------------------------------------------------------------+
      |                                                    |
      +----------------------------------------------------+
                              |
                              v
+------------------------------------------------------------------+
|                    WEBEX CONTACT CENTER                          |
|                    Mumbai Data Center (India)                    |
+------------------------------------------------------------------+
|                                                                  |
|  +------------+    +------------+    +------------+              |
|  |   ENTRY    |    |    IVR     |    |    ACD     |              |
|  |   POINTS   | -> |   FLOWS    | -> |  ROUTING   |              |
|  | (Toll-Free)|    | (Hybrid)   |    | (AI-Based) |              |
|  +------------+    +------------+    +------------+              |
|        |                  |                 |                    |
|        |                  v                 v                    |
|        |         +------------------+  +------------------+      |
|        |         | Flow Designer    |  | Queue Manager    |      |
|        |         | - DTMF Collect   |  | - Skills Routing |      |
|        |         | - HTTP Requests  |  | - Priority Rules |      |
|        |         | - Variable Set   |  | - Agent Groups   |      |
|        |         +------------------+  +------------------+      |
|                                                                  |
|  +------------------+  +------------------+  +----------------+  |
|  |  AGENT DESKTOP   |  |   SUPERVISOR     |  |   RECORDING    |  |
|  |  (WebRTC)        |  |   DESKTOP        |  |   & WFO        |  |
|  | - Voice handling |  | - Monitoring     |  | - 100% capture |  |
|  | - Screen pop     |  | - Barge/Whisper  |  | - PCI pause    |  |
|  | - Wrap-up codes  |  | - Dashboards     |  | - QM scoring   |  |
|  +------------------+  +------------------+  +----------------+  |
|                                                                  |
+------------------------------------------------------------------+
      |                    |                           |
      |                    v                           |
      |    +-------------------------------+           |
      |    |     GOOGLE CLOUD PLATFORM     |           |
      |    |     asia-south1 (Mumbai)      |           |
      |    +-------------------------------+           |
      |    |                               |           |
      |    |  +------------+  +--------+   |           |
      |    |  | Dialogflow |  | Vertex |   |           |
      |    |  | CX Agent   |  | AI     |   |           |
      |    |  +------------+  +--------+   |           |
      |    |       |              |        |           |
      |    |       v              v        |           |
      |    |  +-------------------------+  |           |
      |    |  |      BigQuery           |  |           |
      |    |  | (Analytics + Training)  |  |           |
      |    |  +-------------------------+  |           |
      |    |                               |           |
      |    +-------------------------------+           |
      |                                                |
      v                                                v
+------------------------------------------------------------------+
|                       ZENDESK CRM                                |
+------------------------------------------------------------------+
|  [Customer 360]  [Ticketing]  [Knowledge Base]  [CTI Connector]  |
|  [Order History] [Complaints] [FAQs]            [Screen Pop API] |
+------------------------------------------------------------------+
      |
      v
+------------------------------------------------------------------+
|                        AGENT WORKSPACE                           |
|                    (Remote: Home or Store)                       |
+------------------------------------------------------------------+
|  [Laptop + Chrome Browser]  [USB Headset]  [Internet (25 Mbps)]  |
|  [WebRTC Audio]             [Zendesk Widget] [Agent Assist UI]   |
+------------------------------------------------------------------+
```

### 2.2 Data Flow Architecture

```
INBOUND VOICE CALL FLOW (with AI Processing)

Step 1                Step 2                Step 3
+--------+           +--------+            +--------+
|Customer| --------> |  PSTN  | ---------> | Webex  |
| Dials  |  Toll-    | Cloud  |    SIP     | Calling|
| 1800   |  Free     | Connect|   Trunk    | Mumbai |
+--------+           +--------+            +--------+
                                               |
                                               | Internal
                                               | Routing
                                               v
Step 4                Step 5                Step 6
+--------+           +--------+            +--------+
| Webex  | <-------- |  IVR   | ---------> |  GCP   |
|   CC   |  Context  | Flow   |   HTTP     |Dialogflow|
| ACD    |  Return   | Engine |  Request   |   CX    |
+--------+           +--------+            +--------+
    |                    |                      |
    |                    |                  Intent +
    |                    |                 Sentiment
    |                    v                      |
    |                +--------+                 |
    |                | Vertex | <---------------+
    |                |   AI   |    Routing
    |                | Router |   Decision
    |                +--------+
    |                    |
    |                    v
Step 7                Step 8                Step 9
+--------+           +--------+            +--------+
|  Best  | <-------- | Queue  | <--------- |Priority|
| Agent  |   Call    | Task   |   Context  | + Skill|
| Match  |  Deliver  | Object |   Package  | Match  |
+--------+           +--------+            +--------+
    |
    | WebRTC
    | Audio
    v
Step 10               Step 11               Step 12
+--------+           +--------+            +--------+
| Agent  | <-------- | Screen | <--------- |Zendesk |
| Desktop|   CTI     |  Pop   |   REST     |  API   |
| Browser|  Event    | Widget |   Query    |        |
+--------+           +--------+            +--------+
```

**Detailed Step-by-Step Flow:**

| Step | Component | Action | Data/Protocol |
|------|-----------|--------|---------------|
| 1 | Customer | Dials toll-free 1800-XXX-XXXX | DTMF tones |
| 2 | PSTN/Telco | Routes to Cloud Connect partner | SS7/SIP |
| 3 | Webex Calling | Receives SIP INVITE, processes media | SIP/TLS, RTP/SRTP |
| 4 | Webex CC | Entry point receives call, starts flow | Internal routing |
| 5 | IVR Flow | Plays greeting, collects DTMF or speech | Audio prompts |
| 6 | Dialogflow CX | Analyzes speech, returns intent/sentiment | HTTPS REST API |
| 7 | Vertex AI | Predicts optimal routing based on context | HTTPS REST API |
| 8 | Queue Task | Creates task with priority and skills | Flow variables |
| 9 | ACD Engine | Matches task to best available agent | Skills-based routing |
| 10 | Agent Desktop | WebRTC call delivered to browser | WebRTC (SRTP) |
| 11 | Screen Pop | CTI event triggers Zendesk lookup | CTI connector |
| 12 | Zendesk API | Returns customer history, creates ticket | REST API (HTTPS) |

---

## 3. Platform Selection Rationale

### 3.1 Why Webex Calling + Webex Contact Center

**Decision Matrix:**

| Criteria | Webex Calling + CC | Alternative A (On-Prem UCCE) | Alternative B (Third-Party CCaaS) |
|----------|-------------------|-------------------------------|-----------------------------------|
| **India Data Residency** | ✅ Mumbai/Chennai DCs | ⚠️ Requires local hardware | ❌ Often US/EU only |
| **India PSTN Compliance** | ✅ Cloud Connect partners (DoT/TRAI compliant) | ✅ Local gateway needed | ❌ May need separate PSTN |
| **MSME Budget Fit** | ✅ OpEx model, no CapEx | ❌ High upfront hardware cost | ⚠️ Varies by vendor |
| **Remote Agent Support** | ✅ WebRTC, browser-only | ❌ VPN + softphone required | ✅ Usually supported |
| **AI/NLU Integration** | ✅ Open APIs for GCP CCAI | ⚠️ Complex integration | ⚠️ Vendor-specific AI |
| **Implementation Time** | ✅ 12-16 weeks | ❌ 6-12 months | ⚠️ 8-16 weeks |
| **Scalability** | ✅ Add agents instantly | ❌ Hardware provisioning | ✅ Cloud-native |
| **IT Expertise Required** | ✅ Managed service | ❌ Dedicated IT team | ✅ Low |

**SELECTED: Webex Calling + Webex Contact Center**

**Rationale:**
1. India data residency guaranteed (Mumbai DC for CC, Mumbai/Chennai for Calling)
2. PSTN compliance via licensed Cloud Connect partners
3. Perfect for MSME with no IT infrastructure
4. WebRTC supports distributed remote workforce
5. Open APIs enable GCP CCAI integration
6. Cisco ecosystem provides unified support

### 3.2 Why Google Cloud Platform for AI

**Decision Matrix:**

| Criteria | GCP (Dialogflow CX + Vertex AI) | Alternative A (Amazon Connect Lens) | Alternative B (Microsoft Azure Bot) |
|----------|----------------------------------|-------------------------------------|-------------------------------------|
| **India Region** | ✅ asia-south1 (Mumbai) | ⚠️ Limited India presence | ✅ Central India region |
| **Conversational AI Quality** | ✅ Dialogflow CX is market leader | ✅ Good quality | ⚠️ Requires more tuning |
| **Hindi Language Support** | ✅ Excellent (hi-IN locale) | ⚠️ Limited | ⚠️ Limited |
| **Predictive ML Platform** | ✅ Vertex AI unified platform | ⚠️ Requires SageMaker | ⚠️ Requires Azure ML |
| **Webex CC Integration** | ✅ REST APIs, native support | ❌ Designed for Amazon Connect | ⚠️ Possible but complex |
| **Pay-per-use Pricing** | ✅ Request-based billing | ✅ Request-based | ✅ Request-based |
| **BigQuery Analytics** | ✅ Native integration | ❌ Redshift is separate | ❌ Synapse is separate |

**SELECTED: Google Cloud Platform (Dialogflow CX + Vertex AI)**

**Rationale:**
1. Asia-south1 (Mumbai) region ensures India data residency for AI processing
2. Dialogflow CX has superior Hindi language understanding
3. Vertex AI provides unified ML platform for predictive routing
4. BigQuery enables seamless analytics for model training
5. REST APIs integrate cleanly with Webex CC Flow Designer
6. Pay-per-request model suits MSME budget unpredictability

### 3.3 Why Zendesk for CRM

**Decision Matrix:**

| Criteria | Zendesk Suite | Alternative A (Salesforce Service Cloud) | Alternative B (Freshdesk) |
|----------|--------------|-------------------------------------------|---------------------------|
| **Cost for MSME** | ✅ Affordable tiers | ❌ Expensive for 52 users | ✅ Very affordable |
| **CTI Integration** | ✅ Native support for Webex CC | ✅ Full CTI support | ⚠️ Limited CTI options |
| **API Quality** | ✅ Well-documented REST API | ✅ Excellent APIs | ⚠️ Basic APIs |
| **Ease of Use** | ✅ Simple UI for agents | ❌ Complex, training needed | ✅ Very simple |
| **B2B Account Hierarchy** | ✅ Organizations + contacts | ✅ Full account management | ⚠️ Basic hierarchy |
| **Knowledge Base** | ✅ Built-in Help Center | ✅ Knowledge included | ✅ Built-in KB |
| **Indian Customers** | ✅ Many retail customers | ⚠️ More enterprise focus | ✅ Popular in India |

**SELECTED: Zendesk Suite Professional**

**Rationale:**
1. Cost-effective for MSME (Professional tier has CTI support)
2. Simple UI reduces training time for agents
3. REST API enables screen pop integration with Webex CC
4. Organizations feature supports school (B2B) account management
5. Built-in Help Center can be used for customer self-service
6. Popular with Indian retail businesses

---

## 4. Component Architecture Details

### 4.1 Webex Calling Architecture (PSTN Layer)

```
PSTN CONNECTIVITY VIA CLOUD CONNECT

+------------------+     +------------------+     +------------------+
|    Customer      |     |   India Telco    |     |  Webex Calling   |
|    (Phone)       |     |  Cloud Connect   |     |   Data Center    |
|                  |     |                  |     |                  |
|  Dials 1800-xxx  | --> | Airtel Business  | --> |  Mumbai DC       |
|                  |     | OR Tata Comm     |     |  Chennai DC      |
|                  |     | OR Tata Tele Business Services  |     |  (Geo-Redundant) |
+------------------+     +------------------+     +------------------+
                               |                         |
                               | SIP over TLS            | Call Routing
                               | SRTP Media              | to Webex CC
                               v                         v
                    +------------------+     +------------------+
                    |   Regulatory     |     |  Media Services  |
                    |   Compliance     |     |                  |
                    |                  |     | - Transcoding    |
                    | - DoT Licensed   |     | - Recording      |
                    | - TRAI Compliant |     | - Call Control   |
                    | - CDR Retention  |     | - Quality Mon.   |
                    +------------------+     +------------------+
```

**Key Configuration Points:**

| Parameter | Value | Notes |
|-----------|-------|-------|
| **PSTN Region** | India | Mumbai + Chennai DCs |
| **Cloud Connect Partner** | Airtel/Tata Comms/TTBS | Choose based on rates/coverage |
| **SIP Protocol** | SIP over TLS (SIPS) | Encrypted signaling |
| **Media Protocol** | SRTP | Encrypted voice |
| **Codec** | G.711, G.729, Opus | Opus preferred for WebRTC |
| **Trunk Capacity** | 50 concurrent sessions | Peak load + safety margin |
| **DID Numbers** | 2 toll-free (1800-xxx-xxxx) | 1 Sales, 1 Support |
| **Call Recording** | Webex Calling integrated | India storage |
| **E911/Emergency** | Not applicable | India emergency numbers |

### 4.2 Webex Contact Center Architecture

```
WEBEX CONTACT CENTER COMPONENTS

+------------------------------------------------------------------+
|                      WEBEX CC CONTROL HUB                        |
|                    (Tenant Administration)                       |
+------------------------------------------------------------------+
|  [Tenant Settings]  [User Management]  [Integration Config]      |
|  [Channel Setup]    [Security Policies] [Audit Logs]            |
+------------------------------------------------------------------+
                              |
          +-------------------+-------------------+
          |                   |                   |
          v                   v                   v
+------------------+  +------------------+  +------------------+
|   ENTRY POINTS   |  |   IVR FLOWS      |  |     QUEUES       |
|                  |  |                  |  |                  |
| - Sales EP       |  | - Sales Flow     |  | - Sales Queue    |
|   (1800-xxx-001) |  |   (Hybrid IVR)   |  |   (Skills: B2C,  |
|                  |  |                  |  |    B2B, Hindi)   |
| - Support EP     |  | - Support Flow   |  |                  |
|   (1800-xxx-002) |  |   (Hybrid IVR)   |  | - Support Queue  |
|                  |  |                  |  |   (Skills: Order,|
| - Digital EP     |  | - Bot Flow       |  |    Complaint)    |
|   (WhatsApp/Chat)|  |   (Dialogflow)   |  |                  |
+------------------+  +------------------+  +------------------+
          |                   |                   |
          v                   v                   v
+------------------------------------------------------------------+
|                        ACD ENGINE                                |
+------------------------------------------------------------------+
|  [Skills-Based Routing]  [Priority Queuing]  [Agent Reservation] |
|  [Longest Available]     [Predictive (AI)]   [Overflow Rules]   |
+------------------------------------------------------------------+
          |
          +-------------------+-------------------+
          |                   |                   |
          v                   v                   v
+------------------+  +------------------+  +------------------+
|  AGENT DESKTOP   |  |   SUPERVISOR     |  |   RECORDING      |
|  (50 Agents)     |  |   (2 Supervisors)|  |   & WFO          |
|                  |  |                  |  |                  |
| Features:        |  | Features:        |  | Features:        |
| - WebRTC calls   |  | - Real-time mon. |  | - 100% recording |
| - Omnichannel    |  | - Barge/Whisper  |  | - PCI pause      |
| - CAD variables  |  | - Agent states   |  | - Screen capture |
| - Wrap-up codes  |  | - Queue stats    |  | - QM evaluation  |
| - Knowledge base |  | - SLA tracking   |  | - Storage mgmt   |
| - CRM widget     |  | - Alerts         |  | - Retention      |
+------------------+  +------------------+  +------------------+
```

**Entry Point Configuration:**

| Entry Point | DID/Channel | Flow Assigned | Routing Strategy |
|-------------|-------------|---------------|------------------|
| Sales Voice | 1800-xxx-001 | Sales_IVR_Flow_v1 | Skills-based + AI predictive |
| Support Voice | 1800-xxx-002 | Support_IVR_Flow_v1 | Skills-based + AI predictive |
| WhatsApp | Business Number | WhatsApp_Bot_Flow | Bot first, then agent escalation |
| Web Chat | Website Widget | Chat_Bot_Flow | Bot first, then agent escalation |
| Email | support@kidswearindia.com | Email_Routing_Flow | Queue based on subject line |

**Queue Configuration:**

| Queue Name | Skills Required | Service Level | Max Wait Time | Overflow |
|------------|----------------|---------------|---------------|----------|
| Sales_B2C | B2C_Sales, English OR Hindi | 80% in 30 sec | 120 sec | Sales_General |
| Sales_B2B | B2B_Bulk, English OR Hindi | 90% in 20 sec | 90 sec | Sales_B2C |
| Support_Order | Order_Status, English OR Hindi | 80% in 30 sec | 180 sec | Support_General |
| Support_Complaint | Complaints, English OR Hindi | 90% in 20 sec | 120 sec | Supervisor |
| Digital_Chat | Chat_Handling, English OR Hindi | 90% in 15 sec | 60 sec | Support_General |

### 4.3 Google Cloud CCAI Architecture

```
GCP CONTACT CENTER AI ARCHITECTURE (asia-south1)

+------------------------------------------------------------------+
|                    DIALOGFLOW CX AGENT                           |
|                    (Virtual Agent)                               |
+------------------------------------------------------------------+
|                                                                  |
|  +------------+    +------------+    +------------+              |
|  |   FLOWS    |    |  INTENTS   |    |  ENTITIES  |              |
|  +------------+    +------------+    +------------+              |
|  | Default    |    | Bulk_Order |    | school_name|              |
|  | Start Flow |    | New_Order  |    | quantity   |              |
|  | Sales Flow |    | Order_Track|    | product_type|             |
|  | Support    |    | Complaint  |    | order_number|             |
|  | Flow       |    | Return_Req |    | class_size |              |
|  +------------+    +------------+    +------------+              |
|        |                 |                  |                    |
|        v                 v                  v                    |
|  +--------------------------------------------------+            |
|  |              NATURAL LANGUAGE UNDERSTANDING       |            |
|  |                                                   |            |
|  |  Speech-to-Text (Enhanced Model) --> NLU Engine  |            |
|  |                                                   |            |
|  |  Supported Languages:                             |            |
|  |  - en-IN (English India)                         |            |
|  |  - hi-IN (Hindi)                                 |            |
|  |  - mr-IN (Marathi) [future]                      |            |
|  |  - ta-IN (Tamil) [future]                        |            |
|  +--------------------------------------------------+            |
|        |                                                         |
|        v                                                         |
|  +--------------------------------------------------+            |
|  |              SENTIMENT ANALYSIS                   |            |
|  |                                                   |            |
|  |  Score: -1.0 (very negative) to +1.0 (positive)  |            |
|  |  Magnitude: 0.0 (weak) to infinity (strong)      |            |
|  |                                                   |            |
|  |  Example:                                         |            |
|  |  "I need urgent help with my order" --> -0.3, 0.7|            |
|  |  "I want to place a big school order" --> +0.2   |            |
|  +--------------------------------------------------+            |
|                                                                  |
+------------------------------------------------------------------+
                              |
                              | Intent + Sentiment + Entities
                              v
+------------------------------------------------------------------+
|                    VERTEX AI PREDICTION                          |
|                    (Predictive Routing)                          |
+------------------------------------------------------------------+
|                                                                  |
|  Input Features:                                                 |
|  +----------------------------------------------------------+    |
|  | customer_intent (string): "Bulk_Uniform_Order"            |    |
|  | customer_sentiment (float): -0.3                          |    |
|  | customer_tier (string): "Repeat_B2B"                      |    |
|  | customer_ltv (float): 150000.00 (INR)                     |    |
|  | call_hour (int): 14                                       |    |
|  | call_day (int): 2 (Tuesday)                               |    |
|  | queue_depth_sales (int): 3                                |    |
|  | queue_depth_support (int): 1                              |    |
|  +----------------------------------------------------------+    |
|                                                                  |
|  Model Logic (Random Forest / XGBoost):                          |
|  +----------------------------------------------------------+    |
|  | IF intent = "Bulk_Order" AND tier = "Repeat_B2B":        |    |
|  |   -> High value customer, route to top performer          |    |
|  | IF sentiment < -0.5:                                      |    |
|  |   -> Frustrated, route to high-FCR agent                  |    |
|  | IF ltv > 100000:                                          |    |
|  |   -> VIP treatment, priority queue                        |    |
|  +----------------------------------------------------------+    |
|                                                                  |
|  Output:                                                         |
|  +----------------------------------------------------------+    |
|  | recommended_skill: "B2B_Bulk"                             |    |
|  | agent_preference: ["AGT005", "AGT012", "AGT003"]          |    |
|  | priority_boost: 10                                        |    |
|  | confidence_score: 0.87                                    |    |
|  +----------------------------------------------------------+    |
|                                                                  |
+------------------------------------------------------------------+
                              |
                              | Routing Decision
                              v
+------------------------------------------------------------------+
|                       BIGQUERY                                   |
|                    (Data Warehouse)                              |
+------------------------------------------------------------------+
|                                                                  |
|  Tables:                                                         |
|  - call_outcomes (interaction_id, agent_id, intent, result)     |
|  - agent_performance (agent_id, avg_handle_time, fcr_rate)      |
|  - customer_profiles (customer_id, tier, ltv, history)          |
|  - model_predictions (timestamp, features, prediction, actual)  |
|                                                                  |
|  Use Cases:                                                      |
|  - Weekly model retraining on historical data                   |
|  - A/B testing predictive routing effectiveness                 |
|  - Intent analytics (what are customers asking?)                |
|  - Agent performance correlation with outcomes                   |
|                                                                  |
+------------------------------------------------------------------+
```

### 4.4 Zendesk CRM Integration Architecture

```
ZENDESK CTI INTEGRATION

+------------------+     +------------------+     +------------------+
|   Webex CC       |     |  CTI Connector   |     |    Zendesk       |
|   Agent Desktop  |     |  (Middleware)    |     |    REST API      |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        | 1. Call arrives        |                        |
        | (CAD: caller_id,       |                        |
        |  intent, sentiment)    |                        |
        v                        |                        |
+------------------+             |                        |
| CTI Event:       |             |                        |
| "call.offered"   | ----------> |                        |
| Payload:         |             | 2. Query customer      |
| - ANI: +91xxxx   |             |    GET /api/v2/search  |
| - Intent: Bulk   |             |    ?query=phone:+91xxx |
| - Sentiment: -0.3|             | ----------------------> |
+------------------+             |                        |
                                 |                        | 3. Return
                                 |                        |    customer
                                 |                        |    record
                                 | <---------------------- |
                                 |                        |
                                 | 4. Create ticket       |
                                 |    POST /api/v2/tickets|
                                 |    {subject: "Inbound  |
                                 |     call - Bulk Order",|
                                 |     requester_id: xxx} |
                                 | ----------------------> |
                                 |                        |
                                 |                        | 5. Return
                                 |                        |    ticket_id
                                 | <---------------------- |
        |                        |                        |
        | 6. Screen Pop          |                        |
        |    Zendesk widget      |                        |
        |    opens with:         |                        |
        |    - Customer profile  |                        |
        |    - Order history     |                        |
        |    - Open tickets      |                        |
        |    - New ticket created|                        |
        v                        |                        |
+------------------+             |                        |
| Agent sees:      |             |                        |
| - Customer name  |             |                        |
| - School name    |             |                        |
| - Past orders    |             |                        |
| - AI suggestion  |             |                        |
+------------------+             |                        |
```

**API Integration Points:**

| Integration | API Endpoint | Trigger | Data Exchanged |
|-------------|--------------|---------|----------------|
| **Customer Lookup** | GET /api/v2/search | Call arrives | Phone number -> Customer profile |
| **Ticket Creation** | POST /api/v2/tickets | Call answered | Create ticket with interaction details |
| **Ticket Update** | PUT /api/v2/tickets/{id} | Call ends | Add wrap-up notes, disposition |
| **Organization Lookup** | GET /api/v2/organizations/{id} | B2B call | School account details |
| **Recent Tickets** | GET /api/v2/users/{id}/tickets | Screen pop | Open/recent tickets for customer |
| **Knowledge Search** | GET /api/v2/help_center/articles/search | Agent Assist | Relevant KB articles for intent |

### 4.5 Digital Channels Architecture (Webex Connect/Engage)

```
OMNICHANNEL DIGITAL ROUTING

+------------------+     +------------------+     +------------------+
|    Customer      |     | Webex Connect    |     |  Webex Contact   |
|    (Digital)     |     | (CPaaS Layer)    |     |     Center       |
+------------------+     +------------------+     +------------------+
        |                        |                        |
        | WhatsApp Message       |                        |
        | "Hi, I need to order   |                        |
        |  school uniforms"      |                        |
        v                        |                        |
+------------------+             |                        |
| WhatsApp Business|             |                        |
| API              | ----------> |                        |
+------------------+             | 1. Receive message     |
                                 |    via webhook         |
                                 |                        |
                                 | 2. Route to bot flow   |
                                 |    (if configured)     |
                                 |                        |
                                 | 3. OR route directly   |
                                 |    to Webex CC queue   |
                                 | ----------------------> |
                                 |                        |
                                 |                        | 4. Create
                                 |                        |    digital
                                 |                        |    task
                                 |                        |
                                 |                        | 5. Queue
                                 |                        |    for agent
                                 |                        |
                                 | <---------------------- |
                                 |                        |
        |                        | 6. Agent response      |
        | <--------------------- |    via API             |
        |                        |                        |
+------------------+             |                        |
| Customer sees    |             |                        |
| agent reply in   |             |                        |
| WhatsApp         |             |                        |
+------------------+             |                        |
```

**Channel Configuration:**

| Channel | Platform | Bot Enabled | Escalation Path | Concurrent per Agent |
|---------|----------|-------------|-----------------|---------------------|
| WhatsApp | Webex Connect | Yes (Dialogflow CX) | Bot -> Queue -> Agent | 3 conversations |
| Web Chat | Webex Engage Widget | Yes (Dialogflow CX) | Bot -> Queue -> Agent | 3 conversations |
| Email | Webex Connect | No (direct routing) | Queue -> Agent | 5 emails |
| SMS | Webex Connect | No (future phase) | Queue -> Agent | 3 messages |

---

## 5. High Availability and Disaster Recovery

### 5.1 Webex Platform HA

```
WEBEX CLOUD HIGH AVAILABILITY

+------------------------------------------------------------------+
|                    PRIMARY REGION (Mumbai DC)                    |
+------------------------------------------------------------------+
|                                                                  |
|  ACTIVE-ACTIVE CLUSTER (Intra-DC Redundancy)                    |
|                                                                  |
|  +------------------------+     +------------------------+       |
|  |   INSTANCE A (Active)  |     |   INSTANCE B (Active)  |       |
|  +------------------------+     +------------------------+       |
|  | Webex Calling Services |     | Webex Calling Services |       |
|  | - Call Control Node 1  |     | - Call Control Node 2  |       |
|  | - Media Server Pool 1  |     | - Media Server Pool 2  |       |
|  | - PSTN Gateway 1       |     | - PSTN Gateway 2       |       |
|  | - Recording Server 1   |     | - Recording Server 2   |       |
|  +------------------------+     +------------------------+       |
|           |                              |                       |
|           +--------- LOAD BALANCER ------+                       |
|                          |                                       |
|  +------------------------+     +------------------------+       |
|  |   INSTANCE C (Active)  |     |   INSTANCE D (Active)  |       |
|  +------------------------+     +------------------------+       |
|  | Webex CC Services      |     | Webex CC Services      |       |
|  | - ACD Engine Node 1    |     | - ACD Engine Node 2    |       |
|  | - IVR Flow Engine 1    |     | - IVR Flow Engine 2    |       |
|  | - Agent Desktop Srv 1  |     | Agent Desktop Srv 2    |       |
|  | - Analytics Node 1     |     | - Analytics Node 2     |       |
|  +------------------------+     +------------------------+       |
|           |                              |                       |
|           +--------- LOAD BALANCER ------+                       |
|                          |                                       |
|  +--------------------------------------------------+            |
|  |            SHARED DATA LAYER                     |            |
|  |                                                  |            |
|  |  [Database Cluster]    [Cache Cluster]           |            |
|  |  - Primary DB Node     - Redis Primary           |            |
|  |  - Replica DB Node     - Redis Replica           |            |
|  |  - Auto-failover       - Session persistence     |            |
|  +--------------------------------------------------+            |
|                                                                  |
+------------------------------------------------------------------+
                              |
                    Synchronous Data Replication
                    (Real-time mirroring)
                              |
                              v
+------------------------------------------------------------------+
|                  SECONDARY REGION (Chennai DC)                   |
|                    (Geo-Redundant Standby)                       |
+------------------------------------------------------------------+
|                                                                  |
|  STANDBY CLUSTER (Warm Standby)                                  |
|                                                                  |
|  +------------------------+     +------------------------+       |
|  |   INSTANCE E (Standby) |     |   INSTANCE F (Standby) |       |
|  +------------------------+     +------------------------+       |
|  | Webex Calling Services |     | Webex CC Services      |       |
|  | - All components ready |     | - All components ready |       |
|  | - Config synchronized  |     | - Config synchronized  |       |
|  | - Data replicated      |     | - Data replicated      |       |
|  +------------------------+     +------------------------+       |
|                                                                  |
|  Activation: Automatic on Mumbai DC failure (< 60 seconds)       |
|                                                                  |
+------------------------------------------------------------------+
```

**HA Failure Scenarios:**

```
SCENARIO 1: Single Node Failure (Within Mumbai DC)
+------------------+     +------------------+
| Node A (Failed)  |     | Node B (Active)  |
|       ❌         | --> |       ✅         |
+------------------+     +------------------+
Result: Traffic automatically routes to healthy node
Failover Time: < 5 seconds
Impact: No customer impact (seamless)
Action: Cisco auto-repairs failed node

SCENARIO 2: Multiple Node Failure (Within Mumbai DC)
+------------------+     +------------------+
| Node A (Failed)  |     | Node B (Failed)  |
|       ❌         |     |       ❌         |
+------------------+     +------------------+
              |                   |
              v                   v
        +-------------------------------+
        |   Load Balancer detects       |
        |   all nodes unhealthy         |
        +-------------------------------+
                      |
                      v
+------------------+     +------------------+
| Chennai DC       |     | Chennai DC       |
| Instance E       |     | Instance F       |
|    ✅            |     |    ✅            |
+------------------+     +------------------+
Result: Traffic fails over to Chennai DC
Failover Time: < 60 seconds
Impact: Brief service interruption, calls in progress may drop

SCENARIO 3: Complete Mumbai DC Outage
+------------------------------------------------------------------+
|                    Mumbai DC (Complete Failure)                  |
|                              ❌                                  |
+------------------------------------------------------------------+
                              |
                    DNS/Routing Update
                    (Automatic)
                              |
                              v
+------------------------------------------------------------------+
|                    Chennai DC (Becomes Primary)                  |
|                              ✅                                  |
+------------------------------------------------------------------+
Result: Chennai DC serves all traffic
Failover Time: < 60 seconds (automatic)
Recovery: When Mumbai DC restored, becomes new standby
```

**HA Specifications:**

| Component | Primary DC (Mumbai) | Intra-DC Redundancy | Secondary DC (Chennai) | Failover Type | Failover Time | RTO | RPO |
|-----------|--------------------|--------------------|------------------------|---------------|---------------|-----|-----|
| **Webex Calling** | Active-Active Cluster | Min. 2 nodes per service | Warm Standby | Automatic | < 5 sec (intra-DC), < 60 sec (geo) | 60 sec | 0 |
| **Webex CC ACD** | Active-Active Cluster | Min. 2 ACD engines | Warm Standby | Automatic | < 5 sec (intra-DC), < 60 sec (geo) | 60 sec | 0 |
| **IVR Flow Engine** | Active-Active Cluster | Load-balanced | Warm Standby | Automatic | < 5 sec (intra-DC), < 60 sec (geo) | 60 sec | 0 |
| **Agent Desktop** | Active-Active Cluster | Multiple servers | Warm Standby | Automatic | < 5 sec (intra-DC), < 60 sec (geo) | 60 sec | 0 |
| **Call Recordings** | Primary Storage | Replicated storage | Geo-replicated | Async | N/A | N/A | < 15 min |
| **Configuration DB** | Primary + Replica | Synchronous replication | Geo-replicated | Automatic | N/A | N/A | 0 |
| **Analytics Data** | Primary Cluster | Distributed storage | Geo-replicated | Async | N/A | N/A | < 1 hour |

**Webex Platform SLA:**

| Service | Availability Target | Monthly Downtime Allowed | Cisco Commitment |
|---------|--------------------|--------------------------|--------------------|
| Webex Calling | 99.99% | ~4.3 minutes | Financial credits if missed |
| Webex Contact Center | 99.95% | ~21.9 minutes | Financial credits if missed |
| Combined Platform | 99.9% minimum | ~43.8 minutes | Contractual guarantee |

**Note:** The above HA architecture is managed entirely by Cisco. KidsWear India does not need to configure or manage any failover mechanisms. The cloud platform handles all redundancy automatically.

### 5.2 GCP CCAI HA

```
GCP REGIONAL REDUNDANCY

+------------------+          +------------------+
|  asia-south1     |          |  asia-south2     |
|  (Mumbai)        |          |  (Delhi) [Future]|
|                  |          |                  |
| - Dialogflow CX  | -------> | - Backup Agent   |
| - Vertex AI      | Replicate| - Model Backup   |
| - BigQuery       |          | - Data Backup    |
+------------------+          +------------------+

Current: Single region (asia-south1)
Future: Multi-region for higher availability
```

**Note:** For initial deployment, single-region (Mumbai) is sufficient. Consider multi-region when KidsWear India scales beyond 100 agents.

### 5.3 Agent Connectivity Resilience

```
REMOTE AGENT CONNECTIVITY OPTIONS

Primary: Home Internet (Broadband)
         |
         v
+------------------+
| WebRTC via       |
| Chrome Browser   |
| (25 Mbps+)       |
+------------------+
         |
         | If primary fails
         v
Secondary: Mobile Hotspot (4G/5G)
         |
         v
+------------------+
| WebRTC via       |
| Mobile Hotspot   |
| (10 Mbps min)    |
+------------------+
         |
         | If still issues
         v
Tertiary: Store Location
         |
         v
+------------------+
| Dedicated Line   |
| at Retail Store  |
| (Business ISP)   |
+------------------+
```

**Agent Failover Procedures:**

1. **Primary fails (home broadband):**
   - Agent switches to mobile hotspot
   - Re-login to Agent Desktop
   - Supervisor notified automatically
   - Calls in progress transferred to another agent

2. **Secondary fails (mobile hotspot):**
   - Agent travels to nearest store location
   - Uses store's business internet
   - Full functionality restored

3. **All connectivity fails:**
   - Agent status changed to "Not Ready" automatically
   - Calls redistributed to other agents
   - Supervisor follows up for connectivity support

---

## 6. Scalability Architecture

### 6.1 Horizontal Scaling Model

```
GROWTH PATH: 50 -> 100 -> 200 AGENTS

Current State (50 agents):
+------------------+
| Webex CC Tenant  |
| - 50 named agents|
| - 2 supervisors  |
| - 2 queues       |
| - 50 trunk chans |
+------------------+

Phase 2 (100 agents):
+------------------+
| Webex CC Tenant  |
| - 100 agents     |
| - 4 supervisors  |
| - 4 queues       |
| - 100 trunk chans|
| - WFO Advanced   |
+------------------+

Phase 3 (200 agents):
+------------------+
| Webex CC Tenant  |
| - 200 agents     |
| - 8 supervisors  |
| - 8 queues       |
| - 200 trunk chans|
| - Campaign Mgr   |
| - Outbound Dialer|
+------------------+
```

**Scaling Triggers:**

| Metric | Threshold | Action |
|--------|-----------|--------|
| Agent Utilization | > 85% sustained | Add 10 agents |
| Queue Wait Time | > 60 sec average | Add queue/agents |
| Abandonment Rate | > 5% | Add agents, review IVR |
| Digital Backlog | > 50 pending | Add digital-skilled agents |
| Peak Season | School reopening (July-August) | Temporary +20 agents |

### 6.2 AI Model Scaling

```
VERTEX AI MODEL VERSIONS

v1.0 (Initial):
- Training data: 10,000 historical interactions
- Features: 8 input features
- Accuracy: ~75% routing optimization
- Retrain: Monthly

v2.0 (6 months):
- Training data: 100,000 interactions
- Features: 15 input features (add customer behavior)
- Accuracy: ~85% routing optimization
- Retrain: Weekly

v3.0 (12 months):
- Training data: 500,000+ interactions
- Features: 25+ features (add seasonal patterns)
- Accuracy: ~90% routing optimization
- Retrain: Continuous (online learning)
```

---

## 7. Integration Architecture Summary

### 7.1 API Integration Map

```
+------------------------------------------------------------------+
|                    INTEGRATION HUB                               |
+------------------------------------------------------------------+
                              |
        +---------------------+---------------------+
        |                     |                     |
        v                     v                     v
+------------------+  +------------------+  +------------------+
| Webex CC APIs    |  |  GCP APIs        |  |  Zendesk APIs    |
+------------------+  +------------------+  +------------------+
| - Flow Designer  |  | - Dialogflow CX  |  | - Tickets API    |
|   HTTP Activity  |  |   detectIntent   |  | - Search API     |
| - CAD Variables  |  | - Vertex AI      |  | - Organizations  |
|   GET/SET        |  |   predict        |  | - Users API      |
| - Agent Desktop  |  | - BigQuery       |  | - Help Center    |
|   Widget SDK     |  |   query          |  | - CTI Events     |
| - Analyzer API   |  | - Cloud Storage  |  | - Webhooks       |
|   (Reporting)    |  |   read/write     |  |                  |
+------------------+  +------------------+  +------------------+
        |                     |                     |
        v                     v                     v
+------------------------------------------------------------------+
|                    AUTHENTICATION                                |
+------------------------------------------------------------------+
| Webex: OAuth 2.0 + Service App Credentials                       |
| GCP: Service Account Key (JSON) + IAM Roles                      |
| Zendesk: API Token + OAuth for Admin                             |
| All: TLS 1.2+ for transport security                             |
+------------------------------------------------------------------+
```

### 7.2 Data Flow Between Systems

| Source | Destination | Data Type | Frequency | Protocol |
|--------|-------------|-----------|-----------|----------|
| Webex CC | Dialogflow CX | Audio stream | Per call (real-time) | HTTPS |
| Dialogflow CX | Webex CC | Intent + Sentiment | Per call (real-time) | HTTPS |
| Webex CC | Vertex AI | Routing features | Per call (real-time) | HTTPS |
| Vertex AI | Webex CC | Agent recommendation | Per call (real-time) | HTTPS |
| Webex CC | Zendesk | CTI events | Per call (real-time) | HTTPS |
| Zendesk | Webex CC | Customer profile | Per call (real-time) | HTTPS |
| Webex CC | BigQuery | Call outcome data | Batch (hourly) | HTTPS |
| BigQuery | Vertex AI | Training data | Batch (weekly) | Internal |

---

## 8. Architecture Assumptions and Dependencies

### 8.1 Assumptions

| ID | Assumption | Impact if Invalid | Mitigation |
|----|-----------|-------------------|------------|
| A1 | Webex CC India DC (Mumbai) available Q2 2026 | Must use nearest DC (Singapore/Australia) | Confirm with Cisco before contract |
| A2 | Cloud Connect partner (Airtel/Tata Communications/Tata Tele Business Services) supports 50 SIP channels | May need multiple providers | Get capacity confirmation in writing |
| A3 | GCP asia-south1 has all required services | Must use different region | Verify service availability |
| A4 | Agents have reliable 25 Mbps internet at home | Poor call quality, drops | Mandatory speed test, stipend |
| A5 | Zendesk Suite Professional has CTI support | Integration not possible | Verify tier requirements |
| A6 | Customer consents to call recording (DPDP) | Cannot record calls | Implement consent flow |
| A7 | Toll-free numbers (1800-xxx) available | Use regular DIDs | Confirm with telecom provider |

### 8.2 Dependencies

| ID | Dependency | Owner | Status | Required By |
|----|-----------|-------|--------|-------------|
| D1 | Cisco partner selected and contract signed | KidsWear India | PENDING | Week 1 |
| D2 | Cloud Connect partner agreement | Cisco Partner | PENDING | Week 3 |
| D3 | GCP project created and billing enabled | KidsWear India | PENDING | Week 3 |
| D4 | Zendesk tenant provisioned | KidsWear India | PENDING | Week 2 |
| D5 | Toll-free DIDs allocated | Telecom partner | PENDING | Week 5 |
| D6 | Agent headsets procured | KidsWear India | PENDING | Week 10 |
| D7 | Agent laptops meet minimum specs | KidsWear India | VERIFY | Week 8 |
| D8 | DPDP compliance review completed | Legal | PENDING | Week 4 |
| D9 | Facebook Business verification (WhatsApp) | KidsWear India | PENDING | Week 6 |

### 8.3 Constraints

| ID | Constraint | Description | Impact |
|----|-----------|-------------|--------|
| C1 | Budget (MSME) | Limited capital for implementation | Phased approach, negotiate discounts |
| C2 | IT Expertise | No dedicated IT team | Heavy reliance on partner support |
| C3 | Timeline | Go-live before school reopening (July) | 12-16 weeks maximum |
| C4 | Data Residency | All data must stay in India | Limits some cloud options |
| C5 | Language Support | Hindi + English required | AI model training needed |
| C6 | Remote Workforce | Agents work from home/store | Dependency on personal internet |

---

## 9. Architecture Risks

| Risk ID | Risk | Probability | Impact | Mitigation |
|---------|------|-------------|--------|------------|
| R1 | Webex CC India DC delayed beyond July 2026 | Low | High | Contract clause for DC guarantee |
| R2 | Dialogflow CX Hindi accuracy below 80% | Medium | High | Extensive training data collection |
| R3 | Agent home internet unreliable | High | Medium | Mobile hotspot backup, store fallback |
| R4 | Zendesk CTI integration complexity | Medium | Medium | Pre-built connector, dedicated dev |
| R5 | GCP costs exceed budget | Medium | Medium | Usage monitoring, alerts, auto-scaling limits |
| R6 | Regulatory changes (DPDP enforcement) | Low | High | Legal review, compliance-first design |
| R7 | Single vendor dependency (Cisco) | Low | Medium | Document exit strategy, API-first approach |
| R8 | AI routing not improving conversions | Medium | Medium | A/B testing, fallback to skills-based |

---

## 10. Next Steps

**Proceed to Chapter 3: Security and Compliance**
- DTMF masking for sensitive data
- Data encryption (in transit and at rest)
- PCI-DSS compliance for payment handling
- DPDP Act 2023 compliance checklist
- Network security for remote agents
- API security and authentication
- Call recording security
- Audit logging and monitoring

**Then Chapter 4: Platform Provisioning (LLD)**
- Step-by-step Webex Control Hub setup
- Webex Calling configuration
- Webex Contact Center provisioning
- Dialogflow CX agent creation
- Vertex AI model deployment
- Zendesk CTI connector setup
- Agent desktop configuration
- Digital channel setup
- Monitoring dashboard configuration

---

## Document Information

**Document Title:** Chapter 2: Solution Architecture (High-Level Design)  
**Project:** KidsWear India - Cisco Webex Contact Center Greenfield Deployment  
**Version:** 1.0  
**Author:** Rajmohan M, Principal Consultant  
**AI-Assisted:** Claude (Anthropic)


---

**DISCLAIMER:** This document contains AI-assisted content. All architecture decisions, platform selections, and integration designs should be validated with official vendor documentation, certified partners, and technical architects. Specific product versions, features, and regional availability should be confirmed with Cisco, Google Cloud, and Zendesk before finalizing the design.

---

*End of Chapter 2*
