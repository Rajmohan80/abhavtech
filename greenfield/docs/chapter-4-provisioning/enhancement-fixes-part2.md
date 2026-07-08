# Chapter 4 Enhancement: Critical Configuration Fixes - Part 2

**Continuation of Chapter 4 Enhancement Document**

---

## Section 4: IVR Flow Designer - Complete Node Configuration

### 4.1 IVR Architecture Overview

```
KidsWear India IVR Structure:
================================

MAIN_IVR (Entry Point)
├── Business_Hours_Check
│   ├── [OPEN] → Welcome_Menu
│   └── [CLOSED] → After_Hours_Message → Voicemail/Callback
│
├── Welcome_Menu
│   ├── Press 1: Order Status → Order_Status_Flow
│   ├── Press 2: New Order → Sales_Queue
│   ├── Press 3: Product Info → Product_Info_Flow
│   ├── Press 4: Payment → Payment_Flow (PCI-compliant)
│   ├── Press 5: Complaints → Complaints_Queue
│   ├── Press 9: Speak to Agent → General_Queue
│   └── Timeout/Invalid → Repeat (3x) → General_Queue
│
├── Order_Status_Flow
│   ├── Collect_Order_Number
│   ├── API_Lookup → Zendesk
│   ├── [FOUND] → Play_Order_Status → End/Transfer
│   └── [NOT FOUND] → Transfer_To_Agent
│
├── Product_Info_Flow
│   ├── Dialogflow_CX (AI Assistant)
│   ├── [RESOLVED] → End/Menu
│   └── [ESCALATE] → Sales_Queue
│
└── Payment_Flow
    ├── Pause_Recording
    ├── Collect_Payment (SecureForm)
    ├── Process_Payment
    └── Resume_Recording → Confirmation
```

### 4.2 Node-by-Node Configuration

**Node 1: Entry Point**

```yaml
Node: Main_Entry_Point
Type: Entry
Configuration:
  Entry_Point_Number: "+91-80-XXXX-XXXX"  # Toll-free number
  Enable_Recording: true
  Recording_Announcement: true
  Announcement_Text: "This call may be recorded for quality and training purposes"
  
  Initial_Variables:
    - caller_ani: "{{system.ani}}"
    - caller_dnis: "{{system.dnis}}"
    - call_id: "{{system.interactionId}}"
    - entry_timestamp: "{{system.timestamp}}"
    - language_preference: "en-IN"  # Default: Indian English
  
  Next_Node: "Business_Hours_Check"
```

**Node 2: Business Hours Check**

```yaml
Node: Business_Hours_Check
Type: Condition
Configuration:
  Condition_Type: "time_based"
  
  Business_Hours:
    Monday_to_Friday:
      Open: "09:00"
      Close: "21:00"
      Timezone: "Asia/Kolkata"
    
    Saturday:
      Open: "10:00"
      Close: "18:00"
      Timezone: "Asia/Kolkata"
    
    Sunday:
      Open: "10:00"
      Close: "16:00"
      Timezone: "Asia/Kolkata"
    
    Holidays:  # Fetch from holiday calendar API
      API_Endpoint: "/api/holidays/india"
      Cache_TTL: 86400  # 24 hours
  
  Logic:
    If current_time WITHIN business_hours:
      Next: "Welcome_Menu"
    Else:
      Next: "After_Hours_Message"
```

**Node 3: After Hours Message**

```yaml
Node: After_Hours_Message
Type: PlayMessage
Configuration:
  Message_Type: "multi_part"
  
  Parts:
    - Audio: "after_hours_greeting.wav"
      Text: "Thank you for calling KidsWear India. Our contact center is currently closed."
    
    - Audio: "business_hours.wav"
      Text: "Our business hours are: Monday to Friday, 9 AM to 9 PM, Saturday 10 AM to 6 PM, and Sunday 10 AM to 4 PM."
    
    - Audio: "callback_options.wav"
      Text: "Press 1 to leave a voicemail, or press 2 to request a callback."
  
  Next_Node: "After_Hours_Menu"
```

**Node 4: After Hours Menu**

```yaml
Node: After_Hours_Menu
Type: Menu
Configuration:
  Prompt: "after_hours_options.wav"
  
  Options:
    "1":
      Label: "Leave Voicemail"
      Action: goto "Voicemail_Handler"
    
    "2":
      Label: "Schedule Callback"
      Action: goto "Callback_Scheduler"
  
  Error_Handling:
    No_Input_Timeout: 10
    Invalid_Input: "I didn't understand. Please press 1 for voicemail or 2 for callback."
    Max_Retries: 3
    After_Max: goto "Voicemail_Handler"
```

**Node 5: Welcome Menu**

```yaml
Node: Welcome_Menu
Type: Menu
Configuration:
  Prompt: "main_menu.wav"
  Prompt_Text: |
    "Welcome to KidsWear India. For order status, press 1. 
     To place a new order, press 2. For product information, press 3. 
     For payments, press 4. For complaints, press 5. 
     To speak with an agent, press 9."
  
  DTMF_Options:
    "1":
      Label: "Order Status"
      Action: goto "Order_Status_Flow"
      Estimated_Wait: "None (self-service)"
    
    "2":
      Label: "New Order"
      Action: goto "Sales_Queue"
      Queue: "Sales_Queue"
      Estimated_Wait: "{{get_queue_wait('Sales_Queue')}}"
    
    "3":
      Label: "Product Information"
      Action: goto "Product_Info_AI"
      Estimated_Wait: "None (AI assistant)"
    
    "4":
      Label: "Payment"
      Action: goto "Payment_Authentication"
      Estimated_Wait: "2-3 minutes"
    
    "5":
      Label: "Complaints"
      Action: goto "Complaints_Queue"
      Queue: "Complaints_Queue"
      Priority: "High"
    
    "9":
      Label: "Speak to Agent"
      Action: goto "General_Queue"
      Queue: "General_Queue"
  
  Timeout_Handling:
    No_Input_Timeout: 10
    No_Input_Message: "I didn't hear a selection."
    Repeat_Prompt: true
    Max_Repeats: 3
    After_Max_Repeats: goto "General_Queue"
  
  Invalid_Input_Handling:
    Message: "That's not a valid option."
    Repeat_Prompt: true
    Max_Invalid: 3
    After_Max_Invalid: goto "General_Queue"
```

**Node 6: Order Status Flow**

```yaml
Node: Order_Status_Flow
Type: SubFlow
Nodes:
  
  1. Collect_Order_Number:
      Type: CollectDigits
      Prompt: "order_number_prompt.wav"
      Text: "Please enter your 8-digit order number followed by the pound key"
      Min_Digits: 8
      Max_Digits: 8
      Terminator: "#"
      Timeout: 15
      Store_In: "{{order_number}}"
      Next: "Verify_Order_Format"
  
  2. Verify_Order_Format:
      Type: Condition
      Check: "{{order_number}} matches regex ^[0-9]{8}$"
      If_True: goto "API_Order_Lookup"
      If_False: 
        Play: "Invalid order number format"
        goto "Collect_Order_Number" (retry_count++)
  
  3. API_Order_Lookup:
      Type: API_Call
      Method: GET
      URL: "https://api.kidswear.in/orders/{{order_number}}"
      Headers:
        Authorization: "Bearer {{zendesk_token}}"
        Content-Type: "application/json"
      
      Timeout: 5000  # 5 seconds
      
      On_Success:
        Store_Response_In: "{{order_details}}"
        Next: "Parse_Order_Status"
      
      On_Timeout:
        Play: "We're experiencing technical difficulties"
        Next: "Transfer_To_Agent"
      
      On_Error:
        If status_code == 404:
          Play: "Order not found"
          Next: "Collect_Order_Number" (retry_count++)
        Else:
          Next: "Transfer_To_Agent"
  
  4. Parse_Order_Status:
      Type: SetVariable
      Variables:
        order_status: "{{order_details.status}}"
        order_date: "{{order_details.created_at}}"
        delivery_date: "{{order_details.estimated_delivery}}"
        tracking_number: "{{order_details.tracking_number}}"
      Next: "Play_Order_Status"
  
  5. Play_Order_Status:
      Type: PlayMessage
      Message_Type: "dynamic_tts"
      Text: |
        "Your order {{order_number}} placed on {{format_date(order_date)}} 
         is currently {{order_status}}. 
         {% if order_status == 'shipped' %}
           Your tracking number is {{tracking_number}}. 
           Estimated delivery is {{format_date(delivery_date)}}.
         {% elif order_status == 'processing' %}
           Your order is being prepared and will ship within 2 business days.
         {% elif order_status == 'delivered' %}
           Your order was delivered on {{format_date(delivery_date)}}.
         {% endif %}"
      
      Next: "Order_Status_Menu"
  
  6. Order_Status_Menu:
      Type: Menu
      Prompt: "For more assistance, press 1. To return to main menu, press 2. To end this call, press 9."
      Options:
        "1": goto "Transfer_To_Agent"
        "2": goto "Welcome_Menu"
        "9": goto "End_Call"
```

**Node 7: Product Info AI (Dialogflow CX)**

```yaml
Node: Product_Info_AI
Type: VirtualAgent
Configuration:
  Platform: "Dialogflow_CX"
  Project_ID: "kidswear-india-chatbot"
  Agent_ID: "{{dialogflow_agent_id}}"
  Location: "asia-south1"
  
  Session_Config:
    Session_TTL: 600  # 10 minutes
    Context_Carryover: true
    Enable_Sentiment: true
  
  Audio_Config:
    Language: "en-IN"
    Voice_Name: "en-IN-Wavenet-A"
    Speaking_Rate: 1.0
    Pitch: 0.0
  
  Integration_Variables:
    Pass_To_Dialogflow:
      - caller_ani: "{{system.ani}}"
      - caller_history: "{{get_customer_history()}}"
      - current_promotions: "{{get_active_promotions()}}"
    
    Receive_From_Dialogflow:
      - product_recommended
      - intent_confidence
      - escalation_required
      - customer_sentiment
  
  Escalation_Triggers:
    Low_Confidence:
      Threshold: 0.6
      Action: goto "Transfer_To_Agent"
    
    Negative_Sentiment:
      Threshold: -0.5
      Action: goto "Complaints_Queue"
    
    Explicit_Request:
      Intent: "speak_to_human"
      Action: goto "General_Queue"
    
    Timeout:
      Max_Turns: 10
      Action: goto "General_Queue"
  
  Success_Exit:
    Intent: "query_resolved"
    Action: goto "End_Call_Survey"
```

**Node 8: Payment Flow (PCI-Compliant)**

```yaml
Node: Payment_Authentication
Type: SubFlow
Security_Level: "PCI_DSS_COMPLIANT"

Nodes:
  1. Verify_Customer:
      Type: CollectDigits
      Prompt: "Please enter the last 4 digits of your registered mobile number"
      Exact_Digits: 4
      Store_In: "{{phone_last_4}}"
      
      Validation:
        API_Call: "POST /api/verify-customer"
        Payload:
          ani: "{{system.ani}}"
          last_4: "{{phone_last_4}}"
        
        On_Success: goto "Pause_Recording"
        On_Failure: 
          retry_count++
          If retry_count < 3: repeat
          Else: goto "Transfer_To_Agent"
  
  2. Pause_Recording:
      Type: API_Call
      Endpoint: "POST /v1/interactions/{{InteractionID}}/recordings/pause"
      Log_Event: "PCI_RECORDING_PAUSE"
      Next: "Payment_Amount"
  
  3. Payment_Amount:
      Type: CollectDigits
      Prompt: "Please enter the amount you wish to pay in rupees, followed by the pound key"
      Min_Digits: 1
      Max_Digits: 6
      Terminator: "#"
      Store_In: "{{payment_amount}}"
      Validation:
        Min_Value: 100
        Max_Value: 100000
      Next: "Collect_Card_Details"
  
  4. Collect_Card_Details:
      Type: SecureForm
# [Complete SecureForm config from Section 1]
      Next: "Confirm_Payment"
  
  5. Confirm_Payment:
      Type: Menu
      Prompt: "You are about to pay {{payment_amount}} rupees. Press 1 to confirm, or 2 to cancel."
      Options:
        "1": goto "Process_Payment"
        "2": goto "Payment_Cancelled"
  
  6. Process_Payment:
      Type: API_Call
# [Payment gateway integration from Section 1]
      On_Success: goto "Payment_Success"
      On_Failure: goto "Payment_Failed"
  
  7. Payment_Success:
      Type: PlayMessage
      Text: "Your payment of {{payment_amount}} rupees has been processed. Confirmation number: {{transaction_id}}"
      Also_Execute: "Resume_Recording"
      Next: "End_Call"
  
  8. Resume_Recording:
      Type: API_Call
      Endpoint: "POST /v1/interactions/{{InteractionID}}/recordings/resume"
      Log_Event: "PCI_RECORDING_RESUME"
```

### 4.3 Queue Configuration

```yaml
Sales_Queue:
  Name: "Sales Queue"
  Description: "New orders and sales inquiries"
  
  Queue_Settings:
    Max_Queue_Size: 50
    Queue_Timeout: 1800  # 30 minutes
    Service_Level_Target: "80/20"  # 80% in 20 seconds
    
  Routing_Algorithm: "longest_available"
  
  Agent_Skills_Required:
    - skill: "sales"
      min_level: 3
    - skill: "product_knowledge"
      min_level: 4
  
  Music_On_Hold:
    Audio_File: "moh_upbeat.wav"
    Play_Announcements: true
    Announcement_Interval: 45  # seconds
    
  Comfort_Messages:
    - At_30_Seconds: "Your call is important to us. An agent will be with you shortly."
    - At_120_Seconds: "Thank you for waiting. Your estimated wait time is {{queue_wait}} seconds."
    - At_300_Seconds: "We apologize for the wait. Press 1 for a callback, or stay on the line."
  
  Callback_Offer:
    Trigger: wait_time > 300
    Message: "Press 1 to request a callback instead of waiting."
  
  Overflow_Handling:
    Trigger: queue_size > 40 OR wait_time > 600
    Action: goto "Overflow_Queue"

Complaints_Queue:
  Name: "Complaints Queue"
  Description: "Product complaints and service issues"
  
  Queue_Settings:
    Max_Queue_Size: 30
    Queue_Timeout: 900  # 15 minutes
    Service_Level_Target: "90/15"  # 90% in 15 seconds (higher priority)
    Priority: "High"
  
  Routing_Algorithm: "most_skilled"
  
  Agent_Skills_Required:
    - skill: "complaint_handling"
      min_level: 4
    - skill: "empathy"
      min_level: 5
    - skill: "problem_solving"
      min_level: 4
  
  Special_Handling:
    Auto_Escalate_To_Supervisor: 
      - If wait_time > 180
      - If callback_customer == true
      - If vip_customer == true
  
  Recording_Policy: "100%"  # Record all complaint calls
  
  Music_On_Hold:
    Audio_File: "moh_calming.wav"
    
  Comfort_Messages:
    - At_15_Seconds: "Your call is very important to us. A specialist will assist you shortly."
    - At_60_Seconds: "Thank you for your patience. An agent will be with you in approximately {{queue_wait}} seconds."
```

### 4.4 Error Handling and Fallback

```yaml
Global_Error_Handler:
  
  Trigger_Conditions:
    - API_Timeout
    - Database_Connection_Failed
    - Invalid_Flow_State
    - Unexpected_Exception
  
  Actions:
    1. Log_Error:
        Severity: "ERROR"
        Include: stack_trace, flow_state, variables
        Destination: "CloudWatch_Logs"
    
    2. Play_Error_Message:
        Audio: "technical_difficulty.wav"
        Text: "We're experiencing technical difficulties. Please hold while we transfer you to an agent."
    
    3. Transfer_To_Agent:
        Queue: "General_Queue"
        Priority: "High"
        CAD_Variables:
          error_occurred: true
          error_type: "{{error_type}}"
          last_successful_node: "{{last_node}}"
    
    4. Send_Alert:
        If error_count > 5 in last_60_seconds:
          Alert: "Operations_Team"
          Severity: "CRITICAL"
          Message: "IVR experiencing high error rate"

Fallback_Logic:
  
  No_Input_Timeout:
    First_Timeout: 
      Play: "I didn't hear anything. Please make a selection."
      Repeat: true
    
    Second_Timeout:
      Play: "I still didn't hear a response. Let me transfer you to an agent."
      Action: goto "General_Queue"
  
  Invalid_Input:
    First_Invalid:
      Play: "That's not a valid option. Please try again."
      Repeat_Prompt: true
    
    Third_Invalid:
      Play: "I'm having trouble understanding. Let me connect you to an agent who can help."
      Action: goto "General_Queue"
  
  API_Failures:
    Order_Lookup_Failed:
      Play: "I'm unable to access your order information right now."
      Offer: "Press 1 to speak with an agent, or 2 to try again later."
    
    Payment_Gateway_Down:
      Play: "Our payment system is temporarily unavailable."
      Action: goto "Transfer_To_Agent"
      CAD_Variable: payment_system_down = true
```

---

## Section 5: Dialogflow CX to Webex CC Integration

### 5.1 Architecture Overview

```
Integration Flow:
=================

Webex Contact Center (IVR)
        |
        | [Virtual Agent Node]
        |
        ▼
Google Cloud Dialogflow CX
        |
        | [Session Management]
        |
        ▼
Intents, Entities, Flows
        |
        | [Fulfillment Webhook]
        |
        ▼
Backend Services
   ├── Zendesk (Customer Data)
   ├── Order Management System
   ├── Product Catalog
   └── Inventory System
        |
        ▼
Response to Caller
```

### 5.2 Dialogflow CX Agent Configuration

**Step 1: Create Dialogflow CX Agent**

```bash
# Using gcloud CLI
gcloud dialogflow cx agents create \
  --display-name="KidsWear-Product-Assistant" \
  --default-language-code="en-IN" \
  --time-zone="Asia/Kolkata" \
  --location="asia-south1" \
  --project="kidswear-india-chatbot"

# Output: Agent ID (save this)
AGENT_ID="projects/kidswear-india-chatbot/locations/asia-south1/agents/12345"
```

**Step 2: Configure Intents**

```yaml
Intent: product_inquiry
  Training_Phrases:
    - "Tell me about your winter collection"
    - "Do you have jackets for 5 year olds"
    - "What's the price range for kids shirts"
    - "Show me dresses"
    - "I'm looking for birthday party wear"
  
  Parameters:
    - age_group:
        Entity: @sys.number
        Required: true
        Prompts:
          - "What age group are you shopping for?"
          - "How old is the child?"
    
    - product_category:
        Entity: @product_category
        Required: true
        Prompts:
          - "What type of clothing are you interested in?"
        Choices:
          - shirts
          - pants
          - dresses
          - jackets
          - shoes
          - accessories
    
    - occasion:
        Entity: @occasion
        Required: false
        Prompts:
          - "Is this for a special occasion?"
        Choices:
          - casual
          - party
          - school
          - wedding
          - sports
  
  Fulfillment:
    Webhook: "product_search_webhook"
    Parameters_To_Send:
      age_group: "$parameters.age_group"
      category: "$parameters.product_category"
      occasion: "$parameters.occasion"
    
  Response:
    If products_found > 0:
      Text: |
        "We have {{products_found}} options for {{age_group}} year olds in our {{product_category}} category. 
         The price range is {{min_price}} to {{max_price}} rupees. 
         Would you like me to describe the top 3 products?"
    Else:
      Text: "I'm sorry, we don't have that specific combination in stock. Would you like to speak with a sales agent?"
      Escalate: true

Intent: order_tracking
  Training_Phrases:
    - "Where is my order"
    - "Track my order"
    - "Order status for {{order_number}}"
    - "When will my package arrive"
    - "I want to know about my delivery"
  
  Parameters:
    - order_number:
        Entity: @order_number
        Required: true
        Prompts:
          - "What's your 8-digit order number?"
        Validation:
          Regex: "^[0-9]{8}$"
  
  Fulfillment:
    Webhook: "order_tracking_webhook"
    API_Call: "GET /api/orders/{{order_number}}"
  
  Response:
    Dynamic_Based_On_Status:
      processing: "Your order is being prepared and will ship within 2 business days."
      shipped: "Your order shipped on {{ship_date}}. Tracking number: {{tracking}}. Expected delivery: {{delivery_date}}."
      delivered: "Your order was delivered on {{delivery_date}}."
      cancelled: "Your order was cancelled. Would you like to speak with an agent?"

Intent: complaint
  Training_Phrases:
    - "I want to complain"
    - "Product is damaged"
    - "Wrong item delivered"
    - "Poor quality"
    - "I'm not satisfied"
  
  Sentiment_Trigger: < -0.3  # Negative sentiment
  
  Response:
    Text: "I'm sorry you're having an issue. Let me connect you with a specialist who can help right away."
    Escalate_To: "Complaints_Queue"
    Priority: "High"

Intent: speak_to_human
  Training_Phrases:
    - "I want to talk to a person"
    - "Connect me to an agent"
    - "Speak to customer service"
    - "I need human help"
  
  Response:
    Text: "Of course, let me connect you with an agent."
    Escalate_To: "General_Queue"
```

### 5.3 Fulfillment Webhook Configuration

**Backend Webhook Server (Node.js/Express):**

```javascript
const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.json());

// Dialogflow CX Fulfillment Endpoint
app.post('/webhook/dialogflow', async (req, res) => {
  const tag = req.body.fulfillmentInfo.tag;
  const parameters = req.body.sessionInfo.parameters;
  
  console.log(`Webhook called with tag: ${tag}`);
  console.log(`Parameters:`, parameters);
  
  let response = {};
  
  try {
    switch (tag) {
      case 'product_search':
        response = await handle_product_search(parameters);
        break;
      
      case 'order_tracking':
        response = await handle_order_tracking(parameters);
        break;
      
      case 'check_inventory':
        response = await handle_inventory_check(parameters);
        break;
      
      default:
        response = {
          fulfillmentResponse: {
            messages: [{
              text: {
                text: ["I can help you with that. Let me check..."]
              }
            }]
          }
        };
    }
    
    res.json(response);
    
  } catch (error) {
    console.error('Webhook error:', error);
    res.json({
      fulfillmentResponse: {
        messages: [{
          text: {
            text: ["I'm experiencing technical difficulties. Let me transfer you to an agent."]
          }
        }]
      },
      sessionInfo: {
        parameters: {
          escalate_to_agent: true
        }
      }
    });
  }
});

async function handle_product_search(params) {
  // Call product catalog API
  const age_group = params.age_group;
  const category = params.product_category;
  
  const products = await axios.get(`https://api.kidswear.in/products`, {
    params: {
      age_min: age_group - 1,
      age_max: age_group + 1,
      category: category
    },
    headers: {
      'Authorization': `Bearer ${process.env.API_KEY}`
    }
  });
  
  const results = products.data;
  
  if (results.length === 0) {
    return {
      fulfillmentResponse: {
        messages: [{
          text: {
            text: [`Sorry, we don't have ${category} for age ${age_group} in stock right now.`]
          }
        }]
      },
      sessionInfo: {
        parameters: {
          products_found: 0,
          escalate_to_agent: true
        }
      }
    };
  }
  
  // Build response with top 3 products
  const top_3 = results.slice(0, 3);
  const descriptions = top_3.map(p => 
    `${p.name} - ${p.price} rupees, available in sizes ${p.sizes.join(', ')}`
  ).join('. ');
  
  return {
    fulfillmentResponse: {
      messages: [{
        text: {
          text: [
            `I found ${results.length} options. Here are the top 3: ${descriptions}. Would you like more information on any of these?`
          ]
        }
      }]
    },
    sessionInfo: {
      parameters: {
        products_found: results.length,
        top_products: top_3.map(p => p.id),
        min_price: Math.min(...results.map(p => p.price)),
        max_price: Math.max(...results.map(p => p.price))
      }
    }
  };
}

async function handle_order_tracking(params) {
  const order_number = params.order_number;
  
  // Call Zendesk API
  const order = await axios.get(
    `https://kidswear.zendesk.com/api/v2/search.json?query=type:ticket custom_field_12345:${order_number}`,
    {
      headers: {
        'Authorization': `Bearer ${process.env.ZENDESK_TOKEN}`
      }
    }
  );
  
  if (order.data.results.length === 0) {
    return {
      fulfillmentResponse: {
        messages: [{
          text: {
            text: [`I couldn't find order ${order_number}. Please verify the number or speak with an agent.`]
          }
        }]
      }
    };
  }
  
  const order_details = order.data.results[0];
  const status = order_details.custom_fields.find(f => f.id === 12346).value;
  
  let status_message;
  switch (status) {
    case 'processing':
      status_message = "Your order is being prepared and will ship within 2 business days.";
      break;
    case 'shipped':
      const tracking = order_details.custom_fields.find(f => f.id === 12347).value;
      status_message = `Your order has shipped. Tracking number: ${tracking}.`;
      break;
    case 'delivered':
      status_message = "Your order has been delivered.";
      break;
    default:
      status_message = `Your order status is: ${status}.`;
  }
  
  return {
    fulfillmentResponse: {
      messages: [{
        text: {
          text: [status_message]
        }
      }]
    },
    sessionInfo: {
      parameters: {
        order_status: status,
        order_details: order_details
      }
    }
  };
}

app.listen(3000, () => {
  console.log('Dialogflow webhook listening on port 3000');
});
```

### 5.4 Webex Contact Center Integration

**Virtual Agent Node Configuration:**

```yaml
Node: Dialogflow_Virtual_Agent
Type: VirtualAgent
Configuration:
  Provider: "Dialogflow_CX"
  
  Connection_Details:
    Project_ID: "kidswear-india-chatbot"
    Location: "asia-south1"
    Agent_ID: "{{DIALOGFLOW_AGENT_ID}}"
    Environment: "production"
  
  Authentication:
    Method: "service_account"
    Service_Account_Key: "{{GCP_SERVICE_ACCOUNT_KEY}}"
    Scopes:
      - "https://www.googleapis.com/auth/dialogflow"
      - "https://www.googleapis.com/auth/cloud-platform"
  
  Session_Configuration:
    Session_ID_Format: "wxcc_{{InteractionID}}_{{timestamp}}"
    Session_TTL: 600  # 10 minutes
    Language_Code: "en-IN"
  
  Audio_Configuration:
    Input_Audio_Encoding: "AUDIO_ENCODING_LINEAR_16"
    Sample_Rate_Hertz: 8000
    Output_Audio_Encoding: "OUTPUT_AUDIO_ENCODING_LINEAR_16"
  
  Context_Variables_To_Pass:
# From Webex CC to Dialogflow
    - name: "caller_ani"
      value: "{{system.ani}}"
    - name: "caller_name"
      value: "{{customer_name}}"
    - name: "customer_tier"
      value: "{{customer_tier}}"
    - name: "previous_orders"
      value: "{{customer_order_count}}"
  
  Context_Variables_To_Receive:
# From Dialogflow back to Webex CC
    - name: "intent_detected"
      store_in: "{{dialog_intent}}"
    - name: "confidence_score"
      store_in: "{{dialog_confidence}}"
    - name: "products_recommended"
      store_in: "{{recommended_products}}"
    - name: "escalate_to_agent"
      store_in: "{{requires_agent}}"
  
  Escalation_Handling:
    Escalation_Intent: "escalate_to_human"
    Escalation_Parameter: "escalate_to_agent"
    
    On_Escalation:
      Play_Message: "Let me connect you with an agent."
      Transfer_To: "{{dialog_target_queue || 'General_Queue'}}"
      CAD_Variables:
        dialog_intent: "{{dialog_intent}}"
        dialog_summary: "{{conversation_summary}}"
        products_discussed: "{{recommended_products}}"
  
  Error_Handling:
    On_No_Match:
      Max_No_Match: 3
      After_Max: 
        Play: "I'm having trouble understanding. Let me connect you with an agent."
        goto: "General_Queue"
    
    On_No_Input:
      Timeout: 10
      Max_No_Input: 2
      After_Max:
        Play: "Are you still there? Let me transfer you to an agent."
        goto: "General_Queue"
    
    On_API_Error:
      Play: "I'm experiencing technical difficulties."
      goto: "General_Queue"
      Alert: "Operations_Team"
  
  Success_Exits:
    Intent_Fulfilled:
      Intent: "query_resolved"
      Action: 
        Play: "Is there anything else I can help you with?"
        If "no": goto "End_Call_Survey"
        If "yes": restart Dialogflow session
```
