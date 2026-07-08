# Chapter 10: Advanced AI Integration & Implementation -- 10.2 Integration Architecture

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


---
