# ABHAVTECH WxCC MIGRATION - MASTER REFERENCE CARD 
## DO NOT DEVIATE FROM THESE SPECIFICATIONS

**Project:** ABV-COLLAB-MIG-2026 | **Version:** 2.0 | **Date:** January 2026  
**Source of Truth:** Chapter 3 (Baseline Design) + Chapter 10 (AI Enhancement)

---

## DOCUMENT VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 2026 | Initial release - UCCX to WxCC baseline migration |
| 2.0 | Jan 2026 | Added hybrid AI architecture, Phase 2A/2B distinction, new skills/queues |

---

## MIGRATION PHASE STRUCTURE

```
+-----------------------------------------------------------------------------+
|                    ABHAVTECH MIGRATION PHASES                               |
+-----------------------------------------------------------------------------+
|                                                                             |
|  PHASE 1: CUCM -> WEBEX CALLING                              [OK] COMPLETE    |
|  =======================================================================   |
|  * 3,200 enterprise users migrated                                         |
|  * Webex Calling operational across 12 sites                               |
|  * Reference: Chapters 1-2, 4-5                                            |
|                                                                             |
|  PHASE 2A: UCCX -> WxCC BASELINE                             📋 CURRENT    |
|  =======================================================================   |
|  * 175 agents migrated to WxCC                                             |
|  * Feature parity with UCCX (DTMF IVR menus)                              |
|  * NO AI features - baseline migration only                                |
|  * Duration: ~3 months operational stability                               |
|  * Reference: Chapters 3, 6-8                                              |
|                                                                             |
|  PHASE 2B: AI ENHANCEMENT (HYBRID)                          🔮 PLANNED    |
|  =======================================================================   |
|  * Virtual Agent "Abhi" deployment                                         |
|  * Webex AI Agent + Dialogflow CX hybrid architecture                      |
|  * Flow modifications for intent-based routing                             |
|  * New AI-specific skills and queues                                       |
|  * Agent Assist enablement                                                 |
|  * Reference: Chapters 9-10                                                |
|                                                                             |
|  PHASE 3: PREDICTIVE ROUTING & OPTIMIZATION                 🔮 FUTURE     |
|  =======================================================================   |
|  * Requires 6+ months historical data from Phase 2A                        |
|  * Auto-trained routing models                                             |
|  * Advanced analytics                                                      |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---

## 1. AGENT DISTRIBUTION (175 TOTAL)

| Site | Voice | Digital | Total | Hours | Teams |
|------|-------|---------|-------|-------|-------|
| **Mumbai HQ** | 100 | 20 | 120 | 24x7 | Sales-IN, Support, Billing, Tech |
| **Chennai** | 25 | 5 | 30 | 9AM-9PM | Sales-IN, Support, Digital |
| **London** | 15 | 0 | 15 | 9AM-6PM | Sales-EMEA, Support |
| **New Jersey** | 10 | 0 | 10 | 9AM-6PM | Sales-US, Support |
| **TOTAL** | **150** | **25** | **175** | | |

---

## 2. LICENSING

| License Type | Quantity | Assignment |
|--------------|----------|------------|
| Standard Agent | 100 | Voice-only agents |
| Premium Agent | 75 | Voice + Digital agents |
| Supervisor | 10 | Team supervisors |
| Webex AI Agent | 1 | Virtual Agent "Abhi" (Voice IVR) |
| Google CCAI | 1 | Dialogflow CX (Complex conversations) |
| WFO Recording | 175 | All agents |
| WFO QM | 50 | Evaluation sample |
| WFO WFM | 175 | All agents |

**License Distribution:** Mumbai (80 Std + 40 Prem), Chennai (15+15), London (5+10), NJ (0+10)

---

## 3. ENTRY POINTS (6 TOTAL)

| ID | Entry Point Name | Channel | Dial Numbers | Flow |
|----|------------------|---------|--------------|------|
| EP-01 | India_Main_Voice_EP | Telephony | 1800-266-1000, +91-22-4960-1000 | India_MainMenu_Flow_v1 |
| EP-02 | India_Sales_Direct_EP | Telephony | 1800-266-1001 | India_Sales_Direct_Flow_v1 |
| EP-03 | EMEA_Main_Voice_EP | Telephony | +44-20-XXXX-XXXX | EMEA_MainMenu_Flow_v1 |
| EP-04 | Americas_Main_Voice_EP | Telephony | +1-201-XXX-XXXX | Americas_MainMenu_Flow_v1 |
| EP-05 | Global_Chat_EP | Chat | Web widget / WhatsApp | Digital_Chat_Flow_v1 |
| EP-06 | Global_Email_EP | Email | support@abhavtech.com | Digital_Email_Flow_v1 |

---

## 4. QUEUES - PHASE 2A BASELINE (10 QUEUES)

| Queue Name | Channel | SL | Skills Required | Team |
|------------|---------|----|-----------------| -----|
| Sales_India_Queue | Voice | 30s | Sales, Region_India | India_Sales_Team |
| Sales_EMEA_Queue | Voice | 30s | Sales, Region_EMEA | EMEA_Team |
| Sales_Americas_Queue | Voice | 30s | Sales, Region_Americas | Americas_Team |
| Support_India_Queue | Voice | 45s | Support, Region_India | India_Support_Team |
| Support_EMEA_Queue | Voice | 45s | Support, Region_EMEA | EMEA_Team |
| Support_Americas_Queue | Voice | 45s | Support, Region_Americas | Americas_Team |
| Billing_Queue | Voice | 60s | Billing | India_Billing_Team |
| TechSupport_Queue | Voice | 45s | TechnicalSupport | India_TechSupport |
| Digital_Chat_Queue | Chat | 15s | Digital_Channels | India_Digital_Team |
| Digital_Email_Queue | Email | 4hr | Digital_Channels | India_Digital_Team |

## 4B. QUEUES - PHASE 2B AI ADDITIONS (+3 QUEUES = 13 TOTAL)

| Queue Name | Channel | SL | Skills Required | Purpose |
|------------|---------|----|-----------------| --------|
| VA_Escalation_Queue | Voice | 20s | AI_Escalation_Handler | Priority queue for VA escalations with context |
| Sentiment_Priority_Queue | Voice | 15s | Sentiment_Recovery | Negative sentiment detected - expedited |
| Digital_VA_Escalation_Queue | Digital | 30s | AI_Escalation_Handler, Digital_Channels | Chat/WhatsApp escalations from Dialogflow CX |

**UCCX CSQ Mapping:** Sales_India_CSQ -> Sales_India_Queue | Sales_EMEA_CSQ -> Sales_EMEA_Queue | Sales_Americas_CSQ -> Sales_Americas_Queue | Support_CSQ -> Support_India/EMEA/Americas_Queue (split) | Billing_CSQ -> Billing_Queue | TechSupport_CSQ -> TechSupport_Queue

---

## 5. SKILLS - PHASE 2A BASELINE (18 SKILLS)

| Category | Skill Name | Type | Agents |
|----------|-----------|------|--------|
| **Functional** | Sales | Boolean | 65 |
| | Support | Boolean | 55 |
| | Billing | Boolean | 15 |
| | TechnicalSupport | Boolean | 15 |
| | Digital_Channels | Boolean | 25 |
| **Language** | English | Proficiency 1-10 | 175 |
| | Hindi | Proficiency 1-10 | 80 |
| | Tamil | Proficiency 1-10 | 15 (Phase 3) |
| | German | Proficiency 1-10 | 5 (Phase 3) |
| **Regional** | Region_India | Boolean | 150 |
| | Region_EMEA | Boolean | 15 |
| | Region_Americas | Boolean | 10 |
| **Product** | ProductA_Expert | Proficiency 1-10 | 8 |
| | ProductB_Expert | Proficiency 1-10 | 7 |
| | ProductC_Expert | Proficiency 1-10 | 5 |
| **Special** | VIP_Handler | Boolean | 10 |
| | Escalation_Handler | Boolean | 5 |
| | Callback_Qualified | Boolean | 50 |

## 5B. SKILLS - PHASE 2B AI ADDITIONS (+4 SKILLS = 22 TOTAL)

| Category | Skill Name | Type | Agents | Purpose |
|----------|-----------|------|--------|---------|
| **AI-Related** | AI_Escalation_Handler | Boolean | 30 | Handle VA escalations (trained on context pickup) |
| | Complex_Query_Handler | Boolean | 20 | Multi-system queries VA cannot resolve |
| | Sentiment_Recovery | Boolean | 15 | Handle negative sentiment escalations |
| | Digital_Advanced | Proficiency 1-10 | 15 | Advanced digital channel handling |

**Proficiency Scale:** 1-3 Basic | 4-6 Intermediate | 7-9 Advanced | 10 Expert

---

## 6. FLOWS - PHASE 2A BASELINE (9 FLOWS)

| UCCX Script | WxCC Flow | Complexity | Daily Volume |
|-------------|-----------|------------|--------------|
| MainMenu_EN.aef | India_MainMenu_Flow_v1 | MEDIUM | ~2,500 calls |
| MainMenu_HI.aef | (merged with EN flow) | MEDIUM | ~800 calls |
| SalesQueue.aef | Sales_QueueTreatment_v1 | LOW | - |
| SupportQueue.aef | Support_QueueTreatment_v1 | MEDIUM | - |
| BillingQueue.aef | Billing_QueueTreatment_v1 | MEDIUM | - |
| TechSupport.aef | TechSupport_Flow_v1 | MEDIUM | - |
| AfterHours.aef | AfterHours_Subflow_v1 | LOW | - |
| Callback.aef | Callback_Flow_v1 | HIGH | - |
| Survey.aef | Survey_PostCall_v1 | MEDIUM | - |

## 6B. FLOWS - PHASE 2B AI MODIFICATIONS & ADDITIONS

| Flow | Modification Type | Changes |
|------|-------------------|---------|
| India_MainMenu_Flow_v1 | **MODIFIED** | Add Virtual Agent V2 node before DTMF menu; Intent detection first; DTMF fallback |
| EMEA_MainMenu_Flow_v1 | **MODIFIED** | Add Webex AI Agent node (English); Simpler intent handling |
| Americas_MainMenu_Flow_v1 | **MODIFIED** | Add Webex AI Agent node (English); Simpler intent handling |
| Support_QueueTreatment_v1 | **MODIFIED** | Add self-service offer while waiting (VA) |
| Digital_Chat_Flow_v1 | **MAJOR CHANGE** | Dialogflow CX integration; Full conversational AI |
| VA_Containment_Flow_v1 | **NEW** | End-to-end contained interactions (no agent) |
| AI_Escalation_Subflow_v1 | **NEW** | Context handoff from VA to human agent |

**Audio Prompts:** 87 Total (62 English + 25 Hindi) + AI TTS responses

---

## 7. TEAMS (8 TOTAL)

| Team Name | Site | Agents | Supervisor | Primary Queue |
|-----------|------|--------|------------|---------------|
| India_Sales_Team | Mumbai | 45 | Priya Sharma | Sales_India_Queue |
| India_Support_Team | Mumbai | 40 | Raj Kumar | Support_India_Queue |
| India_TechSupport | Mumbai | 15 | Amit Verma | TechSupport_Queue |
| India_Billing_Team | Mumbai | 15 | Sneha Gupta | Billing_Queue |
| Chennai_Support | Chennai | 25 | Karthik Raja | Support_India_Queue |
| India_Digital_Team | Chennai | 25 | Lakshmi Iyer | Digital_Chat/Email_Queue |
| EMEA_Team | London | 15 | James Wilson | Sales/Support_EMEA_Queue |
| Americas_Team | New Jersey | 10 | Mike Johnson | Sales/Support_Americas_Queue |

**Total Supervisors:** 10 (8 team leads + 2 Mumbai floor supervisors)

---

## 8. AI PLATFORM - HYBRID ARCHITECTURE (PHASE 2B)

```
+-----------------------------------------------------------------------------+
|                    HYBRID AI PLATFORM ARCHITECTURE                          |
+-----------------------------------------------------------------------------+
|                                                                             |
|                         CUSTOMER INTERACTION                                |
|                                |                                            |
|              +-----------------+-----------------+                         |
|              v                                   v                         |
|     +-----------------+                 +-----------------+                |
|     |  VOICE CHANNEL  |                 | DIGITAL CHANNELS|                |
|     |   (IVR Entry)   |                 | (Chat/WhatsApp) |                |
|     +--------+--------+                 +--------+--------+                |
|              |                                   |                         |
|              v                                   v                         |
|  +-----------------------+          +-----------------------+             |
|  |   WEBEX AI AGENT      |          |    DIALOGFLOW CX      |             |
|  |   (Cisco Native)      |          |    (Google CCAI)      |             |
|  +-----------------------+          +-----------------------+             |
|  | * Simple IVR tasks    |          | * Complex multi-turn  |             |
|  | * DTMF + basic NLU    |          | * Advanced NLU (EN/HI)|             |
|  | * Hours/Location FAQs |          | * Order status (API)  |             |
|  | * Menu navigation     |          | * Troubleshooting     |             |
|  | * Callback requests   |          | * Account management  |             |
|  | * Post-call survey    |          | * Sentiment-aware     |             |
|  |                       |          | * Rich responses      |             |
|  | INTENTS: 5 simple     |          | INTENTS: 10 complex   |             |
|  | COST: Included in WxCC|          | COST: GCP consumption |             |
|  +-----------+-----------+          +-----------+-----------+             |
|              |                                   |                         |
|              +-----------------+-----------------+                         |
|                               v                                            |
|                  +-------------------------+                               |
|                  |   WxCC FLOW DESIGNER    |                               |
|                  |  (Orchestration Layer)  |                               |
|                  +-------------------------+                               |
|                  | * Virtual Agent V2 Node |                               |
|                  | * Intent-based routing  |                               |
|                  | * Context preservation  |                               |
|                  | * Fallback to DTMF/Agent|                               |
|                  +-----------+-------------+                               |
|                              |                                             |
|                              v                                             |
|                  +-------------------------+                               |
|                  |     HUMAN AGENTS        |                               |
|                  |   (with Agent Assist)   |                               |
|                  +-------------------------+                               |
|                                                                             |
+-----------------------------------------------------------------------------+
```

### 8.1 Platform Assignment by Use Case

| Use Case | Platform | Channel | Rationale |
|----------|----------|---------|-----------|
| Simple IVR deflection | Webex AI Agent | Voice | Lower latency, native, no GCP costs |
| Hours/Location FAQs | Webex AI Agent | Voice | Static FAQ, simple response |
| Menu navigation assist | Webex AI Agent | Voice | DTMF fallback available |
| Callback requests | Webex AI Agent | Voice | Native WxCC callback integration |
| Post-call survey | Webex AI Agent | Voice | Simple CSAT collection |
| Order status lookup | Dialogflow CX | All | API integration, multi-turn |
| Product inquiry | Dialogflow CX | All | Complex catalog queries |
| Account management | Dialogflow CX | All | Secure authentication, PII |
| Troubleshooting | Dialogflow CX | All | Multi-turn diagnostic flows |
| Billing inquiries | Dialogflow CX | All | Payment integration |
| Chat conversations | Dialogflow CX | Chat | Rich responses, carousels |
| WhatsApp | Dialogflow CX | WhatsApp | Template messages, media |

### 8.2 Virtual Agent "Abhi" Configuration

| Attribute | Webex AI Agent | Dialogflow CX |
|-----------|----------------|---------------|
| **Name** | Abhi (अभि) | Abhi (अभि) |
| **Voice** | Neural TTS - Indian English Male | Neural TTS - Indian English Male |
| **Languages** | English | English, Hindi |
| **GCP Project** | N/A | abhavtech-wxcc-ai |
| **GCP Region** | N/A | asia-south1 (Mumbai) |
| **Intents** | 5 simple | 10 complex |
| **Integration** | Native WxCC | Virtual Agent V2 node + CCAI Connector |

### 8.3 Intent Distribution (15 Total)

| Intent | Platform | Channels | Complexity |
|--------|----------|----------|------------|
| greeting.hello | Both | All | Low |
| hours.location | Webex AI Agent | Voice | Low |
| callback.request | Webex AI Agent | Voice | Low |
| feedback.survey | Webex AI Agent | Voice | Low |
| agent.handoff | Both | All | Low |
| order.status | Dialogflow CX | All | Medium |
| order.track | Dialogflow CX | All | Medium |
| product.inquiry | Dialogflow CX | All | Medium |
| product.pricing | Dialogflow CX | All | Medium |
| account.balance | Dialogflow CX | All | Medium |
| account.info | Dialogflow CX | All | Medium |
| support.general | Dialogflow CX | All | Medium |
| support.troubleshoot | Dialogflow CX | All | High |
| billing.inquiry | Dialogflow CX | All | Medium |
| fallback.default | Both | All | Low |

### 8.4 Containment Targets

| Phase | Timeline | Target | Notes |
|-------|----------|--------|-------|
| Phase 2B Launch | Month 1 | 25% | Limited intents, conservative routing |
| Optimization | Month 3 | 35% | Expanded intents, tuning |
| Mature State | Month 6 | 45% | Full coverage |
| Advanced | Month 12 | 50%+ | Continuous learning |

---

## 9. USER PROFILES (4 TOTAL)

| Profile | Count | Multimedia | Permissions |
|---------|-------|------------|-------------|
| Standard_Agent | 100 | Voice only (1 call) | Basic agent functions |
| Premium_Agent | 75 | Voice + 3 chats + 5 emails | Agent Assist, digital channels |
| Supervisor | 10 | Full multimedia | Monitor, whisper, barge, reports |
| Admin | 5 | Optional | Full configuration access |

---

## 10. COMPLIANCE BY REGION

| Region | Data Center | Recording Retention | Key Regulations |
|--------|-------------|---------------------|-----------------|
| India | India DC | 365 days (OSP) | DoT/TRAI toll bypass, OSP |
| UK | UK DC | 180 days | UK GDPR, OFCOM |
| EU | EU DC (Frankfurt) | 180 days | EU GDPR, BSI C5 |
| Americas | US DC | 90 days | State regulations |

**Recording:** 100% all calls | Consent announcement required | PCI auto-pause on Billing queue

**AI Data Processing:** Dialogflow CX processes in asia-south1 (Mumbai) for India compliance

---

## 11. CURRENT STATE METRICS (UCCX BASELINE)

| Metric | Current (UCCX) | Phase 2A Target | Phase 2B Target (AI) |
|--------|----------------|-----------------|----------------------|
| Daily Call Volume | 3,800 | 4,000 | 4,500+ |
| Service Level (30s) | 72% | 80% | 85% |
| AHT | 7.5 min | 6.5 min | 5.5 min |
| FCR | 68% | 75% | 82% |
| Abandonment | 8.5% | 6% | 4% |
| CSAT | 3.8/5 | 4.0/5 | 4.3/5 |
| IVR Containment | 12% | 15% | 35%+ (AI) |

---

## 12. INFRASTRUCTURE INTEGRATION

| System | Integration Type | Purpose | Phase |
|--------|------------------|---------|-------|
| CUCM 14.0 | CTI (decommissioned) | Legacy voice platform | Sunset |
| Webex Calling | Native | PSTN termination | 2A |
| Salesforce | OAuth/REST API | CRM integration | 2A |
| Azure AD | SAML SSO | Authentication | 2A |
| Google Cloud | Service Account | Dialogflow CX | 2B |
| SD-WAN | Network | ABV-SDWAN-2024 | 2A |
| DNA Center | Network | ABV-SDA-ISE-2025 | 2A |
| Order Management API | REST/Webhook | Order status lookups | 2B |
| Billing System API | REST/Webhook | Account/payment queries | 2B |

---

## 13. AGENT ASSIST CONFIGURATION (PHASE 2B)

| Feature | Status | Configuration |
|---------|--------|---------------|
| Context Summaries | Enabled | Auto-generate on transfer |
| Suggested Responses | Enabled | Top 3 suggestions |
| Sentiment Analysis | Enabled | Real-time display |
| Knowledge Base | Enabled | Abhavtech KB (to be created) |
| Auto Wrap-Up | Enabled | AI-generated disposition |
| Next Best Action | Phase 3 | Requires historical data |

---

## 14. KNOWLEDGE BASE REQUIREMENTS (PHASE 2B)

| Category | Articles | Source | Priority |
|----------|----------|--------|----------|
| Product FAQs | 50 | Product documentation | High |
| Troubleshooting Guides | 30 | Support team knowledge | High |
| Policy & Procedures | 20 | Internal documentation | Medium |
| Billing FAQs | 15 | Finance team | Medium |
| Company Information | 10 | Marketing | Low |
| **TOTAL** | **125** | | |

**Database Platform:** PostgreSQL (to be created for Agent Assist and VA fulfillment)

---

## CRITICAL VALIDATION CHECKLIST

### Phase 2A (Baseline) Validation
- [ ] **175 agents** (150 voice + 25 digital)
- [ ] **6 Entry Points**
- [ ] **10 Queues**
- [ ] **18 Skills**
- [ ] **9 Flows**
- [ ] **8 Teams**
- [ ] **100 Standard + 75 Premium + 10 Supervisor licenses**

### Phase 2B (AI Enhancement) Validation
- [ ] **13 Queues** (10 baseline + 3 AI)
- [ ] **22 Skills** (18 baseline + 4 AI)
- [ ] **11 Flows** (9 baseline + 2 new, 5 modified)
- [ ] **Virtual Agent "Abhi"** deployed on BOTH platforms
- [ ] **Webex AI Agent** for simple voice intents (5)
- [ ] **Dialogflow CX** for complex conversations (10)
- [ ] **GCP Project:** abhavtech-wxcc-ai in asia-south1
- [ ] **Agent Assist** enabled for Premium agents
- [ ] **Knowledge Base** populated (125 articles minimum)

---

## DOCUMENT CROSS-REFERENCES

| Chapter | Content | Status |
|---------|---------|--------|
| Chapter 1 | Discovery & Current State | [OK] Complete |
| Chapter 2 | Webex Calling Design | [OK] Complete |
| Chapter 3 | WxCC Design - Phase 2A Baseline | [OK] Complete v2.0 |
| Chapter 4 | Security & Compliance | [OK] Complete |
| Chapter 5 | Network & Infrastructure | [OK] Complete |
| Chapter 6 | WxCC Implementation | [OK] Complete v3.0 |
| Chapter 7 | Migration Execution | [OK] Complete |
| Chapter 8 | Operations & Support | [OK] Complete |
| Chapter 9 | AI Features Strategic Roadmap | [OK] Complete |
| Chapter 10 | AI Integration & Implementation | 📋 In Progress |

---

## QUICK REFERENCE: PHASE 2A vs 2B

| Component | Phase 2A (Baseline) | Phase 2B (AI) | Delta |
|-----------|---------------------|---------------|-------|
| Entry Points | 6 | 6 | 0 |
| Queues | 10 | 13 | +3 |
| Skills | 18 | 22 | +4 |
| Flows | 9 | 11 (+ 5 modified) | +2 new |
| Teams | 8 | 8 | 0 |
| Virtual Agent | Not deployed | Deployed (hybrid) | New |
| Agent Assist | Not enabled | Enabled | New |
| Knowledge Base | N/A | 125 articles | New |
| IVR Type | DTMF menus | AI + DTMF fallback | Enhanced |

---

*© 2026 Abhavtech.com - Master Reference Card v2.0*  
*For Phase 2A baseline: Reference Chapter 3*  
*For Phase 2B AI enhancement: Reference Chapters 9-10*
