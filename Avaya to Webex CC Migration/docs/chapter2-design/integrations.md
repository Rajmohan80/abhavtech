# Integrations Architecture

## Overview

This document outlines the integration strategy for connecting Webex Contact Center with CRM systems, workforce management tools, business applications, and third-party platforms to create a unified customer experience ecosystem.

---

## 1. Integration Architecture Overview

### 1.1 Integration Layers

```
┌───────────────────────────────────────────────────────┐
│         BUSINESS APPLICATIONS LAYER                   │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐ │
│  │   CRM   │  │   WFM   │  │Ticketing│  │Analytics│ │
│  │Salesforce│ │  Nice   │  │ServiceNow│ │Tableau  │ │
│  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘ │
└───────┼───────────┼─────────────┼────────────┼───────┘
        │           │             │            │
┌───────┼───────────┼─────────────┼────────────┼───────┐
│       │    INTEGRATION MIDDLEWARE LAYER       │       │
│  ┌────▼──────────────────────────────────────▼────┐  │
│  │        API Gateway & Orchestration             │  │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────┐  │  │
│  │  │   REST   │  │ Webhooks │  │  OAuth 2.0 │  │  │
│  │  │   APIs   │  │  Events  │  │    Auth    │  │  │
│  │  └──────────┘  └──────────┘  └────────────┘  │  │
│  └────────────────────────────────────────────────┘  │
└───────────────────────┬───────────────────────────────┘
                        │
┌───────────────────────▼───────────────────────────────┐
│       WEBEX CONTACT CENTER PLATFORM                   │
│  ┌───────────────────────────────────────────────┐   │
│  │  Contact Center Core | Agent Desktop | Analytics│  │
│  └───────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────┘
```

### 1.2 Integration Patterns

**1. API-Based Integration (Synchronous)**
```
Agent Desktop ──HTTP Request──► API Gateway ──► Business System
              ◄──Response─────
              (< 2 seconds)
```

**2. Webhook-Based Integration (Asynchronous)**
```
Contact Center Event ──► Webhook ──► Middleware ──► Business System
(Call ends, wrap-up)              (Process)        (Update records)
```

**3. File-Based Integration (Batch)**
```
Contact Center ──► SFTP/S3 ──► ETL Process ──► Data Warehouse
(Nightly reports)           (Transform)       (Analytics)
```

---

## 2. CRM Integration

### 2.1 Salesforce Integration

**Architecture:**

```
┌──────────────────────────────────────────────────────┐
│            SALESFORCE ENVIRONMENT                    │
│  ┌────────────────────────────────────────────────┐ │
│  │  Lightning Console App                         │ │
│  │  ├─ Accounts, Contacts, Cases                  │ │
│  │  └─ Embedded Webex Widget                      │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────┬────────────────────────────────┘
                      │
                      │ Salesforce API (REST/SOAP)
                      │ OAuth 2.0 Authentication
                      │
┌─────────────────────▼────────────────────────────────┐
│        WEBEX CONTACT CENTER PLATFORM                 │
│  ┌────────────────────────────────────────────────┐ │
│  │  Salesforce Connector (Pre-built)              │ │
│  │  ├─ Screen Pop (ANI/Account lookup)            │ │
│  │  ├─ Click-to-Dial                              │ │
│  │  ├─ Activity Logging                           │ │
│  │  └─ Case Creation                              │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

**Key Features:**

**Screen Pop Workflow:**
```
1. Call arrives at agent
   ↓
2. Extract ANI (caller phone number)
   ↓
3. Query Salesforce: Search Phone field in Contact/Lead/Account
   ↓
4. Match found?
   ├─ Yes → Open Contact/Account record in Salesforce
   │        Display: Name, Account, Recent Cases
   └─ No  → Open "New Contact" form with pre-populated ANI
```

**Click-to-Dial:**
```
Agent clicks phone number in Salesforce
   ↓
Salesforce triggers API call to Webex
   ↓
Webex initiates outbound call to agent
   ↓
Agent answers, call connects to customer
   ↓
Call details automatically logged to Salesforce Activity
```

**Activity Logging (Automatic):**
```yaml
Call Activity Record:
  Type: "Call"
  Subject: "Inbound Call - Customer Support"
  Status: "Completed"
  Duration: "00:05:32"
  Description: "Customer inquiry about billing"
  Related To: Account (ABC Corp)
  Call Direction: "Inbound"
  Wrap-up Code: "Billing - Payment Issue"
  Recorded: Link to call recording
  Timestamp: 2024-10-15 14:32:00
```

**Configuration Steps:**

1. **Salesforce Connected App Setup:**
```
Create Connected App in Salesforce:
├─ API Name: "WebexContactCenter"
├─ OAuth Scopes: full, api, refresh_token
├─ Callback URL: https://portal.wxcc.webex.com/callback
└─ Consumer Key & Secret: Save for Webex configuration
```

2. **Webex Control Hub Configuration:**
```
Navigate to: Control Hub → Contact Center → Integrations
├─ Add Integration: Salesforce
├─ Enter Consumer Key & Secret
├─ Authorize: OAuth flow with Salesforce admin credentials
├─ Field Mapping:
│   ├─ ANI → Contact.Phone
│   ├─ Email → Contact.Email
│   └─ Account Number → Account.AccountNumber
└─ Enable Features:
    ├─ Screen Pop ✅
    ├─ Click-to-Dial ✅
    ├─ Activity Logging ✅
    └─ Case Creation ✅
```

**Data Flow Diagram:**

```
Inbound Call Flow:
┌────────┐
│ Call   │
│Arrives │
└───┬────┘
    │
    ▼
┌────────────┐     API Query      ┌────────────┐
│   Webex    ├───────────────────►│ Salesforce │
│  Platform  │◄───────────────────┤    API     │
└────────────┘   Customer Data    └────────────┘
    │
    │ Screen Pop Data
    ▼
┌────────────┐
│   Agent    │
│  Desktop   │
│ (SF Widget)│
└────────────┘
```

### 2.2 Microsoft Dynamics 365 Integration

**Architecture:**

```
┌──────────────────────────────────────────────────────┐
│         MICROSOFT DYNAMICS 365                       │
│  ┌────────────────────────────────────────────────┐ │
│  │  Unified Interface                             │ │
│  │  ├─ Accounts, Contacts, Cases                  │ │
│  │  └─ Embedded Softphone Panel                   │ │
│  └────────────────────────────────────────────────┘ │
└─────────────────────┬────────────────────────────────┘
                      │
                      │ Microsoft Graph API / Dataverse API
                      │ Azure AD Authentication
                      │
┌─────────────────────▼────────────────────────────────┐
│        WEBEX CONTACT CENTER + MIDDLEWARE             │
│  ┌────────────────────────────────────────────────┐ │
│  │  Custom Integration (via Azure Logic Apps)    │ │
│  │  ├─ Contact lookup and screen pop              │ │
│  │  ├─ Activity sync (calls, chats)               │ │
│  │  └─ Case auto-creation                         │ │
│  └────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────┘
```

**Integration Features:**

| Feature | Implementation Method |
|---------|----------------------|
| Screen Pop | Webex API + Dynamics Dataverse API |
| Click-to-Dial | Custom ribbon button + Webex dial API |
| Activity Logging | Webhook → Azure Logic App → Dynamics |
| Presence Sync | Real-time agent status sync |

**Sample Azure Logic App Flow:**

```
Trigger: HTTP Webhook from Webex (Call ended)
   ↓
Parse JSON: Extract call details
   ↓
Condition: Is contact found in Dynamics?
   ├─ Yes → Update existing contact activity
   └─ No  → Create new contact + activity
        ↓
Response: Success/Failure to Webex
```

### 2.3 ServiceNow Integration

**Use Case: Automated Ticket Creation**

```
Customer calls support
   ↓
Agent identifies issue requires ticket
   ↓
Agent clicks "Create Incident" in desktop
   ↓
Webex sends data to ServiceNow API:
├─ Caller: John Doe (john.doe@email.com)
├─ Phone: +1-XX5-0100
├─ Issue: "Application login failure"
├─ Priority: Medium
├─ Assignment Group: Application Support
└─ Notes: Call transcript summary
   ↓
ServiceNow creates Incident: INC0010123
   ↓
Incident number returned to agent desktop
   ↓
Agent provides incident number to customer
```

**API Integration Code Example:**

```javascript
// Webex desktop script to create ServiceNow incident
async function createServiceNowIncident(contactData) {
  const endpoint = 'https://instance.service-now.com/api/now/table/incident';
  const auth = 'Basic ' + btoa('username:password');
  
  const incidentData = {
    caller_id: contactData.customerId,
    short_description: contactData.issue,
    description: contactData.notes,
    urgency: contactData.priority,
    category: 'inquiry',
    contact_type: 'phone'
  };
  
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth
    },
    body: JSON.stringify(incidentData)
  });
  
  const result = await response.json();
  return result.result.number; // Returns: INC0010123
}
```

---

## 3. Workforce Management Integration

### 3.1 Nice IEX Integration

**Data Exchange:**

```
Webex Contact Center ──► Nice IEX
├─ Historical Data:
│   ├─ Call volume (15-min intervals)
│   ├─ Average handle time
│   ├─ Service level achievement
│   └─ Abandonment rate
│
└─ Real-time Data:
    ├─ Current calls in queue
    ├─ Agents logged in
    ├─ Agent states
    └─ Occupancy percentage

Nice IEX ──► Webex Contact Center
├─ Agent Schedules:
│   ├─ Start/end times
│   ├─ Break schedules
│   ├─ Meeting times
│   └─ Skills availability
│
└─ Adherence Monitoring:
    ├─ Schedule compliance
    └─ Break compliance alerts
```

**Integration Architecture:**

```
┌──────────────────┐
│  Nice IEX WFM    │
│                  │
│  ┌────────────┐  │      API Calls (REST)
│  │ Forecasting│◄─┼───────────────────────┐
│  │ Scheduling │  │                       │
│  └────────────┘  │                       │
└──────────────────┘                       │
         ▲                                 │
         │ Agent Schedules                 │
         │                                 │
┌────────┴─────────────────────────────────▼────┐
│       Webex Contact Center Platform           │
│  ┌──────────────────────────────────────────┐ │
│  │  Historical Reports → API Export          │ │
│  │  Real-time Metrics → Webhook Push         │ │
│  │  Agent States → Schedule Enforcement      │ │
│  └──────────────────────────────────────────┘ │
└───────────────────────────────────────────────┘
```

**Schedule Import Process:**

```
Daily (2:00 AM):
1. Nice IEX generates agent schedules for next 7 days
2. Export schedule data via API
   Format: Agent ID, Date, Start, End, Skills
3. Webex imports and validates schedules
4. Agents see schedule in desktop app
5. Adherence monitoring activated
```

### 3.2 Calabrio WFO Integration

**Components:**

| Calabrio Module | Integration Point | Data Flow |
|----------------|-------------------|-----------|
| Workforce Management | Schedule import/export | Bi-directional |
| Quality Management | Recording metadata | Webex → Calabrio |
| Analytics | Call data | Webex → Calabrio |
| Performance Management | KPIs and scorecards | Calabrio → Dashboards |

**Recording Integration:**

```
Call Recording Flow:
┌──────────────┐
│ Call Active  │
│ (Recording)  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│   Webex CC   │
│  Recording   │
│   Storage    │
└──────┬───────┘
       │
       │ Metadata + Recording Link
       ▼
┌──────────────┐
│  Calabrio    │
│  Quality Mgmt│
│  ├─ Metadata │
│  ├─ Link to  │
│  │   Audio   │
│  └─ Scoring  │
└──────────────┘
```

---

## 4. Analytics and BI Integration

### 4.1 Tableau Integration

**Data Pipeline:**

```
┌──────────────────┐
│ Webex Contact    │
│    Center        │
│  ┌────────────┐  │
│  │ Analyzer   │  │
│  │  Reports   │  │
│  └─────┬──────┘  │
└────────┼─────────┘
         │
         │ API Export / Data Connector
         ▼
┌──────────────────┐
│   Data Lake      │
│  (Cloud Storage) │
│  ┌────────────┐  │
│  │  Staging   │  │
│  │    Area    │  │
│  └─────┬──────┘  │
└────────┼─────────┘
         │
         │ ETL Process
         ▼
┌──────────────────┐
│   Tableau        │
│   Server         │
│  ┌────────────┐  │
│  │ Dashboards │  │
│  │  Reports   │  │
│  └────────────┘  │
└──────────────────┘
```

**Pre-built Dashboards:**

1. **Executive Dashboard:**
   - Total contacts by channel
   - Service level trends
   - CSAT scores
   - Agent productivity

2. **Operations Dashboard:**
   - Real-time queue status
   - Agent utilization
   - Abandonment rates
   - Average wait times

3. **Quality Dashboard:**
   - Call quality scores
   - First call resolution
   - Escalation rates
   - Compliance metrics

**Tableau Web Data Connector Example:**

```javascript
(function() {
  var myConnector = tableau.makeConnector();
  
  myConnector.getSchema = function(schemaCallback) {
    var cols = [
      { id: "date", alias: "Date", dataType: tableau.dataTypeEnum.date },
      { id: "calls_offered", alias: "Calls Offered", dataType: tableau.dataTypeEnum.int },
      { id: "calls_handled", alias: "Calls Handled", dataType: tableau.dataTypeEnum.int },
      { id: "avg_handle_time", alias: "Avg Handle Time", dataType: tableau.dataTypeEnum.int }
    ];
    
    var tableSchema = {
      id: "webexCCStats",
      alias: "Webex Contact Center Statistics",
      columns: cols
    };
    
    schemaCallback([tableSchema]);
  };
  
  myConnector.getData = function(table, doneCallback) {
    // Fetch data from Webex API
    fetch('https://api.wxcc.webex.com/v1/reports/daily-stats', {
      headers: { 'Authorization': 'Bearer ' + tableau.password }
    })
    .then(response => response.json())
    .then(data => {
      table.appendRows(data.results);
      doneCallback();
    });
  };
  
  tableau.registerConnector(myConnector);
})();
```

### 4.2 Power BI Integration

**DirectQuery Configuration:**

```
Power BI Desktop
   ├─ Get Data → Web
   ├─ Enter Webex API endpoint
   ├─ Authentication: OAuth 2.0
   ├─ Transform Data (Power Query):
   │   ├─ Filter columns
   │   ├─ Change data types
   │   └─ Create calculated columns
   └─ Publish to Power BI Service
```

**Sample M Query (Power Query):**

```powerquery
let
    Source = Web.Contents("https://api.wxcc.webex.com/v1/reports/queue-stats",
        [Headers=[Authorization="Bearer " & AccessToken]]),
    JsonData = Json.Document(Source),
    ConvertedToTable = Table.FromRecords(JsonData[data]),
    ChangedType = Table.TransformColumnTypes(ConvertedToTable,{
        {"timestamp", type datetime},
        {"calls_offered", Int64.Type},
        {"calls_handled", Int64.Type},
        {"service_level", Percentage.Type}
    })
in
    ChangedType
```

---

## 5. Custom API Integrations

### 5.1 REST API Authentication

**OAuth 2.0 Flow:**

```
1. Register Application:
   ├─ Navigate to: developer.webex.com
   ├─ Create Integration
   ├─ Obtain: Client ID & Client Secret
   └─ Set Redirect URI

2. Authorization Request:
   GET https://webexapis.com/v1/authorize
   ?client_id={YOUR_CLIENT_ID}
   &response_type=code
   &redirect_uri={YOUR_REDIRECT_URI}
   &scope=analytics:read_all contact-center:admin_read

3. Exchange Code for Token:
   POST https://webexapis.com/v1/access_token
   {
     "grant_type": "authorization_code",
     "client_id": "{YOUR_CLIENT_ID}",
     "client_secret": "{YOUR_CLIENT_SECRET}",
     "code": "{AUTHORIZATION_CODE}",
     "redirect_uri": "{YOUR_REDIRECT_URI}"
   }

4. Response (Access Token):
   {
     "access_token": "ZmFkNj...",
     "expires_in": 14400,
     "refresh_token": "MGEyN...",
     "token_type": "Bearer"
   }

5. API Requests:
   GET https://api.wxcc.webex.com/v1/reports/...
   Header: Authorization: Bearer {ACCESS_TOKEN}
```

### 5.2 Webhook Configuration

**Event Subscription:**

```json
{
  "name": "Call Ended Webhook",
  "targetUrl": "https://your-server.com/webhook/call-ended",
  "resource": "telephony_calls",
  "event": "ended",
  "filter": "queueId=5f8a2b3c4d5e6f7g8h9i0j1k",
  "secret": "your-webhook-secret-for-validation"
}
```

**Webhook Payload Example:**

```json
{
  "id": "webhook-event-123",
  "name": "Call Ended Webhook",
  "resource": "telephony_calls",
  "event": "ended",
  "data": {
    "id": "call-abc-123",
    "orgId": "org-xyz-789",
    "sessionId": "session-def-456",
    "callType": "inbound",
    "ani": "+15550100",
    "dnis": "+18005550200",
    "queueId": "queue-123",
    "agentId": "agent-456",
    "startTime": "2024-10-15T14:30:00Z",
    "endTime": "2024-10-15T14:35:32Z",
    "duration": 332,
    "wrapUpCode": "billing-payment-issue",
    "recordingUrl": "https://recordings.wxcc.webex.com/rec-789"
  },
  "created": "2024-10-15T14:35:33Z"
}
```

**Webhook Handler (Node.js Example):**

```javascript
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Webhook secret for validation
const WEBHOOK_SECRET = 'your-webhook-secret';

app.post('/webhook/call-ended', (req, res) => {
  // Validate webhook signature
  const signature = req.headers['x-webex-signature'];
  const payload = JSON.stringify(req.body);
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(payload).digest('hex');
  
  if (signature !== digest) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process webhook data
  const callData = req.body.data;
  
  // Example: Send to your CRM
  await updateCRM({
    contactPhone: callData.ani,
    callDuration: callData.duration,
    wrapUpCode: callData.wrapUpCode,
    recordingUrl: callData.recordingUrl
  });
  
  res.status(200).send('Webhook processed');
});

app.listen(3000);
```

---

## 6. Integration Security

### 6.1 Security Best Practices

**API Security:**

| Security Layer | Implementation |
|----------------|----------------|
| Authentication | OAuth 2.0 with refresh tokens |
| Authorization | Scope-based permissions (least privilege) |
| Encryption | TLS 1.2+ for all API calls |
| API Keys | Rotate every 90 days |
| IP Whitelisting | Restrict API access to known IPs |
| Rate Limiting | 100 requests/minute per token |
| Secrets Management | Azure Key Vault / AWS Secrets Manager |

**Webhook Security:**

```
Security Measures:
├─ HMAC signature validation (SHA-256)
├─ HTTPS-only endpoints (TLS 1.2+)
├─ IP whitelisting for Webex webhook sources
├─ Idempotency keys to prevent duplicate processing
└─ Webhook secret rotation every 90 days
```

### 6.2 Data Privacy and Compliance

**PII Handling:**

```
Data Classification:
├─ Public: Queue names, system IDs
├─ Internal: Agent names, call statistics
├─ Confidential: Customer phone numbers, recordings
└─ Highly Restricted: Payment card data (PCI-DSS)

Data Masking Rules:
├─ Phone Numbers: Display last 4 digits only in logs
├─ Email: Mask domain (j***@email.com)
├─ Credit Cards: Never store, only tokenized references
└─ Social Security: Never transmitted via API
```

**Compliance Requirements:**

| Regulation | Requirement | Implementation |
|------------|-------------|----------------|
| GDPR | Right to deletion | API endpoint to purge customer data |
| CCPA | Data access request | Export customer interaction history |
| PCI-DSS | Secure payment data | Recording pause during payment |
| HIPAA | PHI protection | Encryption + access controls |

---

## 7. Integration Monitoring

### 7.1 Health Check Endpoints

**API Health Monitoring:**

```javascript
// Monitor Salesforce integration health
async function checkSalesforceHealth() {
  try {
    const response = await fetch('https://api.salesforce.com/services/data/v57.0/', {
      headers: { 'Authorization': 'Bearer ' + sfToken }
    });
    
    if (response.ok) {
      return { status: 'healthy', latency: response.time };
    } else {
      return { status: 'degraded', error: response.statusText };
    }
  } catch (error) {
    return { status: 'down', error: error.message };
  }
}
```

**Monitoring Dashboard:**

```
┌─────────────────────────────────────────────────────┐
│         INTEGRATION HEALTH DASHBOARD                │
├─────────────────────────────────────────────────────┤
│  Integration    │ Status  │ Latency │ Last Error    │
│─────────────────┼─────────┼─────────┼───────────────│
│  Salesforce     │ ✅ Up   │  145ms  │ None          │
│  Nice IEX       │ ✅ Up   │   89ms  │ None          │
│  ServiceNow     │ ⚠️ Slow │  2.3s   │ Timeout (1hr) │
│  Tableau        │ ✅ Up   │  234ms  │ None          │
└─────────────────────────────────────────────────────┘
```

### 7.2 Error Handling and Retry Logic

**Retry Strategy:**

```python
import time
from retrying import retry

@retry(
    stop_max_attempt_number=3,
    wait_exponential_multiplier=1000,
    wait_exponential_max=10000
)
def call_external_api(url, data):
    """
    Retry logic with exponential backoff:
    - Attempt 1: Immediate
    - Attempt 2: Wait 1 second
    - Attempt 3: Wait 2 seconds
    - Give up after 3 attempts
    """
    response = requests.post(url, json=data, timeout=5)
    response.raise_for_status()
    return response.json()

# Usage
try:
    result = call_external_api(crm_endpoint, customer_data)
except Exception as e:
    log_error(f"API call failed after 3 retries: {e}")
    # Fallback: Queue for manual processing
    queue_for_retry(customer_data)
```

**Circuit Breaker Pattern:**

```
Normal State → API calls succeed
    ↓
Error Threshold Exceeded (5 failures in 1 minute)
    ↓
Open Circuit → Block all API calls for 30 seconds
    ↓
After 30 seconds → Half-Open State
    ↓
Test with 1 API call
    ├─ Success → Close Circuit (resume normal)
    └─ Failure → Open Circuit again (wait 60 seconds)
```

---

## 8. Integration Testing

### 8.1 Test Scenarios

**Functional Testing:**

```
☐ Screen pop displays correct customer information
☐ Click-to-dial initiates call successfully
☐ Activity logging creates records in CRM
☐ Webhook delivers events within SLA (< 5 seconds)
☐ API authentication and token refresh works
☐ Error handling gracefully degrades
☐ Data validation prevents invalid payloads
```

**Performance Testing:**

```
Load Test Parameters:
├─ API calls: 100 requests/second
├─ Duration: 1 hour
├─ Expected latency: < 500ms (95th percentile)
└─ Success rate: > 99.5%

Monitoring:
├─ Response time distribution
├─ Error rate
├─ Throughput
└─ Resource utilization
```

### 8.2 Integration Runbook

**Troubleshooting Guide:**

| Issue | Possible Cause | Resolution |
|-------|----------------|------------|
| Screen pop not appearing | Authentication expired | Refresh OAuth token |
| API timeout | Network latency | Check firewall, increase timeout |
| Webhook not received | Firewall blocking | Whitelist Webex IPs |
| Data sync failure | Invalid field mapping | Validate field mappings |
| Duplicate records created | Idempotency missing | Implement deduplication logic |

---

## Validation Checklist

Before go-live:

- [ ] All integration endpoints tested and validated
- [ ] Authentication credentials secured in vault
- [ ] Error handling and retry logic implemented
- [ ] Monitoring and alerting configured
- [ ] Security review completed
- [ ] Performance testing passed
- [ ] Runbook and troubleshooting guide documented
- [ ] Stakeholder signoff obtained


