# 7.3 AI-Powered Virtual Agent Design

## 7.3.1 Dialogflow CX Architecture Overview

## Introduction to Dialogflow CX

Dialogflow CX is Google's enterprise-grade conversational AI platform designed for complex, multi-turn conversations. It uses a state machine approach with flows, pages, and event handlers to provide explicit control over conversation paths.

**Key Architectural Components:**

```
┌─────────────────────────────────────────────────────────────────┐
│                     Webex Contact Center                         │
│  ┌────────────┐     ┌────────────┐      ┌─────────────────┐   │
│  │  Entry     │────▶│   Flow     │─────▶│  Virtual Agent  │   │
│  │  Point     │     │  Designer  │      │    V2 Activity  │   │
│  └────────────┘     └────────────┘      └────────┬────────┘   │
│                                                    │             │
└────────────────────────────────────────────────────┼────────────┘
                                                     │
                               HTTPS/TLS 1.2+       │
                                                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Google Cloud Platform                         │
│  ┌────────────────────────────────────────────────────────┐    │
│  │               Dialogflow CX Agent                       │    │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │    │
│  │  │  Flows   │  │  Pages   │  │  Event Handlers    │  │    │
│  │  └──────────┘  └──────────┘  └────────────────────┘  │    │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────────────┐  │    │
│  │  │ Intents  │  │ Entities │  │  Webhooks          │  │    │
│  │  └──────────┘  └──────────┘  └────────────────────┘  │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ┌────────────────────┐  ┌──────────────────────────────┐     │
│  │  Speech-to-Text    │  │   Text-to-Speech (TTS)        │     │
│  └────────────────────┘  └──────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────┐  ┌──────────────────────────────┐     │
│  │  NLU Processing    │  │   Sentiment Analysis          │     │
│  └────────────────────┘  └──────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  External APIs   │
                    │  • CRM           │
                    │  • Backend       │
                    │  • Databases     │
                    └──────────────────┘
```

## Dialogflow CX vs Dialogflow ES

| Feature | Dialogflow CX | Dialogflow ES |
|---------|---------------|---------------|
| **Use Case** | Complex, enterprise contact centers | Simple bots, proof of concepts |
| **Conversation Model** | State machine (Flows/Pages) | Intent-based with contexts |
| **Scalability** | High (100K+ intents) | Medium (2K intents recommended) |
| **Multi-turn Handling** | Native with pages | Context-based |
| **Version Control** | Built-in flow versioning | Manual export/import |
| **Testing** | Integrated test cases | Manual testing |
| **Pricing** | Pay-per-request | Pay-per-request (lower) |
| **Best For** | Contact centers, enterprise | Chatbots, small-scale |

**Recommendation for Avaya to Webex Migration:** Use Dialogflow CX for enterprise-grade contact center implementations due to better scalability, state management, and testing capabilities.

## Integration Architecture

**Components Required for Webex CC + Dialogflow CX:**

| Component | Purpose | Location |
|-----------|---------|----------|
| **Google CCAI Connector** | Establishes trust between GCP and Cisco | Control Hub |
| **CCAI Config ID** | Virtual Agent configuration | Control Hub Features |
| **Dialogflow CX Agent** | Conversational AI logic | GCP Console |
| **Conversation Profile** | Agent binding configuration | Dialogflow CX |
| **Webhooks** | Backend business logic | Cloud Functions / External |
| **Virtual Agent V2 Activity** | Flow Designer component | Webex CC Flow Designer |

## Provisioning Requirements

**Pre-requisites:**

1. **GCP Project Setup**
   - Active Google Cloud project with billing enabled
   - Dialogflow API enabled
   - Cloud Functions API enabled (for webhooks)
   - Required IAM permissions

2. **Webex Contact Center**
   - Valid Webex CC tenant
   - Control Hub admin access
   - Cisco CCAI subscription (A2Q process completed)

3. **Network Requirements**
   - Outbound HTTPS (443) access to:
     - `*.dialogflow.com`
     - `*.googleapis.com`
     - `*.google.com`

**Licensing:**

| License Type | Description | Cost Model |
|--------------|-------------|------------|
| **Cisco CCAI SKU** | Required for integration | Per-agent/month |
| **Google CCAI** | Speech & NLU services | Usage-based (per request) |
| **Dialogflow CX** | Conversation platform | Per session |

---

## 7.3.2 Virtual Agent Design Principles

## Conversation Design Best Practices

**1. User-Centric Design**
- **Identify User Goals:** Map customer intents to business processes
- **Define Success Metrics:** Containment rate, CSAT, average handle time
- **Create Personas:** Develop conversation flows for different customer types

**2. Conversation Flow Structure**

```
Start Flow
    ↓
Welcome Message (set expectations)
    ↓
Intent Recognition (3 no-match retries)
    ├─→ Matched Intent → Page Transitions → Collect Parameters
    ├─→ Fallback (1st) → Clarification prompt
    ├─→ Fallback (2nd) → More specific help
    └─→ Fallback (3rd) → Escalate to agent
        ↓
Business Logic / Webhook
        ↓
Confirmation & Next Steps
        ↓
End (Handled) or Escalate
```

**3. Error Handling Strategy**

| Error Type | Strategy | Example Response |
|------------|----------|------------------|
| **No-Match 1** | Clarify & Repeat | "I didn't quite catch that. Are you asking about billing, technical support, or account information?" |
| **No-Match 2** | Provide Options | "I'm here to help with: 1) Billing questions, 2) Technical support, 3) Account changes. Which one interests you?" |
| **No-Match 3** | Escalate | "I want to make sure you get the best help. Let me connect you with one of our specialists who can assist you better." |
| **No-Input 1** | Prompt Again | "Are you still there? Please say or press 1 for billing, 2 for support..." |
| **No-Input 2** | Offer Help | "If you need a moment, that's okay. Would you like to hear your options again, or should I connect you to an agent?" |
| **No-Input 3** | Callback Option | "I haven't heard from you. Would you like me to call you back, or should I end this call?" |
| **Webhook Failure** | Graceful Degradation | "I'm having trouble accessing that information right now. Let me connect you to an agent who can help you." |

**4. Context Preservation**

```json
{
  "session_parameters": {
    "customer_id": "C12345",
    "account_type": "premium",
    "intent_history": ["billing_inquiry", "payment_method"],
    "escalation_reason": "complex_billing_dispute",
    "conversation_id": "wxcc-12345-67890",
    "sentiment": "frustrated"
  }
}
```

**Pass context to agent desktop:**

| Parameter | Purpose | Displayed To |
|-----------|---------|--------------|
| `customer_id` | CRM lookup | Agent Desktop |
| `intent_history` | Conversation summary | CAD variables |
| `escalation_reason` | Why virtual agent escalated | Agent |
| `collected_data` | Info gathered by bot | Ticket/CRM |
| `sentiment` | Customer emotional state | Agent alert |

---

## 7.3.3 NLU Flow Design and Intent Mapping

## Intent Hierarchy

**Best Practice:** Organize intents in a hierarchy from general to specific.

```
├── Contact_Center_Main
    ├── Billing_Root
    │   ├── View_Bill
    │   ├── Pay_Bill
    │   │   ├── Pay_by_Credit_Card
    │   │   └── Pay_by_Bank_Account
    │   ├── Dispute_Charge
    │   └── Update_Payment_Method
    ├── Technical_Support_Root
    │   ├── Internet_Issue
    │   │   ├── No_Connection
    │   │   ├── Slow_Speed
    │   │   └── Intermittent_Connection
    │   ├── Equipment_Issue
    │   └── Service_Outage
    └── Account_Management_Root
        ├── Update_Address
        ├── Add_Service
        └── Cancel_Service
```

## Intent Design Template

For each intent, define:

**Intent Name:** `billing.payment.creditcard`

**Training Phrases:** (Minimum 20-30 diverse examples)
```
- I need to pay my bill
- Can I make a payment?
- How do I pay with credit card?
- I want to pay using my Visa
- Pay bill by card
- Credit card payment please
- Make a payment on my account
```

**Parameters to Extract:**

| Parameter | Entity Type | Required | Prompts |
|-----------|-------------|----------|---------|
| `card_type` | @sys.credit-card-type | No | "What type of card?" |
| `payment_amount` | @sys.currency-amount | Yes | "How much would you like to pay?" |
| `payment_date` | @sys.date | No | "When would you like this processed?" |

**Webhook Requirements:**
- Validate card (Luhn algorithm)
- Check payment amount vs balance
- Process payment via payment gateway
- Generate confirmation number

## Entity Design

**System Entities (Built-in):**
- `@sys.date` - Dates and date ranges
- `@sys.time` - Time expressions
- `@sys.number` - Numeric values
- `@sys.currency-amount` - Money amounts
- `@sys.phone-number` - Phone numbers
- `@sys.email` - Email addresses

**Custom Entities:**

**Service Types:**
```
@service_type:
- internet (synonyms: broadband, wifi, wireless)
- phone (synonyms: telephone, landline, voip)
- tv (synonyms: television, cable, streaming)
- mobile (synonyms: cell, cellular, wireless)
```

**Account Actions:**
```
@account_action:
- upgrade (synonyms: increase, enhance, improve)
- downgrade (synonyms: decrease, reduce, lower)
- cancel (synonyms: terminate, disconnect, end)
- suspend (synonyms: pause, hold, freeze)
```

**Regex Entities:**
```
@account_number: Pattern: [A-Z]{2}\d{8}
@order_id: Pattern: ORD-\d{6}
```

---

## 7.3.4 Speech and NLU Flow Diagrams

## High-Level Conversation Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    Customer Initiates Contact                    │
│               (Phone call to contact center number)              │
└───────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Entry Point / IVR (Webex CC)                   │
│          "Thank you for calling. Please hold while I             │
│           connect you to our virtual assistant."                 │
└───────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                Virtual Agent V2 Activity Triggers                │
│              (Webex CC Flow Designer hands off)                  │
└───────────────────────────────┬─────────────────────────────────┘
                                 │
                   Speech Stream (RTP/SRTP)
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              Google Speech-to-Text (Real-time ASR)               │
│            Converts audio → text for NLU processing              │
└───────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              Dialogflow CX NLU Engine                            │
│   ┌──────────────────────────────────────────────────────┐     │
│   │  Intent Matching (ML-based)                          │     │
│   │  • Analyzes user input                               │     │
│   │  • Matches to trained intents                        │     │
│   │  • Extracts entities/parameters                      │     │
│   │  • Confidence scoring                                │     │
│   └──────────────────────────────────────────────────────┘     │
└───────────────────────────────┬─────────────────────────────────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                 │
                ▼                ▼                 ▼
         High Confidence   Medium Confidence   No Match
         (Intent Matched)  (Clarify)           (Fallback)
                │                │                 │
                ▼                ▼                 ▼
        ┌────────────┐    ┌────────────┐   ┌──────────────┐
        │  Execute   │    │Clarification│   │   Fallback   │
        │  Page Flow │    │   Prompt    │   │   Handler    │
        └──────┬─────┘    └──────┬─────┘   └──────┬───────┘
               │                 │                  │
               └─────────────────┴──────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Form Filling / Parameter Collection             │
│  Collects required parameters through conversation:              │
│  • Account number                                                │
│  • Service details                                               │
│  • Issue description                                             │
└───────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Webhook Invocation                           │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  POST https://webhook.example.com/dialogflow         │      │
│  │  {                                                    │      │
│  │    "sessionInfo": {...},                             │      │
│  │    "fulfillmentInfo": {...},                         │      │
│  │    "pageInfo": {...}                                 │      │
│  │  }                                                    │      │
│  └──────────────────────────────────────────────────────┘      │
│                        │                                         │
│                        ▼                                         │
│            ┌────────────────────────┐                           │
│            │  Backend Systems       │                           │
│            │  • CRM                 │                           │
│            │  • Billing             │                           │
│            │  • Inventory           │                           │
│            └───────────┬────────────┘                           │
│                        │                                         │
│                        ▼                                         │
│            ┌────────────────────────┐                           │
│            │  Business Logic        │                           │
│            │  • Validate data       │                           │
│            │  • Process request     │                           │
│            │  • Generate response   │                           │
│            └───────────┬────────────┘                           │
│                        │                                         │
│                        ▼                                         │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  Webhook Response                                     │      │
│  │  {                                                    │      │
│  │    "fulfillment_response": {                         │      │
│  │      "messages": [{                                  │      │
│  │        "text": {                                     │      │
│  │          "text": ["Your request was processed"]     │      │
│  │        }                                             │      │
│  │      }]                                              │      │
│  │    }                                                 │      │
│  │  }                                                   │      │
│  └──────────────────────────────────────────────────────┘      │
└───────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  Response Generation                             │
│  Dialogflow CX creates response fulfillment                      │
│  • Dynamic responses from webhook                                │
│  • Static responses from agent config                            │
│  • Error handling messages                                       │
└───────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                 Google Text-to-Speech (TTS)                      │
│             Converts text response → natural speech              │
│          (50+ voices, 30+ languages supported)                   │
└───────────────────────────────┬─────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│              Speech Stream Back to Customer (RTP)                │
│                   Via Webex CC media path                        │
└───────────────────────────────┬─────────────────────────────────┘
                                 │
                    ┌────────────┴──────────────┐
                    │                           │
                    ▼                           ▼
            ┌───────────────┐         ┌─────────────────┐
            │  Conversation │         │  Escalate to    │
            │  Ends         │         │  Live Agent     │
            │  (Handled)    │         │  (Transfer)     │
            └───────────────┘         └─────────────────┘
```

## Detailed Intent Matching Process

```
User Input: "I need to pay my bill"
         │
         ▼
┌─────────────────────────────────────────────────────┐
│  Step 1: Speech-to-Text                              │
│  Audio → "I need to pay my bill"                     │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  Step 2: NLU Processing                              │
│  • Tokenization: ["I", "need", "to", "pay", "my",   │
│                   "bill"]                            │
│  • Intent Classification (ML model)                  │
│  • Confidence Scoring                                │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  Step 3: Intent Matching Results                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  Intent: billing.payment   Confidence: 0.97   │  │
│  │  Intent: billing.inquiry   Confidence: 0.15   │  │
│  │  Intent: account.balance   Confidence: 0.09   │  │
│  └───────────────────────────────────────────────┘  │
│                                                      │
│  Match Threshold: 0.70                               │
│  Result: billing.payment matched ✓                   │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  Step 4: Entity Extraction                           │
│  Input: "I need to pay my bill"                      │
│  Entities Extracted: None (no specific entities)     │
│                                                      │
│  Required Parameters:                                │
│  • payment_amount: [missing]                         │
│  • payment_method: [missing]                         │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  Step 5: Form Filling                                │
│  Prompt: "What amount would you like to pay?"        │
│  User: "150 dollars"                                 │
│  → payment_amount: $150.00 ✓                         │
│                                                      │
│  Prompt: "How would you like to pay?"                │
│  User: "Credit card"                                 │
│  → payment_method: "credit_card" ✓                   │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  Step 6: Webhook Call                                │
│  All parameters collected → Invoke webhook           │
│  Process payment in backend system                   │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│  Step 7: Confirmation                                │
│  TTS: "Your payment of $150 has been processed.     │
│        Your confirmation number is 12345678.         │
│        Is there anything else I can help you with?"  │
└─────────────────────────────────────────────────────┘
```

---

## 7.3.5 IVR to Virtual Agent Handoff Design

## Handoff Strategy

**Option 1: Direct Handoff (Recommended)**
- Entry Point → Virtual Agent V2 Activity immediately
- Best for: Full virtual agent experience, maximum automation

**Option 2: IVR Pre-Screening**
- Entry Point → IVR Menu → Virtual Agent V2 Activity
- Best for: High-level routing before AI engagement

**Option 3: Hybrid Approach**
- Entry Point → IVR (Language/Basic Auth) → Virtual Agent → Live Agent
- Best for: Compliance requirements, multi-language support

## Implementation Pattern

**Webex CC Flow Designer Configuration:**

```
Flow: Main_Contact_Center_Flow
├── Play_Greeting_Message
│   └── Message: "Thank you for calling. Please hold."
│
├── Collect_Language_Preference (Optional)
│   ├── English → Set Variable: language = "en-US"
│   └── Spanish → Set Variable: language = "es-ES"
│
├── Virtual_Agent_V2_Activity
│   ├── CCAI Config ID: [from Control Hub]
│   ├── Project ID: [GCP Project]
│   ├── Agent ID: [Dialogflow CX Agent]
│   ├── Language Code: {{language}}
│   ├── Session Parameters:
│   │   └── Pass: ANI, DNIS, EntryPointID, Queue
│   │
│   ├── On Handled: → Play_Completion_Message → Disconnect
│   │
│   └── On Escalated: → Queue_To_Agent
│       └── Pass collected_data to CAD variables
```

**Parameter Passing to Dialogflow CX:**

| Webex CC Variable | Dialogflow CX Parameter | Purpose |
|-------------------|-------------------------|---------|
| `NewPhoneContact.ANI` | `caller_phone_number` | Customer identification |
| `NewPhoneContact.DNIS` | `dialed_number` | Service line identification |
| `EntryPointName` | `entry_point_name` | Call routing context |
| `Queue.Name` | `queue_name` | Target queue if escalated |
| `CallID` | `call_id` | Unique call identifier |
| `Custom_CustomerID` | `customer_id` | CRM lookup key |

## Custom Event Configuration

**Triggering Custom Events from Webex CC:**

In Dialogflow CX, configure custom event handlers:

**Event Name:** `webex.escalate.billing`

**Handler Configuration:**
```json
{
  "event": "webex.escalate.billing",
  "transition": {
    "targetPage": "Escalation_Page"
  },
  "triggerFulfillment": {
    "messages": [
      {
        "text": {
          "text": ["Let me connect you to our billing department."]
        }
      }
    ]
  }
}
```

**Triggering from Flow Designer:**

Use **Virtual Agent Event** activity:
- Event Name: `webex.escalate.billing`
- Event Parameters: `{"reason": "complex_billing_issue", "priority": "high"}`

---

## 7.3.6 Webhook Architecture and API Design

## Webhook Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      Dialogflow CX Agent                         │
│   (Detects need for backend processing)                         │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                  HTTPS POST (TLS 1.2+)
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                  API Gateway / Load Balancer                     │
│   • Rate limiting                                                │
│   • Authentication validation                                    │
│   • Request routing                                              │
└───────────────────────────┬─────────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
    ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
    │  Webhook    │ │  Webhook    │ │  Webhook    │
    │  Instance 1 │ │  Instance 2 │ │  Instance 3 │
    └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
           │               │               │
           └───────────────┴───────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │   Backend Services            │
            │   ┌─────────────────────────┐ │
            │   │ CRM (Salesforce)        │ │
            │   │ Billing System          │ │
            │   │ Inventory Management    │ │
            │   │ Authentication Service  │ │
            │   │ Payment Gateway         │ │
            │   └─────────────────────────┘ │
            └───────────────────────────────┘
```

## Webhook Request Structure

**Dialogflow CX sends webhook request:**

```json
{
  "detectIntentResponseId": "12345abc",
  "intentInfo": {
    "lastMatchedIntent": "projects/.../intents/billing.payment",
    "displayName": "billing.payment",
    "confidence": 0.95
  },
  "pageInfo": {
    "currentPage": "projects/.../pages/PaymentPage",
    "displayName": "PaymentPage",
    "formInfo": {
      "parameterInfo": [
        {
          "displayName": "payment_amount",
          "required": true,
          "state": "FILLED",
          "value": 150.00
        },
        {
          "displayName": "payment_method",
          "required": true,
          "state": "FILLED",
          "value": "credit_card"
        }
      ]
    }
  },
  "sessionInfo": {
    "session": "projects/.../sessions/abc123",
    "parameters": {
      "customer_id": "C12345",
      "account_number": "ACC987654",
      "caller_phone_number": "+14155551234"
    }
  },
  "fulfillmentInfo": {
    "tag": "process_payment"
  },
  "messages": [
    {
      "text": {
        "text": ["I want to pay 150 dollars with my credit card"],
        "redactedText": ["I want to pay 150 dollars with my credit card"]
      },
      "languageCode": "en"
    }
  ],
  "payload": {
    "webex_call_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

## Webhook Response Structure

**Your webhook must respond with:**

```json
{
  "fulfillment_response": {
    "messages": [
      {
        "text": {
          "text": [
            "Your payment of $150.00 has been successfully processed. Your confirmation number is TXN-20230615-12345. Is there anything else I can help you with today?"
          ]
        }
      }
    ]
  },
  "session_info": {
    "parameters": {
      "payment_confirmation": "TXN-20230615-12345",
      "payment_status": "completed",
      "remaining_balance": 234.56
    }
  },
  "page_info": {
    "current_page": "projects/.../pages/PaymentConfirmationPage"
  }
}
```

**Error Response:**

```json
{
  "fulfillment_response": {
    "messages": [
      {
        "text": {
          "text": [
            "I'm sorry, but I'm having trouble processing your payment right now. Let me connect you with one of our billing specialists who can help you complete this transaction."
          ]
        }
      }
    ]
  },
  "page_info": {
    "current_page": "projects/.../pages/EscalationPage"
  },
  "target_flow": "projects/.../flows/AgentEscalationFlow"
}
```

## Webhook Implementation Example (Node.js)

**Sample Webhook using Express.js:**

```javascript
const express = require('express');
const app = express();
app.use(express.json());

// Webhook endpoint
app.post('/dialogflow', async (req, res) => {
  const tag = req.body.fulfillmentInfo.tag;
  const sessionParams = req.body.sessionInfo.parameters;
  const pageParams = req.body.pageInfo.formInfo.parameterInfo;
  
  let response = {};
  
  try {
    switch(tag) {
      case 'process_payment':
        response = await processPayment(sessionParams, pageParams);
        break;
      case 'check_account_balance':
        response = await checkBalance(sessionParams);
        break;
      case 'create_service_ticket':
        response = await createTicket(sessionParams, pageParams);
        break;
      default:
        response = {
          fulfillment_response: {
            messages: [{
              text: {
                text: ["I can help you with that. Let me find the information."]
              }
            }]
          }
        };
    }
    
    // Set timeout handling
    res.setTimeout(15000, () => {
      res.status(504).json({
        fulfillment_response: {
          messages: [{
            text: {
              text: ["I'm experiencing some delays. Let me connect you to an agent."]
            }
          }]
        }
      });
    });
    
    res.json(response);
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({
      fulfillment_response: {
        messages: [{
          text: {
            text: ["I encountered an error. Let me transfer you to an agent who can assist you."]
          }
        }]
      },
      page_info: {
        current_page: "projects/.../pages/ErrorEscalationPage"
      }
    });
  }
});

async function processPayment(sessionParams, pageParams) {
  // Extract parameters
  const customerId = sessionParams.customer_id;
  const paymentAmount = getParameterValue(pageParams, 'payment_amount');
  const paymentMethod = getParameterValue(pageParams, 'payment_method');
  
  // Call payment gateway API
  const paymentResult = await paymentGateway.process({
    customer_id: customerId,
    amount: paymentAmount,
    method: paymentMethod
  });
  
  if (paymentResult.success) {
    return {
      fulfillment_response: {
        messages: [{
          text: {
            text: [`Your payment of $${paymentAmount} has been processed successfully. Your confirmation number is ${paymentResult.confirmationNumber}.`]
          }
        }]
      },
      session_info: {
        parameters: {
          payment_confirmation: paymentResult.confirmationNumber,
          payment_status: 'completed',
          remaining_balance: paymentResult.remainingBalance
        }
      }
    };
  } else {
    return {
      fulfillment_response: {
        messages: [{
          text: {
            text: [`I'm unable to process your payment at this time. Error: ${paymentResult.errorMessage}. Would you like me to connect you to a billing specialist?`]
          }
        }]
      },
      session_info: {
        parameters: {
          payment_status: 'failed',
          error_reason: paymentResult.errorMessage
        }
      }
    };
  }
}

function getParameterValue(parameterInfo, paramName) {
  const param = parameterInfo.find(p => p.displayName === paramName);
  return param ? param.value : null;
}

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Webhook listening on port ${PORT}`);
});
```

## Webhook Best Practices

**1. Performance Requirements:**

| Metric | Target | Critical |
|--------|--------|----------|
| **Response Time** | < 3 seconds | < 5 seconds |
| **Timeout Setting** | 15-20 seconds | 30 seconds max |
| **Success Rate** | > 99.9% | > 99% |
| **Concurrent Requests** | Handle 100+ | Handle 50+ |

**2. Error Handling:**

```javascript
// Implement retry logic for transient failures
async function callBackendWithRetry(apiCall, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await apiCall();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      if (isTransientError(error)) {
        await delay(Math.pow(2, attempt) * 1000); // Exponential backoff
      } else {
        throw error; // Don't retry non-transient errors
      }
    }
  }
}

function isTransientError(error) {
  return error.code === 'ETIMEDOUT' || 
         error.code === 'ECONNRESET' ||
         (error.response && error.response.status >= 500);
}
```

**3. Logging and Monitoring:**

```javascript
// Structured logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'dialogflow-webhook' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log all webhook requests
app.use((req, res, next) => {
  logger.info('Webhook request', {
    session_id: req.body.sessionInfo?.session,
    intent: req.body.intentInfo?.displayName,
    tag: req.body.fulfillmentInfo?.tag,
    timestamp: new Date().toISOString()
  });
  next();
});
```

---

## 7.3.7 Authentication Framework (OAuth, Service Accounts)

## Authentication Methods

**1. Service Account Authentication (Recommended for Server-to-Server)**

**Use Case:** Webhook to backend APIs, Dialogflow API calls from Webex CC

**Implementation:**

**Step 1: Create Service Account in GCP**

```bash
## Create service account
gcloud iam service-accounts create dialogflow-webhook-sa \
    --display-name="Dialogflow Webhook Service Account" \
    --project=YOUR_PROJECT_ID

## Grant necessary roles
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:dialogflow-webhook-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/dialogflow.admin"

## Create and download key
gcloud iam service-accounts keys create ~/dialogflow-sa-key.json \
    --iam-account=dialogflow-webhook-sa@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

**Step 2: Use Service Account in Webhook**

```javascript
const { GoogleAuth } = require('google-auth-library');

async function authenticateServiceAccount() {
  const auth = new GoogleAuth({
    keyFilename: './dialogflow-sa-key.json',
    scopes: ['https://www.googleapis.com/auth/cloud-platform']
  });
  
  const client = await auth.getClient();
  const accessToken = await client.getAccessToken();
  
  return accessToken.token;
}

// Use in API calls
async function callDialogflowAPI() {
  const token = await authenticateServiceAccount();
  
  const response = await fetch('https://dialogflow.googleapis.com/v3/...', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({...})
  });
  
  return response.json();
}
```

**2. OAuth 2.0 Client Credentials Flow**

**Use Case:** Third-party webhook servers, external integrations

**Configuration in Dialogflow CX:**

```
Webhook Configuration:
├── Display Name: External CRM Webhook
├── Generic Web Service:
│   ├── URL: https://api.crm-system.com/dialogflow-webhook
│   ├── Request Headers:
│   │   └── Authorization: Bearer <will be auto-populated>
│   └── OAuth Authentication:
│       ├── Client ID: [from CRM system]
│       ├── Client Secret: [stored in Secret Manager]
│       ├── Token URL: https://auth.crm-system.com/oauth/token
│       └── Scopes: dialogflow.webhook crm.read crm.write
└── Timeout: 20 seconds
```

**OAuth Token Exchange:**

```
1. Dialogflow CX requests token:
   POST https://auth.crm-system.com/oauth/token
   {
     "grant_type": "client_credentials",
     "client_id": "YOUR_CLIENT_ID",
     "client_secret": "YOUR_CLIENT_SECRET",
     "scope": "dialogflow.webhook"
   }

2. Auth server responds:
   {
     "access_token": "eyJhbGciOiJSUzI1NiIs...",
     "token_type": "Bearer",
     "expires_in": 3600
   }

3. Dialogflow CX includes token in webhook request:
   POST https://api.crm-system.com/dialogflow-webhook
   Authorization: Bearer eyJhbGciOiJSUzI1NiIs...
```

**3. Custom Authentication (API Keys, Basic Auth)**

**Using Secret Manager for Credentials:**

**Step 1: Store Secret**

```bash
## Store API key in Secret Manager
echo -n "your-api-key-here" | gcloud secrets create webhook-api-key \
    --data-file=- \
    --replication-policy="automatic" \
    --project=YOUR_PROJECT_ID

## Grant access to Dialogflow Service Agent
gcloud secrets add-iam-policy-binding webhook-api-key \
    --member="serviceAccount:service-PROJECT_NUMBER@gcp-sa-dialogflow.iam.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor"
```

**Step 2: Configure in Webhook**

```
Webhook Configuration:
├── Request Headers:
│   ├── X-API-Key: [Secret Manager: webhook-api-key]
│   └── Content-Type: application/json
└── Authentication: Custom headers
```

**Webhook Endpoint Validation:**

```javascript
const express = require('express');
const app = express();

// Middleware to validate API key
app.use('/dialogflow', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const expectedKey = process.env.WEBHOOK_API_KEY;
  
  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing API key'
    });
  }
  
  next();
});

// Webhook endpoint
app.post('/dialogflow', async (req, res) => {
  // Process webhook request
  // ...
});
```

## Security Best Practices

**1. TLS/HTTPS Requirements:**
- ✓ Enforce TLS 1.2 or higher
- ✓ Use valid SSL certificates (not self-signed in production)
- ✓ Enable HSTS headers
- ✓ Implement certificate pinning for critical connections

**2. Credential Management:**

| Practice | Implementation |
|----------|----------------|
| **Never hardcode secrets** | Use environment variables or Secret Manager |
| **Rotate credentials** | Implement 90-day rotation policy |
| **Principle of least privilege** | Grant minimum required IAM permissions |
| **Audit access** | Enable Cloud Audit Logs for all API calls |
| **Encrypt at rest** | Use Cloud KMS for sensitive data |

**3. Request Validation:**

```javascript
// Validate webhook request origin
function validateDialogflowRequest(req) {
  // Check for required Dialogflow headers
  const dialogflowHeaders = [
    'detectintentresponseid',
    'sessioninfo',
    'intentinfo'
  ];
  
  const requestBody = req.body;
  
  // Verify required fields exist
  if (!requestBody.sessionInfo || !requestBody.intentInfo) {
    throw new Error('Invalid Dialogflow request structure');
  }
  
  // Verify project ID matches expected
  const sessionPath = requestBody.sessionInfo.session;
  const expectedProject = process.env.GCP_PROJECT_ID;
  
  if (!sessionPath.includes(`projects/${expectedProject}`)) {
    throw new Error('Request from unexpected project');
  }
  
  return true;
}

app.post('/dialogflow', (req, res) => {
  try {
    validateDialogflowRequest(req);
    // Process request
    // ...
  } catch (error) {
    console.error('Invalid request:', error);
    return res.status(400).json({ error: 'Bad Request' });
  }
});
```

---

## 7.3.8 Data Anonymization and Privacy Controls

## PII Redaction Strategy

**Personal Identifiable Information (PII) Types:**

| PII Type | Examples | Redaction Method |
|----------|----------|------------------|
| **Name** | John Smith, Mary Johnson | Replace with [NAME] |
| **Phone Number** | +1-415-XX5-1234 | Replace with [PHONE_NUMBER] |
| **Email** | user@example.com | Replace with [EMAIL] |
| **Address** | 123 Main St, San Francisco | Replace with [ADDRESS] |
| **SSN/SIN** | 123-45-6789 | Replace with [SSN] |
| **Credit Card** | 4111-1111-1111-1111 | Replace with [CREDIT_CARD] |
| **Account Number** | ACC-9876543 | Replace with [ACCOUNT_NUMBER] |
| **Date of Birth** | 01/15/1985 | Replace with [DATE_OF_BIRTH] |

## Cloud DLP (Data Loss Prevention) Integration

**Step 1: Create DLP Inspection Template**

```bash
## Define custom info types
cat > dlp-config.json <<EOF
{
  "displayName": "Dialogflow CX PII Inspection",
  "description": "Template for redacting PII in Dialogflow conversations",
  "inspectConfig": {
    "infoTypes": [
      {"name": "PERSON_NAME"},
      {"name": "PHONE_NUMBER"},
      {"name": "EMAIL_ADDRESS"},
      {"name": "US_SOCIAL_SECURITY_NUMBER"},
      {"name": "CREDIT_CARD_NUMBER"},
      {"name": "STREET_ADDRESS"},
      {"name": "DATE_OF_BIRTH"}
    ],
    "minLikelihood": "LIKELY",
    "limits": {
      "maxFindingsPerRequest": 0
    },
    "customInfoTypes": [
      {
        "infoType": {"name": "ACCOUNT_NUMBER"},
        "regex": {"pattern": "ACC-[0-9]{7}"}
      },
      {
        "infoType": {"name": "ORDER_ID"},
        "regex": {"pattern": "ORD-[0-9]{6}"}
      }
    ]
  }
}
EOF

## Create inspection template
gcloud dlp inspect-templates create \
    --location=global \
    --config-from-file=dlp-config.json \
    --project=YOUR_PROJECT_ID \
    --template-id=dialogflow-pii-inspection
```

**Step 2: Create Security Settings in CCAI**

**Via Console:**
1. Navigate to `https://ccai.cloud.google.com`
2. Click "Create Security Settings"
3. Enter configuration:
   - **Display Name:** `Dialogflow-CX-Security`
   - **Data Retention:** 7 days (or as per compliance)
   - **Inspect Template:** `projects/YOUR_PROJECT_ID/locations/global/inspectTemplates/dialogflow-pii-inspection`
   - **Deidentify Template:** Create with redaction strategy
   - **Redaction Strategy:** REDACT (replace with info type name)
   - **Redaction Scope:** All user queries and agent responses

**Via API:**

```bash
curl -X POST \
  'https://contactcenteraiplatform.googleapis.com/v2/projects/YOUR_PROJECT_ID/locations/global/securitySettings' \
  -H 'Authorization: Bearer $(gcloud auth print-access-token)' \
  -H 'Content-Type: application/json' \
  -d '{
    "displayName": "Dialogflow-CX-Security",
    "redactionStrategy": "REDACT_WITH_SERVICE",
    "redactionScope": "REDACT_DISK_STORAGE",
    "inspectTemplate": "projects/YOUR_PROJECT_ID/locations/global/inspectTemplates/dialogflow-pii-inspection",
    "retentionWindowDays": 7,
    "purgeDataTypes": [
      "DIALOGFLOW_HISTORY"
    ],
    "audioExportSettings": {
      "audioExportPattern": "AUDIO_EXPORT_PATTERN_UNSPECIFIED",
      "enableAudioRedaction": true,
      "audioFormat": "AUDIO_FORMAT_UNSPECIFIED"
    }
  }'
```

**Step 3: Apply Security Settings to Agent**

```
Dialogflow CX Console:
├── Select Agent
├── Agent Settings
├── Security Tab
└── Select Security Settings: "Dialogflow-CX-Security"
    └── Save
```

## Parameter-Level Redaction

**Mark parameters for redaction in fulfillment messages:**

```xml
<speak>
  Your account number is 
  <mark name="redact-start"/>ACC-9876543<mark name="redact-end"/>.
  Is there anything else I can help you with?
</speak>
```

**In Session Parameters:**

```json
{
  "session_info": {
    "parameters": {
      "customer_name": "<mark name='redact-start'/>John Smith<mark name='redact-end'/>",
      "account_number": "<mark name='redact-start'/>ACC-9876543<mark name='redact-end'/>",
      "phone_number": "<mark name='redact-start'/>+14155551234<mark name='redact-end'/>"
    }
  }
}
```

**Result in Cloud Logging:**

```json
{
  "session_info": {
    "parameters": {
      "customer_name": "[PERSON_NAME]",
      "account_number": "[ACCOUNT_NUMBER]",
      "phone_number": "[PHONE_NUMBER]"
    }
  }
}
```

## GDPR and Compliance

**Data Retention Configuration:**

| Data Type | Retention Period | Justification |
|-----------|------------------|---------------|
| **Conversation Logs** | 7-30 days | Debugging, quality assurance |
| **Audio Recordings** | 90 days | Compliance, dispute resolution |
| **Analytics Data** | 1 year | Trend analysis, model training |
| **PII (Redacted)** | 7 days | Minimal retention for security |

**User Data Rights:**

**Right to Erasure (GDPR Article 17):**

```bash
## Delete user conversations
gcloud alpha dialogflow cx conversations delete \
    --conversation=CONVERSATION_ID \
    --location=global \
    --project=YOUR_PROJECT_ID
```

**Right to Access (GDPR Article 15):**

```python
from google.cloud import dialogflow_cx_v3beta1 as dialogflow_cx

def export_user_data(project_id, location, conversation_id):
    client = dialogflow_cx.ConversationsClient()
    
    conversation_name = (
        f"projects/{project_id}/locations/{location}/"
        f"conversations/{conversation_id}"
    )
    
    conversation = client.get_conversation(name=conversation_name)
    
    # Export to GCS or return to user
    return conversation
```

**Consent Management:**

```javascript
// Capture user consent before processing
app.post('/dialogflow', (req, res) => {
  const sessionParams = req.body.sessionInfo.parameters;
  
  // Check if consent was provided
  if (!sessionParams.consent_given) {
    return res.json({
      fulfillment_response: {
        messages: [{
          text: {
            text: ["Before we proceed, I need your consent to process your personal information. Do you agree to our privacy policy?"]
          }
        }]
      },
      session_info: {
        parameters: {
          awaiting_consent: true
        }
      }
    });
  }
  
  // Process request with consent
  // ...
});
```

---

## 7.3.9 Virtual Agent Configuration Steps

## Prerequisites Checklist

- [ ] GCP Project created with billing enabled
- [ ] Dialogflow API enabled
- [ ] Cloud Functions API enabled (for webhooks)
- [ ] Cisco CCAI subscription provisioned (A2Q completed)
- [ ] Control Hub admin access
- [ ] Network access to Dialogflow endpoints verified

## Step-by-Step Configuration

**Step 1: Create Dialogflow CX Agent**

1. Navigate to [Dialogflow CX Console](https://dialogflow.cloud.google.com/cx)
2. Select your GCP project
3. Click **Create Agent**
4. Configure agent:
   - **Display Name:** `ContactCenter-VirtualAgent`
   - **Default Language:** `en-US`
   - **Default Time Zone:** `America/Los_Angeles`
   - **Location:** `global` (or region nearest to your users)
5. Click **Create**

**Step 2: Design Conversation Flows**

**Create Main Flow:**

1. In agent, navigate to **Flows**
2. Default Start Flow exists - customize it:
   - **Start Page** → Edit welcome intent
   - Add fulfillment message:
     ```
     Hello! I'm your virtual assistant. I can help you with:
     - Billing questions
     - Technical support
     - Account changes
     What can I help you with today?
     ```

**Create Sub-Flows:**

```
Main Flow
├── Billing Flow
│   ├── View Bill Page
│   ├── Pay Bill Page
│   └── Dispute Charge Page
├── Tech Support Flow
│   ├── Internet Issue Page
│   ├── Equipment Issue Page
│   └── Service Outage Page
└── Account Management Flow
    ├── Update Address Page
    ├── Add Service Page
    └── Cancel Service Page
```

**Step 3: Create Intents**

**Example: Billing Payment Intent**

1. Click **Manage** → **Intents** → **Create**
2. **Display Name:** `billing.payment`
3. **Training Phrases:** (Add 20-30)
   ```
   - I need to pay my bill
   - Can I make a payment
   - How do I pay
   - Pay my account
   - I want to pay using credit card
   - What's my balance and I'd like to pay
   ```
4. **Parameters:**
   - Add `payment_amount` (Type: `@sys.currency-amount`, Required: Yes)
   - Add `payment_method` (Type: `@payment_method_entity`, Required: Yes)
5. **Save**

**Step 4: Create Pages for Form Filling**

**Payment Page:**

1. In **Billing Flow**, click **+** → **Add Page**
2. **Display Name:** `PaymentPage`
3. **Entry Fulfillment:**
   ```
   I can help you make a payment. Let me gather some information.
   ```
4. **Form Parameters:**
   - **Parameter:** `payment_amount`
     - **Display Name:** Payment Amount
     - **Entity Type:** @sys.currency-amount
     - **Required:** Yes
     - **Initial Prompt:**
       ```
       How much would you like to pay today?
       ```
     - **Reprompt Event Handlers:**
       - No-match 1: "I didn't catch that amount. Could you please say the payment amount?"
       - No-match 2: "I'm having trouble understanding. For example, you can say '100 dollars' or '50 and 25 cents'."

   - **Parameter:** `payment_method`
     - **Display Name:** Payment Method
     - **Entity Type:** @payment_method_entity
     - **Required:** Yes
     - **Initial Prompt:**
       ```
       How would you like to pay? You can say credit card, bank account, or check.
       ```

5. **Routes:**
   - **Condition:** `$page.params.status = "FINAL"`
   - **Webhook:** `process_payment`
   - **Transition:** `Payment Confirmation Page`

**Step 5: Configure Webhooks**

**Create Webhook Resource:**

1. Click **Manage** → **Webhooks** → **Create**
2. **Display Name:** `payment-processor`
3. **Webhook URL:** `https://your-webhook-domain.com/dialogflow`
4. **Timeout:** 20 seconds
5. **Authentication:**
   - **Type:** OAuth Client Credentials
   - **Client ID:** [from your auth provider]
   - **Client Secret:** [stored in Secret Manager]
   - **Token URL:** `https://auth.your-domain.com/oauth/token`
6. **Request Headers:**
   - `Content-Type`: `application/json`
7. **Save**

**Assign Webhook to Page:**

1. Return to `PaymentPage`
2. In **Routes**, add:
   - **Condition:** All parameters filled
   - **Fulfillment:** Call webhook `payment-processor` with tag `process_payment`
   - **Transition:** `PaymentConfirmationPage`

**Step 6: Create Event Handlers**

**System Events:**

1. In flow, click **Event Handlers**
2. Add handlers for:
   - `sys.no-match-1`: Clarification prompt
   - `sys.no-match-2`: Detailed help
   - `sys.no-match-3`: Escalate to agent
   - `sys.no-input-1`: Prompt again
   - `sys.no-input-2`: Offer help
   - `sys.no-input-3`: Escalate or disconnect

**Custom Events:**

Create event for agent escalation:
- **Event:** `escalate-to-agent`
- **Fulfillment:** "Let me connect you to a specialist."
- **Transition:** `EscalationPage`

**Step 7: Configure Test Cases**

1. Navigate to **Test and Deploy** → **Test Cases**
2. Click **Create Test Case**
3. **Display Name:** `Billing Payment Happy Path`
4. **Test Conversation Turns:**
   ```
   User: I need to pay my bill
   Agent: I can help you make a payment. How much would you like to pay today?
   User: 150 dollars
   Agent: How would you like to pay? You can say credit card, bank account, or check.
   User: Credit card
   Agent: Your payment of $150.00 has been processed. Your confirmation number is...
   ```
5. **Expected Result:** Conversation ends with payment confirmation
6. **Save and Run Test**

**Step 8: Configure Security Settings**

1. Follow steps in Section 7.3.8 to create Security Settings
2. In agent, go to **Settings** → **Security**
3. Select security settings created earlier
4. **Data Retention:** 7 days
5. **Save**

**Step 9: Create Google CCAI Connector in Control Hub**

1. Log into [Webex Control Hub](https://admin.webex.com)
2. Navigate to **Contact Center** → **Connectors**
3. Find **Google Contact Center AI** card
4. Click **Set Up**
5. **Authentication:**
   - Select **Google CCAI**
   - Authenticate with GCP account
   - Authorize Cisco to access project
6. **Connector Created Successfully**

**Step 10: Create CCAI Config Feature**

1. In Control Hub, go to **Contact Center** → **Features**
2. Click **New** → **Contact Center AI Config**
3. **Configuration:**
   - **Feature Name:** `VirtualAgent-Billing-Support`
   - **Google CCAI Connector:** Select connector created in Step 9
   - **Virtual Agent Type:** Dialogflow CX
   - **Conversation Profile ID:** Copy from Dialogflow CX
     - In Dialogflow CX: **Agent Assist** → **Conversation Profile**
     - Copy the Profile ID
4. **Save**
5. **Note the CCAI Config ID** (needed for Flow Designer)

**Step 11: Configure Virtual Agent in Flow Designer**

1. Log into **Webex Contact Center Management Portal**
2. Navigate to **Routing Strategy** → **Flow Designer**
3. Create or edit flow
4. Add **Virtual Agent V2** activity:
   - **CCAI Config:** Select `VirtualAgent-Billing-Support`
   - **Language Code:** `en-US`
   - **Session Parameters:** Pass from flow:
     ```
     caller_phone_number: {{NewPhoneContact.ANI}}
     customer_id: {{Custom_CustomerID}}
     queue_name: {{Queue.Name}}
     ```

5. **Connect Outputs:**
   - **Handled** → Play completion message → Disconnect
   - **Escalated** → Queue to Agent activity
   - **Errored** → Queue to Agent (with high priority)

6. **Validate and Publish Flow**

**Step 12: Testing End-to-End**

1. **Test from Dialogflow CX Console:**
   - Use **Test Agent** in right panel
   - Verify intent matching
   - Test parameter collection
   - Verify webhook responses

2. **Test from Flow Designer:**
   - Use **Debug Mode**
   - Monitor activity transitions
   - Verify variable passing

3. **Test Live Call:**
   - Call contact center number
   - Complete full conversation
   - Verify escalation paths
   - Check CAD variable population

**Step 13: Monitor and Optimize**

1. **Enable Logging:**
   - Dialogflow: **Agent Settings** → **General** → Enable Cloud Logging
   - Webex CC: Enable debug logging for flow

2. **Review Metrics:**
   - Intent matching accuracy
   - Form completion rates
   - Escalation reasons
   - Average conversation duration

3. **Iterate:**
   - Add training phrases for low-confidence intents
   - Optimize prompts for confusing parameters
   - Update webhook logic based on errors

---

## 7.3.10 Virtual Agent Validation and Testing

## Testing Strategy

**Testing Pyramid:**

```
        ┌─────────────────────┐
        │   Manual Testing    │  10%
        │  (Exploratory)      │
        ├─────────────────────┤
        │  Integration Tests  │  30%
        │  (End-to-End)       │
        ├─────────────────────┤
        │    Unit Tests       │  60%
        │  (Intent/Entity)    │
        └─────────────────────┘
```

## Validation Checklist

**Pre-Production Validation:**

| Test Category | Test Items | Status |
|---------------|------------|--------|
| **Intent Recognition** | ✓ All intents have 20+ training phrases | □ |
| | ✓ Test with variations and synonyms | □ |
| | ✓ Verify confidence scores > 0.70 | □ |
| | ✓ Test edge cases and ambiguous inputs | □ |
| **Entity Extraction** | ✓ System entities extract correctly | □ |
| | ✓ Custom entities match expected values | □ |
| | ✓ Regex entities validate patterns | □ |
| **Form Filling** | ✓ Required parameters prompt correctly | □ |
| | ✓ Reprompts trigger on no-match | □ |
| | ✓ Parameter validation works | □ |
| | ✓ Context preserved across turns | □ |
| **Webhooks** | ✓ All webhooks respond < 5 seconds | □ |
| | ✓ Error handling gracefully degrades | □ |
| | ✓ Retry logic for transient failures | □ |
| | ✓ PII redaction working correctly | □ |
| **Escalation** | ✓ 3 no-match triggers escalation | □ |
| | ✓ Context passed to live agent | □ |
| | ✓ Custom escalation events work | □ |
| **Multi-Language** | ✓ All languages tested | □ |
| | ✓ TTS quality verified | □ |
| | ✓ Translation accuracy checked | □ |

## Test Scenarios

**Scenario 1: Happy Path - Billing Payment**

| Turn | User Input | Expected Agent Response | Validation |
|------|------------|------------------------|------------|
| 1 | "I want to pay my bill" | Intent: `billing.payment` matched | ✓ Confidence > 0.70 |
| 2 | Agent: "How much would you like to pay?" | Form prompting for `payment_amount` | ✓ Parameter state = EMPTY |
| 3 | User: "One hundred fifty dollars" | Entity: `$150.00` extracted | ✓ Entity type = currency |
| 4 | Agent: "How would you like to pay?" | Form prompting for `payment_method` | ✓ Parameter state = EMPTY |
| 5 | User: "Credit card" | Entity: `credit_card` extracted | ✓ Custom entity matched |
| 6 | Webhook call | Payment processed | ✓ Response < 3 seconds |
| 7 | Agent: "Your payment of $150 has been processed. Confirmation: TXN-12345" | Confirmation message with transaction ID | ✓ Session param populated |
| 8 | **Result:** Conversation handled | | ✓ Handled path taken |

**Scenario 2: Error Handling - Payment Failure**

| Turn | User Input | Expected Agent Response | Validation |
|------|------------|------------------------|------------|
| 1-5 | [Same as Scenario 1] | [Same as Scenario 1] | |
| 6 | Webhook call | Payment gateway error | ✓ Error caught |
| 7 | Agent: "I'm unable to process your payment right now. Let me connect you to a billing specialist." | Error handling message | ✓ Graceful degradation |
| 8 | **Result:** Escalated to agent | Context: `payment_failed`, `amount: $150` | ✓ Context passed |

**Scenario 3: No-Match Escalation**

| Turn | User Input | Expected Agent Response | Validation |
|------|------------|------------------------|------------|
| 1 | "I need help" | Agent: "I can help you with billing, technical support, or account changes. What do you need?" | ✓ Generic greeting |
| 2 | User: "Potato" | Intent: No-match 1 | ✓ Fallback triggered |
| 3 | Agent: "I didn't quite catch that. Are you asking about billing, technical support, or account information?" | Clarification prompt | ✓ No-match-1 handler |
| 4 | User: "Tomato" | Intent: No-match 2 | ✓ Fallback triggered |
| 5 | Agent: "I'm here to help. Could you say 'billing' for billing questions, 'support' for technical help, or 'account' for account changes?" | More specific help | ✓ No-match-2 handler |
| 6 | User: "Banana" | Intent: No-match 3 | ✓ Fallback triggered |
| 7 | Agent: "Let me connect you to a specialist who can better assist you." | Escalation message | ✓ No-match-3 handler |
| 8 | **Result:** Escalated to agent | Context: `escalation_reason: no_match_exceeded` | ✓ Context passed |

**Scenario 4: No-Input Handling**

| Turn | User Input | Expected Agent Response | Validation |
|------|------------|------------------------|------------|
| 1 | Agent: "Hello, how can I help you today?" | Initial greeting | |
| 2 | User: [silence for 5 seconds] | System: No-input 1 | ✓ No-input detected |
| 3 | Agent: "Are you still there? I can help with billing, technical support, or account information." | Reprompt | ✓ No-input-1 handler |
| 4 | User: [silence for 5 seconds] | System: No-input 2 | ✓ No-input detected |
| 5 | Agent: "If you need a moment, that's okay. Please say or press 1 for billing, 2 for support, or 3 for account help." | Detailed reprompt | ✓ No-input-2 handler |
| 6 | User: [silence for 5 seconds] | System: No-input 3 | ✓ No-input detected |
| 7 | Agent: "I haven't heard from you. I'll end this call now. Please call back when you're ready." | Disconnect message | ✓ No-input-3 handler |
| 8 | **Result:** Call disconnected | | ✓ Conversation ended |

## Automated Testing

**Using Dialogflow CX Test Cases:**

```python
from google.cloud import dialogflow_cx_v3beta1 as dialogflow_cx

def run_test_suite(project_id, location, agent_id):
    client = dialogflow_cx.TestCasesClient()
    
    # Get all test cases
    agent_path = f"projects/{project_id}/locations/{location}/agents/{agent_id}"
    test_cases = client.list_test_cases(parent=agent_path)
    
    results = []
    for test_case in test_cases:
        # Run test case
        result = client.run_test_case(
            name=test_case.name
        )
        
        # Check result
        results.append({
            'test_name': test_case.display_name,
            'status': result.result.test_result,
            'conversation_turns': len(result.result.conversation_turns)
        })
    
    return results

## Run tests
test_results = run_test_suite(
    project_id='your-project-id',
    location='global',
    agent_id='your-agent-id'
)

for result in test_results:
    print(f"Test: {result['test_name']} - Status: {result['status']}")
```

## Load Testing

**Simulate Concurrent Users:**

```python
import asyncio
import aiohttp
from datetime import datetime

async def simulate_conversation(session, conversation_id):
    """Simulate a single conversation"""
    url = "https://dialogflow.googleapis.com/v3/projects/{project}/locations/{location}/agents/{agent}/sessions/{session}:detectIntent"
    
    headers = {
        "Authorization": f"Bearer {get_access_token()}",
        "Content-Type": "application/json"
    }
    
    # Simulate conversation turns
    turns = [
        "I need to pay my bill",
        "150 dollars",
        "Credit card"
    ]
    
    start_time = datetime.now()
    
    for turn in turns:
        payload = {
            "queryInput": {
                "text": {"text": turn},
                "languageCode": "en-US"
            }
        }
        
        async with session.post(url, json=payload, headers=headers) as response:
            result = await response.json()
            # Process result
    
    end_time = datetime.now()
    duration = (end_time - start_time).total_seconds()
    
    return {
        "conversation_id": conversation_id,
        "duration": duration,
        "success": True
    }

async def load_test(num_concurrent_users=100):
    """Run load test with concurrent users"""
    async with aiohttp.ClientSession() as session:
        tasks = [
            simulate_conversation(session, f"test-conv-{i}")
            for i in range(num_concurrent_users)
        ]
        
        results = await asyncio.gather(*tasks)
        
        # Analyze results
        total_conversations = len(results)
        successful = sum(1 for r in results if r['success'])
        avg_duration = sum(r['duration'] for r in results) / total_conversations
        
        print(f"Total Conversations: {total_conversations}")
        print(f"Successful: {successful}")
        print(f"Success Rate: {(successful/total_conversations)*100:.2f}%")
        print(f"Average Duration: {avg_duration:.2f} seconds")

## Run load test
asyncio.run(load_test(num_concurrent_users=100))
```

**Performance Targets:**

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| **Average Response Time** | < 3 seconds | < 5 seconds |
| **Success Rate** | > 99% | > 95% |
| **Intent Confidence** | > 0.80 | > 0.70 |
| **Containment Rate** | > 60% | > 40% |
| **Concurrent Sessions** | 100+ | 50+ |

---

## 7.3.11 Virtual Agent Troubleshooting

## Common Issues and Resolutions

**Issue 1: Low Intent Matching Confidence**

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Intent matched with confidence < 0.70 | Insufficient training phrases | Add 10-20 more diverse training phrases |
| | Ambiguous intents | Merge similar intents or make them more distinct |
| | User input too vague | Improve clarification prompts |

**Troubleshooting Steps:**

1. Check intent matching in Test Agent:
   ```
   User: "I have a problem"
   
   Results:
   - billing.inquiry (0.45)
   - technical_support (0.42)
   - account_issue (0.38)
   
   Issue: No clear winner, all low confidence
   ```

2. Analyze training phrases:
   - Are they diverse enough?
   - Do they cover different phrasings?
   - Are there enough (20-30 minimum)?

3. Solution:
   - Add more specific training phrases
   - Use entity extraction to differentiate
   - Implement clarification flow:
     ```
     Agent: "I can help with that. Are you having a billing issue, 
            technical problem, or account question?"
     ```

**Issue 2: Webhook Timeouts**

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Webhook response time > 15 seconds | Backend API slow | Optimize API calls, add caching |
| | Database queries taking too long | Index database tables, optimize queries |
| | Network latency | Deploy webhook closer to backend systems |

**Troubleshooting Steps:**

1. Check webhook logs:
   ```json
   {
     "webhook": "payment-processor",
     "request_time": "2023-06-15T14:23:10Z",
     "response_time": "2023-06-15T14:23:28Z",
     "duration_ms": 18000,
     "status": "timeout"
   }
   ```

2. Identify bottleneck:
   - Database query: 12 seconds
   - External API call: 5 seconds
   - Processing: 1 second

3. Solution:
   ```javascript
   // Add timeout and circuit breaker
   const axios = require('axios');
   const CircuitBreaker = require('opossum');
   
   // Configure circuit breaker
   const options = {
     timeout: 3000, // 3 seconds
     errorThresholdPercentage: 50,
     resetTimeout: 30000
   };
   
   const breaker = new CircuitBreaker(callPaymentAPI, options);
   
   breaker.fallback(() => {
     return {
       success: false,
       message: "Payment service temporarily unavailable"
     };
   });
   
   // Use in webhook
   async function processPayment(data) {
     try {
       const result = await breaker.fire(data);
       return result;
     } catch (error) {
       // Graceful degradation
       return {
         escalate: true,
         reason: "payment_service_unavailable"
       };
     }
   }
   ```

**Issue 3: Context Not Preserved**

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Parameters lost between turns | Session timeout | Increase session TTL |
| | Parameters not in session scope | Use session parameters not page parameters |
| | Flow transition clears context | Pass parameters explicitly |

**Troubleshooting Steps:**

1. Check session parameters:
   ```json
   // Turn 1
   {
     "session_info": {
       "parameters": {
         "customer_id": "C12345",
         "account_type": "premium"
       }
     }
   }
   
   // Turn 2 (after transition)
   {
     "session_info": {
       "parameters": {
         // Empty! Context lost
       }
     }
   }
   ```

2. Solution:
   - Use session-scoped parameters
   - In webhook, always return session parameters:
     ```json
     {
       "session_info": {
         "parameters": {
           "customer_id": "C12345",
           "account_type": "premium",
           "conversation_history": ["billing_inquiry", "payment"]
         }
       }
     }
     ```

**Issue 4: PII Not Redacted**

| Symptom | Cause | Resolution |
|---------|-------|------------|
| PII visible in logs | Security settings not applied | Apply security settings to agent |
| | DLP template missing info types | Add all necessary info types |
| | Redaction scope incorrect | Set to REDACT_DISK_STORAGE |

**Troubleshooting Steps:**

1. Check if security settings are applied:
   ```
   Dialogflow CX Console:
   └── Agent Settings
       └── Security Tab
           └── Security Settings: [None selected] ❌
   ```

2. Verify DLP template:
   ```bash
   gcloud dlp inspect-templates describe \
       projects/YOUR_PROJECT_ID/locations/global/inspectTemplates/dialogflow-pii-inspection
   ```

3. Test redaction:
   ```
   User: "My phone number is 415-XX5-1234"
   
   Expected in logs: "My phone number is [PHONE_NUMBER]"
   Actual in logs: "My phone number is 415-XX5-1234" ❌
   
   Issue: Redaction not working
   ```

4. Solution:
   - Apply security settings to agent
   - Verify DLP template includes PHONE_NUMBER info type
   - Check redaction scope is set correctly

**Issue 5: Agent Escalation Not Working**

| Symptom | Cause | Resolution |
|---------|-------|------------|
| Call doesn't transfer to agent | Escalation page not configured | Create escalation flow |
| | Queue not specified in Webex CC | Add Queue_To_Agent activity |
| | Context not passed to CAD | Map session params to CAD variables |

**Troubleshooting Steps:**

1. Check Dialogflow CX escalation flow:
   ```
   Flows:
   └── Default Start Flow
       └── No "EscalationPage" found ❌
   ```

2. Check Webex CC Flow Designer:
   ```
   Virtual Agent V2 Activity:
   ├── On Handled: ✓ Configured
   ├── On Escalated: ❌ Not connected
   └── On Errored: ❌ Not connected
   ```

3. Solution:
   - Create EscalationPage in Dialogflow CX
   - In Webex CC Flow Designer:
     ```
     Virtual Agent V2:
     └── On Escalated:
         └── Set Variables:
             ├── EscalationReason = {{VirtualAgent.EscalationReason}}
             ├── CustomerContext = {{VirtualAgent.SessionParams}}
             └── Queue_To_Agent:
                 ├── Queue: Billing_Queue
                 ├── Priority: High
                 └── CAD Variables:
                     ├── VirtualAgentContext
                     └── ConversationSummary
     ```

## Debugging Tools

**Dialogflow CX Simulator:**

1. Navigate to Dialogflow CX Console
2. Right panel: **Test Agent**
3. Features:
   - Test intents with different inputs
   - View matched intents and confidence scores
   - See extracted parameters
   - View webhook payloads/responses
   - Check state transitions

**Cloud Logging:**

```bash
## View Dialogflow logs
gcloud logging read "resource.type=dialogflow.googleapis.com/Agent" \
    --limit 50 \
    --format json \
    --project YOUR_PROJECT_ID

## Filter by session
gcloud logging read "resource.type=dialogflow.googleapis.com/Agent AND jsonPayload.sessionId=abc123" \
    --limit 50 \
    --format json \
    --project YOUR_PROJECT_ID

## Filter by webhook errors
gcloud logging read "resource.type=dialogflow.googleapis.com/Agent AND jsonPayload.webhookStatus=ERROR" \
    --limit 50 \
    --format json \
    --project YOUR_PROJECT_ID
```

**Flow Designer Debug Mode:**

1. In Webex CC Management Portal
2. Open flow in Flow Designer
3. Click **Debug** button
4. Make test call
5. View:
   - Activity execution order
   - Variable values at each step
   - Virtual Agent interaction details
   - Transition paths taken

## Performance Monitoring

**Key Metrics to Monitor:**

| Metric | Tool | Alert Threshold |
|--------|------|-----------------|
| **Intent Matching Accuracy** | Dialogflow Analytics | < 80% |
| **Average Conversation Duration** | Dialogflow Analytics | > 5 minutes |
| **Escalation Rate** | Webex CC Analyzer | > 40% |
| **Webhook Response Time** | Cloud Monitoring | > 3 seconds |
| **Containment Rate** | Webex CC Analyzer | < 50% |
| **PII Redaction Failures** | DLP Logs | Any failure |

**Setting Up Alerts:**

```yaml
## Cloud Monitoring Alert Policy
displayName: "Dialogflow High Latency"
conditions:
  - displayName: "Webhook Response Time"
    conditionThreshold:
      filter: 'metric.type="dialogflow.googleapis.com/webhook_latency"'
      comparison: COMPARISON_GT
      thresholdValue: 3000  # 3 seconds
      duration: 60s  # For 1 minute
notificationChannels:
  - projects/YOUR_PROJECT_ID/notificationChannels/EMAIL_CHANNEL
  - projects/YOUR_PROJECT_ID/notificationChannels/SLACK_CHANNEL
```

---

