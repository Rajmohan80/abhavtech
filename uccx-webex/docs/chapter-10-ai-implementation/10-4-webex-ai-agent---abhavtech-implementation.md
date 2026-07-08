# Chapter 10: Advanced AI Integration & Implementation -- 10.4 Webex AI Agent - Abhavtech Implementation

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


---
