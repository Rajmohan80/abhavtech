# Chapter 6: Webex Contact Center Implementation -- 6.8 AI Platform Integration

## 6.8 AI Platform Integration

!!! info "Why Two AI Platforms?"
    Abhavtech's Virtual Agent "Abhi" uses **both** Webex AI Agent and Google Dialogflow CX — not as alternatives, but as a **hybrid architecture** where each handles what it does best.

    | Platform | Handles | Why |
    |---|---|---|
    | **Webex AI Agent** | Simple, single-turn intents — office hours, queue status, callback requests, language selection | Native to WxCC, zero integration cost, fast to configure, sufficient for ~60% of call volume |
    | **Google Dialogflow CX** | Complex multi-turn dialogues — order tracking (needs order ID + account lookup), billing disputes (multi-step), product registration | Full ML-powered NLU, stateful conversation, webhook fulfillment to Salesforce/billing DB, handles ambiguity |

    **Decision rule:** If a caller intent can be resolved in ≤ 2 exchanges with no backend DB lookup → Webex AI Agent. If it requires conversation state, entity extraction, or REST API calls → Dialogflow CX.

    The CCAI Connector in WxCC routes each call to the appropriate engine based on the initial intent detected. See [10.1.3 Hybrid Architecture](../chapter-10-ai-implementation/10-1-ai-platform-selection-and-hybrid-strategy.md#1013-hybrid-architecture-design-for-abhavtech) for the full design rationale and traffic flow split.

## 6.8.1 Architecture Overview

```
+-----------------------------------------------------------------------------+
|              VIRTUAL AGENT "ABHI" - DUAL PLATFORM ARCHITECTURE              |
+-----------------------------------------------------------------------------+
|                                                                             |
|  +---------------------------------------------------------------------+   |
|  |                     GOOGLE CLOUD PLATFORM                            |   |
|  |  +-------------+  +-------------+  +-------------+                  |   |
|  |  | Dialogflow  |  | Cloud       |  | Cloud       |                  |   |
|  |  | CX Agent    |  | Functions   |  | Speech/TTS  |                  |   |
|  |  | "Abhi"      |  | (Webhooks)  |  | APIs        |                  |   |
|  |  +------+------+  +------+------+  +-------------+                  |   |
|  |         |                |                                           |   |
|  |         +----------------+                                           |   |
|  |                |                                                     |   |
|  +----------------+-----------------------------------------------------+   |
|                   | Service Account + JSON Key                              |
|                   v                                                         |
|  +---------------------------------------------------------------------+   |
|  |                     WEBEX CONTACT CENTER                             |   |
|  |  +-------------+  +-------------+  +-------------+                  |   |
|  |  | Virtual     |  | Flow        |  | Agent       |                  |   |
|  |  | Agent       |  | Designer    |  | Desktop     |                  |   |
|  |  | Connector   |  | VA Node     |  | (Context)   |                  |   |
|  |  +-------------+  +-------------+  +-------------+                  |   |
|  |                                                                      |   |
|  +---------------------------------------------------------------------+   |
|                                                                             |
+-----------------------------------------------------------------------------+
```

## 6.8.2 PART A: Google Cloud Platform Configuration

### 6.8.2.1 Prerequisites

| Requirement | Details |
|-------------|---------|
| Google Cloud Account | With billing enabled |
| IAM Permissions | Dialogflow API Admin, Service Account Admin |
| APIs to Enable | Dialogflow, Speech-to-Text, Text-to-Speech |
| Region | asia-south1 (Mumbai) for data residency |

### 6.8.2.2 Step 1: Create Google Cloud Project

**Navigation:** console.cloud.google.com

1. Click **"Select Project"** -> **"New Project"**
2. Project Name: **abhavtech-wxcc-ai**
3. Organization: **abhavtech.com**
4. Click **"Create"**
5. **Record Project ID:** abhavtech-wxcc-ai

### 6.8.2.3 Step 2: Enable Required APIs

**Navigation:** APIs & Services -> Library

Enable:
- [OK] Dialogflow API
- [OK] Cloud Speech-to-Text API
- [OK] Cloud Text-to-Speech API
- [OK] Cloud Functions API
- [OK] Secret Manager API

### 6.8.2.4 Step 3: Create Service Account

**Navigation:** IAM & Admin -> Service Accounts

1. Click **"Create Service Account"**
2. Name: **wxcc-dialogflow-connector**
3. Description: **Service account for Webex Contact Center integration**
4. Click **"Create and Continue"**

**Assign Roles:**
- Dialogflow API Client
- Dialogflow API Reader
- Service Account Token Creator

5. Click **"Done"**

**Generate JSON Key:**

1. Click on service account **wxcc-dialogflow-connector**
2. Go to **"Keys"** tab
3. Click **"Add Key"** -> **"Create New Key"**
4. Select **JSON**
5. Click **"Create"**
6. **SAVE the downloaded JSON file securely**

### 6.8.2.5 Step 4: Create Dialogflow CX Agent

**Navigation:** dialogflow.cloud.google.com/cx

1. Select Project: **abhavtech-wxcc-ai**
2. Click **"Create Agent"**
3. Configure:

```
+-----------------------------------------------------------------------------+
|  DIALOGFLOW CX AGENT CONFIGURATION                                         |
+-----------------------------------------------------------------------------+
|                                                                             |
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Display Name               | Abhi (अभि)                                   |
|  Location                   | asia-south1 (Mumbai)                         |
|  Default Language           | en (English)                                 |
|  Additional Languages       | hi (Hindi)                                   |
|  Time Zone                  | Asia/Kolkata                                 |
|  ---------------------------+--------------------------------------------|
|                                                                             |
|  ADVANCED SETTINGS:                                                        |
|  * Speech to Text: Google Cloud Speech                                     |
|  * Text to Speech: Neural voice (en-IN-Wavenet-A, hi-IN-Wavenet-A)        |
|  * Logging: Enable Cloud Logging                                           |
|  * Enable spell correction: Yes                                            |
|                                                                             |
+-----------------------------------------------------------------------------+
```

4. Click **"Create"**
5. **Record Agent ID:** (from Agent Settings)

### 6.8.2.6 Step 5: Configure Intents (Per Chapter 3.9.2)

**Phase 1 Intents - 15 Intents:**

```
+-----------------------------------------------------------------------------+
|              PHASE 1 INTENT LIBRARY - 15 INTENTS                            |
+-----------------------------------------------------------------------------+
|                                                                             |
|  INTENT               | TRAINING PHRASES | FULFILLMENT          | CHANNEL  |
|  ---------------------+------------------+----------------------+----------|
|  greeting.hello       | 20               | Greeting response    | All      |
|  order.status         | 30               | Webhook: /orders     | All      |
|  order.track          | 25               | Webhook: /tracking   | All      |
|  product.inquiry      | 40               | Knowledge Base       | All      |
|  product.pricing      | 25               | Webhook: /pricing    | All      |
|  account.balance      | 20               | Webhook: /balance    | Voice    |
|  account.info         | 20               | Webhook: /account    | All      |
|  support.general      | 35               | Escalate to agent    | All      |
|  support.troubleshoot | 30               | KB + escalate        | All      |
|  billing.inquiry      | 25               | Webhook: /billing    | Voice    |
|  hours.location       | 15               | Static response      | All      |
|  callback.request     | 15               | Callback flow        | Voice    |
|  agent.handoff        | 20               | Immediate escalate   | All      |
|  feedback.survey      | 15               | Survey flow          | All      |
|  fallback.default     | N/A              | Clarify + retry      | All      |
|  ---------------------+------------------+----------------------+----------|
|                                                                             |
|  TOTAL: 15 Intents, ~355 Training Phrases                                  |
|                                                                             |
+-----------------------------------------------------------------------------+
```

**Intent Creation Procedure:**

1. Navigate to **"Manage"** -> **"Intents"**
2. Click **"+ Create"**
3. Enter Intent Name: **order.status**
4. Add Training Phrases (30):
   - Where is my order
   - Track my order
   - Order status
   - What is my order status
   - Mera order kahan hai (Hindi)
   - Order ka status kya hai (Hindi)
   - (Add remaining variations)
5. Click **"Save"**

**REPEAT for all 15 intents.**

### 6.8.2.7 Step 6: Configure Webhook Fulfillment

**Create Cloud Function:**

**Navigation:** Cloud Functions -> Create Function

```javascript
// abhavtech-va-webhook/index.js
const functions = require('@google-cloud/functions-framework');

functions.http('dialogflowWebhook', async (req, res) => {
  const tag = req.body.fulfillmentInfo?.tag;
  const params = req.body.sessionInfo?.parameters || {};
  const ani = params.ani || '';
  
  let responseText = '';
  
  switch(tag) {
    case 'order-status':
      const orderNum = params.order_number;
      // Call Abhavtech Order API
      const status = await getOrderStatus(orderNum);
      responseText = `Your order ${orderNum} is ${status.status}. 
                      Expected delivery: ${status.delivery_date}.`;
      break;
      
    case 'account-balance':
      const balance = await getAccountBalance(ani);
      responseText = `Your current account balance is ₹${balance}.`;
      break;
      
    case 'product-pricing':
      const product = params.product_name;
      const pricing = await getProductPricing(product);
      responseText = `${product} pricing starts at ₹${pricing.base_price}. 
                      Would you like to know more?`;
      break;
      
    default:
      responseText = 'I understand. Let me connect you with an agent.';
  }
  
  res.json({
    fulfillment_response: {
      messages: [{
        text: { text: [responseText] }
      }]
    }
  });
});

// API helper functions
async function getOrderStatus(orderNum) {
  const response = await fetch(`${process.env.ABHAVTECH_API}/orders/${orderNum}`);
  return response.json();
}

async function getAccountBalance(phone) {
  const response = await fetch(`${process.env.ABHAVTECH_API}/customers/balance?phone=${phone}`);
  return response.json();
}

async function getProductPricing(product) {
  const response = await fetch(`${process.env.ABHAVTECH_API}/products/pricing?name=${product}`);
  return response.json();
}
```

**Deploy Function:**

```bash
gcloud functions deploy abhavtech-va-webhook \
  --gen2 \
  --runtime=nodejs18 \
  --region=asia-south1 \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars ABHAVTECH_API=https://api.abhavtech.com/v1 \
  --entry-point=dialogflowWebhook
```

**Configure in Dialogflow CX:**

1. Navigate to **"Manage"** -> **"Webhooks"**
2. Click **"+ Create"**
3. Display Name: **abhavtech-fulfillment-webhook**
4. Webhook URL: **(Cloud Function URL from deployment)**
5. Click **"Save"**

### 6.8.2.8 Step 7: Configure Escalation Flow

1. Create Intent: **agent.handoff**
2. Training Phrases:
   - Talk to an agent
   - I want to speak to someone
   - Human please
   - Connect me to a person
   - Agent
   - Representative
   - Mujhe agent se baat karni hai (Hindi)

3. Create Escalation Page:
   - Add Parameter: `live_agent_escalation` = `true`
   - Response: "I'm connecting you to an agent now. Please hold."

### 6.8.2.9 Step 8: Test Agent

1. Click **"Test Agent"** in Dialogflow CX Console
2. Test each intent with sample utterances
3. Verify webhook responses
4. Test Hindi language
5. Test escalation flow

---

## 6.8.3 PART B: Webex Contact Center Configuration

### 6.8.3.1 Step 1: Add Virtual Agent Connector

**Navigation:** Control Hub -> Contact Center -> Connectors

1. Click **"Set Up"** under Virtual Agent
2. Select **"Google Dialogflow CX"**
3. Click **"Next"**

### 6.8.3.2 Step 2: Configure Connection

```
+-----------------------------------------------------------------------------+
|  WXCC DIALOGFLOW CX CONNECTOR CONFIGURATION                                |
+-----------------------------------------------------------------------------+
|                                                                             |
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Connector Name             | Abhi-Dialogflow-Connector                    |
|  Google Cloud Project ID    | abhavtech-wxcc-ai                            |
|  Location                   | asia-south1                                  |
|  Agent ID                   | [From Dialogflow CX Agent Settings]          |
|  Service Account Key        | [Upload JSON key file]                       |
|  ---------------------------+--------------------------------------------|
+-----------------------------------------------------------------------------+
```

4. Upload Service Account JSON key
5. Click **"Test Connection"** - Verify "Connection Successful"
6. Click **"Save"**

### 6.8.3.3 Step 3: Create Virtual Agent Configuration

**Navigation:** Control Hub -> Contact Center -> Features -> Virtual Agent

1. Click **"Create Virtual Agent"**
2. Configure:

| Field | Value |
|-------|-------|
| Name | Abhi |
| Connector | Abhi-Dialogflow-Connector |
| Default Language | en-US |
| Additional Languages | hi-IN |
| Voice | Neural (Dialogflow TTS) |
| Max No Input | 3 |
| Max Turns | 10 |
| Timeout Per Turn | 30 seconds |

3. Click **"Save"**

### 6.8.3.4 Step 4: Add Virtual Agent Node to Flow

**Navigation:** Contact Center -> Flows -> India_MainMenu_Flow_v1 -> Edit

1. Add **"Virtual Agent V2"** node after language selection
2. Configure:

```
+-----------------------------------------------------------------------------+
|  VIRTUAL AGENT V2 NODE - FLOW DESIGNER CONFIGURATION                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  FIELD                      | VALUE                                        |
|  ---------------------------+--------------------------------------------|
|  Virtual Agent              | Abhi                                         |
|  Input Audio                | {{NewPhoneContact.MediaResourceId}}          |
|  Language                   | {{selected_language}}                        |
|  Welcome Event              | WELCOME                                      |
|  Timeout Per Turn           | 30 seconds                                   |
|  Max No Input               | 3                                            |
|  ---------------------------+--------------------------------------------|
|                                                                             |
|  OUTPUT PATHS:                                                             |
|  * Handled -> End Flow (contained call)                                     |
|  * Escalated -> Continue to DTMF Menu (Node 8)                             |
|  * Error -> Error handling -> Queue_Support                                  |
|                                                                             |
|  CONTEXT VARIABLES TO PASS TO AGENT:                                       |
|  * va_summary = {{VirtualAgent.TranscriptSummary}}                        |
|  * va_intent = {{VirtualAgent.LastIntent}}                                |
|  * va_reason = {{VirtualAgent.EscalationReason}}                          |
|                                                                             |
+-----------------------------------------------------------------------------+
```

3. Connect output paths
4. **Validate** and **Publish** flow

### 6.8.3.5 Virtual Agent Testing Checklist

```
+-----------------------------------------------------------------------------+
|              VIRTUAL AGENT "ABHI" - TESTING CHECKLIST                       |
+-----------------------------------------------------------------------------+
|                                                                             |
|  GOOGLE CLOUD SIDE:                                                        |
|  [ ] Service Account permissions correct                                   |
|  [ ] Dialogflow agent responds in test console                            |
|  [ ] Webhook integration works (order status, balance)                    |
|  [ ] Hindi language model trained and working                             |
|  [ ] Escalation intent triggers properly                                  |
|                                                                             |
|  WEBEX SIDE:                                                               |
|  [ ] Connector test passes ("Connection Successful")                      |
|  [ ] Virtual Agent node executes in flow                                  |
|  [ ] Speech recognized correctly                                          |
|  [ ] Contained calls end properly                                         |
|  [ ] Escalated calls route to queue with context                          |
|  [ ] Context (summary, intent, reason) visible in Agent Desktop           |
|                                                                             |
|  END-TO-END SCENARIOS:                                                     |
|  [ ] "Where is my order" -> Order status provided -> Call ends              |
|  [ ] "What is my balance" -> Balance stated -> Call ends                    |
|  [ ] "Talk to agent" -> Escalates with context -> Agent receives call       |
|  [ ] Hindi: "Mera order kahan hai" -> Status in Hindi -> Call ends          |
|  [ ] 3x no input -> Auto escalate -> Agent receives call                    |
|                                                                             |
|  CONTAINMENT TARGET: 25% (Phase 1)                                         |
|                                                                             |
+-----------------------------------------------------------------------------+
```

---
