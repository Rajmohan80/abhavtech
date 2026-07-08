# Appendix A: API Reference Guide - Complete Integration Documentation

## Comprehensive API Documentation for Webex Contact Center, Dialogflow CX, and Zendesk

**Document Version:** 1.0  
**Project:** KidsWear India - Cisco Webex Contact Center Greenfield Deployment  
**Related Chapter:** Chapter 4 - Platform Provisioning (LLD)  
**Last Updated:** March 2026

---

## Table of Contents

1. [API Overview and Architecture](#1-api-overview-and-architecture)
2. [Webex Contact Center APIs](#2-webex-contact-center-apis)
3. [Dialogflow CX APIs](#3-dialogflow-cx-apis)
4. [Zendesk APIs](#4-zendesk-apis)
5. [Authentication and Security](#5-authentication-and-security)
6. [Webhook Configurations](#6-webhook-configurations)
7. [Error Handling and Retry Logic](#7-error-handling-and-retry-logic)
8. [Rate Limiting and Quotas](#8-rate-limiting-and-quotas)
9. [API Testing and Validation](#9-api-testing-and-validation)
10. [Production Deployment Checklist](#10-production-deployment-checklist)

---

## 1. API Overview and Architecture

### 1.1 Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    API Integration Layer                     │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐  │
│  │   Webex CC   │    │ Dialogflow   │    │   Zendesk    │  │
│  │     APIs     │◄──►│   CX APIs    │◄──►│     APIs     │  │
│  └──────────────┘    └──────────────┘    └──────────────┘  │
│         │                    │                    │          │
│         └────────────────────┴────────────────────┘          │
│                              │                                │
│                    ┌─────────▼─────────┐                     │
│                    │  API Gateway      │                     │
│                    │  (Rate Limiting,  │                     │
│                    │   Auth, Logging)  │                     │
│                    └─────────┬─────────┘                     │
│                              │                                │
│                    ┌─────────▼─────────┐                     │
│                    │  Backend Services │                     │
│                    │  (Business Logic) │                     │
│                    └───────────────────┘                     │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 API Integration Points

| Integration | Purpose | API Type | Authentication |
|-------------|---------|----------|----------------|
| **Webex CC → Dialogflow** | Natural language processing | REST + WebSocket | OAuth 2.0 |
| **Webex CC → Zendesk** | CRM screen pop, ticket creation | REST | API Token |
| **Dialogflow → Webex CC** | Intent fulfillment, agent transfer | REST | Service Account |
| **Zendesk → Webex CC** | Click-to-call, call logging | REST + Webhook | OAuth 2.0 |

### 1.3 API Communication Flow

**Customer Call Flow:**
```
1. Customer calls → Webex CC IVR
2. IVR collects initial input (DTMF or Speech)
3. Webex CC sends to Dialogflow CX (via API)
4. Dialogflow processes intent → returns response
5. If agent needed: Webex CC queries Zendesk API (customer lookup)
6. Agent answers with screen pop (Zendesk CTI connector)
7. Call events logged back to Zendesk via API
```

---

## 2. Webex Contact Center APIs

### 2.1 API Base URLs

**Production:**
```
Base URL: https://api.wxcc-us1.cisco.com
API Version: v1
```

**Sandbox/Test:**
```
Base URL: https://api.wxcc-emu1.cisco.com
API Version: v1
```

### 2.2 Authentication

**OAuth 2.0 Token Request:**

```bash
POST https://webexapis.com/v1/access_token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET&
refresh_token=YOUR_REFRESH_TOKEN
```

**Response:**
```json
{
  "access_token": "ZDc3OThmYjUtNmI0Yy00ZGM5LWFjYjYtNmRlNzIyY2ZlNjY2",
  "expires_in": 14400,
  "refresh_token": "MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTIzNDU2Nzg5MDEy",
  "refresh_token_expires_in": 7776000,
  "token_type": "Bearer"
}
```

### 2.3 Core API Endpoints

#### 2.3.1 Queue Management

**Get Queue Statistics:**
```bash
GET /v1/organization/{orgId}/queues/{queueId}/statistics
Authorization: Bearer {access_token}
```

**Request Example:**
```bash
curl -X GET 'https://api.wxcc-us1.cisco.com/v1/organization/12345/queues/queue-001/statistics' \
  -H 'Authorization: Bearer ZDc3OThmYjUtNmI0Yy00ZGM5LWFjYjYtNmRlNzIyY2ZlNjY2'
```

**Response:**
```json
{
  "data": {
    "queueId": "queue-001",
    "queueName": "Sales_Queue",
    "timestamp": "2025-11-21T10:30:00Z",
    "metrics": {
      "callsInQueue": 5,
      "longestWaitTime": 120,
      "averageWaitTime": 45,
      "availableAgents": 8,
      "busyAgents": 12,
      "callsAnsweredToday": 247,
      "callsAbandonedToday": 15,
      "serviceLevelPercent": 87.5
    }
  }
}
```

#### 2.3.2 Agent Management

**Get Agent State:**
```bash
GET /v1/organization/{orgId}/agents/{agentId}/state
Authorization: Bearer {access_token}
```

**Response:**
```json
{
  "data": {
    "agentId": "agent-001",
    "agentName": "John Doe",
    "currentState": "AVAILABLE",
    "stateTimestamp": "2025-11-21T10:25:00Z",
    "teamName": "Sales_Team",
    "skills": ["English", "Sales", "ProductSupport"],
    "activeContacts": 0,
    "maxContacts": 3
  }
}
```

**Update Agent State:**
```bash
PUT /v1/organization/{orgId}/agents/{agentId}/state
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "state": "IDLE",
  "reasonCode": "LUNCH",
  "autoAnswer": false
}
```

#### 2.3.3 Task Management

**Create Task:**
```bash
POST /v1/organization/{orgId}/tasks
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "queueId": "queue-email-support",
  "channel": "email",
  "priority": 2,
  "customerInfo": {
    "customerId": "CUST-12345",
    "email": "customer@example.com",
    "name": "Jane Smith"
  },
  "taskData": {
    "subject": "Product inquiry",
    "body": "I need help with order #78901"
  }
}
```

**Response:**
```json
{
  "data": {
    "taskId": "task-78901",
    "status": "queued",
    "createdAt": "2025-11-21T10:30:00Z",
    "queuePosition": 3,
    "estimatedWaitTime": 180
  }
}
```

#### 2.3.4 Call Recording

**Retrieve Call Recording:**
```bash
GET /v1/organization/{orgId}/recordings/{recordingId}
Authorization: Bearer {access_token}
Accept: audio/wav
```

**Response Headers:**
```
Content-Type: audio/wav
Content-Length: 2458240
X-Recording-Duration: 245
X-Recording-Codec: PCM
```

#### 2.3.5 Reporting APIs

**Real-Time Dashboard Data:**
```bash
GET /v1/organization/{orgId}/analytics/realtime
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `startTime` - ISO 8601 timestamp
- `endTime` - ISO 8601 timestamp
- `metrics` - Comma-separated list (callsOffered, callsHandled, avgHandleTime)
- `groupBy` - queue, team, agent

**Example:**
```bash
curl -X GET 'https://api.wxcc-us1.cisco.com/v1/organization/12345/analytics/realtime?startTime=2025-11-21T00:00:00Z&endTime=2025-11-21T23:59:59Z&metrics=callsOffered,callsHandled&groupBy=queue'
```

**Response:**
```json
{
  "data": {
    "timestamp": "2025-11-21T10:30:00Z",
    "metrics": [
      {
        "queueId": "queue-001",
        "queueName": "Sales_Queue",
        "callsOffered": 312,
        "callsHandled": 287,
        "callsAbandoned": 25,
        "avgHandleTime": 320,
        "serviceLevelPercent": 89.2
      },
      {
        "queueId": "queue-002",
        "queueName": "Support_Queue",
        "callsOffered": 458,
        "callsHandled": 441,
        "callsAbandoned": 17,
        "avgHandleTime": 405,
        "serviceLevelPercent": 92.1
      }
    ]
  }
}
```

### 2.4 Webex CC Webhook Events

**Configure Webhook Endpoint:**
```bash
POST /v1/organization/{orgId}/webhooks
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "name": "CallEventWebhook",
  "targetUrl": "https://your-server.com/webhooks/webex-cc",
  "resource": "calls",
  "event": "created",
  "filter": "queueId=queue-001",
  "secret": "your-webhook-secret-key"
}
```

**Incoming Webhook Payload (Call Created):**
```json
{
  "id": "webhook-event-12345",
  "name": "CallEventWebhook",
  "resource": "calls",
  "event": "created",
  "orgId": "12345",
  "createdBy": "system",
  "appId": "app-67890",
  "created": "2025-11-21T10:30:00Z",
  "data": {
    "id": "call-abc123",
    "callId": "abc123",
    "queueId": "queue-001",
    "ani": "+919876543210",
    "dnis": "+918001234567",
    "entryPointId": "ep-001",
    "createdTime": "2025-11-21T10:30:00Z",
    "direction": "inbound"
  }
}
```

**Webhook Signature Verification:**
```python
import hmac
import hashlib

def verify_webhook_signature(payload, signature, secret):
    expected_signature = hmac.new(
        secret.encode(),
        payload.encode(),
        hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(signature, expected_signature)
```

---

## 3. Dialogflow CX APIs

### 3.1 API Base URLs

**Global Endpoint:**
```
Base URL: https://dialogflow.googleapis.com/v3
Region-Specific: https://us-dialogflow.googleapis.com/v3 (US)
                https://eu-dialogflow.googleapis.com/v3 (Europe)
```

### 3.2 Authentication

**Service Account Authentication:**
```bash
# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"

# Get OAuth token
gcloud auth application-default print-access-token
```

**Response:**
```
ya29.A0AfH6SMBx...{token}
```

### 3.3 Session Management

**Detect Intent (Text):**
```bash
POST https://us-dialogflow.googleapis.com/v3/projects/{projectId}/locations/{location}/agents/{agentId}/sessions/{sessionId}:detectIntent
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "queryInput": {
    "text": {
      "text": "I want to check my order status"
    },
    "languageCode": "en"
  },
  "queryParams": {
    "parameters": {
      "customerId": "CUST-12345",
      "orderId": "ORD-78901"
    }
  }
}
```

**Response:**
```json
{
  "responseId": "response-xyz789",
  "queryResult": {
    "text": "I want to check my order status",
    "languageCode": "en",
    "parameters": {
      "orderId": "ORD-78901",
      "customerId": "CUST-12345"
    },
    "intent": {
      "name": "projects/kidswear-ai/locations/us-central1/agents/agent-001/intents/order-status",
      "displayName": "OrderStatus"
    },
    "intentDetectionConfidence": 0.95,
    "match": {
      "intent": {
        "displayName": "OrderStatus"
      },
      "confidence": 0.95,
      "matchType": "INTENT"
    },
    "responseMessages": [
      {
        "text": {
          "text": [
            "Let me check your order ORD-78901. Your order was shipped on Nov 15th and is expected to arrive by Nov 22nd."
          ]
        }
      }
    ]
  }
}
```

**Detect Intent (DTMF):**
```json
{
  "queryInput": {
    "dtmf": {
      "digits": "1234",
      "finishDigit": "#"
    },
    "languageCode": "en"
  }
}
```

### 3.4 Webhook Fulfillment

**Configure Webhook in Dialogflow CX:**
1. Navigate to Agent → Manage → Webhooks
2. Create webhook: `https://your-server.com/webhooks/dialogflow-cx`
3. Set timeout: 5 seconds
4. Enable authentication (optional)

**Incoming Webhook Request from Dialogflow:**
```json
{
  "detectIntentResponseId": "response-abc123",
  "intentInfo": {
    "lastMatchedIntent": "projects/kidswear-ai/locations/us-central1/agents/agent-001/intents/check-order",
    "displayName": "CheckOrder",
    "confidence": 0.92,
    "parameters": {
      "orderId": {
        "originalValue": "78901",
        "resolvedValue": "78901"
      }
    }
  },
  "pageInfo": {
    "currentPage": "projects/kidswear-ai/locations/us-central1/agents/agent-001/flows/main-flow/pages/order-inquiry",
    "displayName": "OrderInquiry"
  },
  "sessionInfo": {
    "session": "projects/kidswear-ai/locations/us-central1/agents/agent-001/sessions/session-xyz",
    "parameters": {
      "customerId": "CUST-12345",
      "phoneNumber": "+919876543210"
    }
  },
  "fulfillmentInfo": {
    "tag": "check-order-fulfillment"
  }
}
```

**Webhook Response (Fulfillment):**
```json
{
  "fulfillmentResponse": {
    "messages": [
      {
        "text": {
          "text": [
            "Your order #78901 was shipped on November 15th. Expected delivery: November 22nd. Tracking: TRK123456789"
          ]
        }
      }
    ]
  },
  "sessionInfo": {
    "parameters": {
      "orderStatus": "shipped",
      "trackingNumber": "TRK123456789",
      "deliveryDate": "2025-11-22"
    }
  }
}
```

**Webhook Response (Agent Transfer):**
```json
{
  "fulfillmentResponse": {
    "messages": [
      {
        "text": {
          "text": [
            "I'll transfer you to a customer service agent who can help you further."
          ]
        }
      }
    ]
  },
  "targetPage": "projects/kidswear-ai/locations/us-central1/agents/agent-001/flows/main-flow/pages/agent-transfer",
  "sessionInfo": {
    "parameters": {
      "transferReason": "complex-inquiry",
      "transferSkill": "order-issues"
    }
  }
}
```

### 3.5 Training Phrases API

**Add Training Phrase:**
```bash
PATCH https://dialogflow.googleapis.com/v3/projects/{projectId}/locations/{location}/agents/{agentId}/intents/{intentId}
Content-Type: application/json
Authorization: Bearer {access_token}

{
  "trainingPhrases": [
    {
      "parts": [
        {
          "text": "I want to track my order "
        },
        {
          "text": "78901",
          "parameterId": "orderId"
        }
      ],
      "repeatCount": 1
    }
  ]
}
```

---

## 4. Zendesk APIs

### 4.1 API Base URL

```
Base URL: https://{subdomain}.zendesk.com/api/v2
Example: https://kidswear-support.zendesk.com/api/v2
```

### 4.2 Authentication

**API Token Authentication:**
```bash
curl https://kidswear-support.zendesk.com/api/v2/tickets.json \
  -u {email}/token:{api_token}
```

**OAuth 2.0 Token:**
```bash
POST https://kidswear-support.zendesk.com/oauth/tokens
Content-Type: application/json

{
  "grant_type": "password",
  "client_id": "your_client_id",
  "client_secret": "your_client_secret",
  "scope": "read write",
  "username": "user@example.com",
  "password": "user_password"
}
```

### 4.3 Customer Lookup

**Search User by Phone Number:**
```bash
GET /api/v2/search.json?query=type:user phone:+919876543210
Authorization: Basic {base64_encoded_credentials}
```

**Response:**
```json
{
  "results": [
    {
      "id": 9876543210,
      "name": "Rajesh Kumar",
      "email": "rajesh.kumar@example.com",
      "phone": "+919876543210",
      "organization_id": 123456,
      "custom_fields": {
        "customer_id": "CUST-12345",
        "loyalty_tier": "Gold",
        "lifetime_value": 45000
      },
      "created_at": "2023-05-15T10:30:00Z",
      "updated_at": "2025-11-15T14:20:00Z"
    }
  ],
  "count": 1
}
```

### 4.4 Ticket Management

**Create Ticket:**
```bash
POST /api/v2/tickets.json
Content-Type: application/json
Authorization: Basic {base64_encoded_credentials}

{
  "ticket": {
    "subject": "Order delivery delayed",
    "comment": {
      "body": "Customer called about delayed order #78901. Expected delivery was Nov 20th but order still shows in transit."
    },
    "requester": {
      "name": "Rajesh Kumar",
      "email": "rajesh.kumar@example.com",
      "phone": "+919876543210"
    },
    "priority": "high",
    "type": "problem",
    "tags": ["order_issue", "delivery_delay", "phone_call"],
    "custom_fields": [
      {
        "id": 360001234567,
        "value": "ORD-78901"
      },
      {
        "id": 360001234568,
        "value": "webex_cc_call"
      }
    ]
  }
}
```

**Response:**
```json
{
  "ticket": {
    "id": 12345,
    "subject": "Order delivery delayed",
    "status": "open",
    "priority": "high",
    "created_at": "2025-11-21T10:30:00Z",
    "updated_at": "2025-11-21T10:30:00Z",
    "requester_id": 9876543210,
    "submitter_id": 987654321,
    "assignee_id": null,
    "url": "https://kidswear-support.zendesk.com/api/v2/tickets/12345.json"
  }
}
```

**Update Ticket:**
```bash
PUT /api/v2/tickets/{ticket_id}.json
Content-Type: application/json
Authorization: Basic {base64_encoded_credentials}

{
  "ticket": {
    "status": "pending",
    "comment": {
      "body": "Contacted shipping carrier. Delivery rescheduled for Nov 23rd.",
      "public": true
    },
    "custom_fields": [
      {
        "id": 360001234569,
        "value": "TRK123456789"
      }
    ]
  }
}
```

### 4.5 Call Logging

**Create Call Log (Sunshine Conversation):**
```bash
POST /api/v2/channels/voice/phone_numbers/{phone_number}/calls
Content-Type: application/json
Authorization: Bearer {oauth_token}

{
  "call": {
    "direction": "inbound",
    "from": "+919876543210",
    "to": "+918001234567",
    "started_at": "2025-11-21T10:30:00Z",
    "ended_at": "2025-11-21T10:35:30Z",
    "duration": 330,
    "recording_url": "https://webex-cc-recordings.s3.amazonaws.com/call-abc123.wav",
    "disposition": "resolved",
    "notes": "Customer inquiry about order status. Provided tracking information."
  }
}
```

### 4.6 CTI Connector Events

**Incoming Call Event (Webhook):**
```json
{
  "event": "call.incoming",
  "timestamp": "2025-11-21T10:30:00Z",
  "call": {
    "id": "call-abc123",
    "from": "+919876543210",
    "to": "+918001234567",
    "direction": "inbound",
    "agent_id": "agent-001"
  },
  "customer": {
    "phone": "+919876543210",
    "zendesk_user_id": 9876543210
  }
}
```

**Screen Pop Response:**
```json
{
  "action": "screen_pop",
  "user_id": 9876543210,
  "ticket_id": null,
  "show_fields": [
    "name",
    "email",
    "phone",
    "organization",
    "custom_fields",
    "recent_tickets"
  ]
}
```

---

## 5. Authentication and Security

### 5.1 OAuth 2.0 Implementation

**Token Storage:**
```python
import redis
import time

class TokenManager:
    def __init__(self):
        self.redis_client = redis.Redis(
            host='localhost',
            port=6379,
            db=0,
            decode_responses=True
        )
    
    def store_token(self, service, token_data):
        """Store OAuth token with expiry"""
        key = f"oauth:token:{service}"
        self.redis_client.setex(
            key,
            token_data['expires_in'] - 300,  # Refresh 5 min early
            token_data['access_token']
        )
    
    def get_token(self, service):
        """Retrieve valid token or refresh if expired"""
        key = f"oauth:token:{service}"
        token = self.redis_client.get(key)
        
        if not token:
# Token expired, refresh it
            token = self.refresh_token(service)
        
        return token
    
    def refresh_token(self, service):
        """Refresh OAuth token"""
# Implementation specific to each service
        pass
```

### 5.2 API Key Rotation

**Automated Key Rotation Script:**
```python
import os
import requests
from datetime import datetime, timedelta

class APIKeyRotation:
    def __init__(self):
        self.rotation_interval = 90  # days
    
    def rotate_zendesk_api_key(self):
        """Rotate Zendesk API key every 90 days"""
        url = f"https://{os.getenv('ZENDESK_SUBDOMAIN')}.zendesk.com/api/v2/api_tokens"
        
# Create new API token
        new_token = requests.post(
            url,
            auth=(f"{os.getenv('ZENDESK_EMAIL')}/token", os.getenv('ZENDESK_CURRENT_TOKEN')),
            json={
                "api_token": {
                    "description": f"API Token - Created {datetime.now().strftime('%Y-%m-%d')}"
                }
            }
        )
        
        if new_token.status_code == 201:
            new_token_value = new_token.json()['api_token']['token']
            
# Store new token in secrets manager
            self.update_secrets_manager('zendesk_api_token', new_token_value)
            
# Schedule old token deletion after grace period (7 days)
            self.schedule_old_token_deletion(os.getenv('ZENDESK_CURRENT_TOKEN'), days=7)
            
            return new_token_value
        else:
            raise Exception(f"Failed to rotate API key: {new_token.text}")
```

### 5.3 IP Whitelisting

**Webex Contact Center IP Ranges:**
```
# US-1 Region
52.70.0.0/16
52.71.0.0/16
52.72.0.0/16

# Configure in firewall
iptables -A INPUT -p tcp --dport 443 -s 52.70.0.0/16 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -s 52.71.0.0/16 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -s 52.72.0.0/16 -j ACCEPT
```

**GCP Dialogflow IP Ranges:**
```
# US Central Region
35.184.0.0/13
35.192.0.0/14
```

---

## 6. Webhook Configurations

### 6.1 Webhook Server Implementation

**Express.js Webhook Receiver:**
```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// Webex CC Webhook Handler
app.post('/webhooks/webex-cc', (req, res) => {
    // Verify signature
    const signature = req.headers['x-webex-signature'];
    const secret = process.env.WEBEX_WEBHOOK_SECRET;
    
    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(req.body))
        .digest('hex');
    
    if (signature !== expectedSignature) {
        return res.status(401).send('Invalid signature');
    }
    
    // Process webhook event
    const event = req.body;
    
    switch(event.event) {
        case 'created':
            handleCallCreated(event.data);
            break;
        case 'updated':
            handleCallUpdated(event.data);
            break;
        case 'ended':
            handleCallEnded(event.data);
            break;
    }
    
    res.status(200).send('OK');
});

// Dialogflow CX Webhook Handler
app.post('/webhooks/dialogflow-cx', async (req, res) => {
    const tag = req.body.fulfillmentInfo.tag;
    
    try {
        let fulfillmentResponse;
        
        switch(tag) {
            case 'check-order':
                fulfillmentResponse = await checkOrderStatus(req.body);
                break;
            case 'transfer-agent':
                fulfillmentResponse = await transferToAgent(req.body);
                break;
            default:
                fulfillmentResponse = getDefaultResponse();
        }
        
        res.json(fulfillmentResponse);
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({
            fulfillmentResponse: {
                messages: [{
                    text: {
                        text: ['Sorry, something went wrong. Let me transfer you to an agent.']
                    }
                }]
            }
        });
    }
});

// Zendesk Webhook Handler
app.post('/webhooks/zendesk', (req, res) => {
    const event = req.body;
    
    if (event.type === 'ticket.created') {
        // Send notification to relevant team
        notifyTeam(event.ticket);
    } else if (event.type === 'ticket.updated') {
        // Check if customer replied
        if (event.ticket.status === 'open' && event.via.channel === 'email') {
            // Trigger callback workflow
            initiateCallbackWorkflow(event.ticket);
        }
    }
    
    res.status(200).send('OK');
});

app.listen(3000, () => {
    console.log('Webhook server running on port 3000');
});
```

### 6.2 Webhook Retry Logic

**Exponential Backoff:**
```python
import time
import requests
from requests.adapters import HTTPAdapter
from requests.packages.urllib3.util.retry import Retry

def create_retry_session(
    retries=3,
    backoff_factor=0.3,
    status_forcelist=(500, 502, 504)
):
    """Create requests session with retry logic"""
    session = requests.Session()
    retry = Retry(
        total=retries,
        read=retries,
        connect=retries,
        backoff_factor=backoff_factor,
        status_forcelist=status_forcelist,
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)
    session.mount('https://', adapter)
    return session

def send_webhook_with_retry(url, payload):
    """Send webhook with exponential backoff"""
    session = create_retry_session()
    
    try:
        response = session.post(
            url,
            json=payload,
            timeout=5
        )
        response.raise_for_status()
        return True
    except requests.exceptions.RequestException as e:
        print(f"Webhook failed after retries: {e}")
# Log to dead letter queue
        log_to_dlq(url, payload, str(e))
        return False
```

---

## 7. Error Handling and Retry Logic

### 7.1 Common Error Codes

| Service | Error Code | Meaning | Retry? | Action |
|---------|-----------|---------|--------|--------|
| Webex CC | 401 | Unauthorized | No | Refresh OAuth token |
| Webex CC | 429 | Rate limit exceeded | Yes | Exponential backoff |
| Webex CC | 500 | Server error | Yes | Retry with backoff |
| Dialogflow | 429 | Quota exceeded | Yes | Use quota management |
| Dialogflow | 503 | Service unavailable | Yes | Retry after delay |
| Zendesk | 422 | Validation error | No | Fix request payload |
| Zendesk | 429 | Rate limited | Yes | Respect Retry-After header |

### 7.2 Error Handling Implementation

**Comprehensive Error Handler:**
```python
import logging
from enum import Enum
from typing import Optional
import time

class ErrorSeverity(Enum):
    LOW = 1
    MEDIUM = 2
    HIGH = 3
    CRITICAL = 4

class APIErrorHandler:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        self.max_retries = 3
        self.base_delay = 1  # seconds
    
    def handle_error(self, error, service, operation):
        """Central error handling logic"""
        error_code = getattr(error, 'status_code', None)
        
        if error_code == 401:
# Authentication error
            self.logger.error(f"Authentication failed for {service}")
            self.refresh_token(service)
            return True  # Retry
        
        elif error_code == 429:
# Rate limiting
            retry_after = self.get_retry_after(error)
            self.logger.warning(f"Rate limited by {service}. Waiting {retry_after}s")
            time.sleep(retry_after)
            return True  # Retry
        
        elif error_code in [500, 502, 503, 504]:
# Server errors
            self.logger.error(f"Server error from {service}: {error_code}")
            return True  # Retry with backoff
        
        elif error_code == 422:
# Validation error - don't retry
            self.logger.error(f"Validation error for {service}: {error}")
            self.alert_team(ErrorSeverity.HIGH, f"API validation error: {error}")
            return False
        
        else:
# Unknown error
            self.logger.error(f"Unknown error from {service}: {error}")
            self.alert_team(ErrorSeverity.CRITICAL, f"Unknown API error: {error}")
            return False
    
    def exponential_backoff(self, attempt):
        """Calculate exponential backoff delay"""
        delay = self.base_delay * (2 ** attempt)
        return min(delay, 60)  # Max 60 seconds
    
    def get_retry_after(self, error):
        """Extract Retry-After header"""
        retry_after = error.response.headers.get('Retry-After')
        if retry_after:
            try:
                return int(retry_after)
            except ValueError:
# Retry-After is a date
                return 60
        return 60  # Default to 60 seconds
```

### 7.3 Circuit Breaker Pattern

**Circuit Breaker Implementation:**
```python
from enum import Enum
import time

class CircuitState(Enum):
    CLOSED = "closed"
    OPEN = "open"
    HALF_OPEN = "half_open"

class CircuitBreaker:
    def __init__(self, failure_threshold=5, timeout=60):
        self.failure_threshold = failure_threshold
        self.timeout = timeout
        self.failure_count = 0
        self.last_failure_time = None
        self.state = CircuitState.CLOSED
    
    def call(self, func, *args, **kwargs):
        """Execute function with circuit breaker protection"""
        if self.state == CircuitState.OPEN:
            if time.time() - self.last_failure_time > self.timeout:
# Try to recover
                self.state = CircuitState.HALF_OPEN
            else:
                raise Exception("Circuit breaker is OPEN")
        
        try:
            result = func(*args, **kwargs)
            self.on_success()
            return result
        except Exception as e:
            self.on_failure()
            raise e
    
    def on_success(self):
        """Reset circuit breaker on successful call"""
        self.failure_count = 0
        self.state = CircuitState.CLOSED
    
    def on_failure(self):
        """Increment failure count and open circuit if threshold reached"""
        self.failure_count += 1
        self.last_failure_time = time.time()
        
        if self.failure_count >= self.failure_threshold:
            self.state = CircuitState.OPEN
            print(f"Circuit breaker opened after {self.failure_count} failures")

# Usage
webex_breaker = CircuitBreaker(failure_threshold=5, timeout=60)

def get_queue_stats():
    return webex_breaker.call(webex_api.get_queue_stats, queue_id="queue-001")
```

---

## 8. Rate Limiting and Quotas

### 8.1 API Rate Limits

| Service | Endpoint | Rate Limit | Window | Quota |
|---------|----------|------------|--------|-------|
| **Webex CC** | /agents/* | 10 req/sec | Per org | 864,000/day |
| **Webex CC** | /queues/* | 5 req/sec | Per org | 432,000/day |
| **Webex CC** | /tasks/* | 20 req/sec | Per org | 1,728,000/day |
| **Dialogflow CX** | detectIntent | 1000 req/min | Per project | Unlimited |
| **Dialogflow CX** | Webhook timeout | - | 5 sec max | - |
| **Zendesk** | All endpoints | 400 req/min | Per account | Unlimited |
| **Zendesk** | Search API | 60 req/min | Per account | Unlimited |

### 8.2 Rate Limit Handler

**Token Bucket Algorithm:**
```python
import time
import threading

class TokenBucket:
    def __init__(self, rate, capacity):
        """
        rate: tokens per second
        capacity: maximum tokens in bucket
        """
        self.rate = rate
        self.capacity = capacity
        self.tokens = capacity
        self.last_refill = time.time()
        self.lock = threading.Lock()
    
    def consume(self, tokens=1):
        """Attempt to consume tokens from bucket"""
        with self.lock:
            self._refill()
            
            if self.tokens >= tokens:
                self.tokens -= tokens
                return True
            else:
# Calculate wait time
                wait_time = (tokens - self.tokens) / self.rate
                return wait_time
    
    def _refill(self):
        """Refill tokens based on elapsed time"""
        now = time.time()
        elapsed = now - self.last_refill
        
# Add tokens based on elapsed time
        new_tokens = elapsed * self.rate
        self.tokens = min(self.capacity, self.tokens + new_tokens)
        self.last_refill = now

# Initialize rate limiters for each service
webex_limiter = TokenBucket(rate=10, capacity=10)  # 10 req/sec
zendesk_limiter = TokenBucket(rate=6.67, capacity=20)  # 400/min = 6.67/sec

def rate_limited_api_call(service, func, *args, **kwargs):
    """Make API call with rate limiting"""
    limiter = {
        'webex': webex_limiter,
        'zendesk': zendesk_limiter
    }.get(service)
    
    result = limiter.consume()
    
    if result is True:
# Token available, proceed
        return func(*args, **kwargs)
    else:
# Need to wait
        print(f"Rate limited. Waiting {result:.2f} seconds...")
        time.sleep(result)
        return rate_limited_api_call(service, func, *args, **kwargs)
```

### 8.3 Quota Management

**Daily Quota Tracker:**
```python
import redis
from datetime import datetime, timedelta

class QuotaManager:
    def __init__(self):
        self.redis_client = redis.Redis(host='localhost', port=6379, db=0)
    
    def check_quota(self, service, endpoint):
        """Check if API quota available"""
        key = f"quota:{service}:{endpoint}:{datetime.now().strftime('%Y-%m-%d')}"
        current_count = self.redis_client.get(key)
        
        quotas = {
            'webex:agents': 864000,
            'webex:queues': 432000,
            'dialogflow:detectIntent': float('inf'),  # Unlimited
            'zendesk:search': 86400  # 60 req/min * 60 min * 24 hours
        }
        
        quota_key = f"{service}:{endpoint}"
        max_quota = quotas.get(quota_key, float('inf'))
        
        if current_count is None:
            current_count = 0
        else:
            current_count = int(current_count)
        
        if current_count >= max_quota:
# Quota exceeded
            ttl = self.redis_client.ttl(key)
            raise Exception(f"Quota exceeded. Resets in {ttl} seconds.")
        
        return True
    
    def increment_quota(self, service, endpoint):
        """Increment API call count"""
        key = f"quota:{service}:{endpoint}:{datetime.now().strftime('%Y-%m-%d')}"
        pipe = self.redis_client.pipeline()
        pipe.incr(key)
        pipe.expire(key, 86400)  # Expire after 24 hours
        pipe.execute()
```

---

## 9. API Testing and Validation

### 9.1 Postman Collection

**Sample Postman Environment:**
```json
{
  "name": "KidsWear Production",
  "values": [
    {
      "key": "webex_base_url",
      "value": "https://api.wxcc-us1.cisco.com/v1",
      "enabled": true
    },
    {
      "key": "webex_org_id",
      "value": "12345",
      "enabled": true
    },
    {
      "key": "webex_access_token",
      "value": "{{$randomUUID}}",
      "enabled": true
    },
    {
      "key": "dialogflow_project_id",
      "value": "kidswear-ai",
      "enabled": true
    },
    {
      "key": "dialogflow_location",
      "value": "us-central1",
      "enabled": true
    },
    {
      "key": "zendesk_subdomain",
      "value": "kidswear-support",
      "enabled": true
    },
    {
      "key": "zendesk_api_token",
      "value": "{{$randomUUID}}",
      "enabled": true
    }
  ]
}
```

**Health Check Collection:**
```json
{
  "info": {
    "name": "API Health Checks",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Webex CC Health",
      "request": {
        "method": "GET",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{webex_access_token}}"
          }
        ],
        "url": {
          "raw": "{{webex_base_url}}/organization/{{webex_org_id}}/health",
          "host": ["{{webex_base_url}}"],
          "path": ["organization", "{{webex_org_id}}", "health"]
        }
      }
    },
    {
      "name": "Dialogflow CX Health",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Authorization",
            "value": "Bearer {{dialogflow_token}}"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"queryInput\": {\n    \"text\": {\n      \"text\": \"hello\"\n    },\n    \"languageCode\": \"en\"\n  }\n}"
        },
        "url": {
          "raw": "https://{{dialogflow_location}}-dialogflow.googleapis.com/v3/projects/{{dialogflow_project_id}}/locations/{{dialogflow_location}}/agents/{{agent_id}}/sessions/test-session:detectIntent",
          "protocol": "https",
          "host": ["{{dialogflow_location}}-dialogflow", "googleapis", "com"]
        }
      }
    }
  ]
}
```

### 9.2 Integration Testing

**Python Integration Test Suite:**
```python
import unittest
import requests
import os

class APIIntegrationTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Initialize test environment"""
        cls.webex_token = os.getenv('WEBEX_ACCESS_TOKEN')
        cls.zendesk_token = os.getenv('ZENDESK_API_TOKEN')
        cls.test_phone = "+919999999999"
    
    def test_webex_queue_stats(self):
        """Test Webex CC queue statistics API"""
        response = requests.get(
            f"{os.getenv('WEBEX_BASE_URL')}/queues/queue-001/statistics",
            headers={'Authorization': f'Bearer {self.webex_token}'}
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('callsInQueue', data['data']['metrics'])
    
    def test_zendesk_user_lookup(self):
        """Test Zendesk user search"""
        response = requests.get(
            f"{os.getenv('ZENDESK_BASE_URL')}/search.json",
            params={'query': f'type:user phone:{self.test_phone}'},
            auth=(f"{os.getenv('ZENDESK_EMAIL')}/token", self.zendesk_token)
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data['results'], list)
    
    def test_dialogflow_intent_detection(self):
        """Test Dialogflow CX intent detection"""
        response = requests.post(
            f"https://us-dialogflow.googleapis.com/v3/projects/{os.getenv('DIALOGFLOW_PROJECT')}/locations/us-central1/agents/{os.getenv('DIALOGFLOW_AGENT')}/sessions/test-123:detectIntent",
            headers={'Authorization': f'Bearer {os.getenv('DIALOGFLOW_TOKEN')}'},
            json={
                "queryInput": {
                    "text": {
                        "text": "I want to check my order"
                    },
                    "languageCode": "en"
                }
            }
        )
        
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn('queryResult', data)
        self.assertGreater(data['queryResult']['intentDetectionConfidence'], 0.5)
    
    def test_end_to_end_flow(self):
        """Test complete customer journey"""
# 1. Lookup customer in Zendesk
        customer_response = requests.get(
            f"{os.getenv('ZENDESK_BASE_URL')}/search.json",
            params={'query': f'type:user phone:{self.test_phone}'},
            auth=(f"{os.getenv('ZENDESK_EMAIL')}/token", self.zendesk_token)
        )
        self.assertEqual(customer_response.status_code, 200)
        
        customer_id = customer_response.json()['results'][0]['id']
        
# 2. Detect intent in Dialogflow
        intent_response = requests.post(
            f"https://us-dialogflow.googleapis.com/v3/projects/{os.getenv('DIALOGFLOW_PROJECT')}/locations/us-central1/agents/{os.getenv('DIALOGFLOW_AGENT')}/sessions/test-456:detectIntent",
            headers={'Authorization': f'Bearer {os.getenv('DIALOGFLOW_TOKEN')}'},
            json={
                "queryInput": {
                    "text": {
                        "text": "I need help with my order"
                    },
                    "languageCode": "en"
                }
            }
        )
        self.assertEqual(intent_response.status_code, 200)
        
# 3. Create ticket in Zendesk
        ticket_response = requests.post(
            f"{os.getenv('ZENDESK_BASE_URL')}/tickets.json",
            auth=(f"{os.getenv('ZENDESK_EMAIL')}/token", self.zendesk_token),
            json={
                "ticket": {
                    "subject": "Test order inquiry",
                    "comment": {"body": "Automated test ticket"},
                    "requester_id": customer_id,
                    "tags": ["api_test"]
                }
            }
        )
        self.assertEqual(ticket_response.status_code, 201)
        
# Cleanup: Delete test ticket
        ticket_id = ticket_response.json()['ticket']['id']
        requests.delete(
            f"{os.getenv('ZENDESK_BASE_URL')}/tickets/{ticket_id}.json",
            auth=(f"{os.getenv('ZENDESK_EMAIL')}/token", self.zendesk_token)
        )

if __name__ == '__main__':
    unittest.main()
```

---

## 10. Production Deployment Checklist

### 10.1 Pre-Deployment Validation

- [ ] **Authentication**
  - [ ] OAuth tokens configured and tested
  - [ ] Token refresh logic implemented
  - [ ] API keys rotated to production values
  - [ ] Service account permissions validated

- [ ] **Security**
  - [ ] HTTPS enforced for all endpoints
  - [ ] IP whitelisting configured
  - [ ] Webhook signature verification enabled
  - [ ] Secrets stored in vault (not code)
  - [ ] API rate limiting configured

- [ ] **Error Handling**
  - [ ] Retry logic implemented
  - [ ] Circuit breakers configured
  - [ ] Dead letter queues set up
  - [ ] Alerting configured for critical errors

- [ ] **Monitoring**
  - [ ] API call logging enabled
  - [ ] Performance metrics tracked
  - [ ] Dashboard created for API health
  - [ ] Quota tracking configured

### 10.2 Go-Live Checklist

**Week -2:**
- [ ] Complete UAT testing
- [ ] Load testing completed (simulate peak traffic)
- [ ] Security audit passed
- [ ] Documentation finalized

**Week -1:**
- [ ] Production credentials rotated
- [ ] Monitoring dashboards validated
- [ ] Escalation procedures tested
- [ ] Rollback plan documented

**Go-Live Day:**
- [ ] Pre-deployment health checks passed
- [ ] All integrations enabled in production
- [ ] Real-time monitoring active
- [ ] Support team on standby

**Week +1:**
- [ ] Performance metrics within SLAs
- [ ] No critical errors reported
- [ ] Token refresh working correctly
- [ ] Quota consumption tracked

### 10.3 Production Support

**24x7 Support Matrix:**

| Severity | Response Time | Escalation Path |
|----------|---------------|-----------------|
| **Critical** (System down) | 15 minutes | L1 → L2 → Platform Team → Vendor TAC |
| **High** (Major function impaired) | 1 hour | L1 → L2 → Integration Team |
| **Medium** (Minor function impaired) | 4 hours | L1 → L2 |
| **Low** (General inquiry) | Next business day | L1 |

**On-Call Rotation:**
- Week 1-2: Primary Engineer A + Backup Engineer B
- Week 3-4: Primary Engineer C + Backup Engineer D

---

## Document Change Log

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | Nov 21, 2025 | Raj | Initial creation - Complete API reference |

---

## Additional Resources

**Official Documentation**

- [Webex Contact Center API](https://developer.webex-cx.com/documentation/getting-started) - Webex CC Developer Portal
- [Dialogflow CX API](https://cloud.google.com/dialogflow/cx/docs/reference/rest) - Google Cloud Dialogflow CX REST reference
- [Zendesk API](https://developer.zendesk.com/api-reference/) - Zendesk REST API reference

**Support Contacts**

- [Cisco TAC](https://www.cisco.com/c/en/us/support/web/tsd-cisco-worldwide-contacts.html) - Cisco Technical Assistance Center
- [Google Cloud Support](https://cloud.google.com/support) - Google Cloud support portal
- [Zendesk Support](https://support.zendesk.com/) - Zendesk customer support

---

**END OF APPENDIX A**

