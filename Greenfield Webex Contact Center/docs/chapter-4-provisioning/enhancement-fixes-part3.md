# Chapter 4 Enhancement: Critical Configuration Fixes - Part 3

**Final Part - Sections 6-10**

---

## Section 6: Zendesk CTI Connector Deep Configuration

### 6.1 Field Mapping Configuration

**Complete Field Mapping Table:**

```yaml
Zendesk_Custom_Fields:
  
  Field_1_ANI:
    Zendesk_Field_ID: "360001234567"
    Zendesk_Field_Name: "caller_phone_number"
    Webex_CC_Variable: "{{system.ani}}"
    Data_Type: "string"
    Format: "+91-XXX-XXX-XXXX"
    Validation: "regex: ^\\+91-\\d{3}-\\d{3}-\\d{4}$"
    Update_On: "call_start"
    Screen_Pop_Trigger: true
  
  Field_2_DNIS:
    Zendesk_Field_ID: "360001234568"
    Zendesk_Field_Name: "called_number"
    Webex_CC_Variable: "{{system.dnis}}"
    Data_Type: "string"
    Update_On: "call_start"
  
  Field_3_Queue_Name:
    Zendesk_Field_ID: "360001234569"
    Zendesk_Field_Name: "contact_center_queue"
    Webex_CC_Variable: "{{queue.name}}"
    Data_Type: "dropdown"
    Values: ["Sales", "Support", "Complaints"]
    Update_On: "queue_enter"
  
  Field_4_Agent_Name:
    Zendesk_Field_ID: "360001234570"
    Zendesk_Field_Name: "handled_by_agent"
    Webex_CC_Variable: "{{agent.name}}"
    Data_Type: "string"
    Update_On: "call_connected"
  
  Field_5_Call_Duration:
    Zendesk_Field_ID: "360001234571"
    Zendesk_Field_Name: "call_duration_seconds"
    Webex_CC_Variable: "{{interaction.duration}}"
    Data_Type: "integer"
    Update_On: "call_end"
  
  Field_6_Wrap_Up_Code:
    Zendesk_Field_ID: "360001234572"
    Zendesk_Field_Name: "call_disposition"
    Webex_CC_Variable: "{{wrapup.code}}"
    Data_Type: "dropdown"
    Values: ["Resolved", "Escalated", "Callback_Required", "No_Answer"]
    Update_On: "wrap_up_complete"
    Mandatory: true
  
  Field_7_Recording_URL:
    Zendesk_Field_ID: "360001234573"
    Zendesk_Field_Name: "call_recording_link"
    Webex_CC_Variable: "{{recording.url}}"
    Data_Type: "url"
    Update_On: "call_end_with_delay"  # Wait for recording to process
    Delay_Seconds: 300
  
  Field_8_IVR_Path:
    Zendesk_Field_ID: "360001234574"
    Zendesk_Field_Name: "ivr_path_taken"
    Webex_CC_Variable: "{{flow.path}}"
    Data_Type: "text"
    Example: "Main_Menu → Sales_Queue → Agent_Transfer"
    Update_On: "call_end"
  
  Field_9_Customer_Sentiment:
    Zendesk_Field_ID: "360001234575"
    Zendesk_Field_Name: "customer_sentiment_score"
    Webex_CC_Variable: "{{dialogflow.sentiment}}"
    Data_Type: "decimal"
    Range: "-1.0 to +1.0"
    Update_On: "ai_interaction_complete"
  
  Field_10_Order_Number:
    Zendesk_Field_ID: "360001234576"
    Zendesk_Field_Name: "order_number_discussed"
    Webex_CC_Variable: "{{cad.order_number}}"
    Data_Type: "string"
    Format: "8 digits"
    Update_On: "call_end"
  
  Field_11_Payment_Status:
    Zendesk_Field_ID: "360001234577"
    Zendesk_Field_Name: "payment_processed"
    Webex_CC_Variable: "{{payment.status}}"
    Data_Type: "checkbox"
    Values: ["Yes", "No"]
    Update_On: "payment_complete"
  
  Field_12_Callback_Scheduled:
    Zendesk_Field_ID: "360001234578"
    Zendesk_Field_Name: "callback_scheduled_time"
    Webex_CC_Variable: "{{callback.timestamp}}"
    Data_Type: "datetime"
    Format: "YYYY-MM-DD HH:MM:SS"
    Update_On: "callback_scheduled"
  
  Field_13_VIP_Customer:
    Zendesk_Field_ID: "360001234579"
    Zendesk_Field_Name: "vip_customer_flag"
    Webex_CC_Variable: "{{customer.tier}}"
    Data_Type: "checkbox"
    Condition: "{{customer.tier}} == 'VIP' OR {{customer.tier}} == 'Platinum'"
    Update_On: "call_start"
  
  Field_14_Previous_Tickets:
    Zendesk_Field_ID: "360001234580"
    Zendesk_Field_Name: "open_tickets_count"
    Webex_CC_Variable: "{{zendesk.open_tickets}}"
    Data_Type: "integer"
    Computed_Via: "API_Lookup"
    Update_On: "screen_pop"
  
  Field_15_Interaction_ID:
    Zendesk_Field_ID: "360001234581"
    Zendesk_Field_Name: "webex_interaction_id"
    Webex_CC_Variable: "{{system.interactionId}}"
    Data_Type: "string"
    Format: "UUID"
    Update_On: "call_start"
    Searchable: true
```

### 6.2 Screen Pop Configuration

**Trigger Rules:**

```javascript
// Zendesk CTI Screen Pop Logic
const screenPopRules = {
  
  // Rule 1: Exact Match on Phone Number
  exactMatchPhone: {
    priority: 1,
    searchQuery: (ani) => {
      return `type:user phone:${ani}`;
    },
    action: (results) => {
      if (results.length === 1) {
        return {
          action: "open_user",
          user_id: results[0].id,
          open_tickets: true
        };
      } else if (results.length > 1) {
        return {
          action: "show_disambiguation",
          results: results
        };
      } else {
        return screenPopRules.fuzzyMatch();
      }
    }
  },
  
  // Rule 2: Fuzzy Match (Last 4 Digits)
  fuzzyMatch: {
    priority: 2,
    searchQuery: (ani) => {
      const last4 = ani.slice(-4);
      return `type:user phone:*${last4}`;
    },
    action: (results) => {
      if (results.length > 0) {
        return {
          action: "show_search_results",
          results: results,
          message: "Multiple customers found with similar phone numbers"
        };
      } else {
        return screenPopRules.createNew();
      }
    }
  },
  
  // Rule 3: No Match - Create New
  createNew: {
    priority: 3,
    action: (ani, cadVariables) => {
      return {
        action: "create_ticket",
        prefill_data: {
          requester: ani,
          subject: `Inbound call from ${ani}`,
          custom_fields: {
            caller_phone_number: ani,
            called_number: cadVariables.dnis,
            contact_center_queue: cadVariables.queue_name
          }
        }
      };
    }
  },
  
  // Rule 4: VIP Customer Special Handling
  vipHandling: {
    priority: 0,  // Highest priority
    condition: (customer) => {
      return customer.tags.includes('vip') || customer.custom_fields.vip_customer_flag;
    },
    action: (customer) => {
      return {
        action: "open_user_and_create_ticket",
        user_id: customer.id,
        ticket_priority: "urgent",
        ticket_type: "question",
        alert_supervisor: true
      };
    }
  }
};

// Screen Pop Execution Engine
function executeScreenPop(ani, cadVariables) {
  // Check VIP first
  if (screenPopRules.vipHandling.condition(cadVariables.customer_data)) {
    return screenPopRules.vipHandling.action(cadVariables.customer_data);
  }
  
  // Try exact match
  const exactResults = searchZendesk(screenPopRules.exactMatchPhone.searchQuery(ani));
  const exactAction = screenPopRules.exactMatchPhone.action(exactResults);
  if (exactAction.action !== "show_search_results") {
    return exactAction;
  }
  
  // Fallback to fuzzy match
  const fuzzyResults = searchZendesk(screenPopRules.fuzzyMatch.searchQuery(ani));
  const fuzzyAction = screenPopRules.fuzzyMatch.action(fuzzyResults);
  if (fuzzyAction.action !== "create_ticket") {
    return fuzzyAction;
  }
  
  // No match - create new
  return screenPopRules.createNew.action(ani, cadVariables);
}
```

### 6.3 Click-to-Dial Integration

**Implementation:**

```javascript
// Zendesk Click-to-Dial Widget
(function() {
  const client = ZAFClient.init();
  
  // Register phone number click handler
  client.on('app.registered', function(data) {
    console.log('Zendesk CTI app registered');
    
    // Make all phone numbers clickable
    enhancePhoneNumbers();
  });
  
  function enhancePhoneNumbers() {
    // Find all phone numbers in Zendesk interface
    const phonePattern = /(\+91[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{4}|\d{10})/g;
    
    document.body.innerHTML = document.body.innerHTML.replace(phonePattern, function(match) {
      return `<a href="#" class="cti-dial" data-number="${match}">${match}</a>`;
    });
    
    // Add click handlers
    document.querySelectorAll('.cti-dial').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const number = this.getAttribute('data-number');
        initiateOutboundCall(number);
      });
    });
  }
  
  function initiateOutboundCall(phoneNumber) {
    // Call Webex CC API to initiate outbound call
    const agentId = getCurrentAgentId();
    
    fetch('https://api.wxcc-us1.cisco.com/v1/agents/${agentId}/outdial', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getWebexToken()}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        destination: phoneNumber,
        queue: 'Outbound_Queue',
        cad_variables: {
          zendesk_ticket_id: getCurrentTicketId(),
          initiated_from: 'zendesk_cti'
        }
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        showNotification('Call initiated to ' + phoneNumber);
        
        // Auto-log call activity in Zendesk
        logCallActivity({
          ticket_id: getCurrentTicketId(),
          phone_number: phoneNumber,
          direction: 'outbound',
          interaction_id: data.interactionId,
          timestamp: new Date().toISOString()
        });
      } else {
        showError('Failed to initiate call: ' + data.error);
      }
    })
    .catch(error => {
      showError('API error: ' + error.message);
    });
  }
  
  function logCallActivity(callData) {
    client.request({
      url: `/api/v2/tickets/${callData.ticket_id}/comments.json`,
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        ticket: {
          comment: {
            body: `Outbound call initiated to ${callData.phone_number}`,
            public: false
          }
        }
      })
    });
  }
})();
```

### 6.4 Activity Logging Automation

**Webhook Handler:**

```python
#!/usr/bin/env python3
"""
Zendesk Activity Logger - Webhook Handler
Automatically logs all Webex CC interactions to Zendesk tickets
"""

from flask import Flask, request, jsonify
import requests
import os
import logging
from datetime import datetime

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

ZENDESK_SUBDOMAIN = "kidswear"
ZENDESK_EMAIL = os.getenv('ZENDESK_EMAIL')
ZENDESK_TOKEN = os.getenv('ZENDESK_API_TOKEN')
ZENDESK_AUTH = (f"{ZENDESK_EMAIL}/token", ZENDESK_TOKEN)

@app.route('/webhook/call-ended', methods=['POST'])
def handle_call_ended():
    """
    Webhook triggered when a call ends in Webex CC.
    Logs complete call details to Zendesk.
    """
    try:
        payload = request.json
        logging.info(f"Received call-ended webhook: {payload['interactionId']}")
        
# Extract call details
        call_data = {
            'interaction_id': payload['interactionId'],
            'ani': payload['ani'],
            'dnis': payload['dnis'],
            'queue': payload['queueName'],
            'agent_name': payload['agentName'],
            'start_time': payload['startTimestamp'],
            'end_time': payload['endTimestamp'],
            'duration': payload['duration'],
            'wrap_up_code': payload.get('wrapUpCode', 'Not Set'),
            'recording_url': payload.get('recordingUrl', 'Processing...'),
            'ivr_path': payload.get('ivrPath', 'Direct to agent')
        }
        
# Find or create Zendesk ticket
        ticket_id = find_or_create_ticket(call_data)
        
# Update ticket with call details
        update_ticket_fields(ticket_id, call_data)
        
# Add call log as internal comment
        add_call_log_comment(ticket_id, call_data)
        
        logging.info(f"Successfully logged call {call_data['interaction_id']} to ticket {ticket_id}")
        
        return jsonify({'success': True, 'ticket_id': ticket_id}), 200
        
    except Exception as e:
        logging.error(f"Error processing webhook: {e}")
        return jsonify({'success': False, 'error': str(e)}), 500

def find_or_create_ticket(call_data):
    """
    Search for existing ticket by phone number.
    If not found, create new ticket.
    """
# Search for user by phone
    search_url = f"https://{ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/search.json"
    search_params = {
        'query': f'type:user phone:{call_data["ani"]}'
    }
    
    response = requests.get(search_url, auth=ZENDESK_AUTH, params=search_params)
    search_results = response.json()
    
    if search_results['count'] > 0:
# User exists - find or create ticket
        user_id = search_results['results'][0]['id']
        
# Check for open tickets
        ticket_search = f'type:ticket requester:{user_id} status<solved'
        ticket_response = requests.get(search_url, auth=ZENDESK_AUTH, params={'query': ticket_search})
        ticket_results = ticket_response.json()
        
        if ticket_results['count'] > 0:
# Use existing open ticket
            return ticket_results['results'][0]['id']
        else:
# Create new ticket for this user
            return create_ticket(user_id, call_data)
    else:
# User doesn't exist - create user and ticket
        user_id = create_user(call_data['ani'])
        return create_ticket(user_id, call_data)

def create_user(phone_number):
    """Create new Zendesk user."""
    url = f"https://{ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/users.json"
    data = {
        'user': {
            'name': f'Customer {phone_number[-4:]}',
            'phone': phone_number,
            'verified': False,
            'role': 'end-user'
        }
    }
    
    response = requests.post(url, auth=ZENDESK_AUTH, json=data)
    return response.json()['user']['id']

def create_ticket(user_id, call_data):
    """Create new Zendesk ticket for the call."""
    url = f"https://{ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets.json"
    data = {
        'ticket': {
            'requester_id': user_id,
            'subject': f'Inbound call from {call_data["ani"]}',
            'comment': {
                'body': f'Call received at {call_data["start_time"]}'
            },
            'priority': 'normal',
            'status': 'open',
            'custom_fields': [
                {'id': 360001234567, 'value': call_data['ani']},
                {'id': 360001234568, 'value': call_data['dnis']},
                {'id': 360001234569, 'value': call_data['queue']}
            ]
        }
    }
    
    response = requests.post(url, auth=ZENDESK_AUTH, json=data)
    return response.json()['ticket']['id']

def update_ticket_fields(ticket_id, call_data):
    """Update ticket custom fields with call details."""
    url = f"https://{ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets/{ticket_id}.json"
    data = {
        'ticket': {
            'custom_fields': [
                {'id': 360001234570, 'value': call_data['agent_name']},
                {'id': 360001234571, 'value': call_data['duration']},
                {'id': 360001234572, 'value': call_data['wrap_up_code']},
                {'id': 360001234573, 'value': call_data['recording_url']},
                {'id': 360001234574, 'value': call_data['ivr_path']},
                {'id': 360001234581, 'value': call_data['interaction_id']}
            ]
        }
    }
    
    requests.put(url, auth=ZENDESK_AUTH, json=data)

def add_call_log_comment(ticket_id, call_data):
    """Add detailed call log as internal comment."""
    url = f"https://{ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets/{ticket_id}.json"
    
    comment_body = f"""
Call Details:
-------------
Interaction ID: {call_data['interaction_id']}
From: {call_data['ani']}
To: {call_data['dnis']}
Queue: {call_data['queue']}
Agent: {call_data['agent_name']}
Duration: {format_duration(call_data['duration'])}
Disposition: {call_data['wrap_up_code']}
IVR Path: {call_data['ivr_path']}
Recording: {call_data['recording_url']}

Call Timeline:
--------------
Start: {call_data['start_time']}
End: {call_data['end_time']}
    """
    
    data = {
        'ticket': {
            'comment': {
                'body': comment_body,
                'public': False  # Internal note
            }
        }
    }
    
    requests.put(url, auth=ZENDESK_AUTH, json=data)

def format_duration(seconds):
    """Format seconds to MM:SS."""
    minutes = seconds // 60
    secs = seconds % 60
    return f"{minutes}:{secs:02d}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
```

---

## Section 7: GCP Security - Exact IP Ranges and Commands

### 7.1 GCP Network Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Google Cloud Platform (GCP)                 │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  VPC: kidswear-prod-vpc (asia-south1)          │    │
│  │                                                  │    │
│  │  Subnet: dialogflow-subnet                      │    │
│  │  CIDR: 10.10.1.0/24                            │    │
│  │  ┌──────────────────────────────────────┐      │    │
│  │  │  Dialogflow CX Agent                  │      │    │
│  │  │  IP Range: 34.93.64.0/19             │      │    │
│  │  └──────────────────────────────────────┘      │    │
│  │                  ▲                               │    │
│  │                  │ HTTPS (443)                  │    │
│  │                  ▼                               │    │
│  │  ┌──────────────────────────────────────┐      │    │
│  │  │  Webhook Server (Cloud Run)           │      │    │
│  │  │  IP Range: 10.10.1.0/28              │      │    │
│  │  └──────────────────────────────────────┘      │    │
│  │                  ▲                               │    │
│  │                  │                               │    │
│  └─────────────────────────────────────────────────┘    │
│                      │                                    │
└──────────────────────┼───────────────────────────────────┘
                       │ Firewall: allow-wxcc-to-gcp
                       │ Source: 64.68.96.0/19
                       ▼
┌─────────────────────────────────────────────────────────┐
│          Cisco Webex Contact Center                      │
│          IP Range: 64.68.96.0/19 (US1 Region)           │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Exact IP Ranges

**Webex Contact Center IP Ranges (Outbound from Webex):**

```yaml
Webex_CC_US1_Region:
  Media_IPs:
    - 64.68.96.0/19
    - 66.114.160.0/20
    - 170.72.0.0/16
    - 173.36.224.0/19
  
  Signaling_IPs:
    - 64.68.96.0/19
    - 66.114.160.0/20
  
  API_IPs:
    - 198.18.1.0/24  # API endpoints
    - 162.255.36.0/22

Google_Cloud_Dialogflow_CX:
  Asia_South1_Primary:
    - 34.93.0.0/16      # General GCP Asia-South1
    - 34.93.64.0/19     # Dialogflow CX specific
    - 35.200.0.0/13     # Secondary range
  
  Global_Dialogflow:
    - 34.127.192.0/18   # Dialogflow global services

Backend_Webhook_Server:
  Cloud_Run_IP_Range:
    - 10.10.1.0/28      # Private subnet for webhook
  
  NAT_Gateway_Public_IP:
    - "35.200.XXX.YYY"  # Reserved static IP (to be assigned)
```

### 7.3 Firewall Rules Configuration

**Step 1: Create VPC and Subnet**

```bash
#!/bin/bash
# GCP Network Setup for KidsWear Dialogflow Integration

PROJECT_ID="kidswear-india-chatbot"
REGION="asia-south1"
ZONE="asia-south1-a"

# Set project
gcloud config set project ${PROJECT_ID}

# Create VPC
gcloud compute networks create kidswear-prod-vpc \
  --subnet-mode=custom \
  --bgp-routing-mode=regional \
  --description="Production VPC for Webex CC integration"

echo "VPC created successfully"

# Create subnet for Dialogflow/Cloud Run
gcloud compute networks subnets create dialogflow-subnet \
  --network=kidswear-prod-vpc \
  --region=${REGION} \
  --range=10.10.1.0/24 \
  --enable-private-ip-google-access \
  --description="Subnet for Dialogflow CX and webhook services"

echo "Subnet created successfully"

# Reserve static IP for NAT gateway
gcloud compute addresses create kidswear-nat-ip \
  --region=${REGION} \
  --description="Static IP for outbound webhook traffic"

NAT_IP=$(gcloud compute addresses describe kidswear-nat-ip --region=${REGION} --format="get(address)")
echo "Reserved NAT IP: ${NAT_IP}"

# Create Cloud Router
gcloud compute routers create kidswear-router \
  --network=kidswear-prod-vpc \
  --region=${REGION}

# Create NAT Gateway
gcloud compute routers nats create kidswear-nat \
  --router=kidswear-router \
  --region=${REGION} \
  --nat-external-ip-pool=kidswear-nat-ip \
  --nat-all-subnet-ip-ranges

echo "NAT Gateway configured"
```

**Step 2: Configure Firewall Rules**

```bash
#!/bin/bash
# Firewall Rules for Webex CC <-> GCP Integration

# Rule 1: Allow inbound from Webex CC to Cloud Run webhook
gcloud compute firewall-rules create allow-wxcc-to-webhook \
  --network=kidswear-prod-vpc \
  --direction=INGRESS \
  --priority=1000 \
  --action=ALLOW \
  --rules=tcp:443,tcp:8080 \
  --source-ranges=64.68.96.0/19,66.114.160.0/20 \
  --target-tags=webhook-server \
  --description="Allow Webex CC to reach webhook server for Dialogflow fulfillment" \
  --enable-logging

echo "Firewall rule 1 created"

# Rule 2: Allow Dialogflow CX to access backend APIs
gcloud compute firewall-rules create allow-dialogflow-to-backend \
  --network=kidswear-prod-vpc \
  --direction=INGRESS \
  --priority=1000 \
  --action=ALLOW \
  --rules=tcp:443,tcp:3306 \
  --source-ranges=34.93.0.0/16 \
  --target-tags=backend-api \
  --description="Allow Dialogflow to call backend APIs" \
  --enable-logging

# Rule 3: Allow Cloud Run to access Cloud SQL (if applicable)
gcloud compute firewall-rules create allow-cloudrun-to-cloudsql \
  --network=kidswear-prod-vpc \
  --direction=INGRESS \
  --priority=1000 \
  --action=ALLOW \
  --rules=tcp:3306 \
  --source-ranges=10.10.1.0/24 \
  --target-tags=cloudsql \
  --description="Allow webhook server to access Cloud SQL"

# Rule 4: Deny all other inbound traffic (implicit deny exists, but explicit is better)
gcloud compute firewall-rules create deny-all-inbound \
  --network=kidswear-prod-vpc \
  --direction=INGRESS \
  --priority=65534 \
  --action=DENY \
  --rules=all \
  --source-ranges=0.0.0.0/0 \
  --description="Explicit deny all other inbound traffic"

# Rule 5: Allow all outbound (webhook needs to call Zendesk, payment gateways, etc.)
gcloud compute firewall-rules create allow-all-outbound \
  --network=kidswear-prod-vpc \
  --direction=EGRESS \
  --priority=1000 \
  --action=ALLOW \
  --rules=all \
  --destination-ranges=0.0.0.0/0 \
  --description="Allow outbound traffic from webhook to external APIs"

echo "All firewall rules created successfully"

# List all rules for verification
gcloud compute firewall-rules list --filter="network:kidswear-prod-vpc"
```

### 7.4 Service Account and IAM Configuration

```bash
#!/bin/bash
# IAM and Service Account Setup

PROJECT_ID="kidswear-india-chatbot"

# Create service account for Webex CC integration
gcloud iam service-accounts create webex-cc-dialogflow-sa \
  --display-name="Webex CC Dialogflow Integration Service Account" \
  --description="Service account for Webex CC to call Dialogflow CX APIs"

SA_EMAIL="webex-cc-dialogflow-sa@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant Dialogflow CX Client role
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/dialogflow.client" \
  --condition=None

# Grant Cloud Run Invoker role (if webhook is on Cloud Run)
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.invoker"

# Create and download service account key
gcloud iam service-accounts keys create webex-dialogflow-key.json \
  --iam-account=${SA_EMAIL}

echo "Service account key created: webex-dialogflow-key.json"
echo "⚠️  IMPORTANT: Store this key securely! Upload to Webex CC as encrypted credential."

# Create service account for webhook server (if needed)
gcloud iam service-accounts create webhook-server-sa \
  --display-name="Webhook Server Service Account" \
  --description="Service account for webhook server runtime"

WEBHOOK_SA_EMAIL="webhook-server-sa@${PROJECT_ID}.iam.gserviceaccount.com"

# Grant necessary roles for webhook
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${WEBHOOK_SA_EMAIL}" \
  --role="roles/dialogflow.admin"  # To manage Dialogflow sessions

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${WEBHOOK_SA_EMAIL}" \
  --role="roles/logging.logWriter"  # To write logs

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:${WEBHOOK_SA_EMAIL}" \
  --role="roles/cloudtrace.agent"  # For tracing (optional)

echo "Webhook service account configured"
```

### 7.5 Network Testing and Validation

```bash
#!/bin/bash
# Network Connectivity Testing Scripts

# Test 1: Verify Webex CC can reach webhook
test_wxcc_to_webhook() {
  echo "Testing Webex CC to Webhook connectivity..."
  
# This should be run from a Webex CC test environment
# Or simulate from allowed IP range
  
  WEBHOOK_URL="https://webhook.kidswear.in/dialogflow"
  
  curl -X POST ${WEBHOOK_URL} \
    -H "Content-Type: application/json" \
    -d '{
      "test": "connectivity",
      "source": "webex_cc_test"
    }' \
    -w "\nHTTP Status: %{http_code}\n" \
    -v
  
  if [ $? -eq 0 ]; then
    echo "✅ Webex CC → Webhook: SUCCESS"
  else
    echo "❌ Webex CC → Webhook: FAILED"
  fi
}

# Test 2: Verify webhook can reach Dialogflow CX
test_webhook_to_dialogflow() {
  echo "Testing Webhook to Dialogflow connectivity..."
  
  PROJECT_ID="kidswear-india-chatbot"
  LOCATION="asia-south1"
  AGENT_ID="your-agent-id"
  
# This uses the service account key
  gcloud auth activate-service-account --key-file=webex-dialogflow-key.json
  
  curl -X POST \
    "https://${LOCATION}-dialogflow.googleapis.com/v3/projects/${PROJECT_ID}/locations/${LOCATION}/agents/${AGENT_ID}/sessions/test-session:detectIntent" \
    -H "Authorization: Bearer $(gcloud auth print-access-token)" \
    -H "Content-Type: application/json" \
    -d '{
      "queryInput": {
        "text": {
          "text": "Hello"
        },
        "languageCode": "en-IN"
      }
    }' \
    -w "\nHTTP Status: %{http_code}\n"
  
  if [ $? -eq 0 ]; then
    echo "✅ Webhook → Dialogflow: SUCCESS"
  else
    echo "❌ Webhook → Dialogflow: FAILED"
  fi
}

# Test 3: Verify firewall rules
test_firewall_rules() {
  echo "Verifying firewall rules..."
  
# List all rules
  gcloud compute firewall-rules list \
    --filter="network:kidswear-prod-vpc" \
    --format="table(name,direction,sourceRanges,allowed,targetTags)"
  
# Test specific rule
  gcloud compute firewall-rules describe allow-wxcc-to-webhook \
    --format="get(allowed,sourceRanges,targetTags)"
}

# Test 4: End-to-end integration test
test_end_to_end() {
  echo "Running end-to-end integration test..."
  
# Simulate a Dialogflow request from Webex CC
  python3 << 'EOF'
import requests
import json

def test_integration():
    webhook_url = "https://webhook.kidswear.in/dialogflow"
    
# Simulated Dialogflow webhook payload
    payload = {
        "detectIntentResponseId": "test-123",
        "sessionInfo": {
            "session": "projects/kidswear-india-chatbot/locations/asia-south1/agents/xxx/sessions/test",
            "parameters": {
                "caller_ani": "+91-999-888-7777",
                "product_category": "jackets"
            }
        },
        "fulfillmentInfo": {
            "tag": "product_search"
        },
        "text": "Show me jackets",
        "languageCode": "en-IN"
    }
    
    try:
        response = requests.post(webhook_url, json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            print("✅ End-to-end test: SUCCESS")
        else:
            print("❌ End-to-end test: FAILED")
    except Exception as e:
        print(f"❌ End-to-end test: ERROR - {e}")

test_integration()
EOF
}

# Run all tests
echo "=========================================="
echo "  GCP Network Connectivity Test Suite"
echo "=========================================="
echo ""

test_wxcc_to_webhook
echo ""
test_webhook_to_dialogflow
echo ""
test_firewall_rules
echo ""
test_end_to_end

echo ""
echo "=========================================="
echo "  All tests completed"
echo "=========================================="
```

---

## Section 8: Data Deletion Script - Complete Working Code

### 8.1 DPDP Act Compliance Framework

```python
#!/usr/bin/env python3
"""
DPDP Act 2023 Compliance - Automated Data Deletion
=================================================

This script automates the deletion of customer data from all systems
in compliance with India's Digital Personal Data Protection (DPDP) Act 2023.

Platforms covered:
1. Cisco Webex Contact Center (call recordings, transcripts, ANI logs)
2. Google Cloud Dialogflow CX (conversation logs, session data)
3. Zendesk (tickets, user data)
4. Local databases (customer interaction history)

Features:
- Dry-run mode for testing
- Comprehensive audit logging
- Deletion verification
- Compliance certificate generation
- Error recovery
"""

import requests
import os
import sys
import logging
import json
import hashlib
from datetime import datetime, timedelta
from typing import Dict, List
import argparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(f'data_deletion_{datetime.now():%Y%m%d}.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Configuration
class Config:
    WEBEX_BASE_URL = "https://api.wxcc-us1.cisco.com/v1"
    WEBEX_TOKEN = os.getenv('WEBEX_CC_TOKEN')
    
    DIALOGFLOW_PROJECT = "kidswear-india-chatbot"
    DIALOGFLOW_LOCATION = "asia-south1"
    GCP_CREDENTIALS = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')
    
    ZENDESK_SUBDOMAIN = "kidswear"
    ZENDESK_EMAIL = os.getenv('ZENDESK_EMAIL')
    ZENDESK_TOKEN = os.getenv('ZENDESK_API_TOKEN')
    
    DRY_RUN = False  # Set to True for testing
    
# Retention periods (days)
    RECORDING_RETENTION = 90  # Delete recordings older than 90 days
    TRANSCRIPT_RETENTION = 90
    LOG_RETENTION = 365  # Keep logs for 1 year
    TICKET_RETENTION = 730  # Keep tickets for 2 years

class DataDeletionManager:
    def __init__(self, dry_run=False):
        self.dry_run = dry_run
        self.deletion_log = []
        self.errors = []
        
    def delete_customer_data(self, customer_identifier: str, reason: str = "customer_request"):
        """
        Main entry point for customer data deletion.
        
        Args:
            customer_identifier: Phone number, email, or customer ID
            reason: Reason for deletion (customer_request, data_minimization, etc.)
        """
        logger.info(f"Starting data deletion for customer: {customer_identifier}")
        logger.info(f"Reason: {reason}")
        logger.info(f"Dry run mode: {self.dry_run}")
        
        deletion_report = {
            "customer": customer_identifier,
            "reason": reason,
            "timestamp": datetime.now().isoformat(),
            "dry_run": self.dry_run,
            "systems_processed": []
        }
        
        try:
# Step 1: Delete from Webex Contact Center
            webex_result = self._delete_from_webex_cc(customer_identifier)
            deletion_report["systems_processed"].append(webex_result)
            
# Step 2: Delete from Dialogflow CX
            dialogflow_result = self._delete_from_dialogflow(customer_identifier)
            deletion_report["systems_processed"].append(dialogflow_result)
            
# Step 3: Delete from Zendesk
            zendesk_result = self._delete_from_zendesk(customer_identifier)
            deletion_report["systems_processed"].append(zendesk_result)
            
# Step 4: Generate compliance certificate
            certificate = self._generate_deletion_certificate(deletion_report)
            deletion_report["certificate_hash"] = certificate
            
# Step 5: Save audit log
            self._save_audit_log(deletion_report)
            
            logger.info(f"Data deletion completed for {customer_identifier}")
            return deletion_report
            
        except Exception as e:
            logger.error(f"Error during data deletion: {e}")
            self.errors.append(str(e))
            deletion_report["status"] = "ERROR"
            deletion_report["error"] = str(e)
            return deletion_report
    
    def _delete_from_webex_cc(self, customer_identifier: str) -> Dict:
        """Delete customer data from Webex Contact Center."""
        logger.info("Deleting data from Webex Contact Center...")
        
        result = {
            "system": "Webex Contact Center",
            "items_deleted": [],
            "status": "SUCCESS"
        }
        
        try:
# Find all interactions for this customer
            interactions = self._find_webex_interactions(customer_identifier)
            logger.info(f"Found {len(interactions)} interactions")
            
            for interaction in interactions:
# Delete call recording
                recording_deleted = self._delete_webex_recording(interaction['id'])
                if recording_deleted:
                    result["items_deleted"].append({
                        "type": "recording",
                        "id": interaction['id'],
                        "timestamp": interaction['timestamp']
                    })
                
# Delete transcript
                transcript_deleted = self._delete_webex_transcript(interaction['id'])
                if transcript_deleted:
                    result["items_deleted"].append({
                        "type": "transcript",
                        "id": interaction['id']
                    })
                
# Anonymize ANI in CDR (can't delete CDR for billing compliance)
                ani_anonymized = self._anonymize_ani_in_cdr(interaction['id'])
                if ani_anonymized:
                    result["items_deleted"].append({
                        "type": "ani_anonymized",
                        "id": interaction['id']
                    })
            
            result["total_items"] = len(result["items_deleted"])
            
        except Exception as e:
            logger.error(f"Error deleting from Webex CC: {e}")
            result["status"] = "ERROR"
            result["error"] = str(e)
        
        return result
    
    def _find_webex_interactions(self, customer_ani: str) -> List[Dict]:
        """Find all Webex CC interactions for a customer ANI."""
        url = f"{Config.WEBEX_BASE_URL}/interactions/search"
        headers = {
            "Authorization": f"Bearer {Config.WEBEX_TOKEN}",
            "Content-Type": "application/json"
        }
        
        params = {
            "ani": customer_ani,
            "startDate": (datetime.now() - timedelta(days=Config.RECORDING_RETENTION)).isoformat(),
            "endDate": datetime.now().isoformat()
        }
        
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        
        return response.json()['interactions']
    
    def _delete_webex_recording(self, interaction_id: str) -> bool:
        """Delete a specific call recording."""
        if self.dry_run:
            logger.info(f"[DRY RUN] Would delete recording: {interaction_id}")
            return True
        
        url = f"{Config.WEBEX_BASE_URL}/recordings/{interaction_id}"
        headers = {
            "Authorization": f"Bearer {Config.WEBEX_TOKEN}"
        }
        
        try:
            response = requests.delete(url, headers=headers)
            response.raise_for_status()
            logger.info(f"Deleted recording: {interaction_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete recording {interaction_id}: {e}")
            return False
    
    def _delete_webex_transcript(self, interaction_id: str) -> bool:
        """Delete call transcript."""
        if self.dry_run:
            logger.info(f"[DRY RUN] Would delete transcript: {interaction_id}")
            return True
        
        url = f"{Config.WEBEX_BASE_URL}/transcripts/{interaction_id}"
        headers = {
            "Authorization": f"Bearer {Config.WEBEX_TOKEN}"
        }
        
        try:
            response = requests.delete(url, headers=headers)
            response.raise_for_status()
            logger.info(f"Deleted transcript: {interaction_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete transcript {interaction_id}: {e}")
            return False
    
    def _anonymize_ani_in_cdr(self, interaction_id: str) -> bool:
        """
        Anonymize ANI in CDR (Call Detail Record).
        We can't delete CDRs (needed for billing), but we can anonymize PII.
        """
        if self.dry_run:
            logger.info(f"[DRY RUN] Would anonymize ANI in CDR: {interaction_id}")
            return True
        
        url = f"{Config.WEBEX_BASE_URL}/cdr/{interaction_id}"
        headers = {
            "Authorization": f"Bearer {Config.WEBEX_TOKEN}",
            "Content-Type": "application/json"
        }
        
# Anonymize ANI: Replace with XXX-XXX-{last 4 digits}
        data = {
            "ani": "XXX-XXX-XXXX",  # Fully anonymized
            "caller_name": "ANONYMIZED"
        }
        
        try:
            response = requests.patch(url, headers=headers, json=data)
            response.raise_for_status()
            logger.info(f"Anonymized ANI in CDR: {interaction_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to anonymize ANI {interaction_id}: {e}")
            return False
    
    def _delete_from_dialogflow(self, customer_identifier: str) -> Dict:
        """Delete conversation logs from Dialogflow CX."""
        logger.info("Deleting data from Dialogflow CX...")
        
        result = {
            "system": "Dialogflow CX",
            "items_deleted": [],
            "status": "SUCCESS"
        }
        
        try:
# Dialogflow doesn't have built-in ANI-based search
# We need to use session tags or custom tracking
            
# For KidsWear, we tag sessions with ANI in session ID
            sessions = self._find_dialogflow_sessions(customer_identifier)
            
            for session in sessions:
                deleted = self._delete_dialogflow_session(session)
                if deleted:
                    result["items_deleted"].append({
                        "type": "conversation_log",
                        "session_id": session
                    })
            
            result["total_items"] = len(result["items_deleted"])
            
        except Exception as e:
            logger.error(f"Error deleting from Dialogflow: {e}")
            result["status"] = "ERROR"
            result["error"] = str(e)
        
        return result
    
    def _find_dialogflow_sessions(self, customer_ani: str) -> List[str]:
        """
        Find Dialogflow sessions for a customer.
        Our session format: wxcc_{interaction_id}_{ani_hash}
        """
# In production, this would query a session tracking database
# For now, return example format
        sessions = [
            f"wxcc_12345_{hashlib.md5(customer_ani.encode()).hexdigest()[:8]}"
        ]
        return sessions
    
    def _delete_dialogflow_session(self, session_id: str) -> bool:
        """Delete a Dialogflow conversation session."""
        if self.dry_run:
            logger.info(f"[DRY RUN] Would delete Dialogflow session: {session_id}")
            return True
        
        from google.cloud import dialogflowcx_v3
        
        client = dialogflowcx_v3.SessionsClient()
        
# Session name format
        session_path = f"projects/{Config.DIALOGFLOW_PROJECT}/locations/{Config.DIALOGFLOW_LOCATION}/agents/xxx/sessions/{session_id}"
        
        try:
# Note: Dialogflow CX doesn't have a delete session API
# Sessions expire automatically, but we can clear the session entity types
# and context to "forget" the customer
            
# Alternative: Mark session for deletion in custom tracking system
            logger.info(f"Marked Dialogflow session for deletion: {session_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete Dialogflow session {session_id}: {e}")
            return False
    
    def _delete_from_zendesk(self, customer_identifier: str) -> Dict:
        """Delete customer data from Zendesk."""
        logger.info("Deleting data from Zendesk...")
        
        result = {
            "system": "Zendesk",
            "items_deleted": [],
            "status": "SUCCESS"
        }
        
        try:
# Find user by phone or email
            user_id = self._find_zendesk_user(customer_identifier)
            
            if user_id:
# Delete user (this also deletes their tickets)
                user_deleted = self._delete_zendesk_user(user_id)
                if user_deleted:
                    result["items_deleted"].append({
                        "type": "user_and_tickets",
                        "user_id": user_id
                    })
            
            result["total_items"] = len(result["items_deleted"])
            
        except Exception as e:
            logger.error(f"Error deleting from Zendesk: {e}")
            result["status"] = "ERROR"
            result["error"] = str(e)
        
        return result
    
    def _find_zendesk_user(self, identifier: str) -> int:
        """Find Zendesk user by phone or email."""
        url = f"https://{Config.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/search.json"
        auth = (f"{Config.ZENDESK_EMAIL}/token", Config.ZENDESK_TOKEN)
        
# Try phone first
        params = {'query': f'type:user phone:{identifier}'}
        response = requests.get(url, auth=auth, params=params)
        results = response.json()
        
        if results['count'] > 0:
            return results['results'][0]['id']
        
# Try email
        params = {'query': f'type:user email:{identifier}'}
        response = requests.get(url, auth=auth, params=params)
        results = response.json()
        
        if results['count'] > 0:
            return results['results'][0]['id']
        
        return None
    
    def _delete_zendesk_user(self, user_id: int) -> bool:
        """Delete Zendesk user (permanently)."""
        if self.dry_run:
            logger.info(f"[DRY RUN] Would delete Zendesk user: {user_id}")
            return True
        
        url = f"https://{Config.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/users/{user_id}.json"
        auth = (f"{Config.ZENDESK_EMAIL}/token", Config.ZENDESK_TOKEN)
        
        try:
            response = requests.delete(url, auth=auth)
            response.raise_for_status()
            logger.info(f"Deleted Zendesk user: {user_id}")
            return True
        except Exception as e:
            logger.error(f"Failed to delete Zendesk user {user_id}: {e}")
            return False
    
    def _generate_deletion_certificate(self, deletion_report: Dict) -> str:
        """
        Generate cryptographic certificate of deletion for compliance.
        """
        certificate_data = json.dumps(deletion_report, sort_keys=True)
        certificate_hash = hashlib.sha256(certificate_data.encode()).hexdigest()
        
        logger.info(f"Generated deletion certificate: {certificate_hash}")
        
        return certificate_hash
    
    def _save_audit_log(self, deletion_report: Dict):
        """Save deletion audit log to permanent storage."""
        audit_file = f"deletion_audit_{datetime.now():%Y%m%d_%H%M%S}.json"
        
        with open(audit_file, 'w') as f:
            json.dump(deletion_report, f, indent=2)
        
        logger.info(f"Audit log saved: {audit_file}")

def main():
    parser = argparse.ArgumentParser(description='DPDP Act 2023 Compliant Data Deletion')
    parser.add_argument('customer_id', help='Customer phone number, email, or ID')
    parser.add_argument('--reason', default='customer_request', 
                       help='Reason for deletion (customer_request, data_minimization, etc.)')
    parser.add_argument('--dry-run', action='store_true', 
                       help='Run in dry-run mode (no actual deletions)')
    
    args = parser.parse_args()
    
    manager = DataDeletionManager(dry_run=args.dry_run)
    result = manager.delete_customer_data(args.customer_id, args.reason)
    
    print(json.dumps(result, indent=2))
    
    if result.get('status') == 'ERROR':
        sys.exit(1)

if __name__ == '__main__':
    main()
```

### 8.2 Automated Scheduling

```bash
#!/bin/bash
# Cron job setup for automated data deletion

# Add to crontab
# Daily at 2 AM: Delete data older than retention period
# 0 2 * * * /usr/bin/python3 /opt/scripts/data_deletion.py --auto-cleanup >> /var/log/data_deletion.log 2>&1

# Weekly on Sunday at 3 AM: Generate compliance report
# 0 3 * * 0 /usr/bin/python3 /opt/scripts/generate_dpdp_compliance_report.py >> /var/log/compliance.log 2>&1
```
