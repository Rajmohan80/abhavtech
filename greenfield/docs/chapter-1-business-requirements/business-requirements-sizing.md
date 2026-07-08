# Business Requirements & Sizing

## Executive Summary

This chapter establishes the business context, functional requirements, and technical sizing for KidsWear India's greenfield cloud contact center deployment. As an MSME (Micro, Small, and Medium Enterprise) in the retail manufacturing sector, KidsWear India requires a cost-effective, scalable, and AI-enabled contact center solution that supports distributed agents working from home or retail stores.

**Key Outcomes:**
- 50 total agents (20 concurrent) with remote work capability
- 50 concurrent voice sessions with 20-30 calls per hour
- Omnichannel support: Voice, WhatsApp, Web Chat, Email
- AI-powered IVR with multilingual support (English + Hindi)
- Zendesk CRM integration for unified customer view
- India data residency compliance (DPDP Act 2023)

---

## 1. Business Context

### 1.1 Company Profile

**Company Name:** KidsWear India Pvt Ltd  
**Industry:** Retail Manufacturing  
**Business Type:** MSME (Small Enterprise)  
**Products:**
- Children's casual clothing (B2C)
- School uniforms (B2B with schools + B2C retail)
- E-commerce sales (growing channel)

**Geographic Presence:**
- Headquarters: [City, India]
- Retail outlets: 5-10 locations
- E-commerce: Pan-India delivery

**Employee Count:**
- Total employees: ~100-150
- Contact center staff: 50 agents + 2 supervisors

### 1.2 Current State Pain Points

| Pain Point | Business Impact | Frequency |
|------------|----------------|-----------|
| Missed calls during peak season | Lost bulk orders from schools | Critical (July-August school reopening) |
| No centralized customer view | Repeated information requests, customer frustration | Daily |
| Poor call tracking | No visibility into abandoned calls | Continuous |
| Manual order processing | Revenue leakage, order errors | 20-30% of orders |
| No multilingual support | Cannot serve Hindi/regional customers effectively | 40% of customer base |
| No omnichannel capability | Customers must call; no WhatsApp/chat option | Lost digital-native customers |
| No remote work support | Agents must be in office | High attrition during COVID-like events |

### 1.3 Business Objectives

**Primary Goals:**
1. **Capture 100% of inbound inquiries** - Zero missed calls during peak season
2. **Increase B2B conversion rate by 30%** - Convert more school uniform bulk orders
3. **Reduce average handling time by 20%** - AI-assisted agent productivity
4. **Enable omnichannel customer engagement** - Voice + Digital channels
5. **Support distributed workforce** - Agents work from home or store

**Success Metrics:**

| KPI | Current State | Target (6 months) | Target (12 months) |
|-----|---------------|-------------------|---------------------|
| Call Abandonment Rate | Unknown (no tracking) | < 5% | < 3% |
| First Call Resolution | Unknown | > 70% | > 80% |
| Average Speed to Answer | Unknown | < 30 seconds | < 20 seconds |
| Customer Satisfaction (CSAT) | No measurement | > 4.0/5.0 | > 4.5/5.0 |
| B2B Order Conversion | ~40% (estimated) | 55% | 65% |
| Agent Utilization | Unknown | 65-70% | 75-80% |
| Digital Channel Adoption | 0% | 20% | 35% |

---

## 2. Functional Requirements

### 2.1 Voice Channel Requirements

| Requirement ID | Requirement | Priority | Notes |
|----------------|-------------|----------|-------|
| **VOICE-001** | Inbound toll-free numbers (2 DIDs) | MUST | 1 for Sales, 1 for Support |
| **VOICE-002** | Cloud PSTN connectivity (India compliant) | MUST | Webex Calling with Cloud Connect |
| **VOICE-003** | IVR with DTMF + Speech recognition | MUST | Hybrid IVR for accessibility |
| **VOICE-004** | Automatic Call Distribution (ACD) | MUST | Skills-based routing |
| **VOICE-005** | WebRTC-based agent desktop | MUST | Browser-based, no softphone install |
| **VOICE-006** | Call recording with compliance | MUST | PCI-DSS pause/resume |
| **VOICE-007** | Real-time supervisor monitoring | MUST | Live dashboards, barge-in capability |
| **VOICE-008** | Multilingual IVR (English + Hindi) | SHOULD | Google Dialogflow CX |
| **VOICE-009** | Predictive routing based on AI | SHOULD | Vertex AI model |
| **VOICE-010** | Outbound dialing capability | COULD | Future phase for campaigns |

### 2.2 Digital Channel Requirements

| Requirement ID | Requirement | Priority | Platform |
|----------------|-------------|----------|----------|
| **DIGITAL-001** | WhatsApp Business integration | MUST | Webex Connect |
| **DIGITAL-002** | Website live chat widget | MUST | Webex Engage |
| **DIGITAL-003** | Email channel integration | MUST | Webex Connect |
| **DIGITAL-004** | Chatbot for common queries | SHOULD | Dialogflow CX |
| **DIGITAL-005** | Android mobile app bot | COULD | Dialogflow CX + custom app |
| **DIGITAL-006** | Social media (Facebook, Instagram) | COULD | Future phase |
| **DIGITAL-007** | Unified agent desktop (all channels) | MUST | Single interface for voice + digital |

### 2.3 CRM Integration Requirements

| Requirement ID | Requirement | Priority | Details |
|----------------|-------------|----------|---------|
| **CRM-001** | Zendesk as primary CRM | MUST | Already selected by customer |
| **CRM-002** | Screen pop on incoming call | MUST | Display customer history automatically |
| **CRM-003** | Auto-create ticket on new contact | MUST | Track all interactions |
| **CRM-004** | Click-to-call from Zendesk | SHOULD | Outbound convenience |
| **CRM-005** | Customer 360 view in agent desktop | MUST | Orders, complaints, payments |
| **CRM-006** | Sync call disposition to CRM | MUST | Unified reporting |
| **CRM-007** | B2B account hierarchy (schools) | MUST | School → Orders → Students |

### 2.4 AI/Automation Requirements

| Requirement ID | Requirement | Priority | Technology |
|----------------|-------------|----------|------------|
| **AI-001** | Conversational IVR (NLU) | MUST | Google Dialogflow CX |
| **AI-002** | Intent detection (Sales/Support/General) | MUST | Dialogflow CX intents |
| **AI-003** | Sentiment analysis | SHOULD | Dialogflow CX + Vertex AI |
| **AI-004** | Predictive routing | SHOULD | Vertex AI ML model |
| **AI-005** | Agent Assist (real-time suggestions) | COULD | RAG-based knowledge retrieval |
| **AI-006** | Post-call summarization | COULD | Future enhancement |
| **AI-007** | Chatbot for digital channels | SHOULD | Dialogflow CX virtual agent |

### 2.5 Workforce Optimization Requirements

| Requirement ID | Requirement | Priority | Details |
|----------------|-------------|----------|---------|
| **WFO-001** | Call recording (100%) | MUST | Compliance and training |
| **WFO-002** | Quality management scoring | SHOULD | Evaluate agent performance |
| **WFO-003** | Agent scheduling | SHOULD | Basic shift management |
| **WFO-004** | Real-time adherence | COULD | Track schedule compliance |
| **WFO-005** | Agent burnout detection | COULD | AI-based wellness monitoring |

### 2.6 Reporting & Analytics Requirements

| Requirement ID | Requirement | Priority | Details |
|----------------|-------------|----------|---------|
| **RPT-001** | Real-time dashboard (supervisor) | MUST | Live queue status, agent availability |
| **RPT-002** | Historical call reports | MUST | Daily, weekly, monthly summaries |
| **RPT-003** | Agent performance metrics | MUST | AHT, FCR, CSAT per agent |
| **RPT-004** | Queue performance analytics | MUST | Service level, abandonment |
| **RPT-005** | Custom KPI dashboards | SHOULD | Business-specific metrics |
| **RPT-006** | AI insights (intent analytics) | SHOULD | What customers are asking |
| **RPT-007** | Export to Excel/PDF | MUST | Share with management |

---

## 3. Technical Requirements

### 3.1 Agent Workspace Requirements

**Agent Profile:**
- Total agents: 50
- Concurrent agents (peak): 20-25
- Supervisors: 2
- Work location: **Remote (home) OR retail store**
- Device: **Personal/company laptop with internet**
- Browser: Chrome (preferred), Firefox, Edge

**Minimum Agent Workstation Specifications:**

| Component | Minimum Requirement | Recommended |
|-----------|---------------------|-------------|
| **Operating System** | Windows 10 (64-bit) or macOS 10.15+ | Windows 11 or macOS 12+ |
| **Processor** | Intel Core i5 (8th gen) or equivalent | Intel Core i7 or Apple M1 |
| **RAM** | 8 GB | 16 GB |
| **Storage** | 256 GB SSD (50 GB free) | 512 GB SSD |
| **Display** | 1920x1080 (Full HD) | Dual monitors recommended |
| **Browser** | Chrome 90+ (latest preferred) | Chrome (auto-update enabled) |
| **Audio** | USB headset with noise cancellation | Jabra/Poly certified headset |
| **Webcam** | Optional (for supervisor video calls) | 1080p webcam |
| **Internet** | 10 Mbps download / 5 Mbps upload | 25 Mbps download / 10 Mbps upload |
| **Latency** | < 150 ms to Webex DCs | < 100 ms preferred |
| **Jitter** | < 30 ms | < 10 ms |
| **Packet Loss** | < 1% | < 0.5% |

**WebRTC Browser Requirements:**
- JavaScript enabled
- WebRTC support (native in Chrome/Firefox/Edge)
- Microphone/speaker permissions granted
- No VPN required (direct internet access preferred)
- Firewall exceptions for Webex domains

### 3.2 Network Requirements

**Bandwidth Calculation:**

```
Per Agent Voice Bandwidth:
- G.711 codec: 87.2 kbps (uncompressed, best quality)
- G.729 codec: 31.2 kbps (compressed, lower quality)
- WebRTC default: ~100-150 kbps (Opus codec, variable)

Recommended per agent: 200 kbps (bidirectional with overhead)

Total Bandwidth for 25 concurrent agents:
= 25 agents × 200 kbps × 2 (up + down)
= 10,000 kbps = 10 Mbps

Add 30% safety margin:
= 10 Mbps × 1.3 = 13 Mbps

Digital channels add: ~50 kbps per concurrent chat session
For 10 concurrent chats: 500 kbps

Total recommended bandwidth: 15-20 Mbps dedicated for contact center
```

**QoS Requirements:**
- Voice traffic: DSCP EF (46) - Expedited Forwarding
- Signaling: DSCP CS3 (24) - Call signaling
- Data: DSCP AF41 (34) - High-priority data

**Note:** For remote agents at home, QoS may not be enforceable. Ensure minimum internet speed requirements are met.

### 3.3 Session Sizing

**Voice Session Calculation:**

```
Given:
- Peak concurrent agents: 25
- Calls per hour: 20-30
- Average Handle Time (AHT): 4-6 minutes (estimated)
- Wrap-up time: 1-2 minutes

Peak Sessions Calculation:
Sessions = (Calls per hour × AHT in hours) × Concurrency Factor

Conservative estimate:
Sessions = (30 calls/hr × 0.1 hr) × 1.5 concurrency factor
Sessions = 3 × 1.5 = 4.5 concurrent calls average

Peak estimate (burst):
Sessions = Peak agents × 0.8 utilization × 1.2 safety factor
Sessions = 25 × 0.8 × 1.2 = 24 concurrent sessions

Required trunk capacity:
Provision for: 50 concurrent sessions (handles 2x peak with growth)
```

**Digital Channel Session Sizing:**

```
WhatsApp/Chat concurrent sessions:
- Each agent can handle 2-3 concurrent chats
- 10 agents on digital channels = 20-30 concurrent sessions

Total digital capacity: 50 concurrent digital sessions
```

### 3.4 Telephony Requirements

**PSTN Connectivity:**

| Requirement | Specification | Notes |
|-------------|--------------|-------|
| **PSTN Provider** | Webex Calling Cloud Connect | India-licensed telcos (Airtel, Tata Communications, Tata Tele Business Services) |
| **DID Numbers** | 2 toll-free numbers | 1 Sales, 1 Support |
| **Number Format** | India toll-free: 1800-XXX-XXXX | National access |
| **Concurrent Calls** | 50 channels | SIP trunk capacity |
| **Codec Support** | G.711, G.729, Opus | WebRTC uses Opus |
| **SIP Protocol** | SIP over TLS (SIPS) | Encrypted signaling |
| **Media** | SRTP | Encrypted voice |
| **Regulatory** | DoT/TRAI compliance | India telecom regulations |

**IVR Call Flow Requirements:**

```
Toll-Free Number 1 (Sales):
1. Welcome message (English/Hindi)
2. "Press 1 for new orders, Press 2 for bulk orders, OR say what you need"
3. IF DTMF detected:
   - Press 1 → Intent = "New_Order"
   - Press 2 → Intent = "Bulk_Order"
4. IF Speech detected:
   - Audio stream sent to Google Dialogflow CX via webhook
   - Dialogflow CX returns:
     * intent: "Bulk_Uniform_Order", "Price_Inquiry", "Catalog_Request"
     * sentiment: positive/neutral/negative
     * entities: school_name, quantity, product_type
5. Context package sent to Vertex AI Predictive Router:
   - Input: {intent, sentiment, customer_tier, agent_performance_history}
   - Output: {recommended_queue, required_skills, agent_preference_list}
6. ACD routes based on Vertex AI recommendation
7. Queue announcement with estimated wait time
8. Agent connects with full context

Toll-Free Number 2 (Support):
1. Welcome message
2. "Press 1 for order status, Press 2 for complaints, OR describe your issue"
3. IF DTMF detected:
   - Press 1 → Intent = "Order_Status"
   - Press 2 → Intent = "Complaint"
4. IF Speech detected:
   - Dialogflow CX analyzes:
     * intent: "Order_Tracking", "Return_Request", "Payment_Issue"
     * sentiment: frustrated/neutral/satisfied
     * entities: order_number, product_name, issue_type
5. Vertex AI Predictive Router calculates:
   - For frustrated customer → Route to high-FCR agent
   - For complex issue → Route to senior support agent
   - For simple query → Route to any available agent
6. Agent connects with screen pop showing:
   - Customer history from Zendesk
   - Detected intent and sentiment
   - Suggested resolution from knowledge base
```

**Dialogflow CX Integration Architecture:**

```
Webex Contact Center IVR Flow
        |
        v
[Collect Digits or Speech Activity]
        |
        v
IF speech_input IS NOT EMPTY:
    |
    v
[HTTP Request to Dialogflow CX]
    URL: https://dialogflow.googleapis.com/v3/projects/{PROJECT_ID}/
         locations/asia-south1/agents/{AGENT_ID}/sessions/{SESSION_ID}:detectIntent
    Headers:
      Authorization: Bearer {ACCESS_TOKEN}
      Content-Type: application/json
    Body:
      {
        "queryInput": {
          "audio": {
            "config": {
              "audioEncoding": "AUDIO_ENCODING_LINEAR_16",
              "sampleRateHertz": 8000,
              "languageCode": "en-IN"  // or "hi-IN" for Hindi
            }
          }
        }
      }
    |
    v
[Parse Response]
    Extract: intent.displayName, parameters, sentimentAnalysisResult
    |
    v
[Set Flow Variables]
    Set: detected_intent = response.intent.displayName
    Set: sentiment_score = response.sentimentAnalysisResult.score
    Set: extracted_entities = response.parameters
    |
    v
[Call Vertex AI Predictive Router]
    URL: https://asia-south1-aiplatform.googleapis.com/v1/projects/{PROJECT_ID}/
         locations/asia-south1/endpoints/{ENDPOINT_ID}:predict
    Body:
      {
        "instances": [{
          "intent": detected_intent,
          "sentiment": sentiment_score,
          "customer_id": caller_id,
          "time_of_day": current_hour,
          "day_of_week": current_day
        }]
      }
    |
    v
[Extract Routing Decision]
    recommended_skill = response.predictions[0].skill
    agent_rank_list = response.predictions[0].agent_preferences
    |
    v
[Queue Task with Context]
    Queue: Sales or Support (based on entry point)
    Skills: [recommended_skill, language_skill]
    Priority: Based on sentiment (negative = high priority)
    CAD Variables: intent, sentiment, entities for agent desktop
```

**Vertex AI Predictive Routing Model:**

```
Model Type: Classification/Ranking Model
Training Data: Historical call outcomes + agent performance

Input Features:
- customer_intent (categorical): Bulk_Order, New_Order, Complaint, etc.
- customer_sentiment (float): -1.0 to 1.0
- customer_tier (categorical): VIP, Repeat, New
- customer_ltv (float): Lifetime value from Zendesk
- call_time (int): Hour of day (0-23)
- call_day (int): Day of week (0-6)
- queue_depth (int): Current queue size
- agent_availability (list): Available agents with skills

Output:
- recommended_skill (categorical): B2B_Bulk, B2C_Sales, Complaints, Returns
- agent_preference (ranked list): Agent IDs sorted by predicted success
- confidence_score (float): Model confidence

Success Metrics:
- For Sales: Conversion rate, average order value
- For Support: First call resolution, customer satisfaction

Retraining Schedule: Weekly batch training on BigQuery data
```

### 3.5 Security & Compliance Requirements

| Requirement | Standard | Implementation |
|-------------|----------|----------------|
| **Data Residency** | DPDP Act 2023 (India) | All data in India DCs (Mumbai/Chennai) |
| **Encryption in Transit** | TLS 1.2+ | All API and signaling traffic |
| **Voice Encryption** | SRTP | End-to-end encrypted calls |
| **PCI-DSS** | Level 3 (MSME) | Recording pause/resume for card data |
| **Data Retention** | As per DPDP | 90 days recordings, 1 year analytics |
| **Access Control** | RBAC | Role-based permissions |
| **Audit Logging** | All admin actions | Compliance trail |
| **Consent Management** | DPDP requirement | IVR consent prompt |
| **Right to Erasure** | DPDP requirement | Delete customer data on request |

**DPDP Act 2023 Compliance Checklist:**

| Requirement | Implementation | Status |
|-------------|----------------|--------|
| Consent before data collection | IVR prompt: "This call may be recorded for quality and training" | Required |
| Purpose limitation | Data used only for customer service | Design consideration |
| Data minimization | Collect only necessary information | Configuration setting |
| Storage limitation | Retention policies configured | Admin setup |
| Data principal rights | Support ticket for data access/deletion | Operational procedure |
| Data breach notification | 72-hour notification process | Incident management |
| Cross-border transfer | Data stays in India DCs | Architecture requirement |

---

## 4. Agent Sizing & Staffing Model

### 4.1 Agent Capacity Planning

**Agent Distribution:**

| Role | Count | Channels | Skills | Work Location |
|------|-------|----------|--------|---------------|
| **Sales Agents** | 30 | Voice + Digital | B2C Sales, B2B Bulk Orders, Hindi, English | Remote/Store |
| **Support Agents** | 20 | Voice + Digital | Order Status, Complaints, Returns, Hindi, English | Remote/Store |
| **Supervisors** | 2 | Monitoring + Escalation | All skills, Quality Management | Remote |
| **Total** | 52 | - | - | - |

**Shift Planning (Peak Season):**

```
Operating Hours: 9:00 AM - 9:00 PM IST (12 hours)
Peak Hours: 10:00 AM - 1:00 PM, 4:00 PM - 7:00 PM

Shift 1 (Morning): 9:00 AM - 5:00 PM
- 15 Sales agents
- 10 Support agents
- 1 Supervisor

Shift 2 (Evening): 1:00 PM - 9:00 PM
- 15 Sales agents
- 10 Support agents
- 1 Supervisor

Overlap (1:00 PM - 5:00 PM):
- Peak coverage with maximum agents
- Handles school reopening rush

Weekend Coverage:
- 5 Sales agents
- 5 Support agents
- 1 Supervisor (on-call)
```

**Erlang C Calculation (Verification):**

```
Parameters:
- Calls per hour (peak): 30
- Average Handle Time: 5 minutes = 0.083 hours
- Service Level Target: 80% answered in 30 seconds

Traffic Intensity (Erlangs):
A = λ × AHT = 30 × 0.083 = 2.5 Erlangs

Using Erlang C formula (simplified):
For 80/30 service level with 2.5 Erlangs:
Required agents ≈ 5-6 concurrent

Current provision: 20-25 concurrent agents
Result: ADEQUATE (handles 4x peak with room for growth)

Note: Over-provisioned intentionally for:
- Digital channel handling (concurrent chats)
- Training and quality time
- Seasonal spikes (school reopening = 3-4x normal)
- Future growth
```

### 4.2 Skills Matrix

| Agent ID | Name | Primary Skill | Secondary Skills | Languages | Max Concurrent Chats |
|----------|------|---------------|------------------|-----------|---------------------|
| AGT001-030 | Sales Team | B2C_Sales | B2B_Bulk, Upsell | English, Hindi | 2 |
| AGT031-050 | Support Team | Order_Status | Complaints, Returns | English, Hindi | 3 |
| SUP001-002 | Supervisors | Escalation | All Skills | English, Hindi | - |

**Skill-Based Routing Rules:**

```
Priority Order:
1. Language match (Hindi caller → Hindi-skilled agent)
2. Intent match (Bulk order → B2B_Bulk skill)
3. Customer tier (VIP/Repeat → High-performing agent)
4. Longest available (fallback)

Example Routing Logic:
IF customer_language = "Hindi" AND intent = "Bulk_Order"
THEN route_to_skill = "B2B_Bulk" AND language = "Hindi"
ELSE IF customer_language = "Hindi"
THEN route_to_skill = "ANY" AND language = "Hindi"
ELSE route_to_skill = "ANY" AND language = "English"
```

---

## 5. Licensing Requirements

### 5.1 Webex Calling Licenses

**License Type: Webex Calling Professional**

| Component | Quantity | Notes |
|-----------|----------|-------|
| Webex Calling Professional | 52 users | All agents + supervisors |

**Webex Calling Features Included:**
- Cloud PSTN (via Cloud Connect partner)
- Unlimited domestic calling (India)
- Voicemail
- Call forwarding, hold, transfer
- WebRTC support
- Webex App (soft client)
- Mobile app (iOS/Android)

**Additional PSTN Requirements (Cloud Connect Partner):**

| Item | Quantity | Notes |
|------|----------|-------|
| Toll-Free DIDs | 2 numbers | 1 Sales, 1 Support |
| Inbound toll-free minutes | Estimated 10,000 min/month | Based on 30 calls/hr × 12 hrs × 30 days |
| SIP trunk channels | 50 concurrent | Peak capacity |

**Note:** Contact Cisco Cloud Connect partners in India (Airtel, Tata Communications, Tata Tele Business Services) for current pricing. Costs vary by partner and volume commitments.

### 5.2 Webex Contact Center Licenses

**License Type: Webex Contact Center Premium Agent**

| Component | Quantity | Notes |
|-----------|----------|-------|
| Contact Center Premium Agent (Named) | 50 agents | Full-featured agent license |
| Contact Center Supervisor Add-on | 2 supervisors | Monitoring and coaching capabilities |

**Webex Contact Center Premium Features:**
- Omnichannel (Voice + Digital)
- Skills-based routing
- IVR with Flow Designer
- Agent Desktop (WebRTC)
- Call recording
- Real-time and historical reporting
- Supervisor monitoring (listen, whisper, barge)
- API access for integrations
- Basic WFO (recording, quality management)

**Optional Add-ons (Phase 2 Consideration):**

| Add-on | Quantity | Purpose |
|--------|----------|---------|
| Advanced WFO (forecasting, scheduling) | 50 agents | Workforce optimization |
| Campaign Manager (outbound) | 1 tenant | Outbound dialing campaigns |

**Note:** Contact Cisco partners for current pricing. Consider concurrent vs. named licensing for cost optimization. MSME/SMB pricing programs may be available.

### 5.3 Webex Connect/Engage (Digital Channels)

**License Type: Webex Connect Platform**

| Component | Estimated Volume/Month | Notes |
|-----------|------------------------|-------|
| Platform Fee (base) | 1 tenant | Base subscription required |
| WhatsApp Business messages | 5,000 messages | Service conversations (not marketing) |
| Web Chat sessions | 2,000 sessions | Website live chat widget |
| Email interactions | 3,000 emails | Inbound email channel |

**Features:**
- WhatsApp Business API integration
- Web chat widget with customization
- Email channel management
- Bot integration support (Dialogflow CX)
- Routing to Webex Contact Center queues
- Conversation history and analytics

**Notes:**
- WhatsApp Business API requires Facebook Business verification
- Message costs vary by conversation type (marketing vs. service)
- Volume discounts typically available for higher usage
- Contact Webex Connect team for MSME-specific pricing

### 5.4 Google Cloud Platform (GCP) - CCAI

**Dialogflow CX Components:**

| Component | Estimated Usage/Month | Purpose |
|-----------|----------------------|---------|
| Dialogflow CX - Audio input | 10,000 requests | Speech recognition for IVR |
| Dialogflow CX - Text input | 5,000 requests | Chatbot conversations |
| Cloud Speech-to-Text (enhanced) | 10,000 minutes | High-accuracy transcription |
| Cloud Text-to-Speech (WaveNet) | 5 million characters | Natural voice responses |

**Vertex AI Components (Predictive Routing):**

| Component | Estimated Usage/Month | Purpose |
|-----------|----------------------|---------|
| Vertex AI Prediction (online) | 50,000 predictions | Real-time routing decisions |
| BigQuery storage | 100 GB | Analytics and model training data |
| BigQuery queries | 1 TB processed | Reporting and analysis |
| Cloud Storage | 50 GB | Model artifacts and configuration |

**GCP Support Plans:**

| Plan | Recommendation |
|------|----------------|
| Basic (free) | Development/testing only |
| Standard | Recommended for production |
| Enhanced | For mission-critical deployments |

**Important Considerations:**
- All GCP resources must be deployed in `asia-south1 (Mumbai)` region for data residency
- Dialogflow CX pricing is usage-based (pay per request)
- Vertex AI pricing includes training + prediction costs
- Consider GCP Committed Use Discounts (CUDs) for 1-3 year commitments
- Contact Google Cloud partner for MSME pricing programs
- Free tier available for initial development and testing

### 5.5 Zendesk CRM Licenses

**License Type: Zendesk Suite Professional (Recommended)**

| Component | Quantity | Notes |
|-----------|----------|-------|
| Zendesk Suite Professional | 52 users | All agents + supervisors |

**Alternative License Tiers:**

| Tier | Suitability for KidsWear India |
|------|-------------------------------|
| Zendesk Suite Team | Basic features, limited integrations - NOT RECOMMENDED |
| Zendesk Suite Growth | Good for growing teams, limited automation |
| Zendesk Suite Professional | **RECOMMENDED** - Full CTI support, API access |
| Zendesk Suite Enterprise | Advanced features, higher cost - consider for future |

**Zendesk Professional Features:**
- Ticketing system
- Email, chat, voice channel support
- Knowledge base (Help Center)
- Reporting and analytics
- CTI integration support (for Webex CC)
- REST API access (required for screen pop)
- Custom ticket fields
- Business hours and SLA management
- Workflow automation (triggers, macros)

**Important Considerations:**
- Annual billing typically offers 10-20% discount over monthly
- Zendesk for Startups program may provide free/discounted licenses
- MSME-specific pricing programs available in India
- Ensure Professional tier or higher for CTI integration support
- Contact Zendesk sales for volume discounts (50+ users)

### 5.6 Total License Requirements Summary

**Complete License Inventory:**

| Category | License Type | Quantity | Billing Model |
|----------|-------------|----------|---------------|
| **Webex Calling** | Professional | 52 users | Per user/month |
| **Webex Contact Center** | Premium Agent (Named) | 50 agents | Per agent/month |
| **Webex Contact Center** | Supervisor Add-on | 2 supervisors | Per supervisor/month |
| **Webex Connect** | Platform + Usage | 1 tenant | Base + per message/session |
| **Google Cloud** | Dialogflow CX | Per request | Usage-based |
| **Google Cloud** | Vertex AI | Per prediction | Usage-based |
| **Google Cloud** | BigQuery + Storage | Per GB | Usage-based |
| **Zendesk** | Suite Professional | 52 users | Per user/month |

**PSTN Services (via Cloud Connect Partner):**

| Item | Quantity | Notes |
|------|----------|-------|
| Toll-Free DIDs | 2 numbers | India national access (1800-XXX-XXXX) |
| Inbound minutes | ~10,000/month | Based on projected call volume |
| SIP trunk channels | 50 concurrent | Peak capacity |

**One-Time Implementation Requirements:**

| Item | Purpose |
|------|---------|
| Professional Services (Cisco Partner) | Platform implementation and configuration |
| GCP CCAI Setup (Google Partner) | Dialogflow CX + Vertex AI setup |
| Zendesk Integration Development | Custom CTI connector for Webex CC |
| Agent Headsets (50 units) | USB headsets with noise cancellation |
| Training Program | Agent + Supervisor + Admin training |
| Network Assessment | Bandwidth testing, QoS configuration |

### 5.7 License Procurement Recommendations

**Cost Optimization Strategies:**

1. **Licensing Model Selection**
   - Named licenses: Pay for each individual user (50 agents)
   - Concurrent licenses: Pay for peak simultaneous users (25 concurrent)
   - **Recommendation:** Inquire about concurrent licensing availability for MSME

2. **Billing Commitment**
   - Monthly: Higher flexibility, higher per-unit cost
   - Annual: 10-15% savings, 12-month commitment
   - Multi-year (3 years): 20-30% savings, longer commitment
   - **Recommendation:** Start with annual, move to multi-year after validation

3. **MSME/SMB Programs**
   - Cisco: SMB Partner programs with discounted rates
   - Google Cloud: Startup credits and SMB pricing
   - Zendesk: Startups program (up to 6 months free)
   - **Action:** Request MSME-specific pricing from all vendors

4. **Phased Rollout**
   - Phase 1: 25 agents (core team)
   - Phase 2: Additional 25 agents (3-6 months later)
   - **Benefit:** Defer costs, validate solution before full commitment

5. **Bundle Opportunities**
   - Webex Calling + Webex Contact Center from single partner
   - Potential bundle discounts (10-20%)
   - Single invoice, simplified support

6. **GCP Committed Use Discounts (CUDs)**
   - 1-year commitment: ~20% discount on compute
   - 3-year commitment: ~40% discount on compute
   - **Note:** Only commit after usage patterns established

**Vendor Negotiation Checklist:**

- [ ] Get minimum 3 quotes from different Cisco partners
- [ ] Request MSME/SMB pricing tier explicitly
- [ ] Ask about concurrent vs. named licensing options
- [ ] Negotiate multi-year commitment discounts (15-25%)
- [ ] Request free implementation services in exchange for case study
- [ ] Explore financing options (Cisco Capital, payment plans)
- [ ] Confirm India data residency guarantees in contract
- [ ] Verify service level agreements (SLAs) for uptime
- [ ] Understand license upgrade/downgrade flexibility
- [ ] Document all pricing in INR (avoid currency fluctuation risk)

**Total Cost Estimation Approach:**

```
For accurate budgeting, request quotes from vendors with:

1. Webex Calling + Contact Center: Request quote from Cisco partner
   - Specify: 52 Webex Calling users + 50 CC agents + 2 supervisors
   - Region: India (Webex Contact Center: Mumbai DC; Webex Calling: Mumbai + Chennai DCs)
   - Annual commitment

2. Cloud Connect PSTN: Request quote from Airtel/Tata Communications/Tata Tele Business Services
   - Specify: 2 toll-free DIDs + 10K minutes/month + 50 channels
   - Service level requirements

3. GCP Services: Use Google Cloud Pricing Calculator
   - URL: https://cloud.google.com/products/calculator
   - Input: Dialogflow CX requests, Vertex AI predictions
   - Region: asia-south1

4. Zendesk: Request quote from Zendesk sales
   - Specify: 52 users, Suite Professional
   - Annual billing
   - MSME program eligibility

5. Implementation Services: Request SOW from system integrator
   - Fixed-price implementation preferred
   - Include training and hypercare support
```

**Important:** Costs will vary significantly based on:
- Negotiated discounts (can be 20-40% off list price)
- Regional pricing (India vs. global rates)
- Volume commitments
- Partner relationships
- Current promotional programs
- Currency exchange rates (if quoted in USD)

Contact local Cisco, Google, and Zendesk partners in India for accurate quotes specific to KidsWear India's requirements.

---

## 6. Solution Architecture Overview

### 6.1 High-Level Component Diagram

```
+------------------+     +----------------------+     +------------------+
|   PSTN/Telco     |     |   Webex Calling      |     |  Webex Contact   |
|   (India)        |     |   (Mumbai/Chennai    |     |  Center          |
|                  |     |    DCs)              |     |  (Mumbai DC)     |
|  [Toll-Free DIDs]| --> |  [Cloud PSTN]        | --> |  [IVR/ACD/       |
|  [Airtel/Tata/   |     |  [SIP Trunking]      |     |   Routing]       |
|   TTBS]          |     |  [Media Processing]  |     |  [Agent Desktop] |
+------------------+     +----------------------+     +------------------+
                                                              |
                                                              v
+------------------+     +----------------------+     +------------------+
|   Google Cloud   |     |   Webex Connect/     |     |   Zendesk CRM    |
|   (asia-south1)  |     |   Engage             |     |                  |
|                  |     |                      |     |                  |
|  [Dialogflow CX] | <-- |  [WhatsApp Business] | <-- |  [Customer 360]  |
|  [Vertex AI]     |     |  [Web Chat]          |     |  [Ticketing]     |
|  [BigQuery]      |     |  [Email]             |     |  [Screen Pop]    |
+------------------+     +----------------------+     +------------------+
                                                              |
                                                              v
                                                     +------------------+
                                                     |   Agent Desktop  |
                                                     |   (WebRTC)       |
                                                     |                  |
                                                     |  [Browser-based] |
                                                     |  [Home/Store]    |
                                                     |  [Laptop+Internet|
                                                     +------------------+
```

### 6.2 Call Flow Summary

**Inbound Voice Call Flow:**

```
Step 1: Customer dials toll-free number (1800-XXX-XXXX)
        ↓
Step 2: Call routes through Cloud Connect partner (Airtel/Tata)
        ↓
Step 3: Webex Calling receives call at Mumbai/Chennai DC
        ↓
Step 4: Call delivered to Webex Contact Center
        ↓
Step 5: IVR plays welcome message:
        "Welcome to KidsWear India. You can say what you need,
         or Press 1 for Sales, Press 2 for Support, Press 3 for Agent"
        ↓
Step 6: IF DTMF pressed → Map to initial intent
        IF Speech detected → Send to Dialogflow CX
        ↓
Step 7: Dialogflow CX returns:
        - Intent (Sales, Support, Bulk Order, Complaint, etc.)
        - Sentiment (Positive, Neutral, Negative)
        - Entities (school_name, quantity, order_number)
        ↓
Step 8: Webex CC sends context to Vertex AI Predictive Router
        ↓
Step 9: Vertex AI returns:
        - Recommended queue
        - Required skills
        - Preferred agent list (based on conversion/FCR history)
        ↓
Step 10: ACD routes call to best available agent
         ↓
Step 11: Agent desktop:
         - WebRTC call connects
         - Zendesk screen pop with customer history
         - Agent Assist suggestions displayed
         ↓
Step 12: Call concludes → Disposition captured → Zendesk ticket updated
         ↓
Step 13: Recording stored in India DC (encrypted at rest)
```

### 6.3 Technology Stack Summary

| Layer | Technology | Version/Spec | Region/Location |
|-------|------------|--------------|-----------------|
| **PSTN** | Webex Calling Cloud Connect | Latest | India (Airtel, Tata Communications, Tata Tele Business Services) |
| **Voice Platform** | Webex Calling | Latest | Mumbai/Chennai DCs |
| **Contact Center** | Webex Contact Center | Latest | Mumbai DC (India expansion Q2 2026) |
| **IVR/NLU** | Google Dialogflow CX | Latest | GCP asia-south1 (Mumbai) |
| **AI/ML** | Google Vertex AI | Latest | GCP asia-south1 (Mumbai) |
| **Data Warehouse** | Google BigQuery | Latest | GCP asia-south1 (Mumbai) |
| **Digital Channels** | Webex Connect/Engage | Latest | Cloud (Webex infrastructure) |
| **CRM** | Zendesk Suite Professional | Latest | Cloud (Zendesk infrastructure) |
| **Agent Desktop** | Webex CC Agent Desktop | Latest (WebRTC) | Browser-based |
| **Monitoring** | Webex CC Analyzer + Custom | Latest | Cloud + GCP dashboards |

---

## 7. Success Criteria & Acceptance

### 7.1 Go-Live Readiness Criteria

| Category | Criteria | Target | Measurement Method |
|----------|----------|--------|-------------------|
| **Infrastructure** | All components deployed and tested | 100% | Deployment checklist |
| **Voice Quality** | MOS score | > 4.0 | Voice quality monitoring |
| **Call Routing** | IVR → Agent routing accuracy | > 95% | Test calls |
| **Agent Desktop** | WebRTC connection success | > 99% | Login success rate |
| **CRM Integration** | Screen pop success rate | > 98% | Zendesk logs |
| **AI Accuracy** | Intent detection accuracy | > 85% | Dialogflow CX analytics |
| **Digital Channels** | WhatsApp/Chat functional | 100% | End-to-end testing |
| **Recording** | Call recording capture | 100% | WFO storage verification |
| **Reporting** | Dashboards operational | 100% | Visual inspection |
| **Training** | Agents certified | 100% (50/50) | Training completion |
| **Documentation** | Admin guide and SOPs | Complete | Document review |

### 7.2 Post-Go-Live Success Metrics (30-60-90 Days)

**30-Day Metrics:**
- System uptime: > 99.5%
- Call abandonment: < 10% (establishing baseline)
- Average speed to answer: < 60 seconds
- Agent adoption: > 90% using all features

**60-Day Metrics:**
- Call abandonment: < 7%
- First call resolution: > 65%
- CSAT baseline established: > 3.5/5.0
- AI intent accuracy: > 88%

**90-Day Metrics:**
- Call abandonment: < 5%
- First call resolution: > 70%
- CSAT: > 4.0/5.0
- Agent utilization: 65-70%
- Digital channel adoption: > 15% of interactions
- AI predictive routing: 10% improvement in conversion

---

## 8. Risks & Mitigation

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| **Remote agent internet quality** | High | High | Mandatory speed test; backup mobile hotspot; stipend for internet upgrade |
| **MSME technical capability** | High | Medium | Detailed step-by-step guides; extended partner support; train-the-trainer model |
| **Dialogflow CX accuracy (Hindi)** | Medium | High | Extensive training data; fallback to DTMF; continuous tuning |
| **Cloud Connect partner delays** | Medium | High | Early engagement; backup partner identified; phased number porting |
| **Zendesk integration complexity** | Medium | Medium | Pre-built CTI connector; dedicated integration partner; UAT testing |
| **Peak season pressure** | High | High | Go-live 2 months before peak; hypercare during school reopening |
| **Agent adoption resistance** | Medium | Medium | Change management program; incentives for early adopters; super-user network |
| **Cost overruns** | Medium | High | Fixed-price contracts; phased implementation; contingency budget (15%) |
| **Data residency compliance** | Low | Critical | Validate Mumbai/Chennai DC usage; legal review of DPDP compliance |
| **Vendor lock-in** | Low | Medium | API-first architecture; export capabilities; contract exit clauses |

---

## 9. Project Timeline (High-Level)

**Total Duration: 12-16 weeks**

```
Week 1-2: Project Kickoff & Planning
- Requirements finalization
- Vendor contracts signed
- Project team formation
- Detailed project plan

Week 3-4: Infrastructure Setup
- Webex Control Hub tenant creation
- GCP project setup (asia-south1)
- Zendesk tenant configuration
- Network assessment

Week 5-6: Platform Configuration
- Webex Calling provisioning
- Webex Contact Center setup
- Entry points and DIDs configured
- Basic IVR flow created

Week 7-8: Integrations
- Zendesk CTI integration
- Dialogflow CX agent creation
- Vertex AI model development
- Digital channels setup (WhatsApp, Chat)

Week 9-10: Testing
- Unit testing (each component)
- Integration testing
- User Acceptance Testing (UAT)
- Performance/load testing

Week 11-12: Training & Go-Live Prep
- Agent training (2-3 days)
- Supervisor training
- Admin training
- Pre-go-live checklist

Week 13-14: Go-Live & Hypercare
- Soft launch (10 agents)
- Full rollout (all agents)
- 24/7 support during first week
- Issue resolution

Week 15-16: Stabilization
- Performance optimization
- AI model tuning
- Reporting finalization
- Handover to operations
```

---

## 10. Next Steps

**Immediate Actions (Week 1):**

1. **Sign-off on this Business Requirements Document**
2. **Finalize vendor selection** (Cisco partner for Webex, Google partner for GCP)
3. **Procure licenses** (start with 30-day trial if available)
4. **Identify project team** (KidsWear India IT contact + partner resources)
5. **Schedule kickoff meeting**

**Proceed to Chapter 2: Solution Architecture (Detailed Design)**
- Detailed architecture diagrams
- Component specifications
- Integration architecture
- Security architecture
- High availability design

---

## Document Information

**Document Title:** Chapter 1: Business Requirements & Sizing  
**Project:** KidsWear India - Cisco Webex Contact Center Greenfield Deployment  
**Version:** 1.0  
**Author:** Rajmohan M, Principal Consultant  
**AI-Assisted:** Claude (Anthropic)  


---

**DISCLAIMER:** This document contains AI-assisted content. All technical specifications, pricing estimates, and recommendations should be validated with official Cisco, Google Cloud, and Zendesk documentation and authorized partners. Pricing is estimated and subject to change based on actual quotes, regional variations, and negotiated discounts. Implementation timelines are estimates and may vary based on resource availability and project complexity.

---

*End of Chapter 1*
