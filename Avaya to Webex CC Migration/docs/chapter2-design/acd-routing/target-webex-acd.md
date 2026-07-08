# Target Webex ACD Configuration

## Overview

This document defines the target state Webex Contact Center ACD routing design, including queue architecture, skills framework, routing strategies, and enhanced capabilities that go beyond the current Avaya implementation.

---

## Webex Contact Center Platform

### Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│      WEBEX CONTACT CENTER (Cloud Platform)          │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌────────────────────────────────────────────┐    │
│  │         Control Hub (Administration)       │    │
│  │  • User Management  • Configuration        │    │
│  │  • Reporting        • Integrations         │    │
│  └──────────────────┬─────────────────────────┘    │
│                     │                               │
│  ┌──────────────────▼─────────────────────────┐    │
│  │       Contact Center Core Engine           │    │
│  │  ┌──────────────┐  ┌────────────────────┐ │    │
│  │  │   Entry      │  │  Routing Engine    │ │    │
│  │  │   Points     │  │  (Skills-Based)    │ │    │
│  │  └──────────────┘  └────────────────────┘ │    │
│  │  ┌──────────────┐  ┌────────────────────┐ │    │
│  │  │   Queues     │  │  Flow Designer     │ │    │
│  │  └──────────────┘  └────────────────────┘ │    │
│  └────────────────────────────────────────────┘    │
│                                                     │
│  ┌────────────────────────────────────────────┐    │
│  │       Agent Desktop (Browser-Based)        │    │
│  │  • Unified Interface  • Multi-channel      │    │
│  │  • CRM Integration    • Real-time Stats    │    │
│  └────────────────────────────────────────────┘    │
│                                                     │
│  ┌────────────────────────────────────────────┐    │
│  │      Webex Analyzer (Reporting)            │    │
│  │  • Real-time Dashboards                    │    │
│  │  • Historical Reports                      │    │
│  │  • Custom Analytics                        │    │
│  └────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

## Entry Points Design

### Entry Point Configuration

**Entry Point = VDN Equivalent in Webex**

| Entry Point Name | Channel | DNIS | Routing Destination | Business Hours |
|------------------|---------|------|---------------------|----------------|
| EP_Sales_Main_TF | Voice | +18005550100 | Flow: Sales_Main_Flow | 8 AM - 8 PM ET |
| EP_Sales_Spanish | Voice | +18005550150 | Queue: Sales_Spanish_Queue | 8 AM - 8 PM ET |
| EP_Support_Tech | Voice | +18005550200 | Flow: Support_Tech_Flow | 24/7 |
| EP_Billing | Voice | +18005550300 | Flow: Billing_Flow | 8 AM - 8 PM ET |
| EP_VIP_Support | Voice | +18005550500 | Queue: VIP_Queue | 24/7 |
| EP_General | Voice | +18005550900 | Flow: General_IVR_Flow | 8 AM - 8 PM ET |
| EP_Chat_Sales | Chat | (Web widget) | Flow: Sales_Chat_Flow | 24/7 |
| EP_Email_Support | Email | support@company.com | Queue: Email_Support_Queue | 24/7 |

### Entry Point Configuration Example (JSON)

```json
{
  "entryPointId": "EP_Sales_Main_TF",
  "name": "Sales Main Toll-Free",
  "channel": "voice",
  "dnis": ["+18005550100"],
  "routing": {
    "type": "flow",
    "flowId": "flow-sales-main-001"
  },
  "businessHours": {
    "timezone": "America/New_York",
    "schedule": {
      "monday": {"open": "08:00", "close": "20:00"},
      "tuesday": {"open": "08:00", "close": "20:00"},
      "wednesday": {"open": "08:00", "close": "20:00"},
      "thursday": {"open": "08:00", "close": "20:00"},
      "friday": {"open": "08:00", "close": "20:00"},
      "saturday": "closed",
      "sunday": "closed"
    },
    "holidays": ["2024-12-25", "2024-01-01"],
    "afterHoursFlow": "flow-after-hours-001"
  },
  "settings": {
    "recordingEnabled": true,
    "whisperEnabled": true,
    "cadVariables": {
      "entryPointName": "Sales Main",
      "businessUnit": "Sales"
    }
  }
}
```

---

## Queue Architecture

### Queue Hierarchy

```
SALES ORGANIZATION
├─ Sales_Main_Queue
│   ├─ Service Level: 80/20
│   ├─ Priority: Normal
│   └─ Routing: Skills-based
│
├─ Sales_New_Business_Queue
│   ├─ Service Level: 80/20
│   ├─ Priority: Normal
│   └─ Skills: Sales_New_Business (min 5)
│
├─ Sales_Account_Management_Queue
│   ├─ Service Level: 80/20
│   ├─ Priority: Normal
│   └─ Skills: Sales_Account_Management (min 5)
│
└─ Sales_Spanish_Queue
    ├─ Service Level: 80/20
    ├─ Priority: High
    └─ Skills: Spanish (min 7), Sales (min 5)

SUPPORT ORGANIZATION
├─ Support_Tech_Tier1_Queue
│   ├─ Service Level: 80/20
│   ├─ Priority: Normal
│   ├─ Skills: Technical_Support (min 5)
│   └─ Overflow: Support_Tech_Tier2_Queue (after 3 min)
│
├─ Support_Tech_Tier2_Queue
│   ├─ Service Level: 85/30
│   ├─ Priority: Normal
│   └─ Skills: Technical_Support (min 8)
│
└─ Support_Spanish_Queue
    ├─ Service Level: 80/20
    ├─ Priority: High
    └─ Skills: Spanish (min 7), Technical_Support (min 5)

BILLING ORGANIZATION
├─ Billing_General_Queue
│   ├─ Service Level: 80/20
│   ├─ Priority: High
│   └─ Skills: Billing (min 5)
│
└─ Billing_Collections_Queue
    ├─ Service Level: 85/30
    ├─ Priority: High
    └─ Skills: Collections (min 7), Billing (min 5)

VIP ORGANIZATION
└─ VIP_Support_Queue
    ├─ Service Level: 90/15
    ├─ Priority: Highest
    ├─ Skills: VIP_Support (min 8)
    └─ Agent Selection: Best available across all skills
```

### Queue Configuration Example

```json
{
  "queueId": "queue-sales-new-business",
  "name": "Sales_New_Business_Queue",
  "description": "New business sales inquiries",
  "organization": "Sales",
  "settings": {
    "serviceLevel": {
      "threshold": 20,
      "target": 80
    },
    "maxWaitTime": 300,
    "routingType": "SKILLS_BASED",
    "requiredSkills": [
      {
        "skillId": "skill-sales-new",
        "minimumProficiency": 5
      }
    ],
    "priority": "normal",
    "distribution": {
      "algorithm": "longest_available",
      "multipleCallHandling": false
    },
    "treatments": {
      "welcomeMessage": "audio-sales-welcome-001",
      "comfortMessage": {
        "enabled": true,
        "interval": 60,
        "audioFileId": "audio-comfort-001"
      },
      "positionAnnouncement": {
        "enabled": true,
        "interval": 60
      },
      "estimatedWaitTime": {
        "enabled": true,
        "updateInterval": 30
      },
      "musicOnHold": "audio-moh-corporate-001"
    },
    "overflow": {
      "enabled": true,
      "conditions": [
        {
          "type": "wait_time",
          "threshold": 180,
          "action": {
            "type": "route_to_queue",
            "queueId": "queue-sales-general"
          }
        },
        {
          "type": "queue_depth",
          "threshold": 20,
          "action": {
            "type": "route_to_queue",
            "queueId": "queue-sales-overflow"
          }
        }
      ]
    },
    "callback": {
      "enabled": true,
      "offerThreshold": 120,
      "message": "audio-callback-offer-001"
    }
  }
}
```

---

## Skills Framework

### Skills Taxonomy

**Skill Categories:**

```
1. LANGUAGE SKILLS
   ├─ English
   ├─ Spanish
   ├─ French
   └─ Mandarin

2. PRODUCT KNOWLEDGE
   ├─ Product_A
   ├─ Product_B
   ├─ Product_C
   └─ Product_Suite

3. FUNCTIONAL SKILLS
   ├─ Sales_New_Business
   ├─ Sales_Account_Management
   ├─ Technical_Support_T1
   ├─ Technical_Support_T2
   ├─ Billing_General
   ├─ Billing_Collections
   └─ VIP_Support

4. CHANNEL SKILLS
   ├─ Voice
   ├─ Chat
   ├─ Email
   ├─ SMS
   └─ Social_Media

5. SPECIALIZED SKILLS
   ├─ Escalation_Handler
   ├─ Retention_Specialist
   ├─ Quality_Mentor
   └─ Training_Specialist
```

### Proficiency Scale

**Webex Uses 1-10 Scale (Simplified from Avaya's 1-16)**

```
Level 1-2:  Novice
            • Basic knowledge
            • Requires supervision
            • Training mode

Level 3-4:  Beginner
            • Can handle simple contacts
            • Occasional assistance needed
            • Building confidence

Level 5-6:  Competent
            • Handles most contacts independently
            • Standard proficiency
            • Meets performance targets

Level 7-8:  Proficient
            • Handles complex contacts
            • Above-average performance
            • Can mentor others

Level 9-10: Expert
            • Handles all contact types
            • Subject matter expert
            • Trains and mentors
```

### Skills Definition Examples

```json
[
  {
    "skillId": "skill-spanish",
    "name": "Spanish",
    "description": "Spanish language proficiency",
    "category": "language",
    "proficiencyLevels": {
      "1-2": "Basic conversational",
      "3-4": "Intermediate - can handle simple interactions",
      "5-6": "Fluent - handles most interactions",
      "7-8": "Advanced - handles complex interactions",
      "9-10": "Native/Near-native proficiency"
    }
  },
  {
    "skillId": "skill-technical-support",
    "name": "Technical_Support",
    "description": "Technical product support capability",
    "category": "functional",
    "proficiencyLevels": {
      "1-2": "Basic troubleshooting only",
      "3-4": "Can resolve common issues",
      "5-6": "Handles most technical issues",
      "7-8": "Advanced troubleshooting",
      "9-10": "Expert - complex issues, escalations"
    },
    "requiredCertification": "Tech_Support_Cert_001"
  },
  {
    "skillId": "skill-vip-support",
    "name": "VIP_Support",
    "description": "High-touch support for VIP customers",
    "category": "specialized",
    "prerequisites": [
      {
        "skillId": "skill-technical-support",
        "minimumProficiency": 7
      }
    ],
    "proficiencyLevels": {
      "8-10": "Qualified VIP support agent"
    }
  }
]
```

---

## Agent Profiles

### Agent Configuration Model

```json
{
  "agentId": "agent-12345",
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@company.com",
    "employeeId": "EMP-12345"
  },
  "contactCenter": {
    "site": "Site_US_East",
    "team": "Sales_Team_A",
    "supervisor": "supervisor-001",
    "agentProfileId": "profile-sales-agent"
  },
  "skills": [
    {
      "skillId": "skill-english",
      "proficiency": 10
    },
    {
      "skillId": "skill-spanish",
      "proficiency": 7
    },
    {
      "skillId": "skill-sales-new",
      "proficiency": 8
    },
    {
      "skillId": "skill-sales-account",
      "proficiency": 6
    },
    {
      "skillId": "skill-voice",
      "proficiency": 9
    },
    {
      "skillId": "skill-chat",
      "proficiency": 7
    },
    {
      "skillId": "skill-email",
      "proficiency": 8
    }
  ],
  "capacity": {
    "voice": {
      "maxConcurrent": 1
    },
    "chat": {
      "maxConcurrent": 3
    },
    "email": {
      "maxConcurrent": 5
    },
    "sms": {
      "maxConcurrent": 8
    }
  },
  "settings": {
    "autoAvailable": true,
    "wrapUpTime": 30,
    "auxiliaryCodes": ["AUX-001", "AUX-002", "AUX-003"],
    "defaultDesktopLayout": "layout-sales-standard"
  }
}
```

### Skills Matrix (Target State)

| Agent | English | Spanish | Sales_New | Sales_Acct | Tech_Supp | Billing | Voice | Chat | Email |
|-------|---------|---------|-----------|------------|-----------|---------|-------|------|-------|
| Agent_001 | 10 | 7 | 8 | 6 | - | - | 9 | 7 | 8 |
| Agent_002 | 10 | - | 5 | 9 | - | - | 10 | 6 | 7 |
| Agent_003 | 10 | 10 | 7 | 6 | - | - | 8 | 9 | 8 |
| Agent_004 | 10 | 8 | - | - | 7 | 5 | 9 | 7 | 6 |
| Agent_005 | 10 | - | - | - | 9 | - | 10 | 8 | 9 |
| Agent_006 | 10 | 9 | - | - | 6 | 8 | 9 | 6 | 8 |
| VIP_001 | 10 | 7 | 9 | 9 | 9 | 8 | 10 | 9 | 9 |

---

## Routing Strategies

### 1. Skills-Based Routing with Proficiency

**Algorithm:**

```
For each contact in queue:
  1. Identify required skills
  2. Find agents with ALL required skills at minimum proficiency
  3. Calculate agent score:
     Score = (Σ skill_proficiency × skill_weight) + idle_time_bonus
  4. Route to agent with highest score and state = Available
```

**Example Calculation:**

```
Contact Requirements:
├─ Spanish: minimum 7 (weight: 40%)
└─ Sales: minimum 5 (weight: 60%)

Available Agents:
├─ Agent A: Spanish(9), Sales(6), Idle(120s)
│   Score = (9×0.4) + (6×0.6) + (120×0.001) = 7.32
│
├─ Agent B: Spanish(8), Sales(8), Idle(300s)
│   Score = (8×0.4) + (8×0.6) + (300×0.001) = 8.30 ← Selected
│
└─ Agent C: Spanish(10), Sales(5), Idle(60s)
    Score = (10×0.4) + (5×0.6) + (60×0.001) = 7.06

Result: Route to Agent B (highest score)
```

### 2. Longest Available Agent (LAA)

**Algorithm:**

```
For each contact:
  1. Find all agents matching skill requirements
  2. Filter agents where state = Available
  3. Sort by idle time (descending)
  4. Route to agent with longest idle time
```

**Purpose:**
- Ensures fair distribution of contacts
- Prevents agent "cherry-picking"
- Standard for most queues

### 3. Priority-Based Routing

**Priority Levels:**

```
Priority 1 (Highest): 
├─ VIP customers
├─ Escalations
└─ Regulatory callbacks

Priority 2 (High):
├─ Billing/payment issues
├─ Aged contacts (>5 min wait)
└─ Callbacks

Priority 3 (Normal):
├─ Standard contacts
└─ General inquiries

Priority 4 (Low):
├─ Internal contacts
└─ Training scenarios
```

**Routing Logic:**

```
Queue Processing:
1. Sort all waiting contacts by priority (descending)
2. Within same priority, sort by wait time (descending)
3. Process highest priority contact first
4. If agent available, route immediately
5. If no agent, continue to next contact in priority order
```

---

## Enhanced Capabilities

### 1. Dynamic Skill Adjustment

**API-Driven Skill Updates:**

```javascript
// Real-time skill update via API
const updateAgentSkills = async (agentId, skills) => {
  const response = await fetch(
    `https://api.wxcc-us1.cisco.com/v1/agents/${agentId}/skills`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        skills: [
          {
            skillId: 'skill-sales-new',
            proficiency: 7,
            effective: 'immediate'
          }
        ]
      })
    }
  );
  
  return response.json();
};

// Use Case: Temporarily boost skills during peak
boostSkillsDuringPeak('sales-team-a', 'skill-sales-account', +1);
```

### 2. Intelligent Overflow

**Conditions and Actions:**

```
Overflow Scenario 1: High Wait Time
IF average_wait_time > 3_minutes
THEN route_next_5_contacts_to(overflow_queue)

Overflow Scenario 2: Queue Depth
IF contacts_waiting > 20
THEN route_to(backup_queue)

Overflow Scenario 3: No Agents Available
IF available_agents = 0 
AND time_since_last_available > 2_minutes
THEN offer_callback() OR route_to(voicemail)

Overflow Scenario 4: Service Level Risk
IF current_service_level < 70%
AND time_until_sla_breach < 5_minutes
THEN alert_supervisor() AND enable_emergency_routing()
```

### 3. Callback Orchestration

**Callback Flow:**

```
[Customer in Queue]
      │
      ├─ Wait Time > 2 minutes
      ▼
[Offer Callback]
"Press 1 to receive a callback"
      │
      ├─ Customer Presses 1
      ▼
[Collect Callback Number]
"Please enter your callback number"
      │
      ▼
[Confirm Number]
"We'll call you at ${number}. Press 1 to confirm"
      │
      ▼
[Schedule Callback]
├─ Preserve queue position
├─ Set callback priority: High
├─ Estimated callback time: ${EWT}
└─ Disconnect customer
      │
[When Agent Available]
      │
      ▼
[Dial Customer]
├─ If answer: Connect to agent
├─ If no answer: Retry (max 3 attempts)
└─ If callback fails: Create task for manual follow-up
```

### 4. Advanced Analytics

**Real-Time Metrics:**

```
Dashboard Metrics (Auto-refresh every 5 seconds):
├─ Contacts in queue (by priority)
├─ Longest waiting contact (time + priority)
├─ Available agents (by skill)
├─ Current service level (% and trend)
├─ Predicted wait time (ML-based)
└─ Agent occupancy rate

Alerting Thresholds:
├─ Service level < 75% → Alert supervisor
├─ Contacts waiting > 15 → Alert manager
├─ No agents available > 5 min → Escalate
└─ Abandonment spike > 10% → Emergency response
```

### 5. Omnichannel Blending

**Unified Routing:**

```
Agent Capacity Configuration:
Agent: john.doe@company.com
├─ Voice: 1 concurrent
├─ Chat: 3 concurrent
├─ Email: 5 concurrent
└─ SMS: 8 concurrent

Routing Logic:
IF agent.voice_active = 0
AND agent.chat_active < 3
AND agent.email_active < 5
THEN agent.available_for = [voice, chat, email, sms]

IF agent.voice_active = 1
THEN agent.available_for = [email, sms]  // No voice/chat when on call

Workload Balancing:
Total_Utilization = (Voice×1.0) + (Chat×0.3) + (Email×0.2) + (SMS×0.1)
Target: Total_Utilization = 80-90%
```

---

## Migration Mapping

### Avaya to Webex Translation

| Avaya Component | Webex Equivalent | Notes |
|-----------------|------------------|-------|
| VDN | Entry Point | Direct mapping |
| Vector | Flow (Flow Designer) | Logic must be rebuilt |
| Skill | Skill | Similar concept, 1-10 scale |
| Hunt Group | Queue | Simplified structure |
| Agent | Agent Profile | Enhanced with multi-channel |
| CMS Report | Analyzer Report | Real-time capability |

### Configuration Conversion Example

**Avaya Vector 10 → Webex Flow:**

```
Avaya Vector:
01  wait-time 2 secs hearing ringback
02  collect digits after announcement 2000
03  goto step 7 if digits = 1
04  goto step 8 if digits = 2
05  goto step 9 if digits = 0
07  queue-to skill 10 pri m
08  queue-to skill 11 pri m
09  route-to number 5100

Webex Flow Designer:
[Start]
   │
   ▼
[Play Message: "announcement_2000"]
"Press 1 for New Sales, 2 for Account Management, 0 for Operator"
   │
   ▼
[Menu Node]
   ├─ Option 1 → [Queue Contact: Sales_New_Queue]
   ├─ Option 2 → [Queue Contact: Sales_Account_Queue]
   └─ Option 0 → [Queue Contact: Operator_Queue]
```

---

## Performance Targets

### Service Level Objectives

| Queue | Current (Avaya) | Target (Webex) | Improvement |
|-------|-----------------|----------------|-------------|
| Sales_New | 76% in 20s | 85% in 20s | +9% |
| Sales_Account | 82% in 20s | 88% in 20s | +6% |
| Support_T1 | 72% in 20s | 82% in 20s | +10% |
| Support_T2 | 85% in 20s | 90% in 30s | +5% |
| Billing | 79% in 20s | 85% in 20s | +6% |
| VIP | 94% in 15s | 95% in 15s | +1% |

### Expected Improvements

```
Key Metrics Improvement:
├─ Average Speed of Answer: -30% (48s → 34s)
├─ Abandonment Rate: -40% (8% → 4.8%)
├─ First Call Resolution: +11% (72% → 80%)
├─ Agent Utilization: +9% (75% → 82%)
└─ Customer Satisfaction: +25% (3.2 → 4.0)

Business Impact:
├─ Reduced operational costs: 15-20%
├─ Improved customer retention: 8-12%
├─ Increased agent productivity: 10-15%
└─ Faster time-to-resolution: 20-25%
```


