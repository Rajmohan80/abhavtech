# Chapter 10: Advanced AI Integration & Implementation -- 10.3 Webex AI Agent Configuration

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
