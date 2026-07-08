# UCCX to Webex Contact Center Migration Master Checklist
## Abhavtech Enterprise Collaboration Transformation - Phase 2
### On-Premises UCCX to Cloud Webex Contact Center | Multi-Channel Digital Platform

---

## Document Purpose
This master checklist provides a comprehensive roadmap for migrating from on-premises Cisco Unified Contact Center Express (UCCX) to cloud-based Webex Contact Center (WxCC). Use this as a sequential guide to ensure all critical design, implementation, migration, and operations activities are completed for a successful contact center transformation.

**Target Architecture:**
- 4 Contact Center Sites (Mumbai, Chennai, London, New Jersey)
- 175 Contact Center Agents (150 voice + 25 digital)
- 10 Queues with Skill-Based Routing (18 skills)
- 9 IVR Flows migrated from UCCX scripts
- Hybrid AI Platform: Webex AI Agent + Google Dialogflow CX
- Integration: Salesforce CRM, WFO Platform, Analytics

**Migration Phases:**
- **Phase 2A (Current):** Baseline UCCX-to-WxCC Migration (Feature Parity)
- **Phase 2B (Planned):** AI Enhancement with Virtual Agent "Abhi"
- **Phase 3 (Future):** Predictive Routing & Advanced Analytics

**Software & Platform Versions:**
- Webex Contact Center: Latest Cloud Platform (India Data Center)
- Current UCCX: 12.5(1)SU2
- Webex AI Agent: Latest (Phase 2B)
- Google Dialogflow CX: Latest Enterprise Edition (Phase 2B)
- Webex App: Latest (Agent Desktop)

**CRITICAL DEPENDENCY:**
- [!] ï¸ **Phase 1 (CUCM-to-Webex Calling) MUST be complete before starting Phase 2**
- [!] ï¸ **All 175 CC agents must be migrated to Webex Calling and stable for 48+ hours**
- [!] ï¸ **UCCX requires CUCM for CTI connectivity - no parallel operation possible**
- [!] ï¸ **This is a BIG BANG cutover for contact center operations**

---

## Phase 1: Prerequisites & Phase 1 Dependency

### 1.1 Phase 1 CUCM Migration Dependency Validation
- [ ] **CRITICAL: Verify all 175 CC agents migrated to Webex Calling**
  - [ ] Batch 5 migration complete (CUCM-Webex Calling Checklist Phase 5.5)
  - [ ] All agents can make/receive calls via Webex Calling
  - [ ] Agent desk phones registered to Webex Calling
  - [ ] Webex App deployed to all agent desktops
  - [ ] 48-hour stability confirmed for all CC agents
  - [ ] Zero P1/P2 issues open from Batch 5 migration
  
- [ ] **CRITICAL: Validate UCCX-CUCM CTI Dependency**
  - [ ] Confirm UCCX still operational on CUCM (not decommissioned yet)
  - [ ] Understand: Once agents move to Webex Calling, they cannot receive UCCX calls
  - [ ] Understand: WxCC cutover is BIG BANG - no phased approach possible
  - [ ] Rollback plan = Full stack rollback (Webex Calling -> CUCM -> UCCX)
  
- [ ] **Phase 1 Stability Gate**
  - [ ] All 3,200 enterprise users stable on Webex Calling
  - [ ] PSTN connectivity validated (Local Gateway India + CCPP EMEA/US)
  - [ ] SD-WAN QoS validated (ABV-SDWAN-2024)
  - [ ] No active issues impacting voice quality
  - [ ] Business sign-off obtained for Phase 2 start

### 1.2 UCCX Current State Assessment
- [ ] Document UCCX cluster architecture (HA pair)
- [ ] Inventory UCCX server specifications and versions
- [ ] Document UCCX license inventory
- [ ] Export complete agent inventory (175 agents)
- [ ] Export skill inventory (8 current skills)
- [ ] Export CSQ (Contact Service Queue) configurations (6 CSQs)
- [ ] Export IVR script inventory (9 scripts)
- [ ] Document audio prompt library (87 prompts)
- [ ] Export historical reporting data
- [ ] Document supervisor configurations

### 1.3 Agent & Queue Inventory
- [ ] Export agent distribution per site
  - [ ] Mumbai: 120 agents (100 voice + 20 digital)
  - [ ] Chennai: 30 agents (25 voice + 5 digital)
  - [ ] London: 15 agents (voice only)
  - [ ] New Jersey: 10 agents (voice only)
  
- [ ] Document agent skill assignments
- [ ] Export agent team assignments
- [ ] Document supervisor-to-agent ratios
- [ ] Export agent schedules and shift patterns
- [ ] Document agent extension assignments
- [ ] Export agent profiles and permissions
- [ ] Document agent desktop configurations

### 1.4 IVR & Call Flow Analysis
- [ ] Export all 9 UCCX scripts (.aef files)
  - [ ] MainMenu_EN.aef
  - [ ] MainMenu_HI.aef
  - [ ] SalesQueue.aef
  - [ ] SupportQueue.aef
  - [ ] BillingQueue.aef
  - [ ] TechSupport.aef
  - [ ] AfterHours.aef
  - [ ] Callback.aef
  - [ ] Survey.aef
  
- [ ] Document script complexity levels
- [ ] Identify custom Java steps and extensions
- [ ] Document HTTP/HTTPS integrations in scripts
- [ ] Identify database lookups in scripts
- [ ] Export all audio prompts (62 EN + 25 HI)
- [ ] Document TTS usage
- [ ] Map UCCX steps to WxCC Flow Designer nodes
- [ ] Identify migration gaps and workarounds

### 1.5 Integration Assessment
- [ ] Document Salesforce CRM integration (CTI pop, screen pop)
- [ ] Assess Finesse desktop layout and gadgets
- [ ] Document outbound dialing integration (if applicable)
- [ ] Assess wallboard and real-time display integration
- [ ] Document recording system integration (Verint, NICE)
- [ ] Assess WFM (Workforce Management) integration
- [ ] Document chat widget integration (web, mobile)
- [ ] Assess email integration
- [ ] Identify third-party API integrations
- [ ] Document reporting and analytics integrations

### 1.6 Reporting & Analytics Requirements
- [ ] Document current real-time reporting requirements
- [ ] Export historical reporting requirements
- [ ] Identify custom reports and dashboards
- [ ] Document KPI tracking requirements
- [ ] Export SLA monitoring requirements
- [ ] Document agent performance metrics
- [ ] Assess supervisor reporting needs
- [ ] Document executive dashboard requirements
- [ ] Identify compliance reporting requirements
- [ ] Export data retention requirements

### 1.7 Compliance & Recording Requirements
- [ ] Document call recording requirements (100% all calls)
- [ ] Assess PCI-DSS compliance for payment card data
  - [ ] Billing queue: Auto-pause recording during card entry
  - [ ] DTMF masking requirements
  - [ ] Secure payment processing workflow
  
- [ ] Document consent requirements per region
  - [ ] India: Pre-call announcement + opt-out
  - [ ] EMEA: GDPR consent + data residency
  - [ ] Americas: State-specific consent laws
  
- [ ] Document data residency requirements (India DC)
- [ ] Export audit trail requirements
- [ ] Document data retention policies (7 years)
- [ ] Assess emergency services recording requirements
- [ ] Export compliance evidence requirements

### 1.8 Network & Infrastructure Readiness
- [ ] Validate agent desktop network connectivity
- [ ] Verify agent workstation specifications
  - [ ] CPU: Minimum dual-core
  - [ ] RAM: Minimum 8GB
  - [ ] Browser: Chrome/Edge latest
  - [ ] Webex App: Latest version installed
  
- [ ] Validate bandwidth per agent desk (100 kbps voice + 50 kbps screen share)
- [ ] Verify firewall rules for WxCC (ports 443, 5062, 8934-8947)
- [ ] Validate DNS resolution for Webex services
- [ ] Test agent internet connectivity
- [ ] Validate SD-WAN QoS for CC traffic
- [ ] Test latency and jitter to India DC (<150ms, <30ms)
- [ ] Document backup connectivity options

### 1.9 Business Requirements & Success Criteria
- [ ] Define migration timeline and business constraints
- [ ] Identify 24x7 contact center blackout dates
- [ ] Document feature parity requirements (Phase 2A baseline)
- [ ] Define AI enhancement requirements (Phase 2B future)
- [ ] Establish success criteria and KPIs
  - [ ] Call abandonment rate <5%
  - [ ] Average speed to answer <30s for sales
  - [ ] Service level >90% within SLA
  - [ ] First call resolution >70%
  
- [ ] Define rollback thresholds
- [ ] Document training requirements (agents + supervisors)
- [ ] Define hypercare support model
- [ ] Establish change management process

### 1.10 Risk Assessment & Mitigation
- [ ] Identify migration risks
  - [ ] BIG BANG cutover risk (no parallel operation)
  - [ ] Agent adoption risk
  - [ ] Integration failure risk
  - [ ] Performance degradation risk
  - [ ] 24x7 operational impact risk
  
- [ ] Document mitigation strategies
  - [ ] Extensive UAT in sandbox environment
  - [ ] Agent training completion before cutover
  - [ ] Weekend cutover to minimize business impact
  - [ ] 24/7 hypercare support for 2 weeks
  - [ ] Rollback plan to Phase 1 (if critical failure)
  
- [ ] Define rollback criteria and decision authority
- [ ] Document business continuity plan
- [ ] Identify vendor escalation paths

---

## Phase 2: Webex Contact Center Design (Phase 2A - Baseline)

### 2.1 WxCC Architecture Design
- [ ] Design multi-site WxCC deployment
  - [ ] Mumbai HQ: Primary site (120 agents)
  - [ ] Chennai: Secondary site (30 agents)
  - [ ] London: EMEA site (15 agents)
  - [ ] New Jersey: Americas site (10 agents)
  
- [ ] Select data center location (India DC for data residency)
- [ ] Design tenant structure (single tenant, multi-site)
- [ ] Plan licensing allocation
  - [ ] 100 Standard Agent licenses (voice-only)
  - [ ] 75 Premium Agent licenses (voice + digital)
  - [ ] 10 Supervisor licenses
  - [ ] 175 WFO Recording licenses
  - [ ] 50 WFO QM licenses
  - [ ] 175 WFO WFM licenses
  
- [ ] Design agent desktop architecture (Webex App)
- [ ] Plan supervisor desktop architecture
- [ ] Document redundancy and failover strategy

### 2.2 Queue Design (10 Queues - Phase 2A)
- [ ] Design queue hierarchy and routing strategy
  
  **Voice Queues (8):**
  - [ ] Sales_India_Queue (SL: 30s)
  - [ ] Sales_EMEA_Queue (SL: 30s)
  - [ ] Sales_Americas_Queue (SL: 30s)
  - [ ] Support_India_Queue (SL: 45s)
  - [ ] Support_EMEA_Queue (SL: 45s)
  - [ ] Support_Americas_Queue (SL: 45s)
  - [ ] Billing_Queue (SL: 60s)
  - [ ] TechSupport_Queue (SL: 45s)
  
  **Digital Queues (2):**
  - [ ] Digital_Chat_Queue (SL: 15s)
  - [ ] Digital_Email_Queue (SL: 4hr)
  
- [ ] Map UCCX CSQs to WxCC queues
- [ ] Design queue routing strategies
- [ ] Configure service level objectives per queue
- [ ] Design queue treatment (music, announcements)
- [ ] Configure queue callback options
- [ ] Design queue priority levels
- [ ] Configure maximum queue wait times
- [ ] Document queue overflow handling

### 2.3 Skills Design (18 Skills - Phase 2A)
- [ ] Design skill taxonomy
  
  **Functional Skills (5):**
  - [ ] Sales (Boolean) - 65 agents
  - [ ] Support (Boolean) - 55 agents
  - [ ] Billing (Boolean) - 15 agents
  - [ ] TechnicalSupport (Boolean) - 15 agents
  - [ ] Digital_Channels (Boolean) - 25 agents
  
  **Language Skills (4):**
  - [ ] English (Proficiency 1-10) - 175 agents
  - [ ] Hindi (Proficiency 1-10) - 80 agents
  - [ ] Tamil (Proficiency 1-10) - 15 agents (Phase 3)
  - [ ] German (Proficiency 1-10) - 5 agents (Phase 3)
  
  **Regional Skills (3):**
  - [ ] Region_India (Boolean) - 150 agents
  - [ ] Region_EMEA (Boolean) - 15 agents
  - [ ] Region_Americas (Boolean) - 10 agents
  
  **Product Skills (3):**
  - [ ] ProductA_Expert (Proficiency 1-10) - 8 agents
  - [ ] ProductB_Expert (Proficiency 1-10) - 7 agents
  - [ ] ProductC_Expert (Proficiency 1-10) - 5 agents
  
  **Special Skills (3):**
  - [ ] VIP_Handler (Boolean) - 10 agents
  - [ ] Escalation_Handler (Boolean) - 5 agents
  - [ ] Callback_Qualified (Boolean) - 50 agents
  
- [ ] Define skill proficiency levels (1-10 scale)
- [ ] Design skill-based routing logic
- [ ] Create skill profiles (12 profiles)
- [ ] Map agents to skills

### 2.4 Team Design (8 Teams)
- [ ] Design team structure
  - [ ] India_Sales_Team (45 agents, Supervisor: Priya Sharma)
  - [ ] India_Support_Team (40 agents, Supervisor: Raj Kumar)
  - [ ] India_TechSupport (15 agents, Supervisor: Amit Verma)
  - [ ] India_Billing_Team (10 agents, Supervisor: Neha Gupta)
  - [ ] India_Digital_Team (10 agents, Supervisor: Anita Singh)
  - [ ] EMEA_Team (15 agents, Supervisor: James Wilson)
  - [ ] Americas_Team (10 agents, Supervisor: Sarah Johnson)
  - [ ] Supervisor_Team (10 supervisors, Manager: Vikram Patel)
  
- [ ] Assign agents to teams
- [ ] Assign supervisors to teams
- [ ] Configure team permissions
- [ ] Design team-based reporting
- [ ] Document team escalation procedures

### 2.5 Entry Point Design (6 Entry Points)
- [ ] Design entry point architecture
  
  **Voice Entry Points (4):**
  - [ ] EP-01: India_Main_Voice_EP
    - [ ] Dial Numbers: 1800-266-1000, +91-22-4961-1000
    - [ ] Flow: India_MainMenu_Flow_v1
    - [ ] Language: English + Hindi
  
  - [ ] EP-02: India_Sales_Direct_EP
    - [ ] Dial Number: 1800-266-1001
    - [ ] Flow: India_Sales_Direct_Flow_v1
    - [ ] Language: English + Hindi
  
  - [ ] EP-03: EMEA_Main_Voice_EP
    - [ ] Dial Number: +44-20-XXXX-XXXX
    - [ ] Flow: EMEA_MainMenu_Flow_v1
    - [ ] Language: English
  
  - [ ] EP-04: Americas_Main_Voice_EP
    - [ ] Dial Number: +1-201-XXX-XXXX
    - [ ] Flow: Americas_MainMenu_Flow_v1
    - [ ] Language: English
  
  **Digital Entry Points (2):**
  - [ ] EP-05: Global_Chat_EP
    - [ ] Channels: Web widget, WhatsApp
    - [ ] Flow: Digital_Chat_Flow_v1
    - [ ] Languages: English, Hindi
  
  - [ ] EP-06: Global_Email_EP
    - [ ] Email: support@abhavtech.com
    - [ ] Flow: Digital_Email_Flow_v1
    - [ ] Languages: English, Hindi
  
- [ ] Configure entry point routing rules
- [ ] Design entry point treatment
- [ ] Configure entry point business hours
- [ ] Design overflow handling per entry point

### 2.6 IVR Flow Design (9 Flows - Phase 2A Baseline)
- [ ] **Flow 1: India_MainMenu_Flow_v1**
  - [ ] Migrate from UCCX: MainMenu_EN.aef + MainMenu_HI.aef (merged)
  - [ ] Design flow structure (Greeting -> Language Selection -> Main Menu -> Routing)
  - [ ] DTMF menu options (Press 1: Sales, 2: Support, 3: Billing, 4: Tech, 0: Operator)
  - [ ] Configure queue routing per selection
  - [ ] Design timeout and retry handling
  - [ ] Configure after-hours treatment
  - [ ] **Phase 2B: Add Virtual Agent V2 node before DTMF menu**
  
- [ ] **Flow 2: India_Sales_Direct_Flow_v1**
  - [ ] Design direct sales routing (no menu)
  - [ ] Configure VIP detection and priority routing
  - [ ] Design callback offer if queue full
  
- [ ] **Flow 3: EMEA_MainMenu_Flow_v1**
  - [ ] Migrate from UCCX: EMEA regional menu
  - [ ] English-only flow
  - [ ] Configure EMEA-specific routing
  - [ ] **Phase 2B: Add Webex AI Agent node**
  
- [ ] **Flow 4: Americas_MainMenu_Flow_v1**
  - [ ] Migrate from UCCX: Americas regional menu
  - [ ] English-only flow
  - [ ] Configure Americas-specific routing
  - [ ] **Phase 2B: Add Webex AI Agent node**
  
- [ ] **Flow 5: Sales_QueueTreatment_v1**
  - [ ] Migrate from UCCX: SalesQueue.aef
  - [ ] Design queue treatment (music, periodic announcements)
  - [ ] Configure estimated wait time (EWT) announcements
  - [ ] Design callback offer after threshold wait time
  
- [ ] **Flow 6: Support_QueueTreatment_v1**
  - [ ] Migrate from UCCX: SupportQueue.aef
  - [ ] Design queue treatment with support-specific messages
  - [ ] Configure self-service offer while waiting
  - [ ] **Phase 2B: Add self-service VA offer**
  
- [ ] **Flow 7: Billing_QueueTreatment_v1**
  - [ ] Migrate from UCCX: BillingQueue.aef
  - [ ] Design queue treatment with billing-specific messages
  - [ ] Configure PCI-DSS compliant payment flow
  - [ ] Design auto-pause recording for card entry
  
- [ ] **Flow 8: TechSupport_Flow_v1**
  - [ ] Migrate from UCCX: TechSupport.aef
  - [ ] Design technical support routing
  - [ ] Configure product-based routing (ProductA/B/C)
  - [ ] Design escalation paths
  
- [ ] **Flow 9: AfterHours_Subflow_v1**
  - [ ] Migrate from UCCX: AfterHours.aef
  - [ ] Design after-hours treatment per region
  - [ ] Configure voicemail option
  - [ ] Design callback scheduling option
  
- [ ] **Additional Flows:**
  - [ ] Callback_Flow_v1 (Migrate: Callback.aef)
  - [ ] Survey_PostCall_v1 (Migrate: Survey.aef)
  - [ ] Digital_Chat_Flow_v1 (New for digital channels)
  - [ ] Digital_Email_Flow_v1 (New for email routing)

### 2.7 Audio Prompts Migration
- [ ] Export all 87 audio prompts from UCCX
  - [ ] 62 English prompts
  - [ ] 25 Hindi prompts
  
- [ ] Categorize prompts by usage
  - [ ] Greeting prompts
  - [ ] Menu prompts
  - [ ] Queue treatment prompts
  - [ ] Error handling prompts
  - [ ] After-hours prompts
  
- [ ] Convert prompts to WxCC format (8kHz WAV)
- [ ] Upload prompts to WxCC prompt library
- [ ] Test prompt playback quality
- [ ] Map prompts to flows
- [ ] Document prompt versioning strategy
- [ ] Plan for TTS (Text-to-Speech) usage
- [ ] Design multi-language prompt structure
- [ ] Configure dynamic prompts (EWT, date/time)

### 2.8 Integration Design
- [ ] **Salesforce CRM Integration**
  - [ ] Design Salesforce connector configuration
  - [ ] Configure CTI screen pop
  - [ ] Design click-to-dial integration
  - [ ] Configure case creation automation
  - [ ] Design activity logging
  - [ ] Test contact history synchronization
  
- [ ] **WFO Recording Integration**
  - [ ] Design recording platform connection
  - [ ] Configure 100% call recording
  - [ ] Design PCI-DSS pause/resume for Billing queue
  - [ ] Configure metadata tagging
  - [ ] Design recording retrieval workflow
  - [ ] Configure retention policies (7 years)
  
- [ ] **WFO Quality Management (QM)**
  - [ ] Design evaluation form templates
  - [ ] Configure agent scoring criteria
  - [ ] Design calibration workflows
  - [ ] Configure coaching workflows
  - [ ] Plan evaluation sampling (50 licenses)
  
- [ ] **WFO Workforce Management (WFM)**
  - [ ] Design shift scheduling templates
  - [ ] Configure forecasting parameters
  - [ ] Design adherence monitoring
  - [ ] Configure intraday management
  - [ ] Plan shrinkage and occupancy tracking
  
- [ ] **Analytics & Reporting**
  - [ ] Design real-time dashboards
  - [ ] Configure historical reports
  - [ ] Design custom analytics views
  - [ ] Configure data export schedules
  - [ ] Plan API-based reporting integration

### 2.9 Agent Desktop Design
- [ ] Design Webex App agent desktop layout
- [ ] Configure auxiliary codes (break, lunch, meeting, training)
- [ ] Design screen pop integration (Salesforce)
- [ ] Configure call controls (hold, transfer, conference, warm transfer)
- [ ] Design supervisor assist and barge-in
- [ ] Configure multi-channel handling (voice + digital)
- [ ] Design agent status management
- [ ] Configure desktop notification settings
- [ ] Plan agent productivity tools
- [ ] Design knowledge base integration

### 2.10 Supervisor Desktop Design
- [ ] Design supervisor monitoring dashboards
- [ ] Configure real-time queue monitoring
- [ ] Design agent state monitoring
- [ ] Configure supervisor alert thresholds
- [ ] Design silent monitoring and coaching tools
- [ ] Configure queue management controls
- [ ] Design real-time reporting views
- [ ] Configure supervisor escalation paths
- [ ] Plan wallboard integration
- [ ] Design team performance dashboards

### 2.11 Reporting & Analytics Design
- [ ] Design real-time reporting requirements
  - [ ] Queue statistics (calls waiting, longest wait, abandoned)
  - [ ] Agent statistics (state, call count, handle time)
  - [ ] Service level monitoring per queue
  - [ ] Abandoned call tracking
  
- [ ] Design historical reporting requirements
  - [ ] Daily/weekly/monthly queue reports
  - [ ] Agent performance reports
  - [ ] SLA compliance reports
  - [ ] Trend analysis reports
  
- [ ] Design custom dashboards
  - [ ] Executive dashboard (high-level KPIs)
  - [ ] Operations dashboard (detailed metrics)
  - [ ] Agent performance dashboard
  - [ ] Compliance dashboard
  
- [ ] Configure data retention (13 months online, 7 years archive)
- [ ] Design scheduled report distribution
- [ ] Plan API-based data extraction

### 2.12 Compliance Design
- [ ] **Call Recording Compliance**
  - [ ] Configure 100% call recording (all channels)
  - [ ] Design pre-call announcement (India, EMEA)
  - [ ] Configure opt-out workflow (where required)
  - [ ] Design recording pause for PCI-DSS (Billing)
  - [ ] Configure metadata tagging (agent, queue, timestamp)
  
- [ ] **Data Residency Compliance**
  - [ ] Confirm India DC selection
  - [ ] Validate data storage location
  - [ ] Configure cross-border data transfer controls
  - [ ] Document data processing agreements
  
- [ ] **GDPR Compliance (EMEA)**
  - [ ] Design consent management
  - [ ] Configure data access requests (DSAR)
  - [ ] Design data deletion workflow
  - [ ] Configure audit logging
  
- [ ] **PCI-DSS Compliance (Billing Queue)**
  - [ ] Design auto-pause recording during card entry
  - [ ] Configure DTMF masking
  - [ ] Design secure payment workflow
  - [ ] Plan PCI audit evidence collection

### 2.13 Capacity & Scalability Design
- [ ] Calculate concurrent call capacity per site
  - [ ] Mumbai: 120 agents x 80% occupancy = 96 concurrent
  - [ ] Chennai: 30 agents x 80% occupancy = 24 concurrent
  - [ ] London: 15 agents x 80% occupancy = 12 concurrent
  - [ ] New Jersey: 10 agents x 80% occupancy = 8 concurrent
  
- [ ] Design for peak call volumes
- [ ] Plan for seasonal spikes
- [ ] Design overflow and failover strategies
- [ ] Configure capacity alerts
- [ ] Plan for agent growth (Phase 3)
- [ ] Document scaling procedures
- [ ] Design disaster recovery capacity

### 2.14 Quality of Service Design
- [ ] Integrate with SD-WAN QoS (ABV-SDWAN-2024)
- [ ] Configure DSCP markings for WxCC traffic
- [ ] Design media path optimization
- [ ] Configure jitter buffer settings
- [ ] Plan bandwidth reservation per agent
- [ ] Design network monitoring for CC traffic
- [ ] Configure call admission control
- [ ] Document QoS troubleshooting procedures

### 2.15 Security Design
- [ ] Design authentication model (SSO with Azure AD)
- [ ] Configure MFA for all agent accounts
- [ ] Design role-based access control (RBAC)
  - [ ] Agent role
  - [ ] Supervisor role
  - [ ] Administrator role
  - [ ] Analyst role
  
- [ ] Configure session timeout policies
- [ ] Design audit logging strategy
- [ ] Configure fraud detection alerts
- [ ] Design secure API access for integrations
- [ ] Plan security compliance audits
- [ ] Document security incident response procedures

---

## Phase 3: Phase 2B AI Enhancement Design (Planned)

### 3.1 Hybrid AI Architecture Design
- [ ] Design hybrid AI platform
  - [ ] Webex AI Agent: Voice IVR (simple intents)
  - [ ] Google Dialogflow CX: Complex conversations (chat, escalations)
  
- [ ] Define AI scope and use cases
  - [ ] Simple FAQs and navigation (Webex AI Agent)
  - [ ] Complex troubleshooting (Dialogflow CX)
  - [ ] Appointment scheduling (Dialogflow CX)
  - [ ] Order status lookup (Dialogflow CX)
  
- [ ] Design intent taxonomy (30+ intents)
- [ ] Plan training data requirements
- [ ] Design escalation triggers to human agents
- [ ] Configure sentiment analysis for priority routing
- [ ] Design context handoff to agents

### 3.2 Virtual Agent "Abhi" Design
- [ ] Design virtual agent personality
  - [ ] Name: Abhi
  - [ ] Tone: Friendly, professional, helpful
  - [ ] Languages: English, Hindi
  
- [ ] Configure Webex AI Agent for voice
  - [ ] Intent recognition
  - [ ] Entity extraction
  - [ ] Dialogue management
  
- [ ] Configure Dialogflow CX for digital
  - [ ] Chat widget integration (web, WhatsApp)
  - [ ] Rich messaging support
  - [ ] Multi-turn conversations
  
- [ ] Design self-service workflows
- [ ] Configure FAQ knowledge base
- [ ] Design proactive suggestions
- [ ] Plan AI performance monitoring

### 3.3 AI-Enhanced Queue Design (Phase 2B Additions)
- [ ] **VA_Escalation_Queue (SL: 20s)**
  - [ ] Priority queue for VA escalations with context
  - [ ] Skill required: AI_Escalation_Handler
  
- [ ] **Sentiment_Priority_Queue (SL: 15s)**
  - [ ] Expedited queue for negative sentiment
  - [ ] Skill required: Sentiment_Recovery
  
- [ ] **Digital_VA_Escalation_Queue (SL: 30s)**
  - [ ] Chat/WhatsApp escalations from Dialogflow CX
  - [ ] Skills required: AI_Escalation_Handler + Digital_Channels

### 3.4 AI-Enhanced Skills Design (Phase 2B Additions)
- [ ] **AI_Escalation_Handler (Boolean) - 30 agents**
  - [ ] Trained on context pickup from VA
  - [ ] Understand VA conversation history
  
- [ ] **Complex_Query_Handler (Boolean) - 20 agents**
  - [ ] Multi-system queries VA cannot resolve
  - [ ] Advanced troubleshooting skills
  
- [ ] **Sentiment_Recovery (Boolean) - 15 agents**
  - [ ] Handle negative sentiment escalations
  - [ ] De-escalation training required
  
- [ ] **Digital_Advanced (Proficiency 1-10) - 15 agents**
  - [ ] Advanced digital channel handling
  - [ ] Rich messaging expertise

### 3.5 AI-Enhanced Flow Modifications (Phase 2B)
- [ ] **India_MainMenu_Flow_v1 (MODIFIED)**
  - [ ] Add Virtual Agent V2 node before DTMF menu
  - [ ] Intent detection first, DTMF fallback
  - [ ] Context capture for agent handoff
  
- [ ] **EMEA_MainMenu_Flow_v1 (MODIFIED)**
  - [ ] Add Webex AI Agent node (English only)
  - [ ] Simpler intent handling for EMEA
  
- [ ] **Americas_MainMenu_Flow_v1 (MODIFIED)**
  - [ ] Add Webex AI Agent node (English only)
  - [ ] Simpler intent handling for Americas
  
- [ ] **Support_QueueTreatment_v1 (MODIFIED)**
  - [ ] Add self-service offer while waiting (VA)
  - [ ] Allow callers to opt-in to VA assistance
  
- [ ] **Digital_Chat_Flow_v1 (MAJOR CHANGE)**
  - [ ] Dialogflow CX integration
  - [ ] Full conversational AI
  - [ ] Rich messaging support
  
- [ ] **VA_Containment_Flow_v1 (NEW)**
  - [ ] End-to-end contained interactions (no agent)
  - [ ] Track containment rate
  
- [ ] **AI_Escalation_Subflow_v1 (NEW)**
  - [ ] Context handoff from VA to human agent
  - [ ] Preserve conversation history

### 3.6 Agent Assist Design (Phase 2B)
- [ ] Design real-time transcription
- [ ] Configure AI-powered suggestions
- [ ] Design knowledge article recommendations
- [ ] Configure sentiment analysis alerts
- [ ] Design compliance monitoring (keywords)
- [ ] Configure after-call work automation
- [ ] Design conversation summarization
- [ ] Plan Agent Assist rollout per team

### 3.7 AI Licensing (Phase 2B)
- [ ] Procure Webex AI Agent license (1 virtual agent)
- [ ] Procure Google CCAI license (Dialogflow CX Enterprise)
- [ ] Procure Agent Assist licenses (if separate)
- [ ] Plan AI usage monitoring
- [ ] Configure AI usage alerts

---

## Phase 4: Implementation & Configuration (Phase 2A Baseline)

### 4.1 WxCC Tenant Activation
- [ ] Activate WxCC tenant (India DC)
- [ ] Complete organization verification
- [ ] Configure tenant settings
- [ ] Set up administrative access
- [ ] Configure SSO (Azure AD SAML)
- [ ] Set up Multi-Factor Authentication (MFA)
- [ ] Configure security policies
- [ ] Document tenant configuration

### 4.2 Licensing Assignment
- [ ] Import agent list (175 agents)
- [ ] Assign Standard Agent licenses (100 agents)
- [ ] Assign Premium Agent licenses (75 agents)
- [ ] Assign Supervisor licenses (10 supervisors)
- [ ] Assign WFO Recording licenses (175 agents)
- [ ] Assign WFO QM licenses (50 agents)
- [ ] Assign WFO WFM licenses (175 agents)
- [ ] Validate license assignment
- [ ] Configure license usage alerts

### 4.3 Entry Point Configuration
- [ ] Create EP-01: India_Main_Voice_EP
  - [ ] Assign dial numbers: 1800-266-1000, +91-22-4961-1000
  - [ ] Associate flow: India_MainMenu_Flow_v1
  - [ ] Configure language: English + Hindi
  
- [ ] Create EP-02: India_Sales_Direct_EP
  - [ ] Assign dial number: 1800-266-1001
  - [ ] Associate flow: India_Sales_Direct_Flow_v1
  
- [ ] Create EP-03: EMEA_Main_Voice_EP
  - [ ] Assign dial number: +44-20-XXXX-XXXX
  - [ ] Associate flow: EMEA_MainMenu_Flow_v1
  
- [ ] Create EP-04: Americas_Main_Voice_EP
  - [ ] Assign dial number: +1-201-XXX-XXXX
  - [ ] Associate flow: Americas_MainMenu_Flow_v1
  
- [ ] Create EP-05: Global_Chat_EP
  - [ ] Configure web widget integration
  - [ ] Configure WhatsApp integration
  - [ ] Associate flow: Digital_Chat_Flow_v1
  
- [ ] Create EP-06: Global_Email_EP
  - [ ] Configure email: support@abhavtech.com
  - [ ] Associate flow: Digital_Email_Flow_v1
  
- [ ] Test all entry points

### 4.4 Queue Configuration (10 Queues)
- [ ] Create Sales_India_Queue (SL: 30s, Max Wait: 10min)
- [ ] Create Sales_EMEA_Queue (SL: 30s, Max Wait: 10min)
- [ ] Create Sales_Americas_Queue (SL: 30s, Max Wait: 10min)
- [ ] Create Support_India_Queue (SL: 45s, Max Wait: 15min)
- [ ] Create Support_EMEA_Queue (SL: 45s, Max Wait: 15min)
- [ ] Create Support_Americas_Queue (SL: 45s, Max Wait: 15min)
- [ ] Create Billing_Queue (SL: 60s, Max Wait: 20min)
- [ ] Create TechSupport_Queue (SL: 45s, Max Wait: 15min)
- [ ] Create Digital_Chat_Queue (SL: 15s, Max Wait: 5min)
- [ ] Create Digital_Email_Queue (SL: 4hr, Max Wait: 24hr)
- [ ] Configure queue routing strategies
- [ ] Configure queue treatment settings
- [ ] Test queue routing

### 4.5 Skills Configuration (18 Skills)
- [ ] Create Functional Skills (5)
- [ ] Create Language Skills (4)
- [ ] Create Regional Skills (3)
- [ ] Create Product Skills (3)
- [ ] Create Special Skills (3)
- [ ] Configure skill proficiency levels (1-10)
- [ ] Create skill profiles (12 profiles)
- [ ] Validate skill configuration

### 4.6 Team Configuration (8 Teams)
- [ ] Create India_Sales_Team (45 agents)
- [ ] Create India_Support_Team (40 agents)
- [ ] Create India_TechSupport (15 agents)
- [ ] Create India_Billing_Team (10 agents)
- [ ] Create India_Digital_Team (10 agents)
- [ ] Create EMEA_Team (15 agents)
- [ ] Create Americas_Team (10 agents)
- [ ] Create Supervisor_Team (10 supervisors)
- [ ] Assign agents to teams
- [ ] Assign supervisors to teams
- [ ] Configure team permissions
- [ ] Validate team configuration

### 4.7 Agent Provisioning
- [ ] Import 175 agent profiles
- [ ] Assign agent licenses
- [ ] Assign agents to teams
- [ ] Assign skills to agents
- [ ] Configure agent desktop settings
- [ ] Assign Webex Calling extensions
- [ ] Configure agent auxiliary codes
- [ ] Provision Webex App for all agents
- [ ] Test agent login and basic functions
- [ ] Validate agent profile configuration

### 4.8 IVR Flow Development (9 Flows)
- [ ] **Build Flow 1: India_MainMenu_Flow_v1**
  - [ ] Add greeting prompt node
  - [ ] Add language selection node (English/Hindi)
  - [ ] Add main menu node (DTMF 1-9, 0)
  - [ ] Add queue routing nodes per selection
  - [ ] Add timeout and retry handling
  - [ ] Add after-hours treatment
  - [ ] Test flow end-to-end
  
- [ ] **Build Flow 2: India_Sales_Direct_Flow_v1**
  - [ ] Add greeting prompt
  - [ ] Add VIP detection logic
  - [ ] Add queue routing to Sales_India_Queue
  - [ ] Add callback offer if queue full
  - [ ] Test flow end-to-end
  
- [ ] **Build Flows 3-4: EMEA/Americas_MainMenu_Flow_v1**
  - [ ] Build similar to India flow (English only)
  - [ ] Add region-specific routing
  - [ ] Test flows end-to-end
  
- [ ] **Build Flows 5-7: Queue Treatment Flows**
  - [ ] Add music on hold
  - [ ] Add periodic announcements
  - [ ] Add EWT (Estimated Wait Time) announcements
  - [ ] Add callback offer after threshold
  - [ ] Test flows end-to-end
  
- [ ] **Build Flow 8: TechSupport_Flow_v1**
  - [ ] Add product selection menu
  - [ ] Add skill-based routing (ProductA/B/C)
  - [ ] Add escalation logic
  - [ ] Test flow end-to-end
  
- [ ] **Build Flow 9: AfterHours_Subflow_v1**
  - [ ] Add after-hours greeting per region
  - [ ] Add voicemail option
  - [ ] Add callback scheduling
  - [ ] Test flow end-to-end
  
- [ ] Build Callback_Flow_v1
- [ ] Build Survey_PostCall_v1
- [ ] Build Digital_Chat_Flow_v1
- [ ] Build Digital_Email_Flow_v1
- [ ] Validate all flows in sandbox

### 4.9 Audio Prompts Upload
- [ ] Upload 62 English prompts to WxCC
- [ ] Upload 25 Hindi prompts to WxCC
- [ ] Validate prompt quality (8kHz WAV)
- [ ] Map prompts to flow nodes
- [ ] Test prompt playback in flows
- [ ] Configure dynamic TTS prompts (EWT)
- [ ] Document prompt library structure

### 4.10 Salesforce CRM Integration
- [ ] Install Webex Contact Center connector in Salesforce
- [ ] Configure Salesforce connection in WxCC
- [ ] Configure CTI screen pop rules
- [ ] Configure click-to-dial integration
- [ ] Configure case creation automation
- [ ] Configure activity logging
- [ ] Test screen pop with sample contacts
- [ ] Test click-to-dial functionality
- [ ] Test case creation workflow
- [ ] Validate contact history synchronization

### 4.11 Recording Integration
- [ ] Configure recording platform connection
- [ ] Enable 100% call recording for all channels
- [ ] Configure PCI-DSS pause/resume for Billing_Queue
- [ ] Configure metadata tagging (agent, queue, timestamp)
- [ ] Configure recording retention (7 years)
- [ ] Test recording capture
- [ ] Test recording retrieval
- [ ] Test PCI pause/resume functionality
- [ ] Validate recording compliance

### 4.12 WFO Platform Integration
- [ ] **Quality Management (QM)**
  - [ ] Configure evaluation forms
  - [ ] Configure agent scoring criteria
  - [ ] Configure calibration workflows
  - [ ] Configure coaching workflows
  - [ ] Test evaluation process
  
- [ ] **Workforce Management (WFM)**
  - [ ] Configure shift templates
  - [ ] Configure forecasting parameters
  - [ ] Configure adherence monitoring
  - [ ] Configure intraday management
  - [ ] Test scheduling workflow

### 4.13 Reporting & Analytics Configuration
- [ ] Configure real-time dashboards
  - [ ] Queue statistics dashboard
  - [ ] Agent state dashboard
  - [ ] Service level monitoring
  
- [ ] Configure historical reports
  - [ ] Daily queue performance report
  - [ ] Agent performance report
  - [ ] SLA compliance report
  
- [ ] Configure custom dashboards
  - [ ] Executive dashboard
  - [ ] Operations dashboard
  - [ ] Agent performance dashboard
  - [ ] Compliance dashboard
  
- [ ] Configure scheduled report distribution
- [ ] Test report generation
- [ ] Validate data accuracy

### 4.14 Agent Desktop Configuration
- [ ] Configure Webex App agent desktop layout
- [ ] Configure auxiliary codes (Break, Lunch, Meeting, Training, Away)
- [ ] Configure call controls (Hold, Transfer, Conference, Warm Transfer)
- [ ] Configure screen pop integration (Salesforce)
- [ ] Configure multi-channel handling
- [ ] Configure notification settings
- [ ] Configure knowledge base integration (if applicable)
- [ ] Test agent desktop functionality

### 4.15 Supervisor Desktop Configuration
- [ ] Configure supervisor monitoring dashboards
- [ ] Configure real-time queue monitoring
- [ ] Configure agent state monitoring
- [ ] Configure alert thresholds
- [ ] Configure silent monitoring and coaching
- [ ] Configure queue management controls
- [ ] Configure real-time reporting views
- [ ] Test supervisor desktop functionality

---

## Phase 5: Testing & Validation

### 5.1 Unit Testing (Per Component)
- [ ] Test each entry point individually
- [ ] Test each queue individually
- [ ] Test each flow individually
- [ ] Test each integration point individually
- [ ] Test agent login and profile
- [ ] Test supervisor monitoring
- [ ] Test reporting and analytics
- [ ] Document all test results

### 5.2 Integration Testing
- [ ] Test end-to-end call flow (inbound voice)
  - [ ] Caller dials entry point
  - [ ] IVR plays greeting
  - [ ] Caller navigates menu
  - [ ] Call routed to correct queue
  - [ ] Agent receives call
  - [ ] Salesforce screen pop displays
  - [ ] Agent handles call
  - [ ] Call recording captured
  - [ ] Post-call survey plays
  - [ ] Call data logged correctly
  
- [ ] Test end-to-end chat flow
- [ ] Test end-to-end email flow
- [ ] Test callback functionality
- [ ] Test warm transfer between agents
- [ ] Test supervisor monitoring and barge-in
- [ ] Test after-hours treatment
- [ ] Test overflow and failover scenarios
- [ ] Document all integration test results

### 5.3 Performance Testing
- [ ] Test concurrent call capacity
  - [ ] 50% capacity (88 concurrent calls)
  - [ ] 80% capacity (140 concurrent calls)
  - [ ] 100% capacity (175 concurrent calls)
  
- [ ] Test call quality under load
- [ ] Test queue wait time accuracy
- [ ] Test EWT announcement accuracy
- [ ] Test recording performance under load
- [ ] Test reporting accuracy under load
- [ ] Monitor CPU, memory, network utilization
- [ ] Document performance test results

### 5.4 Failure & Resilience Testing
- [ ] Test agent logout and relogin
- [ ] Test agent network disconnection and recovery
- [ ] Test supervisor monitoring during agent disconnection
- [ ] Test queue overflow handling
- [ ] Test entry point failover (if configured)
- [ ] Test recording system failover
- [ ] Test Salesforce integration failure handling
- [ ] Test after-hours treatment
- [ ] Document failure test results

### 5.5 Compliance Testing
- [ ] Test call recording (100% capture)
- [ ] Test pre-call recording announcement (India, EMEA)
- [ ] Test PCI-DSS pause/resume (Billing queue)
- [ ] Test DTMF masking for card entry
- [ ] Test data residency (confirm India DC)
- [ ] Test recording retention (7 years)
- [ ] Test audit logging
- [ ] Document compliance test results

### 5.6 User Acceptance Testing (UAT)
- [ ] Conduct UAT with 10 pilot agents (5 from each team)
- [ ] Conduct UAT with 2 pilot supervisors
- [ ] Test agent desktop usability
- [ ] Test supervisor desktop usability
- [ ] Test real-world call scenarios
  - [ ] Simple sales call
  - [ ] Complex support call
  - [ ] Billing call with payment
  - [ ] Technical support escalation
  - [ ] Angry customer call
  
- [ ] Test multi-channel handling (voice + chat)
- [ ] Test warm transfer and conference
- [ ] Test supervisor monitoring and coaching
- [ ] Collect UAT feedback
- [ ] Address UAT issues
- [ ] Obtain UAT sign-off

### 5.7 Sandbox Testing (Pre-Production)
- [ ] Provision sandbox WxCC tenant
- [ ] Replicate production configuration in sandbox
- [ ] Conduct full end-to-end testing in sandbox
- [ ] Train pilot agents in sandbox
- [ ] Train supervisors in sandbox
- [ ] Conduct dress rehearsal cutover in sandbox
- [ ] Document all sandbox test results
- [ ] Validate sandbox environment stability

### 5.8 Test Scenario Matrix (20 Scenarios)
Execute all 20 test scenarios per Chapter 6.10.2:
- [ ] TS-01: Basic inbound call routing (Sales)
- [ ] TS-02: Basic inbound call routing (Support)
- [ ] TS-03: Language selection (Hindi IVR)
- [ ] TS-04: Callback request from queue
- [ ] TS-05: Warm transfer between agents
- [ ] TS-06: Conference call (3-way)
- [ ] TS-07: Supervisor silent monitoring
- [ ] TS-08: Supervisor barge-in
- [ ] TS-09: Salesforce screen pop
- [ ] TS-10: Call recording verification
- [ ] TS-11: PCI pause/resume (Billing)
- [ ] TS-12: After-hours treatment
- [ ] TS-13: VIP caller priority routing
- [ ] TS-14: Queue overflow handling
- [ ] TS-15: Skill-based routing (product expert)
- [ ] TS-16: Digital chat routing
- [ ] TS-17: Email routing and response
- [ ] TS-18: Post-call survey
- [ ] TS-19: Agent state changes
- [ ] TS-20: Reporting accuracy (real-time + historical)
- [ ] Document all test results
- [ ] Obtain QA sign-off

---

## Phase 6: Training Program

### 6.1 Training Curriculum Development
- [ ] Develop agent training curriculum
  - [ ] WxCC platform overview
  - [ ] Webex App agent desktop training
  - [ ] Call handling procedures
  - [ ] Multi-channel handling (voice + digital)
  - [ ] Salesforce integration training
  - [ ] Quality and compliance training
  - [ ] Soft skills refresher
  
- [ ] Develop supervisor training curriculum
  - [ ] WxCC supervisor desktop training
  - [ ] Real-time monitoring and coaching
  - [ ] Reporting and analytics training
  - [ ] Team management in WxCC
  - [ ] Escalation procedures
  
- [ ] Develop administrator training curriculum
  - [ ] WxCC administration
  - [ ] Flow Designer training
  - [ ] Reporting and analytics
  - [ ] Integration management
  - [ ] Troubleshooting procedures

### 6.2 Training Materials Development
- [ ] Create agent training slides (PPT)
- [ ] Create supervisor training slides (PPT)
- [ ] Create agent quick reference guides (PDF)
- [ ] Create supervisor quick reference guides (PDF)
- [ ] Record training videos
  - [ ] Agent desktop walkthrough (15 min)
  - [ ] Call handling procedures (20 min)
  - [ ] Salesforce integration (10 min)
  - [ ] Multi-channel handling (15 min)
  - [ ] Supervisor desktop walkthrough (20 min)
  
- [ ] Create hands-on lab exercises
- [ ] Create training assessment quizzes
- [ ] Translate materials to Hindi (if required)

### 6.3 Training Environment Setup
- [ ] Provision training sandbox tenant
- [ ] Configure training users (175 agents + 10 supervisors)
- [ ] Configure training queues and flows
- [ ] Configure training CRM sandbox
- [ ] Set up training call generators (simulated calls)
- [ ] Validate training environment readiness
- [ ] Document training environment access

### 6.4 Wave 1 Training - Chennai (30 Agents)
- [ ] Schedule training sessions (2 weeks before cutover)
- [ ] Conduct agent training (8 hours over 2 days)
  - [ ] Day 1: Platform overview, agent desktop, call handling
  - [ ] Day 2: Multi-channel, Salesforce, hands-on lab
  
- [ ] Conduct supervisor training (4 hours)
  - [ ] Supervisor desktop, monitoring, reporting
  
- [ ] Conduct hands-on lab exercises
- [ ] Administer training assessment
- [ ] Track training completion (target: 100%)
- [ ] Address training feedback
- [ ] Issue training completion certificates

### 6.5 Wave 2 Training - London & New Jersey (25 Agents)
- [ ] Schedule training sessions (2 weeks before cutover)
- [ ] Conduct agent training (8 hours over 2 days)
- [ ] Conduct supervisor training (4 hours)
- [ ] Conduct hands-on lab exercises
- [ ] Administer training assessment
- [ ] Track training completion (target: 100%)
- [ ] Issue training completion certificates

### 6.6 Wave 3 Training - Mumbai HQ (120 Agents)
- [ ] Schedule training sessions in batches (4 weeks before cutover)
  - [ ] Batch A: 30 agents (Week 1)
  - [ ] Batch B: 30 agents (Week 2)
  - [ ] Batch C: 30 agents (Week 3)
  - [ ] Batch D: 30 agents (Week 4)
  
- [ ] Conduct agent training per batch (8 hours over 2 days)
- [ ] Conduct supervisor training (4 hours)
- [ ] Conduct hands-on lab exercises
- [ ] Administer training assessment
- [ ] Track training completion (target: 100%)
- [ ] Issue training completion certificates

### 6.7 Help Desk Training
- [ ] Train help desk staff on WxCC basics (4 hours)
- [ ] Provide WxCC troubleshooting guide
- [ ] Train on common issues and resolutions
- [ ] Configure help desk ticketing system for WxCC
- [ ] Conduct knowledge transfer session
- [ ] Test help desk escalation procedures
- [ ] Document help desk support procedures

### 6.8 Training Completion Tracking
- [ ] Track agent training attendance per wave
- [ ] Track training assessment scores (target: >80%)
- [ ] Identify remedial training needs
- [ ] Schedule refresher training as needed
- [ ] Obtain training sign-off per wave
- [ ] Archive training records

---

## Phase 7: Migration Execution (BIG BANG Cutover)

### 7.1 Pre-Migration Preparation
**Execute T-14 days before cutover:**
- [ ] Validate Phase 1 dependency (all 175 CC agents stable on Webex Calling)
- [ ] Confirm 48-hour stability for CC agents on Webex Calling
- [ ] Validate all Chapter 4 implementation tasks complete (100%)
- [ ] Confirm all 20 test scenarios passed (Phase 5.8)
- [ ] Validate training completion >95% per wave
- [ ] Schedule cutover window (Weekend - Saturday 11pm to Sunday 11am)
- [ ] Send final cutover notification to all stakeholders
- [ ] Activate war room (physical + virtual)
- [ ] Confirm 24/7 support resources available
- [ ] Confirm vendor TAC cases opened (preventive)
- [ ] Validate rollback plan and decision authority

### 7.2 Go/No-Go Decision (T-7 Days)
**Execute final Go/No-Go review 7 days before cutover:**

| Gate | Criteria | Owner | Status |
|------|----------|-------|--------|
| **G1** | Phase 1 CC agents stable 48+ hours | Voice Eng Lead | [ ] |
| **G2** | Chapter 4 implementation 100% complete | WxCC Eng Lead | [ ] |
| **G3** | All 20 test scenarios passed | QA Lead | [ ] |
| **G4** | Agent training >95% complete (Wave 1/2/3) | Training Lead | [ ] |
| **G5** | Cutover runbook signed off | Project Manager | [ ] |
| **G6** | Rollback plan validated | Voice Eng Lead | [ ] |
| **G7** | Business owner approval | CC Operations Mgr | [ ] |
| **G8** | No P1/P2 open defects | QA Lead | [ ] |
| **G9** | Vendor TAC cases opened | Voice Eng Lead | [ ] |
| **G10** | War room resources confirmed | Project Manager | [ ] |

**Decision:** All gates MUST be passed. If any gate fails, delay cutover by 1 week.

### 7.3 Wave 1 Cutover - Chennai (30 Agents)
**Pilot Site - Weekend Cutover (Saturday 11pm - Sunday 11am)**

**Pre-Cutover (T-1 Day - Friday):**
- [ ] Send final reminder to Chennai agents
- [ ] Brief Chennai supervisors on cutover plan
- [ ] Activate war room (Friday 6pm)
- [ ] Conduct pre-cutover checklist review
- [ ] Validate all systems ready
- [ ] Obtain final business sign-off

**Cutover Execution (Saturday 11pm - Sunday 11am):**
- [ ] **Phase 1: UCCX Graceful Shutdown (Sat 11pm - 11:30pm)**
  - [ ] Announce impending outage (repeat every 5 min for 30 min)
  - [ ] Monitor queue for zero calls in queue
  - [ ] Disable new call routing to Chennai CSQs
  - [ ] Wait for all active calls to complete
  - [ ] Disable Chennai agent logins on UCCX
  - [ ] Document final UCCX state (agents logged out, queues empty)
  
- [ ] **Phase 2: WxCC Entry Point Activation (Sat 11:30pm - 12am)**
  - [ ] Activate WxCC entry points for Chennai numbers
  - [ ] Update DNS records (if applicable)
  - [ ] Update PSTN routing to WxCC
  - [ ] Test inbound calls to Chennai entry points
  - [ ] Validate IVR plays correctly
  - [ ] Confirm calls reaching WxCC queues
  
- [ ] **Phase 3: Agent Onboarding (Sun 12am - 2am)**
  - [ ] Chennai agents log into Webex App
  - [ ] Agents set state to "Available"
  - [ ] Supervisors verify all 30 agents logged in
  - [ ] Test call routing to each agent (sample 5 agents)
  - [ ] Validate Salesforce screen pop
  - [ ] Validate call recording
  - [ ] Monitor first 10 calls for quality
  
- [ ] **Phase 4: Monitoring & Stabilization (Sun 2am - 11am)**
  - [ ] Monitor call quality metrics (MOS, latency, jitter)
  - [ ] Monitor queue statistics (ASA, abandonment, SL)
  - [ ] Monitor agent state and call handling
  - [ ] Monitor Salesforce integration
  - [ ] Monitor recording capture
  - [ ] Address any issues immediately
  - [ ] Document all issues and resolutions
  
- [ ] **Phase 5: Go-Live Validation (Sun 11am)**
  - [ ] Verify all 30 Chennai agents operational
  - [ ] Verify call quality acceptable (MOS >4.0)
  - [ ] Verify queue SLA met (>90%)
  - [ ] Verify zero P1/P2 issues
  - [ ] Obtain business sign-off for Wave 1 go-live

**Post-Cutover Hypercare (Sun - Thu - 5 Days):**
- [ ] Provide 24/7 hypercare support
- [ ] Monitor call quality continuously
- [ ] Monitor agent performance
- [ ] Resolve all reported issues (P1 <1hr, P2 <4hr, P3 <24hr)
- [ ] Conduct daily standup with business owner
- [ ] Collect agent feedback daily
- [ ] Document lessons learned
- [ ] Validate 5-day stability before Wave 2

**Wave 1 Success Criteria:**
- [ ] All 30 Chennai agents operational on WxCC
- [ ] Call quality meets baseline (MOS >4.0)
- [ ] Queue SLA >90% (30s for sales, 45s for support)
- [ ] Abandonment rate <5%
- [ ] Zero P1 issues, <3 P2 issues
- [ ] Agent satisfaction score >70%
- [ ] Business sign-off obtained

### 7.4 Wave 2 Cutover - London & New Jersey (25 Agents)
**Execute 2 weeks after Wave 1 - Weekend Cutover (Saturday 11pm - Sunday 11am)**

**Pre-Cutover (T-1 Day - Friday):**
- [ ] Validate Wave 1 stability (5+ days)
- [ ] Send final reminder to London/NJ agents
- [ ] Brief London/NJ supervisors
- [ ] Activate war room (Friday 6pm)
- [ ] Obtain final business sign-off

**Cutover Execution (Saturday 11pm - Sunday 11am):**
- [ ] **Phase 1: UCCX Graceful Shutdown (Sat 11pm - 11:30pm)**
  - [ ] Same procedure as Wave 1
  - [ ] Disable London/NJ agent logins on UCCX
  
- [ ] **Phase 2: WxCC Entry Point Activation (Sat 11:30pm - 12am)**
  - [ ] Activate WxCC entry points for London/NJ numbers
  - [ ] Test inbound calls to EMEA/Americas entry points
  
- [ ] **Phase 3: Agent Onboarding (Sun 12am - 2am)**
  - [ ] London (15 agents) log into Webex App
  - [ ] New Jersey (10 agents) log into Webex App
  - [ ] Supervisors verify all 25 agents logged in
  - [ ] Test call routing to each site
  - [ ] Validate all integrations
  
- [ ] **Phase 4: Monitoring & Stabilization (Sun 2am - 11am)**
  - [ ] Monitor call quality metrics
  - [ ] Monitor queue statistics
  - [ ] Address any issues immediately
  
- [ ] **Phase 5: Go-Live Validation (Sun 11am)**
  - [ ] Verify all 25 London/NJ agents operational
  - [ ] Obtain business sign-off for Wave 2 go-live

**Post-Cutover Hypercare (Sun - Thu - 5 Days):**
- [ ] Provide 24/7 hypercare support
- [ ] Monitor continuously
- [ ] Validate 5-day stability before Wave 3

### 7.5 Wave 3 Cutover - Mumbai HQ (120 Agents)
**Execute 2 weeks after Wave 2 - Weekend Cutover (Saturday 11pm - Sunday 11am)**

**Pre-Cutover (T-1 Day - Friday):**
- [ ] Validate Wave 2 stability (5+ days)
- [ ] Send final reminder to Mumbai agents
- [ ] Brief Mumbai supervisors
- [ ] Activate war room (Friday 6pm)
- [ ] **CRITICAL: Mumbai is 24x7 operation - highest risk cutover**
- [ ] Confirm additional support resources (on-site + remote)
- [ ] Obtain final business sign-off

**Cutover Execution (Saturday 11pm - Sunday 11am):**
- [ ] **Phase 1: UCCX Graceful Shutdown (Sat 11pm - 11:30pm)**
  - [ ] Same procedure as Wave 1/2
  - [ ] Disable Mumbai agent logins on UCCX
  - [ ] **Final UCCX shutdown for all sites**
  
- [ ] **Phase 2: WxCC Entry Point Activation (Sat 11:30pm - 12am)**
  - [ ] Activate WxCC entry points for Mumbai numbers
  - [ ] Test inbound calls to India_Main_Voice_EP
  
- [ ] **Phase 3: Agent Onboarding (Sun 12am - 4am)**
  - [ ] Mumbai 120 agents log into Webex App (batches of 30)
  - [ ] Batch A (30 agents): 12am-1am
  - [ ] Batch B (30 agents): 1am-2am
  - [ ] Batch C (30 agents): 2am-3am
  - [ ] Batch D (30 agents): 3am-4am
  - [ ] Supervisors verify all 120 agents logged in
  - [ ] Test call routing across all batches
  - [ ] Validate all integrations
  
- [ ] **Phase 4: Monitoring & Stabilization (Sun 4am - 11am)**
  - [ ] Monitor call quality metrics
  - [ ] Monitor queue statistics (24x7 operation)
  - [ ] Monitor agent state across all batches
  - [ ] Address any issues immediately
  - [ ] **Heightened monitoring for Mumbai (24x7 site)**
  
- [ ] **Phase 5: Go-Live Validation (Sun 11am)**
  - [ ] Verify all 120 Mumbai agents operational
  - [ ] Verify 24x7 operation uninterrupted
  - [ ] Obtain business sign-off for Wave 3 go-live

**Post-Cutover Hypercare (Sun - Sat - 7 Days - Extended):**
- [ ] Provide 24/7 hypercare support (extended to 7 days for Mumbai)
- [ ] Monitor continuously (special focus on 24x7 operation)
- [ ] Validate 7-day stability for final sign-off

**Wave 3 Success Criteria:**
- [ ] All 120 Mumbai agents operational on WxCC
- [ ] 24x7 operation stable (no downtime)
- [ ] Call quality meets baseline (MOS >4.0)
- [ ] Queue SLA >90%
- [ ] Abandonment rate <5%
- [ ] Zero P1 issues, <5 P2 issues
- [ ] Business sign-off obtained

### 7.6 Final Migration Validation
**Execute after Wave 3 hypercare (Day 8):**
- [ ] Verify all 175 agents migrated successfully
  - [ ] Chennai: 30 agents [OK]“
  - [ ] London: 15 agents [OK]“
  - [ ] New Jersey: 10 agents [OK]“
  - [ ] Mumbai: 120 agents [OK]“
  
- [ ] Validate zero agents remain on UCCX
- [ ] Confirm all integrations functional (Salesforce, Recording, WFO)
- [ ] Validate all 6 entry points operational
- [ ] Verify all 10 queues routing correctly
- [ ] Confirm call quality meets baseline (MOS >4.0)
- [ ] Verify recording compliance (100% capture)
- [ ] Validate reporting accuracy (real-time + historical)
- [ ] Obtain final business sign-off for Phase 2A completion

### 7.7 Rollback Procedures (Emergency Only)
**Execute ONLY if critical failure occurs during cutover:**

**Rollback Triggers:**
- [ ] >10% call quality degradation (MOS <3.5)
- [ ] >20% abandonment rate
- [ ] Critical integration failure (Salesforce, Recording)
- [ ] >5 P1 issues within first 2 hours
- [ ] Business owner mandates rollback

**Rollback Procedure:**
- [ ] Activate rollback decision authority (Project Manager + IT Director)
- [ ] Notify all stakeholders of rollback
- [ ] **Phase 1: WxCC Graceful Shutdown**
  - [ ] Announce rollback to agents
  - [ ] Agents log out of WxCC
  - [ ] Disable WxCC entry points
  
- [ ] **Phase 2: UCCX Reactivation**
  - [ ] Re-enable UCCX CSQs
  - [ ] Re-enable UCCX agent logins
  - [ ] Update PSTN routing back to UCCX
  - [ ] Agents log back into Finesse
  
- [ ] **Phase 3: Validate UCCX Restoration**
  - [ ] Test inbound calls to UCCX
  - [ ] Verify agents receiving calls
  - [ ] Validate call quality
  - [ ] Confirm all integrations functional
  
- [ ] **Phase 4: Post-Rollback Activities**
  - [ ] Conduct root cause analysis
  - [ ] Document all issues encountered
  - [ ] Identify remediation actions
  - [ ] Schedule new migration attempt (minimum 2 weeks delay)
  - [ ] Communicate rollback to business owner

**Rollback Time Window:**
- [ ] Maximum rollback time: 2 hours
- [ ] Target rollback completion: <1 hour
- [ ] Rollback window: Within first 4 hours of cutover only
- [ ] After 4 hours: Forward-fix only (no rollback)

---

## Phase 8: Post-Migration Operations & Hypercare

### 8.1 Hypercare Support (First 14 Days)
- [ ] Activate 24/7 hypercare support team
  - [ ] Day shift (8am-8pm): 5 engineers + 2 supervisors
  - [ ] Night shift (8pm-8am): 3 engineers + 1 supervisor
  - [ ] Weekend: 3 engineers + 1 supervisor
  
- [ ] Establish war room (physical + virtual)
- [ ] Daily standup meetings with business owner (9am daily)
- [ ] Monitor call quality metrics continuously
- [ ] Monitor queue statistics continuously
- [ ] Monitor agent performance
- [ ] Track and resolve all issues (P1 <1hr, P2 <4hr, P3 <24hr)
- [ ] Collect agent feedback daily
- [ ] Conduct daily lessons learned sessions
- [ ] Document all issues and resolutions
- [ ] Transition to BAU support on Day 15

### 8.2 Issue Management
- [ ] Establish issue tracking system (JIRA, ServiceNow)
- [ ] Define issue severity levels
  - [ ] P1: Critical - Complete service outage (Response: 15min, Resolution: 1hr)
  - [ ] P2: High - Partial service degradation (Response: 30min, Resolution: 4hr)
  - [ ] P3: Medium - Non-critical functionality issue (Response: 2hr, Resolution: 24hr)
  - [ ] P4: Low - Minor issue or enhancement (Response: 24hr, Resolution: 7 days)
  
- [ ] Create issue escalation matrix
- [ ] Track issue metrics (MTTR, MTTD, resolution rate)
- [ ] Conduct daily issue review meetings
- [ ] Document all issues and resolutions
- [ ] Identify root causes and preventive actions

### 8.3 Performance Monitoring (First 30 Days)
- [ ] Monitor call quality metrics daily
  - [ ] MOS (Mean Opinion Score) - Target: >4.0
  - [ ] Latency - Target: <150ms
  - [ ] Jitter - Target: <30ms
  - [ ] Packet Loss - Target: <1%
  
- [ ] Monitor queue statistics daily
  - [ ] Average Speed to Answer (ASA) - Target: <30s sales, <45s support
  - [ ] Service Level - Target: >90%
  - [ ] Abandonment Rate - Target: <5%
  - [ ] Queue Wait Time - Target: <2min average
  
- [ ] Monitor agent performance daily
  - [ ] Average Handle Time (AHT)
  - [ ] Occupancy Rate - Target: 75-85%
  - [ ] Adherence - Target: >90%
  - [ ] Login/Logout accuracy
  
- [ ] Generate daily performance reports
- [ ] Conduct weekly performance reviews
- [ ] Identify performance optimization opportunities

### 8.4 Agent Adoption & Feedback
- [ ] Conduct agent satisfaction surveys (weekly for first month)
- [ ] Collect agent feedback on desktop usability
- [ ] Identify additional training needs
- [ ] Schedule refresher training sessions as needed
- [ ] Monitor agent attrition rates
- [ ] Address agent concerns promptly
- [ ] Recognize top-performing agents
- [ ] Document agent feedback and actions taken

### 8.5 Integration Validation
- [ ] Monitor Salesforce integration performance
  - [ ] Screen pop success rate - Target: >98%
  - [ ] Click-to-dial success rate - Target: >98%
  - [ ] Case creation accuracy - Target: 100%
  
- [ ] Monitor recording platform performance
  - [ ] Recording capture rate - Target: 100%
  - [ ] PCI pause/resume accuracy - Target: 100%
  - [ ] Recording retrieval success rate - Target: >98%
  
- [ ] Monitor WFO platform performance
  - [ ] QM evaluation workflow
  - [ ] WFM schedule adherence
  
- [ ] Address integration issues promptly
- [ ] Optimize integration configurations

### 8.6 Compliance Monitoring
- [ ] Verify call recording compliance (100% capture)
- [ ] Validate PCI-DSS compliance (Billing queue)
- [ ] Monitor data residency (India DC)
- [ ] Validate recording consent (India, EMEA)
- [ ] Generate compliance evidence reports
- [ ] Conduct compliance audits monthly
- [ ] Address compliance gaps immediately
- [ ] Document compliance validation

### 8.7 Capacity Management
- [ ] Monitor concurrent call capacity
- [ ] Track peak call volume times
- [ ] Monitor agent utilization
- [ ] Identify capacity constraints
- [ ] Plan for capacity expansion (if needed)
- [ ] Document capacity planning procedures
- [ ] Schedule quarterly capacity reviews

### 8.8 Knowledge Base Development
- [ ] Document common issues and resolutions
- [ ] Create troubleshooting decision trees
- [ ] Document best practices
- [ ] Create agent desktop tips and tricks
- [ ] Document escalation procedures
- [ ] Create FAQ for agents and supervisors
- [ ] Publish knowledge base to help desk
- [ ] Update knowledge base regularly

### 8.9 Continuous Improvement
- [ ] Collect feedback from all stakeholders (agents, supervisors, business owners)
- [ ] Analyze support ticket trends
- [ ] Identify process improvement opportunities
- [ ] Optimize flow logic based on usage patterns
- [ ] Optimize queue routing strategies
- [ ] Fine-tune skill-based routing
- [ ] Update audio prompts based on feedback
- [ ] Conduct monthly operations reviews
- [ ] Document continuous improvement initiatives

### 8.10 BAU Handover (Day 15)
- [ ] Transition from hypercare to BAU support
- [ ] Reduce war room support hours
- [ ] Establish regular support coverage
  - [ ] Business hours (8am-6pm): 2 engineers
  - [ ] On-call (6pm-8am): 1 engineer
  - [ ] Weekend: On-call only
  
- [ ] Define SLA for BAU support
  - [ ] P1: Response 30min, Resolution 4hr
  - [ ] P2: Response 2hr, Resolution 8hr
  - [ ] P3: Response 4hr, Resolution 24hr
  - [ ] P4: Response 24hr, Resolution 5 days
  
- [ ] Establish change management process
- [ ] Schedule weekly operations reviews
- [ ] Document support escalation procedures
- [ ] Conduct BAU handover meeting
- [ ] Obtain BAU support team sign-off
- [ ] Close hypercare support activities

---

## Phase 9: UCCX Decommissioning

### 9.1 UCCX Decommissioning Prerequisites
- [ ] **CRITICAL: Verify all 175 agents successfully migrated to WxCC**
- [ ] **CRITICAL: Validate 30+ days WxCC operational stability**
- [ ] Confirm zero agents remain on UCCX
- [ ] Confirm all call routing migrated to WxCC
- [ ] Validate all integrations migrated (Salesforce, Recording)
- [ ] Confirm all audio prompts migrated
- [ ] Verify all historical data archived
- [ ] Obtain business sign-off for UCCX decommissioning

### 9.2 Data Archival
- [ ] Archive UCCX configuration files
- [ ] Archive UCCX historical reporting data (minimum 7 years retention)
  - [ ] Agent performance data
  - [ ] Queue statistics
  - [ ] Call detail records (CDR)
  - [ ] Recording metadata (if applicable)
  
- [ ] Archive UCCX IVR scripts (.aef files)
- [ ] Archive UCCX audio prompts
- [ ] Archive UCCX integration configurations
- [ ] Validate archived data accessibility
- [ ] Document archival location and retention period

### 9.3 UCCX Shutdown Procedure
- [ ] **GATE: Minimum 30 days post-migration stability required**
- [ ] Final validation: Zero active agent sessions on UCCX
- [ ] Disable UCCX agent logins
- [ ] Disable UCCX CTI ports (JTAPI)
- [ ] Disable UCCX applications
- [ ] Shutdown UCCX server nodes
- [ ] Disconnect UCCX from CUCM CTI Manager
- [ ] Document shutdown completion

### 9.4 Hardware Disposition
- [ ] Power down UCCX servers (2 nodes - HA pair)
- [ ] Remove servers from data center racks
- [ ] Sanitize server hard drives (secure erase per IT policy)
- [ ] Return leased hardware to vendor (if applicable)
- [ ] Dispose of owned hardware per IT policy
- [ ] Update asset inventory

### 9.5 License Management
- [ ] Return UCCX licenses to Cisco (if applicable)
- [ ] Cancel UCCX SmartNet support contracts
- [ ] Cancel Finesse licenses
- [ ] Document license cost savings
- [ ] Update license inventory

### 9.6 Integration Decommissioning
- [ ] Decommission UCCX-Salesforce connector
- [ ] Decommission UCCX recording integration (if separate)
- [ ] Decommission UCCX wallboards (if not migrated)
- [ ] Decommission UCCX reporting integrations (if not migrated)
- [ ] Document integration decommissioning

### 9.7 Final Documentation
- [ ] Create UCCX decommissioning completion report
- [ ] Document lessons learned from migration
- [ ] Update network architecture diagrams
- [ ] Update IT asset inventory
- [ ] Archive project documentation
- [ ] Obtain final sign-off from business owners
- [ ] Close Phase 2 migration project formally

---

## Phase 10: Steady-State Operations

### 10.1 Operational Dashboards
- [ ] Configure Control Hub WxCC dashboards
- [ ] Configure real-time queue monitoring dashboards
- [ ] Configure agent performance dashboards
- [ ] Configure supervisor dashboards
- [ ] Configure executive dashboards
- [ ] Configure compliance monitoring dashboards
- [ ] Configure capacity utilization dashboards
- [ ] Schedule regular dashboard reviews (weekly)

### 10.2 Alerting & Notifications
- [ ] Configure critical service alerts
- [ ] Configure call quality degradation alerts
- [ ] Configure queue SLA breach alerts
- [ ] Configure abandonment rate threshold alerts
- [ ] Configure agent adherence alerts
- [ ] Configure recording failure alerts
- [ ] Configure integration failure alerts
- [ ] Test all alert notifications

### 10.3 Incident Management
- [ ] Establish incident management process
- [ ] Define incident severity levels
- [ ] Create incident response procedures
- [ ] Document escalation matrix
- [ ] Set up on-call rotation for WxCC support
- [ ] Define SLA for incident resolution
- [ ] Conduct incident response drills quarterly
- [ ] Track incident metrics (MTTR, MTBF, resolution rate)

### 10.4 Change Management
- [ ] Establish change management process for WxCC
- [ ] Define change approval workflow
- [ ] Create change request templates (Flow updates, Queue changes)
- [ ] Schedule maintenance windows (monthly)
- [ ] Document change procedures
- [ ] Conduct post-change reviews
- [ ] Track change success rate
- [ ] Maintain change calendar

### 10.5 Performance Management
- [ ] Track call quality metrics (MOS, latency, jitter, packet loss)
- [ ] Monitor queue performance (ASA, SL, abandonment)
- [ ] Track agent performance (AHT, occupancy, adherence)
- [ ] Monitor first call resolution (FCR)
- [ ] Track customer satisfaction (CSAT) scores
- [ ] Generate monthly performance reports
- [ ] Conduct quarterly performance reviews
- [ ] Benchmark against industry standards

### 10.6 Compliance Operations
- [ ] Monitor call recording compliance (100% capture)
- [ ] Validate PCI-DSS compliance (Billing queue)
- [ ] Monitor data residency (India DC)
- [ ] Validate recording consent (India, EMEA)
- [ ] Track recording retention (7 years)
- [ ] Generate monthly compliance reports
- [ ] Conduct quarterly compliance audits
- [ ] Address compliance gaps immediately

### 10.7 Capacity Management
- [ ] Monitor concurrent call capacity monthly
- [ ] Track peak call volume trends
- [ ] Monitor agent utilization trends
- [ ] Forecast capacity needs (3/6/12 months)
- [ ] Plan for seasonal spikes (holidays, product launches)
- [ ] Plan for agent growth (Phase 3)
- [ ] Document capacity expansion procedures
- [ ] Schedule quarterly capacity planning reviews

### 10.8 User Support
- [ ] Establish help desk procedures for WxCC
- [ ] Create support knowledge base
- [ ] Document common issues and resolutions
- [ ] Train help desk staff on WxCC
- [ ] Set up ticketing system for WxCC issues
- [ ] Define support SLA
- [ ] Monitor support ticket trends
- [ ] Conduct quarterly user satisfaction surveys

### 10.9 Training & Onboarding
- [ ] Develop onboarding program for new agents
- [ ] Schedule refresher training quarterly
- [ ] Develop advanced training for experienced agents
- [ ] Create training for new features (Phase 2B AI)
- [ ] Maintain training materials (update quarterly)
- [ ] Track training completion rates
- [ ] Conduct training effectiveness assessments

### 10.10 Continuous Improvement
- [ ] Collect agent feedback quarterly
- [ ] Analyze support ticket trends monthly
- [ ] Identify process improvement opportunities
- [ ] Evaluate new WxCC features (monthly releases)
- [ ] Plan feature adoption roadmap
- [ ] Optimize flows based on usage patterns
- [ ] Optimize queue routing strategies
- [ ] Fine-tune skill-based routing
- [ ] Update audio prompts based on feedback
- [ ] Conduct quarterly operations reviews
- [ ] Document best practices
- [ ] Benchmark against industry best practices

---

## Appendix: Critical Success Factors

### Technical Requirements
- [ ] All 175 agents successfully migrated to WxCC
- [ ] All 6 entry points operational
- [ ] All 10 queues routing correctly (Phase 2A)
- [ ] All 9 IVR flows functional
- [ ] Call quality meets baseline (MOS >4.0)
- [ ] All integrations functional (Salesforce, Recording, WFO)
- [ ] Recording compliance validated (100% capture)
- [ ] Data residency compliance validated (India DC)
- [ ] Zero open P1/P2 issues post-migration
- [ ] UCCX decommissioned successfully

### Business Requirements
- [ ] Zero unplanned business downtime during migration
- [ ] Queue SLA maintained >90% post-migration
- [ ] Abandonment rate <5%
- [ ] First call resolution maintained >70%
- [ ] Agent satisfaction score >70%
- [ ] Customer satisfaction (CSAT) maintained or improved
- [ ] Cost savings targets achieved
- [ ] Migration completed within timeline
- [ ] Business owner sign-off obtained
- [ ] Training completion >95%

### Compliance Requirements
- [ ] Call recording compliance validated (100% capture)
- [ ] PCI-DSS compliance validated (Billing queue)
- [ ] Data residency requirements met (India DC)
- [ ] GDPR compliance validated (EMEA)
- [ ] Recording consent compliance validated (India, EMEA)
- [ ] Audit trail complete and accessible
- [ ] Compliance reports generated monthly
- [ ] Annual compliance reviews scheduled

### Phase 2B AI Enhancement Readiness (Future)
- [ ] Phase 2A operational stability >6 months
- [ ] Historical data collected for AI training
- [ ] Webex AI Agent license procured
- [ ] Google CCAI (Dialogflow CX) license procured
- [ ] Intent taxonomy designed (30+ intents)
- [ ] Training data prepared (FAQs, conversation logs)
- [ ] Agent training program developed for AI escalations
- [ ] Virtual Agent "Abhi" personality designed
- [ ] AI performance benchmarks defined

### Risk Mitigation
- [ ] Rollback procedures tested and documented
- [ ] 24/7 support coverage during migration
- [ ] Vendor escalation paths established (Cisco TAC)
- [ ] All critical incidents documented
- [ ] Lessons learned captured
- [ ] Backup configurations preserved (UCCX archive)
- [ ] Disaster recovery plan validated
- [ ] Business continuity plan updated

---

## Sign-Off

### Project Completion Checklist (Phase 2A Baseline)
- [ ] All 3 migration waves completed successfully
- [ ] All 175 agents migrated to WxCC
- [ ] Phase 1 dependency satisfied (agents stable on Webex Calling)
- [ ] All testing passed (functional, integration, performance, UAT)
- [ ] UCCX decommissioned (post-30 day stability)
- [ ] Documentation complete (as-built, runbooks, procedures)
- [ ] Training delivered (agents, supervisors, help desk)
- [ ] Knowledge transfer complete (BAU operations team)
- [ ] Operations team handover complete
- [ ] Project closure report submitted
- [ ] Lessons learned documented
- [ ] Phase 2B AI enhancement roadmap documented

### Approvals

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Project Manager | | | |
| Collaboration Architect | | | |
| Contact Center Architect | | | |
| Network Architect | | | |
| Security Architect | | | |
| IT Director | | | |
| Operations Manager | | | |
| CC Operations Manager | | | |
| Business Owner | | | |

---

## Document Cross-Reference

### Related UCCX-WxCC Documentation
| Chapter | Document | Reference |
|---------|----------|-----------|
| Chapter 3 | WxCC Design (Phase 2) | Section 3.1 - 3.5 |
| Chapter 6 | WxCC Implementation (Phase 2) | Section 6.1 - 6.10 |
| Chapter 7 | WxCC Migration Execution | Section 7.1 - 7.4 |
| Chapter 8 | Operations & Day 2 | Section 8.1 - 8.5 |
| Chapter 9 | AI Features Design | Section 9.1 - 9.3 |
| Chapter 10 | AI Integration Implementation | Section 10.1 - 10.11 |
| Appendices | Reference Materials | Appendix 10A - 10E |

### Related Phase 1 Documentation
| Document | Integration Point | Reference |
|---------|------------------|-----------|
| CUCM-Webex Calling Checklist | Phase 1 Dependency | Phase 1.1 |
| CUCM-Webex Calling Checklist | Batch 5 CC Agents | Phase 5.5 |
| CUCM-Webex Calling Checklist | 48-Hour Stability Gate | Phase 5.5 Post-Migration |

### Related Infrastructure Projects
| Project | Integration Point | Reference |
|---------|------------------|-----------|
| ABV-SDWAN-2024 | QoS for CC Traffic | SD-WAN Master Checklist Phase 4 |
| ABV-SDA-ISE-2025 | Network Policy | DNAC-ISE Master Checklist Phase 5 |
| ABV-COLLAB-MIG-2026-P1 | Phase 1 CUCM Migration Dependency | CUCM-Webex Calling Checklist |

### Phase 1 to Phase 2 Critical Handoff
| Handoff Point | Description | Checklist Reference |
|--------------|-------------|---------------------|
| **Batch 5 Completion** | 175 CC agents migrated to Webex Calling | CUCM-Webex Calling Phase 5.5 |
| **48-Hour Stability** | Mandatory stability before Phase 2 start | CUCM-Webex Calling Phase 5.5 Post-Migration |
| **Hard Gate** | Phase 2 cannot start until Batch 5 stable | UCCX-WxCC Phase 1.1 |
| **No Parallel Operation** | UCCX requires CUCM - BIG BANG cutover | UCCX-WxCC Phase 7.1 |

---

## Quick Reference: Phase Summary

| Phase | Focus Area | Key Deliverables | Duration |
|-------|------------|------------------|----------|
| 1 | Prerequisites & Phase 1 Dependency | Phase 1 validation, UCCX assessment | 2-3 weeks |
| 2 | WxCC Design (Phase 2A) | Architecture, queues, skills, flows | 4-6 weeks |
| 3 | Phase 2B AI Design (Future) | Hybrid AI architecture, Virtual Agent | Phase 2B |
| 4 | Implementation & Configuration | Tenant setup, provisioning, integrations | 6-8 weeks |
| 5 | Testing & Validation | Unit, integration, UAT, sandbox testing | 3-4 weeks |
| 6 | Training Program | Agent/supervisor/admin training | 4-6 weeks |
| 7 | Migration Execution (BIG BANG) | 3 waves - Chennai/London-NJ/Mumbai | 6-8 weeks |
| 8 | Post-Migration & Hypercare | Issue resolution, monitoring, BAU handover | 2 weeks |
| 9 | UCCX Decommissioning | Data archival, shutdown, hardware disposal | 2 weeks |
| 10 | Steady-State Operations | Monitoring, incident mgmt, continuous improvement | Ongoing |

---

## Quick Reference: Migration Wave Summary

| Wave | Site | Agents | Timeline | Dependencies | Hypercare |
|------|------|--------|----------|--------------|-----------|
| **Wave 1** | Chennai (Pilot) | 30 | Week 5 | Phase 1 stable, Training complete | 5 days |
| **Wave 2** | London + New Jersey | 25 | Week 7 | Wave 1 stable 5+ days | 5 days |
| **Wave 3** | Mumbai HQ (Final) | 120 | Week 10 | Wave 2 stable 5+ days | 7 days (24x7 site) |
| **TOTAL** | **4 Sites** | **175** | **10 weeks** | **Phase 1 + Training** | **14 days total** |

**CRITICAL GATE:** Phase 1 Batch 5 (175 CC agents) must be stable on Webex Calling for 48+ hours before Phase 2 Wave 1 can proceed.

**MIGRATION APPROACH:** BIG BANG per wave - no parallel operation between UCCX and WxCC possible due to CUCM CTI dependency.

---

## Quick Reference: Phase 2A vs Phase 2B

| Aspect | Phase 2A (Baseline) | Phase 2B (AI Enhancement) |
|--------|-------------------|--------------------------|
| **Status** | Current | Planned (6+ months post-2A) |
| **Queues** | 10 queues | +3 AI queues (13 total) |
| **Skills** | 18 skills | +4 AI skills (22 total) |
| **Flows** | 9 DTMF flows | Modified flows + AI nodes |
| **AI Platform** | None | Webex AI Agent + Dialogflow CX |
| **Virtual Agent** | None | "Abhi" (voice + digital) |
| **Agent Assist** | None | Real-time transcription + suggestions |
| **Licensing** | Standard/Premium Agent | +1 Webex AI Agent + 1 CCAI license |
| **Training** | Standard CC training | +AI escalation handler training |
| **Dependencies** | Phase 1 stable | Phase 2A stable 6+ months + historical data |

---

**Document Version:** 1.0  
**Last Updated:** January 2026  
**Organization:** Abhavtech  
**Classification:** Internal Use  
**Cross-Reference:** CUCM-Webex Calling Master Checklist (Phase 1)  
**Dependency:** Phase 1 Batch 5 must be complete and stable before Phase 2 start

---

*End of UCCX-to-Webex Contact Center Migration Checklist*
