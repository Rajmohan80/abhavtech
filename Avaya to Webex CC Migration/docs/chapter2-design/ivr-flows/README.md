# IVR Flows Design

## Overview

This section provides comprehensive documentation for Interactive Voice Response (IVR) design, covering the migration from Avaya Experience Portal to Webex Connect Flow Designer, including call flow architecture, self-service strategies, and natural language understanding.

---

## What is IVR?

**Interactive Voice Response (IVR)** is an automated telephony system that interacts with callers through voice prompts and touch-tone keypad (DTMF) inputs, enabling self-service and intelligent call routing before reaching a live agent.

### IVR Capabilities

```
┌─────────────────────────────────────────────────────┐
│              CUSTOMER CALLS                         │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│          IVR GREETING & MENU                        │
│  "Thank you for calling. Press 1 for Sales..."      │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌─────────────┐ ┌──────────┐ ┌──────────────┐
│Self-Service │ │Intelligent│ │  Transfer to│
│ Transaction │ │  Routing  │ │  Live Agent │
│             │ │           │ │             │
│ • Balance   │ │ • Skills  │ │ • Queue     │
│ • Status    │ │ • Priority│ │ • Context   │
│ • Payment   │ │ • Language│ │   Passed    │
└─────────────┘ └──────────┘ └──────────────┘
```

---

## Design Philosophy

### Customer-Centric Design Principles

1. **Minimize Effort**
   - Clear, concise menu options (max 4-5 per level)
   - Fast-track for frequent callers
   - Speech recognition where appropriate
   - Zero-out option to reach agent

2. **Personalization**
   - ANI recognition for known customers
   - Customized greetings and options
   - Remember customer preferences
   - Context-aware routing

3. **Self-Service First**
   - Enable 24/7 resolution
   - Reduce agent workload
   - Improve customer satisfaction
   - Lower cost per contact

4. **Graceful Degradation**
   - Always provide path to live agent
   - Handle errors with helpful messaging
   - Retry logic for system failures
   - Maintain context on escalation

### Success Metrics

| Metric | Current (Avaya) | Target (Webex) |
|--------|-----------------|----------------|
| IVR Containment Rate | 35% | 50% |
| Average IVR Duration | 2min 15sec | 1min 45sec |
| IVR Abandonment | 18% | < 10% |
| Zero-out Rate | 25% | < 15% |
| Customer Satisfaction (IVR) | 3.2/5 | 4.0/5 |
| Self-Service Success Rate | 68% | 80% |

---

## Document Structure

### [Current Avaya IVR](current-avaya-ivr.md)
Documentation of existing Avaya IVR implementation:
- Experience Portal architecture
- Orchestration Designer workflows
- VoiceXML applications
- Current call flows and menus
- Integration points
- Performance metrics and pain points

### [Target Webex Connect](target-webex-connect.md)
Webex Connect Flow Designer architecture:
- Flow Designer capabilities
- Visual flow development
- Pre-built connectors and nodes
- AI/NLU integration (Dialogflow)
- Enhanced self-service features
- Real-time analytics

### [Flow Migration](target-webex-connect.md)
Step-by-step flow migration procedures:
- Flow assessment and inventory
- Conversion methodology
- Testing strategies
- Validation procedures
- Cutover planning
- Rollback procedures

---

## IVR Architecture Comparison

### Avaya vs. Webex Capabilities

| Feature | Avaya Experience Portal | Webex Connect | Improvement |
|---------|------------------------|---------------|-------------|
| Development | VoiceXML/CCXML code | Visual flow designer | ✅ Low-code |
| Deployment | Manual server updates | Cloud-based publish | ✅ Instant |
| Speech Recognition | Avaya ASR | Google Dialogflow CX | ✅ Superior AI |
| NLU Capability | Limited intent matching | Advanced NLP | ✅ Better understanding |
| Integrations | Custom SOAP/REST | Pre-built connectors | ✅ Faster integration |
| Analytics | Separate reporting | Built-in real-time | ✅ Better insights |
| Testing | Production-like env needed | Sandbox included | ✅ Easier testing |
| Multi-channel | Voice only | Voice + Digital | ✅ Omnichannel |

---

## Key Concepts

### Call Flow Structure

**Typical IVR Call Flow:**

```
1. Greeting
   ├─ "Thank you for calling [Company]"
   └─ Personalized: "Welcome back, John"

2. Main Menu
   ├─ Option 1: Sales
   ├─ Option 2: Support
   ├─ Option 3: Billing
   ├─ Option 9: Repeat menu
   └─ Option 0: Speak to operator

3. Sub-Menu (if needed)
   ├─ More specific options
   └─ Or transfer to queue

4. Self-Service Transaction
   ├─ Collect information
   ├─ Validate input
   ├─ Process request
   └─ Confirm result

5. Resolution or Transfer
   ├─ Success: Thank customer, disconnect
   └─ Escalation: Transfer to agent with context
```

### DTMF vs. Speech Recognition

**DTMF (Dual-Tone Multi-Frequency):**
```
Advantages:
✅ Universal compatibility
✅ No ambient noise issues
✅ Precise input
✅ Simple implementation

Disadvantages:
❌ Limited to 0-9, *, #
❌ Slower for text entry
❌ Not hands-free friendly
❌ Requires menu navigation
```

**Speech Recognition (ASR/NLU):**
```
Advantages:
✅ Natural interaction
✅ Hands-free operation
✅ Faster for complex inputs
✅ Better customer experience

Disadvantages:
❌ Requires good audio quality
❌ Accents may cause errors
❌ More complex implementation
❌ Higher cost per transaction
```

**Hybrid Approach (Recommended):**
```
"Please say or press 1 for Sales, 2 for Support, or 3 for Billing"

Benefits:
✅ Maximum accessibility
✅ Customer choice
✅ Fallback option
✅ Better containment rates
```

### Natural Language Understanding (NLU)

**Intent Recognition Example:**

```
Customer utterance: "I need to check my account balance"

Intent Detection:
├─ Intent: account_balance_inquiry
├─ Confidence: 95%
├─ Entities:
│   └─ account_type: (not specified)
└─ Next Action: Prompt for account type

Follow-up:
IVR: "Which account would you like to check? Say checking or savings."
Customer: "checking"
├─ Entity: account_type = checking
└─ Action: Query balance API → Speak result
```

**Sample Intents:**

| Intent | Example Utterances | Action |
|--------|-------------------|--------|
| `account_balance` | "What's my balance?", "Check balance" | Query account system |
| `make_payment` | "I want to pay my bill", "Make a payment" | Payment flow |
| `order_status` | "Where's my order?", "Track my package" | Order lookup |
| `speak_to_agent` | "Representative", "Talk to a person" | Transfer to queue |
| `store_hours` | "When are you open?", "Business hours" | Provide hours info |

---

## Webex Connect Flow Designer

### Visual Flow Development

**Flow Designer Interface:**

```
┌───────────────────────────────────────────────────┐
│  Flow: Main_IVR_Menu                              │
├───────────────────────────────────────────────────┤
│                                                   │
│   [Start] ──► [Play Message] ──► [Menu]          │
│                   ↓                  │            │
│              "Welcome..."       ┌────┴────┐       │
│                                 │         │       │
│                                 1         2       │
│                                 │         │       │
│                            [Sales Queue] [Support]│
│                                                   │
│   Nodes Available:                                │
│   • Play Message    • Collect Input               │
│   • Menu           • HTTP Request                 │
│   • Condition      • Queue Contact                │
│   • Set Variable   • Dialogflow                   │
│   • Loop           • Database Query               │
└───────────────────────────────────────────────────┘
```

### Common Flow Nodes

**1. Play Message Node**
```yaml
node_type: play_message
configuration:
  message_type: text_to_speech
  text: "Thank you for calling. Your call is important to us."
  voice: en-US-Wavenet-A (Google Cloud TTS)
  language: en-US
  bargein: enabled  # Allow customer to interrupt
```

**2. Menu Node**
```yaml
node_type: menu
configuration:
  prompt: "Press 1 for Sales, 2 for Support, or 0 for operator"
  timeout: 5_seconds
  max_retries: 3
  no_input_action: repeat_prompt
  invalid_input_action: reprompt
  options:
    - digit: "1"
      destination: sales_queue_node
    - digit: "2"
      destination: support_queue_node
    - digit: "0"
      destination: operator_node
```

**3. HTTP Request Node**
```yaml
node_type: http_request
configuration:
  method: POST
  url: "https://api.company.com/customer/lookup"
  headers:
    Authorization: "Bearer ${api_token}"
    Content-Type: "application/json"
  body:
    phone_number: "${ANI}"
  timeout: 5_seconds
  response_variable: customer_data
  error_handling: continue_on_error
```

**4. Dialogflow Node**
```yaml
node_type: dialogflow_cx
configuration:
  project_id: company-dialogflow
  agent_id: abc123-def456
  language: en-US
  input_audio: call_audio_stream
  output:
    intent: ${dialogflow.intent}
    confidence: ${dialogflow.confidence}
    parameters: ${dialogflow.parameters}
```

**5. Queue Contact Node**
```yaml
node_type: queue_contact
configuration:
  queue_id: sales_queue
  priority: normal
  cad_variables:
    customer_id: "${customer_data.id}"
    intent: "${dialogflow.intent}"
    call_reason: "${dialogflow.parameters.reason}"
  callback_enabled: true
  estimated_wait_message: true
```

---

## Self-Service Flows

### Flow 1: Account Balance Inquiry

```
[Start]
   │
   ▼
[Play Greeting]
   │
   ▼
[Collect Account Number]
"Please enter your 10-digit account number"
   │
   ▼
[Validate Account] ◄──┐
   │                  │
   ├─ Valid ──►       │
   │           [Query Balance API]
   │                  │
   │                  ▼
   │           [Speak Balance]
   │           "Your current balance is $1,234.56"
   │                  │
   │                  ▼
   │           [Additional Options]
   │           "Press 1 for recent transactions,
   │            Press 2 for main menu,
   │            or press 0 for an agent"
   │
   └─ Invalid ──► [Retry] ─┘
                  (max 3 attempts)
                     │
                     ▼ (after 3 failures)
                  [Transfer to Agent]
```

### Flow 2: Bill Payment

```
[Start]
   │
   ▼
[Authenticate Customer]
   │
   ▼
[Retrieve Bill Info]
"Your current bill is $150.00, due on Oct 31"
   │
   ▼
[Payment Options Menu]
"Press 1 to pay full amount,
 Press 2 to pay other amount,
 Press 3 for payment arrangements"
   │
   ├─ 1 (Full) ──► [Process Full Payment]
   │
   ├─ 2 (Other) ─► [Collect Amount] ──► [Process Payment]
   │
   └─ 3 (Arrange)─► [Transfer to Billing Agent]
                         │
                         ▼
                  [Payment Gateway Integration]
                  • Tokenize card (PCI compliance)
                  • Process transaction
                  • Send confirmation
                         │
                         ▼
                  [Confirmation]
                  "Your payment of $150 has been processed.
                   Confirmation number: 123456"
                         │
                         ▼
                  [Offer Receipt]
                  "Press 1 to receive SMS receipt,
                   Press 2 for email receipt"
                         │
                         ▼
                  [Thank & Disconnect]
```

### Flow 3: Order Status Lookup

```
[Start]
   │
   ▼
[Collect Order Number]
"Please say or enter your order number"
   │
   ▼
[Query Order API]
   │
   ├─ Found ──►
   │    [Speak Order Status]
   │    "Your order #12345 shipped on Oct 28
   │     and will arrive by Oct 31.
   │     Tracking number: 1Z999AA1..."
   │         │
   │         ▼
   │    [Offer SMS Tracking]
   │    "Would you like tracking link via SMS?"
   │         │
   │         ├─ Yes ──► [Send SMS] ──► [Confirm]
   │         └─ No ───► [Additional Options]
   │
   └─ Not Found ──►
        [Retry or Agent]
        "Order not found. Press 1 to re-enter,
         or press 0 to speak with an agent"
```

---

## Advanced Features

### 1. Caller Recognition & Personalization

```
[Call Arrives]
   │
   ▼
[Extract ANI (Caller ID)]
   │
   ▼
[Lookup Customer in CRM]
   │
   ├─ Known Customer ──►
   │    [Personalized Greeting]
   │    "Welcome back, John. How can I help you today?"
   │         │
   │         ▼
   │    [Predictive Menu]
   │    (Based on call history)
   │    "Press 1 for order status (your last 3 calls),
   │     Press 2 for billing questions,
   │     or say what you need"
   │
   └─ Unknown Caller ──►
        [Standard Greeting]
        "Thank you for calling [Company]"
             │
             ▼
        [Standard Main Menu]
```

### 2. Intelligent Call-Back

```
[Queue Full or High Wait Time]
   │
   ▼
[Offer Call-Back]
"Current wait time is approximately 15 minutes.
 Would you like us to call you back when an agent
 is available? Your place in line will be saved."
   │
   ├─ Yes ──►
   │    [Collect Call-Back Number]
   │    "What number should we call?"
   │         │
   │         ▼
   │    [Confirm Number]
   │    "We'll call you at ${phone_number}.
   │     Press 1 to confirm or 2 to re-enter."
   │         │
   │         ▼
   │    [Schedule Call-Back]
   │    "Thank you. We'll call you within the hour."
   │         │
   │         ▼
   │    [Disconnect]
   │
   └─ No ───►
        [Continue Holding]
        "Please continue to hold..."
```

### 3. Multi-Language Support

```
[Call Arrives]
   │
   ▼
[Language Selection]
"For English, press 1. Para Español, oprima dos."
   │
   ├─ 1 (English) ──►
   │    [Set Language: en-US]
   │         │
   │         ▼
   │    [English IVR Flow]
   │
   └─ 2 (Spanish) ──►
        [Set Language: es-MX]
             │
             ▼
        [Spanish IVR Flow]
             │
        (All prompts in Spanish,
         Route to Spanish-speaking agents)
```

### 4. Business Hours Routing

```
[Call Arrives]
   │
   ▼
[Check Current Time]
   │
   ├─ Business Hours (8 AM - 8 PM) ──►
   │    [Standard IVR Menu]
   │         │
   │         ▼
   │    [Route to Live Agents]
   │
   ├─ After Hours (8 PM - 8 AM) ──►
   │    [After Hours Message]
   │    "Our office is currently closed.
   │     We're open Mon-Fri, 8 AM to 8 PM ET."
   │         │
   │         ▼
   │    [Self-Service Options]
   │    "Press 1 to leave a message,
   │     Press 2 for account balance,
   │     Press 3 for order status"
   │
   └─ Holidays ──►
        [Holiday Message]
        "We're closed for [Holiday Name].
         We'll reopen on [Date]."
             │
             ▼
        [Emergency Options]
        "For urgent matters, press 1"
```

---

## Best Practices

### IVR Menu Design

✅ **Do:**
- Limit options to 4-5 per menu
- Put most frequent options first
- Use clear, concise language
- Test with real customers
- Provide "repeat menu" option
- Always offer path to live agent (0)

❌ **Don't:**
- Create deep menu hierarchies (>3 levels)
- Use jargon or technical terms
- Force customers through unnecessary steps
- Forget to handle errors gracefully
- Make customers listen to entire menu

### Prompt Writing Guidelines

**Good Prompt:**
```
"Press 1 for account balance,
 2 for recent transactions,
 or 0 to speak with an agent."

Characteristics:
✅ Concise (under 30 words)
✅ Action-oriented (Press...)
✅ Limited options (3)
✅ Agent escape hatch (0)
```

**Bad Prompt:**
```
"Thank you for calling our automated system.
 We appreciate your business. If you would like
 to inquire about your current account balance,
 please press the number 1 on your telephone keypad.
 If you would like to hear about recent transactions
 on your account, please press number 2. If you would
 like to speak with one of our customer service
 representatives, please press 0."

Problems:
❌ Too wordy (65+ words)
❌ Overly formal
❌ Takes too long
❌ Customers may hang up
```

### Error Handling

**Timeout Handling:**
```
Attempt 1: [Silence - 5 seconds]
Response: "I didn't hear you. Please press 1 for Sales..."

Attempt 2: [Silence - 5 seconds]
Response: "I still didn't hear a response. Let me transfer
           you to an agent who can help."

Attempt 3: [Transfer to operator]
```

**Invalid Input Handling:**
```
Attempt 1: [Customer presses 9 - not a valid option]
Response: "I'm sorry, that's not a valid option.
           Please press 1 for Sales, 2 for Support..."

Attempt 2: [Customer presses 7 - still invalid]
Response: "I didn't understand. Let me connect you
           with someone who can help."

Attempt 3: [Transfer to operator]
```

---

## Testing Strategy

### Test Scenarios

```
☐ Happy Path (successful self-service)
☐ Invalid input handling (wrong DTMF)
☐ Timeout handling (no input)
☐ System error handling (API failure)
☐ Network interruption (call drop)
☐ Extreme values (999999999 account number)
☐ Special characters (*/# inputs)
☐ Rapid inputs (customer hammering keys)
☐ Speech recognition accuracy
☐ Background noise handling
☐ Accent/dialect recognition
☐ Multiple language paths
☐ Business hours vs. after hours
☐ Holiday routing
☐ High call volume (queueing)
☐ Agent transfer with context
☐ Call-back functionality
☐ Recording pause/resume (PCI)
☐ CRM integration (screen pop)
```

### Test Call Script Example

```
Test Case: Account Balance Inquiry

1. Dial IVR number: 1-800-XX5-0100
   Expected: Greeting plays within 3 seconds

2. Listen to main menu
   Expected: Hear "Press 1 for Sales, 2 for Support..."

3. Press 2 (for account services)
   Expected: Sub-menu plays

4. Press 1 (for balance inquiry)
   Expected: Prompt for account number

5. Enter account number: 1234567890
   Expected: System accepts and validates

6. Listen to balance
   Expected: "Your current balance is $1,234.56"

7. Press 0 (to speak with agent)
   Expected: Transferred to queue with < 2 min wait

PASS/FAIL: _______
Notes: ___________________________________
```

---

## Performance Optimization

### Containment Rate Improvement

**Strategies:**
```
Current: 35% → Target: 50%

Actions:
1. Simplify menu structure (-20% abandonment)
2. Add speech recognition (+10% containment)
3. Improve self-service success rate (+5%)
4. Personalize based on caller history (+8%)
5. Reduce IVR duration (-30 seconds = +7%)
```

### Call Flow Optimization

**Before (Avg 2min 15sec):**
```
Greeting (15s) → Main Menu (20s) → Sub Menu (20s) →
Input Collection (30s) → Processing (30s) → Result (20s)
= 135 seconds
```

**After (Avg 1min 45sec):**
```
Personalized Greeting (10s) → Direct Option (15s) →
Input Collection (25s) → Fast Processing (20s) → Result (15s)
= 85 seconds (37% faster)
```

---

## Migration Considerations

### Phased Approach

**Phase 1: Pilot (Week 1-2)**
- Migrate simple informational flow
- Limited traffic (10%)
- Monitor closely
- Rollback plan ready

**Phase 2: Core Flows (Week 3-6)**
- Main menu and primary self-service
- Increase traffic to 50%
- A/B testing available
- Performance comparison

**Phase 3: Advanced Features (Week 7-8)**
- NLU and AI features
- Complex integrations
- Full traffic cutover
- Decommission Avaya

**Phase 4: Optimization (Week 9+)**
- Analyze performance data
- Tune for containment
- Expand self-service
- Continuous improvement

---

## Validation Checklist

Before go-live:

- [ ] All call flows tested end-to-end
- [ ] Audio prompts recorded and uploaded
- [ ] Speech recognition trained and tested
- [ ] API integrations validated
- [ ] Error handling tested
- [ ] Load testing completed
- [ ] Business hours routing verified
- [ ] Multi-language paths tested
- [ ] Agent transfer with context validated
- [ ] Call-back functionality working
- [ ] Analytics and reporting configured
- [ ] Documentation updated
- [ ] Training completed for support staff
- [ ] Rollback procedures documented

---

